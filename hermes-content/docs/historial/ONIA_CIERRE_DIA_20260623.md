> ⚠️ **SUPERADO.** El estado vigente esta en `hermes-content/docs/ONIA_ESTADO_REAL_20260813.md`
> y la apuesta vigente en `docs/platform/ONIA_DECISION_SAAS_CONSULTORIA_20260813.md`.
> Este documento se conserva como historia: NO tomes decisiones con el.

# Onia cierre de dia - 2026-06-23

## Operativo validado hoy

| Frente | Estado | Evidencia |
|---|---|---|
| Onia Center | Operativo a nivel codigo/build | `npm run validate:onia-center` paso. `npm run build` paso en `web-factory/apps/site`. |
| Dashboard/operacion Onia Center | Listo para seguir usando en local/desarrollo | El build incluye `/onia-center`, `/vendedores` y rutas Nuvia. |
| Modelo operativo Onia Center | Listo en repo | Validacion reporto servicios, operacion, ideas/accesos y calendario Sergio. |
| Onia Motor Local Growth | Servicio prioritario cargado | Validacion confirma setup Bs. 2.900, mensualidad Bs. 1.900, Fondo Onia 40%. |
| Calendario Sergio privado | Listo en codigo y migraciones | Validacion confirma 4 tablas privadas del calendario. |
| AlfredHQ / Telegram personal | Listo en repo | Comandos personales y modo Higgsfield silencioso quedaron documentados y en router local. |
| Propuesta de gastos Bs. 15.000 | Lista y subida | Markdown y PDF actualizados como lista literal de gastos. |
| Nuvia catalogo visual | Regenerado y validado tecnicamente | 316 cutouts regenerados en dos carpetas canonicas; 632 PNG verificados sin corrupcion. |
| Generador cutouts Nuvia | Mejorado | Script compila con `py_compile`; mejora mascara, candidatos de fuente y sobrescritura controlada. |

## Operativo segun estado ya documentado, no re-auditado hoy

| Frente | Estado conocido | Pendiente para confirmar actual |
|---|---|---|
| Supabase self-hosted VPS | Existe privado en `/opt/onia-supabase/supabase/docker` segun manifiesto | Requiere correr `npm run audit:selfhosted` con `VPS_HOST`, `VPS_USER`, `VPS_KEY_PATH`. |
| Uptime Kuma, Open WebUI, Stirling PDF, LiteLLM | Documentados como healthy al 2026-06-19 | Re-auditar VPS antes de decir que siguen activos hoy. |
| n8n VPS | Documentado como activo | Revisar workflow real para asegurar que no siga el schedule viejo de Higgsfield. |

## Pendiente

| Pendiente | Prioridad | Motivo |
|---|---|---|
| Aplicar migraciones Onia Center en Supabase real | Alta | El repo esta listo, pero la base productiva debe recibir schema/seed/RLS. |
| Reimportar o actualizar workflow n8n programado | Alta | El repo ya cambio Higgsfield a manual/silencioso; falta confirmar n8n vivo. |
| Activar auth/roles reales para equipo | Alta | Arthur/vendedores no deben ver capital, deuda ni estrategia privada. |
| Conectar Onia Center a datos reales de Supabase | Alta | Hoy compila y valida estructura; falta operacion con DB real y usuarios. |
| Backups del servidor local/self-hosted | Alta | No mover datos criticos sin backup diario y copia externa. |
| Revisar visualmente cutouts Nuvia por lote | Media | Los PNG no estan corruptos, pero falta QA visual de calidad comercial. |
| Confirmar costos proveedor Nuvia | Alta | No comprar inventario ni prometer margen sin costo real. |
| Decidir VPS vs servidor local por 30 dias | Media | Hay ahorro local, pero el acceso externo y webhooks necesitan estabilidad. |
| Vercel/envs de produccion | Media | No exponer panel sin variables, auth y RLS revisados. |

## Validaciones ejecutadas

| Comando | Resultado |
|---|---|
| `npm run validate:onia-center` | Paso |
| `npm run build` en `web-factory/apps/site` | Paso |
| `py_compile web-factory/harvester/product/create_nuvia_product_cutouts.py` | Paso |
| Scan de secretos en script modificado | Sin hallazgos |
| Verificacion PNG con PIL | 632 PNG revisados, 0 corruptos |

## Git

| Punto | Estado |
|---|---|
| Cambios locales antes del cierre | 632 PNG Nuvia + script cutouts + este cierre |
| Archivos sensibles detectados | Ninguno en el cambio textual revisado |
| Accion requerida | Commit y push a `main` |
