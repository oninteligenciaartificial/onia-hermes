# ONIA Vertical Service Matrix 2026

Estado: matriz canonica auditada en
`hermes-content/docs/ONIA_VERTICAL_SERVICE_AUDIT_2026.md`.
Fecha: 2026-06-27.
Uso: definir como ONIA empaqueta DentalGest, GestiOS y futuras verticales por
rubro sin crear sistemas duplicados ni vender add-ons gratis.

## Veredicto

ONIA debe vender soluciones por rubro, pero construirlas por familias
operativas.

La regla correcta es:

```text
Producto visible por rubro cuando ayuda a vender.
Base tecnica compartida cuando el proceso es parecido.
Modulo extra solo si se cobra, se limita y se documenta.
```

No conviene tener un solo nombre generico para todo. Tampoco conviene crear un
repositorio, base de datos y equipo distinto para cada rubro.

## Arquitectura comercial

Cada oferta ONIA debe quedar en cuatro niveles:

```text
1. Familia operativa interna
2. Producto comercial por rubro
3. Configuracion del rubro
4. Add-ons cobrables
```

Ejemplo:

```text
Familia interna: GestiOS Empresas
Producto comercial: ProveeGest
Rubro configurado: material electrico
Version vendible: ProveeGest Electrico
Add-ons: inventario camara, TR4, WhatsApp, IA para cotizaciones
```

## Regla para crear o separar una vertical

Crear producto/rama propia solo si cambian al menos 4 de estos puntos:

- datos principales;
- flujo diario;
- roles y permisos;
- reportes;
- vocabulario comercial;
- obligaciones legales o de privacidad;
- integraciones clave;
- soporte requerido;
- precio o forma de implementacion;
- riesgo operativo.

Si solo cambian nombres visibles, campos y plantillas, queda como configuracion
dentro de una familia existente.

## Base ONIA compartida

Toda vertical empresarial deberia poder usar esta base:

- organizacion;
- sucursales;
- usuarios;
- roles;
- permisos;
- clientes o contactos;
- tareas;
- estados;
- notas;
- archivos;
- evidencias;
- auditoria de cambios;
- dashboard base;
- reportes simples;
- importacion Excel/CSV;
- automatizacion simple n8n;
- configuracion por rubro;
- soporte y capacitacion;
- politicas de no prometer WhatsApp/IA productiva sin aprobacion.

## Productos activos desde ahora

### 1. DentalGest

Estado: activo.

Tipo de negocio:

```text
Clinicas dentales, consultorios odontologicos y centros odontologicos.
```

Dolor principal:

- consultas de pacientes sin registrar;
- citas y presupuestos sin seguimiento;
- mensajes repartidos entre redes, llamadas, web y recepcion;
- falta de trazabilidad por doctor, sucursal o responsable.

Base incluida:

- pacientes;
- agenda;
- citas;
- presupuestos;
- tratamientos;
- seguimiento;
- usuarios;
- reportes base;
- recordatorios internos segun plan;
- onboarding opcional.

Funciones por rubro:

- odontograma;
- historial de paciente;
- presupuestos por tratamiento;
- agenda por doctor;
- pacientes potenciales;
- seguimiento post-consulta;
- estado de presupuesto;
- multi-sede cuando aplique.

Add-ons cobrables:

- onboarding express;
- configuracion asistida;
- migracion y capacitacion;
- usuario extra;
- agenda publica;
- insumos dentales simples;
- WhatsApp operativo solo con aprobacion Meta, numero, plantillas y consumo;
- landing dental;
- auditoria de captacion dental;
- contenido educativo solo si esta conectado a captacion o seguimiento.

Bloqueado por ahora:

- WhatsApp automatico como promesa simple;
- migracion compleja sin diagnostico;
- inventario avanzado;
- historias clinicas sensibles sin politica clara;
- personalizaciones gratis por clinica.

Mensaje de venta:

```text
DentalGest ordena pacientes, citas, presupuestos y seguimiento para que la
clinica no pierda consultas entre WhatsApp, redes, llamadas y recepcion.
```

### 2. GestiOS Empresas

Estado: activo.

Tipo de negocio:

```text
Pymes, comercios y empresas con clientes, tareas, pedidos, inventario simple o
reportes desordenados.
```

Rol:

GestiOS es el motor empresarial base. No debe forzar todos los rubros a verse
igual. Debe permitir crear versiones comerciales por rubro cuando el proceso lo
necesite.

Dolor principal:

