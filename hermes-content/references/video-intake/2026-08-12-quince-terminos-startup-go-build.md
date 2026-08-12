# 15 términos de estrategia startup en 20 segundos — "go build"

- **Fuente:** https://www.instagram.com/p/DZVPs-ARxMP/ · 20.4 s · con voz (inglés)
- **Visto:** 2026-08-12 (Gemini nativo)
- **Archivo:** `Instagram-DZVPs-ARxMP.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-DZVPs-ARxMP.md](transcripciones/2026-08-12-Instagram-DZVPs-ARxMP.md)

## Qué dice realmente

Talking-head con micrófono de mano, en inglés. Abre con un rótulo tipo quiz
(*"startup knowledge / strategy edition"*) y a partir de ahí dispara **quince términos de
manual de negocios, uno por segundo**, cada uno acompañado de una infografía de apoyo que
aparece y desaparece:

- **00:00-00:02** — TAM / SAM / SOM (círculos concéntricos)
- **00:02-00:05** — beachhead market · network effects · switching costs
- **00:06-00:09** — competitive advantage · barriers to entry · market timing · category
  creation (con logos de Airbnb y Uber como ejemplo)
- **00:10-00:15** — vertical SaaS vs horizontal SaaS · platform models · marketplaces ·
  aggregators
- **00:15-00:19** — red ocean (tiburones) / blue ocean (ballena), vuelta a cámara y cierre

**Ninguno de los quince se define.** El video los nombra, muestra un gráfico un segundo y
pasa al siguiente. El cierre es la tesis entera: *"If you know those, you're basically a
CEO."* + "go build".

Esa afirmación final es el producto que vende el reel y **no tiene sustento**: reconocer
vocabulario no es estrategia. Los términos son estándar de escuela de negocios, no
hallazgos del autor; ni las infografías ni el audio aportan un dato, un número o una fuente
verificable — no hay nada que marcar "a verificar" porque no hay ninguna afirmación
comprobable más allá del glosario.

## Veredicto: HUMO

Vende como conocimiento avanzado el glosario básico del sector, y encima con la promesa
inflada de que memorizarlo te vuelve CEO. Cero técnica, cero flujo de trabajo, cero código,
cero definiciones.

**La excepción de "referencia de interfaz" no aplica:** lo que aparece en pantalla son
infografías de manual (círculos concéntricos, matriz 2x2, tiburones/ballena), no una UI
navegable — no hay ningún patrón que valga reconstruir en `ui-patterns/`.

**Y la técnica de producción tampoco es nueva para nosotros:** overlay sincronizado
palabra→elemento a cadencia de ~1 por segundo es exactamente lo que ya hace `editor-videos`
(sync-plan) sobre HyperFrames, que ya está instalado. Duplica algo que tenemos.

Sumado: está en inglés y le habla a la audiencia de startups de EE.UU. Nuestro comprador es
el dueño de un negocio formal boliviano — ferretería, clínica dental, veterinaria — que no
compra por "beachhead market".

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Marketing con IA | **No copiar el formato.** Si alguna vez se usa la cadencia 1-concepto-por-segundo, cada tarjeta debe traer su definición en una línea y en español de Bolivia; nombrar sin explicar no le vende a un dueño de negocio |
| Editor de videos | Ninguna. El overlay sincronizado por palabra ya existe en `editor-videos` + HyperFrames; el video no aporta técnica que agregar |
| ui-patterns | Ninguna. Son infografías de manual, no interfaz — no hay patrón reconstruible |
| Estrategia / posicionamiento | Ninguna. El único término que roza una decisión nuestra (vertical vs horizontal SaaS) ya está decidido a favor de vertical-first, y el video solo lo nombra: no aporta argumento a revisar |

## Riesgo

Riesgo de tiempo y de posicionamiento. Copiar este formato tal cual nos haría producir
contenido en inglés, para una audiencia que no nos compra, sonando a agencia genérica —
justo en el momento en que no hay portafolio publicado y cada pieza debería estar
construyendo prueba de trabajo real.

**Aviso de calidad de lectura (aplica a este intake, no al video):** la transcripción de
Whisper small degradó el audio — fundió "TAM, SAM, SOM" en `TAMSAMSOM` y convirtió el
cierre "go build" en `Go Bill. Cheers.`; la lectura de Gemini leyó el texto en pantalla como
`startegy edition` y `vertical Sass`. Los verbatims de este archivo no son citables al pie
de la letra sin volver al video.
