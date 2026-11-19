function respond(res,status,value){res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');return res.status(status).json(value)}
export default async function handler(req,res){
 const path=(req.url||'').split('?')[0].replace(/^\/api\/?/,'');
 const config=!!(process.env.SUPABASE_URL&&process.env.SUPABASE_PUBLISHABLE_KEY);
 if(path==='health')return respond(res,200,{ok:true,site:'AVA Reserva',databaseConfigured:config});
 if(!config)return respond(res,path==='catalog'?200:503,path==='catalog'?{ready:false,schools:[],spaces:[],equipment:[]}:{error:'Banco Supabase ainda não conectado'});
 const base=process.env.SUPABASE_URL.replace(/\/$/,'');
 const key=process.env.SUPABASE_PUBLISHABLE_KEY;
 async function rpc(name,payload={}){
  const response=await fetch(base+'/rest/v1/rpc/'+name,{method:'POST',headers:{apikey:key,'content-type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(12000)});
  const json=await response.json().catch(()=>({}));
  if(!response.ok)throw new Error('Erro '+response.status+' na consulta ao Supabase');
  return json;
 }
 try{
  if(path==='catalog'&&req.method==='GET'){const data=await rpc('ava_reserva_catalogo');return respond(res,200,{ready:true,schools:data.schools||[],spaces:data.spaces||[],equipment:data.equipment||[]});}
  if(path==='book'&&req.method==='POST'){
   const b=req.body||{};if(!b||Array.isArray(b)||JSON.stringify(b).length>8000)return respond(res,400,{error:'Dados inválidos'});
   if(!/^[0-9a-f-]{36}$/i.test(b.school_id||'')||typeof b.name!=='string'||typeof b.email!=='string'||typeof b.date!=='string'||!/^\d\d:\d\d$/.test(b.start||'')||!/^\d\d:\d\d$/.test(b.end||''))return respond(res,400,{error:'Preencha os campos obrigatórios'});
   const data=await rpc('ava_reserva_criar',{p_school_id:b.school_id,p_name:b.name,p_email:b.email,p_date:b.date,p_start:b.start,p_end:b.end,p_space_id:b.space_id||null,p_items:Array.isArray(b.items)?b.items:[],p_purpose:typeof b.purpose==='string'?b.purpose:''});
   return respond(res,data.error?400:200,data);
  }
  if(path==='track'&&req.method==='GET'){
   const u=new URL(req.url,'https://example.com');const protocol=u.searchParams.get('protocol')||'',email=u.searchParams.get('email')||'';
   if(protocol.length>90||email.length>260)return respond(res,400,{error:'Dados inválidos'});
   const data=await rpc('ava_reserva_consultar',{p_protocolo:protocol,p_email:email});
   return respond(res,data.error?404:200,data);
  }
  return respond(res,404,{error:'Rota não encontrada'});
 }catch(e){console.error('AVA API',e?.message);return respond(res,503,{error:'Serviço temporariamente indisponível; nenhuma reserva foi confirmada.'});}
}