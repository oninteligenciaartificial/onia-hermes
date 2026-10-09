# K3c · La demo instantánea no recibe la semilla dental (arreglo chico después de #134)

Sos Codex. SOLO `onia-platform`, rama nueva desde `master` **después** de que #134 esté mergeado:
`codex/k3c-demo-sin-semilla`. `git branch --show-current` primero. Anotá el SHA base.

## META
La revisión de K3b (9-oct) encontró un cruce en un camino que hoy no usa nadie (0 cuentas `demo-%` en producción, la
ruta `POST /api/onia-core/demo` es solo de SUPERADMIN). `lib/platform/demo-provisioning.ts` llama a
`sembrarDentalTrasAlta` ANTES de `profile.seed` (`seedDemoData`, `lib/onia-core/demo-seed.ts`). La demo dental quedaría
con los 6 servicios de ejemplo en Bs 0, «Limpieza dental» repetida (Bs 0 y Bs 150) y el aviso «Complete su plantilla
dental». Una demo es para mostrarle a un prospecto un sistema que ya funciona: ni precios en 0 ni avisos de plantilla.

## Lo que se hace
- Sacar la llamada a `sembrarDentalTrasAlta` de `provisionDemoOrganization` (y su import). La demo ya trae su propio
  catálogo con precios (`seedDemoData`).
- Test: una demo dental provisionada no llama a `sembrarDental` y queda solo con los servicios de `seedDemoData`.

## PRUEBA DE HECHO
`npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales.

## REGLA DE PARADA
No toques el alta normal ni la de admin (las dos siguen sembrando), ni producción. Sin migraciones.
