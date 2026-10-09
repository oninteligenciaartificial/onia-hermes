# Avisos de la comunidad · 8 → 16 de octubre, en palabras simples

Pedido de Sergio Urcullo, 8-oct: *«no entiendo esas, mejorá lo que decís»*. Antes cada aviso era el recurso técnico entero
(tabla, plantilla, comandos). Ahora cada uno son **dos mensajes**: un **aviso corto** que se pega primero y el **recurso
completo** que se pega después, en otro mensaje.

- **Cada aviso corto lleva su PALABRA en mayúsculas** (`*HAIKU* · …`): el video dice «buscá HAIKU en Avisos» y la búsqueda de
  WhatsApp tiene que encontrarlo (la madre lo midió el 9-oct con MIRAR y CACHE).
- **Recurso completo:** vive en cada pieza de `GRABAR-10-16-OCT.md` (rama de la madre, v3). Acá están los avisos cortos y, donde
  ya está reescrito y probado, el recurso: **HAIKU** (cifra corregida a **0,39 USD**) y **HOOK** (el script de la guarda se
  corrió en un repo de prueba el 9-oct: con un conflicto no commitea, con el árbol limpio sí). **Siguen pendientes de reescribir**
  ANTIGRAVITY, CACHE, VERIFY, EFFORT, MIGRAR, MIRAR, WORKTREE y los nuevos NIVELES y HERRAMIENTAS; se pegan antes de su video.
- **Cómo lo ve Sergio Urcullo:** el artefacto «Comunidad e historias» (un bloque por día, con botón de copiar). Lo genera un
  script del scratchpad de la sesión; si se pierde, se rehace desde este archivo.
- **Regla del aviso corto:** una frase de qué pasó, una de qué te cambia, una de qué hay abajo y una pregunta para General.
  Sin comandos, sin tablas, sin siglas sin explicar (token, hook, worktree se dicen con su significado).

## CACHE · Precios de OpenAI: el modelo barato

**Para Sergio Urcullo:** OpenAI sacó un modelo más barato, GPT-6.1 Sol. Este mensaje compara su precio con el del modelo caro y deja una fórmula para calcular cuánto gasta tu bot. Sirve a quien tiene un bot hecho con OpenAI.

**Aviso** (se pega primero):

```
💸 *CACHE* · *OpenAI sacó un modelo 5 veces más barato*

GPT-6.1 Sol cuesta 2 dólares por cada millón de tokens (pedacitos de texto) que le mandás. Su hermano grande, Astra, cuesta 10.

Si tu bot usa Astra, pasarte a Sol puede bajarte la cuenta a una quinta parte.

Abajo te dejo la tabla y la fórmula para calcular tu gasto.

Contame en General: ¿qué modelo usa tu bot hoy?
```

## VERIFY · Que Claude revise antes de guardar un cambio

**Para Sergio Urcullo:** Un archivo corto con tus chequeos (que compile, que pasen los tests). Claude Code lo corre solo antes de guardar cada cambio. Sirve a quien programa con Claude Code.

**Aviso** (se pega primero):

```
✅ *VERIFY* · *Que Claude revise tu código antes de guardarlo*

Desde el 30 de septiembre, Claude Code puede correr tus revisiones justo antes de cada commit (cada vez que guarda un cambio).

Solo hace falta un archivo corto con los chequeos que vos elijas. Abajo te lo dejo listo: son 3 pasos.

Contame en General: ¿qué revisión le pusiste?
```

## HISTORIA · Plantilla para escribir reglas con historia

**Para Sergio Urcullo:** Una plantilla para las reglas de tu archivo CLAUDE.md, las instrucciones fijas que Claude lee al empezar. Cada regla lleva quién la pidió y qué pasó: con su historia se entiende y se respeta más.

**Aviso** (se pega primero):

