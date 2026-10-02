> **HISTORIA, no fuente (archivado el 2026-10-01).** Este era el «Command Center» de n8n. Medido el
> 29-30 sep: **0 ejecuciones en 72 h** — el que lee el Telegram de Sergio Urcullo es el gateway de
> Hermes, no n8n — y nombra como productos a DentalGest y Gestios, que hoy no lo son (CLAUDE.md §3).
> La fuente vigente sobre manejar Onia desde Telegram es `hermes-content/docs/TELEGRAM_COMMAND_CENTER.md`.

# Hermes Telegram Command Center

## Que es
Es el centro de mando para operar Onia desde Telegram.

Telegram manda el pedido. Hermes decide con contexto. n8n agenda y registra.
Video Lab queda como laboratorio interno. Sergio aprueba antes de publicar o
contactar.

## Comando principal

```bash
hermes-command telegram --message "<mensaje>"
```

n8n debe responder el campo:

```text
telegram_reply
```

Regla: AlfredHQ puede ser el bot personal por ahora. No crear un segundo bot
hasta que haya usuarios externos usando el mismo canal o hasta que la
separacion de privacidad lo exija. El problema historico era el scheduling,
no el bot.

## Comandos utiles

```text
Estado Semana
Plan Semana
Plan Hoy
Estado Hermesa
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
Prepara venta Web ONIA: <negocio>
Prepara consultoria ONIA: <negocio> | <dolor o proceso>
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
- Onia: educacion, demos, sistemas, autoridad y conversion.
- Clientes: videos seguros con oferta aprobada.

## Daily loop recomendado (agenda personal Sergio)

| Hora Bolivia | Accion |
|---|---|
| 06:30 | levantarse, agua, aseo, cero telefono |
| 07:00 | Plan Sergio hoy: caja, ventas, 3 prioridades |
| 08:30 | ventas, CRM y seguimientos |
| 11:30 | ventana de reuniones 1 |
| 15:30 | ventana de reuniones 2 |
| 17:30 | gym protegido en dias de entrenamiento |
| 20:00 | novia/vida personal en bloques protegidos |
| 22:15 | cierre Sergio, sin Higgsfield ni tareas grandes |

## Proyectos

| Proyecto | Que vende | Para quien | Primer CTA seguro |
|---|---|---|---|
| DentalGest | SaaS dental | clinicas dentales | demo corta |
| Gesti-OS | gestion operativa | pymes con Excel, tareas o reportes | tablero simple |
| Paginas web Onia | landing/web + formularios | negocios sin captacion clara | auditoria rapida |
| Consultoria Onia | diagnostico, roadmap, implementacion | negocios desordenados | auditoria corta |
| Sergio personal | confianza y fundador | empresarios, pymes, audiencia Onia | escribime sistema |
| Onia marca | autoridad y conversion | prospectos B2B | pedir demo/auditoria |

Videos IA / Higgsfield no se ofrecen comercialmente por ahora, por eso no
aparecen en la tabla activa.

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

`Estado Hermesa` puede usarse en cualquier momento para ver memoria local,
outbox Notion, workflows conocidos, pendientes Video Lab y la prioridad
operativa inmediata.

Registro local:

- `/root/.hermes/logs/command-center-events.jsonl`
- `/root/.hermes/notion-outbox/command-center-events.jsonl`

Pendiente:

- credencial Notion en n8n para sincronizar outbox;
- API/MCP Higgsfield estable para polling real de renders;
- TikTok/YouTube/LinkedIn publisher cuando existan OAuth y aprobacion.

## Guardrails

- No secretos completos en Markdown ni Telegram.
- No acciones client-facing con `ok`, `dale` o frases ambiguas.
- Contactar prospectos requiere `Apruebo contactar: <empresa>`.
- Publicar requiere `Publicar video <job_id>`.
- Cara o voz IA de Sergio requiere aprobacion por pieza.
- Clientes requieren aprobacion antes de entregar o publicar.

## Estado Hermesa

`Estado Hermesa` es el resumen ejecutivo del sistema. Debe observar y
priorizar, no ejecutar acciones sensibles. Debe incluir:

- memoria local y outbox Notion;
- proyectos Onia conocidos;
- workflows n8n activos conocidos;
- pendientes accionables de Video Lab;
- prioridad operativa inmediata;
- siguiente comando exacto.

## Siguiente implementacion n8n

1. Probar en Telegram: `Mapa proyectos ONIA`, `Automatizaciones ONIA`,
   `Siguiente Video Lab`.
2. Crear credencial Notion en n8n para sincronizar el outbox local.
3. Conectar polling real de Higgsfield cuando exista API/MCP estable.
4. Mantener publicaciones y contactos solo con aprobacion exacta.
