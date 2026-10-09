# Leadsales: ficha (3-oct-2026)
> Fuentes: leadsales.io/precios/ · leadsales.io · leadsales.io/terminos-y-condiciones · crm.leadsales.services/auth/sign-up · leadsales.io/blog/leadsales-vs-kommo/ (10-jul-2026) · leadsales.io/blog/como-migrar-a-whatsapp-api-sin-perder-numero/. Solo web pública, sin cuenta.

## A quién le vende
- «CRM para WhatsApp, Facebook e Instagram». Equipos de ventas de pymes de Latinoamérica. Empresa de Querétaro, México. Sin rubro fijo. Vende orden comercial: embudos, campañas masivas y un agente de IA.

## Precio (moneda y monto de hoy; ¿cobra aparte lo de Meta?)
- USD/mes: Básico 97 (3 usuarios), Profesional 133 (4), Avanzado 247 (5). Descuento: 3 meses -10 %, 6 meses -15 %, anual -20 %. Usuario extra: sin monto público.
- Agente de IA «Lead Agent»: gratis el primer mes en Profesional y Avanzado. Después: Starter 87, Growth 297, Scale 793 USD/mes.
- Meta: aparte, como saldo prepago. Profesional trae 10 USD/mes de saldo y Avanzado 20 USD. Lo no gastado se acumula. Recarga libre.
- Básico no usa la API oficial (conexión tipo WhatsApp Web, según su home). Profesional y Avanzado sí.

## Alta y prueba (días, ¿con o sin tarjeta?, autoservicio o vendedor)
- «Probar por 14 días» solo en el Básico. El alta pide correo o Google. Tarjeta en la prueba: sin dato en la web vigente (una landing vieja ofrece 14 días por 7 USD).
- Autoservicio: «Elegir plan» mensual lleva directo a pago con Stripe (MXN o USD según país). También «Habla con nuestro equipo» y «Agenda una demo».

## Cómo cobra (medios, recurrente, qué pasa si no paga)
- Tarjeta por pasarela; transferencia solo en México y en planes de más de un mes. Cobro automático cada ciclo. Sin permanencia.
- Si no paga: 5 días hábiles de gracia; después desactiva la cuenta. Reactiva en 1 día hábil al pagar. Al cancelar guarda todo 90 días. Planes de más de un mes: sin reembolso.

## Onboarding (¿cómo se conecta el WhatsApp?)
- API oficial como socio de Meta, «sin costos extras de activación».
- Coexistencia: sí. El número sigue en la app y en la API a la vez mientras migras.
- La página de precios lista los requisitos de Meta: empresa formal con registro fiscal (cita NIT), admin total del Business Manager, sitio web con dominio propio.
- Lead Agent se dimensiona con asesor: «vemos juntos cuánta capacidad necesita tu negocio».

## Qué hace mejor que Onia
- Vende el agente como add-on con primer mes gratis dentro del plan, y nivel por volumen después.
- Saldo de Meta incluido y acumulable: el cliente no recibe una factura sorpresa de Meta.
- FAQ de precios que responde lo que frena la compra: requisitos, número propio, datos al irse.

## Qué copiar (ideas, no clonar)
- «Agente gratis el primer mes» como gancho del add-on.
- Saldo de mensajes de Meta incluido en el precio, que se acumula.
- Lista de requisitos de Meta antes del alta, para no trabar la conexión a mitad.

## Qué NO copiar
- Tres niveles del agente con salto de 87 a 793 USD: confunde y empuja a hablar con ventas.
- Plan base con conexión no oficial (inferencia: expone el número a bloqueo de Meta).
- Precio en USD para un mercado que cobra en moneda local.

## Contenido, pauta y comunicación (medido 2026-10-08)

### Cobertura
**Redes (enlaces del pie de leadsales.io):** YouTube `@Leadsales` (22.000 suscriptores), TikTok `@leadsales` (**94.900 seguidores, 791 videos publicados**, leído de la página pública el 8-oct), Instagram `@leadsalesio` (**52.000 seguidores, 592 publicaciones**, de la etiqueta pública del perfil; ningún reel visto), Facebook `/leadsalesapp` y LinkedIn `/company/leadsalesapp` (no medidos). Atiende México y Latinoamérica con tuteo mexicano.

