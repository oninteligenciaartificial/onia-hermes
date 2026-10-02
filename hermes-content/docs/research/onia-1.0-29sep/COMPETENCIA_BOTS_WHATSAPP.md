# Competencia del «Agente conversacional de WhatsApp»: SendyPro y los bots que un negocio de Santa Cruz compararía

Para Sergio Urcullo. Todo visto el **29-sep-2026**, sin cuenta, sin registrarse, sin llenar formularios.
Complementa `VENDIBLE_VS_COMPETENCIA.md` (que compara software de clínica); acá solo se comparan **bots de WhatsApp**.

**Cómo leer las marcas de fuente**

| Marca | Qué es |
|---|---|
| [W] | Web viva del producto hoy (sitio, precios, pantalla de registro, ficha de tienda) |
| [C] | Código público de la app que se descarga sin cuenta (lo que el navegador recibe antes de entrar). Muestra textos y pantallas que existen, no que funcionen |
| [G] | Guía, tutorial o centro de ayuda: **puede estar viejo** (Sergio Urcullo pidió no basarse en guías) |
| [F] | Foro o reseña de terceros, con fecha |
| [O] | Repo de Onia (solo lectura) |
| ? | No se pudo verificar |

**Pesos a bolivianos:** 11,37 Bs por USD, el tipo de referencia del proyecto (`onia-platform/lib/pricing.ts:35`). Es para comparar, no es el tipo del día.

---

## 1. Veredicto en 8 líneas

1. **SendyPro no es un rival de clínicas: es un bot de ventas para tiendas online de Perú** (celular +51 por defecto, envíos por Shalom, pagos Yape/Plin, confirmación de pedidos de Shopify). Cuesta US$19 o US$39 cada 30 días (≈ Bs 216 / Bs 443) y trae IA incluida, pero no se ve que agende citas en un calendario.
2. **Por precio, el agente de Onia (Bs 390) cae en el medio:** más caro que SendyPro Inicial (≈ Bs 216), OpenWhats (≈ Bs 159) y Chicha (Bs 199); igual que SendyPro Completo (≈ Bs 443); muy por debajo de Kommo, Respond.io, Leadsales y Wati una vez que se suman usuarios o el módulo de IA.
3. **La brecha que el cliente va a notar en la demo: todos los rivales responden con un modelo de IA, y el de Onia responde por guion** (`hermes:deploy/vps-ops/bot/recepcionista.mjs:19`). Ante una pregunta fuera de lo cargado, Onia deriva a una persona y ellos improvisan una respuesta.
4. **La segunda brecha es agendar:** Kommo Pro dice que agenda con IA y Wati muestra «Reservar cita». El bot de Onia no agenda: pasa el pedido a una persona (`lib/pricing.ts:68-71`). Onia ya tiene la agenda y la reserva online; lo que falta es conectarlas al bot.
5. **Donde Onia gana y nadie lo copia rápido:** el bot vive dentro del sistema que tiene la agenda, las fichas y los cobros. Por eso los agentes pueden proponer escribirle a quien dejó un tratamiento a medias o tiene una cuota vencida. Además hay una sola cuenta en Bs, se paga con QR y no se necesita tarjeta internacional. Un bot suelto no sabe nada de eso.
6. **Hay tres rivales que se conectan por QR, como WhatsApp Web** (OpenWhats, el plan Básico de Leadsales y la segunda línea de SendyPro). Son más baratos y no pagan mensajes a Meta, pero arriesgan que WhatsApp bloquee el número, y sus propias webs lo admiten cuando venden «anti-bloqueo». Onia no debe competir ahí. Tiene que decir claro que usa la conexión oficial de Meta.
7. **Desde el 1-oct-2026 Meta cobra cada mensaje de servicio** (a tarifa de «utility», sin tramo gratis; página oficial de Meta, ver [M1]). Onia, Kommo y Respond.io lo avisan; SendyPro anuncia «Sin pagar por mensaje». Quien le compre a SendyPro con la API oficial puede recibir igual la cuenta de Meta. Contárselo al cliente con números es una ventaja de Onia, no un problema.
8. **No hay un rival boliviano serio en bots con IA.** «OpenWhats Bolivia» es una página de un producto que atiende por un WhatsApp de Perú y se conecta sin la API oficial. Chicha (La Paz, Bs 199) tiene todos los enlaces legales rotos y solo ofrece pedir una demo. Rimay (La Paz, Bs 290) es una bandeja de atención con una IA básica. El terreno local está libre.

---

## 2. SendyPro en detalle (solo lo público)

> La sesión principal está recorriendo SendyPro por dentro con la cuenta de Sergio Urcullo. Esto es lo que se ve **sin** cuenta: la web de marketing, la pantalla de registro, el código público de la app y la ficha de Google Play.

