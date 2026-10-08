# Para grabar · viernes 9 → miércoles 14 de octubre

> Pedido de la madre, 8-oct. Lo arma Marca personal con los textos de `GRABAR-2-14-OCT.md` (verificados el 3-oct) y
> lo nuevo del 8-oct. Molde de cada pieza: skill `edicion-referentes` (Santiago, Erik) y el plan de formatos
> `PLAN-GRABACION-3-OCT.md` (Rocha). La versión de Codex del 6-oct (rama `codex/madre-orquestacion-20261005`, sin
> mergear) recortó los pasos y los ejemplos. Esta versión conserva el texto que enseña, y de la de Codex suma solo las
> correcciones de datos: la skill verify tiene que ser propia, no de un plugin.

**Cómo se graba (vale para todas):**
1. **Una hora por día:** tres verticales de ~20 min con tomas. El martes va el YouTube (~35 min) más un vertical.
2. **Teléfono en trípode**, a la altura de los ojos, de la cintura para arriba. **Micrófono de solapa** en la remera.
   **Sin tela verde**: la prueba va arriba en la edición.
3. **Vos grabás solo la cámara.** Lo de «En pantalla» lo pone el editor: capturas oficiales, demos de terminal y
   tarjetas.
4. Una idea por toma. Si te trabás, dos segundos de pausa y repetís la frase entera.
5. Al final de cada pieza, **una toma aparte de 4 segundos** con el remate y «chau».
6. El bruto, a Drive, carpeta «Videos Onia Octubre», con el código de la pieza en el nombre (por ejemplo,
   `N07-haiku.mp4`). Antes de cortar llegan la tabla de cortes y el preview de 360p.

**Lo que enseña cada guion:** el gancho con el dato, después los pasos, después cómo sabés que funcionó y al final la
palabra para comentar. Cada palabra tiene su recurso en Avisos de la comunidad (`drops/AVISOS-POR-DIA.md`). HAIKU es
nueva y su aviso está al final de este archivo.


## Vie 9-oct

### N07 · Haiku 5.5: el modelo de Anthropic que cuesta diez veces menos

- **Molde:** Santiago: pantalla partida, la prueba arriba y la cara abajo; algo cambia cada 3-5 s; sin música; cierre con una acción.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · HAIKU.
- **En pantalla (lo pone el editor):** Tabla de precios de Anthropic (Haiku 5.5: 0,10 / 0,50 · Haiku 4.5: 1 / 5) arriba; la cuenta de los 1.000 mensajes entra como contador (3 USD → 0,30 USD); el ID `claude-haiku-5-5` como tarjeta.

Anthropic sacó un modelo diez veces más barato que el anterior. Y para un bot de WhatsApp eso cambia la cuenta.

Se llama Haiku cinco punto cinco y está disponible desde el siete de octubre. En la página de precios, lo que ves: diez centavos de dólar el millón de tokens que entran y cincuenta los que salen. Haiku cuatro punto cinco cobra un dólar y cinco. Diez veces menos.

Hagamos la cuenta con un bot. Mil mensajes, cada uno con dos mil tokens de instrucciones y conversación, y doscientos de respuesta. Con Haiku cuatro punto cinco son tres dólares. Con Haiku cinco punto cinco, treinta centavos.

Para qué sirve: Anthropic lo pone para clasificar, sacar datos y repartir mensajes. Por ejemplo, leer qué quiere tu cliente y mandarlo a ventas o a soporte. Lo difícil se lo dejás a Sonnet u Opus.

La trampa: si el pedido pasa de cien mil tokens, cobra cinco veces más. Si le mandás documentos largos, medilo antes.

Para cambiarlo, en tu código el modelo pasa a claude guion haiku guion cinco guion cinco.

La tabla y la cuenta para tu bot están en la comunidad: comentá HAIKU y te paso el link.

### DD-A · El modelo nuevo de OpenAI cuesta un quinto, y una parte sale casi gratis

- **Molde:** Santiago: pantalla partida, la prueba arriba y la cara abajo; algo cambia cada 3-5 s; sin música; cierre con una acción.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · CACHE.
- **En pantalla (lo pone el editor):** precios de OpenAI (Sol 2 / 0,10 caché / 10 USD contra Astra 10 / 1 / 50) + el campo de tokens en caché de la respuesta.

OpenAI sacó un modelo que, según su anuncio, se acerca a su mejor modelo por la quinta parte del precio. Y una parte sale casi gratis.

Se llama GPT seis punto uno Sol. Lo presentaron el veintinueve de septiembre, en su DevDay.

