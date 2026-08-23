# Meme de dos cartas: setup vivo, remate congelado

**Fuente:** https://www.instagram.com/p/DcPwVniOEKB/ · `DcPwVniOEKB`
**Tipo:** MARKETING (meme de dos tiempos; no muestra nada hecho con IA, no muestra un mecanismo web, no muestra un producto)
**Veredicto:** SIRVE_YA
**Cobertura:** 3/3 base, 24/24 texto (100%), caption completo, 22 palabras de verbatim en pantalla, transcripción de 0 palabras sobre 6,619 s de audio. Cifras de ritmo **re-medidas por mí** sobre `lote-0823/mp4/Instagram-DcPwVniOEKB.mp4`.

---

## ⚠️ Corrección a la corrección (leer antes que nada)

El encargo me llegó con "CERO cortes en los tres umbrales" como dato medido, y con la orden de averiguar
con qué otra cosa se resuelve el chiste si no es con un corte. **Lo volví a contar y el dato heredado
está mal.** Comando y salida, textual:

```
ffmpeg -i Instagram-DcPwVniOEKB.mp4 -vf "select='gt(scene,X)',metadata=print:file=-" -f null -

X=0.30  →  frame:0  pts:58368  pts_time:3.8   lavfi.scene_score=0.484931
X=0.15  →  frame:0  pts:58368  pts_time:3.8   lavfi.scene_score=0.484931
X=0.08  →  frame:0  pts:58368  pts_time:3.8   lavfi.scene_score=0.484931
```

**Hay UN corte, en 3,800 s exactos.** El chiste sí se resuelve con un corte, y la ficha vieja acertaba
con su "~3,7 s". Causa probable del cero heredado (**esto es inferencia mía, no medición**):
`metadata=print` escribe por stderr, y si se corre con `-loglevel error` y sin `file=-`, la salida se
traga y el resultado vacío se lee como "no hubo cortes".

Lo que la ficha vieja sí tenía mal, y ahora queda medido:
- **Duración:** 6,600 s de video (198 fotogramas a 30 fps), no "~6 s". Los 6,731 s son la pista de audio.
- **Push-in "~3% en ~2 s": no existe.** Cámara clavada. Banda de techo (720×260 px desde y=0) entre
  el fotograma 2 y el 110: **PSNR 31,8 dB**. Un push-in del 3% desalinea esa banda y la tira muy por debajo.

---

## Qué muestra, textual

**Audio — verbatim: 0 palabras.** No hay voz. Pero **no es silencio**: 6,619 s de pista continua,
`mean_volume −16,5 dB`, `max_volume 0,0 dB` (clipeado). Es una cama musical fuerte de punta a punta.
Qué canción es **no se dice** ni se puede leer en pantalla.

**Texto en pantalla — CARTA A (0,000 → 3,767 s), quemado, 3 líneas centradas:**

> “I don’t have the skills
> or experience to build a
> startup”

**Texto en pantalla — CARTA B (3,800 → 6,567 s), quemado, 2 líneas centradas:**

> Me and bro with
> Claude code:

(Sí: **"Claude code"**, la c minúscula está en el original.)

**Texto diegético — dentro de la foto de la carta B, NO puesto por el autor**, en la tapa del libro
que lee el piloto:

> HOW TO LAND THIS THING

**Caption, literal:**

> When in doubt, ask Claude.
>
> #startup #softwareengineer #develeporlife

⚠️ El tercer hashtag está **mal escrito**: `#develeporlife` en vez de `developerlife`. Un hashtag con
typo no lo indexa nadie — es alcance regalado. Detalle chico y comprobable, vale copiarlo como
checklist antes de publicar, no como estilo.

**Lo que se ve, plano por plano:**

- **Carta A** — habitación de casa de noche, seis o siete personas laburando alrededor de una mesa de
  comedor, monitores encendidos, luz RGB magenta volcada sobre techo y paredes. Metraje real de
  teléfono. En una remera del fondo se lee **"Stanfor…"** (Stanford), leído del fotograma.
  En las pantallas hay un terminal con bloques rojo/verde y una ventana con lo que parece un mapa —
  **a 720 px de ancho no se lee una sola línea, así que NO puedo afirmar que lo que corre ahí sea
  Claude Code ni ninguna herramienta**.
- **Carta B** — foto de archivo de un piloto de caza en cabina, sobre nubes, leyendo el libro
  "HOW TO LAND THIS THING". Es un meme viejo y conocido; **quién lo hizo y de dónde salió no se dice**.

---

## Cómo está hecho — la reconstrucción

Formato MARKETING. El molde es de dos tiempos y no tiene una tercera parte:

