export const meta = {
  name: 'marca-personal-drops-y-carruseles',
  description: 'Corrige y escribe drops de la comunidad y re-renderiza/crea carruseles K2, K8, K11-K13 con verificación adversarial',
  phases: [
    { title: 'Drops', detail: 'corregir 2 y 14, escribir EFFORT, N* y R*' },
    { title: 'Carruseles', detail: 'K2, K8, K11, K12, K13: brief, render y mirar' },
    { title: 'Verificar', detail: 'crítico independiente por pieza y arreglo' },
  ],
}

const REPO = '/home/user/onia-hermes'
const CTX = `Contexto: repo ${REPO}, rama claude/marca-personal-contenido-ae658c. Carril «Marca personal» de Sergio Urcullo (fundador de ONIA, Santa Cruz, Bolivia; enseña a construir y vender con IA). Audiencia: jóvenes y dueños de negocio hispanohablantes. Voseo rioplatense natural. Hoy es 1-oct-2026.
REGLAS: NO hagas commits ni push. NO gastes créditos (nada de Higgsfield ni APIs pagas). NO publiques nada. No inventes cifras, comandos, versiones ni funciones: todo sale de los archivos citados. Nada de IPs, tokens, correos ni nombres de clientes. ONIA tiene 0 clientes pagando: prohibido «mis clientes».
Fuentes: guiones finales del calendario 1-14 oct en hermes-content/docs/cola/plan-3-semanas/GUIONES-2-SEMANAS-1-14-OCT.md; auditorías con cambios y «Pendientes del lote» en hermes-content/docs/cola/plan-3-semanas/auditoria-20260930/LOTE-A.md, LOTE-B.md, LOTE-C.md, LOTE-D.md; drops existentes en la sección «## Drops de la semana» de hermes-content/docs/cola/plan-3-semanas/S1-GUIONES.md, S2-GUIONES.md y en §5 de S4-GITHUB-REPOS.md.`

const DROP_RULES = `Un DROP es el mensaje que Sergio Urcullo pega en «Avisos» de la comunidad de WhatsApp (Onia Community): entrega el recurso que el video promete («está en la comunidad»). Formato WhatsApp: *negrita* con asteriscos, bloques de código con triple acento grave, corto (lo que se usa en 2 minutos), útil HOY, cierra con UNA pregunta o mini-tarea para responder en General. Entrega, no anuncia. Tiene que coincidir con lo que dice el guion final de su pieza (no prometer más ni distinto).`

const DROPS_SCHEMA = {
  type: 'object',
  properties: {
    drops: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ej. drop-2, drop-14, drop-EFFORT, N03, R04' },
          pieza: { type: 'string', description: 'ID del guion al que sirve, ej. D02-B, N03, R04' },
          titulo: { type: 'string' },
          texto: { type: 'string', description: 'texto final listo para pegar en WhatsApp' },
          condicion: { type: 'string', description: 'condición antes de publicarlo (vacío si ninguna)' },
          fuentes: { type: 'string', description: 'de dónde sale cada dato (archivo o URL), para el editor' },
        },
        required: ['id', 'pieza', 'titulo', 'texto', 'condicion', 'fuentes'],
      },
    },
  },
  required: ['drops'],
}

const VERDICT = {
  type: 'object',
  properties: {
    ok: { type: 'boolean' },
    problemas: { type: 'array', items: { type: 'string' } },
  },
  required: ['ok', 'problemas'],
}

