# Cómo consigue clientes Onia Platform — foco, competencia y pauta

> **Doc VIVO, sin fecha: se EDITA, no se reemplaza.** Nace del pedido de Sergio Urcullo del
> 2026-09-30: *"revisar si es rentable colocar tantos rubros… me dicen si ofreces a demasiadas
> personas nunca vas a vender nada… revisar meta ads, revisar clasificaciones, revisar
> competidores… aquí podemos armar las campañas también de meta"*.
>
> **Es la fuente de CÓMO se consiguen clientes:** canales, en qué orden, qué hace la competencia para
> conseguir los suyos y la pauta de Meta. Los temas vecinos tienen su propio archivo y acá no se
> repiten:
>
> | Tema | Fuente |
> |---|---|
> | A QUIÉN se le vende (y el veredicto de «¿uno o siete rubros?») | `ONIA_CLIENTE_IDEAL.md` §6 |
> | QUÉ se vende y en qué estado | `ONIA_CATALOGO_DE_VENTA.md` |
> | CUÁNTO cobra la competencia | `ONIA_PRECIOS_COMPETENCIA_Y_DECISION.md` (carril Plataforma) |
> | En qué etapa está la empresa, y las ideas evaluadas | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §7 y §14 |
> | Con quién hablar primero | `ONIA_LEADS_ESPERANDO.md` · `ONIA_PROSPECTOS_DENTAL_SCZ.md` |
>
> ⛔ **No es fuente de precios.** Los planes se leen de `onia-platform/lib/subscription-plans.ts`
> (`DEFAULT_PLAN_AMOUNTS`), los add-ons de `lib/pricing.ts`.
>
> **Reemplaza como vigente** a `ONIA_PAUTA_COMPETENCIA_20260815.md` y `ONIA_ADS_CAMPANA_1_LISTA_20260813.md`,
> que quedan como fotos de agosto. **Medido el 2026-09-30** (Biblioteca de Anuncios de Meta, código de
> `onia-platform` en `master` `c3b9206` y en la 1.0 sin publicar `wip/v1-integracion-20260928`, fuentes
> públicas). Las cuatro investigaciones completas, con cada fuente, están en `research/*_20260930.md` (§9).

---

## 0. La respuesta corta

1. **Te dicen la verdad para la venta, no para el producto.** El producto sigue multi-rubro (mantenerlo
   cuesta cero y es la base del segundo rubro); **la venta, la pauta y la vidriera van a un solo rubro:
   dental**, con estética segunda. Los datos, en `ONIA_CLIENTE_IDEAL.md` §6.
2. **La estrategia ya lo había decidido el 5-sep. Lo que no se enteró es la vidriera:** la home le habla a
   *"tu negocio"*, `/rubros` lista cinco, y el carrusel de pauta del 21-sep cierra con el precio del plan
   que no trae agentes (§5.4).
3. **El hueco de mensaje existe:** en Bolivia nadie pauta *"recuperá al paciente que dejó el tratamiento a
   medias"*. El único software de clínica con pauta sostenida es extranjero (Healthatom: Dentalink +
   Medilink, en dólares) y titula con IA clínica (§2).
4. 🔴 **Pero el producto todavía no cumple esa promesa, y hay que decirlo antes de gastar un peso.** El
   agente Recall busca *"sin visita hace ≥180 días"*; **no mira los tratamientos pendientes**, aunque la
   base ya los guarda con estado (verificado en código, §5.4). **La función #1 a sumar no es una tendencia:
   es el Recall de tratamiento a medias.** Está propuesta a Plataforma (EL HILO).
5. **La señal más barata que existe:** ~20 clínicas dentales y ~10 de estética de Santa Cruz **pagan hoy**
   pauta para conseguir pacientes, casi todas con clic a WhatsApp (§3).
6. **Orden de canales** (§4): los que ya levantaron la mano → las clínicas con señal, una por una → eventos
   del rubro → **recién ahí** Meta, con una prueba chica y techo duro → contenido.
