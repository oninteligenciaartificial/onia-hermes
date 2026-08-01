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

Verificado, no "construido":

- La app corre en el VPS con HTTPS y su propia base (Supabase self-hosted). 112 MB de RAM.
- **Registro y login funcionan** de punta a punta.
- **`PLATFORM_LAYER=1` y `AGENTS_RUNTIME=1`** — encendidos el 2026-08-01. Antes estaban
  vacíos: toda la capa multi-rubro y el módulo de agentes estaban **inertes**.
- Aislamiento por rubro en pantallas **y** en las 86 rutas de API.
- Permisos por rol: recepción ya **no** ve la historia clínica y **sí** ve la caja.
- Agenda propia (Cal.com) conectada a la landing con los datos precargados.

## 2. Qué está a medias, y dónde exactamente

| Qué | Estado real |
|---|---|
| **La landing nueva** | Construida y verificada, **no desplegada**. `onia.com.bo` sirve una versión vieja desde Vercel |
| **Pack importadora** | Declarado y provisiona. **Sin pantallas ni entidades propias**: entra a un menú vacío |
| **Chatbot** | **Dos bots en dos repos**, sin una línea compartida. Sergio está revisando cuál sobrevive |
| **Cola de aprobación** | Las tablas existen y los flags están on. Falta que el cron genere las primeras propuestas |
| **3 módulos del core sin portar** | `automation`, `payroll`, `knowledge` — `imports` ya se portó |
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
| 2 | **NIT + homologación SIAT** | Facturación real. **Caduca 1-oct-2026** |
| 3 | **Número de WhatsApp Business** en Meta | El chatbot |
| 4 | **Cuál chatbot sobrevive** (lo está revisando) | Que no nazca un tercero |
| 5 | **Ticket promedio por cita** en Santa Cruz | El argumento de venta en plata |
| 6 | **Abogado** para el borrador legal | Publicar términos con datos de salud |
| 7 | **SENAPI PI-112** (Bs 75) | Registrar la marca |
| 8 | **Clave SMTP de Brevo** + dominio verificado | Verificación real de correo |

---

Detalle: `ONIA_PLANES_REQUISITOS_20260801.md` (**qué da cada plan** — la matriz a gatear) ·
`ONIA_PLATFORM_ESTRUCTURA_20260730.md` (qué existe) ·
`ONIA_SELF_SERVICE_ARQUITECTURA_20260731.md` (el cobro) ·
`ONIA_CORE_Y_MODULOS_ANALISIS_20260731.md` (por qué el core no es todavía la columna) ·
`ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md` (precio por valor) ·
`ONIA_PARQUEADO_20260730.md` (todo lo congelado).
