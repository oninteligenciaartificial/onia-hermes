# Escribir el prompt en vivo es el reel entero

- **Fuente:** https://www.instagram.com/p/DbqmAEYhJsF/ · @marian.rojass
- **Tipo:** MIXTO (IA + MARKETING)
- **Veredicto:** SIRVE YA
- **Cobertura:** 45 de 45 fotogramas leídos (7 `base_*` + 38 `texto_*`, el 100%). Caption completo. NO leído: el audio (Speaches falló — no afirmo nada sobre voz ni música), la ventana 6–10 s que solo tiene 2 láminas, y cualquier respuesta de texto de ChatGPT (nunca aparece en pantalla).

## Que muestra, textual

**Texto sobreimpreso (fijo, idéntico en los 13,7 s, 4 líneas centradas):**

```
No tengo
cannon g7x
pero si
ChatGPT
```

**Prompt escrito dentro del composer de ChatGPT (RECUPERADO — se lee letra por letra mientras se teclea, no está reconstruido):**

```
Haz que la foto paresca tomada con una cannon g7x con flash. (NO modifiques la cara, dejala tal cual esta)
```

Se ve tipearse en este orden exacto a lo largo de los fotogramas: `…con flash` → `. (N` → `(NO` → `(NO mo` → `(NO mod` → `(NO modifi` → `(NO modifiqu` → `(NO modifiques ` → `la` → `la cara` → `la cara,` → `dej` → `dejala` → `dejala tal` → `cua` → `cual` → `cual est` → `cual esta` → `cual esta)`. Las faltas de ortografía son del original y quedan a la vista: **"paresca"**, **"cannon"** (con dos enes), **"dejala"** y **"esta"** sin tilde. El corrector de iOS las marca en rojo en pantalla y el prompt funciona igual.

**Textos de la app (recuperados literal):** barra superior `Chat`; placeholder `Ask ChatGPT`; y las dos tarjetas de progreso de la generación de imagen: `Sketching it out` (t = 7 s) y `One last tweak…` (t = 9 s).

**Caption completo, verbatim:**

```
No tengo cannon g7x pero si ChatGPT 🤌🏼🫰🏼 #canong7xeffects #flasheffect #edithack #hackedit
```

No hay CTA. No hay "comentá X". No hay link. No hay voz en cámara: es 100% grabación de pantalla, nadie aparece hablando.

## Como esta hecho — la reconstruccion

**Tipo IA. "Cómo se hizo" = modelo + insumos + prompt literal + qué se hizo fuera del generador.**

- **Herramienta:** la app de **ChatGPT en iOS** (se reconoce por la barra `Chat`, el composer, el teclado nativo y los textos de progreso `Sketching it out` / `One last tweak…`, que son de la herramienta de imagen de ChatGPT). **El modelo exacto NO se dice** — ni en pantalla ni en el caption. No digo cuál es.
- **Insumo:** UNA foto propia adjuntada al chat. Se ve como miniatura en el composer durante los primeros ~6 s.
- **Generaciones:** el video muestra **una sola** pasada. `Sketching it out` y `One last tweak…` son dos *estados* del mismo trabajo, no dos generaciones. Cuántos intentos hubo antes de grabar, **no se dice**.
- **Fuera del generador:** nada de retoque. Lo único que se hizo fuera es la grabación de pantalla, el texto sobreimpreso y (inferido, ver abajo) la aceleración del tecleo.

**Cuál es cuál — verificado, no supuesto.** Al final el video hace *swipe* entre dos imágenes y hay que saber cuál es cuál. Amplié la miniatura del composer (la imagen que ella SUBIÓ) y la comparé con las dos:

| | ORIGINAL (la que sube) | GENERADA (la que devuelve ChatGPT) |
|---|---|---|
| Pared superior izquierda | tiño rosa/magenta ambiente | blanco neutro, sin tinte |
| Bajo la lámpara | halo de luz difusa grande | sin halo; la pared queda plana |
| Piso | verde-azulado lavado | azul marino/carbón, más denso |
| Sujeto | mismo brillo que el fondo | más brillante que el fondo, contraste alto |
| Lectura | luz ambiente cálida de local | flash directo: mata el ambiente, neutraliza el color, hunde el fondo |

O sea: **la generada es la más FRÍA y limpia, no la más cálida.** Es exactamente lo que hace un flash de cámara compacta: aplasta el ambiente, neutraliza el balance y separa al sujeto del fondo. La pinta "rosa cálida" que uno esperaría del look Canon G7X ya estaba en la foto original.

