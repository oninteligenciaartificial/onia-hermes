# Auditoría editorial · LOTE A · D01-A a D03-C

Revisado el 30-sep-2026 contra `plan-3-semanas/BRIEF-ESCRITOR.md`. Ventana de publicación: jue 1-oct a mié 14-oct-2026.
Fuentes re-leídas hoy: anthropic.com/claude-sonnet-5-5 y /claude-opus-5-5, code.claude.com/docs/en/memory, /skills, /hooks y /model-config (todas cargaron). developers.facebook.com y sergiourcullo.vercel.app **están bloqueados desde este entorno**: lo que depende de ellos se marca «no verificado».

---

### D01-A · Vertical · Tu primera skill de Claude Code en un minuto
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** la ruta `.claude/skills/<nombre>/SKILL.md`, el frontmatter de una skill real de ONIA y cómo comprobar con `/skills` que cargó · **Cierre:** web `/claude-code`, video 02 «Instalarlo, y tu primera skill» (existe en el código del sitio; en vivo no verificado)
**Cambios:**
- Ejemplo cambiado de `onia-router` a `onia-continuidad`: el router es el tema entero de D07-A (mar 6-oct, misma semana). El brief prohíbe repetir ejemplo en la semana.
- Agregada la verificación, que no tenía: `/skills` lista la skill, y un pedido que coincide con la descripción la dispara.
- Agregado el porqué con un dato real: la sesión del 31-ago en la que cuatro de seis cosas planificadas ya existían.
- Cierre precisado: «la guía completa, con el paso a paso» pasa a «el video para instalarlo y armar tu primera skill», que es lo que la web tiene de verdad (la sección de la skill es conceptual; el paso a paso está en el video embebido).
**Evidencia verificada:** `.claude/skills/onia-continuidad/SKILL.md` existe; su `description` empieza «Invocar al ARRANCAR cualquier sesión de ONIA»; la tabla «cuatro fallas medidas el mismo día» dice «Planifiqué 6 features. 4 no existían» (31-ago). code.claude.com/docs/en/skills: ruta `.claude/skills/<skill-name>/SKILL.md`, la `description` es lo que Claude usa para decidir, `/skills` lista las cargadas. Aclaración: en la doc, `name` es opcional (si falta, se usa el nombre de la carpeta). El guion lo presenta como uno de los dos datos, sin decir que es obligatorio. `hermes-content/sitio-sergiourcullo/claude-code/index.html`: sección 02 «Instalarlo, y tu primera skill» con video `oXaqV-HDufA`.

Una skill es un archivo que le enseña a Claude Code a hacer algo. Y lo usa solo cuando hace falta. Armemos una.

En tu proyecto creá la ruta que ves en pantalla: punto claude, barra skills, barra el nombre de tu skill. Adentro, un archivo SKILL punto md, en mayúsculas.

Arriba van dos datos. Name, el nombre. Description, cuándo usarla.

Esa descripción es lo más importante: Claude la lee para decidir si la skill aplica. Si es vaga, no la usa nunca.

Abajo, las instrucciones, como se las explicarías a alguien nuevo.

La mía se llama continuidad. La descripción dice: invocar al arrancar cualquier sesión. Obliga a leer lo que ya sabemos antes de decidir. Nació el día en que mi agente planificó seis cosas, y cuatro ya estaban hechas.

Para comprobar la tuya, escribí barra skills: tiene que aparecer. Después pedile algo que coincida con la descripción, y fijate si la usa.

El video para instalar Claude Code y armar tu primera skill está en mi web.

---

### D01-B · Vertical · Salió Sonnet 5.5: la prueba de tres tareas para saber si te sirve
**Veredicto:** ARREGLADA · **Fecha:** libre (mejor en la primera semana; «salió el veintiocho» no caduca, pero la noticia pierde fuerza) · **Demuestra:** el método para comparar dos modelos en tres tareas propias, con planilla y la regla de decisión · **Cierre:** comunidad, drop 1 «Planilla Sonnet vs Opus» (escrito en S1 «Drops de la semana»; falta publicarlo antes del video)
**Cambios:**
- «con mis agentes en el modelo caro para casi todo» pasa a «después de lanzar tres agentes en el modelo caro al mismo tiempo». Es lo que registra el doc de cuota: tres o más subagentes Opus en paralelo «remató la semana» el 8-sep, y el corte fue el 10-sep. «Para casi todo» no tenía fuente. El dato de los trece de quince loops en Opus queda para D01-C, así no se repite el ejemplo.
- Agregado «desde el mismo commit» a la instrucción de correr las dos pruebas (lo dice el drop). Sin eso, la segunda corrida arranca con el trabajo de la primera ya hecho.
- Corregido el orden para que el porqué quede antes de la regla de decisión, y quitada la frase «Tres tareas no son un benchmark: son tu caso», que es relleno.
**Evidencia verificada:** anthropic.com/claude-sonnet-5-5: 28-sep, USD 2/10, «scores two points below Opus 5.5 on GDPval-AA» (1844 contra 1846). anthropic.com/claude-opus-5-5: USD 4/20. `docs/ONIA_MODELOS_CLAUDE_Y_CUOTA.md` §«lo que nos pasó el 10-sep»: el pool es uno solo para Claude web, Claude Code y los loops, y los loops y tres subagentes Opus murieron a la misma hora con «You've hit your weekly limit». Regla 1 del mismo doc: «Nunca 3+ subagentes Opus/Fable en paralelo con los loops corriendo. Eso remató la semana el 8-sep». Docs model-config: los alias `sonnet` y `opus` apuntan al último modelo y `--effort` existe.

