# Semana 4 (propuesta) — Repos de GitHub que valen la pena, y cómo saberlo

Investigado el 29-sep-2026 para Sergio Urcullo. 10 verticales + 1 YouTube horizontal, con la vara de
[`BRIEF-ESCRITOR.md`](BRIEF-ESCRITOR.md) y las fórmulas de
`references/marca-personal/FORMULAS-REFERENTES.md`. Sin fechas de calendario: los códigos `G01…G11`
se ubican en el `MAPA.md` cuando Sergio Urcullo apruebe la semana.

**Cómo se hizo.** GitHub Trending (diario, semanal, mensual; Python, TypeScript y JavaScript
semanal) leído el 29-sep; búsqueda con `gh search repos` / `gh api search/repositories`
(creados desde el 15-ago y desde el 29-ago, por palabra: claude-code, mcp, n8n, agents, whatsapp,
skills); README de 22 candidatos leídos enteros o por sección; licencia abierta en el archivo
cuando la API decía `NOASSERTION`; issues abiertos contra cerrados contados con la API de búsqueda.

**Límite, dicho una vez.** Ninguno de los 15 se instaló ni se ejecutó (instrucción de la tarea).
Todo lo que dicen los guiones sale del README o de los archivos del repo, y se dice así: «según su
README», «su documentación dice». Nunca «lo instalé» ni «lo probé». Antes de grabar: recontar
estrellas e issues y releer el comando del README (cambian rápido).

**Regla de la serie que se mantiene:** sin estrellas en pantalla en los verticales (envejecen,
`PARA-PUBLICAR-APPLE-REPOS.md`). Solo el YouTube usa números, siempre con la fecha en que se vieron.
Ninguno de los 10 repos del carrusel ya publicado (anthropics/skills, claude-plugins-official,
cloudflare/skills, gsap-skills, claude-mem, Understand-Anything, ponytail, caveman, karpathy-skills,
ECC) se repite acá.

---

## 1. Los 15 repos

⭐ = estrellas vistas el **29-sep-2026** (API de GitHub). «Tendencia» = lugar y suba en
github.com/trending ese día. «Issues» = issues abiertos / cerrados (sin contar pull requests).

