# Patrón: spec-sheet editorial (referencia francisco.carosia) + historia-quiz

> Traído por Sergio 2026-09-02 ("Revisa este diseño" + "Mira esto para generar
> interacción en las historias"). Dos referencias, dos usos distintos.

## 1 · Carrusel spec-sheet (francisco.carosia, post DcuK1_dFJLL)

`referencia-carosia-01.jpg`. Post con 401 likes y **416 comentarios** (más comentarios
que likes = CTA de palabra clave funcionando).

Anatomía de la portada:

| Elemento | Cómo lo hace | Adaptación Onia |
|---|---|---|
| Marco spec-sheet | Header y footer con metadata técnica fake en mono ("GRID SYSTEM 2.0 · UNIT: PX · VERSION 1.0 · BY ...", "TECHNICAL SPEC / COLOR: #F2571F / LAYOUT NOTES...") | Geist Mono ≤30px MAYÚSCULA — encaja EXACTO con la micro-etiqueta del sistema de marca |
| Título 2 niveles | Línea 1 display condensada negra + línea 2 sobre **bloque de color** (highlight bar naranja) | Archivo wdth 62 wght 900 + bloque #00C661 (comunidad) o ink (marca personal) |
| Mascota 3D | Personaje toy (cabeza cubo naranja, hoodie, headphones) junto a una impresora escupiendo billetes — literaliza la metáfora del título | 3 candidatos generados 02-sep en `carousels/out/experimento-mascota-onia/` (cubo/blob/chip), gana A-cubo — **esperando OK de Sergio**, ver §6 BASE_CONTENIDO |
| Fondo | Papel envejecido off-white, estética brutalist print | Nuestro F7F7F7 plano — el grano sutil se probó (02-sep) y se descartó: triplicaba el peso del PNG sin verse a esta escala. Ganó sombra de ícono más rica en su lugar (ver `statement-3d-minimal/FICHA.md`) |
| Promesa concreta | Pill bordeada abajo: "7 repos gratis que ya se venden como servicio" | Ya usamos pill — copiar la promesa NUMÉRICA |
| Caption | Lista numerada 01→07 `herramienta → qué hace`, hook "Claude no te hace ganar plata. Lo que le enchufás, sí." | Formato de caption para nuestros carruseles de herramientas |

Lo que NO copiamos: su naranja, su mascota, su firma "by francisco carosia".

🚫 **EL MARCO SPEC-SHEET ESTÁ DESCARTADO — no lo repongas** (Sergio, 02-sep tarde:
*"hay información innecesaria"*, §7 de `ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md`).
Un experimento A/B nuestro (`experimento-marco-specsheet.py`) lo había declarado ganador
ese mismo día por ser "más distintivo", y se aplicó a cuatro generadores. **Sergio miró
las piezas y decidió lo contrario**, y su decisión manda sobre cualquier veredicto del
loop: el header/footer de metadata técnica se retiró de los 4 generadores el 02-sep.
La ficha lo conserva descrito abajo como **referencia de lo que hace carosia**, no como
patrón nuestro. Que un A/B interno "gane" no lo vuelve aprobado.

### Jerarquía de la portada — la regla nace de mirarla CHICA (02-sep)

`experimento-portada-miniatura.py` rindió la misma portada en tres layouts y la miró al
33 % (feed) y al 13 % (grilla de perfil), que es donde se decide si alguien frena el
scroll. Veredicto completo en §6 de `ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md`.

| | Portada VIEJA (no usar) | Portada NUEVA (patrón) |
|---|---|---|
| Estructura | ícono 300 → título 88 wdth 62 → subtítulo gris 44 | ícono 240 → contexto 62 wdth 62 **gris** → remate 150 **wdth 125** |
| A 13 % | mancha gris ilegible | el remate se sigue leyendo |
| Subtítulo | **se elimina** — ilegible a 33 % y a 13 %, y le roba tamaño al título | no hay |

**Cómo se elige el remate:** son las 2-3 palabras que aguantan solas. El resto de la frase
baja a gris y a tamaño de contexto. Ejemplo real: *"Cómo contesto a cada cliente"* (gris,
62) + **"SIN ESTAR YO"** (ink, 150 wdth 125).

### El verde de marca es un RELLENO, nunca un color de texto (02-sep)

`experimento-verde-marca.py` midió el contraste además de mirarlo, sobre la palabra
"COMUNIDAD" de la lámina de CTA real. Sobre el fondo `#F7F7F7` del sistema:

| tratamiento | contraste | |
|---|---|---|
| `#00C661` como **color de texto** | **2,12:1** | ❌ reprueba AA — se lava en el feed |
| `#00C661` como **fondo** + tinta `#0A0A0A` | **8,72:1** | ✅ el patrón |

El verde de marca es claro; puesto como tinta sobre fondo claro queda más apagado que el
gris que lo rodea. Como bloque, el CTA pasa a ser lo segundo más fuerte de la lámina.
**Todo highlight verde va `background:#00C661` + `color:#0A0A0A`.** Ver §7 de
`ONIA_MARCA_PERSONAL_BASE_CONTENIDO.md`.

⚠️ Trampa ya conocida del bloque: pegado a un signo de puntuación deja un hueco visible —
el resaltado abarca la palabra, no la coma.

### Trampa del resaltado en `.caja b`

`.caja b` lleva `padding:0 8px`, así que cualquier coma, dos puntos o punto **pegado a
`</b>` sale separado por un hueco visible** ("...una persona : no improvisa"). Regla: el
resaltado nunca termina justo antes de un signo — se reformula para que lo siga un espacio
y una palabra. Encontrado mirando las láminas del carrusel de atención, 02-sep.

## 2 · Historia-quiz (ingenierobinario)

`referencia-historia-quiz-ingenierobinario.jpg`. Fórmula de interacción:
header etiqueta + tarjeta de contenido (código) + banda de color con la PREGUNTA +
**encuesta nativa de IG con 4 opciones** (la interacción es 1 tap, la respuesta genera
debate en DMs/comentarios).

Adaptación implementada: `scripts/marca-personal/generar-historia-quiz.py` →
`carousels/out/historias-quiz/historia-01..03.png` (verde marca, Archivo, tarjeta
oscura, banda ink con pregunta en condensed, zona punteada donde Sergio pega el
sticker de encuesta). Opciones y respuestas correctas: SEMANA1 §Historias-quiz.

Regla del formato: la pregunta debe poder responderse MAL por la mayoría (la
sorpresa es el gancho); la respuesta correcta se revela en la historia siguiente
o en la comunidad ("la respuesta está en la comunidad → link arriba").

## 3 · Grid grayscale + highlight (bastian.xu, post DcqsXYdIGep)

`referencia-bastianxu-grid-grayscale.jpg` y `referencia-bastianxu-cierre-foto.jpg`.

- **Grid 2x3 de íconos 3D TODOS en escala de grises** — el color existe SOLO en los
  highlights (él amarillo, nosotros verde #00C661) sobre la palabra clave de cada
  etiqueta y del título. Cohesión total sin encargar íconos del mismo set.
- Título en 2 niveles: línea liviana + palabra clave en display black con bloque de color.
- Cierre de carrusel: **foto real recortada interactuando con un prop físico**
  (pizarrón con texto manuscrito) + "Soy X y te ayudo a…" — pendiente para Sergio:
  necesita 1 foto suya de cuerpo entero sobre fondo liso para recortar.

Adaptación implementada: `scripts/marca-personal/generar-lamina-grid-ia.py` →
`carousels/out/lamina-grid-ia.png` ("Lo que la IA ya hace por tu negocio",
filter grayscale(1) sobre los Fluent 3D + highlights verdes, Archivo condensed).
