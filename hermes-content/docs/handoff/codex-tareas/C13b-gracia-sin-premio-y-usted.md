# C13b · La gracia de 7 días sin premiar al que paga tarde, y de usted (arreglos de #113)

Sos Codex. SOLO `onia-platform`, sobre la rama `codex/punto-13-gracia-y-no-renovar` (onia-platform#113). Anotá el SHA base.

**Punto del plan:** 13 de `ONIA_PLAN_1.0_Y_CAJA.md` (7 días de gracia y botón «no renovar»).

> **Refrescada el 9-oct contra `master` `ef3e2325`:** #113 sigue en `2f2b0743` y choca solo en los dos docs del
> paso 1 (medido con `git merge-tree`). Desde #128, `master` trae el gate de usted
> (`__tests__/voseo-ratchet.test.ts`): al mergear va a marcar los textos de C13 y sus archivos nuevos. Eso es el
> paso 2, que ahora cubre Mi plan ENTERA. En paralelo corre U2 (el checkout y el pago de usted): no se pisan
> archivos, ver la regla de parada.

## META
La revisión de Plataforma (9-oct) encontró que #113 no se puede mergear: choca con `master`, falla el gate de usted y
tiene un agujero de plata. Se arregla acá; el resto de #113 está bien (la prueba conserva su día de gracia y la gracia
de 7 días llega a todas las puertas de acceso).

## Lo que se hace
1. **Mergear `master`** en la rama. Chocan solo `docs/CHANGELOG.md` y `docs/PROJECT_BACKLOG.md` («Hallazgos De
   Agentes»): quedarse con los dos lados (lo de `master` primero, después C13).
2. **De usted todo texto nuevo al dueño, y Mi plan entera** (hoy rompe `__tests__/voseo-ratchet.test.ts`; NO subir
   la línea base). Una pantalla no mezcla vos y usted: además de los textos de C13, las 14 formas que `PlanClient.tsx`
   ya trae en `master` («Elegí tu plan», «Revisá los datos y volvé a enviarlo», «Agentes que proponen y vos aprobás» →
   «Agentes que proponen; usted aprueba», como lo deja U2 en `plan-display.ts`), `lib/subscription/aviso-solo-lectura.ts:57`
   («Podés consultar…») y, de `lib/email.ts`, SOLO `renewalCopy` (el resto del archivo es de otra tanda):
   - `app/api/organization/renovacion/route.ts:25,34,40,57` («Indicá… querés», «pagá», «Recargá… intentá»);
   - `app/(dashboard)/settings/PlanClient.tsx:611,621,626,702`;
   - `components/AvisoRenovacion.tsx:33,53` («Si renovás»);
   - `lib/email.ts:1206,1213,1216,1220` («tenés», «renovalo», «seguís»);
   - `lib/subscription/vencimientos.ts:177,182`.
3. **Pagar tarde no puede regalar días (H1).** Hoy `lib/subscription/plan-state.ts:189` (`extendPlanEnd`) extiende
   desde el vencimiento viejo si el pago entra en la gracia, pero desde el momento de la APROBACIÓN si entra después del
   corte. Ejemplo semanal: pagado 1 h antes del corte → período nuevo de ~1 h; pagado 2 h después → una semana entera.
   - El período nuevo arranca en `max(vencimiento viejo, momento del pago − 7 días)`: la gracia que se usó, se cobra.
   - «Momento del pago» = `createdAt` del pago, no la hora en que el operador aprueba. Pasarlo a `activatePaidPlan` en
     los tres caminos: `app/api/admin/subscription-payments/route.ts:156`, `app/api/n8n/callback/subscription-approve/route.ts:141`
     y `app/api/webhooks/bcp/route.ts:191`.
   - Tests: pago dentro de la gracia; pago 2 h después del corte; pago 30 días después; el texto del aviso coincide
     con la regla.
   - Esta regla es la recomendada; si Sergio Urcullo decide otra, este commit se revierte solo.
4. **Barrer las fuentes que dicen «sin gracia para planes pagos»**, para que nadie lo revierta:
   `docs/ONIA_V1_MAPA_VENTA_2026-09-14.md:62-63`, `.claude/skills/onia-frontend/SKILL.md:74-76` y el comentario de
   `lib/subscription/baja-programada.ts:25`.
5. **Arreglos chicos:**
   - el aviso de baja programada muestra la fecha en hora de La Paz, como Mi plan (`baja-programada.ts:76` contra
     `PlanClient.tsx:722`), y saca «escribinos»: ahora hay botón para deshacer;
   - en Mi plan, el aviso de gracia de un plan PAGO lleva a renovar (`dondeSeRenueva`), no al «Contratar» de la prueba
     (`PlanClient.tsx:705-715`).

## PRUEBA DE HECHO
- Test nuevo `__tests__/usted-mi-plan.test.ts`, en un archivo propio para no chocar con el de U2. Deja en 0 (con
  `contarArchivos` y en la línea base) `PlanClient.tsx`, `components/AvisoRenovacion.tsx`,
  `app/api/organization/renovacion/route.ts`, `lib/subscription/vencimientos.ts` y `aviso-solo-lectura.ts`.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde (números reales; el ratchet de
  usted incluido). No alcanza con `vitest related`. Si en tu entorno vitest no arranca (`spawn EPERM`), decilo: la
  suite la corre la madre o Plataforma.

## REGLA DE PARADA
- No toques producción ni la base. Sin migraciones.
- No toques lo de U2 (corre en paralelo): `app/checkout/**`, `components/billing/QRPaymentModal.tsx`,
  `app/api/subscription-payment/**`, `lib/subscription/aviso-de-pago-resuelto.ts` y `lib/subscription/plan-display.ts`.
  Si al mergear choca `__tests__/voseo-ratchet.linea-base.json` (U2 baja líneas vecinas), no elijas un lado: se
  recuenta con `contarArchivos` y se pone el número real.
- No cambies los Términos §3.4 ni la FAQ pública: son textos legales y los aprueba Sergio Urcullo.

## Lo que decide Sergio Urcullo (no vos)
- Si la gracia se cobra (recomendado, el punto 3) o se regala.
- Si el plan semanal tiene una gracia más corta (1 o 2 días): hoy 7 días de gracia en un plan semanal son una semana
  gratis, y el cliente que paga tarde vuelve a ver «vence hoy» a las pocas horas.
- El texto de los Términos §3.4.

## Entrega
Commits conventional en castellano con el porqué, en la rama de #113. Resumen con SHAs y números reales.
