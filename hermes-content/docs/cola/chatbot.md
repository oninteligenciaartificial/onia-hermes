# La cola — carril `chatbot`

> **Por qué existe este archivo.** El carril chatbot era el único sin cola: tenía
> `hermes-content/docs/handoff/chatbot.md`, que es **estado**, no plan. Y sin cola no puede
> tener loop — un loop sin cola no tiene qué comer, así que el carril sólo avanza cuando
> alguien abre su sesión a mano.
>
> Su plan SÍ existía: estaba enterrado dentro del handoff como backlogs sucesivos (v2, v3, v4,
> v5, v6, v6.5, v6.6, v6.7). Esto lo saca a la superficie. Doctrina y formato:
> `hermes-content/docs/cola/README.md`.

**Extraído del handoff el 2026-08-31, con Gate 1 corrido ítem por ítem.** De 15 pendientes
heredados, **7 eran fantasma** (46%): ya estaban hechos y el handoff los seguía arrastrando.
Están abajo en "Cerrado", cada uno con el archivo y la línea que lo prueba.

---

**Auditoría del 2026-09-01 — qué se midió EN VIVO y qué cambió.** Se verificó cada pendiente
contra producción (SSH al VPS, las dos bases, el motor corrido de verdad), no contra el papel.

| | |
|---|---|
| **Lo más caro que nadie había medido** | El bot **contesta una sola vez y se calla para siempre** en modo venta. Se veía en la conversación de HOY. Ítem 1 |
| **Ya estaba resuelto — no entró** | La **alarma del watchdog**. Estaba anotado que 2.874 reinicios fallidos pasaron sin avisar a nadie y que faltaba construir el aviso. Los reinicios son reales (720/día del 25 al 27-ago), pero el watchdog **ya fue reescrito el 28-ago** con aviso a Telegram por incidente y por recuperación, marcador para no repetir, y las credenciales cargadas. Corre cada 2 min y hoy está sano. Escribirlo habría sido trabajo fantasma |
| **Un bloqueo VENCIDO** | El de los fines de línea del espejo pedía una decisión de Sergio que ya no existe. Pasó de "Después/bloqueado" a "Ahora/ítem 4" |
| **Una instrucción que EMPEORABA producción** | Encender `ONIA_N8N_ENABLED` "es una línea" era falso: sin URL el envío falla en silencio. Reescrito en el ítem 2 |
| **El gate estaba en rojo y nadie lo sabía** | `$ node scripts/verificar_cola.js hermes-content/docs/cola/chatbot.md` salía **exit 1** desde que se escribieron los ítems del canario. Dos de las tres causas eran el gate gritando en falso (URLs y bloques de código); están arregladas en el script, con sus casos de self-check |
| **Podado** | El ítem de campañas tenía **nueve** vueltas encimadas (~210 líneas) y la fila S8 arrastraba seis. La historia vive en el `git log` |

---

## Objetivo único

**Que un desconocido escriba y esa conversación se vea en la bandeja.**

**Hecho =** se abre `/inbox` con la sesión del dueño y hay una conversación de una persona
que no somos nosotros — ni una org QA, ni el probador, ni Sergio desde su celular.

**Por qué éste y no otro.** El producto está construido: bandeja nativa, editor conversacional,
multimedia, visión, comprobantes, insistencia, campañas, push. Trece piezas en tres días. Lo
que NO existe es la única prueba de que sirve: alguien de afuera usándolo. Un objetivo que
fuera "cerrar v6.8" o "difusiones masivas" agregaría la pieza catorce a un producto que
todavía no atendió a nadie.

**El estado de arranque, medido hoy:** el enlace de WhatsApp de onia.com.bo YA manda
desconocidos al +591 75414930, que está en Cloud API con el bot atendiendo
(`web-factory/apps/onia-platform/src/lib/site.ts:30-49`). O sea que la distribución existe
hace semanas. Lo que falta es la última cuadra: que esa conversación **aparezca en la
bandeja**, y que la respuesta sea la que corresponde a lo que la persona clickeó.

🎯 **La MITAD cumplida el 2026-08-31.** Sergio vinculó `Onia (interna)` al inbox 5 y la
pantalla se MIRÓ en producción con la sesión de esa org: `/inbox` lista a **mariohassen**
(+591 73021804, 27-ago) y a **F** (+591 73232758, 25-ago, la clínica odontológica de 4
doctores). Ninguno de los dos es QA, ni el probador, ni Sergio. La prueba está en el ítem 1
de "Cerrado". Contestarles es **S7**, y vende Sergio.

🔴 **La otra mitad NO está, y el 2026-08-31 se dio por cerrada de más.** Recontado hoy en la
base de producción: los desconocidos son **nueve conversaciones**, y **cinco entraron por el
widget de la web (inbox 4)** — las convs 34, 36, 38, 40 y 45. **El inbox 4 sigue sin org**, así
que ninguna de las cinco se puede abrir desde el producto, incluidas las **dos más nuevas**
(29-ago y 01-sep). Es el ítem 3 de "Ahora" y el bloqueo **S14**.

🔴 **Y apareció algo peor que la visibilidad, que nadie había medido: el bot contesta UNA vez
y se calla para siempre.** En modo venta —el de los inboxes 4 y 5, que es por donde entra todo
desconocido— **ninguna conversación recibió jamás una segunda respuesta**. Sin los dos horarios
de demo definidos, el bot deriva a un humano en el primer mensaje y después calla a propósito;
el aviso que debía traer a ese humano tampoco sale. O sea que **hoy la bandeja llena no
alcanzaría**: la persona que escribe queda esperando igual. Ítems 1 y 2 de "Ahora".

**Redefinición honesta del "hecho", 2026-09-01.** Que la conversación se VEA era la mitad
correcta del objetivo, pero es insuficiente sola. El objetivo se cumple cuando **un desconocido
escribe dos veces, el bot le contesta las dos, y esa conversación se abre en `/inbox`**.

---

## Cómo se trabaja esta cola

Igual que las otras cuatro — el detalle está en `hermes-content/docs/cola/README.md`. El
resumen: un ítem por vuelta, Gate 1 antes de tocar nada (¿ya está hecho? verificar EN VIVO,
un grep sirve para descartar y nunca para confirmar), gates completos donde haya código
(`tsc --noEmit` + tests + `eslint`, los tres), y si toca pantalla **se abre y se MIRA**.

**Nada entra a "Ahora" sin evidencia de que existe**, y se verifica solo:

```bash
node scripts/verificar_cola.js hermes-content/docs/cola/chatbot.md
```

**Nunca:** desplegar al VPS sin OK de Sergio · tocar otro carril (web-factory es dueño de
`web-factory/`, producto de la cola de plataforma) · gastar plata · bajar una superficie viva.

---

## Ahora

> **Ordenado por lo que acerca la venta**, no por lo fácil. El ítem 1 es el único que un
> comprador VE; el 2 es la razón por la que nadie lo rescata; el 3 es el objetivo del carril.

- [ ] **1 · El bot contesta UNA sola vez y después se calla para siempre — y la causa no es un
      bug, es que nunca se definieron los 2 horarios de demo.**
      **Qué pasa.** Un desconocido escribe, el bot le manda la bienvenida, y **a partir del
      segundo mensaje no vuelve a contestar nunca**. Es el único defecto de esta cola que un
      comprador ve con sus propios ojos.
      **Evidencia — la conversación de HOY, medida en la base de producción.** Conversación 45
      (inbox 4, el widget de onia.com.bo, `status=open`), 2026-09-01 02:02:
      | # | quién | texto |
      |---|---|---|
      | 232 | desconocido | *"hola"* |
      | 236 | **bot** | la bienvenida completa |
      | 237 | desconocido | *"tengo una ferreteria"* |
      | — | **nadie** | **silencio** |
      Lo mismo en la conversación 40 (29-ago): *"Ajajajajaj"* → bienvenida → *"0 ni una
      reunión"* → silencio. Y no son dos casos sueltos: contadas las respuestas del bot por
      conversación, **en modo venta NINGUNA conversación recibió jamás una segunda respuesta**
      (inboxes 4 y 5: convs 38, 40 y 45 → exactamente 1 cada una), mientras el modo recepcionista
      sostiene el diálogo sin problema (inbox 7, conv 39: 5 entrantes → 5 respuestas).
      **La causa, medida corriendo el motor y no leyéndolo.** Replicada la conversación 45 con
      `hermes-content/deploy/vps-ops/bot/bot-engine.mjs`:
      ```
      >>> "hola"                  nuevo -> handoff_humano  | M0_SIN_HORARIOS
          notas: ["bienvenida","sin_horarios_que_ofrecer"]
          efectos: stage_change, lead_upsert, review_queue, notify_sergio
      >>> "tengo una ferreteria"  handoff_humano -> handoff_humano | 0 respuestas
          notas: ["silencio:handoff_en_curso"]
      ```
      O sea: **sin horarios que ofrecer, el bot deriva a un humano en el PRIMER mensaje** y
      después se calla a propósito (la barrera `silencio:handoff_en_curso`, que existe para no
      pisar a un humano que ya tomó la conversación). El comportamiento es correcto; lo que está
      mal es que derive siempre.
      **Por qué no hay horarios.** `hermes-content/deploy/vps-ops/bot/config.mjs` trae los dos
      slots con `pending: true` y un `TODO(Sergio)` que dice *"PROHIBIDO inventar horarios acá"*.
      Existía una salida automática —
      `hermes-content/deploy/vps-ops/bot/calcom-availability.mjs`, que leía la disponibilidad
      real de Cal.com— y **hoy está muerta**: no hay ningún contenedor de Cal.com en el VPS
      (`$ docker ps -a | grep calcom` → vacío) y `https://cal.onia.com.bo/onia/demo-onia`
      responde **302 a `https://onia.com.bo/empezar`**. El módulo es tolerante por diseño, así
      que cae al placeholder pendiente **en silencio**. Nadie había medido que Cal.com se cayó.
      **Probado que ESO es lo único que falta:** corrido el mismo diálogo con dos horarios
      cualesquiera cargados, el embudo funciona entero —
      `hola` → `M0` → `tengo una ferreteria` → `M0b` (repregunta) → `martes` → `M2`
      **demo agendada**. No hay que escribir código.
      **Hecho =** un desconocido escribe dos veces seguidas por el widget y el bot le contesta
      las dos, MIRADO en `/inbox`. Verificación rápida en la base: una conversación de inbox 4
      o 5 con **≥2** mensajes `message_type=1` — hoy no existe ninguna.
      🔴 **Bloqueado en Sergio (S12):** los dos horarios son bloques de SU agenda, y el código
      prohíbe inventarlos. Son dos líneas de dato, no un deploy de código. Opciones abajo.

- [ ] **2 · Cuando el bot deriva a un humano, el aviso no le llega a nadie — y encenderlo NO es
      una línea, como estaba anotado.**
      **Qué pasa.** El motor emite `notify_sergio` cada vez que deja a un prospecto esperando
      (es uno de los 4 efectos del ítem 1, arriba). Ese aviso se propaga hasta
      `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs` y de ahí el servidor lo manda
      **por n8n**. Hoy no sale.
      **Evidencia — los tres cortes, medidos en vivo:**
      1. `ONIA_N8N_ENABLED=false` en `/opt/onia/bot/webhook.env` (línea 7).
      2. **`ONIA_N8N_EVENT_URL` está VACÍO** (`len=0`). El `/health` del bot lo dice sin que
         haya que entrar al VPS: devuelve `"n8n":{"enabled":false,"configurado":false}`.
      3. **No existe ningún workflow de n8n que reciba el evento.** Listados los 44 workflows de
         la instancia: ninguno es el receptor del turno del bot. El más parecido, *ONIA - Nuevo
         Lead (speed-to-lead)*, espera otro payload (`{secret,company,contact,channel,message}`).
      ⚠️ **La corrección que vale, porque cambia el trabajo:** estaba anotado como *"poner
      `ONIA_N8N_ENABLED=true` + reiniciar; es una línea"*. **Hacer sólo eso no enciende nada, y
      encima no se nota.** Leído `hermes-content/deploy/vps-ops/bot/n8n-event.mjs`: con la
      variable en `true` y sin URL la función devuelve
      `{ok:false, status:"failed", reason:"falta ONIA_N8N_EVENT_URL"}` — y el llamador es
      **fire-and-forget a propósito** (el módulo NUNCA tira, para que n8n caído no haga 500 el
      webhook). O sea: se cambia la línea, el aviso sigue sin salir, y nada lo grita. Es
      exactamente el molde de fantasma que este carril mide — un arreglo que se da por hecho
      porque se ejecutó la instrucción al pie.
      **Dónde SÍ queda el lead mientras tanto** (medido, para no exagerar el daño): el efecto
      `review_queue` sí escribe. La conversación 45 está en la base como
      `09-01 02:03 | pending | lead | Bot: conversación para sergio — chatwoot:45`. El problema
      es dónde se ve: ese panel es ONIA Center, que **está abandonado** — el lead queda anotado
      en una pantalla que nadie abre, y el aviso que debía sacarlo de ahí no sale.
      **La salida barata que nadie evaluó:** el evento a n8n existe para que el token de Telegram
      no viva en el bot — pero **ese token YA está en el VPS y ya se usa**:
      `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh` manda sus alertas con `curl`
      leyendo `TG_BOT_TOKEN`/`TG_CHAT_ID` de un `.env` de root (verificado en vivo: el archivo
      existe y las dos variables están cargadas). Mandar el `notify_sergio` por ese mismo camino
      ahorra el workflow, la URL y el secreto compartido.
      **Hecho =** un desconocido escribe por el widget y a Sergio le llega el aviso al celular.
      Antes de eso, el gate barato: `"configurado":true` en el `/health`.
      🔴 **Bloqueado en Sergio sólo la parte que escribe en el VPS** (S13). Elegir el camino
      —n8n o Telegram directo— y escribir el código es de este carril.

