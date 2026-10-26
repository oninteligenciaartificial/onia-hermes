# Manual comercial Onia 2026 - vendedores

Documento interno para vendedores nuevos. No compartir publicamente.

Ultima actualizacion: 2026-06-18

> 🔴 **PRECIOS DE PLATAFORMA DESACTUALIZADOS — leer antes de cotizar (2026-08-27).**
>
> Las tablas de abajo son de junio y **no son fuente**. Los precios de la plataforma se LEEN de
> `onia-platform/lib/subscription-plans.ts` (planes) y `onia-platform/lib/pricing.ts` (add-ons);
> la versión vendible, con las funciones al lado, está en
> **`historial/ONIA_QUE_SE_VENDE_Y_A_QUE_PRECIO.md`**.
>
> Lo que hay que saber antes de abrir la boca con un cliente:
> - Los planes son **Básico Bs 320 · Profesional Bs 750 · Completo Bs 1.500 · Empresa Bs 2.900**
>   (mensual; anual = 10 meses). **Ya no se llaman DentalGest Basico/Profesional/Clinica**: Onia
>   vende 7 rubros y el pack dental es uno.
> - El **chatbot de WhatsApp** es **Bs 390/mes o Bs 3.900/año, sin cargo inicial**. Los mensajes se
>   los cobra **Meta directamente al cliente** en su cuenta: nosotros no los facturamos ni los
>   marcamos.
> - **`GestiOS` no existe como producto.** Es un rubro de Onia Platform; sus repos son legado.
> - Las líneas de **web, consultoría y automatización no llevan lista de precios**: se cotizan caso
>   por caso (decisión 2026-08-24). Las cifras de abajo son rango histórico, no tarifario, y **no se
>   corrigen contra `pricing.ts`** — ese archivo no cubre esa línea.


## 1. Que vende Onia

Onia vende sistemas para que un negocio consiga mas conversaciones, atienda con
mas orden y no pierda oportunidades por desorden.

El vendedor no vende "tecnologia rara". El vendedor detecta un problema simple
y ofrece una solucion concreta:

- si el negocio pierde consultas, ofrecemos seguimiento;
- si responde tarde, ofrecemos CRM o automatizacion;
- si no tiene presencia profesional, ofrecemos pagina web;
- si no tiene una oferta clara en internet, ofrecemos web, auditoria o
  automatizacion simple;
- si trabaja con Excel, WhatsApp y notas sueltas, ofrecemos sistema operativo;
- si necesita algo propio, ofrecemos sistema personalizado.

## Oferta de arranque para vender ahora

Onia esta abriendo precios de arranque para cerrar clientes reales rapido. Esto
no significa vender barato para siempre ni prometer resultados imposibles.

Reglas:

- Vigencia hasta 2026-07-31 o hasta 20 clientes cobrados, lo que ocurra primero.
- El precio se reserva solo con pago confirmado.
- DentalGest y GestiOS mantienen su precio actual. No se descuentan por ahora.
- En servicios mensuales no SaaS, el precio de arranque cubre los primeros 3
  meses. Desde el mes 4 Onia puede pasar al precio vigente avisando antes.
- Si el cliente paga 3 meses adelantados, se respeta ese periodo completo.
- La comision se calcula sobre el monto neto realmente cobrado.
- No se incluyen impuestos, pauta, dominios, hosting, herramientas, APIs,
  creditos IA, WhatsApp, SMS, servidores ni gastos externos.
- No prometer ventas garantizadas, viralidad ni WhatsApp automatico.

| Oferta | Precio de arranque | Gana vendedor |
|---|---:|---:|
| Plan Básico | Bs. 320/mes | Bs. 112.00 |
| Plan Profesional | Bs. 750/mes | Bs. 262.50 |
| Plan Completo | Bs. 1.500/mes | Bs. 525.00 |
| GestiOS Basico | Bs. 350/mes | Bs. 122.50 |
| GestiOS Crecer | Bs. 530/mes | Bs. 185.50 |
| GestiOS Pro | Bs. 800/mes | Bs. 280.00 |
| GestiOS Empresarial | Bs. 1,250/mes | Bs. 437.50 |
| Landing de Captacion | Bs. 790 | Bs. 79.00 |
| Web Profesional | Bs. 1,500 | Bs. 180.00 |
| Web Pro Onia | Bs. 2,900 | Bs. 348.00 |
| Portal o Sistema Web mini | desde Bs. 6,500 | desde Bs. 650.00 |
| Auditoria Express | Bs. 250 | Bs. 25.00 |
| Diagnostico + Plan de Accion | Bs. 690 | Bs. 69.00 |
| Instalacion de Flujo Simple | Bs. 1,500 | Bs. 150.00 |
| Implementacion Operativa | desde Bs. 3,900 | desde Bs. 390.00 |
| Conexion de canal social | Bs. 690 setup | Bs. 69.00 |
| Automatizacion simple n8n | Bs. 790 setup | Bs. 79.00 |
| Flujo de aprobacion n8n | Bs. 1,200 setup | Bs. 120.00 |

