# El látigo sobre la terminal: un overlay dibujado que golpea una captura de pantalla

- **Fuente:** https://www.instagram.com/p/Day9oS2ClDu/ · @algorithmicscaracasccct
- **Tipo:** MIXTO (contenido IA · forma MARKETING/video)
- **Veredicto:** SIRVE YA — **por la FORMA, no por el contenido.** El contenido es humo (ver abajo); la técnica de overlay es portable hoy.
- **Cobertura:** 27 de 27 fotogramas leídos (3 base + 24 texto = 100%) + caption completo. No leído: el audio (Speaches falló), el contenido de `Task.txt`, y el repo del proyecto (no se nombra en ningún lado).

## Que muestra, textual

**Texto en pantalla — RECUPERADO (una sola línea, estática los 6.920 s completos):**

> Alguien creó un látigo digital que hace que Claude funcione más rápido y los desarrolladores ya lo están usando

**Título de la ventana — RECUPERADO:**

> Read and execute Task.txt file

**Contenido de la terminal — RECUPERADO literal (Claude Code corriendo en Windows):**

```
Web Search("failed AI hardware products Jibo Kuri analysis why")
  Interrupted · What should Claude do instead?
Web Search("successful consumer hardware products retention weekly usage AirPods Apple Watch")
  Interrupted · What should Claude do instead?
Web Search("AI pin Humane failure retail 2024")
  Interrupted · What should Claude do instead?
Web Search("consumer hardware retention mechanics what keeps people using devices")
  Interrupted · What should Claude do instead?
Web Search("voice assistant hardware limitations constraints")
  Interrupted · What should Claude do instead?

FASTERFASTERGO FASTERWork FASTERFASTERFaster CLANKER

I'll write the research document directly from my knowledge:
  Interrupted · What should Claude do instead?

FASTERWork FASTERFASTERFASTERGO FASTER
Forming…
Forming… (thinking)
Blanching…

FASTERWork FASTERFASTERFASTERGO FASTERGO FASTER Speed it up clanker
Ruminating…

FASTER

Press up to edit queued messages
esc to interrupt
```

**Escritorio visible:** carpetas `biscuit` y `partyhat`; archivos `…lly.zip` y `biscuit.zip` (iconos WinRAR); barra de tareas de Windows con ~11 apps.

**Caption — RECUPERADO literal:**

> 🤯 Un desarrollador creó un curioso "látigo digital" para Claude… y sorprendentemente la gente ya lo está usando.
>
> A medida que los asistentes de IA se vuelven parte del trabajo diario de miles de programadores, también empiezan a aparecer herramientas diseñadas para controlar cómo interactúan con ellos. Aunque este proyecto nació como una broma, su objetivo es real: reducir respuestas innecesarias y hacer que el flujo de trabajo sea mucho más ágil.
>
> En la demostración, un látigo animado aparece mientras Claude genera código, interrumpiendo la respuesta para empujarlo a contestar más rápido. No mejora el modelo de IA en sí, pero sí cambia la forma en que se gestiona, haciendo que la experiencia se sienta más rápida y eficiente.
>
> Este tipo de herramientas refleja una nueva tendencia: ya no solo estamos creando software con IA, ahora también estamos creando software para administrar la IA. Cada vez aparecen más proyectos enfocados en optimizar asistentes, acelerar iteraciones y mejorar la productividad de quienes programan.
>
> 🔗 Créditos: @GitFrog1111

## El contenido se cae solo — dato para nuestra regla de "no fabricar"

**La pantalla contradice al titular.** El titular dice "hace que Claude funcione más rápido". Lo que se ve, literal, es que CADA `Web Search` termina en `Interrupted`, y que después del spam de mensajes en cola Claude escribe:

> "I'll write the research document directly from my claude:" → **`I'll write the research document directly from my knowledge:`**

Es decir: el "látigo" no acelera nada, **cancela la investigación y fuerza a responder de memoria**. Es una degradación de calidad vendida como ganancia de velocidad. El propio caption lo admite a medias ("No mejora el modelo de IA en sí"), pero el titular ya cobró el clic.

Mecánicamente lo que se ve es trivial: **mensajes encolados** (`Press up to edit queued messages`) que se disparan mientras corre una herramienta y la interrumpen. No hay herramienta nueva ahí; hay `esc` con esteroides y un dibujo encima.

**Esto es exactamente el error que la regla de Sergio prohíbe: afirmar una capacidad que la evidencia en pantalla desmiente.** Guardar el post como ejemplo negativo vale tanto como la técnica.

## Como esta hecho — la reconstruccion

**El molde de video (MARKETING), medido:**

