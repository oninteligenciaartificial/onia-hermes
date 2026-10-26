# LOTE D — Repos de GitHub (G01–G11 del S4 · R01–R07 top de la comunidad) y noticias (N01–N07)

Auditoría del 30-sep-2026 para el plan del jueves 1-oct al miércoles 14-oct. Revisor: Claude (subagente).

**Cómo se verificó hoy.**
- **Repos:** clon superficial (`git clone --depth 30`) de los 13 repos citados, con README, LICENSE y fecha del último commit leídos en el archivo. Estrellas, licencia, fecha de creación y de último push vía `search_repositories` (API de GitHub) el 30-sep. Issues abiertos contados en la pestaña Issues de github.com el 30-sep. Tendencia semanal leída en github.com/trending?since=weekly el 30-sep.
- **Límite:** en esta sesión no se pudo contar issues **cerrados** (la API de búsqueda está bloqueada y la página no muestra el total). Todo número de «cerrados» del S4 del 29-sep **salió de los guiones**, salvo `cloudflare/security-audit-skill` (se ven 3 cerrados en la lista).
- **Noticias:** solo con fuente primaria leída hoy. `openai.com`, `developers.openai.com`, `community.openai.com`, `ai.google.dev`, `blog.google`, `docs.n8n.io`, `developers.facebook.com` y `elevenlabs.io` están **bloqueados** por el proxy de salida de esta sesión. Por eso lo de OpenAI (DevDay), Google (API) y Meta entra solo si hay una fuente primaria alternativa leída (repo oficial en GitHub).

**Números medidos el 30-sep (para el editor, no para cámara salvo G09/G11):**

| Repo | ⭐ 30-sep | Licencia (archivo) | Último commit | Issues abiertos | Nota |
|---|---|---|---|---|---|
| mnfst/awesome-free-llm-apis | 8.738 | CC0-1.0 | 21-ago (README) | — | datos del 19-21 ago, sin cambios |
| anthropics/knowledge-work-plugins | 25.920 | Apache-2.0 | 24-sep | — | README dice «11 plugins»; el marketplace ya lista 121 (incluye de otras empresas) |
| anthropics/commerce-agents | 3.114 | Apache-2.0 | 31-ago (1 commit) | issues desactivados | sin cambios |
| NVIDIA/SkillSpector | 18.785 | Apache-2.0 | 29-sep | — | comandos y umbrales iguales |
| LearnPrompt/awesome-seedance | 1.560 | MIT (código) + **CC BY 4.0 (curaduría)** | 30-sep | — | README: 593 casos; descripción: 463 |
| debpalash/VoiceStudio | 50.227 | AGPL-3.0 | 29-sep | — | #4 semanal (+12.722) |
| every-app/open-seo | 21.920 | MIT | 29-sep | — | alojado: «Try for free» + USD 10/mes «para apoyar» |
| ayghri/i-have-adhd | 52.363 | MIT | 19-sep | — | `AGENTS.md` autoriza a agentes a comentar en un issue |
| max-sixty/worktrunk | 8.550 | MIT o Apache-2.0 | 30-sep | **33** | cerrados esta semana (21-29 sep) visibles |
| davila7/claude-code-templates | 32.226 | MIT | 30-sep | — | #8 semanal; 2 sponsors (Bright Data arriba, Z.AI con código de referido) |
| paperclipai/paperclip | 95.232 | MIT | 30-sep | **~2.600** + ~3.500 PR | #1 semanal (+12.941). **README cambiado hoy**: ya no hay `curl \| bash` con SHA-256; ahora `npx paperclipai@latest onboard --yes` |
| mksglu/context-mode | 24.426 | Elastic 2.0 (API: NOASSERTION) | 30-sep | — | 18 enlaces `href="#"` en logos |
| vectorize-io/hindsight | 43.858 | MIT | 30-sep | **87** | #2 semanal (+17.365) |
| cloudflare/security-audit-skill | 23.409 | MIT | 14-sep | **19** (3 cerrados) | dato del «error común» sigue igual |

---

## PARTE 1 — REPOS

### G01 · Vertical · APIs de IA gratis: tres preguntas antes de meter datos de tus clientes
**Tipo:** repo · **Origen:** comunidad (org chica mnfst) · **Veredicto:** PASA · **Fecha:** libre · **Demuestra:** las notas al pie del README (Cohere «Non-commercial use only», nota 1 de Gemini, nota 13 de Mistral, nota 5 de NVIDIA) · **Cierre:** comunidad de WhatsApp (falta publicar: drop 1, texto ya escrito en S4 §5)
**Fuente primaria verificada:** https://github.com/mnfst/awesome-free-llm-apis — README línea Cohere: «Free "Trial" API key, no credit card… Non-commercial use only»; Gemini: «Free-tier prompts may be used by Google to improve products»; Mistral nota 13: «may be used to train Mistral models, and you can opt out»; nota 5 (NVIDIA): «do not submit personal or confidential data». Último commit del README: 21-ago-2026 («regenerate README from data.json»).
**Cambios / notas:** Nada cambió desde el 29-sep. Riesgo ya dicho en el guion (datos de clientes). La nota de Gemini excluye a UE/Suiza/Reino Unido: no aplica a Bolivia, no hace falta decirlo.

Hay una lista en GitHub de APIs de inteligencia artificial gratis y sin tarjeta. Antes de conectar una a tu negocio, leé las notas al pie: ahí está lo que decide.

Se llama awesome free LLM APIs. Tres preguntas.

Uno: ¿pide tarjeta? Gemini, Mistral y Cohere, según la lista, no.

Dos: ¿permite uso comercial? La clave de prueba de Cohere dice que no. Para un negocio, afuera.

Tres: ¿usan lo que mandás para entrenar? La nota de Gemini dice que, en el plan gratis, Google puede usar tus mensajes para mejorar sus productos. La de Mistral, que entrenan con ellos salvo que lo desactives. Y los modelos gratis de NVIDIA que aparecen ahí piden no mandar datos personales.

Si tu bot lee nombres, teléfonos o diagnósticos de clientes, esa nota decide.

Cómo sabés que elegiste bien: confirmaste las tres respuestas en la página del proveedor, no en la lista. La lista es del veintiuno de agosto, y los límites cambian.

La planilla está en la comunidad de WhatsApp.

### G02 · Vertical · El paso de un plugin de ventas de Anthropic que podés usar hoy sin instalar nada
**Tipo:** repo · **Origen:** OFICIAL — Anthropic · **Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** `sales/skills/handle-objection/SKILL.md`, «Step 2 - Classify what's actually being said» en pantalla · **Cierre:** comunidad de WhatsApp (falta publicar: drop 2, escrito en S4 §5)
**Fuente primaria verificada:** https://github.com/anthropics/knowledge-work-plugins — `sales/skills/handle-objection/SKILL.md` Step 2: «price/value, timing/priority, competitive comparison, risk/trust, authority ("I need to check with..."), or status quo… an objection (a reason not to buy) and a negotiation move (a reason to buy cheaper) - the response differs». README: `claude plugin marketplace add anthropics/knowledge-work-plugins` / `claude plugin install sales@knowledge-work-plugins`. LICENSE Apache-2.0.
**Cambios / notas:** «Once plugins» quedó viejo: el README todavía dice 11, pero el `marketplace.json` de hoy lista 121 (suma plugins de otras empresas y uno de `small-business`). Se saca el número. Riesgo: el plugin de ventas trae conectores a CRM, Slack y correo; se agrega una línea.

Anthropic publicó plugins gratis, uno por puesto de trabajo: ventas, soporte, marketing, finanzas. Y el de ventas trae un paso que podés usar hoy sin instalar nada.

Está en el repo knowledge work plugins, carpeta sales, skill handle objection. El paso dos dice: antes de responder, clasificá lo que te dijeron. Seis tipos. Precio o valor. Momento. Comparación con la competencia. Riesgo o confianza. Autoridad, el «lo tengo que consultar». Y quedarse como está.

Y una distinción: una objeción es una razón para no comprar. Una movida de negociación es una razón para comprar más barato. No se responden igual.

Por qué importa: si a todo «está caro» le contestás bajando el precio, regalás margen.

Cómo sabés que lo hacés bien: antes de contestar, podés decir de qué tipo es. Si no podés, todavía no la entendiste.

Si usás Claude Code, los dos comandos están en pantalla. Ojo: si se lo permitís, se conecta a tu correo y a tu CRM. El paso traducido está en la comunidad de WhatsApp.

### G03 · Vertical · Un agente que vende: lo que Anthropic pone en código y no en el prompt
**Tipo:** repo · **Origen:** OFICIAL — Anthropic · **Veredicto:** PASA · **Fecha:** libre · **Demuestra:** `docs/safety.md`, tablas «Enforced in code» (No payment, Host approval) y «Still asked of the model» · **Cierre:** comunidad de WhatsApp (falta publicar: drop 3, escrito en S4 §5)
**Fuente primaria verificada:** https://github.com/anthropics/commerce-agents — `docs/safety.md`: «**No payment.** Nothing places an order or charges. `StorefrontBackend` has no such method»; «**Host approval.** … `apply_change` succeeds only for ids the host marked approved. A preview card approves nothing; an approval typed in chat sets nothing»; «Still asked of the model: A term or a figure is stated only from a tool result». Issues desactivados (API: `has_issues: false`), un solo commit (31-ago).
**Cambios / notas:** Sin cambios. Riesgo (es ejemplo, no producto; pide clave de API) está en el S4; no hace falta a cámara porque el guion no manda a instalarlo.

Anthropic publicó un agente de tienda de ejemplo, y lo más útil no es el agente. Es una tabla: qué controlan en código y qué le piden al modelo.

Está en el repo commerce agents, carpeta docs, archivo safety.

En código: el agente no cobra. No existe la función de cobrar; arma el carrito y el pago lo cierra el sistema de la tienda. Los cambios de precios o stock quedan en espera hasta que una persona los aprueba en el panel. Y una aprobación escrita en el chat no aprueba nada.

Al modelo, en cambio, se le pide no decir precios ni condiciones que no hayan salido de una herramienta.

La diferencia, según el documento: lo que está en código se cumple con cualquier modelo. Lo del prompt, solo mientras el modelo obedezca.

Si tenés un bot, o vas a comprar uno, preguntá qué de esto está en código. Si te contestan «está en el prompt», no está garantizado.

Las dos columnas están en la comunidad de WhatsApp.

