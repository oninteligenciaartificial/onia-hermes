# Banco de pruebas de Lucía — cómo se decide si un modelo sirve

> Escrito **antes** de generar, a propósito. Una rúbrica escrita después de ver los resultados
> se acomoda a lo que salió: uno mira el video, le gusta, y recién ahí decide qué era
> importante. Los criterios de abajo se fijaron con el saldo intacto.
>
> Autorización de gasto: Sergio, 2026-08-17, **techo 300 créditos**.
> Método y tarifario: `LUCIA_PATTERN_BANK_2026.md`. Qué se publica: `hermes-content/contenido/LUCIA.md`.

---

## 1. El guion que se prueba (y por qué este)

No se prueba con "ella camina". Se prueba con **la pieza que queremos publicar**, porque un
modelo puede sostener 5 segundos de alguien caminando y romperse en el primer plano hablando.

**Pilar meta-IA** — el gancho mejor medido del benchmark: *"¿Sabías que hace un año yo no
existía?"* rindió **18.642 vistas**, el mejor post de la cuenta de referencia.

```
GANCHO   "Hace un año yo no existía."
VALOR    "Hoy trabajo para una empresa de Santa Cruz que le arma sistemas
          a negocios que todavía contestan WhatsApp a mano."
CIERRE   "Comentá SISTEMA."
```

**Por qué vende:** el gancho declara que es IA —lo que la ley pide y el algoritmo premia— y
en la misma frase lo convierte en la demostración del producto. El valor nombra el dolor con
la palabra del dueño (*contestar WhatsApp a mano*), que es el gate de copy del banco de
carruseles. El cierre pide la única palabra viva con recurso detrás.

**El plano que se prueba: primer plano hablando a cámara.** Es deliberadamente el más
difícil — cara grande, boca en movimiento, cero lugar donde esconder un defecto. Si un modelo
aguanta acá, aguanta en un plano general. Al revés no.

## 2. La rúbrica — 9 criterios, y 4 son eliminatorios

Un modelo no se juzga "bien / mal". Se juzga criterio por criterio, porque uno malo en el
lugar equivocado tira toda la pieza y otro se corrige en edición.

### Eliminatorios — uno solo en rojo y la pieza no sale

| # | Criterio | Qué se mira | Rojo |
|---|---|---|---|
| **E1** | **Identidad** | ¿Es Lucía? Comparar contra el ancla `lucia-ancla-2026-08`: separación de ojos, forma de la nariz, mandíbula, pecas | Cualquiera dudaría de que es la misma persona |
| **E2** | **Deformación** | Manos, dedos, orejas, dientes, el cuello. **Las manos cerca de la cara son donde más falla** | Un dedo de más, una mano fundida, dientes que se mueven solos |
| **E3** | **Realismo de piel** | Poros, pelusa, asimetría, brillo desigual | Piel de plástico, muñeca, aerógrafo. Es el fallo más común y el más caro |
| **E4** | **Formato** | El alto y ancho REALES del archivo, no lo que se pidió. `video_extension` ya devolvió 16:9 con entrada 9:16 | No es vertical 9:16 |

### De calidad — se suman, no eliminan

| # | Criterio | Qué se mira |
|---|---|---|
| C5 | **Lipsync real** | ¿La boca sigue las sílabas, o solo se abre y cierra? Mirar labiales (m, p, b): tienen que cerrar los labios |
| C6 | **Movimiento** | ¿La cámara se mueve como una mano o como un dron? El temblor leve vende; la estabilidad perfecta delata |
| C7 | **Continuidad** | Ropa, joyas, peinado y luz iguales de principio a fin. **El rasgo distintivo (argollas + cadenita) en cuadro** |
| C8 | **Limpieza** | Sin texto, logos ni marcas de agua inventadas. Sin subtítulos que el modelo agregó solo |
| C9 | **Costo real** | Créditos medidos por saldo antes/después, no estimados. Y **segundos utilizables** — un video de 8 s con 2 s rotos cuesta el doble por segundo servible |

## 3. Cómo se puntúa

- Cada criterio: **✅ pasa · ⚠️ pasa con reserva · ❌ falla**
- **Un ❌ en E1-E4 descarta el modelo para ese uso.** No se promedia con lo bueno.
- El ganador no es el que más ✅ junta: es **el más barato que no tiene ningún ❌ eliminatorio**.
  La calidad extra por encima de "no se nota que es IA" no se paga sola.

