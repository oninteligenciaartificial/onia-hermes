# Onia — Checklist ejecutable: terminar Meta y enviar la verificación

**Fecha:** 2026-07-25 · **Portfolio:** `1451773736711697` ("OniaAgency") · **Estado:** Sin verificar
**Playbook completo (por qué de cada cosa):** `ONIA_META_Y_CHATBOT_PRODUCTO_20260725.md`

> Este doc es la lista de acciones. Se ejecuta de arriba hacia abajo, sin volver a investigar.
> Todo lo que dice **Sergio** requiere su login de Facebook: no lo puede hacer un agente.

---

## 0. Datos legales oficiales (fuente: certificado SEPREC, verificado hoy)

Copiar y pegar tal cual. **No reescribir, no "mejorar", no traducir.**

| Campo | Valor exacto |
|---|---|
| Denominación legal | `OniaAgency` (todo junto, sin espacio) |
| Matrícula de comercio / NIT | `5371375010` |
| Tipo de empresa | Empresa Unipersonal |
| Propietaria / representante legal | `MERCADO MORENO LESLIE` |
| Dirección | Calle Tulipanes Nro. 9, Zona Norte (entre Av. 6to Anillo y Calle Las Américas) |
| Ciudad / país | Santa Cruz de la Sierra, Bolivia |
| Teléfono del negocio | `+591 78491375` |
| Sitio web | `https://onia.com.bo` |
| Vigencia del certificado | hasta **31/08/2028** (no vencido → sirve como documento) |
| Objeto social | desarrollo web, automatización, marketing digital, software a medida, chatbots, IA para empresas, capacitación en IA, venta de software y servicios digitales |

Nota de contexto interno (no va a Meta): Sergio tiene 16 años y opera el día a día; la titular legal es Leslie. Por eso **Leslie es la representante legal en el formulario y el segundo admin del portfolio**.

---

## 1. Estado actual del portfolio (verificado en vivo hoy)

| Campo | Estado | Valor a cargar |
|---|---|---|
| Nombre del portfolio | ✅ **Hecho** — `OniaAgency` | — (ya coincide con el SEPREC) |
| Nombre legal del negocio | ❌ vacío ("Sin nombre") | `OniaAgency` |
| Dirección | ❌ vacía | Calle Tulipanes Nro. 9, Zona Norte, Santa Cruz de la Sierra, Bolivia |
| Teléfono | ❌ vacío | `+591 78491375` |
| Sitio web | ❌ vacío | `https://onia.com.bo` |
| Página principal del portfolio | ❌ "ninguna" | La Página `1140384625819526` (tras renombrarla) |
| Nombre de la Página de Facebook | ⚠️ es "Onia Marketing" | `ONIA · Sistemas con IA para tu negocio` |
| Email de contacto del portfolio | ⚠️ `oninteligenciaartificial@gmail.com` | email en dominio propio (`sergio@onia.com.bo`) |
| 2FA obligatorio | ⚠️ sin confirmar | activado |
| Segundo admin con control total | ❌ solo Sergio | Leslie (propietaria legal) |
| Estado de verificación | ⚠️ **Sin verificar** | enviado → verificado |

**Activos que NO se tocan:**
- Ad account `act_1073680778314945` — **no se puede mover entre portfolios** (regla dura de Meta). Por eso este portfolio es, definitivamente, **el comercial**.
- WABA `398983206624133` (Bolivian Electric) — vive bajo el portfolio del **cliente** (Bolivian Group SRL), no bajo el de Onia. **No consume los 2 números de Onia.** Verificado hoy.

---

## 2. Pasos que faltan (en orden, no saltear)

Ruta base: `business.facebook.com` → menú **Configuración del negocio** (⚙️). Los rótulos pueden variar levemente según el idioma/versión de la UI; el camino es el que se indica.

### Fase A — Completar la ficha del negocio (Sergio · ~20 min)

