# AgendaPro y Citalo: cómo funcionan por dentro

> Mirado el 2026-10-01 en sus webs y centros de ayuda públicos, sin crear cuentas ni llenar formularios.
> Capturas en `agendapro-citalo/`. Cada afirmación lleva su fuente entre corchetes: **[AP-x]** o **[CI-x]**,
> y las fuentes están al final. Lo que es **inferencia** mía está marcado como tal.
> Lo de Onia sale de `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` (medido el 1-oct).

## 0. Dos datos que corrigen el pedido

- **Citalo hoy NO ofrece 14 días de prueba.** Tiene un plan **Free para siempre**: 25 citas al mes, 1 empleado y
  0 mensajes de WhatsApp [CI-precios][CI-registro]. **No encontré el «-40 % de ausencias»** en ninguna página.
  Sus cifras de no-show aparecen borradas («de forma relevante») y el único número que queda es el de su caso
  de éxito: **62 → 31 turnos perdidos por mes (−50 %)** [CI-caso]. Ese dato vendría de un anuncio o de una versión
  vieja de la web; en la Biblioteca de Anuncios de Meta no apareció nada útil.
- **AgendaPro no tiene página de Bolivia.** Sus países son CL, MX, AR, CO, PE, UY y ES [AP-sitemap], y el pago en
  línea solo funciona en CL, AR, MX, UY, CO y PE [AP-pagofaq]. **Citalo cobra con MercadoPago** [CI-pagos], que no
  opera en Bolivia (inferencia). Resultado: **ninguno de los dos puede cobrar online en Bolivia.**

## 1. AgendaPro (Chile, YC) — módulo por módulo

| Módulo | Cómo funciona |
|---|---|
| **Agenda** | Por profesional y por recurso, con bloqueos y estados de reserva (el celeste es «reservado», sin confirmar). Sincroniza con Google Calendar en el plan Solo [AP-ayuda-wa][AP-sitemap-ayuda]. Tiene app móvil nativa y un marketplace de consumidores: más de 20.000 negocios y 150 M de citas [AP-home]. |
| **Reserva online** | Sitio de reservas 24/7 con link propio. Integra Google Reserve, Instagram y Facebook («LinkPro»). Configura cuántas horas antes se puede editar o cancelar y cuántas veces se puede reagendar [AP-email][AP-home]. |
| **Recordatorio y confirmación por WhatsApp** | Conviven **tres sistemas**. **(a) Paquetes clásicos:** desde CLP 5.000/mes + IVA por 50 mensajes, unos CLP 100 por mensaje [AP-planes]. La plantilla es **fija, no editable, y lleva el logo y la leyenda de AgendaPro** [AP-ayuda-wa]. Sale **después** del recordatorio por email y **solo si la cita sigue sin confirmar**. El cliente confirma, cancela o reagenda desde el mensaje. Todo indica que sale del número de AgendaPro (inferencia). **(b) Julia y Sofía (IA):** usan **tu propio número**, conectado a la **API oficial de Meta** con el alta embebida (*Embedded Signup*). Pide Business Manager, código por SMS y un QR, y el dueño sigue usando la app de WhatsApp Business (coexistencia). **Meta cobra cada plantilla directo en la tarjeta del negocio**, y para tener límites altos hay que verificar el negocio en Meta [AP-julia-conectar][AP-julia-pago][AP-julia-verif]. El precio de Sofía no está publicado: se pide demo [AP-sofia-lp]. **(c) Manual gratis:** plantillas propias que se mandan con un clic desde la cita, a través de WhatsApp Web [AP-plantillas]. |
| **Recall / inactivos** | **Charly**, que cuesta desde CLP 149.900/mes y «solo pagás si funciona» [AP-planes]. Detecta clientes que hace tiempo no van o que nunca fueron y les **manda un email automático cuando «ya le toca» la siguiente sesión**. Además lanza una «campaña relámpago» cuando prevé un día con poca ocupación [AP-charly]. Aparte tiene una tarjeta de sellos digital gratis en la app del consumidor: el sello se suma al marcar «Asiste» [AP-sellos]. |
| **Caja y cobros** | Caja con abonos y pagos parciales, presupuestos, comisiones y POS propio. Para Chile vende una terminal física: CLP 60.000 más una tasa de 2,49 % [AP-planes]. El pago online, el link de pago y la seña cobran 2,99 % + CLP 100 [AP-pagofaq]. Factura y boleta electrónica (SII) desde 2 UF/mes [AP-planes]. |
| **Ficha** | Fichas configurables por categorías y campos (texto, número, obligatorio). **Se pueden generar con IA o desde un PDF.** Tienen firma del profesional, consentimiento informado y exportación masiva. Disponible **solo desde el plan Premium** [AP-ficha][AP-planes]. |
| **Reportes** | Reservas por estado, por hora y día (horas pico y valle), por local, por servicio y por prestador, con ocupación estimada. Se descargan a Excel [AP-reportes]. «Reportes de ventas con IA» [AP-home]. |
| **IA** | **Julia** contesta el WhatsApp y agenda con los datos de servicios, profesionales y descripciones [AP-julia-info]. **Sofía** recuerda, confirma y reagenda: «detecta silencios, reabre la conversación y propone horarios hasta confirmar» [AP-sofia]. Tiene además una ficha generada por IA. |
| **Marketing** | Email marketing con editor y temas: 500/1.000/2.000/5.000 correos al mes según el plan [AP-planes][AP-campana]. Audiencias, reportes de campaña, email de cumpleaños, encuestas y giftcards (desde Premium). Meta Pixel y GA4 en el plan Pro. Por WhatsApp, Julia hace campañas pagadas por plantilla [AP-julia-pago]. |
| **Precio (CL, + IVA)** | Individual CLP 15.900 · Básico 34.900 · Premium 54.900 · Pro 249.900 al mes. El precio sube con un selector de cantidad de profesionales. El anual regala 2 meses [AP-planes]. |

