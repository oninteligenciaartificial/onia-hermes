# ONIA — Cierre de Meta: verificación de negocio, ejecutable paso a paso

**Fecha:** 2026-07-26 · **Frente:** M (Meta / cuentas) · **Portfolio:** `1451773736711697` "OniaAgency"
**Estado hoy:** datos legales cargados y coincidiendo con el SEPREC · **Verificación: Sin verificar**
**Para:** Sergio, con el navegador abierto. Se ejecuta de arriba hacia abajo.

**Docs relacionados (no duplicar, editar la fuente):**
- Playbook con el "por qué" y las fuentes: `ONIA_META_Y_CHATBOT_PRODUCTO_20260725.md`
- Checklist previo (lo que ya se ejecutó): `ONIA_META_VERIFICACION_CHECKLIST_20260725.md`
- Quién toca qué: `ONIA_CARRILES_ACTIVOS_20260726.md`

---

## 🔴 0. LEER ANTES DE TOCAR NADA — bloqueante encontrado hoy

**Verifiqué `https://onia.com.bo` en vivo hoy (2026-07-26). El sitio NO coincide con lo que vas a declarar en el formulario.** Esto es exactamente la clase de sorpresa que hace rebotar una verificación, porque Meta cruza el sitio contra los datos del formulario. Su texto oficial: *"Check that the details you enter exactly match the details of your legal business entity. Also make sure your business website loads and is HTTPS compliant."*

| Dato | Formulario de Meta (lo que vas a poner) | `onia.com.bo` HOY (verificado en vivo) | Veredicto |
|---|---|---|---|
| Nombre | `OniaAgency` | **"OnIA" / "OnIA Agency"** (con n minúscula y con espacio) | ❌ **no coincide** |
| Teléfono | `+591 78491375` | **`+591 75470140`** | ❌ **no coincide** |
| Email | `business@onia.com.bo` | `oninteligenciaartificial@gmail.com` | ❌ dominio público |
| Dirección | Calle Tulipanes Nro. 9, Zona Norte | solo "Santa Cruz de la Sierra, Bolivia" | ⚠️ incompleta |
| NIT visible | `5371375010` | no aparece en ninguna parte | ⚠️ ausente |
| HTTPS | requerido | ✅ carga y es HTTPS | ✅ |
| Política de privacidad | requerida para la app de Meta | ✅ existe en `/privacidad` (con los mismos datos viejos) | ⚠️ desalineada |

**Buena noticia: se arregla con un bloque de pie de página, no con un rediseño.** Alcanza con que el sitio muestre, en el footer de la home y en `/privacidad`, esta línea legal:

```
OniaAgency — NIT / Matrícula de comercio 5371375010
Calle Tulipanes Nro. 9, Zona Norte — Santa Cruz de la Sierra, Bolivia
+591 78491375 — business@onia.com.bo
```

**Dueño del arreglo:** NO es esta sesión. El sitio público vive en el carril **ONIA Platform (Sesión B, rama `claude/git-status-935f47`, `web-factory/apps/onia-platform/**`)**. Este doc lo declara como **entrega bloqueante de la Sesión B** y el orquestador lo tiene que pedir ahí. Yo no lo toco (regla de carriles).

**Decisión que hay que tomar antes de seguir — el teléfono.** Hay dos números ONIA circulando (`78491375` en Meta, `75470140` en el sitio y en todas las propuestas). Elegí uno y que sea el mismo en los tres lugares (SEPREC no trae teléfono, así que acá mandás vos):

- **Recomendado: `+591 78491375`.** Ya está cargado en el portfolio, tiene WhatsApp y es el que va a colgar del chatbot. Cambiarlo en el portfolio **después** de enviar dispara re-verificación; cambiarlo en el sitio es gratis.
- Si preferís `75470140` porque ya está en propuestas y en el generador: cambialo **ahora** en el portfolio, **antes** de enviar, y actualizá el sitio igual.
- **No pongas los dos en el formulario.** En el sitio pueden convivir (uno "contacto", otro "ventas") siempre que el del formulario esté visible.

> ⛔ **No aprietes "Iniciar verificación" hasta que el footer del sitio esté publicado con el nombre legal y el teléfono elegido.** Es el único paso de este doc que depende de otra sesión, y es el que más rechazos causa.

---

## 1. Antes de empezar: tené esto abierto

| Qué | Dónde |
|---|---|
| Certificado SEPREC en PDF o JPG legible, sin vencer (vence 31/08/2028) | carpeta local |
| Certificado de Inscripción al Padrón (NIT) del SIN — refuerzo opcional | carpeta local |
| **Cédula de identidad de Leslie Mercado Moreno** (frente y dorso, escaneada) | carpeta local — ver §3.4, es probable que Meta la pida |
| Acceso al panel del registrador de `onia.com.bo` (para el TXT de DNS) | tu proveedor de dominio |
| `business.facebook.com` logueado con tu perfil | pestaña 1 |
| `business.facebook.com/settings` (Configuración del negocio) | pestaña 2 |
| Leslie disponible por teléfono/WhatsApp durante el trámite | — |

**Regla de oro de todo este doc:** todo lo que edite datos del negocio (nombre legal, país, teléfono, sitio web, ID fiscal) va **ANTES** de enviar. Meta, textual: *"If you edit your business details, then you need to complete the verification process again."* Editar después = volver a esperar.

