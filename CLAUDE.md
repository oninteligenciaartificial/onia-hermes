# CLAUDE.md — Onia

Instrucciones de proyecto. Override sobre defaults.

> Ordenado por **cuándo se necesita**: arriba lo de cada sesión, abajo el detalle de
> dominio. Cada regla lleva el caso real que la originó — una regla sin su historia se
> desobedece; con la historia, no.

---

# 1. Al arrancar

## Objetivo por sesión (REGLA)

> Sergio, 2026-07-20: separar el trabajo en muchas sesiones mezcla la información y se
> pierde el objetivo.

- **Un objetivo al inicio, escrito y explícito**, con su definición de "hecho". Todo lo
  que no sirva a ese objetivo se **anota como pendiente**, no se hace.
- **No se cierra la sesión hasta terminarlo.** Nada a medias, nada de saltar a otra cosa.
- **UNA sesión de control, muchos subagentes.** No abrir varias sesiones en paralelo: a
  Sergio se le cruza la información.
- Cada subagente: worktree con **ruta explícita**, `git branch --show-current` primero,
  y gates + commit en su propio árbol (nunca mezcla árboles). El orquestador mantiene el
  objetivo, el orden y el merge a `main`.
- Mismo carril (misma carpeta) → subagentes **secuenciales**. Carriles distintos →
  paralelo.

## Skills del proyecto (REGLA)

- Toda sesión arranca invocando **`onia-router`**, que enruta la tarea a su carril y
  nombra el stack de skills + subagente + docs fuente.
- Skills propias: `onia-router` · `onia-propuestas` · `onia-contabilidad-bolivia` ·
  `onia-core` · `onia-web-factory` · `ver-videos` · `editor-videos`. Envuelven
  conocimiento propio y apuntan a las fuentes de verdad — **al cambiar una regla, editar
  la fuente, no la skill**.
- Tres capas distintas: skills de Claude Code (`.claude/skills/`) · subagentes
  (`.claude/agents/`) · skills-doc que lee el bot del VPS (`hermes-content/skills/`).
- Si una tarea tiene skill pública instalada, usarla. No reinventar.

---

# 2. Las tres que más se rompen

## Una sola fuente de verdad por tema (REGLA)

> Nace del 2026-08-15: había **cuatro precios vivos del mismo chatbot** (1.500+550 en el
> código, 650+350 en un cotizador público, 1.900+150 en propuestas ya firmables,
> 900-1.200+450-600 en el one-pager de la vendedora) y 95 documentos hablando de precios.
> Con eso, cualquier sesión elige mal.

- **Precios: manda `onia-platform/lib/pricing.ts`.** Es el único archivo que cobra de
  verdad (lo valida el checkout). Ningún doc, propuesta, one-pager ni cotizador define
  precio: lo LEEN de ahí. Si un material dice otro número, está roto.
- **Qué se vende: manda `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`**, con el estado
  real (vivo / construido sin probar / futuro).
- **Un tema = un archivo sin fecha.** Si cambia, se EDITA ese archivo; no se crea uno
  nuevo con la fecha de hoy.
- **Fecha en el nombre = historia.** `hermes-content/docs/historial/` son fotos de un día
  y NO son fuente de verdad. Si un doc con fecha contradice a uno sin fecha, gana el que
  no tiene fecha.
- Antes de escribir una cifra o una capacidad en material de cliente, **buscar si ya
  existe en otro lado**. Si hay dos versiones, no elegir la más linda: preguntar.

## Verificar es MIRAR, no suponer (REGLA)

> Nace del mismo día: el login de producción mostraba los NOMBRES de los iconos como
> texto ("credit_card_off", "verified_user"). Yo lo había "verificado" varias veces con
> HTTP 200 y grep, sin abrirlo nunca. Lo encontró Sergio.

- **Toda pantalla que ve un cliente se abre y se MIRA renderizada** (Playwright +
  Chromium headless, y leer la captura). Un 200 y un grep no son verificación.
- **Verificar contra el sistema correcto.** Ese mismo día diagnostiqué la base contra un
  Supabase en la nube que ya no era producción, y declaré una página "no expuesta"
  probando el dominio equivocado — estaba viva en otro host.
- **Medir peso y tiempo real**, no solo que responda. Un 200 lento es un fallo con cara
  de éxito (la fuente de iconos pesaba 3,9 MB y tardaba 117 s).
- Un `grep` sirve para **descartar**, nunca para **confirmar** que algo se ve bien.
- **El login NO prueba la base**: entra por Supabase Auth vía HTTPS, no por Prisma.

## Nada a medias — cerrar antes de abrir (REGLA)

> Sergio 2026-08-01: *"no dejar nada vacío… nunca arrancar algo nuevo sin concluir lo
> anterior"*. Nace de encontrar la capa multi-rubro construida y **apagada**.

