# Hermes: contrato mínimo de harness — 12-oct-2026

META: ordenar colas, owners, routing y gates del supervisor, con artefacto propio y
pruebas offline. PRUEBA: contrato JSON, matriz, casos de aceptación y QA independiente.
PARADA: artefacto offline validado; separar la dependencia externa de follow-up
de las integraciones y pruebas operativas todavía pendientes.
No se activa un scheduler, no se envían mensajes ni se toca Platform/Confirmador.

Dueño: Hermes QA. Madre: Desarrollo-Infra. Rama privada:
`codex/hermes-harness-20261012`. El índice audit compartido de la madre queda intacto;
la madre puede enlazar este directorio al revisar el resultado, sin otra cola paralela.

## Evidencia y cambio de diagnóstico

Fuente vigente: [auditoría Alfred](https://github.com/oninteligenciaartificial/onia-hermes/blob/ae12aa635dcb27cb37b09c7f3b72db35bb26b778/hermes-content/docs/audits/SUPERVISOR-CLOUD-INVENTARIO-20261012.md),
blob `47d345575ee856ecfae814cc4dc45ebeb74c2c35`. La lectura documental por conector
se verificó en este contrato; los resultados operativos son los documentados por
la madre, no nuevas llamadas de este runtime. El addendum más reciente prevalece
sobre los gates iniciales del mismo archivo: **Alfred read cinco PASS**. Único envío
a Hermes, 12-oct 20:19 UTC (16:19 UTC-4): `NOT_FOUND / CloudThreadNotFoundError`, sin
turnId; lectura posterior sin canario. No se atribuye el error a UUID incorrecto,
login, cuota ni VPS. No se repiten CLI/401 ni envío Alfred.

Routing vigente: delta de modo ahorro del handoff remoto `codex-cloud-pc-20261011.md`
(12-oct): ambas madres Luna low; Platform Sol 6.1 medium; Hermes y mecánica Luna low;
Marca, Lucía y Ventas Sol 6.1 low; QA focal Sol 6.1 low. Astra queda fuera del uso
habitual. Son configuraciones aceptadas/solicitadas según el registro; modelos
servidos no observables. Aprobaciones y límites antiguos no se convierten en permisos.

Incidente de follow-up: la madre reporta que escaló al especialista; la respuesta
del especialista sigue pendiente. La primera respuesta genérica no se aplicó y no
cuenta como resolución. Hermes no observó directamente estos hechos y no se afirma
que el producto esté reparado. El siguiente gate es recibir una instrucción soportada
del especialista para el mismo chat; después se requiere autorización específica
para un solo intento. Hasta entonces, el trigger permanece apagado.

Inventario Luna: checkout histórico `2cdefca738ed85d87f50e6dc3dc6c31a5aa698f9`.
Fuentes locales existentes: cola README blob `2390073e1965a247be2d30113b3d9f67dfc03e16`,
launcher `scripts/codex-tarea.sh` blob `2d839021981b6502964d77baafc1afd1b78172e8`,
skill equipo blob `a63c4141a058e59dae5caa35e663d9c3986b5b67`,
`ONIA_HARNESS.md` blob `ffe6b92a836cd21d530af8562b06c998273cf868`.
Estos archivos documentan métodos/historia; no demuestran loops vivos.

## Matriz: carril, owner y checkpoint

| Carril y cola `hermes-content/docs/cola/loop/` | Worker/owner | Modelo solicitado | Estado y checkpoint existente |
|---|---|---|---|
| Platform `plataforma.md` | `01a12c7e-97e2-7115-8561-0b7658008003` / Desarrollo-Infra | Sol 6.1 medium; Astra fuera del uso habitual | Confirmador en desarrollo comunicado; fuera de este encargo. No nuevo snapshot ni cambio de cola. |
| Hermes `hermes-jarvis.md` | `01a13170-1c7e-7224-83c1-c5f369052039` / Desarrollo-Infra | Luna low; comprobaciones Luna low; QA focal Sol 6.1 low; Astra fuera del uso habitual y sin escalación automática | Artefactos piloto en rama `codex/supervisor-pilot-20261012`; lectura Alfred validada en fuente; follow-up bloqueado. Modelo servido no observable. |
| Marca `marca-personal.md` | `01a13170-b488-71d9-83f8-12663d5a0013` / Marketing | Sol 6.1 low | Seguimiento horario local comunicado; no trigger cloud demostrado. Checkpoint de su cola/artefactos, sin medirlos aquí. |
| Lucía `lucia.md` | `01a13171-0fdb-72c6-9fdc-81244d7e6006` / Marketing | Sol 6.1 low | Misma regla de cola y checkpoint; estado actual no muestreado en este contrato. |
| Ventas `ventas-pauta.md` | `01a13171-6ac1-771e-b285-52e7284e203a` / Marketing | Sol 6.1 low | Misma regla de cola y checkpoint; estado actual no muestreado en este contrato. |

## Matriz: existente, faltante y solución mínima

| Dimensión | Existente / evidencia | Hueco | Solución mínima preparada |
|---|---|---|---|
| Cola | Primera tarea abierta; `[x]` con SHA/link/captura; bloqueo con owner y siguiente acción | Un idle no dice si hay trabajo elegible | Diferenciar cerrado, pending, blocked y estado no observado; nunca recrear cerrado. |
| Owner/modelo | Dos madres, cinco workers e IDs completos; routing vigente arriba | Modelo solicitado no demuestra servido | Contrato por carril, permisos propios y registro solicitado/observado/no observable. |
| Estado | Read cinco Alfred PASS en addendum; no nuevo snapshot aquí | Lectura histórica no autoriza envío actual | Exigir snapshot fresco y evidencia del requisito desbloqueado. `blocked` queda bloqueado hasta transición explícita a pending con nueva evidencia. |
| Checkpoint | Cola y Git; CLI local registra resultado/eventos/session_id | Sin recuperación remota de turnos demostrada | Guardar repo/ref/SHA/input/contrato/paso + reserva/recibo; restaurar exactos y reconciliar antes de continuar. |
| Disparo oficial | Producto anuncia follow-up; mismo chat web/móvil admite continuación humana | Alfred send Hermes falla sin turnId/canario | Mantener trigger apagado; resolver única incidencia externa de la fuente audit. No usar `cloud exec` para crear sustitutos. |
| Exclusión | Scripts antiguos tienen flock local; patrón, no cloud activo | No reserva remota transaccional conectada a envío | Una reserva por worker, clave worker+contrato+inputSHA+paso; escribir antes de enviar. Sin ACK, conservar; no liberar por simple timeout o idle. |
| Límite/cuota | Método de lectura `scripts/codex-cupo.mjs`; límites antiguos históricos | Cuota actual no medida en este encargo | Usar lectura vigente contra límite autorizado. Si falta medición, hold. No subir techo ni inventar saldo por cuota renovada. |
| Reintentos | Launcher local permite resume manual; no retry cloud probado | Entrega incierta puede duplicar turnos | Propuesta: un intento por evento sin cambios; cero retries NOT_FOUND/401/403. Reconciliar recibo/reserva antes de cualquier intento autorizado nuevo. |
| QA | Reviewer independiente y gates por contrato | Aceptación de herramienta no prueba inicio/completitud | Inicio exige turnId y canario; final exige salida recuperable/hash y QA. Fixtures sólo prueban reglas offline. |
| Aprobaciones | Alcance presente sólo audit/config/docs; permisos sensibles separados | No inferir producción/gasto/publicación por disponibilidad | Cada candidatura exige scope/approval comprobados. Sin main/deploy/compras; no activar acciones ajenas. |
| Observabilidad | Resultado/eventos/session_id locales y auditoría de incidentes | No recibo remoto confirmado del envío fallido | Registrar operación/UTC/worker/input/paso/cuota/clave/turnId/canario/error/hash/QA sin secretos; `tool success` no es ACK. |

Automatizaciones **declaradas por inspección local de la madre**, no medidas de nuevo:
`avisos-de-entregas-de-marca` ACTIVE hourly, seguimiento Marketing; y
`onia-1-0-revisi-n-y-aprobaciones` PAUSED, rama septiembre. No son loop Platform
ni cloud wake. No se editan ni activan. Triggers históricos de skills/runner VPS
permanecen historia: no se adoptan como configuración operativa.

## Prueba reproducible y límites

`python test_gate.py` desde este directorio. Sólo Python stdlib, sin instalación.
18 casos de aceptación: idle bloqueado vs pending, cerrado, snapshot ausente,
turno activo, reserva incierta, clave completada, NOT_FOUND, segundo intento,
cuota, aprobación, trigger no validado, checkpoint con SHA/paso incorrecto,
dos contratos concurrentes para un mismo worker y recibo sin turnId/canario;
transición de bloqueo con evidencia nueva, tipos booleanos exactos y checkpoint vacío.

`gate.py` es un validador offline de una **propuesta**. Nunca llama API, scheduler
o worker. `eligible_for_one_attempt` es una candidatura, no envío. La prueba
O_EXCL acredita exclusión atómica **local** entre las fixtures concurrentes;
no implementa ni acredita exclusión distribuida. La futura integración oficial
debe reservar atómicamente en almacenamiento durable compartido antes de enviar.
No liberar reserva sólo porque vence un plazo: outcome incierto obliga a reconciliar.
Los tests limpian sus directorios temporales; no hay servicios ni procesos de fondo.

`contract.json` conserva `trigger.enabled:false` y la falta de cuota observada.
No es una configuración desplegada. Checkpoint/quota/approval flags de fixtures
son entradas de simulación, no medidas de los workers reales. No se hicieron
tests Platform, dispatches, CLI401 ni sondeos Alfred en este contrato.

## Cierre offline y pendientes para operación

Configuración documental/gates: preparado y validado offline; QA independiente
en `QA.md`. No hay supervisor autónomo activo. Los huecos de checkpoint/exclusión
remotos son criterios para la futura integración, no permisos para construir
infraestructura paralela ahora. Skill stack requerido queda referenciado, sin
copias ni modificación de skills compartidas: onia-router, onia-continuidad,
equipo-de-agentes y onia-hermes-jarvis.

**Corrección de cierre posterior a 32f78538:** arreglar Alfred es necesario, pero
no basta para operar. El artefacto aprobado sólo prueba reglas offline. Checkpoint,
exclusión compartida, conexión del trigger y pruebas remotas siguen pendientes;
no están resueltos por el O_EXCL local ni por una respuesta de soporte.

La madre confirmó la incidencia **ENVIADA Y ESCALADA** por Help oficial con cuenta
ONIA. La resolución del producto sigue pendiente. Es evidencia declarada por la
madre, no un envío ni acuse observado por Hermes; no acredita reparación. La auditoría ae12aa63 conserva el estado
histórico preparado/no enviado; no se edita ni se toma como estado posterior.

| Paso pendiente / dueño | Fuente o API oficial y límite | Prerequisitos | Prueba requerida para cerrar |
|---|---|---|---|
| 1. Follow-up al Hermes existente / producto Codex–dots, madre coordina | Release y documentación de dots enlazadas en auditoría ae12aa63. Herramienta oficial de follow-up; no endpoint REST equivalente documentado en este runtime. | Confirmación de soporte y procedimiento soportado para el UUID existente; nuevo intento específico autorizado, sin duplicarlo. | Recibo con turnId, mismo worker y canario observado. No confundir acuse de soporte con turno iniciado. |
| 2. Checkpoint durable compartido / Hermes, revisión arquitectura | Contrato `checkpoint.required_fields` y auditoría ae12aa63. **Backend y API oficial aún no seleccionados/verificados**. Git ya preserva estos artefactos, pero no implementa estado transaccional de despacho. | Arquitectura revisada que elija almacenamiento existente autorizado, identidad, permisos y operaciones documentadas; sin nueva infraestructura ni producción por inferencia. | Otro runtime recupera exactamente repo/ref/SHA/input/contrato/paso y verifica integridad. Reconciliación de reserva/turno tras interrupción; no repetir un paso cerrado. |
| 3. Exclusión/idempotencia compartida / Hermes, QA independiente | Especificación preparada en `contract.json`; prueba O_EXCL sólo local. **API transaccional de reserva compartida no implementada**. | Mismo backend del paso 2 con reserva atómica por worker y clave de evento; lectura de recibos y estado de reserva. | Dos productores remotos compiten: sólo uno reserva/envía; crash después del envío no ocasiona segundo turno; outcome incierto retiene reserva hasta reconciliación. |
| 4. Cuota, alcance y aprobaciones / madre de área + ejecutor | Métodos canónicos `scripts/codex-cupo.mjs`, equipo-de-agentes y CODEX vigente; no hay saldo actual medido aquí. | Fuente vigente de cuota y límites autorizados, permiso del contrato y approvals sensibles aplicables. | Falta de cuota/evidencia produce hold; reserva no excede límite y el consumo queda registrado. Renovación comunicada no sustituye lectura actual. |
| 5. Conectar trigger remoto existente / Hermes + arquitectura | Auditoría ae12aa63 inventaría n8n y herramientas de automatización, sin puente validado. **Scheduler/API oficial de disparo no seleccionados para este contrato**. Las dos automations locales no prueban cloud wake. | Pasos 1–4 acreditados; scheduler existente autorizado y revisado, identidad soportada, exclusión de las automatizaciones previas y destino exacto. | Único disparo remoto finito devuelve recibo, turnId y canario; registrar operación y cleanup. No crear recurrencia para probarlo. |
| 6. Recuperación, observabilidad y autonomía / Hermes + QA | `observability.required_after_any_future_send` y recibos del piloto; documentación cloud/dots citada en ae12aa63. | Trigger único validado, checkpoint y exclusión remotos; límites y mecanismo de pausa documentados. | Prueba con equipo local realmente apagado, interrupción/restore y ausencia de duplicados. Verificar logs durables, consumo y cleanup; activar recurrencia sólo bajo contrato posterior explícito. |

Preparación independiente completada: lista ordenada de implementación,
prerequisitos y pruebas, más contrato de gates conservador. No se eligió backend
ni API por suposición, no hay adapter remoto implementado y no se aprovisionó
infraestructura paralela. `trigger.enabled` permanece false; `operational_ready`
permanece false. No se repiten los 18 tests por este cambio documental: `QA.md` y
`VALIDATION.json` son recibos del baseline 32f78538, con sus hashes originales;
el addendum QA y recibo documental posteriores identifican este delta.

Hasta cerrar todos los pasos, continuar el mismo chat por web/móvil es alternativa
oficial con disparo humano; no es supervisor autónomo ni habilita loops cloud.

## Checkpoint de espera y avisos

Escalación confirmada por madre; sin nuevo intento de CLI/401, wake o incidencia.
Gates de operación cerrados. No queda preparación independiente necesaria en este
contrato offline: esperar resolución del producto y decisión de arquitectura para
las integraciones pendientes, sin polling ni actividad simulada. Avisar sólo ante
capacidad nueva probada, fallo material o acción humana específica. Un heartbeat
local no acredita operación con la PC apagada.