### G04 · Vertical · Antes de instalar una skill, escaneala (y el detalle de «precaución»)
**Tipo:** repo · **Origen:** OFICIAL — NVIDIA · **Veredicto:** PASA · **Fecha:** libre (publicar antes que G11, que lo cita) · **Demuestra:** README: Quick Start, tabla de puntaje, «Exit codes», aviso de `--no-llm` · **Cierre:** comentá ESCANEO (existe: drop 4 escrito en S4 §5; Sergio Urcullo responde a mano por DM)
**Fuente primaria verificada:** https://github.com/NVIDIA/SkillSpector — README: `uv tool install git+https://github.com/NVIDIA/skillspector.git`; tabla «0-20 LOW SAFE · 21-50 MEDIUM CAUTION · 51-80 HIGH DO NOT INSTALL · 81-100 CRITICAL DO NOT INSTALL»; «By default, the exit code collapses `SAFE` and `CAUTION` into `0`. Use `--fail-on-findings`…»; «LLM analysis sends analyzer-eligible file contents to the configured provider… (the default)… Use `--no-llm` to keep contents local». Último commit 29-sep.
**Cambios / notas:** Todo sigue igual. Licencia Apache-2.0.

Una skill para tu agente se instala con un comando y corre con tu confianza. NVIDIA publicó un escáner para revisarla antes. Tres pasos, según su README.

Uno: instalarlo, con Python y uv. El comando está en pantalla.

Dos: escanear. skillspector scan, y la dirección del repo de la skill. Agregá guion guion no llm: así el análisis queda en tu computadora. Sin eso, según el README, el contenido va a un modelo.

Tres, el crítico: leé la recomendación, no solo si terminó bien. Te da un puntaje de cero a cien. Hasta veinte, seguro. De veintiuno a cincuenta, precaución. Más de cincuenta, no instalar. Pero si lo metés en un script, precaución y seguro devuelven el mismo código de éxito. Para que se frene ante cualquier hallazgo, está la opción fail on findings.

Por qué importa: una skill puede traer scripts que se ejecutan en tu máquina.

Cómo sabés que anduvo: te devuelve puntaje, severidad y qué archivos ejecutan código.

Comentá ESCANEO y te paso los comandos.

### G05 · Vertical · Comercial de producto con IA: el logo no va en el prompt
**Tipo:** repo · **Origen:** comunidad (vidriera de goodcase.ai) · **Veredicto:** ARREGLADA (el drop, no el texto hablado) · **Fecha:** libre · **Demuestra:** `docs/templates/en/product-commercial-shotlist.md`, secciones «Structure» y «Pitfalls» · **Cierre:** comunidad de WhatsApp (falta publicar: drop 5, escrito en S4 §5, con la corrección de atribución de abajo)
**Fuente primaria verificada:** https://github.com/LearnPrompt/awesome-seedance/blob/main/docs/templates/en/product-commercial-shotlist.md — Structure de 5 partes; Pitfalls: «Expecting the model to render a logo or slogan cleanly. Reserve a clean end frame and composite the type afterwards» · «Mixing high-end commercial light with phone-UGC texture» · «Under about one second per shot the model stops resolving individual actions». README: insignias «code-MIT» y «curation-CC BY 4.0»; enlaces a goodcase.ai con `utm_source=awesome-seedance`. Método ONIA: commit `29977d52` «cover images from Higgsfield, text by code».
**Cambios / notas:** El drop 5 del S4 atribuye la plantilla como «MIT». La plantilla es contenido curado: licencia **CC BY 4.0**, que exige atribución. Cambiar la línea del drop a: «estructura de product-commercial-shotlist.md, awesome-seedance (curaduría CC BY 4.0, © LearnPrompt / goodcase.ai), traducción y resumen propios». El texto hablado ya avisa que el repo es vidriera de un sitio.

Si le pedís a un generador de video que escriba tu logo, lo va a deformar. Una biblioteca de prompts para Seedance lo marca como error en su plantilla de comerciales.

Repo awesome seedance, plantilla de comercial de producto. Copiás el bloque, cambiás lo que está entre corchetes y se lo pasás a un chat con fotos del producto. Te devuelve el prompt.

Cinco partes: estética, producto y luz, tomas con sus segundos, textos con su ventana, y estilo al final.

Tres trampas: el logo y el eslogan van en edición, sobre un cuadro final limpio. No mezcles luz de comercial con estética de celular. Y con menos de un segundo por toma, el modelo deja de resolverlas.

Es lo que hago en mis carruseles: la imagen la hace la IA, el texto lo pone código.

Cómo sabés que salió bien: el producto no cambia de forma entre tomas.

Ojo: el repo es la vidriera de un sitio. La plantilla traducida está en la comunidad de WhatsApp.

