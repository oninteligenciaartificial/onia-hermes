# Onia Target Stack Decision 2026

Fecha: 2026-07-03.
Estado: propuesta de stack objetivo — requiere decision de Sergio.
Owner: Onia / Hermes.
Complementa: `ONIA_STACK_ASSESSMENT_2026.md` (el codigo esta bien; esto es
infraestructura, gastos y operacion).

## Inventario real de infraestructura (verificado en repos)

| Pieza | Donde corre hoy | Rol | Costo/mes (estimar en billing) |
|---|---|---|---|
| DentaGest app | Vercel (con crons) | SaaS prod | US$0-20 (plan?) |
| DentaGest DB | Supabase cloud us-west-2 (Pro mencionado) | Datos clinicos | ~US$25 si Pro |
| GestiOS app+DB | Vercel + Supabase us-east-2 | SaaS | US$0-45 |
| Ganadero OS | Prisma+Supabase (etapa temprana) | SaaS | ~0 |
| VPS Onia `187.77.16.63` | Hostinger, root | Hermes dashboard (:9119), control-tower, n8n instalado, crons | ~US$10-40 |
| **Onia Center stack** | **La PC de Sergio + tuneles** (onia_center_local_stack.js, supabase tunnel watchdog) | Center, Cal, Supabase selfhosted local | 0 pero fragil |
| VPS Bolivian Electric | srv1793230.hstgr.cloud (Easypanel) | n8n + Caddy + Postgres del cliente | pagado por/para cliente |
| Chatwoot Cloud (BE) | Cloud Starter | WhatsApp intake BE | ~US$19-24/agente |
| Upstash Redis | Cloud | Rate limiting | ~0-10 |
| Sentry | Cloud | Errores | 0-26 |
| PostHog | Cloud (solo GestiOS) | Analytics | 0-? |
| Resend | Cloud | Email transaccional | 0 (free 3k/mes) |
| OpenAI / ElevenLabs / Higgsfield | Cloud APIs | Contenido IA, bots | variable, atado a produccion |

## Dificultades encontradas (honestas)

1. **Onia Center corre en la PC.** Tuneles + watchdog para mantener vivo un
   Supabase local es infra de laboratorio, no de negocio. Si la PC se apaga,
   Center/Cal mueren. Es el punto mas fragil de todo el mapa.
2. **Infra repartida en 4 lugares** (PC, VPS Onia, VPS cliente, Vercel/Supabase)
   sin un panel unico de que corre donde.
3. **Doble n8n** (VPS Onia lo tiene instalado pero "Hermes cron es lo activo";
   VPS BE tiene el suyo). Confusion operativa.
4. **Chatwoot Cloud es gasto recurrente creciente** — ya decidiste direccion
   selfhost para BE; falta ejecutarla.
5. **Datos clinicos en Supabase cloud**: bien hoy (backups/PITR gestionados),
   pero cualquier plan selfhost de DB exige disciplina de backups probada
   ANTES de mover un solo byte.
6. **Vercel crons acoplados**: los crons de DentaGest viven en vercel.json;
   si un dia se migra el hosting hay que replanificarlos (n8n los puede
   absorber).

## Principio de decision

```text
Cloud gestionado = velocidad de venta y datos criticos.
Selfhost (VPS)   = margen en todo lo que es operacion interna o por cliente.
La PC            = solo desarrollo. NUNCA infra de negocio.
```

Con ARPU de Bs. 320-1500 (~US$46-215), cada US$25/mes fijo por servicio se
come el margen de un cliente entero. El selfhost inteligente es la ventaja
competitiva de Onia, pero solo donde no arriesga datos de clientes.

## Stack objetivo propuesto

### Capa 1 — Plataforma Onia (selfhost en VPS propio)

Mover TODO lo interno al VPS `187.77.16.63` (o uno nuevo dedicado si falta
RAM), gestionado con **Dokploy o Coolify** (PaaS open source sobre Docker;
deploy por git push, SSL automatico, backups configurables):

- Hermes dashboard + control tower (ya esta).
- **Onia Center + Cal + su Supabase selfhosted** (sacarlos de la PC — mayor
  prioridad).
- **n8n unico de Onia** (consolidar; el de BE queda en el VPS del cliente).
- **Chatwoot selfhosted** multi-cuenta: sirve a BE y a futuros clientes
  WhatsApp sin costo por agente.
- Redis (reemplaza Upstash), workers de video/colas, GlitchTip si se quiere
  reemplazar Sentry.
- Previews de web-factory.

### Capa 2 — Productos SaaS (cloud gestionado, por ahora)

- DentaGest/GestiOS/Ganadero: **Vercel + Supabase cloud se quedan** hasta
  ~50 organizaciones activas por producto o hasta que el costo mensual
  supere ~US$100/producto. Razon: backups/PITR/auth gestionados con datos de
  clientes, cero carga operativa mientras se vende.
- Regla anti-gasto: **1 proyecto Supabase por PRODUCTO, jamas por cliente.**
  Multi-tenancy es por organizationId.
- Trigger de migracion a VPS: cuando un producto facture estable, se muda a
  un VPS dedicado con el stack selfhost ya ensayado (docker-compose.selfhost
  de DentaGest existe justo para eso) + backups automatizados verificados.

### Capa 3 — Por cliente gestionado (modelo BE)

