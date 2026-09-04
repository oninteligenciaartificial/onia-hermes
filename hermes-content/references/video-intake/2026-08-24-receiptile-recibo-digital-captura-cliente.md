# Receiptile: el recibo digital es la excusa, lo que capturan es al cliente

- **Fuente:** https://www.instagram.com/p/DcHc0iAE977/ · @Receiptile
- **Tipo:** SaaS · **Veredicto:** SIRVE YA
- **Cobertura:** las 6 láminas, al 100%.

> ⚠️ **Sin audio.** Speaches devolvió `fetch failed` en todo este lote y el anterior. Nada de
> lo que sigue afirma qué se *dice* en el video: sale del texto en pantalla y del caption.

## Qué muestra, textual

- **Lámina 1:** *"Receipts just changed forever."* + a mano: *"see ya later receipt paper"*. Un tile blanco en el mostrador con icono NFC y el texto `Need a receipt? Hold phone here`.
- **Lámina 2:** *"Hold your phone over Receiptile. Make sure the phone is awake. **No need to double tap.**"*
- **Lámina 3:** el recibo en el teléfono, con logo y datos del comercio (`OAK SUPPLY`, dirección, ABN), ítems con miniatura, subtotal, GST, `Total $76.50`, método de pago (`EFTPOS ... 4321`), código de barras y botón `Download Receipt`.
- **Lámina 4:** *"There's your receipt. Save it & send it however you'd like."* Con destinos: **Photos, PDF, Xero, Hubdoc, Dext, Expensify**.
- **Lámina 5:** *"Tell them you loved it."* — encima del recibo aparece `How was your experience?` con 5 estrellas y botón **`Leave us a review on Google`**. Debajo: `Sign up for exclusive deals` con campo de email y botón `Join & Save`. Y `Rewards Program: every purchase gets you closer to a reward`.
- **Lámina 6:** *"Forget paper loyalty cards."* — progreso `5/7 Visits`, `2 more visits until your next reward`, código `FREESHIPPING` para comprar online, y `Charge to your room` (hotelería).

## Cómo está hecho — la reconstrucción

- **El recibo no es el producto.** El producto es el espacio DEBAJO del recibo: reseña de Google, captura de email, programa de fidelidad y cupón. El recibo es la única pantalla que el cliente mira sí o sí después de pagar, y ahí es donde meten todo lo demás.
- **La máquina de estados:** pago cerrado → recibo emitido → cliente lo abre (NFC, sin app) → se le ofrecen 4 acciones (guardar, reseñar, suscribirse, sumar visita) → cada una es un evento de CRM.
- **Por qué el NFC importa:** no hay app que instalar ni QR que escanear mal. El costo de fricción es apoyar el teléfono.
- **Lo portable sin hardware:** todo lo de la lámina 5 y 6 se puede hacer con el recibo digital que ya emitimos por WhatsApp o link, sin comprar un tile NFC.

## El estilo, como conocimiento portable

Fondo blanco puro, mucho aire, tipografía sans grotesca **bold en negro** con una palabra clave en **verde menta `#00B87C`**. Producto fotografiado limpio o mockup de teléfono centrado. Una idea por lámina, titular de dos líneas arriba-izquierda. Detalle: los subrayados y la nota manuscrita ("see ya later receipt paper") rompen la asepsia y le dan carácter — es lo único no-corporativo de todo el carrusel.

**Se porta a:** `hermes-content/references/ui-patterns/recibo-digital-con-acciones/` (carpeta nueva) — la plantilla de recibo con las 4 acciones apiladas debajo.

## Las tres preguntas

1. **Frente:** onia-platform — rubro comercio y gastronomía. De rebote, marketing.
2. **Herramienta nuestra:** ONIA Core tiene venta y producto. La capa de recibo digital con acciones no existe.
3. **Qué falta:** Nada técnico para la versión sin hardware (recibo por link + acciones). El tile NFC es otra conversación.

## Lo que NO se puede afirmar

- Nada sobre el audio: no hay transcripción de este lote.
- Los hex de esta ficha son aproximados salvo donde diga que están escritos en pantalla.

**Prompt:** [Q08](prompts-lote-2026-08-24/Q08-receiptile-recibo-digital-captura-cliente.md)