### 2.1 Qué es y a quién apunta
- Título de la web: «SendyPro — WhatsApp API Oficial + IA que vende por ti». Descripción: «Automatiza WhatsApp con la API oficial de Meta, IA con audios realistas, CRM, campañas y flujos ilimitados. Planes desde US$19 cada 30 días.» [W: SP1]
- **Público real: vendedores online, sobre todo de Perú.** En el código público, el campo de celular del registro arranca en **+51**. Los ejemplos de envío son «Shalom, delivery, agencia» y ciudades «Lima, Callao, Arequipa». El vendedor IA trae temas prearmados («Contraentrega y adelantos», «Yape, Plin o transferencia», «Envíos en Lima y provincias»). Hay 145 menciones a Shopify [C: SP3]. Su canal oficial de YouTube muestra un solo video visible, «Confirmación Automática para Shopify» (hace 1 año) [W: SP6].
- Sirve para Bolivia en lo técnico: la lista de países incluye «Bolivia · Bs» y la moneda BOB [C: SP3]. No hay ni una palabra dirigida a clínicas, citas o fichas.

### 2.2 Precio (web, 29-sep-2026) [W: SP1]
| Plan | Precio | ≈ Bs | Qué trae |
|---|---|---|---|
| Inicial | US$19 / 30 días | 216 | 1 WhatsApp API oficial «hasta 150 clientes automatizados por día» + 1 WhatsApp Business por QR «uso ilimitado» |
| Completo («Más elegido») | US$39 / 30 días | 443 | 1 API oficial «automatización ilimitada» + 1 «API extra de calentamiento» + 1 WhatsApp por QR |
| Paquete adicional | US$39 cada uno | 443 | +1 API oficial + 1 de respaldo + 1 QR |

- «Incluido en todos los planes, sin límites»: usuarios, vendedores, CRM, campañas, embudos, tablero kanban, integraciones.
- Preguntas frecuentes: «¿La IA cobra por mensaje? No. La IA y los audios realistas están incluidos.»
- Términos: «Las suscripciones se renuevan automáticamente» y «No se realizan reembolsos por períodos parciales» [W: SP4].

### 2.3 Cómo se conecta el número: dos caminos
El código público trae la pantalla de elección, con este texto [C: SP3]:
- **«API Oficial — Recomendado:** Número verificado por Meta. Plantillas aprobadas y envíos masivos sin riesgo de bloqueo.» Se conecta con **Embedded Signup**, el alta guiada de Meta dentro de su ventana (`FB.login` con `config_id` y `sessionInfoVersion: "3"`). Es el mismo mecanismo que el «Conectar mi WhatsApp» de Onia.
- **«WhatsApp Business:** Conecta tu número escaneando un QR, como WhatsApp Web.» Internamente esa conexión se llama **`baileys`**, una librería no oficial que imita WhatsApp Web. **Esa es la evidencia del riesgo de bloqueo:** los términos de WhatsApp prohíben «bulk messaging, auto-messaging» y el software no autorizado que funciona como sus servicios [W: M2]. En el constructor de flujos hay un nodo llamado **«antibaneo»** [C: SP3].
- La «API de calentamiento» sirve para «preparar números nuevos». La app la limita a «máximo 50 chats automatizados por día» [C: SP3]. Las automatizaciones de **grupos** (`/grupos`, `/campanas-grupos`, `/comunidades-grupos`) solo funcionan por QR: la API oficial no maneja grupos así.

### 2.4 IA
- Web: «La IA recuerda el contexto, entiende texto, imágenes y notas de voz, recomienda productos y sabe cuándo entregar la conversación a una persona». Responde con «audios con voces LATAM» [W: SP1].
- Código público [C: SP3]: una tarjeta **«IA incluida · GRATIS · Respuestas de tu bot»** deja elegir entre dos modelos, con estas etiquetas textuales:
  - «GPT-6 Luna» (OpenAI): «Inteligencia muy alta», «Puede contradecir blacks».
  - «Gemini 2.5 Flash-Lite»: «Inteligencia Media», «**Sin ética, para blacks**».
  - Qué significa «blacks» en su jerga es ?; en el comercio online latino suele aludir a productos «black» (réplicas o de origen dudoso). Esto es inferencia. Que la etiqueta diga «Sin ética» es, como mínimo, un riesgo de marca para quien lo use.
  - Además se puede **traer la clave propia**: «Conectar Claude» (pegás tu API key de Anthropic y elegís Haiku 4.5, Sonnet 5, Opus 4.8 o Fable 5) y «Conectar Gemini» (Gemini 3.5 Flash-Lite).
- **Responde con el conocimiento del negocio:** sí, a través de un «prompt» y una lista de productos. La ayuda dentro del código dice «Incluye en el prompt: nombre del negocio, productos/servicios, precios, horarios y políticas» [C: SP3]. No se ve una carga de documentos tipo base de conocimiento: ?.

