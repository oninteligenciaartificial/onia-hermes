# Avisos de la comunidad · las 6 palabras de los SI que se pueden grabar (11-oct-2026)

Pedido de la MADRE MARKETING, 11-oct. Formato de `AVISOS-COMUNIDAD-8-16-OCT.md`: cada palabra tiene un **Aviso** corto (se pega primero) y un **Recurso** (se pega después, en otro mensaje). Los bloques de código van tal cual en Avisos de la comunidad (WhatsApp). Voseo, sin «Comentá»: el cierre del video es «Buscá PALABRA en Avisos de mi comunidad. Link en mi perfil.».

**Reglas que valen para todos** (de `GRABAR-NUEVOS-11-OCT.md`): el aviso se pega **antes** de la hora del video; la PALABRA se dice en el video solo si su aviso ya está pegado, si no va el cierre sin palabra; nada entre corchetes se publica. Estos 6 no llevan corchetes: lo que cada uno necesita antes de pegarse está en su línea **Antes de pegar**.

**Cómo se verificó (11-oct-2026):** cada dato salió de la página oficial que se cita, leída ese día; lo que no se pudo comprobar está marcado como «consejo mío», «medición del autor» o «pendiente». Las páginas `scheduled-tasks`, `routines`, `whats-new`, `agents` y `workflows` de Claude Code se leyeron enteras; `model-config` se leyó hasta el carácter 100.000 de 116.497 (la sección de `ultrathink` está dentro); el README de OpenClaw hasta el 100.000 de 102.773 (faltan los últimos 2.773). Los README de ponytail y HyperFrames se consultaron con un lector que devuelve solo lo pedido: se citó lo que devolvió, no se releyeron enteros. Cada dato y su fuente están en la tabla «Datos y fuentes» de cada palabra, que **no se pega**.

| Palabra | Video | Hora | Antes de pegar |
|---|---|---|---|
| RUTINA | SI-01 | mar 13 · 12:30 | La rutina creada el día anterior y la captura de lo que dejó (Sergio Urcullo) |
| OPENCLAW | SI-02 | mar 13 · 18:30 | El link de seguridad confirmado el día de pegar. La prueba, solo si Sergio Urcullo aprueba instalarlo |
| VAGO | SI-03 | mié 14 · 18:30 | La prueba con y sin ponytail, con el conteo de líneas (Sergio Urcullo) |
| SECRETOS | SI-04 | vie 16 · 12:30 | Nada más que este texto |
| HYPERFRAMES | SI-08 | vie 16 · 18:30 | El clip de 3 s hecho con el prompt de abajo |
| INVESTIGAR | SI-09 | por asignar (hueco libre) | Un informe real de `/deep-research`, y comprobar que el comando aparece en su versión |

---

## RUTINA · /loop o /schedule: cuál usar

**Antes de pegar:** la rutina creada el día anterior y la captura de lo que dejó. Sin ella, el video corta «Yo armé una ayer…» y el aviso sale igual.

**Aviso** (se pega primero):

