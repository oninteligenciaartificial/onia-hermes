# Cómo se vende una página web

> 🔴 **2026-08-27 — NO hay equipo de ventas.** Decisión de Sergio: no hay vendedora, no
> hay colaboradores comerciales, no hay nadie externo vendiendo. **El que vende es Sergio.**
> Todo lo que este doc dice sobre "la vendedora" y sus comisiones queda **SUSPENDIDO**: no
> es una regla vigente, es cómo se pensaba operar cuando se planeaba un equipo.
> No se borra porque el resto del proceso sí sirve — pero **nadie debe ejecutar un pago de
> comisión ni escribir material dirigido a un vendedor** mientras esto siga así.

**Qué vendemos cuando alguien pide una web, cómo se compra, quién la construye y qué
necesitamos del cliente.**

> Fuente de verdad viva, sin fecha en el nombre: esto se EDITA, no se reemplaza.
> Nace de la pregunta de Sergio (2026-08-22): *"quiero que veas cómo sería nuestro proceso
> si nos piden una página web, ¿tenés eso ya armado y cómo la pueden comprar?"*.
>
> **La respuesta corta: sí, está armado — pero estaba repartido en cinco archivos y ningún
> doc lo contaba entero.** El motor existe y funciona (`web-factory/`), el proceso está
> escrito (playbook interno), el precio existe y está en código vivo. Lo que faltaba era
> esto: un solo lugar que lo diga en orden. Y una decisión de precio que venció hace 22
> días (§8).

---

## 1. Qué vendemos exactamente

Tres paquetes cerrados y un mensual. No se vende "una web": se vende **uno de estos tres**,
con su alcance listado y su plazo, más el mensual pegado en la misma firma.

| Paquete | Qué es | Template del motor |
|---|---|---|
| **Landing de Captación** | Una página. Servicios, prueba de confianza y un solo canal de conversión (WhatsApp o formulario). Para el negocio cuyo problema es *estar online y captar*. | `landing`, `landing-focus` |
| **Web Profesional** | Sitio multipágina: servicios, casos o catálogo, cobertura, contacto. Aparece en Google y los pedidos llegan ordenados. | `landing-clinic`, `landing-realestate`, `landing-logistics` |
| **Web Pro Onia** | Lo anterior + alcance mayor cerrado por escrito: catálogo con ficha, carrito y checkout, o formularios que entran a un CRM/n8n. | `store` + bloques |
| **Cuidado Web** (mensual) | Hosting gestionado, respaldos, cambios de contenido, monitoreo. **Va con toda web, siempre.** | — |

Templates realmente válidos hoy (verificado en `web-factory/data/schema.ts`,
`WEB_FACTORY_TEMPLATES`): `landing` · `store` · `dashboard` · `landing-focus` ·
`landing-clinic` · `landing-realestate` · `landing-logistics`.
⚠️ La skill `onia-web-factory` todavía lista solo 5 — le faltan `landing-realestate` y
`landing-logistics`. Se corrige la skill, no el código.

### La regla de frontera: cuándo YA NO es una web

Está escrita y vive en el panel de vendedores (`/vendedores/webs`). **Se vende como web**
cuando el problema es presencia, confianza y captura simple, y el cliente no necesita login,
roles, dashboard ni procesos internos. **Deja de ser web** —y pasa a ser Onia Platform, o
"Portal / mini sistema desde Bs 6.500"— apenas aparece cualquiera de estas cuatro:

- base de datos con clientes, pedidos, citas o inventario,
- usuarios con permisos distintos,
- automatizaciones críticas o integraciones con WhatsApp/API,
- reportes, pagos, facturación o portal privado.

Cotizar como web algo que es sistema es la forma más cara de perder plata en este carril.

### El diferencial que sí es nuestro (todavía no está construido)

Hoy vendemos web y sistema como dos cosas separadas. **Conectados valen el doble y nadie en
Santa Cruz lo ofrece**: Forges vende sistemas sin web, las agencias venden webs sin sistema.
Los 4 circuitos y el estado real de cada uno están en
`hermes-content/docs/ONIA_WEB_CONECTADA_AL_SISTEMA.md` — el #1 (formulario → lead en el
sistema) ya tiene precedente funcionando. **Hasta que esté encendido y verificado en
producción, no se le nombra al cliente.**

