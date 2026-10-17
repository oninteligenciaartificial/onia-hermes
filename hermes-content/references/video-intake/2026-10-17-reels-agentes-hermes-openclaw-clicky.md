# Reels de agentes: Hermes Agent, OpenClaw y Clicky (17-oct-2026)

Sergio Urcullo pregunta: «cómo hacemos para desarrollar con Hermes Agent, OpenClaw o Clicky». Es ficha de aprendizaje, no orden de construir. Nada se instaló, gastó ni creó.
**Clicky NO sale en ningún reel.** La tercera herramienta del reel 2 es MausBot. Posible confusión de nombre, sin verificar con él. Clicky se investigó igual (abajo).
**Ninguna sirve para desarrollar.** Sirven para operar (asistente, agente que aprende, tutor de pantalla). Desarrollar en ONIA sigue siendo Claude Code + PR + CI.
Cobertura: bajados con yt-dlp sin cookies. Video y audio completos con Gemini nativo, más 4 cuadros leídos con visión. Speaches del VPS no respondió (puerto 3108), sin transcripción literal.

## Reel 1 · @sebastiankra.ia (Sebastián Rivera) · 11-oct · 55 s
https://www.instagram.com/reel/DeXeLq-vPkG/ · 10,6 mil me gusta · 5,8 mil comentarios, casi todos «IA»
- Formato: pixel art animado, dos personajes. Gancho 0-3 s: «tu límite de Claude vacío el miércoles», medidor 97% a 0%.
- Promete: «Claude Code ya tiene mods» (piezas que cambian cómo funciona). Tres: 1) El portero: lo fácil va a un modelo barato y el límite dura más. 2) Claude habla con Claude: uno planifica y otro construye. 3) Panel propio: ver qué hace cada agente.
- Herramienta: solo Claude Code. No nombra Hermes, OpenClaw ni Clicky. Costo: no lo dice.
- Pasos: ninguno real. Dice «se lo describes a Claude y él te construye el mod». Sin comando, código ni pantalla real: es ilustración.
- Embudo: comentar «IA» para una biblioteca gratis (qué entregan: sin verificar). Que los mods existan: en esta sesión hay una skill `plugin-authoring` para eso, sin verificar en documentación oficial.

## Reel 2 · @buildwithomkar (Omkar Satpute) · 10-oct · 71 s
https://www.instagram.com/reel/DeUoo5qNMIW/ · 2,3 mil me gusta · 23 comentarios
- Es un anuncio de MausBot hecho por su creador (mausbot.com lo nombra maker). No es comparación neutral. Un comentario dice que el video parece hecho con IA.
- Promete «no compiten, son tres cosas». OpenClaw: servicio que vive en tus chats (WhatsApp, Telegram). Hermes: agente con app propia que aprende y escribe sus habilidades. MausBot: orquestador («Chief of Staff») que reparte trabajo a Claude Code, Codex, Grok, Hermes y OpenClaw y pide permiso en el celular.
- Pasos: solo OpenClaw (`curl` de una línea y `openclaw onboard`). Costo: MausBot «gratis y open source».
- Cifras en pantalla: OpenClaw 392 mil estrellas (GitHub hoy 392 mil, coincide), Hermes 252 mil (GitHub 254,6 mil), 85 mil skills en ClawHub (sin verificar). Cartel «FULL ACCESS por defecto» y, en letra chica, «aprobaciones y sandbox existen, apagados por defecto».

## Lo que ONIA ya sabía (contraste)
- Hermes Agent ya corre en el VPS (v0.21.0 el 18-sep): 12 trabajos por Telegram, gpt-5-nano/mini por LiteLLM, tope US$50 cada 30 días. No programa: prioriza y delega a `claude -p`.
- OpenClaw: veredicto SKIP desde el 4-jul-2026 (duplica a Hermes). Los reels no cambian eso.
- 16-oct: el harness de Codex se archivó. Regla: no construir orquestación nueva, apuntar lo que corre a cobrar y vender. MausBot sería orquestación nueva.
- «El portero» del reel 1 ya existe aquí: modelo por rol (Haiku, Sonnet, Opus) y Hermes en nano para lo mecánico. El «panel» ya lo rechazó Sergio (17-sep): todo por Telegram.