- **Construido ≠ terminado.** Algo está hecho cuando está **encendido en producción y
  verificado ahí**. Un flag apagado, una migración sin aplicar o un módulo que nadie
  llama son trabajo con valor **cero**.
- **Prohibido reportar como hecho lo que está detrás de un flag apagado.**
- **Antes de abrir un frente nuevo se cierra el anterior**, o se anota con su estado exacto.
- **Al cerrar la sesión, dejar el estado escrito:** qué quedó en producción, qué quedó a
  medias y dónde, y qué depende de Sergio.

---

# 3. Producto y marca

## Hay UN solo producto (REGLA)

- **Onia Platform** (repo `onia-platform`), que se vende con **packs por rubro**.
- `DentalGest`, `GestiOS`, `Ganadero OS` y `ProveeGest` **NO son productos ni marcas
  hermanas**: son nombres viejos de lo que hoy es un pack. Prohibido generar material,
  propuestas o UI que los presente como productos aparte. Al cliente se le nombra el
  rubro ("módulo dental"), nunca una marca propia.
- **No se le vende solo a clínicas.** Son siete rubros. Nada de "tus pacientes" ni "tu
  clínica" en material genérico: el producto ya tiene vocabulario por rubro
  (`lib/onboarding/vocabulario.ts`) — usarlo.
- ⚠️ `Gestios` y `Ganaderos-Os` existen como repos pero **no son productos**: son legado.
  No se les agrega nada sin decidir si se archivan o se absorben.

## ONIA Core (REGLA)

> Fuente de verdad: `onia-core/contract.json`. Docs canónicos en `onia-core/*.md`.

- El core es el núcleo operativo de la plataforma única. **21 capacidades** declaradas:
  un rubro es una combinación de esas, no código nuevo.
- **Un rubro nuevo se ENCIENDE desde el core, no se escribe de cero.** Orden: dental
  (vivo) → comercio → importadora → el resto.
- `policy.installInProductRepos = false`: no crear migraciones, rutas ni UI dependientes
  del core en repos producto sin plan de adopción aprobado.
- Todo cambio al contrato, schema o adapters pasa `npm run validate:onia-core` antes de
  commitear. Cada entidad nueva exige entrada en `contract.json`, tabla en
  `schema/base-schema.sql` y mapeo en los 3 adapters.
- Integraciones externas (WhatsApp, SIAT, TR4) siguen `external_gate`: entran como
  intake normalizado, no dentro del core.

## Base de producción (REGLA)

- Es **self-hosted en el VPS** (contenedor `supabase-db`, schema `dentalgest`), no la
  nube. Verificar contra el sistema correcto antes de diagnosticar.
- Las migraciones **no traen RLS**: si se reconstruye el schema, hay que volver a
  habilitarlo o se pierde el aislamiento por organización.
- Aplicar **quirúrgico**, nunca `prisma migrate deploy` a ciegas.

---

# 4. Cómo se trabaja

## Carriles (REGLA)

> El límite no es el plan de Claude: es el **choque** — mismos archivos, `main`, o infra
> única. Aislás eso y corrés todo lo demás en paralelo.

- Carril = 1 sesión = 1 worktree = 1 rama = 1 carpeta/repo.
- **Repos distintos** (`onia-platform`, Bolivian Electric) = paralelo libre.
- Dentro de `onia-hermes`: cada carril su carpeta. **AVISAR** antes de tocar los 4 raíz
  de web-factory (`next.config.ts`, `layout.tsx`, `globals.css`, `package.json`).
- **Infra (VPS, n8n, Supabase) = UN solo dueño a la vez**, serial.
- Terminar un carril: rama propia → `git rebase origin/main` → commits chicos por
  carpeta → gates (`tsc --noEmit`, tests, code-reviewer) → merge.
- Dueño de archivos por carril: `COORDINATION_MANIFEST.md`.

## `main` siempre compila (REGLA DURA)

- El auto-sync hace fast-forward de `main`: **nunca dejar que arrastre WIP parcial**. Si
  un archivo nuevo importa otro archivo nuevo, van los DOS o ninguno.
- `main` alimenta el deploy del VPS y el de Vercel: roto, rompe ambos.
- Ojo con el **casing de imports**: Linux distingue mayúsculas, Windows no.

## Git — auto-sync (REGLA)

- Commits conventional (`feat:`, `fix:`, `docs:`, `chore:`). El mensaje explica el **POR
  QUÉ**, no solo el qué.
- **Auto-sync activado**: al terminar, commitear y pushear sin que lo pidan (hook `Stop`
  → `node scripts/git-autosync.js`).
