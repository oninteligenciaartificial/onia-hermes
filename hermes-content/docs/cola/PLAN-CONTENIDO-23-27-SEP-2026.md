# Plan de contenido grabable · miércoles 23 a domingo 27 de septiembre de 2026

> **25-sep: plan con fecha, así que es historia y no fuente.** Las 11 piezas por día son una
> de las cuatro cadencias vivas, y la cadencia la fija Sergio Urcullo
> (`ONIA_CIRCUITO_DE_CONTENIDO.md` §7). 🧊 Lo del piloto presencial «IA Lab Santa Cruz» está
> congelado desde el 25-sep: **no salen las piezas con `SANTA CRUZ`**.

## Decisión editorial

La semana no copia a Erik Taveras, Enrique Rocha ni Santiago Muñoz. Toma tres mecanismos:

- **Erik:** autoridad por sistemas operados, métricas, errores y continuidad hacia comunidad.
- **Enrique:** cada short conduce a una guía pública, específica y actualizable.
- **Santiago:** demo completa, encuentro, hot seat, recurso y acompañamiento.

La identidad propia es: **Sergio, joven constructor boliviano, prueba sistemas de IA en
ONIA y enseña exactamente cómo funcionan, cuánto cuestan, dónde fallan y cuándo no usarlos.**

Fuentes de referencia consultadas el 22-sep-2026:

- <https://eriktaveras.com/>
- <https://www.tododeia.com/about>
- <https://www.horizontesia.com/sobre-nosotros>

## Cadencia diaria

Cada día se publican **11 piezas**:

- Feed: 3 — pilar de Samuel + B-roll Sergio/Samuel o carrusel + video normal Sergio.
- Trial: 4 — los tres del Feed reutilizados + un yap de Samuel.
- Trial v2: 4 — Sergio hablando a cámara, con edición mínima pero prueba visible.

Los 11 no son 11 rodajes. Son **6 piezas originales de Sergio por día**, más las de Samuel
y la reutilización. El viernes el carrusel reemplaza el B-roll, respetando el ciclo de tres
videos por un carrusel.

Cada mañana a las 07:00 se revisan fuentes oficiales. Una noticia nueva sólo reemplaza el
Trial v2 menos prioritario; nunca desplaza el tutorial central ni se publica sin fuente,
fecha, consecuencia y demostración.

---

## Miércoles 23 · modelos, MCP y llamada 1:1

Objetivo: convertir los lanzamientos del 22 de septiembre en decisiones medibles y usar la
preparación de la llamada como contenido personal sin exponer a la otra persona.

### Distribución

| Espacio | Pieza | Formato | Qué enseña literalmente | Prueba | CTA |
|---|---|---|---|---|---|
| Feed pilar | Brief para Samuel: el modelo correcto depende de la tarea | Samuel | comparar calidad, costo y latencia | tabla A/B | lo define Samuel |
| Feed B-roll | No elijo modelos por benchmarks | Sergio/Samuel | `costo total / tareas correctas` | hoja con 10 casos | `MODELO` |
| Feed normal | Las 6 preguntas antes de automatizar | Sergio + pizarra | entrada, pasos, volumen, errores, costo, resultado | plantilla vacía | `1A1` |
| Trial v2 1 | GPT-6 Sol vs Luna | split vertical | precios `$2/$10` frente a `$0.10/$0.50`; prueba A/B | anuncio oficial | `MODELO` |
| Trial v2 2 | Auditoría MCP en dos comandos | pantalla dividida | `claude mcp list` y `claude mcp get NOMBRE` | terminal saneada | `MCP` |
| Trial v2 3 | Opus 5.5 rompe estas dos configuraciones | pantalla verde | thinking desactivado y tool choice forzado | guía oficial | `OPUS` |
| Trial v2 4 | Cómo preparo una llamada 1:1 | B-roll personal | intake y agenda 5/25/10/5 | calendario ocultando datos | `1A1` |

### Guion · Feed B-roll

> Hoy salieron modelos nuevos y la reacción fácil es preguntar cuál es “el mejor”. Yo hago
> otra cosa. Tomo diez tareas reales y corro exactamente el mismo input. En cada fila guardo
> si pasó, cuántos tokens usó, cuánto tardó, cuántas tools llamó y cuánto costó.
>
> Después calculo `costo total dividido entre tareas correctas`. Un modelo de diez centavos
> puede salir más caro si falla y obliga a repetir; uno más caro puede ahorrar si termina a
> la primera. El benchmark me ayuda a elegir candidatos. Mi carga real decide.
>
> En pantalla te dejo la tabla. No cambies un modelo en producción hasta probarlo con tus
> errores, tus tools y tus datos.

