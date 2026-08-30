# Receta visual de las modelos — resultado del lote de calibración

> 🔴 **AVISO (2026-08-30) — este doc nombra el Soul de Lucía, y el Soul está PROHIBIDO.**
>
> El Soul `36305a9b` (LUCIA-REAL-v2-clean) sale con **la piel roja**, ignora el atuendo pedido y se
> entrenó con frames de una persona real sin permiso documentado. El Soul v3 `e6d8703c` perdió el
> A/B del 22-ago y le cambia el color de ojos.
>
> **La cara de Lucía se genera con el Element-ancla `@lucia-skin-v1`
> (`58bbd635-9b90-4bd2-b08a-1cd4915bd563`), NO con un Soul.** Manda
> `references/modelos/lucia/BANCO-OFICIAL.md`. Señal rápida: **si la cara está roja, está mal.**

> 2026-08-06. Ejecución del paso 1 de `ONIA_MODELOS_PLAN_AUTOMATIZADO_20260806.md` §5.
> 30 imágenes generadas en 3 rondas (**~3,6 créditos de 2.994**), revisadas una por una.
> Esto NO es un plan: es la **receta reproducible** que produce piezas limpias de Lucía y
> Mara. Al cambiar una regla, se edita acá.
>
> Assets: `hermes-content/references/modelos/{lucia,mara}/calibracion-20260806/`
> Hojas de contacto: `_CONTACTO-LUCIA.jpg`, `_CONTACTO-MARA.jpg`, `_CONTACTO-V2-CORRECCIONES.jpg`,
> `_CONTACTO-V3-FINAL.jpg`.

---

## 1. Lo que resolvió la calibración (y lo que descubrió)

| Ronda | Qué probé | Resultado |
|---|---|---|
| v1 (16 img) | Bloque de identidad fijo, 8 escenas por modelo | **Cara consistente 16/16** ✅ · pero: mismo atuendo en las 8 · escenarios que parecen Miami, no Santa Cruz · **texto inventado** en toda superficie plana |
| v2 (8 img) | Rotación de 3 atuendos + anclaje Bolivia + cláusula "no pongas texto" | Bolivia ✅ · vestuario ✅ · **el "no pongas texto" empeoró todo**: aparecieron UI falsas de Stories (barras, X, iconos, captions basura) |
| v3 (6 img) | Sin ninguna negación; describir SOLO lo que sí quiero | **0 texto basura, 0 UI falsa en las 6** ✅ |

### El hallazgo que hay que respetar siempre

> **Con Soul V2 las negaciones NO funcionan: el modelo dibuja lo que nombrás.**
> Escribir *"sin texto, sin logos, sin interfaz de app"* produjo exactamente texto, logos e
> interfaz. La forma correcta es **afirmativa**: *"una sola fotografía continua, a sangre,
> pared lisa recién pintada"*. Y nunca usar las palabras `app`, `interfaz`, `story`,
> `pantalla`, `screenshot` — ni para prohibirlas.

Corolarios verificados:
- **La consistencia de cara ya no es un problema.** El Soul la resuelve solo; el texto del
  prompt no debe pelearse con ella (describir piel/pelo brevemente, nunca rasgos faciales).
- **Si el prompt fija UNA prenda, el modelo la repite siempre.** Por eso hay 3 atuendos
  nombrados por modelo y se rota — palet, no uniforme.
- **"Espacio para texto" hay que dosificarlo:** pedir "la mitad superior vacía" achica
  demasiado a la persona (L13, M15). Correcto: *"ocupa los dos tercios inferiores"*.

## 2. Bloques de identidad (v1 congelada — pegar SIEMPRE, sin editar)

**Lucía** (`soul_id 36305a9b-af24-4390-959b-885082dddd5d`)
```
Bolivian woman, 26, warm tan skin with light freckles, long dark wavy hair, brown eyes,
natural minimal makeup, real skin texture with visible pores.
```

**Mara** (`soul_id 6c94bbf0-bc71-4fe1-841e-f366bdb00b6e` — **Mara BO v2**, boliviana)
```
Bolivian mestiza woman, 27, light olive-tan skin, oval face, expressive dark brown eyes,
natural thick eyebrows, dark brown hair in a soft blunt shoulder-length cut with a middle
part, real skin texture with visible pores.
```

