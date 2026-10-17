# W1 · Widget de chat web propio de Onia (sin «Powered by Chatwoot»)

Lanzada por la madre el 8-oct. Rama `codex/widget-propio`, creada desde `origin/master` de onia-platform.

## META
Sergio Urcullo (8-oct): «no quiero que diga powered by chatwoot, todo propio». Hoy el chat web usa el widget de Chatwoot
en dos lugares:
1. el canal web de cada cliente: `app/api/chatbot-canal-web/route.ts` le entrega el `website_token` y el cliente pega el
   SDK de Chatwoot (`/packs/js/sdk.js`) en su sitio;
2. el sitio de Onia: `web-factory/apps/onia-platform/src/lib/chat-diferido.ts`, que está en el repo onia-hermes y NO se
   toca en esta tarea.

Ese widget muestra «Powered by Chatwoot», y quitarlo es una función paga de Chatwoot (`config/features.yml`,
`disable_branding: premium`). La solución es un widget PROPIO hecho sobre la **Client API** de Chatwoot, que es MIT y
está documentada en `developers.chatwoot.com/api-reference`: crear el contacto, la conversación, mandar y leer mensajes
con `inbox_identifier` y `contact_identifier`.

## Lo que se hace
1. **`public/onia-chat.js`:** un script que el cliente pega con una sola línea y que dibuja una burbuja de chat de Onia.
   - El script:
     - ocupa menos de 15 KB y no trae dependencias;
     - carga diferido, sin bloquear la página;
     - tiene la marca de Onia y el color configurable;
     - le habla de USTED al visitante.
   - Habla con la Client API **a través de nuestro proxy**, sin exponer tokens de administración.
2. **Proxy en `app/api/chat-publico/[...ruta]/route.ts`:** reenvía a Chatwoot solo los endpoints de la Client API
   (contacto, conversación y mensajes) del inbox del cliente:
   - valida el `inbox_identifier` contra la organización;
   - tiene límite de pedidos por IP;
   - nunca reenvía la Application API.
3. **Tiempo real:** sondeo cada 4 s mientras el chat está abierto y nada con el chat cerrado. El websocket queda para
   después.
4. **`chatbot-canal-web`:** el snippet que se le muestra al cliente pasa a ser el de `onia-chat.js`. El `website_token`
   no se mostrará más, pero sigue en la base para no romper los sitios que ya lo pegaron.

## PRUEBA DE HECHO
- Tests del proxy:
  - rechaza un `inbox_identifier` ajeno;
  - corta por límite de pedidos;
  - no reenvía rutas de la Application API.
- Tests del script: arma la burbuja, manda y recibe un mensaje (con fetch simulado) y no hace pedidos con el chat
  cerrado.
- En todo el diff no aparece «Chatwoot» en nada que vea el visitante (un `grep` en el texto del widget).

## REGLA DE PARADA
- No toques `web-factory/` (es otro repo) ni el inbox interno.
- Nada de dependencias nuevas, `npm install` ni `prisma generate`.
- Si la Client API no alcanza para algo, anotalo en el resumen; no uses la Application API desde el navegador.
