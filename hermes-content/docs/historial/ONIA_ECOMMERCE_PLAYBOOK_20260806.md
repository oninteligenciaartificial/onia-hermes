# Playbook de e-commerce de Onia

> ⚠️ **Movido a `historial/` el 2026-09-04. Esto es la INVESTIGACION, no la fuente de verdad.**
> La fuente del tema es **`ONIA_ECOMMERCE_Y_DROPSHIPPING.md`** (sin fecha), que recoge la
> decision de la §8 de acá y la ordena junto a las otras variantes.
> Vivia en `docs/` con fecha en el nombre y **cero documentos lo citaban** — o sea que la
> decision operativa del tema estaba guardada donde no se busca. Se lee acá el detalle
> tramo por tramo; **manda el archivo sin fecha**.

Fecha: 2026-08-06 · Autor: sesion de estrategia (4 investigaciones + critica adversarial)
Estado: propuesta de decision. Seccion 8 toma posicion.

> **Fuente de este doc:** analisis multi-agente (4 investigaciones paralelas + pase
> adversarial + sintesis) disparado por 3 reels que mando Sergio el 2026-08-06:
> @buildercult, @admanage.ai y @nocodealex — los tres con la misma mecanica
> "comenta una palabra y te mando el link". El reel de @buildercult se VIO
> (70 s, UGC talking-head enmarcado en escritorio retro Windows, subtitulos en
> fuente pixel; caso de la app Sprout con 408,8M de views). Los otros dos se
> analizaron por caption y metricas.

---

## 1. La mecanica, en 5 lineas

1. Un reel entrega valor o promete un activo digital concreto, y cierra con UN solo pedido: comenta una palabra.
2. El comentario dispara un DM automatico con el activo (link, herramienta, comando). El costo de mandar ese DM es cero.
3. Funciona porque el comentario es una senal de ranking barata para el creador y una accion de friccion baja para el usuario: convierte alcance en contactos con nombre.
4. El activo tiene que ser marginal cero y de valor inmediato. Los 3 casos entregan software o informacion, nunca un producto fisico.
5. No genera alcance: lo convierte. El comentario mas votado en @buildercult ("she was already an influencer with like upwards of 100k followers") es la prueba publica de eso.

---

## 2. Que aplica al e-commerce de Onia y que NO

| Pieza de la mecanica | Aplica | Por que |
|---|---|---|
| Un solo pedido por pieza | SI | Los 3 reels piden una cosa. En e-commerce: un producto, un precio, una accion. |
| Valor completo dentro del creativo | SOLO en B2B | En venta de producto, si el carrusel queda completo no queda razon para comprar. En "te reviso el catalogo" el valor completo es exactamente el gancho. |
| Comentario como disparador | SI, manual | Ver seccion 3. El disparador sirve; la automatizacion no esta disponible. |
| DM automatico por API | NO HOY | Requiere Advanced Access + Business Verification. Mismo tramite trabado que el token de IG. |
| Payoff = activo digital | SI en B2B, NO en producto | Comentar "PIEL" para recibir un link de producto es un link-in-bio con pasos extra, y atrae cazadores de descuento. |
| Publico = comprador final | NO es la prioridad | El hallazgo con valor real es que nadie en la pauta hispana le habla al DUENO de la tienda. Ese es el comprador A que Onia ya tiene mapeado. |
| Publico = dueno de tienda | SI, es el carril | Juanimporta corre 6 ads activos vendiendole formacion a ese mismo dueno. El comprador existe y compra por Meta. |
| Modelos IA como testigo | PROHIBIDO | Seccion 5. |

Lo que se descarta explicitamente y por que:

- **Comment-to-DM para vender producto fisico.** No hay activo digital que entregar. El fit es inexistente, no es un hueco de mercado.
- **Instagram DM como canal de cierre en Bolivia.** El e-commerce LatAm en Meta cierra por WhatsApp ("Chatea con nosotros" y `api.whatsapp.com` son el CTA dominante observado). Construir sobre Instagram Messaging API es la ruta mas cara al canal secundario.
- **"Bolivia esta vacia" como tesis de entrada.** 354 ads de "tienda online" en BO sobre 30.052 regionales es 1,2%, y Bolivia es aproximadamente 4% de la poblacion de ese bloque [SUPUESTO: participacion poblacional aproximada, no verificada]. 1,2% es lo esperable, no un hueco. Pocos anunciantes suele significar que el canal no paga ahi.
- **Cualquier cifra de UGC sin metodologia publicada.** Emplifi 10,38x se descarta. Yotpo +91% se descarta por el mismo criterio. Ninguna de las dos entra en una propuesta a cliente.

