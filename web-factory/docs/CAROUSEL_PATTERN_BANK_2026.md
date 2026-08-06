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