Frase para cotizar:

```text
Estamos abriendo cupos de arranque para implementar casos reales con ONIA. Este
precio queda reservado hasta [FECHA] solo con pago confirmado. Luego se aplica
el precio vigente.
```

## 2. Regla principal de comisiones

La regla inicial para vendedores nuevos es:

```text
UNA VENTA COBRADA = UNA COMISION.
```

Esto significa:

- la comision nace solo cuando el cliente paga;
- se calcula sobre el dinero neto cobrado;
- no se paga sobre impuestos, pauta, dominios, hosting, pasarelas, herramientas,
  creditos IA, APIs, SMS, WhatsApp, servidores ni gastos externos;
- no se paga por promesas, reuniones, demos ni leads sin cobro;
- si falta el registro completo en Notion/CRM, la comision queda pendiente;
- si hay reembolso, chargeback o cancelacion antes de 30 dias, la comision puede
  descontarse de la siguiente liquidacion.

Este plan es inicial. A medida que empecemos a vender, cobrar y validar que los
clientes son sanos, Onia puede subir comisiones, bonos o rol por tramos. La
subida depende de ventas reales cobradas, buen seguimiento, datos completos,
margen sano y bajo nivel de reclamos. Nada sube automaticamente.

## 3. Tabla rapida de comisiones

| Categoria | Comision inicial vendedor | Como se paga |
|---|---:|---|
| DentalGest mensual | 35% | Solo sobre el primer pago neto |
| GestiOS mensual | 35% | Solo sobre el primer pago neto |
| Add-on mensual aprobado | 35% | Solo sobre el primer pago neto |
| Paginas web | 10% a 12% | Sobre el pago neto cobrado |
| Conectores y n8n | 10% | Sobre setup neto cobrado |
| Sistemas personalizados | 10% | Sobre el primer pago neto |
| Consultoria Onia | 10% a 15% | Segun paquete y margen aprobado |
| Cuidado/soporte mensual aprobado | 10% | Solo primer mes si se vende aparte y con alcance escrito |

Regla contable: Sergio y Onia siempre deben quedar por delante porque Onia paga
entrega, soporte, herramientas, mantenimiento, riesgo de cancelacion, direccion y
operacion.

## 4. Servicios y ganancias exactas

### DentalGest - suscripcion para clinicas dentales

Para clinicas que pierden pacientes por falta de seguimiento, agenda desordenada
o presupuestos que quedan en visto.

Por ahora DentalGest se vende solo como suscripcion mensual. No vender carga
inicial, migracion, capacitacion, plan anual ni descuentos especiales hasta que
Onia lo apruebe.

