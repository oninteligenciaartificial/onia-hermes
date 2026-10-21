# Handoff — revisión de skills (20-oct-2026)

## 1. Objetivo

Auditar todas las skills de ONIA y dejarlas limpias de contaminación (sesiones degradadas): cada una con veredicto
(limpia / corregida / a borrar), las corregidas por PR revisado, y lo que haya que borrar fuera del repo esperando
el sí de Sergio Urcullo. Alcance: 66 de `.claude/skills/`, 30 de `.agents/skills/`, 40 de `hermes-content/skills/`
y las 6 `onia-*` de `onia-platform` (solo lectura).

Criterios usados (1-6): contradice `CLAUDE.md` o las reglas del 19-oct · dato, ruta o archivo sin fuente · regla
duplicada o contradictoria · historia como presente · texto basura o inflado · frontmatter o descripción rota.
Método: diez revisores de solo lectura (Sonnet juzga, Haiku cuenta), decisión y arreglo mínimo acá.

## 2. Qué quedó en producción

Nada se publica: son textos de skills. Entran a `main` por estos PR (ver §7 para el estado de cada uno):

| PR | Rama | Qué hace |
|---|---|---|
| copias | `claude/revision-skills-copias` | Iguala `.agents/skills` con `.claude/skills` y agrega el aviso de gasto de ONIA a Higgsfield |
| operación | `claude/revision-skills-operacion` | Router, equipo de agentes, madre como historia, continuidad, Orca, Panel, Hermes-Jarvis, infra |
| producto | `claude/revision-skills-producto` | Core, propuestas, web-factory (3), ventas y pauta, chatbot |
| contenido | `claude/revision-skills-contenido` | Diseño de contenido, edición por referentes, editor de videos, ver videos, sacar prompt |
| hermes | `claude/revision-skills-hermes` | Los 40 docs de `hermes-content/skills/` |
| handoff | `claude/revision-skills` | Este archivo |

## 3. Qué quedó a medias, y dónde — y los veredictos

A medias: las 6 skills de `onia-platform` (no se tocan desde acá: la lista va abajo y en el anexo, para la sesión de
Platform) y lo de §6 que espera a Sergio Urcullo. Los PR, según §7.

### `.claude/skills/` (66)

| Skill | Veredicto | Qué tenía |
|---|---|---|
| aprender-de-todo | corregida | «la madre coordina» en presente |
| diseno-contenido-onia (+ `patrones/`) | corregida | publicar sin OK (9-oct), layout `cierre` imprime «Comentá», briefs inexistentes, 5 layouts en vez de 8 |
| edicion-referentes (+ `recetas/erik.json`) | corregida | permiso de publicar del 8-oct como vigente; contradicciones internas (música, costo, CTA); ruta de la nube |
| editor-videos | corregida | gasto sin la excepción del 8-oct; karaoke amarillo (el script es verde); SFX contra el rechazo del 2-oct; Remotion |
| equipo-de-agentes | corregida | madre, colas, latidos y ronda de 20 min como vigentes (§2, §2 bis, §3 → HISTORIA) |
| onia-chatbot | corregida | conteos viejos; docs con fecha como fuente; textos del bot en vos |
| onia-contabilidad-bolivia | limpia | — |
| onia-continuidad | corregida | cola del carril y madre como mecanismo |
| onia-core | corregida | contrato «beta» (es 1.0.0 stable); rubros en orden viejo |
| onia-hermes-jarvis | corregida | madre en presente; ruta `onia-cola.md` mal citada |
| onia-infra | corregida | madre; publicar sin la regla del 19-oct |
| onia-propuestas | corregida | precios de webs 790/1.500 vencidos escritos en la skill |
| onia-router (+ `STACK-POR-DOMINIO.md`) | corregida | conteos (42 → 66, 116 → 113), skill inexistente, Remotion, Higgsfield por MCP, copia global de HyperFrames |
| onia-sesion-madre | corregida (es historia) | partes en presente; publicar «incluido diseño» |
| onia-ventas-pauta | corregida | piezas sin OK; frases de cliente en vos; «tono» contra el catálogo; importadora con comercio; madre; encabezados duplicados |
| onia-web-factory | corregida | rediseño sin captura + OK; falta «usted»; gasto viejo |
| orca | corregida | «la madre es una sola» |
| panel-onia | corregida | versión fija vieja (0.1.1) |
| sacar-prompt | corregida | gasto sin cotizar |
| ver-videos | corregida | rutas de scripts de la raíz como si fueran de la skill |
| web-factory-design-research | corregida | 2 plantillas (son 7); skill citada inexistente |
| web-factory-intake-assets | corregida | 2 plantillas; mensaje al cliente en tú |
| README.md (índice) | corregido | faltaban seis skills del repo |
| higgsfield-generate | corregida | la oficial dice «no pre-estimar costo»; faltaba el aviso de gasto de ONIA |
| higgsfield-soul-id | corregida | «Submit» directo de un Soul sin aviso de gasto ni de cara/voz |
| embedded-captions | corregida | la copia de `.claude` no tenía el gate de ortografía que cita `editor-videos` |
| media-use | corregida | faltaba el `.gitignore` de los mp3 en `.claude` |
| 16 de ECC: ad-creative, api-design, backend-patterns, competitor-profiling, content-strategy, copywriting, database-migrations, deep-research, deployment-patterns, docker-patterns, n8n-mcp-tools-expert, n8n-workflow-patterns, postgres-patterns, pricing, security-review, verification-loop | limpias | texto de terceros, igual a la copia global |
| 24 de HyperFrames/HeyGen: captions-overlay, changelog-video, cut-the-curve, faceless-explainer, figma, general-video, hyperframes, hyperframes-animation, -cli, -core, -creative, -keyframes, -registry, impeccable, motion-doctrine, motion-graphics, music-to-video, oversized-cursor, pr-to-video, product-launch-video, remotion-to-hyperframes, seam-craft, slideshow, talking-head-recut | limpias | texto de terceros; sin agregados ONIA que choquen |

