# Cuatro anunciantes que sobreviven en la Biblioteca y no tenían ficha (8-oct-2026)
> CitaPro, Calendico, Medizona y NativeCode. Fuentes: sus anuncios capturados el 1-oct (`anuncios/<nombre>/`, en la carpeta de al lado) y su sitio público
> de hoy (texto del navegador o `WebFetch`, sin cuenta). **Las cifras de cada página son suyas, sin fuente ni método.**

| | CitaPro | Calendico | Medizona | NativeCode |
|---|---|---|---|---|
| A quién | Centros médicos y estéticos de LATAM (+10 países) | Servicios con cita: peluquerías, salud, estética, lavaderos (AR por el +54) | Médicos y consultorios privados, México | Clínicas («Agenda Clínica»); **no se encontró web ni precio** |
| Qué vende | Agente de IA por WhatsApp 24/7: responde, agenda, recuerda, cobra anticipo, consentimiento digital, reactiva pacientes | Asistente de reservas por WhatsApp: agenda, confirma, recuerda, pide reseña en Google Maps | Expediente electrónico certificado NOM-024, agenda con recordatorios, recetas por WhatsApp, CFDI | Recordatorios por WhatsApp para confirmar o cancelar |
| Precio hoy | **USD 59** (1.000 conversaciones IA, 6 profesionales) · **USD 99** (2.000 conv., 10 prof., API); extra USD 0,10 / 0,09 por conversación | **USD 29** (100 conv., 3 prof.) · **99** · **199**; −14 a −25 % anual; **add-ons USD 10-15/mes** | MXN *(moneda no escrita)* 215 · 450 · 1.200 + IVA; 2×1 de lanzamiento | sin dato |
| Entrada | **Demo de 30 min con asesor** (la prueba de 7 días la activa él) | **7 días gratis**, «Empezar gratis hoy» | Registro gratis sin tarjeta | sin dato |
| Anuncios (Biblioteca) | 3 activos: 17-jul (video de 61 s), 6-ago, 15-sep. Copy **«No es X, no es Y… Es Z»** | 1 video de 19 s, nació el 1-oct | 1 video de 30 s, nació el 1-oct | 2 imágenes, nacieron el 1-oct, <100 impresiones |
| Lo que cuenta | Es el único de los cuatro con anuncios de más de 6 semanas | Nada que concluir: horas de vida | Nada que concluir | Nada que concluir |

**Lo útil para Onia** (ver `ONIA_UI_MEJORAS_1.0.md` §7): el copy de CitaPro (hallazgo T1-1), que **tres competidores cobran el bot
por conversación con excedente** (T1-3), los **add-ons chicos de USD 10-15** de Calendico y las **reseñas de Google** que
ofrecen CitaPro y Calendico (T1-5), y el **consentimiento informado digital** de CitaPro y Medizona (T1-6).

**Lo que no se puede concluir:** CitaPro dice «+500 centros», «−90 % de ausencias» y «3× más citas»; ninguna tiene fuente.
Onia no repite números ajenos. Sin web de NativeCode no hay ficha: se pide la Biblioteca desde la PC.

---

## Contenido, pauta y comunicacion (medido 2026-10-08)

> Pasada del 8-oct sobre redes, anuncios y comunicación de CitaPro, Calendico, Medizona y NativeCode (Agenda Clínica). Lo anterior de esta ficha (producto y creativos del 1-oct) no se repite. Sin cuentas, sin formularios y sin navegador.
> **Las cifras de venta de ellos («+500 centros», «−90 % de ausencias», «3× más citas») no tienen fuente y Onia no las repite.** Lo que es lectura mía va marcado como *(lectura)*.
> **Dato que ordena todo lo demás:** de los cuatro, **solo CitaPro entrega anuncios en Bolivia (5)**. Calendico, Medizona y NativeCode tienen **0** en Bolivia, todos los estados, medido por id de página. Medizona pauta en México (MXN), NativeCode en Chile (sus precios están en CLP) y Calendico no está en Bolivia: paga en USD y tiene un tutorial de reservas con Mercado Pago, que apunta a Argentina y a países con ese medio.

