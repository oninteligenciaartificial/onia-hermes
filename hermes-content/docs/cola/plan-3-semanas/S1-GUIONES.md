# Semana 1 — «Claude Code: que trabaje para vos» · guiones

Mié 30-sep → mar 6-oct-2026. Calendario: [`MAPA.md`](MAPA.md) §4. Vara y formato:
[`BRIEF-ESCRITOR.md`](BRIEF-ESCRITOR.md). Evidencia: `references/marca-personal/INVENTARIO-CONOCIMIENTO-ONIA.md`
y `RADAR-ACTUALIDAD-2026-09-29.md`. Fuentes externas re-leídas el 29-sep-2026.

Solo lo que se dice a cámara va en texto corrido. Las líneas **Evidencia** son para el editor.
Los recursos de cada cierre están al final, en **Drops de la semana**: se publican ANTES que el video.

---

## Mié 30-sep

### D01-A · Vertical · Tu primera skill de Claude Code en un minuto
**Fórmula:** F7 Receta en N pasos · **Pilar:** Claude Code · **Destino:** web `/claude-code`

→ Guion listo en `GUIONES-PARA-GRABAR-2026-09-29.md`, «Vertical 6 — Tu primera skill de Claude Code en un minuto».

### D01-B · Vertical · Salió Sonnet 5.5: la prueba de tres tareas para saber si te sirve
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** Claude Code · **Destino:** comunidad (drop 1)
**Evidencia:** https://www.anthropic.com/claude-sonnet-5-5 (28-sep, USD 2/10, «two points below Opus 5.5 on GDPval-AA») · https://www.anthropic.com/claude-opus-5-5 (USD 4/20) · `hermes-content/docs/ONIA_MODELOS_CLAUDE_Y_CUOTA.md` (límite semanal agotado el 10-sep, un solo tanque) · `--model` / `--effort` en CLI 2.1.267. Reemplaza a «Vertical 1».

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

### D01-C · YouTube · Opus 5.5 o Sonnet 5.5: cuál usar y cómo cambiarlo en Claude Code
**Fórmula:** F2 (horizontal) · **Pilar:** Claude Code · **Destino:** comunidad + web `/claude-code`

→ Guion listo en `GUIONES-PARA-GRABAR-2026-09-29.md`, «YouTube — Opus 5.5 o Sonnet 5.5: cuál usar y cómo cambiarlo en Claude Code».

---

## Jue 1-oct

### D02-A · Vertical · La perilla de Claude Code que casi nadie toca
**Fórmula:** F4 Misma tarea, varios niveles · **Pilar:** Claude Code · **Destino:** comentá EFFORT

→ Guion listo en `GUIONES-PARA-GRABAR-2026-09-29.md`, «Vertical 4 — La perilla de Claude Code que casi nadie toca».

### D02-B · Vertical · Desde hoy, tu bot de WhatsApp paga por cada respuesta
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** Automatización y WhatsApp · **Destino:** comunidad (drop 2)
**Evidencia:** https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages («Effective October 1, 2026, Meta will charge on a per-message basis for service messages» y utility «within an open 24-hour customer service window») · https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing (cobro por código de país del destinatario; Bolivia +591 en «Rest of Latin America»; tablas CSV/PDF en USD, vigentes desde 1-jul-2026). NO se dice tarifa de Bolivia.

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
**Fórmula:** F1 Resultado primero → cómo → comprobación · **Pilar:** Negocio · **Destino:** comunidad

→ Guion listo en `GUIONES-PARA-GRABAR-2026-09-29.md`, «Vertical 2 — Cómo encontrar el costo escondido de un presupuesto».

---

## Vie 2-oct

### D03-A · Vertical · El hook que commitea solo, y la guarda que le puse después de romperlo
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** Claude Code · **Destino:** comunidad (drop 3)
**Evidencia:** `.claude/settings.json` (hook Stop) · `scripts/git-autosync.js:68-77` (guarda `MERGE_HEAD` + `diff --diff-filter=U`; los dos comandos probados con un conflicto real en repo de prueba el 29-sep) · `CLAUDE.md` «Git — auto-sync» (20-ago: 17 archivos con marcadores `<<<<<<<` marcados como resueltos y llevados a `main`; 23-ago: 217 líneas de CSS antes del markup) · `/hooks` en https://code.claude.com/docs/en/costs. Reemplaza a «Vertical 5».

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

