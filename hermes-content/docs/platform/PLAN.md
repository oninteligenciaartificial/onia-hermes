# Onia Platform — EL plan

> **2026-08-01.** Este es el único documento que hay que leer para saber qué se está
> haciendo y qué sigue. Todo lo demás en esta carpeta es detalle de respaldo.
>
> Regla de la casa (CLAUDE.md): **construido ≠ terminado**. Una función solo cuenta cuando
> está encendida en producción y verificada ahí. Nada se abre sin cerrar lo anterior.

## 🎯 Objetivo vigente — empezar a ofrecer

> **Un dueño de clínica entra solo, se registra, paga y queda operando, sin que Sergio
> toque nada.**

Esa frase es el criterio de "hecho": se verifica haciendo el recorrido completo en
producción, no en localhost. Mientras no se pueda hacer ese recorrido, **no hay nada que
ofrecer** — por más módulos que existan.

**La decisión que destraba la fecha: prueba gratis de 14 días sin tarjeta.** Hoy la
cadena de venta depende del banco, y la reunión con el BCP es recién el miércoles 5-ago.
Con trial, la cadena funciona COMPLETA desde ya y el cobro pasa a ser una conversión, no
un requisito para arrancar. Se puede ofrecer el lunes sin esperar al banco.

---

## Dónde vive cada cosa

| | Dónde |
|---|---|
| **Código del producto** | `C:\dev\proyectos\onia-platform` (repo `onia-platform`) |
| **Landing** | `onia-hermes/web-factory/apps/onia-platform` |
| **Núcleo** | `onia-hermes/onia-core` — congelado en v1.0.0 |
| **Docs de la plataforma** | **esta carpeta** (`hermes-content/docs/platform/`) |
| **Producción** | VPS `187.77.16.63` — app, base y agenda, todo propio |

---

## 1. Qué está VIVO en producción hoy