- [ ] **3 · El inbox 4 es el widget de la web y NO tiene dueño: la mitad de los desconocidos no
      se ve en la bandeja, incluido el de hoy.**
      **Qué pasa.** El objetivo del carril se dio por cumplido cuando `Onia (interna)` tomó el
      inbox 5 (WhatsApp) y `/inbox` mostró dos desconocidos. Pero el **inbox 4 —el widget de
      onia.com.bo— sigue sin org**, y por ahí entraron las conversaciones **34, 36, 38, 40 y
      45**: cinco de las nueve conversaciones de desconocidos, y las **dos más nuevas** (29-ago
      y 01-sep). Ninguna se puede abrir desde el producto.
      **Evidencia — las cuatro orgs de producción, contadas hoy en la base:**
      ```
      Bolivian electricidad     | inbox=NULL
      Onia (interna)            | inbox=5
      ZZ QA Clinica Chatbot     | inbox=7
      ZZ QA Ferreteria Tornillo | inbox=NULL
      ```
      Nadie tiene el 4. Y en Chatwoot ese inbox tiene **5 conversaciones** esperando.
      El vínculo que falta es la columna `chatwootInboxId` de `clinic_settings`, que es por
      donde el bot resuelve de quién es una bandeja —
      `hermes-content/deploy/vps-ops/bot/knowledge.mjs`. Se cuenta de nuevo con:
      `$ docker exec supabase-db psql -U postgres -d postgres -c 'select "organizationId", "chatwootInboxId" from clinic_settings'`
      **La trampa que hay que resolver antes de hacer los clicks:** está cerrado en esta misma
      cola que **una org sólo puede tener UN inbox** (ítem 1 de "Cerrado", con sus cuatro
      archivos). `Onia (interna)` ya gastó el suyo en el 5, así que **el 4 no se puede vincular
      sin decidir algo más**: darle el 4 a otra org, o levantar la restricción de un inbox por
      org. Eso último es código del producto, no de este carril.
      **Hecho =** se abre `/inbox` con la sesión del dueño del 4 y se ve la conversación 45
      (*"tengo una ferreteria"*, 01-sep).
      🔴 **Bloqueado en Sergio (S14):** es la misma clase de decisión que fue S8 — de quién es la
      bandeja del widget. Con la diferencia de que **esta vez no alcanza con dos clicks**.

- [ ] **4 · El espejo del bot se ensucia solo en cada `git checkout` — y arreglarlo YA NO es un
      deploy ni depende de Sergio.**
      **Qué pasa.** `core.autocrlf=true` materializa el espejo del bot en CRLF mientras el blob
      de git es LF, así que un `git checkout` que no cambia una coma deja archivos con otros
      bytes. `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` compara md5 y grita "deploy
      pendiente" sobre trabajo que nadie hizo — el molde exacto del fantasma que este carril
      mide.
      **Medido hoy, sin suponer:** `$ git ls-files --eol hermes-content/deploy/vps-ops/bot/`
      devuelve **65 archivos `i/lf w/crlf`** y 10 en `i/lf w/lf`. Los 10 limpios son los .sh.
      🔴 **La corrección que desbloquea el ítem, y es el hallazgo de esta vuelta.** Este ítem
      vivía en "Después" afirmando que *"no hay `.gitattributes` en `onia-hermes`"* y que la
      única salida real era *"`.gitattributes` + un redeploy del directorio entero, y eso es de
      Sergio"*. **Las dos cosas son falsas hoy:**
      - Hay **ocho** `.gitattributes` en el repo, y uno está en la carpeta madre del propio
        espejo: `hermes-content/deploy/vps-ops/.gitattributes`, cuyo contenido entero es
        `*.sh text eol=lf`. **Por eso los 10 .sh son los únicos limpios.** El arreglo no es
        crear una política nueva: es **agregarle una línea a un archivo que ya existe**.
      - **No hace falta redeploy.** Los .sh son los únicos que el gate compara byte a byte, y
        están en **LF de los dos lados** — verificado en el VPS con `od`: los .sh que corren
        tienen `CR=0`. Para los .mjs el gate ya normaliza el `\r` (la "opción 3", shippeada el
        31-ago). Así que sumar `*.mjs text eol=lf` **no desincroniza nada con el VPS**, y como el
        blob ya es LF en los 65, tampoco ensucia el diff.
      **O sea: dejó de ser una decisión de Sergio y pasó a ser una línea de este carril.** Un
      bloqueo vencido es peor que un fantasma — le pide a Sergio una decisión que ya no existe.
      **Hecho =** agregada la línea, `$ git ls-files --eol hermes-content/deploy/vps-ops/bot/`
      no muestra un solo w/crlf, y `$ node hermes-content/deploy/vps-ops/bot/espejo-check.mjs`
      sale igual que antes del cambio (no aparecen archivos nuevos como DISTINTOS).

- [ ] **5 · Las frases que la web YA manda no están registradas como campañas: el desconocido
      pregunta una cosa y el bot le contesta el saludo genérico.**
      onia.com.bo manda **cuatro frases fijas** al +591 75414930 por `wa.me?text=`, más el
      prefijo del CTA de `/v1/empezar`. Cada una es una intención ya declarada, y el bot las
      trata a todas igual.
      **Estado, tras nueve vueltas: el trabajo de código está TERMINADO y falta un `scp`.**
      - El documento existe y pasa la compuerta real de publicación:
        `hermes-content/docs/chatbot/campanas-onia.knowledge.json` (6 campañas, `version`
        `2026-08-31.2`; `$ node hermes-content/deploy/vps-ops/bot/knowledge.mjs --check <ruta>`
        → `OK`).
      - El motor las lee **en modo venta**, que es donde caen los wa.me de la web, y ya viajó
        al VPS (`$ docker exec onia-center grep -c campanaExacta /tmp/onia-bot/bot-engine.mjs`
        → **2**).
      - Su guardia extrae las frases del código de la web en vez de hardcodearlas:
        `hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs`. Las frases vivas están en
        `web-factory/apps/onia-platform/src/lib/site.ts`, que es del carril web-factory: **no se
        toca**.
      **Lo único que falta, verificado hoy dentro y fuera del contenedor:**
      `/opt/onia/bot/knowledge.json` sigue en **904 bytes del 6-ago con cero `campanas`**, igual
      en el host y en `/tmp/onia-bot/` del contenedor que corre. Es **S9**, y es un deploy.
      ⚠️ **La trampa de S9 sigue viva y hay que leerla antes de tocar nada:** el knowledge.mjs
      que HOY corre en el VPS **no conoce la clave `prefijo`** (`$ docker exec onia-center grep
      -c prefijo /tmp/onia-bot/knowledge.mjs` → **0**), y el validador **rechaza claves
      desconocidas** devolviendo `data: null`. Copiar sólo el JSON no deja 5 campañas de 6: deja
      **cero**, y encima tira la FAQ `siat` y el horario que hoy sí están vivos. Tienen que
      viajar `hermes-content/deploy/vps-ops/bot/knowledge.mjs` +
      `hermes-content/deploy/vps-ops/bot/recepcionista.mjs` + el documento, **juntos**.
      **Hecho =** las 4 frases vivas contestadas con su respuesta propia, MIRADO. Gate previo:
      `$ node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` tiene que salir 0.
      📎 **Podado el 2026-09-01.** Este ítem arrastraba **nueve** bloques de "vuelta" —unas 210
      líneas— con diagnósticos que se corrigieron entre sí tres veces (era S8 → no era S8; un
      archivo → tres archivos; el motor no viajó → sí viajó). Todo eso ya se decidió y está
      probado; conservarlo hacía que elegir el próximo paso costara leer nueve veredictos, cinco
      de ellos vencidos. Lo vigente cabe acá arriba, y la historia completa está en el `git log`
      de este archivo, que es donde va.

### Del canario visual — corrida del 2026-09-01

