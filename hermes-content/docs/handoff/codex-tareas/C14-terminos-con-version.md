# C14 · Guardar qué versión de los Términos aceptó cada negocio, en el alta y en cada pago (punto 14 de la 1.0 de Onia)

Sos Codex. Trabajás SOLO en esta carpeta, un clon completo de `onia-platform`, en la rama `codex/punto-14-terminos-con-version`.
- Primero corré `git branch --show-current`: tiene que decir esa rama. Si no, pará y decilo en el resumen.
- Si `git status` ya muestra cambios, es que una corrida anterior se cortó: seguí desde ahí y no rehagas lo hecho.
- Nadie va a contestar preguntas mientras corrés. Decidí con este documento y con el código; lo que no puedas decidir, anotalo en el resumen final.

## META
Que quede guardado en columnas, y no solo dentro de un log, qué versión de los Términos aceptó cada negocio al darse de alta y qué versión aceptó en cada pago, con fecha. Los TRES lugares desde donde se paga (checkout, add-on del chatbot y el modal de pago de Mi plan) piden la aceptación.

## PRUEBA DE HECHO
Tests verdes que prueban:
1. El alta escribe `organizations.termsVersion = VERSION_TERMINOS` junto a `termsAcceptedAt`.
2. POST `/api/subscription-payment` sin `termsAccepted=true` da 400, y no sube el archivo ni crea el pago.
3. Con `termsAccepted=true`, el pago guarda `termsVersion = VERSION_TERMINOS` (la constante del servidor, NUNCA un valor que mande el cliente) y `termsAcceptedAt`.
4. «Enviar comprobante» queda deshabilitado hasta marcar la casilla en el checkout, en el add-on y en `QRPaymentModal`.
5. `app/checkout/factura-por-cada-pago.test.ts`, los tests de `matriz-cobro` y los de `components/billing` siguen verdes.

Todo queda en UN commit en la rama.

## REGLA DE PARADA
- **No cambies:** el texto de los Términos, `VERSION_TERMINOS` ni `FECHA_TERMINOS`.
- **No toques:** `/admin/payments` ni su ruta (son de otra tarea), el webhook del BCP, el callback de n8n, la activación del plan ni `app/(dashboard)/settings/PlanClient.tsx` (lo toca otra tarea; el modal se arregla en SU archivo).
- **Del checkout, los textos que ya están no se cambian.** El punto 2 se acaba de publicar: la frase de la factura y el titular del QR quedan como están. Solo se agrega la casilla.
- **La etiqueta de la casilla es texto legal:** no se publica sin que Sergio Urcullo la vea renderizada. Vos solo la construís y la listás en el resumen.

## Contexto mínimo
- **Qué es:** Onia Platform es el SaaS de gestión de Onia para negocios de Bolivia. Hay 7 rubros; el vocabulario por rubro está en `lib/onboarding/vocabulario.ts`.
- **Stack:** Next.js 16 (App Router), React 19, Prisma 7 sobre el Postgres de Supabase self-hosted, Tailwind 4, tests con vitest. Es multi-tenant: todo se filtra por `organizationId`.
- **`master` es producción:** un cron del VPS lo publica cada 3 horas. Vos no empujás nada.
- **Antes de codear:**
  - De `AGENTS.md` alcanza con las reglas.
  - Leé las skills `.claude/skills/onia-backend/SKILL.md`, `.claude/skills/onia-db/SKILL.md` y `.claude/skills/onia-frontend/SKILL.md`.
  - No leas docs largos.
  - Next 16 cambia APIs: ante una duda, `node_modules/next/dist/docs/`.
- **Cómo leer el código:** por sección (`grep -n`, `sed -n 'a,bp'`). Los comentarios largos explican POR QUÉ existe cada guarda: respetalos.

