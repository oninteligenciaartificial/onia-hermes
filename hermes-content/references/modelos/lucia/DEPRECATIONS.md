# Deprecaciones de identidad y generación de Lucía

Vigente desde 2026-09-22. Este índice evita que Codex o Claude rescaten una receta histórica como
si fuera la política actual.

> ## 🔴 2026-09-29 — TODA la identidad anterior queda retirada
>
> Sergio Urcullo: *«borralo nomás… solo las caras lo hacemos de nuevo»*. **Ningún Soul ni Element
> creado antes del 2026-09-29 se usa**, aunque un doc (de cualquier fecha) lo llame «vigente»,
> «canónico», «ancla» o «USAR ESTE». Eso incluye `lucia-skin-v1` (`58bbd635…`), el backup
> `902eeebb…`, el avatar de Marketing Studio `a1e334f3…`, los Souls de Mara, de Modelo 2 y los
> **cinco Souls de Sergio Urcullo** (`1238064e…`, `05cebe09…`, `bce5feb0…`, `aeaa74af…`,
> `a5f9ee23…`). La lista completa con qué era cada uno:
> `hermes-content/docs/historial/HIGGSFIELD_INVENTARIO_ANTES_DEL_BORRADO_20260929.md`.
>
> Solo valen los IDs `LUCIA-V4-*` que registre `LUCIA-HIGGSFIELD-IDENTITY.json`. Higgsfield no
> permite borrar por MCP ni por CLI (verificado): el borrado físico lo hace Sergio Urcullo en la
> web. Mientras tanto, los IDs viejos pueden seguir apareciendo en el selector: **se elige por ID**.
>
> ⚠️ `scripts/video_lab.py` (`SERGIO_AVATAR_REFERENCE_PACK`) todavía lista el Soul
> `1238064e…` como aprobado. Es un gate de otro carril (video-lab / marca personal): no se tocó.
> Cuando exista un Soul nuevo de Sergio Urcullo, ese carril actualiza el pack.

| Fuente/afirmación histórica | Estado | Reemplazo |
|---|---|---|
| Cualquier ID de Soul/Element anterior al 2026-09-29 | **Retirado** (borrado manual pendiente en la web) | IDs `LUCIA-V4-*` del manifest |
| «Pedirle a Higgsfield autorización escrita antes de entrenar» (plan v4 del 23-sep) | Superado por decisión de Sergio Urcullo (2026-09-29): se entrena siguiendo la guía oficial | `training_rights_gate` en el manifest |
| `soul_cast` como motor de casting | Descartado: ignora el prompt e inventa un personaje propio | `soul_2` / `nano_banana_pro` / `gpt_image_2_5` con prompt de casting |
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
2. `BANCO-OFICIAL.md` para archivos permitidos/rechazados (hoy: solo de la cara retirada; v4
   todavía no tiene banco).
3. `LUCIA.md` para personaje, voz y estética.
4. `TECNICA-HIGGSFIELD.md` como runbook actual + bitácora histórica.
5. Bitácoras y experimentos solo como evidencia; nunca como orden vigente.
