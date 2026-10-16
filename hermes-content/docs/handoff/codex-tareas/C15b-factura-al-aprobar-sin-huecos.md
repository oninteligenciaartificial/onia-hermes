# C15b · La factura del pago sin huecos y de usted (arreglos de #114)

Sos Codex. SOLO `onia-platform`, sobre la rama `codex/punto-15-factura-al-aprobar` (onia-platform#114). Anotá el SHA base.

## META
La revisión de Plataforma (9-oct) encontró que #114 falla el gate de usted (y desde K3b, el 9-oct, también choca con `master`: paso 0), y que el
registro de la factura tiene huecos que en la práctica dejan cobros sin factura (riesgo de clausura de 6 a 48 días).
Lo bueno se queda: solo SUPERADMIN llega, aprobar dos veces activa el plan una sola vez, la migración es aditiva.

## Lo que se hace
0. **Mergear `master`** (actualizado el 9-oct 09:30 UTC: ya NO entra limpio). Desde K3b (#134) choca
   `app/api/auth/register/route.test.ts`: los dos lados sumaron tests al final. Quedarse con los tres (primero
   «K3b: semilla fallida…», después los dos «C15: …»), cada `it` con su `});`. Correr ese archivo antes de seguir.
1. **De usted** (hoy rompe `__tests__/voseo-ratchet.test.ts`; NO subir la línea base):
   - `app/(dashboard)/admin/payments/AdminPaymentReviewClient.tsx:232` «Emití…» → «Emita…»;
   - `lib/subscription/factura-del-pago.ts:14` «Escribí…» → «Escriba…»;
   - y los tests que fijan esos textos.
2. **Las aprobaciones automáticas tampoco quedan sin factura.** `app/api/webhooks/bcp/route.ts:181` y
   `app/api/n8n/callback/subscription-approve/route.ts:128` aprueban sin número de factura y nadie se entera. Un pago
   aprobado sin factura tiene que aparecer en la vista que se abre por defecto («Falta factura» arriba de todo, con el
   conteo) y avisarle al superadmin por el canal de avisos que ya existe.
3. **Primero se valida el pago, después se emite la factura.** Hoy el checklist pide emitir la factura en el Portal Web
   del SIN y recién después el sistema puede rechazar el pago (422 por monto distinto o referencia BCP repetida, 409 si
   otro admin ganó). Eso deja una factura del SIN huérfana que hay que anular. Orden nuevo: validar el pago y mostrar el
   resultado; solo con el pago válido se pide emitir la factura y escribir su número, y la aprobación lo guarda en la
   misma transacción.
4. **Un número de factura que sirva:**
   - rechazar «0» y números no positivos;
   - no permitir el mismo número en dos pagos (como `pagoConLaMismaReferencia`);
   - guardar la fecha de emisión que escribe el admin, aparte de `invoicedAt` (la hora en que se cargó), y mostrar cada
     una con su nombre;
   - el superadmin puede corregir un número mal tipeado, con auditoría (hoy solo se escribe una vez y un error pide SQL
     en producción).
5. **Auditoría:** `INVOICED` (`route.ts:94-107`) guarda quién lo hizo (`reviewedBy` + `logAudit`). El cambio de «cuenta
   interna» (`app/api/admin/clinics/route.ts:276`) se registra como su propia acción y solo cuando cambia
   (`app/(dashboard)/admin/plans/PlansClient.tsx:136` hoy lo manda en cada guardado).
6. **Cuenta interna:** se exime de la factura solo si tiene la marca de superadmin Y `esCuentaQueNoEsCliente`
   (`lib/platform/cuentas-que-no-son-clientes.ts`) dice que no es cliente. Sacar los campos que se seleccionan y no se
   usan (`factura-del-pago.ts:3`).
7. **Detalles de la pantalla:** el error rojo no aparece antes de que se escriba algo
   (`AdminPaymentReviewClient.tsx:148/249`), y «Registrar factura» no devuelve la vista a Pendientes (`reload()`, línea 108).
8. Mover `CODEX_C15_RESUMEN.md` de la raíz a `docs/`.

## PRUEBA DE HECHO
Tests nuevos para: aprobación automática sin factura que aparece en la vista por defecto; pago inválido que nunca pide
emitir la factura; número «0» y número repetido rechazados; corrección del número con auditoría. `npx tsc --noEmit` 0 ·
eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales.

## REGLA DE PARADA
- No toques producción ni la base. La migración `20261006100000_add_subscription_payment_invoice` sigue siendo
  aditiva; si necesitás otra columna (fecha de emisión), va en una migración NUEVA, aditiva y con default.
- En el cuerpo del PR, el orden de deploy: **migración ANTES del swap** (`organizations` recibe una columna NOT NULL; al
  revés, toda lectura de Organization da P2022, incluida la aprobación del pago).

## Entrega
Commits conventional en castellano con el porqué, en la rama de #114. Resumen con SHAs y números reales.
