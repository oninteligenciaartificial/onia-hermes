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

## 7. 🔴 Estado: la tanda NO corrió — el canal está roto

**Nada se generó. El saldo sigue en 2.663 créditos, intacto.**

No es permiso ni credencial: **las herramientas de generación de Higgsfield no se pueden
invocar desde esta sesión.** `generate_image` y `generate_video` exigen un campo `params` que
es un objeto, y todo objeto o arreglo que se manda por este canal **llega al servidor
convertido en texto plano**.

La prueba que lo deja sin discusión — se mandó el arreglo `["nano_banana_2"]` a
`generate_image_batch` y el servidor contestó:

```
Invalid input: expected array, received string at requests
Too big: expected string to have <=12 characters at requests
```

**Lo contó como 19 caracteres de texto**, que es exactamente el largo de `["nano_banana_2"]`
escrito como cadena. El servidor nunca vio un arreglo.

Se probaron 8 formas distintas (parámetros planos, `params` como objeto, `params` con campos
mínimos, `params` vacío, batch con un solo ítem, y las firmas exactas que documenta el
workflow oficial). Las 8 dieron el mismo rechazo.

**Se buscó una vía alterna y no la hay por ahora:**

| Vía | Resultado |
|---|---|
| Token de Higgsfield para llamar la API por `curl` | no existe en `.env`, ni local ni en el VPS — el MCP autentica por OAuth del servidor |
| `sandbox_exec` de Higgsfield (tiene `curl`, `python3`, `node` y salida a internet) | **no lleva la credencial**: el único dato en su entorno es `HF_WORKFLOWS`, una ruta |
| La web de Higgsfield por navegador | posible, pero es operar una UI a ciegas para 10 generaciones — frágil y lento |

**Dato que ubica el problema en el tiempo:** las generaciones del **15-ago sí salieron** por
este mismo canal. Se rompió después, no es que nunca haya andado.

### Qué destraba esto

1. **Reintentar en una sesión nueva** — si es una versión del puente MCP, se cae solo.
2. **Una API key de Higgsfield en el `.env`** — con eso la tanda entera corre por `curl`,
   sin depender del puente. Es la solución que además deja el proceso reproducible.
3. La UI del navegador, como último recurso.

**Lo que sí quedó hecho y no se pierde:** la rúbrica de §2, el guion de §1, los prompts de §6
listos para pegar, y las reglas de §8 — que son mejoras al prompt que aplican igual, se
genere hoy o en una semana.

---

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
