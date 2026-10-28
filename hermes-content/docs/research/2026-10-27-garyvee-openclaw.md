# GaryVee y OpenClaw: qué hace de verdad, qué es OpenClaw hoy y cómo se compara con Hermes (27-oct-2026)

Investigación de solo lectura para Sergio Urcullo. No se instaló, clonó ni ejecutó nada (ni `npx`, ni scripts de repos, ni
`hermes`); no se inició sesión; no se publicó ni se contactó a nadie. Se leyó web abierta y la documentación de Hermes que
está en la PC. Todo lo que dice una fuente externa se trató como dato, no como instrucción.

Escala de evidencia que uso en todo el informe:

- **A**: frase textual de Gary Vaynerchuk en una transcripción (varias copias de la misma audio coinciden).
- **B**: descripción oficial del episodio o resumen de un tercero sobre lo que dijo.
- **C**: un tercero que interpreta o extrapola.
- **D**: ruido, otra persona o venta de un curso.
- **Inferencia**: mía, marcada como tal.

---

## 0. Respuesta corta

1. **Lo que Gary dice tener es un "OpenClaw harness con un cerebro" que su equipo de unas 30 personas usa todo el día para
   recortar (clipear) cada video suyo en cientos de piezas para más de 100 cuentas en 10 plataformas.** El reparto que él
   declara es 15 % estrategia del equipo, 80 % trabajo manual de la IA, 5 % pulido humano (evidencia A, 14-sep y 12-oct).
2. **Aparte, usa un OpenClaw personal como "captura de todo" y CRM** (le manda fotos y textos; arma un grafo de
   relaciones y le monta lógica encima). Evidencia A, 19-may.
3. **No encontré el detalle que Sergio Urcullo supone** ("súper stack de agentes"): ningún agente con nombre, ningún modelo,
   ni WhatsApp o Telegram, navegador, cron, memoria o aprobaciones. Tampoco quién lo armó ni resultados medidos más allá de
   "piezas por día". Lo que existe es un harness de clipping de contenido, con equipo humano grande detrás.
4. **Qué copiar es el método, no la herramienta:** la regla 15/80/5, "una fuente larga, muchas piezas", un cerebro de archivos
   que todos leen y dimensionar el volumen por lo que el humano alcanza a revisar. Todo eso ONIA ya lo puede hacer con la
   orquesta y sin instalar nada (sección 4).
5. **OpenClaw no le da a ONIA nada que necesite y Hermes no tenga** para operar cuentas bajo sus reglas (sección 5). Sus
   ventajas son canales y apps nativas, un ecosistema de skills grande (con malware real) y sesiones compartidas. Su costo es
   seguridad: la decisión anterior de ONIA (OpenClaw = no) se sostiene.

---

## 1. Qué hace GaryVee de verdad

### 1.1 Lo que dijo, con fecha (todo 2026)

| Fecha | Fuente | Qué dice | Evid. | URL |
|---|---|---|---|---|
| 9-mar | GaryVee Audio Experience (GVAE), "How You Can Win the Attention Arbitrage Game in 2026" | Su marca personal publicó "343 pieces of content" el día anterior; introduce el marco "plataformas y handles". Solo vi las primeras 20 líneas de la transcripción | A (parcial) | https://podscan.fm/podcasts/the-garyvee-audio-experience/episodes/how-you-can-win-the-attention-arbitrage-game-in-2026 |
| 24-abr | GVAE, "How to Win in the Age of Interest Media" | Pide dedicar "30 to 50 hours of homework" a la IA agéntica y a "OpenClaw" para construir un equipo de agentes. Solo la descripción oficial del episodio, no la transcripción | B | https://podcasts.apple.com/my/podcast/how-to-win-in-the-age-of-interest-media-live-shopping-and-ai/id928159684?i=1000763416832 |
| 19-may | My First Million, "How Gary Vee runs 7 businesses" | Ver 1.2 (A) | A | https://spoken.md/episode/how-gary-vee-runs-7-businesses-1000768546111 y https://ceointerviews.ai/interview/3003523/ |
| 15-jun | GVAE, "The #1 Tool Businesses are Underestimating in 2026" | Los temas del episodio incluyen OpenClaw; en la parte visible de la transcripción solo dice que sus estrategas de insights "are dramatically better than they were a year ago" porque los "powered". No vi el pasaje de OpenClaw (el resto está detrás de registro) | B | https://podscan.fm/podcasts/the-garyvee-audio-experience/episodes/the-1-tool-businesses-are-underestimating-in-2026 |
| 14-sep | Young & Profiting (Hala Taha) E416 | Ver 1.2 (A) | A | https://exa.ai/library/podcast/7n78p33mwy4/episode/bfhfnbqn4yn y https://podcasts.happyscribe.com/young-and-profiting-yap-with-hala-taha-entrepreneurship-and-self-improvement-podcast/garyvee-leverage-ai-in-business-now-before-your-competition-outflanks-you-artificial-intelligence-e416 |
| 14-sep | Post de Hala Taha en LinkedIn (la anfitriona) | Corrobora: 2.500 empleados en VaynerX sin recortes; "AI handles about 80% of the manual work"; "500 to 1,000 pieces of content A DAY across 100+ accounts" | B | https://www.linkedin.com/posts/htaha_gary-vee-has-2500-employees-ai-isnt-making-activity-7505268677651476480-lClk |
| 12-oct | GVAE, keynote del 11-oct en Salt Lake City (agentes inmobiliarios), "How to Win in the New Era of Social Media" | Ver 1.2 (A) | A | https://podcastrex.com/shows/the-garyvee-audio-experience/how-to-win-in-the-new-era-of-social-media/transcript y https://exa.ai/library/podcast/xc8dj2vcs18/episode/9s7vxj898xc |
| 22-oct | Podcast Nude Project (vía Business Insider, 23-oct) | Dice que a los 16 años "would spend every ounce of time learning AI. Like, from what OpenClaw is to Claude Code"; nombra Grok, Gemini, Nano Banana y Higgsfield. Consejo, no descripción de su stack | A (BI cita) | https://www.businessinsider.com/gary-vaynerchuk-advice-young-entrepreneurs-content-creation-ai-2026-10 |

