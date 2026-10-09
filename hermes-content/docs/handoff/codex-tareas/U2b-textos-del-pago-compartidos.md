# U2b · Los textos del pago que comparten el checkout, Mi plan y el correo, de usted (cierra U2 y C13b)

Sos Codex. SOLO `onia-platform`, sobre la rama `codex/u2-pago-de-usted` (onia-platform#142). `git branch --show-current`
primero y anotá el SHA base.

**Punto del plan:** 1 y 2 (el pago) y 13 (el correo y el aviso de renovación), de `ONIA_PLAN_1.0_Y_CAJA.md`.

**Corre ya, sin esperar a #113.** #113 (la gracia) quedó frenado hasta que Sergio Urcullo apruebe los Términos, y el
checkout no puede esperar a eso. Cuando #113 se mergee después, actualiza sus tests que fijan estos textos
(`PlanClient.estado-real.test.ts`, `vencimientos.test.ts`): está anotado en el handoff.

## META
Revisión de Plataforma (9-oct) de #142 y #113: los dos dejaron de usted SUS archivos, pero tres pantallas siguen
mezclando registros. Los textos vienen de módulos compartidos que ninguna de las dos tareas tocó.
- **El checkout, al lado del QR:** `components/billing/QrEstaticoOnia.tsx` pinta `INSTRUCCION_QR_ESTATICO`
  (`lib/checkout/textos.ts`): «Escaneá el QR desde la app de tu banco y poné exactamente el monto…».
- **El aviso de comprobante rechazado y la banda de gracia:** usan `medioDePagoOnia(...).enElPanel` (vía
  `dondeSeRenueva`): «Renovás desde el checkout: pagás con nuestro QR…».
- **El correo de renovación** (`renewalCopy`, ya de usted) interpola `comoSeRenuevaOnia`: «Renovás en 2 minutos…».
- **El vocabulario del rubro trae «tu»:** `negocio` es «tu clínica», y el título del checkout quedó «Elija el plan de
  tu clínica» (`CheckoutClient.tsx:490`). Pasa lo mismo en `:392` y en `QRPaymentModal.tsx:71,80`.

## Lo que se hace
1. **Mergear `master`** en la rama de #142 si se movió, y correr la suite antes de seguir.
2. **`lib/checkout/textos.ts` entero de usted** (8 formas en el ratchet, más el tuteo):
   - `INSTRUCCION_QR_ESTATICO`: «Escanee el QR desde la app de su banco y ponga exactamente el monto a pagar. Si está
     en el celular, tome una captura y ábrala desde la galería en la app de su banco. Después suba el comprobante y
     lo verificamos.»
   - las tres `bajada`, `MEDIO_DE_PAGO` (`bullet`, `enElPanel`), `ADDON_EN_EL_PANEL`, `comoSeRenuevaOnia`,
     `comoSeRenuevaElAddon` y `renovacionPersonalizada`;
   - `enElWhatsApp` lo escribe el cliente a Onia: «¿Me pasa los datos para la transferencia?».
3. **Vocabulario de usted:** un campo nuevo `negocioSu` en `lib/onboarding/vocabulario.ts`.
   - Su valor por rubro: «su clínica», «su empresa», «su negocio», «su estancia»… En `onia-interna` es «Onia», igual
     que `negocio`.
   - Se usa en las pantallas de pago que ya son de usted: `CheckoutClient.tsx` (título y `:392`),
     `QRPaymentModal.tsx` y los `v.negocio` de `PlanClient.tsx` que estén en frases de usted.
   - En el comentario de la interfaz: «las pantallas de usted usan `negocioSu`; `negocio` queda para lo que sigue de
     vos y se borra cuando el ratchet llegue a 0».
   - No se deriva recortando «tu », por el mismo motivo que `negocioTitulo`.
4. **Los tests que fijan esos textos se actualizan, no se borran.** Probablemente:
   - `lib/checkout/medio-de-pago-derivado.test.ts`;
   - `app/(dashboard)/settings/PlanClient.estado-real.test.ts`;
   - `lib/subscription/vencimientos.test.ts`;
   - `lib/platform/copy-de-pantallas-compartidas.test.ts`;
   - `app/api/cron/trial-drip/route.test.ts`;
   - `__tests__/lib/email-marca-real.test.ts`;
   - los que aparezcan al correr la suite.

## PRUEBA DE HECHO
- `__tests__/usted-pago.test.ts` suma `lib/checkout/textos.ts` en 0 (con `contarArchivos` y en la línea base).
- Test nuevo: renderizar el checkout, el modal del QR y `QrEstaticoOnia` con el vocabulario dental real; el texto no
  tiene `tu`, `tus`, `te` ni formas de vos.
- Test nuevo: `renewalCopy` (en sus dos variantes, con QR y sin QR) armado entero con `comoSeRenuevaOnia` adentro, sin
  `tu`, `tus`, `te` ni formas de vos.
- Hacelo fallar una vez a propósito y anotalo.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales. Si vitest no
  arranca en tu entorno (`spawn EPERM`), decilo: la suite la corre la madre o Plataforma.

## REGLA DE PARADA
- Solo textos, el campo de vocabulario y sus tests. Sin lógica, montos, rutas ni migraciones.
- Textos legales no: Términos, privacidad y casillas de aceptación quedan como están.
- No cambies `negocio` (todavía lo usan pantallas de vos): solo se agrega `negocioSu`.

## Entrega
Commits conventional en castellano con el porqué, en la rama de #142. Resumen con SHA base, SHAs, números reales y el
conteo de voseo antes y después.
