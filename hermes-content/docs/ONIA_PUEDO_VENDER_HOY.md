# ¿Podemos vender hoy? — estado verificado

> Doc VIVO (se edita, no se duplica). Todo lo de acá se verificó el 2026-08-18 contra
> producción o contra el código, no contra la memoria. Pregunta de Sergio: "¿ya podemos
> vender el sistema? ¿los datos del banco ya están listos?".

## Respuesta corta

**SÍ se puede vender el sistema. NO están listos los datos del banco.** Se puede cobrar
la primera venta igual — pero por transferencia/QR personal y con el alta a mano, no por
un checkout automático.

## Lo que SÍ está vivo y se puede mostrar/vender

| Qué | Estado verificado |
|---|---|
| Registro + onboarding multi-rubro | ✅ prod (probado E2E con 2 orgs QA: clínica y ferretería) |
| 6 rubros vendibles | ✅ prod (dental, comercio, importadora, estética, veterinaria, servicios) |
| Agenda, pacientes/clientes, tratamientos, inventario, facturación interna | ✅ prod |
| Agentes con aprobación (Cobrador, Recall, Captador) | ✅ prod — con salida real: botón "Enviar yo mismo por WhatsApp" |
| **Chatbot por cliente** | ✅ prod: el dueño llena el formulario, publica, y su bot contesta como SU recepcionista con botones, en su widget |
| Alta del chatbot en 1 click | ✅ prod (`/admin/chatbots`) |
| Gate del add-on | ✅ prod (apagar el add-on apaga el bot de verdad) |
| Landing con hero de valor | ✅ vivo en onia.com.bo |

## Lo que NO está listo — y qué falta exactamente

### 1. Banco / cobro automático ❌

Verificado en la base de producción hoy: **0 pasarelas configuradas** (`gateway_configs`
vacía) y **0 pagos registrados** (`subscription_payments` en cero). O sea: nadie pagó
nunca por el sistema, y no hay ninguna cuenta bancaria conectada.

**Del BCP tenemos la documentación, NO el acceso**: las 5 APIs están estudiadas y
escritas (`ONIA_BCP_API_QR_INTEGRACION.md`), pero faltan las **credenciales** (ni
sandbox), y hay **19 preguntas abiertas** al banco. Las dos que definen todo:
- **¿Cuál es la comisión exacta?** La infografía dice "Comisión" sin cifra.
- **¿Cada cliente necesita su propio contrato con el BCP?** Si sí, el alta se vuelve
  pesada y el self-service muere ahí.

⚠️ Además: el QR que hoy muestra el checkout dice **"SERVICIO DENTALGEST", titular Ruddy
Urcullo, monto Bs 0,00** — no se le puede mostrar a un cliente.

**Y hay algo ANTES que las preguntas: la cuenta corriente empresa todavía no está
abierta.** El trámite está armado al 90 % (`ONIA_BCP_APERTURA_CUENTA_PAQUETE.md`: datos
completos, las 2 cartas redactadas listas para firmar, FATCA resuelto). Falta: que
Leslie confirme sus datos y firme, imprimir el CI escaneado con firma a mano, y la
llamada al ejecutivo con las 7 preguntas — la #1 es si la cuenta que Leslie YA tiene en
el BCP es personal o está asociada al NIT, porque eso cambia el trámite entero.

**Orden real para destrabar el cobro automático:**
1. Leslie confirma y firma → se presenta el paquete → cuenta corriente empresa abierta.
2. Con la cuenta: pedir credenciales de sandbox de la API de QR.
3. Con el sandbox: integrar el checkout (el diseño ya está hecho).
Mientras tanto: cobrar por transferencia o QR personal, alta manual.

### 2. Cobro del add-on chatbot ❌ (en construcción)

Contratar el chatbot hoy = link de WhatsApp + el superadmin activa a mano. El circuito
(contratar → comprobante → aprobación → add-on activo → contador de las 500
conversaciones) está en construcción.

### 3. Facturación fiscal (SIAT) ⏳ auditoría en curso

Se está verificando qué factura de verdad y qué está apagado. El bloqueo conocido es el
**NIT**. Hasta que la auditoría cierre: **no prometer "facturamos al SIAT"**.

### 4. WhatsApp del cliente ⏳ esperando a Meta

App Review presentado y EN CURSO (visto en el panel, ~20 días). Hasta entonces el bot
del cliente vive en el widget web (que ya funciona y ya dice "Desarrollado por Onia").

## Cómo se vende HOY, sin mentir

1. **Demo real**: registro en vivo → onboarding → agenda → agentes proponiendo → el
   chatbot contestando en el widget. Todo eso existe y se puede mostrar.
2. **Cobro**: transferencia o QR personal, alta manual del superadmin. Es aceptable para
   los primeros clientes; no escala más allá de ~10.
3. **Lo que NO se promete todavía**: facturación al SIAT (hasta la auditoría), WhatsApp
   propio del cliente (hasta Meta), y pago con tarjeta/QR automático (hasta el BCP).

## Prioridad para pasar de "se puede vender" a "se vende solo"

1. Respuestas del BCP (Sergio) → checkout automático.
2. Cobro del add-on (en construcción).
3. Cierre de la auditoría fiscal → saber qué prometer.
4. App Review de Meta (esperando) → WhatsApp del cliente.
