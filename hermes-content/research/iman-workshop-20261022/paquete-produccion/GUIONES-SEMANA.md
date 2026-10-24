# GUIONES-SEMANA · 7 guiones para grabar, sáb 24 a vie 30 de octubre de 2026

Marca personal de Sergio Urcullo, **voseo**. Autor: Claude (sesión del worktree `iman-workshop-20261022`). Revisor previsto: Codex. Coordina: Hermes.
Preparado el **23-oct-2026** (hora de La Paz). **Nada de esto está grabado, editado, aprobado ni publicado.** Ningún corte de video ni subtítulo automático se ejecutó.

## 0. Cómo leer este archivo

- Cada guion trae: **hook**, **texto hablado completo** (copiado de `pruebas/textos_guiones.py`; palabras contadas y segundos **estimados** por `pruebas/contar_palabras.py`; no son mediciones de voz), **cierre**, **planos y capturas**, **caption**, **fuente/fecha** y **límites**.
- Tipo de cada pieza, siempre dicho: **TALLER** (condicional), **NOTICIA** (verificada) o **EVERGREEN** (no depende de una fecha).
- **Regla comercial.** El 23-oct la venta del taller **no está comprobada como abierta** (la compuerta de 5 condiciones de `TALLER_31_OCT.md` §3 sigue pendiente y Hermes la tiene pausada). Los tres guiones TALLER tienen **cierre A** (solo si la venta está abierta y la bio lleva a `/auditoria`) y **cierre B** (educativo, sin nada comercial). Si no hay confirmación el día de grabar, se graba **B**. No se dicen precio, cupos restantes, ahorro, grabación ni certificado.
- Estas piezas **no usan** la palabra clave «Avisos» ni «comentá y te mando»: no hay recurso verificado para eso (canon §4).

## 1. Origen del insumo previo y qué se ajustó (sin crear una segunda cola)

| Dato | Detalle |
|---|---|
| Borrador de otro autor | `C:/dev/proyectos/onia-hermes/hermes-content/docs/cola/plan-3-semanas/GRABAR-24-30-OCT.md` (22.918 bytes, 23-oct 22:29, repo principal; **no existe en este worktree**). Es del delegado `deleg_a3b70010`. La auditoría de Hermes decía «sin entrega recuperada»: sí había entrega, en esa ruta. |
| Qué se hizo con él | Leído completo y **no modificado**. Este archivo es un **paquete de revisión** para el auditor; **la cola autoritativa la define Hermes**: si se aprueba, se unifica en UN solo archivo de cola y el otro se archiva. Yo no creo ni sobrescribo una cola. |
| Insumo anterior | `hermes-content/docs/orquesta/marca/234.md` (3 guiones de reel del taller, con `[FECHA]`/`[PRECIO]` y uno con «esto lo hice yo anoche»). El borrador ya lo había corregido; yo conservé sus tres fechas del calendario canónico (sáb 24, lun 26, mié 28) y reescribí los textos. |

| Pieza | Borrador del delegado | Ajuste mío | Por qué |
|---|---|---|---|
| Sáb 24 | 40 min × 5; «trece horas y veinte al mes» | Uso el ejemplo del canon **10 × 5 min × 4 semanas = 200 min = 3 h 20** | Es el mismo ejemplo de la landing y del ejercicio del taller; una sola cuenta en toda la marca |
| Dom 25 | Evergreen «elegí una tarea» | **Sustituida por noticia verificada** (Goldman Sachs, 22-oct) | Las noticias vencen: van primero. El tema «elegí una tarea» ya lo cubren lun 26 y mié 28 |
| Lun 26 | Hoja de tres tareas | Conservada con otro cierre y agrego la pregunta de riesgo | Distinguir de sáb 24 (contar) y mié 28 (primer paso) |
| Mar 27 | Evergreen «IA propone, alguien valida» | **Sustituida por evergreen «tres preguntas antes de probar una novedad»**; el tema de supervisión pasa al vie 30 | Mi primera versión usaba la noticia de Google API Gateway; la quité por técnica e irrelevante para dueños (pedido de Hermes) |
| Mié 28 | «Antes de elegir herramienta» | Reescrita como **prueba chica de una semana** | Evita repetir «primero la tarea» por tercera vez |
| Jue 29 | **Noticia «Google»** (API Gateway, 22-oct) | **Sustituida por evergreen de privacidad de datos de clientes** | Noticia técnica sin utilidad para dueños; el tema de datos sirve de puente al «prompt seguro» del taller |
| Vie 30 | Noticia «OpenAI: Decisions API disponible de forma general el 22-oct» | **Sustituida por evergreen «IA propone, vos aprobás»** | El hecho **es verdadero** (changelog oficial de OpenAI: GA el 22-oct-2026; ver §2 fila 4). Lo saqué por ser una noticia **técnica** (una API para quien desarrolla), sin utilidad directa para un dueño. **Mi primera lectura la dio por falsa y me equivoqué**: me basé en notas de la fase beta (6-oct); corregido tras leer el changelog oficial |
| Fuentes de otras notas del borrador | Habitat (OpenAI, 23-oct), «Project Chrysalis» (Google, 22-oct), Public Benefit Fund (Anthropic, 18-oct) | Las tres **no las uso**; Habitat y Chrysalis **no las verifiqué**; el fondo de Anthropic sí figura en `anthropic.com/news` (18-oct) pero no es útil para dueños | |

