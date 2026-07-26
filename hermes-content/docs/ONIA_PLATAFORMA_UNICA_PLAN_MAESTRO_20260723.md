# Plan Maestro — Plataforma Única ONIA (DISPATCH-READY)

> **Carril I (research/estrategia).** Fecha: 2026-07-23. Handoff para el onia-orchestrator.
> Síntesis de 4 diseños (arquitecto-puerta · foso-bolivia · descomponedor-carriles ·
> secuencia-escéptico). Para pegar al orquestador y despachar carriles a sesiones.
> Va acompañado del brief de decisión: `ONIA_PLATAFORMA_UNICA_BRIEF_DECISION_20260723.md`.

**Fuentes ancladas:** `onia-core/contract.json` (entidades, `verticalTracks`, `verticalPacks`, `intakePolicy`, `external_gate`, `moduleCapabilities`, `readModels.owner_dashboard`) · `hermes-content/docs/research/ONIA_DAPTA_PLATAFORMA_UNIFICADA_20260723.md` (decisión Opción B→A, §8) · `hermes-content/integrations/siat/README.md` (emisor a 262 tests, bloqueo = S2 token piloto) · `hermes-content/docs/ONIA_DENTALGEST_ESTRUCTURA_ULTIMA_MILLA_2026.md` · repo DentalGest `C:\dev\proyectos\DentaGest\dental-saas` (rama `feat/onia-dental-medical-alert`).

---

## 0. Tesis y disciplina

La **Plataforma Única ONIA** es UNA web donde cualquier empresa boliviana entra, elige su rubro, se le crea la cuenta y queda todo listo — y desde esa misma cuenta ONIA le enciende versión local (on-premise), chatbot IA, página web y automatizaciones de su rubro. Arquitectónicamente son **dos capas**: (A) la **PUERTA** (web única + cuenta única SSO + provisionador + catálogo de add-ons) que es **BARATA y se hace YA**; y (B) el **MOTOR unificado** (todos los ERPs sobre un runtime/DB común) que es **CARO y crece de a un vertical, NO big-bang**. **Regla dura vertical-first:** el MVP vendible no es "la plataforma" — es **DentalGest cerrando su círculo (operar → factura SIAT legal → un agente que actúa)**. DentalGest es la **habitación #1** y la **ruta crítica**; la puerta sin ella es un cascarón hermoso a un cuarto vacío. No se construye runtime unificado, ni 2do vertical, ni billing self-serve, ni metering-que-cobra **adelante de validar 1 vertical con clientes pagando** (hoy: 0 clientes pagando). El foso es Bolivia: SIAT, impuestos, planilla y números que ningún sistema global tiene — ahí, y solo ahí, el cliente paga.

---

## 1. Arquitectura de la Plataforma Única

### 1.1 Los cuatro componentes NUEVOS (y qué NO se toca)

| Pieza NUEVA | Qué es | Dónde vive |
|---|---|---|
| **La Puerta** (`apps/gate`) | Web pública + selector de rubro + signup + panel de cuenta + catálogo | Next.js en `web-factory`, dominio `app.onia.bo` |
| **ONIA ID** | Cuenta única / IdP: identidad + orgs + membership + subscription + entitlements | Supabase proyecto `onia-platform`, schema `platform` |
| **Provisionador** | Enruta rubro→track→producto; crea/liga tenant; enciende entitlements (idempotente) | Edge Functions + tabla `provisioning_job` |
| **Catálogo de add-ons** | Feature-flags que se encienden en la cuenta (on-prem, chatbot, web, automatizaciones, SIAT) | Tabla `platform.entitlement` + workflows de fulfillment |

**Se REUSA tal cual (cero reescritura):** `onia-core` completo (schema+módulos+verticalPacks+intakePolicy+agents+owner_dashboard) · **DentalGest** (repo aparte) · **emisor SIAT** (`hermes-content/integrations/siat/`) · **Web Factory** · **Hermes+n8n** · `docker-compose.selfhost` (Modelo C) · Supabase Auth · VPS Easypanel · componentes UI de ONIA Center rebuild.

### 1.2 Diagrama de componentes

