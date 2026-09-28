# Rodaje de Sergio · 27-sep-2026

> Cola nueva y concreta para grabar mientras se revisa la edición del segundo video. Los guiones 1–2 del 22-sep figuran como grabados en su documento histórico: **localizar crudos antes de repetirlos**. El guion 8 del 22-sep («salió hoy») no se usa literalmente. **Nuevas reglas de Sergio, 27-sep:** el A-roll de la marca personal se entiende sin saber programar y cada pieza explica una **ventaja concreta**, cuándo conviene y su límite. Una idea útil por video, ejemplos cotidianos y lenguaje común; los nombres de nodos, parámetros, precios y pruebas técnicas quedan en pantalla, caption o pieza especializada. Enseñar algo verificable no exige recitar jerga. Ningún CTA promete un recurso que todavía no se haya probado.

## Estructura para descubrimiento, sin prometer viralidad

| Momento | Trabajo del guion | Montaje |
|---|---|---|
| 0–2 s | Contradicción verificable o error visible; no «hola, soy Sergio» | Título grande + resultado/error/cifra en pantalla. |
| 2–6 s | Promesa exacta de aprendizaje («te muestro el cálculo», «probamos la rama falsa») | Mostrar la prueba que vendrá, no B-roll genérico. |
| 6–25 s | Una acción reproducible, con herramienta/campo/fórmula real | Recorte de pantalla legible y cambio visual cuando cambia el paso. |
| 25–40 s | El límite que evita una conclusión falsa | Caso contrario, fallo real o condición de parada. |
| 40–55 s | Regla final que el espectador puede usar + pregunta concreta | Resumen grande; una sola llamada a la acción. |

