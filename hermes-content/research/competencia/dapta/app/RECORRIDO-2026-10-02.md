# Dapta por dentro: recorrido del 2-oct-2026

Foto de un día. Completa §2 y §7.2 de `../../DAPTA_COMO_FUNCIONA.md` (lo que ya estaba visto no se repite).
Cuenta Free «Leslie», espacio «OnIA», Chrome de Sergio Urcullo, pestaña propia (cerrada al final).
Capturas nuevas: `52..70-*.jpg` en esta carpeta. Leyenda: `[V]` visto en la fuente · `[inf]` inferencia.

**Sin efectos:** créditos usados 0 / 1.7K al empezar y al terminar; sigue habiendo un solo agente (Julia,
sin publicar); Equipos y Etiquetas siguen vacíos. Dos modales se abrieron para leer sus campos y se
cerraron con «Cancelar» (detalle en §6).

---

## 1. Pantallas que antes solo se vieron por el menú

### 1.1 Agentes de voz > Historial (`/agents-studio/call-logs`) - cap. 52 `[V]`

- Título «Registros de llamadas». Filtros rápidos: **Conectadas · Exitosas · Todas**. Buscador.
- Acciones: Descargar, Actualizar, Columnas.
- 15 columnas: Fecha, Agente, Duración, **Créditos**, **Calidad**, Número de origen, Número de destino,
  Nombre de contacto, Estado, Desconexión, **Llamada exitosa**, Dirección de llamada, **Calificaciones**,
  Funciones, Grabación. Las primeras 13 tienen filtro por columna y todas se pueden ordenar.
- Vacío: «No se encontraron registros». Paginación de 20.

### 1.2 Agentes de texto > Inbox (`/agents-studio/inbox`) - cap. 53, 54, 55 `[V]`

- Encabezado «Inbox» con un interruptor **Offline/Online** (disponibilidad del humano; no se tocó) y un
  «+» para conversación nueva (no se tocó).
- Pestañas: **All · My conversations · Unassigned · Sin leer**. Chip activo por defecto: «Abiertas».
- Panel de filtros: **Estado** (Abiertas, Esperando primera respuesta, Cerradas) · Rango de fechas ·
  **Fuente** (Widget, WhatsApp) · **Asignado a** · Agentes (lista «Julia») · Etiquetas ·
  **Anuncio de Meta** («Aún no hay anuncios de Meta»).
- Vacío: «Your inbox is waiting» (mezcla inglés y español). Pie «Inbox by Dapta».
- `[inf]` El filtro «Anuncio de Meta» atribuye cada conversación al anuncio Click-to-WhatsApp que la trajo.

### 1.3 Agentes de texto > Text Logs (`/agents-studio/text-logs`) - cap. 56 `[V]`

- Dos vistas: **Conversaciones** y **Sesiones** (`?view=conversations|sessions`).
- Filtros rápidos: Conectados · Exitosos · Todos. Rango: Período actual, Últimas 24h, 7 días, 30 días,
  Este mes, Mes pasado, Este año, Todo el tiempo, Personalizado.
- Acciones: Columnas, Actualizar, Exportar.
- 14 columnas con filtro: Hora primer mensaje, Mensajes, **Mensajes IA**, **Créditos**, Nombre del agente,
  Número telefónico, Nombre de contacto, Conectada, **Exitosa**, Sesiones (o Sesión), Último mensaje,
  Hora último mensaje, Estado, Canal.

### 1.4 Agentes de texto > Equipos (`/agents-studio/teams`) - cap. 57, 58 `[V]`

- «Gestiona tus equipos de **transferencia** y sus miembros». Vacío: «Crea tu primer equipo de
  transferencia para empezar a recibir **handovers**».
- Modal «Nuevo equipo de transferencia»: Nombre del equipo + Miembros (usuarios del workspace). Botones
  Cancelar / Crear equipo. **Se cerró con Cancelar; no se creó nada.**
