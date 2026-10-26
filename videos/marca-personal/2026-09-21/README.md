# Marca personal · 2026-09-21

Proyecto del primer corte `01-feed-3-nodos`: microtutorial vertical sobre el
workflow n8n `Webhook → IF → Google Sheets / Append Row → Telegram / Send Message`
para no perder leads. El Webhook recibe `name`, `phone`, `service` y `source`;
el IF valida `phone` y `service`, y deben verse sus ramas true y false.

## Estado

`waiting-for-raw`. No existe todavía la captura obligatoria y no se generó
ningún MP4 de relleno.

## Uso

1. Copiar sin sobrescribir el bruto a `raw/01-feed-3-nodos-screen.mp4`.
2. Añadir cámara o voz separada con los nombres definidos en `BRIEF.md`, si existen.
3. Ejecutar `npm run inspect-input`.
4. Crear transcripción y cutplan medidos; actualizar `project-status.json` solo después de implementar y validar la composición.
5. Ejecutar `npm run check` y luego `npm run render`.

`npm run render` está protegido: falla mientras `renderAllowed` sea `false`,
si falta la captura real o si ya existe la salida final.

## Archivos de decisión

- `BRIEF.md` — objetivo, formato y restricciones.
- `STORYBOARD.md` — beats que deben existir en el primer corte.
- `frame.md` — dirección visual y de movimiento.
- `EDIT_PLAN.md` — flujo operativo y QA.
- `project-status.json` — bloqueo y rutas canónicas.

Fuente de guion:
`../../../hermes-content/docs/historial/cola/marca-personal-sep/GUIONES-DIA-2026-09-21.md`.
