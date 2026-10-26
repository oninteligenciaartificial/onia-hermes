# Auditoría editorial · Lote B · S1 (D04 → S1-D07)

Revisado el 30-sep-2026 contra `plan-3-semanas/BRIEF-ESCRITOR.md`, para publicar entre el jue 1-oct y el mié 14-oct-2026. Fuente de las piezas: `plan-3-semanas/S1-GUIONES.md` (D05-C: `GUIONES-PARA-GRABAR-2026-09-29.md`, «Vertical 9»). Palabras contadas sobre el texto hablado final (sin subtítulos `####`).

**Hecho nuevo que cambia tres piezas:** el 29-sep a la tarde (commit `2ff1c207`, `hermes-content/docs/historial/LIMPIEZA_SKILLS_20260929.md`) se borraron `.claude/agents/_retirados/` y dos agentes más (queda 1 subagente), y las skills globales bajaron de 215 a 110. Los guiones se escribieron antes: D04-A citaba un archivo que ya no existe y D04-B decía «tengo doscientas quince».

---

### D04-A · Vertical · Retiré seis de mis nueve subagentes, y seguían apareciendo
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** que Claude Code lee `.claude/agents/` con subcarpetas (doc oficial) y un prompt para listar los subagentes vivos · **Cierre:** web `/claude-code`, sección «Que trabaje sin vos» (existe; ojo: dice «3 subagentes», hoy es 1)
**Cambios:** (1) la verificación decía «abrí esa carpeta»; `/agents` ya no lista nada desde la v2.1.198, así que ahora es un prompt literal para listar los subagentes disponibles. (2) «Claude Code busca también en las subcarpetas» ahora se apoya en la doc oficial y en el hecho de que el 21-sep uno se invocó por error. (3) «mi agente auditó los nueve» → «los audité» (la auditoría cubrió 68 agentes; de esos, 9 eran del proyecto). Se recortó para entrar en 170 palabras. (4) Se sacó «Copias esperando desincronizarse», que era relleno.
**Evidencia verificada:** `.claude/agents/_retirados/README.md` YA NO EXISTE en el árbol; recuperado con `git show 2ff1c207^:.claude/agents/_retirados/README.md`: 6 retirados el 2026-08-18, `dentalgest-migrations` «verificado 2026-07-03», `onia-orchestrator` «declaraba herramientas que no existen» ✔. `ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md` l.10-11: casos (a) paralelo y (b) mente fresca ✔; l.16: «9 proyecto». Commit `2ff1c207`: «The 6 retired on 08-18 still showed up as available (one was invoked by mistake on 09-21)» ✔. https://code.claude.com/docs/en/sub-agents: «Claude Code scans `.claude/agents/` … recursively» ✔; `/agents` desde v2.1.198 solo imprime un recordatorio ✔. Hoy `.claude/agents/` tiene 1 agente (`onia-crm-prospeccion`). En pantalla: el README viejo sacado de git, nunca rutas del servidor.

Tenía nueve subagentes en Claude Code. Retiré seis. Y los seis seguían apareciendo.

Un subagente es otro Claude al que le delegás una tarea. Arranca limpio.

El dieciocho de agosto los audité. Seis repetían skills que ya existían. Uno tenía un estado congelado: «verificado el tres de julio». Otro pedía herramientas que no existen.

La regla que quedó: un subagente se justifica en dos casos. Uno, mucho trabajo en paralelo, como investigar diez fuentes a la vez. Dos, una mente fresca que revisa sin el contexto del que escribió. Si no es ninguno de los dos, es una skill.

Y la trampa: los moví a una carpeta de retirados, dentro de punto claude barra agents. Claude Code lee también sus subcarpetas: lo dice su documentación. En septiembre uno se usó por error. Retirar es sacarlos de ahí.

Para comprobarlo, pedile a Claude: «Listame los subagentes que tenés disponibles». Si aparece uno que retiraste, sigue vivo.

La guía está en mi web, en la sección de Claude Code.

### D04-B · Vertical · Cada skill que instalás te cobra contexto: medilo con /skill-doctor
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la pantalla real de `/skill-doctor` y de `/skills` (Espacio cambia el estado), con `/doctor` antes y después · **Cierre:** comunidad, drop 5 (texto escrito en S1-GUIONES; falta publicarlo antes del video)
**Cambios:** (1) «Yo tengo doscientas quince» era falso desde el 29-sep: se bajó a 110 midiendo el uso del último mes. Ahora es el ejemplo real («tenía 215, medí, quedé en 110»), y queda más fuerte. No digo que la medición se hizo con `/skill-doctor`: se hizo leyendo transcripts. (2) Se aclara que el comando hace la misma medición por vos.
**Evidencia verificada:** https://code.claude.com/docs/en/whats-new/2026-w36 (semana del 31-ago al 4-sep; `/skill-doctor` «shows what each of your skills costs in context and how often it gets used», requiere v2.1.252+) ✔. https://code.claude.com/docs/en/skills: presupuesto del 1 % del contexto; al pasarse «drops descriptions starting with the skills you invoke least» ✔; `skillOverrides` on / name-only / user-invocable-only / off ✔; `/skills` + Espacio + Esc guarda en `.claude/settings.local.json` ✔; `/doctor` estima el costo ✔; las skills de plugins van por `/plugin` ✔. `historial/LIMPIEZA_SKILLS_20260929.md` §2: «Globales `~/.claude/skills` — 215 → 110» ✔. `MAPA.md` l.125 todavía dice «215», quedó viejo. Recontar el día de grabar: si la pantalla no dice 110, se dice el número de la pantalla.

