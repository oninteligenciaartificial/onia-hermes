# Prompts de carriles — una-app Onia (para despachar desde Onia Core)

> Estructura que gobierna: `ONIA_C0_ESQUELETO_MAESTRO_20260723.md` + `ONIA_ARRANQUE_UNA_APP_20260723.md`.
> **Orden de despacho:** C0 aprobado → **C1 primero** (su merge a `main` habilita C2/C3) → apenas C1 en `main`: **C2 (serial) · C3 · C5** → **paralelos día 1 e independientes de C1: C4 · C6 · C7**.
> Cada carril: 1 sesión = 1 worktree = 1 rama = 1 carpeta/repo. Cadencia dura: **estructura primero → STOP → build → gates → merge → y PARÁ** (no avanza a otro carril sin nuevo aviso).

---

## C1 · Shell de plataforma (repo app) — ARRANCA PRIMERO

```
[CARRIL C1 · Shell de plataforma] — repo app (DentaGest)
Cadencia: PRIMERO estructurá tu plan de implementación del carril y PARÁ para aprobación. Recién aprobado, construí. Al terminar: gates + merge + avisá, y PARÁ (no avances a otro carril).
Verificá git branch primero (git branch --show-current). Repo: C:\dev\proyectos\DentaGest\dental-saas. Leé el spec que manda: hermes-content/docs/ONIA_C0_ESQUELETO_MAESTRO_20260723.md (§2 y §6) + ONIA_ARRANQUE_UNA_APP_20260723.md.
Objetivo: construir la capa fina de plataforma (rubro + entitlements + resolver) SIN cambiar nada visible del modo dental.
Scope cerrado:
- Migración aditiva a Organization: verticalTrackId (default "dentagest-clinical") + countryCode/currencyCode/taxIdType/locale + tabla OrganizationEntitlement (§2.1). Backfill de orgs existentes al track dental. NO tocar columnas existentes.
- lib/platform/**: types.ts (AccountContext, FeatureKey, VerticalTrackId), vertical-pack.ts (resolveVerticalPack, datos de data/onia-core/vertical-packs.json + scripts/sync-onia-core.mjs), entitlements.ts (enabledFeatures + legacyBooleanFeatures + hasFeature), provisioning.ts (provisionOrganization §2.5), getAccountContext() extendiendo getTenantProfile.
- Contratos §6 exportados y estables: getAccountContext / resolveVerticalPack / hasFeature / requireFeature / <FeatureGate> / getNavForPack.
- Nav ruteado por el pack dental detrás del flag PLATFORM_LAYER (activar el 2º arg ya reservado en filterNavItems). El pack "dentagest-clinical" produce nav/marca/labels IDÉNTICOS a hoy.
- Cargar skill impeccable + galería/tokens web-factory ANTES de tocar UI.
Qué NO hacer: SIAT, agentes, add-ons (son C2/C3). No quitar Profile.userId @unique (multi-org es P1 diferido).
Gate/hecho: contratos §6 estables; app dental BYTE-IDÉNTICA (snapshot test del nav = lista actual + visual regression del sidebar sin diff); tsc --noEmit verde; suite verde; PLATFORM_LAYER on con rollback probado (flag off = ruta de hoy). Entra a main como árbol coherente que compila. Su merge a main HABILITA C2/C3.
```

## C2 · Vertical dental — SIAT + agentes (repo app + integrations/siat) ⭐ RUTA CRÍTICA

