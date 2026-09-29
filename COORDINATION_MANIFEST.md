# Hermes Coordination Manifest

## 🧵 EL HILO — sesiones vivas y qué le pasa cada una a la otra (lo mantiene la sesión de control)

> Sergio Urcullo, 2026-09-29: *"habla entre sesiones para no perder el hilo"*. Las sesiones en
> la nube no se pueden mandar mensajes entre sí (corren en máquinas distintas: medido ese día,
> `ListAgents` no ve a ninguna). **El hilo es esta sección.** Toda sesión la lee al arrancar y
> la EDITA cuando cambia algo que otra sesión usa. Lo que no está acá, la otra sesión no lo sabe.

**Sesión de control — «Hermes y Sergio management system»** (rama `claude/hermes-jarvis`).
Dueña de Hermes y del cerebro: qué le llega a Sergio Urcullo por Telegram, el resumen de las
06:30, el cierre de las 22:00, su calendario, y el orden entre sesiones. Regla vigente:
`hermes-content/docs/ONIA_CEREBRO.md` §«La regla de entrega». Estado: `handoff/hermes-jarvis.md`.

| Sesión | Qué es suyo | Lo que la sesión de control LEE de ella (no cambiar sin avisar acá) |
|---|---|---|
| **Marca personal: comunidad y contenido** (`claude/marca-personal-contenido-ae658c`) | guiones, carruseles, comunidad, plan de 3 semanas | El resumen de las 06:30 lista «Para grabar hoy» leyendo `cola/plan-3-semanas/S*-GUIONES.md`. Acepta la fecha del `## ` en los dos formatos que ya conviven (`Mié 30-sep` / `Miércoles 14-oct` y `Miércoles 7 de octubre`) y cada pieza como `### DNN-X · Formato · Título`. Un tercer formato o un archivo nuevo = avisar acá (medido el 29-sep: con un solo formato, la semana 2 salía vacía sin error). **Los bloques de ONIA del calendario de Sergio Urcullo del 3 al 10-oct los llenó la sesión de control con estos títulos**: si cambia el plan de esos días, avisar acá para re-llenarlos. |
| **Onia platform development handoff** (`claude/onia-platform-handoff-56d586`) | onia-platform, SIAT, sales-kit, web pública | El resumen cuenta prospectos por la tarea `[leads-esperando]` del tablero (`scripts/vigia_sin_respuesta.mjs`). Si el aviso de solicitudes de acceso (`lib/aviso-acceso.ts`) cambia, avisar acá: tiene que pasar por la aduana. |
| **Infra (Codex)** — `handoff/infra-cerebro-loops.md` | VPS, n8n, loops, backups | ⚠️ Desde el 29-sep la **entrega a Sergio Urcullo** (Telegram, `onia-tg.sh`, resumen, cierre) es de la sesión de control. El resto del VPS sigue siendo de infra. |

**Mensajes pendientes entre sesiones** (se borran cuando la destinataria los confirma acá):
- **→ Marca personal (29-sep):** Hermes va a mostrarle a Sergio Urcullo los guiones del día cada
  mañana desde tu plan; no hace falta que generes otro listado para él. El job de Hermes
  `hermes-daily-content-video-plan` (guiones con `gpt-5-mini`) se pausa para no tener dos fuentes.
  Y: tu contexto estaba al **88 %** el 29-sep 20:03 UTC — escribí tu handoff antes de compactar.
- **→ Plataforma (29-sep):** nada que cambiar hoy. Si tu «plan de migración a la nube» mueve algo
  del VPS (Chatwoot, n8n, el tablero de Hermes), anotalo acá ANTES: el resumen y los avisos leen de ahí.
- **→ Todas:** para escribirle a Sergio Urcullo por Telegram, usá `onia-tg.sh` con
  `ONIA_AVISO=interrumpe | resumen | sistema`. Un `curl` directo a Telegram es un bug: se salta el
  silencio de 22:00 a 06:30 y el tope de repeticiones.

## Carril marca personal Sergio/ONIA — 2026-09-27

Rama `codex/marca-sergio-guiones-20260927`, worktree aislado
`C:/Users/PC/.codex/worktrees/marca-sergio-continuacion/onia-hermes`.
Alcance: `hermes-content/docs/{ONIA_MARCA_PERSONAL_MADRE,ONIA_MARCA_PERSONAL_BOVEDA,ONIA_PUBLICACION_MULTICANAL}.md`,
`hermes-content/docs/cola/{RODAJE-MARCA-PERSONAL-2026-09-27,LEARNINGS-APROBADOS-MARCA-PERSONAL,APROBACION-CARRUSELES-SERGIO-2026-09-27,EDICION-G06-OPUS-55-2026-09-27}.md`,
drop del 27-sep, handoff de este carril y tres carruseles v2 de Sergio (briefs y PNG).
Revisión del 28-sep: `hermes-content/docs/cola/AUDITORIA-GUIONES-COMUNIDAD-2026-09-28.md`.
Frentes de guiones, experiencia de miembros y carruseles trabajan sólo lectura;
la raíz integra los textos y el handoff. El 28-sep Sergio cerró la investigación
de navegador y pidió concentrarse en carruseles, comunidad y guiones que enseñen.
Se revisan G09/G11/G12 en el rodaje canónico, se prepara el primer ejercicio
comunitario y se actualiza el handoff con plan de producción. Ingeniero Binario
queda como referencia estructural, no como otra tarea de investigación.
Estado declarado por Sergio el 28-sep: todavía no se ha publicado este lote.
No toca servicios, OAuth, programación ni publicación. El checkout compartido conserva
el video candidato v3 y cambios de otros carriles; no stagear su árbol completo.
Handoff y plan vigente: `hermes-content/docs/handoff/marca-sergio-guiones-20260927.md`.
Primer ejercicio: `hermes-content/docs/cola/drops/2026-09-28-primer-ejercicio-preparado.md`.

## Purpose
This file prevents duplicate work while two Codex/Hermes sessions run at the same time.

Use this as the source of truth before creating new files, skills, docs, or scripts.


## Guiones y extracción de referentes — 2026-09-28

Tarea Codex `Revisa guiones de marca personal` (`01a0e9f1-1d82-7d51-9bb0-3594fcee69ce`).
Alcance: extracción de todas las referencias registradas del carril, revisión de
enseñanza real y corrección de `hermes-content/docs/cola/RODAJE-MARCA-PERSONAL-2026-09-27.md`.
Ampliación de Sergio: mapa de frentes ONIA/Platform/Sergio/enseñanza y circuito de
comunidad en `ONIA_MAPA_DE_TEMAS.md`; corrección de la regla pública «sin cómo»
en `ONIA_MARCA_PERSONAL_TRES_CARRILES.md`. Sólo propuesta documental, sin modificar
el catálogo, la oferta, las cuentas ni la comunidad real.
Tres subagentes leen lotes disjuntos de `references/video-intake/` y
`references/creator-video-references/`; el integrador consolida evidencia y guiones.
Artefactos temporales en `.hermes/referencia-guiones/`; extracción canónica junto a
las referencias y actualización del handoff existente. Sin edición de video,
publicación, cambios de web/comunidad, instalación, generación paga ni servicios.
Se preserva el resto del árbol compartido y no se incorporan cambios ajenos al commit.
Estado: extracción documental y 12 guiones corregidos, con tres subagentes y
revisión final incorporada. Mapa de 13 frentes, CTAs y contenidos comunitarios
guardado. Inventario: 131 fichas fechadas + 6 registros de junio, cero faltantes;
lectura guardada no equivale a reproducción actual completa. Fechas primarias
de Erik comprobadas; últimas publicaciones de todos los perfiles no certificadas.
Preservación aislada en `codex/guiones-referentes-20260928`; sin publicar,
grabar, editar masters, ejecutar demos ni cambiar la oferta.

