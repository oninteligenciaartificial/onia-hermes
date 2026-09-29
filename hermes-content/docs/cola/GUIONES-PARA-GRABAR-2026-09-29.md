# Guiones para grabar — 29 de septiembre de 2026

Solo lo que se dice a cámara. Pantallas, fuentes y material de la comunidad:
[`PRODUCCION-GUIONES-2026-09-29.md`](PRODUCCION-GUIONES-2026-09-29.md).

Orden de grabación sugerido: primero el YouTube (horizontal), después los nueve
verticales de corrido. Frases cortas: si te trabás, repetí solo esa frase.

---

## YouTube — Opus 5.5 o Sonnet 5.5: cuál usar y cómo cambiarlo en Claude Code

Acaba de salir Sonnet 5.5. Cuesta la mitad que Opus 5.5 y, en una de las
pruebas de Anthropic, le ganó.

Así que hice lo más simple: le di exactamente la misma tarea a los dos. En este
video te muestro qué pasó, qué dicen los números de verdad y la regla que uso
en mi empresa para elegir cuál de los dos trabaja.

Empecemos por lo que salió.

Opus 5.5 salió el 22 de septiembre. Es el modelo potente: el que usás cuando la
tarea es difícil. Sonnet 5.5 salió el 28. Es el modelo intermedio, más rápido y
más barato.

¿Cuánto más barato? Opus cobra cuatro dólares por millón de tokens de entrada y
veinte de salida. Sonnet, dos y diez. Exactamente la mitad.

Ahora, la mitad del precio no sirve de nada si hace la mitad del trabajo. Así
que miremos las pruebas que publicó Anthropic.

En trabajo de oficina, lo que ellos llaman GDPval, están prácticamente empatados:
mil ochocientos cuarenta y cuatro contra mil ochocientos cuarenta y seis.

En uso de computadora, ochenta con uno contra ochenta y uno con ocho. Casi igual.

En Terminal-Bench, que mide tareas en la terminal, Sonnet saca setenta con seis
y Opus sesenta y seis con cuatro. Ahí gana el barato.

Pero en FrontierCode, que es código difícil de verdad, Opus saca cincuenta y
cuatro y Sonnet cuarenta y seis, aun con Sonnet en esfuerzo máximo. Ocho puntos
de diferencia.

Entonces la lectura es esta: en casi todo están parejos, y Opus se despega
cuando el problema es realmente difícil.

Esos son números de Anthropic. Yo quería ver una tarea mía.

Les pasé tres propuestas para una web de tres meses. Con trampa: una anuncia
setecientos bolivianos, pero tiene un dominio obligatorio que cobra ciento
veinte por mes y no está sumado. Otra dice «instalación cero» y después cobra
trescientos de configuración obligatoria.

Les pedí el costo real de los tres meses, la fórmula, las contradicciones y
cuál cumple mis requisitos.

Resultado: los dos dieron los mismos tres totales. Mil cincuenta, mil sesenta y
mil trescientos cincuenta. Los dos encontraron los trescientos sesenta que
faltaban en la primera. Los dos se dieron cuenta de que la instalación cero
escondía trescientos. Y los dos eligieron la misma propuesta.

Para esta tarea, pagar el doble no me dio nada. Y eso es justamente lo que
quiero que te lleves: no elijas el modelo por la fama. Elegilo por tu tarea.

Ahora, cómo lo cambiás en Claude Code.

Cuando abrís Claude Code desde la terminal, escribís claude, espacio, guion guion
model, y el nombre. Claude guion guion model sonnet te abre la sesión con Sonnet.
Claude guion guion model opus, con Opus. Sonnet y opus son alias: siempre apuntan
a la versión más nueva.

Y hay una segunda perilla que casi nadie toca: el esfuerzo. Es cuánto piensa el
modelo antes de responder. Claude guion guion effort, y elegís entre low,
medium, high, xhigh y max. En Claude Code viene en medium.

Más esfuerzo es más tiempo y más tokens. Así que no lo subas por las dudas.
Subilo cuando la primera respuesta no alcanzó.

Esta es la regla que uso en ONIA.

Sonnet hace el trabajo de todos los días: editar archivos, escribir scripts,
armar contenido, correr pruebas. Es rápido y cuesta la mitad.