| Tiempo | Ventana medida | Fotogramas | % del total | Qué pasa |
|---|---|---|---|---|
| **Setup** | 0,000 → 3,767 s | 114 | 57,6% | Objeción del espectador, en primera persona y entre comillas |
| **Corte** | **3,800 s** | 1 | — | Duro, seco. Sin cortinilla, sin fade, sin whip. `scene_score 0,485` |
| **Remate** | 3,800 → 6,567 s | 84 | 42,4% | La respuesta, en imagen fija |

**El motor de cada carta es distinto, y ahí está todo el oficio (medido, no estimado):**

- **Carta A está VIVA.** Scene score medio entre fotogramas 0,0031, máximo 0,0236 en 112 de 114
  fotogramas. Cámara fija (PSNR 31,8 dB en la banda de techo); lo que se mueve es **la gente dentro
  del cuadro**. Es el patrón "toma única con motor interno": el ritmo no lo pone el montaje, lo pone
  el contenido del plano.
- **Carta B está CONGELADA.** Scene score medio 0,00105, y **68 de los 84 fotogramas son idénticos**
  (delta por debajo de 1e-5). PSNR entre el primer y el último fotograma del plano: **39,0 dB**; entre
  dos consecutivos: **57,1 dB**. No es un plano quieto: es **una imagen fija sostenida 2,8 s**.

Ése es el hallazgo transferible: **el remate no se anima — se congela.** El contraste entre 3,8 s de
cuadro que respira y 2,8 s de cuadro absolutamente muerto es lo que hace de signo de puntuación. No
hace falta ninguna transición porque la transición **es** el cambio de régimen de movimiento.

**Segundo motor, el color.** La carta A es magenta saturada (interior nocturno con luz RGB); la carta B
es azul fría de exterior a la luz del día. El corte **invierte la temperatura**. Cálido → frío en un
fotograma, sin cross-dissolve.

**Tercer motor, la tipografía.** El texto **no se anima nunca**: aparece en el fotograma 0 de su carta y
no se mueve más. Cero fade, cero escala, cero typewriter. Y el remate se escribe **~1,5× más grande**
que el setup (banda de caja 40 px vs. 60-64 px; interlínea 61-67 px vs. 95 px, sobre 1280 de alto).

**Lo que se hizo fuera del generador:** todo. No hay generación de IA acá. Insumos: un clip propio de
teléfono + una foto meme de archivo + dos rótulos + un corte + una pista de música. Se hace en un
editor de teléfono en diez minutos.

---

## El estilo, como conocimiento portable

**Tipografía.** Grotesca pesada, casi condensada, caja mixta, tracking mínimo. Blanco puro (`#FFFFFF`,
confirmado: el máximo de luminancia en la banda del titular es 255) con contorno negro fino y sombra
suave por debajo — el contorno es lo que la hace legible sobre techo rosa claro Y sobre nubes blancas
con el mismo ajuste. **El nombre de la familia no se dice** en pantalla ni en el caption; parece una
grotesca de las que trae por defecto un editor de teléfono, pero eso es reconstrucción, no lectura.

Geometría medida sobre 720×1280:
- Bloque centrado en x=358 (centro del cuadro = 360). Ancho de caja **602 px = 83,6%** del cuadro.
- Carta A: 3 líneas, bloque y=298→471, o sea **23,3% → 36,8% de la altura**. Interlínea 61-67 px.
- Carta B: 2 líneas, bloque y=261→415, o sea **20,4% → 32,4%**. Interlínea 95 px. Tipo ~1,5× mayor.
- En las dos, el bloque vive en el **tercio superior** y deja los dos tercios de abajo para el sujeto.

**Paleta.** Hex leídos de un video comprimido: **son APROXIMADOS**, promedio de parches de 10×10 px.

*Carta A (cálida):* techo `#c65a97` · glow esquina superior izquierda `#e569aa` · pared superior derecha
`#933f6c` · sombra de pared `#470f25` · piso de madera `#81384e` · ventana nocturna `#0b0a13`.
*Carta B (fría):* cielo `#6e7ea8` · nubes `#c2c4cf` · oliva del equipo de vuelo `#585145`.

La paleta no es decorativa: **el salto cálido→frío ES el remate**. Si se porta el molde y las dos cartas
comparten temperatura, el chiste se cae aunque el texto sea el mismo.

**Composición.** 9:16. Texto arriba, sujeto abajo. En la carta B el objeto que remata el chiste (el libro)
queda justo debajo del bloque de texto, en el centro óptico — se lee el rótulo y el ojo cae encima del
gag sin buscarlo.

**Ritmo.** 6,600 s. Dos tiempos, 58/42, un solo corte en 3,800 s. Nada más.

**Motion.** Texto ancla (cero animación) + plano vivo con motor interno + **plano congelado como
puntuación**. Cero easing en todo el video.

**Textura.** Carta A: ruido de ISO alto de sensor de teléfono, luz RGB reventada sobre superficies
blancas. Carta B: grano y compresión de foto de archivo reescalada. **Las dos texturas son sucias, y esa
suciedad es parte del formato** — un plano limpio de stock en la carta A mata la credibilidad de "esto
pasó anoche en mi living".

