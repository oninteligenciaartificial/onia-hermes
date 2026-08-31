# paletas-lujo — cinco paletas de lujo, con rol y contraste medido

**Fuente:** [reel](https://www.instagram.com/p/DbvmsWlDKo6/) · ficha `cinco-paletas-de-lujo-hex-recuperados`.

**Los hex son RECUPERADOS**, no reconstruidos: están escritos en pantalla en el propio
video. Copiados literales, sin muestrear ni adivinar. Lo único que NO es recuperado son
tres superficies derivadas (Gold & Slate, Terracotta, Earth), y están marcadas como tales
acá abajo y en el CSS: son mezclas `color-mix()` de dos recuperados de la misma paleta, no
colores nuevos traídos de afuera.

Los tokens viven en [`tokens.css`](tokens.css). Se usan agregando la clase de la paleta al
contenedor y pintando con `var(--bg)`, `var(--accent)`, etc. — nunca con el hex suelto.
Para verlas: abrir [`index.html`](index.html).

---

## Por qué cada color lleva un ROL

Una lista de cuatro hex no es una paleta usable: es una lista de cuatro hex. El que la
recibe tiene que adivinar cuál es el fondo y cuál el acento, y adivina mal — típicamente
usando el saturado como fondo, que es exactamente lo que arruina estas cinco. Por eso cada
color se declara como `--bg`, `--surface`, `--ink`, `--accent` o `--on-accent`, siguiendo la
convención de tokens que ya usa `web-factory/apps/site/src/app/onia-center/styles/tokens.css`.

## Cómo se midió el contraste

Fórmula de luminancia relativa de WCAG 2.x, calculada — no estimada a ojo. Es la misma que
ya está implementada en `web-factory/packages/tokens/src/index.ts` (`contrastRatio`), así
que los números de acá son consistentes con los que el generador de webs de cliente usa
para decidir el color de texto legible. El script de cálculo se autoverifica contra tres
anclas conocidas (negro/blanco = 21:1, mismo color = 1:1, `#767676` sobre blanco = 4,54:1).

Umbrales: **AA** = mayor o igual a 4,5:1 (texto normal) · **AA-large** = mayor o igual a
3:1 (24 px o más, o 18,66 px bold) · **FALLA** = por debajo de 3:1.

---

## Resultado del chequeo — lo que NO pasa

Ninguna de las cinco paletas es segura de punta a punta. Estas son las combinaciones que
hay que evitar, por paleta:

| Paleta | Combinación | Ratio | Veredicto |
|---|---|---|---|
| Racing | acento `#DD0200` sobre fondo `#1A0706` | 3,79:1 | **AA-large solo** — no como texto de cuerpo |
| Racing | acento `#DD0200` sobre superficie `#55100D` | 2,78:1 | **FALLA** — nunca el rojo sobre el borgoña |
| Racing | superficie `#55100D` vs fondo `#1A0706` | 1,36:1 | no se despega: exige hairline |
| Gold & Slate | oro `#F4B044` vs naranja `#E0680E` | 1,81:1 | **FALLA** — nunca uno sobre el otro |
| Gold & Slate | naranja `#E0680E` sobre fondo | 4,61:1 | AA, pero al filo |
| Gold & Slate | blanco sobre el naranja `#E0680E` | 3,41:1 | **FALLA** — el texto encima va Dark Blue, no blanco |
| Gold & Slate | blanco sobre el oro `#F4B044` | 1,89:1 | **FALLA** — encima del oro va oscuro |
| Rosewood | acento `#7D4047` sobre texto `#2E2E2E` | 1,74:1 | **FALLA** (combinación absurda, anotada por completitud) |
| Terracotta | clay `#B5543A` sobre fondo `#F0E6D8` | 3,96:1 | **AA-large solo** — no como texto |
| Terracotta | olive `#6F7F5F` sobre fondo `#F0E6D8` | 3,49:1 | **AA-large solo** — no como texto |
| Terracotta | clay vs olive | 1,14:1 | **FALLA** — los dos acentos son gemelos en luminancia |
| Terracotta | cualquier acento sobre `--ink` `#5A2E25` | 2,32 / 2,63:1 | **FALLA** |
| Terracotta | blanco sobre olive `#6F7F5F` | 4,31:1 | **FALLA** — encima del olivo va negro (4,88:1) |
| Earth | acento `#8D321F` sobre beige `#C29B72` | 3,15:1 | **AA-large solo** |
| Earth | acento `#8D321F` sobre superficie derivada | 2,86:1 | **FALLA** |
| Earth | acento `#8D321F` sobre charcoal `#2B2D31` | 1,71:1 | **FALLA** — por eso el mapeo oscuro está descartado |
| Earth | olive `#3A4027` sobre beige | 4,23:1 | **AA-large solo** — es `--ink-2`, no texto de cuerpo |
| Earth | los tres oscuros entre sí | 1,28 a 1,71:1 | **FALLA** — indistinguibles |

**Traducción corta:** en **cuatro de las cinco** paletas el color saturado NO se puede usar
como texto. Solo en **Rosewood** el acento pasa AA como texto (6,63:1 sobre el fondo,
5,37:1 sobre la superficie). En las otras cuatro el acento es relleno, borde o gráfico — y
si lleva texto encima, el texto va con el `--on-accent` que ya está calculado en el CSS.

### Lo que sí pasa

| Paleta | Texto sobre fondo | Ratio |
|---|---|---|
| Racing | `#D9D9D9` sobre `#1A0706` | 13,81:1 |
| Rosewood | `#2E2E2E` sobre `#F1ECE6` | 11,56:1 |
| Terracotta | `#5A2E25` sobre `#F0E6D8` | 9,19:1 |
| Gold & Slate | `#88A5B7` sobre `#112532` | 6,08:1 |
| Earth | `#2B2D31` sobre `#C29B72` | 5,40:1 |

Las cinco resuelven el texto principal. El problema de las cinco es el acento, no el texto.

---

## Contra la regla que el corpus ya había deducido

La síntesis del lote del 23-ago
([`2026-08-23-sintesis-lote-18.md`](../../video-intake/2026-08-23-sintesis-lote-18.md),
punto 6, ocho fichas coincidiendo) dice:

> **Un solo acento saturado, y siempre sobre el sujeto o el producto — nunca sobre la interfaz.**

Contrastadas una por una:

| Paleta | Un solo acento saturado | Lectura |
|---|---|---|
| Racing | **Sí** | Rojo único sobre tres neutros oscuros. Cumple de manual. |
| Rosewood | **Sí** | Rosewood único sobre crema/greige/carbón. Cumple. |
| Earth | **Sí** | Terracotta único; beige y olivo son tierras desaturadas. Cumple. |
| Gold & Slate | **No — dos** | Oro *y* naranja quemado, los dos saturados. **Excepción.** |
| Terracotta | **No — dos** | Clay *y* olivo, ambos declarados "accent" en la fuente. **Excepción.** |

Tres de cinco cumplen. Las dos que no son la parte interesante, y fallan por el mismo
mecanismo — pero solo una se salva:

- **Gold & Slate funciona igual**, y explica por qué la regla es sobre *saturación*, no
  sobre cantidad de colores: el oro y el naranja están a 1,81:1 entre sí, o sea son **el
  mismo valor con distinto tono**. No compiten por jerarquía porque el ojo los lee como un
  solo escalón de brillo. Es un acento con dos temperaturas, no dos acentos. La regla
  sobrevive: sigue habiendo un único nivel de atención.
- **Terracotta es la que sí rompe.** Clay y olivo están a 1,14:1 — todavía más pegados — y
  encima **ninguno de los dos pasa AA sobre el fondo**. Ahí no hay un acento con dos
  temperaturas: hay dos colores que quieren ser el punto focal, ninguno gana, y el ojo no
  encuentra dónde mirar. Es la paleta que más cara de lujo tiene en un swatch y la que peor
  se comporta en una interfaz.

**Lo que la medición le agrega a la regla del corpus.** La regla decía *cuántos* acentos.
Los números dicen *dónde puede vivir* ese acento: en cuatro de las cinco paletas el
saturado no llega a 4,5:1 contra ninguna superficie, así que **no puede ser texto de
interfaz aunque quisiéramos**. Eso no contradice el punto 6 — lo refuerza desde otro lado:
el corpus dedujo por observación que el acento va "sobre el sujeto o el producto"; el
contraste explica *por qué* esas paletas se ven bien en foto de producto y se rompen en una
UI. Sobre una foto el acento no tiene que ser legible. En una interfaz, sí.

---

## Paso 5 — cuál sirve para Onia

**Ninguna reemplaza la marca de Onia, y no es una decisión de gusto: es que ninguna es
verde.** La marca es `oklch(0.42 0.13 169)` (`--primary` en
`web-factory/apps/site/src/app/globals.css`), un esmeralda; el mismo verde manda en el
panel de Onia Center como `--accent`. Las cinco paletas son rojo, oro, rosewood, terracota
y tierra. Adoptar cualquiera como paleta propia sería un cambio de marca disfrazado de
mejora de diseño, y la marca no se cambia desde una ficha de video.

**Sirven para webs DE CLIENTE.** Ahí el color lo pone la marca del cliente, no la nuestra, y
`web-factory/packages/tokens` ya está construido exactamente para eso: recibe
`colores.primary / secondary / accent / bg / fg` por cliente y emite los tokens. Estas cinco
son cinco entradas listas para ese generador, con el contraste ya verificado — que es
precisamente el bug que ese archivo documenta (fichas de cliente con títulos a 1,05:1, texto
invisible en un sitio publicado).

Recomendación, por orden de utilidad real:

1. **Rosewood — la que hay que usar primero.** Es la única de las cinco cuyo acento pasa AA
   como texto sobre las dos superficies. Un solo acento saturado, cumple la regla del
   corpus, y no exige que el diseñador se acuerde de ninguna excepción. Encaja en clínica
   dental, estética, joyería, boutique.
2. **Racing — segunda, con una condición.** Cumple la regla, el texto sobra de contraste, y
   el rojo tiene fuerza. La condición es el hairline: sin `--line`, la superficie y el fondo
   son el mismo color. Automotriz, gimnasio, importadora.
3. **Gold & Slate — sirve, con el `--on-accent` respetado.** El texto encima del oro y del
   naranja va oscuro, nunca blanco. Rubro financiero, importadora, servicios premium.
4. **Earth — solo si el diseño es tipográfico.** El acento no llega a texto contra nada y
   los tres oscuros son indistinguibles. Funciona si el color es fondo y el peso lo lleva la
   tipografía. Ganadero, agro, gastronomía.
5. **Terracotta — no usarla tal cual.** Dos acentos gemelos y ninguno pasa AA. Es una
   trampa: se ve bien en el swatch y se cae en la pantalla. Si un cliente la pide, hay que
   oscurecer el clay hasta pasar 4,5:1 — y eso ya sería un color reconstruido, no el
   recuperado.

**Para Onia mismo: cero de las cinco.** El único uso interno defendible sería como paleta de
una pieza de contenido puntual (una foto, un carrusel) donde el verde de marca no participa
— y ni siquiera ahí hace falta, porque la regla del corpus que ya seguimos es que el verde
de marca viva solo en la marca.
