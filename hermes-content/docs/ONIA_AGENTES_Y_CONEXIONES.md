# Agentes y conexiones — cómo van a funcionar

> **Doc vivo: se EDITA.** Nace el 2026-09-04, cuando Sergio Urcullo pidió *"piensa y coloca en
> los planes de desarrollo cómo van a funcionar los agentes… los que van a llenar planillas,
> los que van a llenar datos, los que van a atraer leads"* y *"ve el tema de conectar recursos,
> conectar una API de OpenAI, conectar una API de Google Drive… porque sin eso el chatbot no
> funciona"*.
>
> Manda `ONIA_1.0_CORTE.md` (antes `ONIA_V1_ALCANCE.md`). De este documento **solo se construye
> lo que ese corte pone en la 1.0 o la 1.1** — que es poco a propósito. El resto está
> escrito para que la decisión ya esté tomada cuando toque, no para hacerlo ahora.

---

## Lo primero: dos supuestos que medí y son falsos

Antes de planear hay que corregir de dónde partimos, porque el plan cambia entero.

### 1. «Sin conectar la API de OpenAI el chatbot no funciona» — **falso**

El chatbot **funciona hoy**. `lib/whatsapp-ai.ts:106` lee `process.env.OPENAI_API_KEY`: **una
sola clave, la de Sergio, para todos los clientes**. El cliente no conecta nada y nunca va a
tener que conectar nada.

Entonces esto **no es una función que falte. Es un costo y un riesgo**:

- **Un costo que crece con cada venta.** Cada conversación de cada cliente la paga Sergio. Con
  3 clientes no se siente; con 30, el margen del plan Profesional se lo come el consumo.
- **Un punto único de falla.** Si esa clave se queda sin saldo o la rotan, **se cae el chatbot
  de TODOS los clientes a la vez**. No hay aviso por cliente ni degradación parcial.
- Ya hay un tope por cliente (`ChatbotUsoMensual`: 500 conversaciones al mes), así que el gasto
  **está acotado por diseño**. Eso es lo que salva la situación hoy.

**Decisión FINAL (2026-09-05, tarde): NO hay clave propia del cliente. Ni siquiera como opción
avanzada.** Onia pone la clave, incluye el consumo, y **cobra más por eso**.

Este bloque se reescribió dos veces en un día. Vale dejar las tres versiones porque el camino es
el argumento:

1. *"El cliente NUNCA conecta una clave"* — mi versión, sin datos.
2. *"Va como opción avanzada"* — después de que Sergio Urcullo mostrara que SendyPro y SendPulse
   lo ofrecen. El dato era cierto.
3. **Lo que quedó**, y lo cerró él con el argumento correcto:

> *"Coloquemos opciones más caras, que añadan más el costo pero que den más apertura a usarlo, y
> que sea fácil más que todo. Es como ManyChat: se puede hacer gratis eso, pero ellos te cobran
> porque te facilitan el trabajo."*

**Por qué gana esa:**

- **Casi nadie va a poder usar BYOK acá.** OpenAI pide tarjeta que acepte cobros del exterior.
  Una función que el 90 % de los clientes no puede activar igual hay que construirla,
  documentarla, soportarla y depurar cuando falle. Es costo permanente por valor cero.
- **Lo que se vende no es el acceso al modelo: es que no tengas que pensar en el modelo.**
  Cualquiera puede armarse un bot con la API de OpenAI. ManyChat cobra igual, y cobra bien,
  porque el trabajo que ahorra vale más que el token que consume. Onia está en el mismo negocio.
- **Y esto NO contradice «simple por defecto, avanzado opcional».** Esa regla dice *no borres
  una capacidad que el cliente ya tenía para simplificar*. BYOK no es una capacidad que exista y
  se esconda: es una que no vamos a construir. Esconder ≠ no construir.

**Lo que esto obliga, y es lo único que de verdad importa:**

Si el consumo va incluido, **el margen depende enteramente de saber cuánto cuesta una
conversación**. Sin ese número, poner el add-on en Bs 390 es apostar. Sube de prioridad: era el
punto 1 de la 1.0 y ahora es el que sostiene el modelo entero.

**Y el tope deja de ser una limitación: es el motor del precio.** Es el eje que el alcance ya
fijaba — *el precio sube porque el negocio choca con un tope, no porque se lo subamos*:

| | Incluye | Cuando choca |
|---|---|---|
| Plan con chatbot | N conversaciones/mes | Sube de plan, o compra un paquete extra |
| Paquete extra | +N conversaciones | Se repite |

Un cliente que consume mucho **paga más y sigue sin conectar nada**. Esa es la venta.