---

## 2. Qué NO incluye (regla de la casa, en toda propuesta)

Nunca entra en nuestro precio; siempre lo paga el cliente y queda a su nombre:

- **Dominio** — lo compra el cliente, **a su nombre**. Lo guiamos, no lo pagamos.
- **Hosting** — cuenta del cliente.
- Correo profesional.
- Afiliación y comisión de la pasarela de pago (BCP, QR).
- Créditos de IA.
- Mensajería y plantillas de WhatsApp Business API.
- Presupuesto de pauta publicitaria.
- Fotografía profesional y producción externa.
- Migración masiva de contenido.

Y lo que no se promete nunca: ventas garantizadas, posiciones en Google, viralidad, ni
automatización de WhatsApp antes de que Meta valide el número.

---

## 3. El proceso, paso a paso

### Fase 0 — Antes de tocar nada

1. **Auditoría / diagnóstico por Zoom, 30 min: GRATIS.** Es el gancho de apertura, no un
   producto. (Auditoría Express Bs 250 y Diagnóstico + Plan Bs 690 figuran en las listas
   viejas pero **no se cobran hoy**.)
2. **Aplicar la frontera del §1**: ¿es web o es sistema? Si es sistema, cambia el carril y
   cambia el precio.
3. **Cotizar** con el paquete recomendado en el medio, anclado arriba y abajo (§5).
4. **Anticipo 50% confirmado. Sin anticipo no se arranca.** Regla dura.
5. **Intake completo** — el cuestionario ya existe: `web-factory/INTAKE_CLIENTE.md`
   (secciones 1–7 van al cliente; la 8, legal y pagos, la guía Onia). Lo que el cliente no
   responde se marca `PENDIENTE`; **no se inventa**.
6. Accesos: dominio, hosting, redes, y pasarela si el paquete la lleva.

### Fase 1 — Construcción (la hace el motor, no una persona escribiendo HTML)

Todo desde `C:\dev\proyectos\onia-hermes\web-factory`. Comandos verificados:

```powershell
pnpm client:new -i data/intakes/<archivo>.intake.json   # intake → perfil de cliente
pnpm design:auto <slug> -t <template>                   # receta de diseño
pnpm generate <slug> --template <template>              # → out/<slug>/index.html + site.css
# o todo de una pasada:
pnpm factory:build <slug> -t <template> --force
pnpm factory:build <slug> --dry-run    # lista los "pending inputs" que faltan del cliente
```

**Escribir React/Next a mano para un cliente es trabajar por fuera del motor.** El sitio
sale de `data/clients/<slug>.json` + un template.

Quién lo hace: skill **`onia-web-factory`** + subagente **`web-factory-builder`**.
Antes de diseñar, la regla de Sergio: galería interna
(`hermes-content/references/ui-patterns/`, Pattern Bank, `data/references`) y exigir
**≥4 Required Qualities**. Nada de card-grid uniforme ni hero genérico.

### Fase 2 — Gates (no es entregable hasta pasarlos)

- `pnpm test` + `pnpm e2e` (incluye axe WCAG 2.2 AA y presupuesto de Core Web Vitals).
- `pnpm images:check <slug>`.
- **Checklist de 17 puntos de indexabilidad** (`web-factory/FACTORY.md` y la skill), corrida
  **sobre el sitio servido**, no leyendo el código: robots, sitemap, 404 propio, canonical,
  favicon, OG sin imagen inventada, `metadataBase`, `lang="es"`, una sola `h1`, alts, cero
  links rotos, HTTPS sin contenido mixto, contenido presente en el HTML servido.
- Verificar **mirando** la pantalla renderizada. Un 200 y un grep no son verificación.

### Fase 3 — Publicación y entrega

- Apuntar el dominio del cliente + SSL.
- ⚠️ **La publicación es MANUAL.** No existe script `deploy` en `web-factory/package.json`:
  el pipeline termina en `out/`. Esa mano de obra se presupuesta, no se regala.
- Capacitación corta al cliente.
- **Activar el Cuidado Web mensual en la misma firma.** Ahí está el margen real.

---

## 4. Cuánto tarda

Dos relojes distintos, y confundirlos es lo que hace que un plazo se caiga.