```
📝 *HISTORIA* · *Cómo escribo las reglas para Claude*

En mi archivo de reglas (CLAUDE.md), cada regla lleva su historia: quién la pidió, cuándo y qué pasó.

Una regla sin historia se desobedece. Con historia se entiende.

Abajo está la plantilla. Copiala y probala con una regla tuya.

Contame en General: ¿cuál sería tu primera regla?
```

## COMUNIDAD · Volver al modo manual en Claude Code

**Para Sergio Urcullo:** Cómo hacer que Claude Code vuelva a pedirte permiso antes de actuar, en vez del «modo auto». Sirve a quien usa Claude Code y quiere más control.

**Aviso** (se pega primero):

```
🛑 *COMUNIDAD* · *Claude Code ya no te pide permiso*

Desde fines de septiembre, Claude Code arranca en «modo auto»: un segundo modelo decide por vos qué acciones dejar pasar.

Bloquea lo más peligroso (borrar para siempre, publicar a producción), pero deja pasar un push a tu rama principal. Si esa rama publica tu sitio, eso te importa.

Abajo: cómo volver al modo manual, paso a paso.

Contame en General: ¿en qué modo te arrancó hoy Claude Code?
```

## HAIKU · Haiku 5.5: el precio y la cuenta para tu bot

**Para Sergio Urcullo:** Anthropic sacó Haiku 5.5, su modelo más barato. Muestra cuánto cuesta clasificar 1.000 mensajes con un bot (de 3 a 0,39 dólares) y la letra chica: viene con el «pensamiento» prendido y se cobra.

**Aviso** (se pega primero):

```
🧮 *HAIKU* · *Clasificar 1.000 mensajes: de 3 a 0,39 dólares*

Anthropic sacó Haiku 5.5, su modelo más barato. Para clasificar y repartir mensajes de un bot, la cuenta baja casi 8 veces.

Ojo con la letra chica: viene con el «pensamiento» prendido y eso se cobra. Hay que apagarlo para clasificar.

Abajo está la tabla y la cuenta completa.
```

**Recurso** (se pega después, en otro mensaje):

~~~
*HAIKU* · *Haiku 5.5: la tabla y la cuenta para tu bot*

Precios de Anthropic por millón de tokens (página oficial):
• Haiku 5.5, prompts de hasta 100.000 tokens: entra 0,10 USD · sale 0,50 USD
• Haiku 5.5, prompts de más de 100.000 tokens: entra 0,50 · sale 2,50
• Haiku 4.5: entra 1 · sale 5

Para qué sirve: clasificar, sacar datos y repartir mensajes. Lo difícil, Sonnet.

La cuenta (clasificar 1.000 mensajes, 2.000 tokens de entrada y 200 de salida cada uno en Haiku 4.5, sin pensamiento):
• Haiku 4.5: 3 USD
• Haiku 5.5: el mismo texto da ~30 % más tokens → 2.600 y 260 → 0,39 USD (casi 8 veces menos). El +30 % en la salida es un supuesto nuestro: la doc no da un porcentaje propio para la salida.

Ojo:
• Viene con el pensamiento prendido y se cobra como salida. Para clasificar: thinking: {type: "disabled"} (vale con esfuerzo high o menor), y medilo. Con el pensamiento prendido, la cuenta de arriba sube.
• No mandes temperature, top_p ni top_k: temperature distinta de 1, top_p distinta de 0,99 o cualquier top_k dan error 400.
• Si el prompt pasa de 100.000 tokens, cobra 5 veces más por token.

Cómo cambiarlo: model: "claude-haiku-5-5".
~~~

## HOOK · Hook Stop con guarda

**Para Sergio Urcullo:** Un «hook» es un comando que Claude Code corre solo. Este es mi hook Stop: commitea cuando Claude termina de responder. Una vez subió 19 archivos con conflictos, y la guarda son dos comandos de git que lo frenan. Sirve a quien ya usa Git con Claude Code.

**Aviso** (se pega primero):

