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

## 1-bis. El personaje — escrito como decisión, no como descripción

> *Una cara bonita no vende, un personaje sí.* Esto va antes que cualquier píxel.

| | |
|---|---|
| **A quién le habla** | Al dueño de un negocio formal de 1 a 20 personas que ya factura y está ahogado en tareas. **No** a marketers ni a otros creadores de IA |
| **Qué defiende** | Que el desorden no es falta de esfuerzo. Que el dueño no tiene que ser el cuello de botella |
| **Contra qué está** | El humo de la IA. El "automatizá todo". Los que venden herramientas sin decir qué cuestan |
| **Es IA y lo dice** | No se esconde: es el gancho — *"hace un año yo no existía"* |

**Lo que Lucía NUNCA hace:** no testimonia (no cuenta que tiene un negocio ni que un sistema
la salvó — es IA declarada y fingir cliente es fabricar; escenificación sí, pero **rotulada**)
· no promete resultados con números que no salgan de un cliente real · no habla de salud ni
dinero garantizado · **no usa el verde de ONIA**, que es de la marca.

## 1-ter. Rasgo distintivo constante

Dos capas, **en todas las piezas sin excepción**:

| Capa | Qué |
|---|---|
| **Objeto** | Argollas de oro chicas + cadenita fina de oro |
| **Color** | Siempre algo **terracota `#E4714E`** en cuadro: prenda, taza, pared, cuaderno o bolso |

⚠️ **Push-back honesto:** las argollas de oro **no son** las gafas amarillas de la referencia
— son joyería común y no funcionan como firma solas. Lo que funciona es **oro + terracota como
dirección de arte**, que sobrevive a cualquier escena y no toca la cara. Una firma fuerte de
verdad exige un objeto raro y **regenerar su banco entero** (~30 imágenes, ~45 cr). Decisión
de Sergio, no la tomo yo.

## 1-quater. Paleta hex fija — va en TODOS los prompts

```
PIEL Y PELO     #C89F82 piel tostada · #8A5A3B pelo castaño · #5C3A24 ojos
SU ACENTO       #E4714E terracota · #C4552F terracota quemada
VESTUARIO       #EFE7DA crema · #D8C9B0 beige lino · #F4F1EC blanco roto · #6E7A5E oliva apagado
SANTA CRUZ      #B08246 ocre gastado · #4E8C87 turquesa descascarado · #2E2A26 sombra cálida
```

⛔ `#00D26A` (verde ONIA) **no entra** en sus piezas.

## 2. 🟡 DECISIÓN 1 — El ancla de la cara

**Mirá `INVENTARIO-caras.jpg`, acá al lado.** Son las 6 caras de Lucía que hay en la cuenta,
en ese orden.

| Pos. | Element ID | Nombre | Qué es | Veredicto |
|---|---|---|---|---|
| **1** | `452d8375-fb67-4df7-9ae0-8f1b257aa51f` | `lucia-ancla-2026-08` | Selfie de espejo, argolla de oro. Generada | ✅ **Ganó la prueba del 13-ago: 1er y 2do puesto** de 5 |
| **2** | `902eeebb-89e9-4477-8426-c555b20f7ecc` | `lucia-surgical-anchor` | Photoshoot fondo blanco, sonrisa | ✅ La aprobaste el 7-jul. Salió 3ra |
| **3** | `ced20cc2-3388-4d98-92ee-b0fcd961aa62` | `lucia-face-real-anchor` | Frame REAL del video, escalado 2K | ✅ **Verdad de terreno para QA.** No generar con ella |
| 4 | `d5e323ef-4d0e-41bf-863e-ec30aede20ae` | `LUCIA-REAL-v2-clean` | Otro frame del MISMO video | ⛔ Redundante con la 3. Y su nombre está duplicado con el Soul |
| 5 | `de586dbb-0cdd-4ca2-aaac-173d11741c86` | `lucia-face-element` | Otro frame del mismo video | ⛔ Ya marcada legacy en el catálogo |
| 6 | `fdf4b740-829e-4923-9325-76914539ac0a` | `Lucia ONIA v1` | Selfie de baño, generada, sin descripción | ⛔ La más vieja, superada por la 1 |

