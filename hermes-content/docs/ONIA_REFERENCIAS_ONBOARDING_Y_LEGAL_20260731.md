# Onia — Referencias de onboarding y estructura legal

**Fecha:** 2026-07-31
**Objetivo:** copiar la ESTRUCTURA (no el diseño) de quienes ya venden software por
suscripción, y armar el esqueleto legal de Onia Platform.
**Estado:** documento de investigación interno.

> ⚠️ **NO SOY ABOGADO.** La parte legal de este documento es un **esqueleto para que
> un abogado matriculado en Bolivia lo revise**, no un contrato listo para usar.
> Todo lo que no pude verificar en fuente primaria va marcado
> `[VERIFICAR CON ABOGADO]`. Son datos de salud de pacientes reales: un artículo
> inventado es peor que un hueco.

---

## 0. Qué se investigó y qué no se pudo

**6 referencias estudiadas:** Hostinger (principal), Shopify, Doctocliq, Dentalink,
Dentiqa, Sintic Bolivia. Para términos: Shopify ToS + Supabase DPA + Hostinger
Refund Policy.

**Huecos honestos:**

| Qué faltó | Por qué |
|---|---|
| Stripe SSA | `stripe.com` bloqueado por política de red. Sustituido por Shopify ToS (estructura de 16 secciones) + Supabase DPA (estructura de encargado del tratamiento). |
| Plazo exacto de conservación del expediente clínico en Bolivia | La Norma Técnica está publicada solo como PDF escaneado (imagen) en minsalud.gob.bo; no es extraíble. Se identificó el artículo (Art. 31, Conservación) pero **no los años**. Marcado `[VERIFICAR]`. |
| Precios de Doctocliq | La página `planes-y-precios` no respondió. Sí se verificaron los límites del plan gratis. |
| Conteo exacto de campos del checkout de Hostinger | cybernews devolvió 403. El conteo va como estimado y está marcado. |

---

## 1. Tabla comparativa de referencias

### 1.1 Campos y tarjeta antes de ver valor

"Ver valor" = ver el panel/producto funcionando, no un video ni un formulario de demo.

| Referencia | ¿Tarjeta antes de probar? | Campos hasta el primer valor | Qué es "el primer valor" |
|---|---|---|---|
| **Doctocliq** (dental LATAM) | **No** | **1** (email) + activación por email | Panel completo, plan gratis permanente |
| **Shopify** | **No** (para los 3 días) | **2 obligatorios** (email, contraseña) + país; las preguntas de negocio son **salteables** | Dashboard de la tienda |
| **Dentiqa** (dental MX) | No | Formulario de demo | Demo agendada — no self-service |
| **Hostinger** | **Sí — se paga primero** | **~7-9** (email/SSO + plan + período + país + datos de facturación + método de pago) `[estimado]` | hPanel, ya pagado. Sin trial: **garantía de 30 días** |
| **Sintic Bolivia** (SIAT) | Sí (compra directa) | Compra + **prerrequisitos fiscales** (NIT activo, acceso a portales SIAT, modalidad asignada por el SIN, firma digital) | Sistema facturando "en 2 horas" |
| **Dentalink** (dental regional) | — | Formulario de cotización | Nada self-service: **cero precio publicado** |

**Lectura:** el rango real es 1 → 9 campos. El mercado dental de la región ya está
en **1 campo y gratis** (Doctocliq). Onia no puede pedir más que Shopify (2) si
quiere que un dentista boliviano llegue solo al panel.

### 1.2 Estructura del onboarding

| Referencia | Pasos | ¿Salteable? | ¿Progreso visible? | Anti-abandono |
|---|---|---|---|---|
| **Hostinger** | 4-6 según rama (ver §1.4) | **Sí** (dominio temporal, "Skip" de plataforma) | Sin barra explícita `[no verificado]` | Dominio temporal · salir y volver sin reiniciar · IA que construye por vos · el update 2025 permite **cambiar de rumbo sin reiniciar** |
| **Shopify** | 3 (email → contraseña → país), + preguntas de negocio opcionales | **Sí**, las preguntas de negocio | Sí (checklist de setup en el dashboard) | Salteo directo al dashboard · trial sin tarjeta |
| **Doctocliq** | 1 (email) + activar | — | — | Gratis permanente con tope de volumen · trial de 7 días del plan avanzado encima del gratis |
| **Sintic** | Compra → configuración fiscal | No: los prerrequisitos SIAT son bloqueantes | — | Promesa de tiempo ("2 horas") |
| **Dentalink / Dentiqa** | Sales-led | — | — | Demo personalizada |

### 1.3 Dónde cortan chico / grande

