# Research (Carril I) — Productos ganadores + 3 ventures Onia (2026-07-05)

Investigación con fuentes citadas. No fabricar datos. Decisión, no construcción.

## Parte 1 — Productos ganadores (patrón replicable)

### Halter (agritech NZ) — cercas virtuales por collar
- **Qué:** collares solares GPS para ganado + software de pastoreo; mueve el ganado
  sin alambre. ([Wikipedia](https://en.wikipedia.org/wiki/Halter_(company)), [halterhq.com](https://www.halterhq.com/))
- **Por qué gana:** dolor físico caro y diario resuelto con hardware que se paga en
  labor ahorrada; **suscripción por cabeza/mes (US$5–8 por vaca)** → recurrente que
  escala con el rebaño, no con el cliente; foso = hardware (lock-in) + datos. 1M
  collares, Serie E US$220M a ~US$2B. ([agtechnavigator](https://www.agtechnavigator.com/Article/2025/08/22/whats-behind-halters-hefty-market-value/), [TNW](https://thenextweb.com/news/halter-series-e-virtual-fencing-cattle))
- **Patrón para Onia:** cobrar por **unidad de trabajo recurrente** (por vaca / diente
  / SKU / trámite), no licencia plana. = "cobrar el resultado, no los píxeles".

### Medvi (telehealth GLP-1 EEUU) — el más replicable
- **Qué:** semaglutida 100% online, tarifa plana cash-pay (~US$179→US$299/mes).
- **Por qué importa:** construido con **US$20K + IA, 2 empleados, US$401M ingresos
  2025**. Arquitectura "delgada": terceros ponen médicos/farmacia/compliance; Medvi
  **solo es dueño de la capa cliente** (marca+web+media+checkout+soporte); la IA
  colapsa el costo de operar. ([Forbes](https://www.forbes.com/sites/josipamajic/2026/04/02/ai-and-20000-helped-one-man-build-a-18-billion-telehealth-startup/))
- **Precaución (foso):** admite que **no tiene foso**; cualquiera lo copia, compite
  solo por velocidad; ya recibió carta FDA (feb-2026). ([telecareaware](https://telecareaware.com/ny-times-highly-questionable-but-glowing-and-viral-portrait-of-ai-created-glp-1-e-prescriber-and-marketer-medvi/))
- **Patrón para Onia:** dueño de la relación con el cliente; alquilás la infra
  regulada/física; la IA baja el costo. **Pero el foso hay que fabricarlo** con
  datos propietarios o lock-in de integración.

### Contexto de mercado
Vertical SaaS = US$157B en 2025 (18–22% CAGR, ~2–3× el horizontal; NRR &gt;130%);
las plataformas con IA superan al mercado +8 pts. Nicho + automatización = el vector
que gana hoy. ([Stripe](https://stripe.com/lp/vertical-saas-benchmark-2025), [L40](https://www.l40.com/insights/vertical-ai-saas))

## Parte 2 — 3 ventures (feasibility con el stack actual)

### 1. Importadora automatizada con IA — **PERSEGUIR** (caso 0 = Bolivian Electric)
Ya semi-specada: `onia-core/ONIA_IMPORT_LANDED_COST_MODULE_2026.md` +
`onia-core/ONIA_EXCHANGE_RATE_AUTOPRICING_2026.md` + adapter `bolivian-electric.json`.
- **Wedge angosto:** calculadora de **landed cost + reprecio automático** para UNA
  importadora, disparada por dos shocks reales y fechables: **DS 5646 baja 5 pts del
  arancel desde 06-jul-2026** + **FX flotante diario** (RM 245/2026). Quien reprecia
  a mano pierde margen/ventas.
- **Bridge:** NO hay SQL a TR4; exportan Excel/CSV → n8n normaliza como intake
  (`external_gate` del core, sin fork).
- **Riesgo #1:** datos ajenos frágiles (columnas TR4 = bloqueo S4; tasas con
  vigencias). Riesgo de datos, no de tech.
- **Apoya** ProveeGest + Core (ApprovalRequest/WorkItem/Document). Es el ítem M5.

### 2. Motor de venta diaria — **PERSEGUIR** (es el SO comercial, no venture aparte)
Patrón Medvi aplicado: dueños del funnel, IA colapsa el costo.
- **Embudo:** captación (n8n prospección + contenido H) → demo (Web Factory levanta
  landing por prospecto) → cierre (generador de propuestas) → onboarding (wizard
  /setup de Core + intake n8n).
- **Escala** porque cada paso está productizado; margen en lo recurrente (Cuidado
  Web/GestiOS/videos). **Lo que lo rompe:** tratar cada cliente como custom → forzar
  plantillas + track vertical, nunca forks.
- **Wedge angosto:** **un vertical, un guion, repetido** (DentalGest→dentistas)
  antes de "todo negocio".
- **Riesgo #1:** dispersión — "todo tipo de negocio" mata la repetibilidad y el foso.
- Es el pegamento que monetiza los activos actuales (carriles B+C+H+G).

### 3. Empresa tipo Nuvia — **DESCARTAR como línea propia** → plantilla de Web Factory
- Ya hay DOS Nuvia (template vs app real); operarla como empresa obliga a
  inventario/logística/pagos → sale del modelo "dueños de la capa cliente".
- **Sí** como template de e-commerce reusable dentro de Web Factory (catálogo +
  botón WhatsApp incluido + chatbot IA add-on pago) que alimenta el motor de venta.

## Parte 3 — Orden recomendado
1. **Motor de venta (2) primero** — multiplicador: monetiza Web Factory + propuestas
   + Core que ya existen; esfuerzo bajo (integración), impacto en caja. Sin él, los
   otros ventures no tienen distribución.
2. **Importadora/landed cost (1) en paralelo, caso 0 con Bolivian Electric** — dolor
   fechado (06-jul) + FX diario; ya specado; bridge Excel decidido; genera el primer
   caso vertical defendible con datos propietarios (el foso que a Medvi le falta).
3. **Nuvia (3): no como empresa** — plegarla como plantilla de Web Factory.

**Regla transversal (Halter+Medvi):** cobrar por unidad de trabajo recurrente +
fabricar foso con datos propietarios / lock-in de integración, no competir solo por
velocidad.
