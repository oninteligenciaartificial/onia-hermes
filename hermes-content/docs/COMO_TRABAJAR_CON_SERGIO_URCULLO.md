# Cómo trabajar con Sergio Urcullo (borrador para la nube)

Lo que la memoria de la sesión madre sabe y el repo no dice. Complementa CLAUDE.md y AGENTS.md, no los repite. Todas las fechas son de 2026. Si dos reglas chocan, gana la más nueva. "(sin confirmar)" marca lo que falta validar con él. Los secretos, ids de cuentas y datos personales no están acá a propósito.


## 0. Si te falta algo, pedíselo a la madre (17-oct)
- Si te falta una skill, un archivo de la PC (videos, documentos), un acceso, una referencia o un ejemplo para aprender, NO lo inventes ni trabajes sin eso: escribí en tu hilo «PC: necesito <qué> para <tarea del molde>». La jefa se lo pasa a la madre en ese turno.
- La madre lo resuelve (sube la skill, copia el archivo a /mnt/project-files, da el acceso) y lo deja cargado para el próximo arranque. Mientras tanto, seguí con otra tarea de tu cola.
- **Permisos que tiene que aceptar él (17-oct):** antes de una acción que va a pedir su aprobación (escribir la llave del VPS, un comando que el control de permisos frena), escribí primero en tu hilo «⏳ Sergio Urcullo: te voy a pedir permiso para <qué>. Aceptalo acá». La jefa, cada vez que despierta, revisa si algún hilo está esperando un permiso y le avisa en el chat del proyecto: «⏳ <hilo> te espera para aceptar <qué>», con el enlace al hilo. Un hilo nunca queda parado esperando un permiso que él no vio (el 17-oct uno estuvo parado una hora).
- Al cerrar cada tarea, anotá en /mnt/project-files/estado/<frente>-faltantes.md qué te faltó para hacerlo mejor. La madre lo revisa y lo suma.

## 1. Cómo hablarle y pedirle decisiones

- **Mensajes cortos: máximo 3 bloques.** Qué pasó, qué se necesita de él (sí o no, o pasos numerados), qué sigue. El método, las hipótesis y las fuentes van al handoff o a la skill. (8-oct: "me entregas demasiado texto y me pierdo")
- **Decir qué hacer, no por qué.** Pasos con verbo, dónde y qué debe ver. Separar lo que hace la sesión de lo que hace él: en su lista va solo lo suyo. (13-ago)
- **Las decisiones se muestran en la caja final o con AskUserQuestion**, nunca en texto de mitad de turno: la app lo colapsa y él no lo ve. Nunca preguntar "¿responde la lista?" sin la lista al lado. (17-oct)
- **Pedir una revisión = captura literal + link directo + la línea exacta que debe escribir.** Nunca "revisá tal cosa". Videos: 2 o 3 frames y el pie. Pantallas: Playwright headless. (10-oct)
- **Lo técnico no se le pregunta ni se le cuenta** ("solo hago vibe coding"). Código, merges, revisiones, configuración, migraciones con backup y herramientas se deciden y se publican si pasan sus gates. Lo visual y lo serio sí pasan por él (lista en el grupo 6). (17-oct)
- **Lo que hay que pedirle a él va en UNA sola lista**, no de a una. (3-sep: "no me preguntes a cada rato, ponete en marcha")
- **No preguntar lo que se puede razonar o verificar.** Solo se pregunta una decisión de negocio cara e irreversible (ej. cambiar una numeración que rompe datos de clientes). Lo técnico se decide y se anota "DECISIÓN, fecha". (jul y 3-sep)
- **Criterio propio, no solo obedecer.** Evaluar sus ideas, investigar en fuentes confiables, traer opciones que él no mencionó, contradecir con evidencia. Pero el extra se declara como opinión ANTES, no se cuela como trabajo hecho. (22-jul y 26-jul)
- **Hacer exactamente lo pedido.** "Una opción más de logo" es una opción, no un menú ni un rediseño de marca. El nombre es Onia y no se reabre ni se proponen alternativos. Nada folclórico ni regional en la marca. (26-jul)
- **Siempre la mejor opción, con 3 alternativas y su costo al lado.** Orden: ¿ya lo tenemos apagado?, ¿open source autohospedable?, ¿tier gratis o por uso?, recién ahí suscripción fija. (8-ago: se le recomendó la más cara sin barrer lo gratis)
- **Primero lo que el cliente ve y toca**, después lo interno: 1) lo que ve el visitante, 2) entrar y pagar, 3) lo de todos los días, 4) back office. Un documento no es un entregable salvo que lo pida. Un pedido de diseño es requisito hasta verlo cumplido en pantalla. (10-ago: "estás construyendo cosas inútiles")
- **El objetivo es llegar antes, no terminar.** "Hecho" = módulo con su prueba visible y desplegado. No apilar features ni docs sobre una base que no agenda una cita. Contestar leads antes de construir más. (3-sep)
- **La 1.0 usable es el objetivo; el defecto del día es solo un paso.** Usable = un dueño boliviano se registra solo y llega a cobrar sin ayuda, en su rubro. (4-sep)
- **Responder en español**; código, nombres y commits en inglés. (ago)
- **Comandos para que los corra él: PowerShell**, nunca bash (`Remove-Item`, `;` en vez de `&&`). Si destruye, avisar que no se deshace. (29-sep: `rm -rf` falló en su terminal)
- **Horas en La Paz (UTC-4)**, con el UTC al lado si importa. Ojo con el cambio de día. En crons no se resta nada. (31-ago)
- **Créditos de plataformas prepagas se reportan en créditos y saldo**, nunca en bolivianos. (26-jul)
- **Dicta por voz: un nombre raro puede venir mal transcrito.** "Pixel" o "Hisfield" es Higgsfield. Buscar la variante fonética antes de elegir otra herramienta. (29-sep)
- **El canario "Sergio Urcullo" no lo deroga un modo de estilo.** Si hay un modo comprimido activo, revisar a mano que el nombre no se caiga. (5-sep: se cayó por el modo)
- **Arthur ya no colabora con Onia.** No proponerlo como ejecutor de contenido, cierre ni coordinación. (23-ago)

