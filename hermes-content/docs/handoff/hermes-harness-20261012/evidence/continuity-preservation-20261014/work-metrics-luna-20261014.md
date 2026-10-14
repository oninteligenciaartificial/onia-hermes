# Métricas locales de Hermes — versión revisada 2026-10-14

META: snapshot READONLY coherente de estados y tiempos observables, sin confundir `done` del harness con el objetivo de negocio logrado.
PRUEBA DE HECHO: una lectura/export local en modo solo lectura; el snapshot está en `E:\onia-wt\work-metrics-snapshot-20261014.json`.
PARADA: sin cambios a la cola o sidecars, suites nuevas, provider, scheduler ni deploy. Publicación autorizada sólo para el archivo del exporter en `codex/hermes-controller-hardening-20261013`.

## Fuente final revisada

- `readonly_metrics.py` SHA-256: `45931969F759F2CAF32D90C8D07C73FDC297F449A670E4870A8A9629E99035E8`.
- QA independiente de los tres escenarios delta: PASS. La fuente no fue cambiada después de esa revisión.
- SQLite usa `mode=ro`, `PRAGMA query_only=ON`, `BEGIN` antes de todas las lecturas y rollback al cerrar la transacción.
- El CLI valida las rutas antes de leer o crear/escribir: bloquea alias/symlinks a la DB, sidecars `-wal`/`-shm`/`-journal` y recibo de entrada.
- El recibo copia sólo campos allowlisted con tipo y valores esperados; descarta campos anidados o arbitrarios.

## Snapshot observado

Snapshot SHA-256: `EFE960B86E3E605EBA99BB4026BB55C23D742003E789240101C7A9E2A112B816`.

- Schema 3: 4 tareas `done`, 4 efectos `applied`, 4 operaciones nativas `failed`, `stopped=false`.
- `task_lifecycle_span_seconds_min/max`: 745–1511 s. Estos valores son `updated_at-created_at`; no equivalen a edad actual ni duración por fase. `phase_durations` queda `UNKNOWN` porque el schema no registra transiciones.
- Recibo Linux: `pass`, 17 tests, 0 errores, 1 omitido, 38 file fsync, 96 directory fsync, duración de prueba 0.605908 s; `real_provider=false`, `real_queue=false` (integración aislada).
- `implementation_model_configured`: configuración declarada en el contrato (`gpt-6-luna low`); `run_model` y `served_model`: `UNKNOWN`.
- Tokens, USD y contexto activo: `UNKNOWN`.
- Precisión de medición: 6 decimales; el reloj monotónico reportó `0.000000` tras redondeo, insuficiente para atribuir tiempo útil al trabajo. Inicio/fin UTC aparecen separados en el JSON; en esta corrida el reloj registró el mismo instante.

## Verificación y publicación

La única lectura/export de esta versión produjo el snapshot indicado. La DB mantiene tamaño 114688 y `LastWriteTimeUtc` 2026-10-14 20:26:19Z. `git diff --check` limpio. Se publicará sólo `readonly_metrics.py` a la rama autorizada; el reporte y snapshot viven fuera del repositorio.

```powershell
python readonly_metrics.py --queue E:\onia-wt\onia-harness-native-run-20261014\queue.sqlite3 --receipt E:\onia-wt\native-result-store-probe-prepared-20261014\linux-receipt.json --output E:\onia-wt\work-metrics-snapshot-20261014.json
```