Cada skill instalada en Claude Code te cobra contexto en cada mensaje, la uses o no. Yo tenía doscientas quince. Medí cuáles usé en el último mes y bajé a ciento diez.

Hay un comando que hace esa medición por vos: barra skill guion doctor. Te muestra cuánto cuesta cada skill y cuántas veces se usó.

¿Por qué importa? La lista de skills tiene un tope: el uno por ciento del contexto del modelo. Cuando se pasa, Claude Code borra las descripciones de las que menos usás. Y sin descripción, Claude no sabe cuándo usarlas.

Hacé esto. Corré barra skill guion doctor y buscá las que cuestan y nunca se usaron.

Después escribí barra skills, marcá una y apretá espacio para cambiar su estado. Off la esconde. Name only deja solo el nombre. Escape guarda. Las de plugins se manejan aparte, desde barra plugin.

Para comprobar, corré barra doctor antes y después: te estima cuánto pesa la lista.

El bloque para pegar en tu configuración está en la comunidad.

### D04-C · Vertical · «Verificado» con un 200, y el login mostraba texto roto
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la captura del login con los nombres de los iconos como texto al lado de la versión sana, y el prompt literal para verificar mirando · **Cierre:** comunidad, drop 6 (escrito; falta publicarlo)
**Cambios:** (1) Se explica por qué el grep daba bien: la fuente de iconos funciona por ligaduras, así que el nombre del icono está en el código siempre, se vea bien o no. Esto es lo que demuestra la lección. (2) La verificación era vaga («lo mismo que vería tu cliente»). Ahora tiene criterio: iconos dibujados y no palabras, y carga en segundos.
**Evidencia verificada:** `CLAUDE.md` «Verificar es MIRAR»: login con nombres de iconos («credit_card_off», «verified_user»), «verificado» con HTTP 200 y grep, lo encontró Sergio Urcullo, fuente de iconos de 3,9 MB y 117 s ✔. `ONIA_INFRA_LIMPIEZA_Y_ORDEN.md` l.394-398: Material Symbols es una fuente de ligaduras, «el texto del DOM *es* el nombre del icono… Un grep del texto da falso positivo… Solo la captura lo desmiente» ✔. `ONIA_RADAR_DECISIONES_PRODUCTO.md` l.1472: si la fuente tarda más de 12 s, muestra los nombres como texto ✔. `scripts/canario_visual.mjs` existe ✔. La captura que va en pantalla no puede mostrar datos de ninguna org.

Mi agente me dijo varias veces que el login de mi sistema estaba verificado. Lo abrí yo, y en vez de iconos había palabras: credit card off, verified user.

¿Cómo lo había verificado? Con un código doscientos, que solo dice «la página respondió», y buscando texto en el código. Nunca la abrió.

La causa: la fuente de los iconos pesaba tres coma nueve megas y tardaba ciento diecisiete segundos. Mientras no carga, ves el nombre del icono. Y ese nombre está en el código siempre, se vea bien o no. Buscar texto no lo distingue.

Desde ese día, verificar es mirar. Cuando Claude Code te diga que algo funciona, pedile esto: «No me digas que funciona por el código de respuesta. Abrí la página con un navegador, sacá una captura, mirala, y decime qué texto ves, cuánto pesó y cuánto tardó».

Salió bien cuando en la captura ves iconos dibujados, no palabras, y la página carga en segundos, no en minutos.

El prompt completo está en la comunidad.

---

### D05-A · Vertical · Dos sesiones de Claude Code en el mismo proyecto, sin pisarse
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** `git worktree add -b`, `claude -w`, `git -C` y `git worktree list` corriendo en pantalla, en un repo de prueba · **Cierre:** comunidad, drop 12 (escrito; falta publicarlo. Ojo: en S1-GUIONES figura como «(DM)» y el carrusel K12 dice «Comentá CARRIL». Hay que elegir UN destino: acá quedó comunidad)
**Cambios:** (1) Cierre unificado a comunidad. El guion decía comunidad, el drop decía DM y el carrusel decía «comentá»: eran tres destinos para un mismo recurso. (2) El «cuatrocientos veinticuatro commits» queda CONDICIONADO: la memoria `git-en-worktree-usar-git-C.md` no está en el repo ni en esta máquina, así que no pude verificarla. Si Sergio Urcullo no la confirma antes de grabar, se usa la línea alternativa de abajo.
**Evidencia verificada:** `CLAUDE.md` «Carriles» («Carril = 1 sesión = 1 worktree = 1 rama») ✔. `claude --help` en CLI 2.1.286: «-w, --worktree [name] Create a new git worktree for this session» ✔. `git worktree add -b` / `list` / `remove` y `git -C` son git estándar ✔. La cifra 424 aparece solo en S1-GUIONES, GRABAR-JUE1-DOM4 y CARRUSELES-DIARIOS, que son la misma fuente: **no verificado**.
**Línea alternativa si el 424 no se confirma:** «Y a mí un comando que iba para una carpeta cayó en otra, y me movió una rama entera.»

