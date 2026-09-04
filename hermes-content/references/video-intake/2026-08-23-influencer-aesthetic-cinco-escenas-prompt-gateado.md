# Influencer Aesthetic — 5 escenas de foto de celular, con el prompt gateado

- **Fuente:** https://www.instagram.com/p/DcJbUL6CCp3/
- **Tipo:** MIXTO (IA de contenido + MARKETING de forma)
- **Veredicto:** SIRVE YA
- **Cobertura:** 6 de 6 láminas leídas con visión propia (s01–s06, todas `.jpg`) + caption íntegro. Carrusel estático: **sin video, sin audio, sin voz**. Texto en pantalla sólo en s01 y s06.

## Qué muestra, textual

**Caption, verbatim:**

> Influencer Aesthetic 🔥🔥
> Comment "8" and I'll send the prompts to you 👇🚀
>
> #ai #aigenerated #model #aiartist #aiugc

**Texto en pantalla, verbatim:**

- **s01:** `INFLUENCER` / `AESTHETIC` / `prompt steal`
- **s02, s03, s04, s05:** sin texto. Ni una palabra.
- **s06:** `Want the prompts?` (arriba a la izquierda) · `COMMENT "8" AND` / `I'LL SEND THEM OVER` (centro-bajo)

**Las 6 láminas, descritas:**

| # | Escena | Sujeto y props |
|---|---|---|
| s01 | Tumbona en acantilado mediterráneo, mediodía | Mujer leyendo *My Brilliant Friend* de Elena Ferrante, bikini negro a lunares, gafas carey, pelo mojado, casitas blancas y mar al fondo |
| s02 | Espejo de baño de casa | Mujer sin maquillaje, pijama de rayas terracota, celular tapando medio rostro, taza de cerámica en la mano, carpintería verde petróleo, apliques de bronce |
| s03 | Sala de cine vacía | Mujer sentada sobre el respaldo de una butaca, cárdigan negro, falda gris tableada, botas altas, caja de pochoclo; pantalla encendida como única fuente de luz |
| s04 | Tienda de barrio de noche | Mujer de trenzas riendo, bomber negro, cárdigan verde limón neón, bolso rosa, botella de Fanta; cartel `OPEN 24 HRS` en neón, heladeras y snacks |
| s05 | Terraza de azotea, hora dorada | Mujer con top blanco de morley, pantalón gris, aros dorados, vaso en la mano; sombrilla verde, aires acondicionados y antenas al fondo |
| s06 | Cancha de básquet en azotea | Mujer con buzo frambuesa, gafas deportivas, pie sobre una pelota; rascacielos densos detrás — lee como Hong Kong |

## Cómo está hecho — la reconstrucción

**Primero, lo que NO es.** El post no muestra ni una técnica: no hay prompt en pantalla, no hay nombre de modelo, no hay panel de ninguna herramienta. **El prompt está gateado** detrás de "comentá 8". Todo lo que sigue es **RECONSTRUIDO**, no recuperado.

**El mecanismo real, leído de las imágenes:** las cinco fotos comparten una sola decisión — **se piden los defectos de una cámara de celular, no la belleza**. Es exactamente la anatomía de 11 bloques que ya tenemos escrita en [`2026-08-15-realismo-de-celular-prompts-soul.md`](2026-08-15-realismo-de-celular-prompts-soul.md), aplicada:

- **Bloque 7 (la luz como defecto):** altas luces quemadas en s01 y s05, sol duro cenital con sombras marcadas.
- **Bloque 8 (firma óptica del celular):** encuadres levemente torcidos, desenfoque de movimiento en el pelo, gran angular corto.
- **Anti-retoque:** acné visible en s02 y s05, pecas, brillo de sudor, pelo mojado. Nadie corrigió la piel.
- **Oclusión parcial del rostro en 2 de 5:** el libro abierto (s01), el celular (s02) — menos superficie donde el modelo puede fallar.
- **Fondo cargado a propósito:** pasta de dientes y cepillos, bicicletas y bolsas de Doritos, aires acondicionados. Ninguna lámina está limpia.

**Lo que este autor NO resolvió, y nosotros sí necesitamos:** las cinco láminas son **cinco mujeres distintas**. No hay consistencia de cara porque el formato no la pide — es un muestrario de estéticas, no un personaje. Para Lucía el problema es más difícil: la misma cara en las cinco escenas, y eso exige Soul + anclas de identidad ([`2026-08-15-bloquear-identidad-avatar-anclas.md`](2026-08-15-bloquear-identidad-avatar-anclas.md)).

**El valor real de este post, entonces, no es la gramática — ya la teníamos gratis de `@imjay_ai`. Es el VOCABULARIO: cinco arquetipos de escena concretos** que instanciar en esos 11 bloques. Eso es lo que nos faltaba.

**El molde de marketing (la otra mitad):**

1. Lámina 1 — título que promete valor y usa la palabra **"steal"**: permiso explícito para tomarlo.
2. Láminas 2–5 — **mudas**. Puro material, cero explicación. El que llega hasta acá ya está convencido.
3. Lámina 6 — el pedido, con la fricción mínima posible: **un solo dígito**, `"8"`.
4. Caption repite el CTA + hashtags de alcance.

Bookend de texto, silencio en el medio. El cebo de comentario ya lo teníamos catalogado como táctica estándar en [`2026-08-11-roundup-herramientas-diseno-cebo-comentario.md`](2026-08-11-roundup-herramientas-diseno-cebo-comentario.md); la diferencia es que **ahora el circuito comentario→DM está VIVO en producción** (probado el 18-ago), así que dejó de ser algo para "evaluar" y pasó a ser algo para usar.

## El estilo, como conocimiento portable

