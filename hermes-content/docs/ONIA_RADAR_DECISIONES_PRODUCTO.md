# Radar de decisiones de producto — las ideas que no se pueden perder

> Doc VIVO sin fecha (se edita, no se duplica). Nace 2026-08-17 de un volcado de
> Sergio: "estas son ideas que no puedo olvidar; luego vamos a desglosar una por
> una". Cada frente lleva su estado REAL verificado y la pregunta que falta decidir.

## Cerradas — vencidas, verificadas contra el sistema en vivo (2026-09-02)

Estas cuatro dejaron de necesitar una decisión de Sergio: el propio sistema (u otra
sesión) ya las resolvió. Se cierran acá con la medición, no se borran del historial de
"Para decidir" — ese punto queda con una nota que apunta para acá.

**A. ¿Publicamos `onia.com.bo`?** Ya está publicado. `/opt/onia-landing/runtime-next`
se desplegó el **2026-09-01 21:42 UTC** (`stat` del directorio), con `BUILD_ID`
`qinaKbiNJ_V9rh9loH5MO` — distinto del `Ega1b2zc6I30Rblyyl2Fv` que el punto daba por
vivo. Verificado MIRANDO las dos páginas que el punto señalaba como rotas:
`curl -s https://onia.com.bo/precios | grep -c "Inventario avanzado"` → **0** (ya no
cobra el addon retirado) y el `<h1>` de `https://onia.com.bo/` es
`"Cerrás vos.<br/>El negocio no."` — el hero de PR #35, no el de la v3. Los dos commits
que el punto pedía (`eec7d0f3` precio, `c8dfe249` hero) son ancestros de `origin/main`
Y ya están sirviéndose.

**B. ¿El chatbot AGENDA? (la rama `fix/bot-manda-link-de-reserva`)** Ya se mergeó —
commit `fbe106be` (2026-09-01 20:28 -04:00), y trae la decisión tomada adentro del
propio mensaje: *"El catalogo de venta NO se toca: no promete agendar hasta que el bot
desplegado lo haga."* Verificado que se cumplió: `ONIA_CATALOGO_DE_VENTA.md:126` sigue
diciendo que un pedido de cita "lo ESCALA a una persona", y
`scripts/venta-honestidad.test.mjs` (test *"el catalogo de venta no vende que el
chatbot agenda"*) sigue en el repo verificando exactamente eso. No hay pregunta
pendiente: se decidió mergear el código y dejar la promesa de venta como estaba hasta
el deploy al VPS — que ya es parte del punto 16(a) de este mismo radar, no una decisión
nueva.

**C. "El canario mira 10 pantallas en el repo, pero el VPS sigue corriendo la versión
de 3."** Ya no. `diff scripts/loops/prompts/canario-visual.md /root/bin/loops/canario-visual.md`
→ sin salida, archivos idénticos (18.371 bytes los dos, el del VPS fechado
`2026-09-02 02:25`). El comando de un renglón que el punto pedía ya se corrió.

**D. "Dos ramas quedaron fuera de la integración" — una de las dos ya no.**
`git rev-list --left-right --count origin/main...origin/claude/chatbots-platform-review-0d1d09`
→ `388 0`: cero commits propios sin mergear (confirmado con
`git log origin/claude/chatbots-platform-review-0d1d09 --not origin/main`, vacío). Ya
está adentro de `main` — no hace falta rebasar ni archivar. Sigue viva sólo
`claude/onia-web-architecture-b37eca` (401/2, aumentó desde el 371/6 de la última
medición: sigue divergiendo, no se achica sola).

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

> ⚠️ **Añadido el 2026-09-02 por el integrador — antes de decidir CUÁNDO desplegar, hay que
> saber que hasta hoy el deploy ni siquiera arrancaba.** `web-factory/pnpm-lock.yaml` estaba
> desincronizado con `web-factory/apps/onia-platform/package.json`, y los dos scripts de deploy
> instalan con `pnpm install --frozen-lockfile` (`scripts/deploy-onia-landing.sh:24`,
> `scripts/deploy-onia-center.sh:31`) — un modo que **falla** si el lockfile no coincide.
> Reproducido con el lockfile de `main`: `ERR_PNPM_OUTDATED_LOCKFILE`, *"1 dependencies were
> added: vitest@^4.1.8"*, exit 1. **El deploy de `onia.com.bo` moría en la línea 24, antes de
> compilar una sola línea.** Ya está arreglado y verificado en `main` (`9d57be50`): con el
> lockfile sincronizado, `pnpm install --frozen-lockfile` sale exit 0.
> **Lo que cambia para la decisión:** nada de esta lista se movía aunque Sergio hubiera dicho
> "desplegá" — habría fallado en el install y parecido un problema del servidor. Ahora sí
> depende sólo de la decisión.

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
- ~~**(b) El script de marca de Chatwoot.** Cinco minutos, sin riesgo de motor, y saca el logo
  ajeno de una pantalla que ven los clientes desde el 16-ago.~~ ⚠️ **VENCIDA — verificada en vivo
  el 2026-09-02. No le pidan a Sergio esta decisión: ya está tomada y automatizada.** El script
  corre solo cada hora (`17 * * * * /root/bin/chatwoot-brand-onia.sh` en el crontab del VPS, con
  corridas limpias hasta las 06:17 UTC de hoy), y `chat.onia.com.bo/app/login` sirve hoy
  `"INSTALLATION_NAME":"Onia"` y `"WIDGET_BRAND_URL":"https://onia.com.bo"`. La pantalla pública
  **ya no se presenta como Chatwoot**.

  Lo que queda es mucho más chico y **no es lo que decía la fila**: sobreviven dos claves de URL
  sin pisar, `TERMS_URL` y `BRAND_URL`, las dos apuntando a `https://www.chatwoot.com`. Es un
  ítem de cola del carril chatbot, no una decisión de Sergio.

  Se deja tachada y no borrada porque el resto de esta sección sigue vigente: **(a) el deploy del
  motor del bot no se hizo**, y la tabla de arriba sigue midiendo bien lo que ese deploy enciende.

Se pueden hacer los dos, uno, o ninguno — pero mientras no se haga, este radar dice la verdad:
está en el repo, no está encendido.

**Un hallazgo colateral, para que no muerda después:** `web-factory/pnpm-lock.yaml` está
**desactualizado en `main` desde `470a2140`** — `apps/dental-premium/package.json` declara nueve
dependencias que el lockfile no tiene, así que `pnpm install --frozen-lockfile` (lo que corre un
CI) **falla**. No se tocó acá porque regenerar un lockfile no es trabajo de un merge, pero es una
bomba con temporizador para el primer pipeline que instale en limpio.

## 24. ~~`/` y `/empezar` no tienen dueño~~ — RESUELTO 2026-09-02, no hay decisión

> ⚠️ **Era la SEGUNDA sección numerada `16` de este archivo, y por eso quedó fuera de secuencia.**
> Renumerada a 24 el 2026-09-02. El `16` legítimo es el de arriba (*"Treinta y un commits… NINGUNO
> está desplegado"*, creado en `d1826f48` el 08-31 23:09); esta nació después, en `84ad6628`, y
> reusó el número. **El choque no era cosmético: las DOS tenían una opción `(a)`**, así que las
> tres citas de *"punto 16(a)"* / *"la §16"* que viven en este mismo archivo (grep `16(a)`)
> resolvían a dos cosas distintas — el deploy del motor del bot, o "que `onia-cola` adopte la
> home". Se renumeró ésta y no aquélla porque aquélla estaba primero, **sigue abierta**, y es la
> que se lleva las tres citas. Se deja acá, en su lugar cronológico, en vez de moverla al final:
> mover el texto perdería el contexto de las secciones que la rodean.

La home y la página de acceso viven en `web-factory/apps/onia-platform/`: **ninguna cola las
nombra**, y la zona de `web-factory-dev-loop` las excluye explícitamente. Son la puerta de
entrada del producto y hoy sus defectos caen en `COLA.md` por descarte, no porque ese carril
sea el dueño. Ya hay uno abierto ahí (la maqueta cortada de "Elegís tu rubro").

Las dos opciones cuestan lo mismo — una línea en un archivo, cero bolivianos:

- **a)** `onia-cola` las adopta: se agrega esa ruta a su zona en `COLA.md`. Es donde ya caen
  hoy, y el carril ya toca `app.onia.com.bo`.
- **b)** `web-factory-dev-loop` levanta su prohibición para esa carpeta y se las queda. Es el
  carril que sabe de superficies web, pero hoy tiene la puerta cerrada por decisión previa.