En la página de precios, lo que ves en pantalla: dos dólares el millón de tokens que entran y diez los que salen. El grande, Astra, cobra diez y cincuenta. Un quinto.

Lo que casi nadie aprovecha: lo que entra desde la caché cuesta diez centavos el millón. Es lo que repetís igual al principio de cada pedido: las instrucciones de tu agente, tu lista de precios. Ponelo primero y no lo toques. La primera vez cuesta un poco más; después, veinte veces menos. Tiene que tener al menos mil veinticuatro tokens.

Cómo sabés que funcionó: la respuesta de la API trae cuántos tokens salieron de caché. Si en el segundo pedido sigue en cero, cambiaste algo del principio o pasó más de media hora.

La cuenta para tu agente está en la comunidad: comentá CACHE y te paso el link.

### N04 · Una skill llamada verify y Claude Code la corre antes de cada commit

- **Molde:** Erik: cara a lo ancho; tarjetas sobre el pecho que se arman con cada paso; karaoke de 3 palabras; CTA tecleado al final.
- **Formato:** Vertical 9:16, cámara frontal + demo de pantalla.
- **A dónde lleva:** Comunidad · VERIFY.
- **En pantalla (lo pone el editor):** crear `.claude/skills/verify/SKILL.md` en vivo, cerrar y abrir Claude Code, cambiar una línea de código y pedir un commit: verify corre antes (con un cambio solo de docs no corre).

Desde el treinta de septiembre, si tu proyecto tiene una skill que se llama verify, Claude Code la corre antes de cada commit.

Lo dice el registro de cambios de Claude Code de ese día: con una skill llamada verify, a Claude se le indica correrla justo antes de commitear. Es una indicación, no un candado.

Paso uno: en tu proyecto creá la carpeta punto claude, adentro skills, adentro verify, y un archivo SKILL punto md.

Paso dos: arriba, el nombre verify y una descripción corta. Abajo, tus chequeos en orden. Los míos: que compile, con npx tsc guion guion no emit, y que pasen los tests. Si algo falla, no commitear y decir qué falló.

Paso tres: actualizá con claude update. Y cerrá Claude Code y abrilo de nuevo: la indicación se carga al arrancar la sesión. Tiene que ser tuya, en tu proyecto o en tu usuario: la que trae un plugin no cuenta.

Por qué importa: en ONIA la rama principal alimenta el deploy. Y ya nos pasó que un proceso automático subió trabajo a medias.

Cómo sabés que anduvo: cambiá algo de código, pedile un commit y fijate que antes aparezca la skill verify corriendo. Si el cambio es solo de documentación o de tests, no la corre.

La plantilla está en la comunidad de WhatsApp: comentá VERIFY y te paso el link.


## Sáb 10-oct

### N06 · Google cambió Gemini CLI gratis por Antigravity CLI: qué cambia para vos

- **Molde:** Santiago: pantalla partida, la prueba arriba y la cara abajo; algo cambia cada 3-5 s; sin música; cierre con una acción.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · ANTIGRAVITY.
- **En pantalla (lo pone el editor):** el aviso de geminicli.com y el párrafo del blog de Google Developers (19-may), el comando de antigravity.google/download, `agy` entrando con tu cuenta de Google, la pregunta de qué traer de Gemini CLI, mover `.gemini/skills/` a `.agents/skills/` y `/skills` mostrándolas. Si no tenés skills en `.gemini/skills/`, armá una de prueba antes.

Si usabas Gemini CLI gratis y un día dejó de contestarte, no es tu computadora: Google lo apagó.

Desde el dieciocho de junio, Gemini CLI dejó de responder a quien lo usaba gratis con su cuenta de Google, y a los planes Pro y Ultra. Lo reemplazó Antigravity CLI.

La buena noticia: también es gratis, con un límite que se renueva cada semana, y trae Gemini tres punto ocho Flash.

¿Y si te quedás en Gemini CLI? Sigue andando, pero con una clave de API paga.

Qué hacés hoy. Uno: instalalo con el comando que ves en pantalla y abrilo escribiendo a, ge, i griega. Entrás con tu cuenta de Google.

Dos: la primera vez, encuentra tu configuración de Gemini CLI y te pregunta qué traer.

Tres, la trampa: las skills de tu proyecto no se mudan solas. Estaban en punto gemini barra skills. Ahora van en punto agents barra skills. Movelas a mano.

Tu GEMINI punto md lo sigue leyendo igual.

Cómo sabés que quedó: escribí barra skills y tienen que aparecer.

Los comandos para Mac, Linux y Windows están en la comunidad de WhatsApp: comentá ANTIGRAVITY y te paso el link.