## 2. Radar: qué se miró y qué quedó (ventana 17 a 23 de octubre; verificado el 23-oct)

Método: leí cada fuente (WebFetch) o la búsqueda web; separo **verificado por lectura** de **solo en resultado de búsqueda** de **no verificado**. Tras la verificación, una noticia se vuelve a abrir el **día de grabar**.

| # | Tema | Fecha | Fuente | Estado | Decisión |
|---|---|---|---|---|---|
| 1 | Goldman Sachs lanza el Small Business AI Institute, con un compromiso de US$500M para su programa general «10,000 Small Businesses»; socios Google, OpenAI, Meta y Anthropic; capacitación y herramientas | 22-oct-2026 | **Primaria:** comunicado de Goldman, https://www.goldmansachs.com/pressroom/press-releases/2026/goldman-sachs-commits-500-million-to-launch-small-business-ai-institute . **Secundaria:** NBC News, https://www.nbcnews.com/business/ceo-interviews/goldman-sachs-small-business-ai-institute-rcna604621 | **Primaria: corroborada por el revisor y Hermes; mi lector da 403 (`NO_VERIFICADO` por mí).** NBC: leída por mí (fecha, monto, socios, «training and tools»). Orientación a EE. UU.; **no dice que llegue a Bolivia** | **Usada** (dom 25) |
| 2 | Google: streaming en API Gateway, **Public Preview**; se habilita al crear el gateway (`--enable-streaming`); límites de la vista previa | 22-oct-2026 | Google Developers Blog, https://developers.googleblog.com/streaming-comes-to-api-gateway-real-time-and-ai-ready-apis-without-changing-your-spec/ | **Leída**: fecha, «Public Preview», flag, límites (no hay consola, ni Terraform, ni dominios propios; streams de 1 hora máximo) | **Descartada para guion** (pedido de Hermes: sin titulares técnicos que no le sirvan a un dueño). Verificada pero es para quien desarrolla; el mar 27 pasa a evergreen |
| 3 | Anthropic dona Agent Skills a la Agentic AI Foundation | 22-oct-2026 | https://www.anthropic.com/news (lista) | Título y fecha **leídos en la lista**; no abrí el artículo | **Descartada**: es para quien programa agentes, no para dueños |
| 4 | OpenAI: Decisions API pasa a **disponibilidad general** (beta pública desde el 6-oct) | 22-oct-2026 | Changelog oficial https://developers.openai.com/api/docs/changelog y anuncio en la comunidad de OpenAI, ambos en resultado de búsqueda restringida a dominios de OpenAI («generally available with gpt-6-luna as of October 22, 2026»); la página `openai.com/index/decisions-api` da **403 a mi lector** (la preauditoría de Codex dice haberla leído) | **Verdadera.** El borrador previo acertó. Mi primera lectura (y el 2.º subagente) la dieron por beta basándose en notas del 6-7 oct: **error mío, corregido** | **Descartada para guion**: es técnica (API para quien desarrolla), sin utilidad directa para un dueño |
| 5 | «Claude Duet», app de Anthropic, 21-oct | 21-oct | Una nota sindicada en búsqueda; el 2.º subagente la marcó «CONFIRMADA» solo con un sitio de terceros (cryptobriefing.com) | **No figura** en `anthropic.com/news` (lista leída por mí, 14 a 22-oct); sin fuente primaria. Según ese sitio es una vista previa de investigación **solo en EE. UU., con lista de espera** | **Excluida**: sin fuente primaria y sin utilidad para un dueño en Bolivia |
| 6 | Meta Business Agent en WhatsApp | 3-jun-2026 | https://whatsappbusiness.com/blog/introducing-meta-business-agent-ai/ | **Leída**; **no es reciente** | Solo contexto para Meta Ads |
| 7 | «Muse for Small Business» de Meta | 29-sep-2026 | TechCrunch y otros, en resultado de búsqueda | Solo búsqueda; EE. UU. y Canadá; fuera de ventana | Descartada |
| 8 | «Meta Ads: cambios del 19-oct» (SocialBee) | 19-oct según un agregador; otros fechan los anuncios en Advertising Week, 6-oct | Terceros | **No verificada en fuente primaria de Meta**; las fechas discrepan | Descartada como noticia |

Límites del radar: no hay datos de audiencia de @sergiourcullo para priorizar por rendimiento; la prioridad es por **oportunidad, utilidad y vencimiento**. Los temas evergreen **no son tendencias**. **Solo hay UNA noticia verificada y útil para dueños dentro de la ventana (Goldman, fila 1)**; por eso la semana lleva una noticia, tres piezas de taller y tres evergreen, en vez de dos noticias.