- `[inf]` Es el traspaso bot → humano: el equipo recibe la conversación cuando el agente la pasa.

### 1.5 Agentes de texto > Etiquetas (`/agents-studio/tags`) - cap. 59, 60 `[V]`

- «Etiqueta tus contactos y sesiones basándose en los resultados proporcionados por tus agentes».
- Modal «Crear Etiqueta»: Nombre, Color (9), **Instrucciones** en lenguaje natural (ejemplo de la app:
  «Cuando el contacto menciona que quiere cancelar su plan») y alcance: **Contacto** (queda en todas sus
  conversaciones) o **Sesión** (solo esa). **Se cerró con Cancelar; no se creó nada.**
- La IA aplica la etiqueta sola cuando se cumple la instrucción.

### 1.6 Agentes de texto > Plantillas (`/agents-studio/message-templates`) - cap. 61 `[V]`

- «Plantillas de WhatsApp». Sin canal: «Conecta WhatsApp para crear plantillas» y el botón
  «Configurar WhatsApp» (no se tocó). No hay lista ni columnas hasta conectar un número.

### 1.7 Tareas (`/tasks`) `[V]` (ya estaba la cap. 48)

- Solo el estado vacío: «Aún no tienes tareas. Cuando tu equipo te asigne trabajo, aparecerá aquí».
  No hay filtros, columnas ni botón para crear. Se abre desde un ícono arriba a la derecha.

### 1.8 Lista de agentes de texto (`/agents-studio/text-agents`) - cap. 62 `[V]`

- Columnas: Nombre, Mensajes, Contactos, Conectados, **Metas logradas**, **Costo** (US$),
  **Costo / Resultado**, Creado. Filtro «Período: Facturación actual». Carpetas («Nueva carpeta»).
- Julia: 0 mensajes, US$ 0,00, creada el 1-oct-2026.

---

## 2. Borrador «Julia» por dentro (solo mirar)

Id `1142c277-4d36-481e-aa82-7a4f34376b0a`. Ya tenía el sello «Cambios sin publicar» el 1-oct (cap. 17):
no lo causó este recorrido. No se tocaron «Descartar borrador», «Guardar Agente» ni «Publicar».

| Pestaña (ruta) | Qué tiene | Cap. |
|---|---|---|
| Configuración (`/settings`) | Idioma Español, Propósito «Recepcionista», **GPT 5.1 a 40 créditos/mensaje**, temperatura 0,7. Prompt de ~1,7k tokens con las secciones Role, Objective, Conversation Flow (botones «Quiero agendar una cita», «Quiero dejar un mensaje»), Audience, Style, Other Rules, palabras clave por flujo e información a recopilar | 63 |
| Acciones del agente | Una sola acción por defecto: **`end_conversation`**. «Agregar Nueva Acción» **no se tocó**, así que no se vio el catálogo de acciones | 63 |
| Brains | «Conecta bases de conocimiento…», selector vacío | - |
| Etiquetas | «Elige qué etiquetas puede usar la IA para clasificar conversaciones de este agente» | - |
| Comportamiento | Cerrar sin respuesta (24 h por defecto), esperar antes de responder, varios mensajes cortos, indicador «escribiendo…» (solo WhatsApp) | - |
| Seguimientos | «Envía un mensaje de seguimiento después de la conversación». Vacío; «Agregar seguimiento» **no se tocó** | - |
| Webhooks | Disparan un flujo de Flow Studio por evento: **Conversación abierta, Mensaje recibido, Mensaje enviado, Etiqueta asignada, Variable modificada, Mensaje no entregado** | - |
| Análisis de conversación (`/conversation-analysis`) | **Objetivo de la conversación** (texto: cómo se ve una conversación exitosa; la IA evalúa cada una) · **Análisis posterior**: variables a extraer de tipo texto, selector, booleano o número · Flujo de análisis (webhook a Flow Studio) · **Conversiones de Meta Ads**: reporta la conversión a Meta cuando un chat de un anuncio Click-to-WhatsApp cumple el objetivo («Agregar credencial») · **Sincronización de pipeline CRM**: tras cada análisis mueve el contacto a la etapa correcta | 64 |
| Historial (`/logs`) | La misma tabla de Text Logs filtrada a este agente | - |
| Métrica (`/metrics`) | Selector de fechas (por defecto 2-sep → 2-oct). Tarjetas: Créditos usados, Total de contactos, Total de respuestas, Tasa de conexión, Respuestas exitosas, Prom. mensajes/respuesta. Gráficos: Respuestas por día y **Embudo de contacto** | 65 |
| Canales (`/channels`) | WhatsApp («Conectar un número») y Dapta Widget («Ver conexión»). Ninguno se tocó | - |

