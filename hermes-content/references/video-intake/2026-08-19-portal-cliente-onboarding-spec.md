# El portal de onboarding de cliente — reconstrucción y spec

- **Video:** https://www.instagram.com/reel/DcJQRi7NPvw/ · 38,8 s · 360×640
- **Reconstrucción tipo SaaS** (la nueva, de [METODO_DE_ANALISIS.md](METODO_DE_ANALISIS.md)):
  entidades + máquina de estados, no "tiene un panel lindo".
- **Cobertura real:** audio 100% ([verbatim](transcripciones/Instagram-DcJQRi7NPvw.txt)) ·
  **4 de 13 fotogramas leídos**. **Sin análisis por escenas**: el MCP de Higgsfield estaba
  desconectado en el momento de correr esto.
- **Sergio: *"es justo cosas que estamos desarrollando"*.**
- **Veredicto: SIRVE YA — y ataca un costo que pagamos todas las semanas**

---

# 1 · El problema que nombra, textual

> *"Perseguir a un cliente para que te mande sus credenciales y documentos es de las tareas que
> más tiempo roba a un equipo. Nosotros dejamos que eso pase solo. Dentro de la plataforma el
> cliente sube su documentación, firma el contrato o da acceso a las herramientas que
> necesitamos. Y **cada una de esas acciones dispara una notificación automática clasificada
> directamente en su perfil**. El equipo asignado a ese cliente recibe la alerta exacta de que se
> completó, **sin tener que revisar carpetas sueltas ni preguntar por WhatsApp** si ya se envió
> algo."*

Ese es nuestro problema, palabra por palabra. Cada web de cliente necesita logo, textos, fotos,
acceso al dominio, acceso a las redes — y hoy eso se persigue por WhatsApp.

Y engancha con una regla que ya está escrita en `CLAUDE.md`: *"No fabricar. Si falta dato del
cliente (brochure, sector), no inventar — pedirlo o marcarlo."* **Esto es la máquina que hace el
"pedirlo".**

# 2 · Qué es, leído de la pantalla

Se llama **K100**. Son **dos aplicaciones sobre la misma base**:

**Lado cliente** — menú: `Inicio · Estado del proyecto · Cuestionario · Documentación ·
Credenciales · Tutoriales · Reportes`

**Lado admin** — menú: `Dashboard · Leads · Pipeline · Clientes · Revisiones pendientes ·
Tareas · Módulos · Tutoriales · Credenciales · Onboarding`, y dentro de un cliente las pestañas
`Info general · Credenciales · Documentación · Hitos · Notas · Entregables · Comunicaciones ·
Financiero`.

Tres pantallas concretas que se ven:

| Pantalla | Qué muestra |
|---|---|
| **Cuestionario Maestro** | *"Preguntas específicas sobre tu operativa, tu equipo y tu método. Tarda entre 45 y 60 minutos. **Se guarda automáticamente si necesitás hacerlo en varias sesiones**."* |
| **Estado del proyecto** | fases numeradas con badge de estado — se ven la **5 · Activos IA** y la **6 · Hand-off**, ambas `PENDIENTE`. A la derecha, un feed: *"**HITO COMPLETADO** — Cliente marcó el Cuestionario Maestro como realizado"* con fecha y hora, repetido |
| **Credenciales (admin)** | *"Todas las credenciales de este cliente, agrupadas por plataforma"*: **Google** → Google Workspace (`CONTRASEÑA`) · **Meta** → Meta Business (`TOKEN`) · **Stripe** → Stripe API (`API KEY`). Cada una con botón **"Mostrar valor"** |
| **Eventos (admin)** | *"Historial de eventos: registrá manualmente lo que va sucediendo en el proyecto"* — formulario con Tipo, Fecha, Descripción y botón "Registrar evento" |

# 3 · La reconstrucción: entidades y máquina de estados

Esto es lo que se copia. El resto es interfaz.

## Entidades

| Entidad | Campos que se ven | Nota |
|---|---|---|
| `cliente` | nombre (Aurora Studio), equipo asignado | |
| `proyecto` | fases ordenadas | uno por cliente |
| `fase` | número, título, descripción, **estado** | vistas: 5 Activos IA, 6 Hand-off |
| **`requerimiento`** | tipo, título, descripción, estado, vencimiento | **es la entidad central** — ver abajo |
| `credencial` | plataforma, tipo (contraseña/token/api key), valor, notas | ⚠️ ver la sección de seguridad |
| `documento` | archivo, tipo, subido por, fecha | |
| `cuestionario` / `respuesta` | preguntas, respuestas, **autoguardado**, % completado | 45-60 min, varias sesiones |
| `evento` | tipo, fecha, descripción, actor, visible-para-cliente | automático **y** manual |
| `entregable`, `comunicación`, `financiero` | pestañas del admin, no se ven por dentro | |

## La máquina de estados — el corazón

Todo lo que se le pide al cliente es **un `requerimiento`**, sin importar si es un documento, una
credencial, una firma o un cuestionario. Y todos recorren la misma máquina:

```
PENDIENTE ──(el cliente lo entrega)──> ENTREGADO ──(el equipo lo mira)──> EN_REVISION
                                                                            │
                                            ┌───────────────────────────────┤
                                            ▼                               ▼
                                        ACEPTADO                        RECHAZADO
                                                                            │
                                            └──(con motivo)──> PENDIENTE ◄──┘
```

**Cada transición escribe un `evento` y dispara una notificación al equipo asignado.** Eso es lo
único que hay que construir bien; todo lo demás es pantalla.

