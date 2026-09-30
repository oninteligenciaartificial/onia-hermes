# Capturas para la pauta dental (D1 y D4)

Las leen `briefs/ads/onia-platform-dental-meta-d1-los-de-manana.json` y
`…-d4-tratamiento-a-medias.json`. Mientras falte un archivo, el renderer pone en esa lámina
«Falta la captura aprobada del producto», así que ninguna pieza sale sin pantalla real.

**Dónde se sacan:** en la **1.0 publicada**, en la **cuenta demo** dental. Nunca en una cuenta con
pacientes reales: un nombre real en un anuncio es un incidente (el producto guarda datos de salud).
Se revisan una por una antes de guardarlas.

**Por qué van acá y no en `docs/recorrido/capturas/`:** esa carpeta está en `.gitignore`
(`hermes-content/docs/recorrido/**/*.png`) y se regenera en cada vuelta del recorrido. El carrusel del
21-sep apuntaba ahí: en cualquier máquina que no fuera la que lo armó, sus capturas no existían.

| Archivo | Pantalla | Qué tiene que verse |
|---|---|---|
| `agenda-de-hoy.png` | `/agenda` | La agenda del día con varias citas y más de un profesional |
| `pendientes-confirmador.png` | `/pending` | La propuesta del Confirmador para un paciente de mañana sin confirmar, con el mensaje escrito y el botón «Enviar yo mismo por WhatsApp» |
| `ficha-plan-de-tratamiento.png` | ficha de un paciente | El plan de tratamiento con uno **en progreso** (por ejemplo, una endodoncia) |
| `pendientes-tratamiento-a-medias.png` | `/pending` | La propuesta del tratamiento a medias: nombra el tratamiento y trae el link de reserva |

Para que aparezcan las dos propuestas de `/pending`, la demo necesita una cita de mañana sin confirmar y un
tratamiento `EN_PROGRESO` con más de 21 días sin actividad y sin cita futura. Son los mismos datos que
pide la demo dental del plan de 14 días (`handoff/sesion-madre.md` §2).

Formato: PNG, ventana de escritorio de 1440 px de ancho como mínimo, sin barra del navegador.
