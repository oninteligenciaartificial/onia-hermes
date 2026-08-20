# Onia — Repos open-source reusables (verificado jul-2026)

> Investigación de subagente (estrellas y licencias reales vía GitHub API). Cada URL es
> `github.com/<fullName>`. Convención de licencia: **Permisiva** (MIT/Apache/Unlicense) =
> forkeable/embebible sin ataduras · **Copyleft/fair-code** (AGPL/GPL/FSL/Sustainable-Use) =
> gratis para self-host y uso interno, **NO** embeber su código dentro de un SaaS propietario
> de Onia sin abrir el código.

## TOP 5 — empezar por acá (máximo impacto / mínimo esfuerzo)

1. **Zie619/n8n-workflows** (55.8k, MIT) — colección enorme buscable de workflows n8n reales. Importar directo al n8n del VPS: marketing, CRM, RAG, WhatsApp, e-commerce. Reuso inmediato, cero build.
2. **Evolution API + Chatwoot (ya lo tenemos)** (9k, Apache-based) — backbone del chatbot WhatsApp con IA (servicio #1 que vendemos). Evolution (WhatsApp) ↔ Chatwoot ↔ n8n/LLM. Stack estándar de agencia.
3. **gosom/google-maps-scraper** (5.2k, MIT) — motor de prospección con teléfono/web/email por rubro+ciudad → CRM. Upgrade del Prospector actual (cuando se apruebe). Copiar el embudo de **asiifdev/business-leads-ai-automation** (139, MIT: Maps+IA+WhatsApp, casi 1:1 con Onia).
4. **nextacular/nextacular** (1.4k, MIT) — starter SaaS **multi-tenant** Next.js + **Supabase** + **Prisma** + Stripe. Stack EXACTO de DentalGest/GestiOS: reusar onboarding/tenancy/billing.
5. **inovector/mixpost** (3.4k, MIT) — programación/publicación multi-red self-host, licencia limpia para usar con clientes.

## Por área

### Prospección / leads
| Repo | ★ | Lic | Aporta |
|---|---|---|---|
| gosom/google-maps-scraper | 5.2k | MIT | Maps: nombre, dirección, tel, web, rating, email |
| omkarcloud/google-maps-scraper | 2.9k | MIT | 50+ data points + enriquecimiento, tiene API |
| omkarcloud/botasaurus | 5.6k | MIT | Framework anti-bloqueo para scrapers a medida |
| asiifdev/business-leads-ai-automation | 139 | MIT | **Caso Onia**: Maps + email/WhatsApp con IA |

### Chatbot WhatsApp con IA
| Repo | ★ | Lic | Aporta |
|---|---|---|---|
| evolution-foundation/evolution-api | 9.0k | Apache-based | Gateway WhatsApp, nativo a Chatwoot + n8n |
| aldinokemal/go-whatsapp-web-multidevice | 4.3k | MIT | REST API WhatsApp en Go (bajo RAM), Chatwoot + MCP |
| WhiskeySockets/Baileys | 10.2k | MIT | Librería socket base de casi todos los bots |
| baptisteArno/typebot.io | 10.2k | FSL→Apache | Constructor visual de flujos, canal WhatsApp, n8n |

### Automatización n8n (templates)
| Repo | ★ | Lic | Aporta |
|---|---|---|---|
| Zie619/n8n-workflows | 55.8k | MIT | Colección buscable de workflows reales |
| enescingoz/awesome-n8n-templates | 24.1k | — | Curados: Gmail, Telegram, WhatsApp, OpenAI, RAG |
| felipfr/awesome-n8n-workflows | 401 | MIT | Workflows JSON por dominio (CRM, finanzas, marketing) |

### Boilerplates ERP/SaaS (stack Onia)
| Repo | ★ | Lic | Aporta |
|---|---|---|---|
| nextacular/nextacular | 1.4k | MIT | Multi-tenant Next+Supabase+Prisma+Stripe |
| boxyhq/saas-starter-kit | 4.9k | Apache-2.0 | SaaS enterprise: SSO/SAML, RBAC, teams |
| vercel/nextjs-subscription-payments | 7.7k | MIT | Next+Supabase+Stripe suscripciones |
| twentyhq/twenty | 53.4k | AGPL ⚠️ | CRM OSS — referencia de UX (no copiar código) |
| medusajs/medusa | 35.3k | MIT | E-commerce headless — motor real para Nuvia |

### Contenido / marketing IA
| Repo | ★ | Lic | Aporta |
|---|---|---|---|
| inovector/mixpost | 3.4k | MIT | Publicación multi-red self-host (limpio) |
| gitroomhq/postiz-app | 33.7k | AGPL ⚠️ | Scheduling social IA (self-host propio) |
| danny-avila/LibreChat | 41.1k | MIT | Chat IA con agentes, MCP, multi-modelo |

### Análisis de video / research YouTube
| Repo | ★ | Lic | Aporta |
|---|---|---|---|
| yt-dlp/yt-dlp | 179k | Unlicense | Descarga video/audio + metadata |
| openai/whisper | 105k | MIT | Transcripción de voz |
| SYSTRAN/faster-whisper | 24.4k | MIT | Whisper 4x más rápido (barato en VPS) |

> Alertas de licencia para negocio: Postiz, Twenty, n8n = AGPL/fair-code → perfectos para
> self-host y uso propio, **no** para copiar su código dentro de un SaaS cerrado que Onia revenda.
> Todo lo ✅ (MIT/Apache/Unlicense) es libre para forkear, modificar y embeber.