```
🔒 *HOOK* · *Mi hook subió 19 archivos con conflictos. Esta es la guarda*

Un «hook» es un comando que Claude Code corre solo. El mío es Stop: cuando Claude termina de responder, commitea. Una vez subió 19 archivos con conflictos sin resolver a mi rama principal.

Abajo: el hook, el script de la guarda (dos comandos de git que frenan el commit) y cómo probar que funciona.

Contame en General: ¿ya automatizás algo con hooks?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*HOOK* · *Hook Stop + guarda: el archivo y el script*

*1. El hook.* En `.claude/settings.json` de tu proyecto:
```
{
  "hooks": {
    "Stop": [
      { "hooks": [ { "type": "command", "command": "sh guarda.sh" } ] }
    ]
  }
}
```

*2. La guarda.* Guardá esto como `guarda.sh` en la carpeta de tu proyecto:
```
#!/bin/sh
# Si hay un merge a medias o archivos en conflicto, no commitea.
if [ -n "$(git rev-parse -q --verify MERGE_HEAD)" ] || [ -n "$(git diff --name-only --diff-filter=U)" ]; then
  echo "[guarda] merge sin resolver, omito el commit"
  exit 0
fi
git add -A && git commit -q -m "auto: cambios de Claude" && echo "[guarda] commit hecho"
```
Commitea pero NO hace push. Es un ejemplo: ajustalo a lo que quieras que haga tu hook.

*3. Cómo sabés que anduvo*
• Dentro de Claude Code escribí /hooks: tu Stop tiene que aparecer.
• En una carpeta de prueba: git init, dos ramas que cambian la misma línea del mismo archivo, git merge (queda en conflicto) y corré sh guarda.sh. Tiene que avisar y no commitear. Mirá con git log que no hay commit nuevo.

*Qué cubre cada comando:* el primero solo ve un git merge a medias; en un rebase o un cherry-pick lo atrapa el segundo, que lista los archivos en conflicto.

*Su límite:* Stop corre cuando Claude termina su turno, no cuando terminó el trabajo. Escribí en tu CLAUDE.md: «cada turno deja el proyecto andando». Claude Code lo lee como contexto, no como regla forzada.

Contame en General: ¿qué commitea tu hook?
~~~

## ANTIGRAVITY · De Gemini CLI a Antigravity CLI

**Para Sergio Urcullo:** Google cerró Gemini CLI gratis y lo reemplazó por Antigravity. Explica qué cambia y cómo instalarlo.

**Aviso** (se pega primero):

```
🚀 *ANTIGRAVITY* · *Gemini CLI gratis se apagó. Ahora es Antigravity*

Desde el 18 de junio, Google reemplazó Gemini CLI por Antigravity CLI. Sigue siendo gratis con una cuenta personal de Google, con un límite que se renueva cada semana.

Abajo: qué cambia y cómo instalarlo en 3 pasos (Mac, Linux y Windows).

Contame en General: ¿lo pudiste instalar?
```

## PROMESA · Bot con dos listas

**Para Sergio Urcullo:** La prueba del mismo bot con un pedido con fecha, con y sin la regla «no confirmes lo que no está escrito». Deja la plantilla para copiar.

**Aviso** (se pega primero):

```
🤝 *PROMESA* · *Dos listas para que tu bot no prometa de más*

Probé el mismo bot con un pedido con fecha. Con y sin reglas, ninguno prometió la entrega. Pero el que tenía dos listas (qué está confirmado y qué falta confirmar) usó el dato real y dijo claro qué faltaba.

Abajo: la prueba y la plantilla para tu bot.

Contame en General: ¿qué va en tu lista de «por confirmar»?
```

## PROMPT · Sacar el prompt de una imagen

**Para Sergio Urcullo:** Un prompt para que una IA adivine el prompt con el que se hizo una imagen o un video. Ordena la descripción en 8 bloques.

**Aviso** (se pega primero):

```
🖼️ *PROMPT* · *Cómo saco el prompt de una imagen que me gusta*