## 4. Qué se prueba, en qué orden y por qué

**Primero imagen, después video.** Un video malo puede ser culpa de una imagen de entrada
mala, y no hay forma de separarlo si se prueban juntos. La imagen se elige primero y la misma
entra a todos los modelos de video.

### Fase A — imagen (el mismo prompt en todos)

| Modelo | Por qué está |
|---|---|
| `nano_banana_2` | el que usamos hoy — es el **baseline**, sin él no hay contra qué comparar |
| `nano_banana_2_lite` | versión barata del mismo, acepta `image_references` |
| `soul_2` | el único declarado **para UGC y personajes** |
| `gpt_image_2` `quality=low` | otro proveedor, el escalón barato |
| `z_image` | el más barato del catálogo. **Sin referencia de imagen** — se espera que falle E1, y sirve documentarlo |

### Fase B — video (misma imagen de entrada)

| Modelo | Por qué está |
|---|---|
| `veo3_1_lite` | el más barato por segundo medido (1 cr/s) |
| `kling3_0_turbo` | versión rápida del que mejor cara hace. ⚠️ el `kling3_0` normal **ignora `aspect_ratio`** |
| `seedance_2_0_mini` | el que ya usamos, con `image_references` |
| `wan2_7` | **nuevo, no estaba en el banco**: audio sincronizado + consistencia de personaje. Si hace lipsync nativo, se ahorra el paso de `sync_so` que cuesta 5× |

### Fase C — lipsync

`sync_so` sobre el mejor video de la B, **solo si `wan2_7` no resolvió el lipsync solo**.

## 5. Reglas de gasto

- `get_cost: true` **antes de cada tanda**. Es gratis y evita la sorpresa.
- Saldo medido antes y después: el costo declarado no siempre es el cobrado.
- Techo **300 cr**. Al llegar a 200 se para y se reporta, no se sigue "para terminar".
- Nada de re-generar buscando un mejor tiro. **Una pasada por modelo**: si necesita tres
  intentos para salir bien, ese dato ES el resultado.

## 6. Los prompts, listos para pegar

Escritos con las reglas de `ugc-character.md` de Higgsfield (§8). **El mismo prompt entra a
todos los modelos** — si cambia el prompt entre modelos, la comparación no vale.

### A. Imagen — primer plano hablando (el difícil)

```
<<<452d8375-fb67-4df7-9ae0-8f1b257aa51f>>> Keep her face identical to the reference:
Bolivian woman, 26, warm tan skin with light freckles, long dark wavy hair, brown eyes,
natural minimal makeup. Photorealistic real human skin with visible pores, fine peach fuzz,
subtle texture and tiny imperfections; natural face asymmetry. Bright lively eyes with sharp
catchlights and natural moisture. Natural eyebrows with individual visible hairs, slightly
uneven and unruly. She always wears small thin gold hoop earrings and a fine gold chain
necklace; terracotta #E4714E knit top. Chest-up, mid-action expression — in the middle of
saying something, not posing. Hands out of frame. She sits at a worn wooden table in a bright
tropical cafe in Santa Cruz de la Sierra, Bolivia, background falling out of focus naturally.
Imperfect available light: strong highlights, slightly washed-out tones, uneven exposure, one
side of her face brighter. Color palette limited to #C89F82 #8A5A3B #E4714E #EFE7DA #D8C9B0
#B08246 #4E8C87 #2E2A26.

Self-portrait selfie shot on iPhone front-facing camera held by the subject at arm's length —
head and shoulders fill the frame, casual handheld framing, slight natural tilt, slightly
off-center, slightly imperfect, not posed. Phone-sensor grain and realistic skin texture
preserved, no retouch, no smooth-skin filter. No fisheye lens, no ultra-wide distortion.
Authentic UGC creator phone selfie, NOT editorial portrait, NOT fashion magazine.
No brand logos, no text, no watermark.
```

*Tres cosas cambiadas respecto del prompt que usábamos el 15-ago, y las tres salen de §8:*
`mid-action expression` **reemplaza** cualquier mención de sonrisa · **se quitó** *"slightly
wide lens"* (rozaba el ban de ultra-wide) · **se agregó** el bloque de cierre verbatim.

`hands out of frame` es nuestro, y ataca el criterio **E2** de frente: las manos cerca de la
cara son donde más falla el modelo.

### B. Video — el clip hablando

