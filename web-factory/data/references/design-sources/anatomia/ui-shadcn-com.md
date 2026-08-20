# Anatomia medida — https://ui.shadcn.com/

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-19.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 2.1 pantallas en escritorio · 1.2 en movil
- **Secciones**: 3
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 1 (1 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 2.1 | The Foundation for your Design System | Toggle MenuMenu | 57 |
| 1 | 1.9 | The Foundation for your Design System | New Questionnaire component | 52 |
| 2 | 1.9 | The Foundation for your Design System | New Questionnaire component | 52 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 14px / lh 1.43 / ls normal / w 400 | 57 |
| 14px / lh 1.43 / ls normal / w 500 | 39 |
| 14px / lh 1.38 / ls normal / w 500 | 20 |
| 12px / lh 1.33 / ls normal / w 400 | 14 |
| 12px / lh 1.33 / ls normal / w 500 | 11 |
| 16px / lh 1.50 / ls normal / w 500 | 11 |
| 16px / lh 1.50 / ls normal / w 400 | 10 |
| 14px / lh 1.50 / ls normal / w 400 | 6 |
| 12px / lh 1.33 / ls 0.6px / w 500 | 5 |
| 14px / lh 2.00 / ls normal / w 500 | 3 |

**Familias**: Geist (194)

**Espaciado** (los que de verdad se repiten): 8px×188 · 20px×165 · 12px×100 · 16px×67 · 6px×59 · 10px×46 · 4px×45 · 24px×31 · 14px×26 · -1px×18

**Radios**: 19 valores distintos ⚠️ tantos radios distintos = no hay sistema · **Sombras**: 1 distintas

**Unidad del ritmo**: 70 `em` · 322 `rem` · 1157 `px` · 3 `clamp()` · 6 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 768px · 1024px · 1600px · 640px · 1280px · 1536px · 2000px · 448px · 480px · 560px

## 3. Movimiento

- **Transiciones distintas**: 10 · **@keyframes declarados**: 12
- **`transition: all`**: 0 veces
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 304 elementos siguen animando, 107 con transicion > 50ms
- **Movimiento atado al scroll**: no — anima al entrar, no al dedo del scroll

Transiciones mas usadas:
- `0.15s cubic-bezier(0.4, 0, 0.2, 1)` (46)
- `width 0.2s cubic-bezier(0.4, 0, 0.2, 1), height 0.2s cubic-bezier(0.4,` (20)
- `color 0.1s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.1s cubic-b` (13)
- `color 0.2s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(` (11)
- `box-shadow 0.15s cubic-bezier(0.4, 0, 0.2, 1)` (6)
- `margin 0.2s linear, opacity 0.2s linear` (4)

## 4. Scroll

- **Pegados** (sticky/fixed): 12
  - header.sticky top-0 z-50 w-full bg-background — sticky, alto 64px, top 0px
  - input. — fixed, alto 1px, top 0px
  - input. — fixed, alto 1px, top 0px
  - input. — fixed, alto 1px, top 0px
  - input. — fixed, alto 1px, top 0px
  - input. — fixed, alto 1px, top 0px
- **Nav fija al scrollear**: si

## 5. Conversion

- **CTAs distintos**: 60 · **Formularios**: 1 · **`<dialog>`**: 0
- **CTA mas repetido**: "Home" ×2 · "Docs" ×2 · "Open in" ×2 · "Toggle MenuMenu" ×1
- Formulario → 0 campos () · boton ""

## 6. Rendimiento

- **Peso total**: 40886.6 KB en 496 pedidos
- **Por tipo**: document 739.9 KB · stylesheet 663.5 KB · font 986.3 KB · image 311.1 KB · script 38184.9 KB · fetch 1 KB
- **Terceros**: 1 hosts · 
- **Fuentes cargadas**: 8 (Geist 100 900 normal · Geist Fallback normal normal · Geist Mono 400 normal · Geist Mono Fallback normal normal · Noto Sans Arabic 100 900 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 38184.9 KB · CSS 663.5 KB**.

## 7. Accesibilidad

- **Imagenes**: 2 · sin `alt`: 0 · sin dimensiones: 0 · lazy: 0 · con `srcset`: 2
- **Objetivos tactiles < 44px**: 70 de 87 interactivos
- **Idioma**: en · **Landmarks**: {"header":1,"nav":2,"main":1,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - lab(2.75381 0 0) sobre lab(96.52 -0.0000298023 0.0000119209) → **18.16:1**
  - lab(2.75381 0 0) sobre lab(100 0 0) → **19.8:1**
  - lab(2.75381 0 0) sobre lab(48.496 0 0) → **4.18:1** ⚠️ bajo el minimo AA para texto normal
  - lab(48.496 0 0) sobre lab(96.52 -0.0000298023 0.0000119209) → **4.35:1** ⚠️ bajo el minimo AA para texto normal
  - lab(48.496 0 0) sobre lab(100 0 0) → **4.74:1**
  - lab(48.496 0 0) sobre lab(48.496 0 0) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - _(4 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: The Foundation for your Design System - shadcn/ui
- description: 144 caracteres
- canonical: NO · OG: 3 · datos estructurados: 0

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
