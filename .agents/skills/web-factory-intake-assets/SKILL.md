---
name: web-factory-intake-assets
description: Use when collecting client data, images, videos, brand assets, references, products, domain/hosting/payment details, legal permissions, or missing resources for ONIA Web Factory intake before generating a website. Produces Web Factory intake JSON, client resource requests, missing-field checklists, and commands for design:auto/factory:build.
---

# Web Factory Intake Assets

## Workflow

1. Check existing local sources before asking Sergio or the client:
   - `web-factory/data/intake-schema.ts`
   - `web-factory/data/clients/<slug>.json`
   - `web-factory/data/clients/<slug>.context.md`
   - `web-factory/apps/site/src/app/onia-center/web-factory/`
2. If the intake does not exist, create or prepare JSON compatible with the schema.
3. Identify missing critical fields before generating a preview:
   - business name, rubro, offer, location, CTA channel
   - visual references and anti-references
   - logo/text mark, colors, typography preference
   - hero image/video or explicit permission to generate/use licensed stock
   - products/services, prices, benefits, proofs and FAQs
   - domain, hosting, payment methods, legal name and asset permissions
4. Ask only for fields that remain missing after local review.
5. Output:
   - intake JSON
   - client resource request message
   - missing-field checklist
   - next command: `pnpm design:auto -- <slug> --template <template> --force` (plantilla según rubro, p. ej. `landing-clinic` para dental; lista en `WEB_FACTORY_TEMPLATES`, `web-factory/data/schema.ts`)

## Gates

- Do not generate a final client-facing web if the client has not approved asset rights.
- Do not invent prices, claims, testimonials, legal data, certifications or payment methods.
- Do not publish, deploy or send to client without Sergio approval.
- If the request is really a system, SaaS, automation or ecommerce backend, escalate scope before quoting.

## References

Read `references/intake-fields.md` when preparing a real client checklist or resource request.
