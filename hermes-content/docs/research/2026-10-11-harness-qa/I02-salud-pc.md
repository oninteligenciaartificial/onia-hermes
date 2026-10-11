# I02 - Salud de la PC para correr agentes y Codex

Solo lectura. Nada cerrado ni reiniciado. Unidades: GiB = bytes / 1GB de PowerShell (binario).
Las lecturas son instantaneas: cada cifra lleva su hora. No hay serie historica: la tendencia es UNKNOWN.

## Estado medido

Lecturas del 2026-10-11 (hora local), comandos `Get-CimInstance` y `Get-Process`, solo lectura.

| Metrica | Lectura (hora) | Umbral del equipo | Lectura |
|---|---|---|---|
| PoolPagedBytes | 5,90e9 B = 5,50 GiB (01:31:13); 5,53 GiB (01:31:49) | 3 GiB (fuente: `hermes-content/docs/handoff/madre-local.md:175`) | SUPERA 3 GiB (1,8x) |
| PoolNonpagedBytes | 1,21 GiB (01:31:13) | no definido | UNKNOWN como umbral |
| Memoria comprometida | 29,90 GiB de 35,65 GiB limite = 83,9 % (01:31) | no definido | alta |
| RAM libre (FreePhysicalMemory) | 4,23 GiB (01:31:13); 3,75 GiB (01:31:24); 3,63 GiB (01:31:49) de 23,65 GiB | propuesta: aviso < 1 GiB | OK hoy; baja en segundos |
| Disco C: libre | 6,71 GiB (01:31:13) de 464,39 GiB = 1,4 % | propuesta: aviso < 10 GiB | BAJO |
| Uptime | 21 h 11 min (01:31) | no definido | sin reinicio en el dia |

Comando de pool: `Get-CimInstance Win32_PerfRawData_PerfOS_Memory` (campo `PoolPagedBytes`).
Historial de referencia en la misma fuente (`madre-local.md:265`): pool del kernel 17 GB antes de reiniciar; 0,96 GB tras reinicio el 10-oct (hora no registrada). Sin serie entre esos puntos: UNKNOWN.

Procesos (Get-Process, 01:31):

- `claude`: 19 procesos, paged total 5.797,9 MB (~5,66 GiB). El mayor: PID 13616, paged 1.841 MB, WS 1.581,5 MB.
- `codex`: 4 procesos vivos (PID 6884, 8508, 12560, 17624), paged total 423,2 MB, WS maximo 262,9 MB.
- `node`: 12 procesos; PID 12016, paged 1.268,2 MB.
- `chrome`: 19 procesos (no se cierran: regla de Sergio Urcullo).

Top 10 por PagedMemorySize64 (todos los procesos, no solo los del filtro), MB:
1841 (claude 13616), 1268,2 (node 12016), 962 (claude 18840), 889,9 (dwm), 879,6 (CamoStudio), 771,1 (claude 4684), 650,1 (WhatsApp.Root), 484,2 (ChatGPT 9224), 476,9 (ChatGPT 18348), 465,9 (msedgewebview2 22896). Suma: 8.688,9 MB.

Nota: `PagedMemorySize64` es la memoria paginable del proceso. No es el pool del kernel (`PoolPagedBytes`). Por eso no sirve para atribuir ni descartar la causa del pool.

## Brecha

1. PoolPagedBytes 5,5 GiB supera 3 GiB. Causa: UNKNOWN. Con esta medicion no se puede atribuir a un proceso. Para atribuir hace falta una herramienta de pool (poolmon o RAMMap), como medicion aparte.
2. RAM libre bajo y variable: 3,6 a 4,2 GiB en 36 s. Hoy no llega a la propuesta de 1 GiB.
3. Memoria comprometida 83,9 % del limite. Un proceso nuevo de Codex puede empujarla mas.
4. Disco C: 6,71 GiB libres (1,4 %). Codex y los worktrees escriben ahi.
5. Codex: hoy hay 4 procesos `codex` vivos (423 MB paged). El resumen anterior decia "sin codex en ejecucion": era falso. Solo era cierto para el top 10 por memoria de trabajo.
6. No hay umbral de 1 GiB de RAM para Codex en el repo: la busqueda en `hermes-content/docs/ONIA_HARNESS.md` y en `handoff/madre-local.md` no lo encontro. Es propuesta, no regla. UNKNOWN como dato del equipo.
7. No cerrar Chrome ni WhatsApp (regla de Sergio Urcullo; `madre-local.md:264`).

