# Guiones del día · lunes 21 de septiembre de 2026

## Tema de la jornada

**Cómo elegir y diseñar la primera automatización de un negocio.**

Cada pieza enseña un procedimiento que se puede aplicar hoy. No son opiniones sueltas:
el espectador debe poder copiar la plantilla, dibujar el flujo o tomar una decisión al
terminar el video.

## Producción

| Superficie | Pieza | Qué se graba |
|---|---|---|
| Feed | Pilar de Samuel | Samuel lo prepara y lo graba; no se guioniza aquí |
| Feed | Carrusel que reemplaza el b-roll | 7 láminas educativas, texto abajo |
| Feed | Video normal Sergio | Guion 1, con pantalla de un flujo real saneado |
| Trial | Reutilización | Los 3 contenidos del Feed + un yap de Samuel |
| Trial v2 | Cámara directa | Guiones 2–6, cinco microtutoriales |

Total: **3 Feed + 4 Trial + 5 Trial v2 = 12 piezas**.

## Frentes cubiertos hoy

| Frente | Pieza concreta | Herramientas/nombres que deben aparecer |
|---|---|---|
| Marca personal Sergio | Feed normal + 5 videos a cámara | `n8n`, `Webhook`, `IF`, `Google Sheets`, `Telegram`, `AI Agent`, `OpenAI Chat Model`, `Claude Code`, `GitHub`, `MCP`, `Notion`, `Loop Over Items`, `Wait` |
| Comunidad WhatsApp | Drop con ejercicio ejecutable | `Webhook → IF → Google Sheets → Telegram` + plantilla JSON |
| TikTok / Instagram Reels | Recortes de 30–45 s | Un resultado visible por video; nombres de nodos en pantalla |
| YouTube | 3 videos largos derivados | workflow n8n completo; Claude Code + GitHub; MCP/agentes/loops |
| Samuel | Pilar y yap | Samuel decide y graba; esta cola no le pone palabras en la boca |
| Edición | Primer corte del Feed normal | pantalla principal, subtítulos rail-first, overlays `ENTRADA / REGLA / SALIDA` |

Regla de especificidad: cada video debe mostrar una herramienta, un nodo, un campo,
un comando o una decisión concreta. Si no se puede pausar la pantalla y copiar algo,
el video todavía está demasiado abstracto.

---

## Feed · carrusel educativo

### Título

**La matriz para saber qué automatizar primero**

### Láminas

1. **NO ELIJAS LA HERRAMIENTA TODAVÍA**
   Primero elegí la tarea. Después elegís n8n, una skill, un agente o nada.

2. **ESCRIBÍ LA ENTRADA**
   ¿Qué dispara el proceso? Ejemplo: llega un formulario de contacto.

3. **ESCRIBÍ LA DECISIÓN**
   ¿Qué regla aplicás? Ejemplo: si faltan teléfono o servicio, pedir el dato; si está
   completo, registrar y avisar.

4. **ESCRIBÍ LA SALIDA**
   ¿Qué tiene que existir al terminar? Un registro, una alerta y una persona responsable.

5. **PUNTUÁ LA TAREA**
   Repetición · minutos · claridad de reglas · costo del error.
   Puntúa cada categoría de 1 a 5.

6. **EMPEZÁ POR ESTA COMBINACIÓN**
   Alta repetición + reglas claras + salida verificable + error controlable.
   Esa es mejor candidata que una tarea “interesante” pero ambigua.

7. **EJEMPLO DE FLUJO**
   `Formulario → validar → registrar → avisar`
   Si no podés dibujarlo así, todavía no está listo para automatizarse.

8. **REGLA DE SEGURIDAD**
   La automatización puede preparar, clasificar y avisar.
   El humano confirma dinero, precio, stock, garantías y reclamos sensibles.

9. **EJERCICIO**
   Elegí una tarea de esta semana y anotá: entrada, regla, salida y puntuación.

### Caption

La mayoría empieza preguntando qué herramienta usar. El orden correcto es otro:

`entrada → decisión → salida → verificación → herramienta`

Si no podés escribir esos cinco elementos, todavía no tenés una automatización. Tenés
una idea.

Comentá una tarea repetida de tu negocio y te digo cómo la mapearía.

---

## Guion 1 · Feed normal de Sergio

### Título

**n8n: Webhook → IF → Google Sheets → Telegram para no perder leads**

### Qué se muestra

Un workflow de prueba en n8n, sin datos reales:
`Webhook → IF → Google Sheets → Telegram`.

Payload ficticio para pegar en el test del `Webhook`:

```json
{
  "name": "Ana Demo",
  "phone": "+59170000000",
  "service": "landing page",
  "source": "instagram"
}
```

### Guion hablado

