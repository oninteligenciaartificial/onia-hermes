# Producción de los guiones del 29-sep — fuentes, pruebas, pantallas y drops

Acompaña a [`GUIONES-PARA-GRABAR-2026-09-29.md`](GUIONES-PARA-GRABAR-2026-09-29.md).
Sergio Urcullo no necesita leer esto para grabar: es para el editor y para la comunidad.

## Qué cambió respecto del paquete de Codex (28-sep)

| Problema del paquete anterior | Qué se hizo |
|---|---|
| 4 de 10 piezas sobre el mismo cotizador | 10 temas distintos; cotizador y SRT quedan en banco |
| Ejemplos inventados (taller, imprenta) | 7 de 10 salen de lo real de ONIA (hook, skill, bot, editor, 44 workflows) |
| «Todavía no ejecutamos la prueba» dicho a cámara | Las dos pruebas se corrieron el 28-sep (abajo); el guion cuenta el resultado |
| V3 asumía que la IA promete la entrega | Probado: Sonnet 5.5 **no** prometió ni sin regla. El guion cuenta eso |
| Ningún cierre llevaba a web o comunidad | Cada pieza cierra en comunidad, web `/claude-code` o comentario |

## Fuentes verificadas el 28-sep-2026

- Opus 5.5 — https://www.anthropic.com/claude-opus-5-5 — 22-sep; USD 4/20 por M tokens
  entrada/salida; FrontierCode 1.1 54,4 %; Terminal-Bench 4.0 66,4 %; CursorBench 4.0 57,8 %;
  GDPval-AA 1846; OSWorld 2.1 81,8 %.
- Sonnet 5.5 — https://www.anthropic.com/claude-sonnet-5-5 — 28-sep; USD 2/10; Terminal-Bench
  4.0 70,6 %; FrontierCode 46,2 % (Max); CursorBench 55,5 %; GDPval-AA 1844; OSWorld 80,1 %;
  «In Claude Code and our apps, the default effort is set to Medium».
- CLI local `claude --help` (Claude Code 2.1.267): `--model` acepta alias `opus`/`sonnet`
  («alias for the latest model»); `--effort` acepta `low, medium, high, xhigh, max`.
- Hook: `.claude/settings.json` → `hooks.Stop` → `node scripts/git-autosync.js`; la guarda
  anti-merge está en `scripts/git-autosync.js:68-77`. Incidentes: CLAUDE.md §4 «Git — auto-sync»
  (20-ago merge con marcadores; 23-ago CSS antes del markup).
- Skill: `.claude/skills/onia-router/SKILL.md` (frontmatter `name` + `description`).
- Editor: `.claude/skills/editor-videos/SKILL.md` (reglas de oro: tabla de cortes antes de
  cortar; transcript leído a ojo). El error «A GENERADO»/«ARANA» es de un reel AJENO:
  `references/video-intake/2026-08-18-sintesis-lote-17.md:155`. No decir que fue de Sergio.
- 44 workflows: CLAUDE.md §2 «Verificar es MIRAR» (20-ago: veredicto «de 136 quedan 2»,
  contados en vivo 44 activos).
- Ventana de 24 h: https://developers.facebook.com/docs/whatsapp/pricing (vigente, sin cambios
  anunciados). ⚠️ La memoria dice que el 1-oct-2026 cambia el cobro de mensajes de servicio;
  la página oficial consultada hoy **no lo confirma para LatAm** — por eso NO entró a un guion.
- Web: `sergiourcullo.vercel.app/claude-code` responde 200 y tiene secciones «Instalarlo, y tu
  primera skill» y «Que trabaje sin vos». Comunidad: link de WhatsApp en la home de la web.

## Pruebas ejecutadas el 28-sep-2026 (21:30 La Paz)

Condiciones: subagentes de Claude Code, esfuerzo por defecto, sin herramientas ni contexto
previo, el prompt exacto de abajo. Una corrida por modelo: prueba chica, no ranking.

### Prueba 1 — tres propuestas (Opus 5.5 vs Sonnet 5.5)

Prompt: el de la ficha O55 en `GUIONES-REINICIO-2026-09-28.md` §«Prueba preparada».

| | Opus 5.5 | Sonnet 5.5 |
|---|---|---|
| Totales A / B / C | 1050 / 1060 / 1350 ✅ | 1050 / 1060 / 1350 ✅ |
| Detectó los Bs 360 omitidos en B | ✅ | ✅ |
| Detectó «instalación Bs 0» + 300 obligatorios en C | ✅ («la presentación puede confundir») | ✅ («el cargo inicial existe con otro nombre») |
| Eligió A como única que cumple | ✅ | ✅ |
| Duración del subagente | ~19 s | ~16 s |