## Configuracion propuesta

Sin cerrar ni reiniciar nada. Bloque de medicion (PowerShell 5.1, solo lectura). Verificado: corre y da una linea por lectura (01:31:49: `paged_pool_GB=5.53 free_ram_GB=3.63 free_C_GB=6.7`, con avisos de pool y disco).

```powershell
$m = Get-CimInstance Win32_PerfRawData_PerfOS_Memory
$os = Get-CimInstance Win32_OperatingSystem
$c = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
$pagedGiB = [math]::Round($m.PoolPagedBytes/1GB,2)
$freeRamGiB = [math]::Round($os.FreePhysicalMemory/1MB,2)
$freeCGiB = [math]::Round($c.FreeSpace/1GB,2)
"paged_pool_GiB=$pagedGiB free_ram_GiB=$freeRamGiB free_C_GiB=$freeCGiB hora=$(Get-Date -Format HH:mm:ss)"
if ($pagedGiB -gt 3) { "AVISO: paged pool > 3 GiB (umbral de madre-local.md)" }
if ($freeRamGiB -lt 1) { "ALTO (propuesta): RAM libre < 1 GiB, no lanzar Codex" }
if ($freeCGiB -lt 10) { "AVISO (propuesta): disco C libre < 10 GiB, avisar antes de crear worktrees" }
```

Texto para pegar en `hermes-content/docs/ONIA_HARNESS.md`, seccion de salud de la PC (pendiente de que la madre lo aplique):

> Antes de lanzar Codex o una tanda de sesiones, correr la medicion de salud y registrar la linea en el handoff. Si el paged pool supera 3 GiB, la madre avisa a Sergio Urcullo y no lanza tandas nuevas hasta que el pool baje. Si la RAM libre queda por debajo de 1 GiB (propuesta), no se lanza Codex. Si el disco C tiene menos de 10 GiB libres (propuesta), la madre avisa antes de crear worktrees. No se cierran Chrome ni WhatsApp. No se reinicia sin OK de Sergio Urcullo.

## Quien la aplica

- **Sergio Urcullo**: decide reinicio de la PC y liberar espacio en C:. Motivo: son acciones suyas; Chrome y WhatsApp son memoria de uso personal.
- **Madre desarrollo-infra** (ordena Plataforma y Hermes, mas VPS, infra y harness): agrega el bloque al arranque de cada tanda Codex y el texto a `ONIA_HARNESS.md`. Motivo: es la madre que lanza Codex (`scripts/codex-tarea.sh`).
- **Madre marketing** (ordena Lucia, Marca personal, Ventas y pauta): corre el mismo bloque antes de sus tandas de Higgsfield y pauta. Motivo: comparte la PC y el mismo pool. El nombre `madre-dev` no aparece en el repo; los nombres salen del reparto del 11-oct.
- **Integrador**: no aplica nada. Motivo: no es cambio de codigo de producto.

## Prueba de hecho

1. Correr el bloque de la seccion anterior. Salida esperada: una linea `paged_pool_GiB=... free_ram_GiB=... free_C_GiB=... hora=...`.
2. Hecho cuando: (a) `ONIA_HARNESS.md` contiene el texto de arriba, y (b) la madre pega la linea en su handoff antes de cada tanda Codex durante 3 tandas seguidas.
3. Brecha del pool (5,5 GiB): UNKNOWN. Para cerrarla: (a) medir tras un reinicio de Sergio Urcullo; (b) si el pool vuelve a superar 3 GiB en menos de 24 h, abrir sesion aparte con RAMMap o poolmon para atribuir la causa. Hoy no se cumple.
