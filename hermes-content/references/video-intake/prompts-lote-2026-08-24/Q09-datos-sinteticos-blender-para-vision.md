# Q09 · Datos sintéticos con Blender: cómo entrenar visión sin tener el dataset

- **Destino:** `onia-plattform`
- **Sale de:** [la ficha](../2026-08-24-datos-sinteticos-blender-para-vision.md) · `DcL3pB5ANRH` · @sigmoidal
- **Fuente:** https://www.instagram.com/p/DcL3pB5ANRH/
- **Qué falta para hacerlo hoy:** Nada para investigarlo. Para usarlo, primero hay que tener un caso real con cliente — no se construye un pipeline de dataset sin saber qué se va a detectar.

---

```text
Objetivo único: decidir si el pipeline de datos sintéticos con Blender resuelve el cuello de botella de nuestras features de visión, ANTES de que alguien prometa una.

De dónde sale: ficha `datos-sinteticos-blender-para-vision` (IG DcL3pB5ANRH, @sigmoidal). Sergio lo marcó "investigar".

La receta observada: se modela el objeto una vez en 3D y un script en Python (bpy) recorre posiciones de cámara, rotaciones e iluminaciones renderizando miles de imágenes YA ETIQUETADAS — la etiqueta es gratis porque vos pusiste el objeto ahí. Casos mostrados: detección de blancos militares (dataset sintético -> modelo VGG -> detección en imagen real) y reconstrucción 3D de microfósiles con NeRF.

Por qué nos importa: tenemos dos frentes de visión posibles y los dos tienen el mismo cuello — nadie tiene el dataset. Conteo de ganado en el rubro ganadero, y reconocimiento de productos para el checkout por visión (ver ficha checkout-por-vision-recibo-en-vivo, del mismo lote).

Pasos:

1) Investigar de verdad, con fuentes citadas y fechadas — no de memoria. Tres preguntas:
   - ¿Cuál es el estado del arte hoy en generación sintética con Blender para detección de objetos?
   - ¿Cuánto de brecha sintético-a-real se reporta, y qué mezcla de sintético + real se recomienda? (el carrusel NO menciona esta brecha, y es el riesgo principal)
   - ¿Hay algo más barato que resuelva lo mismo: modelos preentrenados, few-shot, servicios de etiquetado?

2) Aterrizarlo a NUESTROS dos casos. Para cada uno: qué habría que modelar en 3D, cuántos renders harían falta según lo que reporta la literatura, y qué hardware. Con números, no con "sería posible".

3) Comparar contra el atajo obvio: para contar ganado, ¿un modelo preentrenado tipo YOLO afinado con unos cientos de fotos reales alcanza? Si alcanza, el pipeline sintético es sobre-ingeniería y hay que decirlo.

4) Veredicto de una línea por caso: vale / no vale / vale sólo si (condición concreta).

REGLA: esto es investigación, no construcción. No se modela nada ni se renderiza nada en esta tarea. Y no se le promete visión a ningún cliente hasta que este documento exista.

LISTO = un documento con las tres preguntas respondidas y fuentes citadas con fecha, la tabla de los dos casos nuestros con números, y un veredicto por caso.
```