Primero reviso si el prompt está a la vista (en la descripción o en el video). Si no está, lo reconstruyo y lo digo: no es el original, es uno que da algo parecido.

Uso 8 bloques en orden: apertura, sujeto, rasgos, ropa, pose, fondo, cámara y luz, y lo que NO querés.

Abajo está el prompt completo para copiar.

Contame en General: ¿qué imagen querés recrear?
```

## VENTANA · La regla de 24 horas de WhatsApp

**Para Sergio Urcullo:** WhatsApp solo deja escribirle libre a un cliente durante 24 horas desde su último mensaje. Después, solo con una plantilla aprobada. Explica las reglas de mi bot y deja los dos textos.

**Aviso** (se pega primero):

```
⏱️ *VENTANA* · *La regla de las 24 horas de WhatsApp*

Si tu bot usa la API oficial de WhatsApp (Meta), solo puede escribirle libre a un cliente durante 24 horas desde su último mensaje. Pasado ese tiempo, solo con una plantilla que Meta apruebe antes.

Abajo: las reglas de mi bot y los dos textos de seguimiento.

Contame en General: ¿a las cuántas horas manda tu bot el seguimiento?
```

## MIGRAR · De Sonnet 4.5 a Sonnet 5.5

**Para Sergio Urcullo:** Anthropic apaga Sonnet 4.5 el 30 de noviembre. Es la lista para encontrarlo en tu proyecto y cambiarlo. Sirve a quien usa la API de Claude o n8n.

**Aviso** (se pega primero):

```
⚠️ *MIGRAR* · *Sonnet 4.5 se apaga el 30 de noviembre*

Si tu bot o tu automatización usa el modelo Sonnet 4.5, deja de funcionar ese día. Anthropic recomienda pasar a Sonnet 5.5.

Abajo: cómo encontrarlo, cambiarlo con un comando y probar que funciona. En n8n se cambia a mano, nodo por nodo.

Contame en General: ¿cuántos lugares encontraste?
```

## EFFORT · La perilla de esfuerzo de Claude Code

**Para Sergio Urcullo:** El «esfuerzo» decide cuánto piensa Claude antes de contestar. Explica los niveles y cuándo usar cada uno.

**Aviso** (se pega primero):

```
🎚️ *EFFORT* · *La perilla de esfuerzo de Claude Code*

Claude Code tiene una perilla que decide cuánto piensa antes de contestar. En los modelos nuevos arranca en «medium», un nivel más abajo que antes.

Abajo: qué hace cada nivel y cómo probar cuál le conviene a tu tarea.

Contame en General: ¿qué tarea probaste y en qué nivel te quedó?
```

## MIRAR · Prompt para verificar mirando

**Para Sergio Urcullo:** Un prompt para que Claude abra tu página, saque capturas y las mire, en vez de decir «funciona» porque el código dio 200.

**Aviso** (se pega primero):

```
👀 *MIRAR* · *Cuando tu IA dice que funciona, pedile que lo mire*

Mi agente me dijo varias veces que algo funcionaba. Lo abrí yo y estaba roto. Buscar texto en el código no distingue una página que se ve bien de una rota.

Abajo: el prompt para que abra la página, saque capturas y las mire.

Contame en General: ¿alguna vez tu IA te dijo que algo funcionaba y no?
```

## WORKTREE · Dos sesiones de Claude Code sin pisarse

**Para Sergio Urcullo:** Un worktree es una segunda carpeta de tu proyecto con su propia rama. Sirve para que dos sesiones de Claude trabajen a la vez sin pisarse.

**Aviso** (se pega primero):

```
🌳 *WORKTREE* · *Dos sesiones de Claude Code sin pisarse*

