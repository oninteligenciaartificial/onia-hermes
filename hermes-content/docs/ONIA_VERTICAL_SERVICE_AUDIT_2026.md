# ONIA Vertical Service Audit 2026

Estado: decision operativa inicial.
Fecha: 2026-06-28.
Fuente base: `hermes-content/docs/ONIA_VERTICAL_SERVICE_MATRIX_2026.md`.
Uso: decidir que verticales se venden ahora, cuales se validan, cuales entran al
CRM/ventas y cuales quedan bloqueadas hasta discovery, cliente pagado o evidencia.

## Veredicto

La matriz esta bien orientada, pero ONIA no debe abrir todas las marcas al mismo
tiempo.

Decision:

```text
Vender ahora solo lo que ya tiene producto, precio o entrega controlable.
Validar ProveeGest como expansion inmediata desde GestiOS.
Mantener el resto como rutas comerciales, no como promesas publicas.
```

## Principio de operacion

ONIA debe operar como empresa real:

- un cliente entra por dolor concreto;
- se asigna una oferta primaria;
- si el rubro requiere lenguaje propio, se usa nombre vertical;
- si necesita mas funciones, se agregan add-ons cobrables;
- si el alcance excede el producto, se vende discovery o implementacion;
- si falta proceso manual, no se automatiza todavia.

Regla:

```text
Ningun vendedor debe ofrecer "todo incluido".
Todo modulo extra requiere precio, limite, responsable, evidencia y criterio de
exito.
```

## Decision por vertical

| Vertical | Decision | Motivo | Accion |
|---|---|---|---|
| DentalGest | vender ahora | Producto activo, precio definido, dolor claro, leads existentes | Mantener como prioridad 1 para clinicas dentales |
| GestiOS Empresas | vender ahora | Producto activo, aplica a pymes con Excel, tareas y reportes | Mantener como prioridad 2 para pymes operativas |
| ProveeGest | validar y vender como implementacion sobre GestiOS | Extiende GestiOS a importadoras, mayoristas y distribuidoras sin crear repo nuevo | Entrar a CRM/ventas como oferta validable |
| ProveeGest Electrico | validar con Bolivian Electric | Caso real, rubro claro, utilidad comercial alta si no se promete integracion profunda | Usar para propuesta/piloto, no como SaaS publico aun |
| Web + CRM + n8n | vender ahora como entrada | Cash flow rapido y puente hacia DentalGest/GestiOS/ProveeGest | Mantener en ventas como paquete de entrada |
| Auditoria/Diagnostico ONIA | vender ahora | Convierte rubros ambiguos en alcance pagado | Usar antes de cualquier sistema dudoso |
| FarmaGest | validar | Similar a GestiOS/ProveeGest pero con vencimientos, lotes y restricciones | Solo con prospecto real o discovery |
| BeautyGest | validar | Citas/servicios con agenda y seguimiento; puede venderse con base sencilla | Validar con esteticas/salones, sin construir separado |
| BarberGest | esperar | Puede usar base de agenda; rubro chico y ticket probable menor | No crear producto separado aun |
| RestoGest | esperar/validar caso a caso | Alto soporte, delivery/POS puede complicar margen | Solo con alcance cerrado |
| DermoGest | laboratorio | Nuvia ayuda, pero no hay producto externo validado | Usar internamente hasta margen/proceso real |
| InmoGest | esperar | Requiere portal, media, documentos y CRM especifico | No vender sin prospecto serio o discovery |
| HatoGest | esperar como vertical separada | Dominio rural/offline diferente a GestiOS | No mezclar; validar solo con founder beta |

## Entran a CRM/ventas ahora

Estos deben existir como opciones comerciales internas para clasificar leads:

### DentalGest

Usar cuando:

- el negocio es clinica dental, consultorio odontologico o centro odontologico;
- hay citas, presupuestos, pacientes o mensajes sin seguimiento;
- la venta puede resolverse con demo y plan mensual.

Oferta primaria:

```text
DentalGest: CRM dental, agenda, pacientes, presupuestos y seguimiento.
```

Oferta secundaria:

- landing dental;
- auditoria de seguimiento;
- onboarding;
- WhatsApp solo con aprobacion.

### GestiOS Empresas

Usar cuando:

- hay Excel, tareas, clientes, pedidos o reportes manuales;
- la empresa necesita responsables, estados y dashboard;
- no hay rubro suficientemente especifico para otra vertical.

Oferta primaria:

```text
GestiOS: sistema operativo para clientes, tareas, responsables, estados y reportes.
```

Oferta secundaria:

- automatizacion n8n;
- dashboard operativo;
- implementacion operativa;
- web/landing si falta captacion.

### ProveeGest

Usar cuando:

- la empresa es importadora, mayorista, distribuidora o B2B con catalogo;
- vende por cotizacion, asesoramiento o seguimiento, no solo por carrito;
- tiene vendedores, sucursales, stock, proveedores o catalogo tecnico;
- hay necesidad de ordenar cotizaciones, clientes, productos y reportes.

Oferta primaria:

```text
ProveeGest: sistema comercial y operativo para importadoras, mayoristas y
distribuidoras B2B.
```

Oferta secundaria:

- discovery pagado;
- CRM de cotizaciones;
- base de conocimiento comercial;
- catalogo tecnico;
- inventario con camara;
- integracion con sistema actual solo despues de auditoria.

Versiones de rubro permitidas internamente:

- ProveeGest Electrico;
- ProveeGest Ferreteria;
- ProveeGest Repuestos;
- ProveeGest Farma mayorista;
- ProveeGest Frio;
- ProveeGest Agro.

No vender todavia:

- ProveeGest como ERP completo;
- integracion en tiempo real;
- compras/importaciones avanzadas;
- escritura en sistemas externos;
- WhatsApp automatico;
- portal cliente sin discovery.

## No entran a ventas como producto todavia

### FarmaGest

Puede aparecer en conversacion, pero debe venderse como:

```text
Diagnostico + GestiOS/FarmaGest piloto
```

No como SaaS publico. Requiere revisar vencimientos, lotes, margen, categorias,
roles y datos sensibles antes de prometer.

### BeautyGest y BarberGest

Pueden venderse como pilotos de agenda/seguimiento si hay cliente, pero no como
productos separados.

Ruta correcta:

```text
Auditoria o landing de reservas -> agenda/CRM simple -> seguimiento -> add-ons.
```

### RestoGest

No vender como sistema completo de restaurante. Solo se permite:

- landing/menu digital;
- CRM simple de reservas o pedidos;
- flujo n8n de consultas;
- campana con seguimiento.

POS, delivery e inventario de cocina requieren discovery.

### InmoGest

Bloqueado como producto hasta tener:

- prospecto con propiedades reales;
- responsable comercial;
- alcance de CRM/portal;
- reglas de publicacion;
- precio inicial y soporte.

### HatoGest

Bloqueado para GestiOS. Si se retoma, debe tratarse como vertical separada y
offline-first.

## Mapa de decision para vendedores

| Senal del prospecto | Oferta primaria | Segunda opcion | Si esta confuso |
|---|---|---|---|
| Clinica dental | DentalGest | landing dental | auditoria de pacientes perdidos |
| Pyme con Excel/tareas | GestiOS | n8n/dashboard | diagnostico + plan |
| Importadora/distribuidora/mayorista | ProveeGest | CRM de cotizaciones | discovery pagado |
| Negocio sin web | Web/landing ONIA | CRM simple | auditoria express |
| Farmacia/stock con vencimientos | GestiOS/FarmaGest piloto | inventario/alertas | discovery |
| Estetica/salon/barberia | agenda/seguimiento | landing reservas | auditoria |
| Restaurante/comida | menu/landing + seguimiento | n8n pedidos | auditoria |
| Inmobiliaria | no vender producto aun | auditoria/landing | discovery |
| Ganaderia | no vender desde GestiOS | HatoGest futuro | founder beta si Sergio aprueba |