> **Verificación del 8-oct (segunda pasada):** el listado de TikTok y de YouTube sí volvió a abrir con `yt-dlp` (el 429 de la primera pasada ya no aparecía en los catálogos; los videos de YouTube uno por uno siguen pidiendo "confirmá que no sos un bot", y Gemini sigue sin cuota). Los números de las 60 últimas piezas coinciden con lo escrito, pero **esa ventana es solo el 8 % del canal**: ver "Lo que mueve de verdad la aguja" abajo.

**Qué se vio y con qué método:**

| Qué | Método | Cobertura real |
|---|---|---|
| TikTok | `yt-dlp` lista 60 videos (20-abr a 25-sep-2026) con vistas y duración | 6 videos descargados y vistos: voz transcrita con faster-whisper local, hoja de 6 cuadros de los primeros 3 s (2 por segundo), 1 cuadro cada 5-8 s y metadatos (likes, comentarios, reposts) |
| YouTube | `yt-dlp --flat-playlist`: 60 videos largos y 40 Shorts (título, vistas, duración) | **Ningún video de YouTube visto.** yt-dlp devolvió 429 y "confirmá que no sos un bot"; no se pasó por cookies. Gemini devolvió "exceeded your current quota" y no se reintentó. De YouTube solo hay catálogo, no guion ni edición |
| Meta Ads Library | `ads_library_search` (MCP de Meta) por la página `Leadsales` (id 105860241124620) | Funcionó. Solo devuelve titular, fecha de inicio y moneda. **No** devuelve texto principal, CTA, formato ni destino, y la ficha del anuncio en facebook.com no abre sin navegador (prohibido hoy) |
| Web | `curl` de leadsales.io | Home leída. Los precios ya estaban en esta ficha (3-oct) |
| TikTok, segunda pasada (8-oct) | Catálogo de 300 videos (oct-2024 a sep-2026) y 4 videos nuevos bajados: 2 de los más vistos de la historia (4,5 M y 1,2 M de vistas), y los de 52.600 y 8.490 vistas vueltos a ver | Voz transcrita en local, hoja de 6 cuadros de los primeros 3 s y hoja de 1 cuadro cada 4 s en los dos nuevos |

**Qué no se pudo:** ver cualquier Short o video largo de YouTube, ver un solo creativo de anuncio, ver un reel de Instagram, y oír música y efectos de sonido (la transcripción es solo de voz).

