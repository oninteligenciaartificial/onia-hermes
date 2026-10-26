# Recursos · serie Sistemas con IA

**Estado:** listos como contenido fuente; falta publicar cada recurso en la bóveda web y
conectar la entrega por comentario. Mientras eso no exista, Sergio Urcullo los entrega
manualmente. No prometer un DM automático.

## Palabra `HYPERFRAMES`

Requisitos de la demo: Node.js 22 o superior y FFmpeg disponibles en terminal.

### Composición mínima

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1920, height=1080" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  </head>
  <body style="margin:0;background:#111;color:white;font-family:Arial,sans-serif">
    <div
      id="root"
      data-composition-id="main"
      data-start="0"
      data-width="1920"
      data-height="1080"
      data-duration="5"
      style="position:relative;width:1920px;height:1080px;overflow:hidden"
    >
      <section
        id="title-card"
        class="clip"
        data-start="0"
        data-duration="5"
        data-track-index="1"
        style="position:absolute;inset:0;display:grid;place-items:center"
      >
        <h1 id="title" style="font-size:96px">Hola HyperFrames</h1>
      </section>
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const timeline = gsap.timeline({ paused: true });
      timeline.from("#title", { y: 48, opacity: 0, duration: 0.6 }, 0.2);
      window.__timelines.main = timeline;
    </script>
  </body>
</html>
```

### Flujo de control

```powershell
npx hyperframes lint
npx hyperframes check --snapshots
npx hyperframes preview
# Sólo después de revisar:
npx hyperframes render --quality high --output out.mp4
```

Checklist: composición identificada · timeline pausada y registrada · sin errores de
runtime · sin desbordes · contraste aprobado · snapshots mirados · render aprobado por
una persona.

## Palabra `OPUS`

### Calculadora de la carga del video

```text
Costo = input_millones × tarifa_input
      + output_millones × tarifa_output
      + cache_read_millones × tarifa_cache_read

Carga de ejemplo:
0.2M input + 0.05M output + 5M cache read

Opus 5.5 = 0.2×4 + 0.05×20 + 5×0.20 = $2.80
Opus 5   = 0.2×5 + 0.05×25 + 5×0.50 = $4.75
```

### Tabla A/B para copiar

| Caso | Pasó | Input | Output | Cache read | Tool calls | Latencia | Costo |
|---|---|---:|---:|---:|---:|---:|---:|
| 01 | sí/no | | | | | | |
| 02 | sí/no | | | | | | |
| …20 | sí/no | | | | | | |

Calcular por modelo:

```text
tasa_de_exito = tareas_exitosas / 20
costo_por_exito = costo_total / tareas_exitosas
```

No decidir por un benchmark aislado. Usar veinte tareas representativas, el mismo input y
el mismo criterio de aprobación. Registrar aparte las llamadas a herramientas pagadas.

### Checklist de migración a `claude-opus-5-5`

- Cambiar el model ID en un entorno de prueba.
- Quitar `thinking: disabled` y presupuestos fijos; usar thinking adaptativo/effort.
- Reemplazar tool choice forzado por `auto`, schemas estrictos e instrucciones explícitas.
- Mantener el historial compatible con preserved thinking.
- Manejar `stop_reason: refusal`.
- Probar tool calls, costos, latencia y errores antes de producción.

Fuentes oficiales consultadas el 22-sep-2026: anuncio de Anthropic, pricing y migration
guide. El 40 % es una estimación de Anthropic para cargas típicas; no una rebaja plana por
token ni una garantía para todos los flujos.

## Palabra `N8N`

### Mapa de nodos

```text
Webhook
  → Basic LLM Chain + OpenAI Chat Model
  → Structured Output Parser
  → Google Sheets
  → Switch
      ↘ requiere_humano → Telegram → revisión
      ↘ web → pipeline web
      ↘ automatizacion → pipeline automatización
      ↘ otro → bandeja general
      ↘ default → bandeja general
```

### Prompt

```text
Clasificá el mensaje del lead.

Categoría: web | automatizacion | otro
Urgencia: baja | normal | alta
requiere_humano = true si pide precio, contrato, garantía o una promesa comercial.

Mensaje: {{ $json.message }}
```

### JSON Schema del parser

```json
{
  "type": "object",
  "properties": {
    "categoria": { "type": "string", "enum": ["web", "automatizacion", "otro"] },
    "urgencia": { "type": "string", "enum": ["baja", "normal", "alta"] },
    "requiere_humano": { "type": "boolean" }
  },
  "required": ["categoria", "urgencia", "requiere_humano"],
  "additionalProperties": false
}
```

Casos mínimos: solicitud web clara · mensaje ambiguo · consulta de precio/contrato. El
parser valida la forma; una persona sigue validando la decisión de negocio.

## Palabra `MAPA`

### Árbol de decisión

1. ¿La ruta se conoce antes de ejecutar? Usá un **workflow**.
2. ¿Sólo necesitás interpretar lenguaje? Agregá una **llamada a un modelo**.
3. ¿El modelo debe elegir la próxima herramienta según el resultado? Usá un **agente**.
4. ¿Debe repetir una ruta ya definida? Usá un **loop determinista**. Si el modelo observa
   y elige la siguiente tool, es un **loop agentivo**.
5. ¿Varias aplicaciones necesitan un contrato estándar para `tools`, `resources` o
   `prompts`? Evaluá **MCP**.

### Checklist antes de conectar una tool

- Nombre específico: `get_lead_by_id`, no `buscar`.
- Cuándo debe usarla y cuándo no.
- Input validable y output predecible.
- Lectura o escritura separadas.
- Datos personales que recibe o devuelve.
- Efecto externo: mensaje, pago, cambio de estado o archivo.
- Aprobación humana necesaria.
- Condición de éxito, máximo de pasos, timeout, presupuesto y forma de detenerse.
- Registro de cada ejecución y ruta de error.

`readOnlyHint` describe la intención de una tool; no reemplaza los permisos reales del
host, las credenciales ni el servidor.

Regla final: poder conectar una herramienta no significa que el agente deba usarla sin
límites.

## Palabra `1A1`

### Preparación de una llamada de 45 minutos

```text
ANTES
resultado que busca:
stack/proceso actual:
bloqueo principal:
evidencia o captura:
3 decisiones que necesita tomar:

