# Brecha de adaptador Hermes → Codex Cloud nativo (2026-10-14)
META: definir el siguiente contrato ejecutable sin cambiar el controlador ni sustituir el objetivo nativo.
PRUEBA DE HECHO: estado-harness 2026-10-14 + inspección selectiva de controller_pilot.py/sqlite_pilot.py + recibo V6.
PARADA: análisis fuente solamente; sin repo edit/test/CLI/SSH/auth/instalación/goal/mensajería.

## Observado
- `ControllerPilot` acepta sólo `FakeReadOnlyClient`; `ReadOnlyClient.run(Goal)->str` no representa un job remoto durable.
- `FakeSessionFactory` inventa owner fixture. `FixtureGrant.transport_verified` es dato fixture, no identidad/autorización real.
- SQLite y sus leases/fences/admissions/nonces son locales; dispatch externo está cerrado. `dispatch_effect_once` exige fixture y deja incluso su retorno en `needs_reconcile`.
- V6 sólo leyó `initialize`, `account/read`: 3.312 s, `account_present=true`, `auth_kind=chatgpt`, cero LLM/tools. Sin thread/turn, modelo, bridge Hermes, grant, cuota ni uso de contexto.
- La sesión y dos hijos Cloud fueron creados manualmente por UI; no prueban creación/handoff desde Hermes. Transporte Hermes existente no instanciado: API/timeouts amplios no demuestran integración apta.

## Gaps ordenados
1. **Binding de ejecución (bloqueante):** documentar/probar API soportada que cree o retome contexto Codex Cloud nativo, entregue thread/session + turn/job remoto y acepte input/checkpoint; hoy hay metadata solamente. Validar con agente de fuentes CLI/docs.
2. **Autoridad y unicidad:** grant real autenticado vinculado a actor, cuenta, worker, contrato/input hash, expiración y nonce one-use; reservar atómicamente un único `operation_id` y `remote_job_id` por intento. El SQLite local no arbitra productores/remotos.
3. **Lifecycle:** submit/status/cancel con deadline explícito y límites; timeout/caída deja estado ambiguo y retiene reserva; nunca replay ciego. `cancel` requiere confirmación terminal o `needs_reconcile`.
4. **Receipts/recovery:** recibo del proveedor ligado a IDs, etapa/turn, timestamps, input/checkpoint hash y resultado; `reconcile(job_id)` decide terminal/activo/unknown antes de renovar owner o completar.
5. **Cuota/contexto:** registrar modelo servido, uso, ventana y costo como UNKNOWN cuando falte señal; no activar umbral 70% sin `U_activo/W` fiables. Una compactación nativa confirmada sí permite disparar handoff sin porcentaje. Tarea acotada con alcance autorizado por Sergio y cero costo extra no se bloquea por costo no observable. HOLD sólo si falta autoridad real, binding/API, lifecycle seguro, grant o límite necesario para esa tarea; quota/costo desconocidos no crean por sí solos ese bloqueo. `account/read` V6 no expone tokens/contexto activo.

## Interfaz propuesta (contrato, no código)
```json
{"v":1,"operation_id":"uuid","goal":{"worker_id":"...","contract_id":"...","input_sha":"...","checkpoint_sha":"..."},"authority":{"actor":"...","account_scope":"...","nonce":"...","expires_at":"UTC"},"budget":{"limit":0,"unit":"provider-defined","source":"...","observed_at":"UTC"},"timeout_s":0}
```
Adapter: `submit(request)->{remote_job_id,status,receipt}`; `status(remote_job_id)->snapshot`; `cancel(remote_job_id)->snapshot`; `reconcile(operation_id,remote_job_id)->{state,receipt}`. El store durable hace compare-and-set `reserved→submitted→running→terminal|needs_reconcile`; IDs idempotentes, nonce consumido al reservar; sólo receipt verificable permite consumir presupuesto/completar. El `budget.limit:0` del JSON es ilustrativo: contrato propuesto, no presupuesto real ni activación. Registrar consumo/costo con unidad, alcance, fuente/hora si disponible; de lo contrario UNKNOWN, sin convertir ausencia de telemetría en bloqueo automático.

## Test real requerido antes de verde
Un lote autorizado y acotado crea un contexto Cloud nativo limpio desde Hermes, enlaza un solo job/nonce, recibe status y receipt terminal, cancela otro canario acotado con terminal confirmado, y reconcilia caída/timeout sin duplicado; verificar continuidad del checkpoint/ACK del nuevo owner, cuota/contexto observables y QA del artefacto. Evidencia incluye IDs/hashes no secretos, timestamps, modelo configurado/observado, uso/costo o UNKNOWN, y límites. Hasta pasar, ejecutar sólo fixtures; circuito real = HOLD.