Frontmatter: las 96 carpetas (`.claude` + `.agents`) tienen `name` igual a la carpeta y `description`; ninguna pasa
de 1024 caracteres (la más larga, higgsfield-generate, 1017).

### `.agents/skills/` (30)

Las 30 quedan iguales a `.claude/skills/` (las demás diferencias eran solo CRLF del árbol de trabajo; el índice
está en LF). Diferían de verdad tres: embedded-captions (gate de ortografía solo en `.agents`), higgsfield-soul-id
`photo-guide.md` (lo medido el 30-sep solo en `.claude`) y media-use (`.gitignore` solo en `.agents`). Los cambios
a web-factory-design-research, web-factory-intake-assets y Higgsfield van en las dos copias.

### `hermes-content/skills/` (40)

| Doc | Veredicto |
|---|---|
| actas-reuniones-onia, agenda-calendario, historias-onia, historias-sergio, marca-personal-sergio, operaciones-dashboard, planificar-orquesta, radar-creativo-onia, recordatorios-fiscales-bolivia, referencias-pinterest, sistema-semanal-hermes, tendencias-ia-redes, ugc-empresas-higgsfield, video-lab-higgsfield, videos-virales-higgsfield | limpias |
| impuestos-bolivia-operaciones | limpia, pero casi idéntica a recordatorios-fiscales-bolivia (la citan tres docs: unificar queda pendiente) |
| analiza-llamada, aprobaciones-onia, audio-elevenlabs, brief-diario-onia, carruseles-onia, centro-comando-telegram, crm-prospeccion-onia, crons-diarios-hermes, descripciones-sociales-onia, flujo-completo-carrusel, guiones-diarios-onia, instagram-publicacion, inteligencia-reuniones-onia, n8n-automatizaciones-onia, orquestacion-proyectos-onia, orquestador-creativo-ia, pedir-a-claude, plan-semanal-onia, propuestas-comerciales-onia, prospeccion-onia, seguimiento-prospectos-onia, seguridad-credenciales | corregidas |
| consultoria-onia | corregida y marcada CONGELADA (precios propios, comisión de vendedor, horas de Sergio Urcullo) |
| genera-propuesta | corregida y marcada LEGADO (la propuesta sale del generador oficial) |