### 2.5 Agenda, cobros y el resto
- **Citas: no se ve.** La web muestra un ícono «Calendar» entre las integraciones [W: SP1], pero la sección de APIs de Google de su política de privacidad solo nombra **Sheets, Drive y Gmail** [W: SP5], y el código no tiene integración con Google Calendar. Lo que tiene se llama «agendamientos»: **mensajes programados** con fecha y hora, no reservas de turnos [C: SP3].
- **Cobros:** «La IA reconoce comprobantes: valida pagos con OCR, actualiza órdenes» [W: SP1]. En el código aparece **SendyPay**: los compradores le pagan a «cuentas oficiales» que pone SendyPro en cada país, SendyPro revisa los comprobantes y le liquida al vendedor **en USDT por Binance** («los pagos aprobados se incluirán en los abonos a tu Binance») [C: SP3]. En qué países está activo es ?. Para un negocio boliviano, un cobro intermediado y liquidado en cripto hay que revisarlo legalmente antes de recomendarlo.
- **Bandeja y CRM:** «Super Chat» junta WhatsApp y Gmail en una bandeja. Tiene contactos con responsable e historial, tablero kanban, colas, etiquetas y respuestas rápidas [W: SP1, C: SP3].
- **Plantillas de Meta:** existe la pantalla `/message-templates`. El chat avisa «Ventana de 24 horas cerrada… usa las plantillas» [C: SP3].
- **Otros módulos que aparecen en el menú del código** [C: SP3]: campañas y difusiones, embudos y flujos visuales, comentarios de Meta, «ad-tracker», pedidos y productos, «reseller» (reventa), «lista negra global», «modo fácil» y «herramientas IA» (un diseñador que arma logos, portadas de ebook y PDFs con créditos).
- Indicio de origen del software: la ruta de facturación se llama `/financeiro`, en portugués, y la estructura (tickets, colas, `queue-integration`, `prompts`, `flowbuilders`) coincide con la de las plataformas brasileñas de atención por WhatsApp. **Inferencia, no confirmada.**

### 2.6 Mensajes de Meta: quién paga
- La web dice «Sin pagar por mensaje» (se refiere a la IA) [W: SP1]. Ni la web ni el código dicen que **Meta cobra aparte** los mensajes de la API oficial [C: SP3: 0 menciones]. Con Embedded Signup, la cuenta de WhatsApp Business queda a nombre del cliente, así que lo normal es que Meta le cobre al cliente. Si SendyPro absorbe ese costo es ?.
- Desde el 1-oct-2026, Meta cobra cada mensaje de servicio [M1]. El «sin pagar por mensaje» va a confundir a sus clientes de API oficial.

### 2.7 Cómo es el alta (pantalla pública `app.sendypro.com/signup`) [W: SP2]
- Panel izquierdo: «Empieza con una conversación. Crece con cada venta.» y tres pasos, «Recibo · Respondo · Vendo». Arriba, una etiqueta «SENDYPRO 2.0».
- Formulario: **4 campos** (nombre completo, correo, celular con bandera y +51, contraseña) + casilla de términos + «Crear cuenta gratis». Debajo: «**Sin tarjeta de crédito** · Guías para empezar». Subtítulo: «Primero tus datos. Después elegiremos el mejor camino para ti.»
- En la web, el recorrido tiene 4 pasos: «Conecta (API Oficial o WhatsApp QR) → Configura (IA, productos y respuestas) → Activa (flujos, campañas y CRM) → Escala».
- **Duración de la prueba:** la web no la dice. El código tiene un «plan de prueba» que no se renueva («Para seguir usando SendyPro elige un plan») [C: SP3]. Un video de un afiliado de marzo de 2026 habla de «3 días gratis» [G: SP7, puede estar viejo].

### 2.8 Tamaño y seriedad (señales verificables)
| Señal | Dato | Fuente |
|---|---|---|
| App Android | «1 K+ descargas», actualizada el 16-ago-2026, sin calificación visible | [W: SP8] |
| Contacto del desarrollador en Google Play | Un correo personal de Hotmail, no corporativo | [W: SP8] |
| Empresa y país | Los términos no nombran razón social ni país: «las leyes aplicables en la jurisdicción donde opera SendyPro» | [W: SP4] |
| Canal oficial de YouTube | 183 suscriptores; en la lista «Guías», 13 de 14 videos «no disponibles» | [W: SP6] |
| Reseñas públicas | No se encontraron en Trustpilot, G2 ni Capterra | [F: búsqueda del 29-sep] |
| Píxel de Meta Ads | Sí, instalado en la app (compra tráfico) | [C: SP2] |

### 2.9 Lo que prometen contra lo que se puede verificar
| Promesa [W: SP1] | ¿Se verifica? |
|---|---|
| «Partner oficial de Meta Business» | ? No se pudo leer el directorio de partners de Meta. El alta por Embedded Signup existe en el código, y eso requiere ser proveedor habilitado por Meta (o apoyarse en uno) |
| «500+ Empresas», «4.9» de calificación | ? Sin fuente. Google Play muestra 1 K+ descargas y ninguna reseña |
| Testimonios («Ventas +340% en 3 meses. María G. · TechStore») | No verificables: nombre e inicial, sin enlace |
| «99.9% disponibilidad», «<3 s respuesta», «Mensajes IA sin límite» | ? |
| Integración «Calendar» | No se ve (ver 2.5) |
| «Sin pagar por mensaje» | Cierto para la IA; engañoso para los mensajes de la API oficial desde el 1-oct (ver 2.6) |
| «Sin riesgo de bloqueo» (API oficial) | Razonable para la API; el QR sí tiene riesgo, y lo venden en los dos planes |