`[inf]` El circuito que venden: anuncio Click-to-WhatsApp → el agente conversa → la IA decide si la
conversación fue «exitosa» → avisa a Meta (optimiza la pauta) y mueve el contacto en el CRM.

---

## 3. Facturación: ¿se renuevan los créditos del Free? ¿La prueba de Pro pide tarjeta?

### 3.1 Lo que muestra la app hoy (`/billing/main`) - cap. 66 `[V]`

- Plan actual **Free**, Pago «--», Créditos restantes **1.672 / 1.672**, período
  **24-sep-2026 → 24-oct-2026**. El 1-oct la misma pantalla decía **23-sep → 23-oct** (cap. 28).
- «Consumo por workspace»: OnIA, 0 usados, «Sin límite de créditos asignado: este workspace consume del
  pool de la cuenta».
- El ícono de ayuda junto a los créditos tiene el tooltip vacío. Ningún texto de la app dice si el Free
  se renueva.
- Facturas (`/billing/invoices`): columnas Fecha, Factura, Descripción, Estado, Monto, Acciones; vacía.

### 3.2 Lo que dicen los docs (docs.dapta.ai, leídos hoy) `[V]`

- `plans-and-pricing`: «the monthly credit allowance, free web calls and Test Numbers need an active paid
  plan». El Free **no tiene bolsa mensual**.
- `billing-and-invoices`: «The date range shown next to the consumption chart is your billing period.
  Credits renew on the first day of that range» (escrito para planes pagos).
- `cancel-your-subscription`: al terminar un plan pago la cuenta pasa a Free con **2.000 créditos de
  cortesía**.
- `account`: «the free plan needs no card».

### 3.3 Conclusión

- **No hay renovación mensual del Free documentada.** `[inf]` El período de la app se corre un día por día
  (23→23 ayer, 24→24 hoy): es una ventana móvil de 30 días, no un ciclo de facturación. Los 1.672 parecen
  un saldo único de cortesía. Sigue sin explicarse la diferencia con los 2.000 que promete la home.
- **Prueba de Pro:** la app la ofrece en `/billing/plans` como «7 días de prueba · $0 por 7 días · luego
  $99/mes», con los botones «Obtén una prueba de 7 días» y «O comprar ahora». Los docs dicen que **al
  empezar se agrega una tarjeta y que se cobra sola al final del día 7**.
- **El botón de la prueba no se apretó**: es un `<button>` sin enlace a la vista y no hay forma de saber de
  antemano si abre un checkout o si activa la prueba directamente (cambia el plan de la cuenta). La pantalla
  de tarjeta **no se vio en la app**: sigue valiendo lo de los docs.

---

## 4. Academia dentro de la app: casos de uso (`/academy`)

Sección «Casos de Uso», 6 lecciones; **una sola de clínicas**. Datos de YouTube leídos con yt-dlp (solo
metadatos, sin descargar video):

