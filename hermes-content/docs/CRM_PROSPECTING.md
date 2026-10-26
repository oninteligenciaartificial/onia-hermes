# CRM Prospecting

## Objetivo
Ayudar a Onia a encontrar prospectos, calificarlos, preparar mensajes y mantener seguimiento comercial ordenado.

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

## Fuente de prospectos con señal dura (2026-08)

**Meta Ad Library vía Ads MCP** (`ads_library_search` con `countries=['BO']`,
`ad_active_status='ACTIVE'`) devuelve negocios que **están pagando pauta hoy** — presupuesto
existente, medición existente, dolor existente. Es la mejor señal disponible y es gratis.

Lista viva: `historial/ONIA_PROSPECTOS_ADLIBRARY_20260806.md` (26 prospectos bolivianos calificados:
inmobiliarias, clínicas dentales, veterinarias y salud). Repetir la búsqueda por rubro; el
rubro gimnasios NO sirve por esta vía (se llena de infoproductos extranjeros).

## Senales de oportunidad
- **Paga ads "Chatea con nosotros" y responde a mano** (la más fuerte: ya compró el problema).
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
- Oferta Onia recomendada.
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
- Despues del primer pago, el cliente pasa a Onia para soporte y operacion.
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

## WhatsApp Onia y vendedores

El WhatsApp principal de Onia debe funcionar como chatbot de entrada y calificacion, no como numero libre para todos los vendedores.

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

## Oferta segun rubro

| Senal | Oferta primaria | Oferta secundaria | CTA |
|---|---|---|---|
| Clinica dental | DentalGest | landing dental + contenido Higgsfield | "Te muestro una demo corta." |
| Empresa con Excel/reportes/tareas | Gesti-OS | automatizacion n8n + dashboard | "Te muestro tu operacion en un tablero." |
| Negocio sin web clara | Pagina web Onia | CRM simple + contenido de lanzamiento | "Te hago una auditoria rapida de captacion." |
| Negocio publica poco | Marketing con Higgsfield | landing + seguimiento | "Te preparo 3 ideas de videos para vender mejor." |
| Prospecto aun ambiguo | Auditoria Onia | recomendacion personalizada | "Te comparto 2 mejoras puntuales." |

## Comandos Hermes
- `Busca prospectos ONIA: <industria> | <ubicacion>`
- `Guarda prospecto: <datos>`
- `Resumen CRM ONIA`
- `Seguimientos ONIA hoy`
- `Prepara mensaje prospecto: <empresa>`
- `Crea UGC empresa: <negocio> | <oferta> | <audiencia> | <estilo>`
- `Orquesta ONIA: <empresa o rubro> | <objetivo>`
- `Prepara venta DentalGest: <clinica>`
- `Prepara venta Gestios: <empresa>`
- `Prepara venta Web ONIA: <negocio>`
- `Prepara marketing Higgsfield: <negocio> | <oferta>`

### Propuestas personalizadas (HTML slide deck)
- `Genera propuesta: <empresa> | <industria> | <necesidad>`
- `Crea presentación para: <empresa>`
- `Propuesta ONIA: <empresa> | <datos del cliente>`

Skill: `hermes-content/docs/historial/skills/genera-propuesta.md`
Script: `node scripts/genera-propuesta.js --empresa="X" --industria="Y" --necesidad="Z"`
Output: `hermes-content/propuestas/propuesta-<slug>.html`

Industrias reconocidas: dental, clinica, audiovisual, productora, arquitecto, constructora, retail, comercio, restaurant, pyme, servicio
Para refinar: re-ejecutar con `--productos="id1,id2"` y/o `--notas="feedback del cliente"`

### Análisis de llamadas (transcript → propuesta automática)
- `Analiza llamada: [texto transcripción]`
- `Transcripción llamada: [texto]`
- Adjuntar .txt con transcript

Skill: `hermes-content/docs/historial/skills/analiza-llamada.md`
Script: `node scripts/analiza-transcripcion.js <archivo.txt>`
Requiere: `ANTHROPIC_API_KEY`
Flujo completo: audio Telegram → Whisper → Claude Haiku extracción → genera-propuesta → HTML + resumen + próximos pasos

## Flujo n8n - Prospeccion semanal
1. Schedule Trigger semanal.
2. Cargar industria y ubicacion objetivo.
3. Pedir busqueda a Hermes.
4. Validar que cada prospecto tenga fuente.
5. Clasificar oferta con `onia-projects-registry.json`.
6. Enviar top 5 a Telegram.
7. Esperar aprobacion para contactar o investigar mas.
8. Crear o actualizar registros en CRM/Notion.

## Flujo n8n - Seguimientos diarios
1. Schedule Trigger diario.
2. Consultar Notion por seguimientos vencidos o de hoy.
3. Pedir a Hermes mensajes sugeridos.
4. Enviar lista por Telegram.
5. Registrar decision del usuario.

## Criterios de calidad
- Priorizar calidad sobre cantidad.
- No hacer spam.
- Cada recomendacion debe explicar por que esa empresa podria necesitar Onia.
- El mensaje sugerido debe ser breve, consultivo y personalizado.
