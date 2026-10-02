# Avisos de Onia Community, día por día · vie 2 → mié 14-oct-2026

**Cómo se usa:** el día indicado, pegá en *Avisos* cada texto (lo que está entre `~~~~`), en orden y **antes de la hora** (es la del primer video del día, 12:30; si subís el YouTube antes, pegá antes). La imagen o el archivo va justo después de su texto. Lo marcado ⛔ no se pega.
**De dónde sale cada texto:** copiado tal cual de su drop de origen, nombrado en cada aviso (`drops/2026-10-01.md`, `drops/2026-10-01-drops-noticias-repos.md` y la sección «Drops» de `plan-3-semanas/S1-GUIONES.md`, `S2-GUIONES.md`, `S3-GUIONES.md` y `S4-GITHUB-REPOS.md`). CACHE, VENTANA, PROMESA, PRUEBAS y REVISAR se armaron el 1-oct sin revisor y pasaron el revisor escéptico el 2-oct (lo corregido, en su origen). **Si se corrige un drop, se corrige en el origen y acá.**
**Cada recurso arranca con su PALABRA en negrita:** el que llega por DM la busca en Avisos. Al final: qué mandar por DM y los huecos.

---

### Jue 1-oct

Nada: lo de hoy no salió y pasa al viernes temprano.

---

### Vie 2-oct · antes de las 12:30

#### 2-1 · Vuelta + reto → TRAMPA (YouTube D01-C y carrusel K1 del sábado)
Origen: `drops/2026-10-01.md`, mensajes 1 y 2 (corregidos 1-oct: fecha y ritmo). Pegalo primero. Después, la imagen `carousels/out/sergio-comunidad-reto-presupuestos-20261001/slide-01.png`.

~~~~
Volví 👋

Desde hoy, lo que en mis videos y carruseles digo que «está en la comunidad» queda acá, en Avisos: el prompt completo, el archivo, o lo que me salió mal probándolo. Entero, y antes que el video.

Para conocerlos, preséntense en General con tres cosas:
1. Tu nombre
2. Qué estás construyendo o a qué te dedicás
3. Qué te gustaría aprender a hacer con IA

Y gracias a los que respondieron lo de los expertos: los estoy leyendo todos.

*TRAMPA* · *🎯 Reto: ¿tu IA encuentra la trampa?*

Te pasan tres presupuestos para una web. Uno anuncia «Total: Bs 700» y es mentira.

Le di esto mismo a Opus 5.5 y a Sonnet 5.5. Probalo con la IA que uses (ChatGPT, Gemini, Claude, la que sea). Copiá esto en un chat nuevo:

```
Necesito una web durante tres meses.
Requisitos obligatorios: dominio propio, poder exportar mis datos
y un costo total de los tres meses que no supere Bs 1200.

Propuesta A: instalación Bs 300. Servicio Bs 250 por mes.
Incluye dominio propio y exportación de datos. Sin otros cargos.

Propuesta B: instalación Bs 100. Servicio Bs 200 por mes.
El dominio propio es un extra obligatorio de Bs 120 por mes.
No permite exportación de datos. La oferta anuncia "Total tres meses: Bs 700".

Propuesta C: instalación Bs 0. Servicio Bs 350 por mes.
Configuración obligatoria por única vez: Bs 300.
Incluye dominio propio y exportación de datos. Sin otros cargos.

Compará el costo total de los tres meses, con cargos iniciales y extras
obligatorios. Mostrá la fórmula, citá el dato que usaste, detectá
contradicciones y decime qué propuestas cumplen TODOS mis requisitos.
No inventes condiciones. Usá solo esta información.
```

Contame en General: *¿qué IA usaste y cuál eligió?* Si te animás, calculalo vos primero.

La respuesta la dejo mañana sábado a las 10:00 👀
~~~~

#### 2-2 · Recursos de los videos de ayer → PLANILLA · COMUNIDAD (N03, modo auto) · TARIFA
Origen: drop 1 de `S1-GUIONES.md` · `N03` y `drop-2` de `drops/2026-10-01-drops-noticias-repos.md`. Van juntos para no pasar de 3 avisos.

~~~~
*PLANILLA* · *Planilla Sonnet vs Opus*
```
Tarea            | Modelo | Correcciones | Minutos hasta OK | ¿La usarías sin tocar?
T1 mecánica      | sonnet |              |                  |
T1 mecánica      | opus   |              |                  |
T2 diaria · T3 difícil: igual, una fila por modelo
Correr: claude --model sonnet --effort medium   y después   claude --model opus --effort medium
Mismo prompt, palabra por palabra. Cada prueba en una rama nueva desde el mismo commit.
Regla: si Sonnet empata en 2 de 3 → Sonnet por defecto; Opus para el tipo de tarea donde perdió.
```

———

*COMUNIDAD* · *Volver a modo manual en Claude Code*

Desde fines de septiembre Claude Code arranca en *modo auto*, en todos los planes: un segundo modelo revisa en vez de vos lo que Claude quiere hacer. Leer y editar archivos de tu carpeta, en general, se aprueba solo, sin esa revisión.

*Por defecto BLOQUEA* (documentación oficial, resumida):
- Bajar y ejecutar código de internet (tipo `curl | bash`)
- Deploys a producción y migraciones
- Borrar para siempre archivos que ya existían antes de la sesión
- Force push, y `git reset --hard` y parecidos, que tiran cambios sin guardar

*Por defecto DEJA PASAR:*
- Trabajar con archivos dentro de tu carpeta
- Instalar las dependencias declaradas en tus archivos lock o manifiestos
- Hacer push a cualquier rama del repo, *incluida la principal*

Si tu rama principal publica tu sitio o tu app, ese último punto es el que importa.

*En la sesión:* la barra de abajo dice en qué modo estás. *Shift+Tab* lo cambia.

*Para que arranque siempre preguntando (terminal):*
1. Abrí `~/.claude/settings.json` (`~` es la carpeta de tu usuario). Si no existe, crealo con esto:
```
{
  "permissions": {
    "defaultMode": "default"
  }
}
```
Si ya tiene contenido, no lo pises. Si tiene `"permissions"`, sumá adentro `"defaultMode": "default"`. Si no lo tiene, pegá el bloque `"permissions": {...}` de arriba dentro de las llaves de afuera, separado del resto con una coma.
2. Si tu proyecto tiene su propio `.claude/settings.json` (o `.claude/settings.local.json`) con otro `defaultMode`, ese le gana al tuyo: cambialo a `"default"` ahí también.
3. Si Claude Code te pregunta si querés pasar a modo auto, decí que no.

*Cómo sabés que quedó:* la próxima sesión que abras en la terminal dice `⏸ manual mode on`.

*En VS Code:* elegí *Manual* en el indicador de modo, abajo del cuadro de texto. Las conversaciones nuevas arrancan en el último modo que elegiste ahí.

Contame en General: *¿en qué modo te arrancó hoy Claude Code?*

———

*TARIFA* · *La cuenta de WhatsApp desde el 1-oct*

Vale para bots en la API oficial de Meta. La app de WhatsApp Business que usás a mano no cambia.

Los mensajes de servicio (lo que tu bot contesta dentro de las 24 h desde que el cliente escribió) ahora se cobran por mensaje, *a la misma tarifa que utilidad*. Los *primeros 1.000 de cada mes*, por número de WhatsApp de tu negocio, siguen gratis.

