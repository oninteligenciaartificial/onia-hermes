# CRM and Prospecting - ONIA + Hermes

## Objetivo
Convertir Hermes en asistente de prospeccion y CRM para ONIA, usando fuentes publicas, seguimiento ordenado y registros en Notion.

La fuente oficial para vendedores debe ser Notion. Usar:

- `NOTION_VENDOR_CRM_SCHEMA_2026.md`

El CSV queda solo como respaldo o importacion inicial, no como CRM principal.

Para ofertas de contenido con IA y videos generados con Higgsfield, usar tambien:

- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`

Para decidir que proyecto/oferta vender en cada caso, usar:

- `PROJECTS_ORCHESTRATION.md`
- `hermes-content/references/onia-projects-registry.json`

## Alcance
- Buscar prospectos por industria y ubicacion.
- Calificar oportunidades.
- Preparar mensajes personalizados.
- Registrar prospectos, clientes, interacciones y proximos pasos.
- Resumir pipeline comercial.

## Fuentes permitidas
- Sitio web oficial.
- Google Business/Profile publico.
- Instagram, Facebook, LinkedIn o TikTok publicos.
- Directorios empresariales publicos.
- Noticias o paginas institucionales.

## Datos permitidos
- Nombre de empresa.
- Rubro.
- Ciudad.
- URL publica.
- Contacto publico visible.
- Senal de oportunidad.
- Estado comercial.
- Proximo seguimiento.

## Datos que no se deben inventar
- Emails.
- Telefonos.
- Nombres de responsables.
- Tamano de empresa.
- Presupuesto.
- Intencion de compra.

## Pipeline recomendado
- Nuevo
- Investigado
- Calificado
- Mensaje preparado
- Aprobado para contactar
- Contactado
- Respondio
- Demo
- Propuesta enviada
- Ganado
- Perdido
- No apto

## Propiedad del lead y del cliente

Cada prospecto debe tener un responsable visible.

Regla simple:

- Quien consigue el lead queda como `vendedor_origen`.
- Quien hace seguimiento queda como `responsable_actual`.
- Si el lead compra, el vendedor de origen cobra la comision de esa venta.
- Despues del primer pago, el cliente pasa a ONIA para soporte, entrega y operacion.
- El vendedor puede seguir ayudando, pero no cobra mensualidades futuras por defecto.
- Si el mismo vendedor vende un upsell, cross-sell, anualidad, web, video, conector o sistema adicional, cobra la comision de esa nueva venta.

Ejemplo:

| Caso | Que pasa |
|---|---|
| Vendedor consigue una clinica y vende DentalGest Pro mensual | Cobra Bs. 295 una sola vez |
| La clinica paga el segundo mes | No hay nueva comision; queda para ONIA |
| El vendedor luego vende una Web Pro IA a la misma clinica | Cobra Bs. 708 por esa nueva venta |
| Otro vendedor quiere trabajar el mismo cliente | Necesita reasignacion aprobada en CRM |

## Campos minimos de control comercial

Usar estos campos en Notion, CSV o planilla:

| Campo | Uso |
|---|---|
| `lead_id` | Codigo unico del prospecto |
| `empresa` | Nombre del negocio |
| `rubro` | Dental, estetica, restaurante, etc. |
| `ciudad` | Ciudad del prospecto |
| `contacto_publico` | Telefono, IG, web, correo o LinkedIn publico |
| `fuente` | De donde salio el dato |
| `vendedor_origen` | Quien consiguio el prospecto |
| `responsable_actual` | Quien debe darle seguimiento hoy |
| `estado_pipeline` | Estado actual |
| `producto_sugerido` | Oferta principal |
| `ultimo_contacto` | Fecha del ultimo mensaje/llamada |
| `proximo_seguimiento` | Fecha del siguiente paso |
| `resultado_ultimo_contacto` | No respondio, interesado, demo, etc. |
| `monto_cobrado` | Monto real pagado por el cliente |
| `comision_calculada` | Premio del vendedor |
| `comision_estado` | Pendiente, aprobada, pagada, retenida, descontada |
| `notas` | Dolor, objecion o contexto |

## Como hablan los vendedores con clientes

El numero principal de WhatsApp de ONIA puede funcionar como chatbot y recepcion.
Ese numero no debe ser usado libremente por todos los vendedores.

Flujo recomendado:

1. El vendedor busca o recibe prospectos.
2. El vendedor registra el prospecto con `vendedor_origen`.
3. Si el contacto es frio, el vendedor puede escribir manualmente desde su numero autorizado o cuenta asignada.
4. Si el prospecto entra por el WhatsApp de ONIA, el chatbot pregunta rubro, necesidad y ciudad.
5. El chatbot crea o actualiza el lead en CRM.
6. Hermes/n8n avisa por Telegram o Notion: nuevo lead, producto probable y responsable sugerido.
7. Sergio o ONIA asigna responsable si no esta claro.
8. El vendedor toma la conversacion humana desde su canal autorizado o se agenda llamada.
9. Todo seguimiento vuelve al CRM: fecha, estado y proximo paso.

Canales permitidos:

| Canal | Uso |
|---|---|
| WhatsApp ONIA chatbot | Recibir, calificar y derivar |
| WhatsApp vendedor autorizado | Seguimiento manual y conversacion humana |
| Instagram ONIA | Responder inbound y derivar con control |
| Instagram vendedor | Prospeccion manual si ONIA lo aprueba |
| Telegram interno | Avisos, asignaciones y aprobaciones |
| Notion CRM | Registro oficial del estado |

Regla importante:

- El cliente no debe recibir mensajes duplicados de varios vendedores.
- Si un cliente ya tiene responsable, nadie mas lo contacta sin reasignacion.
- El chatbot no cierra ventas complejas; califica y deriva.
- Las propuestas, descuentos y automatizaciones sensibles requieren aprobacion de ONIA.

## Oferta segun rubro

| Senal | Oferta primaria | Oferta secundaria | CTA |
|---|---|---|---|
| Clinica dental | DentalGest | landing dental + contenido Higgsfield | "Te muestro una demo corta." |
| Empresa con Excel/reportes/tareas | Gesti-OS | automatizacion n8n + dashboard | "Te muestro tu operacion en un tablero." |
| Negocio sin web clara | Pagina web ONIA | CRM simple + contenido de lanzamiento | "Te hago una auditoria rapida de captacion." |
| Negocio publica poco | Marketing con Higgsfield | landing + seguimiento | "Te preparo 3 ideas de videos para vender mejor." |
| Prospecto aun ambiguo | Auditoria ONIA | recomendacion personalizada | "Te comparto 2 mejoras puntuales." |

## Campos CRM en Notion
Ver el esquema completo en `NOTION_VENDOR_CRM_SCHEMA_2026.md`.

Campos minimos:

- Empresa
- Tipo: prospecto, cliente, aliado, proveedor
- Industria
- Ciudad
- Pais
- Web
- Perfil publico
- Contacto publico
- Fuente
- Senal de oportunidad
- Dolor probable
- Oferta ONIA recomendada
- Prioridad: alta, media, baja
- Estado pipeline
- Ultimo contacto
- Proximo seguimiento
- Responsable
- Notas

Regla de control:

```text
SIN DATOS COMPLETOS, NO HAY COMISION APROBADA.
```

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
- Cada recomendacion debe explicar por que esa empresa podria necesitar ONIA.
- El mensaje sugerido debe ser breve, consultivo y personalizado.
