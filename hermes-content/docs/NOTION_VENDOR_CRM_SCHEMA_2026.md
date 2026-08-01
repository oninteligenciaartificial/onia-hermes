# Onia Notion Vendor CRM Schema 2026

## Veredicto

La organizacion comercial debe vivir en Notion.

El CSV queda solo como respaldo/importacion inicial. La fuente oficial para
vendedores debe ser una base de Notion llamada:

```text
CRM Vendedores ONIA
```

Objetivo:

- saber quien consiguio cada lead;
- saber quien debe hacer seguimiento;
- evitar que dos vendedores escriban al mismo cliente;
- obligar a entregar datos completos;
- calcular comisiones de forma clara;
- ver que clientes estan pendientes, ganados, perdidos o incompletos.

## Regla principal

```text
SIN DATOS COMPLETOS, NO HAY COMISION APROBADA.
```

El vendedor puede organizarse como quiera dentro de Notion, pero cada lead debe
tener los campos minimos completos antes de pasar a demo, propuesta o comision.

## Base: CRM Vendedores Onia

### Propiedades obligatorias

| Propiedad | Tipo Notion | Obligatorio | Uso |
|---|---|---:|---|
| Lead | Title | Si | Nombre corto del lead |
| Lead ID | Rich text | Si | Codigo unico, ejemplo `LEAD-0001` |
| Empresa | Rich text | Si | Nombre real del negocio |
| Rubro | Select | Si | Dental, estetica, restaurante, inmobiliaria, servicios, otro |
| Ciudad | Select | Si | Santa Cruz, La Paz, Cochabamba, otra |
| Pais | Select | Si | Bolivia por defecto |
| Contacto publico | Rich text | Si | Telefono, Instagram, web, correo o LinkedIn publico |
| Canal principal | Select | Si | WhatsApp, Instagram, llamada, email, LinkedIn |
| Fuente | URL / Rich text | Si | De donde salio el dato |
| Permiso de contacto | Select | Si | Aprobado, pendiente, no contactar |
| Vendedor origen | People / Rich text | Si | Quien consiguio el lead |
| Responsable actual | People / Rich text | Si | Quien debe hacer el siguiente paso |
| Estado pipeline | Status | Si | Estado comercial |
| Producto sugerido | Select | Si | DentalGest, Gesti-OS, Web, Chatbot, Automatizacion, Consultoria, Sistema |
| Prioridad | Select | Si | Alta, media, baja |
| Dolor probable | Rich text | Si | Problema detectado |
| Ultimo contacto | Date | Si, si ya se contacto | Fecha del ultimo mensaje o llamada |
| Proximo seguimiento | Date | Si, si no esta cerrado | Fecha exacta del siguiente paso |
| Resultado ultimo contacto | Select | Si, si ya se contacto | No respondio, interesado, demo, no apto |
| Mensaje enviado | Rich text | Si, si ya se contacto | Copia del mensaje usado |
| Monto cobrado | Number | Si, si gano | Monto real pagado por el cliente |
| Servicio vendido | Select | Si, si gano | Servicio exacto vendido |
| Comision calculada | Number | Si, si gano | Premio del vendedor |
| Estado comision | Select | Si, si gano | Pendiente, aprobada, pagada, retenida, descontada |
| Fecha pago comision | Date | Si, si se pago | Dia real de pago |
| Datos completos | Checkbox | Si | Solo marcar cuando todo lo necesario esta lleno |
| No contactar | Checkbox | Si | Marcar si pidio no recibir mensajes |
| Notas | Rich text | No | Objeciones, contexto y observaciones |

## Estados pipeline

Usar estos estados, en este orden:

1. Nuevo
2. Investigado
3. Calificado
4. Mensaje preparado
5. Aprobado para contactar
6. Contactado
7. Respondio
8. Requiere seguimiento
9. Demo agendada
10. Demo realizada
11. Propuesta enviada
12. Ganado
13. Perdido
14. No apto
15. No contactar

## Vistas recomendadas

| Vista | Filtro | Para que sirve |
|---|---|---|
| Todos los leads | Sin filtro | Control general |
| Mis seguimientos hoy | Responsable actual = yo, Proximo seguimiento <= hoy | Trabajo diario |
| Datos incompletos | Datos completos = false | Corregir registros |
| Aprobacion pendiente | Permiso de contacto = pendiente | Sergio decide si se contacta |
| Demos agendadas | Estado pipeline = Demo agendada | Preparar reuniones |
| Propuestas enviadas | Estado pipeline = Propuesta enviada | Cerrar ventas |
| Ganados comision pendiente | Estado = Ganado, Estado comision = Pendiente | Liquidar vendedores |
| Por vendedor | Agrupar por Vendedor origen | Ver produccion por vendedor |
| No contactar | No contactar = true | Evitar insistencias |

