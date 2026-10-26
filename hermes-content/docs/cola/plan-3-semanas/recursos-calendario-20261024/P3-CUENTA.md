# P3 · Encontrá un boliviano de diferencia

Fecha propuesta: 30-oct-2026. Audiencia: quien usa IA para cuentas de pedidos. Objetivo observable: verificar operaciones y alcance del descuento, sin juzgar por redacción. Reel vertical, 65–80 s estimados; propuesta de receta Erik para datos que se construyen. No es asesoría fiscal ni precio de ONIA.

## Entrada y salida reproducibles

Mismo pedido sintético: tres cuadernos a Bs 18,50 y dos lapiceras a Bs 4. **Solo en este ejercicio** se estipula 10% de descuento sobre productos y Bs 8 de envío confirmado. No son condiciones heredadas del catálogo ni autorizadas para P2. `cuenta-demo.csv` guarda el supuesto y ambas respuestas.

Respuesta incorrecta construida: «Subtotal Bs 63,50; descuento Bs 6,35; envío Bs 8; total Bs 64,15». Los términos parecen coherentes, pero la suma final está mal. No afirmar que un LLM cometió el error.

Consigna copiable: «Verificá esta cuenta sin modificar sus condiciones. Calculá cada línea, subtotal, descuento de 10% solo sobre productos y envío de Bs 8 sin descuento. Contrastá el total con Bs 64,15. Mostrá diferencia y detené el borrador si no coincide».

```text
3 × 18,50 = 55,50
2 × 4,00 = 8,00
Productos = 63,50
Descuento = 63,50 × 0,10 = 6,35
Productos con descuento = 57,15
Total con envío = 57,15 + 8,00 = 65,15
Diferencia contra 64,15 = 1,00
Estado: CORREGIR BORRADOR; no enviarlo con 64,15
```

## Hablado natural y plano a producir

| Tramo estimado | Hablado | Pantalla / plano a producir |
|---|---|---|
| 0–9 s | Acá falta un boliviano. El total dice sesenta y cuatro quince. Vamos a reconstruir la cuenta antes de aceptarla. | Respuesta didáctica en cuadro 0; total 64,15 marcado; rótulo ERROR CONSTRUIDO |
| 9–24 s | Son tres cuadernos a dieciocho cincuenta y dos lapiceras a cuatro. Multiplicá cada línea primero: cincuenta y cinco cincuenta más ocho. Subtotal: sesenta y tres cincuenta. | Mostrar líneas y subtotal al decirlos; captura de cálculo local pendiente |
| 24–40 s | Para este ejercicio, el descuento es del diez por ciento, solo sobre productos. Da seis treinta y cinco. Lo restás y quedan cincuenta y siete quince. | Condición escrita junto al cálculo; 63,50 − 6,35 = 57,15 |
| 40–55 s | Ahora sumá los ocho bolivianos de envío. El total correcto es sesenta y cinco quince. La diferencia con el borrador es un boliviano. | +8,00 después del descuento; comparación 65,15 / 64,15 / diferencia 1,00 |
| 55–71 s | Este error lo armé para mostrarte el control: líneas, descuento y envío por separado. Si el descuento cambia de alcance, cambia la cuenta. Rehacé la cuenta antes de aceptar el total. | Tres pasos visibles; rótulo CORREGIR BORRADOR; único CTA |

## Comprobación y contraprueba

El script local usa centavos enteros: 6350 − 635 + 800 = 6515; diferencia con 6415 = 100. Si se descuenta también el envío, (6350 + 800) × 90% = 6435 centavos: Bs 64,35, otra operación que no respeta la condición. Esta contraprueba muestra por qué primero hay que leer el alcance; no basta con usar calculadora.

El espectador pasa si obtiene Bs 65,15, localiza Bs 1 de diferencia y explica por qué el envío queda fuera del descuento. Falla si trata Bs 64,15 como correcto, altera el descuento para forzar coincidencia o generaliza estos precios como reales. Para la captura se debe mostrar el recálculo local con los supuestos visibles. No hay ejecución LLM acreditada. Pendiente: captura, cámara, edición y revisión/OK de Sergio.