### D03-A · El hook que commitea solo, y la guarda que le puse después de romperlo

- **Molde:** Rocha: cabeza parlante con tres capas de texto; abre con la historia y cierra con el cómo.
- **Formato:** Vertical 9:16, cámara frontal + demo de pantalla.
- **A dónde lleva:** Comunidad · HOOK.
- **En pantalla (lo pone el editor):** el bloque Stop de `.claude/settings.json`, los dos comandos git de la guarda y la prueba de que frena.

Mi hook de Claude Code tomó diecisiete archivos con conflictos, los dio por resueltos y los subió a mi rama principal. Así se arma bien.

Paso uno. En punto claude, barra, settings punto json, copiá lo que ves en pantalla: hooks, adentro Stop, y un hook de tipo command con tu script de commit.

Paso dos. Stop corre cuando Claude termina su turno, no cuando terminó el trabajo. Por eso otro día me publicó doscientas diecisiete líneas de estilos antes que el código que las usaba.

Paso tres, el que decide todo: la guarda. Antes de commitear, tu script corre dos comandos de git, en pantalla. Uno pregunta si hay un merge a medias. El otro lista archivos en conflicto. Si cualquiera devuelve algo, no toca nada.

Para comprobarlo: barra hooks en Claude Code, y tu Stop tiene que aparecer. Después, en un repo de prueba, armá un conflicto a propósito y corré tu script: tiene que avisar y no commitear.

El JSON y la guarda están en la comunidad: comentá HOOK y te paso el link.

### D01-A · Tu primera skill de Claude Code en un minuto

- **Molde:** Erik: cara a lo ancho; tarjetas sobre el pecho que se arman con cada paso; karaoke de 3 palabras; CTA tecleado al final.
- **Formato:** Vertical 9:16, cámara frontal + demo de pantalla.
- **A dónde lleva:** Web · SKILL (sergiourcullo.vercel.app/claude-code).
- **En pantalla (lo pone el editor):** la ruta `.claude/skills/<nombre>/SKILL.md`, el frontmatter de una skill real de ONIA y `/skills` mostrando que cargó.

Una skill es un archivo que le enseña a Claude Code a hacer algo. Y lo usa solo cuando hace falta. Armemos una.

En tu proyecto creá la ruta que ves en pantalla: punto claude, barra skills, barra el nombre de tu skill. Adentro, un archivo SKILL punto md, en mayúsculas.

Arriba van dos datos. Name, el nombre. Description, cuándo usarla.

Esa descripción es lo más importante: Claude la lee para decidir si la skill aplica. Si es vaga, no la usa nunca.

Abajo, las instrucciones, como se las explicarías a alguien nuevo.

La mía se llama continuidad. La descripción dice: invocar al arrancar cualquier sesión. Obliga a leer lo que ya sabemos antes de decidir. Nació el día en que mi agente planificó seis cosas, y cuatro ya estaban hechas o decididas.

Para comprobar la tuya, escribí barra skills: tiene que aparecer. Después pedile algo que coincida con la descripción, y fijate si la usa.

El video para instalar Claude Code y armar tu primera skill está en mi web: comentá SKILL y te paso el link.


## Dom 11-oct

### S2-D08-A · ¿La IA le promete a tu cliente algo que no confirmaste?

- **Molde:** Erik: cara a lo ancho; tarjetas sobre el pecho que se arman con cada paso; karaoke de 3 palabras; CTA tecleado al final.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · PROMESA.
- **En pantalla (lo pone el editor):** las dos respuestas reales de la prueba del 28-sep (sin reglas / con dos listas), estilo chat.

¿Un bot con IA le promete a tu cliente una entrega que nunca confirmaste? Lo probé.

Armé un negocio de ejemplo: cajas de cartón con logo. Un cliente escribe: «Necesito doscientas cajas para este viernes, ¿me las pueden entregar?».

Primera prueba, sin reglas: «sé amable y tratá de cerrar la venta». Me sorprendió: no prometió. Respondió «no quiero prometerte una fecha que después no te pueda cumplir» y pidió medidas, logo y zona.

Segunda prueba. Le agregué dos listas. Confirmado: fabricamos desde cincuenta unidades. Por confirmar: stock, plazo y precio.

La diferencia: ahora usó el dato real. «Doscientas está dentro de lo que trabajamos, hacemos desde cincuenta». Y dijo exactamente qué iba a confirmar.

La lección no es que la IA inventa. Es que solo sabe lo que vos le das.

Probalo en tu bot: mandale un pedido con fecha. Si la confirma sin tenerla escrita, le faltan dos listas: lo confirmado y lo que siempre se confirma antes.