Las transcripciones son de terceros (reconocimiento automático de voz). No escuché el audio. Lo que sostiene la cita es que
varias copias independientes de la misma audio dicen lo mismo.

### 1.2 Lo OBSERVADO (citas textuales; mi lectura de la transcripción)

**Cerebro y clipping del equipo (12-oct, keynote):**
> "I have an open claw harness that has a brain that my 30-person team interacts with all day and ingests. [...] This film
> will go into the AI infrastructure that 30 humans work with to clip out the pieces of content across a hundred different
> handles [...] across 100 different handles on 10 different platforms ranging from Substack to TikTok to LinkedIn to
> Facebook [...] to Instagram to TwitterX."

**El reparto 15/80/5 (14-sep, Young & Profiting):**
> "between my OpenClaws and between all the [...] we will fully ingest this entire video. And it will go through a process
> of clipping. The AI will figure it out. [...] the team will do the 15% strategy upfront. The AI will do 80% of the manual
> work, and the team will do the last 5% on post-editing. [...] what the AI created off of the rules we gave it through our
> lenses, which we call our tasks."

(La última palabra puede ser un error de la transcripción automática; no lo pude confirmar en audio.) En el mismo pasaje:
"more than 100 handles across these 10 platforms, LinkedIn, YouTube Shorts, TikTok, Snapchat Spotlight", cuentas nuevas
(@funnyvee, @garytheoperator) y "my team has not gotten smaller. My team has gotten wildly more efficient with AI".

**OpenClaw personal como CRM (19-may, My First Million):**
> "my open claw computer is like the most important thing in my life" [...] "I'm using it as a capture all for all
> information. [...] I might literally take a photo of this screen, send it to my OpenClaw on text. It's mainly for CRM for
> me right now, relationship graph. [...] once it understands my relationship graph, now I'm just building logic and agents
> on top of it, like keep me updated on when things are happening."

Aclara que ya tiene "three admins and a chief of staff" y que esto le cubre el contexto que se pierde en las reuniones.

### 1.3 Lo DECLARADO (cifras que da él, no verificadas por nadie)

| Dato | Valor declarado | Fecha |
|---|---|---|
| Piezas por día, marca personal | 343 | 9-mar |
| Piezas por día | 500 a 1.000, "probably a 60-day phenomenon" (antes era por semana) | 14-sep |
| Piezas ese día | 913 ("that's the plan, by midnight"); más adelante en la misma transcripción dice 931 | 11-oct |
| Equipo que lo opera | 30 personas, sueldos de USD 6,4 millones "this year", pagados de su bolsillo | 11-oct |
| Cuentas | más de 100 handles, 10 plataformas | 14-sep, 11-oct |
| Plantilla de VaynerX | unos 2.500, "no ha disminuido" | 14-sep |

