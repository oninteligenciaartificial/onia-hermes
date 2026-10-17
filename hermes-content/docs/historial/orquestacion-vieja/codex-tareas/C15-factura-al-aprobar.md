# C15 · El N° de factura del SIN se anota al aprobar cada pago (punto 15 de la 1.0 de Onia)

Sos Codex. Trabajás SOLO en esta carpeta, un clon completo de `onia-platform`, en la rama `codex/punto-15-factura-al-aprobar`.
- Primero corré `git branch --show-current`: tiene que decir esa rama. Si no, pará y decilo en el resumen.
- Si `git status` ya muestra cambios, es que una corrida anterior se cortó: seguí desde ahí y no rehagas lo hecho.
- Nadie va a contestar preguntas mientras corrés. Decidí con este documento y con el código; lo que no puedas decidir, anotalo en el resumen final.

## META
Que en `/admin/payments` no se pueda aprobar el pago de un cliente real sin anotar el N° de la factura emitida a mano en el Portal Web del SIN. Y que los pagos que se aprueban solos (webhook del BCP, n8n) queden marcados «Falta factura», con un campo para anotarla después.

## PRUEBA DE HECHO
`npx vitest run lib/subscription/factura-del-pago.test.ts app/api/admin/subscription-payments` en verde, con estos casos nuevos:
1. APPROVED de un cliente real sin N° da 400, y no se llama a `claimPendingPayment` ni a `activatePaidPlan`.
2. APPROVED con un N° válido: `claimPendingPayment` recibe `invoiceNumber` e `invoicedAt`, y el plan se activa igual que hoy.
3. Cuenta de la casa (slug `zz-qa-...`, o correo `oninteligenciaartificial+qapago@gmail.com`): se aprueba sin N°.
4. REJECTED no pide N°.
5. La acción `INVOICED` sobre un pago APPROVED sin factura la guarda y responde 200. NO devuelve el 400 «El pago ya esta en estado APPROVED». Sobre uno PENDING, o que ya tiene factura, da 409.

Los tests que ya existían en esa carpeta siguen verdes. Todo queda en UN commit en la rama.

## REGLA DE PARADA
- Se tocan solo los archivos de «Qué construir». No toques el webhook del BCP, el callback de n8n, `lib/subscription/activation.ts`, el checkout ni el alta. Si para cerrar la tarea hubiera que tocar alguno, anotalo y cerrá.
- **No aflojes la guarda de idempotencia** (el chequeo `payment.status !== "PENDING"` y `lockPendingPayment`): evita aprobar dos veces. INVOICED va POR FUERA de esa guarda, no a través de ella.

## Contexto mínimo
- **Qué es:** Onia Platform es el SaaS de gestión de Onia para negocios de Bolivia. El primer rubro son las clínicas dentales, pero hay 7 rubros: nada de «paciente» en textos genéricos (el vocabulario por rubro está en `lib/onboarding/vocabulario.ts`).
- **Stack:** Next.js 16 (App Router), React 19, Prisma 7 sobre el Postgres de Supabase self-hosted, Tailwind 4, tests con vitest. Es multi-tenant: todo se filtra por `organizationId`.
- **`master` es producción:** un cron del VPS publica `master` cada 3 horas. Vos no empujás nada.
- **Antes de codear:**
  - De `AGENTS.md` (raíz) alcanza con las reglas.
  - Leé las skills `.claude/skills/onia-backend/SKILL.md` y `.claude/skills/onia-db/SKILL.md`.
  - No hace falta leer `docs/ORCHESTRATOR.md`, el backlog ni otros docs largos.
  - Next 16 cambia APIs: ante una duda, `node_modules/next/dist/docs/`.
- **Cómo leer el código:**
  - Por sección (`grep -n`, `sed -n 'a,bp'`), no archivos enteros.
  - Los comentarios largos explican POR QUÉ existe cada guarda: respetalos.
  - Si cambiás una regla, actualizá su comentario con la fecha (2026-10-06) y el motivo.

