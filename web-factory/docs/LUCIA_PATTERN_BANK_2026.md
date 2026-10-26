# Lucía Pattern Bank 2026 — cómo se produce una influencer IA que vende

> Espejo de `CAROUSEL_PATTERN_BANK_2026.md`, para **video y persona IA**. Misma estructura:
> datos con fuente → el molde → catálogo → sistema visual → producción → gate → anatomía de un
> caso real → lo que falta.
>
> **Este banco dice CÓMO se produce.** Qué se publica y cuándo vive en
> `hermes-content/contenido/LUCIA.md`. Quién es ella —ancla, paleta, vestuario, voz— vive en
> `hermes-content/references/modelos/lucia/LUCIA.md`, **y ese archivo manda sobre este**.

---

## 1. Los números que mandan

| Dato | Valor | Qué implica |
|---|---|---|
| **Cuentas IA grandes que mueren** | **6 de 8** del directorio de industria están "Inactive or Discontinued" — Lu do Magalu (30M+), Lil Miquela, Imma, Aitana | Morir es la **norma**, no la excepción. El plan tiene que explicar por qué esta no |
| Seguidores vs engagement | @anora **20k → 0,55%** · @noonoouri **458k → 0,07%** | El número de seguidores es vanidad. Anora gana en vistas con 1/20 de la audiencia |
| Qué las mató | captions que son listas de créditos (`@gucci`, `@openart_ai`) | **El contenido de marca se come la cuenta.** Máx 1 de cada 10 piezas |
| Post que peor rindió del benchmark | un comunicado de texto → **4 likes** | Nunca posteos de solo texto |
| Mejor post del benchmark | *"¿Sabías que hace un año yo no existía?"* → **18.642 vistas** | El gancho meta-IA es lo más barato que tenemos, **y en Bolivia no lo usa nadie** |
| Hueco competitivo | **ninguna** cuenta combina persona IA propia + venta de UN software B2B a PyMEs | Lo más cercano es The Clueless, pero le vende a Santander y Audi |

Fuente: `references/benchmarks/anora-creators-20260806/ANALISIS.md` (medido con la API pública
de IG el 2026-08-07) · `docs/historial/ONIA_LUCIA_BENCHMARK_QUE_VENDE_20260817.md`.

## 2. El molde de una pieza (3 partes, siempre)

```
GANCHO      primeros 2 segundos, texto quemado en pantalla
   ↓
VALOR o HISTORIA completa — nada de teaser
   ↓
CIERRE      una palabra: "comentá X". Nunca "link en bio"
```

**El gancho nunca habla del producto: habla de una reacción.** Un dueño de negocio scrollea un
consejo; frena ante algo que le pasa a él.

**Formato:** 70% reel vertical · 30% carrusel. **Cadencia 3×/semana.**

## 3. Ganchos que funcionan (con su versión)

| Tipo | Versión Lucía |
|---|---|
| **Meta-IA** | *"Hace un año yo no existía."* ← el mejor medido del benchmark |
| **Meta-IA** | *"Soy la primera influencer IA de Bolivia y trabajo para una empresa cruceña."* |
| **POV** | *"POV: sos el dueño y contestás vos los WhatsApp a las 11 de la noche."* |
| **Confesión** | *"Nadie te lo dice: el 80% de tus clientes no se fue con la competencia."* |
| **Pregunta incómoda** | *"¿Cuánto tardás en contestarle a un cliente nuevo? Si decís 'depende', ahí está la fuga."* |

**Prohibido:** *"obligatorio por ley"* sobre la factura electrónica · testimoniar como usuaria
(*"yo lo uso"* — FTC) · consejo médico · inventar un cliente · esconder que es IA.

## 4. Sistema visual — la identidad NO se improvisa

Todo sale de `references/modelos/lucia/LUCIA.md`. Lo esencial para producir:

- **Ancla de cara:** un Element fijo. Nunca una foto suelta.
- **Rasgo distintivo constante:** argollas de oro finas + cadenita + algo terracota en cuadro.
  Es un ancla barata que sobrevive al cambio de escenario.
- **Paleta hex explícita**, no adjetivos. El verde de la marca Onia **no entra** en sus piezas.
- **El realismo se pide como DEFECTO, no como calidad:** aberración cromática en los bordes,
  altas luces quemadas, lente algo ancho, grano. Un prompt que pide belleza produce piel de
  plástico.
- **Oclusión parcial de la cara** (un vaso, una taza) = menos superficie donde el modelo falla.

## 5. Producción — el tarifario MEDIDO

Con `get_cost` y midiendo saldo antes/después, no estimado:

> ✅ **Actualizado el 2026-08-17 con una comparativa real** de 5 modelos de imagen y 4 de video,
> misma entrada y mismo prompt en todos. Detalle y rúbrica: `LUCIA_BANCO_DE_PRUEBAS_2026.md`.

### Video — medido, no estimado

| Para qué | Modelo | Costo |
|---|---|---|
| **Primer plano hablando en español** | **`kling3_0_turbo`** | **7,50 cr / 5 s** (1,50/s) — 🔊 habla el guion literal en español. Articulación sutil, cara estable |
| **B-roll mudo** | `veo3_1_lite` 8 s | **8 cr** (1,00/s) — el más barato por segundo, y el único que respeta `generate_audio:false` |
| Alternativa al primer plano | `wan2_7` | 7,50 cr / 5 s — mismo precio y también habla español, pero articula más marcado |
| **Encadenar sin tope** | `seedance_2_5` `video_extension` | ~12 cr / 5 s ⚠️ **devolvió 16:9 con entrada 9:16** |
| Convertir video real de cliente | `seedance_2_5` `video_edit` | por duración |
| Lipsync sobre video mudo | `sync_so`, `sync_mode: remap` | ~18 cr / 5 s — **solo si la voz nativa no sirve** |
| Voz | ElevenLabs — Marcela `86V9x9hrQds83qf7zaGn` | ~2,4 cr / 50 palabras |

### 🗣️ El diálogo en español se PIDE — y sale exacto

`wan2_7` y `kling3_0_turbo` generan el habla en el idioma que se les diga, **con el texto
literal**, si el prompt lleva el guion entre comillas:

```
She speaks in SPANISH with a Latin American (Bolivian) accent, saying clearly:
"<el guion, tal cual>" ... Spanish language audio only, no English.
```

Sin esa línea inventan habla en inglés — fue el primer error, y la corrección es una frase.

**Verificado con Whisper**, no de oído: el audio de los dos transcribió palabra por palabra el
guion. (Speaches en el VPS, modelo `Systran/faster-whisper-small`; el `distil` es solo-inglés y
traduce el español — forzar el multilingüe.)

**En español gana `kling3_0_turbo`**, no `wan2_7`: al mismo precio articula más sutil y sostiene
mejor la cara. Con habla genérica en inglés ganaba el otro; con diálogo real, no.

⚠️ **La voz oficial de Lucía sigue siendo Marcela (ElevenLabs)** según
`references/modelos/lucia/LUCIA.md`, que manda sobre este banco.

🔴 **Y montar Marcela encima NO alcanza** — se probó y quedó desincronizado hasta 1,4 s, porque
el video y la voz son dos interpretaciones distintas del mismo guion. **Para usar la voz de
Marcela hay que pagar `sync_so` igual (18,15 cr medidos).** Con voz nativa la pieza sale 7,50;
con Marcela, ~28. Detalle en `MODELOS_IA_QUE_USAR_PARA_QUE.md` §6.

### 🎬 B-roll vs UGC — no se paga identidad donde no hace falta

| | **UGC** — ella hablando | **B-roll** — sin cara conocida |
|---|---|---|
| Imagen | `nano_banana_2` + ancla · **2,00 cr** | **`z_image` · 0,15 cr** |
| Video | `kling3_0_turbo` · **7,50 / 5 s** | `veo3_1_lite` · **8,00 / 8 s** |
| **Por segundo** | **1,90 cr/s** | **1,02 cr/s** |

La imagen de b-roll cuesta **13× menos** porque no sostiene ninguna identidad. El mismo
`z_image` que falla el criterio de identidad es el correcto acá.

> **Regla: si en el plano no hace falta reconocer a Lucía, no se paga identidad.**

⚠️ **Trampa del b-roll:** toda pantalla en cuadro sale con texto inventado ilegible. Pedir
`no readable text` y encuadrar lejos — nunca un primer plano de una pantalla.

### ⛔ `seedance_2_0_mini` sale del stack para primer plano

Era la opción principal de este banco. Medido: **12,50 cr por 5 s (2,50/s) — el más caro de
los cuatro — y el único que se nota falso**: abre la boca en una "O" exagerada que nadie hace
al hablar.

**Cuesta 2,5× lo que `wan2_7` y sale peor.**

⚠️ Ese 12,50 es la salida **720p** (720×1280, medida). A **480p** el 15-ago costó **5,00 cr /
5 s** (`references/modelos/lucia/prueba-lipsync-20260815/LEEME.md`). La comparación de arriba
vale **a igual resolución** — no es que el modelo cueste 12,50 siempre.

### Imagen — medido

