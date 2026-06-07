# Skill: Centro Comando Telegram

Usar esta skill cuando Sergio pida operar Hermes/ONIA desde Telegram, crear un
router general, coordinar n8n, consultar estado, preparar ventas, manejar Video
Lab/Higgsfield o convertir Telegram en bandeja principal.

## Leer

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

En n8n, usar `telegram_reply` como respuesta al usuario.

## Frentes

- Planner/Arquitectura: decidir si el comando es contenido, proyecto, estado,
  CRM, finanzas, n8n o publicacion.
- Automatizacion/n8n: enrutar, esperar, registrar y notificar.
- Contenido/Media: Video Lab, Higgsfield, captions y prompts.
- Seguridad: aprobaciones y secretos.
- QA/Operaciones: probar comandos, healthchecks y logs.

## Reglas

- Telegram es el control, no una autorizacion implicita.
- `ok`, `dale` o `hazlo` no publican ni contactan.
- Contactar requiere `Apruebo contactar: <empresa>`.
- Publicar requiere `Publicar video <job_id>`.
- Cara o voz IA de Sergio requiere aprobacion por pieza.
- WhatsApp automatico queda bloqueado hasta verificacion Meta.
- No mezclar datos de DentalGest con Hermes salvo lectura autorizada para
  diagnostico o estado tecnico.

## Comandos cubiertos

```text
Estado Semana
Plan Semana
Plan Hoy
Automatizaciones ONIA
Mapa proyectos ONIA
Fabrica contenido ONIA
Orquesta ONIA: <empresa o rubro> | <objetivo>
Prepara venta DentalGest: <clinica>
Prepara venta Gestios: <empresa>
Prepara marketing Higgsfield: <negocio> | <oferta>
Genera video Sergio: <idea>
Genera Reel ONIA: <tema> | <objetivo>
Crea video cliente: <negocio> | <oferta> | <estilo>
Siguiente Video Lab
```

## Respuesta requerida

Responder corto, accionable y con el siguiente comando exacto cuando aplique:

```text
Estado:
Decision:
Siguiente comando:
Aprobacion necesaria:
```