## Lo que hay hoy (medido sobre master 97fe306)
- **El camino de un pago:**
  1. El cliente paga con el QR del BCP, sube el comprobante en `/checkout` y queda un `SubscriptionPayment` PENDING.
  2. Sergio Urcullo (rol SUPERADMIN) lo aprueba en `/admin/payments`: `app/(dashboard)/admin/payments/AdminPaymentReviewClient.tsx:79` (`handleAction`).
  3. Eso llama a `PATCH /api/admin/subscription-payments` (`app/api/admin/subscription-payments/route.ts:72`). En :81 lee `{ paymentId, action, adminNotes }` y en :87 acepta solo APPROVED y REJECTED.
  4. En ~:91-107 busca el pago y, **si no está PENDING, devuelve 400 «El pago ya esta en estado …»**.
  5. Dentro de `prisma.$transaction` (~:115) llama a `lockPendingPayment` (que también exige PENDING), a `claimPendingPayment` (`lib/subscription/activation.ts:150`, un updateMany desde PENDING; la data es un `Prisma.SubscriptionPaymentUpdateManyMutationInput`) y a `activatePaidPlan`.
- **La promesa al cliente:** el checkout dice «Te emitimos factura por cada pago: te la enviamos por correo después de verificarlo» (`app/checkout/CheckoutClient.tsx:840`).
- **Lo que falta:** la factura se emite a mano en el Portal Web del SIN, y nada obliga a emitirla ni guarda su número. El modelo `SubscriptionPayment` (`prisma/schema.prisma:1442-1470`) tiene `adminNotes`, `reviewedAt`, `reviewedBy` y nada más.
- **Dos caminos aprueban sin humano:** `app/api/webhooks/bcp/route.ts:181` y `app/api/n8n/callback/subscription-approve/route.ts:128`. No se tocan: sus pagos quedan APPROVED sin factura y la pantalla los tiene que mostrar.
- **«Cuenta de la casa»** (QA, demo, cuentas propias de Onia) tiene fuente única: `motivoDeCuentaDeLaCasa(org)` en `lib/platform/cuentas-que-no-son-clientes.ts:183`. Lee `slug`, `email` y `verticalTrackId` de la organización, y el archivo no tiene imports (se puede usar desde un componente cliente). Es lo que deja aprobar sin factura el pago de PRUEBA de la QA «ZZ QA Pago» (+qapago).
- **Qué cargan hoy de la organización:** el GET de la ruta (~:59) y la página `app/(dashboard)/admin/payments/page.tsx` (~:33) cargan `organization: { select: { name, slug, plan } }`.
- **Pantalla:** el filtro (:72) es un status. Se usa en `payments.filter((p) => p.status === filter)` (:76), en las pestañas (:109-119) y en el estado vacío `STATUS_LABELS[filter].toLowerCase()` (:127).
- **Tests:** `app/api/admin/subscription-payments/route.test.ts` ya mockea auth, prisma y los avisos. Seguí su patrón.

## Qué construir
### 1. Migración
Archivo nuevo `prisma/migrations/20261006100000_add_subscription_payment_invoice/migration.sql`, con exactamente esto:
```sql
-- APLICAR ANTES DEL SWAP de la imagen que trae schema.prisma con SubscriptionPayment.invoiceNumber.
-- Ningun paso del deploy corre `migrate deploy`: se aplica a mano (skill onia-db, backup previo) y se
-- registra en _prisma_migrations. Con el codigo viejo es inofensiva; al reves, Prisma pide las columnas en
-- todo SELECT de subscription_payments sin `select` (/admin/payments, el checkout) y cae con P2022.
--
-- Punto 15 de la 1.0 (2026-10-06): cada pago aprobado de un cliente lleva el N° de la factura emitida a mano
-- en el Portal Web del SIN. Aditiva y nullable: los pagos viejos quedan sin numero. Sin tabla nueva, sin RLS nuevo.
ALTER TABLE "public"."subscription_payments" ADD COLUMN "invoiceNumber" TEXT;
ALTER TABLE "public"."subscription_payments" ADD COLUMN "invoicedAt" TIMESTAMP(3);
```
En `prisma/schema.prisma`, modelo `SubscriptionPayment`, insertá estas 2 líneas JUSTO DEBAJO de la línea de `reviewedBy`. No van en otro lugar: otra tarea agrega campos debajo de `receiptPath`, y las dos tienen que mergear sin conflicto.
```prisma
  invoiceNumber  String?           // N° de la factura emitida a mano en el Portal Web del SIN (punto 15)
  invoicedAt     DateTime?
```
**NO apliques la migración.** No corras `prisma generate`, `migrate` ni `db push`.

