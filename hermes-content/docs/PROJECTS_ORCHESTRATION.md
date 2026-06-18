# Projects Orchestration

Hermes routes ONIA's commercial work across products and services.

Canonical registry:

- `hermes-content/references/onia-projects-registry.json`

Use this doc when Sergio asks what to sell, who to contact, how to position a
project, or how to connect DentalGest, Gesti-OS, websites, Higgsfield marketing
and ONIA consulting/implementations.

## Offers

## Oferta de arranque comercial

Usar estos precios para cerrar clientes reales rapido. Vigencia hasta
2026-07-31 o primeros 20 clientes cobrados:

- DentalGest: Bs. 290, Bs. 490 y Bs. 790/mes por los primeros 3 meses.
- Gesti-OS: Bs. 290, Bs. 490, Bs. 790 y desde Bs. 1250/mes por los primeros 3
  meses.
- Landing: Bs. 990.
- Web Negocio: Bs. 1900.
- Web Pro IA: Bs. 3900.
- Portal o sistema web mini: desde Bs. 7500.
- Video individual: Bs. 290.
- Pack 4 videos IA: Bs. 990.
- Packs mensuales Higgsfield: Bs. 1800, Bs. 3200 y Bs. 5500/mes por los
  primeros 3 meses.
- Auditoria Express: Bs. 250.
- Diagnostico + Plan: Bs. 690.
- Instalacion simple: Bs. 1500.
- Implementacion operativa: desde Bs. 3900.
- Conexion de canal social: Bs. 690 setup.
- Flujo n8n aprobaciones: Bs. 1400 setup.

Regla: precio reservado solo con pago confirmado. Desde el mes 4 en servicios
mensuales se puede pasar al precio vigente avisando antes.

### DentalGest

For dental clinics.

Primary promise:

- organize leads, patients, follow-up, appointments and reminders.

Best channels:

- Instagram/Facebook public profiles;
- LinkedIn;
- email or web form when public;
- Telegram only for internal approval.

Do not use WhatsApp automation until Meta business verification is ready.

Pricing:

- Starter: Bs. 349/mes, sin setup obligatorio.
- Pro: Bs. 590/mes, sin setup obligatorio.
- Clinic: Bs. 990/mes, sin setup obligatorio.
- Onboarding opcional: Bs. 290, Bs. 690 o Bs. 1490.
- Founder offer first 10 clinics: Bs. 290, Bs. 490 and Bs. 790/mes.

### Gesti-OS

For companies with operational disorder.

Primary promise:

- turn clients, tasks, states and reports into one operating dashboard.

Best channels:

- LinkedIn;
- email;
- founder/director content;
- demo video.

Pricing:

- Starter: Bs. 490/mes, sin setup obligatorio.
- Operativo: Bs. 790/mes, onboarding recomendado.
- Pro: Bs. 1290/mes, onboarding recomendado.
- Enterprise: desde Bs. 2490/mes, implementacion cotizada.

### Websites

For businesses without clear digital conversion.

Primary promise:

- web or landing page connected to lead capture and follow-up.

Best channels:

- audit message;
- before/after content;
- mini proposal with one clear improvement.

Pricing:

- Landing Express: Bs. 1490.
- Web Negocio: Bs. 2900.
- Web Pro IA: Bs. 5900.
- SaaS / portal personalizado: desde Bs. 9500.
- Care plan: Bs. 190, Bs. 390 or Bs. 690/mes.

### Higgsfield Marketing

For businesses that need content, ads or UGC.

Primary promise:

- videos that explain the offer and connect to a real CTA.

Best channels:

- sample video brief;
- 3 hook ideas;
- UGC or owner-led content package.

Pricing:

- Video unit: Bs. 450.
- Sprint 8: Bs. 2200/mes.
- Growth 16: Bs. 3900/mes.
- Authority 24: Bs. 6500/mes.
- Performance System: desde Bs. 9500/mes.
- Intro primeros 5 clientes: Bs. 1800, Bs. 3200 y Bs. 5500/mes.

Cross-platform connector setup:

- TikTok API: Bs. 900 setup + Bs. 150/mes monitoring.
- YouTube Shorts API: Bs. 900 setup + Bs. 150/mes monitoring.
- LinkedIn API: Bs. 900 setup + Bs. 150/mes monitoring.
- n8n approval/publishing flow: Bs. 1800 setup + Bs. 350/mes monitoring.

### ONIA Consulting

For businesses that need direction, installation or process improvement before
buying a tool.

Primary promise:

- diagnose what is leaking, decide what to install first, and leave a working
  flow with documentation.

Best channels:

- Sergio founder-led content;
- LinkedIn consultative outreach;
- public email;
- audit-first sales message.

Pricing:

- Auditoria Express: Bs. 250-450.
- Diagnostico + Roadmap: Bs. 790-1200.
- Instalacion Starter: Bs. 1900.
- Implementacion Operativa: Bs. 3900-6500.
- Sprint IA y Video System: Bs. 4900-8500.
- Acompanamiento Consultivo: Bs. 1200-2900/mes.
- Transformacion ONIA: desde Bs. 9500.

Canonical consulting doc:

- `hermes-content/docs/ONIA_CONSULTING_SERVICES_2026.md`

Canonical pricing:

- `/root/.hermes/docs/ONIA_PRICING_2026.md`

## Decision Rule

Choose the offer by strongest pain signal:

- dental clinic -> DentalGest.
- operations in Excel/WhatsApp -> Gesti-OS.
- no site or weak site -> website/landing.
- weak content -> Higgsfield marketing.
- unclear process, tool chaos or "install it for me" -> ONIA consulting.
- unclear -> audit first.

## Approval Boundary

Hermes can research, draft, score, plan, prepare videos and prepare messages.

Hermes cannot contact, publish, deliver to client, use face/voice, or claim
results without explicit approval.

## Telegram Command Center

Use this entrypoint from n8n or VPS:

```bash
hermes-command telegram --message "<mensaje>"
```

Useful commands:

```text
Mapa proyectos ONIA
Orquesta ONIA: <empresa o rubro> | <objetivo>
Prepara venta DentalGest: <clinica>
Prepara venta Gestios: <empresa>
Prepara venta Web ONIA: <negocio>
Prepara marketing Higgsfield: <negocio> | <oferta>
Prepara consultoria ONIA: <negocio> | <dolor o proceso>
```

The response should return the primary offer, likely pain, CTA, recommended
channel, required approval and next action.