| Referencia | Qué separa los planes | ¿Dónde deja de publicarse el precio? |
|---|---|---|
| **Sintic Bolivia** | **Volumen puro**: sucursales, puntos de venta, cantidad de productos. Facturas ilimitadas en todos. API REST desde el 3º | **Nunca** — publica los 4: Bs 85 / 150 / 250 / 500 al mes, incluido el "Empresarial" |
| **Dentiqa** | Funciones + volumen | Publica los 3: USD 89 / 149 / 249 al mes |
| **Doctocliq** | **Volumen**: gratis hasta 30 pacientes o citas al mes, sin límite de tiempo | Plan pago existe; precio no verificado |
| **Dentalink** | **Funciones** (Esencial → Pro → Titanium: multicentro, comisiones, campañas, ortodoncia). No por usuarios ni sucursales | **Desde el plan 1**: los tres dicen "solicitá cotización / demo" |
| **Shopify** | Volumen de transacción + funciones; Plus = enterprise | Plus (enterprise) es sales-led |
| **Hostinger** | Recursos (sitios, storage, CPU) | VPS/Cloud alto → sigue publicado; solo lo dedicado es cotizado |

**Lectura para Onia:** el competidor regional más parecido (Dentalink) **esconde el
precio desde el primer plan**. Es la oportunidad — publicar precio en Bs en los tres
planes es diferenciación directa contra el líder, y es lo que hace el proveedor local
que ya le vende a nuestro cliente (Sintic, Bs 85-500 todos publicados).

### 1.4 Hostinger en detalle — la referencia principal

Sergio: *"una forma de configuración que me gusta mucho es la de Hostinger, el tipo
que va paso a paso"*. Lo importante es **dónde vive ese wizard**.

**Hostinger separa COMPRAR de CONFIGURAR.** No hay prueba gratis: se paga primero
(con garantía de devolución de 30 días) y el wizard paso a paso corre **después**,
dentro de hPanel, sobre un plan ya pagado. El botón se llama literalmente `Setup` y
está en la home del panel.

Flujo del wizard (rama "crear sitio nuevo"):

1. **¿Crear un sitio nuevo o migrar uno existente?** — una decisión, dos caminos.
2. **¿Qué plataforma?** WordPress · Website Builder · **Skip** (decidir después).
3. *(si WordPress)* Idioma del panel + email de administrador + contraseña.
4. **¿Con IA o en blanco?** — la IA hace el trabajo por vos.
5. **Dominio**: propio · subdominio · comprar · gratis · **temporal** (= "seguí sin decidir").
6. **Ubicación del servidor.**

Rama "migrar": dominio → ubicación → sitio de origen + backups → pasos según se
detecte WordPress o PHP/HTML.

Propiedades del flujo, verificadas:
- Se pueden saltar pasos ("Use a temporary domain", "Skip" de plataforma).
- Se puede salir (clic en el logo → hPanel) y **completar el setup después sin reiniciar**.
- El update 2025 del plugin *Easy Onboarding* agrega explícitamente: ajustar el recorrido
  **sin reiniciar**, acceder al constructor con IA aunque no lo hayas elegido al principio,
  y cambiar de plantilla sobre la marcha.
- No se documenta barra de progreso explícita.

---

## 2. Flujo recomendado para Onia — pantalla por pantalla

Principios que salen de lo observado:

- **P1. Separar comprar de configurar** (Hostinger). El wizard es una experiencia de
  producto, no un formulario de venta.
- **P2. Nunca bloquear por un dato que el cliente no tiene a mano** (dominio temporal
  de Hostinger). Traducción a Bolivia: **NIT, firma digital, logo y lista de precios
  jamás en el camino crítico.**
- **P3. Todo salteable y retomable** (Hostinger + Shopify).
- **P4. Sin tarjeta para probar** (Shopify, Doctocliq). En Bolivia esto es doblemente
  cierto: el riel de cobro real es **QR**, no tarjeta. Pedir tarjeta mata la conversión
  antes de empezar.
- **P5. El piso competitivo es Doctocliq**: gratis permanente hasta 30 pacientes/mes con
  **un solo campo**. Onia no gana pidiendo menos datos — gana en lo que el cliente ve
  funcionando en los primeros 5 minutos.

### Las pantallas

| # | Pantalla | Campos | Salteable | Por qué (referencia) |
|---|---|---|---|---|
| 0 | Landing → **"Probar gratis"** (sin tarjeta) | 0 | — | Shopify: trial sin tarjeta. Doctocliq: gratis. No podemos pedir tarjeta si el competidor no pide nada |
| 1 | **Crear cuenta**: email + contraseña | **2** | No | Shopify pide exactamente esto. Es el mínimo defendible |
| 2 | **¿Qué tipo de negocio tenés?** (tarjetas: consultorio dental · comercio · servicios) | 1 clic | No, pero es un clic | Shopify pregunta país para fijar moneda/impuestos; Onia pregunta rubro porque **el rubro decide qué módulos se activan** — es la decisión que más ahorra pantallas después |
| 3 | **Nombre del negocio + ciudad** | **2** (con default) | **Sí** | Personaliza el panel. Salteable como las preguntas de negocio de Shopify |
| 4 | **🎯 PRIMER VALOR: el panel, ya cargado** con agenda y datos de ejemplo del rubro | 0 | — | Fin del wizard modal. Total: **4 campos**. Debajo de Hostinger (~8), a la par de Shopify (2-3), por encima de Doctocliq (1) — el costo extra se justifica solo si la pantalla 4 muestra un panel que ya se ve como su clínica |