- [ ] **El login del chat pesa 12,9 MB para un formulario de dos campos.** Medido en
      `https://chat.onia.com.bo/app/login`: **12.953.799 bytes**, 2.437 ms hasta mirable.
      Es **10× el login de la plataforma** (1.300 KB), que además dibuja una columna de marca
      entera, iconos y tres bloques de texto. La pantalla se ve BIEN — marca Onia aplicada,
      campos y botón correctos — así que esto no se nota mirando: se nota midiendo, y es
      exactamente el fallo con cara de éxito que este carril existe para cazar. Es el bundle
      de Chatwoot servido entero en la ruta de login. Primer paso barato: ver qué assets
      entran (el canario deja el detalle en su carpeta de salida — la que está **gitignoreada**,
      así que hay que correrlo para tenerla) antes de decidir si se puede partir o si es el
      precio de Chatwoot.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-01-login-chat.png`
      y el script que la saca, `scripts/canario_visual.mjs`.
      📎 **Corregido el 2026-09-01:** este ítem citaba entre backticks el JSON de la carpeta de
      salida del canario, y esa carpeta está en `.gitignore` (línea 54) — o sea que el archivo
      **nunca** existe en un checkout limpio. El verificador de colas lo marcaba fantasma y la
      cola entera salía **exit 1 desde el momento en que se escribió el ítem**: nadie corrió el
      gate después de escribirlo. Un directorio de salida no puede ser la evidencia de un ítem;
      la evidencia es la captura commiteada.

- [ ] **El panel del chatbot NO se puede mirar: es una pantalla ciega.** `app.onia.com.bo/settings/chatbot`
      redirige a `/login` sin sesión, así que el canario la reporta **no medida** — nunca
      "OK" — y va a seguir así en cada vuelta. Es la pantalla que un cliente usa para editar
      su conocimiento, y hoy nadie la mira nunca. Hace falta una de dos: una credencial de
      sólo lectura para el canario, o una ruta de vista previa pública. La baseline guardada
      en `hermes-content/references/canario-visual/panel-chatbot/baseline.json` está marcada
      con `NOTA: NO MEDIDA` para que ninguna vuelta futura la confunda con verde.

---

- [ ] 🔴 **El bot contesta el saludo y se calla en el SEGUNDO mensaje. Reproducido hoy, en vivo, en el inbox de los leads reales.**
      **Cómo se reproduce** (30 segundos, sin tocar nada): abrir
      `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host/widget?website_token=9k5i7xnAgCbSse1EZwVChZLw`,
      escribir *"Hola, quiero informacion sobre el sistema"* → **contesta bien**; después
      *"Tengo una clinica dental en Santa Cruz, somos 4 personas"* → **nada, nunca**.
      **No es infraestructura.** Medido: `/health` dentro de `onia-center` da `ok:true`, base a
      32 ms, el camino a Chatwoot responde, el webhook está registrado en la cuenta 2 sin filtro
      de inbox (o sea que cubre el 4), y no hay incidente abierto.
      **Tampoco es el add-on.** Se probó la hipótesis y salió FALSA: se le otorgó
      `addon.whatsapp` a `onia-interna` (activo, verificado en `organization_entitlements`) y el
      bot se sigue callando igual. Queda otorgado.
      **El patrón, contado sobre las 13 conversaciones desde el 24-ago:** en el inbox 7 (QA) el
      bot sostuvo una charla entera (5 mensajes → 5 respuestas). En los inboxes 4 y 5 —los de
      leads reales— contestó **como máximo UNA vez, siempre**: 1→0, 1→0, 2→0, 1→0, 1→1, 2→1,
      2→1, 2→1. Nunca hubo una segunda respuesta a una persona real.
      🔴 **Lo primero es VERLO, no adivinarlo.** `/tmp/onia-bot-webhook.log` sólo tiene líneas de
      arranque: **ni una por mensaje**. El proceso corre con `docker exec -d`, así que su salida
      no va a ningún lado. Por eso este bug sobrevivió una semana con cinco personas escribiendo.
      **Antes de tocar el motor: que cada webhook deje una línea** con conversación, entrada, la
      rama que tomó y por qué no respondió. Con eso la causa aparece en la primera vuelta; sin
      eso se sigue adivinando.
      ⚠️ **Ojo con dar por buena una hipótesis sin probarla**: la del add-on parecía cerrada y era
      falsa. La conversación de prueba de hoy queda en el inbox 4 a propósito, para reproducir.

## Después

- [ ] **"La cita" le habla de consultorio a una ferretería — y esta vez NO es el flag.**
      Encontrado en la recorrida v6.8, con `PLATFORM_LAYER=1` puesto, o sea que es el texto y
      no el entorno: en `/settings/chatbot` de `Ferreteria Circuito Completo` la tarjeta se
      titula **"La cita"**, pide **"Cuánto dura (minutos)"** y ofrece de ejemplo
      **"en el consultorio, o por videollamada"**. Una ferretería no agenda citas ni tiene
      consultorio. Son literales en `onia-platform/app/(dashboard)/settings/chatbot/ChatbotClient.tsx`
      — la pantalla sí usa el vocabulario del rubro, pero sólo para dos placeholders de ejemplo
      (`page.tsx:47`, `voc.ejemploNombre` y `voc.ejemploMiembro`), no para estos rótulos.
      **Lo barato que lo arregla:** `lib/onboarding/vocabulario.ts` no tiene todavía una palabra
      para "la cita" por rubro. Es un campo nuevo en un módulo que consumen muchas pantallas
      (Sidebar, Header, alta), así que **lo decide el carril de plataforma, no éste** — se
      anota con su prueba y se deja.

- [ ] **El disco de la máquina de Sergio se llenó al 100% y bloqueó el build.**
      No es una molestia: `next build` murió con `ENOSPC: no space left on device` y con
      **0 bytes libres** de 465 GB no se puede mirar ninguna pantalla. Se liberó lo
      inequívocamente muerto — la caché de npm, 308 carpetas `HeadlessChrome*` de Playwright en
      `%TEMP%`, y los `.next` de los **12 worktrees de `onia-platform` que ni siquiera tienen
      `node_modules`** (build sin con qué reconstruirse: basura por definición). Quedaron 5,9 GB
      y el build pasó. **La causa de fondo sigue ahí y no la arregla este carril:**
      `onia-platform` tiene **30 worktrees**, 13 con su propio `node_modules`. Cerrar los
      worktrees de ramas ya mergeadas es de cada carril; el de plataforma es el que lleva la
      cuenta.

- [x] **`git checkout` en este repo DESINCRONIZA el espejo del bot sin mostrar un solo cambio
      — y pone rojo el gate que existe para detectar drift real.** **Movido a "Ahora" (ítem 4)
      el 2026-09-01, porque su bloqueo estaba VENCIDO.** El ítem decía que la única salida real
      era `.gitattributes` + un redeploy del directorio entero y que eso era de Sergio. Medido
      hoy: ya existe `hermes-content/deploy/vps-ops/.gitattributes` (con `*.sh text eol=lf`,
      que es por qué los diez .sh son los únicos limpios), los .sh están en LF de los dos lados
      —o sea que no hay redeploy que hacer— y para los .mjs el gate ya normaliza el retorno de
      carro desde el 31-ago. Queda una línea en un archivo que ya existe: eso es de este carril,
      no de Sergio. El análisis completo y la prueba están en el ítem 4 de "Ahora".

- [ ] **Limpieza de la data QA NUEVA.** La del 29-ago ya se ejecutó; después se generó más:
      org `zzqa-horario-0001` ("ZZ QA Horario") con su usuario y su inbox, y las
      conversaciones QA 39, 43 y 44 (bandeja, insistencia, comprobante). **No borrar todavía**:
      son la evidencia de cuatro ítems cerrados, igual que las dos orgs que el carril de
      producto decidió NO borrar por el mismo motivo. Se limpia cuando haya conversaciones
      reales que las reemplacen como prueba.
- [ ] **Vigilar que el reconcile nocturno de Chatwoot no revierta el branding.** Son SEIS
      `installation_configs` (BRAND_NAME, INSTALLATION_NAME, WIDGET_BRAND_URL, LOGO,
      LOGO_DARK, LOGO_THUMBNAIL). El loop de orden (cron `63ae20ad`) los re-aplica, pero
      nunca se verificó que gane la carrera contra el reconcile. Si aparece el logo de
      Chatwoot en `chat.onia.com.bo`, re-aplicar LOS SEIS y limpiar caché
      (`GlobalConfig.clear_cache`).

      ⚙️ **Vigilado el 2026-08-31, y el ítem estaba mal escrito en tres puntos.** No son seis
      configs, la defensa no cubría lo que decía cubrir, y tres ya se habían perdido hace
      quince días sin que nadie lo viera.
      **1 · Son DIEZ, no seis.** Leído el YML del propio contenedor
      (`enterprise/config/premium_installation_config.yml`), `Internal::ReconcilePlanConfigService`
      restaura: INSTALLATION_NAME, BRAND_NAME, BRAND_URL, WIDGET_BRAND_URL, TERMS_URL,
      PRIVACY_URL, LOGO, LOGO_DARK, LOGO_THUMBNAIL y DISPLAY_MANIFEST.
      **2 · La defensa cubría TRES.** El cron real no es `63ae20ad` (ése es un loop de sesión):
      es `/root/bin/chatwoot-brand-onia.sh`, cada hora al minuto :17, y corre bien —
      328 ejecuciones, la última al cierre de esta vuelta. Pero re-aplicaba sólo
      INSTALLATION_NAME, BRAND_NAME y WIDGET_BRAND_URL. Los tres LOGO sobrevivían **por
      suerte, no por diseño**. Su copia versionada
      (`hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh`) era idéntica al VPS por md5,
      así que el repo no mentía: la defensa estaba corta en los dos lados.
      **3 · Tres YA estaban revertidas, y se ven desde la calle.** `BRAND_URL`, `TERMS_URL` y
      `PRIVACY_URL` apuntan a `www.chatwoot.com` desde el **16-ago**. No es teoría: el HTML
      público de `https://chat.onia.com.bo/app/login` embebe el objeto de config del front y
      las tres salen ahí en texto plano. La regla dura del carril es que Chatwoot no se vea.
      **Lo que sí está bien, MIRADO y no supuesto:** el login renderiza el logo `onia` y
      "Iniciar sesión en Onia", y el widget del inbox 4 muestra al pie **"Desarrollado por
      Onia"**, con link a `https://onia.com.bo/?utm_medium=survey&utm_campaign=branding` e
      icono `https://onia.com.bo/apple-icon.png`. La cara que ve el desconocido está limpia.
      **La carrera, respondida con fechas:** los tres del script tienen `updated_at` del
      **24-ago** y los tres LOGO del **29-ago**. Como el script sólo escribe si el valor
      difiere, siete días sin que se muevan significa que **hoy el reconcile no está
      revirtiendo nada** — pero cuando atacó (18-ago, y el 16-ago con estas tres) ganó.
      **Lo construido:** `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` ampliado a las
      **nueve** de marca (DISPLAY_MANIFEST queda afuera: su valor de fábrica es el que
      queremos) y con modo **`--check`** que no escribe y sale 1 si falta alguna. Corregido
      además un `| tail -1` que se comía la salida entera: por eso
      `/var/log/chatwoot-brand-onia.log` nunca pudo mostrar una reversión. Probado **contra
      producción en modo sólo-lectura**: `REVERTIDAS 3/9`, exit 1, y los `updated_at` de las
      tres siguen en 16-ago — no escribió.
      ⚠️ **No se aplicó al VPS: reemplazar un cron que corre solo cada hora es infra, y eso
      es de Sergio.** Son dos comandos y es reversible. Anotado como **S10**, cotizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.

      ⚙️ **Vuelta del 2026-08-31 (séptima) — ahora la reversión SE VE desde afuera, que es lo
      único que faltaba para que "vigilar" signifique algo.** Gate 1 primero, medido y no
      leído: las tres siguen revertidas hoy (`curl` a `https://chat.onia.com.bo/app/login`
      → `"BRAND_URL":"https://www.chatwoot.com"`, más `TERMS_URL` y `PRIVACY_URL`).
      **El hueco real que quedaba, y por qué se pierden quince días sin que nadie lo note:**
      el modo `--check` de `chatwoot-brand-onia.sh` vive **dentro del contenedor** — necesita
      SSH al VPS, `docker exec` y `rails runner`. O sea que sólo puede correrlo alguien que ya
      está adentro, a mano, sabiendo que tiene que mirar. Nadie lo corre, y por eso el
      16-ago pasó sin ruido.
      **Lo construido:** `hermes-content/deploy/vps-ops/chatwoot-marca-publica.mjs` — mira la
      marca **desde la calle**, que es exactamente la cara que ve el desconocido. El front de
      Chatwoot embebe su config en la página (`window.globalConfig = {…}`), así que es un
      **GET y nada más**: sin VPS, sin docker, sin token, sin credenciales. Corre desde
      cualquier máquina (`npm run marca:chatwoot`) y sale 1 nombrando las revertidas.
      **Corrido contra producción**, que es la prueba de que sirve:
      ```
      [marca-publica] REVERTIDAS 3/9 en https://chat.onia.com.bo/app/login:
      [marca-publica]   BRAND_URL: "https://www.chatwoot.com"
      [marca-publica]   TERMS_URL: "https://www.chatwoot.com/terms-of-service"
      [marca-publica]   PRIVACY_URL: "https://www.chatwoot.com/privacy-policy"
      ```
      **8 tests** (`npm run test:marca-chatwoot`), sobre el HTML REAL del 31-ago con las tres
      revertidas. El que más vale es el que **ata las dos listas**: lee las nueve claves del
      propio `chatwoot-brand-onia.sh` y exige que sean idénticas a las del gate — si se
      separan, el cron defiende una marca y el gate mide otra, y saldría verde sobre una clave
      que nadie re-aplica. **Probado que pueden fallar:** borrando `BRAND_URL` de la lista,
      **4 de 8 en rojo**.
      ⚠️ **Un tropiezo que queda escrito porque el molde es el del carril:** la primera versión
      salía con `process.exit(1)` y contra el HTTPS real reventaba libuv con los sockets
      keep-alive de `fetch` abiertos — imprimía `REVERTIDAS 3/9` correctamente y **devolvía
      127**. Un gate que grita el veredicto y no lo puede pasar por su código de salida no lo
      lee ningún cron. Se pasó a `process.exitCode`. **Y se dice lo que el test NO hace:**
      revertido a `process.exit(1)` a propósito, los dos tests de exit siguen **verdes** contra
      el servidor local — la carrera no se da en `127.0.0.1`. Lo que sostiene el arreglo es el
      comentario del .mjs, no el test; está escrito ahí para que nadie lo cuente como
      cubierto.
      ⚠️ **Esto NO repara nada: sólo mira.** Quien repara sigue siendo
      `chatwoot-brand-onia.sh`, y aplicarlo al VPS sigue siendo **S10** — de Sergio. Lo que
      cambia es que a partir de hoy la reversión es detectable sin entrar al VPS, así que la
      próxima no puede durar quince días.
      ✅ **Vigilado el 2026-08-31 (octava vuelta) — sigue revertido, y el gate se comprobó de punta a punta.** `npm run marca:chatwoot` contra producción: **`REVERTIDAS 3/9`** — `BRAND_URL`, `TERMS_URL` y `PRIVACY_URL` siguen diciendo `www.chatwoot.com` en el HTML público del login, sin cambio desde el 16-ago. **Y se verificó el código de salida, no sólo el texto**, que es lo que el propio ítem dice que hace fallar a un gate en silencio: corrido con la salida descartada, `$?` = **1**. Sirve para un cron. **S10 sigue pendiente y sigue siendo de Sergio** — reparar escribe en el VPS.

      📎 **Por qué en `vps-ops/` y no en `bot/`:** `espejo-check.mjs` compara `bot/` archivo por
      archivo contra `/opt/onia/bot`, así que un .mjs nuevo ahí deja el gate rojo hasta el
      próximo `scp` — y el propio carril tiene escrito que *un gate que siempre está rojo lo
      apaga alguien*. Verificado después de crear los dos archivos: el espejo sigue reportando
      los mismos tres de siempre.
