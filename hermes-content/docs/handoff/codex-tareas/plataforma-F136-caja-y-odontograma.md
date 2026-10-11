estado: hecha (onia-platform codex/f136-caja-odontograma 4bd9da9c, suite 10.517/0; draft PR a las 07:12 UTC)
modelo: gpt-6-astra (plata)
carril: plataforma
origen: revisión E3 de Hermes (onia-hermes f6b1b50a, docs/cola/loop/hermes-jarvis.md §E3); #136 se mergeó con estos 2 HIGH (282ae3ab)

# F136 · Caja diaria lee mal los montos y borrar un paciente borra sus caras del odontograma

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-f136`, rama `codex/f136-caja-odontograma` desde
`origin/master` `a7d8c1ed`. No hagas git: la madre revisa, corre la suite completa, commitea y abre el PR.

## META
Dos fallas verificadas en código que ya están en `master`:
1. **Caja diaria:** `parseMoney` (`app/(dashboard)/caja-diaria/CajaDiariaClient.tsx:40-44`) lee «1.500» como 1,5,
   «1,500» como 1,5 y «1.500,50» como NaN (botón apagado sin explicación). El esquema acepta 1,5
   (`app/api/caja-diaria/route.ts:35`), el cierre no pide confirmación (`CajaDiariaClient.tsx:704-707`, `:726`) y no se
   puede reabrir (`route.ts:39`; segundo cierre 409 en `:316`). Después del cierre, `POST /api/payments` del día da 409:
   un cierre con Bs 1,50 por error frena los cobros manuales hasta la medianoche.
2. **Odontograma:** `ToothSurfaceRecord` tiene `onDelete: Cascade` hacia el paciente (`prisma/schema.prisma:938`) y
   `lib/platform/borrado-bloqueado.ts:126-131` no lo lista como expediente (RM 0090/2008 art. 31). Un ADMIN que borra un
   paciente que solo tiene caras las pierde sin aviso. El test (`borrado-bloqueado.test.ts:73-74`) salta las relaciones
   con `onDelete:` y su lista `EXPEDIENTE` (`:119-125`) es manual.

## Qué hacer
1. Montos en formato es-BO, en una función pura exportada (por ejemplo `lib/dinero/leer-monto.ts`) usada por la caja:
   coma = decimal; punto = miles solo si le siguen grupos de exactamente 3 dígitos («1.500» → 1500, «12.345,50» →
   12345.5, «1500» → 1500, «1500,5» → 1500.5); lo ambiguo o inválido («1.50», «1,500.25», «abc», negativo) → null con
   motivo. Bajo el campo se muestra el monto leído («Se registrará Bs 1.500,00»).
2. Cierre con confirmación: paso explícito «Se cerrará la caja con Bs X. Solo un administrador puede reabrirla.» antes de
   enviar. `disabledReason` visible en los tres botones (`:359`, `:643`, `:726`).
3. Acción `reopen` en `app/api/caja-diaria/route.ts`, solo para quien tiene `approvals.decide`
   (`lib/onia-core/roles.ts`), con registro en `lib/audit` (quién, cuándo, monto del cierre anulado). Al reabrir, los
   cobros manuales del día vuelven a aceptarse. Validación con el esquema existente (zod).
4. Odontograma: sumar `toothSurfaceRecord` (`patientId`) a la lista con `expediente: true` en `borrado-bloqueado.ts`, y
   que el test derive también los hijos con `onDelete: Cascade` desde el schema (no solo los sin cascada), así una tabla
   clínica nueva con cascada no se escapa.
5. Textos al dueño de usted («Se cerrará…», «Escriba el monto…»). Sin voseo ni tuteo.

## PRUEBA DE HECHO
- Test de `leer-monto` con la tabla de casos de arriba (incluye «1.500» → 1500 y «1.50» → null).
- Test de la ruta: `reopen` sin `approvals.decide` → 403; con permiso → 200, queda auditoría y `POST /api/payments`
  del día vuelve a 200.
- Test de `borrado-bloqueado`: falla si se quita `toothSurfaceRecord` de la lista (hacelo fallar una vez y anotalo).
- `npx tsc --noEmit` sin errores nuevos en lo tocado, eslint de lo tocado 0, `npx vitest run` de los tests tocados.

## REGLA DE PARADA
- Sin migraciones nuevas (no toques `prisma/migrations/**`; el schema solo si es imprescindible y lo decís).
- No toques `app/(dashboard)/inbox/**`, `app/(dashboard)/agents/**`, `app/(dashboard)/dashboard/**`, pricing ni webhooks.
- No cambies montos ni redondeos de cobros existentes fuera de la caja.
- Si después de dos intentos algo sigue rojo por causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con archivos, números de tsc/eslint/vitest, el test que se puso rojo a propósito y lo que no
pudiste decidir.
