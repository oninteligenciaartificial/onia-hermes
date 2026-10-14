# Controlador local sintético — endurecimiento 13-oct-2026

**META:** probar una meta pública fixture sobre la misma cola SQLite. **PRUEBA:** 31 pruebas unitarias (11 nominales y 20 de guard/adversariales), usando python -m unittest -v test_controller_pilot.py, seguido de python controller_pilot.py. Windows verificó 31/31 PASS y el demo fake; la corrida independiente VPS/Python 3.11 debe repetirse sobre este snapshot. **PARADA:** sólo FakeReadOnlyClient, identidad y transporte fixture, account_scope=fixture-only, objetivo SYNTHETIC: y una unidad presupuestaria ficticia. No usar con tareas, clientes, cuentas, sesiones, Telegram, proveedores o servicios reales.

El controlador verifica el claim vigente mediante el lease y fencing del core, relee la fila y el checkpoint desde el mismo SQLite y rechaza cualquier checkpoint entregado por el caller que no coincida con el durable. El checkpoint conserva una versión de contrato. Un resultado aprobado debe existir en el checkpoint durable y pasar QA antes de aceptar un grant de finalización ligado a su hash.

Las tablas auxiliares controller_guard_state, controller_admissions, controller_nonces, controller_context_samples y controller_rotations viven en ese mismo archivo SQLite. Cada admisión usa BEGIN IMMEDIATE para verificar STOP, identidad/hash, lease/fence, versión, quota/costo/retry/tool-policy known, grant fixture no usado y caps agregados antes de consumir la muestra de contexto. Hay topes separados de una llamada fake y un relevo por account scope; un relevo reserva el nonce y su cupo antes de crear al sucesor, sin contar ese cupo como la llamada. Una carrera entre claim de core y STOP se vuelve a comprobar antes de devolver el claim. No se invoca el cliente dentro de la transacción. Estos límites son fixture y no representan moneda ni cuota real. Reservas consumidas o ambiguas no se liberan automáticamente.

Si el proceso cae después de reservar el attempt, el core convierte el efecto in_flight a needs_reconcile cuando vence el lease. No se repite el fake call; hace falta resolución explícita con evidencia. Un STOP fixture incrementa una época durable y bloquea claims/admisiones futuras. No cancela una operación ya iniciada: si la señal aparece durante el fake, el resultado queda ambiguo y requiere reconciliación.

Las muestras de contexto deben incluir ID, owner y fencing token del claim, timestamp entero dentro de la ventana y no pueden consumirse dos veces. El piloto permite como máximo un relevo por tarea y por account scope. El sucesor requiere una medición nueva. Una quota, costo, capacidad de retry o política de herramientas desconocidos mantienen la tarea en HOLD antes de reservar o ejecutar el fake.

FixtureGrant exige actor, bot, chat, canal, transporte verificado, versión, acción, scope, objetivo, payload/hash, nonce y timestamps enteros. El TTL máximo fixture es 300 segundos; el nonce de ejecución se consume atómicamente con la reserva de relevo o intento, y el nonce de finalización se consume con el recibo durable. El tiempo y la declaración de transporte son fixtures, no una fuente confiable externa. Estos campos sólo prueban el contrato local: no autentican a una persona, bot, chat ni transporte real.

El controlador rechaza cualquier cliente distinto de FakeReadOnlyClient; SQLiteQueue.dispatch_external sigue cerrado. El demo y las pruebas no hacen red, llamadas a modelos ni efectos externos. La cola sigue siendo de un solo host y no implementa scheduler, integración PC apagada, bot, proveedor, kill real ni despliegue. No modifica el core sqlite_pilot.py.
# Delta 2026-10-14: transporte Cloud task y recibos

META: conectar una intención local del SQLite existente con `codex cloud exec`
y un recibo observado, manteniendo QA/reconciliación separadas.
PRUEBA DE HECHO: `native_receipt_bridge.py`, `native_cloud_cli.py` y pruebas
offline con subprocess mock. No se lanzó Cloud/LLM en este lote.
PARADA: no main/merge/deploy/instalaciones; ninguna repetición de submit ante
timeout/caída/respuesta ambigua. No equiparar task_e con UUID de chat desktop.

