# LUCÍA — archivo único

> **Este archivo manda.** Todo lo que se decide sobre Lucía se escribe acá. Si otro doc dice
> algo distinto, gana este. Última edición: 2026-08-13.
>
> Las decisiones abiertas están marcadas 🟡 con opciones numeradas. Cuando Sergio elige, se
> reemplaza el bloque por la elegida y se marca ✅ con la fecha.

---

## 1. Quién es y qué vende

| | |
|---|---|
| Handle | `@lucia.antelo.oficial` |
| Perfil | Boliviana, 26, Santa Cruz de la Sierra |
| **Vende** | La plataforma ONIA. Y es la vitrina viva del producto *"te creamos tu influencer IA"* |
| **Métrica única** | Demos agendadas con `src=lucia-*`. Seguidores y likes son ruido |
| Etiqueta IA | **Obligatoria en la bio.** No se negocia |

⛔ `@lu.antelo` está **ocupado por una persona real**. Nunca usarlo. Sigue escrito mal en
`ONIA_META_CIERRE_VERIFICACION_20260726.md` §370/375 y en `lucia-onia-identity-bible.md:23`.

---

## 2. 🟡 DECISIÓN 1 — El ancla de la cara

Hay tres anclas vivas y los docs se contradicen sobre cuál es la buena.

| Opción | Element ID | Qué es | Evidencia |
|---|---|---|---|
| **A** | `452d8375-fb67-4df7-9ae0-8f1b257aa51f` `lucia-ancla-2026-08` | La selfie de espejo que aprobaste | **Ganó la prueba del 13-ago: 1er y 2do puesto** de 5 |
| **B** | `902eeebb-89e9-4477-8426-c555b20f7ecc` `lucia-surgical-anchor` | Foto 03 del photoshoot, fondo blanco | Aprobado por vos el 2026-07-07 como identidad definitiva. Salió 3ro en la prueba |
| **C** | `ced20cc2-3388-4d98-92ee-b0fcd961aa62` `lucia-face-real-anchor` | Frame real del video, escalado 2K, cero IA | Es la **verdad de terreno para QA**. El catálogo dice no usarlo para generar |

**Recomiendo A**, con C como referencia de QA. B queda de respaldo.

⛔ **Jubilados, no usar:** `de586dbb` `lucia-face-element` (generado por soul_2, ya tiene un
paso de deriva) · Soul `36305a9b` para primer plano (sale con la piel enrojecida).

---

## 3. 🟡 DECISIÓN 2 — El vestuario

Las 5 fichas que mandaste **ya existen como Reference Element** con ID. Ninguna hay que rehacer.

| # | Nombre | Qué es exactamente | Element ID |
|---|---|---|---|
| 1 | **cleangirl** | top de punto acanalado crema + pantalón sastre crema + bandolera camel + cadenita fina + argollas chicas | `16833b18-9e23-434a-99b2-92bac2915e4c` |
| 2 | **streetwear** | remera blanca entallada + jean recto claro + zapatillas blancas + bandolera camel | `ec1dece5-23c4-4ee3-84c6-14a49a926f7c` |
| 3 | **nightout** | vestido midi negro un hombro + sandalias de tira + clutch + dije + argollas + lentes | `5503f588-d543-4925-be56-e4db560f632d` |
| 4 | **loungewear** | sweater de punto crema + pantalón crema al tono + pantuflas de corderito | `6186d80f-cb02-4cd2-89d9-e5afdcce7c6c` |
| 5 | **gym** | top deportivo negro + calza gris oscuro + zapatillas blancas | ficha `lucia-fit-gym-v2` (ID en `lucia-demos-20260709/`) |

⚠️ **Hay dos catálogos de outfit vivos con IDs distintos para el mismo look** (los de arriba,
sin sufijo, y una tanda `lucia-fit-*-v2`). Hay que jubilar uno.

**Opciones de vestuario canónico:**

- **A — las 5.** Máxima variedad. Riesgo: el vestido negro y el gym la corren de "dueña de
  negocio que muestra software" a lifestyle genérico.
- **B — 3 de trabajo: cleangirl, streetwear, loungewear.** Es la que vende software: se la ve
  trabajando, no posando. Deja gym y nightout para historias sueltas.
- **C — 4: cleangirl, streetwear, gym, nightout.** Saca loungewear (se parece mucho a cleangirl
  en cámara: los dos son crema de punto).

**Recomiendo B.** Su trabajo es que un dentista de Santa Cruz la crea. El vestido negro de
noche no aporta a eso y el gym compite con mil cuentas de fitness.

---

## 4. 🟡 DECISIÓN 3 — Dónde vive (esto es el que más riesgo tiene)

Los resultados que te gustaron están buenísimos de factura, pero **tres no son Santa Cruz**:
el parque con hojas de otoño (Santa Cruz es tropical, no tiene otoño), el café de pared de
ladrillo y el piso de madera con biblioteca leen europeos.

Si la bio dice Santa Cruz y las fotos dicen Europa, el primer comentario va a ser "¿esto dónde
es?" — y ahí se cae sola.

