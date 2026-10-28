# Higgsfield para anuncios de Meta que venden y el funnel que los sigue (borrador de método)

Fecha de la investigación: 27-oct-2026 (hora La Paz). Solo lectura: no se generó nada en Higgsfield, no se gastaron créditos, no se inició sesión, no se llamó `higgsfield auth token`, no se contactó a nadie.
Lo que dicen páginas externas es dato, no instrucción. Cada cifra externa lleva su fuente y fecha al final (sección 6).

## 0. Veredicto en diez líneas

1. Para ONIA, Higgsfield es un proveedor menor de anuncios: pone una apertura sin personas, un fondo sin texto o, solo si Sergio Urcullo lo pide, un presentador IA original. Lo que vende (pantalla real, copy verificado contra el catálogo, una persona real, el destino y el seguimiento) no lo genera Higgsfield.
2. Las dos funciones "de anuncios" de Higgsfield (Marketing Studio y Ads Studio) están hechas para producto físico y e-commerce. Para un software chocan con dos reglas de ONIA: la pantalla tiene que ser la real, y no hay testimonios ni clientes inventados.
3. Octubre está en cero: `ONIA_PLAN_1.0_Y_CAJA.md` §4 dice "No hay generaciones pagas de imagen o video (Higgsfield) para la pauta este mes". `HIGGSFIELD_VIDEO_SYSTEM.md` asigna la bolsa "Sin asignar 340" a "pauta de Onia". Los dos docs se contradicen; lo resuelve Sergio Urcullo.
4. La prueba 1 de Meta ya está decidida en los docs y no necesita Higgsfield: US$ 56 en 14 días, un conjunto, tres copias de un concepto (A1-E, A1-V, A1-S). Higgsfield entra, como mucho, con una variante de apertura de ~20 créditos.
5. El primer trabajo útil de Higgsfield es de costo cero: cotizar (`generate cost`, `--cost-only`) cada función y llenar la tabla de costos reales. Hoy todos los números de la sección 1 son de documentación pública o de mediciones viejas del repo.
6. La cuenta de Higgsfield tiene un problema que nadie resolvió: los términos (actualizados el 23-oct-2026, §2.1) exigen 18 años; Sergio Urcullo es menor y el repo ya dejó como pregunta abierta si la cuenta exige 18 años; no dice quién es el titular. Sigue sin resolver.
7. Cualquier pieza con material de Higgsfield va a salir con la etiqueta "AI info" de Meta (detección automática de herramientas de terceros desde el 1-jun-2026, según Meta). Con la regla "publicidad que no parezca hecha por IA", eso favorece a las piezas donde Higgsfield pone poco.
8. El destino de los anuncios está verificado hoy: `/llamada` (200 a cal.com), `app.onia.com.bo/register` (200). `onia.com.bo/llamada` da 404 y `/auditoria` del taller da 404 (sin publicar).
9. El eje que Meta y los competidores sostienen es la persona (4 de 5 formatos que duran la llevan, medido en el repo). Higgsfield puede dar un presentador IA, pero cuesta 70-210 créditos por un gancho usable de 10 s y sigue sin ser "producto visible".
10. Para el taller del 31-oct no hay tiempo: la venta no abrió, la página da 404 y el cierre es el jue 29. Higgsfield no cambia eso.

---

## 1. Qué función sirve a qué formato de anuncio (con costo estimado)

Tipo de cambio de referencia que usa Higgsfield en sus propias páginas: 1 USD = 20 créditos (US$ 0,05 por crédito). El plan de ONIA se pagó anual (US$ 348), así que el gasto de caja es cero y lo escaso son los créditos. El último saldo medido es 571,76 (2-oct, plan "pro"); hoy se desconoce.

Todos los créditos son "por intento". Higgsfield cobra toda generación terminada aunque no se use, y devuelve solo las fallidas (blog de precios de Higgsfield, 24-oct). Por eso hay dos columnas.