7. **Meta, hoy no** (§6: ocho bloqueos, tres son de cinco minutos). **La campaña queda especificada para
   crearla en PAUSA** apenas se destraben (§5.8): clic a WhatsApp, Santa Cruz, un conjunto, desde USD 10/día
   por 14 días, **el filtro lo hacen la pieza y el bot, no la segmentación**, y se mide por **conversación
   calificada**, nunca por conversación.

---

## 1. El foco — y el tamaño real del segmento

El veredicto completo (y por qué no se borra ningún rubro del producto) vive en
`ONIA_CLIENTE_IDEAL.md` §6. Acá va lo que lo sostiene desde el lado de la adquisición.

**Tamaño del segmento** [inferencia, dos métodos cruzados — `research/ONIA_MERCADO_COMPETENCIA_BOLIVIA_20260930.md` §1.2]:

- **Método A — estructura del SEDES:** 125 clínicas + 1.812 consultorios dentales registrados en el
  departamento (~2018) × crecimiento a 2026 × no registradas × concentración en la capital → **~110–220**.
- **Método B — odontólogos:** 7.000–15.000 en el país × 30–35 % en Santa Cruz × 15–25 % en consultas de 2–6
  profesionales ÷ 3 por consulta → **~105–440**.
- **Rango: ~150–400 clínicas de 2–6 profesionales en Santa Cruz** (punto medio ~250).

**Qué implica:** 5 clientes son el 1–3 % del segmento (holgado). ~40 clientes serían el 10–27 % (muy
exigente con un rubro y una ciudad): el techo pide sumar estética u otra ciudad **después** de los 5.

| Rubro | Tamaño en SCZ | Competencia que pauta hoy | Veredicto para la venta |
|---|---|---|---|
| **Dental 2–6 profesionales** | ~150–400 [inferencia] | Healthatom (USD, IA clínica) + TuDoc (local, por SEO) | **Se persigue, solo éste, hasta 5 clientes** |
| Estética / spa | más avisos que dental (280 contra 56), sin conteo oficial | AgendaPro, Balance, CitaPro | Segundo, **después** de los 5 dentales: fragmentado, muchas sin recepción |
| Comercio / ferretería | el más grande: **42.587 unidades** (SEPREC, sep-2025) | **≥12 vendedores bolivianos** en BOB | No hoy: océano rojo y precio bajo |
| Importadora | sin conteo oficial | partners de Odoo, ERP de ticket alto | No hoy: venta larga |
| Servicios profesionales | ~10.400 [inferencia] | sin dato | No: sin canal claro |

---

## 2. Cómo consigue clientes la competencia

Medido con `ads_library_search` (MCP de Meta Ads, solo lectura pública), país `BO`, el 2026-09-30. Se lee
el **metadato** (página, fecha, título, moneda); los creativos **no se miraron** porque el proxy de la
sesión no llega a `facebook.com`. Detalle y los id de cada anuncio: `research/ONIA_BIBLIOTECA_ANUNCIOS_20260930.md`.

### 2.1 Quién le pauta software de clínica a Bolivia

| Anunciante | Qué vende | Pauta en Bolivia | Qué titula |
|---|---|---|---|
| **Dentalink** (Healthatom, Chile) | software dental | 15 anuncios desde junio, rotación continua, USD | *Dicta tus fichas con IA* · *Análisis de RX con IA* · *Simula sonrisas con IA* · *Calcula gratis qué procesos automatizar en 1 min* (calculadora como imán) · *Sin descuadres de caja* · *Cumple la Ley de Datos* · formulario instantáneo |
| **Medilink** (Healthatom, Chile) | software de clínicas | 19 anuncios desde agosto; tanda nueva el 28-sep, USD | *Fichas con IA: Dictas y listo* · *Resumen clínico con IA* · *Todo en un solo sistema* · *Agenda tu asesoría gratis* |
| **Ultra Pack Dentista** | plantillas de Canva → desde septiembre, agenda | ~40 anuncios desde enero, sin cortar | *Estás perdiendo clientes porque no publicas* · *Agenda para odontólogos* |
| **SA-Dental** | **agencia** de pacientes, no software | ~50 anuncios jul→sep | *"30 PACIENTES EXTRA POR MES O NO PAGAS"*; recluta vendedores a comisión |
| **Resulta SRL** | a identificar (TI de Santa Cruz) | 2 anuncios en BOB desde el 28-sep | aparece en *software odontológico* |
| **Softclinic** | software de clínicas | **0** hoy (tenía 2 el 15-ago) | cortó |

