# Web Factory Pattern Bank 2026

Last research pass: 2026-06-24

Purpose: turn design inspiration into repeatable ONIA Web Factory decisions. This is not a swipe file for copying pages. It is a pattern bank for choosing sections, visual language, assets and implementation route by business type.

## Operating Rule

Every client site must answer four questions before visual work starts:

1. What does this business sell?
2. What action should the visitor take?
3. What proof makes the visitor trust the business?
4. What visual asset makes the offer feel real?

If the answer is weak, do not hide it with animation. Fix the message, scope or asset request first.

## Research Sources

Use these sources as structural research. Do not copy code, copy, screenshots, brand identity or proprietary assets unless the license and client rights are confirmed.

| Source | Use | Policy |
|---|---|---|
| Lapa Ninja | Broad landing references by category, full-page rhythm and section order | Inspiration only |
| Landbook | Current hand-picked websites, ecommerce, portfolio, pricing, case study and product pages | Inspiration only |
| Landingfolio | Landing inspiration, components and template direction | Inspiration only |
| SaaSFrame | SaaS landing page patterns, hero, social proof, pricing and mobile-first CRO | Inspiration only |
| SaaS Landing Page | SaaS page sections: landing, pricing, features, testimonials, FAQ and contact | Inspiration only |
| Awwwards | High-end art direction, motion, typography and experimental interaction | Inspiration only, high risk for overdesign |
| Recent | Daily recent design references, websites, OG images, app screenshots and skill references | Inspiration only |
| Mobbin | Real product flows, app UI, copywriting and UX patterns | Reference for flows, not landing visuals |
| shadcn/ui | Base component architecture and ownership model | Approved base after local review |
| Tailwind CSS v4 | Utility system, theme variables, dark mode and responsive implementation | Approved technical source |
| Motion | Scroll-triggered, scroll-linked and accessible motion patterns | Approved technical source |
| web.dev Web Vitals | Performance targets and validation discipline | Approved technical source |

Automation note: the 2026-06-24 smoke test passed automated harvest for
Landingfolio, SaaSFrame, SaaS Landing Page, Awwwards, Recent and Mobbin.
Landbook returned 403/Cloudflare in Playwright, so use it manually until access
is solved. Smoke artifact:
`web-factory/data/references/design-sources/gallery-examples/2026-06-24-new-sources-smoke.json`.

## Skill Routing

Use this routing before substantial Web Factory design work:

| Situation | Skill route |
|---|---|
| Landing, portfolio, redesign | `web-factory-design-director` -> `design-taste-frontend` -> `ui-ux-pro-max` -> `impeccable` -> browser QA |
| Ecommerce, catalog, PDP, cart | `web-factory-design-director` -> `web-factory-visual-intake` -> `web-factory-commerce-storefront` -> `ecommerce-motion-retention` -> `impeccable` -> browser QA |
| Dashboard, CRM, internal app | `frontend-ui-engineering` or product UI skill -> `ui-ux-pro-max` -> `impeccable` -> browser QA |
| Visual references from Sergio | `web-factory-visual-intake` first, then save notes under `web-factory/data/references/visual/<slug>/` |
| Motion-heavy hero or scroll story | `design-taste-frontend` + Motion docs, then reduced-motion review |

Do not load every design skill for every page. Pick the route by business type and page goal.

## Universal Quality Bar

- The first viewport must show the business, offer and next action.
- No generic centered hero over abstract gradient unless the brief truly requires it.
- One primary CTA intent per page.
- Use real images or generated assets with clear purpose. Text-only marketing pages are incomplete.
- No fake metrics. Use real proof or omit the number.
- One accent color system per page unless a deliberate brand system says otherwise.
- Use section diversity: across 8 sections, use at least 4 layout families.
- Mobile first: nav, CTA, form and key proof must be usable on a phone.
- Motion must guide attention, explain sequence or provide feedback. Decoration-only motion is cut.
- Respect reduced motion and Core Web Vitals.

## Asset Request Rule

Ask Sergio or the client for images/video when the site depends on trust, proof or inspectable product detail.

Generate images or video only when:

- The client has no usable visual assets.
- The asset is conceptual, illustrative or product-adjacent, not fake evidence.
- There is no real person's identity or regulated claim being fabricated.
- The asset can be labeled internally as generated and replaced later by client material.

Do not generate fake testimonials, fake before/after health results, fake engineering projects, fake food photos for a menu item, fake official-brand proof, or fake customer logos.

Priority visual assets by site type:

| Site type | Required visual assets |
|---|---|
| Ecommerce/catalog | Product packshots, lifestyle or use photos, product video loop, category images |
| Engineering/construction | Real project photos, site photos, plans, team/equipment, certifications |
| Clinic/health | Professional portrait, clinic room, treatment context, credentials |
| Restaurant/food | Real dish photos, short kitchen/service video, menu photos |
| Local service | Technician/equipment photos, vehicle/team, service-in-action video |
| Real estate | Property photos, renders, map, floor plan, drone or walkthrough video |
| SaaS/app | Real UI screenshots, short product demo, integration logos |
| Agency/portfolio | Case visuals, campaign images/videos, client logos with permission |

## Section Library

Use these section jobs, then choose the visual pattern that fits the business.

| Section job | What it proves | Good patterns |
|---|---|---|
| Hero | What this is, why it matters, what to do next | Asymmetric split, media hero, product vitrine, authority intro |
| Trust strip | This business is real | Logos, certifications, locations, partners, case count |
| Offer blocks | What the client can buy | Services grid, packages, category cards, use-case tabs |
| Proof | Why believe this | Case study, project gallery, testimonials, before/after only if legal and real |
| Process | What happens after contact | 3-5 verb-led steps, timeline, checklist |
| Product/catalog | What can be selected | PLP, category filters, PDP, cart drawer, quote mode |
| Objection handling | Why now, why safe, what is included | FAQ, warranty, risk notes, payment/terms |
| Conversion | Capture the lead or sale | Form, WhatsApp, booking, quote CTA, checkout |
| Final CTA | Re-state action | Short CTA band with one button |

## Vertical Playbooks

### Agency / Portfolio / Creative Service

Examples inside ONIA: Bench.

Design read: authority, taste, campaign proof, serious but visually alive.

Recommended sections:

1. Hero with strongest positioning and one case visual or video.
2. Client/logo wall with permission.
3. Services by buying intent, not generic capability list.
4. Selected work with 3-6 strong cases.
5. Numbers only if verified.
6. Process from brief to launch.
7. CTA to send brief.

Avoid: vague "we craft experiences", too many decorative reels, fake awards, unlicensed client logos.

Asset needs: campaign screenshots, social reels, client logos, team/studio photo, 10-20 second showreel if available.

### Ecommerce / Catalog / Storefront

Examples inside ONIA: Nuvia, Garabato.

Design read: product-first, fast decision, honest purchase or quote flow.

Recommended sections:

1. Product/media hero with 1-2 featured products.
2. Category or routine guide.
3. Featured products with price or quote state.
4. Catalog portal or separate PLP when product count is high.
5. PDP with media, buybox, quantity, price/quote, accordions.
6. Cart drawer with persisted state.
7. Checkout, BCP flow or honest cotizacion mode.
8. FAQ around delivery, payment, stock and support.

Avoid: turning the landing into the full catalog, repeated product grids, checkout claims without payment integration, copied product images without rights.

Asset needs: clean packshots, lifestyle photos, category images, product videos, brand/legal product claims.

### Engineering / Construction / Industrial

Examples inside ONIA: HSB Engineers.

Design read: technical authority, trust, project proof, clear lead capture.

Recommended sections:

1. Hero with discipline and project type.
2. Authority proof: years, certifications, real clients or project types.
3. Disciplines/services by buyer problem.
4. Project/case gallery with scope, location and result.
5. Safety, compliance or quality systems.
6. Team/equipment if relevant.
7. Consultation form routed to CRM.
8. FAQ around timelines, bidding, documentation and site visits.

Avoid: glossy startup style, fake 3D renders, invented project stats, overexperimental motion.