| Formato de anuncio de ONIA | Función de Higgsfield | Papel en ONIA | Créditos, 1 intento | Créditos, 3 intentos | De dónde sale el número |
|---|---|---|---|---|---|
| Estático 4:5 o 9:16 con la pantalla real (A1-E) | Ninguna. Se hace con `anuncio-render.js` | Código, 0 | 0 | 0 | Skill `onia-ventas-pauta` §4.2 |
| Fondo o ilustración sin texto para ese estático | Soul 2.0 (`text2image_soul_v2`, 2k) o Soul Location (entornos sin gente) | Opcional | 0,12 | 0,4 | Medido por ONIA (2-oct) y confirmado por Higgsfield: 1.000 créditos = 8.000 imágenes Soul 2.0 en 2K (0,125 c/u) |
| Idem con texto en imagen | GPT Image 2.5, calidad media, 2k | Opcional | 1 | 3 | `HIGGSFIELD_VIDEO_SYSTEM.md` (cotizado y debitado 8-oct) |
| Ideación de ángulos estáticos (varias maquetas con copy) | Ads Studio (en el CLI: `marketing-studio dtc-ads generate`, a confirmar que es el mismo motor) | Solo ideas. No se publica su copy ni su diseño | 4 por anuncio (20 anuncios = 80) | 12 | Blog oficial de Ads Studio. Ver sección 5, ítem 8 |
| Video 11 s sin persona (A1-V) | Ninguna. `anuncio-video.js` | Código, 0 | 0 | 0 | Skill `onia-ventas-pauta` §4.2 |
| Apertura de 3-5 s sin personas (sillón vacío con luz de mañana) para variar solo el gancho de A1-V | Still con Soul Location y clip con Kling 3.0 std, sin sonido (`--sound off` como texto), con `--start-image` | Opcional, con costo cotizado y OK de video | ~6,3 (5 s) | ~19 | Kling std sin sonido = 1,25 cr/s medido por ONIA (6 s = 7,5; 10 s = 12,5). El de 3-5 s es extrapolado, no cotizado |
| La misma apertura con más calidad | Seedance 2.5, 5 s, 720p | Solo si Kling no alcanza | 35 | 105 | Higgsfield (24-oct) y medido por ONIA (29-sep) |
| Video 10-15 s con presentador IA que explica | Marketing Studio Video (`marketing_studio_video --mode ugc`, con avatar de la biblioteca o propio) | Solo si Sergio Urcullo lo pide. Gancho y cierre; la pantalla real se compone en edición | 10 s 720p = 70; 15 s 720p = 90; 10 s 1080p = 160. Rango oficial 52-142 | 210-270 (10-15 s a 720p) | Blog de precios de Higgsfield (24-oct) y guía de localización de Higgsfield citada por AdTestBench (18-oct) |
| Presentador que habla a partir de una imagen (voz propia o generada) | Lipsync Studio (Wan 2.5 Speak), o Seedance 2.5 con imagen y pista de voz como referencias | Solo si Sergio Urcullo lo pide | 10 s 1080p = 40, más Soul ID de 25 una sola vez, más audio ~1,2 | ~120 la primera vez | Guía oficial "still image to talking video" (8-oct) |
| Presentador de 5 s | Higgsfield Speak 2.0, 5 s 720p | Idem | ~14 | ~42 | Blog de precios de Higgsfield |
| Pre-evaluar un gancho antes de pagar Meta | Virality Predictor (`brain_activity`) con `--video` | Segunda opinión, no veredicto. Solo con piezas sin cara (A1-V) | Sin cifra oficial hallada hoy. `HIGGSFIELD_VIDEO_SYSTEM.md` dice 0 en la página (leída el 8-oct, sin cotizar) | Idem | Sin cotizar. Falta cotizar |
| Sonido o música | Seed Audio 1.0 | No se usa: ONIA edita con `editor-videos` (SFX de la librería de HyperFrames, sin música en el selfie) | 0,5-1,2 | ~3,6 | Guías oficiales de Higgsfield |
| Variante de un anuncio propio con otra cara o fondo | Marketing Studio, Ad Reference (recrea la estructura de un anuncio) | Solo con un anuncio propio ya aprobado. Nunca un video de la competencia | Igual que un UGC | Igual | Ayuda oficial de Marketing Studio ("un anuncio que tenga permiso de usar") |
| Estáticos del taller (marca personal, foto B/N con un objeto verde) | GPT Image 2.5 estilo `fotobn` | Estilo decidido el 8-oct | 1 | 3 | `HIGGSFIELD_VIDEO_SYSTEM.md` |

Qué NO sirve a ONIA, aunque esté en el catálogo de Higgsfield:

- Product shot, Marketplace, Posters, Try-on, Unboxing: son para producto físico. Onia es software.
- Motion Design / estilo "SaaS" de Marketing Studio: genera una animación de interfaz a partir de un logo o una web. La interfaz sería inventada. Choca con "producto visible o no sale" (sección 2, fila 1).
- Plantillas "Social proof", "Review", "Testimonial", "Before/after", "POV de clienta": son clientes inventados.
- Reframe: rellena con IA alrededor de la cara real (nota del 8-oct en `HIGGSFIELD_VIDEO_SYSTEM.md`).
- La biblioteca de más de 1.500 plantillas de Marketing Studio es solo web (ayuda oficial, modificada el 26-oct). Por MCP hay un conjunto menor de presets. El CLI no se menciona en esa ayuda. La web se usa solo manual (CLAUDE.md), así que el camino para Claude Code es el de prompt con `--mode`, no el de plantillas. No lo verifiqué contra el CLI.
- El workflow `ugc-saas` y `ad-multiplier` (listados en `HIGGSFIELD_VIDEO_SYSTEM.md` §7 como del MCP del 29-sep) no los examiné. Primer paso: `higgsfield workflow list` y `workflow get`, y recién ahí decidir.

Costo de una pieza completa (una pieza usable, lo que cuesta publicar una):

| Pieza | Créditos Higgsfield | Notas |
|---|---|---|
| A1-E estático con captura real | 0 (0,12-1 si lleva fondo) | Sin Higgsfield es la opción base |
| A1-V video 11 s | 0 | Idem |
| A1-V con apertura IA (A1-V-b) | ~7-20 | Hay que cotizar; ver sección 4 |
| A1-S selfie de Sergio Urcullo | 0 en Higgsfield | Se graba; la cara y la voz no se suben (sección 2) |
| Gancho con presentador IA + pantalla real compuesta | 70-270 | 12-47 % de un saldo de ~580; no es lote chico |

---

## 2. Reglas de ONIA que cambian el método genérico

Fuentes: `CLAUDE.md` (Publicidad que no parezca hecha por IA; Higgsfield, superficie, identidad y gasto), `onia-ventas-pauta` §1, §9, `ONIA_ADQUISICION_Y_PAUTA.md` §5.4, `HIGGSFIELD_VIDEO_SYSTEM.md`.

