# Lectura completa — 2026-08-11-Instagram-Dbxir78tR3R

- Fuente: https://www.instagram.com/p/Dbxir78tR3R/
- Duración: 78.0 s
- Motor: Gemini nativo (video + audio) · verbatim: Whisper/Speaches
- Ingresado: 2026-08-11 por `scripts/video-intake.mjs` (automático, SIN veredicto)

---

Aquí tienes el análisis detallado del video:

---

### 1. RESUMEN
El video explica cómo crear un sistema automatizado donde una aplicación (vía analíticas de PostHog y agentes de IA) analiza el comportamiento de los usuarios y le "enseña" al desarrollador qué aspectos debe mejorar del producto. El creador critica los cursos y bootcamps costosos que cobran miles de dólares por enseñar desarrollo/gestión de productos, proponiendo en su lugar una arquitectura gratuita utilizando herramientas como PostHog, conectores MCP, bases de datos (Supabase/Notion/Airtable) y NotebookLM para generar guías y audios de aprendizaje automático.

---

### 2. TIMELINE POR SECCIONES

#### [00:00 - 00:11] Crítica a los cursos costosos de gestión y "vibe coding"
* **QUÉ SE VE:** Creador hablando con un micrófono portátil; superposición de imagen de un aula llena de alumnos con el título *"Apps are vibe coding humans"*; sitio web de Maven con el perfil de un instructor (*Colin Matthew*); lista de precios de asesorías por hora ($47/h a $300/h) y precios de bootcamps que van desde $999 hasta $30,000.
* **QUÉ SE DICE:** Explica que los cursos tradicionales están siendo reemplazados por aplicaciones de autoaprendizaje. Menciona que hay instructores ganando más de un millón de dólares al año cobrando precios exorbitantes por enseñar conceptos básicos de producto.

#### [00:12 - 00:31] Infraestructura inicial: App, PostHog, MCP y bases de datos
* **QUÉ SE VE:** Esquema de creación de app desde un prompt; landing de PostHog con comandos de instalación MCP (`npx @posthog/wizard@latest`); repositorios de GitHub para MCP de NotebookLM; lista de agentes de IA (*Claude Code*, *Codex*, *ChatGPT Work*); estructura de la tabla `product_lessons`; logos de bases de datos (*Airtable*, *Notion*, *Supabase*, *Google Sheets*); lista de canales de distribución (*Reddit*, *X*, *LinkedIn*, *TikTok*, *Product Hunt*) y gráficos de conversión en PostHog.
* **QUÉ SE DICE:** Muestra cómo conectar cualquier app a PostHog usando un comando MCP, vincularlo al agente de IA preferido, crear una tabla llamada `product_lessons` en una base de datos y conseguir los primeros usuarios para empezar a generar datos de uso.

#### [00:32 - 00:53] Configuración del "Skill" y generación de contenido en NotebookLM
* **QUÉ SE VE:** Interfaz con el prompt completo del "Skill"; esquemas animados que muestran cómo la IA lee la tabla de lecciones, examina embudos de conversión, grabaciones y errores en PostHog, extrae el mayor punto de fricción (*"highest leverage"*), registra una nueva lección y la envía a NotebookLM para generar resúmenes en audio, guías de estudio, flashcards y quizzes. Foto de un joven escuchando auriculares.
* **QUÉ SE DICE:** Explica el funcionamiento del prompt para que la IA actúe como un tutor de producto. La IA identifica qué es lo que el desarrollador aún no comprende sobre sus usuarios, guarda esa lección y crea material de estudio educativo para escucharlo.

#### [00:54 - 01:10] Bucle de mejora continua del producto
* **QUÉ SE VE:** Diagramas con puntos de abandono de usuarios (*"all three quit here" -> "fix this first"*); ciclo de despliegue de cambios (*one change -> deploy -> live*); diagrama de evaluación de impacto por la IA; flujo interactivo entre la app, PostHog y solicitudes de extracción (*pull requests*).
* **QUÉ SE DICE:** Detalla cómo el sistema enseña exactamente qué partes confunden a los usuarios y qué arreglar primero. Al implementar el cambio, la IA evalúa en la siguiente ejecución si la métrica mejoró y avanza hacia un aprendizaje más complejo.

#### [01:11 - 01:17] Conclusión y Llamado a la Acción (CTA)
* **QUÉ SE VE:** El creador hablando a cámara en su habitación debajo de un ventilador de techo.
* **QUÉ SE DICE:** *"You didn't need to pay $8,000 for a course that'll teach you basic Claude Code. Follow your boy instead. I'll teach you how to build cool stuff like this for free."*

---

### 3. TEXTO EN PANTALLA