DURANTE
00–05  confirmar resultado
05–30  diagnóstico y causas
30–40  plan de acciones
40–45  responsable, fecha y siguiente paso

DESPUÉS
resumen:
acción:
responsable:
fecha:
pregunta repetida que puede convertirse en contenido anonimizado:
```

No grabar, transcribir, nombrar ni reutilizar un caso privado sin consentimiento.

## Palabra `PROCESO`

### Mapa previo a automatizar

| Entrada | Responsable | Dato necesario | Decisión | Salida | Excepción |
|---|---|---|---|---|---|
| | | | | | |

Ejecutar el proceso manual cinco veces y registrar las excepciones. No automatizar hasta
que éxito, error, responsable y salida humana puedan escribirse en una frase.

## Palabra `BOLIVIA`

### Calculadora editable en bolivianos

```text
beneficio_mensual_estimado =
  horas_recuperadas × costo_hora_Bs
  + errores_evitados_Bs
  + oportunidades_recuperadas_Bs

retorno_mensual_estimado =
  beneficio_mensual_estimado - costo_mensual_sistema_Bs

meses_para_recuperar =
  costo_inicial_Bs / retorno_mensual_estimado
```

Cada número debe declararse como dato medido o supuesto. No usar promedios nacionales
inventados. Si el proceso cambia cada semana, tiene volumen bajo o no tiene responsable,
primero se ordena y después se automatiza.

## Palabra `BÓVEDA`

### Flujo mínimo comentario → recurso → comunidad

```text
contenido con palabra clave
→ respuesta manual o integración autorizada
→ URL específica del recurso
→ formulario opcional con consentimiento
→ webhook de n8n
→ entrega
→ registro de estado
→ invitación adecuada: comunidad, evento o 1:1
```

Campos mínimos: `comment_id`, `from_id`, `keyword`, `resource_url`, `delivery_status`,
`consent_at`. Postiz programa publicaciones; no se presenta como inbox de DMs.

## Palabra `SANTA CRUZ`

### Agenda del laboratorio fundador · 120 minutos

```text
00–15  llegada + cada persona escribe un problema real
15–40  demostración práctica de un sistema pequeño
40–85  construcción individual o en parejas
85–105 hot seats, intercambio de ideas y contactos útiles
105–120 demos rápidas + siguiente acción con responsable y fecha
```

### Formulario fundador

1. Nombre y forma de contacto.
2. ¿Querés aprender, vender o aplicar IA en un negocio?
3. ¿Qué problema concreto querés trabajar durante el primer encuentro?
4. ¿Qué nivel tenés: empezando, ya uso herramientas o ya construyo sistemas?
5. ¿Qué horario presencial podés sostener una vez por semana en Santa Cruz?
6. ¿Podés llevar laptop?
7. ¿Aceptás que registremos solo resultados generales? Fotos, nombre, voz y caso
   privado requieren una autorización aparte.

Mensaje de entrega: `Te paso la agenda y las siete preguntas del formulario fundador.
Respondeme primero si querés aprender, vender o aplicar IA y qué problema llevarías.`

## Respuestas manuales por palabra

- `MODELO`: enviar la tabla A/B de `OPUS` y pedir diez tareas representativas; el criterio
  es costo por tarea exitosa, no el benchmark más alto.
- `OPUS`: enviar calculadora, tabla A/B y checklist de migración de esta sección.
- `1A1`: enviar la plantilla de preparación y agenda de 45 minutos.
- `PROCESO`: enviar la tabla de seis columnas y el test de cinco ejecuciones manuales.
- `BOLIVIA`: enviar la calculadora en Bs y pedir que marque datos medidos vs supuestos.
- `BÓVEDA`: enviar el mapa de entrega y aclarar si la respuesta será manual.
- `SANTA CRUZ`: enviar la agenda de 120 minutos y las siete preguntas del formulario
  fundador; pedir perfil, problema y horario antes de prometer cupo o sede.
- `LOOP`: enviar el árbol de decisión de `MAPA` más el bloque de límites: condición de
  éxito, `maxAttempts`, espera, timeout, presupuesto y salida humana.
- `MCP`: enviar el checklist “mantenedor, credenciales, capacidades, lectura/escritura y
  aprobación”; añadir que annotations no sustituyen permisos reales.
- `TOOL`: enviar la plantilla `get_lead_by_id` con descripción, `inputSchema`,
  `outputSchema`, `required`, `additionalProperties: false` y annotations.
- `HECHO`: responder con una pregunta de seguimiento: qué construyó, qué error apareció y
  cuál es el siguiente paso. No prometer archivo.