---

## 3. El circuito completo, tramo por tramo

Estado: **CORRE** = funciona hoy sin intervencion · **MANUAL** = funciona con una persona · **BLOQUEADO** = no se puede ejecutar, con dueno del bloqueo.

### Carril B2B (vender e-commerce a un cliente)

| # | Tramo | Estado | Detalle |
|---|---|---|---|
| 1 | Encontrar prospectos con evidencia | CORRE | Ad Library API por MCP. Ya se detectaron feeds rotos corriendo en vivo (`{{product.name}}` en 3 paginas, typo "ENVIO RATIS" en otra). |
| 2 | Producir el creativo (screenshot + carrusel) | CORRE | Cero gasto. Banco de patrones ya en repo: `web-factory/docs/CAROUSEL_PATTERN_BANK_2026.md` y `ADS_PATTERN_BANK_2026.md`. |
| 3 | Publicar organico en IG/FB | MANUAL | Publicacion a mano. La publicacion automatica esta BLOQUEADA por falta de token de IG (tramite del dueno). |
| 4 | Recibir el comentario | CORRE | No requiere nada. |
| 5 | Responder el comentario con el link | MANUAL | Responder a mano con `wa.me` + `?src=`. Cero tramite, cero API, cero ManyChat. |
| 5b | Responder por DM automatico | BLOQUEADO | Meta: Advanced Access + Business Verification + feature Human Agent. Business Verification depende de SEPREC. Dueno del bloqueo: Sergio. |
| 6 | Lead entra al pipeline | CORRE | Circuito `?src=` vivo y probado punta a punta en el panel. |
| 7 | Agendar reunion | CORRE | Cal.com conectado por webhook, la reserva entra sola al panel. |
| 8 | Cerrar la venta | MANUAL | Sergio o un colaborador comercial. |
| 9 | Cobrar | MANUAL | [FALTA DATO] metodo de cobro estandarizado para servicio; hoy es transferencia/manual. |
| 10 | Entregar la tienda | CORRE parcial | Existe `web-factory/packages/templates/src/store.ts` (plantilla e-commerce completa) + cliente demo `skincare-demo`. NO existen bloques de commerce componibles: se sirve la plantilla entera o nada. |
| 11 | Entregar comment-to-DM gestionado al cliente | BLOQUEADO | Mismo bloqueo que 5b. No se vende lo que no se puede entregar en 30 dias. |
| 12 | Pautar para el cliente | BLOQUEADO | Cuenta publicitaria ONIA activa SIN metodo de pago. Dueno del bloqueo: Sergio. |

### Carril Nuvia (tienda propia)

| # | Tramo | Estado | Detalle |
|---|---|---|---|
| 1 | Storefront online | CORRE | `nuvia-store.vercel.app/nuvia` responde 200. 315 productos con precio e imagen. |
| 2 | Stock fisico | BLOQUEADO | [FALTA DATO] Unidades reales en mano. Lo unico documentado es un aporte de Arthur de Bs 300 para el lote 001. 315 es el catalogo scrapeado de hbderm, no inventario. |
| 3 | Margen real | BLOQUEADO | El CSV implica COGS de 10% del precio de referencia. Un distribuidor que venda ISDIN al 10% del retail no existe. Necesita UNA factura real de compra antes de que cualquier plan diga "hay margen para pauta". |
| 4 | Checkout | MANUAL | Termina en WhatsApp al numero **59175470140, que es el de ONIA, marcado provisional**. No hay operador dedicado. |
| 5 | Cobro online (BNB QR) | BLOQUEADO | Construido y apagado: schema, providers y endpoint existen; falta credencial BNB y el worker de polling. Es exactamente el antipatron "construido y apagado" del CLAUDE.md. |
| 6 | Registro sanitario / distribuidor autorizado | BLOQUEADO | [FALTA DATO] Si los productos tienen registro sanitario en Bolivia y a nombre de quien. Publicitar fuerte "productos importados" sube el perfil justo donde no hay defensa. |
| 7 | Pauta | BLOQUEADO | Cuenta sin metodo de pago. |

