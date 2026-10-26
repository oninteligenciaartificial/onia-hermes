# Guiones del día · martes 22 de septiembre de 2026

## Objetivo editorial

Enseñar a distinguir y construir cuatro piezas que suelen mezclarse: `workflow`,
`AI Agent`, `MCP` y `loop`. La promesa del día no es “usar IA”, sino que la audiencia
pueda mirar una automatización y decidir qué arquitectura necesita.

## Producción y distribución

| Superficie | Pieza | Qué se graba |
|---|---|---|
| Feed | Pilar de Samuel | Samuel define y graba; no se guioniza aquí |
| Feed | B-roll Sergio, formato nuevo | Guion 1: Sergio a cámara con pantalla/B-roll superpuesto |
| Feed | Video normal Sergio | Guion 2: explicación con un workflow real o recreado en n8n |
| Trial | Reutilización | Los 3 contenidos del Feed + 1 yap de Samuel |
| Trial v2 | Cámara directa | Guiones 3–8: seis videos de Sergio; hoy se suma Opus 5.5 |
| YouTube | Video largo | Guion 9: una grabación de 10–14 minutos que abre la serie |

Total diario: **3 Feed + 4 Trial + 6 Trial v2 = 13 publicaciones**.

Material original que Sergio graba hoy: **8 verticales + 1 video largo**. Los contenidos
del Feed se reutilizan en Trial; no se vuelven a grabar.

### Estado de rodaje

- [x] Guion 1 grabado; falta localizar el archivo para enviarlo a edición.
- [x] Guion 2 grabado; falta localizar el archivo para enviarlo a edición.
- [ ] Guion 8: grabar primero por vigencia; tiene captura oficial y cálculo reproducible.
- [ ] Guiones 3–7: siguiente bloque de grabación.
- [ ] Guion 9: se expande a tres clases con decks específicos de HyperFrames, n8n y
  MCP/agentes/loops; este guion sigue siendo la base de la tercera. No se graban las tres
  el mismo día si baja la claridad.

Regla: un video marcado como grabado todavía no está aprobado. Debe pasar contenido,
exactitud, montaje y revisión final antes de publicarse.

---

## Dirección del formato nuevo de B-roll

Referencia estructural analizada: creador visible como capa base, pruebas del producto
superpuestas, frases clave grandes y cambios de ángulo. Se adopta el lenguaje visual, no
la identidad del creador.

### Reglas de rodaje

- Formato vertical `1080 × 1920`, cámara principal a la altura de los ojos.
- Tres planos reales: frontal sentado, lateral a 45 grados y sobre el hombro usando la
  laptop.
- La pantalla superpuesta ocupa entre 55 % y 70 % del ancho, pero nunca tapa ojos ni boca.
- Subtítulos inferiores de 1–4 palabras por golpe de voz.
- Una frase hero en amarillo por video; máximo 2–5 palabras.
- Cambiar estímulo cada 4–7 segundos: encuadre, pantalla, diagrama o acercamiento.
- Incluir un plano ambiental a pantalla completa cada 8–12 segundos.
- La pantalla no es decoración: debe demostrar exactamente lo que Sergio está diciendo.

### Tomas B-roll que se graban una sola vez

1. Sergio escribiendo en la laptop, plano lateral.
2. Mano en mouse y n8n abierto, plano detalle.
3. Plano sobre el hombro con un canvas de n8n sin credenciales ni datos reales.
4. Sergio mirando un error y corrigiendo un nodo.
5. Plano frontal escuchando/revisando una ejecución.
6. Scroll por la documentación de MCP.
7. Terminal con `claude mcp list`, sin tokens ni rutas privadas.
8. Workflow saneado: `Webhook → Basic LLM Chain → Structured Output Parser → Switch`.
9. Workflow saneado: `AI Agent + Chat Model + Call n8n Workflow Tool`.
10. JSON de ejemplo en pantalla.
11. Libreta con `OBJETIVO / TOOLS / LOOP / LÍMITE`.
12. Sergio cerrando la laptop y mirando a cámara para el CTA.

---

## Guion 1 · Feed B-roll · formato nuevo

### Título

**Las 5 piezas de un agente de IA que sí trabaja**

### Guion hablado

