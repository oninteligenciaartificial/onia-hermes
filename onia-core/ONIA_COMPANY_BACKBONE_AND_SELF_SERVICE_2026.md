# Onia Company Backbone and Self-Service 2026

Fecha: 2026-07-03.
Estado: diseno canonico — columna vertebral comun de toda empresa, configurador
por empresa y venta self-service.
Owner: Onia / Hermes.
Contrato: `contract.json` v0.4.0 (`communication_channel`, capability
`channels`, canal `email_shared`, seccion `channels` del owner_dashboard).

## 1. La columna vertebral (lo global de TODA empresa)

El problema real (caso Bolivian Electric): mensajes llegando a correos
distintos de la empresa, cada uno leido por una persona diferente, sin
registro comun. Resultado: malentendidos, clientes sin responder, ventas
perdidas y peleas internas por "a mi nadie me aviso".

La columna vertebral que ONIA Core garantiza a cualquier empresa, de
cualquier rubro:

```text
1. CANALES     Todos los canales oficiales registrados (correos, WhatsApp,
               telefonos, formularios) con area duena y regla de ruteo.
               -> CommunicationChannel (nuevo en v0.4.0)
2. ENTRADA     Todo mensaje entra por intake normalizado; mensaje por canal
               no registrado = alerta de gobernanza.
               -> intakePolicy
3. PENDIENTES  Todo lo que hay que hacer es un WorkItem con dueno, prioridad
               y vencimiento. Nada vive "en el correo de alguien".
4. PERSONAS    Quien es quien: miembros, roles finos, permisos por area.
               -> Member + RoleAssignment
5. RELACIONES  Con quien trabajamos: partners y contactos con historial.
               -> BusinessPartner + Contact
6. EVIDENCIA   Que paso: comentarios, documentos, actividad auditada.
               -> Comment + Document + ActivityEvent
7. DECISION    Que requiere aprobacion y quien decide.
               -> ApprovalRequest
8. TIEMPO      Citas, vencimientos, seguimientos.
               -> ScheduleEvent
9. PANEL       El dueno ve todo lo anterior en una pantalla.
               -> owner_dashboard (incluye seccion "canales y mensajes sin dueno")
10. DATOS      Importacion validada, exportacion, respaldo.
               -> ImportBatch
```

Pitch comercial de la columna (para cualquier rubro):

> "Ningun mensaje de tu empresa vuelve a quedar sin responsable. Todo lo que
> entra por cualquier correo, WhatsApp o telefono de tu negocio se convierte
> en un pendiente con dueno, y vos lo ves en una sola pantalla."

### Como se resuelve el caso multi-correo (aplicable a BE ya)

1. Registrar cada correo oficial como `CommunicationChannel` (ventas@,
   info@, gerencia@, sucursal-scz@...) con `routedAreaId` y regla
   (`round_robin` para ventas, `fixed_owner` para gerencia).
2. Conector de correo (n8n IMAP/Gmail trigger — ya disponible en el n8n del
   VPS) -> intake normalizado -> WorkItem `mensaje_correo` con dueno asignado.
3. Dedupe 24h por contacto+canal (misma consulta a 2 correos = 1 pendiente).
4. Panel del dueno, seccion canales: mensajes sin responder, canales sin
   actividad, mensajes llegando por canales no registrados.

## 2. Configurador por empresa (lo diferente de CADA empresa)

Cada empresa agrega sobre la columna sus secciones propias. BE: materiales
electricos, tableros, voltajes de cable, cotizaciones tecnicas. Una clinica:
pacientes y tratamientos. El core NO se toca; se configura:

| Capa de configuracion | Mecanismo (ya en contrato) | Ejemplo BE |
|---|---|---|
| Vocabulario | `WorkItem.type`, `BusinessPartner.partnerType` | cotizacion_tablero, cliente_constructora |
| Catalogo/dominio | modulo vertical (fuera del core) | catalogo de materiales con voltajes/calibres |
| Rutinas | `ProcessChecklist` | checklist de cotizacion tecnica |
| KPIs del dueno | `SavedView` + verticalExtensions | pipeline por sucursal, cotizaciones vencidas |
| Canales | `CommunicationChannel` | 3 sucursales x correos + WhatsApp vendedores |
| Formularios de entrada | intake `web_form` con campos del rubro | formulario "pedi tu cotizacion" |

### Cuestionario de configuracion (onboarding de cualquier empresa)

Con 7 preguntas se configura el 80%:

1. Que canales oficiales tiene tu empresa? (correos, WhatsApp, telefonos)
2. Que areas/sucursales existen y quien manda en cada una?
3. Que tipos de pedido/consulta recibis? (-> tipos de WorkItem)
4. Con quien trabajas? (clientes empresa, proveedores -> partner types)
5. Que aprueba solo el dueno? (-> ApprovalRequest rules)
6. Que numeros queres ver cada manana? (-> SavedViews del panel)
7. Que datos hay que importar para arrancar? (-> ImportBatch)

Este cuestionario ES el producto de onboarding: se cobra como implementacion
(carga guiada) o se automatiza como wizard self-service.

## 3. Venta self-service (local + SaaS comprable via Google)

### Embudo por vertical

```text
Google (SEO + Ads por dolor de rubro)
  -> Landing del vertical (web-factory: 1 landing por rubro)
  -> Demo con datos del rubro (org demo pre-cargada)
  -> Trial o compra directa (pasarela) / o "hable con ONIA" (implementacion)
  -> Wizard de onboarding (cuestionario de 7 preguntas + ImportBatch)
  -> Cliente operando
```

### Piezas y estado

| Pieza | Estado | Accion |
|---|---|---|
| Landing por vertical | web-factory ya produce landings | crear landing DentalGest + ProveeGest con keywords de dolor ("sistema para clinica dental Bolivia", "sistema de cotizaciones para importadoras") |
| Checkout automatico | pasarela BCP documentada (`BCP_PASARELA_CREDENCIALES_INTERNO.md`); DentaGest ya tiene SubscriptionPayment + QR | activar pago QR/pasarela en el registro |
| Trial | DentaGest ya tiene trialStart/trialEnd | estandarizar 14 dias en todos los verticales |
| Wizard onboarding | no existe | construirlo sobre el cuestionario (Sprint 4 del plan DentalGest) |
| Org demo por rubro | parcial (datos demo DentalGest) | 1 org demo por vertical para la landing |
| SEO/Ads | no activo | empezar organico (blog por dolor de rubro) + Ads con presupuesto chico cuando el checkout este activo |

### Dos modos de venta (mismo producto)

| Modo | Para quien | Precio | Canal |
|---|---|---|---|
| SaaS self-service | negocio chico que llega por Google | precio de lista mensual, sin humanos | landing + checkout + wizard |
| Implementacion + SaaS | empresa mediana (tipo BE) | setup pagado + mensual | vendedor/consultoria, cuestionario guiado |

Regla: el self-service NO se abre para un vertical hasta que ese vertical
tenga 1 caso de exito operando (regla de la vertical factory).

## 4. Orden de ejecucion

1. Sprint 1-2 DentalGest (core en producto) — en curso.
2. Conector email->intake en n8n (piloto con Onia misma, luego BE).
3. Landing + checkout DentalGest (self-service piloto).
4. Wizard onboarding (cuestionario 7 preguntas).
5. Replicar para ProveeGest con BE como caso de exito.
