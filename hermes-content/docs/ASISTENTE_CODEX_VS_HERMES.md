# Asistente de Codex vs Hermes: cuál usamos

> Fuente de verdad del tema. Nace de la pregunta de Sergio Urcullo del 2026-10-08: *«analiza el asistente
> de OpenAI que tiene Codex, si usamos ese o usamos Hermes»*. Si algo cambia, se edita este archivo; no
> se crea otro con fecha. Lo marcado **(no verificado)** sale de fuentes secundarias o de inferencia.

## Recomendación

1. **Hermes sigue siendo el asistente 24/7 por Telegram, y lo que falta es encenderlo.** La capa Jarvis
   (resumen, cierre, aduana, calendario y pedidos a Claude) está en `main` y apagada en el VPS. Espera 3 decisiones de Sergio Urcullo.
2. **Codex queda como ejecutor en la PC, no como asistente.** Sus tareas programadas, el control remoto,
   el navegador y la voz necesitan la PC encendida y la app abierta, y no hablan por Telegram.
3. **dots, el asistente 24/7 de OpenAI, no se puede usar hoy:** en Pro exige mayor de 18, no tiene Telegram
   ni WhatsApp, y lo que delega gasta el mismo cupo semanal de Codex. Se vuelve a mirar si cambia alguna de las tres cosas.

---

## 1. Qué es «el asistente de Codex» hoy: tres piezas distintas

Desde el 9-jul-2026 Codex vive dentro de la app de escritorio de ChatGPT (ya no hay una «Codex app» aparte).

| Pieza | Qué hace | ¿Corre con la PC apagada? | Estado en la cuenta de Sergio Urcullo |
|---|---|---|---|
| **Tareas programadas** (automatizaciones) | Un *heartbeat* que vuelve a un hilo o una tarea con horario (RRULE). El resultado cae en la vista *Scheduled* de la app | **No** si usa archivos locales: la doc pide *«keep the computer on and the app running»*. Las tareas web sin carpetas locales: la doc no lo aclara **(no verificado)** | 2 heartbeats, los dos `PAUSED`. 0 activas |
| **Control remoto** desde la app ChatGPT del celular | Le manda prompts y aprobaciones al Codex de la PC y avisa cuando termina | **No**: si la PC duerme, *«remote access stops»* | 1 emparejamiento del lado de la PC (`enabled=1`, 8-oct). No se sabe si el celular está emparejado |
| **dots** (anunciado en el DevDay del 29-sep-2026) | Agente con computadora y navegador propios en la nube. Habla por ChatGPT, Slack y Teams | **Sí** | **Bloqueado**: Pro lo da solo a *«users over 18»* y Sergio Urcullo tiene 16. Además se habilita *«gradually»* |

---

## 2. Comparación por necesidad