- Cada cliente enterprise (tipo Bolivian Electric) paga su propio VPS con
  Easypanel: n8n + Chatwoot + Postgres del cliente. Onia cobra gestion
  mensual. Este modelo ya funciona — replicarlo como oferta estandar
  ("ONIA Managed Bridge").

## Gastos innecesarios detectados (recortar)

| Gasto | Accion | Ahorro estimado |
|---|---|---|
| Chatwoot Cloud | Selfhost en VPS Onia (multi-cuenta) | US$19-24/agente/mes |
| Upstash | Redis en VPS | US$0-10/mes |
| Sentry pago (si escala) | free tier o GlitchTip en VPS | 0 hoy, US$26+ evitado |
| PostHog (si pago) | free tier o eliminar hasta tener trafico real | 0-? |
| Supabase proyectos extra | Politica 1 por producto | US$25/mes por proyecto evitado |
| Doble n8n Onia | Consolidar en el del VPS | tiempo operativo |
| Higgsfield/ElevenLabs/OpenAI | No son infra: presupuesto de PRODUCCION atado a ventas de contenido; revisar plan solo si hay meses sin uso | variable |

## Que NO selfhostear (por ahora)

- **Postgres de productos con datos de clientes** (clinicos!): hasta tener
  backups automatizados + restore ENSAYADO en el VPS. El baseline de
  migraciones (2026-07-03) deja lista la portabilidad; falta la disciplina
  de operacion.
- **Email** (Resend free alcanza; deliverability selfhost es una guerra).
- **Auth**: Supabase Auth mientras se use Supabase. Si algun dia se sale,
  el reemplazo moderno es Better Auth (open source, Postgres-nativo) — no
  tocar ahora.

## DECISIONES TOMADAS (Sergio, 2026-07-03)

1. Plataforma Onia: consolidar en el VPS actual `187.77.16.63`.
2. Productos SaaS: cloud (Vercel+Supabase) hasta el trigger (~50 orgs o
   US$100/mes/producto).
3. Recortes aprobados: Chatwoot selfhost, Upstash->Redis, consolidar n8n,
   Sentry/PostHog a free tier.

## Auditoria del VPS ejecutada 2026-07-03 (cambia el plan)

VPS `srv1360183` (187.77.16.63): 4 vCPU, **15GB RAM (6.7 disponibles)**,
193GB disco (45% usado). Ya corre MUCHO mas de lo documentado:

| Ya en el VPS | Estado |
|---|---|
| **Easypanel + Traefik** | PaaS ya instalado — no hace falta Dokploy/Coolify |
| **Chatwoot selfhosted completo** (app+db+redis+sidekiq: `onia-chatbot_*`) | Up, healthy |
| **n8n** (`n8n-sergio`) | Up |
| **Cal.com** (`onia-calcom`) | Up, healthy |
| **onia-center** (container) | Up |
| **Supabase selfhosted staging DentalGest** (stack completo: db, auth, kong, rest, realtime, storage, studio) | Up, healthy — el ensayo selfhost YA EXISTE |
| speakr (transcripcion audio) + **ollama** (LLM local) | Up |
| hermes-control-tower + hermes-assets (systemd) + pm2 | Running |

Lo que REALMENTE depende de la PC (verificado en
`scripts/onia_center_local_stack.js` + watchdog): la app Onia Center local
(puerto 3012) usa un **Supabase local en la PC (54321)** y tuneles SSH
PC<->VPS mantenidos por watchdog (incluye tuneles de audio speakr/speaches).

## Plan de ejecucion corregido

| Fase | Que | Estado |
|---|---|---|
| 1 | ~~Migrar Supabase de Center al VPS~~ **VERIFICADO 2026-07-03: YA ESTA HECHO.** Los datos viven en el VPS (`supabase-db`, schema `onia_center`, 44 tablas; kong publica 54321 local). El container `onia-center` corre en el VPS y `https://center.onia.com.bo` responde 200. Los tuneles de la PC son SOLO para desarrollo local (PC consume servicios del VPS, no al reves). **Ninguna infra de negocio depende de la PC.** El watchdog es una comodidad de dev, no un riesgo | HECHO (verificado) |
| 2 | Chatwoot: ya selfhosted en VPS Onia (para uso ONIA/clientes chicos). **REGLA (Sergio 2026-07-03): el Chatwoot de Bolivian Electric va en SU propio VPS (srv1793230), no se mezcla con el de Onia.** La migracion del inbox BE desde Chatwoot Cloud se hace hacia el VPS del cliente (sesion en repo BE) | regla fijada |
| 3 | n8n: ya en VPS. Falta consolidar crons dispersos (Hermes cron activo vs n8n) | 70% hecho |
| 4 | Redis: existe (chatwoot-redis). Matiz: DentaGest/GestiOS corren en Vercel — mantener Upstash FREE tier para ellos hasta que se muden (latencia Vercel->VPS no vale la pena); no pagar Upstash | ajustado |
| 5 | Backups/restore Postgres en VPS: el stack staging ya es el laboratorio; falta el ENSAYO de restore documentado | pendiente |
| 6 | Sentry/PostHog: verificar en billing que esten en free tier | verificar |

Conclusion: el gasto innecesario mayor detectado es **Chatwoot Cloud starter
de BE duplicando el Chatwoot selfhosted que ya corre en el VPS**. La fragilidad
mayor sigue siendo Onia Center dependiendo de la PC.
