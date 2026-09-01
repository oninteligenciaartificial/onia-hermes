# Lo aprendido sobre webs — corpus de los 29 videos

Todo lo que salió de la tanda de reels y carruseles del 9 y 11 de agosto de 2026 que aplica a
**cómo construimos webs**. Es la entrada de diseño para el carril `web-factory`: se lee antes
de arrancar una web, junto con la skill `onia-web-factory`.

Las fichas por video viven en `../video-intake/`. Acá está lo transversal.

> **Dónde vive cada cosa (corregido 2026-08-11).** web-factory YA tiene el pipeline para
> esto y hay que usarlo, no armar uno al lado:
>
> | Lo aprendido | Dónde va | Estado |
> |---|---|---|
> | Un video que muestra **una web entera** | `web-factory/data/references/reels/models/*.json` → catálogo `docs/WEB_FACTORY_LEARNED_MODELS.md` | ✅ 2 modelos nuevos capturados (abajo) |
> | Un **componente suelto** (botón, carrito, dropzone) | reconstruido en `ui-patterns/`, y es la lista de compras de `web-factory/packages/blocks` | ✅ 4 reconstruidos |
> | Un **patrón de movimiento** | `web-factory/docs/MOTION_PATTERN_BANK_2026.md` (P1..P14) | pendiente: sumar los nuevos como P15+ |
> | El proceso de mirar reels | ya escrito: `web-factory/REELS_INTELLIGENCE_RUNBOOK.md` + `harvester/reels/{ACQUIRE,ANALYZE}.md` | usar ese, no inventar otro |
>
> **Modelos capturados de esta tanda** (`node harvester/reels/build-web-models.mjs` para
> regenerar el catálogo; el schema se valida con zod):
> - `unitedcarriers-logistics` — el scroll mueve una escena 3D que ES la cadena logística.
>   Para cualquier cliente que venda un **proceso invisible** (transporte, importación,
>   instalación). Confianza media: choca con el presupuesto de 150 kb de JS, por eso el
>   modelo trae escrita la versión 2D degradada.
> - `find-realestate-editorial` — inmobiliaria que **convierte** en vez de impresionar:
>   tres caminos explícitos (comprar/vender/alquilar), precio visible, artículos como prueba
>   cuando todavía no hay testimonios. Confianza alta. Es el hermano ligero del
>   `lecercle-realestate` que ya estaba en el catálogo.

---

## 1. El criterio corregido (lo más importante de todo)

En el primer pase marqué `HUMO` a varios videos porque *"no enseñan el código"* — lo gatean
detrás de un "comentá Code". **Ese criterio estaba mal.** El problema documentado de este
repo es que los diseños salen genéricos; descartar referencias visuales lo empeora
exactamente. Que el autor no regale el código no le quita valor al patrón: el código lo
sacamos mirando.

| El video muestra | Antes | Ahora |
|---|---|---|
| una interfaz linda, sin código | HUMO | **REFERENCIA** → se reconstruye en `ui-patterns/` |
| una herramienta que ya tenemos | HUMO | HUMO |
| una afirmación sin prueba | HUMO | HUMO |
| algo que nos mete en problemas | HUMO | HUMO |

Corolario operativo: **un reel de UI es materia prima, no contenido para consumir.** El ciclo
es ver → reconstruir → guardar en la biblioteca → usar en una web de cliente.

---

## 2. Las reglas de motion (salieron de reconstruir, no de leer)

- **Solo `transform` y `opacity`.** Si el gesto exige algo layout-bound (el colapso de un pill
  necesita `width`), se hace y se deja comentado por qué. La excepción se justifica, no se
  esconde.
- **Lento y visible: 0.6-0.9 s** en las transiciones grandes. Primera versión del botón salió
  en 0.4 s y Sergio dijo "no tiene animación slow". Tenía razón: a 0.4 s el gesto no se lee,
  y el gesto ES el patrón.
