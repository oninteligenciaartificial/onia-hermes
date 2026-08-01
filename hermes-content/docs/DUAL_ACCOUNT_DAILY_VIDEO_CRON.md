# Dual Account Daily Video Cron

## Objetivo
Publicar videos diarios durante el mes en ambas cuentas:

- Cuenta personal de Sergio: 1 video diario.
- Cuenta Onia: 1 video diario.
- Cola de clientes/terceros: preparar y entregar/publicar solo con aprobacion.

Hermes debe preparar, recordar, pedir aprobacion y publicar solo cuando Sergio apruebe la pieza exacta.

## Regla de seguridad
No hay auto-publicacion ciega.

El cron puede:

- seleccionar el video del dia;
- enviar recordatorio a Telegram;
- listar assets pendientes;
- pedir aprobacion;
- publicar despues de aprobacion explicita;
- reportar `published_id`.

El cron no debe:

- publicar sin `Publicar video <job_id>`;
- publicar videos con cara o voz IA de Sergio sin revision;
- publicar placeholders;
- inventar resultados o testimonios;
- imprimir tokens.

## Horarios recomendados
Zona: America/Caracas.

```text
08:30 - Preparar video Sergio del dia y enviar checklist.
09:30 - Preparar video ONIA del dia y enviar checklist.
11:30 - Recordatorio de aprobacion para Sergio.
12:30 - Publicar Sergio si ya esta aprobado.
17:00 - Recordatorio de aprobacion para ONIA.
18:30 - Publicar ONIA si ya esta aprobado.
21:00 - Resumen diario: publicados, pendientes y bloqueos.
```

Equivalente UTC:

```cron
0 12 * * * hermes video daily prepare --account sergio
0 13 * * * hermes video daily prepare --account onia
0 15 * * * hermes video daily approval-reminder --account sergio
0 16 * * * hermes video daily publish-approved --account sergio
30 20 * * * hermes video daily approval-reminder --account onia
0 22 * * * hermes video daily publish-approved --account onia
30 00 * * * hermes video daily summary
```

If `hermes video daily ...` is not installed yet, keep the same schedule but route through the current deterministic commands:

```bash
video-lab next --limit 10
video-lab status --limit 10
video-lab telegram --message "Estado Video Lab"
video-lab telegram --message "Publicar video <job_id>"
```

## Flujo diario

### 1. Preparacion
Hermes elige las dos piezas del dia desde `JUNE_2026_VIDEO_PRODUCTION_PLAN.md`:

- Sergio: contenido de confianza, founder-led, BTS, opinion o leccion.
- Onia: demo, oferta, DentalGest, Gestios, chatbot, CRM o automatizacion.

Si hay clientes activos, Hermes tambien revisa `CLIENT_CONTENT_PRODUCTION_SYSTEM.md` y prepara:

- brief del cliente;
- asset faltante;
- siguiente aprobacion;
- fecha de entrega;
- cuenta destino.

Para clientes nuevos o prospeccion, Hermes debe usar `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md` como base de oferta, nicho, prompt y mensaje comercial.

Salida a Telegram:

```text
Videos de hoy

Sergio:
- Titulo:
- Hook:
- Asset faltante:
- Siguiente accion:

ONIA:
- Titulo:
- Hook:
- Asset faltante:
- Siguiente accion:
```

### 2. Produccion
Para cada pieza:

- ElevenLabs genera audio solo si no es Sergio real.
- Higgsfield genera video si la pieza requiere concepto, UGC o B-roll IA.
- Partes reales de Sergio se usan en los videos personales.
- Todo output final debe quedar como URL publica MP4 antes de publicar.

### 3. Aprobacion
Aprobaciones validas:

```text
Aprobar video <job_id>
Video generado <job_id>: <url_video>
Publicar video <job_id>
```

`Publicar video <job_id>` es la unica aprobacion valida para publicar.

### 4. Publicacion
Ruta actual:

```bash
video-lab telegram --message "Publicar video <job_id>"
```

Internamente usa:

```bash
ig-publish reel_publish --video-url "<public_mp4_url>" --caption "<caption>"
```

## Requisito para publicar en dos cuentas
El publisher actual lee una sola cuenta desde:

```text
META_LONG_LIVED_TOKEN
IG_BUSINESS_ACCOUNT_ID
```

Para publicar en Sergio y Onia hacen falta dos perfiles seguros:

```text
SERGIO_META_LONG_LIVED_TOKEN
SERGIO_IG_BUSINESS_ACCOUNT_ID
ONIA_META_LONG_LIVED_TOKEN
ONIA_IG_BUSINESS_ACCOUNT_ID
```

O dos wrappers:

```bash
ig-publish-sergio reel_publish --video-url "<url>" --caption "<caption>"
ig-publish-onia reel_publish --video-url "<url>" --caption "<caption>"
```

No guardar tokens en docs. Guardarlos solo en `/root/.hermes/.env`.

## Cron MVP recomendado
Fase 1 segura:

- Cron prepara y recuerda.
- Sergio aprueba.
- Hermes publica solo lo aprobado.

Fase 2:

- Crear wrappers por cuenta.
- Agregar `account` a los jobs de Video Lab.
- `publish-approved` publica automaticamente solo jobs con:
  - `state=approved_for_publish`;
  - `video_url` publico;
  - `account` definido;
  - caption final.

Fase 3:

- n8n orquesta calendario visual, aprobaciones y logs.
- Hermes sigue como cerebro y guardrail.

## Estado actual
Se puede operar ya con Hermes cron y Video Lab, pero la publicacion diaria para dos cuentas requiere:

1. Confirmar acceso a ambas cuentas Instagram Business/Creator conectadas a Meta.
2. Crear perfiles de env separados o wrappers por cuenta.
3. Validar:

```bash
ig-publish healthcheck
ig-publish-sergio healthcheck
ig-publish-onia healthcheck
video-lab status --limit 5
```

## Checklist por dia
- Video Sergio listo.
- Video Onia listo.
- Videos/briefs de clientes revisados si hay cola activa.
- URLs MP4 publicas.
- Captions finales.
- Cuenta destino confirmada.
- Aprobacion de publicacion recibida.
- `published_id` registrado.
