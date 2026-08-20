# Piezas UI-patterns — A6

Tarea A6 de `hermes-content/references/video-intake/PROMPTS_POR_SESION.md` (línea 705):
3 clips verticales que muestran los patrones de `hermes-content/references/ui-patterns/`
funcionando de verdad, con el dato de oficio concreto que explica por qué están bien
hechos. **Nada de esto está publicado.** Son borradores para que Sergio apruebe.

## Cómo se hicieron

Receta base: Bloque A de `hermes-content/docs/ONIA_MANUAL_DE_FORMATOS_20260813.md`
(~línea 305, P05): *"una captura por pantalla → clip de 1,00 s con deriva de 80 px →
placas de apertura/cierre → concat -c copy"*. Adaptada porque acá no hay 9 sitios
distintos para armar un muro: son **3 estados reales de un mismo patrón** (reposo →
acción → resultado), capturados con Playwright interactuando de verdad con el
componente (clic real, esperando los tiempos que ya están escritos en el propio
`index.html` — no una animación inventada).

- Reusa `.claude/skills/editor-videos/scripts/resolve-playwright.mjs` (ya resuelve
  Chromium desde cualquier carpeta del repo) — no se declaró Playwright de nuevo.
- El fondo de marca + centrado se inyecta **en vivo** con `page.addStyleTag()` durante
  la captura. **Ningún archivo de `ui-patterns/` se tocó** — siguen intactos como
  referencia canónica.
- Texto quemado con `ffmpeg drawtext` + `hermes-content/brand/fonts/BricolageGrotesque-Bold.ttf`
  (esa fuente ya está declarada para "subtítulos quemados" en
  `hermes-content/brand/fonts/README.md`) sobre `--onia-ink` (`#0A0F0D`) con la
  keyword en `--onia-green` (`#10C26B`) — los dos tokens de
  `hermes-content/brand/tokens.css`, la única fuente de verdad de color de marca.
- Todo el pipeline (captura, clips con deriva, placas, concat) vive en `build.mjs`
  de esta carpeta (`node build.mjs <capture|clips|plates|concat|all>`).
- Silencioso (`-an` en todos los clips): el formato pedido es "sin voz, sin cara" y
  no había música con derechos verificados para esta tanda — se puede sumar SFX de
  la librería HyperFrames en una pasada aparte si Sergio la pide.
- `capture-web.mjs` / `_reel.html` / `film-pattern.mjs` que menciona el manual como
  "por escribir" (§7) **no se escribieron**: para el formato de este prompt (loop
  visual + 2 placas de texto, sin código en pantalla) no hacían falta — Playwright
  directo + `drawtext` cubre todo con menos piezas.

## Por qué estos 3 patrones (de los 6 disponibles)

De los 4 datos concretos del prompt, 3 son **cita textual del propio comentario de
cabecera del archivo fuente** (no se inventó ninguno):

| Pieza | Dato usado | Fuente exacta |
|---|---|---|
| `upload-button` | "React + framer-motion → CSS puro, 0 kB" | comentario línea 4 de `ui-patterns/upload-button/index.html` |
| `floating-cart` | "`<dialog>` nativo: Escape, foco atrapado, devolución de foco gratis" | comentario línea 7-9 de `ui-patterns/floating-cart/index.html` |
| `chat-widget` | "0.01ms deja el panel abierto e invisible → `transition: none`" | comentario CSS de `.cw-panel` en `ui-patterns/chat-widget/index.html` (mismo principio que el README de `ui-patterns/`) |

