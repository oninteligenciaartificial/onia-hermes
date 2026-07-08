# Estructura de contenido: B-roll + VO + Lipsync intercalado (2026-07-07)

Formato definido a pedido de Sergio, comparando su investigacion de herramientas
(Kling, HeyGen, Seedance 2.0, Veo 3) contra lo que ya tenemos en Higgsfield.

## Mapeo herramientas (investigacion de Sergio vs lo que ya tenemos)

| Necesidad (investigacion Sergio) | Herramienta investigada | Lo que ya tenemos en Higgsfield |
|---|---|---|
| Solo movimiento (b-roll) | Kling 2.5 | **Kling 2.6** (mas nuevo, "cinematic motion, advanced physics") o Kling 3.0 — ya en la cuenta |
| Hablar (lipsync) | HeyGen Avatar 5 | `wan2_7` — ya resuelto hoy (fix de dientes), sin plataforma nueva |
| — | Seedance 2.0 | Ya documentado como EVITAR (45-135cr, la mas cara) |
| — | Veo 3 | No disponible en Higgsfield — integracion externa, no evaluado |

**HeyGen y Veo 3 no se dieron de alta** — son plataformas nuevas, requieren validacion
de gasto con Sergio antes de usarlas (regla [[gasto-plataformas-validar-primero]]). Por
ahora Kling+wan2.7 cubren el mismo caso de uso sin sumar plataforma.

**Aclaracion de Sergio (2026-07-07) sobre su investigacion:**
- Para escenas de bikini/swimwear: algunos modelos rechazan el contenido aunque no
  muestre nada explicito. Su investigacion dice que **Seedance 4** y **`soul_2`**
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

## Pendiente (no ejecutado)

- Armar el edit final (concatenar los 3 clips + mezclar VO de b-roll con el audio
  nativo del segmento hablado) — candidato natural para un nuevo template en
  `hermes-content/scripts/content-engine` (Remotion), no se construyo todavia.
- Validar HeyGen/Veo 3 con Sergio si en algun momento Kling/wan2.7 no alcanzan.
- Revisar framing inestable de Kling en movimientos muy dinamicos (salto).
