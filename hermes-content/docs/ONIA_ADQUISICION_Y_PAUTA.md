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
>
> **Insumo del carril Plataforma:** `research/onia-1.0-29sep/CAMPANA_META_ADS.md` (29-sep, rama
> `wip/v1-hermes-20260928`, llega a `main` con la 1.0) — plan de campaña verificado contra el producto, con
> lo que el anuncio puede y no puede decir. **Esta es la fuente; aquel, el detalle de producto que la
> alimenta.** Lo que suma quedó integrado en §5.

---

## 0. La respuesta corta

1. ⚠️ **Rubros — corregido el 30-sep, de noche, por Sergio Urcullo: *«no solo somos clínica»*.** Este punto
   decía que la venta y la pauta iban a un solo rubro, dental. **Ahora se sale a buscar en los rubros que el
   producto sostiene en una demo, cada uno con su lista y su mensaje:** dental y estética primero (el mismo
   producto), después importadora (acotada al costeo y a la alerta de reprecio), y comercio y servicios
   cuando la 1.0 arregle lo que falla en una demo. El orden y el detalle están en `ONIA_CLIENTE_IDEAL.md` §6.
   **La pauta paga va de a un rubro por conjunto de anuncios, empezando por dental.** Meta aprende por
   conjunto, y cinco públicos con presupuesto chico no juntan señal.
2. **La estrategia ya lo había decidido el 5-sep. Lo que no se enteró es la vidriera:** la home le habla a
   *"tu negocio"*, `/rubros` lista cinco, y el carrusel de pauta del 21-sep cierra con el precio del plan
   que no trae agentes (§5.4).
3. **El hueco de mensaje existe:** en Bolivia nadie pauta *"recuperá al paciente que dejó el tratamiento a
   medias"*. El único software de clínica con pauta sostenida es extranjero (Healthatom: Dentalink +
   Medilink, en dólares) y titula con IA clínica (§2).
4. 🔴 **Sigue sin poder prometerse (2-oct).** El código está en producción (`release-8f07e537`), pero
   el detector está en producción pero **no encuentra a nadie**: cuenta solo tratamientos «En progreso», la ficha los carga «Pendiente» y hay 0 cargados (`ONIA_CATALOGO_DE_VENTA.md`, «NO se puede decir», 2-oct 01:54). **D4 queda frenado** hasta que Plataforma lo vea encontrar a alguien en la cuenta
   demo y el catálogo lo pase a «se puede decir».
   ⚠️ *Corregido el mismo 2-oct:* a las 00:50 escribí acá «D4 se puede prometer» porque vi el código en el
   bundle servido y el cron OK. Eso prueba que existe, no que funciona. Lo frenó el catálogo y la revisión de
   la madre v2. Lo que sigue es la foto del 30-sep: en producción el Recall buscaba
   *"sin visita hace ≥180 días"*. La 1.0 (decidido por Sergio Urcullo el 29-sep) le suma una primera pasada:
   **tratamiento en progreso sin actividad hace 21 días y sin cita** (dental y estética). **Lo que destraba
   el mejor ángulo no es construir nada: es publicar la 1.0 y mirarla andar** (§5.4). Hasta entonces la
   pauta usa lo que producción ya cumple.
   ⚠️ *Corregido el mismo 30-sep:* la primera versión de este punto decía que la 1.0 tampoco lo tenía. Leí
   una sola función (`evaluateRecallCandidates`) y generalicé; el módulo nuevo
   (`agents-tratamiento-a-medias.ts`) estaba al lado.
5. **La señal más barata que existe:** ~20 clínicas dentales y ~10 de estética de Santa Cruz **pagan hoy**
   pauta para conseguir pacientes, casi todas con clic a WhatsApp (§3).
6. **Orden de canales** (§4): los que ya levantaron la mano → las clínicas con señal, una por una → eventos
   del rubro → **recién ahí** Meta, con una prueba chica y techo duro → contenido.
7. **Meta, hoy no** (§6: ocho bloqueos, tres son de cinco minutos). **La campaña queda especificada para
   crearla en PAUSA** apenas se destraben (§5.8): clic a WhatsApp, Santa Cruz, un conjunto, desde USD 10/día
   por 14 días, **el filtro lo hacen la pieza y el bot, no la segmentación**, y se mide por **conversación
   calificada**, nunca por conversación.
