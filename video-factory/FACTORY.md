# ONIA Video Factory

Fábrica de video para ONIA. Convierte un brief en un plan de pieza validado y lo
registra en el Video Lab del brain. Motor: Higgsfield (MCP + Skills), reemplazable.

## Frontera (CRÍTICO)

- `onia-hermes/` (raíz) = brain: operaciones, Video Lab, CRM, contenido. NO se toca.
- `onia-hermes/video-factory/` (aquí) = producción de media. Mundo aparte, deps propias.
- La fábrica produce y **escribe el estado al Video Lab** (`.hermes/video-lab/jobs/`).
  NO publica, NO toca CRM/finanzas.

## Uso

1. Crear `data/intakes/<slug>.json` (validado por `contracts/intake.schema.mjs`).
2. `node cli.mjs plan --intake data/intakes/<slug>.json` → imprime el plan + costo estimado.
3. La generación real (fase 2) corre vía el adapter Higgsfield con runtime MCP.

## Lanes

- cliente: gate antes de generar (brief + costo). No publicable sin OK.
- onia: auto hasta preview.
- sergio: auto hasta still + gate de identidad (cara siempre requiere aprobación).

Ver `../hermes-content/docs/VIDEO_FACTORY_DESIGN.md` para el diseño completo.
