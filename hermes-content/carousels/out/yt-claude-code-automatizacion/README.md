# Video 3 — "Que trabaje sin vos"

**La fuente de verdad es [`deck.html`](deck.html).** Autocontenido (logo y fuentes en
base64), 11 láminas, 1920×1080. Los PNG salen de ahí; no se editan a mano.

Cierra la serie: video 1 = qué es · video 2 = cómo se usa · **video 3 = cómo se suelta**.
Y cobra la promesa literal del cierre del video 2: *"lo que hace que trabaje solo"*.

- Video 1: `../yt-claude-vs-claude-code/`
- Video 2: `../yt-claude-code-configuracion/`

## 🔴 Todo medido, nada recordado

Contado en la máquina de Sergio Urcullo el **2026-09-10**:

| dato en pantalla | cómo se verificó |
|---|---|
| 4 hooks | 3 en `~/.claude/settings.json` + el autosync en `.claude/settings.json` del repo |
| 4 subagentes (+7 retirados) | `ls .claude/agents/*.md` |
| 7 conectores MCP | nombres leídos de la config local, sin tocar ningún token |
| 9 plugins | `ls -d ~/.claude/plugins/cache/*/` |
| 4 trabajos por horario | los cron de `nodo-casa` (handoff `onia-dev-node-setup.md`) |
| **3 conectores caídos hoy** | el aviso de arranque de esta misma sesión |

**Los números se recuentan antes de grabar.** Ya pasó con el video 2: la versión de
Claude Code cambió en tres días.

## Las 11 láminas

| # | tramo | qué carga la explicación |
|---|---|---|
| 1 | Hook | cobra la promesa del video 1 |
| 2 | **El mapa** | los 4 escalones — volver acá entre tramo y tramo |
| 3 | Escalón 1 · hooks | los 4 hooks reales, en castellano |
| 4 | Escalón 2 · subagentes | por qué el que revisa no debe ser el que escribió |
| 5 | Escalón 3 · conectores | diagrama: manos fuera de la computadora |
| 6 | El atajo · plugins | no hace falta construirlo para empezar |
| 7 | Escalón 4 · horario | el único que no te necesita |
| 8 | Mi caso | 4 · 4 · 7 · 4, en una PC de escritorio |
| 9 | **La parte honesta** | tres fallas suyas, una en vivo |
| 10 | Las tres reglas | la conclusión útil del video |
| 11 | Cierre | la escalera resumida + CTA |

## Decisiones de contenido

- **La estructura es una escalera de autonomía, no una lista de features.** Cada escalón
  le saca una atadura: que le pidas → que estés libre → que sea en tu compu → que estés
  despierto. Una lista de cuatro cosas sueltas no se recuerda; una escalera sí.
- **La sigla MCP se dice una vez y se sigue con ejemplos.** La lámina 5 se titula
  "conectores": nadie busca "MCP" salvo quien ya sabe qué es.
- **La parte honesta son fallas propias, con su consecuencia.** El hook de cierre que
  publicó 200 líneas antes del código que las usaba (`CLAUDE.md`, §Git), el servicio que
  corrió 3 semanas sin publicar ([[publicacion-postiz-temporal]]), y los 3 conectores
  caídos **hoy**. Un video de automatización que no muestra cómo falla la automatización
  es publicidad.
- **La lámina 9 se puede grabar en vivo:** abrir la lista de conectores y señalar los
  tres caídos, ahí mismo. Es la prueba más barata y la más creíble del video.
- **Nada de slang.** "Al pedo" salió del texto: la audiencia son dueños de negocio y en
  YouTube el lenguaje fuerte cuesta alcance.
- **El techo de gasto va en las reglas, no en la parte honesta.** Es lo único del video
  que le ahorra plata al espectador el primer día ([[hermes-gasto-bajar-no-subir]]: el
  74 % del pico era un solo trabajo mal configurado).

## Rehacer los PNG

```bash
for n in $(seq 1 11); do
  chrome --headless --window-size=1920,1080 \
    --screenshot="lamina-$(printf %02d $n).png" "deck.html?limpio#$n"
done
```

Si editás el texto del deck y hace falta reincrustar los assets: `python incrustar-assets.py`.

## Qué queda fuera

El detalle técnico de cómo se escribe un hook (el JSON, los matchers) y cómo se define un
subagente. Son un video propio, y meterlos acá convierte una explicación en una
documentación leída en voz alta.