---

## 2. Checklist final ejecutable

Cada fila dice **qué clic**, **qué escribir** y **quién**. No saltear el orden.

### Fase A — Página de Facebook (Sergio · ~15 min)

Página objetivo: **`1140384625819526`** (hoy "Onia Marketing", categoría "Agencia de marketing", sin teléfono, email gmail, IG conectado 18 seguidores, FB 1 seguidor).

| # | Paso | Clic exacto | Qué escribir |
|---|---|---|---|
| **A1** | Confirmar que el **tipo de Página** es **Negocio**, no Creador | Página → **Configuración** → **Tipo de página** (Meta consolidó Páginas en Negocio/Creador a fines de 2025) | dejar **Negocio**. ⚠️ Solo se puede cambiar **1 vez cada 7 días** — si está en Creador, cambialo YA y esperá antes de tocar otra cosa |
| **A2** | ~~**Renombrar la Página**~~ ✅ **HECHO 2026-07-27** | Ruta REAL (la de acá abajo no existe): `facebook.com/settings/?tab=pages` → **Configuración de la página** → **Nombre** → Editar → Revisar cambio → pide **contraseña** → Solicitar cambio | quedó en **`Onia`**, NO `OniaAgency` — ver nota abajo |
| **A3** | **Cambiar la categoría** (sacar "Agencia de marketing" del primer lugar) | misma pantalla → **Categorías** → borrar la actual, escribir y elegir del desplegable (hasta **3**, en orden de prioridad) | 1) `Empresa de software` · 2) `Servicio de tecnología de la información` · 3) `Agencia de publicidad` |
| **A4** | **Cargar el teléfono de la Página** | misma pantalla → **Información de contacto** → Teléfono | `+591 78491375` |
| **A5** | **Cambiar el email de la Página** | misma pantalla → **Información de contacto** → Email | `business@onia.com.bo` (reemplaza `onia.agency.bo@gmail.com`) |
| **A6** | **Cargar dirección y sitio web de la Página** | misma pantalla → Dirección / Sitio web | Calle Tulipanes Nro. 9, Zona Norte, Santa Cruz de la Sierra, Bolivia · `https://onia.com.bo` |
| **A7** | **Descripción corta** (acá va el descriptor comercial, NO en el nombre) | misma pantalla → Descripción | `Sistemas con IA, automatización y chatbots para negocios en Bolivia.` |

> ⛔ **CORREGIDO 2026-07-27 — el bloque de abajo estaba equivocado y se anula.**
> Fuente que manda: `ONIA_ARQUITECTURA_MARCA_Y_RUTA_GLOBAL_20260727.md` §1 y §7.
>
> **El nombre de la Página es `Onia`, no `OniaAgency`.** La razón social va SOLO en:
> facturas, contratos, SIAT, banco, el **nombre legal declarado en el formulario de
> verificación** y el **nombre del portfolio**. NO va en la Página, el handle, el wordmark
> ni el dominio. Son capas distintas y está previsto que no coincidan (razón social de
> Google = *Google LLC*; de Instagram = *Meta Platforms, Inc.*).
>
> El razonamiento viejo ("cuatro coincidencias exactas") sobre-corregía: Meta **nunca pide
> que la Página coincida** con el registro — solo el portfolio y el formulario. Poner la
> razón social en la Página no sumaba nada frente al revisor y sí le ponía techo de
> "agencia de servicios" a una marca que vende plataforma, marketing y productos.
>
> **Dato verificado en pantalla el 2026-07-27:** el diálogo de confirmación de Facebook
> dice textual *"no podrás volver a cambiarle el nombre durante los 60 días siguientes"*,
> y que la revisión tarda **hasta 3 días**. O sea que **el "60 días" SÍ aplica a Páginas** —
> la nota de abajo que lo desmentía era incorrecta. Próxima ventana de cambio: ~25-sep-2026.

<details>
<summary>Razonamiento original del 26-jul (anulado, se conserva por trazabilidad)</summary>

**Por qué el nombre de Página es `OniaAgency` y no `ONIA · Sistemas con IA para tu negocio`** — cambio de criterio respecto del doc del 25/07, con motivo:

1. **Coherencia total con el revisor.** Nombre legal = nombre del portfolio = nombre de la Página = lo que dice el footer del sitio = `OniaAgency`. Cuatro coincidencias exactas. Un revisor humano no tiene nada que dudar. Ese es el objetivo de esta semana: que la verificación pase a la primera.
2. **El `·` (punto medio) es riesgo gratis.** Las normas de nombres de Página de Meta penalizan puntuación y símbolos usados como decoración. No vale la pena arriesgar un rebote de nombre justo antes de enviar.
3. **El descriptor no se pierde:** vive en la categoría (A3), en la descripción (A7) y en el sitio. Ahí es donde Meta y Google lo leen igual.

Si igual querés descriptor en el nombre, la única variante segura es `OniaAgency - Sistemas con IA` (guion común, sin punto medio). **No** uses `ONIA` a secas: no coincide con ningún papel.

> ⚠️ **Hay enfriamiento entre cambios de nombre de Página** y Meta no publica la cifra. Ignorá el "60 días" que circula: esa regla es de perfiles personales. Hacé A2 una vez y no lo toques más.

</details>