> Si querés diseñar tu primera automatización, no empieces conectando veinte aplicaciones.
> En n8n, empezá con cuatro pasos que puedas probar.
>
> Primero, `Webhook`: recibe `name`, `phone`, `service` y `source`.
>
> Segundo, `IF`: comprobá que `phone` y `service` no estén vacíos.
>
> En la salida verdadera, `Google Sheets` usa `Append Row` para guardar el lead.
> Después, `Telegram` usa `Send Message` para avisarle al responsable.
>
> En la salida falsa, no guardes un lead incompleto: mandá un mensaje pidiendo el campo
> que falta.
>
> Eso ya es una automatización funcional: recibe, valida, registra y avisa.
> No agregues `AI Agent` todavía. Primero hacé que el flujo determinista funcione.
>
> Comentá una tarea repetitiva y la convertimos en estos tres nodos.

### En pantalla

- En `Webhook`, mostrar el JSON ficticio.
- En `IF`, mostrar las condiciones `phone is not empty` y `service is not empty`.
- En `Google Sheets`, mostrar `Append Row` y el mapeo `name`, `phone`, `service`, `source`.
- En `Telegram`, mostrar `Send Message` con texto de prueba.
- Terminar con `ENTRADA → VALIDACIÓN → REGISTRO → AVISO`.

---

## Guion 2 · Trial v2

### Título

**n8n: cómo mapear un lead con Webhook, IF, Google Sheets y Telegram**

### Guion hablado

> Antes de abrir n8n, escribí estos cuatro campos.
>
> Entrada: un formulario manda `name`, `phone`, `service` y `source` al `Webhook`.
>
> Decisión: el nodo `IF` revisa que `phone` y `service` existan.
>
> Salida: `Google Sheets` hace `Append Row` y `Telegram` hace `Send Message` al equipo.
>
> Excepción: si falta `phone`, la rama falsa manda un mensaje para pedirlo y no registra
> el lead como completo.
>
> Copiá esta estructura antes de construir cualquier workflow. Te evita conectar nodos
> sin saber qué problema resuelven.

### Texto en pantalla

```text
ENTRADA:
DECISIÓN:
SALIDA:
EXCEPCIÓN:
```

En pantalla, escribir debajo: `Webhook → IF → Google Sheets → Telegram`.

---

## Guion 3 · Trial v2

### Título

**n8n AI Agent: clasificá leads sin dejar que la IA responda sola**

### Guion hablado

> Un `AI Agent` de n8n no debería recibir permiso para hacer todo.
>
> Primero, `Webhook` recibe el mensaje del formulario.
>
> Después, `AI Agent` usa `OpenAI Chat Model` para clasificarlo en `web`, `automatización`
> o `otro`.
>
> Pedile una salida estructurada con tres campos: `categoria`, `urgencia` y
> `requiere_humano`.
>
> Luego, `IF` comprueba `requiere_humano = true`.
>
> Si es verdadero, `Telegram` avisa a una persona. Si es falso, `Google Sheets` guarda la
> clasificación para revisarla después.
>
> La IA clasifica. El nodo `IF` decide la ruta. El humano confirma la respuesta.
> Esa separación es más segura que darle al agente permiso para enviar mensajes.

### En pantalla

```text
Webhook → AI Agent + OpenAI Chat Model → IF
                                      ↘ Telegram: revisión humana
                                      ↘ Google Sheets: registro
```

Salida JSON para mostrar en pantalla:

```json
{
  "categoria": "web",
  "urgencia": "normal",
  "requiere_humano": true
}
```

---

## Guion 4 · Trial v2

### Título

**Automatización, AI Agent o loop: elegí con herramientas reales**

### Guion hablado

> No todo problema necesita un agente. Elegí según la forma del problema.
>
> Si las reglas son fijas, usá n8n con `IF`, `Google Sheets` y `Telegram`.
>
> Si tiene que leer lenguaje y clasificar una consulta, usá `AI Agent` con `OpenAI Chat
> Model`, salida JSON y solo las herramientas que necesita.
>
> Si tiene que revisar lo mismo cada cierto tiempo, usá `Schedule Trigger`, `HTTP Request`,
> `IF` y `Wait`, con un límite de intentos.
>
> Ejemplo: registrar un formulario es automatización. Clasificar un mensaje es un agente.
> Revisar cada diez minutos si una API responde es un loop.
>
> Elegir la arquitectura correcta te ahorra más que elegir el modelo de moda.

### En pantalla

```text
IF + Google Sheets + Telegram       → AUTOMATIZACIÓN
AI Agent + OpenAI Chat Model        → AGENTE
Schedule Trigger + HTTP Request
+ IF + Wait                         → LOOP
```

---

## Guion 5 · Trial v2

### Título

**MCP en Claude Code: conectá Notion sin darle permiso para todo**

### Guion hablado

> MCP no es un modelo y tampoco es magia. Es el contrato que permite que un cliente como
> `Claude Code` use herramientas de un servidor.
>
> Para probar un servidor remoto de Notion, el comando es:
> `claude mcp add --transport http notion https://mcp.notion.com/mcp`.
>
> Después ejecutás `claude mcp list` y en Claude Code abrís `/mcp` para autenticarlo.
>
> Antes de usarlo, definí el contrato: qué herramienta llamás, qué input acepta, qué
> devuelve y si es lectura o escritura.
>
> Un ejemplo seguro sería `get_lead_by_id`, que recibe `lead_id` y devuelve nombre,
> estado y fuente. Solo lectura. No puede borrar el lead ni enviar mensajes.
>
> MCP estandariza el acceso; no reemplaza los permisos, la validación ni el proceso.

