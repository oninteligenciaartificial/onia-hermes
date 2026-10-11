estado: pendiente
modelo: gpt-6-astra (plata)
carril: plataforma
origen: revisión E4 de Hermes sobre #147 = F136 (onia-hermes `claude/adoring-ramanujan-7sjzwv` 687266e5, docs/cola/loop/hermes-jarvis.md §E4): los tres MEDIUM «condición para el siguiente PR» y el borrado de cobros de un día cerrado. Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C); líneas medidas en `codex/f136-caja-odontograma` `4bd9da9c`.

# F136b · La caja de otro día se puede cerrar y reabrir, reabrir deja el porqué y un cobro de un día cerrado no se borra

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-f136b`. La madre la prepara desde `origin/master` con #147 ya
mergeado y te pasa el SHA base. No hagas git: la madre revisa, corre la suite completa, commitea y abre el PR.

## META
Tres fallas en código que entra a `master` con #147:
1. **Solo se opera la caja de HOY.** `POST /api/caja-diaria` toma siempre `getTodayRangeUTC` (`app/api/caja-diaria/route.ts:233`)
   para `close` (`:366` en adelante) y `reopen` (`:286` en adelante). Si se reabre la caja y no se vuelve a cerrar antes de las
   00:00 de La Paz, ese día queda abierto para siempre. Lo mismo pasa con una caja que se abrió y nadie cerró. Y un cierre
   equivocado de ayer no se puede reabrir: el `POST /api/payments` con fecha de ese día sigue dando 409
   (`app/api/payments/route.ts:73-74`).
2. **Reabrir no deja el porqué.** `reopenSchema` no tiene campos (`route.ts:39`) y el botón reabre con un clic, sin confirmar
   (`app/(dashboard)/caja-diaria/CajaDiariaClient.tsx:690`). Reabrir borra el arqueo guardado (`route.ts:300-315`). La
   auditoría `DAILY_CASH_REOPENED` (`:321-333`) guarda quién, cuándo, el contado, el esperado y el descuadre. No guarda el
   motivo, los totales por método, el total cobrado, los egresos ni el fondo inicial.
3. **Un cobro de un día cerrado se borra sin rastro.** `DELETE /api/payments/[id]` (`app/api/payments/[id]/route.ts:22-37`)
   borra el pago aunque la caja de su día esté cerrada. El `POST` sí lo frena (`payments/route.ts:73-74`, 409 «La caja de
   ese día ya está cerrada»). Además el borrado no escribe auditoría: el monto desaparece, y el cierre guardado deja de
   coincidir con sus cobros.

## Qué hacer
1. **Cerrar y reabrir otro día.** `close` y `reopen` aceptan `date` opcional (`YYYY-MM-DD`, el mismo `DATE_RE` de `:15`).
   - Sin `date` se usa hoy, como ahora.
   - Con `date`: el día, en la zona del negocio (`timezoneDeOrg`), tiene que estar entre hoy y 7 días atrás. Futuro o más
     viejo → 400 con el motivo de usted.
   - El cierre de otro día suma los cobros y egresos de ESE día (`getDayRangeUTC(date, timezone)`), igual que hoy.
2. **Aviso de un día que quedó abierto.** `GET /api/caja-diaria` devuelve también el día abierto más reciente de esos 7
   días anteriores a hoy, si hay uno: fecha, fondo inicial y que está abierto.
   - La pantalla lo muestra arriba: «La caja del {día} quedó abierta. Ciérrela para que el arqueo de ese día quede guardado.»
   - El botón «Cerrar la caja del {día}» abre el mismo cierre con confirmación que ya existe (`leerMonto`, contado y nota),
     con `date`.
   - Se reutilizan los componentes del cierre; no se agrega una pantalla nueva.
3. **Reabrir pide motivo y confirmación.**
   - `reopenSchema` exige `reason` (trim, 3 a 180 caracteres, como el egreso) y acepta `date`.
   - La pantalla pide el motivo en un paso de confirmación: «¿Reabrir la caja del {día}? Se borrará el arqueo guardado
     (contado Bs X, descuadre Bs Y) y habrá que volver a cerrarla.»
   - El botón se apaga con `disabledReason` visible mientras el motivo no llegue a 3 caracteres.
   - La auditoría agrega al `oldValue` lo que se borra: `openingFund`, los seis `total*`, `totalCobrado` y `totalEgresos`.
     El `newValue` guarda el `reason`. Sigue dentro de la misma transacción.
4. **Borrar un cobro respeta el cierre y deja rastro.** En `DELETE /api/payments/[id]`, dentro de la transacción y antes
   de borrar:
   - Se calcula el día de caja del pago con las mismas funciones del `POST` (`fechaLocalDelInstante(payment.paidAt, tz)` →
     `getDayRangeUTC`).
   - Si ese día está cerrado → 409 «La caja de ese día está cerrada. Reábrala para corregir el cobro.» Vale para todos los
     métodos, como en el `POST`.
   - Si no está cerrado, se borra y se escribe `logAudit({ action: "PAYMENT_DELETED", entityType: "Payment", … }, tx)` con
     monto, método, `invoiceId` y `paidAt` en `oldValue`. Si la auditoría falla, la transacción deshace el borrado.
5. Todos los textos al dueño, de usted. Sin voseo ni tuteo: el gate `__tests__/voseo-ratchet` no puede subir.

## PRUEBA DE HECHO
Primero en rojo con el código de hoy; anotá cuáles fallaron.
- Ruta de caja:
  - `close` con `date` de ayer suma los cobros de ayer y no los de hoy.
  - `date` de mañana y de hace 8 días → 400.
  - `reopen` sin `reason` → 400; con `reason` → 200, y la auditoría trae `reason`, `openingFund` y los totales.
  - `reopen` de ayer → el `POST /api/payments` con fecha de ayer vuelve a 200.
- `GET` devuelve el día abierto de ayer y no uno de hace 8 días.
- `DELETE /api/payments/[id]`:
  - pago de un día cerrado → 409, y el pago sigue en la base;
  - día abierto → 200 con `PAYMENT_DELETED`;
  - si la auditoría lanza → 500, y el pago no se borra.
- Render de `CajaDiariaClient`:
  - aparece el aviso del día abierto;
  - reabrir no envía nada sin motivo;
  - el texto de confirmación de reabrir trae el contado y el descuadre.
- `npx tsc --noEmit` sin errores nuevos, eslint de lo tocado 0 y `npx vitest run` de los tests tocados en verde.

## REGLA DE PARADA
- Sin migraciones: no toques `prisma/schema.prisma` ni `prisma/migrations/**`. Todo entra en las columnas que ya existen.
- Solo `app/api/caja-diaria/**`, `app/(dashboard)/caja-diaria/**`, `app/api/payments/[id]/**`, `lib/caja-diaria.ts` y sus
  tests.
- No toques los webhooks de cobro (PagosNet, Circle). Un pago que llega por QR o tarjeta ya entró al banco: rechazarlo
  pierde plata. Que un cierre ya guardado no lo cuente es otra decisión.
- No toques `correctOpeningFund`, los egresos ni las pantallas de comercio o importadora. Corregir el fondo inicial y quitar
  un egreso desde la pantalla van en otro contrato (F136c).
- Si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos tocados;
- los números de tsc, eslint y vitest;
- los tests que se pusieron rojos con el código viejo;
- lo que no pudiste decidir.
