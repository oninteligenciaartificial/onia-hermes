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
| Trial v2 | Cámara directa | Guiones 3–7: cinco videos de Sergio, edición mínima |
| YouTube | Video largo | Guion 8: una grabación de 10–14 minutos que abre la serie |

Total diario: **3 Feed + 4 Trial + 5 Trial v2 = 12 publicaciones**.

Material original que Sergio graba hoy: **7 verticales + 1 video largo**. Los contenidos
del Feed se reutilizan en Trial; no se vuelven a grabar.

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

> Si tu IA solamente responde preguntas, todavía no construiste un agente.
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
> MCP estandariza la conexión con las herramientas. n8n ejecuta, registra y controla el
> proceso. Pero el agente aparece cuando el modelo elige qué acción tomar según lo que
> observa.
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
> `Structured Output Parser` obliga a respetar ese JSON. Después, `Switch` manda el lead
> a `web`, `automatización` u `otro`. `Google Sheets` registra y `Telegram` avisa al
> responsable.
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
  → Switch
      ↘ web
      ↘ automatización
      ↘ otro
  → Google Sheets
  → Telegram
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

> MCP no vuelve inteligente a tu sistema. Estandariza cómo una aplicación de IA se
> conecta con herramientas y datos externos.
>
> Antes de instalar un servidor MCP, revisá cuatro cosas.
>
> Uno: qué herramientas expone. Dos: cuáles solo leen y cuáles escriben. Tres: qué datos
> recibe y devuelve cada herramienta. Cuatro: qué acción necesita aprobación humana.
>
> Por ejemplo, `get_lead_by_id` puede ser de solo lectura. `send_email` cambia el mundo
> externo y debería pedir confirmación.
>
> Si conectás un MCP sin revisar esos permisos, no creaste un mejor agente. Solo le diste
> más alcance al mismo modelo.
>
> Guardá este checklist antes de conectar tu próximo servidor.

### Texto en pantalla

```text
TOOLS
READ / WRITE
INPUT / OUTPUT
APPROVAL
```

---

## Guion 4 · Trial v2

### Título

**El loop mínimo para que un agente no se quede trabajando para siempre**

### Guion hablado

> Un agente no es solo un prompt. Es un loop: planifica, actúa, observa y ajusta.
>
> Pero si no definís una salida, ese loop puede gastar dinero o repetir errores.
>
> Para consultar un pago, por ejemplo, definí: `done` cuando `status` sea `paid`;
> `maxAttempts` igual a tres; una espera de diez minutos; y una salida humana si el estado
> sigue pendiente.
>
> En n8n eso puede verse como `HTTP Request → IF → Wait` y volver a consultar. Al tercer
> intento, corta y manda una alerta por `Telegram`.
>
> Loop sin condición de éxito, límite y escalamiento no es autonomía. Es una deuda que se
> ejecuta sola.

### Texto en pantalla

```text
PLAN → ACT → OBSERVE → ADJUST

done = status === "paid"
maxAttempts = 3
wait = 10 min
fallback = human
```

---

## Guion 5 · Trial v2

### Título

**La descripción de una tool decide si tu agente la usa bien**

### Guion hablado

> Si tu agente usa la herramienta equivocada, el problema puede no ser el modelo. Puede
> ser el contrato de la tool.
>
> Una tool necesita un nombre específico, una descripción que diga cuándo usarla, un
> input validable, un output predecible y efectos secundarios explícitos.
>
> En vez de llamar una herramienta `buscar`, llamala `get_lead_by_id`. Recibe `lead_id`,
> devuelve `name`, `status` y `source`, y declara `read_only: true`.
>
> Después separá otra tool para actualizar. Así el agente no confunde consultar con
> modificar.
>
> Antes de cambiar de modelo, revisá el contrato de tus herramientas. Un agente solo puede
> decidir bien entre opciones que están bien definidas.

### Overlay para copiar

```json
{
  "name": "get_lead_by_id",
  "input": { "lead_id": "string" },
  "output": {
    "name": "string",
    "status": "string",
    "source": "string"
  },
  "read_only": true
}
```

---

## Guion 6 · Trial v2 · polémico

### Título

**Mucho de lo que te venden como agente es un workflow con otro nombre**

### Guion hablado

> Opinión incómoda: mucho de lo que se vende como “agente de IA” es un workflow con una
> llamada a un modelo en el medio.
>
> Hacé esta prueba. Si los pasos siempre son `A → B → C`, es un workflow. Si un modelo
> clasifica texto pero después un `Switch` decide la ruta, es un workflow con IA.
>
> Es un agente cuando el modelo observa el resultado, elige entre varias herramientas y
> decide el siguiente paso dentro de límites definidos.
>
> Y esto no hace inferior al workflow. Para facturación, registro de leads o avisos, lo
> predecible suele ser mejor.
>
> No compres la palabra “agente”. Pedí que te muestren quién toma la decisión, qué tools
> puede usar y cómo se detiene.

### Texto hero

**¿QUIÉN DECIDE?**

---

## Guion 7 · Trial v2 · personal

### Título

**El problema de aprender tecnología mirando redes**

### Guion hablado

> Las redes te pueden hacer sentir productivo mientras solamente acumulás conceptos.
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
> Hoy elegí una tarea, construí una versión mínima y guardá el primer error. Ese error vale
> más que otros veinte videos guardados.

### B-roll simple

- Abrir una carpeta llena de tutoriales guardados.
- Cerrar esa ventana.
- Abrir n8n y ejecutar un workflow pequeño.
- Mostrar una ejecución fallida y luego una exitosa.

---

## Guion 8 · YouTube

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

> El agente entra en un ciclo: interpreta el objetivo, elige una tool, observa el resultado
> y decide qué hacer después. Ese loop necesita tres frenos.
>
> Primero, condición de éxito. Segundo, máximo de intentos. Tercero, escalamiento humano.
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
3. Guiones 3–7 en una sola sesión; cambiar encuadre o posición cada dos videos.
4. Repetir solamente los hooks y CTA en una segunda toma.

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

### Bloque D · 60–90 minutos · YouTube

Grabar primero la explicación completa a cámara. Después grabar la demostración y las
pantallas como inserts. Si la demo falla, conservar el error: explicar cómo se detecta y
se corrige aporta más valor que esconderlo.

---

## Instrucciones para edición

- Prioridad 1: Guion 1, formato nuevo.
- Prioridad 2: Guion 2, Feed normal.
- Prioridad 3: Guiones 3–7 con cortes mínimos y subtítulos.
- Prioridad 4: ensamblar YouTube con el mismo material de pantalla.
- No usar B-roll genérico de robots, cerebros brillantes o código falso.
- Los overlays deben probar la frase hablada; si no agregan evidencia, se eliminan.
- Mantener continuidad de mirada y manos entre cortes.
- Entregar un master limpio y una versión con subtítulos incrustados.

## Fuentes verificadas para los conceptos

- Anthropic, *Building effective agents*: diferencia entre workflows con rutas
  predefinidas y agentes que dirigen dinámicamente el proceso y las herramientas.
- Anthropic, *Trustworthy agents in practice*: ciclo de planificación, acción,
  observación y ajuste.
- Anthropic, documentación de MCP: protocolo abierto para conectar aplicaciones de IA
  con herramientas y datos externos.
- n8n Docs: workflows, herramientas de IA y revisión humana para llamadas sensibles.

