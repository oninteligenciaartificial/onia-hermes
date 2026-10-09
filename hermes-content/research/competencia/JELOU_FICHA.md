# Jelou: ficha (8-oct-2026)
> Fuentes: https://jelou.ai · https://jelou.ai/en/pricing (texto del navegador, no de un buscador). Solo web pública, sin cuenta.
> ⚠️ Una búsqueda web dio USD 24,9 y 199,9 con 2.500 ejecuciones: es **una versión vieja**. La página de hoy dice lo de abajo.

## A quién le vende
- **A empresas grandes y a quien les revende.** Titular: *«AI agents built for transactions»* (abrir cuentas, firmar contratos,
  vender y cobrar por WhatsApp, Instagram, Messenger y web). Clientes citados: Mibanco, Chubb, Falabella, PepsiCo, Nestlé,
  Marriott, AB InBev. Programa de partners para revendedores.
- **No tiene vertical de salud ni clínicas.** Casos de bancos y aseguradoras. No compite por una clínica de 2-6 profesionales.

## Precio de hoy (USD, `jelou.ai/en/pricing`)
| Plan | Precio | Incluye |
|---|---|---|
| Free | 0 | 125 ejecuciones de flujo (tope duro), 1 canal, 1 usuario, historial 7 días |
| Builder | 25/mes | 1.000 ejecuciones, USD 5 de crédito de IA, 2 usuarios, 3 proyectos; USD 0,019 por ejecución extra |
| Growth | 299/mes | 10.000 ejecuciones, USD 100 de crédito de IA, 5 usuarios; rollback de versión |
| Enterprise | a medida | volumen negociado, SLA, SSO |
- Los cargos de Meta (WhatsApp) **no están incluidos**: «pueden descontarse de tus créditos». Asiento extra USD 25/mes.

## Lo que hace distinto
- **Dejó de cobrar por conversación y lo dice en la página de precios:** *«We used to charge per conversation. Not anymore.
  Flat per-chat pricing penalized our customers — they paid the same for a greeting as for a complex sale»*. Ahora separa
  ejecución del flujo y créditos de IA.
- **Dos puertas en la misma página de precios:** «I want to build it» (autoservicio) y «Build it for me» (lo arman ellos).
- Alta con **Free sin tarjeta**: «Start free». Para Enterprise, «Talk to an expert».

## Qué cambia para Onia
- No es competidor directo (otro cliente, otra escala). Sirve como **referente de cómo explicar un precio por uso**: ver
  `ONIA_UI_MEJORAS_1.0.md` §7, hallazgo T1-3.
- «Build it for me» **falla el test del §10** (horas de Sergio Urcullo por cliente): no se copia como add-on.

## Contenido, pauta y comunicación (medido 2026-10-08)
> Pedido de Sergio Urcullo: analizar de Jelou y Kommo la estructura de contenido, la comunicación, la edición y los guiones, no solo el producto. Lo de arriba es el producto; esto es lo que muestran en redes y pauta. Los textos de terceros van parafraseados: los ganchos están en palabras propias.

### Cobertura: redes encontradas, videos mirados, método real y huecos
| Red | Handle | Tamaño medido | Cobertura |
|---|---|---|---|
| YouTube | @jelouai (Jelou AI) | 2.830 suscriptores (re-medido 8-oct); 96 videos + 46 shorts en el catálogo completo (el análisis original usó los 60 + 40 más nuevos) | listado completo + 10 videos mirados (7 + 3 del rechequeo) |
| Instagram | @jelouai (verificada) | 15,9 K seguidores | solo la grilla pública: 12 piezas con fecha y tipo; sin captions ni números por pieza |
| Facebook / Meta Ads | página "Jelou Latam" (id 102068831276740) | 382 anuncios activos + 458 inactivos = **840 en total** (re-medido 8-oct; la primera versión decía 681) | Biblioteca con `ads_library_search`: título, fechas, ids |
| LinkedIn / X | company/jelou-ai · @jelouai | no medido | solo el enlace del pie de la web |
| TikTok | sin enlace oficial | n/d | yt-dlp no pudo leer ningún perfil (privado o sin embed). Sin cobertura |
| Blog | jelou.ai/es/blog | 17 entradas | títulos y fechas de las 8 más recientes |