- [ ] **Botón "Cobrar con QR" dentro de la conversación** (pieza 5 del backlog v5). El
      circuito está completo en mock y verificado mirando (`/bcp/cobrar` + `/bcp/callback`,
      contrato del banco calcado); el código no cambia para el modo real. Espera las
      credenciales del BCP — ver Bloqueado.
- 📌 **Nota para el carril web-factory (no la ejecuta este carril):** tres de las frases de
  `site.ts` dicen *"avisen cuando Onia para comercio/servicios/importadoras esté listo"*, y
  eso es **exhibir obra en la superficie de venta** — prohibido por CLAUDE.md §3. Además los
  tres rubros ya se venden. Anotado acá para que no se pierda; lo decide su dueño.
  **2026-08-31, dato nuevo que simplifica la decisión:** los cuatro exports —
  `WA_TEXT_COMERCIO`, `WA_TEXT_SERVICIOS`, `WA_TEXT_PROVEEDORES` y `WA_URL`— **no los importa
  nadie** en todo `web-factory/` (verificado por grep en el repo y por `curl` contra las páginas
  vivas: ninguna los renderiza). No hay texto que corregir: es código muerto, y `WA_URL` dice de
  sí mismo ser "el CTA general de toda la página", así que probablemente se desconectó sin
  querer. Dos caminos, los dos baratos: borrarlos, o volver a conectar `WA_URL`.

---

## Bloqueado en Sergio

> Ninguno de estos frena la cola: se anota, se avisa y se sigue con el próximo desbloqueado.

| # | Qué | Por qué sólo él | Qué desbloquea |
|---|---|---|---|
| S1 | **Probar el popup de Embedded Signup con un +591 real** (`chat.onia.com.bo` → Add Inbox → WhatsApp → Connect with WhatsApp Business) | Necesita su sesión de Meta y un chip. Todo lo nuestro está hecho desde el 28-ago: Access Verification ✅, Configuration ID `1824225392073753`, dominio JS SDK autorizado, las 3 InstallationConfigs cargadas | Que un CLIENTE conecte su propio WhatsApp solo. ⚠️ Hoy el inbox que nazca queda huérfano — ver ítem 2 de Ahora |
| S2 | **Credenciales del BCP + certificado mTLS (`.pfx`)** | Trámite bancario | El botón "Cobrar con QR" en la conversación. Sin banco no hay código que lo destrabe |
| S3 | **Traslado del 75414930 a coexistencia** — OK explícito ("vamos con A") + ventana acordada + el PIN de dos pasos a mano | El número queda MUDO 30-60 min y el rollback depende de un PIN que sólo él tiene. Runbook completo: `hermes-content/docs/ONIA_RUNBOOK_COEXISTENCIA_75414930.md` | Que Sergio siga usando su app de WhatsApp en el mismo número que atiende el bot |
| S4 | **Verificar el push "te escribieron" en su celular** (suscribirse y recibir) | Hace falta un dispositivo real | El circuito está testeado 95/95 y deployado; sólo falta la prueba física |
| S5 | **¿Silenciar el Telegram de los agentes n8n que sí trabajan?** (Vendedor, Contenido, Finanzas, Prospector, Radar IA, Web Factory Radar) + los recordatorios de agenda cada 30 min | Es su canal y su umbral de ruido. No se apagan los workflows: hacen trabajo — hay que editar el nodo de aviso de cada uno | Que Telegram vuelva a ser sólo errores, que es la regla que ya se aplicó al resto |
| S7 | **Contestar (o descartar) a los cuatro desconocidos que escribieron y nadie respondió** — conv 35 (+591 73232758, clínica dental de 4 doctores, 25-ago), 37 (+591 73021804, 28-ago), 36 (`Saguilera@ds-santacruz.bo`, 27-ago) y 34 (widget, sin dato de contacto) | Vende Sergio, y son personas reales esperando desde hace 3-6 días. Un bot no puede retomar una conversación fría de hace una semana sin que suene a spam | El primer lead atendido del carril. Dos tienen número de WhatsApp y uno correo: tres de los cuatro son alcanzables hoy |
| ~~S8~~ | ✅ **CERRADO el 2026-08-31: `Onia (interna)` → inbox 5.** Verificado en la base y MIRADO en `/inbox`. **Podado el 01-sep:** esta fila arrastraba el análisis completo de seis vueltas y seguía leyéndose como bloqueo vivo — S8 se nombra **17 veces** en este archivo, casi todas dentro de párrafos viejos que ya no aplican. Lo que quedaba abierto NO era S8 sino el **inbox 4**, y ahora tiene su propio ítem (3 de "Ahora") y su propio bloqueo (**S14**). | — | — |
| S9 | **Publicar las campañas en el VPS — y son CUATRO archivos, no uno.** 🔴 **Corregido el 31-ago (3ª vuelta): tal como estaba escrito, esto NO encendía nada.** Decía copiar sólo `campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json` porque daba el motor por desplegado; medido con md5, el VPS está **un commit atrás** (`3e3841aa`, sin `994eb42d`) y su `bot-engine.mjs` tiene **cero `campanaExacta`** — habría ignorado las campañas en silencio. Lo que tiene que viajar: **`bot-engine.mjs` + `knowledge.mjs` + `run-turn.mjs`** (del espejo `hermes-content/deploy/vps-ops/bot/`) **+ `knowledge.json`** (desde `hermes-content/docs/chatbot/campanas-onia.knowledge.json`), y después **reiniciar** — `webhook-server.sh` sólo recopia al contenedor si cambia su STAMP. Verificar con `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` (tiene que salir 0) | Escribe en el VPS, y la regla dice que ningún deploy sale sin su OK | **El ítem 2 entero.** El motor del repo ya las lee en modo venta (**647/647 verde**, probado con este mismo documento); falta que el VPS TENGA ese motor y que el archivo del número traiga las campañas. ⚠️ **Sumado el 31-ago (4ª vuelta): `run-turn.mjs`**, que volvió a exportar `LLM_SYSTEM_PROMPT` para revivir los 12 evals. Corrido hoy contra producción, `espejo-check.mjs` sale **1**: DISTINTOS `bot-engine.mjs`, `bot-engine.test.mjs`, `knowledge.mjs`, `run-turn.mjs`, `run-turn.test.mjs`; FALTAN `campanas-web.test.mjs`, `espejo-check.mjs`, `espejo-check.test.mjs`, `recepcionista.test.mjs`. Sin esto las 4 frases vivas de onia.com.bo siguen recibiendo el saludo genérico. ✅ **Gate 1 del 31-ago (5ª vuelta): EL CÓDIGO YA VIAJÓ — S9 se achicó a UN archivo de datos.** Medido, no leído: `espejo-check.mjs` sale **0** (`ESPEJO OK`), o sea que `bot-engine.mjs`, `knowledge.mjs` y `run-turn.mjs` ya son los del repo. Y confirmado en el motor que **CORRE**, no en el host: `docker exec onia-center grep -c campanaExacta /tmp/onia-bot/bot-engine.mjs` → **2** (era 0). Lo único que falta es el documento: `/opt/onia/bot/knowledge.json` sigue en **904 bytes del 6-ago, con cero `campanas`** — dentro y fuera del contenedor. **S9 hoy = copiar `hermes-content/docs/chatbot/campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json` y reiniciar.** 🔴 **CORREGIDO el 31-ago (9ª vuelta): ya NO alcanza el JSON solo — son TRES archivos, y hacerlo con uno EMPEORA producción.** El documento nuevo trae `prefijo` (la campaña del CTA de `/v1/empezar`), y el esquema del validador **rechaza claves desconocidas**: `parseKnowledge` devuelve `data: null`, o sea que el documento **no carga a medias, no carga nada**. Medido con el `knowledge.mjs` que HOY corre en el VPS, bajado por `scp`: `ok=false`, `campanas[4].prefijo: clave desconocida`. Copiando sólo el JSON no quedan 5 campañas de 6 — quedan **cero**, y encima se pierden la FAQ `siat` y el horario que hoy sí están vivos. **Lo que tiene que viajar junto:** `hermes-content/deploy/vps-ops/bot/knowledge.mjs` + `hermes-content/deploy/vps-ops/bot/recepcionista.mjs` + el documento a `/opt/onia/bot/knowledge.json`, y reiniciar. Verificación previa: `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` hoy sale **1** y nombra `knowledge.mjs` y `recepcionista.mjs` entre los DISTINTOS — después del `scp` tiene que salir **0**. ✅ **Sumado el 31-ago (6ª vuelta) — verificado que la copia es SEGURA, que era un riesgo sin medir.** La instrucción manda a **sobrescribir un archivo de datos vivo en producción** y nadie había comparado los dos lados: si el documento nuevo no traía algo que el viejo sí, el `scp` lo borraba en silencio. Bajado el vivo del VPS y diffeado campo por campo contra el del repo: `identity`, `empresa` (el horario lun-vie 9-18) y `triggersExtra` son **idénticos**, y la única FAQ (`siat`) es **byte a byte la misma**. El nuevo sólo agrega `campanas` (5) y sube `version` de `2026-08-06.1` a `2026-08-31.1`. Es un **superset estricto**: no se pierde nada. **Y cómo se comprueba DESPUÉS del scp** — porque este carril ya dio dos deploys por hechos sin mirarlos, y hay que medirlo en el motor que CORRE, no en el host:
  ```bash
  ssh root@187.77.16.63 "docker exec onia-center sh -c 'grep -c campanas /tmp/onia-bot/knowledge.json'"
  ```
  Tiene que dar **≥1**. Hoy da **0** dentro y fuera del contenedor (904 bytes del 6-ago), que es el estado sin S9. (Se suma al mismo `scp` `recepcionista.test.mjs`, que dejó de ser un archivo de 0 bytes — es un test, no cambia lo que corre.) |