| # | Repo · URL | ⭐ y tendencia (29-sep) | Qué hace · para quién | Señales de confianza | Riesgo |
|---|---|---|---|---|---|
| 1 | **paperclipai/paperclip** · https://github.com/paperclipai/paperclip | 93.890 · #1 semanal (+10.518) · #4 diario | Servidor Node + panel para manejar equipos de agentes (Claude Code, Codex, Cursor, OpenClaw) «como una empresa»: organigrama, metas, presupuesto mensual por agente, aprobaciones, auditoría. Para quien corre muchos agentes a la vez | Org; MIT; creado 2-mar-2026; push 29-sep; instalador con suma SHA-256 | **Issues 2.571 / 914 y 3.464 PR abiertos** (desbordado). Telemetría **activada por defecto** (se apaga con `PAPERCLIP_TELEMETRY_DISABLED=1`). Instalador `curl … \| bash`; el README admite que la suma se sirve del mismo origen. Agentes 24/7 = gasto |
| 2 | **vectorize-io/hindsight** · https://github.com/vectorize-io/hindsight | 41.939 · #3 semanal (+15.537) · #3 diario | Memoria para agentes que «aprende» (retain / recall / reflect). Servidor Docker + MCP; paquete para agentes de código | Org con paper en arXiv; MIT; **issues 76 / 1.168**; el README separa cifras reproducidas por terceros de las autodeclaradas | Necesita un LLM (clave o suscripción Claude/ChatGPT). Para agentes de código arma memoria **desde tu historial de git y tus sesiones pasadas**, automático. Empuja a su nube paga |
| 3 | **debpalash/VoiceStudio** · https://github.com/debpalash/VoiceStudio | 46.222 · #1 diario (+3.221) · #4 semanal | Alternativa local a ElevenLabs: clonar y diseñar voz, doblar video, dictar, transcribir, audiolibros (646 idiomas). App Electron, API local y MCP. Creadores | Usuario (India); **AGPL-3.0**; **issues 30 / 929**; CI y releases | AGPL (si lo ofrecés como servicio modificado, publicás tu código). Cada modelo con licencia propia. **Clonar voces solo con permiso** (lo dice el repo). Instalador `curl … \| sh` |
| 4 | **anthropics/knowledge-work-plugins** · https://github.com/anthropics/knowledge-work-plugins | 25.824 · mensual (+2.190) | 11 plugins por puesto (ventas, soporte, marketing, finanzas, legal, datos…) para Claude Cowork y Claude Code. Solo markdown y JSON. Dueños y equipos chicos | Oficial Anthropic; Apache-2.0; push 29-sep; issues 70 / 13 | Los conectores (`.mcp.json`) le dan acceso a tus herramientas (CRM, Slack, correo). Bajo riesgo si solo leés los archivos |
| 5 | **anthropics/commerce-agents** · https://github.com/anthropics/commerce-agents | 3.093 · búsqueda (creado 1-sep) | Referencia de dos agentes: uno de compras para clientes y uno de back office para el comercio. `docs/safety.md` separa lo que se controla en código de lo que se le pide al modelo | Oficial; Apache-2.0; ficticio a propósito (todo es «ACME») | **Issues desactivados** y 1 solo commit: es un ejemplo para leer, no un producto con soporte. Pide `ANTHROPIC_API_KEY` (pago por uso). Ejemplos sin autenticación |
| 6 | **NVIDIA/SkillSpector** · https://github.com/NVIDIA/SkillSpector | 18.562 · #19 mensual (+3.493) | Escáner de seguridad para skills de agentes antes de instalarlas: 71 patrones, puntaje 0-100, reporte JSON/Markdown/SARIF | Org NVIDIA; Apache-2.0; issues 66 / 184; push 28-sep | **Por defecto manda el contenido escaneado a un LLM**; `--no-llm` lo deja local. En scripts, «CAUTION» sale con el mismo código de éxito que «SAFE» (usar `--fail-on-findings`) |
| 7 | **cloudflare/security-audit-skill** · https://github.com/cloudflare/security-audit-skill | 22.972 · #12 semanal (+3.962) | Skill que convierte al agente en auditor de seguridad en seis fases; quien verifica un hallazgo nunca es quien lo encontró. Para quien tiene código propio | Org Cloudflare; MIT; README con límites («una corrida encontró cerca de la mitad») | **Issues 19 / 3** (marca grande, poca atención). Exige sandbox sin red para ejecutar código del objetivo; muchos subagentes = muchos tokens |
| 8 | **every-app/open-seo** · https://github.com/every-app/open-seo | 21.676 · #21 mensual (+7.653) | Alternativa abierta a Semrush/Ahrefs: palabras clave, posiciones, competencia, backlinks, auditoría; MCP y skills. Dueños con web | Org; MIT; push 20-sep | Pide clave de **DataForSEO** (pago por consulta). Versión alojada: el README habla de USD 10/mes y de un **28 % extra** por consulta. Enlace a DataForSEO **de afiliado**. Issues 86 / 44 |
| 9 | **mnfst/awesome-free-llm-apis** · https://github.com/mnfst/awesome-free-llm-apis | 8.605 · #4 JS semanal (+572) | Lista de APIs de LLM con plan gratis permanente, con límites y notas al pie. Jóvenes que empiezan, dueños que prueban | Org; CC0-1.0; issues 7 / 21 | **Datos del 19-21 ago** (último commit en `main`: 21-ago aunque la API diga push 29-sep). Notas: Gemini gratis puede usar tus mensajes para mejorar productos; Mistral entrena salvo opt-out; Cohere prueba = no comercial. La lista promociona manifest.build |
| 10 | **tt-a1i/archify** · https://github.com/tt-a1i/archify | 73.914 · #4 mensual (+48.030) | Skill que convierte una descripción (o un repo) en un diagrama HTML interactivo: arquitectura, flujos, secuencias. Creadores que explican procesos | MIT; v3.0.1 del 28-sep; push 29-sep | Mantenedor sin nombre público; **issues 116 / 96** (más abiertos que cerrados); sponsors con enlace de afiliado |
| 11 | **ayghri/i-have-adhd** · https://github.com/ayghri/i-have-adhd | 52.023 · #5 mensual (+26.854) | Skill de 10 reglas para que el agente responda con la acción primero, pasos numerados y sin relleno. README en español | Usuario con afiliación universitaria; MIT; issues 28 / 44 | Bajo (es texto). Se instala también **pegando un pedido que manda al agente a leer el `AGENTS.md` del repo**: ese archivo le da órdenes a tu agente |
| 12 | **LearnPrompt/awesome-seedance** · https://github.com/LearnPrompt/awesome-seedance | 1.540 · búsqueda (creado 26-ago) | Biblioteca de prompts de Seedance 2.5/2.0 con 25 plantillas por tipo de clip y skills. Creadores y comercios | MIT; se actualiza a diario | Es **vidriera de goodcase.ai** (links con UTM; se sincroniza desde su repo privado). Cifras que cambian: descripción dice 463 casos, README 593. Prompts tomados de posts de terceros |
| 13 | **davila7/claude-code-templates** · https://github.com/davila7/claude-code-templates | 32.136 · #8 semanal (+1.200) | CLI y catálogo (aitmpl.com) de agentes, comandos, hooks, MCP y skills para Claude Code; analítica y monitor de chats | Usuario (Daniel Avila); MIT; issues 94 / 94; push 29-sep | **El primer comando del README es de un sponsor** (Bright Data). Casi todos los comandos llevan `--yes` (instala sin preguntar). `--chats --tunnel` abre acceso remoto. Componentes de terceros con licencias propias |
| 14 | **max-sixty/worktrunk** · https://github.com/max-sixty/worktrunk | 8.459 · #18 mensual (+1.844) | CLI para git worktrees pensada para correr agentes en paralelo: `wt switch -c -x claude`, `wt list`, `wt remove` | Usuario con historia (desde 2013); MIT **o** Apache-2.0 (la API dice «Other»); **issues 34 / 631**; CI y cobertura; binarios firmados | Bajo. En Windows `wt` choca con Windows Terminal: por winget queda como `git-wt` |
| 15 | **mksglu/context-mode** · https://github.com/mksglu/context-mode | 24.203 · #11 mensual (+4.067) | Servidor MCP + hooks para que las salidas grandes de herramientas no llenen el contexto del agente; memoria de sesión en SQLite | Usuario; push 28-sep; issues 155 / 410 | **Licencia Elastic 2.0** (la API dice «Other»): no es código abierto, prohíbe ofrecerlo como servicio administrado. Logos de grandes empresas en el README **enlazan a `#`**. «98 % menos contexto» es cifra del autor. Ejecuta código en sandbox |

**Vistos y descartados (29-sep):** `Tencent/WeKnora` (RAG sobre documentos de empresa, MIT con
terceros; pesado de montar: candidato para otra semana de «tu negocio responde con tus PDFs»);
`mikehasa/golive-skill` (creado el 23-sep, alfa; README ejemplar en límites, pero esperar un mes);
`alibaba/open-code-review` (para devs; benchmark propio, menor recall admitido);
`anthropics/financial-services` (banca de inversión, fuera de audiencia); familia «Jev»
(`laya`, `kev`, `jev-*`: un modelo que no pudimos verificar); `ZJU-REAL/Easel` (publica en
plataformas chinas); `averygan/reclip` (descarga videos de cualquier sitio: derechos de autor;
README no leído); `darkzOGx/youtube-automation-agent` (automatiza un canal de YouTube; riesgo de
cuenta; README no leído).

---

## 2. Formas de contenido que salen de GitHub

### 2.1 Qué pieza sale de cada tipo de repo