> Si tu sistema solamente genera una respuesta y no puede elegir ni ejecutar acciones,
> no tenés un agente operativo: tenés una llamada al modelo.
>
> Un agente útil necesita cinco piezas.
>
> Uno: un objetivo verificable. Por ejemplo, calificar un lead y dejarlo registrado.
>
> Dos: un modelo, como Claude o un modelo de OpenAI, que decide el siguiente paso.
>
> Tres: herramientas. Puede consultar el CRM, buscar documentación o llamar un workflow
> de n8n.
>
> Cuatro: un loop. Planifica, actúa, observa el resultado y corrige.
>
> Cinco: un límite. Máximo tres intentos, nada de enviar precios y revisión humana antes
> de cualquier mensaje externo.
>
> MCP puede estandarizar el acceso a `tools`, `resources` y `prompts`. n8n puede
> orquestar, registrar y limitar el proceso. Ninguno convierte por sí solo un workflow en
> agente: eso ocurre cuando el modelo observa el resultado y elige la siguiente acción.
>
> Comentá cuál de estas cinco piezas querés que construya en el próximo video.

### Montaje exacto

| Tiempo | Imagen | Texto principal |
|---|---|---|
| 0–3 s | Frontal, sin overlay | `NO ES UN AGENTE` |
| 3–8 s | Libreta superpuesta | `1. OBJETIVO` |
| 8–14 s | Selector de modelo/nodo saneado | `2. MODELO` |
| 14–21 s | Canvas de n8n superpuesto | `3. TOOLS` |
| 21–29 s | Diagrama circular animado | `4. LOOP` |
| 29–37 s | Plano lateral a pantalla completa | `5. LÍMITE` |
| 37–49 s | Sergio + dos overlays: MCP y n8n | `CONECTA ≠ DECIDE` |
| 49–55 s | Vuelta al frontal | `¿QUÉ CONSTRUIMOS?` |

Frase hero amarilla: **CONECTA ≠ DECIDE**.

---

## Guion 2 · Feed normal de Sergio

### Título

**No uses un AI Agent para clasificar leads en n8n**

### Guion hablado

> Mucha gente pone un nodo `AI Agent` en n8n para cualquier cosa. Para clasificar un
> lead, yo no lo usaría.
>
> Haría esto: `Webhook` recibe nombre, servicio y mensaje. `Basic LLM Chain`, conectado a
> `OpenAI Chat Model`, devuelve tres campos: `categoria`, `urgencia` y
> `requiere_humano`.
>
> `Structured Output Parser` valida la salida contra un `JSON Schema`. Si no cumple la
> estructura, el nodo falla; si cumple, todavía puede estar mal clasificada. Por eso
> después probamos casos reales y revisamos el resultado.
>
> Luego `Google Sheets` registra el lead. `Switch` revisa primero
> `requiere_humano = true`; si no, lo manda a `web`, `automatización` u `otro`. `Telegram`
> avisa solamente en la ruta que necesita una persona.
>
> Esto es un workflow con IA, no un agente, porque la ruta ya está definida.
>
> Usá `AI Agent` recién cuando el modelo deba elegir entre herramientas: consultar el
> CRM, buscar una respuesta en documentos o pedir un dato que falta.
>
> La pregunta correcta no es “¿dónde pongo el agente?”. Es “¿quién decide el próximo
> paso: mis reglas o el modelo?”.

### Pantalla que debe acompañar

```text
Webhook
  → Basic LLM Chain + OpenAI Chat Model
  → Structured Output Parser
  → Google Sheets
  → Switch
      ↘ requiere_humano → Telegram
      ↘ web
      ↘ automatización
      ↘ otro
      ↘ fallback
```

JSON ficticio:

```json
{
  "categoria": "automatizacion",
  "urgencia": "normal",
  "requiere_humano": true
}
```

No mostrar teléfonos, correos, tokens ni nombres reales.

---

## Guion 3 · Trial v2

### Título

**MCP no es un agente: revisá esto antes de conectarlo**

### Guion hablado