## Guiones prácticos, reinicio editorial — 2026-09-28

Rama `codex/guiones-reinicio-20260928`, worktree
`C:/Users/PC/.codex/worktrees/6af1/onia-hermes`.
Alcance exclusivo: `hermes-content/docs/cola/GUIONES-REINICIO-2026-09-28.md`,
`hermes-content/docs/handoff/CONTINUAR-GUIONES-CLAUDE-2026-09-28.md`
y esta declaración. Dos frentes de lectura: referentes actuales de Erik;
referencias guardadas de Ian, Tiago y Carlos. Integración editorial por el agente
principal. No modifica la tanda rechazada ni masters. Sin publicación,
instalación, servicios ni generaciones pagadas. Fuentes y límites de observación
quedan al pie de los guiones, sin informe adicional.
Handoff solicitado por Sergio para pasar a Claude: dirección editorial,
referentes actuales, fuentes primarias y prueba de Opus 5.5 pendiente por
autenticación. Sergio recibe solo narración y enseñanza personal al final.
Ampliación autorizada: sesión diaria de una hora, guion horizontal y tres
verticales, revisión editorial y material didáctico del ejercicio. Este carril
también posee `hermes-content/docs/cola/opus55-ejercicio-editor.html`.
La pantalla es una ilustración del caso ficticio; no simula una salida de Claude.
Revisión visual completada: cinco escenas en ambos formatos, sin desbordamiento
geométrico; tres composiciones vistas en captura. Servidor local 127.0.0.1:8766
cerrado al terminar y pestaña temporal cerrada. Cuatro narraciones revisadas.
Corrección posterior de Sergio: estudiar enseñanza, edición, mezcla de formatos
y recorrido a comunidad; mínimo diez videos diarios y archivo solo hablado.
Este carril posee además `hermes-content/docs/cola/GUIONES-PARA-GRABAR-2026-09-28.md`
(fuente canónica de narraciones actuales) y `hermes-content/docs/cola/cotizador-tarjetas-demo.html`.
El documento GUIONES-REINICIO conserva investigación, producción e historial;
sus versiones anteriores ya no son el paquete recomendado. Erik prepara el
cotizador; referencias_guardadas revisa identidad/recorrido de Tiago y Carlos.

## Infra retomada en Codex — 2026-09-21

Sergio Urcullo trasladó el carril de Claude a la tarea Codex de ONIA Platform.
Integración aislada: rama `codex/infra-producto-integracion-20260921`, worktree
`C:/dev/proyectos/onia-hermes-infra-integracion`, sobre `origin/main` (`90769552`).
Alcance: `scripts/loops/{consolidar-memoria,parte-diario,vigia-loops-remotos}.sh`,
sus pruebas, README y handoff `infra-cerebro-loops.md`. Un subagente revisó sin editar.
Sergio aprobó integrar/pushear y aplicar SOLO esos tres scripts al VPS con respaldo
y rollback; NO reinicios, cambios de cron, migraciones, mensajes de prueba ni loops.
El worktree original y sus temporales se preservan. No se integran los otros commits
de Claude por arrastre. El handoff registra el resultado final del despliegue.
Aplicación completada 21-sep 20:40 UTC desde `063e5e54`: hashes verificados,
respaldo privado y cron/contenedores/gateway sin cambios. Loops no reactivados.
La tabla de agosto de abajo es historial, no evidencia de escritores activos hoy.

## ⚠️ Carriles VIVOS (2026-08-23) — AUTORIDAD ACTUAL

**Esto reemplaza al modelo de 2026-07-05 de más abajo**, que se conserva por referencia. Ese
modelo era del **30-jul**, nombraba carriles A-H con nombres de sesiones que ya no existen, y
**no nombraba ninguna de las 8 ramas realmente vivas**. Un manifiesto que no nombra los
carriles vivos no previene nada — de hecho hoy no previno nada (ver los tres choques abajo).

### Las 8 ramas con worktree abierto

| Rama | Worktree | Dueño de archivos | Puerto |
|---|---|---|---|
| `claude/ads-creatividades-publicos` | `onia-hermes/` (checkout principal) | contenido/ads. **Entró a Chatwoot** y paró — ver `docs/handoff/chatbot.md` | — |
| *(subagente)* **chatbot / infra** | worktree temporal | VPS + Chatwoot. **Tiene el turno de infra** | — |
| *(subagente)* **producto → marca** | worktree temporal de `onia-platform` | repo `onia-platform`: capa de tokens, logotipo, íconos, formateador de moneda | 3340 |
| *(subagente)* **add-ons** | `.claude/worktrees/skills-setup-config-8d4674` | `(sitio)/page.tsx` · `(sitio)/precios/page.tsx` · `sitio.module.css` | 3330 |
| `claude/git-status-935f47` | `.claude/worktrees/skills-setup-config-8d4674` | `web-factory/apps/onia-platform/**` + `hermes-content/docs/**` | **3320** |
| `claude/pending-tasks-review-fb0694` | `.claude/worktrees/amazing-bassi-44c97d` | 🔴 **SIN DECLARAR** | — |
| `claude/onia-payment-structure-aecab8` | `.claude/worktrees/bolivia-product-import-6ae97c` | 🔴 **SIN DECLARAR** | — |
| `claude/quizzical-leavitt-0c8543` | `.claude/worktrees/confident-dirac-a1b422` | 🔴 **SIN DECLARAR** | — |
| `claude/onia-web-architecture-b37eca` | `.claude/worktrees/hyperframes-onia-export-formats-053cf9` | **web de cliente de prueba** — `web-factory/data/**` · `web-factory/packages/{blocks,templates,tokens}/**` · `web-factory/generate/**` · `web-factory/out/dental-amanecer/**` · `web-factory/tests/**` · `web-factory/FACTORY.md` · `web-factory/docs/CONEXION_WEB_SISTEMA_API.md` · `.claude/skills/onia-web-factory/**`. NO toca `web-factory/apps/**` ni `hermes-content/docs/**` | 4319 |
| `claude/web-creator-personal-site-eed2f3` | `.claude/worktrees/web-creator-personal-site-eed2f3` | **configurador de webs + web personal** — `web-factory/apps/onia-platform/src/app/(sitio)/servicios/webs/**` · `src/components/web-configurator/**` · `src/components/requisitos-gate.tsx` · `src/content/{webs,web-configurator,web-intake}.ts` · `hermes-content/sitio-sergiourcullo/**`. Handoff: `hermes-content/docs/handoff/web-creator.md` | 3011 · 8099 |
| ⚰️ `claude/onia-web-architecture-b37eca` | `hyperframes-onia-export-formats-053cf9` (ese worktree hoy tiene OTRA rama) | **MUERTO — último commit 2026-09-02.** Era dueño de `web-factory/{generate,packages,data}/**`. Se libera: desde el 17-sep los únicos commits ahí son de `web-creator`, que lo toma | — |
| `claude/analizar-reels-videos-67f762` | `.claude/worktrees/laughing-heyrovsky-0b48a0` | 🔴 **SIN DECLARAR** | — |
| `claude/bolivia-product-import-6ae97c` | `.claude/worktrees/video-editor-improvements-428ade` | 🔴 **SIN DECLARAR** | — |

