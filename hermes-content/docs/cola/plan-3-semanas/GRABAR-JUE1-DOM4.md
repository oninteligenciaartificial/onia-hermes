# Para grabar · jueves 1 → domingo 4 de octubre

Solo lo que se dice a cámara. Orden de cada día = orden de grabación. ~15-20 min por video con tomas repetidas → 3 videos ≈ 1 hora.
Fuente de cada guion: `plan-3-semanas/S1-GUIONES.md` (con su evidencia) y `GUIONES-PARA-GRABAR-2026-09-29.md`. **Sin aprobar todavía por Sergio Urcullo: si una frase no te suena tuya, cambiala al grabar.**

## Jue 1-oct

### D02-B · Vertical · Desde hoy, tu bot de WhatsApp paga por cada respuesta

Desde hoy, uno de octubre, cada respuesta de tu bot de WhatsApp tiene precio.

Lo dice la documentación de Meta, lo que ves en pantalla. Cobra por mensaje los de servicio,
gratis desde noviembre de dos mil veinticuatro, y los de utilidad dentro de la ventana de
veinticuatro horas.

Es para bots en la plataforma oficial. La app de WhatsApp Business que usás a mano no cambia.

Yo tengo un bot de ventas. La cuenta es esta:

Uno. Contá cuántos mensajes mandó tu bot el mes pasado. Tres mensajes seguidos son tres.

Dos. En la página de precios de Meta, bajá la tabla en dólares. Se cobra según el país del
cliente: Bolivia está en «resto de Latinoamérica».

Tres. Multiplicá mensajes por tarifa. Si todavía no figura la de servicio, no la inventes:
anotá la fecha y volvé a mirar.

Si ese número se come lo que te deja un cliente, tu bot habla de más: juntá mensajes.

La planilla está en la comunidad.

### D02-C · Vertical · Cómo encontrar el costo escondido de un presupuesto

Este presupuesto dice setecientos bolivianos. En realidad son mil sesenta.
Mirá cómo lo encontró la IA.

Le pasé tres propuestas para una web de tres meses. Una tenía un dominio
obligatorio de ciento veinte por mes que no estaba en el total. Otra decía
«instalación cero», pero cobraba trescientos de configuración.

Y le escribí esto: «Compará el costo total de los tres meses, incluyendo cargos
iniciales y extras obligatorios. Mostrá la fórmula. Citá el dato que usaste.
Detectá contradicciones. Decime cuál cumple todos mis requisitos. No inventes
condiciones».

Me devolvió una tabla: cien de instalación, más doscientos por tres, más ciento
veinte por tres. Mil sesenta. Y marcó los trescientos sesenta que el anuncio
se había comido.

También encontró la segunda trampa: la instalación cero escondía trescientos.

La clave está en dos frases del prompt: «citá el dato que usaste» y «no inventes
condiciones». Con eso podés revisar cada número contra el papel.

La próxima cotización que te llegue, pegala con este prompt. Lo tenés completo
en la comunidad.

### D01-B · Vertical · Salió Sonnet 5.5: la prueba de tres tareas para saber si te sirve

Sonnet cinco punto cinco salió el veintiocho de septiembre y cuesta la mitad que Opus: dos
dólares por millón de tokens de entrada, contra cuatro.

Anthropic dice que en trabajo de oficina queda a dos puntos de Opus. Hacé tu prueba hoy.

Elegí tres tareas reales de tu semana: una mecánica, una de todos los días y una difícil.

Corré cada una con claude guion guion model sonnet. Después, desde el mismo punto de partida,
con claude guion guion model opus. Mismo prompt, palabra por palabra, y mismo esfuerzo.

Por cada tarea anotá: cuántas veces lo corregiste, cuántos minutos tardó en quedar bien, y si
lo usarías sin tocar.

Si Sonnet empata en dos de tres, usalo por defecto.

¿Por qué importa? El chat y Claude Code comparten límite. A mí se me acabó la semana el
diez de septiembre, con mis agentes en el modelo caro para casi todo.

Tres tareas no son un benchmark: son tu caso. La planilla para anotarlo está en la comunidad.

## Vie 2-oct

### D02-A · Vertical · La perilla de Claude Code que casi nadie toca

Claude Code tiene una perilla que casi nadie toca, y cambia cuánto piensa antes
de responderte.

Se llama esfuerzo. Cuando abrís Claude Code, escribís claude guion guion effort
y elegís un nivel: low, medium, high, xhigh o max.

Si no ponés nada, en Claude Code viene en medium.

