# Onia — Automatizar comentarios/DMs de IG y TikTok (research 2026-08-02)

> Pregunta de Sergio: ¿vemos ManyChat? ¿O cómo respondemos automático
> comentarios de IG/TikTok, con seguimiento y envío de archivos — mejor open
> source o construido por nosotros?
> Research: workflow 4 agentes (ManyChat, API oficial de Meta, TikTok, open
> source), fuentes citadas en cada punto. Resumen ejecutable acá.

## 0. Veredicto

1. **Instagram: se construye en casa, gratis.** ManyChat en IG es empaque
   sobre APIs PÚBLICAS de Meta (Private Replies + Messaging API). Todos sus
   límites son límites de Meta que nadie esquiva. Ya tenemos el 90% del
   stack: Chatwoot (canal IG oficial para DMs) + n8n (comment-to-DM, hay
   template oficial) + nuestro motor de bot.
2. **TikTok: no hay puerta propia.** La API de DMs/comentarios de TikTok es
   solo para partners aprobados (ManyChat, GoHighLevel…). No existe open
   source legítimo; lo que hay es scraping = ban en días. Si algún día se
   quiere TikTok-DM-bot, se ALQUILA un partner; mientras, TikTok es imán que
   deriva a WhatsApp.
3. **ManyChat solo se justificaría por TikTok** ($14–29/mes) — y ni ellos
   tienen comment-to-DM en TikTok todavía (solo DMs por keyword).

## 1. ManyChat por dentro

| Qué | Dato (verificado 2026-08-02) |
|---|---|
| IG comment-to-DM | Keyword en comentario → reply pública (rotada) + 1 DM privado. Es la función oficial "Private Replies" de Meta |
| Límites (de META, no de ManyChat) | 1 private reply por comentario, ≤7 días; solo dispara con el PRIMER comentario del usuario por post; el DM no abre ventana — recién si el usuario responde hay 24 h de conversación libre |
| TikTok | Solo DMs por keyword (cuenta Business; EU/UK bloqueados; comment-to-DM "coming soon"). Vía TikTok Business Messaging API, acceso SOLO partners |
| Pricing (reestructura mar-2026) | Free 25 contactos/mes (sandbox, inservible con un reel viral) · Essential $14/250 · Pro $29/2.500 (AI incluido) · Business $69/7.500. Overage ~$0.018–0.025/contacto |
| Qué NO es replicable | Solo su acceso partner a TikTok y el flow-builder visual. Todo lo de IG/WA es API pública |

## 2. Lo que Meta permite oficialmente en Instagram (2026)

- **Webhook `comments`** en posts/reels propios + responder público via API
  (`POST /{comment_id}/replies`), ocultar y borrar.
- **Private Replies**: DM automático en respuesta a un comentario
  (`POST /messages` con `recipient={comment_id}`). 1 por comentario, ≤7 días.
  Cap ~750/hora.
- **Messaging API**: responder DMs con texto, links, **hasta 10 imágenes,
  audio, video y PDF** (sí manda archivos), quick replies (13), ice breakers
  (4), persistent menu. Ventana de 24 h desde el último mensaje del usuario.
- **Seguimiento en frío: NO EXISTE en IG.** No hay plantillas estilo
  WhatsApp; human_agent (7 días) es SOLO para respuesta humana manual —
  usarlo con bot viola política. Conclusión estructural: **el nurturing vive
  en WhatsApp; IG captura y deriva.**
- **La llave que nos regalaron:** con "Instagram API with Instagram Login"
  (sin página de FB) y **Standard Access alcanza para automatizar la CUENTA
  PROPIA** (@oniahq) sin App Review. El App Review (Advanced Access) recién
  hace falta para operar cuentas DE CLIENTES — y nuestra Business
  Verification aprobada (31-jul) ya cubre su prerrequisito más lento.
- **Chatwoot v4.x** (el nuestro: v4.12.1 ✓) trae canal Instagram oficial
  (DMs, story replies, menciones — NO comentarios): pide Meta App propia
  (`INSTAGRAM_APP_ID/SECRET/VERIFY_TOKEN` en super_admin) .

