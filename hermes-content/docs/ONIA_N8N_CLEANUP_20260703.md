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

## Bloqueado (no se pudo ejecutar via API)

### 1. Archivar los 13 workflows UDIA/practica — PENDIENTE

Los siguientes son claramente de practica/prueba y estan inactivos, pero **no
tienen "MCP access" habilitado**, asi que `archive_workflow` responde
`Workflow is not available in MCP`. La API MCP no puede archivarlos.

IDs: `HKTDjx21ohYeO19Y` (udia), `GWLdEFdUsHcuusng` (Action in app Udia),
`8Jb45VT5MgmrahPI` (Nodos Core y HTTP REQUEST), `mrwDIycuY7SgkFG0`
(prueba de datos), `A36FdAXRPKW6ULoM` (formularios con mensajes finales),
`mwAL9Vx15ouc50OW` (practica flujo de datos), `t17aey6LEAhAITWp`
(Ejercicio flujo de datos), `8tQz364A2iDlUexR` (UDIA Workflow de Prueba),
`jVrufLM0aWnYLj8c` ([UDIA] Mi primer workflow), `9d6jOYklaeYTdllJ`
([UDIA] Primer flujo sencillo), `Ex4Uf3PHb19tt3fz` (UDIA Bot telegram errores),
`uRZxWpe41EambE0W` (udia if y switch), `kYt1MnjOe1rnL5Rk` (Udia credenciales).

**Como completarlo (30 seg, cualquiera de las dos):**
- En el editor n8n: filtrar/seleccionar estos 13 y usar "Archive" (o Delete).
  Estan inactivos, no rompen nada.
- O habilitar "MCP access" en cada card y avisar: se archivan por API al toque.

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

## Sin clasificar (revisar antes de archivar/pausar)

Inactivos, no son practica pero tampoco operan hoy. Candidatos a archivar
tras confirmar:

- `DnYZpcKpTYSeaq9G` Hermes TEMP - DentalGest PostgREST Status Check (TEMP)
- `T3qtKnj94fBXQsxY` Hermes Telegram Chat ID Capture (utilidad de una vez)
- `aOb3lNzewdGckb9H` ONIA - Demo Cliente New Sakura (demo)
- `PEo2XKM1l1bgEwIr` ONIA - Agenda: Crear Evento (posible duplicado de Agenda Create API)
- `qdAEP9seSxp5whXh` ONIA - Agenda: Briefing Diario (duplicado del briefing ONIA Center)
- `Si1cPoh65Ld4z7Ej` Atlas AI Media YouTube Draft v1 (borrador)
- `VeCHKr6wkK5Wet25` Scheduled Operations Pack (SSH roto)
- `zediOCdtlP1zpImK` Mara Daily Content (SSH roto)
- `GnmIyrHWb1mO5eNy` Demo Asistente Diario
- `FGqyNTrQfMIFiVG2` ONIA Pipeline Llamada -> Propuesta (feature en curso)

## Activos que el audit 2026-06-30 sugirio pasar a manual (no tocados)

Siguen ON; pausar es decision de Sergio (reversible con `unpublish_workflow`):

- `lryabRhGQW4WIuJG` Hermes Radar Diario Creativo (costo OpenAI diario)
- `rGvQb4CRBdJPwrp1` ONIA - Prospeccion Diaria (regla: debe registrar lead en ONIA Center o no correr)
