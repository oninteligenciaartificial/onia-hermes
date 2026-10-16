# Prepago anual: propuesta de política de devolución (16-oct-2026)

> **Es una propuesta con evidencia. No está fijada.** Decide Sergio Urcullo (pidió «investigá cómo funciona», 16-oct). Hilo Ventas y pauta.
> Cambiarla toca un texto legal: los Términos lo deciden él y Leslie Mercado Moreno. Nada de esto se dice a un cliente hasta entonces.

## 1. Lo que ya está escrito hoy (conflicto a resolver)

- Los Términos §3.3 dicen que **lo pagado no se reembolsa**; Sergio Urcullo lo eligió el 25-sep. Lo refleja un comentario en `onia-platform/app/checkout/CheckoutClient.tsx:849` y una prueba (`factura-por-cada-pago.test.ts:37`) que **falla si el checkout promete devolver**.
- La baja es sin penalidad pero no reembolsa por adelantado (`lib/subscription/baja.ts`).
- Lo que sí existe: prueba de 14 días sin tarjeta («si la prueba no sirve, no se paga nada»). Eso protege **antes** de pagar, no el prepago.
- Por eso los mensajes de `sales-kit/07` llevan ⟦GARANTÍA⟧ y no dicen «devolvemos».

## 2. Qué muestra la evidencia

| Hallazgo | Cifra | Fuente |
|---|---|---|
| Ventana estándar | **30 días** es lo habitual; menos de 14 genera ansiedad; más de 60 invita al abuso. Software: 14 días. SaaS anual: 30 días desde el inicio, con reembolso proporcional | [Fungies, guía 2026](https://fungies.io/digital-product-refunds-2026-guide) |
| Tasa sana de devoluciones | **1-2 %** de lo cobrado; bajo 1 % puede ser una política demasiado dura; sobre 3 % indica problema de producto | misma guía (cita a Dodo Payments) |
| Caso real de software pequeño | ~**5 %** pidió devolución en los primeros meses (versión inicial); **menos de 2 %** con el producto maduro. Motivo más común: «no hace del todo lo que quiero». Garantía de 30 días sin preguntas | [Kalzumeus](https://www.kalzumeus.com/2007/02/05/rates-at-which-shareware-customers-request-refunds/) |
| Costo de no devolver | Contracargo en bienes digitales **1,8 %** (físicos 0,5 %); un contracargo de US$ 50 cuesta ~US$ 73 con tarifas y tarda 60-120 días | Fungies |
| Efecto en ventas | **Sin dato medido** en estas fuentes. La guía solo ilustra que un alza de 2-3 % en conversión con 1,5 % de devoluciones deja ganando al vendedor. No usarlo como promesa | Fungies |
| Ley boliviana (Ley 453) | En el texto leído **no hay derecho de retracto** ni reglas de compra a distancia. Sí: si el servicio no se puede prestar, se devuelve lo pagado con interés (art. 62.3.c); las cláusulas que eximen de responsabilidad al proveedor son abusivas y se tienen por no escritas (art. 22) | [Ley 453](https://www.lexivox.org/norms/BO-L-N453.html) |

Notas: (1) el pago por QR es una transferencia, **no hay contracargos de tarjeta**; devolver es un gesto manual, no una disputa. (2) Las cifras son de software extranjero y de un caso pequeño; sirven de orden de magnitud, no de predicción para Onia. (3) Esto no es asesoría legal: lo revisa Leslie Mercado Moreno.

## 3. Tres opciones

| Opción | Qué es | Riesgo para Onia | Efecto en confianza |
|---|---|---|---|
| **A · Recomendada** | Devolución completa si lo pide **dentro de 14 días** del pago del plan anual. Después, no hay devolución pero se corta la renovación sin penalidad | Máximo: el 100 % de un anual durante 14 días. Con 2-5 % de pedidos, la pérdida esperada es de Bs 64-160 por cada Bs 3.200 vendidos | Alta: es la objeción nº 1 de pagarle un año a quien no tiene clientes ni testimonios |
| B · 30 días y proporcional | Estándar de la industria para SaaS anual | Más tiempo con la plata «prestada» y más cuentas de prorrateo a mano | Algo más alta que A, con más trabajo para Sergio Urcullo |
| C · Mantener los Términos como están | Sin devolución; solo la prueba gratis de 14 días | Cero | Baja para el prepago en frío; funciona solo con quien ya hizo la prueba o la demo |

**Por qué A:** los 14 días igualan la prueba que el producto ya ofrece, no exige prorrateo, y la cifra de devoluciones esperable (≈2-5 %) es mucho menor que el efecto de quitar la duda principal. Es software: devolver cuesta una transferencia, no horas ni stock.

## 4. Lo que implica elegir A (no hecho; requiere su OK)

1. Cambiar Términos §3.3 (texto legal; revisa Leslie Mercado Moreno) y el comentario y la prueba del checkout, en un cambio de Plataforma.
2. Una línea en los mensajes de venta (⟦GARANTÍA⟧ de `sales-kit/07`) y una respuesta del bot.
3. Procedimiento: pedido por WhatsApp o correo; respuesta en 24 h; devolución por el mismo medio en 2 días hábiles; se anota en el registro de pagos.
4. **Efecto sobre la meta de caja:** con A, una venta del 17-oct en adelante **no queda firme antes del 31-oct** (su ventana de 14 días sigue abierta). Con C sí quedaría firme, pero se vende menos. Dato para decidir, no argumento contra A.

## 5. Qué decide Sergio Urcullo

Elegir A, B o C (o una variante). Hasta que lo diga, no se envía ni se publica nada que prometa devolución.
