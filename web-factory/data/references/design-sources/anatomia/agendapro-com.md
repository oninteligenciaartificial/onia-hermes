# Anatomia medida — https://agendapro.com

> Generado por `harvester/vision/extract_web_anatomy.mjs` el 2026-08-20.
> Criterios y por que cada uno importa: `docs/ANATOMIA_DE_UNA_WEB.md`.
> Todo lo de aca son valores LEIDOS del sitio vivo. Lo que no se pudo medir esta al final.

## 1. Arquitectura de pagina

- **Largo**: 13.1 pantallas en escritorio · 16 en movil
- **Secciones**: 13
- **Desborde horizontal**: no · movil: no
- **Encabezados**: 27 (1 h1, 0 saltos de nivel)

| # | alto (pantallas) | titular | CTA | medios |
|---|---|---|---|---|
| 0 | 13.1 | El software n°1 para salones, spa, estética y salud | AgendaPro | 197 |
| 1 | 1.3 | El software n°1 para salones, spa, estética y salud | AgendaPro | 18 |
| 2 | 2.5 | AgendaPro hace crecer tu negocio | Prueba gratis | 30 |
| 3 | 2.6 | El único software que ordena tu negocio y acelera su crecimiento un 82% | Crea tu cuenta gratis | 6 |
| 4 | 0.7 | Un universo de herramientas para hacer crecer negocios de belleza y bienestar | Crea tu cuenta gratis | 6 |
| 5 | 1.1 | Hazlo simple, hazlo Pro. | Crea tu cuenta gratis | 4 |
| 6 | 1.5 | Más de 20.000 negocios como el tuyo ya confían en AgendaPro | - | 0 |
| 7 | 0.5 | Soporte 24/7 y acompañamiento gratis por siempre | Con AgendaPro vas de la mano | 6 |
| 8 | 0.7 | Preguntas frecuentes | ¿Qué es un software de gestión de citas? | 16 |
| 9 | 0.5 | AgendaPro se adapta a tu negocio | Salones de belleza | 96 |
| 10 | 0.9 | - | Crea tu cuenta gratis | 12 |
| 11 | 1 | - | - | 0 |
| 12 | 1 | - | - | 0 |

## 2. Tokens medidos

**Escala tipografica** (tamano / interlineado / tracking / peso — juntos, que es como funciona):

| valor | veces |
|---|---|
| 12px / lh 1.33 / ls normal / w 500 | 96 |
| 16px / lh 1.50 / ls normal / w 400 | 80 |
| 14px / lh 1.71 / ls normal / w 400 | 41 |
| 24px / lh 1.33 / ls normal / w 600 | 15 |
| 16px / lh 1.50 / ls normal / w 300 | 14 |
| 60px / lh 1.00 / ls -1.5px / w 600 | 12 |
| 16px / lh 1.75 / ls normal / w 600 | 8 |
| 36px / lh 1.11 / ls -0.9px / w 600 | 6 |
| 18px / lh 1.56 / ls -0.45px / w 500 | 6 |
| 20px / lh 1.40 / ls normal / w 300 | 6 |

**Familias**: Poppins (320) · clashDisplaySemibold (1)

**Espaciado** (los que de verdad se repiten): 16px×114 · 24px×51 · 40px×35 · 8px×31 · 12px×16 · 32px×14 · 80px×12 · 64px×10 · 4px×9 · 20px×8

**Radios**: 13 valores distintos (contar valores finales NO mide el sistema: shadcn tiene 19 y todos salen de un `--radius` con calc()) · **Sombras**: 1 distintas

**Unidad del ritmo**: 11 `em` · 110 `rem` · 400 `px` · 3 `clamp()` · 7 `vw`
→ ritmo mixto o en px/rem: cada token escala por su cuenta.

**Breakpoints reales** (de las media queries): 1024px · 640px · 768px · 1280px · 349px · 769px · 1536px

## 3. Movimiento

