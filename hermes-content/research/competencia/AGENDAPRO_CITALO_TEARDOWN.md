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

> Esta sección es del 1-oct. El 7 y 8-oct sí se vieron videos (ver «Contenido, pauta y comunicación» abajo).

- **El 1-oct no se vio ningún video.** YouTube bloquea esta IP: yt-dlp pide «Sign in to confirm you're not a bot» y el embed da el error 153. No hay key de Gemini.
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

---

## Contenido, pauta y comunicacion (medido 2026-10-08)

> Pasada del 8-oct sobre redes, anuncios y comunicación de AgendaPro y Citalo. El producto está arriba y no se repite. Todo sale de lo público: sin cuentas, sin formularios y sin navegador.
> Las vistas y los seguidores son los que mostraba cada plataforma ese día. **Las cifras de venta de ellos («90 %», «82 %», «75 % de ocupación») no tienen fuente ni método y Onia no las repite.** Lo que es lectura mía va marcado como *(lectura)*.
> Método de los videos: Gemini mira imagen y audio, y yo confirmé con cuadros propios los que dicen «cuadros». Detalle en Cobertura.

### Cobertura

| Fuente | Qué se vio | Método | Límite |
|---|---|---|---|
| **AgendaPro, YouTube** (canal `UCoCMp3I4V5uojehS2Co0v5g`; la web no lo enlaza, se halló por búsqueda) | 56 videos largos y 2 shorts listados (vistas y duración). **11 videos analizados de punta a punta el 7-oct y 4 más el 8-oct** (Reserve with Google, el genérico de 417 mil, y dos de la serie «Versión Pro»; tabla de guiones): 3 de clínica o consultorio, 2 de IA de WhatsApp (Sofía y Julia), 2 de recordatorios, 2 de caso de éxito, 1 short de creadora, 1 de la app de consumidores | `yt-dlp` para listar. Gemini `gemini-flash-lite-latest` para ver cada video: el modelo estándar dio **429 de cuota** y no se reintentó. YouTube bloquea la bajada del video desde esta IP, así que 5 de los 11 los verifiqué con **cuadros propios**: la tira de miniaturas de YouTube, 1 cuadro por segundo a 320×180 | Sin fechas de subida (YouTube las devuelve vacías al listar). Sin suscriptores. Lo que dice Gemini del tamaño exacto de la letra es aproximado |
| **AgendaPro, Instagram** `@agendapro_software` | **96,9 mil seguidores**, 2.664 seguidos. 12 publicaciones visibles del 14-ago al 7-oct | `WebFetch` del perfil público | Sin vistas, likes ni textos. TikTok: la web no lo enlaza y `yt-dlp` no pudo listar `@agendapro` |
| **AgendaPro, Meta** (página `1429581593936821`) | **314 anuncios** en la Biblioteca (todos los estados) | `ads_library_search` por id de página y por palabra. 14 consultas, solo lectura | **La herramienta devuelve el titular y la fecha, no el texto, el creativo, el botón ni el destino.** Facebook no abre sin navegador y no se usó. Con «todos» y con «activos» devuelve exactamente los mismos 60 anuncios de clínica: no separa activos de históricos |
| **AgendaPro, blog y web** | 1.196 entradas del blog; home y página dental | API pública de WordPress y `WebFetch` | `/planes` no se releyó |
| **Citalo** | Instagram `@citalo.app`, blog, web `/bo` | `WebFetch` | **No tiene video** (ni YouTube, ni TikTok, ni Facebook enlazados). Biblioteca: 0 resultados por texto «Citalo» en BO, UY, AR, CL, PE, CO y MX (búsqueda por texto, no por página) |

### Estructura de contenido organico

**AgendaPro, YouTube (56 videos largos).**