### 2.10 Riesgos para un negocio de Santa Cruz que lo contrate
1. Si conecta su número principal por QR, puede perderlo: WhatsApp prohíbe los mensajes automáticos por clientes no oficiales [M2].
2. La factura de Meta puede llegar aunque le dijeron «sin pagar por mensaje».
3. Paga en USD y sin reembolso parcial. No hay empresa identificable a quien reclamar.
4. Es un producto de comercio electrónico: no sabe de citas, fichas ni tratamientos.
5. Puede elegir un modelo etiquetado «Sin ética».

---

## 3. Matriz comparativa

Rivales cubiertos (8 además de SendyPro): OpenWhats, Kommo, Respond.io, Wati, ManyChat, Leadsales y dos bolivianos, Rimay y Chicha.

### 3.1 Negocio: precio, conexión, Meta y prueba

| Producto | Origen y a quién apunta | Precio (moneda original) | ≈ Bs/mes | Conexión del número | Riesgo de bloqueo | Mensajes de Meta | Prueba / tarjeta |
|---|---|---|---|---|---|---|---|
| **Onia (agente)** | Bolivia. Add-on del sistema de gestión por rubro (clínicas y 6 rubros más) | Bs 390/mes o Bs 3.900/año, sin instalación. Incluido desde el plan Completo (Bs 1.290). 500 conversaciones/mes; recarga de 200 por Bs 190, válida hasta fin de mes [O: pricing.ts:86-172, 217-243] | 390 | «Conectar mi WhatsApp»: alta con Meta (Embedded Signup). **Nunca se conectó el número real de un cliente** [O: INVENTARIO 3.8] | Bajo (conexión oficial) | Los paga el cliente directo a Meta, sin recargo de Onia; desde el 1-oct ≈ Bs 0,13 por mensaje de servicio [O: pricing.ts:121-139] | La plataforma tiene 14 días de prueba sin tarjeta, pero la prueba es el plan Profesional, que **no trae el agente** (`plan-catalogo.ts:25,99-111`). El agente se activa cuando Sergio aprueba el comprobante [O: INVENTARIO 3.8] |
| **SendyPro** | Perú (indicios). Tiendas online, Shopify, contraentrega | US$19 o US$39 cada 30 días [SP1] | 216 / 443 | API oficial por Embedded Signup **+ QR (Baileys)** en los dos planes [SP3] | Alto en la línea QR; bajo en la API | No lo dice; anuncia «sin pagar por mensaje» [SP1] | Cuenta gratis sin tarjeta [SP2]; duración ? (3 días según una guía vieja [SP7]) |
| **OpenWhats** | Multi-país; WhatsApp de contacto de Perú (+51). Página «Bolivia» [OW2] | US$14/mes o US$99/año [OW1] | 159 (≈ 94 pagando el año) | **Sin API oficial:** «funciona con tu número y WhatsApp Web sin necesidad de la API oficial» [OW2] | Alto: vende «Tecnología Anti-bloqueo» y «calentador» [OW1] | No hay (no usa Meta) | 7 días, «Sin tarjeta de crédito»; en Bolivia cobran con tarjeta internacional en USD [OW1, OW2] |
| **Kommo** | EE.UU./Latam. CRM de ventas por chat | Básico US$20, Avanzado US$30, Pro US$45 **por usuario/mes**, **mínimo 6 meses**, se factura solo en USD. Su web muestra «241 BOB» por usuario en Básico [KO1] | 227 / 341 / 512 por usuario | API oficial (Cloud API) propia [KO2] | Bajo | «Kommo doesn't charge any fees» por la integración; Meta cobra aparte [KO2] | 14 días, «no necesitas tarjeta de crédito» [KO1] |
| **Respond.io** | Global (sede ?). Atención y ventas multicanal | Starter US$79, Growth US$159, Advanced US$279/mes (20% menos pagando el año) [RI1] | 898 / 1.808 / 3.172 | API oficial (BSP), con «Coexistence»: se sigue usando la app en el mismo número [RI2] | Bajo | «Respond.io doesn't impose additional WhatsApp fees; pay only what Meta charges you» [RI2] | 7 días sin tarjeta, con funciones de Growth [RI1] |
| **Wati** | Global (su página muestra precios en ₹). WhatsApp para pymes | ? La página no muestra montos sin JavaScript. Growth: 3 usuarios, 500 contactos activos, 2.500 créditos IA; Pro: 5 usuarios y 10.000 créditos; Business: 10 usuarios y 25.000 créditos [WA1] | ? | API oficial | Bajo | «Se aplican cargos adicionales por mensajes de plantilla»; recargo sobre Meta ? [WA1] | «7 días de prueba gratis»; tarjeta ? [WA1] |
| **ManyChat** | Global. Automatización de Instagram, Messenger y WhatsApp | Precios cambiados el 2-mar-2026. Pro ≈ US$29 (anual) o US$39 (mensual) según el buscador; su web bloquea la lectura automática. Advanced US$139 (anual) o US$199 (mensual) [MC1, F: MC2 abr-2026] | ≈ 330-443 (Pro) | API oficial (sin QR) | Bajo | Se paga desde una «billetera» de ManyChat [G: MC3, puede estar viejo] | Plan gratis ? (no se pudo leer la página) |
| **Leadsales** | México (inferido: pide RFC). CRM de ventas por WhatsApp | Básico US$97, Profesional US$133, Avanzado US$247/mes. Agente de IA «Lead Agent» aparte: US$87, 297 o 793/mes (el primer mes gratis) [LS1] | 1.103 / 1.512 / 2.808 (+ 989 del agente) | Básico: «Messenger / Web» (**WhatsApp Web**); Profesional y Avanzado: «API oficial» [LS1] | Alto en Básico: su web dice que la API reduce «el riesgo de bloqueos» [LS1] | Vende «créditos»: 1 por conversación que inicia el negocio [LS1] | «Probar por 14 días»; tarjeta ? |
| **Rimay** | La Paz, Bolivia («Rimay, Inc.»). Bandeja de atención para equipos | Básico Bs 290 (3 agentes, 1 WhatsApp), Pro Bs 590 (10 agentes, 3 canales, «IA básica»), Enterprise a medida [RM1] | 290 / 590 | «WhatsApp Business API oficial» [RM1] | Bajo | ? | 14 días, «Sin tarjeta de crédito» [RM1] |
| **Chicha** | La Paz, Bolivia. Tienda por WhatsApp: pedidos, QR, delivery | Básico Bs 199 (500 mensajes/mes), Profesional Bs 399, Empresarial Bs 799 [CH1] | 199 / 399 / 799 | ? No lo dice | ? | ? | «14 días gratis», «Sin tarjeta», y en la misma página «Tu primer mes es gratis». No tiene registro propio: solo formulario de demo [CH1] |

