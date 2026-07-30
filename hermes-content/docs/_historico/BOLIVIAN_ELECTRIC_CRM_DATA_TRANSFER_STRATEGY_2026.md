# Bolivian Electric - estrategia CRM gerencial y traspaso de datos 2026

## Decision comercial

El CRM inicial debe ser para gerencia, no para toda la empresa.

Alcance recomendado:

- 5 usuarios aproximadamente.
- Vista gerencial de clientes, cotizaciones, seguimiento y oportunidades.
- Dashboard de control para saber que esta pasando sin pedir reportes manuales.
- Carga inicial controlada desde reportes/exportaciones del sistema actual.
- Sin escribir ni modificar datos dentro de los servidores de Bolivian en fase 1.

Esto baja el costo operativo mensual, pero no elimina el costo tecnico principal:
entender los datos, limpiarlos, mapearlos e importarlos sin romper seguridad.

## Precio recomendado ajustado

### Opcion de entrada - CRM gerencial con carga inicial

Precio oportunidad:

- **Implementacion CRM gerencial:** Bs. 6.900
- **Soporte mensual:** Bs. 690/mes

Incluye:

- Hasta 5 usuarios de gerencia.
- Hasta 1.000 registros iniciales importados desde CSV/Excel aprobado.
- Clientes/contactos.
- Cotizaciones u oportunidades si existen en reporte exportable.
- Estados basicos de seguimiento.
- Dashboard gerencial.
- 1 capacitacion.
- Documentacion corta de uso.

No incluye:

- Conexion directa a base de datos interna.
- Sincronizacion automatica permanente.
- Limpieza pesada de datos historicos.
- Pasarela de pago.
- WhatsApp API.
- Migracion completa de todo el sistema actual.

### Opcion recomendada - Piloto comercial completo

Mantener el paquete de **Bs. 9.900** si incluye:

- CRM gerencial.
- Web de captacion.
- Chatbot/base de conocimiento inicial.
- Catalogo funcional o compra/cotizacion asistida.
- Primera carga de datos limitada.

Esta sigue siendo la mejor opcion si queremos demostrar valor visible y abrir
fase 2. Si solo aceptan CRM gerencial, usar Bs. 6.900.

### Integracion con servidores - fase separada

No incluirla dentro del precio oportunidad sin auditoria.

Rango sugerido despues de revisar servidores:

- **Exportacion manual/periodica controlada:** Bs. 1.500 a Bs. 2.900 setup.
- **Sincronizacion por archivo programado:** Bs. 3.500 a Bs. 5.900 setup.
- **Conexion read-only por VPN/API/base de datos:** Bs. 6.900 a Bs. 12.900 setup.

## Gastos variables esperados

### Si usan servidores propios

Puede bajar el costo cloud, pero aparecen costos operativos:

- Backups externos: Bs. 50 a Bs. 200/mes segun volumen.
- Dominio/subdominio: normalmente ya lo tienen; si falta, costo externo.
- SSL: puede ser gratis con Let's Encrypt si TI lo permite.
- Monitoreo basico: Bs. 0 a Bs. 150/mes segun herramienta.
- Mantenimiento servidor, parches y soporte TI: debe asumirlo Bolivian o
  cotizarse aparte.
- VPN/acceso remoto seguro: costo variable segun infraestructura.

### Si usamos nube para el piloto

Referencias actuales revisadas:

- Vercel: plan Free para pruebas; Pro desde USD 20/mes mas uso.
- Supabase: Free para prototipo; Pro USD 25/mes por organizacion/proyecto
  productivo, con uso variable despues de cuotas.
- OpenAI API: costo por tokens; para chatbot inicial debe tener limite mensual.
- WhatsApp Business Platform: Meta cobra por mensaje entregado segun pais y
  categoria; no incluir en precio fijo.

Para el piloto, estimacion conservadora:

- Sin WhatsApp API: Bs. 0 a Bs. 250/mes de herramientas externas.
- Con IA moderada: Bs. 70 a Bs. 350/mes si se limita el uso.
- Con WhatsApp API real: variable y externo; debe aprobarlo Bolivian.

## Que debemos requerir para traspaso de informacion

### 1. Autorizacion formal

Antes de recibir datos:

- Autorizacion escrita del dueno/gerencia.
- Responsable interno asignado.
- Responsable tecnico de servidores asignado.
- Alcance autorizado: que tablas, reportes o modulos se pueden revisar.
- Confirmacion de que ONIA puede recibir, procesar y almacenar esa informacion
  para implementar el CRM.

No aceptar contrasenas personales ni accesos prestados.

### 2. Inventario tecnico minimo

Pedir al responsable tecnico:

- Donde esta alojado el sistema actual: servidor local, VPS, nube o mixto.
- Sistema operativo del servidor.
- Motor de base de datos si lo conocen: SQL Server, MySQL, PostgreSQL, otro.
- Forma actual de respaldo.
- Si existen reportes exportables a Excel/CSV/PDF.
- Si existe API o solo interfaz de usuario.
- Si hay ambiente de pruebas.
- Horarios en que se puede auditar sin afectar operaciones.
- Restricciones de acceso remoto.

### 3. Exportaciones preferidas

Orden recomendado de menor a mayor riesgo:

1. Reportes exportados manualmente a Excel/CSV.
2. Exportacion programada diaria/semanal a carpeta segura.
3. Vista SQL read-only creada por el tecnico de Bolivian.
4. Replica o backup restaurado en ambiente de pruebas.
5. API oficial si existe.