| Código | Tipo de repo | Forma de la pieza | Fórmula base | La unidad que enseña | Ejemplo de esta lista | Trampa del formato |
|---|---|---|---|---|---|---|
| GH1 | Repo nuevo que explota en trending | **«El repo que encontré» en 60 s**: qué resuelve → para quién → comando del README → una señal de confianza → un riesgo | F2 | El comando + la señal | VoiceStudio (G06) | Hablar de estrellas: envejecen y no prueban nada |
| GH2 | Awesome list / lista curada | **«Awesome list → top 3 con un filtro»**: no el top 3 más lindo, el que pasa un criterio dicho en voz alta | F5 | El filtro (3 preguntas) | awesome-free-llm-apis (G01) | Leer la lista sin mirar la fecha de sus datos |
| GH3 | Repo de skills / prompts en texto | **«Copiá esta»**: una regla o paso concreto, en pantalla, con licencia que lo permite | F7 | El texto mismo | knowledge-work-plugins (G02), i-have-adhd (G08) | Copiar sin licencia o sin atribuir |
| GH4 | Repo oficial de referencia (ejemplo, no producto) | **«Abrí la fuente: la regla que usan ellos»**: un archivo de docs que cambia cómo pensás tu sistema | F5 | La regla, en una frase | commerce-agents (G03) | Venderlo como producto instalable |
| GH5 | Plantilla o biblioteca de prompts | **«Plantilla → estructura + trampas»**: las partes del prompt y los errores que marca | F7 / F4 | La estructura en N partes | awesome-seedance (G05) | No decir de quién es la vidriera |
| GH6 | CLI o herramienta con instalación | **«Receta con paso crítico»** si no se probó; **«Instalé X en 5 min»** solo si se probó y se grabó | F7 / F1 | Comandos + la trampa | worktrunk (G09), SkillSpector (G04) | Decir «lo instalé» sin haberlo hecho |
| GH7 | Alternativa open source a un SaaS pago | **«X vs Y: cuánto pagás de verdad»**: dónde está el costo escondido (clave de API, versión alojada, afiliados) | F4 / F5 | La cuenta | open-seo (G07) | Citar el precio del SaaS sin verificarlo |
| GH8 | Catálogo gigante o repo muy popular | **«Cómo leer un README en un minuto»** o **«Estrellas no es salud»** | F5 | Los chequeos | claude-code-templates (G10), paperclip (G11) | Que suene a ataque: se dice «no es evidencia», no «es falso» |
| GH9 | Escáner / herramienta de seguridad | **«Antes de instalar, escaneá»** | F7 | Comando + cómo leer el resultado | SkillSpector (G04) | Presentarlo como garantía |
| GH10 | Tendencia mensual completa | **Carrusel C2** «5 repos de septiembre y para quién sirve cada uno», una lámina por nombre propio | C2 | El nombre + un mock del mecanismo | archify, hindsight, worktrunk… | Poner estrellas en lámina |
| GH11 | Licencias | **Historia-quiz F8**: «¿Cuál te deja revender lo que construís encima? MIT / AGPL / Elastic» con sticker de encuesta | F8 | La diferencia de licencias | context-mode | Dar consejo legal: se dice qué dice la licencia, no qué hacer |
| GH12 | Dos repos que resuelven lo mismo | **«X vs Y» horizontal** (misma tarea en los dos, tabla de criterios) | F4 horizontal | La tabla | hindsight vs claude-mem (memoria) | **Solo después de probar los dos.** Sin prueba no se hace |

Regla común [I]: en toda pieza de repo, **cuatro datos obligatorios** — qué problema resuelve, el
comando o paso literal del README, una señal para evaluarlo, un riesgo. Si falta el riesgo, es
publicidad del repo, no enseñanza.

### 2.2 Cómo presentan repos los creadores hispanos (fuentes públicas)

Leyenda como en `FORMULAS-REFERENTES.md`: **[O]** página leída entera el 29-sep; **[P]** solo
título o caption visto en el buscador; **[I]** lectura nuestra.

| Quién | Forma | Qué hace bien | Qué le falta | Evidencia |
|---|---|---|---|---|
| @sergioprompts (TikTok) | Listicle «10 repositorios que están creciendo», agrupado por categoría (agentes, video, programación, diseño, bases de datos, ciberseguridad) | Promesa de novedad («antes de que se hagan virales») | Por caption: ni riesgo ni licencia | [P] https://www.tiktok.com/@sergioprompts/video/7657561576391576863 |
| @midudev (TikTok) | **Truco de una línea**: cambiar `github` por `deepwiki` en la URL para ver documentación con IA de cualquier repo; cierra con pregunta | Unidad completa en 1 acción; repetible hoy | — | [P] https://www.tiktok.com/@midudev/video/7502070681085971734 |
| @aristidevs (TikTok) | Herramienta presentada por su resultado: «esta IA analiza repositorios para que le hagas preguntas» | Gancho de resultado | — | [P] https://www.tiktok.com/@aristidevs/video/7351378044797455649 |
| Fazt (fazt.dev) | **Tutorial escrito «instalá X»** (Hermes Agent): intro → instalación → configuración → Telegram → tabla de comandos → casos de uso → CTA de consultoría | Advierte seguridad concreta (restringir Telegram por ID de usuario; evitar WhatsApp por privacidad) | Remite al comando oficial en vez de mostrarlo | [O] https://fazt.dev/contenido/hermes-agente-ia-open-source-tutorial (12-abr-2026, act. 30-abr) |
| administraciondesistemas.com | **Guía para no-developers**: carpeta `.claude/`, cinco comandos de git, repos para buscar skills, flujo GitHub → Claude Code, seguridad | Trata una skill como un script: «puede borrar, sobrescribir o exfiltrar» → leer el SKILL.md entero antes | Sin ejemplos de repos evaluados | [O] https://administraciondesistemas.com/github-y-claude-code-guia-practica-para-instalar-skills-y-agentes-sin-ser-developer/ (23-jul-2026) |
| @soyenriquerocha | Carrusel C2: una lámina por repo con su nombre y un mock de terminal | Nombres propios, no categorías | Sin dato del cierre | [P] `FORMULAS-REFERENTES.md` §Enrique |
| @ingenierobinario | Carrusel C1: tutorial de un repo (Graphify) con paso crítico marcado | Receta completa | — | [O] `vi/2026-08-28-graphify-memoria-permanente-del-agente.md` |
| (portugués) YouTube | «15 Repositórios do GitHub que Todo Usuário de IA Precisa Conhecer» | Formato largo de lista | Solo título visto | [P] https://www.youtube.com/watch?v=McKnT5TwAAo |

**El hueco para Sergio Urcullo [I]:** casi todo lo hispano es lista de nombres o truco; casi
nadie enseña **a evaluar** (licencia, issues, a dónde van tus datos, quién cobra). Esa es la
diferencia de esta semana: cada pieza deja el criterio, no solo el nombre.

---

## 3. Guiones verticales

### G01 · Vertical · APIs de IA gratis: tres preguntas antes de meter datos de tus clientes
**Fórmula:** GH2 Awesome list → top 3 con un filtro (F5) · **Pilar:** Negocio · **Destino:** comunidad de WhatsApp (drop 1)
**Evidencia:** https://github.com/mnfst/awesome-free-llm-apis — README: secciones Cohere, Gemini, Mistral; notas al pie 1, 5 y 13; último commit de datos en `main` 21-ago-2026

