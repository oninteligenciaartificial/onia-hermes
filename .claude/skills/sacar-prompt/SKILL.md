---
name: sacar-prompt
description: Use when the user shares an IMAGE or a VIDEO and wants the prompt that would recreate it — "¿podés sacar el prompt de esto?", "cómo hago una imagen así", "replicá este video", "qué prompt usó", "dame el prompt de esta foto". Also for reverse-engineering a reference into a reusable recipe. Covers image→prompt and video→prompt-per-shot, with the two video templates (cine vs UGC) and the realism lever. Reuses the ver-videos engine; does not re-implement download or transcription.
---

# Sacar el prompt de una imagen o un video

Método salido de ~58 reels analizados, varios de los cuales **mostraban el prompt en pantalla**,
así que la reconstrucción se pudo comparar contra el original.

---

## La distinción que ordena todo

| | Qué es | Cuándo |
|---|---|---|
| **RECUPERAR** | leer el prompt exacto | el video o la lámina lo muestra en pantalla |
| **RECONSTRUIR** | escribir *un* prompt que produce algo parecido | todo el resto |

**No son lo mismo y no se presentan igual.** Si reconstruiste, decilo: *"esto no es el prompt
original, es uno que produce algo parecido"*. Nunca presentes una reconstrucción como el original.

---

# Paso 0 — ¿está el prompt en pantalla? (siempre)

Antes de reconstruir nada, **buscá el texto**. Muchos creadores lo regalan y después lo tapan con
un cebo de comentario, pero está en las láminas.

- Imagen o carrusel: leer **todas** las láminas. En un carrusel de 10, el prompt suele estar en
  1 o 2 — pero también puede haber uno por lámina.
- Video: muestrear fotogramas **denso donde hay texto**, no a intervalo fijo. En un reel el prompt
  apareció en **un solo cuadro**: con muestreo grueso se pierde entero.
- Caption: traerlo siempre. Varios ponen el prompt ahí.

Si el texto está pero se lee mal, **ampliar el recorte** antes de darlo por ilegible.

---

# Imagen → prompt

## Los 8 bloques, en orden fijo

```
1. Apertura fija        "Ultra-realistic vertical [género] photo of…"
2. Sujeto con ACCIÓN    lo que está haciendo, no un adjetivo
3. Rasgos enumerados    pelo, piel, maquillaje, expresión, dirección de la mirada
4. Vestuario            prenda por prenda, con material y color
5. Pose                 explícita, miembro por miembro
6. Fondo                como LISTA DE OBJETOS, no como ambiente
7. Bloque técnico       cámara/película + una frase de referencia de género
8. Negative prompt      el bloque base + 2-3 términos específicos del sujeto
```

## La palanca del realismo — contraintuitiva y es la que más mueve

**Se pide suciedad y se prohíbe lo pulido.** Un modelo dejado solo tira a catálogo; hay que
empujarlo al lado contrario.

- **Pedir:** `scratches and dirt marks` · `peeling paint, rust marks` · `harsh direct camera
  flash` · `slight film grain` · `muted colors` · poros, rojeces, textura real
- **Prohibir en el negative:** `beauty filter` · `clean costume` · `perfect background` ·
  `studio lighting` · `airbrushed` · `over-retouched`

**El negative base**, casi constante:
```
CGI, cartoon, plastic skin, beauty filter, over-retouched, bad anatomy, extra fingers,
HDR, studio lighting, over-sharpening, blurry subject, text, watermark
```
Y **2-3 específicos del sujeto** — ahí está la diferencia entre un negative genérico y uno que
sirve. Si es un ojo: `symmetrical capillaries`, `extra eyelids`. Si es una mascota disfrazada:
`clean costume`, `glossy plastic`.

## Dos atajos que salen gratis

- **Elegir caras con edad y textura real** en vez de modelos jóvenes perfectas. La cara mayor se
  ve real sin pelear con el modelo.
- **Seis ejes de realismo que funcionan sin tocar el prompt:** imperfección de piel · luz dura de
  sol · encuadre de selfie torcido · contexto banal verificable · marcas reales · defectos de cámara.

## Cuándo NO usar los 8 bloques

Si vas a **editar sobre una imagen que ya existe** (no generar desde cero), el prompt largo
estorba. Ahí gana lo contrario:

**Delegar el estilo a una referencia nombrada.** La instrucción de estilo entera puede ser un
nombre propio que el modelo ya conoce:
```
show me the AD magazine photography version of image 1.
in image 1, swap all furniture with the furniture shown in image 2
```
Sin lente, sin f-stop, sin esquema de luz. **Un nombre propio reemplaza un párrafo de adjetivos.**

Y tres mecanismos que van con eso:
- el catálogo de referencia va como **UNA sola imagen-collage**, no como N referencias sueltas
- el prompt **direcciona por índice** (`image 1`, `image 2`) → **el orden de carga es parte del prompt**
- **encadena**: la salida de un paso es la `image 1` del siguiente. La consistencia **no la
  sostiene el texto ni el seed: la sostiene la referencia**

---

# Video → un prompt por plano

## Antes de leer 40 fotogramas: que la herramienta lo desglose

