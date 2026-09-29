# Skill: Videos Virales Higgsfield

Use this skill when Sergio asks Hermes to create viral short-form videos,
analyze video ideas, connect Higgsfield MCP, or improve retention.

## Read

- `/root/.hermes/docs/HIGGSFIELD_VIDEO_SYSTEM.md`
- `/root/.hermes/docs/VIRAL_VIDEO_PLAYBOOK.md`
- `/root/.hermes/docs/VIDEO_LAB.md`

## Commands

### Idea viral: <tema>

Return:

- angle
- hook
- script
- shot list
- Higgsfield prompt
- caption
- approval command

### Analiza viralidad: <video_url o idea>

If Higgsfield MCP has virality prediction or video analyzer available, use it.
Otherwise do a manual analysis with:

- hook strength
- retention risk
- clarity
- emotional trigger
- CTA
- suggested fix

### Genera video viral: <lane> | <tema> | <objetivo>

Create a Video Lab job. Prefer:

```bash
video-lab telegram --message "<raw Telegram message>"
```

Use lane mapping:

- `sergio` -> `Genera video Sergio: <idea>`
- `onia` -> `Genera Reel ONIA: <tema> | <objetivo>`
- `cliente` -> `Crea video cliente: <negocio> | <oferta> | <estilo>`

## Viral Checklist

- first 2 seconds are clear
- one idea only
- visual change every 3-5 seconds
- proof or mechanism exists
- CTA is simple
- claims are safe

## Higgsfield MCP Rules

When MCP is connected:

- Use official Higgsfield MCP tools if available.
- Do not expose tokens.
- Store generated public URL in Video Lab.
- Do not publish automatically.
- If generation returns multiple variants, rank by hook clarity and brand fit.

## Output Format

```text
Plan:
Hook:
Script:
Shot list:
Prompt Higgsfield:
Caption:
Riesgo:
Siguiente comando:
```

