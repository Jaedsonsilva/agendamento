function respond(res,status,v){res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.status(status).json(v)}
export default async function handler(req,res){
 const path=(req.url||'').split('?')[0].replace(/^\/api\/?/,'');const config=!!(process.env.SUPABASE_URL&&process.env.SUPABASE_PUBLISHABLE_KEY);
 const waReady=!!(process.env.EVOLUTION_API_URL&&process.env.EVOLUTION_API_KEY&&process.env.EVOLUTION_INSTANCE);
 if(path==='health')return respond(res,200,{ok:true,site:'AVA Reserva',databaseConfigured:config,whatsappConfigured:waReady});
 if(!config)return respond(res,path==='catalog'?200:503,path==='catalog'?{ready:false,schools:[],spaces:[],equipment:[]}:{error:'Banco Supabase ainda não conectado'});
 const base=process.env.SUPABASE_URL.replace(/\/$/,'');const key=process.env.SUPABASE_PUBLISHABLE_KEY;
 async function rpc(name,payload={}){
  const response=await fetch(base+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(12000)});
  const json=await response.json().catch(()=>({}));
  if(!response.ok)throw Error('Erro '+response.status+' na consulta ao Supabase');
  return json;
 }
 try{
  if(path==='catalog'&&req.method==='GET'){const data=await rpc('ava_reserva_catalogo');return respond(res,200,{ready:true,schools:data.schools||[],spaces:data.spaces||[],equipment:data.equipment||[]});}
  if(path==='book'&&req.method==='POST'){
   const b=req.body||{};if(!b||Array.isArray(b)||JSON.stringify(b).length>8000)return respond(res,400,{error:'Dados inválidos'});
   if(!/^[0-9a-f-]{36}$/i.test(b.school_id||'')||typeof b.name!=='string'||!/^\+[1-9]\d{9,14}$/.test(b.phone||'')||b.consent!==true||typeof b.date!=='string'||!/^\d\d:\d\d$/.test(b.start||'')||!/^\d\d:\d\d$/.test(b.end||''))return respond(res,400,{error:'Preencha nome, WhatsApp com DDI, consentimento, escola e horários'});
   const data=await rpc('ava_reserva_criar_whatsapp',{p_school_id:b.school_id,p_name:b.name,p_phone:b.phone,p_consent:true,p_date:b.date,p_start:b.start,p_end:b.end,p_space_id:b.space_id||null,p_items:Array.isArray(b.items)?b.items:[],p_purpose:typeof b.purpose==='string'?b.purpose:''});
   if(data.error)return respond(res,400,data);
   data.whatsap   // O agendamento é salvo antes da tentativa de notificação.
   data.whatsapp_status='Aguardando configuração do gateway Evolution API';
   if(waReady&&data.protocol){
     const catalog=await rpc('ava_reserva_catalogo').catch(()=>({schools:[]}));
     const school=Array.isArray(catalog.schools)?catalog.schools.find(s=>s.id===b.school_id)?.nome:'';
     const title=school||'Escola';
     const when=b.date+' '+b.start+'–'+b.end;
     const send=async(phone,message)=>{
       const baseUrl=process.env.EVOLUTION_API_URL.replace(/\/$/,'');
       if(!/^https:\/\/[^/\s]+/.test(baseUrl))throw Error('A Evolution API exige endereço HTTPS');
       const response=await fetch(baseUrl+'/message/sendText/'+encodeURIComponent(process.env.EVOLUTION_INSTANCE),{
         method:'POST',headers:{apikey:process.env.EVOLUTION_API_KEY,'content-type':'application/json'},
         body:JSON.stringify({number:phone.slice(1),text:message}),signal:AbortSignal.timeout(8000)});
       if(!response.ok)throw Error('Evolution HTTP '+response.status);
     };
     const clientText='*AVA Reserva*\n'+title+'\nProtocolo: '+data.protocol+'\nSituação: '+data.status+'\nData: '+when;
     try{
       await send(b.phone,clientText);
       data.whatsapp_status='Mensagem aceita pelo gateway (entrega ainda não confirmada)';
     }catch(error){
       console.error('Evolution requester send failure',error?.message);
       data.whatsapp_status='Reserva registrada; envio WhatsApp não confirmado';
     }
     const admins=[process.env.WHATSAPP_ADMIN_1,process.env.WHATSAPP_ADMIN_2,process.env.WHATSAPP_ADMIN_3]
      .filter(n=>n&&/^\+[1-9]\d{9,14}$/.test(n)).filter((n,i,a)=>a.indexOf(n)===i);
     if(admins.length){
       const note='*AVA Reserva — agendamento registrado*\n'+title+'\nSolicitante: '+b.name+
        '\nProtocolo: '+data.protocol+'\nSituação: '+data.status+'\nData: '+when;
       const results=await Promise.allSettled(admins.map(n=>send(n,note)));
       data.avisos_responsaveis_aceitos=results.filter(x=>x.status==='fulfilled').length;
     }
   }
nd(res,200,data);
  }
  if(path==='track'&&req.method==='GET'){
   const u=new URL(req.url,'https://example.com'),protocol=u.searchParams.get('protocol')||'',phone=u.searchParams.get('phone')||'';
   if(protocol.length>90||phone.length>20)return respond(res,400,{error:'Dados inválidos'});
   const data=await rpc('ava_reserva_consultar_whatsapp',{p_protocolo:protocol,p_phone:phone});return respond(res,data.error?404:200,data);
  }
  return respond(res,404,{error:'Rota não encontrada'});
 }catch(e){console.error('AVA API',e?.message);return respond(res,503,{error:'Serviço temporariamente indisponível; nenhuma reserva foi confirmada.'});}
}