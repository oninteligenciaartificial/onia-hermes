# Avisos de la comunidad · 8 → 16 de octubre, en palabras simples

Pedido de Sergio Urcullo, 8-oct: *«no entiendo esas, mejorá lo que decís»*. Antes cada aviso era el recurso técnico entero
(tabla, plantilla, comandos). Ahora cada uno son **dos mensajes**: un **aviso corto** que se pega primero y el **recurso
completo** que se pega después, en otro mensaje.

- **Cada aviso corto lleva su PALABRA en mayúsculas** (`*HAIKU* · …`): el video dice «buscá HAIKU en Avisos» y la búsqueda de
  WhatsApp tiene que encontrarlo (la madre lo midió el 9-oct con MIRAR y CACHE).
- **Recurso completo:** vive en cada pieza de `GRABAR-10-16-OCT.md` (rama de la madre, v3). Acá están los avisos cortos y, donde
  ya está reescrito y probado, el recurso: **HAIKU** (cifra corregida a **0,39 USD**) y **HOOK** (el script de la guarda se
  corrió en un repo de prueba el 9-oct: con un conflicto no commitea, con el árbol limpio sí). **Reescritos el 9-oct** (más abajo):
  VERIFY, MIGRAR, MIRAR, WORKTREE, SKILL, NIVELES y HERRAMIENTAS; **ANTIGRAVITY y EFFORT son borradores** (los verifica la madre el
  sáb 10 y los completa Sergio Urcullo el 13). **CACHE ya no bloquea**: el CTA de DD-A pasó a la asesoría.
- **Cómo lo ve Sergio Urcullo:** el artefacto «Comunidad e historias» (un bloque por día, con botón de copiar). Lo genera un
  script del scratchpad de la sesión; si se pierde, se rehace desde este archivo.
- **Regla del aviso corto:** una frase de qué pasó, una de qué te cambia, una de qué hay abajo y una pregunta para General.
  Sin comandos, sin tablas, sin siglas sin explicar (token, hook, worktree se dicen con su significado).

- **9-oct:** ANTIGRAVITY (borrador), VERIFY, EFFORT (borrador), MIGRAR, MIRAR y WORKTREE se reescribieron con lo de GRABAR v3 de la madre (rama `claude/onia-madre-v2-pr-review-2d85bb`); SKILL, NIVELES y HERRAMIENTAS son nuevos. Los comandos de VERIFY se corrieron el 9-oct en un proyecto de prueba (npm 10.9, pnpm 10.28, tsc 6.0): `tsc --noEmit` sale 0 y con un error de tipos sale 2; sin script de tests, `npm test` y `pnpm test` salen 1.

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

**Para Sergio Urcullo:** VERSIÓN NUEVA (con lint y pnpm): se pega antes de las 18:30 del lun 12; si ya pegaste la del jueves, esta la reemplaza. Un archivo corto con tus chequeos (que compile, que pasen los tests, el lint) que Claude Code corre antes de guardar cada cambio. Los comandos se probaron el 9-oct en un proyecto de prueba, con npm y con pnpm.

**Aviso** (se pega primero):