> MCP es un protocolo para que una aplicación host se conecte con servidores que exponen
> `tools`, `resources` y `prompts`. No convierte el sistema en agente.
>
> Antes de conectar un servidor revisá cinco cosas.
>
> En Claude Code corré `claude mcp list`. Elegí el servidor y corré
> `claude mcp get NOMBRE`. Ahí verificá comando o URL, alcance y variables configuradas,
> sin mostrar sus valores.
>
> Después abrí `/mcp` y clasificá cada tool en una tabla: `lee`, `escribe`, `borra` o
> `sale a internet`. Si no podés explicar qué hace una tool, no la apruebes.
>
> Por ejemplo, `get_lead_by_id` puede ser de solo lectura. `send_email` cambia el mundo
> externo y debe pedir confirmación. Si un servidor mezcla lectura de datos privados con
> envío externo, separá permisos o sacá una de esas capacidades de la sesión.
>
> Una annotation como `readOnlyHint` es una pista para el cliente, no una barrera de
> seguridad. Los permisos reales se aplican en el host, las credenciales y el servidor.
>
> Conectar un MCP sin revisar esto es como entregarle las llaves de tu negocio a una IA.
> Comentá `MCP` y te paso el checklist de seguridad.

### Demostración que debe verse

```powershell
claude mcp list
claude mcp get nombre-del-servidor
```

La captura debe mostrar un servidor ficticio o saneado. Tapar valores de entorno, rutas
personales, tokens y nombres de clientes.

### Texto en pantalla

```text
TOOLS
READ / WRITE
INPUT / OUTPUT
APPROVAL
OWNER / CREDENTIALS
```

---

## Guion 4 · Trial v2

### Título

**El loop mínimo en n8n para no repetir para siempre**

### Guion hablado

> Este loop puede quedarse gastando dinero mientras dormís.
>
> No todo loop es un agente. `HTTP Request → IF → Wait` es un loop determinista porque
> las reglas ya decidieron qué ocurre.
>
> Un loop agentivo aparece cuando el modelo observa el resultado y elige la siguiente
> herramienta.
>
> Para construirlo, empezá con un nodo `Edit Fields` y creá `attempt = 0`. Después
> `HTTP Request` consulta el pago. Un `IF` comprueba
> `{{ $json.status === 'paid' }}`. La salida verdadera termina.
>
> En la salida falsa, incrementá `attempt`. Otro `IF` comprueba
> `{{ $json.attempt < 3 }}`. Si todavía puede reintentar, `Wait` espera diez minutos y
> vuelve a consultar. Si llega a tres, `Telegram` alerta a una persona y el flujo termina.
>
> Probalo con tres respuestas ficticias: `pending`, `pending`, `paid`. Después probalo con
> tres `pending` y verificá que envíe una sola alerta, no que vuelva a empezar.
>
> Repetir no es autonomía. Saber qué observar, qué decidir y cuándo detenerse sí.
>
> Comentá `LOOP` y te paso el esquema completo de n8n.

### Texto en pantalla

```text
PLAN → ACT → OBSERVE → ADJUST

done = status === "paid"
maxAttempts = 3
wait = 10 min
timeout = 35 min
fallback = human
```

La implementación real debe conservar `attempt` entre consultas; si `HTTP Request`
reemplaza el JSON de entrada, combinar la respuesta con el estado antes de evaluar.

---

## Guion 5 · Trial v2

### Título

**La descripción de una tool decide si tu agente la usa bien**

### Guion hablado

> Tu agente quizá no se está equivocando: tus herramientas están mal escritas.
>
> Una tool necesita un nombre específico, una descripción que diga cuándo usarla, un
> input validable, un output predecible y efectos secundarios explícitos.
>
> En vez de llamar una herramienta `buscar`, llamala `get_lead_by_id`. Recibe `lead_id`,
> devuelve `name`, `status` y `source`, y declara `readOnlyHint: true`.
>
> Después hacé dos pruebas. Mandá `{}`: tiene que fallar porque `lead_id` es obligatorio.
> Mandá `{"lead_id":"lead_demo_001"}`: tiene que devolver solamente `name`, `status` y
> `source`. Si acepta campos extra, falta `additionalProperties: false`.
>
> Separá otra tool para actualizar. Así el agente no confunde consultar con modificar y
> la aprobación aparece sólo cuando hay un efecto externo.
>
> Antes de cambiar de modelo, revisá el contrato de tus herramientas. Un agente solo puede
> decidir bien entre opciones que están bien definidas.
>
> `readOnlyHint` describe la intención de la tool, pero no impide por sí mismo que un
> servidor malicioso modifique algo. La seguridad real sigue dependiendo del servidor y
> sus permisos.
>
> Comentá `TOOL` y te paso la plantilla del contrato.

