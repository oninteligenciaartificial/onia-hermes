# Evaluaciones baratas — Strix · Apify vs Scrapling · Handy

> Fecha: 2026-08-16. Investigación de escritorio, **nada se instaló, nada se pagó, ninguna
> cuenta se dio de alta, nada se corrió**. Herramientas: búsqueda y fetch web.
> Regla transversal aplicada: **ninguna cifra sin fuente citada**; lo que no se pudo
> verificar se marca explícito.

---

## Resumen (3 líneas)

1. **Strix** — una corrida en *quick mode* contra un Next.js chico (~20 rutas API) en
   **entorno de prueba** cuesta **≈ USD 15–25** con Claude Sonnet 4.6 a precio oficial
   (supuesto: 8–12M tokens; ancla real: 5,7M tokens ≈ $17 en una corrida detenida temprano).
   NO se corrió. En modo profundo el costo se dispara (sin tope duro → riesgo de fuga de gasto).
2. **Apify vs Scrapling** — para prospección/medición (datos públicos de solo lectura),
   **Scrapling técnicamente alcanza y no necesita token → Apify no se paga**, PERO exige
   construir y mantener el extractor de Instagram, y su bypass de Cloudflare **no aplica a
   Meta/Instagram**. El tier gratis de Apify ($5/mes) también es $0 a bajo volumen y no exige
   construir nada.
3. **Handy** — **SÍ soporta Windows** (x64), MIT, mantenido (v0.9.0). Repo oficial:
   https://github.com/cjpais/Handy — `winget install cjpais.Handy`.

**Lo que NO se pudo verificar:** (a) costo exacto de Strix contra ESTE app concreto — se
estima, no se midió; (b) el alcance literal de lo que "S6" tiene frenado (solo consta
"token de Instagram bloqueado → frena prospección/medición"); (c) si el login-wall actual de
Instagram deja sacar listas de seguidores sin autenticar con cualquiera de las dos
herramientas; (d) precio exacto del plan Starter de Apify (la página oficial dice $29/mes, blogs
secundarios dicen $39).

---

## 1 · Strix — costo de UNA corrida contra un Next.js chico (~20 rutas API)

**Qué es.** Agente autónomo de pentesting (github.com/usestrix/strix, **Apache 2.0**). No es
análisis estático: corre la app, **explota** de verdad y valida con PoC funcional
(reconocimiento → explotación → validación). CLI gratis; modelo **BYOK** (traés tu propia API
key de LLM). Las keys del `.env` de Onia están inválidas y la suscripción de Claude Code NO
sirve (no es API) — habría que cargar una API key propia con saldo, que **no** se hace en esta
sesión.

**Modelos que recomiendan** (del README oficial): OpenAI GPT-5.4, **Anthropic Claude Sonnet 4.6**,
Google Gemini 3 Pro Preview.

### Datos reales de consumo encontrados

| Fuente | Modelo | Modo | Tokens | Tiempo | Costo | Nota |
|---|---|---|---|---|---|---|
| protego.me (review real, sitio propio) | Claude Sonnet | quick | **5.716.615 tokens de entrada**, 105 requests | ~10 min | **≈ $17** | **Detenida temprano** para topar gasto; el pico de tokens **le suspendió la API key de Anthropic** automáticamente |
| theaq.blog (18 modelos) | Sonnet 4.6, API oficial Tier 1 | — | — | — | **≈ $20** | Una sola corrida; encontró 1 vuln antes de terminar |
| theaq.blog (mismo run vía OpenRouter) | Sonnet 4.6 | — | — | — | **$55,90** | Reseller = mucho más caro que API oficial |
| wavect.io (benchmark del vendor, XBEN CTF — NO app real) | Gemini 3 Pro Preview | — | **~668.000 tokens de entrada por reto** | ~19 min/reto | **$3,37 por reto resuelto** (~$337 por 100 retos) | Es un CTF, no un app de producción; no establece el costo contra un app desconocido |

Fuentes secundarias mencionan que "las tareas completas consumen ~50M tokens" y que se puede
bajar a "<$1 por PR" con *quick scan* + *diff-based scoping* (medium.com) — **no verificado
contra un app real**, se cita como referencia, no como número firme.

