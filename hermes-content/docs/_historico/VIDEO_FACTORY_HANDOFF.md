# Video Factory — Handoff (retomar en próxima sesión)

> Fecha: 2026-07-05 · Contexto: la sesión larga cerró aquí. Este doc lista lo
> pendiente para retomar fresco, idealmente con subagentes en paralelo.
> Fuentes: `VIDEO_FACTORY_DESIGN.md` (spec), `VIDEO_FACTORY_PLAN.md` (plan MVP),
> memoria `video-factory-state`.

## Estado actual (qué está hecho)

- **MVP de la fábrica** (`video-factory/`): contratos zod, 3 lanes, 3 formatos
  ancla, engine (model-map + adapter + buildPlan + track idempotente), radar
  snapshot, CLI `vf plan|radar`. 31 tests verdes. **Ya en `origin/main`.**
- **Panel Video Lab** (`web-factory/apps/site/src/app/onia-center/video-lab/`):
  ruta `/onia-center/video-lab`, galería de jobs (preview/estado/lane/costo/gate),
  métricas, lanes, pipeline, reglas. `next build` verde. **En el branch
  `claude/determined-stonebraker-398610`, pendiente de merge a `main`.**
- **Fase 2 — formatos restantes + avatar-outfit (estructura)**: en progreso por
  subagente esta sesión (formatos `product-showcase`, `explainer`, `viral-preset`,
  `clip-from-long`, `avatar-outfit` + extensión del schema + tests). Verificar al
  consolidar.

## Decisión de arquitectura (tomada 2026-07-05)

**El panel/sistema opera; Higgsfield es el motor por API/CLI, NO su UI.**
Para el caso "subir una prenda y vestir el avatar de Sergio": se sube al panel,
el sistema orquesta el try-on y guarda el resultado en el Video Lab con gate de
identidad. La UI de Higgsfield no es el lugar de operación diaria (manual, sin
registro, no automatizable). Matiz: exploración / funciones nuevas one-off sí se
hacen en Higgsfield o vía el MCP interactivo; lo repetible va al panel.

Nudo técnico: el **MCP de Higgsfield vive en la sesión de Claude** (interactivo);
un panel en el VPS no lo puede llamar solo. El camino desatendido es
**Higgsfield API REST / CLI con token** (corre en VPS/n8n) → llena el `runtime`
inyectable del `adapter` (`engine/higgsfield/`). Riesgo: la API REST oficial está
poco documentada; si no es estable, ir por **CLI con token en el VPS**.

## Pendientes (priorizados) para la próxima sesión

### P1 — Generación real (el corazón que falta)
- `video-factory/engine/generate.mjs`: implementar `runtime` real que llame a
  Higgsfield (API REST o CLI `@higgsfield/cli` con token), con **polling async**
  (Higgsfield es asíncrono) e **idempotencia por `input_hash`** (ya hay helper).
- Decidir/validar: API REST oficial (`cloud.higgsfield.ai`) vs CLI-en-VPS.
- El `adapter` ya acepta `{ runtime }`; solo falta el runtime concreto.
- Gate: para lane cliente, estimar costo (MCP `generate cost` o CLI) antes.

### P2 — avatar-outfit: prueba real (necesita input del usuario)
- **Bloqueante humano**: falta la **imagen de la prenda** que el usuario quiera
  probar + el **soul_id de Sergio** (existe uno validado en `HIGGSFIELD_VIDEO_SYSTEM.md`)
  + autorización de gasto de créditos.
- **Validar la ruta técnica**: el `models_explore` con query "virtual try-on"
  volvió vacío. Buscar el modelo/tool correcto: probablemente `nano_banana`
  (outfit edit sobre imagen) o Marketing Studio modo `virtual_try_on` /
  `ugc_virtual_try_on`. Confirmar qué roles de media acepta (referencia + prenda).
- Ejecutar 1 prueba controlada (lane sergio → gate identidad, revisar still antes
  de aceptar). No marcar `identity_ok` en automático.

### P3 — Upload en el panel (lo que pidió el usuario: "subir la prenda ahí")
- Intake de outfit en `onia-center/video-lab`: formulario que sube la imagen de
  la prenda + elige avatar → crea el job. Patrón: `onia-center/web-factory/intake-form.tsx`.
- Requiere **storage** (Supabase storage del stack onia_center) + endpoint POST.
  El panel actual es `force-static`; el intake necesita una route handler (dynamic).

### P4 — Conectar jobs REALES al panel (hoy usa seed)
- El panel `force-static` no lee `.hermes/video-lab/` en runtime. Opciones:
  snapshot generado por el brain (script que exporta jobs → JSON que el build
  consume) o **Supabase** (tabla `onia_center` para jobs de video). Definir.
- Botón "aprobar" real (mutación de estado del job) → endpoint + n8n.

### P5 — Automatización (n8n + Telegram)
- Botones Telegram: aprobar / rehacer / publicar por chat (bot Hermes o n8n).
- n8n: recordatorios de jobs en `waiting_approval`, polling de jobs `generating`,
  aplicar aprobaciones. Respetar plan VPS (credenciales n8n, sin `$env`).
- `radar/refresh.mjs` real: conectar a `models_explore` + `presets_show` del MCP
  para snapshots frescos automáticos (hoy el snapshot es un seed manual).

### P6 — Pulido
- **Hydration fix**: `onia-center/web-factory/motion-shell.tsx` tiene mismatch por
  `useReducedMotion` en SSR → los reveals pueden quedar `opacity:0` (invisibles)
  con reduced-motion activo. Afecta Web Factory Y Video Lab (componente compartido).
  Fix: estado `mounted` (aplicar motion solo en cliente) o `initial` consistente.

## Cómo retomar con subagentes (frentes paralelizables, zonas sin colisión)

- **Subagente 1** → P1 generación real (`video-factory/engine/`).
- **Subagente 2** → P3 upload UI (`web-factory/apps/site/.../video-lab/` + route handler).
- **Subagente 3** → P6 hydration fix (`.../web-factory/motion-shell.tsx`) — verificar con `next build`.
- P2 (avatar-outfit real) y P4 (fuente de jobs) requieren decisión/input humano
  primero → no delegar en frío hasta tener la prenda / elegir Supabase vs snapshot.

## Git

- Branch de trabajo: `claude/determined-stonebraker-398610`.
- `origin/main` avanzó mucho (multi-sesión); consolidar con la técnica del worktree
  (checkout main en el worktree, merge `origin/main`, merge del branch, push).
