# ¿El checkout de Onia captura la tarjeta en nuestra página? — NO, y no hay tarjeta

> **2026-08-12. Verificación previa a construir un formulario de tarjeta con
> vista previa en vivo (número, nombre, vencimiento, flip al CVV).**
> **Resultado: el componente NO se construye.** No existe el formulario donde
> montarlo, y en el modelo de cobro decidido nunca va a existir del lado nuestro.

---

## 1. La respuesta en tres líneas

1. Con el modelo **Facilitador** (QR Simple / BNB / BCP) **no hay tarjeta en el
   flujo**: el instrumento es un **QR que el pagador escanea en la app de SU
   banco**. Autenticación, autorización y datos del instrumento ocurren
   íntegramente dentro de la app bancaria del pagador.
2. Nuestra página **no captura ni redirige**: solo **muestra el QR y espera la
   confirmación** (hoy por comprobante subido a mano; mañana por webhook o
   extracto). Es un flujo **fuera de banda**, ni in-page ni redirect clásico.
3. Por lo tanto **no hay dónde montar un formulario de tarjeta**, y un componente
   de vista previa con flip al CVV no tiene datos de entrada que reflejar.

---

## 2. Evidencia — código en producción

Repo `C:\dev\proyectos\onia-platform`, ruta `/checkout`
(`app/checkout/CheckoutClient.tsx`, `page.tsx`, `checkout.css`). Leído
2026-08-12 en modo lectura.

- **Cero campos de tarjeta.** `grep -niE "tarjeta|card|visa|mastercard|cvv"` sobre
  `app/checkout/` no devuelve **ningún input**: los únicos `card` son clases CSS
  de maquetación (`.co-card`, `--co-shadow-card`) y la variable `cicloCard`.
- **El copy del producto lo dice explícito** (`CheckoutClient.tsx`, sección
  `co-hero`): *"Pagás por QR desde tu app bancaria, subís el comprobante y el plan
  se activa apenas se verifica el pago. **Sin tarjeta, sin contratos.**"*
- **El stepper del cobro** tiene el paso 2 literal: *"Pagá por QR"*.
- **El bloque de pago** (`.co-qrbox`) renderiza `/assets/qr-payment.png` — QR
  estático — con el monto y el texto *"Sirve con cualquier app bancaria de
  Bolivia. Después subí la captura del comprobante acá al lado."*
- **El slot futuro también es QR, no tarjeta.** Comentario en el código, textual:
  *"SLOT QR DINÁMICO (BCP): cuando el banco entregue la API, este bloque pasa a
  renderizar el QR generado con el monto exacto, vencimiento y referencia nuestra
  — y el comprobante deja de ser necesario (la confirmación llega por
  webhook/extracto)."* La evolución prevista sustituye el QR estático por un QR
  dinámico: **en ningún escenario aparece un campo de tarjeta**.

---

## 3. Evidencia — decisión de arquitectura y base legal

| Fuente (en repo) | Qué establece |
|---|---|
| `hermes-content/docs/platform/ONIA_PAGOS_ARQUITECTURA_20260730.md` §3.1 | Los instrumentos declarados del proveedor son `"qr" \| "redirect" \| "card_token" \| "transfer"`. **`card_token`, nunca PAN en claro.** |
| ídem §3.8 | Recurrencia por `token`: *"Guardamos un token (**nunca el PAN**) y disparamos el cobro cada ciclo. **Alcance PCI a evaluar.**"* |
| ídem §3.6 | El flujo objetivo es `createCharge` → QR/redirect → el cliente paga fuera de nuestro control → webhook/polling. Nuestro front **hace poll del estado**, no captura instrumento. |
| `ONIA_REUNION_BCP_PREP_20260812.md` §Modelo | Facilitador, no Agregador: *"la plata de los clientes finales JAMÁS pasa por cuentas de Onia; cada comercio cobra en SU cuenta; Onia es el software que genera el QR y concilia."* Base: Reglamento de Servicios de Pago **BCB Res. 079/2022**. |
| `ONIA_CHECKOUT_Y_REUNION_BCP_20260802.md` §1 | Los 4 pasos del checkout: elegir plan (nuestro) · **QR dinámico** (del banco) · lectura del movimiento (del banco) · activación (ya resuelta). No hay paso de captura de instrumento. |
| memoria `[[onia-pasarelas-pago-bolivia]]` | Riel = **QR Simple interoperable** (BCB Res. 137/2019). El QR lleva la cuenta del receptor; la plata cae directo en la cuenta del comercio. |

