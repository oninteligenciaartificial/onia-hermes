# Harness y orquestación: por qué ONIA no ejecuta y qué sí funciona

Investigación del 18-oct-2026, pedida por Sergio Urcullo: «investigá todas las fuentes que enseñen
sobre harness y orquestación… dame la verdadera respuesta y el que de verdad funciona». Fuentes
primarias (Anthropic, OpenAI, NousResearch, papers) y foros (GitHub issues, HN). Medición propia en
el VPS y en la PC el mismo día. Lo construido a partir de esto: `scripts/orquesta/`.

## Veredicto

1. **El que reparte no tiene que ser una IA.** Tiene que ser un programa fijo con cola, dueño por
   tarea, modelo elegido por tabla y un «hecho cuando» que se comprueba solo. El LLM trabaja dentro
   de cada tarea. Es lo que repiten Anthropic, OpenAI, 12-factor agents, Cursor y Carlini.
2. **El trabajo se hace en la PC.** Ahí están las skills, los plugins, la memoria, Chrome con sus
   sesiones, los videos y Claude/Codex logueados. La nube no tiene nada de eso, y en el VPS los
   términos de Anthropic no permiten que un tercero (Hermes) use el login de Claude Max.
3. **Hermes queda como canal de Telegram**, no como jefe. OpenClaw no conviene hoy y Clicky es otra
   cosa (asistente de voz para Mac).
4. **Autonomía realista: 35-50 % de la ejecución**, con Sergio Urcullo aprobando lo irreversible
   (~30-60 min/día). Código y video mecánico, alto; comunidad y ventas, bajo.

## Por qué no ejecuta hoy (medido el 18-oct)

