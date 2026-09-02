# Radar de decisiones de producto — las ideas que no se pueden perder

> Doc VIVO sin fecha (se edita, no se duplica). Nace 2026-08-17 de un volcado de
> Sergio: "estas son ideas que no puedo olvidar; luego vamos a desglosar una por
> una". Cada frente lleva su estado REAL verificado y la pregunta que falta decidir.

## 1. ¿Chatwoot o plataforma de chat PROPIA hecha por Onia?

**La regla de Sergio**: "tiene que ser hecho por nosotros — usar otra plataforma no
tiene sentido".

**Lo que YA es nuestro (construido y probado):**
- El MOTOR conversacional entero: `bot-engine` propio, 508 tests, guardrails,
  etapas, LLM gateado. Chatwoot NO piensa nada — solo transporta.
- El conocimiento por organización + editor + probador (producto, en prod).
- La cara: widget con "Desarrollado por Onia" verificado en píxeles (branding de
  Chatwoot pisado vía `installation_configs`; vigilar el reconcile).

**Lo que Chatwoot aporta hoy (y costaría construir):** bandeja humana multi-agente,
canales (WhatsApp/Website/API), Embedded Signup ya soportado, historial. Decisión
previa vigente: "encender, no construir" (memoria plataforma-canales-decision).

**Camino recomendado (a ratificar):** Chatwoot queda como INFRAESTRUCTURA invisible
(el cliente jamás lo ve — ya logrado), y la bandeja que el cliente usa se construye
DENTRO del panel Onia cuando un cliente real la pida (`/communications` ya existe
como base de solo-lectura). Reemplazar Chatwoot entero = proyecto grande sin cliente
que lo pague todavía; taparlo = hecho.

**Autochecking**: no depende de la plataforma — depende del App Review de Meta (EN
CURSO, ~20 días) + prueba de coexistencia con +591. Hasta qué punto es self-service:
popup conecta número y el formulario A-D arma el bot; lo único no-self-service que
queda es la plantilla utility para fríos y el alta del inbox (automatizable después).

## 2. Páginas web — estado

**Avanzado, es el frente más maduro:** Web Factory con 22 bloques + templates
(dashboard canon v4/v5 elegido, landing-realestate generada desde learned model),
pattern banks + DESIGN_LEARNED (15 fuentes + galerías), checklist de pre-entrega de
17 items como gate, mapa de conocimiento ordenado en DESIGN_STACK.
**Falta:** portar v5 al producto (espera OK) · portafolio publicado (3 videos listos
sin publicar) · pipeline intake→web a escala con clientes reales.

## 3. Bots de LLAMADAS — estado

- Arquitectura YA escrita: `ONIA_VOZ_WHATSAPP_ARQUITECTURA_20260802.md` (1.058
  líneas). Bolivia NO está excluida de la Calling API de Meta (verificado 15-ago).
- **Regla F1 antes de encender NADA**: separar llamadas de mensajes — si se habilita
  `calls` en la misma app, los webhooks de llamada caen en Chatwoot, responde 200 y
  los descarta: el que llama escucha silencio y el diagnóstico falso cuesta días.
- Estado real: diseño listo, CERO construcción. Cola: detrás del chatbot de texto
  completo (que está a un paso). El benchmark de agentes descartó recepcionista de
  voz como próximo paso por esfuerzo/retorno — la arquitectura queda para cuando
  haya clientes pagando el chat.

## 4. Landing con precios — estado

- Landing viva en onia.com.bo (139 kB, deployada; /comparativa arriba).
- Precios: `onia-platform/lib/pricing.ts` ÚNICA fuente (regla dura). Chatbot:
  **Bs 390/mes o Bs 3.900/año, sin cargo inicial**, con 500 conversaciones + "a medida"
  cotizado. El consumo de Meta lo paga el cliente en su cuenta (por eso el abono cierra a
  este precio — ver `ONIA_FECHAS_CRITICAS_PLAN.md`). Checkpoint 1-sep para la tarifa exacta.
- Promesa SIAT RETIRADA de la bio hasta que el NIT (S2) destrabe — al volver, es el
  argumento del 30-sep (RND 102600000007, grupos 9-12 por NIT, verificable).
- Pendiente: hero nuevo (queued de sesión anterior) · portar los precios nuevos del
  catálogo de venta a la landing cuando Sergio ratifique la lista.

## Orden sugerido para desglosar (cuando Sergio quiera)

1. Cerrar chatbot texto (inbox→org en curso · plantillas por rubro · esperar Meta).
2. Ratificar el camino Chatwoot-invisible + bandeja propia gradual.
3. Portar dashboard v5 + hero/precios de landing.
4. Llamadas: recién con clientes de chat pagando (F1 primero, siempre).


## 5. Requisitos de Sergio para el chatbot del cliente (2026-08-18)

1. **Self-service TOTAL**: el cliente configura TODO desde su panel — sin tocarnos
   la puerta. Simple por diseño (el formulario A-D es la base; lo que no sea
   simple, se simplifica).
2. **Fácil para los clientes DEL cliente**: el que chatea con el bot debe poder
   usar y COMPRAR sin fricción — el bot no es solo informativo, es un canal de
   venta del negocio.
3. **Capacidades ricas a investigar (factibilidad en curso)**: enviar/recibir
   imágenes (catálogo con fotos, comprobantes), botones/listas interactivas,
   carrito/pedido por chat, y qué permite cada canal (widget web vs WhatsApp
   Cloud API — catálogo nativo de WhatsApp incluido).


## 6. Webs CONECTADAS al sistema (2026-08-18) — tarea abierta

Sergio: "quiero que toques cómo podemos conectar páginas webs a los sistemas; hacé la
prueba con Bolivian Electric". Doc con los 4 circuitos y el plan de prueba:
`ONIA_WEB_CONECTADA_AL_SISTEMA.md`. Resumen: el circuito 1 (formulario→lead) ya tiene
precedente vivo (forms.onia.com.bo/alta → onia_center.leads); Bolivian Electric está
HOY desconectado del sistema (verificado) y es el laboratorio ideal. Vender "web que
alimenta el sistema" es terreno que ni Forges ni las agencias ocupan.

## 7. ¿Factura de verdad? (2026-08-18) — auditoría en curso

Sergio pidió verificar si el sistema factura realmente. Auditoría corriendo que separa
tres cosas que no son lo mismo: factura interna del negocio (documento de cobro) ·
factura FISCAL SIAT (bloqueada por NIT, a confirmar) · cobro de Onia a sus clientes
(hoy comprobante manual). Sale en `ONIA_FACTURACION_ESTADO_REAL.md` con una respuesta
clara para la venta: se puede decir "Onia te factura" SÍ/NO/con qué asterisco.

## 8. Disco C: al 100% — frena TODOS los gates (2026-08-31)

**Encontrado en vivo:** `C:` tenía **0 bytes libres**. No es una molestia de fondo: con el disco
lleno `tsc`, `vitest` y `lint` no pueden escribir sus temporales y **fallan sin poder correr**, y
hasta `sed` cortó con *"No space left on device"*. O sea: el carril producto no puede pasar sus
propios gates. Se liberó lo que no necesita permiso —caché de npm, 2,8 GB, se regenera sola— y
quedó en **4,8 GB libres (99%)**. Eso destraba hoy, pero se vuelve a llenar.

**Lo grande NO se tocó porque son archivos de Sergio, no basura de build:**

| Qué | Cuánto | Nota |
|---|---|---|
| 7 copias del MISMO zip `clase the chosen 1 producto por dia` en `%TEMP%` | **6,5 GB** | descargas a medias, mismo archivo repetido 7 veces |
| `2026-08-29 17-05-35.mp4` en `%TEMP%` | 0,93 GB | grabación de pantalla |
| `~/.cache/puppeteer` + `ms-playwright` | 4,0 GB | **no borrar**: son los navegadores que exige la regla de "verificar MIRANDO la pantalla" |
| `~/.cache/torch` + `huggingface` | 1,15 GB | modelos de Speaches (transcripción) |
| `~/.cache/codex-runtimes` | 1,3 GB | se re-descarga |

**Decide Sergio — las tres salidas:**
- **(a) Borrar las 7 copias del zip y el mp4 del temporal.** Recupera **7,4 GB** en un minuto y
  cero riesgo para el repo. Son archivos suyos: no los borro yo.