### 3.2 Lo que hace el bot

| Producto | ¿Responde con IA? (modelo) | ¿Usa lo que sabe el negocio? | ¿Agenda citas? | ¿Cobra? | Bandeja multiagente | Integraciones que dicen tener | Soporte |
|---|---|---|---|---|---|---|---|
| **Onia** | **No: responde por guion.** La IA (gpt-4.1-mini) solo entiende las fotos, ayuda a editar («Enseñale conversando»); las notas de voz se transcriben [O: INVENTARIO 6] | Sí: horarios, servicios y respuestas que carga el dueño [O: INVENTARIO 3.8] | **No:** pasa el pedido a una persona. El sistema sí tiene agenda y reserva online (incluida desde Crece) [O: pricing.ts:68-71] | No por chat; el sistema tiene cobros con recibo | «Conversaciones» (`/inbox`): cuando alguien responde, el bot se hace a un lado [O: INVENTARIO 3.14] | Agenda, fichas, cobros y agentes del propio sistema; chat web; Facebook e Instagram apagados | Español, Bolivia, por WhatsApp de Sergio Urcullo |
| **SendyPro** | Sí: «GPT-6 Luna» o Gemini 2.5 Flash-Lite incluidos; Claude o Gemini con clave propia [SP3] | Sí, por prompt y catálogo de productos [SP3] | No se ve: solo mensajes programados [SP3, SP5] | Lee comprobantes (OCR); SendyPay liquida en USDT [SP1, SP3] | Sí, «Super Chat» con WhatsApp y Gmail [SP1] | OpenAI, Shopify, Sheets, Gmail, Zapier, webhooks [SP1] | Español; «Soporte 24/7» (?) |
| **OpenWhats** | «Chatbot IA 24/7»; modelo ? [OW1] | ? | Para médicos: «agenda citas y reduce no-shows con recordatorios» [OW1]; cómo lo hace ? | No | «CRM Multiagente» [OW1] | Grupos, estados, extractor de contactos | Español, «24/7 (gente real)» |
| **Kommo** | Sí: agentes de IA (hasta 3 en Avanzado, 50 en Pro) con créditos de IA [KO1] | Sí («agente de IA que ayuda a los clientes… recomienda productos») [KO1] | **Sí, en Pro:** «Programación de citas y reservas con IA», página de reservas [KO1] | ? | Sí, «Bandeja unificada» [KO1] | Más de 100 en su marketplace; socios locales que revenden [KO1] | Español; revendedores por país |
| **Respond.io** | Sí: agentes de IA desde Growth, con créditos (5.000 a 40.000) [RI1] | Sí (respuestas frecuentes, recolección de datos) [RI2] | ? | ? | Sí | Multicanal: TikTok, Messenger, Instagram, Telegram [RI2] | ? |
| **Wati** | Sí: «Wati AI», 1 agente en Growth y 2 en Pro [WA1, WA2] | Sí, «basadas en tu base de conocimientos 24/7» [WA2] | Muestra «Reservar Cita» en un ejemplo de flujo [WA2] | ? | Sí | Shopify (US$4,99/mes) [WA1] | Español en la web |
| **ManyChat** | Sí, respuestas con IA incluidas en Pro (según el buscador) [MC1] | ? | ? | ? | Limitada | Instagram, Messenger, WhatsApp | ? |
| **Leadsales** | Sí, «Lead Agent»: «responde, clasifica y organiza tus prospectos» [LS1] | ? | ? | ? | Sí, con embudos | Campañas masivas por la API | Español (México) |
| **Rimay** | Solo «IA básica»: sugerencias y resúmenes para el agente humano, más un «chatbot visual sin código» [RM1] | ? | No lo ofrece | «Integración SIAT + QR Simple» en Pro [RM1] | Sí, es su producto central [RM1] | SIAT, QR Simple, Tigo Money, Gmail/Outlook, Instagram, Facebook [RM1] | «un equipo en La Paz» [RM1] |
| **Chicha** | Sí: «Powered by OpenAI GPT… Entiende el español boliviano» [CH1] | Catálogo de productos [CH1] | No: toma pedidos, no citas | **Sí:** «QR automático en cada pedido» [CH1] | ? | Google Maps, Yango, «Facturación SIN» (Empresarial) [CH1] | «Soporte en español boliviano» [CH1] |