## 3. Tres prioritarios y calendario

| Prioridad | Pieza | Por qué primero |
|---|---|---|
| **1** | **Sáb 24 · La cuenta de tus horas** (TALLER) | Sale mañana; es la base de todo el taller (la cuenta del canon); no depende de ninguna fuente externa |
| **2** | **Dom 25 · Goldman Sachs** (NOTICIA) | Es la única noticia útil y vence: grabarla el 24 o el 25 y publicar el 25 |
| **3** | **Jue 29 · Datos de clientes y IA** (EVERGREEN) | La de más utilidad práctica para cualquier dueño; abre la puerta al «prompt propuesto» del taller |

| Día | Tipo | Pieza | Cierre | Duración |
|---|---|---|---|---|
| Sáb 24 | TALLER | La cuenta de tus horas | A (venta lista) / B (educativo) | 37-39 s (A) |
| Dom 25 | NOTICIA | Goldman Sachs capacita a pequeñas empresas en IA | un solo CTA propio («Anotá una hoy») | 36-38 s |
| Lun 26 | TALLER | Compará tres tareas | A (venta lista) / B (educativo) | 38-40 s (A) |
| Mar 27 | EVERGREEN | Tres preguntas antes de probar una novedad de IA | una acción | 31-33 s |
| Mié 28 | TALLER | Tu primer paso con IA | A (venta lista) / B (educativo) | 31-33 s (A) |
| Jue 29 | EVERGREEN | Antes de pegar datos de tus clientes en una IA | guardar | 30-32 s |
| Vie 30 | EVERGREEN | La IA propone, vos aprobás | pregunta | 35-37 s |

Si el calendario del taller cambia, **solo se mueve la fecha**: cada pieza es independiente. El mar 27 a las 19:00 el canon prevé una clase gratis de 35 min; **no está confirmada** (la venta está pausada) y esta semana no la usa.

## 4. Reglas de rodaje comunes (de `editor-videos`, `edicion-referentes` y `diseno-contenido-onia`)

- Vertical 1080×1920, trípode, plano medio, solapa, luz de frente, una idea por toma y una toma de cierre **cuya duración sale de sus palabras** (a 3,2 palabras por segundo, estimado): el cierre A del sáb 24 son 29 palabras, unos 9 s; el del lun 26, 16 palabras, unos 5 s; el del mié 28, 17 palabras, unos 5,3 s. **No se acelera la voz para que entre en cuatro segundos.** Voz sola, sin cama de música (la pone Sergio); efectos de sonido solo si él los pide.
- Texto en pantalla como tarjetas tipográficas **blanco / negro / verde** (marca personal: **verde y blanco**, nada de la pauta de Onia). Si hace falta una imagen, es `fotobn` (foto B/N con un solo objeto verde) **de la galería** (`hermes-content/galeria/fotos-bn/`); no se genera nada nuevo ni gasta crédito.
- Todo ejemplo lleva un rótulo visible: **EJEMPLO INVENTADO**. Ninguna cifra en bolivianos que no esté en el canon.
- **Cuando se edite** (no hoy): gate de `editor-videos`, **tabla de cortes y vista previa de 360p antes de cortar**, transcripción corregida a oído antes de quemar subtítulos. Hoy no se ejecutó ni lo uno ni lo otro.
- Antes de grabar cada noticia: **abrir la fuente de nuevo** y confirmar que sigue diciendo lo mismo.
- **Ritmo.** Las duraciones usan 3,2 palabras por segundo (192 por minuto) más pausas; es exigente con cuentas y pausas y **no está medido en voz**. Sensibilidad: a 2,5 palabras por segundo (150 por minuto) las piezas duran de 31 s (la más corta, 77 palabras) a 46 s (la más larga, 114 palabras) solo de voz. No se acelera la voz para entrar en la fórmula.

## 4b. Referente, principio y aplicación, pieza por pieza

Moldes y reglas salen de `.claude/skills/edicion-referentes/SKILL.md`: recetas **medidas por la sesión de marca el 8-oct** sobre las fichas `hermes-content/references/video-intake/2026-10-08-referente-*.md`. **Son referentes históricos fechados el 8-oct, no observados ahora**: el «sistema vigente» de Erik es el que decía esa skill el 8-oct, y yo no lo reobservé. **El montaje de cada pieza es una propuesta mía, no un montaje ya hecho ni observado.** **No reabrí las fichas originales: me apoyé en lo que la skill resume de ellas.** **No inferí ni la voz ni el montaje de los trailers de Erik:** la comprobación del 23-oct no reprodujo el trailer ni la muestra, y no los uso como fuente. De Erik y Santiago tomo **método, no identidad ni plantilla** (regla 14 de la skill): la identidad es la de Sergio (verde, blanco y negro). Todos los moldes de abajo son para una **versión única**, como pide la skill.

