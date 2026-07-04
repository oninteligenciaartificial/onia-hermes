# ONIA Tooling Assessment 2026-07-04

Fecha: 2026-07-04.
Owner: ONIA / Hermes.
Estado: evaluacion de 10 productos + live IA + inventario verificado contra
repos reales y auditoria en vivo del VPS (docker stats / free / df).
Gatillo: pedido de Sergio "investiga estos productos, mira nuestros repos y
self-hosted, dime que es OSS para no pagar, y sigue mejorando el sistema".

## Veredicto (TL;DR)

1. **OpenClaw es el gemelo OSS de Hermes.** Mismo patron (gateway + skills
   `SKILL.md` + `AGENTS.md`), MIT, multicanal (WhatsApp/Signal/iMessage/Telegram).
   Decision: **hibrido** - OpenClaw como capa de canales+gateway, Hermes (36
   skills de negocio) como cerebro, apuntando a la LiteLLM que ya corre en el VPS.
   Esto fusiona "upgrade de Hermes" + "alternativa a ManyChat" en un solo
   movimiento.
2. **Live IA 24/7 estilo TikTok Shop esta bloqueado para Bolivia** (TikTok Shop
   no opera aca). La tecnologia sirve; el canal con checkout no existe en el
   mercado local. Camino viable: avatar interactivo en Facebook/Instagram Live
   con checkout propio, o vender el servicio a clientes que exporten a MX/US.
3. **El VPS esta bajo presion de memoria** (swap 100% lleno). Antes de sumar
   servicios pesados (Postiz, Firecrawl) hay que consolidar o subir RAM.
4. **Varias cosas que "pagariamos" ya estan corriendo self-hosted**: Speakr+
   Speaches (= Fathom), Crawl4AI + SearXNG (= Tavily), Chatwoot, LiteLLM.

## Inventario verificado (2026-07-04)

### Repos (C:\dev\proyectos)

| Repo | Git | Rol |
|---|---|---|
| onia-hermes | GitHub | Monorepo madre (Hermes, onia-core, web-factory, video-factory) |
| onia-hermes-collab | GitHub | Colaboracion |
| Gestios / Ganaderos-Os | GitHub | SaaS verticales |
| Organizador-de-datos-de-empresas | GitHub | ProveeGest / data |
| WEB ONIA | GitHub | Sitio ONIA |
| dentalgest-video | git (sin remote) | Video DentalGest |
| DentaGest / Hermes / Nuvia Store | sin git top-level | DentaGest tiene git en dental-saas |

### Self-hosted VPS (187.77.16.63, Easypanel) - verificado con docker stats

Corriendo hoy: n8n, 2 stacks Supabase completos, Cal.com (1.08GB), Chatwoot
(app+db+redis+sidekiq), LiteLLM (961MB) + LiteLLM-db, Open WebUI, **Speakr
(1.17GB) + Speaches** (meeting intelligence = Fathom OSS, YA VIVO), **Crawl4AI**
(scraping, YA VIVO), SearXNG (busqueda, YA VIVO), Stirling-PDF, Uptime Kuma,
Traefik, onia-center.

Preparado pero NO arrancado: Firecrawl (`/opt/onia-selfhosted/firecrawl/src`,
.env presente). Dify (prepare-only). Listmonk/Mailpit (mail, prepare-only).

### Recursos VPS (free / df)

- RAM total 15Gi, usados 9.0Gi, disponible 6.6Gi.
- **Swap 4.0Gi / 4.0Gi = 100% usado.** Senal de presion de memoria sostenida.
- Disco / : 87G de 193G (45%). Disco OK.

Implicacion: hay margen para servicios livianos, pero sumar Postiz (~1-1.5GB) o
Firecrawl (workers Playwright 1-2GB) sin liberar RAM arriesga OOM/instabilidad.

### Pagos / cloud

Higgsfield (video), Tavily (busqueda), fal.ai, OpenAI/OpenRouter, Supabase cloud
(DentalGest/GestiOS ~US$25/mes c/u), Vercel, Meta (WhatsApp/IG). Free tiers:
Upstash, Sentry, PostHog, Resend.

## Los 10 productos - veredicto

