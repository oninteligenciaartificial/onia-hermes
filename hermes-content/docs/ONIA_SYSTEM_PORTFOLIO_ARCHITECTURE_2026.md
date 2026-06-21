# ONIA System Portfolio Architecture 2026

Estado: borrador canonico interno
Fecha: 2026-06-20
Uso: definir que hace cada sistema de ONIA, donde pertenece cada modulo y como
evitar funciones repetidas al vender soluciones a empresas distintas.

## Veredicto

ONIA no debe construir un sistema aislado para cada cliente desde cero.
Tampoco debe meter todos los rubros en una sola aplicacion confusa.

Decision recomendada:

```text
Una base modular reutilizable + verticales especializadas + implementaciones
personalizadas por cliente.
```

Para Bolivian Electric, se vende como algo unico:

```text
Sistema Operativo Interno Bolivian Electric
```

Pero por dentro debe construirse como parte de:

```text
GestiOS Empresas / ONIA Operaciones
```

Asi Bolivian recibe algo hecho a su medida, y ONIA gana una plataforma vendible
a importadoras, distribuidoras, ferreterias, repuestos, almacenes y empresas
familiares.

## Principio principal

Cada cliente debe sentirse especial. El codigo no debe ser desordenadamente
especial.

Regla:

```text
Personalizar configuracion, flujos, nombres, reportes, roles e integraciones.
No duplicar logica central ni copiar/pegar sistemas completos.
```

## Capas del portafolio ONIA

| Capa | Que es | Quien la usa | Se vende? |
|---|---|---|---|
| Hermes | cerebro interno, memoria, orquestacion, docs, aprobaciones | ONIA/Sergio | no como app directa |
| GestiOS Core | base multiempresa: usuarios, roles, tareas, clientes, reportes | productos ONIA | si, como sistema |
| Modulos operativos | CRM, inventario, dashboard, conocimiento, contenido, gastos | empresas segun necesidad | si, como add-ons |
| Verticales | DentalGest, Bolivian Electric OS, Ganadero OS, etc. | rubros concretos | si, por industria |
| Adaptadores | TR4, WhatsApp, Excel, APIs, Meta, SIAT si aplica | cliente especifico | se cotiza aparte |
| Servicios ONIA | diagnostico, capacitacion, implementacion, contenido | cliente humano/equipo | si, siempre |

## Sistemas y responsabilidades

### 1. Hermes

Rol:

- centro de mando interno de ONIA;
- documenta, coordina, decide, prepara mensajes, planes y propuestas;
- ayuda a Sergio a dirigir proyectos y clientes.

Debe hacer:

- guardar decisiones;
- preparar auditorias y propuestas;
- coordinar planes semanales;
- revisar precios y riesgos;
- generar prompts, docs y guiones;
- servir como capa de inteligencia interna.

No debe hacer:

- reemplazar a GestiOS como app de clientes;
- convertirse en ERP;
- almacenar datos operativos sensibles de clientes sin arquitectura clara;
- ser vendido como "el sistema del cliente" sin empaquetarlo.

### 2. GestiOS Empresas / ONIA Operaciones

Rol:

- base general para empresas con operaciones, clientes, tareas, seguimiento,
  inventario liviano, reportes y equipos.

Cliente ideal:

- empresas medianas o pymes grandes;
- negocios con Excel, WhatsApp, reportes manuales o varios responsables;
- distribuidoras, importadoras, ferreterias, repuestos, tiendas con almacen,
  empresas familiares.

Debe hacer:

- organizaciones;
- sucursales;
- usuarios;
- roles y permisos;
- clientes;
- tareas;
- cotizaciones o solicitudes;
- estados;
- tablero gerencial;
- archivos/documentos;
- auditoria de acciones;
- modulos activables.

No debe hacer:

- reglas clinicas dentales profundas;
- gestion ganadera profunda;
- reemplazar cualquier ERP externo sin discovery;
- automatizar WhatsApp productivo antes de Meta y permisos.

### 3. DentalGest

Rol:

- vertical especifico para clinicas dentales.

Debe hacer:

- pacientes;
- citas;
- presupuestos;
- tratamientos;
- seguimiento dental;
- agenda;
- recordatorios cuando la infraestructura lo permita.