> ⚠️ El Soul pelirrojo original (`b8f5c353`, *Mara ONIA v1*) quedó **jubilado el 2026-08-06**:
> no leía como boliviana y no sirve para vender e-commerce local. Las imágenes M1-M15 de este
> lote son de esa cara vieja — valen como prueba de la receta, **no como banco de contenido**.
> Cómo se construyó la nueva y cómo repetirlo: `references/modelos/mara-bo/LEEME.md`.

### Atuendos (rotar; nunca inventar uno nuevo sin sumarlo acá)

| | A | B | C |
|---|---|---|---|
| **Lucía** | camisa de lino crema + jeans rectos + cadenita de oro fina | top de punto acanalado terracota + pantalón blanco ancho + argollas chicas | vestido midi de algodón verde oliva + sandalias, sin joyas |
| **Mara** | blazer de lino beige sobre musculosa marfil + pantalón marfil | musculosa acanalada marfil + cárdigan camel oversize | camisa de algodón blanca lisa |

### Escenarios permitidos

- **Lucía:** Santa Cruz real — vereda de ladrillo, paredes gastadas ocre/turquesa, moto
  estacionada, árboles de mango y tajibo, mercado informal con toldos y cajas plásticas,
  café tropical luminoso, coworking con plantas. Luz cálida húmeda. *Nunca* oficina formal.
- **Mara:** interiores minimalistas luminosos — pared lisa, cortina de lino, mármol, cerámica,
  baño de casa con azulejo claro. Luz suave de mañana. *Nunca* exteriores caóticos.

## 3. Las 4 recetas (copiar, cambiar solo la escena)

Estructura invariable: `[apertura] + [bloque de identidad] + [atuendo] + [escena] + [cámara]`.

**Apertura obligatoria en todas:**
`One single continuous photograph, full bleed, filling the entire frame edge to edge.`

| # | Para qué sirve | Cola de la receta | Verificada en |
|---|---|---|---|
| **R1 · Feed** | posts 3:4 de vida cotidiana | `<escena concreta con objetos reales>, candid documentary photo, 35mm/50mm, natural light` | L9, L10, L15 |
| **R2 · Copy-space** | base de carrusel y stories | `She stands in the lower two thirds of the frame in front of a large smooth freshly painted <color> wall; the rest of the frame is that smooth empty wall. Soft diffused daylight, 50mm` | L13, M15 (ajustar a "two thirds") |
| **R3 · UGC / frame de reel** | lo que parece grabado con celular | `A casual candid snapshot taken by a friend standing close to her in <lugar cotidiano>, mid-sentence talking, available window light only, slightly imperfect handheld framing, everyday vertical phone photo` | **L14, M14 — las mejores del lote** |
| **R4 · Beauty / producto** | Mara vendiendo | `Extreme close-up, her head and shoulders fill the whole frame; background is a smooth <color> wall completely out of focus. 85mm f/2, high-end skincare campaign photography` | M13 |

Parámetros fijos: `model: soul_2` · `quality: 2k` · `use_unlim: false` ·
`aspect_ratio`: `3:4` feed · `9:16` reel/story · `1:1` avatar. Costo medido: **0,12 cr/imagen**.

**Nunca** meter en el prompt: negaciones de cualquier tipo · `app`/`interfaz`/`story`/`pantalla` ·
carteles o marcas con texto legible (si la pieza necesita texto, va **encima** con HyperFrames).

## 4. Lo que hay que elegir (Sergio, 5 min)

Marcá cuáles sirven en las hojas de contacto. Referencia de lo que yo veo:

- **Lucía — listas:** L9 (calle SCZ), L10 (mercado), L14 (UGC, la mejor), L15 (café con espacio),
  L1/L2 (retrato y coworking). **Descartar:** L3 y L6 (parecen EE.UU.), L7 y L8 (texto inventado),
  L11/L12 (UI falsa).
