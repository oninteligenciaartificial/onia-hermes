# LUCÍA — archivo único

> **Este archivo manda.** Todo lo que se decide sobre Lucía se escribe acá. Si otro doc dice
> algo distinto, gana este. Última edición: 2026-08-20.
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

**Corrección (15-ago):** las argollas **ya estaban** documentadas como accesorio de identidad en
el face lock — no las inventé acá, las rescaté. Y el face lock nombra algo más fuerte que
cualquier accesorio: **las pecas de nariz y mejillas, que NUNCA se limpian.** Ese es su rasgo
distintivo real, y a diferencia de unas gafas no se puede perder ni cambiar de outfit.

Orden entonces: **pecas (inamovible) → oro (accesorio) → terracota (dirección de arte).** Las
tres juntas son la firma. Si alguna vez querés un objeto raro tipo gafas amarillas, exige
regenerar el banco entero (~30 imágenes, ~45 cr) y es decisión tuya.

## 1-quater. Paleta hex fija — va en TODOS los prompts

```
PIEL Y PELO     #C89F82 piel tostada · #8A5A3B pelo castaño · #5C3A24 ojos
SU ACENTO       #E4714E terracota · #C4552F terracota quemada
VESTUARIO       #EFE7DA crema · #D8C9B0 beige lino · #F4F1EC blanco roto · #6E7A5E oliva apagado
SANTA CRUZ      #B08246 ocre gastado · #4E8C87 turquesa descascarado · #2E2A26 sombra cálida
```

⛔ `#00D26A` (verde ONIA) **no entra** en sus piezas.

## 2. ✅ DECIDIDO — El ancla de la cara (Sergio, 2026-08-15)

**Mirá `INVENTARIO-caras.jpg`, acá al lado.** Son las 6 caras de Lucía que hay en la cuenta,
en ese orden.

| Pos. | Element ID | Nombre | Qué es | Veredicto |
|---|---|---|---|---|
| **1** | `452d8375-fb67-4df7-9ae0-8f1b257aa51f` | `lucia-ancla-2026-08` | Selfie de espejo, argolla de oro. Generada | ✅ **Ganó la prueba del 13-ago: 1er y 2do puesto** de 5 |
| **2** | `902eeebb-89e9-4477-8426-c555b20f7ecc` | `lucia-surgical-anchor` | Photoshoot fondo blanco, sonrisa | ✅ La aprobaste el 7-jul. Salió 3ra |
| **3** | `ced20cc2-3388-4d98-92ee-b0fcd961aa62` | `lucia-face-real-anchor` | Frame REAL del video, escalado 2K | ✅ **Verdad de terreno para QA.** No generar con ella |
| 4 | `d5e323ef-4d0e-41bf-863e-ec30aede20ae` | `LUCIA-REAL-v2-clean` | Otro frame del MISMO video | ⛔ **FUERA** |
| 5 | `de586dbb-0cdd-4ca2-aaac-173d11741c86` | `lucia-face-element` | Otro frame del mismo video | ⛔ **FUERA** |
| 6 | `fdf4b740-829e-4923-9325-76914539ac0a` | `Lucia ONIA v1` | Selfie de baño, generada | ⛔ **FUERA** |

> **Sergio, 2026-08-15, viendo las cuatro juntas: *"esas no se usan, no son consistentes."***
> Quedan **1 para generar y 2 de respaldo**. Las posiciones 3, 4, 5 y 6 salen — incluida
> `ced20cc2`, que hasta hoy era la referencia de QA.

Las 3, 4 y 5 eran frames del mismo video real: de ahí salían las mejillas rojas, y por eso el
Soul entrenado con ellas produce piel enrojecida.

### Tres cosas distintas que se venían confundiendo

Sacar `ced20cc2` dejó un hueco de QA. Lo llena el stack de rasgos, que ya existía y nadie
estaba usando como tal. **Son tres roles separados y ninguno reemplaza al otro:**

| Rol | Qué es | Dónde vive |
|---|---|---|
| **RASGOS** — qué cara es | Photoshoot de **10 ángulos** sobre fondo blanco: frontal neutro, media sonrisa, sonrisa completa, 2 perfiles, 2 tres cuartos, detalle de nariz, detalle de oreja, cuerpo entero | `STACK-rasgos-10-angulos.jpg` · fuente en `references/models/lucia-surgical-shoot-20260707/` |
| **ANCLA** — con qué se genera | El Element que va en el prompt | `452d8375` (ganó la prueba del 13-ago) |
| **RESPALDO** | Si el ancla falla en un encuadre | `902eeebb` (sale del shot 03 de ese mismo stack) |

