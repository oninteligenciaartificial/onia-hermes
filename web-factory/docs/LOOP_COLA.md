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

## 🔴 FUENTE DEL BACKLOG (no duplicar)

El backlog REAL de web-factory, sacado del análisis de reels, vive en
`hermes-content/references/video-intake/sesiones/web-factory.md` — 20 prompts
ordenados (C1 → B1 → B2 → footers → popups → GSAP scroll → DESIGN.md → …) cada
uno con su LISTO y sus gates. **Esa es la cola maestra.** Esta sección "Cola" de
abajo es solo el frente de ESTA sesión (cliente de prueba + conocimiento); las
tareas grandes se toman de allá, en su orden, aplicando su Gate 1 (¿ya está
hecho? mirá el repo, no el prompt — varios bloques de B1 ya existen).

## Los dos loops (in-session, CronCreate)

- **TAREAS / desarrollo — cada 5 min.** Hace UNA tarea de la Cola por vuelta.
- **ANÁLISIS+DIRECCIÓN — cada 10 min.** Salud auto-remediable + analiza el
  avance y **reordena esta Cola** poniendo lo más valioso primero (hoy: cerrar
  los rubros SIN ANCLA del crítico). Es el que dirige; el de tareas ejecuta.

## Disciplina del loop (del ejemplo del carril chatbot, 2026-08-29)

- **UNA fase/tarea por vuelta**, la primera no-bloqueada. No abrir dos frentes.
- **Las tachadas NO se rehacen.** Lo marcado `[x]` está hecho; no se re-audita.
- **Bloqueado con decisión de Sergio → `PushNotification` y seguir con lo
  desbloqueado.** El loop nunca se frena esperando; salta a la próxima tarea.
- **Gates antes de dar por hecho** (regla 4). Verificar MIRANDO cuando toca UI.
- **Nada de cirugía inventada**: si una tarea no tiene receta clara, no se
  improvisa — se anota y se avisa.

## Runbook de salud (auto-REMEDIAR, no solo mirar)

Cada ítem: verificar → si roto, aplicar el arreglo conocido → si no hay arreglo
conocido, `PushNotification` a Sergio. Nunca inventar.

1. **Server 4319**: `curl -s -o /dev/null -w "%{http_code}" http://localhost:4319/dental-amanecer/`
   ≠200 → `node scripts/serve-out.mjs 4319` en background desde `web-factory/`.
2. **Rama pusheada**: `git log origin/claude/onia-web-architecture-b37eca -1` debe
   igualar `git log HEAD -1`. Si hay commits locales sin push → `git push`. Si
   árbol sucio de OTRA mano (cambios que no hice este run) → NO commitear, avisar.
3. **typecheck:packages verde**: desde `web-factory/` `pnpm typecheck:packages`.
   Rojo → arreglar la causa mínima en zona propia y commitear el fix con su
   porqué. Si el error es fuera de zona → PushNotification.
4. **Sin zombies**: procesos node de corridas de test viejas colgadas → matar.
5. **Prueba**: cerrar con la línea de estado + el código real que la respalda
   (200, hash del push, exit 0). Un grep no es prueba.

## Cola (orden = prioridad)

- [ ] **P0 cosecha SIN-ancla** (cierra los huecos del crítico, ver
      `2026-08-29-critico-limites.md`): con `scratchpad/corpus-harvest.py`
      ampliar CATS a rubros que faltan y correr 1 tanda por vuelta —
      `dental real` (clínicas dentales, no salud mental), `ganadero/agtech`,
      `importadora/logística B2B`, `IA/agentes`. Despiezar 2 por rubro
      (Scrapling Fetcher + seguir CSS externo para tipografía real) y
      reescribir la sección de ese rubro en `2026-08-29-vertical-playbooks.md`
      cambiando "SIN ANCLA" por el dato real. Re-cosechar también el CSS de los
      11 sitios con `fonts:[]` (getnudge, maxima, maticrobots, readily, sutera…).

- [ ] **Minado lapa — tandas siguientes** (misma receta que la tanda 1, ver
      ficha del barrido): 1 categoría por run, en orden `ecommerce` →
      `agency`/`business` → `beauty` → `food-drinks`. Usar
      `Fetcher.get(stealthy_headers=True, impersonate="chrome")`; el script
      vive en el scratchpad de la sesión.