```
                         PUBLICO / INTERNET
                                │
                    ┌───────────▼──────────────┐
                    │  LA PUERTA (apps/gate)     │  Next.js · app.onia.bo
                    │  web pública + marketing    │  (marketing lo arma Web Factory)
                    └───────────┬──────────────┘
                                │
                 ┌──────────────▼────────────────┐
                 │  SELECTOR DE RUBRO             │  lee contract.json →
                 │  (11 verticalTracks + plan Bs)  │  resuelve track + oferta del pack
                 └──────────────┬────────────────┘
                                │
                 ┌──────────────▼────────────────┐
                 │  SIGNUP → ONIA ID              │  Supabase Auth (onia-platform)
                 │  crea app_user + organization   │  = CUENTA ÚNICA / IdP
                 │       + membership(owner)       │  fuente de verdad de identidad
                 └──────────────┬────────────────┘
                                │  (org_id, rubro, plan)
                 ┌──────────────▼────────────────┐
                 │  PROVISIONADOR (idempotente)   │  Edge Fn + provisioning_job
                 │  rubro→track→producto correcto  │  escribe product_tenant + entitlement
                 └───────┬───────────────┬────────┘
        ruta A: HAY app  │               │  ruta B: vertical NUEVO
        (DentalGest)      │               │  (sobre runtime core) — DIFERIDO
                          ▼               ▼
        ┌────────────────────────┐  ┌──────────────────────────────┐
        │ DentalGest (REPO APARTE)│  │ CORE-RUNTIME HOST (apps/vert.) │
        │ Next.js · DB propia     │  │ MISMO proyecto onia-platform    │
        │ dental.onia.bo          │  │ onia-core schema + verticalPack │
        │ SSO por token-exchange   │  │ auth nativo (auth.uid + RLS)    │
        │ POST /api/sso/exchange   │  │ owner_dashboard + intake        │
        └───────────┬────────────┘  └───────────────┬───────────────┘
                    └───────────────┬────────────────┘
                                    │  ambos leen entitlements de ONIA ID
                 ┌──────────────────▼─────────────────┐
                 │  PANEL DE CUENTA (apps/gate)         │  "mis habitaciones" + catálogo
                 └──────────────────┬─────────────────┘
                                    │
                 ┌──────────────────▼─────────────────┐
                 │  CATÁLOGO DE ADD-ONS = entitlements   │
                 └──┬──────────┬──────────┬──────────┬──┘
                    ▼          ▼          ▼          ▼
               Modelo C   chatbot IA   página web  automatizaciones + SIAT
               (selfhost) agents+WA    Web Factory  automation+presets / emisor
```

### 1.3 Modelo de datos mínimo (Supabase `onia-platform`, schema `platform`)

La identidad sube UNA capa por encima del tenant: ONIA ID gobierna quién sos y a qué habitaciones entrás; `onia-core` sigue gobernando la operación DENTRO de cada habitación.

```sql
platform.app_user        (id=auth.users.id, email, name, phone, created_at)
platform.organization    (id, name, nit, rubro, vertical_track_id, plan_code, status)
platform.membership      (id, org_id, user_id, role['owner','admin','staff'], status)
platform.product_tenant  (id, org_id, product_key['dentagest','core-runtime'],
                          vertical_track_id, external_tenant_id, base_url, db_ref, status)
platform.subscription    (id, org_id, product_tenant_id, plan_code, currency='BOB',
                          amount, period, status, valid_until, billing='manual')
platform.entitlement     (id, org_id, feature_key, source['plan','addon','grant'], status, valid_until)
   -- feature_key: vertical.dentagest | vertical.<track> | addon.on_premise |
   --   addon.chatbot_ia | addon.web_page | addon.automations | addon.siat
platform.provisioning_job(id, org_id, kind, target_product, payload jsonb,
                          idempotency_key UNIQUE, status, error, created_at)
platform.action_ledger   (org_id, included_quota, consumed, recharge_balance, period_start)
   -- "Acción ONIA" = fair-use INTERNO (bolsa + recarga QR). NUNCA unidad de venta ni post-pago.
```

**SSO — cómo conviven DB juntas y DB aparte.** ONIA ID es el único IdP; el JWT lleva `app_metadata.orgs[]` y `app_metadata.entitlements[]`.
- **Verticales core-runtime (mismo proyecto):** auth nativo, RLS por `auth.uid()`, entitlements directo. Cero puente. Barato.
- **DentalGest (DB extranjera) → puente token-exchange** (mínimo, reversible, NO reescribe su auth): panel firma un ticket corto RS256 (exp ~60s) con `org_id/external_tenant_id/email/role/entitlements` → redirige a `dental.onia.bo/api/sso/exchange` → DentalGest verifica firma+exp, upsert usuario por email, fija clínica, crea SU sesión. Deja **intacto el RLS de DentalGest**.

### 1.4 Piezas nuevas priorizadas (⚑ = ruta crítica)