### Cobertura

| | CitaPro | Calendico | Medizona | NativeCode (Agenda Clínica) |
|---|---|---|---|---|
| **Redes halladas** | Facebook `citapro.software`, Instagram `@citapro.app` y TikTok `@citapro.app` (los enlaza su web). Sin YouTube ni LinkedIn | Instagram `@calendico` (**1.108 seguidores**), LinkedIn, YouTube `@Calendico`. Sin TikTok ni Facebook enlazados | Los 3 íconos de redes de su web apuntan a `#`: **están muertos**. No se halló Instagram, TikTok ni YouTube | **Ninguna.** Ni web ni redes en 3 búsquedas |
| **Biblioteca de Meta** | Página `117313424662542`: **16 anuncios** (todos los estados), **5 en Bolivia** | Página `106847365632812`: **17 anuncios** (recontado el 8-oct por id de página), todos con el mismo titular; **0 en Bolivia** | Página `MedizonaEspecialistas` `197828183404270`: **10 anuncios** (recontado el 8-oct), todos del 7 y 8-oct. Otra página, `Medizona`, tiene 1 anuncio de **2023**. **0 en Bolivia** | Página `865124223345574`: **5 anuncios**, 4 de hoy. **0 en Bolivia** |
| **Videos mirados** | **TikTok:** 40 videos listados el 7-oct (el tope de la consulta), **6 bajados y 5 analizados** de punta a punta. **El 8-oct, al verificar, `yt-dlp` ya no pudo listar el perfil (error de JSON de TikTok), así que vistas, mediana y ritmo no se volvieron a medir** | **YouTube:** 12 videos listados, **3 analizados** (el pitch de 93 s, el autoresponder con IA y las reseñas) | Ninguno propio. El video de anuncio de 30 s del 1-oct se vio en **cuadros fijos** (sin audio) | Ninguno. Solo imágenes de anuncio |
| **Método** | `yt-dlp` baja TikTok sin problema. Gemini `gemini-flash-lite-latest` (el modelo estándar dio **429 de cuota** y no se reintentó). **2 videos confirmados con cuadros propios** (`ffmpeg`, 1 cuadro cada 2 s) | `yt-dlp` para listar. Gemini por URL de YouTube. Instagram por `WebFetch` | Cuadros fijos guardados el 1-oct en `anuncios/medizona/` | Capturas del 1-oct en `anuncios/nativecode/` |
| **No se pudo** | Instagram: `WebFetch` devolvió solo imágenes. Seguidores de TikTok. Textos y creativos de los anuncios nuevos | Vistas y textos de Instagram. Los videos de anuncio de 19 s (solo cuadros del 1-oct) | `medizona.com` devolvió vacío y `medizona.mx` no existe; se leyó `medicos.medizona.com.mx`. Sin seguidores | Todo lo orgánico: no hay nada que leer |

**Límite de la Biblioteca (el mismo de toda la pasada):** `ads_library_search` devuelve titular y fecha, **no el texto, el creativo, el botón ni el destino**, y Facebook no abre sin navegador. Los textos de abajo son los capturados el 1-oct.

### Estructura de contenido organico