**Resuelto el 2026-09-02, con las dos preguntas que dejó abiertas contestadas — no por
elección entre (a)/(b), sino porque el propio loop `web-venta` ya nació dueño de esta zona**
(su prompt: "Vos sos ese dueño", zona `web-factory/apps/onia-platform/**`). Y la duda de fondo
—¿el redeploy del 2026-09-01 con `/register` como CTA era legítimo o el bug de agosto había
vuelto?— también se cerró: es legítimo. `ONIA_ALTA_AUTOMATICA=abierta` se reabrió en
`onia-platform` el 29-ago, el sitio se puso al día con `alta.ts` (commit `37ab9e92`,
2026-09-01) y hoy (verificado contra el contenedor `onia-landing`, no `main`) las dos páginas
dicen "Creá tu cuenta" en consistencia total — cero "Pedí tu acceso" residual. Detalle en
`COLA.md`, el ítem que cerraba esa duda.
**Lo que sigue siendo cierto y no cambia con esto:** `app.onia.com.bo/register` sigue siendo
del repo `onia-platform`, otro carril (`onia-cola`) — este carril no toca ese flujo, sólo lo
enlaza.

# Para decidir — al abrir el 1 de septiembre

Diez cosas esperan a Sergio — la 2 se resolvió el 1-sep y queda tachada. Están ordenadas por lo
que desbloquean, no por urgencia
aparente. Cada una tiene su detalle arriba en este archivo o en
`hermes-content/docs/handoff/claude-git-status-935f47.md`.

**1. ~~¿Publicamos `onia.com.bo`?~~ ✅ CERRADO — ya está publicado.** Ver "Cerradas → A"
arriba: build `qinaKbiNJ_V9rh9loH5MO` del 2026-09-01 21:42 UTC, sin la promesa vieja.

<details><summary>Texto original (historia de cómo se venía posponiendo)</summary>

**Ya no son 77 commits: son OCHO.**

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

</details>

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

**9. ~~¿El chatbot AGENDA?~~ ✅ CERRADO — ya se mergeó y la decisión ya está tomada.** Ver
"Cerradas → B" arriba: commit `fbe106be` (2026-09-01 20:28), y el propio mensaje del merge
elige "no tocar el catálogo hasta el deploy" — no queda pregunta para vos, salvo el deploy
al VPS que ya cubre el punto 16(a).

<details><summary>Texto original</summary>

La rama que lo hace está lista y no se puede mergear sin tu decisión.

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

</details>

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

**12. ~~El canario mira 10 pantallas en el repo, pero el VPS sigue corriendo la versión de
3.~~ ✅ CERRADO — ya se copió.** Ver "Cerradas → C": el prompt del VPS y el del repo son
idénticos byte a byte hoy.

