# ONIA - Estado de higiene del proyecto (2026-07-03)

Pasada de higiene documental sobre `hermes-content/docs/`, `web-factory/docs/`,
docs de raiz, `scripts/` y `package.json`. Solo lectura salvo una limpieza segura
(ver seccion 5). Nada con valor comercial fue borrado. Los borrados propuestos
quedan pendientes de confirmacion.

## Resumen

- Docs sanos: no se detectaron referencias muertas. Todos los scripts, configs,
  migraciones y workflows citados en la documentacion existen en disco.
- Problema principal: 13 documentos estan duplicados entre la raiz del repo y
  `hermes-content/docs/`. `hermes-content/docs/` es la copia canonica (mas
  reciente); las copias de raiz estan desactualizadas. Riesgo real: el
  `ONIA_LEADS_PRIORITY_2026.md` de raiz lista precios DentalGest viejos que
  contradicen el pricing canonico.
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

## 2. Duplicacion raiz vs hermes-content/docs (consolidar)

13 archivos existen en ambos lugares. `hermes-content/docs/` es la copia
mantenida (los divergentes se actualizaron alli el 2026-06-18; la raiz quedo en
2026-06-06). Ningun codigo depende del path de raiz (solo aparecen como etiquetas
de nombre en metadata), asi que consolidar es seguro.

| Archivo | Estado | Nota |
|---|---|---|
| ONIA_PRICING_2026.md | Identico | En sync (ambos 2026-06-22). |
| ONIA_VENDOR_MANUAL_2026.md | Identico | En sync. |
| ONIA_VENDOR_SALES_PLAYBOOK_2026.md | Identico | En sync. |
| NOTION_VENDOR_CRM_SCHEMA_2026.md | Identico | En sync. |
| PROJECTS_ORCHESTRATION.md | Identico | En sync. |
| CROSS_PLATFORM_PUBLISHING.md | Identico | En sync. |
| ONIA_LEADS_PRIORITY_2026.md | DIFIERE | **Raiz desactualizado: precios DentalGest viejos (Starter/Pro/Clinic Bs. 174,50/295/495). El canonico usa Basico/Profesional/Clinica Bs. 112/262,50/525.** |
| PROJECT_PRICE_UPDATE_PROMPTS_2026.md | DIFIERE | Raiz 06-06, docs 06-18. |
| SALES_VENDOR_PRICING_DECK_2026.html | DIFIERE | Raiz 06-06, docs 06-18. |
| ONIA_PROJECTS_VENDOR_DECK_2026.html | DIFIERE | Raiz 06-06, docs 06-18. |
| HIGGSFIELD_VIDEO_SYSTEM.md | DIFIERE | Divergieron el 06-06, sin reconciliar. |
| HIGGSFIELD_CONTENT_USE_CASES.md | DIFIERE | Divergieron el 06-06, sin reconciliar. |
| ELEVENLABS_AUDIO_SYSTEM.md | DIFIERE | Divergieron el 06-06, sin reconciliar. |

Recomendacion (pendiente de confirmacion): declarar `hermes-content/docs/` como
fuente unica y eliminar las copias de raiz, o dejarlas como redirecciones. El
`ONIA_LEADS_PRIORITY_2026.md` de raiz deberia arreglarse primero por el riesgo de
cotizar precios viejos.

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

Hecho en esta pasada (seguro, sin perdida de informacion):

- `git rm --cached scripts/__pycache__/*.pyc` (11 archivos). Eran bytecode
  regenerable ya listado en `.gitignore`; siguen en disco y se regeneran solos.

Pendiente de confirmacion (no se toco nada):

- Eliminar/consolidar las copias de raiz de la seccion 2.
- 4 capturas de pantalla trackeadas en la raiz (`tmp_screen_notion*.png`, ~1,2 MB
  en total) que parecen restos de una sesion de Notion. Candidatas a borrar.

Conservado a proposito:

- `tmp-assets/` (avatares/videos Sergio) y `references-inbox/` (9,2 MB de
  referencias): `.gitignore` indica explicitamente que assets/fotos SI se sincronizan.

## Proximos pasos sugeridos

1. Arreglar precios en el `ONIA_LEADS_PRIORITY_2026.md` de raiz o eliminarlo (riesgo).
2. Confirmar consolidacion raiz -> `hermes-content/docs/` para los 13 duplicados.
3. Revisar los 8 pendientes del cierre 06-23 y cerrar los ya resueltos.
4. Destrabar los 3 bloqueos SSH/n8n de la automatizacion VPS de web-factory.
5. Confirmar borrado de las 4 capturas `tmp_screen_notion*.png`.
