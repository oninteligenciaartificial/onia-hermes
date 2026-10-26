# Hermes Dashboard

## Acceso
El dashboard propio de Hermes vive en el VPS en `localhost:9119`.

Desde Windows:
```powershell
ssh -L 9119:localhost:9119 root@187.77.16.63
```

Luego abrir:
```text
http://localhost:9119
```

## Control Tower visual
El nuevo dashboard visual de Hermes/ONIA se despliega como servicio separado en
`localhost:3010` para no pisar el dashboard canonico de Hermes en `9119`.

Deploy desde Windows, con `VPS_KEY_PATH` o `VPS_PASSWORD` configurado:

```powershell
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
npm run deploy:control-tower
```

Abrirlo por tunel:

```powershell
ssh -L 3010:localhost:3010 root@187.77.16.63
```

Luego abrir:

```text
http://localhost:3010
```

Ruta operativa principal para ventas:

```text
http://localhost:3010/vendedores
```

## Onia Panel de Vendedores

El Sales Desk vive dentro del Control Tower en `/vendedores`.

Uso:

- registrar leads y seguimiento diario;
- evaluar si un cliente necesita landing, web, CRM, sistema o auditoria;
- guardar notas importantes de llamadas;
- capturar ideas, objeciones y oportunidades;
- revisar ingresos y comisiones pendientes.

Fuente oficial actual:

```text
Notion -> CRM Vendedores ONIA
```

Base preparada para migracion:

```text
Supabase -> schema onia_sales
```

Regla operativa:

```text
Sin datos completos, no hay comision aprobada.
```

Servicio en VPS:

```bash
systemctl status hermes-control-tower --no-pager
journalctl -u hermes-control-tower -n 80 --no-pager
curl -fsS http://127.0.0.1:3010/
```

## Mara Pond Video Lab

Dashboard local para preparar lotes de prompts de Mara, revisar QA y exportar
colas para ComfyUI:

```text
hermes-content/docs/historial/MARA_POND_VIDEO_LAB_DASHBOARD_2026.html
```

Config canonica:

```text
hermes-content/references/ai-ecommerce-model/mara-pond-video-lab-config-20260616.json
```

Primer lote seguro:

```powershell
npm run mara:prompt-matrix
```

Regla: no generar miles de videos hasta que un lote de 12 pase identidad,
artefactos y uso UGC con score minimo 4/5.

## Verificaciones utiles
```bash
hermes dashboard --status
hermes dashboard --host 127.0.0.1 --port 9119 --no-open --skip-build
systemctl status hermes-control-tower --no-pager
curl -fsS http://127.0.0.1:3010/
hermes gateway status
journalctl --user -u hermes-gateway -f
ig-publish healthcheck
docker ps
docker ps | grep searxng
docker ps | grep n8n
docker ps | grep chatwoot
```

## Uso operativo
- Telegram es el canal rapido para pedir acciones.
- El dashboard es para revisar estado, logs y actividad.
- n8n se usa para horarios, aprobaciones y flujos largos.
- `hermes gateway` no levanta el dashboard web; solo levanta mensajeria y cron.
- Para abrir la UI web usar `hermes dashboard`.

## Donde responder y analizar

Para videos y contenido:

- Responder en Telegram cuando Hermes pida aprobacion, revision o publicacion.
- Usar el dashboard para mirar lotes, logs, actividad y estados.
- Usar `Siguiente Video Lab` para ver solo lo accionable.

Comandos utiles:

```text
Estado Video Lab
Siguiente Video Lab
Estado Video Lab <job_id>
Aprobar video <job_id>
Rehacer video <job_id>: <cambio>
Video generado <job_id>: <url_video>
Publicar video <job_id>
```

Registros canonicos en VPS:

```text
/root/.hermes/video-lab/jobs
/root/.hermes/video-lab/briefs
/root/.hermes/video-lab/outputs
```

## Actividad que debe revisar Hermes
- Estado de Hermes Gateway.
- Estado de SearXNG para investigacion.
- Estado de n8n para flujos semanales y recordatorios.
- Estado de Chatwoot para atencion al cliente.
- Estado de Instagram Publisher con `ig-publish healthcheck`.
- Ultimas investigaciones de tendencias.
- Planes semanales generados.
- Prospectos investigados o guardados.
- Proximos recordatorios fiscales.

## Flujos recomendados en n8n
- `ONIA - Plan semanal`: investigar tendencias, generar plan, enviar resumen por Telegram y esperar aprobacion.
- `ONIA - Publicacion aprobada`: publicar solo cuando exista aprobacion explicita.
- `ONIA - Recordatorios fiscales`: leer configuracion fiscal y enviar alertas segun anticipacion definida.

## Referencias de workflow
- `/root/.hermes/references/n8n-plan-semanal-onia.md`
- `/root/.hermes/references/impuestos-bolivia.template.json`