- [ ] **Update skill ui-ux-pro-max**: el repo va por v2.13 con `gallery/` y
      `stack/` nuevos; la instalada es anterior. Ver mecanismo oficial
      (`uipro-cli` npm, MIT) y actualizar SOLO la skill local.
- [ ] **Spotlight móvil**: verificar que en touch (sin hover) nada raro quede
      renderizado (captura 360px y mirar).
- [ ] **Dark de la demo**: capturar dental-amanecer con prefers-color-scheme
      dark (los tokens traen bloque dark) y mirar contraste banda tinta/strip.

## TAREA GRANDE — Dashboards (pedido Sergio 2026-08-29)

Aprender de ~30 dashboards reales para MEJORAR el nuestro y cambiarlo.
- [x] Baseline capturado: nuestro `dashboard-demo` (template `dashboard.ts`) —
      funciona pero genérico (acento violeta, no la marca Onia).
      Captura: `scratchpad/dash/nuestro-actual.png`.
- [ ] Cosechar ~30 referencias (Grafana Play, shadcn examples, Tremor, admin
      templates, demos analytics) — `scratchpad/shoot-dash.js`. Renderizan por
      navegador (no Scrapling). Guardar en `scratchpad/dash/refs/`.
- [ ] Analizar: jerarquía info, fila de KPIs, estado por forma+color, sparklines/
      charts, color semántico ≠ acento, densidad. Cruzar con
      `docs/DASHBOARD_PATTERN_BANK_2026.md` (ya existe) + skill `dataviz`.
- [ ] Mejorar el template `packages/templates/src/dashboard.ts` (NUESTRA zona) a
      la marca Onia (verde/warm) + los patrones aprendidos; demo renderizado y
      mirado.
- [ ] PROPUESTA de rediseño del dashboard de Onia Platform (admin real) — ese
      vive en `onia-platform`/`onia-center` (OTRA lane): se propone y se coordina,
      no se toca desde acá.

## Bloqueadas (esperan a Sergio)

- [ ] Bloques nuevos: cifra-editorial · quote-única · features numeradas+device
      (propuesta enviada; sin OK no se implementan — regla de formas nuevas).
- [ ] Cablear texturas SVG (`textura-ondas.svg`/`textura-arco.svg`) en bandas.

## Hechas (por runs o por la sesión madre)

- [x] **Estética/beauty anclada** (2026-08-29). Cosechada categoría `beauty` de
      lapa; despiece de ONSKN (onskn.com) = primer dato real del sub-eje
      skincare (nude cálido + blush + charcoal), distinto del wellness crema.
      Inyectado en §2 del playbook. N=1: cosechar 2-3 skincare más.
- [x] **Re-cosecha CSS/fuentes de los 14 sitios `fonts:[]`** (2026-08-29). Los
      builder/Next ocultan la fuente en `var()` + archivos hasheados; se saca del
      `<link rel=preload as=font>`. Hallazgo: "PP Fragment Glare" era real, de
      **readily.ai (SaaS)**, mal-atribuida a dental — corregido en el libro de
      límites. Método anotado en la ficha lapa-scrapling. Next hasheados
      (joindawn) = no recuperables por HTTP: se dice, no se inventa.

- [x] **Minado lapa con Scrapling** — tanda 1 `health-fitness` hecha (2026-08-29).
      El 403 lo pasa `Fetcher.get(impersonate="chrome")`, NO el StealthyFetcher
      (no arranca acá: `spawn UNKNOWN` bajo el contenedor MSIX). Slugs reales +
      3 mejores landings del rubro salud (Baba Care · Frequency Breathwork ·
      Dawn) en la ficha del barrido. Quedan tandas: `ecommerce`,
      `agency`/`business`, `beauty`, `food-drinks` — se reponen abajo.
- [x] 2026-08-29 sesión: dirección salud-premium (pesos+miel) · spotlight card ·
      banda tinta · circuito API clinic · fixes Vercel/tsc · barrido 1→15.