<details><summary>Texto original</summary>

Se mergeó a `main` hoy (`52e359c1`): diez pantallas de cliente, umbrales medidos y el peso deja
de ser una lotería. Pero el prompt que EJECUTA el canario vive en `/root/bin/loops/` del VPS, y
`scripts/loops/README.md` lo dice literal: *"Al cambiar un prompt hay que volver a copiarlo"*.
Hasta que se copie, la mejora está commiteada y **no mira nada nuevo** — construido ≠ terminado.

Es **un solo comando** y cuesta **Bs 0**; no se corrió porque tocar el VPS necesita tu OK:

```bash
install -m 644 scripts/loops/prompts/canario-visual.md /root/bin/loops/canario-visual.md
```

</details>

**13. DOS ramas quedaron fuera de la integración por divergencia, no por conflicto — ahora es
UNA sola.** Ver "Cerradas → D": `claude/chatbots-platform-review-0d1d09` ya tiene **cero**
commits propios sin mergear, ya está adentro de `main`. Sigue viva sólo
`claude/onia-web-architecture-b37eca` (**401 commits atrás de `main`, 2 propios sin mergear**,
medido hoy — venía divergiendo, no se achica sola).

La decisión sigue siendo la misma para la que queda: **rebasar y mergear** (alguien tiene que
mirar el rebase) o **archivarla** y perder ese trabajo, Bs 0 cualquiera de las dos.
`claude/ads-creatividades-publicos` (146 commits) queda afuera a propósito: es tu carril de
contenido y lo cerrás vos.

## 17. ~~El loop `docs-auditoria` está construido y probado, pero apagado~~ — RESUELTO, ya corre (2026-09-02)

> 🔴 **CORREGIDO el 2026-09-02: esta sección quedó vieja en horas.** Esta misma vuelta del
> carril `docs-auditoria` está corriendo **porque el cron ya está prendido** —
> `crontab -l` en el VPS tiene `18 1,5,9,13,17,21 * * * /root/bin/onia-loop.sh docs-auditoria`
> (6×/día), y `hermes-content/docs/cola/loops.md` ya lo lista en la tabla "Deben existir y
> estar activos". No queda ninguna opción por elegir: la cadencia ya se decidió y se aplicó.
> Lo que sigue es el texto original, que se deja como historia de la decisión pendiente.

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

## 18. Home y `/empezar` tienen 6 screenshots reales del producto — la regla del 1-sep las prohíbe (2026-09-02) — decisión de Sergio

Regla vigente, tuya, del 2026-09-01: *"no coloques capturas literales del sistema, se ve mal,
coloca cosas referenciales"* — cero `<img>`/`<video>`/`<canvas>` que fotografíen el software,
sólo piezas que DIBUJEN el resultado del cliente. Encontrado midiendo el HTML servido de
`onia.com.bo/` y `/empezar` (contenedor `onia-landing`, no un grep de repo): **6 imágenes son
screenshots reales del panel de Onia**, de antes de esta regla (commit `65201c20`,
2026-08-21 — el propio mensaje dice *"la landing muestra el producto real... capturas
cableadas en sus ranuras"*, con datos de un tenant de demo sembrado por los circuitos reales).

**Dónde están:**
- Home: `/v2/capturas/agentes.webp` (pantalla de agentes) y `/v2/capturas/whatsapp.webp`
  (editor del chatbot) — el bloque "Trabajan de noche. No *deciden* solos."
- `/empezar`: `/v2/capturas/panel.webp` (dashboard con "Bs 4.633,40 cobrados") — la imagen del
  hero, al lado del CTA principal.
- Las 5 de `/rubros/*.webp` en la banda "Elegís tu rubro" — mismo tipo de captura; tienen
  además un bug de recorte propio ya anotado en `COLA.md` (item de la maqueta cortada), que es
  independiente de éste.

**Por qué no lo cerré solo esta vuelta:** sacar 3 imágenes centrales del hero de las dos
páginas que más lead reciben es la clase de cambio visual que la otra regla de esta cola frena
— *"un rediseño no se publica sin que Sergio VEA la pieza terminada"* — con el precedente caro
del 2026-08-20 (landing v2 rechazada entera, revertida en producción). No hay un reemplazo
"obvio" de bajo riesgo: un hueco en blanco tampoco vende.

**Tres caminos, ninguno cuesta plata en efectivo salvo el marcado:**
- **a) Ilustración/diagrama referencial** (lo que la regla pide al pie de la letra): redibujar
  cada captura como pieza gráfica — no fotografía del software, sí su resultado (montos,
  agenda, WhatsApp). Costo: diseño, ~1 vuelta por imagen bien hecha, cero plata si se hace con
  CSS/SVG; con generación de imagen (Higgsfield) es gasto trivial de crédito, ya autorizado por
  `CLAUDE.md` para lotes chicos — pero igual necesita el visto bueno de la pieza terminada.
- **b) Blur/recorte fuerte** que deje reconocible sólo la forma (bloque de color + contorno),
  no el contenido — es lo que la ranura `shapeShot` ya sabía hacer ANTES de cablear estas
  capturas (`65201c20` lo dice: "sin `src` sigue siendo la ranura de forma+color"). Revertir a
  ese estado es la opción más barata y ya probada, aunque pierde el "se ve real" que buscaba el
  commit original.
- **c) Excepción explícita para estas 3**: si Sergio decide que la regla del 1-sep era para
  otro contexto (video/referente) y no para las capturas ya ganadas del producto, se anota acá
  como excepción y el ítem de `COLA.md` se cierra sin tocar código.

