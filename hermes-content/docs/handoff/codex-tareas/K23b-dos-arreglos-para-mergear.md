# K23b · Dos arreglos de una línea para que #133 (K2) y #134 (K3) se puedan mergear

> **HECHO el 9-oct** (#133 `6506d072`, #134 `7c7e16df`; suite completa de las dos juntas: 9.839 en verde, tsc 0).
> ⚠️ **Corrección de Plataforma:** la META de abajo decía «con estos arreglos quedan para mergear y publicar». Era
> falso: seguían abiertos los hallazgos de la revisión del 8-oct, `K2b` (#133) y `K3b` (#134). No se mergea sin ellos.

Sos Codex. SOLO `onia-platform`. Dos ramas, un arreglo cada una. Anotá los SHAs base.

## META
Plataforma (9-oct) corrió la suite COMPLETA de cada PR mergeado con el `master` de hoy. Los dos fallan un solo test, por
motivos distintos. Con estos arreglos quedan para mergear y publicar: son funciones sobre pantallas que ya existen.

## K2 · rama `codex/recuperar-canceladas` (#133)
1. Mergear `master`. Choca solo `docs/PROJECT_BACKLOG.md`: quedarse con las dos entradas (K2 y después C16a).
2. `__tests__/voseo-ratchet.test.ts` falla porque el voseo **bajó**: el PR cambió «Aprobá el mensaje para ofrecerle
   reprogramar.» por «Apruebe el mensaje…» (`lib/onia-core/modules/agents-runtime.ts:1877`). El gate exige registrar la
   baja: en `__tests__/voseo-ratchet.linea-base.json` (línea ~245), `"lib/onia-core/modules/agents-runtime.ts": 6` (era 7).
3. De paso, sin bloquear: `getAgentFeed` (`agents-runtime.ts:1109`) llama a `getReprogramadorFeed` con los 30 días por
   defecto e ignora `metadata.ventanaDias` del agente; la búsqueda pasó de 15 a 31 días bajo el tope de 500 filas.
   Pasarle la ventana del agente.

## K3 · rama `codex/semilla-dental` (#134)
1. Mergear `master` (entra limpio).
2. `lib/platform/gestios-track.test.ts` falla también en la rama sola: `TypeError: tx.$queryRaw is not a function` en
   `sembrarDental` (`lib/platform/semilla-dental.ts:26`), llamado desde `lib/platform/provisioning.ts:278`. La semilla
   dental corre en TODAS las altas, de cualquier rubro.
   Arreglo: en `provisioning.ts:278`,
   `if (verticalTrackId === "dentagest-clinical") await sembrarDental(tx, organization.id, profile.id);`.
   Plataforma lo probó sin commitear: los 11 archivos que tocan el alta o la semilla pasan (201 tests) y tsc da 0. Además
   saca una consulta con bloqueo de cada alta que no es dental.
3. De paso, sin bloquear: el aviso del alta (`AVISO_SEMILLA_DENTAL`) habla del horario y de los precios de ejemplo en 0;
   cuando el onboarding los reemplaza, el aviso queda viejo. Que se apague solo después de ese paso.

## PRUEBA DE HECHO
En cada rama: `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales.

## REGLA DE PARADA
No toques producción ni la base. Sin migraciones. No subas ninguna línea base del ratchet de usted.

## Entrega
Un commit conventional en castellano por rama, con el porqué. Resumen con SHAs y números reales.