### G06 · Vertical · Voz con IA en tu computadora: lo que no es técnico
**Tipo:** repo · **Origen:** comunidad (desarrollador individual) · **Veredicto:** PASA · **Fecha:** libre · **Demuestra:** README: «Get started», «Install with prompt», «License & responsible use»; `docs/install/agent.md` («Ask before downloading a model: state its size and license») · **Cierre:** comunidad de WhatsApp (falta publicar: drop 6, escrito en S4 §5)
**Fuente primaria verificada:** https://github.com/debpalash/VoiceStudio — descripción: «the open-source, fully-local ElevenLabs alternative»; README: `curl -fsSL https://voicestudio.sh/install | sh`, descarga desde Releases; «[AGPL-3.0](LICENSE). Models have their own licenses; review them before commercial use. Clone voices only with permission.» Trending semanal 30-sep: #4 (+12.722).
**Cambios / notas:** «A fines de septiembre, uno de los repos que más creció» sigue siendo cierto (#1 diario el 29-sep, #4 semanal el 30-sep). El README agrega «usage analytics requires consent»: no cambia el guion.

A fines de septiembre, uno de los repos que más creció en GitHub fue una alternativa a ElevenLabs que corre en tu computadora: VoiceStudio. Clona voces, dobla videos, dicta y transcribe. Antes de instalarlo, tres cosas de su README.

Una: bajás la app desde la página de versiones, o le pegás a tu agente un pedido que apunta a su guía, y esa guía le dice que te pregunte antes de bajar modelos. Si usás el comando de una línea, bajá el instalador y leelo primero.

Dos: la licencia es AGPL. Para usarlo vos, bien. Si lo modificás y lo ofrecés como servicio, te obliga a publicar tu código. Y cada modelo de voz tiene su licencia: revisala antes de un uso comercial.

Tres: clonar una voz, solo con permiso. Lo dice el propio repo.

Cómo sabés si te sirve: generás una frase con tu voz y la comparás con una grabación real.

La lista de chequeo está en la comunidad de WhatsApp.

### G07 · Vertical · Una herramienta de SEO sin suscripción: dónde está el costo
**Tipo:** repo · **Origen:** comunidad (startup every-app) · **Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** README: «Hosted Version», «Costs», enlace a DataForSEO con `?aff=255379`, «OpenSEO MCP & Agent Skills» · **Cierre:** comunidad de WhatsApp (falta publicar: drop 7, escrito en S4 §5)
**Fuente primaria verificada:** https://github.com/every-app/open-seo — «Try OpenSEO for free on our website. If you want to support the project, a hosted subscription is $10/month.»; «The way the hosted service makes money is by charging 28% extra for every request we make to DataForSEO»; «[DataForSEO](https://dataforseo.com/?aff=255379)»; Docker «Best for testing it out», Cloudflare «Recommended… with your team».
**Cambios / notas:** El README de hoy dice que la versión alojada **se prueba gratis** y que los USD 10/mes son «para apoyar el proyecto». Se corrige esa línea para no decir que alojado cuesta 10 fijos.

Hay una herramienta de SEO de código abierto que se presenta como alternativa a Semrush y Ahrefs: OpenSEO. No tiene suscripción obligatoria, pero no es gratis, y su README te dice por qué.

Los datos los vende otra empresa, DataForSEO. OpenSEO los consulta con tu clave, y pagás por consulta.

Tres formas de usarlo. Alojado por ellos: se prueba gratis, hay una suscripción de diez dólares al mes para apoyar el proyecto, y explican que ganan cobrando veintiocho por ciento extra en cada consulta. En tu computadora con Docker, para probar. O en Cloudflare, lo que recomiendan si lo usa tu equipo.

Trae un servidor MCP para que tu agente consulte directo.

Un detalle: el enlace a DataForSEO del README es de afiliado. Es normal; sabelo.

Cómo sabés si te conviene: antes de conectar nada, abrí los precios de DataForSEO y calculá tus consultas del mes. Sin esa cuenta, «sin suscripción» te puede salir más caro.

La cuenta paso a paso está en la comunidad de WhatsApp.

### G08 · Vertical · Diez reglas para que tu agente deje de enterrar la respuesta
**Tipo:** repo · **Origen:** comunidad (desarrollador individual) · **Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** README «The rules» (versión en español en `.github/readme/README.es.md`), `INSTALL.md` sección Claude Code, `AGENTS.md` sección «AI Agora discussions» · **Cierre:** comentá REGLAS (existe: drop 8 escrito en S4 §5; DM a mano)
**Fuente primaria verificada:** https://github.com/ayghri/i-have-adhd — README: «10 rules… 1. Lead with the next action… 10. No preamble. No recap. No closers.»; `INSTALL.md`: `claude plugin marketplace add ayghri/i-have-adhd` / `claude plugin install i-have-adhd@i-have-adhd` / «Type `/i-have-adhd`»; `SKILL.md`: `disable-model-invocation: true` (no se activa sola); README: «Install the i-have-adhd skill/plugin from … refer to the repo's AGENTS.md»; `AGENTS.md`: «Agents may comment on an issue only when it carries the `AI Agora` label». LICENSE MIT.
**Cambios / notas:** Se agrega el riesgo real que el guion no decía: la instalación por pedido manda a tu agente a leer `AGENTS.md`, y ese archivo le habla a tu agente (entre otras cosas, lo autoriza a comentar en un issue del repo). Se recortó una frase para seguir bajo 170 palabras.

Le preguntás algo a tu agente y te contesta tres párrafos antes de decirte qué hacer. Hay una skill que lo corrige con diez reglas, y las podés leer antes de instalar nada.

Se llama i have ADHD.

Las reglas, resumidas. Empezá por la próxima acción. Numerá los pasos. Terminá con un solo paso concreto. Nada de desvíos. Decí en qué paso vamos. Tiempos en minutos, no «un rato». Mostrá qué quedó andando. Errores sin drama. Listas de cinco, como máximo. Y sin introducción ni cierre.

En Claude Code son dos comandos, en pantalla. Instalarla sola no cambia nada: se activa cuando escribís barra i have ADHD. Licencia MIT.

Un cuidado: si la instalás pegándole un pedido a tu agente, lo manda a leer un archivo del repo con instrucciones para agentes. Leelo vos primero.

Cómo sabés que funciona: la próxima respuesta empieza con una acción, no con un elogio.

Comentá REGLAS y te paso las diez en español.

### G09 · Vertical · Varios agentes a la vez sin pisarse, y la trampa de Windows
**Tipo:** repo · **Origen:** comunidad (desarrollador individual) · **Veredicto:** ARREGLADA · **Fecha:** libre (el número de issues se recuenta el día de grabar) · **Demuestra:** README: tabla de comandos, «Install › Windows»; pestaña Issues (abiertos) y lista de cerrados con fechas de esta semana · **Cierre:** comunidad de WhatsApp (falta publicar: drop 9, escrito en S4 §5)
**Fuente primaria verificada:** https://github.com/max-sixty/worktrunk — README: `wt switch -c -x claude feat`, `wt list`, `wt remove`; «`wt` defaults to Windows Terminal's command, so Winget additionally installs Worktrunk as `git-wt`»; insignia «License: MIT OR Apache-2.0». github.com/max-sixty/worktrunk/issues (30-sep): «Issues 33»; lista de cerrados con issues del 21 al 29-sep (#4322, #4311, #4291). `CLAUDE.md` de ONIA §Carriles y «8 worktrees simultáneos» (medido 5-sep).
**Cambios / notas:** El «treinta y cuatro abiertos y seiscientos treinta y uno cerrados» del 29-sep no se pudo re-medir: hoy son 33 abiertos y el total de cerrados no es visible con las herramientas de esta sesión. Se reemplaza por lo que sí se ve y cualquiera puede repetir: cuántos abiertos y si cerraron alguno esta semana.

Trabajo con varias sesiones de Claude Code a la vez, cada una en su worktree: una copia del repo con su propia rama, para que dos agentes no toquen el mismo archivo. Llegué a tener ocho. Con git solo, crear uno y abrir Claude son tres comandos. Worktrunk lo hace en uno, y en Windows tiene una trampa.

Según su README: wt switch, guion c, guion x claude y el nombre de la rama. Crea el worktree, entra y abre Claude. wt list muestra todos. wt remove limpia.

El paso crítico, en Windows: wt ya es el comando de Windows Terminal. Si lo instalás con winget, se llama git guion wt.

Cómo evaluarlo: licencia MIT o Apache, a elección. Y los issues: el treinta de septiembre tenía treinta y tres abiertos, y en la lista de cerrados había varios de esa misma semana. Alguien atiende.

Cómo sabés que anduvo: wt list muestra tu worktree nuevo.

Mis reglas para varios agentes están en la comunidad de WhatsApp.

### G10 · Vertical · Cómo leer un README en un minuto: el primer comando no siempre es del proyecto
**Tipo:** repo · **Origen:** comunidad (desarrollador individual) · **Veredicto:** PASA · **Fecha:** libre · **Demuestra:** README: bloque «Sponsored by Bright Data» con su `npx … --yes` arriba de todo; «Quick Installation»; `--chats --tunnel` («Secure remote access via Cloudflare Tunnel»); «Attribution» · **Cierre:** comunidad de WhatsApp (falta publicar: drop 10, escrito en S4 §5)
**Fuente primaria verificada:** https://github.com/davila7/claude-code-templates — primer bloque de código: «# Install the Bright Data Skills + MCP for Claude Code / npx claude-code-templates@latest --skill web-data/… --mcp web-data/brightdata --yes»; comandos de instalación con `--yes`; `npx claude-code-templates@latest --chats --tunnel`; «Each of these resources retains its original license and attribution». Último commit 30-sep.
**Cambios / notas:** Hay además una insignia «Sponsored by Z.AI» con código de referido (`?ic=…`). No cambia el guion (el punto uno ya cubre sponsors); se puede mostrar en pantalla.

Antes de copiar el primer comando de un repo, fijate de quién es. Ejemplo: claude code templates, un catálogo muy usado de agentes y conexiones para Claude Code.

Uno: el primer comando de su README no es del proyecto. Es de un sponsor, una empresa de datos web. Está bien tener sponsor, pero no es lo que viniste a buscar.

Dos: casi todos los comandos terminan en guion guion yes. Eso instala sin preguntarte. Sacalo, y vas a ver qué entra antes de que entre.

Tres: hay una opción para mirar tus conversaciones desde el celular con un túnel. Un túnel abre algo de tu máquina a internet: activalo solo si sabés cómo se protege.

Cuatro, al final: el catálogo junta piezas de otros autores, cada una con su licencia.

Por qué importa: el comando que pegás decide qué corre en tu máquina.

Cómo sabés que lo leíste bien: podés decir qué instala, qué pide y de quién es cada parte.

Los cuatro chequeos están en la comunidad de WhatsApp.

### G11 · YouTube · Cómo encontrar repos de IA que valen la pena (y cuáles no instalar)
**Tipo:** repo · **Origen:** mixto: paperclip, context-mode y hindsight son comunidad/startups; el «error común» es de Cloudflare (no se nombra) · **Veredicto:** ARREGLADA · **Fecha:** libre, pero **recontar números el día de grabar** y decir la fecha · **Demuestra:** github.com/trending semanal; pestaña Issues de paperclip, hindsight y security-audit-skill; README de paperclip (Quickstart con `npx … onboard --yes`, `test-drive`, «Telemetry»); `LICENSE` de context-mode (Elastic 2.0) y sus logos con `href="#"`; README de hindsight («independently reproduced… Other scores are self-reported», «Coding agents… built automatically from git history and past sessions») · **Cierre:** comunidad de WhatsApp (falta publicar: drop 11, escrito en S4 §5)
**Fuente primaria verificada:** github.com/trending?since=weekly (30-sep): paperclip #1, +12.941. github.com/paperclipai/paperclip (30-sep): 95,2 mil estrellas, «Issues 2.6k», «Pull requests 3.5k»; README (commit del 30-sep «improve README quickstart»): «`npx paperclipai@latest onboard --yes`», «`test-drive`… never installs a service», «Telemetry is **enabled by default**… `PAPERCLIP_TELEMETRY_DISABLED=1`». mksglu/context-mode `LICENSE`: «Elastic License 2.0 (ELv2)»; README: 18 logos `<a href="#">` (Microsoft, Google, Meta…); «315 KB becomes 5.4 KB. 98% reduction». vectorize-io/hindsight: «Issues 87», último commit 30-sep, MIT, paper arXiv 2512.12818, README líneas 50 y 252. cloudflare/security-audit-skill: «Issues 19», 3 cerrados listados.
**Cambios / notas:** (1) **El README de paperclip cambió hoy**: ya no muestra el `curl | bash` con suma SHA-256 que citaba el guion. Se reemplaza por lo que dice hoy (`npx … --yes` y el modo `test-drive`), y se usa el cambio como lección. (2) Números re-medidos el 30-sep; los «cerrados» de paperclip y hindsight no se pudieron re-medir y se sacan. (3) El error común (19 abiertos / 3 cerrados) sigue igual; no se nombra a Cloudflare, como pide el S4 §6.

#### Resultado

A fines de septiembre, el repo más pegado de la semana en GitHub sumó casi trece mil estrellas en siete días. El treinta de septiembre tenía unos dos mil seiscientos issues abiertos, y unos tres mil quinientos pedidos de cambio esperando. Las estrellas te dicen que mucha gente lo miró. No te dicen si alguien lo atiende.

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

Cuatro preguntas. Qué instala: si el comando es un curl que termina en bash, bajá el archivo y leelo antes; si termina en guion guion yes, sacale eso la primera vez. Qué te pide: claves de API, cuentas, acceso a tus herramientas. A dónde manda datos: telemetría, modelos externos. Y quién gana: sponsors, enlaces de afiliado, una versión paga.

Nada de eso es malo. Es información que necesitás antes de decidir.

Y un patrón nuevo: repos que se instalan pegándole a tu agente un pedido que lo manda a leer un archivo del repo. En ese caso, ese archivo le da órdenes a tu agente. Leelo vos primero.

Una regla más: el README se lee el día que instalás, no el día que viste el video. Te lo muestro con el primero de los tres.

#### Paso cinco: si es una skill, escaneala

Esta semana te mostré un escáner que revisa skills antes de instalarlas. Usalo como último filtro, no como el único: un puntaje no reemplaza los cuatro pasos anteriores.

#### Tres repos de esa semana

El primero, Paperclip: una app para manejar equipos de agentes como si fueran una empresa, con organigrama, presupuesto por agente y aprobaciones. Fue el número uno de la semana.

Lo bueno: licencia MIT, y el README te ofrece un modo de prueba, test drive, que corre en primer plano y no instala ningún servicio. Para empezar, ese.

Lo que hay que mirar: el comando principal de instalación termina en guion guion yes, así que acepta todo sin preguntarte. Y el día que lo revisé, cambiaron el README: la forma de instalar que yo había anotado la tarde anterior ya no estaba. Por eso te digo que lo leas el día que instalás.

Además, la telemetría viene activada, y el README nombra la variable que la apaga. Y los issues: unos dos mil seiscientos abiertos. Mi lectura: probalo en una máquina aparte. Todavía no le pondría encima el centro de un negocio.

El segundo, Context Mode: una extensión para que tu agente no se llene la memoria de trabajo con resultados enormes. Promete noventa y ocho por ciento menos de contexto; ese número es del autor.

GitHub dice «Other» en la licencia. Abrís el archivo, y es la Elastic License dos: te deja usarlo, pero no ofrecerlo como servicio administrado. Y arriba del README hay logos de empresas grandes. Ninguno enlaza a una prueba: los enlaces no llevan a ningún lado. No significa que sea falso. Significa que no es evidencia.

Mi lectura: para tu uso personal puede servir. Para montar un producto encima, primero la licencia.

El tercero, Hindsight: memoria para agentes que aprende de lo que pasó.

Lo bueno: la empresa detrás publicó un paper, la licencia es MIT, y el último cambio fue el mismo día que lo miré. Y su README separa los números: dice cuáles reprodujeron terceros y aclara que los de otros productos los publicaron sus propios fabricantes.

La pregunta acá no es si está mantenido. Es qué datos toca. Para agentes de código, arma una memoria por repo a partir de tu historial de git y de tus sesiones pasadas, automático, y necesita un modelo, con clave o con tu suscripción. Antes de instalarlo en un repo con datos de clientes, sabé qué va a leer y a dónde lo manda.

#### El error más común

Confiar en la marca. Esa misma semana, un repo de una empresa enorme de infraestructura tenía diecinueve issues abiertos y tres cerrados. La marca te dice quién lo publicó. No te dice quién lo atiende.

#### Cierre

Resumen: dónde mirar, estrellas contra actividad, la licencia abriendo el archivo, el README como contrato, y el escáner al final.

La planilla con los ocho chequeos y los comandos de gh está en la comunidad de WhatsApp. Contame ahí qué repo estás por instalar.

---

## PARTE 1B — REPOS TOP DE LA COMUNIDAD (R01–R07)

Pedido de Sergio Urcullo (30-sep): además de los oficiales, los repos de IA de la **comunidad** que están en tendencia o creciendo fuerte, verificados en vivo y demostrables en pantalla.

**Fuente usada:** github.com/trending (diario, semanal, mensual, y semanal de Python y TypeScript) leído el **30-sep-2026** con WebFetch — no estaba bloqueado. Estrellas, licencia, tipo de dueño, creación y último push con la API de GitHub (`search_repositories`) el 30-sep. README y LICENSE leídos del clon de cada repo (`git clone --depth 5`). **Solo una lección se ejecutó** (R04, código de Python sin dependencias ni red, revisado antes): el resto se describe desde su README y se dice así.

**Criterio de selección:** comunidad o empresa chica (no Anthropic, OpenAI, Google, NVIDIA, Tencent, Alibaba, Microsoft); sirve para aprender a construir o a vender con IA; se puede mostrar en pantalla; no repite G01–G11 ni el carrusel ya publicado (ponytail, ECC, claude-mem, caveman, karpathy-skills, etc.).

| ID | Repo | ⭐ 30-sep | Tendencia 30-sep | Licencia | Dueño | Último commit | Por qué entra |
|---|---|---|---|---|---|---|---|
| R01 | ahmedkhaleel2004/gitdiagram | 17.598 | #11 TypeScript semanal (+585) | MIT | usuario | 29-sep | truco de una acción, demostrable en 10 s |
| R02 | harry0703/MoneyPrinterTurbo | 127.473 | #6 diario (+464) | MIT | usuario | 30-sep | video corto automático, para creadores; riesgo de derechos real |
| R03 | VectifyAI/PageIndex | 38.067 | #17 diario (+1.095) · #12 Python semanal | MIT | org chica | 30-sep | «tu negocio responde con tus PDFs», sin base vectorial |
| R04 | rohitg00/ai-engineering-from-scratch | 62.094 | #5 semanal (+5.830) | MIT | usuario | 29-sep | curso gratis; lección de agentes corre sin clave (ejecutada) |
| R05 | alirezarezvani/claude-skills | 27.034 | #9 Python semanal (+707) | MIT | usuario | 26-ago | 48 skills de marketing; catálogo gigante → enseñar a instalar poco |
| R06 | colbymchenry/codegraph | 72.552 | #14 diario (+159) | MIT | usuario | 30-sep | mapa del código para Claude Code; README honesto sobre su costo |
| R07 | remotion-dev/remotion | 61.275 | #14 TypeScript semanal (+1.092) | Remotion License (API: NOASSERTION) | empresa chica | 30-sep | video por código para agentes; licencia que cambia con el tamaño de tu empresa |

**Vistos y descartados (30-sep):** `NVIDIA/OpenShell`, `Tencent/WeKnora`, `TencentCloud/Octop`, `alibaba/open-code-review`, `anthropics/financial-services`, `modelcontextprotocol/servers`, `cursor/plugins` (grandes empresas: van a la fila de oficiales si hace falta); `mvschwarz/openrig` (creado en abril, 2.934 ⭐: esperar); `superdesigndev/treg` (3.929 ⭐, nuevo); `mobile-next/mobile-mcp` (bueno, pero la demo pide simulador iOS o emulador Android: candidato para otra semana); `jingyaogong/minimind` (entrenar un modelo propio: necesita GPU, lejos de la audiencia); `openclaw/openclaw`, `mattpocock/skills`, `ComposioHQ/awesome-claude-skills` (enormes y ya muy difundidos; sin ángulo nuevo hoy); `heygen-com/hyperframes` (empresa; ONIA ya lo usa: mejor como historia propia que como repo); `byoungd/up` (guía en chino); `dream-num/univer` (empresa, harness de oficina: revisar en una semana).

### R01 · Vertical · Cambiá dos letras y mirá cómo está armado cualquier repo
**Tipo:** repo-top · **Origen:** comunidad (usuario ahmedkhaleel2004) · **Veredicto:** NUEVA · **Fecha:** libre (en tendencia al 30-sep; ideal cerca de G10/G11, que enseñan a leer repos) · **Demuestra:** en el navegador, `github.com/harry0703/MoneyPrinterTurbo` → `gitdiagram.com/harry0703/MoneyPrinterTurbo`; clic en un componente abre su archivo; el comando MCP en Claude Code · **Cierre:** comunidad de WhatsApp (falta escribir: drop con la URL, el comando `claude mcp add` y el aviso de repos privados)
**Fuente primaria verificada:** https://github.com/ahmedkhaleel2004/gitdiagram — README: «Visualize any codebase: turn any public or private GitHub repository into an interactive architecture diagram… Or replace `hub` with `diagram` in any GitHub repository URL»; «Jump to the code by clicking any component's linked file or directory»; «Use private repositories with a GitHub token via Private Repos»; «GitDiagram is a remote MCP server at `https://gitdiagram.com/mcp` (no key or sign-in)»; `claude mcp add --transport http gitdiagram https://gitdiagram.com/mcp`; bloque «Sponsored» (Sent); licencia MIT.
**Cambios / notas:** gitdiagram.com está bloqueado desde esta sesión: **no vi el sitio funcionando**. Sergio Urcullo prueba la URL antes de grabar; si no genera el diagrama, se baja la pieza. Riesgo dicho a cámara: el token de GitHub para repos privados. El README también tiene sponsor: no se nombra (no aporta).

Cambiá dos letras en la dirección de cualquier repo de GitHub, y te dibuja cómo está armado por dentro.

Se llama GitDiagram. Es de código abierto, licencia MIT, y lo hace un desarrollador, no una empresa grande. En la dirección del repo, donde dice github, cambiás hub por diagram. Queda gitdiagram punto com, el dueño y el repo. Lo ves en pantalla.

Te arma un diagrama con las partes y cómo se conectan. Si tocás una parte, te lleva al archivo.

Y si usás Claude Code, trae un servidor MCP que no pide clave: el comando está en pantalla. Tu agente le puede preguntar la arquitectura de un repo antes de tocarlo.

Un cuidado: para repos privados te pide un token de GitHub. Eso es darle acceso a tu código a un servicio de otra persona. Para lo privado, no.

Cómo sabés que te sirvió: podés decir qué hace cada parte antes de abrir un solo archivo.

Los comandos están en la comunidad de WhatsApp.

### R02 · Vertical · Un video corto entero desde un tema, y el problema de la música
**Tipo:** repo-top · **Origen:** comunidad (usuario harry0703) · **Veredicto:** NUEVA · **Fecha:** libre · **Demuestra:** README en inglés (`README-en.md`): «Docker Deployment», puerto 8501, lista de proveedores de voz (Edge TTS), sección «Background Music» con el aviso de YouTube; bloque de sponsors · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Antes de publicar un video automático»: música propia o con licencia, condiciones de Pexels/Pixabay, voz, revisión humana)
**Fuente primaria verificada:** https://github.com/harry0703/MoneyPrinterTurbo — `README-en.md`: «Provide a video topic or keyword, and MoneyPrinterTurbo will generate the script, match footage, create subtitles and background music»; `docker compose -f docker-compose.release.yml up` → «http://127.0.0.1:8501»; «Use Edge TTS (free, no API key required)»; stock de «Pexels (free), Pixabay (free), and Coverr»; «The current project includes some default music from YouTube videos. If there are copyright issues, please delete them»; bloque de sponsors con enlaces `aff=` y `utm_`; licencia MIT. Carpeta `resource/songs/` con `output000.mp3`… en el clon.
**Cambios / notas:** No se ejecutó. La pieza no promete calidad del video: enseña a revisar derechos. El nombre («imprenta de plata») no se traduce a cámara: empuja a contenido genérico, que es justo lo que el guion desaconseja.

