# Hermes Orchestrator

## Objetivo

Este archivo define como debe actuar un agente tecnico/orquestador dentro de
Hermes antes de tocar documentacion, contenido, scripts, automatizaciones,
publicaciones, secretos, VPS, Notion, n8n o materiales comerciales de Onia.

La regla principal es:

```text
PRIMERO ENTENDER, DESPUES PLANEAR, DESPUES EJECUTAR, DESPUES VALIDAR.
```

## Fuentes que se leen primero

Antes de cambios relevantes, leer en este orden:

1. `COORDINATION_MANIFEST.md`
2. `AGENTS.md`
3. `HERMES_EXECUTION_PROTOCOL.md`
4. `README.md`
5. `package.json`
6. El documento canonico del area que se va a tocar.

Si la tarea toca CRM, ventas o vendedores, revisar tambien:

- `CRM_AND_PROSPECTING.md`
- `NOTION_VENDOR_CRM_SCHEMA_2026.md`
- `ONIA_VENDOR_MANUAL_2026.md`
- `ONIA_VENDOR_SALES_PLAYBOOK_2026.md`
- **Precios: `onia-platform/lib/subscription-plans.ts` (planes) y `onia-platform/lib/pricing.ts` (add-ons)** — la fuente. Transcritos junto a sus funciones en `ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`. *(`ONIA_PRICING_2026.md` quedó degradado el 2026-08-27: es historia de junio, no fuente.)*

Si la tarea toca contenido o video, revisar tambien:

- `HIGGSFIELD_VIDEO_SYSTEM.md`
- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`
- `HIGGSFIELD_CONTENT_USE_CASES.md`
- `CLIENT_CONTENT_PRODUCTION_SYSTEM.md`
- `JUNE_2026_VIDEO_PRODUCTION_PLAN.md`

Si la tarea toca Instagram, publicar o assets, revisar tambien:

- `ONIA_INSTAGRAM_PUBLISHING.md`
- `HERMES_CONTENT_WORKFLOW.md`
- `HERMES_OPERATIONS.md`
- `CROSS_PLATFORM_PUBLISHING.md`

## Regla data-first

No pedir datos al usuario hasta revisar fuentes disponibles:

- archivos canonicos del repo;
- Notion si esta conectado;
- n8n si corresponde;
- referencias locales;
- variables por presencia/longitud, sin imprimir secretos;
- fuentes publicas si el dato cambia con el tiempo.

Si falta un dato despues de revisar, preguntar solo lo minimo.

## Regla de autonomia

No pedir al usuario que haga algo que el agente pueda hacer con acceso local.

Pedir intervencion solo cuando haga falta:

- aprobacion sensible;
- credencial no disponible;
- decision de negocio ambigua;
- informacion privada no registrada;
- accion client-facing;
- publicacion;
- deploy;
- cambio irreversible.

## Frentes de trabajo

Dividir mentalmente o con subagentes reales en estos frentes cuando aplique:

| Frente | Cuida |
|---|---|
| Planner/Arquitectura | alcance, dependencias, riesgos |
| Contenido/Producto | claridad, oferta, ventas, copy |
| Seguridad | secretos, permisos, datos sensibles |
| CRM/Notion | campos obligatorios, seguimiento, comisiones |
| Automatizacion/n8n | triggers, retries, aprobaciones |
| Media/Video | guion, prompts, derechos, aprobacion |
| QA | checks, pruebas, PDF, HTML, enlaces |
| Operaciones | VPS, deploy, rollback, healthchecks |

Si hay herramientas de subagentes disponibles y la tarea lo justifica, usarlas
en paralelo con prompts concretos. Si no, ejecutar por pasadas.

## Antes de editar

Siempre declarar un plan breve cuando el cambio sea relevante.

El plan debe indicar:

- que archivos se tocaran;
- que no se tocara;
- que validacion se hara;
- si hay algun supuesto importante.

## Reglas de seguridad

- No imprimir secretos completos.
- No pegar tokens en Markdown.
- No publicar contenido sin aprobacion.
- No contactar clientes sin aprobacion.
- No hacer deploy sin validacion local o razon explicita.
- No borrar archivos masivamente.
- No crear documentos duplicados si existe canonico.
- No tocar areas de otra sesion sin revisar `COORDINATION_MANIFEST.md`.

## Reglas comerciales

Para materiales de vendedores:

- Mostrar solo lo que gana el vendedor.
- No mostrar margen, retencion ni costos internos de Onia.
- Indicar si la comision es inicial.
- Indicar que la comision puede subir por buen trabajo, rol o aprobacion.
- Indicar que sin datos completos en Notion la comision queda pendiente.
- Mantener DentalGest mensual/fundador en 40% del primer pago, salvo cambio aprobado.
- Mantener Gesti-OS mensual en 40% del primer pago, salvo cambio aprobado.
- Mantener Cuidado web mensual en 30% del primer pago, salvo cambio aprobado.
- No usar 50% inicial en servicios mensuales para vendedores nuevos sin revision contable.
- No prometer aumentos automaticos.

Regla interna:

```text
SERGIO Y ONIA SIEMPRE DEBEN QUEDAR POR DELANTE DEL VENDEDOR.
```

Toda comision debe dejar margen suficiente para recuperar entrega, soporte,
herramientas, mantenimiento, impuestos, riesgo de cancelacion y tiempo de
operacion. Si no se puede recuperar, no se aprueba comision especial.

## CRM y vendedores

Notion es la fuente oficial para vendedores.

Todo lead debe tener:

- `vendedor_origen`;
- `responsable_actual`;
- estado pipeline;
- producto sugerido;
- ultimo contacto;
- proximo seguimiento;
- monto cobrado si gano;
- comision calculada si gano;
- estado de comision;
- datos completos.

Regla:

```text
SIN DATOS COMPLETOS, NO HAY COMISION APROBADA.
```

## Checks recomendados

Segun el tipo de cambio:

| Cambio | Validacion |
|---|---|
| Markdown/docs | `rg` de terminos clave y secretos |
| PDF | extraer texto con `pypdf`; render visual si hay Poppler |
| HTML slides | contar slides, buscar textos clave, abrir en navegador si herramienta disponible |
| Node/scripts | `npm run`, comando especifico, dry run si existe |
| VPS/deploy | healthcheck remoto despues de deploy |
| Notion | fetch/update o reportar `Auth required` si falla |

## Cierre obligatorio

Al terminar reportar:

- que se hizo;
- archivos tocados;
- checks ejecutados;
- resultado de cada check;
- limitaciones;
- si hubo o no git;
- proximos pasos.

Si `git status` falla porque no es repo Git, reportarlo sin inventar diff.