## Las herramientas
| Herramienta | Qué es y costo | Dónde corre | Qué le resolvería a ONIA | Riesgos |
|---|---|---|---|---|
| OpenClaw | Asistente en tus chats (WhatsApp, Telegram y 20+). MIT, Fundación OpenClaw. Gratis; pagás el modelo | Tu PC o un servidor (Node 24+), apps para Windows, Mac, Linux, iOS, Android | 24/7: sí en VPS, pero Hermes ya lo hace. Cuota Claude: no, desde 4-abr-2026 Anthropic no cubre Pro/Max en harness de terceros (extra usage o API). PC: sí, acceso total | Herramientas corren en el host salvo sandbox. Informes secundarios (sin verificar): CVE-2026-25253 (8,8), cientos de skills maliciosas en ClawHub, 21 a 42 mil instancias expuestas. Instalarlo como root en el VPS: no |
| Hermes Agent | Agente de Nous Research, MIT, v0.22.2 (15-oct): app de escritorio, cron, subagentes, skills que se escribe solo, aprobación de comandos. Gratis; pagás el modelo (nano US$0,05/0,40 por millón) | Local, Docker, SSH, Modal, Daytona. En ONIA ya está en el VPS | 24/7: sí, ya probado. Cuota Claude: sí con modelo barato; con suscripción Claude no (usa API de pago, informes de usuarios, sin verificar). PC: sin control de pantalla de serie | Corre como root en el VPS. Versiones rápidas: 0.22.1 salió con código sin liberar y la reemplazó 0.22.2. Trampas propias: reinicio, `drift_skip`, 9 días caído por 401. Nano inventa en resúmenes con juicio |
| Clicky | Tutor al lado del cursor: ve la pantalla con una tecla, habla y señala. Autor Farza. Repo MIT congelado (lo nuevo es privado desde 27-abr). Comercial heyclicky.com: gratis 25+25 mensajes, Pro US$20, Max US$100 al mes | Solo Mac 14.2+; Windows en lista de espera. El repo usa Claude, AssemblyAI y ElevenLabs por un Worker de Cloudflare. Comercial: no dice local o nube ni modelos (sin verificar) | 24/7: no (es a pedido). Cuota: no. PC: solo Mac, y la de Sergio es Windows: hoy no corre | Manda capturas de tu pantalla a terceros. Permisos de pantalla y accesibilidad. Versión nueva cerrada. Port Windows no oficial «Clacky» (sin verificar) |
| MausBot (del reel) | Equipo de bots en una app. Apache 2.0, Supamaus Software. App gratis; pagás al proveedor; Cloud de pago con 3 días de prueba con tarjeta | Local en Mac, Windows, Linux. Usa los CLI ya instalados (Claude Code, Codex). Los bots solo corren con la PC prendida | 24/7: solo con Cloud de pago. Cuota: no. PC: sí (Cua, Composio) | Proyecto joven y datos de su propio sitio. Su sitio dice que las aprobaciones varían y no están garantizadas. Conectar Gmail, Slack y GitHub agranda el daño |

## Riesgos de cualquier agente (ONIA)
- Instrucciones escondidas: un agente que lee web, correo o pantalla puede obedecer texto ajeno. El guardián del VPS es solo lectura por eso. Regla: lo que toca lo externo no lleva claves de escritura ni root.
- Anthropic: el guardián del VPS usa `claude -p` oficial con la cuenta de Sergio. Parece permitido, pero copiar credenciales al VPS es zona gris, sin verificar con Anthropic (detalle abajo).
- Mantenimiento: Sergio Urcullo no programa, cada herramienta nueva se cae en silencio (Hermes ya costó 9 días). Instalar algo exige nombre, origen y propósito con su aprobación.