| | Qué hay | Lectura |
|---|---|---|
| **CitaPro, TikTok** `@citapro.app` | **40 videos de nov-2024 a jul-2026** (los 40 más recientes). Vistas de **55 a 1.373; mediana 254; los 40 suman 13.585**. Duran: 8 de 20 s o menos, 21 de 21 a 60 s, 11 de más de un minuto. **Ritmo en ráfagas:** 7 en jun-2025, 8 en nov-2025, 6 en ene-2026, y **ninguno desde el 7-jul**: llevan 3 meses sin publicar | **El orgánico de CitaPro casi no vende:** ningún video llega a 1.400 vistas. Lo que mueve es la pauta (ver más abajo) |
| Pilares de CitaPro *(conteo a ojo por título)* | **(1) «Pautás sin automatizar el WhatsApp y botás plata»** (~12). **(2) Antes y después de un negocio con presentador:** barbería, centro estético, consultorio (~6). **(3) Presentador «creado con IA» declarado** (2, el 19 y 20-nov: «esta doctora/esteticista es creada con IA», 150 y 268 vistas). **(4) Consentimiento digital en lugar del papel** (2). **(5) Reclutamiento de afiliados** («comisión por recomendar», 2; el de 14-ene tiene 731 vistas, el segundo mejor del último año). **(6) Función suelta o «prueba 7 días»** (~9) | Hay un solo pilar con lógica de venta: el dolor del que **ya paga anuncios** |
| **Calendico, Instagram** | **12 piezas visibles: 8 reels (19-feb al 21-jul-2026) y 4 carruseles de 2025** (ene a abr). Sin vistas ni textos. **Último post: 21-jul** | Cuenta casi parada: **2,5 meses sin publicar** |
| **Calendico, YouTube** | **12 videos:** 11 tutoriales de pantalla de 65 a 209 s con **35 a 280 vistas** (conectar WhatsApp, crear profesionales, horarios, reseñas de Google, pagos con Mercado Pago, autoresponder con IA) y **1 pitch de 93 s con 6,6 mil** | Es un **centro de ayuda en video**, no marketing: sirve para que el cliente se arregle solo |
| **Medizona** | **Nada orgánico hallado** | Sin canal |
| **NativeCode** | **Nada orgánico hallado** | Sin canal |

### Pauta en Meta

| | CitaPro | Calendico | Medizona | NativeCode |
|---|---|---|---|---|
| **Anuncios (todos los estados)** | **16** · **5 en Bolivia** | **17** (el 2-oct se contaron 15) | **10** de la página de anuncios + 1 de 2023 en otra página | **5** |
| **Desde cuándo** | El más viejo, **17-jul (83 días)** | **25-sep a 6-oct** (hasta 13 días) | **7 y 8-oct** (0 y 1 día) | **5 a 8-oct** (0 a 3 días) |
| **Qué titulan** | Cabinas llenas, agenda bajo control · Tu WhatsApp en piloto automático · Tu WhatsApp, ahora un asistente con IA · Más citas confirmadas, menos ausencias · Toda tu agenda en una sola pantalla · y desde el **2-oct, a médicos:** Tu consulta ordenada cada día · Más consultas sin gastar más en ads · Pautar no basta: el seguimiento convierte · (3-oct, sin Bolivia) Deja de pagar herramientas sueltas | **El mismo titular en todos: «Tu WhatsApp que Gestiona Citas»** | Deja de confirmar citas una por una · Recordatorios automáticos de cita · Más tiempo para tus pacientes · Nunca pierdas una cita más · Tu expediente, certificado y en PDF · Videoconsulta integrada, sin apps extra · **20 % de descuento en tu plan anual** | Reduce las inasistencias de tus pacientes · Prueba gratis Agenda Clínica · **Ordena tu consulta desde $14.990 al mes** · **Fichas y agenda desde $14.990 al mes** |
| **Formato** | Video de 62 s con presentadora (3 versiones de un mismo concepto: 17, 24 y 29-jul), imagen con persona y burbujas de WhatsApp, imagen de calendario «9 confirmadas, 2 ausencias» | Video de 19 s con UGC y pantalla (1-oct) y rotación de creativos | Video de 30 s hecho con IA (1-oct). Los 9 anuncios de hoy no se vieron | Imagen con la interfaz y el precio en la pieza |
| **CTA y destino** | «Más información» → **`miagenteia.citapro.app` → demo con asesor** | «Ver detalles» / «Probar gratis» → `calendico.com` | «Más información» → formulario en `medicos.medizona.com.mx` | **«Enviar mensaje de WhatsApp»** (es el único que va a WhatsApp) |
| **País de entrega** | Bolivia y el resto | No Bolivia | México (MXN) | Chile (CLP) |

**Los que más llevan (3-5 de CitaPro, los únicos con más de 30 días):**

