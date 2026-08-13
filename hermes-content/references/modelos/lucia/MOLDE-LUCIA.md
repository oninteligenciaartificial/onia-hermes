# MOLDE de Lucía — de acá sale toda pieza

> Actualizado 2026-08-13 con el resultado de `prueba-motor-20260813/`. Antes el molde por
> defecto era Soul; la prueba lo movió a Element. Si cambia una regla, se edita ACÁ.

## La fórmula

```
[ancla] + [apertura] + [piel/identidad] + [atuendo] + [escena] + [cámara]
```

Las piezas 1, 2 y 3 no se tocan nunca. Sólo cambian escena y cámara.

---

## 1. Ancla — la "skin"

**Por defecto (ganador de la prueba):** Element, va literal al inicio del prompt.

```
<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>>
```

| Ancla | ID | Cuándo |
|---|---|---|
| `lucia-ancla-2026-08` (Element) | `452d8375-fb67-4df7-9ae0-8f1b257aa51f` | **Default.** 1º y 2º puesto |
| `lucia-surgical-anchor` (Element) | `902eeebb-89e9-4477-8426-c555b20f7ecc` | 3º. Sale más "modelo de stock" |
| `LUCIA-REAL-v2-clean` (Soul) | `36305a9b-af24-4390-959b-885082dddd5d` | 4º y 5º. Va como parámetro `soul_id`, no en el texto. Usar sólo si se busca fidelidad al video real por encima de lo vendible |

## 2. Apertura — obligatoria, sin editar

```
One single continuous photograph, full bleed, filling the entire frame edge to edge.
```

## 3. Piel / identidad — congelada (v1), se pega sin editar

Vía Element:
```
Keep her face identical to the reference: Bolivian woman, 26, warm tan skin with light
freckles, long dark wavy hair, brown eyes, natural minimal makeup, real skin texture with
visible pores.
```

Vía Soul: lo mismo **sin** el `Keep her face identical to the reference:`.

Nunca describir rasgos faciales más allá de esto: pelearle a la identidad la rompe.

## 4. Atuendo — rotar los 3, nunca inventar uno nuevo sin sumarlo acá

| | Atuendo |
|---|---|
| **A** | camisa de lino crema + jeans rectos + cadenita de oro fina |
| **B** | top de punto acanalado terracota + pantalón blanco ancho + argollas chicas |
| **C** | vestido midi de algodón verde oliva + sandalias, sin joyas |

Si el prompt fija una prenda, la vía Element la respeta. La vía Soul **no** — en la prueba
devolvió remera blanca donde se pidió camisa de lino.

## 5. Escena — sólo Santa Cruz real

Vereda de ladrillo · paredes gastadas ocre/turquesa · moto estacionada · árboles de mango y
tajibo · mercado informal con toldos y cajas plásticas · café tropical luminoso · coworking
con plantas. Luz cálida húmeda. **Nunca oficina formal.**

Escribir siempre `Santa Cruz de la Sierra, Bolivia` completo. `Santa Cruz` sola arrastra a
California (salió un cartel "SANTA CRUZ SURF SHOP").

## 6. Cámara — elegir una cola

| Cola | Para qué | Texto |
|---|---|---|
| **R1 · Feed** | posts 3:4 de vida cotidiana | `candid documentary photo, 35mm/50mm, natural light` |
| **R2 · Copy-space** | base de carrusel y stories | `She stands in the lower two thirds of the frame in front of a large smooth freshly painted <color> wall; the rest of the frame is that smooth empty wall. Soft diffused daylight, 50mm` |
| **R3 · UGC** | lo que parece grabado con celular | `taken by a friend standing close to her, mid-sentence talking, available window light only, slightly imperfect handheld framing, everyday vertical phone photo` |
| **R4 · Beauty** | primer plano | `Extreme close-up, her head and shoulders fill the whole frame; background is a smooth <color> wall completely out of focus. 85mm f/2` |

---

## El molde armado — pieza ganadora, copiar y cambiar sólo la escena

```
<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>> A casual candid snapshot of this exact woman taken
by a friend standing close to her in a bright tropical cafe in Santa Cruz de la Sierra,
Bolivia, with potted monstera plants and a worn wooden table. Keep her face identical to the
reference: warm tan skin with light freckles, long dark wavy hair, brown eyes, real skin
texture with visible pores. She wears a cream linen shirt, straight jeans and a thin gold
chain necklace, seen from the waist up, mid-sentence talking. Available window light only,
slightly imperfect handheld framing, everyday vertical phone photo.
```

## Parámetros

| | Element (default) | Soul |
|---|---|---|
| `model` | `nano_banana_2` | `soul_2` |
| ancla | `<<<uuid>>>` en el prompt | parámetro `soul_id` |
| resolución | `resolution: 2k` | `quality: 2k` |
| costo | **2 cr** a 2k · 1,5 a 1k | **0,12 cr** |
| `aspect_ratio` | `3:4` feed · `9:16` reel/story · `1:1` avatar | ídem |
| `use_unlim` | `false` | `false` |

⚠️ `quality` **no existe** en `nano_banana_2`. Si no se pasa `resolution`, sale 1k por defecto.

## Prohibido en el prompt

- **Negaciones con Soul.** Escribir "sin texto, sin logos" produce texto y logos. Con Element
  sí funcionan y los prompts validados las llevan al final. Es la única regla que cambia por vía.
- Las palabras `app`, `interfaz`, `story`, `pantalla`, `screenshot` — ni para prohibirlas.
- Carteles o marcas con texto legible. Si la pieza necesita texto, va **encima** con HyperFrames.

## QA antes de aprobar

Comparar contra `references/models/pecas-clean-v2/` (frames del video real): pecas, cejas,
ojos, labios tienen que calzar. Para carruseles, `node scripts/carousel_contactsheet.js <carpeta>`.

---

Fuentes: `docs/ONIA_MODELOS_RECETA_VISUAL_20260806.md` (calibración de 30 imágenes que fijó la
fórmula) · `prueba-motor-20260813/LEEME.md` (la prueba que movió el default a Element) ·
`docs/ONIA_MODELOS_RAIZ.md` (índice).
