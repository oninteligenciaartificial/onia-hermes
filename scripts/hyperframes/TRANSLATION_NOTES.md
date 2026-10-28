# TRANSLATION_NOTES — Remotion → HyperFrames

Porte de las 5 composiciones de apoyo visual de ONIA, de `scripts/remotion/`
(React) a `scripts/hyperframes/` (HTML + GSAP), siguiendo el skill
`remotion-to-hyperframes`.

Fecha: 2026-07-26 · CLI HyperFrames 0.7.72 · Remotion 4.0.499 · todo local, costo cero.

---

## 1. Lint de la fuente (paso 1 del skill)

```
python hermes-content/docs/historial/skills/remotion-to-hyperframes/scripts/lint_source.py scripts/remotion/src
12 files scanned · 0 blocker · 2 warning · 0 info
```

Los 2 warnings son `r2hf/custom-hook` sobre `useEnterExit` y `useCountUp`
(`src/lib/motion.ts`). Ambos son derivaciones **puras** de `useCurrentFrame()`
—sin `useState`/`useEffect`— así que corresponde inlinear el cuerpo, no bajarse
al patrón de interop en runtime. **Cero blockers: el porte procede completo.**

> Nota Windows: `lint_source.py` abre los archivos con el encoding por defecto y
> revienta con `UnicodeDecodeError` sobre fuentes con acentos (cp1252). Se corre
> con `PYTHONUTF8=1`.

---

## 2. Mapeo mecánico (el ~80%)

| Remotion                                | HyperFrames                                                        |
| --------------------------------------- | ------------------------------------------------------------------ |
| `<Composition id fps width height>`     | root `<div id="stage" data-composition-id data-fps data-width …>`  |
| `calculateMetadata` (sync)              | resuelto en build-time por `render.mjs` → `data-*` concretos        |
| `<AbsoluteFill>`                        | `.fill { position:absolute; inset:0; display:flex; flex-direction:column }` |
| `useCurrentFrame()` + `interpolate()`   | tweens sobre UN `gsap.timeline({paused:true})` en segundos          |
| `Easing.bezier(0.16,1,0.3,1)`           | `gsap.registerEase("oniaOutExpo", cubicBezier(...))`                |
| `useEnterExit()` (hook propio)          | `enterExit()` inline → `{enterAt, enterDur, exitAt, exitDur}`        |
| `useCountUp()`                          | tween sobre objeto proxy + `onUpdate` que escribe `textContent`      |
| `u(width, n)` (escala JS)               | `--u: calc(var(--stage-w) / 1000 * 1px)` + `calc(var(--u) * n)`     |
| `tokens(accent, theme)`                 | custom properties CSS en `#stage` + `[data-theme="light"]`          |
| `mix(accent, #000, 0.38)`               | `color-mix(in srgb, var(--accent) 62%, #000000)`                    |
| props escalares                         | `data-composition-variables` + `--variables` (mecanismo nativo)      |
| `clip-path` manejado por frame          | tween de custom property (`--reveal` / `--wipe`) vía proxy           |

**Ganancia real del mapeo:** `u()` era una función JS que se recalculaba por
frame; en HF es una custom property CSS. Cambiar `--stage-w` reescala la pieza
entera sin tocar una línea de lógica.

**Curvas de marca conservadas exactas:** `EASE_OUT_EXPO = cubic-bezier(0.16,1,0.3,1)`
(la misma `--ease-out-expo` de los tokens de web-factory) y
`EASE_OUT_QUART = cubic-bezier(0.25,1,0.5,1)`. Se implementó el solver de bezier
unitaria (Newton-Raphson + bisección, igual contrato que `Easing.bezier` de
Remotion y que `cubic-bezier()` de CSS) en vez de aproximar con `power4.out`:
aproximar habría movido la marca.

`EASE_OUT_QUINT` de `src/lib/easing.ts` no se portó — **no lo usa ninguna
composición** (código muerto en la fuente).

---

## 3. El 20% con pérdida

### 3.1 Tipografía — la pérdida real (NO se forzó)