**Recomiendo: quedarse con 1 (generar), 3 (QA) y 2 de respaldo. Borrar 4, 5 y 6.**

Las 3, 4 y 5 son frames del mismo video real — por eso salen con las mejillas rojas, y por eso
el Soul entrenado con ellas produce piel enrojecida.

⛔ Soul `36305a9b` para primer plano: sale con la piel roja y además ignora el atuendo pedido.

---

## 3. ✅ DECIDIDO — El vestuario: gana la tanda `-v2`

**Mirá `INVENTARIO-ropa.jpg`.** Fila de arriba = tanda vieja (4 flatlays de Pinterest).
Fila de abajo = tanda **`-v2`** (5 turnarounds front/side/back en maniquí, fondo blanco).

Gana la `-v2` por dos motivos, y el segundo no es estético:

1. Turnaround de 3 vistas contra una foto plana — el modelo ve cómo cae la prenda por atrás.
2. **La tanda vieja tiene una marca de agua de TikTok visible** en la ficha de jean + remera.
   Es contenido de terceros. No va en nada nuestro.

| # | Look | Qué es exactamente | Element ID ✅ |
|---|---|---|---|
| 1 | **cleangirl** | top crema acanalado + pantalón beige + dorado mínimo + bandolera camel + mocasines | `cac118e1-a683-4874-b32a-eee4efbbed36` |
| 2 | **streetwear** | remera blanca + jean claro recto + gorra lisa + zapatillas blancas + bandolera camel | `db9608fd-5f72-49df-b681-9414382c5cbb` |
| 3 | **nightout** | vestido negro midi un hombro + tacos + cartera negra + dorado + lentes | `3c9d1e87-ea1b-4ae1-8c5e-60683a848033` |
| 4 | **loungewear** | sweater crema + pantalón de punto crema + pantuflas | `23135bd8-8827-4bb5-9045-fe08ef80f9e1` |
| 5 | **gym** | top deportivo gris carbón + calza tiro alto + zapatillas blancas | `8352ef80-63b4-4cb1-be8b-b21cbacb22be` |

⛔ **Jubilar los 4 viejos:** `16833b18` · `ec1dece5` · `5503f588` · `6186d80f`.

### 🟡 Cuáles de las 5 entran al feed

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

**Los 11 bloques (probados el 15-ago, ver `prueba-realismo-20260815/`).** Los bloques 7 a 10
son los que faltaban y los que más mueven la aguja: atacan lo que delata a una imagen
generada, que es **la luz demasiado perfecta y la óptica demasiado limpia.**

| # | Bloque | Texto |
|---|---|---|
| 1 | Ancla | `<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>>` |
| 2 | Apertura | `One single continuous photograph, full bleed, filling the entire frame edge to edge.` |
| 3 | Identidad | `Keep her face identical to the reference: Bolivian woman, 26, warm tan skin with light freckles, long dark wavy hair, brown eyes, natural minimal makeup.` |
| 4 | Piel real | `Photorealistic real human skin with visible pores, fine peach fuzz, subtle texture and tiny imperfections; natural face asymmetry.` |
| 5 | Ojos | `Bright lively eyes with sharp catchlights and natural moisture.` |
| 6 | Cejas | `Natural eyebrows with individual visible hairs, slightly uneven and unruly.` |
| 7 | **Rasgo constante** | `She always wears small thin gold hoop earrings and a fine gold chain necklace. Something terracotta #E4714E is visible in the frame.` |
| 8 | **Luz como DEFECTO** | `Imperfect available light: strong highlights, slightly washed-out tones, uneven exposure across the frame, one side of her face brighter than the other.` |
| 9 | **Óptica de celular** | `Minor chromatic aberration at the image edges, characteristic of a modern smartphone camera with a slightly wide lens. Slight motion softness, no tripod steadiness.` |
| 10 | **Paleta** | `Color palette limited to #C89F82 #8A5A3B #E4714E #EFE7DA #D8C9B0 #B08246 #4E8C87 #2E2A26.` |
| 11 | Cierre | `Shot on iPhone, natural light, slight film grain, no beauty filter, no smoothing. Not a 3D render, not AI-looking, not plastic, not doll-like, not airbrushed. No brand logos, no text, no watermark.` |