- operacion en Excel;
- seguimiento por WhatsApp sin estado;
- responsables poco claros;
- reportes manuales;
- gerencia sin visibilidad;
- tareas que se pierden entre personas.

Base incluida:

- clientes;
- productos o servicios;
- pedidos o solicitudes;
- tareas;
- responsables;
- estados;
- reportes;
- usuarios;
- roles;
- dashboard;
- proveedores segun plan;
- soporte segun plan.

Add-ons cobrables:

- automatizacion n8n;
- pagos QR si proveedor esta validado;
- e-commerce si aplica;
- inventario avanzado;
- exportacion contable;
- WhatsApp Business cuando Meta este listo;
- portal cliente;
- integraciones externas;
- implementacion operativa;
- procesos a medida.

Bloqueado por ahora:

- SIAT como venta base;
- WhatsApp automatico sin Meta;
- reemplazar ERP completo sin discovery;
- prometer integracion con sistemas externos sin auditoria.

Mensaje de venta:

```text
GestiOS ordena clientes, tareas, responsables, estados y reportes para que el
negocio deje de depender de Excel, WhatsApp y memoria.
```

## Verticales que nacen desde GestiOS

Estas no deben construirse todas ahora. Son rutas comerciales para empaquetar
GestiOS por tipo de negocio.

| Producto comercial | Familia tecnica | Tipo de negocio | Rubros iniciales | Prioridad |
|---|---|---|---|---|
| ProveeGest | GestiOS Empresas | importadoras, mayoristas y distribuidoras B2B | electrico, ferreteria, repuestos, agroinsumos, alimentos, frio, farma mayorista | alta |
| FarmaGest | GestiOS Empresas | farmacias y tiendas de salud | farmacia, suplementos, dermocosmetica | media |
| FerreGest | GestiOS Empresas | ferreterias y materiales | ferreteria, construccion liviana, herramientas | media |
| RepuestoGest | GestiOS Empresas | venta de repuestos | automotriz, maquinaria, motos, equipos | media |
| BarberGest | GestiOS Empresas | barberias | barberias, peluquerias masculinas | baja/media |
| BeautyGest | GestiOS Empresas | salones, esteticas y spa | salon, unas, estetica, spa | media |
| RestoGest | GestiOS Empresas | restaurantes y comida | restaurante, cafeteria, polleria, dark kitchen | baja/media |
| InmoGest | vertical futura | inmobiliarias | venta, alquiler, brokers, constructoras pequenas | esperar |
| HatoGest | vertical futura | ganaderia y agro operativo | ganado, lotes, sanidad, reproduccion, peso | esperar con validacion |
| DermoGest | laboratorio Nuvia/GestiOS | dermocosmetica retail y catalogo asistido | Nuvia, skincare, cosmetica, suplementos | laboratorio |

## ProveeGest

Nombre recomendado para importadoras, mayoristas y distribuidoras:

```text
ProveeGest
```

Por que:

- no queda atrapado en un solo rubro;
- suena a proveedores, abastecimiento, catalogo y venta B2B;
- permite vender versiones por rubro sin crear otro producto desde cero.

Cliente ideal:

- importadoras;
- distribuidoras;
- mayoristas;
- empresas con catalogo amplio;
- empresas con vendedores, sucursales, cotizaciones y stock;
- negocios B2B donde la venta no es solo "comprar ahora", sino cotizar,
  asesorar, revisar disponibilidad y dar seguimiento.

Base ProveeGest:

- clientes empresa;
- contactos por cliente;
- vendedores;
- sucursales;
- productos;
- catalogo;
- cotizaciones;
- estados comerciales;
- seguimiento;
- proveedores;
- stock base;
- tareas;
- documentos;
- dashboard gerencial;
- importacion Excel/CSV;
- base de conocimiento comercial;
- reportes por vendedor, sucursal, producto y estado.

Versiones por rubro:

| Version | Rubro | Funciones especiales |
|---|---|---|
| ProveeGest Electrico | material electrico | fichas tecnicas, voltaje, amperaje, normas, marcas, equivalencias, manuales, cotizaciones por obra |
| ProveeGest Frio | helados, congelados, alimentos refrigerados | cadena de frio, vencimientos, lotes, rutas, camaras, temperatura, reposicion |
| ProveeGest Repuestos | repuestos | compatibilidades, modelos, codigos alternativos, marca, equipo, busqueda avanzada |
| ProveeGest Ferreteria | ferreteria mayorista | unidades, cajas, paquetes, stock minimo, marcas, equivalentes, proveedores |
| ProveeGest Farma | farmaceutico mayorista | lotes, vencimientos, trazabilidad, proveedor autorizado, restricciones |
| ProveeGest Agro | agroinsumos | cultivos, temporadas, fichas, presentaciones, recomendaciones tecnicas |
| ProveeGest Dermo | dermocosmetica y salud retail B2B | lineas, rutinas, marcas, campanas, asesoria comercial |