### D03-B · Vertical · Claude Code ya lee AGENTS.md, pero no si tenés los dos
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** Claude Code · **Destino:** comentá AGENTS (drop 11)
**Evidencia:** https://code.claude.com/docs/en/changelog (v2.1.277: «in a project with no CLAUDE.md, Claude Code reads AGENTS.md instead») · https://code.claude.com/docs/en/memory §AGENTS.md (con los dos lee solo CLAUDE.md; `@AGENTS.md` como import; en Windows import, no symlink) · repo: `CLAUDE.md` (482 líneas) y `AGENTS.md` (218 líneas) conviven y `CLAUDE.md` no lo importa (grep 29-sep).

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

### D03-C · YouTube · Un CLAUDE.md donde cada regla trae su historia
**Fórmula:** F1 Resultado primero → cómo → comprobación → siguiente paso (horizontal, con casos en F3) · **Pilar:** Claude Code · **Destino:** comunidad (drop 4)
**Evidencia:** `CLAUDE.md` raíz: «Una sola fuente de verdad» (15-ago: cuatro precios del chatbot, 95 docs; corregido 20-ago), «La venta nunca exhibe obra» (20-ago: cinco «muy pronto»), «Canario» (4-sep, con su límite); 482 líneas medidas el 29-sep · https://code.claude.com/docs/en/memory (menos de 200 líneas, `/init`, `/context`, `/doctor prompt-audit` desde v2.1.283). En pantalla solo esas tres reglas: no hacer scroll por precios ni VPS.

#### Resultado primero

Este es el archivo que Claude Code lee antes de hacer cualquier cosa en mi empresa. Se llama
CLAUDE punto md. Tiene reglas, como cualquier otro. Pero cada regla trae algo que casi nadie
pone: la historia de por qué existe.

Una regla sola dice «no hagas esto». Una regla con historia dice «no hagas esto, porque tal día
pasó esto otro y costó esto». Arriba de todo, mi archivo lo dice en una frase: una regla sin su
historia se desobedece; con la historia, no.

En este video te muestro cómo escribir el tuyo, con tres reglas reales de ONIA, una regla tonta
que te avisa cuando la sesión se está degradando, y dos errores que cometí yo en este mismo
archivo.

#### Por qué importa

Claude Code arranca cada sesión sin memoria. Lo único que trae de tu proyecto es lo que le
dejaste escrito en ese archivo.

Si le escribís «no inventes precios», lo va a leer. Pero en una sesión larga, con veinte cosas
en la cabeza, una orden seca pesa lo mismo que cualquier otra línea. Cuando la regla viene con
el daño que evita, Claude entiende qué está protegiendo, y la puede aplicar a un caso que vos no
previste.

Y hay un segundo motivo, más humano. Dentro de tres meses vos tampoco te vas a acordar de por qué
pusiste esa regla. Y una regla que nadie sabe por qué existe, alguien la borra.

#### Paso uno: dónde va y cómo se ordena

El archivo va en la raíz de tu proyecto y se llama CLAUDE, en mayúsculas, punto md. Si todavía
no tenés uno, abrí Claude Code en la carpeta y escribí barra init: te arma un borrador leyendo tu
código.

Después, ordenalo por cuándo se necesita, no por tema. El mío tiene cinco partes. Primero, lo
que vale al arrancar cada sesión. Segundo, las tres reglas que más se rompen. Después, producto
y marca. Después, cómo se trabaja. Y al final, el detalle de cada área.

Lo que se lee primero pesa más. Así que arriba va lo que se rompe seguido.

#### Paso dos: la forma de cada regla

Cada regla tiene tres partes. Un título que dice REGLA. Una línea con quién la pidió, cuándo, y
qué pasó. Y las instrucciones, cortas y que se puedan verificar.

Te muestro la primera. Se llama «una sola fuente de verdad por tema».

