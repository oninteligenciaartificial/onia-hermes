# Onia Ecosystem Inventory 2026-07-04

Fecha: 2026-07-04.
Estado: mapa de capacidades del ecosistema completo (auditoria por subagente).
Owner: Onia / Hermes.

## Repos y estado

| Repo | Stack | Estado | Linea |
|---|---|---|---|
| onia-hermes | Node VPS tools, n8n, Telegram | 🟢 Centro operativo | Core, skills, content, deploy |
| DentaGest/dental-saas | Next.js 16 + Prisma 7 + Supabase | 🟢 Produccion | Core instalado 9/9 + wizard + intake + Contador Pack |
| Gestios | Next.js 16 + Prisma 7 + Supabase | 🟢 Produccion (gestioshq.app), 411 tests | POS, inventario, ordenes, CRM |
| Bolivian Electric OS | Next.js monorepo + n8n | 🟢 MVP | CRM gerencial + WhatsApp comercial |
| WEB Onia | Next.js estatico | 🟢 Produccion | Landing + captacion |
| **Ganaderos-Os** | Next.js + Prisma | 🔴 **RIESGO: sin commits/historia git** | Decidir: sprint de recuperacion o pausa formal |
| dentalgest-video | Remotion | 🟡 Minimo | Mover artifacts a storage, no necesita git |
| onia-hermes-collab | Docs | 🟡 Referencia | Consolidar en onia-hermes |

Stack 100% uniforme: Next.js 16 + Prisma 7 + Supabase + TypeScript.

## Duplicacion critica -> paquetes @onia/* (post-Sprint 2, ya planificado)

| Patron | Repos | Paquete |
|---|---|---|
| Auth + Supabase SSR + roles | 4 repos | @onia/auth |
| Prisma multi-tenant + migrations | 3 repos | @onia/prisma |
| WorkItem + SLA | core, BE | @onia/workflows |
| Email Resend + templates | 3 repos | @onia/email |
| WhatsApp Meta API | 3 repos | @onia/whatsapp |
| Dashboard (Tremor/shadcn) | varios | @onia/ui |
| n8n helpers | varios | @onia/n8n-utils |

Estimacion: ~15-20K lineas duplicadas; extraccion acelera productos nuevos
2-3 sprints. Regla vigente: extraer DESPUES de que DentalGest pruebe los
patrones (no abstraccion prematura).

## Hermes dentro de los productos (integraciones Telegram propuestas)

1. `/dentalgest pendientes` — cola de WorkItems + citas de la clinica.
2. `/gestios estado` — ordenes sin procesar, stock critico, vendedores.
3. `/bolivian crm` — solicitudes vencidas, SLA de vendedores.
4. `/tarea "..."` — crear WorkItem por Telegram via intake (la joya: usa
   el endpoint /api/onia-core/intake ya vivo, canal phone_walkin).
5. `/factory status` — builds y estado de web-factory.

Patron comun: n8n (Telegram Command Center ya existe) -> API del producto
con secret -> respuesta formateada. Empezar por /tarea y /dentalgest.

## Acciones derivadas

1. Decidir Ganaderos-Os (recuperar o pausar) — decision de Sergio.
2. dentalgest-video -> storage; onia-hermes-collab -> fusionar.
3. Consolidacion n8n (ya en plan de stack).
4. Primeras 2 integraciones Hermes cuando cierre el sprint fiscal.