## Lo que hay hoy (medido sobre master 97fe306)
- **Alta:** `app/api/auth/register/route.ts`.
  - En :62 exige `termsAccepted: true`.
  - En ~:392 guarda `organizations.termsAcceptedAt` (`prisma/schema.prisma:30`).
  - En ~:420-421 guarda `termsVersion: VERSION_TERMINOS` y `termsDate` SOLO dentro del `newValue` del audit log `USER_CREATED`.
  - Los datos de la organización pasan por `lib/platform/provisioning.ts` (`termsAcceptedAt` en ~:108): revisá su tipo.
- **Versión vigente:** `lib/legal/version-terminos.ts:6-7` (`VERSION_TERMINOS = "1.2"`, `FECHA_TERMINOS = "2026-09-25"`, `URL_TERMINOS`).
- **La ruta del pago:** `app/api/subscription-payment/route.ts` lee el form en :67-78, sube el archivo en ~:178 y crea el pago en :193.
- **TRES pantallas postean a esa ruta.** Si la ruta exige la casilla y una no la manda, ese camino de pago se rompe en producción:
  1. `app/checkout/CheckoutClient.tsx`: arma el `FormData` en ~:407-417. El botón «Enviar comprobante» está en ~:827-835 y se habilita con `datosCompletos` / `disabledReason={falta ?? undefined}` (`falta` se calcula en ~:382-396). En ~:841 hay solo un link a Términos: no se registra ninguna aceptación. Si el QR dinámico del BCP está disponible, hay un botón «Generar QR» (~:626 y ~:640).
  2. `app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.tsx:179-191`.
  3. `components/billing/QRPaymentModal.tsx:101`: el modal de pago que abre Configuración › Mi plan (`PlanClient.tsx:1229`).
- **QR dinámico:** crea su pago en `app/api/subscription-payment/bcp-qr/route.ts:125`. No está confirmado que esté encendido en producción.
- **Scripts de QA del cobro** (no los corrés: necesitan un entorno aislado; pero se rompen si no los actualizás): `scripts/qa-v1/payment-runtime.mjs:87` (POST multipart en `upload()`) y `scripts/qa-v1/payment-ui-runtime.mjs` (`fillProof()` espera el botón habilitado).
- **Tests que ya existen:** `app/api/subscription-payment/route.test.ts`, `app/api/auth/register/route.test.ts`, `app/checkout/CheckoutClient.matriz-cobro.test.ts`, `app/checkout/factura-por-cada-pago.test.ts`, `components/billing/QRPaymentModal.copy-sin-qr.test.ts`, `app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.qr-estatico.test.ts`.

## Qué construir
### 1. Migración
Archivo nuevo `prisma/migrations/20261006110000_add_terms_version/migration.sql`:
```sql
-- APLICAR ANTES DEL SWAP de la imagen que trae schema.prisma con Organization.termsVersion y
-- SubscriptionPayment.termsVersion/termsAcceptedAt. Ningun paso del deploy corre `migrate deploy`: se aplica a
-- mano (skill onia-db, backup previo) y se registra en _prisma_migrations. Con el codigo viejo es inofensiva; al
-- reves, Organization se lee sin `select` en muchas pantallas: con el codigo nuevo y sin la columna, TODO el panel
-- cae con P2022.
--
-- Punto 14 de la 1.0 (2026-10-06): la version de los Terminos aceptada vivia solo dentro de audit_logs.newValue.
-- Ahora queda en el alta (organizations) y en cada pago (subscription_payments). Aditiva y nullable. Sin backfill:
-- las cuentas viejas tienen su version en audit_logs (accion USER_CREATED); las creadas a mano por el operador no
-- tienen registro. Sin tabla nueva, sin RLS nuevo.
ALTER TABLE "public"."organizations" ADD COLUMN "termsVersion" TEXT;
ALTER TABLE "public"."subscription_payments" ADD COLUMN "termsVersion" TEXT;
ALTER TABLE "public"."subscription_payments" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3);
```
En `prisma/schema.prisma`:
- **Modelo `Organization`:** JUSTO DEBAJO de `termsAcceptedAt DateTime?` va `termsVersion String?`.
- **Modelo `SubscriptionPayment`:** JUSTO DEBAJO de la línea `receiptPath`, y en ningún otro lugar, van `termsVersion String?` y `termsAcceptedAt DateTime?`. Otra tarea agrega campos debajo de `reviewedBy`, y las dos tienen que mergear sin conflicto.