Videos mirados: 7. **Gemini nativo no funcionó: respondió cuota agotada (429) y no se reintentó, como manda la regla.** Tampoco hay Whisper local, así que el audio sale de los subtítulos automáticos de YouTube (con errores: escriben "Hello" por Jelou).

| Video | Fecha · duración · vistas | Método real |
|---|---|---|
| Convierte WhatsApp en tu mejor vendedor (short) | 24-mar-26 · 46 s · 212.023 vistas, 538 likes | MP4 360x640 bajado: hojas de contacto cada 3 s, primeros 3 s a 2 cuadros por segundo y subtítulos |
| Tu banco en WhatsApp | 16-mar-26 · 36 s · 181.796 vistas, 7 likes | MP4 360p: cuadros cada 4 s y subtítulos |
| +3.000 integraciones | 27-mar-26 · 11 s · 13.994 vistas, 3 likes | MP4 360p: cuadros cada 1,2 s; sin voz transcripta (no bajaron subtítulos) |
| De un prompt a un agente de citas médicas (short) | 17-abr-26 · 28 s · 205 vistas | MP4 360x640: cuadros cada 3 s y subtítulos |
| Desde el 1 de octubre cada mensaje cuenta (short) | 30-sep-26 · 29 s · 42 vistas | MP4 360x640: cuadros cada 3,3 s; el texto sale de lo escrito en pantalla (sin subtítulos) |
| Jelou Agent 2.0 (lanzamiento) | 15-sep-26 · 256 s · 8.776 vistas, 14 likes | MP4 bloqueado por YouTube (403): subtítulos completos y storyboard 160x90 (un cuadro cada ~2 s). Sin texto en pantalla legible |
| Say Jelou a Banisi (caso) | 28-jul-26 · 94 s · 244 vistas | MP4 bloqueado (403): subtítulos y storyboard 160x90 |

**Lo que no se pudo:** (en el rechequeo del 8-oct el cliente `android` de yt-dlp sí bajó MP4 de 360p de shorts y los subtítulos, pero sigue dando 429 en subtítulos tras unas pocas consultas, y Gemini sigue sin cuota) ver los anuncios en sí (el snapshot de la Biblioteca devuelve 403 desde acá y no se usó navegador), el cuerpo del texto, el formato (video o imagen), el CTA y el destino de cada anuncio; el contenido de las piezas de Instagram; TikTok. La Biblioteca da máximo 50 resultados por consulta y no pagina: los conteos por familia de titular son **mínimos**; el total (382 activos) es el que informa la herramienta.

### Estructura de contenido orgánico
**YouTube es su biblioteca de ayuda y ventas, no un motor de vistas.** Mediana de vistas: 86 en videos y 118 en shorts (los 60 + 40 más nuevos; en el catálogo completo, 136 y 140). **Dos piezas de marzo-26 concentran el grueso de las vistas** (212 mil y 182 mil; las dos de tono comercial). Con los 60 videos + 40 shorts más nuevos, los tres primeros (212 mil, 182 mil, 14 mil) suman ~94 %; con el catálogo completo (96 + 46) aparece un tercero de 50.502 vistas (ene-2023, 25 s, 44 likes) y los tres primeros bajan a ~86 %. Los tutoriales rondan entre 11 y 60 vistas. El de 182 mil tiene 7 likes: esa proporción no es la de un video orgánico normal (inferencia mía: distribución pagada; no se puede verificar).

