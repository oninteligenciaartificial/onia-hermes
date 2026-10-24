# META-ADS-ESTUDIO-APLICADO · anuncios del taller «Auditá tu negocio con IA»

Marca personal de Sergio Urcullo, **voseo**. Autor: Claude. Revisor previsto: Codex. Preparado el 23-oct-2026.
**Todo es borrador y propuesta.** No se configuró ninguna campaña, no se tocó ninguna cuenta de Meta, no se gastó nada, no se publicó nada, no se usó el conector de Meta ni la Biblioteca de Anuncios. **Bs 300 es la referencia del canon (decisión del 19-oct), no una autorización nueva de gasto.** Gastar, publicar y usar la cara o voz de Sergio en Meta siguen pidiendo su sí (y el de Leslie Mercado Moreno para cara/voz).
Reglas que se respetan: no se traslada la segmentación ni el vocabulario dental al taller; no se promete rendimiento a partir de la Biblioteca de Anuncios; ningún claim de ahorro, ingresos, grabación ni certificado.

## 1. Qué fuentes oficiales leí (y cuáles no)

Leídas yo mismo el 23-oct (WebFetch o búsqueda restringida a dominios oficiales). Un subagente ligero (Haiku, un único contrato de solo lectura) reunió pistas; **verifiqué sus puntos y no uso los que no pude confirmar** (§1.2).

### 1.1 Confirmado

| Fuente | Qué dice (cita corta) | Estado |
|---|---|---|
| Meta for Developers, «Click-to-WhatsApp», https://developers.facebook.com/documentation/ads-commerce/marketing-api/ad-creative/messaging-ads/click-to-whatsapp | La campaña usa objetivo `OUTCOME_ENGAGEMENT`; el conjunto de anuncios `destination_type` = `WHATSAPP`; se puede optimizar a `CONVERSATIONS` o `LINK_CLICKS`; se configura un `page_welcome_message` (por defecto «Hello! Can I get more info on this?») y **ice breakers** (respuestas rápidas predefinidas); requisito: «A Facebook page with WhatsApp number linked» | **Leída** completa, sin fecha visible |
| Meta for Developers, «Conversions API for Business Messaging», https://developers.facebook.com/documentation/ads-commerce/conversions-api/business-messaging | Eventos: «Purchase, LeadSubmitted, InitiateCheckout, … QualifiedLead, …»; para WhatsApp hacen falta un dataset, el **ctwa_clid** (viene en el objeto `referral` del webhook de mensajes) y el ID de la cuenta de WhatsApp Business; cubre «Ads That Click to WhatsApp» | **Leída**, sin fecha de publicación (menciona la versión 26.0 de la API) |
| Ayuda de Meta, «Last Significant Edit», https://www.facebook.com/business/help/942374239243867 | Meta recomienda esperar a que el conjunto tenga unos **50 eventos de optimización** desde la última edición significativa para considerar estables los costos | **Resultado de búsqueda restringida a facebook.com** (extracto), no la página completa |
| Estándares de anuncios de Meta, «Privacy Violations and Personal Attributes», https://transparency.meta.com/policies/ad-standards/objectionable-content/privacy-violations-personal-attributes/ | «Ads must not contain content that asserts or implies personal attributes», incluida la «vulnerable financial status»; no se permite usar «you/your» junto a un atributo personal; ejemplo prohibido: «Are you bankrupt?» | **Leída** (versión fechada 26-jun-2024 en la página) |
| Estándares de anuncios, «Fraud, Scams and Deceptive Practices», https://transparency.meta.com/policies/ad-standards/fraud-scams/fraud-scams-deceptive-practices/ | Prohíbe anuncios con prácticas engañosas y los «deceptive or exaggerated claims» sobre el éxito de un producto o servicio | **Resultado de búsqueda** (extracto) |
| WhatsApp Business, «Introducing Meta Business Agent», https://whatsappbusiness.com/blog/introducing-meta-business-agent-ai/ | 3-jun-2026: el agente califica leads y agenda; empezar es gratis y «en los próximos meses» se accede por suscripción | **Leída**; solo contexto, **no es noticia reciente** |