Pantalla: comparación oficial de GPT-6 Sol/Luna y la tabla A/B del recurso `OPUS`, cambiando
el nombre de los modelos. Atribuir benchmarks y claims a OpenAI.

### Guion · Feed normal / 1:1

> Mañana tengo una llamada 1 a 1 y no voy a llegar preguntando “¿qué querés automatizar?”.
> Primero necesito seis respuestas.
>
> ¿Qué dato entra? ¿Qué pasos siguen hoy? ¿Cuántas veces pasa? ¿Dónde falla? ¿Cuánto cuesta
> ese fallo? ¿Qué resultado tendría que salir?
>
> Si no podemos dibujar entrada, responsable, decisión y salida, meter n8n o un agente sólo
> acelera el desorden. En la llamada, cinco minutos son para acordar resultado, veinticinco
> para diagnosticar, diez para el plan y cinco para responsable y fecha.
>
> Comentá `1A1` y te paso la plantilla vacía. El caso de la persona queda privado; lo que
> comparto es el método.

### Guion · Trial v2 · GPT-6 Sol vs Luna

> OpenAI lanzó GPT-6 Sol y Luna. Sol cuesta dos dólares de entrada y diez de salida por
> millón de tokens. Luna cuesta diez centavos de entrada y cincuenta de salida.
>
> Eso no significa que Luna sea la elección automática. Probá diez tareas: cinco simples y
> cinco difíciles. Marcá correcta o incorrecta, latencia, tokens y costo. Después dividí el
> costo total entre las tareas correctas.
>
> Usá Luna para volumen simple si sostiene la calidad. Subí a Sol cuando el error o los
> reintentos hacen más cara la opción barata. Los benchmarks del lanzamiento son pruebas de
> OpenAI; tu decisión se hace con tu carga.

Fuente: <https://openai.com/index/introducing-gpt-6-sol-and-luna/>.

### Guion · Trial v2 · MCP

> Antes de conectar un MCP en Claude Code corré `claude mcp list`. Después corré
> `claude mcp get NOMBRE`.
>
> Revisá URL o comando, alcance y variables, sin mostrar sus valores. Abrí `/mcp` y poné
> cada tool en una de cuatro columnas: lee, escribe, borra o sale a internet.
>
> Si una sesión puede leer datos privados y también enviar información afuera, no la
> apruebes completa: separá permisos. Y recordá que `readOnlyHint` es una pista, no una
> barrera de seguridad.

### Guion · Trial v2 · Opus migración

> Cambiar a `claude-opus-5-5` no es sólo editar el nombre. Si mandás
> `thinking: disabled`, recibís error. Thinking queda activo y la profundidad se controla
> con `output_config.effort`.
>
> Segundo: `tool_choice` con `any` o una tool forzada tampoco está soportado. Usá `auto`,
> tools estrictas e instrucciones explícitas.
>
> Primero hacé estas dos búsquedas en tu código. Después corré tus pruebas de tool calls.
> Comentá `OPUS` y te paso el checklist completo.

### Guion · Trial v2 · preparación personal

> Una llamada 1 a 1 no debería ser una conversación cara sin resultado. Antes preparo cinco
> campos: objetivo, stack actual, bloqueo, evidencia y tres decisiones pendientes.
>
> Durante la llamada no intento vender todo. Cierro una sola acción con responsable y fecha.
> Después registro las preguntas repetidas, pero nunca convierto un caso privado en contenido
> sin permiso.

> Comentá `1A1` y te paso la hoja que voy a usar.

---

## Jueves 24 · n8n y ONIA en funcionamiento

Objetivo: enseñar un workflow real nodo por nodo y separar estructura válida de decisión
correcta.

### Distribución

