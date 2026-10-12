# QA supervisor cloud — solo lectura

12-oct-2026. Agente real /root/qa_independiente. Modelo solicitado/configurable gpt-6.1-sol (Sol6.1), modelo servido no observable. Contrato: verificar evidencias existentes de supervisor, acceso cross-thread, scheduler, independencia laptop y cero gasto. Sin ejecutar otro frente ni cloud_architecture.

## Gate real

| Requisito | Evidencia observable | Estado |
|---|---|---|
| Herramienta inventario automations | schemas list({}) y peek({}) disponibles | Visible |
| Acceso lectura inventario | automations_peek({}) ejecutado; isError=false, mensaje Found 0 automations, automations=[], cursor=null, paused_count=0, completed_count=0 | Lectura probada para alcance herramienta |
| Identidad autenticada concreta | Respuesta peek no devuelve cuenta/principal/tenant | No observable; no atribuir a cuenta específica |
| Consulta cinco workers Codex | No herramienta Codex list_threads/read_thread/status cross-thread identificada; colaboración solo árbol actual | Bloqueado |
| IDs workers vivos comprobados | No se consultaron cinco workers; IDs de handoff son históricos | No validado |
| Scheduler remoto aplicable al supervisor | Peek responde inventario vacío; no demuestra capacidad ejecutar supervisor o visitar workers | No validado |
| Cero coste creación/ejecución | schemas lectura no ofrecen precio/cupo ni confirmación cero gasto | No validado |
| Independencia laptop | No ejecución cloud disparada y completada con laptop apagada; catálogo no la demuestra | No validado |
| Ejecución única preparada | No archivo disponible aún en /workspace/work/supervisor-readonly al primer intento rg, exit2 directory missing; revisión pendiente del agente fuentes_relevo | Pendiente |
| Sin cambios scheduler | No create/update/run_now ni cron/loop/nuevo worker ejecutado por QA | Cumplido |

## Consulta exacta

Tool mcp__codex_apps__automations_peek, args {}. Respuesta exit lógico éxito isError=false; structuredContent anidado message Found 0 automations. El catálogo indica peek para lookup privado y list solo para mostrar tareas por pedido; se eligió peek para auditoría. No se ejecutó list redundante.

Inventario vacío tiene alcance del endpoint y actor de esta tarea. No prueba ausencia global de schedulers, workflows GitHub, cron VPS o loops históricos; no se confunden estos servicios.

Collaboration ofrece agentes del árbol activo, no APIs cinco workers durables Codex. Sites workers son ejecución de sitios, y herramientas Notion/mail/GitHub con threads no son workers Codex. No usar capacidades de otro producto para declarar gate cumplido.

## Decisión

**No autorizado técnicamente para crear/run supervisor:** faltan consulta de cinco workers, identidad verificable, cero coste e independencia laptop. El contrato prohíbe create/run sin esas pruebas; no intentar ni ampliar infraestructura. Preparar/revisar documento de ejecución única cuando fuentes lo entregue no es ejecutarla. La recuperación de Work y QA E31/E32 continúan con sus bloqueos separados; este contrato no los reemplaza.

Sin instalaciones, VPS, crons, deploy, loops, workers nuevos, gastos, secretos, cookies ni subdelegación. Archivo durable workspace; no afirmar publicación remota.

## Delta de autorización — piloto único turno existente

Madre autorizó UNA ejecución en turno cloud existente; tokens existentes admitidos, sin afirmar costo total0. Esto supera el veto de ejecutar esa prueba única; conserva prohibición scheduler recurrente/cron/nuevos workers/VPS/main. QA no duplica ejecución.

Revisado JSON /workspace/work/supervisor-pilot/supervisor-one-shot.json y fuente probe.py. UTC registrado 2026-10-12T19:04:52.437366+00:00; execution_kind existing_cloud_turn_on_demand, scheduler_dispatch false. Cinco lanes presentes; cuatro IDs declarados por madre y Hermes null. Los cinco live_state not_observable, cross_thread_capability capability_missing. turn_id not_observable, thread_id not_injected. Sin claim24/7 ni apagado físico ni disparo scheduler.

IDs declarados: Platform 01a12c7e-97e2-7115-8561-0b7658008003; Marca 01a13170-b488-71d9-83f8-12663d5a0013; Lucía 01a13171-0fdb-72c6-9fdc-81244d7e6006; Ventas 01a13171-6ac1-771e-b285-52e7284e203a. No observación live. Hermes ID del thread actual no inyectado; no reemplazar por histórico Work/otro chat.

Fuente probe usa solo stdlib datetime/json/pathlib/hashlib, genera UTC y escribe JSON; no lanza procesos/red/servicios ni programa scheduler. runtime_id y worker_agent_id están escritos como literales contractuales: no son descubrimiento por script. Cleanup ceros concuerda con fuente inspeccionada, no prueba ausencia global de servicios ajenos. Se pidió a autor explicitar procedencia y evidencia Hermes null. Esperando reporte/log del autor; esta inspección no es rerun ni test autónomo remoto.

## Cierre revisión independiente del piloto

Leído informe final supervisor-one-shot.md y JSON, sin ejecutar probe. SHA256 independientes coinciden con entrega autor:

- JSON 08052bcfba2ef0735ef170d20ec22361dbf1bc920b56056bb38045a752dedf38.
- Informe 324aa7f93e7a3ee27d3ca00564f530aa36b46612ec1eec936f41c1b76a8c6248.
- Fuente probe.py 812c6370d1d237142716c5792a689e97aabd16b202007c94eb6a66c4756d7b55.

Autor reporta python probe.py UNA ejecución exit0; QA verifica artefactos/fuente/hashes y coherencia, no presenció ni reejecutó comando histórico. Es recibo de ejecución en turno existente y preparación verificable, **no supervisor automático validado**. Informe admite costo tokens y no costo total0. Ausencia scheduler/cross-thread/PC apagada queda expresamente sin medir.

Observación menor: JSON evidencia Hermes reutiliza frase mother contract ID aunque declared_id=null; informe aclara threadID no inyectado. La lectura correcta es ID Hermes NO observable. runtime_id es metadato del contrato literal en script; evidencia de instancia debe provenir de environment_status, que autor reporta running/connected/current/enforced y QA inicial confirmó misma instancia en pending antes de arranque. No afirmar que script descubrió runtime ID.

Gate final: piloto documental/on-demand ACEPTADO en su alcance; supervisor recurrente 5workers/24x7 BLOQUEADO por API cross-thread autorizada ausente, scheduler aplicable sin ejecución comprobada, identidad/consumo sin validación y apagado físico laptop no medido. Ninguna creación/run automation ni loop realizado por QA. No repetir piloto ni trasladar a VPS/workflow excluido.

### Versión final anotada, sin rerun

Observación de procedencia corregida por autor. QA leyó anotaciones runtime_id_provenance y worker_agent_id_provenance, evidencia Hermes ID no inyectado y execution-log.txt (recibo autor exec_command chunk b3dee4, exit0; JSON inicial distinto conservado como referencia de ejecución). Anotaciones no alegan nuevo run.

Hashes finales que sustituyen JSON/md anteriores para entrega: JSON **3f28a920d9bc9af7b1c639c3eed87e02b7d91ee673b40fa62757bdbe644f517d**; MD **8c985f226350b492672add737509a4b567e31a6dbb881b97ea09c233a14d1be0**. Gate final permanece aceptado solo como ejecución única on-demand y bloqueado para supervisión automática. No hubo duplicación del piloto por QA.