**Y una fase se completa sola** cuando todos sus requerimientos están en `ACEPTADO`. Nadie marca
nada a mano. Ese es el ahorro real de las 150 h.

## Los cuatro tipos de requerimiento

| Tipo | Qué entrega el cliente | Cómo se acepta |
|---|---|---|
| `documento` | sube un archivo | el equipo lo revisa |
| `respuesta` | contesta el cuestionario | automático al llegar al 100% |
| `firma` | firma el contrato | automático al firmar |
| `acceso` | da acceso a una herramienta | **el equipo confirma que el acceso funciona** — nunca automático |

---

# 4 · ⚠️ Seguridad — dónde el video se equivoca para nosotros

**K100 guarda contraseñas, tokens y API keys de terceros, con un botón "Mostrar valor".** No es
un detalle de UI: es la decisión más riesgosa del producto.

Un portal de agencia con las credenciales de Google, Meta y Stripe de **N clientes** vale más
para un atacante que cualquiera de esos clientes por separado. Y el botón "Mostrar valor"
implica que están guardadas de forma **reversible** — cifradas, no hasheadas — porque hay que
poder recuperar el valor.

## La regla para nosotros: acceso delegado, no credencial guardada

| Lo que hace falta | Lo que parece hacer K100 | Lo que hacemos nosotros |
|---|---|---|
| Google Workspace | guarda la contraseña | el cliente **nos agrega como usuario/admin** de su Workspace |
| Meta Business | guarda el token | el cliente **nos asigna como socio** en su Business Manager; el token lo emite Meta a nuestro nombre |
| Stripe | guarda la API key | **Stripe Connect**, o el cliente nos suma como *team member* de su cuenta |
| Hosting / dominio | guarda la contraseña | **a nombre del cliente** — ya es regla en `CLAUDE.md` — con acceso delegado |
| Redes sociales | guarda la contraseña | Business Manager / cuentas profesionales con roles |

**El acceso delegado se revoca de un clic y no nos hace responsables de la contraseña de nadie.**
La regla del dominio que ya tenemos escrita es la misma idea, extendida.

## Cuando de verdad no hay alternativa

Existen: un panel viejo sin usuarios múltiples, un proveedor local sin roles, un banco. Para
esos, y **solo** para esos:

- **Cifrado con la clave fuera de la base.** Si la clave vive en la misma base, no está cifrado.
- **Nunca en logs, nunca en la respuesta de la API por defecto.** El valor se devuelve en un
  endpoint aparte, no en el `GET` del cliente.
- **"Mostrar valor" es una acción auditada**: queda quién, cuándo y qué credencial. Y el cliente
  puede ver ese registro.
- **RLS por cliente**: sólo el equipo asignado. Verificado en la base, no en el front.
- **Caducidad**: al cerrar el proyecto se le pide al cliente que rote lo que nos dio.
- **Tarjetas: NUNCA.** Ni número, ni CVV, ni con cifrado. Eso es PCI-DSS y ya es regla nuestra.

## Y lo demás del checklist que aplica igual

Subida de archivos con tope de tamaño y lista blanca de tipos y extensiones · validación con Zod
en el borde · RLS activo en todas las tablas nuevas · rate limit en el endpoint de subida ·
errores genéricos para el cliente y detalle solo en el log del servidor.

---

# 5 · Cómo hacerlo — cuatro fases, el riesgo al final

El orden importa: **el 80% del ahorro de tiempo está en la fase 1 y no toca ninguna credencial.**

| Fase | Qué se construye | Riesgo | Qué destraba |
|---|---|---|---|
| **1** | `requerimiento` + su máquina de estados + subida de documentos + cuestionario con autoguardado | bajo | deja de perseguirse por WhatsApp |
| **2** | `evento` + notificación al equipo asignado + la fase que se cierra sola | bajo | es lo que el video vende, y es lo que ahorra las horas |
| **3** | **accesos delegados**: un instructivo por plataforma, con checklist de verificación | bajo | reemplaza el 90% de las credenciales |
| **4** | bóveda de credenciales, solo para lo que no se puede delegar, con todo lo de arriba | **alto** | lo último, y solo si hace falta |

**Si la fase 4 nunca se construye, el sistema igual sirve.** Eso es una señal de que el orden
está bien.

# 6 · Qué de esto ya tenemos

**No verificado — es lo primero que hay que hacer y está puesto como paso 1 del prompt.** Lo que
sé por contexto y hay que confirmar contra el repo:

- ONIA Core tiene entidades y *work items* con máquina de estados → **`requerimiento` podría ser
  un work item, no una tabla nueva.**
- El producto tiene un asistente `/setup` y un intake vivo en el pack dental.
- ONIA Center tiene pipeline de leads con atribución `?src=`.
- Hay cola de aprobación para los agentes — el patrón *entregado → en revisión → aceptado* ya
  existe ahí.
- Chatwoot corre en el VPS para mensajería.

**Si el core ya tiene la máquina de estados, esto es encender, no construir.** Que es exactamente
lo que dice `CLAUDE.md`: *"un rubro nuevo debe salir de ENCENDER capacidades del core, no de
escribir código nuevo."*

# 7 · A dónde va

| Sesión | Prompt |
|---|---|
| **`onia-plattform`** | **I1** — el módulo de onboarding: entidades, máquina de estados, eventos |
| **`web-factory`** | **I2** — usarlo primero para nosotros, con la lista real de lo que se le pide a un cliente de web |
| **`propuestas`** | sin prompt propio: el Cuestionario Maestro **es** el brief. Cuando I1 exista, el generador de propuestas se alimenta de ahí en vez de pedir los datos aparte |