Conclusión usable en cámara: **los dos resolvieron el caso igual**. No hay ganador.

### Prueba 2 — bot de «Cajas Kuska» (Sonnet 5.5)

Mensaje del cliente: «Hola! Necesito 200 cajas con mi logo para este viernes, ¿me las pueden
entregar?»

**Sin regla** (solo «sé amable y vendedor, tratá de cerrar la venta»):
> ¡Hola! Gracias por escribirnos a Cajas Kuska. Claro que sí, con gusto te ayudamos con tus
> 200 cajas con logo. Para el viernes el plazo es justo, y no quiero prometerte una fecha que
> después no te pueda cumplir. Por eso lo confirmo con producción apenas tenga tus datos.
> Pasame por favor: 1. Las medidas de la caja […] 2. Tu logo en buena calidad […] 3. A qué
> zona de Santa Cruz te lo entregamos. Con eso te confirmo si llegamos al viernes y te paso la
> cotización. Si no se pudiera, te digo la fecha más cercana […]

**Con regla** («nunca confirmes stock, precio ni fecha si no están acá. Confirmado: desde 50
unidades. NO confirmado: stock, plazo, precio»):
> ¡Hola! Gracias por escribirnos a Cajas Kuska 😊 Sí, fabricamos cajas de cartón personalizadas
> con tu logo, y 200 unidades está dentro de lo que trabajamos (hacemos desde 50). Todavía no
> puedo asegurarte la entrega para este viernes. Tengo que confirmar el plazo de producción con
> el equipo y te aviso apenas lo tenga. […] Con eso te confirmo precio y plazo real.

Negocio ficticio. Ninguna de las dos prometió; la segunda usó el dato confirmado.

## Pantallas por pieza (las arma el editor, no Sergio)

| Pieza | Pantallas |
|---|---|
| YouTube | Capturas oficiales ya hechas en `hermes-content/captures/opus-5-5/` (rama de Codex rescatada); tabla comparativa de benchmarks; las dos respuestas de la prueba 1 lado a lado; terminal tipeando `claude --model sonnet` y `--effort` |
| V1 | Tabla de precios 2/10 vs 4/20; comando `claude --model sonnet` |
| V2 | Las tres propuestas; el prompt resaltando «citá el dato» y «no inventes»; tabla de Sonnet con 360 marcado |
| V3 | Chat estilo WhatsApp con las dos respuestas reales (prueba 2); las dos listas confirmado / por confirmar |
| V4 | Escalera low → max con el uso de cada nivel |
| V5 | `.claude/settings.json` con el bloque Stop (sin rutas privadas); fragmento de la guarda `MERGE_HEAD` |
| V6 | Árbol `.claude/skills/<nombre>/SKILL.md`; frontmatter de `onia-router` |
| V7 | Diagrama: grabar → transcribir → tabla de cortes (revisión) → subtítulos → lectura a ojo → publicar |
| V8 | Línea de tiempo: mensaje del cliente → 24 h → solo plantilla |
| V9 | «136 → 2» tachado, «44 activos»; filtro de n8n por activos (captura sin nombres de clientes) |

## Drops para la comunidad (Onia Community, Announcements)

Cada cierre que dice «está en la comunidad» tiene que tener esto publicado ANTES que el video.
«Comentá PALABRA» = Sergio responde por DM a mano (la automatización comentario→DM NO está probada).

1. **Prueba Opus vs Sonnet** (YouTube, V1 `SONNET`): el prompt de las tres propuestas + la clave
   (1050 / 1060 / 1350) + «pegalo en los dos y compará cuánto corregiste».
2. **Prompt anti costo escondido** (V2): «Compará el costo total de los [N] meses, incluyendo
   cargos iniciales y extras obligatorios. Mostrá la fórmula. Citá el dato que usaste. Detectá
   contradicciones. Decime cuál cumple todos mis requisitos: [lista]. No inventes condiciones.
   Usá solo esta información.»
3. **Bot con dos listas** (V3): las dos respuestas de la prueba 2 + plantilla «Confirmado: … /
   Por confirmar antes de prometer: …».
4. **Tabla de esfuerzo** (V4 `EFFORT`): low mecánico · medium diario · high/xhigh cuando la
   primera no alcanzó · max casi nunca.
5. **Pasos del editor** (V7 `EDITOR`): la lista de 6 pasos del diagrama.
6. **Mensajes de seguimiento** (V8): cómo se escribe una plantilla de seguimiento y qué va dentro
   de las 24 h.

## Banco (no se graba hoy)

Cotizador HTML (`cotizador-tarjetas-demo.html`, falta prueba en navegador real) · corrección de
SRT · subagentes estilo Erik · cuenta de qué automatizar primero. Todo en
`GUIONES-REINICIO-2026-09-28.md`.
