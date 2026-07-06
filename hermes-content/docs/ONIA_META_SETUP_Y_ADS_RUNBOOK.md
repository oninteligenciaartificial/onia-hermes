# ONIA — Runbook de configuración Meta + motor de Ads

> **Estado:** listo para que **Sergio** arranque la parte manual **hoy**.
> **Dueño de código:** sesión `meta-ads` (carpeta `hermes-content/integrations/meta/`).
> **Regla de oro:** este sistema **NO gasta un peso**. Arma campañas en **borrador
> (PAUSED)**. Activar una campaña o poner presupuesto **requiere aprobación
> explícita de Sergio** (ver §7, Freno de gasto).
> **Secretos:** el token va al `.env` server-side del VPS **o** como credencial
> Header Auth de n8n. **Nunca** hardcodeado, **nunca** `$env` en Code nodes de
> n8n, **nunca** en git ni en chat.

Este mismo trámite (verificación del negocio + token de System User del mismo
Business) **desbloquea también WhatsApp Business API** (ver §8). Se hace una vez.

---

## Convención de marcas

- **[HACE SERGIO]** → paso manual en la UI de Meta (Business Manager / Events
  Manager / developers.facebook.com). No lo puede hacer el código.
- **[QUEDA EN CODIGO]** → ya resuelto (o se resuelve) en
  `hermes-content/integrations/meta/`. Sergio no toca nada.
- **[DEVOLVER]** → dato que Sergio copia y me/nos entrega (ver §6 dónde va).

> Nota: la UI de Meta cambia etiquetas seguido. Uso los nombres estables
> ("Configuración del negocio", "System Users", "Events Manager"). Si una
> etiqueta difiere, es la misma función.

---

## §0 — Lo que vamos a obtener (checklist de datos)

Al terminar el runbook tenemos estos 8 valores. Ninguno se pega en chat ni en git.

| # | Dato | Ejemplo de forma | Secreto | Se usa para |
|---|------|------------------|---------|-------------|
| 1 | **Business ID** | `123456789012345` | no (id) | scope de assets, WhatsApp |
| 2 | **Ad Account ID** | `act_1234567890` | no (id) | crear campañas/adsets/ads |
| 3 | **App ID** | `1234567890123456` | no (id) | identifica la Meta App |
| 4 | **App Secret** | `a1b2c3…` (32 hex) | **SÍ** | firmar llamadas / appsecret_proof |
| 5 | **System User token** | `EAAG…` (largo) | **SÍ** | autoriza Marketing API (long-lived) |
| 6 | **Pixel ID** (= Dataset ID) | `1234567890123456` | no (público) | Pixel en landing + CAPI |
| 7 | **CAPI token** | `EAAG…` (largo) | **SÍ** | eventos server-side (Conversions API) |
| 8 | **API version** | `v21.0` (o la vigente) | no | versionar el endpoint |

Dónde se guarda cada uno: **§6**.

---

## §1 — [HACE SERGIO] Verificar el negocio ONIA

> Este es el paso que más tarda (Meta revisa documentos) y el que **desbloquea
> todo lo demás, incluido WhatsApp**. Empezalo primero: mientras Meta revisa,
> seguís con los otros pasos.

1. Entrá a **business.facebook.com** con la cuenta de Meta de ONIA.
2. Si no existe, creá el **Business Portfolio** (Portafolio comercial): nombre
   legal **ONIA**, tu email de trabajo, datos del negocio.
3. **Configuración del negocio** (Business Settings) → **Centro de seguridad**
   (Security Center) → **Verificación del negocio** (Business verification).
4. Cargá los documentos que pida Meta (registro / NIT, comprobante de domicilio
   o factura de servicio a nombre del negocio, teléfono verificable).
5. Enviá y esperá el estado **"Verificado"**. Puede tardar de horas a días.

- **[DEVOLVER] Business ID** → está en Configuración del negocio → Información
  del negocio (Business Info), campo "ID del negocio".

**Desbloquea:** verificación → permite ads a escala, la Marketing API sin
límites de sandbox, y WhatsApp Business API.

---

## §2 — [HACE SERGIO] Cuenta publicitaria (Ad Account)

1. **Configuración del negocio** → **Cuentas** → **Cuentas publicitarias**.
2. Si ya existe una, confirmala. Si no: **Agregar** → **Crear una cuenta
   publicitaria nueva**.
   - **Nombre:** `ONIA Ads`.
   - **Zona horaria:** `America/La_Paz` (¡no se puede cambiar después!).
   - **Moneda:** `USD` (recomendado para comparables) o `BOB`. Fija también.
3. Asignate a vos (y al System User del §4) con permiso **Administrar cuenta
   publicitaria** (Manage).
4. **Método de pago:** **NO lo agregues todavía.** Sin método de pago, Meta
   **no puede cobrar** — es un freno de gasto físico extra. Los borradores
   (PAUSED) no requieren método de pago. Se agrega recién cuando aprobemos
   activar la primera campaña real.

