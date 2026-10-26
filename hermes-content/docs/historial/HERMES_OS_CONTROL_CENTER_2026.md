# Hermes OS Control Center 2026

Estado: implementacion inicial del panel operativo y plan de migracion.
Actualizado: 2026-06-20.

## Diagnostico

Onia no necesita otro panel suelto. Necesita un control center que ordene los
servicios self-hosted, diga que esta activo, que falta, que puede migrarse y
que no debe tocarse todavia.

Decision: el `Control Tower` en `localhost:3010` es el panel visual. El
dashboard canonico de Hermes sigue en `localhost:9119`.

## Estado actual confirmado

Servicios existentes o ya desplegados:

| Servicio | Estado | Rol |
|---|---|---|
| Supabase | privado/local | base, auth, storage y memoria operativa |
| n8n | activo | ejecucion de automatizaciones |
| Cal.com | activo | reservas y reuniones |
| Chatwoot | activo | inbox y WhatsApp/clientes |
| SearXNG | privado/local | investigacion |
| Uptime Kuma | privado/local `3101` | monitoreo |
| LiteLLM | privado/local `4000` | gateway IA y control de modelos |
| Open WebUI | privado/local `3102` | cockpit interno IA |
| Stirling PDF | privado/local `3103` | herramientas PDF |

Estado del VPS despues del stack inicial:

```text
RAM total: 7.8 GiB
RAM disponible: 2.8 GiB
Swap usada: 3.7 GiB / 4.0 GiB
Disco /: 66% usado
Contenedores activos: 27
```

Conclusion tecnica: el VPS actual sirve como nucleo/control plane. No es sano
meter Dify, Crawl4AI pesado, Browser Use, Maxun, OpenHands ni servidor de correo
productivo en la misma maquina.

## Que se migra primero

1. AI interna: mover trabajo de chats sueltos a `Open WebUI + LiteLLM`.
2. Reservas: consolidar booking en `Cal.com`.
3. Operaciones: que `Control Tower` muestre estado, requisitos, riesgos y
   proximas acciones.
4. Documentos: usar `Stirling PDF` para tareas internas de PDF.
5. Automatizaciones: mantener `n8n` como motor de ejecucion, con Hermes como
   capa de decision y Telegram como aprobacion.
6. Base y datos: usar Supabase privado para memoria, CRM y futuros SaaS.
7. Correo: empezar con pruebas y listas; no enviar produccion hasta DNS y
   reputacion.

## Correo open-source

Separar tres cosas:

| Necesidad | Herramienta recomendada | Decision |
|---|---|---|
| Probar emails de apps y formularios | Mailpit | Implementado como perfil preparado, no publico |
| Newsletters/listas/campanas simples | Listmonk | Recomendado primero |
| Marketing automation completo | Mautic | Mas adelante si hay journeys, scoring y landing pages |
| SMTP propio tipo SendGrid/Mailgun | Postal | Solo en VPS/IP separado |
| Mailbox completo IMAP/SMTP | Mailu o docker-mailserver | Solo si Onia quiere operar servidor de correo real |

Regla: Listmonk/Mautic son paneles de campanas. El envio real depende de SMTP,
dominio, reputacion y DNS. Postal/Mailu/docker-mailserver no deben compartir el
IP del VPS principal de Onia.

Requisitos minimos para enviar correos productivos:

- Dominio o subdominio de envio, por ejemplo `send.onia.com.bo`.
- A record y MX segun arquitectura.
- PTR/rDNS del IP hacia el hostname de envio.
- SPF, DKIM y DMARC.
- Bounces y quejas.
- Unsubscribe visible.
- Politica de calentamiento de IP y limites diarios.
- Uptime Kuma monitoreando SMTP/HTTP.

## Requisitos nuevos

### VPS AI/worker

Uso: Dify, Crawl4AI, Browser Use/Maxun tests, RAG workers.

Minimo recomendado:

```text
8 vCPU
24 GB RAM
200 GB NVMe
Ubuntu 24.04 LTS
Docker + Compose
Backups/snapshots
```

Contabo Cloud VPS 30 o superior encaja por clase de recursos. Si vamos a usar
navegadores pesados y Dify con trafico real, considerar un VPS mayor o separar
Dify de crawlers.

### VPS correo

Uso: Postal, Mailu o docker-mailserver si Onia decide operar envio propio.

Minimo recomendado:

```text
2-4 vCPU
4-8 GB RAM
IPv4 dedicado y limpio
rDNS/PTR editable
DNS completo
backups
```

No usar el VPS principal para correo productivo. Si el IP cae en mala
reputacion, puede afectar paneles, automatizaciones y comunicaciones.

### Auth gateway

Antes de publicar paneles por dominio:

- Authelia o Authentik.
- TLS real por Traefik/Easypanel.
- Usuarios separados.
- 2FA para Sergio/admin.
- Logs sin secretos.

### Backups

Necesitamos backups offsite para:

- Supabase.
- n8n.
- Listmonk/Mautic.
- Dify.
- Hermes docs/references.
- Volumenes Docker criticos.

## Orden de implementacion recomendado

1. Control Tower con mapa operativo, requisitos y migracion.
2. Uptime Kuma con checks de todos los servicios locales y publicos.
3. Mailpit privado para QA de formularios/apps.
4. Listmonk privado para preparar listas y templates.
5. Dominio/subdominios y DNS.
6. Auth gateway antes de exponer paneles.
7. VPS AI worker para Dify/Crawl4AI.
8. VPS correo solo si decidimos operar SMTP propio.

## Comandos

Panel:

```powershell
ssh -L 3010:localhost:3010 root@187.77.16.63
```

Servicios self-hosted:

```powershell
npm run audit:selfhosted
npm run deploy:selfhosted -- --profile monitor
npm run deploy:selfhosted -- --profile utility
npm run deploy:selfhosted -- --profile ai
npm run deploy:selfhosted -- --profile mail
```

No ejecutar `mail` para produccion sin DNS y decision de envio. Puede usarse
para Mailpit/Listmonk privado.

## Fuentes de investigacion

- Contabo Cloud VPS: https://contabo.com/en-us/vps/
- Contabo pricing: https://contabo.com/en-us/pricing/
- Contabo DNS/rDNS: https://help.contabo.com/en/support/solutions/articles/103000336144-dns-and-rdns-managment-with-contabo
- Listmonk: https://listmonk.app/
- Mautic: https://mautic.org/
- Postal: https://docs.postalserver.io/
- Mailu: https://mailu.io/
- Docker Mailserver: https://docker-mailserver.github.io/docker-mailserver/latest/
- Mailpit: https://mailpit.axllent.org/