Llenalo con tu bot:
```
A. Respuestas que mandó tu bot
   dentro de las 24 h, el mes
   pasado (sin plantillas): ____
   (3 burbujas seguidas = 3)
B. A - 1.000: ____
   (si da negativo, poné 0)
C. Tarifa utility del país de
   tu cliente, en USD: ____
D. Costo del mes = B x C: ____
```
Dónde está C: developers.facebook.com/documentation/business-messaging/whatsapp/pricing → rate cards → Rates (CSV), en USD. La fila es el país del número de tu cliente: Bolivia (+591) está en «Rest of Latin America». Si no la encontrás, no la inventes.

Si B te dio 0, estás dentro de lo gratis. Si no, tu bot habla de más: mandá una respuesta en vez de tres burbujas.

Ojo: si no cargaste un método de pago en Meta, después de los 1.000 gratis tu bot deja de entregar respuestas.

Contá en General: *¿te dio cero o te toca pagar?*
~~~~

#### 2-3 · Recursos de hoy → EFFORT (video D02-A y carrusel K10) · MIRAR (D04-C) · CACHE (DD-A y su carrusel)
Origen: `drop-EFFORT` de `drops/2026-10-01-drops-noticias-repos.md` (corregido 1-oct: cierre a General) · drop 6 de `S1-GUIONES.md` · `CACHE` de `drops/2026-10-01-drops-noticias-repos.md` (revisado 2-oct: fórmula con la escritura en caché, «0» solo vale después del primer pedido, 30 minutos, contexto corto).

~~~~
*EFFORT* · *Mi tabla de esfuerzo para Claude Code*

En Claude Code, Opus 5.5 y Sonnet 5.5 arrancan en *medium*. Opus 5 y Sonnet 5 arrancaban en high. Si no tocaste nada, tu perilla quedó un nivel más abajo.

Ojo: la escala cambia según el modelo. En las pruebas de Anthropic, Opus 5.5 en medium iguala o supera a Opus 5 en high.

```
/effort
  ves en cuál estás y elegís
  entre los cinco niveles.
  Enter lo guarda como default;
  la tecla s, solo esta sesión
/effort auto
  borra el que guardaste
claude --effort <nivel>
  arranca una sola sesión
  en ese nivel

low         lo mecánico: renombrar,
            mover archivos
medium      el día a día
high/xhigh  cuando la primera
            respuesta no alcanzó
max         casi nunca: la doc dice
            que tiende a pensar de más
```
*Primero la perilla, después el modelo.* En mi empresa es regla: a Fable, el más caro, solo donde Opus no alcanza. La doc de Anthropic dice lo mismo: Fable cuando Opus 5.5 con más esfuerzo todavía no alcanza.

Para saber en qué nivel va una tarea, abrí una sesión con cada línea y dales la misma tarea:
```
claude --effort medium
claude --effort high
```
Si en high la corregís menos, va en high. Así probás sin dejar high guardado.

Probalo con una tarea tuya y contá en General: *¿qué tarea era y en qué nivel te quedó?*

———

*MIRAR* · *Prompt para verificar mirando*
```
No me digas que funciona por el código de respuesta ni por un grep.
Abrí <URL> con un navegador headless (Playwright), en ancho de celular y de computadora.
Sacá capturas de lo que se ve en pantalla, bajando de a una; no de la página entera de una vez.
Miralas y decime: qué texto ves, si algo se ve roto, cuánto pesó la página y cuánto tardó.
A mano: npx playwright install chromium   y después
        npx playwright screenshot --device "iPhone 11" <URL> captura.png
```

———

*CACHE* · *GPT-6.1 Sol: la tabla y la cuenta de la caché*

OpenAI lo presentó el 29-sep, en su DevDay. En la API se llama `gpt-6.1-sol`.

Por millón de tokens, en USD (página de precios de OpenAI, tarifa estándar y contexto corto, leída el 1-oct):
```
              entrada  desde caché  salida
gpt-6.1-sol   2,00     0,10         10
gpt-6-astra   10       1            50
```
Un quinto de Astra, en lo que entra y en lo que sale.

*La cuenta para tu agente*
```
Costo de un pedido (USD) =
( cached_tokens          x 0,10
+ cache_write_tokens     x 2,50
+ el resto de la entrada x 2
+ tokens de salida       x 10 ) / 1.000.000
```
Los dos primeros vienen en la respuesta de la API, en `usage.input_tokens_details`; el resto es `input_tokens` menos esos dos. Cada token se cobra a una sola tarifa: lo que se guarda en la caché cuesta 2,50 en vez de 2 esa vez; después, cada vez que se lee, 0,10: veinte veces menos.

*Para que funcione*
- Lo que repetís igual en cada pedido (las instrucciones de tu agente, tu lista de precios) va al principio y no se toca.
- Tiene que pasar de 1.024 tokens.
- Dura al menos 30 minutos desde el último pedido que la usó.
- Cómo sabés que anduvo: mirá `cached_tokens`. En el primer pedido da 0. Si después sigue en 0, cambiaste algo del principio o pasó más de media hora.

Contá en General: *¿qué parte de tus pedidos se repite siempre igual?*
~~~~

---

### Sáb 3-oct · a las 10:00 (antes del YouTube D01-C y del carrusel K1)

#### 3-1 · Respuesta del reto → TRAMPA
Origen: `drops/2026-10-01.md`, mensaje 3. Después, la imagen `carousels/out/sergio-comunidad-reto-presupuestos-20261001/slide-02.png`.

~~~~
*TRAMPA* · *La respuesta del reto*

✅ *A = Bs 1050* (300 + 250×3). Cumple todo.
❌ *B = Bs 1060* (100 + 200×3 + 120×3). Anuncia 700: esconde Bs 360 y además no deja exportar.
❌ *C = Bs 1350* (350×3 + 300). La instalación «gratis» vuelve como configuración y se pasa del tope.

Opus y Sonnet lo resolvieron igual: los dos encontraron los Bs 360. Para esto no hace falta el modelo caro.

Lo que te llevás, para usar con tus presupuestos reales (hosting, software, proveedores):

```
Compará estas propuestas: [pegalas acá].
Mis requisitos obligatorios: [lista].
Sumá el costo total de [N] meses con cargos iniciales y extras obligatorios.
Mostrá la fórmula, citá de dónde sacaste cada número y marcá si algún
"total anunciado" no coincide con la suma. No inventes condiciones.
```

La clave son dos pedidos: *la fórmula* y *de dónde sacó cada dato*. Así ves en segundos si la IA se equivocó.
~~~~

N06 (Gemini CLI) no sale: ver la nota ⛔ del drop N06. Queda un lugar para un repo de la reserva: lo decide Sergio Urcullo (y su aviso entra acá).

---

### Dom 4-oct · antes de las 12:30

#### 4-1 · MIGRAR (noticia N02 y su carrusel)
Origen: `N02` de `drops/2026-10-01-drops-noticias-repos.md`.

~~~~
*MIGRAR* · *Checklist: de Sonnet 4.5 a Sonnet 5.5*

Sonnet 4.5 (`claude-sonnet-4-5-20250929`) se retira de la API de Claude el *30 de noviembre de 2026*. Anthropic recomienda pasar a Sonnet 5.5.

*1. Encontralo.* En la carpeta de tu proyecto, sin mirar las dependencias instaladas (o con el buscador de tu editor):
```
grep -rn --exclude-dir=node_modules --exclude-dir=.venv --exclude-dir=.git "claude-sonnet-4-5" .
```
En n8n: abrí cada nodo de Anthropic y mirá qué modelo tiene elegido.

*2. Migralo.* Abrí Claude Code en esa carpeta y escribí:
```
/claude-api migrate this project to claude-sonnet-5-5
```
Te pregunta qué archivos tocar y al final te deja una lista para revisar a mano.

