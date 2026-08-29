# Cola del loop de desarrollo — carril web-factory (cliente de prueba)

> La leen los runs del scheduled-task `web-factory-dev-loop` (sesiones frescas
> sin contexto). Reglas primero, cola después. Se EDITA al completar tareas.

## Reglas duras del run

1. **Worktree**: `C:\dev\proyectos\onia-hermes\.claude\worktrees\hyperframes-onia-export-formats-053cf9`
   — rama `claude/onia-web-architecture-b37eca`. NO trabajar en otro checkout.
2. **Anti-choque**: si `git status --short` NO está limpio → hay otra mano en el
   árbol: NO tocar código; solo verificar salud (regla 5) y salir.
3. **Zona propia**: `web-factory/{data,packages,generate,out,tests,docs,FACTORY.md}`
   + `.claude/skills/onia-web-factory/`. PROHIBIDO tocar `web-factory/apps/**`,
   `hermes-content/docs/**` (salvo `handoff/web-factory-cliente-prueba.md`) y n8n.
4. **Una tarea por run**, la primera no-bloqueada de la cola. Gates antes de
   commit: `pnpm typecheck:packages` + `pnpm test` (desde `web-factory/`), y si
   se tocó template/bloque: rebuild demo
   (`pnpm factory:build --input data/intakes/dental-amanecer.intake.json --force`)
   + capturar con el script del scratchpad si existe, o al menos servir y mirar.
   Commit conventional (sin firma de Claude) + push. Marcar la tarea `[x]` acá.
5. **Salud** (siempre, aun con árbol sucio): server `http://localhost:4319/dental-amanecer/`
   responde 200 (si no: `node scripts/serve-out.mjs 4319` en background desde
   `web-factory/`); rama pusheada (`git log origin/... -1`).
6. Contexto del carril: `hermes-content/docs/handoff/web-factory-cliente-prueba.md`
   y fichas en `web-factory/data/references/design-sources/2026-08-29-*.md`.

## Cola (orden = prioridad)

- [ ] **Minado lapa espaciado**: 1 categoría por run (máx 2 requests), guardar
      3 mejores landings del rubro con nota en la ficha del barrido. Categorías
      pendientes: food/restaurant, commerce, beauty, services (los slugs se
      descubren desde la portada, que responde 200).
- [ ] **Update skill ui-ux-pro-max**: el repo va por v2.13 con `gallery/` y
      `stack/` nuevos; la instalada es anterior. Ver mecanismo oficial
      (`uipro-cli` npm, MIT) y actualizar SOLO la skill local.
- [ ] **Spotlight móvil**: verificar que en touch (sin hover) nada raro quede
      renderizado (captura 360px y mirar).
- [ ] **Dark de la demo**: capturar dental-amanecer con prefers-color-scheme
      dark (los tokens traen bloque dark) y mirar contraste banda tinta/strip.

## Bloqueadas (esperan a Sergio)

- [ ] Bloques nuevos: cifra-editorial · quote-única · features numeradas+device
      (propuesta enviada; sin OK no se implementan — regla de formas nuevas).
- [ ] Cablear texturas SVG (`textura-ondas.svg`/`textura-arco.svg`) en bandas.

## Hechas (por runs o por la sesión madre)

- [x] 2026-08-29 sesión: dirección salud-premium (pesos+miel) · spotlight card ·
      banda tinta · circuito API clinic · fixes Vercel/tsc · barrido 1→15.