| Lección | Publicada | Duración | Vistas |
|---|---|---|---|
| Cómo crear un agente de voz para Real Estate | 13-mar-2026 | 11:44 | 252 |
| Cómo automatizar la calificación de leads inmobiliarios | 18-feb-2026 | 9:00 | 227 |
| **Cómo las clínicas médicas usan IA para agendar citas 24/7** | **20-ene-2026** | **11:18** | **420** |
| Agentes de IA para una firma de abogados | 13-ene-2026 | 14:47 | 275 |
| Cómo Dapta aumentó un 25% las inscripciones con IA (caso) | 12-ago-2025 | 2:14 | 195 |
| Cómo Ipler transformó su contactabilidad con Dapta (caso) | 12-sep-2025 | 2:13 | 129 |

**La lección de clínicas** (youtube.com/watch?v=_q5wrLzitcY): agente de **voz** para una **clínica estética
de Miami** que atiende la llamada, pregunta el interés, explica el procedimiento, mira el calendario y agenda
con nombre, resumen y horario. Capítulos: problema (líneas ocupadas, fuera de horario) → demo → armar el
agente desde cero (contexto de la clínica, idioma, nombre, prompt generado) → voz y parámetros → integración
de calendario y acciones «disponibilidad» y «agendar cita» → segunda prueba. Cierra con «Prueba Dapta
gratis». No toca texto/WhatsApp, recordatorios, historia clínica ni pacientes que no volvieron.

---

## 5. Biblioteca de anuncios de Meta (página «Dapta», id 181083051744223, todos los países, activos)

- **~31 activos hoy** (ayer 38). Orden por impresiones. Cap. 67.
- Destino real de cada anuncio (decodificado del enlace de salida de Meta; se leyó la página, no se llenó
  nada):

| # | Id | Desde | Texto (resumido) | Botón lleva a | Campaña (utm) |
|---|---|---|---|---|---|
| 1 | 2153681642164688 | 17-sep | «📞 Tus leads no esperan. Tu equipo tampoco debería hacerlo.» Voz IA que responde, califica y agenda fuera de horario; «sesión gratuita de consultoría». Título: «Descubre cómo Dapta te ayuda a crecer» | forms.dapta.ai/jwmq4e/alec/dapta-ventas («Booking META- COL/LATAM») | 19/AGO/2026-LA-BOOKDEMO |
| 2 | 1856547228663462 | 29-sep | Concesionarios: «cada minuto que un lead espera… puede terminar comprando en otro concesionario». Webinar gratis con el CEO, «convertir hasta un 40% más», **6-oct 5 pm (Colombia)**, «cupos limitados». Video | luma.com/cmtyi67c | 29SEPT-2026-COL-WEBINAR-AUTOMOTRIZ |
| 3 | 1581614703010920 | 30-sep | «¿Cuántos leads pierdes a la semana porque nadie los llamó a tiempo?» «Reserva tu sesión y obtén tu primer agente de ventas AI». Título: «La IA que califica y agenda leads por ti». Video | forms.dapta.ai/jwmq4e/f/dapta-ventas («Booking META- COL/LATAM») | 29_SEPT_2026_LA_BOOKDEMO |
| 4 | 2541380963027246 | 30-sep | «Responde y conecta con tus leads las 24 horas con agentes de voz IA… sesión gratuita de consultoría… Agenda un demo hoy!» Video | forms.dapta.ai/jwmq4e/alec/dapta-ventas-4 («Booking META- MEX») | 19/AGO/2026-LA-BOOKDEMO |
| 5 | 1658218019183129 | 1-oct | «¿Tus vendedores realmente contactan todos los leads que llegan?» Webinar gratis, **7-oct 5 pm** | luma.com/jzgz5ez6 | 29SEPT-2026-WEBINAR-MATRICULAS |
| 6 | 1407497044277203 | 1-oct | Mismo texto que el #1, **en español, para EE.UU.** | forms.dapta.ai/jwmq4e/alec/dapta-ventas-us («Booking META- USA») | 02/SEPT/2026-USA-BOOKDEMO-EVERGREEN |

