# Botón de carga animado — React + Framer Motion

- **Fuente:** https://www.instagram.com/p/Dbx6AWGz_av/ · 6,7 s · sin voz (música)
- **Visto:** 2026-08-11 (Gemini nativo)
- **Archivo:** `Instagram-Dbx6AWGz_av.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-11-Instagram-Dbx6AWGz_av.md](transcripciones/2026-08-11-Instagram-Dbx6AWGz_av.md)

## Qué dice realmente

Clip de 6,7 segundos, sin locución, música instrumental de fondo. Mitad superior: un botón
naranja de subida de archivo (`Document.pdf`) que al clic pasa por tres estados animados —
`Upload` → `Uploading...` (con ícono girando) → `Completed` (con check). Mitad inferior:
editor de código abierto en un archivo rotulado `codeXR.ft` / "Upload Button Code Snippet",
pero **el código en sí no se lee en ningún frame** — ni el timeline de Gemini ni el verbatim
(no hay locución) capturan una sola línea real, solo el rótulo del archivo. El texto en
pantalla nombra "React" y "Framer Motion" como herramientas, y el único CTA es
`Comment "Code" for source code`: el código real queda gateado detrás de un comentario, no
está en el video.

## Veredicto: HUMO — demo de un patrón estándar, sin una sola línea de código real

Tres estados de botón (inactivo → cargando → éxito) son el patrón de carga más básico que
existe en UI; no hay técnica nueva que ver porque no hay código visible, solo el resultado. El
video no enseña nada — es cebo de comentarios ("Comment Code") y, como nosotros no comentamos,
ni siquiera tenemos el snippet prometido para evaluarlo. El mecanismo de fondo (prometer un
recurso a cambio de un comentario) ya está catalogado como hallazgo transversal de la tanda
2026-08-09 en `INDEX.md`; este video no agrega nada nuevo a esa conclusión, solo la repite en
otro nicho (UI/frontend).

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| web-factory | Nada que adoptar: el estado idle/carga/éxito en botones ya está cubierto por las reglas propias de diseño (`design-quality.md` — hover/focus/active "que se sientan diseñados") |
| Contenido ONIA | Confirma, no descubre, el mecanismo comentario→recurso; no sumarlo como hallazgo nuevo, ya vive en `INDEX.md` |

## Riesgo

Ninguno operativo. El único riesgo es de contenido: replicar "comentá para el código" sin
tener un recurso real detrás (acá tampoco lo tenemos — el propio video nunca lo mostró) es
spam de bajo valor, no un lead magnet.