*3. Solo si programás contra la API:* revisá lo que 5.5 rechaza con error 400.
- `temperature`, `top_p` o `top_k` con valores cambiados → sacalos
- `thinking` con `budget_tokens` (pensamiento extendido) → sacalo y elegí un nivel de esfuerzo: `"output_config": {"effort": "low"}` para chat, `"medium"` para agentes
- `"thinking": {"type": "disabled"}` → probá primero sin `thinking` y con esfuerzo `low`. Si lo necesitás apagado: `{"type": "between_tools"}`, sin otros campos y con esfuerzo `high` o menos
- Respuestas pre-llenadas (prefill: el último mensaje del asistente escrito por vos) → usá salidas estructuradas (`output_config.format`) o pedí el formato en el mensaje de sistema
- Obligar a usar una herramienta (`tool_choice` `any` o `tool`) → `{"type": "auto"}`, `strict: true` en la herramienta (su esquema con `additionalProperties: false` y `required`), y decí en el prompt cuándo usarla

En n8n, pasá directo al paso 4: si da error 400, compará el mensaje con esta lista.

*4. Probá.* Tu prueba corre sin error 400 y el campo `model` de la respuesta dice el modelo nuevo.

Contame en General: *¿cuántos resultados te dio la búsqueda del paso 1?*
~~~~

#### 4-2 · VENTANA (S2-D07-A; también el carrusel K5 del dom 11)
Origen: `VENTANA` de `drops/2026-10-01-drops-noticias-repos.md` (revisado 2-oct; textos copiados de `bot/config.mjs`; corregidos «20 h después de ese mensaje», «tus números y los de prueba» y «empieza o termina en una variable»).

~~~~
*VENTANA* · *Mis mensajes de seguimiento*

Vale para bots en la API oficial de Meta. En la app de WhatsApp Business, a mano, esta regla no existe.

*Las reglas de mi bot*
1. Dentro de las 24 h desde el último mensaje del cliente: texto libre. Mi bot manda un solo seguimiento, 20 h después de ese mensaje: le quedan 4 h de margen.
2. Pasadas las 24 h: solo una plantilla aprobada por Meta. Texto libre ahí falla con el error 131047: buscalo en los registros de tu bot.
3. Pasados 7 días: no escribe más.
4. Nunca de madrugada: fuera de 8:00 a 21:00 el mensaje espera y sale a las 8:00.
5. Tus números y los de prueba, afuera de la lista.

*El de dentro de las 24 h* (texto libre):
> ¡Hola de nuevo! Te escribí ayer por la demo de [producto] y quedó a medias — sé que el negocio no para.
> Te dejo dos opciones nuevas por si te sirven: *[horario 1]* o *[horario 2]*.
> Decime cuál te queda mejor y la dejamos agendada.

*El de después* (plantilla aprobada por Meta):
> ¡Hola de nuevo! Te escribí por la demo de Onia y quedó a medias — sé que el negocio no para.
> Si querés retomarla, te dejo dos horarios: *{{1}}* o *{{2}}*.
> Decime cuál te queda mejor y la dejamos agendada.

Fijate que cierra con una frase fija: Meta rechaza una plantilla que empieza o termina en una variable.

Antes de programar tu seguimiento, mandá tus plantillas a aprobar.

Contá en General: *¿a las cuántas horas manda tu bot el seguimiento?*
~~~~

SKILL (D01-A y carrusel K2) va a la web: no lleva aviso.

---

### Lun 5-oct · antes de las 12:30

#### 5-1 · AGENTS (D03-B)
Origen: drop 11 de `S1-GUIONES.md` (era «por DM»; pasó a Avisos el 1-oct).

~~~~
*AGENTS* · *AGENTS.md y CLAUDE.md, juntos*
```
AGENTS.md → las reglas compartidas (Claude Code, Codex y los demás)
CLAUDE.md → primera línea:   @AGENTS.md
            debajo: solo lo que es de Claude Code
Windows: usá el import, no un symlink (Git lo clona como texto plano).
Comprobar: preguntale a Claude una regla que solo está en AGENTS.md.
```
~~~~

#### 5-2 · VERIFY (noticia N04 y su carrusel)
Origen: `N04` de `drops/2026-10-01-drops-noticias-repos.md`.

~~~~
*VERIFY* · *Plantilla: la skill verify*

Desde el 30-sep (Claude Code 2.1.286): si tu proyecto tiene una skill llamada `verify`, a Claude se le indica correrla justo antes de commitear, *salvo en commits que solo tocan documentación o solo tests*. Vale cuando commitea Claude, no en un `git commit` que hacés vos a mano. *Es una indicación, no un candado.*

1. En tu proyecto creá el archivo `.claude/skills/verify/SKILL.md`
2. Pegá esto y poné tus chequeos:
```
---
name: verify
description: Chequeos obligatorios antes de cada commit
---
Antes de commitear, corré en orden:
1. Que compile: npx tsc --noEmit
2. Los tests del proyecto: [tu comando de tests]
3. Si algo falla: no commitees. Decí qué falló y dónde.
```
El chequeo 1 es para proyectos TypeScript. Si el tuyo es otro, poné el comando que lo compila.
3. Actualizá Claude Code: `claude update`

Ojo: tu skill reemplaza al `/verify` que trae Claude Code (el que arma y corre tu app para probar que un cambio hace lo que tiene que hacer). Y si ya usaste ese `/verify`, puede haber guardado su receta en este mismo archivo: abrilo antes de pisarlo.

*Cómo sabés que anduvo:* pedile a Claude un commit que toque código (no solo un README o un test) y fijate que antes aparezca la skill verify corriendo.

Contame en General: *¿qué chequeo le pusiste a tu verify?*
~~~~

#### 5-3 · PROMESA (S2-D08-A y carrusel K6)
Origen: `PROMESA` de `drops/2026-10-01-drops-noticias-repos.md` (revisado 2-oct; copiado de `PRODUCCION-GUIONES-2026-09-29.md` §Prueba 2; agregada la línea que explica los `[…]`). ⚠️ Las respuestas están recortadas (`[…]`) y las completas no están en el repo; el guion y el caption de K6 dicen «completas»: al grabar, decí «las dos respuestas están en la comunidad», sin «completas», y sacalo también del caption de K6.

~~~~
*PROMESA* · *Bot con dos listas: la prueba del 28-sep*

Negocio de ejemplo (inventado para la prueba): Cajas Kuska, cajas de cartón con logo. El cliente escribe:
«Hola! Necesito 200 cajas con mi logo para este viernes, ¿me las pueden entregar?»

*1. Sin reglas* (solo «sé amable y vendedor, tratá de cerrar la venta»):
> ¡Hola! Gracias por escribirnos a Cajas Kuska. Claro que sí, con gusto te ayudamos con tus 200 cajas con logo. Para el viernes el plazo es justo, y no quiero prometerte una fecha que después no te pueda cumplir. Por eso lo confirmo con producción apenas tenga tus datos. Pasame por favor: 1. Las medidas de la caja […] 2. Tu logo en buena calidad […] 3. A qué zona de Santa Cruz te lo entregamos. Con eso te confirmo si llegamos al viernes y te paso la cotización. Si no se pudiera, te digo la fecha más cercana […]

