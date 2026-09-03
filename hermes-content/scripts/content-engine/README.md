# ONIA Content Engine v1 — motor de contenido-que-vende

Pipeline: **tendencia -> guion -> Higgsfield (tomas + voz) -> editor -> 1 video listo**.
Ensambla por PLANTILLA: una plantilla -> N videos, cambiando solo el spec JSON.

Caso v1 (end to end): **Nuvia + ISDIN Fusion Water Magic SPF 50**, presentadora **Mara** (Soul `Mara ONIA v1`).

## Decision de editor: Remotion (no Editly)

| Criterio | Remotion | Editly |
|---|---|---|
| Estado del proyecto | Mantenido, releases activas | Sin release real desde ~2021 |
| Overlays branded (marca/precio/CTA/subtitulos animados) | React/CSS, control total | Limitado; texto/animacion basica |
| Plantilla -> N videos | Componente + props/JSON nativo | JSON declarativo, menos reusable |
| Windows / cross-platform | OK (Node + Chromium headless) | Deps nativas (ffmpeg+gl) dolorosas |
| Render | Chromium -> frames -> ffmpeg (mas pesado) | ffmpeg directo (mas liviano) |
| Escala | Worker VPS en fase 2 | — |

**Veredicto:** Remotion. El requerimiento es video de marketing branded por plantilla
(marca + producto + precio + subtitulos + CTA, 1 plantilla -> N videos). Eso es control
fino de composicion/tipografia/animacion = terreno de React/Remotion. Editly no da overlays
branded ricos y esta sin mantener. El unico costo (render pesado con Chromium) se resuelve
con el worker VPS (fase 2); el v1 de 1 video corre local.

## Arquitectura

```
src/data/<video>.json     spec del video (contrato de datos: guion, escenas, subtitulos, precio)
src/templates/ProductSell.tsx   la PLANTILLA (marca+presentadora+producto+precio+subtitulos+CTA)
src/Root.tsx              registra la composicion (dimensiones/fps desde meta del spec)
render.mjs                render programatico; sanea assets faltantes -> placeholder
public/                   assets servidos por Remotion (staticFile)
  brand/     logo Nuvia
  product/   packshot del producto
  mara/      tomas de la presentadora (Higgsfield text2image_soul_v2)
  audio/     voz IA (vo.mp3)
out/         MP4 renderizado
```

Un video nuevo = un nuevo JSON en `src/data/` (mismo template). El template lee todo por props.

## Assets faltantes = placeholder

`render.mjs` chequea `public/` y anula los assets que no existen, para que el pipeline
renderice de punta a punta aun antes de tener las tomas de Mara o la voz. Cuando llegan los
assets reales, se dropean en `public/` y se re-renderiza sin tocar codigo.

## Correr

```bash
cd hermes-content/scripts/content-engine
npm install            # instala Remotion (+ Chromium headless la primera vez)
npm run studio         # preview interactivo (opcional)
npm run render:isdin   # renderiza out/nuvia-isdin-fusion-water-spf50-001.mp4
# generico: node render.mjs src/data/<otro-video>.json
```

## Reglas (de la sesion)

- **Solo modelos baratos** para generar: `text2image_soul_v2` ~0.12cr/img (Mara), `z_image` 0.15cr.
  Evitar Seedance (45-135cr) y video caro. El movimiento lo pone el editor (Ken Burns), no
  un modelo de video caro.
- **No publicar sin aprobacion.** El v1 exporta el MP4 y prepara el post; no publica.
- **No inventar** precios/claims. Precio y beneficios salen del catalogo real de Nuvia.
  Skincare = lenguaje seguro (sin cura/antiedad/antes-despues).
- **Imagen de producto = referencia** hasta tener media propia/aprobada para publicar.
- **Nunca** exponer el proveedor (regla Nuvia); la marca del producto (ISDIN) si.

## Fase 2 (no en v1)

- Worker de render en el VPS para batch pesado (N videos).
- Voz: preset ElevenLabs/Higgsfield fijo por lane.
- Trigger n8n: catalogo/tendencia -> genera spec -> Higgsfield -> render -> cola de aprobacion.
- Multi-plataforma (IG/TikTok) reusando el mismo spec con crops/caption por canal.
