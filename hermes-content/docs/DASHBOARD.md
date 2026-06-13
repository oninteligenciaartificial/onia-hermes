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

Servicio en VPS:

```bash
systemctl status hermes-control-tower --no-pager
journalctl -u hermes-control-tower -n 80 --no-pager
curl -fsS http://127.0.0.1:3010/
```

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
