# Onia Platform — EL plan

> **2026-08-01.** Este es el único documento que hay que leer para saber qué se está
> haciendo y qué sigue. Todo lo demás en esta carpeta es detalle de respaldo.
>
> Regla de la casa (CLAUDE.md): **construido ≠ terminado**. Una función solo cuenta cuando
> está encendida en producción y verificada ahí. Nada se abre sin cerrar lo anterior.

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
| **4 módulos del core sin portar** | `automation`, `imports`, `payroll`, `knowledge` |
| **El espejo del core** | Espeja **un solo track**; el pack eléctrico tiene sus datos copiados a mano |
| **Legal** | Borrador serio, pero sin anexo de tratamiento de datos y sin los plazos de retención nombrados |

## 3. El orden. Una cosa a la vez.

### 🔴 Ahora — el core como columna vertebral
**Por qué primero:** mientras el producto copie el core a mano, cada rubro nuevo es escribir
código de cero. Con el espejo multi-track, un rubro nuevo es **encender capacidades**.

1. Espejo multi-track + borrar el contrato copiado a mano del pack eléctrico.
2. Alinear la máquina de estados de work items (el core manda).
3. Portar **`imports`** entero como prueba del camino, y **dejar escrito el procedimiento**
   para que portar los otros tres sea mecánico.

### 🟠 Miércoles 5-ago — la pasarela
El modelo ya está decidido (§`ONIA_BCP_REUNION_20260805.md` §0-bis): **QR dinámico por cobro**
+ **lectura de movimientos por API**. De las cuatro piezas del cobro, **solo una depende del
banco**; las otras tres se construyen igual.

### 🟡 Después — los módulos por rubro
Con el core como fuente, cada rubro es: encender capacidades → pantallas propias → seeder demo.

### ⚪ Al final — el 100% automatizable
Ver §4. **No se arranca hasta que el core sea la fuente**, o se construye sobre arena.

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

Detalle: `ONIA_PLATFORM_ESTRUCTURA_20260730.md` (qué existe) ·
`ONIA_SELF_SERVICE_ARQUITECTURA_20260731.md` (el cobro) ·
`ONIA_CORE_Y_MODULOS_ANALISIS_20260731.md` (por qué el core no es todavía la columna) ·
`ONIA_VALOR_Y_ESCALERA_PLANES_20260731.md` (precio por valor) ·
`ONIA_PARQUEADO_20260730.md` (todo lo congelado).