| Espacio | Pieza | Formato | Qué enseña literalmente | Prueba | CTA |
|---|---|---|---|---|---|
| Feed pilar | Brief Samuel: un workflow simple vende más que un “agente” confuso | Samuel | valor de ruta predecible | caso de lead | Samuel |
| Feed B-roll | Construyendo el calificador | B-roll real | nodos y ejecución | n8n limpio | `N8N` |
| Feed normal | Calificador de leads nodo por nodo | split vertical | Webhook → LLM Chain → Parser → Sheets → Switch | dos payloads | `N8N` |
| Trial v2 1 | Parser no valida verdad | cámara + JSON | schema válido vs clasificación equivocada | dos outputs | `N8N` |
| Trial v2 2 | Force Tool Call no garantiza verdad | pantalla | primera tool obligatoria, resultado aún verificable | trace de prueba | `TOOL` |
| Trial v2 3 | `Switch` o agente | cámara directa | quién decide el siguiente paso | dos diagramas | `MAPA` |
| Trial v2 4 | Antes de automatizar ONIA pregunta esto | pizarra | entrada, responsable, decisión, salida, excepción | mapa de proceso | `PROCESO` |

### Guion · Feed normal / n8n

> Construí un calificador de leads sin esconderlo detrás de la palabra agente.
>
> `Webhook` recibe `nombre`, `mensaje` y `servicio`. `Basic LLM Chain` clasifica. El
> `Structured Output Parser` exige `categoria`, `urgencia`, `requiere_humano`, `score` y
> `razon`. `Google Sheets` registra todo. `Switch` manda `score >= 70` a revisión y usa una
> salida fallback para cualquier categoría desconocida.
>
> Lo pruebo con dos payloads: uno claro y uno ambiguo. El parser valida la forma; no puede
> garantizar que la decisión sea correcta. Por eso guardo `razon` y reviso los casos límite.
>
> Comentá `N8N` y te paso mapa, prompt y schema.

### Guion · Trial v2 · parser

> Este JSON puede cumplir el schema y estar equivocado.
>
> El parser comprueba tipos, campos obligatorios y valores permitidos. Por ejemplo, obliga a
> que `score` sea número y `categoria` esté en una lista. Pero si el modelo pone score 90 a
> un lead malo, la estructura sigue siendo válida.
>
> Probá tres casos conocidos y compará resultado esperado contra resultado real. Schema
> evita basura de formato; evaluación evita malas decisiones.

### Guion · Trial v2 · tool forzada

> n8n puede obligar al agente a usar una tool en la primera iteración. Eso garantiza el
> intento, no la verdad.
>
> Probalo con `Manual Trigger → AI Agent → Calculator Tool`. Ejecutá con la opción apagada y
> encendida. Abrí el trace y verificá si la primera acción fue la calculadora. Después revisá
> si el input y la respuesta fueron correctos.
>
> Controlar qué tool se llama no reemplaza validar lo que devuelve.

Reverificar la opción en la versión instalada antes de grabar; no actualizar n8n en
producción para crear contenido.

### Guion · Trial v2 · Switch o agente

> Si el modelo devuelve una categoría y `Switch` elige la ruta, la decisión operativa la
> tomó tu regla. Es un workflow con IA.
>
> Si el modelo ve el resultado, elige entre `search_docs`, `get_lead_by_id` y
> `request_missing_field`, y decide qué hacer después, aparece comportamiento de agente.
>
> La pregunta práctica es: ¿puedo dibujar todas las rutas antes de ejecutar? Si sí, empezá
> con workflow. Es más fácil de probar y detener.

### Guion · Trial v2 · mapa ONIA

> Antes de automatizar un negocio llená cinco columnas: entrada, responsable, dato,
> decisión y salida. Agregá una sexta: excepción.
>
> En una reserva, la entrada es el mensaje; el responsable es atención; el dato es
> disponibilidad; la decisión es confirmar o escalar; la salida es la reserva. Un precio
> excepcional o devolución va a una persona.
>
> Si una columna está vacía, todavía no construyas el agente. Comentá `PROCESO` y te paso la
> tabla.

---

## Viernes 25 · Bolivia, negocio y proceso

Objetivo: demostrar que contenido local útil no es repetir titulares; es actualizar una
decisión y enseñar a medir retorno.

El carrusel reemplaza el B-roll.

### Distribución

| Espacio | Pieza | Formato | Qué enseña literalmente | Prueba | CTA |
|---|---|---|---|---|---|
| Feed pilar | Brief Samuel: verificar antes de actuar | Samuel | fuente, fecha y cambio | fuente oficial | Samuel |
| Feed carrusel | 6 columnas antes de automatizar | 8 láminas | mapa de proceso | ejemplo cafetería | `PROCESO` |
| Feed normal | El dato del 23 de septiembre quedó viejo | pantalla verde | comparar noticia previa con actualización SIN | comunicado oficial | guardar/compartir |
| Trial v2 1 | ROI de automatización en Bs | pizarra | fórmula completa | cálculo supuesto | `BOLIVIA` |
| Trial v2 2 | Información tributaria no es asesoría | cámara | cuatro datos que revisar en SIAT | checklist | sin CTA comercial |
| Trial v2 3 | Automatizar un proceso roto | pantalla + error | cinco ejecuciones manuales | error y corrección | `PROCESO` |
| Trial v2 4 | Qué aprendí de una 1:1 sin contar el caso | personal | patrón anonimizado | plantilla, no cliente | `1A1` |

