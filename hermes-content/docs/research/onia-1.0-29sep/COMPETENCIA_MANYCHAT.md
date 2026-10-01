# ManyChat por dentro, comparado con el «Agente conversacional de WhatsApp» de Onia

Para Sergio Urcullo. Lo recorrí el **29-sep-2026** con la cuenta que él creó (plan Free, sin ningún canal conectado) y con la web pública de hoy. Fue **solo lectura**: no conecté canales, no instalé plantillas, no activé la prueba, no generé la clave de API y no escribí en el chat de soporte.

Este documento complementa `COMPETENCIA_BOTS_WHATSAPP.md` y no lo reemplaza. En §3.2 están las correcciones a su fila de ManyChat.

**Cómo leer las marcas de fuente**

| Marca | Qué es |
|---|---|
| [A] | Visto dentro de la app (`app.manychat.com`, cuenta de Sergio Urcullo, plan Free, sin canal) |
| [W] | Web pública viva de ManyChat hoy (`manychat.com`) |
| [PU] | Anuncio oficial de producto de ManyChat, con fecha (`community.manychat.com/product-updates`). Es del fabricante y tiene fecha, pero no lo vi funcionar |
| [F] | Foro o comentario de terceros, con fecha |
| [O] | Repo de Onia (solo lectura) |
| ? | No se pudo verificar |

**Bolivianos:** uso 11,37 Bs por USD, el tipo de referencia del proyecto (`onia-platform/lib/pricing.ts:35`). Sirve para comparar; no es el tipo del día.

---

## 1. Veredicto en 8 líneas

1. **ManyChat es una herramienta para crecer en Instagram, no para atender pacientes.** El inicio, el banner fijo, la lista de primeros pasos, las 27 plantillas y el buscador de plantillas dan por hecho Instagram. Buscar «clinica» o «cita» no devuelve ninguna plantilla [A].
2. **Sin conectar un canal casi no se ve nada.** 5 de los 7 ítems del menú (Contactos, Automatización, IA, Bandeja, Broadcasts) abren la misma ventana «Conectar canal». Si se entra directo por la dirección, sale un error 500 [A]. No hay datos de demostración ni un espacio de prueba.
3. **WhatsApp es de pago: desde el plan Pro, US$39/mes (≈ Bs 443) o US$29/mes pagando el año (≈ Bs 330/mes, Bs 3.957 de una vez).** El cobro es en dólares y con tarjeta. Los mensajes de Meta se pagan aparte, cargando una «billetera» de ManyChat [A, W].
4. **La IA ya viene dentro de Pro y es su parte más trabajada.** Tiene conocimiento cargado a mano o importado de una web, tono y límites, un espacio para probarla que marca lo que le falta y muestra de dónde sacó cada respuesta, y detección de intención [W, PU]. Su propia web se contradice: una página dice que la IA es un extra de US$29/mes [W].
5. **No agenda citas ni conoce al cliente.** No tiene calendario propio ni integración con Calendly o Google Calendar. Sus cobros son Stripe y PayPal, y Stripe no trabaja con Bolivia. Todo lo que sabe de una persona es lo que se habló en el chat [W].
6. **Frente a Onia, el precio se parece** (Bs 330-443 contra el agente a Bs 390). **La diferencia está en lo que hay atrás:** Onia tiene agenda, fichas y cobros en Bs con QR. ManyChat tiene un constructor de flujos, difusiones y una IA que redacta.
7. **Onia pierde en dos cosas:** entender lo que el paciente quiso decir aunque no use las palabras exactas, y dejar que el dueño vea rápido qué preguntas su agente no sabe contestar. Las dos se pueden resolver sin que el agente invente respuestas (§5).
8. **No vale la pena imitar el constructor visual de flujos, los sorteos para crecer en Instagram ni la billetera prepaga.** Son para quien hace marketing de redes. El dueño de una clínica quiere que le contesten y le llenen la agenda.

---

## 2. Mapa completo (lo que se ve sin canal)

Menú lateral [A]: Inicio · Contactos · Automatización · IA de Manychat · Bandeja de entrada · Broadcasts · Configuración · (abajo) Mi perfil · Ayuda. Arriba del menú está el selector de cuenta («New account» con el sello FREE).

