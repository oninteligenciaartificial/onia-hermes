# Video 3 — "Que trabaje sin vos"

**La fuente de verdad es [`deck.html`](deck.html).** Autocontenido (logo y fuentes en
base64), 11 láminas, 1920×1080. Los PNG salen de ahí; no se editan a mano.

Tercero de la serie **Claude Code de cero**: qué es · cómo se usa · **cómo se suelta**.
No la cierra — el mapa completo está en `hermes-content/docs/SERIE_CLAUDE_CODE.md`.
Y cobra la promesa literal del cierre del video 2: *"lo que hace que trabaje solo"*.

- Video 1: `../yt-01-que-es/`
- Video 2: `../yt-02-instalar/`

## 🔴 Todo medido, nada recordado

**Recontado el 2026-09-17** (día de grabación). ⚠️ Dos números CAMBIARON desde el
conteo del 10-sep y el deck ya está corregido: subagentes 4→**3** (el 4 contaba el
`README.md` de la carpeta como agente) y conectores 7→**6** (n8n ya no está en la
config del CLI; vive como conector de la app).

| dato en pantalla | cómo se verificó (17-sep) |
|---|---|
| 4 hooks | 3 en `~/.claude/settings.json` (PreToolUse, PostToolUse, Stop) + el autosync en `.claude/settings.json` del repo |
| **3** subagentes (+7 retirados) | `.claude/agents/`: onia-core-guardian, onia-creative-radar, onia-crm-prospeccion |
| **6** conectores MCP | `~/.claude.json`: image-gen, stitch (globales) + meta_developer_tools, cloudflare, cloudflare-docs, postiz (proyecto) |
| 9 plugins | `ls -d ~/.claude/plugins/cache/*/` → 9, misma lista del 10-sep |
| ~~4 trabajos por horario~~ → **40 en el VPS · 0 en casa** | 🔴 **RESUELTO Y CORREGIDO el 18-sep.** `crontab -l` en el VPS (187.77.16.63) = **40 líneas**, uptime 25 días. El nodo-casa: `casa.sh "crontab -l"` → **`no crontab for compu_pc_casa_sergio`**, vacío. Los 4 loops (web-venta 120 · onia-cola 60 · chatbot-cola 60 · recorrido-cliente 180) están en `/root/.config/onia/loops-*.txt` pero **no instalados en ningún cron**. Y `onia-vigia-loops-remotos.log` está **vacío**: el vigía que debía avisarlo tampoco corrió. WSL local = `Stopped` |
| **4 conectores sin andar hoy** | reconfirmado 17-sep: 2 caídos (image-gen, postiz 502) + 2 sin autorización (cloudflare, meta) |

**Los números se recuentan antes de grabar.** Ya pasó con el video 2: la versión de
Claude Code cambió en tres días. Y volvió a pasar acá: el recuento del **18-sep** tumbó la
afirmación central de la lámina 8 — *"todo eso vive en una PC de escritorio prendida"* era
**falsa**. Lo que corre vive en un VPS alquilado; lo de casa está apagado y sin cron.

🔴 **La lámina 8 del `deck.html` todavía dice el texto viejo.** Hay que regenerarla antes de
grabar (ver "Rehacer los PNG"). El `GUION.md` ya está corregido.

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
| 8 | Mi caso | 4 · 3 · 6 · **40** — y la aclaración de que corre en un VPS pagado, no en casa |
| 9 | **La parte honesta** | **cuatro** fallas suyas, dos en vivo (la 4ª: los loops de casa y su vigía, ambos muertos) |
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
