<!-- design-md v1 · generado por harvester/vision/emit_design_md.mjs desde data/references/design-sources/anatomia/bolivian-electric.json · NO EDITAR A MANO: re-medir y re-emitir -->
# DESIGN.md — bolivian-electric

> Contrato visual **medido** del sitio entregado. Sirve como único contexto de estilo
> para construir una página nueva que se vea de esta familia. Todo número sale de
> `getComputedStyle`/CSSOM/red contra http://localhost:4519/ (2026-08-20),
> vistas movil / tablet / escritorio. Detalle crudo: `data/references/design-sources/anatomia/bolivian-electric.json`.
>
> Regenerar: `node harvester/vision/extract_web_anatomy.mjs --url <url> --slug bolivian-electric`
> y luego `node harvester/vision/emit_design_md.mjs --slug bolivian-electric`.

## Dirección visual
Trust & Authority + Minimalism/Flat con rejilla y ritmo de Swiss Modernism 2.0: azul marino profundo + un único acento ámbar, Inter como única familia, fondos claros de base con secciones oscuras como acento estructural. Industrial B2B: sobrio, denso en datos reales del catálogo, cero ornamento.

> Marca e intención declaradas por el cliente: C:/dev/clientes/bolivian-electric-web/design-system/MASTER.md (tokens) y LEYES_MEDIDAS.md (mecánica). Este archivo debe COINCIDIR con lo medido; si divergen, gana la medición.

## Paleta (medida, rol sugerido por frecuencia y croma)

| Rol | Hex | Usos medidos |
|---|---|---|
| acento | `#f5b71d` | 61× como fondo |
| fondo oscuro | `#0a1126` | 24× como fondo |
| superficie alterna | `#f5f5f5` | 23× como fondo |
| fondo base | `#ffffff` | 19× como fondo |
| superficie alterna | `#f4f5f7` | 3× como fondo |
| superficie alterna | `#e2e8f0` | 3× como fondo |
| texto principal | `#0e1838` | 56× como texto |
| texto sobre oscuro | `#ffffff` | 30× como texto |
| texto principal | `#737373` | 26× como texto |
| cuerpo (tinte de marca) | `#0e1838 al 72%` | 20× como texto |
| cuerpo sobre oscuro | `#ffffff al 70%` | 16× como texto |
| texto sobre oscuro | `#a3a3a3` | 15× como texto |

## Tipografía

- Familias medidas: **Inter** (236×) — una sola familia, sin pareja tipográfica.
- Pesos cargados: Inter 400 normal, Inter 500 normal, Inter 600 normal, Inter 700 normal, Inter 800 normal, Inter 900 normal

| Rol | Escalón medido (tamaño / interlineado / tracking / peso) | Usos |
|---|---|---|
| cuerpo | `13px / lh 1.50 / ls normal / w 400` | 36× |
| cuerpo | `14px / lh 1.43 / ls normal / w 500` | 16× |
| heading | `20px / lh 1.25 / ls -0.2016px / w 500` | 15× |
| cuerpo | `15px / lh 1.65 / ls normal / w 400` | 10× |
| display | `56px / lh 0.98 / ls -0.448px / w 500` | 9× |
| etiqueta / botón (mayúsculas + tracking) | `10px / lh 1.50 / ls 1px / w 700` | 8× |
| cuerpo | `14px / lh 1.38 / ls normal / w 700` | 8× |
| etiqueta / botón (mayúsculas + tracking) | `10px / lh 1.50 / ls 1.2px / w 600` | 8× |
| etiqueta / botón (mayúsculas + tracking) | `12px / lh 1.33 / ls 0.48px / w 700` | 8× |
| display | `36px / lh 1.00 / ls -0.144px / w 500` | 8× |

Leyes del display: peso máximo medido **500** (el impacto sale del tamaño y del tracking negativo, no del bold); el interlineado comprime al crecer el tamaño.

## Ritmo y espaciado

- Unidades del CSS: em 130 (26%) · rem 233 (46%) · px 134 (26%) · clamp 4 (1%) · vw 5 (1%).
- Escala de espaciado medida (los que se repiten SON la escala): 8px (61×) · 24px (48×) · 12px (37×) · 6px (31×) · 20px (28×) · 4px (28×) · 33px (22×) · 16px (17×).
- Breakpoints reales de las media queries: 1024px, 1280px, 640px, 768px, 1440px, 1920px — usar ESTOS, no los supuestos.
- Desborde horizontal: movil no · tablet no · escritorio no.

## Radios, sombras y capas

- Radios distintos: 0 (sistema contenido).
- Sombras distintas: 1.
- z-index en uso: 10, 50 — no inventar niveles nuevos.

## Movimiento

