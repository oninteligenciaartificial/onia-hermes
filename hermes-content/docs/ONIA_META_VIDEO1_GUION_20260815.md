# Video 1 de la revision de app de Meta - guion y pre-vuelo

Fecha de verificacion: 2026-08-15 (todo lo de abajo se comprobo en vivo contra el VPS,
la base de Chatwoot y la Graph API de Meta ese mismo dia).

Permiso que se esta pidiendo: `whatsapp_business_messaging`.
Lo que pide Meta, textual: un video que muestre un mensaje enviandose desde tu app a un
numero de WhatsApp, con la app enviando Y la interfaz de WhatsApp recibiendo, en el mismo video.

---

## 1. Semaforo: como esta el camino hoy

| Cosa | Estado | Detalle verificado |
|------|--------|--------------------|
| Numero de WhatsApp | VERDE | +591 75414930, nombre verificado "Onia", quality_rating GREEN, code_verification VERIFIED, Cloud API, limite TIER_250 |
| Cuenta de WhatsApp (WABA) | VERDE | account_review_status APPROVED, business_verification_status verified |
| Plantillas | VERDE | `confirmacion_cita` APPROVED, `recordatorio_demo` APPROVED, `seguimiento_demo` APPROVED |
| Canal en Chatwoot | VERDE | Bandeja 5 "Onia WhatsApp", conectada al numero, provider whatsapp_cloud |
| Conversacion 11 (Sergio, ...4992) | VERDE | Existe, abierta, es la unica conversacion de la bandeja de WhatsApp |
| **Enviar un mensaje ahora mismo** | **ROJO** | **Falla. No sale a Meta. Ver punto 2.** |
| Internet de la maquina | AMARILLO | En la prueba de hoy la red perdia ~50% de las conexiones. Ver punto 6. |

---

## 2. BLOQUEANTE: si grabas ahora, el envio FALLA

Se hizo la prueba real hoy (un solo mensaje, a la conversacion 11, la de Sergio).
Resultado: **el mensaje quedo en estado `failed`, con `source_id` vacio y el error
`Template not found or invalid template name`. Nunca salio del servidor. Nunca llego a Meta.
Nunca llego al celular.**

Por que pasa, con el codigo en la mano (`Whatsapp::SendOnWhatsappService`, Chatwoot 4.12.1):

```ruby
should_send_template_message = template_params.present? || !message.conversation.can_reply?
```

`can_reply?` es falso cuando pasaron mas de 24 horas desde el ultimo mensaje que ENTRO del
cliente. Con la ventana cerrada, Chatwoot no manda texto libre: intenta mandar una plantilla,
no encuentra ninguna que coincida con lo que escribiste, y lo marca como fallido sin llamar
a la API de Meta.

El ultimo mensaje que entro de Sergio fue el 2026-08-06 a las 14:58 UTC (10:58 hora Bolivia).
O sea: **la ventana de 24 horas esta cerrada hace mas de 9 dias.**

### La solucion, y es de un solo paso

**Desde el celular de Sergio (+591 ...4992), mandar un WhatsApp cualquiera al +591 75414930
antes de grabar.** Con eso se reabre la ventana por 24 horas y el envio desde el panel sale
como mensaje de sesion normal, con wamid real y llegada al celular.

Ojo con esto: hay un webhook activo en `message_created`, asi que cuando entre ese mensaje
**el bot va a auto-responder en unos 5-10 segundos**. Por eso el paso 0 del guion es hacerlo
FUERA de camara y esperar a que el bot termine, para que la respuesta automatica no se
meta en medio de la toma.

---

## 3. Preparacion (todo esto ANTES de apretar grabar)

0. **Abrir la ventana de 24 h.** Desde el celular de Sergio, mandar "Hola" al +591 75414930.
   Esperar unos 30 segundos a que el bot conteste solo. No grabar todavia.
1. **Dejar WhatsApp Web ya abierto y logueado** (web.whatsapp.com o la app de escritorio),
   con el chat de "Onia" / +591 75414930 abierto. El QR de vinculacion NO debe salir en el video.
2. **Dejar Chatwoot ya cargado y tibio**: https://chat.onia.com.bo, conversacion de Sergio
   (bandeja "Onia WhatsApp") ya abierta en pantalla. **No recargar la pagina en camara.**
   La primera carga tarda 20-45 s; si la haces en camara, arruinas la toma.
3. **Acomodar las dos ventanas 50/50**: el navegador con Chatwoot a la izquierda (Win + flecha
   izquierda) y WhatsApp Web a la derecha (Win + flecha derecha). Las dos visibles al mismo
   tiempo, sin taparse.
4. **Zoom del navegador al 110-125 %** en las dos ventanas, para que el texto se lea en el video.
5. **Que se vea la barra de direcciones con `chat.onia.com.bo`.** Es lo que le dice al revisor
   que la app es de Onia y no una herramienta de Meta.
