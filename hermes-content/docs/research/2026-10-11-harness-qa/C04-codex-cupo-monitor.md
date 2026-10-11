# C04 - Codex: medicion del cupo (script)

## Estado medido
- Antes no habia forma de leer el cupo sin abrir la app. Los eventos `token_count` de `~/.codex/sessions/**/*.jsonl` traen `payload.rate_limits` (146 archivos, 158 MB).
- Forma real: `primary{used_percent, window_minutes:10080, resets_at(epoch s)}`, `secondary:null`, `plan_type:"prolite"`. Solo hay ventana SEMANAL; la corta (5 h) no aparece en ningun evento reciente -> corta = UNKNOWN.
- Construido: `scripts/codex-cupo.mjs` (sin dependencias, solo lectura, ~90 lineas). Opciones: sin args = tabla, `--json`, `--self-test` (fixture en memoria).
- `node scripts/codex-cupo.mjs --self-test` -> `self-test OK`
- `node scripts/codex-cupo.mjs` (11-oct 05:16 UTC) ->
```
Codex cupo (medido 2026-10-11T05:16:26.760Z UTC, plan prolite)
- semanal: 0% usado | reinicia 2026-10-18 05:16 UTC / 2026-10-18 01:16 La Paz
- corta: UNKNOWN (el ultimo evento no la trae)
```
- Dato que contradice el brief: el brief dice 58 % usado y reinicio 14-oct 03:57 UTC. Ese era el ultimo evento del 10-oct 18:14 (`resets_at 1791950261` = 14-oct 03:57 UTC). El evento del 11-oct 05:16 muestra 0 % y reinicio 18-oct: la ventana semanal ya se reinicio (o el plan cambio). Hay que dejar de planificar con "58 %".

## Brecha
- La madre decide el reparto Sol/Astra/Luna sin cifra viva; el 58 % estaba copiado a mano en el brief y quedo viejo.
- Ventana corta no medible desde los logs (UNKNOWN). Si Codex la aplica, solo se ve cuando un evento la incluya.
- El script lee solo la PC; Codex cloud (entorno Platform 6abad6a0...) tiene su propio cupo, no medido aqui.
- Dato envejece: si no hay sesion Codex nueva, el % es el del ultimo evento (el script avisa `YA REINICIO` si `resets_at` ya paso).

## Configuracion propuesta
1. Commitear `scripts/codex-cupo.mjs` (archivo nuevo, ya en el worktree).
2. En `scripts/codex-tarea.sh`, antes de lanzar Codex, imprimir el cupo (texto listo para pegar):
```sh
node "$(dirname "$0")/codex-cupo.mjs" || true
```
3. Regla para la madre (pegar en `onia-sesion-madre` y `ONIA_HARNESS.md`): "Antes de repartir trabajo a Codex correr `node scripts/codex-cupo.mjs`. >=80 % semanal: solo Luna/Astra para lo critico. >=95 %: nada a Codex, pasar a Claude. Nunca copiar el % a mano en un brief; citar la salida del script con su hora."
4. Gate opcional en `.github`/CI local: `node scripts/codex-cupo.mjs --self-test`.

## Quien la aplica
- Madre-dev: tiene `scripts/` y `codex-tarea.sh` y es quien lanza Codex; commitea el script y el hook (pasos 1-2).
- Madre-dev + integrador: regla del paso 3 en skill/harness (docs de infra son suyas).
- Madre-marketing: solo lee la regla; no toca el script.
- Sergio Urcullo: nada.

## Prueba de hecho
- `node scripts/codex-cupo.mjs --self-test` sale con `self-test OK` y exit 0.
- `node scripts/codex-cupo.mjs` imprime semanal con % y reinicio UTC/La Paz; exit 2 con `UNKNOWN` si no hay eventos.
- Tras el paso 2, `bash scripts/codex-tarea.sh ...` muestra la linea "Codex cupo" antes de ejecutar.
- Cruce: el % del script coincide con el ultimo `rate_limits` del jsonl mas nuevo (`grep -h rate_limits <archivo> | tail -1`).
