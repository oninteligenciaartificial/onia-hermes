# Datos sintéticos con Blender: cómo entrenar visión sin tener el dataset

- **Fuente:** https://www.instagram.com/p/DcL3pB5ANRH/ · @sigmoidal
- **Tipo:** IA · **Veredicto:** SIRVE YA
- **Cobertura:** las 6 láminas, al 100%. Marcado por Sergio como "investigar".

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en todo este lote y el anterior. Nada de
> lo que sigue afirma qué se *dice* en el video: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Titular:** `DADOS SINTÉTICOS PARA MACHINE LEARNING` — Python + Blender.
- **El problema, literal:** *"A escassez de dados rotulados de alta qualidade é um dos principais **gargalos** em aplicações reais de Machine Learning, especialmente em cenários críticos como defesa, sensoriamento remoto, robótica e bioimagem. Dados reais costumam ser caros, difíceis de obter, limitados em diversidade e, muitas vezes, inviáveis por restrições éticas ou operacionais."*
- **Caso 1 — detección de objetivos militares:** configuración de escena en Blender → script de generación con Python + `bpy` → dataset sintético (grilla 3×4 de imágenes renderizadas) → entrenamiento y validación con un modelo VGG → detección en imagen real. En el código se lee: `import bpy`, `cam = bpy.data.objects["Camera"]`, `cam.location = (x, y, z)`, `target.rotation_euler = (r, p, y)`, `light.energy = ...`, y un `for frame in range(num_frames): bpy.ops.render.render(write_still=True)`.
- **Caso 2 — reconstrucción 3D de foraminíferos:** microscopía real → modelo 3D base en Blender → escena de renderizado virtual → dataset de vistas múltiples → entrenamiento de **NeRF** → reconstrucción 3D de alta fidelidad.
- **Por qué Blender:** *"O Blender oferece uma API completa em Python que permite a automação de cenas, câmeras, iluminação e renderização... Além de ser gratuito e open source."*

## Cómo está hecho — la reconstrucción

- **La receta:** modelás el objeto una vez en 3D, y después un script recorre posiciones de cámara, rotaciones e iluminaciones renderizando miles de imágenes **ya etiquetadas** (sabés dónde está el objeto porque vos lo pusiste ahí).
- **Dónde nos toca, concreto:** el rubro ganadero ya tiene una ficha de visión por computadora, y el reel del checkout de este mismo lote necesita reconocer productos. En los dos casos el cuello es el mismo: nadie tiene 5.000 fotos etiquetadas de vacas bolivianas ni del catálogo de un almacén.
- **El límite honesto, que el carrusel no dice:** existe la brecha sintético→real. Un modelo entrenado sólo con renders suele fallar con luz, suciedad y desenfoque reales. La práctica normal es mezclar sintético con un puñado de fotos reales.
- **Y encaja con lo que ya decidimos:** el assessment de herramientas de 2026 concluyó que de todo lo evaluado *"solo Blender vale"*. Este es un uso concreto de esa conclusión.

## El estilo, como conocimiento portable

Fondo negro con la lámina técnica en blanco a la derecha — mezcla deliberada de dos registros: portada cinematográfica (render de desierto con cajas de detección verdes y HUD de coordenadas) y láminas de paper académico (diagramas de bloques numerados, citas con autor y año). Tipografía sans blanca sobre negro, con **negritas** para los términos clave. El contraste entre la portada de videojuego y el rigor de las láminas es lo que hace que se lea.

**Se porta a:** Nada de estilo. El valor es técnico y va a la ficha.

## Las tres preguntas

1. **Frente:** onia-platform / onia-core — cualquier feature de visión (ganadero, comercio).
2. **Herramienta nuestra:** Blender está evaluado y aprobado. No hay pipeline de datos sintéticos.
3. **Qué falta:** Nada para investigarlo. Para usarlo, primero hay que tener un caso real con cliente — no se construye un pipeline de dataset sin saber qué se va a detectar.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex de esta ficha son aproximados salvo donde diga que están escritos en pantalla.

**Prompt:** [Q09](prompts-lote-2026-08-24/Q09-datos-sinteticos-blender-para-vision.md)
