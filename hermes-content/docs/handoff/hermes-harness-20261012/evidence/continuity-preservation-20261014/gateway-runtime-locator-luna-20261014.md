# Gateway runtime locator — 2026-10-14

## Resultado

- Estado: `PARTIAL / callback UNKNOWN`. Se identificó el proceso actual `hermes-gateway.service` y el entrypoint público real; no se localizó un callback Telegram que emita aprobación de operación.
- Snapshot público del servicio: `hermes-gateway.service` activo; entrypoint observado: módulo `hermes_cli.main`. PID, fragment path y executable path/generation se omiten de esta copia canónica por ser innecesarios.
- Source público del entrypoint: `hermes_cli/main.py`, SHA-256 `1DB8C4AC4B45B4AB50761CD3101F8F129165C0FE067EFFBB1E7A2A5C6EDC402E`, 139845 bytes. AST estático: importa `hermes_cli.gateway`, `hermes_cli.subcommands.gateway`, `hermes_cli.subcommands.pairing`; su símbolo relacionado con approvals es `cmd_approvals` (línea 2080), un comando CLI, sin evidencia aquí de ser callback Telegram.
- Otros dos módulos públicos incluidos en el tope: `gateway/platform_registry.py` SHA-256 `C139553995616038AA5B2166E69F351D25E7B242D3DE52D1443AFB894D2E45C7`, 20568 bytes; `hermes_cli/approvals_suggest.py` SHA-256 `B17B3201442321654E7EEC6C3D274EE7819DE89D3F720C1BCEA8A1CB407798FA`, 15599 bytes. Símbolos de approvals de este último (`scan_approval_history`, `approvals_command`) describen análisis/historial y comando CLI; no acreditan callback ni autoridad del piloto.
- Límite consumido: 2 conexiones SSH de solo lectura; lectura AST de 3 módulos públicos y 176012 bytes. No se ejecutaron imports/handlers ni se inspeccionó entorno, args ajenos al nombre del módulo, configuración de unidad, secretos, authstore, logs, conversaciones, Telegram API o cola real.
- La inspección anterior de `gateway/authz_mixin.py` y la búsqueda sin candidato Telegram quedan como antecedentes del recibo `gateway-binding-luna-20261014.md` (SHA-256 `7B43BB750E87315E318256AC932ACFFE763DDF26D6C5FE9EABAC88FB0382E1C5`); no se repitieron.

## Recibos

- Llamada 1: exit 0; stdout JSON 398 bytes; stderr vacío. Consultó solo `systemctl show` (`MainPID`, `FragmentPath`), `/proc/PID/exe` y el nombre de módulo `.py`/`-m` del cmdline.
- Llamada 2: exit 0; stdout JSON 4065 bytes; stderr vacío. Resolución estática de `hermes_cli.main` dentro del código público conocido y AST de hasta tres módulos. Recibos estructurados íntegros: `gateway-runtime-locator-luna-20261014.receipt.json`.

## Próximo dato necesario

El snapshot prueba que el gateway activo arranca desde `hermes_cli.main`; no prueba cuál import dentro del proceso registra el transport Telegram ni el handler de aprobar/rechazar una operación. La lectura de `hermes_cli.gateway` / `hermes_cli.subcommands.gateway` y del módulo Telegram que ese código invoque queda pendiente de una nueva autorización de presupuesto de lectura remota. Hasta entonces, el callback preciso y su vínculo con digest/nonce/expiry siguen `UNKNOWN`; no hay base para enlazar el piloto ni atribuir autoridad.

## Seguimiento de runtime — 2026-10-14 22:44:50 UTC

- Una SSH readonly adicional (la tercera conexión acumulada) ejecutó análisis AST de las dos rutas directas indicadas bajo `/usr/local/lib/hermes-agent`: `hermes_cli/gateway.py` SHA-256 `FC82BBDD871031E177D21149A52B97FC02C7DC8D922B39B7C9809633F4629A10`, 282507 bytes, y `hermes_cli/subcommands/gateway.py` (su hash quedó dentro de la salida truncada y no se conserva). Total informado por el script: 292572 bytes. Exit 0, stderr vacío.
- El script encontró una llamada importada desde `probe_gateway_loop_liveness` a `gateway.shutdown_watchdog.get_loop_heartbeat_path`, pero no resolvió una ruta local (`resolved_path:null`); es una llamada de liveness, no evidencia de aprobación Telegram. No llegó a leer un tercer módulo.
- **Desviación del límite de captura:** por serializar todas las importaciones/llamadas AST, el stdout remoto fue 48189 bytes frente al máximo 12288. El relay visual de la herramienta truncó la salida. No se hará otra conexión SSH en esta tarea. La salida disponible no permite afirmar la cadena completa de arranque ni identificar callback; estado permanece `UNKNOWN`.
- Sin edición de código, import/ejecución de handlers, config, secretos, auth/session state, logs, Telegram API o cola. El seguimiento no amplía autoridad del piloto.