Lo que más se repetía: Arthur como destinatario de avisos (ya no colabora), comisiones y vendedores, WhatsApp
«bloqueado hasta Meta», ONIA Center como destino, DentalGest/GestiOS como productos, n8n apagado como instancia
recomendada, publicar sin captura + OK.

### `onia-platform/.claude/skills/` (6) — para la sesión de Platform

Revisadas en `origin/master` a0488f04 (16-oct): el checkout `C:/dev/proyectos/onia-platform` está en una rama del
12-sep y no sirve para medir. Las seis: **corregir**. Ninguna a borrar. Rutas citadas: todas existen.

| Skill | Qué corregir (mínimo) |
|---|---|
| onia-backend | L16: los montos de plan viven en `lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`), no en `pricing.ts` (que tiene `PLAN_LABELS` y add-ons). L258 «madre v2» → «revisión de seguridad». L51-191 (rangos de calendario, ~140 líneas de pulidos 10-12) condensar a ~15 líneas de método; L96-101 duplica onia-db |
| onia-db | L27-28 «la aplica la madre» → sesión principal con OK, comprobando `role_table_grants`. L48, L59-62, L181-190: hechos de la nube escritos como vigentes → marcar historia. L68-71 nombra arthur@ y vendedora@ → «cuentas reales». RLS y grants duplicados con onia-seguridad |
| onia-deploy | L12-13 dice `main`: la rama es `master`. Falta la regla del 19-oct: «mergear ES publicar», así que una pantalla nueva o un rediseño espera captura 390/1440 + OK de Sergio Urcullo ANTES del merge. L68-87 runbook de runtime-next muerto desde el 24-sep |
| onia-frontend | L38-39 «7 rubros» → 5 (`RUBROS_ACTIVOS`; ganadero es legado). L567-568 planes desde `subscription-plans.ts`, no `pricing.ts`. L24: la pantalla espera su OK. L127-129 `dashboardSummary` ya está de usted; el tuteo que queda es `pricing.ts` L177, 387, 395, 404. L56-545 (~490 líneas de crónica de pulidos) condensar |
| onia-seguridad | L44 «hasta que la madre aplique» → remitir a onia-db. L196-222 condensar a 5 líneas. L8-9 cita `security-best-practices`, que no está instalada |
| onia-verificacion | L214-217 baseline «9629 passed» (8-oct) contradice su propia L59-61 → sacar el número. L101-133 «mirar desde la nube» → marcar historia (desde el 17-oct es local). Falta en «Qué sí cuenta»: pantalla nueva = captura 390/1440 + OK |

Textos exactos old → new: en el anexo al final de este archivo (copia en
`side-session-notes/local_e1ada2a4-…/platform-skills-propuestas.md`).

## 4. Archivos

Tocados: los de §3 marcados «corregida». No tocados: CLAUDE.md, scripts, `deploy/`, docs fuera de skills,
`~/.claude/skills/` (global), `onia-platform`.

## 5. Intentos fallidos

- Primera revisión de Platform hecha contra el checkout local (rama del 12-sep): daba skills de 50-140 líneas que en
  `origin/master` tienen 180-770. Se rehízo contra `git show origin/master:` exportado. **Antes de revisar algo de
  Platform, mirar la rama del checkout.**
- `api.github.com` no respondía el 20-oct a la noche (TLS timeout) mientras `git` a github.com sí: los push salen,
  los PR por `gh` no. Ver §7.
- Un `git checkout origin/main -- .` puesto por error devolvió los archivos de una rama sin commitear; se rehízo
  desde el JSON de reemplazos. Por eso cada grupo se aplicó con un script que exige que el texto viejo aparezca una
  sola vez.
- Los tests de scripts que leen skills (`guards-cableados`, `hermes-jarvis-aplicar`, `orquesta`) dan 43/94 en esta PC
  **igual en `origin/main`**: los rojos son del entorno Windows, no de estos cambios.

## 6. Qué depende de Sergio Urcullo

- **Borrar fuera del repo (espera su sí, no se tocó nada):** en `~/.claude/skills/` la carpeta oculta `.trash`
  (127 skills), las anidadas `synced` (72) y `everything-claude-code` (155), y `caveman-commit`, `caveman-help`,
  `caveman-review` (plugin desactivado el 20-oct). Medido en el inventario del 20-oct.
