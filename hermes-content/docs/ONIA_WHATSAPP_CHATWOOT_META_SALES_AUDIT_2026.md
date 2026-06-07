# ONIA WhatsApp, Chatwoot, Meta y ventas - Auditoria 2026

Fecha: 2026-06-02

## Decision ejecutiva

ONIA debe operar con un solo numero oficial de marca para entrada de clientes, confianza y continuidad comercial.

No conviene comprar un segundo numero oficial ahora.

La separacion correcta no es necesariamente por numero, sino por funcion:

- WhatsApp oficial ONIA: recepcion, marca, inbound, calificacion, agenda y seguimiento.
- Chatwoot: bandeja multiagente cuando Cloud API este habilitada.
- Notion CRM: fuente de verdad para lead, vendedor origen, responsable actual, estado y comision.
- n8n: automatizacion interna, alertas, CRM, recordatorios, postventa y tareas.
- Vendedor: cierre humano, demo, negociacion y seguimiento autorizado.

Excepcion: si ONIA hara prospeccion fria agresiva o entrenamiento de vendedores, conviene tener un numero/canal de prospeccion separado como sandbox operativo. Ese numero no debe presentarse como el WhatsApp oficial de ONIA ni mezclar historial con clientes inbound.

## Estado actual verificado

Fuentes locales de Hermes y Notion confirman:

- ONIA todavia no debe prometer ni activar WhatsApp automatico client-facing hasta verificacion Meta.
- El WhatsApp principal de ONIA no debe ser un numero libre para todos los vendedores.
- Notion debe ser la fuente oficial para vendedores, estados, seguimientos y comisiones.
- Todo lead debe tener `vendedor_origen`, `responsable_actual`, estado pipeline, proximo seguimiento y datos completos.
- n8n no tiene todavia workflow activo para WhatsApp/Chatwoot ONIA.

Fuentes revisadas:

- `CRM_AND_PROSPECTING.md`
- `hermes-content/docs/CRM_PROSPECTING.md`
- `hermes-content/skills/crm-prospeccion-onia.md`
- `NOTION_VENDOR_CRM_SCHEMA_2026.md`
- Notion: `CRM & Contactos`
- n8n: busqueda de workflows WhatsApp/Chatwoot/CRM ONIA
- documentacion actual de Meta/WhatsApp y Chatwoot

## Respuesta a los puntos auditados

### 1. Un numero o dos numeros

Recomendacion:

Usar un unico numero oficial de ONIA para inbound y marca. No comprar segundo numero oficial ahora.

Usar dos numeros solo si aparece uno de estos casos:

| Situacion | Decision |
|---|---|
| Equipo pequeno, marca en construccion, bajo volumen | Un numero oficial |
| Ventas inbound desde web, Instagram, referidos y ads | Un numero oficial con CRM |
| Vendedores necesitan prospectar en frio con volumen alto | Numero separado de prospeccion |
| Riesgo de spam, bloqueo o mala calidad por mensajes frios | Separar prospeccion del numero oficial |
| Meta no permite coexistencia para la configuracion real | Evaluar numero piloto antes de migrar oficial |
| Soporte postventa crece y ventas se vuelve caotico | Separar por inbox/equipo primero, numero despues |

Lectura final:

Un solo numero oficial es mejor para confianza y continuidad. Dos numeros solo se justifican para proteger reputacion, pruebas o prospeccion fria.

### 2. Limitaciones de coexistencia WhatsApp Business App + Cloud API

Meta ya tiene escenarios de coexistencia por Embedded Signup para conectar un numero existente de WhatsApp Business App a Cloud API y conservar uso uno-a-uno desde la app. Pero no debe asumirse como garantizado hasta probarlo en la cuenta real de ONIA.

Limitaciones clave:

- Requiere flujo de Embedded Signup compatible.
- Requiere que el pais/codigo del numero sea soportado.
- Requiere app/partner/proveedor compatible con coexistencia.
- Requiere webhooks capaces de recibir eventos correctamente.
- Puede tener limites de throughput para numeros en coexistencia.
- Los mensajes por API tienen reglas, costos y ventanas distintas a la app.
- La disponibilidad real puede depender de cuenta, proveedor, pais, WABA, Business Manager y estado de verificacion.
- Chatwoot Cloud puede conectar WhatsApp Cloud API por Embedded Signup, pero la prueba real debe hacerse con la cuenta de ONIA cuando exista NIT/verificacion.

Regla ONIA:

No vender "coexistencia garantizada". Venderlo como fase tecnica verificable despues del NIT.

### 3. Flujo optimo Chatwoot + n8n

Arquitectura recomendada:

```text
Web / Instagram / Facebook Ads / Referidos
  -> WhatsApp oficial ONIA
  -> Chatwoot Cloud inbox WhatsApp
  -> AgentBot / n8n clasifica solo si bot_allowed=true
  -> Notion CRM crea o actualiza lead
  -> Si hay intencion de compra: handoff humano
  -> Chatwoot asigna vendedor/equipo
  -> Vendedor cierra
  -> n8n ejecuta seguimiento, tareas, recordatorios y postventa
```

