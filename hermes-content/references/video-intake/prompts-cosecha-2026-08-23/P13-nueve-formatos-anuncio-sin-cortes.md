# P13 · Plantilla HyperFrames: listicle sobre toma continua

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-23-cosecha-nueve-formatos-anuncio-sin-cortes.md) · `DblhPOux1YP` · @davidaistar
- **Fuente:** https://www.instagram.com/p/DblhPOux1YP/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Para la plantilla del reel: NADA, se hace hoy. Para producir los 9 formatos con IA: permiso explicito de gasto de Sergio caso por caso (Higgsfield es pago). Y una decision de Sergio: cuales de los 5 formatos limpios (Claymation, Fake Podcast, Skeleton Story, Hyper Motion, Crochet) sirven para vender software B2B en Bolivia — los otros 4 se apoyan en IP de Pixar/Disney o en el estilo de un creador y no se pueden publicar en material de cliente.

---

```text
Construí una plantilla de composición HyperFrames reutilizable para el patrón "listicle sobre toma continua", extraído del reel https://www.instagram.com/p/DblhPOux1YP/ (@davidaistar). La ficha completa está en hermes-content/references/video-intake/.

ANTES DE CODEAR: leé la skill `hyperframes` (entrada), después `hyperframes-core` (contrato de composición y atributos data-*) y `editor-videos`. HyperFrames vive en `.agents/skills/` y es el motor por defecto — NO reinventes el motor de video ni uses Remotion (jubilado por decisión de Sergio el 21-ago).

EL PATRÓN, medido con ffprobe/ffmpeg sobre el original (9,866 s · 720x1280 · 30 fps · 292 fotogramas · 0 cortes con umbral scene 0.3):

Es UNA sola toma continua del presentador. No hay un solo corte. Todo el ritmo se produce sustituyendo overlays encima de un plano que nunca corta. La plantilla tiene que reproducir eso: un `<video>` de fondo que corre entero, y overlays que se sustituyen por encima.

Capas, de arriba hacia abajo, todas en posiciones FIJAS:
1. Card de título anclado a ~15% del borde superior. Rectángulo blanco #FFFFFF, esquinas redondeadas, padding generoso, texto negro #000000, grotesca muy pesada, 2 líneas, interlineado apretado, centrado. NO cambia nunca durante los ítems. Es el contrato de retención: "son N, vas a llegar al N".
2. El `<video>` del presentador, toma continua, sin cortes.
3. Rótulo del ítem `N) Nombre`: relleno blanco con contorno negro duro (`-webkit-text-stroke: 3px #000` o equivalente), SIN caja de fondo, centrado, apoyado justo encima del inset. La ausencia de caja es deliberada: lo deja flotar sobre el pecho sin tapar la cara.
4. Inset 9:16 dentro de 9:16, ~35% del ancho del cuadro, centrado horizontalmente, en la mitad inferior. Tiene que aceptar un `<video>` (los ejemplos se REPRODUCEN, no son capturas fijas). Compuesto ENCIMA sin máscara: las manos del presentador pasan por detrás, y eso es lo que hace que se lea como una imagen viva y no como un collage.
5. Dos stickers estáticos en la columna derecha del inset, para el CTA. Presentes durante todos los ítems.

Parámetros que la plantilla debe exponer como variables:
- `titulo` (el card fijo)
- `items[]`: array de `{ rotulo, insetSrc, duracionMs }` — duración POR ÍTEM, no uniforme. En el original los tiempos son desiguales: el ítem cuyo inset necesita más tiempo para leerse (un build por capas) recibe más aire. Default 950 ms.
- `stickers[]`: hasta 2, opcionales
- `cierreMs`: duración del cierre limpio. Default 1300 ms.

DOS REGLAS DE MOVIMIENTO, y son las que hacen que funcione:
- Los overlays NO se animan. Cero entrada, cero salida, cero fade, cero escala en el rótulo, el card y los stickers. Es sustitución dura. El movimiento lo aportan el inset (que es video) y el presentador. No agregues wobble ni "respiración": leé `motion-doctrine`, la prohibición de movimiento ocioso aplica.
- El cierre limpia TODOS los overlays a la vez (card, rótulo, inset, stickers) y deja la cara sola durante `cierreMs`. Es la señal visual de que viene el CTA hablado. No lo omitas: es el remate del patrón.

ENTREGABLES:
1. La composición HTML de la plantilla, en el lugar que indique `hyperframes-core`.
2. Un render de demostración con 3 ítems de prueba (usá clips o placeholders que YA existan en el repo; no generes nada pago — Higgsfield y ElevenLabs requieren permiso explícito de Sergio caso por caso).
3. Registrá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre "listicle sobre toma continua", citando la ficha de video-intake como fuente.

NO HAGAS: no produzcas contenido de cliente con este molde en esta sesión, no generes nada pago, y no uses los nombres de formato "Pixar Character" ni "Disney Character" en ningún ejemplo — son IP ajena y Onia no publica material de cliente que imite marcas de estudios.

LISTO = existe un MP4 renderizado por HyperFrames, de 3 ítems con duraciones distintas entre sí, verificado con ffprobe en 0 cortes (`ffmpeg -i <salida> -vf "select='gt(scene,0.3)'" -f null -` devuelve cero detecciones), en el que el card de título permanece idéntico durante los 3 ítems y desaparece junto con el rótulo, el inset y los stickers durante el cierre limpio final — todo confirmado MIRANDO fotogramas extraídos del render, no por grep ni por que el comando haya salido con código 0.
```