### Overlay para copiar

```json
{
  "name": "get_lead_by_id",
  "description": "Lee un lead usando su ID exacto. No busca por nombre ni modifica datos.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "lead_id": {
        "type": "string",
        "description": "ID exacto del lead en el CRM"
      }
    },
    "required": ["lead_id"],
    "additionalProperties": false
  },
  "outputSchema": {
    "type": "object",
    "properties": {
      "name": { "type": "string" },
      "status": { "type": "string" },
      "source": { "type": "string" }
    },
    "required": ["name", "status", "source"],
    "additionalProperties": false
  },
  "annotations": { "readOnlyHint": true }
}
```

---

## Guion 6 · Trial v2 · polémico

### Título

**Mucho de lo que te venden como agente es un workflow con otro nombre**

### Guion hablado

> Si tu automatización siempre sigue A, B y C, probablemente no tenés un agente. Te
> vendieron un workflow con otro nombre.
>
> Hacé esta auditoría en veinte segundos. Pausá el diagrama y marcá con rojo cada punto de
> decisión. Si todas las decisiones son `IF`, `Switch` o reglas que vos escribiste, tenés
> un workflow. Si un modelo sólo clasifica texto y después `Switch` decide la ruta, tenés
> un workflow con IA.
>
> Es un agente cuando el modelo observa el resultado, elige entre varias herramientas y
> decide el siguiente paso dentro de límites definidos. Pedí ver tres cosas: la lista de
> tools, la condición de salida y el máximo de iteraciones. Si no pueden mostrarlas, la
> palabra agente no describe la arquitectura.
>
> Y esto no hace inferior al workflow. Para facturación, registro de leads o avisos, lo
> predecible suele ser mejor.
>
> No compres la palabra “agente”. Pedí que te muestren quién toma la decisión, qué tools
> puede usar y cómo se detiene.
>
> ¿Te vendieron un workflow como agente? Contame qué hacía.

### Texto hero

**¿QUIÉN DECIDE?**

---

## Guion 7 · Trial v2 · personal

### Título

**El problema de aprender tecnología mirando redes**

### Guion hablado

> Guardé cientos de videos de inteligencia artificial y aun así no había construido nada.
>
> Ves MCP, agentes, RAG, n8n y pensás que necesitás aprenderlo todo antes de construir.
> Yo estoy usando otra regla: construir, romper, documentar y recién después explicar.
>
> Si enseño n8n, muestro el nodo. Si hablo de una tool, muestro su JSON. Si recomiendo un
> loop, enseño dónde termina. Y si todavía no puedo demostrarlo, no lo presento como una
> verdad.
>
> No necesitás saber toda la IA. Necesitás terminar un sistema pequeño que resuelva un
> problema real y aprender del error que aparece.
>
> Hoy hacé esta versión mínima: en n8n creá `Manual Trigger → Edit Fields`. Agregá
> `tarea = responder_lead` y `estado = pendiente`. Ejecutalo y guardá el JSON de salida.
> Después cambiá `estado` a `listo` con un `IF`. Ya construiste entrada, transformación y
> comprobación. Guardá también el primer error: vale más que otros veinte videos guardados.
>
> Comentá `HECHO` cuando termines hoy un sistema pequeño.

### B-roll simple

- Abrir una carpeta llena de tutoriales guardados.
- Cerrar esa ventana.
- Abrir n8n y ejecutar un workflow pequeño.
- Mostrar una ejecución fallida y luego una exitosa.

---

## Guion 8 · Trial v2 · noticia con demostración

### Título

**Claude Opus 5.5 salió hoy: así decidís si migrar con números**

### Resultado que aprende la persona

Calcular el costo de una carga real, detectar dos incompatibilidades de migración y medir
`costo por tarea exitosa` en vez de repetir benchmarks.

### Guion hablado

