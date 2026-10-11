# Guiones nuevos para grabar (11-oct) · simples, que enseñan

- **Por qué cambiaron:** Sergio Urcullo pidió guiones menos técnicos y que enseñen algo. Ya grabó N07, DD-A, N02, N06 y S2-D07-A; los demás no se graban. Estos once hablan de repos, agentes y novedades de Claude Code. Cada término se explica en la misma frase y cada guion tiene una prueba suya en pantalla.
- **Cómo grabar:** teléfono en trípode a la altura de los ojos y micrófono de solapa. Una idea por toma. Si te trabás, pausá dos segundos y repetí la frase entera. Los comandos no se dicen: van tecleados en pantalla.
- **Cierre:** al final de cada guion, una toma aparte de 4 s con el CTA, grabada dos veces: con la PALABRA y sin ella («Lo que probé está en mi comunidad. Link en mi perfil.»).
- **Bruto:** a Drive, carpeta «Videos Onia Octubre», con el código en el nombre (por ejemplo, `SI-01-rutina.mp4`). Antes de cortar llegan la tabla de cortes y el preview de 360p.

## Resumen (del mejor al peor)

| Código | Título | Gancho | Duración | PALABRA |
|---|---|---|---|---|
| SI-01 | Claude trabaja con la compu apagada | «Si tu mamá te apaga la compu a las once, Claude sigue igual.» | ~60 s | RUTINA |
| SI-02 | Antes de instalar OpenClaw | «Un mensaje de WhatsApp puede traer órdenes escondidas para tu IA. Antes de instalar OpenClaw, mirá esto.» | ~60 s (~54 s sin la prueba) | OPENCLAW |
| SI-03 | Claude, pero vago | «Este plugin hace que Claude escriba la mitad de código.» | ~60 s | VAGO |
| SI-04 | Tres comandos escondidos de Claude Code | «Claude Code tiene una radio escondida. Y otros dos comandos que casi nadie usa.» | ~50 s | SECRETOS |
| SI-05 | Mi Jarvis por Telegram: cuánto me cuesta | «Tengo un Jarvis que me escribe cada mañana por Telegram. Me cuesta [X] dólares al mes.» | ~62 s | HERMES |
| SI-06 | Claude habla como cavernícola: lo medí | «Hice que Claude hable como cavernícola. ¿Ahorra de verdad? Lo medí.» | ~60 s | CAVEMAN |
| SI-07 | Dale una meta, no una tarea | «¿Claude Code hace un pedacito y te pregunta "¿sigo?"? Dale una meta.» | ~60 s | GOAL |
| SI-08 | Un video que escribió Claude | «Mirá esto. No lo edité. Lo escribió Claude.» | ~40 s | HYPERFRAMES |
| SI-09 | La IA te da links. Abrí dos. | «La IA te da links. ¿Alguna vez abriste uno?» | ~54 s | INVESTIGAR |
| SI-10 | 750.000 líneas en 11 días | «Un programador y Claude pasaron setecientas cincuenta mil líneas de código a otro idioma. En once días.» | ~62 s | ORQUESTA |
| SI-11 | Dos repos para Claude Code | «¿Claude Code no se acuerda de lo que hizo ayer? ¿No entendés tu propio proyecto? Dos repos lo arreglan.» | ~48 s | REPOS |

- **SI-05 pasa al n.º 1** si se mide [X]. Sin [X], no se graba.
- **Se tiró el borrador G-07 (mods):** repetía a N08 (sáb 17), con el mismo tema y la misma palabra MODS. No hubo un reemplazo mejor con los datos verificados; con once se cumple el mínimo de diez.
- **Los códigos SI-** son nuevos para no chocar con los G01-G12 de septiembre. Cada guion dice de qué borrador viene.

**Lo que va entre corchetes se mide antes de grabar.** Sin la medición, ese tramo se corta; nunca se arma una pantalla falsa. Las estrellas cambian todos los días: se releen en cada repo el día de grabar.

| Guion | Qué se mide o se prepara | Si no está |
|---|---|---|
| SI-01 | Una rutina creada el día anterior y lo que dejó | Se corta el tramo 47-52 |
| SI-02 | La prueba del archivo fuera de la caja: necesita OpenClaw instalado en una compu aparte, con el OK de Sergio Urcullo | Se corta el tramo 53-59 |
| SI-05 | [X]: el gasto real de 30 días, leído en LiteLLM. Los «nueve días» caído se recuentan en el log del vigía | No se graba |
| SI-06 | [A] y [B]: palabras de la misma respuesta, con y sin caveman | Gancho de reserva y se corta el tramo 20-27 |
| SI-07 | [T]: turnos de una corrida real de `/goal` | Se corta la primera frase del tramo 39-51 |
| SI-09 | [197]: recontar las piezas del caption del carrusel de repos | Se dice «un montón de piezas» |
| SI-10 | [N]: agentes de una corrida real que revisa guiones | Se corta el tramo 31-37 |
| SI-11 | Que claude-mem conteste en una charla nueva (hoy su buscador no conectó en esta sesión) | Se corta la prueba |

---

