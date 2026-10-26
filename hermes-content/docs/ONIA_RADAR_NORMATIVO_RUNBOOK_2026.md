# Onia Radar Normativo Bolivia — Runbook 2026

Fecha: 2026-07-04.
Estado: workflow listo para importar (JSON verificado + extraccion probada contra HTML real).
Owner: Onia / Hermes.

## Que hace

Radar diario (L-V 08:00 America/La_Paz) que detecta normas fiscales nuevas del
SIN (RNDs; los decretos supremos aparecen citados en el resumen de cada RND) y
avisa por Telegram SOLO cuando hay novedades. Sin novedades = silencio.

```text
Cron 08:00 L-V
  -> GET https://impuestos.com.bo/normativa-<anio>/   (anio dinamico via $now)
  -> GET https://siatinfo.impuestos.gob.bo/            (novedades facturacion, oficial)
  -> Code: extrae titulo+link+resumen, filtra anio en curso,
           dedupe con staticData global (lastSeen, cap 200)
  -> IF count > 0 -> Telegram a Sergio (chat 6830070978)
```

## Archivo

`hermes-content/deploy/n8n/workflows/onia-radar-normativo.json`

## Fuentes y scrapeabilidad (verificado por curl, 2026-07-04)

| Fuente | Motor | Scrapeable | Item |
|---|---|---|---|
| `impuestos.com.bo/normativa-<anio>/` | WordPress (HTML estatico) | SI | `<h2 class="wp-block-heading">` con `<a href="...pdf">RND-1026NNNNNNNN</a>` + `<p class="wp-block-paragraph">` de resumen |
| `siatinfo.impuestos.gob.bo` | Joomla (HTML estatico) | SI | anchors `<a href="...pdf">RND-NNNNNNNNNNNN</a>` en el home |

Ninguna de las dos requiere JS: ambas devuelven el contenido en el HTML plano
(200 OK, ~298KB y ~22KB). Extraccion validada contra el HTML real: 12 RNDs 2026
en normativa, 6 anchors RND en siatinfo (2021/2025, correctamente filtrados).

Notas de diseno:

- **Anio dinamico en la URL.** El encargo original apuntaba a `normativa-2025/`,
  pero esa pagina ya no recibe normas nuevas (estamos en 2026 y existe
  `normativa-2026/` con identica estructura). El nodo usa
  `=https://impuestos.com.bo/normativa-{{ $now.year }}/` — sin `$env`, solo
  `$now` con el timezone del workflow. En enero, si la pagina del anio nuevo
  aun no existe, el nodo tiene `onError: continueRegularOutput` y el radar
  sigue con siatinfo.
- El codigo RND embebe el anio: `RND-10<YY>NNNNNNNN` (ej. `RND-1026...` = 2026).
  El filtro de anio usa ese patron + mencion del anio en titulo/link.
- La memoria `lastSeen` vive en `$getWorkflowStaticData('global')` y **solo
  persiste en ejecuciones de produccion** (workflow activo). En "Test workflow"
  manual no se guarda — no sirve para probar el dedupe.
- Primera ejecucion activa: alerta con TODAS las RNDs del anio en curso (esperado,
  es la carga inicial de memoria; lista capada a 15 lineas + "(+N mas)").
- `ONIA_FISCAL_CONTABILIDAD_STRATEGY_2026.md` (fuentes normativas, seccion 5)
  aun no existe en el repo; las fuentes se verificaron directamente por curl.

## Importar y activar (n8n VPS, ~5 min)

1. Importar `onia-radar-normativo.json` (Workflows > Import from File, o via
   MCP `create_workflow_from_code` — lo hace el orquestador).
2. El nodo Telegram ya referencia la credencial existente `Telegram account`
   (id `r8y2CN5RyOEIDce3`) y el chat de Sergio (`6830070978`) — los mismos del
   tipo de cambio diario. Verificar que quedo asignada tras el import.
3. Activar. No requiere credenciales nuevas ni `$env` (regla plan VPS: URLs
   hardcodeadas, secretos solo via credenciales n8n).
4. Smoke test: "Test workflow" manual debe terminar verde y, si hay RNDs del
   anio no vistas, enviar el mensaje (recordar que en modo test el dedupe no
   persiste; el segundo test vuelve a avisar — es normal).

## Cuando llega una alerta

1. Abrir el PDF de cada RND listada (link en el mensaje).
2. Evaluar impacto: facturacion/SIAT (clientes con pasarela o facturador),
   plazos IVA/IUE/RC-IVA (recordatorios TAX_REMINDERS), registros (RNC), etc.
3. Si aplica a un cliente: crear pendiente con responsable y fecha (hoy manual;
   ver siguiente seccion para la version automatizada).
4. Si la norma cambia plazos fiscales: actualizar `TAX_REMINDERS_BOLIVIA.md`.

## Conexion al Contador Pack (futuro)

Mismo patron que el email intake de DentalGest
(`hermes-content/docs/historial/DENTALGEST_EMAIL_INTAKE_CONNECTOR_2026.md`): en v2, la
rama "hay novedades" agrega un `POST /api/onia-core/intake` por novedad
(canal tipo `norma_fiscal`, dedupe del lado del endpoint), que crea un
WorkItem con responsable en el producto del contador. Asi la norma deja de ser
un mensaje y pasa a ser un pendiente rastreable. Bloqueado hasta que el
Contador Pack tenga endpoint de intake propio (gate `external_gate` del core).

## Mantenimiento

- Si impuestos.com.bo cambia el theme (clase `wp-block-heading` / plugin
  ez-toc) o siatinfo cambia de template, ajustar los regex del nodo
  "Detectar novedades" — el HTML de referencia y la simulacion estan
  documentados en este runbook (re-verificar con `curl -sL <url>`).
- `lastSeen` capado a 200 titulos (FIFO); ~60 RNDs/anio: sobra.
- Para resetear la memoria: desactivar/activar borra staticData? NO — se
  limpia editando el workflow y ejecutando una vez un Code temporal con
  `$getWorkflowStaticData('global').lastSeen = []`, o desde la DB. Documentado
  para no sorprenderse.