*2. Con dos listas* («nunca confirmes stock, precio ni fecha si no están acá. Confirmado: desde 50 unidades. NO confirmado: stock, plazo, precio»):
> ¡Hola! Gracias por escribirnos a Cajas Kuska 😊 Sí, fabricamos cajas de cartón personalizadas con tu logo, y 200 unidades está dentro de lo que trabajamos (hacemos desde 50). Todavía no puedo asegurarte la entrega para este viernes. Tengo que confirmar el plazo de producción con el equipo y te aviso apenas lo tenga. […] Con eso te confirmo precio y plazo real.

Ninguna prometió. La segunda usó el dato confirmado. Sonnet 5.5, una corrida por caso. Los […] son partes que no quedaron en mi registro.

*La plantilla para tu bot*
```
Nunca confirmes stock, precio ni fecha si no están acá.
Confirmado: [lo que ya podés prometer]
Por confirmar antes de prometer: [lo que siempre se confirma antes]
```
*Probalo:* mandale un pedido con fecha. Si la confirma sin tenerla escrita, le faltan las dos listas.

Contá en General: *¿qué va en tu lista de «por confirmar»?*
~~~~

---

### Mar 6-oct · antes de las 12:30 (o antes de subir el YouTube D03-C)

#### 6-1 · HISTORIA (YouTube D03-C y carrusel K3)
Origen: drop 4 de `S1-GUIONES.md`.

~~~~
*HISTORIA* · *Plantilla de regla con historia*
```
## <Nombre de la regla> (REGLA)
> <Quién la pidió>, <fecha>: «<la frase textual o el incidente, en una línea>».
- Qué se hace: <instrucción concreta, que se pueda verificar>.
- Qué NO se hace: <lo prohibido>.
- Corregido <fecha>: <si estuvo mal escrita, qué decía y por qué era falso>.
Orden del archivo: al arrancar → las que más se rompen → producto → cómo se trabaja → detalle. Menos de 200 líneas.
```
~~~~

#### 6-2 · DIAGRAMA (R01)
Origen: `R01` de `drops/2026-10-01-drops-noticias-repos.md`.

~~~~
*DIAGRAMA* · *GitDiagram: cambiá hub por diagram y mirá cómo está armado un repo*

Convierte un repo público de GitHub en un diagrama con sus partes y cómo se conectan. Tocás una parte y te lleva a su archivo. Código abierto, licencia MIT.

*1. En el navegador:* en la dirección del repo cambiás _hub_ por _diagram_.
```
github.com/harry0703/MoneyPrinterTurbo
gitdiagram.com/harry0703/MoneyPrinterTurbo
```

*2. En la terminal* (servidor MCP para Claude Code, sin clave ni cuenta). Correlo dentro de la carpeta del proyecto donde lo vas a usar: por defecto queda solo ahí.
```
claude mcp add --transport http gitdiagram https://gitdiagram.com/mcp
claude mcp list
```
El segundo comando te muestra si quedó conectado. Después, dentro de Claude Code, pedile a tu agente que te explique la arquitectura de un repo público *antes* de tocarlo.

*Ojo:* para repos privados te pide un token de GitHub. Eso es darle acceso a tu código a un servicio de otra persona. Para lo privado, no.

*Mini-tarea:* abrí el diagrama de un repo que uses y contá en General qué hace su parte principal, sin abrir ningún archivo.
~~~~

---

### Mié 7-oct · antes de las 12:30

#### 7-1 · HOOK (D03-A y carrusel K11)
Origen: drop 3 de `S1-GUIONES.md` (corregido 1-oct: ruta fuera del JSON y prueba del conflicto).

~~~~
*HOOK* · *Hook Stop + guarda*

En `.claude/settings.json`:
```
{ "hooks": { "Stop": [ { "hooks": [ { "type": "command", "command": "node scripts/git-autosync.js" } ] } ] } }
```
```
# En tu script, ANTES de git add / commit. Si alguno imprime algo: salir sin tocar nada.
git rev-parse -q --verify MERGE_HEAD     # imprime un hash si hay un merge a medias
git diff --name-only --diff-filter=U     # lista los archivos en conflicto
# Comprobar 1: /hooks dentro de Claude Code tiene que listar tu Stop.
# Comprobar 2: en una carpeta de prueba, git init, dos ramas que cambian la misma línea
#   del mismo archivo, git merge (queda en conflicto) y corré tu script:
#   tiene que avisar y no commitear.
```
~~~~

#### 7-2 · ESCANEO (G04)
Origen: drop 4 de `S4-GITHUB-REPOS.md` §5 (era «por DM»; corregido 1-oct: la línea de OSV.dev).

~~~~
*ESCANEO* · *Antes de instalar una skill: escaneala* (README de NVIDIA/SkillSpector)
```
uv tool install git+https://github.com/NVIDIA/skillspector.git
skillspector scan https://github.com/<autor>/<skill> --no-llm
skillspector scan ./mi-skill/ --no-llm --format json --output report.json

Puntaje: 0-20 SAFE · 21-50 CAUTION · 51-100 DO NOT INSTALL
En scripts: SAFE y CAUTION salen con código 0 → agregá --fail-on-findings
Sin --no-llm, el contenido escaneado va al modelo configurado.
Con --no-llm igual consulta OSV.dev con los nombres de las dependencias (no el contenido).
```
~~~~

**General (opcional):**
~~~~
¿Qué skill estás por instalar? Pasala por el escáner y contá acá qué te dio.
~~~~

DELEGAR (D04-A) va a la web `/claude-code`: no lleva aviso. ⚠️ Esa sección todavía dice «3 subagentes» (hoy es 1): corregir la web antes del miércoles.

---

### Jue 8-oct · antes de las 12:30

#### 8-1 · DOCTOR (D04-B)
Origen: drop 5 de `S1-GUIONES.md` (corregido 1-oct: ruta fuera del JSON).

~~~~
*DOCTOR* · *Apagar skills que no usás*

En `.claude/settings.local.json` (o /skills → Espacio cambia el estado → Esc guarda):
```
{ "skillOverrides": { "skill-que-nunca-uso": "off", "skill-de-vez-en-cuando": "name-only" } }
```
```
Estados: "on" (nombre + descripción) · "name-only" · "user-invocable-only" (solo vos la llamás) · "off"
Medir: /skill-doctor (costo y uso por skill) · /doctor antes y después (peso de la lista de skills)
Las skills de plugins no se tocan acá: /plugin.
```
~~~~

#### 8-2 · CODEGRAPH (R06)
Origen: `R06` de `drops/2026-10-01-drops-noticias-repos.md`. Condición: releer el README ese día; si cambió, gana el README.

~~~~
*CODEGRAPH* · *CodeGraph: instalar, apagar la telemetría y desinstalar*

Le da a tu agente un mapa de tu código. Corre en tu máquina, licencia MIT. Los pasos, según su README:

*1. Instalar*
Mac/Linux: bajá el instalador y leelo antes de correrlo (de less salís con q).
```
curl -fsSL https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.sh -o install.sh
less install.sh
sh install.sh
```
Windows (PowerShell): abrí primero https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 en el navegador y leelo. Después:
```
irm https://raw.githubusercontent.com/colbymchenry/codegraph/main/install.ps1 | iex
```
Si tenés Node, en cualquier sistema: `npm i -g @colbymchenry/codegraph`

*2. Conectarlo a Claude Code* (en una terminal nueva)
```
codegraph install
```
Te pregunta «Share anonymous usage stats?» y viene marcado que sí: elegí No. Si ya dijiste que sí: `codegraph telemetry off`

*3. Armar el mapa, dentro de tu proyecto*
```
codegraph init
```

