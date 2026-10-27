# Que les falta a los agentes de ONIA: busqueda en GitHub y docs oficiales (27-oct-2026)

Investigacion de solo lectura. No se clono, instalo ni ejecuto nada de terceros. Herramientas usadas: `gh api`, `gh search`, WebFetch, WebSearch y dos lecturas locales (versiones de skills).

## Como leer este informe

- **Observado**: lo lei yo (API de GitHub, README, registro de PyPI/npm, paginas de Meta y Buffer).
- **Declarado**: lo que dice el propio repo o el proveedor sobre si mismo.
- **Inferido**: mi conclusion. Va marcada.
- Limite: las paginas web las lei con WebFetch, que resume con un modelo pequeno. Los comandos de instalacion y los nombres de herramientas hay que releerlos en la fuente antes de usarlos.
- Una sola llamada a una herramienta conectada: `ads_library_search` (solo lectura) para saber si el MCP de Meta ya ve anuncios de Bolivia. Resultado abajo.

## Resumen en cinco lineas

1. Lo que mas falta no es un navegador nuevo: ya tienen tres. Falta (a) la parte de marketing que esta desactualizada o ausente, (b) el MCP oficial de WhatsApp Business de Meta, (c) el MCP oficial de Buffer para publicar en varias redes, (d) medir Core Web Vitals de las landings.
2. Las skills de marketing que ya tienen (familia `marketingskills`) estan 3 a 5 versiones menores atras y les faltan `cro`, `ab-testing`, `conversion-tracking`, `attribution`, `offers`.
3. Ninguna skill de terceros que encontre cubre bien "anuncio -> WhatsApp" (Click-to-WhatsApp y su medicion). Esa pieza hay que escribirla.
4. REA sigue sin ser apta: cadencia de releases todavia mas rapida y PRs grandes mergeados por su autor en poco mas de una hora. Se queda congelada.
5. Hay una trampa de nombres: el paquete `meta-ads-cli` de PyPI NO es de Meta. El oficial se llama `meta-ads`.

## Top 5 recomendado

| # | Candidato | Veredicto | Riesgo de cadena de suministro |
|---|---|---|---|
| 1 | `coreyhaines31/marketingskills`: actualizar lo que ya tienen y sumar las skills que faltan | Adoptar (copiar carpetas a mano tras leerlas) | Bajo: son Markdown. No correr `npx`, `tools/` ni `scripts/` |
| 2 | MCP oficial de Meta "WhatsApp Business Tools" | Adoptar, con alcance de solo lectura primero | Bajo en instalacion (remoto, OAuth). Alto en operacion si se da alcance de gestion |
| 3 | MCP oficial de Buffer (`mcp.buffer.com/mcp`) | Adoptar el MCP; no instalar el CLI por ahora | Bajo (remoto, OAuth). El paquete npm del CLI tiene higiene de release floja |
| 4 | `ChromeDevTools/chrome-devtools-mcp` para Lighthouse y trazas de rendimiento de landings | Probar en entorno descartable | Bajo: Google, procedencia SLSA, sin scripts de instalacion. Fijar version y apagar telemetria |
| 5 | Meta Ads CLI oficial (`meta-ads`) | Probar en entorno descartable, solo si Codex o Hermes lo necesitan | Medio: requiere un token de system user (secreto), licencia propietaria, solo macOS/Linux |

## Los 12 candidatos

### 1. coreyhaines31/marketingskills