### Carrusel · ocho láminas

1. `NO AUTOMATICES TODAVÍA` — si no podés llenar estas seis columnas.
2. `ENTRADA` — mensaje, formulario, factura o evento exacto.
3. `RESPONSABLE` — quién responde cuando falla.
4. `DATO` — qué necesita para decidir.
5. `DECISIÓN` — regla o criterio explícito.
6. `SALIDA` — registro, respuesta, tarea o pago.
7. `EXCEPCIÓN` — cuándo pasa a una persona.
8. `Comentá PROCESO` — recibe la tabla; “Soy Sergio Urcullo. Construyo sistemas de IA
   desde Bolivia y te muestro cómo funcionan.”

### Guion · actualización SIN

> Si guardaste una noticia que decía 23 de septiembre, revisala: el dato quedó viejo.
>
> El Servicio de Impuestos Nacionales informó el 16 de septiembre que la regularización se
> amplió hasta el 31 de diciembre de 2026, bajo las condiciones del Decreto Supremo 5708.
>
> La lección no es fiscal; es operativa. Antes de crear un recordatorio o publicar una fecha,
> abrí la fuente oficial, comprobá fecha de actualización, modalidad y condiciones. Después
> verificá tu caso en SIAT o con tu profesional.
>
> Esto es información general, no asesoría tributaria personalizada.

Fuente: <https://www.impuestos.gob.bo/index.php/nota_prensa/el-gobierno-amplia-el-plazo-de-regularizacion-tributaria-hasta-el-31-de-diciembre-de-2026/>.

### Guion · ROI en bolivianos

> Una automatización no se paga porque tenga IA. Se paga si recupera más de lo que cuesta.
>
> Multiplicá horas mensuales recuperadas por costo de hora en bolivianos. Sumá errores
> evitados y oportunidades recuperadas. Restá costo mensual del sistema. Para recuperar la
> inversión, dividí costo inicial entre retorno mensual.
>
> Cada cifra se marca como medida o supuesto. Si el proceso cambia cada semana o casi no
> ocurre, quizá todavía no conviene automatizar.
>
> Comentá `BOLIVIA` y te paso la calculadora.

### Guion · proceso roto

> Automatizar un proceso roto sólo fabrica errores más rápido.
>
> Ejecutalo manualmente cinco veces. En cada intento anotá entrada, excepción, decisión y
> salida. Después definí éxito, error y cuándo interviene una persona.
>
> Recién entonces dibujá el workflow. En pantalla te muestro una ejecución que falla por un
> campo vacío y la segunda que usa fallback en vez de perder el lead.

### Guion · aprendizaje 1:1

Este guion se completa después de la llamada. Sólo usar un patrón general, por ejemplo:

> Hoy confirmé algo en una llamada: [patrón general]. No voy a contar el caso ni mostrar
> datos. La lección aplicable es [método]. Para resolverlo primero [paso 1], después [paso
> 2] y recién entonces [paso 3].

Si no aparece una lección general verificable, esta pieza se reemplaza por el filtro de
proceso roto. No inventar aprendizaje.

---

## Sábado 26 · comunidad, HyperFrames y Santa Cruz

> 🧊 **25-sep:** no salen las tres piezas con `SANTA CRUZ` (B-roll del laboratorio, laboratorio
> en 120 minutos, primeros 20 miembros fundadores): el piloto está congelado. HyperFrames y la
> pieza personal siguen.

Objetivo: mostrar qué recibirá una persona en la comunidad y construir una prueba técnica.
No anunciar sede ni fecha sin confirmación.

### Distribución