```
🔁 *RUTINA* · */loop o /schedule: cuál usar y cuándo*

En el video te muestro que Claude puede trabajar aunque tu compu esté apagada. Hay dos comandos y se confunden: uno corre en tu compu, el otro en la nube.

Abajo: cuál usar según tu compu esté prendida o apagada, tres ideas de rutina para copiar y un cuidado importante.

Contame en General: ¿qué tarea repetís todos los días?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*RUTINA* · */loop o /schedule: cuál usar*

/loop
• Corre en tu compu, con Claude Code abierto.
• Mínimo: cada 1 minuto. Se apaga a los 7 días.
• Ejemplo: /loop 5m revisá si terminó el deploy

/schedule (rutinas)
• Corre en la nube de Anthropic, aunque tu compu esté apagada.
• Mínimo: cada 1 hora. Planes Pro, Max, Team y Enterprise. Está en prueba (research preview).
• Trabaja sobre una copia de tu repositorio de GitHub: no ve los archivos de tu compu.
• Hay que entrar con tu cuenta de claude.ai (con una API key no aparece).
• Ejemplo oficial: /schedule daily PR review at 9am

Regla: compu prendida → loop. Compu apagada → schedule.

Tres ideas de rutina:
1. Todos los días a las 9: revisá los cambios del proyecto y resumilos.
2. Cada lunes a las 8: listá lo que quedó pendiente.
3. Cada viernes a las 18: decime qué archivos cambiaron en la semana.

Ojo: las rutinas corren sin pedirte permiso. Dales poco poder: que lean, no que borren.

https://code.claude.com/docs/en/scheduled-tasks
https://code.claude.com/docs/en/routines

Contame en General: ¿qué tarea repetís todos los días?
~~~

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| `/loop` corre en tu máquina y con la sesión abierta; mínimo 1 minuto | https://code.claude.com/docs/en/scheduled-tasks · tabla «Compare scheduling options» | ok |
| Las tareas recurrentes de `/loop` expiran a los 7 días | misma página · «Seven-day expiry» | ok |
| `/schedule` (cloud): corre en la nube, no necesita la máquina prendida ni sesión abierta, mínimo 1 hora, sin acceso a archivos locales («fresh clone») | misma tabla | ok |
| Rutinas en Pro, Max, Team y Enterprise; en research preview; se crean con `/schedule` | https://code.claude.com/docs/en/routines | ok |
| Ejemplo oficial `/schedule daily PR review at 9am` | misma página · «Create from the CLI» | ok |
| Las rutinas corren de forma autónoma y sin pedir aprobación | misma página · «Create a routine» | ok |
| `/schedule` pide iniciar sesión con una suscripción de claude.ai (con API key, Console o proveedor de nube no aparece) | misma página · «Troubleshooting» | ok |
| El ejemplo de `/loop` («revisá si terminó el deploy») | traducido de «check if the deployment finished and tell me what happened», de la página de `/loop` | adaptado |
| Las tres ideas de rutina | mías | consejo mío |

---

## OPENCLAW · 3 reglas antes de instalarlo

**Antes de pegar:** confirmar el día de pegar que el link `#security` del README sigue abriendo esa sección. La prueba de abajo se pega **solo si** Sergio Urcullo aprueba instalar OpenClaw en una compu aparte; si no, se borra esa línea.

**Aviso** (se pega primero):

```
🦞 *OPENCLAW* · *3 reglas antes de instalarlo*

En el video te cuento por qué no lo instalaría en la compu donde tenés tus contraseñas: ejecuta cosas en tu equipo y lee mensajes de afuera.

Abajo: las 3 reglas, lo que dice su propio manual de seguridad y el comando oficial para instalarlo en una compu aparte.

Contame en General: ¿tenés una compu vieja o un servidor para probarlo?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*OPENCLAW* · *3 reglas antes de instalarlo*

1. Compu aparte: una vieja o un servidor alquilado. Nunca la que tiene tu banco o tus contraseñas.
2. Sandbox: encerralo en una caja cerrada. Lo que rompa, queda adentro.
3. Skills solo de gente que conocés. Leelas antes de instalarlas. (Consejo mío; el manual no lo dice con esas palabras.)

Por qué, según su propio README:
• «Treat inbound messages as untrusted input»: trata los mensajes que le llegan como no confiables.
• «Tools run on the host for the main session unless you configure sandboxing»: las herramientas corren en tu equipo salvo que las encierres en una caja cerrada.

Mi prueba (no es del manual): pedile que abra un archivo fuera de su caja. Si no puede, está bien encerrado.

Manual y seguridad: https://github.com/openclaw/openclaw#security
Guía de la caja cerrada: https://docs.openclaw.ai/gateway/sandboxing
Instalar (en la compu aparte, Mac, Linux o WSL2): curl -fsSL https://openclaw.ai/install.sh | bash
Leé el script antes de correrlo: https://openclaw.ai/install.sh

Contame en General: ¿tenés una compu vieja o un servidor para probarlo?
~~~

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| «Treat inbound messages as untrusted input» | https://github.com/openclaw/openclaw · sección `#security` | ok |
| «Tools run on the host for the main session unless you configure sandboxing» | misma sección | ok |
| La guía de sandbox está en `docs.openclaw.ai/gateway/sandboxing` | misma sección (el README la nombra antes de «conectar a otros usuarios o exponerlo en remoto») | ok |
| Comando de instalación `curl -fsSL https://openclaw.ai/install.sh \| bash` (macOS, Linux, WSL2) | misma página · `#install` | ok |
| «Skills solo de gente que conocés» | **no figura** en lo leído del README (sin una advertencia específica sobre skills de terceros) | consejo mío |
| La prueba del archivo fuera de la caja | mía | consejo mío |
| Leer el script antes de correrlo | mío; el comando es `curl … \| bash` y ejecuta lo que descarga | consejo mío |
| Parte final del README (últimos 2.773 caracteres) | no leída | pendiente |

