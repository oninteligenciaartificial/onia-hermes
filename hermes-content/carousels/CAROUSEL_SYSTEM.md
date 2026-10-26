# ONIA — Sistema de Carruseles para Instagram

Automatiza carruseles para 3 cuentas: **ONIA** (empresa), **Arthur** y **Sergio**
(personales, con foto propia). Genera copy con las 5 reglas, renderiza slides
con la marca ONIA, y publica vía `ig-publish` en el VPS.

## Reglas de maquetación (OBLIGATORIAS)

1. **Sin numeración de slide.** No mostrar "01/05" ni contadores. (Aplicado en
   `bright-retail`; el resto de packs lo siguen al editarse.)
2. **El título de marca siempre va.** El nombre de la cuenta/marca (ej. "Nuvia")
   en el top de cada slide nunca se quita.
3. **Imágenes consistentes.** Los productos/objetos se renderizan con alto fijo
   (no estiran, no cambian de escala entre slides) y centrados; el tamaño se
   adapta al espacio del slide (headline largo → imagen algo menor) sin perder
   proporción. Cutouts con fondo transparente.
4. **Gate de COPY — el dolor exacto, y que termine en plata.** Si el estático no
   nombra el dolor EXACTO del rubro —con la palabra que usa el dueño (fiado,
   silla vacía, contenedor, paquete de sesiones, control anual, presupuesto)— y
   ese dolor no termina en plata, **no sale**. Tres chequeos de diez segundos:
   - **Prueba del reemplazo:** si le cambiás el rubro a la placa y el texto sigue
     funcionando igual, el dolor no era del rubro. No sale.
   - **Prueba de la plata:** cada dolor tiene que terminar en algo que se cobra,
     se pierde o se deja de ganar.
   - **Prueba del agente:** si nombra un agente, tiene que existir en el producto.
     Hoy existen **Recall** y **Cobrador** (`onia-platform/lib/onia-core/modules/agents-runtime.ts`
     → `AGENT_KINDS`). **Captador** está gateado por `addon.inmobiliaria` y no se
     vende en los seis rubros. Sin agente, la placa dice lo que hay.

   Origen y las 6 placas aplicadas: [`../docs/historial/ONIA_KIT_VENTA_POR_RUBRO_20260815.md`](../docs/historial/ONIA_KIT_VENTA_POR_RUBRO_20260815.md).
5. **Gate anti-plantilla — cada slide debe demostrar algo distinto.** Un carrusel
   no es una colección de afiches con el mismo fondo. Para pauta, la secuencia debe
   incluir contexto humano y producto real, y cada interior debe usar una evidencia
   propia (UI, flujo, tabla, contrato o decisión). Si sólo cambia el titular, no sale.

## Formatos de salida (`--format`)

| Formato | Tamaño | Para qué |
|---|---|---|
| `feed` (default) | 1080×1350 | carrusel de feed 4:5 |
| `square` | 1080×1080 | feed cuadrado |
| `story` | 1080×1920 | historia |

`story` **no es el feed más alto**: aplica una zona segura (300px arriba, 380px
abajo) porque Instagram tapa esas bandas con su UI. Sin eso el texto queda debajo
de los controles.

## Itemizado (`lines[]`)

Un slide con rol `cta` puede llevar `lines: [{k, v}]` y se renderiza como recibo
con guía punteada. **Cuando hay `lines[]` el ticket del trueque no se dibuja** —
el itemizado ya cumple esa función y los dos juntos desbordan la slide. El botón
`Comentá <PALABRA>` se mantiene en los dos casos. Ejemplo: `briefs/onia-recibo.json`.

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

## Correr en el VPS headless (Linux, como root) — 2026-09-02

El render usa Chromium headless. En el VPS estaba **roto de dos maneras** y no rendía ningún
pack (se descubrió al hacer D01). Ya arreglado en `scripts/carousel_render.js`; queda anotado
para no volver a pisarlo:

1. **Packs ausentes rompían TODO.** `carousel_render.js` hacía `require()` eager de cuatro
   módulos de pack (`_empleado`, `_dato`, `_papel`, `_solido`), pero **sólo `carousel_pack_solido.js`
   está commiteado** — los otros tres nunca existieron en git. El require eager tiraba
   `MODULE_NOT_FOUND` al cargar el script, aun pidiendo `bloque-solido`. **Fix:** los tres
   ausentes se cargan **perezoso** (`lazyPack`), así sólo fallan si se los selecciona. `bloque-solido`
   rinde normal.
