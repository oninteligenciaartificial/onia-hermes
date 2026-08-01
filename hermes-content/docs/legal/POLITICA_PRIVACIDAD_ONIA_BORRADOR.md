# Política de Privacidad — Plataforma ONIA

> **BORRADOR — PARA REVISIÓN DE ABOGADO ANTES DE USAR.**
> Este documento fue redactado por un asistente técnico-legal, NO por un abogado
> habilitado en Bolivia. No constituye asesoría legal. No publicar hasta que un
> abogado boliviano lo revise, corrija y apruebe — en especial por tratarse de
> **datos de salud** (categoría sensible).
>
> Versión: 0.1 (borrador) — Fecha: 25 de julio de 2026
> Documento gemelo: `TERMINOS_Y_CONDICIONES_ONIA_BORRADOR.md`

---

## 0. Puntos que el abogado DEBE revisar antes de usar

1. **Marco legal de datos personales en Bolivia (§10).** Bolivia no cuenta —hasta
   donde este borrador pudo verificar— con una ley integral de protección de datos
   personales vigente (estado real: **UNKNOWN**; hubo anteproyectos en trámite).
   El abogado DEBE confirmar el estado normativo a la fecha de publicación y ajustar
   toda la política si ya rige una ley específica o su reglamento.
2. **Roles responsable/encargado (§1).** La figura "responsable del tratamiento" /
   "encargado del tratamiento" está tomada de estándares internacionales (tipo
   RGPD). Sin ley boliviana que la defina, validar cómo formalizarla: se recomienda
   un **anexo de tratamiento de datos** firmado con cada clínica. ¿Es exigible tal
   cual está?
3. **Datos de salud (§2.4).** Verificar obligaciones específicas del sector salud:
   Ley N.° 3131 de 2005 (Ejercicio Profesional Médico — secreto médico), Código de
   Salud (DS 15629 de 1978) y normativa del Ministerio de Salud sobre expediente
   clínico (norma exacta aplicable a consultorios dentales privados: **UNKNOWN** —
   confirmar). ¿Puede una clínica delegar el almacenamiento del expediente en un
   tercero cloud fuera de Bolivia?
4. **Transferencia internacional (§4).** Los datos viven en Supabase (nube, servidores
   fuera de Bolivia). Sin ley específica, ¿alguna norma sectorial de salud exige
   almacenamiento local o consentimiento reforzado? (**UNKNOWN** — confirmar).
5. **Consentimiento de pacientes.** El paciente es de la clínica, no de ONIA: validar
   qué texto debe incluir la clínica en sus propios consentimientos para cubrir el
   uso de un sistema informático con IA y mensajería (ONIA puede proveer un modelo,
   pero el abogado debe redactarlo).
6. **Retención y plazos (§8).** Los plazos propuestos (90 días post-terminación,
   backups 30 días) son operativos, no legales. Verificar plazos mínimos de
   conservación de registros clínicos en Bolivia (**UNKNOWN** — en salud suelen ser
   de varios años y aplican A LA CLÍNICA; aclarar que exportar antes de borrar es
   obligación del cliente).
7. **Sub-procesadores (§5).** Validar el mecanismo de "aviso de cambios de
   sub-procesadores" y si requiere consentimiento previo del cliente.
8. **Habeas data / Acción de Protección de Privacidad (§9).** Confirmar la redacción
   sobre CPE arts. 130-131 y el procedimiento (Código Procesal Constitucional, Ley
   N.° 254 de 2012 — verificar artículos exactos).
9. **Ley N.° 164 y DS 1793 (§10).** Verificar vigencia y alcance real del art. 56 de
   la Ley 164 (inviolabilidad y secreto de las comunicaciones / protección de datos
   en TIC) y de las definiciones del DS 1793 para sustentar esta política.
10. **WhatsApp / Meta (§5).** Cuando el chatbot WhatsApp salga de desarrollo: revisar
    los términos de WhatsApp Business Platform y qué texto hay que mostrar a los
    pacientes que escriben por ese canal.
