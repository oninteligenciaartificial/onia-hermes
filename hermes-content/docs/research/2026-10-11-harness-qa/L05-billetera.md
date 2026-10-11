# L05 - Billetera de tokens: Claude + Codex (corregido)

Medido 2026-10-11, durante esta tarea (las cifras cambian en vivo; cada una es una foto). Solo lectura. `scripts/billetera-tokens.mjs` NO se edito: el cambio queda aqui.

## Estado medido

1. Alcance actual de `scripts/billetera-tokens.mjs` (18 lineas):
   - Raiz unica: `%USERPROFILE%\.claude\projects` (L2). Recorre todos los `.jsonl` con mtime en 24 h (L5-6). Incluye subagentes en el total.
   - Dedupe por `message.id` (L11). Solo Claude. `grep -i codex` no devuelve nada.
   - `argv[2]` solo sirve para la linea de contexto (L10), no para filtrar el reparto.
   - Mide TODAS las sesiones Claude, no una.

2. Ejecucion actual:
   ```
   node scripts/billetera-tokens.mjs                      -> TOTAL 24h 764.1 M · contexto actual madre v4 ≈ ?
   node scripts/billetera-tokens.mjs 35353b71-...         -> opus 459.2 M · sonnet 202.4 M · haiku 99.1 M · TOTAL 760.6 M · contexto ≈ 315k
   ```
   - Sin id, el contexto sale `?`. Con id mide 315k. El id de la madre hay que pasarlo siempre.
   - La linea `<synthetic>` (0.0 M, 182 msgs) no suma tokens: se puede ocultar, no afecta el total.

3. Codex en disco (lectura de `~/.codex`, solo conteos y sumas, sin contenido):
   ```
   sessions_jsonl 155 · sessions con mtime 24 h 19
   archived_sessions_jsonl 485 · con mtime 24 h 0
   ```
   - Formato: evento `payload.type == "token_count"`, con `payload.info.last_token_usage` (delta del turno) y `payload.info.total_token_usage` (acumulado). El modelo viene en lineas `"model":"..."`.
   - Cruce de la suma de deltas contra el total acumulado:
     - Solo archivos con mtime 24 h: 17 de 17 cuadran (`input_tokens` y `output_tokens` del total = suma de `last_token_usage`).
     - Todos los archivos con `token_count`: 108 de 136 cuadran. Los 28 que no cuadran son archivos viejos, fuera de la ventana: no afectan el reparto de 24 h. Su causa no se investigo (UNKNOWN).
   - Duplicados: 0 claves `timestamp|total_tokens` repetidas entre archivos en 24 h. Hoy no hay doble conteo por sesion reanudada.

4. Cupo Codex, `scripts/codex-cupo.mjs` (corrida previa de esta tarea, confirmada por el verificador):
   ```
   semanal: 0% usado | reinicia 2026-10-18 05:16 UTC
   corta: UNKNOWN
   ```
   - No cuadra con el "58 % usado, reinicio 14-oct 03:57 UTC" del contexto de la tarea. Origen de ese 58 % no verificado aqui. Queda UNKNOWN: la madre lo confirma en la app antes de usarlo.

## Brecha

| Punto | Estado medido | Efecto |
|---|---|---|
| Sesiones Claude | todas, 24 h, dedupe por `message.id` | cubierto |
| Sesiones Codex (`~/.codex/sessions`) | no recorridas por el script actual | la billetera subestima el gasto; no hay % Codex |
| `archived_sessions` | 485 .jsonl, 0 con mtime 24 h | hoy no afecta; si una sesion archivada tiene actividad, quedaria fuera |
| Criterio por archivo (suma de deltas = total) | 17/17 en 24 h | sirve como prueba de hecho; no en todo el historial (108/136) |
| Dedupe Codex | 0 duplicados en 24 h | sin doble conteo hoy; no hay mecanismo permanente |
| Contexto sin id | imprime `?` | hay que pasar el id de la madre |
| Denominador | tokens brutos, dominados por `cache_read` | el % no es costo ni es comparable con el cupo |
| % de cupo Codex | `codex-cupo.mjs` mide % de ventana, no tokens | no son comparables |
| Cifras | cambian con cada corrida | son fotos; citar hora |

## Configuracion propuesta

Reemplazo completo de `scripts/billetera-tokens.mjs`. Lo probe por stdin en esta tarea (`node --input-type=module -`), sin escribir ningun archivo. Salida:

```
opus-5-5             459.2 M (59.7%)  out 746k  msgs 1312
sonnet-5-5           202.4 M (26.3%)  out 63k  msgs 947
haiku-5-5            103.3 M (13.4%)  out 51k  msgs 635
codex/gpt-6-astra      2.5 M (0.3%)  out 16k  msgs 45
codex/gpt-6.1-sol      2.0 M (0.3%)  out 11k  msgs 35
codex/gpt-6-luna       0.1 M (0.0%)  out 0k  msgs 3
<synthetic>            0.0 M (0.0%)  out 0k  msgs 182
TOTAL 24h 769.4 M · codex 4.6 M (0.6%) · contexto actual madre v4 ≈ 315k
```

Cambios respecto al original:
- Nueva constante `codexRoot` (`%USERPROFILE%\.codex\sessions`).
- Nuevas funciones `walkCodex` y `scanCodex`. Suman `last_token_usage` por modelo (`codex/<modelo>`).
- `walk(root)` pasa a `walk(root); walkCodex(codexRoot);`.
- La linea TOTAL agrega `codex X M (Y%)`.
- `scan` (lineas 7-13 del original) queda igual.

