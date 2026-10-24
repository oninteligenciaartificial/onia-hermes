# DESIGN.md · «Auditá tu negocio con IA» · V2 «El sobre verde»

Borrador privado. Venta pausada. Marca personal de Sergio Urcullo (voseo). No redefine la marca ONIA ni el PRODUCT.md de la fábrica web.
Valores de abajo = los que están en `styles.css`. Si el archivo y esta hoja difieren, manda el archivo.

## Lectura de diseño
Superficie **Decidir / Aprender** para dueños de negocio de Bolivia. Idea: el taller es clasificar una pila de tareas repetidas y sacar **una** (el sobre verde). La foto B/N con un solo objeto verde (decisión del 8-oct) es el material de partida, no un adorno. Estrategia de color **Committed**: gris piedra (el gris real de las fotos) + verde del objeto + tinta casi negra. Referencias nombradas: Clay (escena + titular sobre campo de color), Apple Mac (objeto sobre campo neutro, titulares cortos), Maven (hechos en una línea de meta). Carril estético que se evita: editorial tipográfico (serif, mono, filetes, numeración).

## Color (hex medidos de las fotos de la galería; contrastes en QA.json)
| Token | Valor | Uso |
|---|---|---|
| `--tinta` | `#0d1210` | texto sobre claro, campo oscuro |
| `--piedra` | `#c1c1bf` | pared de las fotos; fondo de secciones de escena |
| `--piedra-clara` | `#e6e7e6` | paneles y fondo de lectura |
| `--papel` | `#f3f4f3` | fondo base (blanco frío, sin tinte cálido) |
| `--verde` | `#0c7137` | el objeto verde: botones, énfasis, campo drenched |
| `--verde-vivo` | `#00c661` | token de marca, solo como superficie o texto sobre tinta |
| `--texto-suave` | `#3d4642` | texto secundario sobre claro |

## Tipografía
Una sola familia, elegida a propósito: **Archivo** variable (wght 100-900), archivo local `assets/fonts/Archivo-var-latin.woff2` (copia del que ya usa el repo; aviso de copyright Archivo Project Authors dentro del archivo, licencia OFL declarada por el proyecto Omnibus-Type; el texto de licencia no está en el repo, ver README). Es la familia de la página personal vigente. Sin monoespaciada (no es una marca técnica).
- Titular: 800, `clamp(2.5rem, 1.2rem + 4.4vw, 5.25rem)` (máx 84 px), interlineado 1,02, tracking -0,03em, `text-wrap: balance`.
- Sección: 800, `clamp(2rem, 1.2rem + 2.6vw, 3.5rem)`.
- Cuerpo: 400, 1,125rem / 1,55, ancho de lectura 62ch.
- Cifras: `tabular-nums`. Sin mayúsculas sostenidas ni etiquetas sobre cada sección.

## Forma y espacio
- Radio único: 0 en bloques, 999px solo en botones. Sin sombras difusas; el único relieve es un bloque duro desplazado 14 px detrás del retrato.
- Espacio de sección: `clamp(4rem, 2.5rem + 7vw, 9rem)`; ritmo irregular a propósito (la sección de escena respira más que la de FAQ).
- Cuadrícula: 12 columnas implícitas, contenedor 1240 px; las fotos sangran al borde.

## Movimiento (todo con `prefers-reduced-motion`)
- Hero: titular sube 14 px y la foto baja de escala 1,05 a 1 (una vez, 700 ms, ease-out quart).
- Fotos: descubrimiento por `clip-path` al entrar (una vez). El contenido es visible por defecto.
- Sección «Salís con»: la foto queda fija y el ítem visible se enciende.
- Interacciones útiles: contador de una tarea (cálculo vivo), programa por pestañas con flechas del teclado, preguntas, aviso local del botón.

## Componentes y estados
- Botón primario: relleno `--verde`, texto blanco, pill. Hover: se eleva 2 px y se oscurece. Foco: aro 3 px `--verde-vivo` + 2 px de tinta. Activo: baja 1 px.
- Una intención = una etiqueta: «Quiero mi cupo» en barra, hero y cierre.
- Estado local del botón: diálogo nativo «Inscripción no habilitada». Nada se envía.

## Imágenes
Solo la galería propia (`hermes-content/galeria/fotos-bn/`, generadas con Higgsfield dentro del plan de Sergio) y el retrato ya publicado. Se rotulan como ilustrativas en el pie. Origen y hashes: `assets/img/ORIGEN.json`. No hay gráficos SVG de datos ni métricas decorativas; las únicas cifras son las del canon y el ejemplo inventado rotulado.

## Prohibido en esta página
Ahorro en bolivianos, resultados, certificado, grabación, plantillas, testimonios, contadores de cupos, urgencia, nombres de terceros, em dashes, numeración decorativa de secciones, tarjetas iguales en fila, glow, degradés de texto.