11. **Menores de edad (§11).** Las clínicas dentales atienden menores: validar el
    texto sobre datos de menores cargados por la clínica con consentimiento de padres
    o tutores (Código Niña, Niño y Adolescente, Ley N.° 548 — verificar pertinencia).
12. **Identidad del responsable (§13).** Completar razón social, NIT y domicilio
    (mismos placeholders que en los Términos).

---

## 1. Quiénes somos y qué rol cumplimos

1.1. Esta Política explica cómo la plataforma ONIA (operada por **[RAZÓN SOCIAL —
completar]**, NIT **[5371375010 — verificar]**, Santa Cruz de la Sierra, Bolivia)
trata los datos personales cuando presta su software de gestión (incluido el vertical
**DentalGest** para clínicas dentales).

1.2. Distinguimos dos roles, según de quién sean los datos:

| Datos | Quién decide sobre ellos (responsable) | Rol de ONIA |
|---|---|---|
| Datos de la cuenta del cliente (dueño de la clínica/negocio, sus usuarios, facturación, soporte) | **ONIA** | Responsable del tratamiento |
| Datos que el cliente carga en la plataforma — en especial **datos de pacientes** (historias, citas, tratamientos) | **La clínica / el negocio cliente** | **Encargado (procesador)**: ONIA solo trata esos datos por instrucción del cliente y para prestar el servicio |

1.3. En la práctica: **el paciente es paciente de la clínica, no de ONIA**. La clínica
decide qué registra, a quién contacta y con qué consentimiento; ONIA pone la
herramienta y custodia los datos según esta Política y el contrato. ONIA recomienda
firmar con cada clínica un anexo de tratamiento de datos (ver §0, punto 2).

## 2. Qué datos tratamos

2.1. **Datos de cuenta** (rol: responsable): nombre y datos de contacto del cliente y
sus usuarios, credenciales de acceso (contraseñas almacenadas con hash, nunca en
claro), datos de facturación (NIT/CI, razón social), historial de pagos.

2.2. **Datos de uso** (rol: responsable): registros técnicos (logs) de acceso y
actividad, necesarios para seguridad, soporte y facturación. No usamos estos datos
para publicidad.

2.3. **Datos del negocio** (rol: encargado): la información operativa que el cliente
carga — agenda, clientes/contactos, ventas, cotizaciones, inventario, mensajes en
cola de aprobación.

2.4. **Datos de salud de pacientes** (rol: encargado — **categoría sensible**): en
verticales de salud como DentalGest, la clínica registra datos de sus pacientes:
identificación y contacto, historia y notas clínicas, odontograma, tratamientos,
citas, presupuestos. Reglas especiales que aplicamos:

- Solo los trata el personal autorizado por la clínica dentro de su propia cuenta;
  cada cuenta está aislada de las demás (aislamiento por cliente con reglas de acceso
  a nivel de fila en la base de datos).
- ONIA no usa datos de pacientes para ningún fin propio: ni marketing, ni perfilado,
  ni estadística comercial, ni entrenamiento de modelos de IA.
- El acceso del personal de ONIA a datos de pacientes está restringido a soporte
  técnico estrictamente necesario, bajo deber de confidencialidad.

2.5. ONIA no solicita ni necesita datos como creencias religiosas, afiliación
política o biometría. Si un cliente los carga en campos libres, es bajo su
responsabilidad como responsable del tratamiento.

## 3. Para qué usamos los datos (finalidades)

- Prestar, operar y mantener el servicio contratado.
- Autenticar usuarios y proteger la seguridad de la plataforma.
- Cobrar y facturar (incluida la emisión de facturas conforme al SIN).
- Dar soporte al cliente.
- Preparar borradores y sugerencias con IA **dentro de la cuenta del cliente y bajo
  aprobación humana** (ver §6).
- Cumplir obligaciones legales y requerimientos de autoridad competente.

**Lo que NO hacemos:**

- **No vendemos datos** — ni de clientes ni de pacientes, a nadie, nunca.
- **No hacemos minería de datos** sobre la información de los clientes para fines
  comerciales propios ni de terceros.
- **No usamos datos de clientes ni de pacientes para entrenar modelos de IA** (ni
  propios ni de terceros — ver §5 y §6).
