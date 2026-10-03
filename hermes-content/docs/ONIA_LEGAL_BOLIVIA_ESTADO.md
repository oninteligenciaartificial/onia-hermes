# ONIA — Estado legal en Bolivia

> **Fuente de verdad (sin fecha en el nombre): se EDITA este archivo cuando algo cambie.**
> Última verificación contra fuentes externas y contra producción: **2026-08-18** (la fila
> fiscal de §1.4, re-verificada el **2026-10-03** contra la RND 102600000038).
> Regla heredada de `onia-contabilidad-bolivia`: toda obligación con su norma citada;
> sin fuente oficial = **"sin verificar"**, y así se dice.
>
> **Esto no es asesoría legal.** Lo redactó un asistente técnico. Las decisiones marcadas
> `[ABOGADO]` no las puede tomar nadie de adentro.

---

## 0. Respuesta corta

1. **NO hay ley de protección de datos personales vigente en Bolivia.** Sigue habiendo
   solo anteproyectos (AGETIC 2024 e InternetBolivia). Lo que rige es la Constitución
   (arts. 21.2 y 130-131), el DS 1793 y normas sectoriales sueltas.
2. **Eso NO nos deja libres: nos deja sin piso legal y con todo el peso en el contrato.**
   Lo que Onia promete por escrito es exigible por Código Civil y por Ley 453 (consumidor).
   El riesgo hoy es **contractual y reputacional**, no una multa de una autoridad de datos
   que no existe.
3. **Donde sí hay ley dura es en salud y en lo penal:** Ley 3131 (secreto médico, custodia
   del expediente en el establecimiento) y **CP art. 302** (revelación de secreto
   profesional: 3 meses a 1 año de privación de libertad), que alcanza a *"empleo u
   oficio"* — o sea, al que hace soporte técnico y abre una historia clínica.
4. **El agujero más grande verificado hoy no es normativo, es nuestro:** hay **dos
   políticas de privacidad vivas y contradictorias en producción**, y la que el cliente
   realmente acepta al registrarse declara una razón social que **no existe en SEPREC** y
   un Gmail personal como canal de derechos sobre datos de salud.
5. **La portabilidad que promete el contrato no existe en el producto**: lo único
   exportable es un CSV de facturas. No hay export de pacientes ni de historias clínicas.
6. Fiscal: sin novedad que nos cambie el plan. ⚠️ *(Corregido el 2026-10-03: acá decía que la
   **RND 102600000007** «sigue mandando (30-sep-2026)». El 30-sep la **RND 102600000038** abrogó
   las designaciones de los grupos 9° a 12° y dejó sin efecto ese plazo; ver §1.4.)* Apareció la
   **RND 102600000026** (TCO del BCB en facturas en moneda extranjera), que toca a clientes que
   facturan en dólares.

---

## 1. Qué obliga HOY, con norma citada

### 1.1 Protección de datos personales — **sin ley integral vigente**