- **[DEVOLVER] Ad Account ID** → arriba de la cuenta, formato `act_1234567890`.
  (En algunas vistas aparece sin el prefijo `act_`; guardamos con `act_`.)

---

## §3 — [HACE SERGIO] Crear la Meta App con Marketing API

1. Entrá a **developers.facebook.com** → **Mis Apps** → **Crear app**.
2. Tipo: **Empresa/Negocio** (Business). Vinculá la app al **Business Portfolio
   ONIA** (el del §1).
3. Nombre de la app: `ONIA Marketing`.
4. Dentro de la app → **Agregar producto** → **Marketing API** → Configurar.
   - (Más adelante, en la misma app, se agrega el producto **WhatsApp** — §8.)
5. **Configuración → Básica** (Settings → Basic):
   - **[DEVOLVER] App ID**.
   - **[DEVOLVER] App Secret** (click en "Mostrar"). **Es secreto.**

> No hace falta pasar App Review para llamar la Marketing API con un **System
> User token** sobre **tus propios** assets (tu Ad Account, tu Pixel). App Review
> recién se necesita si operáramos activos de terceros.

---

## §4 — [HACE SERGIO] System User + token long-lived

> Un **System User token** es el correcto para automatización: **no expira** por
> tiempo (sí se revoca si cambiás la contraseña del System User o lo revocás a
> mano). Evitamos tokens de usuario de 60 días.

1. **Configuración del negocio** → **Usuarios** → **Usuarios del sistema**
   (System Users) → **Agregar**.
   - Nombre: `onia-ads-bot`. Rol: **Administrador** (o Empleado con acceso a los
     assets de abajo).
2. **Asignar activos** (Assign assets) al system user:
   - La **Cuenta publicitaria** `ONIA Ads` → permiso **Administrar** (Manage).
   - La **App** `ONIA Marketing` → **Administrar/Desarrollar**.
   - El **Pixel/Dataset** `ONIA Web` (lo creás en §5) → **Administrar**.
3. **Generar nuevo token** (Generate new token):
   - App: `ONIA Marketing`.
   - **Permisos (scopes):**
     - `ads_management`
     - `ads_read`
     - `business_management`
     - (para WhatsApp, agregá ya: `whatsapp_business_management`,
       `whatsapp_business_messaging`)
4. Copiá el token **en el momento** (Meta lo muestra una sola vez).

