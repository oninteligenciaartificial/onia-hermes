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

- Toda sesión arranca invocando **`onia-router`**: él es el índice y rutea la tarea a su
  carril, su stack de skills, su subagente y sus docs fuente.
- **Al tocar el producto (`onia-platform`) son OBLIGATORIAS sus skills propias**
  (`onia-frontend/backend/db/seguridad/deploy/verificacion` en su `.claude/skills/`) —
  solo se autolistan en sesiones abiertas DENTRO de ese repo.
- Al aprender una trampa nueva: **editar la skill que corresponda**, no crear doc suelto.
  Skill pública instalada que sirva: usarla, no reinventar.

---

# 2. Las tres que más se rompen

## Una sola fuente de verdad por tema (REGLA)

> Nace del 2026-08-15: había **cuatro precios vivos del mismo chatbot** (1.500+550 en el
> código, 650+350 en un cotizador público, 1.900+150 en propuestas ya firmables,
> 900-1.200+450-600 en el one-pager de la vendedora) y 95 documentos hablando de precios.
> Con eso, cualquier sesión elige mal.

- **Precios: mandan DOS archivos, y cada uno sobre lo suyo.** Ningún doc, propuesta,
  one-pager ni cotizador define precio: lo LEEN de ahí. Si un material dice otro número,
  está roto.
  - **Planes de suscripción → `onia-platform/lib/subscription-plans.ts`**
    (`DEFAULT_PLAN_AMOUNTS`): es el que valida el pago y el que se pisa por env var.
  - **Add-ons, empezando por el chatbot → `onia-platform/lib/pricing.ts`**.

  ⚠️ **Corregido 2026-08-20.** Acá decía que mandaba `pricing.ts` a secas, y es falso para
  los planes: `pricing.ts` sólo tiene add-ons y `subscription-plans.ts` se declara a sí
  mismo "FUENTE ÚNICA de los montos". La regla escrita mal mandaba a cada sesión al archivo
  equivocado — justo el error que esta regla existe para evitar.
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
- **Un dato heredado no se ejecuta sin CONTARLO de nuevo.** El 2026-08-20 mi propio
  veredicto decía "de 136 workflows de n8n quedan 2" y "las 3 orgs son de QA": contados
  en vivo, 44 workflows estaban ACTIVOS (borrarlos apagaba producción) y una de las orgs
  tenía el único SUPERADMIN. Repetir una conclusión propia anterior también es repetir
  sin verificar.
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
  `DentalGest`, `GestiOS`, `Ganadero OS` y `ProveeGest` **NO son productos ni marcas**:
  son nombres viejos de packs. Al cliente se le nombra el rubro ("módulo dental").
- **No se le vende solo a clínicas**: son 7 rubros. Nada de "tus pacientes" en material
  genérico — el producto tiene vocabulario por rubro (`lib/onboarding/vocabulario.ts`,
  detalle en la skill `onia-frontend`).
- ⚠️ `Gestios` y `Ganaderos-Os` existen como repos pero son **legado**: no se les agrega
  nada sin decidir si se archivan o se absorben.

## La venta nunca exhibe obra (REGLA)

> Sergio, 2026-08-20: *"no entiendo por qué dices si es que estamos construyendo algo que
> aún no está listo… hace escapar a los clientes porque hacen creer que el sistema no
> funciona. Como regla nunca hagas eso."* La banda de Módulos de la landing tenía CINCO
> "muy pronto" en la pantalla de venta.

- En toda superficie que ve un cliente está PROHIBIDO comunicar estado de obra: "muy
  pronto", "en construcción", "beta", "próximamente", banners de borrador, listas de lo
  que falta. Un solo cartel contamina la percepción del producto entero.
- Lo que no está listo **no se nombra**. La demanda futura se captura sin admitir:
  "¿Otro rubro? Escribinos".
- Convive con "no fabricar": ni prometer lo inexistente NI exhibir lo incompleto — se
  habla solo de lo vivo. Docs internos y política de privacidad siguen siendo honestos
  sobre límites; la VENTA no.

## ONIA Core (REGLA)

- **Un rubro nuevo se ENCIENDE desde el core, no se escribe de cero.** Orden: dental
  (vivo) → comercio → importadora → el resto.
