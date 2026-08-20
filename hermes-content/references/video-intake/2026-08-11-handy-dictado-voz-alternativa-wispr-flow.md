# Handy — dictado por voz gratis, alternativa open source a Wispr Flow

- **Fuente:** https://www.instagram.com/p/DbwHXBjMhX8/ · 78.9 s · español (con voz)
- **Visto:** 2026-08-11 (Gemini nativo + verbatim Whisper)
- **Archivo:** `Instagram-DbwHXBjMhX8.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-DbwHXBjMhX8.md](transcripciones/2026-08-11-Instagram-DbwHXBjMhX8.md)

## Qué dice realmente

Creador a cámara + captura de pantalla, subtítulos quemados. Presenta **Handy** como la
mejor alternativa gratuita a Wispr Flow para dictar en vez de escribir:

- **00:00-00:10** — Rótulo *"Escribir era de pobres. Ya no"*. Cita: *"si usan
  transcriptores para hablar en vez de escribir y no quieren pagar Whisper Flow, para mí
  esta la mejor alternativa, Handy, es gratis, es open source, multiplataforma y es muy
  fácil de usar"*.
- **00:10-00:30** — Configuración: atajo `Option + Space`, selector de modelo de
  transcripción local. En pantalla: `Canary 180M Flash (Active) — "Tiny and instant, runs
  well on any hardware"` y `Whisper Base — "99-language speech-to-text with translation"`,
  clasificados por precisión y velocidad. Cita: *"a mí por ejemplo me gusta canary
  flash"*.
- **00:30-00:41** — Funciona a nivel de sistema: activa el atajo con la Terminal (Claude
  Code) abierta. Cita: *"está integrado en todo, o sea en cualquier ventana puedo llamar a
  este programa... tocando mi atajo de teclado empieza a escuchar y cuando lo vuelvo a
  tocar, ya me transcribe"*.
- **00:42-00:58** — Prueba en vivo: dicta un prompt largo, después susurra, después habla
  rápido. Los tres casos aparecen transcritos correctamente en la terminal (rótulo visible:
  `Claude Code v2.1.224`).
- **00:59-01:20** — Resultado: *"rapidísimo, o sea es rapidísimo... esto te lo entiende
  perfectamente chat, cloud, cualquiera y en serio hablando se dicen muchas más cosas, se
  da mucho más contexto que escribiendo y permite acelerar un montón"*.

Sin venta, sin marca propia — es una recomendación directa de instalar una herramienta
gratuita de terceros.

## Veredicto: SIRVE YA

No es una demo de humo: hay una prueba en vivo en condiciones adversas (susurro, habla
rápida) transcrita en tiempo real dentro de una Terminal corriendo Claude Code — exactamente
nuestra herramienta de trabajo diaria. Costo cero (open source) y el problema que ataca es
real: escribir prompts largos a mano es más lento que dictarlos.

**VERIFICAR antes de instalar en cualquier máquina del equipo** (nada de esto está
confirmado, solo lo afirma el video):

- Que "Handy" sea realmente multiplataforma **con soporte Windows** — la demo es en Mac
  y el equipo ONIA trabaja en Windows 11. Si es Mac-only, el alcance se reduce a quien
  tenga Mac.
- Repositorio, licencia y mantenedor — es software de terceros con acceso al micrófono y
  a un atajo global de teclado, requiere la misma diligencia que cualquier instalación
  nueva en una máquina de trabajo.
- Que el modelo local "Canary 180M Flash" transcriba bien en español de forma consistente
  — la demo lo logra, pero es un solo caso de prueba, no garantía general.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Equipo ONIA (productividad interna) | Probar Handy en una máquina primero; verificar soporte Windows y precisión en español antes de recomendarlo al equipo |
| Editor de videos / ver-videos | Anotar Canary 180M Flash como modelo alternativo a evaluar; no reemplaza Speaches (transcribe video ya grabado, caso de uso distinto) |

## Riesgo

Instalar software de terceros con hook de teclado global y acceso al micrófono sin revisar
el repositorio primero. Y no confundirlo con reemplazo del pipeline de transcripción de
video (Speaches / `faster-whisper-small`): ese sigue siendo para archivos ya grabados, Handy
es para dictado en vivo mientras se escribe.