Mientras no haya decisión, el ítem queda abierto en `COLA.md` con la medición completa para
que la próxima vuelta no la repita.

## 19. ~~El espaciado roto del login~~ — CERRADA el 2026-09-02, Sergio NO decide nada

> ✅ **Era el motor de captura, no el sitio. Las tres opciones de abajo quedan sin objeto: ninguna
> hay que ejecutar, y el párrafo de `/login` NO se toca.**
>
> **Cómo se resolvió sin Sergio.** El camino **(c)** de esta misma sección —*"que Sergio abra
> `app.onia.com.bo/login` en su Chrome de escritorio; si no lo ve, se cierra como
> fantasma-de-headless"*— era la respuesta correcta con el instrumento equivocado: no hacía falta
> un humano con GUI, hacía falta **el otro Chromium, que ya estaba bajado en el VPS**. Se cambió
> el motor en vez de la persona.
>
> **La medición, hecha dos veces por dos carriles distintos** (el dueño de `web-venta` y después
> el integrador, sin creerle al primero): misma URL, mismo instante, misma fuente ya cargada,
> los dos binarios apuntados por `executablePath`.
> - `chrome-headless-shell-1223` → *"Ent regamos t u sist ema … puest a … con t us dat os"*.
> - `chromium-1223` completo → *"Entregamos tu sistema con la configuración de tu rubro puesta."*
>
> El `innerText` es idéntico en los dos, y **la única variable que cambió fue el rasterizador**.
>
> **Por qué la bisección de abajo no contradice esto — importa, porque es lo que hizo perder tres
> días.** "Roto en pesos ≤500, limpio en 600+, limpio con Arial" es exactamente la firma de un bug
> de rasterizado en trazos finos: describe *cuándo* se ve, no *quién* lo dibuja. Ninguna de esas
> pruebas cambió de motor, así que **ninguna podía distinguir sitio de captura** — por eso todas
> apuntaron con confianza al lugar equivocado. Cuando una investigación no puede refutar su propia
> hipótesis, acumular evidencia dentro de ella sólo la vuelve más convincente, no más cierta.
>
> **Lo único que queda, y no es de Sergio:** el canario visual saca sus fotos con el motor malo
> (`scripts/canario_visual.mjs`, `chromium.launch` sin `channel`), así que va a seguir inventando
> este defecto en cada corrida. Está como ítem abierto del carril del canario en `COLA.md`.

<details><summary>La investigación original, tal como quedó (ya explicada por lo de arriba)</summary>

`COLA.md` tenía el ítem del párrafo de `app.onia.com.bo/login` con espacios metidos DENTRO de
palabras ("Ent regamos", "puest a") marcado como *"queda a criterio del dueño confirmarlo en un
navegador de verdad antes de invertir tiempo"* — podía ser un artefacto de Chromium headless en
Linux y no algo que viera un cliente real. Se invirtió el tiempo: **es un bug real y aislado, no
un artefacto de captura**, pero cerrarlo cambia el peso visual del texto.

**Lo nuevo, verificado hoy, que el ítem original no tenía:**
- Se reproduce igual en DPR 1 (el mismo que usa `canario_visual.mjs`) y en DPR 3, y con zoom por
  `transform: scale()` en vez de supersampling del screenshot — descarta que sea un artefacto de
  cómo se capturó la imagen.
- **Es específico de la fuente Archivo en pesos ≤500.** El mismo párrafo con `font-family: Arial`
  (DOM override, sin tocar código) sale perfecto — cero gap. Con `font-weight: 700` sale perfecto
  también. Bisecado: **400/450/500 rotos, 600 y para arriba limpios.**
- **No es kerning ni ligaduras**: `font-kerning: none` y `font-feature-settings: "kern" 0, "liga"
  0, "calt" 0` no cambian nada — el gap sigue. Tampoco es el eje `wght` sin fijar: pinearlo
  explícito a `'wght' 400` con `font-variation-settings` no lo arregla.
  → Es un problema del propio archivo variable de Archivo (Google Fonts, servido por
  `next/font/google` sin `weight` fijo — `app/layout.tsx:25-29` en `onia-platform`) al
  interpolar el eje de peso en pesos bajos/medios bajo el shaping de Chromium/Linux (HarfBuzz o
  FreeType), no de nuestro CSS.

**Por qué no lo cerré con un `font-weight: 600` esta vuelta:** el párrafo (`text-white/55`, texto
secundario deliberadamente liviano — `components/auth/AuthShell.tsx:105`) está pensado para
verse discreto al lado del título en `font-extrabold`. Subirlo a 600 lo saca de ese lugar visual
— cambia cómo se ve la pantalla que comparten `/login` y `/register`, la misma clase de cambio
que la regla *"un rediseño no se publica sin que Sergio VEA la pieza terminada"* frena (precedente
del 2026-08-20). No es un bug de una línea con un arreglo obvio: es un trade-off entre "se ve
roto a veces" y "se ve más pesado siempre".

**No verificado, y sigue sin poder verificarse desde acá:** un Chrome de escritorio real
(Windows/Mac, no headless) — esta máquina no tiene GUI. Sigue siendo posible que el bug sólo
exista en Chromium headless de Linux y ningún cliente real lo vea nunca.

**Tres caminos, cotizados:**
- **a) Subir el peso del texto secundario del panel a 600** (o el valor bisecado más bajo que
  salga limpio — no se afinó más allá de escalones de 50). Cierra el bug con certeza, cambia el
  peso visual de TODO el texto `detalle` del panel de auth (3 bullets, 2 pantallas). Costo: una
  línea de CSS + gates + captura para que Sergio la mire antes de mergear. ~15 min.
  - Es el mismo bug reportado en el `titulo` en `font-extrabold` (~800): a ese peso nunca se vio,
    consistente con que arriba de 600 esté limpio.