⚠️ **Seis de ocho no declaran qué archivos poseen.** No se rellenó a ojo: un dueño inventado en
un manifiesto de coordinación es peor que un hueco, porque se le cree. **Cada carril declara lo
suyo al abrirse**, y su nombre de worktree debería coincidir con su rama (hoy tres no coinciden:
`bolivia-product-import-6ae97c` aloja a `onia-payment-structure`, y `video-editor-improvements`
aloja a `bolivia-product-import`).

⚠️ **8 worktrees abiertos a la vez es la regla de "nada a medias" rota a nivel flota**
(`CLAUDE.md` §2). Cerrar antes de abrir.

### Las 3 reglas nuevas — salen de los 3 choques del 2026-08-23

Ese día, cuatro subagentes trabajaron sobre **un mismo worktree**. Ninguno de los tres choques
fue de git ni de propiedad de archivos: **el reparto de archivos funcionó y aun así se
rompieron entre ellos.**

1. **Un carril = un puerto = un `.next`.**
   Había **seis** `next dev` vivos, cinco del mismo worktree (3287, 3288, 3289, 3301, 3311),
   pisándose los manifests de `.next` → 404 y 500 intermitentes y
   `__webpack_modules__[moduleId] is not a function`, que **parecen bugs del cambio y no lo
   son**. Un agente borró `.next/` a mitad de la verificación de otro y le tiró el server.
   El puerto se asigna al abrir el carril, va en la tabla de arriba y en
   `.claude/launch.json`, y **se apaga el server al cerrar**.

2. **Prohibido `git add -A` en un worktree compartido.**
   Un agente lo corrió y stageó **12 archivos que no había tocado**, justo los prohibidos de su
   carril. Los deshizo a tiempo. Si commitea, se lleva puesto trabajo ajeno — y el hook de
   auto-sync commitea al cerrar. **Rutas explícitas, siempre.**

3. **Infra tiene TURNO, no dueño permanente.**
   VPS, Chatwoot, n8n y la base: **uno por vez**, y quien entra lo dice acá. El deploy de la
   landing, el del producto y el carril del chatbot pelean el mismo turno.

**La lección de fondo: un worktree aísla ARCHIVOS. No aísla `.next`, ni puertos, ni
`node_modules`, ni la base, ni el VPS, ni Chatwoot, ni n8n.** Este manifiesto repartía archivos
— y los archivos no eran el problema.

### Dónde vive el contexto entre carriles

| Artefacto | Qué guarda |
|---|---|
| `hermes-content/docs/handoff/<carril>.md` | los 7 campos al cerrar, incluidos **intentos fallidos** |
| `hermes-content/docs/<TEMA>.md` **sin fecha** | fuente de verdad por tema |
| `CLAUDE.md` + skills + memoria | las reglas, cada una con la historia que la originó |

Circuito: se cierra escribiendo el handoff → la sesión siguiente **lo lee antes de tocar nada**
→ no re-descubre. Funcionó el 2026-08-23: un parte pedía investigar una "regresión" del bot y
la memoria ya decía que no lo era. Esa lectura ahorró una investigación entera.

---

## Modelo de carriles (2026-07-05) — HISTÓRICO, superado por la sección de arriba

Reemplazó al split Session A / Session B de abajo (histórico, se conserva por
referencia). Fuente única de asignación de trabajo y prompts de arranque:
`hermes-content/docs/ONIA_PROXIMA_SESION_PLAN_20260705.md`, sección
"Ejecución en paralelo — sesiones y carriles".

7 carriles, dueño por carpeta/repo; una sesión por carril, no chocar:

| Carril | Sesión | Dueño de archivos | Ítems |
|--------|--------|-------------------|-------|
| A | `onia-center-saneamiento` | onia-hermes `web-factory/apps/site/src/app/onia-center/**` + `api/onia-center/**` | P2→P3 |
| B | `wf-landing-dentalgest` | onia-hermes landings `src/app`, `data/clients`, `templates`, `harvester` | P4, E* |
| C | `propuestas-v2` | onia-hermes `hermes-content/propuestas` + `docs` + `skills` | P1 |
| D | `dentagest-core-ui` | repo DentaGest (todo) | R2, R4 |
| E | `gestios-core` | repo Gestios (todo) | R1→R5 |
| F | `bolivian-electric-fase1` | repo Bolivian Electric (todo) | R3 |
| G | `infra-deploy-n8n` | n8n / VPS / Supabase — SERIAL, un solo dueño | M1→M6 |
| H | `contenido-higgsfield` | onia-hermes `hermes-content/references`+`skills`(video/IG)+`scripts`(video/ig)+`.hermes/video-lab`+assets | producción continua (video, carruseles, IG) |
| Core | `onia-core` | onia-hermes `onia-core/**` | contrato/schema/adapters — CONGELADO, solo bajo adopción aprobada |

Regla dura: 1 carril = 1 worktree = 1 rama = 1 carpeta. A/B/C avisan antes de
tocar los 4 archivos raíz de web-factory (`next.config.ts`, `layout.tsx`,
`globals.css`, `package.json`). Infra (G) = un solo dueño a la vez; nadie más
toca n8n/VPS/DB mientras G trabaja.

> **Carril L (canal YT) = rama propia `yt-maquina-humana`** (2026-07-10). Canal
> "Máquina Humana" (marca pública; ex "La Ciencia de tu Cuerpo"), dueño de
> `hermes-content/channels/ciencia-cuerpo/**` (slug interno se mantiene — renombrarlo
> solo rompe referencias). **NO confundir con el panel (carril A, rama
> `claude/vibrant-ritchie-9304f8`): son carpetas Y ramas distintas — el canal nunca
> comparte rama con el panel.** Incidente 2026-07-10: el build del canal se estaba
> commiteando en la rama del panel; se separó a rama propia (archivos disjuntos, sin
> conflicto). El loop autónomo semanal del canal se hand-off a n8n/infra, no queda local.

### Regla dura — no filtrar WIP parcial a `main` (build coherente)

`main` alimenta DOS deploys: el auto-deploy real al VPS (`center.onia.com.bo`,
GitHub Action que buildea `main`) y el proyecto Vercel `onia-center` (vestigial,
`live:false`, buildea cada push de cada rama). Un `main` que no compila rompe el
deploy real Y spamea emails "Failed preview deployment" de Vercel.

- El auto-sync hace fast-forward de `main`. NUNCA dejes que arrastre un
  subconjunto incoherente: si un archivo nuevo importa otro archivo nuevo, van
  los DOS a `main` (o ninguno), jamás uno solo.
