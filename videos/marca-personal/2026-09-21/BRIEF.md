---
workflow: general-video
flow: automation
storyboard: no
message: "Un lead no se pierde cuando el flujo recibe, valida, registra y avisa con pasos verificables."
destination: instagram-reels-and-tiktok
aspect: 1080x1920
language: es
audience: "Dueños y operadores de negocios que están empezando a automatizar"
length: "30-40s"
angle: "Microtutorial de workflow real"
narration: yes
---

## Intent

Primer corte de marca personal de Sergio para enseñar un workflow mínimo y
copiable en n8n: `Webhook → IF → Google Sheets / Append Row → Telegram / Send Message`. Webhook recibe
`name`, `phone`, `service` y `source`; IF valida `phone` y `service`; la rama
true registra con `Append Row` y avisa con `Send Message`; la rama false pide
el dato faltante. El bruto disponible es talking head vertical limpio. Las
pantallas son mockups editoriales del flujo, no capturas simuladas de n8n.

## Assets

- `raw/01-feed-3-nodos-camera.mp4` — cámara original de Sergio, 1080×1920, fuente principal.
- `work/base-cut.mp4` — corte editorial de 40 s con audio a 48 kHz.
- `index.html` — composición de mockups, PiP y subtítulos.

## Customizations

- Subtítulos quemados en rail lateral o espacio libre, nunca sobre nodos ni botones.
- Overlays escasos: `ENTRADA`, `VALIDACIÓN`, `REGISTRO`, `AVISO`.
- Mostrar explícitamente las dos ramas del nodo `IF`.
- Cierre visual: `ENTRADA → VALIDACIÓN → REGISTRO → AVISO`.

## Notes

- Estado actual: bruto recibido, corte base preparado y composición en validación.
- Usar solo datos ficticios. No mostrar clientes, credenciales, tokens, IDs ni pantallas de login.
- Cortar silencios y redundancias sin eliminar pasos de la enseñanza.
- Normalizar el audio al final. Sin música: Sergio puede añadirla en la plataforma.
- No publicar desde este proyecto.