```
She talks to the camera in a natural way, mid-sentence, small head movements, natural
blinking, shoulders shifting slightly. Hands out of frame. Handheld phone footage, natural
available light, slight film grain, real skin texture. Photorealistic live-action, no CGI
look. No text, no watermark.
```

Vertical **9:16** en todos. `veo3_1_lite` **exige `duration: 8`** cuando lleva start+end
(no documentado, devuelve 422 con otro valor).

### C. El guion para la voz

Los 3 bloques de §1, tal cual. **Densidad: 2,4-2,7 palabras/segundo** (§8) — el guion entero
son 38 palabras, o sea ~15 s. Entra justo en el tope duro de 40 palabras por 15 s.

---

## 7. La firma real de la API (probada, no supuesta)

**Todo va dentro de `params`, incluido `model`.** No existe un parámetro `model` de nivel
superior — ese fue mi error, y me costó declarar roto un canal que funcionaba:

```
✅  { params: { model: "nano_banana_2", prompt: "...", aspect_ratio: "9:16" } }
❌  { model: "nano_banana_2", params: { prompt: "..." } }      → "Invalid input at params"
❌  { model: "nano_banana_2", prompt: "...", aspect_ratio: "9:16" }  → mismo error
```

### 🔴 `get_cost` fuera de `params` se ignora — y GENERA

Pasado al nivel superior no da error, no avisa, y **cobra**. Cinco "preflights" salieron como
generaciones reales (1,27 cr). Barato, pero el mismo descuido en video cuesta 20 veces más.

**Si vas a preflightear, `get_cost` va DENTRO de `params`** — y aun así conviene mirar el
saldo antes y después, que es la única medición que no miente.

### Otras dos cosas que solo se ven llamando

| Qué | Realidad |
|---|---|
| `medias: [{value, role}]` | el servidor lo traduce a `reference_images` al guardarlo. Se manda como `medias`, se lee como otra cosa |
| Los ids del catálogo **no son** los del backend | `nano_banana_2` → `nano_banana_flash` · `soul_2` → `text2image_soul_v2`. Al leer un job viejo hay que saber esta traducción o parece otro modelo |

### ⚠️ Los arreglos sí se rompen en el canal — pero solo en algunos campos

`jobs_wait` y `generate_image_batch` reciben sus arreglos convertidos en texto (probado:
`["nano_banana_2"]` llegó como 19 caracteres de cadena). `params` no tiene ese problema porque
el servidor lo parsea.

**Consecuencia práctica: no se puede usar el batch ni esperar jobs por lista.** Se lanza de a
uno y se consulta el estado con `show_generations`, que sí funciona.

---

## 7-bis. RESULTADOS FASE A — imagen (medido 2026-08-17)

**Costo real de las 4: 3,77 créditos.** Total de la sesión con los sondeos: **5,04 cr de 300.**

| Modelo | E1 identidad | E2 deform. | E3 piel | E4 formato | Resolución | Veredicto |
|---|---|---|---|---|---|---|
| **`nano_banana_2`** | ✅ **clava** | ✅ | ✅ poros y pecas reales | ✅ | **1536×2752** | 🏆 **el ganador** |
| `nano_banana_2_lite` | ⚠️ buena, **pelo aclarado** | ✅ | ✅ | ✅ | 768×1376 | sirve de respaldo |
| `gpt_image_2` low | ⚠️ **cara más ancha**, pelo aclarado | ✅ | ✅ | ✅ | 752×1344 | descartado para primer plano |
| `z_image` | ❌ **es otra persona** | ✅ | ✅ | ✅ | 1152×2048 | ❌ para Lucía · ✅ para b-roll sin cara conocida |
| `soul_2` | — | — | — | — | — | el job no volvió; se reintenta |

### Lo que enseña, y no estaba en ningún lado

**1. El `<<<uuid>>>` dentro del prompt es lo que ancla la identidad — no el parámetro.**
El servidor avisó `reference_elements: omitted — Nano Banana 2 does not support this parameter`
y **la cara salió igual de bien**. La referencia viaja en el texto del prompt.

Corrige lo que decía el banco: no es que estos modelos "no anclen identidad". Anclan, por otra
vía.

**2. El pelo es lo primero que deriva, antes que la cara.** Dos de los cuatro le pusieron
puntas aclaradas tipo balayage; el ancla es castaño parejo. La cara aguantaba en los dos casos.

→ **Regla nueva: revisar el pelo, no solo la cara.** Y nombrar el color en el prompt, no solo
la forma.