## 2. Contenido y marca personal

- **Link o reel sin instrucción = para APRENDER.** Se hace la ficha (mensaje, tema, edición) en `hermes-content/references/video-intake/`, lo aprendido va a la skill y una buena idea al banco de ideas. No se produce nada salvo que diga "hacé uno así". (9-oct: se produjo un carrusel que no pidió)
- **De cada contenido que manda se analizan tres cosas, mirando el video entero:** el mensaje, el tema y la edición (ritmo de corte, subtítulos, transiciones, b-roll, sonido, primeros 3 s). (3-oct)
- **Guiones con ejemplos REALES de Onia** (hook, skill, bot, loops, editor, errores reales), nunca negocios inventados. Probar la premisa antes de escribir. Cero disclaimers a cámara ("todavía no ejecutamos la prueba"). Cifras verificadas el mismo día en fuente primaria. No repetir el tema entre piezas. (28-sep: rechazó tandas enteras por "vacías")
- **Él solo habla, la IA edita.** Meta: mínimo 10 piezas por día, 1 hora de grabación. Referentes: Santiago Muñoz, Enrique Rocha, Erik Taveras, Ian Lee, Tiago Lemos, Carlos Domínguez. El cierre manda a la comunidad de WhatsApp o a la web /claude-code. (28-sep y 30-ago)
- **Estructura diaria:** feed 3 (pilar, b-roll o carrusel, video normal), Trial 4 (los 3 del feed ya escritos más 1 yap), Trial v2 3 a 5 a cámara con casi cero edición. Lo NUEVO por día son 5 a 7 piezas, no 10 a 13. (17 y 18-sep)
- **"Trial" no es una categoría con guiones propios.** "Los dos trials" son las dos cuentas, no dos guiones. Ya se inventó una categoría así y lo corrigió. (18-sep)
- **YouTube es DIARIO**, no semanal. Los largos se graban en lote. (17-sep)
- **El titular de una pieza es el NOMBRE CONCRETO** (el repo, la herramienta, la función), nunca la categoría ("Lo oficial", "Las empresas"). Cada lámina MUESTRA el mecanismo: terminal antes y después, diagrama, logo oficial grande. Le corrigió esto 4 veces el 7 y el 17-sep: "se ve muy simple".
- **Cada carrusel enseña una noticia** (fuente oficial releída ese día), **una función** (con el prompt o paso literal para copiar) **o una app.** Una tesis suelta no es una pieza. Todo cierra con la lámina de presentación ("Soy Sergio Urcullo…") con su foto real. (17-sep)
- **Logos siempre oficiales, jamás generados**, y solo cuando la marca se nombra en el audio. Un logo flotando sin razón se rechaza. (17-sep)
- **"Muy IA" es rechazo.** Imágenes reales, cada elemento atado a lo que se dice, ante la duda menos elementos pero todos con sentido. Itálica serif en titulares grandes: descartada. (17-sep)
- **Estilo de imagen de la marca personal (8-oct): foto editorial en blanco y negro con UN objeto en verde esmeralda.** Reemplaza a la arcilla. Se genera con GPT Image 2.5 (Soul 2.0 mete letras inventadas). Paleta de contenido: verde de Onia, blanco y negro, no crema. La serie Claude Code de septiembre usó crema y naranja: eso quedó superado.
- **Las imágenes de contenido se generan con Higgsfield** y se guardan en la galería única `hermes-content/galeria/`. Pexels o Unsplash solo para foto real con licencia. (29-sep)
- **Sin música de cama: la pone Sergio.** Se entrega voz más SFX. (18-sep)
- **UN subagente por pieza, con el pipeline completo** (comp, karaoke, sfx, master, QA mirando frames, editado/). Dejar un video a medias fue el reproche que originó esto. (18-sep)
- **Miniatura de YouTube:** el frame de la cara se BUSCA puntuando todo el material a cámara y se le muestra la hoja de contactos (el puntaje ordena, no decide). Boca cerrada. Mirarla a 210 px de ancho. Referencia visual: Adrián Sáenz. (8-sep: tres rondas fallidas)
- **No reinventar el motor de video.** Un componente roto (la transcripción en Windows) no condena la herramienta entera: probar el resto antes de descartar. (26-jul; ubicación de las skills de HyperFrames: ver CLAUDE.md, que es más nuevo)
- **La web personal se publica desde `hermes-content/sitio-sergiourcullo/`.** Nunca editar el repo "buzón" de despliegue: el próximo publish lo borra. La llamada 1 a 1 enlaza `/llamada` (un redirect propio al evento de 20 min). (14 al 19-sep)
- **La regla de "usted" es solo para clientes de Onia.** No aplica al contenido de su marca personal; con él, en el chat, se sigue en voseo. (3-oct)

## 3. Lucía e Higgsfield