Dos sesiones de Claude Code en la misma carpeta tocan los mismos archivos. Y a mí un comando que iba para una carpeta cayó en otra, y movió una rama cuatrocientos veinticuatro commits.

La solución se llama worktree: otra carpeta del mismo repositorio, con su propia rama.

Uno. Desde tu proyecto: git worktree add, guion b, el nombre de la rama y la carpeta nueva. Lo que ves en pantalla.

Dos. Abrí Claude Code en esa carpeta. O más corto: claude guion w y un nombre, que la crea por vos.

Tres, el paso crítico. Todo comando de git, con git guion C y la ruta de la carpeta. No confíes en que la terminal sigue donde la dejaste.

A mi agente la terminal le volvió sola a la carpeta principal. Se recuperó con el historial de git, pero nada avisó.

Para comprobar: git worktree list. Cada carpeta, con su rama. Una sesión, una carpeta, una rama.

Los comandos están en la comunidad: el link está en mi web.

### D05-B · Vertical · Presentaciones con Claude en el plan gratis, sin que te invente datos
**Veredicto:** ARREGLADA · **Fecha:** libre (la fecha que se dice, 16-sep, es absoluta) · **Demuestra:** una presentación armada en vivo en una cuenta Free, con el prompt anti-invento y las marcas FALTA · **Cierre:** web `/claude-code`, video 01 «Claude y Claude Code no son lo mismo» (existe: embed `kAsAhGe6zyA` en el código del sitio)
**Cambios:** (1) La verificación («pedile un cambio: tiene que editarse ahí mismo») probaba la función, no el resultado. Ahora es un control del invento: cada número de las láminas tiene que estar en tu texto. (2) Se sacó una frase que no aportaba para mantener el largo.
**Evidencia verificada:** https://support.claude.com/en/articles/12138966-release-notes, entrada del 16-sep-2026: «You can now ask for a design, deck, or document in any conversation…», disponible en todos los planes desde Free ✔ (leído con WebFetch, que devuelve un resumen: mostrar en pantalla la nota original). `sitio-sergiourcullo/claude-code/index.html` tiene la sección 01 con el video ✔. El sitio en vivo no se pudo abrir: el proxy bloquea `sergiourcullo.vercel.app`. **Condición del plan:** la demo se graba en una cuenta Free real; si no sale, no se publica.

Desde el dieciséis de septiembre, Claude hace presentaciones, documentos y diseños dentro de cualquier conversación. Y está en todos los planes, también en el gratis.

Lo dice la nota de versión de Anthropic, lo que ves en pantalla.

Te lo muestro en una cuenta gratis. Pego el texto de mi guía de Claude Code y le escribo esto:

«Armá una presentación de seis láminas con este texto. Una idea por lámina. Usá solo lo que está acá. Si falta un dato, dejá un espacio marcado FALTA en vez de inventarlo».

Esa última frase es la importante. Sin ella, la IA rellena con cifras que suenan bien y no son tuyas.

Para saber si te salió: cada número de las láminas tiene que estar en tu texto. El que no está, es invento. Después completá vos cada FALTA.

Ojo: esto es Claude, el chat. Si no sabés si te alcanza el chat o necesitás Claude Code, en mi web está el video que los compara.

### D05-C · Vertical · Mi agente me dijo que quedaban 2. Había 44 activos
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la lista de workflows de n8n filtrada por activos (el número en pantalla) y un prompt literal para exigir el dato de hoy · **Cierre:** comunidad, con pregunta abierta (existe; no promete ningún recurso)
**Cambios:** (1) Faltaba la unidad repetible: «pedile el comando» se convirtió en un prompt literal para pegar. (2) Se sacó «La IA te ahorra horas», que era relleno. (3) Se acortó el arranque para que la promesa entre en 3 segundos.
**Evidencia verificada:** `CLAUDE.md` «Verificar es MIRAR»: el 2026-08-20 «de 136 workflows de n8n quedan 2»; contados en vivo, 44 ACTIVOS, y «borrarlos apagaba producción» ✔. `ONIA_INFRA_LIMPIEZA_Y_ORDEN.md` §4.1 «Los 44 ACTIVOS — NUNCA borrar» ✔. El filtro por estado en la lista de workflows de n8n **no lo verifiqué**: mirarlo en la pantalla real al grabar. En pantalla, la lista de n8n con los nombres de los workflows difuminados (algunos llevan nombres de prospectos).

Mi agente me dijo que de ciento treinta y seis automatizaciones en mi servidor quedaban dos vivas. Estuve a un paso de borrar el resto.

Antes, las conté de nuevo, en vivo. Había cuarenta y cuatro activas. Si las borraba, apagaba mi producción.

¿Qué pasó? El agente repitió una conclusión vieja, de otra revisión. Sonaba segura. No estaba contada ese día.

Desde ahí tengo una regla: un dato viejo no se ejecuta sin contarlo de nuevo.

