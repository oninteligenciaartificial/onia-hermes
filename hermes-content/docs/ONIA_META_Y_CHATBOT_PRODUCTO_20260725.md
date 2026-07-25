# ONIA — Playbook Meta + Chatbot como producto (2026-07-25)

> Research con fuentes. Datos legales reales del SEPREC en [[onia-datos-legales-seprec]].

# PLAYBOOK ONIA — Meta, verificación y chatbot como producto
**Fecha:** 2026-07-25 · **Autor:** líder técnico · **Para:** Sergio

---

## 0. Los cuatro hechos que ordenan todo el plan

1. **El ad account `act_1073680778314945` NO se puede mover** entre portfolios. Meta lo prohíbe por escrito. Por lo tanto el portfolio comercial de ONIA **ya está definido**: es "OnIA Agency". Todo se acomoda alrededor de eso.
2. **Sergio tiene 1 solo slot de portfolio libre** (Meta permite crear 2 por persona). Ese slot se gasta una sola vez. Va a las personas IA, no a clientes.
3. **Sin verificación, el techo del negocio de chatbots es 2 números de WhatsApp.** Con Bolivian Electric ocupando uno, queda uno. Verificado: 20. La verificación no es papeleo, es la diferencia entre vender un chatbot y vender veinte.
4. **El chatbot que ya existe (Bolivian Electric) es un motor real, pero vive en un worktree sin mergear, sin auth y sin multi-tenant.** Es vendible como "un deploy por cliente"; no es vendible como SaaS hoy.

**Advertencia crítica y no confirmada:** el stack de BE fue onboardeado **vía Chatwoot actuando como BSP (Embedded Signup)**, no con una app de Meta propia de ONIA. Antes de asumir cualquier número del punto 3, **hay que verificar en Business Manager qué portfolio es dueño de la WABA `398983206624133`**. Si es el portfolio de Chatwoot, el cap de 2 números no aplica a ONIA sino a la relación con Chatwoot, y el camino "Tech Provider propio" es un proyecto nuevo, no una migración. `[NO CONFIRMADO - PASO 1 DE TODO]`

---

## 1. Meta — qué hacer ahora, en orden

### 1.1 Los nombres: recomendación

**Regla que casi nadie entiende y define si te rechazan:** son **dos campos distintos** y Meta nunca pide que sean iguales.

| Campo | Qué es | Qué debe decir |
|---|---|---|
| **Nombre del portfolio** ("OnIA Agency") | Nombre **público**, visible en todo Meta | El nombre **comercial** de la marca. Meta pide: *"should match the public name of your business"* |
| **Legal business name** (dentro del formulario de verificación) | Se compara contra el registro oficial | **Exacto, carácter por carácter, del certificado SEPREC** |
| **Nombre de la Página** ("Onia Marketing") | Independiente de los dos anteriores | Debe describir el negocio, cumplir normas de nombres de Página |

**Mi recomendación (criterio de marca + criterio de que no rebote):**

- **Portfolio: renombrar "OnIA Agency" → "ONIA".** Tres motivos: (a) "OnIA" con la n minúscula al medio es capitalización irregular, lee como error tipográfico y es justo el patrón que Meta desaconseja en nombres; (b) "Agency" ya no describe lo que vendés (software + agentes, no agencia) y te posiciona más barato; (c) cuanto más cerca esté el nombre público del nombre de la marca en la web y del nombre comercial del SEPREC, menos fricción tiene el revisor humano.
- **Página: renombrar "Onia Marketing" → "ONIA".** "Onia Marketing" es un nombre válido (no viola nada), pero te encasilla en marketing cuando vendés automatización y SaaS. "ONIA" como sigla en mayúsculas es aceptable para Meta (las siglas pueden ir todo en mayúsculas).
- **Nombre legal: NO lo elijo yo. Lo dicta el papel.** Sergio abre el certificado SEPREC y transcribe literal. Si es empresa unipersonal, probablemente sea su nombre completo con o sin nombre comercial adosado.

**Excepción importante:** si el certificado SEPREC tiene un **nombre comercial** registrado distinto de "ONIA" (por ejemplo "ONIA Inteligencia Artificial" o "ONIA Agency"), **usá ese nombre comercial como nombre del portfolio**. La coherencia con el papel vale más que la estética. `[NO CONFIRMADO: el texto exacto del SEPREC - Sergio tiene que leerlo antes de renombrar nada]`

**Lo que NUNCA hay que hacer:** inventar una razón social que no aparezca en ningún documento. Meta documenta como motivo de rechazo *"Submitting, or being suspected of submitting, false or misleading information"*, y un rechazo por sospecha de información falsa habilita a Meta a *"take additional action on the account"*. Eso es riesgo de perder el ad account, no un trámite fallido.

### 1.2 Cómo quedan los 2 portfolios

| | **Portfolio 1 — "ONIA"** (el que ya existe, `1451773736711697`) | **Portfolio 2 — "ONIA Personas"** (el slot final) |
|---|---|---|
| Rol | **Comercial.** Todo lo que factura | **Personas IA.** Contenido sintético |
| Ad account | `act_1073680778314945` (no se puede mover, se queda acá) | Ninguno del comercial. Si hace falta, uno nuevo y chico |
| Páginas | Página "ONIA" (la ex "Onia Marketing") | Página de Lucía Antelo |
| Instagram | IG de ONIA | @lu.antelo y futuras personas IA |
| WhatsApp / WABAs | Todas las de clientes | Ninguna |
| App de Meta (Tech Provider) | **Acá va, nunca del otro lado** | Ninguna |
| Verificación de negocio | **Sí, prioridad 1** | No hace falta |
| Por qué separados | — | El enforcement de Meta escala **a nivel portfolio**. Si una cuenta de influencer IA cae por suplantación o contenido sintético, no puede arrastrar el ad account ni las WABA de clientes que pagan |

**Regla fija que va al carril comercial:** clientes nuevos **nunca** entran creando un portfolio. Entran por **partner sharing** (*Request to share an ad account*) o por Embedded Signup. Si le creás un portfolio a un cliente, gastás un slot que ya no existe.

### 1.3 Los pasos, en orden, con dueño

| # | Paso | Quién | Notas |
|---|---|---|---|
| **0** | **Verificar quién es dueño de la WABA `398983206624133`** (Business Manager → WhatsApp Accounts) y si aparece Chatwoot como partner | **Sergio** (login personal) | Bloquea el diseño del resto. Yo no puedo entrar a Meta con sus credenciales |
| **1** | Reunir carpeta: **certificado SEPREC vigente** + **certificado NIT del SIN** + **factura de servicio a nombre del negocio** | **Sergio** | 30 min. Todo en español, no hace falta traducción (el español está en la lista de idiomas soportados de Meta) |
| **2** | **Activar el requisito de 2FA** en Security Center | **Sergio** | Ya es obligatorio para portfolios de +90 días. No esperes a que te restrinjan |
| **3** | **Agregar un segundo full control** al portfolio | **Sergio** | Meta lo recomienda explícitamente. Hoy si Sergio pierde la cuenta, ONIA pierde el ad account, la Página y el camino a las WABA |
| **4** | Cambiar el email de contacto del portfolio de `oninteligenciaartificial@gmail.com` a **email en dominio propio** | **Sergio** | Meta marca los dominios de email públicos como riesgo de seguridad **en su propio Security Center**. Un revisor lo ve |
| **5** | Dejar el **sitio web impecable**: carga, HTTPS, sin links rotos, nombre de ONIA visible | **Yo** (código/deploy) + Sergio valida | Motivo de rechazo documentado: *"a website that fails to load, is not HTTPS compliant... or contains a link that leads to an error message"*. Verificarlo **el mismo día del envío** |
| **6** | **Renombrar el portfolio** a "ONIA" (o al nombre comercial del SEPREC) | **Sergio** | Settings → Business info → Edit. **AHORA, antes de verificar.** Editar detalles después de verificar dispara re-verificación de 14 días hábiles |
| **7** | **Renombrar la Página** a "ONIA" | **Sergio** | En el mismo bloque, antes de conectar nada nuevo. Hay enfriamiento entre cambios de nombre de Página (Meta no publica la cifra; ignorá el "60 días" que circula, esa regla es de perfiles personales) |
| **8** | **Enviar la verificación de negocio** | **Sergio** | Detalle completo en la sección 2 |
| **9** | Mientras se espera: **crear el system user del chatbot** y rotar tokens | **Yo** (código) + Sergio genera el token en la UI | No depende de la verificación. Ver 1.5 |
| **10** | Cuando llegue "verificado": **confirmar en WhatsApp Manager que el cap subió de 2 a 20 números** | **Sergio** + yo valido por API | Si no subió, es porque la WABA está bajo otro portfolio (ver paso 0). Revisar **antes** de vender el próximo chatbot |
| **11** | Recién ahora: **crear el segundo y último portfolio, "ONIA Personas"** | **Sergio** | Es el slot final. Que quede claro antes de gastarlo |
| **12** | Poblar "ONIA Personas" con **activos NUEVOS, nunca movidos** | **Sergio** | Crear Página e IG desde cero ahí. Mover una Página implica una ventana en que queda sin dueño y cualquiera con acceso podría reclamarla |
| **13** | **Colaboradores comerciales: partial access (Basic), nunca full control** | **Sergio** | Para accesos acotados usar **temporary access** (3 a 75 días, revocación automática). Si alguno necesita administrar una Página entera: full control **del activo**, no del portfolio |
| **14** | **Auditoría trimestral**: exportar permisos e historial desde Settings → People | **Yo** (recordatorio automatizado en n8n) | Sacar inactivos de +90 días, cuentas sin 2FA, emails de dominio público. Es literalmente el checklist con el que Meta decide si te restringe |

**Lo que yo no puedo hacer y no voy a fingir que hago:** ninguna acción en la UI de Meta que requiera el login de Sergio, entrar credenciales o aceptar términos. Eso es todo suyo. Yo hago: código, el sitio en HTTPS, los drafts de plantillas, los scripts de onboarding, el system user por API una vez que exista el token, y los monitores.

### 1.4 Qué desbloquea la verificación

| Desbloqueo | Número concreto |
|---|---|
| **Números de WhatsApp por portfolio** | **2 → 20** |
| **Plantillas por WABA** | **250 → 6.000** (requiere además display name aprobado) |
| **Límite de mensajería** | **250 → 2.000 destinatarios/día**, salto directo (de 2.000 en adelante escala solo en ~6 h) |
| **Advanced Access en Meta for Developers** | *"Verification is required to obtain Advanced Access for any permission"*. **Sin esto no existe el camino Tech Provider** (`whatsapp_business_messaging` + `whatsapp_business_management`) |
| **Daily spending limit del ad account** | Meta permite subirlo más rápido a cuentas verificadas |
| **Official Business Account** (tilde verde) | Requiere verificación + 30 días registrado + 2FA en el número + display name aprobado + ser un negocio "notable" con presencia en prensa. **No lo persigas ahora** |

**Lo que NO desbloquea:** el badge azul. *"Verifying your business... is different from Meta Verified for businesses and won't give you a verified badge."* No compres Meta Verified creyendo que resuelve esto.

### 1.5 System user: por qué es urgente aunque no lo pidas

El chatbot de Bolivian Electric debería correr con un **system user token**, no con un token de usuario de Sergio. Los tokens de usuario mueren cuando cambia la contraseña, cuando expira la sesión, o cuando Sergio pierde acceso. Cuando eso pase, **el chatbot del cliente deja de responder y nos enteramos por el cliente**.

Regla oficial de Meta, textual: *"Create one system user for each type of access you need... if a system user token is compromised, it has limited scope and can't compromise more permissions."*

**Regla ONIA:** un **regular system user por cliente**, con solo los activos de ese cliente asignados. El **admin system user** solo para asignar permisos, y su token con custodia especial. Los tokens van como **credencial de n8n** (nunca `$env`, nunca hardcodeado en el nodo - plan VPS).

---

## 2. Verificación con SEPREC — paso a paso

### 2.1 Qué documento sube

| Documento boliviano | Sirve | Categoría de Meta |
|---|---|---|
| **Certificado de Matrícula de Comercio (SEPREC)** | **Sí - es el principal** | "Business Registration or License Document" |
| **Certificado de Inscripción al Padrón Nacional de Contribuyentes (NIT, emitido por el SIN)** | **Sí - como refuerzo** | "Government Issued Business Tax Document" (emitido por autoridad, no auto-declarado) |
| **Formulario 200 / declaración jurada presentada por Sergio** | **NO** | Meta lo rechaza explícito: *"Self-filed tax documents are not accepted"* |
| **Factura de luz/agua a nombre del negocio** | Sí, **pero solo para dirección y teléfono** | *"A utility bill is not an acceptable document for Legal Business Name verification"* |
| **Extracto bancario de la cuenta empresa** | Sí | "Business Bank Statement" |

Requisito transversal: *"documents you upload... are not expired and are issued by the relevant authorities"*.

**Idioma: el español está soportado.** No hace falta traducir ni pagar sello de agencia traductora.

### 2.2 El flujo exacto

**Prerrequisito:** tener **full control** del portfolio. *"Full control is the highest permission level... allowing you to manage all settings including verification."*

1. **Security Center** en Meta Business Suite → **Start verification**.
   - Si aparece *"Ineligible for verification"*: no se hace por acá; Meta avisa por email o desde otra plataforma (ej. Commerce Manager).
2. Cargar: **nombre legal, dirección, teléfono, sitio web**.
3. Confirmar el registro que Meta encuentre. Si no aparece → *"My business isn't listed"* / *"None of these match"* → subir SEPREC + NIT.
4. Elegir método de confirmación: **email, teléfono, SMS, mensaje de WhatsApp o verificación de dominio** (meta tag o registro DNS).
   - **Recomiendo verificación de dominio.** Es la que controlamos nosotros al 100%, no depende de que llegue un SMS a Bolivia. Yo pongo el meta tag o el registro DNS el mismo día.
5. Confirmar → **Done**.
6. **Esperar. Hasta 14 días hábiles.**

### 2.3 Los 6 chequeos antes de apretar "enviar"

Cada uno de estos es un motivo de rechazo documentado. Revisar la lista completa, no por encima:

1. **Nombre legal = SEPREC, carácter por carácter.** Incluye tildes, comas, "S.R.L.", guiones, el orden de las palabras. Si el certificado dice "SERGIO X. URCULLO - ONIA", eso va, no "ONIA".
2. **El nombre del portfolio NO tiene que ser igual al legal.** No los fuerces. El portfolio es el nombre público; el legal es un campo aparte.
3. **Dirección exacta del certificado.** No la dirección donde trabajás hoy si no coincide con el papel.
4. **Teléfono al que efectivamente podés contestar** (Meta puede llamar o mandar SMS).
5. **Sitio web arriba, HTTPS, sin links rotos.** Verificalo el mismo día. Motivo de rechazo textual.
6. **Documentos no vencidos.** Si el SEPREC tiene fecha de vencimiento, revisala.

### 2.4 Después de enviar

**No toques los datos del negocio hasta que llegue la resolución.** Textual de Meta: *"If you edit your business details, then you need to complete the verification process again."* Nada de renombres, cambios de dirección ni de teléfono en esas dos semanas.

**Si rechazan:** los motivos documentados son (a) intentar reclamar un negocio que no te pertenece, (b) información falsa o sospecha de ella, (c) sitio web caído / sin HTTPS / con links rotos, (d) documentos vencidos o de fuente no oficial. Se puede reintentar corrigiendo lo que corresponda. **Un rechazo por sospecha de información falsa es el único que escala** - por eso el punto 2.3.1 no es negociable.

---

## 3. Chatbot como PRODUCTO

### 3.1 Qué tenemos ya (real, no aspiracional)

**El activo real no es el LLM. Es la capa de honestidad.** Un motor de WhatsApp comercial que **no alucina**, probado sobre 12.385 SKUs reales:

| Pieza | Qué hace | Reuso |
|---|---|---|
| **Orquestador del webhook** (`lib/chatwoot-webhook.ts`, 1.112 líneas) | Pipeline completo: transcripción → intención → ruteo → matching → disponibilidad → IA → guardrails → opt-in → nota privada → labels → asignación → respuesta | **Genérico.** Todas sus dependencias externas ya son inyectables |
| **Matcher IDF + modismos** (`product-matching.ts`) | Encuentra el producto correcto y **no confirma el calibre equivocado** (`unmetSpecTokens`) | Genérico salvo el diccionario del rubro eléctrico |
| **Respuesta grounded** (`availability-reply.ts`) | Dice "hay / no hay" por ciudad **sin inventar el número exacto**; clarifica nombrando candidatos reales | Genérico |
| **Guardrails deterministas** (`reply-guardrails.ts`) | Filtro regex sobre la respuesta **libre** de la IA: si afirma stock, precio o cantidad, la reemplaza por texto seguro | **Regla universal de bot comercial.** Va tal cual a cualquier vertical |
| **Ruteo a vendedor** (`seller-router.ts`) | Sticky por cliente conocido → pool por ciudad con peso → global → gerente | Genérico, puro, testeado |
| **Handoff humano** (`chatwoot-read.ts`) | Cuando un agente humano contesta, **el bot se calla** | Genérico. Y es **obligación de política de Meta**, no una feature de UX |
| **Opt-in + plantillas HSM** | Consentimiento explícito, 4 plantillas tipadas, 3 transportes | Es cumplimiento de política Meta: idéntico para todos |
| **Motor de seguimiento** (`follow-up-scheduler.ts`) | Cadencia 2/5/15 días con **reserva atómica (CAS) antes de enviar**: prefiere perder un seguimiento a duplicarlo | Genérico; la cadencia debería ser parámetro |
| **Aprendizaje de sinónimos** (`learned-synonyms*.ts`) | Un humano aprueba `variante → canónico` por API, **sin tocar código** | Genérico y es **diferenciador de venta** |
| **Analítica de demanda** (`be-demand*.ts`) | Persiste cada consulta **incluidos los misses**: qué piden que no hay | Genérico |
| **`/probador-bot` + `/bot-config`** | Mostrarle al cliente exactamente qué responde el bot **antes** de encenderlo | **Argumento de cierre, subestimado.** Transparencia total |
| **42 archivos de test**, cableados en `npm run validate` | typecheck + imports + build + 42 suites | `[NO CONFIRMADO: no ejecuté validate en esta lectura. Verifiqué que están cableados, no que estén verdes]` |

**De onia-core (v1.0.0 stable) se aprovechan 4 módulos:**

| Módulo | Aporta |
|---|---|
| **commerce** | `Warehouse` + `StockItem` **resuelve el problema de las 3 ciudades hardcodeadas**. Es el modelo N-sedes correcto, reemplaza `catalog_products` |
| **agents** | Modela el bot con `autonomyLevel` (suggest/semi_auto/auto) + `ApprovalRequest`. **Es exactamente la política que el bot implementa a mano hoy** (dry-run / respuesta pública OFF / pausa ante humano) |
| **knowledge** | Reemplaza el `FAQS[]` hardcodeado por contenido **editable por el cliente** |
| **automation** | `MessageTemplate` + `MessageDispatch`: plantillas en DB con traza de envíos. La cadencia 2/5/15 pasa a `AutomationRule` |

Más `Organization` (el `tenant_id` que falta), `Member`, `Area`, `Contact`, `WorkItem`, `CommunicationChannel`.

**Encajan como piezas complementarias, no como refactor.** El core aporta el modelo de datos multi-tenant que al bot le falta; el bot aporta al core el motor conversacional que el core explícitamente **no tiene** (todo lo de canal y LLM es `external_gate`). **No reescribir el bot sobre el core.**

### 3.2 Qué falta para venderlo repetible

Ordenado por lo que bloquea la venta, no por lo que es lindo de construir.

**Bloqueantes duros (sin esto no se le vende a nadie más):**

| # | Falta | Esfuerzo | Por qué bloquea |
|---|---|---|---|
| B1 | **Mergear el worktree de BE.** El avance real son 43 commits en `claude/bolivian-electric-chatbot-1e39da`, **no está en `main`** | 0,5 día | Es un único punto de falla. Un disco que se rompe borra el producto |
| B2 | **`CHATWOOT_WEBHOOK_SECRET` seteado** | 1 hora | Hoy el endpoint acepta webhooks **sin firma**. Es spoofable: cualquiera puede hacer que el bot le escriba a un cliente |
| B3 | **Rotar OpenAI key + token Chatwoot** | 1 hora | Se compartieron en texto plano. Es incumplimiento de nuestro propio checklist de seguridad |
| B4 | **Auth real.** Hoy `app/login/page.tsx` es demo y el rol es una cookie (`lib/demo-role.ts`) | 2-3 días | No se puede vender un panel donde el rol se cambia editando una cookie |
| B5 | **`/health`** que reporte tamaño del catálogo, estado de DB y flags | 0,5 día | Sin esto, "desplegado" no significa "funciona". El bug real: catálogo vacío degrada el matcher a no-op **en silencio** |
| B6 | **Quitar los SKUs mock** de "productos relacionados" (`lib/whatsapp-chatbot.ts` los arma de `localBolivianElectricDataSource`, tipo `PROD-CAB-001`) | 2 horas | Un bot que se vende como "no alucina" mostrando SKUs inventados |

**Para que sea repetible (el trabajo de producto):**

| # | Falta | Esfuerzo | Nota |
|---|---|---|---|
| P1 | **Config por cliente en tabla/JSON versionado**, no en constantes TS | 3-4 días | Hoy hay **88 ocurrencias** de `Bolivian Electric`/`be-`/`BE_` en 30 archivos. Va: marca/tono, horarios+TZ, sedes, FAQs, roster, jefes, cadencia, sinónimos semilla, guardrails del rubro, plantillas |
| P2 | **`/bot-config` editable** (hoy es solo lectura) | 2 días | Ya muestra todo. Falta el write. Es lo que convierte "consultoría" en "producto" |
| P3 | **Script de onboarding** (`onia-bot new-client`): crear inbox → DB + 8 migraciones → importar catálogo → importar directorio → sembrar config → deploy → validar en canal de prueba | 3 días | Las piezas existen sueltas en `docs/operations/*.md`. **No hay script.** Esto es la diferencia entre 8 horas y 1 hora por cliente |
| P4 | **Vertical "sin catálogo"** (clínicas, servicios): sacar el matcher del camino crítico | 3-4 días | Hoy `availabilityReply` es **central** en la prioridad de respuesta. Para un dentista hay que reemplazarlo por "agenda + FAQ + captura". **Sin esto DentalGest no puede usar el bot** |
| P5 | **Medidor de mensajes** (conteo por cliente/mes, utility vs marketing vs service) | 2 días | Sin esto no podés facturar excedentes ni saber tu margen real. Hoy los costos variables (OpenAI + Meta) **no se miden** |
| P6 | **Pack de plantillas HSM por vertical**, cargadas y aprobadas | 2 días + días de revisión de Meta | Las de BE **no están creadas ni aprobadas** `[NO CONFIRMADO desde el repo]` |

**Proyecto grande (no ahora):**

| # | Falta | Esfuerzo | Nota |
|---|---|---|---|
| G1 | **Multi-tenant real** (`tenant_id` en todas las tablas, store de catálogo por tenant, un proceso N clientes) | 3-4 semanas | **Cero avance hoy.** `catalog_products` tiene `sku` como PK global; el catálogo es un singleton en memoria del proceso. **El modelo actual es un deploy por cliente, y funciona.** Es defendible venderlo así (aislamiento = argumento comercial) mientras haya menos de 10 clientes. El costo es operativo: N contenedores, N env files, N migraciones a mano |
| G2 | **Tech Provider propio de ONIA** (app de Meta + App Review + Embedded Signup propio) | 2-3 semanas + App Review | Depende de la verificación. Ver sección 5 |
| G3 | **Facturación/planes/límites** | 2 semanas | Nada hoy |

**Desalineación a corregir:** `onia-core/adapters/bolivian-electric.json` dice `status: "installing"` y describe el stack como *"Next 16 + Postgres + Kysely + Better Auth"*. En el repo de BE hay **cero código de onia-core** (`grep "onia-core"` → 0 resultados), ni Kysely ni Better Auth. El adapter describe una **intención**, no un estado. Hay que corregir el adapter o el plan, no dejarlo mintiendo.

### 3.3 CHECKLIST DE REQUISITOS POR CLIENTE

Lo que le pedimos a una clínica o empresa antes de conectar el chatbot.

**A. Datos y accesos**
- [ ] **Número de teléfono**: el que ya usa en WhatsApp Business app (→ coexistencia, recomendado) o uno nuevo dedicado. Debe recibir SMS o llamada, con código de país (+591), no short code. Fijos y VoIP: soportados **solo con verificación por voz**
- [ ] Si va por coexistencia: **WhatsApp Business app v2.24.17 o superior** instalada
- [ ] **Cuenta de Facebook con rol de admin** en su Business Portfolio (o se crea en el Embedded Signup)
- [ ] **Datos legales**: razón social exacta, **NIT**, **matrícula SEPREC**, dirección física, teléfono, email corporativo, **sitio web activo en HTTPS**
- [ ] **Documento probatorio**: matrícula de comercio o certificado NIT (nunca una declaración auto-presentada)
- [ ] **Método de pago**: tarjeta internacional en USD, **o** acuerdo escrito de que ONIA adelanta y recobra en Bs con cláusula de ajuste cambiario
- [ ] **Política de privacidad publicada** en su web (URL). Obligatoria para la app y buena práctica con datos de pacientes

**B. Marca y perfil**
- [ ] **Display name** propuesto, relacionado al negocio real, sin promociones ni "el mejor..."
- [ ] Logo cuadrado (mín. 640×640), descripción, dirección, email, sitio web, categoría, horarios

**C. Contenido y cumplimiento**
- [ ] **Evidencia de opt-in**: dónde y cómo lo recolecta (formulario web, ficha en recepción, IVR). ONIA entrega el texto legal sugerido. **Se guarda con timestamp, canal y texto exacto mostrado** - sin eso no hay defensa en una apelación de Meta
- [ ] **Base de contactos** con número en formato internacional, nombre, **fecha y canal del opt-in**. Sin opt-in, el contacto no entra. Punto
- [ ] **Casos de uso mapeados a categoría** (esto define el costo):
  - Recordatorio / confirmación de cita → **utility** (Bs ~0,13)
  - Resultado listo / post-operatorio → **utility**
  - Código de acceso al portal → **authentication**
  - Promoción / reactivación → **marketing** (Bs ~0,84, **6,5× más caro**)
- [ ] **Ruta de escalamiento a humano** definida: quién atiende, en qué horario, por qué canal. **Un bot sin salida a humano es violación de política de Meta**, no un detalle de UX
- [ ] Confirmación por escrito de que **no** enviará contenido de categorías prohibidas

**⚠️ Bandera roja para el vertical dental/salud:** *"Productos médicos y de salud"* está en la lista de categorías prohibidas de Meta. Apunta a la **venta** de productos médicos, **no** a que una clínica coordine turnos. Pero en la práctica las plantillas con lenguaje médico o promesas de resultado **se rechazan**. Regla ONIA para DentalGest:
- Permitido (utility): *"Hola {{1}}, te recordamos tu cita en {{2}} el {{3}} a las {{4}}. Respondé 1 para confirmar."*
- Prohibido (marketing): *"Blanqueamiento dental 50% OFF, resultados garantizados"*
- **Nunca** diagnóstico, tratamiento ni datos clínicos en el cuerpo de una plantilla: queda en logs de Meta y es dato sensible

**D. Técnico (lo hacemos nosotros)**
- [ ] Onboarding vía Embedded Signup - **el cliente nunca comparte contraseña**
- [ ] Webhooks suscritos: `messages`, `message_template_status_update`, `account_update`, `phone_number_quality_update` (+ `history`, `smb_app_state_sync`, `smb_message_echoes` si es coexistencia)
- [ ] **PIN de verificación en dos pasos** generado y guardado en el gestor de secretos, **por cliente**. Sin el PIN no se puede cambiar ni borrar el número
- [ ] System user token permanente + rotación documentada
- [ ] Plantillas iniciales cargadas y aprobadas (con valores de muestra si llevan media, si no es imposible aprobarlas)
- [ ] Verificación del negocio del cliente lanzada (**ONIA puede verificarlo como partner** → el cliente salta directo a 2.000 de límite)
- [ ] Alertas en n8n: plantilla pausada, caída de quality rating, cambio de messaging limit, violación de política
- [ ] **`/health` verde antes de encender la respuesta pública**

---

## 4. Pricing del chatbot para Bolivia

### 4.1 Supuestos (todos marcados)

| Supuesto | Valor | Confianza |
|---|---|---|
| Tipo de cambio | **11,37 Bs/USD** | `[VERIFICAR AL COTIZAR]` post-flotación jun-2026. Todo contrato lleva cláusula de ajuste |
| Tarifas Meta Bolivia | Marketing **0,0740** / Utility **0,0113** / Auth **0,0113** USD | Confirmado, rate card oficial vigente 1-jul-2026 |
| Service (respuestas dentro de 24 h) | **0,0000 hoy** → **0,0113 desde 1-oct-2026** | Meta publica tarifas exactas por mercado antes del 1-sep-2026. `[PARCIALMENTE CONFIRMADO]` |
| Costo LLM propio | **USD 0,002 a 0,020 por mensaje** | Rango grande. Meta usa 2¢ como referencia de "IA de terceros baja complejidad"; el gasto medido en ONIA es mucho menor (~$0,006/día en litellm-db). **Hay que medirlo, es el ítem P5** |
| Clínica tipo | 250 pacientes activos/mes, 1.000 respuestas de bot, 600 utility | Estimación |
| Infra | Un contenedor + una DB por cliente en el VPS ya pagado | Marginal ~USD 3/mes prorrateado |

### 4.2 Costo real por cliente

| Concepto | Vol/mes | Hoy (jul-sep) | Desde 1-oct-2026 |
|---|---|---|---|
| Utility fuera de ventana (recordatorios) | 400 | USD 4,52 | USD 4,52 |
| Service (respuestas del bot en ventana 24 h) | 1.000 | **USD 0,00** | **USD 11,30** |
| Utility en ventana (confirmaciones) | 200 | **USD 0,00** | **USD 2,26** |
| Mensajes entrantes del paciente | 800 | USD 0,00 | USD 0,00 |
| **Meta - subtotal sin marketing** | | **USD 4,52** | **USD 18,08** |
| IA propia (1.000 respuestas) | | USD 2 - 20 | USD 2 - 20 |
| Infra prorrateada | | USD 3 | USD 3 |
| **TOTAL COSTO ONIA** | | **USD 10 - 28** | **USD 23 - 41** |
| **En Bs** | | **Bs 114 - 318** | **Bs 262 - 466** |

Campaña de reactivación (marketing, 300 msgs): **+USD 22,20 = +Bs 252**. Va aparte siempre.

### 4.3 Planes sugeridos

**Regla de margen (no negociable):** la bolsa de mensajes incluida **nunca** debe costar más del **25% del precio del plan**. Si un cliente se pasa, se factura el excedente.

| | **Esencial** | **Comercial** | **Full** |
|---|---|---|---|
| **Qué resuelve** | Contesta 24/7 lo repetitivo y deriva bien | **Convierte**: captura leads, rutea al vendedor y persigue | **Automatiza**: catálogo/agenda vivos, campañas, panel y aprendizaje |
| **Incluye** | FAQ aprobadas, horarios, derivación a humano, notas privadas, etiquetas | + captura progresiva de datos, scoring hot/warm/cold, ruteo a vendedor con sticky, recordatorios utility, seguimiento 2/5/15, `/probador-bot` | + catálogo o agenda conectada, respuesta grounded ("hay / no hay"), plantillas proactivas, SLA con escalada a jefe, `/bot-config` editable, aprendizaje de sinónimos, analítica de demanda |
| **Setup (única vez)** | **Bs 1.500** | **Bs 2.900** | **Bs 5.900** |
| **Mensual** | **Bs 490** | **Bs 890** | **Bs 1.890** |
| **Bolsa incluida** | 800 msgs salientes | 1.500 | 3.000 |
| **Excedente utility** | Bs 0,30/msg | Bs 0,30 | Bs 0,25 |
| **Excedente marketing** | Bs 1,50/msg | Bs 1,50 | Bs 1,30 |
| **Costo bolsa a ONIA (post-oct)** | Bs 102 (21%) | Bs 192 (22%) | Bs 384 (20%) |
| **Margen bruto estimado** | **60 - 78%** | **48 - 70%** | **45 - 68%** |
| **Anual** | 10× el mensual (2 meses gratis) | 10× | 10× |