- **b) Servir Archivo como fuente ESTÁTICA (no variable) para los pesos que usa el body**, en vez
  del archivo variable completo 100–900 que pide `layout.tsx` hoy. Sin interpolación de eje no
  debería haber nada que HarfBuzz calcule mal. Mantiene el peso visual actual. Costo mayor: tocar
  cómo se cargan las DOS familias de marca (el comentario de `layout.tsx:19-23` dice que la
  variable es a propósito, para que el numeral fino de 300 y el titular de 800 salgan del mismo
  archivo) — un cambio de infraestructura de fuente, no de una pantalla. No probado si de verdad
  esquiva el bug: es hipótesis, no medición. ~1-2 vueltas.
- **c) No tocar nada todavía** y pedirle a Sergio que abra `app.onia.com.bo/login` en su propio
  Chrome de escritorio. Si no lo ve, el ítem se cierra como fantasma-de-headless sin gastar más
  tiempo; si lo ve, elige entre (a) y (b) con la certeza de que es real para un cliente.

**Recomendación: (c) primero — es gratis y resuelve la duda de fondo —, y si confirma, (a)**: es
reversible, rápido, y el texto sigue siendo perfectamente legible a 600; (b) sólo si (a) no
alcanza o Sergio prefiere no tocar el peso visual.

Mientras no haya decisión, el ítem sigue abierto en `COLA.md`, con este hallazgo referenciado
para que la próxima vuelta no rehaga la bisección.

</details>

## 20. Tres commits arreglan el login de la plataforma y NINGUNO está en producción (2026-09-02) — decisión de Sergio

**No confundir con la §16**: aquella es el deploy del **motor del bot** y de `web-factory`. Esta
es el deploy de **`onia-platform`**, el contenedor que sirve `app.onia.com.bo`. Son dos deploys
distintos, con riesgos distintos, y se pueden hacer por separado.

**Medido en vivo el 2026-09-02, no deducido.** El contenedor `onia-platform` monta
`/opt/onia-platform/runtime-next`, cuyo `.next/BUILD_ID` es `lNDdVgrRvP1mizzu3BVXc` — el mismo
que `/opt/onia-platform/build-8a3b5a6`. O sea: **producción corre `8a3b5a6`**, y `master` tiene
tres commits encima que nadie desplegó.

| Commit | Qué arregla | Cómo se comprobó que NO está en producción |
|---|---|---|
| `bdf0935` + `5888a13` (merge) | **El login le deletrea los nombres de los iconos al lector de pantalla**, y si la fuente tarda más de 12 s se los muestra como texto a cualquiera (`bolt`, `credit_card_off`, `smart_toy`) | El HTML servido hoy trae los tres `<span>` **sin `aria-hidden`**, y el script del `<head>` sigue cerrando con `setTimeout(ok,12000)` en vez de la guarda `d.fonts.status` |
| `efaffe8` | **La CSP bloqueaba el beacon de Cloudflare Web Analytics en toda la plataforma** | La cabecera `content-security-policy` servida hoy no menciona `cloudflareinsights` en ningún lado |

Tocan 6 archivos, +151/−15, y **4 de los 6 son tests** — la superficie de riesgo real son
`components/auth/AuthShell.tsx` (5 líneas), `lib/iconos-script.ts` (13) y `next.config.ts` (29).

**Por qué importa que sean éstos y no otros.** Los dos son el mismo tipo de fallo: *invisible
mientras todo va bien, feo justo cuando algo va mal*. El de los iconos es literalmente el bug de
agosto que Sergio encontró a mano —el login mostrando `credit_card_off` como palabra— y hoy lo
único que lo tapa es que la fuente cargue rápido. Con la fuente que en agosto tardó 117 s, el
fallback de 12 s **es el camino normal, no el raro**.

**La decisión.** Desplegar `onia-platform` no lo decide un carril de integración. Es el mismo
runbook del swap de siempre (`onia-platform/.claude/skills/onia-deploy/SKILL.md`), con el
recordatorio de `CLAUDE.md`: **buildear en el VPS con `app.env`, nunca con un `.env.local`
presente**, o Next hornea `127.0.0.1` en el bundle.

**Recomendación: hacerlo.** Es el deploy más barato del radar —cambia tres archivos de código,
ninguno toca base de datos, pagos ni sesiones— y cierra un ítem de `COLA.md` que ya está verde en
código y vale cero hasta que se encienda.

## 21. Nadie mira nunca el panel del chatbot del cliente — falta una credencial de sólo lectura (2026-09-02) — decisión de Sergio

**Qué pasa.** `app.onia.com.bo/settings/chatbot` es la pantalla donde un cliente edita el
conocimiento de su bot. Está detrás de sesión, así que el canario visual —el único que abre y
MIRA las pantallas de cliente— nunca la vio. Hasta hoy, encima, **la reportaba verde**: medía
el `/login` al que redirige y lo comparaba contra una baseline que también era el login.
Arreglado hoy (`scripts/canario_visual.mjs`): ahora dice `NO MEDIDA` con el motivo. Pero
"no miente" no es "se mira": la pantalla sigue sin que nadie le pase el ojo nunca.

**Qué falta, y es una sola cosa.** Un usuario del producto que sólo mire, puesto como
`ONIA_CANARIO_USER` / `ONIA_CANARIO_PASS` en el entorno del loop `canario-visual`. **Cero
código pendiente**: `requiereSesion` y `iniciarSesion()` ya están escritos y entran por el
formulario real de `/login`. Enchufarla es un `env`.