**Los que no pautan pero aparecen por búsqueda (SEO):** **TuDoc** (`tudoc.com.bo`, **boliviano**: agenda +
historia clínica + facturación SIAT + *"IA que resume el historial"*; declara *"más de 200 clínicas"*, no
publica precio) · Doctocliq (Perú, desde USD 19) · Citalo (página propia `/bo/` para odontólogos) ·
Turnito y ReservaSimple (páginas por país, "gratis"). **Doctoralia no opera en Bolivia.**

**Lo que dice esto:**

1. **Ningún software dental boliviano pauta hoy.** El único con adquisición pagada sostenida es extranjero.
2. **«IA» ya no distingue a nadie:** TuDoc, Dentalink y Medilink la ponen en el titular. **La de ellos es IA
   del trabajo clínico** (dictar, resumir, leer la radiografía, simular la sonrisa). Nadie **titula** con la
   plata que se pierde. ⚠️ Eso no prueba que nadie lo **ofrezca**: la web de Dentalink anuncia *recall* y
   *"venta de tratamientos"* (visto solo en el extracto del buscador, sin abrir). **La diferencia de Onia se
   dice por el trabajo** —*"te muestro qué pacientes dejaron el tratamiento a medias"*— **y por lo que un
   extranjero no trae:** precio fijo en bolivianos (contra USD que flota), precio publicado (contra
   *"cotizamos"*), SIAT y vocabulario del rubro.
3. **Ultra Pack Dentista lleva ocho meses pautando sin cortar.** Un anunciante chico no sostiene ocho meses
   algo que no le rinde: es la prueba más barata de que **el odontólogo boliviano compra por Meta**.
4. **SA-Dental compite por el MISMO presupuesto de la clínica** (su plata de marketing) con una promesa de
   pacientes nuevos. El ángulo de Onia es el complemento exacto: *"antes de pagar por pacientes nuevos,
   recuperá los que ya empezaron un tratamiento"*.

### 2.2 El odontólogo ya es un público B2B que se alcanza

Búsqueda *odontólogos*, BO, activos: **225**. Le pautan al dentista todos los días: cursos (Acospace,
Kallos, OsteoCompas, Galenos, Unifranz), insumos (Athel, Saludable-Mente), reparación de sillones
(SillaCare), marketing (Odontomerca) y software.

**El patrón que conviene copiar:** nombrar la profesión y la ciudad en el titular. SillaCare:
*"🚨 ¡Odontólogos de La Paz y El Alto! Renueven su sillón…"*. Con el público Advantage+ de Meta, **el
titular es la segmentación**.

### 2.3 En comercio, Onia sería uno más entre doce

*Facturación electrónica*: 21 activos · *inventario / punto de venta*: 8 · ventas e inventario: CAMSI, Leo
Business Core, StarSystem, Next System (*"TU FERRETERÍA MÁS RENTABLE"*), Bizora, Esi Bolivia (Odoo). SEDNA,
Simecsoft, CONTAnova, servifac, Mica Lefac, Infinitas, IZI (*"Digitaliza tu negocio"*), Mastersoft, Ticsys,
Facturación Electrónica io, Facturatech, Inventasys, Factivoo, Excel Apps. **Casi todos bolivianos y en
BOB.** En comercio *"digitalizá tu negocio"* ya lo pagan doce; en dental *"recuperá al paciente que no
volvió"* no lo paga nadie.

### 2.4 El calendario fiscal (para no usarlo mal)

Sin prórroga nueva encontrada: desde el **1-oct-2026** los grupos 9° a 12° facturan solo en línea (RND
102600000007; ~27.000 NIT, menos del 10 % del Régimen General). Lo grande que viene es el **IVA "por fuera"
de la Ley 1733** (pruebas de todos los sistemas de facturación del 1-oct al 16-nov-2026, RND
102600000034; rige el mes siguiente a su decreto reglamentario, pendiente). **Le pega más a comercio e
importadoras que a clínicas, y el SIAT sigue sin usarse como argumento de urgencia** (`ONIA_CLIENTE_IDEAL.md` §4).

