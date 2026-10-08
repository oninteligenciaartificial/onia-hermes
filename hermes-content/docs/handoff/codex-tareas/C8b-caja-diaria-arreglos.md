# C8b · Caja diaria: que recepción no vea un descuadre que no existe

Sos Codex. Trabajás SOLO en `onia-platform`, rama `codex/punto-8-caja-diaria` (la del PR #110, head `34daf14e`).
- Primero `git branch --show-current`. Después `git merge origin/master`.
- Aplicá el banco: `git am hermes-content/docs/cola/capturas-caja-diaria/banco.patch` (en `onia-hermes`; crea
  `/dev/caja-diaria` con `?estado=sin-abrir|abierta|cerrada&rol=dueno|recepcion`). Si no aplica limpio, copiá `app/dev/**`.

## META
Las capturas (`hermes-content/docs/cola/capturas-caja-diaria/`) muestran que recepción ve «Efectivo esperado Bs 0,00» y,
al escribir lo contado, un «Descuadre Bs 225,00» en rojo que no existe. Eso hace pelear a la recepcionista con el dueño
por plata que no falta. Se arregla antes de mostrarle la pantalla a Sergio Urcullo.

## Fallas y lo que se espera
1. **Recepción** (la API manda `esperado: null`): no se muestra ni «Efectivo esperado» ni «Esperado» ni «Descuadre», en la
   caja abierta ni en la cerrada. Recepción ve: fondo, lo cobrado por medio, sus salidas, y el campo «Efectivo contado».
   El tipo del cliente tiene que reflejar el `null` (no `number` con `?? 0`).
2. **Dueño, sin escribir nada**: el cierre dice «Contado Bs 0,00 · Descuadre Bs −230,00» en rojo. Esperado: el descuadre
   aparece recién cuando hay un número en «Efectivo contado»; antes, solo «Esperado Bs 230,00».
3. **Tildes**: «Salidas del día», «Todavía no hay cobros hoy.», «Solo el dueño ve el detalle completo.».
   Barré el resto de los textos de la pantalla y de los errores de `app/api/caja-diaria/route.ts`.
4. **Rótulos técnicos**: `EFECTIVO`, `TRANSFERENCIA`, `STRIPE`… → «Efectivo», «Transferencia», «QR», «Tarjeta», «Otro»
   importando `ETIQUETA_METODO` de `lib/cobros.ts`; no la copies: ya hay cuatro copias en el producto y esta sería la quinta.
   Las tarjetas de un medio en Bs 0,00 no se muestran (salvo Efectivo, que siempre va).
5. **Qué día es**: el encabezado dice el día de la caja («Caja del martes 6 de octubre»), en la zona horaria del negocio.
6. **La nota del cierre** se guarda pero no se ve: mostrarla en la caja cerrada (dueño y recepción).

## PRUEBA DE HECHO
- Tests de render (`@testing-library/react`, como los de `__tests__/` vecinos) para: recepción abierta y cerrada sin
  «Esperado»/«Descuadre»; dueño sin contado sin «Descuadre»; dueño con 225 → «Descuadre −Bs 5,00»; nota visible; medios
  en 0 ocultos.
- Capturas 390 y 1440 de los 7 casos del banco en `docs/capturas/c8b/`, abiertas y MIRADAS.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo verde.

## REGLA DE PARADA
- Tocás: `app/(dashboard)/caja-diaria/**`, `lib/caja-diaria.ts` (solo formateo, no el cálculo), los textos de error de
  `app/api/caja-diaria/route.ts`, `app/dev/caja-diaria/**` y sus tests.
- **No cambies** el cálculo del esperado, la migración `20261004190000_add_daily_cash`, permisos ni `app/api/payments/route.ts`.
  Si creés que el cálculo está mal, al resumen con el caso.
- Textos de usted. No toques `app/globals.css` (C6c).

## Entrega
Commits conventional en castellano con el porqué, push a la misma rama (actualiza el PR #110). Resumen: SHAs, números de
tsc/eslint/vitest y la lista de capturas.