- **Lucía NO se pausa ni se congela.** Es el aprendizaje de Higgsfield y una cuenta para facturar después. No proponerlo en planes ni auditorías. (10-oct)
- **"Es IA" no se esconde:** etiqueta "creado con IA" obligatoria. Lucía presenta y demuestra, NUNCA testimonia ("yo uso X"): sería un testimonio falso. (9 y 25-jul)
- **Cero granjas de celulares, cuentas creadas por automatización, bots de engagement o modelos que se siguen entre sí.** Cada modelo con guion, ángulo y nicho propio: la misma plantilla con otra cara se deja de distribuir. (25-jul)
- **Nunca generar con los Souls de Sergio** (6-ago: "es horrible"). Su marca personal es su cara REAL grabada. Subir su cara o su voz a un servicio externo pide además el OK de Leslie Mercado (titular SEPREC). (8-oct)
- **Identidad de modelos:** Soul más texto por defecto; Reference Elements solo de último recurso. Verificar CADA frame de entrenamiento: un frame de otra persona contaminó el Soul de Lucía. Elegir por id exacto, nunca por nombre. Entrenar un Soul cuesta créditos y pide su sí. (6-jul)
- **Voz de Lucía: "Marcela" de ElevenLabs, sin voice_settings** (forzarlos le cambia el timbre). La voz de Higgsfield se descartó por robótica. (25-jul y 22-ago)
- **Ropa y marcas:** Soul no tiene prompt negativo y escribir "unbranded" AGREGA la idea de marca. Toda imagen con ropa se mira antes de usarla; las que traen logo inventado se descartan, no se retocan. (21-sep)
- **El job_type sale de `model list`, nunca de memoria ni de un doc** (`soul_2` no existe en la CLI; había 127 menciones falsas). El saldo se lee con `balance`, no se hereda: el plan es Pro con unos 580 créditos (21-sep), no Ultra. Pro admite 4 jobs concurrentes. (3 y 21-sep)
- **La sesión de la CLI en el VPS puede revocarse del lado del servidor.** Renovarla lo hace Sergio con un clic en Allow; la sesión no lo hace sola. (3-sep)
- **No tocar la suscripción de Higgsfield.** Se emitió un cobro anual no deseado (1-sep), el reclamo a soporte sigue sin respuesta confirmada. No existe control de downgrade y cancelar apaga los packs. Dejar rebotar el cobro no es salida.
- **Lotes chicos de imágenes (menos de unos 5 créditos, ej. pruebas de estilo) se generan sin preguntar**, cotizando con `generate cost` y avisando después con la lámina. Video, entrenar Soul, lotes grandes y publicar piden su sí. (8-oct)
- **Práctica de Lucía (sin confirmar, de segunda mano, 16-oct):** imagen de práctica con tope de 12 créditos, sin personas y sin salir a la red. NO se ejecuta sin OK hasta que Sergio Urcullo confirme esta regla: mientras tanto, toda generación de Lucía pide su OK con brief y costo. Toda pieza o plan de Lucía se muestra antes de subir.
- **Vigilar el token de Instagram de Lucía:** vencía entre el 13 y el 18-oct. (10-oct)

## 4. Ventas y pauta