A partir de acá **no hay más wizard modal**. Hay un **checklist de puesta en marcha**
en el panel, con porcentaje de avance, todo opcional y retomable:

| Tarea | Por qué en ese orden |
|---|---|
| a. Cargar tu horario de atención | Es el dato que el dueño tiene en la cabeza, sin buscar nada. Primera victoria barata |
| b. Cargar servicios y precios (o **importar Excel/CSV**) | Sintic vende "importación Excel" como feature de plan pago; para nosotros es anti-abandono, va gratis |
| c. Invitar al equipo | Convierte la cuenta en cuenta de la clínica, no del dueño. Sube el costo de irse |
| d. Conectar WhatsApp (botón click-to-chat) | Incluido y gratis. El **chatbot IA** es el add-on pago — no confundirlos (regla de CLAUDE.md) |
| e. Importar pacientes | Requiere que junte un archivo → tarea de "otro día", nunca bloqueante |
| f. **Activar facturación SIAT** — al final, y explícitamente opcional | **Lección Sintic**: sus prerrequisitos (NIT activo sin marcas, portales SIAT, modalidad asignada, firma digital) son bloqueantes. Si Onia los pone al principio, pierde a todo el que no los tenga ese día. Y por la regla de honestidad SIAT: el portal del SIN es gratis; Onia vende no tipear dos veces, no una obligación legal |

**Mecánicas anti-abandono a copiar, explícitas:**

1. Barra de progreso con porcentaje + tiempo estimado por tarea (lo que a Hostinger le falta).
2. **"Después"** disponible en cada paso; nada obligatorio salvo email y contraseña.
3. Estado guardado: cerrar y volver **no reinicia** (update 2025 de Hostinger).
4. **Datos de ejemplo del rubro** precargados: el panel nunca se ve vacío.
5. Un botón "hacelo por mí" donde se pueda (equivalente al "crear con IA" de Hostinger).

### Conversión y planes

- El trial/plan gratis termina por **volumen**, no por reloj — copiando a Doctocliq
  (30 pacientes/mes). Un límite de volumen convierte al que ya tiene el hábito; un
  límite de días expulsa al que todavía no lo formó.
- Al tocar el límite: pantalla de planes **en Bs, con precio publicado en los tres**
  (contra Dentalink, que no publica ninguno), y **cobro por QR** (Sintic cobra por
  PayPal y Binance — hay espacio obvio para ganar con QR local).
- Los tres planes se diferencian por **salto de valor**, no por cantidad de pantallas
  (regla de CLAUDE.md aplicada al SaaS): **registrar → cobrar → automatizar**.
- "Hablá con ventas" **solo** para: grupo clínico multi-sucursal, on-premise e
  integraciones a medida. Nunca para el plan 1 ni el 2.

---

## 3. Esqueleto de Términos y Condiciones

**Base estructural:** los ToS de Shopify tienen 16 secciones en este orden — Account
Terms · Account Activation · Shopify Rights · Your Responsibilities · Payment of Fees
and Taxes · Confidentiality · Limitation of Liability and Indemnification ·
Intellectual Property and Your Materials · Additional Services · Feedback and Reviews ·
IP Infringement · Privacy and Data Protection · Contracting Party and Forum · Term and
Termination · Modifications · General Conditions.

Ese es el estándar del rubro. Abajo, cada cláusula con **qué debe decir en nuestro caso**
y **cómo la resuelven las referencias**.

