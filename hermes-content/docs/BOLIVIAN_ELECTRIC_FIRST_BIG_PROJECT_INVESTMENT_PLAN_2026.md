# Bolivian Electric First Big Project Readiness Plan 2026

Estado: borrador interno ONIA
Fecha: 2026-06-20
Uso: decidir si Bolivian Electric conviene como primer proyecto grande y que rol
debe tomar Sergio/ONIA. No usar este documento como presupuesto interno de ONIA.

## Veredicto

Si es buena idea como primer proyecto grande, pero solo si se maneja como
programa por fases y no como "voy a construir todo". Bolivian Electric puede ser
el mejor caso real de ONIA porque combina ventas, inventario, importaciones,
contabilidad, web, marketing, atencion al cliente, sucursales, servidores y
equipo humano.

Tambien puede ser el peor proyecto si Sergio entra sin autoridad, sin alcance,
sin responsables internos y sin medir impacto. La empresa es familiar, pero eso
no elimina el riesgo: lo aumenta, porque es facil que el trabajo se vuelva favor
permanente.

Decision recomendada:

```text
Entrar con un programa de 90 dias: diagnostico, pilotos y sistema operativo de
mejora continua. No intentar reemplazar TR4 ni construir un ERP completo.
```

## Aclaracion de presupuesto

Este documento ya no asume un monto de inversion para Bolivian Electric. El
presupuesto personal/interno de ONIA debe manejarse en un plan separado.

Regla:

- Bolivian Electric se evalua por alcance, autoridad y pilotos medibles.
- La inversion interna de ONIA no debe confundirse con presupuesto del cliente.
- Si Bolivian Electric decide financiar pilotos, se cotiza aparte por fase.

## Riesgo principal

El riesgo no es tecnico. El riesgo es de alcance y politica interna.

Riesgos:

- intentar automatizar todo al mismo tiempo;
- tocar servidores locales sin mapa ni backup;
- quedar como soporte informal de todos;
- que cada area pida cosas distintas sin prioridad;
- que el equipo vea el cambio como critica;
- depender solo de Sergio para construir, capacitar, documentar y mantener;
- gastar en herramientas antes de saber que proceso duele mas;
- prometer integraciones con TR4 sin confirmar acceso, API o exportaciones.

## Posicion que debe tomar Sergio

Titulo recomendado:

```text
Responsable externo de IA, Automatizacion y Mejora Operativa.
```

No posicionarse como:

- chico de sistemas;
- community manager;
- desarrollador del chatbot;
- ayudante de marketing;
- reemplazo de TR4;
- soporte de servidores.

El rol debe tener estas facultades:

- entrevistar areas;
- mapear procesos;
- priorizar pilotos;
- pedir datos necesarios;
- proponer herramientas;
- documentar procesos;
- capacitar equipos;
- reportar avances a gerencia;
- decidir que NO se automatiza todavia.

Frase de posicionamiento:

```text
Quiero ayudar a que Bolivian Electric gane velocidad, control y capacidad de
respuesta. No vengo a reemplazar lo que ya existe. Vengo a ordenar procesos,
capacitar al equipo y crear pilotos medibles con IA y automatizacion.
```

## No construir solo

Sergio puede liderar, disenar, prototipar y construir pilotos. No debe intentar
construir solo toda la transformacion.

Se puede hacer solo:

- diagnostico;
- entrevistas;
- mapas de procesos;
- tablero simple;
- prototipo de CRM;
- automatizacion simple;
- base de conocimiento inicial;
- capacitacion inicial;
- auditoria web;
- documento de propuesta.

No conviene hacer solo:

- integracion profunda con TR4;
- mantenimiento de servidores locales;
- migracion de datos critica;
- ciberseguridad interna;
- ERP alternativo;
- facturacion/contabilidad sensible;
- automatizacion productiva de WhatsApp sin Meta listo;
- sistema multi-sucursal completo desde cero.

Regla practica:

```text
Sergio lidera estrategia y prototipos. Para servidores, seguridad, integraciones
criticas y despliegues internos, se usa soporte tecnico externo o equipo interno.
```

## Como usar los servidores locales

No asumir que "hay servidores" significa que conviene instalar todo ahi.

Primero auditar:

1. Que servidores existen?
2. Donde estan fisicamente?
3. Que sistema operativo usan?
4. Quien los administra?
5. Que backups existen?
6. Que servicios corren?
7. Que datos criticos guardan?
8. Que puertos estan abiertos?
9. Que pasa si se apagan?
10. Quien tiene credenciales?

Regla de arquitectura:

- pilotos sin datos sensibles pueden vivir en cloud o VPS controlado;
- datos internos sensibles deben quedarse en infraestructura aprobada;
- integraciones con TR4 deben empezar con exportaciones CSV/Excel antes de API;
- servidores locales no se tocan sin backup, inventario y responsable.

Primer paso tecnico:

```text
Auditoria read-only de infraestructura: inventario, servicios, backups,
responsables, riesgos y oportunidades. Sin cambios productivos.
```

## Gastos que si tienen sentido

### 1. Herramientas de IA

Comprar solo para el equipo piloto al inicio, no para toda la empresa.

Uso:

- gerencia;
- importaciones;
- marketing;
- ventas lider;
- contabilidad lider.

Regla:

- primero 2-5 usuarios;
- politica de datos;
- casos de uso concretos;
- medicion semanal.

Costos actuales a verificar antes de comprar:

- ChatGPT Business: precio por usuario/mes y minimo de asientos segun OpenAI.
- OpenAI API: costo variable por tokens; usar limite mensual.
- Google Workspace: costo por usuario/mes segun plan.

### 2. Automatizacion y tableros

Opciones:

- n8n self-hosted o gestionado;
- Google Sheets controlado;
- Notion/Airtable si no hay datos sensibles;
- dashboard interno simple;
- scripts de importacion de CSV/Excel.

Regla:

- no empezar por software caro;
- empezar con flujo visible y medible.

### 3. Web y experiencia de cotizacion

Gasto con retorno probable:

- auditoria UX;
- mejora de formularios;
- tracking de origen;
- confirmacion automatica;
- derivacion a vendedor;
- registro en CRM;
- contenido tecnico por producto.

No gastar primero en:

- rediseno visual completo sin medir conversion;
- ecommerce completo si el flujo real es cotizacion tecnica;
- chatbot antes de tener base de conocimiento y responsables.

### 4. Infraestructura y seguridad

Gasto necesario antes de tocar servidores:

- inventario de servidores;
- backup;
- usuarios/permisos;
- monitoreo;
- documentacion de servicios;
- plan de rollback.

No gastar en:

- nuevo servidor si no se sabe que problema resuelve;
- migraciones grandes sin plan;
- exponer servicios internos a internet sin seguridad.

### 5. Capacitacion

Capacitacion recomendada:

- IA para gerencia: decisiones, reportes, resumen ejecutivo.
- IA para ventas: seguimiento, respuestas, objeciones, fichas tecnicas.
- IA para marketing: contenido tecnico y calendario.
- IA para contabilidad: resumen, clasificacion, checklist.
- IA para importaciones: documentos, proveedores, fechas, costos.

Capacitacion debe terminar con:

- prompts por area;
- reglas de seguridad;
- ejemplos reales;
- tareas semanales;
- responsable interno.

## Primeros proyectos recomendados

### Proyecto 1 - CRM de cotizaciones y seguimiento

Por que primero:

- toca ventas;
- genera impacto visible;
- no requiere reemplazar TR4;
- permite medir oportunidades perdidas;
- prepara el futuro chatbot.

Alcance:

- entrada manual o formulario;
- cliente;
- sucursal;
- producto;
- vendedor;
- monto estimado;
- estado;
- proxima accion;
- fecha de seguimiento;
- motivo de perdida.

Resultado esperado:

- menos cotizaciones olvidadas;
- mejor reporte gerencial;
- base real para automatizacion.

### Proyecto 2 - Dashboard de importaciones y gastos

Por que:

- ayuda directo a gerencia y al padre de Sergio;
- controla capital, fechas y costos;
- puede generar ahorro real;
- reduce dependencia de memoria/correos.

Alcance:

- proveedor;
- orden;
- documentos;
- pagos;
- fechas;
- costos estimados;
- costos reales;
- estado;
- alertas.

Resultado esperado:

- menos sorpresas;
- mejor planificacion;
- gerencia ve riesgos antes.

### Proyecto 3 - Base de conocimiento comercial

Por que:

- aprovecha catalogos, manuales y experiencia tecnica;
- ayuda ventas, marketing y atencion;
- no depende de WhatsApp API;
- prepara chatbot interno y externo.

Alcance:

- FAQ;
- fichas por linea;
- respuestas sugeridas;
- plantillas de cotizacion;
- guias para vendedores;
- contenido para redes.

Resultado esperado:

- respuestas mas rapidas;
- menor dependencia de expertos;
- mejor contenido tecnico.

## Plan de 90 dias

### Dias 1-7: diagnostico serio

Entregables:

- entrevistas;
- mapa de procesos;
- top 10 problemas;
- top 5 ahorros;
- top 5 oportunidades comerciales;
- recomendacion de pilotos.

### Dias 8-30: piloto comercial

Entregables:

- CRM de cotizaciones;
- tablero basico;
- responsables;
- reporte semanal.

### Dias 31-60: piloto gerencial

Entregables:

- importaciones/gastos;
- alertas;
- documentos;
- reporte ejecutivo.

### Dias 61-90: adopcion y formalizacion

Entregables:

- capacitacion por area;
- manuales cortos;
- base de conocimiento;
- propuesta de rol mensual;
- backlog 6 meses.

## Condiciones para que sea buen proyecto

Debe existir:

- sponsor de gerencia;
- permiso para entrevistar areas;
- acceso a reportes no sensibles o exportaciones;
- responsable interno por piloto;
- reunion semanal de avance;
- presupuesto separado;
- definicion de que no se toca;
- autorizacion para documentar.

Si falta esto, el proyecto debe quedarse en diagnostico.

## Indicadores de exito

Medir:

- cotizaciones registradas;
- cotizaciones con seguimiento;
- tiempo de respuesta;
- oportunidades recuperadas;
- gastos clasificados;
- vencimientos alertados;
- documentos faltantes detectados;
- horas ahorradas por area;
- contenido generado desde preguntas reales;
- usuarios capacitados;
- procesos documentados.

No prometer:

- aumento garantizado de ventas;
- ahorro garantizado;
- reemplazo de personal;
- automatizacion total;
- integracion completa con TR4 sin auditoria.

## Siguiente paso recomendado

El martes no vender "transformacion total". El martes levantar evidencia.

Despues de la visita, presentar a gerencia:

```text
Vi X problemas repetidos, Y oportunidades de ahorro y Z puntos donde se pierden
ventas o tiempo. Recomiendo empezar con dos pilotos de 30 dias: seguimiento de
cotizaciones e importaciones/gastos. Si esos pilotos muestran impacto,
formalizamos un programa mensual de mejora operativa con ONIA.
```

## Decision final

Bolivian Electric si puede ser el primer gran caso de ONIA. Pero el producto no
debe ser "chatbot". El producto debe ser:

```text
Sistema de mejora operativa con IA para empresa industrial familiar.
```

El primer objetivo no es automatizar todo. Es ganar autoridad, demostrar impacto
y construir una base de datos/procesos que permita automatizar con seguridad.