| # | Paso | Dónde exactamente | Valor |
|---|---|---|---|
| A1 | Cargar **nombre legal** | Configuración del negocio → **Información del negocio** → Editar → "Nombre legal del negocio" | `OniaAgency` |
| A2 | Cargar **dirección** | mismo formulario → Dirección | Calle Tulipanes Nro. 9, Zona Norte · Santa Cruz de la Sierra · Bolivia |
| A3 | Cargar **teléfono** | mismo formulario → Teléfono | `+591 78491375` |
| A4 | Cargar **sitio web** | mismo formulario → Sitio web | `https://onia.com.bo` |
| A5 | **Renombrar la Página** | Meta Business Suite → Configuración → Información de la página → Nombre (requiere *acceso de Facebook*, no *acceso por tareas*) | `ONIA · Sistemas con IA para tu negocio` |
| A6 | Fijar **Página principal** del portfolio | Configuración del negocio → Información del negocio → "Página principal" | la Página `1140384625819526` ya renombrada |

> ⚠️ **A5 y A6 van ANTES de enviar la verificación.** Editar datos del negocio después de verificar dispara re-verificación (hasta 14 días hábiles otra vez).

### Fase B — Seguridad, obligatoria antes de verificar (Sergio · ~40 min) → ver sección 3

| # | Paso | Dónde |
|---|---|---|
| B1 | Activar el **requisito de 2FA** | Configuración del negocio → **Centro de seguridad** → Autenticación en dos pasos → Requerir a todos |
| B2 | Agregar **segundo admin con control total** (Leslie) | Configuración del negocio → Usuarios → **Personas** → Agregar → invitar por email → **Control total** |
| B3 | Cambiar el **email de contacto** a dominio propio | Configuración del negocio → Información del negocio → Email de contacto |

### Fase C — Pre-vuelo del sitio (agente + Sergio valida · el MISMO día del envío)

| # | Paso | Dueño |
|---|---|---|
| C1 | `https://onia.com.bo` carga, es HTTPS, sin links rotos, con el nombre Onia visible | **agente** (código/deploy) |
| C2 | Abrir el sitio desde un celular sin sesión y confirmar que carga | **Sergio** |

Motivo: Meta rechaza textualmente por *"a website that fails to load, is not HTTPS compliant... or contains a link that leads to an error message"*.

### Fase D — Enviar la verificación (Sergio · ~1 hora) → ver sección 4

| # | Paso | Dónde |
|---|---|---|
| D1 | Tener el **certificado SEPREC en PDF/JPG legible**, no vencido | carpeta local |
| D2 | (opcional, refuerzo) Certificado NIT del SIN | carpeta local |
| D3 | Enviar el formulario | Configuración del negocio → **Centro de seguridad** → **Iniciar verificación** |
| D4 | Elegir método de confirmación: **verificación de dominio** (meta tag o registro DNS en `onia.com.bo`) | el agente pone el tag/DNS el mismo día |
| D5 | **No tocar ningún dato del negocio** hasta la resolución (hasta 14 días hábiles) | — |

### Fase E — Después del "verificado" → ver secciones 5 y 6

| # | Paso | Dueño |
|---|---|---|
| E1 | Confirmar en WhatsApp Manager que el cap de números subió de 2 a 20 | Sergio + agente valida por API |
| E2 | Crear el 2º y **último** portfolio: `ONIA Personas` | Sergio |
| E3 | Poblarlo con activos **nuevos**, creados ahí (nunca movidos) | Sergio |
| E4 | Colaboradores comerciales: acceso **parcial (Basic)** o **temporary access** (3-75 días), nunca control total del portfolio | Sergio |

---

## 3. Los 3 pasos de seguridad ANTES de verificar

No son opcionales ni "buenas prácticas": son literalmente el checklist con el que Meta decide si te restringe, y un revisor humano los ve.

### 3.1 — 2FA obligatorio para todo el portfolio
Meta, textual: *"two-factor authentication is a requirement for business portfolios that are 90 days or older"*. Y uno de los motivos documentados de restricción publicitaria es *"An advertiser doesn't meet our two-factor authentication requirements for account security."*

