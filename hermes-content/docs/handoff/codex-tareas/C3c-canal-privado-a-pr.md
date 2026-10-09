# C3c · El canal privado de la agenda (punto 3) a un PR

Sos Codex. SOLO `onia-platform`. Es una tarea de INTEGRACIÓN: el código ya está escrito y probado; falta que viva en
un PR con CI. Anotá el SHA de `master` del que partís.

## META
El canal de Realtime `appointments:<organizationId>` es **público**. La clave anon va en el bundle y el
organizationId no es secreto (viaja en links del portal y en URLs de webhooks). Cualquiera escucha cuándo se crean, mueven
o borran citas de otra clínica, y puede publicar avisos falsos. El B22 (3-oct, en producción) ya sacó los datos
clínicos del mensaje; esto cierra el canal. Es la parte que falta del **punto 3** de la 1.0 (meta: 16-oct).

## Lo que se hace
1. Traer los commits del resguardo de Plataforma (onia-hermes, rama `claude/optimistic-ride-1sp5fe`, carpeta
   `hermes-content/docs/cola/ramas-locales/`, LEEME incluido):
   `git fetch <ruta>/plataforma-ramas-locales-20261009.bundle 'refs/heads/wip/canal:refs/heads/wip/canal'`
2. Rama nueva desde `master`: `codex/punto-3-canal-privado`. `git cherry-pick 7d6b02cb 92bdfb3b`. Plataforma ya
   comprobó (9-oct) que los dos entran LIMPIOS sobre `master`; no hay que tocar código.
3. Gates y PR draft contra `master` con el cuerpo del commit `7d6b02cb`, más el orden de deploy de abajo.

## Orden de deploy (va en el cuerpo del PR)
1. **Primero la migración** `20261005140000_realtime_citas_privado`, con el OK de Sergio Urcullo: es infra de
   Realtime, una política `FOR SELECT TO authenticated` en `realtime.messages`, solo broadcast y solo el topic de su
   organización. Con la imagen vieja no rompe nada, porque el canal público sigue andando (`private_only=false`).
2. Después la imagen. Si la imagen sale sin la migración, la agenda no se rompe: apaga «En vivo» y lo ajeno aparece al
   recargar (`lib/realtime/escuchar-citas.ts`).
3. MIRAR en producción: la agenda de una cuenta de prueba muestra «En vivo», y una cita creada en otra pestaña
   aparece sola.

## PRUEBA DE HECHO
`npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` COMPLETO en verde, con números reales. Incluye
`__tests__/realtime-citas-privado.test.ts` y `lib/realtime/escuchar-citas.test.ts`.

## REGLA DE PARADA
- No apliques la migración ni toques producción.
- Si el cherry-pick deja de ser limpio porque `master` se movió, resolvé y explicá cada conflicto en el PR. No
  reescribas la lógica.