**Lo que prometen los bolivianos y no se pudo verificar:** Rimay muestra como clientes a Farmacorp, Súper Ahorro, Vive Sano, Banco Sol, Tigo y UPB, más «+500 equipos activos» y «4.9 · G2», a Bs 290/mes. La captura de su producto muestra `app.rimay.bo`, un dominio que **no responde** (29-sep). Chicha vive en el dominio `oviwool.com`, que no coincide con la marca; sus enlaces de «Nosotros», «Términos», «Privacidad» y «Centro de ayuda» apuntan a `#`, y el contador de «negocios activos» del HTML arranca en 0. Ninguno de los dos muestra NIT ni razón social. **Tratarlos como posibles, no como probados.**

### 3.3 Dónde gana Onia por estar pegado al sistema
1. **Sabe quién es cada cliente.** El sistema tiene la agenda, la ficha y los cobros. Los agentes proponen mensajes con datos reales: a quién le quedó un tratamiento a medias, qué cita hay que confirmar, qué cuota venció [O: INVENTARIO 3.13]. SendyPro, Kommo o Respond.io solo saben lo que se habló en el chat. **Salvedad honesta:** que esos mensajes salgan solos por WhatsApp está «Dudoso», porque ningún negocio tiene hoy WhatsApp conectado [O: INVENTARIO 3.12].
2. **Una sola cuenta en Bs, con QR local, sin tarjeta internacional.** Kommo cobra solo en USD, con 6 meses adelantados; Leadsales, SendyPro, OpenWhats y Respond.io cobran en USD.
3. **Sale más barato que armar lo mismo con piezas.** El plan Completo (Bs 1.290) trae el sistema y el agente juntos. Kommo Pro para 3 usuarios cuesta US$135/mes (≈ Bs 1.535), pagando 6 meses de una vez (≈ Bs 9.210), y no trae ficha clínica. Leadsales Profesional + Lead Agent cuesta US$220/mes (≈ Bs 2.501).
4. **Los contactos del chat entran a Clientes** en los rubros clínicos (en comercio e importadora quedan en una tabla que no se ve, hueco ya anotado en INVENTARIO 3.15).
5. **Solo conexión oficial y transparencia con Meta.** El texto de Onia ya dice que «los mensajes te los cobra Meta directamente». Desde el 1-oct eso lo deja mejor parado que el «sin pagar por mensaje» de SendyPro.
6. **Para ir al sistema el agente no se contrata por separado:** está en el mismo panel, con los mismos usuarios y el mismo soporte.

### 3.4 Dónde pierde contra un bot especializado
1. **No improvisa.** Todos los rivales anuncian respuestas con IA; el de Onia responde por guion y deriva lo que no sabe. En una demo cara a cara con SendyPro o Kommo, esto se nota en la primera pregunta rara.
2. **No agenda.** Kommo Pro y Wati sí anuncian reservas desde el chat. La agenda de Onia existe, pero el bot no la usa.
3. **No hace difusiones ni campañas.** SendyPro, Leadsales, Wati y OpenWhats venden envíos masivos por plantilla; en Onia no existe esa pantalla (el INVENTARIO no la tiene).
4. **No contesta con audio** (SendyPro sí, con «voces LATAM»).
5. **Tiene tope:** 500 conversaciones y una recarga que vence a fin de mes, contra el «ilimitado» que anuncian SendyPro, Chicha y OpenWhats.
6. **No se puede probar el agente gratis, y la activación es manual.** La prueba de 14 días es el plan Profesional, que no trae el agente (`plan-catalogo.ts:25,99-111`). Para tenerlo hay que pagar y esperar a que Sergio apruebe el comprobante; la recarga también se aplica a mano. Además, el agente está a 4 clics y fuera del menú [O: INVENTARIO 3.8]. En SendyPro, Kommo, Respond.io o Rimay, la prueba ya trae el bot o la bandeja.
7. **Instagram y Facebook están apagados**; Kommo, Respond.io, ManyChat y Rimay los traen.
8. **La conexión del número no está probada con un cliente real.** Los rivales conectan miles de números.

---

## 4. Qué copiar y qué NO