Asset needs: project photos, site visits, plans, machinery, team, certifications, client-approved case data.

### Clinic / Health / Professional Care

Examples inside ONIA: DentalGest landing, Lia Albertengo.

Design read: calm trust, credentials, appointment conversion, patient clarity.

Recommended sections:

1. Hero with practitioner/clinic photo and appointment CTA.
2. Credentials, specialties and who it helps.
3. Services/treatments grouped by patient problem.
4. Process: evaluation, plan, treatment, follow-up.
5. Patient education or resources.
6. Reviews only if real and approved.
7. Booking/contact with minimal fields.
8. FAQ with disclaimers where needed.

Avoid: fake medical claims, fake before/after, generated doctor portraits pretending to be real, visual clutter.

Asset needs: real portrait, clinic photos, treatment context, service photos, legal disclaimers.

### Local Service / Repair / Installation

Examples inside ONIA: AW Climatizacion.

Design read: fast trust, local availability, clear service request.

Recommended sections:

1. Hero with service, city/coverage and urgent CTA.
2. Official partner/brand proof only if real.
3. Services by customer problem.
4. Coverage map or neighborhoods.
5. How quote/visit works.
6. Seasonal offer if real.
7. WhatsApp/form with qualifying questions.
8. FAQ on price range, warranty and timing.

Avoid: hiding contact, generic stock technicians, claiming official representation without proof, overloaded service lists.

Asset needs: technician/equipment photos, vehicle/team, product brand permission, service videos.

### Restaurant / Food / Cafe

Design read: sensory, simple, mobile ordering first.

Recommended sections:

1. Food-first hero with real dish photo/video.
2. Top 3-6 menu items, not entire menu in hero.
3. Ordering path: WhatsApp, delivery, reservation or pickup.
4. Hours, location and map.
5. Social proof/reviews.
6. Menu categories or PDF/online menu.
7. Promotions only if current and maintained.

Avoid: fake dish photos, overdesigned menus, hidden hours, no location context.

Asset needs: hero dish, menu item photos, short service/kitchen video, storefront photo.

### Real Estate / Property / Architecture

Design read: visual proof, location, availability, qualified inquiry.

Recommended sections:

1. Property/project hero with real render/photo.
2. Location and value proposition.
3. Gallery, units/plans and amenities.
4. Availability or quote state.
5. Neighborhood map.
6. Financing or reservation process if real.
7. Lead form with budget/timeframe.

Avoid: fake availability, overpromising ROI, generic luxury copy.

Asset needs: renders/photos, drone, floorplans, map, walkthrough video.

### Education / Course / Event

Design read: outcome, date, credibility, sign-up flow.

Recommended sections:

1. Hero with outcome and date.
2. Who it is for.
3. Curriculum/agenda.
4. Instructor/speaker proof.
5. Price, seat count or application flow.
6. Testimonials or alumni proof.
7. FAQ and registration CTA.

Avoid: inflated income promises, unclear date, too much syllabus detail above CTA.

Asset needs: instructor photos, venue/course visuals, short invitation video.

### SaaS / AI / App

Design read: product proof, clarity, interactive demo, security/trust.

Recommended sections:

1. Hero with concrete job-to-be-done.
2. Real product screenshot or demo video.
3. Use cases by role.
4. Integration/security proof.
5. Feature narrative, not feature dump.
6. Pricing or demo CTA.
7. FAQ and final CTA.

Avoid: abstract AI glow, fake dashboards, vague automation claims, screenshots made of divs.

Asset needs: real app screenshots, demo video, integration logos, security notes.

### Dashboard / Analytics / Internal Tool

Design read: status at a glance, dense but legible, action over decoration.
Density is a feature here, not a flaw; the win is understanding state in seconds
and being able to filter or act without friction.

Recommended sections:

1. KPI overview row: 4-6 metrics with value, delta and period context.
2. Chart grid: 2-3 charts, one insight each, with title, unit and legend.
3. Data table: sort, filter, pagination, plus explicit loading and empty states.
4. Filter bar that controls the whole view, not one widget.
5. Optional app shell with side navigation and account/context switcher.
6. Row actions with confirmation on anything destructive.