### SI-01 · Claude trabaja con la compu apagada (era G-10)
- **Enseña:** la diferencia entre /loop y /schedule y cuándo usar cada uno. **Para quién:** el que le pide a Claude lo mismo todos los días. **Molde:** gancho de humor e identidad, con una regla con nombre de Hormozi · **Duración:** ~60 s
- **Gancho (0-3 s, dicho):** «Si tu mamá te apaga la compu a las once, Claude sigue igual.» · **Rótulo arriba:** CLAUDE TRABAJA CON LA COMPU APAGADA
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-3 | Si tu mamá te apaga la compu a las once, Claude sigue igual. | Una pantalla que se apaga y un reloj que marca 23:00. Abajo, la cara aguantando la risa. |
| 3-9 | Claude Code, la IA que programa en tu compu, tiene dos comandos para repetir tareas solo. | Dos tarjetas: «/loop» y «/schedule». |
| 9-19 | Barra loop: repite un pedido cada cierto tiempo. Por ejemplo, cada cinco minutos. Pero Claude Code tiene que quedar abierto. Y a los siete días se apaga. | `/loop 5m revisá si terminó` tecleado. Rótulos «CLAUDE CODE ABIERTO» y «7 DÍAS». |
| 19-32 | Barra schedule: arma una rutina en la nube. La nube es una compu de Anthropic, no la tuya. Corre aunque la tuya esté apagada. Ejemplo: todos los días a las nueve, revisá los cambios del proyecto. | Recorte de la doc de rutinas y el ejemplo oficial tecleado. |
| 32-36 | Regla fácil: compu prendida, loop. Compu apagada, schedule. | La regla con nombre, «PRENDIDA O APAGADA», en grande. |
| 36-47 | Ojo: las rutinas están en prueba, y solo en planes pagos. Mínimo, una vez por hora. Y corren sin pedirte permiso. Dales poco poder: que lean, no que borren. | Tres rótulos que entran de a uno. |
| 47-52 | Yo armé una ayer. Hoy a las nueve dejó esto. | La corrida real de la rutina creada el día anterior. Si no existe, el tramo se corta. |
| 52-56 | Loop es una alarma en tu celular. Schedule es un empleado con llave. | La cara completa. |
| 56-60 | Buscá RUTINA en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá RUTINA en Avisos · link en mi perfil». **Recurso:** la tabla /loop contra /schedule (dónde corre, mínimo, vencimiento y planes), tres ejemplos de rutina y el aviso de que corren sin pedir permiso.
- **Datos y fuentes:**
  - /loop: sesión abierta, mínimo 1 min, vence a los 7 días. https://code.claude.com/docs/en/scheduled-tasks
  - Rutinas: en prueba (research preview), mínimo 1 h, planes Pro/Max/Team/Enterprise, corren sin pedir permisos. https://code.claude.com/docs/en/routines

### SI-02 · Antes de instalar OpenClaw (era G-06)
- **Enseña:** tres reglas de seguridad para usar un agente que actúa en tu compu, y por qué un mensaje puede darle órdenes. **Para quién:** el que vio OpenClaw y lo quiere instalar ya. **Molde:** filtro de dolor de Gadzhi, con las reglas en lista de Erik · **Duración:** ~60 s (~54 s sin la prueba)
- **Gancho (0-3 s, dicho):** «Un mensaje de WhatsApp puede traer órdenes escondidas para tu IA. Antes de instalar OpenClaw, mirá esto.» · **Rótulo arriba:** ANTES DE INSTALAR OPENCLAW
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-6 | Un mensaje de WhatsApp puede traer órdenes escondidas para tu IA. Antes de instalar OpenClaw, mirá esto. | Un mensaje de chat con una línea escondida marcada en rojo. Al nombrar OpenClaw, la captura del repo openclaw/openclaw. |
| 6-15 | OpenClaw hace cosas por vos desde WhatsApp, Telegram o Discord. Casi cuatrocientas mil estrellas, los likes de GitHub. Es gratis; el modelo se paga aparte. | Lista de canales del README. Tarjeta «~391 mil ⭐ · MIT · modelo aparte». |
| 15-22 | Pero mirá lo que dice su propio manual: las herramientas corren en tu equipo, salvo que lo encierres. | Recorte del README con esa línea subrayada en verde. |
| 22-40 | Tres reglas. Uno: compu aparte, una vieja o un servidor alquilado. Yo mi asistente lo tengo en un servidor, no en mi laptop. Dos: sandbox, una caja cerrada; lo que rompa queda adentro. Tres: skills solo de gente que conocés. Una skill es una receta que el agente obedece: leela antes. | Tarjetas 1, 2 y 3, cada una con su ícono (laptop vieja, caja, receta). Con «Yo mi asistente», la terminal de su servidor (sin datos de Onia). |
| 40-46 | ¿Por qué tanto cuidado? Porque lee mensajes de afuera. Su manual los trata como no confiables. | El mensaje con la orden escondida otra vez. Recorte del README. |
| 46-52 | La prueba: pedile que abra un archivo fuera de su caja. Si no puede, está bien encerrado. | Captura real del intento bloqueado. Solo con el OK de Sergio Urcullo para instalarlo, en una compu aparte; si no, el tramo se corta. |
| 52-56 | Es como prestar tu casa. Das el cuarto de huéspedes, no todas las llaves. | La cara completa. |
| 56-60 | Buscá OPENCLAW en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá OPENCLAW en Avisos · link en mi perfil». **Recurso:** las tres reglas, el link a la sección de seguridad y sandbox del manual y la prueba del archivo fuera de la caja.
- **Datos y fuentes:**
  - ~391,6 mil estrellas, MIT, sin plan pago; mensajes entrantes no confiables; herramientas en tu equipo salvo sandbox. https://github.com/openclaw/openclaw
  - «Mi asistente en un servidor»: Hermes Agent corre en su VPS (memoria `hermes-agent-nousresearch`).
  - Los CVE y las «instancias expuestas» no se dicen: son de terceros y no están verificados.
  - Revisar que no salga dos veces con el plan S4.