`video_analysis_create` (MCP de Higgsfield) hace **análisis escena por escena**: tiempo, tipo de
plano, función narrativa, descripción visual y de audio. **Verificado gratis** — 25 escenas en 55
segundos, con el saldo idéntico antes y después.

```
media_upload → media_confirm → video_analysis_create → poll video_analysis_status
```

- Ideal para **15-60 s**. La propia herramienta advierte que a más duración, menos precisión.
- **No da el texto en pantalla.** Si el video muestra el prompt, eso se lee con los ojos.
- El análisis dice **dónde mirar**; los fotogramas se usan solo ahí.

## Elegir la plantilla ANTES de escribir

> **Si el video HABLA, es UGC. Si IMPRESIONA, es cine.** Mezclarlas arruina las dos.

### Plantilla CINE — una toma continua, sin cortes, sin diálogo

```
1. Tipo de toma, una línea         "Single continuous FPV drone shot, no cuts."
2. Entorno y atmósfera
3. RECORRIDO DE CÁMARA             ← la MITAD del prompt, paso a paso en el espacio
4. Detalles de movimiento          inercia, microcorrecciones, "speed contrast"
5. Luz y color, al final           grado, contraste, grano, aberración
```

**El bloque 3 es el que casi nadie escribe y es el que decide.** La cámara **se coreografía, no
se adjetiva**: de dónde arranca, hacia dónde acelera, dónde se inclina, qué curva describe, dónde
termina. Pedirle "movimiento cinematográfico" es lo que produce planos genéricos.

`speed contrast` — sujeto en cámara lenta, cámara rápida — es una frase y es lo que hace que se
sienta caro.

### Plantilla UGC — muchas tomas, cortes duros, el diálogo es el eje

```
1. Cabecera técnica global    formato, duración, qué cámara finge ser
2. DEFECTOS A PROPÓSITO       grain, compression, wobble, autofocus hunts, no grading
3. NEGATIVOS DEL FORMATO      "phone never in frame, reflections, or her hands"
4. Anclas de consistencia     inyectadas EN el punto del texto donde importan
5. Realismo de piel           pores, redness, baby hairs, no glare, natural blinks
6. Beats con timestamp        + referencia + DIÁLOGO LITERAL ENTRE COMILLAS
```

**Verificado: el diálogo entre comillas sale palabra por palabra en el video generado.** Se
comparó el prompt con el audio del resultado y coincidió literal. **El guion se escribe en el
prompt, no se corrige después.**

El punto 3 no es opcional: el modelo mete el celular en el reflejo porque "alguien está
filmando". Hay que prohibirlo explícito.

---

# Lo que NO se recupera mirando

Decilo siempre, no lo inventes:

| | Por qué |
|---|---|
| **El modelo** | si no está rotulado, no se sabe — y el mismo prompt da distinto en cada motor |
| **Los insumos** | si usó una foto de referencia, la imagen no dice cuál |
| **Cuántos intentos** | lo que se ve es la toma que salió bien, no las nueve descartadas |
| **El seed** | no se deduce |

---

# Antes de prometer que se puede repetir

**Consultar el catálogo de la cuenta es gratis. Hacerlo siempre, y anotar la fecha.**

Una verificación tiene fecha de vencimiento: hubo un modelo que se dio por inexistente seis
veces en el corpus y después apareció. *"No está hoy"* no es lo mismo que *"no existe"*.

```
models_explore (search/get)  ·  balance  ·  presets_show
```

**Gasto:** cotizar siempre con `higgsfield generate cost`; imágenes de menos de ~5 créditos por lote van sin preguntar (8-oct), lotes mayores piden aprobación; cara o voz de Sergio Urcullo, OK previo. Generar **video** cuesta créditos y
necesita **OK explícito de Sergio, caso por caso**. Se entrega el prompt + el modelo + el costo
estimado, y se para.

---

# Herramientas

Todo lo mecánico ya existe en **`ver-videos`** — no reimplementar:

| Para | Script |
|---|---|
| bajar reel/TikTok sin navegador | `.claude/skills/ver-videos/scripts/fetch-video.mjs` |
| carruseles de imágenes | `.claude/skills/ver-videos/scripts/ig-carousel.mjs` |
| verbatim con timestamps | `.claude/skills/ver-videos/scripts/transcribe.sh` (idioma en `auto`, **nunca forzado**) |
| preparar insumos de una sola vez | `scripts/preparar.sh` de esta skill |

**Whisper degrada los términos técnicos.** Casos medidos: `SIDANZ 2.5`=Seedance ·
`Hitsfield`=Higgsfield · `viesel`=VSL. **Ningún nombre propio se cita desde la transcripción sin
contrastarlo contra un fotograma.**

---

# Entrega

Toda respuesta de esta skill lleva:

1. **El prompt**, en bloque de texto, listo para copiar.
2. **Si es reconstrucción, dicho.** No se presenta como el original.
3. **La cobertura real** — cuántos fotogramas de cuántos, si había audio.
4. **Lo que no se pudo determinar** — modelo, insumos, intentos.
5. **El costo estimado** si va a generarse, y la pausa hasta la aprobación.