Sonnet cinco punto cinco salió el veintiocho de septiembre y cuesta la mitad que Opus: dos dólares por millón de tokens de entrada, contra cuatro.

Anthropic dice que en trabajo de oficina queda a dos puntos de Opus. Probalo vos.

Elegí tres tareas reales de tu semana: una mecánica, una de todos los días y una difícil.

Corré cada una con claude guion guion model sonnet. Después, desde el mismo commit, con claude guion guion model opus. Mismo prompt, palabra por palabra, y mismo esfuerzo.

Por cada tarea anotá cuántas veces lo corregiste, cuántos minutos tardó en quedar bien, y si lo usarías sin tocar.

¿Por qué importa? El chat y Claude Code comparten el mismo límite. A mí se me acabó la semana el diez de septiembre, después de lanzar tres agentes en el modelo caro a la vez.

La regla: si Sonnet empata en dos de tres, usalo por defecto. Opus, solo para el tipo de tarea donde perdió.

La planilla para anotarlo está en la comunidad.

---

### D01-C · YouTube · Opus 5.5 o Sonnet 5.5: cuál usar y cómo cambiarlo en Claude Code
**Veredicto:** ARREGLADA · **Fecha:** libre, después de la reto-respuesta del vie 2-oct 19:00 (ver cambios) · **Demuestra:** la misma tarea con trampa corrida en los dos modelos el 28-sep, con los mismos tres totales, más los comandos `--model` / `/model` en pantalla · **Cierre:** comunidad, con el prompt de las tres propuestas (existe: `drops/2026-10-01.md`, mensaje 2; preparado, no enviado)
**Cambios:**
- «Acaba de salir Sonnet 5.5» pasa a «Sonnet 5.5 salió el veintiocho de septiembre»: si sale el 14-oct, ya no «acaba de salir».
- Agregado el caso real del 4-sep (`CONOCIMIENTO_DE_LOS_LOOPS.md:17`): trece de quince loops en Opus, tres horarios con el 58 % de la cuota, y el reparto posterior según si el loop escribe o mide. Es la prueba de que la regla de la sección se aplica.
- **Corregida la «regla que uso en ONIA».** Decía que Sonnet hace «editar archivos, escribir scripts». Eso contradice la regla escrita en `ONIA_MODELOS_CLAUDE_Y_CUOTA.md` («subagentes de medición → Haiku/Sonnet; subagentes que escriben código → Opus») y el inventario C-12 («modelo caro solo para escribir código o decidir; barato para medir y redactar»). Ahora dice lo que dice el doc, más la regla de Fable.
- Recortada a dos frases la parte del esfuerzo, que repetía casi entero a D02-A (jue 1-oct).
- Dos cierres (comunidad y web) quedan en uno: la comunidad, que es donde está el prompt.
- Agregados subtítulos de sección, una sección de error común y la verificación para el espectador (qué totales tienen que salir), que faltaban.
- Números en palabras («el 22», «el 28», «5.5» hablado como «cinco punto cinco»).
- ⚠️ **Fecha:** el reto de la comunidad (jue 1-oct 19:05) pide adivinar cuál cumple, y la respuesta sale el vie 2-oct 19:00. Este video da los totales, así que publicarlo antes del viernes a la noche arruina el reto. Tiene que salir desde el sáb 3-oct.
**Evidencia verificada:** anthropic.com/claude-opus-5-5: 22-sep, 4/20, GDPval-AA 1846, FrontierCode 54,4 %, Terminal-Bench 66,4 %, OSWorld 81,8 %. anthropic.com/claude-sonnet-5-5: 28-sep, 2/10, 1844, Terminal-Bench 70,6 %, FrontierCode 46,2 % en Max, OSWorld 80,1 %. `PRODUCCION-GUIONES-2026-09-29.md` §Prueba 1: los dos modelos dan 1050/1060/1350, encuentran los Bs 360 y los 300 escondidos, y eligen A. `drops/2026-10-01.md`: el mismo prompt está publicado como reto. model-config: alias `sonnet`/`opus` = el último modelo; `/model` dentro de la sesión; effort con cinco niveles; medium por defecto en los modelos cinco punto cinco. `ONIA_MODELOS_CLAUDE_Y_CUOTA.md` reglas 2 y 4. `CONOCIMIENTO_DE_LOS_LOOPS.md:17` (04-sep: los que escriben producto o mergean a main van en Opus y los que miden, publican o redactan en Sonnet; antes eran 13 de 15 en Opus y tres carriles horarios con el 58 % de la cuota).

#### Resultado primero

Sonnet cinco punto cinco salió el veintiocho de septiembre. Cuesta la mitad que Opus cinco punto cinco y, en una de las pruebas de Anthropic, le ganó.