| Necesidad de Sergio Urcullo | Hermes (VPS + Telegram) | Asistente de Codex | Gana |
|---|---|---|---|
| **Funciona 24/7 con la PC apagada** | Sí. Gateway systemd v0.21.0 vivo desde el 18-sep con 0 reinicios (medido el 1-oct) | Las tareas locales y el control remoto no. dots sí, pero está bloqueado por edad. Codex Cloud sigue con la PC dormida, pero corre tareas de código, no de asistente | **Hermes** |
| **Le habla por el celular** | Telegram, bot por polling, solo su usuario | App ChatGPT (control remoto en *preview*) y solo con la PC prendida. Sin Telegram ni WhatsApp. El SMS de dots está en beta solo en EE.UU. **(no verificado)** | **Hermes** |
| **Resumen 06:30 y cierre 21:30** | Construido y probado contra un VPS simulado con CI verde. **Apagado**: `aplicar` nunca corrió. El cron de agenda sí entregó (21-sep 08:02) | Se podría armar como tarea programada, pero cae en la vista *Scheduled*, no en Telegram, y si lee archivos locales necesita la PC | **Hermes**, una vez encendido |
| **Calendario (leer y agendar con su sí)** | Lectura por n8n con la credencial Google del calendario de Sergio Urcullo. La escritura nunca se probó en real. Apagado | Plugin `google-calendar` instalado y habilitado. No se sabe si tiene OAuth ni con qué cuenta **(no verificado)**. Solo funciona con la PC y la app | **Empate**: ninguno está probado escribiendo. Hermes da el 24/7 |
| **Pasar pedidos a Claude** | Diseñado y en `main`: código de 6 dígitos, rutina en la nube, PR en borrador y respuesta por la aduana. **Nunca corrió de punta a punta** (faltan entorno, rutina, llave y `aplicar`) | No llega a las sesiones de Claude | **Hermes** |
| **Pasar pedidos a Codex** | No tiene vía | Desde el celular por control remoto (con la PC prendida) o desde la madre con `scripts/codex-tarea.sh` (vía medida el 8-oct) | **Codex** |
| **Aprobaciones ok/block** | Vivo desde el 3-sep: el vigía manda la tarea y `ok <id>` la desbloquea. No se volvió a medir después del 21-sep | Solo aprueba comandos de sus propias tareas en la PC | **Hermes** |
| **Costo mínimo** | API ~US$12,33 en 30 días (97,6% del gasto de IA de Onia, medido el 2-oct), dentro de un tope de US$50 compartido con el bot. El VPS ya se paga | Sin plata extra (Pro 100, US$100/mes, ya se paga). Pero el cupo semanal llegó al 99% el 28-sep y se agotó 3 semanas seguidas: un asistente le come semana al ejecutor | **Hermes** para el asistente |
| **Que lo mantenga una sola persona** | Software de terceros (NousResearch) en un único VPS. Ya hubo fallas mudas: 12 de 13 trabajos fallaron 9 días sin que nadie se enterara, y estuvo 8-11 días sin crédito | Lo mantiene OpenAI, pero depende de esta PC: hay 325 MiB libres en disco (Codex falla con menos de 1 GiB) y el sandbox elevado de Windows falla | **Empate con riesgo** en los dos |
| **Secretos en su lugar y permisos** | SOUL sin publicar, sin gastar y sin escribir a terceros. El código del pedido no lo ve Hermes. Riesgo abierto: `GH_ACTIONS_TOKEN` en el entorno `Onia` | Config al máximo: `approval_policy="never"`, `sandbox_mode="danger-full-access"` y en el navegador descargas `never_ask`. Un heartbeat reactivado corre sin preguntar | **Hermes** |
| **Que no se caiga** | Vivo desde el 18-sep. Lo último medido es del 1-2 oct y no se volvió a medir | Se cae cuando la PC duerme, se cierra la app o la app se actualiza **(lo último no verificado)** | **Hermes** |
| **Voz** | Audio matinal con ElevenLabs, de ida solamente (probado el 17-sep) | Dictado y voz en la app (se usó el 2-oct). ChatGPT Voice dirige Codex por voz **(no verificado, no probado en español)** | **Codex**, en la PC |
| **Trabajar en la PC (archivos, navegador, repos)** | No, por diseño | Sí: es lo que mejor hace (570 hilos y 165 subagentes registrados) | **Codex** |
| **Respuestas cortas** | Se fija en el SOUL | Se fija en el AGENTS.md | Empate |

---

## 3. Opciones consideradas

| Opción | Veredicto | Por qué |
|---|---|---|
| A. No cambiar nada | **No** | Hoy Hermes solo difunde los cron. La capa que pidió Sergio Urcullo (resumen, cierre, aduana, calendario, pedidos) está apagada: dejarlo así es quedarse sin asistente. |
| B. Cambiar Hermes por tareas programadas y control remoto de Codex | **No** | Necesita la PC prendida, no tiene Telegram, gasta el cupo del ejecutor y corre con los permisos al máximo. |
| C. Cambiar Hermes por dots | **No se puede** | Edad, canales, cupo y despliegue gradual. No se usa la cuenta de otra persona. |
| **D. Mixto: Hermes de asistente 24/7 y Codex de ejecutor** | **Sí (la recomendada)** | Cada uno queda en lo que ya funciona y no hay costo extra. |
| E. D más el celular emparejado con Codex | Opcional, después de D | Sirve para mandarle trabajo al ejecutor con la PC prendida. No reemplaza a Hermes. |

---

## 4. Plan