**Las opciones, cotizadas:**

1. **Crear un usuario de sólo lectura en una org existente** (~5 min de Sergio, cero código).
   Es la recomendada. Riesgo: la credencial vive en el entorno del VPS — no en el repo.
2. **Reusar una cuenta que ya exista** (0 min). Más barato, pero si es una cuenta con permisos
   de escritura, un canario que se equivoque de click toca datos reales. No recomendada.
3. **Una ruta de vista previa pública** — la que proponía el ítem original. **Se descarta:**
   expone configuración de cliente sin sesión y agrega una superficie viva. Se anota para
   cerrar la puerta, no para elegirla.

**Recomendación: (1).** **Desbloquea:** que `/settings/chatbot` entre a la ronda del canario
como las otras diez pantallas. Es **S15** en `hermes-content/docs/cola/chatbot.md`.

## 22. El corredor de los loops se edita a mano en el VPS y el repo queda atrás — decidir si se blinda (2026-09-02)

**Qué pasó, medido.** El 2026-09-02 09:18 UTC el carril `investigacion` estaba **muerto con su
cron intacto**: su línea (`26 3,9,15,21`) seguía en `crontab -l`, pero su `case` había
desaparecido de `/root/bin/onia-loop.sh` cuando se reescribió el script a las 05:44. Cada corrida
caía en el `*)` con `exit 64` — que ocurre en la línea 97, **24 líneas antes de que se defina
`avisar()`** (línea 121). Fallo mudo: nada por Telegram, nada en ningún tablero. Corrió una sola
vez en su vida (03:00:20Z) y esa vuelta hizo trabajo real (`a7a28f63`, cerró 4 fantasmas de este
mismo archivo).

Ya restaurado y versionado. **Lo que queda para vos es evitar la próxima**, porque la causa sigue
viva: el `.sh` que corre se edita a mano y el del repo queda atrás. En una sola jornada divergió
**dos veces**; a las 09:18 el repo tenía `claude-sonnet-5` donde el VPS ya corría
`claude-opus-5 --effort max`, no tenía `web-venta` ni `investigacion`, y le faltaba la guarda de
`MERGE_HEAD`. Reinstalar desde el repo —que es lo que el propio README manda— **habría bajado el
modelo de todos los loops y borrado dos carriles.**

**Opciones cotizadas (todas Bs 0, sólo trabajo de una vuelta de loop):**

- **A — El corredor se avisa a sí mismo.** Extender la guarda que ya existe para los prompts
  (`ddc3b9f1`): al arrancar, `diff` entre `/root/bin/onia-loop.sh` y la copia del repo; si
  difieren, Telegram de una línea. Barato, no bloquea nada, y ataca la causa real (nadie se entera
  de la divergencia). **Recomendada.**
- **B — Un `ARRANCA` que falte, avisa.** Un chequeo diario que compare cada línea de `crontab -l`
  contra el `tail` de su log: si no hay `ARRANCA` posterior a la última hora que le tocaba, avisa.
  Cubre a `investigacion` **y** a cualquier otra causa de muerte silenciosa, no sólo esta. Más
  trabajo que A, y es el único que detecta un loop que arranca y se cuelga.
- **C — Mover el `exit 64` después de `avisar()`.** Arregla sólo el caso "nombre no reconocido".
  Diez minutos. Es un parche, no cubre B.
- **D — Nada.** Queda la disciplina escrita en `loops.md` paso 3 y 8. Gratis hoy, y ya sabemos que
  la disciplina sola falló dos veces en un día.

A y B se pueden hacer las dos; no compiten.

**El chequeo de arranque mira en una sola dirección.** Aparte de lo de arriba, hay un agujero de
diseño que conviene que sepas: el bloque pegado en todos los prompts busca filas de la tabla que
falten en el cron — nunca al revés. Por eso `web-venta` e `investigacion` corrieron días sin estar
en `loops.md`, invisibles para la auto-cura. Arreglarlo toca los 7 prompts (uno por carril) y el
bloque dice explícitamente "no lo optimices", así que **no lo tocó nadie todavía**: decidilo vos.

## 23. ~~Los arreglos del carril chatbot al producto nunca llegan a `master`~~ — RESUELTO 2026-09-02, Sergio NO decide nada

> ✅ **Cerrado el 2026-09-02 12:39 UTC por el integrador (`onia-cola`), por el camino (a).** Se
> tomaron las dos acciones que pedía esta entrada, en la misma vuelta:
>
> 1. **Mergeados los 3 commits a `origin/master`** (`503af44`, merge `--no-ff`). Eran 3, no 2:
>    se sumó `d62beeb`, que cablea el gate de iconos a `ci`. Guarda dura pasada (0 archivos
>    borrados, 13 archivos, +373/−28) y **los tres gates de `onia-platform` en verde**:
>    `tsc` 0 · `vitest` **2494 pasan / 204 archivos** · `npm run lint` **0 errores**
>    (100 warnings preexistentes). Los snapshots NO se reescribieron esta vuelta — se verificó
>    con `git status` después de vitest, por la trampa de CRLF que la cola ya tenía anotada.
> 2. **Tapado el agujero que lo causaba** (recomendación (a)): `scripts/loops/prompts/onia-cola.md`
>    ahora hace `fetch` y cuenta en **los dos repos**, cada uno contra su base (`main` en
>    `onia-hermes`, `master` en `onia-platform`), y trae el comando para enumerar en vivo las
>    ramas del segundo repo en vez de confiar en una lista escrita a mano.
>
> **Verificado por el gate que este mismo carril construyó, no por lectura:**
> `npm run deploy:alcanzable` pasó de **exit 1** nombrando los commits inalcanzables a **exit 0**
> — *"4 commit(s) declarado(s), los 4 llegan a origin/master"*. Es la clase de prueba que esta
> entrada pedía: una que discrimina en vez de gritar a todo.
>
> ⚠️ **Lo que NO cambia: esto era el escalón `rama → master`. La §20 sigue abierta.** Los tres
> arreglos ahora existen en `master` y **el cliente todavía no los ve**: falta el deploy, que
> decide Sergio. Cerrar ésta no destraba aquélla — la hace posible.