| # | Pieza | Costo | Nota |
|---|---|---|---|
| 1 ⚑ | **ONIA ID** (Supabase Auth + `app_user`/`organization`/`membership`) | Barato | Auth existente + ~3 tablas |
| 2 ⚑ | **Puerta + selector de rubro + signup** (`apps/gate`) | Barato | Next.js chico que lee `contract.json` |
| 3 ⚑ | **Provisionador** + `provisioning_job` + `product_tenant` | Medio | Idempotente; rutea A/B |
| 4 ⚑ | **Entitlements** (tabla + claims-en-JWT + helper de check) | Barato-Medio | Stateless cross-project |
| 5 ⚑ | **Puente SSO DentalGest** (`/api/sso/exchange`) | Medio | Toca ruta crítica; reversible |
| 6 | **Panel de cuenta** (rooms + catálogo UI) | Medio | Reusa ONIA Center / Web Factory |
| 7 | **Workflows turn-on** (web=build, automations=preset, chatbot/siat/on-prem=ticket) | Barato salvo cred externa | web_page y automations = config |
| 8 | **Core-runtime host** (capa B) | **CARO** | **DIFERIDO** hasta 2do vertical validado con clientes pagando |

---

## 2. El foso Bolivia (el diferenciador)

Lo que ningún QuickBooks/Odoo/AFIP global tiene, y en qué capa de ONIA vive. **El motor fiscal es MÓDULO COMPARTIDO parametrizado por tenant/rubro** — un rubro nuevo es un `verticalPack` (config) que *requiere* estas capabilities, no código fiscal nuevo (patrón `proveegest-electrico` en `contract.json`).

### 2.1 Tabla compacta del foso

| # | Requisito boliviano | Capa ONIA | Reusable por | Estado hoy |
|---|---|---|---|---|
| 1 | **SIAT — emisión real** (SOAP al SIN, estados 908/904/901) `[Bolivia-crítico · obligatorio 30-sep-2026]` | external_gate: SIAT | TODOS | **Parcial** — motor 262 tests, sin correr contra piloto. Bloqueo S2 |
| 2 | **CUF** (Módulo 11 + código de control) `[crítico]` | invoicing + SIAT | TODOS | Parcial — verificado vs Anexo Técnico oficial |
| 3 | **CUFD diario + CUIS** `[crítico]` | external_gate: SIAT | TODOS | Existe (28 tests); falta vivo |
| 4 | **QR + leyenda + código actividad** en el gráfico `[crítico]` | invoicing → render producto | TODOS | Parcial — payload listo, render por producto |
| 5 | **Factura sectorial "Hospitales-Clínicas"** `[crítico salud]` | invoicing (cód. sector) + pack | Dental/Vet/Estética | **Falta** — cód. sector `[VERIFICAR]` |
| 6 | **Homologación catálogo al padrón SIN** `[crítico]` | external_gate: SIAT | TODOS | Existe (34 tests); sync diario falta |
| 7 | **Contingencia / offline SIAT** (paquetes ≤500, reenvío 48h) `[crítico]` | external_gate: SIAT | TODOS | Existe (30 tests) |
| 8 | **Anulación con plazo legal** (día 9 mes sig.) `[crítico]` | SIAT + core ApprovalRequest | TODOS | Existe (19 tests); día `[VERIFICAR]` |
| 9 | **IVA 13%** (débito−crédito) `[crítico]` — Ley 843 | accounting `tax_bolivia` | TODOS | Parcial — GestiOS `lib/fiscal` 544 tests |
| 10 | **IT 3% + compensación IT↔IUE** `[crítico]` — Ley 843 | accounting `tax_bolivia` | TODOS | Parcial |
| 11 | **IUE 25% anual** (deducibles, depreciación) `[crítico]` — DS 24051 | accounting `tax_bolivia` | TODOS | Parcial |
| 12 | **RC-IVA 13%** (dependientes/alquileres) `[crítico si hay planilla]` | payroll + accounting | TODOS c/empleados | Parcial — Form 110/608 `[VERIFICAR]` |
| 13 | **IUE-BE 12,5% efectivo** (servicios del exterior: Claude/ElevenLabs) `[crítico]` — Art. 51, Form 530 | accounting (retenciones) | TODOS que pagan exterior | Parcial — diseñado, no automatizado |
| 14 | **Servicios digitales del exterior** — DS 4732 | accounting `tax_bolivia` | TODOS | **Falta** — mecánica `[VERIFICAR]` |
| 15 | **Retenciones a proveedores sin factura** | accounting | TODOS | Falta — tasas `[VERIFICAR]` |
| 16 | **RCV / Libros IVA** (formato oficial, envío mensual) `[crítico]` | accounting `tax_bolivia` | TODOS | Falta/Parcial |
| 17 | **Calendario vencimientos por dígito de NIT** `[crítico]` | automation + skill n8n | TODOS | Parcial — template VACÍO, falta NIT tenant |
| 18 | **Radar normativo RND/DS** | external_gate n8n → `tax_posture` | TODOS + ONIA | **Existe** (workflow vivo) |
| 19 | **Bancarización** (respaldo ≥ Bs 50.000) `[crítico]` | accounting (validación) | TODOS | Falta — monto `[VERIFICAR]` |
| 20 | **Planilla — aportes Gestora Pública** (ex-AFP) `[crítico]` | payroll | TODOS c/empleados | Parcial — % `[VERIFICAR]` |
| 21 | **Bono de antigüedad** (% sobre SMN) `[crítico]` — LGT | payroll | TODOS c/empleados | **Existe** (P0 hecho); escala/SMN `[VERIFICAR]` |
| 22 | **Aguinaldo + 2do aguinaldo (PIB)** `[crítico]` — DS | payroll | TODOS c/empleados | Existe; umbral PIB `[VERIFICAR]` anual |
| 23 | **Finiquito / indemnización / desahucio** `[crítico]` — LGT | payroll | TODOS c/empleados | Existe |
| 24 | **Planilla Min. Trabajo + CNS** (10% patronal `[VERIFICAR]`) `[crítico]` | payroll + external_gate | TODOS c/empleados | Falta presentación externa |
| 25 | **Historia clínica formato Min. Salud** `[crítico salud]` | verticalPack: salud | Dental/Vet/Estética | Parcial — conformidad Norma Técnica `[VERIFICAR]` |
| 26 | **Landed cost / import Bolivia** — DS 5646, NC2/NC6 | imports `import_costing` | Distribución/importadoras | Existe; vigencia `[VERIFICAR]` |
| 27 | **Bs + tipo de cambio** (6,96 oficial) | core config + accounting | TODOS | Existe |
| 28 | **QR Simple interoperable (ASFI) / BCP** — NO Stripe | commerce + external_gate | TODOS que cobran | Parcial — checkout WA Nuvia; QR por cerrar |
| 29 | **Offline-first / continuidad** (luz+internet inestables) | core sync + SIAT contingencia | Ganadero/rural/TODOS | Parcial |
| 30 | **NIT / padrón / credencial tributaria** `[crítico]` | core + SIAT `tenant-registry` | TODOS | Existe (registry por org, vault) |
| 31 | **Sucursales + PdV (branchCode SIAT)** | core `Area type=SUCURSAL` + SIAT | Multi-local | Existe (modelado) |

