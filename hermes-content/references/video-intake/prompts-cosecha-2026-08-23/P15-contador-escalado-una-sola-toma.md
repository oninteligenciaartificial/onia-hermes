# P15 · Patrón «contador escalado»: overlay reutilizable de 13 s para reels de Onia

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-23-cosecha-contador-escalado-una-sola-toma.md) · `DcJivjZOOth` · @bastian.xu
- **Fuente:** https://www.instagram.com/p/DcJivjZOOth/
- **Tipo:** MARKETING
- **Qué falta para hacerlo hoy:** Técnicamente nada — la herramienta existe y está probada. Faltan dos cosas de contenido y una es bloqueo real: (1) un presentador HUMANO que sostenga 13 s en una sola toma con progresión de energía; Lucía/Higgsfield NO sirve (clips de 5-10 s, sin control de micro-actuación progresiva), esto va con Sergio a cámara o no va; (2) decidir QUÉ cuenta el contador: con cero clientes pagando, la regla «no fabricar» prohíbe mostrar métricas propias o de cliente, así que hay que usar placeholders o una magnitud verificable y neutra (segundos de una tarea, cantidad de pasos, minutos de agenda). Decisión de Sergio antes de grabar.

---

```text
Objetivo único de esta sesión: dejar construido y documentado el patrón de overlay «contador escalado + stack acumulativo», portado del reel https://www.instagram.com/p/DcJivjZOOth/ (@bastian.xu), para que cualquier reel de Onia lo use sin volver a diseñarlo. No abras ningún otro frente.

DATOS MEDIDOS — usalos, no los re-estimes:
- Original: 13,116 s · 720x1280 · 30 fps · 390 frames · 0 cortes detectados (umbral scene 0.3). Cámara fija, una sola toma.
- Mapa de beats leído del muestreo denso a 4/s:
  0,00-1,50 s  → "24 Views"
  1,50-3,25 s  → "384 Views"  + "+ postura"
  3,25-4,75 s  → "1,685 Views" + "+ postura" / "+ cara"
  4,75-7,25 s  → "84,284 Views" + "+ postura" / "+ cara" / "+ tono"
  7,25-9,75 s  → "335,284 Views" + "+ postura" / "+ cara" / "+ tono" / "+ gestos"
  9,75-13,12 s → "1 View" (colapso; es el beat MÁS LARGO, ~3,4 s)
- La lista es ACUMULATIVA: cada ítem se apila debajo, nada se reemplaza.
- El texto entra por CUT-IN SECO. En un muestreo a 4/s no hay un solo fotograma de transición: sin fade, sin slide, sin escala, sin rebote. CERO motion gráfico. Si animás la entrada, rompiste el patrón.

LAYOUT (medido sobre fotograma 1080x1920):
- Número: blanco #FFFFFF, peso Bold, ~60 px de alto (~3,1% de la altura), centrado horizontalmente, línea base al ~56% de la altura del cuadro.
- Ítems: verde ~#2ECC2E, peso Regular/Medium, ~40 px (~2/3 del número), alineados a la IZQUIERDA con sangría de ~6% del ancho respecto del borde izquierdo del número. Interlineado ~1,2 em.
- Tipografía: neogrotesco (Inter / Helvetica Now Display / SF Pro Display). La del original no se declara.
- REGLA DE COLOCACIÓN: el bloque va sobre la ZONA OSCURA del torso del sujeto, nunca sobre el fondo claro. Por eso NO lleva caja, ni barra, ni sombra dura: el contraste lo da la ropa. Si el take no tiene zona oscura a esa altura, movés el bloque, no le ponés fondo.

QUÉ CONSTRUIR:
1. Composición HyperFrames `contador-escalado.html`, parametrizada por un array de beats `{ t_inicio, t_fin, numero, items[] }`, que renderice el overlay quemado sobre un clip vertical 1080x1920. Usá el timing por atributos `data-*`. LEÉ LAS SKILLS `hyperframes` (entrada), `hyperframes-core` y `hyperframes-cli` ANTES de escribir una línea de HTML — no reinventes el motor.
2. Documentá el patrón en `web-factory/docs/MOTION_PATTERN_BANK_2026.md` bajo el nombre «contador escalado + stack acumulativo», con el mapa de beats de arriba, la regla de colocación sobre zona oscura, y la nota de loop bait: la pose final del sujeto debe ser igual a la del fotograma 0 para que el autoloop de Instagram empalme sin salto.
3. Si el orquestador no la dejó ya, guardá la ficha de origen en `hermes-content/references/video-intake/`.

RESTRICCIÓN DURA DE ONIA — leela antes de elegir los números:
Onia tiene CERO clientes pagando. La regla «no fabricar» prohíbe inventar cifras, testimonios o resultados. El contador NO puede mostrar métricas de Onia ni de un cliente. Dejá `{{NUMERO}}` como placeholder en la plantilla, o usá una magnitud verificable y neutra (segundos que tarda una tarea, cantidad de pasos, minutos de agenda). Si dudás, dejá placeholders y preguntá a Sergio — no elijas vos.
REGLA DE ORO DE VIDEO: mostrá a Sergio la tabla de beats + un preview 360p ANTES de quemar nada definitivo.
No agregues "muy pronto", "beta" ni estado de obra en ninguna superficie que vaya a ver un cliente.

LISTO = `contador-escalado.html` renderiza con la CLI de HyperFrames un MP4 de 1080x1920 y ~13,1 s; los fotogramas extraídos con ffmpeg en t = 1,0 / 2,5 / 4,0 / 6,0 / 9,0 / 11,0 s muestran SEIS estados distintos del overlay (número + su stack de ítems acumulado, 0/1/2/3/4/0 ítems respectivamente), el último beat dura >= 3 s, y `web-factory/docs/MOTION_PATTERN_BANK_2026.md` contiene la entrada «contador escalado + stack acumulativo» con el mapa de beats y la regla de colocación sobre zona oscura.
```