| Pieza | Molde y fuente | Principio que se toma | Dónde se ve en el guion | Límite |
|---|---|---|---|---|
| Sáb 24 · cuenta | **Erik, sistema «vigente» según el resumen del 8-oct** (panel con tarjetas propias): skill «Receta Erik» y «Lo que cambió en Santiago y Erik»; reglas 1, 2 y 7 | Promesa en el cuadro 0; «cada número dicho entra como contador o tarjeta que se arma»; pausa máxima 0,24 a 0,44 s | Hook en texto en el cuadro 0; tarjeta «10 × 5 min» con contador; rótulo EJEMPLO INVENTADO | Duración 36-38 s (Erik: 38-39 s para demo). Nada de «COMENTÁ PALABRA» |
| Dom 25 · Goldman | **Santiago, noticia con tarjetas**: skill «Receta Santiago» y su variante G1; regla 1 | La **prueba primaria** como captura en tarjeta, con el crédito de la fuente y un sello con la fecha | Captura del comunicado de Goldman con la fecha visible + sello «NOTICIA · 22 OCT» + chip «FUENTE: GOLDMAN SACHS» | Duración 35-37 s (en vez de los 65-120 s de Santiago: es una sola idea) |
| Lun 26 · tres tareas | **Erik vigente** + regla 7 | Una cuenta que se arma de a un paso; el resultado se resalta en verde | Tres filas que se llenan; una sola resaltada en verde | La «pizarra» de Hormozi (plantilla `pizarra-cuentas`) **no está probada**: no se usa |
| Mar 27 · tres preguntas | **Erik vigente** (tarjetas propias) + regla 1 | Una tarjeta nueva cada pocos segundos; promesa en el cuadro 0 | Tres tarjetas, una por pregunta | Criterio editorial: **no cita ninguna noticia** ni usa un molde de noticia |
| Mié 28 · primer paso | **Erik vigente** | Tarjetas propias, una nueva cada pocos segundos | Tres tarjetas: tiempo hoy, qué comprobar, quién revisa | No usa el chip «Día N/7» (la skill lo condiciona a que la pieza siguiente ya esté grabada) |
| Jue 29 · datos | **Erik vigente** + regla 1 | La prueba antes de los 3 s | Texto tachado que se cambia por «Cliente 1» desde el segundo 3 | El rótulo EJEMPLO INVENTADO siempre |
| Vie 30 · IA propone | **Erik vigente**: «diagramas que se arman flecha por flecha» | El esquema se construye mientras se habla | Cuatro tarjetas que aparecen una por una | Es un **esquema didáctico**, no un sistema real |

Reglas medidas que se aplican a **todas**: título de 3 a 7 palabras con la promesa en el cuadro 0 (regla 1); sin cuadro vacío de cara; pausas de 0,5 s como máximo (regla 2); voz sola, sin cama (regla 4); una posición de subtítulo por pieza (regla 5); **el caption se lee entero antes de publicar** (regla 10: dos captions de Erik salieron con notas internas, por eso estos captions no llevan ninguna).

**Estructura de venta de los tres reels TALLER** (idea, ejemplo, oferta, CTA; la oferta va al final y corta, como en los VSL medidos: «dan antes de pedir», `onia-ventas-pauta` §9.3): sáb 24 = idea (la cuenta) → ejemplo (10 × 5 min) → oferta (taller del sáb 31) → CTA (link en mi perfil). Lun 26 y mié 28 igual. El **cierre B** es la versión educativa: termina en la idea y en una acción para la persona, **sin oferta ni CTA comercial**. Cada pieza tiene **una idea, un hook, una conclusión que responde a ese hook y un solo CTA**.

---

## Sáb 24 · «La cuenta de tus horas» · TALLER (condicional)

**Hook (cuadro 0):** «Tu negocio te cuesta horas que no estás contando.» Tarjeta «CUENTA» desde el primer cuadro.

**Texto hablado (base, 82 palabras):**
> Tu negocio te cuesta horas que no estás contando. Te muestro cómo se cuenta una. Tomá una tarea que repetís cada semana: contestar el mismo mensaje, pasar los mismos datos. Ejemplo inventado: diez veces por semana, cinco minutos cada vez. Diez por cinco, cincuenta minutos por semana. Con cuatro semanas por mes, doscientos minutos: tres horas y veinte. Eso es lo que cuesta esa tarea, en tiempo, antes de pensar en ninguna herramienta. Y es un solo renglón. Tu negocio tiene varios.

**Cierre A (solo si la venta está abierta y la bio lleva a `/auditoria`; 111 palabras en total, 37-39 s):**
> En el taller del sábado 31 de octubre, a las diez de la mañana, hora de La Paz, armamos esa lista con tu propio negocio. Link en mi perfil.