- **El aprendizaje de ventas y pauta NUNCA se congela junto con el tooling** (FLUNA y el "anunciante supremo" son de las prioridades de Sergio). Si una skill sube, usar solo lo que no dependa de una API paga sin su permiso. (17-oct)
- **Add-ons decididos el 8-oct** (ESTRATEGIA §12): web (se potencia), IA local (Onia Box), campañas de Meta con IA, app móvil, pauta para influencers IA, consultorías (gratis por ahora). Todos detrás de la 1.0, ninguno en paralelo, cada uno pasa el test de 3 preguntas. Es más nuevo que lo que CLAUDE.md dice de la web: no re-proponer bajarla.
- **Web:** `/comparativa` salió, `/servicios/webs` se queda. (8-oct)
- **Competencia son IDEAS, no cosas para copiar.** El informe usa la sección "Ideas para evaluar": qué problema del cliente de Onia resuelve, con qué regla choca y su costo. Decide él. (29-sep)
- **Estudiar la web VIVA de HOY** (sitio, precios, app pública) o una cuenta de prueba, no guías ni tutoriales: están viejos. Cada dato con URL y fecha; si solo está en una guía, marcarlo "puede estar viejo". Las cuentas de competidores las crea Sergio sin cargar tarjeta (la sesión no crea cuentas de terceros). (29-sep)
- **Recordarle en una línea las cuentas de competencia pendientes:** Dentalink, AgendaPro, Rimay, Dentidesk, Odoo o Zoho, Nitro Pro, Kommo, Respond.io. Hechas: SendyPro y Doctocliq. (29-sep)
- **Contra Dapta no copiar "todo en un plan por créditos".** Tomar solo: cuenta única, agentes como capa transversal, empaque por industria, crédito como fair-use INTERNO, nunca como unidad de venta. (23-jul)
- **Onia vende software, nunca horas.** Un desarrollo dedicado se cotiza como proyecto pagado por adelantado más licencia, jamás por comisión ni por equity. Sociedad solo por earn-in con hitos. A una franquicia (ej. oficina C21) se le vende el módulo del producto, no un desarrollo a medida, con marca neutra. (ago)
- **Usted con clientes y prospectos**, nunca vos ni tú: bot de ventas, agentes de voz, plantillas de WhatsApp, mensajes 1 a 1, respuestas a la pauta. El bot todavía tiene voseo para barrer. La web y los anuncios usan voseo hoy: si pasan a usted lo decide él (se le preguntó el 3-oct). (3-oct)
- **Ninguna cuenta de la plataforma es real.** Todas son de prueba (24-sep). El criterio de cierre de ESTRATEGIA §11 está en 0 de 5 hasta que exista una org de cliente real. Cero prueba social fabricada.
- **La web no muestra capturas literales del sistema** ("se ve mal"): se dibuja el resultado, como hace Lety. El titular del hero "Un negocio abre 9 horas / Cerrás vos. El negocio no." no se toca. (1-sep)
- **Los agentes NO usan un LLM para decidir.** Reglas fijas más una plantilla que la IA escribe una vez y el dueño aprueba. Titular "Agentes con IA" se mantiene con la bajada: la IA escribe los mensajes, a quién y cuándo lo decide el sistema, y usted aprueba. Prepara un borrador en la cola de aprobación: ningún material dice que "avisa" o "cobra" solo. (24 y 28-sep)
- **Nombre del add-on: "Agente conversacional de WhatsApp".** (28-sep)
- **Chatbot: solo mensualidad, sin cobro de instalación**, y el cliente le paga a Meta directo con su propia tarjeta (Onia no revende mensajes). El precio sale de `pricing.ts`. No subirlo hasta que los recordatorios estén vivos y verificados. (21-ago)
- **Meta cobra cada mensaje de servicio desde el 1-oct.** La fuente oficial no muestra tramo gratis; el "1.000 gratis" es de blogs sin cita. No prometerlo. (28-sep)
- **Planes (17-sep):** Empresa se contrata y renueva por WhatsApp (no self-service). Coadministradores solo desde el plan Completo. Todo en un solo pago, sin add-on de admins. Diferenciar planes por FUNCIONES en vez de por tamaño es una dirección a analizar con la cuenta delante: no cambiar topes por inferencia.
- **Webs:** el precio sale solo de `webs.ts`. Landing y Profesional con precio publicado; Pro a medida, tienda y ecommerce se cierran en llamada. (17-sep)
- **Pitch de factura electrónica:** el SIN tiene un Portal Web GRATIS. Prohibido decir que la ley obliga a comprarnos. Nunca afirmar el grupo del prospecto (depende de su NIT). El diferenciador es no tener que re-tipear. Decir de frente si el emisor de Onia aún no está homologado. (25-jul)
- **Pasarelas:** Onia es facilitador, NUNCA agregador: la plata del cliente no pasa por Onia. "QR Simple con comisión 0" no está respaldado: prohibido prometerlo en propuestas hasta tenerlo del banco por escrito. No trasladar comisión como recargo. (24 y 30-jul)
- **Comentario de Instagram a DM NO está probado:** 0 DMs a un lead real, y un nodo con `neverError` ocultó los rechazos de Meta. No citarlo como vivo. Test pendiente de Sergio con otra cuenta. (27-ago)
- **WhatsApp:** pasadas 24 horas solo se escribe con plantilla aprobada. Los scripts `*-run.sh` del bot envían de verdad por defecto: ensayar primero. Los prospectos de agosto sin respuesta siguen siendo una deuda. (10 y 18-sep)
- **Meta Ads:** las campañas se crean siempre PAUSADAS y el cliente va en modo seco; activar o subir presupuesto exige el OK de Sergio. (5-jul)
- **Bolivian Electric es familia:** son partes vinculadas, todo se factura a valor de mercado y se documenta. Nada de traspasos informales. (6-ago)

## 5. Plataforma y producto

- **Todos los rubros, no solo dental.** Toda pantalla rediseñada se captura en al menos dos rubros (dental y comercio), con el vocabulario del rubro. El QA recorre los 5 y la comparación de competencia incluye rivales de comercio, estética, servicios e importadora. (29-sep)
- **Velocidad y que no se caiga son prioridad.** Presupuesto de peso por pantalla, animaciones solo con transform u opacity, TTFB y LCP medidos en producción. Todo vive en UN VPS: nada (CI, crons, n8n, agentes) puede quitarle memoria al producto ni a la base. Cada deploy con healthcheck, alerta y marcha atrás. Fuente: `ONIA_VELOCIDAD_Y_ESTABILIDAD.md`. (29-sep)
- **Panel:** una sección entra al menú solo cuando cierra su flujo de punta a punta. Barra lateral compacta, agrupada en secciones colapsables, estilo Hostinger. Criterios: funcional en producción, latencia medida (menos de 1 s entre pantallas, menos de 2 s crear una cita o factura), pensado para una recepcionista con el teléfono sonando (móvil primero), instalable. (3 y 18-sep)
- **Diseño del panel (29-sep):** verde de marca, tipografía Instrument Sans más IBM Plex Mono, ícono de la app verde con negro, agentes nombrados por lo que hacen ("Vuelve a citar", "Recuerda cobros"). La web usa Archivo según CLAUDE.md (2-oct), más nuevo que el plan de alinearla.
- **UI "que no parezca IA":** rótulos mono, una sola hoja protagonista por pantalla, nunca copiar a mano la clase de una tarjeta (usar la primitiva). Las reglas viven en `DESIGN.md` y la skill `onia-frontend`. (17-sep)
- **Permisos y cierres (29-sep):** crear citas pide agenda.write; el empleado de mostrador carga productos y ajusta stock pero cambiar precio o costo pide finance.write; el WhatsApp del cliente es obligatorio en cotizaciones; "Clientes" con editar y dar de baja en los 5 rubros, porque la política de privacidad lo promete.
- **Todo desarrollo es específico de Bolivia:** contaduría boliviana vigente a la fecha del build, ley citada, investigar antes de codear. No citar un tipo de cambio de memoria: se consulta (Aduana y SIN usan tipos distintos). Onia hace planificación fiscal legítima, nunca evasión, y el régimen lo valida un contador matriculado. (jul)
- **Facturación: nada manual** por el Portal del SIN. "SIN: no llamar", seguir con el SIAT por el camino técnico. Las cifras de avance del emisor se leen del portal, no de la memoria (el 27-ago se corrigió un "Fase 1 completa" falso). (25-sep)
- **Hay DOS cosas llamadas Hermes:** `onia-hermes` es el repo; Hermes Agent es un producto de NousResearch instalado en el VPS, no es nuestro. Bajar su modelo global apaga jobs. (17-sep)
- **ONIA Center (center.onia.com.bo) está abandonado como producto** (31-ago), pero su contenedor aloja el motor del bot: no apagarlo ni construir sobre él.
- **El canal del chatbot es Chatwoot (no Telegram)** con Embedded Signup nativo; el rebrand a "Onia" no es viable (un job diario restaura el branding). El conocimiento del bot (`knowledge.json`) NO se publica solo en un deploy: hay que copiarlo a mano y confirmarlo en `/health`. (ago y 8-sep)
- **El DNS de `onia.com.bo` es Cloudflare, no Vercel** (la zona de Vercel es un fantasma). **La web `onia.com.bo` la sirve un contenedor del VPS: pushear a main no publica nada**, hay que buildear en el VPS y hacer el swap. El correo sale por Postfix y entra por Cloudflare Email Routing; Google Workspace ya no recibe. (15 y 21-ago)
- **Automatizaciones autónomas:** nada que dependa de servicios locales o endpoints propios frágiles; credenciales por n8n, nunca hardcodeadas. (jul)
- **Un rubro/valor no se anuncia si no funciona en producción:** el rubro ganadero promete offline y no lo tiene. (13-ago)