Hay un repo que te arma un video corto entero a partir de un tema: guion, voz, imágenes de stock, subtítulos y música. Antes de usarlo para tu negocio, mirá la música.

Se llama MoneyPrinterTurbo, licencia MIT. Según su README, lo levantás con Docker y lo abrís en el navegador, en el puerto ocho mil quinientos uno. Ponés la clave de un modelo, escribís el tema y genera. La voz puede ser Edge TTS, gratis y sin clave.

Ahora, lo que no es técnico. Uno: el propio README dice que la música que trae por defecto sale de videos de YouTube, y que si hay problemas de derechos, la borres. Borrala antes de publicar y usá música con licencia. Dos: las imágenes salen de bancos como Pexels: leé sus condiciones.

Cómo sabés que sirve: el video dice algo de tu negocio que no podría decir cualquier otro.

Por qué importa: un reclamo de derechos te puede bajar el video.

La lista de chequeo está en la comunidad de WhatsApp.

### R03 · Vertical · Que la IA lea tu PDF largo como una persona, por secciones
**Tipo:** repo-top · **Origen:** comunidad (org chica VectifyAI) · **Veredicto:** NUEVA · **Fecha:** libre · **Demuestra:** README «Quickstart» (`pip install -U pageindex` y las ~10 líneas de Python), gráfico de costo por página, sección FinanceBench; una corrida con un PDF propio **sin datos de clientes** (si Sergio Urcullo la hace) · **Cierre:** comunidad de WhatsApp (falta escribir: drop con el script del Quickstart comentado en español y la advertencia de datos)
**Fuente primaria verificada:** https://github.com/VectifyAI/PageIndex — README: «PageIndex replaces the vector index with a hierarchical tree index and lets an LLM reason its way through it»; «`pip install -U pageindex` now ships local mode: index, retrieve, and chat entirely on your machine with your own LLM key»; Quickstart con `OPENAI_API_KEY`, `client.submit_document("report.pdf")`, `client.chat(...)`; «Building a tree locally runs about $0.001 per page… a 1,000-page textbook costs a little over a dollar»; «98.7% accuracy on FinanceBench» (resultado propio, enlazado a su blog y su repo de evaluación); licencia MIT.
**Cambios / notas:** «Local» significa que el índice se arma en tu máquina, pero **el texto va al proveedor del modelo** (OpenAI en el ejemplo): se dice a cámara. La cifra de 98,7 % es del fabricante. No se ejecutó.