### Estructura de contenido orgánico
- **El motor es TikTok:** 60 videos en 158 días = **2,7 por semana**. Por mes: abril 4, mayo 6, junio 10, julio 13, agosto 12, septiembre 15 (acelera). Duración mediana **87 s** (rango 33-135 s). Vertical 9:16 (el archivo que baja `yt-dlp` es 576x1024; la resolución original no se comprobó).
- **Vistas de esos 60 (20-abr a 25-sep-2026), recontadas el 8-oct:** mediana **1.809**, media 4.071, máximo 52.600, total 244.286. **Cinco videos hacen el 43 %** de las vistas de esa ventana (52.600, 14.700, 13.600, 12.400 y 11.200). Rinde por tema, no por constancia. Últimos 30 días: 9 videos con mediana 859, más bajo que el semestre.
- **Lo que mueve de verdad la aguja (corrige la lectura de "máximo 52.600"):** en los 300 videos más recientes de la cuenta (oct-2024 a sep-2026) hay **14 con más de 100.000 vistas** y los 5 mayores suman el 65 % del total (10,8 M). Ninguno está en la ventana de 60. El mayor: **4,5 M** (20-nov-2024, 31 s, actualización nueva de WhatsApp, el "walkie-talkie"). Siguen **1,2 M** (29-may-2025, 92 s, "¿te bloquearon la cuenta?"), 554.800 (WhatsApp y WhatsApp Business en el mismo teléfono), 369.800 (activar WhatsApp Business en 1 minuto) y 357.400 (nueva regla de bloqueo). **Mediana por semestre:** 2024-S2 785 (39 videos) · 2025-S1 640 (97) · 2025-S2 2.059 (70, con 8 sobre 100.000) · 2026-S1 3.239 (54) · 2026-S2 943 (40, el máximo es 12.400). O sea que **el alcance de julio-septiembre 2026 es el más bajo en un año** pese a pasar de 10 (junio) a 15 (septiembre) videos por mes; lo que rindió fue noticia de función de WhatsApp y "tu cuenta en peligro", no el volumen.
- **Pilares** (clasificación mía por titular, aproximada), con la mediana de vistas:

  | Pilar | Videos | Mediana | Qué es |
  |---|---|---|---|
  | Funciones y trucos de WhatsApp | 17 | 5.157 | Actualización nueva, nombre de usuario, ocultar Meta AI, recuperar mensajes eliminados, 2 cuentas en un celular, mensaje de bienvenida |
  | Cambio de costos de Meta (1-oct-2026) | 3 | 7.253 | "WhatsApp deja de ser gratis", cómo reducir el golpe |
  | Mensajes masivos con API oficial | 6 | 3.286 | Cuántos se pueden mandar, plantillas |
  | Cuenta bloqueada o en peligro | 14 | 2.350 | El de 52.600 vistas es de este pilar |
  | Estrategia de ventas y casos de marca | 8 | 676 | Caso Turín, anuncios por WhatsApp |
  | Agente de IA o bot | 4 | 630 | Es el producto que más empujan |

- **Lectura:** lo que enseña algo útil de WhatsApp rinde unas 8 veces más que lo que habla del producto. Casi todo termina apuntando a "usá la API oficial", que es lo que viene en los planes Profesional y Avanzado. El contenido atrae a cualquier dueño con WhatsApp Business; la web le habla solo a equipos de ventas.
- **En 2026, casi siempre un CTA de comentario con palabra clave:** 5 de los 6 videos de 2026 vistos cierran con "comenta X y te mando" (API, WhatsApp API, ahorrar, agente, chocolate); el sexto pide comentar para una parte 2. Los dos grandes de 2024-2025 cierran distinto: el de 4,5 M con una pregunta abierta ("cuéntanos, ¿a ti te sale?") y el de 1,2 M con el enlace de la bio y "agenda una demo". La palabra clave por comentario es la táctica de venta de 2026, no la que dio el alcance. Es un lead magnet manual por mensaje directo (lista, checklist, tutorial). En el de 12.400 vistas hubo 143 comentarios (1,2 %); en el de 52.600, 178.
- **Series cortas:** "Día 1 y Día 2 de cómo triplicar tus ventas por WhatsApp en 30 días" (25-ago), con la palabra clave REGALO.
- **YouTube (solo catálogo):** 60 largos con mediana de **224 vistas** y duración mediana de 4 min, casi todo con título en inglés. Tutoriales 27, IA y agente 11, versus y alternativas a Kommo, Wati, Respond.io y Whaticket 9, costos de Meta 8, bloqueos 5. Sirve de biblioteca para búsquedas, no de audiencia. **Shorts:** los 40 más recientes tienen mediana 757 (recontado: 756,5; con 80, 944). El mismo Short "Lead Agent: atiende más clientes en WhatsApp sin contratar más gente" existe en **10 subidas** (no 7): entre 2.400 y 9.100 vistas cada una salvo una de **78.000**, unas 100 veces la mediana. Idioma: el listado de `yt-dlp` devuelve los títulos en inglés, pero el servicio público de incrustación de YouTube devuelve los 10 en español; no se pudo fijar cuántas son en cada idioma (la cifra "5 en inglés y 2 en español" de la primera pasada no se sostiene). La de 78.000 (`bx9_EXBKVCI`) aparece en español por ese servicio. Diez subidas de una pieza y una cifra así huelen a pieza impulsada con pauta (inferencia, no se pudo ver). Hay Shorts de hasta 140.000 vistas más atrás en el catálogo.
- **La web es el centro de contenido:** herramientas gratis (generador de enlace de WhatsApp y de QR), Leadsales Academy, blog y casos con video en YouTube.