### 1.2 Descartado o no confirmado (incluye correcciones al subagente)

| Punto | Por qué no lo uso |
|---|---|
| «Meta Connect 2026 anunció la Business Agent Platform» (informe del subagente) | **No lo encontré.** Leí https://www.meta.com/blog/meta-connect-2026-everything-we-announced/ (23-sep-2026): no habla de mensajería de negocios, WhatsApp Business ni anuncios |
| «Learning phase: 50 eventos en 7 días» (cita del subagente) | La página de ayuda https://www.facebook.com/business/help/112167992830700 solo devolvió el título («Información sobre la fase de aprendizaje»); **el cuerpo no se leyó**. Solo uso lo confirmado: unos 50 eventos desde la última edición significativa |
| «Se recomiendan US$ 350-500 para salir del aprendizaje» (subagente) | **Sin fuente.** No lo uso. Mi cuenta de §4 es solo aritmética |
| Anuncios de Advertising Week NY (6-oct-2026): pago directo, eventos secuenciales para leads, Ads MCP | Aparecen solo en terceros (SocialBee, Common Thread, Marketing Dive, etc.); **no en una fuente primaria de Meta** que haya podido leer. Las fechas de los agregadores discrepan (19-oct y 6-oct) |
| Páginas de ayuda de Meta que dieron error de lectura (CORS/dinámicas) | No cuentan como leídas: mínimos de presupuesto y atribución exacta de «conversaciones iniciadas» (ventana). **Verificar en el editor de anuncios cuando se configure** |
| Nombres exactos de la interfaz de Ads Manager (p. ej. «Engagement», «Aplicaciones de mensajería») | La documentación que leí es de la API; los nombres del editor **no se confirmaron en una cuenta** |

## 2. Objetivo y destino, aterrizados

| Pregunta | Respuesta propuesta | Base |
|---|---|---|
| ¿Qué quiere el negocio? | **Pagos acreditados de cupos** del taller del 31-oct. No clics ni «me gusta». | Canon §2 |
| ¿Qué es lo que Meta puede optimizar acá? | **Conversaciones de WhatsApp iniciadas.** Objetivo `OUTCOME_ENGAGEMENT`, destino `WHATSAPP`, optimización `CONVERSATIONS` | §1.1 (documentación de la API) |
| ¿Por qué no optimizar a un evento posterior (lead calificado, compra)? | Para eso Meta pide enviar eventos por la **API de conversiones de mensajería** con un dataset y el `ctwa_clid` que llega por webhook: se necesita la **plataforma de WhatsApp Business con webhook**. El canon dice que el botón va al **WhatsApp personal** de Sergio, que atiende y confirma cada pago. *Inferencia mía:* con ese número no hay webhook, así que no se envían esos eventos. | §1.1; canon §0 (19-oct) |
| ¿A dónde lleva el anuncio? | **Directo al chat de WhatsApp de Sergio** (un paso menos que pasar por la página). La página `/auditoria` queda para lo orgánico | Canon §0, §5; regla «Simple» de CLAUDE.md |
| ¿Qué falta para que exista el destino? | Una página de Facebook **con ese número de WhatsApp vinculado** (requisito documentado); el número que decida Sergio; el QR del BCP y el texto de devolución (compuerta del canon §3: puntos 3, 4 y 5) | §1.1; canon §3 |

## 3. Medición: conversaciones calificadas y pagos

Tres niveles. **Solo el primero lo ve Meta.**