| S10 | **Aplicar al VPS la defensa ampliada de la marca de Chatwoot** — `scp` de `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` a `/root/bin/` y una corrida manual | Reemplaza un cron que corre solo cada hora: es infra, y la regla del carril dice que el VPS es suyo | Que `BRAND_URL`, `TERMS_URL` y `PRIVACY_URL` dejen de decir `www.chatwoot.com` en el HTML público del login. Ya probado en modo `--check` contra producción: 3 de 9 revertidas. ✅ **Sumado el 31-ago (7ª vuelta): ahora se comprueba DESDE AFUERA, sin entrar al VPS.** El `--check` del .sh vive dentro del contenedor (SSH + `docker exec` + `rails runner`), así que sólo lo corre quien ya está adentro y sabe que tiene que mirar — por eso las tres se perdieron el 16-ago y nadie lo vio en quince días. `npm run marca:chatwoot` (`hermes-content/deploy/vps-ops/chatwoot-marca-publica.mjs`) lee el `window.globalConfig` del HTML público del login: es un GET, corre desde cualquier máquina y hoy sale **1 con `REVERTIDAS 3/9`**. **Después del `scp` y la corrida manual, tiene que salir 0** — ése es el verificador de S10, y mide la cara que ve el desconocido, no la base |
| S11 | **Desplegar el producto para que el sidebar deje de mostrar `ASSIGNMENT_TURNED_IN` en letras gigantes** — commit `4f86381` de `onia-platform` (rama `carril/chatbot-v68-friccion`) | Es un deploy del producto, y ningún deploy sale sin su OK | Que el item "Requerimientos" del menú dibuje su icono. Encontrado MIRANDO `/inbox` de producción hoy: la fuente estaba cargada y el glifo no existía — `assignment_turned_in` nunca se subseteó (342 ligaduras en el .woff2 desplegado, 261 iconos declarados). Es el mismo defecto del login del 14-ago, en una pantalla que ningún gate cubría. Ya arreglado y con su guardia en la suite (`scripts/iconos-en-la-fuente.test.ts`); **verificación post-deploy:** abrir `/inbox` y mirar el menú, o medir el ancho del texto del span — un glifo ocupa ~1em, hoy mide 20em |
| S12 | **Los DOS horarios fijos de demo — sin ellos el bot deriva a un humano en el primer mensaje y se calla para siempre.** Son dos bloques semanales de SU agenda; `hermes-content/deploy/vps-ops/bot/config.mjs` los trae `pending: true` con un TODO que dice *"PROHIBIDO inventar horarios acá"*. **Contexto nuevo del 01-sep:** existía la salida automática por Cal.com y **está muerta** — no hay contenedor de Cal.com en el VPS y `cal.onia.com.bo` responde 302 a `onia.com.bo/empezar`, así que el módulo cae al placeholder en silencio. **Dos opciones, las dos baratas:** (a) Sergio dicta dos bloques fijos (ej. martes 10:00 y jueves 16:00) y quedan como dato — cero código; (b) revivir Cal.com, que es infra y cuesta más. Recomendación: **(a)**, y (b) después si molesta mantenerlos a mano | Son horas de su semana, y el código prohíbe inventarlas | **El ítem 1 de Ahora, que es el único defecto que un comprador ve.** Probado corriendo el motor con dos horarios cualesquiera: el embudo llega hasta `M2` demo agendada sin tocar una línea de código |
| S13 | **Encender el aviso `notify_sergio`** — hoy el bot pide un humano y no se entera nadie. ⚠️ **NO es "poner `ONIA_N8N_ENABLED=true`"**: `ONIA_N8N_EVENT_URL` está **vacío** y **no existe ningún workflow de n8n** que reciba el evento (listados los 44). Con la variable en `true` y sin URL el envío devuelve `failed` y **nadie se entera**, porque es fire-and-forget a propósito. **Decidir el camino:** (a) Telegram directo desde el bot, reusando el `TG_BOT_TOKEN` que `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh` ya usa en el VPS — sin workflow, sin URL, sin secreto nuevo; (b) crear el workflow de n8n y cargar la URL. Recomendación: **(a)** | Escribe en el VPS. El código lo escribe este carril; la decisión y el deploy son suyos | El ítem 2 de Ahora. Gate barato antes de mirar el celular: `"configurado":true` en el `/health` del bot |
| S14 | **De quién es la bandeja del widget (inbox 4)** — hoy no tiene org y por ahí entraron **5 de las 9** conversaciones de desconocidos, incluida la del 01-sep. ⚠️ **A diferencia de S8, no alcanza con dos clicks:** está cerrado en esta cola que **una org sólo puede tener UN inbox**, y `Onia (interna)` ya gastó el suyo en el 5. **Opciones:** (a) darle el inbox 4 a otra org existente — cero código, pero mezcla el widget de Onia con una org que no es Onia; (b) crear una org `Onia (web)` sólo para el widget — cero código; (c) levantar la restricción de un inbox por org, que es código del producto y de otro carril. Recomendación: **(b)** | Es decidir en qué bandeja aterrizan los desconocidos de la web | **La otra mitad del objetivo del carril.** Hecho = se abre `/inbox` y se ve la conversación 45 (*"tengo una ferreteria"*) |
| S6 | **Proyecto Supabase cloud `Dental-gest` (`kvepqgikokjlacxngkiw`) sigue ACTIVE_HEALTHY** — decidir pausar o borrar. Y si algún día se reactiva `Gesti-Os` (`jafxylfocvvlflpqfsix`), **rotar su `service_role` primero**: estuvo expuesto en los JSON de n8n que se redactaron el 29-ago | Es plata y es borrado de datos | Cerrar la cola del saneamiento de secretos |

---

## Cerrado — no rehacer

- [x] **1 · Una org sólo puede tener UN inbox, y nadie puede cambiarlo — así ningún WhatsApp
      llega nunca a la bandeja.** Éste es el hueco que hace inalcanzable el objetivo, y no
      estaba escrito en ninguna parte. Verificado hoy, en cuatro archivos:
      - Al crear la org se le crea un inbox **web** y ése se guarda:
        `app/api/admin/clinics/route.ts:97` (`createInbox` + `update chatwootInboxId`).
      - Una vez puesto, **nunca se pisa**: `lib/chatbot/canal-web.ts:27` devuelve
        `created:false` y se va; `app/api/admin/chatbots/route.ts:53` hace lo mismo.
      - La única pantalla que lo muestra es **de sólo lectura**:
        `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx:215` lo pinta en un
        `<dd>`, sin input ni PATCH.
      - Y no hay nada del otro lado: **cero apariciones** de `embedded` en todo `app/` y
        `lib/` de la plataforma.
      **Medido en la base el 2026-08-31 (ya no es una lectura de código, es el estado real):**
      de las cuatro orgs que existen, **una sola tiene inbox — y es la org QA**
      (`ZZ QA Clinica Chatbot` → inbox 7). Las otras tres (`Onia (interna)`,
      `Bolivian electricidad`, `ZZ QA Ferreteria Tornillo`) tienen `chatwootInboxId` en NULL.
      Los dos inboxes donde escribió gente de verdad — **4 (Onia Web)** y **5 (Onia WhatsApp)** —
      no son de ninguna org. La tenencia la da esa columna y sólo esa
      (`lib/chatbot/bandeja-auth.ts:22`), así que hoy `/inbox` sólo puede mostrar conversaciones
      QA: las nuestras.
      **La consecuencia hoy:** el inbox de WhatsApp del +591 75414930 existe en Chatwoot
      (alta manual, hecha dos veces) pero no es el `chatwootInboxId` de ninguna org, así que
      `lib/chatbot/bandeja.ts` no lo puede mostrar. **Y ya costó:** las cinco conversaciones de
      desconocidos que se contaron hoy están todas en los inboxes 4 y 5 — ninguna se ve. Este
      ítem dejó de ser un riesgo futuro: es la única pieza entre el objetivo y estar cumplido. **La consecuencia mañana:** el día que
      Sergio corra la prueba del popup de Embedded Signup, nace un inbox de WhatsApp que la
      plataforma **va a ignorar** — el cliente conecta su número y su bandeja sigue vacía. La
      pieza que gatea todo el carril entrega un inbox huérfano.
      **Hecho =** un mensaje enviado al +591 75414930 aparece en `/inbox`, MIRADO con captura.
      **Lo mínimo que lo logra** (elegir al construir, no ahora): un PATCH de superadmin que
      apunte una org a un inbox existente. Lo caro sería una tabla de N inboxes por org —
      no hace falta hasta que un cliente tenga web **y** WhatsApp a la vez.

      ⚙️ **El código está construido y con gates verdes (2026-08-31, commit `88c1d56` del repo
      `onia-platform`), pero el ítem NO se cierra: sigue sin haber una conversación de un
      desconocido visible en `/inbox`, que es el objetivo.** Lo que se hizo: se extendió el
      PATCH de superadmin que YA existía (`app/api/admin/organizations/[id]/whatsapp/route.ts`)
      en vez de agregar una ruta nueva — acepta `chatwootInboxId` entero positivo o `null` para
      desvincular, y devuelve **409 si otra org ya usa ese inbox** (sin ese guardia dos orgs
      se ven las conversaciones entre sí: la tenencia la da esa sola columna). La pantalla
      `app/(dashboard)/admin/organizations/[id]/WhatsAppOrgConfig.tsx` dejó de ser un `<dd>`
      de sólo lectura: ahora es input + botón "Vincular". 11 tests nuevos; `tsc --noEmit`,
      `eslint` y los 2342 tests de la suite, verdes.
      ⚠️ **Falta lo que no depende de código, y son las dos cosas que lo cierran:** (1) el
      deploy del producto, que es de Sergio, y (2) decidir qué org se queda con los inboxes 4
      y 5 — anotado como **S8**, y cotizado en
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.
      ⚠️ **La pantalla NO se pudo MIRAR, y se dice en vez de simularlo:** es superadmin, así
      que necesita base + sesión. El `DATABASE_URL` de `.env.local` apunta a
      `127.0.0.1:54329`, que está cerrado (de los puertos de Supabase local sólo 54322 acepta
      conexión TCP, y ahí el handshake de Postgres expira). Producción sí responde pero
      todavía sirve la versión vieja. **La captura se toma en el primer deploy** — es lo
      primero que hay que hacer al retomar, antes que cualquier ítem nuevo.

      ✅ **Vuelta del 2026-08-31 (tercera) — la pantalla YA SE MIRÓ, y no hizo falta ningún
      deploy: lo que estaba roto era el entorno local, no la base.** El diagnóstico de arriba
      era correcto en el síntoma y equivocado en la causa, y por eso el ítem quedó tres
      vueltas esperando a Sergio para algo que no dependía de él.
      **La causa real.** El stack de Supabase local **está corriendo hace 31 h**
      (`docker ps` → `supabase_db_fiscal-mock`, healthy). Lo que no existe son los puertos que
      `.env.local` pedía: `supabase/config.toml` del propio repo declara API `55321` y
      Postgres `55322`, mientras el env apuntaba a `54321`/`54329`. Y `54329` no era "un
      puerto cerrado" cualquiera: es el del **pooler, que el config tiene `enabled = false`**,
      con un usuario ("postgres" con sufijo "onia") que ni figura en `pg_user`. Las claves anon y
      service_role tampoco eran las del stack — firmadas con otro secreto, daban 403 contra
      `/auth/v1/admin/*`. Tres datos mal, ninguno de ellos la base.
      **Lo que se hizo:** se corrigió `.env.local` (puertos reales, `postgres:postgres`,
      `?schema=public` como producción, claves firmadas con el `GOTRUE_JWT_SECRET` del
      contenedor), se creó un superadmin local (usuario por `/auth/v1/admin/users` + su fila
      en `profiles` con `role='SUPERADMIN'`), y se levantó el producto con
      `npm run build` + `node .next/standalone/server.js`.
      **Lo verificado MIRANDO, en la pantalla real** (`/admin/organizations/<id>`, sesión de
      superadmin, captura leída):
      1. La tarjeta **ESTADO TÉCNICO** ya no es un `<dd>`: muestra *"Chatwoot Inbox ID · De la
         tenencia de la bandeja. Vaciar para desvincular."* con input numérico (`No vinculado`)
         y botón **Vincular**.
      2. Vincular el inbox 5 a `Ferreteria Circuito Completo` → banner verde
         **"Org vinculada al inbox 5."**, y la fila queda persistida en la base
         (`clinic_settings.chatwootInboxId = 5`, releída por SQL después del click).
      3. **El guardia de tenencia funciona:** el mismo inbox 5 sobre la otra org devuelve el
         409 con su mensaje en pantalla — *"El inbox 5 ya es de «Ferreteria Circuito
         Completo»"* — y la base sigue con una sola org vinculada. Sin ese guardia dos orgs se
         leerían las conversaciones entre sí, así que era la parte frágil y es la que se probó.
      **La receta completa quedó en la skill que corresponde**, no en un doc suelto:
      `.claude/skills/onia-verificacion/SKILL.md` del repo onia-platform, § "Levantar el entorno LOCAL
      para poder MIRAR" — incluye las trampas que costaron esta vuelta (Prisma no lee
      `.env.local`; `?schema=dentalgest` hace fallar una migración que en `public` está bien;
      `onboardingCompletedAt` en NULL redirige todo a `/onboarding`; `next dev` en Windows
      panickea con Turbopack y recarga en loop con `--webpack`).
      🔗 **Hermano del mismo agujero, arreglado hoy por el carril de plataforma** (commit
      `7791ea3`, `onia-platform`): `encenderCanalWeb()` adoptaba un inbox de Chatwoot buscándolo
      **por nombre**, y el inbox se llama igual que la org — con dos "Clínica Dental" la
      segunda se quedaba con la bandeja de la primera. Es la misma llave de tenencia que este
      ítem: el PATCH ya tenía su 409, y ahora el alta automática también filtra los inboxes ya
      tomados. Se anota para que no se lo cuente dos veces: **no destraba nada de S8**.
      ⚠️ **Esto NO cierra el ítem** — el "Hecho =" sigue siendo un mensaje de un desconocido
      visible en `/inbox`, y para eso falta **S8** (deploy + dueño de los inboxes 4 y 5). Lo
      que cierra es la duda sobre el código: la pieza que S8 va a encender está mirada y
      probada, incluido su caso de error.

      ✅ **Gate 1 del 2026-08-31 (cuarta vuelta): EL DEPLOY YA ESTÁ HECHO. S8 se achicó a la
      mitad — queda la decisión y dos clicks, nada más.** Medido en producción, no leído:
      - **El build del producto trae el PATCH.** `onia-platform` buildeó a las 22:59 y el
        contenedor arrancó 23:00 (UTC). En sus chunks del servidor están las dos cadenas
        exactas de `88c1d56`: `` El inbox ${d} ya es de "${e.organization?.name…`` (el 409 de
        tenencia) y `chatwootInboxId debe ser un entero positivo o null` (el 400).
        ⚠️ **Y acá casi escribo el fantasma al revés:** el primer `grep` acotado a
        `.next/server/app/api/admin/organizations/` dio **cero** y parecía probar que el deploy
        no traía nada. Era falso — `route.js` son 648 bytes de loader y el código vive en
        `chunks/[root-of-the-server]__*.js`. Un grep que no encuentra descarta un lugar, no
        el hecho.
      - **La base sigue sin vincular.** Consultada en vivo (`supabase-db`, schema `public`): de
        las cuatro orgs, la única con `chatwootInboxId` es `ZZ QA Clinica Chatbot` → 7.
        `Onia (interna)`, `Bolivian electricidad` y `ZZ QA Ferreteria Tornillo` en NULL. Los
        inboxes 4 y 5 siguen huérfanos, así que las cinco conversaciones de desconocidos
        siguen invisibles.
      **Lo que queda de S8, entero:** entrar a `/admin/organizations/<id>` de `Onia (interna)`,
      escribir `5` y apretar Vincular. La pantalla ya está desplegada y ya fue mirada.

      ✅ **Gate 1 del 2026-08-31 (quinta vuelta) — sigue igual, y se midió en la base, no se
      leyó.** Consultada en vivo (`supabase-db`, schema `public`), de las cuatro orgs la única
      con `chatwootInboxId` sigue siendo `ZZ QA Clinica Chatbot` → 7; `Onia (interna)`,
      `Bolivian electricidad` y `ZZ QA Ferreteria Tornillo` en NULL. **Los dos clicks de S8 no
      se dieron todavía**, así que las cinco conversaciones de desconocidos siguen invisibles y
      el ítem sigue siendo el único que separa al carril de su objetivo. No se tocó la base:
      elegir dueño de inbox decide en qué bandeja aterrizan personas reales, y eso es de Sergio.

      ✅ **Gate 1 del 2026-08-31 (octava vuelta) — la base sigue igual, medida en vivo.** `supabase-db`, schema `public`: de las cuatro orgs la única con `chatwootInboxId` sigue siendo `ZZ QA Clinica Chatbot` → 7; `Onia (interna)`, `Bolivian electricidad` y `ZZ QA Ferreteria Tornillo` en NULL. **Los dos clicks de S8 siguen sin darse**, así que las cinco conversaciones de desconocidos siguen invisibles. No se tocó la base: elegir dueño de inbox decide en qué bandeja aterrizan personas reales, y eso es de Sergio.

      ✅ **Gate 1 del 2026-08-31 (séptima vuelta) — la base sigue igual, medida en vivo.** `supabase-db`, schema `public`: de las cuatro orgs la única con `chatwootInboxId` sigue siendo `ZZ QA Clinica Chatbot` → 7; `Onia (interna)`, `Bolivian electricidad` y `ZZ QA Ferreteria Tornillo` en NULL. **Los dos clicks de S8 siguen sin darse.** No se tocó la base: elegir dueño de inbox decide en qué bandeja aterrizan personas reales.

      ✅ **Gate 1 del 2026-08-31 (sexta vuelta) — sin cambios en la base, y se despejó la ÚLTIMA duda del ítem.** La base sigue igual (medida en vivo: sólo `ZZ QA Clinica Chatbot` → 7; `Bolivian electricidad` y `ZZ QA Ferreteria Tornillo` en NULL). Lo nuevo es que se comprobó que **los dos clicks alcanzan de verdad**: el producto lee las conversaciones con su propio token, y en Chatwoot un token de agente que no es miembro del inbox habría devuelto la lista vacía con 200 — exactamente el fantasma que este carril mide. Corrido contra producción, el token del contenedor `onia-platform` ve **inbox 4 → 5 · inbox 5 → 3 · inbox 7 → 6** conversaciones, con `+59173021804` en el payload del 5. Detalle y comando en **S8**. **No queda nada que verificar del lado del código.**

      ✅ **CERRADO el 2026-08-31 (novena vuelta) — Sergio dio los dos clicks, y la pantalla
      se MIRÓ: hay dos desconocidos en `/inbox` de producción.** Es el objetivo del carril
      entero, y es la primera vez que se cumple.
      **Gate 1, medido en la base y no leído** (`supabase-db`, schema `public`): de las cuatro
      orgs, `Onia (interna)` ya tiene `chatwootInboxId = 5` — la opción 1 recomendada en el
      radar. `ZZ QA Clinica Chatbot` sigue en 7; las otras dos en NULL, que es lo correcto.
      **Y se MIRÓ la pantalla real de producción, con sesión del dueño de esa org**
      (`superadmin@onia.com.bo`, el único perfil de `Onia (interna)`), no una simulación:
      `https://app.onia.com.bo/inbox` devuelve 200 y la lista trae, con su globo de no-leído
      en 1 cada una:
      | quién | cuándo | qué escribió |
      |---|---|---|
      | **mariohassen** (+591 73021804) | 27 ago | *"Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio."* |
      | **F** (+591 73232758) | 25 ago | la consulta larga de la clínica odontológica de 4 doctores (seguimiento de pacientes, reportes, costo) |
      | Sergio | 17 ago | "Hola" — éste sí somos nosotros |
      Los dos primeros **no son QA, ni el probador, ni Sergio**: son las conversaciones 37 y 35
      que la cola venía contando como invisibles. La frase de mariohassen es además, palabra por
      palabra, la de `WA_URL_LANDING` de onia.com.bo — o sea que el circuito completo
      (web → wa.me → +591 75414930 → Cloud API → Chatwoot → `/inbox`) quedó cerrado y visible.
      📎 **Cómo se miró, para que no cueste la próxima vez.** No hizo falta ni Docker ni el
      entorno local (Docker Desktop no levanta su motor WSL en esta máquina sin GUI): se generó
      una sesión del perfil interno con la admin API de GoTrue
      (`generate_link` → `verify`, que NO manda correo) y se armaron los cookies con el propio
      `@supabase/ssr` en vez de adivinarlos — el nombre sale de la URL de Supabase
      (`sb-app-auth-token`) y el chunking lo decide la librería. Sólo lectura: no se abrió
      ninguna conversación, así que no se marcó nada como leído en el Chatwoot de gente real.
      ⚠️ **Lo que este ítem NO cierra:** contestarles. Son personas reales esperando desde hace
      3-6 días y vende Sergio — sigue siendo **S7**.