### En pantalla

```json
{
  "tool": "get_lead_by_id",
  "input": { "lead_id": "string" },
  "output": { "name": "string", "status": "string", "source": "string" },
  "permissions": ["read"]
}
```

No mostrar tokens ni credenciales. Si el servidor no está conectado, grabar el comando
como explicación y enseñar `claude mcp list` con una configuración de prueba.

---

## Guion 6 · Trial v2

### Título

**n8n: cómo construir un loop con Wait, IF y límite de intentos**

### Guion hablado

> Un loop útil en n8n no empieza con tres agentes. Empieza con una condición de salida.
>
> Ejemplo: consultás una API de pagos y querés esperar hasta que el estado sea `paid`.
>
> Usá `Schedule Trigger` para iniciar, `HTTP Request` para consultar el estado, `IF` para
> comparar `status = paid` y `Wait` para esperar diez minutos antes de volver a consultar.
>
> Guardá `attempt` en el dato del workflow y cortá cuando llegue a tres intentos.
> Si llega a `paid`, `Telegram` avisa que terminó. Si llega a tres intentos sin éxito,
> `Telegram` avisa que necesita una persona.
>
> Sin condición de salida, límite y aviso, no tenés autonomía. Tenés un workflow que puede
> consultar para siempre.

### En pantalla

```text
Schedule Trigger → HTTP Request → IF status = paid → Telegram: terminado
                         ↑              │
                         └── Wait 10 min

attempt >= 3 → Telegram: revisión humana
```

---

## Trial · reutilización

- Trial 1: el pilar de Samuel del día.
- Trial 2: el carrusel convertido en teaser si la plataforma acepta el formato.
- Trial 3: el video normal de Sergio.
- Trial 4: yap de Samuel: **“Antes de automatizar, escribí qué entra, qué decisión tomás
  y qué tiene que quedar hecho.”** Samuel lo desarrolla con su voz.

No vuelvas a grabar los tres contenidos del Feed para Trial.

## Drop de comunidad del día

> Hoy vamos a elegir qué automatizar primero.
>
> Copiá esta plantilla con una tarea real de tu negocio y elegí nombres concretos:
>
> `Entrada:` ¿qué dispara el proceso?
>
> `Herramienta:` ¿entra por `Webhook`, `Telegram Trigger` o `Google Sheets Trigger`?
>
> `Decisión:` ¿qué valida el nodo `IF`?
>
> `Salida:` ¿qué tiene que quedar hecho?
>
> `Excepción:` ¿cuándo debe intervenir una persona?
>
> Ejemplo funcional: `Webhook` recibe `name`, `phone`, `service` y `source` → `IF` valida
> `phone` y `service` → `Google Sheets / Append Row` registra → `Telegram / Send Message`
> avisa → si falta `phone`, se detiene y pide el dato.
>
> Compartí tu ejemplo en General. Te decimos si conviene `IF`, `AI Agent` o un loop con
> `Wait`. No empieces por el modelo: empezá por la entrada y la salida.

## Aperturas para YouTube

Estos cortos no se quedan en clips sueltos. Cada uno abre un video largo con una promesa
demostrable:

1. **Construí un sistema de leads en n8n desde cero** — `Webhook`, `IF`, `Google Sheets`,
   `Telegram`, manejo de datos faltantes y prueba con JSON ficticio.
2. **Claude Code para construir una automatización sin perder el control** —
   `npm install -g @anthropic-ai/claude-code`, `claude`, lectura del repo, cambios pequeños,
   `git diff`, `git status` y revisión humana antes del commit.
3. **MCP, AI Agent y loops: qué problema resuelve cada uno** — `claude mcp add`,
   `claude mcp list`, `/mcp`, `AI Agent + OpenAI Chat Model`, `HTTP Request`, `IF` y `Wait`.

Estructura de cada video largo: problema real → arquitectura → construcción en pantalla →
prueba con datos ficticios → error que apareció → criterio para saber si funciona → recurso
exclusivo para la comunidad.

## Orden de rodaje

1. Grabar guiones 2–6 a cámara, sin cambiar set; cada uno debe nombrar la herramienta y
   mostrar su diagrama o JSON.
2. Grabar guion 1 con n8n abierto y el workflow `Webhook → IF → Google Sheets → Telegram`.
3. Grabar un plano limpio de cada nodo y de cada error/exception para los cortes.
4. Crear el carrusel con la matriz de nodos y herramientas.
5. Samuel graba su pilar y su yap; no se mezclan con los guiones de Sergio.

Cada video tiene una sola enseñanza. Si no podés mostrar la plantilla, el diagrama o el
contrato en pantalla, no lo publiques todavía.
