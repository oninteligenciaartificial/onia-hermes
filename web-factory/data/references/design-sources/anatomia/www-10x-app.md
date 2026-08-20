# Anatomia medida — https://www.10x.app/

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-19.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 3.1 pantallas en escritorio · 3.8 en movil
- **Secciones**: 3
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 3 (1 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 3.1 | What would you like to build?What would you like to build? | - | 86 |
| 1 | 0.5 | - | - | 3 |
| 2 | 3.1 | What would you like to build?What would you like to build? | - | 81 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 14px / lh 1.50 / ls normal / w 400 | 64 |
| 14px / lh 1.50 / ls normal / w 500 | 13 |
| 13px / lh 1.63 / ls normal / w 400 | 13 |
| 12px / lh 1.50 / ls normal / w 400 | 11 |
| 13px / lh 1.50 / ls normal / w 400 | 4 |
| 28px / lh 1.50 / ls -0.7px / w 600 | 4 |
| 17px / lh 1.50 / ls normal / w 600 | 4 |
| 17px / lh 1.25 / ls -0.425px / w 600 | 3 |
| 11px / lh 1.50 / ls normal / w 400 | 3 |
| 15px / lh 1.50 / ls -0.375px / w 600 | 2 |

**Familias**: -apple-system (125)

**Espaciado** (los que de verdad se repiten): 6px×135 · 8px×79 · 16px×13 · 24px×12 · 12px×10 · 20px×10 · 40px×6 · 14px×5 · 4px×4 · 32px×4

**Radios**: 7 valores distintos · **Sombras**: 3 distintas

**Unidad del ritmo**: 37 `em` · 63 `rem` · 2597 `px` · 0 `clamp()` · 37 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 640px · 1024px · 768px · 560px · 360px · 480px · 481px · 639px · 767px · 1280px

## 3. Movimiento

- **Transiciones distintas**: 11 · **@keyframes declarados**: 43
- **`transition: all`**: 1 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 2 elementos siguen animando, 74 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `background-color 0.15s cubic-bezier(0.4, 0, 0.2, 1), color 0.15s cubic` (151)
- `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), translate 0.3s cubic-bezi` (7)
- `0.3s cubic-bezier(0.19, 1, 0.22, 1)` (7)
- `transform 0.15s cubic-bezier(0.4, 0, 0.2, 1), translate 0.15s cubic-be` (6)
- `color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-b` (6)
- `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (6)

## 4. Scroll

- **Pegados** (sticky/fixed): 2
  - div. — fixed, alto 420px, top 0px
  - div.z-30 flex justify-center px-3 pt-3 sm:px-6 fixed inset-x-0 t — fixed, alto 60px, top 0px
- **Nav fija al scrollear**: no

## 5. Conversion

- **CTAs distintos**: 55 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "Debt payoff snowball planner" ×4 · "Cocktail recipe book" ×4 · "Tax-deduction receipt scanner" ×4 · "Flight deal tracker" ×2


## 6. Rendimiento

- **Peso total**: 32200 KB en 301 pedidos
- **Por tipo**: document 27.4 KB · stylesheet 276 KB · script 5508.3 KB · image 3816.5 KB · fetch 46 KB · media 22525.7 KB
- **Terceros**: 6 hosts · is1-ssl.mzstatic.com, auth.10x.app, ggrgdcfzzsrvpjggxtyq.supabase.co, code.trygravity.ai, api.10x.app
- **Fuentes cargadas**: 0 ()

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 5508.3 KB · CSS 276 KB**.

## 7. Accesibilidad

- **Imagenes**: 6 · sin `alt`: 0 · sin dimensiones: 0 · lazy: 6 · con `srcset`: 6
- **Objetivos tactiles < 44px**: 88 de 105 interactivos
- **Idioma**: en · **Landmarks**: {"header":2,"nav":2,"main":0,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgba(0, 0, 0, 0.5) sobre rgb(255, 255, 255) → **4:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(0, 0, 0, 0.5) sobre rgb(17, 17, 17) → **1.06:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(0, 0, 0, 0.85) sobre rgb(255, 255, 255) → **15.13:1**
  - rgba(0, 0, 0, 0.85) sobre rgb(17, 17, 17) → **1.09:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(0, 0, 0, 0.3) sobre rgb(255, 255, 255) → **2.12:1** ⚠️ bajo el minimo AA para texto normal
  - rgba(0, 0, 0, 0.3) sobre rgb(17, 17, 17) → **1.04:1** ⚠️ bajo el minimo AA para texto normal
  - _(12 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: 10x — Build native apps from a prompt
- description: 83 caracteres
- canonical: NO · OG: 8 · datos estructurados: 0

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
