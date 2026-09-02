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

**Experimento A/B corrido 02-sep** (`scripts/marca-personal/experimento-marco-specsheet.py`,
salida en `carousels/out/experimento-marco-specsheet/`): portada sin marco vs. con marco
spec-sheet sobre la misma pieza real (portada de venta del chatbot). **Gana CON marco** —
más distintivo, cero texto cortado. Ya aplicado en `generar-carrusel-chatbot.py`.

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
