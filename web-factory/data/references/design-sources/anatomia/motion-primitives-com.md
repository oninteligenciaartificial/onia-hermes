# Anatomia medida — https://motion-primitives.com/

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-19.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 8.4 pantallas en escritorio · 9.1 en movil
- **Secciones**: 2
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 1 (1 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 8.4 | UI kit to make beautiful, animated interfaces, faster. | motion-primitivesbeta | 39 |
| 1 | 8.4 | UI kit to make beautiful, animated interfaces, faster. | Explore Docs | 35 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 16px / lh 1.50 / ls normal / w 400 | 30 |
| 14px / lh 1.43 / ls normal / w 400 | 10 |
| 14px / lh 1.43 / ls normal / w 500 | 4 |
| 10px / lh 1.50 / ls normal / w 500 | 1 |
| 36px / lh 1.11 / ls normal / w 500 | 1 |

**Familias**: __Inter_f367f3 (43) · __GeistMono_c1e5c9 (3)

**Espaciado** (los que de verdad se repiten): 16px×22 · 128px×12 · 80px×5 · 32px×4 · 2px×3 · 6px×3 · 24px×3 · 8px×3 · -1px×2 · 10px×2

**Radios**: 7 valores distintos · **Sombras**: 2 distintas

**Unidad del ritmo**: 86 `em` · 61 `rem` · 239 `px` · 0 `clamp()` · 2 `vw`
→ sistema anclado a `em`: cambia un font-size y reescala la pagina entera en proporcion.

**Breakpoints reales** (de las media queries): 640px · 768px · 1024px · 1280px · 1536px

## 3. Movimiento

- **Transiciones distintas**: 2 · **@keyframes declarados**: 6
- **`transition: all`**: 0 veces
- **prefers-reduced-motion en el CSS**: NO
- **Con la preferencia PUESTA**: 1 elementos siguen animando, 5 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), translate 0.15s cubic-be` (4)
- `color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic` (1)

## 4. Scroll

- **Pegados** (sticky/fixed): 1
  - div.pointer-events-none fixed left-0 top-0 z-50 — fixed, alto 0px, top 0px
- **Nav fija al scrollear**: no

## 5. Conversion

- **CTAs distintos**: 16 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "Explore Docs" ×2 · "GitHubStar on GitHub" ×2 · "motion-primitivesbeta" ×1 · "AI" ×1


## 6. Rendimiento

- **Peso total**: 8773.1 KB en 96 pedidos
- **Por tipo**: document 74.3 KB · stylesheet 102.9 KB · font 104 KB · script 697.2 KB · image 7794.7 KB · fetch 0 KB
- **Terceros**: 5 hosts · images.beta.cosmos.so, i.scdn.co, assets.onedollarstats.com, i.pinimg.com
- **Fuentes cargadas**: 3 (__Inter_f367f3 100 900 normal · __Inter_Fallback_f367f3 normal normal · __GeistMono_c1e5c9 100 900 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 697.2 KB · CSS 102.9 KB**.

## 7. Accesibilidad

- **Imagenes**: 28 · sin `alt`: 0 · sin dimensiones: 28 · lazy: 0 · con `srcset`: 0
- **Objetivos tactiles < 44px**: 18 de 19 interactivos
- **Idioma**: en · **Landmarks**: {"header":1,"nav":2,"main":0,"footer":0}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(9, 9, 11) sobre oklch(0.985 0 0) → **19.06:1**
  - rgb(9, 9, 11) sobre oklch(0.442 0.017 285.786) → **2.58:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(9, 9, 11) sobre rgb(255, 255, 255) → **19.9:1**
  - oklch(0.141 0.005 285.823) sobre oklch(0.985 0 0) → **19.06:1**
  - oklch(0.141 0.005 285.823) sobre oklch(0.442 0.017 285.786) → **2.58:1** ⚠️ bajo el minimo AA para texto normal
  - oklch(0.141 0.005 285.823) sobre rgb(255, 255, 255) → **19.9:1**
  - _(0 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Motion-Primitives - UI kit to make beautiful, animated interfaces, faster.
- description: 134 caracteres
- canonical: NO · OG: 6 · datos estructurados: 0

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