| Pilar | Qué es | Mezcla (100 piezas listadas, clasificación mía por título) | Rinde |
|---|---|---|---|
| Tutorial y demo de producto (Brain, Connect, Flows, agenda con Google Calendar, campañas masivas) | pantalla, 2-15 min; hay directos de 57 y 77 min | ~32 | 11-1.200 vistas |
| Banca y pagos en WhatsApp (caso Banisi, "tu banco en WhatsApp", pagos in-chat) | 15 s a 2 min, presentadora o entrevista | ~10 | los picos (182 mil) |
| Shorts comerciales (WhatsApp como vendedor, objeciones, Jelou vs n8n, cambios de Meta) | 30-45 s vertical | ~27 | uno de 212 mil; el resto 20-300 |
| Novedades "Brain News" | mensual y edición especial de Launch Week | 6 | 41-614 |
| Eventos (Jelou House CDMX 29-oct; recap 2026; "Say Jelou to ...") | charlas largas y recaps | ~4 + 3 charlas subidas el 7-oct | recap de Jelou House: 954 |

- **Frecuencia en YouTube:** 15 videos en 22 días (16-sep a 7-oct), con 3 el mismo día el 16-sep y el 7-oct. Es campaña (Launch Week y evento), no un ritmo diario sostenido.
- **Instagram (@jelouai, 15,9 K):** 12 piezas visibles entre el 22-sep y el 7-oct, en 10 de esos 16 días: ~7 videos (2 tipo meme, 1 de oficina o redacción, 1 de pantalla con afiche), 4 carruseles, 1 foto. Captions no visibles.
- **Blog:** ~1 entrada por mes (dic-25 a jul-26): caso Banisi, precios de WhatsApp, Serie A de USD 10 M (ene-26), "AI Fit", pagos in-chat y por qué dejaron de cobrar por conversación.
- **Engranaje comercial:** eventos presenciales (Jelou House), programa de partners y comunidad de devs. El contenido va a empresas grandes y a quien las implementa.

### Pauta en Meta (`ads_library_search`, medido hoy)
- **Página "Jelou Latam": 382 anuncios activos de 681 en total.** 56 de los activos alcanzan **Bolivia** según el filtro de país de la herramienta (no confirma cuánto gastan acá). 204 activos alcanzan MX, CO, PE, EC o PA. Moneda: USD.
- **Cuatro familias de titular activas** (re-medido 8-oct con búsqueda de texto sobre anuncios ACTIVOS; las cifras de la primera versión eran mínimos de una consulta de 50 y quedaron muy cortas): (B) servicios financieros con IA transaccional segura, **121**; (A) convertir cada conversación en una transacción, **93**; (D) Jelou automatiza las reservas de tu hotel, **93**; (C) agenda una llamada, unos **~68** con ese titular (la búsqueda de texto da 193 porque los anuncios de hotel también lo dicen en el cuerpo; el ~65 sale por resta: 382 menos B, A, D y siete sin titular). **La familia más grande es la de finanzas, no la de "convertir conversación"**; buena parte de los de hotel se creó el 2-oct (los ids lo muestran). Siete anuncios activos del 15-sep no traen titular.
- **Hacen test a escala:** decenas de anuncios creados en el mismo minuto con el mismo titular (26-ago y 2-oct). Coincide con las "35 variantes de un mismo titular" del backlog de producto. No cuidan un anuncio: lanzan lotes y dejan vivir los que sirven.
- **Los que más llevan al aire (activos hoy):**

| Familia | id en la Biblioteca | Inicio · días | Nota |
|---|---|---|---|
| B finanzas (lote de ~50) | 903641995760863 | 26-ago-26 · 42 | el lote más viejo vivo |
| A convertir conversación en transacción | 2557177728131489 | 27-ago-26 · 41 | |
| A (otro) | 1104914812289760 | 1-sep-26 · 37 | |
| C agenda una llamada | 3627464030771632 | 17-sep-26 · 21 | creado el 2-sep, entregó recién el 17 |
| A (otro) | 3490734184420262 | 21-sep-26 · 17 | |

  Nada de lo visto pasa de 6 semanas (26-ago confirmado el 8-oct): **Jelou no parece sostener un anuncio durante meses; rota.** Con 382 activos y 50 visibles por consulta, puede haber activos más viejos no vistos. Para ver el creativo hay que abrir `facebook.com/ads/library/?id=<id>` desde la PC (lo hace la madre).