*Para sacarlo todo, en este orden*
```
codegraph uninit
codegraph uninstall
```
El primero, dentro de cada proyecto: borra su mapa (la carpeta .codegraph). El segundo lo saca de cada agente que configuró y borra el programa.

*Ojo*
- `codegraph install` escribe una sección en tu CLAUDE.md y deja permisos automáticos para sus herramientas en Claude Code. `codegraph uninstall` los saca.
- Su propio README avisa: al final de una sesión larga te queda *más* contexto ocupado, no menos.
- La tabla de ahorro del README (siete repos) la midió el autor.

*Mini-tarea:* hacele a tu agente una pregunta sobre tu código y contá en General si usó CodeGraph o abrió archivo por archivo.
~~~~

#### 8-3 · PRUEBAS (carrusel K4)
Origen: `PRUEBAS` de `drops/2026-10-01-drops-noticias-repos.md` (revisado 2-oct; copiado del brief de K4; corregidas la prueba 2, «el mismo mensaje reentregado, con el mismo id», y la 5, «Pedí hablar con una persona»).

~~~~
*PRUEBAS* · *Las 5 pruebas antes de activar tu bot*

Mandale vos los mensajes que le van a mandar tus clientes:
1. *Como tu cliente:* sin tildes, «cuanto sale?», «ya»
2. *Dos veces:* el mismo mensaje reentregado, con el mismo id (pasa si tu servidor tarda): contesta una sola vez
3. *Lo que no sabe:* stock, plazo, precio: no inventa
4. *Un audio:* si no lo entiende, avisa a alguien
5. *Pedí hablar con una persona:* alguien se entera, no solo el bot

La que más importa es la 3: si contesta con un dato que no está en su información, lo inventó. Si inventa, no se activa.

Contá en General: *¿cuál te falló?*
~~~~

CLAVE (S2-D12-B) va a la web `/stack`: no lleva aviso.

---

### Vie 9-oct · antes de las 12:30 (o antes de subir el YouTube G11)

#### 9-1 · REPOS (YouTube G11)
Origen: drop 11 de `S4-GITHUB-REPOS.md` §5.

~~~~
*REPOS* · *Repos de IA: ocho chequeos + comandos*
```
DÓNDE MIRAR
github.com/trending            (?since=weekly · filtro por lenguaje)
gh search repos --created=">2026-08-29" --stars=">300" --sort=stars --limit 50
gh search repos "claude code" --created=">2026-08-29" --sort=stars --limit 30
(cambiá la fecha: un mes antes de hoy)

LOS OCHO CHEQUEOS
1. ¿Resuelve MI problema? (no el ranking)
2. ¿Oficial, empresa dueña o comunidad?
3. Creado hace… (menos de un mes → esperá)
4. Último cambio en la rama principal
5. Issues abiertos vs cerrados:
   gh api -X GET search/issues -f q="repo:DUEÑO/REPO is:issue is:open"   --jq .total_count
   gh api -X GET search/issues -f q="repo:DUEÑO/REPO is:issue is:closed" --jq .total_count
6. Licencia, abriendo el archivo LICENSE:
   gh repo view DUEÑO/REPO --json licenseInfo,createdAt,pushedAt,stargazerCount
   ("Other" = abrí el archivo)
7. README: qué instala · qué pide · a dónde manda datos · quién gana
8. Si es skill: escanearla (drop 4)
```
~~~~

#### 9-2 · PDF (R03)
Origen: `R03` de `drops/2026-10-01-drops-noticias-repos.md`. Condición: releer el Quickstart ese día; si cambió, gana el README.

~~~~
*PDF* · *PageIndex: el script del Quickstart, comentado en español*

Hace que la IA lea un PDF largo por secciones: arma un índice en forma de árbol y el modelo razona por dónde entrar. Licencia MIT.

*1. Instalar, dentro de un entorno virtual* (en Mac con Homebrew y en Ubuntu o Debian recientes, pip suelto falla con «externally-managed-environment»)
```
python3 -m venv .venv
source .venv/bin/activate
pip install -U pageindex
```
En Windows: `py -m venv .venv`, después `.venv\Scripts\activate`, y el mismo pip.

*2. Guardá esto como probar.py, en la misma carpeta que tu PDF*
```
import os
from pageindex import PageIndexClient

# Tu clave de OpenAI: el texto del PDF va a OpenAI
os.environ["OPENAI_API_KEY"] = "tu-clave-de-openai"

client = PageIndexClient(
    index="gpt-5.6-luna",  # arma el índice: alcanza un modelo básico
    chat="gpt-5.6-sol",    # busca en el índice: el mejor que puedas pagar
)

# Cambiá report.pdf por tu archivo. El índice se arma una vez:
# ~USD 0,001 por página según el README (1.000 páginas, poco más de 1 dólar)
doc_id = client.submit_document("report.pdf")["doc_id"]

# Cada pregunta también se cobra en tu cuenta de OpenAI.
# Preguntá algo cuya respuesta YA sepas, y pedí dónde lo encontró
answer = client.chat("¿[tu pregunta]? Decime en qué página está.", doc_id=doc_id)
print(answer)
```

*3. Correr* (con el entorno virtual activado, en cualquier sistema)
```
python probar.py
```

*Ojo*
- No pegues probar.py en General ni en ningún chat: tiene tu clave. Si pedís ayuda, borrala antes.
- «Modo local» quiere decir que el índice se arma en tu máquina, pero el texto del PDF va a OpenAI. Probalo con un documento *sin datos de clientes*.
- En modo local es para PDFs con texto, no escaneados.

Y el 98,7 % de acierto que muestran es una medición suya en otra prueba (FinanceBench, con su sistema Mafin 2.5), no de este script.

*Mini-tarea:* correlo con un PDF tuyo y contá en General si te dijo bien la página.
~~~~

#### 9-3 · REVISAR (carrusel K9)
Origen: `REVISAR` de `drops/2026-10-01-drops-noticias-repos.md` (revisado 2-oct, sin cambios; copiado del brief de K9).

~~~~
*REVISAR* · *Mi editor de IA, paso a paso*

No tengo editor de video: lo edita una cadena de pasos con IA. Pero hay cosas que la IA no revisa por mí.
```
1. Grabar
2. Transcribir
3. Cortar: antes, una tabla con qué queda,
   qué se tira y por qué. La reviso yo.
4. Subtitular
5. Leer la transcripción a ojo, línea por
   línea, antes de quemar los subtítulos
6. Publicar
```
*Antes de publicar, 5 revisiones:*
- Cortes: tabla revisada antes de cortar
- Texto: transcripción leída a ojo
- Caras: terceros difuminados y revisados
- Costo: cotizado; el video, aprobado aparte
- Presentador IA: nunca como cliente ni testimonio

Una falta quemada no se parchea: se vuelve a renderizar.

Contá en General: *¿qué paso hacés todavía a mano?*
~~~~

---

### Sáb 10-oct · antes de las 12:30

#### 10-1 · WORKTREE (D05-A y carrusel K12)
Origen: drop 12 de `S1-GUIONES.md` (era «CARRIL, por DM»; pasó a Avisos el 1-oct).

~~~~
*WORKTREE* · *Dos sesiones sin pisarse: los comandos*
```
git worktree add -b carril-web ../mi-proyecto-web     # carpeta nueva con rama nueva
cd ../mi-proyecto-web && claude                       # o, desde el proyecto: claude -w carril-web
git -C ../mi-proyecto-web branch --show-current       # verificar la rama ANTES de reset/checkout/merge/push
git worktree list                                     # una carpeta = una rama
git worktree remove ../mi-proyecto-web                # al terminar, con la rama ya mergeada
```
~~~~