**Onboarding de AgendaPro** (capturas `agendapro-home.png`, `agendapro-signup.png`, `agendapro-sofia-lp.png`):
1. En la landing, «Prueba gratis» o «Crea tu cuenta gratis» llevan a `/cl/signup`.
2. Un solo formulario: tipo de negocio, cuántos profesionales, nombre, email, teléfono y contraseña. **Son 7 días gratis.**
3. Dentro, el centro de ayuda guía los «Primeros pasos»: configurar el plan, agregar una reserva, pagos y bloqueos [AP-primeros].
   Para activar WhatsApp se va a Cuentas y facturación → Administrar mi plan → se agrega el paquete y se paga [AP-contratar].
4. Sofía no tiene alta propia: el formulario pide una **demo con ventas**, con el gancho «pocos cupos» [AP-sofia-lp].
   Después hay que conectar Meta y verificar el negocio [AP-julia-conectar].

## 2. Citalo (Uruguay, +598) — módulo por módulo

| Módulo | Cómo funciona |
|---|---|
| **Agenda** | Por profesional, con duración por servicio, horarios flexibles y multiubicación. El «autocompletado inteligente» solo marca como completadas las citas pasadas. No tiene app nativa: funciona en la web del celular [CI-bo][CI-vsAP]. |
| **Reserva online** | Página pública con URL propia, 24/7, para compartir por WhatsApp, Instagram o Google. El cliente cancela con un clic y elige otro horario en el momento [CI-reservas][CI-cancel]. |
| **Recordatorio y confirmación por WhatsApp** | Configuración → Recordatorios. Se elige **un solo momento de envío, entre 1 y 24 h antes (2 h por defecto)**, y se activa email y/o WhatsApp [CI-tutorial]. **La plantilla es fija**: nombre, servicio, profesional, negocio, día y hora, más **una línea propia al final**. Trae un link para confirmar o cancelar, y al cancelar se libera el hueco. Usa la **API (WABA) integrada por Citalo**: el dueño no configura nada técnico [CI-guia-wa]. Por eso sale del número de Citalo (inferencia). Los mensajes incluidos son 0/100/250/500/1000 según el plan, y el **extra cuesta USD 0,05** [CI-precios]. Si el cliente no tiene WhatsApp, va solo por email. |
| **Recall / inactivos** | **No tiene módulo.** El historial muestra la frecuencia de visitas y se sugiere hacer seguimiento a mano; la fidelización es un artículo del blog [CI-historial][CI-blog-fid]. |
| **Caja y cobros** | Caja por sucursal. **El ingreso se crea solo al completar la cita.** Al cerrar detecta descuadres, separa egresos en 11 categorías y liquida comisiones [CI-caja]. El cobro online es con MercadoPago al reservar: la cita se confirma al pagar y los reembolsos se hacen desde el panel [CI-pagos]. |
| **Ficha** | Ficha clínica genérica: diagnósticos, tratamientos, alergias y notas, encriptada. Sin odontograma [CI-ficha]. |
| **Reportes** | Ventas, profesionales, servicios, comisiones, reservas (cancelaciones, horarios) y clientes frecuentes. Los avanzados van desde el plan Profesional [CI-reportes][CI-precios]. |
| **IA** | **No tiene IA.** |
| **Marketing** | **No tiene campañas.** Solo email transaccional y SEO masivo: 493 URLs con páginas por rubro y por país [CI-sitemap]. |
| **Precio (USD/mes)** | Free 0 · Individual 14,99 · Negocio 29,99 (5 empleados) · Profesional 59,99 · Empresa 119,99 [CI-precios]. |