### SI-03 · Claude, pero vago (era G-03)
- **Enseña:** a hacer que el agente escriba solo el código que hace falta, y a comprobarlo con el mismo pedido. **Para quién:** el que arma proyectos con IA y se le llenan de código que no entiende. **Molde:** objeto, número y comparación de Erik, con el «probalo así» de Rocha · **Duración:** ~60 s
- **Gancho (0-3 s, dicho):** «Este plugin hace que Claude escriba la mitad de código.» · **Rótulo arriba:** CLAUDE, PERO VAGO
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-3 | Este plugin hace que Claude escriba la mitad de código. | Contador «−53 % código», con «según su autor» chico debajo. |
| 3-13 | Se llama ponytail. Es un plugin, un agregado para Claude Code, la IA que programa en tu compu. Su regla: el mejor código es el que no escribiste. | Captura del repo DietrichGebert/ponytail con la frase subrayada en verde. |
| 13-21 | Le pedís un botón y Claude te arma una fábrica de botones. Ponytail lo frena. Primero pregunta: ¿esto hace falta? | Chiste visual: un archivo eterno que baja y baja. Después, la tarjeta «¿esto hace falta?». |
| 21-28 | ¿Por qué menos código? Menos cosas que se rompen. Y menos tokens, los pedacitos de texto que te cobran. | Dos tarjetas que entran con cada frase. |
| 28-39 | Su autor lo midió en treinta y nueve tareas. La mitad de código. Veintiséis por ciento menos de costo. Ojo: lo midió el autor. No encontré otra medición. | Recorte del benchmark del README. Rótulo «LO MIDIÓ EL AUTOR». |
| 39-51 | Lo tengo instalado en mi Claude Code. Probalo vos: el mismo pedido, con y sin ponytail. Si hace lo mismo con menos líneas, quedátelo. Si deja de hacer algo que pediste, sacalo. | Su lista de plugins con ponytail. Los dos comandos tecleados. Pantalla partida con el mismo pedido y el conteo de líneas de cada lado, grabada el día de grabar. |
| 51-56 | Es el amigo que te dice: no compres la mochila de cien bolsillos. Vas a usar dos. | La cara completa. |
| 56-60 | Buscá VAGO en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá VAGO en Avisos · link en mi perfil». **Recurso:** los dos comandos, el link al benchmark y la prueba con y sin el plugin, paso a paso.
- **Datos y fuentes:**
  - 160,6 mil estrellas, +26.935 este mes. −53 % de código y −26 % de costo en 39 tareas con Opus 5.5 y 5 corridas; es el benchmark del autor. https://github.com/DietrichGebert/ponytail
  - No usar −54 % ni −20 %: son del README viejo.
  - Instalado en su PC: aparece como skills `ponytail:*`.

### SI-04 · Tres comandos escondidos de Claude Code (era G-08)
- **Enseña:** tres comandos que casi no se anuncian y cuándo usar cada uno. **Para quién:** cualquiera que tenga Claude Code instalado. **Molde:** objeto más prueba de Erik, en formato lista · **Duración:** ~50 s
- **Gancho (0-3 s, dicho):** «Claude Code tiene una radio escondida. Y otros dos comandos que casi nadie usa.» · **Rótulo arriba:** 3 COMANDOS ESCONDIDOS
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-5 | Claude Code tiene una radio escondida. Y otros dos comandos que casi nadie usa. | Desde el cuadro 0, `/radio` tecleado en su Claude Code y Claude FM sonando (≤2,5 s de música). |
| 5-12 | Claude Code es la IA que programa en tu compu. Estos comandos están en su manual, pero bien escondidos. | Recorte de la página «What's new». |
| 12-20 | Uno: barra radio. Pone Claude FM, música lo-fi para concentrarte. Ideal para hacer la tarea. O fingir que la hacés. | Rótulo «1 · /radio». Chiste: la cara mirando el celular mientras suena. |
| 20-27 | Dos: barra powerup. Lecciones de Claude Code, adentro de Claude Code. Si recién empezás, arrancá por acá. | `/powerup` tecleado y la primera lección en pantalla. |
| 27-38 | Tres, el más útil: escribí ultrathink en tu pedido. Claude piensa más, pero solo en esa respuesta. Ojo: pensar más gasta más. Guardalo para lo difícil. | Un pedido con «ultrathink» subrayado en verde. Rótulo «GASTA MÁS». |
| 38-42 | ¿No te aparecen? Actualizá Claude Code y volvé a probar. | El menú de comandos abierto. |
| 42-46 | Son como los atajos del celular que nadie te enseñó. | La cara completa. |
| 46-50 | Buscá SECRETOS en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá SECRETOS en Avisos · link en mi perfil». **Recurso:** /radio, /powerup, ultrathink y `claude agents`, cada uno con qué hace en una línea y su link.
- **Datos y fuentes:**
  - /radio desde la semana del 29-jun, y /powerup. https://code.claude.com/docs/en/whats-new
  - ultrathink piensa más solo en ese turno. https://code.claude.com/docs/en/model-config
  - El pensamiento se cobra como salida (verificado en N07).
  - `claude agents`: https://code.claude.com/docs/en/agents
  - Su PC tiene Claude Code 2.1.288 (leído el 11-oct).
  - No se nombra la perilla de esfuerzo (D02-A): no se grabó.