La historia: el quince de agosto encontramos cuatro precios distintos del mismo producto, el
chatbot. Uno en el código, otro en un cotizador público, otro en propuestas que ya se podían
firmar y otro en un folleto. Y noventa y cinco documentos hablando de precios. Con eso,
cualquier sesión de Claude podía elegir cualquiera.

La regla: los precios viven en el código, y todo lo demás los lee de ahí. Si un documento dice
otro número, está roto.

Fijate que la historia no es decoración. Le dice a Claude exactamente qué error evitar: copiar
un precio de un documento cualquiera.

#### Paso tres: una regla que sale de una corrección tuya

La segunda nació de una frase mía, que quedó citada textual. El veinte de agosto la página de
venta tenía cinco carteles de «muy pronto». Y yo le dije a Claude, más o menos: eso hace escapar
a los clientes, porque les hace creer que el sistema no funciona. Como regla, nunca hagas eso.

La regla quedó así: en todo lo que ve un cliente está prohibido mostrar obra. Nada de «muy
pronto», nada de «beta», nada de «en construcción». Lo que no está listo, no se nombra.

Cuando la regla trae tu frase, Claude no tiene que adivinar qué quisiste decir. Y si mañana
aparece un «próximamente», que no estaba en la lista, lo saca igual, porque entendió el motivo.

#### Paso cuatro: el canario

La tercera es la más rara. Mi archivo dice: llamalo siempre Sergio Urcullo, con nombre y
apellido.

No es vanidad. Es un canario, como el que llevaban los mineros: si el pájaro dejaba de cantar,
había algo mal en el aire. Si Claude deja de llamarme así, dejó de leer sus instrucciones, y es
hora de abrir una sesión nueva.

Y su límite también está escrito. Esa regla se vuelve a cargar en cada pedido, así que no sirve
para detectar que se perdió el contexto. Detecta algo peor: si falla teniéndola delante, no se
olvidó. Dejó de leer.

#### La prueba

¿Cómo sabés que tu archivo funciona? Tres pruebas.

Una. Abrí Claude Code y escribí barra context. En archivos de memoria tiene que aparecer tu
CLAUDE punto md. Si no está, Claude no lo ve.

Dos. Preguntale por qué existe una de tus reglas. Si te cuenta la historia, la leyó.

Tres. Pedile justo lo que la regla prohíbe. Con la mía sería: agregá un «muy pronto» en una
pantalla de venta. Lo que tiene que pasar es que se niegue y te cite la regla. Si lo hace sin
chistar, la regla está mal escrita o está enterrada.

#### El error común, en mi propio archivo

Primer error. Mi CLAUDE punto md tiene cuatrocientas ochenta y dos líneas. La documentación de
Anthropic recomienda menos de doscientas, porque un archivo largo ocupa más contexto y se sigue
peor. Por eso el mío está ordenado por cuándo se necesita. Pero si arrancás hoy, no copies mi
largo: copiá la forma. Lo que es un procedimiento de muchos pasos va en una skill, que solo se
carga cuando hace falta.

Segundo error: una regla mal escrita es peor que no tener regla. La de precios decía al
principio que mandaba un solo archivo. Era falso: hay dos, uno para los planes y otro para los
agregados. Durante días mandó a cada sesión al archivo equivocado. Cuando mi agente la corrigió,
dejó la corrección escrita adentro, con fecha. Así la próxima sesión sabe que ahí hubo un error y no
vuelve a caer.

Si tenés una versión reciente de Claude Code, escribí barra doctor, espacio, prompt guion audit.
Revisa tus archivos y te marca reglas viejas o que se contradicen. No cambia nada hasta que se lo
pedís.

#### Cierre

Hacé esto hoy: acordate de la última vez que Claude te hizo algo mal dos veces. Escribí la
regla, y arriba, en una línea, qué pasó y cuándo.

La plantilla de regla con historia está en la comunidad de WhatsApp. El link está en mi web.

---

## Sáb 3-oct