const DROP_TASKS = [
  { key: 'correcciones', prompt: `Tarea: (1) Reescribí el DROP 2 (pieza D02-B, «La cuenta de WhatsApp desde el 1-oct») de S1-GUIONES.md §«Drops de la semana». Hoy dice «columnas: utility, y service cuando Meta la publique»; según la auditoría (LOTE-A Pendientes y la sección D02-B), el guion final dice que los mensajes de servicio se cobran a la MISMA tarifa que utility y que los primeros MIL mensajes de servicio de cada mes por número son gratis; la cuenta del guion es: contar mensajes del mes, restar mil, multiplicar por la tarifa utility del país del cliente (Bolivia = «Rest of Latin America»). Esto NO está confirmado en la página de Meta (bloqueada desde la nube): poné en «condicion» que se publica solo si la sesión madre confirma esos dos datos en developers.facebook.com/documentation/business-messaging/whatsapp/pricing; si no los confirma, se corta la frase. (2) Reescribí el DROP 14 (pieza S1-D07-B, MCP) según LOTE-B (el criterio viejo «buscar mcp__ en tus archivos y borrar lo que no aparece» es FALSO: 13 servidores no escritos se usaban igual). El guion final enseña medir con /usage, apagar con /mcp y comprobar con /context; los conectores de claude.ai no se sacan con «claude mcp remove». Usá el texto propuesto en LOTE-B Pendientes si existe. El cierre es comunidad (no DM). (3) Escribí el DROP EFFORT que falta (pieza D02-A, «La perilla de Claude Code»): la tabla low mecánico · medium diario · high/xhigh cuando la primera no alcanzó · max casi nunca, con el comando claude --effort <nivel> y el dato verificado del guion final (en los modelos 5.5 el esfuerzo por defecto es medium). Verificá cada dato contra el guion final en GUIONES-2-SEMANAS-1-14-OCT.md.` },
  { key: 'noticias', prompt: `Tarea: escribí los drops de las NOTICIAS del calendario: N02 (Sonnet 4.5 se retira el 30-nov, /claude-api migrate), N03 (modo auto de Claude Code: volver a modo manual), N04 (skill llamada verify), N06 (Gemini CLI con Gemini 3.8 Flash). Y también N01 y N05 como reserva (marcá su condición: N01 sale el día después de S2-D08-B y conviene provocar el error en una copia; N05 solo si n8n 2.42 sale estable). Partí del texto propuesto en LOTE-D.md §«Pendientes del lote» → «Recursos a escribir (drops de la comunidad)» y de la sección de cada noticia en LOTE-D.md (fuente primaria verificada). No agregues datos que no estén en esas fuentes primarias citadas.` },
  { key: 'repos', prompt: `Tarea: escribí los drops de los REPOS TOP del calendario: R01 GitDiagram, R02 MoneyPrinterTurbo, R03 PageIndex, R04 AI Engineering from Scratch, R05 claude-skills, R06 CodeGraph, R07 Remotion. Partí del texto propuesto en LOTE-D.md §«Pendientes del lote» y de la sección de cada R en LOTE-D.md (comandos y riesgos verificados en vivo el 30-sep). Cada drop: qué es en una línea, los comandos exactos copiables, el riesgo que el guion nombra (licencia, datos que salen a terceros, telemetría, música con derechos), y la pregunta para General. Para R01 la condición: la madre confirma que gitdiagram.com genera el diagrama. Revisá además si los drops de G01, G04, G10 y G11 (en S4-GITHUB-REPOS.md §5) siguen coherentes con LOTE-D (G05 cambió de licencia a CC BY 4.0: si el drop 5 de S4 dice MIT, devolvé también ese drop corregido con id «G05»).` },
]

phase('Drops')
const dropResults = await pipeline(
  DROP_TASKS,
  t => agent(`${CTX}\n\n${DROP_RULES}\n\n${t.prompt}\n\nDevolvé los drops por StructuredOutput.`, { label: `drops:${t.key}`, phase: 'Drops', schema: DROPS_SCHEMA }),
  (res, t) => res && agent(`${CTX}\n\n${DROP_RULES}\n\nSos un revisor escéptico. Revisá estos drops contra (a) el guion final de su pieza en GUIONES-2-SEMANAS-1-14-OCT.md, (b) la fuente citada en LOTE-A/B/D, (c) las reglas de drops. Buscá: datos que no están en la fuente, comandos mal escritos, promesas distintas del guion, falta de pregunta final, texto largo o vacío, cualquier cosa que un miembro no pueda usar hoy. Si dudás, marcá problema.\n\nDROPS:\n${JSON.stringify(res.drops, null, 1)}`, { label: `verificar:drops:${t.key}`, phase: 'Verificar', schema: VERDICT }).then(v => ({ res, v })),
  (rv, t) => {
    if (!rv) return null
    if (rv.v && rv.v.ok) return rv.res
    return agent(`${CTX}\n\n${DROP_RULES}\n\nCorregí estos drops según los problemas que encontró el revisor. Verificá cada corrección contra las fuentes; si un problema es falso, dejalo como está. Devolvé TODOS los drops (corregidos o no).\n\nPROBLEMAS:\n${(rv.v ? rv.v.problemas : []).join('\n')}\n\nDROPS:\n${JSON.stringify(rv.res.drops, null, 1)}`, { label: `arreglar:drops:${t.key}`, phase: 'Verificar', schema: DROPS_SCHEMA })
  },
)