**NO apliques la migración.** No corras `prisma generate`, `migrate` ni `db push`.

### 2. Módulo puro `lib/legal/aceptacion.ts`
Sin imports de servidor: lo importan componentes cliente.
- `export const CAMPO_ACEPTA_TERMINOS = "termsAccepted";`
- `aceptoLosTerminos(valor: FormDataEntryValue | null | undefined): boolean`, que es true solo si el valor es exactamente `"true"`.
- `textoDeAceptacion(): string`, que devuelve `Leí y acepto los Términos y condiciones (versión ${VERSION_TERMINOS})`. Es la fuente única de la etiqueta.
- Un comentario con el porqué: la aceptación se prueba con versión y fecha; el link solo no prueba nada.

### 3. Alta
En `register/route.ts`, guardá `termsVersion: VERSION_TERMINOS` junto a `termsAcceptedAt: now`. Si hace falta, pasalo por el tipo de `provisioning.ts`. El audit log queda como está.

### 4. Ruta del pago (`app/api/subscription-payment/route.ts`)
- Leé `termsAccepted` del form con `aceptoLosTerminos`. Si da false, devolvé 400 con «Para enviar el pago tenés que aceptar los Términos y condiciones.», ANTES de subir el archivo o crear nada.
- En el `create`, guardá `termsVersion: VERSION_TERMINOS` y `termsAcceptedAt: new Date()`.
- **`bcp-qr/route.ts`:** si el body JSON trae `termsAccepted === true`, guardá lo mismo en el pago que crea, pero NO lo exijas todavía. Anotá en el resumen que hay que exigirlo el día que se encienda el QR dinámico.

### 5. Pantallas (las TRES)
- **`CheckoutClient.tsx`:**
  - UNA casilla (checkbox con su label) con `textoDeAceptacion()`. «Términos y condiciones» enlaza a `URL_TERMINOS` en una pestaña nueva (`target="_blank" rel="noopener noreferrer"`).
  - Va antes del primer botón que cobra.
  - Hasta marcarla, «Enviar comprobante» (y «Generar QR», si está) queda deshabilitado con el mismo mecanismo `disabledReason` / `falta` que ya usa el botón, con el motivo «Falta aceptar los Términos».
  - Mandá `termsAccepted=true` en el `FormData`, y en el body de bcp-qr si el cliente lo llama.
  - No toques los demás textos.
- **`AddonChatbotClient.tsx`:** lo mismo, antes de su botón de enviar, y que mande el campo.
- **`components/billing/QRPaymentModal.tsx`:** lo mismo, antes de su botón de enviar, y que mande el campo. Editá SOLO el archivo del modal, no `PlanClient.tsx`.
- **Lógica testeable:** si la condición de «falta» vive dentro del componente, extraé una función pura (por ejemplo, `faltaParaEnviar({...datos, aceptoTerminos})`) para poder testearla sin renderizar.
- **Scripts de QA:**
  - en `scripts/qa-v1/payment-runtime.mjs`, sumá `termsAccepted: 'true'` al multipart de `upload()`;
  - en `scripts/qa-v1/payment-ui-runtime.mjs`, que `fillProof()` marque la casilla (`page.getByLabel(/Leí y acepto los Términos/).check()`) antes del `expect(...).toBeEnabled()`.
  - No los corras.

### 6. Tests
- `lib/legal/aceptacion.test.ts`.
- En `app/api/subscription-payment/route.test.ts`, los casos 2 y 3 de la PRUEBA. Verificá que `termsVersion` sea la constante aunque el form mande otra cosa.
- En `app/api/auth/register/route.test.ts`, el caso 1.
- El caso 4: si `CheckoutClient.matriz-cobro.test.ts` ya renderiza el componente, seguí su patrón; si no, testeá la función pura del punto 5. Lo mismo para el add-on y el modal.
- Antes de cerrar: `grep -rln "api/subscription-payment\"\|/api/subscription-payment'" --include=*.test.ts --include=*.test.tsx . | grep -v node_modules`, y corré también esos.
- Comando:
  ```
  npx vitest run lib/legal lib/checkout app/api/subscription-payment app/api/auth/register app/checkout components/billing "app/(dashboard)/settings/addon-chatbot" app/api/webhooks/bcp
  ```