#### 10-2 · DOBLE (S2-D09-A)
Origen: drop 5 de `S2-GUIONES.md`.

~~~~
*DOBLE* · *Dos filtros contra la respuesta doble*
```
1. Al entrar el aviso, sacá el id del mensaje (API de WhatsApp: entry → changes → value → messages → id).
2. Filtro rápido: si ese id está en memoria desde hace menos de 10 min → respondé 200 y no hagas nada más.
3. Filtro durable: guardá el id en tu base, con valor único, antes de contestar; si ya existe → no contestes.
4. Si el turno falla antes de mandar la respuesta → borrá el id, para que el reintento sí se procese.
5. Devolvé el 200 rápido; lo lento, después.
6. Prueba: el mismo aviso dos veces → una sola respuesta.
```
~~~~

#### 10-3 · ⛔ MARKETING (R05) — no pegar hasta que decidas
Origen: `R05` de `drops/2026-10-01-drops-noticias-repos.md`. **Decidí vos:** el paquete de marketing entero, escaneado el 1-oct, da 100/100 · DO NOT INSTALL. Si no lo recomendás, borrá la viñeta «O el paquete entero» y su bloque de comandos (y el guion R05 cambia, ver la condición en el origen). Antes, confirmá en la laptop que una skill con puntaje bajo muestra CAUTION.

~~~~
*MARKETING* · *claude-skills: escaneá cada skill antes de instalarla*

Catálogo gratis de skills para Claude Code, licencia MIT, por paquetes. No instales todo. El de marketing trae 48 skills y más de 60 scripts de Python que corren en tu máquina.

*Cinco para un negocio chico*
- page-cro: por qué tu página no convierte
- copywriting: los textos de tu web (inicio, precios, producto)
- local-seo-manager: SEO local para negocios que van a la casa del cliente (plomería, limpieza, reparaciones): perfil de Google Business y respuestas a reseñas
- cold-email: correos en frío a empresas que todavía no te conocen
- social-content: posts para Instagram, TikTok, LinkedIn o Facebook

*1. Escaneá esas cinco, de a una.* Con el escáner de NVIDIA (necesitás uv). Con --no-llm, el contenido no sale de tu computadora:
```
uv tool install git+https://github.com/NVIDIA/skillspector.git
git clone https://github.com/alirezarezvani/claude-skills.git
skillspector scan ./claude-skills/marketing-skill/skills/page-cro/ --no-llm
```
Repetí la última línea cambiando page-cro por copywriting, local-seo-manager, cold-email y social-content. De a una, no la carpeta entera: el puntaje suma todos los archivos que escanea.

*Leé la línea Recommendation, no solo el número*
- SAFE: adelante.
- CAUTION: leé los hallazgos (Issues). Si el puntaje es bajo y aun así dice CAUTION, es que el escaneo quedó parcial: lo ves en «Inspection Completeness».
- DO NOT INSTALL: esa no.

*2. Instalá*
- *Solo las que pasaron* (lo más seguro): copiá la carpeta de cada una (claude-skills/marketing-skill/skills/page-cro y las demás) a ~/.claude/skills/. Así lo indica el README, en «Manual Installation».
- *O el paquete entero*, con los dos comandos del video, dentro de Claude Code. Trae las 48, y escaneado entero da DO NOT INSTALL, por tres hallazgos HIGH en archivos de referencia de analytics-tracking y seo-audit. Leelos antes de decidir.
```
/plugin marketplace add alirezarezvani/claude-skills
/plugin install marketing-skills@claude-code-skills
```
En los dos casos comprobás con /skills: tiene que aparecer page-cro.

*Ojo*
- El README no coincide consigo mismo: 388 skills en un lado, 345 en otro. No es evidencia.
- Una parte se vende aparte: STORE.md ofrece paquetes y skills sueltas, de USD 9 a 99.
- El último cambio del repo es del 26 de agosto.

*Pregunta para General:* ¿qué Recommendation te dio page-cro, y por qué?
~~~~

---

### Dom 11-oct · antes de las 12:30

#### 11-1 · ANUNCIO (S2-D08-C)
Origen: drop 4 de `S2-GUIONES.md` (corregido 1-oct: «hasta 7 días» y «si le contestás dentro de las 24 h»).

~~~~
*ANUNCIO* · *Cuánto cuesta tu bot desde el 1-oct*
```
A = mensajes que manda tu negocio por día · B = días que atendés por mes · C = A × B (mensajes al mes)
D = tarifa de tu país en la tabla de Meta (columna utilidad: la de servicio es la misma) · E = (C − 1000) × D (costo al mes; los primeros 1.000 de servicio por mes y por número son gratis; si da negativo, es 0)
Fuente: developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages
Para bajar E: una respuesta en vez de tres burbujas · no te escribas a vos mismo · las conversaciones que empiezan en un anuncio de clic a WhatsApp abren una ventana gratis de hasta 7 días, si le contestás dentro de las 24 h y solo si el cliente escribe desde la app del celular (página de precios, «Free entry point windows»).
Si contestás a mano desde la app WhatsApp Business, esto no te toca.
```
~~~~

#### 11-2 · DERECHOS (R02)
Origen: `R02` de `drops/2026-10-01-drops-noticias-repos.md`. Condición: releer `README-en.md` ese día; si cambió «Background Music» o el comando de Docker, gana el README.

~~~~
*DERECHOS* · *Antes de publicar un video hecho con MoneyPrinterTurbo*

Te arma un video corto desde un tema: guion, voz, imágenes de stock, subtítulos y música. Licencia MIT. Así lo levantás, según su README en inglés. Necesitás Docker Desktop; en Windows, el README pide usarlo con WSL: corré esto dentro de WSL.
```
git clone https://github.com/harry0703/MoneyPrinterTurbo.git
cd MoneyPrinterTurbo
cp config.example.toml config.toml
docker compose -f docker-compose.release.yml up
```
Abrís localhost:8501 en el navegador y en *Configuración básica* cargás la clave de un modelo (y la de Pexels o Pixabay para el stock).

*Checklist antes de publicar*
1. *Música:* según su README, la que trae sale de videos de YouTube. No la uses. Con Docker no alcanza con borrar la carpeta resource/songs: las canciones vienen dentro de la imagen. Lo que sí sirve: en _Fuente de música de fondo_ viene elegida _Música de fondo aleatoria_, que usa esas canciones. Cambiala a _Sin música de fondo_ o a _Música de fondo personalizada_, con un tema tuyo o con licencia.
2. *Imágenes:* salen de Pexels, Pixabay o Coverr. Leé sus condiciones en su propia página.
3. *Voz:* Edge TTS (en la app figura como Azure TTS V1) es gratis y sin clave.
4. *Guion:* leelo vos. Si lo podría decir cualquier otro negocio, reescribilo.
5. *Sponsors:* algunos enlaces de los sponsors del README son de afiliado (llevan aff=). Es normal; sabelo.

*Pregunta para General:* ¿de dónde vas a sacar la música de tus videos?
~~~~

CHAT (D05-B) va a la web `/claude-code`: no lleva aviso. VENTANA (carrusel K5) usa el aviso del dom 4, si se escribió.

---

### Lun 12-oct · antes de las 12:30

#### 12-1 · HANDOFF (D06-A)
Origen: drop 7 de `S1-GUIONES.md`.

~~~~
*HANDOFF* · *Plantilla de handoff de siete campos*
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
~~~~

#### 12-2 · ESQUELETO (carrusel K13)
Origen: drop 8 de `S1-GUIONES.md` (corregido 1-oct: `ANTHROPIC_AUTH_TOKEN`).