### Copiar
| Qué | De quién | Cómo se ve en Onia |
|---|---|---|
| **Un solo número que cambia entre planes.** «Elige tus conexiones. Todo lo demás es ilimitado.» | SendyPro [SP1] | Onia ya tiene un solo precio. Falta mostrar el cupo de 500 como algo que casi nadie alcanza, no como un límite, y decir en la misma línea lo que cuesta la recarga |
| **Un registro de 4 campos, «Sin tarjeta de crédito» bajo el botón y el país preseleccionado** | SendyPro [SP2] | En `/register`, preseleccionar +591 y Bolivia; «Sin tarjeta» bajo el botón |
| **Elegir la conexión con los pros escritos en lenguaje de dueño** («Recomendado: número verificado por Meta… sin riesgo de bloqueo») | SendyPro [SP3] | En «Conectar mi WhatsApp», un recuadro que diga por qué la conexión oficial protege el número (sin prometer que nunca habrá un bloqueo) |
| **4 pasos visibles:** Conecta → Configura → Activa → Escala | SendyPro [SP1] | El asistente del agente con los mismos 4 pasos y un contador de avance |
| **Decir en la página de precios quién cobra los mensajes** | Respond.io, Kommo [RI2, KO2] | Ya está en el texto; sumar un cálculo: «una conversación típica te cuesta ≈ Bs 0,4 a 0,8 en Meta» (`pricing.ts:205-206`) |
| **Mostrar el precio en la moneda del cliente** | Kommo muestra BOB aunque cobra en USD [KO1] | Onia cobra en Bs: decirlo arriba y en grande, «precios en bolivianos», como Chicha y Rimay |
| **Leer el comprobante que manda el cliente por el chat** | SendyPro (OCR), Chicha (QR por pedido) | Onia ya entiende fotos. Conectado a Cobros, el bot podría proponer registrar el pago, y eso solo lo puede hacer quien tiene el sistema. **Anotado como idea, no es de esta sesión** |
| **Transparencia de costos de IA** («0% markup», al costo del proveedor) | Lety [LE1] | Ya aplica: el costo de IA de Onia es casi cero; se puede decir |

### NO copiar
| Qué | Por qué |
|---|---|
| Conexión por QR / WhatsApp Web (SendyPro, OpenWhats, Leadsales Básico) | Los términos de WhatsApp lo prohíben [M2]; el cliente arriesga su número y Onia su reputación |
| «Sin pagar por mensaje» con la API oficial | Desde el 1-oct Meta cobra cada mensaje de servicio [M1]; sería engañar al cliente |
| «Ilimitado», «500+ empresas», «4.9», testimonios con nombre e inicial | Regla de Onia: no fabricar. Ninguno de esos números se pudo verificar |
| Modelos elegibles con etiquetas como «Sin ética» | Riesgo de marca y legal |
| Precio por usuario con 6 meses de mínimo (Kommo) | Castiga a la clínica que suma una recepcionista; va contra el precio simple mensual de Onia |
| Campañas masivas, «calentamiento» de números, extractor de contactos | Es cultura de spam; no le sirve a una clínica y quema números |
| Cobros intermediados liquidados en USDT (SendyPay) | Riesgo regulatorio y de confianza en Bolivia |
| Logos de marcas grandes sin permiso (Rimay) | Si no son clientes, es publicidad engañosa |

---

## 5. Qué solo se ve con cuenta y en qué orden conviene abrirla

Esto lo hace Sergio Urcullo; yo no creo cuentas. **Ninguna con tarjeta.** Ningún QR con el número de Onia: si alguno pide conexión por QR, no conectar.

| Orden | Producto | Cómo se entra | Por qué primero | Qué mirar |
|---|---|---|---|---|
| 0 | **SendyPro** | Ya abierto por la sesión principal | Es el que motivó el estudio | Cuánto dura la prueba real; qué pide Embedded Signup y si deja elegir quién paga a Meta; cómo se carga el conocimiento (¿solo prompt?); cómo responde la IA una pregunta de clínica; qué hace «modo fácil»; qué países tiene activos SendyPay; precio en Bs si lo muestra |
| 1 | **Kommo** | 14 días sin tarjeta [KO1] | Es el único que junta **bot con IA y agenda** en un plan (Pro): el rival más directo del «sistema + agente» de Onia | Cuánto tarda en quedar agendada una cita por chat; si esa reserva se ve en un calendario usable por una recepcionista; cuántos clics hasta conectar WhatsApp; el total real para 3 usuarios × 6 meses |
| 2 | **Respond.io** | 7 días sin tarjeta [RI1] | Es la mejor referencia de calidad de agente con IA | Cómo se crea el agente (¿se describe en una frase?); de dónde saca el conocimiento; cómo pasa la conversación a un humano; cómo muestra el costo de Meta |
| 3 | **Rimay** | 14 días sin tarjeta [RM1] | Es el rival local declarado, con SIAT + QR Simple | Si el registro funciona de verdad y qué pasa con `app.rimay.bo`; si la integración SIAT existe; si la IA responde sola o solo sugiere |
| 4 | **Wati** | 7 días [WA1] | Muestra «Reservar cita» y una base de conocimientos | El precio real (el sitio no lo muestra sin cuenta); si cobra recargo sobre Meta; qué hace «Reservar cita» |
| 5 | **Leadsales** | 14 días [LS1] | Es el más vendido en Latam para ventas por WhatsApp | Solo si Sergio quiere ver el «Lead Agent»; en el plan Básico **no conectar el número** (WhatsApp Web) |
| — | OpenWhats | 7 días sin tarjeta | No hace falta | Se conecta por WhatsApp Web; mirarlo por dentro no aporta y el número corre riesgo |
| — | Chicha, ManyChat | Chicha no tiene registro propio (solo demo); ManyChat bloquea la lectura de su web | Baja prioridad | Chicha: pedir la demo solo si aparece en una venta real |

