# Deprecaciones de identidad y generación de Lucía

Vigente desde 2026-09-22. Este índice evita que Codex o Claude rescaten una receta histórica como
si fuera la política actual.

| Fuente/afirmación histórica | Estado | Reemplazo |
|---|---|---|
| `TECNICA-HIGGSFIELD.md`: “solo navegador” | Superada por hallazgos posteriores del mismo archivo | `HIGGSFIELD_VIDEO_SYSTEM.md` + bloque vigente al inicio de la técnica |
| `BANCO-OFICIAL.md`: “no se genera con Soul” | Válida solo para los Souls actuales | Estrategia de dos carriles en `LUCIA-HIGGSFIELD-IDENTITY.json` |
| `LUCIA.md`: `58bbd635…` ganó el test del 13-ago | Falso: ese Element todavía no existía | Baseline vigente con A/B pendiente frente a `902eeebb…` |
| Soul `36305a9b…` | Prohibido | No reutilizar ni reentrenar |
| Soul sintético v3 `e6d8703c…` | Rechazado como principal | Nuevo candidato solo con dataset limpio y prueba controlada |
| Marketing Studio v2 marcado “USAR ESTE” | Superado | Avatar separado v4 `a1e334f3…`, aún requiere revalidación |
| `scripts/carousel_gate.js` y `scripts/lucia_banco.json` como gate en `main` | No existen en `main`; viven en una rama divergente | Rehacer desde el manifest, no fusionar a ciegas |
| Costos fijos del `video-factory` | Históricos/no autorizan gasto | Schema y `higgsfield generate cost` vivos; cap explícito si no existe dry-run |
| Alias `hf` | Ambiguo en Windows: corresponde a Hugging Face | Usar siempre `higgsfield` |

Orden de autoridad:

1. `LUCIA-HIGGSFIELD-IDENTITY.json` para IDs, derechos y gates.
2. `BANCO-OFICIAL.md` para archivos permitidos/rechazados.
3. `LUCIA.md` para personaje, voz y estética.
4. `TECNICA-HIGGSFIELD.md` como runbook actual + bitácora histórica.
5. Bitácoras y experimentos solo como evidencia; nunca como orden vigente.
