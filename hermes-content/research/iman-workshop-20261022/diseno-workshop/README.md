# diseno-workshop — bocetos privados de «Auditá tu negocio con IA»

**Borrador privado — venta pausada. No publicar.** Aislado de la web vigente: no toca `sitio-sergiourcullo/`, no tiene deploy, ni analytics, ni enlaces externos, ni `wa.me`, ni formularios. El botón «Quiero mi cupo» solo abre un aviso local («Inscripción no habilitada»).

## Cómo abrirlo
Doble clic en `index.html` (funciona con `file://`, sin servidor ni red). Selector arriba o `?d=a`, `?d=b`, `?d=c`.

## Qué hay
| Dirección | Estado | Idea |
|---|---|---|
| **A · La hoja** | **Completa** (recomendada) | Editorial; la página es la hoja de conteo (tarea · veces por semana · minutos) con un ejemplo inventado rotulado. Tabla del programa, FAQ, oferta como estructura. |
| **B · Los 90+5** | Exploración (hero, resultado, método, programa, CTA) | El programa es el eje: tiempo transcurrido 0–45, pausa 45–50, 50–95. Oscura, distinta composición. |
| **C · Conversación** | Exploración (hero, resultado, método, programa, CTA) | Preguntas del dueño y respuestas de Sergio en formato propio (sin imitar ninguna app, sin testimonios). |

No son tres proyectos: un `index.html`, un `styles.css`, un `app.js` (HTML/CSS/JS nativo, sin dependencias ni build).

## Qué respeta (canon `TALLER_31_OCT.md`)
Nombre «Auditá tu negocio con IA»; voseo; sáb 31-oct, 10:00 (La Paz); 90 min de contenido + pausa de 5; sales con lista de tareas repetidas y su costo mensual, prioridad y primer paso. Los tramos (15 a Bs 50 / 20 a Bs 60 / 15 a Bs 70 por pago acreditado) aparecen **solo como estructura de la oferta**, rotulados como no vigentes ni disponibles. La demostración es un **ejemplo inventado** y mide **tiempo** (10 × 5 min = 50 min/semana; con 4 semanas, 200 min = 3 h 20 min/mes), no ahorro ni dinero. Sin testimonios, certificado, grabación, plantillas, casos propios ni automatización instalada.

## Activos y licencias
- `assets/fonts/`: Bricolage Grotesque, DM Sans y Spline Sans Mono (woff2 «var-latin»), copiadas de `hermes-content/brand/fonts/` junto con sus `OFL-*.txt` (SIL Open Font License 1.1). Las tres se usan.
- `assets/sergio-retrato.webp`: el retrato propio ya embebido en `sitio-sergiourcullo/auditoria/index.html` (alt «Sergio Urcullo»), extraído tal cual (mismo SHA-256 que `auditoria/img/sergio-bn.webp`). No se generó ni subió ningún rostro externo.
- Paleta y tipografías son **propuestas reversibles**, no marca definitiva.

## QA y capturas
`QA.json` (resultados reales, errores, límites, hashes) y `capturas/` (PNG permanentes). Medido con Playwright de `web-factory` y Chromium headless ya instalado; **viewport emulado, no móvil real**: no prueba táctil.