**Construcción real con el motor** (fuente: `PRICING_RATIONALE_INTERNO.md` §3):

| Entregable | Tiempo de construcción |
|---|---|
| Landing | 4–6 h |
| Web Profesional (multipágina) | 1,5–2 días |
| Catálogo + carrito | +1 día |
| Integración pasarela (BCP) | +1 día |
| Flujo n8n (orden → WhatsApp) | +1 día |
| CRM de captación configurado | 2 días |

**Plazo que se le promete al cliente: 2 a 3 semanas** desde el anticipo *y* la entrega de
contenidos (es el que ya se usó en la propuesta a AW Climatización). La diferencia entre 6
horas y 3 semanas no es holgura inventada: es intake, ida y vuelta de contenidos, revisiones,
los gates y la publicación manual. **El cuello de botella casi nunca somos nosotros: es el
material del cliente.** El plazo arranca cuando llegan las dos cosas, anticipo y contenidos.

---

## 5. Cómo se compra

### Circuito

```
Auditoría gratis  →  ¿web o sistema?  →  cotización (generador)  →  anticipo 50%
   →  intake  →  construcción  →  gates  →  publicación  →  50% final + mensual activo
```

- **No hay autoservicio.** No existe carrito ni checkout para comprar una web: se cotiza, se
  firma y se paga por transferencia o QR. **Cada proyecto se cotiza aparte**; la tabla de
  abajo es el ancla de referencia, no una lista cerrada.
- **La propuesta NUNCA se escribe a mano**: se genera con
  `hermes-content/propuestas/generador/` → `node generar-propuestas.js <slug> --pdf`.
- **Pago: 50% anticipo, 50% contra entrega.** Precio reservado 30 días con pago confirmado.
- **Sergio aprueba** precio final, descuentos y alcance antes de enviar.
- **Quién la construye:** el motor `web-factory`, operado por el subagente
  `web-factory-builder` bajo la skill `onia-web-factory`. No se subcontrata.

### El precio — SÍ existe, y esto es lo que dice hoy

Tres fuentes del repo dicen exactamente lo mismo, y una de ellas es **código vivo**:

⚠️ **La columna de comisión está SUSPENDIDA** (no hay vendedores — ver el aviso del
encabezado). Se deja escrita para no perder el esquema si algún día hay equipo.

| Paquete | Precio Bs (pago único) | ~~Comisión vendedora~~ (suspendida) |
|---|---:|---:|
| Landing de Captación | **790** | 10% |
| Web Profesional | **1.500** | 12% |
| Web Pro Onia | **2.900** | 12% |
| Portal / mini sistema (ya no es web) | desde **6.500** | 10% |

| Cuidado Web (mensual) | Precio Bs/mes | Comisión |
|---|---:|---:|
| Básico | 190 | 10% |
| Crecimiento | 390 | 10% |
| Pro | 690 | 10% |

**Fuentes (las tres coinciden):**

1. `web-factory/apps/site/src/app/vendedores/cotizador-data.ts` líneas 55–57 y 65–67 —
   **el único archivo que un vendedor consulta de verdad**: alimenta `/vendedores/cotizador`.
2. `hermes-content/docs/historial/ONIA_PRICING_2026.md` líneas 58–60 y 183–189.
3. `hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md` §2.

~~**Comisión de la vendedora: una sola vez, sobre el primer pago neto real cobrado.** Los
pagos siguientes son de Onia.~~ — **SUSPENDIDO desde el 2026-08-27: no hay vendedores.**

🟡 **Superficie huérfana detectada:** `/vendedores/cotizador` y `/vendedores/webs` son
pantallas VIVAS en `web-factory` construidas para un vendedor que no existe. No se tocan en
este barrido porque son rutas publicadas y sacarlas es una decisión aparte — pero quedan
anotadas: son código mantenido para un puesto vacío.

⚠️ **Estos precios están vencidos y hay un conflicto abierto. Leer §8 antes de cotizar.**

---

## 6. Qué necesitamos del cliente

El cuestionario completo es `web-factory/INTAKE_CLIENTE.md`. Lo mínimo sin lo cual el
proyecto no arranca:

**Bloqueantes (sin esto no hay sitio):**