| Transición medida | Usos |
|---|---|
| `color 0.15s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.15s cubic` | 90× |
| `color 0.3s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.3s cubic-b` | 40× |
| `transform 0.15s cubic-bezier(0.4, 0, 0.2, 1)` | 19× |
| `width 0.3s cubic-bezier(0.4, 0, 0.2, 1)` | 15× |
| `transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)` | 13× |
| `color 0.2s cubic-bezier(0.4, 0, 0.2, 1), background-color 0.2s cubic-b` | 8× |
| `transform 0.2s cubic-bezier(0, 0, 0.2, 1)` | 8× |
| `box-shadow 0.4s cubic-bezier(0.165, 0.84, 0.44, 1), background-color 0` | 7× |

- 9 transiciones distintas y 2 `@keyframes` — es un sistema, no decisiones sueltas.
- Duración máxima medida: **0.4s**. Nada más lento que eso.
- `transition: all`: 0 elementos — prohibido introducirlo.
- `prefers-reduced-motion`: media query presente; ejecutado con la preferencia activa quedan 0 animando y 205 con transición.
- Movimiento ligado al scroll: sí (muestreado en 5 posiciones).
- Pegados: `header` sticky (sticky top-0 z-50) · `a` fixed (group fixed bottom-5).

## Gramática de secciones (escritorio, en orden)

| # | Fondo | Alto | Titular | CTA |
|---|---|---|---|---|
| 2 | `#0a1126` | 0.7 pant. | Materiales eléctricos de alta, media y baja tensión. | Buscá materiales, marcas o equipos…Busca |
| 3 | `#f4f5f7` | 1.7 pant. | Equipos destacados | Todos |
| 4 | `#ffffff` | 1.4 pant. | Todo lo eléctrico en un solo lugar | Ver catálogo completo |
| 5 | `#ffffff` | 0.7 pant. | Comprar es simple |  |
| 6 | `#0a1126` | 0.9 pant. | La ventaja de comprar en Bolivian Electric | Cotizá tu proyecto |
| 7 | `#0a1126` | 0.8 pant. | Más que un proveedor de materiales | Ver equipos en alquiler |
| 8 | `#ffffff` | 0.3 pant. | Marcas que representamos |  |
| 9 | `#f4f5f7` | 1 pant. | Bolivian Electric | (591-3) 348-7575 |
| 10 | `#ffffff` | 0.8 pant. | Estamos cerca tuyo | Casa MatrizSanta CruzLunes a viernes · 8 |
| 11 | `#ffffff` | 1.2 pant. | Soporte y recursos | Preguntas frecuentesResolvé las dudas má |
| 12 | `#0a1126` | 0.6 pant. | Pedí tu cotización y te respondemos hoy. | (591-3) 348-7575 |

El ritmo claro/oscuro de la página: ■ □ □ □ ■ ■ □ □ □ □ ■ (■ oscuro, □ claro).

## Conversión

- Tratamiento de botón/control: el escalón `10px / lh 1.50 / ls 1px / w 700` en MAYÚSCULAS con su tracking — los CTAs no usan el cuerpo, usan la etiqueta.
- CTAs distintos: 68. Los que más se repiten: "Ver detalle" (8×), "Agregar" (8×), "Medición" (7×), "(591-3) 348-7575" (5×), "Iluminación" (3×).
- Formulario: 3 campos (text*, select-one, textarea*) → botón "Enviar por WhatsApp".

## Presupuesto (el peso medido es el TECHO, no la meta)

- Total 1537.1 KB · document 1.2 KB · stylesheet 52.8 KB · script 432.4 KB · image 977.7 KB · fetch 25.9 KB · font 47.1 KB.
- 62 pedidos (document 2, stylesheet 4, script 2, image 50, fetch 2, font 2) · 3 hosts · terceros: fonts.googleapis.com (1), fonts.gstatic.com (1).

## Contrastes medidos (pares más frecuentes)

| Texto | Fondo | Ratio | AA |
|---|---|---|---|
| `#0e1838` | `#f5b71d` | 9.68 | ✓ |
| `#0e1838` | `#0a1126` | 1.08 | ✗ |
| `#0e1838` | `#f5f5f5` | 15.97 | ✓ |
| `#ffffff` | `#f5b71d` | 1.8 | ✗ |
| `#ffffff` | `#0a1126` | 18.73 | ✓ |
| `#ffffff` | `#f5f5f5` | 1.09 | ✗ |

Los pares ✗ que aparezcan pueden ser artefactos del muestreo (texto sobre imagen o capa intermedia): verificar mirando antes de heredarlos como defecto.

## Qué NO dice este archivo

- Intencion de diseno: por que eligieron ESTA direccion visual y no otra.
- Calidad del copy: si la promesa es creible y si los numeros estan respaldados.
- Contenido detras de login, muro de cookies o interaccion (paso 2 de un popup, estados de error).
- Si el movimiento AYUDA a entender o solo decora: eso se juzga mirando, no midiendo.