Más esfuerzo significa que razona más antes de actuar. Pero también tarda más y
gasta más tokens. Por eso no conviene dejarlo en max para todo.

Mi regla es simple.

Low, para cosas mecánicas: renombrar, mover archivos, cambiar un texto.

Medium, para el trabajo de todos los días.

High o xhigh, cuando la primera respuesta no alcanzó: un error que no se
entiende o una decisión con varias piezas.

Y max, casi nunca.

La próxima vez que Claude Code te dé una respuesta floja, antes de cambiar de
modelo, subí el esfuerzo un nivel. Comentá EFFORT y te paso mi tabla.

### D03-B · Vertical · Claude Code ya lee AGENTS.md, pero no si tenés los dos

Claude Code ahora lee AGENTS punto md, el archivo de instrucciones que usa Codex. Pero hay una
trampa.

Solo lo lee si tu proyecto no tiene CLAUDE punto md. Si tenés los dos, lee CLAUDE y el otro lo
ignora.

Es mi caso. En ONIA uso Claude Code y Codex en el mismo repositorio, y tengo los dos archivos,
con reglas distintas. Cada uno lee solo el suyo: lo que le enseño a uno, el otro no lo sabe.

La solución está en la documentación de Anthropic, lo que ves en pantalla. Las reglas
compartidas van en AGENTS punto md. En la primera línea de CLAUDE punto md escribís arroba
AGENTS punto md: eso lo importa entero. Y abajo ponés solo lo que es de Claude.

En Windows, usá esa línea y no un enlace simbólico: al clonar se rompe.

Para comprobarlo, preguntale a Claude una regla que solo está en AGENTS. Si la sabe, la está
leyendo.

Comentá AGENTS y te paso la plantilla.

### D01-A · Vertical · Tu primera skill de Claude Code en un minuto

Una skill es un archivo que le enseña a Claude Code cómo hacer algo, y lo usa
solo cuando hace falta. Armemos una.

En tu proyecto creás esta ruta: punto claude, barra, skills, barra, el nombre de
tu skill, y adentro un archivo que se llama SKILL punto md, en mayúsculas.

Arriba del archivo van dos datos. Name: el nombre. Description: cuándo tiene que
usarla.

Esa descripción es lo más importante. Claude la lee para decidir si la skill
aplica a lo que le pediste. Si la escribís vaga, no la va a usar nunca.

Abajo escribís las instrucciones, como se las explicarías a alguien nuevo.

En ONIA tengo una que se llama router. Su descripción dice: «invocar al inicio de
cualquier trabajo». Y adentro dice qué documentos leer y qué herramientas usar
según la tarea. Así cada sesión arranca por el mismo lugar.

Empezá con una tarea que le explicás a Claude una y otra vez. Esa es tu primera
skill.

La guía completa, con el paso a paso, está en mi web.

## Sáb 3-oct

### D03-A · Vertical · El hook que commitea solo, y la guarda que le puse después de romperlo

Mi hook de Claude Code marcó diecisiete archivos con conflictos como resueltos y los subió a mi
rama principal. Así se arma bien.

Necesitás un proyecto con git y un script que guarde y suba los cambios.

Paso uno. En punto claude, barra, settings punto json, copiá la estructura que ves en pantalla:
hooks, adentro Stop, una lista, y un hook de tipo command con tu comando.

Paso dos. Stop corre cuando Claude termina su turno, no cuando terminó el trabajo. Por eso otro
día me publicó doscientas diecisiete líneas de estilos antes de que existiera la página.

Paso tres, el que decide todo: la guarda. Antes de commitear, tu script corre dos comandos de
git, los ves en pantalla. Uno pregunta si hay un merge a medias. El otro lista archivos en
conflicto. Si cualquiera devuelve algo, no toca nada.

Para comprobarlo, escribí barra hooks en Claude Code: tu Stop tiene que aparecer ahí.

¿Tu automatización sabe cuándo no actuar? El JSON y la guarda están en la comunidad.

### D04-B · Vertical · Cada skill que instalás te cobra contexto: medilo con /skill-doctor

Cada skill instalada en Claude Code te cobra contexto en cada mensaje, la uses o no. Yo tengo
doscientas quince.

Desde principios de septiembre hay un comando para medirlo: barra skill guion doctor. Te muestra
cuánto cuesta cada skill y cuántas veces se usó.

¿Por qué importa? La lista de skills tiene un tope: el uno por ciento del contexto del modelo.
Cuando se pasa, Claude Code borra las descripciones de las que menos usás. Y sin descripción,
Claude no sabe cuándo usarlas.

Hacé esto. Corré barra skill guion doctor y buscá las que cuestan y nunca se usaron.

