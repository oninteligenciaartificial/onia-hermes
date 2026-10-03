# Orden de producción — empezá por acá

Sergio Urcullo: este es el único archivo que necesitás abrir para grabar. Todo lo demás está
enlazado. Rutas relativas a `hermes-content/docs/cola/`.

## 1. Qué grabar primero (bloque 1: días 30-sep, 1-oct y 2-oct)

Una sentada de ~1 hora. Primero el YouTube horizontal, después los verticales de corrido.

| # | Formato | Pieza | Dónde está el guion |
|---|---|---|---|
| 1 | **YouTube 16:9** | Opus 5.5 o Sonnet 5.5 | `GUIONES-PARA-GRABAR-2026-09-29.md` → «YouTube» · presentación: `hermes-content/carousels/out/yt-10-opus-sonnet/index.html` |
| 2 | Vertical | Tu primera skill (D01-A) | `GUIONES-PARA-GRABAR-2026-09-29.md` → «Vertical 6» |
| 3 | Vertical | Salió Sonnet 5.5: la prueba de tres tareas (D01-B) | `plan-3-semanas/S1-GUIONES.md` → D01-B |
| 4 | Vertical | La perilla de esfuerzo (D02-A) | `GUIONES-PARA-GRABAR-2026-09-29.md` → «Vertical 4» |
| 5 | Vertical | **WhatsApp cobra desde el 1-oct (D02-B)** · URGENTE, sale el 1-oct | `plan-3-semanas/S1-GUIONES.md` → D02-B |
| 6 | Vertical | Costo escondido de un presupuesto (D02-C) | `GUIONES-PARA-GRABAR-2026-09-29.md` → «Vertical 2» |
| 7 | **YouTube 16:9** | Un CLAUDE.md donde cada regla trae su historia (D03-C) | `plan-3-semanas/S1-GUIONES.md` → D03-C · presentación: `…/out/yt-11-claude-md-historia/index.html` |
| 8 | Vertical | El hook que commitea solo (D03-A) | `plan-3-semanas/S1-GUIONES.md` → D03-A |
| 9 | Vertical | Claude Code ya lee AGENTS.md (D03-B) | `plan-3-semanas/S1-GUIONES.md` → D03-B |

Presentaciones: abrilas en el navegador; `?slide=N` va a la lámina N y el botón «Notas»
muestra qué decir.

## 1b. Cómo grabar (método de Santiago Muñoz; lo marcado con * sale de nuestra propia edición)

*Antes*
1. Celular fijo en trípode, en vertical, plano medio corto (del pecho para arriba), siempre el mismo fondo.
   *Nada de pared clara con sol directo: el subtítulo blanco deja de leerse.
2. Cara centrada, con aire arriba y abajo: el formato partido la deja en la mitad de abajo, donde van los subtítulos.

*Durante*
3. Grabá de corrido. Si te trabás, hacé una pausa y repetí la frase ENTERA: el corte detecta la repetida.
4. *La cámara va en una toma aparte y a pantalla completa, no en la burbujita de OBS. Lo que muestres de la
   pantalla grabalo aparte y nítido: el zoom a la línea que importa lo hago yo en la edición.
5. Quedate en la pantalla que enseña el tiempo que haga falta para leerla: no hay que cortar cada 2 s.
6. Si podés, grabá 1–2 min de b-roll tuyo trabajando (manos, pantalla, escritorio): sirve para todos los videos.

*Después*
7. Dejá los brutos tal cual en `C:\Users\PC\Videos\ONIA-brutos\<AAAA-MM-DD>\`. *El HDR del iPhone lo corrijo yo.
8. Antes de cortar te paso la tabla de cortes y el preview (regla de oro).

Largo de YouTube, en este orden de capítulos: resultado → requisitos → creación → revisión → personalización.
Fuentes: su reel `DdE7wYbxjPK` (ficha en `references/video-intake/2026-09-17-reel-santiago-astra-davinci-estilo-edicion.md`)
y la skill `editor-videos`. Aparte de esto, su método nuevo es de videos animados por código, que no
necesitan grabarte: `references/marca-personal/SANTIAGO-VIDEOS-ANIMADOS-POR-CODIGO.md`.

## 2. El calendario completo (3 semanas, 3 videos por día)

- Mapa, calendario día por día y lista «antes de grabar»: `plan-3-semanas/MAPA.md`
- Guiones: `plan-3-semanas/S1-GUIONES.md` (30-sep → 6-oct) · `S2-GUIONES.md` (7 → 13-oct) ·
  `S3-GUIONES.md` (14 → 20-oct) · `S4-GITHUB-REPOS.md` (11 extra, sin fecha)
- Guiones del 28-sep que el calendario reutiliza: `GUIONES-PARA-GRABAR-2026-09-29.md`
- Presentaciones de los 9 YouTube: `hermes-content/carousels/out/yt-10-*` … `yt-18-*`

## 3. Carruseles (uno por día desde el 29-sep)

**29-sep: Sergio Urcullo pidió UNO POR DÍA.** El calendario de los 21 días (30-sep → 20-oct) va en
`plan-3-semanas/CARRUSELES-DIARIOS.md`; cada uno se agenda con `ig-carrusel.mjs` recién con su OK.
⚠️ **Corregido el 1-oct:** acá había una tabla con los 9 primeros, con fechas y carpetas viejas (`k2v2`, `k8v2`,
«sáb 3-oct»). Era una segunda fuente del mismo calendario y ya decía otra cosa. **Fecha, carpeta y estado de cada
carrusel: solo en `CARRUSELES-DIARIOS.md`.**

Láminas PNG en `hermes-content/carousels/out/<carpeta>/slide-NN.png`; caption en el brief
(`hermes-content/carousels/briefs/marca-personal/<carpeta>.json`, campo `caption`).

## 4. Antes de publicar cada video

1. El recurso que promete el cierre («está en la comunidad») se publica ANTES en Announcements:
   está en la sección «Drops» al final de cada archivo de guiones.
2. «Comentá PALABRA» = respondés vos por DM (2 por semana, ya marcados).
3. Cifras que envejecen (precios, conteos): recontar el día de grabar → `MAPA.md` §5.

## 5. Cómo se publica y cuántos yaps

`plan-3-semanas/FLUJO-DIARIO.md` (qué sale de cada video, horarios, medición) y
`hermes-content/deploy/vps-ops/publicar/README.md` (el publicador).

## 6. Cuando termines de grabar

Pasame dónde quedaron los brutos. Edito con la regla de siempre: tabla de cortes y preview
ANTES de cortar, subtítulos leídos a ojo antes de quemarlos.
