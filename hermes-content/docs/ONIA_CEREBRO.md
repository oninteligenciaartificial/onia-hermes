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

## La regla de entrega — qué le llega a Sergio Urcullo, y cuándo

> Sergio Urcullo, 2026-09-29: *"quiero que [Hermes] me avise cosas que tal vez no puedo ver
> porque mi computadora está apagada… pero no cosas innecesarias. Ahora mismo me envían
> muchísimas cosas que no me aportan nada… me manda puros errores, errores, errores.
> Simplemente que me envíe poquitas cosas"*. Ese mismo día eligió, una por una, las cuatro
> interrupciones y los dos horarios de abajo.

**El canal es Telegram (Hermes).** Nada de panel (bajado dos veces, ver la sección siguiente).

| Qué | Cuándo | Qué lleva |
|---|---|---|
| ☀️ **Resumen de la mañana** | **06:30** La Paz | agenda del día · prospectos esperando · guiones para grabar hoy · decisiones (máx. 5, con `ok <id>`) · lo que pasó de noche · UNA línea de salud del sistema |
| 🌙 **Cierre del día** | **22:00** La Paz | qué se hizo hoy, en castellano llano · qué sigue esperando · el primer compromiso de mañana |
| 🔔 **Interrupción** | al momento, **solo** entre 06:30 y 22:00 | una de las cuatro de abajo, y nada más |

**Las cuatro interrupciones (elegidas por él):**
1. **Un prospecto o cliente escribió y nadie contestó.**
2. **Una reunión en 30 minutos, o un cambio en su agenda.**
3. **Algo espera su OK** — plata, publicar, desplegar. De a una, con `ok`/`no`.
4. **El producto se cayó para los clientes** — y **solo si no se arregló solo en 30 minutos**.

**Todo lo demás NO le llega**:
- **Lo que el sistema puede arreglar solo** (CI, loops, discos, Sentry, backups, n8n que
  falla) va al tablero, como desde el 2026-09-08. A él le llega como UNA línea en el resumen:
  «✅ sano» o «N cosas rotas que el sistema no arregló solo».
- **Lo informativo** (radares, reportes de agentes, «publicado», «rescatado») va al resumen
  o a ningún lado.
- **De 22:00 a 06:30 no suena nada.** Lo que haya pasado de noche aparece en el resumen de
  las 06:30.

**Cómo se hace cumplir — una sola aduana.** Todo aviso pasa por `onia-tg.sh`, con su
categoría: `ONIA_AVISO=interrumpe | resumen | sistema` (por defecto `sistema`). La aduana
hace cumplir el horario de silencio, no repite el mismo aviso antes de 6 h, espera N minutos
antes de avisar una caída (`ONIA_AVISO_ESPERA`) y, si la caída se arregla antes, no avisa
nada. **Un emisor que le habla a Telegram por su cuenta, sin pasar por la aduana, es un bug.**

**Por qué así y no de otra forma** (medido, no opinado):
- El 2026-09-04 le llegaron **443 mensajes en un día**. El arreglo del 08-sep los volvió
  tareas del tablero, pero dejó ~25 emisores que le hablan directo, sin pasar por el
  enrutador (inventario del 29-sep).
- Y cortó el canal al revés: el aviso de **5 prospectos reales esperando 23-28 días** —uno
  de ellos una clínica evaluando un sistema, justo el cliente de la etapa vigente— se volvió
  una tarea que nadie leía (`handoff/infra-cerebro-loops.md`). **Callar no puede ser el
  precio de no molestar**: por eso el prospecto es la interrupción número uno.

## La superficie: Glance, no HTML propio

> ⚠️ **Corregido el 2026-09-29 — esta sección ya no es vigente.** El panel (Glance y los
> dos anteriores) se **apagó** el 17-sep por decisión de Sergio Urcullo: *"mucha
> información innecesaria"*; el canal es **solo Telegram** (`handoff/infra-cerebro-loops.md`,
> §2 y §5). Acá seguía escrito como decisión en curso, y el paso 1 del roadmap mandaba a
> construirlo: una sesión nueva lo habría levantado por tercera vez. Se conserva como
> historia; el contenedor `onia-glance` está parado y nada se borró.

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

1. ~~**Superficie Glance**~~ — ⚠️ descartado el 2026-09-17 (ver arriba). En su lugar:
   **la regla de entrega** — hecho = 24 h medidas en su Telegram con solo el resumen, el
   cierre y las cuatro interrupciones.
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