**El punto 2 sigue vigente:** nada de `·` ni símbolos decorativos en el nombre de Página.
`Onia` a secas los evita por completo.

### Fase B — Portfolio (Sergio · ~10 min)

Ruta base: `business.facebook.com` → ⚙️ **Configuración del negocio**.

| # | Paso | Clic exacto | Qué escribir |
|---|---|---|---|
| **B1** | **Fijar la Página principal del portfolio** (hoy "ninguna") | Configuración del negocio → **Información del negocio** → **Página principal** → seleccionar | la Página `1140384625819526`, ya renombrada `OniaAgency` |
| **B2** | **Email de contacto del portfolio** | Configuración del negocio → Información del negocio → Email de contacto | `business@onia.com.bo`. Meta marca dominios públicos como riesgo, textual: *"Bad actors often use public email domains"* |
| **B3** | **Re-verificar los 5 campos legales** ya cargados, carácter por carácter | misma pantalla | ver tabla de §3.1. Si alguno está mal, **corregilo ahora** |
| **B4** | **Activar 2FA obligatorio** | Configuración del negocio → **Centro de seguridad** → Autenticación en dos pasos → **Requerir a todos** | ⚠️ Antes: asegurate de que vos **y Leslie** ya tengan 2FA en su Facebook personal, o quedan afuera del portfolio |
| **B5** | **Agregar a Leslie como segundo Control total** | Configuración del negocio → **Usuarios** → **Personas** → **Agregar** → invitar por email → **Control total** | email de Leslie. Ella acepta desde su correo. **Hacelo antes de enviar** (ver §3.4) |

### Fase C — Verificar el dominio (Sergio · ~15 min + propagación)

Hacelo **antes** de abrir el formulario, así en el paso de confirmación la opción "dominio" ya aparece en verde.

| # | Paso | Clic exacto |
|---|---|---|
| **C1** | Ir a dominios | Configuración del negocio → **Seguridad de marca** (*Brand Safety and Suitability*) → **Dominios** → **Agregar** → `onia.com.bo` |
| **C2** | Elegir método | pestaña **Verificación de DNS** → copiar el registro **TXT** que muestra Meta |
| **C3** | Pegarlo en el registrador | panel DNS de `onia.com.bo` → nuevo registro TXT → Host: `@` → Valor: el string de Meta → Guardar |
| **C4** | Volver a Meta y **Verificar** | propagación: minutos, hasta 72 h. **Dejá el TXT puesto para siempre** — Meta lo re-chequea periódicamente |

**Por qué DNS TXT y no meta-tag ni archivo HTML:** el meta-tag y el archivo HTML requieren tocar el sitio, que es de la Sesión B. El TXT lo hacés vos solo, en 5 minutos, sin depender de nadie. Los tres métodos son equivalentes para Meta; solo hace falta uno.

### Fase D — Pre-vuelo, el MISMO día del envío (Sergio · 10 min)

| # | Chequeo | Cómo |
|---|---|---|
| **D1** | El footer con nombre legal + NIT + dirección + teléfono **está publicado** en `onia.com.bo` | abrirlo y leerlo. Si no está, **parar acá** (§0) |
| **D2** | El sitio carga desde un celular **sin sesión**, con datos móviles | tu teléfono, modo incógnito |
| **D3** | Es HTTPS y no hay links rotos | click a cada ítem del menú: Inicio, Servicios, Nosotros, Contacto, Empezar, `/privacidad` |
| **D4** | El teléfono del formulario **contesta** | llamate desde otro teléfono a `+591 78491375` |
| **D5** | El SEPREC abre y se lee sin zoom | abrir el PDF/JPG |

Motivo de rechazo textual de Meta: *"a website that fails to load, is not HTTPS compliant... or contains a link that leads to an error message"*.

### Fase E — Enviar (Sergio · ~30 min)

| # | Paso | Clic exacto |
|---|---|---|
| **E1** | Abrir el trámite | Configuración del negocio → **Centro de seguridad** → **Iniciar verificación** (*Start verification*) |
| **E2** | Completar el formulario | **campo por campo en §3** |
| **E3** | Subir documentos | **§3.3** |
| **E4** | Método de confirmación | elegir **Verificación de dominio** (ya verde por la Fase C) |
| **E5** | Enviar → **Listo** | — |
| **E6** | **NO tocar ningún dato del negocio** hasta la resolución | ni nombre, ni teléfono, ni sitio, ni ID fiscal, ni país |

Si en E1 aparece **"No apto para verificación" (*Ineligible for verification*)**: no se hace por ahí. Meta te avisa por email o desde otra plataforma (ej. Commerce Manager) cuando te habilita. No insistas ni crees otro portfolio.

### Fase F — Después del "verificado"

| # | Paso |
|---|---|
| **F1** | Confirmar en WhatsApp Manager que el cap de números subió de **2 → 20** |
| **F2** | Crear la app de Meta de Lucía (**§6**) — esto NO depende de la verificación, se puede hacer antes |
| **F3** | Crear la WABA propia de ONIA (**§7**) |
| **F4** | Crear el 2º y **último** portfolio "ONIA Personas" (ver `ONIA_META_VERIFICACION_CHECKLIST_20260725.md` §6) |

### Resumen imprimible

