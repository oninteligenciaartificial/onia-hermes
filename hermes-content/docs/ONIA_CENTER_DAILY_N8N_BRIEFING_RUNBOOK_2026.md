# ONIA Center Daily n8n Briefing Runbook 2026

Fecha: 2026-06-28.

## Objetivo

Crear una automatizacion diaria para que ONIA Center genere tareas concretas por rol, respete el calendario de Sergio y deje evidencia operacional.

El workflow no aprueba pagos, descuentos, comisiones, gastos, uso premium, publicaciones ni contacto sensible. Solo agenda, registra y avisa.

## Estado implementado

Archivos canonicos:

- Endpoint interno: `web-factory/apps/site/src/app/api/onia-center/briefings/daily/route.ts`
- Workflow n8n importable: `hermes-content/deploy/n8n/workflows/onia-center-daily-briefing.json`
- Routing de modelos: `hermes-content/docs/ONIA_CENTER_AI_MODEL_ROUTING_2026.md`

Endpoint:

```txt
POST /api/onia-center/briefings/daily
```

Funciones:

- lee datos reales de ONIA Center;
- genera plan diario para Sergio, Arthur y vendedoras;
- usa el calendario estricto de Sergio como guardrail;
- crea tareas y notas si `commit=true`;
- evita duplicar tareas del mismo dia si n8n reintenta;
- devuelve tareas creadas, notas creadas y duplicados omitidos;
- bloquea ejecucion si falta `ONIA_CENTER_INTERNAL_API_KEY`;
- bloquea escritura real si falta Supabase server-side.

## Modelo definido

Default diario:

```env
ONIA_DAILY_BRIEFING_MODEL=gpt-5.4-mini
ONIA_FAST_MODEL=gpt-5.4-mini
```

Uso:

- briefing diario;
- tareas del dia;
- resumen de CRM;
- recordatorios por rol;
- clasificacion basica de prioridades;
- respuestas del bot interno para vendedoras y Arthur.

Modelo fuerte, solo por aprobacion o tareas de alto impacto:

```env
ONIA_DEEP_REASONING_MODEL=gpt-5.5
```

Uso:

- plan CEO mensual;
- decisiones de caja;
- propuestas importantes;
- arquitectura tecnica;
- seguridad/RLS;
- auditorias profundas.

Regla: no usar modelo fuerte para notas, tareas, resumen simple, preguntas de vendedor o recordatorios.

## Variables requeridas

En ONIA Center / Vercel / entorno local:

```env
ONIA_CENTER_BASE_URL=http://localhost:3012
ONIA_CENTER_INTERNAL_API_KEY=
ONIA_DAILY_BRIEFING_MODEL=gpt-5.4-mini
ONIA_DAILY_BRIEFING_MAX_OUTPUT_TOKENS=2200
OPENAI_ONIA_CENTER_API_KEY=
ONIA_CENTER_SUPABASE_URL=
ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY=
ONIA_CENTER_SUPABASE_SCHEMA=onia_center
```

En n8n:

```env
ONIA_CENTER_BASE_URL=
ONIA_CENTER_INTERNAL_API_KEY=
TELEGRAM_BOT_TOKEN=
TELEGRAM_SERGIO_CHAT_ID=
```

Calendario real, fase 2:

```env
GOOGLE_CALENDAR_CLIENT_ID=
GOOGLE_CALENDAR_CLIENT_SECRET=
GOOGLE_CALENDAR_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=
```

No guardar valores reales en Markdown, Git ni screenshots.

## Workflow n8n

Archivo:

```txt
hermes-content/deploy/n8n/workflows/onia-center-daily-briefing.json
```

Estado MCP 2026-06-29:

- Workflow importado como `ONIADailyBrief001`.
- `availableInMCP=true`.
- `active=false` hasta completar prueba con variables reales.
- Prueba simulada MCP exitosa con pin data: ejecucion `18708`.
- Regla tecnica: los Code nodes de n8n no deben usar `process.env`; las variables se leen desde expresiones de n8n como `$env.NOMBRE_VARIABLE` en los parametros del nodo.