| Producto | Que es | Fit | Alternativa OSS | Veredicto / prioridad |
|---|---|---|---|---|
| OpenClaw | Gateway OSS self-host: mensajeria -> LLM, skills .md, MIT | Es Hermes ya construido y multicanal | (es OSS) | Adoptar hibrido (canales) - P0 |
| Playwright MCP | Server MCP oficial Microsoft: navegador para agentes | QA sitios cliente, scraping, forms, checkout | (gratis/OSS) | Adoptar / consolidar con Chrome MCP - P1 |
| ManyChat | Marketing conversacional IG/WA/Messenger (SaaS por marca) | Es tu negocio, pero SaaS por cuenta come margen | Typebot + Chatwoot + n8n + WhatsApp Cloud API | Construir en stack OSS - P1 |
| Buffer | Programador de redes (SaaS por canal) | Alto para ops de contenido | Postiz (30+ redes) / Mixpost | Self-host Postiz (gated RAM) - P0/P1 |
| Miro | Pizarra colaborativa (SaaS por usuario) | Bajo, ya hay Figma | FigJam (ya lo tenes) / Excalidraw / tldraw | No pagar; usar FigJam - skip |
| Fathom | Notetaker IA de reuniones | Medio, reuniones cliente | Speakr + WhisperX/Speaches | YA CORRE self-hosted; usarlo - hecho |
| Weavy | Componentes drop-in de colaboracion (chat/feed/files/copilot) | Feature premium en SaaS | Supabase Realtime propio / Rocket.Chat | Guardar para feature premium - P2 |
| Momentum.io | Orquestacion de ingresos sobre Salesforce (enterprise) | Bajo: ONIA no usa Salesforce | n8n + CRM propio (Notion/Chatwoot) | Skip; replicar la idea (alertas de deal) en n8n - P2 |
| Blender | Suite 3D libre y gratis | Renders 3D producto (Nuvia), assets video, motion | (gratis/OSS) | Adoptar; headless con Python - P1 |
| Hermes | Gateway propio (VPS, skills .md, Telegram) | Nucleo | - | OpenClaw valida y acelera su arquitectura |

## OpenClaw vs Hermes: la decision

### Arquitectura OpenClaw (verificado en repo/docs)

- Node.js 24/22, TypeScript, pnpm workspace. **Licencia MIT.** Muy activo/viral 2026.
- Gateway local-first, control plane unico, WebSocket, Control UI en puerto 18789.
- 24+ canales: WhatsApp, Telegram, Slack, Discord, Signal, iMessage, LINE,
  WeChat, Matrix, Teams, etc.
- Skills en `~/.openclaw/workspace/skills/<skill>/SKILL.md` + prompts raiz
  `AGENTS.md` / `SOUL.md` / `TOOLS.md`. Registry ClawHub.
- LLM: config `provider/model-id`, multi-provider con failover y rotacion de
  perfiles. Model-agnostico (Claude/OpenAI/OpenRouter).
- Seguridad: **DM pairing** (codigo de aprobacion para remitentes desconocidos en
  WhatsApp/Telegram/Signal/iMessage), sandboxes (Docker/SSH) para mensajes de
  grupo/canal, restriccion de tools por sesion.
- Diseno single-user con ruteo multi-agente por workspaces + sesiones por
  canal/cuenta/peer. NO es un SaaS multi-tenant nativo.

### Hermes hoy (verificado)

- 36 skills de negocio en `hermes-content/skills/*.md` (propuestas con pricing
  ONIA, CRM prospeccion, impuestos Bolivia, video-lab Higgsfield, carruseles,
  agenda, etc.).
- Canal unico: **Telegram** como centro de comando (`hermes-command telegram`,
  `video-lab telegram`, `hermes-week-plan`). Scheduling por n8n.
- Protocolo de ejecucion cerrada, data-first, approval boundaries. Corre en
  `/root/hermes` en el VPS.

### Comparacion

Lo que OpenClaw aporta y Hermes no tiene:
1. **Multicanal real** (WhatsApp nativo = el negocio de chatbots de ONIA; hoy
   Hermes es Telegram-only).
2. **DM pairing / seguridad** de remitentes desconocidos (grado produccion para WA).
3. **Sandbox de tools** (Docker/SSH) para mensajes no confiables.
4. Daemon + Control UI + apps companion (Hermes es CLI+Telegram).
5. Plugin architecture + registry ya hechos.

Lo que Hermes tiene y no se tira:
1. **Logica de negocio ONIA** (36 skills), la joya, especifica y no portable
   desde OpenClaw.
2. Integracion profunda (n8n, Notion sources, video-lab, ig-publish, VPS).
3. Approval boundaries y protocolo afinados a la operacion.

### Decision: HIBRIDO (no fork total)

- OpenClaw = capa de **canales + gateway** (WhatsApp + Signal + Telegram) con su
  DM-pairing y sandbox.
- Hermes = **cerebro**: portar las 36 skills al formato skills de OpenClaw (ya
  son `SKILL.md` markdown, traduccion minima; `AGENTS.md` mapea directo).
- LLM de OpenClaw -> **LiteLLM que ya corre en el VPS** (control de costo + keys
  propias + failover).