**Es un escalón ANTES de la §20, no la misma cosa.** La §20 mide `master` → producción: tres
commits que están en `master` y nadie desplegó. Ésta mide **rama de carril → `master`**: dos
commits que ni siquiera llegaron a la rama de la que se buildea. Si mañana se aprueba el deploy
de la §20, el swap buildea `master` y **estos dos siguen sin estar**.

**Medido el 2026-09-02, no deducido** (`git merge-base --is-ancestor` en el clon del VPS):

| Commit | Qué arregla | ¿en `origin/master`? |
|---|---|---|
| `22fd088` | El menú del dashboard dibuja `ASSIGNMENT_TURNED_IN` en letras gigantes en vez de un icono | **NO** |
| `675541b` | El editor del chatbot le dice "La cita" y "en el consultorio" a una ferretería | **NO** |

Los dos están commiteados **y pusheados** a `origin/claude/chatbots-platform-review-0d1d09` de
`onia-platform`. Esa rama está **2 commits adelante y 17 atrás** de `origin/master`, y nada la
mergea.

**Por qué nadie la mergea, que es la causa y no el síntoma.** El integrador (`onia-cola`) tiene
el merge a `master` **pre-autorizado** por su propio prompt. Pero su Paso 1 hace
`cd /root/loops/onia-hermes` y recorre una lista de ramas de **ese** repo. La rama
`claude/chatbots-platform-review-0d1d09` está en esa lista — sólo que la cuenta contra el `main`
de `onia-hermes`, donde da **0**, y concluye "no hay nada que hacer con esa rama". El mismo
nombre de rama existe en los DOS repos, y el que tiene trabajo sin mergear es el que nadie mira.

**El costo ya cobrado: es la tercera vez que la misma instrucción falla, cada vez un escalón más
adentro.** (1) `S11` mandaba desplegar un commit inexistente — el trabajo había quedado en el
disco de Windows. (2) Se rehizo y se pusheó, y `S11` quedó escrito "commiteado y pusheado, NO
desplegado", como si sólo faltara el OK. (3) Medido hoy: falta el merge. **Un bloqueo que le pide
a Sergio desplegar algo que el deploy no alcanza no se destraba nunca.**

**Ya no depende de un párrafo:** `npm run deploy:alcanzable` lee la cola, saca los commits de
`onia-platform` que declara y le pregunta a git si `origin/master` los alcanza. Hoy sale **exit
1** nombrando los dos; `e644c85` (de un ítem viejo) sale **OK**, que es la prueba de que
discrimina en vez de gritar a todo.

**Tres caminos, cotizados:**

- **(a) `onia-cola` extiende su Paso 1 a las ramas de `onia-platform`.** Su prompt ya autoriza el
  merge a `master` y ya tiene escritos los tres gates de ese repo (`tsc`, `vitest`, `npm run
  lint`). Lo que falta es que enumere el segundo repo. Toca
  `scripts/loops/prompts/onia-cola.md` — es del carril de integración, **no del chatbot**.
  Costo: una vuelta de ese loop. **Es el único que no se vuelve a romper el mes que viene.**
- **(b) Sergio mergea la rama a mano**, o por PR como llegaron los últimos (`Merge pull request
  #77`). Costo: minutos. Arregla estos dos commits y ninguno de los próximos.
- **(c) Dejarlo.** Cada arreglo que este carril haga sobre el producto queda en una rama muerta,
  y `S11` no se destraba nunca.

**Recomendación: (a)**, y (b) ahora mismo si se quiere el icono arreglado en el próximo swap.

---

## 25. Los carriles auditan un árbol viejo: nadie sincroniza el worktree con `main` (2026-09-02)

**Qué pasó, medido.** La vuelta de `docs-auditoria` de las 13:18 UTC arrancó en `HEAD 8a83eea7`
—su propio último commit— y `git rev-list --count HEAD..origin/main` daba **96**. Noventa y seis
commits de `main` que el carril no veía.

**Por qué importa, con el caso concreto de esa misma vuelta.** El carril leyó `COLA.md` y el
radar de su copia vieja, encontró el ítem *"Nadie es dueño de `/` ni de `/empezar`"* pidiéndole a
Sergio elegir entre dos opciones, verificó en vivo que el bloqueo estaba **vencido** (el carril
`web-venta` es el dueño desde el 2026-09-02, corre 5 veces al día y commitea arreglos reales en
`web-factory/apps/onia-platform/`) y **estuvo a punto de escribir la corrección**. En `origin/main`
esa sección ya decía `RESUELTO` hacía horas. Se salvó por casualidad: al ir a editar, comparó
contra `origin/main` primero.

Ese es el modo de falla exacto: **un carril cuyo trabajo es "que lo escrito sea cierto" auditando
una copia que ya no es lo escrito.** Gasta la vuelta entera re-corrigiendo lo corregido, y peor,
puede "arreglar" hacia atrás algo que otro carril ya dejó bien.

