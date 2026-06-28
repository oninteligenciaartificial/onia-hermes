# Bolivian Electric - Caso real Meta, WhatsApp y Chatwoot

Fecha: 2026-06-27

## Resumen ejecutivo

Bolivian Electric esta en proceso de verificacion de negocio en Meta para poder avanzar hacia WhatsApp Cloud API, Chatwoot Cloud y automatizacion comercial con n8n.

La decision operativa para ONIA queda confirmada:

- usar un solo numero oficial de la marca;
- conservar el numero actual si Meta permite Embedded Signup/coexistencia;
- operar con Chatwoot Cloud dedicado para el cliente;
- usar n8n dedicado o backend del cliente para automatizaciones;
- dejar a los vendedores respondiendo desde la bandeja oficial, no desde numeros personales;
- no prometer precio, stock, credito, garantia o reclamos sin humano.

## Identidad de negocio

La empresa legal es `Bolivian Group S.R.L.`.

La marca comercial visible es `Bolivian Electric`.

La pagina principal del portfolio debe ser `Bolivian Electric Oficial`.

El sitio web correcto para Meta es `https://www.bolivianelectric.com.bo/`.

No usar perfiles personales como sitio web o identidad legal de la empresa.

## Mapeo legal Bolivia -> Meta

Para una S.R.L. boliviana, seleccionar en Meta `Empresa privada`.

Razon: Meta usa referencias tipo LLC. Una LLC es una empresa privada con responsabilidad limitada; una S.R.L. boliviana es el equivalente operativo mas cercano por responsabilidad limitada de socios.

Evitar:

- sociedad que cotiza en bolsa;
- sociedad unipersonal;
- institucion;
- categorias ambiguas si `Empresa privada` esta disponible.

## Lecciones del flujo de acceso

### Partner vs persona

La solicitud de partner entre portfolios puede crear loops si la relacion ya existe o si el asset no permite asignar socio directamente.

Ruta practica:

1. Intentar partner con Business ID de ONIA cuando se necesita control de agencia.
2. Si hay loop, aceptar la solicitud desde `Usuarios > Socios`.
3. Si no se puede asignar WABA como socio, revisar asset por asset.
4. Para recuperar una persona eliminada, agregarla desde `Usuarios > Personas` o desde el asset `Paginas > Personas`.

### Permisos minimos utiles

Para configurar WhatsApp API y marketing se necesita acceso al portfolio y a activos concretos:

- pagina de Facebook;
- cuenta de Instagram;
- cuenta publicitaria;
- WABA o cuenta de WhatsApp;
- phone numbers;
- templates;
- system users cuando toque token/API.

No basta aparecer como persona si no estan asignados los assets.

## Lecciones de verificacion Meta

El nombre del portfolio debe representar a la empresa legal, no a una persona administradora.

El correo de verificacion debe ser un correo real del dominio. No sirve ingresar solo `@dominio`.

Si Meta pide identidad personal, el documento debe ser de la persona logueada en Meta. La foto debe ser original, legible y al menos 1500 x 1000 px. No subir imagenes comprimidas por WhatsApp.

No guardar ni circular carnets, codigos, contrasenas ni tokens en chats o repos.

## Arquitectura recomendada post aprobacion

```text
WhatsApp actual de Bolivian Electric
-> Meta / WhatsApp Business Platform
-> Chatwoot Cloud dedicado
-> /api/chatwoot/webhook
-> n8n dedicado o backend del cliente
-> CRM, handoff, reportes e inventario read-only
```

Ruta directa `Meta -> /api/whatsapp/webhook` queda como laboratorio o fallback, no como primera opcion si Chatwoot sera la bandeja humana.

## Decision sobre infraestructura

Para MVP:

- Chatwoot Cloud dedicado para Bolivian Electric;
- OpenAI API como proveedor inicial de IA;
- n8n dedicado cuando haya datos reales;
- ONIA n8n compartido solo para pruebas con datos redacted;
- IA local solo como fase futura, cuando el flujo comercial este probado.

## Bloqueadores antes de activar

- Meta Business no aprobado o pendiente.
- Numero actual no elegible para coexistencia.
- Falta acceso al telefono/OTP.
- No hay backup de chats importantes.
- No hay responsables humanos de handoff.
- No hay workspace Chatwoot dedicado.
- No hay reglas de opt-in, plantillas o allowlist.
- Se quiere conectar n8n directo a base productiva.

## Proxima accion al aprobar Meta

1. Crear workspace Chatwoot Cloud dedicado.
2. Ir a `Settings > Inboxes > Add Inbox > WhatsApp`.
3. Usar `Connect with WhatsApp Business`.
4. Login con admin del portfolio `Bolivian Group S.R.L.`.
5. Elegir WABA existente si corresponde o crear uno nuevo para Bolivian Electric.
6. Intentar conectar el numero oficial actual.
7. Detenerse si el flujo exige borrar/migrar/desconectar sin aprobacion.
8. Agregar vendedores y probar con numeros allowlist.
9. Configurar webhook a backend/n8n.

## Aplicacion para ONIA

Este caso confirma que ONIA debe vender la configuracion WhatsApp como fase tecnica verificable, no como promesa automatica.

La oferta comercial debe separar:

- auditoria y acceso Meta;
- verificacion de negocio;
- conexion Chatwoot/WhatsApp;
- bot de calificacion;
- n8n/CRM;
- inventario read-only;
- soporte mensual.

Esto protege margen, reduce riesgo y evita regalar gestion Meta que puede trabarse por documentos, permisos o elegibilidad del numero.
