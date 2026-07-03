# ONIA - Estado de higiene del proyecto (2026-07-03)

Pasada de higiene documental sobre `hermes-content/docs/`, `web-factory/docs/`,
docs de raiz, `scripts/` y `package.json`. Consolidacion ejecutada el 2026-07-03
con aprobacion. La duplicacion raiz vs docs quedo 100% resuelta: 10 duplicados de
raiz obsoletos eliminados, 3 divergentes fusionados dentro de `hermes-content/docs/`
(preservando el contenido unico de ambos lados) y 4 capturas de sesion borradas.
Nada con valor unico fue borrado.

## Resumen

- Docs sanos: no se detectaron referencias muertas. Todos los scripts, configs,
  migraciones y workflows citados en la documentacion existen en disco.
- Consolidacion completa: de 13 documentos duplicados entre raiz y
  `hermes-content/docs/`, se eliminaron 10 copias de raiz obsoletas (6 identicas +
  4 desactualizadas, incluida la de precios DentalGest viejos) y se fusionaron 3
  divergentes. `hermes-content/docs/` queda como fuente unica de los 13. Ya no
  quedan duplicados raiz vs docs.
- Fusion de los 3 divergentes (`HIGGSFIELD_VIDEO_SYSTEM.md`,
  `HIGGSFIELD_CONTENT_USE_CASES.md`, `ELEVENLABS_AUDIO_SYSTEM.md`): la version de
  raiz (prosa larga) y la de `docs/` (reescritura corta respaldada por JSON) tenian
  cada una contenido unico; se combinaron en la copia de `docs/` y se elimino la
  de raiz. Detalle en seccion 2.
- web-factory/docs sano: runbooks vivos y snapshots recientes, sin redundancia
  danina. Los pendientes son bloqueos operativos ya documentados, no deuda oculta.
- Limpieza segura hecha: se destrackearon 11 archivos `.pyc` de
  `scripts/__pycache__/` que ya estaban en `.gitignore`.

## 1. Referencias a archivos: sin problemas

Se cruzaron los paths citados en docs, `package.json` y el workflow de GitHub
Actions contra el disco. Todo existe:

- `scripts/onia_project_hygiene.mjs`, `.github/workflows/onia-hygiene-daily.yml`,
  `web-factory/apps/site/src/app/api/onia-center/hygiene/daily/route.ts` (doc de
  higiene automatizada) -> OK.
- Todos los `scripts/vps_*`, `scripts/mara_*`, `scripts/carousel_*`,
  `onia-core/validate.mjs` y los mappings ComfyUI citados en `package.json` -> OK.
- Todos los `web-factory/harvester/product/*.mjs`,
  `scripts/web-factory-vps-automation.mjs`, datos Nuvia y workflows n8n citados en
  `web-factory/docs/` -> OK.

No hay scripts ni docs apuntando a archivos inexistentes.

## 2. Duplicacion raiz vs hermes-content/docs

13 archivos existian en ambos lugares. Ningun codigo ni enlace markdown depende
del path de raiz (solo aparecen como etiquetas de nombre en metadata), asi que la
consolidacion fue segura. Resultado:

| Archivo | Estado | Accion |
|---|---|---|
| ONIA_PRICING_2026.md | Identico | Raiz eliminada. Canonico en docs/. |
| ONIA_VENDOR_MANUAL_2026.md | Identico | Raiz eliminada. |
| ONIA_VENDOR_SALES_PLAYBOOK_2026.md | Identico | Raiz eliminada. |
| NOTION_VENDOR_CRM_SCHEMA_2026.md | Identico | Raiz eliminada. |
| PROJECTS_ORCHESTRATION.md | Identico | Raiz eliminada. |
| CROSS_PLATFORM_PUBLISHING.md | Identico | Raiz eliminada. |
| ONIA_LEADS_PRIORITY_2026.md | Raiz obsoleta | **Raiz eliminada (tenia precios DentalGest viejos Starter/Pro/Clinic Bs. 174,50/295/495; el canonico docs/ usa Basico/Profesional/Clinica Bs. 112/262,50/525).** |
| PROJECT_PRICE_UPDATE_PROMPTS_2026.md | Raiz obsoleta (06-06 vs 06-18) | Raiz eliminada. |
| SALES_VENDOR_PRICING_DECK_2026.html | Raiz obsoleta (06-06 vs 06-18) | Raiz eliminada. |
| ONIA_PROJECTS_VENDOR_DECK_2026.html | Raiz obsoleta (06-06 vs 06-18) | Raiz eliminada. |
| HIGGSFIELD_VIDEO_SYSTEM.md | Divergente (raiz 584L vs docs 411L) | FUSIONADO en docs/ (534L). Base = core canonico de docs/ (Source Of Truth, runbook, Commands, Safe Negative Prompt) + secciones unicas de raiz (Current Local Auth State, Viral/UGC/Client Ad Framework, Prompt Package, Success Metrics). Raiz eliminada. |
| HIGGSFIELD_CONTENT_USE_CASES.md | Divergente (raiz 536L vs docs 47L) | FUSIONADO en docs/. Se adopto la prosa larga de raiz (15 rubros) + nota "fuente machine-readable" que tenia el stub de docs/. Raiz eliminada. |
| ELEVENLABS_AUDIO_SYSTEM.md | Divergente (raiz 218L vs docs 153L) | FUSIONADO en docs/. Base = version de raiz (mas completa) + Runtime Paths y Environment Variables que solo tenia docs/. Raiz eliminada. |

