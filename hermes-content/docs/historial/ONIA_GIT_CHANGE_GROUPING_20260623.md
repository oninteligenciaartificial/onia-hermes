# Onia Git Change Grouping 2026-06-23

Estado: guia operativa local
Uso: separar commits seguros en `C:\dev\proyectos\onia-hermes`.

## Veredicto

No usar:

```powershell
git add .
git add -A
```

El repo mezcla estrategia Bolivian, Onia Center, Nuvia, finanzas, Arthur y
assets generados. Si se sube todo junto, despues sera dificil revisar, revertir
o explicar que cambio pertenece a cada proyecto.

## Estado base observado

Rama:

```text
main...origin/main
```

Lectura:

- no se observo ahead/behind en `git status --short --branch`;
- hay archivos modificados;
- hay muchos archivos nuevos sin trackear, especialmente assets de Nuvia;
- hay cambios de line endings esperados en Windows, no tratarlos como problema
  por si solos.

## Grupos de commit recomendados

### Commit 1 - Bolivian Electric estrategia y propuestas

Objetivo: dejar listo el paquete comercial/estrategico de Bolivian sin tocar
codigo de Onia Center ni Nuvia.

Archivos:

```powershell
git add -- `
  hermes-content/docs/BOLIVIAN_ELECTRIC_PHASE1_LOW_TICKET_AI_OPERATIONS_OFFER_2026.md `
  hermes-content/docs/BOLIVIAN_ELECTRIC_PRIORITY_PROPOSAL_EXECUTIVE_TEAM_2026.md `
  hermes-content/docs/BOLIVIAN_ELECTRIC_OWNER_STRATEGIC_PROPOSAL_2026.md `
  hermes-content/docs/ONIA_GIT_CHANGE_GROUPING_20260623.md
```

Commit sugerido:

```powershell
git commit -m "docs: prepare Bolivian Electric proposal package"
```

Nota: `COORDINATION_MANIFEST.md` tambien se actualiza con archivos nuevos, pero
conviene stagearlo por hunks o en un commit de registro canonico si incluye
entradas de otros frentes.

### Commit 2 - Registro canonico de documentos Onia

Objetivo: registrar docs nuevos en el manifiesto sin mezclar contenido de
producto.

Archivos:

```powershell
git add -- COORDINATION_MANIFEST.md
git commit -m "docs: register ONIA canonical documents"
```

Si quieres precision maxima, usar `git add -p COORDINATION_MANIFEST.md` para
separar hunks de Bolivian, Nuvia y modelo operativo.

### Commit 3 - Finanzas, precios y modelo operativo Onia

Objetivo: agrupar reglas internas de caja, precios, sostenibilidad y catalogo
de servicios.

Archivos:

```powershell
git add -- `
  FINANCE_LOG_2026.md `
  ONIA_PRICING_2026.md `
  hermes-content/docs/ONIA_PRICING_2026.md `
  hermes-content/docs/ONIA_INTERNAL_CAPITAL_ALLOCATION_2026.md `
  hermes-content/docs/ONIA_NUVIA_ACCOUNTING_MODEL_2026.md `
  hermes-content/docs/ONIA_SUSTAINABILITY_DASHBOARD_SPEC_2026.md `
  hermes-content/docs/ONIA_COMPANY_OPERATING_MODEL_2026.md `
  hermes-content/docs/ONIA_CASH_ENGINE_SERVICE_CATALOG_2026.md
```

Commit sugerido:

```powershell
git commit -m "docs: define ONIA operating finance model"
```

Riesgo: revisar que no haya datos privados que no deban salir del repo remoto.

### Commit 4 - Arthur y acuerdo colaborador

Objetivo: separar acuerdos/personas de sistemas y finanzas generales.

Archivos:

```powershell
git add -- `
  hermes-content/docs/ONIA_ACUERDO_ARTHUR_FUENTES_60_DIAS_2026.md `
  hermes-content/propuestas/acuerdo-colaborador-onia-nuvia.pdf
```

Commit sugerido:

```powershell
git commit -m "docs: update Arthur collaborator agreement"
```

Riesgo: el PDF debe revisarse antes de subir si contiene datos personales o
condiciones que todavia no esten aprobadas.

### Commit 5 - Panel de vendedores Onia

Objetivo: agrupar manual/documentacion y referencia JSON del panel de vendedores.

Archivos:

```powershell
git add -- `
  hermes-content/docs/ONIA_PANEL_VENDEDORES_2026.md `
  hermes-content/references/onia-vendor-panel-20260620.json
```

Commit sugerido:

```powershell
git commit -m "docs: update ONIA vendor panel model"
```

### Commit 6 - Onia Center sistema interno

Objetivo: agrupar schema, validacion, store, API y UI de Onia Center.

Archivos base:

```powershell
git add -- `
  package.json `
  scripts/validate_onia_center.js `
  supabase/migrations/20260622_onia_center_ideas_access.sql `
  supabase/migrations/20260622_onia_center_ideas_access_seed.sql `
  supabase/migrations/20260622_onia_center_operating_core.sql `
  supabase/migrations/20260622_onia_center_operating_seed.sql `
  supabase/migrations/20260622_onia_center_rest_grants.sql `
  supabase/migrations/20260622_onia_center_schema.sql `
  supabase/migrations/20260622_onia_center_seed.sql `
  web-factory/apps/site/src/app/api/onia-center `
  web-factory/apps/site/src/app/onia-center `
  web-factory/apps/site/src/lib/onia-center-store.ts
```

Revisar antes de stagear:

```powershell
git diff -- web-factory/apps/site/src/app/globals.css
git diff -- web-factory/apps/site/src/app/layout.tsx
git diff -- web-factory/apps/site/src/app/page.tsx
```

Si esos archivos mezclan Nuvia y Onia Center, usar `git add -p`.

Commit sugerido:

```powershell
git commit -m "feat: add ONIA Center operating core"
```

### Commit 7 - Nuvia web y preview tooling

Objetivo: agrupar mejoras de web, build, preview y datos de Nuvia sin meter los
assets masivos todavia.

Archivos:

```powershell
git add -- `
  web-factory/.gitignore `
  web-factory/NUVIA_LOCAL_PREVIEW_RUNBOOK.md `
  web-factory/package.json `
  web-factory/pnpm-lock.yaml `
  web-factory/apps/site/package.json `
  web-factory/apps/site/next.config.ts `
  web-factory/apps/site/vercel.json `
  web-factory/apps/site/src/components/nuvia/nuvia-store.tsx `
  web-factory/apps/site/src/lib/nuvia-data.ts `
  web-factory/data/clients/nuvia.context.md `
  web-factory/data/clients/nuvia.json `
  web-factory/harvester/product/create_nuvia_product_cutouts.py `
  web-factory/harvester/product/enrich_nuvia_product_media.mjs `
  web-factory/harvester/product/sanitize_nuvia_public_catalog.mjs `
  web-factory/scripts/start-nuvia-preview.ps1 `
  web-factory/data/references/product-sources/nuvia-product-media-enrichment-20260622.json `
  web-factory/data/references/product-sources/nuvia-product-media-enrichment-latest.json
```

Commit sugerido:

```powershell
git commit -m "feat: improve Nuvia catalog media workflow"
```

### Commit 8 - Nuvia generated product media assets

Objetivo: aislar los cientos de imagenes generadas para que el diff principal
no quede ilegible.

Archivos/directorios:

```powershell
git add -- `
  web-factory/apps/site/public/nuvia/assets/product-image-pending.svg `
  web-factory/apps/site/public/nuvia/assets/product-video-pending.svg `
  web-factory/apps/site/public/nuvia/assets/product-media `
  web-factory/apps/site/public/nuvia/assets/product-media-cutout `
  web-factory/data/clients/nuvia.assets/product-image-pending.svg `
  web-factory/data/clients/nuvia.assets/product-video-pending.svg `
  web-factory/data/clients/nuvia.assets/product-media `
  web-factory/data/clients/nuvia.assets/product-media-cutout
```

Commit sugerido:

```powershell
git commit -m "assets: add Nuvia product media library"
```

Riesgo: antes de subir, confirmar que el repo acepta ese peso. Si no, migrar a
storage externo y commitear solo manifest/metadata.

## Orden recomendado

1. Commit Bolivian.
2. Commit registro canonico.
3. Commit finanzas/modelo operativo.
4. Commit Arthur.
5. Commit vendedores.
6. Commit Onia Center.
7. Commit Nuvia tooling/web.
8. Commit Nuvia assets solo si el peso es aceptable.

## Validacion antes de cada commit

Usar:

```powershell
git diff --cached --stat
git diff --cached --name-only
```

Regla:

```text
Si el nombre del commit no explica todos los archivos staged, el commit esta mal
separado.
```