Avoid: KPI cards with no hierarchy, decorative charts with no insight, tables
with no loading/empty state, fake data mistaken for approved data, motion for
its own sake.

Asset needs: approved metrics/series or a signed-off mock, KPI definitions with
units and periods, brand mark for the shell, state iconography.

License-clear sources (see design intelligence doc): Tremor (Apache-2.0),
Tabler (MIT), shadcn/ui charts + dashboard-01 (MIT), Hugging Face Spaces
(per-Space, review required). Extract structure and component taxonomy; never
copy identity, proprietary data or assets.

### Legal / Finance / Consulting

Design read: restraint, clarity, authority, low-risk conversion.

Recommended sections:

1. Hero with problem and credibility.
2. Areas of practice/service.
3. Process and expected deliverables.
4. Team credentials.
5. Case notes anonymized when needed.
6. Compliance/privacy notes.
7. Booking/contact with qualification.

Avoid: aggressive sales tone, fake guarantees, flashy motion, weak privacy language.

Asset needs: professional portraits, office photo, credential proof, approved case summaries.

## Page Recipes

### Fast Landing

Use for one offer or campaign.

Sections: hero, trust/proof, offer, process, FAQ, CTA.

Best for: health professional, course, service promo, product launch, audit offer.

### Web Pro

Use for authority and SEO.

Sections: hero, trust, services, cases, process, team/about, FAQ, contact. Add subpages when services, cases or SEO topics need room.

Best for: engineering, agency, consulting, clinic, local service.

### Catalog / Store

Use for product sales.

Sections: campaign landing, catalog PLP, PDP, cart, checkout/quote, support FAQ.

Best for: cosmetics, food products, merch, tools, retail.

### CRM Capture Site

Use when the website is part of a sales system.

Sections: hero, qualification CTA, services, proof, form, CRM states, follow-up expectations, FAQ.

Best for: engineering, clinics, B2B service, high-ticket local services.

## Visual Direction Matrix

| Rubro | Visual language | Density | Motion |
|---|---|---:|---:|
| Agency/portfolio | Editorial, bold type, campaign media | 4 | 6 |
| Ecommerce beauty | Product-first, editorial, clean media | 5 | 5 |
| Engineering | Technical, sober, documentary | 6 | 3 |
| Clinic/health | Calm, clean, high trust | 4 | 2 |
| Local service | Practical, local, fast CTA | 6 | 3 |
| Restaurant | Sensory, photo-led, warm but not generic | 4 | 4 |
| Real estate | Cinematic, gallery-led, map/context | 5 | 5 |
| Education/event | Clear, energetic, schedule-led | 5 | 4 |
| SaaS/AI | Product proof, structured, interactive | 5 | 5 |
| Legal/finance | Conservative, high contrast, credible | 5 | 2 |

## Current Trends Worth Using Carefully

- Bold typography: useful when the message is strong. Not a license for oversized unreadable heroes.
- Bento grids: useful for grouped product/service proof. Must include visual variation, not six text cards.
- Micro-interactions: useful for buttons, cards, forms and reveals. Must support reduced motion.
- Glass/translucent layers: useful for premium or app-like surfaces. Do not use where contrast or trust is fragile.
- Mobile-first: every Web Factory template must assume WhatsApp/social traffic.
- Personalization and funnels: useful for forms, quizzes and ad-specific pages, but only when ONIA can maintain the variants.
- AI-assisted visuals: useful as placeholders or concept art. Do not fabricate proof.

## Pre-Ship Checklist

- [ ] Design read declared by rubro and audience.
- [ ] Primary CTA appears in hero and final section with the same intent.
- [ ] Real or generated asset plan exists.
- [ ] No copied third-party code, copy, imagery or identity.
- [ ] Section order matches page recipe.
- [ ] Mobile nav, CTA, form and media are tested.
- [ ] Motion has reduced-motion fallback.
- [ ] LCP, INP and CLS targets are considered before large video/image choices.
- [ ] Client risks are visible: payment, WhatsApp, legal claims, credentials, stock, delivery or approvals.