8. **Cuándo se enciende** (plan de 14 días de la sesión principal, 30-sep): **con la 1.0 publicada y la
   medición probada**; la sesión principal avisa. Por eso entran desde el día 1 los dos ángulos: el
   Confirmador (D1) y el tratamiento a medias (D4). **Las piezas son de la sesión Ventas y pauta** (antes
   «Mercado»), junto con toda la campaña. Lo decidió Sergio Urcullo el 30-sep, de noche: a Marca personal
   le dijo *«aquí es solo marca personal y comunidad»*. Las piezas v3 usan las capturas del candidato 1.0 (`carousels/briefs/assets/onia-1.0-dental-ads/candidato-20260930/`), cuyos textos están en producción (2-oct). Qué falta y de quién es cada cosa: **la lista de encendido, §5.9**.

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
| Estética / spa | más avisos que dental (280 contra 56), sin conteo oficial | AgendaPro, Balance, CitaPro | Se atiende si llega: fragmentado, muchas sin recepción. Es el más barato de encender (comparte pantallas y agentes con dental) |
| Comercio / ferretería | el más grande: **42.587 unidades** (SEPREC, sep-2025) | **≥12 vendedores bolivianos** en BOB | No hoy: océano rojo y precio bajo |
| Importadora | sin conteo oficial; 135 avisos activos de importadoras de Santa Cruz | partners de Odoo, ERP de ticket alto | **Segundo rubro, después de los 5 dentales: decisión de Sergio Urcullo** (aviso de Plataforma, 30-sep). A favor: urgencia fiscal alta (IVA "por fuera") y un prospecto real. En contra: venta larga, y el "pedido" hoy es un callejón sin salida en el producto (inventario de Plataforma) |
| Servicios profesionales | ~10.400 [inferencia] | sin dato | No: sin canal claro |

---

## 2. Cómo consigue clientes la competencia

Medido con `ads_library_search` (MCP de Meta Ads, solo lectura pública), país `BO`, el 2026-09-30. Se lee
el **metadato** (página, fecha, título, moneda); los creativos **no se miraron** porque el proxy de la
sesión no llega a `facebook.com`. Detalle y los id de cada anuncio: `research/ONIA_BIBLIOTECA_ANUNCIOS_20260930.md`.
**Los creativos se miraron después** (1-oct, desde la PC, 18 de 22): §2.5.

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

### 2.5 Cómo venden sus anuncios — los creativos, mirados (1-oct)

Fuente: `research/competencia/anuncios/CAPTURAS-HECHAS.md` (18 anuncios capturados desde la PC, con texto y
cuadros de cada video). La única señal de rendimiento que da la Biblioteca es **cuánto lleva al aire**: un
anuncio que pasa seis semanas sin cortarse es la mejor señal pública de que le rinde a quien lo paga. Siete
anuncios de software pasan ese corte (salieron entre el 17-jul y el 17-ago; el de Ultra Pack del 21-ago vende
plantillas de Canva y no cuenta).

1. **Los siete que sobreviven tienen una persona.** Seis son videos (testimonio real, presentadora o escena
   hecha con IA) y el único estático muestra a una mujer con el celular. **Ninguno es sólo captura de
   pantalla.** Los que pasan de 25 s terminan mostrando el producto real.
2. **La primera línea del texto le habla al dueño de SU plata o SU tiempo**, no a la recepción: *«Doctora, tu
   tiempo (y tu almuerzo)…»*, *«Un paciente que te cancela… es dinero que dejas de recibir»*, *«Siempre hay un
   paciente más»*. La función aparece en la segunda línea.
3. **El líder no titula con IA** (vende tiempo, paz y no depender de la asistente); los que gritan «IA» son los
   nuevos. Coincide con §7: se titula con el trabajo.
4. **CTA de baja fricción y uno solo:** los siete mandan a cuenta gratis o a pedir demo, ninguno pone precio en
   la pieza y **ninguno va a WhatsApp** (eso lo hacen anuncios de 9 h al aire). §5.1 se mantiene igual: la venta
   de Onia es 1 a 1 con Sergio Urcullo y el filtro es la conversación. Es lo primero que mide la prueba (§5.7).
5. **Nadie pauta el tratamiento a medias.** El hueco de §2.1 sigue libre también en los creativos.