Las dos respuestas completas están en la comunidad: comentá PROMESA y te paso el link.

### D02-A · La perilla de Claude Code que casi nadie toca

- **Molde:** Santiago: pantalla partida, la prueba arriba y la cara abajo; algo cambia cada 3-5 s; sin música; cierre con una acción.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · EFFORT.
- **En pantalla (lo pone el editor):** `/effort` con los cinco niveles + la doc de Anthropic: con los 5.5 el default bajó a medium.

Si tu Claude Code ya usa los modelos cinco punto cinco, ahora arranca un nivel más abajo que antes. Y casi nadie se dio cuenta.

La perilla se llama esfuerzo: cuánto razona antes de responder. La documentación de Anthropic, lo que ves en pantalla, dice que Opus y Sonnet cinco punto cinco vienen en medium. Opus cinco y Sonnet cinco venían en high.

Para ver en cuál estás, escribí barra effort. Te abre cinco niveles: low, medium, high, xhigh y max.

Mi tabla. Low, para lo mecánico: renombrar, mover archivos. Medium, para el día a día. High o xhigh, cuando la primera respuesta no alcanzó. Max, casi nunca: la documentación dice que tiende a pensar de más.

En mi empresa hay una regla: al modelo más caro se pasa solo cuando Opus, con esfuerzo alto, no alcanzó. Primero la perilla, después el modelo.

¿Cómo sabés si te conviene? Misma tarea, en medium y en high. Si en high la corregís menos, esa tarea va en high.

Comentá EFFORT y te paso mi tabla.

### D04-C · «Verificado» con un 200, y el login mostraba texto roto

- **Molde:** Rocha: cabeza parlante con tres capas de texto; abre con la historia y cierra con el cómo.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · MIRAR.
- **En pantalla (lo pone el editor):** captura del login con los nombres de iconos como texto, al lado de la sana + el prompt literal para verificar mirando.

Mi agente me dijo varias veces que el login de mi sistema estaba verificado. Lo abrí yo, y en vez de iconos había palabras: credit card off, verified user.

¿Cómo lo había verificado? Con un código doscientos, que solo dice «la página respondió», y buscando texto en el código. Nunca la abrió.

La causa: la fuente de los iconos pesaba tres coma nueve megas y tardaba ciento diecisiete segundos. Mientras no carga, ves el nombre del icono. Y ese nombre está en el código siempre, se vea bien o no. Buscar texto no lo distingue.

Desde ese día, verificar es mirar. Cuando Claude Code te diga que algo funciona, pedile esto: «No me digas que funciona por el código de respuesta. Abrí la página con un navegador, sacá una captura, mirala, y decime qué texto ves, cuánto pesó y cuánto tardó».

Salió bien cuando en la captura ves iconos dibujados, no palabras, y la página carga en segundos, no en minutos.

El prompt completo está en la comunidad: comentá MIRAR y te paso el link.


## Lun 12-oct

### N02 · Sonnet 4.5 se apaga el 30 de noviembre: encontralo y migralo con un comando

- **Molde:** Santiago: pantalla partida, la prueba arriba y la cara abajo; algo cambia cada 3-5 s; sin música; cierre con una acción.
- **Formato:** Vertical 9:16, cámara frontal + demo de pantalla.
- **A dónde lleva:** Comunidad · MIGRAR.
- **En pantalla (lo pone el editor):** la nota del 30-sep en las release notes, la búsqueda del ID en un proyecto y `/claude-api migrate` con su pregunta de alcance.

Sonnet cuatro punto cinco se retira de la API de Claude el treinta de noviembre. Si una automatización tuya lo usa, tenés dos meses. Así lo encontrás y lo migrás.

Anthropic recomienda pasar a Sonnet cinco punto cinco.

Paso uno: buscalo. En tu código, buscá el texto claude guion sonnet guion cuatro guion cinco. En n8n, abrí cada nodo de Anthropic y mirá qué modelo tiene elegido.

Paso dos: si el código está en una carpeta, abrí Claude Code y escribí lo que ves en pantalla: barra claude api migrate, y el modelo nuevo. Te pregunta qué archivos tocar, y al final te deja una lista para revisar.

Paso tres, el crítico. Hay cinco ajustes que el cuatro punto cinco aceptaba y el cinco punto cinco rechaza con error. Los tres más comunes: una temperatura cambiada, una respuesta pre-llenada, y obligarlo a usar una herramienta. Los otros dos son del modo de pensamiento, y están en la lista.

Cómo sabés que quedó: tu prueba corre sin error y la respuesta indica el modelo nuevo.

