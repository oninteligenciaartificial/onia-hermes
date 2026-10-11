# C11 - Plan para usar el cupo de Codex al 100 % util (version corregida)

Medido 2026-10-11 ~05:32-05:35 UTC. Fuentes: `~/.codex/sessions/**/*.jsonl` (solo lectura), `node scripts/codex-cupo.mjs`, `scripts/codex-tarea.sh`, `hermes-content/docs/cola/loop/madre.md`. Mediciones con scripts en el scratchpad de la sesion (no commiteados). UNKNOWN donde no se puede medir.

Correccion frente a la version anterior: se quitan la tasa de estres 1,27 (no sale de ningun calculo), el "20 % de margen" invertido, la regla de horario :05/:35 (sin base en la fuente) y el cambio de cabecera de `codex-tarea.sh` (la cabecera ya es correcta). El tope pasa de sesiones a tokens.

## Estado medido

1. Cupo semanal ahora.
   - `node scripts/codex-cupo.mjs --json` (medido 2026-10-11T05:32:45Z): `usado_pct: 0`, `reinicio_utc: 2026-10-18 05:16`, `reinicio_pasado: false`.
   - Ultimo cambio de ventana en los `rate_limits` semanales: 2026-10-11T05:16:26Z, 58 -> 0, `resets_at` 10-14 03:57 -> 10-18 05:16. Reinicio anticipado; causa UNKNOWN.

2. Ventanas semanales (limites por cambio de `resets_at`):

| Ventana | Inicio -> cierre (UTC) | % al cierre | Sesiones que empezaron | Tokens totales | Sesiones por 1 % | Tokens por 1 % |
|---|---|---|---|---|---|---|
| Wa | 10-04 23:30:09 -> 10-07 03:57:43 | 85 | 14 | 137,9 M (una sesion = 105 M) | 0,16 | 1,62 M |
| Wb | 10-07 03:57:43 -> 10-11 05:16:26 | 58 | 114 (111 hasta 10-10 18:01:23) | 112,3 M | 1,97 (1,91 hasta 18:01) | 1,93 M (hasta 18:01) |
| Wc | 10-11 05:16:26 -> ahora | 0 (1,6 M consumidos, aun sin 1 %) | 10 | 1,6 M | - | - |

   - El 58 % se alcanzo a 10-10 18:01:22Z y no se movio hasta el reinicio. La ventana Wb tardo 3,6 dias en llegar al 58 %.

3. Tamano por sesion (sesiones con tokens):
   - Wb (105 sesiones): media 1,07 M, mediana 0,78 M.
   - Desde 10-08 por modelo (115 sesiones): Astra n=74, media 1,28 M, mediana 1,03 M. Sol n=36, media 0,53 M, mediana 0,21 M.

4. Consumo por dia UTC (sesiones que empezaron ese dia, tokens totales):

| Dia UTC | Sesiones con tokens | Tokens | Equivale a % semanal (1,93 M/%) |
|---|---|---|---|
| 10-08 | 61 (41 Astra) | 53,8 M | 27,9 % |
| 10-09 | 36 (25 Astra) | 54,7 M | 28,3 % |
| 10-10 | 7 (5 Astra) | 3,8 M | 2,0 % |
| 10-11 (hasta 05:35) | 11 (3 Astra) | 2,1 M | 1,1 % |

   - Dos dias consumieron 56 % de la semana. Medido con `node scripts/codex-tokens-dia.mjs 2026-10-08` = 53783850 y `... 2026-10-09` = 54714102.

5. Rafagas de sesiones:
   - 10-08 17:10:16 -> 20:46:00 UTC: 66 sesiones, 53,8 M, cupo 3 % -> 33 % (30 pts). 1,79 M por 1 %.
   - Sesiones por 1 % varian entre rafagas: 2,2 (10-08) y 0,92 (10-09 09:35 -> 12:45: 11 sesiones, 40 % -> 52 %). La unidad de cuenta es tokens, no sesiones.

