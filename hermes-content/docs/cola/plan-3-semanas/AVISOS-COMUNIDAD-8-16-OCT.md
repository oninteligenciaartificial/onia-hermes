# Avisos de la comunidad · 8 → 16 de octubre, en palabras simples

Pedido de Sergio Urcullo, 8-oct: *«no entiendo esas, mejorá lo que decís»*. Antes cada aviso era el recurso técnico entero
(tabla, plantilla, comandos). Ahora cada uno son **dos mensajes**: un **aviso corto** que se pega primero y el **recurso
completo** que se pega después, en otro mensaje.

- **Recurso completo:** sigue en `AVISOS-POR-DIA.md` (fechas viejas) y en `GRABAR-10-16-OCT.md` (SKILL). Acá solo están los avisos nuevos.
- **Cómo se ve para Sergio Urcullo:** el artefacto «Comunidad e historias» (un bloque por día, con botón de copiar). Lo genera un
  script del scratchpad de la sesión; si se pierde, se rehace desde este archivo.
- **Regla del aviso corto:** una frase de qué pasó, una de qué te cambia, una de qué hay abajo y una pregunta para General.
  Sin comandos, sin tablas, sin siglas sin explicar (token, hook, worktree se dicen con su significado).

## CACHE · Precios de OpenAI: el modelo barato

**Para Sergio Urcullo:** OpenAI sacó un modelo más barato, GPT-6.1 Sol. Este mensaje compara su precio con el del modelo caro y deja una fórmula para calcular cuánto gasta tu bot. Sirve a quien tiene un bot hecho con OpenAI.

```
💸 *OpenAI sacó un modelo 5 veces más barato*

GPT-6.1 Sol cuesta 2 dólares por cada millón de tokens (pedacitos de texto) que le mandás. Su hermano grande, Astra, cuesta 10.

Si tu bot usa Astra, pasarte a Sol puede bajarte la cuenta a una quinta parte.

Abajo te dejo la tabla y la fórmula para calcular tu gasto.

Contame en General: ¿qué modelo usa tu bot hoy?
```

## VERIFY · Que Claude revise antes de guardar un cambio

**Para Sergio Urcullo:** Un archivo corto con tus chequeos (que compile, que pasen los tests). Claude Code lo corre solo antes de guardar cada cambio. Sirve a quien programa con Claude Code.

```
✅ *Que Claude revise tu código antes de guardarlo*

Desde el 30 de septiembre, Claude Code puede correr tus revisiones justo antes de cada commit (cada vez que guarda un cambio).

Solo hace falta un archivo corto con los chequeos que vos elijas. Abajo te lo dejo listo: son 3 pasos.

Contame en General: ¿qué revisión le pusiste?
```

## HISTORIA · Plantilla para escribir reglas con historia

**Para Sergio Urcullo:** Una plantilla para las reglas de tu archivo CLAUDE.md, las instrucciones fijas que Claude lee al empezar. Cada regla lleva quién la pidió y qué pasó: con su historia se entiende y se respeta más.

```
📝 *Cómo escribo las reglas para Claude*

En mi archivo de reglas (CLAUDE.md), cada regla lleva su historia: quién la pidió, cuándo y qué pasó.

Una regla sin historia se desobedece. Con historia se entiende.

Abajo está la plantilla. Copiala y probala con una regla tuya.

Contame en General: ¿cuál sería tu primera regla?
```

## COMUNIDAD · Volver al modo manual en Claude Code

**Para Sergio Urcullo:** Cómo hacer que Claude Code vuelva a pedirte permiso antes de actuar, en vez del «modo auto». Sirve a quien usa Claude Code y quiere más control.

```
🛑 *Claude Code ya no te pide permiso*

Desde fines de septiembre, Claude Code arranca en «modo auto»: un segundo modelo decide por vos qué acciones dejar pasar.

Bloquea lo más peligroso (borrar para siempre, publicar a producción), pero deja pasar un push a tu rama principal. Si esa rama publica tu sitio, eso te importa.

Abajo: cómo volver al modo manual, paso a paso.

Contame en General: ¿en qué modo te arrancó hoy Claude Code?
```

## HAIKU · Haiku 5.5: el precio y la cuenta para tu bot

**Para Sergio Urcullo:** Anthropic sacó Haiku 5.5, su modelo más barato. Muestra cuánto ahorrás en un bot y para qué tareas sirve.

```
🧮 *Haiku 5.5: el modelo barato de Claude*

Cuesta 10 veces menos que el anterior (Haiku 4.5). Para un bot de 1.000 mensajes: de 3 dólares a 30 centavos.

Sirve para tareas simples: clasificar, sacar datos, repartir mensajes. Para razonar mucho, Sonnet u Opus.

Abajo está la cuenta completa.
```

## HOOK · Hook Stop con guarda

**Para Sergio Urcullo:** Un «hook» es un comando que Claude Code corre solo, por ejemplo al terminar. Este guarda tu trabajo automático y trae dos líneas que frenan un guardado si hay un merge a medias. Es técnico: sirve a quien ya usa Git con Claude Code.

```
🔒 *Que el guardado automático no suba cosas a medias*

Si Claude Code guarda tu trabajo solo al terminar (un «hook Stop»), puede subir un merge a medias, con conflictos sin resolver.

Abajo: el hook, dos líneas que lo frenan y cómo probar que funciona.

Contame en General: ¿ya automatizás algo con hooks?
```

