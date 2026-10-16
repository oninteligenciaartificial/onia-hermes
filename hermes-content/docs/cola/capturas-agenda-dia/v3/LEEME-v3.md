# Agenda del día por profesional: capturas v3 (rediseño)

Pedido de Sergio Urcullo sobre la v2: «nada de simpleza, burbujas, letras que resalten». Modelo directo: la columna
«Agenda de hoy» de la maqueta aprobada v3 (riel de horas, línea de «ahora» en burbuja, pastillas con fondo suave).

- **Código:** `9bcccc54` en la rama `wip/c118` (worktree `wt-118`, sin push). Pantalla: `components/agenda/AgendaDia.tsx`
  + `lib/agenda/vista-dia.ts`; la monta `/appointments` (vista «Día por profesional»).
- **Banco:** `/dev/agenda/dia`, componente real dentro del shell. Datos de ejemplo: martes 6 de octubre de 2026,
  **10:40** hora de La Paz, 8 citas, nombres inventados. «Ahora» pasó de 08:00 a 10:40: a las 08:00 todo era futuro
  (había una «Completada» y una «No asistió» en el futuro) y el riel no mostraba nada pasado ni en curso.
- **Cómo se tomaron:** Chromium sin cabeza contra `localhost` (con `127.0.0.1` Next 16 no hidrata y la foto sale sin
  tema ni clics), 390 y 1440 de ancho, página completa, Instrument Sans + IBM Plex Mono cargadas, botón «N» de Next
  oculto, ventana estirada a la altura de la página para que la barra inferior y el asistente no tapen citas.
  **Sin scroll lateral en ninguna** (`mediciones.json`: scrollWidth = ancho). Consola: sólo el ruido del banco.
  Las 20 abiertas y miradas.
- **Contraste medido en pantalla** (texto sobre su fondo real, claro / oscuro): pastillas 5,3 a 15,3 / 7,5 a 10,7;
  burbujas de iniciales 8,2 a 8,5 / 9,6 a 10,7; burbuja «10:40» 9,4; resumen 7,6 a 12,1 / 7,5 a 13,5. Todo ≥ 4,5.

## Qué cambió de la v2 a la v3

| | v2 | v3 |
|---|---|---|
| Profesional | nombre en una banda gris y el horario en texto | burbuja con iniciales (un tinte fijo por profesional), nombre en 600, contador en burbuja «4 citas · 2 por confirmar», horario y descanso como chips |
| Horas | «09:00» chica arriba de cada bloque | riel: hora en mono de 20 px, «a 09:30 / 30 min» debajo; punto relleno = ya pasó o se cerró, verde con halo = en curso, anillo = viene |
| Ahora | no existía | si el día es hoy, línea verde con la hora en burbuja («10:40») debajo de lo que ya empezó; camina sola mientras la pantalla sigue abierta |
| Cita | nombre 14 px, rango, pastilla, «Coincide…» como texto rojo, Ver detalle + Confirmar secundario | nombre 17 px en 600; pastilla con fondo suave y punto (Por confirmar ámbar, Confirmada verde, Completada gris tinta, Cancelada roja con el nombre tachado, No asistió gris con borde); «Coincide con otra cita» como chip con ícono; **Confirmar primario** + «Ver detalle ›» de 44 px; la cita en curso con fondo verde suave |
| Arriba | «7 citas en esta vista.» y un párrafo de aviso | «Martes 6 de octubre · Hoy», flechas de día y «Hoy», resumen en burbujas «8 citas · 3 por confirmar · 2 coinciden», «Quitar filtros» si hay filtro; el aviso de zona baja a una nota al pie |
| Celular | `<select>` «Elija un profesional» | fila de burbujas desplazable (iniciales, nombre corto, contador), la elegida en verde |
| Escritorio | una sola columna se estiraba a ~1100 px | la hoja abraza sus columnas (una sola = 26 rem); las cabeceras quedan alineadas entre columnas |
| Vacío / error | texto gris | estado vacío con una salida («Ver mañana», «Volver a hoy» o «Quitar filtros»); el error de guardado en caja roja con ícono bajo su cita |

## PNG por PNG

Escritorio (1440):
- `agenda-dia-varios-profesionales-1440.png`: la principal. Tres columnas; Ana con una atendida, una en curso (fondo
  verde, punto con halo), la línea de las 10:40 y dos por confirmar que se pisan (chip «Coincide»). Luis con su falta
  anotada y la cancelada de las 15:30 (tachada, punto relleno: ya no es trabajo pendiente).