Tu negocio tiene un PDF largo: un reglamento, un catálogo, un contrato. Hay un repo que hace que la IA lo lea por secciones, como una persona, en vez de buscar pedacitos parecidos.

Se llama PageIndex, licencia MIT. Arma un índice en forma de árbol, y el modelo razona por dónde entrar. Se instala con pip install pageindex, y son unas diez líneas de Python, en pantalla.

Según su README, armar el índice cuesta alrededor de una décima de centavo de dólar por página. Mil páginas, poco más de un dólar, una vez.

Dos cuidados. Uno: aunque diga modo local, usa tu clave de OpenAI, así que el texto del PDF va a OpenAI. Si tiene datos de clientes, pensalo antes. Dos: el noventa y ocho por ciento de acierto que muestran es una medición suya.

Cómo lo comprobás: hacele una pregunta cuya respuesta ya sepas, y pedile que te diga en qué parte del documento la encontró.

El script comentado está en la comunidad de WhatsApp.

### R04 · Vertical · Un curso gratis de IA en GitHub cuya primera lección de agentes corre sin clave
**Tipo:** repo-top · **Origen:** comunidad (usuario rohitg00) · **Veredicto:** NUEVA · **Fecha:** libre · **Demuestra:** portada en español (`i18n/es/README.md`); en la terminal, `python3 phases/14-agent-engineering/01-the-agent-loop/code/main.py` y su salida (TOY REACT LOOP: 120 + 15 % = 138.0, 5 turnos, 3 herramientas) · **Cierre:** comunidad de WhatsApp (falta escribir: drop con los tres comandos y las lecciones 14-01 a 14-05 sugeridas en orden)
**Fuente primaria verificada:** https://github.com/rohitg00/ai-engineering-from-scratch — README: «523 lessons. 20 phases… Free, open source, MIT»; tabla «I want to build agents → Phase 14: Agent Engineering»; «English is canonical; lesson pages are machine-translated on the `translations` branch». Lección `phases/14-agent-engineering/01-the-agent-loop/docs/en.md`: «**Languages:** Python (stdlib)… Implement a stdlib agent loop with a toy LLM, tool registry, and stop condition»; «Every agent in 2026 is a variant of the ReAct loop… Claude Code, Cursor, Devin, Operator included». **Ejecutado el 30-sep** (código revisado: solo `dataclasses` y `typing`, sin red): salida «final answer: the total including 15% tax is 138.0 · turns used: 5 · tools used: ['calculator', 'kv_get', 'kv_set']».
**Cambios / notas:** La corrida la hizo el revisor, no Sergio Urcullo: por eso el guion no dice «lo corrí». Antes de grabar, Sergio la corre (tarda un segundo) y graba su pantalla. El «84 % de estudiantes…» del README no tiene fuente a la vista: no se usa.

Hay un curso gratis de ingeniería de IA en GitHub, con más de quinientas lecciones. Y la primera lección de agentes corre sin clave.

Se llama AI Engineering from Scratch, licencia MIT, y la portada está en español. Para agentes, andá a la fase catorce, lección uno: el bucle del agente.

Clonás el repo, y corrés el archivo main punto py de esa lección con python tres. Solo usa Python, sin instalar nada.

Lo que ves en pantalla es un agente de juguete: piensa, usa una calculadora, guarda un dato, y repite hasta terminar. Ciento veinte más quince por ciento de impuesto: ciento treinta y ocho. Cinco vueltas, tres herramientas.

Según la lección, ese mismo bucle es lo que hacen por dentro los agentes de hoy, Claude Code incluido: pensar, usar una herramienta, leer el resultado.

Cómo sabés que lo entendiste: cambiás la pregunta y adivinás cuántas vueltas va a dar antes de correrlo.

El orden de lecciones que te recomiendo está en la comunidad de WhatsApp.

### R05 · Vertical · Casi cuatrocientas skills gratis para Claude Code: instalá un solo paquete
**Tipo:** repo-top · **Origen:** comunidad (usuario alirezarezvani) · **Veredicto:** NUEVA · **Fecha:** libre, **después de G04** (lo cita) · **Demuestra:** README «Quick Install» (`/plugin marketplace add alirezarezvani/claude-skills` y `/plugin install marketing-skills@claude-code-skills`); carpeta `marketing-skill/skills/` (48 skills: `page-cro`, `cold-email`, `local-seo-manager`…); las cifras distintas del README; `STORE.md` · **Cierre:** comunidad de WhatsApp (falta escribir: drop con los dos comandos, cómo escanear el paquete con SkillSpector y las cinco skills de marketing más útiles para un negocio chico)
**Fuente primaria verificada:** https://github.com/alirezarezvani/claude-skills — README: «388 production-ready Claude Code skills»; badge «Skills-388»; «Convert all 345 skills to 9 AI coding tools»; «706 CLI scripts» y más abajo «All 727 Python tools»; «> 5,200+ GitHub stars» (la API da 27.034 el 30-sep); `/plugin install marketing-skills@claude-code-skills # 43 marketing skills`. En el clon: 48 carpetas en `marketing-skill/skills/` y 62 archivos `.py` en `marketing-skill/`. `STORE.md`: «Commercial Distribution — Stan Store & Gumroad… Indie Hacker Pack — $49». Licencia MIT. Último commit 26-ago.
**Cambios / notas:** Riesgos a cámara: scripts que ejecutan código (→ escanear), cifras que no coinciden (→ no es evidencia) y parte vendida aparte. Último commit hace más de un mes: no es abandono, pero se dice en el drop, no a cámara. No se instaló.

Hay un repo con casi cuatrocientas skills gratis para Claude Code, y cuarenta y ocho son de marketing. No instales las cuatrocientas.

Se llama claude skills, licencia MIT. Viene por paquetes: ingeniería, producto, marketing, finanzas. En Claude Code agregás el catálogo y después instalás un solo paquete. Los dos comandos están en pantalla.

Adentro del de marketing hay, por ejemplo, page cro, para revisar por qué una página no convierte, y cold email, para correos en frío.

Tres cuidados. Uno: ese paquete trae más de sesenta scripts de Python. Una skill con scripts ejecuta código en tu máquina: escaneala antes, como te mostré con el escáner de NVIDIA. Dos: los números del README no coinciden; en un lugar dice trescientas ochenta y ocho skills, en otro trescientas cuarenta y cinco. No es grave, pero no es evidencia. Tres: una parte se vende aparte, en paquetes pagos.

Cómo sabés que quedó instalado: escribís barra skills y aparece page cro.

El chequeo completo está en la comunidad de WhatsApp.

### R06 · Vertical · Un mapa de tu código para Claude Code, y dónde te cuesta más
**Tipo:** repo-top · **Origen:** comunidad (usuario colbymchenry) · **Veredicto:** NUEVA · **Fecha:** libre · **Demuestra:** README: pasos 1-3 (`codegraph install`, `codegraph init`), la tabla de siete repos, el párrafo «A note on context», sección «Telemetry» · **Cierre:** comunidad de WhatsApp (falta escribir: drop con los comandos, `codegraph telemetry off` y `codegraph uninstall`)
**Fuente primaria verificada:** https://github.com/colbymchenry/codegraph — README: «100% local»; `codegraph install` («Detects and auto-configures Claude Code… wiring the CodeGraph MCP server»); `codegraph init` («creates the local `.codegraph/` directory and builds the full graph»); «44% lower cost and 62% fewer tokens on average across the seven benchmark repos» (medición del autor, 2026-08); «A note on context… CodeGraph's responses leave about 80% more retrieval context resident at the end of a session»; «CodeGraph collects anonymous usage statistics… The installer asks up front… `codegraph telemetry off`»; instalador `curl -fsSL …/install.sh | sh`; `codegraph uninstall`. Licencia MIT. 514 issues+PR abiertos (API, 30-sep).
**Cambios / notas:** No se instaló. Las cifras de ahorro son del autor: el guion las atribuye y no las repite con número. Lo que se destaca es la advertencia honesta del propio README.

Hay una herramienta que le da a tu agente un mapa de tu código, y su propio README te dice dónde te va a costar más.

Se llama CodeGraph, licencia MIT, y corre en tu máquina. Tres pasos, según su README: instalás, corrés codegraph install para conectarla con Claude Code, y en tu proyecto, codegraph init, que arma el mapa.

La promesa: en vez de abrir archivo por archivo, el agente pregunta una vez y recibe el código justo. El autor midió siete repos y reporta menos llamadas y menos costo por respuesta.

Pero el mismo README avisa: al final de una sesión larga te queda más contexto ocupado, no menos.

Dos cosas más. Manda estadísticas de uso anónimas, y se apagan con codegraph telemetry off. Y el instalador de una línea es un curl: bajalo y leelo antes.

Cómo sabés que anduvo: en tu próxima pregunta, el agente usa la herramienta de CodeGraph en vez de abrir diez archivos.

Los comandos están en la comunidad de WhatsApp.

### R07 · Vertical · Videos por código con tu agente, y la licencia que cambia con tu tamaño
**Tipo:** repo-top · **Origen:** comunidad (empresa chica Remotion) · **Veredicto:** NUEVA · **Fecha:** libre · **Demuestra:** README («Video tools for the agent era», `npx create-video@latest`, «Agent Skills»); la etiqueta «Other» en GitHub y el `LICENSE.md` abierto (Free License: elegibilidad; Company License) · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Remotion: ¿en qué licencia caés?» con las cuatro condiciones de la Free License y el enlace a la FAQ oficial)
**Fuente primaria verificada:** https://github.com/remotion-dev/remotion — README: «Video tools for the agent era»; «Make videos agentically: Turn your idea into a video using your coding agent»; `npx create-video@latest`; «Remotion has a special license and requires obtaining a company license in some cases». `LICENSE.md`: «You are eligible to use Remotion for free if you are: an individual · a for-profit organization with up to 3 employees · a non-profit or not-for-profit organization · evaluating…»; «It is not allowed to copy or modify Remotion code for the purpose of selling… your own derivate of Remotion»; «You are required to obtain a Company License… if you are not within the group of entities eligible». API: licencia NOASSERTION. Ejemplo ONIA: `CLAUDE.md` §Video (HyperFrames).
**Cambios / notas:** No se da consejo legal: se dice qué dice la licencia. No se cita precio de la licencia de empresa (no lo verifiqué: está en remotion.pro). No se dice nada sobre la licencia de HyperFrames (no la verifiqué); solo que ONIA usa otra herramienta y aplica la misma regla.