## Reglas fijas (no negociables)
- **Nada de producción:** no deploy, no VPS, no SSH, no Supabase, no SQL contra ninguna base, no correos ni WhatsApp, no `git push`.
- **`node_modules` es un junction COMPARTIDO.** No corras `npm install`, `npm ci`, `npx prisma generate`, `prisma migrate` ni `prisma db push`. No agregues dependencias.
- **La migración se escribe y no se aplica.** La aplica Plataforma en producción antes de publicar.
- **`npx tsc --noEmit` local falla** porque el cliente de Prisma compartido no tiene las columnas nuevas. No lo persigas: el gate de tipos es el CI del PR. Igual, escribí tipos correctos.
- **Textos:**
  - lo que lee un paciente va de USTED;
  - lo del panel y del checkout va en el registro que ya usa el archivo (hoy vos). Pasar a los dueños a usted es una decisión pendiente de Sergio Urcullo;
  - en ninguna pantalla puede aparecer «muy pronto», «próximamente», «beta» ni «en construcción».
- **No toques archivos de otra cola:**
  - `lib/chatbot/meta-cobra-el-servicio.ts`, `lib/pricing.ts`, `lib/subscription-plans.ts` y la página `/precios`;
  - `app/(dashboard)/settings/chatbot/CanalWhatsappCard.tsx`;
  - `app/(dashboard)/settings/PlanClient.tsx`, `SettingsClient.tsx` y `settings/page.tsx`;
  - nada de caja diaria;
  - `prisma/migrations/20261003230000_revoke_anon_onia_sends`, `lib/audit.ts` y `proxy.ts`;
  - `app/api/admin/subscription-payments` y `app/(dashboard)/admin/payments`.
- **Windows:**
  - si `git status` muestra un `.snap` que no tocaste, hacé `git checkout -- <archivo>`;
  - fallan en Windows y NO son tuyos: `sin-envoltorios-de-cron-del-vps` (git ENOENT) y `scripts/qa-v1/{schema,contract}` (CRLF).

## Cierre
1. Corré el comando de tests: tiene que estar verde. Si falla algo que no tocaste, comprobá que falle igual sin tus cambios (`git stash`, correr, `git stash pop`), anotalo y seguí.
2. Revisá `git status --short`: tienen que estar solo tus archivos.
3. `git add` de tus archivos y UN commit:
   ```
   feat(legal): guardar la versión de los Términos aceptada en el alta y en cada pago — punto 14 de la 1.0

   <2-4 líneas con el POR QUÉ: la versión vivía solo dentro del audit log; el checkout tenía un link y no registraba
   aceptación; cada pago guarda la versión vigente, así los clientes que renuevan quedan con la última aceptada.>

   Migración 20261006110000: aplicar en producción ANTES del swap (toca organizations).
   Casilla de aceptación = texto legal: OK de Sergio Urcullo antes de publicar.
   Punto 14 de la 1.0 · Codex
   ```
   Sin push.
4. Si el sandbox no te deja escribir en `.git`: dejá los cambios sin commitear y escribí el mensaje completo en `CODEX_COMMIT.txt`, en la raíz. No lo agregues a git.
5. Resumen final: qué hiciste, los archivos, los tests corridos con su resultado, la etiqueta exacta de la casilla y las TRES pantallas donde aparece (para mostrársela a Sergio Urcullo), los textos nuevos visibles y qué quedó afuera. Como mínimo, anotá: pedir la aceptación de nuevo cuando cambia la versión, el QR dinámico sin exigencia, las cuentas creadas a mano sin registro y los scripts de QA tocados sin correr.
