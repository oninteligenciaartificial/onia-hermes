# Publicar — Pasar a Opus 5.5 sin errores 400

- **Cuenta:** `@sergiourcullo` (Instagram). El mismo carrusel en PDF sirve para LinkedIn.
- **Formato:** 1080 × 1350 px · PNG.
- **Orden:** de `slide-01.png` a `slide-08.png`.
- **Estado:** renderizado el 2026-09-25. **Falta que Sergio Urcullo lo mire y lo apruebe**:
  construir y publicar son dos permisos (CLAUDE.md §4).
- **Guion de la tanda:**
  `hermes-content/docs/contenido/piezas/guiones/2026-09-25-opus-5-5-migracion.md` (pieza CAR).
- **Brief:**
  `hermes-content/carousels/briefs/marca-personal/sergio-opus-5-5-errores-400-20260925.json`.

## Qué es real en cada lámina

6 de las 8 láminas llevan una **captura real** de la guía oficial de migración de Anthropic,
tomada el 2026-09-25 en viewport de teléfono y recortada a la frase marcada. Las fuentes y el
texto verificado de cada una están en
`hermes-content/captures/2026-09-25-opus-5-5/carrusel/manifest.json`.

| Lámina | Captura |
|---|---|
| 2 | "Where an item says a setting is rejected, the API returns a 400 error." |
| 3 | `thinking: {"type": "disabled"}` y los presupuestos manuales se rechazan |
| 4 | el mensaje de error literal de `tool_choice` |
| 5 | temperature, top_p y top_k: "any other value is rejected" |
| 6 | el prefill del asistente: "it is rejected" |
| 7 | "Set effort explicitly: the default is medium" |

## Caption

Cambiar sólo el nombre del modelo a claude-opus-5-5 no alcanza: la guía oficial de Anthropic lista configuraciones que Opus 5.5 rechaza con error 400.

1) thinking desactivado o con budget_tokens
2) tool_choice forzado (any / tool)
3) temperature, top_p o top_k distintos del default
4) prefill: terminar los mensajes con un turno del asistente ya escrito

Y la letra chica: el effort por defecto bajó de high a medium. Si no lo fijás, piensa menos que antes.

El atajo en Claude Code: /claude-api migrate this project to claude-opus-5-5. Pregunta el alcance antes de editar y deja la lista de lo que hay que revisar a mano.

Todo verificado el 25-sep contra la guía oficial de migración de Anthropic. Guardalo para cuando migres.

## Hashtags

#claude #anthropic #claudecode #opus #ia #programacion

## Antes de publicar

- [ ] Si pasaron más de 7 días desde el 25-sep, re-verificar la guía: la toma falla sola si el texto
  cambió (`node scripts/contenido/capturar-web.mjs hermes-content/captures/2026-09-25-opus-5-5/carrusel/plan.json`).
- [ ] Sin "comentá X": las palabras clave hoy no disparan nada
  (`hermes-content/docs/contenido/PUBLICACION.md`).
- [ ] No subas `_contactsheet.png`: es sólo una vista previa.

## Cómo se renderizó (y una trampa del entorno)

```bash
CAROUSEL_BROWSER=/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell \
node scripts/carousel_render.js --brief <brief> --out <esta carpeta> --account sergio --pack community-editorial
```

⚠️ **En Linux, con el Chromium completo de Playwright, `--headless=new` deja el área visible 88 px
más corta que la ventana: el pie de cada lámina (el handle y el contador) sale cortado y las
láminas oscuras muestran una franja clara abajo.** Pasó el 2026-09-25 en la sesión de nube. El
`headless_shell` respeta el tamaño exacto. Los carruseles renderizados en la PC de Sergio Urcullo
(Windows) no tienen el problema; se verificó con `sergio-mcp-claude-code-20260921`.