**Qué anotar en cada uno (lo mismo en todos):** minutos desde el registro hasta la primera respuesta del bot; qué pide para conectar WhatsApp (Meta, número, tarjeta); si agenda y dónde queda la cita; el total del mes en Bs para una clínica de 3 personas; una captura a 375 px.

---

## Fuentes (todas vistas el 29-sep-2026)

**Meta y WhatsApp**
- [M1] Meta, cobro de mensajes sin plantilla. Dice: «Effective October 1, 2026, Meta will charge for service messages»; las tarifas son las de utility y autenticación; «Meta does not offer volume tiers for service messages»; los mensajes que vienen de anuncios siguen con 72 h gratis. https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages [W]
- [M2] Términos de servicio de WhatsApp (versión fuera de Europa): prohíbe «bulk messaging, auto-messaging» y el software no autorizado que funcione como sus servicios. https://www.whatsapp.com/legal/terms-of-service [W]

**SendyPro**
- [SP1] Web de marketing. https://sendypro.com [W]
- [SP2] Pantalla de registro. https://app.sendypro.com/signup [W]
- [SP3] Código público de la app, `main.b91b0c0c.js` (8,2 MB, el que se sirve hoy). https://app.sendypro.com/static/js/main.b91b0c0c.js [C]
- [SP4] Términos («Última actualización: Enero 2026»). https://sendypro.com/terms-of-service [W]
- [SP5] Política de privacidad («Última actualización: 26 de septiembre de 2026»). https://sendypro.com/privacy-policy [W]
- [SP6] Canal oficial de YouTube. https://www.youtube.com/@sendyproyt [W]
- [SP7] Video de un afiliado, «SendyPro: Cómo empezar GRATIS tu Chatbot de WhatsApp con IA | Polo Marketing», 17-mar-2026, 1.014 vistas. Menciona los «3 días gratis» y la conexión por QR o API. https://www.youtube.com/shorts/9KHpMJPf9Cs [G, puede estar viejo]
- [SP8] Google Play. https://play.google.com/store/apps/details?id=com.sendypro.app [W]

**Rivales**
- [OW1] OpenWhats. https://openwhats.com/ · [OW2] OpenWhats Bolivia. https://openwhats.com/crm-whatsapp-bolivia [W]
- [KO1] Kommo, precios. https://www.kommo.com/es/precios/comparar-planes/ · [KO2] Kommo, WhatsApp CRM. https://www.kommo.com/es/whatsapp-crm/ [W]
- [RI1] Respond.io, precios. https://respond.io/pricing · [RI2] Respond.io, WhatsApp API. https://respond.io/whatsapp-business-api [W]
- [WA1] Wati, precios. https://www.wati.io/es/pricing/ · [WA2] Wati, portada. https://www.wati.io/ [W]
- [MC1] ManyChat, precios. https://manychat.com/pricing (bloquea la lectura automática; el dato viene del resumen del buscador) · [MC2] Foro oficial de ManyChat, abril de 2026, sobre los precios del 2-mar-2026. https://community.manychat.com/general-q-a-43/2026-new-pricing-plan-api-only-available-on-the-200-month-plan-9535 [F] · [MC3] Centro de ayuda, guía de precios de WhatsApp. https://help.manychat.com/hc/en-us/articles/14281380243740-WhatsApp-pricing-guide [G, puede estar viejo]
- [LS1] Leadsales, precios. https://leadsales.io/precios/ [W]
- [RM1] Rimay. https://rimay.tech/ [W]
- [CH1] Chicha. https://www.oviwool.com/ [W]
- [LE1] Lety, precios. https://lety.ai/pricing [W]

**Onia**
- `onia-platform-v1-integracion-20260927/lib/pricing.ts` (agente, recarga y tarifas de Meta)
- `onia-platform-v1-integracion-20260927/lib/plan-catalogo.ts` (en qué planes está incluido)
- `hermes-content/docs/research/onia-1.0-29sep/INVENTARIO_POR_RUBRO.md` (secciones 3.8, 3.12-3.14 y 6)

**Vistos y dejados fuera de la matriz (una línea cada uno)**
- **Lety** (la referencia de Sergio Urcullo): hoy vende una **plataforma de marca blanca para agencias**, no un bot para el dueño de una clínica. Cuesta US$97, 297 o 497/mes, «A credit card is required at signup via Stripe», con prueba de 7 días. Cobra los tokens de IA y los mensajes de Meta al costo, con «0% markup» [LE1].
- **Optimify**: de Bucaramanga, Colombia, con una página «Bolivia». Dice ser Meta Business Partner, usa OpenAI o DeepSeek, cuesta US$49, 69 o 249/mes pagando el año, y pide tarjeta para la prueba. https://optimify.ai/
- **Runia**: de Rosario, Argentina, con una página «Bolivia». Dice usar la API oficial, agendar y cobrar con QR Simple y Tigo Money; precio solo «en una reunión». https://runia.ar/bo/chatbot-whatsapp
