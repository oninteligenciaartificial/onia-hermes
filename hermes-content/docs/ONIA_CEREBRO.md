# ONIA Cerebro — estructura

Fuente de verdad del "cerebro" de Sergio Urcullo. Un tema, un archivo, sin fecha.

> Nace del 2026-09-17: tres paneles anteriores murieron (ONIA Center, Control Tower,
> cerebro-Codex) y el cuarto intento salió sin estructura. Sergio Urcullo: *"no lo sabes
> estructurar, aprende a desarrollarlo y que sea realmente funcional"*. La estructura de
> abajo NO es inventada: es la arquitectura de referencia de los chief-of-staff open
> source probados (willLin-creator/ai-chief-of-staff), mapeada sobre lo que ONIA ya
> tiene corriendo. **La lección: el Cerebro no es un panel — es un sistema de 5 capas,
> y el panel es solo su cara.**

## Las 5 capas, y qué existe de cada una

| capa | qué es | qué YA corre en ONIA | qué falta |
|---|---|---|---|
| **1. Identidad y objetivos** | qué importa esta semana; contra qué se prioriza TODO | `ONIA_ESTRATEGIA_DE_EMPRESA.md` (etapa vigente) + CLAUDE.md | un `goals.yaml` operativo que los agentes lean cada vuelta (hoy la etapa vive en prosa) |
| **2. Captura** | todo lo que entra se registra en un solo lugar | loops → tablero (`onia-tablero.sh`) · avisos → tareas `[auto:]` · logs/rsync | **triage de mensajes entrantes** (WhatsApp/Chatwoot/correo — hoy "5 desconocidos sin contestar" vive como tarea suelta) · calendario real · noticias (loop `tendencias`, congelado) |
| **3. Memoria** | hechos atómicos + lecciones que no se repiten | `/root/.hermes/memories/MEMORY.md` (290+ hechos, dedup, inyectada a los 15 loops) + `onia-aprender.sh` | ✔ completa — es la capa más madura |
| **4. Razonamiento programado** | agentes con horario que triagen y priorizan contra los objetivos | `weekday-work-agenda` 08:00 · `daily-content-video-plan` 08:10 · `ordenador-tablero` 2×/día · `veredicto-sergio` 16:00 (todos gpt-5-mini/nano, verdes desde 17-sep) | triage de mediodía · cierre nocturno · week-in-review de viernes (existen como jobs `hermes-*` pausados) |
| **5. Entrega y acción** | te llega solo, y decidís desde ahí | Telegram (parte diario + veredicto) · **voz 08:25** (`onia-jarvis-voz.sh`, ElevenLabs Daniel) · circuito `ok/block` | **la superficie visual** (abajo) |

Regla heredada de la referencia y que ONIA ya cumple: **el Cerebro nunca actúa hacia
afuera sin aprobación** — la autonomía termina en tu canal.

## La superficie: Glance, no HTML propio

Decisión 2026-09-17: el visor se monta sobre **[Glance](https://github.com/glanceapp/glance)**
(33k ⭐, AGPL-3.0, un binario <20 MB, widgets por YAML, <25 MB RAM) en vez de mantener
una página propia. Motivo: dos páginas propias ya se rechazaron; Glance trae la calidad,
el móvil y el theming resueltos, y sus widgets (`custom-api`, `rss`, `monitor`,
`calendar`) leen lo que el agregador ya produce.

- El agregador `onia-cerebro-datos.py` (cron `*/15`) sigue siendo la fuente: junta
  agenda, guiones, decisiones del tablero, Hermes, loops, publicador y salud en
  `data.json`. Glance lo consume con `custom-api`; noticias entran por `rss`.
- Solo `127.0.0.1` del VPS + túnel SSH. Exponerlo con dominio exige auth delante.
- El panel v1 propio quedó BAJADO (2026-09-17); su HTML queda en
  `scripts/cerebro/` como historia.

## Roadmap con "hecho" medible

1. **Superficie Glance** — hecho = Sergio la abre por el túnel y la usa una semana sin
   pedir volver a Telegram-solo.
2. **`goals.yaml`** (capa 1) — hecho = la agenda matutina cita el objetivo de la etapa
   en su priorización, todos los días.
3. **Triage de entrantes** (capa 2) — hecho = cero "desconocido sin contestar" con más
   de 24 h; cada entrante termina en el tablero con borrador de respuesta.
4. **Cierre nocturno + week-in-review** (capa 4) — hecho = el viernes llega una
   retrospectiva con máximo 3 cambios propuestos, con evidencia.
5. **Reuniones** (cuando existan reuniones reales) — transcripción Speaches → acciones
   al tablero. No antes: no se construye para reuniones que no ocurren.

Cada paso se enciende SOLO — nada de abrir los cinco frentes juntos. El orden lo manda
la etapa vigente del negocio.