- **Antes:** "Empieza a construir gratis" (Brain autoservicio): 130 anuncios en la Biblioteca, **ninguno activo hoy**; los más recientes arrancaron el 25-26-jun-26 (el inicio del 11-jun de la primera versión no se pudo reconfirmar: la Biblioteca no pagina), más "chatea con nosotros" y "regístrate para saber más" (24-jun). La pauta pasó de **autoservicio gratis (junio) a llamada con un experto y verticales de banca y hotel (agosto-octubre)**.
- **Destino (inferido, no visto en el anuncio):** "agenda una llamada" lleva a formulario o Calendly de ventas; "empieza gratis" va a `apps.jelou.ai/signup` (plan brain-free).

### Comunicación (web `jelou.ai/es`)
- **Titular:** agentes de IA hechos para transaccionar. Promesa: convertir procesos complejos en agentes que ejecutan acciones y transacciones (identidad, firma electrónica, comercio, pagos) sin salir del chat.
- **A quién le habla:** bancos, seguros, consumo masivo y retail grande (Mibanco, Chubb, PepsiCo, Nestlé, Marriott, Falabella, AB InBev) y a partners o builders; el alta pide el perfil "provider". No le habla al dueño de una clínica.
- **Tono:** tuteo; corporativo y técnico en la web; humor y creador en Instagram y shorts.
- **Prueba:** 50 millones de transacciones, 300+ clientes empresariales, 99,95 % de disponibilidad, certificaciones (PCI DSS, ISO 27001) y el caso Banisi con números (+146 % de apertura de cuentas, alta en menos de 7 minutos, 100 % dentro de WhatsApp). Todo con logos grandes.
- **Precio:** la home no lo muestra; `/pricing` sí (ver arriba).
- **Clics hasta empezar:** 1 clic desde cualquier "Empieza gratis" a la pantalla de alta; dos puertas más: "Habla con un experto" (formulario) y "Unirme al programa" (Calendly).
- **Orden de la página:** titular → dos CTA → banner de evento → cifras y logos → partners → Brain Studio (describe lo que necesitas) → capacidades → canales → 4 casos de uso con demo de chat → caso Banisi → seguridad.

### Guiones de sus videos (desarmados)
| Pieza | Gancho (0-3 s) | Tramos | Cierre y CTA |
|---|---|---|---|
| Short "WhatsApp, tu mejor vendedor" (46 s, 212 mil) | pregunta en pantalla y voz: sabías que WhatsApp puede ser tu mejor vendedor y trabajar 24/7 | 0-10 s la promesa · 10-30 s lista "el que muestra productos / el que vende, ofrece crédito y cobra / el que gestiona pedidos", cada ítem con su pantalla de catálogo, carrito o cobro · 30-40 s todo en una sola conversación, sin sacar al usuario del chat | "Con Jelou conviertes WhatsApp en tu mejor vendedor. Conoce más" y tarjeta de logo. Sin URL |
| "Tu banco en WhatsApp" (36 s, 182 mil) | doble pregunta: tus clientes ya están en WhatsApp, ¿tu banco ya opera ahí? | 0-8 s reencuadre (antes canal de atención, hoy canal bancario completo) · 8-20 s abrir cuentas, remesas y colocar créditos dentro del chat, sin formularios externos · 20-25 s "no es un chatbot, es infraestructura bancaria" | transformar los servicios financieros hoy |
| Short "Desde el 1 de octubre cada mensaje cuenta" (29 s, 42 vistas) | creador a cámara en tono de chisme: "ven acá y te cuento" | 0-7 s hook · 7-18 s Meta va a cobrar (logo y notificación) y Jelou cobrará por transacción de workflow · 18-25 s mockup de banco | "¿Quieres saber cómo estimar el costo? Comenta costos" (CTA por comentario) |
| Short "De un prompt a un agente de citas médicas" (28 s, 205) | voz: describe lo que necesitas y Brain se encarga | 0-7 s prompt en la caja de Brain · 7-13 s "pensando" y "construyendo flujos" (nodos) · 13-25 s chat en celular: el paciente pide cita, elige especialidad y queda confirmada | "Empieza a construir gratis" |