2. **Chromium como root necesita `--no-sandbox`.** Sin ese flag el navegador no arranca y el
   screenshot nunca se escribe (el CLI devolvía `Command failed` sin PNG). **Fix:** el flag ya va
   en la invocación. El Chromium de Playwright del VPS
   (`/root/.cache/ms-playwright/chromium-1223/chrome-linux64/chrome`) se **autodescubre**; si no,
   se pisa con `CAROUSEL_BROWSER=<ruta>`.

Comando exacto que rinde en el VPS (verificado en D01, 1080×1350, 90 KB, mirado):
```bash
node scripts/carousel_render.js \
  --brief hermes-content/carousels/briefs/ads/ad-a4-ocho-de-la-noche.json \
  --pack bloque-solido --account onia \
  --out hermes-content/carousels/out/D01-ad-a4-8pm
```
⚠️ Los `npm run carousel:*` de abajo son de la PC de Sergio (PowerShell). En el VPS se llama
`node scripts/carousel_render.js` directo.

## Packs visuales (`--pack`)

| Pack | Look | Uso |
|------|------|-----|
| `community-editorial` (default) | portada humana/editorial + interiores claros + diagramas + UI real | ONIA, marca personal, educación y producto. **Default también para pauta.** |
| `dark-product` | negro+verde, Archivo Black, curva continua, pills/badges y slot de objeto 3D (`--object`) | test oscuro deliberado; **no** default para carruseles ONIA. |
| `editorial-photo` | foto a sangre + scrim + grano, Archivo Black con acento *serif italic* (Fraunces) verde, pill caption | compatibilidad histórica; para Sergio usar `community-editorial`. |
| `bright-retail` | claro/multicolor, fondo crema/acento, Inter 900, keyword en color de acento rotativo, pills suaves, logo de marca | marcas retail/amigables (ej. **Nuvia** `@nuvia.bo`). Lee brand kit de `BRANDS` en el render. |

Cuentas: `onia`, `arthur`, `sergio`, `nuvia`. Brand kits no-ONIA en `BRANDS`
(scripts/carousel_render.js): paleta, logo y acentos por marca.

```powershell
# Carrusel Nuvia (marca propia, pack claro):
npm run carousel -- --topic "..." --account nuvia --pack bright-retail
# o render directo desde un brief escrito a mano:
npm run carousel:render -- --brief hermes-content/carousels/briefs/nuvia-presentacion.json --out hermes-content/carousels/out/nuvia --account nuvia --pack bright-retail
```

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

Agregar esas vars a `/root/.hermes/.env` cuando la cuenta conecte su IG Business
a una página de Facebook (mismo flujo que ONIA en `hermes-content/docs/historial/ONIA_INSTAGRAM_PUBLISHING.md`).
Hasta entonces, `--publish` solo funciona para `--account onia`; para las demás,
genera/renderiza y publica manual.

**Cargar credenciales de una cuenta (ej. Nuvia)** — una vez tengas el Page token
e IG id, y acceso SSH válido:
```powershell
$env:VPS_HOST="187.77.16.63"; $env:VPS_USER="root"; $env:VPS_PASSWORD="..."
$env:IG_ACCOUNT="nuvia"
$env:IG_BUSINESS_ACCOUNT_ID="<instagram_business_account.id de Nuvia>"
$env:META_LONG_LIVED_TOKEN="<Page Access Token de Nuvia>"
npm run account:ig
```
Escribe `IG_BUSINESS_ACCOUNT_ID_NUVIA` / `META_LONG_LIVED_TOKEN_NUVIA` en el VPS
(sin imprimir el token). Después: `npm run carousel -- ... --account nuvia --publish`.

## Notas

- Render usa Edge/Chrome headless local; descarga Space Grotesk + Inter de Google
  Fonts (necesita internet al renderizar).
- Política de referencias: Pinterest/competencia solo como dirección de estilo;
  nunca copiar textos, imágenes ni claims. Ver `STYLE_REFERENCE_SYSTEM.md`.
