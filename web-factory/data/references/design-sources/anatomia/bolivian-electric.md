# Anatomia medida — http://localhost:4519/

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 10.7 pantallas en escritorio · 16.6 en movil
- **Secciones**: 13
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 43 (1 h1, 1 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 10.7 | Materiales eléctricos de alta, media y baja tensión. | (591-3) 348-7575 | 129 |
| 1 | 10.7 | Materiales eléctricos de alta, media y baja tensión. | (591-3) 348-7575 | 129 |
| 2 | 0.7 | Materiales eléctricos de alta, media y baja tensión. | Buscá materiales, marcas o equipos…Busca | 3 |
| 3 | 1.7 | Equipos destacados | Todos | 18 |
| 4 | 1.4 | Todo lo eléctrico en un solo lugar | Ver catálogo completo | 1 |
| 5 | 0.7 | Comprar es simple | - | 3 |
| 6 | 0.9 | La ventaja de comprar en Bolivian Electric | Cotizá tu proyecto | 7 |
| 7 | 0.8 | Más que un proveedor de materiales | Ver equipos en alquiler | 6 |
| 8 | 0.3 | Marcas que representamos | - | 40 |
| 9 | 1 | Bolivian Electric | (591-3) 348-7575 | 2 |
| 10 | 0.8 | Estamos cerca tuyo | Casa MatrizSanta CruzLunes a viernes · 8 | 11 |
| 11 | 1.2 | Soporte y recursos | Preguntas frecuentesResolvé las dudas má | 11 |
| 12 | 0.6 | Pedí tu cotización y te respondemos hoy. | (591-3) 348-7575 | 5 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 13px / lh 1.50 / ls normal / w 400 | 36 |
| 14px / lh 1.43 / ls normal / w 500 | 16 |
| 20px / lh 1.25 / ls -0.2016px / w 500 | 15 |
| 15px / lh 1.65 / ls normal / w 400 | 10 |
| 56px / lh 0.98 / ls -0.448px / w 500 | 9 |
| 10px / lh 1.50 / ls 1px / w 700 | 8 |
| 14px / lh 1.38 / ls normal / w 700 | 8 |
| 10px / lh 1.50 / ls 1.2px / w 600 | 8 |
| 12px / lh 1.33 / ls 0.48px / w 700 | 8 |
| 36px / lh 1.00 / ls -0.144px / w 500 | 8 |

**Familias**: Inter (236)

**Espaciado** (los que de verdad se repiten): 8px×61 · 24px×48 · 12px×37 · 6px×31 · 20px×28 · 4px×28 · 33px×22 · 16px×17 · 10px×16 · 16.5px×15

**Radios**: 0 valores distintos · **Sombras**: 1 distintas

**Unidad del ritmo**: 130 `em` · 233 `rem` · 134 `px` · 4 `clamp()` · 5 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 1024px · 1280px · 640px · 768px · 1440px · 1920px

## 3. Movimiento

- **Transiciones distintas**: 9 · **@keyframes declarados**: 2
- **`transition: all`**: 0 veces
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 0 elementos siguen animando, 205 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic` (90)
- `color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-b` (40)
- `transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)` (19)
- `width 0.3s cubic-bezier(0.4, 0, 0.2, 1)` (15)
- `transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)` (13)
- `color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-b` (8)

## 4. Scroll

- **Pegados** (sticky/fixed): 2
  - header.sticky top-0 z-50 — sticky, alto 105px, top 0px
  - a.group fixed bottom-5 right-5 z-50 inline-flex items-center g — fixed, alto 48px, top 824px
- **Nav fija al scrollear**: si

## 5. Conversion

- **CTAs distintos**: 68 · **Formularios**: 1 · **`<dialog>`**: 0
- **CTA mas repetido**: "Ver detalle" ×8 · "Agregar" ×8 · "Medición" ×7 · "(591-3) 348-7575" ×5
- Formulario → 3 campos (text*, select-one, textarea*) · boton "Enviar por WhatsApp"

## 6. Rendimiento

- **Peso total**: 1537.1 KB en 62 pedidos
- **Por tipo**: document 1.2 KB · stylesheet 52.8 KB · script 432.4 KB · image 977.7 KB · fetch 25.9 KB · font 47.1 KB
- **Terceros**: 3 hosts · fonts.googleapis.com, fonts.gstatic.com
- **Fuentes cargadas**: 6 (Inter 400 normal · Inter 500 normal · Inter 600 normal · Inter 700 normal · Inter 800 normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 432.4 KB · CSS 52.8 KB**.

## 7. Accesibilidad

- **Imagenes**: 52 · sin `alt`: 0 · sin dimensiones: 51 · lazy: 49 · con `srcset`: 0
- **Objetivos tactiles < 44px**: 60 de 145 interactivos
- **Idioma**: es · **Landmarks**: {"header":1,"nav":1,"main":1,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(14, 24, 56) sobre rgb(245, 183, 29) → **9.68:1**
  - rgb(14, 24, 56) sobre rgb(10, 17, 38) → **1.08:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(14, 24, 56) sobre rgb(245, 245, 245) → **15.97:1**
  - rgb(255, 255, 255) sobre rgb(245, 183, 29) → **1.8:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(255, 255, 255) sobre rgb(10, 17, 38) → **18.73:1**
  - rgb(255, 255, 255) sobre rgb(245, 245, 245) → **1.09:1** ⚠️ bajo el minimo AA para texto normal
  - _(7 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Bolivian Electric — Materiales Eléctricos Industriales
- description: 185 caracteres
- canonical: NO · OG: 0 · datos estructurados: 0

## 9. Tecnologia detectada

- no detectada

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
