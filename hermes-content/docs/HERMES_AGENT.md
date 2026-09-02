# Hermes Agent — la capa que decide QUÉ importa

> Doc vivo, sin fecha en el nombre: se **EDITA**, no se duplica.
> Escrito el **2026-09-02**, el día que se descubrió que llevaba nueve días muerto por dentro.

---

## 🔴 Lo primero: hay DOS cosas llamadas "Hermes", y confundirlas cuesta

| | Qué es |
|---|---|
| **`onia-hermes`** | **El repo.** Este mismo. El cerebro documental de Onia: docs, skills, colas, propuestas, el core. |
| **Hermes Agent** | **Un producto de terceros.** Agente autónomo de [NousResearch](https://github.com/NousResearch/hermes-agent), MIT, instalado en el VPS. Este documento habla de éste. |

⚠️ **Corrección al registro anterior.** La memoria del proyecto decía *"Hermes = cerebro Python
en `/root/.hermes`"*, como si fuera algo nuestro. **No lo es**: `/root/.hermes/` es la carpeta de
configuración de Hermes Agent, y el programa vive en `/usr/local/lib/hermes-agent`.

---

## Qué hace, y por qué no se superpone con los loops

**No programa.** De programar se encargan los siete loops de Claude Code
([`cola/EQUIPO.md`](cola/EQUIPO.md)), cada uno con su carril, su cola y su rama.

Hermes está **una capa arriba**, y cubre el único agujero que los loops no pueden cubrir solos:

> Cada loop toma el próximo ítem **de su propia cola**. **Ninguno decide qué importa más esta
> semana**, ni mira el conjunto, ni le dice a Sergio en qué gastar el día.

Su producto es **una prioridad ordenada o una decisión tomada**, no un informe.

Cuando necesita que se programe algo, **delega a Claude Code** — su skill `claude-code` corre
`claude -p ... --allowedTools ...`, exactamente lo que hace `onia-loop.sh`. O sea: **piensa con
un modelo pago barato y el trabajo pesado lo hace la suscripción que ya se paga.**

---

## Los 12 trabajos programados — la semana de Sergio

Todos entregan por **Telegram**. Horarios en **UTC** (restar 4 para La Paz).

| trabajo | cuándo (UTC) | qué produce |
|---|---|---|
| `hermes-weekday-work-agenda` | 12:30 lun-vie | **Agenda del día**: revisa pendientes y propone 3 prioridades |
| `hermes-weekly-kickoff` | 12:00 lunes | **Kickoff semanal**: la semana en 3 objetivos de negocio |
| `hermes-daily-operational-status` | 13:00 | Estado operativo: gateway, Video Lab, servidor de assets |
| `hermes-daily-onia-videolab` | 13:00 | Video Lab de Onia |
| `hermes-daily-content-video-plan` | 16:00 | Guiones de video para 3 cuentas |
| `hermes-daily-video-lab-followup` | 22:00 | Cierre de Video Lab: jobs pendientes de aprobación |
| `hermes-tuesday-prospecting` | 13:30 martes | Prospección |
| `hermes-wednesday-build-sprint` | 14:00 miércoles | Sprint de construcción |
| `hermes-thursday-content-production` | 14:00 jueves | Producción de contenido |
| `hermes-friday-finance-ops-review` | 19:00 viernes | Revisión de finanzas y operación |
| `hermes-saturday-sergio-brand` | 14:00 sábado | Marca personal de Sergio |
| `hermes-sunday-weekly-review` | 21:00 domingo | Revisión semanal |

⏸️ **Pausado el 2026-09-02:** `hermes-daily-content-arthur`. **Arthur ya no colabora con Onia**
(dicho el 2026-08-23) y el trabajo seguía activo. Un trabajo vencido que corre es peor que uno
que falta: produce material para alguien que no está.

---

## 🔴 Nueve días muerto, y nadie se enteró

**Del 24-ago al 2-sep, 12 de sus 13 trabajos fallaron TODOS los días** con
`RuntimeError: Connection error.` **Sus dos API keys daban 401.** Arrancaba puntual cada día,
moría en silencio, y se descubrió de casualidad mirando otra cosa.

Es el mismo modo de falla que ya mordió tres veces esta semana: **algo programado que corre,
falla y no avisa.** Ver el bloque *"TU CARRIL TIENE QUE PODER FALLAR A LA VISTA"* en
[`scripts/loops/BLOQUE_PODER_FALLAR.md`](../../scripts/loops/BLOQUE_PODER_FALLAR.md).

**La cura mecánica:** `/root/bin/hermes-vigia.sh` (versionado en
[`scripts/loops/hermes-vigia.sh`](../../scripts/loops/hermes-vigia.sh)) corre **cada hora al
minuto 12** y avisa por Telegram cuando un trabajo falla — **una vez por incidente**, no una por
hora — y avisa también la recuperación. Probado en los dos sentidos antes de dejarlo.

---

## El modelo: por qué NO se compró una key

Hermes necesita **su propio modelo pago**. La suscripción de Claude Code **no se le puede
enchufar**: `hermes login` sólo hace OAuth con `nous`, `openai-codex` y `xai-oauth` — **no hay
OAuth de Anthropic**.

Pero no hizo falta comprar nada: el VPS ya tenía **LiteLLM** (open source, MIT) sano, con una key
de OpenAI que **sí funciona**.

```
Hermes  →  http://127.0.0.1:4000/v1  (LiteLLM)  →  OpenAI
```

- Config del enrutador: `/opt/onia-selfhosted/litellm.config.yaml`
- Config de Hermes: `/root/.hermes/config.yaml` (`base_url`, `default`, `provider: openai-api`)
- **Tope de gasto: US$ 50 / 30 días**, aprobado por Sergio el 2026-07-22, dentro de LiteLLM.

**Modelo: `gpt-5.1`.** Estaba en `gpt-4.1-mini` **no porque la cuenta no diera para más**, sino
porque el archivo de LiteLLM sólo listaba tres modelos `mini`. La cuenta tenía acceso a `gpt-5.1`
todo el tiempo. Agregados `gpt-5.1` y `gpt-5-mini` como respaldo.

---

## Sus instrucciones le hacían romper las reglas de la casa

Su `SOUL.md` decía que Onia vende *"DentalGest, SaaS para clínicas dentales"* y *"Gestios"*
—hoy **nombres viejos de packs, no productos**— y le pedía **"casos de éxito y demos"** con
**cero clientes pagando**. Eso no es un doc desactualizado: **es una orden de inventar prueba
social**, que es exactamente lo que `CLAUDE.md` prohíbe.

Reescrito. La fuente versionada está en
[`hermes-content/deploy/hermes-agent/SOUL.md`](../deploy/hermes-agent/SOUL.md) y se despliega a
`/root/.hermes/SOUL.md`. **Los dos, o el que corre queda huérfano.**

---

## Cómo se opera

**El panel** (Sessions · Models · Logs · Cron · Skills · Plugins · Profiles · Config · Keys ·
Kanban) corre en el VPS atado a `127.0.0.1:9119`. **No se expone a internet**: su propia ayuda
avisa que hacerlo **publica las API keys**. Se ve por túnel:

```bash
ssh -i ~/.ssh/onia_hermes_vps_ed25519 -N -L 9119:127.0.0.1:9119 root@187.77.16.63
```

Y abrir **http://127.0.0.1:9119**.

**Por línea de comandos**, desde el VPS (`export HOME=/root`):

| para | comando |
|---|---|
| Estado general | `hermes status` |
| Ver los trabajos | `hermes cron list` |
| Disparar uno | `hermes cron run <id>` y después `hermes cron tick` |
| Pausar / reanudar | `hermes cron pause \| resume <id>` |
| Una pregunta suelta | `hermes -z "…"` |
| Diagnóstico | `hermes doctor` |

El binario real es `/usr/local/lib/hermes-agent/venv/bin/python -m hermes_cli.main`.

---

## Lo que tiene y todavía NO usamos

- **Kanban** — tablero en SQLite compartido entre perfiles, con **tareas reclamadas
  atómicamente**, dependencias y ejecución en espacios aislados. Resuelve de raíz el problema que
  hoy tapamos con reglas escritas: **las colas de los loops son archivos de texto que se pisan.**
  Es el candidato más fuerte a reemplazarlas, y merece una prueba antes de adoptarlo.
- **`hermes peer`** — mensajería entre agentes.
- **Centro de control MCP** — salud y costo de los servidores MCP.
- **Gateway multi-canal** — hoy sólo Telegram; soporta WhatsApp, Discord, Slack, Signal.

**Versión instalada: `v0.21.0` (2026-08-31), al día con el repositorio oficial** (cero commits
atrás, verificado el 2026-09-02). ⚠️ `hermes --version` puede reportar la versión del paquete del
venv y no la del código: si dan distinto, gana `git describe` en `/usr/local/lib/hermes-agent`.