- **[DEVOLVER] System User token** (dato #5). **Es secreto.**

---

## §5 — [HACE SERGIO] Pixel + Conversions API (CAPI)

1. **Events Manager** (Administrador de eventos:
   business.facebook.com/events_manager).
2. **Conectar orígenes de datos** → **Web** → **Crear**. Nombre: `ONIA Web`.
   - Esto crea un **Pixel** (su ID = **Dataset ID**).
   - **[DEVOLVER] Pixel ID** (dato #6). **No es secreto** (va en el HTML de la
     landing).
3. Método de instalación: elegí **"Instalar el código manualmente"**. El código
   base del Pixel **[QUEDA EN CODIGO]** — lo entregamos listo en
   `hermes-content/integrations/meta/` (ver §9) para que la sesión de landings lo
   pegue. No lo escribas a mano.
4. **Conversions API (server-side):** en el dataset `ONIA Web` →
   **Configuración** → **API de conversiones** → **Generar token de acceso**.
   - **[DEVOLVER] CAPI token** (dato #7). **Es secreto** (solo server-side).

**Por qué Pixel + CAPI juntos:** el Pixel (navegador) se pierde con
bloqueadores/ITP; la CAPI (servidor) recupera esos eventos. Se **deduplican** con
un `event_id` compartido — eso ya está resuelto en el código (§9).

---

## §6 — Dónde se guardan los datos [QUEDA EN CODIGO / INFRA]

**Regla:** los 4 secretos (App Secret, System User token, CAPI token) **solo**
server-side. Los ids no son secretos pero igual no se pegan en chat.

### 6.1 `.env` server-side del VPS — `/root/.hermes/.env`

```env
META_API_VERSION=v21.0
META_BUSINESS_ID=123456789012345
META_AD_ACCOUNT_ID=act_1234567890
META_APP_ID=1234567890123456
META_APP_SECRET=__secreto__
META_SYSTEM_USER_TOKEN=__secreto_largo__
META_PIXEL_ID=1234567890123456
META_CAPI_TOKEN=__secreto_largo__
```

El módulo `hermes-content/integrations/meta/` lee **solo** de `process.env`
(nunca hardcodea). Ver `src/config.js` y `.env.example`.

### 6.2 n8n (plan VPS) — credencial Header Auth

- Crear en n8n → **Credentials** → **Header Auth**:
  - Name: `Meta Marketing API`
  - Header Name: `Authorization`
  - Header Value: `Bearer <META_SYSTEM_USER_TOKEN>`
- En los nodos HTTP Request usar `authentication: predefinedCredentialType` →
  `httpHeaderAuth`. **Nunca** `$env` en Code nodes (no existe en este plan).

### 6.3 Cliente (landing, público)

- Solo el **Pixel ID** va client-side, como `NEXT_PUBLIC_META_PIXEL_ID` en el
  entorno de la landing. **El CAPI token NO** (server-side siempre).

### 6.4 Cómo devolver los valores (sin filtrarlos)

1. **Preferido:** Sergio (o la sesión infra `infra-deploy-n8n`) los pega
   directo en `/root/.hermes/.env` del VPS por SSH y reinicia el servicio.
2. Y crea la credencial Header Auth en n8n con el token.
3. **Nunca** los pegues en este chat, en un doc, ni en un commit. Si por error se
   pegan en algún lado → **rotarlos** (regenerar token / app secret) de una.

> Antecedente real (COORDINATION_MANIFEST §Security notes): "VPS password and
> Meta token were pasted in chat and must be rotated." No repetir.

---

## §7 — Freno de gasto (borrador → aprobación → activa)

Mismo patrón que el Agente Vendedor (borrador → Sergio aprueba → activa). En tres
capas, cualquiera de ellas frena el gasto sola:

1. **Código:** todo objeto se arma con `status: "PAUSED"`. Publicar/activar exige
   `{ live: true }` **y** una aprobación registrada (`approval.state === "approved"`
   con `approver: "sergio"`). Sin eso, el cliente **lanza error**, no llama a
   Meta. Ver `src/approval.js` y `src/client.js` (§9).
2. **Presupuesto:** cambiar/subir presupuesto o pasar a `ACTIVE` es una acción de
   la **cola de aprobación**. Se encola como propuesta; Sergio la aprueba
   explícitamente; recién ahí el sistema puede activar.
3. **Físico:** sin método de pago en la cuenta (§2.4), Meta no puede cobrar.

**Validar la estrategia con Sergio ANTES de cualquier gasto.** El sistema propone
campañas; Sergio decide.

---

## §8 — Qué desbloquea WhatsApp (mismo Business, mismo token)

- La **verificación del negocio** (§1) es el mismo gate para WhatsApp Business
  API.
- En la **misma Meta App** (§3), agregá el producto **WhatsApp**.
- El **System User token** (§4) con scopes `whatsapp_business_management` +
  `whatsapp_business_messaging` sirve para la WhatsApp Cloud API.
- Falta además: número de teléfono verificado + WABA (WhatsApp Business Account).
  Eso es un runbook aparte (fuera del alcance de `meta-ads`), pero el trámite
  pesado (verificación) ya queda hecho acá.

Referencia interna previa:
`hermes-content/docs/ONIA_WHATSAPP_CHATWOOT_META_SALES_AUDIT_2026.md`.

---

## §9 — Qué queda del lado del código (mapa)

| Entregable | Ubicación | Estado |
|-----------|-----------|--------|
| Cliente Marketing API (DRY) | `integrations/meta/src/client.js` | listo |
| Builders campaña/adset/ad/creativo | `integrations/meta/src/build.js` | listo |
| Validación de specs (sin deps) | `integrations/meta/src/schema.js` | listo |
| Mapeo creativo (content-engine) → ad | `integrations/meta/src/creative-map.js` | listo |
| Cola de aprobación / freno de gasto | `integrations/meta/src/approval.js` | listo |
| Generador de snippet Pixel + CAPI | `integrations/meta/src/pixel.js` | listo |
| `.env.example` (nombres de variables) | `integrations/meta/.env.example` | listo |
| Snippet Pixel para landings + instrucción | `integrations/meta/PIXEL_LANDING_HANDOFF.md` | listo |
| Handoff onia-center + infra | `hermes-content/integrations/meta/HANDOFF.md` | listo |

Tests: `node hermes-content/integrations/meta/test/all.test.js` (cero llamadas a
Meta, cero gasto).

---

## §10 — Checklist final para Sergio

- [ ] §1 Negocio ONIA **verificado** (o enviado a revisión). → Business ID
- [ ] §2 Ad Account `ONIA Ads` creada, zona horaria La Paz, **sin** método de
      pago. → Ad Account ID
- [ ] §3 Meta App `ONIA Marketing` con producto Marketing API. → App ID + App
      Secret
- [ ] §4 System User `onia-ads-bot` con assets asignados + token generado. →
      System User token
- [ ] §5 Dataset `ONIA Web` (Pixel) + token de CAPI. → Pixel ID + CAPI token
- [ ] §6 Los 8 valores cargados en `/root/.hermes/.env` + credencial Header Auth
      en n8n. **Nada en chat/git.**
- [ ] Avisar a la sesión `meta-ads` que están cargados → se corre el primer
      **dry-run** (arma una campaña de ejemplo en borrador, no publica).

Cuando esto esté, el motor puede **proponer** su primera campaña. Activar = otra
decisión, explícita, de Sergio.