const CAR_RULES = `Antes de tocar nada leé completo ${REPO}/.claude/skills/diseno-contenido-onia/SKILL.md (sistema visual, pack «referentes», layouts, temas blanco/verde/negro, QA). TRAMPA: el campo del título es «headline», NO «title» (con title la lámina sale sin título y sin aviso). Portada sin imagen: layout «dato» o «logos», NUNCA «ilustrado» sin imagen. No uses imágenes nuevas ni Higgsfield (sin gasto); podés reutilizar imágenes que ya existan en hermes-content/galeria/ (ver galeria.json) o logos oficiales de hermes-content/references/brand-logos/ y brand-claude/. Ejemplo aprobado: hermes-content/carousels/briefs/marca-personal/sergio-k1v2-opus-o-sonnet-20260929.json y la salida hermes-content/carousels/out/sergio-k1-opcion-b-clay-20260929/.
RENDER (en ${REPO}): primero  eval "$(sh scripts/carousel_cloud_setup.sh)"  y después  node scripts/carousel_render.js --brief <brief.json> --out <dir> --account sergio --pack referentes --format feed  y  node scripts/carousel_contactsheet.js --dir <dir>. Después MIRÁ con la herramienta Read la _contactsheet.png y CADA slide-NN.png. Control de calidad obligatorio: título visible en cada lámina que lo lleva, nada cortado ni superpuesto con el pie (@sergiourcullo), ninguna lámina con más de 40 % vacío, ningún párrafo chico ilegible en celular, texto en DM Sans (no DejaVu), verde eléctrico nunca como texto sobre blanco. Si algo falla, corregí el brief y volvé a renderizar hasta que pase. Cada carrusel 5–8 láminas, portada verde, interiores blancos, cierre negro o verde, con «tag» de serie.`

const CAR_SCHEMA = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    brief: { type: 'string', description: 'ruta del brief json relativa al repo' },
    out: { type: 'string', description: 'carpeta de salida relativa al repo' },
    laminas: { type: 'integer' },
    cierre: { type: 'string', description: 'a dónde manda el cierre y si ese recurso existe' },
    notas: { type: 'string', description: 'qué se miró en el QA y qué quedó dudoso' },
  },
  required: ['id', 'brief', 'out', 'laminas', 'cierre', 'notas'],
}

const CARS = [
  { id: 'K2', prompt: `K2 «Tu primera skill en 5 pasos» (sale con el guion D01-A). El brief vigente es hermes-content/carousels/briefs/marca-personal/sergio-k2v2-primera-skill-20260929.json. Problema: se renderizó antes del cambio a blanco+verde+negro y salió con fondo crema. Arreglo: copiá el brief a sergio-k2v3-primera-skill-20261001.json, ponele theme por lámina (portada verde, interiores blanco, cierre negro), revisá que use «headline», que el contenido coincida con el guion final de D01-A en GUIONES-2-SEMANAS-1-14-OCT.md (ojo: el auditor cambió el ejemplo del router por la skill de continuidad; el carrusel tiene que contar lo mismo que el video), y renderizá en hermes-content/carousels/out/sergio-k2v3-primera-skill-20261001/.` },
  { id: 'K8', prompt: `K8 «Recuperar vs reconstruir el prompt de una imagen». Brief vigente hermes-content/carousels/briefs/marca-personal/sergio-k8v2-recuperar-vs-reconstruir-20260929.json. Problema: la portada es «ilustrado» SIN imagen (bloque verde vacío, más de 40 % vacío). Arreglo sin gasto: pasá la portada a «dato» o «logos» con un gancho concreto sacado del contenido (la skill sacar-prompt en .claude/skills/sacar-prompt/SKILL.md distingue recuperar = está en pantalla, se lee; reconstruir = se escribe uno parecido y se dice que lo es). Copiá a sergio-k8v3-recuperar-vs-reconstruir-20261001.json y renderizá en hermes-content/carousels/out/sergio-k8v3-recuperar-vs-reconstruir-20261001/. Revisá todas las láminas, no solo la portada.` },
  { id: 'K11', prompt: `K11 NUEVO: el hook Stop que commitea solo y su guarda. Fuente del contenido: el guion final D03-A en GUIONES-2-SEMANAS-1-14-OCT.md y su auditoría en LOTE-A.md, más hermes-content/docs/cola/plan-3-semanas/CARRUSELES-DIARIOS.md §2 fila K11 (portada «dato» 17: archivos con conflictos que el hook subió a main; enseña .claude/settings.json → hooks → Stop → command; Stop corre al terminar el turno, no el trabajo (217 líneas de CSS antes de la página); la guarda: git rev-parse -q --verify MERGE_HEAD y git diff --name-only --diff-filter=U; comprobar con /hooks; cierre comunidad, drop 3 de S1). Verificá el 17 y el 217 en CLAUDE.md §«Git — auto-sync». Brief: hermes-content/carousels/briefs/marca-personal/sergio-k11-hook-stop-guarda-20261001.json; salida hermes-content/carousels/out/sergio-k11-hook-stop-guarda-20261001/.` },
  { id: 'K12', prompt: `K12 NUEVO: dos sesiones de Claude Code en el mismo proyecto sin pisarse (worktrees). Fuente: guion final D05-A en GUIONES-2-SEMANAS-1-14-OCT.md y su auditoría en LOTE-B.md; CARRUSELES-DIARIOS.md §2 fila K12. IMPORTANTE: la cifra «424 commits» NO está verificada (LOTE-B: la memoria que la respalda no está en el repo); NO la uses como gancho ni en ninguna lámina. Elegí otro gancho verificable del guion (o un «logos»/«ensayo» fuerte). Enseña: git worktree add -b <rama> <carpeta> · claude -w <nombre> · paso crítico: todo git con git -C <ruta> · comprobar con git worktree list. Cierre: comunidad (LOTE-B unificó a comunidad; no «Comentá CARRIL»). Brief: hermes-content/carousels/briefs/marca-personal/sergio-k12-worktrees-sin-pisarse-20261001.json; salida hermes-content/carousels/out/sergio-k12-worktrees-sin-pisarse-20261001/.` },
  { id: 'K13', prompt: `K13 NUEVO: un loop de Claude Code en un servidor, sin API key y con barandas. Fuente: guion final D06-C (YouTube «Claude Code en un servidor, sin API key y con barandas») en LOTE-B.md y CARRUSELES-DIARIOS.md §2 fila K13: las dos piezas (corredor + prompt); barandas: flock, cd verificado, aviso cada 6 h, tope 50 min < 1 h; trampas: unset ANTHROPIC_API_KEY, --allowedTools en una cadena, pedido desde archivo (< prompt.md), cron en UTC, editar con temporal + bash -n + mv; la prueba: leer 3-4 commits. No digas cuántos loops hay activos hoy. Verificá cada dato contra el guion/auditoría; si algo no está, no lo pongas. Cierre comunidad. Brief: hermes-content/carousels/briefs/marca-personal/sergio-k13-loop-sin-api-key-20261001.json; salida hermes-content/carousels/out/sergio-k13-loop-sin-api-key-20261001/.` },
]