---

## 3. La señal más barata que existe: las clínicas que ya pagan pauta

La misma Biblioteca muestra a **~20 clínicas dentales y ~10 de estética** de Santa Cruz que **hoy** pagan
para conseguir pacientes, casi todas con clic a WhatsApp (*Chatea con nosotros*, *Agenda tu cita*, *Reserva
tu cupo*). La lista, con la página de cada una y el cruce con los 20 prospectos de agosto, está en
`ONIA_PROSPECTOS_DENTAL_SCZ.md` §5.

**Por qué es la mejor señal que tiene Onia:**

- **Ya gastan en adquirir:** tienen presupuesto y deciden sobre herramientas.
- **El paciente les llega por WhatsApp:** el canal que Onia ordena.
- **El que no vuelve a terminar el tratamiento es plata que ya pagaron para traer.** Se les dice con su
  propio número: *"pagás por cada paciente que te escribe; ¿cuántos de los que empezaron un tratamiento no
  volvieron?"*.

**Qué NO se hace con esa lista:** escribir sin que Sergio Urcullo apruebe el mensaje y el canal exactos
(regla del subagente `onia-crm-prospeccion`), ni prometer el Recall de tratamiento a medias antes de que
exista (§5.4).

---

## 4. El orden de los canales — y por qué la pauta no va primero

Para **5 clientes** no hace falta un embudo: hacen falta cinco conversaciones buenas. El orden va del más
barato y más caliente al más caro y más frío.

| # | Canal | Costo | Por qué en este lugar | Quién |
|---|---|---|---|---|
| 1 | **Los que ya levantaron la mano** (`ONIA_LEADS_ESPERANDO.md`: 3 registros + 2 por WhatsApp; la clínica de 4 doctores hizo 6 preguntas) | Bs 0 | Son los más calificados que existen y esperan desde agosto. Pagar por leads nuevos con éstos sin contestar es tirar la plata | Sergio Urcullo |
| 2 | **Las clínicas con señal** (§3) + los 20 prospectos de agosto: 1:1 por WhatsApp o en persona, con mensaje aprobado | horas | Señal fuerte y ciudad donde Sergio Urcullo puede ir. Cruzar las dos listas da las primeras 10 | Sergio Urcullo (lista: `onia-crm-prospeccion`) |
| 3 | **Eventos del rubro:** CIO — Congreso Internacional de Odontología de Santa Cruz (en 2025 fue del 1 al 3 de octubre: **la edición 2026 podría ser estos días**, fecha a confirmar en su Facebook), diplomados de OsteoCompas y Unifranz, Jornadas del Colegio | bajo | Concentran al odontólogo que invierte en su clínica. Ir a mirar y conversar vale más que un stand | Sergio Urcullo |
| 4 | **Meta, prueba chica con techo duro** (§5) | USD 70–300 la prueba | Arma el flujo para después de los primeros clientes. Antes, los bloqueos del §6 lo harían gastar mal | esta sesión arma; Sergio Urcullo aprueba |
| 5 | **Contenido** (marca personal, Lucía) | horas | Construye autoridad a largo plazo. **Hoy no llega al comprador**: habla a un público de IA y tecnología, no a dueños de clínicas. Se mide contra la etapa 1 solo si trae clínicas | Marca personal / Lucía |

⚠️ **Lo incómodo del renglón 5, dicho de frente:** de las tres sesiones de marketing abiertas el 30-sep,
**solo una apunta al comprador de la etapa 1**. Eso no hace malas a las otras dos —la autoridad de Sergio
Urcullo ayuda cuando una clínica lo googlea—, pero ninguna de las dos va a traer los 5 clientes. La etapa
vigente la decide Sergio Urcullo (`CLAUDE.md` §1); acá solo se deja la cuenta a la vista.

---

## 5. La campaña de Meta

Diseño apoyado en el Centro de ayuda de Meta (leído con `ads_get_help_article`) y en la práctica
documentada; el detalle, con cada fuente, en `research/ONIA_META_ADS_PLAYBOOK_20260930.md`.

