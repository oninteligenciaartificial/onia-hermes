# Evidencia de fuente del gateway Hermes instalado — 2026-10-14

Estado: **inspección de fuente pública solamente**. No se modificó el gateway instalado, no se aplicó parche, no se arrancó ni reinició un servicio, no se contactó Telegram o un proveedor y no se leyó ni alteró la cola operativa. No se ejecutó el ejercicio de 30 minutos.

## Fuente y seam verificados

La fuente instalada está bajo `/usr/local/lib/hermes-agent`; el módulo declara la versión `0.21.0`. Los hashes SHA-256 se calcularon sobre los archivos instalados y se contrastaron con AST localmente:

| Fuente instalada | SHA-256 |
|---|---|
| `gateway/run.py` | `79a8704da45baf702e1e9590a1b55feac9439722685705a4eb1b3f545dc134d3` |
| `gateway/run_startup.py` | `187b3324eeec09f15ff923fcf21e80c7b687c02194267791e0ed4d157401c08b` |
| `gateway/run_adapters.py` | `0abc26aee3f5f082aaebb328f80fc905fe2e2369b3d475658b6d08bafd8acd1f` |
| `gateway/platforms/base.py` | `63b344ed86e9994ea2e96bc76ec5464fd46382a3c683a3bec178dffa79ad9ce6` |
| `gateway/run_turn.py` | `cb681020ef13d5bd0d89b00c7f8a67efb1b6bd68cc5624dd1407c1195e075cd2` |
| `gateway/run_inbound.py` | `7328ff0360765ba33420daee86df192494de03810b7a9d265101ac4afc8e1441` (AST metadata only; source not retained after a credential-pattern category was detected) |
| Telegram adapter snapshot | `a50b10a713b6b40d71531ef6e133cc99285c35a860b5bf2c947e81e3968c18a6` (matches the previously reviewed snapshot) |

`GatewayRunner` composes `GatewayStartupMixin` and `GatewayAdapterLifecycleMixin`. Initial startup in `gateway/run_startup.py` creates the adapter, wires runner handlers, and queues that same adapter in `_start_prefilter_platforms` (lines 904–918); `_start_connect_pending` calls `_connect_initial_adapter_with_timeout` afterward (921–936). The full startup orders prefilter before connect (1258–1268). The factual pre-connect seam is after `_wire_adapter_handlers(adapter)` and before the adapter is queued for `connect()`.

`GatewayAdapterLifecycleMixin._create_adapter` resolves a registered plugin factory or a built-in adapter (`gateway/run_adapters.py`, 1434–1460). `_wire_adapter_handlers` installs the existing runner message and authorization/event handlers (1032–1051); the connect wrapper calls `adapter.connect()` (148–175). The reviewed Telegram adapter snapshot registers its callback-query handler during `connect()`, so an adapter callback wrapper must be installed before that call.

The existing inbound route is the Telegram adapter callback → GatewayRunner message handler → `_handle_message` → `_handle_message_with_agent` → `_run_agent` → base adapter final send/attachment methods. No `NativeTrustedRuntime`, `TelegramNativeWorkAuthority`, or `FileResultSink` reference was found in the reviewed host modules. A native sink consumer and Telegram artifact-notification/capture route remain unproven.

## Topología y recomendación

La cola SQLite única y el runtime nativo actual están en la PC Windows; Hermes y el adaptador Telegram instalado corren en un VPS Linux. La autoridad, la cola, el adaptador y `FileResultSink` deben ser objetos existentes en el mismo proceso para respetar el binding por identidad. La ruta Windows no es una ruta del VPS y no se observó transporte/IPC aprobado entre ambos procesos.

La opción más coherente si se decide avanzar es co-localizar el runtime y el gateway en POSIX, junto a la cola y el sink, mediante una migración consistente y aprobada de la **misma** base de datos, con un solo escritor, respaldo verificado y rollback a la ubicación original. El rollback debe preservar el snapshot posterior al corte: nunca se reanuda desde el backup anterior por sí solo ni se reemplazan recibos posteriores. Primero se reconcilia cada efecto posterior; si no puede probarse su inclusión, la cola queda en HOLD. Un shim en PC conserva la ubicación actual, pero mantiene la PC encendida y requeriría que esa instancia recibiera callbacks sin duplicar la lectura Telegram del gateway; ese transporte no existe en la fuente revisada. No se eligió ni aprobó una topología de producción.