| Pilar | Qué es | Peso y rendimiento |
|---|---|---|
| **Promo corta por rubro** | «Tienes un [rubro]…» en 28 a 56 s: clínica o centro médico, medicina estética, salón | **Tres de los cinco videos más vistos del canal son de rubro:** **424 mil** (medicina estética, 28 s), **349 mil** (clínicas y consultorios, 56 s) y 186 mil (medicina estética, 44 s). El segundo del canal (417 mil, 28 s) es genérico («aumenta tus ingresos administrando mejor tu negocio»), pero **también nombra el rubro en los 3 primeros segundos**: la palabra final rota «Centro Médico», «Salón de Belleza», «Barbería» *(Gemini, 8-oct)* |
| **Función nueva** | Reserve with Google, Google Calendar, terminal de pago, autofactura, gift cards, app de consumidores | 33 a 65 s. **249 mil** Reserve with Google; el resto entre 0,4 y 9 mil |
| **IA de WhatsApp** | Sofía (recordatorios) y Julia (vendedora) | 33 a 42 s. Sofía 16 mil, Julia 0,9 mil |
| **Persona real** | Serie «La versión Pro de [nombre]» de 49 a 72 s, más casos de éxito de 2 a 4 min | La serie corta: 177 mil (Palermo Soho, 50 s), 97 mil (61 s), 70 mil (72 s) y 53 mil (66 s); la de un quinto cliente (49 s) tiene 328 vistas. **Los casos largos «mejor software para X 2026»: casi todos entre 0,3 y 5 mil; los dos mejores, 8 y 10 mil** |
| **Institucional** | Expo, «Universo Pro», empleados | 0,1 a 6 mil |

- **Mezcla y rendimiento.** 24 de 56 duran 60 s o menos. 22 duran 2 min o más (casi todos casos de éxito con título de SEO). Mediana 66 s (relistado el 8-oct). Los 56 largos suman 1,93 millones de vistas; con los 2 shorts, unos 2,4 millones.
- ***(lectura)* Lo corto de 28 a 56 s con el rubro en los primeros 3 s mueve decenas a cientos de veces más vistas que el caso largo** (424 mil contra 0,3 a 10 mil). La excepción es Reserve with Google (249 mil): de función, no de rubro. Casi seguro es vista pagada (anuncio de YouTube o de Meta reutilizado), pero desde afuera no se puede separar de lo orgánico.
- **Shorts:** 2. El de **490 mil vistas** es una creadora a cámara (30 s). El otro (IVA en el salón) tiene 2,6 mil.

**AgendaPro, Instagram (96,9 mil).** De las 12 piezas visibles en 54 días (14-ago al 7-oct), **6 son propias y 6 son de cuentas de terceros** (colaboraciones con salones, coaches y barberos). Hay 11 reels y 1 carrusel. Lo propio mezcla: una pieza por vertical («¿Tienes una clínica estética? Esto es para ti»), una de IVA para barbería, cultura interna («equipo PRO») y detrás de escena de grabación. Bio: «Agenda y descubre tu versión PRO». Ritmo propio visible: **una pieza cada 9 días**.

**AgendaPro, blog.** 1.196 entradas. Las últimas 30 salieron del 4 al 24-ago: **unas 10 por semana**, con título «Guía + 2026» y temas de SEO (historia clínica por especialidad, ausentismo, retención, recordatorios con 20 plantillas, CRM de centro médico). La API no muestra nada posterior al 24-ago. *(Lectura)*: es una máquina de SEO por plantilla, no una publicación artesanal.

**Citalo.** Instagram con **4 seguidores y cero publicaciones visibles**. Su contenido es el blog (12 entradas del 14-mar al 3-jun-2026, una o dos por semana; categorías Guías, Casos de uso, Tutoriales y Comparativas) y el SEO de 493 URLs por rubro y país (medido el 1-oct). **No usa redes: el canal es la web.**

### Pauta en Meta

**Bolivia: AgendaPro y Citalo no pautan.** AgendaPro tiene **0 anuncios entregados en Bolivia** (todos los estados) y **0 con «dental», «dentista» u «odontólogo» en el texto** de sus 314 anuncios. Citalo, 0 por texto en 7 países. Hoy ninguno de los dos le pauta al dentista boliviano ni a ningún dentista.

**AgendaPro, lo que sí hace** (página facturada en USD):

| Dato | Medido |
|---|---|
| Volumen | **314 anuncios**: 60 con «clínica», 64 con «inasistencias», 9 con «tratamiento». Una consulta de 50 anuncios con «clínica» da: **13 nacieron en los últimos 7 días, 21 en los últimos 14, 18 llevan 30 días o más y 9 llevan 60 o más** (recontado el 8-oct sobre los 50 que devuelve la herramienta; la búsqueda «clínica» da 60 en total y no se puede ver el resto) |
| Qué es el volumen | Un titular corto de 3 a 6 palabras por **rubro** (salón, barbería, spa, gimnasio, kine, clínica capilar, clínica estética, centro médico) y por **dialecto**: voseo argentino («Hacé», «Ordená», «Jugala como un 10»), neutro («Haz») y chileno («kine»). Se crean en lotes: cuatro anuncios de clínica se crearon con minutos de diferencia el 6-ago |
| Fórmulas de titular | «Menos X, más Y» («Menos inasistencias, más ingresos»), la cifra («90 % menos inasistencias», 5 o más versiones; **la web decía «hasta 70 %» el 1-oct: la cifra sube sin fuente**), y el dolor («Cada día que pasa, pierdes citas», «72 % de mensajes sin respuesta») |
| CTA | «Agenda tu demostración gratis» en **13 versiones** (11 del 7 al 12-ago y 2 del 7-sep). «Prueba AgendaPro gratis» y «7 días gratis para tu spa» |