Caso Bolivian Electric:

```text
Producto: ProveeGest
Version: ProveeGest Electrico
Cliente: Bolivian Electric
Base: CRM + cotizaciones + catalogo + stock + vendedores + sucursales + reportes
Rubro: material electrico
Especial: fichas tecnicas, manuales, marcas, categorias electricas, proyectos,
equivalencias, base de conocimiento tecnica e integracion futura con TR4.
```

Add-ons ProveeGest:

- inventario con camara;
- integracion con sistema actual;
- catalogo tecnico;
- portal cliente;
- IA para cotizaciones;
- IA para respuestas comerciales;
- WhatsApp;
- dashboard avanzado;
- reportes de sucursal;
- compras/proveedores avanzado;
- importaciones;
- rutas o entregas;
- documentos/OCR;
- capacitacion por area.

## Farmacia y salud retail

Producto comercial recomendado:

```text
FarmaGest
```

No debe mezclarse con DentalGest. DentalGest atiende clinicas; FarmaGest atiende
venta y stock de productos.

Funciones especiales:

- productos;
- stock;
- lotes;
- vencimientos;
- proveedores;
- marcas;
- categorias;
- alertas de reposicion;
- productos de alta rotacion;
- control de descuentos;
- ventas por mostrador o pedido;
- reportes de margen.

Add-ons:

- lector/camara;
- alertas de vencimiento;
- pedidos recurrentes;
- WhatsApp de consulta;
- base de conocimiento de productos;
- e-commerce o catalogo;
- dashboard por categoria.

Bloqueado:

- consejos medicos automatizados;
- prometer cumplimiento sanitario sin auditoria;
- manejar recetas o datos sensibles sin politica.

## Citas, belleza y servicios personales

Estos negocios comparten agenda y seguimiento, pero no necesariamente deben
tener el mismo nombre comercial.

| Producto comercial | Rubro | Funciones especiales |
|---|---|---|
| BarberGest | barberias | turnos, barberos, servicios, paquetes, clientes recurrentes |
| BeautyGest | esteticas, salones, unas, spa | agenda, tratamientos, cabinas, paquetes, seguimiento post-servicio |
| ClinicGest | clinicas no dentales y consultorios privados | citas, pacientes potenciales, seguimiento, autorizaciones y privacidad |

Base comun:

- agenda;
- clientes;
- servicios;
- profesionales;
- turnos;
- recordatorios internos;
- pagos o senas si aplica;
- paquetes;
- seguimiento;
- dashboard de ocupacion.

Add-ons:

- WhatsApp recordatorios;
- landing de reservas;
- calendario publico;
- contenido con CTA;
- pagos de reserva;
- IA recepcionista con aprobacion;
- reportes por profesional.

Decision:

No construir BarberGest, BeautyGest y ClinicGest como tres sistemas distintos al
inicio. Se venden como nombres por rubro, pero usan la misma base de agenda y
seguimiento hasta que el flujo demuestre necesidad real de separacion.

## Restaurantes y comida

Producto comercial recomendado:

```text
RestoGest
```

Cliente ideal:

- restaurantes;
- cafeterias;
- pollerias;
- dark kitchens;
- negocios con pedidos, reservas o promociones.

Funciones especiales:

- pedidos;
- reservas si aplica;
- menu;
- combos;
- promos;
- clientes recurrentes;
- seguimiento de consultas;
- control de entregas simple;
- inventario simple solo si se cotiza.

Add-ons:

- landing/menu digital;
- WhatsApp pedidos;
- QR menu;
- campanas;
- reportes de promos;
- flujo de aprobacion de contenido;
- integracion delivery solo con discovery.

Bloqueado:

- POS completo sin discovery;
- delivery complejo;
- inventario de cocina avanzado;
- prometer aumento de ventas por contenido.

## Inmobiliarias

Producto comercial futuro:

```text
InmoGest
```

Estado: esperar validacion o cliente pagado.

Funciones especiales:

- propiedades;
- interesados;
- visitas;
- asesores;
- estados del lead;
- documentos;
- fotos y videos;
- filtros por zona, precio, tipo y disponibilidad;
- seguimiento de visita;
- propietarios.

Add-ons:

- portal de propiedades;
- WhatsApp;
- CRM de visitas;
- videos de propiedad;
- firma/documentos;
- dashboard de asesores.