### 5.1 Clic a WhatsApp, y no formulario ni web

- **Objetivo Clientes potenciales · conversión en WhatsApp · meta "Maximizar el número de conversaciones".**
- Es el canal donde vive el dueño de la clínica y el que usan todas las clínicas que pautan (§3).
- No depende del píxel: hoy la web **no tiene píxel ni pasa `utm`/`fbclid`** a `app.onia.com.bo/register`
  (medido en el código de `(sitio)/`). La web entra cuando eso esté (bloqueo 7).
- La ventana gratis de 72 h que abre un anuncio de clic a WhatsApp **sigue sin cobrar el envío** después del
  cambio de precios de Meta del 1-oct-2026.

### 5.2 Público: el filtro son la pieza y el bot

- Santa Cruz de la Sierra + radio, con **"Llegar a más personas…" apagado** (Meta lo marca por defecto al
  elegir ciudad). Edad mínima 25. Público Advantage+ encendido; intereses (odontología, administradores de
  páginas) solo como sugerencia. **Las exclusiones por interés no existen desde el 31-mar-2025.**
- Excluir a los que ya se registraron (público personalizado por teléfono o correo, si se sube la lista).
- ⚠️ **El riesgo central:** el cliente ideal es ≲0,1 % del público alcanzable. Optimizando a conversaciones,
  **un anuncio que dice "clínica dental" trae PACIENTES que buscan turno.** Por eso:
  - la pieza abre con **"Para dueños/as de clínicas dentales en Santa Cruz."**;
  - el chat trae tres respuestas para tocar: *"Tengo una clínica y quiero ver cómo funciona"* · *"Trabajo en
    una clínica"* · *"Busco atención dental"* → salida cortés;
  - el bot hace las **5 preguntas de calificación** (`ONIA_CLIENTE_IDEAL.md` §9) y avisa a Sergio Urcullo el
    mismo día.

### 5.3 Presupuesto, techo y duración

| Escala | Para qué sirve | Anuncios | Cuándo se evalúa |
|---|---|---|---|
| USD 5/día | medir qué % de conversaciones califica (queda en aprendizaje limitado por diseño) | 2–3 | 14 días (~USD 70) |
| **USD 10/día — la recomendada para arrancar** | leer el costo por conversación calificada en dos semanas | 3–4 | 7–14 días (~USD 140) |
| USD 20/día | puede salir de aprendizaje si la conversación cuesta ≤ USD 2,8; permite A/B contra formulario "Mayor intención" | 4–6 | 7 días por ronda |

**Techo duro:** presupuesto total de campaña con fecha de fin (Meta rechaza un *límite* de gasto de campaña
menor a USD 100; el presupuesto total sí funciona como techo — medido el 13-ago). **Sin benchmark B2B de
Bolivia:** el único dato local es Bs 1–3,5 por conversación en pauta B2C amplia. Hipótesis para planificar,
a reemplazar con la semana 1: conversación a USD 1–4, 10–30 % calificadas ⇒ **USD 3–40 por conversación
calificada**.

### 5.4 Creativos — lo que existe, lo que hay que corregir, y lo que no se puede prometer todavía

**Lo que existe** (costo 0, render por código): el carrusel de 8 láminas y el estático del 21-sep
(`hermes-content/carousels/out/ads/onia-platform-dental-meta-20260921-*`), con portada humana, captura
**real** del producto (agenda, alta de cita, cobros), el dolor del rubro (*¿Cuántos tratamientos quedaron a
medias?*) y un solo CTA. Y ocho briefs de agosto (`carousels/briefs/ads/ad-a2…a8`): *silla vacía*, *8 de la
noche*, *no te faltan pacientes*, *tu recepcionista está tapada*, entre otros.

**Lo que hay que corregir antes de usarlo:**