### SI-05 · Mi Jarvis por Telegram: cuánto me cuesta (era G-05)
- **Enseña:** qué es Hermes Agent, qué se paga de verdad, dónde instalarlo sin riesgo y por qué necesita un aviso. **Para quién:** el que quiere un asistente propio por Telegram o WhatsApp. **Molde:** pregunta de plata más herramienta propia, de Santiago · **Duración:** ~62 s
- **Gancho (0-3 s, dicho):** «Tengo un Jarvis que me escribe cada mañana por Telegram. Me cuesta [X] dólares al mes.» · **Rótulo arriba:** MI JARVIS: [X] US$ AL MES
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-6 | Tengo un Jarvis que me escribe cada mañana por Telegram. Me cuesta [X] dólares al mes. | Captura real de un mensaje de la mañana en su Telegram, sin nada de Onia (se elige uno sin datos del negocio o se tapa). Contador «[X] US$/mes». |
| 6-14 | Se llama Hermes Agent. Lo hizo Nous Research, un laboratorio de IA. Más de doscientas cincuenta mil estrellas, los likes de GitHub. | Captura del repo NousResearch/hermes-agent, las estrellas subrayadas y «MIT · gratis». |
| 14-27 | Vive en una compu y le escribís por Telegram o WhatsApp. Se acuerda de lo que hablaron. Hace tareas a la hora que le digas. Y se arma habilidades nuevas según lo que le pedís. | Lista de canales del README. Cada capacidad entra con su frase. |
| 27-38 | ¿Qué pagás? El programa, cero. El cerebro, aparte: el modelo de IA, que elegís vos. Por ejemplo, OpenAI. A mí me sale [X] al mes. Si lo usás más, sube. | Tarjeta «PROGRAMA US$0 + CEREBRO [X] US$». El panel de gasto de 30 días, recortado. |
| 38-45 | Me pasó: estuvo nueve días muerto y no me enteré. El modelo le rechazaba la llave. Poné algo que te avise si deja de contestar. | Rótulo «9 DÍAS MUERTO». El aviso que hoy le llega por Telegram cuando se cae. |
| 45-56 | Ojo: Hermes ejecuta comandos en la compu donde vive. No lo pongas en tu laptop, con tus contraseñas. Ponelo en un servidor alquilado, como yo, o en Docker: una caja cerrada. | Rótulo «EJECUTA COMANDOS». El comando de instalación en pantalla, sin dictarlo. |
| 56-60 | El asistente es gratis. El cerebro lo pagás vos. | La cara completa. |
| 60-64 | Buscá HERMES en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá HERMES en Avisos · link en mi perfil». **Recurso:** el comando de instalación para servidor, los proveedores de modelo que acepta, su gasto real y cuatro cuidados.
- **Datos y fuentes:**
  - 252,6 mil estrellas, MIT, canales, memoria y tareas programadas. https://github.com/NousResearch/hermes-agent
  - Es el mismo Hermes Agent que corre en su VPS (código en `/usr/local/lib/hermes-agent`): 12 trabajos que entregan por Telegram, entre ellos la agenda diaria (memoria del 18-sep). Lo único con nombre parecido es el repo `onia-hermes`.
  - Caído del 24-ago al 2-sep con las claves rechazadas (memoria del 18-sep). Se recuenta en el log antes de grabar; si da otro número, se dice ese.
  - [X] sale de LiteLLM, últimos 30 días. Sin [X] no se graba.
  - No se dicen los precios de Nous Portal: no están verificados. No se muestran trabajos de Onia: se dice «mi asistente».

### SI-06 · Claude habla como cavernícola: lo medí (era G-01)
- **Enseña:** a instalar un plugin que acorta las respuestas y a saber que ahorra texto, no código ni límite. **Para quién:** el que se cansa de leer respuestas largas. **Molde:** gancho de resultado en primera persona más la receta de Rocha · **Duración:** ~60 s
- **Gancho (0-3 s, dicho):** «Hice que Claude hable como cavernícola. ¿Ahorra de verdad? Lo medí.» · **Rótulo arriba:** CLAUDE, VERSIÓN CAVERNÍCOLA
- **Gancho de reserva** (si no se midió [A] y [B]): «Este plugin hace que Claude hable como cavernícola. Promete gastar menos.» Con ese gancho se corta el tramo 20-27.
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-4 | Hice que Claude hable como cavernícola. ¿Ahorra de verdad? Lo medí. | Desde el cuadro 0, pantalla partida con la misma pregunta: a la izquierda la respuesta larga de siempre y a la derecha la de caveman, de tres líneas. Se graba el día de grabar, en su Claude Code. |
| 4-14 | Se llama caveman. Es un plugin, un agregado para Claude Code, la IA que programa en tu compu. Ciento diez mil estrellas, los likes de GitHub. | Captura del repo JuliusBrussee/caveman con las estrellas a la vista. |
| 14-20 | Yo lo tengo instalado: son dos comandos. Le preguntás lo de siempre y responde así. | Su lista de plugins con caveman. Tarjeta con los dos comandos tecleados. La respuesta corta. |
| 20-27 | Mi prueba: la misma pregunta, con y sin caveman. Sin caveman, [A] palabras. Con caveman, [B]. | Contador «[A] → [B] palabras». |
| 27-36 | Su autor midió diez preguntas: cuarenta y uno por ciento menos tokens, los pedacitos de texto que te cobran. Con el modo ultra, sesenta y uno. | Contador «6.983 → 4.119 tokens (−41 %)» y después «→ 2.693 (−61 %)», con «según su autor» y el recorte de la tabla del README. |
| 36-47 | Ahora, la letra chica. Solo achica lo que Claude te dice; el código no lo toca. Y en una charla larga, contando todo, una guía midió apenas cuatro por ciento. | Rótulo «LETRA CHICA». Un bloque de código que no cambia de tamaño. Tarjeta «charla entera: ~4 % · guía externa». |
| 47-52 | ¿Te sirve? Para leer menos, sí. Para que te dure el límite, casi nada. | Dos tarjetas: «leer menos → sí» en verde y «límite → casi nada» en gris. |
| 52-56 | Es el audio de cinco minutos de tu tía, en una línea. | Un audio de WhatsApp de 5:00 que se vuelve un mensaje de una línea. |
| 56-60 | Buscá CAVEMAN en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá CAVEMAN en Avisos · link en mi perfil». **Recurso:** los dos comandos, el modo ultra, la tabla del autor con su link, su propia medición y el límite.
- **Datos y fuentes:**
  - 110,9 mil estrellas, v3.2.0. Medición del autor: −41 % y −61 % en 10 preguntas. https://github.com/JuliusBrussee/caveman
  - ~4 % en una sesión entera: Google Doc de autor desconocido, fuente débil; por eso se dice «una guía». https://docs.google.com/document/d/1ssSyVbJ_KPcsv3PZVJrjfYOBg_AHHrww8Ve1VC6CLkw/export?format=pdf
  - No usar 75 % ni 65 %.
  - Instalado en su PC: aparece como skills `caveman:*`.