La lista completa está en la comunidad de WhatsApp: comentá MIGRAR y te paso el link.

### D03-B · Claude Code ya lee AGENTS.md, pero no si tenés los dos

- **Molde:** Santiago: pantalla partida, la prueba arriba y la cara abajo; algo cambia cada 3-5 s; sin música; cierre con una acción.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · AGENTS.
- **En pantalla (lo pone el editor):** la tabla de la doc oficial (qué lee según qué archivos tenés) + `@AGENTS.md` en la primera línea.

Claude Code ahora lee AGENTS punto md, el archivo de instrucciones que usa Codex. Pero hay una trampa.

Solo lo lee si tu proyecto no tiene CLAUDE punto md. Si tenés los dos, por defecto lee CLAUDE y el otro lo ignora.

Es mi caso. En ONIA uso Claude Code y Codex en el mismo repositorio, y tengo los dos archivos, con reglas distintas. Cada uno lee solo el suyo: lo que le enseño a uno, el otro no lo sabe.

La solución está en la documentación de Anthropic, lo que ves en pantalla. Las reglas compartidas van en AGENTS punto md. En la primera línea de CLAUDE punto md escribís arroba AGENTS punto md: eso lo importa entero. Y abajo ponés solo lo que es de Claude.

En Windows, usá esa línea y no un enlace simbólico: al clonar se rompe.

Para comprobarlo, preguntale a Claude una regla que solo está en AGENTS. Si la sabe, lo está leyendo.

Comentá AGENTS y te paso la plantilla.

### S2-D07-A · La regla de 24 horas que rompe tu bot de WhatsApp

- **Molde:** Erik: cara a lo ancho; tarjetas sobre el pecho que se arman con cada paso; karaoke de 3 palabras; CTA tecleado al final.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · VENTANA.
- **En pantalla (lo pone el editor):** la plantilla de seguimiento aprobada de ONIA + el error 131047.

Si tu bot de WhatsApp le escribe a un cliente que no contesta hace más de veinticuatro horas, ese mensaje no sale.

Es una regla de la plataforma oficial, la que usan los bots. Cuando un cliente te escribe, se abre una ventana de veinticuatro horas. Adentro, respondés lo que quieras. Cuando se cierra, solo podés mandar plantillas: mensajes que Meta aprobó antes.

Cómo sabés que te pasó: buscá en los registros de tu bot el error ciento treinta y un mil cuarenta y siete. Es el de texto libre fuera de la ventana.

Mi bot de ONIA, pasadas las veinticuatro horas, no intenta texto libre: manda la plantilla aprobada que ves en pantalla. Un detalle: Meta rechaza una plantilla que termina en una variable. Por eso la mía cierra con una frase fija. Pasados siete días, no escribe más.

Antes de programar tu seguimiento, mandá tus plantillas a aprobar. En la app de WhatsApp Business, a mano, esta regla no existe.

En la comunidad dejé cómo armo mis seguimientos: comentá VENTANA y te paso el link.


## Mar 13-oct

### D01-C · Opus 5.5 o Sonnet 5.5: cuál usar y cómo cambiarlo en Claude Code

- **Molde:** YouTube (editor-videos): horizontal; la demo de los dos modelos y la tabla de precios como pruebas.
- **Formato:** HORIZONTAL 16:9: el celular de costado, ~35 min con tomas.
- **A dónde lleva:** Comunidad · TRAMPA (en YouTube se contesta el comentario con el link).
- **En pantalla (lo pone el editor):** la tarea con trampa corrida en los dos modelos (28-sep, mismos tres totales) + `--model` y `/model`.

Sonnet cinco punto cinco salió el veintiocho de septiembre. Cuesta la mitad que Opus cinco punto cinco y, en una de las pruebas de Anthropic, le ganó.

Así que hice lo más simple: le di exactamente la misma tarea a los dos. En este video te muestro qué pasó, qué dicen los números de verdad y la regla que uso en mi empresa para elegir cuál de los dos trabaja.

Opus cinco punto cinco salió el veintidós de septiembre. Es el potente de todos los días, el que usás cuando la tarea es difícil. Arriba hay uno más: Fable cinco punto uno, que salió el primero de septiembre. Sonnet cinco punto cinco salió seis días después. Es el intermedio: más rápido y más barato.

¿Cuánto más barato? Opus cobra cuatro dólares por millón de tokens de entrada y veinte de salida. Sonnet, dos y diez. Exactamente la mitad. Fable cinco punto uno cobra diez y cincuenta: dos veces y media lo que cobra Opus. Y abajo de todo, desde el siete de octubre, Haiku cinco punto cinco: diez centavos y cincuenta. Ese es para clasificar y repartir mensajes, no para esta tarea.