1. 🔴 **La lámina 8 del carrusel contradice al producto.** Promete el Recall (lámina 7) y cierra con
   **"Desde Bs 320/mes"**, que es el **Básico: sin agentes** (`agentesIncluidos: false` en el espejo
   `web-factory/apps/onia-platform/src/lib/pricing.ts`). El sitio ya tiene un test que prohíbe exactamente esa
   frase (`capacidad-incluida.test.ts`, *"Agentes con IA. Desde Bs {básico}"*): **el anuncio rompe la regla que
   la web vigila**, y ancla en el plan que `ONIA_CLIENTE_IDEAL.md` §2 dice no venderle al cliente ideal. Hay
   además una propuesta de precios nueva en curso en Plataforma: **se saca el precio del creativo** (una cifra
   en una imagen no se actualiza sola).
2. **El CTA impreso tiene que coincidir con el botón:** en clic a WhatsApp es *"Escribinos"*, no *"Creá tu
   cuenta"*.
3. **Las piezas del 13-ago son solo tipografía:** no pasan *"producto visible o no sale"* (`CLAUDE.md` §5) y
   una firma `@oniaagency`. Se rehacen con UI real o no se usan.

**🔴 Lo que NO se puede prometer todavía — verificado en el código, 2026-09-30:**

- `evaluateRecallCandidates` (`lib/onia-core/modules/agents-logic.ts`, `master` `c3b9206` y la 1.0 sin
  publicar) propone pacientes **sin visita hace ≥ `recallAfterDays` = 180 días** y sin cita futura.
- La base **ya guarda** el tratamiento de cada paciente con su estado (`PatientTreatment.status`:
  `PENDIENTE · EN_PROGRESO · COMPLETADO · CANCELADO`, `prisma/schema.prisma`), pero **ningún agente lo lee**.
- **Consecuencia:** *"¿Cuántos tratamientos quedaron a medias? ONIA te ayuda a ver quién no volvió"* promete
  algo que el agente hoy no hace: a un paciente de ortodoncia que dejó de venir, el Recall lo encuentra a
  los seis meses, cuando ya se perdió. **Hasta que exista el Recall de tratamiento a medias, la pauta usa
  ángulos que el producto ya cumple** (la agenda que vive en la cabeza de la recepcionista, *8 de la noche*,
  la silla vacía) **o la frase honesta** (*"quién no volvió en seis meses"*).
- **Por qué es la función #1 a construir:** es el dolor #1 dicho por el mejor lead, es la promesa de los
  anuncios, Meta no la puede copiar sin la ficha, y el dato ya está en la base. Propuesta a Plataforma en EL
  HILO con el criterio (tratamiento pendiente o en progreso + sin cita futura + última cita hace 14–30 días o
  cancelada) y la medida (pacientes y Bs recuperados). Detalle: estrategia §14.

**Presentador:** Sergio Urcullo mostrando la pantalla, o un presentador IA solo si él lo pide y **nunca
haciéndose pasar por cliente u odontólogo**. Testimonios: prohibidos con cero clientes.

### 5.5 El WhatsApp que recibe

La pauta paga por cada conversación: si nadie contesta bien, se paga dos veces. La clínica de 4 doctores
escribió el 25-ago al WhatsApp de Onia y **recibió cero mensajes**. Antes de encender:

- prueba punta a punta **con dos mensajes** (el primero siempre lo contesta la plantilla de Chatwoot, lección
  del 23-ago);
- bot con las 5 preguntas, salida cortés para pacientes, aviso a Sergio Urcullo;
- **código por anuncio en el mensaje prellenado** (`[A1]`, `[A2]`…): **Chatwoot 4.12.1 descarta el `referral`
  del anuncio** (`hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs` l.129-133), así que sin código un
  lead de la pauta entra sin origen.

### 5.6 Medición

| KPI | Fórmula | Tope inicial [inferencia] |
|---|---|---|
| **CAC pagado** | gasto ÷ clientes nuevos atribuidos | ≤ **3 meses de margen del plan que compra** = 3 × precio mensual × ~0,95 |
| Costo por demo | gasto ÷ demos hechas | ≤ CAC tope ÷ 4 (supone 1 cliente cada 4 demos) |
| **Costo por conversación calificada** | gasto ÷ conversaciones que pasan las 5 preguntas | ≤ CAC tope ÷ 10 (supone 10 calificadas por cliente) |
| % calificadas | calificadas ÷ conversaciones | se fija con la semana 1 |

