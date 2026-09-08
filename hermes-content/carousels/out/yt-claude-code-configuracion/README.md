# Video 2 — "Configuración básica y skills"

**La fuente de verdad es [`deck.html`](deck.html).** Autocontenido (logo y fuentes en
base64), 13 láminas, 1920×1080. Los PNG salen de ahí; no se editan a mano.

Video 1 (qué es Claude y Claude Code): `../yt-claude-vs-claude-code/`.

## 🔴 Esto es un tutorial: la gente va a copiar los comandos

Todo lo que el deck afirma está **medido en la máquina de Sergio Urcullo el 2026-09-07**,
no recordado. Un comando inventado acá le rompe el día a un desconocido.

| dato en pantalla | cómo se verificó |
|---|---|
| `npm install -g @anthropic-ai/claude-code` | `npm ls -g` → así está instalado |
| `claude --version` → `2.1.221 (Claude Code)` | corrido en vivo |
| Node v24 | `node --version` → v24.13.0 |
| 197 skills personales | `ls -d ~/.claude/skills/*/` |
| 36 skills del proyecto | `ls -d .claude/skills/*/` |
| 9 plugins | `ls -d ~/.claude/plugins/cache/*/` |
| Una skill = `SKILL.md` con `name` + `description` | leído de las 36 skills reales del repo |

**Si pasa tiempo y se regraba, estos números se vuelven a contar.** Un número heredado
en un tutorial envejece mal y nadie lo nota hasta que un comentario lo marca.

## Las 13 láminas

| # | tramo | qué carga la explicación |
|---|---|---|
| 1 | Hook | hay dos caminos, ninguno difícil |
| 2 | Qué necesitás | plan pago **dicho de entrada**; Node solo para la terminal |
| 3 | **Las dos formas** | comparativa app vs terminal — acá el espectador elige |
| 4 | Opción A · la app | los 3 pasos, sin un solo comando |
| 5 | Opción B · la terminal | los dos comandos, con la versión real de salida |
| 6 | Entrar y pedirle algo | el permiso — igual por los dos caminos |
| 7 | La memoria | `/init` y el CLAUDE.md que queda |
| 8 | **CLAUDE.md vs skill** | comparativa de 4 filas — la lámina que se pausa |
| 9 | Qué es una skill | el archivo real, con su frontmatter |
| 10 | Tu primera skill | las dos formas de que aparezca |
| 11 | Mi caso | 197 · 36 · 9 |
| 12 | La parte honesta | los tres errores que cometió él |
| 13 | Cierre | la plantilla vacía + CTA |

## Decisiones de contenido

- **El precio va en la lámina 2, no al final.** Que alguien llegue al minuto 4 y recién
  ahí se entere de que necesita un plan pago es la forma más rápida de perder un
  suscriptor y ganar un comentario enojado.
- **No se nombra ningún precio exacto de plan barato.** Solo el que Sergio Urcullo paga
  (200 USD, de `ONIA_ESTRATEGIA_DE_EMPRESA.md` §8.1). Un precio mal dicho en un tutorial
  se lo cobran en comentarios.
- **La skill de ejemplo es `propuestas`**, con reglas reales suyas (precios de
  `pricing.ts`, nunca HTML a mano). Es corta, verdadera y se entiende sin contexto.
- **Se muestran los DOS caminos, app y terminal.** Claude Code no es solo la terminal:
  hay app de escritorio para Windows y Mac — de hecho es donde Sergio Urcullo trabaja.
  Mostrar solo la terminal espanta a la mitad de la audiencia en el minuto uno.
- **Node dejó de ser "requisito" a secas.** Lo es SOLO del camino por terminal. Dicho mal
  manda a instalar algo a alguien que no lo necesita, que en un tutorial es peor que
  callarlo.
- **Las dos columnas de las comparativas pesan igual.** El gris del deck 1 marcaba un lado
  menor (Claude frente a Claude Code); acá app y terminal son equivalentes, y pintar una
  en gris decidía por el espectador sin que nadie lo hubiera decidido.
- **La lámina 12 usa sus propias reglas** — un objetivo por sesión, revisar el diff, y
  "una regla sin su historia se desobedece" — que salieron de romper algo de verdad.

## Rehacer los PNG

```bash
for n in $(seq 1 11); do
  chrome --headless --window-size=1920,1080 \
    --screenshot="lamina-$(printf %02d $n).png" "deck.html?limpio#$n"
done
```

Si editás el texto del deck y hace falta reincrustar los assets: `python incrustar-assets.py`.

## Pendiente para el video 3

Quedó fuera a propósito, para no convertir esto en dos horas: subagentes, hooks, MCP,
plugins y el `/init` sobre un proyecto que ya existe.