### SI-07 · Dale una meta, no una tarea (era G-09)
- **Enseña:** a usar /goal con una meta que se pueda comprobar y con un freno. **Para quién:** el que se cansa de escribir «seguí» cada dos minutos. **Molde:** situación del usuario y reencuadre de Erik, con analogía de cierre de Hormozi · **Duración:** ~60 s
- **Gancho (0-3 s, dicho):** «¿Claude Code hace un pedacito y te pregunta "¿sigo?"? Dale una meta.» · **Rótulo arriba:** UNA META, NO UNA TAREA
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-5 | ¿Claude Code hace un pedacito y te pregunta «¿sigo?»? Dale una meta. | Una sesión real donde Claude pregunta «¿sigo?» tres veces seguidas. |
| 5-16 | Claude Code, la IA que programa en tu compu, tiene barra goal. Le escribís la meta y sigue solo, turno tras turno, hasta cumplirla. Un turno es cada respuesta. | `/goal` tecleado. Recorte de la doc. Contador de turnos que sube. Rótulo chico «NO QUITA LOS PERMISOS». |
| 16-28 | ¿Quién decide si terminó? Un modelo chiquito que lee la charla. Solo ve lo que Claude muestra ahí. Si la meta no se ve en la charla, no la puede comprobar. | Esquema simple: la charla y un «juez» chiquito que la lee. |
| 28-35 | Meta mala: «que quede lindo». Meta buena: «el juego corre sin errores y me mostrás la salida». | Así no y así sí: tachado en gris y tilde en verde. |
| 35-39 | Y siempre poné un freno: «o pará a los veinte turnos». | La meta completa tecleada, con el freno subrayado. |
| 39-51 | Yo se la di a mi Claude Code y terminó en [T] turnos. Si llega a veinte, revisá: o tu meta no se veía en la charla, o era muy grande. | La corrida real, con el contador en [T]. Si no hay corrida, la primera frase se corta. |
| 51-56 | Es como el GPS: le das el destino, no cada giro. Y el freno es el tanque de gasolina. | La cara completa. Regla con nombre en el rótulo: «META QUE SE VE». |
| 56-60 | Buscá GOAL en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá GOAL en Avisos · link en mi perfil». **Recurso:** la plantilla, tres metas buenas y tres malas, y por qué cada una.
- **Datos y fuentes:**
  - El juez es un modelo chico que solo ve la conversación; conviene un tope de turnos. https://code.claude.com/docs/en/goal
  - La palabra es GOAL y no META para no confundirla con Meta (WhatsApp, Instagram).
  - /goal no quita las preguntas de permiso (eso era N03, que no se publicó).

### SI-08 · Un video que escribió Claude (era G-02)
- **Enseña:** que un título o una placa animada se escribe como una página web y sale en MP4, y qué no hace. **Para quién:** el que quiere hacer contenido y no sabe animar. **Molde:** showcase de Adrien (el producto real en 0-2 s, 28 s el suyo) · **Duración:** ~40 s
- **Gancho (0-3 s, dicho):** «Mirá esto. No lo edité. Lo escribió Claude.» · **Rótulo arriba:** ESTE VIDEO LO ESCRIBIÓ CLAUDE
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-3 | Mirá esto. No lo edité. Lo escribió Claude. | Desde el cuadro 0, un clip de 3 s hecho con HyperFrames con el prompt del aviso. Se hace antes de grabar. |
| 3-10 | Se llama HyperFrames. Es gratis y lo hizo HeyGen. Este mes sumó casi doce mil estrellas, los likes de GitHub. | Captura del repo heygen-com/hyperframes y de GitHub Trending del mes. |
| 10-18 | Claude Code, la IA que programa en tu compu, escribe la escena como una página web. HyperFrames la convierte en video. | Pantalla partida: el HTML a la izquierda y el cuadro animado a la derecha. |
| 18-24 | Tres comandos: crear, mirar, exportar. Y los cambios se los pedís escribiendo, como a un amigo. | Los tres comandos tecleados rápido. El pedido «título más grande» y el mismo clip antes y después. |
| 24-30 | Ojo: no edita lo que grabaste ni hace avatares. Sirve para títulos, placas y animaciones. | Rótulo «NO EDITA TUS CLIPS». |
| 30-35 | Las placas de mis videos salen de acá. Yo escribo, él anima. | Una placa real de sus videos (por ejemplo, la de P1 «Niveles») y la cara. |
| 35-39 | Buscá HYPERFRAMES en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá HYPERFRAMES en Avisos · link en mi perfil». **Recurso:** lo que hace falta (Claude Code, Node y FFmpeg con sus links), los comandos y el prompt exacto del clip del cuadro 0.
- **Datos y fuentes:**
  - 60,4 mil estrellas, Apache-2.0, Node 22+ y FFmpeg. https://github.com/heygen-com/hyperframes
  - +11.826 estrellas este mes. https://github.com/trending?since=monthly
  - No decir la fecha de lanzamiento: no está verificada.
  - Posible repetición: «Mi stack» §5 (`GUIONES-SEMANA-1-MI-STACK.md`) tenía un gancho parecido. No hay registro de que se haya publicado (el handoff del 29-sep dice «nada grabado, nada publicado»). Si salió, este guion baja y el gancho pasa al molde Boceto («dibujé esto → así quedó»).