- Sesiones de rebuild (árboles de componentes nuevos, ej. carril A
  `onia-center-rebuild`): el rebuild entra a `main` SOLO como un merge COMPLETO y
  COHERENTE que pasa `tsc --noEmit` en `web-factory/apps/site`. Nada de commits
  sueltos del rebuild colándose a `main` por auto-sync.
- Antes de cualquier merge/swap a `main`: `tsc --noEmit` verde en tu rama. Ojo
  con el casing de imports (Linux distingue mayúsculas; Windows no → compila
  local pero rompe en el build).
- Incidente de referencia (2026-07-09/10): 3 archivos del rebuild
  (`onia-center/components/views/hoy/AgentRosterTile.tsx`, `components/shell/TopNav.tsx`,
  `styles/tokens.css`) llegaron a `main` sin `components/ui/*` que importan → tsc
  rojo → ambos deploys rotos + lluvia de emails. Arreglado en `a771e5b0`.

## Ownership split

### Session A: Instagram, assets, dashboard, publishing
This session owns:
- Instagram Graph API publishing.
- Public asset hosting on the VPS.
- Uploading assets to `http://187.77.16.63:8099`.
- Dashboard operations documentation.
- Security docs for tokens and VPS secrets.
- Core publishing scripts under `scripts/`.
- Video Lab operational scripts and docs for video publishing approvals.
- Telegram Command Center routing for Hermes/ONIA operations.
- Daily Hermes cron documentation for publishing/content operations.
- Weekly operating system documentation and cadence.
- Onia Panel de Vendedores as the sales operating layer for leads, web diagnostics, notes, ideas, income and commissions.

