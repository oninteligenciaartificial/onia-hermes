# Gateway binding — estado corregido — 2026-10-14

- META: encontrar el hook público real que conecte el gateway con el intake/result sink existentes sin cola paralela ni autoridad inferida.
- Resultado: NO IMPLEMENTADO. El gateway público Telegram esperado no se encontró en la ruta indicada; la segunda inspección global no generó recibo utilizable. Hook exacto y autoridad de operación permanecen UNKNOWN.
- Rama/HEAD revisados: `codex/hermes-controller-hardening-20261013` / `2a1cc10328ea223fa73520cc3d047c00726590df`.
- Modelo configurado: Luna low. Modelo servido: UNKNOWN.
- Acceso SSH directo con la sesión existente: confirmado funcional en una lectura pública. No hace falta usuario ni login. El error DNS del alias `onia-vps` queda solo como antecedente local, no como bloqueo vigente.

## Hallazgo de autoridad

La captura pública del runtime (2026-10-14, SHA-256 `A9040F8DA109B5F43108FDC3DBED43C220254E24C71BC677901E634A9300C530`) ubica `_is_user_authorized` en `gateway/authz_mixin.py:473`. Su lógica observada trata identidad del remitente, pairing/allowlist y alcance de chat. No muestra aprobación vinculada a operación/digest/nonce/expiración ni `NativeWorkAuthorization`. Sender authorization no equivale a operation grant.

La lectura estática remota de `authz_mixin.py` confirmó la clase `GatewayAuthorizationMixin` y métodos públicos de autorización; no expuso un callback de aprobación que sirva para emitir la autoridad del piloto.

## Recibos SSH saneados

Todos los intentos se limitaron a lectura pública; no se leyó key data, config, authstore, logs, mensajes, home privado ni cola. Los comandos usaron `shell=False`, `python3 -I -B -` y solo lectura estática.

| Intento | Alcance y método | Resultado observable | Exit/stdout/error |
|---|---|---|---|
| Alias previo | `ssh onia-vps`; intento local anterior al launcher directo | Hostname no resuelto: `Could not resolve hostname onia-vps: Host desconocido`. No acredita fallo de la conexión SSH directa al VPS. | Exit code exacto y stdout byte count no quedaron registrados; diagnostic fue visible. |
| SSH directo autorizado #1 | Exact argv autorizado por Root a `root@187.77.16.63`; Python leyó `gateway/platforms/telegram.py` (esperado) y `gateway/authz_mixin.py`. El primer archivo devolvió `FileNotFoundError`; se leyó estáticamente solo el segundo, 31,118 bytes. | En salida: `UNREADABLE gateway/platforms/telegram.py FileNotFoundError`, `MODULE gateway/authz_mixin.py BYTES 31118`, símbolos y fragmentos AST. `authz_mixin.py` no era callback de aprobación. | El runner habría impreso `SSH_EXIT` ante nonzero; no apareció, por tanto exit 0. Bytes de stdout originales exactos no registrados; el relay local imprimía como máximo los primeros 12,000. Error SSH vacío/no presentado. |
| SSH directo autorizado #2 | Enumeración `rglob('telegram*')` bajo `/usr/local/lib/hermes-agent/gateway`; selección de candidato `.py` o paquete. | Un path: `assets/telegram-botfather-threads-settings.jpg`; `NO_TELEGRAM_SOURCE_CANDIDATE`. No se leyó source en esta conexión. Es solo resultado del glob, no inventario completo del gateway. | El runner habría impreso `SSH_EXIT` ante nonzero; no apareció, por tanto exit 0. Bytes exactos no registrados; relay local cap 12,000. Error SSH vacío/no presentado. |
| SSH directo autorizado #3 | Se preparó inventario `rglob('*.py')` limitado a 256 paths bajo `gateway`. | La herramienta local devolvió salida vacía. No hay recibo ni stdout de inventario. Estado: `inspection_failed_unknown`; stdout vacío NO significa que no existan rutas o archivos. | Exit code, bytes, typeof output/result y newError: UNKNOWN/no recibo utilizable. No inferir SSH conectado ni inspección completada. |

### Patrones estáticos usados

- Inspección con Python AST; no `import` de paquetes del gateway ni ejecución de sus funciones.
- En el módulo de autorización: selección de nombres `callback|approv|authoriz|authz|nonce|request|telegram|update|pairing|grant|allowlist|expiry|expire`; fuente pública con líneas sensibles a credenciales redactadas si coincidían con `password|secret|token|cookie|api_key|private_key`.
- En rutas: `Path.rglob('telegram*')`, luego candidatos `.py`/`__init__.py`/`platform.py`/`adapter.py`/`telegram.py`; el inventario global `rglob('*.py')` quedó con resultado local vacío y no se usa como evidencia.
- Se inspeccionó como máximo un módulo fuente remoto en el follow-up: `gateway/authz_mixin.py` (31,118 B). No se inspeccionó ningún callback.

## Piloto local y cambios

- `native_work_entrypoint.py`: `NativeWorkRuntime` requiere bindings trusted. `submit` queda en HOLD sin claim/authority; el CLI no enlaza runtime y queda `runtime_unbound`. Result sink requiere `store` y persiste con digest/request binding.
- `native_result_store.py` y `controller_pilot.py` ya existen. La cola histórica real no se abrió ni modificó.
- SHA-256: `native_work_entrypoint.py` `5B304AE0B77C30BDE16EA97EEEA79F4C469869718B9645F7980FC2DCBEEE182C`; `native_result_store.py` `FE23CE4D56C5B3727C88462F336A7E37A4E0495C966D29384A5C3ADCF21F63EF`; `controller_pilot.py` `00F311285FB315D87495FFA0A48C87F25EACD52CFA91A2CFEE67ECC53DEAA2D2`.
- No se creó una interfaz/adaptador duplicado o especulativo, no se ejecutaron pruebas, imports o servicios, y no hay cambios de código en el worktree.

## Camino directo para la siguiente tarea

Usar el launcher SSH directo ya probado (argv de Root, `shell=False`, timeout 20 s) para listar primero nombres públicos bajo `/usr/local/lib/hermes-agent/gateway` (tope 256; incluir rutas de `platforms/` y módulos Telegram). No repetir glob no confirmatorio. Una vez identificado el path real, leer estáticamente el módulo Telegram real y solo el módulo callback que importe o invoque, más el punto de autoridad existente si hace falta, dentro del límite de tres módulos/512 KiB/12 KiB de salida. No ejecutar imports ni handlers. Trazar la cadena desde callback a autoridad de operación y request digest antes de escribir binding; integrar en el seam existente si lo hay. Si esa cadena no existe, documentar el faltante exacto y evitar añadir una segunda API o autoridad paralela.

Elapsed por fase no se instrumentó; UNKNOWN. No se ejecutaron pruebas ni runtime. No commit/push.