Ahora, la mitad del precio no sirve de nada si hace la mitad del trabajo. Así que miremos las pruebas que publicó Anthropic. Las ves en pantalla.

En trabajo de oficina, lo que ellos llaman GDPval, están prácticamente empatados: mil ochocientos cuarenta y cuatro contra mil ochocientos cuarenta y seis.

En uso de computadora, ochenta con uno contra ochenta y uno con ocho. Casi igual.

En Terminal-Bench, que mide tareas en la terminal, Sonnet saca setenta con seis y Opus sesenta y seis con cuatro. Ahí gana el barato.

Pero en FrontierCode, que es código difícil de verdad, Opus saca cincuenta y cuatro y Sonnet cuarenta y seis, aun con Sonnet en esfuerzo máximo. Ocho puntos de diferencia.

La lectura es esta: en casi todo están parejos, y Opus se despega cuando el problema es realmente difícil.

Si usás Claude con suscripción, el chat y Claude Code gastan del mismo límite semanal. Cada tarea que mandás al modelo caro sin necesidad es una tarea menos antes de que se te corte la semana. Y Fable, según tu plan, se cobra aparte, de los créditos de uso. Y si pagás por uso, en una automatización o en un bot, es directamente el doble de plata.

Esos son números de Anthropic. Yo quería ver una tarea mía.

Les pasé tres propuestas para una web de tres meses. Con trampa. Una anuncia setecientos bolivianos, pero tiene un dominio obligatorio que cobra ciento veinte por mes y no está sumado. Otra dice «instalación cero» y después cobra trescientos de configuración obligatoria.

Les pedí el costo real de los tres meses, la fórmula, las contradicciones y cuál cumple mis requisitos. Mismo prompt, palabra por palabra, en una sesión limpia cada uno.

Resultado: los dos dieron los mismos tres totales. Mil cincuenta, mil sesenta y mil trescientos cincuenta. Los dos encontraron los trescientos sesenta que faltaban en la primera. Los dos se dieron cuenta de que la instalación cero escondía trescientos. Y los dos eligieron la misma propuesta.

Para esta tarea, pagar el doble no me dio nada. No elijas el modelo por la fama. Elegilo por tu tarea.

Cuando abrís Claude Code desde la terminal, escribís claude, espacio, guion guion model, y el nombre. Claude guion guion model sonnet te abre la sesión con Sonnet. Claude guion guion model opus, con Opus. Y model fable, con Fable.

Sonnet, opus y fable son alias: si usás Claude Code con tu cuenta de Anthropic, siempre apuntan a la versión más nueva. Así que cuando salga la próxima, no tenés que cambiar nada.

Si ya estás adentro de una sesión, escribí barra model y elegí el otro. Lo que ves en pantalla. Para comprobar con cuál estás trabajando, preguntale directamente: «¿qué modelo sos?». Claude Code le pasa ese dato en cada sesión, así que te responde el nombre exacto.

Y hay una segunda perilla, el esfuerzo: cuánto piensa el modelo antes de responder. Antes de pasar a un modelo más caro, probá subir el esfuerzo un nivel. Eso lo explico entero en otro video.

Hasta el cuatro de septiembre, trece de mis quince agentes automáticos corrían en Opus. Y tres de ellos, solos, se llevaban el cincuenta y ocho por ciento de mi cuota. Ese día los repartí con una pregunta: este agente, ¿escribe o mide?

Sonnet mide, revisa y redacta: contar cosas, leer pantallas, armar contenido, publicar, revisar lo que hizo otro. Es rápido y cuesta la mitad.

Opus escribe código y decide: los agentes que tocan el producto o suben cambios a la rama principal, una migración de base de datos, una decisión de arquitectura, un error que no entiendo después de dos intentos. Ahí equivocarse sale más caro que el modelo.

Y Fable cinco punto uno, que cuesta cinco veces lo que Sonnet, entra solo cuando Opus, con el esfuerzo alto, no alcanzó.

El error más común es elegir una vez y no volver a mirar. En un mes salieron Fable cinco punto uno, Opus y Sonnet cinco punto cinco, y lo que era cierto con los anteriores dejó de serlo: hoy el barato le gana al caro en tareas de terminal.

El segundo error es comparar mal. Si corrés Opus sobre el trabajo que ya dejó hecho Sonnet, Opus arranca con ventaja. Cada prueba, desde el mismo punto de partida, con el mismo prompt y el mismo esfuerzo. Cuando no sé cuál va, hago lo que hice acá: la misma tarea a los dos, y comparo cuánto tuve que corregir de cada uno. Eso vale más que cualquier tabla.