- [x] **El número que la cola reporta verde NO incluía los 12 evals: `node --test *.test.mjs`
      los saltea, y son justo los graders que ya habían estado muertos días.** Encontrado
      auditando los `[x]` recientes contra el código de hoy — que es lo que manda hacer el loop
      cuando "Ahora" queda bloqueado —, corriendo la suite y no leyéndola.
      **La medición, los dos comandos, hoy:**
      | comando | tests | incluye `evals/` |
      |---|---|---|
      | `node --test *.test.mjs` (dentro de `bot/`) | **658** | **no** |
      | `node --test` (bare, recursivo) | **670** | sí (658 + 12) |
      Los 12 evals viven en `hermes-content/deploy/vps-ops/bot/evals/evals.test.mjs`, o sea en un
      subdirectorio, y el glob `*.test.mjs` **no baja un nivel**. El "658/658 verde" que quedó
      escrito arriba es el número del glob: real, pero **medido con un comando que no corre los
      graders que miden que el bot no cotiza precios, no promete y deriva al humano**.
      **Por qué esto es el mismo fantasma y no uno nuevo.** El ítem de arriba —*"Los 12 evals
      estaban MUERTOS hace días y la cola reportaba 634/634 verde"*— se cerró arreglando el
      `export LLM_SYSTEM_PROMPT`. Correcto, pero incompleto: arregló **el síntoma de esa vez** y
      dejó viva **la razón por la que nadie lo vio**, que es que el número reportado se saca de un
      comando ciego a `evals/`. Sin esto, el próximo export que se caiga vuelve a desaparecer en
      silencio.
      **Lo que se hizo, y es lo mínimo que cierra las dos mitades:**
      1. **Un solo comando, y que sí los corra:** `npm run test:bot` (`package.json` de
         `onia-hermes`) = `cd hermes-content/deploy/vps-ops/bot && node --test`. Corrido hoy:
         **676/676 verde** (670 + los 6 del guardia). Es la forma recursiva, así que ningún
         subdirectorio de tests puede quedar afuera.
      2. **El cable-trampa DENTRO del glob que sí se reporta:**
         `hermes-content/deploy/vps-ops/bot/evals-contrato.test.mjs`. **Parsea los imports del
         propio `evals.test.mjs`** y verifica contra los módulos reales que cada nombre siga
         exportándose — así cubre los cinco (`bot-engine`, `guardrails`, `bench`, `run-turn`,
         `persistence`), no sólo el que se rompió aquella vez. Si un export desaparece, se pone
         rojo **en el número que la gente mira**, en vez de en un archivo que ese comando no abre.
      **Probado que puede fallar, que es lo único que prueba que un guardia sirve:** se le sacó el
      `export` a `LLM_SYSTEM_PROMPT` en `run-turn.mjs` y el guardia salió **5 pass / 1 fail**,
      nombrando el módulo y el export exactos (*"../run-turn.mjs ya no exporta LLM_SYSTEM_PROMPT"*)
      — reproduciendo `d334d776` a pedido. `run-turn.mjs` restaurado byte a byte después
      (`git diff` vacío). Incluye además el test que impide que el guardia se vuelva un verde
      hueco: si el parser encontrara menos de 4 imports relativos, falla.
      **Gates:** este repo no tiene TS, eslint ni vitest (el bot es ESM plano con `node:test`), así
      que el gate que aplica es la suite — **676/676**, con los 12 evals adentro y verificados
      aparte (**12/12**).
      📎 **Drift honesto que esto suma al `scp` de S9:** `espejo-check.mjs` ahora nombra
      `evals-contrato.test.mjs` en FALTAN EN EL VPS. Es un test, no el motor: no cambia una línea
      de lo que corre. Los tres DISTINTOS (`espejo-check.mjs`, `espejo-check.test.mjs`,
      `recepcionista.test.mjs`) ya estaban antes de esta vuelta.