- Nombre comercial exacto y descripción del negocio en 2–3 líneas.
- **Logo** en PNG/SVG con fondo transparente (o decisión escrita de usar texto o iniciales).
- **Un asset de héroe real** — foto o video propio. No se inventa ni se fabrica un mockup.
- **Canal de conversión** definido: número de WhatsApp o correo del formulario.
- **Dominio** comprado a nombre del cliente, con acceso al DNS.
- Contacto, dirección y horarios.

**Necesarios para que no salga genérico:**

- Colores de marca (HEX) o manual de marca.
- 2–3 webs de referencia que le gusten **y por qué**, más lo que NO quiere.
- Servicios o productos con su texto y sus fotos.
- Hito de confianza real (años de operación, representación oficial, clientes atendidos).

**Si el paquete lleva pasarela o WhatsApp:** afiliación al botón de pago del banco y número
verificado con Meta. Los dos son trámites del cliente y son **bloqueantes con plazo propio**.

`pnpm factory:build <slug> --dry-run` imprime los *pending inputs* que faltan: **ese listado
es el checklist que se le pide al cliente, no se inventa.**

---

## 7. El choque con "Onia vende software, nunca horas"

Sí choca, y hay que decirlo: un proyecto web es un encargo de servicio con discovery,
revisiones y entrega — la forma exacta de una agencia. Si se deja correr, termina en "cuántas
horas te tomó" y en cambios ilimitados.

**Cómo se encuadra como producto y no como horas** (cinco reglas, todas ya practicables):

1. **Paquete cerrado, no presupuesto abierto.** Se vende uno de los tres del §1, con su
   alcance listado en la propuesta. El precio es del paquete, **no por hora ni por página**.
2. **Plazo fijo y forma de pago fija.** 2–3 semanas, 50/50. No se cotiza tiempo.
3. **La web nunca se vende sola.** Sale con Cuidado Web en la misma firma. Eso la convierte
   en **puerta de entrada a un recurrente**, no en un trabajo que empieza y termina.
4. **Lo que se cobra es el resultado y la velocidad, no el diseño.** La ventaja interna —el
   motor `web-factory` y la librería de bloques— es **confidencial**: al cliente nunca se le
   dice "es plantilla". Él compra un sitio a medida, entregado rápido.
5. **Fuera del paquete no se descuenta ni se improvisa: se cotiza aparte.** Cambio de alcance
   = alcance nuevo escrito = precio nuevo. Nunca "te sumo unas horas".

**Y la salida estructural:** el destino de esta línea no es vender más webs, es que la web sea
el **canal de entrada del producto** (los 4 circuitos de `ONIA_WEB_CONECTADA_AL_SISTEMA.md`).
Una web que alimenta el sistema se vende como parte de Onia Platform. Una web suelta siempre
va a oler a agencia.

---

## 8. Decisiones que dependen de Sergio (nada de esto se decide solo)

