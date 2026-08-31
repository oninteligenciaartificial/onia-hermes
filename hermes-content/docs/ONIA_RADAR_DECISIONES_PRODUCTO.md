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
  Bs 1.500 instalación + Bs 1.490/mes con 500 conversaciones + "a medida" cotizado.
  Costeo post-1-oct verificado (aguanta); checkpoint 1-sep para la tarifa exacta.
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

## 8. Cuatro desconocidos escribieron y nadie les contestó (2026-08-31) — decisión de Sergio

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

## 9. ¿De qué org son los inboxes 4 y 5? (2026-08-31) — decisión de Sergio

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
reinicio**. Queda verificable en un comando, sin tocar el VPS:
`node hermes-content/deploy/vps-ops/bot/espejo-check.mjs` — sale 0 si el código del VPS es el del
espejo, 1 nombrando los archivos si no. Esto **no cambia la decisión 9**, que sigue siendo
opción 1: sólo corrige lo que hay que hacer cuando se ejecute S9.

## 10. La marca de Chatwoot se está filtrando por tres puertas sin vigilancia (2026-08-31) — acción de Sergio

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

## 11. En la bandeja, lo que dice el bot aparece firmado "Vos" (2026-08-31) — acción de Sergio

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