No debe hacer:

- inventario complejo de importadoras;
- almacenes con QR/camara;
- importaciones;
- dashboards contables generales;
- procesos de repuestos, ferreteria o distribucion.

### 4. Bolivian Electric OS

Rol:

- implementacion personalizada sobre GestiOS Empresas para mejorar la operacion
  alrededor de TR4.

Debe hacer:

- mejorar visibilidad de gerencia;
- ordenar seguimiento comercial;
- ordenar tareas por area;
- crear base de conocimiento;
- apoyar contenido comercial;
- apoyar auditoria de inventario con camara;
- generar reportes mas claros desde datos disponibles;
- conectar o importar informacion de TR4 si el sistema lo permite.

No debe hacer al inicio:

- reemplazar TR4;
- escribir datos en TR4 sin autorizacion tecnica;
- prometer integracion en tiempo real antes de auditar TR4;
- resolver todos los procesos de la empresa en la primera fase.

### 5. TR4 Adapter

Rol:

- puente entre TR4 y la capa ONIA.

Etapas posibles:

1. Exportacion manual: TR4 -> Excel/CSV/PDF -> ONIA.
2. Importador asistido: cargar reportes de TR4 y normalizarlos.
3. Scraping controlado: solo si hay permiso, estabilidad y reglas claras.
4. API/base de datos: solo si TR4 lo permite y la empresa aprueba.
5. Sincronizacion avanzada: fase futura, cotizada aparte.

No debe hacer:

- depender de credenciales pegadas en codigo;
- romper sesiones del sistema;
- automatizar acciones sensibles sin aprobacion humana;
- violar terminos, seguridad o politica interna.

### 6. Inventario Camara / StockCam

Rol:

- modulo reutilizable para conteo, evidencia visual, ubicacion, QR/codigo y
  diferencias de inventario desde celular.

Debe hacer:

- escanear QR/codigo de barras si existe;
- capturar producto manual si no existe codigo;
- tomar foto;
- contar unidades;
- registrar usuario, fecha, sucursal y ubicacion;
- exportar Excel/CSV;
- mostrar diferencias contra stock esperado cuando haya datos;
- funcionar como auditoria de inventario antes de integrarse profundo.

No debe hacer:

- ser el ERP completo;
- reemplazar compras/ventas/contabilidad;
- modificar TR4 sin adaptador aprobado;
- funcionar offline completo en MVP salvo que se cotice.

### 7. Content Engine ONIA

Rol:

- modulo/servicio para contenido comercial, no sistema operativo principal.

Debe hacer:

- calendario de contenido;
- ideas por producto;
- copies;
- guiones;
- campanas;
- CTA;
- seguimiento de que publicaciones generan consultas.

No debe hacer:

- prometer viralidad;
- vender videos IA como producto aislado sin aprobacion;
- publicar sin aprobacion;
- mezclar datos internos sensibles con contenido publico.

### 8. Base de Conocimiento Empresarial

Rol:

- biblioteca interna consultable para empleados, ventas, soporte y gerencia.

Debe hacer:

- productos;
- garantias;
- preguntas frecuentes;
- procesos internos;
- manuales;
- respuestas comerciales;
- criterios de aprobacion;
- entrenamiento de empleados.

No debe hacer:

- inventar politicas;
- responder como verdad si falta fuente;
- exponer informacion sensible sin permisos;
- reemplazar supervision humana en decisiones importantes.

### 9. Web ONIA / Web Factory

Rol:

- paginas, landing, captacion y presencia digital.

Debe hacer:

- explicar oferta;
- capturar leads;
- conectar formularios;
- mostrar productos/servicios;
- servir como vitrina y canal de venta.

No debe hacer:

- cargar operaciones internas complejas si corresponde a GestiOS;
- convertirse en ERP;
- mezclar CMS publico con datos internos sensibles.

### 10. Ganadero OS / HatoGest

Rol:

- vertical ganadero separado.

Debe hacer:

- animales;
- lotes;
- sanidad;
- reproduccion;
- movimientos;
- pesos;
- uso rural/offline si aplica.

No debe hacer:

- venderse como GestiOS general;
- compartir reglas de negocio con Bolivian Electric;
- forzar inventario comercial donde el dominio es ganadero.