- **Contradicciones que están en CLAUDE.md, no en las skills:** CLAUDE.md sigue nombrando al integrador `onia-cola`
  como uno de los dos que mueven `main`; `docs/cola/loop/madre.md` dice «apagado desde el 7-sep» y la memoria «muerto».
  ¿Está vivo?
- **ONIA Center:** la memoria dice abandonado (su contenedor aloja el bot); onia-router y onia-web-factory lo siguen
  tratando como carril A. ¿Se saca el carril?
- **Crece 3 o 4 usuarios:** decisión abierta del 19-oct; onia-ventas-pauta dice «3 en producción (4 con a7f228c)».

## 7. Próximos pasos

0. **En pausa desde el 21-oct 01:40 UTC** (pedido de Sergio Urcullo por la Principal: «stop las sesiones»). La revisión
   independiente de los cinco diffs (agente `code-reviewer`) se paró antes de terminar: **ninguna rama está revisada
   todavía**. Al retomar: correr esa revisión (`git diff origin/main...claude/revision-skills-<grupo>`), arreglar lo que
   salga y recién ahí abrir los PR.
1. Abrir los cinco PR (y el de este handoff), después de la revisión; las ramas ya están pusheadas.
2. Sesión de Platform: aplicar §3 «onia-platform» en su repo.
3. Fuera de skills, encontrado de paso (no es de esta sesión): `ONIA_ADQUISICION_Y_PAUTA.md` L38-40 con el orden de
   rubros viejo; la página `/agentes` de la web y dos tests en vos (pasan a usted juntos); comentario de cabecera de
   `webs.ts` con 790/1.500; catálogo §8 en vos; la etiqueta `[madre]` del tablero en `deploy/hermes-agent/SOUL.md`,
   `scripts/loops/pedido-claude.sh` y `docs/TELEGRAM_COMMAND_CENTER.md` (cambiar las tres juntas: son scripts
   desplegados); mover a `historial/` las bitácoras del 28-sep de `seguridad-credenciales.md`; unificar
   impuestos-bolivia-operaciones con recordatorios-fiscales-bolivia.

## Anexo — textos exactos para las skills de onia-platform

Para la sesión de Platform. Revisor Sonnet de solo lectura; rutas verificadas con `git cat-file` en ese commit.
El checkout `C:/dev/proyectos/onia-platform` estaba en `claude/f2-f3-panel` (12-sep): no medir ahí.