### D04-A · Vertical · Retiré seis de mis nueve subagentes, y seguían apareciendo
**Fórmula:** F3 Caso real → error → por qué → corrección → regla · **Pilar:** Claude Code · **Destino:** web `/claude-code` (sección «Que trabaje sin vos»)
**Evidencia:** `.claude/agents/_retirados/README.md` (6 retirados el 18-ago, motivo por agente; uno «verificado 2026-07-03», otro con herramientas inexistentes) · `hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md` (casos (a) paralelo y (b) mente fresca) · `.claude/skills/onia-router/SKILL.md` (siguen apareciendo porque el descubrimiento es recursivo).

Tenía nueve subagentes en Claude Code. Retiré seis. Y los seis seguían apareciendo.

Un subagente es otro Claude al que le delegás una tarea. Arranca limpio y te devuelve un
resultado.

El dieciocho de agosto mi agente auditó los nueve. Seis repetían reglas o skills que ya
existían. Entre ellos, uno tenía un estado congelado: «verificado el tres de julio». Otro pedía
herramientas que no existen. Copias esperando desincronizarse.

La regla que quedó: un subagente se justifica en dos casos. Uno, mucho trabajo en paralelo, como
investigar diez fuentes a la vez. Dos, una mente fresca que revisa sin el contexto del que
escribió. Si no es ninguno de los dos, es una skill.

Y la trampa: los moví a una carpeta de retirados, dentro de punto claude barra agents. Claude
Code busca también en las subcarpetas. Retirar es sacarlos de esa carpeta.

Para comprobarlo, abrí esa carpeta: cada archivo es un subagente que Claude puede llamar.

La guía está en mi web, en la sección de Claude Code.

### D04-B · Vertical · Cada skill que instalás te cobra contexto: medilo con /skill-doctor
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** Claude Code · **Destino:** comunidad (drop 5)
**Evidencia:** https://code.claude.com/docs/en/whats-new/2026-w36 (`/skill-doctor`, semana 31-ago a 4-sep, v2.1.252+) · https://code.claude.com/docs/en/skills («Find unused skills»; `skillOverrides` on / name-only / user-invocable-only / off; el listado usa el 1 % del contexto y, si no entra, borra descripciones de las menos usadas; `/doctor` estima su costo) · `.claude/skills/onia-router/SKILL.md` (196 skills globales + 9 plugins). Recontar con `/skill-doctor` el día de grabar: si cambió, se dice el número de pantalla.

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
**Fórmula:** F3 Caso real → error → por qué → corrección → regla · **Pilar:** Errores reales · **Destino:** comunidad (drop 6)
**Evidencia:** `CLAUDE.md` «Verificar es MIRAR» (login de producción con los nombres de los iconos como texto, «verificado» con HTTP 200 y grep; lo encontró Sergio Urcullo; fuente de iconos de 3,9 MB y 117 s) · `scripts/canario_visual.mjs` (captura por viewport, nunca página entera) · `npx playwright screenshot [options] <url> <filename>` leído de `--help` en Playwright 1.62.1; requiere `npx playwright install chromium` antes (sin eso falla, visto el 29-sep).

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

---

## Dom 4-oct

### D05-A · Vertical · Dos sesiones de Claude Code en el mismo proyecto, sin pisarse
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** Claude Code · **Destino:** comunidad (drop 12)
**Evidencia:** `CLAUDE.md` «Carriles» (1 carril = 1 sesión = 1 worktree = 1 rama) · memoria `git-en-worktree-usar-git-C.md` (1-sep: la terminal volvió sola al checkout principal y un `reset --hard` pensado para otro worktree movió una rama 424 commits; recuperada por reflog) · `git worktree add -b` / `list` / `git -C` probados en repo de prueba el 29-sep · `-w, --worktree [name]` en CLI 2.1.267.

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
**Fórmula:** F2 Noticia → qué cambia para vos → probalo así · **Pilar:** Contenido con IA · **Destino:** web `/claude-code` (video 01, «Claude y Claude Code no son lo mismo»)
**Evidencia:** https://support.claude.com/en/articles/12138966-release-notes (16-sep: «Artifacts, including Claude Design, Claude Slides, and Claude Docs, are available on every plan, including Free»; se piden «in any conversation» y se editan ahí). Grabar la demo en una cuenta Free real, pegando el texto de `sergiourcullo.vercel.app/claude-code`; si la demo no sale, no se publica.

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
**Fórmula:** F3 Caso real → error → por qué → corrección → regla · **Pilar:** Errores reales · **Destino:** comunidad