| Nivel | Qué es | Dónde se mide | Fórmula |
|---|---|---|---|
| **N1. Conversaciones iniciadas** | Personas que escriben desde el anuncio | Administrador de anuncios (optimización `CONVERSATIONS`) | costo por conversación = gasto ÷ N1 |
| **N2. Conversaciones calificadas** | Cumple los 4 criterios de abajo | **A mano**, con una etiqueta en el chat («Calificada»); una fila por día | costo por calificada = gasto ÷ N2; tasa = N2 ÷ N1 |
| **N3. Pagos acreditados** | El pago llegó (QR del BCP, **fuera de Meta**) | `hermes-content/sales-kit/SEGUIMIENTO-LEADS.md` (una fila por pago, canon §5) | costo por pago = gasto ÷ N3; tasa = N3 ÷ N2 |

**Una conversación es «calificada» si** (los cuatro): (1) tiene un negocio; (2) repite tareas cada semana; (3) puede el sábado 31 a las 10:00 (La Paz) por Google Meet; (4) no busca certificado ni que otro lo haga por ella o él (canon §1, «para quién no es»).

**Cómo se sabe de qué anuncio vino cada persona (atribución a mano):** cada anuncio lleva un código en el **mensaje precargado** («…(T1)…», «…(T2)…»), práctica ya medida en `ONIA_ADQUISICION_Y_PAUTA.md` §5.5 (citada en `onia-ventas-pauta` §9.6). Si la persona lo borra, la **primera pregunta** del chat es «¿cómo llegaste?».

**Qué NO se puede medir con esto:** quién vio el anuncio y pagó después por otro camino; si una calificada pagaría igual sin el anuncio; el efecto de la marca personal orgánica. Por eso el resultado es una **lectura descriptiva**, no una prueba de causa.

**Opción futura (no para este experimento):** si algún día el número pasa por la plataforma de WhatsApp Business con webhook, el evento `QualifiedLead` documentado permitiría mandar la calificación a Meta. Hoy no.

## 4. Presupuesto: lo que dicen las cuentas (`pruebas/meta_cuentas.py`)

Todo es aritmética con números del canon. **No hay benchmarks de costo por conversación para esta oferta**; las cifras de costo de la tabla son **supuestos para ver qué tendría que pasar**, no predicciones.

- **Gasto por día** con Bs 300: 7 días = Bs 42,86; 8 días (el plan del canon, mié 22 a jue 29) = Bs 37,50; 5 días = Bs 60.
- **Pagos para cubrir el gasto** (no es ganancia): a Bs 50, **6** pagos; a Bs 60, **5**; a Bs 70, **5** (4,29 redondeado hacia arriba). Los Bs 300 son el **10 %** de la meta de Bs 3.000; la pauta sola no la alcanza ni se promete que ayude.
- **Aprendizaje de Meta:** unos 50 eventos desde la última edición significativa (§1.1). Con Bs 300 se llega a 50 conversaciones **solo si cada una cuesta Bs 6 o menos**. Si cuesta más, no habrá «estadística»: el experimento sirve para **leer** si llegan dueños con tareas repetidas y a qué costo, no para decidir cuál anuncio «gana».

| Si cada conversación costara (supuesto) | Conversaciones con Bs 300 | Tasa de conversación a pago para llegar a 5 pagos |
|---|---|---|
| Bs 4 | 75 | 6,7 % |
| Bs 6 | 50 | 10 % |
| Bs 8 | 37,5 | 13,3 % |
| Bs 15 | 20 | 25 % |
| Bs 30 | 10 | 50 % |

Lectura: cuanto más cara la conversación, más exigente la tasa necesaria. No se sabe cuál es la tasa real; **esa es la pregunta que el experimento responde**. La moneda y los mínimos de presupuesto los fija la cuenta publicitaria al configurarla (no se asumieron conversiones a dólares).

## 5. Dos conceptos de anuncio (borrador, originales)

Estilo de **marca personal**: fotografía B/N con un solo objeto verde, de la galería propia (`hermes-content/galeria/fotos-bn/`), voseo. **No es la pauta de Onia** (de usted, UI real): son dos líneas distintas. **Ninguno muestra la cara ni la voz de Sergio**: subir su cara a Meta pide el OK de Sergio y de Leslie Mercado Moreno (CLAUDE.md, «Qué se publica sin preguntar»). Las imágenes son ilustrativas generadas con IA; **verificar en el editor si Meta pide etiquetarlas** (no lo confirmé). Sin precio en la pieza: se responde en el chat.