B1 onia-backend L16-19
OLD: «Precios y nombres de plan viven en `lib/pricing.ts` (unica fuente).\n\nPara cobro, los montos/ciclos se resuelven en `lib/subscription-plans.ts`.»
NEW: «Los montos y ciclos de plan viven en `lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`, fuente única); los nombres, en `lib/pricing.ts` (`PLAN_LABELS`); los add-ons, también en `pricing.ts`.»
B2 onia-backend L258: «(3-oct, madre\nv2, CRITICAL…» → «(3-oct, revisión de seguridad, CRITICAL…»
B3 onia-backend L51-191 (rangos de calendario, pulidos 10-12): condensar a ~15 líneas: usar `hoyEn`, `getDayRangeUTC`,
`inicioDelMes`, `limiteDeFiltro`, `esFechaDeCalendario` de `lib/fechas.ts`; validar fecha-solo con `fechaSoloEsquema`;
agrupar por mes en la base (remitir a onia-db); probar ambos lados de la medianoche de La Paz y TZ UTC/La_Paz/Auckland;
gates `fecha-en-zona-del-negocio.test.ts` y `fechas-un-solo-dia-que-existe.test.ts`. Borrar L96-101 (duplica onia-db).

D1 onia-db L27-28: «(la aplica la\n  madre). Después, cero.» → «(la aplica la sesión principal con OK de Sergio Urcullo; comprobar con `information_schema.role_table_grants` si ya corrió). Después, cero.»
D2 onia-db L48: «desde la nube no se puede leer la base viva, y ya no importa.» → «no hace falta leer la base viva.»
D3 onia-db L59-62 «Dónde corre la verificación (16-oct)…sandbox Linux de la nube…» → «**Dónde corre la verificación:** en un Postgres 16 desechable (comandos en la cabecera del script). Si la máquina no lo tiene, descargarlo o instalarlo pide aprobación antes (CLAUDE.md, «Acceso local…»).»
D4 onia-db L183 y L186: anteponer «(Historia, 2-oct, sesión en la nube; hoy el trabajo es local.)». L68-71: «(sergio@, arthur@, vendedora@...)» → «(cuentas reales de Sergio Urcullo y colaboradores)».

P1 onia-deploy L10-13: «`main` alimenta AMBOS deploys: `main` roto rompe los dos.» → «`master` (rama de este repo) alimenta AMBOS deploys: `master` roto rompe los dos.»
P2 onia-deploy, bullet nuevo tras «Un PR con migración» (L41): «- 🔴 **Mergear ES publicar también para lo que ve el cliente (regla del 19-oct):** una pantalla nueva o un rediseño llega a Sergio Urcullo con captura (390/1440) y espera su OK ANTES del merge: el cron lo saca a producción en ≤3 h. Arreglos invisibles, bot, docs e infra revisada se mergean tras la revisión.»
P3 onia-deploy: borrar L71-87 («El runbook anterior (runtime-next, hasta 2026-09-24)»); en L139-145 el smoke apunta a `runtime-next/.next/…` → «el `route.js` en `.next/server/app/api/…` dentro de la imagen».

F1 onia-frontend L38-39: «El producto vende 7 rubros… comercio/ganadero/importadora.» → «El producto vende 5 rubros (dental, comercio, importadora, estética, servicios profesionales; `RUBROS_ACTIVOS`). El vocabulario trae 8 tracks porque ganadero, veterinaria e interna son legado o internos. "Tus pacientes" en una pantalla genérica rompe la venta a comercio, importadora y estética.»
F2 onia-frontend L24-25: anteponer «Las pantallas nuevas y los rediseños le llegan a Sergio Urcullo con captura (390/1440) y esperan su OK antes de mergear (19-oct).»
F3 onia-frontend L567-568: «Se importa de `lib/pricing.ts`\n(el unico archivo que cobra de verdad — lo valida el checkout).» → «Planes: se importan de `lib/subscription-plans.ts` (`DEFAULT_PLAN_AMOUNTS`, lo que valida el checkout). Add-ons: de `lib/pricing.ts`.»
F4 onia-frontend L127-129: `dashboardSummary` ya está de usted; el tuteo que queda: `lib/pricing.ts` L177, 387, 395, 404. Condensar L56-545 (crónica de pulidos) como B3.

S1 onia-seguridad L44-45 «…hasta que la madre\n  aplique `20261003230000_revoke_anon_onia_sends`…» → «Grants a `anon` y RLS: ver `onia-db` (se mide con `information_schema.role_table_grants`).» Borrar la repetición de L129-133 salvo la query.
S2 onia-seguridad L196-222: dejar 5 líneas (error al cliente solo tras `instanceof` de clase del dominio; lo demás 500 genérico en usted + `registrarFallo`; `leerCuerpoJson`), sin los conteos 61/41/20/14.
S3 onia-seguridad L8-9: «las skills globales `security-review` y `security-best-practices`» → «la skill global `security-review`».

V1 onia-verificacion L214-217: sacar «9629 passed | 7 skipped» (8-oct; contradice L59-61): «El baseline vigente sale de la suite y del handoff, no de esta guía.»
V2 onia-verificacion L101: «## Mirar desde la nube de Claude (medido 5 y 8-oct)» → «## Mirar desde un entorno sin Chromium propio (medido en sesiones de nube, 5 y 8-oct; desde el 17-oct el trabajo es local)»
V3 onia-verificacion L224: agregar «(medido 2026-08-31; comprobar `docker ps` y `supabase/config.toml` antes de creer los puertos)».
V4 onia-verificacion «Qué SÍ cuenta», bullet nuevo: «- Pantalla nueva o rediseño: captura a 390 y 1440 (con `--font-render-hinting=none`) que se le muestra a Sergio Urcullo; no está «hecho» hasta su OK (19-oct).»

No verificado: si ya se aplicó `20261003230000_revoke_anon_onia_sends` en producción.
