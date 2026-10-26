# Skill: Centro Comando Telegram

## Cuando usar
Cuando Sergio pida operar Hermes/ONIA desde Telegram: enrutar comandos,
coordinar n8n, consultar estado, preparar ventas, manejar Video Lab interno o
usar Telegram como bandeja principal de operacion.

## Leer antes de actuar
- `HERMES_TELEGRAM_COMMAND_CENTER.md`
- `HERMES_EXECUTION_PROTOCOL.md`
- `PROJECTS_ORCHESTRATION.md`
- `HERMES_VIDEO_LAB.md`
- `N8N_AUTOMATION_PLAN.md`
- `hermes-content/references/telegram-command-center.json`
- `hermes-content/references/onia-projects-registry.json`

## Ruta canonica
```bash
hermes-command telegram --message "<mensaje>"
```
En n8n, responder al usuario siempre via `telegram_reply`.

## Enrutamiento (primer paso obligatorio)
Clasificar cada mensaje entrante en UNA categoria antes de ejecutar:

| Categoria   | Ejemplos de comando                          | Skill/flujo destino          |
|-------------|----------------------------------------------|------------------------------|
| Personal    | Plan Sergio hoy, Modo gym, Estoy saturado    | `agenda-calendario`          |
| Agenda      | Puedo reunirme..., agendar ...               | `agenda-calendario`          |
| Contenido   | Genera carrusel/Reel/video, Fabrica contenido| `carruseles-onia`, Video Lab |
| Ventas      | Prepara venta..., Prepara consultoria...     | `propuestas-comerciales-onia`|
| Prospeccion | Busca prospectos, Guarda prospecto           | `prospeccion-onia`           |
| Estado      | Estado Hermesa, Estado Semana, Mapa proyectos| lectura, sin efectos         |
| n8n         | Automatizaciones ONIA, healthchecks          | `n8n-automatizaciones-onia`  |
| Publicacion | Publicar video <job_id>, Apruebo publicar    | requiere aprobacion (abajo)  |

Si el mensaje es ambiguo entre dos categorias, responder con la interpretacion
elegida y el comando exacto alternativo, no adivinar en silencio.

## Frentes
- Planner/Arquitectura: decidir categoria y plan minimo.
- Automatizacion/n8n: enrutar, esperar, registrar y notificar.
- Contenido/Media: Video Lab, Higgsfield, captions y prompts.
- Seguridad: aprobaciones y secretos.
- QA/Operaciones: probar comandos, healthchecks y logs.

## Reglas de seguridad (no negociables)
- Telegram es el control, NO una autorizacion implicita.
- `ok`, `dale` o `hazlo` no publican ni contactan nada.
- Contactar prospecto requiere literal: `Apruebo contactar: <empresa>`.
- Publicar video requiere literal: `Publicar video <job_id>`.
- Cara o voz IA de Sergio requiere aprobacion por pieza, sin excepciones.
- WhatsApp automatico bloqueado hasta verificacion Meta.
- No mezclar datos de DentalGest con Hermes salvo lectura autorizada para
  diagnostico o estado tecnico.
- Secretos nunca viajan por Telegram; si un comando los necesita, apuntar al
  archivo/vault correspondiente.

## Avisos y reportes
Todo reporte o aviso automatico (radar, prospeccion, monitores, publicaciones)
se envia SIEMPRE a Arthur Y a Sergio por Telegram, mismo bot. Sergio =
chat ID `6830070978`. Si el chat ID de Arthur aun no esta cableado en un
workflow, marcarlo como pendiente en la respuesta en vez de omitir el aviso.

## Comandos cubiertos
```text
Plan Sergio hoy
Puedo reunirme <dia> <hora>?
Modo enfoque
Estoy saturado
Modo gym
Modo novia
Cierre Sergio
Estado Semana
Plan Semana
Plan Hoy
Brief Hoy
Tareas de hoy
Recomiendame hoy
Tendencias hoy
Guiones Hoy
Guiones Hoy: <tema>
Estado Hermesa
Automatizaciones ONIA
Mapa proyectos ONIA
Fabrica contenido ONIA
Orquesta ONIA: <empresa o rubro> | <objetivo>
Prepara venta DentalGest: <clinica>
Prepara venta Gestios: <empresa>
Prepara venta Web ONIA: <negocio>
Prepara consultoria ONIA: <negocio> | <dolor o proceso>
Genera video Sergio: <idea>
Genera Reel ONIA: <tema> | <objetivo>
Crea video cliente: <negocio> | <oferta> | <estilo>
Siguiente Video Lab
Recordatorios Video Lab detalle
Watcher Higgsfield detalle
```

`Estado Hermesa` resume: memoria local, outbox Notion, workflows conocidos,
pendientes Video Lab, prioridad operativa y siguiente comando exacto.

## Formato de respuesta obligatorio
Corto, accionable, con el siguiente comando exacto cuando aplique:
```text
Estado:
Decision:
Siguiente comando:
Aprobacion necesaria:
```
- `Aprobacion necesaria:` lleva el texto literal que Sergio debe escribir
  (ej. `Apruebo contactar: Clinica Norte`) o `ninguna`.
- Si un comando fallo, `Estado:` incluye el error exacto y `Siguiente comando:`
  la accion de recuperacion, no un resumen vago.

## Manejo de errores
- Comando desconocido -> responder con los 3 comandos validos mas cercanos.
- Workflow n8n caido o sin respuesta -> reportar cual, con id si se conoce, y
  proponer healthcheck antes de reintentar.
- Nunca reintentar en silencio una accion con efectos externos (publicar,
  contactar, enviar correo).
