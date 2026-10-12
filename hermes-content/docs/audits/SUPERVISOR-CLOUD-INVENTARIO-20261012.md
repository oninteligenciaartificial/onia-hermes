# Supervisor cloud: inventario y QA — 12-oct-2026

META: comprobar supervisión de los cinco trabajadores Codex Cloud nativos con la PC apagada, sin gasto nuevo ni producción. PRUEBA DE HECHO: ejecución remota, lectura real de cinco estados y despertar remoto verificable. REGLA DE PARADA: capacidad ausente o consulta fallida; no instalar, contratar, mover secretos ni sustituir Codex por Work.

Hermes QA es dueño del piloto; este archivo conserva la revisión de arquitectura y el inventario de herramientas. No cambia continuidad, producto ni servicios.

## Resultado observado

| Gate | Resultado | Evidencia |
|---|---|---|
| Ejecutar código en runtime cloud existente | PASS, bajo demanda | `python /workspace/work/supervisor-pilot/probe.py`, exit 0; UTC 2026-10-12T19:04:52.437366+00:00 |
| Leer estados actuales de cinco trabajadores | BLOQUEADO | Runtime sin `read_thread`, `list_threads`, `wait_threads`; cinco estados `not_observable` |
| Despertar supervisor/trabajadores sin laptop | NO PROBADO | `scheduler_dispatch:false`; no scheduler creado ni despacho remoto autónomo |

Recibo inicial JSON SHA256: `3f28a920d9bc9af7b1c639c3eed87e02b7d91ee673b40fa62757bdbe644f517d`. Runtime declarado por observación de entorno: `ccarenv_b64_Y2NhcmVudl9jM2YzZjk3NTZkYmM4MTkxYTM3NTc0MDgwMTNiYTIzNQ`. Turno externo observable desde madre: `01a1317f-b0f1-7596-a524-f487219d4c04`; el runtime no inyectó su thread/turn ID. IDs suministrados por contrato no son lectura live. No se verificó físicamente apagar la laptop.

Hermes preservó recibo, fuente e informe con QA en rama privada `codex/supervisor-pilot-20261012`, commit `3ff6b10cf76a09e1c7ad808865dea043ced39a28`, carpeta `hermes-content/docs/handoff/supervisor-pilot-20261012/`. El addendum CLI posterior seguía en conservación al escribir esta revisión.

## Inventario verificado

- Herramientas app de madre local permiten inspeccionar chats; no se heredan automáticamente al runtime cloud. `automation_update` declara ejecución local: no cumple PC apagada.
- n8n conectado: búsqueda `ONIA` devolvió 41 workflows; búsqueda `supervisor` y `sesion`, cero. Gateway administrado `available:false`. No se creó ni ejecutó workflow.
- `WF-SENTRY-01 - Sentry Codex Triage`, ID `wImYWwbHGVK5tvIA`, activo, siete nodos: webhook, normalización, condición, creación de issue GitHub, respuestas. Su nombre no demuestra API de chats Codex; no tiene puente probado de lectura/despertar.
- `ONIA - Disparador de Agentes (panel)`, ID `fek4OoxRlNfpD6GZ`, usa SSH/scripts del panel; no acredita control de estos UUID Codex nativos. Workflows activos de producción quedan fuera del piloto.
- Pages controller automation requiere Page/controlador y es otro producto. Sites schedule requiere Site publicado. Ninguno acredita supervisión nativa Codex; no fueron activados.
- `create_thread` expuesto ofrece local/worktree o `chatgptWorkCloud`; esta última opción fue rechazada por Sergio como sustituto. No se crearon trabajadores duplicados.

## Última alternativa CLI: resultado real

QA Hermes encontró `/opt/codex/bin/codex`. `codex --help` y `codex cloud list --help` salieron 0 y confirmaron `--json --limit 20`. La consulta salió 1: `http list_tasks failed, error sending request`. Repetida con permiso adicional de red soportado por el runtime cloud: mismo fallo. No se recibió HTTP status/body ni JSON de tareas. Esto no demuestra credencial faltante, login caducado o compatibilidad con los cinco UUID; no se inspeccionó authcache ni se inició login.

