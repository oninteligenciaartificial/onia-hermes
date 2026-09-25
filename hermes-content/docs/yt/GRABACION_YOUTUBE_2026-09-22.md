# Grabación YouTube · sistemas con IA

## Orden recomendado

No grabar tres clases largas seguidas después de siete verticales. La prioridad es que
cada video conserve energía, demostración y claridad.

1. **Hoy, después de los verticales:** `MCP, agentes, loops y n8n: cómo se conectan de
   verdad`. Es el mismo mapa que Sergio Urcullo acaba de ensayar en los videos cortos.
2. **Siguiente bloque:** `n8n paso a paso: clasificá leads sin construir un agente`.
   Requiere tener el workflow limpio y tres payloads de prueba antes de encender cámara.
3. **Tercer bloque:** `HyperFrames desde cero: videos programables con HTML`. Requiere
   capturar terminal, `check --snapshots`, `preview` y el deck en modo `present`.

## Paquetes listos

| Clase | Deck | Guion |
|---|---|---|
| HyperFrames | `carousels/out/yt-07-hyperframes/index.html` | `carousels/out/yt-07-hyperframes/GUION.md` |
| n8n leads | `carousels/out/yt-08-n8n-leads/index.html` | `carousels/out/yt-08-n8n-leads/GUION.md` |
| MCP/agentes/loops | `carousels/out/yt-09-mcp-agentes-loops/index.html` | `carousels/out/yt-09-mcp-agentes-loops/GUION.md` |

Cada `index.html` abre directamente con flechas y botón de notas. Para modo presentador:

```powershell
npx hyperframes present hermes-content/carousels/out/yt-09-mcp-agentes-loops
```

## Control antes de grabar

- El título promete una decisión o construcción que el video realmente entrega.
- Cada afirmación técnica tiene pantalla, comando, nodo, JSON o fuente.
- Datos de prueba ficticios; ninguna credencial o conversación real visible.
- Demo preparada, pero los errores reales se conservan y explican.
- Hook y CTA se repiten en una segunda toma.
- El CTA entrega un recurso que ya existe en
  `docs/recursos/SISTEMAS_IA_PACKS_2026-09-22.md`.

## Control antes de publicar

- Ver el corte completo, no sólo la miniatura.
- Revisar audio, subtítulos, cortes, pantallas y datos sensibles.
- Abrir enlaces y recurso desde otro navegador.
- Confirmar que el comentario prometido se puede responder manualmente mientras no exista
  automatización aprobada.
- Sergio Urcullo aprueba el master; Postiz no publica borradores marcados `REVISAR` o
  `BLOQUEADA`.
