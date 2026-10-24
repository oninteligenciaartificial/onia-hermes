# META-ADS-ESTUDIO-APLICADO · anuncios del taller «Auditá tu negocio con IA»

Marca personal de Sergio Urcullo, **voseo**. Autor: Claude. Revisor previsto: Codex. Preparado el 23-oct-2026.
**Todo es borrador y propuesta.** No se configuró ninguna campaña, no se tocó ninguna cuenta de Meta, no se gastó nada, no se publicó nada, no se usó el conector de Meta ni la Biblioteca de Anuncios. **Bs 300 es la referencia del canon (decisión del 19-oct), no una autorización nueva de gasto.** Gastar, publicar y usar la cara o voz de Sergio en Meta siguen pidiendo su sí (y el de Leslie Mercado Moreno para cara/voz).
Reglas que se respetan: no se traslada la segmentación ni el vocabulario dental al taller; no se promete rendimiento a partir de la Biblioteca de Anuncios; ningún claim de ahorro, ingresos, grabación ni certificado.

## 1. Qué fuentes oficiales leí (y cuáles no)

Leídas por mí el 23-oct (WebFetch o búsqueda restringida a dominios oficiales). Un subagente ligero (Haiku, un único contrato de solo lectura) reunió pistas; **verifiqué sus puntos y no uso los que no pude confirmar** (§1.2).

> **Corrección tras la revisión de Codex (23-oct).** El revisor y su ayudante **no pudieron reproducir** las lecturas de las páginas de Meta de abajo (HTTP 429, inicio de sesión o bloqueo temporal). **Siguen como `NO_VERIFICADO` para el revisor.** Que yo las haya leído **no las convierte en verificadas**: lo que dependa de ellas se presenta como lectura del autor, a confirmar en la fuente antes de decidir. Las únicas fuentes corroboradas por el revisor en este paquete son las de noticias (Goldman, OpenAI, Google) y la lista de Anthropic; ninguna es de Meta.

### 1.1 Leído por el autor (NO corroborado por el revisor: `NO_VERIFICADO`)

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

## 2. Objetivo y destino

| Pregunta | Respuesta propuesta | Base y estado |
|---|---|---|
| ¿Qué quiere el negocio? | **Pagos acreditados de cupos** del taller del 31-oct. No clics ni «me gusta». | Canon §2 |
| ¿Qué podría optimizar Meta? | **Conversaciones de WhatsApp iniciadas** (objetivo `OUTCOME_ENGAGEMENT`, destino `WHATSAPP`, optimización `CONVERSATIONS`), **solo si** se elige el destino de chat directo (abajo) | Lectura del autor de la documentación de la API (`NO_VERIFICADO` para el revisor) |
| ¿Por qué no optimizar a un evento posterior (calificado, compra)? | Esa vía pide enviar eventos por la API de conversiones de mensajería con dataset y `ctwa_clid` que llega por webhook. *Inferencia mía:* con el WhatsApp personal de Sergio no hay webhook, así que no se enviarían esos eventos. **No está acreditado** que el número sea elegible ni cómo se integraría | Lectura del autor (`NO_VERIFICADO`); inferencia |

### Destino: dos caminos, **la decisión queda pendiente de Sergio**

| | A. **Camino del canon** | B. **Alternativa propuesta (no es canon)** |
|---|---|---|
| Recorrido | Anuncio (o perfil) → página `/auditoria` → botón a su WhatsApp personal | Anuncio de clic a WhatsApp → chat directo con Sergio |
| Respaldo | Canon §0 y §5: «el botón va a su WhatsApp personal» | Mi propuesta, para ahorrar un paso. **El canon no la aprobó** |
| Qué habría que acreditar | Cómo se mide el paso anuncio → página (no analicé píxel ni eventos; sin evidencia aquí) | **(1)** que un número de WhatsApp **personal** pueda usarse en anuncios de clic a WhatsApp; **(2)** que pueda vincularse a una Page; **(3)** si hay **etiquetas** para marcar calificadas. **Nada de esto está acreditado.** Escribirle desde otro teléfono prueba solo que **la mensajería funciona**, no que el número sea elegible |
| Medición | N1 por clics a WhatsApp o a la página según la configuración (a definir) | N1 = conversaciones iniciadas (si Meta lo permite con ese número) |