Opus entra cuando equivocarse sale caro: una migración de base de datos, una
decisión de arquitectura, un error que no entiendo después de dos intentos.

Y cuando no sé cuál va, hago lo que hice acá: la misma tarea a los dos, y
comparo cuánto tuve que corregir de cada uno. Eso vale más que cualquier tabla.

Si querés hacer esta prueba vos: el ejercicio de las tres propuestas, con el
prompt completo, lo dejé en la comunidad de WhatsApp. Pegalo en los dos modelos
y fijate si te dan lo mismo.

Y si todavía no usás Claude Code, en mi web tenés la guía para instalarlo y
armar tu primera skill. Nos vemos en el próximo.

---

## Vertical 1 — Salió Sonnet 5.5 y cuesta la mitad que Opus

Salió Sonnet 5.5 y cuesta exactamente la mitad que Opus 5.5.

Dos dólares por millón de tokens de entrada, contra cuatro. Diez de salida,
contra veinte.

¿Y rinde? Según las pruebas de Anthropic, en trabajo de oficina están empatados.
En tareas de terminal, Sonnet le gana a Opus. Opus solo se despega en código
realmente difícil: ahí saca ocho puntos más.

Yo le di la misma tarea a los dos: comparar tres presupuestos con costos
escondidos. Los dos encontraron exactamente lo mismo.

Así que si usás Claude Code, probá esto: abrí la terminal y escribí claude
guion guion model sonnet. Hacé tu tarea de siempre. Si el resultado te sirve,
acabás de pagar la mitad.

Dejá Opus para cuando equivocarte sale caro.

Comentá SONNET y te paso el prompt que usé para compararlos.

---

## Vertical 2 — Cómo encontrar el costo escondido de un presupuesto

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

---

## Vertical 3 — ¿La IA le promete a tu cliente algo que no confirmaste?

Quería ver si un bot con IA le prometía a un cliente una entrega que yo nunca
confirmé. Así que lo probé.

Armé un negocio de ejemplo: cajas de cartón con logo. Un cliente escribe:
«Necesito doscientas cajas para este viernes, ¿me las pueden entregar?».

Primera prueba, sin reglas. Solo le dije: «sé amable y tratá de cerrar la
venta». Y me sorprendió: no prometió. Respondió «no quiero prometerte una fecha
que después no te pueda cumplir» y pidió medidas, logo y zona.

Segunda prueba. Le agregué dos listas. Confirmado: fabricamos desde cincuenta
unidades. Por confirmar: stock, plazo y precio.

La diferencia: ahora usó el dato real. «Doscientas está dentro de lo que
trabajamos, hacemos desde cincuenta». Y dijo exactamente qué iba a confirmar.

La lección no es que la IA inventa. Es que solo sabe lo que vos le das.

Si tenés un bot, escribile esas dos listas: lo confirmado y lo que siempre se
confirma antes. Las dos respuestas completas están en la comunidad.

---

## Vertical 4 — La perilla de Claude Code que casi nadie toca

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

---

## Vertical 5 — Claude Code hace commit solo cuando termina

En mi empresa, cada vez que Claude Code termina de responder, el trabajo se
guarda solo en git. Te muestro cómo, y el error que me costó aprenderlo.

Es un hook. Un hook es un comando que Claude Code ejecuta automáticamente en un
momento específico.

En la carpeta de tu proyecto abrís punto claude, barra, settings punto json. Ahí
agregás un hook de tipo Stop, que corre cuando Claude termina su turno, y le
ponés el comando que guarda y sube los cambios.

Ahora, el error. Stop corre cuando Claude termina de responder. No cuando
terminó el trabajo.

A mí me pasó dos veces. Una, subió estilos de una página antes de que existiera
la página. Otra, subió un merge que todavía tenía conflictos adentro.

Así que mi script ahora revisa antes de guardar: si hay un merge a medias o
archivos en conflicto, no sube nada.

Si vas a automatizar commits, poné esa revisión primero. La guía de hooks está
en mi web, en la sección de Claude Code.

---

## Vertical 6 — Tu primera skill de Claude Code en un minuto

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

---

## Vertical 7 — Así edito mis videos sin editor

