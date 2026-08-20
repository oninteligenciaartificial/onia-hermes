# Onia — Cambio total de número del negocio (plan, 2026-08-01)

> Decisión de Sergio (2026-08-01): el número nuevo pasa a ser EL número del
> negocio. Entra directo a Cloud API oficial (WABA verificada); el bot lo
> atiende 24/7 y Sergio opera los handoffs desde el celular con la app de
> Chatwoot. El 78491375 queda como línea personal (app intacta, la línea NO
> muere) y la disputa con Meta sigue como fallback sin urgencia.
> Research con fuentes: workflow 2026-08-01 (4 agentes, docs oficiales).

## 1. Día D — alta del número (cuando Sergio pase el chip, 2026-08-02)

Prerrequisito del chip: recibe SMS/llamadas y **NUNCA tocó la app de
WhatsApp** (regla dura: si la app lo registra, hay que borrar la cuenta antes
de poder usarlo en la API). Fuente: developers.facebook.com/documentation/
business-messaging/whatsapp/business-phone-numbers/phone-numbers.

1. WhatsApp Manager (`business.facebook.com/wa/manage`, portfolio OniaAgency
   1451773736711697, WABA verificada 1730104971691715) → Account tools →
   Phone numbers → **Add phone number**: display name **"Onia"** (calza con el
   nombre legal/branding; nada de "official", genéricos ni URLs), zona horaria
   **America/La_Paz**, categoría.
2. Verificación de propiedad: SMS al chip → Sergio pasa el OTP de 6 dígitos.
3. Display name puede quedar `PENDING_REVIEW` (típico minutos a 1–3 días
   hábiles, dato de partners, sin SLA oficial). Se consulta con
   `fields=name_status`.
4. **Registro final** (sin esto el número no opera): fijar PIN de verificación
   en dos pasos + `POST /PHONE_NUMBER_ID/register` (o toggle "Registered").
5. Token permanente de system user + `phone_number_id` → **Chatwoot → Add
   Inbox → WhatsApp (Cloud API)**. El webhook de la cuenta (id 2) ya cubre el
   inbox nuevo → el bot atiende al instante.
6. CTA de la web al número nuevo: `NEXT_PUBLIC_WA_PHONE=<numero>` en el build
   de la landing + redeploy (`swap-and-verify.sh`). Es build-time.
7. Prueba real punta a punta desde otro número: entrante → M0 → calificación
   → horario → reserva en Cal.com.
8. Plantillas (las 4 del catálogo §plantillas) cuando esté el método de pago.

Datos económicos y de límites (docs oficiales de Meta, 2026):
- **Responder es gratis e ilimitado**: mensajes entrantes + respuestas de
  formato libre dentro de la ventana de 24 h no pagan nada y están excluidos
  de los límites de mensajería. El bot (que solo responde) opera gratis.
- Plantillas: utility/auth dentro de ventana gratis; fuera de ventana se paga
  por mensaje; marketing se paga siempre. Método de pago recién ahí.
- Límite business-initiated: **por portfolio** — con la verificación aprobada
  el piso es 2.000 usuarios únicos/24 h y escala solo (10k → 100k → ∞).
- Reversible: se puede des-registrar de Cloud API y usar el número en la app
  después (salvo 30 días de espera si mandó mensajes pagos recientes).
- **Coexistencia NO aplica a un chip nuevo** (exige cuenta activa previa en la
  app, ~7+ días según partners) y su disponibilidad en Bolivia sigue sin
  confirmación oficial — otra razón por la que Cloud API directo es el camino.

## 2. Manejo desde el celular — app de Chatwoot (self-hosted)

Estado del VPS verificado 2026-08-01: Chatwoot **v4.12.1** (requisito de la
app móvil: ≥3.13 ✓); sidekiq estaba en v4.9.1 y se alineó a v4.12.1 (ese
worker despacha los push); **push relay activo por default** (ninguna var
FIREBASE/FCM seteada = la app oficial recibe push vía relay de Chatwoot).

Setup de Sergio (5 minutos, una sola vez):
1. Instalar **"Chatwoot"** (app oficial, gratis) de Play Store / App Store.
2. URL de instalación: `https://onia-chatbot-chatwoot.hqdqgh.easypanel.host`
   → Connect → login con su email/password de agente (SSO/Google NO funciona
   en self-hosted; necesita password propio).
