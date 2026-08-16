# Entrega a la sesión Higgsfield / Lucía — todo lo que dejaron los reels

Reparto del carril de análisis. Acá está **solo lo de generación de video**, sacado de ~50
reels analizados el 9, 11 y 12 de agosto. Cada punto dice si está **verificado** contra la
cuenta o si es **afirmación de un video sin comprobar**.

---

## 1. Los datos duros de la cuenta (verificados 2026-08-12, consulta gratis)

```
plan:     ultra
créditos: 2.862,68
modelos:  seedance_2_0 · seedance_2_0_mini   ← "Seedance 2.5" NO existe en la cuenta
tope:     4 a 15 s por toma                  ← NO 30 s
unlim:    available = false                  ← la "ventana de 33 días" NO aplica
```

`seedance_2_0` acepta estos roles de media, que es lo que habilita todo lo de abajo:

```
start_image · end_image · image_references · video_references · audio_references
```

Tags del modelo: `reference · identity · consistent · product · multi-sku · e-commerce`.
Resolución hasta `4k` con `mode: std`; `mode: fast` es más barato y llega a 720p.

**Tres videos distintos dijeron "Seedance 2.5" y "33 días ilimitado".** Los tres se equivocan
para nuestra cuenta. Tercera fuente repitiendo lo mismo no lo vuelve cierto.

## 2. La receta de 3 insumos — el hallazgo principal

De un spec ad de Puma (Mindshft.ai). Rotula sus insumos en los primeros 3 segundos:

```
Avatar IA          -> rostro (imagen fija)
Paisaje IA         -> el lugar (imagen fija)
accesorios + Ropa  -> producto (imagen fija)
```

**Confirma lo que ya teníamos** (Soul para la cara, Reference Elements para objeto/prenda) y
**agrega la pata que faltaba: el escenario como imagen fija.** Hoy describimos el lugar en el
prompt; fijarlo con una imagen es lo que evita que cambie entre planos.

Receta completa, con nuestros assets: `../../docs/HIGGSFIELD_AD_SPEC_RECETA_20260812.md`.

## 3. El guion por escenas con timestamps

La estructura que hace que la continuidad esté **escrita en el prompt** en vez de arreglada
después. De un anuncio real generado **desde una sola foto**:

```
Scene N — <nombre> (Xs–Ys)
<encuadre y ángulo> · <comportamiento de cámara> · <qué queda en foco y qué sale de foco> · <luz>
```

Ejemplo verbatim del original: `Scene 2 — Omega Watch (3.0s–5.5s)` · *"primer plano extremo
desde ángulo superior derecho mientras el conductor ajusta el volante, revelando el reloj.
Movimiento natural de cámara en mano con foco fijo en la esfera mientras el volante sale
suavemente de foco."*

**Los tres campos que nos faltaban** salen de acá: `lock_vestuario`, `raccord_luz`, `timestamps`.

**Consecuencia de presupuesto:** con tope de 15 s por toma, **un comercial de 20 s son 2-3
generaciones, no una.** Cada escena es una generación corta y se unen después.

## 4. Video2Video ya existe hoy — no espera a ningún modelo nuevo

`seedance_2_0` acepta `video_references`. Un reel en español lo muestra aplicado a un videoclip:

1. generar la imagen del escenario en Higgsfield (usa un preset que nombra: **`Show Cinema`**)
2. subir el video grabado **con el celular**
3. los dos + la canción al modelo → videoclip

**Por qué importa comercialmente:** cambia el pitch de *"te genero un comercial de la nada"* —
que cuesta creer — a *"grabalo con tu celular como puedas, yo lo convierto"*. Para un comercio
que no tiene set ni modelo, eso es la diferencia entre entender y no entender la oferta.

`Show Cinema` **está sin verificar**: se comprueba gratis con `presets_show`.

## 5. La voz de Lucía — resuelto, ya no hay ambigüedad

```
voice_id:   8de5db95-e898-46a6-bb68-26d02f311686
voice_type: element          ← se pasa el PAR (id, type), no solo el id
name:       Lucia-voz
```

