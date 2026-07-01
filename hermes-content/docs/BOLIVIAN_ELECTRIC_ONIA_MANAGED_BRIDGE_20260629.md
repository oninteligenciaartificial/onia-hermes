# Bolivian Electric - ONIA Managed Bridge

Fecha: 2026-06-29

## Decision

ONIA puede avanzar con un puente administrado para Bolivian Electric: VPS dedicado pagado o administrado por ONIA, n8n self-hosted para Bolivian, Chatwoot Cloud dedicado y APIs de IA administradas por ONIA mientras se prepara propiedad final del cliente.

La clave es que el puente sea dedicado a Bolivian, medible, exportable y con plan de traspaso.

## Por que conviene

- Evita esperar indefinidamente al servidor interno del cliente.
- Permite probar WhatsApp + Chatwoot + n8n con infraestructura controlada.
- Reduce friccion tecnica con el area de sistemas.
- Permite vender soporte mensual real de ONIA.
- Mantiene el sistema interno de Bolivian sin tocar al inicio.

## Limites

No convertir el puente en una mezcla informal de cuentas ONIA:

- no usar n8n compartido con datos reales;
- no mezclar Chatwoot de otros clientes;
- no poner WABA/numero bajo propiedad de ONIA;
- no usar API keys personales sin rotacion;
- no conectar base productiva sin usuario read-only.

## Arquitectura

```text
Meta/WABA Bolivian
-> WhatsApp oficial
-> Chatwoot Cloud dedicado
-> VPS dedicado Bolivian administrado por ONIA
   -> n8n self-hosted
   -> webhook/backend/adapters
-> CRM/OS/reportes
```

## Componentes recomendados

| Componente | Decision puente |
| --- | --- |
| VPS | Dedicado a Bolivian, pagado por ONIA o facturado aparte |
| n8n | Self-hosted con Docker Compose + PostgreSQL |
| Chatwoot | Cloud dedicado para Bolivian |
| OpenAI | API ONIA con tracking por cliente o cuenta tecnica Bolivian |
| Meta | Siempre propiedad de Bolivian |
| Email tecnico | Gmail temporal solo si no existe dominio; migrar a dominio |

## Estado desplegado 2026-06-29

VPS dedicado inicial ya levantado para Bolivian Electric.

- Proveedor: Hostinger VPS.
- Plan observado: KVM 2.
- OS: Ubuntu 24.04 LTS.
- Region: Brazil - Campinas.
- IPv4: `187.77.251.218`.
- Hostname temporal: `srv1793230.hstgr.cloud`.
- URL temporal n8n: `https://srv1793230.hstgr.cloud/`.
- Usuario operativo SSH: `onia-deploy`.
- Stack remoto: `/opt/bolivian-n8n`.
- Servicios: Postgres 16, n8n `2.27.5`, task runners externos `2.27.5`, Caddy HTTPS.
- Backup: dump diario de Postgres a las 03:17, retencion 14 dias.

Estado validado:

- HTTPS responde `200 OK`.
- Docker Compose muestra `postgres` healthy, `n8n`, `task-runners` y `caddy` arriba.
- n8n registra runners externos `launcher-javascript` y `launcher-python`.
- Backup manual de Postgres probado correctamente.
- SSH endurecido: sin contrasena, sin login directo de `root`, acceso por llave con `onia-deploy`.
- `fail2ban` y `unattended-upgrades` activos.

## Revision operativa 2026-06-30

Estado real verificado:

- n8n responde por HTTPS en `https://srv1793230.hstgr.cloud/`.
- `docker compose config --quiet` valido correctamente.
- `postgres` esta healthy y `n8n`, `task-runners`, `caddy` estan arriba.
- `/rest/settings` muestra `showSetupOnFirstLoad=true`; falta crear owner inicial.
- No hay variables duplicadas en `.env`.
- Backups ampliados: Postgres, configuracion del stack y volumen `n8n_data`.
- Healthcheck cada 10 minutos: Docker, Postgres, HTTPS y `/rest/settings`.
- Secretos del stack rotados por seguridad; no registrar valores en Markdown ni chat.
- Como no existian owner, workflows ni credenciales, se regenero la configuracion interna de n8n despues de la rotacion de encryption key.

Workflow preparado:

- `C:\dev\clientes\Bolivian Electric\infra\n8n\workflows\be-chatwoot-whatsapp-intake.sdk.js`
- Nombre: `BE - Chatwoot WhatsApp Intake`
- Validacion n8n SDK: `valid=true`, `nodeCount=7`.

Guia operativa:

- `C:\dev\clientes\Bolivian Electric\docs\operations\n8n-owner-and-settings-guide.md`

Pendiente inmediato:

1. Crear cuenta owner en n8n desde la URL temporal.
2. Crear Chatwoot Cloud dedicado para Bolivian Electric.
3. Agregar credencial OpenAI dentro de n8n sin exponer API key en chat.
4. Agregar credencial `Chatwoot Bolivian API Token`.
5. Importar o crear workflow `BE - Chatwoot WhatsApp Intake`.
6. Conectar WhatsApp oficial por Embedded Signup/coexistencia si Meta lo permite.
7. Crear dominio definitivo `n8n.bolivianelectric.com.bo` apuntando al VPS.

Runbook tecnico del cliente:

- `C:\dev\clientes\Bolivian Electric\docs\operations\bolivian-vps-n8n-deployment.md`

## Oferta comercial ONIA

Separar cobros:

- setup WhatsApp/Meta/Chatwoot;
- setup VPS/n8n;
- consumo VPS;
- consumo Chatwoot por agentes/plan;
- consumo IA;
- consumo WhatsApp/Meta;
- soporte mensual;
- integraciones futuras con inventario/ERP.

No vender consumo ilimitado ni prometer coexistencia WhatsApp hasta probar el flujo real.

## Plan de traspaso

1. Crear `integraciones@bolivianelectric.com.bo`.
2. Agregarlo como owner/admin en servicios.
3. Transferir facturacion cuando corresponda.
4. Regenerar API keys.
5. Actualizar variables en VPS/n8n/backend.
6. Revocar llaves antiguas.
7. Mantener ONIA como admin tecnico bajo soporte.

## Referencias internas

- `C:\dev\clientes\Bolivian Electric\docs\operations\onia-managed-bridge-runbook.md`
- `C:\dev\clientes\Bolivian Electric\docs\operations\client-dedicated-automation-runbook.md`
- `C:\dev\clientes\Bolivian Electric\docs\operations\whatsapp-chatbot-runbook.md`