### 2.1 Inicio (`/fb5683639/dashboard`), 0 clics
| Elemento | Qué dice / qué haría | Nota de UX |
|---|---|---|
| Banner fijo oscuro | «Conecta tu cuenta de Instagram para empezar a usar Manychat» + «Conectar» + «Chatea con nosotros» (chat de soporte Intercom) | Aparece en todas las pantallas. Asume Instagram |
| Banner promocional | «TikTok × Manychat. Ahora estamos hablando» + «Descubrir» | Publicidad propia arriba del contenido |
| Saludo | «¡Hola, OnIA!» + «+ Conectar canales» (abre la ventana de canales) | Personal y directo |
| «Empieza aquí» | 3 plantillas «Quick Automation»: Saludá a tus nuevos seguidores (NEW, BETA), Enlaces de DM automáticos desde los comentarios (POPULAR), Generar leads con historias. Botón «Instalar la plantilla» (no se tocó: crea una automatización) + «Explora todas las plantillas» | Etiquetas en inglés |
| «Tus próximos mejores pasos» | «Primeros pasos · 0 of 4 completed»: Enviar enlaces de productos afiliados · Saluda a los nuevos seguidores · Convierte seguidores en comentarios · Configurar respuesta predeterminada | Los 4 abren «Conectar canal» con **solo Instagram** |
| «Tus últimos 7 días» | 4 tarjetas: Ganadores de la interacción · Tiempo ahorrado · Leads recopilados · El mejor recopilador de leads. Vacías, con el texto «No hay datos. Inicia una automatización y vuelve a comprobarlo en 24 horas» + «Explorar plantillas» | Buen estado vacío: dice cuándo va a haber datos y qué hacer |

### 2.2 Ventana «Conectar canal» (1 clic desde casi cualquier lado)
| Canal | Texto | Botón | Plan |
|---|---|---|---|
| Instagram | «Potencia tu marketing de Instagram con la automatización de mensajería» | Conectar | Free |
| TikTok | «Eleva tu marketing con la automatización perfecta de TikTok» | Conectar | Free |
| WhatsApp | «Utiliza la aplicación de mensajería más popular del mundo para chatear e incorporar a tus clientes» | Conectar | **UPGRADE** (Pro) |
| Facebook | «Construye relaciones con los clientes a través de contenido interactivo y personalizado» | **«Volver A Conectar»** (no se tocó) | Free |
| SMS | «Recopila números de teléfono y vuelve a incorporar a tus contactos a través del texto» | Conectar | UPGRADE |
| Telegram | «Liberar el poder de la automatización ilimitada de mensajería de Telegram» | Conectar | Free |
| Correo electrónico | «Utiliza el marketing por correo electrónico…» | Conectar | UPGRADE |

No se tocó ningún «Conectar». Que Facebook diga «Volver a conectar» sugiere que la cuenta ya tuvo un vínculo con Facebook; conviene que Sergio Urcullo no lo apriete.

### 2.3 Contactos, Automatización, IA de Manychat, Bandeja de entrada, Broadcasts
- Con un clic se abre «Conectar canal». No hay vista previa, datos de ejemplo ni recorrido guiado [A].
- Entrar directo a `/cms`, `/subscribers` o `/chat` da la página «The Server Isn't Feeling Super-Duper · Error 500» [A]. **Una cuenta nueva recibe un error del servidor en lugar de una explicación.**
- Lo que tienen adentro sale de §2.8 y §2.9 (tabla de precios y anuncios oficiales).

### 2.4 Plantillas (Inicio → «Explora todas las plantillas», 1 clic)
- Ventana «Plantillas» con buscador («Buscar plantillas de Instagram…»), **una sola categoría** («Todas las plantillas») y el botón «+ Comenzar desde cero» (no se tocó) [A].
- **27 tarjetas: 7 «Quick Automation» (asistente de pocos pasos) y 20 «Flow Builder» (flujo completo).** 5 dicen UPGRADE. Hay 3 duplicadas: «Responde todos tus DMs», «Generar leads con historias» y «Convierte seguidores en comentarios».
- Temas: bienvenida a seguidores, DM desde comentarios, historias, Lives, sorteos y rifas, «Sígueme primero, luego un regalo», lead magnet, cupones, test para calificar clientes, RSVPs, recopilar correos, «Reconocer preguntas en DMs con IA» (IA, UPGRADE), «Ve de Instagram a WhatsApp» y «Haz crecer tu lista de WhatsApp».
- **Búsquedas:** «clinica» y «cita» → «Ninguna plantilla encontrada». «whatsapp» → 2, las dos para pasar gente de Instagram a WhatsApp.
- **No hay plantillas por industria.** Tampoco hay salud, clínicas, comercio ni servicios. En la web, «Soluciones por tipo de negocio» ofrece creadores, eCommerce, marketers de redes, agencias y marcas [W].
- Con WhatsApp conectado, ¿la galería muestra otras plantillas? ? La web dice «60+ ready-made templates» y yo vi 27.