> ## ✅ DECIDIDO 2026-09-17 — planes básicos CON precio; lo demás, en una llamada
>
> Sergio Urcullo, 17-sep, textual: *"podemos hacer planes básicos que sí tengan precio, pero
> luego si quieren cosas que no puedan armar ahí para tener algo visual que les guste,
> hacemos llamada y los ayudamos"*.
>
> **Qué cambia respecto del 24-ago (abajo):** vuelve a haber lista, pero SOLO para lo que el
> configurador de `/servicios/webs` arma solo: **Landing de Captación Bs 2.000** y **Web
> Profesional Bs 4.500** (los montos ratificados el 23-ago, que producción ya publicaba).
> **Web Pro (a medida) y Tienda no tienen precio publicado**: el configurador dice «Lo vemos
> en una llamada» y el pedido por WhatsApp pide esa llamada. La referencia interna para
> cotizarlas sigue siendo la tabla de §8.2 (desde 7.500 / según catálogo).
>
> **Mismo día, quinto alcance: ecommerce SOBRE plataforma (Shopify, Hotmart, Whop).** Sergio
> Urcullo: *"los precios dependen del frontend y el backend necesario, para que los ecommerces
> nos la compren y no la desarrollen ellos mismos"*. Sin precio publicado → llamada. Lo que se
> vende es el frontend con marca propia + la configuración; el cobro, la entrega y las
> comisiones son de la plataforma y van a nombre del cliente.
>
> **Fuente única de esos dos montos: `web-factory/apps/onia-platform/src/content/webs.ts`**
> (`WEB_STACKS`). La web personal de Sergio Urcullo NO tiene catálogo propio (se eliminó el
> mismo día: «esa UI habíamos quedado que no»): `/webs` redirige al configurador de Onia.
>
> ## ✅ DECIDIDO 2026-08-24 — la línea de webs NO tiene lista de precios *(vigente para Pro y Tienda)*
>
> **Cada web se cotiza caso por caso.** No hay ni va a haber un archivo que defina
> `790/1.500/2.900` ni `2.000/4.500/7.500` como lista vigente. Eso resuelve §8.1 y §8.2 de
> abajo: no es que el precio venció y nadie puso el siguiente — es que **esta línea no se
> vende con lista**.
>
> **Por qué.** `pricing.ts` y `subscription-plans.ts` definen plataforma y add-ons porque
> ahí el producto es idéntico para todos y **el monto valida el cobro**. Una web no: el
> alcance cambia por cliente, y una lista fija obliga a estirar o a regalar.
>
> **Qué significa en la práctica:**
> - Las cifras que aparecen en propuestas ya emitidas (AW Climatización, Premium Cars,
>   Bolivian Electric…) **no están mal ni hay que "corregirlas"** contra ninguna fuente.
>   Son cotizaciones de su caso.
> - 🔴 **Nadie debe "arreglar" un precio de web contra `pricing.ts`.** Ese archivo no cubre
>   esta línea. Un barrido de precios que las toque está rompiendo, no ordenando.
> - Lo que sí conviene tener es un **rango de referencia interno** para no cotizar de cero
>   cada vez — pero es una guía para el que cotiza, **no una lista publicable**.
>
> La regla de fuente única sigue intacta para lo que sí tiene lista: planes y add-ons.

### 8.1 🔴 El precio de arranque venció el 2026-07-31

`historial/ONIA_PRICING_2026.md` dice literalmente que la oferta de arranque es *"válida hasta
2026-07-31 o hasta 20 clientes cobrados, lo que ocurra primero"*. Hoy es **2026-08-22**:
venció hace 22 días y nadie puso el precio siguiente. El cotizador vivo sigue sirviendo
790 / 1.500 / 2.900. **Estrictamente, hoy no hay un precio de web vigente.**

### 8.2 🔴 Se están cotizando dos líneas de precio distintas al mismo tiempo

Todas las propuestas reales que salieron usan la **línea premium**, no la de arranque:

| Cliente (propuesta real en el repo) | Nivel 1 | Nivel 2 | Nivel 3 |
|---|---:|---:|---:|
| AW Climatización (web) | 2.000 | 4.500 | desde 7.500 |
| Lia Albertengo | 2.000 | 4.500 | desde 5.900 |
| BENCH | 2.000 | 4.500 | desde 8.900 |
| Garabato (tienda) | 4.500 | 6.900 | desde 11.000 |
| HSB Engineers | 4.500 | desde 8.900 | desde 13.900 |
| Franco Marín | 1.900 + 190/mes | 3.900 + 390/mes | 7.900 + 890/mes |

Fuente: `hermes-content/propuestas/generador/clientes.json` y los HTML/PDF ya generados.