phase('Carruseles')
const carResults = await pipeline(
  CARS,
  c => agent(`${CTX}\n\n${CAR_RULES}\n\n${c.prompt}\n\nCuando pase el QA, devolvé el resultado por StructuredOutput.`, { label: `carrusel:${c.id}`, phase: 'Carruseles', schema: CAR_SCHEMA }),
  (r, c) => r && agent(`${CTX}\n\n${CAR_RULES}\n\nSos un crítico de diseño independiente y exigente. MIRÁ con Read ${REPO}/${r.out}/_contactsheet.png y cada slide-NN.png del carrusel ${c.id} (brief ${REPO}/${r.brief}). Buscá: títulos ausentes, texto cortado o pisado por el pie, láminas vacías (>40 %), letra chica ilegible, DejaVu en vez de DM Sans, fondo crema, verde eléctrico como texto sobre blanco, láminas que parecen afiches repetidos sin prueba visual distinta, datos que no coinciden con el guion fuente (${c.prompt.slice(0, 200)}...), cierre a un recurso que no existe, cifras no verificadas (la 424 está prohibida). Si dudás, marcá problema.`, { label: `verificar:${c.id}`, phase: 'Verificar', schema: VERDICT }).then(v => ({ r, v })),
  (rv, c) => {
    if (!rv) return null
    if (rv.v && rv.v.ok) return { ...rv.r, critica: 'ok' }
    return agent(`${CTX}\n\n${CAR_RULES}\n\nArreglá el carrusel ${c.id} (brief ${rv.r.brief}, salida ${rv.r.out}) según estos problemas del crítico. Verificá cada uno mirando las láminas; si uno es falso, explicalo en notas. Re-renderizá y MIRÁ de nuevo hasta que pase el QA.\n\nPROBLEMAS:\n${(rv.v ? rv.v.problemas : []).join('\n')}`, { label: `arreglar:${c.id}`, phase: 'Verificar', schema: CAR_SCHEMA }).then(x => x && { ...x, critica: (rv.v ? rv.v.problemas : []).join(' | ') })
  },
)

return {
  drops: dropResults.filter(Boolean).flatMap(r => r.drops || []),
  carruseles: carResults.filter(Boolean),
}
