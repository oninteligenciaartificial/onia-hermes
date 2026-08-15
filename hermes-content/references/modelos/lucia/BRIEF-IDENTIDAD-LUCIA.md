# Brief de identidad de Lucía — método de 6 pasos

> 2026-08-15. Complementa `LUCIA.md` (que manda sobre IDs y decisiones abiertas). Acá va lo
> que faltaba: el personaje escrito como decisión, el rasgo distintivo constante, la paleta
> hex fija y el prompt de realismo completo.
>
> Regla del método: **una cara bonita no vende, un personaje sí.** Todo lo de abajo es
> decisión, no descripción de lo que salió.

---

## PASO 0 — El personaje (esto va antes que cualquier píxel)

| | |
|---|---|
| **Quién es** | Lucía Antelo, 26, Santa Cruz de la Sierra. Trabaja con negocios chicos que están desbordados |
| **Para qué existe** | Vender la plataforma ONIA. Y ser la vitrina viva del producto de ticket alto *"te creamos tu influencer IA"* |
| **A quién le habla** | Al dueño de un negocio formal de 1 a 20 personas que ya factura y está ahogado en tareas. No a marketers, no a otros creadores de IA |
| **Qué defiende** | Que el desorden no es falta de esfuerzo. Que el dueño no tiene que ser el cuello de botella |
| **Contra qué está** | El humo de la IA. Las promesas de "automatizá todo". Los que venden herramientas sin decir qué cuesta |
| **Es IA y lo dice** | No se esconde. Es parte del gancho: *"hace un año yo no existía"* |

### Lo que Lucía NUNCA hace

- **No testimonia.** No cuenta que tiene una pastelería ni que un sistema le salvó la temporada.
  Es una influencer IA declarada; fingir cliente es fabricar. Escenificación sí, pero **rotulada**.
- **No promete resultados con números** que no salgan de un cliente real.
- **No habla de salud, dinero garantizado ni nada que necesite respaldo profesional.**
- **No usa el verde de ONIA** en sus piezas. Ese es el color de la marca, no el suyo.

---

## PASO 1 — Rasgo distintivo constante

**Hoy no existe.** Es el hueco más grande de su identidad visual: sin un ancla que se repita,
el feed se lee como fotos sueltas de una chica linda, no como un personaje.

Dos capas, y las dos ya están implícitas en material aprobado:

| Capa | Qué es | Por qué esta |
|---|---|---|
| **Objeto** | **Argollas de oro chicas + cadenita fina de oro.** En TODAS las piezas, sin excepción | Ya están en su ancla aprobada (`452d8375`) y en 2 de los 5 atuendos. Hacerlo constante no cuesta nada y no toca la cara |
| **Color** | **Siempre algo terracota `#E4714E` en cuadro** — prenda, taza, pared, cuaderno, bolso | Su acento ya estaba decidido en `LUCIA.md`. Convertirlo en regla de dirección de arte le da unidad al feed sin disfrazarla |

### El push-back honesto

En la referencia el rasgo eran unas **gafas amarillas**: un objeto raro, imposible de confundir.
Las argollas de oro **no son eso** — son joyería común y no funcionan como firma por sí solas.
Lo que sí funciona es la **combinación**: oro constante + terracota siempre presente. Es una
firma de dirección de arte, no de vestuario, y sobrevive a cualquier escena.

Si querés una firma fuerte de verdad, hay que sumar UN objeto raro y **regenerar su banco
entero**. Eso es una decisión tuya con costo: ~30 imágenes a 1,5 cr = ~45 créditos. No lo hago
sin que lo pidas.

---

## PASO 2 — Paleta hex fija (va en TODOS los prompts)

Hoy no existe y es lo que le daría coherencia al feed. Doce valores, sacados de su material
aprobado y de Santa Cruz real:

```
PIEL Y PELO
#C89F82  piel tostada cálida
#8A5A3B  pelo castaño oscuro
#5C3A24  ojos marrones

SU ACENTO (obligatorio, algo de esto en cuadro)
#E4714E  terracota
#C4552F  terracota quemada

VESTUARIO
#EFE7DA  crema
#D8C9B0  beige lino
#F4F1EC  blanco roto
#6E7A5E  verde oliva apagado

SANTA CRUZ (fondos)
#B08246  ocre de pared gastada
#4E8C87  turquesa descascarado
#2E2A26  sombra cálida
```

⛔ **`#00D26A` (verde ONIA) NO entra en sus piezas.** Es de la marca.

---

## PASO 3 — Prompt de realismo, 11 bloques

La fórmula v2 de la bible tenía 8. Faltaban tres, y son los que más mueven la aguja porque
atacan lo que delata a una imagen generada: **la luz demasiado perfecta y la óptica demasiado
limpia.**

| # | Bloque | Texto |
|---|---|---|
| 1 | Ancla | `<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>>` |
| 2 | Apertura | `One single continuous photograph, full bleed, filling the entire frame edge to edge.` |
| 3 | Identidad | `Keep her face identical to the reference: Bolivian woman, 26, warm tan skin with light freckles, long dark wavy hair, brown eyes, natural minimal makeup.` |
| 4 | Piel real | `Photorealistic real human skin with visible pores, fine peach fuzz, subtle texture and tiny imperfections; natural face asymmetry.` |
| 5 | Ojos | `Bright lively eyes with sharp catchlights and natural moisture.` |
| 6 | Cejas | `Natural eyebrows with individual visible hairs, slightly uneven and unruly.` |
| 7 | **Rasgo constante** 🆕 | `She always wears small thin gold hoop earrings and a fine gold chain necklace. Something terracotta #E4714E is visible in the frame.` |
| 8 | **La luz como DEFECTO** 🆕 | `Imperfect available light: strong highlights, slightly washed-out tones, uneven exposure across the frame, one side of her face brighter than the other.` |
| 9 | **Firma óptica del celular** 🆕 | `Minor chromatic aberration at the image edges, characteristic of a modern smartphone camera with a slightly wide lens. Slight motion softness, no tripod steadiness.` |
| 10 | **Paleta** 🆕 | `Color palette limited to #C89F82 #8A5A3B #E4714E #EFE7DA #D8C9B0 #B08246 #4E8C87 #2E2A26.` |
| 11 | Cierre | `Shot on iPhone, natural light, slight film grain, no beauty filter, no smoothing. Not a 3D render, not AI-looking, not plastic, not doll-like, not airbrushed. No brand logos, no text, no watermark.` |

**Por qué el bloque 8 es el que más importa:** una imagen generada falla casi siempre por
tener luz de estudio donde debería haber luz de casa. Pedir el defecto —quemado de un lado,
tonos lavados, exposición despareja— es lo que la baja de "render" a "foto que alguien sacó".

**Ojo con el bloque 11:** lleva negaciones. Funcionan en la vía `nano_banana_2` + Element.
**Con `soul_2` las negaciones producen lo que nombran** — ahí el bloque 11 se corta después de
"no smoothing".

---

## PASO 4 — Parámetros

```
model: nano_banana_2   ·   resolution: 2k   ·   aspect_ratio: 3:4 | 9:16 | 1:1
use_unlim: false       ·   costo: 2 cr a 2k · 1,5 cr a 1k
```

Vía alternativa barata para volumen: `soul_2` + `soul_id 36305a9b` a 0,12 cr, **sin el bloque
11 completo** y aceptando que la piel sale enrojecida (medido en `prueba-motor-20260813/`).

---

## PASO 5 — Prueba

Ver `prueba-realismo-20260815/` en esta misma carpeta: 3 imágenes con los 11 bloques, y el
veredicto de si mejoró.

---

Relacionado: `LUCIA.md` (IDs y decisiones abiertas) ·
`references/models/lucia-onia-identity-bible.md` (fórmula v2 original, 8 bloques) ·
`prueba-motor-20260813/` (por qué la vía Element gana).