```
[CARRIL C2 · Vertical dental — SIAT + agentes] ⭐ RUTA CRÍTICA. Cadena SERIAL de 4 eslabones (uno tras otro).
Cadencia: estructurá tu plan → STOP → build → gates → merge, y PARÁ.
Verificá git branch primero. Repo app: C:\dev\proyectos\DentaGest\dental-saas. Requiere C1 YA en main (usa AccountContext/FeatureGate). Leé C0 §3.1 (SIAT), §3.2 (agentes), §4 (seam país). Skill onia-contabilidad-bolivia.
Objetivo: que la app dental emita factura SIAT legal y muestre agentes que actúan, demoables.
Scope cerrado (4 eslabones seriales):
1. Migrar Invoice bespoke → OniaInvoicingInvoice (campos cuf/cufd/cuis/controlCode/qrUrl/legend) detrás del flag SIAT_EMISSION; bespoke vivo hasta corte.
2. lib/fiscal/siat-client.ts (emitInvoice, §3.1) que llama al siat-service → persistir cuf/qr/authNumber; render QR + leyenda en print/invoice/[id]. NO reescribir el emisor (hermes-content/integrations/siat) — solo exponerlo como endpoint y llamarlo.
3. Portar módulo agents (tablas onia_agents_{agents,runs,actions} + lógica) + runtime Recall+Cobrador vía routeAction → cola /pending (drafts, SIN envío real). Guardrails duros del §3.2.
4. Última milla UI: form crear alerta médica, collab en pantalla de factura, SavedViewSelector en más listas.
Qué NO hacer: shell/entitlements (es C1), add-ons (C3), reescribir el emisor SIAT o el CUF. No mergear parcial.
Depende de: C1 en main · S2 (NIT/creds SIAT piloto) para CUF real en producción (sin S2 = mock verificado vs Anexo Técnico) · S6 (envío WhatsApp; la demo con drafts NO lo necesita).
Gate/hecho: factura de piloto emitida (CUF real con S2; mock verificado sin él) + print con QR; Recall+Cobrador dejan ≥1 sugerencia aprobable en /pending (e2e); dry-run + backup antes de tocar datos de piloto; entra a main como árbol coherente que compila.
```

## C3 · Add-ons como módulos (repo app + Web Factory)

```
[CARRIL C3 · Add-ons como módulos] — repo app + Web Factory
Cadencia: estructurá tu plan → STOP → build → gates → merge, y PARÁ.
Verificá git branch primero. Requiere C1 en main (usa entitlements + <FeatureGate>). Leé C0 §1.4, §3.3, §6.
Objetivo: chatbot IA, web y presencia como módulos ENCENDIBLES por cuenta, invisibles si están off.
Scope cerrado: addon.chatbot (rol soporte: recibe WhatsApp vía intake §3.3 y PROPONE respuestas como acciones de agente → /pending, NUNCA contesta al tercero sin aprobación) · addon.web (integración a Web Factory) · presencia. Cada uno gated por su entitlement.
Qué NO hacer: billing self-serve ni provisioning automático (anti-trampa). NO editar navigation.ts directo: registrá tu NavModule con requiresFeature vía el pack-registry de C1.
Depende de: C1 en main · S6 (token WhatsApp para chatbot real; sin él se construye la lógica y queda gated).
Gate/hecho: cada add-on aparece SOLO con su entitlement activo; una cuenta dental sin el add-on no ve ningún cambio; tsc/e2e verdes.
```

## C4 · Sala de agentes / onia-center (repo DISTINTO)

```
[CARRIL C4 · Sala de agentes (onia-center)] — repo DISTINTO (onia-hermes/web-factory). Paralelo día 1.
Cadencia: estructurá tu plan → STOP → build → gates → merge, y PARÁ.
Verificá git branch primero. Carpeta: web-factory/apps/site/src/app/onia-center/** + api/onia-center/**. Leé C0 §3.2 (opera la misma cola vía bridge/pending).
Objetivo: el cockpit INTERNO de ONIA para operar/aprobar la cola de agentes y ver los agentes vivos.
Scope cerrado: continuar el rebuild del monolito a componentes chicos (~100-200 líneas c/u) al lado de prod, reusando lib/onia-center-store + api/onia-center; swap al final. Conservar agentes Vendedor/Día + cola de aprobación.
Qué NO hacer: rediseñar el monolito de 14k líneas en su lugar. La superficie del CLIENTE es /pending dentro de la app; esto es el cockpit interno de ONIA, NO se fusiona con el repo de la app.
Gate/hecho: rebuild swap; tsc --noEmit verde en apps/site; conserva Vendedor/Día + cola.
```

## C5 · Infra / deploy (SERIAL, un solo dueño)