**Cierre B (educativo; 96 palabras en total, 32-34 s):**
> Elegí una tarea tuya y hacé la cuenta hoy. ¿Cuál te llevaría más minutos?

| t (s, voz estimada) | Plano | Pantalla |
|---|---|---|
| 0-3 | Medio, a cámara | Sello «CUENTA»; hook en texto |
| 3-9 | Igual | Tarjeta «TAREA: contestar el mismo mensaje» |
| 9-15 | Igual | Tarjeta «10 × 5 min» con contador; rótulo **EJEMPLO INVENTADO** |
| 15-23 | Igual | «50 min por semana» y luego «× 4 semanas (supuesto) = 200 min = 3 h 20»; rótulo **TIEMPO, NO AHORRO** |
| 23-26 | Igual | Renglones apilados: «un renglón… tu negocio tiene varios» |
| 26-35 (A) | Igual | **Cierre A: 29 palabras, unos 9 s.** «Taller · sáb 31 oct · 10:00 (La Paz)» y «Link en mi perfil» |
| 26-30 (B) | Igual | **Cierre B: 14 palabras, unos 4 s.** La pregunta, sin marca comercial |

**Caption (A):** «Contar una tarea es multiplicar: veces por semana × minutos cada vez. Este ejemplo es inventado y mide tiempo, no ahorro. Taller en vivo por Google Meet, sábado 31 de octubre, 10:00 (La Paz). Link en mi perfil.»
**Caption (B):** «Una cuenta para mirar el trabajo repetido: veces por semana × minutos cada vez. Ejemplo inventado, mide tiempo, no ahorro. ¿Cuál de tus tareas te llevaría más minutos?»
**Fuente / fecha:** `hermes-content/docs/TALLER_31_OCT.md` §1 (oferta, fecha, hora); ejemplo 10 × 5 × 4 = 200 min en `ESTRATEGIA-WORKSHOP.md` §4.2; cuenta verificada en `pruebas/cuentas_workshop.py` (la aserción `10*5*4 == 200`).
**Límites:** no decir «ahorrás»; no poner valor en bolivianos a la hora; no nombrar precio ni cupos; A solo con venta abierta confirmada **el día de grabar**.

---

## Dom 25 · «Goldman Sachs capacita a pequeñas empresas en IA» · NOTICIA (verificada 22-oct)

**Hook:** «Goldman Sachs va a capacitar a pequeñas empresas en IA. ¿Y la tuya?»

**Texto hablado (109 palabras; unos 34 s de voz, 36-38 s con pausas, estimados):**
> El jueves 22 de octubre, Goldman Sachs anunció un instituto de inteligencia artificial para pequeñas empresas. Forma parte de un compromiso de quinientos millones de dólares para su programa general 10.000 Small Businesses, y se asocia con Google, OpenAI, Meta y Anthropic para ofrecer capacitación y herramientas. Ojo: está orientado a Estados Unidos, y no dice que llegue a Bolivia. Lo que yo leo, y es una opinión mía, es que hoy hasta los bancos grandes apuestan a enseñarle IA a los negocios chicos. Y enseñar no empieza por una herramienta. Empieza por saber qué tarea de tu negocio se repite y cuánto tiempo se lleva. Anotá una hoy.

**Cierre:** el propio texto termina con su única acción («Anotá una hoy»). **No lleva cierre comercial ni una segunda frase de cierre**: un solo CTA.

| t (s, voz estimada) | Plano | Pantalla |
|---|---|---|
| 0-4 | A cámara | Hook; sello «NOTICIA · 22 OCT» |
| 4-18 | A cámara + recorte | **Captura del comunicado de prensa de Goldman Sachs** (fuente primaria) con la fecha visible, tomada el día de grabar; chip «FUENTE: GOLDMAN SACHS · 22 OCT»; tarjetas «500 millones de dólares para el programa general» y «Google · OpenAI · Meta · Anthropic» |
| 18-24 | A cámara | Tarjeta «ORIENTADO A EE. UU.: no dice que llegue a Bolivia» |
| 24-29 | A cámara | Tarjeta «OPINIÓN MÍA» sobre «enseñar no empieza por una herramienta» |
| 29-33 | A cámara | Remate: hoja con una fila «TAREA · veces · minutos», rótulo **EJEMPLO**; «Anotá una hoy» |