## 6. Publicar y gasto

- **Quién decide qué (17-oct, manda sobre la sección "Qué se publica sin preguntar" de CLAUDE.md):** Sergio decide lo VISUAL (diseño nuevo, rediseño de algo vivo, piezas de contenido, su cara o su voz) y lo SERIO (textos legales, precios, gasto, contacto con clientes o terceros, datos reales de producción, borrado sin copia, SIAT y banco). Todo lo técnico se publica sin preguntarle cuando pasa sus gates.
- **Mostrar ANTES de subir o generar lo que se ve afuera** (Lucía, carruseles, historias, reels, pantallas nuevas): antes de GENERAR, el brief y el costo con su OK; antes de SUBIR o publicar, la captura o el video REAL ya renderizado (nunca dibujado) más el archivo. Las sesiones de la nube dejan la pieza renderizada en su rama y no publican piezas nuevas sin que la madre la haya mostrado. (10-oct)
- **Sin confirmar:** si además de mostrar hay que esperar su OK. Hasta que conteste, esperar el OK para Lucía y contenido nuevo. Los arreglos de código siguen CLAUDE.md.
- **Reemplazadas por las dos de arriba:** "contenido que pasa control de calidad se publica sin OK pieza por pieza" (8-oct) y "todo lo revisado se sube, incluso diseño" (9-oct).
- **Actos legales, firmas y registros (contratos, SIN, SEPREC, aduana, banco, firma digital): los firma Leslie Mercado (titular SEPREC).** Nunca proponer que Sergio firme o sea apoderado. Antes de abrir cuentas nuevas a nombre de alguien, preferir lo que se migra fácil. (6-ago)
- **El control de permisos de la sesión manda: si frena algo, no se rodea.** Se le pide a él UNA línea específica (qué, dónde, cuándo), sin explicarle el proceso. Un permiso dado en una sesión no vale en otra: se pide escrito en la sesión que actúa. (10 y 11-oct)
- **Nada pago sin permiso.** Tener el MCP conectado no es permiso. Modelos baratos por defecto, y para trabajo creativo presentar primero qué, con qué modelo y cuánto cuesta. (5-jul)
- **Ante un techo (cupo, tope, cuota) la primera opción es BAJAR el consumo, no subir el techo.** Atribuir el gasto antes de cortar (en Hermes un solo trabajo era el 74 %). Pausar, no borrar. Un trabajo que solo manda Telegram es candidato a apagar. Los mensajes sin sentido a su Telegram SON el gasto. (8-sep)
- **Compras físicas: DIRECTO de fábrica**, nunca a distribuidor. Verificar que sea fábrica real: licencia con alcance de manufactura, certificado CE o TUV a nombre de la fábrica, tour de planta. (6-ago)
- **Circuito de publicación en redes (29-sep):** Instagram por el script del VPS (no agenda: la hora la pone un timer); TikTok, Shorts y LinkedIn por Buffer gratis; YouTube largo manual. Las apps propias de YouTube o TikTok sin auditoría solo publican en privado. Postiz está apagado y no se levanta (publicó 5 posts sin OK). Los brutos de Sergio viven fuera del repo.
- **Nunca auto-publicar una cara IA.** Publicar contenido con cara de Lucía o de Sergio siempre pasa por él. (jul)
- **Impuestos propios de Onia:** pedir factura al NIT de Onia por cada gasto. Los pagos al exterior (Claude, Higgsfield, ElevenLabs) llevan IUE-BE y lo valida el contador matriculado. (10-jul)

## 7. Verificar

