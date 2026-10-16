# Caja diaria (PR #110 + arreglos C8b) — capturas v2

Caja del día: apertura, cobros por medio de pago y por persona, egresos y cierre con el efectivo contado. Banco `/dev/caja-diaria` (componente real `CajaDiariaClient` dentro del shell, API simulada en el navegador); el dueño ve esperado y descuadre, recepción no. Código en `7fc9e79f` (rama `wip/c110`). Datos de ejemplo: jueves 8 de octubre, fondo Bs 100, cobros de Camila Rojas y la Dra. Ana Aramayo por Bs 550, egreso «Taxi» Bs 20, esperado Bs 230. 16 PNG, todos abiertos y mirados.

Cómo se tomaron: Chromium sin cabeza, 390 y 1440 de ancho, página completa, tipografía de la marca cargada. Ajustes de captura, no del producto: se ocultó con CSS el botón «N» de Next en desarrollo; la ventana se estira a la altura de la página sólo para la foto (así la barra inferior, el asistente y la barra lateral quedan al final y no tapan contenido); el puntero se aparta antes de cada foto. El 225 se escribió con teclado real en «Efectivo contado».

## Problemas de la primera ronda

| | Antes | Ahora | PNG que lo prueba |
|---|---|---|---|
| a | Recepción veía «Efectivo esperado Bs 0,00» y un «Descuadre» rojo falso | **Arreglado.** Recepción no ve la tarjeta de esperado, y el cierre no muestra Esperado ni Descuadre, ni antes ni después de escribir 225 | `caja-diaria-abierta-recepcion-1440.png`, `…-abierta-recepcion-contando-225-390.png`, `…-contando-225-1440.png`, `…-cerrada-recepcion-390.png` |
| b | Dueño sin escribir nada veía «Descuadre −Bs 230» en rojo | **Arreglado.** Con el campo vacío sólo dice «Esperado: Bs 230,00». Con 225 escrito: Contado 225, Esperado 230, Descuadre −Bs 5,00 en rojo (ese sí es real) | `…-abierta-dueno-390.png`, `…-abierta-dueno-1440.png` (vacío); `…-abierta-dueno-contando-225-390.png`, `…-1440.png` |
| c | Sin tildes: «dia», «Todavia», «duenio» | **Arreglado.** «Salidas del día», «Todavía no hay cobros hoy.», «Solo el dueño ve el detalle completo.», «se revisa mañana» | `…-sin-abrir-dueno-390.png`, `…-cerrada-recepcion-390.png` |
| d | Rótulos EFECTIVO / TRANSFERENCIA en crudo y tarjetas STRIPE y OTRO en Bs 0,00 | **Arreglado.** Filas «Efectivo · Camila Rojas», «QR / Billetera · Dra. Ana Aramayo», «Transferencia · …»; ya no salen STRIPE ni OTRO en Bs 0,00 (Efectivo se muestra siempre; los demás medios, cuando tienen plata: QR / Billetera, Tarjeta, Transferencia). La mayúscula del rótulo chico sobre cada tarjeta es el estilo de etiqueta del diseño; el texto es «Efectivo», «Transferencia» | `…-abierta-dueno-1440.png` |
| e | No decía de qué día era la caja | **Arreglado.** Título «Caja del jueves 8 de octubre» en las 16 capturas | cualquiera, por ejemplo `…-sin-abrir-dueno-1440.png` |
| f | La nota del cierre no se mostraba | **Arreglado.** Dueño: «Nota del cierre: Falta un billete de Bs 5; se revisa mañana.» junto a Contado, Esperado y Descuadre. Recepción: la misma nota y «El cierre ya fue guardado. Solo el dueño ve el detalle completo.», sin contado, esperado ni descuadre | `…-cerrada-dueno-390.png`, `…-cerrada-dueno-1440.png`, `…-cerrada-recepcion-390.png`, `…-cerrada-recepcion-1440.png` |

Las seis combinaciones (sin abrir, abierta y cerrada, cada una como dueño y como recepción) salen en 390 y en 1440, más «abierta» con 225 escrito para los dos roles. «Dueño con el campo vacío» es `caja-diaria-abierta-dueno-*`. Sin scroll lateral en ninguna (scrollWidth 390 y 1440).

## Lo raro que se ve ahora

- **Sin abrir, el dueño ve «Efectivo esperado Bs 0,00»** aunque la caja ni se abrió. Es un cero verdadero, no el nulo mal impreso de antes, pero no informa nada (`caja-diaria-sin-abrir-dueno-390.png`, `…-1440.png`). Recepción ya no lo ve.
- **Escritorio, la tarjeta «Cobros» queda muy alta con un vacío blanco debajo** porque se estira a la altura de la columna derecha (Egresos y Cierre): sobran unos 350 px en la abierta y casi 100 en la sin abrir (`caja-diaria-abierta-dueno-1440.png`, `caja-diaria-sin-abrir-dueno-1440.png`).
- **Celular, la caja abierta del dueño mide 2133 px:** los cuatro medios salen como tarjetas de ancho completo y debajo la lista por persona repite los mismos montos (`caja-diaria-abierta-dueno-390.png`).
- **«Cerrada» muestra el nombre de quien abrió** («Camila Rojas») sin decir que abrió; puede leerse como quien cerró (`caja-diaria-cerrada-dueno-390.png`).
- **Del shell, no de esta pantalla:** «Preguntá por tu negocio» (de vos) en la barra del asistente, capturas de 1440 (`components/ayuda/BarraAsistente.tsx`, líneas 116 y 121). Sigue igual que en la primera ronda.
- Sin texto cortado, sin inglés y sin otras formas de vos en la pantalla (barrido por script del texto de las 16 capturas). Consola: sin errores; sólo una petición del shell abortada al cambiar de página (`/api/onboarding/tour`).

## Archivos

`caja-diaria-{sin-abrir-dueno, sin-abrir-recepcion, abierta-dueno, abierta-recepcion, cerrada-dueno, cerrada-recepcion, abierta-dueno-contando-225, abierta-recepcion-contando-225}-{390,1440}.png` (16).
