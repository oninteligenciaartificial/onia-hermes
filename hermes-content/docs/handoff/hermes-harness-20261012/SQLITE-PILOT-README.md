# Prototipo local de cola, leases y checkpoints SQLite

Estado: **prototipo offline probado; no instalado ni conectado a Codex Cloud**.

`sqlite_pilot.py` usa solo Python estándar y SQLite (prueba observada local con SQLite
3.53.1; la sintaxis UPSERT requiere SQLite 3.24 o posterior, versión del VPS aún desconocida).
Una transacción `BEGIN IMMEDIATE`
serializa los claims locales; hay una lease por worker, owner registrado y un fencing token
monótono. Un owner viejo no puede escribir tras vencer/sustituirse su claim. La clave de cada
efecto es estable por worker/contrato/input/paso/nombre de efecto y no incluye el fencing token.
Los checkpoints versionados guardan repo/ref/SHA, contract ID, input SHA, paso, estado y evidencia; su digest
se verifica al reanudar. Un lease vencido con efecto marcado `in_flight` queda
`needs_reconcile`; no se vuelve a llamar al adapter. La única salida de ese estado es una
reconciliación explícita con evidencia: `applied` cierra la tarea. `not_applied` solo vuelve
a pending cuando se entrega una aprobación manual **simulada** que identifica al owner y
fencing token ambiguos exactos, incluye una referencia concreta y declara uno de estos gates:
owner terminado, fencing del destino verificado o idempotencia del destino verificada. El
vencimiento de lease por sí solo nunca demuestra quiescencia. La interfaz local solo valida
la forma y correspondencia de esa evidencia; no observa procesos ni verifica el destino, así
que no constituye autorización de producción. Sin ese gate la tarea queda bloqueada en
`needs_reconcile`. La clave estable solo ayuda si el destino la respeta; no garantiza
exactly-once y, si el destino no deduplica, el owner debe reconciliar el recibo antes de
volver a intentar.

## Límites técnicos

Esto solo prueba coordinación entre procesos locales que comparten el mismo archivo SQLite
en un host. SQLite **no es** un checkpoint distribuido entre runtime cloud y VPS, ni una
garantía para múltiples hosts o almacenamiento de red. No es un supervisor 24/7, no despierta
la PC apagada y no demuestra lectura/follow-up de chats existentes. El archivo no trae cifrado,
backup, retención, hardening de permisos del directorio, daemon, scheduler, métricas, cuota ni
pausa operacional. La ruta y cuenta de servicio para un piloto en VPS no están elegidas.

La interfaz `OfficialCodexCloudAdapter` está separada, pero
`official_codex_cloud_adapter()` siempre falla cerrado: no se verificó una API oficial
soportada de lectura/follow-up para los cinco workers/chats existentes. Sus UUIDs y una CLI
no prueban compatibilidad con `--env` ni autorizan continuar esos hilos. Las pruebas usan
únicamente un fake local; no existe implementación real, credencial, envío ni endpoint.

## Opción documentada, separada: Agents API para sesiones nuevas

La documentación oficial describe otro camino técnico para **sesiones nuevas**: Agents API
`sessions.create` y operaciones para continuar/observar sesiones, más un entorno self-hosted
con `codex exec-server`, identificador de entorno, una environment key de permisos mínimos y
conexión saliente WebSocket. Referencias primarias: [self-hosted environments](https://developers.openai.com/api/docs/guides/agents-api/environments/self-hosted)
y [Agents API sessions](https://developers.openai.com/api/docs/guides/agents-api/sessions).
El ciclo candidato sería crear una sesión nueva, continuarla con el estado/checkpoint aprobado
y consultar su resultado; no equivale a leer o seguir los chats Codex Cloud actuales.

Esto está documentado, pero **no implementado ni probado aquí**: no hay adapter, llamadas,
sesión, entorno, keys ni permiso configurados. La autenticación descrita requiere una
`OPENAI_API_KEY` con scopes `api.agents.read`, `api.agents.write` y `api.responses.write`,
además de una environment key separada con permisos mínimos. El uso de modelos se factura a
tarifas de API y no se ha estimado el costo real de ONIA; tampoco se han verificado beta,
elegibilidad o disponibilidad para la cuenta. Antes de cualquier implementación harían falta
revisión de arquitectura y privacidad, consentimiento para enviar los datos de las tareas,
identidades separadas y acotadas, límites de costo/retención, y autorización explícita para
configurar el entorno y ejecutar un canario finito. Estas referencias no autorizan instalar,
crear sesiones, transferir credenciales ni activar un loop.

## Prueba focal

Desde este directorio, con Python 3 estándar ya presente:

```sh
python3 -m unittest -v test_sqlite_pilot.py
```

Los nueve tests cubren claims concurrentes (un owner), fencing del owner vencido, reanudación
desde checkpoint íntegro y bloqueo por digest inválido, rechazo de pasos de checkpoint vacíos,
efecto ambiguo `needs_reconcile` sin segundo envío (incluido recovery tras crash/lease vencido),
rechazo de reintento sin evidencia de quiescencia del owner/claim exacto y reintento solo tras
gate manual simulado, clave estable después de reconciliación explícita, y adapter cloud no
disponible. Usan solo base SQLite temporal. No
ejecutan los 18 casos baseline, red, workers, servicios o comandos cloud.

## Componentes, costo y gates para una instalación

El artefacto agrega solo dos archivos Python; no requiere instalación de paquetes, servicio ni
infraestructura. En local consume CPU/disco temporales durante los tests. **Costo de VPS no
medido**: una ejecución futura consumiría almacenamiento persistente y CPU/RAM del VPS; no hay
precio confirmado ni gasto cloud comprobado.

Antes de solicitar aprobación de instalación aislada se necesita una revisión de arquitectura
que confirme si SQLite en un solo VPS sirve al alcance inicial y elija ruta dedicada, owner OS
sin privilegios, cuotas/backups/retención, permisos, operación de pausa y criterio de rollback.
La aprobación concreta sería instalar únicamente el prototipo SQLite en el VPS existente bajo
esa cuenta/ruta aislada, sin credenciales ni red, y medir recuperación tras reinicio; esta
aprobación **no autorizaría** adapter, follow-up, scheduler, conexión cloud o loop permanente.

Para autonomía PC-off queda otro gate independiente: fuente/documentación oficial vigente que
soporte la operación contra los workers existentes, identidad ya autorizada con scope mínimo,
revisión del método de recuperación y una prueba finita autorizada con canario. Mientras falte,
no pedir ni usar nuevos secretos y no instalar el prototipo como si cerrara ese bloqueo.
