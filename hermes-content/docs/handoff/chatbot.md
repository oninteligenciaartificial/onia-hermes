# Handoff — carril `chatbot`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: 2026-08-23 (segunda pasada del mismo día — la primera fue del carril de
> contenido, ver más abajo qué de eso se re-verificó y qué resultó ser correcto).

---

**Objetivo**

Que el bot público de `onia.com.bo` conteste, y que el widget deje de decirle a cada
visitante que no hay nadie. *Hecho* = abrir el widget en el sitio, mandar dos mensajes y
**VER la respuesta en pantalla** (no en la base), sin cartel de ausencia.

**Resultado: objetivo CUMPLIDO y verificado MIRANDO la pantalla.** Con un hallazgo nuevo que
queda a medias (latencia real ~11-40 s, ver abajo) y un bug de fondo diagnosticado pero no
tocado a propósito (toca el motor vivo).

---

**Qué quedó EN PRODUCCIÓN**

### 1. El widget ya NO muestra el cartel de ausencia — FIX aplicado y verificado

Causa raíz encontrada leyendo el código fuente de Chatwoot 4.12.1 en el propio contenedor
(`/app/app/models/concerns/availability_statusable.rb`), no adivinada:

```ruby
def user_availability_status
  return availability unless auto_offline
  online_presence? ? (::OnlineStatusTracker.get_status(...) || availability) : 'offline'
end
```

Con `auto_offline = true` (como estaban los dos usuarios), Chatwoot **ignora la columna
`availability`** y exige presencia real por ActionCable/Redis (`online_presence?`). Como
nadie mantiene una conexión websocket viva al dashboard, esa función devuelve `'offline'`
siempre, sin importar qué diga la columna. Y en el frontend
(`app/javascript/widget/composables/useAvailability.js`, función `isOnline()`):

```js
if (!workingHoursEnabled) return hasOnlineAgents;   // ya es el caso del inbox 4
```

— o sea que **el candidato "activar `working_hours` 24/7" del handoff anterior no habría
arreglado nada**: con `workingHoursEnabled=false` el resultado YA es `hasOnlineAgents` solo,
y con `workingHoursEnabled=true` sería `inWorkingHours && hasOnlineAgents` — mismo requisito.
El único gobernante real es `auto_offline`.

**FIX aplicado** (única escritura de datos de esta sesión, además de la ya hecha por el
carril anterior):

```sql
update account_users set auto_offline = false where id = 2;  -- user_id=3, el bot, account_id=2
```

**Rollback exacto:** `update account_users set auto_offline = true where id = 2;`

**Verificado en tres capas, sin adivinar ninguna:**
- API pública `GET https://chat.onia.com.bo/api/v1/widget/inbox_members?website_token=9k5i7xnAgCbSse1EZwVChZLw`
  pasó de `{"id":3,"name":"Onia Bot","availability_status":"offline"}` a `"online"`.
- Playwright abrió `https://onia.com.bo`, hizo click en la burbuja y el iframe del widget
  mostró **"Estamos en línea / Normalmente responde en unos minutos"** — en español, sin
  cartel de ausencia. Captura: `3-widget-open.png` (ruta abajo).
- Se dejó **sin tocar** el usuario 2 (Sergio): su `auto_offline` sigue en `true`, su
  disponibilidad real no se falsea.

### 2. El bot SÍ responde de punta a punta — verificado MIRANDO, no con HTTP 200

Se abrió el widget, se inició una conversación real y se mandaron 3 mensajes en 2
conversaciones distintas (la cuota es 6 conversaciones nuevas por IP cada 12 h — quedan 4).
El motor contestó las 3 veces con texto real, en carácter, citando el pitch de Onia y
ofreciendo horarios de demo. Texto completo capturado en el log de la sesión; capturas en
`5-msg2.png` y `6-msg3.png`.

### 3. Latencia — MEDIDA con 3 muestras reales, no una intuición

| Muestra | Contenido | Tardanza |
|---|---|---|
| msg1 (primer mensaje de una conversación) | "Hola, ¿qué es Onia?" | **1.08 s** |
| msg2 (segundo mensaje, misma conversación) | "¿Cuánto cuesta?" | **40.63 s** |
| msg3 (primer mensaje de otra conversación) | "¿En qué rubros trabajan?" | **1.02 s** |