Evitar al inicio:

- Acceso directo con usuario administrador.
- Escritura sobre base productiva.
- Copia completa de base de datos sin autorizacion.
- Datos personales innecesarios.
- Dumps con contrasenas, tokens o informacion bancaria.

## Datos que si necesitamos para el CRM

Minimo util:

- Clientes/empresas.
- Contactos: nombre, telefono, email, ciudad, empresa.
- Vendedores o responsables.
- Sucursales/departamentos.
- Cotizaciones u oportunidades: fecha, cliente, estado, monto si esta permitido,
  responsable, observacion.
- Productos/categorias: codigo, nombre, categoria, unidad, descripcion corta.
- Estado comercial: nuevo, cotizado, seguimiento, ganado, perdido.

Opcional fase 2:

- Historial de compras.
- Inventario por sucursal.
- Margenes.
- Costos.
- Proveedores.
- Informacion privada de gerencia.

Los datos sensibles de costos, margenes y proveedores deben ir en dashboard
privado, no en el CRM general.

## Estrategia tecnica

### Fase A - Sin tocar servidor

Objetivo:

- Crear CRM gerencial con datos de muestra o exportacion manual.

Acciones:

- Pedir 1 exportacion de clientes.
- Pedir 1 exportacion de cotizaciones/oportunidades si existe.
- Pedir 1 exportacion de categorias/productos.
- Limpiar columnas.
- Importar a staging.
- Validar con gerencia.

Resultado:

- CRM usable rapidamente.
- Riesgo bajo.
- Sin dependencia fuerte de TI.

### Fase B - Traspaso controlado

Objetivo:

- Repetir importaciones sin trabajo manual excesivo.

Acciones:

- Definir formato oficial CSV/Excel.
- Crear plantilla de importacion.
- Crear script de carga.
- Crear registro de errores.
- Validar duplicados.
- Cargar cada semana o cada dia segun necesidad.

Resultado:

- El CRM se actualiza con informacion real sin tocar produccion.

### Fase C - Sincronizacion segura

Objetivo:

- Automatizar informacion aprobada desde servidores.

Acciones:

- Crear usuario read-only.
- Crear vistas SQL limitadas o endpoint/API.
- Acceso por VPN o IP permitida.
- Ejecutar sync fuera de horario critico.
- Guardar logs.
- Nunca escribir al sistema actual desde ONIA en esta fase.

Resultado:

- CRM gerencial alimentado por datos reales con control.

### Fase D - Integracion avanzada

Solo despues de aprobacion:

- Inventario.
- Compra/cotizacion funcional conectada.
- Reportes privados para dueno.
- Automatizaciones internas.
- Alertas por WhatsApp/email.

## Arquitectura recomendada

Para fase 1:

- CRM ONIA en entorno controlado.
- Base de datos separada.
- Datos importados por archivo aprobado.
- Acceso solo para gerencia.
- Web/cotizador separado del servidor interno.

Para fase 2:

- Conector read-only hacia servidores de Bolivian.
- Sincronizacion periodica.
- Dashboard privado por rol.
- Backups y logs.

Para fase 3:

- Integraciones profundas solo si el sistema actual lo permite y si existe
  responsable tecnico estable.

## Mensaje para pedir la informacion

Hola, para implementar el CRM gerencial sin afectar su operacion actual,
necesitamos trabajar primero con una exportacion controlada de informacion.

No necesitamos usuarios personales ni acceso administrador. Lo ideal es que el
area tecnica o la persona responsable nos entregue reportes exportados en
Excel/CSV de clientes, contactos, cotizaciones u oportunidades, categorias de
productos y responsables comerciales.

Con eso armamos una primera carga del CRM para gerencia, validamos que los datos
esten correctos y luego definimos si conviene automatizar la actualizacion desde
servidores mediante un acceso read-only, una exportacion programada o una API.

La fase inicial no modifica su sistema actual. Solo leemos informacion aprobada
y la usamos para construir el panel gerencial.

## Riesgos y controles

Riesgos:

- Datos duplicados o incompletos.
- Reportes sin estructura clara.
- Permisos informales.
- Dependencia de una sola persona tecnica.
- Exponer datos sensibles a usuarios que no deben verlos.
- Intentar integrar servidores antes de entender el sistema.

Controles:

- Autorizacion escrita.
- Exportaciones limitadas.
- Base staging antes de produccion.
- Validacion por gerencia.
- Roles y permisos.
- Registro de importacion.
- Backups antes de cualquier conexion.

## Decision recomendada para Sergio

Presentar asi:

"El CRM seria primero para gerencia, unas 5 personas. No necesitamos mover toda
la empresa al sistema desde el primer dia. Empezamos con una carga controlada de
clientes, cotizaciones y productos desde reportes aprobados. Asi ustedes ven el
valor rapido y sin tocar el servidor productivo. Si luego quieren que se actualice
solo, hacemos una fase de integracion read-only con su tecnico."

Precio recomendado:

- Si es solo CRM gerencial con carga inicial: **Bs. 6.900 + Bs. 690/mes**.
- Si quieren CRM + web + chatbot + catalogo/cotizador: **Bs. 9.900 + Bs. 900/mes**.
- Cualquier conexion directa a servidores se cotiza despues de auditoria.
