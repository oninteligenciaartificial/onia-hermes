# CLAUDE.md — ONIA Hermes

Instrucciones de proyecto para Claude. Override sobre defaults.

## Propuestas comerciales (REGLA)

> Fuente de verdad: `hermes-content/skills/propuestas-comerciales-onia.md`
> (skill que lee Hermes en el VPS). Lo de abajo es resumen — al cambiar reglas,
> editar la skill primero.

Toda propuesta a cliente se genera con el sistema en
`hermes-content/propuestas/generador/` (`node generar-propuestas.js <slug> --pdf`).
Nunca escribir HTML de propuesta a mano.

Cada propuesta DEBE cumplir:

1. **Niveles diferenciados con claridad.** Los 3 paquetes no se distinguen por
   "más páginas" sino por un salto de valor:
   - Nivel 1 = estar online (presencia).
   - Nivel 2 = convertir (captar clientes / briefs / leads).
   - Nivel 3 = automatizar (motor de captación + seguimiento, valor recurrente).
   En `notaPaquetes` explicar la diferencia en una línea.

2. **Resultado por paquete** (`resultado`): cada paquete lleva una frase de
   resultado concreto, no solo qué incluye. Ej: "Convertís tu audiencia en briefs".

3. **Propuesta de valor** (`valor[]`): sección "Por qué te conviene" con el ROI
   real — automatización, conseguir más clientes, ahorro de tiempo, autoridad
   para cerrar cuentas más grandes. No vender "una web", vender resultado.

4. **Dominio + hosting a cargo del cliente**, a su nombre. Nunca en nuestro precio.

5. **Costos de terceros excluidos**: dominio, hosting, comisión pasarela,
   créditos IA, mensajería WhatsApp pagada, pauta.

6. **Add-ons especificados**: conexión redes, videos IA, cuidado web,
   pasarela — cada uno con setup y mensual.
   - **WhatsApp**: el botón click-to-chat va INCLUIDO en la web (simple). Lo que
     se cobra como add-on es el **chatbot IA** (responde, califica, deriva solo) —
     no confundir el botón gratis con el chatbot pago.

7. **Pricing**: cobrar la automatización y el resultado, no los píxeles. El
   margen vive en lo recurrente (Cuidado Web / GestiOS / videos). La web única se
   precia para cerrar y abrir el mensual. **Precio de lanzamiento vigente (fase
   sin portafolio, desde 2026-07-03): Landing 790 / Web Pro 1.500.** La línea
   premium (Landing 2,000 / Web Pro 4,500) es el objetivo con 3-5 casos en
   portafolio. Fuente de verdad:
   `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` sección 0.

8. **Plantillas internas = confidencial.** Nunca decir al cliente que usamos
   plantillas. Objetivo: maximizar producción.

9. **No fabricar.** Si falta dato del cliente (brochure, sector), no inventar —
   pedirlo o marcarlo. Personalizar con datos reales (cartera, números, sector).

Docs internos de referencia: `PRICING_RATIONALE_INTERNO.md`,
`PLAYBOOK_CONSTRUCCION_INTERNO.md`, `ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`,
`BCP_PASARELA_CREDENCIALES_INTERNO.md`.

## ONIA Core (REGLA)

> Fuente de verdad: `onia-core/contract.json` (beta v0.5.0, congelado para
> adopcion; ver `onia-core/CHANGELOG.md`). Docs canonicos en `onia-core/*.md`.
> Receta de instalacion en productos: `onia-core/ONIA_CORE_INSTALL_GUIDE_2026.md`.
> DentalGest esta `installing` (9/9 entidades, wizard /setup, intake vivo).

- ONIA Core es el nucleo operativo comun de los SaaS ONIA (DentalGest, GestiOS,
  Ganadero OS, ProveeGest). Vive SOLO en este repo hasta aprobar adopcion.
- `policy.installInProductRepos = false`: NO crear migraciones, rutas ni UI
  dependientes del core en los repos producto sin plan de adopcion aprobado.
- Todo cambio al contrato, schema o adapters DEBE pasar
  `npm run validate:onia-core` antes de commitear.
- Cada entidad nueva del core exige: entrada en `contract.json`, tabla en
  `schema/base-schema.sql` y mapeo en los 3 adapters (el validador lo bloquea).
- Clientes nuevos se mapean a un track vertical, nunca a un fork del core.
  Ver `onia-core/ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`.
- Integraciones externas (WhatsApp, SIAT, TR4) siguen `external_gate`: fuera
  del core, entran solo como intake normalizado (work items).
- Orden de adopcion: DentalGest beta → Bolivian Electric/ProveeGest → GestiOS
  → Ganadero OS (offline).

## Git — Auto-sync multi-dispositivo (REGLA)

