# Reel DdE7wYbxjPK — estilo "tutorial vertical partido" (Santiago, 2026-09-17)

**Fuente:** https://www.instagram.com/p/DdE7wYbxjPK/ · 92,8 s · 720×1280 · con audio
**Pedido de Sergio Urcullo:** "aprende esta manera de edicion".
**Cobertura:** Gemini nativo (video+audio completo, `gemini-flash-lite-latest`; el flash
normal dio 503 cuádruple ese día) + 8 fotogramas leídos con visión propia (2/8/20/38/50/64/80/90 s).
**Contenido del reel:** el creador (Santiago, el del tutorial de 28 min del método) cuenta que
reemplazó a su editor con "GPT-6 Astra" + el MCP de DaVinci Resolve. Caption solo: «Comenta
"Astra" para el tutorial completo».

## La gramática del layout (lo que define el estilo)

**Pantalla partida vertical fija:** cabeza hablante ABAJO (~45%, plano medio corto, trípode,
fondo de su estudio) + zona de apoyo ARRIBA (~55%) que **cambia de contenido todo el tiempo**
mientras la cabeza queda anclada. La zona de apoyo rota entre: screencast del timeline de
DaVinci, chat del agente (Claude Code / interfaz tipo Cursor), PCBs 3D de stock, arte
full-bleed de marca (shader de Claude Code con su logo), fotos de sus capacitaciones.

| Rasgo | Detalle medido |
| --- | --- |
| Cortes | ~25-30 en 92 s; planos de 1,5-3 s hablando, ráfagas de ~1 s en b-roll |
| Jump cuts | constantes en la cabeza (silencios/respiraciones fuera) |
| Cámara | cero movimiento real; punch-ins digitales sutiles para énfasis |
| Subtítulos | zona baja del segmento de cabeza; sans gruesa BLANCA con sombra; 2-5 palabras por vez; keyword resaltada en **AMARILLO** |
| Rótulos | dos estilos: mini-etiqueta CIAN uppercase arriba-izquierda ("4 VIDEOS TERMINADOS") y título blanco bold ("PREPARANDO DAVINCI", "ASTRA 6") |
| Ecuación de logos | logos flotantes como gramática: ChatGPT + DaVinci = monedas 💰 (entra con pop) |
| B-roll con subs propios | reusa clips de SUS videos anteriores ya subtitulados dentro de la zona de apoyo |
| Fotos | secuencias con ken burns lento (capacitación con ingenieros) |
| Audio | música tech sutil constante + whooshes en cambios de plano + pops al resaltar texto; ducking leve |
| Transiciones | hard cuts casi siempre; crash zooms ocasionales entre pantalla y cara |
| CTA final | fondo = b-roll TOTALMENTE desenfocado + texto centrado estático; keyword "Astra" en amarillo entre comillas |

## Receta replicable (7 pasos)

1. **Base 9:16 partida:** cabeza abajo fija, apoyo arriba que rota cada 1-3 s. La cabeza es
   el ancla de continuidad; el movimiento visual vive arriba.
2. **Subtítulos de impacto:** blanco bold + sombra, 2-5 palabras, keyword en amarillo.
   Sincronía frase-por-frase (no karaoke palabra-por-palabra estricto).
3. **Jump cuts agresivos:** cero baches; corte cada ~2 s en la toma principal.
4. **Screencast con zoom focal:** al mostrar software, zoom digital directo a la línea/botón
   que importa (dirigir el ojo, no mostrar la pantalla entera).
5. **B-roll relámpago:** cada herramienta nombrada = su visual (logo full-bleed, mockup,
   stock 3D) máx 1-1,5 s.
6. **Ecuaciones de logos flotantes** para conceptos ("X + Y = plata") con pop + whoosh.
7. **CTA de cierre:** blur total del fondo + texto centrado con la keyword en amarillo.

**Relación con nuestro stack:** los pasos 2, 3 y 4 ya los cubre `editor-videos` (subtítulos
quemados, silencios, zooms); lo NUEVO para nosotros es el **layout partido con cabeza anclada**
(hoy editamos full-frame con overlays) y la **ecuación de logos** como recurso. Ambos son
composiciones HyperFrames perfectamente factibles (1080×1920, alpha).

## Trampas de infraestructura que este intake dejó (ya fixeadas en `fetch-video.mjs`)

1. **yt-dlp reescribe el jar de cookies al salir** y en un intento fallido lo guarda SIN
   `sessionid` (IG lo borra vía Set-Cookie al rechazar). Nos vació el jar dos veces.
   Fix: yt-dlp recibe copia descartable (`cookies.txt.ytdlp`).
2. **`--login` no abría ventana con sesión revocada:** IG revoca server-side (302 al login +
   Set-Cookie que mata el sessionid) pero el cookie zombie queda en el perfil y el script lo
   tomaba por sesión viva. Fix: `--login` siempre abre ventana y limpia cookies antes.
3. **Captcha roto en la ventana de login:** el flag `--enable-automation` de Playwright hace
   que reCAPTCHA se niegue a validar. Fix: `ignoreDefaultArgs: ['--enable-automation']` +
   `--disable-blink-features=AutomationControlled`, y arrancar en la portada, no en
   `/accounts/login/`.