**Tipografía — dos familias en tensión deliberada.** (1) Grotesca pesada condensada, todo mayúsculas, *tracking* muy apretado e interlineado casi nulo (las líneas se tocan) — tipo Anton / Helvetica Inserat; **la fuente no se dice**. (2) Serif de alto contraste en itálica (didone-ish), chica, para la línea secundaria. **El contraste ES el sistema:** capitales brutales contra una itálica delgada. En s01 las dos líneas están **ópticamente justificadas al mismo ancho** — `AESTHETIC` se escala más grande y más ancho que `INFLUENCER` para que ambos bloques lleguen borde a borde. **Cero contorno, cero sombra, cero caja o velo detrás del texto**: se apoya en elegir una zona de la foto con contraste suficiente.

**Paleta.** No hay paleta unificada del carrusel — cada lámina trae la suya. Lo unificado es **la luz** (natural, saturada, algo quemada) y la firma de celular. Hex **aproximados, leídos por mí de las imágenes** (el autor no declara ninguno):

| Lámina | Colores |
|---|---|
| s01 | piedra ocre `#C9A87C` · mar `#2E6E8E` · cojín marino `#2B3557` |
| s02 | verde petróleo `#1E3D3A` · terracota `#B4552F` · mármol `#E8DCC8` · bronce `#B8894A` |
| s03 | terciopelo borgoña `#6E1F2B` · negro sala `#0D0D14` · pantalla `#AEBECC` · latón `#C9922E` |
| s04 | magenta neón `#F0159B` · verde limón `#D8F02A` · rosa `#F0349B` · naranja `#F58220` · asfalto `#3A3A3E` |
| s05 | cielo `#7FB6D9` · sombrilla `#1D5E3C` · top `#F2EDE6` · piedra `#C9BBA8` |
| s06 | terracota `#C4562F` · azul `#1E5FBF` · amarillo `#F2C21E` · frambuesa `#A83A55` |

En el **texto** sí hay decisión de color: `INFLUENCER` blanco `#FFFFFF`; `AESTHETIC` con **degradado horizontal rojo→naranja** aprox `#F5231E` → `#FF7A2E`; y en el CTA, **un solo glifo acentuado** — el `8` en verde aprox `#1B8A3A` dentro de texto blanco. Esa micro-acentuación de un carácter es lo más barato y más copiable de todo el post.

**Composición.** Vertical 4:5. Un sujeto, siempre desplazado a la derecha, nunca simétrico. Mucho aire arriba o mucho piso abajo; props y pies cortan el borde inferior. Desorden de fondo **dejado a propósito**.

**Ritmo.** No hay cortes: el ritmo es el orden. Gancho con texto → 4 láminas mudas → CTA con texto.

**Motion.** **No hay.** Son JPGs; nada entra, nada anima, no hay curva. El único movimiento es el swipe, y el autor **no lo aprovecha**: no hay continuidad de encuadre ni *carrier element* entre láminas. Ahí tenemos ventaja si lo hacemos nosotros.

**Textura.** Sin grano ni overlay agregado. La textura es el defecto de captura: quemados, sol duro, piel real sin retocar, desenfoque de movimiento. Anti-retoque militante.

**Se porta a:** este mismo archivo (que **es** el banco de las 5 escenas) + una fila nueva **R14** en [`BANCO_DE_REPLICABLES.md`](BANCO_DE_REPLICABLES.md), Nivel 2 (🟡 crédito de imagen, requiere OK). El tratamiento tipográfico de lámina social **no tiene banco propio hoy** — el más cercano, `web-factory/docs/MOTION_PATTERN_BANK_2026.md`, es de motion web. Ese hueco queda anotado.

## Las tres preguntas

1. **Frente:** INFLUENCERS IA (el brief de imagen de Lucía) para el banco de escenas y el tratamiento de lámina. MARKETING / redes para el molde de carrusel con cebo de comentario.
2. **Herramienta nuestra:** catálogo Higgsfield (`models_explore`, presets, Marketing Studio) para generar; la anatomía de 11 bloques de [`2026-08-15-realismo-de-celular-prompts-soul.md`](2026-08-15-realismo-de-celular-prompts-soul.md) para escribir; el circuito comentario→DM **ya vivo en producción** (18-ago, sin ManyChat) para el molde; Soul + anclas de identidad para sostener la cara de Lucía.
3. **Qué falta:** (a) los prompts están gateados — hay que **reconstruirlos**, no pedirlos; (b) generar imágenes es **gasto pago**: permiso explícito de Sergio, escena por escena, con costo estimado; (c) una decisión suya: ¿las 5 escenas son de Lucía (exige consistencia de cara, trabajo que el original nunca hizo) o son 5 personajes distintos como acá?

## Lo que NO se puede afirmar

- **Qué modelo o herramienta se usó: no se dice.** Ni en pantalla, ni en el caption. Los hashtags (`#ai #aigenerated #aiugc`) sólo confirman que el autor las declara como generadas.
- **Que las imágenes sean 100 % generadas: no lo verifiqué.** El autor lo afirma vía hashtags; yo no tengo prueba propia. Algunas podrían ser fotos reales usadas como cebo.
- **El prompt literal: no está.** Todo lo que digo sobre cómo se construyó es **reconstrucción** desde lo que veo, apoyada en una anatomía que ya teníamos de otra fuente.
- **Cuántas generaciones costó cada imagen: no se dice.**
- **Las fuentes tipográficas exactas: no se dicen.** Describo la clase (grotesca condensada pesada / serif de alto contraste en itálica), no la familia.
- **Los hex son míos, aproximados de mirar las imágenes.** El autor no publica ninguna paleta.
- **Cuántos comentarios generó el cebo: no se dice.** No hay ninguna métrica en el post.
- **Si el autor efectivamente manda los prompts al comentar: no lo probamos y no lo vamos a probar.**