> Trabajamos desde varios dispositivos. Nada debe quedar como archivo local sin
> subir. Todo cambio se sincroniza solo a GitHub.

- Commits: conventional (`feat:`, `fix:`, `docs:`, `chore:`, etc.).
- **Auto-sync activado.** Al terminar cualquier trabajo, commitear y pushear los
  cambios a la rama actual sin que el usuario lo pida. Lo hace el hook `Stop`
  (`.claude/settings.json` → `node scripts/git-autosync.js`); también se puede
  correr a mano: `node scripts/git-autosync.js`.
- El autosync respeta `.gitignore`: nunca sube `.env`, claves, `*.pem`,
  `node_modules/` ni cachés. Si creás un archivo con secretos, asegurate de que
  esté ignorado antes de que el autosync corra.
- Assets, fotos, briefs y outputs SÍ se sincronizan (para tenerlos en todos los
  dispositivos).
- El autosync empuja la rama de trabajo y, además, hace **fast-forward de `main`**
  cuando es seguro (avance lineal). Así `main` queda al día solo y todos los
  dispositivos sincronizan con `git pull` en `main`. Si `main` divergió (no es
  FF), no fuerza nada: queda merge manual.
- **REGLA DURA — `main` SIEMPRE compila; nunca imports colgando en `main`.** Antes
  de hacer FF de `main`, si el avance toca `web-factory/apps/site/**`, el autosync
  corre `tsc --noEmit` en `apps/site`. Si no compila (ej. un árbol de rebuild a
  medio mergear que importa archivos que aún no llegaron), **NO avanza `main`**
  (la rama de trabajo igual se pushea; el WIP vive en su rama). Esto evita romper
  el deploy de Vercel y el auto-deploy del VPS que buildean `main`. Al terminar un
  carril de código, mergear a `main` como **un solo árbol coherente que compila**,
  nunca un subconjunto parcial. Los sync de docs/contenido no pagan tsc (sólo
  corre cuando el avance a main toca la app).

## Desarrollo en paralelo — carriles (REGLA)

> Trabajamos muchos frentes a la vez. El límite NO es el plan de Claude (Max) — el
> límite es el CHOQUE: mismos archivos, la rama `main`, o la infra única. Aislás
> eso y corrés TODOS los carriles no bloqueados en paralelo.

Fuentes (no duplicar; editar estas, no crear otras):
- **Arranque actual (foco + prompts, EMPEZAR AQUÍ): `hermes-content/docs/ONIA_PLAN_ARRANQUE_LIMPIO_20260718.md`.**
- Asignación + prompts copy-paste (histórico): `hermes-content/docs/ONIA_SESION_KICKOFFS_20260705.md`.
- Backlog e ítems (P/R/M/S): `hermes-content/docs/ONIA_PROXIMA_SESION_PLAN_20260705.md`.
- Dueño de archivos por carril: `COORDINATION_MANIFEST.md` (sección "Modelo de carriles").
- Stack de skills + reglas de subagentes: `hermes-content/docs/ONIA_SKILLS_STACK_Y_SUBAGENTES_20260705.md`.
  REGLA subagentes: uno por dominio de carril; nunca edita archivos de otro carril;
  research con fuentes citadas; mismos gates antes de mergear.

Carriles = 1 sesión = 1 worktree = 1 rama = 1 carpeta/repo:
- **A** `onia-center-saneamiento` → onia-hermes `src/app/onia-center/**` + `api/onia-center/**` (P2→P3)
- **B** `wf-landing-dentalgest` → onia-hermes landings `src/app`, `data/clients`, `templates`, `harvester` (P4, E*)
- **C** `propuestas-v2` → onia-hermes `hermes-content/propuestas` + docs/skills comercial (P1)
- **D** `dentagest-core-ui` → repo DentaGest (R2, R4)
- **E** `gestios-core` → repo Gestios (R1→R5)
- **F** `bolivian-electric-fase1` → repo Bolivian Electric (R3)
- **G** `infra-deploy-n8n` → n8n/VPS/Supabase, SERIAL, un solo dueño (M1→M6)
- **H** `contenido-higgsfield` → onia-hermes `hermes-content/references` + skills(video/IG) + scripts(video/ig) + `.hermes/video-lab` (producción continua)
- **I** `research-estrategia` → onia-hermes `hermes-content/docs/research/**` (analizar productos ganadores + validar ventures; NO codea, entrega decisión)
- **J** `video-remotion` → onia-hermes `scripts/remotion`|`apps/video` (video programático React; distinto de H generativo)
- **K** `yt-canal` → onia-hermes `hermes-content/channels/onia-automatiza/**` (canal YT faceless "ONIA Automatiza" ES; reusa content-engine/Higgsfield sin editarlos, upload→handoff a n8n; plan en `docs/research/ONIA_YT_CANAL_ONIA_AUTOMATIZA_20260706.md`)
- **onia-center-rebuild** (carril A, sesión fresca) → el panel es un MONOLITO (~14k líneas en 4 archivos: page.tsx/operating-workspace.tsx/operating-source.ts/onia-center.css). NO rediseñar en su lugar (ningún agente puede con 14k líneas → se pierde y rompe). Reconstruir en componentes chicos (`src/app/onia-center/components/**`, ~100-200 líneas c/u) reusando la data (lib/onia-center-store + api/onia-center), AL LADO de prod, y swap al final. Conservar agentes Vendedor/Día + cola de aprobación.
- **docs-hygiene diaria** (carril infra) → `scripts/docs-hygiene.mjs` + cron diario: auto-borra SOLO duplicados de raíz IDÉNTICOS a su copia en `hermes-content/docs/`, flaggea el resto (divergentes/superseded) a Sergio por Telegram. Mantiene el repo ordenado para que las sesiones no se pierdan con docs viejos/duplicados. Regla: `hermes-content/docs/` es la fuente, la raíz sin gemelos.
- **L** `yt-ciencia-cuerpo` → onia-hermes `hermes-content/channels/ciencia-cuerpo/**` (canal YT faceless "La Ciencia de tu Cuerpo" ES, educativo/salud, CPM alto; reusa content-engine/Higgsfield sin editarlos; SALUD=YMYL: cero consejo médico, todo con fuentes, el foso es el guion; plan en `docs/research/ONIA_YT_CANAL_CIENCIA_CUERPO_20260707.md`)
- **Core** `onia-core` → `onia-core/**` (CONGELADO; solo bajo adopción aprobada)

