# Inventario de IA de Onia — medido en producción el 2-oct-2026 (foto del día)

> ⚠️ Corrección (2-oct, diseño del recall): donde dice que el tratamiento a medias «no está en nada de lo medido», es inexacto. El detector existe (`lib/onia-core/modules/agents-tratamiento-a-medias.ts`, corre en el Recall) pero no encuentra a nadie: solo cuenta EN_PROGRESO, la ficha carga PENDIENTE y producción tiene 0 `patient_treatments`.

> Foto de un día, NO fuente de verdad. Lo que la venta puede decir de la IA vive en `ONIA_CATALOGO_DE_VENTA.md` §8. Medido en solo lectura contra `release-8f07e537` por 5 investigadores; cada capacidad con IA la revisaron 2 escépticos (¿llama de verdad a un LLM? ¿está encendida?).

Medido el 2-oct-2026 contra producción, solo lectura: `onia-platform:release-8f07e537`, mismo árbol que HEAD `8aacaabb`.

## 1. Inventario de IA en producción (release-8f07e537)

**Producto: lo que usa el negocio cliente**

| Capacidad | Usa LLM | Modelo | Qué hace | Para quién | Plan / add-on | Encendida hoy | Uso real | Prueba |
|---|---|---|---|---|---|---|---|---|
| «Proponer un texto» (redactor de los agentes) | sí | gpt-4.1-mini vía el LiteLLM propio (clave `onia-platform-agentes`, tope US$5 cada 30 días) | Escribe UNA plantilla por agente cuando el dueño la pide, con marcadores (`{nombre}`, `{monto}`…). Nunca ve datos de clientes. Pasa un control fijo y el dueño la aprueba una sola vez | Dueño (ADMIN) | Viene con los agentes. Textos por mes: Básico 0 · Crece 50 · Profesional y prueba 150 · Completo y Empresa 400 | sí | 1 llamada en total: 25-sep, cuenta interna, descartada a los 3 s. 0 plantillas aprobadas | `lib/onia-core/modules/agents-plantilla.ts:253` · `plantillas-client.tsx:147` · `AGENTS_LLM=1` en el contenedor · LiteLLM_SpendLogs |
| Agentes Vuelve a citar, Recuerda cobros, Confirma citas, Reprograma y Sigue cotizaciones | no | — | Todos los días a las 07:00 eligen por reglas a quién escribir: 180 días sin volver, saldos vencidos, citas de mañana, citas perdidas, cotizaciones sin respuesta hace 3 días o más. Dejan un borrador con texto fijo para aprobar | Lo aprueba el dueño; el mensaje va al cliente final | Crece, Profesional, Completo, Empresa y prueba, según el rubro | sí | 101 corridas, 0 fallidas, la última el 1-oct. 3 ítems producidos en total | `agents-runtime.ts:2120-2150` · `agents-config.ts:52` (`llm_call` bloqueado) |
| Avisa stock bajo | no | — | Crea una tarea interna de reposición | Dueño | Crece en adelante, en rubros con inventario | sí | 18 corridas, 0 fallidas | `agents-runtime.ts:175-192` |
| Responde consultas (Captador) | no | — | Califica a los interesados con un extractor fijo y propone hasta 3 mensajes | Dueño; el borrador va al interesado | add-on `addon.captador` | no | Ninguna cuenta lo tiene | `agents-leads-logic.ts:1-7` |
| «Enséñale conversando» (editor del agente de WhatsApp) | sí | gpt-4.1-mini vía LiteLLM (clave `onia-bot-motor`, tope US$10 cada 30 días compartido con el motor) | El dueño escribe qué cambiar; el modelo devuelve el conocimiento modificado y se muestra el cambio. No publica nada solo | Dueño (ADMIN con `config.write`) | Sin restricción: todos los planes y la prueba, aun sin el add-on | sí¹ | 0 usos: 0 pedidos en Traefik del 23-sep al 2-oct y ninguna llamada del tamaño del editor en LiteLLM | `app/api/chatbot-knowledge/sugerir/route.ts:55-109` · `editor-sugerir.mjs:68-85` · `ChatbotClient.tsx:735` |
| Entiende fotos y comprobantes | sí | gpt-4.1-mini con imagen (LiteLLM, `onia-bot-motor`) | Describe la foto en una frase y detecta si es un comprobante. Solo se usa en modo recepcionista; en el número de ventas la descripción se descarta | Cliente final del negocio | Add-on WhatsApp / Completo / Empresa | **en duda²** | Funcionó en QA el 29 y el 31-ago. 0 fotos procesadas desde el 24-sep. 0 negocios en modo recepcionista | `vision.mjs:81-97` · mensajes 206 y 231 de Chatwoot |
| Entiende notas de voz | **en duda³** (es voz a texto) | Speaches faster-whisper-small, que no existe en el VPS, con respaldo OpenAI gpt-4o-mini-transcribe | Transcribe el audio; el texto sigue el mismo guion | Prospecto de Onia; ningún negocio cliente | Add-on WhatsApp / Completo / Empresa | **en duda³** | Solo pruebas del 1-ago (5 audios). El respaldo nunca transcribió un audio real | `audio-transcribe.mjs:403-440` · `getent hosts speaches` no resuelve |
| Recepcionista de WhatsApp del negocio | no (sin LLM por diseño) | — | Contesta horarios, servicios y preguntas que cargó el dueño y manda el link de la agenda; el resto pasa a una persona | Cliente final del negocio | Add-on «Agente conversacional de WhatsApp» Bs 390/mes, o incluido en Completo y Empresa | no | 0 negocios conectados; el catálogo lo tiene en pausa | `recepcionista.mjs:1-21` · `ONIA_CATALOGO_DE_VENTA.md:80` |
| «Armemos tu agente», «Probá tu agente» y la publicación del conocimiento | no | — | Asistente de 6 preguntas con lectores fijos, un probador que corre el guion y la publicación de lo que cargó el dueño | Dueño | ADMIN; para servirlo al motor hace falta el add-on | sí | 1 conocimiento publicado, el de Onia interna | `AsistenteChatbot.tsx:6-13` · `preview/route.ts:44-78` · `published/route.ts:39-177` |
| Ayuda «Preguntá por tu negocio» (cómo se hace X) | no | — | Busca palabras clave en 30 fichas fijas; si no llega al umbral contesta «no sé» | Dueño y equipo | Todos, incluida la prueba | sí | 0 pedidos a `/api/ayuda` del 23-sep al 2-oct | `lib/ayuda/buscar.ts:1-8` · `BarraAsistente.tsx:116-121` |
| Ayuda con números | no | — | 4 consultas fijas: cuánto me deben, cobrado hoy, citas de hoy, stock bajo | Dueño; las cifras de plata, solo con permiso de finanzas | Todos | sí | 0 pedidos. La base tiene 0 facturas, pagos, citas e inventario | `lib/ayuda/datos.ts:71-92` · `datos-query.ts:52-149` |
| /help (preguntas frecuentes) | no | — | Índice fijo por rubro | Dueño | Todos | sí | 9 cargas, todas el 25-sep | `lib/ayuda/faq.ts:372` |
| Alta que lee la web del negocio | no | — | Baja hasta 4 páginas y extrae nombre, teléfono, dirección, horarios y servicios; lo que no encuentra queda vacío | Dueño al darse de alta | Todos | sí, reducida: no busca por nombre porque no existen Crawl4AI ni SearXNG | no medido | `lib/onboarding/extraccion/clientes.ts:1-11` |
| Paquete `openai` | no | — | Dependencia que nadie importa. `lib/whatsapp-ai.ts`, que lista el CLAUDE.md, no existe | — | — | no | — | `package.json:43` |

