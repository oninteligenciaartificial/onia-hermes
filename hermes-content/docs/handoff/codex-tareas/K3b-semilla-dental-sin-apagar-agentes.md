# K3b · La semilla dental no apaga los agentes ni puede tumbar el alta (arreglo de #134)

Sos Codex. Rama `codex/semilla-dental` del PR #134 (la misma). `git branch --show-current` primero y `git merge origin/master`.

> **Sigue abierto al 9-oct 06:20 UTC** (medido sobre `7c7e16df`, con K23b ya hecho): `semilla-dental.ts:65-72` sigue
> creando los tres agentes con `enabled: false`. Y K23b lo empeoró sin querer: ahora el aviso se marca leído al completar
> horario y precios, así que el recordatorio de «actívelos» desaparece y los agentes quedan apagados para siempre.
> El punto 3 (precios en 0 en la reserva pública) **no hace falta**: medido, `app/(public)/book/**` no muestra precios
> ni lista servicios. Hacé solo el 1 y el 2. ⚠️ La tarea K23b decía que con ella #134 quedaba para mergear: era falso.

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
