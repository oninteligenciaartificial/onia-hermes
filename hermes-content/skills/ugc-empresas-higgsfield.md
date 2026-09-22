# Skill: UGC Empresas Higgsfield

Use this skill when Sergio asks Hermes to make UGC ads, client videos, business
ads, product videos, or company marketing videos with Higgsfield.

## Read

- `/root/.hermes/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `/root/.hermes/docs/HIGGSFIELD_CONTENT_USE_CASES.md`
- `/root/.hermes/docs/UGC_CLIENT_VIDEO_PLAYBOOK.md`
- `/root/.hermes/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `/root/.hermes/docs/VIDEO_LAB.md`
- `/root/.hermes/references/higgsfield-content-use-cases.json`
- `/root/.hermes/references/n8n-higgsfield-generation-flow.md`

## Commands

### Crea UGC empresa: <negocio> | <oferta> | <audiencia> | <estilo>

Create a client-safe brief. If a field is missing, infer a safe default and
state the assumption.

### Crea video cliente: <negocio> | <oferta> | <estilo>

Route through:

```bash
video-lab telegram --message "Crea video cliente: <negocio> | <oferta> | <estilo>"
```

### Paquete UGC: <negocio> | <oferta>

Return 3 angles:

- problem/solution
- founder/operator pitch
- review-style ad

## Required Output

- business
- offer
- target audience
- format
- hook
- script
- shot list
- Higgsfield prompt
- safe claims
- forbidden claims
- caption
- next approval command

When Sergio explicitly asks for **UGC de IA**, the output must also include:

- an original AI presenter identity anchor;
- at least one continuity frame with the same identity;
- the presenter's declared role: presenter/explainer, never customer;
- real product inserts and exact edit points;
- identity, motion, voice and negative prompts as separate blocks.

Do not silently reroute an AI-presenter request to Sergio, a founder or an operator.

## Claim Safety

Never invent:

- testimonials
- results
- medical proof
- financial proof
- customer numbers
- before/after results

If proof is missing, use soft language:

- "designed to help"
- "made for"
- "can help"
- "ask for a demo"

## AI UGC that sells (mandatory)

Origin: correction from Sergio Urcullo on 2026-09-21. A generic avatar reading a
feature list is not a developed UGC ad.

- The AI person is an original ONIA presenter, not a fabricated client, employee,
  dentist or testimonial. Write in explainer language: "te muestro", never "desde
  que lo uso" or "en mi clínica".
- The first two seconds name a vertical-specific pain with a money consequence.
- The presenter creates recognition; the product proves the claim. Show real UI for
  at least eight accumulated seconds in a 25–30 second ad.
- Preserve one identity across shots: face, age, hair, clothing, location and light.
  Keep ordinary smartphone flaws; reject beauty-influencer, glossy stock and
  synthetic-avatar aesthetics.
- Burn readable subtitles, cut every 1.5–2.5 seconds and use one CTA.
- Never generate product UI in the image/video model. Composite approved ONIA demo
  captures in post and remove personal data.
- Prepare the complete production package before spend. Query the live Higgsfield
  cost and obtain explicit case-by-case approval before generating video.

## Higgsfield MCP

When the MCP is connected:

1. Use video analyzer for reference videos.
2. Use marketing/UGC generation tool if exposed.
3. Generate one draft first, not ten.
4. Save generated URL and metadata to Video Lab.
5. Ask for review before delivery or publish.

If the MCP is not connected, use the authenticated Higgsfield CLI on the VPS. If
neither route can return a live cost, stop only the paid generation: finish the
script, presenter anchors, shot list, prompts and edit map, and record the exact
authentication blocker. Never estimate a cost and present it as current.

## n8n Reference Router

If n8n is available, use it to prepare the generation package:

- industry use case;
- approved references;
- approved assets;
- script;
- scenes;
- safe claims;
- forbidden claims;
- negative prompt;
- CTA;
- output format.

n8n may remind, route, log and poll jobs. It must not publish, deliver or
contact anyone without explicit approval.

## Response Format

```text
Brief UGC:
Hook:
Script:
Shot list:
Prompt Higgsfield:
Claims seguros:
No decir:
Caption:
Siguiente comando:
```