`FONT_STACK` es `system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.
HyperFrames **sustituye deliberadamente** las fuentes de sistema por fuentes
empaquetadas (`system_font_will_alias: 'segoe ui' → Roboto`) e inyecta
`@font-face` deterministas.

- En Remotion sobre Windows la pieza sale en **Segoe UI**.
- En HyperFrames sale en **Roboto**, en cualquier SO.

Es la mayor fuente de divergencia de SSIM (`eval.md` ya la marca como el ruido
de fondo dominante). **No se "arregló" forzando la fuente**: cambiar la
tipografía de marca es una decisión de Sergio, no del porte.

**Ojo, es una mejora disfrazada de pérdida:** el enfoque de Remotion ("solo
fuentes del sistema, cero red") NO es determinista entre máquinas — la misma
composición renderizada en el VPS Linux saldría con otra tipografía que en el
Windows de Sergio. HF la congela.

**PENDIENTE PARA SERGIO:** `make-mockup.mjs` (apoyos estáticos) sigue usando el
stack del sistema. Si un reel mezcla un apoyo estático y uno animado, ahora
conviven Segoe UI y Roboto. Hay que unificar — no se tocó porque
`make-mockup.mjs` está fuera del alcance de esta tarea.

### 3.2 Geometría: `data-duration` / `data-width` / `data-height` no son variables

HyperFrames congela la duración y el tamaño del root **en tiempo de
compilación** (se leen antes de que corran los scripts), así que un override por
`--variables` se ignora. Remotion en cambio los resolvía por props vía
`calculateMetadata`.

Solución: `render.mjs` copia la composición a un proyecto temporal (`.build/`) e
inyecta la geometría como un `<style id="onia-geometry">` al final del `<head>`
más la reescritura de los `data-*` del root. El CSS autoral NO se toca con
regex. El contenido (textos, colores) sí viaja por el mecanismo nativo
`--variables`, así que se puede editar en Studio sin rebuild.

### 3.3 `theme` no viaja como variable

Las variables escalares se aplican como custom property `--{id}`, lo que no
sirve para conmutar una paleta entera. `theme` se resuelve como atributo
`data-theme` en el build (`[data-theme="light"]` en CSS). Consecuencia: en
`hyperframes preview` se ve el tema que quedó horneado; para ver el otro hay que
re-buildear con `--theme light`.

### 3.4 Helper duplicado en las 5 composiciones

El bloque de helpers (solver de bezier + `enterExit()` + `readVars()`) está
inlineado en cada `index.html`, ~60 líneas × 5. Es a propósito: cada composición
tiene que ser un proyecto HyperFrames **standalone** (rendereable y editable por
sí solo). Un `<script src="../../lib/…">` sale del directorio del proyecto y el
server de HF no lo sirve. Si el helper cambia, hay que cambiarlo en los 5.

---

## 4. Desviaciones DELIBERADAS (manda `motion-doctrine`)

`motion-doctrine` es gateway y **supersede** la fidelidad literal a la baseline.
Estas divergencias bajan el SSIM a propósito.

| # | Dónde | Original Remotion | Port | Por qué |
| - | ----- | ----------------- | ---- | ------- |
| D1 | Quote, cascada de palabras | cada palabra hace fade `opacity 0→1` en 180 ms | opacidad **binaria** vía `tl.set` en la entrada | `cut-the-curve` §6: en una cascada de arribo la opacidad es binaria, nunca fade — la velocidad la lleva el recorrido |
| D2 | Quote, cascada | recorrido Y de 16u | 44u (banda 40–50 px) y duración 150 ms (banda 0.13–0.16 s) | §6 "velocity varies by weight" |
| D3 | Quote, cascada | huecos IGUALES (`stepFrames` constante) | huecos que **se achican** ×0.84 y cascada total acotada a ≤500 ms | §6 anti-patrón "Equal gaps"; y el tope de 500 ms evita que una cita larga se arrastre (el original crecía sin límite: 12 palabras = 733 ms) |
| D4 | Stat, eyebrow/label/sublabel | los 3 se movían A LA VEZ (mismo `cascade`, delay 5f) pese a que el comentario decía "cascada" | cascada real de 3 pasos con huecos ×0.84 y opacidad binaria | §6; además el código no hacía lo que decía su propio comentario |
| D5 | Browser, 3 dots | dot 1 con 220 ms, dots 2-3 con 200 ms; huecos 4→6→9f (**crecientes**) | los 3 comparten 200 ms; huecos decrecientes ×0.84 | "Similar elements share one ease+duration intent"; anti-patrón "Equal/growing gaps" |
| D6 | Stat, halo | (sin salida propia) | (igual — sin salida propia) | se respetó: darle salida propia habría dado un exit/entry de 43%, muy por debajo del ~75% que pide la doctrina |

**Lo que NO aplica de la doctrina, y por qué:** toda la Parte 1 (ley del vector,
ledger de seams, Seam Gate, `cut-the-curve` §1-5) gobierna **cortes entre
escenas**. Estas 5 piezas son composiciones de UNA escena, sin cortes internos —
no hay ningún seam que auditar, así que no se fabricó un `ledger.json` vacío ni
se corrió `seam-gate.mjs` (no tendría filas que verificar).

Sobre "no idle wobble": estos son **apoyos que se superponen a un video de
Sergio hablando**, no escenas de una película. El movimiento sostenido durante
el "hold" lo pone el material de base; el trabajo del apoyo es ser legible y no
competir. Las piezas que sí tienen ruta propia la declaran: Stat = *sequenced UI
life* (el número tickea), Phone = *sequenced UI life* (la captura deriva como un
feed que scrollea — recorrido lineal en una sola dirección, NO un loop seno),
Browser = *staged reveal* (wipe de la captura).

---

## 5. Bugs encontrados en el camino

### 5.1 Colisión de namespace de custom properties (lo cazó `hyperframes check`)

Quote declara una variable `text`. HyperFrames aplica **toda** variable escalar
como custom property `--{id}` en el root — o sea `--text: "Tu equipo, …"`, que
pisaba el token de color `--text: #f6f8fb`. `color: var(--text)` quedaba
inválido y el texto salía **casi negro sobre tarjeta oscura, ilegible**.

