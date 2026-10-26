# Client Content Production System

## Objetivo
Preparar a Onia para crear contenido con IA para otras personas, negocios y clientes, usando Hermes como cerebro, ElevenLabs como audio y Higgsfield como video/render.

La meta comercial es vender paquetes de contenido + automatizacion:

- videos UGC;
- reels para negocios;
- videos con avatar/voz cuando haya consentimiento;
- demos de servicios;
- anuncios locales;
- contenido mensual para marcas personales;
- contenido conectado a WhatsApp, CRM, landing pages y seguimiento.

Playbook comercial canonico:

- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`
- `HIGGSFIELD_FULL_CAPABILITIES_MAP.md`
- `HIGGSFIELD_CONTENT_USE_CASES.md`
- `PROJECTS_ORCHESTRATION.md`
- `hermes-content/references/onia-projects-registry.json`
- `hermes-content/references/higgsfield-content-use-cases.json`

## Lineas de servicio

### 1. UGC para negocios
Para clinicas, restaurantes, inmobiliarias, ecommerce, gimnasios, estetica y servicios locales.

Entregable base:

- 3 conceptos.
- 1 video final.
- 2 hooks alternativos.
- 1 caption.
- 1 ronda de revision.

### 2. Marca personal
Para doctores, dueños, coaches, asesores, inmobiliarios y consultores.

Entregable base:

- guion corto;
- voz real o IA con consentimiento;
- B-roll o avatar si aplica;
- subtitulos;
- CTA a WhatsApp, agenda o landing.

### 3. Campañas Onia para clientes
Video + sistema comercial.

Entregable recomendado:

- 3 reels;
- landing simple;
- chatbot o WhatsApp flow;
- CRM/seguimiento;
- reporte semanal.

### 4. DentalGest para clinicas
Contenido orientado a:

- pacientes perdidos;
- citas olvidadas;
- seguimiento post-consulta;
- presupuestos pendientes;
- agenda y recordatorios.

### 5. Gestios para empresas
Contenido orientado a:

- operaciones desordenadas;
- reportes manuales;
- seguimiento de tareas;
- clientes y procesos en Excel;
- visibilidad para gerencia.

## Flujo operativo

1. Recibir datos del cliente.
2. Crear brief seguro.
3. Generar 3 angulos creativos.
4. Sergio aprueba el angulo.
5. ElevenLabs genera audio si aplica.
6. Higgsfield genera video si aplica.
7. Hermes prepara caption y CTA.
8. Cliente/Sergio revisa.
9. Entregar o publicar solo con aprobacion.
10. Registrar costo, asset, estado y resultado.

## Datos minimos del cliente

```text
Cliente:
Rubro:
Oferta:
Ubicacion:
Audiencia:
CTA:
Pruebas reales:
Claims prohibidos:
Estilo:
Cuenta destino:
Publica ONIA o publica cliente:
Consentimiento voz/cara:
```

## Comandos recomendados

```text
Crea UGC empresa: <negocio> | <oferta> | <audiencia> | <estilo>
Crea video cliente: <negocio> | <oferta> | <estilo>
Paquete UGC: <negocio> | <oferta>
```

Para Video Lab:

```bash
video-lab telegram --message "Crea video cliente: <negocio> | <oferta> | <estilo>"
```

## Paquetes comerciales sugeridos

### Prueba UGC
Para vender facil.

- 1 video.
- 2 hooks.
- 1 caption.
- 1 revision.
- Sin automatizacion.

### Pack Contenido Local
Para negocios que necesitan constancia.

- 4 videos al mes.
- 4 captions.
- 1 calendario.
- 1 reporte simple.

### Pack Onia Growth
Para vender servicio completo.

- 8 videos al mes.
- landing o pagina de campaña;
- WhatsApp/chatbot;
- CRM o Google Sheet;
- seguimiento automatico;
- reporte semanal.

Ver `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md` para nichos, mensajes de prospeccion, prompts y precios sugeridos.

### Pack DentalGest
Para clinicas dentales.

- 6 videos al mes.
- guiones para doctor/clinica;
- demo DentalGest;
- flujo de citas y recordatorios;
- CTA a demo.

### Pack Gesti-OS
Para pymes con operaciones desordenadas.

- 4 videos educativos al mes;
- demo de tablero operativo;
- guiones para duenio/gerente;
- flujo de tareas, clientes y reportes;
- CTA a diagnostico operativo.

### Pack Web + Captacion
Para negocios sin web clara o con web que no convierte.

- landing o pagina web;
- 3 piezas de lanzamiento;
- formulario de leads;
- CRM simple;
- CTA a auditoria o reserva.

### Pack Higgsfield Growth
Para negocios que necesitan contenido recurrente.

- 8 videos al mes;
- 12 hooks alternativos;
- captions y CTAs;
- calendario;
- reporte simple;
- opcion de conectar landing/CRM.

## Plantilla de brief UGC

```text
Brief UGC:
Cliente:
Oferta:
Audiencia:
Objetivo:
Hook:
Script:
Shot list:
Prompt Higgsfield:
Voz ElevenLabs:
Claims seguros:
No decir:
Caption:
CTA:
Siguiente aprobacion:
```

## Claims seguros
Usar:

- "disenado para ayudar";
- "puede ayudar a reducir trabajo manual";
- "hecho para ordenar";
- "pide una demo";
- "agenda una revision";
- "mejora el seguimiento".

Evitar sin prueba:

- "garantizado";
- "duplica ventas";
- "el mejor";
- "numero uno";
- "pacientes/clientes lograron X";
- testimonios inventados;
- resultados medicos, legales o financieros no verificados.

## Aprobaciones
Requiere aprobacion explicita:

- publicar;
- entregar a cliente;
- usar cara/voz de una persona;
- usar marca/logo de cliente;
- afirmar resultados;
- mencionar precios o promociones;
- automatizar contacto a prospectos.

## Registro por cliente
Cada proyecto debe guardar:

- cliente;
- rubro;
- proyecto Onia asociado: DentalGest, Gesti-OS, Web, Higgsfield;
- paquete;
- costo estimado de produccion;
- estado;
- fecha de entrega;
- asset URL;
- caption;
- aprobacion;
- factura/pago si aplica.

## Primeros nichos a atacar

1. Clinicas dentales.
2. Esteticas y dermatologia.
3. Inmobiliarias.
4. Restaurantes/cafes.
5. Gimnasios.
6. Tiendas ecommerce.
7. Consultores y marcas personales.

## Biblioteca por rubro

Antes de crear un video para empresa, Hermes debe revisar:

- `HIGGSFIELD_CONTENT_USE_CASES.md`
- `hermes-content/references/higgsfield-content-use-cases.json`

Si n8n participa, debe preparar el paquete de referencias siguiendo:

- `hermes-content/references/n8n-higgsfield-generation-flow.md`