En la práctica, antes de borrar o apagar algo que te propone la IA, pegale esto: «Antes de tocar nada, mostrame el comando con el que contaste esto y correlo de nuevo ahora. Quiero el número de hoy».

Y si usás n8n, abrí la lista de workflows, filtrá por activos y mirá el número con tus ojos. Si no coincide con lo que te dijo, no se borra nada.

La decisión que no se puede deshacer la verificás vos, con el dato de hoy.

Contame en la comunidad si te pasó algo parecido.

---

### D06-A · Vertical · Antes de cerrar la sesión: el handoff de siete campos
**Veredicto:** PASA · **Fecha:** libre · **Demuestra:** la plantilla de siete campos en pantalla y la prueba de pasársela a una sesión nueva · **Cierre:** comunidad, drop 7 (escrito; falta publicarlo)
**Cambios:** ninguno.
**Evidencia verificada:** `hermes-content/docs/handoff/README.md`: plantilla de 7 campos (l.55-86); la compactación del 2026-08-22 dio un resumen «fiel y larguísimo… con el mismo peso»; «Un resumen no elige»; el campo de intentos fallidos es «el que casi nadie escribe y el que más vale» ✔. `CLAUDE.md` «Cambio de sesión»: el 4-sep un port de panel tenía cero commits al cerrar ✔. En pantalla va la plantilla, nunca un handoff real (tienen rutas del servidor y estados de pago).

Cuando cerrás una sesión, lo que aprendió se va con ella. La próxima arranca de
cero.

Probé confiar en el resumen automático. El veintidós de agosto una sesión se compactó, y el
resumen era fiel pero larguísimo: cada error y cada idea descartada, con el mismo peso que el
estado actual. Un resumen no elige.

Ahora, al cerrar, Claude escribe un archivo con siete campos. Uno, el objetivo y si se cumplió.
Dos, qué quedó funcionando. Tres, qué quedó a medias: rama y commit. Cuatro, los archivos que
importan. Cinco, los intentos fallidos y por qué. Seis, qué depende de vos. Siete, los próximos
pasos.

El cinco es el que nadie escribe y el que más vale: evita repetir callejones.

Lo que no se commiteó se nombra con su riesgo: el cuatro de septiembre una sesión llegó al cierre
con un trabajo entero sin commit.

Para comprobar, pasale solo ese archivo a una sesión nueva. Si sigue sin preguntarte nada,
está bien escrito.

La plantilla está en la comunidad.

### D06-B · Vertical · Fable, Opus o Sonnet: cuánto te cuesta la misma tarea
**Veredicto:** PASA · **Fecha:** libre (precios a re-verificar el día de publicar) · **Demuestra:** los tres precios oficiales en pantalla, la cuenta hecha con tokens reales de `/usage` y el resultado en centavos · **Cierre:** comunidad, drop 13 (escrito; falta publicarlo. En S1-GUIONES figura como «(DM)» aunque el guion dice comunidad: se publica en comunidad)
**Cambios:** ninguno en el texto hablado. Nota para el editor: «su prueba de oficina» es GDPval-AA (poner el nombre en pantalla).
**Evidencia verificada:** anthropic.com/claude-fable-and-mythos-5-1: USD 10 / 50 ✔. anthropic.com/claude-opus-5-5: USD 4 / 20; «performs at the level of Claude Fable 5.1 on most work»; GDPval-AA 1846 contra 1735 ✔ (lanzado el 22-sep). anthropic.com/claude-sonnet-5-5: USD 2 / 10 ✔ (28-sep). La cuenta, rehecha: 50k + 5k da Sonnet 0,10 + 0,05 = 0,15; Opus 0,20 + 0,10 = 0,30; Fable 0,50 + 0,25 = 0,75 ✔; «cinco veces», 10/2 y 50/10 ✔. code.claude.com/docs/en/costs: el bloque Session de `/usage` muestra tokens por modelo y para Pro/Max «isn't relevant for billing» ✔. `ONIA_MODELOS_CLAUDE_Y_CUOTA.md` l.19 y 39: «Fable solo donde Opus no alcanza» ✔.

Claude tiene tres modelos que importan, y el más caro cuesta cinco veces lo que el más barato.

Precios oficiales por millón de tokens, entrada y salida. Fable cinco punto uno: diez y
cincuenta dólares. Opus cinco punto cinco: cuatro y veinte. Sonnet cinco punto cinco: dos y
diez.

El dato que cambia la cuenta: Anthropic dice que Opus rinde al nivel de Fable en la mayoría
del trabajo. En su prueba de oficina, hasta le gana.

Terminá una tarea en Claude Code y escribí barra usage: arriba ves los
tokens de entrada y de salida.

Un ejemplo, sin contar la caché: cincuenta mil de entrada y cinco mil de salida. En Sonnet son
quince centavos de dólar. En Opus, treinta. En Fable, setenta y cinco.

Con suscripción, no es tu factura: es lo que costará esa tarea en una automatización que paga
por uso.

Mi regla para Fable: solo cuando Opus, con esfuerzo alto, no alcanzó.

Lo tenés completo en la comunidad: el link está en mi web.