- URL: https://github.com/coreyhaines31/marketingskills
- Observado: 56.892 estrellas, ultimo push 2026-10-27, licencia MIT, mantenedor Corey Haines (957 commits; otros 210, 41, 20 commits), version del repo 2.13.9. Los 10 PRs cerrados mas recientes son del propio dueno y estan mergeados; un PR externo (`local-business`, #894) esta cerrado sin mergear.
- Que hace: coleccion de skills de marketing (59 carpetas en `skills/`).
- Con que se pisa: ya tienen un subconjunto (ads, analytics, social, competitors, ad-creative, copywriting, pricing, content-strategy, lead-magnets, community-marketing, onboarding).
- **Observado, comparando versiones locales contra upstream**:
  - `ads` 2.2.0 local vs 2.7.0 upstream (a la local le faltan `meta-andromeda-playbook.md`, `audit-guardrails.md`, `creative-research-automation.md`).
  - `ad-creative` 2.8.0 vs 2.12.2; `copywriting` 2.0.1 vs 2.3.2; `analytics` 2.0.1 vs 2.2.2; `competitors` 2.0.1 vs 2.3.0; `social` 2.2.0 vs 2.4.0.
  - No las tienen: `cro`, `ab-testing`, `conversion-tracking`, `attribution`, `offers`, `marketing-psychology`, `customer-research`, `signup`, `popups`, `sms` (incluye una referencia de WhatsApp), `launch`, `marketing-plan`.
- Para "optimizar landings y copy": `cro` (con `references/form.md` y `experiments.md`), `offers` y `ab-testing` son lo mas directo.
- **Observado, limite importante**: las 9 referencias de `conversion-tracking` tienen cero menciones de WhatsApp. No cubre Click-to-WhatsApp. El funnel de ONIA termina en WhatsApp, asi que esa parte hay que escribirla.
- Riesgo de cadena de suministro: las skills son Markdown. El repo tambien trae `tools/` (CLIs e integraciones), `scripts/` y `partners.json` con integraciones "skill-partner" (declarado: socios comerciales, hay sesgo de patrocinio en `tools/`). Se instala normalmente con `npx skills`; no hacerlo.
- Veredicto: adoptar. Copiar a mano `cro`, `ab-testing`, `conversion-tracking`, `attribution`, `offers`, `marketing-psychology`, `customer-research` y refrescar `ads`, `ad-creative`, `copywriting`, `competitors`, `analytics`, `social`. Leer cada SKILL.md antes de copiar.

### 2. Meta "WhatsApp Business Tools MCP" (oficial, beta)

- URL de la documentacion: https://developers.facebook.com/documentation/mcp/whatsapp-business-tools-mcp (no es GitHub: sin estrellas ni repo).
- Declarado por Meta: endpoint `https://mcp.facebook.com/whatsapp_business_tools` (Streamable HTTP), beta, "rolling out gradually" (puede no estar activo para su cuenta). OAuth con cuenta Meta. Soporta Claude Code, Claude Desktop y OpenAI Codex App (Settings > MCP Servers, OAuth).
- Herramientas (todas con prefijo `whatsapp_biz_`): `businesses`, `accounts`, `phone_numbers`, `add_phone_number`, `send_verification_code`, `verify_phone_number`, `register_phone_number`, `list_templates`, `get_template`, `create_template`, `update_template`, `delete_template`, `send_message`, `configure_webhooks`, `subscribe_webhook`, `configure_payments`, `verify_business`, `system_user_token`.
- Requisitos declarados: rol MANAGE en el negocio, admin de una app con WhatsApp y haber aceptado los terminos de la Cloud API.
- Con que se pisa: el bot (`onia-chatbot`) y los scripts `*-run.sh` que hoy envian plantillas; el MCP "Meta Social Technologies" ya conectado (webhooks de apps).
- Por que importa (inferido): la memoria dice que pasadas 24 h solo se puede escribir con plantilla. Crear, editar y revisar plantillas desde el agente quita un paso manual al lanzar campanas Click-to-WhatsApp.
- Riesgos:
  - `configure_webhooks` o `register_phone_number` mal usados pueden romper el webhook en produccion del bot. Hay que dar solo alcance de lectura al principio (la pantalla de consentimiento deja elegir).
  - `send_message` es contacto con terceros: sigue pidiendo OK de Sergio Urcullo (regla del repo).
  - Meta misma advierte de inyeccion de instrucciones en contenido no confiable y recomienda no dar escritura a agentes que lean contenido externo.
- No pude confirmar (inferido) que la cuenta de ONIA cumpla los requisitos ni que la beta este habilitada. Se ve al intentar conectarlo.
- Veredicto: adoptar con lectura primero. Sin instalacion: se agrega como conector.

### 3. Buffer MCP oficial (y CLI)

- URL: https://developers.buffer.com/guides/integrations/mcp.html
- Declarado/observado en docs de Buffer: endpoint unico `https://mcp.buffer.com/mcp`, OAuth (o API key para clientes no listados). Herramientas: `get_account`, `list_channels`, `get_channel`, `list_posts`, `get_post`, `create_post`, `edit_post`, `delete_post`, `get_aggregated_post_metrics`, `list_ideas`, `create_idea`, plantillas de post, y `execute_query` / `execute_mutation`. Canales listados: Instagram, Facebook, Twitter/X, LinkedIn, Pinterest, YouTube, Google Business, TikTok, Threads, Bluesky, entre otros. Cuota compartida con la API key. El alcance es la cuenta entera, sin separar por organizacion.
- Con que se pisa: `ig-reel.mjs` (script sobre la API de Buffer) y el Postiz de la memoria (hoy su MCP falla con 502 segun el aviso de esta sesion). Claude in Chrome publicaria igual, pero a mano.
- Fecha de lanzamiento: un resultado de busqueda cita la entrada del blog de Buffer del 27-may-2026 (secundario, no lei la entrada). Las fuentes discrepan.
- CLI `@bufferapp/cli`, observado en el registro de npm: version 2.1.0 (2026-10-19), licencia ISC, sin scripts de instalacion, 2 dependencias (`commander`, `@inquirer/prompts`). Pero: 22 maintainers, varios con correo personal; las versiones 1.2.1, 1.2.2 y 2.0.0 estan deprecadas por no poder instalarse (dependencia `catalog:`); no pude confirmar atestaciones de procedencia. Inferido: higiene de release floja.
- Veredicto: adoptar el MCP para borradores, cola y metricas. Publicar sigue requiriendo OK (reglas del repo para piezas visibles). No instalar el CLI por ahora; si hace falta, fijar 2.1.0 tras revisar el paquete.

### 4. ChromeDevTools/chrome-devtools-mcp

- URL: https://github.com/ChromeDevTools/chrome-devtools-mcp
- Observado: 54.291 estrellas, push 2026-10-27, Apache-2.0, equipo de Chrome DevTools de Google (maintainer npm `google-wombot`), v1.12.0 del 2026-10-22. En npm: procedencia SLSA v1, sin `preinstall`/`install`/`postinstall`, sin dependencias de ejecucion.
- Que hace: servidor MCP que maneja un Chrome y expone `lighthouse_audit`, `performance_start_trace`/`stop_trace`, `performance_analyze_insight`, `emulate` (movil, red), `list_network_requests`, `take_screenshot`, `evaluate_script`.
- Con que se pisa: `agent-browser`, Claude in Chrome y la skill `web-perf` de Cloudflare cubren navegar. Ninguna de las que listaron mide LCP/INP/CLS con traza. El CLAUDE.md del repo exige LCP < 2,5 s, INP < 200 ms, CLS < 0,1.
- Riesgos (declarados en su README): usa `chrome-devtools-mcp@latest` en todos los ejemplos (fijar version); recolecta estadisticas de uso por defecto (`--no-usage-statistics`); puede enviar URLs de trazas a la API CrUX de Google (`--no-performance-crux`); revisa actualizaciones en npm (`CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS`); expone el contenido del navegador al cliente MCP.
- Veredicto: probar en entorno descartable: perfil aislado y sin cabeza, version fijada, telemetria apagada. No apuntarlo al Chrome diario del usuario.

### 5. Meta Ads CLI oficial (paquete `meta-ads`)

- Documentacion: https://developers.facebook.com/documentation/ads-commerce/ads-ai-connectors/ads-cli/setup/get-started
- Observado: en PyPI, `meta-ads`, propietario de cuenta "facebook", 4 versiones (1.0.0 del 2026-04-29 hasta 1.2.0 del 2026-09-29), licencia `LicenseRef-Proprietary`, Python >= 3.12, dependencias `click`, `facebook-business` 24.x, `python-dotenv`, `rich`.
- Declarado por Meta: instalacion por Homebrew (`facebook/fb/meta-ads`) o `pip install meta-ads`; plataformas macOS o Linux (Windows no aparece); autenticacion con token de system user (`ACCESS_TOKEN`); comandos `meta auth status`, `meta ads campaign list`, `meta ads insights get`, entre otros.
- **Trampa de nombres (observado)**: en PyPI existe `meta-ads-cli` v0.2.0, MIT, de "Attainment Labs": NO es de Meta. Varios blogs lo presentan como oficial, y otros citan `@meta/ads-cli` de npm, que da 404 en el registro. Instalar el nombre equivocado es un riesgo real.
- Con que se pisa: el MCP de Meta Ads que ya tienen conectado. Fuentes secundarias dicen que ambos exponen las mismas 29 herramientas.
- Para que serviria (inferido): agentes sin conector (Hermes, scripts de n8n o cron), subida de creativos desde archivos locales, salidas JSON. Pero Meta documenta que Codex App tambien puede conectar el MCP por OAuth, asi que el CLI puede sobrar.
- Riesgos: exige un token de system user (secreto). Va contra "no guardar tokens en logs ni argumentos" y el VPS no esta autorizado a alojar secretos personales. Por defecto, los objetos nacen en pausa (declarado por una fuente secundaria).
- Veredicto: probar en entorno descartable (WSL o contenedor, token de solo lectura), y solo si hay un agente que no pueda usar el MCP.

### 6. higgsfield-ai/skills (oficial de Higgsfield)

- URL: https://github.com/higgsfield-ai/skills
- Observado: 1.743 estrellas, push 2026-10-27, MIT, mantenido por el equipo de Higgsfield, version 0.14.0, 9 skills. El CLI `higgsfield-ai/cli` (684 estrellas) tuvo el 2026-10-16 un commit que verifica el sha256 del tarball al instalar.
- Con que se pisa: casi todo. Tienen `higgsfield-generate` (copia del repo en 0.12.0, que ya menciona Marketing Studio y Virality Predictor, medido por conteo de menciones) y `higgsfield-soul-id`.
- Lo que no tienen: `higgsfield-product-photoshoot` (modo `ad_creative_pack` para anuncios estaticos de Meta/TikTok) y `higgsfield-youtube-thumbnail` (marca personal).
- Inferido: para software, "producto visible o no sale" (regla de ONIA) limita el valor de fotos de producto con IA. El valor es bajo.
- Riesgo: los instaladores recomendados son `npx skills add`, `curl ... | sh` para el CLI (con sudo) y un script `setup`. No usarlos.
- Veredicto: adoptar solo por copia manual, prioridad baja. Primero hacer un diff entre la copia local y la 0.14.0.

### 7. AgriciDaniel/claude-ads

- URL: https://github.com/AgriciDaniel/claude-ads
- Observado: 10.489 estrellas, push 2026-10-17, MIT, un solo mantenedor (146 commits, ningun otro humano), v2.1.0 del 2026-10-16.
- Que hace (declarado): auditoria de cuentas de anuncios en 12 plataformas, con `ads-meta`, `ads-landing`, `ads-creative`, `ads-test`, `ads-server-side-tracking`; lee datos y propone, no cambia cuentas.
- Se pisa con `onia-ventas-pauta`, la skill `ads` y el MCP de Meta Ads.
- Observado: busqueda de "whatsapp" en el repo da cero resultados.
- Riesgos: instalador con dependencias Python pesadas (`weasyprint`, `playwright`, `cryptography`, etc.), aunque con lockfile con hashes, y `install.sh --source=git` clona el HEAD de la rama por defecto sin fijar. Sus politicas de seguridad se ven serias (SECURITY.md, bloqueo SSRF), pero es una superficie grande.
- Veredicto: descartar la instalacion. Si interesa, leer las referencias de `ads-landing` y `ads-meta` como material de consulta.

### 8. microsoft/playwright-mcp (modo extension)

- URL: https://github.com/microsoft/playwright-mcp
- Observado: 38.713 estrellas, push 2026-10-22, Apache-2.0, Microsoft, v0.0.83 (2026-09-28).
- Declarado: con la extension de Playwright se conecta a pestanas ya abiertas del Chrome/Edge real, con sesiones iniciadas. Casi todos los ejemplos usan `@playwright/mcp@latest`. Sus propios filtros de origenes dicen "no es un limite de seguridad".
- Observado en el README de `vercel-labs/agent-browser` (ya instalado): perfil de Chrome reutilizable (`--profile`), `--auto-connect`, `state save/load`, bóveda de credenciales cifrada. Cubre lo mismo desde la linea de comandos, y eso sirve a Codex.
- Veredicto: descartar (duplicado). Retomar solo si Codex necesita estrictamente un MCP de navegador.

### 9. microsoft/clarity-mcp-server

- URL: https://github.com/microsoft/clarity-mcp-server
- Observado: 131 estrellas, ultimo push 2026-02-24, MIT, Microsoft.
- Que hace: consulta analiticas y grabaciones de sesion de Microsoft Clarity desde el agente.
- Riesgos: el README pasa el token como argumento (`--clarity_api_token=...`), lo que deja el secreto en la lista de procesos; usa `npx` sin fijar version. No hay evidencia de que las landings de ONIA tengan Clarity instalado.
- Veredicto: descartar por ahora. Revisar si se instala Clarity.

### 10. X (Twitter): `xdevplatform/xurl` y el MCP alojado de X

- URLs: https://github.com/xdevplatform/xurl y https://docs.x.com/tools/mcp
- Observado: `xurl` tiene 1.362 estrellas, push 2026-09-29, MIT, es el "CLI oficial de la API de X". El repo `xdevplatform/xmcp` (864 estrellas) no recibe push desde 2026-04-09.
- Declarado: el MCP alojado esta en `https://api.x.com/mcp`, se usa mediante el puente local `xurl mcp`, exige tu propia app de desarrollador, plan de pago por uso y cuenta en "Production". La pagina que lei lista lectura, busqueda, marcadores y borradores de Articles; no confirma publicar posts normales. Fuentes secundarias hablan de costos por publicacion y por lectura, no verificados.
- Se pisa con Buffer, que ya publica en X, y con Claude in Chrome (gratis).
- Veredicto: descartar.

### 11. Ryze AI (`irinabuht12-oss/google-ads-meta-ads-mcp` y `irinabuht12-oss/marketing-skills`)

- URLs: https://github.com/irinabuht12-oss/google-ads-meta-ads-mcp y https://github.com/irinabuht12-oss/marketing-skills
- Observado: 6.182 y 5.947 estrellas, push 2026-10-27, cuenta de usuario creada en 2025-09, 12 repos. La descripcion del primero dice "hosted remote MCP ... 7-day free trial ... By Ryze AI"; el README del segundo empuja a `get-ryze.ai` con enlaces UTM.
- Inferido: es marketing de un proveedor. Las estrellas no son una senal de calidad que yo pueda verificar.
- Riesgo: un intermediario de pago retendria el acceso OAuth a las cuentas de Meta/Google Ads, y duplica el MCP oficial de Meta, que es gratuito durante la beta.
- Veredicto: descartar.

### 12. MCPs que raspan la Biblioteca de Anuncios (ej. `RamsesAguirre777/facebook-ads-library-mcp`, `proxy-intell/facebook-ads-library-mcp`)

- URLs: https://github.com/RamsesAguirre777/facebook-ads-library-mcp y https://github.com/proxy-intell/facebook-ads-library-mcp
- Observado: 280 y 318 estrellas, push 2026-08-29 y 2026-10-24. Declarado: raspan la Biblioteca publica sin token.
- **Observado hoy**: el MCP oficial de Meta ya conectado (`ads_library_search`) devolvio `estimated_total_count: 466` anuncios activos para "clinica dental" en `BO`, con pagina, fechas, moneda y enlace al snapshot. No devuelve gasto, impresiones ni texto completo del anuncio; para ver el creativo hay que abrir el enlace del snapshot en el navegador. La descripcion de esa herramienta dice que no es para extraccion masiva.
- Veredicto: descartar. El raspado agrega riesgo de terminos de servicio y fragilidad sin resolver la limitacion real (abrir los creativos), que `agent-browser` o Claude in Chrome ya resuelven.

### Vistos solo en busqueda, sin ficha completa

Todos descartables, con la razon corta:

- `pipeboard-co/meta-ads-mcp` (1.336 estrellas, licencia NOASSERTION): duplica el MCP oficial gratuito.
- `OSideMedia/higgsfield-ai-prompt-skill` (808 estrellas, MIT, un solo mantenedor): biblioteca de prompts cinematograficos; se pisa con `sacar-prompt` y no es lo que necesita un anuncio de software.
- `vercel/next-devtools-mcp` (833 estrellas, v0.4.0 del 2026-06-24): conector delgado hacia `/_next/mcp`, que su skill `next-dev-loop` ya usa.
- `vercel-labs/agent-skills` (33.110 estrellas): `react-best-practices` es MIT, pero no es claramente mejor que su stack actual.
- `googleanalytics/google-analytics-mcp` (3.573 estrellas, Apache-2.0, Google): util solo si usan GA4; no hay evidencia.
- `anthropics/knowledge-work-plugins`, plugin `marketing` (33.405 estrellas, Apache-2.0): generico y se pisa con `marketingskills`.
- `PostHog/mcp`: el repo esta archivado (push 2026-01-19).
- `oussch702/whatsapp-conversions-api` (1 estrella): el unico resultado sobre eventos de Conversions API para Click-to-WhatsApp. Demasiado chico para confiar.

## REA (github.com/morluto/rea): que cambio desde el 10-oct

**Veredicto: sigue congelada.** No tengo las cifras del 10-oct, asi que comparo contra lo que usted describio.

Observado el 27-oct:

- 396.989 estrellas, MIT, ultimo push el mismo dia, 1.293 incidencias y PRs abiertos. No hay avisos de seguridad publicados (la lista de GitHub Security Advisories esta vacia).
- Cadencia de releases: de `4.0.1` el 5-oct a `6.8.0` el 25-oct hay al menos 12 releases publicados. Las versiones mayores `4.x`, `5.0.0` y `6.0.0` salieron entre el 5 y el 8 de octubre. Hay 30 tags en total.
- Revision de PRs, medida por API:
  - #7514 (instalacion autocontenida de plugins para Claude Code y Codex): +1.591/-132 lineas, 29 archivos, abierto 15:56 y mergeado 17:13 UTC, por su propio autor (`gensokyo-dev`). Los "reviews" son un bot (Greptile) y comentarios del propio autor.
  - #7505 (+87/-19) y #7361 (+131/-18): mergeados por el dueno sin ningun review.
  - #7274 (+3.489/-141, 43 archivos) tuvo 25 reviews en unas 26 horas; no inspeccione quienes revisaron (pueden ser bots).
- Cambios en el flujo de publicacion (mejoras): el workflow `release.yml` tiene guardas que se niegan a publicar si el merge revisado no coincide con la fuente, rama de release congelada, `release-recovery.yml` y publicacion npm con `id-token`/procedencia.
- Lo que sigue igual: el README manda a `npx rea-agents setup`, que registra REA en el agente, instala instrucciones de flujo y puede instalar Hopper; actualiza con `npx rea-agents@latest`. El README tambien avisa de que hay repos con nombre parecido que no son oficiales.
- Novedad de riesgo: #7514 agrega una nueva via de distribucion como plugin de Claude Code y Codex.
- Busqueda de incidentes externos: no encontre ninguno. Un fragmento de Security Affairs mencionaba a Anthropic y "rea..."; la segunda busqueda no pudo confirmar relacion alguna. No lo tomo como dato.

Inferido: las mejoras de publicacion reducen un riesgo, pero merges de PRs grandes por el propio autor en poco mas de una hora, versiones mayores en dias y un instalador que modifica la configuracion del agente mantienen lo que motivo congelarla. La zona legal (descompilar apps de competidores) no cambio.

## Que busque y no encontre

- **Skill o herramienta confiable para Click-to-WhatsApp y su medicion** (CAPI con `ctwa_clid`): solo un repo de 1 estrella. Hay que escribir una skill propia a partir de la documentacion de Meta y las herramientas de dataset del MCP de Meta Ads.
- **MCP oficial de Meta para publicar en Paginas de Facebook o Instagram**: la pagina oficial de MCP de Meta lista solo Ads, Social Technologies y WhatsApp Business Tools. Existen paquetes de terceros con pocas descargas; no los evalue. Buffer cubre la publicacion.
- **Skill de marketing para clinicas dentales en Bolivia o LatAm**: nada. La unica cercana es la de negocio local (SEO local, resenas) que quedo en un PR sin mergear de `marketingskills`.
- **Algo claramente mejor para Next.js, Prisma o Postgres** que su stack actual: no. `next-dev-loop`, `prisma-cli` y `postgres-patterns` cubren lo que vi.
- **Navegador nuevo con sesiones iniciadas**: no hace falta; `agent-browser` ya trae reutilizacion de perfil, `--auto-connect` y guardado de estado.
- **Precio y limites vigentes de X**: no pude leer la pagina de precios de X; los numeros que circulan son secundarios.

## Lo que no verifique

- Si la cuenta de Meta de ONIA cumple los requisitos del MCP de WhatsApp y si la beta esta activa.
- La lista completa de comandos del Meta Ads CLI (la pagina de referencia no la muestra completa).
- El contenido completo de cada SKILL.md de `marketingskills` (leí descripciones, no cada archivo). Antes de copiar, leerlas.
- Quienes revisaron los PRs de REA.
- Si la copia local de `higgsfield-generate` difiere de la 0.14.0 en algo util.

## Para decidir (de Sergio Urcullo)

1. Autorizar conectar el MCP de WhatsApp Business Tools y el de Buffer (OAuth, alcance de solo lectura primero en WhatsApp).
2. Autorizar copiar las skills de `marketingskills` listadas (es descargar contenido de un tercero: la regla del repo pide aprobacion).
3. Decidir si se prueba `chrome-devtools-mcp` en un entorno descartable.