### Pauta en Meta
- **Una sola página, Leadsales (id 105860241124620), solo México (moneda MXN).** Con el filtro de CO, AR, CL, PE, BO, EC, ES, US, BR y otros 9 países devolvió 0 (repetido el 8-oct). El filtro de inactivos devolvió 0 aunque hay anuncios más viejos: no es confiable. Ojo: con el filtro MX la herramienta cuenta **30**, no 55; los 25 que faltan son los de fecha de inicio más reciente (relanzados del 20-sep al 7-oct); todos los de ese filtro empiezan el 17-sep, el 2-oct o el 9-jun. Se infiere que la Biblioteca aún no les asigna alcance por país; no confirmado.
- **55 anuncios activos** (estimado de la herramienta, repetido el 8-oct sin filtro de país; leí 50). En tres semanas lanzaron dos lotes grandes:

  | Titular | Anuncios activos | Desde | Días al aire (al 8-oct) |
  |---|---|---|---|
  | "Vende más por WhatsApp" (con emoji) | 4 | **9-jun-2026** | **121** |
  | "Tu CRM para WhatsApp" | 26 de los 50 leídos | 17-sep, algunos relanzados hasta el 6-oct | 2 a 21 |
  | "Deja de perder leads" (con emoji) | 15 de los 50 leídos | 2-oct, algunos el 7-oct | 1 a 6 |
  | "Envía WhatsApp masivos" (con emoji) | 5 | 2-oct y 6-oct | 2 a 6 |
  | "Todos tus chats en un lugar" (con emoji) | 4 | 2-oct | 6 |

- **Lo único que pasa el corte de 30 días son los 4 de junio (121 días).** Todo lo demás tiene menos de 3 semanas: están probando. Es el patrón de §2.6 de `ONIA_ADQUISICION_Y_PAUTA.md`: pocos ganadores sostenidos y muchas variantes de prueba.
- **Cómo prueban:** creaciones con segundos de diferencia y el mismo titular (los 15 de "Deja de perder leads" se crearon en 9 minutos) son variantes de un mismo anuncio, no 15 ideas. En total son 5 ideas.
- **Fórmula de los titulares:** dolor en tres palabras ("Deja de perder leads"), función concreta ("Envía WhatsApp masivos", "Todos tus chats en un lugar"), categoría ("Tu CRM para WhatsApp") y beneficio genérico ("Vende más por WhatsApp"). Cuatro de los cinco llevan emoji al inicio. **Ninguno dice IA, precio ni nombra a la competencia.**
- **Inferencia:** la búsqueda de la palabra "Agent" dentro del texto de los anuncios devolvió 24 de los 55: los 15 de "Deja de perder leads" y 9 de "Tu CRM". O sea que el cuerpo habla del Lead Agent aunque el titular no lo diga.
- **No se pudo ver:** texto principal, botón, destino, si es video o imagen, ni "N anuncios usan esta creatividad". Los 4 de junio son la pieza a mirar la próxima vez que la madre tenga el navegador.

### Comunicación
- **Titular de la web:** "CRM para WhatsApp, Facebook e Instagram". Promesa: unificar la bandeja, ordenar al equipo y multiplicar su rendimiento con IA, para escalar la operación "sin escalar el caos".
- **A quién le habla:** equipos de ventas con varios asesores, no al dueño solo. En redes le habla al dueño con WhatsApp Business. Son dos públicos unidos por un mismo puente: la API oficial.
- **Tono:** tuteo mexicano y cercano ("te enseño", "robate esta estrategia", "bye"), frases cortas. Cada sección de la web usa el contraste "cuando todo vive en chats / con Leadsales" en tres filas (campañas, equipo, Lead Agent).
- **Prueba:** casos con una métrica antes y después: ICEL contacto de 35 % a 75 %, iGrow respuesta de 4,2 días a 23 h, SCHIRP "de días a horas", cada uno con video en YouTube. Más logos de equipos. En Capterra tiene 8 reseñas (`BACKLOG_DE_PRODUCTO.md`).
- **Precio:** no está en la home; sí en `/precios/` (USD 97, 133 y 247, ver arriba).
- **Clics hasta empezar:** home, "Prueba el CRM 14 días", alta con correo o Google = 2 clics (de la ficha del 3-oct, no re-medido hoy). El primer botón de la home es "Agenda una demo". Son dos CTA, no uno.