- [x] **S11 era un FANTASMA: el bot ya firma como "Onia Bot" desde el 18-ago, y la bandeja ya
      rotula "Tu asistente".** Estaba en "Bloqueado en Sergio" pidiéndole una acción sobre un
      bot vivo que no habría cambiado nada — el molde exacto que este carril mide, y del tipo
      caro: uno que hace poner las manos en producción.
      **Por qué el diagnóstico original se equivocó, que es lo que hay que no repetir.** El
      Radar §11 decía *"de los mensajes salientes de las conversaciones 11, 35 y 37, los 8
      tienen `sender_id = 2` y ninguno el 3"*. Medido hoy en la base de Chatwoot, eso es cierto
      **y no prueba lo que se le hizo probar**: los 8 son TODOS de la conv 11 y van del
      **6-ago al 15-ago** — las convs 35 y 37 aportan **cero** salientes (son dos de los cuatro
      desconocidos que nadie contestó, S7). O sea que se midió una conversación cuyo último
      mensaje es **anterior** al día en que la variable empezó a hacer efecto, y de ahí se
      concluyó cómo se comporta el bot hoy.
      **Y el síntoma "MIRADO" era real pero histórico.** La conv 11 (+591 71606892) sí se pinta
      entera como "Vos", y va a seguir así para siempre: esos mensajes **de verdad** los posteó
      la cuenta 2. Mirar la pantalla fue correcto; mirar una conversación vieja para juzgar el
      comportamiento actual es lo que falló.
      **El estado real, medido en producción y no leído** (base de Chatwoot + env del proceso
      que CORRE, no `docker exec printenv`, que arranca un proceso nuevo con el env base del
      contenedor y no el del `docker exec -d` que levantó el bot):
      | qué | medido |
      |---|---|
      | `CHATWOOT_BOT_AGENT_ID` del proceso del bot (`/proc/400019/environ`) | **3** |
      | persistido en `/opt/onia/bot/webhook.env` (lo sourcea `webhook-server.sh:134`) | **sí** — sobrevive al reinicio |
      | `messages` salientes con `sender_id = 3` | **13, del 18-ago al 31-ago** |
      | `messages` salientes con `sender_id = 2` | 14, del 26-jul al 30-ago — es Sergio a mano, que es lo correcto |
      | `CHATWOOT_BOT_USER_ID` en el proceso de `onia-platform` | **no seteada** ⇒ `botUserId()` cae a su default **3** (`lib/chatbot/bandeja.ts:118`) |
      Bot postea 3, bandeja busca 3 ⇒ `de = "bot"` ⇒ **"Tu asistente"**
      (`InboxClient.tsx:52`). La clasificación es función pura y está cubierta:
      `npx vitest run lib/chatbot/bandeja.test.ts` → **13/13**, con el caso
      *"outgoing de OTRO agente = negocio (el dueño contestando)"*.
      **Lo que NO se hizo, dicho y no simulado:** no se re-MIRÓ `/inbox` renderizado — necesita
      base + sesión del dueño. Se dice porque la regla del carril es mirar; acá la evidencia
      medida es **más fuerte que la captura**, porque una captura de la conv 11 es exactamente
      lo que produjo la conclusión equivocada. Lo que faltaría mirar es una conversación
      **posterior al 18-ago** (la 44 sirve: saliente con `sender_id = 3` del 31-ago).
      📎 **La trampa que queda viva y por la que esto podría volver:** los dos lados tienen
      defaults **distintos** — el bot cae a **2** (`webhook-server.sh:149`,
      `${CHATWOOT_BOT_AGENT_ID:-2}`) y la plataforma a **3**. Hoy no molesta porque la variable
      está en `webhook.env`; el día que esa línea se borre, el bot vuelve a firmar como Sergio,
      **toda la bandeja se re-rotula "Vos" en silencio** y además se apaga la detección de
      traspaso (con la variable vacía `takeoverTurn` devuelve `null` y el bot deja de callarse
      cuando el dueño contesta). **No se "arregló" cambiando el default a 3 a propósito:**
      tocar ese fallback cambia el comportamiento de un servicio vivo y necesita deploy — o sea
      Sergio— y el riesgo del inbox 3 del Radar §11 sigue sin verificarse. Queda escrito acá,
      que es lo que cuesta cero y evita el próximo diagnóstico al revés.

> **Siete de estos eran pendientes vivos en el handoff y ya estaban hechos.** Se verificaron
> uno por uno contra el código de hoy, no contra el handoff. Cada uno lleva su prueba: si
> alguien los vuelve a abrir, que sea contra el archivo, no contra la memoria.

**Cerrado en esta vuelta (2026-08-31):**

- [x] **Arrastrado del ítem 1: dos huecos de plataforma — LOS TRES cerrados, y el tercero
      lo cerró otro carril hace una hora.** Gate 1 del 2026-08-31 (sexta vuelta) contra el
      código de HOY, no contra el texto del ítem:
      1. ✅ **CSP:** `onia-platform/next.config.ts:18` deriva el esquema del websocket del
         de la URL — `${url.protocol === "https:" ? "wss" : "ws"}://${url.host}`. Era el
         arreglo de este mismo carril y sigue en pie.
      2. ✅ **eslint no entra a los worktrees:** `package.json:10` →
         `"lint": "eslint --ignore-pattern \".claude/**\""`. La raíz de verdad
         (`globalIgnores` de `eslint.config.mjs`, que sigue listando sólo `.next/**`) NO se
         tocó y NO hace falta: el script ya la tapa, y editar ese archivo lo bloquea el hook
         `config-protection`. Se deja de arrastrar.
      3. ✅ **El test inestable dejó de serlo:** commit `e644c85` de `onia-platform`
         (31-ago 19:35) — *"la guarda del gate de lint fallaba al azar y volvia el gate
         inservible"*. La causa que encontró es la que este carril sospechaba y mejor
         medida: la primera `isPathIgnored` carga el flat config entero (~1,7 s en reposo,
         ~8 s con la suite en paralelo) contra un default de vitest de 5 s. **Corrido hoy:**
         `npx vitest run __tests__/eslint-no-lintea-worktrees.test.ts` → **4 passed**, 6,88 s.
      **Por qué se cierra y no se deja "por las dudas":** el ítem existía para dejar escritos
      dos huecos ajenos con su prueba. Los dos se arreglaron y el tercero también. Un ítem
      abierto cuyo contenido ya está hecho es el fantasma exacto que este carril mide.


- [x] **`recepcionista.test.mjs` estaba COMMITEADO CON 0 BYTES — un test que no podía fallar.**
      Gate 1 confirmó que era real, no fantasma: `wc -c` daba **0** y `git show HEAD:…` también,
      desde `3e3841aa`. `node --test` lo cargaba, no encontraba ningún caso y lo contaba como
      éxito: **silencio sumando a la cuenta de verdes**, que es la enfermedad medida de este
      carril.
      **De los dos caminos que la cola daba (borrarlo o llenarlo) se eligió llenarlo, y el
      motivo es un hueco real, no una preferencia.** Grep sobre TODA la suite antes de escribir:
      `faqNegocioVigente` aparecía **cero veces** — y es la FAQ que **edita el dueño** desde el
      panel, o sea el único matcher del bot que un cliente cambia sin que nadie le revise el
      regex. `catalogoCliente` y `botonesRecepcion`, también cero. El GUION en cambio ya está
      cubierto por `bot-engine.test.mjs` §8/§8b **por el motor real**, que es más señal que
      cualquier stub: eso no se duplicó.
      **20 tests**, sobre lo que nadie miraba:
      - **fail-closed de vigencia**: una FAQ con vencimiento y sin fecha de mensaje NO se sirve.
        Estaba documentado en el código y no probado.
      - **el matcher que edita el dueño**: palabra entera ("iva" no salta en "activa"), piso de
        3 letras, y **los metacaracteres del tag escapados** — sin eso un tag `2.5` matchea
        "245" y un tag con `.` contesta CUALQUIER mensaje: una FAQ que responde a todo.
      - `id !== "negocio"` ignorado (las FAQ de Onia no se sirven en boca del cliente), entradas
        basura sin explotar, y que se recorren TODAS las FAQ y no sólo la primera.
      - `catalogoCliente`: descarta lo que no tiene nombre, no deja el guion colgando sin
        `queResuelve`, y devuelve `""` — que es lo que hace derivar a R_NO_DATO.
      - `botonesRecepcion`: 3 botones y **≤20 caracteres, que es límite de META**: pasarse no da
        error visible, WhatsApp rechaza el interactivo y el cliente se queda sin menú.
      **Probado que los tests PUEDEN fallar, que es lo que le faltaba al archivo de 0 bytes.**
      Cinco mutaciones a `recepcionista.mjs`, una por una, revirtiendo entre cada una — sin
      escapar metacaracteres, sin el piso de 3 letras, sin el filtro de `id`, sin descartar
      productos sin nombre, y truncando el botón largo en vez de caer al genérico: **las cinco
      dieron rojo**. Suite del bot **654/654** (634 antes: el archivo aportaba 0).
      ⚠️ **Un test mío salió mal y el error vale más que el test:** el de fail-closed pasaba
      `undefined` a través de un helper con valor por defecto, así que **disparaba el default y
      verificaba lo contrario en verde**. Se corrigió llamando la función directo, y quedó el
      comentario en el archivo — es exactamente el molde del test que no puede fallar.
      ⚠️ **Consecuencia para el espejo, dicha y no escondida:** el archivo ahora es DISTINTO del
      VPS (allá sigue en 0 bytes), así que `espejo-check.mjs` lo reporta — correctamente. Es el
      único archivo del veredicto; entra en el próximo `scp` del directorio. No cambia nada de
      lo que corre: es un test.

- [x] **Los 12 evals del bot estaban MUERTOS hace días y la cola reportaba "634/634 verde".**
      Encontrado en el Gate 1 de esta vuelta corriendo la suite, no leyéndola: `node --test`
      daba **635 tests, 634 pass, 1 fail**. El que fallaba era
      `hermes-content/deploy/vps-ops/bot/evals/evals.test.mjs`, y no fallaba un caso: **no
      cargaba el módulo**. `SyntaxError: The requested module '../run-turn.mjs' does not
      provide an export named 'LLM_SYSTEM_PROMPT'`.
      **La causa, con su commit.** `git log -S` lo señala solo: el export desapareció en
      **`d334d776`** — *"el espejo del motor quedó 25 archivos atrás del VPS"*—, la
      sincronización que trajo al repo la versión del VPS, donde el prompt estaba **inlineado**
      dentro de `askLiteLLM`. El texto nunca se perdió (es byte a byte el mismo); lo que se
      perdió fue el `export`, y con él la única forma que tenían los evals de importarlo.
      **Por qué nadie lo vio en tres vueltas.** Un archivo que no carga lo reporta `node --test`
      como **UN test roto entre 634 verdes**. Tres vueltas seguidas escribieron "634/634",
      "626/626", "619/619" leyendo el `pass` y no el `fail`. El costo real: los 12 evals que
      miden que el bot **no cotiza precios, no promete y deriva al humano** no corrían desde
      `d334d776` — justo los graders que cuidan la parte cara.
      **Lo que se hizo** — lo mínimo, sin cambiar una coma del comportamiento:
      `run-turn.mjs` vuelve a exportar `LLM_SYSTEM_PROMPT` como constante y `askLiteLLM` la
      usa (`const system = LLM_SYSTEM_PROMPT`), exactamente como antes de `d334d776`.
      **La prueba de que sirve, corrida:** los 12 evals ahora CORREN y dan
      **PASS 11/11 · 1 no corrida** — E12 (`modelo_real`) queda sin correr a propósito, porque
      llama al modelo pago y **ese gasto lo aprueba Sergio**.
      **Su guardia, y por qué no es un test de adorno:** el primer intento importaba la
      constante por nombre en `run-turn.test.mjs`, y al quitar el export **fallaba igual de
      silencioso** — se caía el módulo entero. Se cambió a `import * as runTurnModule`, así que
      ahora rompe **por su nombre**, con el motivo escrito, y los otros 8 tests del archivo
      siguen pasando. Verificado en los dos sentidos: con el export → verde; revirtiendo
      `run-turn.mjs` a `HEAD` → `✖ el prompt del LLM sigue exportado — si se inlinea, los evals
      dejan de correr en silencio`, `pass 8 · fail 1`.
      **Suite del bot: 647/647, `fail 0`** (antes: 635 con 1 en rojo).
      🔗 Es el **tercer** episodio del mismo agujero — espejo del repo vs `/opt/onia/bot` — y
      el primero descubierto por un gate y no de casualidad. Por eso en esta misma vuelta se
      commitea `hermes-content/deploy/vps-ops/bot/espejo-check.mjs`, que la vuelta anterior
      dejó **sin commitear** (estaba `??` en `git status`).