**Cómo:** Centro de seguridad → Autenticación en dos pasos → **Requerir a todos**.
Antes de activarlo, asegurar que Sergio y Leslie ya tengan 2FA en su cuenta personal de Facebook, o quedan bloqueados fuera del portfolio.

### 3.2 — Segundo administrador con control total: **Leslie**
Hoy, si Sergio pierde su cuenta de Facebook, Onia pierde el ad account, la Página y el camino a las WABA. Meta recomienda explícitamente tener más de un control total.

**Recomendado: Leslie (MERCADO MORENO LESLIE)** — es la propietaria legal en el SEPREC y la representante legal que va en el formulario. Que la titular legal también tenga control total del portfolio **es coherencia, no burocracia**: si Meta pide demostrar que quien administra representa al negocio, la titular ya está adentro.

**Cómo:** Configuración del negocio → Usuarios → Personas → Agregar → invitar por email → **Control total** → ella acepta desde su email.

### 3.3 — Email de contacto en dominio propio, no gmail
Meta, textual, en su propio Centro de seguridad: *"Bad actors often use public email domains... Remove users whose email addresses aren't related to your business."*

Hoy el portfolio está a nombre de `oninteligenciaartificial@gmail.com` → Meta lo marca como riesgo. Migrar a `sergio@onia.com.bo` (o el buzón que se elija en el dominio propio). El dominio ya existe (`onia.com.bo`), solo falta el buzón.

---

## 4. El formulario de verificación: qué poner en cada campo

**Prerrequisito:** tener **control total** del portfolio (Sergio ya lo tiene).
**Ruta:** Centro de seguridad → **Iniciar verificación**.
Si dice *"No apto para verificación"* (Ineligible), no se hace por ahí: Meta avisa por email o desde otra plataforma (ej. Commerce Manager).

### 4.1 Campos

| Campo del formulario | Qué poner |
|---|---|
| **Legal business name** / Nombre legal | `OniaAgency` — carácter por carácter, todo junto, sin espacio |
| **Business address** / Dirección | Calle Tulipanes Nro. 9, Zona Norte (entre Av. 6to Anillo y Calle Las Américas) · Santa Cruz de la Sierra · Bolivia |
| **Phone number** / Teléfono | `+591 78491375` — un número al que efectivamente se conteste (Meta puede llamar o mandar SMS) |
| **Website** / Sitio web | `https://onia.com.bo` |
| **Business ID / Tax ID / Número de identificación** | `5371375010` (matrícula de comercio = NIT) |
| **Legal representative / Representante** | `MERCADO MORENO LESLIE` |
| Búsqueda del registro | Si Meta no encuentra el negocio → *"My business isn't listed"* / *"None of these match"* → subir documentos |

### 4.2 Documento a subir

| Documento | Rol | Categoría de Meta |
|---|---|---|
| **Certificado de Matrícula de Comercio (SEPREC)** | ✅ **el principal** | *Business Registration or License Document* |
| Certificado de Inscripción al Padrón (NIT, emitido por el SIN) | refuerzo opcional | *Government Issued Business Tax Document* |
| Factura de luz/agua a nombre del negocio | solo sirve para **dirección y teléfono**, nunca para el nombre legal | *Utility Bill* |
| Formulario 200 / declaración jurada propia | ❌ **rechazado**: *"Self-filed tax documents are not accepted"* | — |

**Idioma:** el español está en la lista de idiomas soportados por Meta. **No hace falta traducción ni sello de traductora.**

### 4.3 Método de confirmación
Elegir **verificación de dominio** (meta tag en el `<head>` de `onia.com.bo` o registro DNS TXT). Es la única que controlamos al 100%; no depende de que llegue un SMS a Bolivia. El agente carga el tag/registro el mismo día.

### 4.4 Motivos de rechazo documentados — chequear los 6 antes de apretar enviar

