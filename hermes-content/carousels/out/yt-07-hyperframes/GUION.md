# Guion de grabación · HyperFrames desde cero: videos programables con HTML

**Título público:** HyperFrames desde cero: videos programables con HTML

**Miniatura:** HTML → VIDEO

**Resultado prometido:** Al terminar, la persona podrá construir una composición mínima, validarla y decidir cuándo usar present frente a render.

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

## 01 · El cambio de modelo mental

**Lámina:** Un video puede ser una interfaz reproducible, no una edición manual.

**Guion:** Abrí con una comparación concreta: en un editor tradicional movés capas a mano; acá describís el visual como un sistema. No prometas que reemplaza toda edición. La ventaja aparece cuando necesitás repetir formatos, cambiar datos o validar que una animación siga funcionando.

**Pantalla / prueba:** Deck a pantalla completa y un archivo HTML real.

## 02 · Cuándo sí usarlo

**Lámina:** HyperFrames gana cuando el mismo formato cambia muchas veces.

**Guion:** Antes de la demo verificá Node.js 22 o superior con node --version y FFmpeg con ffmpeg -version. Después da ejemplos reales: un ranking semanal, una comparativa de modelos o un changelog de producto. Para una entrevista emocional o un vlog, CapCut o Premiere siguen siendo más directos.

**Pantalla / prueba:** Ejemplos visuales: reporte, comparativa y demo; sin B-roll genérico.

## 03 · La composición mínima

**Lámina:** El contrato empieza con tamaño, duración y una escena identificable.

**Guion:** Mostrá el archivo index.html. Explicá cada atributo literalmente: composition-id identifica la pieza; start es el inicio; width y height fijan el canvas; duration limita el tiempo; data-track-index ubica el clip en una pista. No pases todavía a animación.

**Pantalla / prueba:** Abrir index.html y resaltar los atributos data-*.

## 04 · Movimiento determinista

**Lámina:** La línea de tiempo queda pausada porque el motor controla cada fotograma.

**Guion:** Subrayá paused: true y el registro en window.__timelines. El motor hace seek a un tiempo exacto. Evitá requestAnimationFrame o temporizadores de pared para contenido que deba renderizarse igual cada vez.

**Pantalla / prueba:** Resaltar paused: true y window.__timelines.

## 05 · Flujo de trabajo exacto

**Lámina:** Construí, auditá y recién después decidí si renderizar.

**Guion:** Ejecutá los comandos en pantalla, no los leas solamente. Lint encuentra errores estructurales rápido. Check abre el navegador y revisa runtime, layout, motion y contraste. Preview es la revisión humana. Render aparece al final y sólo después de aprobación.

**Pantalla / prueba:** Ejecutar los comandos en terminal con el proyecto saneado.

## 06 · La prueba real

**Lámina:** Que abra en Chrome no demuestra que el render sea correcto.

**Guion:** Mostrá una captura de check. Explicá un error fácil de reconocer: texto que entra desde fuera y queda cortado, o una animación que sólo funciona al reproducir desde cero. La validación automática no reemplaza mirar; hace que la revisión humana tenga mejores señales.

**Pantalla / prueba:** Mostrar salida de check y sus snapshots.

## 07 · Deck o video

**Lámina:** Una presentación navegable usa present; un video lineal usa render.

**Guion:** Este deck es el ejemplo: usalo con present y notas de orador. Si querés un MP4, creá una composición principal lineal. No uses render sobre varias slides esperando que las una; actualmente puede resolver sólo la primera.

**Pantalla / prueba:** Abrir present y contrastarlo con preview/render.

## 08 · La parte honesta

**Lámina:** HyperFrames no elimina el criterio visual ni la revisión final.

**Guion:** Contá la limitación sin vender humo: código limpio puede producir una pieza fea, y un check verde no decide si la historia es interesante. Nuestro estándar combina reglas automáticas, snapshots y una revisión humana antes de renderizar o publicar.

**Pantalla / prueba:** Mostrar el checklist de publicación.

## 09 · En una línea

**Lámina:** Programá el formato, validá la composición y renderizá sólo al final.

**Guion:** Cerrá repitiendo la secuencia: contrato, timeline, lint, check, preview y render. El recurso está preparado en el repositorio; no digas que ya está automatizada la entrega si todavía se responde manualmente.

**Pantalla / prueba:** Cerrar con la palabra HYPERFRAMES visible.

## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