### 2.5 Configuración (`/settings`, 1 clic)
| Sección | Qué se ve | Botones |
|---|---|---|
| General | Acortador de enlaces «My.Many.Chat» (si se apaga, no hay datos de clics) · **Zona horaria «(UTC-04:00) - Venezuela Time»** (Bolivia no aparece con su nombre) · Conectar a otra cuenta · Usar como plantilla · Eliminar cuenta | «Clonar Esta Cuenta» y «Crear Plantilla De Cuenta» (grises, desactivados) · «Eliminar» (no se tocó) |
| Facturación → Suscripciones | «Tu plan: Free» · «El precio de tu plan se basa en el número de contactos… Establece un límite de contactos para controlar el tamaño de tu lista y la cantidad que pagas» · barra 0/25 · «Puestos en Inbox 1/1» · «Precio 0 US$» · «Contactos 0/25» | «Activar Prueba» → abre la ventana de planes (§3.1). No se eligió nada adentro |
| Canales → Instagram / TikTok / Messenger / Telegram | Un párrafo de venta y «Conectar». Messenger dice «Vende productos, reserva citas, cultiva leads…» | Conectar (no se tocó) |
| Canales → **WhatsApp** (2 clics) | Sello **UPGRADE** · «WhatsApp para tu empresa · Llega a una audiencia global en WhatsApp con broadcasts, automatización y respuestas en Inbox» · «Obtén más información» | Conectar (no se tocó; requiere Pro) |
| Canales → SMS / Correo | UPGRADE + texto de venta | Conectar (no se tocó) |

**No aparecen sin canal:** campos del contacto, etiquetas, equipo, integraciones, pagos, billetera de WhatsApp ni notificaciones. Es probable que aparezcan al conectar (?).

### 2.6 Mi perfil (menú de abajo, 1 clic) → `app.manychat.com/profile/…`
- Menú: Gestionar cuentas · Informes de mensajes · «Funciones avanzadas»: Mis plantillas, Configuración de API · Idioma (Español) · «Añadir opciones de inicio de sesión» (Facebook, Google, Apple, Telegram) · Cerrar sesión [A].
- **Cuentas:** tabla con Nombre, Suscripción, Rol, Chats de inbox asignados, Contactos, Fijar y Ocultar. Muestra una fila: «New account · FREE · Administrador · 0 · 0». Botón «+ Nueva Cuenta» (no se tocó).
- **Mis plantillas:** «Con las plantillas de Manychat, puedes compartir y reutilizar un bot entero o un conjunto determinado de elementos» · «Crear Mi Primera Plantilla» (no se tocó). Es el camino de las agencias: armar un bot una vez y copiarlo a cada cliente.
- **Configuración de API:** «API de perfil de ámbito público» · «Genera Tu Clave De API» (no se tocó) · enlace a Swagger.
- **Informes de mensajes** → «Control de conformidad de ventanas de mensajería». Es un informe semanal de los bots que intentaron escribir fuera de la ventana de 24 h. Hoy dice «¡Buenas noticias! La semana pasada transcurrió con normalidad».

### 2.7 Ayuda (1 clic)
Recibe ayuda · Base de conocimientos · Preguntar a la Comunidad · **Contratar una agencia** · Compartir una idea · Registro de cambios · Blog · Términos · Política de privacidad · Configuración de privacidad [A]. Lo que dice: el soporte se apoya en la comunidad y en agencias externas.

### 2.8 Constructor de flujos: qué piezas tiene (de la tabla de precios, no lo vi funcionar)
Tabla comparativa de `manychat.com/pricing` [W]:
- **Disparadores:** comentario → DM, seguir → DM, respuesta a historia, mención en historia, comentario en Live, palabras clave, «Conversation Starters» (temas para elegir al escribir), respuesta por defecto, enlaces de referencia (link, **código QR** o botón en una web), anuncios de Meta que abren Instagram, Messenger o **WhatsApp**, anuncios de TikTok y **reconocimiento de intención con IA** («según la intención, no palabras exactas»).
- **Bloques:** enviar mensaje (con links, PDF e imágenes), capturar datos (correo, teléfono y texto), comprobar si la persona te sigue, etiquetas, **acciones y condiciones** («rutear según respuestas, etiquetas o datos externos»), randomizador A/B (hasta 12 caminos desde abr-2026 [PU]), **paso de IA** y actualizar un público personalizado de Instagram [PU, sep-2025].
- **Dos modos:** «Quick Automation» (asistente) y «Flow Builder» (lienzo), según las etiquetas de las plantillas [A].
- **Asistente de flujos:** se le dice el objetivo en una frase y arma el flujo; también mejora textos («Text Improver») [W: /product/ai].