**El stack NO se usa para generar.** Se usa para responder "¿es ella?" cuando se aprueba una
pieza. Es la vara, no el molde.

### Los rasgos sagrados (del face lock, no se negocian)

Pelo castaño oscuro ondulado, raya al medio · piel cálida oliva con textura real ·
**pecas marcadas en nariz y mejillas — NUNCA se limpian ni se suavizan** · ojos marrones
almendrados · cejas gruesas oscuras naturales · labios llenos naturales · **argollas doradas
chicas** · nariz y orejas con la forma exacta de la referencia, sin adelgazar ni redibujar.

### Y baja la exposición del §9

Toda la identidad colgaba de frames de una persona real sin permiso documentado. Al salir esos
Elements, el canon pasa a ser material **generado y aprobado**. No resuelve la pregunta del §9
—el ancla nació de ahí— pero achica el problema.

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

### ✅ Cuáles entran al feed (Sergio, 2026-08-15)

**Base: `cleangirl`.** Es el look con el que se la reconoce y el que sostiene el contenido de
trabajo.

Y como **también hace lifestyle**, entran dos más que ya existen y no hay que producir:

| Look | Para qué | Element ID |
|---|---|---|
| **cleangirl** | La base. Trabajo, demos, hablar de la plataforma | `cac118e1-…` |
| **streetwear** | Lifestyle en la calle: mercado, vereda, café | `db9608fd-…` |
| **loungewear** | Lifestyle en casa: mañana, escritorio, mate | `23135bd8-…` |
| ~~nightout~~ | — | 🗄 reserva, no al feed |
| ~~gym~~ | — | 🗄 reserva, no al feed |

**No hace falta generar ni stackear ropa nueva.** Los 5 son turnarounds de 3 vistas sin marca;
con tres rotando alcanza para meses. El hueco real no es vestuario: son **los lugares** (§10),
que no son Santa Cruz.

<details><summary>Análisis previo (histórico)</summary>

- **A — las 5.** Máxima variedad. Riesgo: el vestido negro y el gym la corren de "dueña de
  negocio que muestra software" a lifestyle genérico.
- **B — 3 de trabajo: cleangirl, streetwear, loungewear.** Es la que vende software: se la ve
  trabajando, no posando. Deja gym y nightout para historias sueltas.
- **C — 4: cleangirl, streetwear, gym, nightout.** Saca loungewear (se parece mucho a cleangirl
  en cámara: los dos son crema de punto).

**Recomiendo B.** Su trabajo es que un dentista de Santa Cruz la crea. El vestido negro de
noche no aporta a eso y el gym compite con mil cuentas de fitness.

</details>

---

## 3-bis. ✅ La voz — **Marcela**, decidida el 2026-08-15

> 🔄 **Actualizado el 2026-08-18.** Esta sección decía que la oficial era `Lucia-ONIA` y que
> `86V9x9hr…` estaba truncado y no debía usarse. **Las dos cosas quedaron superadas** por la
> decisión de Sergio del 15-ago, que nunca se reflejó acá. Se corrige con tres pruebas, no con
> opinión.

| | |
|---|---|
| **Nombre** | `Marcela - Colombian Girl` |
| **voice_id** | **`86V9x9hrQds83qf7zaGn`** (ElevenLabs, professional, es-LATAM colombiano) |
| Modelo | `eleven_multilingual_v2` |
| En el VPS | `/root/.hermes/.env` → `LUCIA_ELEVENLABS_VOICE_ID` |

**Las tres pruebas de que ésta es la vigente:**

1. **Sergio la eligió el 15-ago** — `prueba-lipsync-20260815/LEEME.md:83`: *"Sergio eligió
   Marcela… `Lucia-ONIA` queda descartada."*
2. **Es la que está cargada en producción**: `LUCIA_ELEVENLABS_VOICE_ID=86V9x9hrQds83qf7zaGn`
   en el `.env` del VPS, verificado el 18-ago.
