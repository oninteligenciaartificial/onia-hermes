# ONIA Self-hosted Stack Runbook 2026

Estado: desplegado por perfiles privados. No contiene secretos.
Actualizado: 2026-06-19 America/Caracas.

## Diagnostico

Hermes debe funcionar como sistema operativo de ONIA: decide, registra,
orquesta y audita. Las herramientas self-hosted no deben convertirse en paneles
sueltos; cada una debe entrar como capacidad controlada:

- Supabase: memoria/base privada.
- n8n: ejecucion de procesos.
- LiteLLM: gateway de modelos y costos.
- Open WebUI: cockpit interno.
- Dify: apps IA vendibles, sin multi-tenant/rebranding hasta revisar licencia.
- Uptime Kuma: monitoreo simple.
- Stirling PDF: documentos.
- Crawl4AI: research/crawling privado.
- Mailpit: QA de correos y formularios.
- Listmonk: listas, newsletters y campanas simples, sin SMTP productivo hasta
  tener DNS/reputacion.

## Estado de acceso

Acceso SSH validado con llave local:

```text
C:\Users\PC\.ssh\onia_hermes_vps_ed25519
```

La llave privada no debe copiarse al repo ni pegarse en chat.

## Kit implementado

Ruta local:

```text
hermes-content/deploy/selfhosted
```

Rutas remotas objetivo:

```text
/opt/onia-selfhosted
/root/.hermes/.env
```

Scripts locales:

```powershell
npm run audit:selfhosted
npm run deploy:selfhosted -- --profile monitor
npm run deploy:selfhosted -- --profile utility
npm run deploy:selfhosted -- --profile ai
npm run deploy:selfhosted -- --profile research
npm run deploy:selfhosted -- --profile prepare-dify
```

## Orden recomendado

1. `audit`: inventario read-only del VPS.
2. `monitor`: instala Uptime Kuma privado en `127.0.0.1:3101`.
3. `utility`: suma Stirling PDF privado en `127.0.0.1:3103`.
4. `ai`: instala LiteLLM y Open WebUI solo si hay `OPENAI_API_KEY` en
   `/root/.hermes/.env` y el VPS tiene recursos. Estado: instalado.
5. `research`: instala Crawl4AI solo si hay RAM suficiente. Estado: pendiente.
6. `mail`: prepara Mailpit y Listmonk privados. Estado: preparado, no iniciado
   para produccion.
7. `prepare-dify`: descarga Dify, pero no lo arranca hasta revisar puertos y
   recursos. Estado: pendiente.

## Estado desplegado

| Servicio | Estado | Acceso local VPS | Nota |
|---|---|---|---|
| Uptime Kuma | Healthy | `127.0.0.1:3101` | Setup inicial pendiente por tunel SSH. |
| Open WebUI | Healthy | `127.0.0.1:3102` | Responde `200`; conectado a LiteLLM por red interna. |
| Stirling PDF | Healthy | `127.0.0.1:3103` | Responde `401`; login activo. |
| LiteLLM | Healthy | `127.0.0.1:4000` | `/health/liveliness` responde `200`; `/v1/models` responde `200`. |
| LiteLLM Postgres | Healthy | red Docker interna | Persistente en volumen Docker. |
| Mailpit | Prepared | `127.0.0.1:3104` web / `127.0.0.1:3025` SMTP | Solo QA, no entrega productiva. |
| Listmonk | Prepared | `127.0.0.1:3105` | Campanas/listas; SMTP pendiente de DNS/reputacion. |

Modelos expuestos por LiteLLM:

```text
gpt-4.1-mini
gpt-4o-mini
o4-mini
```

Servicios ya existentes detectados antes de este kit:

- Supabase self-hosted privado.
- n8n en Easypanel.
- Cal.com self-hosted.
- SearXNG local en `127.0.0.1:8080`.
- Chatwoot en stack Easypanel `onia-chatbot`.

No se instalaron duplicados de SearXNG ni Chatwoot.

## Estado de recursos despues de instalar

Snapshot post-instalacion:

```text
RAM total: 7.8 GiB
RAM usada: 4.9 GiB
RAM disponible: 2.8 GiB
Swap total: 4.0 GiB
Swap usada: 3.7 GiB
Disco /: 66% usado, 34 GiB libres
Contenedores activos: 27
```

Decision operativa: no instalar Dify ni Crawl4AI en este VPS todavia. El VPS ya
esta en uso real con Supabase, n8n, Cal, Chatwoot, SearXNG y la nueva capa IA.
Dify y Crawl4AI deben ir en VPS separado o despues de optimizar recursos.

## Reglas de seguridad

- No publicar ningun panel directo a internet al inicio.
- No exponer Supabase compartido por DNS publico.
- No montar Docker socket en agentes.
- No guardar llaves de modelos en compose ni en repo.
- Dify no debe correr con su compose oficial sin revisar puertos 80/443 porque
  puede chocar con Easypanel/Traefik.
- Listmonk no debe enviar correos productivos hasta tener dominio de envio,
  PTR/rDNS, SPF, DKIM, DMARC, bounces y unsubscribe.
- Postal/Mailu/docker-mailserver deben ir en VPS/IP separado si ONIA decide
  operar servidor de correo propio.
- Crawl4AI, Browser Use, Maxun y OpenHands se tratan como workloads riesgosos:
  privados, auditados y con limites.

## Validacion post-deploy

En VPS:

```bash
cd /opt/onia-selfhosted
./install.sh audit
docker compose --profile monitor ps
docker compose --profile utility ps
docker compose --profile ai ps
curl -fsS http://127.0.0.1:3101 || true
curl -fsS http://127.0.0.1:4000/health/liveliness || true
curl -fsS http://127.0.0.1:11235/health || true
```

Desde Windows, usar tunel:

```powershell
ssh -L 3101:127.0.0.1:3101 root@187.77.16.63
```

## Investigacion pendiente

- Authentik vs Authelia para proteger paneles internos.
- Chatwoot + WhatsApp Cloud/BSP: definir costo y canal oficial antes de
  instalar.
- Typebot: instalar solo si hay oferta concreta de lead qualification.
- Langfuse: instalar despues de tener trafico real de Dify/Open WebUI.
- Qdrant: instalar solo si Supabase/pgvector no alcanza.
- Dify: preparar VPS o instancia separada si el VPS actual no tiene margen.
- Correo: decidir si Listmonk usara SMTP externo o si ONIA operara Postal en
  un VPS/IP separado.
- Auth gateway: definir Authentik o Authelia antes de abrir paneles por DNS.

## Fuentes oficiales usadas para el kit

- Uptime Kuma Docker: https://github.com/louislam/uptime-kuma
- LiteLLM deploy/Docker: https://docs.litellm.ai/docs/proxy/deploy
- Open WebUI Docker: https://github.com/open-webui/open-webui
- Dify Docker Compose: https://docs.dify.ai/en/self-host/quick-start/docker-compose
- Stirling PDF config: https://docs.stirlingpdf.com/Configuration/
- Crawl4AI self-hosting: https://docs.crawl4ai.com/core/self-hosting/
- Listmonk: https://listmonk.app/
- Mailpit: https://mailpit.axllent.org/
- Postal: https://docs.postalserver.io/
