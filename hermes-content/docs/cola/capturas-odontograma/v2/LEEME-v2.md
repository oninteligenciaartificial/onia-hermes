# Odontograma de cinco caras (PR #119 + arreglos C6c) — capturas v2

Odontograma interactivo de 32 piezas con caras: banco `/dev/odontograma` (componente real `Odontogram`, sin red) con los arreglos C6c (anchos táctiles de vuelta y caries distinta de corona). Código en `17cefc78` (rama `wip/c119`, ya con master adentro). Escenarios `varias` (caries y restaurado repartidos, corona en la 11) y `vacio` (sin registros); paciente ficticio. 13 PNG, todos abiertos y mirados.

Cómo se tomaron: Chromium sin cabeza, 390 y 1440 de ancho, página completa, tipografía de la marca cargada. Ajustes de captura, no del producto: se ocultaron con CSS los chips de escenarios y el párrafo de ayuda del banco (igual que en la primera ronda) y el botón «N» de Next en desarrollo; el puntero se aparta antes de cada foto para que no quede un «hover» sobre una pieza.

## Resultado del clic real y del ancho

- **Clic real (`locator.click()`, sin `dispatchEvent`) sobre la pieza 36 a 390 px: abre la 36.** Se abre «Diente 36», el botón «Diente 36: Caries» queda presionado y el arco se desplaza solo para centrarla (`odontograma-diente-36-390.png`).
- Barrido extra con clic real sobre las 32 piezas: a 390 y a 1440, **32 de 32 abren su propia pieza** (ninguna abre la vecina).
- Piezas medidas: 44 × 63 px el botón y 36 px el dibujo, en 390 y en 1440; cero encimadas. (En la primera ronda eran unos 14 px y se encimaban.)
- `document.documentElement.scrollWidth` a 390: **390** al cargar, tras abrir la 36 y tras los 32 clics. El arco mide 808 px dentro de una caja de 324 px que se desplaza sola; la página no se ensancha. A 1440: 1440 (arco 974 de 974, sin desplazar).

## Problemas de la primera ronda

| | Antes | Ahora | PNG que lo prueba |
|---|---|---|---|
| a | A 390 las piezas salían de unos 14 px, encimadas, y tocar la 36 abría la 37 | **Arreglado.** Piezas de 44 px, sin encimarse, arco que se desliza con la pista «Deslice el arco hacia los lados para ver todas las piezas.»; el clic real abre la pieza correcta | `odontograma-arco-390.png`, `odontograma-arco-centro-390.png`, `odontograma-diente-36-390.png` |
| b | Caries (ámbar) y corona (amarillo) casi iguales | **Arreglado.** Caries: relleno rosado y borde rojo oscuro (25 y 36). Corona: relleno amarillo con una elipse de corona (11). En el relleno la diferencia medida es grande (ΔE 51) | `odontograma-arco-1440.png` (las tres juntas), `odontograma-arco-centro-390.png` (11), `odontograma-diente-36-390.png` (25 y 36) |
| c | Los botones de las caras no tenían color | **Arreglado.** Cada cara toma el color de su condición: Mesial y Vestibular azul (Restaurado), Oclusal y Distal rosado con borde rojo (Caries), Lingual verde (Sano); sin registro queda gris neutro | `odontograma-diente-36-390.png`, `odontograma-diente-36-1440.png`, `odontograma-vacio-diente-36-1440.png` |

También se ven bien: cara «Oclusal» abierta, que edita sólo esa cara y trae su nota «Caries profunda; pendiente de tratamiento.» (`odontograma-cara-oclusal-390.png`, `…-1440.png`); pieza superior 11 con «Incisal» y «Palatina / lingual», Distal a la izquierda y Mesial a la derecha (`odontograma-diente-superior-11-390.png`, `…-1440.png`); paciente vacío con todas las caras en «Sin registro» y ninguna condición marcada (`odontograma-vacio-arco-*.png`, `odontograma-vacio-diente-36-*.png`).

## Lo raro que se ve ahora

- **Caries y Fractura se parecen** (medido, no visto: el banco no tiene ninguna pieza con fractura). Con las mismas clases del componente, el relleno es casi idéntico (rosado, ΔE 8) y sólo cambia el borde, rojo oscuro contra rojo vivo (ΔE 21); también en el punto de la leyenda, donde se ven los dos rojos (`odontograma-arco-1440.png`). Es el mismo tipo de confusión de la primera ronda, ahora entre otras dos condiciones.
- **A 390 sólo caben unas 7 piezas por fila:** el resto exige deslizar. La pista está y la pieza abierta se centra sola, pero de entrada el arco se ve cortado a la derecha (`odontograma-arco-390.png`).
- **Letras sueltas en los bordes del arco a 390:** un trozo de «Superior · línea media · Inferior» queda cortado y parece una «S» perdida a la derecha (`odontograma-arco-390.png`, `odontograma-vacio-arco-390.png`) y una «r» a la izquierda (`odontograma-diente-36-390.png`).
- **Escritorio, la ficha de la pieza deja un hueco** bajo las cinco caras porque la columna de la derecha (condición y notas) es mucho más alta (`odontograma-diente-36-1440.png`).
- **Del banco:** el título «Odontograma · datos ficticios» es del banco, no del producto.
- Consola: sólo dos avisos de Next en desarrollo («recurso precargado y no usado»: una fuente y `global-error.css`); ningún error de la pantalla.
- Sin texto cortado, sin inglés y sin formas de vos en esta pantalla («Seleccione una pieza…», «Deslice el arco…»; barrido por script del texto de las 13 capturas).

## Barrido de desborde horizontal a 390 (el reset `min-width:0` ahora en `@layer base`)

`document.documentElement.scrollWidth` en wt-119, ventana de 390; ninguna página supera 390 y ningún elemento sin recortar se sale por la derecha.

| Banco | scrollWidth |
|---|---|
| `/dev/odontograma?caso=varias` | 390 |
| `/dev/odontograma?caso=vacio` | 390 |
| `/dev/shell` | 390 |
| `/dev/kit` | 390 |
| `/dev/kit?rubro=comercio` | 390 |
| `/dev/pendientes` | 390 |
| `/dev/asientos` | 390 (su tabla de `min-w-[440px]` queda dentro de una caja con scroll de 316 px) |
| `/dev/agenda` | 390 |
| `/dev/ficha` | 390 |
| `/dev/ficha?tab=cobros` | 390 |
| `/dev/ficha?tab=odontograma` | 390 |

Se miraron además `/dev/asientos`, `/dev/agenda` y `/dev/ficha?tab=odontograma` a 390 (sin desborde). **De pasada, fuera de esta pantalla:** `/dev/asientos` habla de vos («Sos 1 y tu plan incluye 1», «Hoy pagás Bs 70,00», «sumá a quien necesites») y la ficha dice «Te debe Bs 350,00» (tuteo); y la barra del asistente sigue con «Preguntá por tu negocio» (`components/ayuda/BarraAsistente.tsx`, líneas 116 y 121).

## Archivos

Escenario `varias` a 390 y 1440: `odontograma-arco`, `odontograma-diente-36`, `odontograma-cara-oclusal`, `odontograma-diente-superior-11`. Escenario `vacio` a 390 y 1440: `odontograma-vacio-arco`, `odontograma-vacio-diente-36`. Sólo a 390: `odontograma-arco-centro-390.png` (arco desplazado a la línea media). Total 13.