Hacé la prueba vos. El ejercicio de las tres propuestas, con el prompt completo, está en la comunidad de WhatsApp. Comentá TRAMPA y te paso el link.

Pegalo en los dos modelos. Si te salió bien, vas a ver los mismos tres totales: mil cincuenta, mil sesenta y mil trescientos cincuenta. Si alguno te da setecientos, ese modelo se comió la trampa.

### D02-B · Desde el 1 de octubre, las respuestas de tu bot de WhatsApp se cobran (no todas)

- **Molde:** Santiago: pantalla partida, la prueba arriba y la cara abajo; algo cambia cada 3-5 s; sin música; cierre con una acción.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · TARIFA.
- **En pantalla (lo pone el editor):** página de precios de Meta (tabla en dólares) + la cuenta en tres pasos con los mensajes de tu bot.

Desde el uno de octubre, las respuestas de tu bot de WhatsApp se cobran. Pero no todas.

Es para bots en la plataforma oficial de Meta, la API. La app de WhatsApp Business que usás a mano no cambia.

Lo que cambia: los mensajes de servicio, los que tu bot contesta dentro de las veinticuatro horas desde que el cliente escribió, eran gratis. Ahora se cobran por mensaje, a la misma tarifa que los de utilidad. Los primeros mil de cada mes, por número, siguen gratis.

Hacé la cuenta así.

Uno. Contá cuántos mensajes de texto libre mandó tu bot el mes pasado, dentro de las veinticuatro horas. Tres mensajes seguidos son tres.

Dos. Restale mil. Las plantillas no entran en esos mil: se cobran desde la primera.

Tres. En la página de precios de Meta, lo que ves en pantalla, bajá la tabla en dólares y buscá la tarifa de utilidad del país de tu cliente. Bolivia está en «resto de Latinoamérica». Multiplicá.

Si te dio cero, estás dentro de lo gratis. Si no, tu bot habla de más: juntá mensajes.

La planilla está en la comunidad: comentá TARIFA y te paso el link.


## Mié 14-oct

### D04-B · Cada skill que instalás te cobra contexto: medilo con /skill-doctor

- **Molde:** Erik: cara a lo ancho; tarjetas sobre el pecho que se arman con cada paso; karaoke de 3 palabras; CTA tecleado al final.
- **Formato:** Vertical 9:16, cámara frontal + demo de pantalla.
- **A dónde lleva:** Comunidad · DOCTOR.
- **En pantalla (lo pone el editor):** `/skill-doctor` y `/skills` reales (Espacio cambia el estado) + `/doctor` antes y después.

Cada skill instalada en Claude Code te cobra contexto en cada mensaje, la uses o no. Yo tenía doscientas quince. Medí cuáles usé en el último mes y bajé a ciento diez.

Hay un comando que hace esa medición por vos: barra skill guion doctor. Te muestra cuánto cuesta cada skill y cuántas veces se usó.

¿Por qué importa? La lista de skills tiene un tope: el uno por ciento del contexto del modelo. Cuando se pasa, Claude Code borra las descripciones de las que menos usás. Y sin descripción, Claude no sabe cuándo usarlas.

Hacé esto. Corré barra skill guion doctor y buscá las que cuestan y nunca se usaron.

Después escribí barra skills, marcá una y apretá espacio para cambiar su estado. Off la esconde. Name only deja solo el nombre. Escape guarda. Las de plugins se manejan aparte, desde barra plugin.

Para comprobar, corré barra doctor antes y después: te estima cuánto pesa la lista.

El bloque para pegar en tu configuración está en la comunidad: comentá DOCTOR y te paso el link.

### D05-A · Dos sesiones de Claude Code en el mismo proyecto, sin pisarse

- **Molde:** Erik: cara a lo ancho; tarjetas sobre el pecho que se arman con cada paso; karaoke de 3 palabras; CTA tecleado al final.
- **Formato:** Vertical 9:16, cámara frontal + demo de pantalla.
- **A dónde lleva:** Comunidad · WORKTREE.
- **En pantalla (lo pone el editor):** `git worktree add -b`, `claude -w`, `git -C` y `git worktree list` en un repo de prueba.

Dos sesiones de Claude Code en la misma carpeta tocan los mismos archivos. Y a mí un comando que iba para una carpeta cayó en otra, y movió una rama cuatrocientos veinticuatro commits.

La solución se llama worktree: otra carpeta del mismo repositorio, con su propia rama.

Uno. Desde tu proyecto: git worktree add, guion b, el nombre de la rama y la carpeta nueva. Lo que ves en pantalla.

