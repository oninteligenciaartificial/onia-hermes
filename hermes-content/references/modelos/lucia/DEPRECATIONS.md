# Deprecaciones de identidad y generación de Lucía

Vigente desde 2026-09-22. Este índice evita que Codex o Claude rescaten una receta histórica como
si fuera la política actual.

> ## 🔴 2026-09-29 — La cara de Lucía se CONSERVA; lo demás se retira
>
> ⚠️ **Corregido el mismo 2026-09-29: acá decía que TODA la identidad anterior quedaba retirada,
> incluida la cara de Lucía, porque «venía de una persona real». Era falso.** Sergio Urcullo, que
> la creó: *«NO ES CARA REAL, LA PRIMERA LUCÍA LA HICE 100% IA»*. El video fuente
> (`hf_20260615_…mp4`) es una salida de Higgsfield; «frame REAL» quería decir «cuadro sin
> regenerar». **El peligro de dejarlo:** se borraba la mejor versión de Lucía y se gastaba en una
> cara nueva que él no quiere (ya se gastaron 23 créditos así).
>
> **Se CONSERVAN (fuente de v4, no borrar):** `lucia-skin-v1` (`58bbd635…`, 7 ángulos),
> `lucia-surgical-anchor` (`902eeebb…`), `lucia-face-real-anchor` (`ced20cc2…`, historia), el
> photoshoot de 10 ángulos (`references/models/lucia-surgical-shoot-20260707/`), outfits y lugares.
> **Se retiran:** los Souls de Lucía `36305a9b…` (piel roja) y `e6d8703c…` (derivó), Mara,
> Modelo 2, los **cinco Souls de Sergio Urcullo** (`1238064e…`, `05cebe09…`, `bce5feb0…`,
> `aeaa74af…`, `a5f9ee23…`), los ZZ-TEST y los productos. Alcance exacto:
> `LUCIA-HIGGSFIELD-IDENTITY.json` → `deletion_scope_2026_09_29`. Inventario completo:
> `hermes-content/docs/historial/HIGGSFIELD_INVENTARIO_ANTES_DEL_BORRADO_20260929.md`.
>
> Higgsfield no permite borrar por MCP ni por CLI (verificado): lo hace Sergio Urcullo en la web.
> **Se elige por ID**, nunca por nombre.
>
> ⚠️ `scripts/video_lab.py` (`SERGIO_AVATAR_REFERENCE_PACK`) todavía lista el Soul
> `1238064e…` como aprobado. Es un gate de otro carril (video-lab / marca personal): no se tocó.
> Cuando exista un Soul nuevo de Sergio Urcullo, ese carril actualiza el pack.

| Fuente/afirmación histórica | Estado | Reemplazo |
|---|---|---|
| IDs de Soul/Element anteriores al 2026-09-29 **salvo las fuentes de Lucía** | **Retirado** (borrado manual pendiente en la web) | `lucia_original_sources_keep` + IDs `LUCIA-V4-*` del manifest |
| «Pedirle a Higgsfield autorización escrita antes de entrenar» (plan v4 del 23-sep) | Superado por decisión de Sergio Urcullo (2026-09-29): se entrena siguiendo la guía oficial | `training_rights_gate` en el manifest |
| `soul_cast` como motor de casting | Descartado: ignora el prompt e inventa un personaje propio | `soul_2` / `nano_banana_pro` / `gpt_image_2_5` con prompt de casting |
| «La cara de Lucía viene de una persona real sin consentimiento» (manifest 22-sep, `LUCIA.md` §9) | **FALSO** — Sergio Urcullo la hizo 100% con IA; el video fuente es `hf_…mp4` de Higgsfield | `rights_gate.correction_2026_09_29` del manifest |
| `<<<element_id>>>` como forma de pasar los 7 ángulos de `lucia-skin-v1` | Insuficiente por MCP: el job registra **solo la primera** foto del Element (medido 2026-09-29) | pasar las 7 `media_ids` explícitas en `medias` con rol `image_references` |
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