- Respeta `.gitignore`: nunca sube `.env`, claves ni `node_modules`. Assets y outputs sí.
- ⚠️ **Nunca buildear producción con un `.env.local` presente**: Next hornea los
  `NEXT_PUBLIC_*` en el bundle y publica `127.0.0.1`. Buildear en el VPS con `app.env`,
  y verificar el bundle antes del swap.

## Velocidad — no tardar en lo simple (REGLA)

- **Método correcto desde el PRIMER intento.** No shippear mediocre para iterar. UI:
  cargar `impeccable` + galería/tokens ANTES de codear.
- **Paralelizar agresivo.** Lo independiente va en subagentes concurrentes. Serializar
  solo lo que comparte archivos o estado.
- **Decidir y actuar.** Verificación fuerte solo para lo que toca producción, plata o
  `main`. Lo reversible y de bajo riesgo: hacerlo y seguir.
- **No re-hacer lo aprobado.** Diseño o plan ya aprobado se porta fiel, no se reabre.

## Dónde va cada cosa (REGLA)

Nada suelto en la raíz.

| Qué | Dónde |
|---|---|
| Doc de proceso o decisión | `hermes-content/docs/` (sin fecha si es fuente de verdad) |
| Foto de un día | `hermes-content/docs/historial/` |
| Investigación | `hermes-content/docs/research/` |
| Competencia guardada | `hermes-content/research/competencia/` |
| Componente de UI | `hermes-content/references/ui-patterns/<patrón>/` |
| Patrón de movimiento | `web-factory/docs/MOTION_PATTERN_BANK_2026.md` |
| Análisis de video | `hermes-content/references/video-intake/` |
| Código de herramienta | `scripts/` o `.claude/skills/<skill>/scripts/` |

Si no sabés dónde va, **preguntá** antes de inventar carpeta.

## Cuándo separar un repo (REGLA)

- **Junto en `onia-hermes`:** el cerebro (docs, skills, memoria, propuestas), el core y
  la orquestación. Se lee a sí mismo; fragmentarlo multiplica la sincronización manual.
- **Separado:** un producto SOLO si cumple las TRES — cliente real, deploy propio, y el
  cliente NO debe ver el cerebro. Correctos hoy: `onia-platform` y Bolivian Electric.
- **NO separar por sensación de desorden.** El cruce se arregla con disciplina de cierre.

---

# 5. Dominios

## Propuestas comerciales (REGLA)

> Fuente de verdad: `hermes-content/skills/propuestas-comerciales-onia.md`.

Toda propuesta se genera con `hermes-content/propuestas/generador/`
(`node generar-propuestas.js <slug> --pdf`). **Nunca escribir HTML de propuesta a mano.**

1. **Niveles por salto de valor**, no por "más páginas": estar online → convertir →
   automatizar.
2. **Resultado por paquete**, no solo qué incluye.
3. **Propuesta de valor** con el ROI real: automatización, más clientes, ahorro de tiempo.
4. **Dominio y hosting a cargo del cliente**, a su nombre. Nunca en nuestro precio.
5. **Terceros excluidos**: dominio, hosting, comisión de pasarela, créditos IA,
   mensajería paga, pauta.
6. **WhatsApp**: el botón click-to-chat va INCLUIDO. Lo que se cobra es el **chatbot con
   IA** — no confundirlos.
7. **Precios: leerlos de `pricing.ts`.** No improvisar ni descontar sin aprobación.
8. **Plantillas internas = confidencial.** Nunca decirle al cliente que usamos plantillas.
9. **No fabricar.** Si falta un dato del cliente, se pide o se marca. Cero clientes
   pagando: prohibido inventar testimonios, logos o cifras de resultados.

## Video — sin editores humanos (REGLA)

- **`ver-videos`** — para "ver" cualquier video: audio + fotogramas
  (`scripts/see-video.sh`) → transcripción con timestamps (`scripts/transcribe.sh`,
  Speaches en el VPS, gratis) → leer una MUESTRA de frames con visión.
  **Honestidad:** reportar cobertura real, no afirmar "vi el video" desde 2 cuadros.
  Forzar `Systran/faster-whisper-small` (el distil traduce el español).
- **`editor-videos`** — corta silencios y muletillas (`scripts/cut-plan.mjs` + ffmpeg),
  subtítulos karaoke, overlays, SFX. Orquesta, no reinventa el motor.
- **REGLA DE ORO:** la **tabla de cortes + preview 360p SIEMPRE se muestran a Sergio
  ANTES de aplicar el corte.** Nunca cortar a ciegas.
- **Gasto:** generación paga (Higgsfield, ElevenLabs) = permiso explícito caso por caso.
  Por defecto gratis (Speaches, HyperFrames).
- HyperFrames vive en `.agents/skills/`. Revisarlo ANTES de codear video.