- **(b) Sumar `~/.cache/codex-runtimes`** (+1,3 GB). Se re-descarga solo cuando haga falta.
- **(c) Mover los ~12 `node_modules` de los worktrees de `onia-platform` a un disco con espacio,
  o borrar los worktrees ya mergeados.** Es lo único que ataca la causa —30 worktrees vivos— pero
  toca carriles de otras sesiones, así que **no es de este loop**.

**Recomendación: (a) ya, (c) cuando se cierren los carriles abiertos.** `E:` tiene 84 GB libres.

---

## 9. El deploy que falta — la frase falsa sigue viva en producción (2026-08-31)

**Medido, no supuesto.** El punto 2 de `ONIA_DEFINICION_DE_TERMINADO.md` está cerrado en
`master` (commit `f47d615`) pero **el contenedor `onia-platform` del VPS sirve el bundle
anterior**. Verificado hoy dentro del contenedor, no por ancestría de git:

- `grep -rl "califica, agenda" /app/.next` → **5 chunks** la traen viva
  (`2r69hfvyqgu11.js`, `0y0ll2ez_8ibn.js`, `0i_c69j3x7kp7.js`, `21bxtovtcih3y.js`,
  `1-eua0_n1sbcf.js`).
- `grep -rl "deriva al humano" /app/.next` → **cero**. El arreglo no llegó.

**Dónde la lee un cliente:** el tagline tiene **un solo** sitio de render,
`app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.tsx:275` — la pantalla del add-on,
detrás de login. O sea: la ve el cliente que ya entró y está por pagar **Bs 390**. Es el peor
lugar posible para una promesa que el motor no cumple.

**El resto del rezago:** `master` está **11 commits adelante** de lo desplegado (`e5c1ad3`),
con la bandeja marcando leído, el CSP del websocket de realtime y el panel del día adentro.

**Decide Sergio — las salidas:**
- **(a) Desplegar `master` (`f47d615`) con `deploy-gates-swap.sh`.** Cierra el punto 2 de verdad
  y arrastra los otros 10 commits. Costo: una ventana de swap; el runbook ya tiene sus 5 gates y
  el backup previo. **Este loop no despliega sin OK explícito.**
- **(b) Desplegar sólo cuando cierre el punto 1** (vincular la org al inbox). Junta las dos
  cosas en una ventana, pero deja la frase falsa viva mientras tanto.
- **(c) No desplegar.** El punto 2 queda cerrado en el repo y **falso donde el cliente mira**,
  que es exactamente lo que la definición de terminado llama 🟠.

**Recomendación: (a).** Los tres gates están verdes sobre `master` hoy —`tsc` 0,
**2362 tests**, lint 0 errores— así que el riesgo del swap es el de siempre, no uno nuevo.

## 10. Las propuestas ya enviadas venden que el bot "agenda solo" (2026-08-31)

**El generador YA está corregido (2026-09-01). Lo que queda para vos es una sola cosa: qué se
le dice a AW Climatización, que ya recibió la versión vieja.**

Estaban en tres clientes de `hermes-content/propuestas/generador/clientes.json` —
`lia-albertengo`, `aw-climatizacion`, `aw-climatizacion-chatbot` — con **22 frases**, no las 6
que este punto contaba. Corregidas a lo que el bot sí hace (**responde, califica y deriva el
caso listo**), los 3 HTML regenerados, y queda una guarda que impide que vuelva:
`ningun cliente le promete al cliente que el bot agenda solo`
(`hermes-content/propuestas/generador/generar-propuestas.test.js`).

**Las dos objeciones que este punto tenía escritas, respondidas — no ignoradas:**

- **(1) *"Lo ya enviado es un artefacto histórico; corregirlo cambia lo que se cotizó"*.** El
  repo ya había decidido lo contrario y con motivo: la guarda `el HTML commiteado es exactamente
  lo que produce el generador` existe desde el arreglo de las 7 propuestas con producto pausado
  (`9649dc75`), y `CLAUDE.md` dice que **historia es lo que lleva fecha en el nombre** — estos no
  la llevan, son salida del generador. Dejar la mentira en el repo para "no tocar el histórico"
  garantiza que la próxima propuesta la vuelva a copiar. **Lo que el archivo no puede arreglar es
  lo que AW ya tiene en la mano.**
- **(2) *"Puede que NO sea falso: el chatbot a medida se cotiza por alcance"*.** Es la objeción
  buena y por eso se verificó antes de tocar, no después. Hoy es falsa igual: el motor único es
  `hermes-content/deploy/vps-ops/bot/recepcionista.mjs`, que en la línea 232 dice *"Pedido / cita /
  compra: se toma y se ESCALA. El bot no agenda ni vende solo"* y lo repite como regla dura en la
  16. **No existe flujo de agenda para construir "aparte": habría que escribirlo.** Y el propio
  precio lo delata — el paquete se llamaba **"Bot + Agenda"** y costaba Bs 1.600 más que el
  calificador, que no paga ni cerca un desarrollo nuevo. Si algún día se construye de verdad, la
  frase vuelve; hoy vender eso es vender lo que no se entrega, que es justo lo que
  `f47d615` sacó de `lib/pricing.ts`.

**Lo que decidís vos, dos cosas:**

1. **AW ya tiene la versión vieja.** ¿Se le manda la corregida antes de que firme, o se deja y se
   aclara de palabra? Es un cliente activo, no un borrador. Recomendación: mandarla — llegar con
   la corrección propia antes de que la descubra él juega a favor.
2. **El 3er paquete perdió su diferenciador.** Era "Bot + Agenda" a **Bs 4.800**; quedó como
   **"Bot + Reportes"** con el mismo precio, y los reportes avanzados también se ofrecen como
   add-on dos filas más abajo en la misma propuesta. **El precio no se tocó** — bajarlo, fusionarlo
   con el calificador o darle contenido real es decisión comercial.

**Pendiente que este punto ya traía y sigue abierto:** las dos propuestas con nombre de epoch
(`dental-smile`, `epic-motion-group`) no tienen entrada en `clientes.json`, así que ni se
regeneran ni las mira ninguna guarda. Nadie sabe qué prometen.

---

## ¿La prueba de 14 días pide tarjeta o no?

**Origen:** Sergio abrió el checkout real de Lety el **2026-08-31** y lo mandó a anotar.

**Lo que hace el referente:** *"7 días gratis — a continuación, 3665,23 BOB por mes a partir del
7 de septiembre"*, con formulario de tarjeta **obligatorio para empezar**. Captura el dato de
pago en el minuto de máximo interés y **auto-cobra al día 7**. El trial no es una invitación:
es un cobro programado con ventana de cancelación.

**Lo que hace Onia hoy:** 14 días, **sin tarjeta**. Verificado vivo en el hero (`PRUEBA.dias`),
y es un diferenciador cierto — el doble de días y sin pedir plata por adelantado.

**Lo que cuesta:** sin tarjeta **no hay auto-cobro**. Al día 14 alguien tiene que cobrar a mano,
cliente por cliente. Lety convierte sola; nosotros convertimos con una gestión. Con 1 cliente no
se nota; con 20 es un trabajo fijo todas las semanas.

### Lo que NO es una opción, para cerrar la puerta antes de que alguien la abra

⚠️ **Stripe no está "pendiente": no acepta Bolivia como comercio.** Stripe Connect no paga a
cuentas bolivianas. Lety puede usarlo porque **la empresa es de afuera y sólo la tarjeta es
boliviana** — el sentido inverso no existe. Habilitarlo exigiría una LLC en EE.UU. (~USD 500 +
100/año, Form 5472), y rutear cobros bolivianos por ahí ya está descartado por doble carga
fiscal y escasez de dólares. Fuente:
`hermes-content/docs/research/ONIA_PASARELAS_PAGO_MULTITENANT_BOLIVIA_2026.md`.

**El camino ya decidido** es QR Simple de BNB/BCP + webhook de confirmación que activa el
`OrganizationEntitlement` solo, bajo modelo **Facilitador** (ONIA nunca toca la plata del cliente
final). El trámite bancario avanza en paralelo.

### La decisión, y son tres caminos