## Mapa de funciones sin duplicacion

| Funcion | Dueno principal | Donde se adapta |
|---|---|---|
| Organizaciones | GestiOS Core | todos los sistemas empresariales |
| Usuarios/roles | GestiOS Core | DentalGest, Bolivian OS, Ganadero OS |
| Clientes/contactos | GestiOS Core | DentalGest usa pacientes; Bolivian usa clientes/cotizaciones |
| Tareas/estados | GestiOS Core | todos los verticales |
| CRM comercial | GestiOS Core | Bolivian, pymes, paginas web |
| Agenda clinica | DentalGest | solo clinicas |
| Inventario con camara | StockCam | Bolivian, ferreterias, repuestos, almacenes |
| Insumos dentales simples | DentalGest | no usar como inventario avanzado |
| Importaciones | Bolivian OS modulo | importadoras/distribuidoras |
| Contabilidad/gastos | Dashboard financiero | no reemplazar contador ni ERP |
| Contenido/calendario | Content Engine | todos los clientes con marketing |
| Base de conocimiento | Knowledge Base | todos los clientes con equipo |
| WhatsApp | Conector externo | bloqueado hasta Meta/permisos |
| TR4 | Adaptador | solo clientes que usen TR4 |
| SIAT | Adaptador futuro | solo si hay necesidad y soporte |
| Reportes gerenciales | GestiOS Core + modulos | todos con datos suficientes |

## Como hacer al cliente especial

Cada empresa debe tener un perfil de implementacion:

```text
organization_id:
nombre_comercial:
rubro:
sucursales:
roles:
modulos_activos:
campos_personalizados:
flujos:
reportes:
integraciones:
vocabulario:
permisos:
brand/copy:
datos_importados:
riesgos:
```

Ejemplo Bolivian Electric:

```text
rubro: importadora/distribuidora electrica
modulos: CRM, inventario camara, importaciones, dashboard, contenido,
base de conocimiento
integracion: TR4 pendiente de auditoria
vocabulario: cotizacion, stock, producto, sucursal, importacion, proveedor
```

Ejemplo clinica dental:

```text
rubro: clinica dental
modulos: agenda, pacientes, presupuestos, seguimiento, recordatorios
integracion: WhatsApp pendiente de Meta
vocabulario: paciente, cita, tratamiento, presupuesto, odontologo
```

Ejemplo ferreteria:

```text
rubro: ferreteria/distribucion
modulos: inventario camara, ventas, clientes, compras, dashboard
integracion: Excel o sistema existente
vocabulario: producto, marca, proveedor, pasillo, stock minimo
```

## Reglas para construir

1. Todo dato de cliente debe pertenecer a una organizacion.
2. Ningun modulo debe asumir que solo existe Bolivian.
3. Los nombres visibles pueden cambiar por cliente; las tablas/core no.
4. Las integraciones van separadas como adaptadores.
5. El primer MVP debe poder funcionar sin TR4 en tiempo real.
6. Si una funcion sirve a tres rubros, va al core.
7. Si una funcion solo sirve a un rubro, va al vertical.
8. Si una funcion depende de proveedor externo, va como adaptador.
9. Si una funcion es solo servicio humano, no se mete al sistema hasta que se
   repita varias veces.
10. No copiar y pegar logica. Crear plantillas y configuraciones.

## Reglas para vender

### A Bolivian Electric

Venderlo como:

```text
Sistema Operativo Interno para mejorar TR4, ventas, inventario, contenido,
reportes y procesos.
```

No venderlo como:

```text
Un software generico para pymes.
```

Porque Bolivian es grande y necesita sentir que se entiende su operacion.

### A otras empresas

Venderlo como:

```text
GestiOS Empresas: sistema modular para ordenar ventas, tareas, inventario,
reportes y equipo.
```

Segun rubro:

- ferreterias: inventario + ventas + proveedores;
- importadoras: importaciones + stock + costos + ventas;
- repuestos: inventario camara + busqueda + cotizaciones;
- distribuidoras: pedidos + rutas + stock + clientes;
- empresas familiares: gerencia + tareas + reportes + permisos;
- clinicas dentales: DentalGest, no GestiOS general.