Patrón claro: el **primer** mensaje de cada conversación siempre pega contra una plantilla
guionada (M0, sin LLM) y por eso es casi instantáneo. La lentitud real aparece en cuanto el
motor tiene que generar con el LLM.

**Diagnóstico de dónde se va el tiempo** (medido, no supuesto — no se tocó nada, según pide
el punto 4 del encargo): un `POST /v1/chat/completions` DIRECTO a LiteLLM
(`http://onia_selfhosted-litellm-1:4000`), modelo `gpt-4o-mini`, con un prompt trivial de 12
tokens ("di hola en una palabra", 3 tokens de respuesta), tardó **13.4 s** y **11.2 s** en
dos corridas consecutivas desde dentro de `onia-center`. Ese piso de 11-13 s por sí solo ya
es la mayor parte de los 40 s observados en `msg2` (que además tiene un prompt bastante más
largo: system prompt + conocimiento + historial). **Conclusión: el cuello de botella está en
el tramo LiteLLM→OpenAI (o en el propio LiteLLM), no en el código del bot, no en Chatwoot, no
en n8n.** Vender esto como "responde al instante" es falso mientras esto no baje. No se tocó
la configuración de LiteLLM (`request_timeout: 120`, sin retries extra visibles en
`config.yaml`) — queda para una sesión que investigue el tramo de red/proxy específicamente.

### 4. Dónde vive el motor de verdad — resuelto: es la arquitectura, no una regresión

`/opt/onia/bot/` (host) y `/tmp/onia-bot/` (dentro de `onia-center`) son **exactamente el
mismo código** — `sha256sum` de los 44 `.mjs` idéntico byte a byte en ambos lados. No hay
divergencia ni riesgo de "editar donde no corre".

Es diseño intencional, documentado en los propios scripts (`webhook-server.sh`,
`webhook-watchdog.sh`): `/opt/onia/bot/` es la fuente; `webhook-server.sh start|restart`
calcula un hash (`md5sum` de todos los `.mjs`+`.json`) y sólo si cambió hace
`docker cp` hacia `/tmp/onia-bot` dentro del contenedor (que no sobrevive a que el
contenedor se recree) y relanza el proceso con `docker exec -d`. El cron
`*/2 * * * * webhook-watchdog.sh` sólo actúa si `/health` no contesta — es idempotente y no
reintenta si el contenedor no existe.

**Consecuencia operativa para quien siga:** editar `/opt/onia/bot/*.mjs` **no alcanza solo**.
Hay que correr `/opt/onia/bot/webhook-server.sh restart` a mano para que el cambio llegue al
proceso vivo (o esperar a que el watchdog lo haga cuando el health-check falle, lo cual no
está garantizado en un plazo corto).

---

**Qué quedó a medias, y dónde**

### A. 🟡 El burst de 56 arranques al iniciar el contenedor — diagnosticado, NO resuelto

Al momento de empezar esta sesión, `onia-center` acababa de arrancar (`StartedAt
2026-08-23T14:36:00Z`, confirmado con `docker inspect` y con el propio log de Next.js:
`Ready in 390ms` a las 14:36:03, una sola vez — el contenedor en sí NO se reinició en bucle).

Sin embargo `/tmp/onia-bot-webhook.log` (dentro del contenedor) tenía **56 líneas** de
`[onia-webhook] escuchando en :3020/webhook/chatwoot` — es decir, 56 arranques exitosos y
ordenados del proceso Node (cada línea sólo se imprime en un `listen()` exitoso, y para que
el siguiente arranque tenga éxito el anterior tuvo que soltar el puerto antes). Eso implica
**56 ciclos completos de matar+levantar el proceso**, todos concentrados en los primeros ~2
minutos de vida del contenedor.

**Lo que se descartó, verificado, no supuesto:**
- El log HOST del watchdog (`/var/log/onia-bot-watchdog.log`, con timestamp por línea)
  muestra **una sola** intervención para este arranque del contenedor: `14:36:01 AVISO: el
  contenedor no está corriendo` → `14:38:01 reiniciando... OK`. El cron NO puede explicar 56
  ciclos en 2 minutos (corre cada 2 min).
- `docker logs onia-center` confirma que el proceso PID 1 (Next.js) arrancó una sola vez.
- No hay cron ni supervisor DENTRO del contenedor que toque el puerto 3020 (sólo el
  `run-parts` de Alpine por defecto, nada relacionado).