### SI-09 · La IA te da links. Abrí dos. (era G-12)
- **Enseña:** a comprobar un informe con fuentes en dos minutos, con cualquier IA. **Para quién:** el que usa IA para investigar antes de construir o comprar algo. **Molde:** dolor y defecto visible de Rocha, con el «cómo sabés que funcionó» · **Duración:** ~54 s
- **Gancho (0-3 s, dicho):** «La IA te da links. ¿Alguna vez abriste uno?» · **Rótulo arriba:** LA IA TE DA LINKS. ABRÍ DOS.
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-3 | La IA te da links. ¿Alguna vez abriste uno? | Una respuesta de chat llena de links, con el cursor que pasa de largo. |
| 3-13 | Claude Code, la IA que programa en tu compu, tiene barra deep-research: investigación a fondo. Te devuelve un informe con citas, el link de dónde salió cada dato. | `/deep-research` y una pregunta tecleados. Rótulo «CITA = LINK DE ORIGEN». |
| 13-22 | Yo lo uso antes de construir algo, para ver si ya existe. Escribí [197] piezas para mi empresa, y buena parte ya existía. | Su informe real recorriéndose, con las citas marcadas en verde. Se corre antes de grabar. |
| 22-33 | Ahora, lo importante: verificar. Abrí dos citas al azar. ¿Dicen lo mismo que el informe? Confiás más. ¿Una no existe, o dice otra cosa? Ese dato no lo usás. | Dos citas abiertas en el navegador, al lado del párrafo del informe. Tilde o tachado según lo que pase de verdad. |
| 33-37 | Y eso vale con cualquier IA que te dé links. | Tres logos chicos de chats de IA. |
| 37-45 | Ojo: gasta más de tu límite que una pregunta normal. Y en el plan Pro, primero lo activás en la configuración. | Rótulo «GASTA MÁS». `/config` en pantalla. |
| 45-50 | Es el compañero del trabajo de grupo: vos revisás antes de entregar. | La cara completa. |
| 50-54 | Buscá INVESTIGAR en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá INVESTIGAR en Avisos · link en mi perfil». **Recurso:** el comando, cómo activarlo en Pro, la lista de tres pasos para verificar y tres preguntas de ejemplo.
- **Datos y fuentes:**
  - /deep-research viene con los workflows; en Pro se activa en /config. https://code.claude.com/docs/en/workflows
  - «Escribí 197 piezas… buena parte ya existía»: caption del carrusel de repos (`PARA-PUBLICAR-APPLE-REPOS.md`). Recontar antes de decirlo.
  - El día de grabar, confirmar que el comando aparece en su versión (2.1.288 el 11-oct).

### SI-10 · 750.000 líneas en 11 días (era G-11)
- **Enseña:** qué es orquestar agentes y cuándo conviene. **Para quién:** el que escucha «orquestación de agentes» y no sabe qué es. **Molde:** número y caso en el cuadro 0, de Erik, con analogía de cierre de Hormozi · **Duración:** ~62 s
- **Gancho (0-3 s, dicho):** «Un programador y Claude pasaron setecientas cincuenta mil líneas de código a otro idioma. En once días.» · **Rótulo arriba:** 750.000 LÍNEAS EN 11 DÍAS
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-6 | Un programador y Claude pasaron setecientas cincuenta mil líneas de código a otro idioma. En once días. | Contador «750.000 líneas · 11 días» y chip «Zig → Rust». |
| 6-16 | Lo cuenta Anthropic, la empresa de Claude: Jarred Sumner pasó su programa, Bun, y siguió pasando el noventa y nueve coma ocho por ciento de las pruebas. | Recorte del blog con el caso. Tarjeta «99,8 % de los tests · cifra de Anthropic». |
| 16-31 | ¿Cómo? Claude Code, la IA que programa en tu compu, lanza decenas de copias de Claude a la vez. Cada una hace una parte. Al final, Claude junta todo y lo compara. | Esquema animado: un Claude en el centro, flechas a muchos Claude chicos y vuelta al centro. |
| 31-37 | Yo lo uso para revisar mis guiones: [N] agentes a la vez, cada uno buscando otro error. | Su corrida real con los [N] agentes en pantalla. Si no hay corrida, el tramo se corta. |
| 37-43 | Se activa escribiendo ultracode en tu pedido. O diciéndole: «usá un workflow», un plan de agentes. | «ultracode» tecleado y subrayado en verde. |
| 43-51 | Ojo: gasta mucho más de tu límite que una charla normal. Y en el plan Pro, primero lo activás en la configuración. | Rótulo «GASTA MUCHO MÁS». `/config` en pantalla. |
| 51-58 | ¿Cuándo sirve? Si el trabajo se parte en pedazos que no se esperan. Si todo depende de todo, no. | Así sí y así no: piezas sueltas en verde, una cadena en gris. Regla «SOLO SI SE PARTE». |
| 58-62 | Claude es el director de orquesta: no toca, hace que todos suenen juntos. | La cara completa. |
| 62-66 | Buscá ORQUESTA en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá ORQUESTA en Avisos · link en mi perfil». **Recurso:** las tres formas de activarlo, los límites, el pedido real con el que revisa guiones y los dos links.
- **Datos y fuentes:**
  - Anuncio del 28-may-2026 y el caso Bun (Zig a Rust, ~750.000 líneas, 99,8 % de los tests, 11 días): cifra de Anthropic. https://claude.com/blog/introducing-dynamic-workflows-in-claude-code
  - 16 agentes a la vez por defecto, 1.000 por corrida, en Pro se activa en /config. https://code.claude.com/docs/en/workflows

### SI-11 · Dos repos para Claude Code (era G-04)
- **Enseña:** qué hacen dos repos virales y cuál te sirve según tu problema. **Para quién:** el que recién arranca con Claude Code. **Molde:** repos de Pablo (una herramienta por bloque, pantalla partida; el suyo dura 21 s, acortar más lo decide Sergio Urcullo) · **Duración:** ~48 s
- **Gancho (0-3 s, dicho):** «¿Claude Code no se acuerda de lo que hizo ayer? ¿No entendés tu propio proyecto? Dos repos lo arreglan.» · **Rótulo arriba:** 2 REPOS PARA CLAUDE CODE
- **Guion por tramos:**

