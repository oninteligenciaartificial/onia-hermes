# Modelos de Claude y cuota — cómo se gasta bien

**Qué modelo usa cada trabajo de ONIA y cómo no volver a quemar la semana.** Fuente:
`platform.claude.com/docs/en/about-claude/models/overview` (leída el 2026-09-10) + lo
medido en vivo ese día. Un tema, un archivo: esto se EDITA cuando cambie la lineup.

## La lineup vigente (leída de la doc oficial)

| Modelo | Para qué | Contexto | Precio (in/out por MTok) | Velocidad |
|---|---|---|---|---|
| **Fable 5.1** (`claude-fable-5-1`) | razonamiento exigente, trabajo agéntico largo | 1M | $10 / $50 | el más lento |
| **Opus 5** (`claude-opus-5`) | coding agéntico complejo — **el default recomendado** | 1M | $5 / $25 | moderado |
| **Sonnet 5** (`claude-sonnet-5`) | mejor balance velocidad/inteligencia | 1M | $2 / $10 | rápido |
| **Haiku 4.5** (`claude-haiku-4-5`) | el más rápido, casi-frontier | 200K | $1 / $5 | el más rápido |

- Todos con visión, herramientas y thinking adaptativo (Haiku: extended, sin `effort`).
- Cache de prompt: leer del cache cuesta 10% del input (2,5% en Fable 5.1) — los loops
  que repiten prompt largo se benefician solos.
- La doc oficial dice: **arrancar con Opus 5 para casi todo**; Fable para lo que Opus
  con effort alto no alcanza. Fable cuesta el DOBLE que Opus por token.

## La cuota de la suscripción — lo que nos pasó el 10-sep

- **El pool es UNO para todo**: Claude web + Claude Code + sesiones + subagentes + los
  loops de casa. Confirmado en la doc de soporte ("límites compartidos entre Claude y
  Claude Code") y medido en carne: los 4 loops de casa murieron a las 03:00 UTC con
  "You've hit your weekly limit" y a la misma hora murieron los 3 subagentes Opus de la
  sesión de control. Mismo tanque.
- **El reset semanal observado: miércoles ~08:00 UTC** (04:00 Caracas). Los loops
  vuelven solos al reset — no hay que rearmar nada.
- Al agotarse: esperar el reset, o créditos extra / API de pago (decisión de Sergio
  Urcullo, no de una sesión).

## Reglas de gasto para ONIA (aprendidas pagando)

1. **Nunca 3+ subagentes Opus/Fable en paralelo con los loops corriendo.** Eso remató
   la semana el 8-sep. Fan-out grande = Sonnet o Haiku para los workers, u ONE agente
   por vez.
2. **Fable solo donde Opus no alcanza** (cuesta 2×): sesión de control en decisiones
   densas, no para grep ni para mirar pantallas.
3. **Los loops viven del mismo tanque que la sesión de control.** Antes de un fan-out,
   pensar qué van a necesitar los loops el resto de la semana.
4. **Subagentes de medición → Haiku/Sonnet; subagentes que escriben código → Opus.**
   La doc de performance del proyecto ya lo decía (90% de capacidad a 1/3 del costo
   para trabajo liviano); ahora con la lineup 5: Sonnet 5 es el caballo de batalla
   barato.
5. **Hermes Agent NO es Claude**: corre gpt-5-mini con crédito OpenAI aparte. Prioriza
   el kanban, no programa. Quemar cuota de Claude no lo afecta y viceversa.
6. El cache de prompt premia prompts ESTABLES: no reescribir el prompt de un loop por
   gusto — cada reescritura invalida el cache y encarece todas sus vueltas.
