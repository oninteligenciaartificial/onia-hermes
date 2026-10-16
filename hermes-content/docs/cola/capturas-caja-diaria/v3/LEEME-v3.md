# Caja diaria: capturas v3 (rediseño al lenguaje de la v3 aprobada)

Código en `wt-110`, rama `wip/c110`: `fefe6e92` (rediseño) + `187a9eae` (signo del descuadre a favor). Sin push.
Banco `/dev/caja-diaria` con el componente real y los mismos datos de la v2: jueves 8 de octubre, fondo Bs 100,
4 cobros de Camila Rojas y la Dra. Ana Aramayo por Bs 550, salida «Taxi» Bs 20, esperado Bs 230.
21 PNG, todos abiertos y mirados.

Cómo se tomaron (igual que la v2): Chromium sin cabeza, 390 y 1440, página completa, tipografía de la marca
cargada, botón «N» de Next oculto, ventana estirada a la altura de la página sólo para la foto, puntero
apartado. El 225 se escribió con teclado real en «Efectivo contado». Oscuro: `&tema=oscuro`.

## Qué cambió

| Pedido | Cómo quedó | Dónde se ve |
|---|---|---|
| 1. Hoja héroe | Verde profunda, la única `raised`. Dueño: «Efectivo que debería haber en caja» Bs 230,00 y debajo Fondo · + Cobrado en efectivo · − Salidas. Recepción: «Cobrado hoy» Bs 550,00 con Fondo y Cobros. Sin abrir: invita a abrir con el fondo y el botón, sin ningún «Bs 0,00». | `abierta-dueno-*`, `abierta-recepcion-*`, `sin-abrir-*` |
| 2. Estado | Pastilla con punto: Abierta verde, Sin abrir ámbar, Cerrada con candado y hora. Al lado, burbuja «CR» y «Abrió Camila Rojas · 08:30». | todas, arriba |
| 3. Medios de pago | Barra segmentada (pasos de verde fijos por medio) y burbujas con ícono, nombre y monto. En el celular, 2 por fila (antes, 4 tarjetas a todo el ancho). | `abierta-dueno-390` |
| 4. Cobros por persona | Agrupados: burbuja, nombre, cantidad y total; debajo un riel con un punto del color del medio por cobro, hora, medio y monto. | cualquiera abierta o cerrada |
| 5. Salidas | Burbuja de quién la registró, motivo, hora y monto; «Registrar salida» en una franja compacta (Monto con «Bs» + Motivo). | `abierta-*` |
| 6. Cierre | «Efectivo contado» grande. Dueño: pastilla «Faltan Bs 5,00» roja, «Cuadra» verde o «Sobran» ámbar, con Contado / Esperado / Descuadre chico. Recepción: sin esperado ni descuadre, y al cerrar sólo «Gracias, el dueño revisa el cierre.». La nota la ven los dos. | `*-contando-225-*`, `cerrada-*`, `veredicto-*` |
| 7. Escritorio | Dos columnas que no se estiran: a la izquierda lo que pasó (héroe, medios, por persona), a la derecha lo que se hace (salidas y cierre). Con la caja cerrada, el cierre sube al primer lugar. | `*-1440` |
| 8. Copy | Se sacó «Apertura, cobros, egresos y cierre de tu clínica» (tuteaba y no sumaba). | encabezado |

Medidas: alto en el celular, caja abierta del dueño **1965 px** (v2: 2133); recepción 1877; cerrada 1716 / 1606;
sin abrir 1001. Sin scroll lateral en ninguna. Una sola hoja `raised` en todas. Sin inglés ni «de vos» en la pantalla.

Extras, para mirar con densidad real:
- `dia-cargado-dueno-1440` y `dia-cargado-recepcion-390`: 12 cobros de 3 personas, Stripe y Otro, 3 salidas con un
  motivo largo. Los datos se reescriben en el navegador sobre el banco; no son del banco.
- `veredicto-cuadra-1440` y `veredicto-sobran-1440`: la hoja del cierre con 230 y con 240,5 escritos.

## Lo raro que queda (no es de esta pantalla)

- La barra del asistente dice «Preguntá por tu negocio» (de vos) a 1440. Es del shell; igual que en la v2.
- Las iniciales las arma el kit con la primera palabra: «Dra. Ana Aramayo» da DA y «Lic. Marcelo…» da LV. La barra
  lateral hace lo mismo.
- `KpiTile` pone `font-label` en un `h3` y sale en la sans: los títulos tienen una regla fuera de `@layer` que le gana.
  En la caja se resolvió con un `span`; el kit queda para otra rama.
- Quien sólo mira la caja (sin operarla) no tiene escenario en el banco: lo cubre una prueba de render, no una captura.

## Archivos

`caja-diaria-{sin-abrir,abierta,cerrada}-{dueno,recepcion}-{390,1440}.png` (12),
`caja-diaria-abierta-{dueno,recepcion}-contando-225-{390,1440}.png` (4),
`caja-diaria-abierta-dueno-contando-225-oscuro-1440.png`, `caja-diaria-dia-cargado-dueno-1440.png`,
`caja-diaria-dia-cargado-recepcion-390.png`, `caja-diaria-veredicto-{cuadra,sobran}-1440.png`.