Canonical files:
- `AGENTS.md`
- `PRODUCT.md`
- `.agents/skills/impeccable/`
- `docs/ORCHESTRATOR.md`
- `README.md`
- `HERMES_OPERATIONS.md`
- `HERMES_CONTENT_WORKFLOW.md`
- `ONIA_INSTAGRAM_PUBLISHING.md`
- `STYLE_REFERENCE_SYSTEM.md`
- `REFERENCES_INBOX.md`
- `scripts/ig_publisher.py`
- `scripts/carousel_generator.py`
- `scripts/vps_install_instagram.js`
- `scripts/vps_install_hermes_content.js`
- `scripts/vps_install_control_tower.js`
- `scripts/vps_setup_assets.js`
- `scripts/vps_upload_asset.js`
- `scripts/video_lab.py`
- `scripts/hermes_command_center.py`
- `scripts/mara_motion_control_pipeline.ps1`
- `scripts/process_sergio_media.ps1`
- `scripts/process_sergio_talking_reference.ps1`
- `scripts/social_publisher.py`
- `scripts/hermes_week_status.py`
- `scripts/hermes_week_plan.py`
- `scripts/vps_audit_selfhosted.js`
- `scripts/vps_install_selfhosted_stack.js`
- `scripts/procesa-audio-cliente.js`
- `scripts/onia_center_auth_admin.js`
- `HERMES_VIDEO_LAB.md`
- `HERMES_TELEGRAM_COMMAND_CENTER.md`
- `HERMES_EXECUTION_PROTOCOL.md`
- `hermes-content/docs/HERMES_CLOSED_EXECUTION_AND_CONTINUOUS_WORK_2026.md`
- `HERMES_DAILY_CRONS.md`
- `HERMES_WEEKLY_OPERATING_SYSTEM.md`
- `.github/workflows/onia-hygiene-daily.yml`
- `HIGGSFIELD_VIDEO_SYSTEM.md`
- `HIGGSFIELD_FULL_CAPABILITIES_MAP.md`
- `ELEVENLABS_AUDIO_SYSTEM.md`
- `JUNE_2026_VIDEO_PRODUCTION_PLAN.md`
- `DUAL_ACCOUNT_DAILY_VIDEO_CRON.md`
- `CLIENT_CONTENT_PRODUCTION_SYSTEM.md`
- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`
- `HIGGSFIELD_CONTENT_USE_CASES.md`
- `CROSS_PLATFORM_PUBLISHING.md`
- `ONIA_PRICING_2026.md`
- `ONIA_VENDOR_MANUAL_2026.md`
- `output/pdf/ONIA_VENDOR_MANUAL_2026.pdf`
- `ONIA_VENDOR_SALES_PLAYBOOK_2026.md`
- `hermes-content/docs/ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md`
- `hermes-content/propuestas/acuerdo-colaborador-onia-nuvia.html`
- `hermes-content/propuestas/acuerdo-colaborador-onia-nuvia.pdf`
- `ONIA_LEADS_PRIORITY_2026.md`
- `ONIA_BEST_MARKET_OPPORTUNITY_2026.md`
- `ONIA_PROJECTS_VENDOR_DECK_2026.html`
- `NOTION_VENDOR_CRM_SCHEMA_2026.md`
- `PROJECT_PRICE_UPDATE_PROMPTS_2026.md`
- `SALES_VENDOR_PRICING_DECK_2026.html`
- `PROJECTS_ORCHESTRATION.md`
- `ONIA_SALES_SPRINT.md`
- `FINANCE_LOG_2026.md`
- `ONIA_CONTEXT_INTAKE.md`
- `hermes-content/docs/ONIA.md`
- `hermes-content/docs/ORCHESTRATOR.md`
- `hermes-content/docs/DASHBOARD.md`
- `hermes-content/docs/OPERATIONS.md`
- `hermes-content/docs/CONTENT_WORKFLOW.md`
- `hermes-content/docs/SECURITY.md`
- `hermes-content/docs/VIDEO_LAB.md`
- `hermes-content/docs/TELEGRAM_COMMAND_CENTER.md`
- `hermes-content/docs/PERSONAL_BRAND_SERGIO.md`
- `hermes-content/docs/STORY_REFERENCES.md`
- `hermes-content/docs/STYLE_REFERENCES.md`
- `hermes-content/docs/EXECUTION_PROTOCOL.md`
- `hermes-content/docs/HERMES_CLOSED_EXECUTION_AND_CONTINUOUS_WORK_2026.md`
- `hermes-content/docs/DAILY_CRONS.md`
- `hermes-content/docs/WEEKLY_OPERATING_SYSTEM.md`
- `hermes-content/docs/N8N_CANONICAL.md`
- `hermes-content/docs/PROJECTS_ORCHESTRATION.md`
- `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `hermes-content/docs/HIGGSFIELD_CONTENT_USE_CASES.md`
- `hermes-content/docs/CROSS_PLATFORM_PUBLISHING.md`
- `hermes-content/docs/ONIA_PRICING_2026.md`
- `hermes-content/docs/ONIA_VENDOR_MANUAL_2026.md`
- `hermes-content/docs/ONIA_VENDOR_MANUAL_2026.pdf`
- `hermes-content/docs/ONIA_VENDOR_SALES_PLAYBOOK_2026.md`
- `hermes-content/docs/ONIA_LEADS_PRIORITY_2026.md`
- `hermes-content/docs/ONIA_PROJECTS_VENDOR_DECK_2026.html`
- `hermes-content/docs/NOTION_VENDOR_CRM_SCHEMA_2026.md`
- `hermes-content/docs/PROJECT_PRICE_UPDATE_PROMPTS_2026.md`
- `hermes-content/docs/SALES_VENDOR_PRICING_DECK_2026.html`
- `hermes-content/docs/ELEVENLABS_AUDIO_SYSTEM.md`
- `hermes-content/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `hermes-content/docs/UGC_CLIENT_VIDEO_PLAYBOOK.md`
- `hermes-content/docs/CREATIVE_RADAR.md`
- `hermes-content/docs/ONIA_CREATOR_VIDEO_STRATEGY_2026.md`
- `hermes-content/docs/ONIA_ANIMATED_VIDEO_WORKFLOW.md`
- `hermes-content/docs/ONIA_CONSULTING_SERVICES_2026.md`
- `hermes-content/docs/ONIA_SYSTEM_PORTFOLIO_ARCHITECTURE_2026.md`
- `hermes-content/docs/ONIA_VERTICAL_SERVICE_MATRIX_2026.md`
- `hermes-content/docs/ONIA_VERTICAL_SERVICE_AUDIT_2026.md`
- `hermes-content/docs/ONIA_INITIAL_CORE_BLUEPRINT_2026.md`
- `hermes-content/docs/ONIA_SERGIO_BOLIVIAN_LONG_TERM_INCOME_STRATEGY_2026.md`
- `hermes-content/docs/ONIA_HERMES_COLLABORATOR_ACCESS_MODEL_2026.md`
- `hermes-content/docs/ONIA_HERMES_COLLABORATOR_SETUP_RUNBOOK_2026.md`
- `hermes-content/docs/BOLIVIAN_ELECTRIC_AI_TRANSFORMATION_PLAN_2026.md`
- `hermes-content/docs/BOLIVIAN_ELECTRIC_TUESDAY_AUDIT_QUESTIONS_2026.md`
- `hermes-content/docs/BOLIVIAN_ELECTRIC_FIRST_BIG_PROJECT_INVESTMENT_PLAN_2026.md`
- `hermes-content/docs/BOLIVIAN_ELECTRIC_PHASE1_LOW_TICKET_AI_OPERATIONS_OFFER_2026.md`
- `hermes-content/docs/BOLIVIAN_ELECTRIC_PRIORITY_PROPOSAL_EXECUTIVE_TEAM_2026.md`
- `hermes-content/docs/BOLIVIAN_ELECTRIC_OWNER_STRATEGIC_PROPOSAL_2026.md`
- `hermes-content/docs/ONIA_GIT_CHANGE_GROUPING_20260623.md`
- `hermes-content/docs/ONIA_CIERRE_DIA_20260623.md`
- `hermes-content/docs/ONIA_CENTER_INTEGRATION_READINESS_20260623.md`
- `hermes-content/docs/ONIA_CENTER_MONTHLY_AGENTS_CALENDAR_20260623.md`
- `hermes-content/docs/ONIA_CENTER_AUTH_RLS_ACTIVATION_20260623.md`
- `hermes-content/docs/ONIA_VENDOR_ACCESS_AND_CALENDAR_RUNBOOK_2026.md`
- `hermes-content/propuestas/bolivian-electric-transformacion-ia-2026.html`
- `hermes-content/propuestas/assets/design-tokens.css`
- `hermes-content/docs/ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md`
- `hermes-content/docs/assets/meta-whatsapp-access/`
- `hermes-content/docs/SERGIO_FACE_VOICE_ASSET_GUIDE.md`
- `hermes-content/docs/SERGIO_ONIA_CONTENT_PRODUCTION_KIT_2026.md`
- `hermes-content/docs/AI_ECOMMERCE_MODEL_SYSTEM_2026.md`
- `hermes-content/docs/ONIA_OPEN_SOURCE_AI_VIDEO_LAB_2026.md`
- `hermes-content/docs/ONIA_SELF_HOSTED_AI_TOOLS_2026.md`
- `hermes-content/docs/ONIA_SELF_HOSTED_STACK_RUNBOOK_2026.md`
- `hermes-content/docs/ONIA_CENTER_DIFY_ASSISTANT_RUNBOOK_2026.md`
- `hermes-content/docs/ONIA_CENTER_CODEX_INTEGRATION_RUNBOOK_2026.md`
- `hermes-content/docs/ONIA_CENTER_AI_MODEL_ROUTING_2026.md`
- `hermes-content/docs/ONIA_CENTER_DAILY_N8N_BRIEFING_RUNBOOK_2026.md`
- `hermes-content/docs/ONIA_PROJECT_HYGIENE_AUTOMATION_2026.md`
- `hermes-content/docs/ONIA_N8N_TELEGRAM_CLEANUP_20260630.md`
- `hermes-content/docs/ONIA_MEETING_INTELLIGENCE_SYSTEM_2026.md`
- `hermes-content/docs/ONIA_7000_BOB_PRODUCTION_INFRA_INVESTMENT_PLAN_2026.md`
- `hermes-content/docs/ONIA_INTERNAL_CAPITAL_ALLOCATION_2026.md`
- `hermes-content/docs/ONIA_PROPUESTA_USO_CAPITAL_FAMILIAR_15000_2026.md`
- `hermes-content/docs/ONIA_PROPUESTA_GASTOS_LOCAL_FIRST_15000_2026.md`
- `hermes-content/docs/ONIA_PROPUESTA_GASTOS_LOCAL_FIRST_15000_2026.pdf`
- `hermes-content/docs/SERGIO_STRICT_CALENDAR_AND_ALFREDHQ_2026.md`
- `hermes-content/docs/ONIA_NUVIA_ACCOUNTING_MODEL_2026.md`
- `hermes-content/docs/ONIA_CAPITAL_RECOVERY_AND_ARTHUR_INVESTMENT_POLICY_2026.md`
- `hermes-content/docs/BOLIVIAN_TR4_LOCAL_STATIC_AUDIT_20260624.md`
- `hermes-content/docs/ONIA_SUSTAINABILITY_DASHBOARD_SPEC_2026.md`
- `hermes-content/docs/ONIA_COMPANY_OPERATING_MODEL_2026.md`
- `hermes-content/docs/ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md`
- `hermes-content/docs/HERMES_OS_CONTROL_CENTER_2026.md`
- `hermes-content/docs/ONIA_PANEL_VENDEDORES_2026.md`
- `hermes-content/deploy/selfhosted/`
- `hermes-content/deploy/n8n/workflows/onia-center-daily-briefing.json`
- `hermes-content/references/video-brief-template.json`
- `hermes-content/references/telegram-command-center.json`
- `hermes-content/references/sergio-strict-calendar-20260623.json`
- `hermes-content/references/sergio-onia-content-kit-20260602.json`
- `hermes-content/references/sergio-ai-influencer-identity-system-20260606.json`
- `hermes-content/references/onia-projects-registry.json`
- `hermes-content/references/onia-project-hygiene-config.json`
- `hermes-content/references/onia-vendor-pipeline-template.csv`
- `hermes-content/references/onia-commercial-campaigns.json`
- `hermes-content/references/onia-best-opportunity-matrix-20260605.json`
- `hermes-content/references/onia-selfhosted-stack-20260619.json`
- `hermes-content/references/hermes-os-control-plane-20260620.json`
- `hermes-content/references/onia-vendor-panel-20260620.json`
- `hermes-content/references/bolivian-electric-ui-reference-pack-20260623.json`
- `supabase/migrations/20260620_onia_vendor_sales_panel.sql`
- `supabase/migrations/20260623_onia_center_sergio_calendar.sql`
- `supabase/migrations/20260623_onia_center_sergio_calendar_seed.sql`
- `supabase/migrations/20260623_onia_center_integration_readiness.sql`
- `supabase/migrations/20260623_onia_center_integration_readiness_seed.sql`
- `supabase/migrations/20260623_onia_center_operating_agents.sql`
- `supabase/migrations/20260623_onia_center_operating_agents_seed.sql`
- `supabase/migrations/20260623_onia_center_auth_rls.sql`
- `web-factory/apps/site/src/app/vendedores/page.tsx`
- `web-factory/apps/site/src/app/onia-center/`
- `web-factory/apps/site/src/app/api/onia-center/`
- `web-factory/apps/site/src/lib/onia-center-auth.ts`
- `web-factory/apps/site/src/lib/onia-center-store.ts`
- `web-factory/apps/site/src/middleware.ts`
- `hermes-content/references/ai-ecommerce-model/README.md`
- `hermes-content/references/ai-ecommerce-model/20260605-mara-vale-round-01.md`
- `hermes-content/references/ai-ecommerce-model/20260605-mara-vale-contact-sheet-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-freckles-round-02.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-freckles-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-wavy-pale-curvy-round-03.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-wavy-pale-curvy-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-balanced-round-04.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-balanced-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-performance-round-05.md`
- `hermes-content/references/ai-ecommerce-model/20260605-redhead-performance-ugc-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-redhead-performance-round-06.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-redhead-performance-v1.jpeg`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-product-hero-round-07.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-redhead-product-hero-4k-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-sunscreen-resort-round-08.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-sunscreen-resort-4k-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-sunscreen-resort-4k-v1-reference.jpg`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-round-09.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-contact-sheet-4k-v1.png`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-contact-sheet-4k-v1-reference.jpg`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-identity-bank-50-video-round-10.md`
- `hermes-content/references/ai-ecommerce-model/20260605-seedance-skincare-video-round-11.md`
- `hermes-content/references/ai-ecommerce-model/20260605-kling-storytime-sports-collab-round-12.md`
- `hermes-content/references/ai-ecommerce-model/20260606-kling-bedroom-storytime-round-13.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-word-perfect-lipsync-motion-workflow-round-14.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-elevenv3-voice-round-15.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-elevenv3-young-voice-round-16.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-apartment-storytime-motion-ref-round-17.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-motion-control-system-round-18.md`
- `hermes-content/references/ai-ecommerce-model/mara-motion-control-config-20260606.json`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-full-body-motion-round-19.md`
- `hermes-content/references/ai-ecommerce-model/20260606-mara-motion-control-automation-round-20.md`
- `scripts/mara_prompt_matrix.js`
- `scripts/mara_comfyui_queue.js`
- `scripts/comfyui_upload_image.js`
- `scripts/comfyui_video_audit.js`
- `scripts/comfyui_wan_readiness.js`
- `hermes-content/docs/MARA_POND_VIDEO_LAB_DASHBOARD_2026.html`
- `hermes-content/docs/MARA_ISDIN_WAN_UGC_WORKFLOW_20260617.md`
- `hermes-content/docs/WAN_HIGGSFIELD_UGC_PROMPT_RESEARCH_20260618.md`
- `hermes-content/docs/MARA_VIDEO_GENERATION_WORKFLOW_2026.md`
- `hermes-content/references/ai-ecommerce-model/mara-pond-video-lab-config-20260616.json`
- `hermes-content/references/ai-ecommerce-model/mara-isdin-wan-ugc-config-20260617.json`
- `hermes-content/references/ai-ecommerce-model/wan-higgsfield-ugc-prompt-kit-20260618.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/mara-ltx23-mapping.example.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/video_ltx2_3_i2v.mapping.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b_api.json`
- `hermes-content/references/ai-ecommerce-model/comfyui/wan22_ti2v_5b.mapping.json`
- `hermes-content/references/ai-ecommerce-model/mara-identity-20260616/`
- `hermes-content/references/ai-ecommerce-model/identity-bank-50/`
- `hermes-content/references/ai-ecommerce-model/video-ads/`
- `hermes-content/references/ugc-model-ltx23/20260615-analysis/`
- `hermes-content/references/higgsfield-content-use-cases.json`
- `hermes-content/references/social-caption-template.json`
- `hermes-content/references/style-references.json`
- `hermes-content/references/n8n-higgsfield-generation-flow.md`
- `hermes-content/references/n8n-radar-diario-creativo-clientes.md`
- `hermes-content/references/n8n-telegram-chat-id-capture.md`
- `hermes-content/references/creator-video-references/README.md`
- `hermes-content/references/creator-video-references/manifest.json`
- `hermes-content/references/creator-video-references/template.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260601-001.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260601-002.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260601-003.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260602-001.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260602-002.json`
- `hermes-content/references/creator-video-references/creator-video-ref-20260602-003.json`
- `hermes-content/references/creator-video-references/strategy-20260601-ai-creator-content.json`
- `hermes-content/references/creator-video-references/strategy-20260602-ai-video-reference-stack.json`
- `hermes-content/references/sergio-approved-media/README.md`
- `hermes-content/references/sergio-approved-media/manifest.json`
- `hermes-content/references/sergio-approved-media/intake-20260602-drive.md`
- `hermes-content/references/sergio-approved-media/sergio-face-voice-profile-20260602.md`
- `hermes-content/references/sergio-approved-media/avatar-realism-lab-20260604.json`
- `hermes-content/references/sergio-approved-media/talking-video-lock/README.md`
- `hermes-content/references/sergio-approved-media/talking-video-lock/higgsfield-source-video-photoshoot-prompt.txt`
- `hermes-content/references/sergio-approved-media/talking-video-lock/kling-source-video-animation-prompt.txt`
- `hermes-content/skills/instagram-publicacion.md`
- `hermes-content/skills/descripciones-sociales-onia.md`
- `hermes-content/skills/carruseles-onia.md`
- `hermes-content/skills/flujo-completo-carrusel.md`
- `hermes-content/skills/referencias-pinterest.md`
- `hermes-content/skills/seguridad-credenciales.md`
- `hermes-content/skills/operaciones-dashboard.md`
- `hermes-content/skills/orquestador-creativo-ia.md`
- `hermes-content/skills/video-lab-higgsfield.md`
- `hermes-content/skills/videos-virales-higgsfield.md`
- `hermes-content/skills/ugc-empresas-higgsfield.md`
- `hermes-content/skills/audio-elevenlabs.md`
- `hermes-content/skills/inteligencia-reuniones-onia.md`
- `hermes-content/skills/marca-personal-sergio.md`
- `hermes-content/skills/historias-sergio.md`
- `hermes-content/skills/crons-diarios-hermes.md`
- `hermes-content/skills/orquestacion-proyectos-onia.md`
- `hermes-content/skills/radar-creativo-onia.md`
- `hermes-content/skills/consultoria-onia.md`