**Qué se hace con esto:** nada se configura ni se migra. Antes de gastar, **Sergio elige A o B** y quien configure comprueba la elegibilidad en la cuenta. Hasta entonces, los dos conceptos de anuncio (§5) sirven para cualquiera de los dos caminos: el **botón «Enviar mensaje»**, el **mensaje precargado** y los **ice breakers** aplican **solo a B**; en A el botón llevaría a la página.

## 3. Medición: conversaciones calificadas y pagos

Tres niveles. **Solo el primero lo ve Meta.**

| Nivel | Qué es | Dónde se mide | Fórmula |
|---|---|---|---|
| **N1. Conversaciones iniciadas** | Personas que escriben desde el anuncio | Administrador de anuncios (optimización `CONVERSATIONS`) | costo por conversación = gasto ÷ N1 |
| **N2. Conversaciones calificadas** | Cumple los 4 criterios de abajo | **A mano**: planilla propia (una fila por día); la **etiqueta** del chat solo si la cuenta la ofrece (no acreditado, §2) | costo por calificada = gasto ÷ N2; tasa = N2 ÷ N1 |
| **N3. Pagos acreditados** | El pago llegó (QR del BCP, **fuera de Meta**) | `hermes-content/sales-kit/SEGUIMIENTO-LEADS.md` (una fila por pago, canon §5) | costo por pago = gasto ÷ N3; tasa = N3 ÷ N2 |

**Una conversación es «calificada» si** (los cuatro): (1) tiene un negocio; (2) repite tareas cada semana; (3) puede el sábado 31 a las 10:00 (La Paz) por Google Meet; (4) **no busca certificado ni que otro lo haga por ella o él** (canon §1, «para quién no es»). Los cuatro se preguntan en el chat (§5). Si alguna respuesta falta, la conversación queda **«calificación pendiente»**, no «calificada».

**Cómo se sabe de qué anuncio vino cada persona (atribución a mano, solo en el camino B):** cada anuncio lleva un código en el **mensaje precargado** («…(T1)…», «…(T2)…»), práctica ya medida en `ONIA_ADQUISICION_Y_PAUTA.md` §5.5 (citada en `onia-ventas-pauta` §9.6). Si la persona borra el código, la primera pregunta del chat es «¿cómo llegaste?». **Si responde algo que no identifica el anuncio (por ejemplo «Instagram»), el origen se registra como «anuncio desconocido» y no se adjudica a T1 ni a T2: no se adivina.**

**Qué NO se puede medir con esto:** de qué anuncio vino quien borró el código; quién vio el anuncio y pagó después por otro camino; si una calificada pagaría igual sin el anuncio; el efecto de la marca personal orgánica. Por eso el resultado es una **lectura descriptiva**, no una prueba de causa.

**Opción futura (no para este experimento):** si algún día el número pasa por la plataforma de WhatsApp Business con webhook, el evento `QualifiedLead` documentado permitiría mandar la calificación a Meta. Hoy no.

## 4. Presupuesto y cobertura: lo que dicen las cuentas (`pruebas/meta_cuentas.py`)

Todo es aritmética con números del canon. **No hay benchmarks de costo por conversación para esta oferta**; las cifras de costo son **supuestos para razonar**, no predicciones. **El techo de Bs 300 NO se sube**: ninguna lectura de este documento habilita gastar más; subirlo exige un **nuevo OK escrito de Sergio**.

- **Gasto por día** con Bs 300: 7 días = Bs 42,86; 8 días (plan del canon) = Bs 37,50; 5 días = Bs 60.
- **Cómo se compara el resultado:** la **suma acreditada atribuible** (los montos **efectivamente cobrados**, cada pago de Bs 50, 60 o 70 según el escalón en que se acreditó) contra el **gasto real**, no contra un número fijo de pagos. Esa diferencia es **cobertura bruta**: **no es beneficio** (faltan IVA, IT y otros costos, canon §2) y **no es prueba de causa** (esas personas podrían haber pagado sin el anuncio).