**Lo que se adoptó (2-oct):** la primera línea de D1 y D4 pasó a la plata del dueño (*«…el alquiler, la
asistente y tu hora se pagan igual»*, *«…plata que tu clínica ya presupuestó y todavía no cobró»*), sin cifras
ajenas como el «25 % de los ingresos». **Y el formato** (v3, mismo día): ninguno de los 18 es un carrusel
editorial, así que D1 y D4 pasaron a **imagen única de anuncio de software** (titular del dolor, pantalla real
con el recorte clave ampliado, tres beneficios, un botón), con la marca de la web y no la de la marca personal.
Lo pidió Sergio Urcullo: *«es diferente el contenido de la onia platform que el de mi cuenta personal»*. **Lo que no se puede copiar todavía:** el testimonio (cero clientes) y la
prueba social numérica. **Lo que queda por hacer, y es la brecha más grande:** una pieza con persona. El
presentador permitido es Sergio Urcullo mostrando la pantalla (§5.4); un presentador IA, sólo si él lo pide y
con aprobación de gasto.

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
(regla del subagente `onia-crm-prospeccion`), ni prometer el Recall de tratamiento a medias mientras la 1.0
no esté publicada (§5.4).

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
- No depende del píxel: en producción la web **no tiene píxel ni pasa `utm`/`fbclid`** a
  `app.onia.com.bo/register` (medido en el código de `(sitio)/` en `main`). **La 1.0 sin publicar ya lo
  resuelve** (bloqueo 7); la web entra como destino cuando se publique y el píxel se vea en «Probar eventos».
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
  - **Propuesta pendiente de Sergio Urcullo** (`research/competencia/DAPTA_COMO_FUNCIONA.md` §6.1): una pregunta
    de dolor con tres botones (*faltan a la cita* / *no volvieron* / *cobros pendientes*) y cierre *«14 días
    gratis, sin tarjeta»*. Si se adopta, va **después** de los tres botones de arriba, no en su lugar: esos
    son el filtro contra el paciente que busca turno, que es el riesgo central. *«No volvieron»* ya se respalda
    con el tratamiento a medias en producción (2-oct).
  - Las dos portadas (D1 y D4) dicen *«Para dueños y dueñas de clínicas dentales de Santa Cruz.»* desde el 2-oct;
    antes decían *«Para clínicas dentales…»*, más flojo como filtro.

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

**Lo que hay que corregir antes de usarlo** — ✅ *los puntos 1 y 2 quedan resueltos en los briefs D1 y D4
(§5.8, 30-sep). El carrusel del 21-sep no se usa: D4 lo reemplaza. Además, sus capturas apuntaban a
`docs/recorrido/capturas/`, que está en `.gitignore`, así que fuera de la máquina donde se armó salían vacías.*

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

**Qué se puede prometer con producción y qué recién con la 1.0 — leído en el código, 2026-09-30.** *Desde
el 2-oct la 1.0 está en producción (`release-8f07e537`), pero el tratamiento a medias **sigue sin poder decirse**:
el detector está en producción pero **no encuentra a nadie**: cuenta solo tratamientos «En progreso», la ficha los carga «Pendiente» y hay 0 cargados (`ONIA_CATALOGO_DE_VENTA.md`, «NO se puede decir», 2-oct 01:54). Qué se puede decir manda `ONIA_CATALOGO_DE_VENTA.md`, no esta tabla. El umbral exacto es **21 días sin venir** (`diasSinVenir`),
con el tratamiento `EN_PROGRESO` y sin cita futura: no «21 días en progreso».*

| | Producción (`onia-platform` `master` `c3b9206`) | 1.0 sin publicar (`wip/v1-integracion-20260928` `f533a68`) |
|---|---|---|
| Recall | `evaluateRecallCandidates`: **sin visita ≥180 días** y sin cita futura | lo mismo, **más** una primera pasada: `agents-tratamiento-a-medias.ts` |
| Tratamiento a medias | **no existe**: `PatientTreatment.status` se guarda y ningún agente lo lee | tratamiento `EN_PROGRESO`, **21 días** sin actividad (`TRATAMIENTO_A_MEDIAS_DIAS`), sin cita futura, dental y estética; propone y una persona aprueba en `/pending`. Decidido por Sergio Urcullo el 29-sep |