Do not create alternate files named:
- `instagram-publish-v2.md`
- `dashboard-new.md`
- `assets-new.js`
- `publish-instagram-copy.py`

Extend the canonical files instead.

### Session B: n8n, weekly planning, taxes, prospecting, CRM
The other session should own:
- n8n workflows and scheduling.
- Weekly content planning.
- Prospecting flows.
- Tax reminders.
- CRM/client workflows.
- Notion finance and business records.

Canonical files already visible for Session B:
- `AI_YOUTUBE_CHANNELS_MASTER_PLAN_2026.md`
- `AI_TRENDS_RADAR_CONTENT_SYSTEM_2026.md`
- `FUTBOL_LAB_IA_CHANNEL_SYSTEM_2026.md`
- `FUTBOL_LAB_IA_BRAND_IDENTITY_2026.md`
- `AI_YOUTUBE_DOCUMENTATION_INDEX_2026.md`
- `AI_YOUTUBE_HIGH_CPM_CRM_OPERATIONS_MANUAL_2026.md`
- `AI_YOUTUBE_SOPS_AND_OPERATOR_HANDOFF_2026.md`
- `AI_YOUTUBE_PHASE1_CREATIVE_OPERATING_KIT_2026.md`
- `supabase/migrations/20260605_atlas_ai_media_content_factory.sql`
- `hermes-content/references/ai-youtube-pilot-content-queue-20260605.json`
- `hermes-content/references/ai-trends-radar-system-20260606.json`
- `hermes-content/references/ai-trends-video-001-agentes-20260606.md`
- `hermes-content/references/ai-trends-video-001-agentes-20260606.json`
- `hermes-content/references/futbol-lab-ia-channel-kit-20260605.json`
- `hermes-content/references/futbol-lab-ia-higgsfield-prompts-20260605.json`
- `hermes-content/references/futbol-lab-ia-language-system-20260605.json`
- `hermes-content/references/futbol-lab-ia-video-brief-piloto-001-20260605.json`
- `hermes-content/references/futbol-lab-ia-video-001-francia-jordania-20260605.md`
- `hermes-content/references/futbol-lab-ia-video-001-francia-jordania-20260605.json`
- `.hermes/video-lab/jobs/vl-20260605-013309-onia-futbol-lab-ia-piloto-001-la-ia-no-sabe-q.json`
- `.hermes/video-lab/briefs/vl-20260605-013309-onia-futbol-lab-ia-piloto-001-la-ia-no-sabe-q.json`
- `.hermes/video-lab/jobs/vl-20260605-futbol-lab-001-francia-jordania-dinero-vs-caos.json`
- `.hermes/video-lab/briefs/vl-20260605-futbol-lab-001-francia-jordania-dinero-vs-caos.json`
- `.hermes/video-lab/jobs/vl-20260606-radar-ia-001-la-ia-ya-no-responde-ahora-trabaja.json`
- `.hermes/video-lab/briefs/vl-20260606-radar-ia-001-la-ia-ya-no-responde-ahora-trabaja.json`
- `hermes-content/references/ai-youtube-launch-checklist-20260605.json`
- `hermes-content/references/ai-youtube-content-package-template-20260605.json`
- `hermes-content/references/ai-youtube-approval-matrix-20260605.json`
- `hermes-content/references/ai-youtube-high-cpm-crm-keyword-map-20260605.json`
- `hermes-content/references/n8n-ai-youtube-content-factory-20260605.md`
- `hermes-content/references/n8n-workflows/atlas-ai-media-content-factory-draft-v1.sdk.js`
- `hermes-content/references/n8n-workflows/onia-scheduled-ops-pack-v1.sdk.js`
- `scripts/n8n_mcp_healthcheck.js`
- `scripts/onia_project_hygiene.mjs`
- External DentalGest repo:
  `C:\dev\Proyectos\dental-saas\supabase\migrations\20260605_n8n_postgrest_schema_cache_fix.sql`
