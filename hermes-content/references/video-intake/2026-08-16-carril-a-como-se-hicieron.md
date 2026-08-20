# Carril A — tres videos hechos con IA (o con truco), y cómo se hicieron

Los tres se analizaron con las **siete preguntas del carril A**, no con un resumen.
Cobertura declarada video por video.

---

# 1 · El prompt en pantalla — la receta completa, regalada

- **Video:** https://www.instagram.com/p/DcEcRmFMaAx/ · 10 s
- **Cobertura real:** **sin voz utilizable** (Whisper devolvió caracteres jemer sobre la música:
  alucinación típica sobre pista musical). Leído **enteramente por fotograma**: 2 de 5.
- **Veredicto: SIRVE YA — es la ficha más útil del lote para generación de video**

## Las siete preguntas

| # | Respuesta |
|---|---|
| 1. ¿Qué es sintético? | **Todo el plano.** Un buzo con rastas y lentes bajo el agua, generado |
| 2. ¿Qué modelo? | rótulo en pantalla: **"Seedance 2.5"** — ver la advertencia abajo |
| 3. ¿Insumos? | **una imagen fija** (una tapa de disco, visible en la lámina) + el prompt de texto |
| 4. ¿Consistencia? | no aplica: **es una sola toma continua**, sin cortes. Por eso no se rompe |
| 5. ¿Fuera del generador? | montaje de la lámina explicativa y **una flecha roja dibujada sobre la imagen** marcando el recorrido de cámara — para el humano, no para el modelo |
| 6. ¿Cuántas generaciones? | **una** |
| 7. ¿Se repite con lo nuestro? | **sí**, ver abajo |

## La estructura del prompt — esto es lo que hay que copiar

El video muestra el prompt entero, legible. **No importa el texto: importa que son cinco bloques
en orden fijo.**

| Bloque | Qué hace | Del ejemplo |
|---|---|---|
| **1 · Tipo de toma** | una línea, primero | *"Single continuous FPV drone shot, no cuts."* |
| **2 · Entorno** | dónde y con qué atmósfera | *"murky teal ocean water, thick with drifting silt and rising bubble streams, hazy volumetric god-rays"* |
| **3 · Recorrido de cámara** | **el bloque más largo, ~120 palabras** | *"starts low and left, skimming just above the pale sandy seabed, then accelerates hard to the right... banks steeply upward... carves an S-curve... finally pushes toward the open umbrella canopy"* |
| **4 · Detalles de movimiento** | la física que hace que parezca real | *"slight roll and yaw on every turn, natural FPV inertia and micro-corrections, faint dome-port refraction ring, subject moves in dreamy slow motion while the camera moves fast — **speed contrast**"* |
| **5 · Luz y color** | el grado, al final | *"deep cyan-teal grade, cool shadows, soft warm highlight from the surface, high-contrast film grain, subtle chromatic aberration"* |

**Los dos hallazgos que cambian cómo escribimos prompts:**

- **La cámara se coreografía, no se adjetiva.** El bloque 3 es la mitad del prompt y es puro
  recorrido espacial paso a paso. Nuestros prompts describen la escena y le piden a la cámara
  "movimiento cinematográfico". Por eso salen genéricos.
- **`speed contrast`** — sujeto en cámara lenta, cámara rápida. Es una sola frase y es lo que
  hace que el plano se sienta caro.

## ⚠️ La advertencia obligatoria

El rótulo dice **"Seedance 2.5"**.

> **CORREGIDO 2026-08-18.** Cuando escribí esto, `seedance_2_5` **no estaba** en la cuenta y lo
> di por modelo fantasma — seis veces en el corpus. Volví a consultar el catálogo y **ahora sí
> está**, con duración de **4 a 30 s** y modos `video_edit` / `video_extension`. Los videos
> describían algo que todavía no nos había llegado. Detalle y la lección de método en
> [la ficha del anuncio UGC](2026-08-18-ugc-auto-receta-completa.md).

**Pero la estructura de 5 bloques no depende del modelo.** Es texto: funciona en cualquier
imagen-a-video. Eso es lo que se lleva, no el nombre.

---

# 2 · El sketch animado — por qué eligieron 3D y no realismo

- **Video:** https://www.instagram.com/p/DcEUi_cKwmj/ · ~90 s, inglés
- **Cobertura real:** audio 100% ([verbatim](transcripciones/Instagram-DcEUi_cKwmj.txt)) · 3 de 33 fotogramas
- **Veredicto: SIRVE — por la decisión estética, no por el contenido**

## Las siete preguntas