| s | Dice | Se ve |
|---|---|---|
| 0-7 | ¿Claude Code no se acuerda de lo que hizo ayer? ¿No entendés tu propio proyecto? Dos repos lo arreglan. | Los dos repos en mosaico. Chip «CLAUDE CODE = LA IA QUE PROGRAMA EN TU COMPU». |
| 7-11 | Un repo es una carpeta de código que alguien comparte gratis. | Rótulo «REPO = CARPETA COMPARTIDA». |
| 11-23 | Uno: claude-mem. Anota todo lo que hace Claude, y en la próxima charla se lo recuerda. Yo lo tengo instalado. La prueba: abrí otra charla y preguntale qué hizo ayer. | Captura de thedotmack/claude-mem. Su lista de plugins. Una charla nueva donde contesta qué hizo ayer, grabada el día de grabar. |
| 23-30 | Ojo: anota todo. No le pegues contraseñas. Una parte es gratis treinta días; después usa tu plan. | Rótulo «ANOTA TODO». |
| 30-40 | Dos: archify. Le pasás una idea o un código y te devuelve un diagrama que podés tocar. Sirve para entender un proyecto sin leerlo entero. | Captura de tt-a1i/archify y el diagrama interactivo real, con el cursor tocándolo. |
| 40-44 | Son como apps para el celular, pero para Claude. | La cara completa. |
| 44-48 | Buscá REPOS en Avisos de mi comunidad. Link en mi perfil. | CTA tecleado. |

- **CTA (tecleado):** «Buscá REPOS en Avisos · link en mi perfil». **Recurso:** los comandos de los dos, qué hace cada uno en una línea y los avisos de claude-mem.
- **Datos y fuentes:**
  - claude-mem, 99,3 mil estrellas; registra todo; 30 días gratis de su servicio y después tu plan o una suscripción. https://github.com/thedotmack/claude-mem
  - archify, 81,7 mil estrellas, pide Node. https://github.com/tt-a1i/archify
  - Instalado en su PC: claude-mem aparece como skills `claude-mem:*`. Su buscador no conectó el 11-oct: probar la respuesta antes de grabar.
  - El token cripto que menciona el README de claude-mem no se nombra. Archify está en el plan S4: revisar que no salga dos veces.

---

## Avisos a pegar

- Cada bloque se pega tal cual en Avisos de la comunidad **antes** de la hora del video.
- La PALABRA se dice en el video solo si su aviso ya está pegado. Si no, va la toma de cierre sin palabra.
- Lo que va entre corchetes se completa con la medición del guion. Si falta, esa línea se borra; no se publica un corchete.

**RUTINA** (SI-01). Tiene que existir antes: la rutina creada el día anterior y la captura de lo que dejó.
```
*RUTINA* · */loop o /schedule: cuál usar*

/loop
• Corre en tu compu, con Claude Code abierto.
• Mínimo: cada 1 minuto. Se apaga a los 7 días.
• Ejemplo: /loop 5m revisá si terminó

/schedule (rutinas)
• Corre en la nube de Anthropic, aunque tu compu esté apagada.
• Mínimo: cada 1 hora. Solo planes Pro, Max, Team y Enterprise. Está en prueba.
• Ejemplo oficial: /schedule daily PR review at 9am

Regla: compu prendida → loop. Compu apagada → schedule.

Tres ideas de rutina:
1. Todos los días a las 9: revisá los cambios del proyecto y resumilos.
2. Cada lunes a las 8: listá lo que quedó pendiente.
3. Cada viernes a las 18: decime qué archivos cambiaron en la semana.

Ojo: las rutinas corren sin pedirte permiso. Dales poco poder: que lean, no que borren.

https://code.claude.com/docs/en/scheduled-tasks
https://code.claude.com/docs/en/routines
```

**OPENCLAW** (SI-02). Tiene que existir antes: el link directo a la sección de seguridad y sandbox del README, confirmado el día de pegar. La prueba, solo si Sergio Urcullo aprobó instalarlo.
```
*OPENCLAW* · *3 reglas antes de instalarlo*

1. Compu aparte: una vieja o un servidor alquilado. Nunca la que tiene tu banco o tus contraseñas.
2. Sandbox: encerralo en una caja cerrada. Lo que rompa, queda adentro.
3. Skills solo de gente que conocés. Leelas antes de instalarlas.

Por qué: lee mensajes de afuera, y un mensaje puede traer órdenes escondidas. Su propio manual los trata como no confiables, y dice que las herramientas corren en tu equipo salvo que lo encierres.

Prueba: pedile que abra un archivo fuera de su caja. Si no puede, está bien encerrado.

Manual y seguridad: https://github.com/openclaw/openclaw
Instalar (en la compu aparte): curl -fsSL https://openclaw.ai/install.sh | bash
```

**VAGO** (SI-03). Tiene que existir antes: la prueba con y sin ponytail grabada el día de grabar, con el conteo de líneas.
```
*VAGO* · *ponytail: que Claude escriba solo lo que hace falta*

Instalar, dentro de Claude Code:
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail

Lo que midió su autor (39 tareas, 5 corridas): −53 % de código y −26 % de costo. No encontré otra medición.
https://github.com/DietrichGebert/ponytail

Probalo vos:
1. Sin el plugin, pedile algo chico (por ejemplo, «un botón que cuente clics»). Contá las líneas.
2. Con el plugin, el mismo pedido. Contá las líneas.
3. ¿Hace lo mismo con menos? Quedátelo. ¿Dejó de hacer algo que pediste? Sacalo.
```

**SECRETOS** (SI-04). Tiene que existir antes: nada más que este texto.
```
*SECRETOS* · *4 comandos escondidos de Claude Code*

• /radio: pone Claude FM, música lo-fi para concentrarte.
• /powerup: lecciones de Claude Code adentro de Claude Code.
https://code.claude.com/docs/en/whats-new

• ultrathink: escribilo en tu pedido y Claude piensa más, solo en esa respuesta. Pensar más gasta más: guardalo para lo difícil.
https://code.claude.com/docs/en/model-config

• claude agents: una pantalla con todas tus sesiones en segundo plano (en prueba).
https://code.claude.com/docs/en/agents

¿No te aparecen? Actualizá Claude Code.
```