| Espacio | Pieza | Formato | Qué enseña literalmente | Prueba | CTA |
|---|---|---|---|---|---|
| Feed pilar | Brief Samuel: una comunidad se construye haciendo | Samuel | ritual y resultado | agenda | Samuel |
| Feed B-roll | Buscando/armando el laboratorio | vlog | sede, audio, mesa, registro | lugar real si está autorizado | `SANTA CRUZ` |
| Feed normal | Laboratorio de IA en 120 minutos | cámara + agenda | 15/25/45/20/15 | hoja de sesión | `SANTA CRUZ` |
| Trial v2 1 | HTML a video con HyperFrames | split horizontal | init, preview, render | MP4 real | `HYPERFRAMES` |
| Trial v2 2 | Qué hace seekable una animación | pantalla | timeline pausada y registrada | scrub del deck | `HYPERFRAMES` |
| Trial v2 3 | Primeros 20 miembros fundadores | cámara | identidad, acción semanal, reconocimiento | lista manual | `SANTA CRUZ` |
| Trial v2 4 | Personal: construir localmente | B-roll ciudad | motivación con acción concreta | preparación real | pregunta abierta |

### Guion · laboratorio de 120 minutos

> El primer laboratorio gratuito de IA en Santa Cruz no será dos horas de diapositivas.
>
> Quince minutos para presentarnos. Veinticinco para una demo completa. Cuarenta y cinco
> para que cada persona construya. Veinte para hot seats y networking. Quince para mostrar
> resultados y elegir la siguiente práctica.
>
> El resultado mínimo es salir con un workflow pequeño ejecutado, no sólo con apuntes.
> Después de cuatro pilotos medimos asistencia, proyectos terminados y regreso antes de
> pensar en una comunidad paga.
>
> Comentá `SANTA CRUZ` con lo que querés construir. Todavía no anuncio fecha ni sede hasta
> confirmarlas.

### Guion · HyperFrames

> HyperFrames convierte HTML animado en video reproducible. El flujo mínimo es crear el
> proyecto, abrir preview y renderizar.
>
> La parte clave no es el comando: la timeline debe estar pausada y registrada para que el
> renderer pueda ir a cualquier tiempo. Cambio este título en el HTML, hago scrub en preview
> y renderizo el MP4.
>
> Después corro el check y miro snapshots. Si hay overflow o el texto no cabe, no renderizo
> el master.
>
> Comentá `HYPERFRAMES` y te paso la composición mínima y los comandos.

Usar el deck existente `yt-07-hyperframes`; verificar la versión instalada el día de
grabar. El 22-sep el repo oficial mostraba `v0.8.62` como release más reciente.

### Guion · seekable

> Una animación para video debe ser seekable: si salto al segundo 3, tiene que verse
> exactamente el estado del segundo 3.
>
> Por eso registro una timeline pausada. El renderer controla el tiempo; no espera a que una
> animación libre termine. En pantalla muevo el playhead hacia atrás y adelante y el título
> vuelve al mismo lugar.
>
> Si depende de timers sueltos o de una transición que sólo corre una vez, la captura cuadro
> por cuadro puede romperse.

### Guion · miembros fundadores

> Una comunidad no empieza con mil personas. Empieza con veinte que hacen algo juntas.
>
> La acción semanal será mostrar qué construiste, qué se rompió y cuál es tu siguiente paso.
> Yo respondo a los primeros miembros, conecto personas con problemas parecidos y destaco
> proyectos terminados.
>
> El grupo no existe para recibir enlaces todos los días; existe para que alguien pase de
> guardar tutoriales a ejecutar un sistema.

---

## Domingo 27 · bóveda, negocio y cierre semanal

Objetivo: cerrar el circuito contenido → recurso → comunidad sin fingir una automatización
que todavía no existe.

### Distribución

| Espacio | Pieza | Formato | Qué enseña literalmente | Prueba | CTA |
|---|---|---|---|---|---|
| Feed pilar | Brief Samuel: la semana se mide por sistemas terminados | Samuel | revisión | tablero | Samuel |
| Feed B-roll | Lo que construí y lo que falló | vlog | tres resultados y un fallo | archivos reales | pregunta |
| Feed normal | De comentario a recurso | horizontal recortable | siete pasos y campos | demo manual punta a punta | `BÓVEDA` |
| Trial v2 1 | CTA sin recurso es humo | cámara | gate de existencia | recurso abierto | `BÓVEDA` |
| Trial v2 2 | Postiz no responde DMs | pantalla | programador vs API/inbox | interfaz real | `MAPA` |
| Trial v2 3 | Cotizar SaaS en Bolivia | pizarra | moneda, fuente, fecha, vigencia, margen | factura ficticia | guardar |
| Trial v2 4 | Revisión personal de domingo | directo | construir, enseñar, escuchar, corregir | tablero semanal | pregunta |