Hay una lista en GitHub de APIs de inteligencia artificial gratis y sin tarjeta. Antes de conectar una a tu negocio, leé las notas al pie: ahí está lo que decide.

Se llama awesome free LLM APIs. Tres preguntas.

Uno: ¿pide tarjeta? Gemini, Mistral y Cohere, según la lista, no.

Dos: ¿permite uso comercial? La clave de prueba de Cohere dice que no. Para un negocio, afuera.

Tres: ¿usan lo que mandás para entrenar? La nota de Gemini dice que, en el plan gratis, Google puede usar tus mensajes para mejorar sus productos. La de Mistral, que entrenan con ellos salvo que lo desactives. Y los modelos gratis de NVIDIA que aparecen ahí piden no mandar datos personales.

Si tu bot lee nombres, teléfonos o diagnósticos de clientes, esa nota decide.

Cómo sabés que elegiste bien: confirmaste las tres respuestas en la página del proveedor, no en la lista. La lista es del veintiuno de agosto, y los límites cambian.

La planilla está en la comunidad de WhatsApp.

### G02 · Vertical · El paso de un plugin de ventas de Anthropic que podés usar hoy sin instalar nada
**Fórmula:** GH3 Copiá esta (F7) · **Pilar:** Negocio · **Destino:** comunidad de WhatsApp (drop 2)
**Evidencia:** https://github.com/anthropics/knowledge-work-plugins — README (tabla de 11 plugins; comandos de Claude Code) · `sales/skills/handle-objection/SKILL.md` Step 2 · licencia Apache-2.0

Anthropic publicó once plugins gratis, uno por puesto de trabajo: ventas, soporte, marketing, finanzas. Son archivos de texto. Y el de ventas trae un paso que podés usar hoy sin instalar nada.

Está en el repo knowledge work plugins, carpeta sales, skill handle objection. El paso dos dice: antes de responder, clasificá lo que te dijeron. Seis tipos. Precio o valor. Momento. Comparación con la competencia. Riesgo o confianza. Autoridad, el «lo tengo que consultar». Y quedarse como está.

Después, una distinción: una objeción es una razón para no comprar. Una movida de negociación es una razón para comprar más barato. No se responden igual.

Por qué importa: si a todo «está caro» le contestás bajando el precio, regalás margen donde no hacía falta.

Cómo sabés que lo hacés bien: antes de contestar, podés decir de qué tipo es. Si no podés, todavía no la entendiste.

Si usás Claude Code, los dos comandos para instalarlo están en pantalla. El paso traducido está en la comunidad de WhatsApp.

### G03 · Vertical · Un agente que vende: lo que Anthropic pone en código y no en el prompt
**Fórmula:** GH4 Abrí la fuente (F5) · **Pilar:** Automatización y WhatsApp · **Destino:** comunidad de WhatsApp (drop 3)
**Evidencia:** https://github.com/anthropics/commerce-agents — README (nota «Nothing places an order…») · `docs/safety.md`, tablas «Enforced in code» (No payment, Host approval) y «Still asked of the model»

Anthropic publicó un agente de tienda de ejemplo, y lo más útil no es el agente. Es una tabla: qué controlan en código y qué le piden al modelo.

Está en el repo commerce agents, carpeta docs, archivo safety.

En código: el agente no cobra. No existe la función de cobrar; arma el carrito y el pago lo cierra el sistema de la tienda. Los cambios de precios o stock quedan en espera hasta que una persona los aprueba en el panel. Y una aprobación escrita en el chat no aprueba nada.

Al modelo, en cambio, se le pide no decir precios ni condiciones que no hayan salido de una herramienta.

La diferencia, según el documento: lo que está en código se cumple con cualquier modelo. Lo del prompt, solo mientras el modelo obedezca.

Si tenés un bot, o vas a comprar uno, preguntá qué de esto está en código. Si te contestan «está en el prompt», no está garantizado.

Las dos columnas están en la comunidad de WhatsApp.

### G04 · Vertical · Antes de instalar una skill, escaneala (y el detalle de «precaución»)
**Fórmula:** GH9 / F7 Receta con el paso crítico marcado · **Pilar:** Claude Code · **Destino:** comentá ESCANEO (drop 4)
**Evidencia:** https://github.com/NVIDIA/SkillSpector — README: Quick Start (`uv tool install`), Basic Usage, tabla de puntaje (0-20 SAFE, 21-50 CAUTION, 51+ DO NOT INSTALL), código de salida que junta SAFE y CAUTION, «LLM analysis sends… Use `--no-llm`»

Una skill para tu agente se instala con un comando y corre con tu confianza. NVIDIA publicó un escáner para revisarla antes. Tres pasos, según su README.

Uno: instalarlo, con Python y uv. El comando está en pantalla.

Dos: escanear. skillspector scan, y la dirección del repo de la skill. Agregá guion guion no llm: así el análisis queda en tu computadora. Sin eso, según el README, el contenido va a un modelo.

Tres, el crítico: leé la recomendación, no solo si terminó bien. Te da un puntaje de cero a cien. Hasta veinte, seguro. De veintiuno a cincuenta, precaución. Más de cincuenta, no instalar. Pero si lo metés en un script, precaución y seguro devuelven el mismo código de éxito. Para que se frene ante cualquier hallazgo, está la opción fail on findings.

Por qué importa: una skill puede traer scripts que se ejecutan en tu máquina.

Cómo sabés que anduvo: te devuelve puntaje, severidad y qué archivos ejecutan código.

Comentá ESCANEO y te paso los comandos.

### G05 · Vertical · Comercial de producto con IA: el logo no va en el prompt
**Fórmula:** GH5 Plantilla → estructura + trampas (F7) · **Pilar:** Contenido con IA · **Destino:** comunidad de WhatsApp (drop 5)
**Evidencia:** https://github.com/LearnPrompt/awesome-seedance/blob/main/docs/templates/en/product-commercial-shotlist.md (Structure, Pitfalls) · método propio: commit `29977d52` «cover images from Higgsfield, text by code»

Si le pedís a un generador de video que escriba tu logo, lo va a deformar. Una biblioteca de prompts para Seedance lo marca como error en su plantilla de comerciales.