| # | Cláusula | Para qué sirve | Qué hacen las referencias | Qué debe decir en Onia |
|---|---|---|---|---|
| 1 | **Qué es el servicio / qué NO es** | Delimita expectativas y responsabilidad profesional | Shopify: "Shopify Rights" + "Your Responsibilities" | Onia no es asesoría fiscal, contable, legal ni médica. La IA **propone**, el humano **aprueba** |
| 2 | **Cuenta y responsabilidad del cliente** | Credenciales, gestión de usuarios, bajas | Shopify §1-2 | Crítico en salud: el cliente **debe dar de baja al personal que se va** — si no, ese ex-empleado sigue viendo historias clínicas |
| 3 | **Planes, pagos, renovación** | Moneda, ciclo, mora | Shopify: cobra en ciclo, sin reembolsos. Hostinger: 30 días de devolución | Bs · trimestre adelantado · QR · gracia antes de suspender |
| 4 | **Cambio de precio** | Cómo se avisa | Shopify: **30 días** de aviso previo por email o panel | 30 días + rige desde la renovación siguiente. **Ojo Ley 453** (§3.1 abajo) |
| 5 | **Propiedad de los datos del cliente** | Quién es dueño de lo que se sube | Shopify: el comerciante conserva propiedad **pero otorga licencia amplísima** (host, use, distribute, modify, copy, store) y renuncia a derechos morales | Onia debe otorgar **menos** licencia que Shopify: solo alojar, procesar, respaldar y mostrar **para prestar el servicio**. Nada de "modify/distribute" genérico sobre historias clínicas |
| 6 | **Qué pasa con los datos al dejar de pagar** | Retención y borrado | Shopify: **no especifica plazo**. Hostinger: al pedir reembolso, **borrado inmediato** de archivos, bases y correos | Aquí Onia debe ser **mejor que ambos**: suspensión ≠ borrado. Ventana de exportación explícita antes de eliminar. Ver §4.2 — hay un choque con el plazo legal de conservación clínica |
| 7 | **Límite de responsabilidad** | Tope de exposición | Shopify: exclusión general de daños indirectos, **sin tope monetario**. Estándar del rubro: tope = lo pagado en los últimos 12 meses | Tope de 12 meses. **Riesgo Ley 453** (§3.1) |
| 8 | **Disponibilidad / SLA** | Si se promete un % | Shopify: *"does not warrant that the Services will be uninterrupted, timely, secure, or error-free"* — **sin porcentaje** | Sin SLA numérico está bien y es el estándar. Con una excepción de salud: ver §4.4 |
| 9 | **Cancelación y devolución** | Cómo se sale | Shopify: **no da reembolsos**. Hostinger: 30 días, con lista larga de excluidos (dominios, licencias, créditos prepagos) | Sin penalidad por no renovar. Si hay devolución, **listar qué NO se devuelve** (como Hostinger) |
| 10 | **Propiedad intelectual del software** | El software es del proveedor | Shopify §8 | Derecho de uso temporal, no exclusivo, intransferible |
| 11 | **Uso aceptable** | Prohibiciones | Shopify §4 | Sin spam, sin cargar datos de terceros sin base, sin ingeniería inversa, sin reventa |
| 12 | **Privacidad y protección de datos** | Puente al doc de privacidad y al DPA | Shopify §12: el comerciante es responsable, Shopify es **procesador** bajo su DPA aparte | Onia igual: el documento de roles va **aparte** (§4.3) |
| 13 | **Vigencia y terminación** | Causales y aviso | Shopify §14 | Incluir **discontinuación del servicio** con aviso y devolución proporcional — el caso "Onia cierra" (§4.5) |
| 14 | **Cambios a los términos** | Cómo se notifica | Shopify §15: publica y notifica | 30 días. **Riesgo Ley 453** (§3.1) |
| 15 | **Ley aplicable y jurisdicción** | Dónde se litiga | Shopify §13: parte contratante y foro según región | Bolivia · Santa Cruz de la Sierra |
| 16 | **Disposiciones finales** | Divisibilidad, cesión, acuerdo completo | Shopify §16 | Estándar |

### 3.1 ⚠️ El riesgo boliviano que no aparece en ninguna referencia extranjera: Ley 453

**Ley Nº 453 de 4 de diciembre de 2013** — Ley General de los Derechos de las Usuarias y
los Usuarios y de las Consumidoras y los Consumidores. Declara **cláusulas abusivas**
(y las tiene **por no puestas, sin efecto legal alguno**), entre otras, las que:

- excluyan o limiten los derechos del usuario/consumidor;
- **establezcan a favor del proveedor la facultad unilateral de modificar los términos
  del contrato** previamente suscrito;
- **exoneren de responsabilidad al proveedor**;
- establezcan el **silencio del usuario como aceptación**;
- señalen que la información personal será compartida con otros proveedores (salvo
  normativa específica).

Además exige que los **contratos de adhesión** estén redactados en términos claros,
sencillos y comprensibles, **legibles a simple vista y en idioma castellano**.

`[VERIFICAR CON ABOGADO: numeración exacta de artículos. La consulta a lexivox devolvió
Art. 3 (ámbito), Art. 5 num. 1 (destinatario final), Art. 19 (contrato de adhesión),
Art. 21 (redacción clara), Art. 22 (cláusulas abusivas). Confirmar contra el texto oficial.]`

**Por qué importa exactamente a nosotros:** tres cláusulas estándar del SaaS
internacional caen justo en la definición de abusiva —

1. el **ajuste unilateral de precio**,
2. la **limitación de responsabilidad**,
3. el **cambio de términos con aceptación tácita**.

`[VERIFICAR CON ABOGADO — la pregunta decisiva]`: la Ley 453 define al consumidor como
**destinatario final** (persona natural o jurídica). Una clínica que contrata software
para operar su negocio ¿es destinataria final del servicio, o es consumo empresarial
intermedio y queda fuera? De esa respuesta depende si las tres cláusulas de arriba son
exigibles o se tienen por no puestas. **Es la consulta #1 al abogado.**

Mitigación posible mientras tanto (no reemplaza al abogado): que el ajuste de precio y
el cambio de términos **no operen dentro de un período ya pagado**, se avisen con
antelación, y den **salida sin penalidad** — así el cliente conserva la decisión y la
cláusula deja de ser puramente unilateral.

---

## 4. Lo específico de nuestro caso — datos de salud en Bolivia

### 4.1 El estado real de la normativa (verificado)

**Bolivia NO tiene ley integral de protección de datos personales vigente.** Verificado
contra: la guía de InternetBolivia (2025), el material de AGETIC (2025) y análisis
públicos concordantes. AGETIC presentó un **anteproyecto (2024)**; al 2024 se contaban
**cuatro proyectos de ley observados sin aprobación**, y no se encontró evidencia de
promulgación a julio de 2026.