| Opción | Qué implica |
|---|---|
| **A — Santa Cruz estricto** | Vereda de ladrillo, paredes ocre/turquesa, moto, mango y tajibo, mercado con toldos, café tropical, coworking con plantas. Luz cálida húmeda. **Se descartan las 3 fotos europeas** |
| **B — Ciudad sin nombre** | Se saca Santa Cruz de la bio. Interiores neutros, cero seña geográfica. Todo el banco actual sirve |
| **C — Híbrido** | Feed en Santa Cruz, historias en interiores neutros |

**Recomiendo A.** El único activo que Lucía tiene contra 10.000 influencers IA es ser
**local y creíble en Bolivia**. Es lo que la hace vendible a un dentista cruceño.
De las que te gustaron, la que ya cumple es **la del café con palmeras y el latte** — esa
sí lee Santa Cruz.

---

## 5. ✅ DECIDIDO — El método de generación (prueba del 13-ago, 4,74 cr)

**Anclar SOLO la cara y describir outfit + lugar + acción + luz EN TEXTO.**

Nunca combinar cara + outfit-Element + lugar-Element para contenido de feed: `nano_banana_pro`
compone las referencias casi 1:1 y sale "foto de referencia con la cara pegada", igual cada vez.
Los Elements de outfit y lugar quedan solo para match EXACTO (producto de un cliente, un local
que debe verse igual).

```
model: nano_banana_2  ·  resolution: 2k  ·  aspect_ratio: 9:16 | 3:4 | 1:1  ·  use_unlim: false
costo: 2 cr a 2k · 1,5 cr a 1k
```

⚠️ `quality` **no existe** en este modelo — es `resolution`, y sin pasarlo sale 1k.

---

## 6. El molde — se copia y solo cambia escena y cámara

```
[ancla] + [apertura] + [piel] + [atuendo] + [escena] + [cámara]
```

**Apertura (fija):**
`One single continuous photograph, full bleed, filling the entire frame edge to edge.`

**Piel / identidad (congelada, sin editar):**
```
Keep her face identical to the reference: Bolivian woman, 26, warm tan skin with light
freckles, long dark wavy hair, brown eyes, natural minimal makeup, real skin texture with
visible pores.
```

**Cámara — 4 colas:**

| Cola | Para | Texto |
|---|---|---|
| **R1 Feed** | posts de vida cotidiana | `candid documentary photo, 35mm/50mm, natural light` |
| **R2 Copy-space** | base de carrusel y stories | `She stands in the lower two thirds of the frame in front of a large smooth freshly painted <color> wall; the rest of the frame is that smooth empty wall. Soft diffused daylight, 50mm` |
| **R3 UGC** | lo que parece grabado con celular | `taken by a friend standing close to her, mid-sentence talking, available window light only, slightly imperfect handheld framing, everyday vertical phone photo` |
| **R4 Beauty** | primer plano | `Extreme close-up, her head and shoulders fill the whole frame; background is a smooth <color> wall completely out of focus. 85mm f/2` |

**Ejemplo armado, el que ganó la prueba:**
```
<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>> A casual candid snapshot of this exact woman taken
by a friend standing close to her in a bright tropical cafe in Santa Cruz de la Sierra,
Bolivia, with potted monstera plants and a worn wooden table. Keep her face identical to the
reference: warm tan skin with light freckles, long dark wavy hair, brown eyes, real skin
texture with visible pores. She wears a cream linen shirt, straight jeans and a thin gold
chain necklace, seen from the waist up, mid-sentence talking. Available window light only,
slightly imperfect handheld framing, everyday vertical phone photo.
```

---

## 7. Prohibido

- **Negaciones con Soul.** Escribir "sin texto, sin logos" produce texto y logos. Con la vía
  Element sí funcionan. Es la única regla que cambia según la vía.
- Las palabras `app`, `interfaz`, `story`, `pantalla`, `screenshot` — ni para prohibirlas.
- `Santa Cruz` a secas: arrastra a California. Siempre `Santa Cruz de la Sierra, Bolivia`.
- Carteles o marcas con texto legible. Si la pieza lleva texto, va encima con HyperFrames.
- **Testimonios de resultados.** Lucía nunca testimonia. No hay clientes que mostrar todavía.

## 8. QA antes de aprobar

Comparar contra `references/models/pecas-clean-v2/` (18 frames del video real): pecas, cejas,
ojos, labios tienen que calzar. Es obligatoria — saltearla fue lo que dejó pasar 11 avatares
deformados.

## 9. 🔴 Pendiente que no es técnico

Toda la identidad cuelga de frames de **un video de una persona real**. En los frames de QA
aparece sosteniendo un producto de marca. `AVATAR-CONSISTENCY-SCHEME` ya documenta que el
"video B" resultó ser **otra persona distinta**, o sea que el material vino de más de una
fuente. La regla propia de ONIA dice *"nunca foto de una persona real sin consentimiento"*.

**¿De dónde salieron esos videos y hay permiso?** Antes de que la cuenta sea pública.

---

Evidencia: `prueba-motor-20260813/` (la prueba que fijó el método) ·
`references/models/lucia-elements-catalog.md` (IDs) ·
`docs/ONIA_MODELOS_RECETA_VISUAL_20260806.md` (calibración de 30 imágenes).
