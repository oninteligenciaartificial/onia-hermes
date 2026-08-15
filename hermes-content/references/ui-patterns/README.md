# UI patterns — biblioteca de referencia reconstruida

Cada carpeta es **un patrón de interfaz que vimos en un video y reconstruimos en código**.
No se copia el código del creador (casi nunca lo muestran: lo gatean detrás de "comentá
Code"). Se mira el video fotograma por fotograma y se rehace. Lo que queda es nuestro.

## Por qué existe

Corrección de criterio, 2026-08-11. Al analizar 29 videos marqué como `HUMO` varios que
"no enseñaban el código". Estaba mal: **un patrón visual bueno vale como referencia aunque
el autor no regale el código**, y el problema documentado de este repo es justamente que
los diseños salen genéricos. Descartar referencias visuales empeora exactamente eso.

El criterio corregido:

| El video muestra | Antes | Ahora |
|---|---|---|
| una interfaz linda, sin código | HUMO | **REFERENCIA** — se reconstruye acá |
| una herramienta que ya tenemos | HUMO | HUMO (sigue igual) |
| una afirmación sin prueba | HUMO | HUMO (sigue igual) |
| algo que nos mete en problemas | HUMO | HUMO (sigue igual) |

## Reglas

- **Reconstruido, no copiado.** Se mira y se rehace. Si el original usa una librería
  (framer-motion, GSAP), primero se intenta sin ella: casi todo es `transform`, `opacity` y
  `background-color`.
- **Un `index.html` autocontenido por patrón**, sin dependencias. Así se prueba en 2 s y se
  porta a React cuando haga falta.
- **Anotar la fuente** en un comentario arriba del archivo, con el link.
- **Solo `transform` y `opacity`** salvo que el gesto exija otra cosa; si se anima algo
  layout-bound (como `width`), se deja dicho por qué.
- **`prefers-reduced-motion` siempre — y con `transition: none`, no con `0.01ms`.**
  El truco de `transition-duration: 0.01ms !important` funciona para `transform`/`opacity`,
  pero rompe las propiedades **discretas**: un `<dialog>` con transición de `display`/`overlay`
  de 0,01 ms queda a medio camino (abierto pero con `opacity: 0`, o sea invisible). Si el
  patrón toca propiedades discretas, va `transition: none`.
- **En un `<dialog>` o un `popover`, `display` va SOLO en el estado abierto.** El navegador
  le da `display: none` a un popover cerrado o a un `<dialog>` sin `open`, pero esa regla es
  del *user-agent*: cualquier regla de autor le gana, aunque tenga menos especificidad. Si
  la regla base dice `display: flex`, el panel queda ocupando lugar y capturando clics con
  el widget "cerrado". Va `.panel:popover-open { display: flex }` (o el flex en un hijo).
- **Etiquetas de estado apiladas = un solo nombre accesible.** El truco de apilar los estados
  en la misma celda de grid y cruzar opacidades evita saltos de layout, pero deja TODAS las
  etiquetas en el DOM: el lector de pantalla lee "+ Agregar Agregado". Las etiquetas visuales
  van con `aria-hidden="true"` y el nombre real vive en un `aria-label` del botón que el JS
  actualiza en cada cambio de estado.

## Cómo verlos

```bash
npx serve hermes-content/references/ui-patterns
```

O desde Claude Code: `preview_start` con la config `ui-patterns` de `.claude/launch.json`.

## Patrones

| Patrón | Fuente | Estado |
|---|---|---|
| [upload-button](upload-button/) — pill de archivo → subiendo → completado | [reel](https://www.instagram.com/p/Dbx6AWGz_av/) | reconstruido, estados verificados en navegador |
| [checkout-card](checkout-card/) — tarjeta que se escribe en vivo, flip 3D al CVC, viaje al centro al pagar | [reel](https://www.instagram.com/p/Db3CrouPbxz/) | reconstruido, estados verificados en navegador |
| [floating-cart](floating-cart/) — botón flotante "Ver carrito" que aparece con el primer ítem + modal resumen (`<dialog>` nativo) | [reel](https://www.instagram.com/p/DbDjpLuTnKK/) | reconstruido, estados verificados en navegador |
| [dropzone-progress](dropzone-progress/) — arrastrar archivos, la miniatura ES la barra de progreso (`@property` + `clip-path`) | [reel](https://www.instagram.com/p/Da0iDR4vl5M/) | reconstruido, estados verificados en navegador |
| [chat-widget](chat-widget/) — burbuja flotante + panel de conversación para pegar en la landing del cliente (`popover="manual"` nativo, `role="log"` + `aria-live`) | [reel](https://www.instagram.com/p/DbsUAxCgA3W/) | reconstruido, estados verificados en navegador |
| [sidebar-nav](sidebar-nav/) — barra lateral de vidrio con submenús desplegables, uno solo abierto a la vez (`<details name>` + `::details-content`) | [reel](https://www.instagram.com/p/DbEwGUkDGjd/) | reconstruido, estados verificados en navegador |