**Los que más llevan, mirados a fondo** (solo metadatos: el creativo no se pudo abrir). Días hasta el 8-oct:

| Id | Inicio · días | Titular | Qué se lee |
|---|---|---|---|
| `906748815086043` y `1967791207137782` | 5-feb · **245** | Catálogo dinámico (`{{product.name}}`) y carrusel «La inteligencia artificial llegó · no más inasistencias» | Los más viejos de la página. Dentalink también sostiene un catálogo dinámico desde nov-2025: **los dos que más duran en el rubro son catálogo dinámico**. No son de clínica |
| `1042657704821663` | 7-jul · **93** | La IA que cuida tu clínica | El primero con «clínica» y «IA» en el titular |
| `1328279845678022` | 16-jul · **84** | Organizá tu clínica estética sin el caos del papel | Voseo argentino. El dolor es el papel |
| 4 anuncios, 6-ago · **63** | | Menos inasistencias en tu clínica · Ficha clínica digital · Transforma tu agenda hoy · La IA que tu clínica necesita | Un lote, un solo día. Hay **8 anuncios de clínica con «IA» en el titular** (cuida, organiza, responde por, para, ordene y tres de «necesita») |
| 11 anuncios, 7 a 12-ago · **57 a 62** (y 2 más del 7-sep) | | Agenda tu demostración gratis | El mismo titular con 11 creativos distintos: el CTA que más se repite en toda la página |
| `1550396922900822` | 26-ago · 43 | Llegó JulIA a AgendaPro | El lanzamiento de Julia, con el nombre en el titular |

**El ángulo que importa a Onia: «tratamiento».** AgendaPro lo prueba desde hace un mes y se acelera esta semana:

| Inicio | Titular | Días |
|---|---|---|
| 21-jun | La IA que organiza tu clínica (con «tratamiento» en el texto) | 109 |
| 8-sep | Seguí cada tratamiento | 30 |
| 23-sep | Dejá de perder tratamientos | 15 |
| 24-sep | Sin seguimiento, se pierde | 14 |
| **8-oct** | **¿Cómo va el tratamiento?** y **Seguimiento de pacientes sin caos** | 0 |

*(Lectura, con el límite de no ver el creativo):* es seguimiento de pacientes y ficha, no el recall que avisa «ese paciente dejó el tratamiento a medias». Pero **el hueco «nadie pauta el tratamiento a medias» ya no es de nadie solo en los títulos.** En Bolivia sigue libre (0 anuncios, 0 dentales). Desde los países donde pauta, **cinco titulares nuevos en 30 días** apuntan a ese territorio.

**Citalo:** sin anuncios.

### Comunicacion

| | AgendaPro | Citalo |
|---|---|---|
| **Titular de la web** | «El software n°1 para salones, spa, estética y salud». Página dental: «Mejor software para clínicas dentales en Latinoamérica» | «Ordena tus citas sin depender de WhatsApp» |
| **Promesa** | «Organiza citas, cobra sin fricciones y haz crecer tu negocio». Dental: «Más ingresos para tu clínica dental» | Compartir una página de reservas por WhatsApp, Instagram y Google |
| **A quién** | Belleza y salud en general. **La página dental es la de belleza con la palabra cambiada:** 12 testimonios y ninguno es dentista (masajista, spa, estilista, manicura, kinesiólogo…) | Negocios de servicios; en `/bo` hay página por rubro, con el rubro y el país ya elegidos |
| **Voz** | Informal «tú» en la web. En anuncios, voseo argentino o neutro según el país | Neutro, informal |
| **Prueba** | «+135.000 profesionales», «+20.000 negocios», «hasta 82 % más ventas en dos años», sello de Y Combinator. Sin reseñas visibles | Un caso: «62 a 31 turnos perdidos» (1-oct). Sin cifras de uso |
| **Precio** | **No visible** en la home ni en la página dental (hay un enlace «Precios») | **Visible:** Free 0, 14,99, 29,99, 59,99 y 119,99 USD por mes |
| **Clics hasta empezar** | 1 al formulario (7 días gratis; medido el 1-oct) | 1 («Crear mi página gratis»), sin tarjeta |
| **CTA** | «Prueba gratis» y «Crea tu cuenta gratis» | «Crear mi página gratis»; WhatsApp para dudas |
| **Marca** | «Versión PRO» como recurso en todo: la serie «La versión Pro de…», «El software que te hace Pro», la bio de Instagram | Sin recurso de marca visible |

