# ONIA Self-hosted Stack Runbook 2026

Estado: desplegado por perfiles privados. No contiene secretos.
Actualizado: 2026-06-28 America/Caracas.

## Diagnostico

Hermes debe funcionar como sistema operativo de ONIA: decide, registra,
orquesta y audita. Las herramientas self-hosted no deben convertirse en paneles
sueltos; cada una debe entrar como capacidad controlada:

- Supabase: memoria/base privada.
- ONIA Center: sistema operativo interno con login por rol.
- n8n: ejecucion de procesos.
- LiteLLM: gateway de modelos y costos.
- Open WebUI: cockpit interno.
- Dify: apps IA vendibles, sin multi-tenant/rebranding hasta revisar licencia.
- Uptime Kuma: monitoreo simple.
- Stirling PDF: documentos.
- Crawl4AI: research/crawling privado.
- Firecrawl: research, auditorias web y extraccion limpia para agentes.
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
npm run deploy:selfhosted -- --profile prepare-firecrawl
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
8. `prepare-firecrawl`: descarga Firecrawl y genera `.env` privado, pero no lo
   arranca. Estado: preparado solo cuando se necesite ventana de mantenimiento.

## Estado desplegado

| Servicio | Estado | Acceso local VPS | Nota |
|---|---|---|---|
| Uptime Kuma | Healthy | `127.0.0.1:3101` | Setup inicial pendiente por tunel SSH. |
| Open WebUI | Healthy | `127.0.0.1:3102` | Responde `200`; conectado a LiteLLM por red interna. |
| Stirling PDF | Healthy | `127.0.0.1:3103` | Responde `401`; login activo. |
| LiteLLM | Healthy | `127.0.0.1:4000` | `/health/liveliness` responde `200`; `/v1/models` responde `200`. |
| LiteLLM Postgres | Healthy | red Docker interna | Persistente en volumen Docker. |
| Crawl4AI | Healthy private | `127.0.0.1:11235` | Activado en KVM 4; token/secret persistentes en `.env` remoto. |
| Mailpit | Prepared | `127.0.0.1:3104` web / `127.0.0.1:3025` SMTP | Solo QA, no entrega productiva. |
| Listmonk | Prepared | `127.0.0.1:3105` | Campanas/listas; SMTP pendiente de DNS/reputacion. |
| Firecrawl | Prepared gated | `127.0.0.1:3106` si se arranca | No iniciado por defecto; workload pesado de navegador/API. |
| ONIA Center | Publico con login | `https://center.onia.com.bo` | Contenedor `onia-center`; usa Supabase privado por red Docker. |

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
- ONIA Center publico con auth.
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

Snapshot despues de upgrade Hostinger KVM 4, validado por SSH el 2026-06-24:

```text
CPU: 4 vCPU
RAM total: 15 GiB
RAM usada: 3.6 GiB
RAM disponible: 12 GiB
Swap total: 4.0 GiB
Swap usada: 0 B
Disco /: 193 GiB total, 69 GiB usado, 125 GiB libre, 36% usado
Supabase: healthy en docker compose
EasyPanel: 1/1
Traefik: 1/1, puertos 80/443
n8n-sergio: 1/1, HTTPS 200
Chatwoot: 1/1, HTTPS 200
```

## Recuperacion despues de upgrade/reinicio de VPS

Incidente observado el 2026-06-24 despues de pasar de KVM 2 a KVM 4:

- `nginx` default estaba ocupando el puerto 80 y bloqueaba
  `easypanel-traefik`.
- `onia-chatbot_chatwoot` reiniciaba porque `POSTGRES_HOST` y `REDIS_URL`
  resolvian por la red overlay general `easypanel`, cuyas VIP estaban rotas.
- Traefik devolvia `502` para n8n/Chatwoot porque no podia llegar a las VIP de
  Swarm hasta reiniciar Docker.

Procedimiento aplicado y validado:

```bash
# 1. Liberar puerto 80 para Traefik. El nginx era la pagina default.
systemctl stop nginx
systemctl disable nginx

# 2. Hacer que Chatwoot use aliases de su red propia.
docker service update \
  --env-add POSTGRES_HOST=chatwoot-db \
  --env-add REDIS_URL="<REDIS_URL_EXISTENTE_CON_HOST_chatwoot-redis>" \
  --force onia-chatbot_chatwoot

docker service update \
  --env-add POSTGRES_HOST=chatwoot-db \
  --env-add REDIS_URL="<REDIS_URL_EXISTENTE_CON_HOST_chatwoot-redis>" \
  --force onia-chatbot_chatwoot-sidekiq

# 3. Reconstruir overlay/IPVS si Traefik sigue con Host is unreachable.
systemctl restart docker
```

Validacion minima despues de este procedimiento:

```bash
docker service ls
cd /opt/onia-supabase/supabase/docker && docker compose ps
curl -k -I https://n8n-sergio-n8n.hqdqgh.easypanel.host
curl -k -I https://onia-chatbot-chatwoot.hqdqgh.easypanel.host
curl -sS http://127.0.0.1:54321/auth/v1/health || true
docker stats --no-stream
```

Resultado esperado:

- `easypanel-traefik`, `n8n-sergio_n8n`, `onia-chatbot_chatwoot`,
  `onia-chatbot_chatwoot-db`, `onia-chatbot_chatwoot-redis` y
  `onia-chatbot_chatwoot-sidekiq` en `1/1`.