> Anthropic lanzó hoy Claude Opus 5.5. No te voy a decir solamente que es “más potente”:
> te enseño a decidir si realmente te conviene migrar.
>
> El modelo de API es `claude-opus-5-5`. La entrada cuesta cuatro dólares por millón de
> tokens, la salida veinte y la lectura de caché veinte centavos.
>
> Probemos una carga concreta: doscientos mil tokens nuevos, cincuenta mil de salida y
> cinco millones leídos de caché. En Opus 5.5 pagás ochenta centavos de entrada, un dólar
> de salida y un dólar de caché: **dos dólares con ochenta**.
>
> Con las tarifas de Opus 5, la misma mezcla cuesta **cuatro dólares con setenta y cinco**.
> Ahí el ahorro es 41,1 %. Pero no digas que siempre es 40 % más barato: sin caché, entrada
> y salida bajaron 20 % por token. El resultado depende de tu mezcla real.
>
> Y migrar no es sólo cambiar el nombre. En 5.5 el thinking no se puede desactivar ni usar
> con un presupuesto fijo; además `tool_choice: any` o forzar una tool concreta deja de
> funcionar. Tenés que usar thinking adaptativo, effort y tools estrictas con elección
> automática.
>
> Hacé una prueba A/B con veinte tareas reales. Guardá éxito o fallo, tokens, latencia,
> cantidad de tool calls y costo total. La métrica es `costo total / tareas exitosas`.
> Migrá sólo si baja ese número o si la mejora de éxito justifica el costo.
>
> Comentá `OPUS` y te paso la tabla para hacer el A/B sin inventar conclusiones.

### Pantalla literal

```text
MODELO            INPUT    OUTPUT   CACHE READ
Opus 5.5 / 1M     $4.00    $20.00   $0.20
Opus 5   / 1M     $5.00    $25.00   $0.50

CARGA: 0.2M input + 0.05M output + 5M cache read
5.5 = 0.2×4 + 0.05×20 + 5×0.20 = $2.80
5   = 0.2×5 + 0.05×25 + 5×0.50 = $4.75
ahorro de esta carga = 41.1%
```

Código de migración que se muestra, no se ejecuta con credenciales:

```python
model="claude-opus-5-5"
thinking={"type": "adaptive"}
output_config={"effort": "medium"}
tool_choice={"type": "auto"}
```

### Prueba y límite obligatorios en edición

- Captura Playwright de la página oficial, con fecha `22 SEP 2026` y modelo
  `claude-opus-5-5` visibles.
- Captura del bloque oficial de precios y disponibilidad.
- Tarjeta “**claim de Anthropic, no benchmark independiente**” cuando se mencione
  rendimiento, velocidad, seguridad o 40 % para cargas típicas.
- No mostrar una llamada de API inventada ni afirmar que todas las cargas ahorran 40 %.

---

## Guion 9 · YouTube

### Título principal

**MCP, agentes, loops y n8n: cómo se conectan de verdad**

### Miniatura

Texto: **NO ES LO MISMO**

Visual: Sergio en el centro; a la izquierda un workflow lineal; a la derecha un loop con
tools. No poner más de cuatro palabras grandes.

### Promesa

Al terminar, la persona podrá decidir si su caso necesita un workflow, una llamada a un
modelo, un agente o MCP, y podrá dibujar una arquitectura segura.

### Apertura hablada · 0:00–0:45

> Hoy todo se llama agente: un chatbot, un workflow de n8n, una integración por MCP y
> hasta un prompt largo. El problema no es solo de nombres. Si elegís mal la arquitectura,
> terminás con más costo, más errores y menos control.
>
> En este video vamos a separar cuatro cosas: workflow, agente, loop y MCP. Después voy a
> construir un ejemplo para calificar un lead y te voy a mostrar dónde conviene usar IA,
> dónde conviene una regla y dónde tiene que entrar una persona.

### Bloque 1 · El mapa · 0:45–2:30