## Templates de pagina

### Template: Nuevo lead

Checklist dentro de la pagina:

- Confirmar empresa.
- Confirmar rubro.
- Confirmar ciudad.
- Pegar fuente publica.
- Escribir dolor probable.
- Elegir producto sugerido.
- Definir vendedor origen.
- Definir responsable actual.
- Definir proximo seguimiento.
- Preparar mensaje.
- Pedir aprobacion antes de contactar si es lista fria.

### Template: Lead contactado

Checklist:

- Registrar canal usado.
- Pegar mensaje enviado.
- Registrar fecha del contacto.
- Registrar resultado.
- Definir proximo seguimiento.
- No duplicar contacto si ya respondio por otro canal.

### Template: Cliente ganado

Checklist:

- Registrar servicio vendido.
- Registrar monto cobrado.
- Adjuntar o referenciar comprobante si aplica.
- Calcular comision.
- Marcar estado comision: pendiente.
- Pasar cliente a Onia para entrega/soporte.
- Crear proximo paso de onboarding.

## Reglas de comision en Notion

### SaaS mensual

- Se paga 35% solo del primer pago mensual cobrado.
- Los meses siguientes quedan para Onia.
- No hay comision eterna por mensualidad.

### Nueva venta al mismo cliente

El vendedor puede ganar otra comision si vende:

- upgrade de plan;
- anualidad;
- web;
- chatbot;
- automatizacion;
- conector;
- implementacion;
- sistema personalizado.

Cada nueva venta debe registrarse como una nueva oportunidad o una nueva fila
relacionada al cliente.

## Como hablaran los vendedores con clientes

### WhatsApp Onia

El numero principal de Onia debe funcionar como chatbot de entrada:

1. Recibe al prospecto.
2. Pregunta rubro, ciudad y necesidad.
3. Crea o actualiza el lead en Notion.
4. Marca `Canal principal = WhatsApp`.
5. Deja `Permiso de contacto = pendiente` si falta aprobacion humana.
6. Notifica a Sergio/Hermes.
7. Asigna `responsable_actual`.

El vendedor no usa libremente el WhatsApp principal.

### Vendedor humano

El vendedor habla cuando:

- el lead esta asignado a el;
- el contacto esta aprobado;
- hay proximo paso claro;
- el mensaje esta registrado o preparado en Notion.

Puede hablar por:

- WhatsApp manual autorizado;
- Instagram autorizado;
- llamada;
- email;
- LinkedIn.

## Reglas anti-desorden

- No escribir a un cliente con `No contactar = true`.
- No escribir si `Permiso de contacto = pendiente`.
- No contactar leads asignados a otro vendedor.
- No duplicar mensajes por WhatsApp e Instagram el mismo dia sin razon.
- No marcar `Ganado` sin monto cobrado.
- No aprobar comision si `Datos completos = false`.
- No dejar un lead abierto sin `Proximo seguimiento`.

## Datos que el vendedor debe entregar siempre

Antes de pedir comision:

- empresa;
- rubro;
- ciudad;
- contacto usado;
- fuente;
- vendedor origen;
- responsable actual;
- producto vendido;
- monto cobrado;
- fecha de cobro;
- comision calculada;
- evidencia o referencia del pago;
- estado de entrega/onboarding.

## Automatizacion futura con n8n

Flujo recomendado:

1. WhatsApp chatbot o formulario recibe lead.
2. n8n crea pagina en Notion.
3. Hermes clasifica producto sugerido.
4. Telegram avisa a Sergio.
5. Sergio aprueba contacto o asigna vendedor.
6. Notion crea seguimiento automaticamente.
7. Si vence seguimiento, Telegram avisa al vendedor.
8. Si cambia a Ganado, Notion muestra comision pendiente.

## Pendiente tecnico

El conector Notion debe estar autenticado para crear o modificar la base desde
Codex. En el ultimo intento, Notion respondio:

```text
Auth required
```

Cuando se reconecte Notion, aplicar este esquema en la base `CRM Vendedores
Onia` o adaptar la base existente `CRM & Contactos`.