Repo awesome seedance, plantilla de comercial de producto. Copiás el bloque, cambiás lo que está entre corchetes y se lo pasás a un chat con fotos del producto. Te devuelve el prompt.

Cinco partes: estética, producto y luz, tomas con sus segundos, textos con su ventana, y estilo al final.

Tres trampas: el logo y el eslogan van en edición, sobre un cuadro final limpio. No mezcles luz de comercial con estética de celular. Y con menos de un segundo por toma, el modelo deja de resolverlas.

Es lo que hago en mis carruseles: la imagen la hace la IA, el texto lo pone código.

Cómo sabés que salió bien: el producto no cambia de forma entre tomas.

Ojo: el repo es la vidriera de un sitio. La plantilla traducida está en la comunidad de WhatsApp.

### G06 · Vertical · Voz con IA en tu computadora: lo que no es técnico
**Fórmula:** GH1 El repo que encontré (F2) · **Pilar:** Contenido con IA · **Destino:** comunidad de WhatsApp (drop 6)
**Evidencia:** https://github.com/debpalash/VoiceStudio — README: Get started, «Install with prompt» (`docs/install/agent.md`: pregunta antes de bajar modelos), «License & responsible use» (AGPL-3.0; modelos con licencia propia; clonar solo con permiso) · #1 en trending diario el 29-sep

A fines de septiembre, uno de los repos que más creció en GitHub fue una alternativa a ElevenLabs que corre en tu computadora: VoiceStudio. Clona voces, dobla videos, dicta y transcribe. Antes de instalarlo, tres cosas de su README.

Una: bajás la app desde la página de versiones, o le pegás a tu agente un pedido que apunta a su guía, y esa guía le dice que te pregunte antes de bajar modelos. Si usás el comando de una línea, bajá el instalador y leelo primero.

Dos: la licencia es AGPL. Para usarlo vos, bien. Si lo modificás y lo ofrecés como servicio, te obliga a publicar tu código. Y cada modelo de voz tiene su licencia: revisala antes de un uso comercial.

Tres: clonar una voz, solo con permiso. Lo dice el propio repo.

Cómo sabés si te sirve: generás una frase con tu voz y la comparás con una grabación real.

La lista de chequeo está en la comunidad de WhatsApp.

### G07 · Vertical · Una herramienta de SEO sin suscripción: dónde está el costo
**Fórmula:** GH7 X vs Y: cuánto pagás de verdad (F5) · **Pilar:** Web y landing · **Destino:** comunidad de WhatsApp (drop 7)
**Evidencia:** https://github.com/every-app/open-seo — README: «Hosted Version» (USD 10/mes), «Costs» (DataForSEO; 28 % extra en la alojada), enlace a DataForSEO con `?aff=`, «OpenSEO MCP & Agent Skills»

Hay una herramienta de SEO de código abierto que se presenta como alternativa a Semrush y Ahrefs: OpenSEO. No tiene suscripción, pero no es gratis, y su README te dice por qué.

Los datos los vende otra empresa, DataForSEO. OpenSEO los consulta con tu clave, y pagás por consulta.

Tres formas de usarlo. Alojado por ellos: mencionan diez dólares al mes, y explican que ganan cobrando veintiocho por ciento extra en cada consulta. En tu computadora con Docker, para probar. O en Cloudflare, lo que recomiendan si lo usa tu equipo.

Hace palabras clave, posiciones, competencia, enlaces y auditoría. Y trae un servidor MCP para que tu agente consulte directo.

Un detalle: el enlace a DataForSEO del README es de afiliado. Es normal; sabelo.

Cómo sabés si te conviene: antes de conectar nada, abrí los precios de DataForSEO y calculá tus consultas del mes. Sin esa cuenta, «sin suscripción» te puede salir más caro.

La cuenta paso a paso está en la comunidad de WhatsApp.

### G08 · Vertical · Diez reglas para que tu agente deje de enterrar la respuesta
**Fórmula:** GH3 Copiá esta (F4 antes/después) · **Pilar:** Claude Code · **Destino:** comentá REGLAS (drop 8)
**Evidencia:** https://github.com/ayghri/i-have-adhd — README (antes/después, «The rules»; versión en español en `.github/readme/README.es.md`) · `INSTALL.md` sección Claude Code (comandos; el plugin no cambia nada hasta invocarlo) · licencia MIT

Le preguntás algo a tu agente y te contesta tres párrafos antes de decirte qué hacer. Hay una skill que lo corrige con diez reglas, y las podés leer antes de instalar nada.

Se llama i have ADHD. Su README muestra el antes y el después: en vez de «excelente pregunta», primero el comando, después los pasos numerados.

Las reglas, resumidas. Empezá por la próxima acción. Numerá los pasos. Terminá con un solo paso concreto. Nada de desvíos. Decí en qué paso vamos. Tiempos en minutos, no «un rato». Mostrá qué quedó andando. Errores sin drama: dónde, por qué y cómo se arregla. Listas de cinco, como máximo. Y sin introducción ni cierre.

En Claude Code son dos comandos, en pantalla. Instalarla sola no cambia nada: se activa cuando escribís barra i have ADHD. Licencia MIT.

Cómo sabés que funciona: la próxima respuesta empieza con una acción, no con un elogio.

Comentá REGLAS y te paso las diez en español.

### G09 · Vertical · Varios agentes a la vez sin pisarse, y la trampa de Windows
**Fórmula:** GH6 Receta con paso crítico (F7) · **Pilar:** Agentes y loops · **Destino:** comunidad de WhatsApp (drop 9)
**Evidencia:** `CLAUDE.md` §«Carriles» (1 carril = 1 sesión = 1 worktree = 1 rama; 8 worktrees simultáneos medidos el 5-sep) · https://github.com/max-sixty/worktrunk — README: Core commands, Install › Windows (`git-wt`) · issues 34 abiertos / 631 cerrados el 29-sep

Trabajo con varias sesiones de Claude Code a la vez, cada una en su worktree: una copia del repo con su propia rama, para que dos agentes no toquen el mismo archivo. Llegué a tener ocho. Con git solo, crear uno y abrir Claude son tres comandos. Worktrunk lo hace en uno, y en Windows tiene una trampa.

Según su README: wt switch, guion c, guion x claude y el nombre de la rama. Crea el worktree, entra y abre Claude. wt list muestra todos. wt remove limpia.