**3. `hands out of frame` funciona.** Cuatro de cuatro sin una sola mano deforme — el fallo
más común del catálogo, eliminado con tres palabras.

**4. `z_image` no se descarta: se reubica.** Es el más barato y da fotos creíbles; lo que no
puede es sostener una identidad. Sirve para ambientes y gente de fondo, donde nadie tiene que
reconocer a nadie.

## 8. Lo que enseña el workflow oficial de Higgsfield (y no teníamos)

Buscando la vía alterna apareció algo que vale más que la tanda bloqueada: Higgsfield trae
**workflows completos preinstalados** en su sandbox, y uno es `ugc-saas-flow` — *"un video UGC
para un sitio / app / servicio"*. Literalmente nuestro caso. Su archivo de reglas de personaje
tiene **63.000 caracteres** de reglas probadas.

Lo aplicable, que nuestro banco no tenía:

### 8.1 La lista de frases prohibidas

Producen look editorial/estudio, que es lo contrario de UGC. **Ninguna puede aparecer en un
prompt de Lucía:**

`centered composition at eye-level` · `straight-on` · `editorial portrait` · `fashion portrait` ·
`minimal depth of field` · `editorial mood` · `aspirational lifestyle atmosphere` ·
`flattering and even illumination` · **`glowing skin`** · **`flawless skin`** ·
`radiant complexion` · `poised` · `refined expression` · `elegant stance` ·
**`warm smile at the camera`** · `looking at the camera with a smile` · cualquier verbo de pose
(`poses`, `is posing`, `stands gracefully`) · ring light, softbox, cámara profesional ·
**`fisheye`, `ultra-wide`**.

⚠️ **Nos tocaba una:** nuestro prompt del 15-ago pedía *"slightly wide lens"*. El doc permite
*"mild phone front-camera wideness at most"* — estábamos en el borde. Se quitó.

### 8.2 Expresiones de media acción — en vez de "sonriendo"

La regla es que la cara esté **capturada en el medio de algo**, nunca posando. Once opciones
aprobadas; las que sirven para Lucía:

- `mid-action expression — in the middle of saying something, not posing` ← **la nuestra**
- `mid-thought, slight half-smile, eyes glancing slightly off-lens`
- `casually glancing toward the lens with a relaxed, neutral expression`
- `natural unguarded face, soft neutral expression, not smiling at the camera`
- `eyebrows lifted mid-thought, lips pressed in a "wait, no" line, head tilted slightly`

### 8.3 El bloque de cierre, palabra por palabra

Va **al final de todo prompt de imagen**, sin editar (está copiado en §6.A).

Su núcleo es la **geometría del selfie**: brazo extendido hacia el lente, la mano o la muñeca
apenas asomando en el borde del cuadro, encuadre corrido y algo imperfecto. Es lo que separa
un selfie real de un retrato.

### 8.4 El de-slop: Soul hace la piel cerosa, y hay receta

El workflow lo marca **obligatorio** después de generar con `soul_2`: la identidad la sostiene,
pero la piel sale de cera. Se arregla con un segundo paso que **cambia solo la microtextura**
—poros, vello fino, ruido de sensor— y prohíbe explícitamente reencuadrar o tocar la cara.

Peleamos con la piel de plástico durante meses. La receta existía.

### 8.5 Densidad de habla — el número que nos faltaba

**2,4-2,7 palabras por segundo**, y el ritmo tiene que variar dentro de la toma.
Tope duro: **~40 palabras por cada 15 s**. Pasado eso el render atropella y habla acelerado.

| Duración | Palabras |
|---|---|
| ≤10 s | 22-26 |
| 11-12 s | 28-33 |
| 13-15 s | 35-40 |

### 8.6 El QA de frame congelado

Antes de dar por buena una toma, **pausarla y mirar**: un solo creador en cuadro · **≤2 manos** ·
la cara coincide con la referencia · sin texto quemado que el modelo inventó · **labios limpios
en los frames de media palabra**.

Ese último es el que detecta el lipsync falso: si en mitad de una sílaba la boca está borrosa o
deformada, el modelo está abriendo y cerrando, no hablando.

### 8.7 `use_unlim` — generaciones gratis, y por qué no nos toca

Existe un flag que hace **gratis** las llamadas de generación durante el free-trial. **No
aplica**: la cuenta está en plan `ultra` y `unlim.available` vino en `false`. Queda anotado
por si se abre una cuenta nueva.