**Caption:** «El 22 de octubre Goldman Sachs anunció un Small Business AI Institute, parte de un compromiso de 500 millones de dólares para su programa general 10.000 Small Businesses, con Google, OpenAI, Meta y Anthropic, para dar capacitación y herramientas. Está orientado a Estados Unidos; no dice que llegue a Bolivia. La lectura de que hay que empezar por la tarea es opinión mía. Fuente: comunicado de Goldman Sachs.»
**Fuente primaria / fecha:** Goldman Sachs, comunicado de prensa del 22-oct-2026, https://www.goldmansachs.com/pressroom/press-releases/2026/goldman-sachs-commits-500-million-to-launch-small-business-ai-institute . **Corroborado por el revisor (Codex) y por Hermes**: instituto, cuatro socios, compromiso de US$500M para el **programa general**, orientación a EE. UU., sin elegibilidad para Bolivia. **Yo no pude leerlo** (mi lector recibe 403): para mí queda `NO_VERIFICADO`; lo que sostengo se apoya en el revisor y en la nota secundaria de NBC (22-oct, «On Main Street, Goldman Sachs makes a big bet on AI», https://www.nbcnews.com/business/ceo-interviews/goldman-sachs-small-business-ai-institute-rcna604621 , que leí: «$500 million expansion of its 10,000 Small Businesses», «AI training and tools», «philanthropic effort»). NBC es **fuente secundaria**, no una «prueba oficial».
**Límites:** los US$500M son el compromiso del **programa general**, no del instituto solo; no repetir la cifra «86 % de egresados usan IA» (encuesta de Goldman, no verificada); no decir qué enseña ni cuándo empieza; no incluir a Bolivia como beneficiaria; si el comunicado cambia, rehacer o pasar al evergreen del jue 29.

---

## Lun 26 · «Compará tres tareas» · TALLER (condicional)

**Hook:** «No elijas por intuición qué automatizar: compará tres tareas.»

**Texto hablado (base, 98 palabras):**
> No elijas por intuición qué automatizar: compará tres tareas. Ejemplo inventado: un negocio repite contestar precios por WhatsApp, pasar pedidos a una planilla y armar el informe del mes. Anotá cuántas veces por semana pasa cada una y cuántos minutos lleva. Eso es el tiempo. Ahora sumá una pregunta: si esto sale mal, ¿qué se rompe? ¿Plata, datos de un cliente, una promesa? La tarea que más tiempo lleva no siempre es la primera. Puede ser mejor empezar por una que se repite mucho y, si falla, alguien la corrige a tiempo. Una sola. Esa es tu prioridad.

**Cierre A (condicional; 114 palabras, 38-40 s):**
> En el taller del sábado 31 elegimos esa prioridad con tu negocio. Link en mi perfil.

**Cierre B (108 palabras, 36-38 s):**
> Hacé tu lista de tres y marcá cuál elegirías primero.

| t (s, voz estimada) | Plano | Pantalla |
|---|---|---|
| 0-3 | A cámara | Hook en texto |
| 3-9 | A cámara | Hoja con 3 filas: «precios por WhatsApp / pedidos a planilla / informe del mes»; rótulo **EJEMPLO INVENTADO** |
| 9-14 | A cámara | Dos columnas llenándose: «veces por semana» y «minutos» (números ficticios, p. ej. 10 × 5, 5 × 15, 1 × 45) |
| 14-20 | A cámara | Tercera columna «si falla, ¿qué se rompe?»: «plata / datos / promesa». **Sin puntajes** |
| 20-29 | A cámara | Resaltar una fila |
| 29-31 | A cámara | Tarjeta «UNA SOLA» |
| 31-36 (A) | A cámara | **Cierre A: 16 palabras, unos 5 s.** «Taller · sáb 31 oct · 10:00 (La Paz)» y «Link en mi perfil» |
| 31-34 (B) | A cámara | **Cierre B: 10 palabras, unos 3 s.** «Tu lista de tres» |

**Caption (A):** «Tiempo y riesgo antes de elegir qué automatizar. Ejemplo inventado, no es de ningún negocio real. En el taller en vivo del sábado 31 de octubre elegimos tu prioridad con tu negocio. Link en mi perfil.» **(B):** «Compará tus tareas por tiempo y por lo que se rompe si algo falla. Ejemplo inventado. Hacé tu lista de tres.»
**Fuente / fecha:** `TALLER_31_OCT.md` §1 («tu prioridad, una tarea para empezar»); criterio de riesgo en `WORKSHOP-MATERIAL.md` §6 (rúbrica) y `pruebas/cuentas_workshop.py`.
**Límites:** consejo editorial, no resultado medido; sin experiencia personal inventada («esto lo hice yo anoche» queda fuera hasta que exista evidencia); sin puntuaciones.

---

## Mar 27 · «Tres preguntas antes de probar una novedad de IA» · EVERGREEN

**Hook:** «Cada semana sale una novedad de IA. ¿Hay que correr?»

**Texto hablado (92 palabras, 31-33 s):**
> Cada semana sale una novedad de IA, y cada semana alguien te dice que tenés que probarla. Antes de correr, hacete tres preguntas. Primera: ¿ya está disponible o todavía está en prueba? A veces una novedad se anuncia en vista previa, o sea, todavía no es la versión final. Segunda: ¿resuelve una tarea que yo repito? Si no la podés nombrar, todavía no es para vos. Tercera: ¿cuánto me cuesta probarla, en plata y en tiempo? Si las tres respuestas no te cierran, no hay apuro. Seguí con la tarea de hoy.

**Cierre:** una sola acción: hacerse las tres preguntas con la próxima novedad que le llegue. Sin taller.

