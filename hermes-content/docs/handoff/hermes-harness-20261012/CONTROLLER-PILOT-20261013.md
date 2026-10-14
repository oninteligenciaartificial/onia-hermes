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