```
✅ *VERIFY* · *Que Claude revise tu código antes de guardarlo*

Desde el 30 de septiembre, Claude Code puede correr tus revisiones justo antes de cada commit (cada vez que guarda un cambio).

Solo hace falta un archivo corto con los chequeos que vos elijas. Abajo te lo dejo listo, con la línea de lint y la versión para pnpm.

Contame en General: ¿qué revisión le pusiste?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*VERIFY* · *Plantilla: la skill verify, con lint*

Desde el 30-sep (Claude Code 2.1.286): si tu proyecto tiene una skill llamada `verify`, a Claude se le indica correrla justo antes de commitear, *salvo en commits que solo tocan documentación o solo tests*. Vale cuando commitea Claude, no en un `git commit` que hacés vos a mano. *Es una indicación, no un candado.*

1. En tu proyecto creá el archivo `.claude/skills/verify/SKILL.md`
2. Pegá esto:
```
---
name: verify
description: Chequeos antes de cada commit
---
Antes de empezar, escribí: "verify: corriendo mis chequeos".
1. npx tsc --noEmit
2. npm test
3. npm run lint (si tu proyecto tiene ese script)
Si algo falla: no commitear y decir qué falló.
```
Si usás pnpm, las tres líneas son: `pnpm exec tsc --noEmit` · `pnpm test` · `pnpm run lint`.
3. Actualizá Claude Code: `claude update`

*Ojo:*
• Si tu proyecto no tiene script de tests, borrá la línea 2: si no, verify falla siempre y no commitea nunca.
• No le pongas `disable-model-invocation: true`: con eso Claude no recibe la indicación.
• La línea 1 es para proyectos TypeScript. Si el tuyo es otro, poné el comando que lo compila.
• Tu skill reemplaza al `/verify` que trae Claude Code (el que arma y corre tu app para probar un cambio). Si ya usaste ese `/verify`, puede haber guardado su receta en este mismo archivo: abrilo antes de pisarlo.

*Cómo sabés que anduvo:* pedile a Claude un commit que toque código (no solo un README o un test). Antes de commitear tiene que aparecer «verify: corriendo mis chequeos».

Contame en General: *¿qué chequeo le pusiste a tu verify?*
~~~

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

**Para Sergio Urcullo:** BORRADOR: la madre lo verifica el sáb 10 (10:00-12:00) con capturas y lo pegás antes de las 18:00. Google cerró Gemini CLI gratis y lo reemplazó por Antigravity. El video ya muestra cómo instalarlo; este aviso trae lo que el video no da: dónde van tus skills y qué se muda solo.

**Aviso** (se pega primero):

```
🚀 *ANTIGRAVITY* · *Gemini CLI gratis se apagó. Ahora es Antigravity*

Desde el 18 de junio, Google reemplazó Gemini CLI por Antigravity CLI. Sigue siendo gratis con una cuenta personal de Google, con un límite que se renueva cada semana.

Si venías de Gemini CLI, algo no se mudó solo: tus skills. Abajo: a dónde van y qué se convierte solo la primera vez.

Contame en General: ¿usabas Gemini CLI? ¿Qué tuviste que mover a mano?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*ANTIGRAVITY* · *Qué se muda solo y qué no, de Gemini CLI a Antigravity CLI*

La instalación está en antigravity.google/download. Esto es lo que el video no muestra:

1. *Dónde van las skills globales:* la ruta nueva es `~/.gemini/antigravity-cli/skills/` (antes, `~/.gemini/skills/`). La documentación no dice si las de la carpeta vieja hay que moverlas a mano. [CONFIRMAR el sáb 10: escribir lo que pasó en la prueba, o dejar solo la ruta]
2. *Qué convierte la lista de la primera vez:* extensiones y configuración global, tokens de sesión (los pasa al llavero del sistema) y ajustes visuales. Las skills del proyecto no figuran en esa lista.
3. *Las skills del proyecto no se mudan solas:* pasá la carpeta `.gemini/skills/` a `.agents/skills/`.
4. *Cómo sabés que quedó:* escribí «/» y el nombre de tu skill; tiene que aparecer. [CONFIRMAR el sáb 10: si `/skills` también las lista]

Lo que le pedís y lo que lee de tu carpeta va a los servidores de Google. Para la primera prueba, usá una carpeta sin datos de clientes ni claves.

Contá en General: ¿qué tuviste que mover a mano?
~~~

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

**Para Sergio Urcullo:** BLOQUEANTE: sin este aviso el video de N02 no sale (promete la lista de los 5 ajustes). Anthropic apaga Sonnet 4.5 el 30 de noviembre. Es la lista para encontrarlo en tu proyecto, cambiarlo y revisar lo que el modelo nuevo rechaza. Sirve a quien usa la API de Claude o n8n.

**Aviso** (se pega primero):