| Modelo | Costo | Veredicto |
|---|---:|---|
| **`nano_banana_2`** | **2,00 cr** | 🏆 identidad clavada, piel real, **1536×2752**. El default |
| `nano_banana_2_lite` | 1,00 | buena, pero **aclara el pelo**. Respaldo |
| `gpt_image_2` low | 0,50 | ensancha la cara. No para primer plano |
| `z_image` | **0,15** | ❌ **no es Lucía** · ✅ el más barato para ambientes y gente de fondo |
| `text2image_soul_v2` | 0,12 | ⚠️ **sin veredicto** — cobró, pero el job de la Fase A no volvió. El workflow oficial lo marca para UGC **con de-slop obligatorio** (sale con piel cerosa) |

**Una pieza de 32 s hablando con `kling3_0_turbo`: ~52 cr.** De b-roll: **~32 cr** mudo
(4 planos de 8 s) · **~35 cr** con la voz montada encima.

⚠️ Todo gasto de video necesita **OK explícito de Sergio, caso por caso**.

### 🔑 La firma real de la API (probada)

**Todo va dentro de `params`, incluido `model`.** No hay parámetro `model` de nivel superior:

```
✅  { params: { model: "wan2_7", prompt: "...", aspect_ratio: "9:16", duration: 5,
                medias: [{ value: "<id-imagen>", role: "start_image" }] } }
❌  { model: "wan2_7", params: {...} }   → "Invalid input at params"
```

⚠️ **`get_cost` fuera de `params` se ignora en silencio y GENERA de verdad.** Costó 1,27 cr
descubrirlo. La única medición confiable es el saldo antes/después.

⚠️ **El `<<<uuid-del-ancla>>>` va en el TEXTO del prompt**, no en `reference_elements` — varios
modelos declaran no soportar ese parámetro y aun así mantienen la cara, porque la referencia
viaja en el prompt.

⚠️ **`kling3_0_turbo` y `wan2_7` devuelven 716×1284**, no 720×1280. Y **los dos traen audio
aunque no se pida**: si la pieza lleva voz montada aparte, hay que silenciarlo o se superpone.

### ⛔ Los presets de Higgsfield no son el camino (revisado 2026-08-17)

Se recorrieron **los 60+ presets** de la galería: EARTH ZOOM · ZOMBIE DANCE · KUNG FU HIT ·
RED CARPET · 2000'S PAPARAZZI · ACTION FIGURE · CLAY FIGURINE · FOOTBALL INVADER…

**Ni uno solo sirve para vender software.** Son todos de entretenimiento viral: transformar
al sujeto en figura de acción, meterlo en un videojuego retro, ponerlo en una alfombra roja.
La galería está construida para creadores de consumo, no para B2B.

**Lo que sí deja la revisión:** los pocos presets de registro documental —CANDID PAPARAZZI,
SUMMER HAZE, NIGHT VISION, OFFICE CCTV— comparten una tesis con lo que ya sabíamos: **el
registro crudo y mal iluminado se lee como real; el pulido se lee como anuncio.** Eso ya está
en §4 pedido como defecto, y se confirma.

**Conclusión: prompt propio, nunca preset.** No volver a mirar la galería esperando encontrar
el ángulo de negocio.

### ⚠️ `video_extension` devolvió 16:9 con entrada vertical

Verificado en las generaciones del 2026-08-15: la extensión de un plano **9:16** salió en
`1280×720` — **horizontal**. La vía que esta misma sección recomienda para romper el tope de
duración **te rompe el formato**, y en silencio.

Sin resolver: si se arregla forzando `aspect_ratio` en la llamada de extensión, o si el modelo
lo ignora igual que `kling3_0`. **Confirmarlo cuesta créditos** — hacerlo en la próxima
tanda autorizada, no en una prueba aparte.

### Las tres vías de generar, y qué hace cada una de verdad

| Vía | Qué hace |
|---|---|
| `start_image` | anima UNA foto. El encuadre queda atado a esa foto |
| `image_references` | **inventa un plano nuevo** manteniendo la identidad. No copia ninguna entrada |
| `start` + `end_image` | **morph entre dos estados** — cambia el vestuario en el medio. Sirve de transición, NO de continuidad |
| `video_extension` | **continúa el mismo plano** conservando ropa y luz. Es lo que rompe el tope de duración |

## 6. Checklist antes de publicar

- [ ] ¿La cara coincide con el ancla? (comparar contra el stack de rasgos, no de memoria)
- [ ] ¿Está el rasgo distintivo en cuadro?
- [ ] ¿La paleta respeta los hex, sin el verde de Onia?
- [ ] ¿Las manos están fuera de plano o lejos de la cara? **Es donde más falla**
- [ ] ¿La etiqueta de IA está puesta? (switch nativo *"Creador de IA"* + la bio)
- [ ] ¿Cero testimonios en primera persona?
- [ ] ¿Si es escenificación, está **rotulada en pantalla**?
- [ ] ¿El lugar dice "Santa Cruz de la Sierra, Bolivia"? (solo "Santa Cruz" arrastra a California)
- [ ] ¿Aprobado por Sergio, y el gasto autorizado?

