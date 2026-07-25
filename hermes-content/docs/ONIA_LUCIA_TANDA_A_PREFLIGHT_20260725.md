# Preflight de generación Higgsfield — Lucía vende DentalGest (Tandas A y B)

> **Fecha:** 2026-07-25 · **Carril:** H (Lucía / contenido) · **Estado:** PENDIENTE DE APROBACIÓN
> **Documento fuente del contenido:** `ONIA_CARRIL_H_LUCIA_PLAN_20260725.md` (guiones, calendario, KPI)
> **Método de identidad:** `hermes-content/references/models/AVATAR-CONSISTENCY-SCHEME.md` + `lucia-onia-identity-bible.md`

## ⛔ CERO GENERACIÓN — qué se hizo y qué NO

**NO se generó absolutamente nada. No se gastó ni un crédito.**

Todo lo que sigue se obtuvo con llamadas **read-only** o **preflight**:

| Llamada | Tipo | Gasto |
|---|---|---|
| `balance` | read-only | 0 cr |
| `models_explore` | read-only | 0 cr |
| `show_characters(action='status')` | read-only | 0 cr |
| `generate_image` / `generate_video` / `generate_audio` con **`get_cost: true`** | preflight — devuelve el precio, **no encola job** | 0 cr |

Los costos de este documento **no son estimaciones ni historial**: son la respuesta literal del
motor de precios de Higgsfield para los parámetros exactos que se van a usar (9:16, duración,
resolución, modelo). El único paso que gasta es la aprobación explícita de Sergio.

---

## 1. Balance actual (verificado 2026-07-25)

| Dato | Valor |
|---|---|
| **Créditos disponibles** | **2.351,82 cr** |
| Plan | Ultra (3.000 cr/mes, costo interno Bs 1.365/mes → **1 cr ≈ Bs 0,455 ≈ USD 0,065**) |
| Soul de Lucía `36305a9b-af24-4390-959b-885082dddd5d` | ✅ `status: ready` — verificado vivo hoy |
| Tope duro por tanda (regla del plan) | 350 cr |

El cupo es **compartido** con los otros carriles (ciencia-cuerpo, radar IA, Nuvia). Por eso cada
tanda se aprueba aparte aunque el plan ya esté pagado.

---

## 2. Tarifario verificado — precio real por acción (`get_cost: true`)

Cada fila fue consultada con los parámetros exactos de producción (9:16 vertical).

| Acción | Modelo + params | **Costo verificado** | Nota |
|---|---|---|---|
| **Imagen de Lucía (Soul)** | `soul_2` + `soul_id 36305a9b` · 9:16 · quality `2k` | **0,12 cr** | Método canónico de la cara. El más barato con diferencia. |
| Imagen expresión fuerte / realismo máx. | `nano_banana_pro` · 9:16 · `1k` o `2k` | **2,00 cr** | Mismo precio en 1k y 2k (verificado). Ver §6, decisión pendiente. |
| **B-roll 5s — mejor precio** | `kling2_6` · 9:16 · 5s · **`sound: false`** | **5,00 cr** | 🔻 **Hallazgo: 33% más barato que lo presupuestado.** |
| B-roll 5s con audio nativo | `kling2_6` · 9:16 · 5s · `sound: true` | 10,00 cr | Inútil acá: la voz va aparte (VO de Lucía). **Apagar el audio siempre.** |
| B-roll 5s turbo | `kling3_0_turbo` · 9:16 · 720p · 5s | 7,50 cr | Más caro que `kling2_6` mudo. Sin ventaja para este uso. |
| B-roll con emoción marcada | `minimax_hailuo` · 9:16 | 6,00 cr | ⚠️ **Duración mínima real = 6s**, no 5s (el motor sube 5→6 solo). |
| **Voz — reel completo (~30s de guion)** | `seed_audio` · voice element `8de5db95` | **3,50 cr** | Guion real del día 3 medido, no estimado. |
| Voz — línea corta (2 frases) | `seed_audio` · mismo element | 0,80 cr | Para hooks/historias sueltas. |
| **Lipsync 10s** | `wan2_7` · 9:16 · 720p · 10s | **15,00 cr** | Coincide con el histórico. |
| Lipsync 5s | `wan2_7` · 9:16 · 720p · 5s | 7,50 cr | Escala lineal (1,5 cr/s). |
| Reel premium UGC 15s | `marketing_studio_video` · `ugc_direct_to_camera` · 480p · 9:16 | 52,50 cr | Opcional. Genera su propia voz → **rompe la consistencia de voz de Lucía**. |