**Bot de ventas de Onia y operación interna (no se venden)**

| Capacidad | Usa LLM | Modelo | Qué hace | Para quién | Plan / add-on | Encendida hoy | Uso real | Prueba |
|---|---|---|---|---|---|---|---|---|
| Respuesta libre fuera de guion (bot de ventas) | sí | gpt-4.1-mini (LiteLLM, `onia-bot-motor`) | Reformula en voseo la pregunta pendiente, en la práctica la del horario, una vez por conversación | Prospecto de Onia | no aplica | sí | 6 de 1.050 respuestas (0,57%), todas en conversaciones de QA. 0 a prospectos reales. Sin tráfico desde el 27-sep | `run-turn.mjs:199-232` · `onia_center.bot_messages` |
| Embudo de ventas por guion | no | — | Califica, da precios, agenda la demo y hace seguimientos | Prospecto de Onia | no aplica | sí | 1.023 respuestas; la última el 27-sep | `intents.mjs:2-4` |
| Hermes (asistente de Sergio Urcullo) | sí | gpt-5-mini / gpt-5-nano (LiteLLM) | Tareas programadas que entrega por Telegram | Sergio Urcullo | — | sí | ≈1.399 llamadas y US$12,33 en 30 días, el 97,6% del gasto de IA. Por Telegram no se conversa con él desde el 8-sep | `/root/.hermes/config.yaml` · `usage_audit.jsonl` coincide token por token con LiteLLM |
| Agentes internos de onia-center (Radar IA, Contenido, CEO, Radar YT, Vendedor, Prospector) | sí | gpt-4.1-mini (LiteLLM, clave maestra) | Clasifican novedades y arman borradores e informes para el panel interno | Sergio Urcullo | — | sí. intake-lead tiene 0 ejecuciones y auditor-write está apagado | En 30 días: 329 llamadas OK y 194 fallidas (9 al 17-sep, sin crédito). US$0,30 | `/opt/onia/ai-news-radar.mjs:278` · `onia_center.ai_radar_items` |
| Alta por extracción con IA (script manual) | sí | gpt-4o-mini | Precarga una cuenta desde una web; lo corre una persona | Interno | — | no: falta Crawl4AI | 7 llamadas, todas el 1-ago | `scripts/alta-por-extraccion.py:108-131` |
| Voz del Telegram Command Center | no (voz a texto) | faster-whisper-small (Speaches, que no existe) | Transcribe las notas de voz de Sergio Urcullo | Sergio Urcullo | — | no | 0 ejecuciones | `/opt/onia/voice-transcribe-run.sh:31` |
| n8n con IA y Chatwoot Captain | no | — | Los 3 workflows con IA están archivados; Captain no está configurado | — | — | no | 0 | n8n: 38 workflows activos, 0 con LLM · Chatwoot: `installation_configs` vacíos |