### Guiones de sus videos/anuncios

| Pieza | Gancho (primeros 3 s) | Tramos | Cierre |
|---|---|---|---|
| **Clínica o centro médico** · 56 s · 16:9 · 349 mil | Nombra al rubro: «Haz crecer tu clínica o centro médico…» (texto igual en pantalla a los 0 s) | 0-5 médico con libreta y logo con barra de búsqueda · 5-11 «olvídate de contestar mensajes en WhatsApp» · 11-16 sitio de reservas con profesionales y precios · 16-19 pasillo vacío: «deja de perder tiempo y dinero por inasistencias» · 19-24 **recordatorio por WhatsApp con botones Confirmar y Cancelar** · 24-32 «¿Te cuesta encontrar las fichas?» con manos en un archivador, luego historial · 32-38 Excel que dice «#Error!», luego control de caja · 38-56 cuatro profesionales sonriendo: «ayudamos a miles de clínicas…» *(re-visto 8-oct)* | Barra de búsqueda, «agendapro.com» y botón «Prueba gratis» |
| **Medicina estética** · 28 s · 16:9 · 424 mil | Rubro y promesa: «tienes una clínica…, hazla crecer… con un clic» (una profesional hace un tratamiento a cámara) | 0-6 gancho · 6-11 cuatro módulos en texto: citas, recordatorios, historial, pagos · 11-14 «7 días de prueba gratis» · 14-20 cuatro tarjetas de cifras (200 reservas, 120 clientes nuevos, 75 % de ocupación, ventas) y «Crece 82 %» · 20-28 la URL | «Entra, crea tu cuenta y toma el control de tu clínica». **La misma plantilla se repite para «clínica o consultorio» (31 s, 63 mil): cambia el rubro, no el guion** |
| **Sofía** · 32 s · 9:16 · 16 mil | Pregunta del dolor: «¿Pierdes dinero y tiempo por inasistencias?» | 0-3 pregunta · 3-10 nombre y qué hace · 10-21 chat simulado: el cliente cancela, Sofía reagenda y el hueco se libera · 21-25 tres beneficios · 25-32 URL | «La mejor forma de reducir las inasistencias de tu negocio». Sin precio ni testimonio |
| **«¿Tu cliente te volvió a dejar plantado?»** · 38 s · 9:16 · 45 mil | La pregunta que cuenta la escalera: «…aunque ya le enviaste un correo» | 0-7 pregunta · 7-22 el correo con botones; si no lo abre, WhatsApp · 22-29 «– Tiempo / + Dinero» · 29-38 «¡Contáctanos!» | URL |
| **Julia** · 41 s · 9:16 · 0,9 mil | «Convierte todas tus conversaciones en ventas» | 0-13 qué es y qué responde · 13-24 insiste, recuerda, reprograma · 24-34 se conecta a los anuncios de Meta, reportes · 34-41 cierre | «Solicita una demostración». **La única pieza que va a demo** |
| **«La versión Pro de [persona]»** · 50 a 72 s · 16:9 · 53 mil a **177 mil** (Palermo Soho, 50 s) | **Sin voz en los primeros 3 a 4 s:** solo el letrero del negocio y música; la dueña habla a partir del s 3-4 *(re-visto 8-oct en Palermo Soho y Be Beauty)* | 3-10 origen del negocio (la abuela) · 10-25 el caos antes: libro, teléfono, comisiones e inventario a mano · 25-36 «ahí encontramos AgendaPro»: agenda, historial, recordatorios, pagos, reportes y la terminal de pago · 36-48 clientes contentos, foto del equipo, remate | «Esta es mi versión Pro», pantalla morada y el lema «El software que te hace Pro». **Sin CTA ni URL** |
| **Reserve with Google** · 51 s · 16:9 · **249 mil** *(pasada 8-oct)* | «Atrae nuevos clientes desde Google» (texto y voz a los 0 s) | 0-8 la alianza con logos · 8-22 búsqueda «salón de belleza cerca de mí», botón «Reservar en línea» y contador de clientes nuevos · 22-30 cinco beneficios en texto · 30-38 **pantalla dividida: celular con el botón y panel de AgendaPro recibiendo la reserva** · 38-50 cierre con logos | Sin CTA hablado: solo los logos «AgendaPro + Reserve with Google» |
| **Genérico por rubros** · 28 s · 16:9 · 417 mil *(pasada 8-oct)* | «Aumenta tus ingresos y administra mejor tu…» con la palabra final rotando entre Centro Médico, Salón y Barbería | 4-6 agenda · 7-10 recordatorio de WhatsApp con Confirmar y Cancelar · 11-14 historial · 15-18 campañas de correo · 19-22 «+15 herramientas» · 23-26 URL | «agendapro.com», botón «Prueba gratis» |
| **Creadora a cámara** · 30 s · 9:16 · **490 mil** | «El secreto de muchas dueñas de salón no es trabajar más, es cómo manejan su agenda» | 0-4 secreto · 4-9 el dolor de WhatsApp (mensajes de clientas que cancelan) · 9-15 «reservan solas desde un link» (botón «Reservar en línea» de Google Maps) · 15-23 recordatorio con Confirmo y Cancelar, agenda por colores, ventas y comisiones · 23-30 «yo también la uso» y «velo por ti misma» | «Haz clic aquí». Es la **misma fórmula «El secreto de…» que CitaPro usa en sus anuncios** (ver la ficha de CitaPro) |