6. Modelos:
   - Desde 10-05: 132 sesiones. Astra 84 (64 %), Sol 41 (31 %), gpt-5.5 4, luna 3. Campo `model` = primer `"model"` del `.jsonl`.
   - Ventana Wb: Astra 75 de 114 (66 %), Sol 37.
   - Quien lanza Astra: desde 10-07 hay 39 sesiones Astra que son subagentes (`payload.source.subagent.thread_spawn`), y su padre es siempre una sesion Astra (39 de 39 mapeados; 1 subagente Sol con padre Sol). Las demas Astra son sesiones de nivel superior (`originator codex_exec`, `source exec`) con cwd en `onia-platform-codex-*`, mas 1 sesion `Codex Desktop`. El lanzador de las de nivel superior: UNKNOWN. No es `scripts/codex-tarea.sh`, que por defecto usa `gpt-6.1-sol` (lineas 46, 52, 58).

7. Lanzador y gate:
   - `grep -n codex-cupo scripts/codex-tarea.sh`: sin resultados. El lanzador no consulta cupo ni tokens.
   - `scripts/codex-cupo.mjs` aparece como no versionado (`??`) en el worktree. El gate depende de el: debe commitearse junto con el gate.
   - `scripts/codex-cupo.mjs` sin dato imprime `UNKNOWN` a stdout y sale con 2 (no JSON).

8. Horario y publicaciones:
   - Publicacion de `onia-platform` a las :50 UTC en las horas 00, 03, 06, 09, 12, 15, 18 y 21 (`madre.md` lineas 24-25). Regla vigente: la madre no pushea a `onia-platform` entre :20 y :10 de esas horas. El fallo del 10-10 se atribuye a builds en el runner del VPS por pushes de la madre (`madre.md` linea 23).
   - Latidos de nubes: :17 Plataforma, :27 Marca, :47 Lucia, :57 Hermes (brief; `madre.md` linea 144).
   - Ronda de la madre: :07, :27, :47, lanza Codex (`madre.md` linea 144).
   - Crons de `.github/workflows` 10:00, 10:10 y 11:00 UTC: del brief, no re-medidos.
   - Codex corre en la PC y no hace git (cabecera de `codex-tarea.sh`): no toca el runner del VPS ni el push de `onia-platform`. Por eso no hay restriccion de minutos para Codex.

9. Codex cloud: cupo UNKNOWN en esta PC.

## Brecha

1. El lanzador no mira el cupo ni los tokens del dia. Sin gate, un dia puede consumir 28 % de la semana (10-08 y 10-09 consumieron 56 %).
2. El gate de 90 % semanal solo no frena una rafaga: el 58 % tardo 3,6 dias y el 28 % llego en un dia. Hace falta tope diario en tokens.
3. Un tope de 20 sesiones/dia no protege: 20 sesiones Astra consumen 20 x 1,28 M = 25,6 M, mas que el dia completo que cabe (24,8 M).
4. Astra es 64-66 % de las sesiones, y las subagentes Astra se multiplican desde padres Astra. La regla "Sol por defecto" no se cumple en la practica. Lanzador de las Astra de nivel superior: UNKNOWN.
5. `scripts/codex-cupo.mjs` no esta versionado y el lanzador no lo llama.
6. `hermes-content/docs/ONIA_HARNESS.md` linea 37 esta desactualizado: dice que la cabecera de `codex-tarea.sh` dice "codigo = astra" (no es cierto: lineas 19-20 dicen sol para codigo cerrado) y cita los defaults en lineas 45, 51, 57 (son 46, 52, 58). El cupo citado (56 %) tambien esta viejo.
7. El horario de Codex no tiene causa medida. La restriccion real es la de `madre.md` lineas 24-25 (pushes de la madre a `onia-platform`).

## Calculo de capacidad (ventana 10-11 05:16:26Z -> 10-18 05:16:25Z, 7 dias)

- Tokens por 1 %: 1,93 M (Wb hasta 18:01).
- Reserva 10 %: 90 % x 1,93 M = 173,7 M por ventana. Por dia: 173,7 / 7 = 24,8 M. Tope diario propuesto: 24 M tokens (UTC).
- Ya consumido en Wc: 1,6 M al medir (05:32 UTC). Quedan ~172 M para la ventana.
- Tareas por dia con 24,8 M/dia, segun media por sesion:

| Mezcla | Media por sesion | Tareas por dia |
|---|---|---|
| Mezcla de Wb (66 % Astra) | 1,07 M | 23 |
| Mezcla de 10-08 (61 sesiones, 53,8 M) | 0,88 M | 28 |
| Solo Sol | 0,53 M | 47 |
| Solo Astra | 1,28 M | 19 |

