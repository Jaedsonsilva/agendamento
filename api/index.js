function respond(res,status,v){res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.status(status).json(v)}
export default async function handler(req,res){
 const path=(req.url||'').split('?')[0].replace(/^\/api\/?/,'');const config=!!(process.env.SUPABASE_URL&&process.env.SUPABASE_PUBLISHABLE_KEY);
 const waReady=!!(process.env.WHATSAPP_ACCESS_TOKEN&&process.env.WHATSAPP_PHONE_NUMBER_ID&&process.env.WHATSAPP_TEMPLATE_NAME);
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
   data.whatsapp_status='Pendente: API oficial do WhatsApp não configurada';
   if(waReady&&data.protocol){
    try{
     const version=process.env.WHATSAPP_GRAPH_API_VERSION||'v24.0';
     const uri='https://graph.facebook.com/'+version+'/'+encodeURIComponent(process.env.WHATSAPP_PHONE_NUMBER_ID)+'/messages';
     const response=await fetch(uri,{method:'POST',headers:{authorization:'Bearer '+process.env.WHATSAPP_ACCESS_TOKEN,'content-type':'application/json'},body:JSON.stringify({messaging_product:'whatsapp',to:b.phone.slice(1),type:'template',template:{name:process.env.WHATSAPP_TEMPLATE_NAME,language:{code:process.env.WHATSAPP_TEMPLATE_LANGUAGE||'pt_BR'},components:[{type:'body',parameters:[{type:'text',text:data.protocol},{type:'text',text:data.status}]}]}}),signal:AbortSignal.timeout(12000)});
     if(response.ok){data.whatsapp_status='Mensagem aceita pela API; entrega ainda não confirmada'}else{console.error('WhatsApp provider status',response.status);data.whatsapp_status='Reserva registrada; envio WhatsApp não confirmado'}
    }catch(error){console.error('WhatsApp send failed',error?.message);data.whatsapp_status='Reserva registrada; envio WhatsApp não confirmado'}
   }
   return respond(res,200,data);
  }
  if(path==='track'&&req.method==='GET'){
   const u=new URL(req.url,'https://example.com'),protocol=u.searchParams.get('protocol')||'',phone=u.searchParams.get('phone')||'';
   if(protocol.length>90||phone.length>20)return respond(res,400,{error:'Dados inválidos'});
   const data=await rpc('ava_reserva_consultar_whatsapp',{p_protocolo:protocol,p_phone:phone});return respond(res,data.error?404:200,data);
  }
  return respond(res,404,{error:'Rota não encontrada'});
 }catch(e){console.error('AVA API',e?.message);return respond(res,503,{error:'Serviço temporariamente indisponível; nenhuma reserva foi confirmada.'});}
}