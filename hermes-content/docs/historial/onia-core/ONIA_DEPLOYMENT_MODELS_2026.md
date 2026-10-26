# Onia Deployment Models 2026

Fecha: 2026-07-03.
Estado: modelos canonicos de entrega y plan de escala.
Owner: Onia / Hermes.
Responde: "como funcionaria en una empresa que quiera el sistema local?" y
"como hosteo todo si ya tenemos muchos usuarios?" (Sergio, 2026-07-03).

## Los 3 modelos de entrega (mismo producto, misma base de codigo)

### Modelo A — SaaS cloud (default para clinicas/pymes)

```text
Cliente -> www.dentalgest.app (Vercel) -> Supabase cloud (1 proyecto por PRODUCTO)
```

- El cliente no instala nada; paga mensual; multi-tenant por organizationId
  con tenant guard + RLS.
- Es lo que corre HOY. Backups/PITR gestionados.

### Modelo B — VPS gestionado por cliente ("ONIA Managed Bridge", modelo BE)

```text
VPS del cliente (Easypanel) -> n8n + Chatwoot + Postgres + apps del cliente
ONIA administra por SSH; el cliente paga su VPS + gestion mensual a ONIA
```

- Ya probado con Bolivian Electric (srv1793230). Para empresas medianas que
  quieren SU infraestructura sin operar nada.
- Los datos quedan en el VPS del cliente; Onia cobra la gestion (margen
  recurrente sin costo de infra propio).

### Modelo C — On-premise / local (empresas que exigen todo adentro)

```text
Servidor local de la empresa (o mini-PC/NUC) con Docker
  -> stack selfhost (YA EXISTE: docker-compose.selfhost de DentaGest:
     app + Supabase completo + Caddy)
  -> acceso desde la red local; opcional tunel (Tailscale) para soporte ONIA
```

- El artefacto ya esta construido: el `docker-compose.selfhost` + la
  migracion de namespace (`dentalgest` schema) se hicieron exactamente para
  esto, y hay un stack de ensayo corriendo en el VPS Onia
  (dentalgest-staging-supabase, healthy).
- Como se vende: licencia anual + instalacion pagada + plan de soporte.
  Actualizaciones: `git pull + docker compose up` via tunel de soporte, en
  ventana acordada. Backups: script diario a disco externo + copia cifrada
  opcional a storage Onia.
- Requisito minimo cliente: una maquina con Docker (Linux ideal, pero
  Windows con Docker Desktop funciona para equipos chicos).
- Integracion con sistemas locales del cliente (ej. TR4 de BE): al estar en
  la MISMA red, la conexion a su base es directa — este modelo es el mas
  natural para el puente TR4.

### Como elegir (guia comercial)

| Senal del cliente | Modelo |
|---|---|
| Clinica/pyme chica, quiere empezar ya | A (SaaS) |
| Empresa mediana, quiere control y WhatsApp/n8n propios | B (VPS gestionado) |
| "Los datos no salen de mi empresa" / ERP local que integrar | C (on-premise) |

## Escala: "y si ya tenemos muchos usuarios?"

La arquitectura actual escala por etapas SIN reescritura, porque el baseline
de migraciones + Docker selfhost hacen portable cada pieza:

| Etapa | Usuarios/orgs por producto | Infra | Accion |
|---|---|---|---|
| 1 (hoy) | 0-50 orgs | Vercel + Supabase Pro | nada; medir |
| 2 | 50-300 orgs | Supabase upgrade (compute dedicado) + Vercel | subir plan; agregar read-replica si reportes pesan |
| 3 | 300-1000 orgs | VPS dedicado por producto (el stack selfhost ya ensayado) o Supabase enterprise | decidir por costo: cloud vs 2-3 VPS con Postgres + PgBouncer + backups automatizados ensayados |
| 4 | multi-pais / miles | separar DB por region/vertical; el contrato multi-tenant no cambia | contratar sysadmin o servicio gestionado |

Reglas que ya estan decididas y aplican a cualquier etapa:

1. **1 proyecto/DB por PRODUCTO, jamas por cliente** — 100 clinicas = 1 DB.
2. **Cloud para velocidad de venta, selfhost para margen** (trigger: ~50
   orgs o US$100/mes por producto).
3. El VPS Onia actual (4 vCPU/15GB) es la plataforma interna, NO el hosting
   de productos con muchos usuarios: cuando un producto pegue, VPS propio
   dedicado para ese producto.
4. Antes de mover cualquier DB de clientes: ensayo de backup+restore
   documentado (pendiente en el plan de stack, fase 5).

## NAS y Tomcat: que son y si nos sirven (pregunta Sergio 2026-07-03)

**NAS (Network Attached Storage):** una cajita con discos conectada a la red
local (Synology/QNAP) que sirve archivos y respaldos a toda la oficina.

- Nos sirve? SI, en el **Modelo C (on-premise)**: destino natural del backup
  diario de la base (dump nocturno al NAS + copia cifrada fuera de la
  oficina). Tambien para archivos grandes del cliente.
- NO lo necesitamos para SaaS/VPS (ahi el backup va a storage cloud).
- Si un cliente ya tiene NAS (comun en empresas con ERP local), lo
  aprovechamos en la instalacion en vez de vender hardware.

**Apache Tomcat:** servidor web para aplicaciones Java. Muchos ERPs legados
corren como app Java sobre Tomcat.

- Nos sirve? NO directamente: nuestro stack es Node/Next.js, no Java. Solo
  importaria si el sistema local de un cliente corriera sobre Tomcat (para
  saber como integrarlo).
- **Verificado en la auditoria de TR4**: el ERP de Bolivian Electric NO es
  Tomcat/Java — es **PowerBuilder + SQL Server** (driver MSOLEDBSQL). Mejor
  noticia imposible: n8n tiene **nodo nativo de Microsoft SQL Server**, asi
  que el puente TR4 es: tunel (Tailscale/SSH) a la red de BE -> n8n consulta
  SQL Server en solo-lectura -> catalogo/precios para el repricing. Sin
  tocar TR4.

## Ensayo de backup/restore EJECUTADO (2026-07-04, fase 5 del stack plan)

En el staging del VPS (`dentalgest-staging-supabase-db`):

```text
pg_dump schema dentalgest (formato custom)
  -> restore a base scratch drill_restore
  -> verificacion: 24 tablas origen -> 24 restauradas
  -> 1 warning esperado (policy RLS que referencia auth.uid al restaurar
     solo el schema; en restore completo no ocurre)
  -> limpieza total
```

Conclusion: **la salida de emergencia y el Modelo C estan probados.** Falta
solo automatizarlo como cron nocturno cuando un producto viva en VPS.

## Que falta construir para vender el Modelo C manana

1. Empaquetar el selfhost de DentaGest como instalador reproducible
   (script + checklist de entrega) — base ya existe.
2. Definir precio de licencia + instalacion + soporte anual.
3. Runbook de actualizacion remota por tunel (Tailscale) con rollback.
4. Probar restore completo en el staging del VPS (fase 5 del stack plan).
