---
title: "Política de Privacidad"
slug: "privacidad"
status: "borrador"
version: "0.1"
updatedAt: "2026-07-25"
---

> **BORRADOR — pendiente de revisión por abogado matriculado en Bolivia. No constituye asesoría legal.**

# Política de Privacidad — Plataforma Onia

Esta Política explica cómo la plataforma **Onia** (operada por **OniaAgency**
[REVISAR ABOGADO: confirmar razón social exacta, NIT y domicilio legal], Santa
Cruz de la Sierra, Estado Plurinacional de Bolivia) trata los datos personales
cuando presta su software de gestión. Documento complementario: los
[Términos y Condiciones](/terminos).

## 1. Dos tipos de datos, dos roles

Distinguimos según de quién sean los datos:

| Datos | Quién decide sobre ellos | Rol de Onia |
|---|---|---|
| Datos de tu cuenta (titular del negocio, tus usuarios, facturación, soporte) | **Onia** | Responsable del tratamiento |
| Datos que vos cargás en la plataforma — en especial **datos de TUS clientes o pacientes** | **Tu negocio** | Encargado: Onia solo los trata por tu instrucción y para prestarte el servicio |

En la práctica: **tu cliente es tu cliente, no de Onia**. Vos decidís qué
registrás, a quién contactás y con qué consentimiento; Onia pone la herramienta y
custodia los datos según esta Política y el contrato. Sos responsable de contar
con la base o el consentimiento necesarios para cargar y tratar los datos de tus
clientes o pacientes. [REVISAR ABOGADO: conveniencia de un anexo de tratamiento
de datos firmado con cada cliente, en especial en salud.]

## 2. Qué datos recogemos

2.1. **Datos de cuenta:** nombre y datos de contacto tuyos y de tus usuarios,
credenciales de acceso (contraseñas almacenadas con hash, nunca en claro), datos
de facturación (NIT/CI, razón social) e historial de pagos.

2.2. **Datos de uso:** registros técnicos (logs) de acceso y actividad,
necesarios para seguridad, soporte y facturación. No los usamos para publicidad.

2.3. **Datos que vos cargás (de TUS clientes):** la información operativa de tu
negocio — agenda, contactos, ventas, cotizaciones, inventario, mensajes en cola
de aprobación. En verticales de salud esto incluye datos de pacientes (historia
clínica, tratamientos, citas), que son **categoría sensible**: solo los trata el
personal que vos autorizás, cada cuenta está aislada de las demás, y el acceso
del personal de Onia se limita al soporte técnico estrictamente necesario, bajo
deber de confidencialidad.

2.4. Onia no solicita ni necesita datos como creencias religiosas, afiliación
política o biometría. Si un cliente los carga en campos libres, es bajo su
responsabilidad.

## 3. Para qué los usamos

- Prestar, operar y mantener el servicio contratado.
- Autenticar usuarios y proteger la seguridad de la plataforma.
- Cobrar y facturar conforme a la normativa boliviana aplicable.
- Dar soporte.
- Preparar borradores y sugerencias con IA **dentro de tu cuenta y bajo tu
  aprobación** (ver §6).
- Cumplir obligaciones legales y requerimientos de autoridad competente.

**Lo que NO hacemos:**

- **No vendemos datos.** Ni tuyos ni de tus clientes, a nadie, nunca.
- **No entrenamos modelos de IA con tus datos** ni con los de tus clientes — ni
  modelos propios ni de terceros (ver §5 y §6).
- No hacemos minería de tus datos para fines comerciales propios ni de terceros.
- No enviamos publicidad a los clientes de tu negocio.

## 4. Dónde viven los datos

4.1. **Base de datos del producto:** en **Supabase**, un servicio de base de
datos en la nube sobre infraestructura de proveedores cloud, con servidores
ubicados fuera de Bolivia. [REVISAR ABOGADO: implicancias de la transferencia
internacional de datos, en especial datos de salud.]

4.2. **Automatización y agentes:** en un servidor privado administrado por Onia.

4.3. **Opción on-premise:** para clientes que lo requieran, Onia puede ofrecer
instalación en infraestructura del propio cliente ("on-premise"), bajo cotización
y contrato específico. En esa modalidad, la custodia física de los datos es del
cliente.

## 5. Subprocesadores (proveedores que tocan datos)

Onia usa proveedores para operar el servicio. Solo acceden a lo mínimo necesario
y bajo sus propios compromisos de confidencialidad y seguridad:

| Proveedor | Para qué | Notas |
|---|---|---|
| Hosting y base de datos en la nube (Supabase y proveedores de infraestructura) | Alojar y respaldar los datos del producto | Cifrado en tránsito y en reposo; aislamiento por cliente |
| Proveedores de modelos de IA (vía API) | Generar borradores y sugerencias | Solo modalidades que **no entrenan** con los datos enviados; se envía el mínimo contexto necesario |
| WhatsApp (Meta) | Mensajería con tus clientes cuando activás ese canal | Los mensajes pasan por la infraestructura de Meta bajo sus propios términos |