El otro ID que circula (`86V9x9hr…`) es de **ElevenLabs**, otro servicio. No compiten: Higgsfield
usa el `element`, ElevenLabs usa el suyo. El `voice not found` que quedó registrado venía del
**ID truncado en los docs**, no de dos voces en conflicto.

## 6. Costos — lo único que falta medir

| Cosa | Costo |
|---|---|
| imagen `soul_2` 2k | **0,12 cr** — gasto trivial, los 3 insumos salen por ~0,36 cr |
| narración de un reel (ElevenLabs) | ~2,4 cr |
| **video `seedance_2_0`** | **SIN MEDIR** |

Procedimiento para medirlo, cuando Sergio dé el OK (es la única parte que gasta):
`balance` → **una toma de 4 s en `seedance_2_0_mini`, `mode: fast`, 480p** → `balance`.
La diferencia es el piso. Sin ese número no se presupuesta ninguna pieza generativa.

## 7. Formatos generativos, con su anatomía

Tres formatos que el corpus dejó documentados, con duración y estructura:

- **AD SPEC (21 s)** — insumos rotulados 3 s + comercial + marco de autoría en pantalla
  (`AD SPEC · Nº 04 · DIRECTOR: <nombre> · fecha`). Ese marco es lo que lo hace leer como pieza
  de dirección y no como demo de herramienta.
- **Pantalla partida resultado/prompt (28 s)** — arriba el video generado, abajo el prompt
  scrolleando. Es contenido en sí mismo: muestra autoridad sin revelar nada crítico.
- **Dos que caminan (45 s)** — dos personas caminando y hablando en formato selfie, explicando
  un método. Ojo: con Soul, **una sola cara en cuadro** por generación.

## 8. Lo que NO hay que adoptar (analizado y descartado)

| Qué | Por qué |
|---|---|
| **PrimeBoard** | su función "nueva" es farmear cuentas conectando un Android. Viola ToS de Meta y TikTok, y con el token de IG ya bloqueado es el riesgo que menos conviene |
| **Prompt JSON de ChatGPT para avatares** | el tutorial nunca dice con qué generador produce la imagen final — esconde el motor, que es donde se decide el realismo y se gasta la plata |
| Copiar el contenido del spec ad | Puma es de ellos. Se roba el esqueleto por escenas, nunca el auto ni la marca |
| La música y el audio de cualquier referencia | son de ellos |

## 9. El límite duro que no se puede cruzar

Del mejor molde de UGC del corpus (una pastelera contando que puso un chatbot): **un testimonio
en primera persona no se puede fingir.**

Lucía es una influencer IA **declarada**. Que "cuente" que tiene una pastelería y le salvó la
temporada es fabricar un cliente que no existe, y choca con la regla de cero testimonios
inventados.

Las dos variantes legítimas:
- **(a)** un cliente real que quiera contarlo, con su voz
- **(b)** escenificación **rotulada en pantalla** ("así se vería tu día con el bot")

Se copia la estructura y el registro coloquial. Nunca la biografía.

## 10. Anclas de identidad — cómo evitar que la cara cambie entre fotos (2026-08-15)

De un carrusel que gatea su guía pero **muestra el método en las láminas**
([ficha](2026-08-15-bloquear-identidad-avatar-anclas.md)). Diagnostica los tres síntomas
textuales: *"pieles plasticosas · posturas antinaturales · rostros que cambian de una foto a
otra"*. Y enseña tres cosas que no teníamos escritas:

- **El ancla no es una foto, son varios primeros planos de rasgos.** La secuencia que muestra es
  retrato base → boca y mentón → ojos. Detalles cerrados, no plano general.
- **Un rasgo distintivo constante es un ancla barata.** En sus 10 imágenes de ejemplo, en
  escenarios totalmente distintos, siempre están las mismas gafas amarillas. **Lucía no tiene
  hoy un rasgo así definido** — es una decisión que conviene tomar antes de producir en volumen.
