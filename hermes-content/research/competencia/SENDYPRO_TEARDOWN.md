# SendyPro — teardown desde la cuenta real de Sergio

> Mirado EN VIVO el 2026-08-30 (app.sendypro.com, cuenta activa de Sergio, plan Plata,
> línea "NUVO" +591 69902462 con WABA aprobado). Referente #3 del carril chatbot
> (con Lety y Dapta). Editar acá si Sendy cambia.

## Qué es

Plataforma boliviana/latam de **venta por WhatsApp para e-commerce**. Todo el producto
gira en UN loop: anuncio Click-to-WhatsApp → frase activadora → "Vendedor IA" del
embudo → cierra la venta (QR/transferencia) → mide compras contra lo que Meta atribuye
(CAPI). WhatsApp-only. Pricing por plan con LÍMITE de chats/día (15/150 visto) y
vencimiento (15 días restantes visibles — presión de renovación permanente).

## Su arquitectura visible

- **5 "agentes" por rol**: Vendedor, Operador, Analista, Marketero, Diseñador (IA por
  función, no por canal).
- **Vendedor IA por EMBUDO/producto**: cada producto tiene su vendedor con su frase
  activadora exacta ("Hola, quiero adquirir el Pack de Herrería…" — la frase que el
  anuncio precarga). Estados atendiendo/en descanso, categorías, pruebas A/B por
  vendedor, "Analizar".
- **⭐ "Entrena a Vendedor IA" (lo mejor del producto)**: el dueño EDITA EL BOT
  CONVERSANDO — escribe "cambiá el precio" / "agregá un método de pago" / "que recuerde
  a quien no responde" (+ chips de ideas rápidas, adjunta fotos/audios/docs) y la IA
  ajusta el guion. Al lado, el **guion actual en PASOS numerados legibles** (1. Saluda
  y presenta, 2. Pregunta cómo pagar, 3. QR o transferencia con INSISTENCIA programada
  "si no responde le insiste 3 veces: 20min / 1.7h / 3h", 4. Muestra el QR) + "Vista
  cliente" + botón "Guardar lo aprendido".
- **Súper Chat**: bandeja completa de tickets (equipo con colas y permisos).
- **CRM** con vistas, **kanban**, **tags**, **difusiones** (broadcast), **phrase lists**,
  **flow builders**, **lista negra global**, **plantillas API**.