Onia mantendrá esta lista actualizada y avisará ante cambios de subprocesadores
que traten datos de tus clientes. [REVISAR ABOGADO: mecanismo y plazo de aviso.]

## 6. IA y tus datos

- Los agentes de IA trabajan **dentro de tu cuenta**, con el mínimo de datos
  necesario para cada tarea.
- **Toda comunicación saliente requiere tu aprobación previa** (cola de
  pendientes). Onia no envía nada por sí sola.
- Los datos enviados a proveedores de IA se procesan bajo modalidades que no los
  usan para entrenar sus modelos.
- Onia tampoco entrena modelos propios con datos de clientes.

## 7. Seguridad

Medidas aplicadas (esfuerzo razonable, mejora continua):

- Cifrado de datos **en tránsito** (TLS/HTTPS) y **en reposo**.
- **Aislamiento por cliente** con reglas de acceso a nivel de fila en la base de
  datos.
- Contraseñas con hash; accesos administrativos con principio de mínimo
  privilegio.
- **Copias de seguridad cifradas** y periódicas.
- Registro de actividad para detectar accesos anómalos.

Ningún sistema es infalible. Si ocurriera un incidente de seguridad que afecte
datos personales, Onia lo notificará al cliente afectado sin demora indebida, con
lo que se sepa del alcance y las medidas tomadas.

## 8. Retención y eliminación

- **Durante el servicio:** los datos se conservan mientras la cuenta esté
  activa. La suspensión por falta de pago bloquea el acceso pero **no borra
  datos**.
- **Al terminar el contrato:** podés exportar tus datos (formato CSV/JSON)
  dentro de los **30 días** posteriores a la terminación. Transcurridos **90
  días** desde la terminación, Onia elimina tus datos de los sistemas activos.
  [REVISAR ABOGADO: validar plazos.]
- **Backups:** las copias de seguridad cifradas rotan en un ciclo de hasta **30
  días** adicionales; los datos eliminados desaparecen de los backups al
  completarse la rotación.
- **Excepciones:** se conserva lo que la normativa boliviana aplicable exija
  retener (por ejemplo, registros de facturación) por el plazo correspondiente.
- **Importante:** los plazos legales de conservación de registros del negocio
  (por ejemplo, expedientes clínicos) son obligación tuya. Exportar antes del
  borrado es tu responsabilidad; Onia te lo recordará antes de eliminar.

## 9. Tus derechos (y los de tus clientes)

9.1. **Sobre datos de cuenta** (Onia responsable): vos y tus usuarios pueden
pedir a Onia **acceso, rectificación, actualización, eliminación o exportación**
de sus datos, por los canales del §12. Onia responderá en un plazo objetivo de
**15 días hábiles**.

9.2. **Sobre datos de tus clientes** (Onia encargado): tus clientes o pacientes
deben dirigir sus solicitudes **a tu negocio**, que es quien decide sobre esos
datos. Onia te da las herramientas para atenderlas (buscar, corregir, exportar o
eliminar un registro). Si una persona contacta a Onia directamente, la
derivaremos a tu negocio y te avisaremos.

9.3. Sin perjuicio de lo anterior, las personas conservan los derechos y
acciones que les reconoce la normativa boliviana aplicable en materia de
privacidad y protección de datos. [REVISAR ABOGADO: redacción sobre las vías
constitucionales y legales vigentes.]

## 10. Menores de edad

La plataforma no está dirigida a menores y Onia no recolecta datos de menores
por cuenta propia. Los negocios clientes pueden registrar clientes o pacientes
menores de edad como parte de su atención, bajo el consentimiento de sus padres
o tutores, que es responsabilidad del negocio obtener y documentar. [REVISAR
ABOGADO.]

## 11. Cambios a esta Política

Onia puede actualizar esta Política. Los cambios materiales se avisarán con al
menos **30 días** de anticipación por los canales de la plataforma. La versión
vigente y su fecha estarán siempre publicadas.

## 12. Contacto

Solicitudes sobre datos personales: [REVISAR ABOGADO / COMPLETAR: correo oficial
y teléfono/WhatsApp de contacto]. Santa Cruz de la Sierra, Estado Plurinacional
de Bolivia.

---

> **BORRADOR — pendiente de revisión por abogado matriculado en Bolivia. No
> constituye asesoría legal.** Las referencias normativas se hacen de forma
> general ("normativa boliviana aplicable"); el abogado debe confirmar el marco
> vigente de protección de datos en Bolivia y las normas sectoriales de salud
> antes de publicar.