Así que hice lo más simple: le di exactamente la misma tarea a los dos. En este video te muestro qué pasó, qué dicen los números de verdad y la regla que uso en mi empresa para elegir cuál de los dos trabaja.

#### Qué salió y cuánto cuesta

Opus cinco punto cinco salió el veintidós de septiembre. Es el modelo potente, el que usás cuando la tarea es difícil. Sonnet cinco punto cinco salió seis días después. Es el intermedio: más rápido y más barato.

¿Cuánto más barato? Opus cobra cuatro dólares por millón de tokens de entrada y veinte de salida. Sonnet, dos y diez. Exactamente la mitad.

Ahora, la mitad del precio no sirve de nada si hace la mitad del trabajo. Así que miremos las pruebas que publicó Anthropic. Las ves en pantalla.

En trabajo de oficina, lo que ellos llaman GDPval, están prácticamente empatados: mil ochocientos cuarenta y cuatro contra mil ochocientos cuarenta y seis.

En uso de computadora, ochenta con uno contra ochenta y uno con ocho. Casi igual.

En Terminal-Bench, que mide tareas en la terminal, Sonnet saca setenta con seis y Opus sesenta y seis con cuatro. Ahí gana el barato.

Pero en FrontierCode, que es código difícil de verdad, Opus saca cincuenta y cuatro y Sonnet cuarenta y seis, aun con Sonnet en esfuerzo máximo. Ocho puntos de diferencia.

La lectura es esta: en casi todo están parejos, y Opus se despega cuando el problema es realmente difícil.

#### Por qué importa

Si usás Claude con suscripción, el chat y Claude Code gastan del mismo límite semanal. Cada tarea que mandás al modelo caro sin necesidad es una tarea menos antes de que se te corte la semana. Y si pagás por uso, en una automatización o en un bot, es directamente el doble de plata.

#### La prueba: una tarea con trampa

Esos son números de Anthropic. Yo quería ver una tarea mía.

Les pasé tres propuestas para una web de tres meses. Con trampa. Una anuncia setecientos bolivianos, pero tiene un dominio obligatorio que cobra ciento veinte por mes y no está sumado. Otra dice «instalación cero» y después cobra trescientos de configuración obligatoria.

Les pedí el costo real de los tres meses, la fórmula, las contradicciones y cuál cumple mis requisitos. Mismo prompt, palabra por palabra, en una sesión limpia cada uno.

Resultado: los dos dieron los mismos tres totales. Mil cincuenta, mil sesenta y mil trescientos cincuenta. Los dos encontraron los trescientos sesenta que faltaban en la primera. Los dos se dieron cuenta de que la instalación cero escondía trescientos. Y los dos eligieron la misma propuesta.

Para esta tarea, pagar el doble no me dio nada. No elijas el modelo por la fama. Elegilo por tu tarea.

#### Cómo lo cambiás en Claude Code

Cuando abrís Claude Code desde la terminal, escribís claude, espacio, guion guion model, y el nombre. Claude guion guion model sonnet te abre la sesión con Sonnet. Claude guion guion model opus, con Opus.

Sonnet y opus son alias: siempre apuntan a la versión más nueva. Así que cuando salga la próxima, no tenés que cambiar nada.

Si ya estás adentro de una sesión, escribí barra model y elegí el otro. Lo que ves en pantalla. Para comprobar con cuál estás trabajando, preguntale directamente: «¿qué modelo sos?». Claude Code le pasa ese dato en cada sesión, así que te responde el nombre exacto.

Y hay una segunda perilla, el esfuerzo: cuánto piensa el modelo antes de responder. Antes de pasar a un modelo más caro, probá subir el esfuerzo un nivel. Eso lo explico entero en otro video.

#### La regla que uso en ONIA

Hasta el cuatro de septiembre, trece de mis quince agentes automáticos corrían en Opus. Y tres de ellos, solos, se llevaban el cincuenta y ocho por ciento de mi cuota. Ese día los repartí con una pregunta: este agente, ¿escribe o mide?

Sonnet mide, revisa y redacta: contar cosas, leer pantallas, armar contenido, publicar, revisar lo que hizo otro. Es rápido y cuesta la mitad.

Opus escribe código y decide: los agentes que tocan el producto o suben cambios a la rama principal, una migración de base de datos, una decisión de arquitectura, un error que no entiendo después de dos intentos. Ahí equivocarse sale más caro que el modelo.

Y el modelo más caro de todos, Fable, entra solo cuando Opus, con el esfuerzo alto, no alcanzó.

#### El error común

El error más común es elegir una vez y no volver a mirar. En un mes salieron Opus y Sonnet cinco punto cinco, y lo que era cierto con los anteriores dejó de serlo: hoy el barato le gana al caro en tareas de terminal.

El segundo error es comparar mal. Si corrés Opus sobre el trabajo que ya dejó hecho Sonnet, Opus arranca con ventaja. Cada prueba, desde el mismo punto de partida, con el mismo prompt y el mismo esfuerzo. Cuando no sé cuál va, hago lo que hice acá: la misma tarea a los dos, y comparo cuánto tuve que corregir de cada uno. Eso vale más que cualquier tabla.