1. ❑ **Nombre legal idéntico al SEPREC**, carácter por carácter → `OniaAgency`, junto, sin espacio. Nada de "ONIA", "Onia Agency" ni "ONIA S.R.L.".
2. ❑ **Dirección exacta del certificado**, no la dirección donde se trabaja hoy si no coincide con el papel.
3. ❑ **Teléfono contestable** (`+591 78491375`).
4. ❑ **Sitio web arriba, HTTPS, sin links rotos** — verificado el mismo día del envío.
5. ❑ **Documento no vencido** — SEPREC vigente hasta 31/08/2028 ✅.
6. ❑ **Nada inventado.** Meta lista como rechazo *"Submitting, or being suspected of submitting, false or misleading information"*, y ese rechazo la habilita a *"take additional action on the account"* → riesgo de perder el ad account, no solo el trámite. Es el único motivo de rechazo que escala.

### 4.5 Después de enviar
- **Hasta 14 días hábiles** de espera.
- **No editar ningún dato del negocio** en ese lapso: *"If you edit your business details, then you need to complete the verification process again."*
- Si rechazan: los motivos son (a) reclamar un negocio ajeno, (b) info falsa o sospecha de ella, (c) sitio caído / sin HTTPS / links rotos, (d) documento vencido o de fuente no oficial. Se corrige y se reintenta.

---

## 5. Qué desbloquea la verificación

| Desbloqueo | De → a |
|---|---|
| **Números de WhatsApp por portfolio** | **2 → 20** |
| **Plantillas por WABA** | **250 → 6.000** (requiere además display name aprobado) |
| **Límite de mensajería** | **250 → 2.000 destinatarios/día** de salto directo (de ahí escala solo en ~6 h) |
| **Advanced Access en Meta for Developers** | *"Verification is required to obtain Advanced Access for any permission"* → **sin esto no existe el camino de Tech Provider propio** (`whatsapp_business_messaging` + `whatsapp_business_management`) |
| **Daily spending limit del ad account** | Meta lo sube más rápido a cuentas verificadas |
| **Verificar clientes como partner** | Los clientes de Onia saltan directo a 2.000 de límite |

**Lo que NO desbloquea:** el badge azul. *"Verifying your business... is different from Meta Verified for businesses and won't give you a verified badge."* No comprar Meta Verified creyendo que resuelve esto.

**Traducción comercial:** sin verificación el techo del negocio de chatbots son 2 números. Con verificación, 20. No es papeleo — es la diferencia entre vender un chatbot y vender veinte.

---

## 6. Después de verificar: el 2º portfolio "ONIA Personas"

Meta permite que **una persona cree hasta 2 portfolios**. Sergio ya gastó 1 (`OniaAgency`). **Queda exactamente 1 slot y es final.**

| | **Portfolio 1 — `OniaAgency`** (`1451773736711697`) | **Portfolio 2 — `ONIA Personas`** (el slot final) |
|---|---|---|
| Rol | **Comercial**: todo lo que factura | **Personas IA**: contenido sintético |
| Ad account | `act_1073680778314945` (no se puede mover, se queda acá) | ninguno del comercial; si hace falta, uno nuevo y chico |
| Páginas | `ONIA · Sistemas con IA para tu negocio` | Página de Lucía Antelo |
| Instagram | IG de Onia | `@lu.antelo` y futuras personas IA |
| WABAs de clientes | todas acá | ninguna |
| App de Meta (Tech Provider) | acá, nunca del otro lado | ninguna |
| Verificación de negocio | ✅ sí, prioridad 1 | no hace falta |

### Por qué NUNCA se cruzan activos entre portfolios

