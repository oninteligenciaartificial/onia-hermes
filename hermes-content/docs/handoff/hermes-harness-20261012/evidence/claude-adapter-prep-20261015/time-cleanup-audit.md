# Auditoría focal de tiempo, fallos y limpieza — 2026-10-15

META: conservar evidencia útil de este trabajo sin mezclarla con historial ajeno. PRUEBA: `git status --short` en ambos checkouts, timestamps/recibos de este lote y revisión focal de archivos. PARADA: ningún borrado, mutación del checkout principal, llamada al proveedor, Cloud o base real.

## Tiempo verificable

| Hecho | Medición | Alcance |
| --- | --- | --- |
| Smoke Claude local | recibo `claude-live-smoke-20261015.json`: 1.583 s, Sonnet 5.5, 1 turno, 2 tokens entrada/17 salida, 0 web tools; timestamp 18:23:12Z | Duración de esa invocación; `total_cost_usd` es métrica CLI, no factura. |
| Revisión Claude del guard R4 | recibo `claude-review-r4-guard-20261015.json`: 20.016 s, 2 tokens entrada/1.823 salida; archivo modificado 18:31:10Z | Duración medida por adaptador de una llamada. Cache y costo de esa llamada no se conservaron; UNKNOWN. |
| Integración local inicial | `integration-receipt.json`: 18:28:50Z, 0 llamadas durante integración | Marca de integración, no duración completa. |
| Intervalo entre dos recibos | 18:23:12Z→18:31:10Z ≈7m58s | Solo diferencia entre timestamps de esos dos artefactos; **no** es duración total del turno ni esfuerzo activo. |
| Tramo de pared de esta orden | `response_item` de usuario «Seguí con lo pendiente para probar el navegador» en la sesión root `01a13f7b-a156-7150-ba99-b4ff682163a1` a 18:12:14.805Z → reloj UTC 18:34:39Z: **22m24s** al corte | Incluye investigación, delegación, esperas, QA y mensajes; la tarea seguía activa. No representa tiempo de CPU/LLM ni esfuerzo humano. Se extrajeron solo timestamps y rol del JSONL específico, sin volcar su contenido. |

El tramo desde esa orden hasta el corte es medible, pero no cubre el trabajo anterior de la sesión ni el posterior. No hay cronómetro integral ni atribución fiable del tiempo de espera por agente. **Duración total acumulada del proyecto: UNKNOWN**. Costo total, ahorro, loops de investigación y costo de contexto: **UNKNOWN**, sin estimación retrospectiva inventada.

## Fallos y reparación observada

- Sesión OAuth obsoleta durante la exploración inicial: reportada por el ejecutor; no encontré recibo temporal preservado que permita fecharla o medir su duración. Se reutilizó la sesión autorizada; no se copiaron credenciales.
- Primera QA del adaptador: `--receipt` existente se comprobaba después de la llamada y el parser podía aceptar éxito/modelo sin metadatos explícitos. Reparado con reserva exclusiva previa y semántica fail-closed; 11 tests focales pasaron antes de la revisión real.
- Revisión real: la CLI finalizó y el recibo quedó escrito, pero stdout CP1252 falló al codificar `≤`. Se recuperó el resultado desde el recibo **sin repetir la solicitud**. Delta posterior emite UTF-8 binario; 13/13 tests simulados pasaron, incluido CP1252 y faltantes de metadata como `null`. Sin nueva llamada live.
- El adaptador anterior omitía contadores de cache y costo estimado. El delta actual agrega `cache_creation_input_tokens`, `cache_read_input_tokens`, `server_tool_use` y `cost_estimate_usd` para **futuras** llamadas; no recupera esos datos de la revisión anterior ni prueba facturación.
- La revisión Claude acotada no encontró bypass demostrable en los extractos entregados. No vio `bootstrap.py`, supervisor ni cores; su frase de que replay queda sin probar aplica solo a esos extractos. El código original del candidato sí usa output exclusivo y claim local de un intento; la efectividad real en Cloud sigue sin ensayo. No convertir la respuesta del modelo en prueba de ausencia de replay.

## Estado y limpieza propuesta, sin ejecutar

- Checkout principal `C:/dev/proyectos/onia-hermes` en `main`: `AGENTS.md` modificado y `CODEX.md`/`madre-relevo-20261013.md` untracked. Son de otra sesión/propietario; **conservar intactos**.
- Worktree CODE `E:/onia-wt/hermes-controller-pilot-20261013` en `codex/hermes-controller-hardening-20261013`: solo dos directorios untracked de este lote, `evidence/claude-adapter-prep-20261015/` y `evidence/r4-recovery-20261015/browser-diagnostic-candidate/`. Conservar fuente, tests, manifiestos pendientes, recibo live saneado, plan y diseño; están listos para revisión/commit del propietario.
- `E:/onia-wt/claude-adapter-prep-20261015/` es preparación temporal: conservar allí por ahora el recibo de revisión real, prompt de revisión y Markdown limitado, además de deltas de adaptador hasta que el propietario decida qué integrar canónicamente. Comparar hashes antes de mover; la copia canónica inicial del adaptador precede al arreglo CP1252/metadata. El recibo temporal crudo de AppData no debe copiarse al repo.
- Ambos `__pycache__/` de este lote son bytecode regenerable creado por pruebas locales (2 archivos en prep, 6 en candidato browser): **eliminar solo después de confirmar que no están incluidos en un commit ni son necesarios para reproducir un incidente**. No borrar otros árboles ni artefactos ajenos. Candidato browser no es duplicado inútil: fuente/congelación/manifest/installer y pruebas son un paquete pendiente distinto del setup-only anterior.
- Búsqueda heurística por nombres/términos de secretos en Markdown/JSON de estos dos paquetes encontró menciones de política, no credenciales verificadas. Un segundo `rg -l` acotado a ambos paquetes (sin imprimir valores) no encontró patrones de clave privada ni asignaciones evidentes de `password`/`api_key`/`client_secret`. No se inspeccionaron valores secretos ni se puede garantizar ausencia total sin una revisión de staging focal antes del commit.

## Limpieza final ejecutada tras preservación publicada

Con autorización explícita, se verificaron individualmente los nueve archivos
temporales de `E:/onia-wt/claude-adapter-prep-20261015/`: cada uno coincidió byte
por byte y SHA256 con su copia canónica y con el blob del commit remoto publicado
`f54b8920afc5e531f55f6000a8e914cc079c5389`. Ruta absoluta resuelta exacta,
nueve archivos regulares, sin junction/symlink/subdirectorios. Se retiraron sólo
esos nueve archivos por rutas literales y después el directorio comprobado vacío,
sin borrado recursivo. `Test-Path` final=false. Las copias canónicas permanecen.
La limpieza de ocho `.pyc` y sus dos directorios vacíos propios ya estaba
registrada en `integration-receipt.json`; no se repitió ni se borró otro temporal.

El primer comando con eliminación en bucle calculado fue rechazado por revisión
automática antes de ejecutar. Se completó con inventario read-only y eliminación
no recursiva de la lista literal exacta; no se cambió de shell ni se amplió el
alcance. No se tocaron OAuth/AppData, otros worktrees, archivos ajenos, Cloud ni
la cola real. No hubo nuevas pruebas ni llamadas al proveedor durante este cierre.
