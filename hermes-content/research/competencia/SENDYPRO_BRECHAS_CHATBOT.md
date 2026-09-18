# SendyPro vs chatbot de Onia — brechas funcionales (2026-09-17)

Fuente primaria: `https://sendypro.com/` (leída hoy, dos pasadas). Corroboración: ficha en Google Play
(`https://play.google.com/store/apps/details?id=com.sendypro.app`) y resultados de búsqueda del 17-sep-2026.
Todo lo no visto en su web se marca. Lo que Onia tiene HOY viene dado por el orquestador, no investigado.

---

## 1) Qué es SendyPro (con evidencia)

Plataforma de chatbot IA **solo para WhatsApp** (API oficial de Meta + conexión alternativa por QR).
Se presenta como "WhatsApp API Oficial + IA con audios realistas | Partner Oficial de Meta". No es
un sistema de gestión: es el bot + un CRM liviano alrededor del chat. Título de su web y toda la
ficha de Play hablan solo de WhatsApp — **no menciona Instagram, Messenger, Telegram ni chat web**.

Capacidades afirmadas en sendypro.com (todas de la home; no tienen página de features separada):

| Capacidad | Evidencia (sendypro.com, 17-sep-2026) |
|---|---|
| WhatsApp API oficial + WhatsApp Business por QR | Planes: "1 API + 1 QR" |
| IA generativa "que responde como vendedor" | Texto de la home; integración OpenAI mostrada como logo |
| Entiende texto, **imágenes y notas de voz** entrantes | Afirmado en la home |
| **Responde con audios** de voz realista, acento LATAM; la IA decide texto o audio | Afirmado en la home; es su titular |
| Memoria conversacional (retiene contexto) | Afirmado en la home |
| Handoff: "la IA decide cuándo entregar a humano" | Afirmado en la home |
| **OCR de comprobantes de pago**: "Valida pagos con OCR, actualiza órdenes y deja trazabilidad" | Cita textual de la home |
| CRM + Kanban: contactos, responsables, etiquetas, historial | Afirmado en la home |
| Campañas: segmentación, personalización, programación | Afirmado en la home |
| Flujos visuales sin código | Afirmado en la home |
| Integraciones: Shopify, Google Sheets, Calendar, Zapier, Webhooks, Meta API | Logos/lista en la home |
| App Android | Ficha viva en Google Play |
| "Usuarios y vendedores ilimitados" | Afirmado en la home |

**Precios publicados** (sendypro.com): Inicial **US$19/mes** — hasta 150 chats/día, 1 API + 1 QR.
Completo **US$39/mes** — chats ilimitados, 1 API + 1 respaldo + 1 QR. "Sin pagar por mensaje".
"Empezar Gratis" como CTA (no publica duración del trial).

**Promesas sin evidencia** (afirmadas, nada verificable en su web):
- "Partner Oficial de Meta" — claim propio; no verificado contra el directorio de partners de Meta.
- "500+ empresas", "99.9% disponibilidad", "respuesta <3 segundos" — cifras de landing sin fuente.
- OCR de pagos y "actualiza órdenes" — solo texto de marketing; la demo pública es un video en Google Drive, no probado.
- "Usuarios y vendedores ilimitados" — no describe asignación de conversaciones ni bandeja compartida real.
- No menciona plantillas HSM de WhatsApp (necesarias para iniciar conversación fuera de 24h) — o las omite o las esconde; sin ellas las "campañas" a base fría no son posibles bajo la API oficial.
- País/empresa detrás: no publicado en su web. No se pudo verificar que sea boliviana.

---

## 2) Brecha por brecha

Veredictos: **CRÍTICO** = te lo preguntan en la demo y perdés la venta sin eso · **NICE** = suma pero no decide · **NO APLICA** = el modelo de Onia (sistema de gestión + bot add-on) lo cubre por otro lado o no lo necesita.