* **00:00:** `Apps are vibe coding humans`
* **00:04:** `maven.com` | `Colin Matthew` | `25.6K Subscribers` | `Founder of Tech for Product...`
* **00:07:** Precios/hora: `Product School $300 / hr`, `Fly Camp $200 / hr`, `Outskill $143 / hr`, `Designlab $83 / hr`, `Opsgility $47 / hr`
* **00:08 - 00:11:** Cursos: `Designlab vibe coding camp $999`, `Maven vibe coding camp $1,150`, `Product School vibe coding cert $2,999`, `$4,000`, `$9,999`, `$30,000`
* **00:12:** `one prompt` | `a phone app` | `a web app`
* **00:15:** `PostHog` | `Shift your product into self-driving mode`
* **00:16:** `npx @posthog/wizard@latest`
* **00:17:** `npx @posthog/wizard mcp add https://mcp.posthog.com/mcp`
* **00:18:** Repositorios GitHub: `Pantheon-Security/notebooklm-mcp-secure`, `jacob-bd/notebooklm-mcp-cli`, `Cezial/notebooklm-mcp-server`, etc.
* **00:21:** Agentes IA: `Claude Code $20/mo`, `Claude Cowork $20/mo`, `Codex $20/mo`, `ChatGPT Work $20/mo`, `Perplexity $20/mo + credits`, `Hermes Free`, `OpenAI Free`
* **00:22:** Tabla: `product_lessons` (`id`, `created_at`, `evidence`, `lesson`, `recommended_change`, `success_metric`, `result`)
* **00:24:** Bases de datos: `Airtable`, `Notion`, `Supabase`, `Google Sheets`
* **00:26:** Canales: `Reddit`, `X`, `LinkedIn`, `TikTok`, `Instagram`, `Product Hunt`, `Cold outbound`
* **00:30:** Tableros PostHog: `View Product`, `Add to cart`, `Checkout`
* **00:32 - 00:33:** Prompt del Skill:
  > `SKILL - THE APP TEACHES YOU`  
  > `You are the product tutor for [my app]. Every time this skill runs:`  
  > `1. Read every row already in product_lessons.`  
  > `2. Query PostHog for new funnels, retention, user paths, session replays, surveys and errors since the last lesson.`  
  > `3. Inspect the app and summarize what I changed since then.`  
  > `4. Judge whether the last recommended change actually moved its success metric.`  
  > `5. Find the single highest-leverage thing I still do not understand about my users.`  
  > `6. Return the evidence, the lesson, one recommended change and one measurable success metric.`  
  > `7. Insert that as the next row in product_lessons.`  
  > `8. Send the lesson to NotebookLM and generate an Audio Overview, study guide, flashcards and a quiz.`  
  > `9. Never repeat a previous lesson -- use the history to make each one more advanced than the last.`
* **00:47:** Materiales NotebookLM: `audio overview`, `study guide`, `flashcards`, `quiz`
* **00:55:** `all three quit here`, `fix this first`
* **01:01:** `one change`, `deploy`, `live`
* **01:04:** `what it told you`, `what happened`, `it worked, here is the harder one`
* **01:07:** `your app`, `PostHog`, `a pull request`

---

### 4. CONCLUSIÓN / CTA
**Llamado a la acción:** El creador invita al espectador a no gastar miles de dólares en cursos tradicionales de programación o gestión de producto con IA, e insta a seguir su cuenta (*"Follow your boy instead"*) para aprender a construir flujos de trabajo avanzados y gratuitos.

---

## Transcripción literal (Whisper / Speaches, verbatim)

Modelo: `Systran/faster-whisper-small` · 43 segmentos · 318 palabras · 77.9 s

```
[00:00.0 -> 00:03.7] Vibe coding courses are being replaced by self-learning apps.
[00:03.9 -> 00:05.1] Bro, look at this guy right here.
[00:05.2 -> 00:06.7] He makes over a million a year.
[00:06.7 -> 00:07.6] It's not just him.
[00:07.7 -> 00:09.8] These courses go for like 30 grand sometimes.
[00:10.0 -> 00:12.1] Let's steal that $30,000 back.
[00:12.3 -> 00:13.6] Vibe code a mobile app or web app.
[00:13.7 -> 00:14.5] It can be super shitty.
[00:14.6 -> 00:16.5] Sign up for this platform and connect your app
[00:16.5 -> 00:17.3] to it with this command.
[00:17.4 -> 00:20.5] Now connect it and one of these notebook LM MCP tool
[00:20.5 -> 00:21.9] to your AI agent of choice.
[00:22.1 -> 00:23.9] Create a lessons table like this
[00:23.9 -> 00:25.4] in one of these database providers.
[00:25.6 -> 00:28.1] Now figure out how to get like a few users on your app.
[00:28.1 -> 00:28.8] This is the whole thing.
[00:28.9 -> 00:29.7] Try one of these methods.
[00:29.7 -> 00:31.9] You'll see how the user's user app on post hoc.
[00:32.0 -> 00:33.9] Now create a skill with this prompt.
[00:34.0 -> 00:36.0] We want your AI to read the lessons table
[00:36.0 -> 00:38.4] and inspect how users are using your app.
[00:38.4 -> 00:40.1] Find the single highest leverage thing
[00:40.1 -> 00:41.9] that you don't understand about your users.
[00:42.1 -> 00:44.6] Save that as a new lesson in the product lessons table
[00:44.6 -> 00:46.6] and then send that lesson to notebook LM
[00:46.6 -> 00:48.9] which will generate a series of things to learn from
[00:48.9 -> 00:51.4] like audio overviews and flash guides and stuff.
[00:51.5 -> 00:53.6] Now actually listen to it and try to learn.
[00:53.8 -> 00:55.9] It'll teach you how people are using your app.
[00:56.0 -> 00:57.5] You know, what parts are confusing them
[00:57.5 -> 00:58.6] which is probably most of it
[00:58.6 -> 00:59.6] and tell you exactly why
[00:59.6 -> 01:01.1] and what you need to improve next.
[01:01.3 -> 01:03.0] Then go and make that change.
[01:03.2 -> 01:04.4] Now next time you run the skill
[01:04.4 -> 01:05.8] it will read that lessons table
[01:05.8 -> 01:07.2] and see what the fuck happened
[01:07.2 -> 01:09.2] like our people using your app better
[01:09.2 -> 01:10.7] and move on to the next lesson.
[01:10.8 -> 01:12.7] You didn't need to pay $8,000 for a course
[01:12.7 -> 01:14.5] that'll teach you basic Claudecoe.
[01:14.5 -> 01:15.4] Follow your boy instead.
[01:15.6 -> 01:17.8] I'll teach you how to build cool stuff like this for free.
```