## Ruta Bolivian Electric

### Fase 0 - Auditoria TR4 y procesos

Objetivo:

- entender que hace TR4;
- ver que usan realmente;
- detectar que hacen fuera de TR4;
- identificar datos exportables;
- definir si ONIA complementa, importa o integra.

### Fase 1 - Diagnostico + capacitacion + mini piloto

Objetivo:

- entrar barato y profesional;
- formar al equipo;
- validar dolor real;
- elegir modulo inicial.

Modulo recomendado:

- base de conocimiento + seguimiento comercial;
- o inventario camara discovery si almacen duele mas.

### Fase 2 - Capa operativa ONIA

Objetivo:

- tablero comercial;
- tareas por area;
- reportes claros;
- contenido comercial;
- base de conocimiento;
- importacion manual de reportes TR4.

### Fase 3 - Inventario Camara MVP

Objetivo:

- conteo y evidencia de stock;
- fotos;
- QR/codigos;
- diferencias;
- exportacion;
- capacitacion almacen.

### Fase 4 - Adaptador TR4

Objetivo:

- reducir carga manual;
- sincronizar reportes;
- preparar dashboard mas confiable;
- evaluar si se puede escribir de vuelta en TR4 o solo leer.

## Plan semanal de trabajo

### Lunes - Arquitectura y sistema

- definir modulos;
- definir rutas del producto;
- preparar mensaje para conversacion del sistema;
- no escribir codigo grande todavia.

### Martes - Auditoria Bolivian/TR4

- capturas o scraping controlado;
- entrevistar ventas, almacen, contabilidad, gerencia;
- listar exportaciones disponibles;
- anotar flujos fuera de TR4.

### Miercoles - Mapa de procesos

- convertir entrevistas en flujos;
- separar core, vertical, adaptador y servicio;
- priorizar 1 MVP.

### Jueves - Prototipo funcional

- wireframes;
- modelo de datos;
- flujo de usuarios;
- demo de inventario camara o dashboard.

### Viernes - Propuesta y precio

- deck;
- alcance;
- fases;
- precio;
- riesgos y gastos externos.

### Sabado - Demo visual

- prototipo navegable;
- capturas;
- flujo de venta;
- mensaje de presentacion.

### Domingo - Revision ONIA

- decidir que se vende;
- decidir que se construye;
- decidir que queda fuera;
- preparar semana siguiente.

## Mensaje para conversacion del sistema

```text
Tenemos que disenar este proyecto como plataforma modular, no como sistema
aislado ni como copia pegada.

Para Bolivian Electric se vendera como un Sistema Operativo Interno hecho a su
medida para mejorar TR4, ventas, inventario, reportes, contenido y procesos.
Pero tecnicamente debe construirse sobre una base reutilizable tipo GestiOS
Empresas / ONIA Operaciones.

Reglas:

1. No hardcodear Bolivian.
2. Todo dato debe pertenecer a organization_id.
3. El core debe tener organizaciones, sucursales, usuarios, roles, permisos,
   clientes, tareas, estados, archivos, auditoria y dashboards base.
4. Los modulos deben ser activables: CRM, inventario con camara, base de
   conocimiento, dashboard gerencial, contenido, importaciones, gastos y tareas.
5. TR4 va como adaptador externo, no dentro del core. Primero soportar
   exportacion/importacion manual, luego scraping controlado o API si existe.
6. DentalGest debe seguir separado como vertical dental.
7. Inventario con camara debe ser modulo reutilizable para Bolivian,
   ferreterias, repuestos, importadoras y almacenes.
8. Contenido comercial debe ser modulo/servicio separado, no mezclado con ERP.
9. Cada cliente se personaliza con configuracion: rubro, roles, campos, flujos,
   reportes, vocabulario, permisos e integraciones.
10. No copiar y pegar logica por cliente. Crear plantillas, configuraciones y
    adaptadores.

Objetivo:
Bolivian debe sentir que recibe un sistema unico para su empresa, pero ONIA debe
quedarse con una plataforma ordenada que despues pueda vender a otras empresas.
```

## Decision final

```text
Vender personalizado. Construir modular. Reutilizar por configuracion. Integrar
por adaptadores. No duplicar sistemas.
```