⚠️ Es **opt-in del usuario**: no se manda por iniciativa propia para "ahorrar".

---

## 9. RESULTADOS FASE B — video (medido 2026-08-17)

Misma imagen de entrada en los cuatro (la ganadora de la Fase A), mismo prompt, una sola
pasada por modelo. **Costo real: 35,50 cr.**

| Modelo | Costo | Por segundo | Identidad | Boca / naturalidad | Audio | Salida |
|---|---:|---:|---|---|---|---|
| **`wan2_7`** | **7,50** | **1,50** | ✅ | ✅ **la más natural** | 🔊 **sí, sin pedirlo** | 716×1284 |
| `kling3_0_turbo` | 7,50 | 1,50 | ✅ | ✅ natural | 🔊 sí, sin pedirlo | 716×1284 |
| `veo3_1_lite` | 8,00 (8 s) | **1,00** | ✅ | ✅ natural | — (respetó `false`) | 720×1280 |
| `seedance_2_0_mini` | **12,50** | **2,50** | ✅ | ❌ **boca en "O" exagerada, sobreactuada** | — | 720×1280 |

### 🔴 El que veníamos usando es el más caro y el peor

**`seedance_2_0_mini` cuesta 2,5× lo que `wan2_7` y dio el único resultado que se nota falso.**
La boca se abre en una "O" enorme que ninguna persona hace hablando normal. Es el modelo que el
banco tenía como opción principal para escenas con identidad.

### 🏆 `wan2_7` gana, y por un motivo que no estaba en el plan

Sale **1,50 cr/s como `kling3_0_turbo`**, con la boca más natural de los cuatro — y además
**trae su propia pista de audio sincronizada sin que se la pidan** (AAC 44,1 kHz estéreo,
−21,4 dB medio / −7,2 pico: contenido real, no silencio).

Eso cambia la cuenta entera. El banco tenía el lipsync a **~18 cr por 5 s** con `sync_so`;
`wan2_7` entrega video **y** audio por **7,50**.

⚠️ **Sin confirmar: si esa voz sirve para Lucía.** Que exista audio no significa que sea la voz
correcta — hay que escucharlo antes de descartar ElevenLabs. **Eso lo decide Sergio, oyendo.**

### `veo3_1_lite` sigue siendo el más barato por segundo

**1,00 cr/s**, y es el único que respetó `generate_audio: false`. Para b-roll sin voz sigue
siendo la opción correcta; para primer plano hablando, `wan2_7` lo supera por el audio.

### Dos cosas que solo se ven midiendo el archivo

1. **`kling3_0_turbo` y `wan2_7` devuelven 716×1284, no 720×1280.** Vertical correcto, pero no
   es 720p exacto — hay que reescalar antes de montar con material de otro modelo.
2. **Los dos traen audio aunque no se pida.** Si la pieza lleva voz montada aparte, **ese audio
   hay que silenciarlo explícitamente** o se superponen.

### Costo real de la pieza de 32 s, recalculado

| Vía | Cuenta | Total |
|---|---|---:|
| ~~la del banco~~ | 4× `veo3_1_lite` 8 s + voz ElevenLabs | ~35 cr |
| **con `wan2_7`** | 7 tramos de 5 s, audio incluido | **~52 cr** |
| ~~con `seedance_2_0_mini`~~ | 7 tramos de 5 s + voz | ~90 cr |

**Para b-roll mudo con voz montada: `veo3_1_lite`.** Para primer plano hablando: `wan2_7`.
`seedance_2_0_mini` no entra en ninguna de las dos.

## 10. Gasto de la sesión

| Tanda | Créditos |
|---|---:|
| Sondeos de firma (5 imágenes basura por `get_cost` mal puesto) | 1,27 |
| Fase A — 5 imágenes | 3,77 |
| Fase B — 4 videos | 35,50 |
| **Total** | **40,54 de 300** |

Saldo: 2.663,12 → **2.622,58**.

---

## 11. 🔴 EL HALLAZGO: el diálogo en español se pide y sale exacto

Sergio, al escuchar la primera prueba: *"esa voz es en inglés"*. Correcto — el prompt describía
la escena pero **no decía qué decir ni en qué idioma**, así que el modelo inventó habla en
inglés.

**La corrección es una línea del prompt.** Se le da el diálogo literal entre comillas y se
nombra el idioma:

```
She speaks in SPANISH with a Latin American (Bolivian) accent, looking straight at
the camera, saying clearly: "Hace un año yo no existía. Hoy trabajo para una
empresa de Santa Cruz." ... Spanish language audio only, no English.
```

### Verificado con transcripción, no de oído

El audio de los dos videos se extrajo y se pasó por **Whisper** (Speaches en el VPS, modelo
`Systran/faster-whisper-small` — el multilingüe; el `distil` del contenedor es solo-inglés y
traduce el español):

| Modelo | Lo que transcribió Whisper |
|---|---|
| `wan2_7` | *"Hace un año yo no existía. Hoy trabajo para una empresa de Santa Cruz."* |
| `kling3_0_turbo` | *"hace un año yo no existía. Hoy trabajo para una empresa de Santa Cruz."* |

**Palabra por palabra el guion, en los dos.** No es "más o menos español": es el texto exacto.

### Lo que esto cambia

El tarifario tenía la voz como un paso aparte —ElevenLabs, ~2,4 cr / 50 palabras— más el
lipsync de `sync_so` a ~18 cr por 5 s. **Los dos pasos desaparecen** si la voz nativa sirve:

| Vía | Pasos | Costo 5 s |
|---|---|---:|
| ~~la del banco~~ | video mudo + ElevenLabs + `sync_so` | ~28 cr |
| **nativa** | una sola llamada | **7,50 cr** |

⚠️ **Lo que sigue sin decidirse: si esa voz sirve como voz de Lucía.** Que diga el texto
correcto en español no significa que el timbre y el acento sean los de ella —
`references/modelos/lucia/LUCIA.md` fija la voz oficial (Marcela, ElevenLabs) y **ese archivo
manda sobre este**. Cambiarla es decisión de Sergio, escuchando.

**Si la voz nativa no convence, el flujo correcto es híbrido:** generar con `kling3_0_turbo` o
`wan2_7` (que ya dan la boca articulando en español), **silenciar su pista** y montar encima la
voz de ElevenLabs. El lipsync ya quedó hecho contra un español real — que es exactamente lo
que `sync_so` cobraba 18 cr por hacer.

### En español gana el otro

En la primera tanda (inglés) `wan2_7` parecía mejor. Mirando los mismos tres tiempos de ambos:

| | `wan2_7` | `kling3_0_turbo` |
|---|---|---|
| Articulación | marcada, casi aparatosa — en t=1,2 s adelanta la boca de más | **sutil, natural** |
| Estabilidad de la cara | el mentón se le mueve en el frame exagerado | **más consistente con el ancla** |
| Costo | 7,50 | 7,50 |

**Al mismo precio, `kling3_0_turbo` sale mejor en español.** Es un cambio respecto de §9 — ahí
ganaba `wan2_7`, y con habla en inglés genérica era cierto. Con diálogo en español, no.

---

## 12. B-roll vs UGC — dos vías con costos muy distintos

| | **UGC** (ella hablando) | **B-roll** (sin cara conocida) |
|---|---|---|
| Qué es | primer plano, boca en movimiento, identidad en juego | ambientes, objetos, el negocio, el celular en el mostrador |
| Imagen | `nano_banana_2` + ancla — **2,00 cr** | **`z_image` — 0,15 cr** |
| Video | `kling3_0_turbo` / `wan2_7` — **7,50 / 5 s** | `veo3_1_lite` — **8 cr / 8 s** (1,00/s) |
| Lo que se cuida | identidad, deformación, lipsync | que no se note el texto inventado en pantallas |

**La imagen de b-roll cuesta 13× menos**, porque no hay que sostener ninguna identidad. El
mismo `z_image` que falló el criterio E1 —no era Lucía— es el correcto acá: nadie tiene que
reconocer a nadie.

Probado: un mostrador de tienda de barrio en Santa Cruz de noche, con el celular encendido
mostrando conversaciones sin responder. Sale fotorrealista y sirve directo para ilustrar el
dolor de los carruseles 1 y 2.

⚠️ **La trampa del b-roll:** cualquier pantalla en cuadro sale con **texto inventado
ilegible**. Se resuelve pidiendo `no readable text` y encuadrando lejos — nunca un primer
plano de una pantalla.

### La regla que sale

> **Si en el plano no hace falta que se reconozca a Lucía, no se paga identidad.**
> B-roll con `z_image` + `veo3_1_lite`. La cara solo donde el guion la necesita.