**No es sólo de este carril.** `/root/bin/onia-loop.sh` no tiene un solo `git fetch` ni
`git merge --ff-only` antes de trabajar (`grep -n "fetch\|pull\|rebase" /root/bin/onia-loop.sh`
sólo devuelve comentarios). Los siete carriles arrancan donde los dejó su vuelta anterior.

**Por qué no lo arreglo solo:** tocar el corredor cambia el comportamiento de **los siete
carriles a la vez**, y el prompt de este carril prohíbe tocar otro carril. Además hay un motivo
real para no sincronizar a ciegas: un `merge` automático puede abrir conflictos sin nadie que los
resuelva, y `CLAUDE.md` prohíbe soltar el turno con un merge abierto.

**Opciones cotizadas (todas Bs 0, trabajo de una vuelta):**

- **(a) `git merge --ff-only origin/main` al arrancar, y si NO es fast-forward, seguir igual y
  avisar por Telegram.** El `--ff-only` es la clave: nunca abre un conflicto — o adelanta limpio,
  o falla sin tocar nada. Cubre el caso de esta vuelta (el carril no tenía commits propios sin
  mergear: `git rev-list --count origin/main..HEAD` = 0). Toca `scripts/loops/onia-loop.sh` + su
  copia del VPS. **Recomendada.**
- **(b) Sólo `git fetch` + avisar la distancia**, sin mover el árbol. El carril decide qué hacer.
  Más conservador, pero deja el trabajo de decidir en cada vuelta.
- **(c) Que cada prompt lo haga por su cuenta.** Toca los 7 prompts en vez de 1 archivo, y se
  desincroniza igual que todo lo demás. No recomendada.
- **(d) Dejarlo.** Cada carril sigue auditando su foto vieja. El costo no es hipotético: ya
  quemó parte de una vuelta.

**Recomendación: (a).** Es la única que no depende de que alguien se acuerde, y por ser
`--ff-only` no puede dejar un merge abierto — que es justo lo que `CLAUDE.md` prohíbe.

---

## 26. Una rama de `onia-platform` lleva dos meses varada, y 10 de sus 11 modelos ya llegaron por otro lado (2026-09-02) — decisión de Sergio

**Cómo apareció:** contando ramas del segundo repo, que es lo que este loop hace cada vuelta.
`claude/onia-core-adoption-sprint5` es la **única** rama sin mergear a `origin/master` hoy
(`git branch -r --no-merged origin/master`). No estaba en la lista de carriles del integrador
porque **no es un carril**: no tiene loop.

**Lo medido, no supuesto:**

- **1 commit propio, 382 commits atrás de `master`.** El commit es `aa8f211`
  (*"feat(onia-core): add area + accounting + invoicing schema (Sprint 5)"*), del **2026-07-06** —
  casi dos meses. Toca 2 archivos: `prisma/schema.prisma` (+810) y una migración nueva
  (`20260706000000_add_onia_accounting_invoicing_area/migration.sql`, +340).
- **Mergearla a ciegas es pedir conflicto sobre el archivo más caro del repo.** Desde la base
  común, `master` movió `prisma/schema.prisma` en **+1.018 líneas**. Es el schema de la base de
  producción: un merge mal resuelto ahí no rompe un build, rompe datos.
- **Y sobre todo: casi todo su contenido YA ESTÁ en `master`.** De los 11 modelos que agrega,
  **10 ya existen** (`OniaAccountingAccount`, `FiscalPeriod`, `JournalEntry`, `JournalEntryLine`,
  `TaxRate`, `TaxDeclaration`, `RcvRecord`, `WithholdingRecord`, `FixedAsset`,
  `OniaInvoicingCreditDebitNote`). **El único que falta es `OniaCoreArea`.**

**O sea que la rama no es trabajo varado: es trabajo ya entregado por otro camino, con un
residuo de un modelo.** Mergearla entera para rescatar `OniaCoreArea` es pagar un conflicto de
schema de 1.000 líneas por una tabla.

**Las opciones, cotizadas (todas Bs 0):**

- **(a) Borrar la rama y, si `OniaCoreArea` hace falta, escribirlo como migración nueva sobre
  `master`.** Es lo barato y lo limpio: una migración chica, sin tocar las 1.018 líneas que
  `master` movió. Hay que confirmar antes que `OniaCoreArea` se use para algo — hoy no lo llama
  nadie. **Recomendada.**
- **(b) Dejar la rama como está.** Cuesta cero hoy, pero cada vuelta del integrador la vuelve a
  contar, y en dos meses más nadie va a saber qué tenía adentro. Es cómo nace un fantasma.
- **(c) Mergearla.** No la recomiendo y no la hago sin orden explícita: conflicto garantizado en
  `prisma/schema.prisma`, sobre el schema de producción, para traer 1 modelo de 11.

**Recomendación: (a).** Y mientras no se decida, el integrador **no la mergea** — queda anotado
en su propio prompt para que ninguna vuelta futura la levante por parecer "la única pendiente".

**Efecto colateral que ya se cobró solo, y vale más que la rama:** contar esta rama destapó que
el ítem bloqueado del `DELETE /api/payments/[id]` tenía una premisa falsa. Declaraba *"cero
`fiscal_period`, cero tabla de cierre en el repo"*, y `OniaAccountingFiscalPeriod` no sólo está
en `master`: **está aplicado en la base de producción** (`supabase-db`, tabla
`onia_accounting_fiscal_periods`, 0 filas) y **no lo llama nadie**. Su opción (b) estaba cotizada
en 3-4 días contando el modelado y la migración, que ya están hechos. Corregido en `COLA.md`,
sección "Bloqueado — necesita a Sergio".