### 2.9 Manychat AI (lo que anuncian en 2026; no se ve sin canal)
| Pieza | Qué hace | Fuente |
|---|---|---|
| Knowledge v2 | «+ New Knowledge» → Link o Texto. Importa el texto de una página web, se revisa y edita antes de activarlo y se puede volver a leer la página | [PU 24-feb-2026] |
| Behavior | Rol («Marketing Coach»), voz de marca y **límites** («lo que la IA nunca debe decir o hacer»). Propone los tres campos leyendo la biografía y los comentarios de Instagram | [PU 8-abr-2026] |
| Playground | Botón «Test AI», **3 preguntas sugeridas**, **detecta huecos** («cuando falta información») y deja cargarla ahí mismo; **muestra qué fuente usó cada respuesta**, con pulgar arriba o abajo. «Decide quién atiende las conversaciones sin respuesta antes de activar» | [PU 3-mar y 18-mar-2026] |
| AI Replies | Contesta preguntas frecuentes con el conocimiento guardado | [W] |
| AI Comments | Responde comentarios positivos. **El dueño aprueba cada respuesta** | [W] |
| AI Goals | La IA empuja la charla hacia un objetivo: clic, seguir o dato | [W] |
| AI Step | Paso dentro de un flujo: objetivo + contexto de hasta 10.000 caracteres. Tiene seguimientos automáticos | [W, PU] |
| Contexto total | «Hasta 250k caracteres de contexto» | [W: /product/ai] |
| Modelo | No lo dicen. En el plan Pro se puede conectar ChatGPT, Claude o DeepSeek con clave propia | [W] |
| Calidad fuera del inglés | Un hilo de su foro (hace ~10 meses): «los AI Steps cometen muchos errores» en árabe; otro usuario de español dice que funciona si se parte en pasos chicos | [F] |

---

## 3. Planes y precios de hoy (29-sep-2026)

### 3.1 La tabla (igual en la ventana de la app [A] y en la web [W])
Precios para Bolivia: los enlaces de la web llevan `country=bo` y dicen «The price is determined by the user's billing country». **Todo está en US$; no hay precio en Bs.** Impuestos aparte. La ventana de la app viene en «Anualmente» por defecto.

| Plan | Mensual | Anual (por mes) | ≈ Bs/mes (mensual · anual) | Contactos activos/mes | Canales | Usuarios | WhatsApp | IA |
|---|---|---|---|---|---|---|---|---|
| Gratis | 0 | 0 | 0 | 25 | 2 de: Instagram, Messenger, TikTok, Telegram | 1 | No | No |
| Essential | US$17 | US$14 (US$168/año) | 193 · 159 | 250 | 2 (mismos) | 2 | No | No |
| **Pro** («Más popular») | **US$39** | **US$29** (US$348/año) | **443 · 330** | 2.500 | 3, ahora con WhatsApp, SMS y correo | 3 | **Sí** | **Sí** |
| Business | US$99 | US$69 (US$828/año) | 1.126 · 785 | 7.500 | Ilimitados | 5 | Sí | Sí |
| Advanced | US$199 | US$139 (US$1.668/año) | 2.263 · 1.580 | 25.000 | Ilimitados | 10 | Sí | Sí |

**Cómo cobran de más (facturación por contactos):**
- «Contacto activo» = una persona con la que hubo intercambio en el mes, sin importar cuántos mensajes. Si se pasa el cupo, **las automatizaciones no se cortan**: se cobra un extra por persona y el dueño puede fijar un tope de excedente. Mandan avisos por correo y dentro de la plataforma al acercarse al límite [W].
- Precio por contacto de más (mensual / anual): Essential US$0,10 / 0,082 · **Pro US$0,05 / 0,038 (≈ Bs 0,57 / 0,43)** · Business US$0,025 / 0,018 · Advanced US$0,004 / 0,0028.
- Puesto extra en la bandeja: US$25/mes (≈ Bs 284) en Pro, Business y Advanced. Topes de puestos: 1, 1, 3, 5 y 10.
- Mensajes de WhatsApp (Meta): «adicional a Manychat Pro… carga tu Manychat Wallet en Configuración» [W: /product/whatsapp]. Si ManyChat le suma un recargo a Meta: ?

**Prueba y tarjeta:**
- Essential y Pro: 14 días gratis. Botones «Prueba gratis por 14 días» en la app y «Try 14 days for free» en la web.
- La web se contradice: las preguntas de precios dicen «Paid plans do require [a credit card]» y /product/ai dice «Start your free trial — no credit card required». No se comprobó porque no se inició la prueba.
- Reembolso si se cancela antes de los 30 días; un plan anual no se puede bajar hasta que termine [W].

**Diferencias por plan que le importan a una clínica** [W, tabla completa]:
- Captura de datos, acciones y condiciones: desde Essential.
- Difusiones y plantillas aprobadas de WhatsApp: desde Pro.
- IA completa (respuestas, conocimiento, paso de IA, intención): desde Pro.
- **Asignar conversaciones al equipo: recién en Business (US$69-99).**
- Etiquetas con reglas en la bandeja: 2 en Essential, 7 en Pro, 20 en Business.
- Integraciones: Google Sheets desde Essential. Zapier, Make, API, ChatGPT, Claude, DeepSeek, HubSpot, Klaviyo, Mailchimp, ActiveCampaign, Kit, Twilio, Flodesk, Hotmart, Stripe y PayPal desde Pro.
- **Calendly, Google Calendar y Shopify no figuran** en `manychat.com/integrations` [W].
- Soporte: autoservicio en Free, correo en días hábiles en Essential y Pro, prioritario en Business y Advanced.