3. **Responde en la API de ElevenLabs** y genera audio — probado el 18-ago. El ID completo
   tiene 20 caracteres; **lo que fallaba era la versión truncada que circulaba en los docs**,
   no el ID.

### ⚠️ Los otros dos IDs — qué son y por qué NO van

| ID | Qué es | Veredicto |
|---|---|---|
| `wrXs6GqcC7X03dDKMoeT` | `Lucia-ONIA`, Voice Design de ElevenLabs. **Sigue existiendo** en la cuenta | ⛔ **descartada por Sergio el 15-ago.** No borrarla, pero no usarla |
| `8de5db95-e898-46a6-bb68-26d02f311686` | Higgsfield `seed_audio`, clonada del preset Isabella | 🟡 **no es de ElevenLabs.** Pasárselo a ElevenLabs da error |

### 🔄 Lipsync — corregido el 2026-08-18

**Lo que decía esta sección:** que `wan2_7` no sirve, y que los modelos que generan su propia
voz (`kling3_0` · `veo3`) quedaban fuera para la voz de Lucía.

**Lo que se midió el 18-ago, y por qué no se contradicen:**

Son **dos mecanismos distintos** y el doc no los separaba:

| Mecanismo | Qué es | Veredicto |
|---|---|---|
| **Lipsync sobre audio externo** (`audio_references`) | pasarle NUESTRO mp3 y que sincronice | ⛔ `wan2_7` acá **es malo** — el veredicto de Sergio del 15-ago sigue en pie |
| **Habla nativa** (el modelo genera su voz) | se le da el guion en el prompt y lo dice él | ✅ `kling3_0_turbo` y `wan2_7` dicen **el guion literal en español**, verificado con Whisper |

**Por eso `kling3_0_turbo` sale de la lista negra**, pero solo por una vía concreta:

```
kling3_0_turbo (guion en español)  →  sync_so remap con el mp3 de Marcela
```

El video queda con la boca ya articulando español real, y `sync_so` la **retimea** al audio de
Marcela. Probado punta a punta el 18-ago.

⚠️ **Montar el mp3 encima sin `sync_so` NO funciona** — se probó y quedó hasta **1,4 s** fuera
de sincronía, porque el video y la voz son dos interpretaciones distintas del mismo guion.
`sync_so` cuesta **18,15 cr medidos** y no se puede evitar si la voz tiene que ser Marcela.

| Con qué voz | Costo 5 s |
|---|---:|
| La nativa del modelo | **7,50** |
| **Marcela** (kling + ElevenLabs + `sync_so`) | **~28** |

Detalle: `web-factory/docs/MODELOS_IA_QUE_USAR_PARA_QUE.md` §6.

### Cómo se usa

**B-roll (sin lipsync) — es la vía sólida.** VO con su voice_id → mp3 → se monta **encima** del
video en edición. La boca no tiene que sincronizar nada. Funciona hoy.

### ⛔ Lipsync: `wan2_7` NO sirve (Sergio, 2026-08-15)

> *"wan 2.7 es malísimo para lip sync; para video tal vez es bueno, pero para eso no."*

**De dónde venía la afirmación contraria:** `lucia-voice/README.md` (9-jul) decía que `wan2_7`
sincroniza la boca a su propia voz, redactado como hecho probado. **Se repitió sin verificar.**
El README de `avatar-lab/20260707-broll-lipsync-structure/` habla de un *"fix de dientes"* — o
sea que el problema de boca ya estaba visto y nunca se anotó como descalificatorio.

**Regla:** un doc interno no es verificación. Si dice "resuelto" sin artefacto de prueba, es
una hipótesis.

### Los modelos que SÍ aceptan nuestro audio (verificado en la cuenta, 2026-08-15)

| Modelo | Roles de media | Nota |
|---|---|---|
| `wan2_7` | start_image · end_image · **audio_references** | ⛔ descartado para lipsync |
| `grok_video_v15` | start_image · image_references · **audio_references** | 2-15 s, hasta 1080p. **Sin probar** |
| `seedance_2_0` / `_mini` | start · end · image_refs · video_refs · **audio_references** | El que ya usamos para b-roll. **Sin probar para lipsync** |

**Ninguno de los dos candidatos está probado.** Antes de prometer UGC hablando hay que correr
una toma corta con cada uno y mirar la boca. Es video: va con OK de Sergio.