### Guiones de sus videos

| Video (vistas, duración) | Gancho (0-4 s) | Estructura por tramos | Cierre |
|---|---|---|---|
| "Por qué te bloquean en WhatsApp" (52.600, 126 s) | Inserto de la notificación de bloqueo en un celular y "no es por mandar demasiados mensajes": desmiente una creencia | 0-19 s tesis (no es el volumen, es cómo y a quién) · 19-50 s listas de difusión: Meta las lee como spam · 50-69 s plataformas piratas: bloqueo casi irrecuperable · 69-108 s API oficial con plantillas aprobadas, y mención del producto una sola vez | "WhatsApp no castiga el volumen, castiga la forma" y "comenta WhatsApp API" |
| "Mandé más de 1000 mensajes en un día" (12.400, 85 s) | Resultado en primera persona: mandé más de 1000 y no me bloquearon | 4-12 s "una opción que muchos no conocen" · 12-37 s problema: copiar y pegar o difusión, el cliente reporta spam · 37-62 s solución: herramienta oficial, plantilla aprobada, llega aun sin tener el contacto · 62-78 s personalizar con nombre | "Comenta API y te mando el tutorial". Nunca dice el nombre del producto en la voz |
| "El cambio de octubre te va a costar dinero" (8.490, 83 s) | Amenaza de plata con promesa de "tres formas" de reducir el golpe | 4-24 s contexto en 20 s: desde el 1-oct se cobra dentro de la ventana de 24 h · 24-34 s forma 1: juntá tres mensajes en uno · 34-48 s forma 2: anuncios Click-to-WhatsApp dan 72 h gratis · 48-65 s forma 3: ordená los chats para cerrar antes (acá está el CRM, sin nombrarlo) | "Es oficial, prepárate" y "comenta ahorrar y te mando el checklist" |
| "Agente de IA vs personal" (540, 67 s) | "Si contrataste a otra persona para responder tu WhatsApp, elegiste la opción más cara" | 5-40 s cuenta del equipo (sueldo, prestaciones, 8 h por 5 días; "2.000 a 3.000 dólares" sin fuente) · 40-49 s el agente trabaja 24 por 7 · 49-60 s "no reemplaza a tu equipo" | "Comenta agente y te mando la lista". Es su producto estrella y rinde un tercio de la mediana |
| **Los dos de más alcance de la cuenta** (vistos el 8-oct) | | | |
| "¡Llega el walkie-talkie!" (**4,5 M**, 31 s, 20-nov-2024) | Noticia directa: WhatsApp acaba de lanzar una herramienta que "te regresa a los 90" (3 s) | 0-6 s gancho + chiste de los 90 · 6-15 s qué es: mensajes de voz en tiempo real, sin llamadas ni notas de voz · 15-24 s "si aún no te sale, WhatsApp lo va soltando poco a poco" · 24-28 s limitación: solo chats de grupo · 28-31 s cómo se ve la herramienta | Pregunta abierta: "cuéntanos, ¿a ti te sale?". Sin producto, sin enlace |
| "¿Te bloquearon tu cuenta de WhatsApp?" (**1,2 M**, 92 s, 29-may-2025) | "Si te apareció una pantalla como esta, lamento decirte que te quieren bloquear la cuenta" con la captura del aviso arriba a la derecha (0-3 s) | 5-12 s promesa: cómo recuperarla y por qué pasa · 13-38 s causas: versiones no oficiales, automatización excesiva, spam, contenido prohibido, uso comercial sin consentimiento · 39-67 s qué hacer: apelar por correo con el número y el país, **no volver a registrar el número** · 67-86 s "si eres negocio y te pasó por automatizar": nombra Leadsales y sus funciones (programar mensajes, respuestas rápidas, notas internas) | "En mi biografía hay un enlace para conocerla y agendar una demo". Sin palabra clave por comentario |