---

## VAGO · ponytail: que Claude escriba solo lo que hace falta

**Antes de pegar:** la prueba con y sin ponytail grabada el día de grabar, con el conteo de líneas. El número de abajo es el del autor, no el de Sergio Urcullo.

**Aviso** (se pega primero):

```
🦥 *VAGO* · *ponytail: que Claude escriba solo lo que hace falta*

En el video le pido lo mismo a Claude con y sin este plugin, y cuento las líneas de código que escribe cada uno.

Abajo: los dos comandos para instalarlo, lo que midió su autor (con la letra chica) y cómo probarlo vos en 3 pasos.

Contame en General: ¿Claude te escribe más código del que pedís?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*VAGO* · *ponytail: que Claude escriba solo lo que hace falta*

Instalar, dentro de Claude Code:
/plugin marketplace add DietrichGebert/ponytail
/plugin install ponytail@ponytail

Lo que midió su autor (39 tareas, 5 corridas cada una, con Opus 5.5, contra el mismo agente sin el plugin): −53 % de código, −41 % de tiempo, −26 % de costo y −45 % de tokens. Es una medición del propio autor; no encontré otra.
https://github.com/DietrichGebert/ponytail
Licencia MIT.

Probalo vos:
1. Sin el plugin, pedile algo chico (por ejemplo, «un botón que cuente clics»). Contá las líneas.
2. Con el plugin, el mismo pedido. Contá las líneas.
3. ¿Hace lo mismo con menos? Quedátelo. ¿Dejó de hacer algo que pediste? Sacalo.

Contame en General: ¿Claude te escribe más código del que pedís?
~~~

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| Comandos `/plugin marketplace add DietrichGebert/ponytail` y `/plugin install ponytail@ponytail` | https://github.com/DietrichGebert/ponytail · README | ok |
| −53 % código · −41 % tiempo · −26 % costo · −45 % tokens; 39 tareas, un repo real FastAPI + React, Opus 5.5, 5 corridas cada una | mismo README (la cabecera del benchmark) | medición del autor |
| El detalle del benchmark | el README lo enlaza a `benchmarks/results/2026-10-07-agentic.md`, dentro del repo | **no revisado** |
| Licencia MIT | mismo README | ok |
| «No encontré otra medición» | búsqueda propia del 8-oct; no se repitió el 11-oct | pendiente de repetir si se quiere afirmar |
| El pedido de ejemplo y los 3 pasos | míos | consejo mío |

---

## SECRETOS · 3 comandos escondidos de Claude Code, y uno más

**Antes de pegar:** nada más que este texto.

**Aviso** (se pega primero):

```
🗝️ *SECRETOS* · *3 comandos escondidos de Claude Code, y uno más*

En el video te enseño tres comandos que no se ven a simple vista. Abajo: qué hace cada uno, el link oficial y una cuarta pantalla para ver todas tus sesiones.

Si no te aparecen, actualizá Claude Code.

Contame en General: ¿cuál conocías?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*SECRETOS* · *3 comandos escondidos de Claude Code, y uno más*

• /radio: pone Claude FM, música lo-fi para concentrarte (llegó la semana del 29 de junio).
• /powerup: lecciones de Claude Code adentro de Claude Code (llegó la semana del 30 de marzo).
https://code.claude.com/docs/en/whats-new

• ultrathink: escribilo en tu pedido y Claude piensa más, solo en esa respuesta, sin cambiar tu nivel de esfuerzo. Pensar más gasta más: guardalo para lo difícil.
https://code.claude.com/docs/en/model-config