Evidencia remota: `/workspace/work/supervisor-readonly/output/qa-cli-alternativa.md`. La [referencia oficial de comandos](https://learn.chatgpt.com/docs/developer-commands) documenta `codex cloud list`; no equivale a demostrar que observe/controla estos chats nativos.

## Siguiente componente concreto

Falta una interfaz soportada y autenticada en runtime remoto que lea exactamente los cinco UUID y permita continuar/despertar sus turnos. n8n ya ofrece un lugar para scheduler, pero sin ese puente no puede cumplir el contrato. Primero resolver la consulta CLI y comprobar coincidencia de IDs sin copiar sesiones ni inventar endpoints; luego validar un único despertar remoto. No hace falta pedir aprobación genérica ni una nueva credencial sin diagnóstico.

No se provisionó servicio/API paga, instalaron dependencias o modificaron producción. Los turnos consumen cuota/tokens existentes: no se afirma costo total cero. No quedaron scheduler ni procesos de fondo nuevos; se conservan únicamente artefactos de auditoría. Resultado del supervisor autónomo: `capability_missing`, no operativo 24/7.

## Preservación local de esta revisión

El checkout aislado administrado `supervisor-inventory-20261012` falló por `No space left on device` (operación `71358c73-6a96-4fda-b296-76dccd4c86e4`). No se reintentó ni borró información. Este archivo único se guarda en el worktree de auditoría ya existente de la madre, rama `codex/cloud-pc-audit-20261011`; no se editó main ni archivos de continuidad compartidos.

## Addendum: destino bloqueado y ajuste oficial

Hermes completó el diagnóstico posterior y preservó transporte/QA en `ccc8a5d111065200ea323d3e57958e3946ce9879`, misma rama privada del piloto. Observó política HTTP restringida sin regla coincidente para `chatgpt.com`; el proxy rechazó CONNECT con 403 y el destino quedó HTTP 000. El fallo sucede antes de respuesta de aplicación; autenticación y TLS del destino no fueron alcanzados en ese sondeo. No se concluye token inválido ni se solicita una credencial nueva.

OpenAI Docs, [Cloud environments](https://learn.chatgpt.com/docs/environments/cloud-environments), verificado 12-oct: Settings > Codex Cloud > Environments > ONIA Hermes > menú … > Edit. En Internet access, mantener internet habilitado y el preset Package managers; añadir exclusivamente `chatgpt.com` en Additional allowed domains. Guardar y republicar el entorno. La documentación pide comprobar acceso en una tarea nueva; las existentes conservan su estado. No garantiza que el runtime vivo adopte el cambio de política. Permitir el destino no proporciona autenticación.

Esta sesión solo dispone de Chrome OnIA, sin IAB ni pestaña ChatGPT autenticada; no cambió ajustes ni abrió otro login. La madre dispone del IAB donde creó ONIA Hermes y recibió estos pasos documentados. No existe herramienta de edición de entornos Codex en el inventario local de MCP. No se editaron archivos internos de política, proxies ni endpoints privados.

Después del ajuste oficial, Hermes puede realizar una única consulta CLI autorizada y comparar los cinco UUID. Si su runtime conserva la política previa, debe comprobarse la adopción por la ruta oficial; no crear un sexto ejecutor sin resolver cómo preservar los existentes. La validación del scheduler sigue posterior a lectura real y continuidad de turnos. Este addendum deja el cambio preparado; no afirma ajuste aplicado ni autonomía.

## Addendum: piloto Alfred, lectura y envío separados — 20:19 UTC

La madre reportó evidencia UI del piloto explícitamente autorizado: Alfred `list/read` leyó los cinco UUID nativos existentes. ÚNICO envío al Hermes `01a13170-1c7e-7224-83c1-c5f369052039`, 12-oct-2026 20:19 UTC, devolvió `NOT_FOUND / CloudThreadNotFoundError`, sin `turnId`. Lectura posterior abrió el mismo chat y mostró último turno `01a131bf-c0e5-72f3-8818-feaa088d6f24` completed, sin canario `ALFRED-ONIA-20261012-A`. Esta revisión confirmó ese turno y la ausencia del canario en los items retornados por `read_thread` acotado. La ausencia de ACK no se trata como entrega; no se repitió el envío.

Gates actualizados: **lectura de cinco IDs desde Alfred PASS**; **envío al Hermes FAIL**; **adopción/wakeup/supervisor autónomo NO PROBADOS**. La capacidad de lectura de Alfred no demuestra herramientas equivalentes dentro del runtime de Hermes ni autoridad funcional de su ruta de escritura. El error no prueba que el UUID sea incorrecto, que falte login, que el chat haya sido borrado ni una regla interna específica de propiedad/host. No se inspeccionaron endpoints privados, authcache o secretos.

OpenAI Docs revisada y abierta:

- [Release 5–9 octubre](https://learn.chatgpt.com/docs/whats-new/dots-october-9-2026): anuncia follow-up de threads Codex existentes en general. Corrige cualquier afirmación absoluta de que el dot solo puede continuar chats creados por él.
- [Tasks and memory](https://learn.chatgpt.com/docs/dots/tasks-and-memory): detalla crear Codex cloud con equipo offline, continuar local en equipo conectado y seguir tareas creadas por el dot en su entorno original. No especifica resolución de UUID durable, adopción/importación de otros chats cloud ni remedio para `CloudThreadNotFoundError`.
- [Codex Cloud](https://learn.chatgpt.com/docs/cloud): permite continuar la conversación desde web/mobile/desktop y solicitar cambios posteriores. Es alternativa soportada sobre el mismo chat, sin duplicarlo y con PC apagada; el disparo es humano, no supervisor autónomo.

**Bloqueo concreto:** incompatibilidad funcional observada entre lectura y ruta de envío de Alfred a este chat cloud existente; causa interna pendiente del producto. Ninguna fuente consultada proporciona un ajuste de usuario comprobado para corregir ese error o un procedimiento de adopción. No activar recurrencia mientras el follow-up falle. Próxima acción externa concreta, si se decide: presentar a soporte del producto la discrepancia con UTC, UUID, último turno, error y canario; sin incluir credenciales. No se envió incidencia ni se creó otra tarea. Mientras tanto, conservar los cinco workers y continuar el mismo chat por la UI oficial.