#### Cierre

Hacé la prueba vos. El ejercicio de las tres propuestas, con el prompt completo, está en la comunidad de WhatsApp. El link está en mi web.

Pegalo en los dos modelos. Si te salió bien, vas a ver los mismos tres totales: mil cincuenta, mil sesenta y mil trescientos cincuenta. Si alguno te da setecientos, ese modelo se comió la trampa.

---

### D02-A · Vertical · La perilla de Claude Code que casi nadie toca
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** `/effort` abierto en pantalla con los cinco niveles, más el dato de la doc: con los modelos cinco punto cinco el default bajó a medium · **Cierre:** comentá EFFORT (falta escribir la tabla como drop formal: ver Pendientes)
**Cambios:**
- La promesa era vaga («una perilla que casi nadie toca»). Ahora abre con un dato verificable: los modelos cinco punto cinco vienen en medium, un nivel por debajo de los anteriores (high).
- No tenía ejemplo real de ONIA. Agregada la regla escrita de ONIA: se pasa a Fable solo cuando Opus con esfuerzo alto no alcanzó (primero la perilla, después el modelo).
- No tenía verificación. Agregadas dos: `/effort` muestra en qué nivel estás, y la misma tarea en medium y en high se compara por cantidad de correcciones.
- «max, casi nunca» ahora tiene su motivo en la fuente: la doc dice que tiende a pensar de más.
**Evidencia verificada:** code.claude.com/docs/en/model-config: niveles low/medium/high/xhigh/max; «Opus 5.5 & Sonnet 5.5: medium (one level below other models)», los demás en high; `claude --effort <nivel>` y `/effort` (sin argumentos abre un deslizador); max «prone to overthinking». anthropic.com/claude-sonnet-5-5: «Claude Code Default Effort: Medium». `ONIA_MODELOS_CLAUDE_Y_CUOTA.md`: «Fable para lo que Opus con effort alto no alcanza».

Si tu Claude Code ya usa los modelos cinco punto cinco, ahora piensa un nivel menos que antes. Y casi nadie se dio cuenta.

La perilla se llama esfuerzo: cuánto razona antes de responder. La documentación de Anthropic, lo que ves en pantalla, dice que Opus y Sonnet cinco punto cinco vienen en medium. Los anteriores venían en high.

Para ver en cuál estás, escribí barra effort. Te abre cinco niveles: low, medium, high, xhigh y max.

Mi tabla. Low, para lo mecánico: renombrar, mover archivos. Medium, para el día a día. High o xhigh, cuando la primera respuesta no alcanzó. Max, casi nunca: la documentación dice que tiende a pensar de más.

En mi empresa hay una regla: al modelo más caro se pasa solo cuando Opus, con esfuerzo alto, no alcanzó. Primero la perilla, después el modelo.

¿Cómo sabés si te conviene? Misma tarea, en medium y en high. Si en high la corregís menos, esa tarea va en high.

Comentá EFFORT y te paso mi tabla.

---

### D02-B · Vertical · Desde el 1 de octubre, tu bot de WhatsApp paga por cada respuesta
**Veredicto:** ARREGLADA (condicionada: verificar la página de Meta antes de grabar) · **Fecha:** libre dentro de la ventana; lo ideal es jue 1-oct o lo antes posible. Ya no dice «desde hoy». · **Demuestra:** la página de precios de Meta en pantalla y la cuenta en tres pasos con los mensajes de tu propio bot · **Cierre:** comunidad, drop 2 «La cuenta de WhatsApp» (escrito, pero **hay que corregirlo**: ver Pendientes)
**Cambios:**
- «Desde hoy, uno de octubre» pasa a «Desde el uno de octubre»: no depende del día de publicación.
- **Error de contenido corregido.** El guion decía «si todavía no figura la de servicio, no la inventes». Según varias fuentes coincidentes, el mensaje de servicio se cobra **a la misma tarifa que utilidad**, y **cada número tiene mil mensajes de servicio gratis por mes**. Sin ese dato, la cuenta del espectador sale mal y el titular («cada respuesta tiene precio») exagera. Se agregó el paso «restale mil».
- Quitado «Yo tengo un bot de ventas. La cuenta es esta:»: prometía una cuenta propia que el guion nunca muestra. Una cifra real del bot de ONIA solo entra si Sergio Urcullo la mide antes de grabar.
- Quitada la mención a los mensajes de utilidad dentro de la ventana. Complicaba la cuenta y no se pudo verificar si cuentan dentro de los mil gratis.
- Agregada la verificación: si la cuenta da cero, estás dentro de lo gratis.
**Evidencia verificada:** **no verificado en la fuente primaria**: developers.facebook.com está bloqueado desde este entorno. Una búsqueda web confirma el título de la página citada («Upcoming pricing updates for Meta Business Agent, service and utility messages») y que el cambio rige desde el 1-oct-2026. Varias fuentes secundarias que coinciden (360dialog, respond.io, sendpulse, Zendesk, Wati, YCloud) dicen: cobro por mensaje de servicio a la tarifa de utilidad del mercado; mil mensajes de servicio entregados gratis por mes y por número, sin acumulación; las reacciones no se cobran. Ojo: `PRODUCCION-GUIONES-2026-09-29.md` dice que el 28-sep la página oficial «no lo confirma para LatAm», y el radar del 29-sep sí lo da por vigente. **Antes de grabar, Sergio Urcullo abre la página de Meta y confirma dos frases: «misma tarifa que utility» y «1,000 free».** Si alguna no está, se corta esa frase del guion.

