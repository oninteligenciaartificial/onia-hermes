# Anatomia medida — https://www.kommo.com/es/

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 8.7 pantallas en escritorio · 10 en movil
- **Secciones**: 2
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 55 (1 h1, 7 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 8.7 | Inicia sesión | - | 307 |
| 1 | 8.6 | Potencia tus chats, evita todo el caos | Gratis por 14 días | 212 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 12px / lh 1.20 / ls normal / w 500 | 54 |
| 12px / lh 1.40 / ls normal / w 400 | 54 |
| 16px / lh 1.60 / ls normal / w 400 | 49 |
| 16px / lh 1.20 / ls normal / w 500 | 36 |
| 16px / lh 1.20 / ls normal / w 700 | 35 |
| 16px / lh 1.20 / ls normal / w 400 | 33 |
| 12px / lh 1.50 / ls normal / w 500 | 29 |
| 12px / lh 1.60 / ls normal / w 500 | 27 |
| 16px / lh 1.50 / ls normal / w 400 | 26 |
| 16px / lh 0.90 / ls normal / w 400 | 26 |

**Familias**: EuclidCircularA (525) · Roboto (5) · Arial (2)

**Espaciado** (los que de verdad se repiten): 16px×221 · auto×213 · 24px×104 · 12px×102 · 8px×77 · 4px×61 · 32px×53 · 40px×34 · 56px×24 · 20px×24

**Radios**: 11 valores distintos (contar valores finales NO mide el sistema: shadcn tiene 19 y todos salen de un `--radius` con calc()) · **Sombras**: 1 distintas

**Unidad del ritmo**: 4 `em` · 1162 `rem` · 326 `px` · 2 `clamp()` · 9 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 768px · 1200px · 1440px · 1024px · 767px · 1920px · 321px · 450px · 451px · 500px

## 3. Movimiento

- **Transiciones distintas**: 18 · **@keyframes declarados**: 20
- **`transition: all`**: 3 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: NO
- **Con la preferencia PUESTA**: 114 elementos siguen animando, 99 con transicion > 50ms
- **Movimiento atado al scroll**: no — anima al entrar, no al dedo del scroll

Transiciones mas usadas:
- `opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)` (70)
- `color 0.075s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.075s cub` (20)
- `0.3s cubic-bezier(0, 0, 0.2, 1)` (11)
- `opacity 0.8s` (10)
- `transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)` (10)
- `transform 0.3s cubic-bezier(0.35, 0, 0.25, 1)` (8)

## 4. Scroll

- **Pegados** (sticky/fixed): 12
  - div.js-modal hidden fixed inset-0 z-40 js-sign-in bg-white — fixed, alto 0px, top 0px
  - div.fixed top-80 inset-0 flex flex-col px-16 pt-24 pb-24 md:pt-1 — fixed, alto 0px, top 80px
  - div.js-modal hidden fixed inset-0 z-40 js-forgot flex flex-col b — fixed, alto 0px, top 0px
  - div.fixed top-80 inset-0 flex overflow-y-auto custom-scrollbar — fixed, alto 0px, top 80px
  - div.js-modal hidden fixed inset-0 z-40 js-change-password bg-whi — fixed, alto 0px, top 0px
  - div.fixed top-80 inset-0 flex overflow-y-auto custom-scrollbar — fixed, alto 0px, top 80px
- **Nav fija al scrollear**: no

## 5. Conversion

- **CTAs distintos**: 136 · **Formularios**: 7 · **`<dialog>`**: 0
- **CTA mas repetido**: "Conoce más" ×11 · "Iniciar sesión" ×8 · "Crear cuenta" ×7 · "Español (Latinoamérica)" ×7
- Formulario → 2 campos (text, password) · boton "Ver Ocultar"
- Formulario → 1 campos (text) · boton "Pedir cambio de contraseña"
- Formulario → 2 campos (password, password) · boton "Ver Ocultar"
- Formulario → 6 campos (tel, tel, tel, tel, tel, tel) · boton "Confirmar"
- Formulario → 1 campos (text) · boton "Crear cuenta"
- Formulario → 3 campos (text, text, password) · boton "Ver Ocultar"
- Formulario → 2 campos (text, text) · boton "Crear cuenta"

## 6. Rendimiento

- **Peso total**: 20996.4 KB en 426 pedidos
- **Por tipo**: document 594 KB · stylesheet 146.8 KB · font 226.1 KB · script 4881.7 KB · image 0.8 KB · media 15146.9 KB · xhr 0 KB · fetch 0 KB · ping 0 KB
- **Terceros**: 28 hosts · pcfcdn.kommo.com, gso.kommo.com, analytics.tiktok.com, gtmanalytics.kommo.com, bat.bing.com
- **Fuentes cargadas**: 14 (swiper-icons 400 normal · EuclidCircularA 300 normal · EuclidCircularA 300 italic · EuclidCircularA 400 normal · EuclidCircularA 400 italic)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 4881.7 KB · CSS 146.8 KB**.

## 7. Accesibilidad

- **Imagenes**: 127 · sin `alt`: 10 · sin dimensiones: 40 · lazy: 1 · con `srcset`: 0
- **Objetivos tactiles < 44px**: 80 de 330 interactivos
- **Idioma**: es · **Landmarks**: {"header":7,"nav":8,"main":0,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - rgb(14, 1, 66) sobre rgb(255, 255, 255) → **19.06:1**
  - rgb(14, 1, 66) sobre rgb(14, 1, 66) → **1:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(14, 1, 66) sobre rgb(243, 239, 255) → **16.88:1**
  - rgb(134, 128, 160) sobre rgb(255, 255, 255) → **3.74:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(134, 128, 160) sobre rgb(14, 1, 66) → **5.09:1**
  - rgb(134, 128, 160) sobre rgb(243, 239, 255) → **3.32:1** ⚠️ bajo el minimo AA para texto normal
  - _(1 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Kommo: CRM con IA para ventas y automatización de mensajes.
- description: 148 caracteres
- canonical: https://www.kommo.com/es/ · OG: 5 · datos estructurados: 1

## 9. Tecnologia detectada

- swiper

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