> Un workflow sigue un camino que vos definiste. Puede tener condiciones, esperas y una
> llamada a un modelo, pero el camino existe antes de ejecutarse.
>
> Un agente recibe un objetivo y herramientas. El modelo observa lo que ocurre y decide
> cuál herramienta usar después.
>
> El loop es el ciclo operativo del agente: planificar, actuar, observar y ajustar hasta
> cumplir una condición de salida.
>
> MCP no reemplaza ninguna de esas piezas. Es un protocolo para conectar aplicaciones de
> IA con herramientas y fuentes de datos de una forma estándar.
>
> La prueba rápida es esta: si yo ya dibujé todos los pasos, tengo un workflow. Si el
> modelo decide el siguiente paso según el resultado, tengo comportamiento de agente.

Mostrar en el deck:

```text
WORKFLOW: A → B → IF → C
AGENT: objetivo → model → tool → observe ↺
MCP: conexión estándar entre aplicación y tools/data
```

### Bloque 2 · Caso que no necesita agente · 2:30–5:00

> Primero voy a construir la versión predecible. `Webhook` recibe `name`, `service` y
> `message`. `Basic LLM Chain` clasifica el texto. `Structured Output Parser` exige un
> JSON con categoría, urgencia y si requiere humano. `Switch` decide la ruta. Finalmente,
> `Google Sheets` registra y `Telegram` avisa.
>
> Acá la IA interpreta lenguaje, pero no elige herramientas. El workflow sigue siendo
> determinista. Eso lo vuelve más fácil de probar, observar y corregir.

Ejecutar en pantalla con datos ficticios:

```json
{
  "name": "Ana Demo",
  "service": "automatizacion",
  "message": "Quiero ordenar los leads que llegan por Instagram"
}
```

Mostrar una salida inválida, explicar por qué `Structured Output Parser` existe y volver a
ejecutar hasta obtener un JSON válido.

### Bloque 3 · Cuándo sí aparece el agente · 5:00–7:30

> Ahora cambiemos el problema. El sistema ya no solo clasifica. Tiene que decidir si
> consulta el CRM, busca una respuesta en documentación o pide un dato faltante.
>
> Ahí conecto `AI Agent` a un `Chat Model` y le doy herramientas pequeñas. Por ejemplo:
> `get_lead_by_id`, `search_knowledge_base` y `request_missing_field`.
>
> El agente no recibe permiso para fijar precios, prometer stock ni enviar una propuesta
> final. Si necesita una acción externa sensible, prepara un borrador y deriva a una
> persona.

Mostrar los contratos de las tres tools. Explicar para cada una:

- nombre y descripción;
- input esperado;
- output esperado;
- lectura o escritura;
- si necesita aprobación.

### Bloque 4 · El loop y sus límites · 7:30–9:30

> Un loop de n8n puede ser determinista: `HTTP Request → IF → Wait` repite una ruta que ya
> definimos. El loop se vuelve agentivo cuando el modelo observa el resultado y elige la
> siguiente tool.
>
> Ambos necesitan condición de éxito, máximo de pasos, tiempo límite, presupuesto, permiso
> explícito para escrituras y una salida humana.
>
> Para un pago: éxito cuando `status = paid`; máximo tres consultas; espera de diez
> minutos; y alerta por Telegram si sigue pendiente. Sin esos frenos, el sistema puede
> repetir costo y error sin producir valor.

Mostrar el diagrama:

```text
HTTP Request → IF paid? → éxito
      ↑           │ no
      └─ Wait ← attempts < 3

attempts >= 3 → revisión humana
```

### Bloque 5 · Dónde entra MCP · 9:30–11:00

> Si la herramienta vive fuera de n8n o querés que distintas aplicaciones de IA accedan
> a la misma capacidad mediante un contrato estándar, MCP puede ser el puente.
>
> Pero MCP no decide permisos por vos. Antes de conectar un servidor, revisá qué tools
> expone, qué datos toca, qué acciones escriben y cuáles requieren aprobación.
>
> Poder conectar una herramienta no significa que el agente deba tener permiso para usarla
> sin límites.

Mostrar documentación y una lista de tools; nunca mostrar tokens o credenciales.

### Cierre · 11:00–12:00

> Quedate con esta regla. Usá workflow cuando el camino sea conocido. Usá una llamada a
> un modelo cuando necesites interpretar lenguaje. Usá un agente cuando el modelo deba
> elegir la próxima herramienta según el resultado. Usá MCP cuando necesites estandarizar
> la conexión con herramientas o datos externos.
>
> Y en todos los casos definí éxito, límites y revisión humana antes de hablar de
> autonomía.
>
> En el siguiente video voy a construir el ejemplo completo en n8n. Comentá cuál querés
> ver primero: clasificación de leads, asistente de soporte o investigación con fuentes.

