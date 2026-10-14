# Gateway Telegram callback locator — 2026-10-14

## Estado actual

**Callback identificado en snapshot público offline.** El handler Telegram hace gate de identidad Telegram y consulta una aprobación por ID incremental enlazado con `session_key`; no se confirmó registro runtime activo, vínculo con `NativeWorkAuthority`, autenticación real de Telegram en el despliegue ni aprobación nativa operativa. No activar piloto ni inferir una aprobación para ONIA.

## Historia de la inspección remota (etapas 1–5)

- Callchain observado en módulos públicos: proceso → `hermes_cli.main.main` → `cmd_gateway` → `hermes_cli.gateway.gateway_command` → `gateway.run.start_gateway`. Snapshot previo reportó `hermes-gateway.service` activo y entrypoint `hermes_cli.main`; fecha fija, no estado vivo actual.
- Búsqueda parcial de 512 archivos Python/8,550,790 bytes identificó inicialmente solo `tools/send_message_senders.py` y `scripts/generate_conformance_vectors.py` con literal `TelegramAdapter`; no era inventario total ni prueba de ausencia.
- Se confirmó import condicional de `TelegramAdapter` desde `plugins.platforms.telegram.adapter` en `tools/send_message_senders.py:130,233`. El source plugin público existía; su equivalente bajo el site-packages del intérprete observado estaba ausente, lo cual no prueba registro runtime.
- El quinto intento AST excedió el guard: 11,135 bytes frente a 7,700; solo devolvió `bounded_output_over_cap`, sin hechos AST. El snapshot y diagnóstico AST se procesaron después localmente fuera de línea, sin importar ni ejecutar el adapter.
- La captura remota inicial usó cinco conexiones SSH de solo lectura y leyó cuatro módulos públicos (719,561 bytes acumulados). No se consultaron configuración privada, authstores, logs, Telegram API ni cola real.

## Evidencia offline del adapter público

Se validó un snapshot público del adapter (387,611 bytes, SHA-256 `a50b10a713b6b40d71531ef6e133cc99285c35a860b5bf2c947e81e3968c18a6`) almacenado fuera de Git. No se copia el cuerpo del source al repo.

- `_register_handlers` (2682–2695) registra `CallbackQueryHandler(self._handle_callback_query)` (2691). `_handle_callback_query` (4221–4243) deriva prefijo `ea:` a `_handle_exec_approval_callback`.
- `_callback_ctx` (4203–4209) extrae chat_id/type/thread_id; `_callback_authorized` (4211–4219) usa `query.from_user.id`; `_is_callback_user_authorized` (744–779) prefiere autorización inyectada por GatewayRunner, luego auth legacy y finalmente allowlist env. Sin allowlist niega, salvo `GATEWAY_ALLOW_ALL_USERS` true/1/yes.
- `_handle_exec_approval_callback` interpreta `ea:<choice>:<approval_id>` (4254–4297). `send_exec_approval` asigna IDs incrementales con `itertools.count(1)` y guarda `_approval_state[approval_id] = session_key` (3776–3799). Tras gate de actor permitido, `_claim_callback_state` hace `state.pop(approval_id)` como reclamo de un solo uso (4245–4252).
- El handler llama `tools.approval.resolve_gateway_approval(session_key, choice)` (4277–4278). No hay en el adapter binding directo del ID a actor esperado, request digest, nonce aleatorio, expiry propia o message_id. El resolver puede expirar por su espera, pero su semántica interna y permisos downstream no fueron inspeccionados.

## Dictamen y siguiente estado

El callback legado es un gate de identidad Telegram más un lookup por ID incremental hacia `session_key`; no demuestra binding a `NativeWorkAuthority` ni aprobación criptográficamente ligada a actor/solicitud. El módulo nativo publicado por separado crea una frontera propuesta y tiene fixtures aislados, pero está sin integrar: no demuestra llamada desde launcher, envío/bind de mensaje, registro de handler, autenticación Telegram real ni E2E. Mantener `HOLD` para integración/activación y no repetir la captura remota excedida.

## Trazabilidad

Informe externo final SHA-256 `78ECCFE9A32DEA187A35965BD81F2FE95C69EA18EE17E494305F85BFF2C4821D`; recibo externo `23AB440524295D9E1C3E5F98C552679F6F4B5786A41EE03BE670800F62756B39`. El estado UNKNOWN de las etapas remotas 1–5 se conserva como historia; los hallazgos actuales proceden solo del snapshot público offline indicado arriba.
