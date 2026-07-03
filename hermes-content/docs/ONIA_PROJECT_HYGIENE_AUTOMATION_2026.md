# ONIA Project Hygiene Automation 2026

Fecha: 2026-06-30.

## Decision

La limpieza diaria de proyectos ONIA no debe depender de la computadora de
Sergio. La arquitectura correcta es remota:

- GitHub Actions ejecuta la auditoria diaria a las 06:00 America/La_Paz.
- ONIA Center recibe el reporte y crea tareas, notas y jobs Codex.
- Vercel, GitHub y otras fuentes se revisan por API.
- Sentry o un monitor equivalente avisa si el job no corre o falla.
- Ningun proyecto, deployment, dominio, repo, base de datos o secreto se elimina
  sin aprobacion explicita.

Sentry no reemplaza al scheduler. Sentry sirve para monitorear crons y errores;
el runner debe ser GitHub Actions, n8n en VPS o un worker propio.

## Archivos canonicos

- Configuracion: `hermes-content/references/onia-project-hygiene-config.json`
- Script diario: `scripts/onia_project_hygiene.mjs`
- Workflow GitHub Actions: `.github/workflows/onia-hygiene-daily.yml`
- Endpoint ONIA Center: `web-factory/apps/site/src/app/api/onia-center/hygiene/daily/route.ts`

## Flujo diario

1. GitHub Actions corre `0 10 * * *`, que equivale a 06:00 en Bolivia.
2. El script carga el inventario de proyectos.
3. Revisa proyectos configurados, Vercel, GitHub Actions y monitor externo.
4. Clasifica hallazgos por riesgo:
   - `blocker`
   - `high`
   - `medium`
   - `low`
   - `info`
5. Clasifica limpieza:
   - `safe_auto`: solo temporales del runner actual.
   - `pull_request`: crear PR o job Codex.
   - `approval_required`: requiere aprobacion Sergio.
   - `blocked`: falta credencial, runner remoto, repo o aprobacion.
6. Genera artefactos:
   - `.onia-hygiene/onia-project-hygiene-report.json`
   - `.onia-hygiene/onia-project-hygiene-summary.md`
7. Si `ONIA_CENTER_BASE_URL` y `ONIA_CENTER_INTERNAL_API_KEY` existen, registra
   el reporte en ONIA Center.

## Que hace automaticamente

- Audita Vercel por proyecto y deployments recientes.
- Marca deployments criticos no listos.
- Marca demos/proyectos raros como candidatos a revisar.
- Audita repos GitHub configurados.
- Marca repos activos sin CI reciente o con ultima Action fallida.
- Detecta proyectos que solo existen localmente y por tanto no pueden auditarse
  si la computadora de Sergio esta apagada.
- Crea nota diaria en ONIA Center.
- Crea tareas para hallazgos altos o bloqueantes.
- Crea jobs Codex para hallazgos que requieren codigo, CI o refactor.

## Que no hace sin aprobacion

- Eliminar proyectos Vercel.
- Borrar repos GitHub.
- Borrar dominios.
- Borrar bases de datos o buckets.
- Rotar secretos.
- Cancelar servicios pagos.
- Publicar contenido o contactar clientes.
- Tocar clientes activos sin revisar impacto.

## Secrets requeridos

Configurar como GitHub Actions secrets, nunca en Markdown ni en el repo:

```txt
VERCEL_TOKEN
VERCEL_TEAM_ID
ONIA_GITHUB_AUDIT_TOKEN
ONIA_CENTER_BASE_URL
ONIA_CENTER_INTERNAL_API_KEY
ONIA_HYGIENE_MONITOR_WEBHOOK_URL
```

Opcionales para fases futuras:

```txt
OPENAI_API_KEY
ANTHROPIC_API_KEY
SENTRY_AUTH_TOKEN
SENTRY_ORG
SENTRY_PROJECT
```

Notas:

- `ONIA_GITHUB_AUDIT_TOKEN` debe tener lectura sobre los repos privados que se
  quieran revisar. El `GITHUB_TOKEN` automatico solo cubre bien el repo actual.
