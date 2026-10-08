# Agenda del día por profesional (PR #118 + arreglos C5b) — capturas v2

Vista del día con una columna por profesional: banco `/dev/agenda/dia` con el componente real `AgendaDia` dentro del shell. Código en `510b3bcd` (rama `wip/c118`). Datos de ejemplo: martes 6 de octubre de 2026, 8:00 hora de La Paz, 7 citas, nombres inventados. 16 PNG, todos abiertos y mirados.

Cómo se tomaron: Chromium sin cabeza, 390 y 1440 de ancho, página completa, tipografía de la marca cargada (Instrument Sans). Dos ajustes de captura, no del producto: (1) se ocultó con CSS el botón «N» de Next en desarrollo; (2) la ventana se estira a la altura de la página sólo para la foto, así la barra inferior (390) y el asistente, el botón + y la barra lateral (1440) quedan al final y no tapan citas a mitad de imagen. Sin eso el mensaje de error de `error-al-guardar-390` quedaba tapado. El campo «Día» muestra 10/06/2026 (mes/día) por el idioma del Chromium de captura: es el 6 de octubre.

## Problemas de la primera ronda

| | Antes | Ahora | PNG que lo prueba |
|---|---|---|---|
| a | En 390 se veía una columna y las otras exigían desplazar de lado sin pista | **Arreglado.** Selector «Elija un profesional» con «(3 citas)» por persona, una columna a la vez, sin scroll lateral (scrollWidth 390) | `agenda-dia-varios-profesionales-390.png`, `…-selector-luis-390.png`, `…-selector-sin-profesional-390.png` |
| b | Filas altas en blanco donde el profesional no tenía cita | **Arreglado.** Cada profesional dibuja sólo sus horas (la fila más alta mide 223 px y tiene contenido); Luis: 09:00, 10:30 y 15:30 seguidas | `…-selector-luis-390.png`, `…-varios-profesionales-1440.png` |
| c | «Hora del negocio: America/La_Paz» | **Arreglado.** Dice «Hora del negocio: hora de Bolivia.» en las 16 capturas | cualquiera, por ejemplo `…-varios-profesionales-390.png` |
| d | «Cancelada» y «No asistió» sin pastilla de color | **Arreglado.** Cancelada con pastilla roja; No asistió con pastilla gris y borde | `…-selector-luis-390.png`, `…-varios-profesionales-1440.png` |
| e | Día vacío seguía dibujando la tabla | **Arreglado.** Sin tabla: «0 citas en esta vista.» y «No hay citas para esta fecha y estos filtros.» | `…-dia-vacio-390.png`, `…-dia-vacio-1440.png` |

Lo que sí funciona en las otras capturas: «Confirmar» a Lucía la pasa a Confirmada (pastilla verde) y le quita el botón, las demás siguen con Confirmar (`…-confirmar-hecho-390.png`, `…-1440.png`); solo lectura no muestra ningún Confirmar (`…-solo-lectura-*`); el error «No se pudo guardar el cambio. Revise su conexión.» sale bajo la cita de Lucía y se lee completo (`…-error-al-guardar-*`); el doctor ve «Mi agenda» y sólo a la Dra. Ana (`…-doctor-mi-agenda-1440.png`).

## Lo raro que se ve ahora

- **Plural mal con 1:** «Sin profesional (1 citas)» en el selector y «1 citas en esta vista.» (`agenda-dia-varios-profesionales-selector-sin-profesional-390.png`). La etiqueta «citas» es fija.
- **Escritorio, las filas ya no se alinean por hora entre columnas:** el 10:30 de Luis queda arriba del 09:30 de Ana, y «Sin profesional» deja un hueco largo bajo su única cita (`agenda-dia-varios-profesionales-1440.png`). Es la consecuencia directa de arreglar (b); conviene que Sergio Urcullo lo vea.
- **Un solo profesional en 1440:** la única columna se estira a todo el ancho (unos 1100 px) y los botones quedan pegados a la izquierda con la derecha vacía (`agenda-dia-un-profesional-1440.png`, `agenda-dia-doctor-mi-agenda-1440.png`).
- **En celular «Mi agenda» no existe** (el filtro «Profesional» está oculto en 390): `agenda-dia-doctor-mi-agenda-390.png`, `agenda-dia-un-profesional-390.png` y `agenda-dia-varios-profesionales-390.png` son el mismo archivo, byte a byte. El doctor ve un selector con una sola opción.
- **Del shell, no de esta pantalla:** «Preguntá por tu negocio» (de vos) en la barra del asistente, todas las capturas de 1440 (`components/ayuda/BarraAsistente.tsx`, líneas 116 y 121). Sigue igual que en la primera ronda.
- **Del banco, no del producto:** el nombre abajo a la izquierda dice «Recepción de prueba» también en el caso doctor (`agenda-dia-doctor-mi-agenda-1440.png`).
- En `agenda-dia-error-al-guardar-1440.png` el botón Confirmar de Lucía se ve gris: es el puntero del script encima, no un estado de la pantalla.

Sin texto cortado, sin inglés y sin otras formas de vos en la pantalla (texto leído completo en la captura principal y barrido por script en las 16). Consola: filtrado el ruido esperado del banco (websocket a `localhost:59999`, 401 del shell) no queda ningún error ni aviso; sólo `/api/notifications` abortada al cambiar de página.

## Archivos

`agenda-dia-{varios-profesionales, un-profesional, doctor-mi-agenda, confirmar-hecho, solo-lectura, error-al-guardar, dia-vacio}-{390,1440}.png` (14) más `agenda-dia-varios-profesionales-selector-luis-390.png` y `agenda-dia-varios-profesionales-selector-sin-profesional-390.png` (2). «Un profesional» en 1440 es el filtro «Profesional» = Dra. Ana Aramayo.