- **Leer la consigna LITERAL antes de contestar.** Un formulario que pide 3 cosas lleva 3 partes visibles. Un filtro que devuelve vacío NO prueba ausencia: primero el listado completo. Antes de declarar algo "caído", comparar con un control ajeno. (15-ago)
- **Antes de decir "no existe":** consultar primero el doc o catálogo propio; verificar con el listado COMPLETO sin filtro, no con `search`. Un nombre propio se busca solo y entre comillas, con variantes (rn y m, s z c, b v, separado o junto) y el dominio directo. Decir qué variantes se probaron. (7-jul y 8-ago)
- **Antes de diseñar o construir en un carril, buscar su doc:** `grep -ril <tema> hermes-content/docs hermes-content/research` (recursivo: incluye `hermes-content/docs/research/` y `hermes-content/research/`). Si existe, se cita y se corrige, no se reescribe al lado. Encendido no es hecho: comprobar que un cron del proveedor no lo revierta. (16-ago)
- **Un comando que se escribe en un prompt o regla se corre ENTERO tal como queda, y se mide el ESTADO resultante** (no el exit code). La nota dice "medido con X, dio Y", nunca "verificado". Vale también para rutas, nombres de modelo y flags. (3-sep)
- **Una ejecución verde no prueba que el efecto ocurrió.** Un nodo con `neverError` deja un rechazo como "success". Confirmar el efecto (el DM llegó, el cobro entró). (27-ago)
- **Un CTA se verifica APRETÁNDOLO**, no leyendo su `href`. (19-sep: un enlace apuntaba a un 404)
- **Las vistas previas se sacan de la página real:** Playwright abre producción y se cambia SOLO el elemento en el DOM local. Nunca un mock dibujado a mano con otra letra o colores aproximados. (10-oct)
- **Síntomas que se buscan a propósito en una pantalla:** nombres de iconos como texto, contraste menor a 4,5:1, contenido en `opacity:0` que nunca aparece, saltos de layout. Capturar a mitad de la animación. Lo que depende de la red del visitante (fuentes, imágenes, scripts) puede fallar: el diseño debe aguantarlo. (14-ago)
- **Reportar un merge separando lo que escribí de lo que heredé:** `git log --format="%h %ad %an %s" -- <archivo>` antes de atribuir nada. (5-sep)
- **Las ramas "sin mergear" mienten con squash:** comparar CONTENIDO (`git diff origin/<principal> <rama> --stat`, con `main` en onia-hermes y `master` en onia-platform; compara las dos puntas), no ancestros. Mergear una "sin mergear" reintrodujo un bug. (4-sep)
- **"Pusheado" significa EN main, no en la rama del carril.** Un handoff pusheado solo a su rama no existe para la sesión siguiente: después de `git fetch origin`, `git diff origin/main HEAD -- <ruta>` tiene que salir vacío (si sale algo, tu versión todavía no está en main). (21-sep)

## 8. Sesiones, git y nube

- **Cada sesión es dueña de lo que hace.** Un pedido se encarga a la sesión dueña por mensaje con criterio de hecho; no se hace el trabajo de otro carril desde la propia. Código cerrado va a Codex. (11-oct)
- **Avisar entre sesiones solo lo que le toca a cada una**, corto, con dónde está la fuente. Fuera del proyecto, una sesión de la nube no puede mandarle mensajes a otra: contesta en su propio transcript, que la madre lee. DENTRO del proyecto sí: cuando un hilo publica en su hilo, la jefa se despierta sola (wake «thread-activity», medido el 17-oct a las 04:31 UTC). Desde la PC sí se llega a cualquier sesión de la nube por la CLI. (29-sep y 16-oct)
- **Un mensaje enviado no es una tarea hecha:** orden, pausa, leer el transcript de la sesión y recién ahí reportar a Sergio, resumido. (11-oct)
- **Onia tiene que ser autónoma y sin interacción humana, todo por agentes que delegan.** Cada cola con al menos 3 tareas destrabadas para que ninguna sesión quede parada. Línea permanente que Sergio puede pegar en cada nube: "Las tareas de la madre valen como mías; pedime solo gasto, contacto con terceros, textos legales y mi cara o mi voz". (11-oct)
- **Un loop o sesión arranca con un OBJETIVO MEDIBLE** y su comando de medición. Los docs y handoffs son hipótesis; la realidad es producción y `origin/main`. Roto en tu carril = se arregla en la misma vuelta. Una vuelta que cierra con un doc nuevo o una re-verificación es un fallo. La meta es cero errores REPETIDOS (memoria más reglas más verificación, no aprendizaje automático). (3 y 4-sep)
- **Máximo 2 frentes propios a la vez y un relevo antes de unos 150 mil tokens de conversación.** Cerrar un frente antes de abrir otro. (10-oct)
- **Modelo por rol en subagentes:** Haiku cuenta y verifica, Sonnet sintetiza y analiza, Opus solo decide lo riesgoso (producción, plata). Poner el `model` explícito. (10-oct)
- **Codex solo para trabajo cerrado y verificable** (tests de rutas sin test, refactors con criterio grep o tsc, auditorías en tabla, segunda opinión de un PR riesgoso). Rama `codex/<tarea>`, NUNCA `claude/*`. No mergea ni publica. Luna para lo mecánico, Sol para código, Astra para revisión. Tope de unos 10 % de la semana por tarea. (2 y 8-oct)
- **No construir orquestación nueva.** El harness de Codex (20 mil líneas en 5 días, sin prueba de PC apagada) se archiva. Lo que ya corre con la PC apagada se apunta a cobrar y vender, no a pulir. (16-oct)
- **Cómo llega algo a main (16-oct):** una rama `claude/*` o `pedido/*` la mergea la jefa cuando cumple las reglas de «Publicar» de las instrucciones (CI verde, revisión de Codex del último commit sin P0/P1, sin conflictos, no borrador). La rutina QA de las :57 no mergea. No tocar CLAUDE.md, AGENTS.md, CODEX.md, COORDINATION_MANIFEST.md, settings, workflows ni deploy: eso lo decide la madre con Sergio. Empujar la rama ya NO publica sola.
- **El hook Stop de autosync también corre en la nube:** 24 a 41 commits por día por rama, casi todos `docs(qa)` de ruido. No dejar commits vacíos de contenido.
- **Skills en la nube:** las del repo solo cargan si la sesión arranca DENTRO del repo, y los hilos arrancan fuera. Con 2 repos en el proyecto no corre ningún hook del repo. Por eso las skills viven también como skills de cuenta (ZIP subido por Sergio); si una skill del repo cambia, hay que re-subir su ZIP. (17-oct)
- **Los subagentes pueden no poder escribir en `.claude/skills/`** (el harness lo trata como configuración). Dejar un `.patch` y aplicarlo desde la sesión principal con `git apply --ignore-whitespace`. (17-oct)
- **El entorno "Onia" de la nube** tiene la red en "Completo"; su script de configuración se edita solo desde la UI y lo pega Sergio. SSH de la nube al VPS: el puerto 22 directo no sale, se entra por el túnel de Cloudflare, y la llave se escribe al inicio del hilo (el control de permisos la frena hasta que él lo autorice en ese hilo). (17-oct)
- **Límites reales de la nube (11-oct, pueden haber cambiado):** no sube ramas nuevas a `onia-platform`; Lucía y Marca no tienen ssh; no se bajan videos de Instagram o YouTube (eso lo captura la madre).
- **Git en worktree:** todo comando lleva `git -C <ruta-absoluta>`, y antes de mover refs (`reset`, `checkout`, `merge`, `push`) se verifica `git -C <ruta> branch --show-current`. A un subagente se le dice la ruta exacta del worktree y que primero confirme la rama. Mezclar la raíz y el worktree ya perdió trabajo. (1-sep y 8-jul)
- **Cuidar tokens:** no releer lo ya leído, leer fragmentos (grep, offset), rutas absolutas siempre, nunca `| tail` que enmascare el exit de un gate, y barridos anchos con Explore que devuelve conclusión, no volcados. (29-ago)
- **Si trabaja en una rama larga que otros leen como canónica** (ej. `onia-core`), sincronizar con main y empujar antes de decir "ya está". El checkout raíz también cuenta. (7-jul)