**Conclusion del circuito:** el carril B2B tiene un solo tramo bloqueado que impide operar (el 3, publicacion), y ese se resuelve publicando a mano. El carril Nuvia tiene cuatro bloqueos duros, dos de ellos son plata (stock, margen) y uno es legal (registro sanitario).

---

## 4. Los creativos concretos

### 4.A Para un CLIENTE de e-commerce (dueno de tienda) - PRODUCIR YA

Estos son el carril activo. Cero gasto, cero token, cero pauta. Se publican a mano.

**Pieza 1 - Carrusel "Tu catalogo esta roto y estas pagando por mostrarlo"** (6 slides, 1080x1350)

- Slide 1 (hook, texto en pantalla): `Este anuncio esta corriendo AHORA y dice: {{product.name}}`
- Slide 2: `No es un error de diseno. Es el feed del catalogo sin conectar. Meta muestra el codigo en vez del producto.`
- Slide 3: `Encontre 3 tiendas asi en 20 minutos. Todas pagando pauta.` (screenshots tapados)
- Slide 4: `Como se revisa en 2 minutos: Commerce Manager - Catalogos - Diagnostico.`
- Slide 5: `Los 4 campos que siempre fallan: title, availability, price, image_link.`
- Slide 6 (CTA unica): `Comenta CATALOGO y te digo si el tuyo esta bien. Gratis, sin vueltas.`

Valor completo adentro. Es el patron @nocodealex y aca SI corresponde, porque lo que se vende no es la informacion, es que alguien lo haga por vos.

**Pieza 2 - Reel 20 segundos "El typo de Bs 300"**

- Hook, segundo 0 al 3, texto quemado: `Este anuncio dice ENVIO RATIS. Lleva semanas corriendo.`
- Cuerpo: pantalla grabada de la Ad Library, dedo senalando.
- Cierre: `Nadie lo reviso porque nadie lo mira. Comenta AUDITORIA.`

**Pieza 3 - Reel "No sabes de donde viene tu venta"**

- Hook: `Vendes por WhatsApp y no sabes de que anuncio vino nadie.`
- Cuerpo: captura del panel de Onia mostrando el lead con su `?src=` y la reunion agendada sola.
- Cierre: `Un link distinto por anuncio. Comenta LINK.`

Esta es la unica pieza que muestra producto propio funcionando. Es la mas honesta que tiene Onia hoy: el circuito existe y esta probado.

**Pieza 4 - Carrusel de precio ancla** (contradice deliberadamente la regla "precio despues de prueba social", ver seccion 7)

- Slide 1: `Tienda online con catalogo, carrito y pedido por WhatsApp: Bs 1.500.`
- Slide 2 a 5: que incluye, que no incluye (dominio y hosting a nombre del cliente), tiempo de entrega [FALTA DATO: comprometer un numero de dias antes de publicar].
- Slide 6: `Comenta TIENDA.`

**Regla de produccion para las 4:** un solo pedido por pieza. Subtitulos quemados siempre (85% del video se ve sin sonido, dato de Meta). 9:16 con elementos en zona segura (Meta reporta 34,5% menor costo por resultado). El precio va en el copy editable, nunca renderizado en el arte, por la devaluacion y porque un anuncio corriendo 3 semanas no se puede editar sin re-renderizar.

### 4.B Para NUVIA propia - PRODUCIR SOLO SI SE LEVANTA EL GATE

No publicar ni pedir comentarios hacia Nuvia hasta que existan las tres cosas: (a) alguien que responde el WhatsApp, (b) stock contado en unidades, (c) un camino de cobro encendido. Mandar trafico hoy es destructivo, no neutro.

Cuando se levante, este es el orden por retorno:

**Pieza N1 - Unboxing de legitimidad (celular, cero creditos)**
- Hook: `Como se si el ISDIN que compraste es original.`
- Cuerpo: caja real, lote, sello, frasco. Foto nitida del envase.
- Cierre: un producto, un precio, un WhatsApp.
- Condicion: requiere producto fisico en mano. Si el stock es menor a 20 unidades, el modelo real es dropship contra pedido y este creativo no se puede sostener.

**Pieza N2 - Problema-solucion, gancho generado, cuerpo real**
- Hook (5 variantes generadas, 0,12 creditos cada una): `La marca del acne de la semana pasada.` / `Compraste protector y te dejo la cara blanca.` / `Tu piel no es grasa, esta deshidratada.`
- Cuerpo: metraje real del producto, identico en las 5. Es exactamente lo que Meta recomienda iterar: cambiar solo los primeros 3 segundos.