3. Perfil → notificaciones push: activar "conversación creada", "asignada a
   mí" y "mención".
4. Prueba: mensaje al widget de la web → debe sonar el celular con la app
   cerrada.

Qué puede hacer desde la app: ver TODOS los inboxes (web + WhatsApp) en una
sola lista, responder en tiempo real, asignarse conversaciones, respuestas
predefinidas, notas privadas, adjuntos, marcar resuelto. El flujo con el bot:
el bot atiende solo; cuando deriva a humano (o cuando Sergio quiera meterse),
le suena el celular, abre la conversación y responde — el prospecto lo recibe
por WhatsApp como un mensaje más del número Onia.

Limitaciones conocidas (issues abiertos del repo móvil): administración
(crear inboxes, automatizaciones, reportes) es solo dashboard web; el estado
"Online" del agente puede caer con la app en background (los push llegan
igual). Los push viajan por el relay de Chatwoot (dependencia externa
aceptada; la alternativa es compilar app propia con Firebase).

## 3. Checklist legal Bolivia — cambio del teléfono del negocio

Contexto que quita presión: **la línea 78491375 NO muere** (queda personal de
Sergio), así que ningún OTP/verificación vieja se rompe. Los trámites son de
coherencia registral, ambos gratis y online, sin plazo perentorio en días.

> **CORRECCIÓN 2026-08-02 — recomendación: NO cambiar el teléfono en SIAT ni
> SEPREC.** Al decidirse el cambio total se asumió que el registro debía
> seguir al número nuevo. Repensado, es al revés: lo que el registro pide es
> el **teléfono de contacto del comerciante**, y ese sigue siendo el
> 78491375 — la línea real de Sergio, donde **contesta un humano** y llegan
> SMS/llamadas del Estado. El número nuevo es una línea de bot: no tiene app,
> nadie atiende una llamada de voz ahí. Poner en el padrón un número que
> nadie contesta es peor que no cambiarlo: un fiscalizador que llame no
> encuentra a nadie. Y no hay nada falso — un negocio puede tener su línea de
> contacto y su canal comercial de atención en números distintos.
>
> **Regla vigente:** SIAT y SEPREC se quedan con el 78491375; el número nuevo
> es el canal comercial público (web, IG, tarjetas, Google). Los trámites de
> abajo quedan documentados por si algún día se quiere coherencia registral
> (o si Sergio deja de usar el 78491375), pero HOY no se hacen.

| # | Dónde | Trámite | Costo | Quién | Notas |
|---|-------|---------|-------|-------|-------|
| 1 | SIN / SIAT | SIAT en Línea → Registro Nacional de Contribuyentes → **Modificación de Datos** (RND 102500000017, art. 11) | Gratis | Credenciales del NIT 5371375010 | 100% online para datos de contacto; verificar también que el correo esté vigente (el canal FORMAL del SIN es el correo + Buzón Tributario, no el celular). Multa teórica por padrón desactualizado: 150 UFV (~Bs 365, RND 10-0033-16 anexo I 1.2 — monto a reconfirmar en fuente oficial antes de citarlo a terceros) |
| 2 | SEPREC | **Trámite 46 "Cambios Operativos"** en tramites.seprec.gob.bo | Gratis (unipersonal) | **Ciudadanía Digital de LESLIE** (propietaria registral) | Requiere matrícula RENOVADA; certificado con QR en 24 h hábiles; declaración jurada; para teléfono no hay publicación en Gaceta |
| 3 | Ciudadanía Digital | Actualización de datos (si estuviera atada al 78491375) | Gratis | Titular | NO urge: la línea vieja sigue recibiendo SMS. Decidir con calma si migra |
| 4 | Banco (BCP/BNB) | Actualizar celular de banca móvil / token / avisos QR | Gratis | Titular de la cuenta | Hacerlo ANTES si algún día se da de baja la línea vieja |
| 5 | Municipio (SCZ) | Datos de contacto de licencia de funcionamiento | s/d | — | Baja prioridad; según municipio |
| 6 | Web + legal | Pie legal, `NEXT_PUBLIC_WA_PHONE`, privacidad/términos, tarjetas, bio IG | — | Yo (código) / Sergio (perfiles) | El día D |