- `hermes-content/skills/plan-semanal-onia.md`
- `hermes-content/skills/prospeccion-onia.md`
- `hermes-content/skills/recordatorios-fiscales-bolivia.md`
- `hermes-content/references/impuestos-bolivia.template.json`
- `hermes-content/references/n8n-plan-semanal-onia.md`
- `hermes-content/references/prospectos-clinicas-bolivia-2026.csv`
- `hermes-content/references/n8n-prospeccion-clinicas-ig-telegram.md`
- `hermes-content/docs/POLLO_LOCO_CLIENT_REVIEW_20260613.html`
- `hermes-content/docs/POLLO_LOCO_CLIENT_REVIEW_20260613.pdf`

Recommended new files for Session B:
- `N8N_AUTOMATION_PLAN.md`
- `CRM_AND_PROSPECTING.md`
- `TAX_REMINDERS_BOLIVIA.md`
- `hermes-content/docs/N8N_AUTOMATIONS.md`
- `hermes-content/docs/CRM_PROSPECTING.md`
- `hermes-content/docs/TAX_REMINDERS.md`
- `hermes-content/skills/n8n-automatizaciones-onia.md`
- `hermes-content/skills/crm-prospeccion-onia.md`
- `hermes-content/skills/impuestos-bolivia-operaciones.md`

Session B should not edit publishing scripts unless coordinating first.

## Naming rules
- Web Factory client-site context for Nuvia lives in `web-factory/data/clients/nuvia.context.md`.
- Nuvia web data/assets live in `web-factory/data/clients/nuvia.json` and `web-factory/data/clients/nuvia.assets/`.
- Nuvia payment/order system runbook lives in `web-factory/NUVIA_PAYMENT_SYSTEM.md`.
- Nuvia local preview stability runbook lives in `web-factory/NUVIA_LOCAL_PREVIEW_RUNBOOK.md`.
- Nuvia price automation runbook lives in `web-factory/docs/NUVIA_PRICE_AUTOMATION.md`.
- Nuvia product harvester scripts live in `web-factory/harvester/product/`.
- Nuvia app code lives in `web-factory/apps/site` (routes `src/app/nuvia/**`, same
  Next.js app as onia-center/vendedores). Deploys as its OWN Vercel project
  `nuvia-store` (domain `nuvia-store.vercel.app`), same repo/commit as the
  `onia-center` project — see `hermes-content/docs/ONIA_NUVIA_DOMINIO_PROPIO_20260706.md`.
- Global Web Factory design stack lives in `C:\Users\PC\.codex\design-stack\DESIGN_STACK.md`; project usage notes live in `web-factory/DESIGN_STACK.md`.
- Use Spanish names for Hermes skills.
- Use English uppercase names for repo-level operational docs.
- Put user-facing Hermes docs in `hermes-content/docs/`.
- Put command behavior in `hermes-content/skills/`.
- Put machine-readable references in `hermes-content/references/`.
- Put deploy or VPS automation scripts in `scripts/`.

## Knowledge preservation rule
- ONIA/Hermes knowledge must not stay only in chats, temporary files or local
  scratchpads.
- Product decisions, pricing, runbooks, prompts, migrations, proposal drafts,
  operating rules, infrastructure notes and validated research should be saved
  in canonical repo paths and pushed to the remote after validation.
- If Sergio asks `commit all`, first run a secret/sensitive-file check, then
  commit and push everything that is safe to preserve.
- Never commit real `.env` files, passwords, SSH/private keys, API tokens,
  banking data, unredacted client secrets or personal sensitive files.