> **Actualización 2026-08-06 (deploys #17-19, verificado en vivo):** SEIS rubros
> elegibles en el registro (dental · comercio · importadora · **estética** ·
> **veterinaria** · **servicios profesionales**) — 6 cards confirmadas en prod.
> Registro NUEVO en 2 pasos (14 campos → 4; Google 1-clic; split-screen de marca)
> + login hermanado. Checkout con stepper, QR-terminal y **garantía del 1er mes**
> (también en /terms). **Agentes visibles por PLAN desde el día 1** (trial =
> professional → nav Agentes + cron proponiendo; antes eran invisibles salvo grant
> manual — hallazgo de la auditoría de promesas, 60 claims verificadas:
> `ONIA_AUDITORIA_PROMESAS_LANDING_20260806.md`). Export CSV en todo plan pago.
> Confirmación de cita por WhatsApp click-to-chat (sin esperar Meta). Landing con
> /comparativa viva, chips 6 rubros y captura real del registro nuevo.
> ⚠️ Bloqueo nuevo D8: el QR de cobro en prod es un QR DentalGest de cuenta ajena
> y con vencimiento — falta el QR de la cuenta Onia (agenda maestra §D).

Verificado, no "construido". **2026-08-01, 5 deploys en el día — el último con todo:**

- **Registro multirubro con configuración previa**: arranca en "¿Qué tipo de negocio
  tenés?" (dental · comercio · 9 rubros "pronto"); el copy sigue al rubro elegido.
- **Contabilidad Bolivia transversal** (`/contabilidad`): RCV dental y comercio,
  resumen IVA 13%/IT 3% (Ley 843 citada), vencimiento por dígito de NIT (D.S. 25619),
  balance, CSV para el contador. Resumen en Básico, completo desde Profesional.
- **Identidad Onia en toda la app**: tokens verdes de la web, logos oficiales v2 por
  lámina (tinta+punto verde / claro+punto verde), cero "DentalGest" visible, la raíz
  redirige a /login (la landing dental interna murió). Trial dice 14 días en todos lados.
- **Backup diario de la base real** (03:00, guarda 7, probado) — antes NO existía.

- La app corre en el VPS con HTTPS y su propia base (Supabase self-hosted).
- **Registro y login funcionan** de punta a punta.
- **Trial de 14 días sin tarjeta** — estado derivado de fechas (`trialing→active→past_due→canceled`),
  migración `planCanceledAt` aplicada en prod. La degradación no borra nada: lectura+exportar.
- **El alta entra por `provisionOrganization`** — el rubro sale del contrato del core.
- **Módulo comercio vivo**: `/comercio` (catálogo·inventario·caja) responde en prod detrás
  del gate; migración kardex/lotes/caja aplicada; kardex al promedio ponderado (D.S. 24051).
- **Onboarding por pasos** que termina con datos reales cargados (servicios con precio → Treatment).
- Review pre-merge: 0 CRITICAL; 3 HIGH cerrados + 1 propio (baja invisible al guard de
  TODAS las rutas — arreglado en el select compartido de auth).
- `PLATFORM_LAYER=1` y `AGENTS_RUNTIME=1` encendidos. Aislamiento por rubro en pantallas
  y en las rutas de API. Landing en el VPS (:8091). `onia-forms` en el VPS (:8189).
- Agenda propia (Cal.com) conectada a la landing con los datos precargados.

## 2. Qué está a medias, y dónde exactamente

| Qué | Estado real |
|---|---|
| **DNS** | La landing y forms están vivos en el VPS pero `onia.com.bo` sigue resolviendo a Vercel. **Los 4 registros A son de Sergio** (zona DNS = Vercel, pestaña Domains → DNS Records) |
| **Registro sin selector de rubro** | La API acepta `verticalTrackId`; el formulario público aún no lo ofrece. El alta comercio entra por API/demo/operador |
| **FEFO y conteos** | Lógica portada y testeada, **sin UI** — la venta no descuenta por lotes todavía |
| **Título/branding** | La app sirve `<title>DentalGest…` — branding viejo, el producto es Onia Platform |
| **Pack importadora** | Declarado y provisiona. **Sin pantallas ni entidades propias**: entra a un menú vacío |
| **Chatbot** | **Dos bots en dos repos**, sin una línea compartida. Sergio está revisando cuál sobrevive |
| **Cola de aprobación** | Las tablas existen y los flags están on. Falta que el cron genere las primeras propuestas |
| **Contador Pack (Gestios)** | Siguiente porte — transversal a todos los rubros. `automation`, `payroll`, `knowledge` del core también pendientes |
| **Legal** | Borrador serio, pero sin anexo de tratamiento de datos y sin los plazos de retención nombrados. **Parqueado a propósito**: no bloquea la prueba gratis, sí bloquea publicar términos con datos de salud |

## 3. El orden. Una cosa a la vez.

### ✅ Cerrado — el core como columna vertebral *(2026-08-01)*
El producto ya se construye SOBRE el core en vez de copiarlo. El espejo es multi-track
(11 packs, 9 módulos), el contrato del pack eléctrico que estaba transcrito a mano se
borró y ahora se deriva, la máquina de estados de work items quedó alineada con el core,
y `imports` se portó entero como prueba del camino. **791 tests verdes** y un gate que
falla de verdad si el core y el producto se separan. Procedimiento escrito en
`ONIA_CORE_PORT_PROCEDURE.md` para que portar los otros tres sea mecánico.

### 🔴 Ahora — la cadena de venta encendida
Tres frentes en paralelo, uno por carril:

1. **La landing servida desde el VPS.** Hoy `onia.com.bo` sirve una versión vieja desde
   Vercel. Es el bloqueo número uno: sin esto no hay nada que mostrar.
2. **El self-service de verdad.** Tres defectos diagnosticados: el pago crea un recibo y
   nunca toca el plan · `planEnd` se recalcula desde hoy y el cliente pierde los días que
   pagó · el registro no usa `provisionOrganization`, así que el alta solo puede crear
   clínicas dentales. Más el trial de 14 días y el onboarding por pasos.
3. **El onboarding que no da vergüenza.** Sergio lo probó: *"siento que es muy pobre"*.
   Asistente paso a paso, una decisión por paso, y que termine con **un dato real cargado**
   — el pecado capital es caer en un dashboard vacío.

### 🟠 Miércoles 5-ago — la pasarela
El modelo ya está decidido (§`ONIA_BCP_REUNION_20260805.md` §0-bis): **QR dinámico por cobro**
+ **lectura de movimientos por API**. De las cuatro piezas del cobro, **solo una depende del
banco**; las otras tres se construyen igual. Con el trial, esta fecha ya no bloquea la oferta.

### 🟡 Los módulos por rubro — orden decidido
Mapa completo en `ONIA_MODULOS_20260801.md`. Decisión 2026-08-01: **Gestios muere como
producto y entra como módulo de comercio/inventario** (kardex, FEFO, caja, Contador Pack
se portan; su auth/deploy no). `onia-platform` es el único repo que va a producción.
Orden: comercio (código ya existe) → contabilidad Bolivia (transversal, sirve a todos)
→ importadora → el resto con cliente que pague.

### ⚪ Al final — el 100% automatizable
Ver §4. Ahora sí se puede arrancar: el core ya es la fuente.

---

## 4. La plataforma 100% automatizada — el norte

> Sergio 2026-08-01: *"que la plataforma sea 100% automatizable y 100% inteligencia
> artificial para facilitar muchísimos trabajos"*.

**Lo que YA existe y hay que conectar, no inventar:**

- **El patrón human-in-the-loop está construido y es correcto:** el agente propone → el dueño
  aprueba → recién ahí se ejecuta. Con idempotencia garantizada en la base y cupo del add-on
  respetado. **Ese patrón es el activo**, y es lo que lo hace vendible: automatización que no
  manda nada sin permiso.
- **n8n** con 11 workflows vivos en el VPS.
- **Crawl4AI** para el alta por extracción.
- **Chatwoot** como canal humano cuando el bot escala.

**Lo que falta decidir, y es la pregunta de fondo:** dónde vive la inteligencia.
El contrato del core ya lo responde a medias (`external_gate`, `intakePolicy`): el core define
**qué** se puede proponer y con qué guardarraíles; el producto ejecuta las herramientas del
tenant; el gateway transporta. **Respetar eso** en vez de meter IA suelta en cada pantalla.

**Lo que hay que investigar antes de construir** — está lanzado como investigación aparte:
qué se automatiza con Meta/WhatsApp y qué prohíbe su política · qué conviene en n8n y qué en
el producto · si tiene sentido un agente *instalado en la empresa* del cliente o todo
centralizado · y cuánto cuesta cada camino por cliente y por mes.

---

## 5. Lo que depende de Sergio

| # | Qué | Traba |
|---|---|---|
| 1 | **DNS**: `app.onia.com.bo` y `onia.com.bo` → `187.77.16.63` | Que alguien pueda entrar |
| 2 | **NIT + homologación SIAT** | Facturación real. *(Decía «caduca 1-oct-2026»: ese plazo quedó sin efecto, RND 102600000038, 30-sep-2026)* |
| 3 | **Número de WhatsApp Business** en Meta | El chatbot |
| 4 | **Cuál chatbot sobrevive** (lo está revisando) | Que no nazca un tercero |
| 5 | **Ticket promedio por cita** en Santa Cruz | El argumento de venta en plata |
| 6 | **Abogado** para el borrador legal | Publicar términos con datos de salud |
| 7 | **SENAPI PI-112** (Bs 75) | Registrar la marca |
| 8 | **Clave SMTP de Brevo** + dominio verificado | Verificación real de correo |

---

Detalle: `ONIA_PLANES_REQUISITOS_20260801.md` (**qué da cada plan** — la matriz a gatear) ·
`ONIA_PLATFORM_ESTRUCTURA_20260730.md` (qué existe) ·
`../historial/ONIA_SELF_SERVICE_ARQUITECTURA_20260731-20260801.md` (el cobro) ·
`../historial/ONIA_CORE_Y_MODULOS_ANALISIS_20260731.md` (por qué el core no es todavía la columna) ·
`ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md` (precio por valor) ·
`ONIA_PARQUEADO_20260730.md` (todo lo congelado).