**Se porta a:** `web-factory/docs/MOTION_PATTERN_BANK_2026.md` — entrada nueva **"remate congelado"**
(el segundo plano se detiene por completo para puntuar, en vez de animarse), como variante del patrón
"texto ancla" que ya está fichado en `2026-08-23-patrones-de-motion-deduplicados.md` (P1 y P5).
La receta de rótulo (caja al 84%, tercio superior, blanco + contorno, remate 1,5× el setup) va a la
skill `captions-overlay`.

---

## Las tres preguntas

**1 · ¿Qué frente nuestro toca?**
El motor de contenido de Onia en Instagram. No es teoría: **clinica klein entró por Instagram el
21-ago** — es el único registro real que tuvimos. Éste es el formato más barato del lote: 6,6 segundos,
dos imágenes, un corte, cero generación paga.

**2 · ¿Con qué herramienta NUESTRA se reproduce?**
`hyperframes` (con `hyperframes-core` para la composición y `captions-overlay` para los dos rótulos
quemados) para montar las dos cartas y el corte duro; `editor-videos` para el master 9:16 y el mezclado
de la cama musical; Postiz/n8n para publicar. **Costo: cero.** No toca Higgsfield ni ElevenLabs, así
que no requiere el permiso de gasto caso por caso.

**3 · ¿Qué falta para hacerlo hoy?**
- **El plano A propio.** No tenemos metraje de "sala llena de gente laburando de noche". Hay que
  grabarlo (30 s de teléfono alcanzan) o cambiar el motor interno por otro que sí tengamos.
- **El ángulo, que es lo delicado.** El motor del chiste es la **auto-burla sobre la propia
  competencia**. Apuntado a Onia rompería de frente la regla *"la venta nunca exhibe obra"*: un reel
  nuestro insinuando que no sabemos aterrizar lo que construimos espanta clientes. **Sólo es portable
  si el dolor es el DEL CLIENTE** ("yo no sé nada de sistemas" → y el remate es el negocio funcionando),
  nunca nuestra entrega.
- **La música.** No está en el video (0 palabras, y la pista no se identifica). Hay que elegir una de
  la biblioteca de Instagram — y ojo, la carta B congelada sin música es un cuadro muerto de 2,8 s.

---

## Lo que NO se puede afirmar

- **Qué herramienta corre en los monitores de la carta A.** Hay un terminal con bloques rojo/verde y
  algo que parece un mapa. A 720 px de ancho no se lee una línea. Que sea Claude Code lo dice el
  *rótulo*, no la pantalla.
- **La familia tipográfica.** No se dice en ningún lado. Describo su forma; no le pongo nombre.
- **La canción.** 0 palabras transcritas y ninguna mención en pantalla ni en el caption.
- **Los hex son aproximados.** Salen de fotogramas JPEG de un H.264 con luz RGB volcada. Sirven como
  dirección de paleta, no como valores de marca.
- **El origen del meme del piloto.** Es una imagen de archivo que circula desde hace años; el autor no
  la acredita y yo no la puedo atribuir.
- **Métricas de rendimiento.** No hay likes, vistas ni guardados en lo que me pasaron. Que el formato
  sea barato y limpio no prueba que funcione.
- **Quién publicó esto.** El handle del autor no está en los archivos del lote.


---

## Que cambio respecto de la primera version

El audio NO cambió nada del análisis: 0 palabras confirmado — pero corrijo el matiz, no es silencio (6,619 s continuos, mean −16,5 dB, pico 0,0 dB): es cama musical fuerte, no voz. Lo que sí quedó dado vuelta es la cifra que me dieron por medida: re-corrí `ffmpeg select=gt(scene,X)` sobre el mismo mp4 y hay UN corte, en pts_time 3,800 s exactos, score 0,485, idéntico a los tres umbrales (0,3 / 0,15 / 0,08). El "cero cortes" heredado es falso — la ficha vieja tenía razón con su "~3,7 s". De la ficha vieja sí quedan corregidas otras dos: la duración de VIDEO es 6,600 s (198 fotogramas @30 fps; 6,731 s es la pista de audio), y el push-in "~3% en ~2 s" no existe — la banda de techo da PSNR 31,8 dB entre f2 y f110, cámara clavada.


---

> **Nota de medicion (carril, 2026-08-23).** El corte de los 3,800 s **existe**: lo confirmo un
> re-conteo con `ffmpeg -hide_banner ... select=gt(scene,X),showinfo` en los tres umbrales. La cifra
> “cero cortes” que se le paso a esta ficha como “ya medida” era falsa por metodo: se habia corrido
> con `-v error`, que silencia la salida de `showinfo`. Esta ficha re-midio en vez de aceptarla, y
> por eso la correccion quedo del lado correcto.