⚠️ El bloque 11 lleva **negaciones**: funcionan en la vía `nano_banana_2` + Element. Con
`soul_2` producen lo que nombran — ahí se corta después de *"no smoothing"*.

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

## 10. Los 5 lugares (Elements `environment`, ya creados)

| Lugar | Element ID |
|---|---|
| baño mármol blanco/negro | `44a4686e-1733-4b41-811d-1eb5d1cf88fc` |
| dormitorio cozy | `6a721405-d019-48b3-b3e6-92bdf6a4474e` |
| café / cocina cálida | `5cfbdab5-3fdd-4cda-b0e3-efb60aa5a9b4` |
| vereda urbana arbolada | `cddfa484-8dea-4920-8d6b-9d00f896ae51` |
| bar nocturno terciopelo rojo | `2750ef8b-7fe6-483c-9d32-01292ce32034` |

Recordá §5: **para feed NO se usan** — el lugar se describe en texto. Estos Elements son solo
para cuando un lugar tiene que salir EXACTO (el local de un cliente).

---

## 11. Índice de archivos de Lucía — qué es cada uno

Este archivo manda. Los de abajo se conservan porque **cada uno tiene algo que no está acá**.

| Archivo | Lo único que tiene | Estado |
|---|---|---|
| `docs/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` | Los 4 pilares, los ganchos y los 6 captions escritos | Vigente |
| `docs/ONIA_LUCIA_ARRANQUE_CUENTA_20260808.md` | Qué se sube, en qué orden, destacadas, primer video | Vigente |
| `docs/ONIA_LUCIA_DIRECCION_ESTETICA_20260811.md` | Dirección estética | Vigente |
| `docs/ONIA_LUCIA_FRENTES_ANALISIS_20260806.md` | Los 4 frentes y sus gates | Vigente |
| `docs/ONIA_AUDITORIA_MARKETING_LUCIA_20260812.md` | Auditoría con evidencia por fila | Vigente |
| `docs/ONIA_CARRIL_H_LUCIA_PLAN_20260725.md` | **Los 10 guiones completos** | Archivo — se conserva por los guiones |
| `docs/ONIA_LUCIA_TANDA_A_PREFLIGHT_20260725.md` | **Tarifario verificado con `get_cost`** por acción | Archivo — se conserva por el tarifario |
| `references/models/LUCIA_GUIONES_SEMANA1.md` | Guiones de la semana 1 | Archivo |
| `references/models/LUCIA_CONTENT_SYSTEM.md` | El estándar de realismo del 9-jul | Archivo |
| `references/models/LUCIA_CONTENT_PLAN.md` | Calendario del primer mes | Archivo |
| `references/models/LUCIA_SURGICAL_FACE_LOCK.md` | Método del photoshoot quirúrgico | Archivo |
| `references/models/LUCIA_BENCHMARK_ARIA_CRUZ_20260709.md` | Benchmark de una cuenta real | Archivo |
| `references/models/lucia-elements-catalog.md` | IDs — **ya absorbidos acá** | ⛔ Superado por §2, §3 y §10 |
| `references/models/lucia-onia-identity-bible.md` | — | ⛔ **Tiene errores**: handle `@lu.antelo` marcado "LIBRE" (está ocupado) |
| ~~`MOLDE-LUCIA.md`~~ | — | 🗑️ Borrado el 13-ago, absorbido entero acá |

---

Evidencia: `prueba-motor-20260813/` (la prueba que fijó el método) ·
`INVENTARIO-caras.jpg` y `INVENTARIO-ropa.jpg` (qué imagen es cada ID) ·
`docs/ONIA_MODELOS_RECETA_VISUAL_20260806.md` (calibración de 30 imágenes).