Gasto de IA en 30 días: US$12,63 en total. De eso, el producto (onia-platform) gastó US$0,0002.

¹ **Enséñale conversando:** 3 de 4 escépticos la midieron encendida. Eso incluye comprobar que el secreto de la plataforma es igual al del motor. El cuarto no pudo leer ese secreto y la dejó como «no medido». Nadie la refutó, pero nunca se hizo una llamada de punta a punta porque gasta tokens.
² **Fotos, en duda:** un escéptico la da encendida porque el código y la clave están vivos. El otro la refuta: solo se usa en modo recepcionista, y hoy ningún negocio está en ese modo. Además, el «Bs 150.00» que leyó en QA es idéntico al ejemplo del prompt (`vision.mjs:29`), así que no se sabe si lo leyó o lo copió.
³ **Voz, en duda:**
- En «usa LLM», un escéptico dice «parcial» y el otro «no». Los dos coinciden en que es un modelo de voz a texto.
- En «encendida», uno midió que la clave de OpenAI es válida (HTTP 200) y el otro no lo pudo medir.
- Ninguno vio transcribir un audio, y el transcriptor principal no existe.

## 2. Qué cambió desde la auditoría del 24-sep

- La auditoría (`codex-continuar-1.0.md:414`, commit `38348a830`) decía «los 6 agentes NO usan ningún LLM». Esa misma noche entró el redactor: `77d8b4c4` (plantilla vía LiteLLM), `40a72424` (cupo por plan), `32dcd9e2` (API) y `fc88be05` (pantalla). Llegó a master con `6fd59525` el 28-sep y está en release-8f07e537. Los agentes pasaron de 0 a 1 pieza con LLM, que se usó una sola vez (cuenta interna) y tiene 0 plantillas aprobadas.
- Bot:
  - El motor pasa a su propia clave con tope (`068931084`, `b9188737c`).
  - `cc2bc2623` saca un caso del LLM.
  - `2b0b22310` hace que el bot deje de presentarse «con IA».
  - `6a9d65b6` renombra el add-on a «Agente conversacional de WhatsApp».

  Lo que el bot le contesta al cliente sigue sin LLM.
- `0c2a33d3` y `383e7d19` bajan promesas en el copy. Aun así, la web sigue diciendo «El sistema con IA que maneja tu negocio» (`app/layout.tsx:72`, un «Con IA» que Sergio Urcullo decidió mantener el 28-sep) y «agentes con IA que te escriben los mensajes» (`:76`).
- Sin cambios:
  - La ayuda nunca tuvo LLM.
  - Speaches, Crawl4AI y SearXNG siguen sin existir en el VPS.
  - El gasto sigue siendo casi todo interno: US$12,63, de los cuales US$12,33 son de Hermes.

## 3. Frases que la venta PUEDE usar hoy