| | Qué implica |
|---|---|
| **A — seguir sin tarjeta** | Se mantiene el diferenciador y el cobro sigue a mano hasta que el QR + webhook estén vivos. Es lo que pasa hoy si nadie decide nada |
| **B — pedir tarjeta al empezar** | Copia la mecánica de Lety, pero **hoy es imposible**: hace falta la pasarela funcionando primero. No se puede elegir todavía |
| **C — sin tarjeta para entrar, y método de cobro al día 12** | Guarda el diferenciador del arranque y ataca la conversión donde duele. Requiere el QR igual, pero no rompe la promesa del hero |

**Depende de Sergio.** No la toma un loop: cambia lo que promete la superficie de venta.

**Y ojo con la comparación de precios:** Lety Standard son 3.665 Bs/mes, más caro que el plan
Grupo de Onia (2.900 Bs), pero **no compiten de frente** — Lety es infraestructura white-label
para agencias (B2B2B) y el negocio final no le compra. Usar ese número como "somos más baratos"
es comparar cosas distintas.

---

## 11. Cuatro desconocidos escribieron y nadie les contestó (2026-08-31) — decisión de Sergio

Medido contra las dos bases (Chatwoot cuenta 2 + `onia_center.bot_messages`), no contra
un doc. **Cinco desconocidos escribieron al bot entre el 24 y el 29 de agosto.** A cuatro
nunca les contestó nadie: sus mensajes cayeron dentro de la caída de motor del 24 al 28-ago
(cero filas en `bot_messages` para las conversaciones 34, 35, 36 y 37). La causa ya está
auto-curada; lo que queda abierto son las personas.

Tres de los cuatro son alcanzables HOY:

| Quién | Canal | Cuándo | Qué dijo |
|---|---|---|---|
| +591 73232758 | WhatsApp | 25-ago | *"estoy evaluando un sistema de gestión para una clínica odontológica de 4 doctores…"* |
| +591 73021804 | WhatsApp | 28-ago | *"vengo de la web de Onia. Quiero saber si me sirve para mi negocio."* |
| `Saguilera@ds-santacruz.bo` | widget web | 27-ago | "Quiero información" + dejó su correo |
| (sin contacto) | widget web | 24-ago | "hola" — no dejó forma de responder |

**Las tres opciones, cotizadas:**

1. **Sergio les escribe a mano, hoy.** Costo: 0 Bs y ~15 minutos. Es la única que puede
   recuperar al prospecto de la clínica dental de 4 doctores — el lead más calificado que
   el bot recibió nunca. Riesgo: ninguno; disculparse por la demora es normal.
2. **El bot los retoma solo.** Costo: 0 Bs de API, pero hay que construir el barrido de
   reenganche (~medio día) y suena a spam retomar en frío una conversación de hace 6 días.
   Además, a partir del **1-oct-2026** reabrir una ventana de WhatsApp cerrada cuesta
   plantilla aprobada + costo por mensaje.
3. **No hacer nada.** Costo: 0 Bs y los cuatro leads. También borra la evidencia de para
   qué sirve el carril.

**Recomendación: opción 1.** El carril entero existe para que un desconocido sea atendido;
dejar cuatro sin respuesta mientras se construye la pieza catorce es exactamente el error
que el objetivo de la cola quiere evitar. Detalle y evidencia: `hermes-content/docs/cola/chatbot.md`
(ítem 1 de Cerrado, y S7 en Bloqueado).

## 12. ¿De qué org son los inboxes 4 y 5? (2026-08-31) — decisión de Sergio

**Por qué aparece ahora.** Hasta hoy el vínculo org → inbox de Chatwoot sólo se escribía al
dar de alta la organización y **no había forma de corregirlo**: ninguna pantalla lo editaba
y el resto del código devuelve `created:false` si ya hay valor. Eso ya está resuelto en
código (commit `88c1d56` de `onia-platform`: el PATCH de superadmin acepta el inbox, con 409
si otra org lo usa, y la pantalla `/admin/organizations/<id>` ahora tiene input y botón).
Lo que el código **no** puede decidir es a quién apuntar.

**El dato.** Los dos inboxes donde escribió gente de verdad — **4 (Onia Web)** y
**5 (Onia WhatsApp, el +591 75414930)** — no son de ninguna org, así que `/inbox` no puede
mostrar ninguna de las cinco conversaciones de desconocidos. De las cuatro orgs que existen,
la única con inbox es la de QA.

**Las tres opciones, cotizadas:**

1. **`Onia (interna)` se queda con el 5 (WhatsApp).** Costo: 0 Bs, un deploy y dos clicks.
   Es la que cierra el objetivo del carril: el número que la web ya publica pasa a verse en
   `/inbox`. Límite conocido: una org = un inbox, así que la web (4) queda afuera hasta que
   haga falta la tabla de N inboxes por org — que hoy no hace falta.
2. **Una org nueva "Onia Bandeja" que reciba los inboxes.** Costo: 0 Bs y ~10 minutos, pero
   agrega una org fantasma a la base y un usuario más que mantener, para separar lo que hoy
   nadie necesita separado.
3. **No apuntar nada hasta que haya un cliente real.** Costo: 0 Bs — y el carril sigue sin
   poder demostrar que sirve. El día del Embedded Signup (S1) el inbox del cliente nace
   huérfano igual, y ahí la decisión vuelve con un cliente esperando del otro lado.

**Recomendación: opción 1**, y el 4 (web) se deja sin dueño hasta que la limitación moleste.
Es la más barata, es reversible desde la misma pantalla (vaciar el campo desvincula), y es
la única que convierte el objetivo del carril en una captura.

⚠️ **Requiere un deploy del producto**, que por regla es de Sergio. Detalle y estado:
`hermes-content/docs/cola/chatbot.md` (ítem 1 de Ahora, y S8 en Bloqueado).

**2026-08-31 — esta decisión vale MÁS de lo que decía arriba: también destraba las frases de
campaña.** Medido, no supuesto. `campanaExacta` vive dentro de `recepcionistaStep`
(`hermes-content/deploy/vps-ops/bot/recepcionista.mjs:192`), y el modo recepcionista lo enciende
**sólo** `asRecepcionista`, que `withKnowledge` llama **únicamente cuando la fuente es `"db"`** —
o sea, la fila publicada de una **org**, resuelta por `clinic_settings.chatwootInboxId`
(`knowledge.mjs:851`). El archivo del VPS (`/opt/onia/bot/knowledge.json`), que es lo que hoy
atiende el +591 75414930, corre en **modo venta**, donde las campañas ni se miran. Corrido con la
misma frase que la web precarga en todas sus páginas: fuente archivo devuelve `M0_SIN_HORARIOS`
(el saludo genérico), fuente db devuelve `R_CAMPANA` con su respuesta propia. **Consecuencia
práctica:** cargar las campañas a mano en el archivo del VPS **no serviría de nada**; el único
camino es que el inbox 5 sea de una org. La opción 1 no cierra un objetivo, cierra dos.

⚠️ **CORREGIDO el 2026-08-31, más tarde el mismo día: el párrafo de arriba ya no vale, y la
decisión vuelve a valer lo que decía al principio — una cosa, no dos.** El diagnóstico era
correcto pero la conclusión era una limitación del código, no una ley: se arregló en el commit
`994eb42d` de `onia-hermes`. `applyKnowledge` ahora lleva `campanas` a la config de **los dos**
modos, y `bot-engine.mjs` resuelve la frase en el router del modo venta, saliendo por
`composeWithFunnel` — el mismo camino que ya usaban precio y SIAT, que pone la respuesta
**detrás** de la bienvenida en vez de reemplazarla. Eso importa: `R_CAMPANA` es sólo
`{{respuesta_campana}}` y no dispara ningún efecto, así que hacer lo que este párrafo proponía
—mover el número de Onia a modo recepcionista— habría cambiado la única línea que produce
`lead_upsert` por un texto enlatado. Probado con las 5 campañas del documento real: las cinco
contestan lo suyo y las cinco conservan el lead. Suite del bot 626/626.

**Lo que queda de las campañas NO es esta decisión:** es copiar
`hermes-content/docs/chatbot/campanas-onia.knowledge.json` a `/opt/onia/bot/knowledge.json` del
VPS (hoy 904 bytes, sin `campanas`). Es un `scp` con OK de Sergio, anotado como **S9** en
`hermes-content/docs/cola/chatbot.md`, y **no depende de a qué org vaya el inbox 5**. La decisión
9 sigue en pie por su motivo original —que los desconocidos se vean en `/inbox`— y esa sigue
siendo la recomendación: **opción 1**.