- Plan de 20 tareas/dia: cabe con la mezcla de Wb (media 1,07 M < 1,24 M; deja 16 % de margen). Con el tope de 24 M, 20/dia deja de caber si la media pasa de 1,20 M, es decir si Astra supera ~89 % de las sesiones.
- Decision: no fijar un numero de tareas. El control es el tope de tokens de 24 M/dia y el gate de 90 % semanal. El conteo de sesiones se reporta solo como dato.
- Horas: no limitan la capacidad, solo el horario de push de la madre (ver Estado 8).

## Configuracion propuesta

### 1. Gate en `scripts/codex-tarea.sh` (insertar despues de la linea 26, antes de `if [ "${1:-}" = "revisar" ]`)

Probado en el scratchpad con 5 casos (ver Prueba de hecho, punto 4). Con `set -euo pipefail` no rompe el script: todos los fallos de medicion terminan en `exit 3` con mensaje UNKNOWN.

```sh
# Cupo Codex (C11): corta si la semana va >= 90 % o si los tokens de hoy (UTC) pasan 24 M.
# Sin dato = UNKNOWN (exit 3). Ventana ya reiniciada = 0 % (un dato viejo no bloquea para siempre).
cupo_json=$(node "$(dirname "$0")/codex-cupo.mjs" --json 2>/dev/null || true)
pct=$(printf '%s' "$cupo_json" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const w=JSON.parse(s).ventanas.find(v=>v.ventana==="semanal");if(!w){console.log("X");return}console.log(w.reinicio_pasado?0:Math.round(w.usado_pct))}catch{console.log("X")}})')
case "$pct" in ''|X) echo "[cupo] UNKNOWN: sin dato de cupo; no despacho" >&2; exit 3 ;; esac
if [ "$pct" -ge 90 ]; then echo "[cupo] semanal ${pct} % usado (>= 90 %): no despacho" >&2; exit 3; fi
dia_tok=$(node "$(dirname "$0")/codex-tokens-dia.mjs" 2>/dev/null || echo X)
case "$dia_tok" in ''|X) echo "[cupo] UNKNOWN: sin dato de tokens de hoy; no despacho" >&2; exit 3 ;; esac
if [ "$dia_tok" -ge 24000000 ]; then echo "[cupo] tokens de hoy ${dia_tok} (>= 24 M): no despacho" >&2; exit 3; fi
echo "[cupo] semanal ${pct} % usado | hoy ${dia_tok} tokens" >&2
```

Aplica a `tarea`, `resume` y `revisar`, porque los tres pasan por esa zona del script antes de `salida`.

### 2. Archivo nuevo `scripts/codex-tokens-dia.mjs` (contenido exacto, probado)

```js
// Tokens Codex de un dia UTC: suma del total_tokens final de cada sesion que empezo ese dia.
// Uso: node scripts/codex-tokens-dia.mjs [AAAA-MM-DD]   (sin fecha = hoy UTC). Salida: un entero.
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
const root = join(process.env.CODEX_HOME || join(homedir(), '.codex'), 'sessions');
const dia = process.argv[2] || new Date().toISOString().slice(0, 10);
const walk = (d) => readdirSync(d, { withFileTypes: true })
  .flatMap((e) => (e.isDirectory() ? walk(join(d, e.name)) : e.name.endsWith('.jsonl') ? [join(d, e.name)] : []));
let total = 0;
for (const f of walk(root)) {
  const lines = readFileSync(f, 'utf8').split('\n').filter(Boolean);
  let ini = '';
  try { ini = JSON.parse(lines[0]).timestamp || ''; } catch { continue; }
  if (!ini.startsWith(dia)) continue;
  let last = 0;
  for (const l of lines) {
    if (!l.includes('total_token_usage')) continue;
    try { const t = JSON.parse(l)?.payload?.info?.total_token_usage?.total_tokens; if (t) last = t; } catch { /* linea truncada */ }
  }
  total += last;
}
console.log(total);
```

Requiere `scripts/codex-cupo.mjs` versionado (hoy no lo esta).

### 3. Documento `hermes-content/docs/ONIA_HARNESS.md`, linea 37

Reemplazar el `<li>` que dice "La cabecera dice "código = astra" (líneas 19-20), pero los tres valores por defecto son gpt-6.1-sol (45, 51, 57)." por:

```html
<li>Cabecera (líneas 19-20) y los tres valores por defecto (46, 52, 58) son gpt-6.1-sol, también para código cerrado. Astra solo para seguridad, cobros, infra con root o lógica de riesgo.</li>
```

