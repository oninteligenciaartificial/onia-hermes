# Avisos Onia Community · martes6 a viernes16oct2026

Fecha/zona:La Paz y Caracas UTC−04. Horaobjetivo antes12:30; respuesta del reto7oct10:00. Sólo textos entre~~~~se pegan enAvisos; resto es control interno. No afirmar envío sin evidencia. No copiar fechas del calendario2–14oct. Recursosfuera del lote quedan sinfecha hasta asignación explícita, no se borran de sus drops deorigen.

| Fecha | Carrusel | Recurso antes de su salida16:00 |
|---|---|---|
|Mar 6-oct|DD-A|Volví + reto + CACHE|
|Mié 7-oct|N04|Respuesta reto + VERIFY|
|Jue 8-oct|K3v2|HISTORIA|
|Vie 9-oct|N03|COMUNIDAD|
|Sáb 10-oct|K11|HOOK|
|Dom 11-oct|N06|ANTIGRAVITY|
|Lun 12-oct|K4v2|PRUEBAS|
|Mar 13-oct|K8v3|PROMPT|
|Mié 14-oct|K7v2|BRIEF|
|Jue 15-oct|K2v3|SKILL|
|Vie 16-oct|K6v2|PROMESA|

### Mar 6-oct · DD-A · Volví + reto + CACHE

Antes12:30.

~~~~
Volví 👋

Acá en Avisos comparto los recursos de mis videos y carruseles. En cada uno aclaro si es una plantilla, un archivo completo, un ejemplo parcial o un registro de una prueba. HOOK es un ejemplo de dos comprobaciones de Git: no es mi script completo de autosync ni un sistema listo para instalar. Antes de ofrecer un recurso en un video, compruebo que esté disponible acá.

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

La respuesta la dejo mañana miércoles 7 de octubre a las 10:00 👀

~~~~

~~~~
*CACHE* · *La cuenta de la caché de GPT-6.1 Sol*
Tarifa estándar y contexto corto, USD por millón, revisada6-oct: Sol entrada2; lectura de caché0,10; escritura2,50; salida10. Astra entrada10 y salida50. Compará siempre la misma modalidad.
```
CostoUSD = (entradaNormal*2 + cache_write_tokens*2,50
            + cached_tokens*0,10 + salida*10) / 1.000.000
entradaNormal = input_tokens - cache_write_tokens - cached_tokens
```
Repetí el mismo prefijo de al menos1.024tokens visibles. La escritura cuesta más la primera vez; una lectura de Sol cuesta20veces menos que entrada normal. Mirá los campos de uso para comprobarlo. Un0 posterior también puede deberse al enrutamiento; no prueba sólo cambio del prefijo o vencimiento. La retención mínima es30min desde escritura/reuso, puede durar más.
Fuentes: https://developers.openai.com/api/docs/pricing y https://developers.openai.com/api/docs/guides/prompt-caching
Contá en General: ¿qué parte de tus pedidos se repite igual?
~~~~

### Mié 7-oct · N04 · Respuesta reto + VERIFY

RespuestaTRAMPA10:00; VERIFYantes12:30.

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

~~~~
*VERIFY* · *Chequeos antes del commit*
Claude Code2.1.286+ recibe una indicación para correr una skill propia verify o simplify antes de commitear, salvo cambios sólo de docs/tests. No es un bloqueo de Git.
En .claude/skills/verify/SKILL.md, revisá el archivo existente antes de escribir:
```
---
name: verify
description: Chequeos antes del commit
---
Ejecutá el build y los tests de este proyecto.
Si falla alguno, no commitees y explicá el error.
```
Debe estar disponible al empezar la sesión; reiniciá después de crearla. Las skills empaquetadas/plugins no cuentan. No debe tener disable-model-invocation:true y includeGitInstructions debe seguir activo.
Probalo con un cambio de código en un repo de prueba. Fuente: https://code.claude.com/docs/en/skills
Contá en General: ¿qué chequeo le pusiste?
~~~~

### Jue 8-oct · K3v2 · HISTORIA

Antes12:30.

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

### Vie 9-oct · N03 · COMUNIDAD

Antes12:30.

~~~~
*COMUNIDAD* · *Comprobá el modo de permisos de tu sesión*