**El truco de prompt que vale — la cláusula negativa entre paréntesis.** `(NO modifiques la cara, dejala tal cual esta)` en mayúsculas. Ese es el mecanismo real: al pedir un cambio de *iluminación* sobre una foto con persona, el modelo tiende a reinterpretar el rostro. La cláusula lo ancla. Es la misma familia de palanca que ya tenemos anotada del lote del 22-ago y acá aparece en su forma más corta: **una sola frase, en mayúsculas, entre paréntesis, al final del prompt.**

**Tipo MARKETING. "Cómo se hizo" = el molde, segundo a segundo (cifras MEDIDAS con ffprobe/ffmpeg):**

- Duración **13,697 s** · 720×1280 · 30 fps · 408 frames · **solo 2 cortes**, en **9,47 s y 9,80 s**.
- **0,0 – ~5,9 s (43% del video, un solo plano):** se teclea el prompt. Nada más. El gancho ES ver escribirse el prompt.
- **~5,9 – 9,4 s:** enviado. Composer vacío, botón de stop azul, y las dos tarjetas de progreso. La espera se muestra, no se corta.
- **9,47 s y 9,80 s (los 2 únicos cortes):** entrada al visor de imagen a pantalla completa. **Los dos cortes del video están los dos en el mismo instante: el reveal.** No hay un solo corte en los 9,5 s de tecleo.
- **9,8 – ~11,2 s:** la GENERADA a pantalla completa.
- **~11,4 – 12,5 s:** swipe → el ORIGINAL, para comparar.
- **~12,7 – 13,7 s:** swipe de vuelta → **termina en la generada.**

**La estructura, desnuda:** promesa en 4 palabras ("no tengo X, pero sí ChatGPT") → 6 segundos de prueba de trabajo → espera real → reveal → comparación → cierre en el resultado. **El activo guardable no es la foto: es el prompt.** Por eso el prompt ocupa el 43% del metraje y la foto el 28%. El post no pide nada; el guardado es la conversión.

**Un dato INFERIDO, y lo digo como inferido:** entre t = 0,00 s y t = 5,25 s el composer pasa de 59 a 122 caracteres, o sea **63 caracteres en 5,25 s = 12 caracteres por segundo ≈ 144 ppm en teclado táctil**. Eso está muy por encima de un tecleo humano normal con pulgares. **Inferencia: el tramo de tecleo está acelerado en edición** (o se recortó el arranque, ya que a t = 0 ya hay 59 caracteres escritos). No está dicho en ningún lado; es una deducción de la medición.

## El estilo, como conocimiento portable

Medido sobre `texto_001_05` (1080×1920) con muestreo de píxeles, no a ojo.

- **Tipografía:** una sola. Sans geométrica redondeada de peso ExtraBold/Black, caja mixta (`No tengo`, no `NO TENGO`). **Sin contorno, sin sombra, sin caja de fondo** — algo poco común en Reels y que acá funciona porque el fondo es blanco puro. La familia exacta no se dice; por la forma de la `g` de doble piso y la `a` redonda es de la familia Poppins/Montserrat ExtraBold — **inferido, no confirmado**. Cuerpo ≈ 52 px sobre 1920 de alto = **2,7% de la altura del cuadro**. Interlínea medida: **paso de línea de 57–58 px ≈ 1,1×** — apretadísima; las líneas casi se tocan. 4 líneas, quiebre por sentido, no por ancho.
- **Paleta (hex APROXIMADO — leído de una pantalla, con compresión jpeg de por medio):**
  - Magenta-violeta del texto: núcleo medido **≈ `#C042E5`**, pico en borde **`#D12EFF`**. El valor "puro" antes de compresión está entre esos dos.
  - Fondo (la app en claro): **`#FEFFFD`**, prácticamente blanco puro.
  - Burbuja / composer: **`#F9F8F6`**.
  - Fondo del teclado iOS: **`#DCE0E3`**.
  - **Un solo acento sobre neutro absoluto.** Cero degradados, cero segundo color.