### D06-C · YouTube · Claude Code en un servidor, sin API key y con barandas
**Veredicto:** PASA · **Fecha:** libre · **Demuestra:** el diagrama de dos piezas, el esqueleto del corredor con candado, `cd` verificado, `unset` y el prompt desde un archivo, y el error real «line 157: l: command not found» · **Cierre:** comunidad, drop 8 (escrito; falta publicarlo)
**Cambios:** ninguno. 1.034 palabras.
**Evidencia verificada:** `hermes-content/docs/COMO_SE_ARMA_UN_LOOP.md`: las tres barandas (l.54-62: flock, `cd` verificado con el guardián «diagnosticando» semanas desde la carpeta equivocada, aviso cada 6 h por loop); las cinco trampas (l.66-105: allowedTools variadic, stdin que se come el script del segundo loop, API key vencida que pisa la suscripción, cron en UTC contra La Paz UTC−4, edición en caliente del 2-sep con «line 157: l: command not found», flock sin soltar, proceso zombi, temporal + `bash -n` + `mv`); tope de 50 min (l.107); «apagamos dos de seis… 7 de 8 corridas en no-op» (l.208); los loops de Windows solo corrían con la app quieta (l.235) ✔. `scripts/loops/onia-loop.sh`: `unset ANTHROPIC_API_KEY ANTHROPIC_TOKEN` (l.264), `flock -n 9` (l.289), `claude -p … --allowedTools "$TOOLS" < "$PROMPT_FINAL"` (l.483-484) ✔. `hermes-content/deploy/vps-ops/claude-guardia.sh` existe ✔. `claude setup-token` está en `claude --help` 2.1.286 ✔. Prohibiciones de los prompts de loop («Nunca: gastar, publicar, desplegar, mergear a main, tocar otro carril, escribirle a un prospecto»), en `scripts/loops/prompts/*.md` ✔. Se muestran el diagrama y el esqueleto, nunca la terminal del servidor, el `.env` ni credenciales. No se dice cuántos loops hay activos.

#### Resultado primero

En mi empresa hay agentes de Claude Code que trabajan en un servidor sin que yo esté. Cada uno
arranca solo, toma la siguiente tarea de su lista, la cierra, guarda el trabajo en git y se
apaga. Y no uso una API key: corren con mi suscripción.

En este video te muestro cómo se arma uno: las dos piezas que lo componen, las tres barandas que
casi nadie pone y cinco trampas que me costaron vueltas perdidas. Todo lo que te voy a decir se
midió en mi servidor.

#### Por qué en un servidor, y por qué barandas

Primero los tenía en mi computadora. Pero solo corrían cuando la app estaba quieta. Si yo
encadenaba trabajo, nunca tenían su turno. Y no fallaban, no avisaban: simplemente no corrían.
Por eso los mudé a un servidor que está prendido siempre.

La base es simple. Claude Code tiene un modo sin pantalla: claude guion p. Le pasás un pedido,
trabaja y termina. Eso se programa con cron, el reloj de Linux, para que corra cada hora.

El problema es que nadie está mirando. Si algo sale mal a las tres de la mañana, nadie lo ve. Así
que la mitad del trabajo no es el pedido: son las barandas.

#### Las dos piezas

Un loop son dos archivos.

El corredor es un script de bash, uno solo para todos los loops. Se encarga de la mecánica: el
candado, el registro, el tiempo máximo y el aviso.

El prompt es un archivo de texto, uno por loop. Dice qué hace ese carril y qué tiene prohibido.

El corredor no sabe nada del trabajo. El prompt no sabe nada de bash. Así, sumar un loop es un
archivo de texto más y una línea de cron.

Y como cada vuelta arranca sin memoria, el prompt tiene que decirlo todo: en qué carpeta
trabaja, que verifique la rama antes de tocar nada, dónde está su lista de tareas, y lo
prohibido. El mío prohíbe desplegar, mezclar en la rama principal, tocar otro carril, gastar
plata y escribirle a nadie de afuera.

#### Las tres barandas

Baranda uno: el candado. En Linux se llama flock. Si la vuelta anterior sigue corriendo, la
nueva no arranca. Sin esto, un loop que tarda más de una hora se pisa a sí mismo: dos sesiones
editando los mismos archivos. Es el peor modo de falla que hay.

Baranda dos: verificar la carpeta. Antes de trabajar, el script entra a su carpeta, y si no
puede, avisa y se detiene. Esto lo aprendí con mi primer Claude Code en el servidor, el guardián: su
carpeta desapareció en un despliegue y pasó semanas «diagnosticando» desde la carpeta
equivocada. Seguía corriendo. Su registro solo tenía la línea del error.

Baranda tres: avisar cuando se muere. Un monitor que se muere en silencio es peor que no tener
monitor. Pero si avisa lo mismo en cada vuelta, lo dejás de leer. El mío avisa por Telegram como
mucho una vez cada seis horas por loop.

Y una regla de cordura: el tiempo máximo tiene que ser menor que el intervalo. Un loop que corre
cada hora tiene un tope de cincuenta minutos.

#### Las cinco trampas