| Caso (probado en `meta_cuentas.py`) | Suma cobrada | Gasto real | Diferencia bruta |
|---|---|---|---|
| 5 pagos de Bs 50 | Bs 250 | Bs 300 | **−50: no cubre** |
| 4 pagos de Bs 50 | Bs 200 | Bs 180 | **+20: cubre** |
| Mezcla 50, 50, 60, 60, 70 | Bs 290 | Bs 300 | −10: no cubre |
| Mezcla 50, 60, 60, 70, 70 | Bs 310 | Bs 300 | +10: cubre |
| 5 pagos de Bs 70 | Bs 350 | Bs 300 | +50: cubre |
| 5 pagos de Bs 60 | Bs 300 | Bs 300 | 0: justo |
| Ninguno | Bs 0 | Bs 300 | −300: no cubre |

Lo que **ya no se afirma**: que «5 pagos cubren Bs 300» (falso con 5 pagos de Bs 50) ni que «menos de 5 pagos no cubren» (cuatro de Bs 50 cubren un gasto de Bs 180). Los Bs 300 son el 10 % de la meta de Bs 3.000; la pauta sola no la alcanza ni se promete que ayude.

- **Sobre «50 eventos» de Meta (lectura del autor, `NO_VERIFICADO` para el revisor):** Meta mencionaría unos 50 eventos como referencia de estabilidad. **No es un umbral estadístico** ni acredita significación. Aritmética: con Bs 300 se llegaría a 50 conversaciones **solo si cada una costara Bs 6 o menos**; si cuesta más, el experimento no tendrá volumen y sirve para **leer de forma descriptiva** (si llegan dueños con tareas repetidas y a qué costo), **no para decidir qué anuncio «gana»**.

| Costo por conversación (supuesto) | Conversaciones con Bs 300 |
|---|---|
| Bs 4 | 75 |
| Bs 6 | 50 |
| Bs 8 | 37,5 |
| Bs 15 | 20 |
| Bs 30 | 10 |

Para la lectura final se comparan **por conversación**: gasto real ÷ N1 contra suma cobrada atribuible ÷ N1. La moneda y los mínimos de presupuesto los fija la cuenta al configurarla (no se asumieron conversiones a dólares).

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

### Qué responde el chat (las 4 preguntas que califican; solo en el camino B)
1. «¿Qué negocio tenés?» 2. «¿Qué tarea repetís más?» 3. «¿Podés el sábado 31 a las 10:00 (La Paz) por Google Meet?» 4. «Este taller no da certificado y lo armás vos con tu negocio, en vivo. ¿Te sirve así?». Con las cuatro respuestas se marca **calificada**, **no calificada** o **calificación pendiente**; recién ahí se manda el QR (cuando exista, compuerta §3 del canon).

### Revisión contra las políticas leídas
| Regla | Cómo se cumple |
|---|---|
| Sin atributos personales («vulnerable financial status», «you/your» + atributo, ejemplo «Are you bankrupt?») | Hablan de **tareas y tiempo del negocio**, no de plata en problemas ni de situación personal. Nada de «¿perdés plata?» |
| Sin claims engañosos o exagerados | Sin ahorro, ingresos, resultados, «garantizado», certificado ni grabación |
| Sin testimonios ni casos | No hay ninguno; no se inventan |
| Sin escasez falsa | «50 cupos» es la capacidad real del canon; **no** se escribe «últimos cupos» ni contadores sin dato |
| Sin competidores ni terceros | Ninguno nombrado |

## 6. Experimento acotado (NO ejecutar sin las aprobaciones de §7)

**Pregunta:** ¿cuántos dueños con tareas repetidas escriben o llegan desde un anuncio, a qué costo, y qué suma terminan pagando? **Lectura descriptiva**, no prueba de causa.
**Diseño (todo propuesto, nada configurado; el destino A o B lo elige Sergio, §2):** 1 campaña · 1 conjunto de anuncios · **2 anuncios** (conceptos 1 y 2, mismo público) · duración **7 días** o los que queden hasta el cierre del jue 29, 20:00 · **tope total Bs 300 como presupuesto total de la campaña con fecha de fin** (no con límite de gasto de cuenta: `onia-ventas-pauta` §5 anota que Meta rechazó un límite menor a USD 100) · ubicación Bolivia (Sergio decide si todo el país o Santa Cruz) · **sin intereses ni segmentación por rubro** (menos aún la dental).
**Regla interna (no una regla de Meta verificada):** durante la lectura **no se cambian** público, concepto ni mensaje, para poder comparar lo que se mide. **El techo de Bs 300 no se sube**: no hay margen de «+20 %»; subir el gasto exige un **nuevo OK escrito de Sergio**.