6. **Grabador**: Herramienta de Recortes de Windows 11 (Win + Shift + S, pestana de video) o OBS,
   seleccionando la pantalla completa. No uses la Xbox Game Bar: graba una sola ventana y aca
   hacen falta dos. Sin audio, no hace falta narrar.

---

## 4. El guion (una sola toma, 33-38 segundos, sin editar)

| Segundos | Que hacer |
|----------|-----------|
| 0 - 5 | Arrancar la grabacion con las dos ventanas ya en pantalla. No tocar nada. Que se vea la URL `chat.onia.com.bo`, el nombre de la bandeja "Onia WhatsApp" y, del otro lado, el chat de WhatsApp con "Onia". |
| 5 - 8 | Mover el mouse al cuadro de escribir de Chatwoot y hacer clic (que se vea el cursor). |
| 8 - 18 | Escribir el mensaje despacio y completo (texto exacto abajo). Si tipeas lento, pegalo con Ctrl+V: tambien vale. |
| 18 - 20 | Hacer clic en el boton de enviar. Que se vea el clic. |
| 20 - 24 | El mensaje aparece en el hilo de Chatwoot, del lado del agente. **Mirar que NO salga el icono rojo de error.** Si sale rojo, cortar y volver al punto 2. |
| 24 - 30 | Mover el mouse hacia el lado de WhatsApp Web. El mensaje llega y se ve en el chat. |
| 30 - 38 | **Quedarse quieto 8 segundos** sobre el mensaje recibido, sin mover el mouse, para que el revisor alcance a leerlo. Cortar la grabacion. |

### Texto exacto a escribir

```
Mensaje enviado desde la app de Onia via WhatsApp Business Cloud API. Ref ONIA-REVIEW-01
```

Por que ese texto: se explica solo (dice que es la app de Onia usando la API de WhatsApp),
es corto para escribirlo en 10 segundos, y el `Ref ONIA-REVIEW-01` le deja al revisor una
cadena identica en las dos puntas para correlacionar envio y recepcion de un vistazo.

---

## 5. Lo que Meta tiene que ver si o si (revisar el video antes de subirlo)

Si falta cualquiera de estos, lo rechazan y hay que grabar de nuevo:

- [ ] **Las dos puntas en el MISMO video**: la app enviando y WhatsApp recibiendo. Sin cortes.
- [ ] **Se ve la app de Onia**, identificable: URL `chat.onia.com.bo` visible, bandeja "Onia WhatsApp".
- [ ] **Se ve el acto de enviar**: el cursor en el cuadro de texto, el texto escribiendose, el clic en enviar.
- [ ] **Se ve la interfaz de WhatsApp** (web o movil), reconocible como WhatsApp.
- [ ] **El texto es el MISMO en las dos pantallas** y se lee. El `Ref ONIA-REVIEW-01` tiene que
      leerse tanto en Chatwoot como en WhatsApp.
- [ ] **El mensaje llego de verdad**: aparece en el hilo de WhatsApp, no solo en el panel.
- [ ] **Sin icono de error** en el mensaje del lado de Chatwoot.
- [ ] **Toma continua**, sin edicion ni saltos.
- [ ] **Resolucion legible**: si al reproducirlo no podes leer el texto, el revisor tampoco.

### Lo que NO debe aparecer en pantalla

- [ ] Tokens, `api_access_token`, `phone_number_id`, claves. En concreto: **no abrir
      Configuracion > Bandejas de entrada > Onia WhatsApp** en camara, esa pantalla muestra
      campos de credenciales.
- [ ] La pantalla de login de Chatwoot con la contrasena escribiendose.
- [ ] El QR de vinculacion de WhatsApp Web.
- [ ] El panel de desarrolladores de Meta con tokens a la vista.
- [ ] Datos de otros clientes. **Ya verificado: no hay riesgo.** Las 10 conversaciones del
      panel son todas de prueba propias de Onia ("Prospecto Prueba ONIA", "Prueba Audio",
      "Visitante Prueba Web") mas la de Sergio. No hay terceros reales. No hace falta filtrar nada.
- [ ] Notificaciones personales que salten encima. Activar No molestar / modo concentracion antes.

---

## 6. Plan B

### Si el mensaje sale con error rojo en camara
Cortar ahi mismo, no seguir grabando. Es casi seguro que la ventana de 24 horas se cerro otra vez.
Volver al paso 0 (mandar un WhatsApp desde el celular al +591 75414930), esperar 30 segundos
y repetir la toma. No subir una toma con error: se ve, y es rechazo directo.

