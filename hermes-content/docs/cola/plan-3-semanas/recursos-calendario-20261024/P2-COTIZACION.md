# P2 · Una respuesta segura necesita una fuente

Fecha propuesta: 25-oct-2026. Audiencia: quien redacta presupuestos con IA. Objetivo observable: rastrear precios a catálogo y separar producto de condiciones desconocidas. Reel vertical, 65–80 s estimados; propuesta de receta Erik para comparación con datos. No hay prueba de proveedor de IA ni cotización comercial de ONIA.

## Entrada y control

Pedido: 3 cuadernos A5 y 2 lapiceras azules. Fuente única de precios: `precios-demo.csv`, **catálogo ficticio**; 1850 y 400 centavos = Bs 18,50 y Bs 4,00. No establece envío ni plazo. Respuesta floja construida para la lección: «Tu pedido sale Bs 60, con envío gratis y entrega mañana». No atribuirla a un modelo ni decir que ocurrió en atención real.

Consigna copiable: «Con este pedido y este catálogo sintéticos, prepará un borrador de cotización. Mostrá cantidad × precio y subtotal de productos. No inventes descuentos, stock, envío ni plazo. Si falta un dato, indicá POR CONFIRMAR. No presentes el subtotal como total final ni confirmes la venta».

Salida esperada redactada:

```text
BORRADOR · DATOS SINTÉTICOS
3 cuadernos A5 × Bs 18,50 = Bs 55,50
2 lapiceras azules × Bs 4,00 = Bs 8,00
Subtotal de productos: Bs 63,50
Envío: POR CONFIRMAR
Plazo y disponibilidad: POR CONFIRMAR
Total final: pendiente de condiciones confirmadas
```

## Hablado natural y plano a producir

| Tramo estimado | Hablado | Pantalla / plano a producir |
|---|---|---|
| 0–10 s | Esta cotización dice sesenta bolivianos y envío gratis. Suena resuelta. Pero mirá la lista de precios que tiene al lado. | Comparación, rótulos RESPUESTA DE EJEMPLO y CATÁLOGO FICTICIO; destacar Bs 60 y envío |
| 10–25 s | El ejemplo es inventado. Tenemos tres cuadernos a dieciocho cincuenta y dos lapiceras a cuatro. Antes de mejorar el tono, comprobá de dónde sale cada número. | Mostrar dos filas del CSV con equivalencia de centavos a Bs; producto y precio alineados |
| 25–41 s | Tres por dieciocho cincuenta da cincuenta y cinco cincuenta. Dos por cuatro da ocho. Los productos suman sesenta y tres cincuenta. Eso es el subtotal. | Cálculo línea por línea y subtotal; mantener visibles cantidades y precios |
| 41–56 s | ¿Y el envío gratis? Esa condición no aparece. Tampoco hay un plazo confirmado. Pedile a la IA que deje esos campos por confirmar, sin convertir el subtotal en total final. | Tachar solo las afirmaciones sin sustento; mostrar campos pendientes y consigna |
| 56–72 s | Así podés revisar una respuesta: número, fuente y condición. Que esté bien escrita no alcanza para mandarla. Revisá qué parte de esa respuesta no tiene fuente. | Salida esperada completa como BORRADOR; sostener para pausar y cerrar con único CTA |

## Qué demuestra y qué falta

El espectador puede reconstruir Bs 63,50 y marcar tres afirmaciones sin respaldo: Bs 60, envío gratis y entrega mañana. Pasa si distingue subtotal de total, no añade stock y mantiene envío/plazo pendientes. Contraprueba: preguntar «¿y si le agrego un descuento?»; no aplicarlo si la fuente no lo autoriza. El descuento del ejercicio P3 es un supuesto nuevo y separado.

Capturas a producir: catálogo local, respuesta didáctica y corrección manual. No presentar la corrección como salida real de IA. El comprobador cruza precios/cantidades y obtiene Bs 63,50; no demuestra que un bot respete la fuente. Faltan captura, cámara, edición y revisión/OK de Sergio. No hay CTA de venta, asesoría ni recurso supuestamente publicado.
