# Q08 · Receiptile: el recibo digital es la excusa, lo que capturan es al cliente

- **Destino:** `onia-plattform`
- **Sale de:** [la ficha](../2026-08-24-receiptile-recibo-digital-captura-cliente.md) · `DcHc0iAE977` · @Receiptile
- **Fuente:** https://www.instagram.com/p/DcHc0iAE977/
- **Qué falta para hacerlo hoy:** Nada técnico para la versión sin hardware (recibo por link + acciones). El tile NFC es otra conversación.

---

```text
Objetivo único: especificar el "recibo digital con acciones" para el rubro comercio, y decir qué parte ya existe en el core.

De dónde sale: ficha `receiptile-recibo-digital-captura-cliente` (IG DcHc0iAE977). El hallazgo NO es el recibo: es que el recibo es la única pantalla que el cliente mira sí o sí después de pagar, y ahí se le pide reseña, email y fidelidad.

Lo que hace el producto observado, verificado lámina por lámina:
- recibo digital con logo, ítems, subtotal, impuesto, total, método de pago y código
- exportar a Photos / PDF / Xero / Hubdoc / Dext / Expensify
- "How was your experience?" con 5 estrellas -> botón "Leave us a review on Google"
- captura de email: "Sign up for exclusive deals"
- fidelidad: progreso "5/7 visitas, 2 más para tu premio"
- cupón de envío gratis para la tienda online
- "charge to your room" para hotelería

Pasos:

1) Contrastar contra ONIA Core: ¿existe la entidad venta con sus líneas? ¿existe cliente? ¿existe algo de fidelidad o de puntos? Citar archivos del core, no la memoria. Marcar EXISTE / NO EXISTE / EXISTE PERO APAGADA.

2) Diseñar la versión SIN HARDWARE, que es la que se puede hacer ya: el recibo se manda por WhatsApp o por link corto después de cerrar la venta. Nada de NFC. Especificar la pantalla: qué se ve arriba (el recibo) y qué se apila debajo (reseña, email, fidelidad, cupón).

3) Para Bolivia hay una restricción que el original no tiene y no se puede ignorar: la factura fiscal es la factura fiscal. Este recibo NO la reemplaza ni la simula. Dejar escrito cómo conviven — recibo digital de cortesía por un lado, documento fiscal por el otro. Si hay duda, consultar la skill de contabilidad boliviana antes de escribir una línea sobre esto.

4) Priorizar las 4 acciones por retorno para un comercio chico y decir cuál se enciende primero. Mi lectura: la reseña de Google es la de mayor retorno y la más barata, porque no necesita CRM ni catálogo online.

NO se implementa. El entregable es la especificación.

LISTO = una spec con la tabla contra el core, el diseño de la pantalla sin hardware, el párrafo de convivencia con la factura fiscal boliviana, y las 4 acciones priorizadas con la primera elegida y justificada.
```