Corrección posterior al único submit histórico `97c5f7a`: esa versión usaba
`text=True` en Windows. Su `wire_prompt_sha256` describe UTF-8 del texto previsto,
no bytes capturados en stdin (la capa texto puede transformar LF a CRLF).
El recibo original y la operación permanecen intactos; la aclaración companion
vive en `E:/onia-wt/onia-harness-native-run-20261014/wire-semantics-companion.json`.
No repetir esa operación. El código futuro usa `input=prompt.encode('utf-8')`,
`text=False`, decodificación UTF-8 estricta de stdout acotado y hash de stdout
binario original. `wire_prompt_sha256` futuro corresponde a los bytes exactos
entregados a stdin, probado con un proceso Python local inocuo que lee
`sys.stdin.buffer`; ninguna llamada CLI/LLM/red interviene en esa prueba.

`NativeReceiptBridge(queue)` usa el mismo archivo y requiere guard STOP de
`ControllerPilot`. `reserve(claim, operation_id UUID, nonce único,
authorization_ref, now, expected_dispatch_contract_sha)` consume la reserva y deja `needs_reconcile`, bloqueando
reclaim automático. La referencia apunta a autorización revisada por la madre;
no es autenticación de Telegram ni verificador de grant real.

El caller autorizado construye `CloudTaskPlan` con executable absoluto ya
instalado y su SHA256, cwd checkout, environment ID exacto, rama `codex/*`, HEAD
remoto esperado, archivo de prompt público revisado y su SHA256, timeout local
1–60s. `plan.request()[2]` devuelve el hash de ese contrato para reservarlo antes
del dispatch. Incluye paths resueltos de executable/cwd/prompt y los hashes; el
puente rechaza cualquier plan distinto de esa reserva inmutable. No verifica
que el prompt esté rastreado en Git: es reviewed local y debe versionarse por el
caller antes del lote real. No hay scanner de secretos ni autorización implícita
por contenido: la madre debe revisar el prompt público y su autorización.
`NativeCloudCLI(bridge).submit`
consume el slot/STOP epoch antes de lanzar argv sin shell, stdin y `--attempts 1`.
`request()` agrega `ONIA_CHECKOUT_CONTRACT` seguido de JSON en una línea con
`expected_repo=onia-hermes`, `requested_ref` y `expected_head` exactos del plan
a la plantilla revisada.
Así la plantilla versionada no contiene el hash de su propio commit: el caller
puede preservarla y luego fijar ese commit como expected_remote_head. El contrato
incluye hash de plantilla y request wire con metadata; el recibo de submit
devuelve `wire_prompt_sha256` del stdin final, incluidos operation/input hash.
No se reemplazan placeholders ni se reescribe el archivo fuente.
El prompt recibe operation/input hash y HEAD esperado con instrucción de parar
ante mismatch; es comprobación del worker y de QA, no garantía del runtime remoto.
La respuesta con un único task_e se liga
al intent. No selector de modelo, límite de tokens, idempotency remoto o cancel
se afirman: este contrato del CLI no los expone. Costo/uso/modelo observado
permanecen UNKNOWN si no hay evidencia.

`status(operation_id, executable)` lee una página JSON acotada del CLI, filtra
el ID literal, valida status string y normaliza lowercase/uppercase. Conserva
`ready`/`READY` como observación desconocida pendiente de QA.
La ausencia en esa página no prueba inexistencia del task. Un timeout mata sólo
el proceso local: puede haber tarea remota activa. La reserva queda consumida;
revisar UI/list por ID/evidencia original antes de cualquier decisión humana.

`bridge.ingest(NativeObservation(...))` conserva recibo con hash/input/ID,
rechaza rebinding, colisión, tiempos obsoletos y conflictos terminales. Un recibo
`completed` requiere hash del artefacto pero sólo devuelve `awaiting_qa`; no
cierra task, consume presupuesto ni autentica la fuente. QA y reconciliación
existentes deben validar artefacto, identidad y efectos antes de completar.
STOP bloquea nuevos submits; no cancela una tarea Cloud ya enviada.