| Plan | Precio cliente | Que significa | Gana vendedor |
|---|---:|---|---:|
| Plan Básico | Bs. 320/mes | 300 pacientes, 2 usuarios, agenda y odontograma digital | Bs. 112.00 |
| Plan Profesional | Bs. 750/mes | 1500 pacientes, 5 usuarios, pagos, reportes y agenda inteligente | Bs. 262.50 |
| Plan Completo | Bs. 1.500/mes | pacientes, usuarios y emails ilimitados, multi-sede y soporte prioritario | Bs. 525.00 |
| Onboarding express DentalGest | Bs. 290 | configuracion inicial guiada | Bs. 29.00 |
| Configuracion asistida DentalGest | Bs. 690 | configuracion + acompanamiento inicial | Bs. 69.00 |
| Migracion + capacitacion (onboarding guiado) | **cotizado por alcance** (`pricing.ts`) | carga/migracion ligera y entrenamiento del equipo | 10% de lo cobrado |
| Agenda publica en plan Basico | Bs. 150/mes | agenda publica si el cliente esta en Basico | Bs. 52.50 |
| Usuario extra DentalGest | Bs. 70/usuario/mes | usuario adicional al limite del plan | Bs. 24.50 |
| ~~Insumos dentales en Basico~~ | 🔴 **NO EXISTE en `pricing.ts` — no cobrarlo (2026-08-27).** El inventario está incluido en todos los planes y **no tiene versión paga**: compras a crédito, proveedores, vencimientos por lote y alertas de stock bajo no las gatea ningún archivo del producto. El add-on "Inventario avanzado" se retiró el 2026-08-27. Vender un "módulo de insumos" a Bs 80 es cobrar por algo que ya es gratis. | — | — |
| ~~Inventario avanzado~~ | ⛔ **RETIRADO (Sergio, 2026-08-27: "no se cobra")** | compras a credito, proveedores, vencimientos por lote y alertas de stock bajo: siguen encendidas y gratis para todos | — |
| Chatbot WhatsApp con IA (add-on) | **Bs 390/mes o Bs 3.900/año, sin cargo inicial** | requiere aprobacion Onia, numero y Meta. **Los mensajes los cobra Meta al cliente en SU cuenta** | segun aprobacion |

Como vender DentalGest:

- buscar clinicas activas en Instagram, Google Maps y Facebook;
- detectar si publican pero no tienen flujo claro de consultas;
- preguntar si pierden pacientes por falta de seguimiento;
- ofrecer demo simple: consulta, cita, presupuesto, seguimiento, cierre;
- vender el orden antes que la tecnologia.

Mensaje inicial:

```text
Hola, soy [NOMBRE] de ONIA. Vi que su clinica recibe consultas por redes y queria
mostrarles una forma simple de ordenar pacientes, citas y presupuestos para que
menos consultas se pierdan. Es una demo corta de DentalGest, sin compromiso.
```

### GestiOS - suscripcion para negocios

Para pymes que trabajan con tareas, responsables, clientes y procesos
desordenados.

| Plan | Precio cliente | Que significa | Gana vendedor |
|---|---:|---|---:|
| GestiOS Basico | Bs. 350/mes | POS, inventario, pedidos, categorias y corte de caja | Bs. 122.50 |
| GestiOS Crecer | Bs. 530/mes | mas productos, clientes, usuarios, reportes y proveedores | Bs. 185.50 |
| GestiOS Pro | Bs. 800/mes | productos/clientes ilimitados, tienda online y pagos QR segun disponibilidad de proveedor | Bs. 280.00 |
| GestiOS Empresarial | Bs. 1,250/mes | sucursales, usuarios ilimitados, roles, auditoria y soporte prioritario | Bs. 437.50 |

Importante: SIAT no se vende por ahora en GestiOS. QR, tienda online, WhatsApp
y exportacion contable dependen de plan, proveedor y aprobacion tecnica antes de
prometerse al cliente.

Como vender GestiOS:

- buscar empresas que atienden muchos pedidos, clientes o tareas;
- preguntar donde registran pendientes y responsables;
- si todo vive en WhatsApp o Excel, hay oportunidad;
- ofrecer una demo con tablero, responsables, estados y reportes.

### Paginas web y portales

Para negocios que necesitan verse profesionales, recibir consultas y convertir
mejor.

| Servicio | Precio cliente | Nombre claro | Gana vendedor |
|---|---:|---|---:|
| Landing de Captacion | Bs. 790 | una pagina simple para captar consultas | Bs. 79.00 |
| Web Profesional | Bs. 1,500 | web de negocio con formulario y secciones clave | Bs. 180.00 |
| Web Pro Onia | Bs. 2,900 | web completa + copy + formulario + seguimiento basico | Bs. 348.00 |
| Portal o Sistema Web | desde Bs. 6,500 | login, dashboard, base de datos o MVP pequeno | desde Bs. 650.00 |
| Cuidado Web Basico | Bs. 190/mes | mantenimiento simple vendido aparte | Bs. 19.00 |
| Cuidado Web Crecimiento | Bs. 390/mes | cambios ligeros y revision mensual | Bs. 39.00 |
| Cuidado Web Pro | Bs. 690/mes | soporte mas activo y mejoras pequenas | Bs. 69.00 |

Reglas:

- dominio, hosting, email, pauta y herramientas externas se cobran aparte;
- proyectos web normalmente se cobran mitad de anticipo y mitad contra entrega;
- no prometer posicionamiento en Google garantizado;
- no prometer que una web por si sola genera ventas sin oferta, contenido y
  seguimiento.

### Oferta pausada: Videos IA / Higgsfield

Pausado como producto comercial independiente. El vendedor no debe ofrecer
videos IA, packs Higgsfield ni promesas de contenido con IA. Si un cliente pide
contenido, llevarlo primero a una web, auditoria, diagnostico o automatizacion
simple segun el dolor real.

### Conectores y automatizaciones

Esto no se vende como primer producto a un cliente frio.

Se vende cuando el cliente ya tiene contenido, web, CRM, sistema o equipo, pero
su trabajo sigue siendo manual: copia links, avisa por WhatsApp, pierde
aprobaciones, se olvida de publicar o no sabe quien reviso que.

Forma simple de explicarlo:

```text
ONIA conecta tus canales y arma un flujo para que el contenido, formularios o
datos pasen por aprobacion antes de publicarse o registrarse. Asi no dependes de
acordarte manualmente de cada paso.
```

| Servicio | Precio cliente | Que hace | Gana vendedor |
|---|---:|---|---:|
| Conexion Instagram/Meta | Bs. 690 | conectar cuenta y revisar requisitos de publicacion permitidos por Meta | Bs. 69.00 |
| Conexion TikTok | Bs. 690 | preparar canal y requisitos para publicacion asistida | Bs. 69.00 |
| Conexion YouTube Shorts | Bs. 690 | preparar canal, formato y metadata para shorts | Bs. 69.00 |
| Conexion LinkedIn | Bs. 690 | preparar publicacion para empresa o marca personal | Bs. 69.00 |
| Automatizacion simple n8n | Bs. 790 | formulario o lead -> registro -> aviso -> tarea de seguimiento | Bs. 79.00 |
| Flujo de aprobacion n8n | Bs. 1,200 | pasos de recibido, pendiente, aprobado, rechazado y notificado | Bs. 120.00 |
| Soporte/cuidado de integracion | cotizado aparte | revision recurrente, cambios, logs o incidentes segun alcance | segun acuerdo |

Cuando ofrecerlo:

- cuando el cliente ya tiene web, formulario, CRM o contactos por ordenar;
- cuando el cliente tiene varias personas aprobando contenido;
- cuando quiere conectar formularios, CRM o calendario;
- cuando ya hay web o sistema y necesita que los datos lleguen a un lugar;
- cuando pregunta "pueden dejarlo automatico?".

Como venderlo:

1. Preguntar que canal usa y quien aprueba.
2. Confirmar si tiene acceso real a la cuenta.
3. Ofrecer primero una automatizacion simple n8n.
4. Aclarar que algunas plataformas requieren permisos, revision o verificacion.
5. No prometer automatizacion total sin revisar acceso.

Mensaje para cliente:

```text
Podemos dejar un flujo simple: cuando alguien llena un formulario o llega un
lead, se registra en una tabla/CRM y te llega aviso para hacer seguimiento. Si
necesitas aprobaciones, tambien podemos armar pasos de revisar, aprobar y
notificar.
```

Notas importantes:

- WhatsApp automatico queda pendiente hasta verificacion Meta;
- Telegram, Instagram, LinkedIn, TikTok y YouTube pueden trabajarse segun acceso
  y aprobacion;
- no ofrecer envio automatico masivo sin revision legal, permisos y aprobacion;
- publicaciones client-facing requieren aprobacion.
- no incluye WhatsApp automatico, scraping masivo, APIs pagadas, login de
  terceros ni mantenimiento continuo si no se cotiza aparte.

### Consultoria e implementaciones Onia

Esto se vende cuando el cliente no sabe que necesita o tiene un desorden que no
se arregla solo con comprar una suscripcion.

Forma simple de explicarlo:

```text
Antes de venderte una herramienta, ONIA revisa tu proceso y te dice que conviene
ordenar primero: web, CRM, seguimiento, contenido, automatizacion o sistema.
```

| Servicio | Precio cliente | Que entrega Onia | Gana vendedor |
|---|---:|---|---:|
| Auditoria Express | Bs. 250 | revision de web/redes/oferta/seguimiento + 3 mejoras claras | Bs. 25.00 |
| Diagnostico + Plan de Accion | Bs. 690 | sesion, mapa del problema, prioridades y propuesta recomendada | Bs. 69.00 |
| Instalacion de Flujo Simple | Bs. 1,900 | dejar funcionando un flujo: CRM, formulario, Notion o dashboard | Bs. 190.00 |
| Implementacion Operativa | Bs. 4,900 a 6,500 | ordenar proceso, responsables, automatizaciones basicas y guia de uso | Bs. 490 a 650 |