Estados Chatwoot recomendados:

- `pending`: bot o calificacion inicial.
- `open`: humano debe responder.
- `snoozed`: seguimiento futuro.
- `resolved`: cerrado o sin accion inmediata.

Labels recomendados:

- `source_web`
- `source_instagram`
- `source_facebook_ads`
- `source_referido`
- `intent_demo`
- `intent_precio`
- `intent_soporte`
- `lead_calificado`
- `handoff_humano`
- `bot_pausado`
- `cliente_ganado`

Atributos recomendados:

- `lead_id`
- `vendedor_origen`
- `responsable_actual`
- `producto_interes`
- `ciudad`
- `rubro`
- `urgencia`
- `presupuesto_rango`
- `next_follow_up_at`
- `bot_allowed`
- `crm_status`
- `consentimiento_contacto`

### 4. Arquitectura de agencias similares

La arquitectura comun de agencias con ventas humanas y automatizacion es:

- Numero o canal oficial de marca para entrada.
- Inbox centralizado con asignaciones.
- CRM como fuente de verdad.
- Bot solo para primera capa y seguimiento simple.
- Humanos para venta, objeciones, propuesta y cierre.
- Automatizaciones internas para que el equipo no olvide nada.

En ONIA, la version correcta es:

- Chatwoot no reemplaza CRM.
- Notion no reemplaza inbox.
- n8n no reemplaza vendedor.
- Bot no reemplaza cierre.

Cada herramienta debe hacer una parte.

### 5. Riesgos al migrar numero WhatsApp Business a Cloud API

Riesgos principales:

- Interrupcion temporal de atencion si la migracion falla.
- Confusion entre app, Cloud API, WABA y Business Manager.
- Restricciones por nombre comercial, verificacion o documentos.
- Necesidad de plantillas aprobadas para iniciar conversaciones fuera de ventana.
- Costos por mensajes API.
- Calidad del numero afectada si se hace outreach masivo.
- Historial y sincronizacion dependen del tipo de onboarding/coexistencia.
- Vendedores pierden acceso directo por dispositivos vinculados si se migra sin coexistencia.
- Dependencia de Chatwoot/proveedor para operacion diaria.

Mitigacion:

1. Formalizar empresa y verificar Meta.
2. Probar con numero piloto si es posible.
3. Documentar rollback antes de tocar el numero oficial.
4. Crear plantillas minimas antes de migrar.
5. Definir horarios, responsables y SLA.
6. Migrar solo cuando Chatwoot, Notion y n8n esten listos.

### 6. Como evitar que vendedores interfieran con el chatbot

Reglas operativas:

- Ningun vendedor responde desde el telefono fisico del numero oficial una vez que Chatwoot este activo.
- Toda conversacion debe tener un solo `responsable_actual`.
- Bot solo responde si `bot_allowed=true`, estado `pending` y no hay humano asignado.
- Cuando hay handoff, n8n/Chatwoot debe marcar `bot_pausado`.
- Si el humano escribe, el bot deja de responder salvo comandos internos.
- Notas internas obligatorias antes de reasignar.
- No hay descuentos, promesas tecnicas ni cambios de propuesta sin aprobacion.

Regla simple para el equipo:

```text
Bot califica. Vendedor cierra. CRM manda.
```

### 7. CRM y estructura de ventas para escalar

Fase inicial:

Usar Notion como CRM oficial, porque ya esta confirmado en Hermes y reduce costo.

Campos minimos:

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

Pipeline recomendado:

- Nuevo
- Investigado
- Calificado
- Mensaje preparado
- Aprobado para contactar
- Contactado
- Respondio
- Demo agendada
- Demo realizada
- Propuesta enviada
- Ganado
- Perdido
- No apto

Cuando escale:

- Mantener Chatwoot como inbox.
- Mantener Notion si el volumen sigue manejable.
- Migrar a HubSpot/Pipedrive solo si aparecen reportes, forecasting, multiples vendedores y volumen que Notion ya no soporte.

### 8. Mejor practica 2026 para WhatsApp + IA + ventas humanas

La mejor practica actual no es un chatbot libre tipo asistente general.

La mejor practica es IA de negocio con alcance limitado:

- clasificar intencion;
- pedir datos minimos;
- responder FAQs aprobadas;
- agendar;
- crear o actualizar CRM;
- resumir conversacion;
- proponer siguiente accion;
- alertar a vendedores;
- hacer seguimiento con plantillas aprobadas;
- escalar a humano cuando hay compra, objecion, precio o excepcion.

Para ONIA:

```text
IA como copiloto operativo, no como vendedor autonomo.
```

Esto tambien protege reputacion, cumplimiento y calidad del numero.

## Fases recomendadas

### Fase 1 - Ahora

Objetivo: vender ya sin esperar Meta.

- Usar WhatsApp Business manual del numero oficial ONIA.
- Completar perfil empresarial.
- Crear catalogo o lista simple de servicios.
- Crear respuestas rapidas.
- Vincular maximo los dispositivos necesarios.
- Registrar todo lead en Notion.
- Definir vendedor origen y responsable actual.
- No automatizar WhatsApp client-facing.
- No hacer spam.