- **Hasta publicar la 1.0**, *"¿cuántos tratamientos quedaron a medias?"* promete algo que producción no
  hace. La pauta usa lo que producción **sí** cumple, verificado por el carril Plataforma contra `c3b92067`
  (`CAMPANA_META_ADS.md` §1.2): **el paciente de mañana que no confirmó** (el agente Confirmador deja cada
  mañana el mensaje escrito; lo aprobás y lo mandás desde tu WhatsApp), los recordatorios por correo 24 h y
  2 h antes con botón para confirmar o cancelar, y el link para que el paciente reserve solo.
- **Con la 1.0 publicada**, el ángulo entra **diciendo el mecanismo** (*"si pasan tres semanas sin que
  vuelva…"*), con dos cuidados: la prueba dura 14 días y el aviso aparece a los 21, así que un cliente que
  carga datos nuevos **no lo ve dentro de la prueba** (se alarga la prueba de los leads de pauta desde
  `/admin/plans`, o la demo lo muestra con un tratamiento sembrado de más de 21 días: el seed dental lo trae desde
  `5356a6c`, pero **hoy no hay cuenta demo en producción**, ver `sales-kit/02-GUION-DEMO.md` §0); y la regla toma `EN_PROGRESO`, no `PENDIENTE` (el plan que nunca empezó): si hace falta, es una
  segunda vuelta, el dato existe.
- **Lo que un anuncio no dice** (lista del carril Plataforma, verificada contra el producto): factura
  electrónica, "envío automático por WhatsApp", paquetes de sesiones (estética), testimonios o cifras de
  resultados. **Confirmar o marcar "no asistió" desde la agenda** no existe en producción y **llega con la
  1.0** (aviso de Plataforma, 30-sep 04:02 UTC): hasta publicarla, tampoco se dice.

**Presentador:** Sergio Urcullo mostrando la pantalla, o un presentador IA solo si él lo pide y **nunca
haciéndose pasar por cliente u odontólogo**. Testimonios: prohibidos con cero clientes.

### 5.5 El WhatsApp que recibe

La pauta paga por cada conversación: si nadie contesta bien, se paga dos veces. La clínica de 4 doctores
escribió el 25-ago al WhatsApp de Onia y **recibió cero mensajes**. Antes de encender:

- prueba punta a punta **con dos mensajes** (el primero siempre lo contesta la plantilla de Chatwoot, lección
  del 23-ago);
- bot con las 5 preguntas, salida cortés para pacientes, aviso a Sergio Urcullo;
- **código por anuncio en el mensaje prellenado**: **Chatwoot 4.12.1 descarta el `referral` del anuncio**
  (`hermes-content/deploy/vps-ops/bot/chatwoot-adapter.mjs` l.129-133), así que sin código un lead de la pauta
  entra sin origen. **Cómo, según el carril Plataforma** (`CAMPANA_META_ADS.md` §2.2): el conocimiento del bot
  admite 10 campañas y hay 9 usadas, así que va **una sola frase-prefijo** para todos los anuncios —
  *"Hola, vi el anuncio de Onia"* (`prefijo: true`)— y cada anuncio precarga su código: *"Hola, vi el anuncio
  de Onia (D1). Tengo una clínica dental."*. La respuesta del bot es fuente con firma humana: **la publica
  Sergio Urcullo**, y se prueba desde un teléfono que no sea el de Onia, **mirando la respuesta**;
- **método de pago en la cuenta de WhatsApp Business de Onia**: desde el 1-oct Meta cobra los mensajes de
  servicio (`onia-platform` `c3b9206`: *"there is no free tier"*). La ventana de 72 h que abre un anuncio de
  clic a WhatsApp sigue gratis, pero sin método de pago cargado la cuenta queda expuesta a corte.

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
| Anuncios | **D1 y D4** (tabla de abajo): v3 renderizados el 2-oct (imagen única 4:5 y 9:16) y **en pausa**: Sergio Urcullo pidió primero el estudio de la Biblioteca. **D4 frenado** por el catálogo (el detector no encuentra a nadie). **Diseño, render y subida: sesión Ventas y pauta** (Sergio Urcullo, 30-sep; ver §0 punto 8). Marca personal no las hace. |
| Mensaje de bienvenida | "Para dueños/as de clínicas" + tres respuestas para tocar (§5.2) |

| Anuncio | Brief (`hermes-content/carousels/briefs/ads/`) | Título | Texto precargado |
|---|---|---|---|
| **D1 · Los de mañana** (Confirmador) | `onia-platform-dental-meta-d1v3-los-de-manana.json` · imagen única | *La lista de mañana, con el mensaje escrito* | `Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.` |
| **D4 · Tratamiento a medias** | `onia-platform-dental-meta-d4v3-tratamiento-a-medias.json` · imagen única | *Los tratamientos a medias, en una lista* | `Hola, vi el anuncio de Onia (D4). Tengo una clínica dental.` |

- **El texto principal** de cada anuncio es el `caption` de su brief. Si lleva precio, se lee de
  `subscription-plans.ts` **el día que se crea**. En la imagen no va ningún precio.
- **D4 reemplaza al carrusel del 21-sep.** Lo que se corrigió: el cierre ya no dice *"Desde Bs 320/mes"* ni
  *"Creá tu cuenta"*, sino *"Escribinos"*, que es el botón del anuncio. El mecanismo se dice como es: *"tres
  semanas sin volver"*, el mensaje nombra el tratamiento y trae el link de reserva
  (`buildTratamientoAMediasMessage` en la 1.0 `6088e47`). Se ven la ficha y `/pending` de verdad, no un
  diagrama.
- **D4 desde el día 1, y no después de D1 como proponía el insumo:** lo que se vende desde el anuncio es una
  demo, no la prueba por su cuenta. En la demo el aviso de los 21 días se ve con los datos sembrados que
  pide el plan de 14 días. El choque entre 14 días de prueba y 21 de umbral (§5.4) le toca a quien se
  registra solo, y ese no es el camino de este anuncio.
- **Las capturas** salen de la 1.0 publicada, en la cuenta demo. Van en
  `hermes-content/carousels/briefs/assets/onia-1.0-dental-ads/`: su README dice cuáles son las cuatro y
  qué tiene que verse en cada una. Mientras falte una, esa lámina sale con *"Falta la captura aprobada del
  producto"*, así que ninguna pieza puede salir sin pantalla real.
- **Cada pieza se le muestra renderizada a Sergio Urcullo** antes de subirla, porque construir y publicar
  son dos permisos distintos.

**Quién la crea:** la sesión que tenga el conector de Meta Ads conectado a la cuenta de ONIA (bloqueo 3), o
Sergio Urcullo en el Administrador de anuncios con esta tabla. **Se crea en PAUSA y se enciende solo con su
OK.**

#### 5.8.1 Cómo se crea en PAUSA, paso a paso (1-oct)

Escrito para que la sesión que tenga el conector lo ejecute sin decidir nada. Los parámetros son los del
conector `Meta_ads`; en el Administrador de anuncios son los mismos campos con su nombre en pantalla.

> ⛔ **Trampa medida el 1-oct leyendo el conector:** `ads_create_ad` está en **modo borrador**. Los anuncios
> quedan como DRAFT, y **`ads_activate_entity` sobre la campaña los publica en ACTIVO, gastando.** «Crear en
> PAUSA» termina en el paso 5. `ads_activate_entity` se llama solo con la fila 9 de §5.9 en ✅.

0. **Antes de nada:** `ads_get_ad_accounts` lista `1073680778314945` con `has_payment_method: true`, y
   `ads_get_user_pages` (o `ads_get_pages_for_business` con `1451773736711697`) lista `1140384625819526`. Si falta
   uno, se para acá (filas 2–4 de §5.9). ⚠️ **No** se usa `ads_get_ad_account_pages`: lista solo las páginas que la
   cuenta ya promocionó, y devuelve `[]` en una cuenta que nunca pautó (corregido el 1-oct).
1. **Campaña** (`ads_create_campaign`): `ad_account_id` `1073680778314945` · `campaign_name`
   `ONIA · Dental SCZ · WhatsApp · prueba 1` · `objective` `OUTCOME_LEADS` · `buying_type` `AUCTION` ·
   `special_ad_categories` `[]` · `campaign_lifetime_budget` `14000` (USD 140, en centavos) ·
   `campaign_stop_time` = inicio + 14 días. Sale en PAUSED.
   Si `OUTCOME_LEADS` no acepta WhatsApp en esa cuenta, el respaldo es `OUTCOME_ENGAGEMENT` con el mismo
   conjunto, y se anota en el handoff.
2. **Conjunto** (`ads_create_ad_set`): `ad_set_name` `Dental SCZ · 25+ · WhatsApp` · `optimization_goal`
   `CONVERSATIONS` · `destination_type` `WHATSAPP` · `billing_event` `IMPRESSIONS` · `promoted_object`
   `{"page_id":"1140384625819526"}` · sin presupuesto propio (manda el de la campaña) · `targeting`:
   `{"geo_locations":{"custom_locations":[{"latitude":-17.7833,"longitude":-63.1821,"radius":25,"distance_unit":"kilometer"}]},"age_min":25}`,
   ubicaciones automáticas. Con Advantage+ la edad queda como sugerencia, que es lo que pide §5.2. Excluir
   registrados (audiencia de clientes) solo si ya existe en la cuenta; no se crea para esto.
3. **Imágenes:** `feed.png` (1080×1350) y `story.png` (1080×1920) de
   `hermes-content/carousels/out/ads/onia-platform-dental-meta-d1v3-los-de-manana/` y `…-d4v3-…/`, **la versión
   que Sergio Urcullo aprobó viéndola** (fila 7). El conector sube archivos solo desde su app; si desde la nube
   no puede, se suben a mano en el Administrador.
4. **Dos creativos** (`ads_create_creative`) de **imagen única**: `page_id` `1140384625819526` · `message` =
   `caption` del brief · `headline` = título de la tabla de arriba · `call_to_action_type` `WHATSAPP_MESSAGE` ·
   imagen `feed.png`. La `story.png` va en «Personalizar recurso por ubicación» (historias y reels); si el
   conector no lo expone, se carga a mano en el Administrador. `self_ai_disclosure`: no hace falta (capturas
   reales y texto por código, sin imágenes generadas); lo confirma Sergio Urcullo.
   **Texto precargado** (`Hola, vi el anuncio de Onia (D1)…`): si el conector no lo expone, se pone a mano en
   el anuncio, en «Mensaje de bienvenida», antes de cualquier publicación. Sin ese texto se pierde la
   atribución D1/D4 (§5.6).
5. **Dos anuncios** (`ads_create_ad`) bajo el conjunto: `ONIA · D1 · Los de mañana` y
   `ONIA · D4 · Tratamiento a medias`. Quedan en borrador.
6. **Anotar en el handoff** del carril los ids de campaña, conjunto, creativos y anuncios, y verificar con
   `ads_get_ad_entities` que la campaña dice PAUSED. Recién ahí la fila 8 pasa a ✅.
7. **Encender** = `ads_activate_entity` sobre la campaña, **solo con el OK escrito de Sergio Urcullo** (fila 9).

### 5.9 Lista de encendido

Se enciende cuando **todas** las filas están en ✅. Una fila vale con la comprobación de su columna, no de
memoria. Estado al **30-sep, 12:30 UTC**.

| # | Condición | Cómo se comprueba | Dueño | Estado |
|---|---|---|---|---|
| 1 | **1.0 publicada y medición probada** (alta con `utm` guardada con su origen, píxel visto en «Probar eventos») | aviso de la sesión principal | sesión principal | ⏳ **1.0 publicada** (`release-4dc829e8` la contiene, medido el 1-oct por `ONIA_CATALOGO_DE_VENTA.md`); falta ver el píxel en «Probar eventos» |
| 2 | **El conector ve ONIA Ads**, o Sergio Urcullo crea la campaña a mano | `ads_get_ad_accounts` lista `1073680778314945` | Sergio Urcullo | ✅ **1-oct, 21:00 UTC:** lo lista, en el negocio «OniaAgency», con `is_ads_mcp_enabled: true`. A las 20:15 todavía no aparecía |
| 3 | **Método de pago** en ONIA Ads | `has_payment_method: true` en la misma llamada | Sergio Urcullo | ❌ **re-medido el 1-oct a las 21:00 y a las 21:40 UTC: `has_payment_method: false`** |
| 4 | **Página "Onia" promocionable y con el WhatsApp de ventas vinculado** | `ads_get_ad_account_pages` lista `1140384625819526`; WhatsApp en la configuración de la página | Sergio Urcullo | ✅ **1-oct, 21:40 UTC:** la página «Onia» está en el Business OniaAgency y el usuario del conector puede anunciar con ella (`ads_get_user_pages` y `ads_get_pages_for_business` la listan). Lo de las 21:15 («ninguna página») era una lectura equivocada: `ads_get_ad_account_pages` solo lista páginas ya promocionadas. El WhatsApp de la página no se midió. **Instagram:** ONIA Ads no tiene ninguna cuenta de IG vinculada (`ads_get_ig_accounts` → `[]`) |
| 5 | **Frase-prefijo publicada en el bot** y probada con dos mensajes desde un teléfono que no sea el de Onia, **mirando la respuesta** (§5.5) | la respuesta, leída | Sergio Urcullo (firma) + carril chatbot | ❌ |
| 6 | **Quién contesta, y en cuánto tiempo** | decidido por escrito | Sergio Urcullo | ❌ (ver abajo) |
| 7 | **Las cuatro capturas de la 1.0** en `carousels/briefs/assets/onia-1.0-dental-ads/` → D1 y D4 renderizadas → **OK de Sergio Urcullo viéndolas** | las piezas renderizadas, miradas | capturas: sesión principal · diseño y render: Ventas y pauta · OK: Sergio Urcullo | ⏸️ **v3 renderizadas el 2-oct y en pausa** (`out/ads/onia-platform-dental-meta-d1v3-…` y `…-d4v3-…`). Sergio Urcullo: *«DEJA DE ARMAR, PRIMERO MIRA LA META ADS LIBRARY Y MIRA COMPETENCIAS»*. Primero el estudio de la Biblioteca (la madre, desde la PC), después el diseño. D4 frenado por el catálogo. v1 y v2 (carruseles) fueron rechazadas |
| 8 | **Campaña creada en PAUSA** con §5.8 | ids de campaña, conjunto y anuncios anotados en el handoff del carril | quien tenga el conector, o Sergio Urcullo | ❌ depende de 2–4 · pasos en §5.8.1 |
| 9 | **OK explícito de gasto con techo** (USD 140, 14 días) y **tipo de cambio** al que el banco cobra la tarjeta (§5.6) | por escrito | Sergio Urcullo | ❌ |

**Fila 6 si el carril chatbot sigue sin dueño.** La pauta igual se puede encender, porque la atribución no
depende del bot: el código (D1/D4) viaja en el texto de la conversación y se busca en Chatwoot. Lo que
falta sin el bot son las 5 preguntas y la salida cortés para los pacientes. Eso lo hace Sergio Urcullo a mano,
**el mismo día**. A USD 10/día y USD 1–4 por conversación (hipótesis de §5.3) son **2 a 10 conversaciones
por día**. Si no entran en su día, se arranca con USD 5/día: la escala de §5.3 que mide solo el % de
calificadas. Lo que **no** se puede es encender sin haber hecho la prueba de la fila 5: si lo primero que
recibe un dueño de clínica es una respuesta mala, esa conversación se paga y se pierde.

**Cómo se renderizan (nube o PC):** `node .claude/skills/onia-ventas-pauta/scripts/anuncio-render.js --brief
<brief> --out <dir>` saca `feed.png` y `story.png`. Trae su letra (Archivo, en `scripts/fonts/`), así que no
depende de las fuentes instaladas. Método y trampas: skill `onia-ventas-pauta` §4.

---

## 6. Bloqueos, cada uno con su dueño

| # | Bloqueo | Estado medido | Quién lo destraba |
|---|---|---|---|
| 1 | **Método de pago** en ONIA Ads | ❌ al 21-sep (handoff `meta-ads-prospeccion`) · no re-medido hoy | Sergio Urcullo / Leslie |
| 2 | **Página "Onia" vinculada** a la cuenta (`promote_pages`) | ❌ al 21-sep · no re-medido hoy | Sergio Urcullo, en Business Manager |
| 3 | **El conector de Meta Ads de las sesiones está en OTRA cuenta de Facebook** | ✅ **resuelto el 1-oct, 21:00 UTC:** el conector ya ve ONIA Ads. Siguen los bloqueos de la tarjeta y de la página (filas 3 y 4 de §5.9). Antes, re-medido dos veces el 30-sep, solo veía «NUVO 1usd» y «Arthur Fuentes» | Sergio Urcullo: reconectarlo en `claude.ai/customize/connectors` con el usuario que administra ONIA Ads, y abrir una sesión nueva |
| 4 | **WhatsApp de Onia conectado a la página** (lo exige el clic a WhatsApp) | sin medir | Sergio Urcullo / Plataforma |
| 5 | **Bot listo para recibir pauta** (§5.5) y el `referral` que Chatwoot descarta | ❌ el `referral` se pierde; el resto sin probar | **carril chatbot** (Plataforma aclaró el 30-sep que no es suyo). Hoy **no hay sesión viva** de ese carril: Sergio Urcullo decide quién lo toma |
| 6 | **Los leads que ya llegaron solos, sin contestar** | 5 al 27-sep (`ONIA_LEADS_ESPERANDO.md`) · no re-medido hoy | Sergio Urcullo |
| 7 | Solo para web o formulario: los CTA del sitio **no pasan `utm_*` ni `fbclid`**, **no hay píxel**, y no hay página de entrada para clínicas | ❌ en producción (medido hoy en `main`). ✅ **resuelto en la 1.0 sin publicar** según Plataforma (30-sep): la web guarda `utm_*`, `src` y `fbclid` y los pasa al registro, píxel liviano `1012611478191231` solo en la web, privacidad v1.3; cuenta como andando recién cuando se vea en «Probar eventos». La página de entrada para clínicas sigue sin existir | Plataforma + OK de Sergio Urcullo para publicar |
| 8 | **OK explícito de gasto con techo** | pendiente | Sergio Urcullo |

Y uno que no bloquea la pauta pero sí destraba el mejor ángulo y la medición por web: **publicar la 1.0**
(trae el Recall de tratamiento a medias, el origen de cada alta y el píxel liviano). Lo decide Sergio Urcullo.

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
- Prometer en un anuncio algo que producción no hace hoy: el tratamiento a medias antes de publicar la 1.0,
  el envío automático por WhatsApp, confirmar citas desde el panel, la factura SIAT, paquetes de sesiones, o
  un precio del plan que no trae lo que se muestra.
- Gastar en las cuentas NUVO o Arthur Fuentes que ve el conector.
- Encender algo sin el OK de Sergio Urcullo. Todo se crea en PAUSA.

---

## 8. Lo que no se pudo verificar

- ~~**Los creativos de la competencia**~~ ✅ 1-oct: capturados desde la PC (18 de 22), §2.5. Los 4 que faltan
  (3 de Dentalink, 1 de Medilink) la Biblioteca pública no los muestra sin sesión iniciada.
- **El estado de hoy de la cuenta ONIA Ads** (pago, página, WhatsApp): el conector está en otra cuenta y la
  sesión no tiene la llave del VPS para la Graph API.
- **Los leads sin contestar al 30-sep** y **si ya hay alguien pagando:** sin acceso a la base de producción
  desde esta sesión.
- **Si Dentalink ofrece de verdad recall y "venta de tratamientos"**, y el producto de TuDoc (precio,
  odontograma, clientes reales).
- **El agente de tratamiento a medias funcionando:** el código está en producción (2-oct, `release-8f07e537`),
  pero el detector está en producción pero **no encuentra a nadie**: cuenta solo tratamientos «En progreso», la ficha los carga «Pendiente» y hay 0 cargados (`ONIA_CATALOGO_DE_VENTA.md`, «NO se puede decir», 2-oct 01:54). Falta que Plataforma lo arregle y lo vea encontrar a alguien en la cuenta demo.
- **La decisión de importadora como segundo rubro, con las palabras de Sergio Urcullo:** llegó por el aviso de
  Plataforma; el propio `VENDIBLE_OTROS_RUBROS.md` de esa rama recomendaba estética.
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
grep -n "recallAfterDays = " lib/onia-core/modules/agents-logic.ts                  # producción: 180
ls lib/onia-core/modules/ | grep tratamiento-a-medias                                # ¿llegó la 1.0?
grep -n "TRATAMIENTO_A_MEDIAS_DIAS =" lib/onia-core/modules/agents-tratamiento-a-medias.ts   # 1.0: 21
# Ojo: leer UNA función no alcanza para decir "ningún agente lo hace" — listar el módulo entero.

# ¿El sitio propaga utm/fbclid? ¿Tiene píxel?
grep -rn -E "utm_|fbclid|fbq\(" web-factory/apps/onia-platform/src/app/\(sitio\)/
```

Investigaciones completas del 2026-09-30: `research/ONIA_MERCADO_COMPETENCIA_BOLIVIA_20260930.md` ·
`research/ONIA_TENDENCIAS_AGENTES_20260930.md` · `research/ONIA_MARKETPLACE_EVALUACION_20260930.md` ·
`research/ONIA_META_ADS_PLAYBOOK_20260930.md` · `research/ONIA_BIBLIOTECA_ANUNCIOS_20260930.md`.