```
[ ] 0   Footer legal publicado en onia.com.bo  ← BLOQUEA TODO (Sesión B)
[ ] 0b  Decidir teléfono único (78491375) y que sea el mismo en Meta y en el sitio
[ ] A1  Tipo de Página = Negocio
[ ] A2  Nombre de Página -> OniaAgency
[ ] A3  Categorias -> Empresa de software / Servicio de TI / Agencia de publicidad
[ ] A4  Telefono de la Pagina -> +591 78491375
[ ] A5  Email de la Pagina -> business@onia.com.bo
[ ] A6  Direccion + sitio web de la Pagina
[ ] A7  Descripcion corta
[ ] B1  Pagina principal del portfolio -> 1140384625819526
[ ] B2  Email de contacto del portfolio -> business@onia.com.bo
[ ] B3  Re-verificar los 5 campos legales caracter por caracter
[ ] B4  2FA obligatorio (con Sergio y Leslie ya con 2FA personal)
[ ] B5  Leslie = segundo Control total
[ ] C1-C4  Dominio onia.com.bo verificado por TXT
[ ] D1-D5  Pre-vuelo el mismo dia
[ ] E1-E5  Enviar verificacion
[ ] E6  NO tocar datos del negocio hasta la resolucion
```

---

## 3. El formulario de verificación: campo por campo

**Prerrequisito:** tener **Control total** del portfolio (Sergio ya lo tiene).
**Ruta:** Configuración del negocio → Centro de seguridad → **Iniciar verificación**.

### 3.1 Campos exactos

Copiar y pegar. **No reescribir, no "mejorar", no traducir.**

| Campo del formulario (ES / EN) | Valor exacto |
|---|---|
| **País / Country** | `Bolivia` |
| **Tipo de negocio / Business type** | `Propietario único` (*Sole proprietorship*) — es una **Empresa Unipersonal** en el SEPREC |
| **¿Tu negocio está registrado? / Is your business registered?** | **Sí, registrado** |
| **Nombre legal del negocio / Legal business name** | `OniaAgency` — todo junto, sin espacio, N mayúscula solo al inicio. **Nada de** "ONIA", "Onia Agency", "OnIA Agency", "ONIA S.R.L." |
| **Dirección / Street address** | `Calle Tulipanes Nro. 9, Zona Norte` |
| **Complemento / Address line 2** | `Entre Av. 6to Anillo y Calle Las Américas` |
| **Ciudad / City** | `Santa Cruz de la Sierra` |
| **Departamento-Estado / State-Province** | `Santa Cruz` |
| **Código postal / Zip code** | Bolivia no usa códigos postales. Dejalo **vacío** si el campo es opcional; si es obligatorio, `0000`. `[NO CONFIRMADO: si Meta lo exige para BO]` — no es causa de rechazo, el SEPREC tampoco trae CP |
| **Teléfono / Business phone number** | `+591 78491375` — con código de país, sin espacios si no los acepta: `+59178491375` |
| **Sitio web / Website** | `https://onia.com.bo` — con `https://`, sin barra final |
| **Email del negocio** | `business@onia.com.bo` |
| **ID fiscal / Tax ID / Business ID** | `5371375010` (matrícula de comercio = NIT) |
| **Representante legal / Legal representative** | `MERCADO MORENO LESLIE` — tal cual figura en el SEPREC |
| **Búsqueda del registro** ("¿es este tu negocio?") | Si Meta no encuentra a OniaAgency en su base: **"Mi negocio no aparece en la lista"** / *"My business isn't listed"* / *"None of these match"* → pasa a subir documentos |

### 3.2 Los 3 nombres son campos DISTINTOS — no los confundas

Es el error que más verificaciones rebota:

| Campo | Dónde vive | Qué debe decir | Valor ONIA |
|---|---|---|---|
| **Nombre del portfolio** | Config. del negocio → Información del negocio | debe **coincidir con el certificado** | `OniaAgency` ⚠️ hoy dice "OnIA Agency" con espacio → **corregir** |
| **Nombre legal del negocio** | dentro del formulario de verificación | **exacto del registro oficial** | `OniaAgency` |
| **Nombre de la Página** | `facebook.com/settings/?tab=pages` → Configuración de la página → Nombre | la **marca**, no la razón social | `Onia` ✅ hecho 2026-07-27 |

Meta **nunca** pide que los tres sean iguales — solo que el **portfolio** y el **formulario**
coincidan con el certificado. La Página es marca, no documento (ver
`ONIA_ARQUITECTURA_MARCA_Y_RUTA_GLOBAL_20260727.md` §0). Igualar los tres era una
sobre-corrección: no sumaba ante el revisor y le ponía techo de "agencia" a la marca.

### 3.3 Qué documento subir

| Documento | Rol | Categoría que elegís en Meta |
|---|---|---|
| **Certificado de Matrícula de Comercio (SEPREC)** | ✅ **el principal** | *Business Registration or License Document* |
| Certificado de Inscripción al Padrón Nacional de Contribuyentes (NIT, emitido por el SIN) | refuerzo opcional | *Government Issued Business Tax Document* |
| Factura de luz/agua a nombre del negocio | solo si Meta cuestiona **dirección o teléfono** | *Utility Bill* — Meta, textual: *"A utility bill is not an acceptable document for Legal Business Name verification"* |
| Extracto bancario de la cuenta empresa | alternativa | *Business Bank Statement* |
| Formulario 200 / declaración jurada propia | ❌ **NUNCA** | Meta, textual: *"Self-filed tax documents are not accepted"* |