- For secrets, commit only the variable name, example placeholder or runbook
  describing where the value is stored safely.

## Deployment rules
- Deploy Hermes docs and skills with:

```powershell
npm run deploy:hermes-content
```

- Audit and deploy Onia self-hosted services by private profiles with:

```powershell
npm run audit:selfhosted
npm run deploy:selfhosted -- --profile monitor
npm run deploy:selfhosted -- --profile utility
npm run deploy:selfhosted -- --profile ai
npm run deploy:selfhosted -- --profile research
npm run deploy:selfhosted -- --profile meeting-lite
npm run deploy:selfhosted -- --profile meeting-gpu
npm run deploy:selfhosted -- --profile prepare-dify
```

- Video Lab Telegram commands route through:

```bash
video-lab telegram --message "<raw Telegram message>"
```

- Weekly status/planning commands route through:

```bash
hermes-week-status
hermes-week-plan
```

- General Telegram command center routes through:

```bash
hermes-command telegram --message "<raw Telegram message>"
```

- Deploy Instagram publisher with:

```powershell
npm run deploy:instagram
```

- Prepare asset hosting with:

```powershell
npm run setup:assets
```

## Current validated state
- `ig-publish healthcheck` previously returned `ok: true`, but the Meta token later expired.
- Real carousel publish succeeded with `published_id=18126144559620893`.
- Asset server works at `http://187.77.16.63:8099`.
- Public asset folder on VPS: `/var/www/html/hermes-assets`.
- Hermes dashboard is expected via tunnel: `ssh -L 9119:localhost:9119 root@187.77.16.63`.
- Hermes daily crons are active for operational status, content/video planning, and Video Lab follow-up.
- Hermes weekly crons are active for kickoff, prospecting, build sprint, content production, finance/ops, Sergio brand, and weekly review.
- n8n is running on the VPS, but Hermes cron is currently the active scheduler for Hermes daily tasks.
- As of 2026-06-15, only `n8n-sergio_n8n` should run in production on the VPS. Duplicate service `n8n_n8n` was backed up and scaled to `0/0`; its volume was not deleted.
- As of 2026-06-15, a self-hosted Supabase Docker stack exists on the current VPS at `/opt/onia-supabase/supabase/docker`. It is intentionally private/local-only:
  - Kong/API: `127.0.0.1:54321` and `127.0.0.1:54322`
  - Supavisor/Postgres access: `127.0.0.1:54329` and `127.0.0.1:54320`
  - No public DNS, SMTP, or client-facing exposure has been configured yet.
- Supabase backups:
  - Pre-change n8n backup: `/root/backups/onia-vps-20260615-195441-pre-supabase`
  - Supabase daily local backup script: `/root/.hermes/scripts/supabase_backup.sh`
  - Cron: `/etc/cron.d/onia-supabase-backup`
  - Local backup target: `/root/backups/supabase`
- Notion MCP is connected locally via OAuth (`https://mcp.notion.com/mcp`) as of 2026-06-01.
- Confirmed Notion sources:
  - Finance: `Finanzas & Gastos`, page `ffc07959-c372-4ff7-aaf6-2d744d5bf81c`, data source `collection://0e6e404f-d329-4898-9861-64f8ce973ac5`.
  - SaaS/tools: `SaaS & Herramientas`, page `dc6a6e27-453a-4d7c-800b-ef9c29c8d5ff`, data source `collection://5eaa8d12-823c-4b3b-96bb-e7aaeab1ff9c`.
  - CRM/contactos: `CRM & Contactos`, page `95acb20d-e7f5-4eaa-b185-7a7933ffdd1a`, data source `collection://9b4c77be-d02b-4840-8f91-827ec8007839`.
- June 2026 base finance records in Notion include Codex Pro, Higgsfield Ultra, Google Workspace, VPS Hostinger, Google Photos and Claude Code Pro.
- As of 2026-06-19, the Onia self-hosted stack deploy kit exists at
  `hermes-content/deploy/selfhosted/` and targets `/opt/onia-selfhosted` on the
  VPS. It is private-first: Uptime Kuma, LiteLLM, Open WebUI, Stirling PDF and
  Crawl4AI bind to `127.0.0.1` by default. Dify is prepared only and must not
  be started from the official compose until VPS resources and 80/443 port
  conflicts with Easypanel/Traefik are reviewed.
- As of 2026-06-19 America/Caracas, `/opt/onia-selfhosted` is deployed with
  healthy private services: Uptime Kuma on `127.0.0.1:3101`, Open WebUI on
  `127.0.0.1:3102`, Stirling PDF on `127.0.0.1:3103`, LiteLLM on
  `127.0.0.1:4000`, and LiteLLM Postgres on the internal Docker network.
  `OPENAI_API_KEY` exists in `/root/.hermes/.env`; LiteLLM `/v1/models`
  returned `gpt-4.1-mini`, `gpt-4o-mini`, and `o4-mini` with the remote master
  key. Dify and Crawl4AI are intentionally not installed yet because post-deploy
  resources are tight: about 2.8 GiB available RAM, 3.7 GiB swap used, and 27
  active containers.
- As of 2026-06-20, Hermes OS Control Center is the canonical Control Tower
  direction for migrating Onia apps into one self-hosted panel. The `mail`
  self-hosted profile is prepared with Mailpit and Listmonk, but it must not be
  treated as production sending until Onia has a sending domain, PTR/rDNS, SPF,
  DKIM, DMARC, bounce handling and an unsubscribe policy. Postal/Mailu/full
  SMTP delivery should run on a separate VPS/IP if used.

## Security notes
- VPS password and Meta token were pasted in chat and must be rotated.
- Do not paste secrets into docs or chat.
- Store secrets only in `/root/.hermes/.env`.
- Verify secrets by presence or length, never by printing full values.

## Parallel work protocol

**Al ABRIR un carril:**
1. Declarar la rama, el worktree y **qué archivos posee** en la tabla de "Carriles VIVOS".
2. Pedir puerto si va a levantar un dev server, y anotarlo ahí.
3. Si toca infra (VPS / Chatwoot / n8n / la base), **verificar que el turno esté libre** y decirlo.
4. Leer `hermes-content/docs/handoff/<carril>.md` si existe. No re-descubrir lo ya escrito.

**Antes de EDITAR:**
1. Mirar este manifiesto.
2. Ver si ya existe un archivo canónico del tema (casi siempre existe: hay ~200 docs).
3. Si el trabajo es de otro carril, dejar una nota o propuesta — **nunca** una implementación duplicada.
4. Si hace falta un archivo nuevo, agregarlo acá en su sección de propiedad.

**Al CERRAR un carril:**
1. Gates: `tsc --noEmit`, tests, code-reviewer.
2. `git add` con **rutas explícitas** — nunca `-A` (ver regla 2).
3. Apagar el dev server y liberar el puerto.
4. **Escribir el handoff** en `hermes-content/docs/handoff/<carril>.md`, con los intentos
   fallidos de verdad — es el campo que nadie escribe y el que evita repetir el callejón.
5. Rebase → merge a `main`. Nunca dejar un merge con conflictos abierto al soltar el turno:
   el hook Stop corre el auto-sync y puede convertir marcadores `<<<<<<<` en un "resuelto".
