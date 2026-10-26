# P1 · Del mensaje a seis columnas

Fecha propuesta: 24-oct-2026. Audiencia: quien organiza pedidos recibidos por texto. Objetivo observable: transcribir un mensaje a filas, conservar cantidades y señalar un campo ausente. Reel vertical; duración estimada 65–80 s con pausas de lectura. Propuesta de receta Erik para tutorial: resultado en el cuadro 0, cámara base, panel legible durante la extracción. Rodaje y montaje pendientes.

## Entrada, material y salida

Abrir `mensaje-demo.md` y `pedido-esperado.csv` en un editor local o una hoja que ya esté disponible; no instalar nada. Mostrar el rótulo **CASO SINTÉTICO · TABLA DE EJEMPLO**. Entrada exacta: «Soy Cliente DEMO A; quiero 3 cuadernos A5 y 2 lapiceras azules; entrega el 26/10/2026; pago al recibir».

| cliente | producto | cantidad | fecha_solicitada | pago | direccion |
|---|---|---|---|---|---|
| Cliente DEMO A | cuaderno A5 | 3 | 2026-10-26 | al recibir | POR CONFIRMAR |
| Cliente DEMO A | lapicera azul | 2 | 2026-10-26 | al recibir | POR CONFIRMAR |

Salida final: pedido pendiente; preguntar dirección; no prometer entrega el 26. La fecha cambia de formato sin cambiar su significado. La clave fue redactada y cotejada con herramientas locales, no generada en una prueba de IA.

## Hablado natural y plano a producir

| Tramo estimado | Hablado | Pantalla / plano a producir |
|---|---|---|
| 0–9 s | Mirá esta celda: dice «por confirmar». No es un error. En este mensaje nadie escribió una dirección. | Tabla final desde cuadro 0; acercamiento a dirección; cámara en panel inferior, sin cubrir datos |
| 9–23 s | Vamos a ordenar este pedido inventado. Dice tres cuadernos A5, dos lapiceras azules y pago al recibir. Primero separá los productos y las cantidades. | Abrir mensaje; resaltar «3 cuadernos A5», después «2 lapiceras azules», después pago |
| 23–39 s | Después armá seis columnas: cliente, producto, cantidad, fecha solicitada, pago y dirección. Cada producto lleva su fila. Tres y dos son cantidades; no son cinco filas. | Completar dos filas; primero mostrar columnas de producto y cantidad, después resto; sostener tabla para pausar |
| 39–56 s | Ahora buscá lo que falta. La dirección no está, así que no la completés. Y el 26 es la fecha que pide la persona, no una entrega que ya confirmamos. | Dirección POR CONFIRMAR en ambas filas; fecha con rótulo SOLICITADA |
| 56–69 s | La tabla está ordenada, pero el pedido sigue pendiente. La siguiente pregunta es: ¿cuál es la dirección de entrega? Pausá y armá tu tabla con esas seis columnas. | Estado PENDIENTE; pregunta visible; CTA único al final |

## Consigna y prueba del espectador

La consigna copiable está en `mensaje-demo.md`. Hacé una segunda pasada tapando la clave: escribir dos filas y explicar por qué dirección no se llena. Se acepta si conserva cliente, 3/2 unidades, fecha y pago, y marca las dos direcciones ausentes. Falla si inventa domicilio, confirma disponibilidad o fecha, cambia cantidades o convierte unidades en filas.

## Captura y verificación antes de grabar

Grabar el armado local real, con solo documentos sintéticos abiertos y sin notificaciones. Capturar mensaje, extracción de campos y tabla final; no reconstruir una interfaz de IA. Mostrar que es una tabla preparada para el ejercicio. El comprobador valida esquema, dos filas y valores. No valida capacidad de ningún modelo. Si se usa IA en el rodaje, guardar primero su salida real y revisarla con esta clave; hasta entonces no decir «la IA lo hizo». No hay promesa de recurso en comunidad. Pendiente: captura, cámara, edición, revisión editorial y aprobación de publicación.