**Ejemplo con el plan Crece** (el primero con agentes; Bs 550/mes leído hoy del espejo
`web-factory/.../lib/pricing.ts` — **si el precio cambia, se recalcula con la fórmula**): CAC tope ≈ Bs 1.570.
En dólares **depende del tipo de cambio al que el banco le cobre la tarjeta a la cuenta publicitaria**:
~USD 225 al oficial (6,96), ~USD 138 a 11,37 (el que usa el carril Plataforma), ~USD 105 a 15. **Con el
tipo de cambio real el techo es la mitad de lo que parece**: hay que conocer ese número antes de la prueba.
Los supuestos del embudo están en `research/ONIA_META_ADS_PLAYBOOK_20260930.md` §4.6.

### 5.7 Cortar o seguir

- **7 días sin tocar nada** (aprendizaje); **se decide a los 14**.
- Un anuncio que gastó el tope de una conversación calificada (§5.6) sin conseguir ninguna → se pausa.
- **14 días con 0 demos**, o costo por calificada mayor al doble del tope → se cambia ángulo u oferta **sin
  subir presupuesto**.
- Se escala solo con costo por demo en tope **dos semanas seguidas** y lugar en la agenda de Sergio Urcullo:
  de a +20–30 % cada 3–4 días. **Cuando las demos superan su capacidad semanal, no se escala**: el techo son
  horas, no pauta.

### 5.8 La especificación, lista para crear en PAUSA

| Nivel | Valor |
|---|---|
| Cuenta | **ONIA Ads `act_1073680778314945`** (USD). **Nunca** NUVO ni Arthur Fuentes |
| Página | "Onia" `1140384625819526` |
| Campaña | `ONIA · Dental SCZ · WhatsApp · prueba 1` · Clientes potenciales · presupuesto total USD 140 · fin a los 14 días · **PAUSED** |
| Conjunto | WhatsApp · Maximizar conversaciones · Santa Cruz de la Sierra + radio, "llegar a más" apagado · 25+ · Advantage+ con sugerencias · excluir registrados |
| Anuncios | 3–4: carrusel del 21-sep **corregido** (§5.4) · estático del 21-sep · 1–2 de los briefs de agosto rehechos con UI real. Cada uno con su código en el mensaje prellenado |
| Mensaje de bienvenida | "Para dueños/as de clínicas" + tres respuestas para tocar (§5.2) |

**Quién la crea:** la sesión que tenga el conector de Meta Ads conectado a la cuenta de ONIA (bloqueo 3), o
Sergio Urcullo en el Administrador de anuncios con esta tabla. **Se crea en PAUSA y se enciende solo con su
OK.**

---

## 6. Bloqueos, cada uno con su dueño

| # | Bloqueo | Estado medido | Quién lo destraba |
|---|---|---|---|
| 1 | **Método de pago** en ONIA Ads | ❌ al 21-sep (handoff `meta-ads-prospeccion`) · no re-medido hoy | Sergio Urcullo / Leslie |
| 2 | **Página "Onia" vinculada** a la cuenta (`promote_pages`) | ❌ al 21-sep · no re-medido hoy | Sergio Urcullo, en Business Manager |
| 3 | **El conector de Meta Ads de las sesiones está en OTRA cuenta de Facebook** | ❌ **re-medido hoy**: ve "NUVO 1usd" y "Arthur Fuentes", no ONIA Ads | Sergio Urcullo: reconectarlo en `claude.ai/customize/connectors` con el usuario que administra ONIA Ads, y abrir una sesión nueva |
| 4 | **WhatsApp de Onia conectado a la página** (lo exige el clic a WhatsApp) | sin medir | Sergio Urcullo / Plataforma |
| 5 | **Bot listo para recibir pauta** (§5.5) y el `referral` que Chatwoot descarta | ❌ el `referral` se pierde; el resto sin probar | Plataforma |
| 6 | **Los leads que ya llegaron solos, sin contestar** | 5 al 27-sep (`ONIA_LEADS_ESPERANDO.md`) · no re-medido hoy | Sergio Urcullo |
| 7 | Solo para web o formulario: los CTA del sitio **no pasan `utm_*` ni `fbclid`**, **no hay píxel**, y no hay página de entrada para clínicas | ❌ medido hoy en el código | Plataforma (web pública) |
| 8 | **OK explícito de gasto con techo** | pendiente | Sergio Urcullo |