- Todo lo demás del core (21 capacidades, `contract.json`, los 3 adapters, el validador
  obligatorio antes de commitear, `external_gate`) → **skill `onia-core`**.

## Base de producción (REGLA)

- Es **self-hosted en el VPS** (contenedor `supabase-db`, schema `public`), no la nube.
  Verificar contra el sistema correcto antes de diagnosticar.
- Detalle de base y deploy (RLS que las migraciones NO traen, search_path traicionero,
  backup antes de tocar datos, runbook y gates del swap) → **skills `onia-db` y
  `onia-deploy` en `onia-platform/.claude/skills/`**.

---

# 4. Cómo se trabaja

## Carriles (REGLA)

> El límite no es el plan de Claude: es el **choque** — mismos archivos, `main`, o infra
> única. Aislás eso y corrés todo lo demás en paralelo.

- Carril = 1 sesión = 1 worktree = 1 rama = 1 carpeta/repo. Repos distintos = paralelo
  libre; dentro de `onia-hermes`, cada carril su carpeta (AVISAR antes de tocar los 4
  archivos raíz de web-factory). **Infra (VPS, n8n, Supabase) = UN dueño a la vez.**
- Cerrar un carril: rama propia → rebase → commits chicos → gates (`tsc --noEmit`, tests,
  code-reviewer) → merge. Dueño de archivos por carril: `COORDINATION_MANIFEST.md`.

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
- ⚠️ **Un merge con conflictos NUNCA se deja abierto al cerrar un turno.** El hook Stop
  corre el autosync, y `add -A` + commit convirtió 17 archivos CON marcadores `<<<<<<<`
  en un "resuelto" que hizo fast-forward a main (2026-08-20; el CI lo contuvo). El
  autosync ya tiene la guarda (se niega con MERGE_HEAD/paths unmerged), pero la regla es
  del que mergea: resolver ANTES de soltar el turno, y verificar cero marcadores con grep.
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
- **Una superficie viva no se reemplaza sin que Sergio VEA la pieza terminada.** El
  2026-08-20 interpreté "ya te di todo lo que quería" como OK para publicar la landing
  v2: la rechazó entera al verla ("Nada se te escapa no vende nada") y hubo que revertir
  en producción. Un rediseño se muestra renderizado y se espera el OK explícito sobre
  ESA pieza; construir y publicar son dos permisos distintos.

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

- **Junto en `onia-hermes`**: el cerebro (docs, skills, memoria, propuestas), el core y
  la orquestación — se lee a sí mismo; fragmentarlo multiplica sincronización manual.
- **Separado** solo si cumple las TRES: cliente real, deploy propio, y el cliente NO debe
  ver el cerebro. Correctos hoy: `onia-platform` y Bolivian Electric.
- **NO separar por sensación de desorden**: el cruce se arregla con disciplina de cierre.

---

# 5. Dominios

## Propuestas comerciales (REGLA)

- **Nunca escribir HTML de propuesta a mano**: se genera con
  `hermes-content/propuestas/generador/` (`node generar-propuestas.js <slug> --pdf`).
- **Precios: se LEEN de `pricing.ts`.** Sin descuentos ni improvisación.
- **No fabricar**: cero clientes pagando ⇒ prohibido inventar testimonios, logos o cifras.
- Las 9 reglas completas (niveles por salto de valor, ROI, dominio/hosting del cliente,
  terceros excluidos, WhatsApp incluido vs chatbot cobrado, confidencialidad de
  plantillas) → **skill `onia-propuestas`** + fuente
  `hermes-content/skills/propuestas-comerciales-onia.md`.

## Video — sin editores humanos (REGLA)

- **REGLA DE ORO: la tabla de cortes + preview 360p SIEMPRE se muestran a Sergio ANTES
  de aplicar el corte.** Nunca cortar a ciegas.
- **Gasto:** generación paga (Higgsfield, ElevenLabs) = permiso explícito caso por caso.
  Por defecto gratis (Speaches, HyperFrames).
- Cómo se ve un video, se transcribe, se corta, se subtitula y se rinde →
  **skills `ver-videos` y `editor-videos`** (HyperFrames vive en `.agents/skills/`:
  revisarlo ANTES de codear video).