## Paquetes comerciales permitidos

### Paquete 1 - SaaS directo

Aplica a:

- DentalGest;
- GestiOS.

Regla:

- vender plan mensual vigente;
- onboarding opcional;
- add-ons aprobados segun precio vigente;
- no personalizar gratis.

### Paquete 2 - Vertical validable

Aplica a:

- ProveeGest;
- ProveeGest Electrico;
- FarmaGest piloto;
- BeautyGest piloto.

Estructura:

```text
Diagnostico o discovery
+ configuracion inicial
+ piloto de modulo base
+ propuesta de implementacion
```

Precio guia interno:

- Auditoria Express: precio vigente.
- Diagnostico + Plan: precio vigente.
- Discovery Pagado: precio vigente.
- Implementacion Operativa: rango vigente.
- Integraciones: cotizacion aparte.

### Paquete 3 - Entrada universal

Aplica a cualquier rubro cuando todavia no hay madurez:

```text
Web/landing + formulario/WhatsApp manual + CRM simple + n8n de aviso.
```

Este paquete no reemplaza un SaaS. Sirve para captar, medir y luego vender
DentalGest, GestiOS o ProveeGest.

## Regla de naming

Nombres comerciales permitidos:

- DentalGest;
- GestiOS;
- ProveeGest;
- ProveeGest Electrico;
- ProveeGest Ferreteria;
- ProveeGest Repuestos;
- ProveeGest Farma;
- FarmaGest;
- BeautyGest;
- RestoGest;
- InmoGest;
- HatoGest;
- DermoGest.

Regla:

```text
Usar nombre especifico solo si ayuda a que el cliente sienta que ONIA entiende
su rubro. Internamente registrar siempre la familia tecnica.
```

Ejemplo:

```text
Cliente: Bolivian Electric
Nombre comercial: ProveeGest Electrico
Familia tecnica: GestiOS Empresas
Rubro: material electrico
Oferta inicial: diagnostico + CRM/cotizaciones + base de conocimiento
```

## Riesgos auditados

| Riesgo | Nivel | Control |
|---|---|---|
| Abrir demasiadas verticales | Alto | Solo DentalGest, GestiOS y ProveeGest entran a ventas ahora |
| Vender ProveeGest como ERP | Alto | Vender diagnostico/piloto, no reemplazo completo |
| Prometer WhatsApp | Alto | Bloqueado hasta Meta, numero, plantillas y costos |
| Personalizar gratis | Alto | Todo extra debe tener precio, limite y checklist |
| Confundir cliente con nombres internos | Medio | Nombre visible por rubro, familia tecnica interna |
| Crear repos duplicados | Alto | Reutilizar GestiOS hasta que cambien 4+ criterios |
| Mezclar HatoGest con GestiOS | Medio/alto | Mantener HatoGest como vertical futura separada |
| Vender industrias sensibles sin politica | Alto | Discovery y limites de datos antes de IA/automatizacion |

## Siguiente accion operativa

### Esta semana

1. Mantener ventas activas de DentalGest.
2. Mantener ventas activas de GestiOS.
3. Registrar ProveeGest en el registry comercial como oferta validable.
4. Preparar pitch corto de ProveeGest para importadoras/distribuidoras.
5. Usar Bolivian Electric como primer caso ProveeGest Electrico.

### No hacer esta semana

- Crear landing publica de todas las verticales.
- Crear repos nuevos.
- Publicar nombres sin oferta lista.
- Prometer WhatsApp, IA autonoma o integraciones profundas.
- Vender InmoGest, HatoGest o RestoGest completo.

## Decision final

```text
ONIA abre tres carriles comerciales:
1. DentalGest para clinicas dentales.
2. GestiOS para pymes operativas.
3. ProveeGest para importadoras, mayoristas y distribuidoras.

Todo lo demas queda como validacion, laboratorio o espera.
```
