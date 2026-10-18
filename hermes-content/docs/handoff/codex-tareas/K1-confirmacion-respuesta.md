# K1 · Intérprete de la respuesta de confirmación del paciente (backlog de competencia, #4)

Repo: onia-platform (Next.js 16, React 19, Prisma 7, vitest; multi-tenant: todo se filtra por organizationId). Antes de codear leé .claude/skills/onia-backend/SKILL.md. Textos a pacientes y clientes, de USTED. Nada de producción, push, npm install, prisma generate ni migraciones. NO commitees (el sandbox no deja escribir en .git): dejá los cambios sin commitear y el mensaje de commit propuesto en el resumen. tsc y vitest no arrancan en el sandbox: escribí los tests igual y decí que no corrieron; los valida el CI. Origen: hermes-content/research/competencia/BACKLOG_DE_PRODUCTO.md (onia-hermes).

## META
Una función pura que recibe el texto o el id de botón de la respuesta del paciente al recordatorio, junto con la cita, y
devuelve `confirmar | cancelar | reprogramar | desconocido`. Además, la transición de estado de la cita que YA existe en
el modelo. No le envía nada a Meta. Lo tienen Doctocliq, AgendaPro, Huli, Fluker y Dentalink.

## PRUEBA DE HECHO
- Tests con al menos 20 respuestas reales de clínica, todos en verde: «1», «sí», «si», «confirmo», «ok», «no puedo»,
  «otro día», «cancelo», un emoji 👍, vacío, mayúsculas y tildes, más los ids de los botones.
- La transición aplica solo estados válidos y respeta `organizationId`.

## REGLA DE PARADA
Si el estado «confirmada» no existe en el schema, PARÁ y reportalo: no se crea la migración.