| Dato | Valor |
|---|---|
| Duración | **6.920 s** (medido, ffprobe) |
| Resolución / fps / frames | **720×1280 · 30 fps · 205 frames** (medido) |
| Cortes | **0** (medido, umbral scene 0.3) |
| Planos | 1 solo, continuo |
| Titular | 1 solo, estático, presente el 100% del tiempo |
| CTA | **ninguno** |

La estructura completa: **captura de pantalla real + un titular estático + un elemento animado dibujado encima.** Eso es todo. No hay cortes, no hay zooms, no hay b-roll, no hay cara. **Todo el ritmo lo pone el overlay, no el montaje** — ese es el hallazgo reproducible.

**La técnica del overlay (lo que de verdad sirve):**

1. Captura de pantalla completa del escritorio (OBS o similar — **no se dice cuál**), con la ventana de terminal y el Explorer detrás. La mugre del escritorio (los zips, `partyhat`, la taskbar llena) **es la que da autenticidad**: no está limpio, y por eso se lee como real y no como maqueta.
2. La captura se pega dentro de un lienzo 9:16 con letterbox negro arriba y abajo. La captura NO se recorta a pantalla completa: flota, y el negro sobrante es donde vive el titular.
3. Encima, una **animación 2D cuadro a cuadro** de un látigo: trazo de contorno blanco de ~3–4 px, **sin relleno**, sobre blend normal. Entra fuera de cuadro por arriba-derecha, describe un arco en S y restalla cerca del texto de la terminal.
4. En los picos de velocidad hay **frames de smear**: 3–5 trazos fantasma superpuestos en un mismo fotograma (visible en `texto_001_07`, `texto_002_03`, `texto_003_08`). Eso NO es motion blur de render: es la técnica clásica de animación tradicional de dibujar el rastro. Es lo que hace que el golpe se sienta rápido en un video que no tiene ni un corte.
5. El látigo **no interactúa físicamente** con la UI (nada se deforma, nada reacciona). La ilusión de impacto la produce solo la trayectoria + el smear + (presumiblemente) el SFX. **Inferido:** el impacto sonoro debe estar sincronizado al frame del restallo, pero el audio no se transcribió — no lo puedo confirmar.

**Anotación de encoding:** en `texto_003_05` el texto del título de la ventana aparece duplicado/fantasma. Es artefacto de frame-blend por reencodeo (repost sobre repost), no un efecto. Señal de que este archivo ya pasó por varias manos — el original de @GitFrog1111 estará más limpio.

**La capa del reposteador:** @algorithmicscaracasccct no hizo el video. Puso el titular en español, el caption en español y el crédito. Su aporte es la **traducción de formato**: tomar un clip técnico en inglés y envolverlo en un titular de 3 líneas + caption explicativo de 4 párrafos. Eso también es un molde, y es barato.

## El estilo, como conocimiento portable

**Tipografía.** Sans humanista de peso regular (no bold), blanco puro, caja baja, sin sombra, sin caja de fondo, sin borde. Tres líneas centradas, interlineado generoso (~1.25). Ocupa ~78% del ancho del lienzo. **No se dice qué fuente es** — por el corte de la "g" de doble piso y la "a" cerrada parece del grupo Lato / Source Sans / Open Sans, pero eso es **inferido, no verificado**. La decisión portable no es la fuente: es **texto desnudo sobre negro puro, sin ninguna decoración**. En un feed lleno de subtítulos con contorno y caja amarilla, el texto pelado sobre negro destaca por sobriedad.

**Paleta (hex APROXIMADO — leído de una pantalla comprimida, no muestreado del original):**

| Rol | Hex aprox |
|---|---|
| Fondo del lienzo (letterbox) | `#000000` |
| Titular | `#FFFFFF` / `#F2F2F2` |
| Fondo de terminal | `#0D0D0D` – `#111111` |
| Texto de terminal | `#C8C8C8` |
| Barra de mensaje del usuario | `#2E2E2E` con texto `#E0E0E0` |
| Spinner (`Forming…`, `Blanching…`, `Ruminating…`) | rosa/salmón `#E0748A` |
| Escritorio (Explorer) | `#F5F5F5` |
| Taskbar | `#1B1B1B` |
| Trazo del látigo | `#FFFFFF`, sin relleno |

**Toda la paleta es monocromática salvo dos acentos:** el rosa del spinner y los iconos WinRAR. En una pieza de 7 segundos, dos manchas de color en un mar de gris es exactamente donde va el ojo. Eso es transferible tal cual a nuestras capturas de producto.

**Composición.** 9:16. Tercio superior = negro con el titular. Centro = la captura, ancho completo del área útil. Tercio inferior = negro. El látigo cruza en **diagonal arriba-derecha → abajo-izquierda**, contra la lectura natural del texto: la trayectoria no compite con el titular, lo cruza por debajo.

