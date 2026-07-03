# ONIA - Estado de higiene del proyecto (2026-07-03)

Pasada de higiene documental sobre `hermes-content/docs/`, `web-factory/docs/`,
docs de raiz, `scripts/` y `package.json`. Consolidacion ejecutada el 2026-07-03
con aprobacion. Se eliminaron 10 duplicados de raiz obsoletos + 4 capturas de
sesion. Los 3 casos ambiguos (contenido unico en ambos lados) se conservaron sin
tocar (ver seccion 2). Nada con valor unico fue borrado.

## Resumen

- Docs sanos: no se detectaron referencias muertas. Todos los scripts, configs,
  migraciones y workflows citados en la documentacion existen en disco.
- Consolidacion hecha: de 13 documentos duplicados entre raiz y
  `hermes-content/docs/`, se eliminaron 10 copias de raiz obsoletas (6 identicas +
  4 desactualizadas, incluida la de precios DentalGest viejos). `hermes-content/docs/`
  queda como fuente unica de esos 10.
- Excepcion: 3 archivos (`HIGGSFIELD_VIDEO_SYSTEM.md`, `HIGGSFIELD_CONTENT_USE_CASES.md`,
  `ELEVENLABS_AUDIO_SYSTEM.md`) NO son mirrors obsoletos: la version de raiz es
  larga (prosa) y la de `docs/` es una reescritura corta respaldada por JSON.
  Ambas tienen contenido unico. Se conservaron; requieren decision de contenido.
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
| HIGGSFIELD_VIDEO_SYSTEM.md | Divergente (raiz 584L vs docs 411L) | CONSERVADO. Contenido unico en ambos. |
| HIGGSFIELD_CONTENT_USE_CASES.md | Divergente (raiz 536L vs docs 47L) | CONSERVADO. Docs/ es reescritura corta con JSON; raiz es prosa larga. |
| ELEVENLABS_AUDIO_SYSTEM.md | Divergente (raiz 218L vs docs 153L) | CONSERVADO. Contenido unico en ambos. |

Los 3 conservados NO son mirrors obsoletos: la raiz es la version larga
(long-form) y `docs/` es una reescritura concisa respaldada por JSON machine-readable
(ej. `higgsfield-content-use-cases.json`), pensada para que Hermes/VPS la consuma.
Borrar cualquiera de los dos lados pierde contenido. Requieren una decision manual:
fusionar la prosa de raiz dentro del JSON/docs, o quedarse con una sola. No es
higiene mecanica.

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
- `hermes-content/docs/ONIA_CIERRE_DIA_20260623.md` (lineas 25-37): 8 pendientes
  del cierre del 06-23 (migraciones Supabase, workflow n8n, activar auth/roles,
  conectar DB de ONIA Center, backups, QA Nuvia, costos vendedores, decision
  VPS vs local). Snapshot de hace 10 dias; conviene verificar cuales siguen abiertos.
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
- Eliminadas 4 capturas de sesion Notion trackeadas en la raiz
  (`tmp_screen_notion*.png`, ~1,2 MB).

Conservado a proposito:

- Los 3 archivos divergentes de la seccion 2 (contenido unico en ambos lados).
- `tmp-assets/` (avatares/videos Sergio) y `references-inbox/` (9,2 MB de
  referencias): `.gitignore` indica explicitamente que assets/fotos SI se sincronizan.

## Proximos pasos sugeridos

1. Decidir los 3 archivos divergentes (seccion 2): fusionar la prosa de raiz
   dentro de la version JSON/docs, o elegir una sola. Es lo unico que queda de la
   duplicacion.
2. Revisar los 8 pendientes del cierre 06-23 y cerrar los ya resueltos.
3. Destrabar los 3 bloqueos SSH/n8n de la automatizacion VPS de web-factory.