Si abrís dos sesiones en la misma carpeta, se pisan los archivos. La solución: darle a cada una su propia carpeta con su propia rama (un «worktree»).

Abajo: los 5 comandos, en orden.

Contame en General: ¿ya trabajás con dos sesiones a la vez?
```

## CHECKLIST · Checklist: ¿qué automatizo primero?

**Para Sergio Urcullo:** Cinco preguntas para que el dueño de un negocio descubra qué tarea automatizar primero. Es el recurso para los videos de negocio y la tarea previa a la asesoría gratis. Si ya lo pegaste antes, saltalo.

**Aviso** (se pega primero):

```
📥 *CHECKLIST* · *¿Qué automatizo primero en mi negocio?*

Antes de automatizar algo hay que saber qué. Te dejo 5 preguntas para descubrirlo en 5 minutos.

La tarea que aparezca en 2 o más respuestas, esa va primero. Y si reservás una asesoría gratis, llevá tus respuestas.

Abajo está el checklist. Contame en General: ¿cuál es la tuya?
```

**Recurso** (se pega después, en otro mensaje; sale de `ONIA_COMUNIDAD_CONTENIDO.md` §Vie):

```
📥 *Checklist: 5 preguntas para saber QUÉ automatizar primero en tu negocio*

1. ¿Qué hago más de 3 veces por semana exactamente igual?
2. ¿Qué me interrumpe cuando estoy trabajando en lo importante?
3. ¿Qué se me olvida seguido (cobros, seguimientos, recordatorios)?
4. ¿Dónde pierdo clientes por responder tarde?
5. ¿Qué tarea odio tanto que la postergo?

La que aparezca en 2 o más respuestas: esa va primero.
Contá la tuya en General 👇
```

## ARCHIVOS · Los 5 archivos que uso antes de programar con IA

**Para Sergio Urcullo:** Los 5 archivos que dejo en un repo antes de pedirle código a una IA (reglas, encargo, método, estado y tarea), con una plantilla de tarea para copiar. Es el recurso del carrusel «Los 5 archivos»: se pega ANTES de que el carrusel salga. Fuera del orden del 10 al 16: el carrusel espera tu OK y fecha.

**Aviso** (se pega primero):

```
🗂️ *ARCHIVOS* · *Los 5 archivos que uso antes de programar con IA*

Antes de pedirle código a la IA, le dejo por escrito qué puede cambiar y cómo voy a revisar el resultado. Son cinco cosas en mi repo: las reglas, el encargo, el método, el estado y la tarea.

Abajo: la lista y una plantilla de tarea para copiar.

Contame en General: ¿cuál de los cinco te falta?
```

**Recurso** (se pega después, en otro mensaje; cada línea sale de un archivo real del repo, ver `hermes-content/carousels/briefs/assets/sergio-cinco-archivos-20261009/capturas.json`):

~~~
*ARCHIVOS* · *Antes de programar con IA: las 5 entradas y la plantilla de tarea*

1. Reglas del proyecto: el objetivo y los permisos, en CLAUDE.md.
2. Encargo del agente: el alcance y dónde para, en AGENTS.md.
3. Método: la skill adecuada dentro de .claude/skills/.
4. Estado: el handoff con lo hecho, lo que falló y el siguiente paso.
5. Tarea: un cambio con META, PRUEBA DE HECHO y REGLA DE PARADA.

CLAUDE.md y AGENTS.md no se duplican: AGENTS.md remite a las mismas reglas. Y no todos se leen siempre: cargá solo lo que corresponde al trabajo.

Plantilla mínima para tu siguiente tarea:
```
META: [un cambio concreto]
FUENTES: [reglas, skill y estado que debe leer]
PRUEBA DE HECHO: [resultado observable o test]
REGLA DE PARADA: [límites y cuándo entregar]
```

Los archivos orientan al agente: no garantizan que acierte. Revisá y probá el cambio.
Contame en General: ¿cuál de los cinco te falta?
~~~