Podés hacer videos escribiendo código, y tu agente también. Pero antes de usar Remotion en tu empresa, contá cuántos son.

Remotion hace videos con React y se presenta como herramienta para agentes: trae skills para que tu agente arme el video. Se arranca con npx create video, en pantalla.

Lo que casi nadie lee: la licencia no es MIT. GitHub te muestra «Other». Abrís el archivo y dice: gratis para personas, para empresas con fines de lucro de hasta tres empleados, y para organizaciones sin fines de lucro. Si tu empresa es más grande, necesitás una licencia de empresa, paga.

En ONIA hacemos video por código con otra herramienta, y la regla es la misma: la licencia se lee antes de construir encima.

Cómo sabés que estás bien: sabés en qué grupo de la licencia caés, y lo anotaste.

Por qué importa: si tu negocio crece, lo que era gratis puede pasar a ser una cuenta por pagar.

El resumen de la licencia está en la comunidad de WhatsApp.

---

## PARTE 2 — NOTICIAS

Temas ya cubiertos que se evitaron: Sonnet 5.5 vs Opus 5.5 (D01-B/C), WhatsApp cobra por servicio (D02-B, D08-C), /skill-doctor (D04-B), AGENTS.md (D03-B), artefactos en Free (D05-B), voz de Google (D09-B), migración de Gemini 2.5 (D10-B), n8n Force Tool Call (D08-B), Sora (D16-B), GPT Image 2.5 (D15-B), Seedance draft (D14-B). N01 **complementa** a D08-B (no la repite): la opción que enseña D08-B rompe con Sonnet 5.5.

### N01 · Vertical · Sonnet 5.5 rechaza la opción de n8n que obliga a usar la herramienta
**Tipo:** noticia · **Veredicto:** NUEVA · **Fecha:** publicar entre 9-oct y 14-oct (ideal **vie 9-oct**, el día después de D08-B; sigue siendo noticia hasta ~15-nov) · **Demuestra:** la guía de migración de Anthropic (sección «Forced tool use is not supported») y el código de n8n donde la opción usa `tool_choice: 'any'` · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Sonnet 5.5 en n8n», texto propuesto en Pendientes)
**Fuente primaria verificada:** https://platform.claude.com/docs/en/release-notes/overview (28-sep): «Forced tool use (`tool_choice` types `any` and `tool`) returns a 400 error.» · https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide: «Claude Sonnet 5.5 rejects both with a 400 error… `tool_choice: type "tool" and "any" are not supported for this model.` Send `tool_choice: {"type": "auto"}`, and mark the tool `strict: true`… say in the prompt when to use it»; «On Claude Sonnet 5.5, `disabled` returns a 400… Use "thinking.type.between_tools"». · Código de n8n (github.com/n8n-io/n8n, `packages/@n8n/nodes-langchain/nodes/agents/Agent/agents/ToolsAgent/V3/helpers/createAgentSequence.ts`): «forceToolCall && model.bindTools ? model.bindTools(allTools, { tool_choice: 'any' }) : model».
**Cambios / notas:** Leído, no probado: el choque sale de juntar la doc de Anthropic con el código de n8n. La verificación del guion es justamente correr la ejecución y leer el error. ONIA corre n8n 2.35.3 (no tiene la opción): la demo se hace en una copia con 2.40+ o se muestra la doc y el código en pantalla.

Si en n8n activaste la opción que obliga al agente a usar la herramienta, y lo pasás a Sonnet cinco punto cinco, te va a dar error.

Sonnet cinco punto cinco salió el veintiocho de septiembre. En la guía de migración dice: forzar el uso de una herramienta ya no está soportado. En la API se llama tool choice any, o tool. Devuelve error cuatrocientos.

Y en el código de n8n, la opción Force Tool Call on First Iteration usa exactamente tool choice any.

Qué hacer. Uno: con Sonnet cinco punto cinco, dejá esa opción apagada. Dos: en el mensaje de sistema, decí cuándo usar la herramienta: «antes de responder sobre stock, consultá la herramienta de stock». Tres: si programás vos, la guía propone tool choice auto y marcar la herramienta como estricta.

Cómo lo comprobás: corré una ejecución de prueba. Si falla, el error lo dice textual: tool choice any no está soportado para este modelo.

La guía resumida está en la comunidad de WhatsApp.

### N02 · Vertical · Sonnet 4.5 se apaga el 30 de noviembre: encontralo y migralo con un comando
**Tipo:** noticia · **Veredicto:** NUEVA · **Fecha:** publicar entre 1-oct y 14-oct (ideal **vie 2-oct**; es noticia hasta el 30-nov, fecha del retiro) · **Demuestra:** la nota del 30-sep en las release notes de la plataforma; búsqueda del ID en un proyecto; `/claude-api migrate` corriendo en Claude Code con su pregunta de alcance · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Checklist de migración desde Sonnet 4.5», texto propuesto en Pendientes)
**Fuente primaria verificada:** https://platform.claude.com/docs/en/release-notes/overview (30-sep): «We announced the deprecation of the Claude Sonnet 4.5 model (`claude-sonnet-4-5-20250929`), with retirement on the Claude API scheduled for November 30, 2026. We recommend migrating to Claude Sonnet 5.5». · https://platform.claude.com/docs/en/models/sonnet-5-5/migration-guide: «In Claude Code, run `/claude-api migrate`… `/claude-api migrate this project to claude-sonnet-5-5`… It asks you to confirm the migration scope… then produces a checklist of items to verify manually»; checklist: «Replace assistant prefills» (Sonnet 4.5 o anterior), «Remove non-default `temperature`, `top_p`, and `top_k` values», «Replace forced tool use».
**Cambios / notas:** No se inventa «deja de responder»: se dice «retiro en la API», que es lo que publica Anthropic. El ejemplo es genérico (cualquier automatización); ONIA no se nombra porque no verifiqué qué modelo usa hoy el bot. Si Sergio Urcullo quiere un ejemplo propio: `grep -rn "claude-sonnet-4-5" ` en los repos de ONIA antes de grabar, y se usa el resultado real.

Sonnet cuatro punto cinco se retira de la API de Claude el treinta de noviembre. Si una automatización tuya lo usa, tenés dos meses. Así lo encontrás y lo migrás.

Anthropic recomienda pasar a Sonnet cinco punto cinco.

Paso uno: buscalo. En tu código, buscá el texto claude guion sonnet guion cuatro guion cinco. En n8n, abrí cada nodo de Anthropic y mirá qué modelo tiene elegido.

Paso dos: si el código está en una carpeta, abrí Claude Code y escribí lo que ves en pantalla: barra claude api migrate, y el modelo nuevo. Te pregunta qué archivos tocar, y al final te deja una lista para revisar.

Paso tres, el crítico. Tres cosas que el cuatro punto cinco aceptaba y el cinco punto cinco rechaza con error: una temperatura cambiada, una respuesta pre-llenada, y obligarlo a usar una herramienta.

Cómo sabés que quedó: tu prueba corre sin error y la respuesta indica el modelo nuevo.

La lista completa está en la comunidad de WhatsApp.

### N03 · Vertical · Claude Code ya no te pregunta casi nada: qué deja pasar el modo auto
**Tipo:** noticia · **Veredicto:** NUEVA · **Fecha:** publicar entre 1-oct y 14-oct (ideal **jue 1-oct o sáb 3-oct**; noticia hasta ~20-oct, después pasa a tutorial) · **Demuestra:** la barra de estado de Claude Code con el modo; Shift+Tab ciclando modos; la lista «Blocked by default» / «Allowed by default» de la doc; el bloque de `settings.json` y la sesión nueva mostrando «manual mode on» · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Volver a modo manual», texto propuesto en Pendientes)
**Fuente primaria verificada:** https://code.claude.com/docs/en/permission-modes: «With Claude Code v2.1.283 or later, auto mode is the built-in starting permission mode for interactive terminal and VS Code sessions on every plan and provider. On earlier versions, it's the built-in starting permission mode only on Pro, Max, and Team plans.» Bloqueado por defecto: «Downloading and executing code, like `curl | bash`… Production deploys and migrations… Irreversibly destroying files that existed before the session · Force push · `git reset --hard`…». Permitido por defecto: «Local file operations in your working directory · Installing dependencies declared in your lock files… · Pushing to any branch of the repository you're working in, including the default branch». Volver: `{"permissions": {"defaultMode": "default"}}` en `~/.claude/settings.json` → «The next session you start shows `⏸ manual mode on`». · https://code.claude.com/docs/en/changelog 2.1.284 (28-sep): «Changed interactive terminal and VS Code sessions to start in auto mode». · Ejemplo ONIA: `CLAUDE.md` §«`main` siempre compila» («`main` alimenta el deploy del VPS y el de Vercel»).
**Cambios / notas:** Matiz honesto: en Pro, Max y Team ya era el modo de arranque desde el 14-ago (digest Week 32). Lo nuevo de fines de septiembre es que vale para todos los planes y proveedores. El guion dice «en todos los planes», que es exacto. La doc y el changelog difieren en la versión (2.1.283 vs 2.1.284): no se nombra versión a cámara.

Tu Claude Code probablemente ya no te pide permiso para casi nada. Desde fines de septiembre arranca en modo auto, en todos los planes. Esto es lo que deja pasar.

En modo auto, un segundo modelo revisa cada acción en vez de vos. Según la documentación, por defecto bloquea: bajar y ejecutar código de internet, deploys a producción, force push, borrar archivos que ya existían, y los comandos de git que tiran cambios sin guardar.

Pero por defecto deja pasar: editar archivos en tu carpeta, instalar dependencias, y hacer push a cualquier rama del repo. Incluida la principal.

En ONIA eso importa: la rama principal alimenta el deploy. Un push con trabajo a medias rompe producción.

Cómo lo ves: mirá la barra de abajo, dice en qué modo estás. Shift Tab lo cambia.