- No enviamos publicidad a los pacientes de las clínicas.

## 4. Dónde viven los datos

4.1. **Bases de datos de producto:** en **Supabase** (servicio de base de datos en la
nube sobre infraestructura de proveedores cloud; servidores ubicados fuera de Bolivia
— región contratada: **UNKNOWN, completar con la región exacta del proyecto**). El uso
de nube implica una **transferencia internacional de datos**; ver §0, punto 4.

4.2. **Automatización y agentes:** en un servidor privado (VPS) administrado por
ONIA, donde corren los procesos de orquestación y automatización.

4.3. **Sitios web:** el hosting de sitios y paneles puede servirse desde Vercel u
otra red de distribución de contenidos.

4.4. **Opción on-premise:** para clientes que lo requieran (por política interna o
normativa sectorial), ONIA puede ofrecer instalación en infraestructura del propio
cliente ("on-premise"), bajo cotización y contrato específico. En esa modalidad, la
custodia física de los datos es del cliente.

## 5. Sub-procesadores (proveedores que tocan datos)

ONIA usa proveedores para operar el servicio. Solo acceden a lo mínimo necesario y
bajo sus propios compromisos de confidencialidad y seguridad:

| Proveedor | Para qué | Notas |
|---|---|---|
| **Supabase** | Base de datos y autenticación | Cifrado en tránsito y en reposo; aislamiento por cliente |
| **Proveedores de modelos de IA** (vía pasarela propia de ONIA) | Generar borradores y sugerencias | Se usan **solo modalidades de API que NO entrenan con los datos enviados** ("no-training"); se envía el mínimo contexto necesario |
| **Meta (WhatsApp Business Platform)** | Mensajería con pacientes/clientes cuando el cliente activa ese canal (chatbot en desarrollo) | Los mensajes pasan por la infraestructura de Meta bajo sus términos; **[abogado: revisar al activarse — §0 punto 10]** |
| Proveedor del VPS | Infraestructura de automatización | Administrado por ONIA con llaves propias |
| Vercel | Hosting web | Sin acceso a bases de datos de producto |

ONIA mantendrá esta lista actualizada y avisará a los clientes ante cambios de
sub-procesadores que traten datos de pacientes. **[Abogado: definir mecanismo y plazo
de aviso — §0 punto 7.]**

## 6. IA y datos

- Los agentes de IA trabajan **dentro de la cuenta del cliente**, con el mínimo de
  datos necesario para cada tarea.
- **Toda comunicación saliente requiere aprobación humana previa** del cliente (cola
  de pendientes). ONIA no envía nada por sí sola.
- Los datos enviados a proveedores de IA se procesan bajo modalidades **no-training**
  (no se usan para entrenar sus modelos).
- ONIA tampoco entrena modelos propios con datos de clientes o pacientes.

## 7. Seguridad

Medidas aplicadas (esfuerzo razonable, mejora continua):

- Cifrado de datos **en tránsito** (TLS/HTTPS) y **en reposo** en la base de datos.
- **Aislamiento por cliente** con reglas de acceso a nivel de fila (RLS).
- Contraseñas con hash; accesos administrativos con llaves y principio de mínimo
  privilegio.
- **Copias de seguridad cifradas** y periódicas.
- Registro de actividad (logs) para detectar accesos anómalos.

Ningún sistema es infalible. Si ocurriera un incidente de seguridad que afecte datos
personales, ONIA lo notificará al cliente afectado **sin demora indebida** (objetivo
operativo: dentro de las 72 horas de confirmado), con lo que se sepa del alcance y
las medidas tomadas, para que la clínica pueda cumplir sus propios deberes frente a
sus pacientes.

## 8. Retención y eliminación

- **Durante el servicio:** los datos se conservan mientras la cuenta esté activa.
- **Al terminar el contrato:** el cliente puede exportar sus datos (formato
  CSV/JSON) dentro de los **30 días** posteriores a la terminación (ver Términos
  §8.3). Transcurridos **90 días** desde la terminación, ONIA elimina los datos del
  cliente de los sistemas activos.