- `agenda-dia-varios-profesionales-oscuro-1440.png`: lo mismo en modo oscuro.
- `agenda-dia-un-profesional-1440.png`: filtro Profesional = Dra. Ana. La hoja mide lo que su columna (antes se estiraba).
- `agenda-dia-filtro-sin-resultados-1440.png`: Ana + estado Cancelada: «0 citas», «Sin citas con este estado» y «Quitar filtros».
- `agenda-dia-doctor-mi-agenda-1440.png`: lo que ve el doctor: su columna sola, sin filtro de profesional.
- `agenda-dia-confirmar-hecho-1440.png`: después de «Confirmar» a Lucía: pastilla verde, sin botón, el resumen baja a 2.
- `agenda-dia-solo-lectura-1440.png`: sin permiso de gestionar: ningún «Confirmar», queda «Ver detalle».
- `agenda-dia-error-al-guardar-1440.png`: «No se pudo guardar el cambio. Revise su conexión.» bajo la cita de Lucía.
- `agenda-dia-dia-vacio-1440.png`: día sin citas: estado vacío con «Ver mañana».
- `agenda-dia-en-pantalla-citas-1440.png`: la pantalla real de Citas (`/dev/agenda`, reloj real: jueves 8, 17:23) con
  «Día por profesional» activo: el componente montado donde vive.

Celular (390):
- `agenda-dia-varios-profesionales-390.png`: burbujas de profesional (Dra. Ana elegida, 4), su columna con el riel.
- `agenda-dia-varios-profesionales-oscuro-390.png`: lo mismo en modo oscuro.
- `agenda-dia-selector-luis-390.png` y `agenda-dia-selector-sin-profesional-390.png`: tocando otra burbuja; el resumen
  de arriba sigue siendo el del día.
- `agenda-dia-doctor-mi-agenda-390.png`: el doctor no ve burbujas (una sola opción).
- `agenda-dia-confirmar-hecho-390.png`, `agenda-dia-solo-lectura-390.png`, `agenda-dia-error-al-guardar-390.png`,
  `agenda-dia-dia-vacio-390.png`: los mismos casos de escritorio.
- `agenda-dia-en-pantalla-citas-390.png`: la pantalla real de Citas en el celular.

## Lo que todavía no me convence

- **Cada cita ocupa tres renglones** (nombre, estado, botones). En un día de 15 citas por profesional es mucho scroll,
  y «Ver detalle» repetido en cada una pesa. Opción para otra vuelta: que el nombre abra el detalle y las cerradas
  queden en un renglón.
- **El motivo de la cita no se muestra.** C5 decidió no mostrar motivo ni notas en esta vista y hay un test de
  privacidad que lo cuida; lo respeté. Si Sergio Urcullo lo quiere, es una decisión a cambiar a propósito.
- **La línea de «ahora» va una por columna**, cada una a su altura, porque las columnas son compactas: no es una sola
  recta que cruce la hoja como en la maqueta.
- **Los tintes de las burbujas** (verde, índigo, rosa, violeta, cian, piedra) salen de la paleta de Tailwind, no de
  tokens de `globals.css`, y el test de tokens no los mide (los medí a mano, arriba). Si cobradores y pacientes usan
  burbujas en las otras pantallas, conviene pasarlos a tokens y a una pieza del kit.
- **La vista «Mes» sigue con los colores viejos** (Pendiente amarillo, Completada azul): la misma cita cambia de
  color y de rótulo al pasar de Mes a Día.
- **El campo «Día» muestra 10/06/2026** en el formato del navegador (mes/día en este Chromium); el título «Martes 6 de
  octubre» lo aclara, el campo no.
- **De otras piezas, no de esta pantalla:** «Gestioná la agenda… de tu clínica» en el encabezado de Citas y
  «Preguntá por tu negocio» en la barra del asistente siguen de vos; los errores de `AgendaClient`
  («Intentá de nuevo») también. Es un barrido de voz de todo el producto, no de esta vista.
- En 1024 de ancho la tercera columna queda cortada (se desplaza dentro de la hoja) y los filtros bajan a dos renglones.

## Si Sergio Urcullo quiere las horas alineadas entre columnas

La hoja ya alinea las cabeceras con `subgrid`. Alinear las horas es extender eso: una fila de la grilla por cada hora
de inicio del día (`dia.horas`, ya calculado), cada columna pone su cita en la fila de su hora y deja vacía la celda
de las horas ajenas; el alto de cada fila es el de la cita más alta a esa hora, no una franja fija. La línea de
«ahora» pasa a ser UNA fila que cruza todas las columnas, como en la maqueta. Costo: vuelven huecos (más chicos que
en la v1) en la columna que no tiene cita a esa hora. En el celular no cambia nada (una columna a la vez).
Variante intermedia: alinear sólo la línea de «ahora» (pasado arriba, futuro abajo); se ve como la maqueta, pero en
la columna con menos citas pasadas lo que viene queda empujado hacia abajo, y lo que viene es lo que la recepción mira.