Trampa uno: la API key. Si en el entorno del servidor hay una variable ANTHROPIC_API_KEY, Claude
Code usa esa clave en vez de tu suscripción. En mi servidor había una, vencida, y todo fallaba.
Por eso el corredor la borra del entorno con unset antes de llamar a Claude. Y si todavía no
dejaste tu suscripción en el servidor, Claude Code trae un comando para eso: claude setup guion
token. Lo que te da es una contraseña: nunca va al repositorio.

Trampa dos: los permisos. Con guion guion allowedTools le decís qué herramientas puede usar. Esa
opción acepta varios valores y se come lo que venga después. Si ponés el pedido a continuación,
lo parte en reglas de permiso basura, y el permiso real queda vacío. La solución: las
herramientas en una sola cadena, separadas por comas.

Trampa tres: la entrada. Si no le decís de dónde leer, Claude se traga lo que haya pendiente en
la terminal. A mi agente le pasó corriendo dos loops seguidos: el primero se comió el script del
segundo, y el segundo nunca corrió. La solución: el pedido entra siempre desde un archivo, con el
signo menor. Claude guion p, menor, prompt punto md.

Trampa cuatro: la hora. El cron del servidor está en hora universal. En Bolivia estamos cuatro
horas atrás. Si copiás el horario de tu computadora tal cual, el loop corre cuatro horas antes.
Traducilo, y dejalo anotado al lado para que nadie lo «corrija».

Trampa cinco: editar en caliente. Bash no lee el script entero de una vez: lo va leyendo a
medida que avanza. El dos de septiembre mi agente editó el corredor mientras un loop corría, y
el script empezó a ejecutar basura desde donde iba. No se perdió trabajo, pero el candado nunca
se soltó, y quedó un proceso zombi que habría bloqueado todas las vueltas siguientes. La
solución: escribir la versión nueva en un archivo temporal, revisarla con bash guion n, y recién
ahí reemplazar la vieja con mv, que es instantáneo.

#### La prueba

¿Cómo sabés que tu loop sirve? No porque corrió. Abrí tres o cuatro de sus commits y miralos. La
pregunta no es cuántos hizo, es qué cambió.

Un loop que corre catorce veces y deja catorce commits de «verifiqué que sigue bien» no sirve:
quema tu límite para producir la misma frase. Con ese criterio apagué dos de seis. Uno tuvo siete
de ocho corridas sin hacer nada.

Y antes de ponerle el cron, corrélo a mano una vez y leé el registro entero. Un cron escrito no
es un cron que anda.

#### El error común

El error más común no es técnico. Es armar un loop para algo que no tiene lista de tareas. Un
loop no piensa: come de su lista. Si no tiene lista, o se planta, o se inventa trabajo. Antes de
escribir una línea de script, preguntate si ese trabajo tiene una lista de tareas reales, que
cualquiera pueda mirar.

#### Cierre

El esqueleto del corredor, con el candado, la carpeta verificada, la clave borrada del entorno y
el pedido desde un archivo, está en la comunidad de WhatsApp. El link está en mi web.

---

### S1-D07-A · Vertical · Una skill que elige las demás: el router
**Veredicto:** ARREGLADA · **Fecha:** libre (antes dependía de salir un martes, justo después de D01-A) · **Demuestra:** el `SKILL.md` del router con su descripción y su tabla, y una sesión nueva que lo invoca primero · **Cierre:** comunidad, drop 9 (escrito; falta publicarlo)
**Cambios:** (1) Se sacó «El miércoles armamos tu primera skill. Hoy, …»: con la ventana del 1 al 14 de octubre, ese miércoles no existe. Ahora la promesa es el problema («con muchas skills, Claude elige mal») y abre sola. (2) La fila de contenido se actualizó a lo que dice hoy el router: primero `diseno-contenido-onia`, después `editor-videos`, `ver-videos` y `sacar-prompt`.
**Evidencia verificada:** `.claude/skills/onia-router/SKILL.md`: description «Invocar al INICIO de cualquier trabajo en el monorepo onia-hermes…» ✔; tabla carril → skills → subagente (l.41-58), fila H contenido: «`diseno-contenido-onia` primero … `editor-videos` `ver-videos` `sacar-prompt`» ✔; «Reglas duras que aplican SIEMPRE» (l.60) ✔. `CLAUDE.md` «Skills del proyecto»: «Toda sesión arranca invocando `onia-router`» ✔.

Cuando tenés muchas skills, Claude elige cuál usar leyendo descripciones. Con muchas, elige mal. Lo que uso yo: una skill que elige las demás. Un router.

Paso uno. Creá una skill que se llame router. En la descripción poné: «Invocar al inicio de cualquier trabajo en este proyecto».

Paso dos. Adentro, una tabla: una fila por tipo de trabajo, con qué skills cargar y qué leer primero. En la mía, la fila de contenido dice: primero la de diseño, después editor de videos, ver videos y sacar prompt.

Paso tres, el que decide: en tu CLAUDE punto md escribí «toda sesión arranca invocando el router». Si no, dependés de que Claude se acuerde.

Paso cuatro. Debajo de la tabla, las reglas que valen siempre.

Para comprobar: abrí una sesión nueva, pedile cualquier cosa y mirá si lo primero que hace es invocar el router. Si no, la descripción está floja.