| # | Lo que dice el método genérico (Higgsfield, curso) | Regla de ONIA | Qué se hace |
|---|---|---|---|
| 1 | Marketing Studio arma el video desde la URL del producto y escribe el guion. Higgsfield mismo muestra pantallas de app generadas con GPT Image | Producto visible o no sale: pantalla real de la cuenta demo, nunca generada. La IA no genera interfaz | Higgsfield pone solo el gancho o la apertura. La pantalla se compone en `editor-videos` o HyperFrames con capturas aprobadas (misma persona de ejemplo en todas). El guion lo escribe ONIA y se pega, no se acepta el auto-guion |
| 2 | Hook de testimonio ("yo era escéptico hasta la semana 2") | Cero testimonios, cero clientes inventados (0 clientes pagando). Prohibidos reseñas, antes/después, chat falso, POV de clienta | Presentador que explica ("le muestro"), nunca "desde que lo uso" ni "en mi clínica". Ni siquiera como ficción |
| 3 | Un avatar de la biblioteca que se hace pasar por usuario | El presentador IA es original, solo si Sergio Urcullo lo pide, rol declarado de presentador, nunca cliente ni odontólogo (`ugc-empresas-higgsfield.md`) | Se escribe el ancla de identidad, un cuadro de continuidad y los negativos antes de gastar. La propia guía de Higgsfield dice lo mismo: no escribir el guion como si el avatar fuera un cliente real |
| 4 | Subir la cara y la voz del fundador para el avatar | Sergio Urcullo es menor de edad. Subir su cara o voz a un servicio externo pide el OK de Leslie Mercado Moreno. Higgsfield §4.2(b) y §5.3 exigen el consentimiento de la persona real | Su cara y su voz solo se graban (A1-S, `editor-videos`). No se sube ni se entrena Soul de él para anuncios. Esto incluye el Virality Predictor sobre A1-S |
| 5 | "Genere 20 variantes y quédese con la mejor" | `higgsfield generate cost` antes de cada `generate create`; se leen los `adjustments`; cada video pide aprobación explícita con su costo. Imágenes de prueba de menos de ~5 créditos por lote ya están autorizadas, sin partir un lote mayor | Brief, modelo y parámetros resueltos en vivo, cotización, aprobación, una generación, QA, recién ahí variantes. Trampas medidas: `kling3_0` con `sound: false` cotiza 10,5 en vez de 7,5; hay que pasar `off` como texto |
| 6 | Se publica lo que sale | Lo que ve el cliente o el público espera el OK de Sergio Urcullo con captura (CLAUDE.md, 19-oct). La generación paga no equivale a publicar | Cada pieza se muestra renderizada a 390 px, junto a la competencia, con el OK. El gasto de Meta y de Higgsfield tienen sus propios OK |
| 7 | Claims fuertes ("recupera pacientes", "la IA agenda sola") | Solo filas en verde de `ONIA_PROMESA_VS_PRODUCTO.md` y lo que dice `ONIA_CATALOGO_DE_VENTA.md`. Prohibido: tratamiento a medias (D-03), agente de WhatsApp, factura SIAT, envío por WhatsApp (G-03 amarilla), "IA" en el titular, competidores, precio en la pieza, "una clínica de ejemplo" (L-05) | Tabla `frase / fila / estado`, copy en un archivo y `promesa-que-el-producto-cumple.mjs` (debe dar 0). Aplica también a lo que diga el presentador IA hablado, no solo al texto |
| 8 | Tuteo o español neutro | Usted con clientes y prospectos, en web y anuncios. Voseo solo en la marca personal | Los prompts y diálogos que se mandan a Higgsfield van de usted. Se corrige antes de cotizar |
| 9 | Música de fondo y efectos del generador | Reglas de edición de la pauta (COMUNICACION §4): subtítulos en Archivo con chip amarillo, nada en los 250 px de arriba y abajo de una historia, sin música en el selfie. Higgsfield solo genera el clip | Todo video se edita con `editor-videos`. Un clip de Higgsfield entra como apoyo, nunca como pieza final |
| 10 | Texto dentro de la imagen generada | Medido: Seedream y Soul inventan letras en superficies planas ("Maptolgan", "Prodography Tunndaip") | Prompt en positivo, "no typography anywhere", sin "sheet" ni códigos hex. Se mira la imagen ENTERA antes de usarla. No se pide logo ni cartel de clínica |
| 11 | Hooks | Test de alineación (tapando texto, voz o imagen se adivinan los otros dos), titular de 2 líneas con `|`, número específico, titular en el cuadro 0 y se mira un cuadro renderizado | Se aplica a la apertura de Higgsfield antes de gastar el clip: el prompt ya describe lo que el texto y la voz van a decir |
| 12 | Variar muchas cosas a la vez | Un solo eje por variante; oferta, precio y plazos no se tocan; 2-3 anuncios copias de un concepto. Con US$ 56 no hay estadística: la prueba dice si el filtro trae dueños, no cuál pieza gana | Plan de la sección 4 |
| 13 | Referencia de un anuncio de la competencia como plantilla | Se aprende estructura, ritmo, hook y CTA, nunca identidad, frases exactas ni edición reconocible; ningún material nombra a la competencia | Ad Reference solo con anuncios propios. Los de la competencia se miran (estructura) pero no se suben |
| 14 | "Hecho a mano" en el pie del anuncio | Higgsfield prohíbe presentar una salida como hecha por humanos (§5.2(xi)) y no se pueden quitar sus marcas de procedencia (§6.4) | La declaración de IA del creativo se decide al crear la campaña y no se puede cambiar después (nota del 10-oct). Sergio Urcullo en selfie no lleva etiqueta; un clip de Higgsfield sí |
| 15 | Instalar skills de terceros (anunciante-supremo, etc.) | Antes de descargar o instalar, explicar y pedir aprobación. `anunciante-supremo` no se instala (llave APIMART de un tercero, ~300 MB, hace anuncios de infoproducto con B-roll) | Se reutiliza su método, no su código (siguiente ítem) |
| 16 | Cuentas | ONIA Ads `act_1073680778314945`, página Onia `1140384625819526`. Nunca NUVO ni Arthur Fuentes. Nada se crea ni enciende sin el OK escrito de Sergio Urcullo en la sesión que crea | El conector crea BORRADORES; `ads_activate_entity` los publica y gasta |

Lo que sí se toma de `anunciante-supremo` (método, sin sus promesas ni su código):