### Los que generan su PROPIA voz (no sirven para la de Lucía)

`kling3_0` · `veo3` / `veo3_1` · `flux_3_video` · `gemini_omni` · **Marketing Studio**.
Todos producen audio propio y no aceptan el nuestro. Si se usa cualquiera de estos para que
hable, **no es la voz de Lucía**.

⚠️ `generate_audio` con `get_cost: true` **no valida el voice_id**: devuelve costo igual y
recién falla al generar. Preflight de costo ≠ validación de voz.

Costo medido: narración de ~50 palabras = **2,4 cr**.

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

> ⚠️ **Bloque 10 y la mitad del 8, OPCIONALES desde el 2026-08-21.** Sergio detectó que las
> imágenes salían "con un filtro de color": lo causan la paleta limitada de 8 tonos (bloque 10)
> y el *"slightly washed-out tones"* del bloque 8 — juntos producen un grade editorial fade.
> Para el feed natural de Lucía: **omitir el bloque 10** y reemplazar esa frase del 8 por
> `NATURAL TRUE-TO-LIFE COLORS, no color grading, no filter look, accurate white balance`.
> El bloque 10 queda solo para piezas que PIDEN grade (campaña, carrusel con overlay).
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

## 6-bis. Biblioteca de encuadres (2026-08-20) — se SUMA al molde, no lo reemplaza

Nueve pares **ángulo → uso comercial** leídos de un carrusel ajeno (los prompts estaban detrás
del cebo; la taxonomía no, y la taxonomía es la mitad que nadie escribe). Cada encuadre
aprobado es un **fragmento fijo** que va en el hueco `[cámara]` del molde del §6, igual que
R1–R4. **Si algo choca con el §6, gana el §6.**

