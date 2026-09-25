# Paquete de grabación · marca personal · 22 de septiembre de 2026

## Qué se graba hoy

No intentar producir las 13 publicaciones como 13 rodajes. Hoy Sergio graba:

1. **Opus 5.5 primero:** A-roll, cálculo y advertencias de migración del guion 8.
2. Dos pickups de los videos 1 y 2 ya grabados.
3. Cinco A-roll verticales: guiones 7 → 6 → 4 → 3 → 5.
4. Una biblioteca de B-roll común.
5. Las capturas de pantalla de Opus 5.5, n8n, MCP y JSON.
6. Un YouTube horizontal: `MCP, agentes, loops y n8n`.
7. Tres historias cortas para conectar el rodaje con la comunidad.

Los decks de n8n y HyperFrames quedan listos para los siguientes bloques. No conviene
grabar tres clases largas después de los verticales si baja la claridad.

## Regla de formato

**Grabar A-roll y pantalla por separado.** La pantalla verde, el split vertical, el split
horizontal, los acercamientos y los overlays se componen en edición. Así una misma toma
sirve para Reel, TikTok, Shorts, historia y YouTube.

Excepción: una demo larga de YouTube puede grabarse ya dividida en OBS para ahorrar tiempo,
pero también se debe guardar la captura de pantalla limpia.

## Pickups de los dos videos ya grabados

### Video 1 · pickup de 12–15 segundos

Formato: frontal cerrado, vertical, fondo limpio.

> Si tu sistema solamente genera una respuesta y no puede elegir ni ejecutar acciones,
> no tenés un agente operativo: tenés una llamada al modelo.
>
> MCP puede estandarizar el acceso a tools, resources y prompts. n8n puede orquestar,
> registrar y limitar el proceso. El agente aparece cuando el modelo observa el resultado
> y elige la siguiente acción.

### Video 2 · pickup de 15–20 segundos

Formato: frontal con espacio vacío a la izquierda para insertar el workflow.

> Structured Output Parser valida la salida contra un JSON Schema. Si no cumple la
> estructura, el nodo falla; si cumple, todavía puede estar mal clasificada.
>
> Google Sheets registra. Switch revisa primero si necesita humano y Telegram avisa sólo
> en esa ruta.

## Video urgente · Opus 5.5

Formato final: Sergio a la izquierda en split vertical; captura oficial y cálculo a la
derecha. A-roll y pantalla se graban por separado.

Grabar:

- Hook frontal: “Claude Opus 5.5 salió hoy. Antes de cambiar tu modelo, te enseño a
  decidir con números si realmente te conviene.”
- Guion 8 completo, marcando con pausas `$4`, `$20`, `$0.20`, `$2.80`, `$4.75` y `41.1%`.
- Pickup de seguridad: “El 40 % es el resultado estimado por Anthropic para cargas
  típicas; por token nuevo la rebaja estándar es 20 %. Medí tu propia mezcla.”
- CTA: “Comentá OPUS y te paso la tabla del A/B.”

Captura real con Playwright:

1. Hero oficial con fecha de lanzamiento.
2. Precio de input, output y cache read.
3. Disponibilidad y modelo `claude-opus-5-5`.
4. Guía de migración: thinking adaptativo y cambio de tool choice.
5. Scroll limpio de 8–12 segundos para transiciones.

No grabar una supuesta respuesta del modelo sin ejecutar un test real. El video enseña a
medir la migración; no simula evidencia.

## Cinco videos verticales

### 1. Guion 7 · personal con B-roll

Formato final: A-roll frontal + voz sobre B-roll real. No usar pantalla verde.

Grabar:

- Hook frontal: “Guardé cientos de videos de inteligencia artificial y aun así no había
  construido nada.”
- Guion completo a cámara.
- B-roll: carpeta de guardados, cerrar tutoriales, abrir n8n, ejecución fallida, corrección,
  ejecución exitosa y libreta con `CONSTRUIR → ROMPER → DOCUMENTAR → EXPLICAR`.
- CTA frontal: “Comentá HECHO cuando termines hoy un sistema pequeño.”

### 2. Guion 6 · polémico con prueba

Formato final: cámara directa; a los 6 segundos cortar a pantalla completa y volver a
Sergio para el cierre.

Grabar:

- Hook frontal: “Si tu automatización siempre sigue A, B y C, probablemente no tenés un
  agente. Te vendieron un workflow con otro nombre.”
- Guion completo.
- Pantalla limpia: `Webhook → Basic LLM Chain → Structured Output Parser → Switch →
  Google Sheets`.