## 7. Anatomía de lo que hace que una cuenta IA VIVA

De cruzar las que murieron con la que funciona:

| Las que murieron | @anora.creators, la que funciona |
|---|---|
| Caption = lista de créditos de marca | Caption = una pregunta o una confesión |
| El producto de otro es el contenido | El personaje es el contenido |
| Fama de prensa, cero interacción | 1/20 de la audiencia, 8× el engagement |
| Nunca dicen que son IA | *"hace un año yo no existía"* es su mejor post |

**La regla que sale:** la cuenta muere cuando el contenido empieza a servirle a la marca en vez
de al que mira. Y **decir que es IA no es una concesión legal: es el gancho.**

## 8. El límite duro

**Un testimonio en primera persona no se puede fingir.** Lucía es una influencer IA declarada;
que "cuente" que tiene una pastelería y le salvó la temporada es fabricar un cliente.

Las dos variantes legítimas:
- **(a)** un cliente real que quiera contarlo, con su voz
- **(b)** **escenificación rotulada en pantalla** — *"así se vería tu día con el sistema"*

Se copia la estructura y el registro coloquial. **Nunca la biografía.**

⚠️ Esto aplica también a las **series por rubro** de `@oniahq` (decidido 2026-08-17): mostrar
el producto en una veterinaria o un comercio con escenas generadas está bien **si el rótulo
está**. Sin rótulo es un caso de éxito inventado, y en Santa Cruz el primer prospecto que
pregunte *"¿qué veterinaria?"* quema la venta y las siguientes.

## 9. 🔴 Lo que falta no es una prueba más: es la primera pieza

**Estado real al 2026-08-17: cero piezas publicables.** Lo que hay son **6 videos de prueba**
del 15-ago —ella camina, ella habla, ella mira a cámara— y **ninguno dice nada**. Son pruebas
de identidad: sirvieron para confirmar que el ancla aguanta y para medir el tarifario. No son
contenido.

Generar un séptimo video de ella caminando no enseña nada nuevo. **Lo que falta probar es la
pieza entera**: gancho + valor + cierre, con guion, montada, publicable. Recién ahí se sabe el
costo real de una pieza y si la calidad aguanta 30 segundos seguidos en vez de 5.

**La prueba que corresponde**, con el gancho mejor medido del benchmark (*"hace un año yo no
existía"* → 18.642 vistas):

| Parte | Modelo | Costo |
|---|---|---|
| 4 planos de 8 s | `veo3_1_lite` | 32 cr |
| Voz | ElevenLabs, Marcela | ~3 cr |
| **Total** | | **~35 cr** de 2.663 · **1,3% del saldo** |

Y de paso resuelve el bug del `video_extension` sin una tanda aparte.

⚠️ **Requiere OK explícito de Sergio** (regla de gasto). No se genera nada hasta tenerlo.

## 10. Lo que sigue sin resolver

| Qué | Quién |
|---|---|
| **El origen de los videos de los que sale su cara.** La regla propia dice "nunca una persona real sin consentimiento" y el material vino de más de una fuente | **solo Sergio** — y no conviene descubrirlo con la cuenta pública |
| El % del pilar informativo genérico | Sergio |
| Su handle real (el motor tiene `@lucia.antelo.oficial` hardcodeado y nadie lo confirmó) | Sergio |
| Dos captions piden palabras clave eliminadas (MODELO, CLIENTES) | yo — edición de texto |

---

**Fuentes:** `references/benchmarks/anora-creators-20260806/ANALISIS.md` ·
`docs/historial/ONIA_LUCIA_BENCHMARK_QUE_VENDE_20260817.md` ·
`references/modelos/lucia/prueba-lipsync-20260815/LEEME.md` (el tarifario medido) ·
`docs/historial/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` (los 4 pilares).

Relacionado: **`LUCIA_BANCO_DE_PRUEBAS_2026.md`** — la rúbrica de 9 criterios con la que se
decide si un modelo sirve, los prompts listos para pegar, y las reglas del workflow oficial de
Higgsfield (frases prohibidas, expresiones de media acción, densidad de habla, el de-slop de
`text2image_soul_v2`). **Se abre antes de generar un solo crédito.**

También: `CAROUSEL_PATTERN_BANK_2026.md` · `MOTION_PATTERN_BANK_2026.md` ·
`ADS_PATTERN_BANK_2026.md`.
