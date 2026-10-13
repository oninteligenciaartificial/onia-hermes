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
reconciliación explícita con evidencia: `applied` cierra la tarea, `not_applied` la devuelve
a pending. El código no hace esa decisión automáticamente. La clave estable solo ayuda si
el destino la respeta; no garantiza exactly-once y, si el destino no deduplica, el owner debe
reconciliar el recibo antes de volver a intentar.

## Límites técnicos

Esto solo prueba coordinación entre procesos locales que comparten el mismo archivo SQLite
en un host. SQLite **no es** un checkpoint distribuido entre runtime cloud y VPS, ni una
garantía para múltiples hosts o almacenamiento de red. No es un supervisor 24/7, no despierta
la PC apagada y no demuestra lectura/follow-up de chats existentes. El archivo no trae cifrado,
backup, retención, hardening de permisos del directorio, daemon, scheduler, métricas, cuota ni
pausa operacional. La ruta y cuenta de servicio para un piloto en VPS no están elegidas.

La interfaz `OfficialCodexCloudAdapter` está separada, pero
`official_codex_cloud_adapter()` siempre falla cerrado: no se verificó una API oficial
soportada de lectura/follow-up para los workers/chat IDs existentes. Un UUID observado o la
existencia de una CLI no prueban compatibilidad con `--env`. Las pruebas usan únicamente un
fake local, que cuenta una llamada y devuelve un resultado ambiguo. No existe implementación
real, credencial, envío ni endpoint.

## Prueba focal

Desde este directorio, con Python 3 estándar ya presente:

```sh
python3 -m unittest -v test_sqlite_pilot.py
```

Los siete tests cubren claims concurrentes (un owner), fencing del owner vencido, reanudación
desde checkpoint íntegro y bloqueo por digest inválido, efecto ambiguo `needs_reconcile` sin
segundo envío (incluido recovery tras crash/lease vencido), clave estable después de
reconciliación explícita, y adapter cloud no disponible. Usan solo base SQLite temporal. No
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