### Estimación para el caso pedido

- **App objetivo del cálculo:** un Next.js chico, ~20 rutas API.
- **Supuesto de tokens (ESCRITO):** corrida en **quick mode**, **8–12M tokens** (mayormente de
  entrada). Ancla: la corrida real de protego.me llegó a 5,7M tokens en ~10 min y **la detuvieron
  antes de terminar**; una corrida completa corre más tiempo y suma tokens de salida.
- **Modelo del cálculo:** Claude Sonnet 4.6 a **precio oficial Anthropic** (no reseller).

> **Costo estimado: ≈ USD 15–25 por una corrida quick-mode.**
> Cotejado contra dos anclas reales independientes: ~$17 (protego, corrida capada) y ~$20
> (theaq, corrida única API oficial). Vía reseller/OpenRouter el mismo trabajo saltó a ~$56.

- En **modo profundo/completo** (no quick), el costo sube materialmente: con ~50M tokens
  citados para tareas completas, en un modelo premium puede pasar de **$100** por corrida.
- Con **Gemini 3 Pro Preview** el precio por unidad es más barato ($3,37/reto CTF), pero un
  escaneo de app entero equivale a muchos "retos" de trabajo → no es directamente $3,37.

### Contra qué app se atacaría

- **NUNCA producción. NUNCA el VPS de prod ni la base `dentalgest`.**
- Copia desechable / staging del Next.js chico: idealmente **docker local o deploy aislado**,
  con **base sembrada y sin datos reales de cliente**, credenciales de juguete, y sin webhooks
  reales conectados (WhatsApp/email apagados o apuntando a sandbox).

### Qué se rompe si sale mal

- **Strix explota de verdad:** manda payloads reales → puede **crear/modificar/borrar datos**,
  disparar emails/webhooks, y martillar endpoints (carga tipo DoS). Contra prod podría corromper
  la DB, spamear WhatsApp/email reales, agotar rate limits o **gatillar fail2ban/la autocura del
  VPS**.
- **Fuga de gasto LLM:** no hay tope duro de tokens. El pico de consumo en la review real
  **suspendió la API key de Anthropic** automáticamente. Sin límite configurado, una corrida
  larga o en loop puede quemar saldo rápido.
- Mitigación obligatoria antes de cualquier corrida futura: entorno aislado + key con **límite
  de gasto** + quick mode + scope acotado. **En esta sesión no se corrió nada.**

---

## 2 · Apify vs Scrapling — extraer Instagram sin token propio

Contexto: el token de Instagram de Onia está bloqueado (S6) y eso frena prospección/medición.

| Dimensión | **Scrapling** (github.com/D4Vinci/Scrapling) | **Apify** (plataforma + actors) |
|---|---|---|
| Qué es | Framework de scraping adaptativo (fetch + parser que se re-ancla solo) | Plataforma gestionada con "actors" listos (Instagram Scraper, Profile Scraper) |
| Licencia / costo base | **BSD-3-Clause, open source, gratis** | SaaS: **plan gratis $5/mes** de crédito; primer plan pago **Starter $29/mes** (página oficial; blogs citan $39 — discrepancia sin resolver) |
| Necesita token propio de IG | **No** (scrapea vos mismo) | **No** (Apify pone proxies/anti-bot; pagás en créditos) |
| Perfiles públicos | Sí, si la página es alcanzable sin login — vos escribís el extractor | Sí, actor dedicado |
| Posts / reels | Sí, con tu código | Sí, actor dedicado |
| Seguidores | Limitado — IG suele **exigir login** para listar seguidores; sin verificar que se pueda sin autenticar | Parcial, según actor; también topado por IG |
| Hashtags | Con tu código; páginas de hashtag muy gateadas por IG | Sí, actor dedicado |
| Bypass anti-bot | **StealthyFetcher** bypassa **Cloudflare Turnstile/Interstitial** — pero **Instagram es Meta, NO Cloudflare**, así que ese titular **no aplica a IG**; contra IG peleás el login-wall + rate-limit por IP de Meta | Apify absorbe proxies/anti-bot por vos (parte del servicio) |
| Precio por volumen IG | $0 (tu infra) + costo de mantenimiento/proxies | Instagram Scraper ≈ **$2,30–2,70 por 1.000 resultados**; el $5 gratis ≈ **~1.850 resultados/mes** |
| Mantenimiento | **Activo**: ~74k estrellas, commits recientes (ago-2026, incl. solver de captcha CF locale-agnostic) | Actor mantenido por el proveedor |
| Costo de construcción | Alto — vos armás y **babyseteás** el extractor de IG y la carrera anti-bot | Bajo — funciona hoy sin construir |

