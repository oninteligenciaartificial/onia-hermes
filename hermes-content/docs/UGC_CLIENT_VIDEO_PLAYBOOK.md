# UGC And Client Video Playbook

This playbook tells Hermes how to create UGC-style videos for Onia clients and
businesses without making fake or risky claims.

## What UGC Means Here

UGC is a style, not necessarily a real customer testimonial.

It should feel:

- natural
- phone-first
- specific
- conversational
- low-friction

It must not falsely imply:

- a real customer said something if they did not
- a real result happened if it did not
- Sergio personally used a product if he did not

## Required Client Inputs

Minimum:

- business type
- offer
- target audience
- location or market
- style preference

Recommended:

- product/service URL
- price or starting price
- proof
- objections
- brand colors
- forbidden claims
- testimonials if real
- reference videos

## UGC Formats

### Problem/Solution

Use when the audience has a clear pain.

```text
Hook: "If you keep dealing with <problem>, this is the fix."
Problem: show the pain in plain language.
Solution: show product/service.
Proof: show reason to believe.
CTA: ask for one action.
```

### Founder/Owner Pitch

Use when trust matters.

```text
Hook: "We built this for people who..."
Context: why the offer exists.
Mechanism: what makes it different.
CTA: book, message or visit.
```

### Review Style

Use only as scripted review style unless testimonial is real.

```text
Hook: "I wanted to see if this actually helped with..."
Experience: explain what happens.
Result: safe, non-fake benefit.
CTA: try/ask/book.
```

### Local Business Offer

Use for clinics, gyms, restaurants, real estate, services.

```text
Hook: location + pain/offer.
Show: business/service/context.
Reason: why now.
CTA: WhatsApp, booking, visit.
```

### Product Demo

Use for ecommerce and physical products.

```text
Hook: product in action.
Demo: 2-3 benefits.
Objection: price, quality, ease, time.
CTA: buy, DM, link.
```

## Client-Safe Claims

Allowed:

- "designed to help"
- "can reduce manual work"
- "built for"
- "made for"
- "helps you avoid forgetting leads"
- "ask for a demo"

Avoid unless proven:

- "guaranteed"
- "doubles sales"
- "number one"
- "best in Bolivia"
- "customers got X result"
- "doctor recommended"
- medical, legal or financial claims without review

## Prompt Pattern For Higgsfield

```text
Create a vertical 9:16 UGC-style ad for <business>. Offer: <offer>. Target:
<audience>. Style: natural phone video, human, direct, believable, modern,
native social media. Duration: <duration>. Hook: <hook>. Script: <script>.
Show product/service context, natural gestures, clean subtitles, quick cuts
every 3-5 seconds. Avoid fake testimonials, copyrighted logos, third-party
likeness, unrealistic claims, and placeholder text.
```

## Onia Prompt Builder

For better Higgsfield results, build prompts from reusable blocks instead of one
generic paragraph.

Required prompt blocks:

- `business`: what type of business or client this is.
- `offer`: the exact product/service or offer.
- `audience`: one buyer group, not everyone.
- `character`: the ready persona speaking or demonstrating.
- `setting`: the ready scenography where the video happens.
- `hook`: one line for the first 0-2 seconds.
- `scene_flow`: 5-7 visual beats with timestamps.
- `camera_edit`: phone-first, handheld, cuts every 2-3 seconds, close-ups.
- `safe_proof`: visible feature, real process or approved proof.
- `negative_prompt`: no fake testimonials, no fake discounts, no fake scarcity,
  no unapproved logos, no guaranteed results, no private data.

Recommended 15-30s script:

```text
0-2s Hook: interrupt the scroll with one clear promise or curiosity gap.
2-5s Problem: name the pain in plain language.
5-10s Mechanism: show what changes or how the product/service works.
10-18s Demo: show it in use.
18-23s Safe proof/detail: feature, process, routine or approved proof.
23-30s CTA: one action only.
```

Ready characters:

- `practical_friend`: ecommerce, product demos, services, gym.
- `trusted_operator`: clinics, aesthetics, health-safe content, SaaS.
- `local_explorer`: restaurants, tourism, real estate, local discovery.
- `founder_builder`: Onia, Sergio, founders and B2B software.

Ready scenographies:

- `home_kitchen_counter`: everyday products and routines.
- `desk_workday`: software, productivity and useful products.
- `gym_bench`: fitness, bottles, apparel and supplements with safe claims.
- `street_walk`: restaurants, services, local discovery.
- `clean_reception`: clinics, aesthetics and appointment flows.

Language rule:

- Spoken lines and subtitles should be natural Spanish.
- Technical generation prompts can be English to keep camera, editing and
  scene instructions clearer for the model.

## Approval Flow

1. Hermes creates brief.
2. Sergio approves the brief.
3. Higgsfield generates draft.
4. Sergio/client reviews preview.
5. Hermes applies revision notes.
6. Final asset is delivered or published after explicit approval.

## Client Delivery Package

Every delivered client video should include:

- MP4 public/private link
- caption
- hook alternatives
- primary CTA
- usage notes
- approval status
- generation notes

## Pricing/Offer Packaging Idea

Hermes can package client videos as:

- 3 UGC concepts
- 1 selected video
- 2 hook variants
- 1 caption pack
- 1 revision round

For Onia upsell:

- video + landing page
- video + WhatsApp automation
- video + CRM follow-up
- video + weekly campaign report