```
⚠️ *MIGRAR* · *Sonnet 4.5 se apaga el 30 de noviembre*

Si tu bot o tu automatización usa el modelo Sonnet 4.5, deja de funcionar ese día. Anthropic recomienda pasar a Sonnet 5.5. La fecha vale para la API de Claude; en Amazon Bedrock y Google Cloud es otra.

Abajo: cómo encontrarlo, cómo cambiarlo con un comando, los 5 ajustes que el modelo nuevo rechaza y cómo probar. En n8n se cambia a mano, nodo por nodo.

Contame en General: ¿cuántos lugares encontraste?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*MIGRAR* · *Checklist: de Sonnet 4.5 a Sonnet 5.5*

Sonnet 4.5 (`claude-sonnet-4-5-20250929`) se retira el *30 de noviembre de 2026* en la API de Claude, Claude Platform on AWS y Microsoft Foundry. Amazon Bedrock y Google Cloud tienen fechas propias: mirá la tuya en https://platform.claude.com/docs/en/about-claude/model-deprecations. Anthropic recomienda pasar a Sonnet 5.5.

*1. Encontralo.* En la carpeta de tu proyecto, sin mirar las dependencias instaladas:
```
grep -rn --exclude-dir=node_modules --exclude-dir=.venv --exclude-dir=.git "claude-sonnet-4-5" .
```
O, si tu proyecto usa git: `git grep "claude-sonnet-4-5"`.
En n8n: abrí cada nodo de Anthropic y mirá qué modelo tiene elegido. ¿No lo armaste vos? Preguntale a quien te lo armó.

*2. Migralo.* Abrí Claude Code en esa carpeta y escribí:
```
/claude-api migrate this project to claude-sonnet-5-5
```
Te pregunta qué archivos tocar y al final te deja una lista para revisar a mano.

*3. Los 5 ajustes que 5.5 rechaza con error 400* (solo si programás contra la API):
• `thinking` con `budget_tokens` (pensamiento extendido) → sacalo y elegí un nivel de esfuerzo: `"output_config": {"effort": "low"}` para chat, `"medium"` para agentes
• `temperature`, `top_p` o `top_k` con un valor que no sea el de fábrica → sacalos
• Respuesta pre-llenada (prefill: el último mensaje del asistente, escrito por vos) → usá salidas estructuradas (`output_config.format`) o pedí el formato en el mensaje de sistema
• `tool_choice` de tipo `any` o `tool` → `{"type": "auto"}`, `strict: true` en la herramienta (con `additionalProperties: false` y `required`), y decí en el prompt cuándo usarla
• `"thinking": {"type": "disabled"}` → en Sonnet 5.5 se cambia por `"thinking": {"type": "between_tools"}`, sin otros campos y con esfuerzo `high` o menos

En n8n, pasá directo al paso 4: si da error 400, compará el mensaje con esta lista.

*4. Probá.* Tu prueba corre sin error 400 y el campo `model` de la respuesta dice el modelo nuevo.

*Ojo con la cuenta:* el precio de entrada baja de 3 a 2 dólares por millón de tokens, pero Sonnet 5.5 cuenta el mismo texto como ~30 % más largo. Con eso la cuenta *puede* bajar cerca de un 13 %: es un estimado. Y si no mandás `thinking`, Sonnet 5.5 piensa por defecto antes de contestar, y esos tokens se cobran como salida. Para que no piense: `between_tools`. Recontá con tu propio texto.

Contame en General: *¿cuántos resultados te dio la búsqueda del paso 1?*
~~~

## EFFORT · La perilla de esfuerzo de Claude Code

**Para Sergio Urcullo:** BORRADOR: lo pegás vos el 13-oct, después de la prueba que corre la madre el dom 11; completá el resultado (punto 4). Explica los niveles de esfuerzo y trae el prompt para que cada uno pruebe cuál le conviene.

**Aviso** (se pega primero):

```
🎚️ *EFFORT* · *La perilla de esfuerzo de Claude Code*

Claude Code tiene una perilla que decide cuánto piensa antes de contestar. En los modelos nuevos arranca en «medium», un nivel más abajo que antes.

Abajo: el prompt de la prueba, la tabla de niveles y cómo probar cuál le conviene a tu tarea.