### Edicion

- **Promo de rubro (clínica, estética):** locución en off masculina, sin presentador. Foto o video de stock de médicos al inicio. Capturas de pantalla con **el nombre del módulo como título grande** («Sitio de reservas», «Recordatorios automáticos», «Historial de pacientes») sobre un azul de marca. Música corporativa con sonidos de notificación. **3 a 4 cortes cada 10 s.** Primeros 3 s *(cuadros)*: médico de stock con la frase en pantalla y, antes del segundo 3, corte al logo con una barra de búsqueda que escribe «agendapro». Cierra con la misma barra y el botón.
- **Sofía:** 100 % gráfico en movimiento sobre degradado violeta oscuro, sin persona. La frase aparece en dos líneas, con palabras clave en violeta claro, y entra con un destello. Mockup de WhatsApp animado. Voz en off.
- **Julia:** vertical, burbujas de chat en 3D sobre azul y violeta, 4 a 5 cortes cada 10 s. El texto en pantalla es la voz en off palabra por palabra.
- **«Plantado»:** pantalla grande de laptop y celular con **un círculo con una presentadora en la esquina inferior derecha** durante todo el video *(cuadros)*. Empieza con fotos de stock de una mujer con el celular. Sin subtítulos: depende del audio.
- **Creadora a cámara (490 mil):** mujer con micrófono de solapa de utilería, cambios de plano y de ropa, B-roll de salón de uñas, y pantallas de la app sobre el degradado violeta de la marca; mensaje de WhatsApp de confirmación en pantalla completa *(cuadros)*. Subtítulos blancos al centro de 2 a 4 palabras.
- **Testimonio «Versión Pro»:** cine 16:9 con bandas negras, **logo de AgendaPro fijo arriba a la derecha** todo el video, B-roll documental, subtítulos blancos en el tercio inferior, 6 a 8 cortes cada 10 s, música que sube *(cuadros)*. Sin locución los primeros 3 a 4 s y cierra con pantalla morada y lema, sin CTA *(Gemini, 8-oct, en 2 de la serie)*.
- **Reserve with Google (249 mil):** gráfico en movimiento sobre fondo oscuro con confeti y rostros flotando, mockup de celular y de Google Maps, y **pantalla dividida celular + panel** para mostrar que la reserva cae sola en el sistema *(Gemini, 8-oct; sin cuadros propios)*.
- **Instagram:** colaboraciones con terceros que ponen su propia cara. Lo propio se hace barato: pantalla y texto.

### Que toma Onia (pauta de Onia Platform y web) y que NO

**Toma**