**Orden vigente:** solo el punto 6 (canal comercial) el día D. Los puntos 1 y
2 quedan congelados por la corrección de arriba; 3/4/5 no aplican mientras el
78491375 siga vivo en manos de Sergio. Base legal del deber de actualizar
(por si algún día aplica): Ley 2492 art. 70.2 y Código de Comercio art. 30
(sin plazo en días para teléfono; el "30 días" que circula en blogs es del
cambio de domicilio bajo el régimen viejo PBD-11).

## 3.bis Qué pasa con el 78491375 (decidido 2026-08-03)

**Contexto:** el 2026-08-02 Meta respondió el escalamiento del ticket con OTRA
respuesta automática ("no se revisarán las respuestas a este correo") —
ticket 1432944055330559. El canal de soporte de consumidor está **cerrado**.
La disputa formal de administrador sigue abierta pero ya no se espera nada de
ella: no bloquea, no cuesta, se deja correr.

**Problema real que plantea Sergio:** dos números de Onia circulando = la
gente no sabe a cuál escribir. Correcto, hay que consolidar en uno.

**Plan de transición (NO borrar de golpe):**

1. **Primero encender el número nuevo** y que el negocio corra ahí.
2. **El 78491375 pasa a ser REDIRECTOR, no una tumba.** Borrarlo de una crea
   silencio: quien lo tenga agendado escribe y no llega nada, y concluye que
   Onia desapareció. En vez de eso: migrar ese número a la app **WhatsApp
   Business** (gratis, conserva los chats) y poner **mensaje de ausencia
   automático 24/7**: *"Este número ya no atiende. Escribinos al +591
   7XXXXXXX"*. Un redirector automático resuelve la confusión MEJOR que el
   borrado. Cambiar también el nombre del perfil a algo como
   `Onia → escribir al 7XXXXXXX`.
3. **Después de 4–8 semanas** (cuando ya casi nadie escriba ahí), borrar la
   cuenta si Sergio quiere. Ahí el costo de perder los chats es mínimo.
4. **Al borrar, se prueba gratis una hipótesis:** si el bloqueo era de capa
   app, borrar la cuenta libera el número y podría agregarse a nuestra WABA.
   Si el bloqueo es del portfolio fantasma (lo más probable), el error
   persiste. No se pierde nada por probar EN ESE MOMENTO — pero no antes,
   porque hoy el costo (perder chats + perder el redirector) es mayor que la
   probabilidad de éxito.

**La línea telefónica NO se da de baja** en ninguno de los pasos: sigue siendo
la línea de Sergio, recibe llamadas y SMS, y sostiene los OTP del Estado.

**Efecto sobre los trámites:** mientras Sergio conserve esa línea y conteste
ahí, SIAT y SEPREC pueden quedarse con el 78491375 (ver corrección de §3) —
cero trámites. Los trámites de abajo se hacen SOLO si algún día da de baja la
línea o si prefiere coherencia total. Si decide hacerlos, el bloqueo a
resolver primero es que **el Trámite 46 de SEPREC exige la Ciudadanía Digital
de LESLIE** (propietaria registral), no la de Sergio, y matrícula renovada.

## 4. Advertencias

- **El chip jamás toca la app de WhatsApp.** Ni "para probar". La app lo
  captura y volvemos al pozo del 78491375.
- Mantener el chip vivo: recarga pequeña cada 2–3 meses (si la telefónica
  recicla la línea, otro dueño podría re-registrar el número).
- El display name "Onia" puede tardar 1–3 días en aprobarse; el número opera
  mientras tanto pero conviene esperar la aprobación antes de imprimirlo en
  material comercial.
- En Meta Business NO tocar los datos del portfolio verificado (la
  verificación aprobada no se re-abre por gusto); el número de la WABA es un
  activo aparte de la info de verificación.
- La disputa por el 78491375 sigue viva (caso 1047562948135567): revisar
  `business@onia.com.bo` a diario igual — si se gana, el número vuelve entero
  como línea personal.
