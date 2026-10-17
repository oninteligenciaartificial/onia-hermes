# K3 · Plantilla precargada del rubro dental al registrarse (backlog de competencia, #3)

Repo: onia-platform (Next.js 16, React 19, Prisma 7, vitest; multi-tenant: todo se filtra por organizationId). Antes de codear leé .claude/skills/onia-backend/SKILL.md. Textos a pacientes y clientes, de USTED. Nada de producción, push, npm install, prisma generate ni migraciones. NO commitees (el sandbox no deja escribir en .git): dejá los cambios sin commitear y el mensaje de commit propuesto en el resumen. tsc y vitest no arrancan en el sandbox: escribí los tests igual y decí que no corrieron; los valida el CI. Origen: hermes-content/research/competencia/BACKLOG_DE_PRODUCTO.md (onia-hermes).

## META
Al crear una organización dental se siembran:
- los servicios típicos;
- un horario de ejemplo;
- los mensajes base.
Con una función idempotente que se dispara en el alta que ya existe. Baja el soporte por cliente. Lo tiene Lety.

## PRUEBA DE HECHO
- Crear la organización dos veces no duplica nada.
- Una organización de otro rubro no recibe la semilla dental.
- Los servicios van SIN monto (0 o vacío), y se le dice al dueño que los complete.

## REGLA DE PARADA
No inventes precios. Si hace falta tocar el schema, PARÁ.