Contame en General: ¿qué tarea probaste y en qué nivel te quedó?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*EFFORT* · *La perilla de esfuerzo: el prompt, la tabla y la prueba*

*1. El prompt de la prueba* (pegalo igual en las dos sesiones):
```
Tarea: [una tarea tuya, cerrada y con tests].
Hacela. Al terminar, corré los tests y contame: ¿pasaron al primer intento? ¿Cuántas correcciones necesitaste?
```

*2. La tabla* (en Claude Code, Opus 5.5, Sonnet 5.5 y Haiku 5.5 arrancan en medium):
```
low         lo mecánico: renombrar, mover archivos
medium      el día a día
high/xhigh  cuando la primera respuesta no alcanzó
max         casi nunca. La doc dice que "may show diminishing returns and is prone
            to overthinking, so test before adopting it broadly"
```
`max` no queda guardado: dura solo la sesión (salvo que lo fijes con `CLAUDE_CODE_EFFORT_LEVEL`).
En `/effort`: Enter guarda el nivel como default; la tecla `s`, solo esta sesión.

*3. La prueba, paso a paso:* la misma tarea, el mismo punto de partida, dos sesiones.
```
git worktree add -b prueba-medium ../prueba-medium
git worktree add -b prueba-high ../prueba-high
cd ../prueba-medium && claude --effort medium      # pegá el prompt
cd ../prueba-high   && claude --effort high        # pegá el mismo prompt
```
Si en high la corregís menos, esa tarea va en high. Con `--effort` el nivel vale solo para esa sesión.

*4. Mi resultado:* [COMPLETAR el 13-oct con lo medido en la prueba del dom 11, dicho como «mi agente lo probó»]

*5. Fuentes oficiales:*
• https://code.claude.com/docs/en/model-config
• https://platform.claude.com/docs/en/build-with-claude/effort

Probalo con una tarea tuya y contá en General: *¿qué tarea era y en qué nivel te quedó?*
~~~

## MIRAR · Prompt para verificar mirando

**Para Sergio Urcullo:** Un prompt para que Claude abra tu página, saque capturas y las mire, en vez de decir «funciona» porque el código dio 200. Trae las dos formas de darle un navegador. La palabra MIRAR ya va en el texto del aviso, así «buscá MIRAR en Avisos» lo encuentra.

**Aviso** (se pega primero):

```
👀 *MIRAR* · *Cuando tu IA dice que funciona, pedile que lo mire*

Mi agente me dijo varias veces que algo funcionaba. Lo abrí yo y estaba roto. Buscar texto en el código no distingue una página que se ve bien de una rota.

Abajo: el prompt para que abra la página, saque capturas y las mire.

Contame en General: ¿alguna vez tu IA te dijo que algo funcionaba y no?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*MIRAR* · *Prompt para verificar mirando*
```
No me digas que funciona por el código de respuesta ni por un grep.
Abrí <URL> con un navegador headless (Playwright), en ancho de celular y de computadora.
Sacá capturas de lo que se ve en pantalla, bajando de a una; no de la página entera de una vez.
Miralas y decime: qué texto ves, si algo se ve roto, cuánto pesó la página y cuánto tardó.
```
*Claude Code no trae navegador. Hay dos caminos:*

*A. El servidor MCP de Playwright* (usa el Chrome que ya tenés; *no* hace falta `playwright install`):
```
claude mcp add playwright -- npx -y @playwright/mcp@latest
```
*B. Playwright por línea de comandos* (este sí pide bajar el navegador, una vez):
```
npx playwright install chromium
npx playwright screenshot --device "iPhone 11" <URL> captura.png
```
Fuente del camino A: https://code.claude.com/docs/en/mcp-quickstart · del B: https://playwright.dev/docs/test-cli

Contame en General: *¿qué página le pediste que mire?*
~~~

## WORKTREE · Dos sesiones de Claude Code sin pisarse

**Para Sergio Urcullo:** Un worktree es una segunda carpeta de tu proyecto con su propia rama. Sirve para que dos sesiones de Claude trabajen a la vez sin pisarse.

**Aviso** (se pega primero):

```
🌳 *WORKTREE* · *Dos sesiones de Claude Code sin pisarse*