El esqueleto para copiar está en la comunidad.

### S1-D07-B · Vertical · Tenía veinticuatro MCP conectados y ninguno escrito en mis archivos
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** `/usage` con la atribución por servidor MCP y `/context` antes y después de desactivar uno · **Cierre:** comunidad, drop 14 (escrito, pero HAY QUE CORREGIRLO antes de publicar: ver Pendientes. En S1-GUIONES figura como «(DM)»)
**Cambios:** (1) El método del guion («buscá `mcp__` en tu proyecto; el que no aparece es candidato») quedó desmentido por la medición del 29-sep: ninguno aparecía escrito y aun así trece se usaban de verdad. Así, el video habría mandado a borrar herramientas en uso. Ahora el criterio es el uso real con `/usage`, que atribuye el uso por servidor MCP (planes Pro, Max, Team y Enterprise), y el giro «buscar en tus archivos no alcanza» es la enseñanza. (2) `claude mcp remove` no saca los conectores de la cuenta de claude.ai (varios de los 24 lo eran): el primer camino es `/mcp`, y `remove` queda para lo que agregaste por terminal. (3) La verificación pasa de `claude mcp list` («ya no está») a `/context` antes y después, que mide lo que importa. (4) «Hoy Claude Code carga…» → «Claude Code carga…», sin atadura al día. (5) No se dice que Sergio Urcullo sacó ninguno: el 29-sep decidió dejarlos todos.
**Evidencia verificada:** `ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md` (2026-08-18) l.19-21: «~24 servidores MCP externos conectados + 2 configurados sin autenticar… ≈560 tools diferidas. Cero referencias a `mcp__`… Cloudflare aparece por 6 superficies» ✔. `historial/LIMPIEZA_SKILLS_20260929.md` §4 «MCP»: en 30 días se usan 13 (navegador, Chrome, tareas programadas, n8n, Gmail, Higgsfield, Vercel, Meta Ads, computer-use, Calendar, Supabase, visualize, Notion); sin uso o caídos, 9 (Figma, Gamma, Drive, Claude Docs, Meta Developer Tools, stitch, cloudflare y cloudflare-docs, image-gen, postiz); «se deja todo (decisión de Sergio Urcullo)» ✔. code.claude.com/docs/en/costs: «MCP tool definitions are deferred by default, so only tool names and server instructions enter context»; «Run `/mcp` … and disable any you're not actively using»; «Run `/context` to see what's consuming space»; en `/usage`, Pro/Max/Team/Enterprise ven «Attribution: … individual MCP servers, each shown as a percentage»; `d`/`w` alterna entre 24 h y 7 días ✔. `claude mcp list` / `remove` en `claude mcp --help` 2.1.286 ✔.

Tenía veinticuatro servidores MCP conectados a Claude Code. Cuando los audité, ninguno aparecía nombrado en mis skills ni en mis documentos. Cero.

Un MCP es una conexión que le da a Claude herramientas de otra aplicación.

Eran unas quinientas sesenta herramientas, y el mismo servicio conectado por seis caminos distintos.

Claude Code carga solo los nombres hasta que usa una herramienta. Pero esos nombres entran en cada sesión.

Y buscar en tus archivos no alcanza. Un mes después medí el uso real: trece se usaban igual, y nueve no se usaban o estaban caídos.

Hacé esto. Escribí barra usage: con plan pago te muestra qué parte de tu uso va a cada servidor MCP. Apretá w para ver la semana. El que no aparece, sobra.

Para apagarlo: barra mcp, y desactivalo. Si lo agregaste vos por terminal, claude mcp remove y el nombre.

Comprobás con barra context, antes y después: lo que ocupan las herramientas tiene que bajar.

Lo tenés completo en la comunidad: el link está en mi web.

### S1-D07-C · Vertical · ¿Necesitás inversión? Primero hacé esta división
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la división hecha en pantalla con la planilla (sin montos de ONIA) y cómo salta el número al sumar un sueldo · **Cierre:** comunidad, drop 10 (escrito; falta publicarlo)
**Cambios:** (1) Se sacó el disclaimer a cámara «Es una cuenta de costos, no un consejo de inversión»: la regla 7 lo prohíbe, y ya está en el drop. (2) Faltaba la verificación: se agregó «multiplicá el número por el precio: tiene que cubrir tu gasto». (3) «unos quince, se triplica» → «entre doce y dieciséis, según el sueldo. Casi se triplica»: rehecha la cuenta con los datos del doc, Bs 3.650 más 5.000 a 8.000, dividido 750, da 11,5 a 15,5, y redondeado para arriba, 12 a 16. «Unos quince» tomaba solo el extremo alto. (4) «ONIA» → «mi empresa».
**Evidencia verificada:** `ONIA_ESTRATEGIA_DE_EMPRESA.md` §4 (l.155-161): «break-even = gasto mensual ÷ precio del plan», Bs 3.650 ÷ Bs 750 = 5 clientes (4,87 redondeado); «Si cambiaron [los precios], se recalcula con la fórmula» ✔. §4 (l.172-174): levantar capital es trabajo de tiempo completo, «esas horas salen de las horas de vender» ✔. §5 (l.192-194): un desarrollador suma Bs 5.000 a 8.000 por mes, «el break-even salta de 5 a ~15 clientes, se triplica» ✔. **No verificado:** que el precio vigente siga siendo Bs 750. `onia-platform/lib/subscription-plans.ts` no está en esta máquina. Recalcular con `DEFAULT_PLAN_AMOUNTS` y `FINANCE_LOG_2026.md` antes de grabar; si el resultado deja de ser cinco, se dice el número nuevo. En cámara no van montos de gasto, márgenes ni precios.

