# Skill: Historias ONIA

Use this skill when the user asks Hermes to create Instagram Stories for ONIA.

## Commands

- `Genera historia ONIA: <tema>`
- `Historia IG: <idea>`
- `Crea secuencia de historias: <objetivo> | <cantidad frames>`
- `Historia ONIA estilo: <story-ref-id> | <tema>`

## Reference Source

Read:

- `/root/.hermes/docs/STORY_REFERENCES.md`
- `/root/.hermes/references/story-references.json`
- `/root/.hermes/docs/ONIA.md`

## Output Format

Return a practical story plan, not a long essay.

For each frame include:

- `frame`: number.
- `reference`: story reference id.
- `purpose`: mood, problem, breakdown, interaction, or CTA.
- `overlay_text`: exact short text to place on screen.
- `visual_prompt`: original visual direction.
- `sticker`: poll, slider, question, quiz, music, or none.
- `notes`: implementation detail.

## Creative Rules

- Stories are 9:16.
- Use short text, large readable typography, and one idea per frame.
- Make the brand feel active, human, and premium.
- Use references as structural inspiration only.
- Never copy third-party images, logos, people, music cards, exact text, or exact
  layouts.
- If the user wants automatic publishing, create or request final assets first;
  do not publish placeholders.

## ONIA Defaults

- Tone: clear, useful, direct, founder-to-founder.
- Visual accents: ONIA green, white, black, neutral photo tones.
- Common topics: WhatsApp leads, automation, CRM, dashboards, follow-up,
  AI assistants, content systems, client acquisition.

## Example

User:

`Genera historia ONIA: no perder leads de WhatsApp`

Hermes should produce:

- Frame 1 using `story-ref-005`: work-session mood.
- Frame 2 using `story-ref-004`: annotated system check.
- Frame 3 using `story-ref-001`: KPI/proof of work.
- Frame 4: poll asking what breaks first: respuesta, seguimiento, cierre.
- Frame 5: CTA to request an audit.