### 3.2 Correcciones a la fila de ManyChat en `COMPETENCIA_BOTS_WHATSAPP.md` (no edité ese archivo)
| Decía | Visto hoy |
|---|---|
| «Pro ≈ US$29 (anual) o US$39 (mensual) según el buscador… Advanced US$139/199» | **Confirmado** en la app y en la web. Además hay **Essential (US$14/17) y Business (US$69/99)**; son 5 planes, no 3 |
| «Plan gratis ?» | **Existe:** US$0, 25 contactos activos, 2 canales, **sin WhatsApp**, 4 automatizaciones activas, 1 usuario, con la marca «Desarrollado por Manychat» |
| «Respuestas con IA incluidas en Pro (según el buscador)» | **Confirmado** en la ventana de planes de la app. Salvedad: `/product/ai` todavía dice «Manychat AI is an add-on to Manychat Pro, and costs $29/month» |
| «¿Usa lo que sabe el negocio? ?» | **Sí:** conocimiento en texto o importado de una web, hasta 250 mil caracteres (§2.9) |
| «¿Agenda citas? ?» | **No de forma nativa:** no hay calendario ni integración de agenda en la lista. Habría que armarlo con Zapier, Make o la API |
| «¿Cobra? ?» | Stripe y PayPal desde Pro. En Bolivia no le sirve a un negocio local ([O] memoria: Stripe no acepta Bolivia) |
| «Bandeja multiagente: Limitada» | 1 puesto en Free y Essential, 3 en Pro. Asignar al equipo, solo desde Business |
| «Se paga desde una billetera [G, puede estar viejo]» | **Confirmado por la web viva** (/product/whatsapp). Pero esa misma página promete «las primeras 1.000 conversaciones del mes gratis», el esquema de Meta ya reemplazado. Desde el 1-oct-2026 Meta cobra cada mensaje de servicio (ver [M1] en el estudio previo). **La web de ManyChat está vieja justo en el costo** |
| «Soporte ?» | Autoservicio, correo en días hábiles o prioritario según el plan, más «Contratar una agencia» en el menú de Ayuda |
| (no estaba) | Su preguntas frecuentes de WhatsApp dicen que, **una vez conectado, el número deja de usarse en la app WhatsApp Business**, y recomiendan un número nuevo o uno que da ManyChat. Puede estar viejo (Meta ya permite usar las dos cosas a la vez); no se verificó |

---

## 4. ManyChat contra el agente conversacional de Onia