Lo que **sí** está vigente y aplica:

| Norma | Qué aporta | Alcance / cuidado |
|---|---|---|
| **Constitución Política del Estado (2009), art. 21** | Derecho a la privacidad e intimidad | Base constitucional |
| **CPE (2009), art. 130 — Acción de Protección de Privacidad** | Permite a cualquier persona **conocer, objetar, y lograr la eliminación o rectificación** de sus datos (derechos tipo ARCO) | **Es la vía real de reclamo en Bolivia.** Una paciente puede accionar contra la clínica — y salpicar a Onia |
| **DS Nº 1793 de 13 de noviembre de 2013** (Reglamento a la Ley 164), **art. 56 "Protección de datos personales"** | Exige **conocimiento previo y consentimiento expreso y escrito del titular** para el tratamiento técnico de datos personales en sector público y privado | ⚠️ **Cuidado de alcance:** el art. 2 del reglamento fija su ámbito en personas que *"realicen actividades o presten servicios relacionados con la certificación digital"*, pero el texto del art. 56 se redacta en términos generales. `[VERIFICAR CON ABOGADO: si el art. 56 obliga a un SaaS que no es entidad certificadora]` |
| **Ley Nº 1080 de 11 de julio de 2018 (Ciudadanía Digital), art. 12** | Uso de datos de la plataforma de interoperabilidad solo para los fines establecidos | ⚠️ Obliga a **servidores públicos**. **No aplica directamente a Onia.** No citarla como si nos obligara |
| **Ley Nº 3131 de 8 de agosto de 2005** (Ejercicio Profesional Médico) | **Secreto médico inviolable**, salvo excepciones de la propia ley; cubre estado de salud, enfermedad, tratamiento y demás datos personales, **y subsiste después de la muerte** | **Ésta es la norma que de verdad manda sobre historias clínicas** |
| **DS Nº 28562 de 22 de diciembre de 2005** (Reglamento a la Ley 3131), **art. 12** | Define **Expediente Clínico** (historia clínica + documentos del caso surgidos fuera del proceso asistencial) e **Historia Clínica** (documentos escritos e iconográficos generados en cada proceso asistencial) | Da las definiciones que el contrato debe usar |
| **Norma Técnica para el Manejo del Expediente Clínico** (Norma Nº 64), aprobada por **RM Nº 0090 de 26 de febrero de 2008** | Manejo, conservación (**Art. 31**) y archivo del expediente clínico; obligatoria para todos los establecimientos de salud | `[VERIFICAR: número de años de conservación. El PDF oficial es escaneado y no fue extraíble]` |

**Consecuencia práctica:** al no haber ley de datos, **no existe un "encargado del
tratamiento" definido por ley boliviana**. El rol de Onia como encargado **no lo da la
ley: lo tiene que dar el contrato.** Por eso la figura hay que crearla por escrito, no
invocarla.

### 4.2 💣 El choque que hoy no está resuelto: borrado a 90 días vs. conservación clínica

El borrador actual de Privacidad dice que Onia elimina los datos **a los 90 días** de
terminado el contrato, y traslada al cliente la obligación de conservar el expediente.

Pero el expediente clínico tiene **plazo legal de conservación** en Bolivia
(Norma Técnica del Expediente Clínico, Art. 31) — un plazo que casi con seguridad se
mide en **años**, no en 90 días. `[VERIFICAR: cuántos años]`

Si Onia borra y la clínica no exportó, **la clínica queda en infracción sanitaria y la
paciente sin historia clínica**. Es un riesgo real, no teórico.

**Lo que debe decir la cláusula:**

1. Onia **no elimina expedientes clínicos por silencio**. El borrado en el vertical
   salud exige **instrucción escrita del cliente** o el vencimiento del plazo legal de
   conservación, lo que ocurra **después**.
2. Antes de cualquier eliminación, **exportación obligatoria y comprobada**: Onia genera
   el paquete, notifica y **deja constancia** de la entrega.
3. Si el cliente no responde, Onia **conserva en archivo frío** (sin acceso a la
   aplicación) hasta el plazo legal, con un costo de custodia si corresponde, en vez de
   borrar.
4. La instrucción de borrado anticipado del cliente debe quedar **registrada** y con
   advertencia expresa de las consecuencias.

**Referencia de contraste:** Hostinger borra **inmediatamente** al procesar un reembolso
(archivos, bases y correos). Eso es aceptable para un hosting; sería **inadmisible**
para historias clínicas. Es el punto donde Onia **no debe** copiar a la referencia.

### 4.3 El anexo de tratamiento de datos (DPA) — hoy no existe y hace falta

Shopify separa: los ToS dicen "el comerciante es responsable, Shopify es procesador" y
el detalle vive en un **DPA aparte**. Es la estructura correcta.

**Modelo directo y verificado: el DPA de Supabase** — que además es *nuestro propio
subprocesador*, así que fija el techo de lo que Onia puede prometer:

| Cláusula del DPA de Supabase | Contenido verificado | Qué implica para el DPA de Onia |
|---|---|---|
| Roles | Supabase = procesador; cliente = controlador; Supabase es subprocesador de los controladores del cliente | **Cadena de tres:** paciente → clínica (responsable) → Onia (encargado) → Supabase (subencargado). Escribirla completa |
| Instrucciones | Solo procesa bajo instrucciones del cliente; debe avisar si una instrucción infringe la ley | Onia trata datos de pacientes **solo por instrucción de la clínica** |
| Subprocesadores | Lista pública + aviso de cambios con **30 días**; el cliente puede objetar en 5 días y terminar si no se resuelve | Onia debe publicar su lista y dar derecho de objeción — hoy la lista existe pero **sin plazo ni derecho a objetar** |
| Seguridad | AES-256 en reposo, TLS 1.2 en tránsito, mínimo privilegio, 2FA obligatorio (sin SMS), pentests | Onia puede comprometerse a esto **porque su proveedor ya lo da** |
| Brechas | Aviso sin demora indebida y, **cuando sea posible, dentro de 48 horas** | Onia **no puede prometer menos de 48 h** a la clínica, porque es lo que recibe |
| Devolución/borrado | **30 días** post-terminación para pedir copia; después elimina | Coherente con la ventana de exportación de Onia — pero ver el choque de §4.2 |
| Auditoría | Máx. 1 vez por año, 30 días de aviso; sustituible por SOC2/ISO 27001 | Copiable tal cual |
| Transferencia internacional | SCCs de la UE + adendas UK/Suiza | Bolivia no tiene régimen de transferencia. Se resuelve **por contrato**: `[VERIFICAR CON ABOGADO]` |

**Regla de oro que sale de esta tabla: Onia no puede prometer a la clínica más de lo que
recibe de Supabase.** Cualquier promesa por encima (borrado en 24 h, RTO garantizado,
datos alojados en Bolivia) es una promesa que Onia no puede cumplir.

### 4.4 Salud y disponibilidad: la excepción al "sin SLA"

Estar sin SLA numérico es el estándar (Shopify lo dice explícitamente). Pero hay un caso
que sí conviene comprometer aunque no se prometa un porcentaje: **el acceso de
emergencia a la historia clínica**. Un vía alternativa (exportación de urgencia, respaldo
descargable periódico en poder de la clínica) protege a Onia más de lo que la expone,
porque traslada al cliente una copia real. `[VERIFICAR CON ABOGADO]`

### 4.5 Facturación fiscal: qué responsabilidad es de quién

Verificado en la normativa del SIN (Sistema de Facturación, **RND Nº 102100000011** de
11 de agosto de 2021):

- **El Sujeto Pasivo del IVA responde ante la Administración Tributaria por los impuestos
  resultantes de las facturas emitidas a través de terceros.**
- **Las modificaciones hechas por el Proveedor o su cliente al Sistema de Facturación
  Autorizado, o el uso indebido de la aplicación, son de exclusiva responsabilidad del
  Sujeto Pasivo que use dicho Sistema.**

`[VERIFICAR CON ABOGADO: numeral y artículo exactos dentro de la RND. La disposición está
verificada en su contenido; su ubicación precisa, no.]`

**Traducción al contrato:** la RND ya pone la responsabilidad fiscal en el contribuyente.
El T&C **no la crea, la refleja**. Y refuerza la postura ONIA verificada: el SIN tiene
portal web **gratuito**; Onia vende no tipear dos veces, **nunca "es obligatorio por ley
usar Onia"**.

**Conservación de documentos fiscales:** el **Código Tributario (Ley Nº 2492 de 2 de
agosto de 2003), art. 70 num. 8** obliga al sujeto pasivo a conservar en su domicilio
fiscal libros, registros, declaraciones, comprobantes, **medios de almacenamiento e
información computarizada** mientras el tributo no prescriba. La prescripción es de
**8 años** (art. 59, modificado por la **Ley Nº 812 de 1 de julio de 2016**), ampliable
en 2 años más si el contribuyente no está inscrito.

**Consecuencia dura:** si Onia borra a los 90 días, borra registros que el cliente está
obligado a conservar **hasta 8-10 años**. Mismo problema que §4.2, por otra vía. La
exportación previa al borrado no es cortesía: es lo que evita dejar al cliente en
infracción.

### 4.6 Qué pasa con los datos si Onia cierra

Ninguna de las referencias resuelve esto bien — Shopify no fija plazo de retención y
Hostinger borra de inmediato. Es una cláusula donde Onia puede ser **mejor que el
estándar**, y en salud debe serlo:

1. **Aviso mínimo de 60-90 días** antes de discontinuar (el borrador ya tiene 60).
2. **Exportación garantizada** en formato estándar (CSV/JSON) **antes** de apagar nada,
   con constancia de entrega.
3. **Devolución proporcional** de lo pagado y no gozado (ya está en el borrador).
4. **Continuidad para el vertical salud** `[VERIFICAR CON ABOGADO]`: definir un
   mecanismo — depósito del respaldo cifrado ante un tercero, o entrega del dump a cada
   clínica con constancia — para que ninguna quede sin expediente. Es lo que separa un
   proveedor de salud serio de un SaaS cualquiera.