- **Backups:** las copias de seguridad cifradas rotan en un ciclo de hasta **30
  días** adicionales; los datos eliminados desaparecen de los backups al completarse
  la rotación.
- **Excepciones:** se conserva lo que la ley exija retener (por ejemplo, registros de
  facturación ante el SIN) por el plazo legal correspondiente.
- **Importante para clínicas:** los plazos legales de conservación del expediente
  clínico son obligación de la clínica (ver §0, punto 6). Exportar antes del borrado
  es responsabilidad del cliente; ONIA lo recordará antes de eliminar.

## 9. Derechos de las personas

9.1. **Sobre datos de cuenta** (ONIA responsable): el cliente y sus usuarios pueden
pedir a ONIA acceso, rectificación, actualización o eliminación de sus datos, por los
canales del §13. ONIA responderá en un plazo objetivo de **15 días hábiles**.

9.2. **Sobre datos de pacientes** (ONIA encargado): los pacientes deben dirigir sus
solicitudes **a su clínica**, que es quien decide sobre esos datos. ONIA dará a la
clínica las herramientas para atenderlas (buscar, corregir, exportar o eliminar el
registro del paciente). Si un paciente contacta a ONIA directamente, ONIA lo derivará
a su clínica y avisará a esta.

9.3. **Vía constitucional:** sin perjuicio de lo anterior, la Constitución Política
del Estado reconoce el derecho a la privacidad e intimidad (art. 21, num. 2) y la
**Acción de Protección de Privacidad** (arts. 130-131) — el mecanismo constitucional
(heredero del habeas data) para que toda persona conozca, objete, y logre la
eliminación o rectificación de sus datos registrados por cualquier medio. **[Abogado:
validar redacción y remisión procesal — §0 punto 8.]**

## 10. Marco legal boliviano (referencial — verificar)

- **Constitución Política del Estado (2009):** art. 21 num. 2 (privacidad, intimidad,
  honra, propia imagen y dignidad) y arts. 130-131 (Acción de Protección de
  Privacidad).
- **Ley N.° 164 de 2011** (Ley General de Telecomunicaciones, Tecnologías de
  Información y Comunicación) y su reglamento para el desarrollo de TIC (**DS 1793 de
  2013**): principios sobre documentos digitales, comercio electrónico y protección
  de datos en entornos TIC. **[Verificar alcance exacto — §0 punto 9.]**
- **Ley N.° 3131 de 2005** (Ejercicio Profesional Médico): secreto médico y
  expediente clínico — aplica a los profesionales de las clínicas clientes.
- **Ley integral de protección de datos personales: UNKNOWN.** A conocimiento de este
  borrador, Bolivia no tiene una ley integral vigente en la materia; existieron
  anteproyectos. **El abogado DEBE confirmar el estado normativo actual** y adecuar
  esta política si ya rige una ley o reglamento específico (§0, punto 1). Mientras
  tanto, ONIA adopta voluntariamente estándares internacionales razonables
  (minimización, finalidad, seguridad, roles responsable/encargado).

## 11. Menores de edad

La plataforma no está dirigida a menores y ONIA no recolecta datos de menores por
cuenta propia. Las clínicas clientes pueden registrar pacientes menores de edad como
parte de la atención odontológica, bajo el consentimiento de sus padres o tutores,
que es responsabilidad de la clínica obtener y documentar. **[Abogado: validar — §0
punto 11.]**

## 12. Cambios a esta Política

ONIA puede actualizar esta Política. Los cambios materiales se avisarán al cliente
con al menos **30 días** de anticipación por los canales de la plataforma. La versión
vigente y su fecha estarán siempre publicadas.

## 13. Contacto

Solicitudes sobre datos personales: **[correo de contacto oficial — completar]** ·
**[teléfono/WhatsApp — completar]** · [RAZÓN SOCIAL — completar], Santa Cruz de la
Sierra, Estado Plurinacional de Bolivia.

---

> **RECORDATORIO: BORRADOR PARA REVISIÓN DE ABOGADO ANTES DE USAR.** Todo lo marcado
> **UNKNOWN** no pudo verificarse contra norma vigente y NO debe publicarse sin
> confirmación profesional. Ver checklist completo en el §0.