## ANTIGRAVITY · De Gemini CLI a Antigravity CLI

**Para Sergio Urcullo:** Google cerró Gemini CLI gratis y lo reemplazó por Antigravity. Explica qué cambia y cómo instalarlo.

```
🚀 *Gemini CLI gratis se apagó. Ahora es Antigravity*

Desde el 18 de junio, Google reemplazó Gemini CLI por Antigravity CLI. Sigue siendo gratis con una cuenta personal de Google, con un límite que se renueva cada semana.

Abajo: qué cambia y cómo instalarlo en 3 pasos (Mac, Linux y Windows).

Contame en General: ¿lo pudiste instalar?
```

## PROMESA · Bot con dos listas

**Para Sergio Urcullo:** La prueba del mismo bot con un pedido con fecha, con y sin la regla «no confirmes lo que no está escrito». Deja la plantilla para copiar.

```
🤝 *Dos listas para que tu bot no prometa de más*

Probé el mismo bot con un pedido con fecha. Con y sin reglas, ninguno prometió la entrega. Pero el que tenía dos listas (qué está confirmado y qué falta confirmar) usó el dato real y dijo claro qué faltaba.

Abajo: la prueba y la plantilla para tu bot.

Contame en General: ¿qué va en tu lista de «por confirmar»?
```

## PROMPT · Sacar el prompt de una imagen

**Para Sergio Urcullo:** Un prompt para que una IA adivine el prompt con el que se hizo una imagen o un video. Ordena la descripción en 8 bloques.

```
🖼️ *Cómo saco el prompt de una imagen que me gusta*

Primero reviso si el prompt está a la vista (en la descripción o en el video). Si no está, lo reconstruyo y lo digo: no es el original, es uno que da algo parecido.

Uso 8 bloques en orden: apertura, sujeto, rasgos, ropa, pose, fondo, cámara y luz, y lo que NO querés.

Abajo está el prompt completo para copiar.

Contame en General: ¿qué imagen querés recrear?
```

## VENTANA · La regla de 24 horas de WhatsApp

**Para Sergio Urcullo:** WhatsApp solo deja escribirle libre a un cliente durante 24 horas desde su último mensaje. Después, solo con una plantilla aprobada. Explica las reglas de mi bot y deja los dos textos.

```
⏱️ *La regla de las 24 horas de WhatsApp*

Si tu bot usa la API oficial de WhatsApp (Meta), solo puede escribirle libre a un cliente durante 24 horas desde su último mensaje. Pasado ese tiempo, solo con una plantilla que Meta apruebe antes.

Abajo: las reglas de mi bot y los dos textos de seguimiento.

Contame en General: ¿a las cuántas horas manda tu bot el seguimiento?
```

## MIGRAR · De Sonnet 4.5 a Sonnet 5.5

**Para Sergio Urcullo:** Anthropic apaga Sonnet 4.5 el 30 de noviembre. Es la lista para encontrarlo en tu proyecto y cambiarlo. Sirve a quien usa la API de Claude o n8n.

```
⚠️ *Sonnet 4.5 se apaga el 30 de noviembre*

Si tu bot o tu automatización usa el modelo Sonnet 4.5, deja de funcionar ese día. Anthropic recomienda pasar a Sonnet 5.5.

Abajo: cómo encontrarlo, cambiarlo con un comando y probar que funciona. En n8n se cambia a mano, nodo por nodo.

Contame en General: ¿cuántos lugares encontraste?
```

## EFFORT · La perilla de esfuerzo de Claude Code

**Para Sergio Urcullo:** El «esfuerzo» decide cuánto piensa Claude antes de contestar. Explica los niveles y cuándo usar cada uno.

```
🎚️ *La perilla de esfuerzo de Claude Code*

Claude Code tiene una perilla que decide cuánto piensa antes de contestar. En los modelos nuevos arranca en «medium», un nivel más abajo que antes.

Abajo: qué hace cada nivel y cómo probar cuál le conviene a tu tarea.

Contame en General: ¿qué tarea probaste y en qué nivel te quedó?
```

## MIRAR · Prompt para verificar mirando

**Para Sergio Urcullo:** Un prompt para que Claude abra tu página, saque capturas y las mire, en vez de decir «funciona» porque el código dio 200.

```
👀 *Cuando tu IA dice que funciona, pedile que lo mire*

Mi agente me dijo varias veces que algo funcionaba. Lo abrí yo y estaba roto. Buscar texto en el código no distingue una página que se ve bien de una rota.

Abajo: el prompt para que abra la página, saque capturas y las mire.

Contame en General: ¿alguna vez tu IA te dijo que algo funcionaba y no?
```

## WORKTREE · Dos sesiones de Claude Code sin pisarse

**Para Sergio Urcullo:** Un worktree es una segunda carpeta de tu proyecto con su propia rama. Sirve para que dos sesiones de Claude trabajen a la vez sin pisarse.

```
🌳 *Dos sesiones de Claude Code sin pisarse*

Si abrís dos sesiones en la misma carpeta, se pisan los archivos. La solución: darle a cada una su propia carpeta con su propia rama (un «worktree»).

Abajo: los 5 comandos, en orden.

Contame en General: ¿ya trabajás con dos sesiones a la vez?
```