- **Dos más vistos de la ventana de 60:** "Robate esta estrategia de Turín" (384 vistas, 0 comentarios, 25-sep) es un caso de marca real de México, con b-roll de evento, QR y formulario; es el formato caso de marca y casi no rindió. "Ya puedes cobrar desde WhatsApp" (1.644, 68 s) es una novedad de función con la pantalla del celular en mano.

### Edición
- **Presentadora a cámara, plano medio, una sola persona por video,** en escenarios distintos (estudio con pared de ladrillo, escritorio con biblioteca, mesa con luz natural, pared verde). Sin logo de Leadsales ni URL en los cuadros revisados.
- **Producción ligera:** celular o cámara fija, luz natural, micrófono inalámbrico a la vista, un solo plano con zooms y cambios de encuadre frecuentes (se ven entre cuadros separados 6 s) como único corte. Música y efectos: no medidos.
- **Primeros 3 s:** sin intro ni marca. La presentadora ya habla en el cuadro 0, con un **título fijo** de tres a cuatro líneas (palabra clave en caja de color: verde WhatsApp, o morado en el video del agente de IA; en el de 52.600 mezcla una línea en serif cursiva y otras en sans negrita, con el ícono de WhatsApp debajo, y la caja dice "WHASTAPP" con la letra cambiada: un error de ortografía en la portada del video más visto de la ventana de 60) durante los primeros 3-6 s, más un inserto (celular con la notificación de bloqueo, ícono de WhatsApp con una "x" o un "+API"). El de Turín abre con b-roll del evento y título con letra serif en dos tamaños.
- **Subtítulos:** una a tres palabras por línea, centrados al medio-bajo del cuadro, letra sans negrita blanca sin caja y sin color de énfasis (el de Turín usa amarillo lima).
- **Los dos de mayor alcance, cuadro a cuadro (8-oct):**
  - **4,5 M (31 s):** presentadora con gorra y chaleco rojo sobre fondo negro, un objeto negro pequeño en la mano (parece el micrófono inalámbrico). Subtítulo en el centro-bajo del cuadro, **una a tres palabras por línea, blanco, negrita, con borde negro**. Un **sticker del logo de WhatsApp aparece y desaparece sobre su cabeza** al compás de las frases, el fondo **cambia a un patrón de confeti de colores justo en el chiste de los 90** y vuelve a negro, hay un acercamiento fuerte al rostro a mitad de video y el último cuadro es una transición borrosa violeta-rosa con la pregunta final escrita. Cambios de encuadre o de fondo frecuentes (visibles en cuadros separados 0,5 s y 4 s).
  - **1,2 M (92 s):** presentadora sentada en un local (persianas de madera detrás), plano medio, **sin subtítulos continuos**: solo palabras clave sueltas en letra blanca pequeña ("Versiones no oficiales", "Contenido prohibido") y la captura del aviso de bloqueo en los primeros 3 s arriba a la derecha. Un solo plano casi sin cortes visibles en los cuadros cada 4 s. Es una producción mucho más simple que la de 2026: el alcance vino del tema y de la pantalla de miedo, no de la edición.
  - Presentadoras distintas entre videos (gorra, pelo largo, lentes con coleta): no hay un rostro único de marca.
- **Capturas de pantalla:** las usan el de cobrar (celular en mano, con efecto blanco y negro) y el de Turín. Los otros cuatro no muestran producto: hablan de WhatsApp, no de Leadsales.
- **Duración:** 67 a 126 s. Los 10 más vistos duran entre 73 y 135 s (mediana 93 s), algo más que la mediana del canal (87 s): no recortan para rendir.