En Claude Code 2.1.283 o posterior, el modo inicial incorporado es auto para terminal interactiva y VS Code. Puede cambiar por configuración, políticas de la organización o disponibilidad. El administrador puede deshabilitar auto; un ajuste previo también puede mantener otro modo.

Esto no describe sin más las ejecuciones con `claude -p` ni el Agent SDK: tienen condiciones propias. Habitualmente parten en Manual cuando obtienen los feature flags; sin ellos, la documentación contempla auto desde 2.1.285, salvo restricciones aplicables. Tampoco uses esa regla para inferir el modo de Desktop o la web.

Para una sesión nueva de terminal que te pida revisar acciones, podés usar:
```
claude --permission-mode default
```
Para las siguientes sesiones de terminal, podés definir `permissions.defaultMode` como `default` en tu configuración de usuario, conservando sus otros ajustes. Las políticas administradas pueden tener prioridad.

Mirá el indicador real de tu sesión. Auto usa un clasificador; no significa que toda acción esté aprobada por vos ni que un push vaya a ser seguro para tu despliegue.

Fuente y casos por superficie: https://code.claude.com/docs/en/permission-modes#which-mode-a-session-starts-in
~~~~

### Sáb 10-oct · K11 · HOOK

Antes12:30.

~~~~
*HOOK* · *Ejemplo de dos comprobaciones antes de guardar cambios*

Esto es un ejemplo parcial de las guardas que uso. No es el script completo de autosync ni una configuración de hook lista para pegar.

Dentro de un repositorio Git, estas dos consultas sólo leen su estado:
```
git rev-parse -q --verify MERGE_HEAD
git diff --name-only --diff-filter=U
```
- Si la primera imprime un hash, hay un merge a medias.
- Si la segunda lista archivos, hay conflictos sin resolver.
- Si aparece cualquiera de esas señales, un proceso que guarda cambios debería detenerse antes de agregar archivos o hacer commit.

Que ambas salgan vacías no demuestra que el trabajo esté correcto: todavía faltan los chequeos del proyecto y la revisión. Un hook Stop corre al terminar una respuesta, no equivale a una revisión antes de publicar.

No conectes estos comandos solos a un proceso que haga commits o push. El script completo requiere su propia implementación, pruebas y permisos; no está incluido en este mensaje.

Contá en General: ¿qué señal debería detener tu automatización antes de guardar cambios?
~~~~

### Dom 11-oct · N06 · ANTIGRAVITY

Antes12:30.

~~~~
*ANTIGRAVITY* · *Migrar tus skills sin perderlas*
Google anunció la transición de Gemini CLI para usuarios individuales; hoy su web de Gemini CLI todavía muestra acceso gratuito. Como esas páginas no coinciden, no te digo que tu cuenta dejó de funcionar: revisá tu caso.
Para migrar a Antigravity CLI, la documentación confirma:
- Al abrir agy por primera vez, encuentra perfiles previos y ofrece importar configuración.
- Las skills del proyecto cambian de .gemini/skills/ a .agents/skills/; reubicá las tuyas sin sobrescribir las que ya existan.
- GEMINI.md y AGENTS.md siguen como reglas.
Si necesitás instalar, usá la página oficial de descarga; revisá su comando antes de ejecutarlo. No hace falta pagar por esta guía ni compartir claves.
Fuentes: https://developers.googleblog.com/an-important-update-transitioning-gemini-cli-to-antigravity-cli/ y https://antigravity.google/docs/cli/gcli-migration/
Contá en General: ¿qué skill conservarías al migrar?
~~~~

### Lun 12-oct · K4v2 · PRUEBAS

Antes12:30.

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

### Mar 13-oct · K8v3 · PROMPT

Antes12:30.

~~~~
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

### Mié 14-oct · K7v2 · BRIEF

Antes12:30.

~~~~
*BRIEF* · *El JSON de Carruseles por código*
Este es el JSON canónico con el texto y la estructura de las láminas. Lo dejo como mensaje acá abajo, no como adjunto.