Me pregunté si mi empresa necesitaba inversión. Hice una división y la respuesta fue no: me faltan cinco clientes, no un inversor.

La cuenta es esta: gasto mensual dividido el precio de tu plan. Te da cuántos clientes necesitás para no perder plata.

Sumá todo lo que pagás por mes: servidor, herramientas, internet. Dividilo por lo que cobra tu plan más vendido. Redondeá para arriba.

Para comprobar, multiplicá ese número por el precio: tiene que cubrir tu gasto del mes.

Si te da un número chico, tu problema no es de plata: es de clientes.

Mirá qué pasa si contratás antes de tiempo. Si sumo un programador, mi número salta de cinco a entre doce y dieciséis clientes, según el sueldo. Casi se triplica.

Y buscar inversión es trabajo de meses. Si estás solo, esas horas salen de las de vender.

Si te da más clientes de los que podés atender, revisá precio o gasto antes que nada.

La planilla para hacerla está en la comunidad.

---

## Pendientes del lote

**Recursos que faltan publicar.** Todos están escritos en S1-GUIONES, «Drops de la semana», y ninguno está en `docs/cola/drops/`. La comunidad (Avisos) los tiene que recibir ANTES que el video:
- Drop 5 (D04-B), 6 (D04-C), 7 (D06-A), 8 (D06-C), 9 (S1-D07-A) y 10 (S1-D07-C): listos para pegar.
- Drops 12 (D05-A), 13 (D06-B) y 14 (S1-D07-B): figuran como «(DM)», pero los tres guiones cierran en «comunidad». Hay que publicarlos en comunidad. Si Sergio Urcullo prefiere «Comentá PALABRA», se cambia la última línea del guion, no las dos cosas. El carrusel K12 de `CARRUSELES-DIARIOS.md` dice «Comentá CARRIL» y choca con D05-A: alinear.
- **Drop 14 hay que corregirlo antes de publicar.** Hoy manda a usar `grep -rn "mcp__"` como criterio para sacar servidores, y la medición del 29-sep lo desmiente (13 servidores sin ninguna mención en archivos se usaban igual). Texto propuesto: `claude mcp list` (estado) · `/usage` y después `w` (qué % de tu uso va a cada servidor MCP, últimos 7 días; planes Pro, Max, Team y Enterprise) · `/mcp` (desactivar; es el único camino para los conectores de claude.ai) · `claude mcp remove <nombre>` (solo los que agregaste por terminal) · `/context` antes y después (lo que ocupan).
- D05-B y D04-A cierran en la web (`/claude-code`), que existe en `hermes-content/sitio-sergiourcullo/claude-code/index.html`. No pude abrir el sitio en vivo porque el proxy bloquea `sergiourcullo.vercel.app`: confirmar que lo publicado coincide con el repo.

**Riesgos y datos a reconfirmar antes de grabar:**
1. **D05-A · el 424 no está verificado.** La memoria `git-en-worktree-usar-git-C.md` no está en el repo ni en esta máquina. Sin confirmación, se usa la línea alternativa.
2. **La web `/claude-code` quedó vieja.** «Mi caso, con números» dice «3 subagentes con su tarea», y desde el 29-sep hay 1. D04-A manda a esa sección: actualizar el número antes de publicarlo (la regla de barrer la promesa en toda la superficie).
3. **`MAPA.md` l.125** todavía dice «215 skills globales, contadas el 29-sep». Desde la limpieza de esa misma tarde son 110.
4. **S1-D07-C:** recalcular el punto de equilibrio con el precio vigente (`DEFAULT_PLAN_AMOUNTS`) y el gasto de `FINANCE_LOG_2026.md`. Todo lo del guion depende de que siga dando cinco.
5. **D06-B:** los precios se leyeron el 29 y 30-sep. Si sale después de un cambio de precios o de un modelo nuevo, re-leer las tres páginas de anthropic.com.
6. **D05-B:** si la demo en una cuenta Free real no sale, no se publica (condición del MAPA).
7. **D05-C:** el filtro «activos» de n8n no lo verifiqué. En pantalla, difuminar los nombres de los workflows.
8. **Repetición:** D04-A y S1-D07-B salen de la misma auditoría del 18-ago, y D04-B, D04-A y S1-D07-B cuentan partes de la limpieza del 29-sep. Son hallazgos distintos (subagentes, skills, MCP), así que no repiten ejemplo, pero no conviene publicarlos en días seguidos. D04-C y D05-C comparten la lección («verificar, no suponer») con casos distintos (login y n8n): separarlos al menos dos días.
9. **Orden:** S1-D07-A ya no depende de D01-A, pero sigue siendo mejor publicarlo después.