**Ritmo.** 6.920 s / 1 plano / 0 cortes (los tres MEDIDOS). **Estimado (inferido de los 27 fotogramas, no medido cuadro a cuadro):** ~3 pasadas del látigo en esos 7 s, o sea un golpe cada ~2.3 s. La lección: **para 7 segundos no hacen falta cortes si tenés un elemento que se mueve.**

**Motion.** Animación tradicional cuadro a cuadro (no interpolación por keyframes: el grosor y la forma del trazo cambian entre frames de un modo que un tween no produce). Arco en S, entrada y salida fuera de cuadro, smear frames en el pico. **No se dice con qué se animó** — ni en pantalla ni en el caption.

**Textura.** Cero textura añadida. La única "textura" es la real: iconos, zips, taskbar, ventana de Explorer asomando. Es un principio, no un accidente: **la captura sucia vende más que el mockup limpio.**

**Se porta a:**
- `web-factory/docs/MOTION_PATTERN_BANK_2026.md` → patrón nuevo: **"overlay dibujado que golpea la UI"** (trazo de contorno + smear frames sobre captura estática, sin cortes).
- `hermes-content/references/video-intake/` → esta ficha.
- Skills `hyperframes-animation` y `oversized-cursor` → mismo principio exacto que el cursor sobredimensionado que ya tenemos: **un elemento gráfico deliberadamente fuera de escala encima de una UI real, que dramatiza una acción**. El látigo es el primo agresivo del cursor gigante.

## Las tres preguntas

1. **Frente:** **editor-de-videos** (sesión HyperFrames) como carril principal. Secundario: **marketing**, que se queda con el molde de reel de producto de 7 s / 0 cortes / 1 titular.
2. **Herramienta nuestra:** **HyperFrames** (motor HTML→MP4, instalado y probado). La composición es un `clip` con un `<video>` de la captura de pantalla y encima un `<svg>` con un `<path>` animado por `stroke-dasharray` + transform keyframeado; los smear frames se hacen con 3–5 copias del path desfasadas y con opacidad decreciente, encendidas solo en los fotogramas del pico. Skills que gobiernan: `hyperframes-core`, `hyperframes-animation`, `hyperframes-keyframes`, `oversized-cursor` (el patrón hermano), `captions-overlay` (el titular), `motion-doctrine` + `cut-the-curve` (la curva del restallo, y la prohibición de wobble ocioso: el látigo PERFORMA, no respira).
3. **Qué falta:** **nada bloqueante — cero gasto, cero credencial, cero permiso.** Solo dos insumos nuestros: (a) una captura de pantalla de Onia Platform ya restilada — la memoria de la landing v3 dice explícitamente que los dashboards se restilan ANTES de las capturas, así que ese es el orden; (b) decidir QUÉ acción dramatiza el gesto. **Y una advertencia de marca:** si portamos el molde hay que agregarle el cierre que este post NO tiene (agendar demo en cal.onia.com.bo), y **jamás** copiar la mecánica del titular — el post afirma una capacidad que su propia pantalla desmiente, que es justo lo que "no fabricar" prohíbe.

## Lo que NO se puede afirmar

- **El audio no se transcribió** (Speaches devolvió "fetch failed" para los 26 del lote). No sé si hay voz en off, música o solo SFX. Lo que SÍ se ve: no hay ningún sujeto en cámara — es captura de pantalla pura, no hay talking head. Pero **la sincronía del SFX con el restallo es inferencia mía, no dato**.
- **No se dice con qué se animó el látigo.** Ni herramienta, ni técnica, ni si fue a mano o con rig. No aparece en pantalla ni en el caption.
- **No se dice con qué se grabó la pantalla.** Hay algo que parece OBS en la taskbar, pero es un icono de 24 px comprimido: no lo afirmo.
- **No se nombra el proyecto ni el repo.** El caption solo acredita a `@GitFrog1111` como fuente. **No verifiqué que ese repo exista, ni qué hace, ni si es público.**
- **No se dice qué modelo de Claude ni qué versión de Claude Code.** La UI es reconocible pero no hay número de versión visible.
- **"los desarrolladores ya lo están usando" / "la gente ya lo está usando": sin una sola cifra, sin un solo repo, sin una sola prueba en pantalla.** Es afirmación del caption, no evidencia.
- **No se ve `Task.txt`** ni el prompt original: solo el título de la ventana.
- **El conteo de pasadas del látigo (~3) es inferido** de 27 fotogramas muestreados, no medido cuadro a cuadro. Los únicos números duros son los medidos con ffprobe: 6.920 s, 720×1280, 30 fps, 205 frames, 0 cortes.
- **Los hex de la paleta son aproximados**, leídos de una pantalla reencodeada. La fuente tipográfica es una conjetura por forma de letra, no una identificación.