### Concepto 1 · «El renglón que nadie cuenta»
- **Idea:** la pila de tareas repetidas y el único sobre verde que se elige.
- **Formato:** imagen 4:5 y 9:16. Foto: `lote-fotobn-s31` (pila de sobres, bandejas, un sobre verde) o `s32` (una pila vs. uno verde).
- **Texto principal:** «Tu negocio repite tareas cada semana y nadie las cuenta. Taller en vivo, sábado 31 de octubre, 10:00 (La Paz): contás las tuyas y salís con una prioridad y un primer paso. 90 minutos de contenido y una pausa de 5. 50 cupos.»
- **Título:** «Contá lo que repetís»
- **Descripción:** «Taller en vivo · Google Meet»
- **Botón:** «Enviar mensaje» (WhatsApp)
- **Mensaje precargado:** «Hola, quiero saber del taller del sábado 31 (T1)»
- **Ice breakers (máx. 4):** «¿Qué voy a llevarme?» · «¿Es para mi negocio?» · «¿Cómo funciona el pago?» · «¿A qué hora es?»

### Concepto 2 · «Una sola tarea»
- **Idea:** de muchas tareas, elegir una. Tono más directo.
- **Formato:** imagen 4:5 y 9:16. Foto: `lote-fotobn-s35` (balanza con espacio libre para el título) o `s36`. Variante en video corto de 15-20 s **solo con tarjetas y voz en off**, sin la voz de Sergio, mientras no haya OK.
- **Texto principal:** «Si tu negocio repite diez cosas, no empieces por las diez. En el taller del sábado 31 contás tu tiempo, elegís una y definís tu primer paso. En vivo, 90 minutos de contenido más una pausa de 5.»
- **Título:** «Elegí una sola tarea»
- **Descripción:** «Sáb 31 oct · 10:00 (La Paz)»
- **Botón:** «Enviar mensaje» (WhatsApp)
- **Mensaje precargado:** «Hola, quiero saber del taller del sábado 31 (T2)»
- **Ice breakers:** los mismos cuatro.

### Qué responde el chat (las 3 preguntas que califican)
1. «¿Qué negocio tenés?» 2. «¿Qué tarea repetís más?» 3. «¿Podés el sábado 31 a las 10:00 (La Paz) por Google Meet?». Con la respuesta se marca **Calificada** o no, y recién ahí se manda el QR (cuando exista, compuerta §3 del canon).

### Revisión contra las políticas leídas
| Regla | Cómo se cumple |
|---|---|
| Sin atributos personales («vulnerable financial status», «you/your» + atributo, ejemplo «Are you bankrupt?») | Hablan de **tareas y tiempo del negocio**, no de plata en problemas ni de situación personal. Nada de «¿perdés plata?» |
| Sin claims engañosos o exagerados | Sin ahorro, ingresos, resultados, «garantizado», certificado ni grabación |
| Sin testimonios ni casos | No hay ninguno; no se inventan |
| Sin escasez falsa | «50 cupos» es la capacidad real del canon; **no** se escribe «últimos cupos» ni contadores sin dato |
| Sin competidores ni terceros | Ninguno nombrado |

## 6. Experimento acotado (NO ejecutar sin las aprobaciones de §7)