Reglas duras:
- Repos distintos (DentaGest, Gestios, Bolivian Electric) = paralelo libre.
- Dentro de onia-hermes: cada carril su carpeta; **AVISAR** antes de tocar los 4
  raíz de web-factory (`next.config.ts`, `layout.tsx`, `globals.css`, `package.json`).
- Infra (G) = UN solo dueño a la vez.
- **`main` siempre debe compilar.** El auto-sync hace FF de `main`: nunca dejar que
  arrastre WIP parcial (si un archivo nuevo importa otro archivo nuevo, van los DOS
  o ninguno). Rebuild entra a `main` solo como merge COMPLETO con `tsc --noEmit`
  verde en `web-factory/apps/site` (ojo casing de imports: Linux distingue). `main`
  alimenta el deploy real (VPS) Y el Vercel `onia-center`; roto, rompe ambos y
  spamea "Failed preview deployment". Detalle + incidente ref:
  `COORDINATION_MANIFEST.md` → "no filtrar WIP parcial a main".
- Correr todo en paralelo; lo único que se estagia son DEPENDENCIAS reales, no cupo:
  P3 tras P2 · R5 tras R1 · M1 deploya tras A/C en main · M2 no re-publica el n8n
  `ONIADailyBrief001` hasta M1 · H publica IG tras token (S6).
- Terminar un carril: rama propia → `git rebase origin/main` antes de mergear →
  commits chicos por carpeta → gates (`tsc --noEmit`, `pnpm e2e` donde aplique,
  code-reviewer) → merge a main. Un ítem cierra cuando su código está en main (y en
  prod para los M-*).

Bloqueos humanos de Sergio (hacer apenas se pueda; destraban lo comercial): S1
precios, S2 NIT SIAT, S3 secret intake n8n, S4 columnas TR4, S5 Meta, S6 token IG,
S7 keys Tavily/fal, S8 fiscal, S9 password. Detalle en el plan maestro §(b).

## Cuándo separar un repo (REGLA)

> El cerebro va junto; los productos con cliente van aparte. Separás por dueño +
> ciclo de vida + acceso, NUNCA por cantidad ni por "ordenar el desorden".

- **Junto en onia-hermes:** el cerebro (`hermes-content`: docs, skills, memoria,
  propuestas), el core y la orquestación. Se lee a sí mismo (Hermes, agentes,
  memoria); fragmentarlo multiplica la sincronización manual (lección `onia-core`,
  que hubo que mergear a mano para que DentaGest lo leyera).
- **Separado (repo propio):** un producto SOLO cuando cumple las TRES — (1) cliente
  real, (2) deploy y ciclo de release propio, (3) el cliente NO debe ver el cerebro.
  Correctos hoy: DentaGest, GestiOS, Bolivian Electric. Colaboradores = repo saneado
  `onia-hermes-collab` (separación por acceso).
- **NO separar por sensación de desorden.** El cruce se arregla con disciplina de
  cierre (mergear + cerrar sesión) y el tablero de carriles, no partiendo repos.
- **Candidato futuro (no ahora):** sacar `onia-center` de `web-factory` cuando pese
  demasiado y ya no comparta packages — con motivo medible, no preventivo.