Validación local: `python -m unittest test_native_receipt_bridge test_native_cloud_cli test_controller_pilot -q`.
Para la instancia live única del piloto, usar
`E:/onia-wt/onia-harness-native-run-20261014/queue.sqlite3`.
No reutilizar DBs canarias/QA ni `Goal`/`FakeSessionFactory` para autorizar efecto
real. El bootstrap público crea el mismo guard sólo en una queue nueva/vacía,
registra authority_ref/hash del plan y rechaza reinit, guard previo, tareas,
fences, leases, handoffs, resultados o ledger nativo existentes. No levanta STOP.
La referencia humana es una afirmación explícita del caller, no autenticación.
Ejemplo de orden operativo con `plan` ya revisado y construido por la madre:

```python
from pathlib import Path
import time
import uuid
from sqlite_pilot import SQLiteQueue, TaskSpec
from native_receipt_bridge import NativeReceiptBridge
from native_cloud_cli import NativeCloudCLI

queue = SQLiteQueue(Path("E:/onia-wt/onia-harness-native-run-20261014/queue.sqlite3"))
plan_sha = plan.request()[2]  # sólo validación local, no proveedor
now = int(time.time())
authority_ref = "sergio:referencia-exacta-de-autorizacion-revisada"
bootstrap_receipt = NativeReceiptBridge.bootstrap_guard(queue, authority_ref, plan_sha, now)
queue.enqueue(TaskSpec("native-pilot-1", "hermes-native", "onia-hermes",
                       plan.branch, plan.expected_remote_head,
                       "native-public-review-v1", plan_sha), now)
claim = queue.claim("hermes-native", "native-pilot-owner", now, 60).claim
bridge = NativeReceiptBridge(queue)
operation_id = str(uuid.uuid4())
bridge.reserve(claim, operation_id, str(uuid.uuid4()), authority_ref, now, plan_sha)
# EFECTO REAL: ejecutar sólo después de revisión/autorización del lote.
receipt = NativeCloudCLI(bridge).submit(operation_id, plan)
```

Guardar bootstrap/submit receipts con sus hashes. Tras reinicio, abrir la misma
queue y bridge, leer operation_id y consultar status por su remote_id ligado;
no volver a bootstrap/reserve/submit. Un slot consumido sin ID exige reconciliar
la evidencia original/UI; no búsqueda por coincidencia aproximada ni replay.

Pendiente: QA independiente de esta versión y lote real autorizado dirigido por
madre. Esto habilita Cloud tasks acotadas, no demuestra ciclo >=30min,
autonomía PC-off, adopción/handoff de chats, navegador Cloud ni JPEG Telegram.

## Tranche finita experimental posterior a 436894 — NO PROBADA

META: usar una tarea Cloud finita útil con el transporte real existente, recuperar
artefactos públicos y exigir QA antes de proponer siguiente trabajo. Ownership:
`controller_pilot.py`, `native_cloud_cli.py`, `native_receipt_bridge.py` y este doc.
No se ejecutaron tests, proveedores, submits ni migración de la DB live en esta
tanda. El controlador fixture y sus gates siguen sin cambios. El código nuevo
está pendiente de revisión independiente y de pruebas autorizadas.

`step_native_work(queue, bridge, transport, event, request, plan, now, ...)`
en el módulo existente recibe un TaskSpec real ya registrado y, para submit, su
claim. Compara repo/ref/HEAD/input y plan exactos. `NativeWorkRequest` liga
operación, nonce, paths JSON, predecessor y el claim de aprobación. Este último
es sólo una afirmación del caller: sin `NativeWorkAuthority.verify` externo que
autentique aprobación y devuelva evidencia ligada al hash del request, actor,
scope, nonce y expiración, el paso permanece HOLD. No se implementó un proveedor
de autenticación ni se emitió un grant nuevo. Un callback que marque la referencia
del caller como verified sin autenticarla viola el contrato.