Dos. Abrí Claude Code en esa carpeta. O más corto: claude guion w y un nombre, que la crea por vos.

Tres, el paso crítico. Todo comando de git, con git guion C y la ruta de la carpeta. No confíes en que la terminal sigue donde la dejaste.

A mi agente la terminal le volvió sola a la carpeta principal. Se recuperó con el historial de git, pero nada avisó.

Para comprobar: git worktree list. Cada carpeta, con su rama. Una sesión, una carpeta, una rama.

Los comandos están en la comunidad: comentá WORKTREE y te paso el link.

### D06-A · Antes de cerrar la sesión: el handoff de siete campos

- **Molde:** Erik: cara a lo ancho; tarjetas sobre el pecho que se arman con cada paso; karaoke de 3 palabras; CTA tecleado al final.
- **Formato:** Vertical 9:16, cámara frontal.
- **A dónde lleva:** Comunidad · HANDOFF.
- **En pantalla (lo pone el editor):** la plantilla de siete campos + la prueba de pasársela a una sesión nueva.

Cuando cerrás una sesión, lo que aprendió se va con ella. La próxima arranca de cero.

Probé confiar en el resumen automático. El veintidós de agosto una sesión se compactó, y el resumen era fiel pero larguísimo: cada error y cada idea descartada, con el mismo peso que el estado actual. Un resumen no elige.

Ahora, al cerrar, Claude escribe un archivo con siete campos. Uno, el objetivo y si se cumplió. Dos, qué quedó funcionando. Tres, qué quedó a medias: rama y commit. Cuatro, los archivos que importan. Cinco, los intentos fallidos y por qué. Seis, qué depende de vos. Siete, los próximos pasos.

El cinco es el que nadie escribe y el que más vale: evita repetir callejones.

Lo que no se commiteó se nombra con su riesgo: el cuatro de septiembre una sesión llegó al cierre con un trabajo entero sin commit.

Para comprobar, pasale solo ese archivo a una sesión nueva. Si sigue sin preguntarte nada, está bien escrito.

La plantilla está en la comunidad: comentá HANDOFF y te paso el link.


## Aviso nuevo para la comunidad: HAIKU (pegarlo antes de publicar N07)

```
*HAIKU* · *Haiku 5.5: la tabla y la cuenta para tu bot*

Precios de Anthropic por millón de tokens (página oficial, leída el 8-oct):
• Haiku 5.5: entra 0,10 USD · sale 0,50 USD (pedidos de hasta 100.000 tokens)
• Haiku 5.5, pedidos de más de 100.000 tokens: 0,50 · 2,50
• Haiku 4.5: 1 · 5
• Sonnet 5.5: 2 · 10

La cuenta para un bot (1.000 mensajes, 2.000 tokens de entrada y 200 de salida cada uno):
• Haiku 4.5: 2 × 1 + 0,2 × 5 = 3 USD
• Haiku 5.5: 2 × 0,10 + 0,2 × 0,50 = 0,30 USD

Para qué sí: clasificar, sacar datos, repartir mensajes (ventas, soporte, turnos).
Para qué no: lo que necesita razonar mucho. Ahí va Sonnet u Opus.

Cómo cambiarlo: en tu código, model: "claude-haiku-5-5".
Contame en General: ¿qué hace tu bot y cuántos mensajes por mes recibe? Te digo si te conviene.
```

**Fuentes (leídas el 8-oct):**
- `platform.claude.com/docs/en/about-claude/pricing`: tabla de precios. Haiku 5.5 en dos tramos, con el corte en
  100.000 tokens. Haiku 4.5 a 1 / 5.
- `platform.claude.com/docs/en/about-claude/models/overview`: Haiku 5.5 «para clasificación, extracción y ruteo» y
  1M de contexto.
- Changelog de Claude Code 2.1.293 (7-oct): «Added Claude Haiku 5.5… now the default Haiku model on the Anthropic API».

## Lo que NO entra esta semana, y por qué

- **Repos (R01-R07, G04, G10):** van con el molde Pablo, y GitHub no abre desde la sesión de la nube. Además falta que
  Sergio Urcullo decida si se acortan a ~21 s. R05 espera además su decisión sobre MARKETING.
- **D04-A (DELEGAR):** manda a la web `/claude-code`, que todavía dice «3 subagentes». Primero se corrige la web.
- **S2-D08-C, S2-D09-A, S2-D12-B, S2-D13-C, D05-B, D05-C, S1-D07-B** y los YouTube D03-C, G11 y S2-D07-C: la semana
  siguiente.