- No hay referencia a `webhook-server`/`3020` en el código de la app Next.js del propio
  `onia-center` (sólo coincidencias falsas dentro de `node_modules`).
- `docker events` no tiene retención suficiente para reconstruir quién llamó
  `docker exec -d` 56 veces (buffer vacío para esa ventana).

**Estado actual (verificado, no asumido): NO está pasando ahora.** El PID que quedó vivo
(86) lleva corriendo estable desde el arranque — se confirmó 2 veces con varios minutos de
diferencia (`wc -l` del log se mantuvo en 56, mismo PID, `etime` creciendo de forma
consistente con el reloj). No es un loop activo hoy.

**Qué falta:** nadie sabe TODAVÍA quién disparó esos 55 arranques extra (sólo uno está
justificado por el watchdog). `webhook-server.mjs` no tiene timestamp por línea de log —
agregar uno (`log()` ya existe para otro propósito, sólo falta usarlo en el `listen()`
callback) volvería este patrón diagnosticable la próxima vez que aparezca, en vez de
depender de reconstrucción forense post-hoc. **No se tocó el código** porque cambiar
`webhook-server.mjs` es tocar el motor vivo — queda propuesto, no aplicado.

### B. 🔴 El bug de fondo del adapter — diagnosticado con precisión, NO arreglado (toca el motor vivo)

Confirmado el mecanismo exacto, no la sospecha genérica del handoff anterior:

- `bot-engine.mjs:237` — función pura `step()`, sin I/O por contrato — decide
  `deliveryStatus: next.channel === "sim" ? "simulated" : config.dryRun ? "skipped" : "sent"`
  **antes de que exista ningún intento real de postear a Chatwoot.**
- `run-turn.mjs:412` — `store.insertOutbound(replies, ...)` escribe esa fila en
  `onia_center.bot_messages` con ese `delivery_status` optimista, **todavía dentro de
  `run-turn.mjs`**, o sea antes de que `chatwoot-adapter.mjs` intente el POST real.
- Recién DESPUÉS, en `chatwoot-adapter.mjs:runChatwootTurn()`, se llama a
  `client.sendMessage()`. Si Chatwoot lo rechaza (401, 403, el caso real de este carril:
  falta de membresía en el inbox), el resultado queda como `posted:false` y el motivo entra
  en `warnings` — pero **eso vuelve en la respuesta HTTP del webhook y en el evento a n8n
  (analítica), nunca vuelve a tocar la fila que `insertOutbound` ya escribió como "sent"**.

La fila en `bot_messages` queda mintiendo para siempre. Es exactamente por qué el bot
estuvo mudo semanas sin que nadie lo notara: no hay ninguna consulta a la base que lo
delate, sólo contar mensajes salientes reales por inbox en Chatwoot (que es como lo encontró
el carril anterior).

**Por qué no se arregló ahora:** el arreglo correcto no es un parche de una línea. El
patrón ya existe en el propio archivo para otro flujo (`markMessageDelivered`, usado por
M9/recordatorios: reserva como `"reserved"`, y un PATCH posterior la mueve a `sent`/`failed`
según lo que de verdad pasó). Portar ese patrón al turno normal de Chatwoot implica:
1. Exponer `store` desde `runChatwootTurn` en `chatwoot-adapter.mjs` (hoy sólo recibe
   `client`, no `store`).
2. Después de cada `client.sendMessage()`, llamar
   `store.markMessageDelivered(messageKey, posted ? "sent" : "failed")`.
3. Decidir qué pasa con el `messageKey` de cada reply (bot-engine ya genera uno por mensaje;
   hay que confirmar que viaja completo hasta acá).
4. Tocar los 503 tests que son el contrato del motor — varios de `run-turn.test.mjs` y
   `chatwoot-adapter.test.mjs` fijan el orden actual (persistir → responder) como
   comportamiento esperado.

Esto es exactamente "tocar el motor vivo, compartido por TODOS los canales" (WhatsApp,
Telegram, no sólo Chatwoot) que el encargo pidió proponer y no ejecutar. Queda propuesto acá
con la ubicación exacta de las 3 líneas involucradas para que la próxima sesión no tenga que
re-diagnosticar.