Es decir: **el catálogo dice 790/1.500/2.900 y la boca dice 2.000/4.500.** Es exactamente el
error que la regla de una sola fuente existe para evitar. `PRICING_RATIONALE_INTERNO.md` §0
resuelve el empate en el papel ("los decks ya cotizados no se re-cotizan; los precios de
arranque aplican a clientes nuevos desde 2026-07-03"), pero la práctica siguió en premium.

### 8.3 La aritmética — por qué la línea de arranque no cierra

Con los tiempos reales del motor y el valor-día objetivo interno de **Bs 700–1.000/día**
(ambos de `PRICING_RATIONALE_INTERNO.md` §3):

| Paquete | Construcción | Costo-tiempo | A precio arranque | A precio premium |
|---|---|---:|---|---|
| Landing | 4–6 h (0,5–0,75 día) | Bs 350–750 | **790** → margen Bs 40–440 (5–56%) | **2.000** → Bs 1.250–1.650 (63–83%) |
| Web Profesional | 1,5–2 días | Bs 1.050–2.000 | **1.500** → entre +43% y **−25%** | **4.500** → Bs 2.500–3.450 (56–77%) |

Y ese costo-tiempo cuenta **solo la construcción**: no incluye discovery, intake, revisiones,
los gates, ni la publicación manual (§3, Fase 3). El costo real es más alto que esa columna.

**Lectura honesta: a Bs 1.500 una Web Profesional puede terminar por debajo de nuestro propio
piso de valor-día.** La línea premium no es una ambición: es la que cierra la cuenta, y es la
que se está cotizando en la calle desde hace meses.

⚠️ **No hay comparables de mercado boliviano verificados en el repo.** Si la decisión los
necesita, hay que medirlos con fuente antes de citarlos — no se estiman de memoria.

### 8.4 Propuesta — PENDIENTE DE DECISIÓN DE SERGIO

1. **Ratificar la línea premium como precio único de web**: Landing **2.000** · Web
   Profesional **4.500** · Web Pro Onia **desde 7.500** · Cuidado Web 190/390/690, y retirar
   la de arranque. Es lo que ya se cotiza y lo que sostiene la aritmética del §8.3.
   *(Alternativa igual de válida: ratificar la de arranque con una vigencia nueva y escrita.
   Lo que no es válido es dejar las dos vivas.)*
2. **Un solo archivo manda.** Las webs **no existen** en `onia-platform/lib/pricing.ts`
   (verificado: no hay ningún producto web ahí) ni en `subscription-plans.ts`, así que el
   precio de web quedó sin la fuente única que exige CLAUDE.md. Propuesta:
   **`web-factory/apps/site/src/app/vendedores/cotizador-data.ts`** — es el archivo que
   realmente le sirve el precio a un humano. Todo doc lo LEE de ahí; ninguno lo repite.
3. **Publicar el precio decidido en el catálogo de venta**, para que la próxima sesión no
   vuelva a concluir que "no existe precio de web".

### 8.5 Límites del motor que hoy encarecen cada entrega

No son opinión, están verificados, y o se presupuestan o se cierran:

- **No hay deploy.** Publicar es manual (`web-factory/package.json` no tiene script `deploy`).
- **Un solo layout por bloque.** Dos clientes del mismo template salen con la misma forma.
- **La receta de diseño no gobierna el render:** `design/auto-designer.ts` calcula plan de
  secciones y guardrails, pero ningún template los lee todavía. Sirve de guía al humano, no
  de input del render.

### 8.6 Lo que NO se puede exhibir como portafolio

- `web-factory/out/` tiene 11 demos + **`nuvia`** (proyecto propio con Arthur, no cliente
  externo). **Bolivian Electric** figura como "sitio entregado" pero es **parte vinculada**
  (familia): sirve como caso técnico, no como venta a un tercero.
- **Cero webs de cliente externo, pagadas y entregadas, verificables desde este repo.**
- Por lo tanto: prohibido inventar testimonios, logos o cifras de resultados. Y prohibido
  usar el checklist de 17 puntos como argumento de venta hasta que nuestras propias webs lo
  pasen entero — reprocharle a un prospecto lo que tenemos roto es un bumerán.

---

## Fuentes

- Motor y comandos: `web-factory/FACTORY.md` · `web-factory/README.md` ·
  `.claude/skills/onia-web-factory/SKILL.md` · `web-factory/data/schema.ts`
- Intake al cliente: `web-factory/INTAKE_CLIENTE.md` · panel `/onia-center/web-factory`
- Proceso de entrega: `hermes-content/propuestas/PLAYBOOK_CONSTRUCCION_INTERNO.md` (interno)
- Precio y razonamiento: `web-factory/apps/site/src/app/vendedores/cotizador-data.ts` ·
  `hermes-content/docs/historial/ONIA_PRICING_2026.md` ·
  `hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md` ·
  `hermes-content/propuestas/PRICING_RATIONALE_INTERNO.md` (interno)
- Ventaja interna (confidencial): `hermes-content/propuestas/ESTRATEGIA_PLANTILLAS_WEB_INTERNO.md`
- Propuestas ya emitidas: `hermes-content/propuestas/generador/clientes.json`
- Web + sistema: `hermes-content/docs/ONIA_WEB_CONECTADA_AL_SISTEMA.md`
- Qué se vende del producto: `hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`
