# DESIGN.md de cliente — el contrato visual como vista generada

> **La decisión en tres líneas.** El DESIGN.md de un cliente entregado es una **VISTA
> legible generada desde la anatomía medida** (`extract_web_anatomy.mjs`), nunca una
> tercera fuente que se edita a mano y se desincroniza. Cambió el sitio → se re-mide y
> se re-emite. Si el DESIGN.md contradice la medición, gana la medición.

## Qué es y qué NO es

Es el patrón DESIGN.md (repo público `YakAgent/awesome-design-md`): un markdown por
marca con tokens, patrones y reglas que un agente usa como contrato visual — *"construí
una página que se vea así"*. La diferencia con el patrón público: acá el archivo **no se
escribe, se emite** desde datos medidos, porque escribir un doc al lado del sistema de
medición es el error más caro (dos formatos describiendo lo mismo que divergen solos).

No confundir con las otras dos piezas de la familia:

| Pieza | Momento | Fuente | Archivo |
|---|---|---|---|
| **Receta de auto-design** | ANTES de construir | intake + referencias + galería | `data/clients/<slug>.design.md` (la escribe `design/auto-designer.ts`) |
| **Learned model** | referencia ajena adquirida | reel/URL de un tercero | `data/references/reels/models/<id>.json` |
| **DESIGN.md de cliente** | DESPUÉS de entregar | anatomía medida del sitio propio | `data/clients/<slug>.design.md` (la emite `emit_design_md.mjs`) |

El mismo slot `<slug>.design.md` responde siempre la misma pregunta — *"¿cómo se ve la
web de este cliente?"* — primero como intención (receta) y, cuando el sitio existe, como
medición (contrato). El generador **se niega a pisar** un archivo que no tenga el
marcador `design-md v1` (o sea, una receta) salvo `--force`: el paso de receta →
contrato medido es una decisión, no un accidente. Ninguna herramienta parsea el
contenido de `.design.md` (solo se copia como artefacto), así que la convivencia es
segura.

## Cómo se genera

```bash
# 1. Medir el sitio real (levantar el build local del cliente si no hay URL viva)
node harvester/vision/extract_web_anatomy.mjs --url http://localhost:4519 --slug bolivian-electric

# 2. Emitir el contrato desde lo medido
node harvester/vision/emit_design_md.mjs --slug bolivian-electric \
  --direccion "…capa 1, la única que se juzga mirando…" \
  --nota "dónde viven los tokens declarados del cliente"
```

- Entrada: `data/references/design-sources/anatomia/<slug>.json` (las 15 capas de
  [ANATOMIA_DE_UNA_WEB.md](ANATOMIA_DE_UNA_WEB.md)).
- Salida: `data/clients/<slug>.design.md` (o `--out` para dejar una copia junto al repo
  del cliente; la canónica es la de `data/clients/`, porque ahí viven los datos de
  cliente y ahí la encuentran las herramientas de la fábrica).
- `--direccion` es la capa 1 (dirección visual): el script no la infiere, se juzga
  mirando. Sin ella el archivo lo declara pendiente en vez de inventarla.
- `--nota` enlaza la fuente declarada del cliente (p.ej. su `design-system/MASTER.md`)
  sin duplicarla: los tokens declarados viven en el repo del cliente; el DESIGN.md
  carga lo MEDIDO.

## Qué contiene (todo medido, con rol sugerido)

Paleta con roles por frecuencia y croma · tipografía (familias, escalones
tamaño/interlineado/tracking/peso, leyes del display, tratamiento de botón) · ritmo y
espaciado (censo de unidades em/rem/px/clamp, escala repetida, breakpoints reales) ·
radios/sombras/z-index · movimiento (transiciones con easing y frecuencia, duración
máxima, `transition:all`, reduced-motion ejecutado) · gramática de secciones en orden
con ritmo claro/oscuro · conversión (CTAs, formularios) · presupuesto (el peso medido
es el techo) · contrastes con veredicto AA · y una sección honesta de **qué NO dice**
(intención, calidad de copy, lo que hay detrás de interacciones).

## Prueba que valida el formato (2026-08-20, Bolivian Electric)

Con `data/clients/bolivian-electric.design.md` como **único** contexto de estilo se
construyó una sección que no existe en el sitio ("Alquiler de equipos de medición") y
se comparó lado a lado contra el sitio real (`.tmp/design-md-prueba/lado-a-lado-*.png`):
misma paleta, mismo display 56px/lh 0.98/peso 500, mismas etiquetas en mayúsculas con
tracking, cero radios, banda oscura con CTA ámbar sobre navy. La primera iteración
falló en los botones (salieron en caja baja): el escalón `12px / ls 0.48 / w700` estaba
medido pero el formato no lo señalaba como tratamiento de control → se corrigió el
**generador** (heurística etiqueta/botón), no el archivo a mano. Así se itera este
formato: si la página generada no se parece, el bug está en el emisor.

Lo que el formato todavía no captura (asumido, no oculto): textura de fondo (la grilla
sutil del navy), iconografía puntual y micro-detalles decorativos — es la parte de
"requiere ojo humano" que la anatomía declara. Para clonar esos detalles se mira una
captura; para todo lo demás alcanza el contrato.