Cuando ofrecer cada uno:

| Situacion del cliente | Que ofrecer |
|---|---|
| "No se que necesito" | Auditoria Express |
| "Quiero que me digan que hacer primero" | Diagnostico + Plan de Accion |
| "Ya se lo que quiero conectar" | Instalacion de Flujo Simple |
| "Mi equipo esta desordenado y quiero que lo armen" | Implementacion Operativa |

Como venderlo:

1. No empezar hablando de tecnologia.
2. Preguntar donde se pierden clientes, tareas o informacion.
3. Ofrecer auditoria si el problema aun no esta claro.
4. Ofrecer diagnostico si necesita decidir prioridades.
5. Ofrecer instalacion si ya hay un flujo especifico.
6. Ofrecer implementacion si hay equipo, responsables y varios pasos.

Que incluye la Auditoria Express:

- revision de web, redes, oferta, formulario/WhatsApp y seguimiento;
- detectar donde se pierden consultas o confianza;
- 3 problemas concretos;
- 3 acciones recomendadas;
- una oferta sugerida de Onia.

Que no incluye:

- implementacion;
- diseno completo;
- automatizaciones;
- promesas de ventas.

Que incluye el Diagnostico + Plan:

- sesion mas profunda;
- mapa simple del proceso actual;
- prioridades;
- presupuesto recomendado;
- siguiente propuesta clara.

Mensaje para cliente:

```text
Si todavia no sabes si necesitas web, CRM, automatizacion o contenido, podemos
empezar por una auditoria. Revisamos tu proceso actual y te decimos que conviene
ordenar primero para no gastar en algo que no vas a usar.
```

### Sistemas personalizados

Esto se vende cuando el cliente pide algo que no entra en DentalGest, GestiOS,
una pagina web o una automatizacion simple.

No se cotiza rapido por chat. Primero se vende discovery o diagnostico para
entender alcance, usuarios, datos, pantallas y costos.

| Servicio | Precio cliente | Cuando ofrecer | Gana vendedor |
|---|---:|---|---:|
| Discovery Pagado | Bs. 990 | cuando el cliente pide algo complejo y aun no esta claro | Bs. 99.00 |
| Dashboard o CRM Personalizado | desde Bs. 5,000 | cuando necesita reportes o flujo propio | desde Bs. 500 |
| Portal Cliente o MVP SaaS | desde Bs. 9,500 | login, usuarios, datos y panel | desde Bs. 950 |
| Integracion Extra | desde Bs. 1,900 | conectar herramientas, formularios o APIs | desde Bs. 190 |

Como venderlo:

- vender primero discovery si no esta claro;
- no prometer precio cerrado sin revisar alcance;
- explicar que Onia necesita entender pantallas, datos, usuarios y permisos;
- si el cliente quiere "un sistema completo", llevarlo a llamada con Sergio.

## 5. Como saber que ofrecer

| Senal del cliente | Oferta principal | Oferta secundaria |
|---|---|---|
| Clinica dental pierde consultas | DentalGest | landing dental o auditoria |
| Pyme usa Excel para todo | GestiOS | pagina web o automatizacion simple |
| Negocio no tiene web clara | Web Profesional | auditoria o CRM |
| Publica poco o se ve desordenado | Auditoria Express | web o diagnostico |
| Tiene redes pero no seguimiento | DentalGest o GestiOS | n8n aprobaciones |
| Quiere vender por anuncios | landing + CRM | auditoria y seguimiento |
| Pide algo muy especifico | Discovery Pagado | sistema personalizado |
| No sabe que necesita | Auditoria Express | roadmap |

## 6. Como hablar con clientes

### Paso 1: investigar

Antes de escribir, revisar:

- nombre del negocio;
- ciudad;
- rubro;
- Instagram, Facebook, web o Google Maps;
- si publica seguido;
- si tiene formulario o WhatsApp visible;
- dolor probable;
- producto sugerido;
- vendedor_origen.

### Paso 2: registrar

Todo lead debe ir a Notion/CRM con:

- vendedor_origen;
- responsable_actual;
- nombre;
- rubro;
- ciudad;
- web_redes;
- contacto_publico;
- dolor_probable;
- oferta_sugerida;
- prioridad;
- fuente;
- mensaje_inicial;
- estado_pipeline;
- ultimo_contacto;
- proximo_seguimiento;
- dato_critico_pendiente.

Sin registro completo, la comision queda pendiente.

### Paso 3: pedir aprobacion si corresponde

No escribir a clientes sensibles, repetidos, asignados o grandes sin aprobacion.
No contactar sin autorizacion si la lista fue asignada por Onia para revision.

### Paso 4: mensaje inicial

Plantilla general:

```text
Hola, soy [NOMBRE] de ONIA. Vi [DATO REAL DEL NEGOCIO] y creo que podriamos
ayudarles con [PROBLEMA SIMPLE]. Tenemos una solucion para [RESULTADO CONCRETO].
Puedo mostrarles una demo corta o enviarles una propuesta simple?
```

Plantilla DentalGest:

```text
Hola, soy [NOMBRE] de ONIA. Vi su clinica en [FUENTE]. Muchas clinicas reciben
consultas por redes pero pierden seguimiento en citas y presupuestos. Tenemos
DentalGest para ordenar pacientes, citas y seguimiento. Les puedo mostrar una
demo corta?
```

Plantilla GestiOS:

```text
Hola, soy [NOMBRE] de ONIA. Vi que manejan varios clientes/procesos. GestiOS
ayuda a ordenar tareas, responsables y estados para que el equipo no dependa de
WhatsApp o Excel. Les puedo enviar una demo breve?
```

Plantilla auditoria web:

```text
Hola, soy [NOMBRE] de ONIA. Vi su negocio en [FUENTE] y creo que podrian mejorar
como captan consultas desde web/redes. Podemos hacer una auditoria express:
revisamos oferta, canal de contacto y seguimiento, y les damos 3 mejoras claras.
Les interesa?
```

## 7. Que nunca prometer

Nunca prometer:

- ventas garantizadas;
- viralidad garantizada;
- resultados medicos;
- posicionamiento garantizado en Google;
- descuentos no aprobados;
- funciones no confirmadas;
- fechas de entrega sin validar con Onia;
- automatizacion de WhatsApp antes de verificacion Meta;
- uso de musica, imagenes, estilo o marca de terceros sin permiso;
- que el cliente puede pagar despues si Onia no aprobo credito.

## 8. Como manejar cambios de precio

Para evitar problemas cuando suban precios:

- una cotizacion solo reserva precio hasta la fecha escrita;
- si el cliente no pago, no tiene precio congelado;
- si pago mensual, se respeta el mes pagado;
- si pago anual, se respeta hasta terminar el periodo anual;
- upgrades, add-ons o nuevos servicios usan precio vigente;
- descuentos especiales deben tener limite claro de clientes, fecha o meses;
- cambios de precio se avisan con anticipacion cuando el cliente ya esta activo.

Frase para cotizar:

```text
Este precio queda reservado hasta [FECHA] si se confirma con pago. Si se confirma
despues, se aplica el precio vigente de ONIA.
```

Frase para subir precio a cliente activo:

```text
Tu plan actual se mantiene hasta [FECHA/PERIODO PAGADO]. Desde la siguiente
renovacion el precio vigente sera [NUEVO PRECIO]. Si prefieres, podemos revisar
un plan menor o un pago anual para mantener mejor tarifa.
```

## 9. Trabajo diario del vendedor

Cada dia:

- buscar nuevos prospectos reales;
- registrar datos completos en CRM;
- enviar mensajes aprobados;
- hacer seguimiento sin insistir de forma agresiva;
- agendar demos o llamadas;
- actualizar estado del pipeline;
- avisar oportunidades calientes;
- pedir apoyo si el cliente pregunta algo tecnico;
- cerrar con pago en canal aprobado por Onia.

Meta diaria sugerida:

- 20 prospectos revisados;
- 10 mensajes bien personalizados;
- 5 seguimientos;
- 1 a 2 oportunidades para demo;
- CRM actualizado al final del dia.

## 10. Regla final

El vendedor gana cuando trae clientes reales, cobra ventas reales y deja todo
ordenado. Onia puede mejorar comisiones y roles, pero primero protege caja,
entrega, soporte y reputacion.
