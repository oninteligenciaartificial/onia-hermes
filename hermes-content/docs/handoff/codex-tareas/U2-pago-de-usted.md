# U2 · La clínica paga de usted: checkout, QR, comprobante y aviso de pago (puntos 1 y 2 de la 1.0)

Sos Codex. SOLO `onia-platform`, rama nueva `codex/u2-pago-de-usted` desde `origin/master`. `git branch --show-current`
primero y anotá el SHA base.

**Punto del plan:** 1 (cobro completo con el QR) y 2 (el checkout no promete de más), de `ONIA_PLAN_1.0_Y_CAJA.md`.

## META
Orden de Sergio Urcullo: los textos al cliente van de usted. U1 dejó afuera a propósito el camino del pago, porque
C13 y C15 lo estaban tocando. Y es justo la pantalla donde la clínica paga: el 16-oct, en la prueba de punta a punta
del punto 1, Sergio Urcullo la va a ver entera. Medido sobre `master` `ef3e2325` con `contarVoseo` del ratchet:
- `app/checkout/CheckoutClient.tsx`: 23;
- `components/billing/QRPaymentModal.tsx`: 12;
- `app/checkout/page.tsx`: 1;
- `app/api/subscription-payment/route.ts`: 2;
- `app/api/subscription-payment/bcp-qr/route.ts`: 4;
- `lib/subscription/aviso-de-pago-resuelto.ts`: 2;
- `lib/subscription/plan-display.ts`: 2.

Además, el tuteo que el ratchet no cuenta: «Te emitimos factura por cada pago: te la enviamos por correo»
(`CheckoutClient.tsx:840`), «tu banco», «tu plan».

## Lo que se hace
1. **Esas siete pantallas y textos, enteros, de usted.** Una pantalla no mezcla vos, tú y usted. Las líneas, en
   `master` `ef3e2325`:
   - `CheckoutClient.tsx`: 290, 303, 352, 357, 401, 421, 439, 490, 614, 625, 646, 664, 668, 686, 701, 713, 745, 840,
     931, 936 y 949;
   - `QRPaymentModal.tsx`: 71, 80, 115, 127, 313-320 y 362-363;
   - `page.tsx`: 29 («Elegí tu plan» → «Elija su plan»);
   - las rutas, en los errores que llegan a esas pantallas:
     - `subscription-payment/route.ts`: 158 y 184;
     - `bcp-qr/route.ts`: 72 y 102;
   - `aviso-de-pago-resuelto.ts`: 114, 117 («Si ya transferiste… escribinos» → «Si ya transfirió… escríbanos»), 135
     y 144;
   - `plan-display.ts`: 70 y 72 («propone, vos aprobás» → «propone; usted aprueba»).
2. **Usted correcto:**
   - Pruebe de nuevo · Elija · Genere · Escanee y pague · Ponga · Pida · Transfiera · Suba · Corrija · Puede cerrar ·
     Envíe una captura · Complete · Ingrese · Intente · Realice · Tome una captura · Arrastre · haga clic · Espere ·
     Revise · Configure;
   - «su» y «le» en vez de «tu» y «te»;
   - el negocio sigue saliendo de `{vocabulario.negocio}`, nunca escrito a mano.
3. **La factura dice lo mismo en el checkout y en el aviso (puntos 2 y 15).**
   - `CheckoutClient.tsx:840`: «Le emitimos factura por cada pago: se la enviamos por correo después de verificarlo.»
   - El aviso de pago aprobado (`aviso-de-pago-resuelto.ts:135` y `:144`) suma «La factura de este pago se la enviamos
     por correo.»
   - Sin plazo y sin «automática»: la factura sale a mano por el Portal Web del SIN.
   - `app/checkout/factura-por-cada-pago.test.ts` conserva sus cuatro pruebas, con el texto nuevo.
4. **Los tests que fijan esos textos se actualizan, no se borran.** Al menos:
   - `components/billing/QRPaymentModal.copy-sin-qr.test.ts`;
   - `lib/subscription/plan-nombra-los-agentes-del-runtime.test.ts`;
   - `lib/subscription/plan-promete-lo-que-el-rubro-alcanza.test.ts`;
   - el de `aviso-de-pago-resuelto`;
   - los que aparezcan al correr la suite.

## PRUEBA DE HECHO
- Test nuevo `__tests__/usted-pago.test.ts`, en un archivo propio: así no choca con C13b, que agrega el suyo.
  - Los siete archivos quedan en 0 con `contarArchivos` y en 0 en `__tests__/voseo-ratchet.linea-base.json`.
  - En lo que pinta `textoQueSePinta` de `CheckoutClient.tsx`, `page.tsx` y `QRPaymentModal.tsx` no queda `tu`, `tus`,
    `te`, `ti` ni `vos` como palabra suelta. Si choca un identificador de código, se excluye ese identificador en el
    test, nunca el texto.
- Hacelo fallar una vez a propósito (un «Probá» en el checkout) y anotalo en el resumen.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales. Si en tu
  entorno vitest no arranca (`spawn EPERM`), decilo: la suite la corre la madre o Plataforma.

## REGLA DE PARADA
- **Solo textos y sus tests.** No cambies lógica, montos, rutas, permisos ni props.
- **No toques lo de #113 (C13) ni de #114 (C15):**
  - `app/(dashboard)/settings/PlanClient.tsx`, `components/AvisoRenovacion.tsx` y `lib/email.ts`;
  - `lib/subscription/{vencimientos,plan-state,activation,aviso-solo-lectura,factura-del-pago}.ts`;
  - `app/(dashboard)/admin/**`, `app/api/admin/**`, `app/api/webhooks/bcp/**`, `app/api/n8n/**`,
    `app/api/organization/**` y `app/api/auth/register/**`.
  - En `bcp-qr/route.ts`, #114 cambia las líneas ~114-120: tocá solo los textos de 72 y 102.
- **Textos legales no:** el enlace a los Términos queda como está.
- Si al mergear choca `__tests__/voseo-ratchet.linea-base.json` (C13b baja líneas vecinas), no elijas un lado: se
  recuenta con `contarArchivos` y se pone el número real.

## Entrega
Un commit por grupo (checkout y su página; modal del QR; rutas y aviso de pago; `plan-display`), conventional en
castellano con el porqué. PR draft contra `master` con el SHA base, el conteo de voseo antes y después y los números
reales. Las capturas las saca Plataforma en producción después de publicar.