| Función | ManyChat (Pro) | Onia (agente) |
|---|---|---|
| Precio para tener WhatsApp | US$39/mes o US$348/año (≈ Bs 443 o 330/mes) [W] | Bs 390/mes o Bs 3.900/año, **además del plan del sistema** (Básico Bs 320 + agente = Bs 710); incluido desde Completo (Bs 1.290) [O: pricing.ts:86-172] |
| Moneda y pago | US$ con tarjeta; sin Bs | Bs, transferencia o QR; sin tarjeta internacional [O] |
| Qué se mide | 2.500 personas distintas por mes; lo de más se cobra solo, sin cortar | 500 conversaciones/mes; recarga de 200 por Bs 190 que se pide por WhatsApp, se aplica a mano y vence a fin de mes [O] |
| Prueba | 14 días de Pro (con WhatsApp e IA); lo de la tarjeta se contradice | 14 días del plan Profesional, que **no trae el agente**; se activa cuando Sergio aprueba el comprobante [O: INVENTARIO 3.8] |
| Conexión de WhatsApp | Oficial (dice ser Meta Business Partner); recomienda un número nuevo | Oficial con Embedded Signup; **nunca se conectó el número real de un cliente** [O] |
| Mensajes de Meta | Billetera prepaga en ManyChat; recargo ? | El cliente los paga directo a Meta en su cuenta, sin recargo; ≈ Bs 0,13 por mensaje de servicio desde el 1-oct [O] |
| Cómo responde | La IA redacta con el conocimiento y el tono cargados; paso de IA dentro de flujos | **Por guion**, con lo que cargó el dueño; lo que no sabe lo deriva. La IA (gpt-4.1-mini) solo entiende fotos, transcribe audios y ayuda a editar [O] |
| Entender sin palabras exactas | Sí: «Intention Recognition» [W] | No: guion. El campo «campañas» usa la frase exacta del anuncio [O: INVENTARIO 3.8] |
| Cargar lo que sabe | Texto o link de la web; se revisa antes de activar [PU] | Formulario de 3 pestañas + «Responder 6 preguntas» (sin IA) + «Enseñale conversando» (la IA propone el cambio y muestra la diferencia) [O] |
| Tono y límites | «Behavior»: rol, voz y lo que nunca debe decir [PU] | «Cómo se presenta»; los límites vienen solos porque no improvisa [O] |
| Probar antes de publicar | Playground: 3 preguntas sugeridas, huecos detectados, fuente de cada respuesta, pulgar [PU] | «Probá tu agente»: preguntas de ejemplo, contesta con el borrador sin publicar. No marca huecos ni fuente [O] |
| Pasar a una persona | Se elige antes de activar quién atiende lo que la IA no responde [PU]; bandeja con puestos | Deriva con la conversación completa; en «Conversaciones», cuando responde una persona el bot se hace a un lado [O] |
| Agendar | No nativo | No: deriva. **El sistema tiene agenda y reserva en línea, pero el agente no las usa** [O] |
| Saber quién es el cliente | Solo el chat, etiquetas y campos | Agenda, ficha y cobros; los agentes proponen mensajes con datos reales (tratamiento a medias, cuota vencida) [O] |
| Difusiones | Sí, desde Pro, con plantillas aprobadas de Meta; mensajes de marketing de WhatsApp desde abr-2026 (no para EE. UU.) [W, PU] | No hay pantalla de difusión; mensajes 1 a 1 que el dueño aprueba en Pendientes [O] |
| Constructor de flujos | Lienzo visual + asistente + 27 plantillas de Instagram | No hay lienzo; formulario por rubro |
| Plantillas por industria | Ninguna (0 de salud) | El formulario y el vocabulario cambian por rubro (`lib/onboarding/vocabulario.ts`) [O] |
| Canales | Instagram, TikTok, Messenger, Telegram, WhatsApp, SMS y correo (3 en Pro) | WhatsApp y chat web; Facebook e Instagram apagados [O] |
| Integraciones | Sheets, Zapier, Make, API, HubSpot, Stripe, PayPal y más | Agenda, fichas, cobros y agentes del propio sistema |
| Primer contacto | Todo pide conectar Instagram; un clic en casi todo lleva a la misma ventana | Agente a 4 clics, fuera del menú [O: INVENTARIO 3.8] |
| Idioma | Castellano mezclado: sellos en inglés (NEW, BETA, UPGRADE, «Quick Automation», «New account»), «Saludá» junto a «Saluda», frases traducidas raras («Energía de gran jefe») | Castellano de Bolivia con voseo parejo |
| Soporte | Autoservicio, correo o prioritario según el plan; comunidad; agencias | Por WhatsApp con Sergio Urcullo [O] |
| Celular | App móvil para la bandeja en todos los planes [W]. No medí la web a 375 px (§6) | Web instalable con avisos; la bandeja a 375 px no se midió en este estudio |

---

## 5. Ideas para evaluar

Sergio Urcullo, 29-sep: «si ves algo en esa plataforma no significa que sea mejor que la nuestra ni que haya que copiarlo; son ideas, estamos analizando cómo trabajan». Por eso cada fila parte de un **problema del cliente de Onia** (clínica de Santa Cruz, 2-6 profesionales, con recepción), no de que ManyChat lo tenga. «Choca con» usa las reglas de Onia:

- **Velocidad:** que no haga más lento ni más largo el uso.
- **Honestidad:** no fabricar, no prometer lo que no hace, no mostrar obra en curso.
- **Multi-rubro:** que sirva a más de un rubro.
- **Etapa:** etapa 1 vigente = dental y estética, 0 → 5 clientes, alta a mano (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7).

Ordenadas por valor para el cliente contra esfuerzo.

