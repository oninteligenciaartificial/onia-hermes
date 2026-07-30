# Onia Center AI Model Routing 2026

Fecha: 2026-06-28.

## Estado verificado

Onia Center esta activo en local:

- App: `http://localhost:3012/onia-center`
- Supabase tunnel: `127.0.0.1:54321`
- Provider actual: `ONIA_ASSISTANT_PROVIDER=openai`
- Modelo actual: `OPENAI_ONIA_CENTER_MODEL=gpt-5.4-mini`

Prueba directa OpenAI API:

- `gpt-5.4-mini`: status 200, respondio `OK`.
- `gpt-5.5`: status 200, respondio `OK`.

Conclusion: billing/API ya funcionan y el proyecto tiene acceso al modelo mini y al modelo fuerte.

## Decision principal

No usar un solo modelo para todo Onia Center.

Usar `gpt-5.4-mini` como modelo operativo diario y `gpt-5.5` solo para tareas que realmente requieren razonamiento fuerte, estrategia, codigo o propuestas complejas.

Esto protege caja: Onia necesita velocidad y bajo costo para uso diario, pero calidad alta cuando una respuesta puede cambiar una venta, una entrega, una decision financiera o una arquitectura.

## Routing recomendado

| Modulo | Uso | Modelo recomendado | Motivo |
|---|---|---|---|
| Onia Bot interno diario | Preguntas sobre clientes, servicios, tareas, notas, comisiones propias visibles | `gpt-5.4-mini` | Buen balance costo/latencia/calidad. Suficiente para operacion diaria. |
| Agente Ventas y CRM | Siguientes pasos, resumen de leads, objeciones, tareas comerciales | `gpt-5.4-mini` | Alto volumen; no debe consumir modelo caro por cada pregunta. |
| Agente CEO mensual | Plan mensual, priorizacion, riesgos, caja, decisiones privadas | `gpt-5.5` | Requiere razonamiento fuerte y contexto cruzado. Debe correr pocas veces. |
| Finanzas/Fondo Onia | Alertas, centros contables, pagos bloqueados, uso premium | `gpt-5.4-mini` para alertas, `gpt-5.5` para revision mensual | La regla financiera debe venir de datos/calculos; el modelo solo explica y revisa. |
| Audio Intelligence | Analizar llamada/transcript y preparar propuesta | `gpt-5.4-mini` por defecto; `gpt-5.5` solo con escalamiento manual | Buen balance costo/calidad. La propuesta sigue siendo borrador interno con revision humana. |
| Transcripcion de audio | Audio a texto | Speaches local con `Systran/faster-distil-whisper-large-v3`; fallback `gpt-4o-mini-transcribe`; `gpt-4o-transcribe` solo si falla calidad | Primero open source/local. El fallback oficial cuesta aprox. USD 0.003/min y mantiene el flujo vivo si el tunel local cae. |
| Ideas Inbox/Reels | Clasificar idea, resumir link, crear tareas | `gpt-5.4-mini` | Volumen alto y riesgo bajo. |
| Media Lab/Remotion | Guion, storyboard, shot list, plantilla render | `gpt-5.4-mini`; subir a `gpt-5.5` para piezas importantes | El costo fuerte debe reservarse para piezas comerciales o marca Sergio. |
| Web Factory intake | Convertir formulario cliente en brief, scope y checklist | `gpt-5.4-mini` | Primera pasada barata. |
| Web Factory arquitectura/copy final | Estructura de landing, propuesta premium, automatizacion o sistema complejo | `gpt-5.5` | Impacta venta/alcance y evita prometer de mas. |
| Codex Queue | Preparar prompt tecnico | `gpt-5.4-mini` | El trabajo real lo hace Codex; el prompt builder no necesita modelo caro siempre. |
| Revision tecnica compleja | Arquitectura, migraciones, RLS, seguridad, refactors grandes | `gpt-5.5` o Codex con modelo fuerte | Alto riesgo tecnico. |
| Dify/RAG futuro | Respuestas con knowledge base y workflows | `gpt-5.4-mini` como default, `gpt-5.5` para escalamiento manual | Dify debe orquestar y filtrar; no debe reemplazar permisos. |
| Embeddings/RAG | Buscar docs, memoria saneada, catalogos | `text-embedding-3-small`; `text-embedding-3-large` solo si falla recall | Small es suficiente y barato para empezar. |