**Notas de pricing:**

1. **El precio se sostiene por el resultado, no por el costo.** Bs 890/mes contra "una cita perdida por semana" no se discute. Nunca cotices "por mensaje" al cliente: te compara con Twilio.
2. **Campañas de marketing masivo van SIEMPRE aparte**, con presupuesto explícito del cliente, igual que la pauta. En Bolivia el marketing cuesta **6,5×** lo que cuesta utility (0,074 vs 0,0113) - es lo único que rompe la unit economics. Esto respeta la regla del CLAUDE.md de costos de terceros excluidos.
3. **Tensión declarada con la regla de terceros:** incluyo una bolsa de mensajes en el plan (contra la letra de "mensajería WhatsApp pagada excluida") porque un cliente boliviano rechaza una factura variable. Lo resuelvo así: **bolsa incluida = producto; excedente y campañas = terceros facturados aparte.** Si preferís pureza, quitá la bolsa y bajá cada plan Bs 150.
4. **Dos modos de pago a Meta:**
   - **Modo A (default): ONIA pone la tarjeta.** Más fácil de vender, ONIA asume el FX. Los precios de arriba asumen esto.
   - **Modo B: el cliente pone su tarjeta USD** (Tech Provider: Meta le factura directo). ONIA no adelanta plata ni asume FX. **Descuento de Bs 150/mes** y se quita la bolsa. Ideal para clientes grandes. Requiere tarjeta internacional - fricción real en Bolivia post-flotación.
5. **🔴 El 1-oct-2026 el costo variable sube ~4×.** Todo contrato firmado antes de esa fecha **debe** traer cláusula de ajuste de costos de terceros, o cotizarse ya con el precio de octubre. Los precios de arriba **ya asumen el escenario de octubre**, así que estás cubierto.
6. **Click-to-WhatsApp = 72 h de mensajería gratis.** Cada lead que entra por un anuncio abre una ventana Free Entry Point de 72 h con **todo gratis**. Con el motor Meta Ads ya deployado (`act_1073680778314945`), esto hace que "anuncios + chatbot" rinda más que cada uno por separado. **Es el paquete de mayor margen que podés vender** y nadie más en Bolivia lo está armando así.
7. **NO habilitar Meta Business Agent.** La IA de Meta cuesta 4-5 ¢/mensaje (USD 2 / 1M tokens, ~20-25k tokens por mensaje) contra ~2 ¢ o menos de la nuestra, exige línea de crédito con Meta, y le regala a Meta el control de la conversación. En el propio ejemplo de Meta: 1.000 mensajes cuestan ~USD 27 con IA de terceros vs ~USD 40-50 con MBA.

---

## 5. Orden y esfuerzo

### 🟢 ESTA SEMANA (no depende de nadie)

| Tarea | Quién | Esfuerzo |
|---|---|---|
| **Verificar dueño de la WABA `398983206624133`** y si Chatwoot figura como partner | Sergio | 15 min. **Hacelo primero, condiciona todo** |
| Reunir SEPREC + NIT + factura de servicio en una carpeta | Sergio | 30 min |
| Activar requisito de 2FA + segundo full control + email de dominio propio | Sergio | 1 hora |
| Renombrar portfolio → "ONIA" y Página → "ONIA" | Sergio | 20 min |
| Sitio web arriba, HTTPS, sin links rotos | Yo | 0,5 día |
| **B1: mergear el worktree de BE** (43 commits) a su main | Yo | 0,5 día |
| **B2: `CHATWOOT_WEBHOOK_SECRET`** | Yo | 1 hora |
| **B3: rotar OpenAI key + token Chatwoot** | Yo + Sergio genera | 1 hora |
| **B5: `/health`** | Yo | 0,5 día |
| **B6: quitar SKUs mock** | Yo | 2 horas |
| **Enviar la verificación de negocio** | Sergio | 1 hora + 14 días hábiles de espera |
| Corregir `onia-core/adapters/bolivian-electric.json` (dice "installing" con stack que no existe) | Yo | 30 min |

**Total semana 1:** ~2 días míos + ~3 horas de Sergio. Al final de la semana la verificación está enviada y el bot de BE deja de tener agujeros de seguridad.

### 🟡 MIENTRAS SE ESPERA LA VERIFICACIÓN (2 semanas)

Todo esto **no depende** de Meta:

| Tarea | Esfuerzo |
|---|---|
| **B4: auth real** (matar la cookie de rol) | 2-3 días |
| **P1: config por cliente** (sacar las 88 ocurrencias de `BE_`) | 3-4 días |
| **P3: script de onboarding** `onia-bot new-client` | 3 días |
| **P5: medidor de mensajes** (para facturar y saber el margen) | 2 días |
| **System user por cliente** + rotación documentada | 1 día |
| Redactar plantillas HSM del vertical dental (drafts listos para cargar) | 0,5 día |
| Catálogo de BE en producción (:3001) - corregir el `DATABASE_URL` con password sin URL-encodear | 2 horas |

### 🔴 DEPENDE DE LA VERIFICACIÓN

| Tarea | Bloqueo |
|---|---|
| Subir cap de WhatsApp de 2 a 20 números | Verificación |
| Cargar más de 250 plantillas | Verificación + display name aprobado |
| **App Review para Advanced Access** (`whatsapp_business_messaging` + `whatsapp_business_management`) | Verificación **y luego** App Review aparte: 2 videos de demostración, política de privacidad pública, webhooks funcionando |
| **Ser Tech Provider propio** (Embedded Signup con marca ONIA, dejar de depender de Chatwoot como BSP) | Todo lo anterior. **2-3 semanas de trabajo + tiempo de review de Meta**. Límite inicial: 10 clientes nuevos por ventana de 7 días → 200 tras completar Business Verification + App Review + Access Verification |
| Verificar clientes como partner (para que salten a 2.000 de límite) | Verificación de ONIA |

### ⚫ PROYECTO DE SEMANAS (no ahora)

| Tarea | Esfuerzo | Cuándo |
|---|---|---|
| **P4: vertical sin catálogo** (clínicas) | 3-4 días | **Antes del primer cliente dental.** Hoy `availabilityReply` es central en la prioridad de respuesta y un dentista no tiene SKUs |
| **G1: multi-tenant real** con `tenant_id` y core `commerce`/`agents` | 3-4 semanas | **Recién con 8-10 clientes.** Hasta ahí, "un deploy por cliente" funciona y el aislamiento se vende como feature |
| **G3: facturación/planes/límites** | 2 semanas | Cuando el medidor (P5) tenga 2-3 meses de datos |
| Llamadas de voz (Pipecat + WhatsApp Calling API) | **0% construido**, solo 2 docs de arquitectura | Track aparte, no confundir con el chatbot |

### Camino más corto a un segundo cliente, sin refactor

Clonar el repo, cambiar ~10 archivos de config, contenedor nuevo + DB nueva. **Sirve solo si el rubro tiene catálogo con SKUs y sedes.** Para un rubro sin catálogo (clínicas, servicios) hay que hacer P4 primero. Con P3 (script de onboarding) hecho, un cliente pasa de ~8 horas a ~1 hora de trabajo.

---

## 6. Todo lo que NO está confirmado

Lo listo junto para que no se pierda entre el resto:

1. **Dueño de la WABA `398983206624133`.** Si es el portfolio de Chatwoot, todo el cálculo del cap de 2 números cambia. **Verificar antes de cualquier otra cosa.**
2. **Texto exacto del certificado SEPREC** (razón social y si hay nombre comercial registrado). Define el nombre legal y, potencialmente, el nombre del portfolio.
3. **Si Sergio ya usó su segundo slot de portfolio.** El plan asume que queda 1 libre.
4. **Si `npm run validate` de BE pasa verde.** Verifiqué que los 42 tests están cableados, no que estén pasando.
5. **Si en el server de BE los flags de envío público (`CHATWOOT_INTEGRATION_ENABLED` + `CHATWOOT_DRY_RUN=false` + `CHATWOOT_SEND_PUBLIC_REPLIES`) están encendidos.** Desde el repo no se puede saber.
6. **Plantillas HSM de BE: no creadas ni aprobadas en Meta** (no verificable desde el repo).
7. **Tarifas exactas de mensajes de service post 1-oct-2026.** Meta se comprometió a publicarlas antes del 1-sep-2026. Uso la tarifa utility como proxy, que es lo que Meta indicó.
8. **Costo real del LLM por mensaje en nuestro stack.** Rango de 10× entre mis dos estimaciones. Es el ítem P5 y hasta medirlo el margen del plan Full es una estimación, no un número.
9. **Tipo de cambio Bs/USD al momento de cotizar.** Todos los costos de Meta son en USD.

**Estado real de Bolivian Electric que hay que decir en voz alta:** el bot funciona y es bueno, pero (a) el avance no está en `main`, (b) el webhook acepta requests sin firma, (c) el panel no tiene autenticación, (d) hay SKUs inventados en "productos relacionados", (e) solo 1 vendedor (Saúl) está activo y los 4 jefes de sucursal no tienen contacto cargado, así que **la escalada por SLA no tiene destino**, (f) el panel/CRM es mayormente mock (`lib/mock-data.ts`, 1.737 líneas) y solo el carril del bot tiene datos reales. Nada de eso impide vender el chatbot; todo eso impide vender el panel.

---

# Anexo A — Meta config

# Configuración de Meta Business para ONIA — 2026

> Investigado el 2026-07-25 contra fuentes oficiales (Meta Business Help Center + developers.facebook.com). Marco explícitamente qué es **texto oficial citado** y qué es **recomendación mía**, para que no se mezclen.

---

## 1) Business Portfolio (antes Business Manager)

### Cuántos permite una persona

Texto literal de Meta (artículo "Create a business portfolio"):

> "You can personally create up to 2 business portfolios. There is no limit on the number of portfolios you can belong to."

**Dos consecuencias operativas para ONIA:**

- Sergio ya usó 1 slot con "OnIA Agency". Le queda **exactamente 1**. Si lo gasta en el portfolio de personas IA, no le queda ninguno para clientes ni para experimentos.
- El límite es de **creación**, no de **pertenencia**. Un segundo humano (socio, colaborador, o una cuenta legítima de otra persona real) puede crear un portfolio y dar a Sergio control total. Eso es la vía documentada para un tercer portfolio, si algún día hace falta. No hace falta ni conviene crear perfiles falsos.

Fuente: https://www.facebook.com/business/help/1710077379203657

### Cómo se crea uno nuevo

1. Entrar a `business.facebook.com` con el perfil de Facebook.
2. Menú desplegable debajo de **Home** (arriba a la izquierda) → **Create a business portfolio**.
3. Nombre del portfolio. Meta dice textual: *"This should match the public name of your business or organization because it will be visible across Meta. The name of your business portfolio cannot contain special characters."*
4. Nombre, apellido y **email de negocio** (Meta lo usa para contactarte; no es visible al cliente).
5. Confirmar el email.

Aviso oficial relevante: *"when you create a new business portfolio or ad account, you may not have access to all advertising features"* — los portfolios nuevos arrancan capados hasta cumplir requisitos.

Fuente: https://www.facebook.com/business/help/1710077379203657

### Cómo se MUEVEN activos entre portfolios — y qué se rompe

Regla base, literal: **"Business assets can only belong to 1 business portfolio."**

| Activo | ¿Se puede mover? | Cómo / qué se rompe |
|---|---|---|
| **Página de Facebook** | Sí, pero **no como transferencia** | Literal: *"You can't transfer ownership of a Facebook Page to another business portfolio but, if you remove the Page from your business portfolio, another organization can add it to theirs."* **Requisito previo:** *"Make sure the Facebook Page has been disconnected from other business assets such as an Instagram account or WhatsApp account."* Hay una ventana en que la Página queda sin dueño y **cualquiera con acceso podría reclamarla**. |
| **Cuenta de Instagram** | Sí, mismo patrón | *"Each Instagram account can only be added to one business portfolio... you can add the Instagram account after it has been removed from the other business portfolio."* Se re-agrega con usuario + contraseña de IG (y código 2FA). |
| **Ad account** | **NO. Punto.** | Literal del troubleshooting: *"Ad accounts that have already been linked to a business portfolio can't be moved to another one. If your ad account is owned by another business portfolio, then you can request access to the ad account or create a new ad account in your business portfolio."* Y además: *"Accounts with payment methods managed by a third party can't be moved by Meta. You'll need to create a new ad account."* |
| **Catálogo** | Sí, vía solicitud de transferencia | https://www.facebook.com/business/help/832599310690431 |
| **App (Meta for Developers)** | Sí, transferencia de propiedad | https://www.facebook.com/business/help/236817717885919 |

**Esto es lo más importante del informe para ONIA:** el ad account `act_1073680778314945` **no se puede sacar** de "OnIA Agency". Cualquier plan que asumiera "muevo el ad account al portfolio comercial nuevo" está muerto. El portfolio comercial **tiene que ser el que ya existe**.

Lo que se pierde al remover y re-agregar una Página: se rompen las conexiones a IG/WhatsApp (hay que rehacerlas), y las asignaciones de personas del portfolio viejo desaparecen. Meta aclara que *"People who had access to the Page before you added it to a business portfolio can still access and manage the Page"* — es decir, los roles nativos de la Página sobreviven, los del portfolio no.

Fuentes:
- https://www.facebook.com/business/help/531142997352616 (remover Página)
- https://www.facebook.com/business/help/720478807965744 (agregar Página)
- https://www.facebook.com/business/help/620548115562686 (agregar Instagram)
- https://www.facebook.com/business/help/915885887059947 (agregar ad account)
- https://www.facebook.com/business/help/742119383392414 (troubleshooting — de acá salen las citas de "can't be moved")

### ¿Se puede renombrar un portfolio y una Página? ¿Cuántas veces?

- **Portfolio:** sí, en *Settings → Business info → Edit*. **Meta NO publica un número máximo de cambios.** Sí publica dos frenos duros: (a) si el negocio ya está verificado, *"if you edit your business's legal name, country, phone number, website address or tax ID (EIN)... you will need to complete the business verification process again"*; (b) *"You may not be able to click Edit if the business portfolio is used for a WhatsApp Business account."*
- **Página:** sí, con **Facebook access** (no con task access). Meta **tampoco publica un número**; lista como causa de bloqueo: *"You or someone else with Facebook access recently changed your Page's name"* y *"There may be limits on your Page."* Es decir, hay enfriamiento pero sin cifra oficial. No te fíes de los "60 días" que circulan: ese número es la regla de **perfiles personales**, no de Páginas.

Fuentes:
- https://www.facebook.com/business/help/322526208728282
- https://www.facebook.com/help/271607792873806

---

## 2) Verificación de negocio (Business Verification)

### Qué es y qué NO es

Literal: *"Verifying your business in Meta Business Suite is different from Meta Verified for businesses and won't give you a verified badge."* No compres el badge azul creyendo que resuelve esto. Son productos distintos.

Meta pide dos cosas: (1) *"Ensure your business is a legal entity. Your business needs to be registered with local authorities"*, y (2) *"Demonstrate you're an authorized representation of your business."*

Fuente: https://www.facebook.com/business/help/1095661473946872

### Documentos aceptados — y el caso Bolivia

Tipos de documento soportados (lista literal del artículo oficial):

1. **Certificate/Articles of Incorporation**
2. **Business Registration or License Document**
3. **Government Issued Business Tax Document** — *"This could include a Tax Certificate. **Self-filed tax documents are not accepted.**"*
4. **Business Bank Statement**
5. **Utility Bill** — *"A utility bill is accepted only for Business Address and Phone number. The Legal Business Name must be on the utility bill. A utility bill is not an acceptable document for Legal Business Name verification."*

Y: *"Make sure the documents you upload for business verification are not expired and are issued by the relevant authorities."*