| # | Respuesta |
|---|---|
| 1. ¿Qué es sintético? | **todo**: personajes, escenarios, y **el diálogo hablado** |
| 2. ¿Qué modelo? | **no se dice.** Es un modelo con audio nativo; el estilo es 3D tipo animación de estudio |
| 3. ¿Insumos? | no se muestran. Por la continuidad, hay descripción fija de personaje repetida por toma |
| 4. ¿Consistencia? | **acá está el oficio, y es una decisión de estilo, no técnica** — abajo |
| 5. ¿Fuera del generador? | montaje entre tomas + **subtítulos karaoke** quemados |
| 6. ¿Cuántas generaciones? | **muchas** — arco narrativo de ~90 s con varias locaciones. Con tomas de 8-15 s son 8-12 generaciones mínimo |
| 7. ¿Se repite? | **sí, con costo** — ver la verificación de cuenta abajo |

## El hallazgo: el estilo 3D es un escondite

Los defectos de IA están a la vista: en un plano, **la mano del personaje se funde en un bulto**,
las cajas de fondo tienen logos manchados, la geometría de la cama no cierra.

**Y no importa.** Porque el video no promete realismo: promete animación. En una animación 3D
estilizada, una mano rara **se lee como estilo**; en un video fotorrealista, **se lee como error**
y rompe todo.

> **Regla para nosotros:** para contenido narrativo con IA, **estilizado 3D antes que
> fotorrealista**. Es más barato de mantener consistente, tolera los defectos que el modelo va a
> cometer igual, y no compite con la única cara que sí necesitamos fotorrealista, que es Lucía.

## Verificado contra la cuenta — qué se puede hoy

Consulta gratis al catálogo. **Sí tenemos modelos de diálogo nativo:**

| Modelo | Duración | Audio | Nota |
|---|---|---|---|
| **`flux_3_video`** | **5-20 s**, 1080p | `generate_audio` (voz + efectos + ambiente), por defecto activo | **el mejor para esto**: acepta start/end image, referencias, y **continuación de video** |
| `veo3` | — | audio | variantes `veo-3-preview` (calidad) / `veo-3-fast` |
| `wan2_7` | 2-15 s | audio sincronizado, **consistencia de personaje** | |
| `gemini_omni` | 4-10 s | audio nativo, referencias | |

**Dos correcciones al corpus:** (a) el tope de 15 s que veníamos dando es de `seedance_2_0`;
**`flux_3_video` llega a 20 s**. (b) `wan2_7` y `gemini_omni` figuran como elegibles para
generaciones ilimitadas de prueba, **pero `unlim.available` está en `false`**: hoy no se pueden
gastar. O sea, **cada generación cuesta créditos**.

**Gasto: generar video = permiso explícito de Sergio, caso por caso.** Esta ficha no autoriza nada.

---

# 3 · El formato gemelo — sin IA, sin costo, y es el más copiable

- **Video:** https://www.instagram.com/p/Dbv2IrORksG/ · 14 s
- **Cobertura real:** **sin voz** (todo el mensaje está en texto sobrepuesto). Leído por
  fotograma: 1 de 7.
- **Veredicto: SIRVE YA — es el formato más barato que vimos**

## Cómo está hecho

La misma persona aparece **dos veces en el mismo sillón**: a la izquierda con las manos en la
cara (frustrado), a la derecha tomando agua tranquilo mientras teclea.

**No es IA.** Es cámara fija en trípode, **dos tomas**, y una máscara vertical al medio en el
montaje. La ventana con la ciudad de fondo y la luz idéntica delatan que es la misma sesión.

Encima, texto en tres niveles:
```
AGENCIA IA (Tradicional)   VS   AGENCIA IA SAAS
              Cliente nuevo:
  volver a configurar   |   duplicar + personalizar
     (rojo)                     (verde)
```

## Por qué funciona y por qué nos sirve

Es **una comparación entera sin decir una palabra**. Se entiende con el sonido apagado, que es
como se ve la mayoría de los reels. El rojo/verde hace el trabajo de un párrafo.

Y el tema es **exactamente el nuestro**: rehacer todo por cliente vs duplicar y personalizar. Es
el argumento de ONIA Platform (módulos por rubro) contra el desarrollo a medida — dicho en 14
segundos, con un trípode.

**Costo: cero.** Trípode, dos tomas, una máscara. `editor-videos` ya monta y compone; los textos
salen de HyperFrames.

## A dónde va todo el carril A

| Sesión | Qué |
|---|---|
| **`INFLUENCERS IA`** | los 5 bloques del prompt + la regla del 3D estilizado + el catálogo corregido (prompt E9) |
| **`editor de videos`** | el formato gemelo como plantilla (prompt E10) |