Archivo completo:
```js
import fs from 'node:fs'; import path from 'node:path';
const home = process.env.USERPROFILE || process.env.HOME;
const root = path.join(home, '.claude', 'projects');
const codexRoot = path.join(home, '.codex', 'sessions');
const since = Date.now() - 24*3600e3; const seen = new Set(); const by = {};
let ctxLast = null; const me = process.argv[2] || '';
function walk(d){ for (const e of fs.readdirSync(d,{withFileTypes:true})) { const p = path.join(d,e.name);
  if (e.isDirectory()) walk(p); else if (p.endsWith('.jsonl') && fs.statSync(p).mtimeMs > since) scan(p); } }
function scan(p){ for (const line of fs.readFileSync(p,'utf8').split('\n')) { if (!line.includes('"usage"')) continue;
  let j; try { j = JSON.parse(line) } catch { continue }
  const m = j.message; if (!m?.usage || !m.id) continue; const t = Date.parse(j.timestamp); if (!(t > since)) continue;
  if (p.includes(me) && !p.includes('subagents')) { const u=m.usage; ctxLast = (u.input_tokens||0)+(u.cache_read_input_tokens||0)+(u.cache_creation_input_tokens||0); }
  if (seen.has(m.id)) continue; seen.add(m.id);
  const k = (m.model||'?').replace(/^claude-/,''); const u = m.usage; const o = by[k] ||= {in:0,cache:0,out:0,n:0};
  o.in += (u.input_tokens||0)+(u.cache_creation_input_tokens||0); o.cache += u.cache_read_input_tokens||0; o.out += u.output_tokens||0; o.n++; } }
// Codex: cada token_count trae last_token_usage (delta del turno); input_tokens incluye los cacheados.
function walkCodex(d){ let ents; try { ents = fs.readdirSync(d,{withFileTypes:true}) } catch { return }
  for (const e of ents) { const p = path.join(d,e.name);
    if (e.isDirectory()) walkCodex(p); else if (p.endsWith('.jsonl') && fs.statSync(p).mtimeMs > since) scanCodex(p); } }
function scanCodex(p){ let model = '?';
  for (const line of fs.readFileSync(p,'utf8').split('\n')) {
    const mm = line.match(/"model":"([^"]+)"/); if (mm) model = mm[1];
    if (!line.includes('"token_count"')) continue;
    let j; try { j = JSON.parse(line) } catch { continue }
    if (!(Date.parse(j.timestamp) > since)) continue;
    const u = j.payload?.info?.last_token_usage; if (!u) continue;
    const o = by['codex/' + model] ||= {in:0,cache:0,out:0,n:0};
    o.in += (u.input_tokens||0) - (u.cached_input_tokens||0);
    o.cache += u.cached_input_tokens||0; o.out += u.output_tokens||0; o.n++; } }
walk(root); walkCodex(codexRoot);
const tot = Object.values(by).reduce((a,o)=>a+o.in+o.cache+o.out,0);
const codexS = Object.entries(by).filter(([k])=>k.startsWith('codex/')).reduce((a,[,o])=>a+o.in+o.cache+o.out,0);
for (const [k,o] of Object.entries(by).sort((a,b)=>(b[1].in+b[1].cache)-(a[1].in+a[1].cache))) {
  const s=o.in+o.cache+o.out; console.log(`${k.padEnd(18)} ${(s/1e6).toFixed(1).padStart(7)} M (${(100*s/tot).toFixed(1)}%)  out ${(o.out/1e3).toFixed(0)}k  msgs ${o.n}`); }
console.log(`TOTAL 24h ${(tot/1e6).toFixed(1)} M · codex ${(codexS/1e6).toFixed(1)} M (${(100*codexS/tot).toFixed(1)}%) · contexto actual madre v4 ≈ ${ctxLast?Math.round(ctxLast/1e3)+'k':'?'}`);
```

Limites declarados:
- `archived_sessions` no se recorre. Añadirlo es una linea (`walkCodex(path.join(home,'.codex','archived_sessions'))`); no es urgente porque hoy tiene 0 archivos con actividad de 24 h.
- El % Codex son tokens, no cupo semanal (eso es `codex-cupo.mjs`).
- Sin dedupe Codex permanente: hoy 0 duplicados; si aparecen, habra que deduplicar por `timestamp|total_tokens`.

## Quien la aplica

- **madre-dev** (sesion madre de desarrollo-infra, en la PC). Motivo: `scripts/` y el harness son de infra; es un cambio de un archivo; Codex no hace git, así que la madre revisa, commitea y lo lleva a rama. No la aplica una nube: no ve `%USERPROFILE%\.codex` ni la PC de Sergio Urcullo.
- **Integrador**: solo si la madre decide llevarlo a `main`, y por PR. No es un cambio de `main` directo.
- **Sergio Urcullo**: no hace falta su OK. No gasta, no publica, no contacta a nadie.

## Prueba de hecho

1. `node --check scripts/billetera-tokens.mjs` sale con codigo 0.
2. `node scripts/billetera-tokens.mjs <id-madre>` imprime lineas `codex/<modelo>` y una linea `TOTAL 24h ... codex X M (Y%) ... contexto ... ≈ Nk`. Sin `NaN`.
3. Cruce por archivo en 24 h: la suma de `last_token_usage.input_tokens` y `output_tokens` de cada `.jsonl` debe igualar `info.total_token_usage` de su ultimo `token_count`. Hoy: 17 de 17.
4. Las lineas `opus-5-5`, `sonnet-5-5`, `haiku-5-5` no cambian respecto al script original ejecutado en el mismo minuto (las sesiones Claude siguen vivas: comparar en el mismo minuto).
5. Gate de la madre: si los puntos 1 a 4 pasan, el cambio se commitea. El cupo Codex sigue UNKNOWN hasta confirmarlo en la app.