| Encuadre | Uso comercial | Para Lucía | Cola de cámara (texto fijo) |
|---|---|---|---|
| **E1 eye-level** | editorial | ✅ | `Eye-level frontal shot, symmetrical composition, she looks straight into the camera, plain neutral background, 50mm` |
| **E2 high angle** | lifestyle | ✅ | `High angle from about 45 degrees above her table, she looks up at the camera, her notebook and a terracotta mug on the table, 35mm` |
| **E3 over-the-shoulder** | narrativa | ✅ | `Over-the-shoulder shot from behind her at a three-quarter angle, her back and shoulder framing the foreground, focus on the worn wooden table she is working at, 35mm` |
| **E4 wide** | campaña | ✅ | `Wide shot, her full figure small within a large interior, generous negative space around her, 35mm` |
| **E5 side profile** | perfume → acá, portadas | ✅ | `Pure 90-degree side profile, head and shoulders, against a flat saturated terracotta wall, soft even light, 85mm` |
| **E6 bird's-eye** | editorial | ✅ con QA doble | `Overhead bird's-eye view, tight framing on her face and collarbone, she lies on a plain light fabric background, 50mm` |
| extreme close-up (media cara) | belleza | ⛔ | — |
| low angle | poder / lujo | ⛔ | — |
| dutch (~15°, neón mojado) | streetwear | ⛔ | — |

Notas de uso: **E1** empalma con R2 (fondo neutro = la cara aguanta, ver regla 2). **E2/E3**
son las que muestran a Lucía *trabajando* sin nombrar pantallas — la mesa es la protagonista.
**E4** es la base para texto encima con HyperFrames; a esa distancia la cara no carga la
identidad: la cargan pelo, postura y el terracota en cuadro. **E5** se QA-ea contra los 2
perfiles del stack de 10 ángulos. **E6** lleva QA reforzada: el escorzo cenital es donde más
se deforma un rostro generado.

### Los tres que NO van, y por qué

| Encuadre | Motivo |
|---|---|
| **Extreme close-up media cara** | Es la toma que más delata al generador (regla 1). Y el uso "belleza" **ya está cubierto por R4** (§6), que es primer plano cabeza-hombros probado el 15-ago. La versión más cerrada no aporta un uso que R4 no tenga y suma el máximo riesgo. R4 queda; esto no lo reemplaza |
| **Low angle poder/lujo** | El molde entero está construido para leer "foto de celular sacada por una amiga" (bloques 8, 9 y 11 del §6). Un contrapicado con arquitectura convergiendo lee campaña de lujo — o sea humo, exactamente contra lo que Lucía dice estar (§1-bis) |
| **Dutch con neón mojado** | El neón nocturno no existe en su paleta fija (§1-quater) ni en su luz (cálida, diurna, Santa Cruz). Su streetwear aprobado es de día: mercado, vereda, café (§3). Es la misma razón por la que `nightout` quedó en reserva |

### Dos reglas que valen más que la lista

1. **El extreme close-up delata al generador.** Cuanto más cerca, más se ve lo sintético:
   poro, vello, transición pelo-piel. R4 sigue vigente porque está probado, pero **toda pieza
   R4 pasa el QA del §8 con doble atención antes de publicar** — es la toma donde más hay que
   mirar.
2. **La cara aguanta en estudio y se corre en escenario.** Fondo neutro: la estructura del
   rostro se sostiene. Escalera, calle, interior cargado: la estructura y la edad aparente se
   corren. **Cuando la escena manda más que la referencia, la cara se pierde.** Para Lucía:
   cara reconocible (primeros planos, portadas) = fondo simple (E1, E5, R2, R4); escena
   cargada = cara chica en cuadro (E4) o de espaldas (E3).

### El método del carrusel confirma el nuestro, no lo cambia

El carrusel fija primero el **canon** (retrato frontal, fondo liso) y recién después deriva
las variaciones. Es exactamente el esquema que Lucía ya tiene: ancla `452d8375` para generar
(§2) + stack de 10 ángulos como vara (§8). **Nada de este lote reemplaza al ancla: el único
método verificado de consistencia de cara sigue siendo ancla + molde §6 + QA §8.** Los
encuadres son colas de cámara, no un método nuevo.

---

## 7. Prohibido

- **Negaciones con Soul.** Escribir "sin texto, sin logos" produce texto y logos. Con la vía
  Element sí funcionan. Es la única regla que cambia según la vía.
- Las palabras `app`, `interfaz`, `story`, `pantalla`, `screenshot` — ni para prohibirlas.
- `Santa Cruz` a secas: arrastra a California. Siempre `Santa Cruz de la Sierra, Bolivia`.
- Carteles o marcas con texto legible. Si la pieza lleva texto, va encima con HyperFrames.
- **Testimonios de resultados.** Lucía nunca testimonia. No hay clientes que mostrar todavía.

## 8. QA antes de aprobar

**La vara es `STACK-rasgos-10-angulos.jpg`** — las 10 tomas de fondo blanco. Se busca el ángulo
más parecido al de la pieza y se comparan **pecas, cejas, ojos, labios, nariz y orejas**. Si no
calzan, la pieza no sale.

⚠️ **Cambió el 2026-08-15.** Antes la vara era `references/models/pecas-clean-v2/` (frames del
video real). Sergio sacó esos Elements por inconsistentes, así que el video real deja de ser
referencia; la carpeta queda como archivo histórico. **El stack de 10 ángulos ocupa ese lugar**
y es mejor vara: cubre perfiles y detalles que un frame de video no tenía.

Obligatoria pieza por pieza: saltearla fue lo que dejó pasar 11 avatares deformados.

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
| `references/models/LUCIA_SURGICAL_FACE_LOCK.md` | El método del photoshoot de 10 ángulos y los rasgos sagrados | ⚠️ El método sigue vigente; su "ancla real" (`ced20cc2`) quedó **retirada** el 15-ago |
| `references/models/pecas-clean-v2/` | 18 frames del video real | 🗃 **Archivo histórico.** Dejó de ser la vara de QA el 15-ago |
| `references/models/lucia-onia-identity-bible.md` | — | ⛔ **Tiene errores**: handle `@lu.antelo` marcado "LIBRE" (está ocupado) y ancla retirada |
| ~~`MOLDE-LUCIA.md`~~ | — | 🗑️ Borrado el 13-ago, absorbido entero acá |

---

Evidencia: `prueba-motor-20260813/` (la prueba que fijó el método) ·
`INVENTARIO-caras.jpg` y `INVENTARIO-ropa.jpg` (qué imagen es cada ID) ·
`docs/ONIA_MODELOS_RECETA_VISUAL_20260806.md` (calibración de 30 imágenes).

---

# §9. RECETA B-ROLL — cómo se hicieron los 4 videos que le encantaron a Sergio (21-ago)

> Sergio: "me encantó el resultado, haz lo mismo pero más barato y aprende cómo los hiciste."
> Esta sección ES ese aprendizaje. Para B-roll de Lucía, seguir esto al pie.

## El pipeline (2 pasos, ~6-8 cr por escena)

**PASO 1 — Imagen de escena (nano_banana_2, 2.00 cr, NO se puede abaratar):**
- Prompt = `<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>>` + molde §6, con estas líneas fijas:
  - `A casual candid snapshot of this exact woman [ACCIÓN] in [LUGAR]`
  - vestuario + `small gold hoop earrings`
  - `Natural true-to-life colors, no color grading, no filter look, accurate white balance`
  - `Shot on a phone camera, slight natural grain, [ÁNGULO], [ENCUADRE]`
  - `Her face stays identical to the reference. No beauty filter, no skin smoothing, no text anywhere`
- ⚠️ z_image (0.15 cr) NO sirve: no acepta referencia → pierde la cara. El precio de la
  identidad es 2 cr, no se negocia.
- **MIRAR la imagen antes de animar** (Read del PNG). Si la cara derivó, regenerar imagen;
  nunca "arreglar en video".

**PASO 2 — Animar (veo3_1_lite, 1 cr/segundo; duraciones 4/6/8 s):**
- `medias: [{value: <job_id de la imagen>, role: "start_image"}]`
- `declined_preset_id: "24bae836-2c4a-48e0-89b6-49fcc0b21612"` SIEMPRE (si no, el preset
  "IN THE DARK" intercepta el request)
- Prompt de video, 4 líneas fijas + 1 variable:
  1. `Natural true-to-life colors, no color grading, no filter look, accurate white balance exactly as the source image.`
  2. `Natural real-time speed, no slow motion.` ← el fix del slow motion (21-ago)
  3. [LA ACCIÓN, en ritmo normal: "at a normal everyday pace", "at real wind speed"]
  4. `Handheld micro-shake only, no camera travel.` (o `Handheld tracking backward smoothly` si camina)
  5. `Photorealistic, her face stays identical, no morphing.`

## Checklist antes de CADA generación (la regla de los 3 errores)

1. ¿Alguna palabra en MAYÚSCULAS que pueda hornearse como texto? → quitarla
2. ¿Algún "slowly/softly/gently" que el modelo lea como cámara lenta? → reemplazar por "at a normal pace"
3. ¿Alguna restricción de paleta que actúe de filtro? → fuera; color natural siempre

## Tarifa medida por clip (21-ago, todos con get_cost)

| Motor | Config | 5-6 s | Nota |
|---|---|---|---|
| **veo3_1_lite** | 720p | **4 cr (4s) / 6 cr (6s)** | EL ELEGIDO. 1 cr/s exacto |
| **seedance_2_0_mini** | **480p sin audio** | **5 cr** | el más barato por clip; 496×864, más blando |
| seedance_2_0_mini | 720p con audio | 12.5 cr | el audio+resolución duplican el precio |
| grok_video | 720p | 7.5 cr | sin probar calidad |
| kling3_0_turbo | 720p | 7.5 cr | mejor movimiento (test 21-ago), backup |
| happy_horse / grok 1.5 | — | 12.5 cr | caros para B-roll |
| flux_3_video | 720p | 27.5 cr | descartado para B-roll |

**Configuración "más barato" pedida por Sergio:** imagen 2 cr + veo lite 4 s = **6 cr/escena**
(vs 8 del test original). Alternativa mini-480p: 7 cr con cara sostenida pero 480p — para
historias sirve, para reels el 720p de veo lite rinde más por crédito.

## Reglas duras aprendidas

- **NSFW en video ≠ NSFW en imagen**: el traje de baño pasó como imagen y el modelo de VIDEO
  lo bloqueó. Playa/deporte para animar: ropa cubierta DESDE la imagen (vestido, remera).
- El costo con audio de seedance se paga aunque el reel lleve música encima: **generate_audio:
  false siempre** en B-roll (la voz va aparte, ElevenLabs).
- Verificar SIEMPRE la duración/resolución del mp4 con ffprobe al bajar.

---

# §10. UGC — selfie hablando a cámara (probado 21-ago, 14 cr total)

**Motor oficial de B-roll ratificado por Sergio: veo3_1_lite.** (El A/B contra seedance mini
480p con prompt IDÉNTICO salió lento en seedance — el modelo obedece menos el ritmo, no era
el prompt.)

## Receta UGC (2 pasos)

1. **Selfie image (nano_banana_2 + ancla, 2 cr):** "A casual handheld selfie video still of
   this exact woman holding the phone with one extended arm, talking directly to the camera
   mid-sentence, mouth slightly open as if speaking" + escena casual (cama/cocina/calle) +
   las líneas fijas de color natural y cara idéntica del §9.
2. **veo3_1_lite 8 s + `generate_audio: true` (12 cr):** el prompt lleva el DIÁLOGO entre
   comillas y el idioma: `She speaks in Latin American Spanish, warm conversational tone,
   and says: "..."` + `Her lips sync naturally with the words`. ~15-20 palabras caben en 8 s.

## Límites conocidos

- **La voz NO es la Marcela oficial** — veo inventa una voz. Para piezas donde la voz importa
  (reel de lanzamiento), la vía sigue siendo video mudo + ElevenLabs + lipsync (sync_so,
  18.15 cr). El UGC barato sirve para historias, pruebas de gancho y volumen.
- Audio nativo duplica el costo de veo lite (8 s: 8 → 12 cr).
- El diálogo generado hay que ESCUCHARLO antes de aprobar: acento y pronunciación varían.

## §10-bis. Veredicto UGC de Sergio (21-ago, noche) + LA VOZ

- **gemini_omni (24 cr): el mejor resultado** ("espectacular") — candidato, NO oficial
  todavía por costo. kling3 (16 cr): bien pero se equivoca frases y va más lento.
  veo lite (12 cr): movimientos raros al hablar.
- **NINGÚN motor de video usa la voz oficial.** ⚠️ CORREGIDO mismo día: la voz element de
  Higgsfield `8de5db95-...` ("Lucia-voz") está **DESCARTADA desde el 25-jul** — Sergio: "robótica".
  **La voz oficial es "Marcela" de ElevenLabs (`86V9x9hrQds83qf7zaGn`, colombiana es-LATAM)**,
  se genera LOCAL con `.claude/skills/editor-videos/scripts/tts-elevenlabs.mjs` (default=marcela)
  y se sube a Higgsfield con media_upload+media_confirm. El pipeline queda:
  1. Video hablado con el motor elegido (la voz nativa es descartable)
  2. `tts-elevenlabs.mjs --text "..."` → mp3 con Marcela (usa el cupo ElevenLabs, no créditos)
     ⚠️ **SIN voice_settings** (aprobado por Sergio 22-ago): los ajustes stability/style que
     el script forzaba le CAMBIABAN el timbre ("esa no es la voz"). La voz aprobada del
     casting sale con los DEFAULTS de la API — el script ya fue corregido para no forzar nada.
  3. media_upload + media_confirm del mp3 → media_id
  4. `sync_so` input_video + input_audio, probar `sync_mode: remap` (cut_off quedó desincronizado)
  1. Video hablado con el motor elegido (la voz nativa es descartable)
  2. `seed_audio` con `voice_type: element` + UUID COMPLETO de la voz (~2.4 cr)
  3. `sync_so` con `input_video` + `input_audio`, `sync_mode: cut_off` (18.15 cr)
  VID-08 (voz element, cut_off) = RECHAZADO por Sergio: voz equivocada y desincronizado.
  VID-09 (voz Marcela real, remap) = el intento corregido.
- Costo UGC completo con voz oficial: gemini 24 + voz 2.4 + sync 18.15 ≈ **45 cr por pieza**.
  Para volumen barato sin voz oficial: historias mudas con subtítulos.

## §11. LA VOZ, decidida y cerrada (22-ago, decisión de Sergio + técnica elegida por mí)

- **Voz: Marcela** (`86V9x9hrQds83qf7zaGn`, "Native Colombian", la #1 de la Voice Library
  con 96.7K usuarios). Ratificada en recasting contra las 5 finalistas.
- **Técnica de entonación: `eleven_v3` con dirección de actuación** — UNA sola llamada con
  TODA la narración (nunca por pedazos: cada llamada renderiza prosodia distinta y los
  tonos saltan) + etiquetas de dirección por frase que NO se pronuncian:
  `[intrigante]` `[cálida, sonriendo]` `[segura, conversacional]` `[cómplice]` `[entusiasta]`
- **"Onia" se escribe `Onnia` en el texto del TTS** (fonético; el subtítulo dice Onia).
- Sin voice_settings. Costo: caracteres del plan (narración ≈ 500 chars ≈ 0.7% del cupo
  mensual), CERO créditos de Higgsfield.
- Los cortes de video se recalculan a los tiempos REALES de la narración (Whisper local
  word-level + límites en el punto medio entre beats) — el audio manda, el video obedece.

---

# §12. Arquitectura de PROMPT por bloques — adoptada del lote M1 (22-ago)

> Origen: `video-intake/PROMPTS_LOTE_2026-08-22.md` (M1, carril INFLUENCERS IA, commit
> 819c84b9). Prompt recuperado literal de pantalla de un reel que rinde. Se adopta acá
> porque resuelve DOS errores que ya nos costaron generaciones: el texto horneado
> ("CLOSED" en la tapa del cuaderno) y las manos deformes.

## La regla madre: bloques con NOMBRE, y cada bloque es una REGLA, no una descripción

Los nombres en MAYÚSCULAS ENTRE CORCHETES ordenan la lectura del modelo. Molde de Lucía:

```
[IDENTIDAD]              <<<452d8375-...>>> + "this exact woman", rasgos sagrados
[CÁMARA]                 equipo REAL nombrado (ver palanca 1)
[ESCENA]                 lugar, luz, vestuario, hora del día
[COLOR RULE]             natural true-to-life colors, no grading, no filter, accurate WB
[TEXT RULE — MANDATORY]  ver palanca 2 — el arreglo del texto horneado
[HANDS RULE]             qué se ve y qué NO de las manos
[MOVIMIENTO]             solo en video: ritmo real, sin adverbios de lentitud
```

## Las tres palancas

**1 · La cámara se ESPECIFICA, no se adjetiva.** Nombrar el equipo real es más preciso que
cualquier adjetivo. Para Lucía:
- Feed casual / "foto de celular": `shot on an iPhone 15 Pro main camera, 24mm`
- Pieza cine / hero: `Arri Alexa 35 with a 35mm prime, T2.8`
- Macro de producto o detalle: `Laowa 24mm f/14 probe lens` (es EL lente de esos macros)

**2 · TEXT RULE — el arreglo del texto en IA.** En vez de pelear porque el modelo no sabe
escribir, se le prohíbe escribir. Literal del prompt fuente:
> *"They read as typographic shapes, never as language. Legibility not required at any point."*

Molde para nuestras piezas: `[TEXT RULE — MANDATORY] No legible text anywhere in frame. Any
lettering on props reads as abstract typographic shapes, never as language.`
→ Esto es lo que habría evitado el "CLOSED" horneado en la tapa del cuaderno.

**3 · SOBRECOBERTURA a propósito** (para modelos que dan 10-30 s: kling, seedance, minimax):
> *"Fast-cut montage. I am cutting it myself in post. Deliberately overload it — more shots
> than fit, extra angles I did not ask for, alternate coverage of every beat, inserts,
> overshoots, impact frames. Every beat is a new shot. Nothing holds."*

Se pide una **hoja de contactos**, no la toma exacta, y se corta en post. Multiplica lo
aprovechable por corrida — clave para bajar el costo por pieza publicada.
⚠️ NO aplica a `veo3_1_lite` (4/6/8 s: no hay lugar para sobrecobertura). Sí a la pieza
"hero" mensual, donde una sola generación larga puede rendir 4-5 planos utilizables.

## Checklist de prompt, actualizado

1. ¿Alguna palabra en MAYÚSCULAS que pueda hornearse como texto? → fuera
2. ¿Adverbio de velocidad/suavidad que se lea como cámara lenta? → "at a normal pace"
3. ¿Restricción de paleta que actúe de filtro? → fuera, color natural
4. **¿Está el `[TEXT RULE — MANDATORY]`?** → si hay props con letras, es obligatorio
5. **¿La cámara está nombrada o adjetivada?** → nombrar equipo real
6. **¿El modelo da ≥10 s?** → pedir sobrecobertura y cortar en post