### 2.2 Motor fiscal COMPARTIDO vs específico de rubro

- **Compartido (todo vertical enciende, mismo código):** `accounting/tax_bolivia` (filas 9-16,19 — el corazón del foso) · `invoicing` (2,4) · `external_gate:SIAT` (1,3,6,7,8,30) · `payroll` (12,20-24) · `automation`+Radar n8n (17,18).
- **Específico del pack:** factura sectorial salud (5) · historia clínica Min. Salud (25) · landed cost (26, solo rubros que importan) · multi-sucursal (31, crítico solo multi-local).

### 2.3 Qué VERIFICAR con fuente antes de venderlo como HECHO

**Confirmado (vendible con confianza):** IVA 13% / IT 3% / IUE 25% / RC-IVA 13% (Ley 843) · IUE-BE 12,5% efectivo (Art. 51, DS 24051, Form 530) · deadline **30-sep-2026** · CUF y estructura XML (vs Anexo Técnico oficial 2026-07-22) · Gestora reemplazó a AFP.

**`[VERIFICAR]` — no decir "hecho":** (1) emisión SIAT real nunca corrió contra piloto (`pilotosiatservicios…/v2`) — no vender "facturamos" hasta cerrar CUIS→CUFD→recepción→908 en vivo; (2) namespace/wrapper SOAP + XSD field-by-field + firma XMLDSig; (3) código sector "Hospitales-Clínicas"; (4) día exacto de anulación; (5) % Gestora/CNS/riesgo profesional/Pro-Vivienda/solidario; (6) SMN 2026 y escala bono antigüedad; (7) umbral PIB 2do aguinaldo; (8) monto bancarización; (9) DS 5646 vigencia; (10) DS 4732 × IUE-BE; (11) Form RC-IVA dependientes; (12) Norma Técnica Expediente Clínico; (13) template calendario NIT VACÍO + falta NIT tenant.

**Regla transversal (skill `onia-contabilidad-bolivia`):** no hardcodear tasa/plazo sin RND/DS citado; parametrizar por tenant/vertical; toda cifra al cliente lleva "confirmar con contador matriculado" — ONIA prepara, no presenta ante el SIN.

---

## 3. Los carriles (dispatch-ready)

Mapeado sobre el modelo de carriles existente (A–L, onia-core, infra). ⭐ = RUTA CRÍTICA.