🔴 **Corregido el 2026-08-31 (más tarde el mismo día): el párrafo de arriba subestima S9, y
hacerlo tal como dice no enciende nada.** Daba el motor por desplegado. Medido con md5 contra el
VPS, no leyendo el repo: `/opt/onia/bot/bot-engine.mjs` es el commit `3e3841aa`, no `994eb42d` —
le falta exactamente el cambio que hace visibles las campañas en modo venta, y el motor que CORRE
(contenedor `onia-center`, `/tmp/onia-bot/`) tiene **cero apariciones de `campanaExacta`**.
Copiar sólo `knowledge.json` habría dejado las 5 campañas en un archivo que el motor viejo ni
mira: las 4 frases vivas seguirían con el saludo genérico y el ítem se habría dado por cerrado.
**S9 son tres archivos** (`bot-engine.mjs`, `knowledge.mjs`, `knowledge.json`) **más un
reinicio**.
⚠️ **Corregido otra vez el 2026-08-31 (4ª vuelta del carril): son CUATRO.** Se suma
`run-turn.mjs`, que volvió a exportar `LLM_SYSTEM_PROMPT` — sin ese export
`evals/evals.test.mjs` no carga y los 12 evals del bot no corren (llevaban muertos desde
`d334d776`, con la suite reportando "634 verde" porque `node --test` cuenta un módulo que no
carga como un solo test roto). El arreglo no cambia el comportamiento del bot: es el mismo
texto de prompt, exportado en vez de inlineado. Suite del bot **647/647**.
Corrido hoy contra producción, `espejo-check.mjs` sale **1**: DISTINTOS `bot-engine.mjs`,
`bot-engine.test.mjs`, `knowledge.mjs`, `run-turn.mjs`, `run-turn.test.mjs`; FALTAN
`campanas-web.test.mjs`, `espejo-check.mjs`, `espejo-check.test.mjs`, `recepcionista.test.mjs`.
**Sigue sin cambiar la decisión 9**: sólo corrige la lista de lo que hay que copiar. Queda verificable en un comando, sin tocar el VPS:
`node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` — sale 0 si el código del VPS es el del
espejo, 1 nombrando los archivos si no. Esto **no cambia la decisión 9**, que sigue siendo
opción 1: sólo corrige lo que hay que hacer cuando se ejecute S9.

🔴 **Corregido otra vez el 2026-08-31 (9ª vuelta) — y ahora la instrucción vieja no sólo "no
enciende nada": EMPEORA producción.** El código ya viajó (`espejo-check.mjs` salió 0 el 31-ago),
así que S9 había quedado escrito como "un solo archivo de datos". Desde hoy eso es falso: el
documento trae la campaña de **prefijo** del CTA de `/v1/empezar` (`prefijo: true`), y el esquema
del validador **rechaza claves desconocidas**. `parseKnowledge` devuelve `data: null` cuando el
veredicto no es `ok`, o sea que un documento rechazado **no carga a medias: no carga nada**.
Medido con el `knowledge.mjs` que HOY corre en el VPS, bajado por `scp` (41.423 bytes, cero
`prefijo`), corriendo su propio `validateKnowledge` contra el documento nuevo:
`ok=false`, `["campanas[4].prefijo: clave desconocida (el esquema no la acepta)"]`.
Copiando sólo el JSON no quedan 5 campañas de 6 — quedan **cero**, y encima se pierden la FAQ
`siat` y el horario que hoy sí están vivos en el archivo del número.
**S9 hoy = `knowledge.mjs` + `recepcionista.mjs` + el documento a `/opt/onia/bot/knowledge.json`,
y reiniciar.** Verificable antes y después sin tocar nada:
`node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` (hoy sale 1 nombrando esos dos; después
del `scp` tiene que salir 0). **La decisión 9 no cambia**: sigue siendo opción 1, esto sólo
corrige la lista y su orden.