- n8n sigue para scheduling/crons; OpenClaw maneja lo conversacional.

Unlock: chatbots WhatsApp-native para clientes (mata ManyChat) + centro de
comando Telegram de Sergio, todo OSS y self-hosted sobre la LiteLLM existente.

Caveat honesto (multi-tenant): OpenClaw es single-user por diseno. Para correr
bots de MUCHOS clientes hay que decidir topologia: workspaces/agentes por cliente
en una instancia, o instancia por cliente. No es SaaS multi-tenant listo; es
trabajo de arquitectura, no gratis. Evaluar en el piloto.

Riesgo de recursos: OpenClaw es otro daemon Node. Con el swap al 100%, planificar
placement (tras liberar RAM, o box aparte). No arrancarlo a ciegas en el VPS.

### Siguiente paso concreto (P0)

Piloto aislado: clonar OpenClaw, correrlo local o en box de prueba, conectar 1
canal WhatsApp de prueba, apuntarlo a LiteLLM, portar 1 skill Hermes (ej.
`genera-propuesta`) y validar respuesta end-to-end. Medir RAM. Recien despues
decidir placement productivo.

## Live IA 24/7 para vender - la verdad

La tech funciona: avatares interactivos que hostean live 24/7, responden
comentarios en tiempo real, integran catalogo; casos reportados de millones en
ventas por sesion. Tools: Syntopia (hecho para TikTok Shop), TikTok Symphony
Avatars (oficial, via Ads Manager), Wondershare Virbo Live, HeyGen Interactive
Avatar.

El bloqueo: ese modelo depende de **TikTok Shop con checkout in-app**, y TikTok
Shop **no opera en Bolivia** (LatAm: solo Mexico, y Brasil/Colombia/Chile/Peru en
distintos niveles). Sin TikTok Shop no hay checkout ni empuje del algoritmo de
live shopping. Politica: el avatar debe ser interactivo (no pre-grabado) y hay
que declarar que es IA.

Que SI se puede desde Bolivia:
1. Avatar IA en **Facebook/Instagram Live** (disponibles) + link a web/checkout
   propio (pasarela BNB que ya se maneja). Logra "live 24/7 que vende" sin TikTok
   Shop.
2. Vender el servicio a **clientes que exporten a MX/US** (ahi si TikTok Shop).
3. Piloto barato: HeyGen/Virbo para el avatar + OBS + bot propio (n8n/OpenClaw)
   que responde el chat. Medir antes de escalar.

Riesgo: TikTok endurece reglas de live IA (bans por baja interaccion/spam).
Piloto, no apuesta.

### Blueprint del piloto (avatar IA en vivo)

- Plataforma: Instagram Live o Facebook Live (Bolivia). Objetivo: sesion demo de
  producto de un cliente e-commerce (ej. Nuvia).
- Avatar: HeyGen Interactive Avatar o Wondershare Virbo Live (probar free tier).
- Presentacion: OBS Studio (gratis) como mixer de la senal.
- Cerebro de chat (diferenciador ONIA): bot que lee comentarios en vivo y responde
  con LLM via LiteLLM, sobre el stack de OpenClaw/n8n. Guion y catalogo inyectados.
- Checkout: link a la tienda del cliente (web-factory / Nuvia) con pasarela propia.
- Medicion: retencion, comentarios respondidos, clicks a checkout, ventas. Decidir
  escalar solo con numeros.

## Mapa "deja de pagar" (pago -> OSS)

| Pagas / usas | OSS equivalente | Estado real |
|---|---|---|
| Tavily | SearXNG + Crawl4AI | **Ambos YA corren**; migrar research a estos |
| (upgrade) | Firecrawl | Preparado; arrancar en ventana de mantenimiento tras liberar RAM |
| Buffer | Postiz / Mixpost | Preparar deploy; arrancar tras liberar RAM |
| ManyChat | Typebot + Chatwoot + n8n | Chatwoot vivo; falta Typebot |
| Fathom | Speakr + Speaches | **YA CORRE**; solo usarlo |
| Miro | FigJam / Excalidraw | FigJam ya disponible |
| fal.ai / image-gen | ComfyUI (self-host) | Evaluar; gated por RAM/GPU |
| Vercel (productos maduros) | Stack selfhost VPS | Existe docker-compose.selfhost |

Reconciliacion con la regla de autonomia (`automatizaciones-autonomas`): los
workflows n8n autonomos siguen sobre APIs gestionadas. El self-host de arriba es
para herramientas de operador (contenido, research a mano, reuniones, 3D) y
productos cliente. No meter SearXNG/Firecrawl como dependencia dura de un cron
critico.

