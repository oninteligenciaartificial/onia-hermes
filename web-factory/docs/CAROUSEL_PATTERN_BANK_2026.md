# Carousel Pattern Bank 2026 — cómo se arma un carrusel que vende

> Research 2026-08-06 (Sergio: *"mira los mejores carruseles desde pinterest y adquiere el
> conocimiento en la web-factory, dividiéndolo en carruseles y ads ganadores"*).
> Este banco es de **carruseles orgánicos**; el de pauta vive en `ADS_PATTERN_BANK_2026.md`.
>
> Regla de la casa que no cambia: **cada carrusel sale con su link `?src=` propio.** Sin eso
> no existe para la atribución y no se mide.

---

## 1. Los seis números que mandan (fuentes al pie)

| Dato | Valor | Qué implica para nosotros |
|---|---|---|
| Peso de la slide 1 | **~80% del rendimiento total** | Si el hook falla, el resto no existe. La slide 1 se piensa primero y sola |
| Largo óptimo | **7-10 slides** | Nuestro default: **8**. El engagement cae después de la 3 y **repunta en la 8+** |
| Ratio | **4:5 (1080×1350)** orgánico · **1:1** si va a pauta | 4:5 ocupa más pantalla = más scroll-stop |
| Completion rate | **80% que llegan al final dispara distribución en Explore** | Por eso la slide 7 debe generar deuda de curiosidad, no cerrar |
| Reach vs imagen única | **1,9× reach · hasta 3× engagement/shares** | El carrusel es el formato orgánico más barato en alcance |
| Ventana de decisión | **1-2 segundos** | El hook se lee de un vistazo: <10 palabras, tipografía grande |

## 2. La estructura de 8 slides (nuestro molde)

| # | Slide | Qué hace | Regla dura |
|---|---|---|---|
| 1 | **Hook** | Nombra el DOLOR, no el producto | <10 palabras · alto contraste · sin logo grande |
| 2 | **El costo** | Cuánto duele en plata o tiempo | Un número concreto (o marcado como supuesto) |
| 3 | **Por qué pasa** | La causa, no la culpa | Nunca culpar al lector |
| 4-6 | **La resolución** | Cómo se ve resuelto — UNA idea por slide | Pantalla real o mockup por código, no stock |
| 7 | **La prueba / el giro** | Caso, dato o la objeción respondida | Acá se sostiene la curiosidad para el 80% |
| 8 | **CTA único** | Una sola acción | "Comentá X" o el link `?src=`. **Jamás dos CTAs** |

**Tres decisiones que separan el nuestro del genérico:**
- **La 2 va antes que la 4.** El costo antes que la solución — el lector tiene que sentir el
  problema antes de que le vendas.
- **Slide 7 no cierra: abre.** Es lo que empuja el completion rate arriba del 80%.
- **Continuidad visual entre slides** (un elemento que cruza el borde, una flecha que sigue):
  el ojo pide el swipe antes de que el cerebro decida.

## 3. Hooks que funcionan (con nuestra versión)

| Tipo de hook | Por qué funciona | Versión Onia |
|---|---|---|
| **Contrarian** | El más alto en engagement B2B | "El SIAT NO es tu problema" |
| **Error señalado** | El profesional quiere saber si lo comete | "3 cosas que hacés en tu clínica y te cuestan plata" |
| **Número específico** | La precisión da credibilidad | "Bs 560 al mes en horas de recepción" |
| **Pregunta con dolor propio** | Auto-selecciona a quien le duele | "¿Cuántos pacientes no volvieron este mes?" |
| **Antes/después** | Muestra transformación sin prometerla | "Tu agenda hoy → tu agenda en 2 semanas" |

Prohibido: hooks de urgencia falsa, "obligatorio por ley", promesas de resultado.

## 4. Sistema visual (lo que hace que se vea caro, no plantilla)

De las tendencias 2026 + nuestra identidad ya cerrada:

- **Tipografía = jerarquía, no decoración.** Archivo variable (nuestra `.display`). Precisión
  y calma; un solo tamaño dominante por slide.
- **Alto contraste + acento eléctrico.** Nuestro verde `#00D26A` sobre tinta `#12100E` ya es
  exactamente esa fórmula — no hace falta inventar paleta.
- **Textura y grano** para que no se sienta estéril: la imperfección leve da calidez.
- **Espacio en blanco generoso.** El carrusel apretado se lee como panfleto.
- **Coherencia entre slides:** misma retícula, misma posición del número de slide, mismo pie.

## 5. Producción — todo por código, costo cero

| Elemento | Cómo se hace |
|---|---|
| Slides con texto cinético | **HyperFrames** (`keyword`, `tag`, `lista`, `trazo`, `escena`) |
| Números y datos | Composiciones `stat` y `scoreboard` |
| Pantallas de producto | `browser` y `phone` (mockups por código, no capturas privadas) |
| Personas | Souls de **Lucía / Mara** únicamente. ⚠️ **Nunca el Soul de Sergio** ([[feedback-sergio-soul-no-usar]]) |
| Export | 1080×1350 (4:5) orgánico · 1080×1080 (1:1) para pauta |

## 6. Checklist antes de publicar

- [ ] Slide 1: ¿se entiende en 2 segundos sin leer la bajada?
- [ ] ¿Hay UN solo CTA, en la slide 8?
- [ ] ¿La slide 7 deja algo abierto?
- [ ] ¿Link `?src=nombre-pieza` armado y registrado?
- [ ] ¿Cero afirmaciones falsas (SIAT, resultados, testimonios)?
- [ ] ¿Aprobado por Sergio?

---

## 7. Anatomia de un carrusel ganador REAL (visto slide por slide)

> @nocodealex, 2026-08-04: **2.596 likes / 1.684 comentarios / 128 compartidos** en 2 dias.
> Ratio comentarios/likes = **65%**, absurdo para un post normal. Verificado abriendo el post
> y recorriendo las 7 slides una por una.

### Slide 1 — el hook (7 elementos, ninguno decorativo)

| Elemento | Que hace |
|---|---|
| Pildora naranja arriba-izq: `CLAUDE CODE SKILLS` | Categoria en 1 segundo, antes de leer el titulo |
| Handle arriba-der: `@nocodealex` | Cada slide es capturable con atribucion |
| Titular serif grande: **"Best Claude Code skills for _animation_"** | UNA palabra en cursiva naranja: la jerarquia la hace el color, no el tamano |
| Bajada: "5 free skills. Install in one command." | Promesa NUMERICA + friccion declarada (un comando) |
| Fila de 5 logos en tarjetas blancas | Prueba visual del contenido: "esto es lo que hay adentro" |
| Pildora `SWIPE →` abajo-izq | Pide explicitamente la accion que el algoritmo mide |
| **Puntos de progreso DENTRO de la imagen** | El lector ve cuantas slides son y se compromete |

### Slides 2-6 — la plantilla de valor (se repite identica)

- La pildora cambia a **contador**: `SKILL 01 / 05` → sabes donde estas y cuanto falta.
- Titulo serif del item + **subtitulo en monoespaciada con la ruta real** (`CloudAI-X/threejs-skills`):
  el entregable concreto, no una descripcion.
- **Captura de pantalla REAL** ocupando el centro (galeria densa y colorida). Prueba, no ilustracion.
- Beneficios en **2 columnas, viñetas naranjas con subrayado fino**. 5 bullets, ni uno mas.

### Slide 7 — el cierre (la parte que casi nadie copia bien)

- La pildora muta de contador a CTA: `GET THE SKILLS`.
- Titular con la misma formula: **"One comment, _all 5 installed._"** — enuncia el TRUEQUE.
- **Metafora de ticket/cupon**: una entrada troquelada donde el lado izquierdo lista lo que
  recibis y el lado derecho dice `COMMENT` + la palabra en naranja + un codigo de barras.
  **La palabra a comentar ES el codigo del cupon.** Es el mejor detalle del carrusel.
- Boton naranja grande: `Comment "DESIGN"`.
- Linea chica: *"Free. Save this so you can find it when you actually sit down to build."*
  → pide **guardar**, que es la otra senal fuerte del algoritmo ademas del comentario.
- La mascota 3D reaparece: cierra el arco visual que abrio la slide 1.
- **El CTA aparece 3 veces en la misma slide** (titular, ticket, boton). Uno solo se pierde.

### Sistema visual observado

Fondo crema con grano · serif display de alto contraste para titulares · acento naranja
unico · monoespaciada para lo tecnico · tarjetas blancas redondeadas para logos ·
ilustracion 3D con personalidad (mascota) · cero stock photos.

### Las 5 reglas que salen de esto

1. **La pildora superior cambia de rol** por seccion: categoria → contador → CTA. Es el
   sistema de navegacion mas barato que existe.
2. **Un acento de color, y solo uno.** Naranja ahi, verde `#00D26A` en lo nuestro.
3. **La prueba es una captura real**, nunca una ilustracion de la capacidad.
4. **El truque se enuncia** ("un comentario, los 5 instalados"). No "escribime" a secas.
5. **Pedir guardar ademas de comentar.** Son dos senales distintas y se piden juntas.

## 8. Lo que ensenan los dos reels del mismo lote

**@buildercult** (70 s, visto en 4 puntos del arco): talking-head UGC **enmarcado dentro de
una ventana de escritorio retro** (cielo Windows XP, ventana con botones de Mac, iconos de
carpeta e impresora), subtitulos quemados en fuente pixel. El arco: dashboard con **408,8M de
views** → grilla de creativos generados con IA → la landing del producto (app Sprout). O sea:
**resultado primero, metodo despues, producto al final.** El marco retro es el gancho visual
que hace que un screen-recording parezca contenido.

**@admanage.ai** (552 likes / 73 comentarios): titular en pantalla **"S-Tier Ads (BREAK the
meta algorithm)"**, split de Zuckerberg + el creador en PiP hablando al microfono, y abajo el
creativo real siendo analizado junto a un dashboard con **+147%** y "50+ orders to fulfill".
El comentario mas util del post: *"Static ads still crush it"*. **Es la tesis que mas nos
sirve: el ad ESTATICO sigue ganando, y eso es exactamente lo que producimos gratis por
codigo.** No hace falta video para pautar e-commerce.