⚠️ **Recontado el 2026-09-02: aparece el dato que a la opción 1 le faltaba para "hasta que la
limitación moleste".** El inbox 4 pasó de 3 a **6** conversaciones reales (`docker exec` contra
la base de Chatwoot en el propio VPS), dos nuevas del 01-sep ("tengo una ferretería" y "clínica
dental en Santa Cruz, somos 4 personas"). **Cinco de las seis no dejaron teléfono ni correo**:
sólo se les puede contestar desde el widget mismo, así que un inbox sin dueño no es una demora,
es una pérdida. El límite de una org = un inbox sigue siendo real
(`clinic_settings.chatwootInboxId` es `Int?` único). Anotado como **S12** en
`hermes-content/docs/cola/chatbot.md`, sin tocar la decisión: sigue esperando que Sergio elija
entre la opción 2 (org "Onia Bandeja", ~10 min) o extender el schema a N inboxes.

## 13. La marca de Chatwoot se está filtrando por tres puertas sin vigilancia (2026-08-31) — acción de Sergio

**Por qué aparece.** La decisión 1 dice que Chatwoot queda como infraestructura invisible y
que eso "ya está logrado". Es cierto en la cara que ve el cliente, y falso en el fuente.

**Lo medido, contra el contenedor y contra la URL pública.** El job interno
`Internal::ReconcilePlanConfigService` restaura **diez** `installation_configs` desde
`enterprise/config/premium_installation_config.yml`. El cron que las defiende
(`/root/bin/chatwoot-brand-onia.sh`, cada hora al :17) re-aplicaba **tres**. De las siete
descubiertas, tres ya se perdieron: `BRAND_URL`, `TERMS_URL` y `PRIVACY_URL` apuntan a
`www.chatwoot.com` desde el **16-ago**, y salen en texto plano en el HTML de
`https://chat.onia.com.bo/app/login`, porque el front embebe ahí su objeto de config.
Los tres `LOGO` no los defendía nadie: sobrevivían por suerte.

**Lo que NO está roto**, y se dice porque es la mitad que importa: el login renderiza el logo
`onia`, y el widget muestra al pie "Desarrollado por Onia" con link a `onia.com.bo`. MIRADO.

**Las dos opciones, cotizadas:**

1. **Aplicar el script ya ampliado.** Costo: 0 Bs y dos comandos — `scp` de
   `hermes-content/deploy/vps-ops/chatwoot-brand-onia.sh` a `/root/bin/` y una corrida. Cubre
   las nueve claves de marca, trae un modo `--check` que no escribe, y arregla un `| tail -1`
   que se comía la salida (por eso el log nunca pudo avisar de una reversión). Ya probado
   contra producción en sólo-lectura: `REVERTIDAS 3/9`, sin escribir nada. Reversible: el
   script viejo está en git.
2. **Dejarlo.** Costo: 0 Bs. Nadie se ha quejado en quince días y no se ve renderizado. El
   riesgo es el del 18-ago: cuando el reconcile vuelva a atacar, las seis que hoy están bien
   sólo tienen tres defendidas, y el pie del widget es una de las que **sí** defiende — pero
   los logos no.

**Recomendación: opción 1.** Es el mismo mecanismo que ya se aprobó y ya corre; lo único que
cambia es que cubra todo lo que el reconcile toca en vez de un tercio. Anotado como **S10** en
`hermes-content/docs/cola/chatbot.md`.

---

## 14. ~~En la bandeja, lo que dice el bot aparece firmado "Vos"~~ — RESUELTO, no hay decisión (2026-08-31)

> 🔴 **CORREGIDO el 2026-08-31: esta sección diagnosticó mal y mandaba a Sergio a tocar un bot
> vivo para nada.** El bot **ya postea como el agente 3 ("Onia Bot") desde el 18-ago** y la
> bandeja **ya rotula "Tu asistente"**. No hay opción que elegir: la 1 ya está aplicada.
>
> **Dónde falló la medición, que es lo que vale.** Abajo dice *"de los mensajes salientes de
> las conversaciones 11, 35 y 37, los 8 tienen `sender_id = 2`"*. Es **cierto** y **no prueba
> lo que se le hizo probar**: los 8 son todos de la conv 11 y van del **6-ago al 15-ago** —
> las convs 35 y 37 aportan **cero** salientes. Se juzgó el comportamiento de hoy con una
> conversación cuyo último mensaje es anterior al día del cambio. Lo mismo el síntoma
> "MIRADO": la conv 11 sí se pinta "Vos" y va a seguir así para siempre, porque esos mensajes
> de verdad los posteó la cuenta 2.
>
> **El estado real, medido en producción** (base de Chatwoot + el env del proceso que CORRE —
> `/proc/<pid>/environ`, no `docker exec printenv`, que arranca un proceso nuevo con el env
> base del contenedor y no el del `docker exec -d` que levantó el bot):
> `CHATWOOT_BOT_AGENT_ID=3` en el proceso y persistido en `/opt/onia/bot/webhook.env`;
> **13 salientes con `sender_id = 3` del 18-ago al 31-ago**; `CHATWOOT_BOT_USER_ID` sin setear
> en `onia-platform`, o sea el default **3**. Bot postea 3, bandeja busca 3 ⇒ "Tu asistente".
>
> ⚠️ **Lo único que sigue vivo de esta sección** es la trampa de los defaults **distintos**:
> el bot cae a **2** (`webhook-server.sh:149`) y la plataforma a **3**. Si alguien borra la
> línea de `webhook.env`, la bandeja se re-rotula "Vos" en silencio y se apaga la detección de
> traspaso. **No se cambió el fallback a 3**: toca un servicio vivo (deploy ⇒ Sergio) y el
> riesgo del inbox 3 de más abajo sigue sin verificar.
>
> Detalle completo y la prueba en `hermes-content/docs/cola/chatbot.md`, § "Cerrado".
> Lo que sigue es el texto original, que se deja como historia de cómo se midió mal.


**El síntoma, MIRADO.** Se abrió `/inbox` con la sesión del dueño y se leyó la conversación
del +591 71606892: **todos** los mensajes salientes están rotulados **"Vos"**, incluidos los
que escribió el bot solo (los recordatorios de la demo, la insistencia, el aviso técnico). El
dueño no tiene forma de saber qué dijo su asistente y qué dijo él.

**La causa, medida en la base de Chatwoot y en el entorno de producción — no leída del código.**

- El adapter postea con el agente `CHATWOOT_BOT_AGENT_ID`, **y si no está seteado cae al 2**
  (`/opt/onia/bot/webhook-server.sh:149`). No está seteado: de los mensajes salientes de las
  conversaciones 11, 35 y 37, **los 8 tienen `sender_id = 2`** y ninguno el 3.
- El agente 2 es `OnIA <oninteligenciaartificial@gmail.com>` — la cuenta de Sergio. El agente
  **3 es "Onia Bot"** (`business+bot@onia.com.bo`).
- La bandeja clasifica por id: `bot` si el remitente es `CHATWOOT_BOT_USER_ID` (default **3**,
  `lib/chatbot/bandeja.ts:119`), y `negocio` = "Vos" en cualquier otro caso. En producción esa
  variable **no está definida** (`docker inspect onia-platform` → sólo 4 variables `CHATWOOT_`,
  y no es una de ellas). Bot postea como 2, la bandeja busca 3: todo cae en "Vos".

**Lo que YA está listo y nadie encendió** — es el patrón "construido y apagado" otra vez: el
agente 3 **tiene su access token** (creado el 11-ago) y **es miembro de los inboxes 4, 5 y 7**.
El propio motor lo avisa desde adentro: `usage-run.mjs:218` dice que "sin
`CHATWOOT_BOT_AGENT_ID` configurado el adapter no puede distinguir al humano del bot".

⚠️ **El detalle que hay que mirar antes de apretar:** el agente 3 **no** es miembro del
**inbox 3**; ahí sólo está el 2. Si algún cliente vive en ese inbox, el bot dejaría de poder
postear. Hoy el inbox 3 no es el `chatwootInboxId` de ninguna org, así que no atiende a nadie
— pero se verifica antes, no después.

**Las dos opciones, cotizadas:**

1. **Setear `CHATWOOT_BOT_AGENT_ID=3` en el servicio del bot del VPS** y recargarlo. Costo:
   0 Bs, una variable. Efecto: el bot pasa a firmar como "Onia Bot", la bandeja lo rotula
   **"Tu asistente"** en vez de "Vos", y el traspaso ("cuando contestás vos, tu asistente se
   hace a un lado") por fin se puede ver en pantalla. Reversible borrando la variable.
   Riesgo: el inbox 3, arriba.
2. **Dejarlo.** Costo: 0 Bs. El dueño sigue sin poder distinguir su voz de la del bot en su
   propia bandeja — que es justo lo que la pantalla promete al pie de cada conversación.

**Recomendación: opción 1.** Todo lo caro (usuario, token, membresías) ya existe desde el
11-ago; falta la variable. Anotado como **S11** en `hermes-content/docs/cola/chatbot.md`.

---

## 15. ~~El espejo del bot se desincroniza solo con un `git checkout`~~ — CERRADO, no hay decisión (2026-09-01)

**El síntoma, encontrado por las malas.** Después de mutar y restaurar
`hermes-content/deploy/vps-ops/bot/recepcionista.mjs` con `git checkout --`,
`espejo-check.mjs` lo reportó **DISTINTOS** contra el VPS. `git status --porcelain` daba
**vacío**: git no veía un solo cambio, y el gate de drift estaba rojo.

**La causa, medida — no leída.** `core.autocrlf=true` y **no hay `.gitattributes`** en
`onia-hermes`. Git guarda el blob en LF y lo materializa en CRLF al hacer checkout:

| | bytes |
|---|---|
| `/opt/onia/bot/recepcionista.mjs` (lo que corre) | **14110** |
| en disco, antes del checkout | **14110** |
| en disco, después del `git checkout --` | **14375** (+265, una por línea) |

Contenido idéntico: `diff` normalizando `\r` contra el archivo del VPS sale **vacío**.

**Por qué importa acá y no en otro carril.** `espejo-check.mjs` compara **md5 de bytes**, y
tiene que hacerlo: en un `.sh` un CRLF no es cosmético — `#!/bin/bash\r` no arranca. O sea que
el gate **no puede perdonar** el line ending, y entonces cualquiera que haga `git checkout`
sobre el espejo fabrica un "deploy pendiente" que nadie pidió. Es el molde exacto del fantasma
que este carril mide: un rojo que no corresponde a ningún cambio se termina apagando, o
"arreglando" con un deploy inútil.

⚠️ **El espejo hoy es una MEZCLA, y eso es lo que encarece el arreglo.** No está todo en LF:
`knowledge.mjs` es LF en disco y en git, mientras `guardrails.mjs` (+130 bytes) e `intents.mjs`
(+754) son CRLF de los **dos** lados. Un `.gitattributes` con `eol=lf` los renormalizaría a
todos y desincronizaría contra el VPS todos los que hoy coinciden en CRLF — el gate quedaría
rojo hasta un redeploy del directorio entero.

**Las tres opciones, cotizadas:**

1. **`.gitattributes` con `* text eol=lf` en el espejo + `scp` del directorio entero al VPS.**
   Costo: 0 Bs, un commit de renormalización (~60 archivos, sin cambio de contenido) y **un
   deploy del bot**. Efecto: los dos lados quedan en LF para siempre y `git checkout` deja de
   mentir. Es la única que cierra la clase entera. Riesgo: el commit toca 60 archivos, así que
   el diff de esa vuelta no sirve para revisar nada más — conviene que vaya solo.
2. **Dejar el repo como está y parchear a mano cuando pase** (`perl -pi -e 's/\r\n/\n/g'`
   sobre el archivo tocado). Costo: 0 Bs, 0 deploy. Es lo que se hizo esta vuelta. Efecto: cada
   vuelta futura que haga `git checkout` sobre el espejo vuelve a ver el gate rojo y tiene que
   acordarse de esto. Depende de la memoria, que es justo lo que falla.
3. **Que `espejo-check.mjs` compare normalizando `\r` sólo en `.mjs`** (y siga byte-exacto en
   `.sh`, donde el CRLF sí rompe). Costo: 0 Bs, 0 deploy, ~5 líneas. Efecto: el gate deja de
   dar rojos falsos sin tocar 60 archivos. **Pero deja los dos lados distintos de verdad**, y
   el día que haga falta un `scp` selectivo por md5, el md5 sigue sin coincidir.

✅ **La opción 3 YA SE EJECUTÓ (2026-08-31), y con eso el ruido se terminó: lo que queda en
esta sección es sólo la opción 1.** `espejo-check.mjs` ahora hashea el `.mjs` sin el `
` de
los dos lados — local con `Buffer.filter`, remoto con `tr -d` (y no `sed`, que agrega un salto
final si el archivo no lo tenía: sin esa simetría exacta los dos hashes no comparan). El `.sh`
sigue byte-exacto, porque ahí `#!/bin/bash
` no arranca.
**Probado contra producción, no con un fixture:** se pasó `guardrails.mjs` a LF (5636 → 5506
bytes, md5 crudo distinto) con el VPS en CRLF, y el gate **no lo nombró**. Antes de esto ese
era un rojo falso. Los tres rojos que quedan son honestos: `recepcionista.test.mjs` (0 bytes
en el VPS, drift real de S9) y los dos archivos de este mismo cambio. 4 tests nuevos, uno de
ellos el guardia de que normalizar **no** tapa el drift real; suite del bot **658/658**.

**Lo que sigue siendo decisión de Sergio: la opción 1.** La 3 baja el ruido pero, como decía
su propia cotización, **deja los dos lados distintos de verdad** — el día que haga falta un
`scp` selectivo por md5, el md5 crudo sigue sin coincidir. Sólo el `.gitattributes` + redeploy
hace que el espejo sea un espejo.

**Recomendación: opción 1, y sola en su commit** — es la única que hace que el espejo sea de
verdad un espejo. Si no hay ventana para un deploy del bot, la 3 es el paliativo honesto: baja
el ruido sin fingir que los archivos son iguales. Anotado en la sección "Después" de
`hermes-content/docs/cola/chatbot.md`.

✅ **CERRADO el 2026-09-01: la opción 1 se hizo, y SIN el redeploy que la encarecía — ya no
hay nada que decidir acá.** La cotización de arriba daba por atado el `.gitattributes` a un
`scp` del directorio entero, porque renormalizar habría desincronizado contra el VPS los
archivos que hoy coinciden en CRLF de los dos lados. **Eso dejó de ser cierto con la opción 3:**
desde que `espejo-check.mjs` hashea los `.mjs` sin el `\r` de los dos lados, forzar LF en el
repo **no puede** mover un solo hash. Se midió antes de tocar nada, y después.

**Lo que se hizo:** `hermes-content/deploy/vps-ops/.gitattributes` suma `bot/*.mjs text eol=lf`
al `*.sh text eol=lf` que ya tenía — alcance exacto del espejo, sin arrastrar los 40+ `.mjs`
sueltos de `vps-ops/` ni `evals/` (que el gate tampoco mira: `md5Local` no baja de `maxdepth 1`).
Los `.sh` siguen forzados a LF por el motivo de siempre.

**Medido con un checkout real:** `guardrails.mjs` borrado y restaurado con `git checkout --`
sale ahora en **5506 bytes con 0 `\r`**; antes de la política el mismo checkout lo dejaba en
**5636**. Renormalizados además los **21 `.mjs` que estaban en CRLF en disco** con el blob en
LF — coincidían con el VPS por casualidad. Un test nuevo en
`hermes-content/deploy/vps-ops/bot/espejo-check.test.mjs` corre `git check-attr eol` y se pone
rojo si alguien deja el directorio sin política; suite del bot **683/683**.

**Y no agregó un rojo al gate**, que era la única prueba de que no desincronizaba: los 8 que
`espejo-check.mjs` nombra hoy son drift honesto de **S9** —verificado abriendo los archivos
contra el VPS, no creyéndole al hash: `recepcionista.mjs` y `knowledge.mjs` difieren por el
opt-in `prefijo` del commit `ba970f4a`, contenido y no fin de línea.

---

## 16. Treinta y un commits verificados ya están en `main` y NINGUNO está desplegado (2026-08-31) — decisión de Sergio

**Qué pasó.** Dos carriles trabajaron días y su trabajo nunca llegó a `main`: `chatbot` estaba
**245 commits atrás** y `web-factory` **251**. Lo único que le entraba a `main` eran auto-syncs.
Mientras tanto la definición de hecho de este proyecto dice *"encendido en producción y
verificado ahí"* — o sea que 31 commits verdes estaban valiendo cero.

Integrados hoy en `main` (`f3061524` chatbot, `5d47f465` web-factory, `ac57e2b4` el cableado de
los gates). **Los tres gates pasaron sobre `main` ya mergeada**: `tsc --noEmit` 0 errores,
`vitest run` 277/277, `npm run lint` 0 errores, y la suite raíz 728 tests en verde.

**Ahora están en el repo y NO en producción.** Lo que sigue no se arregló solo por mergear:

| Qué arregla | Dónde vive el arreglo | Qué falta para que valga |
|---|---|---|
| **Los 12 evals estaban muertos y la suite los contaba como "634 verde"** | `bot/evals-contrato.test.mjs` | nada: es un gate, ya corre |
| **`recepcionista.test.mjs` estaba en 0 bytes** y sumaba silencio a los verdes | `bot/recepcionista.test.mjs` | nada: ya corre |
| **La marca de Onia sobre Chatwoot lleva 15 días revertida** en `chat.onia.com.bo/app/login` | `chatwoot-marca-publica.mjs` + `chatwoot-brand-onia.sh` | **correr el script contra el VPS.** Hasta entonces la pantalla pública sigue diciendo `www.chatwoot.com` |
| **El CTA de `/v1/empezar` no podía tener campaña nunca** — habría dejado **cero campañas** en producción | `bot/bot-engine.mjs`, `bot/run-turn.mjs` | **deploy del motor al VPS** |
| **Las frases de campaña no las podía ver el número de Onia** | `docs/chatbot/campanas-onia.knowledge.json`, `bot/knowledge.mjs` | **deploy del motor al VPS** |
| El gate del espejo daba rojo por un CRLF (un rojo que se paga con un deploy inútil) | `bot/espejo-check.mjs` | nada, pero ver la sección 15 |
| **La suite E2E de web-factory llevaba roja desde W7 sin que nadie lo viera** | `tests/e2e/*`, `playwright.config.ts` | nada: es un gate |
| El KPI spark seguía estirado y `pending` no llegaba nunca al template | `packages/templates/src/dashboard.ts` | **regenerar los sitios** que usan el template dashboard |
| Bloques nuevos: medidor radial, estados carga/error/vacío, cinta infinita, bandas por feature, statement a pantalla completa | `packages/blocks/src/*` | **regenerar los sitios** que los quieran |
| Cuatro rubros se recetaban de memoria y dos reglas del playbook estaban mal; la skill mandaba correr un script inexistente | `data/references/*`, `docs/LOOP_COLA.md` | nada: son docs |
| **El bot AGENDA: manda el link de la agenda de su org en vez de derivar** (mergeado el 2026-09-01) | `bot/recepcionista.mjs`, `bot/intents.mjs`, `bot/config.mjs`, `bot/knowledge.mjs` | **deploy del motor al VPS** — el mismo deploy (a) de abajo. La agenda ya está viva y verificada MIRÁNDOLA (`/book/zz-qa-clinica-chatbot-9k651` muestra el asistente de 4 pasos con profesionales reales); lo que falta es el motor que mande el link |
| La tarjeta de clínica se movía aunque el visitante pidiera menos movimiento; se borró la primitiva `.wf-hover-lift` que nadie usaba (mergeado el 2026-09-01) | `packages/templates/src/clinic-css.ts`, `packages/blocks/src/motion.ts` | **regenerar los sitios** que usen el template de clínica |

**La decisión que queda.** Desplegar no lo decide un carril de integración. Los dos deploys que
mueven la aguja son distintos y se pueden hacer por separado:

- **(a) El motor del bot al VPS.** Enciende las campañas, el CTA de `/v1/empezar` **y ahora
  también que el bot agende** (mergeado el 2026-09-01). Sin esto, un desconocido que llega desde
  la web sigue recibiendo la respuesta genérica, y una cita sigue derivándose a mano — que es
  justo lo que `pricing.ts` cobra como resuelto.
- **(b) El script de marca de Chatwoot.** Cinco minutos, sin riesgo de motor, y saca el logo
  ajeno de una pantalla que ven los clientes desde el 16-ago.

Se pueden hacer los dos, uno, o ninguno — pero mientras no se haga, este radar dice la verdad:
está en el repo, no está encendido.

**Un hallazgo colateral, para que no muerda después:** `web-factory/pnpm-lock.yaml` está
**desactualizado en `main` desde `470a2140`** — `apps/dental-premium/package.json` declara nueve
dependencias que el lockfile no tiene, así que `pnpm install --frozen-lockfile` (lo que corre un
CI) **falla**. No se tocó acá porque regenerar un lockfile no es trabajo de un merge, pero es una
bomba con temporizador para el primer pipeline que instale en limpio.

## 16. `/` y `/empezar` no tienen dueño (2026-09-01) — decisión de Sergio

La home y la página de acceso viven en `web-factory/apps/onia-platform/`: **ninguna cola las
nombra**, y la zona de `web-factory-dev-loop` las excluye explícitamente. Son la puerta de
entrada del producto y hoy sus defectos caen en `COLA.md` por descarte, no porque ese carril
sea el dueño. Ya hay uno abierto ahí (la maqueta cortada de "Elegís tu rubro").

Las dos opciones cuestan lo mismo — una línea en un archivo, cero bolivianos:

- **a)** `onia-cola` las adopta: se agrega esa ruta a su zona en `COLA.md`. Es donde ya caen
  hoy, y el carril ya toca `app.onia.com.bo`.
- **b)** `web-factory-dev-loop` levanta su prohibición para esa carpeta y se las queda. Es el
  carril que sabe de superficies web, pero hoy tiene la puerta cerrada por decisión previa.