**Pieza N3 - Carrusel de rutina** (6 slides): resultado, friccion, producto, por que ese, prueba social de clienta real, precio. Precio despues de la prueba, porque en importado caro el precio es objecion y no gancho.

**Prohibido en Nuvia:** antes/despues generado con IA. Es el creativo de mayor riesgo que Onia podria producir y es justo el que mas convierte en la categoria. Solo con clientas reales y consentimiento escrito.

---

## 5. Lucia y Mara: presentadoras declaradas, nunca testigos

**La regla, en una linea:** Lucia y Mara pueden mostrar, sostener, senalar, narrar y demostrar. No pueden haber usado nada.

| Permitido | Prohibido |
|---|---|
| "Esto es X, cuesta Y, viene en Z." | "Lo probe." |
| Anfitriona de la marca, voz de la tienda. | "Me funciono." |
| Presentar un catalogo, un precio, una promo. | "Mi piel cambio." |
| Aparecer con el producto en un still. | Cualquier antes/despues sobre su cara. |
| | Resenas, calificaciones, "mi favorito". |

**Por que, con la norma que SI aplica:** una persona generada no puede haber tenido una experiencia. Cualquier afirmacion en primera persona es un testimonio falso, y declarar que es IA no lo arregla: la declaracion cubre la identidad, no la experiencia inventada.

La justificacion legal correcta para Bolivia es:
1. **Politicas publicitarias de Meta**, que se aplican globalmente y se castigan con restriccion de activos. Este es el riesgo real y concreto.
2. **Ley 453 de Bolivia** (derechos de usuarias, usuarios y consumidores), que sanciona la publicidad enganosa. [FALTA DATO] verificar el articulo exacto antes de citarlo a un cliente.

La FTC de EEUU, el proyecto de Nueva York y el EU AI Act **no aplican** a un anuncio boliviano de una empresa boliviana a consumidores bolivianos. Citarlos en una propuesta es un riesgo de credibilidad: el primer cliente que lo chequee tira abajo todo el asesoramiento. Se mencionan solo si el cliente vende a la UE.

**Etiquetado:** declarado abierto y siempre. "Modelo IA de Onia" visible en el creativo o en la primera linea del caption. No es una eleccion de estilo: Meta ya etiqueta contenido IA por deteccion automatica, y si la etiqueta aparece sola despues de que el creativo simulo ser una persona real, el dano es peor que haberlo declarado.

**El riesgo esta mal asignado y hay que decirlo:** el estudio de Northeastern (n=255) muestra que cuando el producto decepciona, la marca carga el 100% de la afirmacion, porque nadie le atribuye agencia a la IA. Onia se posiciona como la agencia de IA. Si Lucia afirma algo que no se sostiene sobre un serum, quien queda como "la agencia que fabrica afirmaciones falsas" es exactamente quien vende automatizacion con IA. Esto no es riesgo del creativo, es riesgo de la propuesta de valor central.

**Regla de gasto:** los creditos van solo al gancho. Stills de Lucia o Mara a 0,12 creditos, cuerpo grabado con celular, subtitulos quemados. El video generado es lo caro y no hay evidencia independiente de que el UGC con IA convierta mejor que el real. La ventaja verificable es que es mas barato por test, y esa alcanza.

Prohibido el Soul de Sergio. Decision del dueno, cerrada.

---

## 6. Que se hace HOY sin gastar, y que necesita desbloqueo

### Hoy, cero peso, cero tramite

1. Publicar las 4 piezas B2B de la seccion 4.A, a mano, desde la cuenta que ya existe.
2. Responder cada comentario a mano con `wa.me` + `?src=` distinto por pieza. A volumen actual (comentarios cercanos a cero) el ahorro de automatizar es de minutos por semana. Automatizar un pipeline sin caudal es optimizacion prematura.
3. Prospeccion con evidencia: seguir barriendo la Ad Library por feeds rotos y typos. Un screenshot es la propuesta. Cero pauta, cero token, cero modelo IA.
4. Contar el stock fisico real de Nuvia en unidades.
5. Conseguir una factura de compra a hbderm y recalcular el margen real.
6. Medir permanencia, no volumen: tomar 15 paginas bolivianas con moneda BOB y mirar hace cuanto corren ads. Anunciantes que sostienen pauta 90 dias significa que el canal paga en Bolivia. Si casi ninguno pasa de 30 dias, el "hueco" es un cementerio y la pauta local no va.
7. Verificar el bloqueo exacto del token de IG. Este es el dato mas decisivo de todo el paquete y sigue sin resolverse: si el bloqueo es Business Verification, una herramienta tipo ManyChat lo esquiva porque usa su app ya aprobada; si el bloqueo es que no hay cuenta profesional con acceso admin OAuth, ninguna herramienta funciona.