- **`cubic-bezier(0.16, 1, 0.3, 1)`** como curva default de entrada.
- **`prefers-reduced-motion: reduce` siempre**, sin excepción.
- **Casi nada necesita librería.** Los originales usan React + framer-motion; los tres estados
  del botón de subida salieron en CSS puro + 20 líneas de JS. Antes de sumar una dependencia,
  intentarlo sin ella.
- **Estados apilados en grid, no condicionales.** Las tres etiquetas del botón viven en la
  misma celda `grid-area: 1/1` con opacidad 0/1: nada salta de layout al cambiar de estado.

---

## 3. La biblioteca de patrones

`ui-patterns/` — cada carpeta es un `index.html` autocontenido. Se prueban todos juntos con
`npx serve hermes-content/references/ui-patterns`.

| Patrón | Qué resuelve | Dónde aplica |
|---|---|---|
| `upload-button` | pill de archivo → subiendo (con progreso) → completado | importación de productos, adjuntos en el SaaS |
| `checkout-card` | tarjeta que se actualiza en vivo con el formulario + flip 3D para el CVV | estructura de pagos **si** el flujo captura in-page |
| `floating-cart` | botón flotante con contador + modal de resumen sin sacar al usuario | carrito de compra |
| `dropzone-progress` | zona de arrastre con progreso vía `@property` + `clip-path` | importación de productos |

Pendientes de reconstruir, ya con la fuente identificada: el chat de mensajería
(`DbsUAxCgA3W`) — aunque para el chatbot real usamos Chatwoot, sirve para un widget embebido
en la web del cliente — y la barra lateral de React (`DbEwGUkDGjd`).

---

## 4. La capa de skills que falta

Del [mapa de 42 skills](../video-intake/2026-08-11-mapa-42-skills-diseno-claude.md), que abre
diciendo *"Claude por defecto diseña horrible, interfaces genéricas con olor a IA"* — o sea,
nuestro problema, escrito por otro.

Cruzado contra lo instalado: ~24 ya están (con el mismo nombre o equivalente), **18 faltan**.
Y cinco de las ausentes son justo la capa visual:

```
refactoring-ui · web-typography · microinteractions · ux-heuristics · top-design
```

Tarea encolada en `../video-intake/PROMPTS_POR_SESION.md` → sesión `web-factory`: instalar
**solo esas 5**, rehacer UNA landing existente con ellas y comparar. Si no mejora, se
desinstalan. No instalar las 18 de golpe: más skills es más contexto compitiendo, no mejor
diseño.

---

## 5. Fuentes de assets — útiles, con una trampa

De [los 5 sitios](../video-intake/2026-08-11-carruseles-menores.md): `uiverse.io` (15.000+
elementos de UI), `fffuel.co` (generadores SVG: blobs, ondas, gradientes, texturas),
`iconbuddy.com` (150.000+ iconos), `webgradients.com` (190+ gradientes CSS).

**La trampa:** copiar composiciones de una galería pública es el camino más rápido al diseño
genérico — el problema que estamos tratando de resolver. Se usan como **materia prima** (un
icono suelto, una textura de fondo), nunca como composición. Y verificar licencia antes de
usar nada en trabajo de cliente.

Aparte: `hyperframes` con sus plantillas de micro-animación de UI sirve para **mostrar** el
producto (factura emitida, cobro confirmado, contador de ingresos) sin grabar pantalla.
Motor ya instalado.

---

## 6. El techo, y por qué todavía no

[Web 3D con scrollytelling](../video-intake/2026-08-11-web-3d-scrollytelling-united-carriers.md)
(unitedcarriers.com): animaciones 3D que representan la cadena logística mientras se hace
scroll. Es real, no humo. Pero choca con dos cosas nuestras: el presupuesto de **150 kb de JS
por landing** y el precio de lanzamiento actual. Referencia de techo — se guarda, no se
construye.

---

## 7. Lo que sube el precio (y no es técnico)