Lectura: **todo gancho es una pregunta o un hecho con fecha; el beneficio va en la primera línea y el producto real aparece antes de los 12 s.** El CTA es de baja fricción, pero varios piden "comentar" o "conocer más" sin URL en pantalla.

### Edición: cómo están hechos
- **Casa A, presentador sobre escritorio (los dos de más vistas).** Un hombre o una mujer sentados con laptop, fondo degradado turquesa o azul. Texto cinético arriba (sans geométrica, blanca y gruesa; la palabra clave más grande y con el ícono de WhatsApp), subtítulos de 1-3 palabras al centro-bajo que aparecen palabra por palabra, **mockup de celular con chat real de WhatsApp que entra a ~1 s**, cortes de plano a pantalla cada 2-4 s y tarjeta final de logo con su lema. Mismo decorado en los dos: es una plantilla de estudio. Formatos: vertical 360x640 y horizontal 640x360.
- **Casa B, motion graphics sin persona (citas médicas, 28 s; integraciones, 11 s).** Fondo azul verdoso oscuro con degradado; captura de la pantalla de Brain (prompt, "pensando", nodos), celular con burbujas que se escriben solas y logo al final. El de integraciones usa un primer plano de una mano con mouse y logos de apps (Shopify, Stripe, Google, HubSpot, FedEx) girando alrededor.
- **Casa C, creador a cámara.** Hombre con sudadera, plano medio con cámara en mano, subtítulos azul marino sobre blanco en el tercio bajo, **cutaways gráficos** (logo, workflow, notificación de Meta, mockup bancario) y CTA por comentario. Es la única pieza que parece de creador y no de estudio.
- **Casa D, lanzamiento y caso.** Agent 2.0: collage de papel (Brain Studio, Mercado Pago, un camión), dos cofundadores conversando en un sofá y demo en pantalla, 4 min. Banisi: entrevista a un ejecutivo, tarjeta "todo inicia con un Jelou" y estadística grande (+146 %) con nombre y cargo en el pie.
- **Casa E, motion graphic de 2023 con pregunta-dolor (rechequeo 8-oct, 25 s, 50.502 vistas, 44 likes, ene-2023; bajado en 360p y mirado cada 2,5 s, sin audio ni Gemini).** Abre con una mujer con laptop sobre fondo claro y la pregunta en grande "¿Necesitas crear una App?"; a los 2-3 s un emoji con lentes responde "¡No!"; entra un celular con íconos de apps y "Hazlo por WhatsApp"; después tarjetas blancas de esquinas redondeadas aparecen una a una (catálogo de compra, integración con CRM y ERP, app de delivery, firmar documentos, validar identidad, botón de cobro y pago); cierre con el logo y el lema "Tu negocio online en menos de 24 hs, sin código y sin apps". Es el mismo patrón de las piezas nuevas (pregunta que nombra el dolor, producto antes de los 12 s, tarjeta final con lema) y la única de las de más de 10 mil vistas que no depende de la distribución de 2026.
- **Primeros 3 s:** título cinético con la pregunta y el celular entrando. **Duraciones:** 11 s (integraciones), 28-46 s (shorts), 94 s (caso), 4 min (lanzamiento).
- **Marca:** logo celeste y tarjeta de cierre fija en todo; paleta turquesa y azul; nadie en cámara en las piezas de producto puro.