- **La textura imperfecta es lo que mata el look plasticoso.** Sus anclas muestran acné y poros.
  La solución no es más calidad: es más imperfección. Puede explicar por qué la P6 de Lucía se
  rehízo *"porque se veía muy IA"*.

Todo esto es **imagen** (~0,12 cr c/u): se puede probar sin tocar el presupuesto de video.

## 11. Realismo de celular — la anatomía del prompt (2026-08-15)

Del mismo autor que el de anclas, y **este no gatea nada**: 20 láminas con los prompts completos
([ficha](2026-08-15-realismo-de-celular-prompts-soul.md)). Tesis: *"el error es pensar que
cuanto más cinematográfico, más real; las imágenes que más reales parecen son las fotos hechas
con el móvil, escena cotidiana e improvisada"*.

Once bloques en orden fijo. **Los tres que no teníamos:**

- **La luz descrita como DEFECTO** — *"strong highlights and washed-out tones"*.
- **La firma óptica del celular** — *"minor chromatic aberration at the image edges,
  characteristic of a modern smartphone camera with a slightly wide lens"*.
- **La paleta como lista de valores HEX explícitos** — 13 colores, no adjetivos.

Y un detalle de composición: **la oclusión parcial de la cara** (un vaso tapando la mitad
inferior) da menos superficie donde el modelo puede fallar y más sensación de instantánea.

Con el punto 10 queda el método completo: **anclas** (quién es) + **realismo de celular** (cómo
se ve). **Falta definir la paleta hex fija de Lucía** — hoy no existe, y es lo que le daría
coherencia a todo el feed.

## 12. El pipeline completo, confirmado por 4 fuentes independientes (2026-08-15)

Cuatro creadores distintos, el mismo día, describiendo el mismo orden
([ficha](2026-08-15-crear-influencer-ia-cuatro-fuentes.md)). Cuando cuatro fuentes coinciden en
el orden de los pasos, el orden **es** el método:

```
0. PERSONAJE   ← nicho y para qué existe, ANTES de cualquier imagen
1. IDENTIDAD   ← Soul + anclas por rasgos + rasgo distintivo constante   (punto 10)
2. REALISMO    ← defecto óptico de celular + paleta hex                  (punto 11)
3. ESCENARIOS  ← imágenes base del entorno, fijadas como referencia      (punto 2)
4. CARÁCTER    ← frase, expresión, tono y acento en el prompt de video
5. PIEZA       ← Seedance con las referencias
```

**El paso 0 no lo teníamos escrito.** Verbatim de uno de ellos: *"no empieces con imagen,
empezá con el personaje... una cara bonita no vende, un personaje sí"*. Lucía tiene
posicionamiento definido, así que estamos mejor que el promedio — pero conviene confirmar que
esté escrito como decisión y no asumido.

**El paso 4 es nuevo para nosotros.** Ellos meten *"la frase que querés que diga, la expresión,
el tono de voz, el acento"* en el mismo prompt de video. Nosotros separamos guion (texto) de voz
(ElevenLabs). Vale probar el enfoque junto.

**Y confirman lo que ya hacemos:** dos de los cuatro dicen *"usá Claude como tu director de arte
para que te genere los prompts"*. La dirección vive en el texto, no en la herramienta.

**A verificar:** `nano-banana` para las imágenes base (¿está en la cuenta, o usamos el pipeline
propio?). Las cifras que repiten —"50 referencias", "30 segundos"— ya están desmentidas para
nuestra cuenta: `seedance_2_0`, tope **15 s**.

---

## Lo primero que yo haría en esa sesión

**Medir el costo de una toma.** Todo lo demás está escrito y verificado; sin ese número, las
tres piezas generativas siguen sin poder presupuestarse, y con 2.862 créditos hay margen de
sobra para averiguarlo con una toma de 4 s.

Segundo: verificar `Show Cinema` en `presets_show` (gratis) y sumarlo a la receta como el paso
nombrado del escenario.