→ Guion listo en `GUIONES-PARA-GRABAR-2026-09-29.md`, «Vertical 9 — Mi agente me dijo que quedaban 2. Había 44 activos».

---

## Lun 5-oct

### D06-A · Vertical · Antes de cerrar la sesión: el handoff de siete campos
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** Claude Code · **Destino:** comunidad (drop 7)
**Evidencia:** `hermes-content/docs/handoff/README.md` (plantilla de 7 campos; compactación del 22-ago «fiel y larguísima», todo con el mismo peso) · `CLAUDE.md` «Cambio de sesión → handoff completo» (4-sep: un port de panel con cero commits al cerrar). En pantalla la plantilla, nunca un handoff real (tienen rutas del servidor y estados de pagos).

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
**Fórmula:** F5 Abrí la fuente: número primero → lectura → consecuencia práctica · **Pilar:** Claude Code · **Destino:** comunidad (drop 13)
**Evidencia:** https://www.anthropic.com/claude-fable-and-mythos-5-1 (USD 10/50) · https://www.anthropic.com/claude-opus-5-5 (USD 4/20; «performs at the level of Claude Fable 5.1 on most work»; GDPval-AA 1846 contra 1735) · https://www.anthropic.com/claude-sonnet-5-5 (USD 2/10) · https://code.claude.com/docs/en/costs (`/usage`, bloque Session: tokens por modelo; para suscriptores no es factura) · `ONIA_MODELOS_CLAUDE_Y_CUOTA.md` («Fable solo donde Opus no alcanza»). Cuenta del ejemplo hecha a mano, sin caché.

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
**Fórmula:** F1 Resultado primero → cómo → comprobación → siguiente paso (horizontal) · **Pilar:** Agentes y loops · **Destino:** comunidad (drop 8)
**Evidencia:** `hermes-content/docs/COMO_SE_ARMA_UN_LOOP.md` (dos capas; flock, `cd` verificado, aviso cada 6 h; las cinco trampas; 2-sep «line 157: l: command not found»; dos de seis loops apagados, uno con 7 de 8 corridas vacías) · `scripts/loops/onia-loop.sh` (`exec 9>`/`flock -n 9`, `unset ANTHROPIC_API_KEY ANTHROPIC_TOKEN`, `claude -p ... --allowedTools "$TOOLS" < prompt`) · `hermes-content/deploy/vps-ops/claude-guardia.sh` · `claude setup-token` en CLI 2.1.267. Mostrar el diagrama y el esqueleto; nunca la terminal del servidor, `.env` ni credenciales. Recontar los loops activos antes de grabar; no decir cantidad.

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

## Mar 6-oct

### D07-A · Vertical · Una skill que elige las demás: el router
**Fórmula:** F7 Receta en N pasos con el paso crítico marcado · **Pilar:** Claude Code · **Destino:** comunidad (drop 9)
**Evidencia:** `.claude/skills/onia-router/SKILL.md` (description «Invocar al INICIO…»; tabla carril → skills → subagente → skill propia; fila de contenido: `editor-videos`, `ver-videos`, `sacar-prompt`; «Reglas duras que aplican SIEMPRE») · `CLAUDE.md` «Skills del proyecto» («Toda sesión arranca invocando onia-router»). Continúa D01-A: no repetir su explicación.

El miércoles armamos tu primera skill. Hoy, la que uso para que Claude no tenga que adivinar
cuál usar: un router.

Cuando tenés muchas skills, Claude elige leyendo descripciones. Con muchas, elige mal. El router
le da el mapa.

Paso uno. Creá una skill que se llame router. En la descripción poné: «Invocar al inicio de
cualquier trabajo en este proyecto».

Paso dos. Adentro, una tabla: una fila por tipo de trabajo, con qué skills cargar y qué leer
primero. En la mía, la fila de contenido dice: editor de videos, ver videos y sacar prompt.

Paso tres, el que decide: en tu CLAUDE punto md escribí «toda sesión arranca invocando el
router». Si no, dependés de que Claude se acuerde.