1. **El rubro en la primera frase, 28 a 56 s y la pantalla real con el nombre del módulo en grande.** Son 3 de los 5 videos más vistos de AgendaPro. Coincide con §2.2 de `ONIA_ADQUISICION_Y_PAUTA.md` («el titular es la segmentación»). Para Onia: *«Si usted tiene una clínica dental en Santa Cruz…»* y tres pantallas reales, cada una con su rótulo. Cada módulo que se nombre tiene que estar en ✅ en `ONIA_PROMESA_VS_PRODUCTO.md`.
2. **El dolor visible en 2 segundos:** el Excel que dice «#Error!» o la carpeta de papel. Para el dentista: la ficha en papel contra la ficha con el odontograma. Pertenece al trabajo del dentista, no a una norma.
3. **Una plantilla, un cambio de rubro.** AgendaPro cambia la palabra de rubro y los cuatro módulos, no el guion. Cuando entre la importadora, la pieza se rehace con su vocabulario y no se inventa otra desde cero.
4. **Contar la escalera en pantalla** (correo, y si no lo abre, WhatsApp) es la idea del video «plantado» y es el ítem 4 del backlog. **Solo se muestra cuando «Conectar mi WhatsApp» esté en ✅.** Hoy Onia manda solo correo y no se promete otra cosa.
5. **La serie «La versión [X] de [persona]»**: antes, después y una frase de remate con la marca. Es la forma correcta de testimonio, pero **hoy hay cero clientes y no se inventa**. Se guarda para el primer cliente real que lo autorice.
6. **Recordatorio de WhatsApp con dos botones (Confirmar, Cancelar) como imagen central.** Aparece en 3 de los videos de AgendaPro vistos con cuadros o texto de pantalla (349 mil a los 19-24 s, 417 mil a los 7-10 s, 490 mil a los 15-17 s); Sofía lo cuenta con un chat simulado. Para Onia (pieza de pauta en video de 30 a 56 s y la sección de recordatorios de la web): se filma la pantalla de Pendientes y del recordatorio por correo; **el mockup de WhatsApp solo cuando «Conectar mi WhatsApp» esté en ✅**.
7. **Pantalla dividida «lo que ve el cliente / lo que ve el negocio».** La usan Reserve with Google (249 mil, 30-38 s) y el pitch de Calendico: dos videos independientes. Es la forma barata de probar que la reserva cae sola en el sistema. Solo con capturas de la cuenta demo.

**No toma**

- **Las cifras:** «90 % menos inasistencias», «hasta 82 % más ventas», «75 % de ocupación». Sin fuente, y Onia no repite números ajenos. Una de ellas cambió sola de 70 a 90 %.
- **«IA» en el titular** (8 anuncios de clínica con «IA»): `ONIA_ADQUISICION_Y_PAUTA.md` §7 y el catálogo §8.
- **El «tú» y el voseo argentino.** Onia le habla de **usted** al cliente de Bolivia. Lo que Sergio Urcullo dice entre colegas es otro registro y no va en la pauta.
- **La creadora que dice «yo también la uso»** (el short de 490 mil): se hace pasar por usuaria. Onia: el presentador explica y demuestra, **nunca se hace pasar por cliente**. El presentador permitido es Sergio Urcullo con la pantalla.
- **El volumen** (314 anuncios, uno por rubro y por dialecto): el ángulo de Onia es 2 o 3 versiones de **un** concepto, para un rubro.
- **La página dental con testimonios de otros rubros:** es lo que Onia no hace. Si la web habla de clínicas dentales, sus pruebas son de clínicas dentales.
- **Precio oculto:** AgendaPro no lo muestra. Onia sí lo publica y sigue siendo ventaja. Si se muestra en la web, **no en la pieza de pauta** (§5.4).

**Alerta para Plataforma y Ventas y pauta**

- **«Tratamiento» ya tiene dueño en otros países.** AgendaPro lo prueba desde el 8-sep con 5 titulares y dos más el 8-oct. Hoy el argumento «recuperá el tratamiento a medias» sigue libre en Bolivia (0 anuncios, 0 dentales), pero **es el argumento que otro puede decir primero**, y el paso 0 (el detector que hoy no encuentra a nadie) sigue abierto. Por la regla vigente el argumento no se usa hasta cerrarlo: **el paso 0 es lo que más urge de todo lo que salió de esta pasada.**
- **Citalo no pauta y casi no tiene redes** *(lectura: su canal es el plan Free y el SEO)*. En Bolivia la pauta de software para clínicas la ocupan Dentalink y Medilink; desde el 2-oct, CitaPro le habla a médicos de Bolivia (ver `ANUNCIANTES_FICHAS_CORTAS.md`).