Los 3 divergentes eran documentos con contenido unico en cada lado (raiz =
long-form; `docs/` = reescritura concisa respaldada por JSON machine-readable).
Se fusionaron manualmente dentro de la copia de `hermes-content/docs/` (la que se
despliega al VPS) preservando el contenido unico de ambos lados, y se eliminaron
las copias de raiz. Los bloques compartidos (ej. las recetas de identidad de
Sergio) eran identicos, asi que no se perdio ninguna refinacion.

## 3. Pendientes abiertos reales

Checklists y bloqueos vigentes (no son deuda oculta, pero conviene rastrearlos):

- `web-factory/docs/WEB_FACTORY_VPS_AUTOMATION_20260630.md` (lineas 217-221): 3
  bloqueos para activar la automatizacion VPS en produccion: validar SSH remoto
  (`Permission denied (publickey)`), confirmar ruta del checkout en el VPS,
  confirmar credencial SSH dentro de n8n.
- `web-factory/docs/WEB_FACTORY_FUNCTIONALITY_AUDIT_20260625.md`: falta flujo
  cerrado intake -> JSON -> preview -> deploy -> entrega (linea 122); checkout real
  bloqueado por env vars Supabase/BNB (lineas 120-121); falta politica de derechos
  de imagen (lineas 125-126); cobertura E2E incompleta (lineas 118-119).
- `hermes-content/docs/ONIA_CIERRE_DIA_20260623.md`: los 8 pendientes del cierre
  06-23 fueron triados el 07-03 (tabla de estado al inicio de ese doc). Resueltos:
  auth/roles (desplegado) y n8n (auditado 06-30); migraciones avanzadas. Siguen
  abiertos por infra/negocio (no higiene de docs): backups, QA visual Nuvia, costos
  proveedor Nuvia, envs Vercel produccion, y confirmar todo en el VPS en vivo.
- `hermes-content/docs/MODEL_VIDEO_PRODUCTION_SYSTEM.md` (lineas 509-524): pipeline
  de video con smoke test, produccion e integracion avanzada.
- `hermes-content/docs/ONIA_HERMES_COLLABORATOR_SETUP_RUNBOOK_2026.md` (233-248) y
  `BOLIVIAN_ELECTRIC_AI_TRANSFORMATION_PLAN_2026.md` (538-545): checklists de
  runbook/pre-pitch, abiertos por diseno.
- `ONIA_MASTER_PLAN.md` (raiz, ultima edicion 06-06): varios `- [ ]` y estados
  PENDIENTE (deploy Hermes al VPS, comandos Telegram, ManyChat). Doc de raiz
  desactualizado; revisar vigencia.

## 4. Snapshots cerrados (historico, conservar)

Auditorias puntuales ya cerradas. Son registro historico util, no hace falta
tocarlas:

- `ONIA_CIERRE_DIA_20260623.md` (cierre diario; ver pendientes en seccion 3).
- `BOLIVIAN_TR4_LOCAL_STATIC_AUDIT_20260624.md` (auditoria estatica; conclusion:
  mantener el sistema externo/solo-adaptador).
- `POLLO_LOCO_CLIENT_REVIEW_20260613.html` (review de cliente cerrado).
- Docs de caso Bolivian Electric (`_20260627`, `_20260629`) y ONIA Center
  (`_20260623`): snapshots de referencia activa, no obsoletos.

## 5. Limpieza

Hecho en esta pasada (seguro, sin perdida de contenido unico):

- `git rm --cached scripts/__pycache__/*.pyc` (11 archivos). Bytecode regenerable
  ya listado en `.gitignore`; sigue en disco y se regenera solo.
- Eliminadas 10 copias de raiz obsoletas de la seccion 2 (6 identicas + 4
  desactualizadas). `hermes-content/docs/` queda como fuente unica.
- Fusionados 3 archivos divergentes dentro de `hermes-content/docs/` y eliminadas
  sus copias de raiz (ver seccion 2). Sin perdida de contenido unico.
- Eliminadas 4 capturas de sesion Notion trackeadas en la raiz
  (`tmp_screen_notion*.png`, ~1,2 MB).

Resultado: ya no quedan documentos duplicados entre la raiz y
`hermes-content/docs/`.

Conservado a proposito:

- `tmp-assets/` (avatares/videos Sergio) y `references-inbox/` (9,2 MB de
  referencias): `.gitignore` indica explicitamente que assets/fotos SI se sincronizan.

## 6. Automatizacion: higiene diaria de docs

Para que esta limpieza no dependa de una pasada manual, se agrego un check
determinista que corre todos los dias.

- Script: `scripts/onia_docs_hygiene.mjs` (read-only por defecto; `--fix` solo
  destrackea cache regenerable, nunca borra contenido).
- Comandos: `npm run hygiene:docs` y `npm run hygiene:docs:fix`.
- Corre en el workflow diario `.github/workflows/onia-hygiene-daily.yml`
  (06:00 America/La_Paz), junto al audit de proyectos, sin depender de la PC de
  Sergio. Sube reporte como artefacto.
- Detecta: duplicados raiz vs docs, cache trackeado pese a `.gitignore`, temporales
  trackeados y referencias a scripts inexistentes.
- Estado actual: 0 hallazgos (repo limpio tras la consolidacion).
- Detalle en `ONIA_PROJECT_HYGIENE_AUTOMATION_2026.md`.

## Proximos pasos sugeridos

1. Cerrar los items de infra del cierre 06-23 que necesitan VPS/negocio (backups,
   QA Nuvia, costos proveedor, envs Vercel). Ver tabla de triage en ese doc.
2. Destrabar los 3 bloqueos SSH/n8n de la automatizacion VPS de web-factory.
3. Opcional: revisar `ONIA_MASTER_PLAN.md` de raiz (edicion 06-06, varios
   PENDIENTE) para confirmar vigencia.