| # | Frase | IA | Prueba | Plan |
|---|---|---|---|---|
| 1 | «Onia te propone con IA el texto de cada recordatorio —cobros, confirmación de citas, pacientes que no vuelven— con el tono de tu negocio. Vos lo revisás y lo aprobás una sola vez.» | sí | `agents-plantilla.ts:253` · pantalla /agents, botón «Proponer un texto» (`plantillas-client.tsx:147`) | Crece (50 textos/mes), Profesional y la prueba (150), Completo y Empresa (400). Básico no |
| 2 | «La IA no ve los datos de tus pacientes: escribe el modelo del mensaje y Onia le pone el nombre, el monto o la hora a cada uno.» | sí | `agents-plantilla.ts:229-244` (al modelo solo le llega el tipo de agente, el negocio y el rubro) · `llenarPlantilla` en `agents-runtime.ts` | Igual que la 1 |
| 3 | «Todas las mañanas Onia revisa tu agenda y tus cobros y te deja anotado a quién escribirle —quien hace 6 meses no vuelve, quien te debe, quien tiene cita mañana— con el mensaje listo. Nada sale sin que vos lo apruebes.» | no | `agents-runtime.ts:140-234` y `:2120-2150` · 101 corridas diarias sin fallas, la última el 1-oct | Crece, Profesional, Completo, Empresa y la prueba; qué agente corre depende del rubro |
| 4 | «Cuando un insumo baja del mínimo, Onia te deja anotada la tarea de reponerlo.» | no | `agents-runtime.ts:175-192` · 18 corridas sin fallas | Crece en adelante, en rubros con inventario |
| 5 | «Preguntale a Onia "¿cuánto me deben?", "¿cuánto cobré hoy?", "¿qué citas tengo hoy?" o "¿qué está bajo el mínimo?" y te contesta con tus números.» | no | `lib/ayuda/datos.ts:71-92` · `datos-query.ts:52-149` · barra «Preguntá por tu negocio» | Todos, incluida la prueba. Lo de plata, solo para quien tiene permiso de finanzas |
| 6 | «Pegá el link de tu página web y Onia te carga nombre, teléfono, dirección, horarios y servicios; vos revisás y completás lo que falte.» | no | `app/api/onboarding/extraer/route.ts` · `lib/onboarding/extraccion/index.ts:51-67` | Todos (es el alta). Solo web propia, no Facebook |

Solo la 1 y la 2 hablan de IA, y fuera de una prueba interna nadie la usó todavía. En esta medición no se miró ninguna de estas pantallas renderizada: antes de publicar una frase, hay que abrir su pantalla con sesión y mirarla.

## 4. Frases que la venta NO puede usar

- «La IA atiende a tus pacientes por WhatsApp y les agenda la cita». El agente que contesta es un guion sin LLM, a propósito (`recepcionista.mjs`, regla 4). Solo manda el link de la agenda y no está conectado para ningún negocio.
- «Agentes con IA que te escriben los mensajes» (hoy en `app/layout.tsx:76`) o «la IA escribe cada mensaje». La IA escribe una sola plantilla por agente si la pedís. Hoy hay 0 plantillas aprobadas, así que todo sale con texto fijo.
- «Agentes con IA que deciden a quién escribir». A quién, cuándo y con qué datos lo deciden reglas fijas (`agents-config.ts:52`).
- «Asistente con IA que responde lo que le preguntes». La barra «Asistente» busca palabras clave en 30 fichas y sabe 4 datos; a todo lo demás contesta «no sé».
- «Te dice cómo te fue en el mes». Solo da cobros y agenda de HOY. Si le preguntás «¿cuánto vendí este mes?», contesta lo de hoy.
- «Entiende las fotos y los comprobantes que te mandan». Está en duda: solo funciona en modo recepcionista, ningún negocio está en ese modo y solo se probó en QA en agosto.
- «Entiende tus notas de voz». El transcriptor principal no existe en el VPS y el respaldo nunca procesó un audio real.
- «Enseñale a tu agente de WhatsApp conversando». El agente de WhatsApp está en pausa en el catálogo (`ONIA_CATALOGO_DE_VENTA.md:80`) y el editor nunca corrió de punta a punta en producción.
- «Recupera a los pacientes con tratamiento a medias». Lo que corre busca a quien no vuelve hace 180 días; lo de tratamiento a medias no está en nada de lo medido.
- «Buscá tu negocio por nombre y la cuenta se arma sola» o «lee tu Facebook». La búsqueda por nombre está apagada porque faltan SearXNG y Crawl4AI, y Facebook no se lee.
- «Ya lo usan clínicas y negocios». Hay 0 pagos de suscripción, las 5 cuentas son internas o de prueba, y el único uso de la IA fue de una cuenta interna.