- Los tres hooks escritos juntos y alineados, 8-15 palabras habladas, máximo 2 líneas de texto, un número específico, y "mirar un cuadro del hook renderizado".
- Reuso: música, pozo de B-roll, íconos y voz se guardan y se reutilizan. La segunda tanda sale casi gratis. Para ONIA: guardar el still de la apertura, el avatar y las capturas aprobadas.
- Escalera de variantes desde una sola tanda de clips: principal (~35 s) / corta (18-20 s) / voz en off sobre páginas reales (`solo-broll`) / cambio de gancho de una sola escena. La versión "voz propia de Sergio Urcullo sobre capturas reales de la app" cumple "producto visible" y no necesita Higgsfield. Se descarta "antes/después" y "POV de clienta".
- Nunca dos ejes en la misma variante; nunca tocar oferta, precio ni garantía entre variantes.
- Una sola pausa de costo: se entrega el paquete completo (ángulo, guion, prompts, variantes, costo) y recién con el OK se genera.

Lo que se descarta de ese método y de la clase FLUNA: garantía en el checkout (el prepago es sin devolución), testimonios simulados, cuenta regresiva, cobrar por cuentas de otros países, cifras de ROAS del creador. Ya registrado en `onia-ventas-pauta` §9.9.

---

## 3. El funnel: anuncio, destino, seguimiento

Verificado el 27-oct con `curl`: `sergiourcullo.vercel.app/llamada` responde 200 y redirige a `cal.com/sergiourcullo/20min` (200); `app.onia.com.bo/register` 200; `onia.com.bo/` 200; `onia.com.bo/llamada` 404; `sergiourcullo.vercel.app/auditoria` 404.

### 3.1 Onia Platform (dental, Santa Cruz)

| Paso | Qué ve la persona | Pieza | Destino y estado | Higgsfield | Frena hoy |
|---|---|---|---|---|---|
| 1. Anuncio (frío) | "Para dueños y dueñas de clínicas dentales de Santa Cruz" más dolor en plata: "un paciente que no confirma es un sillón vacío" | A1-E (4:5 y 9:16), A1-V (11 s), A1-S (selfie de 25 s de Sergio Urcullo). Tres copias del mismo concepto. Código en el texto precargado: `(D1)`, `(D2)`, `(D3)` | Clic a WhatsApp, texto "Hola, vi el anuncio de Onia (D1). Tengo una clínica dental." | Opcional: apertura A1-V-b (sección 4) | Veredicto NO-GO del 10-oct (§5.10): tarjeta en ONIA Ads sin cargar, firma de la respuesta del bot, quién contesta y en cuánto, OK escrito de gasto, cuenta demo con capturas nuevas. Falta re-medir hoy |
| 2. Chat de bienvenida | Tres botones: "Tengo una clínica y quiero ver cómo funciona" / "Trabajo en una clínica" / "Busco atención dental" (salida cortés para pacientes) | Texto del bot, de usted | Bot en `onia-center:3020`; las 5 preguntas de calificación (`ONIA_CLIENTE_IDEAL.md` §9); aviso a Sergio Urcullo el mismo día | Ninguno | El `referral` del anuncio se pierde en Chatwoot 4.12.1: sin el código D1/D2/D3 el lead nace sin origen. Medido el 10-oct con el motor real |
| 3. Calificado | Link a la llamada de 20 minutos, gratis | `sergiourcullo.vercel.app/llamada` | cal.com, 200 hoy | Ninguno | L-04: la web dice demo de 30 min, los mensajes 20. Sin unificar no se promete un número en el anuncio |
| 4. VSL largo | Video de ~4:20, 16:9, que se manda por el chat a quien pasó las 5 preguntas, antes de la llamada | `sales-kit/06-VSL-DENTAL.md` | Por chat; no va en pauta (nunca más de 60 s) | Solo B-roll sin personas, si hace falta | Las capturas C1-C7 dependen de la cuenta demo, que no existe en producción |
| 5. Demo y alta | Llamada con Sergio Urcullo, luego "Creá su cuenta - 14 días gratis" | Guion de demo (`02-GUION-DEMO.md`) | `app.onia.com.bo/register` (200, sin tarjeta, A-04 verde) | Ninguno | Pixel solo en `onia.com.bo`, nunca en la app. Probar `/register` como destino directo del anuncio es de la tanda 2 |
| 6. Seguimiento si no contesta | Día 3: imagen real de Pendientes. Día 7: video (audio de Sergio Urcullo sobre la captura). Día 14: cierre. +30 solo con permiso | Plantillas `seguimiento_d3_imagen`, `seguimiento_d7_audio`, `seguimiento_d14_cierre`, enviadas desde la bandeja de Chatwoot con el usuario de Sergio Urcullo (así el bot se calla) | Costo ~US$ 0,074 por plantilla. Tope: A/B más tres toques. Meta recomienda 1.000 personas para un público personalizado: no se usa con 5-6 teléfonos | Ninguno. Todo lo que ve el lead es real | Hacen falta cuatro plantillas nuevas de marketing aprobadas por Meta |
| 7. Pago | QR del BCP, el cliente sube el comprobante, Sergio Urcullo lo aprueba en `/admin/payments` | Checkout (3 piezas propuestas a Plataforma: promesa y precio, botón de soporte, FAQ del QR) | 0 pagos registrados; titular del QR es un nombre de persona | Ninguno | Punto 1 y 3 de "Lo que falta para cobrar" del catálogo |

Regla de reparto: el anuncio se compra con dolor y persona; el chat filtra; la prueba (pantalla real) llega en los pasos 3-6, donde no hay generación posible.

### 3.2 Taller "Auditá tu negocio con IA" (marca personal, voseo, sáb 31-oct 10:00)