## Variables recomendadas

Mantener ahora:

```env
ONIA_ASSISTANT_PROVIDER=openai
OPENAI_ONIA_CENTER_MODEL=gpt-5.4-mini
ONIA_ASSISTANT_MAX_OUTPUT_TOKENS=900
```

Agregar cuando activemos los modulos:

```env
ONIA_DEEP_REASONING_MODEL=gpt-5.5
ONIA_FAST_MODEL=gpt-5.4-mini
ONIA_CHEAP_MODEL=gpt-5.4-nano
ONIA_AUDIO_ANALYSIS_MODEL=gpt-5.4-mini
ONIA_AUDIO_STT_BASE_URL=http://127.0.0.1:3108/v1
ONIA_AUDIO_STT_MODEL=Systran/faster-distil-whisper-large-v3
ONIA_AUDIO_STT_FALLBACK_PROVIDER=openai
ONIA_AUDIO_STT_FALLBACK_MODEL=gpt-4o-mini-transcribe
ONIA_AUDIO_STT_HIGH_QUALITY_MODEL=gpt-4o-transcribe
ONIA_EMBEDDING_MODEL=text-embedding-3-small
```

No guardar estos valores como secretos; los modelos no son secretos. Las API keys si son secretas y deben quedar solo en `.env.local`, Vercel, VPS o secret manager.

## Mejoras necesarias en Onia Center

1. Model Router server-side
   - Crear una utilidad `onia-ai-router` que elija modelo por `taskType`.
   - Registrar `taskType`, modelo usado, tokens aproximados, centro contable y actor.
   - Bloquear `gpt-5.5` para vendedores/freelancers salvo flujo aprobado.

2. Presupuesto y limites
   - Definir limite mensual OpenAI para Onia Center.
   - Alertar cuando el gasto estimado supere umbrales.
   - Registrar uso premium igual que Higgsfield.

3. Razonamiento configurable
   - Para tareas diarias: `reasoning.effort=low`.
   - Para CEO, arquitectura o propuestas complejas: `reasoning.effort=medium` o `high`.
   - Para respuestas breves en UI: `text.verbosity=low`.

4. Knowledge/RAG
   - No meter memoria privada completa en Dify.
   - Crear datasets saneados por rol: vendedor, Arthur, Sergio privado.
   - Usar embeddings para docs y catalogos antes de mandar mucho contexto al modelo.

5. Audio Intelligence
   - Intentar Speaches local primero y usar OpenAI STT mini solo como fallback.
   - Si hay llamada con varios hablantes, usar diarizacion solo cuando aporte valor.
   - Analisis comercial con `gpt-5.4-mini`; escalar a `gpt-5.5` solo si la propuesta es grande, compleja o afecta arquitectura/precio.

6. Web Factory
   - Separar generacion de brief, propuesta, copy y codigo.
   - El formulario cliente no debe desplegar ni enviar propuesta final sin aprobacion.
   - Usar `gpt-5.5` solo para scope complejo o decisiones de arquitectura.

## Regla operativa

Default diario:

```txt
gpt-5.4-mini
```

Escalar a:

```txt
gpt-5.5
```

solo si la tarea afecta dinero, arquitectura, seguridad, propuesta importante, estrategia privada o decision de Sergio.

No usar `gpt-5.5` para preguntas simples, notas, tareas, resumen basico, clasificacion de ideas o respuestas de vendedor.