Si abrís dos sesiones en la misma carpeta, se pisan los archivos. La solución: darle a cada una su propia carpeta con su propia rama (un «worktree»).

Abajo: los comandos, en orden.

Contame en General: ¿ya trabajás con dos sesiones a la vez?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*WORKTREE* · *Dos sesiones sin pisarse: los comandos*
```
# Antes: commit inicial y .claude/worktrees/ en el .gitignore
claude                                    # una vez en la carpeta: aceptá la confianza (sin esto, -w da error)
claude -w prueba-a                        # carpeta .claude/worktrees/prueba-a, rama worktree-prueba-a
                                          # parte de la rama por defecto del remoto; sin remoto, del HEAD local
git worktree add -b prueba-c ../repo-c    # a mano: carpeta nueva con rama nueva
cd ../repo-c && claude
git -C ../repo-c branch --show-current    # mirá la rama ANTES de reset, merge o push
git worktree list                         # una carpeta = una rama
git worktree remove ../repo-c             # al terminar, con la rama ya mergeada
```
Fuente: https://code.claude.com/docs/en/worktrees
~~~

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

## SKILL · Tu primera skill de Claude Code

**Para Sergio Urcullo:** El paso a paso en video, desde instalar Claude Code hasta tu primera skill. Va en un solo mensaje. La página se miró renderizada el 9-oct: carga en celular y el video 02 «Instalarlo, y tu primera skill» está incrustado (YouTube oXaqV-HDufA). Falta que confirmes que ese video es público.

**Mensaje único** (se pega antes de publicar el video):

```
🧩 *SKILL* · *Tu primera skill de Claude Code*

El paso a paso en video, desde instalar Claude Code hasta tu primera skill:
https://sergiourcullo.vercel.app/claude-code (video 02)
Cuando la tengas andando, contame en General qué hace la tuya.
```

## NIVELES · Mismo trabajo: de 0,60 a 0,10 dólares por tarea

**Para Sergio Urcullo:** La cuenta detrás del video P1. Con 10 tareas iguales, repartir el trabajo entre modelos baja el costo por tarea de 0,60 a unos 0,10 dólares. Es una cuenta con supuestos nuestros, no una medición: el aviso lo dice. Los precios se releen el día que se publique; si cambia uno, se rehace la cuenta.

**Aviso** (se pega primero):