| Qué | Estado | Fuente |
|---|---|---|
| Ley integral de protección de datos | **NO existe.** Solo anteproyectos: AGETIC 2024 e InternetBolivia.org, ninguno sancionado. Verificado 2026-08-18 | [Anteproyecto AGETIC](https://agetic.gob.bo/sites/default/files/2025-06/DATOS-PERSONALES-PRESENTACION-ANTEPROYECTO-DE-LEY-2024-firmado.pdf) · [Anteproyecto InternetBolivia](https://misdatos.internetbolivia.org/docs/anteproyecto_ley_de_proteccion_datos_personales_InternetBolivia.pdf) |
| Autoridad de protección de datos | **No existe.** No hay a quién denunciarnos ni quién multarnos por datos | — |
| Derecho de fondo | **CPE art. 21 num. 2** (privacidad, intimidad, honra, propia imagen) | Constitución 2009 |
| Vía de reclamo real de un titular | **CPE arts. 130-131 — Acción de Protección de Privacidad.** Cualquier persona puede pedir judicialmente conocer, objetar y lograr **eliminación o rectificación** de sus datos en bancos **públicos o privados**. Es rápida y no necesita abogado caro | Constitución + Código Procesal Constitucional (Ley 254) |
| Regla de tratamiento más cercana a una ley de datos | **DS 1793 de 13-nov-2013 (reglamento Ley 164), art. 56**: consentimiento previo y expreso del titular (inc. b); deber de informar finalidad, destinatarios, identidad del responsable y derechos (inc. c); **transferencia a terceros solo con consentimiento del titular u orden judicial** (inc. d) ← esto gobierna subprocesadores y nube; medidas de seguridad (inc. e). **Art. 4**: finalidad, veracidad, transparencia, seguridad, confidencialidad | [DS 1793](https://www.lexivox.org/norms/BO-RE-DSN1793.html) |
| ⚠️ Alcance del art. 56 | **Discutible.** Está en el Título V ("Titular del certificado digital"), aunque su texto se declara aplicable al *"sector público y privado en todas sus modalidades"*. Un abogado contrario puede sostener que solo aplica a certificación digital. **Por eso lo adoptamos por CONTRATO, no lo invocamos como ley** — así es exigible igual | `[ABOGADO]` |
| Chatbot / mensajería promocional | **DS 1793 art. 57**: toda comunicación digital con fin de promoción debe (inc. d) decir cómo rechazar envíos futuros y (inc. e) **identificar al remitente y a la persona jurídica en cuyo nombre se envía** | [DS 1793](https://www.lexivox.org/norms/BO-RE-DSN1793.html) |
| Secreto de las comunicaciones | **Ley 164 art. 56** — obliga a operadores y proveedores de telecomunicaciones. Onia no es operador con licencia ATT | [Ley 164](https://bolivia.infoleyes.com/articulo/55665) |
| Licencia ATT | **No aplica hoy.** La licencia de Servicio de Valor Agregado (DS 1391, reglamento general Ley 164) es para quien provee servicio sobre red pública de telecomunicaciones. Un SaaS de gestión no la necesita. `[ABOGADO]` confirmar si el chatbot de WhatsApp mueve esa línea | [DS 1391](https://www.lexivox.org/norms/BO-RE-DSN1391.html) |
| Ciudadanía Digital (Ley 1080) | No aplica: es para entidades que prestan servicios públicos. Aplicaría **si vendemos al Estado** | Ley 1080/2018 |
| Sector financiero (ASFI) | **No nos aplica directamente.** Ley 393 de Servicios Financieros + Reglamento de Gestión de Seguridad de la Información de ASFI (18-dic-2017) obligan a las **entidades financieras supervisadas**. Nos alcanzaría **por cascada contractual** el día que un banco o cooperativa nos contrate como proveedor | Ley 393 · ASFI |
| Municipal | Coroico dictó la primera ley **municipal** de gestión de datos personales. Santa Cruz no. Irrelevante hoy, señal de hacia dónde va | — |

**Traducción operativa:** hoy nadie nos puede multar por datos. Lo que puede pasar es
(a) una Acción de Protección de Privacidad de un paciente, (b) una demanda civil por
incumplimiento de lo que prometimos por escrito, (c) Ley 453 si el cliente califica como
consumidor, y (d) **causa penal personal** por el CP art. 302. Ninguna requiere ley de datos.

### 1.2 Datos de SALUD — acá sí hay ley dura

| Qué | Norma | Qué dice |
|---|---|---|
| Secreto médico | **Ley 3131 de 8-ago-2005, art. 3** | *"el secreto médico es inviolable salvo las excepciones previstas en la presente Ley"* |
| Alcance del secreto | **Ley 3131 art. 4** | Toda información del acto médico —estado de salud, tratamiento y datos personales— se mantiene en secreto **incluso después de la muerte** del paciente |
| Documentos médicos oficiales y custodia | **Ley 3131 art. 10** | Enumera 17 documentos oficiales (historia clínica, consentimiento informado, recetas, informes, protocolos…) y establece que están **bajo resguardo y custodia del establecimiento de salud** |
| Reglamento | **DS 28562 de 22-dic-2005** | art. 12 define expediente médico e historia clínica; art. 14 obligación de registro |
| Norma técnica del expediente | **Norma Técnica N.º 64**, aprobada por **RM 0090 de 26-feb-2008** | Regula elaboración, ordenamiento, uso y archivo del expediente clínico |
| **Plazo de conservación del expediente** | **NO está fijado en la Norma Técnica 64** | Una tesis de la UMSA sobre la aplicación de la norma en aseguradoras privadas concluye que *"en la Norma Técnica no se establecen parámetros acerca del ciclo vital de la documentación"*. **Verificado solo vía fuente académica**: el PDF oficial de minsalud está escaneado como imagen y no se puede leer. `[ABOGADO]` cerrar contra el texto impreso |
| Historia clínica **electrónica** | **Permitida, sin norma específica** | La doctrina boliviana sostiene que *"no existe ningún impedimento legal para que la información recogida en la historia clínica se informatice"* y que la HCE tiene el mismo valor jurídico que el papel. **No hay norma que exija alojarla en Bolivia.** Tampoco hay una que lo autorice expresamente: es un vacío, no un permiso escrito |
| Revelación del secreto | **Código Penal art. 302** | Quien por su *"estado, ministerio, profesión, **empleo, oficio** o comisión"* conozca secretos y los revele sin justa causa, si de ello resulta perjuicio: **privación de libertad de 3 meses a 1 año y multa de 30 a 100 días** |

**Las tres consecuencias que importan:**

1. **El dueño legal de la custodia es la clínica, no Onia.** Eso **confirma** nuestro
   encuadre encargado/responsable — pero exige que el contrato lo diga citando la Ley 3131
   art. 10, y que la clínica pueda **recuperar el expediente completo en cualquier
   momento**, no solo al irse. Hoy no puede (§3).
2. **El "empleo u oficio" del CP art. 302 alcanza a nuestro soporte técnico.** Una fuga no
   es solo un problema de la empresa: es exposición penal **personal** de quien abrió la
   historia. Justifica sin discusión los NDA firmados, el log de acceso de soporte y la
   autorización previa del cliente para entrar a datos clínicos.
3. **Nadie prohíbe la nube ni el servidor fuera de Bolivia.** No hay norma de residencia
   de datos de salud. El riesgo no es de localización, es de que la cadena de
   consentimiento (DS 1793 art. 56 inc. d) esté rota — y hoy lo está, porque el paciente
   nunca firma nada que mencione a un tercero tecnológico (§3).

### 1.3 Consumidor — Ley 453 de 4-dic-2013 (reglamento DS 2130)

- **art. 19** contratos de adhesión · **art. 21** términos claros, comprensibles y en castellano.
- **art. 22 — cláusulas abusivas**: num. 1 limitar derechos del consumidor · num. 2
  **facultad unilateral de modificar el contrato** · num. 3 **exonerar de responsabilidad
  al proveedor** · num. 5 compartir información personal sin consentimiento.
- Nos toca directo en: §3.5 de los Términos (ajuste de precios unilateral) y §9
  (tope de responsabilidad a 12 meses).
- Además, **afirmar controles de seguridad que no tenemos roza publicidad engañosa**
  (Ley 453 arts. 13-14). Por eso la política vigente ya no dice "cifrado en reposo".
- `[ABOGADO — pregunta previa que define todo lo anterior]` **¿una clínica que contrata
  SaaS es "consumidor" a efectos de la Ley 453, o es una relación B2B fuera de su ámbito?**

### 1.4 Fiscal — estado al día

| Qué | Norma | Estado 2026-08-18 |
|---|---|---|
| Facturación en línea, grupos 9° a 12° | ~~RND 102600000007~~ → **RND 102600000038** (30-sep-2026) | ⚠️ **Sin efecto desde el 30-sep-2026** *(corregido el 2026-10-03; decía «sin novedad posterior», vencía el 30-sep y desde el 1-oct esos NITs emitían solo en línea)*. La RND 102600000038 abrogó las RND que designaban a los grupos (102400000004/05/12/25) y dejó sin efecto sus plazos; el SIN asignará periódicamente una modalidad en línea a quien no tenga ninguna, sin fecha. **Prohibido decirle a nadie que está obligado «desde el 1-oct»**. Detalle: `ONIA_FACTURACION_ESTADO_REAL.md` §2.6 |
| **Novedad relevante** | **RND 102600000026** (jul-2026) | Modifica el parágrafo IX del art. 25 de la RND 102100000011: toda factura en **moneda extranjera** debe registrar el **Tipo de Cambio Oficial del BCB** vigente a la fecha. Nace del régimen cambiario flexible (RM 245 de 26-jun-2026). **Impacta a clientes que facturan en USD** — y a cualquier módulo nuestro que calcule tipo de cambio |
| Otra de 2026 | RND 102600000006 (20-mar-2026) | Facturación en línea para traslado interno de mercancías. Relevante para el pack importadora/comercio |
| **Conservación de registros** | **Ley 2492 art. 70 num. 8** + art. 59 mod. **Ley 812** | Conservar libros, comprobantes y *"medios de almacenamiento, datos e información computarizada"* mientras el tributo no prescriba: **8 años**. **Código de Comercio art. 52**: mínimo 5 años |

⚠️ **Choque vigente:** la política publicada promete borrar los datos del cliente a los
**90 días** de terminado el contrato. Para un cliente en Régimen General, eso puede
destruirle respaldo que la ley le obliga a conservar **8 años**. Está mitigado en el texto
("exportar antes del borrado es tu responsabilidad") pero no en el producto, porque el
export no exporta casi nada (§3).

### 1.5 Marca, sociedad y facturación propia

Fuera de alcance de este doc; ya tienen fuente propia y **no se duplican acá**:
`ONIA_SENAPI_PI112_TRAMITE.md` (marca clase 42) · `ONIA_DATOS_LEGALES_SEPREC` (OniaAgency,
matrícula 5371375010, titular **Leslie Mercado Moreno**; Sergio es menor y no firma) ·
`ONIA_SIAT_HABILITAR_FACTURACION_CHECKLIST_2026.md` · `ONIA_FECHAS_CRITICAS_PLAN.md`.

---

## 2. Qué TENEMOS

| Documento | Dónde | Estado verificado hoy |
|---|---|---|
| **Política de Privacidad (landing)** | `web-factory/apps/onia-platform/src/content/legal/privacidad.md` → **live en `onia.com.bo/privacidad`** | **Vigente v1.0, 13-ago-2026.** Declara OniaAgency, NIT 5371375010, `business@onia.com.bo`. Buen documento: roles responsable/encargado, subprocesadores, IA sin entrenamiento, sección de chatbot con opt-out, y §15 que **dice la verdad** sobre la ausencia de ley |
| **Términos y Condiciones (landing)** | `.../src/content/legal/terminos.md` → `onia.com.bo/terminos` | **Vigente v1.0, 15-ago-2026.** Incluye lo difícil de escribir: qué NO es el servicio, IA propone/vos aprobás, **"sin SLA numérico"** declarado con honestidad, ajuste de precios indexado a BCB/INE, ley y jurisdicción de Santa Cruz |
| **Política de Privacidad (producto)** | `onia-platform/app/privacy/page.tsx` + `lib/legal.ts` → **live en `app.onia.com.bo/privacy`** | 🔴 **v2026.06.03, operador "OnIA / On Inteligencia Artificial", contacto `oninteligenciaartificial@gmail.com`.** Es **la que el cliente acepta al registrarse** |
| **Términos (producto)** | `onia-platform/app/terms/page.tsx` | 🔴 Mismo set divergente |
| **DPA / Acuerdo de Tratamiento de Datos** | `onia-platform/app/data-processing/page.tsx` | 🟡 **Existe y se acepta al registrarse.** Tiene roles, instrucciones, obligaciones, subprocesadores, incidentes y eliminación. Le falta lo que lo hace servible en salud (§3) |
| Borradores originales | `hermes-content/docs/legal/*_BORRADOR.md` | Históricos. **No son fuente de verdad** — los vigentes son los publicados |
| Auditoría legal y de seguridad completa | `historial/ONIA_SEGURIDAD_PRIVACIDAD_PLAN_20260807.md` | Sigue siendo el análisis más profundo. Este doc lo actualiza, no lo reemplaza |
| Pendientes ya identificados para abogado | `historial/ONIA_LEGAL_PENDIENTES_ABOGADO_20260813.md` | 7 puntos, todos abiertos |

---

## 3. Qué FALTA

**(a) Unificar los documentos legales — P0, es lo primero.**
Verificado en vivo hoy: `onia.com.bo/privacidad` dice **OniaAgency / NIT 5371375010 /
business@onia.com.bo / v1.0**, y `app.onia.com.bo/privacy` dice **"OnIA / On Inteligencia
Artificial" / gmail personal / v2026.06.03**. El cliente firma la segunda
(`app/(auth)/register/page.tsx:629-637`). Un contrato a nombre de una entidad que no
existe en SEPREC es el primer punto que ataca cualquier abogado contrario, y un Gmail
personal como canal de derechos sobre datos de salud es indefendible.

**(b) Portabilidad real — el contrato promete algo que el producto no hace.**
Los Términos §4.2 prometen *"exportación de tus datos en formato estándar legible por
máquina"*. Lo verificado en el código:

- Los únicos endpoints que emiten CSV son `app/api/reports/export` (**solo facturas**),
  `empresa/expenses/export` y `rrhh/planilla-export` (internos de Onia) y
  `fiscal/rcv-export`.
- **No existe export de pacientes, historias clínicas, odontogramas, citas ni inventario.**
  Hay `api/patients/import`, pero no su inverso.
- `reports/export` está **gateado por plan** (`lib/plan-limits.ts:489`): en el plan `free`,
  `csvExportEnabled: false`. El propio archivo tiene el comentario *"el export de SUS datos
  no puede ser rehén del plan"* — y en `free` sigue siéndolo.

Esto no es una omisión estética: choca de frente con la Ley 3131 art. 10 (la clínica debe
poder recuperar su expediente) y con la retención fiscal de 8 años.

**(c) Consentimiento del paciente — el hueco más grande, y sigue abierto.**
Le trasladamos la obligación al cliente y **no le damos la herramienta**. Ninguna clínica
de Santa Cruz va a redactar sola un consentimiento informado de tratamiento de datos. Sin
eso, la cadena del DS 1793 art. 56 incs. b) y d) se rompe justo donde más la necesitamos:
transferencia a subprocesadores y a un servidor fuera de Bolivia. Falta:
modelo de consentimiento de 1 página en castellano llano (Ley 453 art. 21) · modelo para
menores con firma de padre/tutor · **campo en el producto** que registre fecha, versión y
quién lo tomó. **Esto es producto vendible**, no solo cumplimiento.

**(d) DPA completo.** Al que existe le falta: plazo cierto de notificación de brecha
(hoy dice *"cuando sea necesario y posible"*, que es una intención, no una obligación —
proponer **72 h desde la detección**) · lista cerrada y **versionada** de subprocesadores
con aviso previo de alta · compromiso de confidencialidad del personal **citando CP art.
302** · reglas de acceso de soporte a datos clínicos (quién autoriza, qué queda logueado) ·
devolución/eliminación con plazo y formato, coordinados con los 8 años fiscales · país del
servidor y aviso si cambia · anexo de medidas de seguridad **reales**, en lista, sin adjetivos.

**(e) Lo administrativo que no existe:** registro de solicitudes de titulares (sin él no
podemos probar el plazo de 15 días que prometimos) · procedimiento escrito de brecha (hoy
prometemos el resultado sin tener el proceso) · NDA firmados por todo el que toque
producción · versión del documento legal aceptado persistida en el registro (hoy
`register/route.ts:210` guarda `termsAcceptedAt` pero **no** la versión: si cambia la
política, no podemos probar qué texto aceptó cada cliente).

**(f) SLA.** **No falta: está decidido.** Los Términos §7.2 declaran expresamente que no
hay SLA numérico ni créditos por caída. Es coherente con la realidad (un solo VPS, sin
réplica) y es mejor argumento comercial que un número inventado. **No escribir un SLA**
hasta que exista redundancia real o un cliente lo exija por escrito en un contrato.

---

## 4. Riesgos, en el orden en que nos caen encima

| # | Riesgo | Por qué es el primero | Costo de arreglarlo |
|---|---|---|---|
| **1** | **Dos juegos de documentos legales vivos, y el que se firma nombra a una entidad inexistente** | No hace falta un incidente: basta que un cliente empresa, un revisor de Meta o un abogado contrario abra las dos URLs. Verificado en vivo hoy | 1 día de trabajo. Una sola fuente, la razón social de SEPREC, un solo correo. **Gratis** |
| **2** | **Portabilidad prometida y no entregada** | Se dispara solo: el primer cliente que se va y pide sus datos. Y con datos clínicos de por medio choca con la Ley 3131 art. 10 | 1-2 días de desarrollo: un export por tenant de pacientes/historias/citas, **desgateado del plan** |
| **3** | **Cadena de consentimiento rota en salud** | Aparece con el primer reclamo de un paciente (Acción de Protección de Privacidad, CPE art. 130). El paciente nunca supo que sus datos pasan por un tercero y viven fuera de Bolivia | Modelo de consentimiento (medio día) + campo en el producto (1 día) + `[ABOGADO]` |
| **4** | **CP art. 302 sin controles de acceso al dato clínico** | Es el único riesgo **penal y personal** de la lista. Hoy un empleado puede leer 400 historias sin dejar rastro | NDA firmados + log de acceso concedido + autorización de soporte: 1 día |
| **5** | **Retención a 90 días vs. 8 años fiscales** | Explota tarde pero explota caro: cliente fiscalizado que perdió el respaldo porque lo borramos en plazo | Cambiar el plazo publicado + ofrecer custodia extendida como servicio. `[ABOGADO]` fija el número |
| **6** | **Ley 453 arts. 21-22 sobre las cláusulas de precio y responsabilidad** | Solo si un cliente reclama y si la Ley 453 le aplica (pregunta abierta). Ya está mitigado con aviso de 30 días, indexación objetiva BCB/INE y no-renovación sin penalidad | Solo revisión `[ABOGADO]` |
| **7** | **Ley de datos personales cuando salga** | No es riesgo hoy, es trabajo mañana. La política ya se comprometió a adecuarse | El que ya estamos haciendo |

**Lo que NO es un riesgo y no hay que gastar plata en eso:** certificar ISO 27001 (es
voluntaria en Bolivia; ninguna norma obliga a un SaaS privado) · banner de cookies tipo
GDPR (el DS 1793 no regula cookies; lo exigible es el deber de información del art. 56
inc. c) · declarar "cumplimos GDPR/estándares internacionales" en la landing (falso hoy, y
una afirmación más que corregir).

---

## 5. Acciones

### Lo que escribimos y hacemos nosotros — sin abogado

1. **Unificar en un solo juego canónico de documentos.** Portar el texto de la landing
   (mejor escrito) al producto, borrar el duplicado, servir ambos desde una sola fuente.
   Razón social **OniaAgency, matrícula/NIT 5371375010**, un solo correo
   `business@onia.com.bo`. Eliminar `oninteligenciaartificial@gmail.com` de
   `onia-platform/lib/legal.ts:6`.
2. **Corregir la lista de subprocesadores del producto** (`lib/legal.ts:10-17`): hoy nombra
   Vercel, Coolify, Resend y Sentry. Declarar un subprocesador que no se usa es tan malo
   como omitir uno que sí.
3. **Persistir la versión del documento aceptado** en el registro. Una línea en
   `app/api/auth/register/route.ts`.
4. **Construir el export por tenant** (pacientes, historias, citas, inventario) y **quitarle
   el gate de plan**. Es lo que ya promete el contrato.
5. **Redactar el modelo de consentimiento del paciente** (1 página, castellano llano) y el
   de menores, y agregar el campo que lo registra en el producto.
6. **Completar el DPA** con los siete puntos del §3(d).
7. **Abrir el registro de solicitudes de titulares** y escribir el procedimiento de brecha
   (una página, con el compromiso de 72 h).
8. **Log de acceso concedido a historia clínica** + NDA firmados por todo el que toque
   producción.
9. **Cerrar el renglón del chatbot**: que el primer mensaje identifique a **OniaAgency** por
   nombre y enlace la política (DS 1793 art. 57 inc. e).
10. **Antes del 1-oct-2026**: verificar el NIT de cada prospecto contra los anexos de las
    RND antes de decirle "estás obligado", y revisar si algún cliente factura en moneda
    extranjera (RND 102600000026).

### Lo que necesita abogado de verdad — llevarle estas preguntas, no "revisá esto"

1. **Ley 453**: ¿un cliente B2B que contrata SaaS es "consumidor"? De eso dependen las
   cláusulas de ajuste de precio y de límite de responsabilidad.
2. **DS 1793 art. 56**: ¿es norma general vinculante para un SaaS privado, o su ubicación
   en el Título V lo limita a certificación digital? ¿Lo invocamos como ley o lo adoptamos
   por contrato? (recomendación interna: **por contrato**).
3. **Norma Técnica 64 / RM 0090**: ¿fija o no plazos de conservación del expediente
   clínico? La investigación académica dice que **no los fija**; el PDF oficial está
   escaneado y no se pudo leer. Ese número define nuestra retención.
4. **Transferencia internacional de datos de salud** sin ley nacional: ¿alcanza
   consentimiento del paciente ante la clínica + DPA? ¿Hay que declarárselo al paciente?
5. **Ley 3131 art. 10**: ¿tercerizar la custodia del expediente en un SaaS con servidor
   fuera de Bolivia requiere autorización o notificación adicional?
6. **CP art. 302**: alcance sobre personal técnico no sanitario. ¿Qué documento firmado
   reduce la exposición personal?
7. ¿DPA click-through alcanza para salud, o hace falta anexo firmado en la orden de servicio?
8. Notificación de brecha: ¿fijamos 72 h por contrato aunque ninguna ley boliviana lo exija?
9. Plazos de retención y borrado compatibles con los 8 años de la Ley 2492 art. 70 num. 8.
10. Menores: artículo aplicable de la **Ley 548** para el consentimiento parental.
11. Confirmar razón social, domicilio legal y NIT literales de SEPREC, y que **Leslie
    Mercado Moreno** figure como firmante (Sergio es menor de edad).

---

## 6. Fuentes

**Normativa boliviana:**
[Ley 3131 Ejercicio Profesional Médico](https://www.lexivox.org/norms/BO-L-3131.html) ·
[DS 28562](https://www.lexivox.org/norms/BO-DS-28562.html) ·
[Norma Técnica 64 (PDF oficial, escaneado)](https://www.minsalud.gob.bo/images/Documentacion/dgss/Area_de_Calidad/64%20Norma%20expediente%20clinico.pdf) ·
[DS 1793 (reglamento Ley 164)](https://www.lexivox.org/norms/BO-RE-DSN1793.html) ·
[Ley 164 art. 56](https://bolivia.infoleyes.com/articulo/55665) ·
[DS 1391 reglamento general Ley 164](https://www.lexivox.org/norms/BO-RE-DSN1391.html) ·
[Ley 453 Derechos del Usuario y Consumidor](https://www.lexivox.org/norms/BO-L-N453.html) ·
[DS 2130](https://www.lexivox.org/norms/BO-RE-DSN2130.html) ·
[Ley 2492 Código Tributario](https://www.ait.gob.bo/wp-content/uploads/2023/04/Ley-2492-Codigo_Tributario_Boliviano.pdf) ·
[Código Penal art. 302](https://bolivia.infoleyes.com/articulo/32639) ·
[Ley 1080 Ciudadanía Digital](https://www.lexivox.org/norms/BO-L-N1080.html)

**Protección de datos — estado del anteproyecto:**
[AGETIC, anteproyecto 2024](https://agetic.gob.bo/sites/default/files/2025-06/DATOS-PERSONALES-PRESENTACION-ANTEPROYECTO-DE-LEY-2024-firmado.pdf) ·
[InternetBolivia.org, anteproyecto](https://misdatos.internetbolivia.org/docs/anteproyecto_ley_de_proteccion_datos_personales_InternetBolivia.pdf) ·
[Internet Bolivia — marco legal en el sector financiero](https://internetbolivia.org/noticias/cual-es-el-marco-legal-de-proteccion-de-datos-en-el-sector-financiero/) ·
[Urgente.bo — hacia una ley boliviana de protección de datos](https://www.urgente.bo/noticia/hacia-una-ley-boliviana-de-proteccion-de-datos-personales-y-derechos-digitales)

**Salud (fuentes secundarias, marcadas como tales):**
[Tesis UMSA sobre la aplicación de la NT 64 en archivos clínicos privados](https://repositorio.umsa.bo/handle/123456789/33900?show=full) (de acá sale que la NT 64 **no** fija ciclo vital documental) ·
[Redalyc — protección de la intimidad en la historia clínica electrónica en Bolivia](https://www.redalyc.org/journal/427/42771664016/html/) (de acá, que la HCE no tiene impedimento legal)

**Fiscal:**
[SIN — índice RND 2026](https://www.impuestos.gob.bo/index.php/rnd-2026/) ·
[SIN — RND 102600000038, abroga las designaciones de los grupos 9° a 12° (PDF)](https://www.impuestos.gob.bo/wp-content/uploads/2026/09/RND-102600000038-Abrogacio%CC%81n.pdf) ·
[SIN — ampliación al 30-sep-2026 (RND 102600000007, sin efecto desde el 30-sep)](https://www.impuestos.gob.bo/index.php/nota_prensa/el-sin-amplia-hasta-el-30-de-septiembre-el-plazo-para-la-implementacion-de-la-facturacion-en-linea/) ·
[RND 102600000026 (PDF)](https://www.impuestos.gob.bo/wp-content/uploads/2026/07/RND102600000026.pdf) ·
[SIN — facturas en moneda extranjera con TCO del BCB](https://www.impuestos.gob.bo/index.php/nota_prensa/se-establece-que-facturas-en-moneda-extranjera-deben-registrar-el-tipo-de-cambio-oficial-vigente-del-bcb/)

**Verificado en producción el 2026-08-18:** `https://onia.com.bo/privacidad` (v1.0,
OniaAgency, NIT 5371375010) · `https://app.onia.com.bo/privacy` (v2026.06.03, "OnIA / On
Inteligencia Artificial", gmail) · código de `onia-platform`:
`lib/legal.ts` · `lib/plan-limits.ts:58-120,489` · `app/api/reports/export/route.ts` ·
`app/api/auth/register/route.ts:210` · `app/(auth)/register/page.tsx:629-637` ·
`app/data-processing/page.tsx:53`.

**Internos:** `historial/ONIA_SEGURIDAD_PRIVACIDAD_PLAN_20260807.md` (auditoría completa) ·
`historial/ONIA_LEGAL_PENDIENTES_ABOGADO_20260813.md` · `ONIA_FECHAS_CRITICAS_PLAN.md` ·
`ONIA_SENAPI_PI112_TRAMITE.md` · `docs/legal/*_BORRADOR.md` (históricos).