- **Transiciones distintas**: 15 · **@keyframes declarados**: 29
- **`transition: all`**: 5 veces ⚠️ anima todo, incluido layout
- **prefers-reduced-motion en el CSS**: si
- **Con la preferencia PUESTA**: 5 elementos siguen animando, 0 con transicion > 50ms
- **Movimiento atado al scroll**: SI (5 estados distintos en 5 posiciones)

Transiciones mas usadas:
- `opacity 0.4s cubic-bezier(0.25, 0.1, 0.25, 1), transform 0.4s cubic-be` (45)
- `0.3s cubic-bezier(0.4, 0, 0.2, 1)` (30)
- `transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), translate 0.3s cubic-bezi` (28)
- `filter 0.3s` (10)
- `color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-b` (9)
- `color 0.4s` (7)

## 4. Scroll

- **Pegados** (sticky/fixed): 6
  - div.go2933276541 go2369186930 — fixed, alto 900px, top 0px
  - div.go2933276541 go1348078617 — fixed, alto 0px, top 900px
  - div.go2417249464 go613305155 — fixed, alto 0px, top 0px
  - div.go2417249464 go471583506 — fixed, alto 0px, top 0px
  - div.go2417249464 go3921366393 — fixed, alto 0px, top 900px
  - div.go2417249464 go3967842156 — fixed, alto 0px, top 900px
- **Nav fija al scrollear**: si

## 5. Conversion

- **CTAs distintos**: 59 · **Formularios**: 0 · **`<dialog>`**: 0
- **CTA mas repetido**: "Centros de estética" ×9 · "Salones de belleza" ×9 · "Cejas y pestañas" ×9 · "Salones de maquillaje" ×9


## 6. Rendimiento

- **Peso total**: 4297.9 KB en 323 pedidos
- **Por tipo**: document 577.1 KB · other 0.1 KB · stylesheet 147.9 KB · font 61.9 KB · script 2802.4 KB · image 708.2 KB · fetch 0 KB · ping 0 KB · xhr 0.2 KB
- **Terceros**: 29 hosts · cdn.agendapro-resources.com, www.google.com, www.google.com.bo, googleads.g.doubleclick.net, www.googletagmanager.com
- **Fuentes cargadas**: 10 (Poppins 400 normal · Poppins 500 normal · Poppins 600 normal · Poppins 700 normal · Poppins Fallback normal normal)

Contra el presupuesto de la casa (150 KB JS / 30 KB CSS en una landing): **JS 2802.4 KB · CSS 147.9 KB**.

## 7. Accesibilidad

- **Imagenes**: 146 · sin `alt`: 0 · sin dimensiones: 24 · lazy: 140 · con `srcset`: 145
- **Objetivos tactiles < 44px**: 31 de 162 interactivos
- **Idioma**: es · **Landmarks**: {"header":1,"nav":1,"main":1,"footer":1}
- **Contraste** (pares mas frecuentes, resueltos a sRGB y con el texto compuesto sobre su fondo):
  - lab(27.1134 -0.956401 -12.3224) sobre rgb(29, 29, 61) → **1.57:1** ⚠️ bajo el minimo AA para texto normal
  - lab(27.1134 -0.956401 -12.3224) sobre rgb(255, 255, 255) → **10.3:1**
  - lab(27.1134 -0.956401 -12.3224) sobre lab(98.2596 -0.247031 -0.706708) → **9.86:1**
  - rgb(0, 0, 0) sobre rgb(29, 29, 61) → **1.3:1** ⚠️ bajo el minimo AA para texto normal
  - rgb(0, 0, 0) sobre rgb(255, 255, 255) → **21:1**
  - rgb(0, 0, 0) sobre lab(98.2596 -0.247031 -0.706708) → **20.1:1**
  - _(6 fondos translucidos omitidos: no se puede juzgar un fondo sin saber que hay detras.)_

## 8. SEO / indexabilidad

- title: Software de Agendamiento de Citas - AgendaPro
- description: 187 caracteres
- canonical: https://agendapro.com/es · OG: 10 · datos estructurados: 3

## 9. Tecnologia detectada

- swiper

## 10. Lo que NO se pudo medir

- nada: las tres vistas cargaron

Y lo que ninguna medicion automatica alcanza:
- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