- `ONIA_HYGIENE_MONITOR_WEBHOOK_URL` puede apuntar a Sentry Cron, Healthchecks,
  Better Stack o un webhook n8n.
- La API key de ONIA Center es la misma clase de secreto interno que usa el
  briefing diario.

## Activacion

1. Subir estos archivos a `origin/main`.
2. Crear los secrets anteriores en GitHub.
3. Confirmar que `ONIA_CENTER_BASE_URL` sea accesible desde GitHub Actions.
4. Ejecutar `workflow_dispatch` con `commit=false`.
5. Revisar artefacto `onia-project-hygiene-report`.
6. Ejecutar con `commit=true`.
7. Verificar que ONIA Center muestre nota, tareas y jobs Codex.
8. Activar monitor externo para missed runs.

## Politica de limpieza

La automatizacion diaria deja todo operativo por priorizacion y ejecucion
controlada, no por borrado ciego.

Regla practica:

- Proyecto critico con fallo: tarea alta + job Codex.
- Demo viejo o raro: candidato a archivo + aprobacion Sergio.
- Repo sin runner remoto: bloqueo hasta conectarlo.
- Error Vercel productivo: revisar build logs y rollback antes de tocar codigo.
- Local-only: migrar a GitHub/VPS o queda fuera del mantenimiento no-local.

## Fuentes actuales conocidas

Fuentes productivas:

- ONIA Hermes / ONIA Center.
- DentalGest.
- GestiOS.
- Web ONIA.
- Bolivian Electric.

Fuentes en revision:

- ONIA Forms.
- AlfredHQ.
- Ganaderos OS.
- TempoHomes.
- Nuvia Store.
- CasaJardin.
- Epic Motion Group.
- NexoData Empresas.
- DentalGest Video.
- Organizador de datos de empresas.

Candidatos de archivo:

- `demo-epicmotion-v3`
- `demo-epicmotion`
- `demo-fotografo-2`
- `demo-nude-twojeys`
- `zen-zhukovsky-5e5b10`

No eliminarlos hasta confirmar si tienen dominio, cliente, caso, demo comercial o
codigo reutilizable.

## Higiene de documentacion diaria (docs hygiene)

Complemento del audit de proyectos: revisa la salud de la documentacion del repo,
que era limpieza manual hasta el 2026-07-03.

Script: `scripts/onia_docs_hygiene.mjs`. Corre en el mismo workflow diario de
GitHub Actions (paso "Run ONIA docs hygiene"), sin secrets. Es determinista y
read-only por defecto.

Comandos:

```txt
npm run hygiene:docs        # solo reporta
npm run hygiene:docs:fix    # aplica solo los arreglos safe_auto
```

Que detecta:

- Docs duplicados entre la raiz y `hermes-content/docs/` (identicos o divergentes).
- Archivos regenerables (pycache, dist, build) trackeados pese a `.gitignore`.
- Otros archivos ignorados-pero-trackeados bajo references/assets (solo aviso).
- Archivos temporales trackeados (`tmp_*`, `*.tmp`, capturas de sesion).
- Referencias en Markdown a scripts que no existen en el repo.

Politica de arreglo automatico (`--fix`):

- `safe_auto`: solo destrackea cache regenerable (git rm --cached; el archivo
  queda en disco). Nunca borra contenido de docs.
- `pull_request` / `approval_required`: nunca se auto-ejecutan. Fusionar docs
  divergentes o borrar duplicados con contenido queda para un humano/PR.

Salida: `.onia-hygiene/onia-docs-hygiene-report.json` y `-summary.md`, que se
suben como artefacto junto al reporte de proyectos.

## Siguiente fase

1. Crear vista dedicada `Higiene` dentro de ONIA Center.
2. Conectar Sentry Cron o monitor equivalente.
3. Agregar workflows de CI por repo donde falten.
4. Crear jobs Codex/Claude por repo para reparar fallos detectados.
5. Agregar cleanup por PR para archivos generados obsoletos.
6. Despues de dos semanas de reportes, aprobar eliminacion de proyectos sin uso.