- Traefik debe poder llegar desde dentro del contenedor a
  `http://onia-chatbot_chatwoot:3000/`, `http://n8n-sergio_n8n:5678/` y
  `http://easypanel:3000/`.

## Activacion extendida despues de KVM 4

Estado validado el 2026-06-24 despues de reactivar perfiles y rutas:

```text
Uptime Kuma: healthy, local VPS 127.0.0.1:3101, HTTP 302
Open WebUI: healthy, local VPS 127.0.0.1:3102, HTTP 200
Stirling PDF: healthy, local VPS 127.0.0.1:3103, HTTP 401 esperado por login
LiteLLM: healthy, local VPS 127.0.0.1:4000, /health/liveliness HTTP 200
Crawl4AI: healthy privado, local VPS 127.0.0.1:11235, activado despues de KVM 4
SearXNG: running, local VPS 127.0.0.1:8080, HTTP 200
Cal.com: healthy, publico https://cal.onia.com.bo, HTTP 200 en /auth/login
ONIA Center: running, publico https://center.onia.com.bo, login HTTP 200
n8n: publico https://n8n-sergio-n8n.hqdqgh.easypanel.host, HTTP 200
Chatwoot: publico https://onia-chatbot-chatwoot.hqdqgh.easypanel.host, HTTP 200
```

Comando usado para reactivar perfiles no-mail del kit:

```bash
cd /opt/onia-selfhosted
docker compose --profile monitor --profile utility --profile ai up -d
```

El compose canonico ya no exige placeholders de Listmonk para perfiles no-mail.
Listmonk sigue preparado, no productivo.

Crawl4AI debe correr con `CRAWL4AI_API_TOKEN`, `CRAWL4AI_SECRET_KEY` y
`CRAWL4AI_REDIS_PASSWORD` generados en `/opt/onia-selfhosted/.env`. No imprimir
esos valores en chat ni logs compartidos.

Cal.com se reactivo con:

```bash
cd /opt/onia-calcom
docker compose up -d
```

SearXNG se reactivo con:

```bash
docker start searxng
```

Ruta publica Cal.com agregada manualmente al archivo dinamico de Traefik:

```text
/etc/easypanel/traefik/config/main.yaml
```

Backup creado antes del cambio:

```text
/etc/easypanel/traefik/config/main.yaml.bak-onia-calcom-route-20260625012301
/etc/easypanel/traefik/config/main.yaml.bak-onia-calcom-fix-20260626212232
```

La ruta agregada apunta `onia-calcom.hqdqgh.easypanel.host` a
`http://onia-calcom:3000/` en la red externa `easypanel`. El contenedor Cal.com
ya declara alias `onia-calcom` en esa red.

Validacion publica Cal del 2026-06-28:

```text
http://cal.onia.com.bo -> 308 HTTPS
https://cal.onia.com.bo/auth/login -> 200
GET https://cal.onia.com.bo/api/auth/session -> 200 {}
EMAIL_FROM=business@onia.com.bo
```

ONIA Center se desplego el 2026-06-28:

```text
DNS: center.onia.com.bo -> 187.77.16.63
Runtime source: /opt/onia-center-src/web-factory
Runtime app: /opt/onia-center/runtime-next
Env: /opt/onia-center/.env (600)
Container: onia-center
Networks: easypanel, supabase_default
Supabase internal URL: http://supabase-kong:8000
Traefik backup: /etc/easypanel/traefik/config/main.yaml.bak-onia-center-20260628205227
```

Validacion publica ONIA Center del 2026-06-28:

```text
https://center.onia.com.bo/onia-center/login -> 200
https://center.onia.com.bo/api/onia-center/auth/status -> 401 auth_required sin missingConfiguration
https://center.onia.com.bo/onia-center/equipo -> 307 login si no hay sesion
Login alias arthur -> 200 authenticated
Login alias vendedora -> 200 authenticated
```

Recursos despues de activar todo:

```text
RAM total: 15 GiB
RAM usada: 7.5 GiB
RAM disponible: 8.1 GiB
Swap usada: 396 MiB / 4.0 GiB
Disco /: 193 GiB total, 69 GiB usado, 125 GiB libre, 36% usado
```

Vigilancia:

- LiteLLM quedo cerca de su limite configurado: aprox. `1.47 GiB / 1.5 GiB`.
- Stirling PDF quedo alto pero healthy: aprox. `1.18 GiB / 1.5 GiB`.
- LiteLLM fue subido a `3 GiB` y Stirling PDF a `2 GiB` de limite despues del
  KVM 4.
- No instalar Dify, OpenHands ni workers de navegador adicionales en este mismo
  VPS hasta estabilizar memoria o separar workloads.
- Firecrawl queda como capacidad preparada/gated: no arrancarlo como servicio
  permanente en este VPS sin revisar memoria y colas.

## Reglas de seguridad

- No publicar ningun panel directo a internet al inicio.
- No exponer Supabase compartido por DNS publico.
- ONIA Center puede ser publico solo detras de login por rol; Supabase debe
  seguir en red privada y no en DNS publico.
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
- Firecrawl se trata igual: privado, con queue admin protegido por
  `BULL_AUTH_KEY`, sin puerto publico y con limites de concurrencia.

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
- Firecrawl: preparar fuente y `.env`; arrancar solo con objetivo concreto de
  auditoria/research y ventana de mantenimiento.
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
- Firecrawl self-hosting: https://github.com/firecrawl/firecrawl/blob/main/SELF_HOST.md
- Listmonk: https://listmonk.app/
- Mailpit: https://mailpit.axllent.org/
- Postal: https://docs.postalserver.io/