| # | Paso | Quién | Hecho cuando |
|---|---|---|---|
| 1 | Decidir los 3 pendientes del carril: sí o no al cambio del autosync, sí a los 3 MEDIUM, sí a cargar la llave y correr `aplicar` | **Sergio Urcullo** | Respuesta anotada en `handoff/hermes-jarvis.md` |
| 2 | Medir Hermes hoy en solo lectura: gateway activo, entregas de cron, mensajes en 24 h y gasto de LiteLLM desde el 2-oct (receta en la skill `onia-hermes-jarvis` § Medir en SOLO LECTURA) | **Madre**, con la autorización de Sergio Urcullo para entrar al VPS | Cifras en el handoff (prueba P1) |
| 3 | Cerrar los 3 MEDIUM y dejar #94 en `main` | **Carril Hermes-Jarvis** (nube) | CI verde y merge |
| 4 | Cargar la llave de la rutina y correr `aplicar`, que es todo o nada | **Madre** desde la PC, porque la nube no llega al VPS | `aplicar` OK y `diagnostico` verde |
| 5 | Correr las pruebas P2 a P5 | **Madre** y **Hermes-Jarvis** | Las 4 en verde |
| 6 | Codex sigue de ejecutor por `scripts/codex-tarea.sh`. Las 2 automatizaciones quedan `PAUSED` y no se crean nuevas | **Madre** (Codex no se toca) | `~/.codex/automations` sin cambios |
| 7 | Liberar disco: hay 325 MiB libres y Codex falla con menos de 1 GiB | **Sergio Urcullo** decide qué se borra; la **madre** se lo propone | `codex doctor` sin aviso de disco |
| 8 | Opcional: emparejar el celular con Codex (QR en Settings > Connections) | **Sergio Urcullo**, si lo quiere | Prueba P7 en verde |
| 9 | Revisar esta decisión si Sergio Urcullo cumple 18, si dots suma Telegram, WhatsApp o SMS fuera de EE.UU., o si las tareas de Codex corren en la nube sin la PC | **Madre** | Este doc editado |

---

## 5. Riesgos

- **Si no se deciden los 3 pendientes, nada cambia.** El cuello de botella nunca fue el modelo de Hermes:
  son operación y permisos (llave, rutina y `aplicar`). Cualquier otro asistente heredaría el mismo cuello.
- **Hermes, modelo barato:** `gpt-5-nano` inventó una agenda entera. Para tareas de juicio no sirve, solo
  para invocar scripts. Además la skill dice `gpt-5-mini` y MEMORY.md dice `gpt-5-nano`: no está claro cuál corre hoy.
- **Hermes, fallas mudas:** ya hubo 9 días con 401, 8-11 días sin crédito y trabajos apagados al bajar el
  modelo global. Comparte el tope de US$50 de LiteLLM con el bot, el editor y el redactor: si Hermes lo agota, los corta también.
- **Hermes, `GH_ACTIONS_TOKEN`** sigue en el entorno `Onia`: cualquier sesión podría despachar `aplicar`,
  revertir o deploy. Revocarlo lo decide Sergio Urcullo.
- **Codex, permisos al máximo:** si alguien reactiva un heartbeat, corre sin preguntar, con red y
  descargas libres. Eso choca con la regla de pedir permiso antes de descargar, publicar o gastar.
- **Codex, la PC misma:** 325 MiB libres, el sandbox elevado falla y faltan *rollout files*. El ejecutor está en riesgo hoy, con asistente o sin él.
- **Codex, cupo:** se agotó 3 semanas seguidas. Lo que se le sume como asistente, o lo que delegue un
  dot, sale de la misma semana del ejecutor.
- **dots y privacidad:** según terceros, las memorias del dot no se pueden ver ni borrar **(no verificado)**.

---

## 6. Pruebas antes de cambiar algo