```
🪜 *NIVELES* · *Mismo trabajo: de 0,60 a 0,10 dólares por tarea*

Con 10 tareas iguales, pasar de usar siempre el modelo más caro a repartir el trabajo baja el costo por tarea de 0,60 a unos 0,10 dólares.

Es una cuenta con supuestos míos (cuántas fallan y cómo se reparten), no una medición. Abajo está la cuenta completa para que la rehagas con lo tuyo.

Contame en General: ¿qué tarea le pasás hoy al modelo más caro?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*NIVELES* · *Mismo trabajo: de 0,60 a 0,10 USD por tarea*

Trabajo: 10 tareas, cada una con 40.000 tokens de entrada y 4.000 de salida. Precios por millón (Anthropic, 8-oct-2026): Fable 5.1 10/50 · Opus 5.5 4/20 · Sonnet 5.5 2/10 · Haiku 5.5 0,10/0,50 (prompts de hasta 100.000 tokens; arriba de eso Haiku cuesta más).
Una tarea cuesta: Fable 0,60 · Opus 0,24 · Sonnet 0,12 · Haiku 0,006.
• Todo Fable: 0,40 + 0,20 = 0,60
• Todo Opus: 0,16 + 0,08 = 0,24
• Sonnet + prueba: Sonnet primero; fallan 2 de 10 y se rehacen con Opus: (10 × 0,12 + 2 × 0,24) ÷ 10 = 0,168
• Reparto: Haiku reparte (de ejemplo, 6 a Haiku, 3 a Sonnet y 1 a Opus): 6 × 0,006 + 3 × 0,12 + 1 × 0,24 = 0,636 por las 10. Fallan 2 (1 de 5) y suben uno: una de Haiku pasa a Sonnet (+0,12) y una de Sonnet a Opus (+0,24). Total: 0,996 ÷ 10 = 0,0996 por tarea (en el video, 0,10).
Supuestos: el reparto 6/3/1 es de ejemplo; 1 de cada 5 falla los tests; hay un solo reintento; el reparto lee un resumen corto (menos de 0,001). Todo Fable y Todo Opus no prueban, y lo que falla ahí no entra en la cuenta. Los 4.000 tokens de salida son un tamaño de tarea supuesto: Fable 5.1 y Opus 5.5 piensan siempre y ese pensamiento se cobra como salida, así que una tarea real puede costar más.
Depende de dónde caen las fallas: si fallan 2 de las 6 de Haiku y 1 de Sonnet, el Reparto da 0,1116. Con 1 de 5 fallas en promedio, en cualquier nivel (una que falla en Opus sube a Fable), da 0,1044.
Regla: SUBÍ SI FALLA. Probá con el más barato que alcance. Subí solo si falla.
Contame en General: ¿qué tarea le pasás hoy al modelo más caro?
~~~

## HERRAMIENTAS · Las 7 herramientas: para qué sirve cada una y cuánto cuesta

**Para Sergio Urcullo:** La plantilla de encargo que recibe Codex y la tabla de las 7 herramientas del carrusel P2 (sale el sáb 17). Los precios se releen el 17-oct. Claude Code va sin cifra hasta que digas qué plan es y quién lo paga.

**Aviso** (se pega primero):

```
🧰 *HERRAMIENTAS* · *Las 7 herramientas que uso y cuáles son gratis*

En el carrusel te muestro las 7 herramientas con las que trabajo: 4 son gratis y 3 son de pago.

Abajo: la plantilla de 3 líneas con la que le doy un encargo a Codex y una tabla con para qué sirve cada herramienta, cuánto cuesta y su link oficial.

Contame en General: ¿cuál de las 7 ya usás?
```

**Recurso** (se pega después, en otro mensaje):

~~~
*HERRAMIENTAS* · *Las 7 herramientas: para qué tarea y cuánto cuestan*

*El encargo que recibe Codex (3 líneas):*
```
META: [qué hacer: un cambio concreto]
PRUEBA DE HECHO: [cómo se comprueba que está hecho]
REGLA DE PARADA: [cuándo parar y entregar]
```
*Qué herramienta para qué tarea* (precios de las páginas oficiales, leídas el 8-oct-2026):
• *Claude Code* · reparte el trabajo y programa · plan pago de Claude, o cuenta de Console · https://code.claude.com/docs/en/overview
• *Codex* · hace los encargos · tiene nivel gratis con límites; yo uso el plan Pro de ChatGPT (100 USD por mes) · https://chatgpt.com/pricing
• *Higgsfield* · imágenes con IA · de pago · https://higgsfield.ai
• *HyperFrames* · videos hechos con código · gratis (Apache-2.0) · https://github.com/heygen-com/hyperframes
• *Buffer* · publica por mí · plan gratis: 3 canales y 10 posts agendados por canal · https://buffer.com/pricing
• *n8n* · avisos automáticos · edición Community autoalojada, sin licencia paga · https://docs.n8n.io/hosting/
• *faster-whisper* · transcribe con el segundo de cada palabra · gratis (MIT) · https://github.com/SYSTRAN/faster-whisper

El servidor donde corren n8n y la transcripción lo pago aparte.

Contame en General: ¿cuál de las 7 ya usás?
~~~

## ARCHIVOS · Los 5 archivos que uso antes de programar con IA

**Para Sergio Urcullo:** Los 5 archivos que dejo en un repo antes de pedirle código a una IA (reglas, encargo, método, estado y tarea), con una plantilla de tarea para copiar. Es el recurso del carrusel «Los 5 archivos», que está en el banco de ideas **sin fecha** (`BANCO-IDEAS.md`): no se pega hasta que se decida publicar el carrusel.

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
