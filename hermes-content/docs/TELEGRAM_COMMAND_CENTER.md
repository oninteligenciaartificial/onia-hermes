# Hermes Telegram Command Center

## Que es
Es el centro de mando para operar ONIA desde Telegram.

Telegram manda el pedido. Hermes decide con contexto. n8n agenda y registra.
Video Lab prepara videos. Higgsfield renderiza. Sergio aprueba antes de publicar
o contactar.

## Comando principal

```bash
hermes-command telegram --message "<mensaje>"
```

n8n debe responder el campo:

```text
telegram_reply
```

## Comandos utiles

```text
Estado Semana
Plan Semana
Plan Hoy
Automatizaciones ONIA
Mapa proyectos ONIA
Fabrica contenido ONIA
Radar creativo ONIA
Cola contenido diaria
Seguimientos ONIA hoy
Recordatorios Video Lab
Platform Copy Queue
Watcher Higgsfield
Registro Hermes
Orquesta ONIA: <empresa o rubro> | <objetivo>
Prepara venta DentalGest: <clinica>
Prepara venta Gestios: <empresa>
Prepara marketing Higgsfield: <negocio> | <oferta>
Genera video Sergio: <idea>
Genera Reel ONIA: <tema> | <objetivo>
Crea video cliente: <negocio> | <oferta> | <estilo>
Siguiente Video Lab
```

## Como se crea contenido

```text
idea
-> brief
-> aprobacion
-> Higgsfield
-> URL MP4
-> revision
-> publicacion aprobada
```

Nada se publica con solo crear un brief.

## Lanes

- Sergio: fundador, confianza, proceso real, aprendizaje.
- ONIA: educacion, demos, sistemas, autoridad y conversion.
- Clientes: videos seguros con oferta aprobada.

## Proyectos

Hermes debe usar:

- DentalGest para clinicas dentales.
- Gesti-OS para pymes con tareas, Excel, reportes o procesos.
- Paginas web ONIA para captacion y presencia.
- Marketing Higgsfield para videos, Reels y UGC.
- Consultoria ONIA para diagnostico, roadmap e implementacion.

Fuente:

```text
/root/.hermes/references/onia-projects-registry.json
```

## Reglas

- No contactar sin aprobacion explicita.
- No publicar sin `Publicar video <job_id>`.
- No usar cara o voz IA de Sergio sin aprobacion por pieza.
- No usar WhatsApp automatico hasta verificacion Meta.
- No inventar resultados, clientes, testimonios ni datos privados.

## n8n

Workflow general recomendado:

```text
Telegram Trigger
-> SSH hermes-command telegram --message "<mensaje>"
-> Parse JSON
-> Send Message telegram_reply
-> Notion log cuando aplique
```

Activo hoy:

- `ONIA - Telegram Command Center` (`vuicWsvh0hwqKhYs`), antes router Video
  Lab; ahora ejecuta `hermes-command` y tambien enruta Video Lab.
- `Hermes Telegram Chat ID Capture`
- `ONIA - Scheduled Operations Pack` (`VeCHKr6wkK5Wet25`), activo con version
  `63d699bb-6814-44dc-a2c2-d3f8d6c9ed4d`. Agenda recordatorios internos por
  Telegram para radar, cola diaria, CRM, Video Lab, Higgsfield, copy por
  plataforma y registro Hermes.

Horarios programados:

| Hora | Comando | Funcion |
|---|---|---|
| 07:30 | `Radar creativo ONIA` | ideas seguras para Sergio/ONIA |
| 08:00 | `Cola contenido diaria` | elegir piezas del dia |
| 08:30 | `Seguimientos ONIA hoy` | preparar CRM sin enviar |
| 10:00 | `Recordatorios Video Lab` | aprobar/revisar jobs |
| 15:00 | `Platform Copy Queue` | adaptar descripciones |
| 17:00 | `Watcher Higgsfield` | revisar renders/jobs |
| 21:00 | `Registro Hermes` | revisar outbox/log |

Registro local:

- `/root/.hermes/logs/command-center-events.jsonl`
- `/root/.hermes/notion-outbox/command-center-events.jsonl`

Pendiente:

- credencial Notion en n8n para sincronizar outbox;
- API/MCP Higgsfield estable para polling real de renders;
- TikTok/YouTube/LinkedIn publisher cuando existan OAuth y aprobacion.