| Id | Inicio · días | Titular y formato |
|---|---|---|
| `1880949689530541` | 17-jul · **83** | Cabinas llenas, agenda bajo control. Video de 62 s. **En Bolivia** |
| `992374430294009` | 24-jul · **76** | Mismo titular que el anterior |
| `1371570511144697` | 29-jul · **71** | Mismo titular otra vez (la ronda 1 las tomó como 3 versiones de un concepto). Un cuarto con ese titular (`1081083484515155`) arrancó el 16-sep, no en Bolivia |
| `2253602242100999` | 6-ago · **63** | Tu WhatsApp en piloto automático. Imagen. **En Bolivia** |
| `1383721673326033` | 6-sep · 32 | Mismo titular que el de 6-ago |

*(Lectura)* **CitaPro sostiene 4 anuncios con el titular «Cabinas llenas» (17, 24 y 29-jul, y uno que nació el 16-sep) y 2 con «piloto automático» (6-ago y 6-sep), más 3 con «asistente con IA» (15, 25 y 29-sep), en 16 anuncios en total** *(recontado el 8-oct)* (AgendaPro: 314). Es el único de esta lista con una estrategia de «un concepto, pocas versiones» que se parece a la que Onia tiene escrita.
**El giro:** el 2-oct nacieron en una sola fecha 3 anuncios dirigidos a **médicos** («Pautar no basta: el seguimiento convierte» y «Más consultas sin gastar más en ads» hablan de pauta; «Tu consulta ordenada cada día» no) y **los tres llegan a Bolivia**. Un cuarto, «Deja de pagar herramientas sueltas» (3-oct), no llega. CitaPro dejó de hablarle solo a la estética: **desde esta semana le habla al médico de Bolivia, con demo y con USD 59 en su web.**
**Medizona** corre todo el lote en 48 horas: es una prueba que recién empieza; **no hay nada que concluir sobre qué funciona**. Mismo caso de **Calendico** (13 días) y **NativeCode** (3).

### Comunicacion

| | CitaPro | Calendico | Medizona | NativeCode |
|---|---|---|---|---|
| **Titular de la web** | «Software #1 en Latam» y «Gestión y Automatización de Citas con Inteligencia Artificial» | «Tu asistente de reservas por WhatsApp» | «La Plataforma Médica que Moderniza tu Consultorio» | Sin web hallada. En la pieza: «Agenda pacientes en modo automático» |
| **Promesa** | Un agente de IA que responde, agenda, recuerda y cobra el anticipo por WhatsApp | «Agenda turnos, responde dudas frecuentes y envía recordatorios (sin mover un dedo)» | Plataforma mexicana «certificada NOM-024-SSA3-2012», expediente, agenda, videoconsulta y «100 % deducible de impuestos» | Recordatorios y confirmación de horas por WhatsApp, y pagos con Mercado Pago |
| **A quién** | Consultorios médicos, estética, spa y salones | Negocios chicos con cita: peluquerías, centros de salud, belleza, lavaderos | Médicos con consultorio privado en México | Clínicas |
| **Voz** | Informal «tú» | **Voseo** («dedicate», «Obtené») | «Tú», neutro mexicano | «Tú» |
| **Prueba** | «+500 centros», «−90 %», «3× más citas» (de ellos, sin fuente) | Ninguna cifra; reseñas de Google como función | Una **certificación** como argumento | Ninguna |
| **Precio visible** | **Sí, USD 59 · 99 · 175 al mes** (−25 % anual: 531, 891 y 1.575 al año) | **Sí, USD 29 · 99 · 199** (−14 a −25 % anual) y **add-ons de 10 a 15 al mes** | **Sí, 215 · 450 · 1.200 más IVA** (la web no escribe la moneda) | **En la pieza:** «desde $14.990 al mes» (CLP) |
| **Clics hasta empezar** | **1** a «Prueba gratis 7 días». Pero **el anuncio manda a una demo**, no a la prueba | **1**, 7 días gratis | **1** a «Registrarse Gratis» | 1 a WhatsApp |
| **CTA** | «Prueba gratis 7 días», «Agenda una Demo» | «Probar gratis», «Contactar a ventas» | «Registrarse Gratis», «Agendar Demo» | «Enviar mensaje de WhatsApp» |