⚠️ **El riesgo a vigilar, escrito para que nadie lo descubra tarde:** un solo cliente pesado
puede comerse el margen de varios livianos si el tope está mal puesto. El tope no es una traba
al cliente — es lo que hace que el negocio cierre. Ponerlo sin medir es la forma cara de
enterarse.

### 2. «Los agentes hay que construirlos» — **ya están, y no usan IA**

`OniaAgentsAgent`, `OniaAgentsRun` y `OniaAgentsAction` existen en la base, con su runtime
(`lib/onia-core/modules/agents-runtime.ts`), su cron (`/api/cron/onia-agents`), su gate por plan
y su pantalla de aprobación.

Y lo más importante: **los agentes de hoy son deterministas, no LLM.** Buscan con SQL
(`getRecallFeed`, `getCollectorFeed`, `getLeadsFeed`, `getVisitasPendientesFeed`) y arman el
mensaje con plantilla (`buildRecallMessage`, `buildCollectorMessage`).

**Eso es una virtud y hay que defenderla.** Un agente que decide a quién cobrarle con una
consulta SQL cuesta cero, tarda milisegundos, y **no puede alucinar una deuda**. El día que un
agente le mande a un cliente del cliente un mensaje diciendo que debe plata que no debe, ese
negocio nos echa y cuenta por qué.

El problema real, del alcance: **40 corridas, 0 propuestas.** Corren y no proponen nada.

---

## El modelo mental: proponer, aprobar, ejecutar

Un agente en Onia **nunca actúa solo**. Los tres pasos, siempre, sin excepción:

```
  MIRA                  PROPONE                 APRUEBA               EJECUTA
  (SQL, determinista)   (acción concreta)       (una persona)         (el sistema)
  ────────────────      ─────────────────       ──────────────        ─────────────
  "estos 4 clientes     "mandarle esto          el dueño ve el        se manda, y
   deben hace 30 días"   a Juan por WhatsApp"    texto y aprieta       queda el rastro
```

Esto ya está construido: `status` de una acción va `proposed → pending_approval → approved →
executed`. La pantalla de aprobación es `/pending`, y es COMÚN a todos los rubros.

**La regla que no se negocia:** nada que salga hacia afuera (un mensaje a un cliente, una
publicación, un cobro) se ejecuta sin que una persona lo apruebe. La pantalla ya lo dice:
*«Nada sale sin que vos aprietes el botón»*. Ese es el argumento de venta, no una limitación.

**Dónde entra la IA, y solo ahí:** en **redactar**, nunca en **decidir**. Quién debe plata lo
dice el SQL. Cómo se le escribe, con qué tono y en qué idioma, lo puede escribir el LLM. Si el
LLM se cae, el agente sigue funcionando con la plantilla.

---

## Los tres agentes que pidió, y cómo funciona cada uno

### A. El que llena datos (el que más vale y el menos vistoso)

**Qué hace:** el dueño carga a un cliente con el nombre y nada más. El agente completa lo que
puede DEDUCIR de lo que ya está en el sistema: el teléfono que quedó en una venta fiada, el
correo con el que confirmó una cita, el NIT que aparece en una factura vieja.

**Cómo:** mira las tablas propias del tenant, propone «este cliente parece ser el mismo que
este otro / le falta el teléfono y lo tenés acá», y el dueño acepta. **No inventa datos ni los
busca afuera.** Un dato inventado en una ficha de cliente es peor que un campo vacío.

**Por qué vale:** ataca el motivo #1 por el que un sistema se abandona — se llena a medias y
deja de servir. Y es determinista: cero costo de IA.

### B. El que llena planillas

**Qué hace:** las planillas que hoy el dueño llena a mano y son siempre las mismas —
el resumen de IVA del mes para el contador, la planilla de sueldos, el corte de caja.

**Cómo:** el dato ya está en la base. El agente arma el archivo y lo deja listo para
descargar o mandar. **No es un agente de IA: es un reporte que se dispara solo.** Llamarlo
agente ayuda a venderlo; construirlo como LLM sería caro, lento y peor.

**Dónde va el archivo:** acá sí entra Google Drive, y es el ÚNICO caso donde el cliente conecta
algo suyo (ver abajo).

### C. El que atrae leads

⚠️ **Cuidado: son dos cosas distintas y conviene no mezclarlas.**

1. **Leads del cliente** (el dueño quiere más clientes): el chatbot ya lo hace — atiende el
   sitio y el WhatsApp 24h y deja la conversación en la bandeja. El agente encima de eso
   califica: «esta conversación pidió precio y no volvió, escribile». `getLeadsFeed` ya existe.
   **Esto es producto, se vende.**
2. **Leads para ONIA** (Sergio quiere más clientes): es prospección para nosotros, no una
   función del sistema. Vive en Hermes y en el CRM, no en la plataforma.

