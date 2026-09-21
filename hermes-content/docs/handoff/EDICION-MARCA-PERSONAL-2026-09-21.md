# Handoff de edición · marca personal · 2026-09-21

Estado: `esperando material bruto`

## Objetivo

Editar la primera pieza de la tanda diaria de Sergio y dejar el flujo listo para
procesar las siguientes piezas sin publicar nada automáticamente.

## Fuente de verdad

- Guiones del día: `hermes-content/docs/cola/GUIONES-DIA-2026-09-21.md`
- Pieza prioritaria: **Guion 1 — Cómo diseñar tu primera automatización en tres nodos**
- Enseñanza: diseñar un flujo mínimo `Webhook → IF → Telegram`, mostrando entrada,
  regla, dos caminos y salida verificable.

## Primer entregable

Nombre de trabajo: `01-feed-3-nodos`

- Formato: vertical 9:16, 1080×1920, 30 fps.
- Duración objetivo: 30–40 segundos.
- Fuente principal: grabación de pantalla del workflow de prueba.
- Cámara: usar talking head de Sergio solo si existe un bruto limpio; si no, pantalla
  más voz mantienen el video válido.
- Texto de pantalla: `ENTRADA`, `REGLA`, `SALIDA`; una idea visible por beat.
- Subtítulos: quemados, legibles y en rail lateral/espacio libre; no crear una franja
  inferior que empuje el contenido hacia arriba.
- Audio: limpiar pausas y errores, conservar la explicación y normalizar al final.
- No usar datos de clientes, credenciales, tokens, IDs reales ni pantallas de login.

## Material que debe entregar la sesión de rodaje

Guardar los brutos sin sobrescribirlos en:

`C:\dev\proyectos\onia-hermes\videos\marca-personal\2026-09-21\raw\`

Convención sugerida:

- `01-feed-3-nodos-screen.mp4`
- `01-feed-3-nodos-camera.mp4` (opcional)
- `01-feed-3-nodos-voice.wav` (opcional)

El workflow debe usar datos ficticios y enseñar ambas ramas del `IF`. Si todavía no
existe el bruto, no crear un render de relleno ni marcar la pieza como terminada.

## Salida esperada

`C:\dev\proyectos\onia-hermes\videos\marca-personal\2026-09-21\renders\01-feed-3-nodos-v1.mp4`

Conservar también el proyecto/plan de edición y no sobrescribir fuentes. Usar como
referencia técnica los proyectos existentes en `videos/claude-vs-claudecode` y
`videos/tiktok-20260917`: cortes, overlays, subtítulos, audio y validación en una
salida reproducible.

## QA antes de devolverlo

1. Ver el render completo, no solo un frame.
2. Confirmar que se entienden las dos salidas del `IF` y el cierre
   `ENTRADA → REGLA → SALIDA`.
3. Revisar que los subtítulos no tapen nodos ni botones importantes.
4. Comprobar duración, resolución, fps, audio y reproducción con `ffprobe`/reproductor.
5. Reportar rutas exactas de entrada y salida, duración y problemas pendientes.

## Cola posterior

Cuando Sergio valide el lenguaje visual del primer corte, continuar con los guiones
2–6 del mismo archivo. No editar los contenidos de Samuel ni publicar desde esta
sesión.