---

## 4. El escenario "y si algún día hay tarjeta" — sigue sin habilitar in-page

La tarjeta está planteada como pregunta **abierta y sin responder** al banco, no
como diseño. En `ONIA_BCP_REUNION_20260805.md`:

- **D5** `[PREGUNTAR]`: *"Si en el futuro queremos tarjeta (Visa/Mastercard), ¿BCP
  lo provee o hay que ir a un procesador aparte?"* — Justificación registrada:
  *"Define si podemos venderle a clientes de fuera de Bolivia y **si entramos en
  alcance PCI**."*
- **I4** `[PREGUNTAR]`: *"Si en algún momento hay tarjeta: ¿la captura de datos es
  **del lado del banco (fuera de nuestro alcance PCI)** o nuestro?"*

Las dos preguntas siguen marcadas `[PREGUNTAR]` — la reunión con BCP es **hoy
2026-08-12** y aún no hay respuesta escrita. La intención declarada del propio
documento es que la captura sea **del lado del banco**.

La alternativa registrada para recurrencia — **Libélula (Todotix SRL)**, en
`ONIA_REUNION_BCP_PREP_20260812.md` §1-bis — ofrece *"débito automático,
**tarjetas tokenizadas** y pagos recurrentes por API"*. Tokenizadas = el PAN lo
captura el SDK/iframe del proveedor, no nuestro formulario.

**Conclusión del escenario futuro:** incluso si mañana entra tarjeta, entra como
`card_token` vía SDK/iframe del proveedor. El número nunca toca nuestro servidor
ni nuestro estado de React. Un formulario propio que lea el PAN para animar una
vista previa metería a Onia en **alcance PCI-DSS** (auditoría, certificación,
responsabilidad legal sobre datos de tarjeta) a cambio de un adorno visual.

---

## 5. Decisión

**No se construye el componente de tarjeta con vista previa en vivo.** No es una
postergación por falta de tiempo: es que el flujo de cobro decidido no tiene
formulario de tarjeta, ni lo va a tener del lado nuestro.

**Si alguna vez se reabre**, el disparador es exactamente uno: que **D5/I4**
vuelvan del banco (o de Libélula) confirmando un **SDK/iframe de tokenización**.
En ese caso el número vive dentro del iframe del proveedor y la vista previa solo
podría reflejar los campos **no sensibles** que el SDK exponga por callback
(marca detectada, últimos 4, vencimiento) — nunca el PAN completo leído por
nosotros.

**Restricción de UI que sí sigue vigente** para cualquier checkout (RD 079/2022
art. 36 d) y e), vía `ONIA_PAGOS_ARQUITECTURA_20260730.md` §3.8b): **no se puede
mostrar recargo por pagar con QR ni exigir monto mínimo**. La comisión, si
existe, se absorbe en el precio del plan; jamás aparece como línea extra en el
checkout.

---

Relacionado: `ONIA_PAGOS_ARQUITECTURA_20260730.md` ·
`ONIA_BCP_REUNION_20260805.md` · `ONIA_REUNION_BCP_PREP_20260812.md` ·
`ONIA_CHECKOUT_Y_REUNION_BCP_20260802.md` · memoria `[[onia-pasarelas-pago-bolivia]]`