En la misma celda, "56 %" se reemplaza por "ver `node scripts/codex-cupo.mjs`".

### 4. Texto para `.claude/skills/onia-sesion-madre/SKILL.md` y `hermes-content/docs/cola/loop/madre.md` (pegar tal cual)

> Antes de repartir trabajo a Codex, el lanzador `scripts/codex-tarea.sh` mira el cupo solo. Corta (exit 3) si la semana va >= 90 % o si los tokens de hoy (UTC) pasan 24 M. Si corta con UNKNOWN, no hay Codex hasta que el dato exista. En un brief, el cupo se cita con la salida del script y su hora UTC; no se copia un % de un documento viejo.
>
> Codex puede lanzarse a cualquier minuto. La restriccion de horario es la de la madre: no pushear a `onia-platform` entre :20 y :10 de las horas de publicacion (00, 03, 06, 09, 12, 15, 18 y 21 UTC; la publicacion sale a :50).
>
> Astra no se lanza para codigo cerrado. Las sesiones Astra de nivel superior las autoriza la madre de desarrollo-infra.

## Quien la aplica

- **Madre de desarrollo-infra (la PC):** puntos 1 a 4 (`scripts/codex-tarea.sh`, `scripts/codex-tokens-dia.mjs`, `scripts/codex-cupo.mjs` y `ONIA_HARNESS.md`) en un solo commit. Es quien lanza `codex-tarea.sh` y puede commitear; Codex no hace git. El commit debe incluir `codex-cupo.mjs` (hoy sin versionar).
- **Madre de marketing:** no lanza Codex hasta que el gate este en `main`. Despues usa el mismo tope y no edita `scripts/`. Lucia, Marca y Ventas no lanzan Codex por su cuenta.
- **Sesiones en la nube (Plataforma y Hermes):** no aplica. No lanzan `codex-tarea.sh`. Codex cloud queda UNKNOWN.
- **Sergio Urcullo:** decide solo si cambia el tope de 24 M/dia o el umbral de 90 %, y si siguen las Astra de nivel superior. Sin su decision se aplica el valor propuesto.
- **Integrador:** merge a `main` tras la prueba de hecho.

## Prueba de hecho

1. `node scripts/codex-cupo.mjs --self-test` imprime `self-test OK`, exit 0.
2. `node scripts/codex-tokens-dia.mjs 2026-10-08` imprime `53783850`, y `node scripts/codex-tokens-dia.mjs 2026-10-09` imprime `54714102` (dias pasados; no cambian).
3. `bash -n scripts/codex-tarea.sh` sale con exit 0.
4. Gate con `CODEX_HOME` temporal (probado en el scratchpad con la seccion 1 y la 2):
   - `CODEX_HOME` real: `[cupo] semanal 0 % usado | hoy ... tokens` y continua (exit 0).
   - `CODEX_HOME` sin `sessions/`: `UNKNOWN`, exit 3.
   - Un `.jsonl` con `used_percent` 95 y `resets_at` futuro: `>= 90 %`, exit 3.
   - Un `.jsonl` con `used_percent` 58 y `resets_at` pasado: se toma 0 %, continua.
   - Un `.jsonl` de hoy con `total_tokens` 25000000: `>= 24 M`, exit 3.
   - Con `CODEX_HOME=<tmp> bash scripts/codex-tarea.sh <tarea> <carpeta>` y los casos de exit 3: no aparece carpeta nueva en `~/.codex/madre-tareas/` (`ls -t` antes y despues).
5. Dentro de 7 dias (hasta 10-18 05:16 UTC): `node scripts/codex-tokens-dia.mjs <dia>` <= 24 000 000 en cada dia UTC, y ningun `codex-tarea.sh` lanzado con el cupo en >= 90 %.
6. El horario no se prueba con Codex: la prueba es que la madre no pushea a `onia-platform` en la ventana :20-:10 de las horas de publicacion.

UNKNOWN restante: cupo Codex cloud; ventana corta de 5 h; costo real por modelo (no hay precio medido); lanzador de las sesiones Astra de nivel superior; causa del reinicio anticipado del 11-oct 05:16 UTC; si el gate asume 0 % cuando el reinicio ya paso y todavia no hay evento nuevo (es un supuesto, no una medicion).
