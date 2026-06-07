# Hermes Telegram Command Center

## Objetivo
Telegram debe ser la bandeja principal para operar Hermes y ONIA:
contenido, Higgsfield, proyectos, CRM, seguimiento, estado semanal,
automatizaciones y aprobaciones.

Hermes es el cerebro. n8n agenda y registra. Video Lab prepara videos y
prompts. Higgsfield renderiza. Notion guarda contexto operativo. Instagram se
publica solo con aprobacion explicita.

## Arquitectura

```text
Telegram
  -> n8n Command Center
  -> hermes-command telegram --message "<mensaje>"
  -> Hermes docs/referencias/scripts
  -> respuesta compacta a Telegram
  -> registro en Notion cuando aplique
```

Para video:

```text
Telegram
  -> hermes-command
  -> video-lab telegram
  -> brief + prompt Higgsfield + caption
  -> aprobacion Sergio
  -> Higgsfield
  -> URL publica MP4
  -> revision
  -> Publicar video <job_id>
```

## Regla principal
Hermes puede investigar, preparar, resumir, crear briefs, crear mensajes y
ordenar tareas. No puede contactar, publicar, entregar cliente-facing, usar cara
o voz de Sergio, ni activar envios automaticos sin aprobacion exacta.

## Comando operativo

En VPS o n8n:

```bash
hermes-command telegram --message "<mensaje Telegram>"
```

El JSON devuelve `telegram_reply`. Ese campo es lo que n8n debe responder a
Sergio.

## Comandos base

### Estado y plan

```text
Estado Semana
Plan Semana
Plan Hoy
Automatizaciones ONIA
Mapa proyectos ONIA
Fabrica contenido ONIA
```

### Proyectos ONIA

```text
Orquesta ONIA: <empresa o rubro> | <objetivo>
Prepara venta DentalGest: <clinica>
Prepara venta Gestios: <empresa>
Prepara venta Web ONIA: <negocio>
Prepara marketing Higgsfield: <negocio> | <oferta>
Prepara consultoria ONIA: <negocio> | <dolor o proceso>
```

### Video Lab / Higgsfield

```text
Genera video Sergio: <idea>
Crea avatar Sergio: <objetivo> | <variante>
Genera Reel ONIA: <tema> | <objetivo>
Crea video cliente: <negocio> | <oferta> | <estilo>
Estado Video Lab
Siguiente Video Lab
Aprobar video <job_id>
Rehacer video <job_id>: <cambio>
Video generado <job_id>: <url_video>
Publicar video <job_id>
Archivar video <job_id>
```

## Contexto que Hermes debe recordar

| Proyecto | Que vende | Para quien | Primer CTA seguro |
|---|---|---|---|
| DentalGest | SaaS dental | clinicas dentales | demo corta |
| Gesti-OS | gestion operativa | pymes con Excel, tareas o reportes | tablero simple |
| Paginas web ONIA | landing/web + formularios | negocios sin captacion clara | auditoria rapida |
| Marketing Higgsfield | videos, UGC, Reels | negocios sin contenido constante | 3 ideas de video |
| Consultoria ONIA | diagnostico, roadmap, implementacion | negocios desordenados | auditoria corta |
| Sergio personal | confianza y fundador | empresarios, pymes, audiencia ONIA | escribime sistema |
| ONIA marca | autoridad y conversion | prospectos B2B | pedir demo/auditoria |

La fuente canonica de proyectos es:

```text
hermes-content/references/onia-projects-registry.json
```

## Fabrica de contenido

### Lanes

- Sergio: fundador real, proceso, decisiones, pantalla, aprendizaje.
- ONIA: educacion, demos, sistemas, automatizacion, casos de uso.
- Clientes: video seguro, oferta aprobada, claims simples, entrega revisada.

### Estado de una pieza

```text
idea
-> brief
-> waiting_approval
-> approved_for_generation
-> generated
-> approved_for_publish
-> published
```

### Daily loop recomendado

