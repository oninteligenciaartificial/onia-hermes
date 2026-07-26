# OnIA — Espec del logo recibido (2026-07-26)

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
light/dark desde acá). El doc de identidad (`ONIA_BRAND_2026.md`) debe reconciliarse con este valor.

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
| `compare.html` | Comparativa lado a lado v1 vs D: claro/oscuro, isotipos 16/32/64, negativo mono. |

Si Sergio lo elige: swap por contrato §4.1 (renombrar a `logo.svg`/`logo-dark.svg`/
`isotype.svg`, rehacer favicon desde el isotipo D, actualizar `brand-wordmark.tsx` con el
mismo arte inlineado). Si no, queda de archivo como los candidatos A/B.