## 3. TikTok — la verdad completa

- developers.tiktok.com NO tiene endpoints de comentarios/DMs (solo perfil,
  publicar video, y Research API para académicos).
- Los endpoints reales (business-api.tiktok.com: comment/list, comment/reply,
  direct messages) exigen ser partner/anunciante aprobado — inalcanzable para
  agencia chica; se alquilan vía ManyChat, GoHighLevel (único con reply de
  comentarios hoy), respond.io, Chatfuel.
- Reglas duras de los DMs: el negocio NUNCA inicia; ventana 48 h / 10
  mensajes. Follow-up en frío imposible por diseño.
- Open source: solo scraping no oficial (TikTok-Api, auto-commenters con
  proxies) = ban en días u horas. **Prohibido para cuentas de Onia o
  clientes.**
- Bolivia: no está en ninguna lista de exclusión, pero ninguna fuente la
  confirma — probar con cuenta real antes de prometer nada.
- **Plan realista TikTok:** CTA en videos/bio → "escribinos al WhatsApp" (o
  DM manual). Partner pago solo si el volumen de DMs lo justifica algún día.

## 4. Open source — el mapa (verificado)

| Proyecto | Estado | Sirve |
|---|---|---|
| **Chatwoot** (ya nuestro) | v4.12.1, activo | DMs IG oficiales al mismo inbox del bot ✔ |
| **n8n** (ya nuestro) | templates 16300/15206 | comment-to-DM oficial listo para adaptar ✔ |
| **OpenReply** (MIT, 753★, push 31-jul) | activo | Clon ManyChat comment-to-DM serio: keywords, follow-gate, botones, CTR, multi-cuenta, cola respetando el cap de Meta. Base ideal si esto se vuelve PRODUCTO |
| Typebot | ya no es OSS pleno (FSL) | no tiene IG — descartar |
| Botpress self-hosted | MUERTO (v12 sunset) | descartar |
| ZernFlow | depende de API paga de terceros | descartar |

## 5. Plan Onia (construido por nosotros, $0 en software)

**F0 — Cuenta propia @oniahq (sin App Review, esfuerzo ~medio día):**
1. Meta App tipo Business + producto Instagram (Instagram Login). La cuenta
   IG de Onia (profesional) se agrega con rol en la app → Standard Access.
2. Canal Instagram en Chatwoot (App ID/Secret/verify token en super_admin)
   → los DMs de IG caen al MISMO inbox donde ya atiende nuestro motor: el
   bot responde DMs de IG igual que la web (respetando 24 h, sin plantillas).
3. Workflow n8n comment-to-DM (base: template oficial 16300): comentario con
   keyword ("PRECIO", "INFO", "DEMO") → reply pública + private reply con 1
   mensaje + botón → si responde, sigue el bot en Chatwoot.
4. Regla de oro del flujo: **capturar y derivar a WhatsApp** (el número
   nuevo) — porque el seguimiento en frío solo existe allá.

**F1 — Producto vendible (requiere App Review con nuestra verificación):**
Advanced Access (`instagram_business_manage_messages/comments` + Human
Agent) → operar cuentas de clientes. Evaluar deploy de OpenReply en el VPS
como panel multi-cuenta en vez de reinventarlo. Entra al catálogo de
chatbots como add-on "Comment-to-DM Instagram" (setup + mensual).

**F2 — TikTok (parqueado):** solo vía partner pago, cuando el volumen lo
justifique. Nada de scraping, nunca.

## 6. Qué necesito de Sergio para F0

1. Acceso/login de la cuenta IG @oniahq (y que sea cuenta profesional).
   Ojo: IG fue desvinculado del Centro de cuentas durante la pelea del
   número — hay que re-vincular o confirmar su estado.
2. OK para crear la Meta App "Onia" en developers.facebook.com (mismo
   Business Manager verificado).
3. Decidir las keywords de arranque (sugiero: PRECIO, DEMO, INFO).

Sin gasto: todo corre en el VPS con lo ya instalado.
