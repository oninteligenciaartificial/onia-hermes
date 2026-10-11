# Handoff — carril `mercado-y-pauta` (sesión «Ventas y pauta Onia Platform», antes «Análisis de mercado»)

> 🧭 **11-oct — nueva madre: «seguí con la Biblioteca de anuncios de Meta y aprender Meta Ads».** **Hecho (solo lecturas; nada creado ni gastado):** (1) **18 fichas por anunciante** en `research/competencia/anuncios/fichas/` (índice `README.md`, `bolivia-clinicas.md` como señal y no como lista de contacto), generadas por `onia-ventas-pauta/scripts/biblioteca-fichas.mjs` desde el JSON + `LECTURAS.json` (lecturas a mano que se conservan al regenerar el 24-oct). (2) **Meta Ads por la ayuda oficial** (`ads_get_help_article`): skill §8.4. **Lo que corrigió al plan:** cambiar o agregar un anuncio es una edición significativa (reinicia el aprendizaje y abre otra revisión de ~24 h), así que el corte del día 3 pasa de «se cambia la pieza» a **«se pausa la copia que no trae»**; el «no más de 20 %» de presupuesto era una regla propia, Meta no da umbral; el mensaje precargado lo puede editar o borrar quien escribe (el código `(D1)` puede perderse); los anuncios comerciales **no se archivan** al detenerse (por eso `INACTIVE` daba 0); la prueba 1 no es una prueba A/B; con US$ 4/día el aprendizaje queda limitado por diseño. Confirmó que el presupuesto total con fecha de fin (lo que ya usa la campaña) es el techo duro. **No se aprendió:** el costo real por conversación en Bolivia ni el mínimo de presupuesto del evento (Meta lo dice al crear). **Sigue bloqueado:** tabla «se promete / funciona» y corto del VSL hasta la demo del lunes.
> 📚 **10-oct, noche — Sergio Urcullo (por la madre, literal): «ventas es que tiene que aprender a hacer anuncios en meta ads y demás, que mire ads library y mire qué anuncios funcionan».** **Hecho (sin crear nada en Meta, sin gasto, sin contactar a nadie; revisado por un revisor independiente, 8 cifras y 3 conclusiones corregidas):** estudio de la Biblioteca por el conector: 258 anuncios de software (62 con más de 30 d) y 417 de clínicas con alcance en Bolivia (41 con más de 30 d) en `research/competencia/anuncios/BIBLIOTECA-10OCT.json`; cifras reproducibles con `onia-ventas-pauta/scripts/biblioteca-estadisticas.mjs`; ficha de 12 dimensiones `references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md`; reglas R1-R10 en la skill §8.3 y peso de cada patrón en ADQ §2.6.2. **Lo que cambió:** A1 v6 y A2 v3 con el titular de Meta «Pida su demostración gratis» (27 caracteres; la oferta dicha igual en imagen, titular y texto; campaña JSON y test alineados) y 3 piezas nuevas: N1 «Todos sus doctores, una sola agenda», N2 «¿Sigue guardando las fichas en papel?», N3 «Pruebe Onia 14 días, sin tarjeta» (cambia el destino y contradice «no se prueban destinos» de §5.11: **lo decide Sergio Urcullo**). **Lo que NO dice la evidencia (corregido tras el revisor):** el largo del titular no distingue a los que duran; «control» son 12 anuncios de 5 titulares de 2 anunciantes; la norma (Dt.Dental, Reservo) no es más fuerte que «control»; la oferta de prueba es un indicio flojo (los 4 son de Doctocliq y Calu perdió los suyos); **el orden de las piezas no sale de la Biblioteca**: A1 va primero por ser el plan de la prueba 1. N1, N2 y A2 solo entran por las tandas de §5.11 (con plata de un cliente que ya pagó) y con sus filas en ✅. **Hueco que Onia no puede llenar:** norma e IA que atiende. **El conector NO trae** formato, texto principal, botón ni público, ni mide la muerte (`INACTIVE` = 0 para Calu): pedido PC a la madre en `PEDIDO-CAPTURAS.md` (8 creativos de más de 50 d que faltan; los 5 de 1-2 oct ya estaban y siguen activos). **Re-medir el 24-oct:** qué ids del JSON desaparecieron. **Intento fallido:** abrir `app.onia.com.bo/register` renderizado desde la nube (Chromium rechaza el certificado del proxy); la oferta de N3 se contrastó leyendo el texto por `curl`. **Queda:** recapturar con la cuenta demo (las capturas son del 30-sep y traen voseo y «Enviar yo mismo» dentro de la pantalla), códigos de anuncio de N1-N3 sin asignar en el bot, y las filas ⬜ de cada pieza.
> 🔁 **9-oct — loop sobre la cola `cola/loop/ventas-pauta.md`** (la cola y el commit `06ae72789` de la madre viven en `origin/claude/onia-madre-v2-pr-review-2d85bb`, **no en `main`**; allí está también el cambio de CLAUDE.md que sube el diseño sin esperar: **sin mergear, no rige para mí**).
> - ✅ **Tarea 3 (creativos de §5.11):** `carousels/briefs/ads/PRUEBA-1-PIEZAS.md`: A1-E y A1-V listas y miradas con el copy corregido; A1-S espera la cara de Sergio Urcullo.
> - ✅ **Tarea 4 (fichas de contenido):** `research/competencia/anuncios/FICHAS_DE_CONTENIDO.md` (Huli, Reservo, Dt.Dental, Calu, bolivianos: ningún proveedor boliviano pauta en Meta).
> - ⛔ **Tareas 1 y 2 bloqueadas por Plataforma:** la tabla «se promete / funciona» y el corto de 60 s necesitan la cuenta demo y las capturas C1-C7 (y que Sergio Urcullo vea la tabla de cortes y el preview 360p antes de cortar).
> - Bloqueado de Sergio Urcullo: tarjeta en ONIA Ads y OK de gasto.
> 🔎 **10-oct, noche — revisión independiente de la campaña (JSON + §5.10):** 10 hallazgos, aplicados: sin Instagram vinculado los US$ 56 corren solo por Facebook; el `nota` del brief se renderiza y decía «20 minutos» (el bot dice 30); el anuncio había perdido el filtro «Para dueños y dueñas…»; la captura muestra el botón de G-03 (🟡); faltaban condiciones (quién contesta, minutos, canales 1 y 2, Instagram, declaración de IA); la firma del bot es de Sergio Urcullo (FIRMA_HUMANA). A1, A2 y los dos videos se re-renderizaron con el texto corregido. **Pendiente de él:** Instagram sí o no, minutos 20 o 30, firma, tarjeta, OK escrito.
> 📨 **10-oct, tarde — Sergio Urcullo (por la madre): «todo lo que esté revisado está aprobado».** Cubre el texto, no el envío: contactar a terceros sigue pidiendo su sí aparte. Pedido: borradores de seguimiento de los
> 7 leads de agosto más uno nuevo, y revisar si las «8 colgadas / 5 sin respuesta» del vigía son prospectos. **Hecho:** `sales-kit/SEGUIMIENTO-LEADS.md` §0 (¿son prospectos?, textos A, A estética, B, B′ y N, y lo que falta para mandarlos).
> **Sin ver:** Chatwoot, el log del vigía y las plantillas aprobadas están en el VPS y la nube no tiene llave: «el nuevo» y las 8 colgadas quedan con el pedido a la madre (id, canal, nombre, una línea de lo que escribió, hace cuánto, si hubo salida humana, y si el último entrante tiene < 24 h).
> **Corregido de paso:** el playbook prometía «con una clínica de ejemplo» en la llamada; no hay cuenta demo (L-05). **No consta** que las plantillas A/B existan aprobadas en Meta (no vi la lista) y el método de pago de la WABA sigue sin verse: el repo se contradice (agosto: cargado; 19-sep: previsto que falle desde el 1-oct, sin medir). Revisado por un subagente independiente, que corrigió 5 cosas (la fecha de la lista de plantillas, el tablero que no era el del pago, la coexistencia, B que prometía «lo que preguntó» y «tres» plantillas que eran cuatro).
> 🎯 **10-oct — pedido de la madre (sin crear nada en Meta, sin contactar a nadie):** (a) **go/no-go del 13-oct clasificado** en ADQ §5.10: pasan a ✅ sin Sergio Urcullo las filas
> 1, 2, 8 y la mitad de la 4 y la 5; dependen de él la 3 (tarjeta: **medido `has_payment_method: false`**), la 6, la 9, la prueba con teléfono de la 5 y, sin tope duro, la 7. **Veredicto de hoy: NO-GO.**
> (b) **Campaña lista para crear:** `carousels/briefs/ads/CAMPANA-1-LISTA-PARA-CREAR.json` + `scripts/campana-lista.test.mjs`. (c) **Defecto propio corregido:** los códigos `D1V`/`D1S` del 9-oct el bot no los lee
> (el lead nacía sin origen): ahora `D2`/`D3`. (d) Leído en Meta: 0 campañas, 0 borradores; píxel «ONIA Web» activo (disparó el 9-oct 18:40 UTC-7). **Dónde se retoma:** cuando Plataforma refresque la demo,
> `grabar-captura.mjs` con los planes C1-C7, re-render de A1 y las filas B-02, G-01, G-06, G-11 y L-05; PR de esta tanda en `claude/onia-ventas-pauta-rmdv5j`.
> - ✅ **Lo desbloqueable de las tareas 1 y 2 (9-oct, madre: «encadená todas las tareas desbloqueadas»; `/loop` existe en mi sesión):** `scripts/grabar-captura.mjs`
>   (el «script de grabación» que el VSL dice que no existe; planes C1-C7 y C2-clic como esqueleto, frenos probados, **la app real sin probar**) y
>   `carousels/briefs/ads/VSL-CORTO-TABLA-DE-CORTES.md` + preview de 60 s en `carousels/out/ads/vsl-corto-animatic/`. **Siguen bloqueadas** la tabla «se promete / funciona»
>   y el corto real: cuenta demo (Plataforma), `ONIA_QA_EMAIL`/`ONIA_QA_PASSWORD` en el entorno de Ventas (Sergio Urcullo) y las tomas T9/T10/T12.
> - ✅ **`equipo-de-agentes` y `aprender-de-todo` (madre, commit `ca1fde0a`, 9-oct):** leídas con `git show`; **no mezclé su rama** (trae CLAUDE.md, AGENTS.md y 90 archivos, y toca el mismo
>   `onia-ventas-pauta/SKILL.md` que yo: ensuciaría el PR #175). Entran por `main` cuando ella las mergee. Prueba de uso del aprendizaje en
>   `carousels/briefs/ads/VSL-CORTO-TABLA-DE-CORTES.md` (4 ángulos de Ramiro Cubría + «no prometer respuesta no probada» de Marco Machado; detector de promesas 0, control 2): **aplicado, sin revisor independiente**.
> - ✅ **Tanda 2 de competencia (T1-9, 9-oct):** `ONIA_UI_MEJORAS_1.0.md` §8. **Historia clínica:** *Normas en Salud Oral* (R.M. 1320, 2010, «documento de trabajo») pide
>   historia clínica en todo paciente y prontuario «archivado por lo menos por unos 10 años», digital permitido; la Ley 3131 trata el consentimiento y el
>   secreto como documentos oficiales. Ninguna de las dos fija obligación probada para un consultorio privado: **titular solo como pregunta y con el OK de
>   Sergio Urcullo**, tras confirmar vigencia con el SEDES o el Colegio de Odontólogos. **Factura:** el 30-sep el SIN **abrogó** las RND de los grupos 9-12
>   (RND 102600000038, título leído en su lista oficial): **no hay fecha para usar de gancho**, y el SIAT de Onia sigue apagado. **Bots locales:** nada por la web
>   pública (ausencia de evidencia). **Quedan como PEDIDO PC** Google Maps/Facebook, Instagram de Doctocliq/Dentalink/CitaPro y una pregunta a un odontólogo.

> ✏️ **9-oct — copy corregido (pedido de la madre): ya no dice «lo envía, con un toque».** El envío con un toque (G-03) está a medias en
> `ONIA_PROMESA_VS_PRODUCTO.md`. Ahora dice **«Usted lo aprueba. Nada sale sin su OK.»** en A1, A2, carrusel (lámina 3), micro-video y los guiones F1/F3.
> Se quitó también el anillo y el pulso sobre el botón «Enviar yo mismo»: la pantalla real lo sigue mostrando, pero sin énfasis. El pulso del video
> ahora es opt-in (`video.pulso`). **Corto de 60 s con `editor-videos`: espera las capturas C1-C7 de Plataforma** y que Sergio Urcullo vea tabla de cortes
> y preview 360p. **No se instalan** marketingskills ni Motion-Creative sin su OK. El commit `30bc87b8` de la madre (skill §9, `06-VSL-DENTAL.md`,
> ADQ §5.11) **no estaba en `origin/main`** al leer: no lo pude leer.

> 🔎 **8-oct, noche — Biblioteca por el conector (Sergio Urcullo: «mirá Pinterest y la Biblioteca para ver cuáles funcionan»).**
> - **Navegador de la nube:** Biblioteca 403 y Pinterest con muro de sesión; no se rodearon. **Conector `Meta_ads`:** sí, con titular y fecha, sin creativo.
> - **Hallazgo:** AgendaPro (id `1429581593936821`) tiene los anuncios activos más viejos (**245 días**) y un asistente con nombre, «Sofía», de **141 días**.
>   Dt.Dental, Doctocliq y CitaPro siguen 83-100 días. A Bolivia solo le llega pauta de software dental de Dentalink. Todo en `ONIA_ADQUISICION_Y_PAUTA.md` §2.6.1.
> - **Error evitado:** Dentalink tiene 92 activos y el conector solo muestra los 50 más nuevos; «nada de más de 14 días» sería falso (§2.6 dice 322 días).
> - **Pedido PC:** Pinterest con la sesión de Sergio Urcullo y los creativos de 7 ids (en §2.6.1).

> 🧪 **8-oct, noche — Tanda 1 de competencia y laboratorio de creativos (pedidos de la madre por Sergio Urcullo).**
> - **Tanda semanal de competencia:** `ONIA_UI_MEJORAS_1.0.md` §8 (9 hallazgos con versión Onia, dueño y Codex) + fichas `JELOU_FICHA.md`,
>   `DATEC_FICHA.md` y `ANUNCIANTES_FICHAS_CORTAS.md`; `MAPA_COMPETENCIA.md` al día. **Próxima: 15-oct** (norma boliviana de
>   historia clínica y factura, Instagram de Doctocliq/Dentalink/CitaPro, bots de clínicas locales). Codex esta semana: ninguna tarea.
> - **Laboratorio de creativos:** `anuncios/FORMATOS-QUE-SOSTIENEN.md` (5 formatos con más días, una versión Onia por vía). Hecho con código:
>   A1 v5 estático 4:5 y 9:16, video de 11 s, micro-video de 10 s y carrusel de 4 láminas 1:1. Guiones para Sergio Urcullo (F1 y F3) y una
>   propuesta de Higgsfield **sin cotizar** (se cotiza con la CLI desde la PC).
> - **Plan visible:** la lista de tareas de la sesión (TaskCreate) trae el criterio de hecho de cada una.
> - ✅ **`ONIA_ADDONS.md`** (los 6 add-ons del 8-oct, pedido de la madre): potencial, mercado de hoy, test de 3 preguntas, esfuerzo, cómo se
>   vende al mismo cliente, **orden para después de la 1.0** (web conectada · puesta en marcha · app · campañas de Meta · influencers IA · IA
>   local) y primer paso de cada uno. **Ojo:** el bloque de decisión del 8-oct que la madre cita en el §12 de la estrategia **no está en `main`**.
>   Verificado en vivo: `/servicios/webs` responde 200; `/servicios/marketing-ia` y `/servicios/consultoria` redirigen a la portada.
> - **Intentos fallidos:** rutas de precios adivinadas (`/precios`, `/pricing`) dieron 404; el buscador dio precios viejos de Jelou; el control de
>   seguridad bloqueó un `rm -f $VAR/*` (se sobrescribió por nombre).

> 🎨 **8-oct, noche — Rediseño de los anuncios (Sergio Urcullo: «demasiado básicos… mejora tus trabajos»).**
> - **Hecho:** se miraron los 22 anuncios de la competencia fotograma a fotograma + 5 sitios de referencia y se rehízo D1
>   como **A1 v5 «Las 10:00»** y A2 como **A2 v2** (feed, historia y video de 11 s para A1). Tabla de qué hacen ellos y qué
>   hacíamos nosotros: `research/competencia/anuncios/COMPARACION-DISENO-8OCT.md` (hojas en `_hojas/`).
> - **Código:** plantilla `bloques` en `anuncio-render.js` + `anuncio-video.js` (skill `onia-ventas-pauta` §4.2).
> - **Sigue mal:** no hay **persona** (los 7 que sobreviven la tienen; guion de 25 s para Sergio Urcullo, opcional); la
>   captura es provisoria; A2 espera E-03; sin gasto no hay cifra de rendimiento. **Nada se subió ni se gastó en Meta.**
> - **Intentos fallidos:** la Biblioteca de Anuncios no abre desde la nube (403 de Facebook; no se rodea); Doctolib
>   bloquea con Cloudflare; mi primera plantilla (tres filas con tiras blancas) quedó plana y se descartó; un anillo
>   sobre el nombre del paciente tachaba el texto (margen de 8 px, bajado a 6 y sin anillo en esa línea).
> - **Lo que depende de otros:** Sergio Urcullo ve las piezas renderizadas (diseño nuevo); cuenta demo para recapturar.

> 📣 **8-oct, noche — Meta Ads retomada (pedido de la madre; Sergio Urcullo: «¿no se supone que tiene que ver Meta Ads?»).**
> - **Hecho (todo en `ONIA_ADQUISICION_Y_PAUTA.md`, nada creado ni gastado en Meta):** techo alineado a la caja (**US$ 56 =
>   Bs 750**, no USD 140); reglas de corte del plan §3 (§5.7); lo medido hoy (§5.9.1); a dónde lleva cada anuncio, públicos y
>   el go/no-go del 13-oct (§5.10). **D1 v4**: texto corregido y de usted, render mirado en feed e historias.
> - **Medido en ONIA Ads:** sigue **sin medio de pago**; la página «Onia» existe en el negocio; el píxel dispara; sin
>   Instagram vinculado; el número del bot no se ve desde el conector.
> - **El 16-oct no está asegurado:** el plan pide haber contactado antes a los canales 1 y 2, y Sergio Urcullo frenó todo
>   contacto el 8-oct. Se decide el 13-oct; una fila en ❌ y no se enciende.
> - **Falta de Sergio Urcullo:** tarjeta, vincular el número del bot a la página, firmar la respuesta a la pauta, el OK de
>   gasto (US$ 56 · 14 días · Bs 750) y el «usted» en los anuncios.
> - **Ninguna pieza sube:** las capturas de D1 son del candidato del 30-sep, no de producción. Se rehacen con la cuenta demo.

> ⏸️ **8-oct, tarde — Sergio Urcullo (por la madre): «no vamos a escribirle a nadie aún».** Se frena todo contacto:
> los 7 de la §6.9 y los leads de agosto. El conteo de los leads de agosto **quedó sin hacer**: la nube no tiene llave
> del VPS ni token de Chatwoot. El comando para la PC está en `ONIA_LEADS_ESPERANDO.md`, «Conteo de hoy en una sola
> corrida». Tarea nueva: auditar la promesa contra lo que funciona y los referentes de UI. Para mirar la app por dentro:
> `.claude/skills/onia-ventas-pauta/scripts/auditar-app.mjs` (solo lectura). Necesita una cuenta de prueba en
> `ONIA_QA_EMAIL` y `ONIA_QA_PASSWORD`; está pedida a la madre.

> ✅ **8-oct (`session_0143C5fMXVs8eWEf7uBpC9SF`, rama `claude/onia-ventas-pauta-rmdv5j`): pedido de la madre, 10 dentales
> nuevas con señal y mensaje. Quedan 7 de 10.**
> - **Dónde:** `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.9. Las 7, por orden: Clarident Plus, Hurtado, Smile Dental, San Pablo,
>   Innova Kids, COYR DENT y Henners. Todas tienen Santa Cruz, canal y pauta activa verificados, y ninguna tiene el
>   equipo contado. Cada mensaje cierra preguntando cuántos odontólogos atienden. Los 7 mensajes pasan el revisor de
>   promesas. Nadie contactado.
> - **Faltan 3:** 7 candidatas EN ESPERA para la PC, con el id del anuncio para abrir (Dentessa, BAires,
>   Doctormaxilofacial, Ramos, Gooddental kids, Cosmetic y Epica).
> - **Aprendido (en la skill §2 y §3):**
>   - `dentists10.com` por `page_id` resuelve la ciudad de las dentales (27 de 81).
>   - La búsqueda web no sirve para estas páginas: 0 de 23.
>   - El revisor de promesas rechaza «la IA escribe una sola vez el modelo».
> - **Riesgo de merge:** la §6.8 de Codex (rama `codex/madre-orquestacion-20261005`) se inserta en el mismo lugar,
>   antes de la §7. Al mergear las dos ramas, se conservan las dos secciones.
> - **Depende de Sergio Urcullo:** el OK a los 7 mensajes y si «Clarident Duo» es otra sede. Desde la PC, la madre o
>   Sergio Urcullo: las 7 EN ESPERA y confirmar que cada número tiene WhatsApp.

> ✅ **5-oct, tarde (`session_0143C5fMXVs8eWEf7uBpC9SF`, rama `claude/onia-ventas-pauta-rmdv5j`): mensajes a los leads
> contra el catálogo.**
> - **Medido:** ONIA Ads sigue con `has_payment_method: false`. Precios y usuarios re-leídos en `onia-platform`
>   `97fe306`: Crece Bs 550 con 4 usuarios, Profesional Bs 890 con 5.
> - **`ONIA_LEADS_ESPERANDO.md` §3:** se sacaron los borradores del 1-oct. El de «F» contestaba «Sí» al tratamiento a
>   medias, y eran textos libres con la ventana de 24 h cerrada. Ahora §3 apunta al playbook
>   (`sales-kit/SEGUIMIENTO-LEADS.md`, plantillas A/B). §3.1 tiene las 6 preguntas de «F» contra el catálogo, para la
>   llamada. §3.3 tiene el correo de la conv 36, alineado al catálogo §8.3 y con revisor de promesas en 0.
> - **`main` tenía rojo `npm run test:venta-honestidad`** por el «≈ Bs 17» del playbook (un costo interno leído como
>   precio). Pasado a USD: 17/17.
> - **Abierto, para Plataforma:** la exportación a CSV no figura en el catálogo. Hasta que la miren en pantalla y la
>   sumen, la pregunta 6 de «F» no se contesta por escrito.
> - **Sigue dependiendo de Sergio Urcullo:** el OK a las plantillas A/B y al correo de la conv 36; la tarjeta en ONIA
>   Ads.

> ⏹️ **CIERRE 5-oct (cambio de sesión madre). Nada en vuelo ni sin commitear; todo en `main`.**
> - **Hecho:**
>   - competencia en la Biblioteca (`ONIA_ADQUISICION_Y_PAUTA.md` §2.5-2.6);
>   - el bot de venta de usted (PR #114, sin desplegar);
>   - playbook `sales-kit/SEGUIMIENTO-LEADS.md` (PR #117);
>   - el mapa de competencia apuntado en la skill §4.1 (PR #122).
> - **D1/D4:** v3 en pausa, sin aprobar. D4 sigue congelado por el catálogo §8 (el detector no encuentra a nadie);
>   su ángulo es «tratamiento empezado y presupuestado», no «pacientes que tienen que volver».
> - **Medido 5-oct:** ONIA Ads (`act_1073680778314945`) sigue con `has_payment_method: false`. Sin tarjeta no se
>   crea nada en Meta, ni en pausa.
> - **Depende de Sergio Urcullo:**
>   - la tarjeta y el control total de ONIA Ads;
>   - el número 75414930 vinculado a la página «Onia»;
>   - la firma de la respuesta a la pauta;
>   - aprobar las plantillas A/B y las 4 del seguimiento, el audio del día 7 y la imagen;
>   - el OK a los 12 mensajes y la decisión sobre MUN.
> - **Riesgos:**
>   - ~~El borrador del 1-oct a «F» promete el tratamiento a medias.~~ Sacado el 5-oct (entrada de arriba).
>   - Las plantillas a leads salen de Chatwoot con el usuario de Sergio Urcullo; si no, el bot les contesta.
>   - El bot de usted no está desplegado.
>   - D1 v3 todavía dice «La IA escribe el mensaje».

> ✅ **3-oct — el bot de ventas pasa a USTED** (pedido de la madre; regla de Sergio Urcullo: *«no se usa vos»*).
> - **En el repo, NO desplegado:** guion (`config.mjs`), `SAFE_REPLY`, etiquetas del motor, prompt del LLM y las 10
>   respuestas + 2 FAQ de `knowledge.onia.json`, solo texto. Gate nuevo `bot/de-usted.test.mjs`; suite del bot
>   1642/1642 en Linux. El deploy al VPS es del carril chatbot o de la madre (`publicar.sh`), no de este carril.
> - **Quedan de vos, a propósito:** las plantillas de Meta `seguimiento_demo` y `recordatorio_demo` (hace falta una
>   plantilla nueva aprobada) y el recepcionista `R_*`/`M0R`/`M6R`, que es el bot de los clientes. Las dos cosas
>   las decide Sergio Urcullo. Web y anuncios: pendiente de su respuesta a la madre.
> - **Sin firma, sin publicar:** la respuesta nueva a la pauta («¡Gracias por escribir desde el anuncio! Para
>   mostrarle Onia…»). El texto está en la skill `onia-ventas-pauta` §1.
> - Dapta: el agente de llamadas fue solo para mirar la interfaz. No es un canal (skill §8).

> ⏹️ **CIERRE 2-oct, ~14:00 UTC: alcance congelado por Sergio Urcullo** (*«no se añaden más tareas… terminemos,
> cortamos, damos un vistazo y definimos cómo seguir»*). La sesión espera; no abre nada nuevo.
> - **Hecho y en la rama** `claude/lucid-mayer-2ejv6v` (`ef02a46d2`, PR #95): los 12 mensajes de prospectos y la
>   página de contactos (v8) sin «la IA lo redacta»; D4 frenado en todos los docs (el catálogo lo prohíbe: el
>   detector no encuentra a nadie); la regla de `CLAUDE.md` saca la pauta del producto del pack de la marca
>   personal y pone primero el estudio de la Biblioteca; `anuncio-render.js` y D1/D4 v3 commiteados **en pausa**.
> - **No hecho y por qué:** campaña en Meta (falta la tarjeta en ONIA Ads y el OK); D1/D4 sin aprobar (Sergio
>   Urcullo pidió primero mirar la Biblioteca); nadie contactado (falta su OK a los 12 mensajes y la decisión de MUN).
> - **Evidencia:** `carousels/out/ads/onia-platform-dental-meta-v3-hoja.png`; catálogo `ONIA_CATALOGO_DE_VENTA.md`
>   («NO se puede decir»); página https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV (versión 8).
> - **Pendiente para después (no se hace ahora):** el estudio de la Biblioteca (lo hace la madre desde la PC, con el
>   pedido del 2-oct en el transcript de esta sesión); recién con eso, el diseño. Corregir el primer beneficio de
>   D1 v3 («La IA escribe el mensaje»). Una pieza con persona (los 7 anuncios que sobreviven la tienen).
> - **Para mejorar:** antes de prometer algo, leer `ONIA_CATALOGO_DE_VENTA.md`, no el código; antes de diseñar
>   pauta, el estudio de la Biblioteca, no un pack propio.
>
> 🟡 **2-oct, ~13:40 UTC — D1 y D4 v3 RENDERIZADAS (imagen única de anuncio de software), esperan el OK de Sergio Urcullo.**
> - **v2 rechazada:** Sergio Urcullo, *«es diferente el contenido de la onia platform que el de mi cuenta personal,
>   te dije que entres a ads library y veas qué es lo que funciona»*. Usé el pack de la marca personal para la
>   pauta del producto.
> - **v3:** el formato de la Biblioteca (ninguno de los 18 anuncios capturados es un carrusel editorial) + la marca
>   de la web (lockup `onia | dental`, Archivo, verde solo en la acción). Titular del dolor, pantalla real con el
>   recorte clave ampliado, tres beneficios, un botón. 4:5 y 9:16 con las zonas seguras de historias.
> - Archivos: briefs `carousels/briefs/ads/*-d1v3-*` y `*-d4v3-*`, salida `carousels/out/ads/*v3*/{feed,story}.png`,
>   hoja `carousels/out/ads/onia-platform-dental-meta-v3-hoja.png`, renderer
>   `.claude/skills/onia-ventas-pauta/scripts/anuncio-render.js` (método en la skill §4).
> - Corregidos la regla de `CLAUDE.md` («Publicidad…»), `diseno-contenido-onia` y `ONIA_ADQUISICION_Y_PAUTA.md`
>   §2.5, §5.8, §5.8.1 y §5.9: la pauta del producto ya no apunta al pack `referentes`.
> - **Lo que falta y es la brecha más grande:** una pieza con persona (los 7 que sobreviven la tienen). Depende de
>   Sergio Urcullo: grabarse 30 s con la pantalla, o aprobar el gasto de un presentador IA.
> - **Prospectos al 2-oct: 12 listos, 1 a decidir, 16 fuera.** Los 13 en espera se verificaron desde la PC (la
>   madre, en Facebook):
>   - entraron Odontoclínica, Pimentel, Gelinski y Todo Frenos;
>   - **MUN** sale por tener 2 sedes en Santa Cruz, salvo que Sergio Urcullo las acepte.
>
>   Cada uno de los 12 tiene su mensaje «sistema de gestión con IA» y la primera pregunta. Está en la página de
>   contactos (versión 7) y en `ONIA_PROSPECTOS_*` (§6.7, §1.7 y §2.6).
> - ✅ **2-oct, ~01:00 UTC — competencia contrastada** (18 de 22 capturas en main, `00e88548`): lo aprendido está
>   en `ONIA_ADQUISICION_Y_PAUTA.md` §2.5 y en la skill §4.1. **Cambios hechos:** la primera línea del texto de
>   D1 y D4 ahora habla de la plata del dueño, y la lámina 4 de D4 dice «21 días sin venir» (el umbral exacto del
>   código). **No se cambió el diseño:** los 7 anuncios que sobreviven tienen persona; esa brecha es una pieza
>   nueva (Sergio Urcullo con la pantalla), no un arreglo de D1/D4.
> - ✅ **2-oct, ~01:20 UTC:** portadas de D1 y D4 → *«Para dueños y dueñas de clínicas dentales de Santa Cruz.»*
>   (el filtro que pide §5.2). Leído el análisis de Dapta de la madre (`DAPTA_COMO_FUNCIONA.md` §6): su propuesta
>   del bot quedó anotada en §5.2 como pendiente de Sergio Urcullo, **detrás** del filtro de pacientes.
> - ⛔ **D4 FRENADO (2-oct).** El tratamiento a medias está en producción, pero no encuentra a nadie: cuenta solo
>   «En progreso», la ficha carga «Pendiente» y hay 0 cargados. El catálogo lo pone en «NO se puede decir». Yo había
>   escrito «D4 se puede prometer» por ver el código en el bundle, y lo corrigió la revisión de la madre v2. D4 no se
>   sube hasta que Plataforma lo vea funcionar en la cuenta demo.
> - ⛔ **«La IA escribe el mensaje» tampoco se puede decir** (catálogo §8): la IA escribe UNA vez el modelo y Onia
>   le pone los datos de cada uno. Corregido el 2-oct en los 12 mensajes (`ONIA_PROSPECTOS_*` y página de
>   contactos). **Sigue mal en los briefs de D1 v2 (lámina 5) y v3 (primer beneficio)**, que están en pausa.
> - ⏸️ **Sergio Urcullo, 2-oct: «DEJA DE ARMAR, PRIMERO MIRA LA META ADS LIBRARY Y MIRA COMPETENCIAS».** v3 queda
>   en pausa y sin aprobar. Lo próximo es el estudio de la Biblioteca, hecho por la madre desde la PC (desde la
>   nube Facebook no abre), y recién con eso se diseña.
>
> ~~🔴 EN VUELO, 2-oct — rehacer D1 y D4 (misma sesión).~~
> - Sergio Urcullo las rechazó: no respetan las reglas ni el estándar de la marca personal, y no se aprendió de la
>   competencia.
> - Por la madre pidió además que digan que Onia es **«un sistema con IA»**.
> - **Esperando dos cosas:**
>   1. las 22 capturas de anuncios de la competencia, que hace la madre
>      (`research/competencia/anuncios/PEDIDO-CAPTURAS.md`);
>   2. la lista de frases de IA verdaderas que arma Plataforma (`session_014HGgof9kHQkdLXhsZsAq6A`).
> - **Plan:**
>   - pack `referentes` (como `sergio-k6v2-*`);
>   - captura del producto a todo ancho: recorte cerrado o vista móvil;
>   - mirar las piezas contra la regla «Publicidad» del `CLAUDE.md`;
>   - mandarle las contactsheets y los 8 mensajes reescritos «con IA» para el OK.
> - Nada se crea en Meta: ONIA Ads sigue sin tarjeta, y la madre confirma que quedó en la cuenta personal.
>
> ✅ **1-oct, de noche (`session_01JkUVtTYrjJ9xUywLXjYz5G`, entorno «Default» con red completa, rama
> `claude/lucid-mayer-2ejv6v`): los 28 prospectos quedaron VERIFICADOS.**
> - **8 listos para el OK de Sergio Urcullo**: Spadental, Nexo, Klynink Medic (entró de la reserva), DASHA, Corpo
>   Belo, Jhimbo, Quevedo y KAIS.
> - **13 en espera** y **8 salieron**.
> - Veredicto y fuente de cada uno: `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.6 y `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` §1.6
>   y §2.5.
> - La página https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV (versión 5) quedó con los 8 primero.
> - **El conector de Meta ya ve ONIA Ads**, pero sin tarjeta.
>
> ⏩ **1-oct, vigente: el carril sigue en la NUBE** (`session_01BnctfaNRsm3ogJ46A7B5P5`). Rige la regla nueva
> de `CLAUDE.md`: la madre corre local y ordena por mensaje, y esta sesión contesta en su transcript. Lo que
> exige la PC (Facebook, Instagram o el Administrador de anuncios con el login de Sergio Urcullo) lo hace la
> madre. El aviso anterior, «pasa a una sesión local», quedó sin efecto.
>
> 🔁 **1-oct, noche — RELEVO.** Sergio Urcullo abre la sucesora en el entorno **`onia-higgsfield`** (acceso
> completo: Facebook, Instagram y buscadores). La sucesora carga primero la skill **`onia-ventas-pauta`** (lo
> aprendido, para no re-investigar) y después lee este archivo: el estado vigente está en los campos de abajo, y
> la tabla «Verificar los 28 prospectos» está al final.
>
> **Renombrada el 30-sep, de noche, por decisión de Sergio Urcullo.** El archivo conserva su nombre para no
> romper enlaces.
>
> **Es dueña de conseguir clínicas:** la lista de las primeras 10 para el contacto 1:1, el registro de
> objeciones de cada demo, Meta Ads de punta a punta (piezas del anuncio incluidas; D1 y D4 vuelven acá) y
> @oniahq solo como la página que pauta.
>
> **No es suya:** los carruseles de contenido, que son de Marca personal; el producto; el VPS; el chatbot,
> que Sergio Urcullo dijo el 30-sep que lo arregla él.

> Rama `claude/nice-lamport-5og9lv` · sesión `session_01BnctfaNRsm3ogJ46A7B5P5` · abierta el 2026-09-30.
> Formato: los siete campos de `README.md` de esta carpeta.
> Página para Sergio Urcullo con el resumen y las cinco decisiones: https://claude.ai/artifact/NpSFgbLpND6Ruh8QMu63ts (privada).

**Objetivo**

Dejar decidido **con datos** a quién y por dónde se vende Onia Platform, y la campaña de Meta lista para
crear en PAUSA. "Hecho" =
1. veredicto sobre «¿uno o siete rubros?» con números → ✅ `ONIA_CLIENTE_IDEAL.md` §6 y §7;
2. competencia **por adquisición** + prospectos con señal → ✅ `ONIA_ADQUISICION_Y_PAUTA.md` §2-§3 y
   `ONIA_PROSPECTOS_DENTAL_SCZ.md` §5;
3. campaña especificada con techo, criterios de corte y bloqueos con dueño → ✅ `ONIA_ADQUISICION_Y_PAUTA.md`
   §5-§6 (**creada: no** — el conector de Meta está en otra cuenta; ver *Qué depende de Sergio*);
4. funciones y productos nuevos por el test de tres preguntas → ✅ `ONIA_ESTRATEGIA_DE_EMPRESA.md` §14;
5. cada sesión avisada de lo que le toca → ✅ EL HILO (`COORDINATION_MANIFEST.md`) + dos avisos directos a
   Plataforma.

Pedido textual de Sergio Urcullo: *"revisar si es rentable colocar tantos rubros… me dicen si ofreces a
demasiadas personas nunca vas a vender nada… revisar meta ads, revisar clasificaciones, revisar
competidores… armar las campañas de meta"* y, a mitad de sesión, *"qué funciones deberíamos añadir…
agentes que hablan con agentes… posibles nuevos productos… un marketplace como Uber, Yango, PedidosYa"*.

**Qué quedó EN PRODUCCIÓN**

Nada del producto: este carril no toca código ni la web. Lo que quedó publicado son docs en `main` (vía el
autosync de esta rama). **Ninguna campaña creada, cero gasto.**

**Qué quedó a medias, y dónde** (al 1-oct, 20:30 UTC; todo commiteado y en `main`)

- **D1 y D4 (piezas del anuncio): renderizadas, esperan el OK de Sergio Urcullo.** Salieron con las capturas
  **candidatas** de la 1.0, recortadas a la prueba (`3834f60a`). Están en
  `carousels/out/ads/onia-platform-dental-meta-d1-candidato/` y `…-d4-candidato/` (7 láminas y
  `_contactsheet.png` cada una). Las capturas viven en `carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/`
  (`recortes/` y su README). **No se copian a la carpeta aprobada sin el OK de Sergio Urcullo.** Límite visto:
  el marco de captura del pack `community-editorial` mide ~450×300, y en el celular se lee justo. Si Sergio
  Urcullo lo juzga ilegible, la salida es un layout de captura a todo ancho en `scripts/carousel_render.js`
  (renderer compartido: avisar a Marca personal antes de tocarlo).
- **La campaña de Meta: especificada, NO creada.** Tabla en `ONIA_ADQUISICION_Y_PAUTA.md` §5.8; pasos exactos
  para crearla en pausa en §5.8.1; qué falta para encender en §5.9. Bloqueo principal: el conector de Meta
  no ve ONIA Ads (re-medido el 1-oct a las 20:15 UTC).
- **Prospectos: VERIFICADOS el 1-oct, de noche. Nadie contactado.**
  - **8 listos:** Spadental, Nexo, Klynink Medic, DASHA, Corpo Belo, Jhimbo, Quevedo y KAIS. Cada uno tiene su
    mensaje y una condición de tamaño o sede para la primera pregunta.
  - **13 en espera**, porque falta la ciudad, el tamaño o el canal, y eso solo se ve dentro de Facebook:
    - dental: San Pedro, Camacho, MUN, Jáuregui, Odontoclínica y Dentalife;
    - estética: Afrodita, Pimentel, JP Body Sculpt, Norvet y Gelinski;
    - importadoras: Todo Frenos y ReMel.
  - **8 salieron:** Odontoking (28 profesionales), Cortez (multi-sede), Serderma (La Paz, multi-sede), Dermamedic
    (Cochabamba), PUNTO SPA (La Paz), Gloss (ya usa AgendaPro), FisioBel (es una tienda) y EMTOP (red de una marca).
  - **Reserva dental:** no cubre los cupos libres. Vid tiene 8 profesionales y Stildent no pauta. Natural Smile y
    Rocha quedan sin dato.
  - **Reserva de estética:** Zona Estética Spa y Derma Peel, con Santa Cruz y WhatsApp confirmados, son las
    primeras.
  - *Lo de abajo es el estado del 1-oct a la tarde, antes de verificar:*
  - 10 dentales: `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.1 y §6.5. Los cupos 9-10 (Spadental, MUN) salieron de la
    Biblioteca de Anuncios en vivo el 1-oct.
  - 12 de estética y 6 importadoras: `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`, re-leídas en vivo el 1-oct
    (`c6a4caa5`). Cames bajó a reserva.
  - Página con «Copiar mensaje» y botones: https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV. Su fuente es
    `primeras-clinicas.html` en el scratchpad de esta sesión, que **se pierde** con ella. Si hay que cambiar la
    página, se lee con `Artifact read` y se republica al mismo URL.
  - En **ninguno** se verificó ciudad, tamaño ni WhatsApp abriendo su página: desde la nube vieja, Facebook e
    Instagram daban 403. Es lo primero que puede hacer la sucesora (tabla al final).
- **Leads que ya escribieron: borradores listos, nada enviado** (`ONIA_LEADS_ESPERANDO.md` §3). El de 4
  doctores (conv 35) tiene sus 6 respuestas verificadas leyendo el código de `onia-platform` `origin/master`
  `a7f228c`. Dos son un «no»: los períodos de 15/30/60 y el PDF. **La 1.0 ya está en producción**
  (`release-4dc829e8` la contiene). **Crece con 4 usuarios todavía no:** no se cotiza Crece para 4.
- **Pruebas por vencer (pedido de la madre):** las mira la madre en la PC, con acceso a la base. Los borradores A
  y B de seguimiento están en el transcript de esta sesión (`session_01BnctfaNRsm3ogJ46A7B5P5`).
- **Guion de demo de 20 minutos por rubro: escrito** (`hermes-content/sales-kit/02-GUION-DEMO.md`), con la prueba
  de cada capacidad en el código. ⛔ **No hay cuenta demo en producción** (§0.1 del guion): sin ella no hay
  demo. Al seed le faltan datos de estética y servicios (pedido para Plataforma). **Sin tocar y desalineados**
  con los precios y planes de hoy: `sales-kit/04-OBJECIONES.md` y `05-CHECKLIST-CAPTURAS.md` (DentalGest,
  «Pro Bs 750», trimestral, SIAT). Hay que corregirlos antes de usarlos.
- **Pedidos abiertos a otros carriles** (EL HILO, 30-sep): página de entrada para clínicas (Plataforma). El bot
  listo para pauta y el `referral` que Chatwoot descarta son del carril chatbot, que Sergio Urcullo dijo que
  arregla él.

**Archivos y cambios**

- Nuevo: `hermes-content/docs/ONIA_ADQUISICION_Y_PAUTA.md` — fuente sin fecha de *cómo se consiguen clientes*.
- Nuevos (30-sep, tarde): briefs `carousels/briefs/ads/onia-platform-dental-meta-d1-los-de-manana.json` y
  `…-d4-tratamiento-a-medias.json` · `carousels/briefs/assets/onia-1.0-dental-ads/README.md` (las cuatro capturas) ·
  `scripts/carousel_cloud_setup.sh` (render en la nube igual al de la PC) · trampa en la skill
  `diseno-contenido-onia` §5, puntos 5 y 6.
- Editados: `ONIA_CLIENTE_IDEAL.md` (§2 matiz de la IA, §6 «¿uno o siete?», §7 tamaño del segmento) ·
  `ONIA_ESTRATEGIA_DE_EMPRESA.md` (§0 punto 12; §14: Recall de tratamiento a medias, agentes que hablan con
  agentes, marketplace) · `ONIA_PROSPECTOS_DENTAL_SCZ.md` (§5, clínicas que pagan pauta) ·
  `ONIA_DENTALGEST_ESTRUCTURA_ULTIMA_MILLA_2026.md` (corrección TuDoc/SIAT) · `ONIA_CATALOGO_DE_IDEAS.md`
  (puntero a §14) · `ONIA_PAUTA_COMPETENCIA_20260815.md` y `ONIA_ADS_CAMPANA_1_LISTA_20260813.md` (marcadas
  como fotos de agosto) · `COORDINATION_MANIFEST.md` §EL HILO (fila Mercado, id vivo de Lucía, avisos).
- Investigación completa, con fuentes: `research/ONIA_MERCADO_COMPETENCIA_BOLIVIA_20260930.md` ·
  `ONIA_TENDENCIAS_AGENTES_20260930.md` · `ONIA_MARKETPLACE_EVALUACION_20260930.md` ·
  `ONIA_META_ADS_PLAYBOOK_20260930.md` · `ONIA_BIBLIOTECA_ANUNCIOS_20260930.md`.
- **1-oct:** `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6.5 (cupos 9-10) · `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` (re-lectura
  en vivo, 18 negocios) · `ONIA_ADQUISICION_Y_PAUTA.md` §5.8.1 y filas 2, 7 y 8 de §5.9 ·
  `ONIA_LEADS_ESPERANDO.md` §3 (borradores) · `sales-kit/02-GUION-DEMO.md` (guion por rubro) ·
  skill nueva `.claude/skills/onia-ventas-pauta/SKILL.md` (sumada a `onia-router`) ·
  `carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/recortes/` · `carousels/out/ads/*-candidato/`.

**Intentos fallidos**

- **1-oct, de noche: la red completa del entorno «Default» no alcanza para Facebook.** `facebook.com` redirige al
  login, con `curl` y con Chromium. Abrir Instagram, `wa.me` y Maps con Chromium (con la huella de la CA del
  proxy) **lo bloqueó el control de permisos** («Containment Escape»), y no se reintentó por otro lado. Lo que
  funcionó: las webs propias, el directorio `beautynailhairsalons.com` por `page_id` (solo estética),
  directorios públicos y el conector. Está en la skill, §2 y §6.
- **1-oct, de noche: redactar antes de verificar salió caro.** 8 de 28 prospectos salieron al verificarlos, y 2
  líneas «Vi…» estaban viejas (San Pedro y Camacho). La regla quedó en la skill §2: se verifica antes de redactar.

- **El conector de Meta Ads sigue en OTRA cuenta de Facebook** (NUVO 1usd / Arthur Fuentes). Sirve para la
  Biblioteca de Anuncios (lectura pública), **no** para crear en ONIA Ads. Mirar primero `ads_get_ad_accounts`:
  si no aparece `1073680778314945`, no sirve para crear. **Nunca gastar en esas dos.**
- **El proxy de la sesión no llega a `facebook.com` ni a `onia.com.bo`** (curl → `000`): los creativos de la
  competencia y la home renderizada **no se pudieron mirar**. `onia.com.bo` se mira desde el entorno de nube
  `onia-higgsfield` o desde la PC.
- **El cupo de búsquedas web de la sesión se agotó (200/200)** con cuatro subagentes investigando en paralelo, y
  el proxy devolvió 403/`EGRESS_BLOCKED` en casi todas las páginas: lo marcado *vía buscador* es extracto, no
  lectura. **Lección:** con varios subagentes, repartir el cupo o darle a cada uno un tope de búsquedas.
- **Dos hipótesis falsas encadenadas, la segunda mía:**
  1. Que los anuncios del 21-sep solo tenían mal el precio. Mirando el código de producción, el problema era
     mayor: producción **no** detecta el tratamiento a medias (solo *sin visita ≥180 días*).
  2. **Que la 1.0 tampoco lo detectaba.** Lo afirmé en los docs, en EL HILO y en un aviso directo a Plataforma
     (03:52 UTC), y propuse construirlo en 3–7 días. **Era falso:** en la 1.0 lo busqué con un `grep` sobre
     *una* función (`evaluateRecallCandidates`, sigue en 180) y generalicé; el módulo
     `agents-tratamiento-a-medias.ts` (21 días, decisión de Sergio Urcullo del 29-sep) estaba al lado. Lo
     marcó el plan de Plataforma. Corregido en todos los lugares con la marca ⚠️ y con un aviso de corrección.
     **Lección:** un `grep` sirve para descartar, nunca para confirmar una ausencia; para decir "ningún agente
     lo hace" se lista el módulo entero (`ls lib/onia-core/modules/`).
- **Renderizar en la nube, cuatro intentos (30-sep, tarde):**
  1. Chromium completo con `CAROUSEL_BROWSER`: letra DejaVu, pie cortado y capturas vacías.
  2. Fuentes instaladas en WOFF: fontconfig las lista, Chromium no las toma.
  3. `--proxy-server` apuntando al proxy de la sesión: tampoco trae las fuentes.
  4. `headless_shell` más fuentes en **TTF**: sale igual que en la PC. Quedó en `scripts/carousel_cloud_setup.sh`.

  Las capturas vacías eran otra cosa: el carrusel del 21-sep apuntaba a `docs/recorrido/capturas/`, que está en
  `.gitignore`. **Lección:** antes de dar por buena una pieza renderizada en otra máquina, mirar que sus
  capturas estén versionadas.
- **Frase que hubo que corregir en la misma sesión:** escribí que ningún competidor *ofrece* el agente que
  propone a quién recuperar. Lo medido es que ninguno lo *titula* en su pauta; la web de Dentalink anuncia
  *recall* y *"venta de tratamientos"* (sin abrir). Quedó corregido en `ONIA_CLIENTE_IDEAL.md` §2.
- **Sin llave del VPS en esta sesión:** no se pudo re-medir la cuenta ONIA Ads por Graph API, ni los leads, ni
  los pagos. Lo que dice "no re-medido hoy" viene de handoffs del 21 y 27-sep.
- **`ads_create_ad` trabaja en modo borrador** (leído en el conector el 1-oct): los anuncios quedan en DRAFT, y
  `ads_activate_entity` sobre la campaña **los publica en ACTIVO, gastando**. «Crear en pausa» termina antes de
  esa llamada (§5.8.1).
- **Las capturas candidatas enteras se veían como manchas** dentro del marco de ~450×300 del pack. Recortarlas
  a la tarjeta que prueba el punto duplicó el tamaño legible. No alcanza para leer todo en el celular.
- **Cada `ads_library_search` trae solo el título del enlace**, no el texto ni la imagen del anuncio, y corta en
  50 resultados. Con estado ALL no devuelve los inactivos: no se sabe cuándo dejó de pautar Cames.

**Qué depende de Sergio Urcullo** (lo mínimo, en orden). **Actualizado el 1-oct, de noche:**

- **OK al primer lote de 8**, mensaje por mensaje, en la página. Los envía él.
- **Los 13 en espera:** abrir su Facebook desde la PC y contar profesionales y sedes, o decir que se reemplacen.
- **Tarjeta en ONIA Ads**: es lo único que falta en la cuenta. Re-medido el 1-oct a las 21:40 UTC:
  `has_payment_method: false`. La página «Onia» sí sirve: la lista de las 21:15 estaba mal leída (skill §5).
  Instagram no está vinculado a ONIA Ads.
- **OK a D1 y D4 viéndolas**, y **OK explícito para crear la campaña en pausa** (§5.8.1).

Lista anterior (sigue vigente salvo el punto 4, que ya está hecho):

1. **Decidir la cuenta demo:** el 1-oct dijo «no se crean demos». ¿Eso incluye la cuenta para mostrar Onia en
   las demos de venta? Sin ella no se puede hacer ninguna (`sales-kit/02-GUION-DEMO.md` §0.1).
2. **OK a los mensajes** de los leads que ya escribieron (`ONIA_LEADS_ESPERANDO.md` §3).
3. **Mirar D1 y D4 renderizadas** (`carousels/out/ads/*-candidato/_contactsheet.png`) y decir: sirven / la
   captura no se lee.
4. **OK al primer lote de mensajes 1:1** de la página de 28, después de la verificación de la tabla de abajo.
5. **Meta:** reconectar el conector con el usuario que administra ONIA Ads, poner la tarjeta en ONIA Ads,
   confirmar la página «Onia» y su WhatsApp, y averiguar a qué tipo de cambio cobra el banco. Después, el OK de
   gasto con techo (~~USD 140~~ **USD 56, 14 días, Bs 750**: corregido el 8-oct).
6. Lo de siempre: quién contesta las conversaciones de la pauta (fila 6 de §5.9) y la fecha del CIO 2026.

**Próximos pasos — vigentes desde el 1-oct, de noche:**
1. Con el OK de Sergio Urcullo, enviar el lote de 8 (lo envía él). *Listo = cada envío anotado en la columna Estado
   de su doc fuente, con la fecha.*
2. Resolver los 13 en espera desde la PC (madre o Sergio Urcullo), o reemplazarlos con la reserva. *Listo = cada uno
   en SIGUE o en SALE.*
3. Llenar el registro de objeciones el mismo día de cada demo. Antes hay que destrabar la **cuenta demo**: sin ella
   no hay demo.
4. Meta: con la tarjeta cargada, crear la campaña con §5.8.1 hasta el paso 6.
5. D1 y D4: esperan que Sergio Urcullo las mire.

*Próximos pasos del relevo (1-oct, tarde). El 1 ya está hecho:*

1. **Verificar los 28 prospectos** con la tabla de abajo → *listo = cada fila marcada sigue / sale, con el dato
   que la decide anotado en su doc fuente*.
2. Mostrarle a Sergio Urcullo los mensajes de los que siguen, y los de los leads → *listo = OK por escrito,
   mensaje por mensaje*. Los envía él.
3. Llenar el registro de objeciones el mismo día de cada demo (`ONIA_PROSPECTOS_DENTAL_SCZ.md` §7 y
   `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md`, «Registro de objeciones»). Regla: 10 demos y nadie paga → se
   cambia el producto, no el discurso.
4. D1 y D4: con el OK de Sergio Urcullo a las capturas, copiarlas a la carpeta aprobada, re-renderizar y
   mostrarlas → *listo = piezas aprobadas viéndolas*.
5. Cuando `ads_get_ad_accounts` liste `1073680778314945`, crear la campaña con §5.8.1 **hasta el paso 6** →
   *listo = ids anotados acá*. Encender (paso 7) solo con el OK escrito de gasto.

### Verificar los 28 prospectos — ✅ HECHO el 1-oct, de noche

El resultado está en §6.6 (dental), §1.6 y §2.5 (otros rubros). La tabla de abajo es historia: dice qué se pedía
mirar.

En **todos**: (a) que sea de **Santa Cruz**; (b) que tenga **2 a 6** profesionales o empleados; (c) que tenga un
**WhatsApp** propio y activo; (d) que el anuncio siga **activo**; (e) releer la línea «Vi…» del mensaje contra lo
que se ve ese día. Si falla (a) o (b), sale y entra uno de la reserva de su doc. La columna «Además» es lo propio
de cada uno. Ids de anuncio = `facebook.com/ads/library/?id=<id>`.

| # | Negocio | Abrir | Además |
|---|---|---|---|
| D1 | Odontoking Clínica Dental | facebook.com/odontoking.scz · wa.me/59162000223 | web odontoking.com: siguen 4+ doctores. ¿Es «F», el lead de conv 35 (+59173232758)? Si sí, NO se le escribe por acá |
| D2 | Clínica Dental San Pedro | facebook.com/ads/library/?id=4488078054763407 · instagram.com/clinica_dental_san_pedro · wa.me/59175310054 | web clinicadentalsanpedro.com.bo: contar profesionales (riesgo de pasar de 6) |
| D3 | Nexo Odontología Integral | wa.me/59172102164 | web nexoodontologiaintegral.com: contar profesionales |
| D4 | Clínica Dental Cortez (sede Santa Cruz) | facebook.com/ads/library/?id=28382463031414540 · instagram.com/clinicadentalcortez_santacruz · wa.me/59174165595 | web clinicadentalcortez.com.bo: que el WhatsApp sea de la sede SCZ; contar profesionales |
| D5 | Clínica Dental Jáuregui | instagram.com/clinica.dental.jauregui | contar profesionales |
| D6 | Odontoclínica | instagram.com/odontoclinicabo · wa.me/59170202576 | contar profesionales |
| D7 | Clínica Dentalife (SRL) | instagram.com/clinicadentalifesrl | contar profesionales |
| D8 | Clínica Dental Camacho | instagram.com/clinicadentalcamacho | contar profesionales; ¿siguen publicando? |
| D9 | Clínica Dental Ezequiel – Spadental | facebook.com/ads/library/?id=957751963254738 · facebook.com/758264870991469 | ciudad SCZ; ¿más de un doctor? Si es 1, sale |
| D10 | MUN Clínica Odontología Especializada | facebook.com/ads/library/?id=1586919549733766 · facebook.com/572588712615373 | ciudad SCZ (si no, sale); cuántos especialistas |
| E1 | Serderma – Skin Care & Repair | facebook.com/ads/library/?id=1627500379414059 · facebook.com/106801775686899 | Ciudad: solo la ubica en Santa Cruz la búsqueda de Mercado. Un título dice «Perfil nuevo»: confirmar que ésa es la página vigente |
| E2 | Dermamedic | facebook.com/ads/library/?id=1483115053721898 · facebook.com/1427662330819904 | Si es estética o consulta dermatológica médica. Contar profesionales: si pasa de 6, sale |
| E3 | DASHA SPA SCZ | facebook.com/ads/library/?id=954501251031123 · facebook.com/104974815691833 | Tamaño y recepción. Que no sea una cadena con sucursales |
| E4 | Pimentel Centro Estético y Spa | facebook.com/ads/library/?id=917663934510569 · facebook.com/104724632014604 | Ciudad y tamaño. Si el mensaje sale del lunes 5-oct en adelante, cambiar «esta semana» |
| E5 | JP Body Sculpt Estética | facebook.com/ads/library/?id=1100160929651066 · facebook.com/447449838452412 | Ciudad y tamaño. Que sea estética corporal («Body Sculpt» lo sugiere [inferencia]). Si lo central es vender paquetes de sesiones, sale: Onia no los tiene y en la demo … |
| E6 | FisioBel – Fisioterapia y Belleza | facebook.com/ads/library/?id=2250081115857981 · facebook.com/163134980227265 | Si pesa más la fisioterapia que la belleza: el pack es de estética y habla de «clientas». Tamaño |
| E7 | Spa Norvet | facebook.com/ads/library/?id=2169920297256782 · facebook.com/1115743118298684 | Ciudad y tamaño. Si el mensaje sale del lunes 5-oct en adelante, cambiar «esta semana» |
| E8 | Spa Corpo Belo | facebook.com/ads/library/?id=1791957192125527 · facebook.com/108487890540798 | Que las promociones sigan. Si vende sobre todo paquetes. El mensaje no repite sus precios |
| E9 | Gelinski Medicina Estética & Spa | facebook.com/ads/library/?id=1404213515022283 · facebook.com/1065901009942124 | Ciudad: la búsqueda no decía Santa Cruz. Contar profesionales: si es una sola médica, sale. Si es medicina estética más que spa |
| E10 | Afrodita Medicina Estética central | facebook.com/ads/library/?id=28654751507525138 · facebook.com/1099521206570111 | Ciudad. Si tiene sucursales, sale (multi-sede). Tamaño |
| E11 | PUNTO SPA | facebook.com/ads/library/?id=3231165610411166 · facebook.com/1775902156003112 | Ciudad y tamaño. «Peel + peeling + puntas de diamante» puede ser un combo: si vende sobre todo paquetes, sale |
| E12 | Gloss Skin Spa | facebook.com/ads/library/?id=1612878703668081 · facebook.com/212395831963932 | Ciudad y tamaño. Que la pauta siga: son 2 anuncios de un solo día |
| I1 | Todo Frenos Bolivia | facebook.com/ads/library/?id=2299529400584400 · facebook.com/1635734929973915 | Ciudad. Si importa directo o le compra a un importador (si no importa, el costeo no le sirve). Si a los talleres les vende con precio por cliente |
| I2 | Importadora Jhimbo y Jhimbo Importadora | facebook.com/ads/library/?id=1752608759191474 · facebook.com/103300217870326 · facebook.com/2242967225958211 | Ciudad. Por qué hay dos páginas: si son dos sedes, Onia no tiene multi-sede. Si vende en dólares |
| I3 | Importadora ReMel Medical y REMEL Medical SC | facebook.com/ads/library/?id=1824706905373809 · facebook.com/107403528165762 · facebook.com/918686151335600 | Si «SC» es Santa Cruz. Qué importa («Medical» sugiere insumos médicos [inferencia]). Si vende por licitación o con precio por cliente, no calza |
| I4 | EMTOP Bolivia – SCZ | facebook.com/ads/library/?id=1383787037302290 · facebook.com/303629722824572 | Tamaño. Si importan ellos o compran al representante de la marca («herramientas EMTOP» es [inferencia] por el nombre). Si a las ferreterías les venden con lista por cl… |
| I5 | Importadora Quevedo | facebook.com/ads/library/?id=1671744687713413 · facebook.com/1562055387425917 | Qué importa: no se sabe (los títulos no lo dicen). Ciudad. Moneda de la cuenta USD: si también vende en dólares, no calza. Si cotiza por WhatsApp, en la demo no se mue… |
| I6 | Importadora KAIS | facebook.com/ads/library/?id=899867776391088 · facebook.com/101059708412214 | Qué importa: no se sabe. Ciudad y tamaño. Si vende al por mayor con precio por cliente, no calza |

<details><summary>Próximos pasos del 30-sep (historia)</summary>

1. Sergio Urcullo contesta a los 5 → *listo = cinco respuestas enviadas, con capacidades verificadas en el producto*.
2. Plataforma responde por EL HILO los pedidos del 2.º aviso (bot para pauta, BSUID, `referral`) → *listo =
   respuesta anotada en EL HILO*.
3. ✅ **Lista de las primeras clínicas para contacto 1:1 (30-sep, de noche):** quedaron 8 de 10 en
   `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6. Cada una trae señal, fuente, canal público y mensaje propuesto; en §6.4 hay
   una reserva para los 2 cupos que faltan. §7 es el registro de objeciones de las demos.
   - Página para Sergio Urcullo, con «Copiar» y «Abrir en WhatsApp»: https://claude.ai/artifact/8sFD37TVJMcEJaHcZ2PWSV.
   - **Nadie fue contactado**: cada envío espera su OK.
   - Nada se re-verificó en vivo, porque el proxy bloqueó las webs, Facebook e Instagram. Por eso cada ficha trae
     su lista «Antes de enviar».
   - *Siguiente:* con las respuestas, llenar §7 y cargar las demos en el tablero de Control.
   - **Ampliado el 30-sep, de noche** (Sergio Urcullo: *«no solo somos clínica»*):
     - `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` suma 8 de estética y 5 importadoras, con mensaje.
     - Comercio y servicios: 5 candidatos cada uno, sin mensaje hasta que la 1.0 arregle lo que falla en una
       demo.
     - Los 21 están en la misma página, separados por rubro.
     - Estética e importadora salen de la Biblioteca de Anuncios, que busca por texto: ciudad y tamaño quedan
       sin verificar.
4. Destrabar los 8 bloqueos de `ONIA_ADQUISICION_Y_PAUTA.md` §6 → *listo = `ads_get_ad_accounts` ve ONIA Ads con
   método de pago y página promocionable*.
5. Creativos (**los hace esta sesión**): llegan las cuatro capturas de la 1.0 → se renderizan D1 y D4 con `scripts/carousel_cloud_setup.sh` → se le muestran a Sergio Urcullo →
   *listo = piezas miradas y aprobadas por él, sin precio en la imagen, CTA "Escribinos", código por anuncio*.
   (Briefs listos desde el 30-sep.)
6. Crear la campaña en PAUSA con la tabla del §5.8 → *listo = ids de campaña/conjunto/anuncios anotados acá*.
7. Encender con el OK de Sergio Urcullo; mirar a los 7 días, decidir a los 14 → *listo = costo por
   conversación calificada medido y anotado en `ONIA_ADQUISICION_Y_PAUTA.md` §5.3 como benchmark propio*.

</details>
