# K2 · Citas canceladas y faltas por recuperar (backlog de competencia, #1)

Repo: onia-platform (Next.js 16, React 19, Prisma 7, vitest; multi-tenant: todo se filtra por organizationId). Antes de codear leé .claude/skills/onia-backend/SKILL.md. Textos a pacientes y clientes, de USTED. Nada de producción, push, npm install, prisma generate ni migraciones. NO commitees (el sandbox no deja escribir en .git): dejá los cambios sin commitear y el mensaje de commit propuesto en el resumen. tsc y vitest no arrancan en el sandbox: escribí los tests igual y decí que no corrieron; los valida el CI. Origen: hermes-content/research/competencia/BACKLOG_DE_PRODUCTO.md (onia-hermes).

## META
Un selector de las citas canceladas o con falta de los últimos N días (default 30) cuyo paciente NO tiene una cita
futura. Se conecta al agente reprogramador que ya existe, para que proponga el mensaje en «Pendientes» con la aprobación
del dueño de siempre. Lo tienen Dentalink (tarea «Cita») y Fluker.

## PRUEBA DE HECHO
Test con datos semilla:
- la cancelada sin cita futura aparece;
- la cancelada con cita futura no aparece;
- la propuesta queda en «Pendientes» sin enviarse;
- todo filtrado por `organizationId`.

## REGLA DE PARADA
Si no encontrás el reprogramador, o si necesita una tabla nueva, PARÁ y reportá. Nada de envío real ni de pantallas nuevas.
