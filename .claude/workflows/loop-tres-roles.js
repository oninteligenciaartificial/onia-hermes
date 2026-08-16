export const meta = {
  name: 'loop-tres-roles',
  description: 'Planeador -> ejecutador -> evaluador con memoria separada, tope de vueltas y log de cierre',
  whenToUse: 'Tareas con un "LISTO =" verificable donde el sesgo de auto-revision importa. Args: { objetivo, listo, cwd, maxVueltas? }',
  phases: [
    { title: 'Plan', detail: 'el planeador no ve codigo' },
    { title: 'Ejecutar', detail: 'implementa contra el plan' },
    { title: 'Evaluar', detail: 'solo ve LISTO + diff, nunca el plan' },
  ],
}

// Por que tres roles y no uno: un agente que se revisa a si mismo arrastra su
// propio sesgo — ya decidio que estaba bien cuando lo escribio. El evaluador
// NO ve el plan a proposito: si lo ve, hereda su justificacion.
// Tope de vueltas OBLIGATORIO: un loop mal disenado quema presupuesto sin avisar.

const { objetivo, listo, cwd } = args ?? {}
if (!objetivo || !listo || !cwd) {
  throw new Error('args requeridos: { objetivo, listo, cwd } (cwd = carpeta de trabajo absoluta)')
}
const MAX_VUELTAS = args.maxVueltas ?? 3

phase('Plan')
const plan = await agent(
  `Sos el PLANEADOR. NO leas ni abras ningun archivo de codigo — planifica solo desde el objetivo.\n` +
    `Objetivo: ${objetivo}\nLISTO = ${listo}\n` +
    `Devolve: plan de pasos concretos + criterios de aceptacion medibles (que se puede abrir/correr para comprobar cada uno).`,
  { label: 'planeador', phase: 'Plan' },
)

const VEREDICTO = {
  type: 'object',
  properties: {
    aprobado: { type: 'boolean' },
    motivo: { type: 'string', description: 'si rechaza: que falta o que esta mal, concreto y accionable' },
  },
  required: ['aprobado', 'motivo'],
}

const vueltas = []
let feedback = null
let cierre = 'tope'

for (let vuelta = 1; vuelta <= MAX_VUELTAS; vuelta++) {
  log(`Vuelta ${vuelta}/${MAX_VUELTAS}`)

  const ejecucion = await agent(
    `Sos el EJECUTADOR. Trabaja en la carpeta EXACTA: ${cwd} (verifica que existe antes de escribir).\n` +
      `Objetivo: ${objetivo}\nLISTO = ${listo}\nPlan del planeador:\n${plan}\n` +
      (feedback ? `RECHAZO de la vuelta anterior — corregi exactamente esto:\n${feedback}\n` : '') +
      `Implementa. NO commitees. Al final devolve SOLO: (a) lista de archivos tocados con ruta absoluta, ` +
      `(b) el diff o contenido completo de lo que cambiaste (para un revisor que no vio nada mas).`,
    { label: `ejecutador·v${vuelta}`, phase: 'Ejecutar' },
  )

  // El evaluador recibe SOLO el LISTO y el diff. Ni el plan ni el objetivo
  // extendido: evalua contra el criterio de aceptacion, no contra la intencion.
  const veredicto = await agent(
    `Sos el EVALUADOR. No sabes que se planeo ni por que — y esta bien: evalua SOLO esto.\n` +
      `LISTO = ${listo}\n` +
      `Cambios entregados:\n${ejecucion}\n` +
      `Verifica de verdad: si un archivo deberia existir, abrilo en ${cwd}; si algo deberia correr, correlo. ` +
      `Aproba UNICAMENTE si el LISTO se cumple literal. Si rechazas, deci que falta, concreto.`,
    { label: `evaluador·v${vuelta}`, phase: 'Evaluar', schema: VEREDICTO },
  )

  vueltas.push({ vuelta, aprobado: veredicto?.aprobado ?? false, motivo: veredicto?.motivo ?? 'evaluador no respondio' })

  if (veredicto?.aprobado) {
    cierre = 'convergencia'
    log(`Aprobado en la vuelta ${vuelta}`)
    break
  }
  feedback = veredicto?.motivo ?? 'sin motivo — tratalo como rechazo total'
  log(`Rechazado v${vuelta}: ${feedback}`)
}

if (cierre === 'tope') {
  log(`⛔ CERRO POR TOPE (${MAX_VUELTAS} vueltas) — NO ESTA LISTO. Ultimo rechazo: ${feedback}`)
}

return {
  cierre, // 'convergencia' | 'tope' — tope significa NO LISTO, decirlo fuerte
  vueltasDadas: vueltas.length,
  vueltas, // que rechazo el evaluador en cada una
  plan,
}