**Onboarding de Citalo** (capturas `citalo-bo-odontologos.png`, `citalo-signup-paso1.png`):
1. En la landing `/bo/software-turnos-odontologos`, «Crear mi página gratis» lleva a `app.citalo.app/register`.
   La URL ya trae `business_type_intent=DENTAL&country=BO`: **el rubro y el país llegan elegidos desde el anuncio o la landing**.
2. Formulario: Google, o nombre, apellido, email, contraseña dos veces, país y aceptar términos. **Sin tarjeta; Free con 25 citas al mes** [CI-registro].
3. Se cargan servicios, horarios, ubicaciones y staff → **se comparte el link** → se activan los recordatorios en Configuración [CI-bo][CI-tutorial].

## 3. Cómo logran «menos ausencias»: el mecanismo exacto

**AgendaPro** dice «hasta 70 %» [AP-recordatorios]. Es una escalera de cinco pasos:
1. Email al crear la cita y email de recordatorio a las 07:30, 1-3 días antes o el mismo día. Trae botones para confirmar, cancelar o reagendar [AP-email].
2. **WhatsApp solo para la cita que sigue sin confirmar**: si ya confirmó por email, no se manda y no se gasta cupo [AP-ayuda-wa].
3. Una política que el cliente aplica solo: horas mínimas para cambiar la cita y un máximo de cambios [AP-email].
4. Sofía insiste por WhatsApp: detecta que no contestó, reabre la conversación y **propone horarios hasta confirmar**. Si alguien cancela, libera el hueco al momento [AP-sofia].
5. Una seña o pago anticipado online («un cliente que paga en línea llega») [AP-pagofaq], y Charly llena los huecos con una campaña relámpago [AP-charly].

**Citalo** solo muestra el −50 % de su caso [CI-caso]. Hace cinco cosas:
1. Confirmación inmediata y **un** recordatorio configurable (en el caso: 24 h antes y el mismo día) por WhatsApp y email.
2. Link para confirmar o cancelar dentro del mensaje, y el hueco se libera solo [CI-tutorial].
3. Una política visible de aviso con 24 h, repetida en cada mensaje.
4. **Lista de espera** que la recepción trabaja **a mano** [CI-caso].
5. Pago previo con MercadoPago [CI-pagos].

**El núcleo común:** que el mensaje llegue por WhatsApp, que **se pueda contestar con un toque** y que **el hueco liberado vuelva a venderse**.

## 4. Contra Onia

| Módulo | Ellos tienen | Onia tiene | Mejor |
|---|---|---|---|
| Agenda | AP: app nativa + marketplace + Google Reserve. CI: web | Agenda por profesional, citas, roles | AgendaPro |
| Reserva online | Los dos: link 24/7. El cliente cancela o reprograma solo | Link de reserva (incluido desde Crece) | Ellos (autogestión) |
| Recordatorio | WhatsApp + email con confirmar/cancelar | **Solo correo**, 24 h y 2 h antes. WhatsApp todavía no se nombra | **Ellos** |
| Confirmación activa | Sofía insiste hasta confirmar | Agente «confirmador» que propone, y el dueño aprueba en Pendientes | AgendaPro |
| Recall | AP: Charly (email, caro). CI: nada | **Agente de tratamiento a medias**, todos los días | **Onia** |
| Caja y cobros | AP: POS, link de pago, seña. CI: caja automática + MercadoPago (ninguno en Bolivia) | Cobros, facturas, por cobrar, agente cobrador. Sin pago online del paciente | Empate en Bolivia |
| Factura | AP: SII Chile | SIAT en certificación (no se nombra) | Nadie en Bolivia |
| Ficha | AP: ficha configurable, por IA, firma, consentimiento. CI: genérica | Historia clínica + **odontograma** + tratamientos | Onia en dental; AP en estética |
| Reportes | AP: ocupación, horas pico, Excel | Reportes (desde Profesional) | AgendaPro |
| IA | AP: Julia contesta y agenda; Sofía confirma | Agentes que proponen. El bot de WhatsApp está ⏸ sin conectar | AgendaPro |
| Marketing | AP: email masivo, cumpleaños, encuestas, sellos | No tiene campañas | **Ellos** |
| Gestión de fondo | CI: caja, inventario, comisiones. AP: + inventario | **Contabilidad, planilla, gastos, inventario** y 5 rubros | **Onia** |
| Onboarding | AP: 1 formulario, 7 días. CI: Free para siempre, rubro elegido desde la landing | Rubro → datos → **14 días de Profesional sin tarjeta** | Empate (CI gana en «ya llega elegido») |