Si querés que vuelva a preguntarte, en el archivo settings de tu carpeta punto claude poné default mode en default. La próxima sesión dice manual mode on.

El bloque para copiar está en la comunidad de WhatsApp.

### N04 · Vertical · Una skill llamada verify y Claude Code la corre antes de cada commit
**Tipo:** noticia · **Veredicto:** NUEVA · **Fecha:** publicar entre 3-oct y 14-oct (ideal **lun 5-oct**; noticia hasta ~31-oct, después es tutorial evergreen) · **Demuestra:** crear `.claude/skills/verify/SKILL.md` en vivo; pedir un commit y ver que Claude corre la skill antes · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Plantilla de verify», texto propuesto en Pendientes)
**Fuente primaria verificada:** https://code.claude.com/docs/en/changelog 2.1.286 (30-sep): «Improved commit guidance: when your project or user skills include one named `verify`, Claude is now told to run it right before committing». · https://code.claude.com/docs/en/skills: ubicación `.claude/skills/<skill-name>/SKILL.md`; frontmatter `name` y `description`; «`/verify` can also record its own recipe… writes what worked to `.claude/skills/verify/SKILL.md`». · Ejemplo ONIA: `CLAUDE.md` §«`main` siempre compila» y §«Git — auto-sync» (el 23-ago el autosync subió 217 líneas de CSS a `main` antes del markup; gates: `tsc --noEmit`, tests).
**Cambios / notas:** Es una **indicación** al modelo, no un candado: se dice a cámara en una frase. Cuidado de no chocar con D03-A (hook que commitea solo): acá el tema es el chequeo antes del commit, no el commit automático. Si Claude Code ya trae una skill `/verify` incorporada que escribe su receta en esa misma ruta, crear la propia la reemplaza: la demo usa la propia.

Desde el treinta de septiembre, si tu proyecto tiene una skill que se llama verify, Claude Code la corre antes de cada commit.

Lo dice el registro de cambios de Claude Code de ese día: con una skill llamada verify, a Claude se le indica correrla justo antes de commitear. Es una indicación, no un candado.

Paso uno: en tu proyecto creá la carpeta punto claude, adentro skills, adentro verify, y un archivo SKILL punto md.

Paso dos: arriba, el nombre verify y una descripción corta. Abajo, tus chequeos en orden. Los míos: que compile, con npx tsc guion guion no emit, y que pasen los tests. Si algo falla, no commitear y decir qué falló.

Paso tres: actualizá con claude update.

Por qué importa: en ONIA la rama principal alimenta el deploy. Y ya nos pasó que un proceso automático subió trabajo a medias.

Cómo sabés que anduvo: pedile un commit y fijate que antes aparezca la skill verify corriendo.

La plantilla está en la comunidad de WhatsApp.

### N05 · Vertical · n8n suma caché de prompts al nodo de Anthropic
**Tipo:** noticia · **Veredicto:** NUEVA (condicionada) · **Fecha:** publicar entre 7-oct y 14-oct **solo si n8n 2.42 ya salió como estable** (hoy es pre-release); noticia hasta ~15-nov · **Demuestra:** la opción «Prompt Caching» del nodo Anthropic en una copia con 2.42; dos ejecuciones seguidas y el uso de tokens de la segunda · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Caché en n8n», texto propuesto en Pendientes)
**Fuente primaria verificada:** https://github.com/n8n-io/n8n/releases/tag/n8n%402.42.0 (29-sep, marcada **Pre-release**): «**Anthropic Node:** Add prompt caching to the Message operation (#35804)». · https://github.com/n8n-io/n8n/pull/35804: opción «Prompt Caching», por defecto «Disabled», valores «5 Minutes / 1 Hour»; cachea «the reusable prefix of the request (tools, system message and earlier messages)»; «Only takes effect once the prefix reaches the model's minimum cacheable length, which ranges from 512 to 4096 tokens depending on the model; shorter prefixes are sent uncached and no error is returned»; «cached tokens are reported separately by the API». · https://www.anthropic.com/claude-sonnet-5-5: entrada USD 2, «Cache reads: $0.20», «Cache writes: $2.50» por millón.
**Cambios / notas:** Es el nodo **Anthropic** (operación Message), no el sub-nodo de modelo del AI Agent: se dice así. ONIA corre 2.35.3: la demo va en una copia, y no se actualiza producción sin plan (regla ya dicha en D08-B). Si el 7-oct 2.42 sigue en pre-release, se mueve a la semana siguiente.

n8n agregó caché de prompts al nodo de Anthropic. La parte que tu bot repite en cada mensaje puede costar la décima parte.

Está en n8n dos punto cuarenta y dos. En el nodo Anthropic, operación Message, hay una opción nueva: Prompt Caching. Viene apagada.

Guarda lo que se repite: herramientas, mensaje de sistema y conversación anterior. En Sonnet cinco punto cinco, según Anthropic, leer de la caché cuesta veinte centavos por millón de tokens, contra dos dólares la entrada normal. Guardarla cuesta un poco más.

La trampa: si lo repetido es corto, menos de quinientos doce tokens o más según el modelo, no se guarda, y no te avisa.

Cómo lo comprobás: corré el flujo dos veces seguidas y abrí la salida de la segunda. En el uso, la API informa aparte los tokens leídos de la caché.

Por qué importa: sin caché, un mensaje de sistema largo se paga completo en cada respuesta.

Probalo en una copia; el paso a paso está en la comunidad de WhatsApp.

### N06 · Vertical · Un agente de terminal gratis, ahora con Gemini 3.8 Flash
**Tipo:** noticia · **Veredicto:** NUEVA · **Fecha:** publicar entre 1-oct y 7-oct (ideal **sáb 3-oct**, lejos de D10-B del 10-oct que también habla de 3.8 Flash; noticia hasta ~20-oct) · **Demuestra:** `npm install -g @google/gemini-cli`, login con cuenta de Google, `/model` mostrando `gemini-3.8-flash`, un pedido sobre una carpeta real · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Gemini CLI en 5 minutos», texto propuesto en Pendientes)
**Fuente primaria verificada:** https://github.com/google-gemini/gemini-cli (README): «npm install -g @google/gemini-cli»; con cuenta personal de Google «60 requests/min and 1,000 requests/day»; «Apache License 2.0». · https://github.com/google-gemini/gemini-cli/releases/tag/v0.62.0 (29-sep, estable): «Feat/gemini 3.8 flash 3.5 flash lite (#29443)». · https://github.com/google-gemini/gemini-cli/pull/29443: agrega `gemini-3.8-flash` y `gemini-3.5-flash-lite`; con `LOGIN_WITH_GOOGLE` el acceso pasa por «experiment-gated access flags»; con clave de API («USE_GEMINI») «automatically receive access»; se elige en el diálogo `/model`.
**Cambios / notas:** Las páginas de Google (ai.google.dev, blog.google) están bloqueadas en esta sesión: todo sale del repo oficial en GitHub. No se dice nada sobre uso de datos del plan gratis porque no lo pude leer en la fuente de Google; **pendiente** leer los términos de Gemini Code Assist antes de grabar y, si usan los datos para mejorar productos, agregar una línea de riesgo (como en G01).

Google tiene un agente de terminal gratis, y desde el veintinueve de septiembre suma Gemini tres punto ocho Flash.

Se llama Gemini CLI. Es abierto, licencia Apache. Se instala con el comando en pantalla y lo abrís escribiendo gemini.

Entrás con tu cuenta de Google. Su página en GitHub dice: sesenta pedidos por minuto y mil por día, gratis.

Lo nuevo: la versión cero punto sesenta y dos agrega Gemini tres punto ocho Flash y tres punto cinco Flash Lite. Escribís barra model y elegís.

El detalle: con cuenta de Google, el modelo nuevo se habilita de a poco. Con clave de API de Gemini, ya está.

Probalo: abrí una carpeta con tus archivos y pedile: «resumime qué hay acá y qué falta».

Cómo sabés que anduvo: barra model muestra tres punto ocho Flash elegido, y la respuesta nombra archivos que existen.

Por qué importa: para aprender a trabajar con un agente no necesitás pagar el primer mes.

Los pasos, con capturas, están en la comunidad de WhatsApp.

### N07 · Vertical · Dos voces conversando en una sola generación: Eleven v4 en Higgsfield
**Tipo:** noticia · **Veredicto:** NUEVA (condicionada a aprobación de gasto) · **Fecha:** publicar entre 5-oct y 14-oct (ideal **mié 7-oct**; noticia hasta ~28-oct) · **Demuestra:** `higgsfield generate cost` antes de crear; un diálogo de anuncio de 20 segundos con dos voces, en español · **Cierre:** comunidad de WhatsApp (falta escribir: drop «Guion de diálogo para anuncio», texto propuesto en Pendientes)
**Fuente primaria verificada:** https://higgsfield.ai/creator-hub/changelog (28-sep): «Eleven v4, ElevenLabs' new text-to-speech model, is now available in Audio on Higgsfield» — «90+ languages, handles multiple speakers in one generation, follows delivery prompts more closely than earlier models, and accommodates up to 10,000 characters per generation». Regla ONIA de gasto: `CLAUDE.md` §Higgsfield («siempre ejecutar `higgsfield generate cost` antes de `generate create`… pedir aprobación explícita»).
**Cambios / notas:** La fuente es el changelog de Higgsfield (proveedor que lo ofrece); el blog de ElevenLabs está bloqueado en esta sesión y no se leyó. Por la regla de gasto, **la pieza no se graba sin aprobación de Sergio Urcullo del costo cotizado** (audio, no video, pero es generación paga). Si no se aprueba, se descarta. Nada de clonar voces ajenas: voces de catálogo.

ElevenLabs sacó Eleven versión cuatro, su modelo nuevo, y ya está dentro de Higgsfield. Lo útil para un anuncio: dos voces conversando, en una sola generación.

Según el registro de cambios de Higgsfield, del veintiocho de septiembre: más de noventa idiomas, varios hablantes en una misma generación, sigue mejor las indicaciones de tono, y acepta hasta diez mil caracteres por pedido.

Probalo así. Escribí un diálogo de veinte segundos: una persona cuenta el problema, la otra responde con tu producto. Al lado de cada línea, el tono: dudoso, seguro.

Antes de generar, mirá cuánto cuesta. Yo siempre corro higgsfield generate cost antes de crear: si no sé el precio, no aprieto el botón.

Cómo sabés que salió bien: las dos voces no se confunden, y el tono cambia donde lo marcaste.

