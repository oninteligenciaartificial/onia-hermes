# ONIA — Sistema de Carruseles para Instagram

Automatiza carruseles para 3 cuentas: **ONIA** (empresa), **Arthur** y **Sergio**
(personales, con foto propia). Genera copy con las 5 reglas, renderiza slides
con la marca ONIA, y publica vía `ig-publish` en el VPS.

## Piezas

| Pieza | Archivo | Qué hace |
|-------|---------|----------|
| Marca | [`../brand/`](../brand/) | Logo, paleta, tipografía, tokens. Fuente de verdad visual. |
| Generador | [`../../scripts/carousel_generator.py`](../../scripts/carousel_generator.py) | topic → brief JSON con las 5 reglas + roles + comment_trigger. |
| Render | [`../../scripts/carousel_render.js`](../../scripts/carousel_render.js) | brief JSON → PNG 1080×1350 por slide, con la marca. |
| Pipeline | [`../../scripts/carousel_pipeline.js`](../../scripts/carousel_pipeline.js) | generate → render → (upload → publish). Dry-run por defecto. |

## Uso

```powershell
# Genera + renderiza (NO publica). Revisás los PNG primero.
$env:OPENAI_API_KEY="sk-..."
npm run carousel -- --topic "3 procesos que ya no deberías hacer a mano" --account onia --slides 6

# Cuenta personal con foto propia de fondo en portada/CTA:
npm run carousel -- --topic "Lo que aprendí automatizando ventas" --account sergio --bg "tmp-assets/higgsfield/sergio_avatar_front_clean_9x16.png"

# Publicar (sube PNGs al asset host y postea en el VPS):
npm run carousel -- --topic "..." --account onia --publish
```

Solo render desde un brief existente:
```powershell
npm run carousel:render -- --brief hermes-content/carousels/briefs/onia-xxx.json --out hermes-content/carousels/out/onia-xxx --account onia
```

Briefs se guardan en `briefs/`, slides en `out/<account>-<slug>-<stamp>/`.

## Packs visuales (`--pack`)

| Pack | Look | Uso |
|------|------|-----|
| `typographic` (default) | tipográfico, off-white/ink, Space Grotesk | rápido, sin assets |
| `dark-product` | negro+verde, Archivo Black, **curva verde continua entre slides**, pills/badges, callout-cards, slot de objeto 3D (`--object`) | feed premium estilo Solaris. **El recomendado para ONIA.** |
| `editorial-photo` | foto a sangre + scrim + grano, Archivo Black con acento *serif italic* (Fraunces) verde, pill caption | cuentas personales (Sergio/Arthur) con foto propia (`--bg`). Estilo Mobile Editing Club / Asterisk. |

Objeto 3D de ejemplo ya generado (Higgsfield): `../assets/onia/automation-node-3d.png`.

```powershell
# Pack dark-product, con objeto 3D opcional de fondo:
npm run carousel -- --topic "..." --account onia --pack dark-product --object hermes-content/assets/dashboard-3d.png
```

Markup en el copy: una palabra entre `*asteriscos*` se resalta en verde
(`*captar*` → verde). Campos por slide: `pill` (etiqueta categoría), `callout`
(nota flotante opcional). El generador los emite automáticamente. La curva verde
entra por la izquierda y sale por la derecha (peek/swipe), salvo primera/última.

Más packs propuestos (editorial-photo, swiss-type, proof-ui) y extracción de
referencias: `../references/style-references-batch-2026-06-16.json`. Generación
de imágenes/objetos: `ASSET_GENERATION_OPTIONS.md`.

## Las 5 reglas (cómo están codificadas)

| Regla | Dónde vive | Implementación |
|-------|-----------|----------------|
| 1. Portada frena scroll, no explica | generator `CAROUSEL_RULES` + render `role=cover` | fondo ink, hook ≥118px, sin contexto, kicker + cue de swipe |
| 2. Slide 2 confirma hook / sube lo que está en juego | `role=stakes` | problema + stakes, alto contraste |
| 3. Cada slide = screenshot suelto, 1 idea, máx 2 fuentes | `role=point` + `tokens.css` | una idea, Space Grotesk + Inter, numeración `01/07` |
| 4. Slide guardable | `role=save`, `save_worthy=true` | tarjeta FRAMEWORK + barra "Guardá esto ↗" |
| 5. Caption = 2º post, CTA con comment trigger | `caption` + `comment_trigger` + `role=cta` | caption repite idea + trigger; CTA sin "sígueme para más" |

## Cuentas

- **onia**: voz de marca, sin foto (diseño tipográfico ONIA).
- **arthur / sergio**: mismo motor, voz de fundador en primera persona, foto propia
  de fondo (`--bg`) con scrim oscuro para legibilidad.

## Publicación: credenciales por cuenta (pendiente para personales)

`ig-publish` corre en el VPS y usa, por cuenta, env con sufijo; si falta, cae al
default (ONIA, ya configurado):

```
IG_BUSINESS_ACCOUNT_ID_ONIA   / META_LONG_LIVED_TOKEN_ONIA      (ya existe como default)
IG_BUSINESS_ACCOUNT_ID_ARTHUR / META_LONG_LIVED_TOKEN_ARTHUR    (pendiente: setup Meta de Arthur)
IG_BUSINESS_ACCOUNT_ID_SERGIO / META_LONG_LIVED_TOKEN_SERGIO    (pendiente: setup Meta de Sergio)
```

Agregar esas vars a `/root/.hermes/.env` cuando Arthur y Sergio conecten sus
cuentas IG Business a una página de Facebook (mismo flujo que ONIA en
`ONIA_INSTAGRAM_PUBLISHING.md`). Hasta entonces, `--publish` solo funciona para
`--account onia`; para las personales, genera/renderiza y publica manual.

## Notas

- Render usa Edge/Chrome headless local; descarga Space Grotesk + Inter de Google
  Fonts (necesita internet al renderizar).
- Política de referencias: Pinterest/competencia solo como dirección de estilo;
  nunca copiar textos, imágenes ni claims. Ver `STYLE_REFERENCE_SYSTEM.md`.