- Pantalla alternativa: `AI Agent + get_lead_by_id + search_docs + request_missing_field`.
- CTA: “¿Te vendieron un workflow como agente? Contame qué hacía.”

### 3. Guion 4 · split vertical de n8n

Formato final: pantalla arriba 60 %, Sergio abajo 40 %. Grabar las dos fuentes por separado.

Grabar:

- Hook frontal: “Este loop puede quedarse gastando dinero mientras dormís.”
- Guion completo, con pausa después de cada freno.
- Captura de n8n: `HTTP Request → IF → Wait → reintento → Telegram`.
- Overlay limpio: `done = paid`, `maxAttempts = 3`, `wait = 10 min`, `timeout = 35 min`,
  `fallback = human`.
- CTA: “Comentá LOOP y te paso el esquema completo de n8n.”

### 4. Guion 3 · pantalla verde MCP

Formato final: Sergio delante de documentación MCP y tarjetas laterales. Grabar A-roll
contra fondo verde o pared lisa, de cintura/pecho hacia arriba, dejando 40 % libre a la
derecha.

Grabar:

- Hook: “Conectar un MCP sin revisar esto es como entregarle las llaves de tu negocio a
  una IA.”
- Guion completo.
- Gestos separados apuntando a cinco posiciones: mantenedor, credenciales, capacidades,
  escritura y aprobación.
- Pantalla: arquitectura oficial MCP y lista saneada de tools, sin tokens.
- CTA: “Comentá MCP y te paso el checklist de seguridad.”

### 5. Guion 5 · JSON sobre el hombro

Formato final: Sergio a la izquierda y JSON ampliado a la derecha; alternar con toma sobre
el hombro.

Grabar:

- Hook: “Tu agente quizá no se está equivocando: tus herramientas están mal escritas.”
- Guion completo.
- Comparación en pantalla: `buscar` frente a `get_lead_by_id`.
- JSON real con `inputSchema`, `required`, `additionalProperties: false` y
  `annotations.readOnlyHint`.
- Frase obligatoria: “readOnlyHint describe intención; no reemplaza permisos reales.”
- CTA: “Comentá TOOL y te paso la plantilla del contrato.”

## YouTube de hoy · MCP, agentes, loops y n8n

Formato: horizontal 16:9. Sergio se graba sentado a la izquierda, dejando 55 % libre a la
derecha. El deck y las demos se capturan a pantalla completa por separado. Edición final:

- 0:00–0:45: Sergio a pantalla completa.
- 0:45–2:30: split 45/55 con deck.
- 2:30–5:00: pantalla n8n completa con Sergio en recuadro pequeño.
- 5:00–7:30: split horizontal con AI Agent y tools.
- 7:30–9:30: deck + workflow del loop.
- 9:30–11:00: pantalla verde sobre documentación MCP.
- 11:00–12:00: Sergio a pantalla completa.

Abrir el deck:

```powershell
npx hyperframes present hermes-content/carousels/out/yt-09-mcp-agentes-loops
```

Guion oral: `hermes-content/carousels/out/yt-09-mcp-agentes-loops/GUION.md`.

## Capturas que hay que entregar a edición

1. Opus 5.5: hero, costos, disponibilidad, model ID, migración y scroll.
2. Deck MCP completo, flecha derecha una vez por lámina.
3. Workflow determinista de leads.
4. AI Agent con tres tools pequeñas.
5. Loop `HTTP Request → IF → Wait` y salida Telegram.
6. JSON Schema del parser.
7. Tool `get_lead_by_id`.
8. Documentación MCP y lista de tools sin credenciales.

## Historias para comunidad

Grabar tres clips verticales de 8–12 segundos:

1. “Hoy estoy grabando una serie para separar workflows, agentes, loops y MCP.”
2. “¿Qué querés que construyamos en el primer encuentro de Santa Cruz: un workflow de
   leads o un agente con tools?”
3. “Voy a compartir el mapa y los errores reales, no sólo el resultado. Respondé
   COMUNIDAD si querés entrar al piloto.”

Edición agrega encuesta y caja de respuesta. No anunciar fecha ni lugar hasta que estén
confirmados.

## Dirección tomada de las referencias

- Erik Taveras: enseñar herramientas que realmente usa, unir autoridad técnica con
  comunidad y sesiones en vivo.
- Enrique Rocha / tododeia: construir una biblioteca pública útil y actualizable antes de
  empujar productos pagados.
- Santiago Muñoz / Horizontes IA: encuentros presenciales, casos reales y recursos que la
  comunidad pueda reutilizar.

La referencia es estructural. La identidad de Sergio debe ser: joven constructor boliviano,
herramientas literales, errores visibles, comunidad local y progreso documentado.