Paso cuatro. Debajo de la tabla, las reglas que valen siempre.

Para comprobar: abrí una sesión nueva, pedile cualquier cosa y mirá si lo primero que hace es
invocar el router. Si no, la descripción está floja.

El esqueleto para copiar está en la comunidad.

### D07-B · Vertical · Tenía veinticuatro MCP conectados y ninguno escrito en mis archivos
**Fórmula:** F5 Abrí la fuente: número primero → lectura → consecuencia práctica · **Pilar:** Claude Code · **Destino:** comunidad (drop 14)
**Evidencia:** `hermes-content/docs/ONIA_AGENTES_MCP_AUDITORIA_ANTIPATRONES.md` (18-ago: ~24 MCP + 2 configurados sin autenticar, ~560 tools diferidas, 0 referencias `mcp__` en agents/skills/docs; Cloudflare por 6 superficies) · `claude mcp list` / `claude mcp remove` en CLI 2.1.267 · https://code.claude.com/docs/en/costs (herramientas diferidas: solo nombres en contexto; `/mcp` para desactivar; `/usage` atribuye uso por servidor MCP).

Tenía veinticuatro servidores MCP conectados a Claude Code. Cuando los audité, ninguno aparecía
nombrado en mis skills ni en mis documentos. Cero.

Un MCP es una conexión que le da a Claude herramientas de otra aplicación: tu base de datos, tus
anuncios.

La auditoría, del dieciocho de agosto, encontró más: unas quinientas sesenta herramientas
disponibles, dos servidores que nunca se autenticaron, y el mismo servicio conectado por seis
caminos distintos.

¿Cuánto cuesta? Hoy Claude Code carga solo los nombres hasta que usa una herramienta. Pero esos
nombres entran en cada sesión.

Hacé esto. En la terminal: claude mcp list. Te muestra cada servidor y si está conectado.

Después pedile a Claude Code que busque «mcp guion bajo guion bajo» en tu proyecto: así se
llaman esas herramientas. El servidor que no aparece en ningún lado es candidato.

Para sacarlo: claude mcp remove y el nombre. O desactivalo con barra mcp, dentro de la sesión.

Comprobás con claude mcp list: ya no está.

Lo tenés completo en la comunidad: el link está en mi web.

### D07-C · Vertical · ¿Necesitás inversión? Primero hacé esta división
**Fórmula:** F5 Abrí la fuente: número primero → lectura → consecuencia práctica · **Pilar:** SaaS desde Bolivia · **Destino:** comunidad (drop 10)
**Evidencia:** `hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md` §0 y §4 (break-even = gasto mensual ÷ precio del plan ≈ 5 clientes, medido 5-sep; buscar capital sale de las horas de vender) y §5 (un desarrollador lo lleva a ~15). Sin montos de gasto, márgenes ni precios en cámara.

Me pregunté si ONIA necesitaba inversión. Hice una división y la respuesta fue no: me faltan
cinco clientes, no un inversor.

La cuenta es esta: gasto mensual dividido el precio de tu plan. Te da cuántos clientes necesitás
para no perder plata.

Hacela con tus números. Sumá todo lo que pagás por mes: servidor, herramientas, internet. Dividilo
por lo que cobra tu plan más vendido. Redondeá para arriba.

Si te da un número chico, tu problema no es de plata: es de clientes. Y eso se arregla vendiendo.

Mirá qué pasa si contratás antes de tiempo. Si sumo un programador, mi número salta de cinco a
unos quince clientes. Se triplica.

Y buscar inversión es trabajo de meses. Si estás solo, esas horas salen de las horas de vender.

Si te da más clientes de los que podés atender vos solo, revisá el precio o el gasto antes que
nada.

Es una cuenta de costos, no un consejo de inversión. La planilla para hacerla está en la
comunidad.

---

## Drops de la semana

Publicar en Onia Community (Announcements) ANTES que el video. Los de «comentá PALABRA» los manda
Sergio Urcullo a mano por DM: la automatización comentario → DM no está probada.