### En el VPS (Hermes Agent v0.21.0)
- **47 tareas «listas» en el tablero `onia` que nadie toma**: están sin asignar o asignadas a
  perfiles que no existen (solo existe `default`). La doc oficial: si el perfil asignado no existe,
  la tarjeta queda en `ready` como `skipped_nonspawnable`
  ([kanban worker lanes](https://github.com/NousResearch/hermes-agent/blob/main/website/docs/user-guide/features/kanban-worker-lanes.md)).
- **13 de 16 trabajos programados pausados.** El único agente activo (`onia-ordenador-tablero`,
  gpt-5-nano) solo crea tarjetas. Los prompts dicen «proponé, no ejecutes».
- **Dos gateways.** El servicio de sistema se reinició 3.423 veces desde el 17-oct porque el de
  usuario (PID 909) ya corre. Un `systemctl restart hermes-gateway` no toca al que de verdad atiende.
- **Credenciales de Claude Max en el pool de Hermes** (`ANTHROPIC_TOKEN` y `claude_code`, OAuth).
  Anthropic: los terceros no pueden «route requests through Free, Pro, or Max plan credentials» ni
  «collect, store, or intermediate Claude.ai credentials»
  ([legal-and-compliance](https://code.claude.com/docs/en/legal-and-compliance)). Desde el 4-abr-2026
  los harness de terceros no consumen límites de la suscripción
  ([TechRadar](https://www.techradar.com/pro/bad-news-claude-users-anthropic-says-youll-need-to-pay-to-use-openclaw-now)).
  Lo permitido: el binario oficial de Claude Code, sin modificar, con tu propio login.

### En las sesiones «madre»
- **Arrancan cargadas**: ~117 KB de instrucciones (reglas globales 56 KB con una copia en chino,
  CLAUDE.md del proyecto 38 KB, MEMORY 16 KB) más ~300 skills listadas y 4 plugins que se
  contradicen (uno obliga a usar skills siempre, otro a ser «vago», otro a escribir telegráfico,
  otro a responder solo JSON). Medido: un `claude -p "ok"` en el repo arranca con **132 k tokens**.
  Anthropic: «Bloated CLAUDE.md files cause Claude to ignore your actual instructions»
  ([best practices](https://code.claude.com/docs/en/best-practices)).
- **Contexto lleno**: 487 k, 843 k y 965 k tokens sin compactar en las tres madres del 17-18 oct.
- **Diez frentes a la vez**: 29 y 34 mensajes en ~25 h, más de 10 temas, ninguno con «hecho
  cuando». Cada pedido nuevo corta el anterior.
- **Hacen de gerente**: rondas cada 30 min leyendo a la jefa, chequeos de merge, 4 tandas de
  revisión de Codex en un PR de limpieza.
- **El control de permisos las frena**: 11 acciones denegadas en las 3 sesiones (sobre todo SSH).
- **Pegar repos y reels no instala nada**: el ECC que se mandó ya estaba instalado como plugin; leer
  4 perfiles de Instagram costó 289 k tokens a un ayudante.

### En Projects (beta) y la nube
La nube es otra máquina (VM Ubuntu) que arranca de un clon del repo
([cloud environments](https://code.claude.com/docs/en/cloud-environments#what-carries-over-from-your-setup)).
**No carga** `~/.claude/CLAUDE.md`, `~/.claude/skills`, plugins, MCP locales, hooks ni memoria de
usuario ([settings en la nube](https://code.claude.com/docs/en/settings#settings-in-cloud-sessions)).
Projects: «Cloud threads don't pick up anything from the Claude Code setup on your own machine»; con
varios repos no corren hooks ni permisos ([claude-projects](https://code.claude.com/docs/en/claude-projects)).
Medido en la PC: **97 de 111 skills, los 10 plugins y 11 de 13 tipos de hooks son solo de la PC**;
el repo no tiene `.mcp.json`. «Work locally» desde Projects no anda con «Require trusted devices»
activo. Foros: [#89215](https://github.com/anthropics/claude-code/issues/89215) (2 repos sin hooks),
[#99112](https://github.com/anthropics/claude-code/issues/99112) (conectores con «Allow once» frenan
corridas largas), [#100526](https://github.com/anthropics/claude-code/issues/100526) (403 de trusted
devices en Windows 11 desde el 17-oct).

**Nunca se lleva a la nube**: el navegador con tus sesiones, computer-use, PowerShell, la bóveda
KeePassXC, los videos locales y la memoria automática.

## Qué dicen las fuentes que hace que un agente cierre solo

- Un check ejecutable: «Without a check it can run, 'looks done' is the only signal»
  ([best practices](https://code.claude.com/docs/en/best-practices)). Carlini: «the task verifier is
  nearly perfect, otherwise Claude will solve the wrong problem»
  ([compilador C](https://www.anthropic.com/engineering/building-c-compiler)).
- Estado en archivos y git, tareas chicas, commit por paso
  ([long-running harnesses](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents);
  [Codex tareas largas](https://developers.openai.com/blog/run-long-horizon-tasks-with-codex.md)).
- Un solo agente antes que muchos; multiagente cuesta ~15x tokens y solo conviene en investigación
  amplia ([multi-agent research](https://www.anthropic.com/engineering/multi-agent-research-system);
  [Cognition](https://cognition.com/blog/dont-build-multi-agents)).
- Un dueño por tarea y alguien que asigne: con coordinación plana, 20 agentes rendían como 2-3
  ([Cursor](https://cursor.com/blog/scaling-agents)).
- Fallas medidas en 1.642 trazas: repetir pasos 15,7 %, no saber cuándo terminar 12,4 %, ignorar la
  especificación 11,8 %; agregar verificación del objetivo mejoró 15,6 %
  ([MAST](https://arxiv.org/html/2503.13657v3)).
- AGENTS.md corto como índice (~100 líneas), el repo como memoria, linters y tests como contrato
  ([Harness engineering, InfoQ](https://www.infoq.com/news/2026/02/openai-harness-engineering-codex);
  [agents.md](https://agents.md)).
- Humano en lo irreversible ([Project Vend 2](https://www.anthropic.com/research/project-vend-2):
  lo que mejoró fue CRM, checklists y verificación; el agente «CEO» del mismo modelo aportó poco).

## Opciones comparadas

| Opción | ¿Sirve a ONIA? | Por qué |
|---|---|---|
| Programa fijo en la PC + `claude -p` / `codex exec` | **Sí (elegida)** | Tiene todo lo local; suscripciones usadas como manda cada proveedor |
| Hermes Agent (VPS) | Como canal | Telegram y cron andan; kanban joven (5+ bugs abiertos en 48 h); Claude Max no se puede usar desde ahí |
| OpenClaw | No | ~730 avisos de seguridad, 341+ skills maliciosas en ClawHub, regresiones 2026.10.x |
| Clicky | No | Asistente de voz para Mac ([YC](https://www.ycombinator.com/companies/heyclicky)) |
| Claude Code Routines | Complemento | Nube 24/7, pero sin tus skills ni PC; mínimo 1 h; solo GitHub |
| Projects (beta) | No para producir | Hilos sin tu setup; «Work locally» bloqueado por trusted devices |
| Agent SDK / Managed Agents | Más adelante | Exige API key (pago por token) y programar |
| Codex automations | Parcial | Necesitan la app abierta y el disco local |
| Devin, Jules, Copilot agent | No | Piden spec precisa y cobran por uso |

## Autonomía por área (estimación con fuentes)

| Área | Autónomo | Qué queda para Sergio Urcullo |
|---|---|---|
| Plataforma (código con tests) | 50-70 % | Merge a producción, base de datos, plata |
| Edición de video mecánica | 60-80 % | Ver la tabla de cortes y el preview |
| Investigación | ~60 % | Conclusiones; los enlaces se verifican solos (3-13 % salen inventados sin check: [arXiv 2604.03173](https://arxiv.org/abs/2604.03173)) |
| Marca personal | 30-50 % | Voz, ángulo, aprobar y grabar |
| Comunidad, talleres, ventas | 5-15 % | La relación y el cierre ([CRMArena-Pro](https://arxiv.org/abs/2505.18878): 35 % multi-turno) |

## Pendiente (no se hizo en esta sesión)

- VPS: apagar el servicio de sistema duplicado de Hermes, pausar `onia-ordenador-tablero` y sacar
  las credenciales OAuth de Anthropic del pool de Hermes. Es infra con dueño: la madre la tenía
  tomada el 18-oct (login de Codex en Hermes).
- Las 47 tareas viejas del tablero `onia` de Hermes: archivarlas o pasarlas a la cola nueva.
- Bajar el arranque de las sesiones: sacar `~/.claude/rules/zh` (duplicado en chino), recortar el
  CLAUDE.md del proyecto (38 KB) y dejar los plugins ruidosos solo donde se usan.