El hallazgo comercial de todo el corpus:
[el formato antes/después](../video-intake/2026-08-09-web-antes-despues-find-real-estate.md).
Wireframe gris → web final, mismo encuadre, sin voz, sin cara, 21 segundos.

El precio está en **Landing 790 / Web Pro 1.500 Bs porque no hay portafolio publicado**; la
línea premium (2.000 / 4.500) pide 3-5 casos mostrables. Las webs ya existen. Producir esas
piezas no cuesta créditos, no depende de ningún token bloqueado y ataca el bloqueo comercial
más caro que tenemos.

Variante que aportó otro video: cuando ya haya 3 casos, una pieza que los **agrupe** y cierre
con la oferta.

---

## 8. Lo que NO hay que llevarse de estos videos

| Fuente | Por qué se descarta |
|---|---|
| Roundup de "4 features que te separan de los constructores de webs con IA" | marcadores sin explicación + cebo de comentario |
| Barra lateral "React Sidebars Part 16" como *técnica* | contenido de volumen; el componente ya está resuelto por la librería que usamos. **Sí** sirve como referencia visual |
| Chat de mensajería armado a mano | Chatwoot ya trae la conversación completa y probada |
| Copiar composiciones de uiverse | produce exactamente el diseño genérico que queremos evitar |

---

## 2026-09-01 — Los creativos de ads se veían pobres porque yo usaba el pack más plano

Sergio: *«se ve muy pobre el diseño»*. Tenía razón, y la causa era mía: **el renderer ya tiene
NUEVE packs** (`typographic · dark-product · dark-neon · editorial-photo · editorial-clean ·
bright-retail · papel-subrayado · dato-ilustrado · tarjeta-empleado`) y yo venía usando el
**default, `typographic`**, que es texto sobre negro con un resaltado verde. El más plano de todos.

Se renderizó el mismo anuncio en los nueve y se miraron. Ranking para **ads**:

| Pack | Veredicto |
|---|---|
| 🏆 **`editorial-photo`** | Foto real full-bleed + scrim + titular encima. **Otra liga.** Frena el scroll porque parece una foto, no una placa |
| 🥈 **`bright-retail`** | Verde a toda página con onda blanca. Imposible confundirla en un feed lleno de blanco y negro |
| 🥉 **`dark-neon`** | Grilla, glow verde y halftone. Buena atmósfera, pero con UNA lámina deja mucho aire arriba |
| ⛔ **`papel-subrayado`** | Con una sola lámina deja **dos tercios del cuadro vacíos**. Está pensado para carruseles largos |
| ⛔ **`typographic`** | El que usaba. Funciona, no compite |

**Los packs no comparten el código del CTA.** Cada uno tiene su propio template, y todos traían
el mismo hueco: `role === 'cta' ? ... : ''`, que con una sola lámina no dibuja nada. Se parcheó
`typographic` y `editorial-photo`; **los demás siguen sin CTA en pieza de una lámina.**

### 🔴 El defecto que el diseño NO arregla: la foto no coincide con el texto

Los 8 creativos hablan de **clínica dental** («tu clínica», «pacientes», «silla vacía»), y el
banco de fotos de Lucía tiene **café, parada de micro, mercado, tienda de barrio, oficina de
trámites y peluquería**. Ninguna es un consultorio.

Resultado: *«Tu clínica no puede depender de un cuaderno»* sobre la foto de un almacén con un
señor dando el vuelto. Se ve bien y **no cierra**. Un dentista mira eso y no se reconoce.

**Las dos salidas, y hay que elegir por pieza:**
1. **Copy genérico + foto real** → sirve para el mensaje multi-rubro, que es lo que el catálogo
   vende de verdad. Sale `editorial-photo`.
2. **Copy específico de un rubro + sin foto** → hasta que exista una foto de ese rubro. Sale
   `bright-retail` o `dark-neon`, que no prometen una escena.

Meter foto genérica debajo de copy específico es peor que no poner foto: suma una promesa visual
que el texto desmiente.