La reserva nueva comprueba en una transacción el lease/fence, STOP, identidad,
grant y una closure previa terminal/reconciliada. Usa native_operations. El
constructor/status/read NO migran una DB existente. La instancia live conserva
su schema anterior: la API nueva queda HOLD por schema ausente y autoridad externa
sin implementación. `prepare_finite_work_schema(queue, reviewed_change_ref)` es
una migración local explícita, pendiente de permiso humano específico y QA; sólo
añade tres columnas cuando toda la queue está done y las closures terminales.
La referencia es audit claim, no autenticación ni permiso inferido. El operador
debe preservar su recibo. No se ejecutó esta migración en la presente tanda y
no altera el recibo/bootstrap histórico. No admite un guard fixture como permiso
real. R2 no puede reabrirse, rebindearse ni usar esta API de eventos; carece de la
admisión de trabajo nuevo. Si cambia STOP antes de efecto, begin_dispatch mantiene
su segunda comprobación de época. También verifica integridad/binding del grant
persistido y expiración con reloj real justo antes de consumir el slot. Los rows
legacy sin work authority conservan su contrato. collect_result valida paths
antes de cualquier read al proveedor, incluso cuando se usa su API directa.
Exclusión local single-host; el proveedor no
expone idempotency/cancel probado ni garantía distribuida.

Cada llamada trata exactamente un evento, sin scheduler, sleep ni retry. Submit
reserva una vez y usa NativeCloudCLI; otras operaciones exigen event_id único,
consumido antes de la llamada en la misma fila y con tope de ocho eventos por
closure. Evento ya consumido o caída exige reconciliación; no se reejecuta.
`status` observa el handle literal; incluso failed/cancelled del proveedor queda
unknown en el ledger hasta QA. `result` lee una vez `cloud diff ID`: máximo
256KiB capturados por un child local acotado, sin stderr logs; mata sólo ese child
si excede tamaño/plazo, hasta dos segundos extra de reap y sin prometer cleanup
de descendientes o cancelación remota. Parser admite sólo files nuevos regulares
100644, un hunk entero por path JSON exacto autorizado, sin rename/delete/binario,
git apply ni ejecución. Bytes son reconstruidos desde diff, no download directo
ni prueba de identidad de Git blob: preserva stdout SHA y hashes recuperados para QA.

Bundle recuperado sólo produce awaiting_independent_qa. La madre debe conservar
el JSON del retorno como recibo; no se construye otro ledger ni persistencia paralela.
QA exige verifier independiente externo, hash request/bundle/handle/reviewer y
resultado declarado. Valida operación/input y checkout de cada artefacto; READY,
exit0 o un label del worker no aprueban. Luego guarda terminal immutable y resuelve
closure applied con goal_outcome explícito. Queue done significa submit/closure
reconciliada, no éxito del objetivo global. Sólo propone siguiente TaskSpec pending
si STOP está libre y no hay pendientes ambiguos; no lo encola, reclama ni despacha
sin otra autoridad verificada. No inventa trabajo para alcanzar treinta minutos.

Métricas submit: timestamps y duración monotónica local real, intento local uno;
lectura de diff: duración/read attempt uno. Remote execution duration, tokens,
costo, contexto activo/ventana y handoff quedan UNKNOWN si falta recibo fiable.
Una closure nueva con checkpoint aprobado no es rotación de chat UUID. Liveness
>=30min, follow-up/cancel/contexto U/W, autenticación externa, trabajo elegible
y scheduler remoto siguen sin prueba; esta tanda no cierra esos objetivos.

Contrato de verificación posterior, NO ejecutado ahora: con autorización usar
queues temporales separadas de la live para verificar grant ausente/forjado,
plan/nonce/lease/STOP/epoch, predecessor no cerrado, event duplicado/timeout,
diff malformado/oversize/path traversal/rename/binario, bindings de artefactos,
QA mismo worker/hash incorrecto/ausente, terminal conflict y next candidate sin
autoridad. Fuente fixture debe conservar sus gates originales. Simular provider
con children inocuos antes de aprobar un único trabajo real finito útil. La DB
live se mantuvo sólo lectura/no instanciada por este código en la presente tanda.