1. **El enforcement de Meta escala a nivel portfolio.** Si una cuenta de influencer IA cae por suplantación o por política de contenido sintético, arrastra a **todo el portfolio**. Si las personas IA comparten portfolio con el ad account y las WABA de clientes que pagan, una sanción de contenido apaga el negocio real.
2. **Un activo pertenece a un solo portfolio** (*"Business assets can only belong to 1 business portfolio"*). No hay "compartir a medias".
3. **Mover una Página no es transferir: es remover y re-agregar.** Queda una ventana en la que la Página no tiene dueño y **cualquiera con acceso puede reclamarla**. Además rompe las conexiones a IG/WhatsApp. → En `ONIA Personas` se crean activos **nuevos desde cero**, jamás se mueven los existentes.
4. **Clientes nuevos nunca entran creando un portfolio.** Entran por **partner sharing** (*Request to share an ad account*) o por Embedded Signup. Crearle un portfolio a un cliente quema el último slot.

---

## 7. Aprendizajes de hoy (para no repetir el error)

### 7.1 "ONIA Agency" **con espacio** está tomado en Meta
Al intentar renombrar el portfolio a `ONIA Agency` (con espacio), Meta devolvió **"Nombre duplicado"** — ese nombre ya está en uso por otra entidad en la plataforma.
→ Por eso el portfolio quedó como **`OniaAgency`** (todo junto), que además **coincide exactamente con la denominación legal del SEPREC**. Salió mejor que la idea original: el nombre público y el nombre legal ahora son el mismo string, lo que le quita fricción al revisor humano.
→ **Regla:** antes de pelear con un nombre "lindo", probar si el del papel está libre. El del papel siempre gana.

### 7.2 Son TRES campos distintos, no uno
El error más común y el que hace rebotar verificaciones:

| Campo | Dónde vive | Qué debe decir | Valor Onia |
|---|---|---|---|
| **Nombre del portfolio** | Configuración del negocio → Información del negocio | el nombre **público** de la marca (*"should match the public name of your business"*) | `OniaAgency` ✅ |
| **Nombre legal del negocio** | dentro del formulario de verificación | **exacto del registro oficial**, carácter por carácter | `OniaAgency` (a cargar) |
| **Nombre de la Página** | Meta Business Suite → Configuración de la Página | describe el negocio, cumple normas de nombres de Página | `ONIA · Sistemas con IA para tu negocio` (a cargar) |

**Meta nunca pide que los tres sean iguales.** Se pueden y se deben tratar por separado. En el caso de Onia, portfolio y nombre legal coinciden por conveniencia (ver 7.1), pero la Página lleva descriptor comercial a propósito: "Onia Marketing" encasillaba en marketing cuando lo que se vende es automatización y SaaS.

### 7.3 Otros hechos confirmados hoy
- El **ad account no se mueve**: cualquier plan que asumiera "muevo el ad account a un portfolio nuevo" está muerto. `OniaAgency` **es** el portfolio comercial, definitivo.
- La **WABA de Bolivian Electric vive bajo el portfolio del cliente** (Bolivian Group SRL) → Onia arranca con los **2 números libres**, no con 1. Buena noticia para el cap.
- **Editar datos del negocio después de verificar = re-verificación.** Por eso todos los renombres y cargas de datos van **antes** del envío, no después.

---

## 8. Resumen ejecutable (imprimible)

```
[ ] A1-A4  Cargar nombre legal / dirección / teléfono / sitio en Información del negocio
[ ] A5     Renombrar Página → "ONIA · Sistemas con IA para tu negocio"
[ ] A6     Fijar esa Página como Página principal del portfolio
[ ] B1     Activar requisito de 2FA en Centro de seguridad
[ ] B2     Agregar a Leslie como segundo Control total
[ ] B3     Cambiar email de contacto a sergio@onia.com.bo
[ ] C1-C2  Sitio arriba, HTTPS, sin links rotos (verificar el mismo día)
[ ] D1     SEPREC en PDF legible, no vencido
[ ] D3     Centro de seguridad → Iniciar verificación
[ ] D4     Confirmar por verificación de dominio
[ ] D5     NO tocar datos del negocio por 14 días hábiles
[ ] E1     Al verificar: confirmar cap 2 → 20 números en WhatsApp Manager
[ ] E2-E3  Crear "ONIA Personas" con activos nuevos (nunca movidos)
```
