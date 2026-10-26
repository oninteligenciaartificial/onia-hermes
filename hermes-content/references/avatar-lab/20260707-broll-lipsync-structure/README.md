# Estructura de contenido: B-roll + VO + Lipsync intercalado (2026-07-07)

> ⛔ **CORRECCION 2026-08-15:** la fila que dice `wan2_7` para lipsync esta MAL. Sergio:
> "wan 2.7 es malisimo para lip sync". Ver `references/modelos/lucia/LUCIA.md` §3-bis.


Formato definido a pedido de Sergio, comparando su investigacion de herramientas
(Kling, HeyGen, Seedance 2.0, Veo 3) contra lo que ya tenemos en Higgsfield.

## Mapeo herramientas (investigacion de Sergio vs lo que ya tenemos)

| Necesidad (investigacion Sergio) | Herramienta investigada | Lo que ya tenemos en Higgsfield |
|---|---|---|
| Solo movimiento (b-roll) | Kling 2.5 | **Kling 2.6** (mas nuevo, "cinematic motion, advanced physics") o Kling 3.0 — ya en la cuenta |
| Hablar (lipsync) | HeyGen Avatar 5 | `wan2_7` — ya resuelto hoy (fix de dientes), sin plataforma nueva |
| — | Seedance 2.0 | Ya documentado como EVITAR (45-135cr, la mas cara) |
| — | Veo 3 | **CORRECCION 2026-07-07: SI esta en Higgsfield** (`veo3`, `veo3_1`, `veo3_1_lite`) — dije que no por una busqueda mal hecha (query muy angosta en `models_explore`). Ver catalogo completo abajo. |

**Correccion de un error mio (2026-07-07):** dije "Veo 3 no disponible en Higgsfield"
basado en una busqueda en vivo con `models_explore(action=search, query="veo google")`
que devolvio vacio. Sergio lo cuestiono con razon. La realidad: **el catalogo completo
y correcto ya estaba documentado** en
[`hermes-content/docs/historial/references/higgsfield-capabilities-map-20260706.md`](../../../docs/historial/references/higgsfield-capabilities-map-20260706.md)
desde el dia anterior — `veo3`/`veo3_1`/`veo3_1_lite` ya figuraban ahi. Mi error no fue
de catalogo sino de proceso: no consulte ese doc antes de responder y confie en una
busqueda en vivo con query angosta, que no es confiable para "¿existe X?" (`search`
hace matching por palabras clave, no es exhaustivo). **Leccion: para "que modelos
hay/existe X", consultar primero el capabilities-map; usar `models_explore(action=list)`
sin filtro si hace falta verificar en vivo, nunca `search` con 1-2 palabras sueltas.**

Ese doc ya tiene el catalogo completo de imagen/video/audio con costos y mapeo a
nuestro pipeline — no se duplica aca. Relevante para lo que seguimos armando:
`minimax_hailuo` (Hailuo) ya estaba anotado ahi como "fisica natural, **emocion
facial**" — candidato a probar para expresiones fuertes, alternativa a
`nano_banana_pro`+ancla real. `veo3`/`veo3_1` generan su propio audio/voz (no toman
`audio_references` externo como `wan2_7`), asi que no sirven para mantener la voz
Isabella ya establecida de Lucia — mejor candidato para b-roll premium que para
lipsync con voz consistente. **HeyGen si sigue sin estar en Higgsfield** (verificado
contra el listado completo, no aparece en ningun tipo) — esa parte era correcta.

**Aclaracion de Sergio (2026-07-07) sobre su investigacion:**
- Para escenas de bikini/swimwear: algunos modelos rechazan el contenido aunque no
  muestre nada explicito. Su investigacion dice que **Seedance 4** y **`text2image_soul_v2`**
  (el que ya usamos de default) son los que mejor generan ese tipo de escena sin
  bloquear. Anotado para cuando haga falta contenido de ese tipo — no se probo todavia.
- Para lipsync: **HeyGen da el mejor resultado en su investigacion, pero no esta en
  Higgsfield.** De lo disponible en Higgsfield, **Marketing Studio da mejores
  resultados que `wan2_7` puro** para hablar a camara.
- **`wan2_7` (lipsync suelto) falla demasiado para b-roll** — la solucion no es
  mejorar el lipsync del b-roll, es NO intentar lipsync ahi: el b-roll lleva
  movimiento puro (Kling) + la VOZ de Lucia (`seed_audio`) puesta encima en edicion,
  sin sincronizar labios. El unico segmento con lipsync real es el de "hablando a
  camara", y ahi usar Marketing Studio en vez de `wan2_7` cuando el presupuesto lo
  permita (42cr vs 15cr).

## Estructura de video (formato validado)

1. **Hook en b-roll** (Kling, movimiento puro, sin lipsync) — VO por encima.
2. **Corte a segmento hablando a camara** (`wan2_7`, lipsync real, audio nativo del
   clip) — cuenta algo puntual (tip, tag de producto, gancho).
3. **Vuelve a b-roll** (Kling, otra escena/accion) — VO de cierre.