El paso crítico, en Windows: wt ya es el comando de Windows Terminal. Si lo instalás con winget, se llama git guion wt. Si escribís wt y se abre una terminal nueva, es eso.

Cómo evaluarlo: licencia MIT o Apache, a elección. Y los issues: el veintinueve de septiembre, treinta y cuatro abiertos y seiscientos treinta y uno cerrados. Alguien atiende.

Cómo sabés que anduvo: wt list muestra tu worktree nuevo.

Mis reglas para varios agentes están en la comunidad de WhatsApp.

### G10 · Vertical · Cómo leer un README en un minuto: el primer comando no siempre es del proyecto
**Fórmula:** GH8 Cómo leer un README (F5) · **Pilar:** Claude Code · **Destino:** comunidad de WhatsApp (drop 10)
**Evidencia:** https://github.com/davila7/claude-code-templates — README: bloque «Sponsored by Bright Data» con su comando arriba de todo; «Quick Installation» (`--yes`); «Conversation Monitor» (`--chats --tunnel`); «Attribution» (componentes con su licencia)

Antes de copiar el primer comando de un repo, fijate de quién es. Ejemplo: claude code templates, un catálogo muy usado de agentes y conexiones para Claude Code.

Uno: el primer comando de su README no es del proyecto. Es de un sponsor, una empresa de datos web. Está bien tener sponsor, pero no es lo que viniste a buscar.

Dos: casi todos los comandos terminan en guion guion yes. Eso instala sin preguntarte. Sacalo, y vas a ver qué entra antes de que entre.

Tres: hay una opción para mirar tus conversaciones desde el celular con un túnel. Un túnel abre algo de tu máquina a internet: activalo solo si sabés cómo se protege.

Cuatro, al final: el catálogo junta piezas de otros autores, cada una con su licencia.

Por qué importa: el comando que pegás decide qué corre en tu máquina.

Cómo sabés que lo leíste bien: podés decir qué instala, qué pide y de quién es cada parte.

Los cuatro chequeos están en la comunidad de WhatsApp.

---

## 4. Guion de YouTube