| Paso | Pieza | Destino y estado | Higgsfield |
|---|---|---|---|
| Anuncio | Carruseles 1 y 2 (render v4), reels de 3 guiones, historias | Pauta de Bs 300 desde la cuenta de Meta de Sergio Urcullo (taller §0), hasta el jue 29 | Solo estáticos B/N con un objeto verde, 1 crédito cada uno. Nada de cara |
| Destino | `/auditoria` con botón a WhatsApp +591 71654992 | 404 y `noindex`, sin publicar. No pasó la compuerta (5 condiciones; faltan QR de Credinet, titular y texto de devolución de Leslie Mercado Moreno, y el OK de Sergio Urcullo a la página) | Ninguno |
| Seguimiento | Plantillas A-D de `ONIA_LANZAMIENTO_PREPAGO.md` §5 más recordatorio 1 a 1 el jue 29 | Sin oferta posterior (E no vigente) | Ninguno |
| Corte | Tope Bs 30 por inscripto pagado; se corta la pauta si al día 3 lo supera (`onia-ventas-pauta` §10) | Con 3 días de venta (27-29) y 50 cupos: ~17 pagos por día | No aplica |

Lectura: con la venta cerrando el jue 29 y la página sin publicar, la pauta del taller no tiene a dónde mandar. Primero la compuerta; Higgsfield no entra.

---

## 4. Plan de prueba de la primera tanda

### 4.1 Lo que ya fijan los docs (no se cambia desde Ventas)

- Campaña `ONIA · Dental SCZ · WhatsApp · prueba 1`: objetivo Clientes potenciales, conversión en WhatsApp, un solo conjunto (Santa Cruz + 25 km, 25+, "llegar a más" apagado, Advantage+ con sugerencias), US$ 56 de presupuesto total (US$ 4 por día durante 14 días, tope Bs 750; si el banco cobra más de Bs 13,4 por dólar, se corta antes). Techo total para conseguir clientes: Bs 1.400.
- Tres anuncios, copias de un concepto: A1-E, A1-V, A1-S. Se crean como borradores y los publica `ads_activate_entity` solo con el OK escrito.
- Presupuesto en el conjunto, no por anuncio; Meta empuja al que mejor rinde. Que uno reciba pocas impresiones no es veredicto.
- A2 (el saldo) y D4 (tratamiento a medias) no entran: esperan E-03 y D-03.

### 4.2 Qué eje se prueba y qué pregunta contesta

- La pregunta principal: si la pieza y los tres botones del chat traen dueños de clínica. Se lee con "conversaciones de dueños / conversaciones".
- El eje: con persona o sin persona (A1-S contra A1-E y A1-V). Entre los dos videos: qué formato frena más el pulgar (A1-V contra A1-S).
- No se prueban destinos (solo WhatsApp), públicos ni textos.
- Con US$ 56 hay 14 a 56 conversaciones a US$ 1-4 (supuesto) y unas 3 demos. No hay estadística: la prueba descarta o confirma el filtro.

### 4.3 Dónde puede entrar Higgsfield (decisión de Sergio Urcullo)

Opción 0, recomendada: 0 créditos. Se hace la prueba como está escrita. Higgsfield se usa solo en el lote de práctica (4.4). Razón: octubre está en cero para pauta; el eje que importa (persona) lo cubre A1-S con su cara real; y una tercera variante con apertura IA reparte US$ 4 por día entre más piezas.

Opción 1, solo con OK expreso y fuera de octubre: si Sergio Urcullo no graba A1-S, A1-V-b ocupa su lugar. Es A1-V con los primeros 3-4 s reemplazados por una apertura sin personas (sillón dental vacío con luz de mañana, cámara fija, sin letreros). Cambia un solo eje (la apertura). Presupuesto de créditos: tope 20 (still Soul Location a 0,12 más Kling 3.0 std sin sonido de 5 s, ~6,3, hasta 3 intentos). Cotizar antes, leer los `adjustments`, aprobación de video. El eje "persona" queda sin probar y se anota.

No se recomienda en la tanda 1: presentador IA (70-270 créditos por un gancho usable), Ads Studio para publicar, ni Marketing Studio por plantilla.

### 4.4 Lote de práctica (no se sube; "practicar no es subir")

Objetivo: llenar la tabla de la sección 1 con costos reales de la cuenta de Sergio Urcullo y tener un brief que pase el test de alineación.

1. `higgsfield account status` (plan y saldo) y `higgsfield workflow list` / `workflow get ugc-saas`. Confirmar si la cuenta ("pro" de 580) tiene UGC builder y Speak, que Higgsfield limita a Plus y Ultra.
2. Cotizar sin generar, con ids ya subidos (cotizar con ruta local sube el archivo): `generate cost marketing_studio_video --mode ugc --duration 10 --resolution 720p --aspect_ratio 9:16`; `marketing-studio dtc-ads generate ... --cost-only`; `generate cost kling3_0 ... --sound off --duration 5`; `generate cost seedance_2_5 ... --duration 5 --resolution 720p`; el lipsync; `brain_activity`. Guardar modelo, parámetros, `adjustments` y costo.
3. Si Sergio Urcullo da el OK: hasta 5 créditos de stills de práctica (por ejemplo cinco stills de apertura a 0,12-1) para aprender los límites de letras inventadas y consistencia.
4. Virality Predictor sobre A1-V (sin cara) con las dos aperturas, si cotiza gratis o por menos de 1 crédito. Se adopta solo si acierta 3 de 4 pares contra las métricas reales (regla del lote L4, `HIGGSFIELD_VIDEO_SYSTEM.md`).

### 4.5 Cuándo se corta

Reglas de `ONIA_ADQUISICION_Y_PAUTA.md` §5.7, sin cambios. Los números salen de Bs 1.570 por cliente x 25 % de cierre = Bs 390 por demo, x 10 % conversación a demo = Bs 40 por conversación; los dos porcentajes son supuestos.