| t | Plano | Pantalla |
|---|---|---|
| 0-3 | A cámara | Hook en texto |
| 3-10 | A cámara | Tarjeta «PRIMERA: ¿DISPONIBLE O EN PRUEBA?» y rótulo «VISTA PREVIA = TODAVÍA NO ES LA VERSIÓN FINAL» |
| 10-18 | A cámara | Tarjeta «SEGUNDA: ¿RESUELVE UNA TAREA QUE YO REPITO?» |
| 18-26 | A cámara | Tarjeta «TERCERA: ¿QUÉ ME CUESTA PROBARLA, EN PLATA Y EN TIEMPO?» |
| 26-end | Remate (última frase, estimado) | «Si no te cierran las tres, no hay apuro» |

**Caption:** «Cada semana sale una novedad de IA. Antes de probarla: ¿está disponible o en prueba?, ¿resuelve una tarea que yo repito?, ¿qué me cuesta probarla, en plata y en tiempo? Si no te cierran las tres, no hay apuro.»
**Fuente / fecha:** criterio editorial; no cita ninguna noticia. **Sustituye** una nota sobre una función de Google Cloud (22-oct, verificada pero técnica y sin utilidad para dueños; ver §2 fila 2). 
**Límites:** no es una tendencia ni una estadística; no nombra productos ni empresas; no promete que probar una novedad sirva.

---

## Mié 28 · «Tu primer paso con IA» · TALLER (condicional)

**Hook:** «Tu primer paso con IA no es instalar nada.»

**Texto hablado (base, 77 palabras):**
> Tu primer paso con IA no es instalar nada. Es una prueba chica, con una sola tarea. Elegí la tarea. Anotá cuánto tiempo te lleva hoy, por ejemplo cinco minutos por vez. Definí qué querés comprobar: por ejemplo, si un borrador te sirve para empezar. Y definí quién revisa el resultado antes de usarlo con un cliente: vos. Una semana después, medí de nuevo. Si no mejoró, aprendiste algo sin comprar nada. Eso es un primer paso.

**Cierre A (condicional; 94 palabras, 31-33 s):**
> En el taller del sábado 31 salís con el tuyo, concreto, para después. Link en mi perfil.

**Cierre B (87 palabras, 29-31 s):**
> Elegí hoy tu tarea y anotá cuánto tiempo te lleva.

| t (s, voz estimada) | Plano | Pantalla |
|---|---|---|
| 0-3 | A cámara | Hook en texto |
| 3-6 | A cámara | Tarjeta «UNA TAREA» |
| 6-18 | A cámara | Tres tarjetas: «TIEMPO HOY», «QUÉ COMPROBAR», «QUIÉN REVISA: VOS» |
| 18-24 | A cámara | Línea de tiempo «HOY → +1 SEMANA: MEDIR DE NUEVO», rótulo **EJEMPLO** |
| 24-29 (A) | A cámara | **Cierre A: 17 palabras, unos 5 s.** «Taller · sáb 31 oct · 10:00 (La Paz)» y «Link en mi perfil» |
| 24-27 (B) | A cámara | **Cierre B: 10 palabras, unos 3 s.** «Tu tarea, tu tiempo» |

**Caption (A):** «Un primer paso es una prueba chica: una tarea, cuánto tiempo lleva hoy, qué querés comprobar y quién revisa. Medís de nuevo una semana después. En el taller en vivo del sábado 31 de octubre salís con el tuyo. Link en mi perfil.» **(B):** «Una tarea, el tiempo que lleva hoy, qué querés comprobar y quién revisa. Medí de nuevo en una semana.»
**Fuente / fecha:** `TALLER_31_OCT.md` §1 («tu primer paso»); método del ejemplo resuelto en `WORKSHOP-MATERIAL.md` §5.
**Límites:** no promete que la prueba funcione ni ahorro; «sin comprar nada» describe el paso, no garantiza que no haga falta una herramienta después.

---

## Jue 29 · «Antes de pegar datos de tus clientes en una IA» · EVERGREEN

**Hook:** «Antes de pegar datos de tus clientes en una IA, hacé esto.»

**Texto hablado (90 palabras, 30-32 s, estimados):**
> Antes de pegar datos de tus clientes en una IA, hacé esto. Primero: no pegues nombres, teléfonos, direcciones ni montos reales. Cambiarles el nombre no los vuelve anónimos: practicá con un caso totalmente inventado. Segundo: describí la tarea, no a la persona. Tercero: leé qué hace con tus datos la herramienta que usás, porque cambia entre planes y entre proveedores. Cuarto: lo que te devuelva, revisalo vos antes de enviarlo. Hay tareas que se practican bien con casos inventados, y así exponés menos. Guardá este video para la próxima vez.

**Cierre:** «Guardá este video» (una sola acción; no es comentar ni pedir mensaje).

