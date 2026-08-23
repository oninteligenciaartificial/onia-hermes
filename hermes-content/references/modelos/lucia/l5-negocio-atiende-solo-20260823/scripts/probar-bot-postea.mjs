// Prueba exacta de lo que fallaba: el usuario BOT posteando en el inbox 4.
// Antes del fix de membresia esto daba 401. Se borra el mensaje al terminar.
const HOST='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const BOT=process.argv[2], CONV=process.argv[3]||'31';
const H={'api_access_token':BOT,'Content-Type':'application/json'};
const r=await fetch(`${HOST}/api/v1/accounts/2/conversations/${CONV}/messages`,{method:'POST',headers:H,
  body:JSON.stringify({content:'[prueba tecnica de conectividad del motor]',message_type:'outgoing'})});
const body=await r.text();
console.log('POST como BOT ->',r.status, body.slice(0,200));
if (r.ok) {
  const id=JSON.parse(body).id;
  const d=await fetch(`${HOST}/api/v1/accounts/2/conversations/${CONV}/messages/${id}`,{method:'DELETE',headers:H});
  console.log('DELETE del mensaje de prueba ->', d.status);
}