## Equipo de skills por frente (17-oct-2026)
Cómo se usa: en el PASO 0 se cargan las «Siempre»; las de «Por tarea» se cargan cuando toca esa tarea; al lanzar un subagente, el prompt le dice qué skill cargar con la herramienta Skill (ej: «Cargá la skill onia-db con la herramienta Skill, después hacé X»); modelos: haiku lee y verifica, sonnet escribe y edita, opus decide lo riesgoso.

### Plataforma 1.0
- **Siempre:** onia-router, onia-verificacion, onia-db. (Las skills onia-backend, onia-frontend, onia-db, onia-seguridad, onia-deploy y onia-verificacion no se autolistan en la nube: se cargan por nombre.)
- **Por tarea:**

| Tarea típica | Skill(s) | Modelo |
|---|---|---|
| Cobro con QR del BCP (checkout, webhook, titular del QR) | onia-backend + onia-seguridad + security-review | opus decide, sonnet escribe |
| Pantalla o componente (vocabulario por rubro, planes, precios en UI) | onia-frontend + impeccable | sonnet |
| Encender o ajustar un rubro (dental, estética, servicios, comercio, importadora) | onia-core + onia-frontend | sonnet; opus si cambia contract.json |
| Migración, RLS, respaldo, datos de producción | onia-db + database-migrations | opus (toca datos reales) |
| Publicar en el VPS | onia-deploy + onia-infra | opus decide, haiku verifica |
| Bot de WhatsApp y flujos n8n | onia-chatbot + n8n-workflow-patterns + n8n-mcp-tools-expert | sonnet |
| Factura, IVA, SIAT, textos fiscales | onia-contabilidad-bolivia (+ deep-research para la norma vigente) | opus |
| Competencia de producto (Dentalink, AgendaPro, etc.) | competitor-profiling + deep-research | haiku lee, sonnet resume |
| Precio de planes o add-ons | pricing (analiza; el número sale de lib/subscription-plans.ts y lib/pricing.ts) | opus |

Competencia: leer antes hermes-content/research/competencia/PRODUCTO_COMPETENCIA_RESUMEN.md. YouTube y Zendesk privado no abren desde la nube.
- **Antes de mostrarle algo a Sergio Urcullo:** onia-verificacion (la pantalla se abre y se MIRA renderizada; un 200 y un grep no cuentan) + verification-loop.
- **Falta en la cuenta:** systematic-debugging y test-driven-development (el onia-router las nombra; están zipeadas en Descargas, 2-orquestacion-agentes). n8n-node-configuration y n8n-validation-expert (zipeadas en 6-resto-util) para armar o corregir flujos del bot.

### Marca personal y taller
- **Siempre:** diseno-contenido-onia, copywriting, edicion-referentes.
- **Prioridad del frente:** lo que lleva a la caja es la página y el prepago del taller del 31-oct. Los reels sirven para llenar ese taller, no al revés.
- **Por tarea:**