5. **Continuidad de la instalación on-premise** para quien la tenga: qué licencia
   sobrevive al cierre.

---

## 5. Qué falta en lo que ya está escrito

### 5.1 Veredicto: NO es un placeholder

`web-factory/apps/onia-platform/src/app/terminos/` y `/privacidad/` son páginas Next de
14 líneas que renderizan markdown desde
`web-factory/apps/onia-platform/src/content/legal/{terminos,privacidad}.md`.

Ese markdown es un **borrador v0.2 (2026-07-25) serio y bien redactado**, no un
placeholder. Cubre **12 de las 16 cláusulas** del estándar Shopify, está en castellano
claro, marca sus propios huecos con `[REVISAR ABOGADO]` y ya lleva `robots: index:false`.

**Dos cosas están notablemente bien hechas y hay que defenderlas:**

- **§9.3 de Privacidad** afirma que Bolivia no tiene ley integral de protección de datos
  y se apoya en CPE art. 21 y 130 adoptando principios **por contrato**. **Mi
  investigación lo confirma como correcto.** Es honesto y es la postura defendible.
- La tabla de roles de §1 de Privacidad (Onia responsable de datos de cuenta / encargado
  de datos de pacientes) es exactamente la estructura correcta.

### 5.2 Los huecos, por prioridad

| # | Falta | Gravedad | Dónde |
|---|---|---|---|
| **1** | **Colisión borrado 90 días vs. conservación legal** (expediente clínico y registros fiscales 8-10 años). Privacidad §8 solo dice "es obligación tuya" | 🔴 **Crítico** — puede dejar al cliente en infracción sanitaria y tributaria | Privacidad §8 · T&C §4.2 |
| **2** | **No existe el anexo de tratamiento de datos (DPA)**. Está identificado como pendiente pero no redactado | 🔴 **Crítico** — sin él, el rol de encargado no está creado por escrito, y en Bolivia **no lo da la ley** | Documento nuevo |
| **3** | **Ninguna norma sectorial de salud citada**: falta Ley 3131 (secreto médico), DS 28562 art. 12 (definiciones), Norma Técnica del Expediente Clínico / RM 0090-2008 | 🔴 **Crítico** — es la normativa que de verdad obliga a nuestro cliente | Privacidad §2.3 · §8 |
| **4** | **Riesgo Ley 453**: el ajuste de precio (T&C §3.5), la limitación de responsabilidad (§9) y el cambio de términos (§11) caen en la definición legal de cláusula abusiva | 🟠 **Alto** — si aplica, esas cláusulas se tienen **por no puestas** | T&C §3.5, §9, §11 |
| **5** | **Plazo de notificación de brecha sin número**: dice "sin demora indebida". Supabase nos da **48 h** | 🟠 **Alto** — se puede comprometer 48-72 h con respaldo real | Privacidad §7 |
| **6** | **Subprocesadores sin plazo de aviso ni derecho de objeción**. La lista existe; el mecanismo dice `[REVISAR ABOGADO]` | 🟠 **Alto** — Supabase da 30 días + objeción; es copiable | Privacidad §5 |
| **7** | **Cláusula de salida en salud incompleta**: T&C §10.2 da 60 días y devolución, pero no garantiza que ninguna clínica quede sin expediente | 🟠 **Alto** | T&C §10.2 |
| **8** | **Falta citar la RND 102100000011** donde la responsabilidad fiscal ya recae en el sujeto pasivo. El T&C §1.2 lo dice bien pero sin norma detrás | 🟡 Medio — citarla **fortalece** nuestra posición | T&C §1.2, §1.4 |
| **9** | **DS 1793 art. 56 (consentimiento expreso y escrito) no aparece** | 🟡 Medio — con la salvedad de alcance de §4.1 | Privacidad §1 |
| **10** | **Datos identificatorios sin completar**: razón social, NIT, domicilio, correo y teléfono oficiales | 🟡 Medio — un T&C sin identificar al proveedor es de dudosa exigibilidad | T&C §14 · Privacidad §12 |
| **11** | **Baja de personal sin obligación explícita de plazo** | 🟡 Medio — en salud, un ex-empleado con acceso vivo es exposición directa | T&C §2.2 |
| **12** | **Región de alojamiento no declarada** ("fuera de Bolivia", sin país) | 🟢 Bajo pero fácil | Privacidad §4.1 |
| **13** | Faltan del estándar Shopify: **confidencialidad recíproca**, **indemnidad**, **feedback**, **infracción de PI de terceros** | 🟢 Bajo | T&C |

### 5.3 Orden sugerido de trabajo