| # | Prueba | Quién | Verde si |
|---|---|---|---|
| P1 | Hermes vivo hoy, en solo lectura: `hermes-gateway` activo, últimas entregas de cron, mensajes a Sergio Urcullo en 24 h, gasto de LiteLLM en 30 días | Madre (con autorización) | Gateway activo, crones entregando y gasto conocido |
| P2 | Un día completo con la capa encendida: resumen 06:30 y cierre 21:30 por la aduana, silencio de 22:00 a 06:30 | Madre | Le llegan los dos mensajes y nada fuera de las 4 interrupciones |
| P3 | Un pedido de tipo «consulta» a Claude de punta a punta: código de 6 dígitos, rutina, respuesta por la aduana. Antes, `--probar` para confirmar que el VPS llega a GitHub | Hermes-Jarvis y Sergio Urcullo (contesta el código) | La respuesta llega. Medir cuánto tarda |
| P4 | Calendario: crear y borrar un evento de prueba, con su sí | Hermes-Jarvis y Sergio Urcullo | El evento aparece y desaparece en su Google Calendar |
| P5 | Aprobación: una tarea `needs_input` de prueba y `ok <id>` | Madre | Se desbloquea y queda registrado |
| P6 | Solo si alguien propone pasar algo a Codex: una tarea programada inocua y de solo lectura, con la PC suspendida 1 h. Crea configuración en `~/.codex`, así que primero va el OK de Sergio Urcullo | Madre | Confirmar si corre o no: la doc dice que no |
| P7 | Opcional: con el celular emparejado, mandar un prompt de solo lectura al Codex de la PC. Repetirlo con la PC suspendida | Sergio Urcullo | El aviso llega con la PC prendida. Con la PC suspendida no corre, como dice la doc |
| P8 | Solo si se usa el calendario desde Codex: leer eventos con su conector `google-calendar` | Madre | Confirma si tiene OAuth y con qué cuenta |

---

## 7. Lo que no se sabe

- Si dots ya aparece en la cuenta y qué edad está registrada (no se abrió la app).
- El modelo de Hermes que corre hoy y su gasto después del 2-oct. Lo último medido en el VPS es del 1-2 oct.
- Si las tareas programadas web de ChatGPT corren con la PC apagada: la doc oficial no lo dice.
- El límite exacto de tareas programadas activas: las fuentes se contradicen.
- La calidad de la voz en español y lo que consume del cupo.
- Si los conectores Gmail y Calendar de Codex tienen OAuth concedido.

---

## 8. Fuentes

**OpenAI (oficiales, consultadas el 2026-10-08):**
- learn.chatgpt.com/docs/dots: elegibilidad (Pro, mayores de 18, fuera de EEE, Reino Unido y Suiza), canales, consumo de cupo.
- learn.chatgpt.com/docs/whats-new/devday-2026: anuncio de dots, 29-sep-2026.
- learn.chatgpt.com/docs/automations: tareas programadas, PC encendida y app abierta, disparadores por evento solo en web y móvil.
- learn.chatgpt.com/docs/remote-connections: control remoto, el host tiene que estar despierto.
- learn.chatgpt.com/docs/cloud: Codex Cloud con la PC dormida.
- learn.chatgpt.com/docs/notifications · learn.chatgpt.com/docs/pricing · learn.chatgpt.com/docs/changelog (7 y 8-oct).
- learn.chatgpt.com/docs/customization/memories · learn.chatgpt.com/docs/plugins.
- github.com/openai/codex `codex-rs/tui/src/subscription.rs`: `ProLite` es «Pro 100».

**Terceros (marcados como no verificado arriba):**
- techcrunch.com/2026/09/29/openai-launches-dots-its-bubbly-agentic-avatar/
- smartscope.blog: disponibilidad de dots y tareas con la PC cerrada (30-sep y 1-oct-2026).
- flaviocopes.com/openai-dots/ · datacamp.com/blog/openai-dots: FAQ de privacidad de dots.
- 9to5mac.com (14-may-2026): Codex en el celular.

**Medido en esta PC (8-oct, solo lectura, sin secretos):**
- `codex --version`, `codex doctor`, `codex features list`, `codex plugin list`.
- `~/.codex/automations/*/automation.toml`, `~/.codex/config.toml` (sin valores sensibles).
- Agregados de `state_5.sqlite`, `goals_1.sqlite` y `memories_1.sqlite`.

**Repo Onia:**
- `hermes-content/docs/handoff/hermes-jarvis.md` (estado del 5-oct y pendientes de Sergio Urcullo).
- `.claude/skills/onia-hermes-jarvis/SKILL.md` · `hermes-content/docs/HERMES_AGENT.md` · `hermes-content/docs/TELEGRAM_COMMAND_CENTER.md`.
- `hermes-content/docs/research/ONIA_INVENTARIO_IA_20261002.md`: costo de Hermes.
- `hermes-content/docs/research/onia-1.0-29sep/FRENTES_DE_APOYO.md` §2: `plan_type=prolite` y 99% del cupo semanal el 28-sep.
- Memoria: `codex-cuenta-y-reparto.md` (cupo agotado 3 semanas, `codex-tarea.sh`), `sergio-menor-de-edad-quien-firma.md` (16 años, confirmado el 25-jul).