### Guion · comentario a recurso

> Un comentario no es un lead hasta que el sistema entrega algo y registra qué pasó.
>
> El flujo mínimo es: contenido con palabra clave, respuesta manual o integración
> autorizada, URL específica, formulario opcional con consentimiento, webhook de n8n,
> entrega, registro y una invitación adecuada.
>
> Los campos mínimos son `comment_id`, `from_id`, `keyword`, `resource_url`,
> `delivery_status` y `consent_at`. Primero lo probamos manualmente. Después automatizamos
> con firma, deduplicación, rate limit y fallback humano.
>
> Comentá `BÓVEDA` y te paso el mapa; te voy a responder manualmente mientras cerramos la
> integración.

### Guion · CTA con recurso

> Pedir “comentá X” sin tener X listo es una deuda con tu audiencia.
>
> Antes de publicar abro la URL, pruebo el archivo desde incógnito, verifico móvil, confirmo
> que no pide datos innecesarios y ensayo la respuesta manual. Si falla uno, saco el CTA.
>
> El comentario no es el valor. El valor es que la persona reciba algo que pueda usar.

### Guion · Postiz

> Postiz sirve para programar y distribuir publicaciones. No lo presentes como inbox de
> mensajes ni como automatización de comentarios.
>
> Para entregar recursos necesitás respuesta manual o una integración autorizada con la API
> de Meta, firma del webhook, deduplicación por `comment_id`, límites y revisión humana.
>
> Una herramienta de publicación no reemplaza el sistema de conversación.

### Guion · cotizar en Bolivia

> Si un costo está en dólares y vos cotizás en bolivianos, no escondás el supuesto.
>
> Mostrá moneda de origen, fuente del tipo de cambio, fecha consultada, impuestos o cargos
> aplicables, margen de seguridad y vigencia de la propuesta. Con una factura ficticia de
> cien dólares enseño cómo cambia el total cuando cambia el supuesto.
>
> No adivines el tipo futuro ni prometas una tasa. Recalculá el día de cotizar y dejá la
> vigencia escrita.

Reverificar el dato del BCB el mismo domingo. Es un ejemplo comercial general, no consejo
financiero.

### Guion · revisión personal

> Mi semana no se mide por cuántos videos guardé. La reviso con cuatro preguntas: qué
> construí, qué pude enseñar con prueba, qué pregunta real escuché y qué tengo que corregir.
>
> Esta semana el resultado fue [mostrar]. El error fue [mostrar]. La pregunta repetida fue
> [mostrar anonimizada]. El siguiente sistema será [acción pequeña].
>
> ¿Qué construiste vos esta semana? No me digás qué curso viste; decime qué ejecutaste.

---

## Un solo YouTube por defecto

Hasta que Sergio confirme dos, se graba **un YouTube fuerte**:

**MCP, agentes, loops y n8n: cómo se conectan de verdad**

- Deck: `hermes-content/carousels/out/yt-09-mcp-agentes-loops/`
- Guion: `hermes-content/carousels/out/yt-09-mcp-agentes-loops/GUION.md`
- Rodaje recomendado: miércoles o jueves, después de los verticales técnicos.

Los decks de n8n y HyperFrames quedan listos como siguientes episodios; no se sacrifica
claridad por grabar tres videos largos en una sesión.

## Canarios de la semana

1. Revalidar noticias el día de publicar.
2. Atribuir benchmarks y claims a la empresa que los publica.
3. Mostrar tool, nodo, campo, comando, cálculo o resultado real.
4. Incluir por lo menos un límite o caso donde no usarlo.
5. Abrir y probar el recurso antes de activar palabra clave.
6. Ocultar datos de la llamada y pedir consentimiento antes de reutilizar un caso.
7. No anunciar sede, invitado, fecha, precio ni membresía sin confirmación.
8. No publicar ni programar sin aprobación de Sergio.

## Datos pendientes que cambian el calendario

1. Hora, duración y tipo de la llamada 1:1 del miércoles.
2. Si la otra persona autoriza un aprendizaje anonimizado; por defecto, sólo se muestra la
   preparación de Sergio.
3. Si esta semana manda crecimiento, lista del piloto presencial o llamadas/leads.
4. Si la primera sede a negociar es Bolivian Electric o una cafetería.
5. Si los recursos vivirán en la web personal o temporalmente se entregarán manuales.
