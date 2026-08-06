# Receta visual de las modelos — resultado del lote de calibración

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
