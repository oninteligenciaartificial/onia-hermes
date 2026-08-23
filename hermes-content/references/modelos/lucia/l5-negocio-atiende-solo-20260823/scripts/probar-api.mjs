const HOST='https://onia-chatbot-chatwoot.hqdqgh.easypanel.host';
const TOK=process.argv[2], CONV=process.argv[3]||'31', MSG=process.argv[4]||'Hola';
const H={'api_access_token':TOK,'Content-Type':'application/json'};
const list=async()=>{const r=await fetch(`${HOST}/api/v1/accounts/2/conversations/${CONV}/messages`,{headers:H});
  const j=await r.json(); return (j.payload||j).map(m=>'['+m.message_type+'] '+String(m.content).slice(0,110));};
console.log('== ANTES ==\n'+(await list()).join('\n'));
const r=await fetch(`${HOST}/api/v1/accounts/2/conversations/${CONV}/messages`,{method:'POST',headers:H,
  body:JSON.stringify({content:MSG,message_type:'incoming'})});
console.log('POST ->',r.status, (await r.text()).slice(0,300));
await new Promise(s=>setTimeout(s,25000));
console.log('== DESPUES (25s) ==\n'+(await list()).join('\n'));