### C. Datos de QA nuevos generados por esta verificación (NO se tocaron, per freno de mano)

Las pruebas de punta a punta crearon **2 conversaciones nuevas** en el inbox 4:
- Conversación `id=32` (Chatwoot), 9 mensajes — la de los 2 mensajes con latencia medida.
- Conversación `id=33` (Chatwoot), 5 mensajes — la de la 3ra muestra de latencia.

Se suman a las `id=29, 31` que ya existían del carril anterior. Nada se borró — sigue
prohibido y sigue pendiente de coordinar con el carril de la web (`ONIA_WEB_IMAGENES_DE_CONTEXTO.md`
§10) antes de tocar esta data.

### D. El bot de la ferretería no usa su conocimiento por org — SIGUE igual, no se tocó

Confirmado en el handoff anterior como diseño (paso "b" nunca implementado), no como
regresión. No se re-verificó en esta sesión porque el encargo lo excluyó explícitamente
("NO HAGAS el paso (b)").

---

**Archivos y cambios**

- Base `onia-chatbot` (contenedor `chatwoot-db`), cuenta Chatwoot `id=2`:
  - `update account_users set auto_offline = false where id = 2;` (rollback:
    `update account_users set auto_offline = true where id = 2;`).
  - 2 conversaciones de QA nuevas (`id=32`, `id=33`) con sus mensajes — dato, no esquema.
- **Ningún archivo del repo ni del VPS (`/opt/onia/bot/*`, `webhook-server.mjs`, etc.) se
  modificó.** Todo lo de la sección B queda como propuesta escrita, no como código.