### Necesita desbloqueo del dueno (Sergio)

| Desbloqueo | Que destraba | Prioridad |
|---|---|---|
| Metodo de pago valido en la cuenta publicitaria ONIA | Toda la pauta, propia y de clientes | 1 |
| Business Verification de Meta (depende de SEPREC) | Token de IG, App Review, comment-to-DM automatico, y el servicio gestionado vendible | 1 |
| Factura de compra a hbderm | Decide si Nuvia tiene margen para existir | 2 |
| Registro sanitario / estatus de distribuidor | Decide si Nuvia se puede publicitar sin abrir un frente legal | 2 |
| Operador que responde el WhatsApp de Nuvia | Levanta el gate de trafico a Nuvia | 3 |
| Credencial BNB + worker de polling | Enciende el cobro online que ya esta construido | 3 |

Los dos primeros son la ruta critica de los dos frentes a la vez. Son aburridos y no los resuelve codigo.

---

## 7. Riesgos

**R1. Concentracion total de activos en una identidad Meta a medio bloquear.** Es el riesgo mas grande y no lo menciono ninguna de las investigaciones. Todo cuelga del mismo objeto: BM OniaAgency, pagina "Onia", cuenta IG, cuenta publicitaria. Sobre eso se proponia montar al mismo tiempo creativos con personas generadas por IA, una app nueva pidiendo Advanced Access, y un motor automatizado de mensajes, sobre un negocio sin verificacion y sin metodo de pago. Ese es el perfil que los sistemas automaticos de Meta tratan como sospechoso. Si se restringe, no se pierde Nuvia: se pierde el servicio que Onia quiere vender, el circuito de atribucion y la via de captacion. Es el unico activo del stack que no se reconstruye con codigo. **Mitigacion: nada de automatizacion de mensajes ni volumen de creativos IA hasta cerrar Business Verification.**

**R2. El plan reintroduce el costo que congelo Nuvia.** La decision escrita congela Nuvia porque consume las horas de Sergio. Comment-to-DM produce DMs, los DMs en un mercado chat-first los cierra un humano, ese humano es Sergio. Contradiccion directa con una decision documentada. **Mitigacion: el carril activo es B2B, donde cada conversacion vale mucho mas por hora.**

**R3. ManyChat Free tiene un modo de falla publico.** Si el reel no pega, no llegas a 25 contactos y no validaste nada. Si pega, revientas el limite el primer dia y los DMs dejan de salir en silencio, mientras la promesa sigue escrita bajo el post. El resultado es un hilo de gente diciendo "no me llego nada", que es peor que no haber publicado. **Mitigacion: responder a mano. No hay limite de contactos en responder a mano.**

**R4. Pago contra entrega recomendado sin dueno de logistica.** Contraentrega significa que alguien va, entrega y cobra efectivo. Onia no tiene repartidor, ni proceso de caja, ni politica de rechazo. Cada rechazo se come el flete. No recomendarlo hasta que exista el operador.

**R5. Precio quemado en el arte + devaluacion.** Con el USD de 6,96 a 11,37 y un proveedor cuyo precio se mueve (existe un script que lo vigila), un precio renderizado dentro de un anuncio que corre 3 semanas es un pasivo. Precio en el copy editable o con vigencia explicita.

**R6. Contradiccion no resuelta sobre donde va el precio.** Una investigacion dice "precio despues de la prueba social" (razonamiento, sin dato). La otra encontro que en LatAm el precio ancla ES el hook, con una pagina corriendo 12 ads con el precio en el titulo. **Resolucion adoptada: si el precio es tu arma, va primero (caso Bs 1.500 de la tienda). Si el precio es tu objecion, va despues de la prueba (caso serum importado a Bs 200).** No es una regla universal, es una regla por caso.