### Si Chatwoot carga lento y arruina la toma
No es un problema del panel, es un problema de guion: **el truco es no cargar Chatwoot en camara**.
Se deja abierto y tibio antes de grabar y la toma empieza con la conversacion ya en pantalla.
Cargado en caliente responde en unos 7 segundos; en la toma no se carga nada, solo se hace clic
en enviar. Con eso el riesgo desaparece.

### Sobre la herramienta "Probar" del panel de la app de Meta
**No la uses como reemplazo.** Sirve para comprobar que el numero manda, pero para la revision
es mala idea: esa herramienta es de Meta, no es tu app, y lo que el revisor pide explicitamente
es ver "tu app" enviando. Un video que solo muestra el boton de prueba de Meta muy probablemente
vuelva rechazado porque no demuestra el uso del permiso por parte de la aplicacion.
Como mucho, sirve como clip complementario, nunca como el video principal.

### Si WhatsApp Web no se puede usar
Segunda opcion: grabar la pantalla de la PC con Chatwoot y tener el celular fisico dentro del
mismo encuadre, filmando todo con una segunda camara. Funciona, pero se lee peor y sube el
riesgo de rechazo por legibilidad. Preferir siempre WhatsApp Web o la app de escritorio.

### Red
En la verificacion de hoy la red local ("ACADEMIA TIV 4") perdia cerca de la mitad de las
conexiones salientes y el DNS no resolvia: hubo que reintentar varias veces cada consulta.
Antes de grabar, comprobar que WhatsApp Web diga "en linea" y no "Conectando...", y que
Chatwoot responda. Con esa red inestable, una toma puede arruinarse por la conexion y no por
el sistema. Si esta intermitente, cambiar de red o usar los datos del celular.

---

## 7. Opcional (evaluarlo, no es obligatorio)

El panel muestra la marca "Chatwoot" (nombre de instalacion y marca estan en "Chatwoot").
Un revisor apurado podria leer que Onia esta mostrando un producto de terceros en vez de su
propia app. Se puede cambiar desde Super Admin > Settings, poniendo "Onia" como nombre de
instalacion y de marca.

No se toco nada de eso en esta verificacion: es decision de Sergio y es un cambio de
presentacion, no de funcionamiento. Si no se cambia, alcanza con que la URL
`chat.onia.com.bo` y la bandeja "Onia WhatsApp" se vean bien en el video.

---

## Anexo: evidencia de la verificacion (2026-08-15)

Horas en UTC; Bolivia es UTC-4.

- Contenedores arriba en el VPS: `onia-chatbot_chatwoot`, `chatwoot-sidekiq`, `chatwoot-db`, `chatwoot-redis`.
- Bandejas: 3 "ONIA Demo" (Api), 4 "Onia Web" (WebWidget), 5 "Onia WhatsApp" (Whatsapp, cuenta 2).
- Canal WhatsApp id 3: `+59175414930`, provider `whatsapp_cloud`, plantillas sincronizadas
  el 2026-08-15 18:10 (es el rastro de la grabacion del video 2).
- Graph API, numero `1283320641524523`: `quality_rating: GREEN`, `verified_name: Onia`,
  `code_verification_status: VERIFIED`, `platform_type: CLOUD_API`, `messaging_limit_tier: TIER_250`.
- Graph API, WABA `4429061034078857`: `account_review_status: APPROVED`,
  `business_verification_status: verified`.
- Conversacion 11: cuenta 2, bandeja 5, contacto 39 "Sergio" (telefono terminado en 4992),
  abierta. Es la unica conversacion de la bandeja de WhatsApp.
- Ultimo mensaje entrante en la conversacion 11: id 26, 2026-08-06 14:58:26 UTC.
  Al momento de la verificacion: 220 horas atras. Ventana de 24 h cerrada.
- Prueba de envio de hoy (un solo mensaje, solo a la conversacion 11): mensaje id 35,
  2026-08-15 19:49:53 UTC, quedo `failed`, `source_id` vacio,
  `external_error: "Template not found or invalid template name"`. No llego a Meta ni al celular.
- Historial relevante: los mensajes 31 y 32 (2026-08-13) habian fallado con
  `131042: Business eligibility payment issue`, pero el 34 (mismo dia, 22:38) salio bien y
  fue leido. Es un fallo intermitente que afecta a mensajes de plantilla pagos, no a los
  mensajes de sesion gratis que se usan con la ventana abierta. Con la ventana abierta no
  deberia aparecer, pero si sale el icono rojo, es este el sospechoso numero dos.
- Chatwoot 4.12.1. Logica confirmada en `Whatsapp::SendOnWhatsappService` y
  `Conversations::MessageWindowService` (ventana de 24 h para `Channel::Whatsapp`,
  contada desde el ultimo mensaje entrante).
- Cuando la ventana esta cerrada, el panel muestra el aviso
  "Restriccion de la ventana de mensajes de 24 horas". **Si ese aviso esta en pantalla,
  no grabes: el envio va a fallar.**