### 2. Módulo puro `lib/subscription/factura-del-pago.ts`
- Sin Prisma, sin `next/*` y sin ningún import de servidor: lo importa un componente `"use client"`.
- Con un comentario de cabecera que diga el porqué (punto 15: el checkout promete factura por cada pago, y nada obligaba a emitirla).
- `pagoExigeFactura(org: { slug?: string | null; email?: string | null; verticalTrackId?: string | null }): boolean` devuelve `motivoDeCuentaDeLaCasa(org) === null`.
- `normalizarNumeroDeFactura(raw: unknown): { ok: true; valor: string } | { ok: false; error: string }`:
  - recorta y saca los espacios internos;
  - acepta solo dígitos, de 1 a 20;
  - si no cumple, el error es «Escribí el N° de factura tal como figura en el Portal del SIN (solo números).»
- `faltaFactura(pago: { status: string; invoiceNumber?: string | null }, org): boolean` es true cuando el pago está APPROVED, no tiene número y `pagoExigeFactura(org)`.

### 3. Ruta `app/api/admin/subscription-payments/route.ts`
- **Body:** `{ paymentId, action, adminNotes, invoiceNumber }`. Las acciones válidas son `APPROVED`, `REJECTED` e `INVOICED`.
- **INVOICED** (anotar la factura de un pago que ya se aprobó, por ejemplo por el webhook) se resuelve y RETORNA justo después de validar la acción: ANTES del `findUnique` y del chequeo `payment.status !== "PENDING"` (~:91-107), y FUERA de la `$transaction`.
  - valida el número (si no sirve, 400);
  - después hace `prisma.subscriptionPayment.updateMany({ where: { id: paymentId, status: "APPROVED", invoiceNumber: null }, data: { invoiceNumber, invoicedAt: new Date() } })`;
  - si `count === 0`, devuelve 409 con «Ese pago no está aprobado o ya tiene factura.»;
  - no activa nada ni avisa a nadie.
- **APPROVED:**
  - Después del chequeo de PENDING y antes de la transacción, cargá la organización del pago (`slug`, `email`, `verticalTrackId`) con `prisma.organization.findUnique`.
  - Si `pagoExigeFactura` es true y `normalizarNumeroDeFactura` no da ok: devolvé 400 con ese error, sin tocar nada.
  - Si hay número válido (sea cliente o cuenta de la casa): sumá `invoiceNumber` e `invoicedAt: new Date()` a la data de `claimPendingPayment`, solo cuando la acción es APPROVED.
  - Una cuenta de la casa sin número se aprueba como hoy.
  - Todo lo demás de la rama APPROVED queda IGUAL: la guarda de PENDING, `lockPendingPayment`, la validación del importe y de la referencia, y el aviso al dueño.
- **REJECTED:** igual que hoy.
- **Permisos:** sigue siendo solo SUPERADMIN, también para INVOICED.
- **GET:** sumá `email: true, verticalTrackId: true` al select de `organization`. Lo mismo en `app/(dashboard)/admin/payments/page.tsx`.
- **Auditoría:** no toques `lib/audit.ts`. Hay un parche pendiente de aplicar que necesita su contexto intacto.

### 4. Pantalla `AdminPaymentReviewClient.tsx`
La usa solo Sergio Urcullo; el registro es el del archivo.
- **Tipo:** sumá `invoiceNumber`, `invoicedAt`, `organization.email` y `organization.verticalTrackId` a la interfaz `Payment`.
- **PENDING de un cliente real:** antes del botón Aprobar, un bloque «Antes de aprobar» con:
  - «1. Emití la factura en el Portal Web del SIN a {payerName o registeredClinicName} · CI/NIT {payerCI o «—»} · por {monto con el mismo formato que ya usa el archivo}.»
  - «2. N° de factura» y un input.
  - Aprobar queda deshabilitado hasta que `normalizarNumeroDeFactura` dé ok. El error se muestra debajo del input.
  - El PATCH manda `invoiceNumber`. `handleAction` puede recibir el número como tercer argumento.
- **PENDING de una cuenta de la casa:** una línea «Cuenta de la casa ({motivo}): se aprueba sin factura.», y Aprobar queda habilitado.
- **APPROVED con `faltaFactura`:**
  - un badge «Falta factura»;
  - un input y el botón «Registrar factura», que manda `action: "INVOICED"`;
  - una pestaña o filtro «Falta factura (N)» junto a los que ya hay. **Esa clave (por ejemplo `FALTA_FACTURA`) no es un status:** manejala aparte en el filtrado (:76), en el rótulo de la pestaña (:119) y en el texto del estado vacío (:127). Ninguno de los tres puede indexar `STATUS_LABELS` con ella, o la pantalla se cae con `undefined.toLowerCase()`.