| Carril | Repo / carpeta exacta | Entrega (scope) | Depende de | Gate de cierre | P/S |
|---|---|---|---|---|---|
| **N · siat-service** ⭐ | `onia-hermes/hermes-content/integrations/siat/**` | Exponer el emisor `external_gate` como servicio/endpoint invocable desde DentaGest + registrar tenant piloto en `tenant-registry`. Cerrar `[VERIFICAR]` SOAP/XSD/XMLDSig contra WSDL/XSD públicos. **NO reescribir el emisor.** | **S2** (NIT/creds piloto) · deploy vía G | Endpoint responde CUF verificado vs Anexo Técnico en piloto; tests verdes | Paralelo (contrato primero, antes que D1) |
| **D1 · dentalgest-fiscal** ⭐ | `C:\dev\proyectos\DentaGest\dental-saas` (`feat/onia-dental-medical-alert`) — `prisma/schema.prisma`, `app/api/invoices/**`, `app/(dashboard)/billing/**`, `print/invoice/[id]` | Migrar `Invoice` bespoke → `OniaInvoicingInvoice` (campos cuf/cufd/cuis/controlCode/qrUrl/legend). Al confirmar factura → llama **siat-service** → persiste cuf/qr/authorizationNumber; render QR+leyenda en impresión. Feature-flag la ruta SIAT; bespoke vivo hasta corte completo | **N** (contrato endpoint) · **S2** | Factura piloto emitida legal (CUF real) + tsc + 54+ tests verdes + `print` con QR | Serial (cabeza de D) |
| **D2 · dentalgest-agentes** ⭐ | repo DentaGest — `lib/onia-core/` (agents), `app/(dashboard)/pending/**`, crons `onia-core-workitems` | Runtime agentes 24/7 human-in-the-loop: **Recall + Cobrador** primero (mayor ROI), luego Confirmador. `routeAction` → cola `/pending` con aprobación. Demoable con drafts en cola SIN envío real | D1 (mismo repo→serial) · envío WhatsApp = **S6** | Demo: Recall+Cobrador proponen en `/pending`, dueño aprueba → acción; e2e verde | Serial (tras D1) |
| **D3 · dentalgest-ultima-milla** | repo DentaGest — `components/patients/**`, `app/(dashboard)/billing/[id]/page.tsx`, `SavedViewSelector.tsx` | Form de **crear** alerta médica (POST existe), extender collab (comentarios/docs/aprob) a pantalla de factura, SavedView en más listas. Barato, alto impacto percibido | D1/D2 (mismo repo→serial) | tsc + e2e; UI probada en vivo | Serial (tras D2) |
| **P · puerta-plataforma** | `onia-hermes/web-factory/apps/` (app nueva `apps/puerta` o sobre `apps/site`; **AVISAR** antes de tocar los 4 raíz) | La PUERTA: web única → elegir rubro → cuenta (ONIA ID/SSO) → provisionador rutea a DentalGest → catálogo de add-ons (solo CTA + cobro a mano, sin billing) | **S1** (precios) · contrato SSO con DentaGest | Flujo cuenta→provisiona→entra a DentalGest bajo SSO; `tsc --noEmit` verde en apps/site + e2e | Paralelo día 1 |
| **A · onia-center** (rebuild) | `onia-hermes/web-factory/apps/site/src/app/onia-center/**` + `api/onia-center/**` | Sala de agentes: operar/aprobar la cola `/pending`, ver agentes vivos. Rebuild a componentes chicos al lado de prod, swap al final | — (data existe: `lib/onia-center-store` + api) | Rebuild swap; tsc verde; conserva Vendedor/Día + cola aprobación | Paralelo día 1 |
| **G · infra-deploy** | n8n / VPS Easypanel `187.77.16.63` / Supabase (SERIAL, un dueño) | Deploy de siat-service + puerta; n8n workflows agentes (recordatorios/cobrador/radar) + intake WhatsApp; provisioning Supabase por tenant | Código N/P/D en main · **S3** · **S6** | Servicios arriba y probados en vivo (no solo commiteado) | Serial (único dueño infra) |
| **I · research-estrategia** | `onia-hermes/hermes-content/docs/research/**` | Cerrar `[VERIFICAR]` de §2.3 (no-show/atrición Bolivia, penetración WhatsApp, grupo SIAT del piloto, ticket odontológico Bs) + validar candidato a 2do vertical + insumos S1. NO codea, entrega decisión | — | Decisión escrita con fuentes citadas | Paralelo día 1 |

**Los 4 add-ons NO son 4 carriles de build** — cada uno ya es una máquina existente; el trabajo es exponerlos en el catálogo + "encender" fino: on-premise → `docker-compose.selfhost` (upsell, no día 1) · chatbot → módulo `agents` rol soporte (dentro de D2) + S6 · página web → Web Factory (carril B) · automatizaciones → n8n (G) + módulo `automation`.

---

## 4. Secuencia y ruta crítica

### 4.1 Ruta crítica — la cadena serial del primer dentista