**Dos embudos distintos en CitaPro:** el anuncio va a **demo con asesor** (`miagenteia.citapro.app`) y la web va a **prueba de 7 días sin demo**. Mide la demo en anuncios y la prueba en el sitio.

### Guiones de sus videos/anuncios

**CitaPro** (TikTok y anuncio; el 62 s del 1-oct lo desarmó la ronda anterior):

| Pieza | Gancho | Tramos | Cierre |
|---|---|---|---|
| **«Anuncios sin automatizar»** · 48 s · 734 vistas · nov-2025 | «Pon atención a este dato: WhatsApp es el canal número uno…» | 0-6 el dato · 6-18 «si pautas y no lo automatizas, botas dinero» · 18-23 no das abasto con los mensajes · 23-41 la IA responde, agenda y cobra anticipos · 41-48 CitaPro | «Más información» con flechas |
| **Barbería** · 16 s · 570 vistas · feb-2026 | «Mi barbería antes era un despelote» | 0-6 el caos (sin cita, esperas largas, se van aburridos) · 6-11 «ahora con CitaPro agendan solos» y se ve la pantalla: barbero, servicio, hasta la bebida · 11-16 prueba | «Si quieres una barbería de lujo, pruébalo 7 días» |
| **Dueña de centro estético** · 33 s · 361 vistas · jun-2026 | «Si eres dueña de un centro estético, imagina estar en tu casa en pijama…» | 0-12 la agenda llena sin contestar un mensaje · 12-23 «eso es CitaPro»: responde, agenda, recuerda, hace seguimiento · 23-29 «olvídate de los que te dejan en visto» | «Dale clic aquí abajo» y caja roja «Accede a la prueba GRATUITA» |
| **Consentimiento digital** · 53 s · 270 vistas · jul-2026 | «El papel desapareció, pero el riesgo legal sigue» | 0-9 el problema · 9-19 el paciente firma desde el celular antes de llegar · 19-37 rubros (estética, láser, tatuaje, odontología, barbería) · 37-49 cero carpetas | «Prueba gratuita en el link de la bio» |
| **Afiliados** · 53 s · 731 vistas · ene-2026 | «¿Eres visitador médico y tu ingreso ya no rinde?» | 0-13 ingreso extra recomendando · 13-27 el producto · 27-47 «50 % de comisión inmediata y 20 % mensual» | «Comenta “yo quiero”» |
| **Anuncio «El secreto de…»** · 62 s · 83 días | «El secreto de los centros estéticos que llenan su agenda…» | «No es bajar los precios, no es invertir más en publicidad, no es tener las mejores cabinas» → «es convertir cada lead en cita antes de que se enfríe» → responde, agenda, confirma y cobra el anticipo | «Agenda tu demo ahora» |

**Calendico:**

| Pieza | Gancho | Tramos | Cierre |
|---|---|---|---|
| **Pitch «en 90 segundos»** · 93 s · 6,6 mil vistas | «Conocé Calendico, la plataforma que automatiza el agendamiento por WhatsApp» | 0-4 gancho · 4-16 la experiencia del cliente, de WhatsApp a la web · 17-28 tres beneficios: interacción rápida, 24 horas, cliente empoderado · 29-43 flujo de reserva paso a paso · 44-83 el panel del negocio, sincronizado en vivo | «Una agenda llena, sin perder tiempo en WhatsApp». Sin CTA hablado |
| **Autoresponder con IA** · 191 s · 280 vistas | «Hoy vemos cómo funcionan las respuestas automáticas con IA» | 0-17 el beneficio · 17-169 casos en el chat: saludo, horarios, sucursales, precios, reserva · 169-191 cómo activarlo | «Habilítenlo, pruébenlo y déjennos feedback» |
| **Anuncio de 19 s** (cuadros del 1-oct) | Chats de WhatsApp desordenados y «¿Cuánto tiempo de tu semana se va en coordinar turnos?» | La pantalla real de la reserva · «Tu reserva fue realizada con éxito» · «Menos trabajo administrativo, más tiempo para tus pacientes» | Una mujer a cámara: «Obtené ya tu prueba gratuita haciendo clic» |