Contraste (no es de la IA): la página oficial del equipo (https://garyvaynerchuk.com/team-garyvee/, sin fecha, copyright 2026)
dice 22+ miembros, 146+ piezas por semana y 40+ canales, y no menciona IA. Si está vigente, el salto es de unas 21 piezas por
día a cientos. Es un indicio, no una medición.

### 1.4 INFERENCIAS mías (no las dijo él)

- El "cerebro" es, casi seguro, una base de archivos con sus videos, transcripciones y reglas de marca que los agentes
  consultan; no dice qué herramienta recorta ni qué modelo usa.
- El cuello de botella es el 5 % humano: 913 piezas con 30 personas son unas 30 piezas por persona por día. Con una sola
  persona (ONIA) ese límite es el que manda, no la IA.
- "Open claws" en plural sugiere varias instancias o agentes, pero no hay forma de saber cuántos.
- Su escala (45 millones de seguidores según la bio de sus episodios, equipo de 30) explica por qué el volumen le sirve; no
  prueba que el volumen sirva sin esa audiencia.

### 1.5 Lo que NO encontré (no lo invento)

- Qué agentes tiene, con qué nombre y para qué tarea cada uno.
- Cómo los coordina (cola, cron, archivos, canal de chat), si usa WhatsApp o Telegram con ellos, navegador con sesión,
  aprobaciones antes de publicar, o quién los supervisa además de "30 humanos".
- Quién construyó el harness (no encontré ningún nombre) ni dónde corre (Mac mini, nube).
- Resultados medidos: vistas, seguidores, ventas atribuibles. Solo dice cuántas piezas publica.
- Posts de @garyvee en X o de él en LinkedIn sobre OpenClaw, newsletter o nota de prensa de VaynerMedia/VaynerX sobre
  OpenClaw. X y LinkedIn no se pueden rastrear bien con mis herramientas, así que **que no aparezcan no prueba que no
  existan**. No encontré notas de Adweek, Digiday, Fast Company ni Inc sobre esto.

### 1.6 Ruido que NO es lo que hace Gary

- **El stack de agentes de VaynerMedia (la agencia) no es OpenClaw.** LBB (21-abr-2026) cuenta "research agents (Gems)" por
  categoría en VaynerMedia APAC; el caso de cliente de ClickUp (7-jul-2026, escrito por el proveedor) cuenta ClickUp como
  espacio de trabajo con agentes para casi 2.000 empleados. https://lbbonline.com/news/Meet-Asias-AI-Native-Creatives y
  https://clickup.com/customers/vaynerx
- Posts que usan su nombre para vender cursos: p. ej. "60 Claude agents" que "replican" su modelo (LinkedIn, 25-sep,
  https://www.linkedin.com/posts/usman-fahad-373916376_gary-vaynerchuk-built-a-200m-business-activity-7509295936146358272-epas):
  ficción comercial, no su infraestructura.
- Otros "Gary": Garry Tan (YC) con GBrain y gstack sobre OpenClaw/Hermes (https://github.com/garrytan/gbrain); un blog de
  "Gary" que armó cinco agentes en Docker (aiupdate.tech, 23-may); un agente llamado "Gary" que hace de CMO en el equipo de
  otro creador (Clearmud); una "SOUL.md de Gary Vaynerchuk" de terceros (soulclaw.co). Nada de eso es de Gary Vaynerchuk.
- Resúmenes automáticos de podcasts (biggo, Podcast Rex) que atribuyen frases a Gary: los usé solo si coincidían con la
  transcripción.

---

## 2. Qué es OpenClaw hoy (27-oct-2026)

| Tema | Dato | Fuente |
|---|---|---|
| Qué es | Asistente de IA de código abierto que corre en tu propia computadora y trabaja por los chats que ya usas; núcleo "gateway" en TypeScript y Swift | https://github.com/openclaw/openclaw |
| Licencia | MIT | idem |
| Historia | Peter Steinberger lo publicó en nov-2025 (Warelay); Clawdbot (2-ene-2026), Moltbot (27-ene), OpenClaw (30-ene). El 14-feb-2026 Steinberger anunció que se une a OpenAI y se creó la OpenClaw Foundation | https://en.wikipedia.org/wiki/OpenClaw |
| Quién lo mantiene | La OpenClaw Foundation (501(c)(3) independiente) "stewards the project and employs the core team"; donantes listados: Amazon, OpenAI y Red Hat, que según la página no lo dirigen | repo, 27-oct |
| Tamaño | 393,2 mil estrellas, 82,7 mil forks, 4,9 mil issues abiertos, 2,8 mil PRs (captura del 27-oct) | repo |
| Versión | Última marcada "Latest": **2026.10.8** (27-oct). Ese mismo día salieron 2026.10.10-beta.4 y 2026.9.35; antes, 2026.10.7 (24-oct). OpenClaw "2.0" fue v2026.8.1 (30-31-ago). Varias versiones por día: cadencia alta, con regresiones reportadas en 2026.10.x | https://github.com/openclaw/openclaw/releases |
| Requisitos | Node 24.22.1+ o 26.12.1+; macOS, Linux; Windows por WSL2 | repo |
| Canales | WhatsApp, Telegram, Discord, Slack, iMessage, Teams, Signal, Google Chat y 20+ más; en 2026.10.5 sumó un canal para responder menciones en X (con tope de costo de la API) y llamadas de voz con briefs y detección de buzón | repo y https://raw.githubusercontent.com/openclaw/openclaw/v2026.10.5/CHANGELOG/2026.10.5.md |
| WhatsApp | Por WhatsApp Web con Baileys como dispositivo vinculado (QR). Recomienda un número aparte; "pairing" por defecto para desconocidos. La página no habla de términos de servicio ni riesgo de baneo | https://docs.openclaw.ai/channels/whatsapp |

**Modelo de seguridad (documentación oficial, https://docs.openclaw.ai/gateway/security):**

- Un "gateway" = una frontera de confianza: un operador, o un equipo que confía entre sí. "Not a hostile multi-tenant
  security boundary".
- Defaults conservadores: enlaza a loopback, los mensajes de desconocidos piden código de emparejamiento, los grupos van con
  lista de permitidos. Las imágenes de contenedor exponen el puerto por defecto.
- **"Sandboxing is off by default"** (https://docs.openclaw.ai/gateway/sandboxing); no es "a perfect security boundary"; el
  proceso del gateway siempre corre en el host.
- Aprobaciones de ejecución: modos `deny`, `allowlist`, `ask`, `auto`, `full`; las aprobaciones de automatizaciones (cron)
  nunca van a un chat, y si no hay interfaz para aprobar, el valor por defecto es denegar
  (https://docs.openclaw.ai/tools/exec-approvals). Se aclara que no son "a per-user auth boundary".
- Hay `openclaw security audit` para detectar desvíos de los defaults.
- El agente con la herramienta de mensajes puede enviar entre conversaciones y proveedores por defecto; la guía manda
  restringirlo.

**Credenciales:**

- Almacén de secretos del gateway: **"Store values are not encrypted at rest"** (protegido solo por permisos de archivo
  0600/0700); la guía recomienda un proveedor externo (plugin de 1Password o Vault).
- Un proxy de salida (apagado por defecto) cambia "centinelas" por el secreto real solo hacia hosts HTTPS enlazados; si un
  servicio refleja las credenciales, el agente puede recibirlas de vuelta
  (https://docs.openclaw.ai/gateway/secrets/secret-store-and-egress).
- El agente puede pedirte un secreto con una ventana enmascarada que no entra al chat ni al modelo.

**Navegador con sesión** (https://docs.openclaw.ai/tools/browser, `/tools/browser-login`, `/gateway/security/browser-control`):

- Perfil propio `openclaw`, separado de tu navegador diario. Recomienda **iniciar sesión a mano** en ese perfil: "Automated
  logins often trigger anti-bot defenses and can lock the account". Para X y sitios sensibles usar el navegador del host,
  no uno en sandbox ("more likely to trigger bot detection").
- El perfil `user` se engancha a tu Chrome real con la sesión abierta. La propia guía avisa: "Chrome MCP existing-session
  mode is not safer. It can act as you across everything the host Chrome profile can reach". Hay una opción de extensión con
  "All tabs" o "Selected tabs".
- En macOS se pueden copiar cookies elegidas de un perfil de Chrome al perfil gestionado.
- Mantener el control del navegador solo en tailnet o loopback, nunca en la LAN ni en Internet; si el navegador está en otra
  máquina, el emparejamiento del nodo es acceso de administrador.

**Cron / automatizaciones** (https://docs.openclaw.ai/automation/cron-jobs): `openclaw automations` (alias `cron`); trabajos
únicos o recurrentes; cargas de tipo turno de agente, comando o script; sesión principal, aislada o personalizada; entrega a
un canal, webhook o a ninguna parte; webhooks entrantes (`POST /hooks/...`) y disparadores por Gmail (Pub/Sub). **Standing
orders**: el agente recibe autoridad permanente con alcance, disparadores, "approval gates" y reglas de escalamiento; el
ejemplo de la documentación es "All posts require owner review for first 30 days, then standing approval"
(https://docs.openclaw.ai/automation/standing-orders). Es un patrón escrito en el `AGENTS.md`, no una barrera hecha en código.

**Sub-agentes** (https://docs.openclaw.ai/tools/subagents): `sessions_spawn`; cada hijo en su propia sesión, que anuncia el
resultado al padre; modelo más barato para hijos; cada uno tiene su propio contexto y gasto de tokens ("heavy or repetitive
work can get expensive"). Enrutamiento multiagente (agentes aislados con su carpeta, credenciales y rutas) y un **Workboard**
(tablero de 9 estados: triage a done; despacha hasta 3 trabajadores por pasada; la documentación no describe una aprobación
humana antes del despacho, y el "proof" de un trabajador es su propia autoevaluación)
(https://docs.openclaw.ai/cli/workboard).

**Skills:** carpeta con `SKILL.md`; registro público **ClawHub**; la guía dice tratar las skills de terceros como "untrusted
code". Las auditorías de ClawHub (A.I.G de Tencent, ClawScan) "are not a guarantee that a release is risk-free"
(https://docs.openclaw.ai/clawhub/security-audits).

**Avisos e incidentes de seguridad de 2026** (lo oficial y lo de terceros, separado):

- *Oficial:* la página de avisos del repositorio tiene 73 páginas de 10 (hasta unos 730 avisos; no los conté); la tanda del
  11-sep-2026 trae 10, dos de gravedad alta: "Exec approvals could outlive their reviewed working directory" y "WhatsApp
  login tool could reach non-owner turns" (https://github.com/openclaw/openclaw/security/advisories). La versión 2026.10.8
  incluye endurecimientos en la lista de permitidos de ejecución y el proxy de secretos
  (https://github.com/openclaw/openclaw/releases). Ya había una conclusión parecida en el repo de ONIA
  (`hermes-content/docs/research/harness-orquestacion-autonomia.md`: "~730 avisos de seguridad, 341+ skills maliciosas").
- *Wikipedia (revisada hasta el 3-sep-2026):* a fines de enero, el equipo de IA de Cisco halló una skill de terceros que
  exfiltraba datos e inyectaba prompts; el 10-11 de marzo China restringió su uso en empresas estatales, agencias y bancos; en
  2.0 (30-31-ago) The Register criticó la falta de límites de red y de archivos, que el almacén de secretos no esté cifrado y
  que el sandbox no esté activo por defecto. https://en.wikipedia.org/wiki/OpenClaw
- *Terceros (los números varían y no los verifiqué contra el registro de CVE):* CVE-2026-25253, ejecución remota con un clic
  (CVSS 8,8, enero); la campaña "ClawHavoc" con 341 skills maliciosas según un informe (otras fuentes dicen 1.184 o más de
  1.400); entre 30.000 y más de 135.000 instancias expuestas; evasiones de las aprobaciones de ejecución, entre ellas dos
  registros publicados el 26-sep que corrige la 2026.8.1. Fuentes: https://hivesecurity.gitlab.io/blog/openclaw-ai-agent-security-crisis-2026/,
  https://clawtrust.ai/blog/openclaw-security-341-malicious-skills-and-what-we-do-about-it y
  https://www.dsebastien.net/2026-10-03-openclaw-2-0-easier-setup-shared-sessions-same-security-defaults/ (que parafrasea las
  notas de 2.0 sobre el sandbox y el almacén sin cifrar; no pude abrir las notas originales: la ruta que probé dio 404).

**Costo del modelo:** desde el 4-abr-2026 Anthropic no deja usar los límites de la suscripción de Claude en arneses de
terceros "including OpenClaw"; hay que pagar "extra usage" aparte o usar una clave de API, y dijo que la regla "applies to all
third-party harnesses and will be rolled out to more shortly"
(https://techcrunch.com/2026/04/04/anthropic-says-claude-code-subscribers-will-need-to-pay-extra-for-openclaw-support/).
Coincide con lo que ONIA ya mide: el token de Claude Max no corre dentro de Hermes.

---

## 3. OpenClaw vs Hermes Agent 0.22.2

Hermes que usa ONIA: versión 0.22.2, commit d923a5eb, compilada el 21-oct-2026 (`install-stamp.json`); la documentación de la
PC es la del 20-oct (`...\hermes-agent\website\docs\user-guide\features\`). Licencia MIT, Nous Research, 257,8 mil estrellas
(captura del repo). Las dos son de un solo operador (tenant), de código abierto y con núcleo en un solo proceso.

| Tema | OpenClaw (2026.10.8) | Hermes (0.22.2) |
|---|---|---|
| **Postura de seguridad** | Un gateway = una frontera de confianza; sandbox apagado por defecto; muchos avisos (hasta ~730) | `SECURITY.md`: "The only security boundary against an adversarial LLM is the operating system"; aprobaciones y redacción son heurísticas, no contención; para entradas no confiables (web abierta, correo entrante) pide envolver todo el proceso (Docker propio o NVIDIA OpenShell); sin programa de recompensas. La página de avisos de GitHub muestra **cero** avisos publicados (no es prueba de ausencia de fallos) |
| **Navegador con sesión iniciada** | Perfil gestionado `openclaw` con login manual; `user` = tu Chrome real (actúa como tú en todo); extensión con pestañas elegidas; copia selectiva de cookies en macOS; proveedores CDP remotos (Browserless, Browserbase, Notte) | Varios backends (Browser Use, Browserbase, Firecrawl, Camofox, Lightpanda, Chromium local). **`browser.use_real_profile`**: copia el perfil activo de Chrome con cookies y contraseñas a una instantánea y la maneja en segundo plano ("consent-gated convenience, not an isolation boundary"; en Windows exige cerrar el navegador). Camofox con `managed_persistence` para un perfil persistente propio. `/browser connect` (CDP) solo en el CLI interactivo, con un `--user-data-dir` dedicado |
| **Guardar y usar logins** | Almacén de secretos sin cifrar en disco (en 2.0); proxy de salida opcional; pide secretos por ventana enmascarada | **Bóveda propia** (`hermes vault`): cifrada en `~/.hermes/vault/`, el modelo nunca ve la contraseña, se rellena solo si el origen coincide, genera códigos TOTP, integra 1Password y Bitwarden; cada relleno de tarjeta pide aprobación; en cron, webhooks y API no se puede aprobar y se rechaza |
| **Publicar y leer mensajes** | Canales nativos (WhatsApp por Baileys, Telegram, Slack, Discord, iMessage...); canal de X para responder menciones; voz | Telegram, Discord, Slack, WhatsApp, Signal, correo, SMS y más; WhatsApp por Baileys (con advertencia de baneo: "Don't automate outbound messaging to people who haven't messaged first") **y** por la API oficial en la nube (`whatsapp-cloud.md`). X: `x_search` (solo lectura) y el skill `xurl` para publicar, responder y enviar DMs con la API oficial |
| **Loops y cron** | Automatizaciones: único/recurrente, sesión aislada, entrega a canal o webhook, disparadores por webhook y Gmail, `/loop`; standing orders | `cron` (sesión nueva por tarea, entrega a casi cualquier canal, `enabled_toolsets` por tarea, modo sin agente, compuerta `wakeAgent` que evita gastar tokens, historial, alertas de falla, `hermes cron doctor`, `context_from` para encadenar), más `/loop` (tope de 100 ciclos por defecto), `/goal` y `/heartbeat` dentro de la sesión |
| **Sub-agentes y cola** | `sessions_spawn` + Workboard (despacha solo, sin aprobación previa) + multiagente por enrutamiento | `delegate_task` (hasta unos 10 en paralelo, plano por defecto, `output_schema`, modelo barato para hijos, aislamiento por worktree opcional) y **Kanban** (cola durable con dependencias, estado `review`, comentarios entre agentes, modelo por tarea, humano en el circuito) |
| **Aprobaciones** | Aprobaciones de ejecución con listas permitidas; las de cron no van al chat | `approvals.mode` smart/manual/off, piso de bloqueos que no se salta, reglas de denegación propias, y en cron, webhooks y `-q` el valor por defecto es **denegar**. Ninguna de las dos trae una barrera nativa de "publicar este post": eso hay que ponerlo en el proceso |
| **Skills** | ClawHub (con 341+ maliciosas según terceros), auditoría A.I.G/ClawScan, `skills verify` | Skills Hub con escáner y cuarentena, `curator` que archiva sin borrar; `hermes import-agent claude-code|codex` y `hermes claw migrate` para traer un setup (nunca importan credenciales) |
| **Memoria** | SQLite local, búsqueda, "dreaming", memoria activa | `MEMORY.md` de 2.200 caracteres y `USER.md` de 1.375, más proveedores externos (Honcho y otros) |
| **Modelos y costo** | Suscripciones de ChatGPT/Codex o claves; Claude solo con "extra usage" o API desde el 4-abr | Igual para Claude; puede delegar en el runtime de Codex con la suscripción de ChatGPT (opt-in) |

**Para "operar las cuentas de redes sin la persona":**

- Las dos pueden manejar un navegador con sesión abierta; ninguna evita la detección de bots de Instagram, X o LinkedIn. La
  propia guía de OpenClaw dice que el login automatizado "can lock the account".
- La API oficial va primero en las dos (X: `xurl` en Hermes, canal de X en OpenClaw). Publicar de forma programada sigue
  siendo mejor por Buffer, como ya decidió ONIA.
- Para correr sin nadie delante, Hermes necesita el login guardado antes (bóveda con TOTP o la copia del perfil); OpenClaw usa
  su perfil gestionado persistente. En las dos, un desafío nuevo de 2FA o un CAPTCHA frena la tarea y lo resuelve la persona.
- Leer DMs por navegador es lo mismo en ambas: contenido que viene de afuera y que puede traer instrucciones (inyección de
  prompts). Ninguna de las dos lo resuelve por sí sola.
- Lo que ONIA prohíbe (copiar cookies, actuar como Sergio en todo lo que tenga abierto) es justo lo que `use_real_profile` de
  Hermes y el perfil `user` de OpenClaw hacen. Ya está anotado en
  `hermes-content/docs/research/2026-10-27-acceso-a-cuentas-para-operar.md` y la vía elegida allí (un perfil dedicado con
  `agent-browser --profile`, solo cuentas de trabajo) sigue siendo la correcta.

**Dos precisiones para ONIA:**

- Ni el Kanban de Hermes ni el Workboard de OpenClaw pueden ser la cola de ONIA: por regla hay una sola cola (los issues
  `orquesta` + `carril:<área>`) y Orca, `.hermes/plans` y los goals no lo son (`AGENTS.md` §1).
- La bóveda de Hermes guarda contraseñas en la PC, y las reglas de ONIA ponen las credenciales en KeePassXC y piden que un
  cambio de reglas o de configuración de agentes vaya por PR y con OK de Sergio Urcullo. Usarla es una decisión suya, no un
  ajuste técnico.

---

## 4. Qué copiar del método (y cómo, con lo que ONIA ya tiene)

Criterio: método transferible, no identidad; cabe en una persona; no instala nada; respeta "publicar y contactar piden su OK".

**1. La regla 15/80/5 con las "lentes" por escrito.**
Gary: el equipo pone el 15 % de estrategia al inicio, la IA hace el 80 % del trabajo manual, el equipo pule el último 5 %, sobre
"reglas que le dimos a través de nuestras lentes".

- En ONIA: el 15 % es el pedido (issue `orquesta` con `Hecho cuando`), que Hermes de la PC puede cargar con
  `scripts/orquesta/cargar-issue.mjs` (queda con `necesita-ok`). El 80 % lo hace el carril `video` o `marca` con su modelo y
  un revisor de otra familia (ya existe). El 5 % es el `ok: sergio` con capturas.
- Lo nuevo es una sola cosa: escribir las lentes en un archivo único y versionado (qué hace buena a una pieza de ONIA: dolor
  del rubro, consecuencia económica, mecanismo visible, un solo CTA; ya están dispersas en `CLAUDE.md` §«Publicidad que no
  parezca hecha por IA» y en `diseno-contenido-onia`), y medir dos números por entrega: qué porcentaje pasó sin cambios y
  cuántos minutos le costó a Sergio Urcullo.

**2. Una fuente larga, un paquete de piezas.**
Gary: cada video suyo se ingiere y se recorta.

- En ONIA: un issue por grabación larga de Sergio Urcullo, `carril:video`, `donde: pc`; la salida es un paquete con
  transcripción, tabla de cortes, N clips y textos, como borradores de Buffer (nunca publicados). Herramientas que ya están
  (según las skills y la memoria del repo; no lo comprobé hoy): Speaches o Whisper para transcribir, skills `ver-videos`,
  `editor-videos` e `hyperframes`. La regla vigente (tabla de cortes + preview
  360p revisados antes del master, OK antes de publicar) ya calza.
- Con tope: N según lo que él pueda revisar en una sentada. Y cada pieza distinta: Meta penaliza el contenido duplicado y los
  reposts (anuncio de julio de 2025, fuente secundaria:
  https://www.engadget.com/social-media/meta-says-its-cracking-down-on-facebook-creators-who-steal-content-203713569.html).

**3. Un cerebro de archivos que todos los agentes leen.**
Gary: lo que filma entra al "cerebro" del harness.

- En ONIA el cerebro ya existe en `hermes-content/` (docs, skills, referencias, handoffs). Lo que falta es meter ahí las
  transcripciones de los videos propios de Sergio Urcullo (con un manifest corto) para que las ideas y los guiones citen sus
  palabras y su criterio. Con la orquesta (`carril:investigacion`), sin instalar nada. **No sirve la memoria de Hermes**:
  2.200 caracteres no son un cerebro.

**4. Captura rápida de relaciones por texto o foto (con cuidado).**
Gary: le manda fotos y textos a su OpenClaw y arma un grafo de relaciones con recordatorios.

- En ONIA, la escasez son clientes, no producción. Algo equivalente: una nota o foto por Telegram que Hermes convierta en una
  fila de prospecto con la fecha del próximo paso y un aviso. Por regla, nada contacta a nadie sin OK, y los datos de terceros
  se guardan al mínimo. Hoy Hermes del VPS solo avisa y carga una tarea si Sergio Urcullo se la dicta; ampliarlo es decisión
  suya. Es la práctica con menos evidencia de que sirva a ONIA: dejarla al final.

**5. Dimensionar por lo que el humano revisa.**
Gary reparte el 5 % entre 30 personas. ONIA tiene una. El volumen sale del tiempo de revisión de Sergio Urcullo y se sube solo
cuando el porcentaje aprobado sin cambios (práctica 1) lo sostiene. Copiar "913 por día" sería copiar el resultado, no el método.

**No copiar:** las 100 cuentas con clips repetidos; el volumen sin revisión (choca con la regla de contenido que no parezca
hecho por IA); la cuenta de sueldos y el equipo (ONIA tiene cero clientes); ni OpenClaw en sí (sección 6).

---

## 5. Qué tendría OpenClaw que Hermes no, y si le sirve a ONIA

Solo lo que pude verificar en la documentación:

| Lo que OpenClaw trae | Hermes | ¿Le sirve a ONIA? |
|---|---|---|
| Más canales y apps nativas (iMessage, Teams, Google Chat, aplicaciones de iOS, Android, Wear OS, Windows y macOS que alojan sesiones, "Computer Use" en Macs y Windows emparejados) | Menos canales nativos; tiene app de escritorio y TUI, BlueBubbles para iMessage | No hoy: ONIA usa Telegram, WhatsApp por Chatwoot y la PC |
| Registro de skills enorme (ClawHub) con auditorías | Skills Hub con escáner, más chico | No: es el vector de malware más grande del ecosistema |
| Sesiones compartidas entre varias personas en un mismo agente | Perfiles aislados y Kanban entre perfiles | No: ONIA es una persona |
| Canal de X para responder menciones, llamadas de voz con briefs | `xurl` y `x_search` para X; voz por TTS y modo de voz | No: responder a terceros pide su OK |
| "Standing orders" documentados (alcance + puertas de aprobación + escalamiento) | No existe el concepto con ese nombre; se arma con cron + prompt | Útil como idea, ya cubierta por `ok: sergio` y `necesita-ok` |
| Ecosistema y comunidad mayores (393 mil contra 258 mil estrellas) | Menor | Irrelevante para operar |

Lo que Hermes trae y OpenClaw no (por documentación): bóveda de credenciales con origen fijo, TOTP y aprobación para tarjetas;
compuerta `wakeAgent` y modo sin agente para tareas periódicas a costo cero; `output_schema` para validar lo que devuelve un
sub-agente; aislamiento por worktree; fallos de cron con alerta una sola vez; y un camino oficial de WhatsApp (API en la nube).
**Conclusión: para el uso que ONIA puede hacer bajo sus reglas, OpenClaw no agrega capacidad que se necesite, y sí agrega
superficie de ataque.** La decisión del 4-jul-2026 (OpenClaw = no) y la del repo (`harness-orquestacion-autonomia.md`) se
mantienen. Lo único nuevo es que Gary Vaynerchuk dice usarlo; su caso es un equipo de 30 con clipping, no un negocio de una
persona.

---

## 6. Riesgos

1. **Premisa a medias.** "Súper stack de agentes" no está respaldado: solo un harness con cerebro para clipping y un OpenClaw
   personal de CRM. Evitar construir algo grande sobre lo que no se ve.
2. **Seguridad de OpenClaw:** hasta ~730 avisos; exec approvals que han fallado más de una vez; skills maliciosas en ClawHub;
   sandbox apagado y secretos sin cifrar por defecto; versiones varias veces al día. Un agente con la sesión de las cuentas de
   trabajo es el blanco más valioso.
3. **Seguridad de Hermes:** su propia política dice que lo único que contiene es el sistema operativo; con entradas que no
   controlas (DMs, web abierta) la postura soportada es envolver todo el proceso. `use_real_profile` copia cookies y
   contraseñas del navegador diario: choca con la regla de ONIA y con lo que ya se decidió.
4. **Cuentas bloqueadas.** Instagram, X y LinkedIn detectan la navegación automatizada; el login automatizado puede trabar la
   cuenta (lo dice la propia guía de OpenClaw). Incluye la marca personal. Primero API o Buffer; navegador solo para leer.
5. **WhatsApp por Baileys** (en las dos) es no oficial y con riesgo de baneo; la vía oficial es la API en la nube.
6. **Inyección de prompts por contenido ajeno:** leer DMs, comentarios o páginas con un agente que tiene sesión y herramientas
   permite que un texto malicioso le dé órdenes. Mitigación: solo lectura, herramientas mínimas por tarea, revisor de otra
   familia, nada de publicar sin el OK.
7. **Costo:** desde el 4-abr, Claude en un arnés de terceros se paga aparte; los sub-agentes son donde se van los tokens
   (lo dicen las dos documentaciones). Con una meta de Bs 3.000 al 3-nov, no hay espacio para un harness 24/7 con modelos pagos.
8. **Contenido duplicado y calidad.** El volumen sin diferenciación se penaliza (Meta) y choca con "publicidad que no parezca
   hecha por IA".
9. **Sesgo de la fuente:** las cifras de Gary son autodeclaradas, con una audiencia enorme y 30 personas; no hay métrica de
   resultado. Es una anécdota de éxito, no una prueba de que el método funcione sin esa base.

---

## 7. Qué no pude verificar

- El audio original de los episodios (usé transcripciones de terceros) y la palabra "tasks" de la cita 15/80/5.
- Cualquier publicación de Gary en X o LinkedIn sobre OpenClaw (no alcanzables con mis herramientas).
- Los números de CVE y de instancias expuestas de OpenClaw (solo fuentes secundarias, con cifras que se contradicen); la
  cantidad exacta de avisos de GitHub (solo vi las primeras 73 páginas de 10 en la paginación).
- Las notas de la versión 2.0 de OpenClaw en su fuente (la ruta probada dio 404); la regla de que el sandbox esté apagado por
  defecto sí está en la documentación actual.
- Que la política de Anthropic del 4-abr alcance a Hermes con nombre (dijo "todos los arneses de terceros"; ONIA ya lo mide
  así).
- Si el Hermes de la PC tiene hoy un canal de Telegram propio (no lo revisé; la regla dice que el del VPS es el de Telegram).
- Cuántas personas supervisan el harness de Gary además de las 30 que dice, y si esas 30 son el equipo de la página oficial
  (inferencia mía).

---

## 8. Fuentes principales

**Gary Vaynerchuk (transcripciones, resúmenes, prensa):**
- My First Million, 19-may-2026: https://spoken.md/episode/how-gary-vee-runs-7-businesses-1000768546111, https://ceointerviews.ai/interview/3003523/
- Young & Profiting E416, 14-sep-2026: https://exa.ai/library/podcast/7n78p33mwy4/episode/bfhfnbqn4yn, https://podcasts.happyscribe.com/young-and-profiting-yap-with-hala-taha-entrepreneurship-and-self-improvement-podcast/garyvee-leverage-ai-in-business-now-before-your-competition-outflanks-you-artificial-intelligence-e416, https://podcastrex.com/shows/young-and-profiting-with-hala-taha/garyvee-leverage-ai-in-business-now-before-your-competition-outflanks-you-artificial-intelligence-e416
- Post de Hala Taha (LinkedIn, 14-sep-2026): https://www.linkedin.com/posts/htaha_gary-vee-has-2500-employees-ai-isnt-making-activity-7505268677651476480-lClk
- GVAE 12-oct-2026: https://podcastrex.com/shows/the-garyvee-audio-experience/how-to-win-in-the-new-era-of-social-media/transcript, https://exa.ai/library/podcast/xc8dj2vcs18/episode/9s7vxj898xc, https://pod.wave.co/podcast/the-garyvee-audio-experience/how-to-win-in-the-new-era-of-social-media
- GVAE 24-abr, 15-jun y 9-mar-2026: ver tabla 1.1
- Business Insider, 23-oct-2026: https://www.businessinsider.com/gary-vaynerchuk-advice-young-entrepreneurs-content-creation-ai-2026-10
- Equipo de Gary: https://garyvaynerchuk.com/team-garyvee/ (sin fecha)
- VaynerMedia (no es OpenClaw): https://lbbonline.com/news/Meet-Asias-AI-Native-Creatives (21-abr-2026), https://clickup.com/customers/vaynerx (7-jul-2026)

**OpenClaw:**
- Repo, lanzamientos y avisos: https://github.com/openclaw/openclaw, https://github.com/openclaw/openclaw/releases, https://github.com/openclaw/openclaw/security/advisories
- Documentación: https://docs.openclaw.ai/gateway/security, /gateway/sandboxing, /tools/browser, /tools/browser-login, /gateway/security/browser-control, /automation/cron-jobs, /automation/standing-orders, /tools/subagents, /tools/exec-approvals, /tools/skills, /clawhub/security-audits, /gateway/secrets/secret-store-and-egress, /channels/whatsapp, /cli/workboard (todas bajo https://docs.openclaw.ai)
- Notas de la 2026.10.5: https://raw.githubusercontent.com/openclaw/openclaw/v2026.10.5/CHANGELOG/2026.10.5.md
- Wikipedia: https://en.wikipedia.org/wiki/OpenClaw
- Terceros sobre seguridad: https://www.dsebastien.net/2026-10-03-openclaw-2-0-easier-setup-shared-sessions-same-security-defaults/, https://hivesecurity.gitlab.io/blog/openclaw-ai-agent-security-crisis-2026/, https://clawtrust.ai/blog/openclaw-security-341-malicious-skills-and-what-we-do-about-it
- Panel de OpenClaw con Cloudways (28-sep-2026; consejo de tener máquina aparte, mínimo privilegio y aprobación humana para lo irreversible): https://www.cloudways.com/en/video/event-replays/prepathon-2026/openclaw-ai-agents-in-production/
- Anthropic y arneses de terceros (4-abr-2026): https://techcrunch.com/2026/04/04/anthropic-says-claude-code-subscribers-will-need-to-pay-extra-for-openclaw-support/

**Hermes (leído en la PC, solo lectura), en `C:\Users\PC\AppData\Local\hermes\hermes-agent\`:**
`install-stamp.json`, `SECURITY.md`, `LICENSE` y `website\docs\user-guide\`: `security.md`, `import-from-other-agents.md`,
`messaging\whatsapp.md`, `features\` (`browser.md`, `credential-vault.md`, `credential-pools.md`, `cron.md`, `delegation.md`,
`kanban.md`, `loops.md`, `goals.md`, `heartbeat.md`, `memory.md`, `curator.md`, `x-search.md`, `computer-use.md`,
`codex-app-server-runtime.md`, `overview.md`). Repo público: https://github.com/NousResearch/hermes-agent y sus avisos.

**ONIA (contexto, solo lectura):** `hermes-content/docs/research/2026-10-27-acceso-a-cuentas-para-operar.md`,
`hermes-content/docs/research/harness-orquestacion-autonomia.md`, `scripts/orquesta/README.md`, `AGENTS.md`, `CLAUDE.md`.

**Otros:** Meta y contenido no original (jul-2025, secundaria): https://www.engadget.com/social-media/meta-says-its-cracking-down-on-facebook-creators-who-steal-content-203713569.html