`entra → opera` (**YA EXISTE**, ~90%, login + wizard `/setup`) → **N** (contrato SIAT) → **D1** (fiscal) → **D2** (agentes) → **D3** (última milla). Hitos:

| Hito | HECHO cuando… | Gate |
|---|---|---|
| **H1** Invoicing migrado | Facturas sobre `OniaInvoicingInvoice` con campos SIAT; bespoke feature-flagged; tsc + 54+ tests verdes | Ninguno humano |
| **H2** SIAT cableado (mock) | Confirmar factura → persiste CUF/QR/authNumber; `print` con QR+leyenda; e2e vs SIN simulado | Ninguno humano |
| **H3** SIAT piloto real | CUIS→CUFD→recepción→**estado 908 validada** vs piloto; `[VERIFICAR]` SOAP/XSD cerrados; XMLDSig lista | **S2 token piloto** |
| **H4** Certificación proveedor | ONIA aprobado como emisor ante el SIN | **SEPREC aprobado** (NIT ✅, matrícula ⏳) |
| **H5** Agente demoable | Recall/Cobrador corre en cron sobre data real → sugerencia aprobable en `/pending` | Ninguno humano |
| **H6** Onboarding cliente #1 | Tenant del dentista (NIT/token) en `tenant-registry`; factura **prod** validada | Cliente real + su NIT |
| **H7** Cobro | Primer mensual pagado en Bs | **S1 precios** |

**Distinción que salva el cronograma:** *demo-listo (piloto)* ≠ *legalmente-vendible (prod)*. H1→H2→H5 son **todo código sin bloqueo humano** → dan la **demo vendible en piloto**. H3→H4→H6→H7 (gateados por S2/SEPREC/S1) dan el **cliente pagando legal**. El equipo nunca queda ocioso esperando trámites: el código va contra mock; el trámite es tarea paralela con dueño y fecha. **El cuello de botella real no es Claude ni el cupo: es un trámite boliviano.**

### 4.2 Paralelo día 1 (repos/carpetas distintas, cero choque)

`N` (siat specs, avanza sin NIT) · `P` (puerta) · `A` (onia-center) · `G` (infra, serial interno) · `I` (research). `D` es cadena serial DENTRO de un repo → subagentes secuenciales, una sola sesión de control.

### 4.3 Regla anti-trampa — lo que NO se construye hasta el primer cliente pagando

Si aparece cualquiera antes de tener 1 clínica pagando, **es la trampa** (una puerta hermosa a un cuarto vacío):

1. **Storefront multi-producto / catálogo self-serve** — el 1er dentista entra por login, no por tienda.
2. **Signup self-serve + provisioning automático** — al cliente #1 lo provisiona Sergio a mano con `/setup`.
3. **Billing metered post-pago / "Acción ONIA" que cobra** — cobro a mano en Bs; el crédito solo topa fair-use.
4. **Runtime unificado / DB compartida cross-producto** — DentalGest sigue repo aparte; `onia-core` CONGELADO (`installInProductRepos=false`), no se instala sin adopción aprobada.
5. **Multi-tenant cloud + RLS para escalar** — clientes 1..N en **on-premise (Modelo C, un deploy por clínica)**; esquiva el multi-tenant entero y la privacidad vende.
6. **GestiOS/ProveeGest/Ganadero como vendibles** — un solo vertical validado primero; los demás son definición, no oferta. GestiOS (E) y Bolivian Electric (F) siguen SOLO su baseline en su repo, NO se fuerzan a converger.
7. **Entities dentales premium** (`perio_chart`, `tooth_image`, `dental_lab_case`) — solo `treatment_plan`+`informed_consent` si un piloto los pide para cerrar.
8. **Chatbot IA WhatsApp** — el botón click-to-chat va incluido gratis; el chatbot pago espera S6 + demanda.
9. **Portal del paciente** — retención, no gate de venta.
10. **SLA <3min / soporte dedicado** — Sergio + cola de aprobación; nunca prometer tiempos de empresa con equipo.

---

## 5. Bloqueos humanos de Sergio

| Bloqueo | Qué destraba | Carriles que lo necesitan |
|---|---|---|
| **S1 · precios/planes** | Catálogo de la Puerta + planes DentalGest en Bs + H7 cobro | **P** (bloqueante catálogo), I |
| **S2 · NIT + credenciales SIAT piloto** | Emitir factura electrónica real (H3) | **N**, **D1** ⭐ — sin esto solo mock verificado, no CUF real |
| **SEPREC · matrícula** (NIT ✅ obtenido, matrícula ⏳) | Certificar ONIA como emisor / factura legal prod (H4) | **N**, **D1** ⭐ — gate legal, no de código |
| **S3 · secret intake n8n** | Cablear workflows agentes/recordatorios | **G** |
| **S6 · token IG/WhatsApp productivo** | Envío real Recall/Cobrador/Confirmador + chatbot add-on | **D2** (envío; la demo con drafts NO lo necesita), **G** |
| **S8 · fiscal** | Precio de lista Contador Pack + formato historia clínica Min. Salud | D1/D3 (secundario), I |