### Qué toma Onia (pauta de Onia Platform y web) y qué NO
**Toma:**
- **Pocas ideas, muchas variantes de prueba, un ganador que se sostiene.** Leadsales sostiene 4 anuncios 120 días y probó unos 50. Para Onia: 2-3 variantes de UN ángulo (ya en §2.6), medidas 30 días antes de sumar otro. El gasto lo aprueba Sergio Urcullo.
- **Titular de pauta = dolor concreto en pocas palabras + categoría clara.** Para clínica dental: el paciente que no volvió y "sistema para tu clínica". Cada frase pasa antes por `ONIA_CATALOGO_DE_VENTA.md` (el Recall de tratamiento a medias solo se promete con la 1.0 publicada).
- **Nada de "IA" en el titular.** Leadsales tampoco lo pone aunque su empuje es el agente. Coincide con §2.5 punto 3.
- **Web: contraste "cuando todo vive en chats / con el sistema" en tres filas,** con el lenguaje del rubro (agenda en papel, cobros sueltos, pacientes que no vuelven), y dos CTA con prueba sin tarjeta.
- **Casos con una métrica, un cliente y un video corto, cuando existan.** Hoy hay cero clientes: no hay caso que copiar y está prohibido fabricarlo.
- **Marca personal de Sergio Urcullo (no la pauta):** el pilar "cambio de la plataforma explicado en 80 s con tres pasos y checklist por comentario" funciona (8.487 vistas). El cobro de WhatsApp desde el 1-oct también le pega a quien use el bot de Onia, así que sirve para contenido de él con su voseo, sin prometer nada del producto fuera de la tabla "se promete / funciona".
- **Noticia corta de WhatsApp o Meta en 30-90 s, para la marca personal de Sergio Urcullo (no para la pauta).** Dónde: TikTok, Reels y Shorts. Evidencia: los dos videos de mayor alcance de Leadsales (4,5 M en 31 s y 1,2 M en 92 s) son noticia de función y "tu cuenta en peligro"; el de 4,5 M no menciona producto, enseña la pantalla y cierra con una pregunta abierta. Para el público de Sergio Urcullo (dueños de negocio en Bolivia) el equivalente es el cobro por mensaje de WhatsApp desde el 1-oct, qué cambia en Bolivia y qué hacer; se prueba con 2-3 piezas antes de sumar frecuencia. Datos de Meta con fuente o no se dicen.
- **No tomar el volumen como estrategia:** Leadsales subió a 15 videos por mes y su mediana de julio a septiembre de 2026 bajó a 943 vistas (2026-S2, 40 videos; antes 2.059 y 3.239). Para Sergio Urcullo un video diario solo vale si cada uno responde una duda concreta; se mide por tema, no por cantidad.
- **Formato de video de la marca personal:** a cámara de 60-130 s, título fijo de 3-6 s con una palabra en caja de color, subtítulos de 1-3 palabras y cambio de encuadre frecuente. Se arma con HyperFrames y la paleta de Onia, no con el verde de WhatsApp.

**No toma:**
- **El tema del que viven (bloqueos, API, mensajes masivos).** Es el negocio de ellos. Onia vende el sistema de la clínica y el dentista no busca "cómo mandar 1.000 mensajes". Les rinde a ellos, no a Onia.
- **Decenas de variantes ahora.** Con cero clientes y gasto con aprobación sería quemar plata.
- **Cifras ajenas sin fuente** ("un equipo cuesta 2.000 a 3.000 dólares"). Onia solo usa cifras con derivación.
- **CTA "comenta X y te mando" en Instagram.** El comentario a mensaje directo tuvo 2 rechazos de Meta y 0 leads. En TikTok o con enlace en la bio sí se puede probar, y pasa por Sergio Urcullo.
- **Tuteo.** A clientes y en la pauta Onia habla de usted.
- **Versus y alternativas en YouTube** (mediana 224 vistas) y el agente en tres niveles de USD 87 a 793: no corresponden a la etapa vigente.
