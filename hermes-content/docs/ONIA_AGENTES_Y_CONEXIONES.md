# Agentes y conexiones — cómo van a funcionar

> **Doc vivo: se EDITA.** Nace el 2026-09-04, cuando Sergio Urcullo pidió *"piensa y coloca en
> los planes de desarrollo cómo van a funcionar los agentes… los que van a llenar planillas,
> los que van a llenar datos, los que van a atraer leads"* y *"ve el tema de conectar recursos,
> conectar una API de OpenAI, conectar una API de Google Drive… porque sin eso el chatbot no
> funciona"*.
>
> Manda `ONIA_V1_ALCANCE.md`. Mientras diga `EN CURSO`, de este documento **solo se construye
> lo que está en la sección «Qué entra en la 1.0»** — que es poco a propósito. El resto está
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

**Decisión (corregida el 2026-09-05):** la clave propia se ofrece, **pero como opción, no como
requisito**. Por defecto la pone Onia y el consumo es parte de lo que compra.

⚠️ Acá decía *"el cliente **nunca** conecta una clave de OpenAI"*. Sergio lo objetó con un dato,
y el dato es cierto: *"como funcionan las otras plataformas de chatbots, he visto que SendyPro
hace conectar API"*. Se verificó. **SendyPro lo hace, y SendPulse también.**

Pero mirando CÓMO lo hacen, la conclusión no es la que parece:

- En SendyPro, OpenAI figura en la **lista de integraciones** junto a Shopify, Google Sheets,
  Calendar, Zapier y Webhooks. Es algo que se *habilita*, no el requisito para que el bot
  arranque. Su propio titular vende *"IA con audios realistas… sin cargos por mensaje"*: **la IA
  viene incluida.**
- En SendPulse la documentación lo describe igual: entrás a Integraciones, apretás "Habilitar"
  al lado de OpenAI y pegás tu clave. Es un paso opcional para el que la quiere.
- Y **a quién le venden**: SendyPro es partner oficial de Meta para WhatsApp API. Su cliente ya
  está haciendo marketing por WhatsApp y ya tiene cuenta de OpenAI. El nuestro es el dueño de
  una ferretería en Santa Cruz que, según nuestra propia definición de "usable", tiene que poder
  **registrarse solo y llegar a cobrar sin que nadie lo ayude**.

**Entonces: las dos cosas, y el orden importa.**

| | Por defecto | Opción avanzada |
|---|---|---|
| Quién pone la clave | Onia | El cliente, con su propia cuenta de OpenAI |
| Quién paga el consumo | Onia | El cliente, directo a OpenAI |
| Tope | El del plan (500 conversaciones/mes) | **Sin tope nuestro** — paga lo que use |
| A quién le sirve | Al que compra y quiere que ande | Al que tiene volumen y prefiere controlarlo |

Es exactamente la regla que Sergio fijó ese mismo día para el catálogo: **simple por defecto,
avanzado opcional**. Un campo "pegá tu clave de OpenAI" en el primer paso del alta pierde la
venta; el mismo campo dentro de «Conexiones», para el que lo busca, no le estorba a nadie.

**Lo que hay que verificar antes de prometerlo (y no se puede desde acá):** que un negocio
boliviano PUEDA sacar una cuenta de OpenAI — hace falta una tarjeta que acepte cobros del
exterior, y muchos comercios chicos no la tienen. Si resulta que no pueden, la opción avanzada
igual se construye (para los que sí) pero **deja de ser una salida al problema del costo**, y
todo el peso vuelve a medir cuánto cuesta una conversación.

**Lo bueno: se construya como se construya, el código es el mismo.** Credencial cifrada por
organización, con el molde de `GatewayConfig`. Lo único que cambia es cuál es el valor por
defecto — y eso se decide sin tocar una línea.

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
| 1 | **Medir cuánto cuesta una conversación del chatbot** | Sin ese número, el precio del add-on (Bs 390) es una corazonada, y el costo crece con cada venta | Hay un número en Bs por conversación, medido, no estimado |
| 2 | **Que los agentes PROPONGAN algo** | 40 corridas y 0 propuestas: hoy la pantalla «El sistema trabajó por vos» le muestra un cero a quien está evaluando comprar | Una cuenta con deudas y citas viejas ve al menos una propuesta real, mirándola |
| 3 | **El aviso cuando una conexión se cae** | Ya tenemos la lección pagada cuatro veces. Un chatbot mudo sin aviso es peor que sin chatbot | Se corta la clave a propósito y el dueño recibe el aviso |

**Nada más.** Ni Google Drive, ni claves por cliente, ni agentes nuevos, ni IA redactando.

### Qué NO entra (anotado, no perseguido)

- Conectar Google Drive del cliente — hasta que un cliente que paga lo pida.
- **Clave de OpenAI propia del cliente (BYOK)** — decidido que va, como opción dentro de
  «Conexiones», nunca en el alta. **No entra en la 1.0**: no bloquea vender, y hasta no tener el
  número del punto 1 no sabemos si resuelve algo. Se construye con el molde de `GatewayConfig`,
  y quien la conecte se queda sin el tope de 500 conversaciones.
- Que el LLM redacte los mensajes de los agentes — la plantilla alcanza para vender.
- Agentes que actúan sin aprobación — **nunca**, no es cuestión de versión.
- Prospección automática hacia afuera — riesgo de perder el WhatsApp, y no es producto.

---

## Lo que decide Sergio, y nadie más

1. **¿El consumo de IA lo incluye Onia siempre, o hay un tope que el cliente paga aparte?**
   Hoy de hecho lo incluye Onia. La respuesta cambia el precio del add-on, no el código.
   Resuelto en parte el 5-sep: **las dos, con Onia por defecto**. Falta el número del costo por
   conversación para saber si el tope de 500 alcanza.
2. Cuando toque Google Drive: **de qué cuenta sale el archivo** — la del cliente (él conecta) o
   una de Onia (nosotros pagamos el espacio).