Cuando pregunte *"¿el documento contiene el teléfono o la dirección del negocio?"* → respondé **Sí** solo si efectivamente aparecen ahí. No mientas en ese toggle: si decís Sí y no está, el revisor lo ve.

**Idioma:** el español está en la lista de idiomas soportados por Meta. **No hace falta traducción ni sello de agencia traductora.**

**Calidad del archivo (causa de rechazo #1 según los partners de WhatsApp):** PDF o JPG nítido, texto legible sin zoom, las 4 esquinas visibles, sin recortes, sin marcas de agua tuyas, sin foto de pantalla. Si lo escaneás con el celular, usá el modo documento y revisá que se lea el número de matrícula.

### 3.4 ⚠️ La cédula de Leslie: el punto que puede frenarte

Meta pide dos cosas: (1) *"Ensure your business is a legal entity"* y (2) *"Demonstrate you're an authorized representation of your business"*. Para (2), el flujo **puede pedir un documento de identidad del representante**.

**El representante legal es Leslie Mercado Moreno, no Sergio.** Si Meta pide una identificación y sube la de Sergio, **hay mismatch inmediato entre el ID y el nombre del representante declarado** → rechazo, y peor: entra en la categoría "información que no coincide", que es la que escala.

**Qué hacer:**
1. Tener la **CI de Leslie escaneada** (frente y dorso) antes de empezar.
2. Hacer el paso **B5** (Leslie como Control total) **antes** de enviar, no después.
3. Si el flujo pide identidad, **que sea la de Leslie**. Lo ideal: que Leslie esté al lado, o que directamente sea ella la que apriete enviar desde su acceso de Control total.
4. No inventar un representante para "simplificar". Es el único error de este doc que puede costar el ad account.

---

## 4. Motivos de rechazo documentados y cómo los evitamos

Chequeá esta tabla completa antes de apretar enviar. La columna "Estado ONIA" es lo que hay que poder tildar.

| # | Motivo de rechazo | Cómo se manifiesta | Cómo lo evitamos | Estado ONIA |
|---|---|---|---|---|
| 1 | **Nombre legal no coincide** con el documento o con lo cargado en Business Manager | el más frecuente | `OniaAgency` idéntico en SEPREC, portfolio, formulario, Página y footer del sitio | ⬜ tildar tras A2 + §0 |
| 2 | **Documento no aceptado o auto-declarado** | Formulario 200, declaraciones juradas | Solo SEPREC (+ NIT del SIN como refuerzo) | ⬜ |
| 3 | **Documento vencido** | — | SEPREC vigente hasta **31/08/2028** ✅ | ✅ |
| 4 | **Documento ilegible / borroso / baja resolución / recortado** | reportado como ~40% de los rechazos iniciales por partners de WhatsApp `[dato de terceros, no de Meta]` | escaneo nítido, 4 esquinas, sin marca de agua | ⬜ |
| 5 | **Documento sin firma ni sello oficial** | — | el SEPREC trae sello y código de verificación | ✅ |
| 6 | **Idioma no soportado / código de idioma mal elegido** | se elige "English" y se sube un doc en español | elegir **Español** en el selector de idioma del documento | ⬜ |
| 7 | **Dirección parcial o distinta** a la del documento | falta calle, número o ciudad | la del certificado, completa, no "donde trabajás hoy" | ⬜ |
| 8 | **Teléfono que no coincide o no contesta** | Meta llama o manda SMS | `+591 78491375`, el mismo en el sitio, y contestable (chequeo D4) | ⬜ tras §0 |
| 9 | **Sitio caído, sin HTTPS o con links rotos** | textual de Meta | pre-vuelo D1-D3 el mismo día del envío | ⬜ |
| 10 | **El sitio no muestra el nombre legal del negocio** | el revisor entra a la web y no encuentra la razón social | footer legal (§0) — **hoy es el hueco abierto** | ❌ **PENDIENTE** |
| 11 | **Editar datos del negocio durante la revisión** | reinicia el trámite | E6: no tocar nada por 14 días hábiles | ⬜ |
| 12 | **Reclamar un negocio que no te pertenece** | — | no aplica, el SEPREC es propio | ✅ |
| 13 | **Múltiples envíos de identidad desde admins distintos** | Meta lo lee como intento de forzar | **un solo envío, un solo representante: Leslie** (§3.4) | ⬜ |
| 14 | **Roles incompletos / sin 2FA** | portfolio con un solo admin y sin 2FA | B4 + B5 | ⬜ |
| 15 | **Información falsa o sospecha de ella** | el único que **escala**: Meta puede *"take additional action on the account"* → riesgo de perder el ad account | nada inventado, nunca. Si falta un dato, se busca el papel, no se rellena | ⬜ |

**Tiempo de respuesta 2026 (lo que dice cada fuente, sin promediar):**

| Fuente | Tiempo |
|---|---|
| **Meta, oficial** | *"A decision on your verification submission may take up to **14 business days**"* |
| Partners de WhatsApp (Wati) | "de 10 minutos a 14 días hábiles" |
| Otros integradores | la mayoría de los casos simples: **1 a 10 días hábiles**; casos con revisión manual o rubros sensibles: hasta 15 |

**Planificá con 14 días hábiles.** Si sale en 3, es regalo. Lo que NO podés hacer es prometerle a un cliente un chatbot con fecha atada a esto.

---

## 5. Si rechazan: qué hacer y qué NO hacer

### 5.1 Primero: leer el motivo real

1. Configuración del negocio → **Centro de seguridad** → el estado dice *Rechazado* → botón **"Más información" / "Learn More"**.
2. Ahí Meta nombra **el** motivo. También llega por email al `business@onia.com.bo`.
3. **Anotá el texto literal** en este doc antes de tocar nada. Sin el motivo exacto, cualquier reintento es a ciegas.

### 5.2 Corregir SOLO lo señalado y reenviar

| Motivo que te dieron | Qué corregís | Qué NO tocás |
|---|---|---|
| Documento ilegible | reescanear el SEPREC | los datos del formulario |
| Nombre no coincide | el campo nombre legal, o el footer del sitio | el documento |
| Dirección no coincide | la dirección al texto exacto del certificado | nada más |
| Sitio no verificable | publicar el footer legal (§0) y re-chequear links | los datos |
| Identidad del representante | subir la CI de **Leslie** | el resto |

**Regla:** un motivo, una corrección, un reenvío. Cambiar cinco cosas a la vez hace que, si vuelve a rebotar, no sepas cuál era.

### 5.3 Cuántos intentos hay

- **Meta no publica oficialmente un número de reintentos** para business verification. `[NO CONFIRMADO oficialmente]`
- Varios BSP de WhatsApp (Brevo entre ellos) documentan que **se dan hasta 3 envíos** antes de que la opción se cierre y haya que ir por soporte. Tratalo como si fueran 3.
- **Consecuencia práctica: el primer envío es el que importa.** Por eso este doc pone el footer del sitio como bloqueante y no como "nice to have".

### 5.4 Si se agotan los intentos: apelación

1. **Business Support Home** (`business.facebook.com/business-support-home`) → **Ayuda** → abrir un caso / **Chat de soporte de Meta Business** (disponible en Business Suite → Ayuda).
2. Buscar la opción **"Solicitar una revisión" / "Request a Review"** sobre la decisión.
3. Adjuntar: SEPREC, certificado NIT, captura del footer del sitio con el nombre legal, y la CI de Leslie.
4. **Las apelaciones se resuelven típicamente en pocos días hábiles.** Si la apelación también se rechaza, suele haber que esperar **~30 días** antes de una nueva. `[dato de terceros]`

### 5.5 Lo que NUNCA hay que hacer

| ❌ No hagas | Por qué |
|---|---|
| Reenviar una y otra vez sin cambiar nada | ralentiza la revisión y puede reducir las opciones disponibles |
| Abrir varias apelaciones en paralelo | se pisan entre sí y demoran todo |
| Editar datos del negocio mientras está "en revisión" | reinicia el proceso desde cero |
| Que envíen la identidad admins distintos, uno tras otro | Meta lo lee como intento de forzar el sistema |
| Crear un **portfolio nuevo** para "empezar de cero" | gastás el **último slot** que te queda (Meta permite crear 2 por persona) y el ad account `act_1073680778314945` **no se puede mover**. Sería irreversible |
| Comprar **Meta Verified** creyendo que resuelve esto | textual de Meta: *"Verifying your business... is different from Meta Verified for businesses and won't give you a verified badge"*. Son productos distintos |
| Retocar el nombre legal para que "pase" | motivo #15, el único que escala a acción sobre la cuenta |

---

## 6. Después: app de Meta para publicar como Lucía — **sin App Review**

**Conclusión verificada hoy contra la documentación oficial de Meta:** para publicar en una cuenta de Instagram **propia o que administrás**, con **Instagram API with Instagram Login** y **Standard Access**, **App Review NO es necesario**. La tabla oficial de requisitos de App Review del Instagram Platform marca literalmente *"Not required"* para el caso *"My app is only for a business I own or manage"* + *"Instagram Login"* + *"Standard Access"*.

Meta, textual sobre Standard Access: *"Standard Access is the default access level for all apps... If your app only serves your Instagram professional account or an account you manage, Standard Access is all your app needs."*

Advanced Access (y por lo tanto App Review + Business Verification) solo hace falta si la app sirve cuentas de Instagram **de terceros que vos no administrás** — o sea, si algún día vendés "publicación automática" como producto a clientes.

> ⚠️ Vas a encontrar blogs de 2026 que afirman que "no hay forma de saltear App Review para publicar". Están hablando del caso Tech Provider (cuentas de terceros). Para la cuenta propia de Lucía, la doc oficial dice lo contrario. La fuente que manda es la tabla de App Review del Instagram Platform, no los blogs.

### 6.1 Pasos

| # | Paso | Dónde |
|---|---|---|
| 1 | `@lu.antelo` tiene que ser **cuenta profesional** (Empresa o Creador) | app de Instagram → Configuración → Cuenta → **Cambiar a cuenta profesional** |
| 2 | Crear la app | `developers.facebook.com/apps` → **Crear app** → caso de uso **"Otro"** → tipo **"Negocio"** |
| 3 | **Portfolio de la app** | dejala **sin reclamar**, o reclamala con **"ONIA Personas"** cuando exista. **NUNCA** con `OniaAgency` — el enforcement de Meta escala a nivel portfolio y una sanción por contenido sintético no puede tocar el ad account ni las WABA de clientes |
| 4 | Agregar el producto | panel de la app → **Agregar producto** → **Instagram** → **API setup with Instagram login** |
| 5 | Permisos (scopes) | `instagram_business_basic` + `instagram_business_content_publish`. Standard Access, sin review |
| 6 | Generar el token | en "API setup with Instagram login" → **Generate access tokens** → **Add account** → logueás con `@lu.antelo` → autorizás |
| 7 | **Token de larga duración** | canjear el token corto: `GET https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=<APP_SECRET>&access_token=<TOKEN_CORTO>` → dura **60 días** |
| 8 | **Refresh automático** | `GET https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=<TOKEN_LARGO>` antes de los 60 días. **Esto va como workflow de n8n con recordatorio**, o el bot de Lucía muere en silencio a los 2 meses |
| 9 | Guardar el token | **credencial de n8n** (Header Auth), nunca `$env` ni hardcodeado — plan VPS |

### 6.2 Publicar (2 llamadas)

```
# 1. Crear el contenedor
POST https://graph.instagram.com/v23.0/<IG_ID>/media
    image_url=<URL pública HTTPS>        # foto
    video_url=<URL pública HTTPS>&media_type=REELS   # reel
    caption=<texto>
    access_token=<token>
  -> { "id": "<CONTAINER_ID>" }

# 2. Publicarlo
POST https://graph.instagram.com/v23.0/<IG_ID>/media_publish
    creation_id=<CONTAINER_ID>
    access_token=<token>
  -> { "id": "<IG_MEDIA_ID>" }
```

**Límites y trampas verificadas:**

| Regla | Detalle |
|---|---|
| Posts por API | **100 cada 24 h** (rolling). Un carrusel cuenta como 1 |
| Formato de imagen | **solo JPEG**. PNG y WebP fallan |
| Hosting del media | la URL tiene que ser **pública y accesible** en el momento de publicar. Nada de `localhost` ni de un bucket privado |
| Reels | hay que **poletear el `status_code` del contenedor** hasta `FINISHED` antes de `media_publish`, o falla |
| No soportado | filtros, etiquetas de producto, búsqueda por hashtag, partnership ads |
| **Etiqueta de IA** | política ONIA ya vigente: el contenido de Lucía se publica **declarado como IA**. No se esconde. Ver memoria `[[ai-influencers-account-ops]]` |

### 6.3 Enlaces oficiales

- Instagram API with Instagram Login: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login
- Overview / Standard vs Advanced Access: https://developers.facebook.com/docs/instagram-platform/overview/
- App Review (la tabla que dice "Not required"): https://developers.facebook.com/docs/instagram-platform/app-review
- Content Publishing: https://developers.facebook.com/docs/instagram-platform/content-publishing
- Modos de app (Development/Live) y roles: https://developers.facebook.com/docs/development/build-and-test/app-modes/ · https://developers.facebook.com/docs/development/build-and-test/app-roles/

---

## 7. Después: la WABA propia de ONIA

**Aclaración que cambia el plan y conviene entender bien:** para **tus propios números** y para números que vivan **bajo el portfolio de ONIA**, **no hace falta App Review**. Alcanza con Cloud API + system user token. App Review / Advanced Access hace falta **solo** para ser **Tech Provider con Embedded Signup de marca ONIA**, donde el cliente onboardea su propia WABA desde tu web. `[CONFIANZA ALTA, pero validalo con un número real antes de venderlo así]`

O sea: **con la verificación aprobada y sin App Review, ONIA puede operar hasta 20 números** — el propio + los de clientes que acepten vivir bajo el portfolio de ONIA. Ese es el camino corto al negocio de chatbots. El Tech Provider propio es la fase 2.

### 7.1 Decisión previa: qué número usa el bot

`+591 78491375` **ya tiene WhatsApp**. Si lo registrás en Cloud API "a lo bruto", perdés la app de WhatsApp en el teléfono y el historial.

| Opción | Qué pasa | Cuándo elegirla |
|---|---|---|
| **A. Coexistencia** ✅ recomendada | Seguís usando la app de WhatsApp Business en el teléfono **Y** el número queda conectado a la API. Sincroniza contactos y chats recientes. Requiere **WhatsApp Business app v2.24.17 o superior** y cuenta de **Business** (no personal). **Bolivia NO está en la lista de países no soportados** (los excluidos son AU, JP, NG, PH, RU, KR, ZA, TR, CH, y todo EEE/UE/UK) | El número público de ONIA, que Sergio necesita seguir usando a mano |
| **B. Migración completa** | Borrás la cuenta de WhatsApp del teléfono y registrás el número en Cloud API. **Se pierde el historial** y no podés volver a usar la app con ese número salvo que lo des de baja de la API | Solo si el número es exclusivo del bot |
| **C. Número nuevo dedicado** | SIM nueva (no VoIP), solo para el bot. Cero riesgo sobre el número comercial | Si querés el teléfono de Sergio intacto. Costo: una SIM y que el número nuevo no tiene reputación |

**Recomendación:** **A (coexistencia) sobre `+591 78491375`.** Es el número que va en el sitio, en las propuestas y en el formulario de verificación; que el bot conteste ahí es coherente y no te obliga a re-cablear nada.

### 7.2 Pasos

| # | Paso | Dónde |
|---|---|---|
| 1 | Crear la app de WhatsApp | `developers.facebook.com/apps` → **Crear app** → caso de uso **"Conectar con clientes a través de WhatsApp"** → tipo **Negocio** |
| 2 | **Reclamar la app con el portfolio `OniaAgency`** | panel de la app → Configuración → Básica → Portfolio. ⚠️ Esta sí va del lado comercial (al revés que la de Lucía) |
| 3 | Agregar el producto **WhatsApp** → **Configuración de la API** | crea o vincula la **WABA** |
| 4 | Agregar el número `+591 78491375` **por coexistencia** | flujo de "Agregar número" → opción de coexistencia con la app de WhatsApp Business |
| 5 | **Display name** | tiene que relacionarse con el negocio real. Propuesto: `OniaAgency`. Sin promociones, sin "el mejor..." |
| 6 | **PIN de verificación en dos pasos** | generarlo y **guardarlo en el gestor de secretos**. Sin el PIN no se puede cambiar ni dar de baja el número |
| 7 | **System user + token permanente** | Config. del negocio → **Usuarios del sistema** → crear **regular system user** → asignar la WABA → generar token con `whatsapp_business_messaging` + `whatsapp_business_management` |
| 8 | Guardar el token | **credencial de n8n** (Header Auth). Nunca `$env`, nunca hardcodeado en el nodo — plan VPS |
| 9 | **Webhooks suscritos** | `messages`, `message_template_status_update`, `account_update`, `phone_number_quality_update` — y para coexistencia también `history`, `smb_app_state_sync`, `smb_message_echoes` |
| 10 | **Método de pago** en la WABA | tarjeta internacional en USD |
| 11 | **Plantillas iniciales** cargadas y aprobadas | ver `ONIA_CHATBOT_PROPIO_SPEC_20260725.md` |
| 12 | **Confirmar el cap 2 → 20** | WhatsApp Manager. Si no subió, la verificación no impactó a esa WABA → revisar de qué portfolio cuelga |

**Regla ONIA de tokens (del playbook, no la repito por gusto):** **un regular system user por cliente**, con solo los activos de ese cliente asignados. El admin system user solo para asignar permisos, con custodia especial. Meta, textual: *"Create one system user for each type of access you need... if a system user token is compromised, it has limited scope and can't compromise more permissions."*

### 7.3 Enlaces oficiales

- Cloud API — Get Started: https://developers.facebook.com/docs/whatsapp/cloud-api/get-started
- Números de teléfono de negocio: https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/phone-numbers
- Registrar un número: https://developers.facebook.com/documentation/business-messaging/whatsapp/business-phone-numbers/registration
- Migrar un número existente: https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/migrate-existing-whatsapp-number-to-a-business-account/
- Coexistencia: https://developers.facebook.com/documentation/business-messaging/whatsapp/solution-providers/coexistence/

---

## 8. Fuentes

**Oficiales de Meta:**
- Verificar tu negocio en Meta Business Suite — https://www.facebook.com/business/help/2058515294227817
- Acerca de la verificación de negocio — https://www.facebook.com/business/help/1095661473946872
- Documentos aceptados — https://www.facebook.com/business/help/159334372093366
- Por qué se rechazó una verificación — https://www.facebook.com/business/help/2342133782492969
- Crear un portfolio (límite de 2) — https://www.facebook.com/business/help/1710077379203657
- Los activos no se mueven entre portfolios — https://www.facebook.com/business/help/742119383392414
- Editar la categoría de la Página — https://www.facebook.com/business/help/222732947737668
- Buenas prácticas para elegir categoría — https://www.facebook.com/business/help/376650512904346
- Verificación de dominio — https://developers.facebook.com/docs/sharing/domain-verification/verifying-your-domain
- Instagram Platform: overview, app review, content publishing, Instagram Login — ver §6.3
- WhatsApp Cloud API — ver §7.3

**Terceros (marcados como tales en el texto):** guías de verificación y listas de causas de rechazo de Wati, Interakt, Brevo y otros BSP de WhatsApp. Se usaron **solo** para lo que Meta no publica: cantidad de reintentos, tiempos observados en la práctica y frecuencia relativa de cada causa de rechazo.

**Verificado en vivo el 2026-07-26 por el agente:** `https://onia.com.bo` y `https://onia.com.bo/privacidad` (§0).

---

## 9. Lo que queda abierto

| # | Pendiente | Dueño |
|---|---|---|
| 1 | **Footer legal en `onia.com.bo`** con nombre legal, NIT, dirección y teléfono | **Sesión B — ONIA Platform**. Bloquea el envío |
| 2 | Decidir el teléfono único (`78491375` vs `75470140`) y unificarlo en sitio + propuestas + generador | Sergio decide; la propagación al generador es de esta sesión |
| 3 | Email en las propuestas y el generador: siguen con gmail y con `75470140` | esta sesión, después de (2) |
| 4 | ¿Meta exige código postal para Bolivia? | se ve al llenar el formulario. Anotarlo acá |
| 5 | ¿Cuántos reintentos permite Meta realmente? | Meta no lo publica. Anotar lo que muestre la UI si llega a rechazar |
| 6 | Confirmar que sin App Review se pueden operar 20 números de clientes bajo el portfolio de ONIA | validar con el 2º número real antes de venderlo así |