### G11 · YouTube · Cómo encontrar repos de IA que valen la pena (y cuáles no instalar)
**Fórmula:** F5 horizontal (abrí la fuente) con el orden de F1 · **Pilar:** Claude Code · **Destino:** comunidad de WhatsApp (drop 11)
**Evidencia:** github.com/trending (semanal, 29-sep: paperclip #1, +10.518) · API de GitHub 29-sep (issues: paperclip 2.571 / 914 y 3.464 PR abiertos; hindsight 76 / 1.168; security-audit-skill 19 / 3) · README y `LICENSE` de paperclipai/paperclip (Quickstart, Telemetry), mksglu/context-mode (Elastic License 2.0; logos con `href="#"`), vectorize-io/hindsight (Quick Start, Coding Agents, Memory Performance) · `docs/cola/PARA-PUBLICAR-APPLE-REPOS.md` («Escribí 197 piezas…»; orden oficial → empresa → comunidad) · regla de instalación en el `CLAUDE.md` global de Sergio Urcullo · comandos `gh` corridos el 29-sep

#### Resultado

A fines de septiembre, el repo más pegado de la semana en GitHub sumó más de diez mil estrellas en siete días. Ese mismo día tenía dos mil quinientos setenta y un issues abiertos, y más de tres mil pedidos de cambio esperando. Las estrellas te dicen que mucha gente lo miró. No te dicen si alguien lo atiende.

En este video te dejo el método que uso para encontrar repos de IA que valen la pena, y para saber cuáles no instalar todavía. Cinco pasos, con los comandos exactos, y tres repos reales de esa semana para practicar.

#### Por qué importa

Yo escribí ciento noventa y siete piezas para mi empresa, entre skills, scripts y agentes, antes de aprender a buscar primero. Cuando empecé a buscar, descubrí que buena parte ya existía, hecha y gratis.

Pero instalar lo primero que aparece también cuesta. Un repo de agentes corre en tu máquina, con tus archivos y a veces con tus claves. Una skill es texto que tu agente obedece. Y una licencia mal leída te puede impedir vender lo que construiste encima.

Por eso tengo una regla escrita: antes de instalar cualquier herramienta, digo qué es, de dónde viene y para qué la quiero. Recién ahí se instala.

#### Paso uno: dónde mirar

Primero, github punto com barra trending. Tiene tres vistas: hoy, esta semana y este mes, y un filtro por lenguaje. La semanal es la más útil: lo de hoy es ruido, y lo del mes ya lo vio todo el mundo.

Segundo, la terminal. Con la herramienta de GitHub, gh, buscás repos creados en el último mes con más de trescientas estrellas, ordenados por estrellas. El comando está en pantalla. Le podés sumar una palabra: claude code, mcp, agentes.

Ojo con lo que aparece. La búsqueda que corrí trajo modelos de decisión, una guía de vida en chino y un parche para placas de video. El ranking no sabe cuál es tu problema. Filtrá por lo que necesitás, no por el número.

Y el orden en que busco: primero lo oficial, después lo de la empresa dueña de la herramienta, y al final la comunidad.

#### Paso dos: estrellas contra actividad

En la página del repo mirás tres cosas. Cuándo se creó. Cuándo fue el último cambio en la rama principal. Y la pestaña de issues: abiertos contra cerrados.

Un repo con mil estrellas creado hace una semana todavía no tiene historia: esperá un mes.

Uno donde los cerrados le ganan por mucho a los abiertos tiene a alguien atendiendo.

Uno con miles abiertos y pocos cerrados está desbordado: si algo se rompe, vas a esperar.

Si querés el número exacto, hay un comando de gh que cuenta issues abiertos y cerrados. Está en pantalla.

#### Paso tres: la licencia, abriendo el archivo

No te quedes con la etiqueta de la página. A veces GitHub muestra «Other», y ahí puede haber cualquier cosa.

MIT o Apache: lo usás, lo modificás y lo vendés, dejando el aviso del autor.

AGPL: si lo modificás y lo ofrecés como servicio, tenés que publicar tu código.

Y hay licencias que te dejan ver el código, pero no ofrecerlo como servicio. Eso no es código abierto, aunque esté en GitHub.

#### Paso cuatro: el README como un contrato

Cuatro preguntas. Qué instala: si el comando es un curl que termina en bash, bajá el archivo y leelo antes. Qué te pide: claves de API, cuentas, acceso a tus herramientas. A dónde manda datos: telemetría, modelos externos. Y quién gana: sponsors, enlaces de afiliado, una versión paga.

Nada de eso es malo. Es información que necesitás antes de decidir.

Y un patrón nuevo: repos que se instalan pegándole a tu agente un pedido que lo manda a leer un archivo del repo. En ese caso, ese archivo le da órdenes a tu agente. Leelo vos primero.

#### Paso cinco: si es una skill, escaneala

Esta semana te mostré un escáner que revisa skills antes de instalarlas. Usalo como último filtro, no como el único: un puntaje no reemplaza los cuatro pasos anteriores.

#### Tres repos de esa semana

El primero, Paperclip: una app para manejar equipos de agentes como si fueran una empresa, con organigrama, presupuesto por agente y aprobaciones. Fue el número uno de la semana.

Lo bueno: licencia MIT, y el instalador trae una suma de verificación. El propio README aclara que esa suma se sirve desde el mismo sitio: detecta una descarga rota, no un sitio comprometido. Me gusta que lo diga.

Lo que hay que mirar: la telemetría viene activada, y el README nombra la variable que la apaga. Y los issues: dos mil quinientos setenta y uno abiertos contra novecientos catorce cerrados. Mi lectura: probalo en una máquina aparte. Todavía no le pondría encima el centro de un negocio.

El segundo, Context Mode: una extensión para que tu agente no se llene la memoria de trabajo con resultados enormes. Promete noventa y ocho por ciento menos de contexto; ese número es del autor.

GitHub dice «Other» en la licencia. Abrís el archivo, y es la Elastic License dos: te deja usarlo, pero no ofrecerlo como servicio administrado. Y arriba del README hay logos de empresas grandes. Ninguno enlaza a una prueba: los enlaces no llevan a ningún lado. No significa que sea falso. Significa que no es evidencia.

Mi lectura: para tu uso personal puede servir. Para montar un producto encima, primero la licencia.

El tercero, Hindsight: memoria para agentes que aprende de lo que pasó.

Lo bueno: la empresa detrás publicó un paper, tiene mil ciento sesenta y ocho issues cerrados contra setenta y seis abiertos, y la licencia es MIT. Y su README separa los números: dice cuáles reprodujeron terceros y aclara que los de otros productos los publicaron sus propios fabricantes.

La pregunta acá no es si está mantenido. Es qué datos toca. Para agentes de código, arma una memoria por repo a partir de tu historial de git y de tus sesiones pasadas, y necesita un modelo, con clave o con tu suscripción. Antes de instalarlo en un repo con datos de clientes, sabé qué va a leer y a dónde lo manda.

#### El error más común

Confiar en la marca. Esa misma semana, un repo de una empresa enorme de infraestructura tenía diecinueve issues abiertos y tres cerrados. La marca te dice quién lo publicó. No te dice quién lo atiende.

#### Cierre

Resumen: dónde mirar, estrellas contra actividad, la licencia abriendo el archivo, el README como contrato, y el escáner al final.

La planilla con los ocho chequeos y los comandos de gh está en la comunidad de WhatsApp. Contame ahí qué repo estás por instalar.

---

## 5. Drops

Publicar en Onia Community (Announcements) **antes** que el video. Los de «comentá PALABRA» (G04,
G08) los manda Sergio Urcullo a mano por DM: la automatización comentario → DM no está probada.
Todo comando sale del README del repo, leído el 29-sep; re-leer antes de publicar.

**1 · G01 · Planilla «API gratis para un negocio»** (comunidad)
```
Lista: github.com/mnfst/awesome-free-llm-apis   (datos del 19-21 ago 2026; mirar las NOTAS AL PIE)

Proveedor | ¿Pide tarjeta? | ¿Uso comercial? | ¿Entrenan con lo que mandás? | Link a la página del proveedor | Fecha que lo miraste
Gemini    |                |                 |                              |                               |
Mistral   |                |                 |                              |                               |
Cohere    |                |                 |                              |                               |

Regla: si una de las tres respuestas no está en la página del PROVEEDOR (no en la lista),
no le mandes nombres, teléfonos ni datos de salud de tus clientes.
```

**2 · G02 · Clasificar antes de responder** (comunidad) — resumen propio de `sales/skills/handle-objection/SKILL.md` (Apache-2.0, © Anthropic)
```
Paso 2 — ¿qué te están diciendo?
1. Precio / valor         4. Riesgo / confianza
2. Momento / prioridad    5. Autoridad ("lo tengo que consultar")
3. Competencia            6. Quedarse como está
¿Objeción (razón para NO comprar) o negociación (razón para comprar MÁS BARATO)? Se responden distinto.

Instalar en Claude Code (README del repo):
claude plugin marketplace add anthropics/knowledge-work-plugins
claude plugin install sales@knowledge-work-plugins
```

**3 · G03 · Las dos columnas** (comunidad) — de `docs/safety.md` de anthropics/commerce-agents
```
EN CÓDIGO (vale con cualquier modelo)            | EN EL PROMPT (vale mientras el modelo obedezca)
- El agente no tiene función de cobrar           | - No decir precios ni condiciones que no vengan de una herramienta
- Cambios de precio/stock quedan en espera       | - Tratar el texto de terceros como material, no como órdenes
  hasta que una persona aprueba en el panel      | - Confirmar una acción solo después de que se ejecutó
- Una aprobación escrita en el chat no aprueba   |
- Límites: cantidad por cambio, cuánto se mueve  |
  un precio, profundidad de una promoción        |

Pregunta para tu bot (propio o comprado): ¿cuáles de la izquierda tiene en código?
```

**4 · G04 · ESCANEO** (DM) — README de NVIDIA/SkillSpector
```
uv tool install git+https://github.com/NVIDIA/skillspector.git
skillspector scan https://github.com/<autor>/<skill> --no-llm
skillspector scan ./mi-skill/ --no-llm --format json --output report.json

Puntaje: 0-20 SAFE · 21-50 CAUTION · 51-100 DO NOT INSTALL
En scripts: SAFE y CAUTION salen con código 0 → agregá --fail-on-findings
Sin --no-llm, el contenido escaneado va al modelo configurado.
```

**5 · G05 · Plantilla de comercial de producto** (comunidad) — estructura de `product-commercial-shotlist.md` (awesome-seedance, MIT)
```
Pedido al chat (con fotos del producto):
"Quiero un comercial cinematográfico. Mi producto es [producto]. Tono: [tono]. [duración], [formato 16:9 o 9:16].
Reescribí esto como UN prompt listo para Seedance con esta estructura:"
1. Apertura: categoría, duración, formato, estética de comercial, color, profundidad de campo
2. Producto: material, silueta, acabado, cómo le pega la luz
3. Tomas: "0-2s:" con tiempos, O "Toma 1:" numeradas (nunca las dos)
4. Textos: cada uno con su ventana de tiempo
5. Palabras de estilo: todas juntas al final
Trampas: logo y eslogan se ponen DESPUÉS en edición, sobre un cuadro final limpio ·
no mezclar luz de comercial con estética de celular · un efecto físico por toma ·
nunca menos de ~1 s por toma
```

**6 · G06 · Antes de instalar VoiceStudio** (comunidad)
```
[ ] Instalo desde Releases, o con el pedido al agente (docs/install/agent.md). Si uso
    curl -fsSL https://voicestudio.sh/install | sh  → primero lo bajo y lo leo
[ ] Licencia AGPL-3.0: ¿lo voy a modificar y ofrecer como servicio? → publico mi código
[ ] Licencia del MODELO de voz que elijo (cada uno tiene la suya) antes de uso comercial
[ ] Solo mi voz, o la de alguien que me dio permiso
[ ] Prueba: una frase con mi voz vs una grabación real
```

**7 · G07 · Cuánto cuesta OpenSEO** (comunidad)
```
1. Abrí la página de precios de DataForSEO (el link del README de every-app/open-seo es de afiliado).
2. Anotá: consultas de palabras clave / seguimiento de posiciones / auditorías que harías por mes.
3. Self-host (Docker o Cloudflare): costo = consultas × precio DataForSEO.
4. Alojado (openseo.so): el README menciona USD 10/mes y un 28 % extra por consulta. Verificá en openseo.so/pricing.
5. Compará con lo que pagás hoy (o con no pagar nada).
```

**8 · G08 · REGLAS** (DM) — traducción propia de las 10 reglas de ayghri/i-have-adhd (MIT, © Ayoub Ghriss)
```
1. Empezá por la próxima acción: comando, ruta o fragmento primero.
2. Numerá el trabajo de varios pasos; una acción por paso.
3. Terminá con UN próximo paso que se haga en menos de dos minutos.
4. Terminá el tema actual antes de abrir otro.
5. Decí en qué paso vamos ("paso 3 de 5").
6. Tiempos en unidades concretas, nunca "un rato".
7. Después de un cambio, mostrá qué quedó funcionando.
8. Errores: dónde, por qué y cómo se arregla. Sin drama.
9. Listas de 5 elementos como máximo.
10. Sin introducción, sin resumen, sin despedida.

Claude Code (INSTALL.md):
claude plugin marketplace add ayghri/i-have-adhd
claude plugin install i-have-adhd@i-have-adhd
→ se activa con /i-have-adhd (instalarla sola no cambia nada)
```

**9 · G09 · Worktrees para varios agentes** (comunidad)
```
Mis reglas (CLAUDE.md de ONIA): 1 tarea = 1 sesión = 1 worktree = 1 rama.
Al mandar a un subagente: ruta exacta del worktree + que corra primero  git branch --show-current
Git solo:  git worktree add -b feat ../repo.feat && cd ../repo.feat && claude

Worktrunk (README de max-sixty/worktrunk):
brew install worktrunk && wt config shell install        # macOS / Linux
winget install max-sixty.worktrunk                        # Windows → el comando es git-wt
git-wt config shell install
wt switch -c -x claude feat     # crea, entra y abre Claude   (en Windows: git-wt …)
wt list                         # todos, con estado
wt remove                       # limpia
```

**10 · G10 · Cuatro chequeos de un README** (comunidad)
```
1. ¿El primer comando es del proyecto o de un sponsor?
2. ¿Tiene --yes (o -y)? Sacalo la primera vez: mirá qué instala.
3. ¿Abre algo a internet (túnel, puerto, servidor)? ¿Cómo se protege?
4. ¿De quién es cada parte y con qué licencia? (sección Attribution / LICENSE)
Si no podés responder las cuatro, todavía no lo instales.
```

**11 · G11 · Ocho chequeos + comandos** (comunidad)
```
DÓNDE MIRAR
github.com/trending            (?since=weekly · filtro por lenguaje)
gh search repos --created=">2026-08-29" --stars=">300" --sort=stars --limit 50
gh search repos "claude code" --created=">2026-08-29" --sort=stars --limit 30
(cambiá la fecha: un mes antes de hoy)

LOS OCHO CHEQUEOS
1. ¿Resuelve MI problema? (no el ranking)
2. ¿Oficial, empresa dueña o comunidad?
3. Creado hace… (menos de un mes → esperá)
4. Último cambio en la rama principal
5. Issues abiertos vs cerrados:
   gh api -X GET search/issues -f q="repo:DUEÑO/REPO is:issue is:open"   --jq .total_count
   gh api -X GET search/issues -f q="repo:DUEÑO/REPO is:issue is:closed" --jq .total_count
6. Licencia, abriendo el archivo LICENSE:
   gh repo view DUEÑO/REPO --json licenseInfo,createdAt,pushedAt,stargazerCount
   ("Other" = abrí el archivo)
7. README: qué instala · qué pide · a dónde manda datos · quién gana
8. Si es skill: escanearla (drop 4)
```

---

## 6. Antes de grabar (checklist del editor)

- Recontar estrellas, tendencia e issues de los repos citados con número (G09, G11). Si cambió,
  se cambia el número y la fecha, no se deja el viejo.
- Re-leer cada comando en el README vigente; si cambió, gana el README.
- Pantallas: mostrar el README real (scroll al archivo o sección de la línea Evidencia), nunca un
  mock presentado como salida real.
- G11 nombra solo a paperclip, context-mode y hindsight; la «empresa enorme» del error común es
  `cloudflare/security-audit-skill` y **no se nombra** a cámara (es un dato de un día, no un juicio).
- Ninguna pieza dice «lo instalé» o «lo probé». Si Sergio Urcullo prueba alguno antes de grabar,
  ese guion se reescribe como F1 con la prueba real (y se agrega la fecha).