1. Resolver el conflicto de retención (#1) — es el que produce daño real al cliente.
2. Redactar el DPA / anexo de tratamiento (#2), tomando la estructura del DPA de Supabase.
3. Incorporar las normas de salud (#3) y la RND fiscal (#8).
4. Llevar al abogado la pregunta de la Ley 453 (#4) **antes** de publicar.
5. Cerrar los números fáciles y ya respaldados: 48 h de brecha (#5), 30 días de
   subprocesadores (#6), región de alojamiento (#12).

---

## Fuentes

**Onboarding y planes**
- Hostinger — [How to set up a hosting plan](https://support.hostinger.com/en/articles/6926920-how-to-set-up-a-hosting-plan) · [Product updates 2025](https://www.hostinger.com/blog/product-updates-2025) · [Refund policy](https://www.hostinger.com/legal/refund-policy) · [Hostinger review 2026 (Cybernews)](https://cybernews.com/best-web-hosting/hostinger-review/)
- Shopify — [Terms of Service](https://www.shopify.com/legal/terms) · [Free trial guide 2026 (Launchtip)](https://www.launchtip.com/blog/shopify-free-trial) · [Sign up guide (Avada)](https://avada.io/blog/sign-up-for-shopify/)
- Doctocliq — [Software dental gratis](https://www.doctocliq.com/software-dental-gratis-doctocliq) · [Planes y precios](https://www.doctocliq.com/planes-y-precios)
- Dentalink — [Planes](https://www.softwaredentalink.com/es/planes)
- Dentiqa — [Software dental México](https://dentiqa.app/mx)
- Sintic Bolivia — [Facturación electrónica SIAT en la nube](https://sinticbolivia.net/sistema-de-facturacion-electronica-siat-en-la-nube)
- Supabase — [Data Processing Addendum](https://supabase.com/legal/dpa)

**Normativa boliviana**
- CPE arts. 21 y 130 — [Normativa sobre datos personales en Bolivia (M. Durán)](https://medium.com/@mrduranch/normativa-sobre-datos-personales-en-bolivia-ece7a61f50b0) · [La Acción de Protección de Privacidad](https://www.rigobertoparedes.com/es/la-accion-de-proteccion-de-privacidad-en-bolivia/)
- Estado del anteproyecto — [AGETIC, Manual de Protección de Datos (2025)](https://agetic.gob.bo/sites/default/files/2025-06/Manual-de-Proteccion-de-Datos-2-firmado.pdf) · [AGETIC, Presentación anteproyecto 2024](https://agetic.gob.bo/sites/default/files/2025-06/DATOS-PERSONALES-PRESENTACION-ANTEPROYECTO-DE-LEY-2024-firmado.pdf) · [InternetBolivia, Guía de implementación (2025)](https://internetbolivia.org/wp-content/uploads/2025/05/guia_proteccion_datos_web.pdf) · [Access Now — Guía para una ley boliviana](https://www.accessnow.org/guia-para-una-ley-de-proteccion-de-datos-personales-en-bolivia/)
- DS 1793/2013 art. 56 — [Lexivox](https://www.lexivox.org/norms/BO-RE-DSN1793.html)
- Ley 453/2013 — [Lexivox](https://www.lexivox.org/norms/BO-L-N453.html) · [Texto oficial (BCB)](https://www.bcb.gob.bo/webdocs/normativa/2013%20-%20LEY%200453%20-%20Derechos%20Usuarios%20y%20Consumidores.pdf)
- Ley 3131/2005 y DS 28562/2005 — [Lexivox DS 28562](https://www.lexivox.org/norms/BO-DS-28562.html) · [Ley 3131 (Derechoteca)](https://www.derechoteca.com/legal-tech-bolivia-bo-d-lex-norma/ley-3131-del-08-agosto-2005)
- Norma Técnica Expediente Clínico (RM 0090/2008) — [Ministerio de Salud (PDF escaneado)](https://www.minsalud.gob.bo/images/Documentacion/dgss/Area_de_Calidad/64%20Norma%20expediente%20clinico.pdf) · [Norma Técnica N° 64 (referencia)](https://www.studocu.com/bo/document/universidad-privada-del-valle/salud-publica-i/64-norma-tecnica-para-el-manejo-del-expediente-clinico/84712879)
- Ley 2492 (Código Tributario) y Ley 812/2016 — [Código Tributario (AIT)](https://www.ait.gob.bo/wp-content/uploads/2023/04/Ley-2492-Codigo_Tributario_Boliviano.pdf) · [Ley 812 (Lexivox)](https://www.lexivox.org/norms/BO-L-N812.html) · [Prescripción tributaria (Bolivia Impuestos)](https://boliviaimpuestos.com/nueva-ley-cuando-prescriben-impuestos/)
- RND 102100000011 — [RND (Lexivox)](https://www.lexivox.org/norms/BO_SIN-RND-R-0011-01.xhtml) · [Obligaciones de los emisores](https://impuestos.com.bo/sistema-de-facturacion-obligaciones-de-los-emisores-rnd-1021-11/) · [Emisión de documentos fiscales](https://impuestos.com.bo/sistema-de-facturacion-emision-de-documentos-fiscales-rnd-1021-11/)

---

> ⚠️ **Recordatorio final.** No soy abogado. Este documento es investigación y un
> esqueleto para revisión profesional. Antes de publicar cualquier T&C o Política de
> Privacidad de Onia, un **abogado matriculado en Bolivia** debe revisarlo — con
> atención prioritaria a la pregunta de la **Ley 453** (§3.1), al **plazo legal de
> conservación del expediente clínico** (§4.2) y al **anexo de tratamiento de datos**
> (§4.3).