Por qué importa: una locución a dos voces ya no pide un estudio.

Una regla: voces del catálogo, o la tuya. La de otro, solo con su permiso.

El guion de ejemplo está en la comunidad de WhatsApp.

---

## Pendientes del lote

### Recursos a escribir (drops de la comunidad)
Los drops de G01–G11 ya están **escritos** en `S4-GITHUB-REPOS.md` §5, pero **no publicados**: publicar cada uno en Onia Community antes que su video. Corrección obligatoria en el drop 5 (G05): atribución «curaduría CC BY 4.0, © LearnPrompt / goodcase.ai», no «MIT». Drops nuevos que faltan escribir (propuesta de texto):

- **N01 · Sonnet 5.5 en n8n:** «1) Con Sonnet 5.5, apagá Force Tool Call on First Iteration (usa tool_choice any → error 400). 2) Mensaje de sistema: "Antes de responder sobre [tema], usá la herramienta [nombre]." 3) En código: `tool_choice: {"type":"auto"}` + `strict: true` en la herramienta. 4) `thinking: {"type":"disabled"}` → `{"type":"between_tools"}`. Fuente: platform.claude.com/docs/en/models/sonnet-5-5/migration-guide».
- **N02 · Checklist desde Sonnet 4.5:** «Buscar `claude-sonnet-4-5` en código y en nodos de n8n · En Claude Code: `/claude-api migrate this project to claude-sonnet-5-5` · Sacar temperature/top_p/top_k no default · Reemplazar respuestas pre-llenadas (prefill) · Reemplazar tool_choice any/tool · Probar: sin error 400 y `model` nuevo en la respuesta · Retiro: 30-nov-2026».
- **N03 · Volver a modo manual:** el bloque `{"permissions":{"defaultMode":"default"}}` en `~/.claude/settings.json`; Shift+Tab para cambiar en la sesión; la lista «bloqueado / permitido por defecto» traducida; sugerencia: regla de permisos `ask` para `Bash(git push *)` si no querés push sin preguntar (verificar la sintaxis en code.claude.com/docs/en/permissions antes de publicar).
- **N04 · Plantilla de verify:** `.claude/skills/verify/SKILL.md` con frontmatter `name: verify` / `description: Chequeos obligatorios antes de cada commit` y cuerpo: «1. `npx tsc --noEmit` 2. tests del proyecto 3. si algo falla: no commitear, decir qué falló y dónde». Aclarar que es una indicación, no un candado.
- **N05 · Caché en n8n:** dónde está la opción, 5 min vs 1 h, el mínimo de 512–4.096 tokens, precios de Sonnet 5.5 (entrada 2 · lectura de caché 0,20 · escritura 2,50 USD por millón), «probá en una copia».
- **N06 · Gemini CLI en 5 minutos:** instalar, login, `/model`, primer pedido; + línea de uso de datos **después** de leer los términos de Google.
- **N07 · Guion de diálogo para anuncio:** plantilla de 20 s, dos voces, tono por línea; regla de permiso de voz.
- **R01 · GitDiagram:** la URL (`github.com/…` → `gitdiagram.com/…`), `claude mcp add --transport http gitdiagram https://gitdiagram.com/mcp`, y «repos privados: no le des tu token».
- **R02 · Antes de publicar un video automático:** borrar `resource/songs/` y usar música con licencia; condiciones de Pexels/Pixabay/Coverr; voz propia o Edge TTS; una revisión humana del guion; los sponsors del README tienen enlaces de afiliado.
- **R03 · PageIndex comentado:** el Quickstart en español, con la advertencia «el texto del PDF va al proveedor del modelo» y «probalo con un documento sin datos de clientes».
- **R04 · Orden de lecciones:** `git clone`, `python3 phases/14-agent-engineering/01-the-agent-loop/code/main.py`, y las lecciones 14-01 a 14-05; aviso de traducción a máquina.
- **R05 · claude-skills sin riesgo:** los dos comandos, cómo correr SkillSpector sobre `marketing-skill/` (drop 4), cinco skills de marketing útiles para un negocio chico, y que `STORE.md` vende paquetes.
- **R06 · CodeGraph:** `codegraph install`, `codegraph init`, `codegraph telemetry off`, `codegraph uninstall`; la nota del README sobre contexto en sesiones largas.
- **R07 · Remotion: ¿en qué licencia caés?:** las cuatro condiciones de la Free License citadas, la prohibición de revender derivados, y el enlace a remotion.pro/faq. Sin consejo legal.

### Riesgos
1. **Números que envejecen en G09 y G11.** Hoy (30-sep) se midieron abiertos, estrellas y tendencia; los **cerrados** de paperclip, hindsight y worktrunk no se pudieron medir en esta sesión. El editor recuenta con `gh` el día de grabar (S4 §6) y dice la fecha a cámara.
2. **README de paperclip cambió el mismo día de la auditoría** (el `curl | bash` con SHA-256 desapareció). El guion ya lo usa como lección, pero otros comandos del lote pueden cambiar igual: releer cada README el día de grabar (S4 §6 ya lo pide).
3. **N01 es una conclusión leída, no probada** (doc de Anthropic + código de n8n). Si Sergio Urcullo puede, correr una ejecución en una copia con n8n ≥ 2.40 y Sonnet 5.5 y mostrar el error real; si el error no aparece (por ejemplo, porque LangChain traduce distinto), la pieza se reescribe o se baja.
4. **N05 depende de que n8n 2.42 salga estable** en la ventana; **N07 depende de aprobación de gasto**. Sin eso, quedan 5 noticias listas.
5. **G08:** el `AGENTS.md` de i-have-adhd autoriza a agentes a comentar en un issue del repo con la etiqueta «AI Agora». Es texto que le da permisos a tu agente: por eso el guion ahora lo dice.
6. **Cierres:** todos van a la comunidad de WhatsApp o a «comentá PALABRA» con drop escrito; ninguno depende de una guía web que no verifiqué (no pude abrir sergiourcullo.vercel.app desde esta sesión).
7. **R01 sin mirar:** gitdiagram.com está bloqueado desde esta sesión; nadie vio el diagrama generado. Probarlo antes de grabar o bajar la pieza.
8. **Mezcla oficial/comunidad:** G02, G03 y G04 son **oficiales** (Anthropic, NVIDIA); el resto de G y todas las R son de comunidad o empresas chicas. Para que se mezclen menos: no poner dos oficiales el mismo día; alternar G oficial con R.
9. **Licencias:** VoiceStudio AGPL-3.0 y context-mode Elastic 2.0 ya se dicen en G06/G11; awesome-seedance es CC BY 4.0 en contenido (drop 5 corregido).

### Noticias descartadas y por qué
| Novedad | Motivo |
|---|---|
| OpenAI DevDay 2026 (29-sep): dots, GPT-6.1 Sol, Ultrafast, Space, plan Pro USD 500 | Fuentes primarias (openai.com, developers.openai.com, community.openai.com) **bloqueadas** en esta sesión. Solo confirmé en el SDK oficial (github.com/openai/openai-python v3.21.0, 29-sep) que existe el identificador «GPT-6.1 Sol»: no alcanza para precio ni funciones. Lo de prensa (Axios, CNBC, BGR, 9to5Mac) no entra. **Revisar desde otra sesión: puede ser la noticia más fuerte de la quincena.** |
| Sonnet 5.5 como lanzamiento | Ya cubierto (D01-B/C). N01 y N02 toman sus cambios de API, que no están cubiertos. |
| Pensamiento de Sonnet 5.5 atado a la cuenta (28-sep) | Nicho de desarrollador; no cambia nada para quien usa Claude o n8n. |
| Cache diagnostics fuera de beta (23-sep) y cobro de rechazos (24-sep) en la plataforma de Claude | Nicho de API. La idea de caché va en N05 con un caso concreto. |
| Portal para enviar plugins al directorio de Claude (25-sep) | Nicho desarrollador (ya descartado en el radar). |
| Claude Code `claude --desktop`, `CLAUDE_CODE_DISABLE_WEB_FETCH`, `maxProseWidth`, `"attribution": false` (23 al 29-sep) | Útiles pero chicos: no llenan un vertical con demostración. Candidatos para un «cinco cambios de Claude Code» si hace falta relleno de calidad. |
| n8n 2.41 (22-sep): herramienta del asistente que corre un solo nodo | Pensado para el AI Assistant de n8n Cloud; la audiencia self-hosted no lo ve igual. |
| Higgsfield Production Skills Bundle (23-sep): 11 flujos para Blender, Adobe, TouchDesigner, DaVinci Resolve Studio | Requiere apps pagas que la audiencia no tiene; demo cara. |
| Higgsfield: recarga de créditos (29-sep) y cashback de la API (24-sep) | Vencen el 30-sep 23:59 UTC: ya no son noticia el 1-oct. |
| Higgsfield: Seedream 5.0 Flash, GPT Image 2.5, GPT-6 Sol/Luna, Grok 4.7, Opus/Sonnet 5.5 | Cubiertos en el radar/S3 o sin fuente primaria del fabricante leída. |
| Gemini API (changelog de Google) y novedades de Meta/WhatsApp de la ventana | ai.google.dev, blog.google y developers.facebook.com **bloqueados**. La búsqueda en la doc de Meta (herramienta oficial) no devolvió entradas de septiembre. |
| ElevenLabs v4 desde el blog de ElevenLabs | elevenlabs.io bloqueado; N07 usa el changelog de Higgsfield como fuente. |
| Posts de anthropic.com/news (enzima, Accenture, Life Sciences, Ebola) | Ciencia y empresa grande; no sirven a esta audiencia. |

### Orden sugerido en el calendario (1 al 14-oct)
- **Jue 1-oct:** N03 (modo auto) · **Vie 2-oct:** N02 (Sonnet 4.5 se retira) · **Sáb 3-oct:** N06 (Gemini CLI)
- **Lun 5-oct:** N04 (skill verify) · **Mié 7-oct:** N07 si se aprueba el gasto · **Vie 9-oct:** N01 (día después de D08-B)
- **7 al 14-oct:** N05 apenas n8n 2.42 sea estable
- **Repos G01–G10 y R01–R07:** sin fecha de vencimiento; G04 antes que G11 y que R05. Encajarlos en el slot B cuando no haya noticia, alternando un oficial (G02/G03/G04) con uno de comunidad. Recontar tendencia el día de grabar: si un R ya no está en trending, el guion sigue valiendo (no dice estrellas ni puesto).
