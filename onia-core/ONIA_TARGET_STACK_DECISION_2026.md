# ONIA Target Stack Decision 2026

Fecha: 2026-07-03.
Estado: propuesta de stack objetivo — requiere decision de Sergio.
Owner: ONIA / Hermes.
Complementa: `ONIA_STACK_ASSESSMENT_2026.md` (el codigo esta bien; esto es
infraestructura, gastos y operacion).

## Inventario real de infraestructura (verificado en repos)

| Pieza | Donde corre hoy | Rol | Costo/mes (estimar en billing) |
|---|---|---|---|
| DentaGest app | Vercel (con crons) | SaaS prod | US$0-20 (plan?) |
| DentaGest DB | Supabase cloud us-west-2 (Pro mencionado) | Datos clinicos | ~US$25 si Pro |
| GestiOS app+DB | Vercel + Supabase us-east-2 | SaaS | US$0-45 |
| Ganadero OS | Prisma+Supabase (etapa temprana) | SaaS | ~0 |
| VPS ONIA `187.77.16.63` | Hostinger, root | Hermes dashboard (:9119), control-tower, n8n instalado, crons | ~US$10-40 |
| **ONIA Center stack** | **La PC de Sergio + tuneles** (onia_center_local_stack.js, supabase tunnel watchdog) | Center, Cal, Supabase selfhosted local | 0 pero fragil |
| VPS Bolivian Electric | srv1793230.hstgr.cloud (Easypanel) | n8n + Caddy + Postgres del cliente | pagado por/para cliente |
| Chatwoot Cloud (BE) | Cloud Starter | WhatsApp intake BE | ~US$19-24/agente |
| Upstash Redis | Cloud | Rate limiting | ~0-10 |
| Sentry | Cloud | Errores | 0-26 |
| PostHog | Cloud (solo GestiOS) | Analytics | 0-? |
| Resend | Cloud | Email transaccional | 0 (free 3k/mes) |
| OpenAI / ElevenLabs / Higgsfield | Cloud APIs | Contenido IA, bots | variable, atado a produccion |

## Dificultades encontradas (honestas)

1. **ONIA Center corre en la PC.** Tuneles + watchdog para mantener vivo un
   Supabase local es infra de laboratorio, no de negocio. Si la PC se apaga,
   Center/Cal mueren. Es el punto mas fragil de todo el mapa.
2. **Infra repartida en 4 lugares** (PC, VPS ONIA, VPS cliente, Vercel/Supabase)
   sin un panel unico de que corre donde.
3. **Doble n8n** (VPS ONIA lo tiene instalado pero "Hermes cron es lo activo";
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
competitiva de ONIA, pero solo donde no arriesga datos de clientes.

## Stack objetivo propuesto

### Capa 1 — Plataforma ONIA (selfhost en VPS propio)

Mover TODO lo interno al VPS `187.77.16.63` (o uno nuevo dedicado si falta
RAM), gestionado con **Dokploy o Coolify** (PaaS open source sobre Docker;
deploy por git push, SSL automatico, backups configurables):

- Hermes dashboard + control tower (ya esta).
- **ONIA Center + Cal + su Supabase selfhosted** (sacarlos de la PC — mayor
  prioridad).
- **n8n unico de ONIA** (consolidar; el de BE queda en el VPS del cliente).
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
  Easypanel: n8n + Chatwoot + Postgres del cliente. ONIA cobra gestion
  mensual. Este modelo ya funciona — replicarlo como oferta estandar
  ("ONIA Managed Bridge").

## Gastos innecesarios detectados (recortar)

| Gasto | Accion | Ahorro estimado |
|---|---|---|
| Chatwoot Cloud | Selfhost en VPS ONIA (multi-cuenta) | US$19-24/agente/mes |
| Upstash | Redis en VPS | US$0-10/mes |
| Sentry pago (si escala) | free tier o GlitchTip en VPS | 0 hoy, US$26+ evitado |
| PostHog (si pago) | free tier o eliminar hasta tener trafico real | 0-? |
| Supabase proyectos extra | Politica 1 por producto | US$25/mes por proyecto evitado |
| Doble n8n ONIA | Consolidar en el del VPS | tiempo operativo |
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

## Plan de ejecucion propuesto (orden)

| Fase | Que | Esfuerzo | Resultado |
|---|---|---|---|
| 1 | Instalar Dokploy/Coolify en VPS ONIA; migrar ONIA Center+Cal+Supabase local de la PC al VPS | 1-2 dias | Nada de negocio corre en la PC |
| 2 | Chatwoot selfhosted en VPS ONIA; migrar inbox BE; cancelar cloud | 1 dia | Corta el gasto por agente |
| 3 | Consolidar n8n ONIA + crons (absorber crons de Vercel donde tenga sentido) | 0.5 dia | Un solo orquestador |
| 4 | Redis en VPS reemplaza Upstash; GlitchTip opcional | 0.5 dia | Menos SaaS sueltos |
| 5 | Ensayo de backups/restore de Postgres en VPS (con DB de prueba) | 1 dia | Habilita futuro selfhost de productos |
| 6 | (Cuando haya trafico) mover DentaGest a VPS dedicado con el stack selfhost | 2-3 dias | Margen maximo |

## Decisiones pendientes de Sergio

1. Plataforma ONIA: consolidar en VPS `187.77.16.63` o contratar VPS nuevo
   dedicado (depende de RAM disponible; Center+Chatwoot+n8n+Redis piden
   ~8GB comodos).
2. Productos SaaS: confirmar que se quedan en Vercel+Supabase hasta el
   trigger, o acelerar selfhost.
3. Recortes de la tabla: cuales ejecutar ya.
