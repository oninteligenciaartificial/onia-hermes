# OnIA — Espec del logo recibido (2026-07-26)
> 🔴 **HISTÓRICO desde 2026-09-07.** Describe la recreación provisional del logo con el
> verde viejo `#3EA639`, que ya no es el de la marca. Los assets que menciona están
> archivados en `public/brand/_v1/`. Vigente: `ONIA_MARCA.md` + `ONIA_MARCA_ESTRATEGIA_20260727.md`.


> Logo entregado por Sergio (raster, fondo blanco). Recreación vectorial provisional en
> `web-factory/apps/onia-platform/public/brand/onia-logo.svg` — reemplazar cuando exista el vector original.
>
> **ESTADO: v1 ENTREGADA (2026-07-26).** Sergio eligió el **candidato C** ("cursor") como
> logo v1 — ver §"v1 entregada" al final. Los assets finales viven en
> `web-factory/apps/onia-platform/public/brand/` y ya están integrados a la web.

## Anatomía

- Wordmark **"OnIA"**: "On" en **negro** + "IA" en **verde** — la lectura de marca es *"la IA encendida"*
  (coincide 1:1 con el concepto de producto: módulos que se encienden; verde = activo).
- Tipografía: sans **pesada e itálica** (estilo Arial Black / Archivo Black oblicua), tracking apretado.
- **Subrayado verde** a lo ancho del wordmark (refuerza el "on", como una barra de estado encendida).

## Colores medidos (aprox del raster)

| Uso | Hex aprox | Nota |
|---|---|---|
| Negro del "On" | `#111111` | casi negro puro |
| Verde del "IA" + subrayado | `#3EA639` | verde "go", medio, ni neón ni oscuro |

→ El **verde de la identidad web debe calibrarse a ESTE verde** (convertir a oklch y derivar la escala
light/dark desde acá). El doc de identidad (`hermes-content/docs/historial/web-factory/ONIA_BRAND_2026.md`) debe reconciliarse con este valor.

## Variantes necesarias (pendientes)

1. **Dark mode:** "On" en blanco + "IA" verde (mismo verde o un paso más claro para AA sobre negro).
2. **Isotipo/favicon:** propuesta natural = la **"O" con el subrayado verde** o el par "IA" verde solo.
3. **Minimalista "agencia seria"** (Sergio abierto a rediseño): explorar versión sin itálica
   (recta, mismo peso) y monocroma — presentar 2-3 variantes SVG para que elija. Sin gasto: SVG/CSS.

## Reglas de uso inmediatas

- Sobre blanco o negro únicamente (no sobre fotos ni fondos verdes).
- El verde del logo es EL verde semántico del sistema — no introducir otros verdes.
  *(Superseded por `ONIA_BRAND_IDENTITY_2026.md` §1.4: el verde del logo `#3EA639` vive
  autocontenido DENTRO del logo; el verde de UI es la escala esmeralda.)*
- No estirar, no sombras, no contornos.

---

## v1 entregada (2026-07-26) — candidato C "cursor"

Sergio eligió el **candidato C**: minúscula geométrica monolínea "onia" + **bloque verde a
nivel de línea base tras la "a"** — cursor de terminal, "el sistema está encendido y espera
tu orden". Dibujado a mano en SVG (trazos de 16 sobre retícula de 116, viewBox ajustado al
arte), verde propio del logo **`#3EA639`** en claro y oscuro (autocontenido, no token de UI;
sobre tinta `#0C110F` rinde 6.1:1 — AA componente).

### Assets finales (`web-factory/apps/onia-platform/public/brand/`)

| Archivo | Rol |
|---|---|
| `logo.svg` | Lockup completo (viewBox `0 0 352 116`). Tinta auto-adapta vía `prefers-color-scheme`; verde fijo. |
| `logo-dark.svg` | Colores fijos para fondo negro (docs/exports donde el media query no aplica). |
| `wordmark.svg` | Solo letras, monocromo (viewBox `0 0 312 116`) — variante silenciosa. |
| `isotype.svg` | Símbolo: la "o" + cursor verde adentro (mismos dos primitivos del lockup). |
| `favicon.svg` | Baldosa tinta rx14 + isotipo. Colores fijos: lee en pestañas claras y oscuras. |
| `favicon-32.png` | Export raster 32×32 del favicon. |
| `apple-touch-icon-180.png` | 180×180 full-bleed (sin esquinas: iOS aplica su máscara). |
| `preview.html` | Muestra standalone: todas las variantes sobre claro/oscuro, tamaños 16/32/64, negativo. |

### Integración a la web (contrato de swap cumplido)

- Header/footer: `src/components/brand-wordmark.tsx` = mismo arte que `logo.svg`, inlineado
  con `currentColor` para seguir el toggle manual `data-theme` (por eso no es `<img>`);
  el cursor verde va en `brand-wordmark.module.css` (`.cursor`, `#3EA639` fijo).
- Favicon: `src/app/icon.svg` (= `favicon.svg`) + `src/app/apple-icon.png` (= export 180) —
  Next los inyecta al metadata por file convention.
- Los candidatos A/B (`wordmark-a/b/c.svg`) y `onia-logo.svg` (recreación del raster itálico
  recibido) quedan de archivo histórico.

### Cómo regenerar los exports PNG