**Pregunta:** ¿cuántos dueños con tareas repetidas escriben desde un anuncio, a qué costo, y cuántos terminan pagando?
**Diseño (todo propuesto, nada configurado):** 1 campaña (objetivo Engagement, destino WhatsApp, optimización a conversaciones) · 1 conjunto de anuncios · **2 anuncios** (los conceptos 1 y 2, mismo público) · duración **7 días** (o los que queden hasta el cierre del jue 29, 20:00) · **tope total Bs 300 como presupuesto total de la campaña con fecha de fin** (no con límite de gasto de cuenta: el playbook de `onia-ventas-pauta` §5 anota que Meta rechazó un límite menor a USD 100) · ubicación Bolivia (Sergio decide si todo el país o Santa Cruz) · **sin intereses ni segmentación por rubro** (menos aún la dental).
**Lo que NO se cambia durante la prueba:** público, concepto y mensaje (cada cambio reinicia el aprendizaje); presupuesto no más de +20 % (regla del playbook).

**Antes de gastar un boliviano (todas deben ser «sí»):**
1. Compuerta del canon §3 cumplida: página publicada, textos aprobados, número atendido, **QR y titular**, **texto de devolución**.
2. **OK escrito de Sergio al gasto** (esto no lo da este documento).
3. La página tiene ese número de WhatsApp vinculado; se escribió al número desde un teléfono de prueba y alguien respondió.
4. Alguien contesta cada conversación **dentro de una hora** en el horario en que corre el anuncio.
5. Las 2 piezas ya revisadas (captura 390 y 1440, texto contra la tabla de claims) y mostradas a Sergio con captura.

**Criterios para detener (decididos antes, no durante):**

| Cuándo | Señal | Decisión |
|---|---|---|
| Cualquier momento | Rechazo o aviso de política; se llega a Bs 300; nadie puede responder a tiempo; llegan quejas o personas que no son del público | **Parar** y revisar. No reabrir con otro texto sin ver el motivo |
| Día 3 (≈ Bs 129 gastados a ritmo parejo) | **0 conversaciones** | Parar: algo del destino está roto (número, vínculo, página). No subir presupuesto |
| Día 5 (≈ Bs 214) | Hay conversaciones pero **ninguna calificada** | El mensaje no filtra o llega a gente equivocada: pausar el anuncio que menos califica y no gastar el resto en el mismo mensaje |
| Día 7 o cierre | **5 o más pagos** atribuidos a la pauta | La pauta **cubrió su costo** (no hay ganancia ni prueba de causa); se puede repetir con otro tope **solo con nuevo OK** |
| Día 7 o cierre | **Menos de 5 pagos** | No cubrió su costo. **No concluir que «no sirve»**: la muestra es chica. No repetir sin cambiar el concepto y sin OK |
| Cualquier momento | Costo por pago mayor que el precio del escalón vigente | No escalar |

**Qué se anota cada día (una fila):** fecha · gasto · N1 · N2 · N3 por código T1/T2 · costo por conversación · tasa N2/N1 · notas. Los chequeos de ventas del canon (vie 23, mar 27 y cierre jue 29) siguen siendo sobre **pagos totales**, no solo de la pauta.

## 7. Qué falta y de quién

| Falta | Quién |
|---|---|
| OK de gasto de Bs 300, cuenta y método de pago | Sergio Urcullo |
| Número de WhatsApp, OK a página y textos | Sergio Urcullo |
| QR del BCP, titular y facturación; texto de devolución | Leslie Mercado Moreno |
| Abrir la venta | Sergio Urcullo (la compuerta del canon §3) |
| Ver los nombres exactos del editor de anuncios y si exige etiquetar imágenes de IA | Quien configure, en la cuenta |
| Cara o voz de Sergio en una variante de video | Sergio Urcullo y Leslie Mercado Moreno |

## 8. Límites de este estudio

- No usé ninguna cuenta de Meta ni el conector; no vi datos de rendimiento propios ni de terceros; **no se promete ningún costo ni resultado**.
- Dos páginas oficiales que importan (aprendizaje completo y mínimo de presupuesto) **no se pudieron leer**; lo que dependa de ellas está marcado.
- La atribución es manual y descriptiva.
- Las cifras de costo por conversación de §4 son hipótesis para razonar.
- Una tanda con Bs 300 no produce estadística (ver §4).
