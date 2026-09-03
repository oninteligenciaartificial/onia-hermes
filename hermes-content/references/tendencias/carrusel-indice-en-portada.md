# Receta — Carrusel «índice en la portada»

**Para qué carril:** carrusel de Instagram (formato 4:5). Sirve tanto para la marca personal de
Sergio como para el producto.

**Qué resuelve:** el lector decide si desliza en menos de un segundo. Esta receta no le pide
confianza — le muestra el temario completo antes del primer swipe.

---

## `Fuente:` https://www.instagram.com/p/Db6VZKVlNp9/

- Cuenta pública **@josecarlosttb**, post `Db6VZKVlNp9`, 11-ago-2026, formato 4:5 (1440×1800).
- **Qué miré exactamente, el 2026-09-02:**
  - Las **dos primeras láminas**, abiertas como imagen y miradas
    (`hermes-content/references/carruseles-referencia/josecarlosttb/s01.jpg` y `s02.jpg`).
  - El **caption completo**, extraído en vivo del embed público
    (`https://www.instagram.com/p/Db6VZKVlNp9/embed/captioned/`, renderizado con Chromium
    headless — sin cuenta, sin login).
- **Lo que NO pude ver, y por qué:** cuántas láminas tiene en total, likes, comentarios,
  guardados ni retención. El embed logueado-fuera confirma que es carrusel (`GraphSidecar`) pero
  **no expone el conteo de láminas ni una sola métrica**. Instagram las esconde sin sesión, y
  loguearse está prohibido en este carril. **Esta receta describe estructura, no resultado: no
  sé si el post funcionó.**

---

## La estructura

### El hallazgo: el mismo índice aparece TRES veces, en el mismo orden

Es el mecanismo central y es literal, no interpretación. Los cuatro temas salen en:

| # | Portada (carpetas) | Lámina 2 (grilla 2×2, orden de lectura) | Caption (lista numerada) |
|---|---|---|---|
| 1 | `Venta de productos` | Cotización `#QTZ-2024-0187` con despiece y total | "1. Si vendes algún tipo de producto" |
| 2 | `Nutriolog@s` | `NutriCRM` — ficha de paciente, peso, plan del día | "2. Eres nutriólog@" |
| 3 | `Gimnasio o estudio` | `GymFlow` — horario semanal de clases | "3. Tienes un GYM o estudio" |
| 4 | `Web Design` | Web «La forma de tu espacio» | "4. O si quieres empezar a diseñar tu página web" |

### Lámina 1 — portada

1. **Foto propia real, a sangre**, casual (él en el sofá con la laptop y los pies sobre la mesa).
   No es fondo decorativo: es la prueba de que hace lo que va a contar.
2. **El número, solo y grande**, arriba a la derecha, en cursiva manuscrita: `4`.
3. **Titular serif display gigante a dos colores** dentro de la misma frase — naranja para el
   sustantivo (`IDEAS`, `CLAUDE`), crema para el conector (`para poner a`).
4. **La restricción, en una banda resaltada**: `a trabajar en tu negocio (en una sola tarde)`.
   Va sobre la barra azul de selección de texto de iOS, con sus dos manijas y el menú
   `Look Up · Select All · Copy` debajo.
5. **Las 4 carpetas manila de macOS**, esparcidas sobre la foto, cada una con el nombre de un
   rubro. Este es el índice.
6. `PT.2` en naranja — marcador de serie.
7. **Píldora glassy con flecha, abajo a la derecha**: el cue de swipe.
8. El handle `@JOSECARLOSTTB` arriba, en crema translúcido sobre la foto.

### Lámina 2 — la prueba, antes de desarrollar nada

1. **Encabezado en tres partes:** `IDEAS PARA CLAUDE` (izq.) · `// 001` (centro) · logo (der.).
2. **Titular serif crema sobre verde oliva**, tres líneas: `Claude puede ser tu mejor compañero`,
   con un **garabato blanco a mano** encima que rompe la rigidez.
3. **La instrucción, en la MISMA banda azul de selección** que la portada:
   `Pídele que te ayude a construir herramientas`. La banda es el dispositivo recurrente que
   marca "acá está la promesa" en cada lámina.
4. **Grilla 2×2 de cuatro capturas de interfaz**, esquinas redondeadas y sombra, en el orden
   exacto del índice.
5. **Handle rotado 90°** en el borde izquierdo.
6. **La misma píldora de swipe** abajo a la derecha.

### Caption

Contexto propio en primera persona ("Llevo ya más de un año trabajando con Claude para mi
negocio") → la lista numerada de 4 → cierre `Sígueme para más. :)` → 5 hashtags
(`#claude #ClaudeAi #Negocios #emprendimiento #emprendiendo`).

---

## Por qué se cree que funciona

⚠️ **La fuente no dice nada de esto.** El post no explica su propio método y no pude ver métricas.
**Todo lo de abajo es inferencia mía**, y hay que tratarlo como hipótesis, no como dato.

1. **El índice en la portada convierte el swipe en una decisión informada.** El lector ve
   `Nutriolog@s` y sabe si le habla *antes* de deslizar. Cuesta lectores que no eran el público
   y gana a los que sí — que son los que llegan al final.
2. **El número acotado + el tiempo acotado (`4`, `en una sola tarde`) le ponen techo al esfuerzo.**
   No promete transformar el negocio: promete cuatro cosas en una tarde. Es una promesa chica y
   por eso creíble.
3. **La lámina 2 paga las cuatro promesas de una, antes de desarrollar ninguna.** Salda la deuda
   de la portada de inmediato en vez de hacerla esperar cuatro láminas.
4. **La foto propia da el permiso para hablar.** Sin ella, "llevo un año usando esto" es una
   afirmación; con ella es una escena.
5. **El chrome de iOS/macOS es el chiste visual** y no necesita explicación: selecciona su propio
   titular como si fuera texto copiable.

---

## Cómo se ejecuta para Onia

**El molde, listo para copiar:**

- **Portada:** foto real de Sergio trabajando · el número solo, grande, manuscrito · titular serif
  a dos colores (verde Onia + crema — **el naranja es marca de Claude, no se usa**) · la
  restricción de tiempo en banda resaltada · N carpetas con los rubros · marcador de serie · cue
  de swipe.
- **Lámina 2:** grilla 2×2 con **capturas reales del producto**, en el mismo orden que las
  carpetas.
- **Láminas 3..N+2:** una por ítem del índice, en ese orden, con la banda resaltada marcando la
  promesa de cada una.
- **Caption:** contexto en primera persona → la misma lista numerada → CTA → hashtags.

**Tres cosas que hay que respetar sí o sí:**

1. **Sólo van rubros VIVOS en la portada.** El índice es una promesa explícita, y una carpeta de
   algo que no está encendido es exhibir obra — prohibido en superficie de venta. Qué está vivo
   se lee de `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`, no de memoria.
2. **Las capturas son del producto real.** ONIA no tiene clientes pagando: no van logos, ni
   testimonios, ni cifras de uso — tampoco dentro de una captura.
3. **Si la pieza necesita un precio, se lee** de `onia-platform/lib/subscription-plans.ts`
   (planes) o `lib/pricing.ts` (add-ons). Si no está ahí, la lámina no lleva número.

**Dónde esta referencia se queda corta, y nosotros no tenemos por qué:** el carrusel entero
entrega valor y después pide `Sígueme para más`. No hay palabra clave en pantalla ni captura de
lead: la conversión muere en el caption. La última lámina es el lugar natural para pedir algo
más concreto que un follow.