```
[CARRIL C5 · Infra / deploy] — SERIAL, un solo dueño.
Cadencia: estructurá tu plan → STOP → build → probar EN VIVO, y PARÁ.
Verificá git branch primero. Infra: VPS Easypanel 187.77.16.63 · n8n · Supabase. Leé C0 §3.1 (endpoint SIAT), §3.2/§3.3 (workflows).
Objetivo: dejar arriba y probado EN VIVO lo que van cerrando C1/C2/C3 (nada local sin subir).
Scope cerrado: deploy de la una-app (app.<dominio>) + del siat-service (borde HTTP del §3.1); migraciones Supabase por entorno sin downtime del modo dental; n8n workflows de agentes (recordatorios/cobrador/radar) + intake WhatsApp. n8n VPS = TODO por Credentials, cero $env.
Qué NO hacer: desplegar el runtime de agentes en vivo hasta que C2 esté en main + exista S6.
Depende de: código C1/C2/C3 en main · S3 (secreto intake n8n) · S6 (token WhatsApp).
Gate/hecho: servicios arriba y probados EN VIVO (no solo commiteado).
```

## C6 · Presencia + venta — ARTUR (carpeta DISTINTA)

```
[CARRIL C6 · Presencia + venta] — ARTUR. Paralelo día 1. Carpetas aisladas.
Cadencia dura: cuando termines ESTE paquete → gates + commit en tu rama + avisá a Sergio con el link/deploy — y PARÁ. No avances a ningún otro trabajo ni toques otra carpeta hasta nuevo aviso. Nada de "ya que estoy toco esto otro".
Verificá git branch primero. Dos entregables aislados:
(a) Landing embudo de DentalGest — carpeta web-factory/apps/dentalgest-landing/ (app nueva propia, deploy propio). Hero + qué resuelve (factura SIAT + agenda + cobro + agentes) + 3 planes en Bs (placeholder hasta S1) + screenshots del sistema real + CTA WhatsApp click-to-chat (gratis) + footer. La landing ENTRA a la misma app (botón → app.<dominio>). Cargar skills impeccable + galería/tokens web-factory antes de codear; exigir ≥4 Required Qualities. Responsive + light/dark.
(b) Sales kit — carpeta hermes-content/sales-kit/ (contenido, cero código): one-pager de la oferta en Bs, screenshots/recording del sistema (agenda, factura, /pending) SIN gasto en plataformas de video, guion de demo 5-7 min, scripts WhatsApp para re-abrir warm leads, checklist de objeciones ("muy pequeños"/"muy básico"). Consistente con skill onia-propuestas + las 9 reglas de propuestas de CLAUDE.md.
Qué NO hacer: tocar apps/site, el repo DentaGest, ni los 4 raíz de web-factory. No generar video con créditos pagos (Higgsfield/fal) sin OK de Sergio. No inventar cifras de clientes. No prometer SLA.
Gate/hecho: landing publicada apuntando a la app (tsc verde en su app, responsive 375/768/1440, ambos temas); kit completo revisado contra las 9 reglas.
```

## C7 · Research fiscal (NO codea)

```
[CARRIL C7 · Research fiscal] — NO codea. Paralelo día 1.
Cadencia: estructurá tu plan → STOP → entregá la decisión, y PARÁ.
Verificá git branch primero. Carpeta: hermes-content/docs/research/**. Skill onia-contabilidad-bolivia.
Objetivo: cerrar los [VERIFICAR] que gatean venta y precios, con fuentes citadas.
Scope cerrado: a qué grupo SIAT pertenece el piloto (define si el 30-sep-2026 es hoy o inminente), tasa de no-show/atrición odontológica en Bolivia, penetración WhatsApp Bolivia, ticket odontológico en Bs; insumos para S1 (precios); go/no-go del 2º vertical.
Qué NO hacer: codear. No inventar cifras — marcar UNKNOWN lo que no se pueda fundamentar con fuente.
Gate/hecho: decisión escrita con fuentes citadas; alimenta S1 y el pitch.
```

---

## Antes de arrancar C1 — ratificar (STOP del C0 §7.1)

1. Facturación: migrar SOLO facturación a `OniaInvoicingInvoice`; inventario/cobros/contabilidad dormidos.
2. Multi-org diferido: 1 user → 1 org por ahora (multi-local = después).
3. `onia-center` = cockpit interno; superficie del cliente = `/pending` en la app. No se fusionan.
4. Nombres canónicos congelados (tabla del C0).
5. Dominio `app.<dominio>` — config, no bloquea C1; se necesita para C5/C6.