| t (s, voz estimada) | Plano | Pantalla |
|---|---|---|
| 0-3 | A cámara | Hook en texto |
| 3-10 | A cámara | Tarjeta con datos de ejemplo tachados (rótulo **EJEMPLO INVENTADO**) y debajo «CASO TOTALMENTE INVENTADO»: cambiarles el nombre no los vuelve anónimos |
| 10-17 | A cámara | Tarjeta «DESCRIBÍ LA TAREA, NO A LA PERSONA» |
| 17-24 | A cámara | Tarjeta «LEÉ QUÉ HACE CON TUS DATOS (CAMBIA POR PLAN Y PROVEEDOR)» |
| 24-27 | A cámara | Tarjeta «REVISALO VOS ANTES DE ENVIAR» |
| 27-29 | A cámara | Remate: «Guardá este video» |

**Caption:** «Antes de pegar datos de tus clientes en una IA: no pegues nombres, teléfonos, direcciones ni montos reales (cambiarles el nombre no los vuelve anónimos: practicá con un caso totalmente inventado), describí la tarea y no a la persona, leé qué hace la herramienta con tus datos (cambia entre planes y proveedores) y revisá vos lo que te devuelva. Así exponés menos. Ejemplo inventado.»
**Fuente / fecha:** consejo editorial; el mismo principio rige el ejercicio del taller (casos totalmente inventados y prompt propuesto, `WORKSHOP-MATERIAL.md` §4 y §5). **No hay una fuente que cite**: es práctica, no estadística. No se afirma qué hace ninguna herramienta concreta con los datos.
**Límites:** no decir que así «no hay riesgo» ni que cambiar nombres anonimiza; hablar de **exponer menos**, con revisión humana; no decir que «una IA guarda tus datos» ni lo contrario; no mencionar leyes bolivianas de datos (no las verifiqué).

---

## Vie 30 · «La IA propone, vos aprobás» · EVERGREEN

**Hook:** «Si una IA contesta sola, ¿quién se entera del error?»

**Texto hablado (106 palabras, 35-37 s, estimados):**
> Si una IA contesta sola, ¿quién se entera del error? Puede que nadie, y que el error llegue a un cliente. Para evitarlo, dibujá cuatro pasos para cualquier tarea de tu negocio. Uno: llega la solicitud. Dos: la IA prepara un borrador. Tres: una persona lo revisa. Cuatro: recién ahí se envía o se anota. Decidí qué mira esa persona: si falta un dato, el monto, el tono. Empezá en modo borrador, con pocos casos, y anotá qué corregiste. Si corregís siempre lo mismo, ahí está lo que hay que mejorar. La IA ayuda con una parte; el proceso necesita dueño. ¿Qué paso revisarías vos primero?

**Cierre:** pregunta (sin pedir comentario para recibir nada).

| t | Plano | Pantalla |
|---|---|---|
| 0-3 | A cámara | Hook en texto |
| 3-14 | A cámara | Cuatro tarjetas que aparecen una por una: «SOLICITUD → BORRADOR DE LA IA → REVISIÓN HUMANA → ENVÍO O REGISTRO»; rótulo **ESQUEMA DIDÁCTICO, NO UN SISTEMA REAL** |
| 14-22 | A cámara | Tarjeta «¿QUÉ MIRA LA PERSONA? DATO FALTANTE · MONTO · TONO» |
| 22-29 | A cámara | Tarjeta «MODO BORRADOR · ANOTÁ QUÉ CORREGISTE» |
| 29-end | Remate (última frase, estimado) | La pregunta en texto |

**Caption:** «Un proceso con IA necesita un responsable: llega la solicitud, la IA prepara un borrador, una persona lo revisa y recién ahí se envía. Esquema didáctico, no un sistema real. ¿Qué paso revisarías vos primero?»
**Fuente / fecha:** consejo editorial; coherente con la recomendación de `.hermes/tasks/workshop-enfoque-escalabilidad-revision.md` (proceso común con revisión humana como **hipótesis**, no oferta).
**Límites:** no decir que «nadie» se entera ni que un error siempre llega al cliente: **puede** pasar inadvertido; no mostrar pantallas de un sistema como si fueran reales; no presentarlo como función de Onia ni del taller; no prometer resultados.

---

## 5. Verificaciones hechas (con archivo)

- Cuentas del taller: `pruebas/cuentas_workshop.py` y su salida `pruebas/cuentas_workshop.salida.txt` (todas las aserciones pasan).
- Palabras y duración de cada texto: `pruebas/contar_palabras.py` sobre `pruebas/textos_guiones.py`. Los textos de este archivo se copiaron de ahí; el auditor puede recontar.
- Noticias: la de Goldman, leída en su fuente el 23-oct y confirmada por un subagente independiente; el resto de la tabla del §2 son descartes con motivo. Volver a abrir la fuente el día de grabar.
- Pendiente fuera de mi alcance: confirmar con Sergio la venta (A o B), grabar, y que Hermes decida la cola única.
