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