Desde el uno de octubre, las respuestas de tu bot de WhatsApp se cobran. Pero no todas.

Es para bots en la plataforma oficial de Meta, la API. La app de WhatsApp Business que usás a mano no cambia.

Lo que cambia: los mensajes de servicio, los que tu bot contesta dentro de las veinticuatro horas desde que el cliente escribió, eran gratis. Ahora se cobran por mensaje, a la misma tarifa que los de utilidad. Los primeros mil de cada mes, por número, siguen gratis.

Hacé la cuenta así.

Uno. Contá cuántos mensajes mandó tu bot el mes pasado. Tres mensajes seguidos son tres.

Dos. Restale mil.

Tres. En la página de precios de Meta, lo que ves en pantalla, bajá la tabla en dólares y buscá la tarifa de utilidad del país de tu cliente. Bolivia está en «resto de Latinoamérica». Multiplicá.

Si te dio cero, estás dentro de lo gratis. Si no, tu bot habla de más: juntá mensajes.

La planilla está en la comunidad.

---

### D02-C · Vertical · Cómo encontrar el costo escondido de un presupuesto
**Veredicto:** DESCARTAR (de este lote) · **Fecha:** — · **Demuestra:** el prompt anti costo escondido sobre las tres propuestas · **Cierre:** comunidad (existe: `drops/2026-10-01.md`)
**Cambios:** no se reescribe. Hay tres razones:
1. **Repite el ejemplo de D01-C**: las mismas tres propuestas, los mismos Bs 700 y Bs 1060 y los mismos Bs 360. La prueba de las tres propuestas es la única demostración real del YouTube, así que se queda en D01-C.
2. **Arruina el reto de la comunidad.** Estaba en el jue 1-oct, el mismo día que el reto («¿cuál cumple?», 19:05), y su primera frase da la respuesta («en realidad son mil sesenta»). La respuesta del reto sale el vie 2-oct.
3. Su enseñanza («citá el dato que usaste» y «no inventes condiciones») ya llega entera a la comunidad en el mensaje 3 del drop del 2-oct.
Si Sergio Urcullo lo quiere igual, se mueve a la semana 3 (desde el mié 14-oct, fuera de esta ventana), con **un presupuesto real suyo** (hosting, dominio, proveedor) en lugar de las tres propuestas del reto.
**Evidencia verificada:** `PRODUCCION-GUIONES-2026-09-29.md` §Prueba 1 (los números son reales). `drops/2026-10-01.md` mensajes 2 y 3 (reto y respuesta con el mismo caso). `MAPA.md:86` (D02-C estaba el jue 1-oct).

*(sin texto: descartada)*

---

### D03-A · Vertical · El hook que commitea solo, y la guarda que le puse después de romperlo
**Veredicto:** ARREGLADA · **Fecha:** libre · **Demuestra:** el bloque Stop de `.claude/settings.json` y los dos comandos git de la guarda, más la prueba de que la guarda frena · **Cierre:** comunidad, drop 3 «Hook Stop + guarda» (escrito en S1; falta publicarlo)
**Cambios:**
- La verificación solo comprobaba que el hook existe (`/hooks`), no que la guarda funciona, que es el tema del video. Agregada la prueba real: provocar un conflicto en un repo de prueba y ver que el script no toca nada. Así se probó el 29-sep.
- «antes de que existiera la página» pasa a «antes de que existiera el código que los usaba». El incidente del 23-ago fue CSS antes del markup, no de una página entera.
- «Mi hook marcó diecisiete archivos…» pasa a «Mi hook de Claude Code tomó diecisiete archivos con conflictos, los dio por resueltos y los subió». Técnicamente fue el `add -A` del script. Lo que se afirma sigue igual.
- Quitada la pregunta retórica del cierre («¿Tu automatización sabe cuándo no actuar?»), que duplicaba la llamada a la acción.
**Evidencia verificada:** `.claude/settings.json`: `hooks.Stop[0].hooks[0] = {type: command, command: "node scripts/git-autosync.js"}` ✓. `scripts/git-autosync.js:68-77`: `rev-parse -q --verify MERGE_HEAD` y `diff --name-only --diff-filter=U`, y si alguno devuelve algo, «omito TODO» ✓. `CLAUDE.md` §«Git — auto-sync»: 20-ago, 17 archivos con marcadores y fast-forward a main (el CI lo contuvo); 23-ago, 217 líneas de CSS antes del markup ✓. code.claude.com/docs/en/hooks: Stop se dispara «when Claude finishes responding» y `/hooks` lista los hooks configurados ✓.

Mi hook de Claude Code tomó diecisiete archivos con conflictos, los dio por resueltos y los subió a mi rama principal. Así se arma bien.