**Secuencia para el orquestador:** N publica el contrato del endpoint primero → D1 wirea contra él (repos distintos → paralelos, pero D1 depende del contrato de N). G no despliega el runtime de agentes en vivo hasta que D2 esté en main y S6 exista. Cada carril: worktree explícito → `git branch --show-current` → rebase `origin/main` → commits chicos por carpeta → gates (`tsc --noEmit`, e2e donde aplique, code-reviewer) → merge a main como **árbol coherente que compila**. Un ítem cierra cuando su código está en main (y en prod/vivo para M/G).

---

## 6. Prompts de kickoff (listos para pegar)

> Uno por carril. Pegar tal cual al onia-orchestrator. Cada prompt arranca con verificación de rama y worktree.

**RUTA CRÍTICA**

```
[CARRIL N · siat-service] ⭐ RUTA CRÍTICA
Verifica git branch primero (git branch --show-current) y confirma que estás en el worktree de onia-hermes.
Objetivo: exponer el emisor SIAT existente como servicio/endpoint invocable desde el repo DentaGest, sin reescribirlo.
Repo/carpeta: onia-hermes/hermes-content/integrations/siat/** (emisor ya a 262 tests).
Scope: (1) definir y publicar el CONTRATO del endpoint (input factura normalizada → output cuf/cufd/qrUrl/authorizationNumber/estado). (2) registrar tenant piloto en tenant-registry. (3) cerrar los [VERIFICAR] de SOAP/XSD/firma XMLDSig contra WSDL/XSD PÚBLICOS (sin depender de S2). NO tocar la lógica del emisor ni del CUF.
No hacer: correr contra el piloto real (espera S2), ni cablear DentalGest (eso es D1).
Gate: endpoint responde CUF verificado vs Anexo Técnico; tests verdes; contrato documentado para que D1 wiree.
Fuente: hermes-content/integrations/siat/README.md · onia-core/contract.json (external_gate). Skill: onia-contabilidad-bolivia.
```

```
[CARRIL D1 · dentalgest-fiscal] ⭐ RUTA CRÍTICA
Verifica git branch primero: debe ser feat/onia-dental-medical-alert en el repo C:\dev\proyectos\DentaGest\dental-saas (repo APARTE, no onia-hermes).
Objetivo: que DentalGest emita factura electrónica boliviana con CUF/QR reales.
Scope: migrar Invoice bespoke → OniaInvoicingInvoice (campos cuf/cufd/cuis/controlCode/qrUrl/legend). Al confirmar factura → llamar al siat-service (contrato del carril N) → persistir cuf/qr/authorizationNumber. Render QR + leyenda fiscal en print/invoice/[id]. Feature-flag la ruta SIAT; dejar el bespoke vivo hasta corte completo.
Archivos: prisma/schema.prisma, app/api/invoices/**, app/(dashboard)/billing/**, print/invoice/[id].
Depende de: contrato de N (endpoint) + S2 (NIT/token piloto) para el CUF prod real.
Gate: factura de piloto emitida legal (CUF real cuando exista S2; mock verificado sin él) + tsc + 54+ tests verdes + print con QR. Entra a main como UN árbol coherente que compila (no merge parcial). Dry-run + backup antes de tocar datos de piloto.
```

```
[CARRIL D2 · dentalgest-agentes] ⭐ RUTA CRÍTICA
Verifica git branch primero (mismo repo DentaGest, SERIAL tras D1).
Objetivo: un agente que ACTÚA sobre data real, demoable con aprobación humana.
Scope: runtime de agentes 24/7 human-in-the-loop — Recall + Cobrador primero (mayor ROI), luego Confirmador. routeAction → cola /pending con aprobación del dueño. Demoable con drafts en cola SIN envío real.
Archivos: lib/onia-core/ (módulo agents), app/(dashboard)/pending/**, crons onia-core-workitems.
Depende de: D1 en main (mismo repo). Envío WhatsApp real = S6 (la demo con drafts NO lo necesita).
Gate: demo e2e — Recall+Cobrador corren en cron sobre work_items/clinical-balance reales y dejan ≥1 sugerencia en /pending que el dueño aprueba.
```

**PARALELOS DÍA 1**