**Medizona** (anuncio de 30 s, cuadros del 1-oct): un médico generado con IA frustrado con su agenda de papel («en papel no escala») → la app en el celular → el paciente contento → tarjeta final violeta y naranja «Conoce la plataforma más completa para los profesionales de la salud» con `medicos.medizona.com.mx`. El texto de apoyo hace una pregunta («¿cuántas citas se te pierden por anotarlas en una libreta?») y manda a un **formulario**.

**NativeCode** (solo imagen): **pregunta de dolor** («¿Pierdes horas porque tus pacientes no llegan?», «¿Te bloquean una hora y después no aparecen?») → qué hace (recordatorios por WhatsApp con confirmar o cancelar) → «centraliza tus citas, pacientes y recordatorios» → «Escríbenos por WhatsApp». Las dos piezas nuevas de hoy van **directo al precio**.

### Edicion

| | CitaPro | Calendico | Medizona | NativeCode |
|---|---|---|---|---|
| **Quién habla** | **Presentador o presentadora a cámara, casi todos con aspecto sintético:** la dueña de spa de 33 s y el barbero de 16 s son escenas de IA *(cuadros)*; y los gráficos 3D son de biblioteca. Declaran dos videos «creados con IA» | Un presentador en el pitch y una presentadora en las reseñas, a cámara (no se verificó si son reales), y voz en off en los tutoriales | Un médico generado con IA, sin voz propia en los cuadros fijos | Nadie: imagen con interfaz |
| **Subtítulos** | **Letra gruesa sin serifas, blanca con la palabra clave en amarillo**, centrada en el tercio inferior y media, **1 a 4 palabras por golpe** y animación palabra por palabra. Del estilo de «Reels» *(cuadros del barbero y del spa)* | Tutoriales **sin subtítulos**. En las reseñas, tarjetas verdes flotantes abajo a la derecha (según Gemini) | n/d | n/d |
| **Ritmo** | **3 a 4 cortes cada 10 s** según Gemini en los de presentador; el de la dueña de spa es **una toma casi continua** con gráficos 3D (robot, cerebro de IA, celular) flotando junto a la cara *(cuadros)* | 4 a 6 cortes cada 10 s en el pitch, 1 a 2 en los tutoriales | n/d | n/d |
| **Pantalla** | Capturas de la reserva en el celular (servicio, barbero, fecha, hora) | **Pantalla dividida: celular del cliente a un lado, panel del negocio al otro**, con un cursor que guía (según Gemini, en dos pasadas independientes; sin cuadros propios porque YouTube bloquea la bajada). La misma pantalla dividida aparece en el video de Reserve with Google de AgendaPro (249 mil) | App en celular al final | Calendario y tablero de la app dentro de un mockup |
| **Primeros 3 s** | Un rótulo con nombre y cargo («especialista en anuncios») o la frase en amarillo sobre el presentador, con el logo de WhatsApp flotando | Logo animado a la izquierda y el presentador entra a cuadro | Médico con la agenda de papel | Titular grande en la imagen |
| **Formato y duración** | 9:16 de 7 a 213 s, la mayoría de 30 a 60 s. El anuncio, de 62 s | Pitch 16:9 de 93 s. Anuncio 9:16 de 19 s | 9:16 de 30 s | Imagen cuadrada y vertical |
| **Música** | Corporativa y «tech» con efectos de notificación | Alegre, de oficina, con clics | n/d | n/d |

### Que toma Onia (pauta de Onia Platform y web) y que NO

**Toma**