- **Mara — listas:** M13 (beauty limpia), M14 (UGC), M12 (textura de crema en la mano),
  M3/M6/M7 (interior minimalista). **Descartar:** M1 y M9 (salen como collage con estante),
  M8/M10/M11 (UI falsa).
- **Foto de perfil sugerida:** Lucía → L1 · Mara → M13.

**Decisión abierta que no puedo tomar yo:** Mara no parece latina (el Soul es pelirroja de piel
clara). Para vender e-commerce en Bolivia probablemente convierta más una modelo latina. Opciones:
(a) dejarla así y usarla para marcas de estética/premium, (b) entrenar un Soul nuevo latino
(~10 min, ~0 costo) y jubilar el actual. **Decidilo antes de que tenga cuenta pública** — después
cambiarle la cara es rehacer todo.

---

Relacionado: `ONIA_MODELOS_PLAN_AUTOMATIZADO_20260806.md` (el plan que esto ejecuta) ·
`ONIA_MODELOS_IA_FICHAS_20260801.md` (fichas, precios, chips) ·
`ONIA_EJERCITO_INFLUENCERS_IA_PLAN_20260806.md` (el ejército) ·
`HIGGSFIELD_FULL_CAPABILITIES_MAP.md` (qué modelo usar para qué).


---

# PLANTILLA DE FOTO FOTORREALISTA — 8 bloques

> Agregado 2026-08-18. Sale de 8 prompts completos que un carrusel dejó a la vista, transcritos
> literales en `references/video-intake/2026-08-18-sintesis-lote-17.md` §2 (ítem DbgN-8CDVc-).
> Las 8 láminas usan **la misma estructura, en el mismo orden**. Eso la vuelve plantilla y no anécdota.

## 0. 🔴 VERIFICADO ANTES DE ESCRIBIR: no existe campo `negative_prompt`

Consulta gratis al catálogo (`models_explore`, 2026-08-18). Revisados los `parameters` de **los 11
motores de imagen de la cuenta**:

| Motor | Parámetros que expone |
|---|---|
| `nano_banana_2` · `nano_banana_pro` | `resolution` |
| `soul_2` · `soul_cinematic` | `quality`, `soul_id` |
| `gpt_image_2` | `resolution`, `quality` |
| `cinematic_studio_2_5` · `marketing_studio_image` | `resolution` |
| `ms_image` | `style_id` (obligatorio), `brand_kit_id`, `resolution`, `quality`, `batch_size`, `product_ids` |
| `image_auto` · `soul_location` | ninguno |
| `soul_cast` | `budget` |

**Ninguno tiene `negative_prompt`.** No es que "algunos lo ignoren": el campo **no existe en ningún
motor de la cuenta**.

**Consecuencia: el negativo va DENTRO del prompt positivo**, como último bloque, con el literal
`Negative prompt:` delante. Es exactamente lo que hacen 7 de las 8 láminas fuente (la lámina 2 es la
única sin negativo).

⚠️ Eso significa que el negativo es **texto que el modelo interpreta**, no un filtro duro. Sesga, no
garantiza. Si algo tiene que NO aparecer sí o sí, se resuelve en el positivo (describiendo lo que SÍ
va) o recortando después.

## 1. Los 8 bloques, en orden

| # | Bloque | Regla |
|---|---|---|
| 1 | **Apertura fija** | `Ultra-realistic vertical [género] photo of...` — el género es la palanca: `editorial fashion`, `flash photo with a raw 35mm film look`, `wildlife portrait`, `studio fashion portrait`, `sci-fi editorial`, `street photo` |
| 2 | **Sujeto con ACCIÓN** | un verbo concreto, no un adjetivo. *"sitting inside the open mouth"*, *"standing beside an open refrigerator"* — nunca *"una mujer elegante"* |
| 3 | **Rasgos físicos enumerados** | pelo, piel, maquillaje, expresión y **dirección de la mirada** |
| 4 | **Vestuario prenda por prenda** | con material y color: *"sheer pale-blue ruffled blouse, light denim shorts, beige slouchy knee-high boots"* |
| 5 | **Pose explícita, miembro por miembro** | *"One leg is bent, the other extended forward"* · *"one hand relaxed near the floor"* |
| 6 | **Fondo como LISTA DE OBJETOS** | no "un parque bonito": *"grass, swing set, houses, trees, blue sky"* |
| 7 | **Bloque técnico + referencia de género** | luz, grano, profundidad de campo + una frase tipo *"realistic fashion-magazine feel"*, *"candid amateur-film aesthetic"* |
| 8 | **`Negative prompt:`** | núcleo constante + 2-3 términos del sujeto |