### Veredicto sobre S6

**Para prospección/medición (datos públicos de solo lectura: perfiles, posts, conteos,
hashtags), Scrapling técnicamente ALCANZA y no necesita token → Apify no se paga.** Con dos
salvedades honestas:

1. Scrapling da la capa stealth + parser, pero **vos escribís y mantenés la extracción de
   Instagram** y comés el riesgo de baneo por IP y la carrera anti-bot de Meta. Su gancho de
   marketing (bypass de Cloudflare) **es irrelevante contra Instagram**.
2. "No pagar Apify" **no obliga** a elegir Scrapling: el **tier gratis de Apify ($5/mes ≈ ~1.850
   resultados)** también es $0 a bajo volumen y **no exige construir nada**. Si el volumen de
   prospección es bajo y se quiere andando hoy sin mantenimiento, el free tier de Apify es el
   camino pragmático y sigue siendo gratis hasta pasarse del crédito.

**Resumen decisión:** si Onia quiere **cero costo de plataforma y controla el código** →
Scrapling. Si quiere **cero construcción y andando ya** a bajo volumen → free tier de Apify
($0). **En ningún escenario a este volumen hace falta pagar el plan Starter de Apify.**

**No verificado:** el alcance exacto de lo que S6 frena; y si el login-wall vigente de IG deja
sacar **listas de seguidores** sin autenticar con cualquiera de las dos (probablemente no, sin login).

---

## 3 · Handy — dictado por voz en Windows

**Pregunta: ¿soporta Windows?** → **SÍ.**

- Repo oficial: **https://github.com/cjpais/Handy** (sitio: handy.computer)
- Plataformas soportadas (del repo): **macOS (Intel y Apple Silicon), x64 Windows, x64 Linux**
- Licencia: **MIT**
- Mantenido: **sí** — versión **0.9.0**, 808 commits (repo oficial). Rust, offline.
- Instalación en Windows: descargar el release, o `winget install cjpais.Handy`
  (nota del repo: el paquete winget/Homebrew **no** lo mantienen los devs de Handy).
- **NO se instaló nada.**

> Discrepancia de datos: un blog secundario decía ~2.500 estrellas / 781 commits; el **repo
> oficial marca 29,7k estrellas / 808 commits**. Se toma el repo como fuente autoritativa.

---

## Fuentes

- Strix repo (Apache 2.0, modelos, BYOK): https://github.com/usestrix/strix
- Strix costo real (Sonnet, 5,7M tokens, ~$17, key suspendida): https://protego.me/blog/strix-ai-pentester-honest-review
- Strix 18 modelos ($20 API oficial / $55,90 OpenRouter): https://theaq.blog/2026/04/14/agentic-ai-pentesting-with-strix-results-from-18-llm-models.html
- Strix benchmark vendor (Gemini 3 Pro, 668k tokens/reto, $3,37/reto): https://wavect.io/blog/strix-ai-pentesting-pilot-guide-2026/
- Strix "<$1 por PR" (referencia, no verificado): https://medium.com/codetodeploy/strix-ai-pentest-in-ci-cd-keep-llm-costs-under-1-per-pr-4df6981b9ffb
- Scrapling repo (BSD-3, StealthyFetcher, mantenido): https://github.com/D4Vinci/Scrapling
- Apify pricing (free $5/mes, Starter $29/mes página oficial): https://apify.com/pricing
- Apify Instagram Scraper ($2,30–2,70/1.000 resultados): https://apify.com/apify/instagram-scraper
- Handy repo oficial (Windows x64, MIT, v0.9.0, winget): https://github.com/cjpais/Handy
