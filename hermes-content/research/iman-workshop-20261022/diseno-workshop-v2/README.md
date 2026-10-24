# diseno-workshop-v2 · «El sobre verde» · CHECKPOINT PARCIAL

**Borrador privado. Venta pausada. Nada de acá inscribe, cobra ni envía datos.** Estado: **parcial por cambio de prioridad** (Sergio pidió definir el tema/escalabilidad del workshop antes de seguir la landing). **No es un diseño terminado ni aprobado.** El copy final y la construcción quedan en pausa; el próximo build se alinea al brief revisado.

## Qué hay
| Ruta | Qué es |
|---|---|
| `index.html`, `styles.css`, `app.js` | Landing completa funcional (HTML/CSS/JS nativo, sin red). `?hero=balanza` muestra el hero B de exploración |
| `DESIGN.md` | Valores reales usados (color, tipo, forma, movimiento) |
| `aprendizaje.md` | Inventario de skills, diagnóstico de V1, 3 referencias con captura, matriz fuente → principio → ubicación → captura, límites |
| `QA.json`, `evidencia/qa.cjs` | Medición (Chromium 149 headless): 360/390/768/1024/1440, contraste, foco, fuentes, contador, pestañas, preguntas, CTA, sin red |
| `evidencia/detector/` | Detector de Impeccable sobre V1 (6 hallazgos) y V2 (1) |
| `evidencia/uiux/` | Salidas del buscador local de ui-ux-pro-max |
| `evidencia/refs/` | Capturas de referencias vivas (Clay, Apple, Maven, Webinarist) y las bloqueadas por Cloudflare |
| `capturas/` | 1440 y 390: hero, página completa, contador, programa, preguntas, foco, CTA local, comparativas V1/V2 y hero A/B |
| `V1-RECHAZADA.md` | V1 (`../diseno-workshop/`) se conserva intacta como rechazada |

## Resultados medidos (una corrida, `QA.json`)
- Sin desbordamiento horizontal en 360/390/768/1024/1440; 0 errores de página; 0 peticiones http(s) (todas abortadas); Archivo cargada, única familia.
- Contraste: 0 de 54 combinaciones de texto fallan (mínimo 3,39:1 en texto grande).
- Contador (10×5 = 50 min/semana; 4 semanas = 3 h 20 min/mes), pestañas con flechas/Inicio/Fin, 5 preguntas y diálogo CTA: correctos a 1440 y 390; el diálogo cierra con Escape; 0 formularios reales, 0 enlaces externos.
- 17 elementos enfocables, ninguno sin aro visible.
- Objetivos táctiles <44 px: pestaña «Pausa» (37-39 px de ancho) e inputs (43 px de alto). **No corregido** por la pausa.

## Respeta
Canon `TALLER_31_OCT.md`: nombre «Auditá tu negocio con IA», voseo, sáb 31-oct 10:00 La Paz, 90 min de contenido + pausa de 5, ejemplo inventado rotulado 10×5×4 = 200 min. Sin grabación, certificado, ahorro, testimonios ni cupos disponibles. No se tocó V1, canon, web actual, estrategia ni pitch.

## Activos y licencias
- Fotos: `hermes-content/galeria/fotos-bn/` (s31, s32, s33, s35, s36), generadas con Higgsfield en el plan de Sergio; redimensionadas localmente a webp (PIL). Origen y hashes en `assets/img/ORIGEN.json`. Se rotulan como ilustrativas en el pie.
- Retrato: el ya publicado en la página actual, copiado tal cual.
- Fuente: `Archivo-var-latin.woff2` copiada de `videos/moldes/mosaico-tablero/assets/fonts/`; el archivo declara «Copyright 2020 The Archivo Project Authors». **El texto de la licencia OFL no está en el repo** y no se descargó: pendiente de agregarlo con aprobación.

## Qué falta
Revisión visual de Sergio, Hermes y Codex sobre las capturas; ajustar al brief revisado del workshop; objetivos táctiles <44 px; revisar 768/1024 a ojo; licencia OFL de Archivo; decidir si la tipografía/paleta se adoptan.