```json
{
  "title": "Carruseles por código en 5 pasos (v2, pack referentes)",
  "caption": "Este carrusel salió de un archivo JSON y un navegador.\n\nLa IA pinta solo las imágenes de arcilla. El texto lo pone el código, porque los modelos de imagen escriben mal: el 29-sep uno me inventó letras en una taza y hasta un post falso de Instagram.\n\nPara la imagen: un objeto simple sin nada impreso, descrito en positivo. Tazas, cuadernos y pantallas no: ahí el modelo inventa letras.\n\nPara probarlo, pedile esto a Claude Code: «Por cada lámina de brief.json armá un HTML de 1080x1350 con mi fuente y mi color, y sacale captura con Chrome».\n\nLa captura, a mano (Chrome sin ventana):\nchrome --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=1080,1350 --virtual-time-budget=10000 --screenshot=slide-01.png file:///C:/ruta/slide-1.html\n\nEl --virtual-time-budget=10000 son los 10 segundos para que carguen las fuentes.\n\nComentá BRIEF y te paso el link de la comunidad con el JSON de este carrusel.",
  "hashtags": [
    "#claudecode",
    "#ia",
    "#contenido",
    "#automatizacion",
    "#instagram",
    "#bolivia"
  ],
  "serie": "Contenido con IA",
  "slides": [
    {
      "layout": "ilustrado",
      "badge": "guía",
      "headline": "Carruseles por código en *5 pasos*",
      "number": 1,
      "theme": "verde",
      "image_style": "clay",
      "next": "por qué",
      "image_descartada": "hermes-content/galeria/ilustraciones/sergio-k7v2-carruseles-por-codigo-20260929-s01-efee638c.jpg",
      "image_prompt_descartado": "A few small offcuts of pale birch wood stacked neatly beside a wood carving chisel with a worn wooden handle on a workbench.",
      "image": "hermes-content/galeria/ilustraciones/sergio-k7v2-carruseles-por-codigo-20260929-s01-305cf3dc.jpg",
      "image_prompt_usado": "A fanned stack of plain blank rectangular clay tiles, alternating emerald green and white, next to a small matte black clay sculpting tool, nothing printed on them."
    },
    {
      "number": 2,
      "layout": "ilustrado",
      "theme": "blanco",
      "headline": "La IA de imagen *escribe mal*",
      "body": "El 29 de septiembre el modelo inventó letras en una taza. Texto en la imagen es texto sin control.",
      "next": "paso 1",
      "alt_text": "Una lapicera de arcilla que gotea un manchón verde: si le pedís al modelo de imagen que escriba, el texto se le escapa y sale sin control.",
      "image_style": "clay",
      "image": "hermes-content/galeria/ilustraciones/sergio-k7v2-carruseles-por-codigo-20260929-s02-723733b4.jpg",
      "image_prompt_usado": "A chunky plain matte black clay fountain pen lying flat, its pointed nib leaking a large uneven emerald green clay ink blot with a few scattered drops, on a white surface."
    },
    {
      "number": 3,
      "layout": "lista",
      "theme": "blanco",
      "headline": "Paso 1: el *brief*",
      "body": "un JSON: cada lámina con headline y body",
      "items": [
        {
          "label": "Portada",
          "text": "el problema en una frase"
        },
        {
          "label": "La segunda",
          "text": "lo que está en juego"
        },
        {
          "label": "Las del medio",
          "text": "una idea por lámina"
        },
        {
          "label": "El cierre",
          "text": "una sola acción"
        }
      ],
      "next": "paso 2",
      "alt_text": "Estructura del brief en JSON"
    },
    {
      "number": 4,
      "layout": "ilustrado",
      "theme": "blanco",
      "headline": "Paso 2: la IA pinta *solo la imagen*",
      "body": "Un objeto simple sin nada impreso: piedra, planta, madera. Tazas y pantallas no: ahí inventa letras. Describilo en positivo.",
      "next": "paso 3",
      "alt_text": "Una paleta de pintor de arcilla con un pincel cargado de verde: a la IA usala solo para pintar la imagen. Las letras las ponés vos con código.",
      "image_style": "clay",
      "image": "hermes-content/galeria/ilustraciones/sergio-k7v2-carruseles-por-codigo-20260929-s04-a4074cda.jpg",
      "image_prompt_usado": "A matte black clay painter's palette with a thumb hole, holding round blobs of emerald green and white clay paint, with a white clay paintbrush with an emerald green tip resting across it, on a white surface."
    },
    {
      "number": 5,
      "layout": "dato",
      "theme": "blanco",
      "value": "10",
      "headline": "Paso 3: las fuentes necesitan *10 segundos*",
      "body": "Un script arma cada lámina en HTML de 1080×1350 y Chrome sin ventana le saca una captura. Con 4 segundos, una lámina salió con una letra y la siguiente con otra.",
      "next": "4 y 5",
      "alt_text": "Chrome espera 10 segundos a que carguen las fuentes antes de la captura"
    },
    {
      "number": 6,
      "layout": "lista",
      "theme": "blanco",
      "headline": "Pasos 4 y 5: *mirar y cotizar*",
      "body": "antes de publicar y antes de gastar",
      "items": [
        {
          "label": "Mirar",
          "text": "todas juntas: la misma letra en todas"
        },
        {
          "label": "La imagen",
          "text": "sola: sin letras ni logos inventados"
        },
        {
          "label": "Cotizar",
          "text": "el costo antes de generar; sin OK no gasta"
        }
      ],
      "next": "el brief",
      "alt_text": "Pasos 4 y 5: revisar todas las láminas juntas y cotizar antes de generar"
    },
    {
      "number": 7,
      "layout": "cierre",
      "theme": "negro",
      "keyword": "BRIEF",
      "body": "y te paso el link de la comunidad con el JSON de este carrusel.",
      "alt_text": "Comentá BRIEF para recibir el link de la comunidad con el JSON"
    }
  ]
}
```
~~~~