## Hermes con la suscripción Claude Max y su panel (pregunta de Sergio Urcullo, 17-oct)
**a) Suscripción: se puede conectar, no ahorra y los términos dudan.**
- Cómo conecta (docs oficiales de Hermes, Providers): `ANTHROPIC_API_KEY`; leer credenciales de Claude Code; OAuth con `hermes model` (preferido); o `ANTHROPIC_TOKEN` con el token de `claude setup-token`.
- Costo real (esa misma doc): Max solo sirve con créditos de uso extra comprados, la cuota incluida de Max no se toca y «todo se factura como uso extra». Pro no puede. No libera cuota: gasta plata.
- Términos (code.claude.com/docs/en/legal-and-compliance): el OAuth de suscripción es para uso ordinario de Claude Code y apps propias de Anthropic. Quien arma productos usa API key y no puede enrutar con credenciales Free, Pro o Max. `claude setup-token` (docs de authentication) da un token de un año para CI y scripts que se le pasa a Claude Code (`CLAUDE_CODE_OAUTH_TOKEN`); no lo ofrece para otras herramientas. Que Sergio use su token propio en Hermes no se nombra: zona gris, sin verificar con Anthropic.
- Bloqueos: desde el 4-abr-2026 Anthropic dejó de cubrir Pro/Max en OpenClaw y otros harness de terceros (extra usage o API key). Solo fuentes secundarias (hongkiat, aibusiness), sin página oficial hallada. Cuentas bloqueadas por usar Hermes: no hallé casos, sin verificar. El parche no oficial `hermes-claude-auth` copia credenciales: no usarlo.
- Camino permitido y ya montado: Hermes con modelo barato delega el código a `claude -p` oficial. No pegar el token en Hermes.
**b) Panel: sí hay.** 1) Dashboard web oficial `hermes dashboard` (127.0.0.1:9119; pestañas Status, Chat, Config, API Keys, Sessions, Logs, Analytics, Cron, Skills, Channels). 2) TUI en terminal `hermes --tui`. 3) hermes-webui es comunitario, no sumar. En Windows nativo (PowerShell de una línea, sin admin) andan TUI y dashboard, pero la pestaña Chat pide WSL2 (docs). En la PC hay WSL2 con Ubuntu parado y una carpeta `hermes` de septiembre sin comando `hermes`: no hay instalación usable. Warp es solo la terminal (sirve para el túnel de abajo); el panel se ve en el navegador. Mejor el del VPS, que es Linux y tiene Chat completo: no instalar nada en la PC.
**c) El del VPS (leído hoy, solo lectura).** `hermes-gateway` activo; el proceso `hermes` escucha solo en 127.0.0.1:9119 y responde 200; ufw sin regla para 9119 (no expuesto). Código: `git describe` v2026.8.31-5411, sin comparar con 0.22.2. Desde la PC, sin abrir puertos, en PowerShell: `ssh -i $HOME\.ssh\onia_hermes_vps_ed25519 -N -L 9119:127.0.0.1:9119 root@187.77.16.63`, dejar esa ventana abierta y abrir http://localhost:9119 (Ctrl+C la cierra). La pestaña API Keys lee y escribe `.env`: mirar, no tocar. El 17-sep Sergio Urcullo decidió «sin panel, solo Telegram»; hoy lo pide él: se muestra el oficial, no se construye otro.

## Recomendación (una)
**No sumar OpenClaw, Clicky ni MausBot. Quedarse con Hermes Agent, ya instalado, como el «portero» barato del reel 1. Su suscripción de Claude no se conecta a Hermes: la usa solo `claude -p`. No actualizar a 0.22.x hasta que salga una versión estable después de 0.22.2.**
## Piloto mínimo (7 días)
- Tarea: aviso diario 08:05 La Paz por Telegram con los PR abiertos de onia-platform con CI en rojo o más de 24 h sin mergear (#113 gracia y #124 términos primero). Solo lectura: un script lista, nano da formato. No mergea ni escribe.
- Costo: menos de US$0,01 por día (estimación mía, unos 20 mil tokens a nano), dentro del tope de LiteLLM. Sin cuentas nuevas ni instalación.
- Se mide: 1) 7 de 7 avisos llegaron (`hermes cron doctor` sin issues, `last_error=None`); 2) gasto real en `LiteLLM_SpendLogs` menor a US$0,10 en la semana; 3) % semanal de cuota de Claude antes y después, si hoy una rutina de Claude hace ese aviso; 4) #113 y #124 salen de la lista porque se cerraron.
- Decisión: 6 de 7 y gasto bajo, se pasa la siguiente tarea mecánica; 2 fallos, se pausa (no se borra). Crear el job toca el VPS: lo hace la madre con el OK de Sergio Urcullo.
- Sin verificar: que Hermes tenga token de GitHub para listar PR (si no, el script va por n8n, que ya tiene `GITHUB_TOKEN`); qué rutina de Claude gasta cuota hoy en ese aviso.

Fuentes (10 páginas): mausbot.com, github.com/farzaa/clicky, github.com/NousResearch/hermes-agent y /releases, github.com/openclaw/openclaw, heyclicky.com, code.claude.com/docs/en/legal-and-compliance y /authentication, hermes-agent.nousresearch.com/docs (web-dashboard e integrations/providers). Búsquedas secundarias (sin verificar): seguridad de OpenClaw (clawdocs.org, bitdoze, insiderllm), cambio de Anthropic del 4-abr (hongkiat, aibusiness), issues de Hermes con Claude (NousResearch/hermes-agent #40014, #32243).