**R7. Evidencia mal usada, dos casos.** El estudio de Metricool (caida de 45,98% en engagement de imagen unica) es de organico y no se puede usar para decidir formato de pauta, que vive en subasta y no en ranking de feed. Y el "9x guardados construye audiencia de retargeting" es falso operativamente: los guardados no son un evento targeteable, y armar audiencia de interaccion requiere una cuenta publicitaria con metodo de pago, que no existe hoy. Ninguno de los dos entra en una propuesta.

**R8. "Cero de 325 ads usan comment-to-DM" no es evidencia de ausencia.** El CTA vive en el audio y el texto en pantalla del video, campos que esa busqueda no lee. Hipotesis alternativa que hay que aceptar: nadie lo pautea porque Meta no optimiza por comentarios y el objetivo Interaccion es el mas barato y peor calificado. Puede que no funcione pagado, no que nadie se dio cuenta.

**R9. Alto engagement no es senal buena.** El reel de @buildercult tiene 520 likes y 156 comentarios, un ratio altisimo, y buena parte de esos comentarios es la audiencia discutiendo si el caso es honesto. El equivalente en e-commerce es mostrar un resultado que el comprador no puede alcanzar con lo que le vendes.

**R10. Mercado alcanzable sin dimensionar.** [FALTA DATO] Cuantos compradores hay en Bolivia para dermocosmetica importada a Bs 200 la unidad, y cuanto vale ese mercado comparado con vender un SaaS. Sin eso, todo Nuvia es tactica sin tesis.

---

## 8. La decision

**No se traslada la mecanica de los 3 reels al e-commerce de producto. Se traslada al carril B2B, y se enciende esta semana en su version manual.**

Las razones, sin lavarse las manos:

1. **Los 3 reels no son casos de e-commerce.** Son lead-gen B2B para herramientas y servicios, dirigidos a marketers y builders, con un activo digital de marginal cero como payoff. Vender serum con esa estructura es forzar la analogia.

2. **El hallazgo de verdad valioso del paquete no es de e-commerce:** nadie en la pauta hispana le habla al dueno de la tienda, y Juanimporta corre 6 ads activos vendiendole formacion a ese mismo dueno. Eso valida el comprador A que Onia ya tiene mapeado. Es un hallazgo de captacion B2B disfrazado de hallazgo de e-commerce.

3. **La version manual no tiene bloqueos.** Publicar a mano y responder comentarios a mano con `wa.me` + `?src=` usa el circuito de atribucion que ya esta vivo y probado, no necesita token, no necesita App Review, no necesita metodo de pago, y no cuesta nada. A volumen cero de comentarios, automatizar seria construir un pipeline sin caudal.

**Nuvia queda PARQUEADA.** No se le manda trafico, no se pauta, no se pide comentarios hacia ella. Se sigue usando como screenshot de venta, que es exactamente para lo que ya esta aprobada. **Gatillo de despertar (las cuatro, no tres):** stock contado en unidades, factura real que confirme margen, registro sanitario verificado, y operador que responde el WhatsApp con numero propio de Nuvia y no el de ONIA.

**El comment-to-DM automatizado queda PARQUEADO con gatillo:** Business Verification de Meta aprobada. Recien ahi se evalua si migrar a n8n propio, que es ademas el unico camino si Onia quiere venderlo como servicio gestionado. Antes de eso, venderlo a un cliente es cobrar un setup que no se puede entregar en 30 dias, o sea un reembolso disfrazado de ingreso.

**El objetivo unico de esta semana es desbloquear dos tramites:** metodo de pago en la cuenta publicitaria, y verificacion de negocio Meta. Sin eso, cualquier banco de creativos que se produzca es inventario muerto, que es literalmente el antipatron "construido y apagado" que el CLAUDE.md prohibe por escrito.

**Hipotesis de ingreso, para que esto no sea un hobby.** Ninguna investigacion escribio una y sin eso nada de esto se puede juzgar. La que propongo, y es [SUPUESTO] entero porque no hay historico de conversion del canal:

> 4 piezas B2B publicadas esta semana. Meta de caudal: 20 comentarios acumulados en 14 dias. Meta de conversion: 3 conversaciones por WhatsApp con dueno de tienda real, 1 reunion agendada por Cal.com. Si a los 14 dias los comentarios son menos de 5, el canal organico no tiene caudal para Onia y se abandona sin gastar mas horas. Si hay reunion, se sostiene y se escala recien cuando la pauta este desbloqueada.

Ese numero de corte es lo que separa un experimento de una excusa para producir contenido.