Schedule:

```txt
Lunes a sabado 06:45 America/La_Paz
```

Flujo:

1. Schedule Trigger.
2. HTTP POST a ONIA Center.
3. ONIA Center genera tareas por rol.
4. ONIA Center crea tareas y notas si `commit=true`.
5. n8n prepara resumen para Telegram.
6. Si Telegram esta configurado, envia resumen a Sergio.
7. Prepara bloques de calendario protegidos, sin escribir en Google Calendar todavia.

## Roles

Sergio:

- plan CEO del dia;
- ventas y caja;
- prioridades reales;
- decisiones privadas;
- cierre operativo;
- calendario protegido.

Arthur:

- tareas propias;
- leads asignados;
- briefs;
- mejoras internas;
- evidencia;
- bloqueos que Sergio debe revisar.

Vendedoras:

- leads abiertos;
- llamadas;
- proxima accion;
- CRM;
- notas de objeciones;
- evidencia para comisiones propias.

Freelancer:

- entregables asignados;
- evidencia;
- estado de revision.

## Calendario

ONIA Center ya devuelve bloques protegidos desde el calendario estricto de Sergio.

Ahora:

- n8n no escribe Google Calendar;
- Telegram informa tareas y ventanas;
- ONIA Center registra tareas.

Siguiente fase:

- conectar Google OAuth;
- hacer dry-run con `commit=false`;
- crear eventos solo para bloques aprobados;
- no abrir gym, novia, descanso, deep work ni bloques privados.

## Prueba local

1. Levantar ONIA Center:

```powershell
npm run onia-center:local
```

2. Probar estado sin exponer secretos:

```powershell
$body = @{
  audiences = @("sergio", "arthur", "seller")
  commit = $false
  source = "local-test"
} | ConvertTo-Json

Invoke-WebRequest `
  -Uri "http://localhost:3012/api/onia-center/briefings/daily" `
  -Method POST `
  -Headers @{ Authorization = "Bearer $env:ONIA_CENTER_INTERNAL_API_KEY" } `
  -ContentType "application/json" `
  -Body $body
```

3. Si el dry-run responde bien, probar escritura:

```powershell
$body = @{
  audiences = @("sergio", "arthur", "seller")
  commit = $true
  source = "local-test"
} | ConvertTo-Json
```

No activar `commit=true` en n8n hasta confirmar que Supabase y roles estan correctos.

## Migracion futura a modelo local

No hay que redisenar n8n.

Ruta recomendada:

1. Montar gateway compatible con OpenAI, por ejemplo LiteLLM u Ollama con endpoint `/v1`.
2. Cambiar:

```env
OPENAI_BASE_URL=http://127.0.0.1:4000/v1
ONIA_DAILY_BRIEFING_MODEL=<modelo-local>
```

3. Mantener `ONIA_DEEP_REASONING_MODEL` en OpenAI para decisiones de alto impacto hasta que el modelo local sea confiable.

## Criterios de operacion

- Si no queda en ONIA Center, no cuenta.
- Si no hay evidencia, no cuenta para comision.
- Si n8n falla, debe avisar y no duplicar tareas.
- Si falta Supabase, el endpoint no escribe.
- Si falta Telegram, el workflow no debe bloquear la creacion de tareas.
- Si falta Google OAuth, el calendario queda preparado pero no escrito.

## Pendiente para activar en produccion

- Cargar `ONIA_CENTER_INTERNAL_API_KEY` en n8n y ONIA Center.
- Confirmar URL real de ONIA Center para n8n.
- Confirmar Telegram bot y chat ID de Sergio.
- Importar workflow en la instancia canonica `n8n_n8n`.
- Hacer dry-run manual.
- Activar workflow solo despues de revisar una ejecucion completa.