Después escribí barra skills, marcá una y apretá espacio para cambiar su estado. Off la
esconde. Name only deja solo el nombre. Escape guarda. Las de plugins se manejan aparte, desde
barra plugin.

Para comprobar, corré barra doctor antes y después: te estima cuánto pesa la lista de skills y
cuáles pesan más.

El bloque para pegar en tu configuración está en la comunidad.

### D04-C · Vertical · «Verificado» con un 200, y el login mostraba texto roto

Mi agente me dijo varias veces que el login de mi sistema estaba verificado. Lo abrí yo, y en vez
de iconos había palabras: credit card off, verified user.

¿Cómo lo había verificado? Con un código doscientos, que solo significa «la página respondió», y
buscando texto en el código. Nunca la abrió.

La causa estaba en la fuente de los iconos: pesaba tres coma nueve megas y tardaba ciento
diecisiete segundos en cargar.

Un doscientos dice que el servidor contestó. No dice qué ve tu cliente.

Desde ese día, en mi empresa verificar es mirar. Cuando Claude Code te diga que algo funciona,
pedile esto: «No me digas que funciona por el código de respuesta. Abrí la página con un
navegador, sacá una captura, mirala, y decime qué texto ves, cuánto pesó y cuánto tardó».

Salió bien cuando la captura muestra lo mismo que vería tu cliente.

El prompt completo está en la comunidad.

## Dom 4-oct

### D05-A · Vertical · Dos sesiones de Claude Code en el mismo proyecto, sin pisarse

Dos sesiones de Claude Code en la misma carpeta tocan los mismos archivos. Y a mí un comando que
iba para una carpeta cayó en otra, y movió una rama cuatrocientos veinticuatro commits.

La solución se llama worktree: otra carpeta del mismo repositorio, con su propia rama.

Uno. Desde tu proyecto: git worktree add, guion b, el nombre de la rama y la carpeta nueva. Lo
que ves en pantalla.

Dos. Abrí Claude Code en esa carpeta. O más corto: claude guion w y un nombre, que la crea por
vos.

Tres, el paso crítico. Todo comando de git, con git guion C y la ruta de la carpeta. No confíes
en que la terminal sigue donde la dejaste.

A mi agente la terminal le volvió sola a la carpeta principal. Se recuperó con el historial de
git, pero nada avisó.

Para comprobar: git worktree list. Cada carpeta, con su rama. Una sesión, una carpeta, una rama.

Lo tenés completo en la comunidad: el link está en mi web.

### D05-B · Vertical · Presentaciones con Claude en el plan gratis, sin que te invente datos

Desde el dieciséis de septiembre, Claude hace presentaciones, documentos y diseños dentro de
cualquier conversación. Y está en todos los planes, también en el gratis.

Lo dice la nota de versión de Anthropic, lo que ves en pantalla. Se pide en el chat.

Te lo muestro en una cuenta gratis. Pego el texto de mi guía de Claude Code y le escribo esto:

«Armá una presentación de seis láminas con este texto. Una idea por lámina. Usá solo lo que
está acá. Si falta un dato, dejá un espacio marcado FALTA en vez de inventarlo».

Esa última frase es la importante. Sin ella, la IA rellena con cifras que suenan bien y no son
tuyas.

Para saber si lo estás usando bien, pedile un cambio a una lámina: tiene que editarse ahí
mismo. Después buscá cada FALTA y completalo vos.

Ojo: esto es Claude, el chat. Si no sabés si te alcanza el chat o necesitás Claude Code, en mi
web está el video que los compara.

### D05-C · Vertical · Mi agente me dijo que quedaban 2. Había 44 activos

Le pedí a mi agente que revisara cuántas automatizaciones seguían vivas en mi
servidor. Me dijo: de ciento treinta y seis, quedan dos.

Estuve a un paso de borrar el resto.

Antes, las conté de nuevo, en vivo. Había cuarenta y cuatro activas. Si las
borraba, apagaba mi producción.

¿Qué pasó? El agente repitió una conclusión vieja, de otra revisión. Sonaba
segura. No estaba contada ese día.

Desde ahí tengo una regla: un dato viejo no se ejecuta sin contarlo de nuevo.

En la práctica, antes de borrar o apagar algo que te propone la IA, pedile el
comando con el que lo contó y correlo vos. En n8n, filtrá los workflows por
activos y mirá el número con tus ojos.

La IA te ahorra horas. Pero la decisión que no se puede deshacer la verificás
vos, con el dato de hoy.

Contame en la comunidad si te pasó algo parecido.