• Y uno más, claude agents (se escribe en la terminal, no adentro de Claude): una pantalla con todas tus sesiones, lo que corre, lo que espera por vos y lo que terminó. Está en prueba (research preview).
https://code.claude.com/docs/en/agents

¿No te aparecen? Actualizá Claude Code.

Contame en General: ¿cuál conocías?
~~~

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| `/radio` «tunes into Claude FM lo-fi radio», semana 27 (29-jun al 3-jul), versiones 2.1.195–2.1.201 | https://code.claude.com/docs/en/whats-new | ok |
| `/powerup` «interactive lessons», semana 14 (30-mar al 3-abr), versiones 2.1.86–2.1.91 | misma página | ok |
| `ultrathink`: «request deeper reasoning on that turn without changing your session effort setting» | https://code.claude.com/docs/en/model-config · «Use ultrathink for one-off deep reasoning» | ok |
| Pensar más gasta más: «You are charged for all thinking tokens generated» | misma página · «Extended thinking» (la nota de costo no es de `ultrathink` solo: es del pensamiento en general) | ok |
| Qué modelos reconocen `ultrathink` | la página no lo dice | no afirmado |
| `claude agents` abre agent view: una pantalla para cada sesión; research preview | https://code.claude.com/docs/en/agents · tabla de enfoques; https://code.claude.com/docs/en/whats-new · semana 20 | ok |
| «Actualizá Claude Code» si no aparecen | consecuencia de las versiones de arriba | ok |

---

## HYPERFRAMES · Videos que escribe Claude

**Antes de pegar:** el clip de 3 s del cuadro 0, hecho con el prompt de abajo, **antes de grabar**. Si no se hizo, SI-08 no se graba.

**Aviso** (se pega primero):

```
🎬 *HYPERFRAMES* · *Videos que escribe Claude*

El título animado del video no lo edité: lo escribió Claude con HyperFrames, una herramienta gratis que convierte una página web en video.

Abajo: lo que necesitás, cómo instalarla de dos maneras y el prompt que usé.

Contame en General: ¿qué cartel animado te gustaría tener en tus videos?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*HYPERFRAMES* · *Videos que escribe Claude*

Necesitás: Claude Code, Node 22 o más (https://nodejs.org) y FFmpeg (https://ffmpeg.org).

Con Claude Code (plugin):
claude plugin marketplace add heygen-com/hyperframes
claude plugin install hyperframes@hyperframes

Sin plugin, tres comandos (más el que entra a la carpeta):
npx hyperframes init mi-video
cd mi-video
npx hyperframes preview
npx hyperframes render

Mi prompt:
«Con HyperFrames, hacé un título animado vertical de 3 segundos. Fondo negro. El texto ESTE VIDEO LO ESCRIBIÓ CLAUDE en blanco, con la palabra CLAUDE en verde #10C26B. Que entre desde abajo con un rebote suave y quede quieto el último segundo.»

Ojo: no edita lo que grabaste ni crea presentadores con IA. Sirve para títulos y carteles animados.
Gratis y de código abierto (Apache 2.0).
https://github.com/heygen-com/hyperframes

Contame en General: ¿qué cartel animado te gustaría tener en tus videos?
~~~

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| Requisitos «Node.js 22+, FFmpeg» | https://github.com/heygen-com/hyperframes · README | ok |
| Comandos del plugin `claude plugin marketplace add heygen-com/hyperframes` y `claude plugin install hyperframes@hyperframes` | mismo README | ok |
| `npx hyperframes init / preview / render` (el README usa `my-video`; acá `mi-video`) | mismo README · quick start | ok |
| Licencia Apache 2.0; «open-source framework for turning HTML, CSS, media, and seekable animations into deterministic MP4 videos» | mismo README | ok |
| «Gratis» | la licencia es Apache 2.0 y el render local no cobra; el render en la nube (HeyGen, AWS) es aparte y no se menciona acá | ok (con esa precisión) |
| «No edita lo que grabaste ni crea presentadores con IA» | descripción del README («HTML, CSS, media y animaciones» → MP4); la frase negativa es nuestra | consejo mío |
| El prompt de ejemplo | mío; el clip tiene que existir | pendiente (lo hace Sergio Urcullo) |
| Estrellas de GitHub (el video dice «casi doce mil este mes») | el README muestra 60,6 mil en total; el «este mes» **no** se verificó acá y no va en el aviso | pendiente, solo del video |

---

## INVESTIGAR · Investigar con fuentes y comprobarlo en 2 minutos

**Antes de pegar:** un informe real de `/deep-research` (el que se muestra en el video) y confirmar que el comando aparece en la versión de Claude Code de Sergio Urcullo (2.1.288 el 11-oct). SI-09 todavía no tiene día: el aviso se pega el día en que se agende.

**Aviso** (se pega primero):

```
🔎 *INVESTIGAR* · *Investigar con fuentes y comprobarlo en 2 minutos*

