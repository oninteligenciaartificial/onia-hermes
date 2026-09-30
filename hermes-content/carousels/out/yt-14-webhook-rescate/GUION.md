# Guion de grabación · El mensaje que se perdía: webhook caído, rescate y firma

**Título público:** El mensaje que se perdía: webhook caído, rescate y firma

**Miniatura:** NADIE CONTESTÓ

**Resultado prometido:** Al terminar, la persona podrá detectar mensajes sin respuesta, armar un barrido de rescate con barandas y cerrar su webhook con firma o secreto.

**Duración objetivo:** 10–14 minutos. No acelerar para meter más conceptos; cortar lo
que no contribuya al resultado prometido.

## 01 · El caso

**Lámina:** Alguien le escribió a mi bot. Nunca recibió respuesta.

**Guion:** Contá el mensaje textual y el silencio. Prometé qué pasó segundo por segundo, cómo lo arreglaron para que no dependa de que el servidor nunca se caiga, y el segundo agujero: cualquiera podía hacerle decir cosas al bot.

**Pantalla / prueba:** Lámina a pantalla completa.

## 02 · Segundo por segundo

**Lámina:** El mensaje cayó justo en el hueco.

**Guion:** Explicá la cadena: WhatsApp, Chatwoot como bandeja donde se ven las conversaciones, el webhook y el bot. Leé la línea de tiempo de los registros. El del medio cayó en el hueco: Chatwoot disparó su único aviso y no volvió a intentar.

**Pantalla / prueba:** Diagrama WhatsApp → Chatwoot → webhook → bot y la línea de tiempo.

## 03 · El error de fondo

**Lámina:** Yo suponía que el aviso se reintentaba.

**Guion:** Depende de quién te avisa. Primera regla: no supongas cómo reintenta tu proveedor, medilo. Después contaron cuántas veces pudo pasar: veinte reinicios, cada uno un hueco de hasta dos minutos donde un mensaje se podía perder para siempre.

**Pantalla / prueba:** Documentación de webhooks de Meta, en la parte de reintentos.

## 04 · La corrección

**Lámina:** Que caerse deje de costar una persona.

**Guion:** El servidor que nunca se cae no existe; el vigía ya lo levantaba. Faltaba que caerse no costara una persona. Cerrar la conversación no cuenta como respuesta. Reinyectar de más produce un salteo, no una segunda respuesta. Las barandas son contra hablar de más, y acordate de la ventana de 24 horas. En n8n: disparador cada diez minutos que busca esas conversaciones y las manda a tu flujo principal.

**Pantalla / prueba:** Flujo del barrido de rescate, corrido en seco.

## 05 · Lo que salió mal

**Lámina:** Primera prueba: un 401. Segunda: un contador que mentía.

**Guion:** Si copiás la llave a otro lado, algún día se desincroniza y vuelve el 401 sin que sepas por qué. El contador decía uno, pero la conversación estaba con una persona y el bot se callaba por diseño: un contador que dice éxito sin éxito es peor que no tener contador. La verificación que vale: reinyectaron un mensaje ya contestado y el webhook lo trató como duplicado.

**Pantalla / prueba:** Salida del barrido: mandado vs. contestado, con el motivo.

## 06 · El segundo agujero

**Lámina:** Cualquiera podía hacerle decir cosas a mi bot.

**Guion:** Cerrado a fines de julio: el webhook no verificaba quién le hablaba. La firma se calcula con una clave compartida y lleva la hora. Si le hablás directo a Meta, viene en X-Hub-Signature-256, calculada con el secreto de tu app. En n8n, el Webhook ya trae una dirección larga y aleatoria: no la cambies por una linda. El código de partida, sin secreto, aceptaba todo: es el agujero que viene de fábrica.

**Pantalla / prueba:** Documentación de webhooks de Meta: X-Hub-Signature-256.

## 07 · La regla

**Lámina:** Tres reglas, cada una en una frase.

**Guion:** Leé las tres en voz alta, despacio: no supongas que tu proveedor reintenta, medilo. Tu servidor se va a caer: que caerse no te cueste un cliente. Y tu webhook no le cree a nadie: firma, secreto, o nada.

**Pantalla / prueba:** Lámina a pantalla completa.

## 08 · Cierre

**Lámina:** Hacé esta prueba hoy.

**Guion:** Apagá tu webhook, mandate un mensaje desde otro teléfono, prendelo y esperá diez minutos. El checklist del webhook está en la comunidad. Nos vemos en el próximo.

**Pantalla / prueba:** Link de la comunidad en la web.

## Tomas de seguridad

- Repetir hook, frase de transición y CTA en una segunda toma.
- Capturar 8–12 segundos limpios de cada pantalla importante.
- Grabar un error real si aparece y explicar cómo se detectó.
- Mantener fuera de cuadro tokens, correos, nombres de clientes y notificaciones.