### Correcciones al presupuesto del plan

1. **B-roll: el plan asumía 7,5-10 cr/clip. El precio real es 5,00 cr** usando `kling2_6` con
   `sound: false`. Ahorro de 5-10 cr por tanda. **Regla: b-roll SIEMPRE con audio apagado** —
   la voz de Lucía se monta en edición, el audio nativo del modelo solo encarece y estorba.
2. **`minimax_hailuo` no hace clips de 5s** — su mínimo es 6s (6 cr). Si el corte pide exactamente
   5s, se usa `kling2_6`; `minimax_hailuo` queda para el clip que necesite reacción facial marcada.
3. **Marketing Studio (52,5 cr) tiene un costo oculto no monetario:** genera su propia voz, lo que
   contradice la regla "siempre la misma voz `8de5db95`" del plan. Recomendación: **descartarlo**
   para esta tanda, no por precio sino por consistencia de marca.

---

## 3. Assets a generar — prompts exactos

### Bloque de identidad + realismo (se concatena a TODOS los prompts de imagen)

```
Dark wavy shoulder-length hair parted in the middle, warm olive skin, prominent freckles
across nose and cheeks, brown almond eyes with sharp catchlights, thick natural eyebrows
with individual visible hairs slightly unruly, full natural lips, small gold hoop earrings,
26 years old, minimal makeup. Ultra-realistic candid photo, shot on iPhone, soft even
diffused daylight, slight film grain, no beauty filter, no smoothing, real human skin with
visible pores and peach fuzz, natural face asymmetry. Poreless smooth forehead, zero
wrinkles, zero fine lines, zero creases. Not a 3D render, not AI-looking, not plastic, not
doll-like, not airbrushed. No brand logos, unbranded clothing, no text, no watermark, no
on-screen UI, no phone screens visible.
```

> **Por qué cada negativo:** "smooth forehead" evita el artefacto de arrugas documentado por
> Sergio (2026-07-06); "no brand logos" evita que el modelo invente un logo real (pasó con Nike);
> "no text / no UI" evita que meta pantallas falsas de sistema — las pantallas de DentalGest son
> **capturas reales rotuladas**, nunca generadas.

---

### 📅 Día 1 — Portada del carrusel "Soy Lucía. No existo." (1 imagen)

| # | ID | Modelo | Encuadre | Costo |
|---|---|---|---|---|
| **D1-01** | portada carrusel | `soul_2` + `36305a9b` · 9:16 · 2k | Medio cuerpo (cintura arriba), centrada, **espacio vacío en el tercio superior** para el texto grande | 0,12 cr |