No tengo editor de video. Mis videos los edita una cadena de pasos con IA.
Te muestro cuáles, y la regla que puse después de ver un error ajeno.

Primero grabo de corrido, como ahora.

Después una IA transcribe el audio, palabra por palabra, con el segundo exacto
en que digo cada una.

Con eso, un script arma la lista de cortes: silencios largos, «eh», frases que
repetí. Y acá está la primera regla: esa lista la reviso yo antes de cortar.
Nunca se corta a ciegas.

Después vienen los subtítulos. Cada palabra aparece justo cuando la digo,
porque la transcripción tiene los tiempos.

Y la segunda regla nació de un error. Estudiando reels de otros creadores, vi
uno publicado con «a generado» sin hache y «araña» sin la eñe, quemados en el
video. La IA transcribe, pero no corrige.

Desde ese día, la transcripción se lee línea por línea antes de quemarla en el
video.

La IA hace el trabajo pesado. Las dos decisiones que dañan tu marca las revisás
vos. Comentá EDITOR si querés ver la lista de pasos.

---

## Vertical 8 — La regla de 24 horas que rompe tu bot de WhatsApp

Si tu bot de WhatsApp le escribe a un cliente que no contesta hace más de
veinticuatro horas, ese mensaje no sale. Y muchos no saben por qué.

Es una regla de WhatsApp para empresas que usan la plataforma oficial.

Cuando un cliente te escribe, se abre una ventana de veinticuatro horas. Adentro
de esa ventana podés responder lo que quieras.

Cuando se cierra, solo podés mandar plantillas: mensajes que WhatsApp aprobó
antes.

Eso importa para el seguimiento. El típico «hola, ¿pudiste ver la propuesta?» al
día siguiente ya está fuera de la ventana.

Mi bot de ONIA lo resuelve así: si pasaron más de veinticuatro horas, no intenta
un mensaje libre. Usa una plantilla aprobada.

Entonces, antes de programar tu seguimiento, escribí tus plantillas y mandalas
a aprobar. Ojo: esto aplica a la plataforma oficial, la que usan los bots. En la
app de WhatsApp Business que usás a mano no existe esta regla.

En la comunidad dejé cómo armo los mensajes de seguimiento.

---

## Vertical 9 — Mi agente me dijo que quedaban 2. Había 44 activos

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

---

## Para grabar sin guion — POV con las Meta Ray-Ban

Estas no se memorizan. Llevá los lentes y seguí tres momentos: qué querés lograr,
qué se complicó y cómo terminó. Si no terminó, también se cuenta.

1. **Un día construyendo ONIA.** Al empezar: «hoy quiero terminar X». Durante: el
   momento en que algo falla. Al cerrar: se logró o no, y por qué.
2. **Una hora, diez videos.** Detrás de cámara de esta misma sesión de grabación:
   preparar el lugar, las tomas que salen mal, cuántos quedaron.
3. **Lo que hicieron mis agentes mientras dormía.** A la mañana, revisás en
   Telegram o en el repositorio qué trabajo quedó hecho y qué quedó trabado.
4. **Preparando una demo.** Antes de mostrarle el sistema a alguien: qué revisás,
   qué te preocupa. Nunca datos de un cliente en pantalla.
5. **Una pregunta de la comunidad, respondida caminando.** Leés la pregunta
   y la contestás mientras vas a algún lado.

Si aparece otra persona, pedile permiso antes de grabarla.

---

## Enseñanza para vos, Sergio Urcullo — no se graba

Los guiones anteriores se sentían vacíos por dos cosas: usaban negocios
inventados (un taller de bicicletas, una imprenta) y repetían «todavía no lo
probamos». Tu audiencia no te sigue por un ejemplo genérico: te sigue porque
**vos construís una empresa con IA de verdad**. Cada vez que el ejemplo sale de
ONIA —tu hook, tu skill, tu bot, tu error con los 44 workflows—, el video es
tuyo y nadie más lo puede hacer. Y cuando hay que probar algo, se prueba antes de
escribir el guion: en esta tanda la prueba de Opus contra Sonnet y la del bot se
corrieron de verdad, y una de ellas desmintió lo que el guion anterior daba por
hecho.