## Siguiente decisión humana concreta

Decidir si se autoriza preparar una migración de un solo dueño de la cola existente a POSIX, con respaldo SQLite consistente, comprobación de integridad/recibos, freeze del escritor único y rollback documentado, para después integrar el controller dentro del proceso existente del gateway. Esa decisión no autoriza por sí sola el cambio de servicio, un prompt real de Telegram, el submit a un proveedor ni el ejercicio de 30 minutos; cada gate de activación se conserva.

## Evidencia externa y contrato local

- [Reporte externo de fuente instalada](</E:/onia-wt/native-host-source-20261014/host-source-inspection-report.md>) — SHA-256 `8624874B97559765E96BC74208CC737205595B361F6B243E6CFC17BC98855464`.
- [Propuesta externa de integración/topología](</E:/onia-wt/native-host-source-20261014/native-gateway-integration-proposal.md>) — SHA-256 `4AC9848EB94EEEBEBAC758D47AF5D37B566B375D5A50B9B8DF580901F135C23D`.
- [Launcher local ya probado offline](../native_trusted_launcher.py) y [runbook de activación pendiente](../NATIVE-TRUSTED-LAUNCHER-RUNBOOK-20261014.md).

## Preflight del proceso gateway — 2026-10-15 (solo lectura)

Recibos saneados bajo `E:/onia-wt/native-host-runtime-preflight-20261015/`:

- Preflight de runtime completado `2026-10-15T04:29:01Z`; recibo SHA-256
  `1a290bb45afa0819400ed23fefcdc694eb92187fc560c315f25dfc9794bf0cd6`, salida
  saneada SHA-256 `bb932093facb555a53ef7040df86523aae82e67f5d7b6601720c8e96c3ddb58e`.
- Snapshot del proceso activo completado `2026-10-15T04:37:21Z`; recibo SHA-256
  `313c4dcaf687475486386b183ed2374223c6602ed903f5b20ce99d7fddeaed70`, salida
  SHA-256 `0f4b3bfdd7724e685f1ef595872d9e60246723783cacb08d3d2b5c689813c924`.
  Observó `hermes-gateway.service` activo, PID estable, Hermes 0.21.0 y metadata
  del proceso PTB 22.8 / HTTPX 0.28.1 / HTTPcore 1.0.9. Codex no aparece en el
  PATH efectivo del proceso; el `auth.json` de HOME predeterminado está ausente
  y `CODEX_HOME` no está definido (esto no demuestra ausencia global de auth).
  Una ruta POSIX verificada para la cola sigue `unknown_no_verified_candidate`.
- No se cambiaron ni desplegaron gateway, servicio, configuración, cola o
  credenciales; no se probó el objeto Bot ni el transporte efectivo del proceso.

La sonda SDK aislada terminó inconclusa, no PASS: `2026-10-15T04:42:37Z` a
`04:42:40Z`, exit code 2, recibo SHA-256
`e39400297ba93c0caed87d4c9582a1b39f02b37964d59d0085c424c8c54608ad`, código de
sonda SHA-256 `cc9a8ec419ad21a21b4557a1f7f099f100079460ac5c323e5db85dfce8cb3c82`.
La salida diagnóstica no estableció causa interna. Al revisar el runner se vio
que `--help` podía ejecutar código top-level antes de la comprobación; se
corrigieron localmente los tres runners con `main` guard, `argparse`, dry-run
por defecto y `--execute` bloqueado cuando ya existe output o receipt; no se
borra evidencia para reintentar. Quince casos sin SSH, con subprocess sentinel,
cubrieron import, help, default, argumento inválido y execute bloqueado; esto no
garantiza comportamiento si los receipts desaparecen. No se repitió la sonda ni
se atribuye el exit 2 a un fallo del SDK.

No se incluye código fuente crudo del gateway, configuración, credenciales, valores de tokens ni identificadores privados.
