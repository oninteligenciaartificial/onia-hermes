# «Tu primera automatización» (feed, 21/22-sep) — el video que Sergio Urcullo recuerda como «el bueno»

> Sergio Urcullo, 2-oct: *«el video bueno es el de tu primera automatización, subido sept 22»*. Lo editó **Codex**
> (hilo `01a0a207`, el mismo del reel Astra/Fable del 14-sep) el 21-sep, en 2 h 40 min, con HyperFrames.
> Pedido: *«editalo este es el del feed»*. Lo subió Sergio Urcullo a mano. Este proyecto vivía solo en el disco de
> la PC (y en el commit local sin publicar `5f0c8aec`): lo rescató la sesión madre el 2-oct, **sin** los MP4
> (bruto 57 MB, render 40 MB y `work/`, que siguen en la PC).
> Final: 40,0 s, 1080×1920, 30 fps, −14 LUFS. Bruto `IMG_4866.MP4` de 48,7 s (HEVC SDR).
> **Rol:** referencia de lo que a él le gustó. El molde a replicar TAL CUAL es el de Erik Taveras y Santiago Muñoz
> (skill `edicion-referentes`).

## Receta

1. **Análisis:** transcripción local (faster-whisper `small`, word timestamps), `silencedetect=noise=-38dB:d=0.22`,
   hojas de contacto.
2. **Corte a mano sobre el transcript** (`analysis/edit-plan.json`): 7 tramos, 2 redundancias y 4 pausas fuera.
   Después **todo a 1,1×** (`setpts=PTS/1.1`, `atempo=1.1`) para llegar a 40 s. ⚠️ Codex no mostró tabla de cortes
   ni preview 360p antes de cortar: la regla de oro se mantiene.
3. **Composición** (`index.html`, GSAP):
   - **Gancho 0–3,8 s a cámara completa:** sombra arriba, etiqueta mono verde «N8N · GUÍA PRÁCTICA», título 92 px
     «Tu primera automatización», pastilla «4 pasos antes de conectar 20 apps».
   - **A los 3,56 s la cara pasa a PiP** 9:16 chico arriba a la derecha (270×480, borde crema, radio ~26 px,
     0,52 s `power3.inOut`), con el rótulo «EXPLICACIÓN EN CÁMARA».
   - **4 pantallas a pantalla completa**, ~8 s cada una (ENTRADA → VALIDACIÓN → REGISTRO + AVISO → SISTEMA MÍNIMO):
     fondo `#0a1116` con grilla de 56 px al 2,5 %, encabezado mono + h2 72 px + bajada 29 px, nodos de n8n
     DIBUJADOS en código (660 px), verde `#2ce58d` TRUE, rojo `#ff716f` FALSE, ámbar `#ffc857`.
     Entran con barrido de abajo arriba (clip-path) 0,42 s y stagger de 0,09 s; salen hacia la izquierda en 0,28 s.
   - **El truco:** cada pantalla cambia justo donde cae un corte (11,9 / 19,1 / 27,4 s) y el último cae dentro de
     la vuelta a cámara completa. Detección de escena: ningún corte duro visible.
   - **CTA 35,9–40 s:** vuelta a cámara completa, «TU CASO PUEDE SER EL PRÓXIMO» + «Comentá una tarea
     **repetitiva**».
4. **Subtítulos por frase, no karaoke:** 13 frases reescritas a limpio, 2 líneas como máximo, ~3 s cada una; pastilla
   oscura con desenfoque, 62 px, palabra clave en verde. Posición y=1368, y en el gancho y el CTA suben para no tapar
   la cara.
5. **Sin** zooms, música, SFX, b-roll, logos ni pantallas reales.
6. **Render y QA:** `npx hyperframes@0.8.58 check` (contraste AA), snapshots en 6 tiempos, `scripts/render-guard.mjs`
   (Chrome headless), loudnorm en dos pasadas a −14, después una pasada más a TP −1,8 (el AAC había dejado el pico
   en −1,29 dBTP).

## Para reproducirlo hoy (lo que falta en editor-videos)
Layout PiP sobre pantalla completa; plantilla `index.html` (está acá); subtítulos frase-pastilla con posición por
tramo; anclar el cambio de pantalla a los límites del cutplan; permiso explícito para 1,1× en talking head; fuentes
portables (Bahnschrift y Segoe son de Windows y no existen en la nube); pico a −1,8 dBTP antes del AAC.
⚠️ Los subtítulos mezclan tú y vos («quieres / haz» con «Comentá»): no copiar eso.