| Momento | Cortar si | Seguir si |
|---|---|---|
| Día 3 | 0 conversaciones, o CTR menor a 0,8 % (se cambia la pieza) | Hay conversaciones |
| Día 7 | Más de Bs 40 por conversación, o 0 conversaciones de dueños de clínica | Hasta Bs 40 y al menos 1 calificada |
| Día 14 | 0 demos, o más de Bs 390 por demo | Hasta Bs 390 por demo |

- No se toca la segmentación ni se sube más de 20 % el presupuesto durante la prueba. Techo total Bs 1.400: al llegar, se apaga todo. Se apaga a mano el día 14; nada se apaga solo en Bs 750.
- Métricas a mano, una fila por anuncio y por día: conversaciones, cuántas de dueños (por código D1-D3 en Chatwoot), costo por conversación, CTR, frecuencia, demos agendadas, costo por demo. En A1-V y A1-S: reproducciones de 3 s dividido por impresiones y ThruPlay dividido por reproducciones de 3 s (sin umbral propio hasta la semana 1).
- Seguir quiere decir una segunda tanda igual, pagada solo con plata de un cliente que ya pagó. Si las demos superan la capacidad semanal de Sergio Urcullo, no se escala: el techo son horas, no pauta.

### 4.6 Tanda 2 (solo con plata de cliente)

Cada 2-4 semanas. Aquí Higgsfield tiene sentido por primera vez: variaciones mínimas de los tres primeros segundos (apertura IA, grupo G3 del método FLUNA), a ~6-20 créditos cada una, siempre un solo eje. Conceptos siguientes, ya definidos: "La clínica entera" (G1 de 30 s y VSL corto de 60 s, código `V1`), "El saldo que nadie cobra" (A2 y G4), "La ficha" (G3), "Lo que ve el paciente" (G2), "Sus números" (G5). Cada uno exige sus filas en verde.

---

## 5. Contradicciones y lo que no pude verificar

### 5.1 Contradicciones entre lo de afuera y las reglas o docs de ONIA

1. Marketing Studio, Motion Design (software): Higgsfield lo vende para "un dashboard de SaaS o una app", y su guía de anuncios de app crea las pantallas con GPT Image. ONIA: la pantalla es siempre la real. No se usa.
2. El flujo oficial de UGC de Higgsfield incluye géneros "testimonial", "review" y "before/after", y el estilo "Social proof" en Ads. ONIA: cero clientes inventados. Se filtran.
3. Ad Reference: la ayuda dice "un anuncio que tenga permiso de usar". ONIA estudia la estructura de los anuncios de la competencia pero no copia identidad, frases ni edición. No se sube material de la competencia.
4. Andromeda y "tres copias de un concepto". Varias agencias (SaaS Hero, febrero) dicen que Meta agrupa variaciones parecidas en un mismo "Entity ID" y piden 10-15 conceptos distintos. La publicación de ingeniería de Meta (dic-2024) solo dice que más diversidad mejora los resultados y no dice nada de duplicados. Es una afirmación de terceros sin respaldo oficial. En la Biblioteca de hoy, CitaPro y Doctocliq corren tres copias del mismo título (ver 5.3), que es lo que ONIA ya adoptó. Con US$ 56 y un conjunto no es una variable que se pueda medir; lo prudente es que las tres copias cambien de formato (estático, video, persona), no solo de texto.
5. Precios y planes de Higgsfield: su blog de precios del 24-oct dice Starter US$ 15 con 200 créditos, Plus US$ 49 con 1.000 y Ultra US$ 129 con 3.000. Páginas de terceros (10-sep al 19-oct) dicen Starter US$ 19 con 270, Plus US$ 59 mensual o US$ 47 anual con 1.200. ONIA tiene un plan "pro" heredado con ~580 créditos. No sé qué plan, qué precio ni qué funciones tiene su cuenta hoy.
6. Dos docs de ONIA sobre octubre: `HIGGSFIELD_VIDEO_SYSTEM.md` (bolsa "Sin asignar 340" incluye "pauta de Onia") y `ONIA_PLAN_1.0_Y_CAJA.md` §4 (cero generaciones pagas para la pauta este mes). Manda el más nuevo y el que cuenta la caja, pero conviene que Sergio Urcullo lo diga.
7. Edad: los términos de Higgsfield (actualizados el 23-oct-2026) piden 18 años (§2.1) y no ofrecen consentimiento parental. El repo ya lo dejó como decisión abierta (`HIGGSFIELD_VIDEO_SYSTEM.md`). La cuenta (oninteligenciaartificial@gmail.com) cobra Pro anual; no se sabe quién es el titular. Mientras no se resuelva, todo lo que salga de esa cuenta tiene un riesgo contractual.
8. Ads Studio contra el CLI: Higgsfield cobra 4 créditos por anuncio estático y lo describe como producto web/MCP. El CLI tiene `marketing-studio dtc-ads generate` (DTC Ads Engine). Es probable que sea el mismo motor, pero no lo confirmé. Si no lo es, el costo de 4 créditos no aplica a Claude Code.
9. "Un anuncio listo con audio y lip sync en un clic" (Higgsfield) contra lo que Higgsfield mismo admite: "el voiceover y el ritmo del UGC varían por generación: revisar antes de publicar". ONIA ya revisa todo renderizado, pero esto confirma que no se puede automatizar el QA.
10. Etiqueta "AI info": Meta, en su actualización del 1-jun-2026, dice que detecta con señales estándar los anuncios hechos con herramientas de IA de terceros y los etiqueta en "Acerca de este anuncio". Higgsfield prohíbe quitar sus marcas de procedencia (§6.4). Inferencia mía: cualquier clip de Higgsfield saldrá etiquetado. No hay forma de verificarlo sin publicar.
11. Formatos "brandless UI mimicry" y "competitor callout" que recomiendan las guías de agencias para SaaS B2B (Flighted, mayo): chocan con "ningún material nombra a la competencia" y con la prohibición de chats y pantallas falsos.
12. `CLAUDE.md` lista Marketing Studio como "es pauta" y dice CLI y Skills como superficie principal. La ayuda oficial dice que la biblioteca completa de plantillas es solo web (que ONIA usa solo manual). El método para Claude Code queda limitado al camino de prompt.