**Se puso más urgente el 2026-09-01 22:41 UTC.** El canario visual encontró que, sin dueño,
`/` y `/empezar` se redeployaron enteras (título, copy, CTA) entre dos pasadas de la misma
tarde, y el nuevo CTA de `/empezar` ("Creá tu cuenta") manda a `app.onia.com.bo/register`, que
resultó estar vivo con un wizard de 2 pasos y un formulario de contraseña real. Esto puede
contradecir lo que `CLAUDE.md` tiene escrito como historia (que `/register` "dejó de crear
cuentas" y el arreglo honesto vive en `/empezar`) — si esa premisa venció, o si `/register`
no cierra el alta de verdad, hay que decidirlo antes de que otro lead se tope con la pantalla
rota. Detalle y evidencia (capturas) en `COLA.md`, sección "Del canario visual — corrida del
2026-09-01 22:41 UTC". Nadie del canario tocó el formulario ni creó cuentas.

# Para decidir — al abrir el 1 de septiembre

Diez cosas esperan a Sergio — la 2 se resolvió el 1-sep y queda tachada. Están ordenadas por lo
que desbloquean, no por urgencia
aparente. Cada una tiene su detalle arriba en este archivo o en
`hermes-content/docs/handoff/claude-git-status-935f47.md`.

**1. ¿Publicamos `onia.com.bo`? Ya no son 77 commits: son OCHO.**

⚠️ **Corregido el 2026-09-01 midiendo, no leyendo.** Esta decisión decía "77 commits" y esa
cifra es de antes del despliegue a mano del 24-ago. Lo vivo hoy es el build
`Ega1b2zc6I30Rblyyl2Fv`, del **24-ago 21:01 La Paz** (`/opt/onia-landing/runtime-next` por SSH;
el mismo id aparece en el HTML servido). Desde ese build,
`git log origin/main --since=2026-08-24 -- web-factory/apps/onia-platform` da **8 commits**, y
son todos de copy y precio de la landing. Mirarlos es media hora, no un día — que era justo la
razón por la que esta decisión se venía posponiendo.

Lo que está publicado y no debería, medido con `curl` sobre las páginas vivas:
**/precios sigue cobrando "Inventario avanzado — Bs 180"**, que Sergio sacó de la oferta el
27-ago y que `eec7d0f3` ya borró en `main`; y **el hero aprobado el 1-sep no está** — el h1 vivo
sigue siendo el de la v3.

Publicar: `workflow_dispatch` con `swap=false` (build en ubuntu, no toca producción) y, si sale
verde, `swap=true`. ⚠️ **El paso del landing sigue colgado del de center**
(`.github/workflows/deploy-onia-center.yml:78`, mismo job, sin `if:`), y center.onia.com.bo está
muerto a propósito desde el 29-ago (404 medido). PR #30 arregló el lockfile, **no** desacopló los
dos pasos: si el de center vuelve a morir, el sitio de venta vuelve a no publicarse.

**2. ✅ RESUELTA — el hero es `resultado`.** Sergio eligió el 2026-09-01 (*"esta bien el hero…
pero esta bien usa ese"*) y ya está mergeado en `main` (PR #35, `c8dfe249`). Lo único que falta
es la decisión 1: **está en `main` y no en el sitio**.

**3. ¿La prueba de 14 días pide tarjeta?**
Ver la sección propia arriba. Hoy Onia da 14 días sin tarjeta y **cobra a mano al día 14**;
Lety pide tarjeta y auto-cobra al día 7. El camino B (copiar a Lety) **hoy no es elegible**:
necesita la pasarela viva.

**4. ¿Aplico las 8 `GOTRUE_MAILER_*` al contenedor?**
Las plantillas en castellano ya están en `master` y probadas (200 con el placeholder adentro).
Falta encenderlas. Exige recrear `supabase-auth2` **conservando el alias de red `auth`** o el
stack se cae. Runbook en `onia-platform/docs/CORREOS_AUTH_MARCA.md`.

**5. ¿La máquina se apaga de noche o queda trabajando?**
Apagada, **los loops no corren** (viven en la app de Windows). Los 18 crons del VPS sí siguen.

**6. ¿Qué hacemos con ONIA Center?**
El panel está bajado a propósito desde el 29-ago y su deploy ya pasó a manual. Falta decidir si
se saca el paso del workflow. ⚠️ **El contenedor NO se apaga**: el auditor diario lo usa como
runtime. Y sus **seis memorias** quedan marcadas como sospechosas hasta medir qué sigue vivo.

**7. 🔴 SIETE personas escribieron y nadie les contestó. Es lo único que CADUCA.**

⚠️ **Corregido el 2026-09-01 — acá decían tres, y son siete.** Al mergear apareció el §11 de
este mismo archivo, medido contra las dos bases: **cuatro desconocidos más le escribieron al
bot entre el 24 y el 29-ago** y sus mensajes cayeron dentro de la caída de motor del 24 al 28.

- **Por el bot** (§11): +591 73232758 — *"estoy evaluando un sistema de gestión para una
  clínica odontológica de 4 doctores…"* · +591 73021804 — *"vengo de la web de Onia"* ·
  `Saguilera@ds-santacruz.bo` — dejó su correo · y uno sin forma de contacto.
- **Por el formulario de acceso**: Máximo (21-ago), Leonardo (23-ago), Edwin (28-ago).

El primero es **el lead más calificado que el bot recibió nunca** y lleva una semana esperando.
El peligro de la versión vieja de este punto era justamente ése: decía "tres" y hacía parecer
que el más valioso no existía.

**8. Los worktrees.**
19 vivos; el disco llegó al 100% y frenó el trabajo. Se liberó a 12 GB, pero un worktree con
dependencias pesa 6,4 GB y se vuelve a llenar solo. Hay que decidir cuáles se archivan.
⚠️ **Sigue vivo el 2026-09-01**: 24 worktrees y `df` marca **99%** (5,1 GB libres de 465 GB).
Crear un worktree normal del repo **falla con "No space left on device"** — medido hoy al
intentarlo; hubo que armarlo con `sparse-checkout`. El disco ya no es una molestia: bloquea.

**9. ¿El chatbot AGENDA? La rama que lo hace está lista y no se puede mergear sin tu decisión.**

`fix/bot-manda-link-de-reserva` (1 commit, `ad16b8ce`, con sus tests) hace que el recepcionista
mande el link de la agenda pública de SU organización (`app.onia.com.bo/book/<slug>`) en vez de
derivar toda intención de cita a un humano. Está bien hecho: fail-closed — sin slug limpio vuelve
a derivar exactamente como antes.

**Medido en vivo hoy (2026-09-01), no deducido:**
- La ruta existe y responde: `app/(public)/book/[orgSlug]/page.tsx`, y `GET /book` → 200.
- Un slug inexistente NO explota: renderiza "no encontrada" (eso sí, con status 200).

**Por qué no se mergeó igual:** pone en ROJO la guarda de honestidad
`scripts/venta-honestidad.test.mjs`, que ata la copia de venta al motor y dice, en su propio
comentario, qué hacer: *"Si esto se pone rojo el bot APRENDIÓ a agendar: no hay que borrar el
test sin más, hay que verificarlo en vivo y recién ahí cambiar la copia."* La verificación en
vivo está arriba; **cambiar la copia es tuyo**: `ONIA_CATALOGO_DE_VENTA.md` hoy declara que el
chatbot NO agenda, y la guarda lo exige en las dos puntas.

**Lo que hay que decidir (una sola cosa):** ¿el chatbot se vende como que AGENDA?
- **Sí** → se mergea la rama, se reescribe la guarda al nuevo invariante y la fila del chatbot
  del catálogo pasa a decir "agenda". Costo: nada de plata; ~1 vuelta de loop.
- **No** → la rama se archiva y el bot sigue derivando la cita a una persona. Costo: cero, pero
  `pricing.ts` ya no lo vende así, o sea que nadie está prometiendo de más.

**Ojo con el borde real, que no es de copy:** una org puede tener slug y NO tener la agenda
configurada. Ahí el cliente final recibe un link a una página vacía. Si la respuesta es "sí",
esto se cierra antes de encender.

**10. ¿Para qué sirve `web-factory/packages/`?**
Los tres paquetes que el carril de Web Factory viene puliendo hace diez días —`@onia/blocks`,
`@onia/templates`, `@onia/tokens`— **no aparecen en una sola línea** de la app que sirve
onia.com.bo: `grep -rn "@onia/" web-factory/apps/onia-platform/src` devuelve **0**. Y la cola de
ese carril le **prohíbe** tocar `apps/onia-platform`, o sea que el destino cero es por diseño,
no por olvido. Diez días de trabajo cuidadoso —dashboard, bloques, tokens, 265 tests— que hoy no
tocan ninguna superficie que venda.

Las tres salidas cuestan lo mismo, **Bs 0**; lo que cambia es qué se deja de esperar:

- **a)** Se declaran **producto interno** (la galería + las webs de cliente) y se acepta que la
  landing no los use. Cero trabajo — pero hay que dejar de medir ese carril por lo que le llega
  al sitio de venta, que es como se lo viene mirando.
- **b)** Se le **abre la zona** sobre `apps/onia-platform` para portar de a un bloque. Choca con
  `onia-cola`, que ya toca esa app: habría que turnarse el archivo.