- Capturas (fuera del repo, en el scratchpad de la sesión — rutas absolutas para quien
  retome):
  - `...\scratchpad\shots\1-landing.png` — landing antes de abrir el widget.
  - `...\scratchpad\shots\2-after-click.png` — primer intento, con el widget todavía
    rate-limiteado ("Retry later").
  - `...\scratchpad\shots\3-widget-open.png` — **el widget YA arreglado**: "Estamos en
    línea", sin cartel de ausencia, en español.
  - `...\scratchpad\shots\4-conversation-started.png`, `5-msg1.png`, `5-msg2.png`,
    `6-msg3.png` — la conversación real con las respuestas del bot en pantalla.
  - Directorio completo:
    `C:\Users\PC\AppData\Local\Temp\claude\C--dev-proyectos-onia-hermes--claude-worktrees-skills-setup-config-8d4674\3ec24535-dc2d-4e4d-b598-3cfca5bbac8f\scratchpad\shots\`

**Acceso:** VPS `187.77.16.63`, llave `~/.ssh/onia_hermes_vps_ed25519`.
Base: `docker exec $(docker ps -qf name=chatwoot-db) psql -U postgres -d 'onia-chatbot'`.
Chatwoot fuente en el contenedor `onia-chatbot_chatwoot.1.*`, código Ruby/Vue en `/app`.
LiteLLM: `onia_selfhosted-litellm-1`, config en `/app/config.yaml` dentro de ese contenedor.

---

**Intentos fallidos**

- **Confiar en el handoff heredado sin volver a leer el código fuente real.** El handoff
  anterior proponía DOS candidatos sin decidir ("activar `working_hours` 24/7 **o** apagar
  `auto_offline`"). Leyendo el código de Chatwoot 4.12.1 se confirma que **sólo uno de los
  dos hace algo** (`auto_offline`); el otro (`working_hours`) es un no-op mientras
  `workingHoursEnabled` siga en `false`, porque el propio `isOnline()` del frontend ya
  devuelve `hasOnlineAgents` directo en ese caso. Si se hubiera aplicado el candidato
  equivocado primero, se habría "verificado" un cambio que no cambiaba nada.
- **Primer intento de abrir el widget con Playwright: bloqueado por rate limit ("Retry
  later").** No fue el throttle de creación de conversaciones (6/12h, documentado en el
  handoff anterior) sino OTRO, más agresivo y menos conocido:
  `throttle('widget?website_token=...&cw_conversation=...', limit: 5, period: 1 hora)` en
  `config/initializers/rack_attack.rb` — limita las cargas de **sesión nueva** del widget
  (sin `cw_conversation` todavía) a 5 por hora por IP. Se confirmó mirando
  `docker logs` del contenedor Chatwoot (`[Rack::Attack][Blocked] remote_ip:
  "192.223.122.59" path: "/widget"`) y el propio Redis (`velma:rack::attack:...`). La
  ventana es de **hora fija** (`epoch/3600`), no deslizante — por eso el segundo intento,
  ya en la hora siguiente, funcionó sin esperar nada especial. **Para la próxima vez:** si
  vuelve a aparecer "Retry later" al abrir el widget (no al mandar el primer mensaje), es
  casi seguro este throttle de 5/hora, no el de conversaciones — y se resetea solo al cruzar
  la hora en punto (UTC).
- **Buscar "Retry later" en el código Ruby de Chatwoot.** No existe como string en la app:
  es el texto default que trae la gema `rack-attack` cuando bloquea, no un mensaje propio.
  Buscarlo en `/app/app` no sirve; hay que ir al log o a Redis.
- **Reconstruir el burst de 56 arranques con `docker events`.** El buffer del daemon no
  tenía historial para esa ventana. No hay forma de reconstruirlo retroactivamente sin
  timestamps propios en el log del proceso — de ahí la recomendación de agregarlos.

---

**Qué depende de Sergio**

1. **Decidir si vale la pena investigar la latencia LiteLLM→OpenAI (11-13 s de piso incluso
   en un prompt trivial de 3 tokens).** Mientras esto no baje, "responde al instante" es
   una promesa falsa sobre el propio widget que hoy dice "Normalmente responde en unos
   minutos" (ese texto SÍ es honesto tal cual está, pero contradice el pitch de venta de
   "IA 24/7 instantánea").
2. **Aprobar o no el fix del bug de persistencia (sección B)** — toca `bot-engine.mjs`,
   `run-turn.mjs` y `chatwoot-adapter.mjs`, compartidos por todos los canales, con 503 tests
   como contrato. No es un cambio de una sesión corta.
3. **Confirmar que se puede borrar la data de QA** (conversaciones `29, 31, 32, 33` y las
   `ZZ QA *`), coordinando con el carril de la web que la usó para capturas. Sigue sin
   resolver desde el handoff anterior.

---

**Próximos pasos**

1. **Agregar timestamp a `[onia-webhook] escuchando...` en `webhook-server.mjs`** para que
   si el burst de 56 arranques vuelve a pasar, se pueda ver la cadencia real en vez de
   reconstruirla a ciegas. Cambio de una línea, bajo riesgo, pero igual toca el motor vivo:
   pasar por el mismo proceso (test primero, `code-reviewer`, verificación en producción).
2. **Portar el patrón `markMessageDelivered` al turno normal de Chatwoot** (sección B) para
   que `bot_messages.delivery_status` dependa de lo que Chatwoot respondió de verdad, no de
   una suposición hecha antes de intentar el POST. Con tests nuevos para el caso "Chatwoot
   rechaza el POST" — hoy ese camino no tiene ningún test que lo cubra.
3. **Investigar el tramo LiteLLM→OpenAI** (11-13 s por una respuesta de 3 tokens no es
   normal): revisar si hay DNS/TLS sin keep-alive, si `store_model_in_db: true` agrega una
   consulta a `litellm-db` en cada request, o si el egress de este VPS hacia OpenAI tiene
   latencia de red alta. Medir con `curl -w` desagregando DNS/connect/TLS/transfer.
4. Coordinar con Sergio la limpieza de QA (punto 3 de "qué depende de Sergio").
5. Paso (b) — conocimiento por organización en conversaciones reales — sigue sin tocar,
   sigue siendo su propio frente grande, sigue sin venderse como recepcionista del rubro
   hasta que exista.

**Pendientes anotados y NO perseguidos**

- Las plantillas M0/M4 como pitch de Onia siguen siendo diseño, no bug (igual que en el
  handoff anterior).
- No se investigó por qué la fórmula existente (`markMessageDelivered`) no se usó desde el
  principio para el turno normal — probablemente el turno normal se escribió antes de que
  existiera ese patrón (nació para M9). No es información necesaria para el próximo paso,
  sólo contexto.

---

# 2026-08-24 — Comentario IG → DM: arreglado, SIN publicar, bloqueado por el VPS

**Objetivo:** dejar encendido el workflow `1jS4jwmNmvcQpqqH` sin que vuelva a ahogar el VPS.
**Resultado:** el workflow quedó arreglado y validado. **NO se publicó**, porque no se puede
verificar: sin CPU en el VPS no hay token, y sin token no hay DM que mirar.

## Qué se cambió (n8n, versiones guardadas)

| # | Cambio | Por qué |
|---|---|---|
| 1 | Webhook **partido en dos nodos**: `Webhook Comentario IG` queda GET con `responseNode` (devuelve `hub.challenge`), y `Webhook IG POST` nuevo con `responseMode: onReceived` | `responseMode` es **por nodo, no por método**. El GET necesita cuerpo propio; el POST necesita 200 inmediato. Con un solo nodo era imposible tener las dos cosas |
| 2 | **`Es comentario?`**, IF NATIVO antes del nodo Code | Los IF **no usan el task runner**; el Code sí. Filtrar acá hace que una tormenta de ecos no invoque el Code ni una vez |
| 3 | Se borran los 3 `respondToWebhook` de la rama POST | Con `onReceived` sobran |
| 4 | SSH: `timeout 15` en el comando + `onError: continueRegularOutput` | No puede colgar una ejecución para siempre |
| 5 | `executionTimeout: 120` a nivel workflow | Techo duro |
| 6 | `MIOS` suma `2935350173474443` | Es el `from.id` de @sergio_urcullo; sin él, un comentario suyo en un post de @oniahq le disparaba un DM a él mismo |

⚠️ El `jsCode` también cambió `$('Webhook Comentario IG')` → `$('Webhook IG POST')`: el POST
ahora entra por el nodo nuevo.

## 🔴 DOS CORRECCIONES al diagnóstico original (verificadas en la ejecución 58028)

1. **El nodo SSH NO fue la causa.** El encargo decía "abre una conexión por evento, se
   acumularon más de 100 sesiones". Falso para esta tormenta: `lastNodeExecuted` es
   `Parsear comentario` y el `runData` tiene **dos nodos**. La ejecución moría en el Code y
   **nunca llegaba al SSH**, que está después del `Accionable?`. Es un riesgo latente, no la
   causa.
2. **Los eventos no eran comentarios.** Eran `messaging` con **`is_echo: true`** — los ecos
   de 3 DMs enviados a mano. El código busca `entry[0].changes[0].field === 'comments'` y ahí
   no hay `changes`. Ni siquiera eran accionables. **El único fallo real: el nodo Code no
   consiguió task runner** (`Task request timed out`, 120 s, 76 veces).

## Cómo verificarlo cuando el VPS responda

1. `publish_workflow` sobre `1jS4jwmNmvcQpqqH`.
2. **200 en menos de 1 s**: `curl -s -o /dev/null -w "%{http_code} %{time_total}\n" -X POST`
   contra `https://n8n-sergio-n8n.hqdqgh.easypanel.host/webhook/ig-comment` con un payload
   cualquiera. Con `onReceived` tiene que contestar sin importar lo que pase después.