En el video te muestro un comando que investiga por vos y te devuelve un informe con links. Y lo más importante: cómo comprobar que esos links dicen lo que el informe dice.

Abajo: el comando, cómo activarlo en el plan Pro, los 3 pasos para comprobarlo y 3 preguntas de ejemplo.

Contame en General: ¿qué te gustaría que Claude investigue por vos?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*INVESTIGAR* · *Investigar con fuentes y comprobarlo en 2 minutos*

En Claude Code: /deep-research <tu pregunta>
Te devuelve un informe con citas; lo que no sobrevivió al cruce de fuentes ya viene filtrado.
En el plan Pro, primero activá «Dynamic workflows» en /config.
Necesita que Claude tenga la búsqueda web disponible.
Gasta más de tu límite que una pregunta normal.

Comprobar en 3 pasos (sirve con cualquier IA que te dé links):
1. Abrí dos citas al azar.
2. ¿Dicen lo mismo que el informe?
3. Si una no existe o dice otra cosa, ese dato no lo usás, y desconfiá del resto del informe.

Tres preguntas de ejemplo:
• ¿Ya existe un plugin de Claude Code que haga [lo que querés construir]?
• ¿Cuánto cuesta de verdad tener un asistente de IA propio?
• ¿Qué cambió en Claude Code este mes, según su documentación oficial?

https://code.claude.com/docs/en/workflows

Contame en General: ¿qué te gustaría que Claude investigue por vos?
~~~

(El único corchete de este aviso, `[lo que querés construir]`, es parte de la pregunta de ejemplo: se pega así y cada uno lo completa. No es un dato a medir.)

**Datos y fuentes** (no se pega · leídas el 11-oct-2026):

| Dato | Fuente | Estado |
|---|---|---|
| `/deep-research <pregunta>` es un workflow incluido en Claude Code | https://code.claude.com/docs/en/workflows · «Run a bundled workflow» y «Bundled workflows» | ok |
| Devuelve «a cited report with claims that didn't survive cross-checking filtered out» | misma tabla | ok |
| «On Pro, turn them on from the Dynamic workflows row in /config» | encabezado de la página | ok |
| «Requires the WebSearch tool to be available» | misma tabla | ok |
| Un workflow usa más tokens que la misma tarea en una charla y cuenta contra tus límites | misma página · «Cost» | ok |
| Los 3 pasos para comprobar y las 3 preguntas | míos | consejo mío |
| Que `/deep-research` aparezca en la versión de Sergio Urcullo | no se pudo verificar desde la nube | pendiente (versión 2.1.288) |

---

## Qué falta para que todo esté pegable

1. **RUTINA, VAGO, HYPERFRAMES e INVESTIGAR** dependen de algo que hace Sergio Urcullo antes de grabar (rutina del día anterior, prueba con y sin ponytail, clip de 3 s, informe real). Los textos están listos; sin esa prueba, su video corta el tramo y el aviso igual puede pegarse.
2. **OPENCLAW**: confirmar el link `#security` el día de pegar, y la prueba solo con el OK de Sergio Urcullo para instalar OpenClaw en una compu aparte.
3. **SECRETOS** no necesita nada.
4. Ninguno de los 6 usa «Comentá»; todos cierran con «Contame en General». Para el validador del calendario (`marca-M2`), los encabezados `## PALABRA ·` de arriba son los que busca.