| Capacidad | SendyPro tiene | Onia tiene HOY | Veredicto |
|---|---|---|---|
| Entender **notas de voz** entrantes | Sí (afirmado) | No (no está en la lista) | **CRÍTICO** — el cliente boliviano manda audios, no texto |
| Entender **imágenes** entrantes | Sí (afirmado) | No | **CRÍTICO** — va junto con comprobantes y fotos de productos |
| **Responder con audio** (voz LATAM) | Sí — es su titular de venta | No | NICE con asterisco: es diferenciador de marketing de ellos, no necesidad del dueño |
| **OCR de comprobantes / validación de pagos** | Afirmado (promesa sin demo) | No | **CRÍTICO en Bolivia** — QR + captura por WhatsApp es CÓMO se paga acá; y Onia puede registrarlo en el ERP, SendyPro no |
| **Campañas / broadcast** (segmentar, programar) | Sí (afirmado) | No | **CRÍTICO** — reactivación de clientes es el ROI más fácil de mostrar |
| Plantillas HSM para iniciar conversación | No lo menciona | No | Empate — pero quien las tenga primero habilita campañas legales fuera de 24h |
| Flujos visuales sin código | Sí | No | **NO APLICA** — el pitch de Onia es "escribís el conocimiento y ya"; un flow-builder es el modelo viejo |
| CRM + Kanban de contactos | Sí (liviano, alrededor del chat) | El sistema de gestión ENTERO por rubro | **NO APLICA** — ventaja de Onia; SendyPro tiene una libreta, Onia tiene el negocio |
| Memoria conversacional | Sí (afirmado) | Generativo LLM propio (contexto no confirmado en la lista dada) | Verificar en el propio motor; si no retiene contexto, es CRÍTICO |
| Handoff a humano | "La IA decide cuándo entregar" | Sí, vía Chatwoot | Empate |
| Multi-agente ("vendedores ilimitados") | Afirmado sin detalle | Chatwoot lo da | Empate/NICE |
| Canales además de WhatsApp | **No tiene** | Chat web vivo; IG/Messenger detrás de bandera | **Ventaja Onia** — único punto donde Onia gana en canales |
| WhatsApp por QR (sin API, alta en minutos) | Sí | No (conexión Meta pendiente) | NICE — baja fricción de alta, pero es zona gris con Meta; no copiar sin decidirlo |
| Catálogo de productos en el bot | No propio (solo integración Shopify) | No | Empate — nadie lo tiene nativo |
| Integraciones (Sheets, Calendar, Zapier, webhooks) | Sí | El bot vive dentro del sistema Onia | NO APLICA mayormente; agenda sí importa (el sistema ya la tiene como destino natural) |
| App móvil | Android | No | NICE |
| Métricas / reportes | Mención suelta de "reportes", sin sección | Métricas básicas de uso | Empate — nadie muestra analytics serio |
| Cupo | 150 chats/DÍA por $19; ilimitado por $39 | 500 conversaciones/MES | **Duele en la comparación directa**: su plan barato da ~9x el cupo de Onia |
| Precio publicado | $19 / $39 al mes, "sin pagar por mensaje" | Bs 390/mes (add-on) | A tipo paralelo (~11,4 Bs/USD) Bs 390 ≈ $34: queda entre sus dos planes, con MENOS features de chat. El argumento de Onia tiene que ser el sistema, nunca el bot solo |

---

## 3) Las 3 brechas que más duelen para un dueño de negocio boliviano

**1. Notas de voz — entender audios entrantes (y opcionalmente contestar con audio). Esfuerzo: M.**
En Bolivia el cliente final manda audios. Un bot que responde "no entiendo audios" muere en el
primer mensaje real, y SendyPro lo puso de titular. STT ya existe en la infra de Onia (Speaches en
el VPS); el trabajo es cablear el audio entrante del canal WhatsApp/web al motor. Responder con
audio es fase 2 (la voz ya existe en ElevenLabs) — no es lo urgente; entender sí.

**2. Comprobante de pago por foto → validado y registrado en el sistema. Esfuerzo: M-L.**
El pago boliviano es QR + captura enviada por WhatsApp. SendyPro lo PROMETE (sin demo pública);
Onia puede hacerlo VERDAD y mejor: el comprobante no solo se "valida", se asienta contra la cita,
la orden o la factura en el ERP — cosa que SendyPro estructuralmente no puede. Es la brecha donde
cerrar convierte una debilidad en el argumento de venta contra ellos. M para leer/extraer con visión
LLM + confirmación humana; L si se quiere matching automático contra cobros del sistema.

**3. Campañas/broadcast segmentado. Esfuerzo: M.**
"Mandale una promo a todos mis clientes de este mes" es lo primero que pide un dueño cuando ya
tiene el bot. Onia tiene la mejor materia prima (los clientes ya viven en el sistema, segmentar por
rubro/historial es un query), pero falta: plantillas HSM aprobadas + UI de envío + respeto de la
ventana de 24h. Sin la conexión Meta cerrada (pendiente hoy) esto está bloqueado río arriba — la
conexión Meta es el prerequisito de esta brecha y de la mitad de la tabla.

**Nota de pricing, sin ser brecha funcional:** el bot de Onia a Bs 390 compite contra $19-39 con
cupo 9-∞x mayor. Vender el bot SOLO contra SendyPro se pierde por precio y por features; se gana
únicamente vendiendo el sistema con el bot adentro. Coincide con la regla vigente: el sistema es la
oferta, el bot es add-on.

---

## Corrección del orquestador (verificado contra el MOTOR VIVO, 18-sep 00:00)

El comparativo de arriba usó una descripción conservadora de Onia. Contra el motor real
(`/opt/onia/bot` en el VPS, verificado por imports cableados en `chatwoot-adapter.mjs`):

- **Notas de voz entrantes: Onia YA las entiende** (`audio-transcribe.mjs`, cableado al turno;
  transcripción vía Speaches propio). La brecha (a) NO existe como tal — queda solo la mitad
  "responder CON audio" (SendyPro lo tiene como titular; Onia contesta texto).
- **Imágenes entrantes: Onia YA las describe** (`vision.mjs`, cableado con fail-open al turno).
  La brecha (b) se reduce a: OCR de comprobante ATADO a validar el pago de una orden — y ahí
  Onia puede ganar porque el pago vive en su ERP (`bcp-qr.mjs` ya existe en el motor).
- Brechas reales restantes, en orden para un dueño boliviano: **1) responder con audio** (M),
  **2) validación de comprobante ligada a orden/factura** (M, con ventaja estructural nuestra),
  **3) campañas/broadcast** (L — bloqueada río arriba por la conexión Meta del cliente, DG-051).