**1 · D01-B · Planilla Sonnet vs Opus** (comunidad)
```
Tarea            | Modelo | Correcciones | Minutos hasta OK | ¿La usarías sin tocar?
T1 mecánica      | sonnet |              |                  |
T1 mecánica      | opus   |              |                  |
T2 diaria · T3 difícil: igual, una fila por modelo
Correr: claude --model sonnet --effort medium   y después   claude --model opus --effort medium
Mismo prompt, palabra por palabra. Cada prueba en una rama nueva desde el mismo commit.
Regla: si Sonnet empata en 2 de 3 → Sonnet por defecto; Opus para el tipo de tarea donde perdió.
```

**2 · D02-B · La cuenta de WhatsApp desde el 1-oct** (comunidad)
```
Fuente: developers.facebook.com/documentation/business-messaging/whatsapp/pricing → rate cards → Rates (CSV), en USD
Fila: país del número del CLIENTE (Bolivia +591 = "Rest of Latin America")
Columnas: utility, y service cuando Meta la publique (desde 1-oct-2026 se cobran por mensaje en la ventana de 24 h)
Costo del mes = mensajes de servicio × tarifa service + mensajes de utilidad × tarifa utility
Cada mensaje cuenta: 3 mensajes seguidos = 3 cobros. Juntalos en 1.
La tabla dice desde qué fecha rige: revisala cada mes. Si falta una tarifa, no la inventes.
```

**3 · D03-A · Hook Stop + guarda** (comunidad)
```json
// .claude/settings.json
{ "hooks": { "Stop": [ { "hooks": [ { "type": "command", "command": "node scripts/git-autosync.js" } ] } ] } }
```
```bash
# En tu script, ANTES de git add / commit. Si alguno imprime algo: salir sin tocar nada.
git rev-parse -q --verify MERGE_HEAD     # imprime un hash si hay un merge a medias
git diff --name-only --diff-filter=U     # lista los archivos en conflicto
# Comprobar: /hooks dentro de Claude Code tiene que listar tu Stop.
```

**4 · D03-C · Plantilla de regla con historia** (comunidad)
```
## <Nombre de la regla> (REGLA)
> <Quién la pidió>, <fecha>: «<la frase textual o el incidente, en una línea>».
- Qué se hace: <instrucción concreta, que se pueda verificar>.
- Qué NO se hace: <lo prohibido>.
- Corregido <fecha>: <si estuvo mal escrita, qué decía y por qué era falso>.
Orden del archivo: al arrancar → las que más se rompen → producto → cómo se trabaja → detalle. Menos de 200 líneas.
```

**5 · D04-B · Apagar skills que no usás** (comunidad)
```json
// .claude/settings.local.json  (o /skills → Espacio cambia el estado → Esc guarda)
{ "skillOverrides": { "skill-que-nunca-uso": "off", "skill-de-vez-en-cuando": "name-only" } }
```
```
Estados: "on" (nombre + descripción) · "name-only" · "user-invocable-only" (solo vos la llamás) · "off"
Medir: /skill-doctor (costo y uso por skill) · /doctor antes y después (peso de la lista de skills)
Las skills de plugins no se tocan acá: /plugin.
```

**6 · D04-C · Prompt para verificar mirando** (comunidad)
```
No me digas que funciona por el código de respuesta ni por un grep.
Abrí <URL> con un navegador headless (Playwright), en ancho de celular y de computadora.
Sacá capturas de lo que se ve en pantalla, bajando de a una; no de la página entera de una vez.
Miralas y decime: qué texto ves, si algo se ve roto, cuánto pesó la página y cuánto tardó.
A mano: npx playwright install chromium   y después
        npx playwright screenshot --device "iPhone 11" <URL> captura.png
```

**7 · D06-A · Plantilla de handoff de siete campos** (comunidad)
```
# Handoff — <carril>        (un archivo por carril, en el repo, se commitea)
**Objetivo** — uno, con su definición de "hecho". ¿Se cumplió?
**Qué quedó funcionando de verdad** — encendido y verificado, con commit/hora. Si nada: "nada".
**Qué quedó a medias, y dónde** — rama, carpeta y commit exactos. Lo sin commitear, con su riesgo.
**Archivos y cambios** — los que importan para retomar.
**Intentos fallidos** — qué se probó, por qué no anduvo, hipótesis que resultaron falsas.
**Qué depende de vos** — decisiones, claves, clics, gasto.
**Próximos pasos** — en orden, con el criterio de "listo" de cada uno.
```