### Qué toma Onia (pauta de Onia Platform y web) y qué NO
**Toma, con el porqué:**
1. **Un ángulo, muchas versiones.** Jelou lanza lotes de 40-50 anuncios con el mismo titular y deja vivir los que sirven. Onia: 2-3 versiones de UN ángulo (el paciente que no volvió), como ya dice `ONIA_ADQUISICION_Y_PAUTA.md` §2.6. No arrancar con 50. *Dónde/evidencia: Biblioteca, página Jelou Latam, 121 activos de finanzas creados casi todos el 26-ago y el 2-oct; ids 903641995760863 y 1027769523414685.*
2. **Atar la pieza a un hecho con fecha.** El 1-oct Meta empezó a cobrar los mensajes de servicio y Jelou sacó short, blog y charla el mismo mes. Una pieza "qué cambia el 1-oct para tu clínica" sirve para la marca personal de Sergio Urcullo (comunidad), no para la pauta de la plataforma. Verificar cada dato de Meta antes de publicar. *Evidencia y cautela: el short del 30-sep tiene 42 vistas, así que el hecho con fecha no garantiza alcance sin distribución.*
3. **Hook en pregunta que nombra al cliente y su canal.** Para Onia: pregunta sobre el WhatsApp de la clínica y el paciente que escribe, con la pantalla real antes de los 12 s. *Dónde/evidencia: los shorts de 212 mil y 182 mil vistas (24-mar y 16-mar-26) y el de 50 mil de ene-2023 abren con una pregunta; el celular con chat entra en el primer segundo.*
4. **Formato demo de ~28 s sin persona** (prompt o configuración → celular con la conversación → resultado). Es el formato más barato y no necesita presentador. Se copia el formato, **no la promesa**: Onia no vende "agente que agenda" hasta que la tabla "se promete / funciona" lo diga. *Dónde/evidencia: short "De un prompt a un agente de citas médicas" (17-abr-26), 28 s, 205 vistas: copiar la estructura prompt → nodos → celular, no la cifra.*
5. **Pregunta-dolor con respuesta en 3 s, motion graphic sin persona** ("¿Necesitas crear una app? ¡No! Hazlo por WhatsApp", 25 s, 50 mil vistas). Para Onia: "¿Todavía anota las citas en un cuaderno? No: agenda, ficha y cobro en un lugar", filmado con pantalla real. *Evidencia: video Gl_56p-UdFU, mirado el 8-oct.*
6. **Piezas cortas de objeciones y comparativas** (Jelou tiene "las 6 objeciones para no implementar IA", "cuándo responde la IA y cuándo un humano", "Jelou vs n8n"): ideas para la marca personal de Sergio Urcullo, no para la pauta.

**No toma, con el porqué:**
- **Constructor de nodos, "Build it for me", precio por ejecuciones, banca, KYC y cobro en el chat.** Otro cliente y otra escala; falla el test de tres preguntas (§10) y Bolivia depende del QR del BCP.
- **Lenguaje de infraestructura y transacción** ("agente transaccional", "infraestructura bancaria"): no es el trabajo de una clínica. Onia titula con el trabajo del rubro y la plata del dueño (§2.5, punto 3).
- **CTA "comenta X".** En Onia el comentario → DM de Instagram está sin probar (2 rechazos de Meta, 0 leads).
- **Cifras y logos de terceros** (+146 %, 50 millones, Banisi). Onia tiene cero clientes pagando: nada de testimonio ni cifra propia hasta que exista.
- **Tuteo en la pauta a clínicas.** Jelou tutea; Onia les habla de USTED a los clientes. En la marca personal de Sergio Urcullo (voseo) sí.
- **Dato a mirar:** 56 anuncios de Jelou ya llegan a Bolivia. La madre puede abrir los ids de arriba para ver qué ve un dueño de clínica boliviano. Es señal, no amenaza: Jelou no tiene vertical de salud.