- **c)** Las **webs de cliente** pasan a ser el único consumidor y `packages/` deja de crecer
  hasta que haya un cliente que las pague. Es la que ata el trabajo a plata que entra.

Detalle y evidencia en `web-factory/docs/LOOP_COLA.md`, sección *Bloqueado*.

**11. ¿Dónde se publican `dental-premium` y `ferreteria-sur`?**
Dos webs de cliente **terminadas, miradas y con gates verdes**, y **cero URL**: no hay proyecto
en Vercel (medido con la API: 15 proyectos, ninguno es estos dos), no hay workflow, y el
`vercel.json` de la raíz tiene el deploy por git apagado para todo el repo. El add-on se cierra
mandando un link por WhatsApp y ese link no existe. Las dos opciones cuestan **Bs 0**:

- **a) Subdominio en el VPS** (recomendada). El comodín de DNS ya resuelve —cualquier subdominio
  de la marca devuelve las IPs de Cloudflare y responde **404**, o sea que falta el vhost, no el
  DNS— y las dos apps ya son `output: standalone`, el mismo modelo que
  `scripts/deploy-onia-landing.sh`. Cuesta un contenedor por sitio.
- **b) Vercel por CLI.** Cuenta hobby, y el deploy por git está apagado justamente porque cinco
  loops pusheando agotaban la cuota diaria (`37f9ac88`). Competiría con la cuota que necesita la
  landing.