**8 · D06-C · Esqueleto del corredor** (comunidad)
```bash
#!/usr/bin/env bash
set -uo pipefail
exec 9>/tmp/loop-NOMBRE.lock; flock -n 9 || exit 0      # la vuelta anterior sigue viva: esta no arranca
cd /ruta/al/worktree || { echo "no pude entrar" >> loop.log; exit 2; }   # acá va tu aviso (1 cada 6 h)
[ "$(git branch --show-current)" = "rama-esperada" ] || exit 2
unset ANTHROPIC_API_KEY ANTHROPIC_TOKEN                  # que use la suscripción, no una clave suelta
timeout 50m claude -p --allowedTools "Read,Edit,Grep,Glob,Bash" < prompt.md >> loop.log 2>&1
# cron en UTC (Bolivia = UTC-4): 5 * * * * /ruta/loop.sh   · instalar con archivo temporal + bash -n + mv
```

**9 · D07-A · Esqueleto de router** (comunidad)
```
---
name: router
description: Invocar al INICIO de cualquier trabajo en este proyecto. Elige qué skills cargar y qué leer según la tarea.
---
| Si la tarea es… | Cargá estas skills | Leé primero |
| <tipo de trabajo> | <skill-a> <skill-b> | <docs/archivo.md> |
## Reglas que valen siempre
Y en CLAUDE.md: «Toda sesión arranca invocando la skill router».
```

**10 · D07-C · Planilla del punto de equilibrio** (comunidad)
```
Gasto mensual G = servidor ___ + herramientas ___ + internet ___ + otros ___
Precio del plan más vendido P = ___
Clientes para no perder plata = G ÷ P, redondeado para arriba
Si contratás: (G + sueldo) ÷ P = número nuevo
Si el número supera los clientes que podés atender solo: revisá precio o gasto antes de buscar plata.
Es una cuenta de costos, no un consejo de inversión.
```

**11 · D03-B · AGENTS** (DM)
```
AGENTS.md → las reglas compartidas (Claude Code, Codex y los demás)
CLAUDE.md → primera línea:   @AGENTS.md
            debajo: solo lo que es de Claude Code
Windows: usá el import, no un symlink (Git lo clona como texto plano).
Comprobar: preguntale a Claude una regla que solo está en AGENTS.md.
```

**12 · D05-A · CARRIL** (DM)
```bash
git worktree add -b carril-web ../mi-proyecto-web     # carpeta nueva con rama nueva
cd ../mi-proyecto-web && claude                       # o, desde el proyecto: claude -w carril-web
git -C ../mi-proyecto-web branch --show-current       # verificar la rama ANTES de reset/checkout/merge/push
git worktree list                                     # una carpeta = una rama
git worktree remove ../mi-proyecto-web                # al terminar, con la rama ya mergeada
```

**13 · D06-B · TABLA** (DM)
```
Precio por millón de tokens, entrada / salida (fuentes oficiales, 29-sep-2026):
Fable 5.1: USD 10 / 50 · Opus 5.5: USD 4 / 20 · Sonnet 5.5: USD 2 / 10
Costo = entrada ÷ 1.000.000 × precio_entrada + salida ÷ 1.000.000 × precio_salida
Tokens: /usage en Claude Code, bloque Session (sin contar caché)
Ej. 50.000 + 5.000 → Sonnet 0,15 · Opus 0,30 · Fable 0,75 (USD)
Fable solo cuando Opus con esfuerzo alto no alcanzó.
```

**14 · D07-B · MCP** (DM)
```bash
claude mcp list                        # servidores y si están conectados
grep -rn "mcp__" .claude/ docs/        # ¿algún archivo tuyo los nombra?
claude mcp remove <nombre>             # sacar uno configurado en Claude Code
/mcp                                   # dentro de una sesión: desactivar los que no usás
/usage                                 # planes Pro/Max: qué % de tu uso va a cada servidor MCP
```