**HERMES** (SI-05). Tiene que existir antes: [X] medido en LiteLLM y los días caído recontados en el log.
```
*HERMES* · *Tu propio Jarvis: qué pagás y dónde instalarlo*

Hermes Agent, de Nous Research. Gratis (MIT).
https://github.com/NousResearch/hermes-agent

Instalar en un servidor (Linux, Mac o WSL2):
curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash

El programa es gratis. El cerebro se paga aparte: Nous Portal, OpenRouter (una tienda de modelos), OpenAI o tu propio servidor de modelos.
A mí me sale [X] US$ al mes.

Cuatro cuidados:
1. Servidor alquilado o Docker. No en tu laptop: ejecuta comandos.
2. Nada de contraseñas personales en esa compu.
3. Empezá con un solo canal.
4. Poné algo que te avise si deja de contestar. El mío estuvo [9] días caído y no me enteré.
```

**CAVEMAN** (SI-06). Tiene que existir antes: la medición [A] y [B] de la misma pregunta.
```
*CAVEMAN* · *Claude, versión cavernícola*

Instalar (en la terminal):
claude plugin marketplace add JuliusBrussee/caveman
claude plugin install caveman@caveman
Modo ultra: /ultracave

Lo que midió su autor (10 preguntas): 6.983 → 4.119 tokens de respuesta (−41 %). Con ultra: 2.693 (−61 %).
https://github.com/JuliusBrussee/caveman

Mi prueba, la misma pregunta: [A] palabras sin caveman y [B] con caveman.

Letra chica: solo achica el texto, no el código. En una charla larga, contando todo, una guía midió ~4 %. Sirve para leer menos, no para que te dure el límite.
```

**GOAL** (SI-07). Tiene que existir antes: la corrida real con el juego y su número de turnos [T].
```
*GOAL* · *Plantilla de /goal*

/goal <algo que se vea en la charla>, o pará a los 20 turnos

Metas buenas:
1. /goal el juego corre sin errores y me mostrás la salida, o pará a los 20 turnos
2. /goal todas las pruebas pasan y me mostrás el resultado, o pará a los 20 turnos
3. /goal el resumen tiene 10 puntos, cada uno con su link, o pará a los 20 turnos
Las tres se pueden ver en la charla.

Metas malas:
1. «que quede lindo»: nadie puede comprobarlo.
2. «mejorá el proyecto»: nunca termina.
3. «arreglá todo»: es muy grande, partila.

Por qué: un modelo chico lee la charla y decide si se cumplió. Si no lo ve ahí, no lo puede comprobar.
Ojo: no quita las preguntas de permiso.
https://code.claude.com/docs/en/goal
```

**HYPERFRAMES** (SI-08). Tiene que existir antes: el clip del cuadro 0 hecho con este prompt.
```
*HYPERFRAMES* · *Videos que escribe Claude*

Necesitás: Claude Code, Node 22 o más (https://nodejs.org) y FFmpeg (https://ffmpeg.org).

Con Claude Code (plugin):
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes

Sin plugin, tres comandos:
npx hyperframes init mi-video
cd mi-video
npx hyperframes preview
npx hyperframes render

Mi prompt:
«Con HyperFrames, hacé un título animado vertical de 3 segundos. Fondo negro. El texto ESTE VIDEO LO ESCRIBIÓ CLAUDE en blanco, con la palabra CLAUDE en verde #10C26B. Que entre desde abajo con un rebote suave y quede quieto el último segundo.»

Ojo: no edita lo que grabaste ni hace avatares. Sirve para títulos, placas y animaciones.
https://github.com/heygen-com/hyperframes
```

**INVESTIGAR** (SI-09). Tiene que existir antes: el informe real que se muestra en el video y el número [197] recontado.
```
*INVESTIGAR* · *Investigar con fuentes y comprobarlo en 2 minutos*

En Claude Code: /deep-research <tu pregunta>
En el plan Pro, primero activá los workflows en /config.
Gasta más de tu límite que una pregunta normal.

Comprobar en 3 pasos (sirve con cualquier IA que te dé links):
1. Abrí dos citas al azar.
2. ¿Dicen lo mismo que el informe?
3. Si una no existe o dice otra cosa, ese dato no lo usás.

Tres preguntas de ejemplo:
• ¿Ya existe un plugin de Claude Code que haga [lo que querés construir]?
• ¿Cuánto cuesta de verdad tener un asistente de IA propio?
• ¿Qué cambió en Claude Code este mes, según su documentación oficial?

https://code.claude.com/docs/en/workflows
```

**ORQUESTA** (SI-10). Tiene que existir antes: la corrida real que revisa guiones, con su número de agentes [N]. El pedido de abajo se ajusta al que se usó de verdad.
```
*ORQUESTA* · *Orquestar agentes en Claude Code*

Tres formas de activarlo:
• /effort ultracode
• la palabra ultracode en tu pedido
• «usá un workflow»
En el plan Pro, primero activalo en /config.

Límites: 16 agentes a la vez por defecto y hasta 1.000 por corrida. Gasta mucho más de tu límite que una charla normal.
Sirve si el trabajo se parte en pedazos que no se esperan. Si todo depende de todo, no.

Mi pedido para revisar guiones:
«ultracode: revisá estos guiones. Un agente por guion. Cada uno busca palabras técnicas sin explicar y cifras sin fuente. Al final, juntá todo en una tabla.»

El caso Bun (cifras de Anthropic): https://claude.com/blog/introducing-dynamic-workflows-in-claude-code
https://code.claude.com/docs/en/workflows
```

**REPOS** (SI-11). Tiene que existir antes: la prueba de claude-mem contestando en una charla nueva.
```
*REPOS* · *claude-mem y archify*

claude-mem: anota lo que hace Claude y se lo recuerda en la próxima charla.
Dentro de Claude Code:
/plugin marketplace add thedotmack/claude-mem
/plugin install claude-mem
No uses npm i -g claude-mem: no instala los hooks.
Ojo: anota todo. No le pegues contraseñas. Su servicio es gratis 30 días; después usa tu plan de Anthropic o pide una suscripción.
https://github.com/thedotmack/claude-mem

archify: de una idea o un código a un diagrama que podés tocar. Pide Node.
npx skills add tt-a1i/archify -g
https://github.com/tt-a1i/archify
```
