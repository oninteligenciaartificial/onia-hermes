# "8 skills worth learning in 2026" — carrusel de curaduría de YouTube ajeno

- **Fuente:** https://www.instagram.com/p/DbiqesRj3nL/ · carrusel de 10 láminas · inglés · @curiosenn
- **Visto:** 2026-08-12 — carrusel, láminas leídas con visión propia (sin Gemini)
- **Archivo:** `car2/DbiqesRj3nL/` (10 láminas + `caption.txt`, no versionado)
- **Cobertura:** caption íntegro + 6 de 10 láminas (s01, s02, s05, s06, s08, s10). Las 4 no
  leídas (s03, s04, s07, s09) son la misma plantilla con las skills 2, 3, 6 y 8 del caption
  — inferencia por el patrón `s0N = skill N-1`, verificado en las cuatro que sí leí.

## Qué dice realmente

Estructura de 10 láminas: portada + 8 skills + cierre de captación.

- **s01 (portada)** — fondo blanco, un "8" gigante en negro, *"8 Skills worth learning in
  2026"*, silueta negra de una persona frente a una laptop. Sin cara, sin marca propia.
- **s02-s09 (una por skill)** — plantilla idéntica en gris oscuro: marca de agua "Curiosen"
  arriba a la izquierda, el número y nombre de la skill como título, y **una captura de
  pantalla de un video de YouTube ajeno** (miniatura + título + canal + vistas + duración).
  Las skills, según el caption: Communication · Negotiation · Storytelling · Personal
  Branding · AI Literacy · Content Creation · Sales · Networking.
  - `1. Communication` → *"How To Speak Like The 1% Elite"*, Natalie Dawson, 15:18, 44 lakh vistas
  - `4. Personal Branding` → *"How to Build a Personal Brand (Full Course)"*, Caleb Ralston, 6:22:28
  - `5. AI Literacy` → *"AI Complete OneShot Course for Beginners"*, Apna College, 1:06:25
  - `7. Sales` → *"The Ultimate Sales Training for 2026 [Full Course]"*, Alex Hormozi, 2:34:01
- **s10 (cierre)** — fondo blanco, texto puro: pregunta si querés convertir tus skills en
  ingreso online, lista de seis cosas que promete la guía (crecer en Instagram, conseguir
  primeros clientes, vender productos digitales, freelancing, múltiples fuentes de ingreso,
  negocio online sostenible) y el disparador: comentar **"Guide"** para recibirla por DM.

Todo el contenido propio del carrusel son 8 palabras (los nombres de las skills). El resto es
captura de pantalla de trabajo de otros. Detalle revelador: las vistas están en **"lakh"**
(44 lakh = 4,4 millones), o sea las capturas salen de un YouTube en locale indio — es
literalmente buscar en YouTube y hacer screenshot. Costo de producción ≈ 0.

## Veredicto: HUMO

No hay técnica, ni herramienta, ni dato, ni capacidad. Hay una lista de ocho palabras genéricas
que cualquiera escribe sin investigar, respaldada con la autoridad prestada de ocho creadores
que no participaron. El único mecanismo real es el **cebo de comentario** para farmear
comentarios y alcance, y ese mecanismo **ya está documentado en el corpus** —
[roundup de herramientas de diseño](2026-08-11-roundup-herramientas-diseno-cebo-comentario.md),
donde ya quedó anotado que depende del token de Instagram (bloqueo S6). Duplicarlo no aporta.

No aplica la excepción de "referencia de interfaz": la única UI que se ve es la de YouTube, y
la plantilla del carrusel (fondo plano, título, una captura centrada) no tiene nada que
reconstruir en `ui-patterns/`.

Lo único con un gramo de novedad frente a la ficha del 11-ago: acá el cebo no entrega "un
link" sino un **lead magnet con índice** — la última lámina enumera qué contiene la guía antes
de pedir el comentario. Es una diferencia de guion, no una capacidad. Y como ONIA hoy no tiene
guía ni token de IG, no se puede ejecutar: prometer una guía que no existe sería fabricar una
oferta.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Marketing con IA | **Ninguna acción nueva.** El cebo de comentario ya está registrado y gateado por S6. Cuando S6 se desbloquee, la mejora de guion es una sola: si se usa cebo, la lámina final lista qué contiene el lead magnet, no solo lo nombra |
| Ventas / colaboradores comerciales | Baja prioridad: el curso gratuito de Hormozi (2:34:01) podría servir de material de entrenamiento para los 2 colaboradores. **A verificar** que siga siendo gratis, público y vigente — el carrusel es la única fuente y no se verificó nada |
| Contenido | Nada. Nuestro pipeline de carruseles ya existe; este formato solo se distingue por no producir nada propio |

## Riesgo

Tres, y el primero es el que importa:

1. **Audiencia equivocada.** Este carrusel le habla a un aspirante a freelancer que quiere
   "ingreso online". El comprador de ONIA es el dueño de un negocio formal boliviano. Copiar
   el formato nos correría del carril B2B hacia el ruido de "hacé plata en internet", que es
   exactamente lo contrario a la autoridad que hace falta para vender un SaaS.
2. **Autoridad prestada.** Un feed hecho de capturas de videos ajenos no construye portafolio
   — y el problema real que tenemos es la falta de portafolio propio, que es lo que mantiene
   el precio en Landing 790 / Web Pro 1.500.
3. **Prometer lo que no existe.** El mecanismo exige entregar una guía por DM. Sin guía y sin
   token de IG (S6), copiar el CTA sería anunciar algo que no se puede cumplir. Además, la
   entrega automática de DM por comentario depende de permisos de la API de mensajería de
   Instagram: **a verificar** cuáles y bajo qué condiciones, no darlo por hecho.