**Antes de gastar un boliviano (todas deben ser «sí»):**
1. Compuerta del canon §3 cumplida: página publicada, textos aprobados, número atendido, **QR y titular**, **texto de devolución**.
2. **OK escrito de Sergio al gasto** (esto no lo da este documento) y **elección del destino A o B**.
3. **Si es B:** acreditado en la cuenta que el número es elegible, que se vincula a una Page y qué etiquetas hay (hoy **no acreditado**). Escribirle desde un teléfono de prueba **solo comprueba que la mensajería funciona**, no la elegibilidad.
4. Alguien contesta cada conversación **dentro de una hora** en el horario en que corre el anuncio.
5. Las 2 piezas revisadas (captura 390 y 1440, texto contra la tabla de claims) y mostradas a Sergio con captura.

**Criterios para pausar o cerrar (decididos antes, no durante). Son reglas internas, no diagnósticos:**

| Cuándo | Señal | Decisión |
|---|---|---|
| Cualquier momento | Rechazo o aviso de política; se llega a Bs 300; nadie puede responder a tiempo; llegan quejas o personas que no son del público | **Pausar** y revisar. No reabrir con otro texto sin ver el motivo |
| Día 3 (≈ Bs 129 a ritmo parejo) | **0 conversaciones** | **Pausar e inspeccionar** (rechazo, entrega, configuración, destino, anuncio). **Cero conversaciones no demuestra que el destino esté roto**: puede haber otras causas. No subir presupuesto |
| Día 5 (≈ Bs 214) | Hay conversaciones pero **ninguna calificada** | Inspeccionar mensaje, público y preguntas. **No prueba por sí sola la causa.** Decidir con Sergio si seguir gastando el resto; no se repite el mismo mensaje por reflejo |
| Cierre (día 7 o jue 29, 20:00) | **Suma acreditada atribuible ≥ gasto real** | La pauta **cubrió su gasto en bruto**. No es beneficio ni prueba de causa. Repetir exige **nuevo OK** y no se sube el techo |
| Cierre | **Suma acreditada atribuible < gasto real** | **No cubrió el gasto.** No concluir que «no sirve»: la muestra es chica. No repetir sin cambiar el concepto y sin OK |
| Cierre | Hay conversaciones y pagos sin origen identificado | Se registran como «anuncio desconocido»; **no se adjudican** a ninguna variante |

**Qué se anota cada día (una fila):** fecha · gasto real · N1 · N2 (calificadas) · calificación pendiente · N3 (pagos acreditados y **monto cobrado de cada uno**) por código T1/T2/desconocido · costo por conversación · tasa N2/N1 · notas. Los chequeos de ventas del canon (vie 23, mar 27 y cierre jue 29) siguen siendo sobre **pagos totales**, no solo de la pauta.

## 7. Qué falta y de quién

| Falta | Quién |
|---|---|
| OK de gasto de Bs 300, cuenta y método de pago | Sergio Urcullo |
| Elegir el destino (A canon o B alternativa), número de WhatsApp, OK a página y textos | Sergio Urcullo |
| Acreditar, en la cuenta, la elegibilidad del número personal, el vínculo con una Page y las etiquetas (solo si es B) | Quien configure |
| QR del BCP, titular y facturación; texto de devolución | Leslie Mercado Moreno |
| Abrir la venta | Sergio Urcullo (la compuerta del canon §3) |
| Ver los nombres exactos del editor de anuncios y si exige etiquetar imágenes de IA | Quien configure, en la cuenta |
| Cara o voz de Sergio en una variante de video | Sergio Urcullo y Leslie Mercado Moreno |

## 8. Límites de este estudio

- No usé ninguna cuenta de Meta ni el conector; no vi datos de rendimiento propios ni de terceros; **no se promete ningún costo ni resultado**.
- Dos páginas oficiales que importan (aprendizaje completo y mínimo de presupuesto) **no se pudieron leer**; lo que dependa de ellas está marcado.
- La atribución es manual y descriptiva.
- Las cifras de costo por conversación de §4 son hipótesis para razonar.
- Una tanda con Bs 300 no produce estadística (ver §4); **las fuentes de Meta de §1.1 siguen `NO_VERIFICADO` para el revisor**.
- El camino B (chat directo) **no es canon** y su viabilidad con el número personal **no está acreditada**.