1. **«Un concepto, pocas versiones» ya está validado por CitaPro con 83 días de un mismo video.** Es el único de los cuatro que llega a Bolivia y el único con más de 30 días. Onia: una pieza y 2 o 3 versiones (ya escrito en `ONIA_ADQUISICION_Y_PAUTA.md` §2.6). **Esto confirma, no agrega.**
2. **Dos embudos medidos por separado:** la pauta lleva a una conversación 1 a 1 y el sitio a la prueba. Onia ya vende 1 a 1 con Sergio Urcullo (§5.1): **mantener el anuncio a la conversación por WhatsApp y el sitio a «14 días sin tarjeta», y no mezclarlos en un mismo número de conversión.**
3. **La pantalla dividida del Calendico (según Gemini en dos pasadas, sin cuadros; la usa también AgendaPro en su video de 249 mil, 30-38 s)** (el celular del paciente a un lado y la agenda de la clínica al otro, con un cursor que guía): es la forma más barata de mostrar «el paciente reserva y la clínica lo ve», sin presentador. Para Onia: la reserva y Pendientes, **solo con las capturas de la cuenta demo** y solo lo que esté en ✅.
4. **El centro de ayuda en video de Calendico (11 tutoriales de pantalla con voz en off)**: baja las horas de soporte por cliente, que es **el techo del negocio** (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §9). Sergio Urcullo graba la pantalla una vez y el cliente se arregla solo. No es marketing: es soporte. *Dónde:* ayuda dentro de la plataforma y WhatsApp de soporte. *Evidencia:* 11 tutoriales de Calendico de 65 a 209 s (listado 8-oct).
5. **Precio de los add-ons visible y chico (USD 10-15 de Calendico)**: ya anotado arriba en «Lo útil para Onia». El dato nuevo es que **lo muestra en la página y no en el anuncio**.
6. **El rótulo con nombre y cargo en los primeros 3 s** de CitaPro: sirve para Sergio Urcullo presentando la pantalla. *Dónde:* video de pauta y reels de la marca. *Evidencia:* cuadros del barbero y del spa de CitaPro (TikTok).

**No toma**

- **Presentadores de IA que hacen de dueño** («Mi barbería antes era un despelote», la dueña de spa): son un testimonio fabricado. Onia: el presentador explica y demuestra, **nunca se hace pasar por cliente**, y hoy hay cero clientes. Que CitaPro lo declare («creada con IA») no cambia la regla.
- **«Sin intervención humana», «piloto automático», «el agente cobra por ti».** Onia es lo contrario y **eso es el argumento**: *«nada sale sin su OK»*. Diferencia directa con el tono de CitaPro, ya escrita en los guiones F1 y F3 de `FORMATOS-QUE-SOSTIENEN.md`.
- **La fórmula «No es X, no es Y, es Z» tal cual:** ya se adoptó en F3, con otro contenido. No se agrega un tercer «no es».
- **«Software #1 en Latam», «certificado NOM-024», «100 % deducible», «reduce 90 %».** Superlativos y cifras sin fuente; lo certificado depende de otro país.
- **Reclutar afiliados con 50 % + 20 % de comisión** (CitaPro): **no hay equipo de ventas** y la regla es «primero existe la persona, después el documento». Se anota y no se hace.
- **Descuento en el anuncio** (Medizona, 20 % anual): Onia no hace descuentos ni los muestra en la pauta.
- **Precio en la pieza** (NativeCode, «desde $14.990»): sigue prohibido en la pauta de Onia (§5.4); el precio vive en la web.
- **Formulario como destino** (Medizona): Onia manda a una conversación.

**Alertas**

- **CitaPro es el que hoy le habla al médico boliviano con demo y precio en dólares** (desde el 2-oct, 3 anuncios). **No es un competidor del dentista todavía** (no dice «odontología» en los titulares) pero **sí es el primero de esta lista en llegar al mismo público y a la misma plataforma.** Frente a eso, lo que Onia ya tiene escrito se sostiene: **precio fijo en bolivianos, QR del BCP, 14 días sin tarjeta, y el rubro dental con odontograma.** Nada de eso requiere hablar mal de ellos.
- **Medizona, Calendico y NativeCode no son competidores en Bolivia hoy.** Calendico y Medizona corren decenas de piezas en una semana: **no hay con qué medir si funcionan** hasta que lleven más de 30 días. **Se vuelve a medir el 8-nov.**
- **Reglas que se mantienen:** ninguna pieza promete algo que no esté en ✅ en `ONIA_PROMESA_VS_PRODUCTO.md`, ninguna lleva cifra ajena, y el recall del tratamiento a medias **no se usa** hasta cerrar el paso 0.