Lo detectó el gate de contraste (`24 error(s)`, 1.1:1 cuando pide 3:1). Fix:
los tokens de color se renombraron a `--ink-text` en las 5 composiciones.
**Regla nueva: ningún token CSS puede llamarse igual que una variable declarada.**

### 5.2 `box-sizing` — divergencia que introduje yo, no un bug de Remotion

Asumí que Remotion no inyecta reset y escribí las composiciones en `content-box`.
**Falso: Remotion aplica `box-sizing: border-box` de fábrica.** El resultado eran
tarjetas más anchas y, en Quote y LowerThird, paneles fuera del lienzo
(`panel_out_of_canvas`, la palabra "mientras" pisando el borde). Corregido con un
reset global `*, *::before, *::after { box-sizing: border-box }`.

Impacto medido al corregirlo: Phone 0.934 → **0.988**, Browser 0.927 → **0.968**,
Stat 0.939 → **0.960**.

### 5.3 Acentos del español

Al tipear los defaults les comí los acentos ("Reserva" por "Reservá", "dormis"
por "dormís", "gestion de clinicas" por "gestión de clínicas"). Restaurados: es
copy de marca.

### 5.4 BUG PRE-EXISTENTE en `overlay-visuals.mjs` (NO es del porte)

Una secuencia PNG se decodifica desde su PTS 0, pero el overlay sólo se habilita
con `enable='between(t,start,end)'`. **No hay corrimiento de PTS**, así que un
apoyo con `start: 4.5` sobre una secuencia de 2.6 s ya terminó (EOF a los 2.6 s)
antes de que se lo habilite: **no se ve nada**. Con `start: 1.0` sí se ve, pero
mostrando el tramo equivocado del clip (su t=1.0…3.0, no su comienzo).

**Verificado que es pre-existente:** el mismo plan con las secuencias de
**Remotion** da exactamente el mismo resultado vacío. No se tocó
`overlay-visuals.mjs` (fuera de alcance). El fix sería `-itsoffset <start>` (o un
`setpts+PTS`) en el input de secuencia.

---

## 6. Evaluación

### 6.1 Corpus del skill (T1–T4) — corrido completo

| Tier | Forma | mean medido | umbral | baseline del skill | veredicto |
| ---- | ----- | ----------- | ------ | ------------------ | --------- |
| T1 | fade-in de un elemento | **0.9662** | 0.95 | 0.974 | pasa |
| T2 | multi-escena + spring + audio + imagen | **0.9839** | 0.95 | 0.985 | pasa |
| T3 | data-driven + subcomponentes + contador | **0.9448** | 0.90 | 0.953 | pasa |
| T4 | escape hatch (8 casos de lint) | **8/8** | — | 8/8 | pasa |

Los −0.008 de T1 y T3 contra la baseline documentada son deriva de máquina/fuente
— el propio `eval.md` avisa que los fixtures re-renderizados en otro hardware
derivan ~0.01. **Las 4 tiers pasan su umbral.**

#### Fricciones para correr el corpus fuera del monorepo de HyperFrames

Ninguna es del porte; quedan anotadas para el próximo que lo corra en Windows:

1. **`MAX_PATH`.** Corriendo desde `.agents/skills/…` dentro del worktree, la ruta
   del `chrome-headless-shell.exe` de cada fixture da **280 caracteres** (límite
   260, long paths deshabilitado). `spawn` de Node devuelve ENOENT aunque el .exe
   exista y corra a mano. Se resolvió copiando el skill a `C:\hf\s` (ruta de 162).
2. **`run.sh` asume el monorepo:** busca el CLI en `$REPO_ROOT/packages/cli/dist/cli.js`
   con `REPO_ROOT = <skill>/../..`. Desde un consumidor no existe. Se resolvió con
   un forwarder de una línea a la copia de npx.
3. **`python3` no existe en este Windows** (el alias del Store lo intercepta y no
   se puede pisar por PATH porque la ruta lleva `C:` y el `:` parte el PATH).
   `render_diff.sh`, `run.sh` y `lint_source.py` lo invocan.