Paso uno. En punto claude, barra, settings punto json, copiá lo que ves en pantalla: hooks, adentro Stop, y un hook de tipo command con tu script de commit.

Paso dos. Stop corre cuando Claude termina su turno, no cuando terminó el trabajo. Por eso otro día me publicó doscientas diecisiete líneas de estilos antes que el código que las usaba.

Paso tres, el que decide todo: la guarda. Antes de commitear, tu script corre dos comandos de git, en pantalla. Uno pregunta si hay un merge a medias. El otro lista archivos en conflicto. Si cualquiera devuelve algo, no toca nada.

Para comprobarlo: barra hooks en Claude Code, y tu Stop tiene que aparecer. Después, en un repo de prueba, armá un conflicto a propósito y corré tu script: tiene que avisar y no commitear.

El JSON y la guarda están en la comunidad.

---

### D03-B · Vertical · Claude Code ya lee AGENTS.md, pero no si tenés los dos
**Veredicto:** ARREGLADA (cambio menor) · **Fecha:** libre. «Ahora» se sostiene: salió el 18-sep y es la versión vigente. · **Demuestra:** la tabla de la doc oficial (qué lee según qué archivos tenés) y el import `@AGENTS.md` en la primera línea · **Cierre:** comentá AGENTS, drop 11 (escrito en S1; Sergio Urcullo lo manda a mano por DM)
**Cambios:**
- Recortado a menos de 170 palabras. La verificación es la pregunta a Claude por una regla que solo está en AGENTS.md. Si hace falta, el editor muestra `/memory` en pantalla sin locución.
- «Es mi caso» se mantiene, pero ⚠️ en ONIA el arreglo **todavía no está aplicado**: `CLAUDE.md` no importa `AGENTS.md` (grep del 30-sep, cero coincidencias). El guion no dice que ya lo arregló. Si Sergio Urcullo aplica el `@AGENTS.md` antes de grabar, puede mostrarlo y agregar «ya lo cambié». Ver Pendientes.
**Evidencia verificada:** code.claude.com/docs/en/memory §AGENTS.md: sin CLAUDE.md lee AGENTS.md; con los dos, «Your CLAUDE.md files only»; requiere v2.1.277; `@AGENTS.md` al tope de CLAUDE.md y debajo lo propio de Claude; en Windows, import y no symlink (Git lo clona como texto plano sin `core.symlinks`) ✓. Repo: `CLAUDE.md` 488 líneas (no 482: creció desde el 29-sep), `AGENTS.md` 218 líneas, sus reglas son distintas (orquestación, política de modelos, data-first) y `grep "@AGENTS" CLAUDE.md` da vacío ✓.

Claude Code ahora lee AGENTS punto md, el archivo de instrucciones que usa Codex. Pero hay una trampa.

Solo lo lee si tu proyecto no tiene CLAUDE punto md. Si tenés los dos, lee CLAUDE y el otro lo ignora.

Es mi caso. En ONIA uso Claude Code y Codex en el mismo repositorio, y tengo los dos archivos, con reglas distintas. Cada uno lee solo el suyo: lo que le enseño a uno, el otro no lo sabe.

La solución está en la documentación de Anthropic, lo que ves en pantalla. Las reglas compartidas van en AGENTS punto md. En la primera línea de CLAUDE punto md escribís arroba AGENTS punto md: eso lo importa entero. Y abajo ponés solo lo que es de Claude.

En Windows, usá esa línea y no un enlace simbólico: al clonar se rompe.

Para comprobarlo, preguntale a Claude una regla que solo está en AGENTS. Si la sabe, lo está leyendo.

Comentá AGENTS y te paso la plantilla.

---

### D03-C · YouTube · Un CLAUDE.md donde cada regla trae su historia
**Veredicto:** ARREGLADA (cambios menores) · **Fecha:** libre · **Demuestra:** tres reglas reales del CLAUDE.md de ONIA con su historia en pantalla, más tres pruebas (`/context`, preguntar el porqué, pedir lo prohibido) · **Cierre:** comunidad, drop 4 «Plantilla de regla con historia» (escrito en S1; falta publicarlo)
**Cambios:**
- «cuatrocientas ochenta y dos líneas» pasa a «casi quinientas líneas»: hoy son 488 y el archivo sigue creciendo. Un número exacto va a estar mal el día que se publique.
- Quitado «Si tenés una versión reciente de Claude Code». Queda la versión exacta de la doc (dos punto uno punto doscientos ochenta y tres) y lo que hace el comando.
- Precisado «los precios viven en el código»: son dos archivos, uno para planes y otro para agregados. Lo pide el propio «segundo error» del video, que si no contradice al paso dos.
- El resto se deja tal cual: está verificado y cumple las siete condiciones.
**Evidencia verificada:** `CLAUDE.md`: la frase «una regla sin su historia se desobedece; con la historia, no» está en la cabecera ✓; cinco partes ordenadas por cuándo se necesitan ✓; «Una sola fuente de verdad» con 2026-08-15, cuatro precios (código, cotizador público, propuestas firmables, one-pager) y 95 documentos ✓; «Corregido 2026-08-20» (decía `pricing.ts` a secas, y son dos archivos) ✓; «La venta nunca exhibe obra» con la cita del 2026-08-20 y los cinco «muy pronto» ✓; «Canario», 2026-09-04, con su límite («se reinyecta en cada pedido… si fallo teniéndola delante… dejé de leer») ✓; 488 líneas hoy. code.claude.com/docs/en/memory: menos de 200 líneas, `/init`, `/context` → «Memory files», los procedimientos de varios pasos van a una skill, `/doctor prompt-audit` desde v2.1.283, «nothing in your files changes until you ask» ✓.