**Núcleo constante del negativo** (casi idéntico en las 7 láminas que lo traen):

```
Negative prompt: CGI, cartoon, plastic skin, beauty filter, over-retouched, bad anatomy,
extra fingers, HDR, studio lighting, over-sharpening, blurry subject, text, watermark
```

Más 2-3 específicos del sujeto: `warped fridge, unreadable messy labels` · `distorted torch, messy
jacket seams` · `fantasy horse, extra ears, distorted mane` · `unreadable shirt text, clean costume`.

## 2. ⭐ REGLA DE LA SUCIEDAD — se pide fealdad y se prohíbe lo pulido

**Un modelo de imagen dejado solo tira a catálogo. Hay que empujarlo al lado contrario, y se hace
con dos fuerzas opuestas al mismo tiempo.**

| En el POSITIVO se pide | En el NEGATIVO se prohíbe |
|---|---|
| `scratches and dirt marks` | `perfect background` |
| `stained plush fur`, `torn in places` | `clean costume` |
| `peeling paint, rust marks`, `trash, cigarette butts` | `glossy plastic` |
| `harsh direct camera flash`, `strong shadows` | `studio lighting` |
| `slight film grain`, `muted colors`, `soft focus edges` | `over-sharpening`, `HDR` |
| `realistic skin texture`, `pores` | `beauty filter`, `over-retouched`, `plastic skin` |

**No es decoración: es LA palanca del realismo.** Sin ella el motor entrega render de catálogo y se
nota a un metro. Los 8 prompts fuente la aplican sin excepción.

### 2-bis. Tres atajos que funcionan sin tocar el prompt

1. **Seis ejes de realismo** (ítem DcEIPU_keNv): imperfección de piel · luz dura de sol · encuadre
   de selfie torcido · contexto banal verificable · marcas reales · defectos de cámara.
2. **El más barato de todos** (DcDy6VVjsO7): **elegir caras con edad y textura real** en vez de
   modelos jóvenes perfectas. Una cara de 55 con arrugas se ve real sin pelear con el modelo; una de
   22 impecable pelea siempre.
3. **El texto NUNCA se hornea en la generación.** Regla ya fijada por el ítem DcGUUb9h3ZO, donde el
   lado que se vendía como superior tenía el texto reventado y duplicado. El modelo genera **fondo y
   sujeto**; el texto va en HTML sobre HyperFrames, donde tipografía, color y **ortografía** son
   deterministas.

## 3. Tres ejemplos escritos para necesidades reales nuestras

> **Ninguno está generado.** Es texto listo para que Sergio apruebe. Costos medidos en
> `web-factory/docs/MODELOS_IA_QUE_USAR_PARA_QUE.md`: `nano_banana_2` 2.00 cr · `gpt_image_2` low
> 0.50 cr · `z_image` 0.15 cr · `soul_2` 0.12 cr.

### 3.1 — Catálogo de producto · Nuvia (proyecto propio, catálogo real)

Motor: **`nano_banana_2`** · 2.00 cr — hace falta fidelidad de producto, no cara.

```
Ultra-realistic vertical product photo of a skincare serum bottle standing on a worn marble
bathroom shelf. The bottle is frosted glass with a matte black dropper cap, label facing the
camera, with faint fingerprints on the glass and a single drop running down one side. Shelf
surface shows water rings, a chipped edge, and fine dust in the corners. Background: tiled
bathroom wall with visible grout lines, a folded cotton towel out of focus, morning light
falling from a window at the left. Shot on a 50mm lens at f/2.8, natural window light with soft
falloff, slight film grain, muted colors, realistic glass reflections, shallow depth of field,
honest e-commerce product feel, not a rendered mockup. Negative prompt: CGI, 3D render, cartoon,
plastic texture, floating product, perfect background, studio lighting, HDR, over-sharpening,
watermark, text overlay, distorted label, unreadable label text.
```