---

**Fuentes** (consultadas 2026-08-06): [Instagram Carousel Best Practices
2026](https://www.adpicto.com/en/blog/instagram-carousel-best-practices-2026) · [Carousel
Algorithm 2026](https://www.trymypost.com/blog/instagram-carousel-algorithm-2026-guide) ·
[Best Carousel Hooks](https://www.imagine.art/blogs/best-carousel-hooks) · [LinkedIn Carousel
B2B](https://www.oktopost.com/blog/linkedin-carousel-pdf-best-practices/) · [Social Media
Design Trends 2026](https://versacreative.com/blog/top-social-media-design-trends-2026/) ·
[Graphic Design Trends 2026](https://www.designmonks.co/blog/2026-graphic-design-trends).

Relacionado: `ADS_PATTERN_BANK_2026.md` · `WEB_FACTORY_PATTERN_BANK_2026.md` ·
`MOTION_PATTERN_BANK_2026.md` · `TIPOGRAFIA_SISTEMA_20260727.md`.

---

# 9. Lo que aprendió el MOTOR (2026-08-17)

> Las secciones 1-8 son investigación de referencias. Esta es distinta: sale de **producir 7
> carruseles reales y programarlos**, y cada punto costó un error. Van acá porque el motor
> (`scripts/carousel_render.js`) es donde se aplican.

## 9.1 El énfasis: 5 mecanismos, y por qué manda el marcador

La sección 7 dice *"la jerarquía la hace el color, no el tamaño"* y durante meses eso se
tradujo en **cursiva serif** para la palabra clave. Sergio la descartó el 2026-08-17:
*"letras exclusivas no me gusta — buscá otra forma de resaltarlo pero que se vea mejor"*.

Se renderizó la MISMA pieza con cinco mecanismos y se eligió mirando, no discutiendo:

| `--emph` | Qué hace | Cuándo |
|---|---|---|
| **`marcador`** ✅ | bloque de acento detrás, texto en tinta | **default**. El único que aguanta una foto de fondo cargada |
| `subrayado` | línea gruesa de acento debajo | cuando la pieza ya tiene mucho color |
| `color` | la palabra en el acento | fondos planos. ⚠️ falla si el acento ya se usa en otro lado de la slide |
| `caja` | borde de acento alrededor | se lee como botón: **no usar cerca del CTA** |
| `serif` | cursiva serif — el viejo | retirado |

**Dos cosas que solo se ven renderizando, no leyendo el CSS:**

1. **En una slide de fondo acento, el marcador de acento es invisible.** Hay que invertirlo a
   tinta. Pasa en el rol `cta` del pack `typographic`, que tiene fondo verde.
2. **Sin `white-space:nowrap`, una frase resaltada de dos palabras se parte** y deja el
   artículo huérfano en su propio bloquecito. Pasó con `*a mano*`: quedó "a" al final de una
   línea y "mano" en la siguiente, cada uno con su recuadro.

## 9.2 El cierre necesita un OBJETO, no solo texto

La sección 7 lo tenía escrito —*"el CTA aparece 3 veces: titular, ticket, botón"*— y el motor
no lo cumplía: **4 de los 5 packs no dibujaban ningún botón ni ticket en el rol `cta`.** Solo
texto. Se descubrió auditando contra `impeccable`, no publicando.

Hoy `editorial-photo` y `typographic` tienen botón. Los otros tres **siguen sin él**.

## 9.3 De dónde sale la palabra del trueque

Del **cuerpo del último slide**, con el campo `comment_trigger` del brief como respaldo — en
ese orden y no al revés.

Parece contraintuitivo. Se midió: **6 de 9 briefs tenían el campo podrido** con las palabras
viejas (AUTO, COSTO, MITO, ESCALA, ORDEN, LIBRE) que se eliminaron al unificar el sistema en
dos. El cuerpo se reescribió en esa unificación; el campo no. Leer el campo primero habría
impreso un botón pidiendo una palabra que ya no existe — **peor que no tener botón**.

**Si el cuerpo no dice "Comentá X", no hay botón.** Es un cierre de guardado o de pregunta, y
está bien que lo sea: la regla de cadencia es máximo 1 de cada 4 piezas pidiendo algo.

## 9.4 El gate de copy

> **Si no nombra el dolor EXACTO del rubro —con la palabra que usa el dueño (fiado, silla
> vacía, contenedor, control anual)— y ese dolor no termina en plata, no sale.**

Aplicado a 9 piezas: **solo 3 pasaban.** Y al leerlas apareció algo que el gate no ve — el
titular del último slide pedía una cosa y el cuerpo otra (*"Pedí tu diagnóstico gratis"*
seguido de *"Guardalo"*).

Ninguna corrección inventa una cifra: le piden al lector que ponga **sus** números.
*"Multiplicá por tu ticket promedio"* en vez de *"perdés Bs 3.000 al mes"*.

## 9.5 Capacidades del motor que la sección 5 no tenía

| Qué | Cómo |
|---|---|
| **3 formatos** | `--format feed` (1080×1350, default) · `square` (1080×1080) · `story` (1080×1920) |
| **Zona segura de historia** | `story` **no es el feed más alto**: Instagram tapa ~300px arriba y ~380px abajo. El motor lo aplica solo |
| **Itemizado tipo recibo** | `lines: [{k,v}]` en un slide `cta` → guía punteada. **Cuando hay `lines[]` el ticket no se dibuja**: los dos juntos desbordan |
| **Acento por cuenta** | `--accent #RRGGBB` — una modelo no lleva el verde de la marca |
| **Énfasis** | `--emph` (§9.1) |

## 9.6 Dos trampas de render que no dan error

**Las fuentes caen a serif sin avisar.** `editorial-photo` declaraba `font-family:'Archivo'`
**sin cadena de respaldo**. Cuando la webfont no llegaba a tiempo, el navegador caía a su
default —que es serif— y **dos slides del mismo carrusel salían con fuentes distintas**.
Se arregló con cadenas completas y subiendo el presupuesto de render de 4s a 10s.

**Un elemento flex se encoge a cero en silencio.** El `.ticket` desaparecía del PNG sin ningún
error cuando la slide se llenaba. Se arregla con `flex-shrink:0`.

**La regla que sale de las dos:** el render **nunca falla ruidosamente**. Un PNG que se generó
no es un PNG correcto. Hay que mirarlo.

## 9.7 Publicación — la API de Postiz

```
base   https://postiz.onia.com.bo/api/public/v1     ← el /api NO es opcional
POST   /upload   multipart file=@slide.png          → {id, path}
POST   /posts    {type:"schedule", date:"…Z", posts:[{
                   integration:{id}, value:[{content, image:[{id,path}]}],
                   settings:{post_type:"post"}      ← si falta, 400
                 }]}
```

⚠️ **El frontend devuelve `200` con el HTML del login** para cualquier ruta `/public/v1/*` sin
el `/api`. Parece que funciona. Un `400` con JSON es la señal de que llegaste a la API real.

Y `201` no es verificación: hay que mirar la base (`state = QUEUE`, `releaseURL` nulo, y que la
cantidad de imágenes coincida con lo subido).

## 9.8 🔴 La plantilla de ejemplo contagia datos inventados

El 2026-08-17, dos días antes de que saliera la primera pieza, apareció esto en **3 briefs
reales**:

> *"El 40% de los leads no vuelve si no respondés en 5 min"*

**No tiene fuente en ningún lado del repo.** Se rastreó el origen: `briefs/_sample.json` y
`_sample_dark.json` —las plantillas de arranque— traían la cifra como texto de relleno
(*"perdés 4 de 10 leads"*, *"cada lead sin responder en 5 minutos se enfría"*). Cada brief
nuevo se armó copiando la plantilla, y la cifra viajó con él.

Tres piezas programadas la habrían publicado como dato verificado.

**Las dos reglas que salen:**

1. **La plantilla de ejemplo se escribe con el placeholder, no con un dato plausible.** Un
   número creíble en un `_sample` no se lee como relleno: se lee como investigación previa y
   nadie lo cuestiona.
2. **Antes de programar, grepear los briefs por cifras.** El gate de copy (§9.4) mira el
   dolor y la plata; **no mira si el número es real.** Son dos revisiones distintas.

La corrección no busca otra estadística: cambia el dato ajeno por **el número propio del
lector** — *"Mirá tu WhatsApp: ¿cuántos de anoche siguen sin respuesta?"*. Misma función,
cero riesgo.

## 9.9 Las palabras del caption se pudren aparte del cuerpo

Ya estaba escrito en §9.3 que el campo `comment_trigger` se pudre. Lo que faltaba: **el
caption también, y el caption ES lo que se publica.**

Medido sobre las 7 programadas: **5 pedían una palabra eliminada** (AUTO, COSTO, ESCALA,
ORDEN, LIBRE). Los cuerpos de los slides estaban al día; el caption no.

Y arreglarlos no es poner SISTEMA en los cinco: eso rompe la regla de cadencia. **El
informativo cierra pidiendo guardar y una pregunta barata; solo el de venta pide la palabra.**
Quedó 2 de 7 pidiendo palabra.

## 9.10 Qué sigue sin resolver

- **Los otros 3 packs sin botón de CTA** (`dark-product`, `dark-neon`, `bright-retail`).
- ~~El cierre que abre~~ → ✅ aplicado a las 6 con penúltima `point` (2026-08-17). La
  penúltima ya no resuelve del todo: deja una pregunta que el CTA recoge.
- ~~Pedir guardar además de comentar~~ → ✅ las 7 lo piden.
- **La slide 2 = el costo.** El molde de la §2 la pide con **un número concreto**. Nuestras
  slides 2 nombran el dolor pero le devuelven la cuenta al lector. Es honesto y es lo único
  que podemos hacer **hasta tener un cliente real cuyo número podamos citar** — que es el
  mismo bloqueo que el antes/después de web.
