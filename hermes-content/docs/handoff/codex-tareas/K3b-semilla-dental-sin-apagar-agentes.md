# K3b · La semilla dental no apaga los agentes ni puede tumbar el alta (arreglo de #134)

Sos Codex. Rama `codex/...k3...` del PR #134 (la misma). `git branch --show-current` primero y `git merge origin/master`.

## Lo que encontró la revisión de Plataforma (8-oct) — bloquea el merge
1. **Apaga los agentes de toda cuenta dental nueva.** `sembrarDental` crea `oniaAgentsAgent` con roles `recall`,
   `confirmador` y `reprogramador` y `enabled: false`. `ensureAgentForOrg` (`lib/onia-core/modules/agents-runtime.ts:~1335`)
   encuentra esa fila y la devuelve sin tocarla, y el runtime la saltea (`:~2086`, `skippedReason: "agent_disabled"`).
   Resultado: la prueba de 14 días sin propuestas en Pendientes, que es lo que se vende.
2. **Puede tumbar el alta.** Corre dentro de la transacción de `provisionOrganization`: en Postgres cualquier error
   aborta la transacción entera, y un `throw` propio («requiere un propietario») o un fallo de un upsert deja al
   prospecto sin cuenta. El alta es el embudo: no puede depender de una semilla.
3. **Precios en 0 a la vista del paciente.** Verificá si la reserva pública (`app/(public)/book/**`) muestra el precio
   de los servicios; si lo muestra, un «Bs 0» se lee como gratis.

## Lo que se hace
- **Sacar los agentes de la semilla.** Los crea `ensureAgentForOrg`, encendidos y en «suggest», como hoy. Si los
  textos de ejemplo hacen falta, que vivan donde ya viven las plantillas de cada agente (no en filas nuevas).
- **La semilla sale de la transacción del alta:** se llama DESPUÉS de que `provisionOrganization` devuelve, con
  `prisma` (no `tx`), en try/catch que registra con `registrarFallo` y nunca hace fallar el alta. Sigue idempotente
  (ids estables + upsert/skipDuplicates). Sin `throw` por perfil: si no hay ADMIN, no siembra y registra.
- Si la reserva pública muestra precios: un servicio con precio 0 no muestra precio (ni «Bs 0» ni «Gratis»).

## PRUEBA DE HECHO
- Test: después del alta dental, `ensureAgentForOrg(org, "recall")` devuelve un agente `enabled: true`.
- Test: si la semilla tira error, el alta igual responde 200 y queda el fallo registrado.
- Test de la reserva pública (si aplica): precio 0 → sin precio visible.
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo (números reales).

## REGLA DE PARADA
No toques migraciones, cobros ni el texto legal del alta. Textos de usted.