*Por qué así:* el ancla de suciedad son las huellas, el anillo de agua y el borde saltado. Sin eso
sale render de Behance. La etiqueta se declara `facing the camera` y se prohíbe distorsionarla, pero
**el texto de la etiqueta se pone después en HyperFrames**, nunca se hornea.

### 3.2 — Foto de ambiente para una web · rubro gastronomía

Motor: **`gpt_image_2`** quality `low` · 0.50 cr — es fondo de hero, no necesita 2K.

> ⚠️ **Es plantilla reusable, no un cliente.** Hoy no hay ningún restaurante cliente. Cuando lo haya,
> se reemplaza por fotos reales de su local: una foto real siempre gana.

```
Ultra-realistic vertical interior photo of a small family restaurant in Santa Cruz de la Sierra
at midday, empty of customers, seen from the doorway. Wooden tables with mismatched chairs, a
plastic tablecloth with a worn pattern, salt shakers and a napkin holder on the nearest table, a
ceiling fan turning, a chalkboard menu with smudged writing on the back wall. Tropical light comes
hard through a side window and lands in a bright patch on the floor, leaving the back of the room
in shadow. Scuffed tile floor, a fan cable taped along the wall, condensation on a glass. Shot
handheld on a phone at eye level, natural harsh daylight, slight film grain, muted warm colors,
realistic wear on every surface, documentary feel, not a hotel brochure. Negative prompt: CGI, 3D
render, cartoon, perfect background, staged food styling, studio lighting, smiling stock models,
HDR, over-sharpening, glossy floor, text, watermark, legible menu text.
```

*Por qué así:* `legible menu text` va al negativo **a propósito** — el texto horneado siempre sale
mal, y una pizarra ilegible se lee como real. `not a hotel brochure` es la frase de género que
corrige el sesgo a catálogo.

### 3.3 — Imagen de campaña para `@oniahq` · el dolor del cuaderno

Motor: **`z_image`** · 0.15 cr — nadie tiene que reconocer a una persona, es un plano de objeto.
Regla vigente: si no hay que reconocer a nadie, no se paga caro.

```
Ultra-realistic vertical overhead photo of a worn spiral notebook open on a shop counter, used as
a business ledger. The pages are filled with handwritten rows in blue and black ink, several
entries crossed out, a coffee ring on the corner, a bent page edge, and pen marks in the margin.
Beside it: a calculator with faded buttons, a cheap ballpoint pen, a stack of paper receipts held
by a bulldog clip, and a phone face down. The counter surface is scratched laminate with a chipped
corner. Hard overhead shop lighting from a single fluorescent tube, visible shadow under the
notebook, slight film grain, muted colors, realistic paper texture and ink bleed, honest
documentary snapshot, not a styled flat lay. Negative prompt: CGI, 3D render, cartoon, clean desk,
perfect background, styled flat lay, studio lighting, HDR, over-sharpening, legible handwriting,
readable numbers, text, watermark.
```

*Por qué así:* `legible handwriting, readable numbers` en el negativo — si los números se leen, se
leen mal y matan la pieza. El cuaderno tiene que **parecer** usado, no ser legible. El titular de la
campaña va en HyperFrames encima.

## 4. Checklist antes de mandar a generar

- [ ] ¿La apertura declara el género?
- [ ] ¿El sujeto tiene un **verbo**, no un adjetivo?
- [ ] ¿El fondo es una **lista de objetos**?
- [ ] ¿Pedí suciedad explícita? (al menos 3 marcas concretas)
- [ ] ¿El negativo ataca lo pulido? (`beauty filter`, `perfect background`, `studio lighting`)
- [ ] ¿El `Negative prompt:` está **dentro** del prompt? (no hay campo aparte — §0)
- [ ] ¿Ningún texto legible depende de la generación? (va en HyperFrames)
- [ ] ¿Elegí el motor por si hace falta reconocer una cara, no por costumbre?
