# CRM Prospecting

## Objetivo
Ayudar a ONIA a encontrar prospectos, calificarlos, preparar mensajes y mantener seguimiento comercial ordenado.

## Comandos
- `Busca prospectos ONIA: <industria> | <ubicacion>`
- `Guarda prospecto: <datos>`
- `Resumen CRM ONIA`
- `Seguimientos ONIA hoy`
- `Prepara mensaje prospecto: <empresa>`

## Reglas
- Usar solo informacion publica.
- Cada prospecto debe incluir fuente.
- No inventar contactos.
- No hacer spam.
- Priorizar empresas con senales claras de oportunidad.

## Senales de oportunidad
- Web inexistente o desactualizada.
- Redes activas pero sin embudo claro.
- Formularios pobres o sin seguimiento.
- Agenda manual.
- Alto volumen de consultas.
- Necesidad visible de automatizacion, CRM o IA.

## Salida esperada
Para cada prospecto:
- Empresa.
- Industria.
- Ubicacion.
- Fuente.
- Contacto publico.
- Dolor probable.
- Oferta ONIA recomendada.
- Prioridad.
- Siguiente accion.

## CRM
Notion es la fuente oficial para prospectos, clientes, estados, notas, seguimientos y comisiones.

Usar como esquema:

- `NOTION_VENDOR_CRM_SCHEMA_2026.md`

El CSV queda solo como respaldo o importacion inicial.

Regla:

```text
SIN DATOS COMPLETOS, NO HAY COMISION APROBADA.
```

## Propiedad del lead

Cada prospecto debe tener dos responsables:

- `vendedor_origen`: quien consiguio el prospecto.
- `responsable_actual`: quien debe hacer el proximo seguimiento.

Reglas:

- Si el lead compra, cobra comision el vendedor_origen de esa venta.
- Despues del primer pago, el cliente pasa a ONIA para soporte y operacion.
- El vendedor no cobra mensualidades futuras por defecto.
- Si vende un upsell, cross-sell, anualidad, web, video, conector o sistema adicional, cobra la comision de esa nueva venta.
- Si otro vendedor quiere trabajar el mismo cliente, debe existir reasignacion en CRM.

## Estados recomendados

- Nuevo
- Investigado
- Calificado
- Mensaje preparado
- Aprobado para contactar
- Contactado
- Respondio
- Requiere seguimiento
- Demo agendada
- Demo realizada
- Propuesta enviada
- Ganado
- Perdido
- No apto

## Campos minimos

- `lead_id`
- `empresa`
- `rubro`
- `ciudad`
- `contacto_publico`
- `fuente`
- `vendedor_origen`
- `responsable_actual`
- `estado_pipeline`
- `producto_sugerido`
- `ultimo_contacto`
- `proximo_seguimiento`
- `resultado_ultimo_contacto`
- `monto_cobrado`
- `comision_calculada`
- `comision_estado`
- `notas`

## WhatsApp ONIA y vendedores

El WhatsApp principal de ONIA debe funcionar como chatbot de entrada y calificacion, no como numero libre para todos los vendedores.

Flujo:

1. El chatbot recibe al prospecto.
2. Pregunta rubro, necesidad, ciudad y urgencia.
3. Crea o actualiza el lead en CRM.
4. Notifica a Sergio/Hermes por Telegram o Notion.
5. Se asigna `responsable_actual`.
6. El vendedor hace seguimiento humano desde canal autorizado.
7. Todo avance vuelve al CRM.

Reglas:

- No duplicar mensajes a un mismo cliente.
- No contactar un lead asignado a otro vendedor sin reasignacion.
- No prometer descuentos, WhatsApp automatico ni automatizaciones sensibles sin aprobacion.
- El chatbot califica y deriva; no cierra ventas complejas.