| # | Idea (qué se vio) | Qué problema del cliente de Onia resolvería | Choca con | Costo | Lectura |
|---|---|---|---|---|---|
| 1 | **Mostrar los huecos del agente** (Playground: marca la pregunta que no supo responder y deja cargar la respuesta ahí) | El dueño no sabe qué le falta cargar. El agente deriva de más y la recepción sigue igual de ocupada | Nada: va con la honestidad (muestra lo que el agente no sabe). Con la etapa suma: menos horas de soporte por cliente (§9 de la estrategia) | Bajo-medio: «Probá tu agente» y el registro de derivaciones ya existen; falta listar «lo que derivó esta semana» con un botón para cargar la respuesta | La de mejor relación valor/costo |
| 2 | **Reconocer la intención**, no la frase exacta (Intention Recognition) | El paciente escribe «cuanto sale», «precio?», «q valor tiene la limpieza». Si el guion no lo reconoce, lo deriva: es la brecha n.º 3 del estudio previo | Honestidad, si se usa para redactar libre. **No choca si la IA solo elige cuál de las respuestas que cargó el dueño corresponde** (o deriva). Así el nombre «agente conversacional» sigue siendo cierto | Medio: clasificar con el LiteLLM que ya existe, costo de IA casi cero ([O] pricing.ts:195-198). Hay que medir con preguntas reales de dental | Evaluar con datos: primero medir cuántas derivaciones son por redacción y no por falta de dato |
| 3 | **Respuestas iniciales por rubro** (lo que ManyChat NO tiene: 0 plantillas de salud) | «Nada vacío»: hoy el agente arranca con lo que el dueño llene | Honestidad: **no poner precios ni tratamientos inventados**, solo la pregunta típica con un espacio para su respuesta. Etapa: hacer solo dental y estética | Bajo: es contenido, el formulario ya existe | Evaluar; con la etapa sirve solo si se hace en dental y estética |
| 4 | **El excedente no corta y avisa antes** (contacto activo con tope que fija el dueño) | Hoy el que agota las 500 depende de pedir la recarga por WhatsApp, esperar que se aplique a mano, y la recarga vence a fin de mes | Etapa: en etapa 1 el cobro a mano es correcto (concierge). Precio: lo decide Sergio Urcullo | Medio: automatizar el cobro y el cupo | Anotar para etapa 2. Hoy nadie llega a 500 (0 clientes) |
| 5 | **Importar lo que sabe desde la web o el Instagram del negocio** (Knowledge v2) | Cargar horarios y servicios lleva tiempo | Honestidad: el guion no usa texto libre; la importación tendría que **proponer campos del formulario** para que el dueño confirme. Etapa: hoy lo carga Sergio a mano. Muchas clínicas de Santa Cruz tienen Instagram y no web | Medio | Anotar para etapa 2 (bajar horas por cliente) |
| 6 | **Explicar el estado vacío** («No hay datos… vuelve a comprobarlo en 24 horas» + una acción) | «Cómo le va» y el Inicio sin datos no dicen cuándo va a haber algo | Nada, si no se nombra lo que no está listo | Bajo: texto | Evaluar en la pasada de UI |
| 7 | **Avisar lo que no salió por la ventana de 24 h** (Control de conformidad) | Desde el 1-oct, fuera de 24 h solo salen plantillas pagas. El dueño no ve por qué un mensaje no llegó | Nada. Suma a la honestidad sobre el costo de Meta | Bajo-medio: el motor ya reintenta con plantilla | Evaluar cuando haya un número de cliente conectado; hoy no hay ninguno |
| 8 | **Tono y límites escritos por el dueño** (Behavior) | Poco: el guion no improvisa, así que los límites ya vienen puestos | Si Onia pasa a la idea 2, ayuda decir «nunca des diagnósticos ni precios que no cargaste» | Bajo | Solo si se hace la idea 2 |
| 9 | **Difusiones con plantillas de Meta** | Recordar controles y reactivar pacientes | Honestidad y costo: marketing ≈ US$0,074 por mensaje (≈ Bs 0,84) que paga el cliente. El envío masivo quema números. Onia ya resuelve la necesidad **1 a 1 con datos reales y aprobación** (Pendientes) | Alto | No ahora: lo de Onia resuelve mejor el mismo problema |
| 10 | **Constructor visual de flujos** | Ninguno claro: el dueño de una clínica no arma flujos; eso lo hace un marketer | Velocidad, poco texto y celular (un lienzo es de escritorio). Etapa: construir es lo que sobra | Alto | No |

**Lo que NO conviene imitar**

| Qué | Por qué |
|---|---|
| Pedir conectar un canal antes de dejar ver nada; error 500 al entrar directo | Onia ya deja probar el agente sin WhatsApp. Es mejor así |
| Billetera prepaga para los mensajes de Meta | Suma un saldo que se puede acabar y esconde lo que cobra Meta. Onia hace que el cliente le pague directo a Meta, más transparente |
| Cobrar en US$ con tarjeta | El cliente de Onia paga en Bs con QR |
| Tácticas para crecer en Instagram (sorteos, «Sígueme primero, luego un regalo», juegos en Lives) | No le sirven a una clínica. Condicionar un regalo a que te sigan puede chocar con las reglas de Meta (?) |
| IA que redacta libre sin mostrar la fuente | En salud, una respuesta inventada es un riesgo. El foro de ManyChat reporta errores fuera del inglés [F] |
| Recomendar un número de WhatsApp nuevo | Para una clínica, su número es su clientela |
| Páginas propias que se contradicen (IA incluida o extra de US$29; «1.000 conversaciones gratis» cuando Meta ya cobra) | Es justo la regla de una sola fuente de verdad de Onia |
| Mezclar inglés y castellano, y dos formas de tratar al usuario | Onia ya usa un voseo parejo |
| La marca «Desarrollado por…» en el plan gratis | No aplica: Onia no tiene plan gratis |

---

## 6. Lo que no se pudo ver sin conectar un canal