- **APPROVED con número:** «Factura N° {n} · {fecha}».
- **Sin lógica duplicada:** las decisiones salen de las funciones del punto 2.
- **Estilo:** las mismas clases y el mismo componente que el resto del archivo. No es una pantalla nueva.

### 5. Tests
- `lib/subscription/factura-del-pago.test.ts`:
  - `normalizarNumeroDeFactura`: con espacios, con letras, vacío, con 20 y con 21 dígitos.
  - `pagoExigeFactura`: un cliente real da true; slug `zz-qa-x`, correo `oninteligenciaartificial+qapago@gmail.com` y correo `oninteligenciaartificial+demo@gmail.com` dan false.
  - `faltaFactura`.
- En `app/api/admin/subscription-payments/route.test.ts`, los 5 casos de la PRUEBA DE HECHO. Mockeá `prisma.organization.findUnique` y `prisma.subscriptionPayment.updateMany` como ya se mockea el resto.
- Comando: `npx vitest run lib/subscription/factura-del-pago.test.ts app/api/admin/subscription-payments lib/platform`

## Reglas fijas (no negociables)
- **Nada de producción:** no deploy, no VPS, no SSH, no Supabase, no SQL contra ninguna base, no correos ni WhatsApp, no `git push`.
- **`node_modules` es un junction COMPARTIDO con otra copia.** No corras `npm install`, `npm ci`, `npx prisma generate`, `prisma migrate` ni `prisma db push`: pisan o borran lo de la otra copia. No agregues dependencias.
- **La migración se escribe y no se aplica.** La aplica Plataforma en producción antes de publicar.
- **`npx tsc --noEmit` local falla** porque el cliente de Prisma compartido no tiene tus columnas. No lo persigas: el gate de tipos es el CI del PR. Igual, escribí tipos correctos.
- **Textos:**
  - lo que lee un paciente va de USTED;
  - lo del panel va en el registro que ya usa el archivo;
  - en ninguna pantalla puede aparecer «muy pronto», «próximamente», «beta» ni «en construcción».
- **No toques archivos de otra cola:**
  - `lib/chatbot/meta-cobra-el-servicio.ts`, `lib/pricing.ts`, `lib/subscription-plans.ts` y la página `/precios`;
  - `app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx`;
  - nada de caja diaria;
  - `prisma/migrations/20261003230000_revoke_anon_onia_sends`, `lib/audit.ts` y `proxy.ts`;
  - nada del checkout ni del alta.
- **Windows:**
  - si `git status` muestra un `.snap` que no tocaste, hacé `git checkout -- <archivo>`;
  - fallan en Windows y NO son tuyos: `sin-envoltorios-de-cron-del-vps` (git ENOENT) y `scripts/qa-v1/{schema,contract}` (CRLF).

## Cierre
1. Corré el comando de tests: tiene que estar verde. Si falla algo que no tocaste, comprobá que falle igual sin tus cambios (`git stash`, correr, `git stash pop`), anotalo y seguí.
2. Revisá `git status --short`: tienen que estar solo tus archivos (ningún `.snap` ajeno, nada de `node_modules`).
3. `git add` de tus archivos y UN commit:
   ```
   feat(cobros): aprobar un pago exige el N° de factura del SIN — punto 15 de la 1.0

   <2-4 líneas con el POR QUÉ: el checkout promete factura por cada pago y nada obligaba a emitirla ni la guardaba;
   las cuentas de la casa quedan exceptuadas para la prueba de cobro; los pagos del webhook quedan «Falta factura».>

   Migración 20261006100000: aplicar en producción ANTES del swap.
   Punto 15 de la 1.0 · Codex
   ```
   Sin push.
4. Si el sandbox no te deja escribir en `.git`: dejá los cambios sin commitear y escribí el mensaje completo en `CODEX_COMMIT.txt`, en la raíz. No lo agregues a git.
5. Resumen final (lo lee quien revisa): qué hiciste, los archivos, los tests corridos con su resultado (cuántos pasaron), qué quedó afuera y por qué, y los textos nuevos visibles.