4. **El `cp -r` pierde el bit de ejecución**, y `run.sh` invoca `$DIFF` directo;
   sin +x se va por la rama de error y reporta `fail` con un SSIM que en realidad
   pasa (le pasó a T1: reportó fail con 0.9662 contra umbral 0.95). Los números
   de arriba salen de correr `render_diff.sh` a mano, que devuelve `pass: true`
   y exit 0 en las tres tiers.

### 6.2 Las 5 composiciones ONIA — SSIM vs baseline Remotion

Ambos lados salen de secuencias PNG RGBA, compuestas sobre el MISMO negro y
codificadas con el MISMO encoder sin pérdida (x264 CRF 0), para que el SSIM mida
traducción y no diferencias de encoder.

| Composición | mean | min | p05 | p95 | frames | umbral tier | veredicto |
| ----------- | ---- | --- | --- | --- | ------ | ----------- | --------- |
| Stat        | **0.9595** | 0.9546 | 0.9565 | 0.9786 | 90  | 0.90 (T3) | pasa |
| Browser     | **0.9678** | 0.9404 | 0.9644 | 0.9956 | 96  | 0.90 (T3) | pasa |
| Phone       | **0.9877** | 0.9673 | 0.9784 | 0.9882 | 96  | 0.90 (T3) | pasa |
| Quote       | **0.9387** | 0.9178 | 0.9328 | 0.9815 | 102 | 0.90 (T3) | pasa (con D1–D3 a propósito) |
| LowerThird  | **0.9440** | 0.9011 | 0.9344 | 0.9985 | 78  | 0.90 (T3) | pasa |

Estas piezas son de complejidad T3 (props, subcomponentes propios, contador),
umbral 0.90. Las cinco pasan.

Lectura del residuo:

- **Stat / Browser / Phone** (sin desviaciones de doctrina): el residuo es
  esencialmente la sustitución tipográfica de §3.1. Distribución estrecha
  (p05→p95 corto) = diferencia uniforme frame a frame, típica de fuente.
- **Quote** (0.9387): el más bajo y el más intervenido — D1, D2 y D3 recronometran
  toda la cascada. Divergencia buscada; forzar el parecido sería violar la doctrina.
- **LowerThird** (min 0.9011 pero p95 0.9985): distribución ancha = el residuo se
  concentra en frames puntuales (arranque/salida), no es uniforme.

---

## 7. Pendientes / decisiones para Sergio

1. **Tipografía (§3.1).** Unificar `make-mockup.mjs` con Roboto, o configurar HF
   para que no aliasee. Hoy un reel que mezcle apoyo estático + animado mezcla
   dos tipografías.
2. **`overlay-visuals.mjs` (§5.4).** Bug real de sincronía, afecta también al
   pipeline viejo de Remotion.
3. **Franja lateral de LowerThird.** El riel de acento de LowerThird es una
   **franja vertical de 10u pegada al borde izquierdo** de la placa. Las tarjetas
   (Stat/Quote) ya migraron de ese patrón a una regla horizontal corta al pie
   porque la franja lateral está **prohibida** por las reglas de diseño de la casa
   (lee a plantilla de alerta). LowerThird nunca se actualizó. Se portó **fiel**
   (con su wipe animado, que es un recurso distinto de una franja estática), pero
   habría que decidir si se corrige igual que las tarjetas.
4. **Baja de `scripts/remotion/`.** Recomendación: **conservarlo por ahora**, no
   darlo de baja en esta sesión. Motivo: es el único baseline contra el cual se
   pueden medir estas desviaciones, y la decisión de tipografía (§3.1) sigue
   abierta. Darlo de baja cuando (a) se resuelva la tipografía y (b) un reel real
   salga publicado con los apoyos de HyperFrames. `scripts/remotion/baseline/`
   sí es descartable: es build output regenerable.

---

## Anexo — qué se corrió de verdad

| Paso | Comando | Resultado |
| ---- | ------- | --------- |
| Lint fuente | `lint_source.py scripts/remotion/src` | 0 blockers, 2 warnings |
| Gate por composición | `npx hyperframes check` ×5 | 5/5 `Check passed` |
| Render | `render.mjs --comp <X> --format png-sequence` ×5 | 462 frames PNG RGBA |
| Alpha | `ffprobe` + `alphaextract,signalstats` | `pix_fmt=rgba`, alpha 0→255 |
| Integración | `overlay-visuals.mjs` con secuencia HF | compone con alpha real, sin tocar el script |
| Paridad | `render.mjs --width 1400 --duration 2 --theme light --props {image}` | 60 frames 1400x760, imagen y tema aplicados |
| SSIM 5 comps | `render_diff.sh` sobre PNG→x264 CRF 0 | ver §6.2 |
| Corpus | `run.sh` (T4) + `render_diff.sh` a mano (T1–T3) | 4/4 pasan, ver §6.1 |
