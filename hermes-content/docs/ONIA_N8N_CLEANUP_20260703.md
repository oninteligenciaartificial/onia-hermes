# ONIA n8n Cleanup — 2026-07-03

Ejecutado via n8n MCP (`N8N_MCP_URL`/`N8N_MCP_TOKEN`) sobre `n8n-sergio_n8n`.
Estado real observado: 58 workflows en la instancia.

## Hecho y verificado

### Agrupacion por tags (25 workflows, confirmado por query por tag)

| Tag | # | Workflows |
|---|---|---|
| `onia-ops` | 6 | Cal.com Booking, Briefing diario, Telegram Command Center, Monitor de Salud, Agenda Create API, Agenda Recordatorios |
| `onia-intake` | 3 | Brief Produccion, Cuestionario Cliente, Intake Cliente a Telegram |
| `dentalgest` | 14 | WF-00 a WF-13 (recordatorios, cobros, dunning, onboarding, reconciliacion, digest) |
| `gestios` | 1 | WF-GS-05 BCP Auto Payment (los otros 3 GS estan bloqueados, ver abajo) |
| `infra` | 1 | WF-SENTRY-01 Sentry Triage |

Verificacion: `search_workflows` con filtro `tags:[<tag>]` devuelve exactamente
esos workflows.

## Ejecucion 2026-07-03 (segunda pasada, via UI n8n / browser MCP)

### 1. Archivar los 13 workflows UDIA/practica — HECHO (archivados)

Como no tenian "MCP access" habilitado, `archive_workflow` de la API fallaba.
Se archivaron por la UI de n8n (menu de cada workflow -> Archive; reversible).
Los 13: `HKTDjx21ohYeO19Y` (udia), `GWLdEFdUsHcuusng` (Action in app Udia),
`8Jb45VT5MgmrahPI` (Nodos Core y HTTP REQUEST), `mrwDIycuY7SgkFG0`
(prueba de datos), `A36FdAXRPKW6ULoM` (formularios con mensajes finales),
`mwAL9Vx15ouc50OW` (practica flujo de datos), `t17aey6LEAhAITWp`
(Ejercicio flujo de datos), `8tQz364A2iDlUexR` (UDIA Workflow de Prueba),
`jVrufLM0aWnYLj8c` ([UDIA] Mi primer workflow), `9d6jOYklaeYTdllJ`
([UDIA] Primer flujo sencillo), `Ex4Uf3PHb19tt3fz` (UDIA Bot telegram errores),
`uRZxWpe41EambE0W` (udia if y switch), `kYt1MnjOe1rnL5Rk` (Udia credenciales).
Viven en los proyectos "udia 1er/2do curso" (cursos de practica).

### 1b. Otros muertos claros — HECHO (archivados)

- `qdAEP9seSxp5whXh` ONIA - Agenda: Briefing Diario (duplicado del briefing ONIA Center).
- `DnYZpcKpTYSeaq9G` Hermes TEMP - DentalGest PostgREST Status Check (TEMP one-off).
- `T3qtKnj94fBXQsxY` Hermes Telegram Chat ID Capture (utilidad de una vez; chat id ya conocido).

Total archivado esta pasada: 16 workflows (reversibles con Unarchive).

### 1c. Pausados (sesion previa, via MCP `unpublish_workflow`)

- `lryabRhGQW4WIuJG` Hermes Radar Diario Creativo — `success:true`.
- `rGvQb4CRBdJPwrp1` ONIA - Prospeccion Diaria — `success:true`.

## Bloqueado (no se pudo ejecutar via API)

### 2. Tags en 3 GestiOS activos — BLOQUEADO por estructura rota

`update_workflow` valida la estructura completa y estos 3 tienen una conexion
invalida (`connections.sendAdminEmail.main[0][0].node: Required`), por lo que
rechaza incluso agregar un tag:

- `6oowIHo8G9baBOYc` GestiOS Weekly Admin Digest [WF-GS-04]
- `qOVpQwPZplQKYkMc` GestiOS Birthday WA [WF-GS-03]
- `xx4wzzzqZBGfu836` GestiOS Plan Expiry WA [WF-GS-02]

Accion: reparar el nodo `sendAdminEmail` (conexion de salida faltante) en el
editor; despues se pueden taggear como `gestios`. Son de GestiOS producto:
no tocar su logica sin revisar el repo de GestiOS.

## Sin clasificar — pendientes de decision de Sergio (NO tocados)

Inactivos, no son practica. Juicio del dueno antes de archivar (todos reversibles):

- `PEo2XKM1l1bgEwIr` ONIA - Agenda: Crear Evento — posible duplicado de "Agenda
  Create API" (ON, tag onia-ops). RIESGO: verificar cual usa el plugin `agendar`
  antes de archivar; si es este, romperia el agendado.
- `aOb3lNzewdGckb9H` ONIA - Demo Cliente New Sakura — demo con nombre de cliente;
  podria ser material de venta. Confirmar.
- `GnmIyrHWb1mO5eNy` ONIA - Demo Asistente Diario — demo clima/tip, el audit lo
  marco como ruido. Recomendacion: archivar.
- `Si1cPoh65Ld4z7Ej` Atlas AI Media YouTube Draft v1 — borrador de proyecto de
  contenido. Confirmar si el proyecto sigue vivo.
- `VeCHKr6wkK5Wet25` Scheduled Operations Pack — SSH roto; era automacion real.
  Arreglar SSH o archivar.
- `zediOCdtlP1zpImK` Mara Daily Content — SSH roto. Igual que arriba.
- `FGqyNTrQfMIFiVG2` ONIA Pipeline Llamada -> Propuesta — feature en curso. Mantener.

Productos (NO tocar sin revisar su repo): `BUAMdJ1pz16CZ997` WF-11 Patient Sync,
`H1PDrinGPYtBcyhw` WF-GS-ERR-01, `CllIkRkqdcGXS67o` WF-GS-05 Nuevo Tenant,
`dybtwU9dejZXwYKF` WF-GS-01 Trial, `bfNDDU0b4rOfhHmH` WF-08 GestiOS Onboarding.