---

## Orden de rodaje de hoy

### Bloque A · 45 minutos · todos los A-roll

1. Guion 1 frontal, con pausas de un segundo donde entrarán los overlays.
2. Guion 2 frontal, dejando espacio visual a la izquierda para el workflow.
3. Guion 8 primero: noticia vigente, cálculo y dos advertencias de migración.
4. Guiones 7 → 6 → 4 → 3 → 5 en una sola sesión: empezar humano, subir con polémica y
   terminar con las piezas técnicas. Cambiar encuadre o posición cada dos videos.
5. Repetir solamente los hooks y CTA en una segunda toma.

### Bloque B · 25 minutos · B-roll

Grabar las 12 tomas de la biblioteca. Cada clip dura 6–10 segundos. No hablar. No mostrar
credenciales, datos de clientes, conversaciones ni notificaciones personales.

### Bloque C · 25 minutos · captura de pantalla

1. Workflow del guion 2.
2. Ejecución con JSON ficticio.
3. Resultado inválido y resultado válido.
4. Contrato JSON de `get_lead_by_id`.
5. Diagrama del loop.
6. Página oficial de MCP.
7. Página oficial de Opus 5.5: hero, precios, disponibilidad/model ID y migración.

### Bloque D · 60–90 minutos · YouTube

Grabar primero la explicación completa a cámara. Después grabar la demostración y las
pantallas como inserts. Si la demo falla, conservar el error: explicar cómo se detecta y
se corrige aporta más valor que esconderlo.

---

## Instrucciones para edición

- Prioridad 1: Guion 8, por vigencia; usar sólo capturas oficiales y cálculo visible.
- Prioridad 2: Guion 1, formato nuevo.
- Prioridad 3: Guion 2, Feed normal.
- Prioridad 4: Guiones 3–7 con cortes mínimos y subtítulos.
- Prioridad 5: ensamblar YouTube con el mismo material de pantalla.
- No usar B-roll genérico de robots, cerebros brillantes o código falso.
- Los overlays deben probar la frase hablada; si no agregan evidencia, se eliminan.
- Mantener continuidad de mirada y manos entre cortes.
- Entregar un master limpio y una versión con subtítulos incrustados.

## Control de calidad y fuentes verificadas

Estado después de revisión técnica:

- Guiones 1–3: **aprobados con correcciones incorporadas**.
- Guiones 4–5: **reescritos** para separar loop determinista, loop agentivo y schema MCP.
- Guiones 6–7: **aprobados**.
- Guion 8: **aprobado condicionado** a capturas Playwright y a mantener atribuidos los
  claims de Anthropic.
- YouTube: grabar solamente con deck y pantallas reales; no afirmar que el parser valida
  verdad ni que `readOnlyHint` aplica permisos.

Fuentes:

- [Anthropic · Building effective agents](https://www.anthropic.com/engineering/building-effective-agents):
  diferencia entre workflows con rutas predefinidas y agentes que dirigen dinámicamente
  el proceso y las herramientas.
- [MCP · Architecture](https://modelcontextprotocol.io/specification/2025-11-25/architecture):
  hosts, clients, servers, tools, resources y prompts.
- [MCP · Tools](https://modelcontextprotocol.io/specification/2025-11-25/server/tools):
  `inputSchema`, `outputSchema`, annotations y límites de `readOnlyHint`.
- [n8n · Structured Output Parser](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.outputparserstructured/):
  validación estructural mediante JSON Schema.
- [n8n · Switch](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.switch/):
  rutas por reglas y fallback.
- [Anthropic · Claude Opus 5.5](https://www.anthropic.com/claude-opus-5-5): fecha,
  disponibilidad, modelo y claims del lanzamiento.
- [Anthropic · Pricing](https://platform.claude.com/docs/en/about-claude/pricing): tarifas
  estándar, caché, Batch y Fast mode.
- [Anthropic · Migration guide](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide):
  thinking adaptativo, effort, tool choice, computer use y cambios incompatibles.
