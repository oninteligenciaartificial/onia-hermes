# P02 · Reconstruir el toggle que conmuta la grilla entera de productos

- **Destino:** `web-factory`
- **Sale de:** [la ficha](../2026-08-23-cosecha-toggle-luces-grilla-producto.md) · `DbEHFJjjd6y` · @andrew.plerdy
- **Fuente:** https://www.instagram.com/p/DbEHFJjjd6y/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Para el patron web: NADA. Se hace hoy, sin credencial, sin gasto y sin decision pendiente. Para el molde de video faltan dos decisiones chicas y una prohibicion: (i) elegir la palabra clave del comentario en espanol (el equivalente de LEAK); (ii) que la pieza mande a agendar demo en cal.onia.com.bo y no a un PDF (decidido el 23-ago); (iii) PROHIBIDO copiar el overlay de heatmap - inventar un mapa de calor es fabricar dato y choca con la regla de no fabricar.

---

```text
Trabajas en el repo onia-hermes. Objetivo unico de la sesion: agregar un patron nuevo a la biblioteca de UI reconstruidos.

CONTEXTO
En https://www.instagram.com/p/DbEHFJjjd6y/ (@andrew.plerdy) una tienda de iluminacion tiene, en la barra de herramientas de la coleccion (a la derecha de "View"), un toggle etiquetado "Lights". Al accionarlo, las 8 fichas de producto visibles cambian su foto AL MISMO TIEMPO: pasan de la version con la lampara apagada (pared clara, fondo gris frio) a la version encendida (bulbo emitiendo, halo ambar, entorno oscurecido). No es hover por ficha ni carrusel: es UN control a nivel de coleccion que conmuta la imagen primaria de TODA la grilla. El video no muestra codigo - se reconstruye, no se copia.

QUE HACER
1. Lee primero hermes-content/references/ui-patterns/README.md y respeta sus reglas al pie de la letra (un index.html autocontenido y sin dependencias, fuente anotada en comentario arriba del archivo, solo transform y opacity salvo justificacion escrita, prefers-reduced-motion con `transition: none` y NO con 0.01ms).
2. Crea hermes-content/references/ui-patterns/toggle-luces-grilla/index.html con:
   - Una grilla de 8 fichas de producto (nombre + "Desde Bs X"), responsive, que no desborde a 320px de ancho.
   - Una barra de herramientas arriba con el toggle etiquetado. Usa un input[type=checkbox] con label (o un button con aria-pressed) - debe ser operable con teclado y anunciar su estado a un lector de pantalla.
   - Cada ficha con DOS imagenes apiladas en el mismo contenedor (position:absolute), la de estado A abajo y la de estado B arriba con opacity:0. El toggle escribe el estado UNA sola vez en el contenedor de la grilla y las fichas lo leen por selector descendiente: UN evento, N imagenes. Prohibido un listener por tarjeta y prohibido cambiar src.
   - Crossfade de opacity entre ambas imagenes, ~250-350ms, con la misma curva para las 8.
   - Como no tenemos fotos reales de lampara encendida/apagada, genera los dos estados con gradientes CSS inline o SVG data-uri dentro del mismo archivo (fondo gris frio ~#D8D2C8 vs halo ambar ~#E8913A). No descargues nada ni referencies assets externos: el archivo tiene que abrir solo.
   - Un parrafo corto de nota al pie del HTML (en comentario) explicando por que el apilado evita el parpadeo del primer clic: ambas imagenes ya estan en el DOM.
3. En el mismo archivo, en el comentario de cabecera, anota: la fuente (URL + cuenta), que se reconstruyo sin ver codigo, y que el valor real del patron es fotografico (dos assets del MISMO encuadre, mismo angulo y mismo lente, cambiando solo el estado) - sin eso el gesto se lee como "cambio la foto" y no como "encendi la luz".
4. Agrega el patron a la tabla/indice de hermes-content/references/ui-patterns/README.md si el README lleva indice; si no lleva, no inventes uno.
5. Agrega a web-factory/docs/MOTION_PATTERN_BANK_2026.md una entrada corta para el gesto "crossfade de grilla completa disparado por un toggle de coleccion", respetando el formato que ya usa ese archivo.
6. Abre el index.html con Chromium headless y MIRA la captura en los dos estados (no basta con que el archivo exista). Verifica ademas que con prefers-reduced-motion forzado el cambio sea instantaneo y que las 8 fichas efectivamente esten en el estado B.
7. Commit conventional en tu propia rama, explicando el POR QUE.

NO HAGAS
- No copies el overlay de heatmap del video ni ninguna cosa parecida a un mapa de calor: inventar dato de usuarios viola la regla de no fabricar de este repo.
- No metas GSAP, framer-motion ni ninguna libreria: son dos opacity y un :checked.
- No toques nada fuera de hermes-content/references/ui-patterns/ y web-factory/docs/MOTION_PATTERN_BANK_2026.md.

LISTO = existe hermes-content/references/ui-patterns/toggle-luces-grilla/index.html, abre sin errores de consola y sin ninguna peticion de red externa, y una captura de Chromium headless muestra las 8 fichas en estado apagado y otra captura las muestra a las 8 en estado encendido tras un solo clic en el toggle.
```