Y uno que no bloquea la pauta pero sí un ángulo: **el Recall de tratamiento a medias** (§5.4), de Plataforma.

**Píxel, si se pone:** solo en `onia.com.bo`, **nunca en `app.onia.com.bo`** (guarda fichas y tratamientos):
Meta podría clasificar el dominio como "salud y bienestar" y restringir la medición. Software B2B para
clínicas **no es** categoría especial de anuncios.

---

## 7. Lo que NO se hace

- Pautar comercio, importadora o servicios en la etapa 1.
- Usar el SIAT como urgencia, o decir "obligatorio por ley".
- Vender el add-on de chatbot como *"un bot que responde"*: Meta lo regala desde el 3-jun-2026 en la app
  WhatsApp Business (estrategia §14).
- Titular con «IA». Se titula con el trabajo.
- Prometer en un anuncio algo que el producto no hace hoy (el Recall de tratamiento a medias, un precio del
  plan que no trae lo que se muestra).
- Gastar en las cuentas NUVO o Arthur Fuentes que ve el conector.
- Encender algo sin el OK de Sergio Urcullo. Todo se crea en PAUSA.

---

## 8. Lo que no se pudo verificar

- **Los creativos de la competencia:** `facebook.com` está bloqueado para la sesión; se leyó metadato.
- **El estado de hoy de la cuenta ONIA Ads** (pago, página, WhatsApp): el conector está en otra cuenta y la
  sesión no tiene la llave del VPS para la Graph API.
- **Los leads sin contestar al 30-sep** y **si ya hay alguien pagando:** sin acceso a la base de producción
  desde esta sesión.
- **Si Dentalink ofrece de verdad recall y "venta de tratamientos"**, y el producto de TuDoc (precio,
  odontograma, clientes reales).
- **La fecha del CIO 2026.**
- **La página de la home renderizada:** se leyó el código de `(sitio)/`, no la página servida.
- **Benchmarks B2B de Bolivia:** no existen públicos; se fijan con la semana 1 de la prueba.
- Límite de la investigación: el cupo de búsquedas web de la sesión se agotó (200/200) y el proxy bloqueó
  casi todas las páginas; lo marcado *vía buscador* en `research/` es extracto, no lectura.

---

## 9. Cómo se re-verifica

```text
# Competencia y clínicas con señal (MCP de Meta Ads, solo lectura, cualquier cuenta sirve):
ads_library_search  countries=["BO"]  ad_active_status=ACTIVE  search_terms="clínica dental Santa Cruz"
ads_library_search  countries=["BO"]  page_ids=["106612849382553","407332546278146"]   # Dentalink, Medilink
ads_library_search  countries=["BO"]  ad_active_status=ACTIVE  search_terms="odontólogos"

# ¿El conector ve ONIA Ads? (si no aparece 1073680778314945, no sirve para crear)
ads_get_ad_accounts
```

```bash
# El criterio del Recall en el producto (clonar onia-platform en modo lectura)
grep -n "recallAfterDays = " lib/onia-core/modules/agents-logic.ts
grep -n "enum TreatmentStatus" -A5 prisma/schema.prisma

# ¿El sitio propaga utm/fbclid? ¿Tiene píxel?
grep -rn -E "utm_|fbclid|fbq\(" web-factory/apps/onia-platform/src/app/\(sitio\)/
```

Investigaciones completas del 2026-09-30: `research/ONIA_MERCADO_COMPETENCIA_BOLIVIA_20260930.md` ·
`research/ONIA_TENDENCIAS_AGENTES_20260930.md` · `research/ONIA_MARKETPLACE_EVALUACION_20260930.md` ·
`research/ONIA_META_ADS_PLAYBOOK_20260930.md` · `research/ONIA_BIBLIOTECA_ANUNCIOS_20260930.md`.