## 5. Para una clínica de 2-6 profesionales en Santa Cruz

**Top 5 de lo que tienen y a Onia le falta**
1. **Recordatorio por WhatsApp con «Confirmar / Cancelar / Reprogramar» en un toque.** Hoy Onia solo manda correo, y en Santa Cruz el paciente no lo lee.
2. **Escalera de confirmación:** WhatsApp solo a quien no confirmó, y si calla, insistir. Así se ahorra cupo y se atiende al que sí falta.
3. **Autogestión con política:** el paciente cancela o reprograma solo, dentro de las horas mínimas, y **el hueco liberado avisa a una lista de espera**.
4. **Seña al reservar.** Ninguno de los dos cobra en Bolivia, así que la seña con QR es terreno libre.
5. **Campañas a la base de pacientes:** cumpleaños, «hay huecos esta semana» y difusión. Hoy Onia no tiene nada de eso.

**Top 3 de lo que Onia hace mejor**
1. **Recall clínico de tratamiento a medias, todos los días y sin costo extra.** Citalo no tiene recall y Charly cobra aparte y solo manda email.
2. **El sistema completo detrás de la agenda:** odontograma, inventario de insumos, contabilidad, planilla y gastos. Los dos competidores son agendas con caja.
3. **Hecho para Bolivia:** precio local y QR BCP, 14 días del plan Profesional (AgendaPro da 7), y Crece con 4 usuarios para 3 profesionales y recepción. AgendaPro no está en Bolivia.

## 6. Lo que no se pudo ver

- **No se vio ningún video.** YouTube bloquea esta IP: yt-dlp pide «Sign in to confirm you're not a bot» y el embed da el error 153. No hay key de Gemini.
  Videos candidatos para mirarlos desde la PC: `Hw46jlPf4mU` (Demo Salud AgendaPro) y `LrsAQlkSUeE` (AgendaPro con IA, spa). No encontré videos de Citalo.
- No se vio el panel por dentro (no se crearon cuentas): los pasos internos salen de los artículos de ayuda.

## Fuentes (todas consultadas el 2026-10-01)

- AP-home: agendapro.com/cl · AP-planes: agendapro.com/cl/planes (renderizada) · AP-sitemap: agendapro.com/sitemap.xml
- AP-recordatorios: agendapro.com/cl/recordatorios-automaticos · AP-charly: agendapro.com/cl/charly
- AP-sofia: agendapro.com/cl/sofia-ia-recordatorios · AP-sofia-lp: agendapro.com/lp/sofia-ia-recordatorios
- AP-ayuda-wa: ayuda.agendapro.com/es/articles/5754192 · AP-contratar: …/8460901 · AP-plantillas: …/9777007
- AP-email: …/5929550 · AP-julia-info: …/11488696 · AP-julia-conectar: …/11707235 · AP-julia-pago: …/15851293
- AP-julia-verif: …/16043199 · AP-pagofaq: …/6706148 · AP-reportes: …/2252017 · AP-campana: …/6381521
- AP-sellos: …/16111696 · AP-ficha: …/4659356 · AP-primeros: ayuda.agendapro.com/es/collections/969458 · AP-sitemap-ayuda: ayuda.agendapro.com/sitemap.xml
- CI-bo: citalo.app/bo y /bo/software-turnos-odontologos · CI-precios: citalo.app/precios · CI-sitemap: citalo.app/sitemap.xml
- CI-tutorial: citalo.app/blog/tutorial-configurar-recordatorios-automaticos · CI-guia-wa: …/blog/guia-whatsapp-business-reservas-2026
- CI-caso: …/blog/caso-exito-clinica-redujo-inasistencias · CI-blog-fid: …/blog/fidelizar-clientes-negocio-servicios
- CI-pagos, CI-caja, CI-ficha, CI-reportes, CI-reservas, CI-cancel, CI-historial: citalo.app/funcionalidades/{pagos-online, sistema-caja, ficha-clinica, reportes-gestion, reservas-online-24-7, cancelaciones-reprogramaciones, historial-pacientes}
- CI-vsAP: citalo.app/comparativas/citalo-vs-agendapro · CI-registro: app.citalo.app/register (solo vista, sin enviar)