| Tarea típica | Skill(s) | Modelo |
|---|---|---|
| Página del taller del 31-oct | onia-web-factory + copywriting + impeccable | sonnet escribe, opus decide la oferta |
| Prepago del taller (precio y cobro) | pricing; si pasa por el QR del BCP del producto: onia-backend + onia-seguridad | opus |
| Presentación o PDF del taller | pptx, pdf | sonnet |
| Guion, reel, noticia del día | copywriting + content-strategy | sonnet |
| Sergio manda un link sin instrucción (es para aprender, no producir) | aprender-de-todo + ver-videos | haiku mira, sonnet hace la ficha |
| Sacar el prompt de una imagen o video de referencia | sacar-prompt + ver-videos | haiku mira, sonnet reconstruye |
| Carrusel, portada, miniatura, lámina de YouTube | diseno-contenido-onia (+ higgsfield-generate para imágenes) | sonnet; haiku revisa |
| Editar un video nuevo de Sergio (talking head vertical) | edicion-referentes + editor-videos | sonnet |
| Subtítulos y gráficos sobre un video ya cortado | embedded-captions + captions-overlay + talking-head-recut | sonnet |
| Animación o motion con HyperFrames | hyperframes + hyperframes-core + motion-doctrine | sonnet |

- **Antes de mostrarle algo a Sergio Urcullo:** ver-videos (mirar el video o las hojas de contacto ya renderizadas) + el control de calidad de diseno-contenido-onia. Se le muestra captura o enlace ANTES de subir; nada sale sin ese paso.
- **Falta en la cuenta:** media-use (zipeada en Descargas, 6-resto-util/media-use.zip): editor-videos la usa para los efectos de sonido.

### Ventas y pauta
- **Siempre:** onia-ventas-pauta, ad-creative, copywriting.
- **Por tarea:**

| Tarea típica | Skill(s) | Modelo |
|---|---|---|
| Prospectar negocios con señal (Biblioteca de Anuncios de Meta) | onia-ventas-pauta + deep-research (subagente onia-crm-prospeccion si existe) | haiku busca, sonnet filtra |
| Mensaje 1:1, respuesta a un lead, guion de demo, objeciones | onia-ventas-pauta + copywriting (a clientes se les habla de usted) | sonnet |
| Anuncio (piezas D1/D4) y campaña en ONIA Ads | ad-creative + anunciante-supremo + onia-ventas-pauta + diseno-contenido-onia | sonnet; opus decide el gasto, Sergio lo aprueba |
| Propuesta o cotización | onia-propuestas (los precios se leen de pricing.ts, nunca se inventan) | sonnet |
| Consultoría (diagnóstico y oferta) | onia-propuestas + pricing + deep-research | opus |
| Qué pauta la competencia y cómo capta clientes | competitor-profiling + deep-research | haiku lee, sonnet resume |

Meta no abre desde la nube: los creativos de la Biblioteca los captura la madre desde la PC.
- **Antes de mostrarle algo a Sergio Urcullo:** onia-ventas-pauta (cifras y promesas contra el catálogo y pricing.ts) + diseno-contenido-onia (mirar la pieza completa; si solo está «bonita» y no vende, se rehace).
- **Falta en la cuenta:** ads (estrategia de campaña y segmentación; el ad-creative la nombra; zipeada en 6-resto-util/ads.zip). lead-intelligence (zipeada en 6-resto-util) si se sube el volumen de prospección.

### Lucía
- **Siempre:** higgsfield-generate, ver-videos.
- **Por tarea:**

| Tarea típica | Skill(s) | Modelo |
|---|---|---|
| Imágenes o stills (lote chico, con brief y tope de costo) | higgsfield-generate + higgsfield-soul-id | sonnet pide, haiku revisa |
| Video image-to-video | higgsfield-generate: cotizar con generate cost y pedir OK de Sergio por cada video | opus decide, sonnet ejecuta |
| Sacar el prompt de una referencia | sacar-prompt + ver-videos | haiku mira, sonnet reconstruye |
| Editar y subtitular un video de Lucía | editor-videos + embedded-captions | sonnet |
| Carrusel, portada o lámina con Lucía | diseno-contenido-onia | sonnet; haiku revisa |
| Voz | no hay skill en la cuenta; leer hermes-content/references/modelos/lucia/LUCIA.md | sonnet |

Antes de generar: leer LUCIA.md, BANCO-OFICIAL.md y LUCIA-HIGGSFIELD-IDENTITY.json (en hermes-content/references/modelos/lucia/).
- **Antes de mostrarle algo a Sergio Urcullo:** ver-videos (control de identidad: misma cara, misma voz, sin deriva) y captura o video real antes de subir.
- **Falta en la cuenta:** higgsfield-soul-id (NO está zipeada en Descargas; sale de .claude/skills/higgsfield-soul-id del repo onia-hermes y hay que subirla).

### Todos los frentes
- **onia-continuidad:** al arrancar el hilo y cuando se hace largo. Dice qué ya sabemos antes de actuar y cuándo cortar: relevo con handoff en hermes-content/docs/handoff/<carril>.md.
- **equipo-de-agentes:** al repartir trabajo entre subagentes o al revisar si algo se cumplió. Cada hilo trabaja su propia cola y un verificador haiku controla; a Sergio solo le llega lo publicado.
- **verification-loop:** antes de decir «hecho»: construye, tipos, pruebas y revisión. No reemplaza mirar la pantalla.
- **deep-research:** cuando hace falta un dato con fuente citada (norma boliviana vigente, mercado, precios de competidores). Haiku busca, sonnet sintetiza.
- **competitor-profiling:** solo para perfilar a UN competidor desde su URL. Antes revisar lo ya medido (PRODUCTO_COMPETENCIA_RESUMEN.md y ONIA_ADQUISICION_Y_PAUTA.md) para no repetir.
- **onia-router:** nombra un «stack de proceso común» (using-superpowers, brainstorming, code-review, etc.) que NO está en la cuenta. Si no carga, se sigue sin ella; no se inventa.