**Aplicado a Bolivia:**

| Documento boliviano | ¿Sirve? | Categoría Meta |
|---|---|---|
| **Certificado de Matrícula de Comercio (SEPREC)** | **Sí — es el documento principal** | "Business Registration or License Document" |
| **Certificado de Inscripción al Padrón Nacional de Contribuyentes (NIT, emitido por el SIN)** | **Sí, como refuerzo** | "Government Issued Business Tax Document" (es emitido por autoridad, no auto-declarado) |
| Formulario 200 / declaración jurada presentada por Sergio | **NO** | Es *self-filed* — Meta lo rechaza explícitamente |
| Factura de luz/agua a nombre del negocio | **Sí, pero solo para dirección/teléfono** | Nunca sirve para validar el nombre legal |
| Extracto bancario de la cuenta empresa | Sí | "Business Bank Statement" |

**Idioma: el español está en la lista de idiomas soportados.** No hace falta traducir ni pagar sello de agencia traductora. (La regla de traducción con sello oficial aplica solo si el documento no está en uno de los 21 idiomas soportados.)

Fuente: https://www.facebook.com/business/help/159334372093366

> ⚠️ **Nota de honestidad:** el índice de búsqueda de Meta todavía devuelve una frase de una versión anterior del artículo de troubleshooting — *"For markets without clearly defined document requirements, use government documents that can validate the business legal name and address"* — pero **esa frase ya no está en la página viva** (la reescribieron). La cito como contexto histórico, no como política vigente verificable hoy. Lo vigente y verificado es la lista de 5 tipos de arriba, que no es específica por país y por lo tanto aplica tal cual a Bolivia.

### El flujo exacto en Security Center

Prerrequisito: **tener control total (full control) del portfolio.** Literal: *"Full control is the highest permission level for a business portfolio, allowing you to manage all settings including verification."*

1. Ir a **Security Center** en Meta Business Suite.
2. Click **Start verification**. (Si dice *"Ineligible for verification"*, no se hace por acá — Meta te avisará por email o desde otra plataforma, ej. Commerce Manager.)
3. Cargar datos: **nombre legal, dirección, teléfono, sitio web**. Literal: *"Check that the details you enter exactly match the details of your legal business entity. Also make sure your business website loads and is HTTPS compliant."*
4. Confirmar el registro que Meta encuentre. Si no aparece → *"My business isn't listed"* / *"None of these match"* → te pide subir documentos.
5. Elegir método de confirmación: **email, teléfono, SMS, mensaje de WhatsApp o verificación de dominio** (meta tag o registro DNS).
6. Confirmar y **Done**.

**Tiempo:** literal — *"A decision on your verification submission may take up to 14 business days."*

**Trampa a evitar:** *"If you edit your business details, then you need to complete the verification process again."* No arranques el trámite con datos provisorios.

Si pagás por **facturación mensual (monthly invoicing)**, Meta dice que **no necesitás subir documentos**: se llena con la información de la línea de crédito. No es el caso de ONIA hoy.

Fuente: https://www.facebook.com/business/help/2058515294227817

### Qué DESBLOQUEA (lista literal de los desplegables del artículo oficial)

| Producto / feature | Texto de Meta |
|---|---|
| **Daily spending limit** | *"Meta may allow some advertisers to increase their daily spending limit more quickly by completing verification."* |
| **Eligible developer features** | *"Verification is required to obtain Advanced Access for any permission on Meta for Developers."* |
| **WhatsApp Business Platform** | *"Businesses using the WhatsApp Business Platform may need to complete verification to access certain features."* |
| **Meta Business Partners (MBP)** | Badge de partner requiere verificación |
| **News Page index** | Requiere verificación |
| **Page transparency** | Para audiencia grande en EE.UU. o ads de temas sociales/electorales |
| **Agencias en China / servicios financieros** | Casos especiales |

**El número concreto que más le importa a ONIA (WhatsApp API):** de la documentación de developers, literal —

> *"New business portfolios are initially capped at two registered business phone numbers."* … *"If your business becomes verified, or if you have reached a messaging limit of 2,000, Meta will automatically increase your cap to 20."*

O sea: **sin verificar, ONIA solo puede registrar 2 números de WhatsApp Business API en total.** Con Bolivian Electric ya usando uno, queda **uno solo** para todos los demás clientes. Verificado saltás a 20. Esto es un techo de negocio directo, no un detalle administrativo.

Además, el estatus de **Official Business Account (tilde verde en WhatsApp)** requiere verificación de negocio + 30 días registrado + 2FA en el número + display name aprobado + ser un "notable business" con presencia en prensa.

Fuentes:
- https://www.facebook.com/business/help/1095661473946872
- https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers
- https://developers.facebook.com/documentation/business-messaging/whatsapp/official-business-accounts/
- https://developers.facebook.com/docs/development/release/business-verification/ — literal: *"Apps that request advanced access for permissions and apps that allow other Businesses to access their own data must be connected to a Business that has completed Business Verification."*

### ⭐ ¿Qué pasa si el nombre legal no coincide con "OnIA Agency"?

Esta es la pregunta clave y la respuesta es mejor de lo que temías, **pero hay que hacerlo con precisión**:

**Son dos campos distintos y Meta nunca dice que deban ser iguales:**

- El **nombre del portfolio** ("OnIA Agency") es el nombre público/display. Meta solo pide: *"This should match the public name of your business or organization"* — el nombre **público**, no el legal.
- El **legal business name** es un campo aparte dentro del formulario de verificación, y ese sí: *"Check that the details you enter exactly match the details of your legal business entity."* Ese es el que se compara contra el SEPREC.

**Traducción práctica:** en el formulario poné el nombre **exacto, carácter por carácter, del certificado SEPREC** (si Sergio está registrado como empresa unipersonal, probablemente sea su nombre propio o "Sergio Urcullo — ONIA" o similar, según cómo quedó la matrícula). El portfolio puede seguir llamándose "ONIA". No los fuerces a ser iguales, y **no inventes una razón social que no exista en el certificado**.

**El riesgo real** está en el motivo de rechazo documentado: *"Attempting to claim or verify a business portfolio you don't own or have authorization to represent"* y *"Submitting, or being suspected of submitting, false or misleading information."* Si escribís un nombre legal que no aparece en ningún documento, eso es exactamente lo que dispara el rechazo — y un rechazo por sospecha de información falsa habilita a Meta a *"take additional action on the account"*.

**Recomendación mía (no es política de Meta):** antes de enviar, renombrá el portfolio de **"OnIA Agency"** a **"ONIA"** — con mayúsculas correctas y sin el "Agency" que ya no describe lo que vende (software + agentes, no agencia). Dos motivos: (a) el nombre del portfolio es visible en todo Meta y "OnIA" con la n minúscula lee como error tipográfico; (b) cuanto más cerca esté el nombre público del nombre de la marca en el sitio web y en el SEPREC, menos fricción tiene el revisor humano. Hacé el renombre **antes** de iniciar la verificación, no después (después dispara re-verificación).

Otro motivo documentado de rechazo que ONIA debe cerrar **antes** de enviar: *"Having a website that fails to load, is not HTTPS compliant... or contains a link that leads to an error message."* El sitio de ONIA tiene que estar arriba, en HTTPS, y sin links rotos el día del envío.

Fuente: https://www.facebook.com/business/help/2342133782492969

---

## 3) Roles y seguridad

### Los roles que existen HOY (Meta eliminó "admin/employee" como nombres)

Solo hay **2 niveles**, y aplican tanto al portfolio como a cada activo por separado:

**A nivel portfolio:**

| Nivel | Qué puede |
|---|---|
| **Full control** (antes "business admin") | Todo: settings, personas, herramientas, activos. Reclamar o remover activos y personas, gestionar acceso de partners, ver todos los activos, **borrar el portfolio**, y asignarse a sí mismo opciones avanzadas. |
| **Partial access → Basic** (antes "employee") | *"can work only on the business assets they're assigned"*. Es el **default** al agregar a alguien. |
| **Partial access → Apps and integrations** (antes "developer") | *"can set up the Conversions API, monitor events, edit applications and create access tokens"*. |
| **Finance access** (opción avanzada, se suma a cualquiera de los anteriores) | Ver o gestionar transacciones, facturas, gasto y métodos de pago. |
| **Temporary access** | *"provides only basic access for a minimum of 3 days and a maximum of 75 days"*, con revocación automática. |

**A nivel activo (Página, IG, WhatsApp, catálogo):** también full control / partial. Dato útil: *"People can have full control of a business asset without having full control of the business portfolio."* — es exactamente lo que necesitás para dar a un colaborador el control de UNA página sin darle las llaves de todo.

Nota que ya se ve en tu captura: la persona "OnIA Agency" con acceso parcial (contenido, mensajes, anuncios, estadísticas, creadores) es partial access a nivel activo. Está bien configurado.

Fuente: https://www.facebook.com/business/help/442345745885606

### Buenas prácticas (todas son texto oficial de Meta)

- **2FA es obligatorio, no opcional.** Literal del Security Center: *"two-factor authentication is a requirement for business portfolios that are 90 days or older"*. Y en el artículo de restricciones publicitarias, uno de los motivos de restricción es: *"An advertiser doesn't meet our two-factor authentication requirements for account security."*
- **Dos personas con full control** ("second admin approval"): *"It's recommended (but not required) that 2 active people have full control of a business portfolio... this provides additional security by adding a second layer of approval to sensitive actions."* → **Sergio no debe ser el único admin.** Si pierde la cuenta, ONIA pierde todo.
- **Límite de full control:** *"Limit full control to only those who need it, ideally 10 or fewer people."*
- **Remover usuarios inactivos:** *"Remove people who haven't logged into the portfolio within the past 90 days."*
- **Remover usuarios con dominios de email públicos:** *"Bad actors often use public email domains... Remove users whose email addresses aren't related to your business."* → ⚠️ **Esto aplica a ONIA hoy**: el portfolio está a nombre de `oninteligenciaartificial@gmail.com`. Meta lo marca como riesgo de seguridad en su propio Security Center. Hay que migrar a un email en dominio propio.
- **Passkeys:** Meta ahora recomienda passkeys por encima de contraseñas + códigos.
- **Auditoría:** exportable desde *People* en Settings (incluye última actividad y si tienen 2FA). El *business history* se descarga desde *People* o *Business info*.
- **Peer approval:** segunda revisión humana antes de publicar anuncios.

Fuentes:
- https://www.facebook.com/business/help/216940652189296 (Security Center)
- https://www.facebook.com/business/help/608572510632070 (best practices)
- https://www.facebook.com/business/help/280940009201586 (activar el requisito de 2FA)
- https://www.facebook.com/business/help/975570072950669 (restricciones)

### ¿Qué es un System User y para qué sirve?

Definición literal: *"System users represent servers or software that make API calls to assets managed by a business portfolio in Meta Business Suite."*

Dos tipos:

- **Admin system user** — *"can create system users, add accounts, assign permissions and more."*
- **Regular system user** — *"can only access the assets they have permission for."*

Las tres reglas oficiales de uso:

> *"Create one system user for each type of access you need. Give system users access to assets and use them for most API calls."*
> *"Use the admin system user to maintain the right roles programmatically. That way, if a system user token is compromised, it has limited scope and can't compromise more permissions."*
> *"Limit using admin system user for administrative actions such as assigning permission. Because it has the most permissions, carefully safeguard the admin system user token."*

**Por qué esto le importa directamente a ONIA:** el chatbot de Bolivian Electric (Chatwoot + n8n + WhatsApp Cloud API) debería estar corriendo con un **system user token**, no con un token de usuario de Sergio. Los tokens de usuario mueren cuando cambia la contraseña, cuando expira la sesión, o cuando Sergio pierde acceso — y ahí el chatbot del cliente deja de responder. Los system user tokens son *long-lived* y *"can represent automated services within your business that don't require any user input"*. Un system user regular por cliente = si se filtra el token de un cliente, no compromete a los demás.

Cómo se crea: *Business settings → System Users → +Add* → nombre y rol → *Assign assets* → *Generate New Token* (elegís la app y los permisos). Se puede hacer también por API.

Fuentes:
- https://www.facebook.com/business/help/327596604689624
- https://developers.facebook.com/docs/business-management-apis/system-users/
- https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens/

---

## 4) Páginas de Facebook

### Reglas oficiales para el nombre de una Página

Los nombres **NO pueden incluir**:

- Términos ofensivos o que vulneren derechos de terceros.
- La palabra **"oficial"** si no es la página oficial de la marca.
- **Mayúsculas mal usadas** (ej. "lA mejor CaFEteRía"). Solo las siglas pueden ir todo en mayúsculas.
- **Símbolos** (®, ™) o puntuación innecesaria.
- **Descripciones o eslóganes** (ej. "El mejor café: servimos el mejor café de la ciudad"). Eso va en la sección "Información".
- Cualquier variación de **"Facebook"**, **"Meta"** o nombres de productos de Meta.

Los nombres **NO pueden ser solo**:

- Una **palabra genérica** ("pizza").
- Un **lugar geográfico genérico** ("Nueva York") — salvo que represente al organismo de esa ubicación.

Sí se permite: *"un nombre que sea distinto del nombre de la organización siempre que refleje con precisión sobre qué trata la página"*. Ejemplo de Meta: "Turismo en Irlanda" puede tener una página llamada "Descubre Irlanda".

**Lectura para ONIA:** "Onia Marketing" es un nombre **válido** (no viola nada). Pero "ONIA" solo, o "ONIA Inteligencia Artificial", también lo serían — y describen mejor lo que vende. Ojo con el uso de mayúsculas: "ONIA" como sigla es aceptable; "OnIA" con la n minúscula en el medio es justamente el patrón de capitalización irregular que Meta desaconseja.

Fuentes:
- https://www.facebook.com/help/519912414718764 (normas de nombres)
- https://www.facebook.com/help/271607792873806 (cómo cambiarlo)

### ¿Una sola Página o varias? (marca vs producto)

**Meta no obliga a ninguna de las dos.** Lo que sí está documentado y condiciona la decisión:

1. Cada Página vive en **1 solo portfolio** — y no se transfiere, solo se remueve y re-reclama.
2. Cada anunciante **necesita una Página** para poder anunciar (*"Every advertiser will need to have a Facebook Page created before they can advertise"*).
3. La Página es una **superficie de enforcement independiente**: *"Page: ... If restricted, your Page isn't allowed to advertise."*
4. Existen **límites de anuncios por Página** (https://www.facebook.com/business/help/1144239125442566) — solo relevante a alto volumen, no hoy.
5. Cada Página necesita su propio contenido, su propia audiencia y su propio pixel/eventos para servir de algo.

**Recomendación mía para ONIA (criterio, no política de Meta):**

- **Una sola Página madre "ONIA"** por ahora. Con 0 clientes pagando en Meta Ads y sin equipo de contenido dedicado, tres páginas medio muertas valen menos que una viva. Los productos (DentalGest, web-factory) se diferencian con **campañas y públicos**, no con Páginas.
- **Página separada solo cuando DentalGest tenga presupuesto propio, contenido propio y un embudo propio.** Ese es el disparador real, no el organigrama.
- **Lucía (@lu.antelo) sí va en Página + IG propios, en el OTRO portfolio.** No porque lo exija Meta, sino porque el enforcement es a nivel portfolio y Página: si una cuenta de influencer IA cae por políticas de suplantación o contenido sintético, no querés que arrastre el ad account de DentalGest.

---

## Lo que ONIA debe hacer, en orden

Estado de partida: 1 portfolio ("OnIA Agency", `1451773736711697`), 1 Página ("Onia Marketing", `1140384625819526`), 1 ad account (`act_1073680778314945`), SEPREC ya en mano, verificación pendiente.

**El hecho que reordena todo el plan:** el ad account **no se puede mover**. Por lo tanto el portfolio existente **es** el portfolio comercial. El portfolio nuevo es el de personas IA, no al revés.

---

**Paso 0 — Antes de tocar nada (30 min).**
Reunir en una carpeta: certificado **SEPREC** vigente (no vencido), **certificado NIT del SIN** (el emitido por la autoridad, NO un formulario auto-declarado), y una **factura de servicios a nombre del negocio** por si Meta pide validar dirección/teléfono. Todo en español — no hace falta traducción.

**Paso 1 — Higiene de seguridad en "OnIA Agency" (hoy).**
Antes de que un revisor de Meta mire la cuenta:
- Activar el **requisito de 2FA** en Security Center (ya es obligatorio para portfolios de +90 días; no esperes a que te restrinjan).
- Agregar un **segundo full control**. Sergio no puede ser el único.
- Cambiar el email de contacto del portfolio de `@gmail.com` a un **email en dominio propio** (`sergio@onia.bo` o el dominio que uses). Meta marca los dominios públicos como riesgo en su propio Security Center.

**Paso 2 — Dejar el sitio web impecable.**
Un sitio que cargue, en **HTTPS**, sin links rotos, con el nombre de ONIA visible. Sitio caído o link roto = rechazo documentado. Verificalo el mismo día del envío.

**Paso 3 — Renombrar el portfolio a "ONIA".**
En *Settings → Business info → Edit*. **Ahora, antes de verificar** — porque editar detalles después de verificar dispara re-verificación de 14 días hábiles. Sin caracteres especiales.

**Paso 4 — (Opcional, misma ventana) renombrar la Página.**
Si se decide "ONIA" en vez de "Onia Marketing", hacerlo ahora, en el mismo bloque, antes de conectar nada nuevo. Hay enfriamiento entre cambios de nombre de Página (sin cifra publicada).

**Paso 5 — Enviar la verificación de negocio del portfolio comercial.**
Security Center → **Start verification** → nombre legal **exacto del SEPREC**, dirección, teléfono, sitio web → si no aparece el registro, *"My business isn't listed"* y subir SEPREC + NIT → confirmar por email/SMS/WhatsApp o verificación de dominio → Done.
**Después de enviar, no toques los datos del negocio hasta que llegue la resolución.** Contar hasta **14 días hábiles**.

**Paso 6 — Mientras se espera: crear el system user del chatbot.**
No depende de la verificación. *Business settings → System Users → +Add* → un **regular system user por cliente** (empezando por Bolivian Electric) → asignar solo los activos de ese cliente → generar token → reemplazar en n8n/Chatwoot el token de usuario de Sergio por el system user token. Guardar el token como **credencial de n8n** (nunca `$env`, nunca hardcodeado en el nodo — plan VPS).

**Paso 7 — Cuando llegue "verificado": subir el techo de WhatsApp.**
Confirmar en WhatsApp Manager que el cap de números pasó de 2 a **20**. Ese es el número que habilita vender chatbots a más de un cliente. Si no subió solo, es porque el WABA está bajo otro portfolio — revisar antes de vender el siguiente.

**Paso 8 — Recién ahora: crear el SEGUNDO y ÚLTIMO portfolio, "ONIA Personas".**
Este es el slot final de Sergio. Que quede claro antes de gastarlo. Ahí van: Página de Lucía, IG @lu.antelo, y cualquier futura persona IA. **Nunca** el ad account comercial (no se puede) ni activos de clientes.

**Paso 9 — Poblar "ONIA Personas" con activos NUEVOS, no movidos.**
Crear Página e IG desde cero dentro de ese portfolio. No muevas nada del comercial: la ventana en que una Página queda sin dueño es el momento en que se pierde. Si algún activo de Lucía ya existiera en el portfolio comercial: desconectar primero IG/WhatsApp, remover, y re-agregar del otro lado — en ese orden.

**Paso 10 — Colaboradores comerciales: partial access, nunca full control.**
Los 2 colaboradores por resultado entran con **Basic (partial access)** y solo los activos que necesitan. Para pruebas o accesos acotados, usar **temporary access** (3 a 75 días, revocación automática). Si alguno necesita administrar una Página completa, dale **full control del activo**, no del portfolio.

**Paso 11 — Clientes: partner sharing, jamás portfolios nuevos.**
Cuando entre el próximo cliente con ad account propio, la vía es *Request to share an ad account* / agregarse como partner. Si le creás un portfolio, gastás un slot que ya no existe. Documentar esto como regla fija del carril comercial.

**Paso 12 — Auditoría trimestral.**
Exportar permisos de personas y el business history desde *Settings → People*. Sacar inactivos de +90 días, cuentas sin 2FA, y emails de dominio público. Es literalmente el checklist que Meta usa para decidir si te restringe.

---

### Dos advertencias que no quiero que se pierdan

1. **El plan original de "mover el ad account al portfolio comercial nuevo" no es ejecutable.** Meta lo prohíbe por escrito. El portfolio comercial de ONIA ya está definido: es "OnIA Agency". Todo lo demás se acomoda alrededor de ese hecho.
2. **Sin verificación, el negocio de chatbots tiene techo 2.** Con Bolivian Electric ocupando un número, queda uno solo. La verificación no es papeleo administrativo — es lo que separa vender un chatbot de vender veinte.

---

**Fuentes:**
- [About business portfolios](https://www.facebook.com/business/help/486932075688253)
- [Create a business portfolio](https://www.facebook.com/business/help/1710077379203657)
- [About business portfolio and business asset permissions](https://www.facebook.com/business/help/442345745885606)
- [About business verification in Meta Business Suite](https://www.facebook.com/business/help/1095661473946872)
- [Verify your business in Meta Business Suite](https://www.facebook.com/business/help/2058515294227817)
- [Upload official documents to verify your business](https://www.facebook.com/business/help/159334372093366)
- [Which documents are required for incorporated or registered business entities](https://www.facebook.com/business/help/193400874040813)
- [What type of business documents does Facebook accept](https://www.facebook.com/help/287728524907292)
- [Why was my business verification submission rejected](https://www.facebook.com/business/help/2342133782492969)
- [How do I edit my business details if my business is verified](https://www.facebook.com/business/help/322526208728282)
- [Add a Facebook Page to your business portfolio](https://www.facebook.com/business/help/720478807965744)
- [Remove a Page from your business portfolio](https://www.facebook.com/business/help/531142997352616)
- [Add an Instagram account to your business portfolio](https://www.facebook.com/business/help/620548115562686)
- [Add an ad account to your business portfolio](https://www.facebook.com/business/help/915885887059947)
- [Troubleshoot why you can't add or connect business assets](https://www.facebook.com/business/help/742119383392414)
- [Ad account limits](https://www.facebook.com/business/help/1026272311098874)
- [About Security Center](https://www.facebook.com/business/help/216940652189296)
- [Best practices for making a business portfolio more secure](https://www.facebook.com/business/help/608572510632070)
- [Turn on the two-factor authentication requirement](https://www.facebook.com/business/help/280940009201586)
- [About advertising restrictions](https://www.facebook.com/business/help/975570072950669)
- [About system users in Meta Business Suite](https://www.facebook.com/business/help/327596604689624)
- [System Users — Business Management APIs](https://developers.facebook.com/docs/business-management-apis/system-users/)
- [Install apps, generate, refresh and revoke tokens](https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens/)
- [Business Verification for app developers](https://developers.facebook.com/docs/development/release/business-verification/)
- [WhatsApp business phone numbers](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers)
- [WhatsApp Official Business Accounts](https://developers.facebook.com/documentation/business-messaging/whatsapp/official-business-accounts/)
- [Guidelines for Facebook Page names](https://www.facebook.com/help/519912414718764)
- [Change your Facebook Page's name](https://www.facebook.com/help/271607792873806)
- [Transfer ownership of a catalog](https://www.facebook.com/business/help/832599310690431)
- [Transfer app ownership](https://www.facebook.com/business/help/236817717885919)

---

# Anexo B — WhatsApp Business Platform

# WhatsApp Business Platform (Cloud API) 2026 — Investigación para vender como producto ONIA

> Todo verificado contra documentación oficial de Meta el **2026-07-25**. Los precios salen del **rate card USD oficial descargado desde `developers.facebook.com/docs/whatsapp/pricing`** (CSV "Tarifas en USD", vigente 1-jul-2026).

---

## 0) Resumen ejecutivo (lo que cambia el negocio)

| Hallazgo | Impacto para ONIA |
|---|---|
| **Bolivia (código 591) = mercado "Rest of Latin America"** | Marketing **USD 0,0740**/msg · Utility **0,0113** · Auth **0,0113** |
| **Mensajes de servicio (respuestas del bot dentro de la ventana de 24 h) son GRATIS hoy** | Un chatbot que solo *responde* cuesta **USD 0** en delivery hasta el 30-sep-2026 |
| **🔴 Desde el 1-oct-2026 Meta empieza a cobrar los mensajes de servicio y las plantillas utility enviadas en respuesta al usuario** | El costo del chatbot pasa de 0 a ~0,0113 USD por mensaje saliente. **Hay que cotizar a clientes con esta fecha adentro** |
| **🔴 Desde el 1-ago-2026 Meta cobra "Meta Business Agent" (su IA) por token: USD 2 / 1M tokens ≈ 4-5 ¢/mensaje** | Nuestra IA propia (n8n + LLM) es **más barata que la IA de Meta**: en el propio ejemplo de Meta, 1.000 mensajes con IA de terceros cuestan ~USD 27 vs ~USD 40-50 con MBA |
| **On-Premises API murió el 23-oct-2025** | Solo existe Cloud API. Cero dudas de arquitectura |
| **Coexistencia (Business app + Cloud API en el MISMO número)** | El dentista **no pierde su número ni su historial**. Es el mayor destrabador de ventas |
| **Tech Provider: Meta le factura al CLIENTE, no a ONIA** | ONIA no adelanta plata ni asume FX. Crítico en Bolivia post-devaluación |
| **No existe ningún "1.000 mensajes gratis/mes"** | Ese tier era del modelo viejo (conversation-based, deprecado). Hoy no hay franquicia gratuita documentada |

---

## 1) Requisitos para empezar

Fuente: [Cloud API — Get Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started) · [Business phone numbers](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers)

### 1.1 Cadena de activos (en este orden)
1. **Cuenta de Facebook / Meta** + registro de desarrollador.
2. **Business Portfolio** (Meta Business Manager) — se puede crear durante el alta de la app.
3. **App de Meta** tipo Business con el caso de uso *"Connect with customers through WhatsApp"*.
4. **WABA** (WhatsApp Business Account) — se crea o se vincula desde *API Setup*. Devuelve el `WhatsApp Business Account ID`.
5. **Número de teléfono** de negocio + `phone_number_id`.
6. **Token**: temporal para pruebas → **System User token permanente** con permisos `whatsapp_business_messaging` + `whatsapp_business_management`.
7. **Webhook** verificado (mensajes entrantes y estados: `sent/delivered/read/failed`).
8. **Método de pago** en la WABA (tarjeta internacional o línea de crédito).

### 1.2 Verificación de negocio (Business Verification)
No es obligatoria para *empezar a probar*, pero **sí para operar en serio**. Lo que desbloquea:

| Sin verificar | Verificado |
|---|---|
| 2 números por portfolio | **20 números** |
| 250 plantillas por WABA | **6.000 plantillas** (con display name aprobado) |
| Límite de mensajería 250 destinatarios/día | Salto directo a **2.000** |

> Meta pide: nombre legal, dirección, teléfono, email, sitio web + documentos. **Con SEPREC en mano esto ya se puede completar** — era el bloqueo histórico de ONIA.

### 1.3 El número de teléfono — reglas duras
Requisitos oficiales: ser **propiedad del negocio**, tener **código de país y área** (no short codes), poder **recibir SMS o llamada de voz**, y no estar ya registrado en WhatsApp.

- **Fijos (landline)**: soportados **solo con verificación por voz** (requiere recibir llamadas internacionales y desactivar IVR/desvíos).
- **VoIP**: soportado **solo por voz**.
- **PIN de verificación en dos pasos**: obligatorio al registrar. Sin el PIN no se puede cambiar ni borrar el número. **Guardarlo en el gestor de secretos de ONIA por cliente.**

### 1.4 ¿Se puede usar el número que el cliente YA tiene en WhatsApp Business app?

**Sí, y hay dos caminos.** Fuente: [Migrar un número existente](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/migrate-existing-whatsapp-number-to-a-business-account/) · [Onboard WhatsApp Business app users (coexistencia)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)

| | **A) Borrar la cuenta** | **B) Coexistencia (RECOMENDADO)** |
|---|---|---|
| Cómo | Ajustes → Cuenta → Eliminar mi cuenta → esperar (**hasta 3 min**) → registrar en Cloud API | Onboarding vía **Embedded Signup con flujo de Business app**, disponible solo para Solution Partner o **Tech Provider** |
| Historial | **Se pierde para siempre** | **Se conserva**: sincroniza **180 días** de mensajes en 3 fases (media solo de las **últimas 2 semanas**) |
| Sigue usando el celular | ❌ No | ✅ **Sí, app y API funcionan en paralelo**, mensajes espejados en ambos |
| Contactos | — | Sincronizan automáticamente |

**Requisitos de coexistencia**: app del cliente ≥ **v2.24.17**; ONIA debe suscribirse a los webhooks `history`, `smb_app_state_sync` y `smb_message_echoes`; **24 h** para completar la sincronización tras el onboarding.
**Limitaciones**: throughput tope **20 mensajes/segundo**; se desactivan mensajes temporales, ver una vez, ubicación en tiempo real y listas de difusión; **grupos no soportados** por Cloud API. Los mensajes 1-a-1 que el cliente manda desde la app **no se cobran**.

> **Esto es el argumento de venta #1 al dentista:** "no cambias de número, no pierdes tus chats, y seguís contestando desde tu celular cuando quieras".

### 1.5 Display name (nombre visible)
Estados oficiales: `APPROVED`, `PENDING_REVIEW`, `DECLINED`, `AVAILABLE_WITHOUT_REVIEW`, `EXPIRED`, `NONE`.
Debe estar **relacionado con el negocio** y cumplir las [normas de display name](https://www.facebook.com/business/help/757569725593362) y las políticas de Commerce/Business. **La revisión del nombre no bloquea el arranque** — se puede empezar a mensajear antes — pero **el display name aprobado es requisito** para las 6.000 plantillas y para la Official Business Account (tilde verde).

---

## 2) PRECIOS 2026 — tabla real para Bolivia

Fuente primaria: [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing) — CSV oficial *"Cost per message in USD on the WhatsApp Business Platform, effective July 1, 2026"*.

### 2.1 Modelo vigente
- Desde **1-jul-2025**: cobro **por mensaje** (no por conversación). Se cobra **solo cuando la plantilla se ENTREGA** (`delivered`, no `sent`).
- La tarifa depende de la **categoría de la plantilla** y del **código de país del destinatario** (no de dónde está la empresa).
- Meta solo puede actualizar precios **el día 1 de cada trimestre**, con aviso previo (*pricing calendar*).

### 2.2 Tarifas oficiales — Bolivia (591) = "Rest of Latin America"

| Categoría | USD / mensaje | Bs aprox.* |
|---|---|---|
| **Marketing** | **0,0740** | ~0,84 |
| **Utility** | **0,0113** | ~0,13 |
| **Authentication** | **0,0113** | ~0,13 |
| **Service** (no plantilla, dentro de ventana 24 h) | **0,0000** hasta 30-sep-2026 → luego = tarifa utility (**0,0113**) | — |

\* Referencia interna ONIA a ~11,37 Bs/USD post-flotación (jun-2026); **verificar tipo de cambio al cotizar** — los costos de Meta son en USD, así que todo contrato con cliente lleva cláusula de ajuste.

**Comparativo regional (mismo CSV, USD):**

| Mercado | Marketing | Utility / Auth |
|---|---|---|
| **Rest of Latin America (Bolivia, Paraguay, Uruguay, Ecuador, Perú*, CR, RD, SV, GT, HT, HN, JM, NI, PA, PR, VE)** | 0,0740 | 0,0113 |
| Colombia | 0,0125 | 0,0008 |
| México | 0,0305 | 0,0085 |
| Brasil | 0,0625 | 0,0068 |
| Argentina | 0,0618 | 0,0260 |
| Chile | 0,0889 | 0,0200 |
| Perú (tarifa propia) | 0,0703 | 0,0200 |
| North America | 0,0250 | 0,0034 |

> Ojo: **Bolivia es de los mercados CAROS en marketing** (0,074 vs 0,0125 de Colombia). El margen del producto NO puede venir de mandar promociones masivas — viene de utility + servicio.

### 2.3 Qué es GRATIS hoy (y hasta cuándo)

| Concepto | Estado | Desde/hasta |
|---|---|---|
| Mensajes que el **usuario** manda al negocio | **Siempre gratis** | — |
| **Mensajes sin plantilla** dentro de la ventana de servicio (CSW) de 24 h | Gratis | desde 1-nov-2024 → **se cobra desde 1-oct-2026** |
| **Plantillas utility** enviadas dentro de una CSW abierta | Gratis | desde 1-jul-2025 → **se cobra desde 1-oct-2026** |
| **Free Entry Point (FEP)**: usuario llega por **anuncio Click-to-WhatsApp** o botón CTA de la Página → si respondés dentro de 24 h, se abre ventana de **72 h con TODO gratis** | Gratis | **se mantiene** |
| Plantillas de **marketing** | **Siempre se cobran** | — |

**La CSW (24 h) y la FEP (72 h) son ventanas independientes**: si la CSW se cierra, aunque la FEP siga abierta solo podés mandar plantillas.

> 💡 **Palanca directa con el motor Meta Ads que ONIA ya tiene deployado (`act_1073680778314945`)**: cada lead que entra por Click-to-WhatsApp = **72 h de conversación con costo cero**. Eso es producto vendible: "tu campaña genera conversaciones que no pagan mensajería".

### 2.4 ¿Existen 1.000 mensajes gratis/mes?
**No.** El tier de 1.000 conversaciones de servicio gratis pertenecía al modelo *conversation-based pricing*, hoy **deprecado**. La doc actual dice: *"As of November 1, 2024, you can open an unlimited number of service conversations at no charge"* — es decir, servicio ilimitado gratis **hasta el 30-sep-2026**, y a partir de ahí **no hay franquicia gratuita documentada**. Fuente: [Conversation-based pricing (Deprecated)](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/conversation-based-pricing).

### 2.5 🔴 Cambios confirmados H2-2026 (esto define la cotización)
Fuente oficial: [Upcoming pricing updates for Meta Business Agent, service and utility messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)

| Fecha | Qué cambia |
|---|---|
| **1-jul-2026** (ya pasó) | Lanza **Meta Business Agent**. Los mensajes sin plantilla ahora son 2 categorías: **Service** (persona o IA de terceros) o **Meta Business Agent** (IA de Meta) |
| **1-ago-2026** | Meta cobra **Meta Business Agent por token**: **USD 2,00 / 1M tokens**; un mensaje consume 20.000-25.000 tokens ≈ **4-5 ¢/mensaje**. ⚠️ *"Meta Business Agent messages will not be delivered if a credit line is not attached"* |
| **1-oct-2026** | **Se cobran los mensajes de servicio** y las **plantillas utility enviadas en respuesta al usuario**. Tarifa por mercado = **la misma que utility/authentication** → Bolivia **0,0113 USD/msg**. *"Any non-template message is charged as of October 1, 2026."* Meta se comprometió a publicar tarifas exactas por mercado antes del 1-sep-2026 |

**Comparativo de costo publicado por la propia Meta** (1.000 mensajes con IA respondiendo, mercado Brasil):

| Modelo | Costo IA | Delivery | Total 1.000 msgs |
|---|---|---|---|
| IA de terceros, baja complejidad | ~2 ¢ | 0,68 ¢ | **~USD 27** |
| IA de terceros, alta complejidad | ~9 ¢ | 0,68 ¢ | **~USD 97** |
| **Meta Business Agent** | 4-5 ¢ (incluye delivery) | — | **~USD 40-50** |

> **Decisión ONIA: NO habilitar Meta Business Agent.** Nuestro stack (n8n + Chatwoot + LLM propio, ya probado en Bolivian Electric) cae en la columna "IA de terceros baja complejidad" — más barato, controlable, y el margen se queda en casa. MBA además exige línea de crédito con Meta.

### 2.6 Niveles de volumen (solo utility y authentication)
Se agregan a nivel **business portfolio** (suma de todas las WABA), se resetean cada mes, y **marketing NO tiene descuento por volumen**.

Rest of Latin America — Utility:

| Mensajes/mes | Tarifa | vs. lista |
|---|---|---|
| 0 – 100.000 | 0,0113 | 0% |
| 100.001 – 1.000.000 | 0,0107 | −5% |
| 1.000.001 – 4.500.000 | 0,0102 | −10% |
| 4.500.001 – 15.000.000 | 0,0096 | −15% |
| 15.000.001 – 30.000.000 | 0,0090 | −20% |
| 30.000.001 + | 0,0085 | −25% |

> Irrelevante a corto plazo (ningún dentista llega a 100k), **pero es el argumento para el modelo Solution Partner a futuro**: si ONIA agregara el volumen de todos sus clientes bajo un portfolio propio, accedería a tiers. Con Tech Provider cada cliente factura su propio volumen y nadie llega al tier.

---

## 3) Plantillas (templates)

Fuente: [Template fundamentals](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview)

### 3.1 Aprobación
- **Revisión automática, hasta 24 horas.** En la práctica suele ser minutos.
- Categorías: **marketing / utility / authentication**. Meta **recategoriza** si detecta que el contenido no coincide con la categoría declarada — y *"whenever a template is used, a business accepts the charges associated with the category applied at time of use"*. **Una utility mal escrita que Meta reclasifica como marketing multiplica el costo por 6,5 en Bolivia** (0,0113 → 0,0740).
- Límites: **250 plantillas** por WABA sin portfolio verificado, **6.000** con portfolio verificado + display name aprobado. Máximo **100 plantillas creadas por hora**.

### 3.2 Estados
`In-Review` → `Approved/Active` (con calidad **High / Medium / Low**) · `Rejected` · `Paused` · `Disabled` · `Appeal Requested`.

### 3.3 Qué se rechaza (causas frecuentes)
- Categoría declarada ≠ contenido detectado (lo más común).
- **Idioma declarado ≠ idioma del cuerpo**.
- Plantillas con media (imagen/video/documento) **sin valores de muestra válidos** → imposible aprobar.
- Pedir **datos sensibles**: medios de pago, número de documento/CI, contraseñas → rechazo automático.
- Formato: variables mal balanceadas, variables al inicio/final sin texto, longitud, emojis raros.
- Contenido de categorías prohibidas (ver §5).

### 3.4 Calidad y pausado
Las plantillas reciben calidad según *"usage, customer feedback, and engagement"*:
- **High**: feedback negativo mínimo.
- **Medium**: feedback negativo de varios usuarios o **baja tasa de lectura**.
- **Low**: feedback negativo significativo → **riesgo de pausa**.

Una plantilla con feedback negativo recurrente pasa a **Paused** (no se puede enviar) y, si reincide, a **Disabled** (permanente). Hay **apelación**.

### 3.5 Límites de mensajería (messaging limits)
Fuente: [Messaging limits](https://developers.facebook.com/docs/whatsapp/messaging-limits)

Escalera: **250 → 2.000 → 10.000 → 100.000 → ilimitado** (destinatarios únicos por período de 24 h, contando solo mensajes fuera de la ventana de servicio).

**Para llegar a 2.000**, una de tres:
1. Verificar el negocio, **o**
2. que el **partner verifique** el negocio (← esto lo puede hacer ONIA como Tech Provider), **o**
3. entregar 2.000 mensajes a números únicos en 30 días con plantillas de **calidad alta**.

**De 2.000 en adelante el escalado es automático en ~6 horas** cuando: (a) se manda alto volumen de calidad en todos los números y plantillas, y (b) se usó **al menos la mitad** del límite actual en los últimos 7 días.

Quality rating del número: `GREEN` / `UNKNOWN` / `NA`, consultable por API.

---

## 4) Modelos de acceso: directo vs Tech Provider vs BSP

Fuente: [Solution providers](https://developers.facebook.com/docs/whatsapp/solution-providers) · [Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers) · [Embedded Signup](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview)

### 4.1 Los 4 modelos

| Modelo | Quién es dueño de la WABA | Quién le cobra al cliente la mensajería | Línea de crédito | Requiere ser Meta Business Partner |
|---|---|---|---|---|
| **Directo** | El cliente | Meta → cliente | — | No |
| **Tech Provider** | **El cliente** | **Meta → cliente** (el cliente pone su tarjeta). ONIA factura aparte su servicio | ❌ No tiene | ❌ No |
| **Tech Partner** | El cliente | Meta → cliente | ❌ | ✅ Sí |
| **Solution Partner (BSP)** | El cliente | **El BSP → cliente** (revende con markup) | ✅ Comparte su línea | ✅ Sí, proceso largo |

> En **todos** los modelos **el cliente es dueño de sus activos de WhatsApp**: *"Business customers onboarded via Embedded Signup own all of their WhatsApp assets... you cannot restrict this access in any way."* No se puede secuestrar la WABA de un cliente. Eso hay que decirlo en la propuesta — es un argumento de confianza, no una debilidad.

### 4.2 ¿Puede ONIA ser Tech Provider y administrar las WABA de sus clientes? **SÍ.**

Ruta oficial, en orden:

1. **App de Meta** tipo Business con caso de uso WhatsApp, vinculada a un **business portfolio** de ONIA.
2. **Business Verification de ONIA** ← *ya destrabado con SEPREC*.
3. **Configurar la app**: ícono, categoría, **política de privacidad** (URL pública obligatoria), **webhooks** funcionando.
4. **App Review** pidiendo **Advanced access** a:
   - `whatsapp_business_messaging` (mandar mensajes por cuenta de clientes)
   - `whatsapp_business_management` (administrar sus WABA y plantillas)
   Se suben **2 videos de demostración** (enviar un mensaje / crear una plantilla). *"You will not be able to onboard business customers until your app has been approved for advanced access."*
5. **Implementar Embedded Signup** (el popup donde el cliente se loguea con su Facebook y crea/vincula su WABA en 3 minutos, sin que ONIA toque sus credenciales) + **session logging**.
6. Opcional pero clave: **habilitar el flujo de onboarding de usuarios de WhatsApp Business app** (coexistencia).

**Límites de onboarding**: **10 clientes nuevos por ventana móvil de 7 días** por defecto → **200 por 7 días** tras completar **Business Verification + App Review + Access Verification**. Más volumen exige postular a **Meta Business Partner**.

### 4.3 Ventajas / costos de cada camino para ONIA

| | **Tech Provider propio (recomendado)** | **Vía BSP (Twilio / 360dialog / etc.)** |
|---|---|---|
| Costo de mensajería | **Tarifa Meta pura** (0,0113 / 0,0740) | Tarifa Meta **+ markup del BSP** (~USD 0,003-0,010/msg en los grandes, más en los chicos) o cuota fija mensual |
| Quién paga | **El cliente pone su tarjeta**, Meta le factura directo | El BSP le factura a ONIA o al cliente |
| Riesgo FX / caja | **Cero para ONIA** — no adelanta USD | ONIA adelanta y recobra en Bs = riesgo de devaluación |
| Time-to-market | **Semanas** (Business Verification + App Review) | **Días** |
| Onboarding de clientes | Embedded Signup propio, marca ONIA | Flujo del BSP, marca del BSP |
| Coexistencia (no perder el número) | ✅ Disponible | Solo si el BSP lo soporta |
| Dependencia | Ninguna | Alta: precios, SLA y roadmap ajenos |
| Escalabilidad de tiers de volumen | Cada cliente su propio volumen | El BSP agrega volumen |

**Recomendación**: **Tech Provider propio**, con un BSP como plan B solo si un cliente grande no puede esperar el App Review. Un detalle a resolver de entrada: **el cliente necesita tarjeta internacional en USD** para pagarle a Meta — en Bolivia post-flotación eso es fricción real. Si el cliente no la tiene, las opciones son (a) ONIA pone la tarjeta y recobra en Bs con cláusula de ajuste (ONIA asume el FX), o (b) ir por un BSP que acepte pago local. **Decisión de negocio para Sergio, no técnica.**

> **Nota de gobernanza Meta**: la app de Tech Provider debe vivir en el portfolio **comercial** ("ONIA Comercial"), nunca en el de personas IA (Lucía). Meta escala restricciones a nivel portfolio: si una cuenta de influencer IA se marca, no puede arrastrar las WABA de clientes que pagan.

---

## 5) Reglas de contenido y opt-in (para no quemar números de clientes)

Fuente: [Getting opt-in](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) · [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/es-la/policy/) · [Policy enforcement](https://developers.facebook.com/docs/whatsapp/overview/policy-enforcement)

### 5.1 Opt-in — qué exige Meta
Se puede escribir a alguien solo si esa persona: **(1)** dio su número de celular, **y (2)** dio permiso explícito de recibir mensajes.

- El permiso **puede ser general, no específico de WhatsApp** (relajación de nov-2024), siempre respetando la ley local.
- Debe quedar claro: **que está optando por recibir comunicaciones**, y **el nombre del negocio** del que las va a recibir.
- Se puede recolectar por: **SMS, sitio web, IVR telefónico, en persona o en papel**.

**Regla operativa ONIA:** el opt-in se **guarda con timestamp, canal y texto exacto mostrado** en la base del cliente. Si Meta pide evidencia en una apelación, sin eso no hay defensa.

### 5.2 Categorías prohibidas (aplican a mensajería y a comercio)
Armas de fuego · Alcohol y tabaco · Drogas · **Productos médicos y de salud** · Especies en peligro · Animales vivos · Productos y materiales peligrosos · Moneda real, virtual o falsificada · Partes o fluidos corporales · Modelos de negocio fraudulentos · Apuestas y juegos con dinero real · Productos y servicios para adultos · Servicios de citas · Marketing multinivel · Préstamos de día de pago.

> ⚠️ **Bandera roja para el vertical dental/salud**: *"Productos médicos y de salud"* está prohibido. Esto apunta a la **venta** de productos médicos (catálogo/comercio), **no** a que una clínica coordine turnos con sus pacientes. Pero en la práctica: **las plantillas que promocionan tratamientos con lenguaje médico o promesas de resultado se rechazan.** Regla ONIA para DentalGest:
> - ✅ Utility: "Hola {{1}}, te recordamos tu cita en {{2}} el {{3}} a las {{4}}. Respondé 1 para confirmar."
> - ❌ Marketing: "Blanqueamiento dental 50% OFF — resultados garantizados".
> - **Nunca** incluir diagnóstico, tratamiento ni datos clínicos en el cuerpo de una plantilla (queda en logs de Meta y es dato sensible).

### 5.3 Automatización e IA — obligación de escalamiento
La política permite automatizar dentro de la ventana de 24 h, **pero exige mantener rutas de escalamiento "rápidas, claras y directas"** a un humano: transferencia a agente, teléfono, email, formulario web, visita física o ticket. **Un bot sin botón de "hablar con una persona" es una violación de política**, no un detalle de UX. Esto ya está resuelto en el stack ONIA con Chatwoot.

### 5.4 Enforcement — qué pasa si se rompe
Escalera: **advertencia → bloqueo temporal de mensajería (1 a 30 días) → bloqueo de cuenta → eliminación permanente de la plataforma**.
- Violaciones graves (explotación infantil, estafas, terrorismo, venta de drogas ilegales) = **eliminación inmediata**.
- Notificaciones llegan por Business Support Home, notificaciones de Business Manager, email a admins y **webhooks** (← suscribirse: es la única forma de enterarse a tiempo y automatizable).
- **Apelaciones: se revisan en 24-48 h.** No todas las violaciones de spam son apelables.

---

## 6) ✅ CHECKLIST DE REQUISITOS POR CLIENTE

Lo que ONIA le pide a un dentista/empresa antes de conectar el chatbot.

### A. Del cliente — datos y accesos
- [ ] **Número de teléfono**: el que ya usa en WhatsApp Business app (→ coexistencia) o uno nuevo dedicado. Debe recibir SMS o llamada, con código de país (+591) y no ser short code.
- [ ] Si va por coexistencia: **WhatsApp Business app v2.24.17 o superior** instalada y actualizada.
- [ ] **Cuenta de Facebook con rol de admin** en su Business Portfolio (o crearlo en el Embedded Signup).
- [ ] **Datos legales para Business Verification**: razón social exacta, **NIT**, **matrícula SEPREC / registro de comercio**, dirección física, teléfono, email corporativo del dominio, **sitio web activo**.
- [ ] **Documento probatorio**: matrícula de comercio, certificado NIT o factura de servicio a nombre del negocio.
- [ ] **Método de pago**: tarjeta internacional (USD) o acuerdo escrito de que ONIA adelanta y recobra en Bs con cláusula de ajuste cambiario.
- [ ] **Política de privacidad publicada** en su web (URL) — requisito de la app y buena práctica para datos de pacientes.

### B. De marca y perfil
- [ ] **Display name** propuesto (relacionado al negocio real; sin promociones ni "el mejor…").
- [ ] Logo cuadrado (min. 640×640), descripción del negocio, dirección, email, sitio web, **categoría** correcta del perfil, horarios.

### C. De contenido y cumplimiento
- [ ] **Evidencia de opt-in**: dónde y cómo lo recolecta (formulario web, ficha en recepción, IVR). ONIA entrega el texto legal sugerido.
- [ ] **Base de contactos exportada** con: número en formato internacional, nombre, **fecha y canal del opt-in**. Sin opt-in, el contacto no entra.
- [ ] **Lista de casos de uso** → mapeados a categoría (define el costo):
  - Recordatorio/confirmación de cita → **utility**
  - Resultado listo / post-operatorio → **utility**
  - Código de acceso al portal → **authentication**
  - Promoción / campaña / reactivación → **marketing** (6,5× más caro)
- [ ] **Ruta de escalamiento a humano** definida: quién atiende, en qué horario, por qué canal (obligación de política).
- [ ] Confirmación por escrito de que **no** enviará contenido de las categorías prohibidas.

### D. Técnico (lo hace ONIA)
- [ ] Onboarding vía **Embedded Signup** de ONIA (Tech Provider) — el cliente nunca comparte contraseña.
- [ ] Webhooks suscritos: `messages`, `message_template_status_update`, `account_update`, `phone_number_quality_update` (+ `history`, `smb_app_state_sync`, `smb_message_echoes` si es coexistencia).
- [ ] **PIN de verificación en dos pasos** generado y guardado en el gestor de secretos, por cliente.
- [ ] System user token permanente + rotación documentada.
- [ ] Plantillas iniciales cargadas y aprobadas (con valores de muestra si llevan media).
- [ ] Verificación del negocio del cliente lanzada (ONIA puede verificarlo como partner → salta directo a 2.000 de límite).
- [ ] Alertas conectadas a n8n: plantilla pausada, caída de quality rating, cambio de messaging limit, violación de política.

---

## 7) 💵 COSTO MENSUAL ESTIMADO — dentista tipo en Bolivia

Supuestos: clínica con ~250 pacientes activos/mes, bot que responde consultas + recordatorios de citas.

| Concepto | Volumen/mes | Precio unit. | **Hoy (jul-sep 2026)** | **Desde 1-oct-2026** |
|---|---|---|---|---|
| Recordatorios y confirmaciones de cita (utility, fuera de ventana) | 400 | 0,0113 | **USD 4,52** | USD 4,52 |
| Respuestas del bot dentro de la ventana de 24 h (service) | 1.000 | 0 → 0,0113 | **USD 0,00** | **USD 11,30** |
| Utility de respuesta dentro de la ventana (confirmaciones) | 200 | 0 → 0,0113 | **USD 0,00** | **USD 2,26** |
| Mensajes entrantes del paciente | 800 | 0 | USD 0,00 | USD 0,00 |
| **Subtotal Meta — plan SIN marketing** | | | **≈ USD 4,50** | **≈ USD 18,10** |
| Campaña de reactivación (marketing) — opcional | 300 | 0,0740 | +USD 22,20 | +USD 22,20 |
| **Subtotal Meta — plan CON marketing** | | | **≈ USD 27** | **≈ USD 40** |
| Costo IA propia (LLM, ~1.000 respuestas, referencia Meta: ~2 ¢/msg baja complejidad) | 1.000 | ~0,02 | **≈ USD 20** | ≈ USD 20 |
| **TOTAL COSTO ONIA por cliente** | | | **≈ USD 25 – 47** | **≈ USD 38 – 60** |

Referencia en Bs (~11,37/USD): **≈ Bs 280–535/mes hoy** → **≈ Bs 430–680/mes desde octubre**.

### Lecturas comerciales
1. **El costo variable es bajísimo comparado con lo que se cobra.** Un add-on de chatbot a Bs 490-890/mes deja margen bruto alto incluso post-octubre. El precio se sostiene por el **resultado** (citas que no se pierden), no por el costo de mensajería.
2. **El marketing masivo es el que rompe la unit economics en Bolivia** (0,074 vs 0,0113 = 6,5×). Vender el chatbot como **motor de atención y recordatorios**, y las campañas como **paquete separado con presupuesto explícito del cliente** (igual que la pauta: costo de terceros excluido del precio ONIA — regla del CLAUDE.md).
3. **El 1-oct-2026 sube el costo ~4× en la parte de servicio.** Todo contrato firmado antes de esa fecha debe traer **cláusula de ajuste de costos de terceros**, o cotizarse ya con el precio de octubre para no comerse el aumento.
4. **Click-to-WhatsApp = mensajería gratis 72 h.** Con el motor Meta Ads ya deployado, cada lead que llega por anuncio no paga delivery durante 3 días. Es la pieza que hace que "anuncios + chatbot" rinda más que cada uno por separado.
5. **No habilitar Meta Business Agent**: 4-5 ¢/mensaje vs ~2 ¢ con IA propia, exige línea de crédito con Meta, y regala a Meta el control de la conversación.

---

## Fuentes

- [Pricing on the WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp/pricing) — rate card USD oficial vigente 1-jul-2026 (CSV descargado)
- [Upcoming pricing updates: Meta Business Agent, service and utility messages](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/non-template-messages)
- [Conversation-based pricing (Deprecated)](https://developers.facebook.com/documentation/business-messaging/whatsapp/pricing/conversation-based-pricing)
- [Cloud API — Get Started](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started)
- [Business phone numbers](https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers) · [Phone numbers (Cloud API)](https://developers.facebook.com/docs/whatsapp/cloud-api/phone-numbers)
- [Migrate an existing WhatsApp number to a business account](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/migrate-existing-whatsapp-number-to-a-business-account/)
- [Onboard WhatsApp Business app users (coexistencia)](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/onboarding-business-app-users)
- [Embedded Signup — overview](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview)
- [Become a Tech Provider](https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/get-started-for-tech-providers) · [Solution providers](https://developers.facebook.com/docs/whatsapp/solution-providers)
- [Template fundamentals](https://developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview) · [Message templates (Business Management API)](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates)
- [Messaging limits](https://developers.facebook.com/docs/whatsapp/messaging-limits)
- [Getting opt-in](https://developers.facebook.com/docs/whatsapp/overview/getting-opt-in) · [WhatsApp Business Messaging Policy](https://whatsappbusiness.com/es-la/policy/) · [Policy enforcement](https://developers.facebook.com/docs/whatsapp/overview/policy-enforcement)
- [On-Premises API Sunset](https://developers.facebook.com/docs/whatsapp/on-premises/sunset) · [Display name guidelines](https://www.facebook.com/business/help/757569725593362)

Archivos de trabajo descargados (rate cards oficiales, por si se quieren versionar en el repo):
`C:\Users\PC\AppData\Local\Temp\claude\C--dev-proyectos-onia-hermes--claude-worktrees-onia-colaboradores-sin-inversion-d69b19\d11d8437-a1f6-446f-b0dc-55ff9978fd77\scratchpad\rates_usd.csv` y `\tiers_usd.csv`

---

# Anexo C — Reuso Bolivian Electric

# Bolivian Electric — chatbot: arquitectura real, estado y stack reusable

> **Advertencia de ubicación (lo primero).** El avance real **NO está en `main`**. Vive en el worktree
> `C:\dev\clientes\Bolivian Electric\.claude\worktrees\bolivian-electric-chatbot-1e39da\`, rama
> `claude/bolivian-electric-chatbot-1e39da`: **43 commits adelante de `main`, 0 atrás** (tip `f8eecc0` al momento de leer; la rama estaba activa durante esta lectura). `main` (tip `8ce2697`) **no tiene** catálogo en Postgres, guardrails deterministas, opt-in, plantillas HSM, cron de seguimiento, sinónimos aprendibles ni dedup de mensajes. Todo lo que sigue se refiere al worktree salvo que diga lo contrario.

---

## 1. Arquitectura real (con rutas)

### 1.1 Topología

```
WhatsApp (+591 71353296, WABA 398983206624133)
  -> Meta Cloud API  [Chatwoot actúa como BSP vía Embedded Signup; NO hay app de Meta propia de ONIA]
  -> Chatwoot (Cloud hoy; self-hosted en VPS preparado, cutover pendiente)
  -> webhook saliente de Chatwoot
  -> Next.js  POST /api/chatwoot/webhook      <-- EL MOTOR VIVE ACÁ, no en n8n
  -> Postgres (contenedor `bolivian-electric-db`, red `bolivian_n8n_default`)
```

n8n **no está en el camino crítico**: hay un workflow SDK de intake (`infra/n8n/workflows/be-chatwoot-whatsapp-intake.sdk.js`) que duplica clasificación básica, pero el orquestador real es la API route de Next. n8n queda como disparador de crons y evento espejo (`lib/n8n-webhook.ts`, gated por `N8N_ENABLED`).

### 1.2 Componentes y archivos (rutas relativas al worktree)

| Componente | Archivo | Notas |
|---|---|---|
| **Webhook de entrada** | `apps/web/app/api/chatwoot/webhook/route.ts` | Verifica firma HMAC (`X-Chatwoot-Signature` = HMAC-SHA256 de `{ts}.{body}`), dedup (`lib/message-dedup.ts`), carga async del catálogo, delega |
| **Orquestador (el cerebro)** | `apps/web/lib/chatwoot-webhook.ts` (1.112 líneas) | Todo el pipeline: transcripción → intención → ruteo → matching → disponibilidad → IA → guardrails → opt-in → nota privada → labels → asignación → respuesta pública |
| **Matcher de productos** | `apps/web/lib/product-matching.ts` (321) | IDF + peso a tokens distintivos + head-noun bonus + diccionario de modismos cruceños + `unmetSpecTokens` (no confirma el calibre/tipo equivocado). Índice memoizado por `WeakMap` sobre el array de catálogo |
| **Respuesta grounded de disponibilidad** | `apps/web/lib/availability-reply.ts` (143) | "hay/no hay" por ciudad, nunca el número exacto; clarify nombrando candidatos reales; detecta reclamos (`looksLikeComplaint`) |
| **Guardrails deterministas** | `apps/web/lib/reply-guardrails.ts` | Filtro regex sobre la respuesta **libre** de la IA (no sobre la grounded ni la FAQ); reemplaza por `SAFE_REPLY` si afirma stock/precio/cantidad |
| **Catálogo (store + carga)** | `lib/catalog-store.ts`, `lib/be-catalog-loader.ts`, `lib/be-catalog-db.ts`, `lib/db-client.ts` | `ensureBeCatalogLoadedAsync`: Postgres → archivo JSON → vacío. Fail-safe total, nunca lanza |
| **Normalizador del export ERP** | `apps/web/lib/be-catalog-adapter.ts` (308) | Específico de `INF SERGIO.xlsx`: 11 columnas de bodega → 3 ciudades; `assertHeaders` falla duro ante columna desconocida |
| **Importador genérico** | `apps/web/lib/catalog-import.ts` | `guessMapping` autodetecta columnas de cualquier export (sku/nombre/categoría/marca/unidad/precio/stock) |
| **IA (LLM)** | `apps/web/lib/openai-client.ts` (295) | 3 usos: transcripción de notas de voz, clasificación de lead, redacción libre. `fetchImpl` inyectable; sin API key → todo `skipped` |
| **Ruteo a vendedor** | `lib/seller-router.ts` + `lib/seller-roster.ts` | Sticky por cliente conocido → pool por ciudad con random **ponderado** → global → fallback gerente. Puro, `rng` inyectable |
| **Captura de lead** | `lib/lead-capture.ts`, `lib/lead-scoring.ts` | Slots ciudad/producto/cantidad/empresa/NIT/correo; scoring hot/warm/cold (reglas + IA opcional) |
| **Handoff a humano** | `lib/chatwoot-read.ts` → `humanAgentHasReplied(history, botAgentId)` | Cuando un agente humano contesta, el bot **se calla** (no reasigna, sí sigue anotando/etiquetando) |
| **Horario** | `apps/web/lib/business-hours.ts` | L-V 8:30-17:30, Sáb 8:30-13:00, UTC-4 hardcodeado. Bot 24/7; el SLA solo cuenta horas laborales |
| **SLA + escalada** | `lib/sla-reassignment.ts`, `lib/branch-managers.ts`, `app/api/cron/sla-reassign/route.ts` | Aviso al jefe de sucursal cuando el vendedor no responde |
| **Opt-in (Meta)** | `lib/opt-in-capture.ts`, `lib/opt-in-prompt.ts`, `lib/customer-opt-in.ts` | Solo consentimiento **explícito**; el bot ahora **pide** permiso una vez por conversación |
| **Plantillas HSM** | `lib/whatsapp-template-catalog.ts`, `lib/whatsapp-templates.ts`, `lib/proactive-template-send.ts`, `lib/chatwoot-template-send.ts` | 4 plantillas tipadas; 3 transportes (`meta` \| `chatwoot` \| `meta_via_chatwoot`) vía `PROACTIVE_TEMPLATE_TRANSPORT`. Opt-in se verifica **antes** de elegir transporte |
| **Motor de seguimiento** | `lib/follow-up-scheduler.ts` (puro), `lib/follow-up-state.ts`, `app/api/cron/follow-ups/route.ts` | Cadencia 2/5/15 días; **reserva atómica del paso (CAS) antes de enviar** — prefiere perder un seguimiento a duplicarlo |
| **Aprendizaje nivel 1** | `lib/learned-synonyms.ts`, `lib/learned-synonyms-cache.ts`, `app/api/learn/synonym/route.ts`, `app/api/learn/misses/route.ts` | Un humano aprueba `variant → canonical` por API, sin tocar código; el matcher lee un cache sincrónico |
| **Analítica de demanda** | `lib/be-demand.ts`, `lib/be-demand-insights.ts` | Persiste cada consulta (incluidos los **misses**, con `terms`) para saber qué piden que no hay |
| **Panel (Next App Router)** | `apps/web/app/` — 30 páginas | Relevantes al bot: `/management-live`, `/bot-config`, `/probador-bot`, `/seguimientos`, `/whatsapp-chatbot` |
| **Base de datos** | `infra/sql/*.sql` (8 archivos idempotentes) | `catalog_products`, `catalog_synonyms`, `customer_directory`, `customer_opt_in`, `demand_events`, `demand_events_terms`, `leads`, `leads_follow_up_tracking` |
| **Despliegue** | `infra/vps/Dockerfile`, `infra/vps/compose.yml`, `infra/vps/Caddyfile.*` | Next standalone en Docker; bind-mount del catálogo JSON; VPS Hostinger `187.77.251.218` |

### 1.3 Orden del pipeline (`processChatwootWhatsAppMessage`)

1. Audio → transcripción (OpenAI) si el mensaje es solo nota de voz
2. Intención + ciudad detectada → `routeLead`
3. `lookupCustomerByPhone` (directorio ERP) → nombra "su vendedor de siempre" en la nota
4. Clasificación de lead (IA con fallback a reglas)
5. Historial de conversación → memoria + detección de handoff humano
6. FAQ / imagen / `matchProducts` sobre el catálogo real
7. Persistencias fire-and-forget: `demand_events`, `leads`, `customer_opt_in`
8. **Prioridad de respuesta:** FAQ aprobada > acuse de imagen > **disponibilidad grounded** > IA con guardrails > texto fijo
9. Append de nota fuera de horario + pedido de opt-in (si corresponde)
10. Quick replies (botones Chatwoot `input_select`)
11. Efectos: nota privada → labels → asignación → respuesta pública (cada uno con su gate)

**Todos los caminos con red/DB son fail-safe:** una DB caída degrada el catálogo a vacío o la analítica a no-op, nunca tumba el webhook.

---

## 2. Estado real (honesto) para Bolivian Electric

### Terminado y probado
- **42 archivos de test** en `apps/web/lib/*.test.ts`, los **42 cableados en `npm run validate`** (que además corre `typecheck`, `check:imports`, `telegram:check`, `access:check` y `build`). No pude ejecutar `validate` en esta lectura — no verifico "verde", solo que está cableado.
- Catálogo real normalizado: **12.385 productos** (SCZ 11.931 / CBBA 4.937 / LPZ 5.559), cargado en Postgres del **canal de prueba** (`bolivian-electric-os-test`, :3002), con `BE_CATALOG_DB=true`.
- Migraciones aplicadas en prueba: `catalog_products`, `demand_events`, `customer_opt_in`.
- Bot: recepción, transcripción, FAQ, memoria, captura progresiva, matching + modismos, disponibilidad por ciudad, guardrails, ruteo, SLA por sucursal, pausa ante humano, quick replies, idempotencia.

### Construido pero APAGADO (compuerta de env)
Una respuesta llega al cliente solo si **todo** es verdad: `CHATWOOT_INTEGRATION_ENABLED=true` **y** `CHATWOOT_DRY_RUN=false` **y** `CHATWOOT_SEND_PUBLIC_REPLIES=true` **y** account/token seteados. Por defecto está OFF. **No puedo verificar desde el repo si en el server está encendido.**

### Pendiente real
| Ítem | Estado | Bloqueo |
|---|---|---|
| Catálogo en **producción** (:3001) | Pendiente | El `DATABASE_URL` de `app.env` probablemente tiene el mismo bug de password sin URL-encodear que ya se corrigió en `app.test.env` |
| Plantillas HSM en Meta | **No creadas / no aprobadas** (no verificable desde el repo) | Gerencia; días de revisión de Meta |
| Advanced Access (`whatsapp_business_messaging`) | No otorgado | App Review de Meta, aparte de la verificación de negocio |
| Tabla `customer_opt_in` | "esencialmente vacía" | Recién ahora el bot **pide** consentimiento; hay que acumularlo |
| `CHATWOOT_WEBHOOK_SECRET` | Vacío ⇒ el endpoint acepta webhooks **sin firma** (spoofable) | Ops |
| Rotar OpenAI key + token Chatwoot | **Pendiente, urgente** — se compartieron en texto plano | Ops |
| Vendedores | Solo **Saúl** activo; los otros 7 en `active:false` sin agente Chatwoot | Cuentas Chatwoot + `CHATWOOT_AGENT_MAP` |
| Contactos de los 4 jefes | Sin tel/correo ⇒ la escalada SLA **no tiene destino** | Cliente |
| SKUs mock en "productos relacionados" | `lib/whatsapp-chatbot.ts` los arma de `localBolivianElectricDataSource` ⇒ puede mostrar SKUs inventados tipo `PROD-CAB-001` | Código (quitar antes del go-live público) |
| Panel/CRM | **Mayormente mock**: `lib/mock-data.ts` = 1.737 líneas | Solo el carril del bot tiene datos reales |
| **Autenticación** | **No existe.** `app/login/page.tsx` es demo; el rol es una cookie (`lib/demo-role.ts`) | Bloqueante para cualquier venta multi-usuario |
| Correo | No existe (sin Resend/SMTP en `package.json`) | Credencial |
| Llamadas de voz | **0% construido** (solo 2 docs de arquitectura) | Track aparte: Pipecat + WhatsApp Calling API |

**Advertencia de doc obsoleto:** `docs/product/plantillas-meta-pendientes.md` dice que `whatsapp-template-catalog.test.ts` y `proactive-template-send.test.ts` "todavía no están en `npm run validate`". **Ya lo están** (`test:templatecatalog`, `test:proactivetemplate` en `package.json`).

---

## 3. Genérico vs específico de Bolivian Electric

### GENÉRICO — se lleva casi tal cual a otro cliente
| Pieza | Archivo | Por qué es reusable |
|---|---|---|
| Orquestador del webhook | `lib/chatwoot-webhook.ts` | La lógica es agnóstica; lo que hay que inyectar es config (ver abajo). Toda dependencia externa ya es **inyectable** (persisters, lookups, opt-in store) |
| Matcher IDF + modismos | `lib/product-matching.ts` | Puro. Solo el diccionario `SYNONYMS` y `WIRE_TYPE_CODES` son del rubro eléctrico |
| Guardrails deterministas | `lib/reply-guardrails.ts` | Regla universal de bot comercial: nunca afirmar stock/precio |
| Ruteo de leads | `lib/seller-router.ts` | Sticky + pool por ciudad + peso + fallback. Puro, `rng` inyectable |
| Lead scoring + captura | `lib/lead-scoring.ts`, `lib/lead-capture.ts` | Slots comunes a cualquier B2B (los rubros VIP están en el prompt, no en el código) |
| Handoff humano | `lib/chatwoot-read.ts` | 100% genérico |
| Opt-in + plantillas HSM | `lib/customer-opt-in.ts`, `whatsapp-template-catalog.ts`, `proactive-template-send.ts` | Es cumplimiento de política Meta: idéntico para todos |
| Motor de seguimiento | `lib/follow-up-scheduler.ts` | Puro; la cadencia 2/5/15 debería ser parámetro |
| Aprendizaje de sinónimos | `lib/learned-synonyms*.ts` + `api/learn/*` | Genérico y es un **diferenciador de venta** |
| Analítica de demanda | `lib/be-demand*.ts` | Genérico salvo el prefijo `be_` |
| Importador flexible | `lib/catalog-import.ts` | Ya diseñado para "cualquier export de ERP" |
| Infra | `infra/vps/*`, `infra/sql/*` | Patrón de despliegue completo |
| Seguridad/robustez | `lib/safe-fetch.ts`, `lib/message-dedup.ts`, `lib/internal-auth.ts`, `lib/learn-auth.ts` | Transversales |
| Panel `/probador-bot`, `/bot-config` | `app/probador-bot`, `app/bot-config` | **Alto valor comercial**: transparencia total de qué sabe y qué responde el bot |

### ESPECÍFICO — hay que parametrizar
| Qué | Dónde está hardcodeado | Cómo debería quedar |
|---|---|---|
| **3 ciudades SCZ/CBBA/LPZ** | `be-catalog-adapter.ts` (`CITY_LABELS`, `CITY_ALIASES`, `CITY_COLUMNS`), stopwords en `product-matching.ts`, columnas `avail_*`/`stock_*` en `catalog_products.sql` | El modelo de "sedes" está **cocido en el esquema**. Debe ser `locations[]` (tabla) + stock por location, no 3 columnas |
| Layout del export ERP | `be-catalog-adapter.ts` (`NOMBRE NV1/NV3`, 11 bodegas) | Config de mapeo por cliente (`catalog-import.ts` ya lo hace mejor) |
| Horario L-V 8:30-17:30 / Sáb / UTC-4 | `business-hours.ts` | Config por tenant (schedule + timezone) |
| Roster de vendedores + pesos | `seller-roster.ts` | Tabla, no constante |
| Jefes de sucursal (4 nombres reales) | `branch-managers.ts` | Tabla |
| 6 FAQs con textos aprobados | `faq.ts` | Tabla/CMS editable por el cliente |
| Identidad "Bolivian Electric" | `openai-client.ts` (prompts), `follow-up-scheduler.ts` (`ASESOR_FALLBACK`), `whatsapp-template-catalog.ts`, `opt-in-prompt.ts` | Config de marca/tono |
| Rubros VIP (montaje, tableristas, petroleros, ingenios) | prompt de `classifyLeadWithOpenAI` | Config por vertical |
| Labels `be_*` | `chatwoot-webhook.ts` | Prefijo por tenant |
| Bolivia: teléfono 8 dígitos | `seller-router.normalizePhone`, `be-customers.normalizeCustomerPhone` | Config de país |
| Convención "sin tildes, sin ¿" | Todo el repo | Config de estilo |

**Medida objetiva:** 88 ocurrencias de `Bolivian Electric` / `be-` / `BE_` en 30 archivos de `apps/web/lib` (excluyendo tests).

---

## 4. Qué falta para productizarlo

### 4.1 Multi-tenant — **cero avance, es el trabajo grande**
- No hay `tenant_id` en **ninguna** tabla de `infra/sql/`. `catalog_products` tiene `sku` como PK global.
- La config vive en **variables de entorno de proceso** (`getChatwootIntegrationConfig(process.env)`), es decir **un contenedor por cliente**.
- El catálogo es un **singleton en memoria del proceso** (`catalog-store.ts` + `WeakMap` del índice). Multi-tenant en un proceso exige un store por tenant (y repensar la memoización).
- Camino realista y honesto: **el modelo actual es "un deploy por cliente"**, y funciona. Es defendible venderlo así (aislamiento = argumento comercial) mientras haya <10 clientes; el costo es operativo (N contenedores, N env files, N migraciones a mano).

### 4.2 Configuración por cliente
Hoy: env vars + constantes en TypeScript. Falta una tabla `tenant_config` (o un `client.json` versionado) con: marca/tono, horarios+TZ, ciudades/sedes, FAQs, roster, jefes, cadencia de seguimiento, diccionario de sinónimos semilla, guardrails del rubro, plantillas HSM. La página `/bot-config` **ya muestra** todo esto — falta hacerla **editable** (hoy es solo lectura).

### 4.3 Onboarding de cliente — no existe
Falta un runbook/CLI de "cliente nuevo en N pasos": crear WABA/inbox Chatwoot → crear DB + correr las 8 migraciones → importar catálogo (`catalog:load` + `catalog:sync-db`) → importar directorio de clientes → sembrar config → deploy → validar en canal de prueba. Los pedazos existen sueltos en `docs/operations/*.md` (`whatsapp-chatbot-activation-runbook.md`, `client-dedicated-automation-runbook.md`, `data-transfer-runbook.md`) pero **no hay un script**.

### 4.4 Autenticación y facturación — **no existen**
- Auth: `app/login/page.tsx` es una demo; el rol es la cookie `bolivian-electric-demo-role`. Bloqueante duro para vender el panel.
- Facturación/planes/medidor de consumo: **nada**. No hay conteo de mensajes, ni límites, ni cobro. Los costos variables reales (OpenAI + conversaciones Meta) no se miden.

### 4.5 Observabilidad
Diagnosticada en `go-live-chatbot.md` pero **no implementada**: falta un `/health` que reporte tamaño del catálogo, estado DB y flags. Sin eso, "desplegado" ≠ "funciona" (el bug real: catálogo vacío ⇒ matcher degrada a no-op **en silencio**).

---

## 5. Cruce con `onia-core`

`C:\dev\proyectos\onia-hermes\onia-core\contract.json` — **v1.0.0, `status: stable`**, 18 entidades, 21 capabilities, 9 módulos activables.

### Módulos que servirían
| Módulo | Archivo | Entidades | Aplicación al chatbot |
|---|---|---|---|
| **commerce** | `modules/commerce.json` + `.schema.sql` | Product, ProductVariant, **Warehouse**, **StockItem**, StockMovement, PriceList, Quote, QuoteLine, Order, Payment | **Reemplaza `catalog_products`** y resuelve el problema de las 3 ciudades hardcodeadas: `Warehouse` + `StockItem` es el modelo N-sedes correcto |
| **agents** | `modules/agents.json` | Agent, AgentRun, AgentAction | Modela el bot como agente con `autonomyLevel` (suggest/semi_auto/auto), `ownerId` y ruteo a `approval_request`. **Es exactamente la política que el bot implementa a mano** (dry-run / respuesta pública OFF / pausa ante humano) |
| **knowledge** | `modules/knowledge.json` | KnowledgeCategory, KnowledgeArticle | Reemplaza el `FAQS[]` hardcodeado por contenido editable por el cliente |
| **automation** | `modules/automation.json` | AutomationRule, **MessageTemplate**, **MessageDispatch** | Reemplaza `whatsapp-template-catalog.ts` (constante) por plantillas en DB + traza de envíos. La cadencia 2/5/15 pasa a `AutomationRule` |

Entidades del core directamente aplicables: `Organization` (tenant_id que falta), `Member` (vendedores), `Area` (sucursales), `Contact`/`BusinessPartner` (directorio), `WorkItem` (leads/cotizaciones), `CommunicationChannel` (inbox WhatsApp), `ApprovalRequest` (human-in-the-loop).

### La realidad del cruce (honesto)
- `onia-core/adapters/bolivian-electric.json` existe, declara `vertical: PROVEEGEST`, `verticalTrackId: proveegest-electrico`, **`status: "installing"`**, y describe el stack como *"Next 16 + Postgres self-hosted + **Kysely** + **Better Auth**"*.
- **En el repo de BE hay CERO código de onia-core**: `grep -rn "onia_core\|onia-core"` en `apps/`, `infra/`, `scripts/` → **0 resultados**. Tampoco hay Kysely ni Better Auth en ningún `package.json` (usa `pg` crudo + mock-data + cookie de rol).
- El propio contrato lo bloquea: `policy.installInProductRepos = false`, y el track `proveegest-electrico` está `planned_after_core`.
- **Conclusión:** el adapter describe una **intención**, no un estado. El "status: installing" y el stack declarado están **desalineados con el repo real** — vale corregir el adapter o el plan.

**Recomendación:** no reescribir el bot sobre el core. El core aporta el **modelo de datos multi-tenant** que al bot le falta (`Organization` + `Warehouse/StockItem` + `MessageTemplate/Dispatch` + `Agent`). El bot aporta al core el **motor conversacional que el core explícitamente NO tiene** (todo lo de canal/LLM es `external_gate`). Encajan como piezas complementarias, no como refactor.

---

## 6. Lectura comercial — qué es vendible ya

**El activo real:** un motor de WhatsApp comercial que **no alucina**. Eso no es el LLM — es la capa de honestidad: matcher con IDF + `unmetSpecTokens`, `availability-reply` grounded, `reply-guardrails` determinista, la prioridad "grounded gana sobre IA". Está probado sobre 12.385 SKUs reales y es lo que un competidor con "GPT + prompt" no tiene.

**Segundo activo, subestimado:** `/probador-bot` + `/bot-config`. Poder mostrarle al cliente exactamente qué responde el bot antes de encenderlo es argumento de cierre, no una feature técnica.

**Camino más corto a segundo cliente (sin refactor):** clonar el repo, cambiar ~10 archivos de config (los de la tabla de §3), nuevo contenedor + nueva DB. **Sirve solo si el rubro tiene catálogo con SKUs y sedes.** Para un rubro sin catálogo (servicios, clínicas) hay que sacar el matcher del camino crítico — el orquestador no está diseñado para eso hoy (`availabilityReply` es central en la prioridad de respuesta).

**Antes de vender a nadie más, 3 cosas obligatorias:** (1) auth real, (2) `CHATWOOT_WEBHOOK_SECRET` seteado, (3) `/health` que reporte si el catálogo cargó.

---

## 7. Rutas absolutas de referencia

- Worktree con el avance: `C:\dev\clientes\Bolivian Electric\.claude\worktrees\bolivian-electric-chatbot-1e39da\`
- Repo main (atrasado 43 commits): `C:\dev\clientes\Bolivian Electric\`
- Instrucciones de proyecto: `C:\dev\clientes\Bolivian Electric\.claude\worktrees\bolivian-electric-chatbot-1e39da\CLAUDE.md`
- Planes leídos: `docs\product\plan-ejecucion-bot.md`, `docs\product\go-live-chatbot.md`, `docs\product\plan-mensajeria-bot.md`, `docs\product\plantillas-meta-pendientes.md`, `docs\product\handoff-siguiente-sesion.md`, `docs\product\roadmap-funciones.md`, `docs\product\pricing-and-packages.md`, `docs\technical\extension-strategy.md`, `docs\technical\whatsapp-chatbot-architecture.md`
- Core: `C:\dev\proyectos\onia-hermes\onia-core\contract.json`, `...\modules\{agents,commerce,knowledge,automation}.json`, `...\adapters\bolivian-electric.json`