Grabar **dos hooks alternativos** por cuerpo, conservar el que mejor coincida con la prueba, y medir después la retención/«viewed vs swiped» donde la plataforma lo permita. No llamar viral a un video por su número bruto de vistas. Las guías oficiales de [YouTube](https://support.google.com/youtube/answer/16559650?hl=en) y [TikTok](https://ads.tiktok.com/business/en/guides/what-is-ad-creative-guide) recomiendan valor temprano, formato nativo y testear hooks; esto orienta el diseño, no garantiza alcance.

## Antes de prender cámara

- **Formato base de todos los shorts:** Sergio en **cámara frontal vertical 9:16**, a la altura de los ojos, plano medio, con aire a un costado para títulos y ejemplos. **Sin pantalla verde**: fondo real limpio y luz suave. No grabar horizontal para Reels/Shorts. La pantalla se captura aparte en su resolución nativa, aunque sea horizontal; en edición se recorta y amplía lo importante para el 9:16. Horizontal sólo si después se graba una clase larga de YouTube.
- Vertical 9:16, cámara a la altura de los ojos, audio sin música ni notificaciones. Dejar un costado libre para títulos grandes.
- Cada short: dos tomas del gancho y dos del cierre, luego cuerpo continuo. Pausa breve al nombrar nodo/JSON; no intentar enseñar una pantalla diminuta junto a la cara.
- Pantallas con datos ficticios. Ocultar credenciales, URLs internas, nombres, teléfonos y ejecuciones de clientes. Grabar pantalla a resolución nativa para recortar en edición.
- En pantalla, una prueba que **coincida** con la frase hablada. Un diagrama conceptual lleva rótulo «esquema», no «n8n real».
- Entregar cada bruto con nombre `G01-loop-camera`, `G02-workflow-agente-camera`, etc., y las capturas `G01-loop-screen`, etc. Guardar los dos casos de prueba y, si aparece, un error real con su corrección.

## Orden vigente · instrucción del 28-sep

**Primera tanda: G09 → G11 → G12**, revisados abajo con texto completo, prompts
reproducibles y tres pantallas por video. El objetivo es enseñar una acción,
no acumular noticias ni seguir investigando herramientas. Estado declarado por
Sergio el 28-sep: este lote todavía no se ha publicado. La revisión no acredita
que los nuevos videos estén grabados ni aprueba su publicación.

El [handoff con plan](../handoff/marca-sergio-guiones-20260927.md) concentra el
arranque de la siguiente sesión. Preparar una pieza completa a la vez, empezando
por G09; los tres carruseles v2 existentes no se regeneran por defecto.

### Orden anterior · conservar sólo como contexto del 27-sep

Si ya estás grabando el video de Opus, usá **G06 generalista** de abajo y no la versión de tokens/precios anterior. G00 es sólo captura para rescatar un video existente; G01–G05 son piezas de enseñanza con voz simple y prueba técnica en pantalla. G07/G08 quedan como **banco avanzado, no para grabar ahora**. No volver a grabar guiones que el archivo del 22-sep marca como hechos hasta localizar el bruto.

### G00 · Rescate del segundo video — sólo captura de pantalla

**Formato:** sin nueva toma de cámara ni pantalla verde. Grabar pantalla nativa del workflow de prueba a buena resolución; yo la recorto y amplío en el video vertical existente.

El audio ya existe. No volver a grabar la cara hasta revisar si la nueva captura sincroniza. En un entorno de prueba, construir/abrir `Webhook → IF → Google Sheets / Append Row → Telegram / Send Message`. Hacer una captura cercana del JSON ficticio (`name`, `phone`, `service`, `source`), condiciones `phone` y `service` no vacíos, rama verdadera, rama falsa, test completo y test sin `phone`. **Precisar destinatario de la rama falsa:** con un payload sin teléfono, `Telegram` puede avisar al **equipo** para que pida el dato; si el formulario debe recibir la solicitud, añadir una respuesta como `Respond to Webhook`. La voz actual dice que la rama falsa «manda un mensaje» sin definir a quién; si la pantalla no despeja esa ambigüedad, se necesita una breve toma de voz corregida. Si esa rama no está implementada, mostrarla sólo como **esquema pendiente**; no fingir una ejecución. El workflow capturado antes verifica autorización y escribe en VPS, por lo que no sirve como prueba de este audio.

### G01 · Loop con salida — 35–45 s

**Formato:** frontal vertical 9:16, sin verde. Captura separada de las dos ejecuciones del flujo; en edición entran contador y ramas grandes.

**Hook A:** «Una automatización que revisa algo cada diez minutos necesita saber cuándo detenerse».

**Hook B:** «Este loop parece útil hasta que corre para siempre».

**Decir a cámara:**

> Imaginá que una automatización revisa si un pago ya llegó. Si llegó, avisa y termina. Si no, espera diez minutos y vuelve a mirar. Pero no puede hacerlo para siempre: después de tres intentos, se detiene y le avisa a una persona. Esa es la parte que muchos olvidan al crear un loop: no sólo cuándo repetir, sino cuándo parar y quién se encarga si algo falla.

**Mostrar:** rostro frontal para gancho; `Edit Fields` inicializa `attempt = 0`; esquema grande `HTTP Request → IF → Wait`; dos salidas `paid → terminado` y `tercera consulta aún pending → revisión humana`; pantalla de prueba con estados ficticios `pending`, `pending`, `paid`, y otra con tres `pending`. **Evaluar éxito antes del límite:** máximo tres consultas y dos esperas. El contador `attempt` debe persistir entre consultas, incluso si `HTTP Request` reemplaza el JSON; si aún no hay workflow probado, el visual se rotula «esquema» y el guion no promete exportación de n8n.

**Cierre:** «¿Tu automatización tiene un límite y una salida humana?» Sin palabra clave por ahora. Destino: Sergio short; después, ficha aplicada para comunidad sólo cuando se pruebe.

### G02 · ¿Workflow o agente? — 35–45 s

**Formato:** frontal vertical 9:16, sin verde. Yo monto dos diagramas grandes; si hay pantalla real de n8n, grabarla aparte, nunca diminuta junto a la cara.

**Hook A:** «Si ya dibujaste todos los pasos, quizá no necesitás un agente».

**Hook B:** «Este clasificador usa IA, pero no es un agente».

**Decir a cámara:**

> Si cada vez que llega una consulta hacés lo mismo —revisar un dato, guardarlo y avisar—, tenés un proceso con pasos definidos. Eso se automatiza sin poner un agente de IA a decidir todo. Incluso si la IA lee el mensaje y dice «ventas» o «soporte», una regla puede elegir el camino. Un agente recién tiene sentido cuando debe observar lo que pasó y elegir su siguiente acción. La prueba es muy simple: señalá quién decide cada paso, ¿una regla que escribiste vos o la IA? Para un registro repetitivo, lo predecible suele ser mejor.

**Mostrar:** dos diagramas legibles, `Webhook → clasificar → Switch → ruta` frente a `objetivo → modelo → tool → observar ↺`; en el primero marcar `Switch = regla`, en el segundo `elección de tool = modelo`. Resaltar el criterio con un círculo grande, no dos pantallas minúsculas. Si se abre n8n, la captura debe corresponder al diagrama. **No usar** el guion 3 viejo del 21-sep que propone `AI Agent` para clasificación fija.

**Cierre:** «Antes de pagar por un agente, pedí ver quién decide». Destino: Sergio short/carrusel educativo; sin claim de resultado comercial.

### G03 · MCP: revisar permisos — 40–50 s

**Formato:** frontal vertical 9:16, sin verde. Captura separada de comandos/permisos saneados; yo pongo el semáforo LEER/CAMBIAR/ENVIAR en edición.

**Hook A:** «Conectar MCP no vuelve segura una herramienta».

**Hook B:** «Antes de conectar MCP, reviso estas tres capacidades».

**Decir a cámara:**

> Conectar una IA a tus herramientas no significa darle permiso para hacer de todo. Pensá en tu agenda: una cosa es que lea una cita, otra que la cambie, y otra que le escriba al cliente. Antes de conectar una herramienta, anotá esas tres acciones: leer, cambiar y enviar. Empezá por la mínima que necesitás y dejá los cambios o mensajes con confirmación humana. Yo reviso eso incluso cuando la herramienta dice «sólo lectura», porque una etiqueta no reemplaza un permiso real. Así conectás capacidades sin entregar el control de tu negocio.

**Mostrar:** comandos y salida reales, saneados, de `claude mcp list`, `claude mcp get nombre` y `/mcp` **sólo si la conexión está disponible**; después abrir la definición de tools o un contrato de prueba claramente rotulado. Los comandos por sí solos no prueban permisos ni enumeran todas las capacidades. Superponer tabla `LEER / ESCRIBIR / ENVIAR` y contrato pequeño de `get_lead_by_id`. No mostrar valores de entorno. La [guía de Claude Code](https://code.claude.com/docs/en/mcp) documenta los comandos; la [documentación MCP](https://blog.modelcontextprotocol.io/posts/2026-03-16-tool-annotations/) respalda la advertencia sobre annotations.

**Cierre:** «Revisá capacidades, no sólo el nombre del servidor». Destino: Sergio short; checklist para comunidad se publica sólo cuando esté completo y entregable.

### G04 · Una tool bien definida — 40–50 s

**Formato:** frontal vertical 9:16, sin verde. Captura separada del contrato ficticio y sus dos pruebas; yo amplio la entrada y salida en edición.

**Hook A:** «A veces el agente falla porque la tool está mal definida».

**Hook B:** «Una tool llamada `buscar` le hace adivinar demasiado al agente».

**Decir a cámara:**

> Si le das a una IA una herramienta llamada «buscar», puede adivinar mal qué tiene que buscar. Mejor decile exactamente qué hace: «consultar un cliente por su número de registro». Para usarla, pedí ese número; si falta, la herramienta debe rechazar la consulta. Y que devuelva sólo los datos necesarios, no toda la ficha del cliente. Probala una vez sin número y otra con uno ficticio. Si ambas pruebas se comportan como esperás, recién pensá en conectarla. Leer un dato y modificarlo deben ser dos permisos distintos.

**Mostrar:** editor con contrato ficticio, no un CRM real; primer test rechazado y segundo válido **sólo si un validador real produce esos resultados**. Si todavía es un contrato propuesto, rotularlo «resultado esperado». `readOnlyHint` es descripción, no garantía. No decir que un schema prueba veracidad de los datos.

**Cierre:** «Antes de cambiar de modelo, revisá la definición de la tool». Destino: Sergio short; plantilla futura para comunidad, sin CTA de palabra clave hoy.

### G05 · Construir antes de explicar — 35–45 s

**Formato:** frontal vertical 9:16, sin verde. Captura separada de n8n con los dos estados; manos/laptop sólo como corte breve, no B-roll vacío.

**Hook A:** «Guardar tutoriales no es lo mismo que construir».

**Hook B:** «Si llevás diez tutoriales guardados, construí este flujo mínimo».

**Decir a cámara:**

> Podés guardar diez tutoriales y no construir nada. Mi regla es hacer algo pequeño y probarlo antes de explicarlo. Por ejemplo: escribo una tarea y le pongo el estado «pendiente». La automatización mira ese estado y toma un camino. Después lo cambio a «listo», ejecuto otra vez y compruebo que tomó el otro camino. No es un producto entero, pero ya aprendí algo real: qué dato entra, qué regla decide y cómo sé que funcionó. Una prueba pequeña vale más que otro tutorial guardado.

**Mostrar:** Sergio cerrando ventana de tutoriales, captura de su propio workflow demo mínimo, dos casos de prueba (`pendiente` y `listo`). No llamar «error» a la rama pendiente; si no hay fallo real, no fabricarlo.

**Cierre:** «¿Qué sistema pequeño terminaste esta semana?» Destino: Sergio short y conversación en General, no post de venta.

### G06 · Opus 5.5: ¿te conviene cambiar? — 35–45 s · GRABAR AHORA

**Formato:** frontal vertical 9:16, sin verde. Grabá ambos ganchos y el cuerpo, dejando pausas para una tabla oficial legible y tarjetas numéricas grandes. No hace falta pantalla verde. Si tenés acceso a ambos modelos, grabá por separado tres casos propios con datos ficticios; si no, mostraré una plantilla vacía, nunca resultados inventados.

**Hook A:** «En una prueba de automatizaciones, Opus 5.5 completó el 40 % de las tareas; el anterior, el 26,9 %».

**Hook B:** «Opus 5.5 mejoró, pero en esa prueba 6 de cada 10 tareas no se completaron».

**Decir a cámara:**

> Salió Opus 5.5. En AutomationBench, una prueba de Zapier con tareas entre aplicaciones simuladas, completó el 40 % de las tareas; Opus 5 completó el 26,9 %. Son 13,1 puntos más: una ventaja concreta para trabajos con varios pasos. Anthropic también dice que genera la salida más de un 30 % más rápido; eso no significa que toda la tarea termine un 30 % antes. Y mirá el límite: en esa misma prueba, 6 de cada 10 tareas no se completaron. Yo no lo dejaría solo con clientes. Probá tres casos reales tuyos en ambos modelos y compará aciertos, correcciones y tiempo. Si te ayuda de verdad, usalo ahí; si no, no cambies por moda.

**Mostrar en edición, sin inventar pruebas propias:** (1) captura real de la tabla **AutomationBench** del [anuncio oficial de Anthropic](https://www.anthropic.com/claude-opus-5-5) con fecha 22-sep-2026, conservando nombres de modelos y fila completa `Business workflows AutomationBench`, marcando `40,0 %` Opus 5.5 y `26,9 %` Opus 5; rótulo «Zapier · apps simuladas · tarea completa». **No usar la tabla viva de Zapier como captura del 40,0 %:** hoy informa `42,47 %` para otra configuración con fallbacks. (2) Tarjeta editorial «+13,1 puntos» claramente derivada de esa tabla. (3) Captura del párrafo oficial donde Anthropic reporta generación de **salida** `>30 %` más rápida, con «según Anthropic; no tiempo total» visible. (4) Tarjeta «60 % no completó esa prueba» como complemento, sin extrapolar a ONIA. (5) Plantilla **vacía** `3 casos propios / aciertos / correcciones / tiempo`. Como inserto opcional, captura de la [tabla oficial de precios de API](https://platform.claude.com/docs/en/about-claude/pricing): US$4/US$20 vs US$5/US$25 por millón de entrada/salida, **20 % menos por token**, rotulada «API estándar; no cuota de suscripción; no ahorro garantizado». No presentar benchmarks como resultado de ONIA ni simular una comparativa que no se ejecutó.

**Cierre:** «Medí tus propias tareas antes de adoptarlo». Sin palabra clave. Fuentes consultadas el 27-sep-2026: [anuncio/benchmarks](https://www.anthropic.com/claude-opus-5-5), [precios API](https://platform.claude.com/docs/en/about-claude/pricing). Revalidar antes de publicar.

### G07 · Opus 5.5: cambiar el ID no basta — BANCO AVANZADO, NO GRABAR COMO SHORT GENERALISTA

**Hook A:** «Este cambio de una línea a Opus 5.5 puede devolver error 400».

**Hook B:** «Tu agente puede romperse aunque Opus 5.5 esté disponible».

**Decir a cámara:**

> Migrar a Opus 5.5 no es sólo reemplazar el nombre por `claude-opus-5-5`. Si tu integración manda `thinking: disabled` o fuerza `tool_choice: any` o una tool concreta, esas opciones devuelven error 400 en este modelo. Quitá el `thinking` desactivado; si necesitás controlar cuánto razona, usá `output_config.effort`. Cambiá la elección forzada por `auto` y validá bien las entradas de tus tools. Después corré tus casos de prueba en desarrollo y registrá éxito, errores, tokens, latencia y costo. Recién entonces decidís si conviene migrar. Un benchmark o una tarifa no reemplaza probar tu propio flujo.

**Mostrar:** captura de la [guía oficial de migración](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide); diff grande `claude-opus-5 → claude-opus-5-5`, `thinking: disabled → quitar`, `output_config.effort: medium`, `tool_choice: tool/any → auto`; hoja de 20 casos **vacía** como plantilla de evaluación, no resultados inventados. No mostrar una petición API ejecutada si no se ejecutó.

**Cierre:** «Actualizá el contrato y probá antes de mandar tráfico real». Sin CTA `OPUS` hasta tener tabla/recurso listo. Verificado contra la documentación oficial el 27-sep-2026.

### G08 · Opus 5.5: la respuesta no empieza necesariamente con texto — BANCO AVANZADO, NO GRABAR COMO SHORT GENERALISTA

**Hook A:** «Migraste a Opus 5.5 y tu app parece muda: revisá este índice».

**Hook B:** «Este `content[0].text` puede romper un agente que antes funcionaba».

**Decir a cámara:**

> Con Opus 5.5 el razonamiento está siempre activo. La respuesta puede empezar con un bloque de `thinking`, no con texto. Si tu código lee `content[0].text`, puede mostrar vacío o fallar aunque el modelo sí haya respondido. Seleccioná los bloques cuyo `type` sea `text`. Y si tu agente llama herramientas, devolvé los bloques de `thinking` completos y sin reordenar junto con el resultado; si los quitás, la API puede devolver error 400. Probalo en desarrollo con un caso que use tools, no sólo con un «hola mundo».

**Mostrar:** captura de la sección [Handle thinking in every response](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide), un ejemplo **simulado y rotulado** de arreglo `[{type: "thinking"}, {type: "text", text: "..."}]`, y diff `content[0].text` → seleccionar bloques por `type === "text"`. No mostrar respuesta fabricada como ejecución real. El código final de un loop con tools debe preservar la respuesta del asistente, incluidos los bloques de thinking, sin editarla.

**Cierre:** «Al migrar, probá también el lector de respuestas y el loop de tools». Sin CTA de recurso hasta validar un ejemplo ejecutable. Verificado contra la [guía oficial](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide) el 27-sep-2026.

## Seis guiones nuevos para todo público · G09–G14

Cada uno nombra **ventaja, prueba y límite** con lenguaje cotidiano. Un ejemplo de pantalla no se presenta como resultado propio si no fue ejecutado. Grabar sólo datos ficticios o propios saneados.

### G09 · Cuatro datos para responder una consulta — revisado 28-sep

**Formato:** cámara frontal vertical 9:16, fondo real, sin verde. Capturas separadas,
con «CASO FICTICIO» visible. Objetivo 40–55 s; cronometrar, no acelerar la voz.
Audiencia: personas que atienden consultas de su negocio. Enseña a redactar una
respuesta específica con cuatro datos y revisar sus límites.

**Hook A:** «Si la IA te escribe mensajes genéricos, probá darle estos cuatro datos».

**Hook B:** «Antes de mandar esta respuesta a un cliente, revisá que no esté inventando datos».

**Decir a cámara:**

> Si le pedís a la IA «respondé esta consulta», puede darte algo genérico. Probá con un taller de bicicletas ficticio. Dale cuatro datos: ofrece revisión de frenos, atiende a ciclistas urbanos, le preguntaron cuánto cuesta y todavía no confirmó el precio. Después pedile un mensaje corto y una pregunta para seguir la conversación. Así el borrador puede responder mejor a esa consulta. Pero mirá el límite: no debería inventar un monto ni prometer que entrega hoy. Revisá esos dos puntos y el tono antes de enviar.

**Prueba reproducible:** mismo modelo, dos conversaciones nuevas. Mantener el
mismo taller y consulta; no comparar dos negocios distintos.

Pedido básico:

```text
CASO FICTICIO. Respondé a esta consulta de un cliente de un taller de bicicletas:
«¿Cuánto cuesta revisar los frenos?».
```

Pedido con contexto:

```text
CASO FICTICIO.
Qué vendo: revisión de frenos de bicicletas.
A quién: ciclistas urbanos.
Qué preguntó la persona: «¿Cuánto cuesta revisar los frenos?».
Qué no puedo prometer: todavía no confirmé el precio ni la fecha de entrega.

Escribí una respuesta de hasta 45 palabras, en español natural con voseo.
Reconocé que el precio necesita confirmación y hacé una sola pregunta útil
para entender el problema de los frenos.
No inventes precios, descuentos, disponibilidad ni plazos.
Devolvé sólo el mensaje.
```

**Tres pantallas:** (1) pedido básico y salida real; (2) cuatro datos grandes;
(3) segunda salida real, marcando qué responde y si inventó un monto o plazo.
Si falla, mostrar la corrección; no fabricar una salida perfecta. Si ambas salidas
son adecuadas, decirlo: un ejemplo no demuestra que el prompt garantice mejoras.
Antes de ejecutar, estos textos son entradas de prueba, no resultados obtenidos.

**Cierre / única CTA:** «Probá esos cuatro datos en tu próxima consulta».

**Caption propuesto:**

```text
Una consulta necesita contexto, no una promesa inventada.

En este taller ficticio damos cuatro datos: servicio, destinatario, pregunta y
límites. El modelo propone un borrador; una persona verifica precio, plazo y tono.
La pantalla debe mostrar las salidas obtenidas, incluso si hay que corregirlas.

Probá esos cuatro datos en tu próxima consulta.

#inteligenciaartificial #negocios #atencionalcliente
```

### G10 · La IA revisa huecos de una propuesta, no decide tu precio — 35–45 s

**Formato:** frontal vertical 9:16, sin verde; captura separada de una propuesta ficticia. Yo marco los cuatro huecos con títulos grandes.

**Hook A:** «Antes de mandar una propuesta, hago esta revisión rápida».

**Hook B:** «Este hueco en una propuesta puede terminar en trabajo gratis».

**Decir a cámara:**

> Antes de enviar una propuesta, le pido a la IA que revise cuatro cosas: qué voy a entregar, qué no incluye, cuándo se entrega y qué necesito del cliente para empezar. Su ventaja es que puede señalar partes confusas antes de que se conviertan en una discusión. Pero no le dejo inventar el precio ni prometer resultados. Si marca algo que falta, yo decido cómo resolverlo y reviso el documento final. La IA me ayuda a revisar; la responsabilidad de lo que ofrezco sigue siendo mía.

**Mostrar:** propuesta **ficticia** con cuatro marcas de revisión; si se usa un modelo, enseñar el prompt y su salida reales, saneados. No mostrar un contrato real ni presentar sugerencia de IA como consejo legal. **Ventaja:** menos ambigüedad en alcance. **Límite:** precio, condiciones y compromiso los define Sergio/ONIA.

**Cierre:** «Usala para detectar huecos, no para regalar alcance».

### G11 · Convertir notas de reunión en próximos pasos — revisado 28-sep

**Formato:** frontal vertical 9:16, sin verde. Capturas separadas, «CASO FICTICIO»
visible. Objetivo 40–55 s; cronometrar. Audiencia: equipos que necesitan seguir
acuerdos. Enseña tres bloques y cómo detectar responsables o fechas inventados.

**Hook A:** «¿Terminaste una reunión y todavía no sabés quién hace qué?».

**Hook B:** «No le pidas a la IA un resumen: pedile los próximos pasos».

**Decir a cámara:**

> Si una reunión termina en un párrafo largo, todavía cuesta saber qué hacer. Probá darle a la IA seis líneas de notas ficticias y pedirle tres bloques: decisiones, tareas y preguntas abiertas. En este ejemplo, Ana prepara un borrador para el viernes; alguien tiene que revisar el presupuesto, pero nadie dijo quién ni cuándo. La IA debe separar esas dos tareas y marcar lo que falta como «por definir». Así podés ver qué sigue y qué necesita aclaración. Antes de compartirlo, compará cada tarea con las notas: ordenar información no autoriza inventar acuerdos.

**Prompt exacto:**

```text
CASO FICTICIO.
Ordená estas notas en tres bloques:
1. Decisiones tomadas.
2. Tareas: acción, responsable y fecha.
3. Preguntas abiertas.

Usá únicamente lo que dicen las notas.
Si falta responsable o fecha, escribí «por definir».
No conviertas «viernes» en una fecha de calendario.
No presentes una pregunta como una decisión.

NOTAS:
- Decidimos preparar una demo sencilla.
- Ana prepara el borrador para el viernes.
- Hay que revisar el presupuesto.
- No se asignó responsable ni fecha para esa revisión.
- Falta confirmar a qué hora mostraremos la demo.
- No se fijó la próxima reunión.
```

**Tres pantallas:** (1) seis notas ficticias; (2) salida real con decisión y dos
tareas, ampliando `revisar presupuesto / por definir / por definir`; (3) cotejo
con las notas: Ana/viernes sí consta; presupuesto, horario y próxima reunión
necesitan aclaración. Si inventa, marcar y corregir. No mostrar transcripción
ni audio de clientes. Sin ejecución, rotular «resultado esperado», no «prueba».

**Cierre / única CTA:** «Probá esas tres listas con tus próximas notas».

**Caption propuesto:**

```text
Ordenar una reunión no es inventar acuerdos.

Separá decisiones, tareas y preguntas. Si nadie asignó un responsable o una
fecha, tiene que quedar “por definir”. El ejemplo es ficticio y el resultado
siempre se compara con las notas originales.

Probá esas tres listas con tus próximas notas.

#inteligenciaartificial #equipos #productividad
```

### G12 · Tres consultas para revisar un bot — revisado 28-sep

**Formato:** frontal vertical 9:16, sin verde. Capturas separadas de tres respuestas,
«CASO FICTICIO · SIMULACIÓN» visible. Objetivo 40–55 s; cronometrar. Audiencia:
negocios que evalúan un bot. Enseña un test inicial, no una auditoría completa.

**Hook A:** «Que un bot responda rápido no significa que responda bien».

**Hook B:** «La respuesta más profesional de un bot a veces es “lo confirmo”».

**Decir a cámara:**

> Antes de activar un bot, probá tres consultas. Primera: preguntale un horario que sí está en su información. Segunda: pedile un precio que no está confirmado. Tercera: pedí hablar con una persona. La primera debería responder con el dato disponible. La segunda debería reconocer que falta información. La tercera debería dejar de insistir y explicar cómo pedir atención humana. Eso te ayuda a detectar respuestas inventadas y traspasos confusos. Pero una respuesta que dice «te paso con alguien» no demuestra que lo haya hecho. En el sistema real, comprobá que una persona reciba el caso.

**Prompt reproducible en un chat de prueba:**

```text
CASO FICTICIO. Simulación de respuestas; no hay un bot de WhatsApp conectado.
Actuá como asistente de un taller de bicicletas ficticio.

Información disponible:
- Horario: lunes a viernes, de 9:00 a 18:00.
- Servicio: revisión de frenos.
- No hay precio ni disponibilidad confirmados.
- Canal humano ficticio: atención en el mostrador durante ese horario.

Reglas:
- Respondé sólo con información disponible.
- Si falta un dato, reconocelo.
- Si piden una persona, explicá el canal humano y dejá de intentar resolver.
- No afirmes que enviaste un mensaje o transferiste el caso.
- No inventes tiempos de respuesta.

Para cada consulta devolvé:
Respuesta al cliente: máximo 35 palabras.
Decisión: responder / falta dato / atención humana.

Consultas:
1. «¿A qué hora abren el lunes?».
2. «¿Cuánto cuesta revisar los frenos?».
3. «Quiero hablar con una persona».
```

**Tres pantallas:** (1) horario: comprobar `9:00`; (2) precio: reconocer que no
está confirmado, sin monto inventado; (3) persona: indicar mostrador, sin afirmar
un traspaso inexistente. Capturar salidas reales. Rótulo final: «La simulación
prueba respuestas; el traspaso real se comprueba aparte». No afirmar que un bot
ONIA pasó estos tests ni que estos tres casos bastan para activar producción.

**Cierre / única CTA:** «Probá lo que sabe, lo que no sabe y cuándo debe dejar de responder».

**Caption propuesto:**

```text
Una respuesta rápida también puede estar equivocada.

Tres consultas iniciales: un dato disponible, un dato que falta y una petición
de atención humana. Esta simulación enseña a revisar respuestas: no conecta
WhatsApp ni demuestra un traspaso real. Ese recorrido se comprueba aparte.

Probá lo que sabe, lo que no sabe y cuándo debe dejar de responder.

#chatbots #inteligenciaartificial #atencionalcliente
```

### G13 · ¿Vale la pena automatizarlo? Medí cinco casos — 35–45 s

**Formato:** frontal vertical 9:16, sin verde; captura de una hoja de cinco filas de ejemplo. Yo lleno visualmente una fila por paso, sin inventar resultados propios.

**Hook A:** «Antes de automatizar una tarea, la mediría cinco veces».

**Hook B:** «Una automatización no ahorra tiempo sólo por existir».

**Decir a cámara:**

> Antes de pagar por una automatización, mirá cinco veces cómo se hace hoy esa tarea. Anotá cuánto tarda, qué dato entra, qué decisión se repite y en qué paso aparecen errores. Si el camino es parecido las cinco veces, ya tenés una buena candidata. La ventaja de medir primero es que sabés qué querés ahorrar y cómo comprobar si funcionó. Si cada caso se resuelve de una forma distinta, primero ordená el proceso; automatizar el desorden sólo lo hace más rápido.

**Mostrar:** hoja de cinco filas **vacía o ficticia**, columnas `tiempo / entrada / regla / error`; señalar el criterio, no inventar ahorro de ONIA. Si luego hay datos reales, anonimizarlos y validar la cuenta. **Ventaja:** priorización y medición. **Límite:** procesos ambiguos se diseñan antes de automatizar.

**Cierre:** «Primero proceso, después herramienta».

### G14 · Un bot que pasa bien a humano — 35–45 s

**Formato:** frontal vertical 9:16, sin verde; captura de conversación ficticia antes/después. Yo monto la tarjeta de traspaso con tres datos grandes.

**Hook A:** «El mejor bot también sabe cuándo dejar de responder».

**Hook B:** «¿Tu cliente tiene que repetir todo cuando el bot lo pasa a una persona?».

**Decir a cámara:**

> Un bot ayuda con lo repetitivo, pero hay tres señales para pasar a una persona: falta información, el cliente pide una excepción o está molesto. El traspaso no debería ser «esperá un momento» y empezar de cero. El bot puede entregar un resumen breve: qué pidió, qué datos ya dio y qué quedó sin resolver. La ventaja es que el equipo retoma la conversación con contexto y el cliente no tiene que repetir todo. Si nadie está disponible, decilo con honestidad; no prometas una hora que no podés cumplir.

**Mostrar:** conversación ficticia antes/después del traspaso con tarjeta `pedido / datos recibidos / pendiente`; no usar casos reales sin permiso ni afirmar que ONIA ya lo hace en producción. **Ventaja:** continuidad de atención. **Límite:** la persona confirma respuesta, precio y tiempos.

**Cierre:** «Automatizar bien también significa saber cuándo parar».

## Capturas/B-roll que se filman una vez

| Toma | Dónde se reutiliza | Requisito |
|---|---|---|
| Frontal limpio, lateral 45°, sobre hombro y manos en laptop (6–10 s cada uno) | G01–G06 y reshares Trial | Sin logos de cliente ni notificaciones. |
| `G00` flujo exacto Webhook/IF/Sheets/Telegram + dos tests | Segundo video rechazado | Coincidir con audio y probar rama falsa. |
| `G01` loop de prueba o esquema claramente rotulado | Short loop + comunidad | Estado y contador visibles; no simular ejecución. |
| `G02` comparación workflow/agente | Short + posible carrusel | Tipografía grande; un criterio por pantalla. |
| `G03` tools MCP saneadas | Short MCP | Sin tokens/rutas privadas. |
| `G04` JSON/tool contrato y dos casos de prueba | Short tool | Datos ficticios. |
| `G05` pequeño workflow propio y dos casos de prueba | Short personal | `IF` comprueba; `Edit Fields` fija el dato de prueba. No llamar «fallo» a la rama pendiente. |
| `G06` tabla histórica oficial AutomationBench, cita de velocidad de salida y plantilla vacía de tres casos propios | Short Opus para todo público | Mantener fuente/fecha/configuración visibles; no usar leaderboard actual como captura de la cifra histórica ni inventar una comparación propia. |
| `G07/G08` documentación oficial y diffs | Sólo banco avanzado, **no grabar hoy** | Si se aprueba una pieza para desarrolladores, validar ejecución/código y separar de la voz generalista. |
| Producto ONIA real: inicio → acción → resultado, con datos demo | Futuro post `@oniahq` | Sólo si el módulo está operativo y el claim se comprueba en catálogo/producto. |

## Comunidad y posts derivados, sin más rodaje

- **Comunidad:** de G01 sale una ficha con entrada, estado, límite, intervalo, salida de éxito y salida humana. Prepararla y probarla; confirmar antes cuál fue el último drop recibido. Un audio de Sergio de 15–20 s es opcional sólo si cuenta un error real o responde un caso concreto.
- **Sergio:** G01–G06 son guiones de voz para audiencia amplia; G07/G08 quedan sólo en banco técnico, no en la cola de rodaje. Trial puede reutilizar un master aprobado con otro gancho/caption; no implica otro rodaje. Los tres carruseles del 21-sep tienen versiones v2 corregidas, sin publicación verificada.
- **ONIA:** usar únicamente demo de producto real saneada y claim aprobado. Una pantalla que no funciona no se maquilla con Higgsfield.
- **YouTube:** no grabar una clase de 12 minutos a ciegas. Con G01–G04 y sus capturas ya correctas, usar el guion 9 del 22-sep como escaleta: 1) mapa workflow/agente/MCP/loop, 2) caso sin agente con prueba, 3) cuándo el modelo sí elige tools, 4) loop con límites, 5) permisos MCP, 6) cierre. Grabar pantalla de cada prueba y luego A-roll por capítulo. Si el flujo falla, explicar el fallo real.

## Gate antes de publicar

Revisión de contenido y exactitud → títulos grandes y visuales llenando el encuadre → subtítulos legibles en móvil → pantalla y voz coinciden → sin datos privados → recurso/DM verificados si hay CTA → aprobación expresa de Sergio → registrar URL, fecha y cuenta.
