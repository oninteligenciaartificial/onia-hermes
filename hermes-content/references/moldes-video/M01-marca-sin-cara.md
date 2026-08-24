# Molde M01 — Pieza de marca SIN CARA y SIN VOZ

> Primer molde del banco. Nace de la ficha `video-intake/analisis/2026-08-20-items.json`
> (shortcode `DcAAUevMTG6`, veredicto SIRVE_YA), que además señalaba el hueco:
> *"no tenemos un banco de MOLDES de anuncio estructurado — eso también es un resultado"*.
>
> **Por qué este molde antes que cualquier otro:** sin cara = sin el problema de
> consistencia de rostro, que es lo que más nos frena. Y funciona **muteado**, que es como
> se ve el 85 % del feed.

## Las 5 reglas portables

Esto es lo que se copia. Lo demás (cóctel, tenis vintage) es el vestido de ese anuncio.

| # | Regla | Por qué funciona |
|---|---|---|
| 1 | **Ningún plano muestra una cara.** Solo manos, objetos, pantallas, texturas | Elimina casting, derechos de imagen y la deriva de identidad |
| 2 | **La marca aparece UNA vez, en el último segundo.** Orden: mundo → objeto → marca | Si la marca abre, el scroll gana. Si cierra, ya te ganaste los 30 s |
| 3 | **Hilo de color repetido plano a plano** | La cohesión NO viene del relato (no hay). Viene de un color que salta de objeto en objeto |
| 4 | **Carrier element**: un mismo elemento cruza el encuadre en 3 de 7 planos | Es el pegamento entre tomas que no comparten espacio |
| 5 | **La cámara NUNCA a la altura de los ojos.** Contrapicado extremo o cenital. Cero subtítulos | Se lee como cine, no como contenido. Y funciona sin leer |

**Mecánica de conversión: NO va en pantalla.** Ni CTA, ni link, ni "link en bio". Es
embudo alto puro; si hay pedido, vive en el caption.

## Estructura de 7 beats (~30-33 s, ~4,7 s por beat)

| Beat | Función | Qué es |
|---|---|---|
| 1 | **Gancho cinético** | Movimiento, no información. Plano PARCIAL, algo cruza el cuadro. Sin marca, sin texto |
| 2 | **Beat extraño** | El "¿qué?" que compra los segundos siguientes |
| 3 | **La acción** | La única vez que se muestra el objeto haciendo lo suyo |
| 4 | **Aspiración** | Vende el MUNDO, no el objeto |
| 5 | **Hero a contraluz** | El objeto en su mejor luz |
| 6 | **Bodegón cenital** | Todo junto, ordenado, desde arriba |
| 7 | **Placa** | La marca, translúcida, un segundo |

## Adaptación a marca personal de software (@sergio_urcullo)

El molde original vende un producto físico. Para una marca personal de alguien que
**construye software**, la traducción es directa — el "producto" es el trabajo:

| Beat | Original (cóctel) | Traducción |
|---|---|---|
| 1 | Raqueta cruzando en whip | Una mano cerrando una laptop de golpe, contrapicado desde el borde del escritorio |
| 2 | Cono de pelotas de tenis | Un cuaderno lleno de números a mano **al lado** de la pantalla — lo viejo y lo nuevo en el mismo plano |
| 3 | El pour sobre las cuerdas | La única toma de pantalla real: algo ejecutándose |
| 4 | Dos modelas, palmeras | La calle de Santa Cruz de noche desde la ventana — el mundo donde pasa |
| 5 | Copa a contraluz | La laptop sola encendida a oscuras, contraluz |
| 6 | Bodegón cenital | Cenital del escritorio: cuaderno, calculadora, taza, laptop |
| 7 | Placa "CITRINE" | `@sergio_urcullo` en verde, translúcido, un segundo |

- **Hilo de color:** el verde de marca (`#10C26B`) saltando de objeto en objeto —
  luz de pantalla → un post-it → el cursor → la tipografía final.
- **Carrier element:** la **luz de la pantalla** cruzando el encuadre. Aparece en 3 de los
  7 planos y pega tomas que no comparten espacio.
- **Cámara:** cenital y contrapicado, nunca a los ojos.

## Costo

**0 créditos** si se compone: HyperFrames + fotos que ya existen + capturas de pantalla
reales. Genera crédito solo si se pide plano nuevo a Higgsfield (~2 cr por imagen).

## Cuándo NO usar este molde

- Cuando la pieza tiene que **explicar** algo. Este molde no afirma nada: es puro clima.
  Para explicar va el molde de demo de 17 s (§10.1 del sistema de marketing).
- Cuando el CTA tiene que estar en pantalla. Acá la conversión vive en el caption o no vive.

## Lo que la ficha original dejó abierto

- El audio no se pudo analizar: Whisper alucinó 8 bytes sobre una pista de solo música.
  No sabemos qué música es.
- El caption no se trajo, y ahí vive el CTA si existe.
- El prop más raro (el cono) no se pudo confirmar como práctico desde un solo fotograma.
  Se resuelve con `video_analysis_create`, que es **gratis**.
