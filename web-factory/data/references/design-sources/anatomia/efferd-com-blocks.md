# Anatomia medida — https://efferd.com/blocks

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-19.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 1.6 pantallas en escritorio · 2.3 en movil
- **Secciones**: 4
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 24 (1 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 1.6 | Explore beautiful shadcn blocks | Efferd | 24 |
| 1 | 1.3 | Explore beautiful shadcn blocks | Auth14 blocks | 9 |
| 2 | 1.3 | Explore beautiful shadcn blocks | Auth14 blocks | 9 |
| 3 | 0.3 | - | - | 11 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 16px / lh 1.50 / ls normal / w 400 | 67 |
| 12px / lh 1.33 / ls normal / w 400 | 22 |
| 16px / lh 1.50 / ls normal / w 500 | 19 |
| 14px / lh 1.43 / ls normal / w 400 | 9 |
| 12px / lh 1.33 / ls normal / w 500 | 5 |
| 13px / lh 1.50 / ls normal / w 500 | 2 |
| 14px / lh 1.43 / ls 0.35px / w 500 | 2 |
| 12px / lh 1.33 / ls 0.3px / w 400 | 2 |
| 36px / lh 1.11 / ls normal / w 700 | 1 |
| 48px / lh 1.00 / ls normal / w 800 | 1 |

**Familias**: Geist (108) · Outfit (22) · Geist Mono (1)

**Espaciado** (los que de verdad se repiten): 4px×43 · 8px×41 · 1px×30 · 16px×25 · 6px×25 · 20px×12 · 10px×9 · 24px×7 · 2px×7 · 12px×6

**Radios**: 9 valores distintos ⚠️ tantos radios distintos = no hay sistema · **Sombras**: 1 distintas

**Unidad del ritmo**: 11 `em` · 263 `rem` · 2605 `px` · 0 `clamp()` · 14 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 640px · 768px · 1024px · 1280px · 1536px

## 3. Movimiento

- **Transiciones distintas**: 2 · **@keyframes declarados**: 10
- **`transition: all`**: 0 veces
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 2 elementos siguen animando, 9 con transicion > 50ms
- **Movimiento atado al scroll**: no — anima al entrar, no al dedo del scroll

Transiciones mas usadas:
- `0.15s cubic-bezier(0.4, 0, 0.2, 1)` (7)
- `0.5s` (2)

## 4. Scroll

- **Pegados** (sticky/fixed): 0

- **Nav fija al scrollear**: no

## 5. Conversion

- **CTAs distintos**: 29 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "Blocks" ×2 · "Pricing" ×2 · "Docs" ×2 · "Changelog" ×2


## 6. Rendimiento

- **Peso total**: 5961.8 KB en 237 pedidos
- **Por tipo**: document 192.3 KB · script 3840.5 KB · font 404.9 KB · stylesheet 1494 KB · image 17.6 KB · fetch 12.5 KB
- **Terceros**: 5 hosts · cdn.affonso.io, connect.facebook.net, github.com, avatars.githubusercontent.com
- **Fuentes cargadas**: 20 (Geist 100 900 normal · Geist Fallback normal normal · Geist Mono 400 normal · Geist Mono Fallback normal normal · Geist Mono 100 900 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 3840.5 KB · CSS 1494 KB**.

## 7. Accesibilidad

- **Imagenes**: 1 · sin `alt`: 0 · sin dimensiones: 0 · lazy: 0 · con `srcset`: 0
- **Objetivos tactiles < 44px**: 20 de 38 interactivos
- **Idioma**: en · **Landmarks**: {"header":1,"nav":0,"main":1,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - lab(1.5609 0 0) sobre lab(98.26 0 0) → **19.41:1**
  - lab(1.5609 0 0) sobre lab(88.4 0 0.0000119209) → **15.06:1**
  - lab(1.5609 0 0) sobre lab(100 0 0) → **20.26:1**
  - lab(48.496 0 0) sobre lab(98.26 0 0) → **4.54:1**
  - lab(48.496 0 0) sobre lab(88.4 0 0.0000119209) → **3.52:1** ⚠️ bajo el minimo AA para texto normal
  - lab(48.496 0 0) sobre lab(100 0 0) → **4.74:1**
  - _(9 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Beautiful Shadcn Blocks - Efferd
- description: 110 caracteres
- canonical: https://efferd.com/blocks · OG: 3 · datos estructurados: 0

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