| Hora Bolivia | Accion |
|---|---|
| 07:30 | radar creativo y oportunidades |
| 08:00 | elegir 1 pieza Sergio y 1 pieza ONIA |
| 10:00 | revisar aprobaciones Video Lab |
| 15:00 | crear captions y versiones por canal |
| 17:00 | revisar MP4 generados |
| 21:00 | resumen: publicado, pendiente, bloqueado |

## n8n

n8n debe tener un workflow general:

```text
Telegram Trigger
-> SSH: hermes-command telegram --message "<mensaje>"
-> Parse JSON
-> Send Message: telegram_reply
-> Notion log si aplica
```

Workflows activos conocidos:

- `ONIA - Telegram Command Center`: activo, ID `vuicWsvh0hwqKhYs`,
  version activa `9c2d3776-ee6b-44d9-a36f-97ee9c40817f`. Antes era
  `ONIA - Video Lab Telegram Router`; ahora ejecuta `hermes-command` y tambien
  enruta comandos Video Lab.
- `Hermes Telegram Chat ID Capture`: activo para capturar chat ID.
- `ONIA - Scheduled Operations Pack`: activo en n8n, ID `VeCHKr6wkK5Wet25`,
  version activa `63d699bb-6814-44dc-a2c2-d3f8d6c9ed4d`.
  Agenda recordatorios internos por Telegram para radar, cola diaria, CRM,
  aprobaciones Video Lab, Higgsfield, copy por plataforma y registro Hermes.
- `Hermes Radar Diario Creativo y Clientes`: queda como flujo historico
  pendiente; el radar local seguro ya lo cubre `ONIA - Scheduled Operations Pack`.

Comandos programados:

| Hora | Comando Hermes | Funcion |
|---|---|---|
| 07:30 | `Radar creativo ONIA` | ideas seguras para Sergio, ONIA y clientes |
| 08:00 | `Cola contenido diaria` | decidir piezas del dia |
| 08:30 | `Seguimientos ONIA hoy` | preparar seguimiento CRM sin enviar |
| 10:00 | `Recordatorios Video Lab` | revisar briefs/MP4 pendientes |
| 15:00 | `Platform Copy Queue` | adaptar descripciones por canal |
| 17:00 | `Watcher Higgsfield` | revisar renders y jobs aprobados |
| 21:00 | `Registro Hermes` | resumen de outbox/log local |

Registro:

- VPS log: `/root/.hermes/logs/command-center-events.jsonl`.
- VPS outbox Notion: `/root/.hermes/notion-outbox/command-center-events.jsonl`.
- n8n todavia no tiene credencial Notion. Hasta tenerla, Hermes registra en
  outbox local y no finge sincronizacion automatica.

## Higgsfield

Hermes no debe decirle a Higgsfield solo "crea un video". Debe enviar paquete:

- cuenta: Sergio, ONIA o cliente;
- personalidad;
- objetivo;
- audiencia;
- oferta;
- hook;
- guion;
- escenas;
- assets aprobados;
- estilo visual;
- prompt Higgsfield;
- negative prompt;
- caption por plataforma;
- aprobacion requerida.

## Canales

- Instagram: conectado para publicar Reels/carruseles con aprobacion.
- TikTok: preparar descripcion; publicar queda pendiente de API/OAuth/review.
- YouTube Shorts: preparar titulo/descripcion; publicar pendiente de OAuth.
- LinkedIn: preparar copy; publicacion API pendiente.
- WhatsApp: automatico bloqueado hasta verificacion Meta.
- Telegram: control operativo interno.

## Guardrails

- No secretos completos en Markdown ni Telegram.
- No acciones client-facing con `ok`, `dale` o frases ambiguas.
- Contactar prospectos requiere `Apruebo contactar: <empresa>`.
- Publicar requiere `Publicar video <job_id>`.
- Cara o voz IA de Sergio requiere aprobacion por pieza.
- Clientes requieren aprobacion antes de entregar o publicar.

## Siguiente implementacion n8n

1. Probar en Telegram: `Mapa proyectos ONIA`, `Automatizaciones ONIA`,
   `Siguiente Video Lab`.
2. Crear credencial Notion en n8n para sincronizar el outbox local.
3. Conectar polling real de Higgsfield cuando exista API/MCP estable.
4. Mantener publicaciones y contactos solo con aprobacion exacta.