No construir ahora salvo que exista cliente, discovery pagado o necesidad
comercial clara.

## Ganaderia y agro operativo

Producto comercial futuro:

```text
HatoGest
```

Estado: vertical separada futura, no mezclar con GestiOS general.

Funciones especiales:

- animales;
- lotes;
- sanidad;
- reproduccion;
- movimientos;
- pesos;
- potreros;
- eventos;
- offline rural si se cotiza.

Regla:

HatoGest no debe copiar inventario comercial. El dominio es biologico y rural,
no venta de productos.

## DermoGest y Nuvia como laboratorio

Producto comercial posible:

```text
DermoGest
```

Uso inicial:

- laboratorio interno con Nuvia;
- no vender como SaaS externo hasta validar stock real, margen, procesos y
  demanda.

Funciones especiales:

- catalogo;
- productos;
- marcas;
- rutinas;
- campanas;
- lotes;
- margen;
- stock real;
- mensajes de consulta;
- seguimiento de interesadas;
- contenido por producto.

Regla:

Nuvia valida ecommerce/catalogo/retail asistido. No valida automaticamente
clinicas, mayoristas industriales ni ganaderia.

## Add-ons transversales cobrables

Ningun add-on entra gratis por defecto.

| Add-on | Aplica a | Regla |
|---|---|---|
| WhatsApp operativo | DentalGest, GestiOS, ProveeGest, BeautyGest, BarberGest | bloqueado hasta Meta, numero, plantillas, webhooks y consumo claro |
| Chatbot | casi todos | vender solo despues de ordenar proceso manual y base de conocimiento |
| IA copiloto | DentalGest, GestiOS, ProveeGest | debe tener fuentes, limites y humano responsable |
| Inventario camara | ProveeGest, FarmaGest, FerreGest, RepuestoGest | cotizar setup y capacitacion; no prometer ERP completo |
| Landing/web | todos | entrada o upsell de captacion |
| n8n simple | todos | flujo cerrado: entrada -> registro -> aviso -> tarea |
| Dashboard avanzado | GestiOS, ProveeGest, FarmaGest | cotizar por fuentes de datos y reportes |
| Portal cliente | ProveeGest, InmoGest, GestiOS | requiere discovery |
| Importacion Excel/CSV | GestiOS, ProveeGest, FarmaGest | incluir limpieza limitada; migracion grande aparte |
| Integracion externa | todos | discovery pagado, credenciales seguras y contrato de alcance |
| Contenido/ads | todos | no vender videos IA sueltos; conectar a oferta, landing o seguimiento |

## Formato obligatorio por producto/rubro

Cada nueva vertical o version de rubro debe documentar:

```text
Producto comercial:
Familia tecnica:
Tipo de negocio:
Rubro:
Cliente ideal:
Dolor principal:
Base incluida:
Funciones por rubro:
Add-ons cobrables:
Add-ons bloqueados:
Precio base:
Setup/onboarding:
Mensualidad:
Costos externos:
Datos necesarios:
Responsable cliente:
Responsable ONIA:
Demo minima:
Checklist de entrega:
Criterio de exito:
Riesgos:
Decision: vender ahora / validar / esperar / bloquear
```

## Prioridad recomendada

### Vender ya

1. DentalGest.
2. GestiOS Empresas.
3. ProveeGest como version comercial de GestiOS para importadoras,
   distribuidoras y mayoristas.
4. Web/landing + CRM + n8n como entrada para cualquier rubro.
5. Auditoria Express y Diagnostico + Plan cuando el rubro todavia esta confuso.

### Validar con discovery o piloto

1. ProveeGest Electrico con Bolivian Electric.
2. FarmaGest para farmacias o distribuidoras de salud.
3. BeautyGest para esteticas/salones.
4. RestoGest si aparece cliente con necesidad clara.
5. DermoGest con Nuvia como laboratorio.

### Esperar

1. InmoGest.
2. HatoGest.
3. BarberGest como producto separado; vender primero con base agenda/BeautyGest.
4. ProveeGest Agro o ProveeGest Frio si no hay cliente real.

## Regla final

```text
ONIA no vende una lista de funciones. ONIA vende un sistema por tipo de negocio,
configurado para el rubro, con add-ons cobrados segun dolor real.
```

El orden correcto para crecer es:

```text
DentalGest y GestiOS venden ahora.
ProveeGest se valida con Bolivian/importadoras.
Las demas verticales se abren solo con cliente, discovery pagado o evidencia de
demanda.
```
