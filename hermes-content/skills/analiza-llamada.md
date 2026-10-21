# Skill: Analiza Llamada de Venta

## Cuándo usar
Cuando Sergio envía una transcripción de llamada (texto pegado, archivo .txt o audio transcrito) y quiere que Hermes extraiga los datos del cliente, genere la propuesta y sugiera los próximos pasos.

Comandos que activan este skill:
- `Analiza llamada: [transcript]`
- `Transcripción llamada: [texto]`
- `Procesa llamada con [empresa]`
- Cuando se adjunta un .txt o .json con una transcripción y se pide analizarla

## Flujo completo

### Input que puede llegar

**Opción A — Transcript pegado en Telegram:**
```
Analiza llamada:
Hola Ricardo, soy Sergio de ONIA...
[resto del transcript]
```

**Opción B — Archivo .txt adjunto en Telegram:**
→ Descargar archivo → ejecutar script

**Opción C — Audio de voz en Telegram:**
→ Pasar primero por transcripción (ver sección Whisper abajo)

### Lo que Hermes extrae

Del transcript, extraer y estructurar:
- Nombre de la empresa y contacto
- Industria / rubro
- Necesidad principal y secundarias
- Presupuesto mencionado (si lo hay)
- Objeciones o preocupaciones expresadas
- Nivel de interés detectado (alto/medio/bajo)
- Próximo paso acordado y fecha
- Productos ONIA relevantes según la conversación

### Lo que Hermes hace automáticamente

1. Ejecutar `scripts/analiza-transcripcion.js` con el transcript
2. El script llama a Claude Haiku para extracción estructurada
3. Genera un borrador de propuesta con los datos extraídos (la que sale al cliente se arma con propuestas-comerciales-onia; no se envía sin "Apruebo contactar: <empresa>")
4. Imprime resumen ejecutivo + próximos pasos
5. Hermes reporta el resultado por Telegram

## Ejecutar desde terminal

```bash
# Desde archivo .txt
node scripts/analiza-transcripcion.js llamada-epic-motion.txt

# Desde pipe
cat llamada.txt | node scripts/analiza-transcripcion.js

# Desde texto directo
node scripts/analiza-transcripcion.js --texto="Hola Ricardo, soy Sergio de ONIA..."
```

Variable requerida: `ANTHROPIC_API_KEY`

## Flujo n8n con audio de Telegram

Para el pipeline completamente automático — audio → transcript → propuesta:

```
[Telegram] Audio note enviado por Sergio
    ↓
[n8n] Telegram Trigger — detectar mensaje de voz
    ↓
[n8n] HTTP Request → OpenAI Whisper API
    Body: multipart/form-data con el audio
    Model: whisper-1
    Language: es
    → Output: texto transcrito
    ↓
[n8n] Execute Command
    node scripts/analiza-transcripcion.js --texto="{{ $json.text }}"
    ↓
[n8n] Leer archivo HTML generado
    ↓
[n8n] Telegram → enviar resumen al chat de Sergio
    ↓
[n8n] Telegram → enviar archivo HTML como documento
```

Costo: sin cifra fija; medirlo en la primera corrida. Preferir la transcripción local (Speaches, ver inteligencia-reuniones-onia).

## Interpretación de transcriptos imperfectos

Si el transcript tiene errores de transcripción (nombres mal escritos, palabras cortadas):
- Mantener los datos con "[verificar]" donde haya dudas
- No inventar datos que no estén en el texto
- Si la empresa no se entiende claramente, pedir confirmación antes de generar propuesta

## Señales de interés a detectar

**Alto:**
- "cuándo podemos empezar"
- "me interesa mucho"
- "esto es justo lo que necesitamos"
- Preguntas sobre precios y planes específicos
- Menciona fecha de inicio o deadline

**Medio:**
- "suena bien, voy a pensarlo"
- "me gustaría ver más detalles"
- "necesito consultarlo con"
- Preguntas generales sin compromiso

**Bajo:**
- "no es el momento"
- "estamos bien por ahora"
- Respuestas monosílabas o desinteresadas
- No pregunta nada al vendedor

## Manejo de objeciones detectadas

Cuando el script detecta objeciones, Hermes debe:
1. Listarlas en el resumen
2. Para objeciones comunes de ONIA, preparar la respuesta:

| Objeción | Respuesta ONIA |
|---|---|
| "Es muy caro" | Mostrar ROI: costo de no tener sistema vs costo mensual |
| "Tenemos web/sistema" | Preguntar si resuelve el problema específico que mencionaron |
| "Necesito pensarlo" | Fijar fecha concreta para el próximo contacto |
| "No tenemos tiempo de implementar" | Hablar del onboarding acompañado de ONIA |
| "¿Y si no funciona?" | Hablar del período de prueba y soporte incluido |

## Output esperado para Sergio (vía Telegram)

```
📋 ANÁLISIS DE LLAMADA — Epic Motion Group

👤 Ricardo Limpias — Audiovisual | Santa Cruz
🔥 Interés: ALTO
💰 Presupuesto mencionado: "algo razonable"

🎯 Necesidad: Web premium que muestre su portafolio audiovisual y capture leads corporativos

⚠️ Objeciones:
• Quieren ver ejemplos antes de decidir
• Preocupación por tiempo de entrega

✅ Acordado: Enviarles propuesta + muestra de webs similares

📑 Propuesta generada:
→ hermes-content/propuestas/propuesta-epic-motion-group-xxx.html

📌 Próximos pasos:
1. Preparar la propuesta HOY (se envía solo con "Apruebo contactar: <empresa>")
2. Respuesta en < 24h: "Aquí está tu propuesta personalizada"
3. Registrar en CRM: Propuesta enviada
```

## Integración con CRM

Después de analizar la llamada, actualizar en Notion/CRM:
- Estado pipeline → "Propuesta enviada"
- Agregar notas con objeciones detectadas
- Registrar fecha de próximo seguimiento (5-7 días si no hay fecha acordada)
- Asociar archivo de propuesta al lead
