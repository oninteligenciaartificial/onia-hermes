'use strict';
const fs = require('node:fs');
const path = require('node:path');
const out = path.join(__dirname, 'demos-samuel');
fs.mkdirSync(out, { recursive: true });
const node = (id,name,type,version,position,parameters) => ({id,name,type:`n8n-nodes-base.${type}`,typeVersion:version,position,parameters});
const horario = node('horario','Cada dia a las 09:00','scheduleTrigger',1.2,[300,300],{rule:{interval:[{field:'days',daysInterval:1,triggerAtHour:9,triggerAtMinute:0}]}});
const mensaje = node('mensaje','Enviar recordatorio','telegram',1.2,[620,300],{resource:'message',operation:'sendMessage',chatId:'TU_CHAT_ID',text:'Buenos dias. Revisa tus pendientes y define la tarea mas importante de hoy.',additionalFields:{appendAttribution:false}});
const monitor = node('monitor','Revisar mi web','httpRequest',4.2,[560,300],{url:'https://example.com',options:{response:{response:{fullResponse:true,neverError:true,responseFormat:'text'}},timeout:10000}});
monitor.onError='continueRegularOutput';
const condicion=node('condicion','La web tiene un problema','if',2.2,[820,300],{conditions:{options:{caseSensitive:true,leftValue:'',typeValidation:'strict',version:2},conditions:[{id:'fallo',leftValue:'={{ !!$json.error || Number($json.statusCode) >= 400 }}',rightValue:true,operator:{type:'boolean',operation:'true',singleValue:true}}],combinator:'and'},options:{}});
const aviso=node('aviso','Avisarme por Telegram','telegram',1.2,[1100,230],{resource:'message',operation:'sendMessage',chatId:'TU_CHAT_ID',text:'Alerta: mi web no responde correctamente. Revisa el servicio.',additionalFields:{appendAttribution:false}});
const connection = name => ({node:name,type:'main',index:0});
const files=[
 ['01-mensaje-programado.json',{name:'Samuel - 01 - Mensaje programado (demo)',nodes:[horario,mensaje],connections:{[horario.name]:{main:[[connection(mensaje.name)]]}}}],
 ['02-monitor-y-alerta.json',{name:'Samuel - 02 - Monitor y alerta (demo)',nodes:[{...horario,name:'Revisar cada 5 minutos',parameters:{rule:{interval:[{field:'minutes',minutesInterval:5}]}}},monitor,condicion,aviso],connections:{'Revisar cada 5 minutos':{main:[[connection(monitor.name)]]},[monitor.name]:{main:[[connection(condicion.name)]]},[condicion.name]:{main:[[connection(aviso.name)],[]]}}}]
];
for(const [name,workflow] of files) fs.writeFileSync(path.join(out,name),JSON.stringify({...workflow,active:false,settings:{timezone:'America/La_Paz',executionOrder:'v1'},pinData:{},tags:[]},null,2)+'\n');
console.log(files.map(([name])=>path.join(out,name)).join('\n'));