## Hallazgo de infra: presion de memoria + consolidacion

El VPS corre **dos stacks Supabase completos** + Cal.com (1.08GB) + Speakr
(1.17GB) + n8n (862MB) + LiteLLM (961MB) + Chatwoot (4 contenedores). Swap al
100%. Oportunidades antes de sumar carga:

1. Revisar si los DOS stacks Supabase son necesarios (dentalgest-staging-* y el
   supabase-* pelado). Consolidar libera ~1GB+.
2. Cal.com: si el uso es bajo, evaluar apagarlo o mover a demanda.
3. Si el negocio necesita todo esto vivo: subir el VPS (de 16GB a 32GB) es mas
   barato que la inestabilidad. Regla del stack assessment: "selfhost para
   margen" solo si el box aguanta.

## Lente cliente / futuro (revision 2026-07-04)

Correccion de foco: la lista casi no sirve para que ONIA COMPRE, pero varias
cosas se vuelven servicios/features VENDIBLES. ONIA es el vendedor, no el cliente
de estas tools.

| Producto | Comprar para ONIA | Cliente / futuro |
|---|---|---|
| Blender | Si (gratis) | Servicio: renders 3D de producto (e-commerce/retail), assets de ads. Por proyecto + upsell. |
| Buffer -> Postiz | No pagar Buffer | Servicio recurrente: redes gestionadas white-label sobre infra propia. Backbone de content-factory. |
| ManyChat -> Typebot | No pagar ManyChat | Core: chatbot WA/IG como servicio recurrente en stack OSS = margen propio. ManyChat solo piloto express. |
| Live IA 24/7 avatar | No (Bolivia sin TikTok Shop) | Oferta: vendedor virtual 24/7 en FB/IG Live (local) + live-selling para exportadores MX/US. Futuro: TikTok Shop avanza en LatAm. Prototipar. |
| Weavy | Skip ahora | Upsell futuro en linea SaaS (chat/feed/copilot en DentalGest/GestiOS). Construir en Supabase Realtime; Weavy solo si velocidad > margen. |
| Playwright MCP | Nice-to-have | Escala con clientes: QA visual de muchos sitios web-factory + research competencia. |
| Fathom -> Speakr | Ya lo tenes | Servicio: actas de reunion automaticas en consultoria/GestiOS; alimenta CRM. |
| Momentum.io | No aplica | Solo la idea: alertas de deal + seguimiento en GestiOS/n8n. |
| Miro | No pagar (FigJam) | Bajo. Workshops via FigJam. |
| OpenClaw | Skip (hay Hermes) | Nada que Hermes+Chatwoot no cubran. |

Patron: no pagar la herramienta; construir el servicio sobre stack OSS y cobrar
el resultado recurrente (regla de pricing ONIA).

Ranking de ofertas de cliente (por retorno):
1. Redes gestionadas (Postiz) - recurrente.
2. Chatbot WhatsApp/IG (Typebot+Chatwoot+n8n) - recurrente, core.
3. Renders 3D de producto (Blender) - proyecto + upsell, costo cero.
4. Vendedor virtual 24/7 / live-selling IA - diferenciador, prototipar.
5. (Futuro) Colaboracion en SaaS (patron Weavy via Supabase) - retencion.

## Backlog priorizado

### P0 (esta semana)
- [ ] OpenClaw: piloto aislado (clonar, LiteLLM, 1 canal WA, 1 skill Hermes portada). Medir RAM.
- [ ] Tavily -> SearXNG + Crawl4AI (ya corren): migrar el research propio. Cero contenedores nuevos.
- [ ] Postiz: deploy preparado (ver `hermes-content/deploy/postiz/`). Arranque GATED a liberar RAM / subir VPS.

### P1 (2-3 semanas)
- [ ] Typebot self-host -> alternativa OSS a ManyChat; productizar chatbot WhatsApp.
- [ ] Usar Speakr (ya vivo) para actas de reunion en la operacion.
- [ ] Blender headless (Python) -> pipeline de render 3D producto para Nuvia/video-factory.
- [ ] Playwright MCP conectado a Hermes/agentes para QA de sitios cliente.

### P2 (oportunista)
- [ ] Piloto avatar IA en vivo (FB/IG Live), no TikTok Shop.
- [ ] Weavy para feature premium de colaboracion en un SaaS.
- [ ] Replicar idea de Momentum.io (alertas de deal) en n8n, sin Salesforce.
- [ ] Firecrawl / ComfyUI cuando haya RAM.

### Infra (habilitador de todo lo pesado)
- [ ] Decision consolidacion Supabase (2 stacks) o upgrade VPS 32GB.
