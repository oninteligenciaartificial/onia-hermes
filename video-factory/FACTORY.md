# ONIA Video Factory

Fábrica de video para ONIA. Convierte un brief en un plan de pieza validado y lo
registra en el Video Lab del brain. Motor objetivo: CLI oficial de Higgsfield + Skills,
reemplazable.

> **Estado 2026-09-22: planificador/esqueleto, no runtime productivo.** El adapter no ejecuta
> Higgsfield sin un runtime inyectado y su tabla de costos es histórica. El campo
> `credits_estimated` sirve solo para tests del prototipo: **no autoriza gasto**. Antes de cualquier
> implementación real se debe reemplazar por schema vivo + `higgsfield generate cost` y ledger.
> Incluso con un runtime inyectado, el adapter rechaza `generate` si faltan estado aprobado,
> `input_hash`, identidad, cotización viva y cap de aprobación. La quote queda ligada a input,
> modelo, parámetros, referencias y cantidad, vence en 60 minutos y la aprobación debe vincular
> el hash de esa quote con el aprobador literal `Sergio Urcullo`.
> **No es todavía un gate de derechos:** `identity_ok` es un dato autocontenido y el adapter no
> carga `LUCIA-HIGGSFIELD-IDENTITY.json` ni verifica hashes. Mantener el runtime deshabilitado
> hasta cablear esa validación. `approved_by` tampoco tiene firma ni sesión autenticada: el hash
> evita mezclar quote/job, pero no demuestra quién aprobó.

## Frontera (CRÍTICO)

- `onia-hermes/` (raíz) = brain: operaciones, Video Lab, CRM, contenido. NO se toca.
- `onia-hermes/video-factory/` (aquí) = producción de media. Mundo aparte, deps propias.
- La fábrica produce y **escribe el estado al Video Lab** (`.hermes/video-lab/jobs/`).
  NO publica, NO toca CRM/finanzas.

## Uso

1. Crear `data/intakes/<slug>.json` (validado por `contracts/intake.schema.mjs`).
2. `node cli.mjs plan --intake data/intakes/<slug>.json` → imprime un plan de prototipo; su costo
   no es cotización vigente.
3. La generación real queda deshabilitada hasta implementar el wrapper CLI, reconciliación y
   aprobación documentados en `../hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`.

## Lanes

- cliente: gate de brief + costo; no publicable.
- onia: gate de brief + costo + identidad; no publicable.
- sergio: gate de brief + costo + identidad; no publicable.

Ver `../hermes-content/docs/historial/VIDEO_FACTORY_DESIGN.md` para el diseño completo.