Aprovecha la fortaleza de cada herramienta: Kling para movimiento (no necesita resolver
labios, mas barato en atencion/riesgo), `wan2_7` solo para el tramo que realmente
necesita hablar (limita la exposicion al pitfall de dientes, ya mitigado de todas
formas con el fix de ancla).

## Ejemplo real generado (prueba de concepto)

- `broll-kitchen.mp4` — Kling 2.6, 10cr, still de partida `action-cafe` (job
  `34aa8e52-...`), camina a una cocina luminosa en la mañana.
- `talking-skincare-tip.mp4` — `wan2_7`, 15cr/12s, still con ancla de dientes
  (`5a85c802-...`) + audio Isabella en español ("Uso este protector todos los dias...").
  Dientes verificados consistentes en 12 muestras del clip.
- `broll-jump.mp4` — Kling 2.6, 10cr, still de partida `full-jumping` (job
  `a8d5ceca-...`), salta en un parque soleado. Nota QA: el encuadre se pone un poco
  inestable en el momento de mayor movimiento (angulo bajo/raro en 2 frames) — revisar
  antes de usar en produccion, puede necesitar un prompt de camara mas contenido.

Costo total del ejemplo: ~35cr (10+15+10).

## Test Marketing Studio SIN producto (talking puro) — confirma la investigacion de Sergio

`ms-talking-noproduct.mp4` — Marketing Studio, avatar `e9b6eca1-...` (creado desde la
mejor foto del Identity Kit, `kit-03-full-smile.png`), preset `ugc_direct_to_camera`,
**sin `product_ids`**, 42cr. Prompt con guion explicito entre comillas en espanol.

- Guion salio en **espanol** (a diferencia del primer test de Lucia+ISDIN que salio en
  ingles) — pasar el guion completo entre comillas en el `prompt` fuerza el idioma de
  forma confiable, no hace falta dejarlo en automatico.
- Sin `product_ids` el modelo igual inventa un producto/prop generico si el prompt lo
  menciona (aca metio un tubo sin marca) — no hace falta pasar producto real para
  contenido de talking puro.
- Ambiente dormitorio prolijo, sin logos, identidad y forehead consistentes en las 12
  muestras revisadas. Calidad visual mas pulida que `wan2_7` puro.
- **Confirma la observacion de Sergio: Marketing Studio da mejor resultado que
  `wan2_7` suelto para el segmento de "hablando a camara"**, incluso sin producto.
  Diferencia de costo: 42cr (Marketing Studio) vs 15cr (`wan2_7`) — usar Marketing
  Studio cuando el presupuesto lo permita, `wan2_7` como opcion barata de respaldo.

## Test minimax_hailuo para expresiones fuertes (2026-07-07)

`minimax-surprised.mp4` — `minimax_hailuo` (variant minimax-2.3, default), 6cr, still
de partida `action-cafe` (mismo usado en `broll-kitchen.mp4`). Prompt: reaccion de
sorpresa genuina, cejas subiendo, gran sonrisa.

**Resultado: forehead liso en las 12 muestras revisadas, incluso en el frame de ojos
bien abiertos** (el caso mas exigente) — sin el artefacto de arrugas que si aparece con
`text2image_soul_v2`/Kling en expresiones fuertes. Dientes consistentes en todos los frames con
sonrisa. Costo 6cr, mas barato que Kling (10cr) y no necesita el paso extra de generar
primero una imagen con `nano_banana_pro` — anima directo desde el still de partida.

**Candidato fuerte para b-roll con reacciones/emociones fuertes** (no reemplaza el
lipsync real de Marketing Studio/`wan2_7` para "hablando a camara", pero es mejor opcion
que Kling para b-roll donde ella reacciona/gesticula con expresion marcada).

## Pieza #1 ensamblada (prueba del pipeline completo, 2026-07-07)

`lucia-piece01-rough.mp4` — primer video FINAL ensamblado end-to-end, CERO creditos
nuevos (solo edicion ffmpeg de clips ya generados). Estructura: b-roll cocina (Kling,
intro) -> corte a ella hablando del producto en español (`wan2_7`). 17s, 1080x1920,
30fps, audio normalizado. Los 2 segmentos comparten top blanco/ambiente asi que cortan
juntos naturalmente; identidad y forehead consistentes en todo el cut.

Es una prueba de concepto del ARMADO (que el pipeline llega a un .mp4 publicable), no la
pieza final de produccion — para eso se generan clips a proposito con guion, y el b-roll
lleva VO `seed_audio` en vez de audio nativo. Comando ffmpeg usado: normalizar ambos a
1080x1920/30fps + concat filter (v=1:a=1). Sistema completo de contenido en
`hermes-content/references/models/LUCIA_CONTENT_SYSTEM.md`.

## Pendiente (no ejecutado)

- Armar el edit final (concatenar los 3 clips + mezclar VO de b-roll con el audio
  nativo del segmento hablado) — candidato natural para un nuevo template en
  `hermes-content/scripts/content-engine` (Remotion), no se construyo todavia.
- Validar HeyGen/Veo 3 con Sergio si en algun momento Kling/wan2.7 no alcanzan.
- Revisar framing inestable de Kling en movimientos muy dinamicos (salto).