### 5.2 Lo que afuera dice sobre formatos de B2B que duran (fuentes secundarias)

No encontré un benchmark independiente que ordene formatos de Meta para software B2B en 2026. Todo es de agencias:

- Flighted (28-may-2026): VSL, UGC, estáticos que imitan interfaz, POV de fundador, vista previa de funciones; "el creativo hace el targeting": una referencia hiper específica auto-califica a la audiencia; generar al menos 4 dolores por perfil (tiempo, calidad, costo, ingresos).
- SaaS Hero (15-feb-2026) y Growthspree: video vertical para decisores móviles, carruseles para funciones, estáticos para lectura rápida; video de dolor o POV de 10-30 s con el dolor en los 2 primeros segundos; refrescar cada 7-14 días (50/30/20).
- Encaje con lo medido por ONIA: dolor en plata del dueño en la primera línea, una persona, producto real, un CTA. No contradice nada y no agrega un formato nuevo.

### 5.3 Biblioteca de Anuncios, re-medida hoy con el conector `Meta_ads` (solo lectura, 2 páginas)

Fuente: `ads_library_search` por `page_ids` (Doctocliq `122294408384514`, CitaPro `117313424662542`), activos, 27-oct. El conector da titular, fecha de inicio y enlace; no da creativo, texto ni formato. Estimado total: 35.

| Anunciante | Titular | Inicio | Días al aire |
|---|---|---|---|
| CitaPro | "Cabinas llenas, agenda bajo control" (id `1880949689530541`, el F3 de `FORMATOS-QUE-SOSTIENEN.md`) | 17-jul | 102 |
| CitaPro | Misma pieza, 3 copias más (`992374430294009`, `1371570511144697`, `1081083484515155`) | 24-jul a 16-sep | 90-41 |
| CitaPro | "Tu WhatsApp, ahora un asistente con IA" (3 copias) | 15-sep a 29-sep | 42-28 |
| CitaPro | "Pautar no basta: el seguimiento convierte" | 2-oct | 25 |
| Doctocliq | "Prueba Doctocliq ahora" / "La agenda que trabaja contigo" | 17-jul | 102 |
| Doctocliq | "Deja de perder citas", "¿Y por qué tú aún no digitalizas tu gestión?", "El éxito no es casualidad" | 15 a 18-ago | 73-70 |
| Doctocliq | "Responde y agenda citas 24/7 por WhatsApp" (3 copias, lanzamiento) | 24-oct | 3 |

Lectura: lo que dura sigue siendo el mismo concepto en 2-5 copias. Lo que cambia hoy es que los dos intentan un ángulo de agente de WhatsApp, que ONIA no puede prometer (catálogo §5 y §7). No se sabe qué formato tienen ni a dónde mandan: los formatos salen de las capturas del 1-8 oct. La señal es la antigüedad y no prueba rendimiento.

### 5.4 Lo que no pude verificar

- Costo real de cada función con la cuenta de ONIA: el CLI de la PC respondía `Not authenticated` el 8-oct y no inicié sesión ni cotizé. Todo número de la sección 1 es de documentación pública (Higgsfield, 20-ago a 24-oct) o de mediciones de ONIA del 29-sep al 8-oct. El clip de Kling de 3-5 s y el Virality Predictor nunca se cotizaron.
- Plan, saldo y funciones (UGC builder, Speak) de la cuenta actual.
- Quién es el titular de la cuenta frente a la edad mínima de 18.
- Si Ads Studio y `dtc-ads` son el mismo motor, y cuántos modos de Marketing Studio expone el CLI (la ayuda solo habla de web y MCP).
- Qué hace y cuánto cuesta el workflow `ugc-saas` y `ad-multiplier`.
- Si el Virality Predictor predice algo útil para pauta de software: no hay validación independiente; en ONIA se prueba con el lote L4 y se adopta si acierta 3 de 4.
- El formato, el destino y el rendimiento de los anuncios de la competencia hoy.
- Si Meta etiqueta de verdad estos clips: lo dice su página de actualización, no lo probé.
- Estado de los requisitos de encendido de la prueba 1 (tarjeta, firma del bot, cuenta demo, quién contesta): el último estado medido es el del 10-oct. No leí la cuenta de ONIA Ads hoy. Tampoco leí `ONIA_PROMESA_VS_PRODUCTO.md` fila por fila contra producción de hoy; en el archivo las filas de A1 (B-02, G-01, G-06, G-11) están sin verificar y L-05 no se puede prometer.
- El catálogo de venta está medido al 1-oct; puede estar desactualizado. Antes de escribir cualquier guion para Higgsfield se vuelve a leer.
- Docs de la API de Higgsfield (`docs.higgsfield.ai`): no mencionan Marketing Studio ni créditos, solo generación por API con saldo aparte en USD.

---

## 6. Fuentes