- **Composición:** vertical 9:16, todo grabación de pantalla sin marco ni mockup. El bloque de texto vive en **y = 20% – 30,6%** de la altura, centrado (392–658 px de 1080). Y ahí está la decisión buena: **está estacionado exactamente en el hueco vacío del chat**, arriba de la burbuja y abajo de la barra `Chat`. Nunca tapa el prompt. Cuando la conversación crece y sube por la pantalla (t = 5,75 s), el texto sí se superpone y se lee mal por dos segundos — el único fallo de diseño del video.
- **Ritmo:** 13,697 s, **2 cortes, ambos en el reveal (9,47 / 9,80 s)**. 9,5 s de un solo plano continuo. El molde entero es "un plano larguísimo + un solo corte que paga".
- **Motion:** **ninguno propio.** Cero animación de entrada del texto, cero escala, cero keyframes. El único movimiento en pantalla es el nativo del sistema: el teclado de iOS, el scroll del chat al enviar y el swipe del visor de imágenes. Es un anti-patrón deliberado: el movimiento lo pone la app, no el editor.
- **Textura:** ninguna añadida. Sin grano, sin viñeta, sin filtro. UI de iOS cruda. La única "textura" del video es la que trae la imagen generada (el flash).

**Se porta a:**
- La ficha completa → `hermes-content/references/video-intake/` (según la tabla "dónde va cada cosa" de CLAUDE.md).
- La receta del overlay (tipografía + `#C042E5` + 2,7% de altura + interlínea 1,1 + posición y=20–30%) → skill **`captions-overlay`**, y su implementación en **`editor-videos` / HyperFrames**.
- La cláusula negativa `(NO modifiques X, dejalo tal cual esta)` → skill **`sacar-prompt`**, junto a las palancas del lote del 22-ago.
- **NO va** a `web-factory/docs/MOTION_PATTERN_BANK_2026.md`: no hay ningún patrón de movimiento que registrar. Anotarlo ahí sería ensuciar el banco.

## Las tres preguntas

1. **Frente:** dos, y distintos. (a) **marketing / motor de contenido** — el molde "prompt en vivo" es el que nos sirve de verdad: es un formato de reel que no necesita cara, ni voz, ni actor, ni presupuesto, y que Onia puede producir con una grabación de pantalla del producto vivo. (b) **`sacar-prompt`** — la cláusula negativa entre paréntesis es una palanca de prompt que se agrega a la skill hoy.
2. **Herramienta nuestra:** para el molde de video, **`editor-videos` + HyperFrames** (overlay estático sobre screen recording: es el caso más barato que existe en nuestro motor, no hace falta ni un keyframe) y **`captions-overlay`** para el estilo del texto. Para leerlo, **`ver-videos`**, que es lo que se usó. Para replicar el *efecto de imagen* específico existiría el catálogo **Higgsfield** (`models_explore` / presets), pero para nuestro uso no hace falta: el molde no depende de la foto con flash.
3. **Qué falta:** **nada** para portar el molde. Todo lo que necesita está: HyperFrames instalado y probado, el editor de videos completo y en main, la plataforma con rubros encendidos en producción para grabar, y el destino del CTA ya decidido (demo en cal.onia.com.bo). El único límite es de contenido, no de herramienta: **solo se puede grabar lo que está VIVO en producción** — nada detrás de un flag apagado, y ningún cartel de "muy pronto" en cámara.

## Lo que NO se puede afirmar

- **El modelo de imagen.** El caption dice "ChatGPT" y la pantalla muestra la app de ChatGPT en iOS. La versión del modelo **no se dice** en ningún lado.
- **Lo que se oye.** Speaches devolvió "fetch failed" para los 26 del lote. No hay transcripción. Nadie habla en cámara (es screen recording puro), pero **no verifiqué** si hay música, cuál es, ni si hay voz en off.
- **Cuántos intentos costó.** El video muestra una generación. Si hubo cinco antes, no se ve y no lo digo.
- **Que el prompt sea reproducible tal cual.** No lo corrí. El prompt está recuperado literal de la pantalla; que devuelva ese mismo resultado no lo probé.
- **Rendimiento.** No leí likes, guardados, comentarios ni alcance. Cualquier afirmación de "funciona" sería inventada.
- **La tipografía exacta.** Poppins/Montserrat ExtraBold es una inferencia por forma de glifo, no un dato.
- **Los hex.** Son medidos sobre un fotograma jpeg comprimido de una grabación de pantalla. Son aproximados por definición.
- **Los 4 segundos entre 6 y 10 s.** Solo tengo 2 láminas ahí. Lo que pasó entre `Sketching it out` y `One last tweak…` no lo vi.
- **La aceleración del tecleo** es una inferencia mía a partir de 12 caracteres/segundo medidos, no algo que el post declare.