```
[CARRIL P · puerta-plataforma] Paralelo día 1
Verifica git branch primero y confirma worktree onia-hermes. AVISAR antes de tocar los 4 archivos raíz de web-factory (next.config.ts, layout.tsx, globals.css, package.json).
Objetivo: la PUERTA — el cliente siente UNA plataforma; por debajo DentalGest sigue repo aparte.
Repo/carpeta: onia-hermes/web-factory/apps/ (app nueva apps/puerta o sobre apps/site).
Scope: web única → selector de rubro (lee onia-core/contract.json verticalTracks + plan Bs) → signup que crea ONIA ID (app_user + organization + membership) → provisionador que rutea a DentalGest vía SSO token-exchange → panel de cuenta con catálogo de add-ons (solo CTA + cobro a mano; SIN billing self-serve). Cargar skill impeccable + galería/tokens web-factory ANTES de codear (no diseño genérico).
No hacer: core-runtime host (capa B, diferido), billing metered, provisioning automático de tenant.
Depende de: S1 (precios para el catálogo) + contrato SSO con DentaGest.
Gate: flujo cuenta→provisiona→entra a DentalGest bajo SSO; tsc --noEmit verde en apps/site + e2e.
```

```
[CARRIL A · onia-center rebuild] Paralelo día 1
Verifica git branch primero (worktree onia-hermes).
Objetivo: sala de agentes que soporta la ops de la cola /pending.
Carpeta: web-factory/apps/site/src/app/onia-center/** + api/onia-center/**.
Scope: continuar el rebuild a componentes chicos (~100-200 líneas c/u) al lado de prod, reusando lib/onia-center-store + api/onia-center; swap al final. Conservar agentes Vendedor/Día + cola de aprobación.
No hacer: rediseñar el monolito en su lugar (14k líneas, ningún agente puede).
Gate: rebuild swap; tsc verde; conserva Vendedor/Día + cola aprobación.
```

```
[CARRIL G · infra-deploy] Paralelo día 1 · SERIAL (un solo dueño)
Verifica git branch primero. Infra = UN dueño a la vez.
Objetivo: dejar arriba y probado en vivo lo que van cerrando N/P/D (nada local sin subir).
Alcance: VPS Easypanel 187.77.16.63 · n8n · Supabase. Deploy de siat-service + puerta; n8n workflows agentes (recordatorios/cobrador/radar) + intake WhatsApp; provisioning Supabase por tenant.
Depende de: código N/P/D en main · S3 (secret intake n8n) · S6 (token WhatsApp) para envío real. NO desplegar runtime de agentes en vivo hasta D2 en main + S6.
Gate: servicios arriba y probados EN VIVO (no solo commiteado). n8n VPS: nada de $env, usar Credentials.
```

```
[CARRIL I · research-estrategia] Paralelo día 1 · NO codea
Verifica git branch primero (worktree onia-hermes).
Objetivo: cerrar los [VERIFICAR] que gatean venta y decisión, con fuentes citadas.
Carpeta: hermes-content/docs/research/**.
Scope: (1) cerrar §2.3 — a qué grupo SIAT pertenece el piloto (define si el gatillo 30-sep-2026 es hoy o inminente), tasa no-show/atrición odontológica Bolivia, penetración WhatsApp, ticket odontológico en Bs. (2) insumos para S1 (precios). (3) go/no-go candidato a 2do vertical. NO codear.
Gate: decisión escrita con fuentes citadas; NO inventar cifras — marcar UNKNOWN lo que no se pueda fundamentar.
```

---

## 7. Definición de "HECHO" del MVP

El MVP está **HECHO** cuando, **en la realidad y no en demo**, se cumplen TODOS:

1. **1 clínica dental real (con NIT propio)** entra por la puerta única → elige rubro dental → se le crea la cuenta (ONIA ID) → opera en DentalGest (agenda + cobro reales cargados por ella).
2. Emitió **≥1 factura electrónica SIAT válida en producción** contra su NIT: CUF/CUFD/QR/leyenda, **aceptada estado 908 (validada) por el SIN**.
3. **≥1 agente** (Recall o Cobrador) corrió sobre su data real y dejó **≥1 sugerencia en `/pending` que el dueño aprobó**.
4. El cliente **PAGÓ el primer mensual en Bs** (cobro a mano).
5. Ni `main` de onia-hermes ni el deploy de DentalGest se rompieron en el proceso.

**Métrica de HECHO = "1 clínica pagando + 1 factura SIAT prod validada + 1 agente aprobado".** NO es "storefront live", NO es "N módulos activos", NO es "core adoptado". Si el número de clínicas que pagan es 0-2, toda conversación de "plataforma" (capa B, 2do vertical, billing) es prematura por definición.

**Camino más corto a "vendible":** H1→H2→H5 (código puro, sin bloqueo humano, en paralelo con N-specs y research) = **demo vendible en piloto**. H3→H4→H6→H7 (gateados por S2/SEPREC/S1) = **cliente pagando legal**.