3. **El GET sigue verificando**: `?hub.verify_token=onia-ig-2026&hub.challenge=123` debe
   devolver `123`.
4. **El DM llegó**: leer la BANDEJA, no las ejecuciones — `GET /v23.0/me/conversations` y
   después `/{conversation_id}/messages`. Las ejecuciones dicen qué corrió; solo la
   conversación dice qué llegó.
5. **Cero tormenta**: `search_workflow_executions` con status error. Una cada 30-60 s = volvió.

⚠️ **NO reintentar un private reply que dé error.** La API devuelve `OAuthException code 1`
Y ENTREGA EL MENSAJE IGUAL. Ya pasó: el destinatario recibió 3 DMs idénticos.

## Qué bloquea

El VPS recibe ~7% de su CPU (steal 92-95%), **y sobrevivió a un reinicio limpio**. `docker`
no responde, así que `ig-dm-token.sh` (que hace `docker exec postiz-postgres`) se cuelga a
los 60-100 s. Detalle y la cadena causal completa en la memoria
`vps-saturado-deploy-bloqueado.md`. **Ruta crítica: ticket a Hostinger.**

## Pendiente cuando Docker responda

`docker update --restart=no` a Temporal, Elasticsearch y Speaches: se apagaron a mano pero
**Elasticsearch vuelve solo** en cada reinicio del daemon (ya volvió dos veces).