**El 4º dato del prompt ("las etiquetas apiladas hacen que el lector lea 'Upload
Uploading Completed'") no se usó en pantalla** — encajaba también en `upload-button`,
pero el formato pide UNA sola línea por pieza y ya estaba ocupada con el dato de
React/framer-motion (más fuerte para el gancho). Queda disponible para una 4ª pieza
futura con `dropzone-progress` o `sidebar-nav` (ninguno de los dos se usó esta vuelta).

## Las 3 piezas

### 1. `upload-button.mp4` (12,00 s · 1080×1920 · 30fps · mudo)

- **0-3 s:** 3 estados reales — reposo ("Upload") → subiendo (barra a mitad,
  "Uploading...") → completado ("Completed", sin fantasma del label anterior).
- **3-8 s (placa):** *"El original usa React + framer-motion. Acá: CSS puro, 0 kB."*
- **8-12 s (placa, keyword verde):** *"¿Tu web pesa de más?"* → **Escribí SISTEMA**
- **Copy sugerido para el post** (no se publica sin OK de Sergio):
  > Vimos este botón de subida en un reel y lo reconstruimos mirando los fotogramas
  > — no es el código del creador, eso no lo comparten (queda atrás de "comentá
  > Code"). El original corre con React + framer-motion. Esto es CSS puro.
  >
  > ¿Querés saber si tu web tiene este nivel de detalle? Escribí **SISTEMA** y te
  > paso el link para agendar el diagnóstico de 20 minutos.
  >
  > Patrón original: instagram.com/p/Dbx6AWGz_av

### 2. `floating-cart.mp4` (12,00 s · 1080×1920 · 30fps · mudo)

- **0-3 s:** catálogo (0 ítems) → 1er "Agregar" (el botón flotante entra) → carrito
  abierto (`<dialog>` nativo con backdrop, envío calculado, CTA de WhatsApp).
- **3-8 s (placa):** *"El modal es un `<dialog>` nativo: Escape, foco atrapado y
  devolución de foco, gratis del navegador."*
- **8-12 s (placa, keyword verde):** *"¿Tu carrito hace esto?"* → **Escribí SISTEMA**
- **Copy sugerido:**
  > Este carrito flotante lo vimos en un reel (código gateado, como siempre) y lo
  > reconstruimos mirando los fotogramas. El modal es un `<dialog>` nativo del
  > navegador: Escape, que el foco quede atrapado adentro y que vuelva al botón al
  > cerrar — los tres, gratis, sin una librería de modales.
  >
  > ¿Tu carrito web hace esto? Escribí **SISTEMA** y te paso el link del
  > diagnóstico de 20 minutos.
  >
  > Patrón original: instagram.com/p/DbDjpLuTnKK

### 3. `chat-widget.mp4` (12,00 s · 1080×1920 · 30fps · mudo)

- **0-3 s:** landing con la burbuja → panel abierto (conversación + chips) → chip
  "¿Cuánto cuesta?" clickeado y el bot ya respondió.
- **3-8 s (placa):** *"Con transition: 0.01ms el panel queda abierto e invisible.
  Va: transition: none."*
- **8-12 s (placa, keyword verde):** *"El detalle que nadie prueba."* →
  **Escribí SISTEMA**
- **Copy sugerido:**
  > Este widget de chat lo vimos en un reel y lo reconstruimos mirando los
  > fotogramas (código gateado detrás de "comentá Code", como siempre). El panel
  > es un `popover` nativo. El detalle que casi nadie prueba: si lo cerrás con
  > `transition-duration: 0.01ms` (el truco típico para respetar
  > `prefers-reduced-motion`), el panel queda abierto e invisible — hay que
  > interceptarlo con `transition: none`.
  >
  > ¿Tu web prueba este caso? Escribí **SISTEMA** y te paso el link del
  > diagnóstico de 20 minutos.
  >
  > Patrón original: instagram.com/p/DbsUAxCgA3W

## Decisiones tomadas

1. **Keyword: SISTEMA en las 3, no LISTA.** El recurso de LISTA (PDF de una
   página, per `ONIA_CRONOGRAMA_CONTENIDO_20260814.md` §0) **todavía no existe** —
   el prompt pedía marcarlo como bloqueado si alguna pieza cerraba pidiéndolo. No
   hizo falta: el contenido de estas 3 piezas es prueba de oficio técnico ("mirá
   cómo lo hicimos"), y el siguiente paso natural es una conversación (SISTEMA →
   diagnóstico de 20 min), no un PDF sobre qué tareas de negocio automatizar
   primero (eso es LISTA, y no calza con el tema de esta tanda). **SISTEMA ya
   tiene su recurso vivo (link a Cal)**, así que ninguna de las 3 piezas queda
   bloqueada.
2. **Las 3 piezas cierran con keyword (CTA), no con pregunta de engagement.** El
   formato del prompt A6 lo pide explícito banda por banda ("8-12s cierre pidiendo
   la palabra clave") para las 3 piezas. Esto **no sigue** la regla de cadencia de
   `ONIA_CRONOGRAMA_CONTENIDO_20260814.md` §3-bis ("nunca más de 1 de cada 4 posts
   pide algo", 3 educacional / 3 engagement / 2 CTA en los 8 carruseles de ONIA).
   Si estas 3 piezas se meten en el mismo feed que esos 8 carruseles, revisar
   la cadencia antes de programar — quedan 3 CTA seguidas si se publican juntas.
3. **Viewport retrato (720×1360 @1.5x → 1080×2040), no el lienzo panorámico de
   P05.** Estos patrones son tarjetas autocontenidas (no sitios completos), así
   que capturar ya en vertical evita el crop/pan pensado para pantallas de
   escritorio y deja 120 px de sobra para la deriva de 80 px sin necesitar la capa
   de overlay que sí hace falta en P05.
4. **`page.addStyleTag()` en vez de escribir un `_reel.html`.** Dado que el formato
   de esta pieza no muestra código en pantalla (a diferencia de P04), no hacía
   falta el compuesto rótulo+iframe+`<pre>`+cursor de `_reel.html` — inyectar el
   fondo de marca y el centrado en vivo, sobre el archivo original sin tocarlo,
   resuelve lo mismo con menos piezas.

## Cobertura real

- 9/9 estados reales capturados con Playwright interactuando de verdad (no
  animación fabricada) — verificados visualmente, 1 timing corregido
  (`upload-button` "Completed" tenía fantasma de "Uploading..." por capturar
  100ms antes de que terminara el crossfade de opacidad del label; corregido a
  600ms de margen).
- 3/3 videos verificados con `ffprobe`: 12,00 s exactos, 1080×1920, 30fps, h264.
- Cortes entre bandas (loop→placa "por qué"→placa CTA) verificados frame a frame
  en `floating-cart.mp4` (frames 89/90 y 239/240): sin artefactos, sin frames
  repetidos ni corruptos.
- Sin audio, sin música, sin voz, sin cara — tal como pide el formato.
- **No se publicó nada.** `SISTEMA` es la única keyword usada y su recurso (link a
  Cal) ya está vivo — no queda ninguna pieza bloqueada por recurso faltante.

## Archivos

```
hermes-content/references/piezas-ui-patterns/
├── LEEME.md                  (este archivo)
├── build.mjs                 (pipeline: capture → clips → plates → concat)
├── upload-button.mp4         (entregable)
├── floating-cart.mp4         (entregable)
├── chat-widget.mp4           (entregable)
└── raw/                      (intermedios: 9 PNG de estados, 9 clips de 1s,
                                6 placas de texto + sus .txt, 3 list.txt de concat)
```