~~~~
*ESQUELETO* · *Esqueleto del corredor (Claude Code en un servidor, sin API key)*
```
#!/usr/bin/env bash
set -uo pipefail
exec 9>/tmp/loop-NOMBRE.lock; flock -n 9 || exit 0      # la vuelta anterior sigue viva: esta no arranca
cd /ruta/al/worktree || { echo "no pude entrar" >> loop.log; exit 2; }   # acá va tu aviso (1 cada 6 h)
[ "$(git branch --show-current)" = "rama-esperada" ] || exit 2
unset ANTHROPIC_API_KEY ANTHROPIC_AUTH_TOKEN             # que use la suscripción, no una clave suelta
timeout 50m claude -p --allowedTools "Read,Edit,Grep,Glob,Bash" < prompt.md >> loop.log 2>&1
# cron en UTC (Bolivia = UTC-4): 5 * * * * /ruta/loop.sh   · instalar con archivo temporal + bash -n + mv
```
~~~~

#### 12-3 · REMOTION (R07)
Origen: `R07` de `drops/2026-10-01-drops-noticias-repos.md`. Condición: releer `LICENSE.md` ese día (avisa un cambio en Remotion 5.0).

~~~~
*REMOTION* · *Remotion: ¿en qué licencia caés?*

Remotion hace videos con React y trae skills para que tu agente arme el video (remotion.dev/docs/ai/skills). Si tenés Node.js:
```
npx create-video@latest
```

La licencia *no es MIT*: GitHub muestra «Other». Esto dice su LICENSE.md:

*Gratis (Free License), incluso para uso comercial, si sos:*
1. una persona
2. una empresa con fines de lucro de hasta 3 empleados
3. una organización sin fines de lucro
4. alguien evaluando si le sirve, que todavía no lo usa de forma comercial

*Licencia de empresa (paga):* si no entrás en ninguno de esos cuatro grupos.

*Prohibido para todos:* copiar o modificar el código de Remotion para vender, alquilar o licenciar tu propia versión de Remotion.

Casos borde: remotion.pro/faq · Precios: remotion.pro/license
El mismo archivo avisa que en Remotion 5.0 la licencia va a cambiar un poco: releela cuando actualices.

Esto es lo que dice el texto, no un consejo legal.

*Pregunta para General:* ¿en qué grupo caés vos: 1, 2, 3, 4 o empresa? Anotalo.
~~~~

**General → CONTAR** (D05-C: el que comenta CONTAR recibe el link a la comunidad; esto es lo que encuentra). Sale del guion final D05-C:
~~~~
*CONTAR* · ¿Te pasó algo parecido: la IA te dio un dato viejo como si fuera de hoy? Contalo acá.

El prompt del video, para pegarle antes de borrar o apagar algo:
«Antes de tocar nada, mostrame el comando con el que contaste esto y correlo de nuevo ahora. Quiero el número de hoy».
~~~~

---

### Mar 13-oct · antes de las 12:30 (o antes de subir el YouTube S2-D07-C)

#### 13-1 · CAPAS (YouTube S2-D07-C)
Origen: drop 2 de `S2-GUIONES.md` (corregido 1-oct: la variante que frena «cuesta poco»).

~~~~
*CAPAS* · *Las tres capas de un bot que no inventa*
```
Capa 1 · Datos: una fila por dato (horario, dirección, formas de pago, preguntas frecuentes). El bot lee de ahí y de ningún otro lado.
Capa 2 · Control después de la IA (n8n: nodo If → «matches regex» sobre el texto en minúscula y sin tildes):
  precio:  (\d+([.,]\d+)?\s*(bs|bolivianos?|usd|dolares?)\b)|\b(bs|usd)\.?\s*\d
  (opcional, como en el video: sumale |\bcuesta\b y también frena «cuesta poco», aunque no tenga número)
  promesa: \bgarantiz\w+|\bsin falla\w*
  persona: \bsoy (una persona|humano)\b|\bte llamo (ahora|en un rato)\b
  Si coincide → texto seguro: «Eso prefiero no contestártelo yo: soy un bot y no quiero darte un dato equivocado. Te lo confirma una persona.»
Capa 3 · Prueba: 10 frases que deben bloquearse («Bs 999 por mes, oferta especial», «garantizamos resultados»…) y 10 que deben pasar. Correlas después de cada cambio.
```
~~~~

#### 13-2 · README (G10)
Origen: drop 10 de `S4-GITHUB-REPOS.md` §5.

~~~~
*README* · *Cuatro chequeos de un README*
```
1. ¿El primer comando es del proyecto o de un sponsor?
2. ¿Tiene --yes (o -y)? Sacalo la primera vez: mirá qué instala.
3. ¿Abre algo a internet (túnel, puerto, servidor)? ¿Cómo se protege?
4. ¿De quién es cada parte y con qué licencia? (sección Attribution / LICENSE)
Si no podés responder las cuatro, todavía no lo instales.
```
~~~~

#### 13-3 · BRIEF (carrusel K7) — texto + archivo
Origen: el brief del carrusel K7 (`carousels/briefs/marca-personal/sergio-k7v2-carruseles-por-codigo-20260929.json`, la versión final). Después del texto, adjuntá ese archivo. ⚠️ El cierre de K7 todavía dice «te mando por mensaje el JSON»: alinealo a «te paso el link de la comunidad» o mandá el archivo por DM y salteá este aviso.

~~~~
*BRIEF* · *El JSON de mi carrusel «Carruseles por código»*

Es el archivo con el que se armó el carrusel de hoy: todo el texto en un JSON, cada lámina con su rol. Va adjunto acá abajo.
~~~~

**General (opcional):**
~~~~
¿Cuál es la frase que tu bot nunca debería mandar? Dejá una acá.
~~~~

---

### Mié 14-oct · antes de las 12:30

#### 14-1 · CONEXIONES (S1-D07-B)
Origen: `drop-14` de `drops/2026-10-01-drops-noticias-repos.md` (reemplaza al drop 14 de S1, que no se publica).

~~~~
*CONEXIONES* · *Qué MCP te sobran: medilo, no lo adivines*

Que un servidor no aparezca nombrado en tus archivos *no prueba que no lo uses*. Yo tenía 24 conectados y ninguno escrito en mis archivos. Después medí 30 días de uso real: de los que tenía conectados, 13 se usaban igual.

Así se mide:
```
EN LA TERMINAL
claude mcp list
  cuáles tenés y si están
  conectados

DENTRO DE CLAUDE CODE
/context
  anotá cuánto ocupan las
  herramientas (antes)
/usage
  apretá w (7 días): qué parte
  de tu uso va a cada servidor
  MCP
/mcp
  desactivá el que sobra
/context
  otra vez: tiene que bajar
```
El que no aparece en /usage es candidato a sobrar. *Ojo:* /usage cuenta solo esta compu y la última semana. Si lo usás en otro lado (otra compu, claude.ai) o una vez al mes, no lo apagues por esto.

Si lo agregaste vos por terminal, también lo sacás con `claude mcp remove <nombre>`. Los conectores de tu cuenta de claude.ai *no se sacan con claude mcp remove*; esos se apagan con /mcp.

El uso por servidor en /usage aparece solo en planes pagos (Pro, Max, Team, Enterprise).

Corré /usage, apretá w y contá en General: *¿cuántos de tus MCP no aparecen?*
~~~~

#### 14-2 · BUCLE (R04)
Origen: `R04` de `drops/2026-10-01-drops-noticias-repos.md`.