| Qué | Por qué no | Cómo se vería |
|---|---|---|
| Las preguntas del alta y la primera automatización | La cuenta ya estaba creada. Los botones de la web mandan a `signup/facebookAuth?channel=instagram` (alta con Instagram) | Solo con una cuenta nueva; no la creé. Sergio Urcullo puede contar qué le preguntó |
| El lienzo del constructor de flujos | Pide canal (error 500 por dirección directa) | Conectando un canal de prueba que no sea el de Sergio (por ejemplo un Telegram de prueba, gratis) |
| Las pantallas de Manychat AI (Knowledge, Behavior, Playground) | Piden canal y plan Pro | Prueba de Pro + canal. Lo descrito sale de anuncios oficiales con fecha [PU] |
| Contactos: campos, etiquetas y segmentos | Piden canal | Ídem |
| Bandeja, respuestas guardadas, asignación y app móvil | Piden canal | Ídem |
| Broadcasts y plantillas de WhatsApp | Piden canal y Pro | Ídem |
| Cómo se conecta WhatsApp (si usa Embedded Signup, si da número propio, qué pide a Meta) | Requiere Pro y el botón conecta de verdad | No hacerlo con el número de Sergio |
| Si ManyChat cobra recargo sobre Meta, y cómo se carga la billetera | Solo aparece con WhatsApp | Ídem |
| Qué plantillas aparecen con WhatsApp conectado | La galería parece filtrada a Instagram (27 de las «60+» que anuncian) | Ídem |
| Si la prueba de 14 días pide tarjeta | No se apretó «Prueba gratis por 14 días» | Su web se contradice; solo se sabe iniciando la prueba |
| La web a 375 px | No cambié el tamaño de la ventana porque la comparten otros agentes y Sergio | En una ventana propia |
| Qué tan bien responde la IA en castellano de Bolivia | Requiere Pro y un canal | Sería la prueba más útil si Sergio decide pagar un mes. No lo recomiendo: la etapa 1 no lo necesita |

**Botones que no se tocaron y qué harían:** «Conectar» de cada canal (inicia el login de Instagram, TikTok, Telegram o Meta) · «Volver A Conectar» de Facebook · «Instalar la plantilla» y «Comenzar desde cero» (crean una automatización) · «Activar Prueba» → se abrió la ventana de planes, pero no se tocaron «Continuar con Gratis», «Prueba gratis por 14 días» ni «Comenzar» · «Genera Tu Clave De API» · «+ Nueva Cuenta» · «Crear Mi Primera Plantilla» · «Eliminar» · «Chatea con nosotros» (Intercom). En el foro de ManyChat se rechazaron las cookies («Deny all»).

---

## Fuentes (todas vistas el 29-sep-2026)

**App (cuenta de Sergio Urcullo, plan Free, sin canal) [A]**
- `https://app.manychat.com/fb5683639/dashboard` (Inicio, ventana «Conectar canal», plantillas, menú de Ayuda)
- `https://app.manychat.com/fb5683639/settings` (#subscriptions, #whatsApp, #instagram, #tiktok, #messenger, #sms, #email, #telegram) y la ventana de planes de «Activar Prueba»
- `https://app.manychat.com/profile/dashboard` (Cuentas, #templates, #settings = API) y `/profile/compliance-monitoring`
- `/fb5683639/cms`, `/subscribers`, `/chat` → error 500 sin canal

**Web pública [W]**
- Precios y tabla comparativa completa: https://manychat.com/pricing
- Manychat AI: https://manychat.com/product/ai (dice que la IA es un extra de US$29)
- WhatsApp: https://manychat.com/product/whatsapp (billetera; «1.000 conversaciones gratis», desactualizado)
- Integraciones: https://manychat.com/integrations

**Anuncios oficiales de producto [PU]** (`community.manychat.com/product-updates`)
- Knowledge v2 (24-feb-2026) · AI Playground (3-mar-2026) · mejoras al Playground (18-mar-2026) · Randomizer con 12 caminos (7-abr-2026) · nuevo Inicio (7-abr-2026) · AI Behavior (8-abr-2026) · Marketing Messages de WhatsApp (9-abr-2026; en los comentarios, un moderador confirma que no está disponible en EE. UU.) · Instagram Custom Audiences (8-sep-2025)

**Foro [F]**
- «Anyone else feels like the AI Steps in ManyChat are pretty much useless?», hilo de hace ~10 meses con respuestas de hace ~5: https://community.manychat.com/general-q-a-43/anyone-else-feels-like-the-ai-steps-in-manychat-are-pretty-much-useless-7800

**Onia [O]**
- `onia-platform-v1-integracion-20260927/lib/pricing.ts` (agente, recarga, Meta, tipo de cambio)
- `hermes-content/docs/research/onia-1.0-29sep/INVENTARIO_POR_RUBRO.md` §3.8 y §6
- `hermes-content/docs/research/onia-1.0-29sep/COMPETENCIA_BOTS_WHATSAPP.md` (estudio previo; su fila de ManyChat se corrige en §3.2)
- `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` §7 (etapa 1 vigente)