### Jue 15-oct · K2v3 · SKILL

Antes12:30.

~~~~
*SKILL* · *Tu primera skill*
Elegí una tarea que explicás repetidamente. En .claude/skills/mi-skill/SKILL.md:
```
---
name: mi-skill
description: Usar cuando necesite revisar un texto para mi negocio.
---
Revisá el texto con estos criterios:
1. Una idea clara.
2. Ninguna cifra ni promesa sin evidencia.
3. Una acción concreta al final.
Si falta un dato, marcá FALTA y no lo inventes.
```
Comprobá que Claude la encuentre con /skills. Si otra skill ya usa ese nombre, elegí uno diferente.
Guía oficial: https://code.claude.com/docs/en/skills
Contá en General: ¿qué tarea le enseñarías a tu skill?
~~~~

### Vie 16-oct · K6v2 · PROMESA

Antes12:30.

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

## Comentarios/entregas

Respuestas manuales: no hayDMautomático verificado. Para palabras de este lote: «Está en mi comunidad de WhatsApp; entrá aAvisos y buscá PALABRA». Usar enlace canónico de ONIA_COMUNIDAD_CONTENIDO.md; no inventar URL. Antes de responder, comprobar que el recurso correspondiente esté publicado enAvisos. Sin prueba, no decir «ya está».

**K2/SKILL:** el caption canónico promete un video de instalación; no se verificó URL/version accesible. La plantilla anterior sí queda preparada, pero no sustituye silenciosamente esa promesa. Madre debe localizar el video o proponer cambio exacto del CTA para revisión antes de salida15oct. No escribir/publicar el cambio desde esta propuesta.

**K7/BRIEF:** JSON como mensaje, noadjunto; mismo archivo canónico ya existente, sin regenerar assets. El caption/cierre que digaDM debe alinearse a comunidad por revisión de madre, no darDMautomático porhecho.

**K6/PROMESA:** el recurso conserva recortes[…], nooriginalescompletos. Madre debe revisar guion/caption que prometa«completas» antes16oct.

## Fuera de este calendario

Los demás drops siguen en sus archivos deorigen como reserva sinfecha deenvío. No sumar YouTube,repos o extras antiguos al díaactual. MARKETINGpendiente dedecisión; los7carruseles de10imágenes defectuosas no entran en el lote. AuditoríaBya decidida; activaciónCal/bio noverificada nihecha aquí.

## Registro de envío/publicación

Dejarpendiente fecha/hora efectiva y evidencia por recurso. Programa≠publicado. Lote33timers ya documentado; no recrear ni reprogramar. Este documento no registra publicaciones efectuadas.