Accion comercial inmediata:

- Vendedores pueden prospectar por Instagram, LinkedIn, email o numero autorizado.
- WhatsApp oficial se usa con cuidado para inbound, referidos y conversaciones aprobadas.

### Fase 2 - Cuando salga el NIT

Objetivo: preparar operacion formal.

- Completar Business Manager.
- Verificar negocio en Meta.
- Revisar elegibilidad de WhatsApp Cloud API.
- Probar Embedded Signup con Chatwoot Cloud.
- Confirmar si coexistencia aplica al numero ONIA.
- Crear plantillas WhatsApp basicas.
- Definir politicas de datos, acceso y roles.

### Fase 3 - Chatwoot + n8n + CRM

Objetivo: centralizar atencion y no perder leads.

- Crear inbox WhatsApp Cloud API en Chatwoot.
- Crear equipos: Ventas, Soporte, Sergio/Admin.
- Crear labels, atributos y reglas.
- Conectar webhooks Chatwoot -> n8n.
- n8n crea/actualiza Notion CRM.
- n8n avisa por Telegram.
- n8n agenda seguimientos.

### Fase 4 - IA controlada

Objetivo: mejorar velocidad sin perder control.

- Bot de calificacion.
- Resumen automatico para vendedor.
- Recomendacion de oferta ONIA.
- Handoff humano.
- Seguimientos internos.
- Postventa y onboarding.

## Decision final para ONIA

Recomendacion aprobable:

1. Mantener un unico numero oficial ONIA.
2. No comprar segundo numero oficial por ahora.
3. Empezar ventas manuales hoy.
4. Registrar todo en Notion.
5. No activar WhatsApp automatico hasta NIT/verificacion Meta.
6. Cuando Meta este listo, probar Chatwoot Cloud + Cloud API.
7. Migrar el numero oficial solo con plan de prueba, handoff y rollback.
8. Si los vendedores haran prospeccion fria fuerte, crear un numero/canal de prospeccion separado y no mezclarlo con el numero oficial.

## Notion preparado

Fecha de preparacion: 2026-06-02

Se adapto la base existente `CRM & Contactos`, data source `collection://9b4c77be-d02b-4840-8f91-827ec8007839`, en vez de crear una base duplicada.

Campos agregados:

- control comercial: `Lead ID`, `Rubro`, `Ciudad`, `Pais`, `Web / perfil publico`, `Contacto publico`, `Canal principal`, `Fuente`, `Permiso de contacto`, `Vendedor origen`, `Responsable actual`;
- pipeline: `Estado pipeline`, `Producto sugerido`, `Prioridad`, `Dolor probable`, `Resultado ultimo contacto`, `Mensaje enviado`;
- cierre y comisiones: `Monto cobrado`, `Servicio vendido`, `Comision calculada`, `Estado comision`, `Fecha pago comision`, `Datos completos`;
- seguridad comercial: `No contactar`;
- WhatsApp/Chatwoot/IA: `Chatwoot conversation ID`, `Bot permitido`, `Bot pausado`, `WhatsApp etapa`.

Vistas creadas:

- `ONIA - Control principal`
- `ONIA - Pipeline ventas`
- `ONIA - Seguimientos`
- `ONIA - Aprobacion contacto`
- `ONIA - Comisiones pendientes`
- `ONIA - Datos incompletos`
- `ONIA - WhatsApp Chatwoot`
- `ONIA - Tiziana`
- `ONIA - Irene`
- `ONIA - Arthur`

Limpieza aplicada:

- la vista principal dejo de mostrar todas las columnas y ahora muestra solo los campos comerciales importantes;
- las vistas por vendedor filtran por `Responsable actual`;
- no se eliminaron columnas ni registros reales porque "basura" debe definirse con precision antes de borrar datos de Notion.

Regla de uso:

```text
SIN DATOS COMPLETOS, NO HAY COMISION APROBADA.
```

## Fuentes externas revisadas

- Meta/WhatsApp Cloud API overview: https://developers.facebook.com/docs/whatsapp/cloud-api/
- Meta/WhatsApp Embedded Signup: https://developers.facebook.com/docs/whatsapp/embedded-signup/
- Meta/WhatsApp Business app onboarding/coexistence mirror de documentacion: https://support2.chatarchitect.com/books/meta-whatsapp/page/onboarding-whatsapp-business-app-users-aka-coexistence-developer-documentation
- Chatwoot WhatsApp Embedded Signup: https://www.chatwoot.com/hc/user-guide/articles/1752129193-how-to-use-whatsapp-embedded-signup
- Chatwoot Agent Bots: https://www.chatwoot.com/hc/user-guide/articles/1677497472-how-to-use-agent-bots
- Chatwoot Webhooks: https://www.chatwoot.com/docs/product/others/webhook-events
- Chatwoot WhatsApp templates: https://www.chatwoot.com/hc/user-guide/articles/1754940076-whatsapp-templates

Nota: la documentacion de coexistencia de Meta debe verificarse en el flujo real de ONIA cuando exista NIT/verificacion. No convertir esta posibilidad en promesa comercial hasta probarla.