#### Resultado primero

Este es el archivo que Claude Code lee antes de hacer cualquier cosa en mi empresa. Se llama CLAUDE punto md. Tiene reglas, como cualquier otro. Pero cada regla trae algo que casi nadie pone: la historia de por qué existe.

Una regla sola dice «no hagas esto». Una regla con historia dice «no hagas esto, porque tal día pasó esto otro y costó esto». Arriba de todo, mi archivo lo dice en una frase: una regla sin su historia se desobedece; con la historia, no.

En este video te muestro cómo escribir el tuyo, con tres reglas reales de ONIA, una regla tonta que te avisa cuando la sesión se está degradando, y dos errores que cometí yo en este mismo archivo.

#### Por qué importa

Claude Code arranca cada sesión sin memoria. Lo único que trae de tu proyecto es lo que le dejaste escrito en ese archivo.

Si le escribís «no inventes precios», lo va a leer. Pero en una sesión larga, con veinte cosas en la cabeza, una orden seca pesa lo mismo que cualquier otra línea. Cuando la regla viene con el daño que evita, Claude entiende qué está protegiendo, y la puede aplicar a un caso que vos no previste.

Y hay un segundo motivo, más humano. Dentro de tres meses vos tampoco te vas a acordar de por qué pusiste esa regla. Y una regla que nadie sabe por qué existe, alguien la borra.

#### Paso uno: dónde va y cómo se ordena

El archivo va en la raíz de tu proyecto y se llama CLAUDE, en mayúsculas, punto md. Si todavía no tenés uno, abrí Claude Code en la carpeta y escribí barra init: te arma un borrador leyendo tu código.

Después, ordenalo por cuándo se necesita, no por tema. El mío tiene cinco partes. Primero, lo que vale al arrancar cada sesión. Segundo, las tres reglas que más se rompen. Después, producto y marca. Después, cómo se trabaja. Y al final, el detalle de cada área.

Lo que se lee primero pesa más. Así que arriba va lo que se rompe seguido.

#### Paso dos: la forma de cada regla

Cada regla tiene tres partes. Un título que dice REGLA. Una línea con quién la pidió, cuándo, y qué pasó. Y las instrucciones, cortas y que se puedan verificar.

Te muestro la primera. Se llama «una sola fuente de verdad por tema».

La historia: el quince de agosto encontramos cuatro precios distintos del mismo producto, el chatbot. Uno en el código, otro en un cotizador público, otro en propuestas que ya se podían firmar y otro en un folleto. Y noventa y cinco documentos hablando de precios. Con eso, cualquier sesión de Claude podía elegir cualquiera.

La regla: los precios viven en el código, en archivos que la regla nombra, y todo lo demás los lee de ahí. Si un documento dice otro número, está roto.

Fijate que la historia no es decoración. Le dice a Claude exactamente qué error evitar: copiar un precio de un documento cualquiera.

#### Paso tres: una regla que sale de una corrección tuya

La segunda nació de una frase mía, que quedó citada textual. El veinte de agosto la página de venta tenía cinco carteles de «muy pronto». Y yo le dije a Claude, más o menos: eso hace escapar a los clientes, porque les hace creer que el sistema no funciona. Como regla, nunca hagas eso.

La regla quedó así: en todo lo que ve un cliente está prohibido mostrar obra. Nada de «muy pronto», nada de «beta», nada de «en construcción». Lo que no está listo, no se nombra.

Cuando la regla trae tu frase, Claude no tiene que adivinar qué quisiste decir. Y si mañana aparece un «próximamente», que no estaba en la lista, lo saca igual, porque entendió el motivo.

#### Paso cuatro: el canario

La tercera es la más rara. Mi archivo dice: llamalo siempre Sergio Urcullo, con nombre y apellido.

No es vanidad. Es un canario, como el que llevaban los mineros: si el pájaro dejaba de cantar, había algo mal en el aire. Si Claude deja de llamarme así, dejó de leer sus instrucciones, y es hora de abrir una sesión nueva.

Y su límite también está escrito. Esa regla se vuelve a cargar en cada pedido, así que no sirve para detectar que se perdió el contexto. Detecta algo peor: si falla teniéndola delante, no se olvidó. Dejó de leer.

#### La prueba

¿Cómo sabés que tu archivo funciona? Tres pruebas.

Una. Abrí Claude Code y escribí barra context. En archivos de memoria tiene que aparecer tu CLAUDE punto md. Si no está, Claude no lo ve.

Dos. Preguntale por qué existe una de tus reglas. Si te cuenta la historia, la leyó.