`sharp` no es dependencia del app — instalar efímero, sin global:

```bash
cd web-factory/apps/onia-platform
npm install --no-save sharp
node scripts/generate-brand-icons.mjs
```

Genera `favicon-32.png`, `apple-touch-icon-180.png` y copia `src/app/apple-icon.png` a
partir de `public/brand/favicon.svg` (fuente de verdad del ícono).

---

## Candidato D — "la ia encendida" (ESTADO: propuesta, 2026-07-26)

Propuesta PARALELA al v1 (no lo reemplaza; nada de la web cambia). Concepto en 3 líneas:

1. **"onia" en bloques sólidos pesados** (sello/estampa, no monolínea): la otra personalidad
   de la misma alma — v1 es línea liviana y técnica, D es masa y presencia.
2. **Dos tonos con significado: "on" en tinta + "ia" en verde `#3EA639`** — la ia es la parte
   encendida del sistema. Retoma el ADN del logo ORIGINAL de Sergio (On negro + IA verde)
   que el v1 había dejado de lado, reinterpretado en la minúscula geométrica minimal.
3. **Isotipo: la "i" verde dentro de la "o"** — anillo + barra vertical = el símbolo de
   encendido (⏻). "Encendé tu negocio" hecho marca.

| Archivo (`public/brand/`) | Rol |
|---|---|
| `candidato-d.svg` | Lockup (viewBox `0 0 318 116`). Tinta auto-adapta vía `prefers-color-scheme`; verde fijo. |
| `candidato-d-dark.svg` | Colores fijos para fondo negro. |
| `candidato-d-isotype.svg` | Símbolo: anillo + barra verde = botón de encendido. |
| `compare.html` | ~~Comparativa v1 vs D~~ → repurposada como "elegir isotipo" E/F/G (ver abajo). |

Si Sergio lo elige: swap por contrato §4.1 (renombrar a `logo.svg`/`logo-dark.svg`/
`isotype.svg`, rehacer favicon desde el isotipo D, actualizar `brand-wordmark.tsx` con el
mismo arte inlineado). Si no, queda de archivo como los candidatos A/B.

**Feedback Sergio (2026-07-26): candidato D descartado.** El wordmark v1 (monolínea) le
gustó y NO SE TOCA; lo que no le gusta es el isotipo con metáfora de encendido/apagado
(la "i" en la "o" de D, y el cursor-en-anillo del v1 cuando va solo). **PROHIBIDA toda
metáfora power/on-off en isotipos.** Los archivos D quedan de histórico.

---

## Candidatos E / F / G — isotipos abstractos (ESTADO: propuesta, 2026-07-26)

Tres símbolos abstractos "de agencia seria" para acompañar el wordmark v1 aprobado.
Ejecutan las 3 direcciones recomendadas del research de isotipo (principios: una sola
idea geométrica, monocromo primero, test de 16px como gate, tensión controlada, cero
clichés power/sparkle/hexágono). Verde `#3EA639` como acento, nunca como muleta: los
tres pasan el gate de monocromo (tinta pura) y de 16px verificado con render raster.

| Candidato | Concepto (2 líneas) |
|---|---|
| **E — "canal"** | Superelipse sólida (squircle n≈4) partida por un canal diagonal de ancho constante a 24°: la plataforma sólida atravesada por el flujo que la automatiza. Masa + vacío (familia Ramp/Stripe); a 16px es lo más legible que existe. |
| **F — "campo modular"** | Tres cuadrados en tinta + un círculo verde desplazado en diagonal fuera del grid 2×2: los módulos (ERPs) y la inteligencia de naturaleza distinta que se mueve sola. La anomalía única es la firma; en mono el círculo se distingue por silueta. |
| **G — "órbita"** | Dos arcos concéntricos de RADIOS DISTINTOS que se persiguen (barridos 210°, desfasados 180°, cortes butt): orquestación en movimiento continuo, 24/7. Dos radios y cero barras = imposible leerlo como botón de encendido. |

### Archivos (`public/brand/`)

| Archivo | Rol |
|---|---|
| `isotipo-e.svg` | E "canal" — masa verde `#3EA639` autocontenida (funciona igual sobre claro y oscuro). |
| `isotipo-f.svg` | F "campo modular" — tinta auto-adapta vía `prefers-color-scheme`, círculo verde fijo. |
| `isotipo-g.svg` | G "órbita" — arco exterior tinta auto-adapta (sw 12), interior verde fijo (sw 11.5, corrección óptica: las curvas cerradas pesan más). |
| `favicon-e.svg` | Baldosa de prueba E: verde full-bleed partida por el canal sobre base tinta. |
| `favicon-f.svg` | Baldosa de prueba F: baldosa tinta + campo modular (cuadrados papel, círculo verde). |
| `favicon-g.svg` | Baldosa de prueba G: baldosa tinta + órbita (arco papel + arco verde). |
| `compare.html` | "Elegir isotipo": wordmark v1 fijo arriba + E/F/G en claro/oscuro/mono/negativo/16-32-64/favicon/lockup completo. Sin botón de encendido. |

Si Sergio elige uno: swap por contrato §4.1 (pasa a `isotype.svg`, rehacer `favicon.svg`
y exports PNG desde la baldosa candidata, sumar el símbolo al lockup si se decide). Los
que no queden van a histórico como A/B/D.