Lo único que hace falta de Sergio es **el nombre del subdominio**.

**12. El canario mira 10 pantallas en el repo, pero el VPS sigue corriendo la versión de 3.**
Se mergeó a `main` hoy (`52e359c1`): diez pantallas de cliente, umbrales medidos y el peso deja
de ser una lotería. Pero el prompt que EJECUTA el canario vive en `/root/bin/loops/` del VPS, y
`scripts/loops/README.md` lo dice literal: *"Al cambiar un prompt hay que volver a copiarlo"*.
Hasta que se copie, la mejora está commiteada y **no mira nada nuevo** — construido ≠ terminado.

Es **un solo comando** y cuesta **Bs 0**; no se corrió porque tocar el VPS necesita tu OK:

```bash
install -m 644 scripts/loops/prompts/canario-visual.md /root/bin/loops/canario-visual.md
```

**13. DOS ramas quedaron fuera de la integración por divergencia, no por conflicto.**
Se integraron 7 ramas a `main` con los gates en verde. Estas no, porque arrastran semanas de
deriva y mezclarlas a ciegas es cómo se rompe `main`:

| rama | commits atrás de `main` | commits suyos sin mergear |
|---|---|---|
| `claude/onia-web-architecture-b37eca` | 371 | 6 |
| `claude/chatbots-platform-review-0d1d09` | 358 | 5 |

⚠️ **Corregido el 2026-09-01 23:40 UTC, midiendo con `git rev-list --left-right --count`.**
Acá figuraba una tercera fila, `claude/personal-brand-strategy-db9eb9` con 32 commits sin
mergear, y **hoy tiene CERO**: su trabajo ya entró a `main` y la rama sólo está 2 commits
atrás. Pedirte que decidas entre "rebasar o archivar" una rama que ya se mergeó es peor que
un pendiente fantasma — es hacerte tomar de nuevo una decisión que ya está tomada. Las otras
dos filas también estaban viejas (decían 307/4 y 294/3): siguen abiertas, pero con los
números de hoy.

Para cada una la decisión es la misma y cuesta **Bs 0**: **rebasar y mergear** (alguien tiene
que mirar el rebase) o **archivarla** y perder ese trabajo. `claude/ads-creatividades-publicos`
(146 commits) queda afuera a propósito: es tu carril de contenido y lo cerrás vos.

## 17. El loop `docs-auditoria` está construido y probado, pero apagado (2026-09-02) — decisión de Sergio

El carril que audita ESTE archivo (worktree, rama, prompt, `case` en `onia-loop.sh`) ya existe en
el VPS y corrió una vez a mano el 2026-09-02T02:21 UTC con `exit 0`. **No tiene línea en
`crontab -l`**: sin ella, no se repite solo — cada vuelta futura necesita que alguien lo dispare
a mano. El `TOPE` ya está puesto en 2400 s (40 min), calcado del resto de los loops del VPS.

Lo que falta decidir es la **cadencia**, porque prender el cron es correr una sesión de Claude
cada vez que dispara (cuesta el consumo de la suscripción, no plata directa, pero sí corre sin que
nadie mire). Comparado con los otros tres del VPS:

| loop | cadencia | por qué |
|---|---|---|
| `chatbot-cola` | horaria | cola viva, hay que verla en la bandeja rápido |
| `canario-visual` | 4×/día | mira pantallas de cliente, barato y de bajo riesgo |
| `marca-personal` | 2×/día | drop de contenido con horario fijo (19:00 La Paz) |
| `docs-auditoria` | **sin decidir** | auditoría de docs — no depende de un reloj externo |

**Opciones cotizadas (todas Bs 0, sólo consumo de sesión Claude):**
- **2×/día** (ej. `11 8,20 * * *` UTC — mismo patrón que `marca-personal`, corrido 8 h después
  para no competir por CPU/disco en el mismo minuto): ritmo parejo con el resto de los loops de
  carril.
- **1×/día**: alcanza si los docs no cambian tan rápido como para que un hallazgo dure medio día
  sin corregirse.
- **Dejarlo apagado y disparar a mano** cuando se sospeche drift: cuesta cero sesiones de más,
  pero vuelve a depender de que alguien se acuerde — el mismo problema que esta doc existe para
  resolver en los otros loops.

Con el OK de Sergio, la línea a agregar en `crontab -e` es:
```
<minuto> <horas> * * * /root/bin/onia-loop.sh docs-auditoria >> /var/log/onia-loop-docs-auditoria.log 2>&1
```
y después se suma la fila a la tabla "Deben existir y estar activos" de arriba.