**Prompt (inglés):**
```
Half-body vertical portrait of a young woman standing in a bright modern home office with a
plain warm off-white wall behind her, looking straight into the camera with a calm confident
soft closed-lip smile, arms relaxed at her sides, wearing a simple unbranded cream ribbed
knit top. Composition leaves generous empty wall space in the upper third of the frame.
[+ BLOQUE DE IDENTIDAD + REALISMO]
```
**Por qué así:** el hook lleva texto grande arriba ("Soy Lucía. No existo. Y vengo a venderte
algo real."); si la cabeza ocupa el tercio superior, el texto la tapa. Sonrisa cerrada suave =
zona segura de `soul_2` (las expresiones fuertes son las que meten arrugas).

---

### 📅 Día 3 — TANDA A · "30 de septiembre. Anotalo." (2 imágenes + 2 b-roll)

Tema: fecha límite de facturación en línea. Tono: seria, informativa, honesta (dice que el portal
del SIN es gratis). Vestuario: **clean girl / oficina en casa**.

| # | Asset | Modelo | Encuadre | Costo |
|---|---|---|---|---|
| **A-01** | Still hook — escritorio | `soul_2` + `36305a9b` · 9:16 · 2k | Medio cuerpo sentada, escritorio, ¾ hacia cámara, expresión seria-cercana | 0,12 cr |
| **A-02** | Still "hablando" — **ancla de dientes** | `soul_2` + `36305a9b` · 9:16 · 2k | Pecho arriba (chest-up), frontal, **sonrisa ABIERTA con dientes visibles** | 0,12 cr |
| **A-03** | B-roll 5s (desde A-01) | `kling2_6` · 9:16 · 5s · `sound:false` | Movimiento sutil: asiente y mira a cámara | 5,00 cr |
| **A-04** | B-roll 5s (desde A-01 o toma nueva) | `kling2_6` · 9:16 · 5s · `sound:false` | Manos marcando una fecha en calendario de pared / agenda | 5,00 cr |
| **A-05** | Voz VO — guion completo día 3 | `seed_audio` element `8de5db95` | ~30s español boliviano | 3,50 cr |

**Prompt A-01 (inglés):**
```
Half-body shot of a young woman sitting at a tidy home-office desk with a closed laptop and a
small plant, turned three-quarters toward the camera, looking directly at the lens with a
serious, warm, straightforward expression, lips closed, wearing an unbranded cream ribbed
knit top. Soft daylight from a window on her left, neutral blurred wall behind.
[+ BLOQUE DE IDENTIDAD + REALISMO]
```

**Prompt A-02 (inglés) — ancla de dientes, NO omitir la sonrisa abierta:**
```
Chest-up frontal shot of a young woman in a bright home office, looking straight into the
camera, speaking mid-sentence with a genuine open smile showing her upper teeth clearly,
relaxed friendly energy, wearing an unbranded cream ribbed knit top, plain warm off-white
wall softly blurred behind her, soft even frontal daylight.
[+ BLOQUE DE IDENTIDAD + REALISMO]
```
> ⚠️ **Regla dura (`AVATAR-CONSISTENCY-SCHEME.md`):** `wan2_7` recibe UN solo `start_image` y no
> tiene rol separado de "dental lock". Si el still de arranque tiene la boca cerrada, el modelo
> **inventa los dientes en cada frame** y cambian de forma al hablar. Este still es el único ancla
> dental del clip: **sonrisa abierta con dientes visibles o el lipsync se descarta.**

**Prompt A-03 (b-roll, inglés):** `start_image` = A-01.
```
Subtle natural motion: she nods once slowly and keeps eye contact with the camera, small
breathing movement, hair settles naturally. Static locked-off camera, no zoom, no cuts.
```

**Prompt A-04 (b-roll, inglés):** `start_image` = A-01 (o still propio).
```
She reaches out and circles a date on a wall calendar with a pen, then lowers her hand.
Natural unhurried motion, static camera, shallow depth of field.
```

**A-05 — texto de voz (español, literal del guion del día 3):** hook + desarrollo + CTA tal como
están en `ONIA_CARRIL_H_LUCIA_PLAN_20260725.md` §2 día 3. Medido en el preflight: **3,50 cr**.

---

### 📅 Día 7 — TANDA B · "Todo en este video es IA. Menos una cosa." (2 imágenes + 2 b-roll)

Tema: meta-AI. **Encuadres y ambiente deliberadamente distintos a la Tanda A** (si se repiten,
las dos piezas se leen como la misma y el feed se ve pobre). Vestuario: **casual streetwear /
loungewear**, ambiente hogareño o café.

| # | Asset | Modelo | Encuadre | Costo |
|---|---|---|---|---|
| **B-01** | Still hook — ambiente cálido | `soul_2` + `36305a9b` · 9:16 · 2k | ¾ perfil, sentada en café/living, luz de ventana lateral | 0,12 cr |
| **B-02** | Still "hablando" — **ancla de dientes** | `soul_2` + `36305a9b` · 9:16 · 2k | Medio cuerpo de pie, frontal, **sonrisa abierta con dientes**, fondo distinto a A-02 | 0,12 cr |
| **B-03** | B-roll 5s (desde B-01) | `kling2_6` · 9:16 · 5s · `sound:false` | Ella toma la taza, sonríe, mira a cámara | 5,00 cr |
| **B-04** | B-roll 5s (desde B-02) | `kling2_6` · 9:16 · 5s · `sound:false` | Camina hacia cámara y se detiene, gesto natural con la mano | 5,00 cr |
| **B-05** | Voz VO — guion completo día 7 | `seed_audio` element `8de5db95` | ~30s español boliviano | 3,50 cr |

**Prompt B-01 (inglés):**
```
Three-quarter medium shot of a young woman sitting at a warm wooden table in a cozy
daylight-filled cafe, one hand around a plain ceramic mug, turned slightly away and glancing
back toward the camera with a relaxed thoughtful half-smile, wearing a plain unbranded white
t-shirt and blue jeans. Soft window light from the side, warm blurred cafe interior behind.
[+ BLOQUE DE IDENTIDAD + REALISMO]
```

**Prompt B-02 (inglés) — ancla de dientes:**
```
Half-body frontal shot of a young woman standing in a warm cozy living room with a sofa and
plants softly blurred behind her, looking straight into the camera, speaking mid-sentence
with a genuine open smile showing her upper teeth clearly, one hand gesturing naturally at
chest height, wearing a plain unbranded cream loungewear sweater. Soft even daylight.
[+ BLOQUE DE IDENTIDAD + REALISMO]
```

**Prompt B-03 (b-roll):** `start_image` = B-01.
```
She lifts the mug, takes a small sip, sets it down and smiles softly toward the camera.
Natural relaxed motion, static camera, no cuts.
```

**Prompt B-04 (b-roll):** `start_image` = B-02.
```
She takes two small steps toward the camera and stops, making a light natural hand gesture
while keeping eye contact. Static camera, no zoom.
```

> **Nota de guion / riesgo legal (regla dura del carril):** Lucía **presenta y demuestra**, nunca
> dice "yo uso DentalGest" ni afirma ser paciente/clienta. Las pantallas del sistema van como
> **capturas reales rotuladas "simulación con datos de demo"**, nunca generadas por IA. Ninguna
> cifra de cliente ni testimonio se inventa. Etiqueta "Contenido creado con IA" en el 100% de las
> piezas (toggle de plataforma + línea en caption).

---

## 4. Costo por tanda — los 2 escenarios, con números verificados

### Escenario (a) — MÍNIMO: b-roll + voz en off, sin lipsync

Lucía aparece en movimiento; su voz va como VO por encima. Ya validado; nada habla a cámara.

| Concepto | Cantidad | Unitario | Subtotal |
|---|---|---|---|
| **Día 1** — portada Soul | 1 | 0,12 | **0,12 cr** |
| **Tanda A** — stills Soul | 2 | 0,12 | 0,24 |
| **Tanda A** — b-roll `kling2_6` mudo 5s | 2 | 5,00 | 10,00 |
| **Tanda A** — voz `seed_audio` | 1 | 3,50 | 3,50 |
| **→ Subtotal Tanda A** | | | **13,74 cr** |
| **Tanda B** — idéntica estructura | | | **13,74 cr** |
| Voces de los reels de captura (días 2, 6, 9) | 3 | 3,50 | 10,50 |
| **TOTAL escenario (a)** | | | **38,10 cr** |
| **TOTAL con buffer de retries ×1,3** | | | **≈ 49,5 cr ≈ Bs 23** |

### Escenario (b) — ESTÁNDAR: Lucía habla a cámara con lipsync

El segmento central de cada reel es lipsync real (`wan2_7`, máx 15s por clip → 2 clips de 10s
cubren los ~20s de desarrollo); el hook y el cierre siguen siendo b-roll.

| Concepto | Cantidad | Unitario | Subtotal |
|---|---|---|---|
| **Día 1** — portada Soul | 1 | 0,12 | **0,12 cr** |
| **Tanda A** — stills Soul (uno es ancla de dientes) | 2 | 0,12 | 0,24 |
| **Tanda A** — b-roll `kling2_6` mudo 5s (hook/cierre) | 1 | 5,00 | 5,00 |
| **Tanda A** — voz `seed_audio` | 1 | 3,50 | 3,50 |
| **Tanda A** — lipsync `wan2_7` 10s | 2 | 15,00 | 30,00 |
| **→ Subtotal Tanda A** | | | **38,74 cr** |
| **Tanda B** — idéntica estructura | | | **38,74 cr** |
| Voces de los reels de captura (días 2, 6, 9) | 3 | 3,50 | 10,50 |
| **TOTAL escenario (b)** | | | **88,10 cr** |
| **TOTAL con buffer de retries ×1,3** | | | **≈ 114,5 cr ≈ Bs 52** |

### Verificación contra el tope duro de 350 cr/tanda

| Tanda | Escenario (a) | Escenario (b) | Con buffer ×1,3 (peor caso) | Tope | ✅ |
|---|---|---|---|---|---|
| **Tanda A** | 13,74 cr | 38,74 cr | **50,4 cr** | 350 cr | ✅ **14% del tope** |
| **Tanda B** | 13,74 cr | 38,74 cr | **50,4 cr** | 350 cr | ✅ **14% del tope** |

**Ambas tandas quedan holgadamente bajo el tope en los dos escenarios.** Ni siquiera sumando las
dos tandas + el día 1 + las voces de captura + buffer (≈114,5 cr) se llega a un tercio del tope de
UNA tanda. Impacto sobre el balance de 2.351,82 cr: **el escenario más caro consume 4,9% del saldo.**

### Comparativa práctica

| | (a) Mínimo | (b) Estándar |
|---|---|---|
| Costo total con buffer | ≈ 49,5 cr (Bs 23) | ≈ 114,5 cr (Bs 52) |
| **Diferencia** | — | **+65 cr ≈ +Bs 30 por las 2 piezas** |
| Lucía habla a cámara | ❌ solo VO | ✅ lipsync real |
| Riesgo técnico | Bajo (ya validado) | Medio (depende del ancla de dientes) |
| Retención esperada | Menor | Mayor (cara hablando retiene más) |
| Piezas de riesgo | 0 | 4 clips `wan2_7` a 15 cr c/u |

**Lectura:** la diferencia entre los dos escenarios es de **Bs 30 en total**, sobre un plan ya
pagado. El costo no es el criterio de decisión aquí — el criterio es el riesgo de calidad del
lipsync. Y ese riesgo se controla enteramente con el gate de QA de la §5: **si el still no pasa,
no se gasta un solo crédito de video.** Por eso la recomendación es **(b) estándar**, ejecutado en
dos pasos con aprobación de Sergio en el medio.

**Opción premium — Marketing Studio `ugc_direct_to_camera` (52,5 cr/reel): NO recomendada.**
No por precio, sino porque genera su propia voz y rompe la regla de consistencia de voz
(`8de5db95` siempre). Se documenta el costo por si Sergio la quiere igual.

---

## 5. Riesgo de consistencia — cómo verificamos la cara ANTES de gastar en video

**El riesgo real:** un clip de b-roll cuesta 5 cr y uno de lipsync 15 cr; un still cuesta **0,12 cr**.
Generar video sobre un still con la cara mal es tirar entre 40 y 125 veces el costo de haberlo
revisado. El histórico del proyecto ya tiene el caso: un Soul contaminado con la foto de otra
mujer costó 25 cr de reentrenamiento más todo lo generado encima.

### Gate obligatorio — orden estricto, sin excepciones

```
1. Generar SOLO los 4-5 stills (0,12 cr c/u = 0,60 cr la ronda completa)
                    ↓
2. QA visual contra la referencia canónica  ← GRATIS
                    ↓
3. Contact sheet → Sergio aprueba/descarta  ← GRATIS
                    ↓
4. Recién con still APROBADO: gastar en b-roll (5 cr) y lipsync (15 cr)
```

**La ronda entera de stills cuesta 0,60 cr — menos del 12% de UN clip de b-roll.** Regenerar un
still fallado es económicamente irrelevante; regenerar un clip no.

### Referencias canónicas de QA (ambas existen y están verificadas en el worktree)

| Referencia | Ruta | Rol |
|---|---|---|
| **Shoot quirúrgico — aprobado explícitamente por Sergio** ("ahora está perfecta") | `hermes-content/references/models/lucia-surgical-shoot-20260707/` (10 tomas + `contact-sheet.png`) | **Comparador principal** — cubre frontal neutral / sonrisa suave / sonrisa grande / perfiles / ¾ / detalle nariz / detalle oreja / cuerpo entero |
| **Ground truth real** (frames del video real, no generados) | `hermes-content/references/models/pecas-clean-v2/*.png` (18 frames) | **Árbitro final** ante cualquier duda — es la persona real, no una generación |

### Checklist de QA — 7 puntos, se descarta si falla UNO

| # | Rasgo | Qué mirar | Falla típica documentada |
|---|---|---|---|
| 1 | **Pecas** | Nariz y mejillas, marcadas | El modelo "limpia" la piel y las borra |
| 2 | **Cejas** | Gruesas, oscuras, pelos individuales visibles, algo despeinadas | Salen dibujadas/uniformes |
| 3 | **Ojos** | Marrones almendrados, catchlight nítido | Ojos apagados = look AI |
| 4 | **Labios** | Llenos naturales, sin relleno artificial | — |
| 5 | **Pelo** | Castaño oscuro ondulado, raya al medio, largo medio | Cambia de largo entre tomas |
| 6 | **⚠️ FRENTE** | **Lisa, cero arrugas** | **Artefacto conocido de `soul_2`** — Sergio lo detectó; se dispara con expresiones fuertes (cejas levantadas) |
| 7 | **⚠️ DIENTES** (solo stills ancla A-02 / B-02) | Sonrisa **abierta**, dientes superiores visibles y nítidos | Boca cerrada → el lipsync inventa dientes distintos en cada frame |

### Reglas duras que acompañan al gate

1. **Nunca encadenar generado sobre generado para identidad.** El `start_image` de todo video sale
   de un still `soul_2` aprobado — jamás de un frame extraído de otro video.
2. **Elegir por ID exacto, nunca por nombre** en la librería de Higgsfield: `36305a9b-af24-4390-959b-885082dddd5d`.
   Hay assets contaminados vivos en la cuenta (Element `44622145` es **otra persona** — nunca usar).
3. **Si un still falla el QA, se descarta y se regenera el still.** Prohibido "arreglarlo" en el
   video: la deriva se compone, no se corrige.
4. **Nada se publica sin OK explícito de Sergio.**

### Riesgo residual y su mitigación

| Riesgo | Probabilidad | Mitigación | Costo si ocurre |
|---|---|---|---|
| Arrugas de frente en el still | Media (documentada) | Encuadre medio + luz difusa + negativo explícito; expresiones calmas | 0,12 cr (regenerar) |
| Dientes inconsistentes en lipsync | Media-alta si el ancla falla | Punto 7 del checklist, bloqueante | 15 cr (regenerar clip) |
| Look "muy AI" | Media | Ver §6 — decisión pendiente | 0,12 → 2 cr por imagen |
| Deriva de identidad entre tandas | Baja | Mismo `soul_id` + mismo checklist en A y B | 0,12 cr |
| Logo de marca inventado en la ropa | Baja-media (ocurrió) | "no brand logos, unbranded clothing" en todos los prompts + revisar en QA | 0,12 cr |

---

## 6. ⚠️ Decisión pendiente — conflicto documentado entre dos fuentes internas

Hay que resolver esto **antes** de generar, y es la única decisión técnica real de la tanda.

| Fuente | Fecha | Qué dice |
|---|---|---|
| `AVATAR-CONSISTENCY-SCHEME.md` v3 + regla del carril H | 2026-07-06 | La cara de Lucía **solo** con `soul_2` + Soul `36305a9b` + texto. **0,12 cr.** |
| `lucia-onia-identity-bible.md` §"Estándar de realismo" + `LUCIA_CONTENT_SYSTEM.md` §4b | **2026-07-09 (posterior)** | Sergio reportó que las fotos "se veían muy AI". Fix elegido por él: `nano_banana_pro` + ancla `ced20cc2` (frame **real**) + prompt de realismo + 2k. **2 cr.** |

Este documento sigue la **regla dura del carril (Soul `36305a9b`)** en todos los prompts de arriba,
pero deja el conflicto explícito porque la fuente más nueva lo contradice y la escribió el propio
feedback de Sergio.

**Costo de la alternativa — irrelevante:**

| Opción | 5 imágenes (día 1 + A + B) | Delta |
|---|---|---|
| Todo `soul_2` (regla del carril) | 5 × 0,12 = **0,60 cr** | — |
| Todo `nano_banana_pro` + ancla real (estándar de realismo) | 5 × 2,00 = **10,00 cr** | **+9,40 cr ≈ +Bs 4,3** |

**Recomendación — híbrido, y es la opción sensata:** generar la ronda con `soul_2` (0,60 cr),
pasarla por el QA de la §5 y mostrarla a Sergio. **Si alguna lee "muy AI" o sale con frente
arrugada, regenerar solo esa con `nano_banana_pro` + `ced20cc2` (2 cr).** El techo absoluto del
plan B completo es 10 cr — Bs 4,3. Discutir esto en abstracto cuesta más que probarlo.

---

## 7. Qué falta decidir — checklist para Sergio (un solo mensaje)

| # | Decisión | Opciones | Recomendación |
|---|---|---|---|
| 1 | **Escenario de producción** | (a) mínimo ≈49,5 cr · (b) estándar con lipsync ≈114,5 cr | **(b)** — +Bs 30 por las 2 piezas, con gate de QA que corta el gasto antes del video |
| 2 | **Método de imagen** (§6) | `soul_2` 0,12 cr · `nano_banana_pro`+ancla real 2 cr · híbrido | **Híbrido**: `soul_2` primero, upgrade solo lo que falle el QA |
| 3 | **Marketing Studio premium** (52,5 cr) | sí / no | **No** — genera voz propia y rompe la consistencia de voz |
| 4 | **¿Aprobar Tanda A y B juntas, o A primero?** | juntas / A y decidir B con los datos de semana 1 | **A primero** — el plan ya marca la Tanda B como recortable si las piezas de captura convierten igual |
| 5 | **Fecha de arranque** | propuesta del plan: lun 28-jul (día 1) → Tanda A mié 30-jul → Tanda B mar 05-ago | confirmar |

**Con el OK de estos 5 puntos se ejecuta así:** primero la ronda de stills (0,60 cr) → contact
sheet a Sergio → recién con su aprobación se gastan los créditos de video. **Ningún crédito de
video se toca sin que la cara esté aprobada.**

---

## Anexo — IDs verificados (copiar de acá, nunca elegir por nombre)

| Uso | ID | Estado |
|---|---|---|
| **Soul de Lucía (cara)** | `36305a9b-af24-4390-959b-885082dddd5d` | ✅ `ready`, verificado 2026-07-25 |
| **Voz de Lucía** (`seed_audio`, `voice_type: element`) | `8de5db95-e898-46a6-bb68-26d02f311686` | Voz canónica del plan. Pasar el UUID **completo** (los docs viejos lo tienen truncado → "Voice not found") |
| Ancla real para realismo / QA (opción §6) | `ced20cc2-3388-4d98-92ee-b0fcd961aa62` | Frame real escalado |
| ⛔ **Element CONTAMINADO — NO USAR** | `44622145-b648-4839-85f3-d8fdb7047b19` | Es **otra persona**. Sigue vivo en la cuenta |
| ⛔ Legacy, no usar | `de586dbb-0cdd-4ca2-aaac-173d11741c86` | Foto ya generada (1 paso de deriva) |

---

*Preflight ejecutado con `get_cost: true` y llamadas read-only el 2026-07-25. Cero créditos gastados.*
