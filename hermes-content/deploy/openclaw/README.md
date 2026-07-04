# OpenClaw <-> Hermes: piloto hibrido (spec + runbook)

Estado 2026-07-04: **piloto aislado, no produccion.** Objetivo: usar OpenClaw
como capa de canales+gateway (WhatsApp nativo) y Hermes (36 skills) como cerebro,
apuntando a la LiteLLM que ya corre en el VPS.

Contexto y decision: `docs/ONIA_TOOLING_ASSESSMENT_20260704.md`.

## Por que OpenClaw

OSS MIT, Node, gateway local-first con skills `SKILL.md` + `AGENTS.md` (mismo
patron que Hermes), 24+ canales (WhatsApp, Signal, iMessage, Telegram, Slack...),
DM-pairing de seguridad, sandbox de tools, y modelo configurable (apunta a
LiteLLM). Repo: github.com/openclaw/openclaw.

## Caveat Windows (verificado)

`git clone` de OpenClaw en Windows falla el checkout por rutas con nombres
ilegales en NTFS. **Correrlo en Docker / VPS / WSL, no nativo en Windows.** El
Dockerfile y docker-compose.yml estan en el repo.

## Formato de skill OpenClaw (verificado en docs/tools/creating-skills.md)

Directorio `~/.openclaw/workspace/skills/<name>/SKILL.md` con frontmatter YAML:

```markdown
---
name: kebab-case-name
description: Una linea, < 160 chars, se muestra al agente y en /slash.
---

# Titulo

Cuando el usuario pida X, usar el tool `exec` para correr:

​```bash
node scripts/lo-que-sea.js --arg="..."
​```
```

Casi identico a las skills de Hermes. El port = agregar frontmatter
(name/description) + redactar el cuerpo para que el agente use el tool `exec`
sobre los scripts Node que Hermes ya tiene.

## Apuntar el modelo a LiteLLM (OpenAI-compatible)

LiteLLM expone `/v1` OpenAI-compatible (contenedor en el VPS, :4000). En
`~/.openclaw/openclaw.json`:

```json
{
  "models": {
    "providers": {
      "litellm": {
        "api": "openai-completions",
        "baseUrl": "http://127.0.0.1:4000/v1",
        "models": [{ "id": "claude-opus-4-8" }]
      }
    },
    "defaults": { "model": { "primary": "litellm/claude-opus-4-8" } }
  }
}
```

- API key por env: `LITELLM_API_KEY` (o `LITELLM_API_KEYS` para rotacion).
- Usar el runtime propio de OpenClaw para rutas compatibles: provider/model
  `agentRuntime.id: "openclaw"` (no la harness de Codex).
- Si OpenClaw corre en la red docker del VPS, usar el nombre de servicio interno
  de LiteLLM en vez de 127.0.0.1.

## Ejemplo de port: genera-propuesta (Hermes -> OpenClaw)

Origen: `hermes-content/skills/genera-propuesta.md` (dispara
`node scripts/genera-propuesta.js`). Portado a
`~/.openclaw/workspace/skills/genera-propuesta/SKILL.md`:

```markdown
---
name: genera-propuesta
description: Genera una propuesta comercial ONIA en HTML para un cliente a partir de empresa, industria y necesidad.
---

# Genera Propuesta de Venta ONIA

Usar cuando el usuario pida crear una propuesta o presentacion para un cliente.
Frase gatillo: "Genera propuesta: <empresa> | <industria> | <necesidad>".

Recolecta: empresa (obligatorio), industria o necesidad (obligatorio);
contacto / ciudad / notas (opcional).

Ejecuta con el tool exec en el repo de Hermes:

​```bash
node scripts/genera-propuesta.js \
  --empresa="<empresa>" \
  --industria="<industria>" \
  --necesidad="<necesidad>"
​```

Devuelve la ruta del HTML generado
(hermes-content/propuestas/propuesta-<slug>-<timestamp>.html) y los proximos
pasos. Respeta las reglas de propuestas de CLAUDE.md: niveles diferenciados por
salto de valor, precio de lanzamiento vigente (Landing 790 / Web Pro 1.500), y
nunca mencionar plantillas al cliente.
```

El `exec` corre con cwd = repo Hermes (`/root/hermes` en el VPS). Ese es el unico
ajuste real; el script y su logica de negocio no cambian.

## Pasos del piloto

1. Levantar OpenClaw en Docker (local/WSL o box de prueba), Node 22+/24.
2. `~/.openclaw/openclaw.json` con el provider LiteLLM de arriba + `LITELLM_API_KEY`.
3. `openclaw models list` -> confirmar que `litellm/claude-opus-4-8` aparece.
4. Portar 1 skill (genera-propuesta) al workspace skills; `openclaw skills list`.
5. Conectar 1 canal WhatsApp de prueba (DM-pairing con codigo de aprobacion).
6. Mensaje de prueba: "Genera propuesta: Dental Smile | dental | ordenar citas".
   Validar que devuelve la ruta del HTML.
7. Medir RAM/CPU del daemon. Recien con numeros, decidir placement productivo
   (VPS tras liberar RAM, o box aparte).

## Caveats a resolver antes de produccion

- **Multi-tenant:** OpenClaw es single-user por diseno. Para bots de muchos
  clientes: workspace/agente por cliente en una instancia, o instancia por
  cliente. Decidir topologia en el piloto.
- **Seguridad:** los tools corren en el host para la sesion `main`. Para mensajes
  de cliente/no confiables, usar sandbox (Docker/SSH) y restringir tools por
  sesion.
- **RAM:** otro daemon Node. Ver gate de memoria del VPS en el assessment.
- **Skills sensibles:** publicar/redes/pagos siguen con approval boundaries
  (heredar las reglas de `HERMES_EXECUTION_PROTOCOL.md`).