- **Integraciones**: Google Sheets (cada nodo del flujo lee tu hoja), Shopify (catálogo),
  Meta CAPI (medición de ads), OrderyPro, Zentro. **IA**: OpenAI o Anthropic ("elige
  Haiku, Sonnet, Opus o Fable por nombre").
- **Gamificación**: ranking "TOP #476 Plata", liga de vendedores por ventas del mes,
  mentores/cursos de la comunidad.
- Footer con noticias del rubro + aviso del cobro por mensaje de WhatsApp (oct-2026).

## Sendy vs Onia — honesto

**Ellos ganan (hoy) en**: el loop de venta e-commerce puro — embudos por producto,
difusiones, CRM kanban, medición de anuncios, multi-vendedor A/B, edición conversacional
del guion. Es su ÚNICO producto y le llevan años.

**Nosotros ganamos en**: el bot vive DENTRO de un sistema real — agenda con citas de
verdad, clientes/pacientes, inventario, facturación (SIAT en camino), pagos QR del
banco, bandeja nativa, canal web propio (Sendy es WhatsApp-only), VISIÓN (el bot ve
fotos — ya vivo; no se lo vimos a Sendy), multi-rubro con plantillas y vocabulario,
guardrails deterministas (Sendy le fía el guion a la IA; nosotros validador
todo-o-nada + 6 reglas), sin límite artificial de chats, precio en Bs.

**Conclusión de posicionamiento**: NO competimos frontal en e-commerce puro. Sendy
vende un VENDEDOR; Onia vende el NEGOCIO ATENDIDO (recepcionista + sistema). El pitch
contra Sendy: "cuando el bot de Sendy vende, te anota en un CRM aparte; cuando el
nuestro atiende, la cita queda EN tu agenda y el cobro EN tu caja".

## Qué copiar (en orden)

1. **Editor conversacional del guion** ("enséñale conversando"): un chat en
   /settings/chatbot donde el dueño escribe "atendé también los domingos" y se traduce
   a un DIFF del doc (preview + Publicar; el validador todo-o-nada de siempre detrás —
   nuestra versión sería MÁS segura que la de Sendy). Mejora #1 de UX.
2. **Guion en pasos legibles** ("así atiende hoy tu asistente"): vista de solo-lectura
   que renderiza el doc publicado como pasos numerados — barata, gran efecto de
   confianza.
3. **Insistencia configurable por el dueño**: nuestros seguimientos/recordatorios ya
   existen como barridos — exponer cadencia y encendido en la UI.
4. **Frase activadora por anuncio** (embudo Click-to-WhatsApp): cuando encendamos Meta
   Ads; el motor de ads DRY ya existe en pausa.
5. **Límite de chats por plan como métrica visible** (no como freno): "chats
   automatizados hoy: N" en el dashboard — transparencia que Sendy usa bien.

## No copiar

- Gamificación/liga/mentores (es su comunidad, no nuestro producto).
- IA sin guardrails deterministas ("la IA ajustará el guion" a secas).
- WhatsApp-only.

## Modelo de IA (mirado 2026-08-30, modal "Configurar IA")

**BYOK — el cliente pone SU API key y paga SU consumo aparte.** "La API key la
consigues gratis en tu cuenta de OpenAI" + botón "ver cómo obtenerla". Ofrecen
elegir modelo con un "índice IA en puntos": GPT-5.6 Luna (51 pts, $0.20/M entrada,
"recomendado") o GPT-5.6 Terra (55 pts, $2.00/M). Anthropic igual ("elige Haiku,
Sonnet, Opus o Fable por nombre"). Sin key propia, el bot corre sin ese "cerebro
extra". La IA se usa en "respuestas de venta, validación de pagos (comprobantes),
memoria y más" — validan COMPROBANTES por visión.

**Ventaja Onia**: nosotros ABSORBEMOS la IA (gpt-4.1-mini vía LiteLLM propio con tope
de gasto; Bs 0,008/foto medido). Un dueño de negocio boliviano consiguiendo API key
de OpenAI (cuenta + tarjeta internacional en USD) es fricción brutal — en Onia la IA
"ya viene", cero configuración.

## Cómo cobra (mirado 2026-08-30, /home/plan — la cuenta real paga Plan 0)

- **21 NIVELES** de $19 a ~$800+/mes (precios en USD y soles — empresa peruana).
- Plan 0 = $19/mes: 1 línea QR + 1 línea Cloud, **150 chats IA/día** (el límite es
  SOLO del plan 0 — del 1 en adelante "chats con IA ilimitados"), 30 usuarios.
- Escalera LINEAL: cada nivel suma ~$39 y agrega 1 línea QR + 1 Cloud + 1
  "calentamiento" (API Cloud topada a 50 chats/día para madurar números nuevos).
  Nivel 1 $39, 2 $78, 3 $117, 4 $156, 5 $195, 6 $234, 7 $273, 8 $312…
- **Tres tipos de conexión**: WhatsApp Business por QR (NO oficial, sin límite),
  API Cloud oficial de Meta, y Cloud "de calentamiento". Mezclan canal no-oficial
  con oficial en el mismo producto.
- **Cobro por Hotmart** (auto con tarjeta) o MANUAL: Yape/transferencia + subir foto
  del comprobante. Contador de vencimiento visible siempre (presión de renovación).

**Lectura para el pricing Onia**: Sendy cobra por CAPACIDAD (líneas y chats/día) y
le pasa el costo de IA al cliente. Onia cobra Bs 390 el add-on con IA INCLUIDA y sin
límite artificial de chats — el argumento de venta contra Sendy es directo:
"$19 se te vuelven $19 + tu cuenta de OpenAI + el límite de 150 chats; acá son
Bs 390 con todo adentro y tu sistema de gestión abajo".

## Interfaz (lectura de diseño)

Dark neón (verde flúor sobre negro), denso, estética gamer/infoproducto: badges,
rangos ("TOP #476 Plata"), liga de vendedores, mentores, banners de urgencia, feed
de noticias en el footer. MUY vendedora y con microcopy educativo bueno ("WhatsApp
Business y la API Cloud no son lo mismo. Son dos productos distintos…"). Es UI de
comunidad Hotmart más que de SaaS sobrio — funciona para su público (emprendedores
e-commerce), NO es la dirección de Onia (claro premium, dueños de negocio formal).
Lo copiable de su UI: el microcopy educativo en cada control y el estado del plan
siempre visible.

## Contenido, pauta y comunicación (medido 2026-10-08)

### Cobertura
**Resultado corto: SendyPro no tiene contenido orgánico ni pauta público verificable.** Su web no enlaza ninguna red social (el pie solo tiene la app de Android, soporte, privacidad y términos). Lo único que publica es un video de bienvenida para clientes que ya compraron.

| Qué | Método | Resultado |
|---|---|---|
| Redes oficiales | Lectura de `sendypro.com`: todos los enlaces | Ninguna. Sin Instagram, TikTok, YouTube ni Facebook enlazados |
| Candidatos probados | `yt-dlp` y `curl` sobre el handle `sendypro` | YouTube `@sendypro` = canal "Sendy Pro" **sin videos, Shorts ni directos**. TikTok `@sendypro` = "cuenta privada". Instagram `@sendypro` = "Sendy", **85 seguidores y 0 publicaciones**. Facebook `/sendypro` es otra persona. Nada confirma que sean de SendyPro; no cuentan como contenido |
| Video propio | Enlace "Ver Demo" del hero: `Bienvenida Sendypro 3.0.mp4` en Google Drive, descargado con `yt-dlp` (29 MB) | **Visto completo:** 9 min 23 s, 1920x1080, 24 fps. Voz transcrita con faster-whisper local, 38 cuadros repartidos (1 cada 15 s), 8 cuadros de los primeros 8 s (1 por segundo) y dos cuadros grandes. Grabado el 9-jul-2026 según el reloj de la pantalla |
| Meta Ads Library | `ads_library_search` con "SendyPro", "sendypro.com", "Sendy vendedor IA WhatsApp" y "Sendy Pro WhatsApp" en BO, PE, MX, CO, EC, CL, AR, ES y US | **0 anuncios de SendyPro** (solo resultados ajenos). La herramienta busca por texto y no por página, y no se conoce el id de su página; no prueba que no pauten |
| Google Play | `curl` de la ficha `com.sendypro.app` | Ficha en español: app para "centralizar y gestionar la comunicación del negocio". Descargas y calificación no extraíbles |

**Re-verificado el 8-oct (segunda pasada, todo coincide):** home de `sendypro.com` (precios US$19 y US$39, 150 clientes por día, "Sin límite" en el hero, 6 preguntas, 4 testimonios genéricos, enlace "Ver Demo" con `?t=547.52`); el video de Drive dura 563,6 s (9 min 23 s); YouTube `@sendypro` sin pestaña de videos ni de Shorts; TikTok `@sendypro` privado; Instagram `@sendypro` con 85 seguidores y 0 publicaciones. Sigue sin haber ninguna red enlazada desde su web.

**Qué no se pudo:** contenido de su comunidad (el video menciona un grupo de WhatsApp, tutoriales, consejos, plantillas y recursos dentro de la app: todo detrás del login), seguidores reales de cualquier red, música y efectos de sonido del video, y qué pide la pantalla de alta (`/signup` carga con JavaScript y sin navegador no se lee).

### Estructura de contenido orgánico
- **No hay organico público.** Su crecimiento se ve por otro lado: comunidad (grupo de WhatsApp, ranking "TOP #N" por facturación, mentores, cursos), cobro por Hotmart y pago manual por Yape, Plin, Binance o banco con comprobante. Es un modelo de infoproducto latinoamericano (soles, dólares, Yape y Plin), no de contenido en redes (coincide con `SENDYPRO_TEARDOWN.md`).
- **El contenido que sí hay es de retención, no de captación:** una serie de tutoriales dentro de la app. El video mirado es "el primer vídeo tutorial de Sendypro 3.0", pensado para que el cliente nuevo siga un orden de estudio. Cada agente tiene su módulo de video.
- **Un detalle de la web:** el botón "Ver Demo" abre ese mismo video interno con `?t=547.52`, o sea en el segundo 547 de 563, los últimos 16 s. La demo pública es la despedida del tutorial.
- **Para Onia:** no hay pilar, frecuencia ni formato de contenido orgánico que medir o copiar de SendyPro.

### Pauta en Meta
- **0 anuncios encontrados.** No se pudo mirar ningún creativo, titular, CTA, destino, país ni antigüedad.
- **Dato del video, útil para Onia:** su agente "Marketero" hace exactamente lo que hace §2.6 de `ONIA_ADQUISICION_Y_PAUTA.md`. Lee la Biblioteca de anuncios de Meta todos los días y marca como **ganador** el que lleva muchos días activo y se republica mucho. Frase del presentador, resumida: nadie deja un anuncio encendido tanto tiempo si no vende. Ejemplo en pantalla: un curso de inglés infantil con **123 días activo, 1 anuncio activo, visible en Facebook, Instagram, Audience Network y Messenger**. Al abrirlo muestra "Rayos X: por qué este anuncio funciona" (el gancho, a quién le habla, la oferta, cómo clonarlo) y el botón "Crear mi anuncio con este ángulo".
- **Lectura:** el método de contar los días al aire es el mismo que usa Onia. Confirma que no es una ocurrencia, pero Sendy lo vende a e-commerce e infoproductos, que no son el cliente de Onia.

### Comunicación
- **Titular de la web:** "WhatsApp API Oficial + IA que vende por ti". Subtítulo: conectá tu WhatsApp y que responda "con texto y audios realistas", organice cada contacto y acompañe la venta de principio a fin. Insignia "Partner oficial de Meta Business".
- **A quién le habla:** a cualquier negocio que vende por WhatsApp, con foco en e-commerce (menciona Shopify, Sheets, Gmail, Zapier). No nombra rubro en la home.
- **Tono:** tuteo neutro, directo, frases cortas ("Conecta, enseña y activa", "Hecho para vender mejor por WhatsApp"). Tema oscuro, letra redondeada (Nunito), íconos de Material.
- **Precio visible, en dólares y simple:** Plan Inicial US$19 y Plan Completo US$39 cada 30 días, con la regla "lo único que cambia entre planes es la cantidad y el tipo de conexiones; todo lo demás es ilimitado". Paquetes extra de US$39 (78, 117, 156 "y así sucesivamente"): es la misma escalera lineal que se vio en la app, así que la duda de `BACKLOG_DE_PRODUCTO.md` ("si hay 21 niveles o solo dos") queda aclarada: la web no numera niveles, publica dos planes y paquetes de US$39 sin tope.
- **Prueba:** cifras sin fuente (500+ empresas, 99,9 % de disponibilidad, menos de 3 s de respuesta, 4,9 de calificación) y cuatro testimonios genéricos con nombre abreviado y empresa de nombre genérico (TechStore, AgenciaX, StyleShop, FoodApp; "ventas +340 % en 3 meses"). Sin fotos, enlaces ni casos comprobables.
- **Una contradicción en la misma página:** el hero dice "Sin límite" de mensajes de IA, y el Plan Inicial dice "hasta 150 clientes automatizados por día". Solo el Plan Completo es ilimitado.
- **FAQ de seis preguntas** con respuestas de una o dos líneas. La primera es "¿La IA cobra por mensaje? No". (En la app el cliente pone su propia clave de OpenAI y paga su consumo aparte, según el teardown del 30-ago; la web no lo dice.)
- **Clics hasta empezar:** 1. Los botones de alta ("Empezar Gratis", "Elegir Plan", "Crear Mi Cuenta Gratis") van a `app.sendypro.com/signup`. No se sabe si pide tarjeta.

### Guiones de sus videos
Solo hay un video propio. Se desarma completo porque es lo único que existe.

| Tramo | Qué dice la voz | Qué muestra la pantalla |
|---|---|---|
| 0:00-0:32 | Saluda, agradece la compra, promete "el mejor CRM del mercado" y avisa que este video solo muestra la interfaz para ordenar el estudio | Panel principal estático con saludo "Buenas noches" y la hora |
| 0:40-1:27 | El "TOP" es un ranking interno por facturación; la cuenta de soporte está en el puesto 387 con USD 4,25 en el mes. "Para que te motives" | Insignia "TOP #387 Bronce" arriba a la izquierda |
| 1:34-2:05 | Novedades: noticias de actualizaciones para quien no mira el grupo | Columna izquierda "Novedades" |
| 2:05-5:46 | Cinco agentes de IA: vendedor (chatbots), operador (catálogo e inventario de e-commerce), marketero (espía de anuncios; el ejemplo de 123 días, de 3:03 a 4:21), analista (preguntarle ventas y márgenes), diseñador (anuncios, miniaturas, logos) | Menú superior con los cinco; abre el Marketero con la galería de anuncios ganadores |
| 5:46-6:52 | Conexiones (API oficial y WhatsApp Business), usuarios (multi cuenta y multi usuario), tutoriales y Super Chat (donde se atiende) | Pantallas de conexiones y de la bandeja de chats |
| 6:54-8:05 | Planes: funciones activas e historial de pagos; renovar con Yape, Plin, Binance o banco y subir comprobante; si se paga por Hotmart, esperar el cobro; cotizar más números conversando con la IA | Pantalla de plan, ventana de pago con el comprobante, chat de cotización |
| 8:05-9:08 | Botón de cerrar sesión; asistente de soporte "Sendy" ("Pregúntame lo que sea") conectado a lo que hace el cliente; pendientes (pedidos, conversaciones, campañas) y mini panel del día | Panel de pendientes a la derecha y tablero con facturación de hoy, conversión, ventas |
| 9:08-9:23 | Da el número de soporte y pasa al siguiente video de la serie | Panel principal otra vez |

- **Estructura:** recorrido de arriba a abajo y de izquierda a derecha del panel, sin historia ni gancho. Es un tutorial de interfaz, no una pieza de venta.
- **Cierre:** el número de soporte y el siguiente video. Sin CTA de compra, porque el que lo ve ya pagó.

### Edición
- **Grabación de pantalla completa de Chrome en Windows,** 1920x1080 a 24 fps, con la barra de tareas, el reloj (02:53 a.m.) y el cursor visibles. **Sin cámara ni rostro,** voz en off de una persona del equipo.
- **Sin cortes, zooms, b-roll, subtítulos, gráficos ni animación** en los cuadros revisados. Es una toma continua; algún cuadro oscuro o vacío al pasar de pantalla. Música y efectos: no medidos.
- **Primeros 3 s:** panel quieto con el cursor inmóvil. Ocho cuadros seguidos (uno por segundo) idénticos. No hay gancho.
- **Duración:** 9 min 23 s. Es un video interno enlazado como demo pública.
- **Interfaz que se ve:** tema oscuro con degradados violeta, tarjetas con esquinas redondeadas, íconos de color por agente (rosa, azul, verde, naranja, violeta), botón verde "Super Chat" y botón violeta "Mi plan", pie con barra de estado (hora, tipo de cambio "USD 1 = Bs 8,91", frase de noticias, días que le quedan al plan).

### Qué toma Onia (pauta de Onia Platform y web) y qué NO
**Toma:**
- **Un video de bienvenida de 2 a 3 minutos y tutoriales de un solo tema dentro del producto,** grabados con pantalla y voz. Sendy lo hizo en 9 minutos y sin cortes; el de Onia tiene que ser más corto. Baja las horas de soporte por cliente, que es el techo del negocio (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §9). Va para el cliente que ya paga, no para la pauta. Dónde: dentro de Onia Platform al crear la cuenta y en el correo de bienvenida. Evidencia: el video de Drive de 9 min 23 s ("Bienvenida Sendypro 3.0") es lo único que publican.
- **Una demo pública de menos de 90 s** con Sergio Urcullo y la pantalla real, empezando por el inicio y con un solo CTA. Sendy es el ejemplo de lo que no hay que hacer: su demo es el final de un video interno. Es la brecha de "pieza con persona" de §2.5. Dónde: página de inicio de la web de Onia y la ficha del rubro dental. Evidencia: el "Ver Demo" de su hero salta al segundo 547 de 563 de un video interno.
- **La regla "lo único que cambia entre planes es X, todo lo demás va incluido"** como frase de precio en la web de Onia, en bolivianos y con la IA incluida. Dónde: la sección de precios de la web. Evidencia: textual en su home, "Lo único que cambia entre planes es la cantidad y el tipo de conexiones", y sus dos planes de US$19 y US$39.
- **FAQ de seis preguntas cortas.** Una de ellas, "¿La IA se paga aparte? No, viene incluida", que contra la clave propia de OpenAI de Sendy es una ventaja real. Antes de escribirla se contrasta con `ONIA_CATALOGO_DE_VENTA.md` §8.
- **Validación del método de contar días al aire:** Onia ya lo hace a mano (§2.6). No hace falta cambiarlo.

**No toma:**
- **Cifras sin fuente y testimonios genéricos** (500+ empresas, 99,9 %, "+340 %"). Con cero clientes está prohibido y además se nota inventado.
- **"Sin límite" con un tope escondido** en el plan barato. En el add-on del bot de Onia se dice exactamente qué incluye.
- **El "agente espía" de anuncios.** Falla el test de tres preguntas (§10 de la estrategia): no se le vende al mismo cliente que ya paga (una clínica no clona anuncios de cursos) y es un negocio nuevo disfrazado.
- **Ranking "TOP", ligas, cobro por Hotmart, Yape, Plin, Binance y precios en dólares.** Es su comunidad y sus medios de pago, no los de Onia.
- **Un video de 9 minutos sin gancho como demo.** Y un enlace de "Ver Demo" que cae en los últimos segundos.