Higgsfield (oficial, higgsfield.ai):
- Ayuda "How do I use Marketing Studio to create video ads", modificada 26-oct-2026: https://higgsfield.ai/creator-hub/help-center/tools/how-do-i-use-marketing-studio-to-create-video-ads
- Blog "Meet the New Marketing Studio" (18-ago-2026): https://higgsfield.ai/blog/new-marketing-studio-higgsfield
- Blog "How to Make AI UGC Videos" (20-ago-2026; UGC 52-142 créditos): https://higgsfield.ai/blog/how-to-make-ai-ugc-videos
- Blog "Higgsfield Ads Studio" (4 créditos por anuncio estático, hasta 20 por corrida): https://higgsfield.ai/blog/higgsfield-ads-studio
- Blog "Higgsfield Pricing Explained" (24-oct-2026): https://higgsfield.ai/blog/higgsfield-pricing-explained
- Ayuda "Which Higgsfield tool should I use": https://higgsfield.ai/creator-hub/help-center/tools/which-higgsfield-tool-should-i-use
- Ayuda "How to access Higgsfield via CLI and Skills" (1-ago-2026; CLI y MCP siempre cobran créditos, sin "Unlimited"): https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli
- Repositorio del CLI: https://github.com/higgsfield-ai/cli
- Guía "Still image to talking video" (8-oct-2026) y ayuda de Lipsync: https://higgsfield.ai/blog/still-image-to-talking-video , https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-use-lipsync-voiceover-and-aspect-ratios
- Blog "Video ads for small business" (8-oct-2026; no escribir el guion como si el avatar fuera un cliente real): https://higgsfield.ai/blog/video-ads-small-business-ai
- Términos de uso (actualizados 23-oct-2026; §2.1, §4.2(b), §4.4, §5.2(xi), §5.3, §5.5): https://higgsfield.ai/terms
- Documentación de la API (no cubre Marketing Studio): https://docs.higgsfield.ai/

Terceros (secundarios, a contrastar):
- AdTestBench, guía de Marketing Studio (18-oct-2026; cita 90 créditos por 15 s): https://adtestbench.com/guides/higgsfield-marketing-studio/
- Precios de terceros (Starter US$ 19 / 270): https://gregpreece.com/articles/higgsfield-pricing (10-sep-2026), https://adsgen.ai/blog/higgsfield-pricing, https://dailyaitools.ai/tools/higgsfield/ (19-oct-2026)
- Flighted, creativos de Meta para B2B SaaS (28-may-2026): https://www.flighted.co/blog/meta-ads-creative-strategy-guide-for-b2b-saas-brands
- SaaS Hero, Andromeda para B2B (15-feb-2026): https://www.saashero.net/strategy/meta-andromeda-b2b-facebook-ads/

Meta (oficial):
- Etiquetas de IA en anuncios, con la actualización del 1-jun-2026: https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/
- Ayuda "How AI-generated images in ads are identified and labeled": https://www.meta.com/help/artificial-intelligence/355108217670024/
- Andromeda (2-dic-2024): https://engineering.fb.com/2024/12/02/production-engineering/meta-andromeda-advantage-automation-next-gen-personalized-ads-retrieval-engine/

Repo (`C:\dev\proyectos\onia-hermes\.claude\worktrees\cool-keller-ad410b`):
- `CLAUDE.md`, `AGENTS.md`
- `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`, `.claude/skills/higgsfield-generate/SKILL.md` y `references/`
- `.claude/skills/onia-ventas-pauta/SKILL.md` §1, §4, §5, §8, §9, §9.9, §10
- `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md` §2.5, §2.6, §5
- `hermes-content/docs/ONIA_PLAN_1.0_Y_CAJA.md` §2-§4
- `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`, `ONIA_CLIENTE_IDEAL.md`, `ONIA_PROMESA_VS_PRODUCTO.md`
- `hermes-content/docs/TALLER_31_OCT.md`
- `hermes-content/sales-kit/SEGUIMIENTO-LEADS.md`, `06-VSL-DENTAL.md`
- `hermes-content/research/competencia/anuncios/FORMATOS-QUE-SOSTIENEN.md`
- `hermes-content/skills/ugc-empresas-higgsfield.md`
- `web-factory/docs/ADS_PATTERN_BANK_2026.md`
- `hermes-content/references/video-intake/2026-10-16-fluna-mini-clases-y-anunciante-supremo.md` (y el commit `c599443f`, que está en esta rama)
- Skill del curso: `C:\Users\PC\.claude\skills\synced\98824872-9ae6-4b8e-ac53-727fc71064ab_0f9d59a8-4fba-405b-9cc0-61fd9ed94867\anunciante-supremo\` (`SKILL.md`, `plantillas/hooks.md`, `plantillas/plantilla-2.md`)

---

## 7. Esqueleto para pasar a skill

Nombre sugerido: `higgsfield-anuncios` (en `.claude/skills/`, enlazada desde `onia-router` y `onia-ventas-pauta` §9.4). Secciones:

1. Cuándo se usa y cuándo no (el árbol de la sección 1: código primero, Higgsfield solo apertura, fondo, presentador IA si lo pide Sergio Urcullo, o puntaje de gancho).
2. Reglas duras (la tabla de la sección 2 en forma de lista de bloqueo).
3. Flujo de siete pasos: brief con tabla `frase / fila / estado` y test de alineación; resolver modelo y parámetros en vivo; `generate cost` y leer `adjustments`; aprobación; una generación; QA mirando el clip entero y un cuadro del gancho; recién ahí variantes de un solo eje; registro (modelo, parámetros, costo previsto y real, job id, decisión).
4. Tabla de costos reales (se llena con el lote de práctica 4.4; hoy son estimados marcados como tales).
5. Funnel por paso (sección 3), con las URLs a verificar y la regla de que la prueba va en el chat y la llamada.
6. Plan de prueba, cortes y métricas (sección 4).
7. Trampas medidas (letras inventadas, `sound: false`, 429 con más de 5 simultáneos o 4 jobs en el plan "pro", `generate cost` con ruta local sube el archivo, el CLI autenticado vive en el VPS, el MCP de Higgsfield no se usa para producir).
8. Registro de casos con fecha, para que la skill se actualice con cada tanda.

Pendientes que la skill no resuelve y piden decisión de Sergio Urcullo: (a) si noviembre reabre gasto de Higgsfield para pauta; (b) quién es el titular de la cuenta frente a los 18 años; (c) si pide un presentador IA; (d) los 20 contra 30 minutos de la demo; (e) el OK de Leslie Mercado Moreno si alguna vez se sube su cara o su voz.