**Lo que NO se hace en ninguno de los dos:** raspar datos de terceros ni mandar mensajes a
gente que no habló primero. En Bolivia el cliente lo tolera; WhatsApp y Meta no, y perder el
número de WhatsApp del cliente por spam es perder al cliente.

---

## Conectar recursos: la decisión de fondo

**Hay dos clases de recurso, y confundirlas es el error caro.**

| | **De Onia** | **Del cliente** |
|---|---|---|
| Ejemplos | OpenAI, el servidor de correo, el WhatsApp de Onia | Su Google Drive, su WhatsApp Business, su pasarela de pago, su NIT del SIN |
| Quién paga | Onia | El cliente |
| ¿El cliente lo conecta? | **NUNCA.** No lo ve, no lo configura, no se entera | Sí, con un botón |
| Si falla | Se caen todos los clientes | Se cae ese cliente, y hay que avisarle a él |

**La regla:** si el cliente no lo entiende, no lo conecta. Nadie que vende repuestos sabe qué es
una API key de OpenAI, y explicárselo es admitir que el producto no está terminado.

### Lo que ya existe para esto (no hay que inventarlo)

- **`lib/encryption.ts`** — AES-256-GCM con `ENCRYPTION_KEY`. Ya cifra credenciales.
- **`GatewayConfig`** — el molde: credenciales de pasarela de pago, cifradas, por organización,
  con ambiente sandbox/producción. **Cualquier conexión nueva se hace igual que esto.**
- **`OrganizationApiKey`** — claves que el cliente genera para que OTROS entren a Onia. Es el
  sentido inverso; no confundir.

### El molde para una conexión nueva

Una pantalla **Conexiones**, y cada tarjeta con tres estados legibles: *sin conectar* ·
*conectado, funcionando* · *🔴 se desconectó, esto dejó de andar*. El tercero es el que casi
nadie construye y el que evita el modo de falla que ya nos mordió cuatro veces: **algo
programado que corre, falla y no avisa.**

Nada de un campo «pegá tu token acá», salvo que no exista otra forma. Google y Meta se conectan
con un botón (OAuth); el token lo guarda el sistema cifrado y el cliente nunca lo ve.

---

## Qué entra en la 1.0 — y es poco a propósito

Vamos por una versión **100 % funcional**, no por una versión completa. De todo lo de arriba,
en la 1.0 entra **solo esto**, y solo cuando le toque el turno en el orden del alcance:

| # | Qué | Por qué entra | Listo cuando |
|---|---|---|---|
| 1 | **Medir cuánto cuesta una conversación del chatbot** | 🔴 **Sostiene el modelo entero.** Al descartar BYOK, el consumo va incluido siempre: sin ese número, el add-on en Bs 390 y el tope de 500 son una apuesta | Hay un número en Bs por conversación, medido sobre conversaciones reales, no estimado |
| 2 | **Que los agentes PROPONGAN algo** | 40 corridas y 0 propuestas: hoy la pantalla «El sistema trabajó por vos» le muestra un cero a quien está evaluando comprar | Una cuenta con deudas y citas viejas ve al menos una propuesta real, mirándola |
| 3 | **El aviso cuando una conexión se cae** | Ya tenemos la lección pagada cuatro veces. Un chatbot mudo sin aviso es peor que sin chatbot | Se corta la clave a propósito y el dueño recibe el aviso |

**Nada más.** Ni Google Drive, ni claves por cliente, ni agentes nuevos, ni IA redactando.

### Qué NO entra (anotado, no perseguido)

- Conectar Google Drive del cliente — hasta que un cliente que paga lo pida.
- **Clave de OpenAI propia del cliente (BYOK)** — **descartado**, no pospuesto. Ver arriba: casi
  nadie puede sacar cuenta de OpenAI en Bolivia, y lo que se vende es no tener que pensar en el
  modelo. Si algún día un cliente grande lo pide como condición para firmar, se revisa — con ese
  cliente delante, no antes.
- Que el LLM redacte los mensajes de los agentes — la plantilla alcanza para vender.
- Agentes que actúan sin aprobación — **nunca**, no es cuestión de versión.
- Prospección automática hacia afuera — riesgo de perder el WhatsApp, y no es producto.

---

## Lo que decide Sergio, y nadie más

1. ~~¿El consumo de IA lo incluye Onia o lo paga el cliente?~~ **RESUELTO el 5-sep: lo incluye
   Onia, siempre, y se cobra más por eso.** Queda pendiente el número del costo por conversación
   para saber dónde va el tope — eso es medición, no decisión.
2. Cuando toque Google Drive: **de qué cuenta sale el archivo** — la del cliente (él conecta) o
   una de Onia (nosotros pagamos el espacio).