- [x] **v6.8 — recorrida de fricción completa.** Hecha el 2026-08-31 sobre las dos pantallas
      que el ítem nombra, con la sesión del dueño de `Ferreteria Circuito Completo` (la org
      vinculada al inbox 5), en escritorio **y** en móvil (375×812), MIRANDO capturas. La
      recorrida encontró **una cosa rota de verdad, que se arregló en la misma vuelta**, y
      corrigió dos de los tres roces que el propio ítem traía anotados.
      **Lo roto, y arreglado** (`onia-platform`, commit `fdcb3df`, mergeado a `master` y
      pusheado): **el globo verde de no-leídos no bajaba nunca.** `unread_count` sale de
      `agent_last_seen_at` de Chatwoot, y lo único que movía esa columna era la UI de Chatwoot
      — que el dueño no usa. Medido en la base de producción ANTES de tocar: de las 8
      conversaciones de los inboxes 4 y 5, **siete tenían `agent_last_seen_at` en NULL**.
      Ahora abrir la conversación llama a `update_last_seen` (después del guard de tenencia, y
      en `try/catch`: leer es lo que no puede romperse) y el cliente relee la lista una vez para
      que el globo baje sin esperar los 15 s del poll. Verificado MIRANDO contra el Chatwoot de
      producción: abrir la conversación 11 le sacó el globo en pantalla **mientras las otras dos
      lo conservan**, y su `agent_last_seen_at` quedó con la hora del click. Las de desconocidos
      (35 y 37) no se tocaron a propósito: S7 las espera sin leer.
      **Corrección al roce 2 del propio ítem — era fantasma, y de los caros.** Decía que "el
      buscador dice *Buscar pacientes…* en una ferretería" y sonaba a texto dental hardcodeado.
      No lo es: `Header.tsx:28` y `Sidebar.tsx:53` YA leen `vocabularioDeTrack(...)`, y lo que
      faltaba era el flag. Con `PLATFORM_LAYER=1` — que es **el valor de producción**, leído con
      `docker inspect onia-platform` — la misma pantalla dice **"Buscar productos…"** y el menú
      pasa de `Pacientes · Cobros · Reportes` a **`Catálogo · Inventario · Caja`**. MIRADO en las
      dos configuraciones. El roce existía sólo en local, por una variable que faltaba en
      `.env.local`. **El roce 1 (la barra del admin encimada) NO se re-verificó**: vive en
      `/admin/organizations/<id>`, que no es ninguna de las dos pantallas que este ítem nombra.
      Queda como estaba — pero ojo, nació con el mismo entorno sin flag que produjo el roce 2, así
      que antes de perseguirlo conviene volver a mirarlo con `PLATFORM_LAYER=1`.
      **Un roce nuevo, MIRADO:** al entrar a `/inbox` el modal **"Primeros pasos"** se abre encima
      y tapa la lista entera de conversaciones; hay que cerrarlo para ver quién escribió. Es el
      checklist de alta (`components/onboarding/GuiaInicio`), y aparece incluso con conversaciones
      esperando.
      **Lo que la recorrida NO pudo cerrar, y quedó anotado en su lugar:** "La cita" le habla de
      consultorio a una ferretería incluso con el flag puesto (ficha nueva en "Después", es del
      carril de plataforma), y el bot firma **"Vos"** en vez de "Tu asistente" (**S11** + radar §11).
      🔴 **Corregido el 2026-08-31: lo del "Vos" era un fantasma y la recorrida lo dio por roto
      mirando la conv 11, que es de antes del 18-ago.** El bot ya firma como "Onia Bot"
      (`sender_id = 3`) y la bandeja ya rotula "Tu asistente". Ver S11 en "Cerrado".
      **Dos trampas nuevas del entorno**, que van a costar una vuelta a quien las repita y por eso
      se escriben: `npm run build` usa Turbopack y **no emite `.next/standalone`** — para poder
      levantar el producto hay que correr `next build --webpack`, que es además lo que
      `next.config.ts` declara como build de deploy; y ese build **exige `ENCRYPTION_KEY`** o
      muere en "Failed to collect page data for /api/gateway-config/test". Las dos van a la skill
      `onia-verificacion`.

- [x] **1 · Contar si un desconocido YA escribió.** Contado contra las dos bases, no contra el
      handoff. **La respuesta es SÍ: cinco desconocidos, y ninguno se ve en `/inbox`.**
      **El número.** La cuenta 2 de Chatwoot tiene hoy **22 conversaciones**, no 26 — el
      handoff (`hermes-content/docs/handoff/chatbot.md:142`) traía un número viejo. Repartidas
      en cuatro inboxes: 3 `ONIA Demo` (8, todas pruebas nuestras de julio), 4 `Onia Web` (5),
      5 `Onia WhatsApp` (3), 7 `ZZ QA Clinica Chatbot` (6, todas QA).
      **Los cinco desconocidos**, con la evidencia que los distingue de una prueba nuestra —
      `additional_attributes` de cada conversación, que guarda dispositivo y referer:
      | conv | inbox | quién | cuándo | qué escribió | ¿le contestaron? |
      |---|---|---|---|---|---|
      | 34 | 4 web | iPhone/Safari, referer `onia.com.bo/comparativa` | 24-ago | "hola" | no |
      | 35 | 5 WhatsApp | +591 73232758 | 25-ago | *"estoy evaluando un sistema de gestión para una clínica odontológica de 4 doctores…"* | **no** |
      | 36 | 4 web | iPad/Google Search App, referer `onia.com.bo` | 27-ago | "Quiero información" + dejó su correo `Saguilera@ds-santacruz.bo` | no |
      | 37 | 5 WhatsApp | +591 73021804 | 28-ago | *"Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio."* | **no** |
      | 40 | 4 web | iPhone/**Instagram**, referer `onia.com.bo` | 29-ago | "Ajajajajaj" → *"0 ni una reunión"* | sí |
      **Por qué cuatro de cinco quedaron sin respuesta, y por qué NO es un bug nuevo.** Los
      cuatro (34, 35, 36, 37) tienen **cero filas** en `onia_center.bot_messages`: el motor
      nunca los vio. Sus fechas — 24, 25, 27 y 28 de agosto — caen exactamente dentro de la
      caída de cuatro días que ya está cerrada más abajo. Desde el 29-ago el motor procesa
      normal (conv 38 y 40 sí tienen sus filas). **La caída ya tiene su precio medido: cuatro
      personas reales.** No se abre ítem por esto; la causa está auto-curada en
      `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh`.
      **Y el inbox.** Ninguno de los dos inboxes donde escribieron (4 y 5) es el
      `chatwootInboxId` de ninguna org — la única org con inbox es la de QA. O sea que **aunque
      el motor hubiera estado vivo, esas conversaciones tampoco se habrían visto en `/inbox`**.
      Eso es el ítem 1 de Ahora, y esta medición es su prueba.
      ⚠️ Sólo lectura, como pedía el ítem: no se borró ni se respondió nada. Contestarles es
      decisión de Sergio — anotado como S7 en Bloqueado.

**Los siete fantasmas** (el handoff los seguía listando como pendientes):

- [x] **Los DOS "fixes de fondo del motor" del 23-ago** que el handoff decía que "siguen
      esperando su sesión". Los dos están puestos: el timestamp en el arranque vive en
      `hermes-content/deploy/vps-ops/bot/webhook-server.mjs:542-545` (con el comentario que
      cita el pedido de los dos handoffs), y `markMessageDelivered` en el turno normal está
      en `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs:733-737` — se cerró como
      PIEZA 4 el 29-ago y el handoff lo arrastró igual en "Próximos pasos".
- [x] **"Decisión: FAQ genérica por cliente (`id:"negocio"`)"**, listada como pendiente de
      Sergio. Está viva y contestando desde el 28-ago:
      `hermes-content/deploy/vps-ops/bot/knowledge.mjs:66` mapea `negocio → R_FAQ_NEGOCIO`,
      con su guardarraíl de palabras disparadoras en la línea 394.
- [x] **"¿Cablear la alerta del watchdog a Telegram?"**, listada como decisión pendiente.
      Ya está cableada: `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh` avisa bot
      caído y BOT MUDO hacia Chatwoot (1 aviso por incidente + recuperación).
- [x] **"Pantalla del dueño para su canal, sin pasar por el superadmin"** (Próximos pasos 2).
      Es la pieza 3 del 29-ago: `app/(dashboard)/settings/chatbot/CanalWebCard.tsx` con el
      botón de encendido y el snippet, sobre `lib/chatbot/canal-web.ts`.
- [x] **"Siembra con datos reales + bench de humo"** (Próximos pasos 1). El bench existe y da
      6/6: `hermes-content/deploy/vps-ops/bot/humo-plantillas.mjs` con su fixture
      `hermes-content/deploy/vps-ops/bot/plantillas-humo.json`; la plantilla bebe el horario
      real de la org desde `lib/chatbot/plantillas.ts`.
- [x] **"Limpieza de data QA (conversaciones 29/31/32/33, inbox 6, filas sintéticas)"**,
      listada como pendiente de coordinar con Sergio. **Ejecutada el 29-ago 00:40 con su
      aprobación**: 10 conversaciones + el inbox 6 huérfano destruidos por rails, 12
      `bot_conversations` y 52 `bot_messages` sintéticos borrados, backups CSV en
      `/opt/onia/backups/db/qa-limpieza-20260829-003953/`. La data QA que quedó es
      **posterior** — está en Después.
- [x] **"Pricing: ¿existe un escalón más barato sólo widget web, sin WhatsApp?"**. Sergio lo
      decidió el 30-ago: **OPCIÓN A, Bs 390 plano todo incluido**, ratificado y sin cambio de
      código porque `lib/pricing.ts:23` ya lo tenía (`entryMonthly: 390`, `annualTotal: 3900`).
      La comparativa que sostiene la decisión: `hermes-content/docs/ONIA_PRICING_CHATBOT_PROPUESTA.md`.

**Lo construido y verificado en producción** (resumen; el detalle largo vive en el handoff):

- [x] Editor del chatbot **pre-armado por rubro** (`lib/chatbot/plantillas.ts`, 19 tests) +
      el bug de UI que dejaba el nombre del servicio en 26px.
- [x] **Bandeja nativa `/inbox`** viva: backend (`lib/chatbot/bandeja.ts`,
      `lib/chatbot/bandeja-auth.ts`, `app/api/bandeja/route.ts`), pantalla
      (`app/(dashboard)/inbox/InboxClient.tsx`), tenencia revalidada fila por fila, y el
      **candado bot-humano** con armado y desarme.
- [x] **Multimedia** en la bandeja, **visión LLM** (`hermes-content/deploy/vps-ops/bot/vision.mjs`,
      US$ 0,0007 por imagen) y **detector de comprobantes** — que jamás confirma un pago.
- [x] **Editor conversacional** "Enséñale conversando"
      (`app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx` +
      `lib/chatbot/editor-conversacional.ts` + `hermes-content/deploy/vps-ops/bot/editor-sugerir.mjs`).
- [x] **Insistencia** con perilla en el panel y barrido por cron
      (`hermes-content/deploy/vps-ops/bot/insistencia-run.mjs`), **push "te escribieron"**
      (`lib/chatbot/push-te-escribieron.ts`) y **frases de campaña** (deploy `e5c1ad3`).
- [x] **El motor estuvo caído 4 días** (24 al 28-ago) y volvió: `/tmp/onia-bot` a medias +
      la excepción de firewall perdida en el reboot. Las dos causas están auto-curadas desde
      `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh`.
- [x] **Canario de auth** cada 5 min, **n8n saneado** (4 workflows con claves vivas
      redactados y archivados, 27 inactivos archivados) y el **webhook de Cal.com
      despublicado** — estaba huérfano y aceptaba POSTs forjados.
      🔴 **De esta línea SE SACÓ "Branding de Chatwoot completo (seis configs)" el 2026-08-31
      (séptima vuelta): era falso, y medido desde la calle.** Un `[x]` que dice *completo*
      sobre algo que está roto en producción es el fantasma exacto que este carril mide, y
      éste llevaba **quince días**. No son seis configs sino nueve, y tres —`BRAND_URL`,
      `TERMS_URL`, `PRIVACY_URL`— dicen `www.chatwoot.com` en el HTML público de
      `https://chat.onia.com.bo/app/login` desde el **16-ago**. Verificado hoy con un `curl`
      a la página, no leyendo la base:
      `"BRAND_URL":"https://www.chatwoot.com"`. La parte que SÍ está bien y por eso no se
      borra entera: logo, `BRAND_NAME`, `INSTALLATION_NAME` y el `WIDGET_BRAND_URL` del pie
      del widget siguen siendo los de Onia. **Lo pendiente vive en el ítem de "Después"
      (`Vigilar que el reconcile…`) y en S10**, que es donde tiene que estar mientras siga
      roto.

---

## Rechazado, con motivo — no volver a proponerlo

- **Difusiones masivas** (el último hueco contra Sendy). Necesita plantillas de Meta
  **aprobadas por cada org** y tiene costo por mensaje a partir del 1-oct-2026, cuando se
  cierra la ventana gratis de 24 h. Construirlo sin un cliente que lo pida es especificar a
  ciegas un flujo cuyo costo todavía no conocemos. **Se reabre el día que un cliente lo pida**,
  y ahí se especifica con su caso.
- **Un escalón de precio más barato "sólo widget web"**. Ya decidido: Bs 390 plano todo
  incluido (`lib/pricing.ts:23`). Reabrirlo es desandar una decisión de Sergio del 30-ago
  tomada con la comparativa de mercado en la mano.
- **Apagar los workflows de n8n que avisan por Telegram.** Hacen trabajo real: apagarlos para
  bajar ruido rompe la automatización para arreglar una notificación. Lo que corresponde es
  editar el nodo de aviso de cada uno — y eso espera la decisión S5.
- **Un modelo local para la visión del bot.** Sergio ya lo descartó el 30-ago con el motivo
  escrito: *"pagamos api nomás de modelo barato"* — ollama ya estranguló el VPS una vez
  (steal 93%, load 158). El costo medido de la API es US$ 0,0007 por imagen.