~~~~
*BUCLE* · *AI Engineering from Scratch: por dónde arrancar con agentes*

Curso gratis en GitHub, licencia MIT, más de 500 lecciones. La fase 14 es de agentes. Portada en español: i18n/es/README.md

*Los tres comandos*
```
git clone https://github.com/rohitg00/ai-engineering-from-scratch.git
cd ai-engineering-from-scratch
python3 phases/14-agent-engineering/01-the-agent-loop/code/main.py
```
En Windows, cambiá python3 por python o py. Solo Python: sin instalar nada y sin clave. Al final tenés que ver _the total including 15% tax is 138.0_, _turns used: 5_ y tres herramientas (calculator, kv_get, kv_set).

*El orden que te recomiendo.* Las cinco dicen «Python (stdlib)»: solo Python estándar. Cambiá la carpeta en el tercer comando:
```
01-the-agent-loop           el bucle: observar, pensar, actuar
02-rewoo-plan-and-execute   planificar separado de ejecutar
03-reflexion-verbal-rl      después de fallar, anota qué aprendió y lo usa en el próximo intento
04-tree-of-thoughts-lats    buscar entre varios caminos antes de elegir
05-self-refine-and-critic   mejorar su propia respuesta en varias pasadas
```

*Ojo:* el inglés es el original. Las lecciones en otros idiomas son traducción a máquina (rama translations).

*Mini-tarea:* corré la 01 y contá en General, con tus palabras, qué hace el agente en cada vuelta.
~~~~

#### 14-3 · CLIENTE (S2-D13-C) + PROMPT (carrusel K8)
Origen: drop 17 de `S2-GUIONES.md` y drop D9 de `S3-GUIONES.md` (los dos eran «por DM»; pasaron a Avisos el 1-oct). Van juntos para no pasar de 3 avisos.

~~~~
*CLIENTE* · *Tu cliente en cinco preguntas*
```
1. ¿Cuántos [personas / sucursales / profesionales] tienen? → buscás de __ a __.
2. ¿Quién hace hoy [la tarea que resolvés]? → señal buena: __.
3. ¿Cómo lo llevan hoy? → señal buena: cuaderno, Excel o WhatsApp.
4. ¿Cuántos [clientes] [el problema medible: no volvieron, deben, esperan]? → si no lo sabe, ése es su problema.
5. ¿[Dato de formalidad: NIT, local, empleados]? → confirma que es negocio formal.
Regla: cada respuesta es un número o un sí/no. Nada de adjetivos.
```

———

*PROMPT* · *Sacar el prompt de una imagen: los 8 bloques*
```
Paso 0: ¿está el prompt en pantalla? Todas las láminas, la descripción, y en video los cuadros donde aparece texto.
Si no está, reconstruís y lo decís: "no es el prompt original, es uno que da algo parecido".
Ocho bloques, en este orden:
1 Apertura ("Ultra-realistic vertical ... photo of") · 2 Sujeto con acción · 3 Rasgos (pelo, piel, expresión, mirada) · 4 Vestuario (prenda, material, color) · 5 Pose, miembro por miembro · 6 Fondo como lista de objetos · 7 Técnica (cámara, luz) · 8 Negativo
Negativo base: CGI, cartoon, plastic skin, beauty filter, over-retouched, bad anatomy, extra fingers, HDR, studio lighting, over-sharpening, blurry subject, text, watermark
Sumale 2 o 3 negativos propios de tu sujeto.
```
~~~~

---

## Qué mandar por DM

Link de la comunidad: `https://chat.whatsapp.com/ENplPbR8GrbGsdMrGgLxzu` (el de `ONIA_COMUNIDAD_CONTENIDO.md`).

- **Si va a la comunidad:** «¡Gracias por comentar! Está en mi comunidad de WhatsApp (gratis): https://chat.whatsapp.com/ENplPbR8GrbGsdMrGgLxzu · Entrá a *Avisos* y buscá *PALABRA*.»
- **Si va a la web:** «¡Gracias por comentar! Acá está: <link de la tabla>».
- **En YouTube no hay DM:** respondé el comentario con el mismo texto.

| PALABRA | Link | Aviso |
|---|---|---|
| PLANILLA · COMUNIDAD · TARIFA | comunidad | vie 2 (2-2) |
| EFFORT · MIRAR · CACHE | comunidad | vie 2 (2-3) |
| TRAMPA | comunidad | vie 2 (2-1, reto) y sáb 3 (3-1, respuesta) |
| SKILL | `sergiourcullo.vercel.app/claude-code` (video 02) | — |
| MIGRAR · VENTANA | comunidad | dom 4 (4-1, 4-2) |
| AGENTS · VERIFY · PROMESA | comunidad | lun 5 (5-1, 5-2, 5-3) |
| HISTORIA · DIAGRAMA | comunidad | mar 6 (6-1, 6-2) |
| HOOK · ESCANEO | comunidad | mié 7 (7-1, 7-2) |
| DELEGAR | `sergiourcullo.vercel.app/claude-code` («Que trabaje sin vos») | — |
| DOCTOR · CODEGRAPH · PRUEBAS | comunidad | jue 8 (8-1, 8-2, 8-3) |
| CLAVE | `sergiourcullo.vercel.app/stack` (sección n8n) | — |
| REPOS · PDF · REVISAR | comunidad | vie 9 (9-1, 9-2, 9-3) |
| WORKTREE · DOBLE | comunidad | sáb 10 (10-1, 10-2) |
| MARKETING | comunidad | sáb 10 (10-3) ⛔ decidís vos |
| CHAT | `sergiourcullo.vercel.app/claude-code` (video 01) | — |
| ANUNCIO · DERECHOS | comunidad | dom 11 (11-1, 11-2) |
| HANDOFF · ESQUELETO · REMOTION | comunidad | lun 12 (12-1, 12-2, 12-3) |
| CONTAR | comunidad | lun 12 (General) |
| CAPAS · README · BRIEF | comunidad | mar 13 (13-1, 13-2, 13-3) |
| CONEXIONES · BUCLE | comunidad | mié 14 (14-1, 14-2) |
| CLIENTE · PROMPT | comunidad | mié 14 (14-3) |

## Huecos y pendientes

1. **Sáb 3 · lugar libre:** N06 (GEMINI) no sale. Sergio Urcullo elige un repo de la reserva; su aviso entra ese día, antes del video.
2. **MARKETING · sáb 10:** escrito, pero espera tu decisión (aviso 10-3). Si no lo recomendás, se ajusta o se baja R05.
3. **Revisados el 2-oct:** CACHE (vie 2), VENTANA (dom 4), PROMESA (lun 5), PRUEBAS (jue 8) y REVISAR (vie 9). Corregidos CACHE, VENTANA y PRUEBAS; PROMESA, una línea; REVISAR, sin cambios. Qué y por qué: la línea ⚠️ de cada uno en `drops/2026-10-01-drops-noticias-repos.md`. El texto de acá y el del origen es el mismo (comprobado con script).
4. **PROMESA:** las dos respuestas están recortadas (`[…]`) y las completas no existen en el repo (buscadas en el árbol, en todo el historial de git y en las transcripciones). El guion y el caption de K6 dicen «completas»: sacalo de los dos antes de grabar (lun 5) y antes de publicar K6.
5. **BRIEF · mar 13:** el cierre de K7 dice «te mando por mensaje el JSON». Alinealo a la comunidad o mandá el archivo por DM.
6. **DELEGAR · mié 7:** la web `/claude-code` dice «3 subagentes» (hoy es 1). Corregila antes.