Tres. Pedile justo lo que la regla prohíbe. Con la mía sería: agregá un «muy pronto» en una pantalla de venta. Lo que tiene que pasar es que se niegue y te cite la regla. Si lo hace sin chistar, la regla está mal escrita o está enterrada.

#### El error común, en mi propio archivo

Primer error. Mi CLAUDE punto md tiene casi quinientas líneas. La documentación de Anthropic recomienda menos de doscientas, porque un archivo largo ocupa más contexto y se sigue peor. Por eso el mío está ordenado por cuándo se necesita. Pero si arrancás hoy, no copies mi largo: copiá la forma. Lo que es un procedimiento de muchos pasos va en una skill, que solo se carga cuando hace falta.

Segundo error: una regla mal escrita es peor que no tener regla. La de precios decía al principio que mandaba un solo archivo. Era falso: hay dos, uno para los planes y otro para los agregados. Durante días mandó a cada sesión al archivo equivocado. Cuando mi agente la corrigió, dejó la corrección escrita adentro, con fecha. Así la próxima sesión sabe que ahí hubo un error y no vuelve a caer.

Desde la versión dos punto uno punto doscientos ochenta y tres de Claude Code, escribí barra doctor, espacio, prompt guion audit. Revisa tus archivos y te marca reglas viejas o que se contradicen. No cambia nada hasta que se lo pedís.

#### Cierre

Hacé esto hoy: acordate de la última vez que Claude te hizo algo mal dos veces. Escribí la regla, y arriba, en una línea, qué pasó y cuándo.

La plantilla de regla con historia está en la comunidad de WhatsApp. El link está en mi web.

---

## Pendientes del lote

**Drops que tienen que estar publicados ANTES del video correspondiente** (todos escritos en S1 «Drops de la semana», ninguno enviado todavía):
- Drop 1 (D01-B), planilla Sonnet vs Opus.
- Drop 3 (D03-A), hook Stop y guarda. Conviene sumarle una línea con la prueba del conflicto: `git init` en una carpeta de prueba, dos ramas que tocan la misma línea, `git merge` y después correr el script, que tiene que imprimir el aviso y no commitear.
- Drop 4 (D03-C), plantilla de regla con historia.
- Drop 11 (D03-B), AGENTS por DM.
- Prompt de las tres propuestas (D01-C): ya está preparado en `drops/2026-10-01.md`, mensaje 2 (jue 1-oct 19:05).

**Falta escribir:**
- **Drop EFFORT (D02-A).** No figura en «Drops de la semana» de S1. Solo existe una línea en `PRODUCCION-GUIONES-2026-09-29.md` («low mecánico · medium diario · high/xhigh cuando la primera no alcanzó · max casi nunca»). Hay que escribirlo como drop formal, con: `claude --effort <nivel>`, `/effort` (Enter guarda como default del modelo, `s` solo para la sesión), el default medium en los modelos cinco punto cinco y la regla «Fable solo si Opus en high no alcanzó».
- **Drop 2 (D02-B) hay que corregirlo.** Hoy dice «columnas: utility, y service cuando Meta la publique». Tiene que decir que servicio se cobra a la tarifa de utility y que hay mil mensajes de servicio gratis por mes y por número (costo = (mensajes de servicio − 1.000, mínimo 0) × tarifa utility). Antes, verificarlo en la página de Meta.

**Riesgos:**
1. **D02-B, fuente primaria sin verificar.** Meta está bloqueado desde este entorno. Los mil mensajes gratis y la «misma tarifa que utility» salen de fuentes secundarias que coinciden, y el 28-sep otra sesión anotó que la página «no lo confirma para LatAm». Sergio Urcullo abre la página antes de grabar. Si no lo dice, se cortan esas frases o no se publica.
2. **D01-C: fecha y reto.** Da los totales del reto de la comunidad. Tiene que salir desde el sáb 3-oct, nunca antes de la respuesta del vie 2-oct 19:00.
3. **D03-B: el arreglo no está aplicado en ONIA.** `CLAUDE.md` no importa `AGENTS.md`. Si se publica un video que enseña el arreglo y el repo propio sigue igual, la próxima pieza que cite el repo lo va a contradecir. Propuesta (decide Sergio Urcullo; esta auditoría no toca el repo): aplicar el import antes de grabar, sabiendo que suma las 218 líneas de AGENTS.md al contexto de cada sesión de Claude, que ya pasa las doscientas recomendadas.
4. **Web `/claude-code` sin verificar en vivo** (bloqueada desde acá). El código fuente tiene las secciones que citan D01-A y D03-C. Abrirla y mirarla renderizada antes de publicar D01-A.
5. **Dos piezas del mismo tema cerca.** D01-B (vertical) y D01-C (YouTube) cuentan la misma noticia con ejemplos distintos (la cuota del 10-sep y la prueba de las propuestas). No es repetición de ejemplo, pero conviene separarlas dos o tres días, o que el vertical salga primero.
6. **D02-C descartada:** el jueves 1-oct queda con un hueco. Si hace falta rellenarlo, sacar algo del banco que no use el caso de las propuestas.