- **Todos los formularios son el mismo** (cap. 68): banda «Obtén 2.000 Créditos Gratis al Agendar» y una
  pregunta: «¿Cuál es el problema más grande que quieres solucionar con IA?» con 4 opciones (leads que nadie
  llama, leads de WhatsApp que se enfrían, soporte lento, ninguna). Cambia solo el país en el título.
- **Ningún anuncio lleva al registro gratis ni al precio.** 16 de los 19 cargados van al demo con humano y 3 a
  webinars. Botones vistos: «Más información» / «Ver detalles».
- Los webinars ahora son **por industria**: «Aprende cómo usar IA para vender hasta un 70% más autos»
  (6-oct, CEO, **136 inscriptos**) y «Aprende a vender con IA un 70% más de matrículas, sin invertir más en
  anuncios» (7-oct, Alejandro Sarmiento, **59 inscriptos**). Ambos por Zoom, 5 pm Bogotá. Prometen «+70%» y
  «120x más velocidad de respuesta».
- **Webinar de Luma pendiente del 1-oct (luma.com/6c2cbtpz):** «Aprende cómo usar IA para vender hasta un
  70% más», **26-ago-2026, 5 pm Bogotá**, 896 inscriptos. Coincide con el banner «webinar del 26-ago».
- La búsqueda por palabra «Dapta» da ~150 resultados de otros anunciantes (coinciden con «adapta»): no
  sirve; se usó la vista por página.

---

## 6. Instagram (perfiles públicos, sesión de Instagram ya abierta en el Chrome; solo lectura)

Fechas sacadas del código de cada publicación (el id de Instagram trae la fecha).

| Cuenta | Tamaño | Ritmo medido | Formato | Qué publica | Cap. |
|---|---|---|---|---|---|
| @dapta.ai | 668 publicaciones, **74 mil** seguidores | **23 publicaciones del 10-sep al 1-oct** (~1 por día) | 16 reels, 7 imágenes o carruseles | Humor de oficina (#officelife), listas («tier list» de formularios, términos CAC/ARR/EBITDA), noticias de IA de la semana, y piezas por industria que venden el agente: **agencias de seguros**, «200 llamadas al día», «Deja de perseguir leads». Reel fijado de mayo-2025 | 69 |
| @nicolasimagine (CEO) | 337 publicaciones, **43,2 mil** seguidores, verificado | **21 publicaciones del 2-sep al 1-oct** (~5 por semana) | 20 reels, 1 imagen | 3 fijadas de prensa (Forbes 30 Under 30). Reels de noticias de IA («Esta semana en IA»), los mismos reels en colaboración con @dapta.ai, y llamado a comentar: «Comenta COLOMBIA y te enviamos el link» (comentario → DM) | 70 |

---

## 7. Lo que no se pudo y por qué

- **Pantalla de tarjeta de la prueba Pro:** no se apretó «Obtén una prueba de 7 días» porque podía activar
  la prueba (cambia el plan de la cuenta). Queda lo que dicen los docs: pide tarjeta y cobra sola al día 7.
- **Catálogo de «Agregar Nueva Acción» y de «Agregar seguimiento» de Julia:** no se tocaron (podían
  agregar algo al borrador).
- **Si el Free se renueva:** ni la app ni los docs lo dicen. Lo único seguro es la ventana móvil.
- **Capturas de Análisis y de Historial de Julia, Text Logs > Sesiones y el formulario de anuncios con
  scroll:** algunas capturas se colgaron porque la pestaña quedaba en segundo plano; el texto se leyó igual.

## 8. Botones que no se tocaron

«Probar agente», «Publicar», «Guardar Agente», «Descartar borrador», «Crear con Dapti», «Conectar un
número», «Ver conexión», «Configurar WhatsApp», «Activar sincronización de pipeline», «Agregar
credencial», «Agregar variable», «Obtén una prueba de 7 días», «O comprar ahora», «Redeem Code», el
interruptor Offline/Online del Inbox, «Seguir» y «Enviar mensaje» en Instagram. No se escribió nada en
ningún formulario.
