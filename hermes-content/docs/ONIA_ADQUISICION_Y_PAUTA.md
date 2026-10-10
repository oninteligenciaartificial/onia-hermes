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
   crearla en PAUSA** apenas se destraben (§5.8): clic a WhatsApp, Santa Cruz, un conjunto, US$ 56 en 14 días
   (US$ 4/día, §5.3; el «USD 10/día» del 30-sep ya no vale), **el filtro lo hacen la pieza y el bot, no la
   segmentación**, y se mide por **conversación calificada**, nunca por conversación. **El plan vigente, en una
   página: §5.11.**
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

⚠️ *Corregido el 2026-10-03:* acá decía que desde el **1-oct-2026** los grupos 9° a 12° facturaban solo en
línea (RND 102600000007; ~27.000 NIT). **Ya no:** la **RND 102600000038 (30-sep-2026)** abrogó las designaciones
de esos grupos y dejó sin efecto el plazo; el SIN asignará periódicamente una modalidad en línea a los
contribuyentes del IVA que no habían implementado ninguna, sin fecha. Ningún anuncio dice «obligatorio desde el 1-oct». Lo grande que viene es el **IVA "por fuera"
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

**Síntesis del 8-oct (15 competidores: tabla comparativa, patrones de lo que pasa 30 días, 5 guiones dentales, reglas de edición, cambios de web y lo que no se copia):** `research/competencia/COMUNICACION_Y_PAUTA_COMPETENCIA.md`.

### 2.6 Los que más días sostienen un anuncio activo (3-oct)

Cuenta los días al aire hasta el 3-oct. El que más días sostiene es la mejor señal pública de que le rinde. Fuentes:
`research/competencia/anuncios/CAPTURAS-HECHAS.md`, ronda 1 (capturas del 1-oct) y ronda 2 (conteo y los anuncios
más viejos, 2-oct, madre v2), más las capturas de `agendaendia/` y `dtdental/`. **«s/c» = sin captura:** el conector
solo da titular y fecha, y desde la nube Facebook no abre.

| Anunciante (activos) | Más viejo activo · días | Formato | Gancho (titular o primera línea) | Destino |
|---|---|---|---|---|
| Dentalink (81) | 15-nov-2025 · **322** | catálogo dinámico (`{{product.name}}`) · s/c | — (el más nuevo: «¡Suma IA a tu clínica dental hoy!», 20-jul, 75 d) | web («Get Offer») |
| Reservo (31) | 18-mar · **199** | s/c | «Más que agenda: gestiona toda tu consulta» · «Gestiona tu consulta con respaldo legal» | s/c |
| Dt.Dental (24) | 30-jun · **95** | video | la norma colombiana (Resolución 1888: «el plazo ya venció») y «lecciones rápidas» | «Más información» |
| Calu (15) | 1-jul · **94** | s/c | «Conocé Calu en 2 minutos» · «Probá Calu Gratis» | prueba gratis |
| CitaPro (13) | 17-jul · **78** | video de 62 s con presentadora; 3 versiones del mismo concepto | «Cabinas llenas, agenda bajo control» · «No es X, no es Y, es Z» | demo |
| Doctocliq (19) | 17-jul · **78** (ronda 1) | video con persona: médico real o escena IA; termina en la pantalla | la plata que se pierde («un sillón vacío te cuesta dinero»), tiempo y paz | web «Crea tu cuenta GRATIS» |
| CitaPro, imagen | 6-ago · **58** | imagen: mujer con el celular y burbujas de WhatsApp | «Muchos mensajes, poco orden» | demo |
| Medilink (41) | 6-sep · 27 | s/c | «Software médico integral ¡Demo gratis!» | demo |
| Agenda en Día (4) | 21-sep · 12 | imagen: laptop y celular con la pantalla, precio | «Imaginá terminar el día sabiendo cuánto facturó tu clínica, qué pacientes deben regresar…» | web |
| Clinera (20) | 30-sep · 3 | s/c | «Tres pacientes no llegaron hoy. Tres horas de box vacío que igual pagaste.» | s/c |

**Qué se copia** (cada frase igual pasa por `ONIA_CATALOGO_DE_VENTA.md` antes de usarse):
- **Un concepto y varias versiones.** CitaPro sostiene tres versiones del mismo anuncio, y Dentalink y Medilink pautan
  decenas a la vez. Para Onia: 2-3 versiones de UN ángulo, no piezas sueltas.
- **La consulta entera, no solo la agenda.** Es el gancho de los dos que más duran (Dentalink y Reservo) y de Agenda
  en Día. Coincide con la regla de que la oferta es el sistema.
- **El dolor en plata y en concreto:** «tres horas de box vacío que igual pagaste» (Clinera) o «un sillón vacío te
  cuesta dinero» (Doctocliq).
- **Una persona y, al final, la pantalla** (los videos de Doctocliq y CitaPro). Para Onia: Sergio Urcullo con la
  pantalla, o un presentador IA solo si él lo pide.
- **Destino de baja fricción:** prueba gratis (Calu, Doctocliq) o demo (CitaPro, Medilink).

**Qué no se copia:**
- **La urgencia por una norma** (Dt.Dental con la 1888 de Colombia, Huli con las NOM de México). Acá sería el SIAT, y
  está prohibido (§7).
- **Titular con «IA»** (Dentalink, CitaPro): §7, y el catálogo §8 limita qué se puede decir de la IA.
- **Un mismo anuncio para cualquier rubro** (Agenda en Día usa el mismo texto para clínica, estética y PetShop): rompe
  «si se puede cambiar el rubro y el copy sigue igual, se rechaza».
- **Precio en la imagen** (Agenda en Día): §5.4.
- **Testimonios y «+4000 doctores»:** hay cero clientes.

**Lo que falta, y desde la nube no se puede:** las capturas de los que más duran (las 3 de Dentalink de noviembre, las
4 de Reservo de marzo, Calu y Clinera) y la búsqueda de AgendaPro y Doctoralia. El conector busca por palabra en todos
los rubros (50 resultados, los más nuevos primero) y sin el id de la página no los encuentra. Lo hace la madre desde la
PC: por cada anuncio, el creativo, el texto, el botón y «N anuncios usan esta creatividad».

### 2.6.1 Re-medido el 8-oct con el conector `Meta_ads` (Sergio Urcullo: «mirá Pinterest y la Biblioteca para ver cuáles funcionan»)

**Qué se pudo y qué no.** El navegador de la nube **sigue sin abrir la Biblioteca** (HTTP 403, 8-oct) y **Pinterest pide iniciar sesión**: no se rodea ninguno. Por el conector sí: da titular, fecha de inicio, moneda y el enlace, **no el creativo ni el texto**.
Pinterest además **no mide rendimiento**: sirve de inspiración visual, no para saber qué funciona. Va como PEDIDO PC (con la sesión de Sergio Urcullo).

**Ids de página para consultar sin que se pierdan entre 50 resultados:** AgendaPro `1429581593936821` · Dentalink `106612849382553` · Doctocliq `122294408384514` · Dt.Dental `644396635996094` · CitaPro `117313424662542` · Wa7pro `1346974258489921`.
⚠️ **El conector devuelve los más nuevos primero con tope 50:** de Dentalink (92 activos) solo se ven los 50 más nuevos. **«Dentalink no tiene nada de más de 14 días» sería un error de lectura**; sus 322 días de noviembre (§2.6) siguen en pie.

| Anunciante (activos hoy) | Más viejo activo · días al 8-oct | Qué titula |
|---|---|---|
| **AgendaPro (49)**, *no estaba en la tabla* | 5-feb · **245** (dos anuncios) | *«La inteligencia artificial llegó · no más inasistencias · Comienza hoy»* y un anuncio dinámico de catálogo (`{{product.name}}`) |
| | 20-may · **141** | *«Sofía llegó»*: **un asistente de IA con nombre propio**; sigue como serie: *«Sofía trabaja por ti»*, *«Atiende sin soltar la tijera»*, *«Responde aunque no estés»* (barbería y clínica) |
| | 21-jun · 109 · 6-ago · 63 | *«La IA que organiza tu clínica»* · *«90 % menos inasistencias»* · *«Menos inasistencias en tu clínica»* |
| Dt.Dental (24) | 30-jun · **100** | todo gira en torno a la norma colombiana: *«¿Cumples los 3 pasos de la 1888?»*, *«El plazo de la 1888 ya venció»*, hoy *«Prepara tu consultorio para la Res. 1888»*, *«Res. 3100»*, *«RIPS»* y *«25 % de descuento»* |
| CitaPro | 17-jul · **84** | *«Cabinas llenas, agenda bajo control»*; reactivó el 2-oct *«Tu consulta ordenada cada día»* (creado en julio) |
| Doctocliq (24; eran 19) | 17-jul · **83** | *«La agenda que trabaja contigo»*; **relanza el mismo titular una y otra vez** (*«Esa paz mental es posible con Doctocliq»* ×5, *«¿Tu consultorio funciona sin tu asistente?»* ×3) |
| Dentalink (**92**; eran 81) | (no visible: tope de 50) | tanda nueva de las últimas dos semanas: *«IA para odontólogos»*, *«Reduce inasistencias hoy»*, *«-50 % inasistencias»*, *«Cyber: 30 % DCTO + IA»* ×5 y **una versión por país** (*«Conoce Dentalink - Argentina»*, *«…líder en México»*, *«RIPS JSON sin errores»* para Colombia) |
| Wa7pro | 4-oct · 4 | *«Agendó solo a las 21:14»*: **una hora concreta de titular**, la misma idea del «10:00» de A1. Demasiado nuevo para juzgarlo |

**Lo que dice, sin exagerar** (solo antigüedad; ningún dato de rendimiento):
1. **Los más viejos de todos son de AgendaPro (245 días) y son de dos tipos: un titular de «la IA llegó» y un anuncio de catálogo.** El catálogo dinámico es el formato que menos cuesta mantener vivo.
2. **Un asistente con nombre propio («Sofía») dura 141 días y se volvió serie.** Es una pista a probar, no una receta: hoy el bot de Onia no tiene cara ni nombre de campaña.
3. **Dt.Dental y Dentalink venden la norma de cada país**: acá es el SIAT y **está prohibido prometerlo** (§7).
4. **Lo que duran son muchas versiones de pocas ideas** (Doctocliq relanza el mismo titular; Dentalink hace una versión por país).

**Bolivia, el 8-oct** (anuncios cuyo alcance incluye el país; **la ausencia no prueba que no exista**, la búsqueda es por palabra):
| Búsqueda | Resultados |
|---|---|
| *«software clínica dental»* | **4**: 2 de Dentalink, 1 clínica, 1 ajena |
| *«agenda de citas pacientes clínica»* | **15**: software veterinario, plantillas de Canva, agendas de otros países; **ningún proveedor boliviano** |
| *«sistema para clínicas chatbot WhatsApp»* | **0** |

Lectura: **a un dueño de clínica de Santa Cruz solo le llega pauta de software dental de Dentalink**, y de bot de WhatsApp para clínicas, ninguna. Es consistente con el §2.1, y es la ventana que justifica la prueba de US$ 56. *(Hipótesis: «poca competencia en la subasta» no se midió; sin gasto no hay CPM propio.)*

**Pedido PC (madre):** (1) Pinterest con la sesión de Sergio Urcullo: tableros de anuncios de software y de clínicas dentales, solo inspiración visual. (2) Los creativos de estos ids, que desde la nube no se ven: AgendaPro `1967791207137782` (245 d), `1535822604884838` («Sofía llegó»), `1201810243016378`; Dt.Dental `1064012876297472`; CitaPro `1099827399129529`; Wa7pro `1777808483360755`; Doctocliq `1805370580894596`.

### 2.6.2 Estudio del 10-oct con el conector (Sergio Urcullo: «que mire ads library y mire qué anuncios funcionan»)

**Datos:** `research/competencia/anuncios/BIBLIOTECA-10OCT.json` (258 anuncios activos de 15 páginas de software para clínicas y negocios, 62 con más de 30 días; incluye Alegra, contable, y Sunnu, sin clasificar; y 417 de clínicas con alcance en Bolivia, 41 con más de 30 días de 24 anunciantes). **Cifras reproducibles:** `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-estadisticas.mjs`. **Ficha de las 12 dimensiones:** `references/video-intake/2026-10-10-biblioteca-anuncios-software-clinicas.md`. **Reglas con su caso:** skill `onia-ventas-pauta` §8.3. Un revisor independiente recalculó todo el 10-oct y corrigió 8 cifras y 3 conclusiones; lo de abajo ya las lleva. **La antigüedad no es rendimiento** y los porcentajes salen solo de los anunciantes con lista completa (119 anuncios, 33 con más de 30 d): son un **indicio**, no una prueba.

| Patrón | Evidencia (días al 10-oct) | Peso | Qué hace Onia |
|---|---|---|---|
| **Control / agenda / orden** | 12 de los 33 que duran (36 %) contra 7 de 86 nuevos (8 %): «Todos ven lo mismo. Tú tienes el control.» 37-47 d ×4, «Cabinas llenas, agenda bajo control» 73-86 d ×3 | **12 anuncios = 5 titulares de 2 anunciantes** (Doctocliq, CitaPro): un patrón de dos, no doce. Las clases se armaron mirando a los ganadores | **N1** «Todos sus doctores, una sola agenda» |
| **Demostración o prueba en el titular** | 4 de 33 (12 %) contra 3 de 86 (3 %), **los 4 de Doctocliq** («Prueba Doctocliq ahora/hoy» 45-85 d); AgendaPro «Agenda tu demostración gratis» ×5 (4 de ellos de 59-64 d; lista parcial) | **Flojo** (p ≈ 0,09 contando cada copia como independiente) y con un contraejemplo: **Calu perdió sus anuncios de prueba** («Conocé Calu en 2 minutos» 94 d, «Probá Calu Gratis» 53 d el 3-oct; hoy 5 anuncios y el más viejo 43 d) | Titular de Meta «Pida su demostración gratis» (27 caracteres) en A1 v6, A2 v3, N1 y N2; N3 prueba la prueba de 14 días |
| **Inasistencias y cancelaciones** | Es el dolor que **más anunciantes** usan (AgendaPro «Menos inasistencias en tu clínica» 65 d; Doctocliq «Dejá de perder citas» 57 d y «Evita cancelaciones…» 27 d; Dentalink; CitaPro) y Doctocliq sostuvo 78 d un video con «un sillón vacío te cuesta dinero» (§2.6) | **Mide uso, no duración:** solo 1 de los 33 que duran lo lleva en el titular | **A1** (precedente: ese video). Sin cifras de reducción: AgendaPro «90 % menos inasistencias» dura 65 d, pero Onia tiene 0 clientes y el detector las rechaza |
| **El papel y la ficha** | Calu «¿Seguís acumulando fichas y papeles…?» 43 d; AgendaPro «Ficha clínica digital» 65 d (parcial) | Flojo: 2 de 33 | **N2** «¿Sigue guardando las fichas en papel?» |
| **Un concepto, muchas copias** | Doctocliq 30 anuncios = 14 titulares; CitaPro 16 = 9; y los grandes tienen cientos activos (AgendaPro 313, Jelou 238, Dentalink 92-106) | Observado | Plan §5.11: 3 copias de A1 y corte el día 3/7/14. Con US$ 56 no se replica el volumen |
| **El largo del titular** | Mediana 33 caracteres entre los que duran y 36 entre los nuevos; **48 % de los que duran pasan de 33** (65 % de los nuevos) | **No distingue.** No es una regla | A1 se acortó de 46 a 27 caracteres para que lleve la oferta y se lea en el feed, no porque la edad lo pida |

**Lo que dura y Onia NO puede decir** (se anota como hueco): la **norma** (6 anuncios con titular de norma entre los 33: 2 de Dt.Dental, 99-100 d, y 4 de Reservo, 47-53 d; p ≈ 0,09: **no más fuerte que «control»**) y la **IA que atiende u ordena** (AgendaPro «Sofía» 143 d y «La IA que organiza tu clínica» 111 d, lista parcial). Sin obligación boliviana verificada y con el SIAT apagado (§7), y con el agente de WhatsApp sin conectar (catálogo §8).

**Qué piezas, y dónde caben.** La Biblioteca **no ordena con fuerza**: lo único con peso es «control» y viene de dos anunciantes. **A1 va primero porque es el plan de la prueba 1 y está lista**, con un precedente (el video de Doctocliq), no porque la evidencia la ponga primera. Las nuevas **no cambian el plan de §5.11** (solo A1 en 3 copias con US$ 56; después, tandas **«solo con plata de un cliente que ya pagó», §5.7**):

| Pieza | Tanda de §5.11 | Filas que tienen que estar en ✅ | Estado de las filas |
|---|---|---|---|
| A1 v6 | 1 | B-02, G-01, G-06, G-11, L-05 | ⬜ y L-05 ❌ (sin cuenta demo) |
| **N1** una agenda | 2 «La clínica entera» | B-01, B-02 | ⬜ |
| A2 v3 el saldo | 3 | E-01, E-03, G-01, G-08 | ⬜ (**sin ningún sobreviviente** que use el cobro de gancho) |
| **N2** la ficha | 4 «La ficha» | C-01 a C-03 | ⬜ |
| **N3** prueba de 14 días | **ninguna: contradice «no se prueban destinos» (§5.11, §5.10)** | A-04 y A-08 (ya ✅ vistos) | **Cambia el destino a `app.onia.com.bo/register` y no se mide como alta sin un evento de conversión (no verificado): la decisión es de Sergio Urcullo** junto con `canales_1_y_2` |

Todas dicen «demostración gratis»: la fila L-04 está 🟡 (la web dice 30 min y los mensajes 20; **los briefs no dicen minutos**). N3 **no** dice «configuración puesta» ni «le guiamos» (A-03, A-09 y L-06 sin verificar).

**Límites del método (revisión del 10-oct):** (1) las copias de un mismo anuncio no son independientes; (2) las clases de titular se definieron mirando a los ganadores y «otro» es 51 % de los nuevos; (3) AgendaPro y Dentalink son listas parciales por el tope de 50 (más nuevos primero): **sus medianas de edad no se usan**; (4) el conector **no permite medir la muerte de un anuncio**: `ad_active_status: INACTIVE` devolvió 0 para Calu; lo que sí hay es el cruce con el 3-oct: **todos los ids** de CitaPro, Doctocliq y Dt.Dental de `CAPTURAS-HECHAS.md` siguen activos (los de Dentalink no se pueden comparar: el tope de 50 oculta los viejos) y Calu pasó de 15 anuncios a 5; (5) el formato, el texto principal, el botón y el público no vienen (la descripción de la herramienta dice «ad creative text», pero las respuestas del 10-oct traen solo el titular).

**Bolivia (más de 30 días):** 41 anuncios de 24 anunciantes, **22 sin titular**; ruido: una inmobiliaria, ofertas de empleo y Medilink Bolivia SRL (124 activos de **equipos e insumos médicos**, no software: no cambia que ningún proveedor boliviano de software pauta). Los que tienen titular hablan al paciente: «Cuidado dental para niños en Santa Cruz» 249 d, «Prótesis fija desde 200 bs» 184 y 121 d (los de paciente sí duran con precio; es otro público), «Blanqueamiento con sistema de 3 luces» 55 d, «Agenda tu cita» 46 d, «Chatea con nosotros» 38-43 d ×3.

**Lo que el conector no trae se lo pido a la madre con Chrome** (`research/competencia/anuncios/PEDIDO-CAPTURAS.md`, sección del 10-oct). Los 5 que más duran y se capturaron el 1-2 oct **siguen activos** (Dt.Dental 102 d, CitaPro 86 d y 65 d, Doctocliq 85 d y 79 d). **Faltan 8, todos con más de 50 d:** AgendaPro `1535822604884838` («Sofía», 143 d), `1201810243016378` («La IA que organiza tu clínica», 111 d), `1601426334721119` («La IA atiende tu WhatsApp», 64 d) y `3652876658196882` («Agenda tu demostración gratis», 64 d); Doctocliq `1748838402916201` («Prueba Doctocliq ahora», 85 d) y `1738720983808867` («La agenda que trabaja contigo», 85 d); Dentalink `1614658333653742` (58 d, sin titular); Reservo `1056628280307783` (53 d).
**Re-medir en 2 semanas (24-oct):** repetir las consultas por `page_ids` y anotar cuáles ids del JSON **desaparecieron** (con `biblioteca-estadisticas.mjs` sobre el JSON nuevo): la muerte de un anuncio dice más que su edad.

## 3. La señal más barata que existe: las clínicas que ya pagan pauta

La misma Biblioteca muestra a **~20 clínicas dentales y ~10 de estética** de Santa Cruz que **hoy** pagan
para conseguir pacientes, varias con clic a WhatsApp (*Chatea con nosotros* sale en 33 de los 417 anuncios
vistos el 10-oct; el conector solo muestra el botón cuando coincide con el titular, §2.6.2). La lista, con la página de cada una y el cruce con los 20 prospectos de agosto, está en
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

> ⚠️ **Corregido el 8-oct.** El techo de Meta lo fija `ONIA_PLAN_1.0_Y_CAJA.md` §2-3 (3-oct, con los gastos reales):
> **Bs 750 en Meta**, dentro de un techo de Bs 1.400 para conseguir clientes. Son **US$ 56 = US$ 4 por día durante
> 14 días**, **un solo conjunto de anuncios**, optimizado a conversaciones. Bs 637 a 11,37 · Bs 666 a 11,89 · Bs 840
> a 15: **si el banco cobra más de Bs 13,4 por dólar, los 14 días pasan de Bs 750 y se corta antes** (a 15, el día
> 12). La escala de abajo es del 30-sep y **el «USD 10/día, USD 140» ya no vale**.

| Escala | Para qué sirve | Anuncios | Cuándo se evalúa |
|---|---|---|---|
| USD 5/día | medir qué % de conversaciones califica (queda en aprendizaje limitado por diseño). **Más que los US$ 4/día de la caja** | 2–3 | 14 días (~USD 70) |
| ~~USD 10/día~~ — **no entra en la caja de octubre** (≈ Bs 1.600, más del doble del techo de Meta) | leer el costo por conversación calificada en dos semanas | 3–4 | 7–14 días (~USD 140) |
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

> Alineado el 8-oct con `ONIA_PLAN_1.0_Y_CAJA.md` §3 (3-oct), que es la fuente de los límites. Los números salen del
> costo máximo por cliente (Bs 1.570 × 25 % de cierre = Bs 390 por demo; × 10 % de conversación a demo = Bs 40 por
> conversación). **Los dos porcentajes son supuestos**: con cero gasto, `ads_insights_industry_benchmark` contesta
> «No industry benchmark data» y `ads_insights_advertiser_context`, «Vertical: \N».

| Momento | CORTAR si… | SEGUIR si… |
|---|---|---|
| Día 3 | 0 conversaciones, o CTR < 0,8 % → se cambia la pieza | hay conversaciones |
| Día 7 | costo por conversación > Bs 40, o 0 conversaciones de dueños de clínica | ≤ Bs 40 y al menos 1 calificada |
| Día 14 | 0 demos, o costo por demo > Bs 390 | costo por demo ≤ Bs 390 |

- **Durante la prueba no se toca la segmentación ni se sube el presupuesto más de 20 %**: reinicia el aprendizaje.
- **Techo total que no se pasa: Bs 1.400** (Meta 750 + auditorías, comunidad y eventos 650). Al llegar, se apaga todo.
- **Seguir** quiere decir una segunda tanda igual, **pagada solo con plata de un cliente que ya pagó**, nunca con la
  reserva. Se escala (+20–30 % cada 3–4 días) solo con el costo por demo en tope dos semanas seguidas y lugar en la
  agenda de Sergio Urcullo: **cuando las demos superan su capacidad semanal, no se escala; el techo son horas, no pauta**.
- Se mide cada día **a mano, en una planilla**: conversaciones; cuántas son de un dueño o administrador de clínica; demos
  agendadas; costo por conversación; costo por demo; CTR; frecuencia.

### 5.8 La especificación, lista para crear en PAUSA

| Nivel | Valor |
|---|---|
| Cuenta | **ONIA Ads `act_1073680778314945`** (USD). **Nunca** NUVO ni Arthur Fuentes |
| Página | "Onia" `1140384625819526` |
| Campaña | `ONIA · Dental SCZ · WhatsApp · prueba 1` · Clientes potenciales · presupuesto total **USD 56** (Bs 750 de techo, §5.3) · fin a los 14 días · **PAUSED** |
| Conjunto | WhatsApp · Maximizar conversaciones · Santa Cruz de la Sierra + radio, "llegar a más" apagado · 25+ · Advantage+ con sugerencias · excluir registrados |
| Anuncios | **A1 y A2** (§5.10; reemplazan a D1 v3/v4) y **D4** (tabla de abajo). A1 v5 y A2 v2 se rehicieron el 8-oct mirando a la competencia (y el 10-oct pasaron a v6 y v3: titular de oferta, §2.6.2) (imagen 4:5, 9:16 y video de 11 s para A1) y esperan la cuenta demo (la vista de Sergio Urcullo sobre el diseño ya no rige desde el 9-oct: el carril revisa el render a 390 px). **D4 frenado** por el catálogo (el detector no encuentra a nadie). **Diseño, render y subida: sesión Ventas y pauta** (Sergio Urcullo, 30-sep; ver §0 punto 8). Marca personal no las hace. |
| Mensaje de bienvenida | "Para dueños/as de clínicas" + tres respuestas para tocar (§5.2) |

| Anuncio | Brief (`hermes-content/carousels/briefs/ads/`) | Título | Texto precargado |
|---|---|---|---|
| **A1 · Las 10:00** (Confirmador; antes D1) | `onia-platform-dental-meta-a1v5-las-diez.json` · imagen única y video 9:16 | *Un paciente que no confirma es un sillón vacío* | `Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.` |
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
- **Cada pieza se revisa renderizada a 390 px antes de subirla** (CLAUDE.md, 9-oct: el OK de diseño de Sergio Urcullo ya no rige;
  lo que sí sigue pidiendo su sí es gastar y contactar). Una pieza que muestra una función del producto sale solo con su fila en ✅.

**Quién la crea:** la sesión que tenga el conector de Meta Ads conectado a la cuenta de ONIA (bloqueo 3), o
Sergio Urcullo en el Administrador de anuncios con esta tabla. **Se crea en PAUSA y se enciende solo con su
OK.**

#### 5.8.1 Cómo se crea en PAUSA (10-oct): la versión ejecutable es un archivo

**`hermes-content/carousels/briefs/ads/CAMPANA-1-LISTA-PARA-CREAR.json`** trae los pasos con los parámetros EXACTOS del conector
(`ads_create_campaign`, `ads_create_ad_set`, `ads_creative_upload_media`, `ads_create_creative`, `ads_create_ad`, `ads_get_ad_preview`,
`ads_activate_entity`), el copy de usted, el público, US$ 4 × 14 días, las reglas de corte de los días 3, 7 y 14 y la respuesta del bot.
`scripts/campana-lista.test.mjs` lo cruza con este doc, con el conocimiento del bot (el MOTOR REAL lee cada código) y con el detector de
promesas, así que **este doc manda en los números y el JSON en la forma**: si cambia uno, cambia el otro en el mismo commit.
Los pasos que estaban acá (1-oct) se sacaron: tenían las imágenes de D1 v3 y decían que las ubicaciones por historia se cargaban a mano
(el conector ya acepta `placement_customizations`).

- ⛔ **«Crear en pausa» no existe en este conector.** `ads_create_campaign`, `ads_create_ad_set` y `ads_create_ad` dejan **borradores**
  (visibles en el Administrador) y `ads_activate_entity` los **publica en ACTIVO, gastando**. Pausa = borrador; encender = el último paso,
  con la fila 9. Nada se crea antes del OK de Sergio Urcullo (regla del carril, CLAUDE.md).
- **Antes de nada** (paso 0 del JSON): `ads_get_ad_accounts` con `has_payment_method: true`; `ads_get_pages_for_business` con
  `1451773736711697` lista la página `1140384625819526`. **No** `ads_get_ad_account_pages`: da `[]` en una cuenta que nunca pautó.
- **Códigos de anuncio: letra(s) + número y nada más** (`D1`, `D2`, `D3`, `D5`). El motor del bot (`bot-engine.mjs`, `conCodigoDelAnuncio`)
  no lee `(D1V)`: el lead nace sin origen. Se midió el 10-oct con el motor real; por eso A1-E = `D1`, A1-V = `D2`, A1-S = `D3`, A2 = `D5`.

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
| 7 | **Las cuatro capturas de la 1.0** en `carousels/briefs/assets/onia-1.0-dental-ads/` → A1 (y A2) renderizadas y revisadas a 390 px | las piezas renderizadas, miradas | capturas: Plataforma · diseño y render: Ventas y pauta · el OK de diseño de Sergio Urcullo ya no rige (CLAUDE.md, 9-oct) | ⏸️ **v3 renderizadas el 2-oct y en pausa** (`out/ads/onia-platform-dental-meta-d1v3-…` y `…-d4v3-…`). Sergio Urcullo: *«DEJA DE ARMAR, PRIMERO MIRA LA META ADS LIBRARY Y MIRA COMPETENCIAS»*. Primero el estudio de la Biblioteca (la madre, desde la PC), después el diseño. D4 frenado por el catálogo. v1 y v2 (carruseles) fueron rechazadas |
| 8 | **Campaña creada en PAUSA** con §5.8 | ids de campaña, conjunto y anuncios anotados en el handoff del carril | quien tenga el conector, o Sergio Urcullo | ❌ depende de 2–4 · pasos en §5.8.1 |
| 9 | **OK explícito de gasto con techo** (USD 56, 14 días, tope Bs 750) y **tipo de cambio** al que el banco cobra la tarjeta (§5.6) | por escrito | Sergio Urcullo | ❌ |

**Fila 6 si el carril chatbot sigue sin dueño.** La pauta igual se puede encender, porque la atribución no
depende del bot: el código (D1/D4) viaja en el texto de la conversación y se busca en Chatwoot. Lo que
falta sin el bot son las 5 preguntas y la salida cortés para los pacientes. Eso lo hace Sergio Urcullo a mano,
**el mismo día**. A US$ 4/día (el techo de §5.3) y US$ 1–4 por conversación (hipótesis) son **1 a 4
conversaciones por día**. *(Corregido el 8-oct: decía USD 10/día, que ya no entra en la caja.)* Lo que **no** se puede es encender sin haber hecho la prueba de la fila 5: si lo primero que
recibe un dueño de clínica es una respuesta mala, esa conversación se paga y se pierde.

**Cómo se renderizan (nube o PC):** `node .claude/skills/onia-ventas-pauta/scripts/anuncio-render.js --brief
<brief> --out <dir>` saca `feed.png` y `story.png`. Trae su letra (Archivo, en `scripts/fonts/`), así que no
depende de las fuentes instaladas. Método y trampas: skill `onia-ventas-pauta` §4.

#### 5.9.1 Re-medido el 8-oct (solo lectura, conector `Meta_ads`)

| Qué | Resultado | Fila de §5.9 |
|---|---|---|
| ONIA Ads `1073680778314945` | ACTIVE, USD, mínimo diario US$ 1, **`has_payment_method: false`** | 3 ❌ sigue |
| Página «Onia» `1140384625819526` | La lista `ads_get_pages_for_business` del negocio `1451773736711697`. `ads_get_ad_account_pages` da `[]`, que es normal en una cuenta que nunca pautó | 4 ✅ la página |
| Número del bot vinculado a la página | **El conector no lo muestra.** Lo mira Sergio Urcullo en Business Manager (página «Onia», configuración, WhatsApp) | 4 ⬜ sin medir |
| Instagram | `ads_get_ig_accounts` → `[]`: ONIA Ads no tiene Instagram vinculado. Los anuncios salen con la identidad de la página | — |
| Píxel «ONIA Web» `1012611478191231` | Activo; **disparó el 8-oct a las 11:42 (UTC-7)**, unas 14:42 en Bolivia. Falta verlo en «Probar eventos» con el alta y su `utm` | 1 ⏳ |
| Cuenta personal «Sergio Urcullo» `679613631427810` | Tiene tarjeta. **No se usa para Onia** sin su decisión | — |
| Benchmarks de la plataforma | Sin gasto no hay: «No industry benchmark data» y «Vertical: \N». **Los costos siguen siendo supuestos** | — |

### 5.10 El 16-oct: a dónde lleva cada anuncio, y qué tiene que estar en verde el 13

**La fecha es la del plan, no una promesa.** `ONIA_PLAN_1.0_Y_CAJA.md` §3 pone la prueba «desde el 16-oct, con los puntos
1 y 2 ya cerrados y los canales 1 y 2 ya contactados». Hoy el segundo requisito **no se cumple**: Sergio Urcullo frenó
todo contacto el 8-oct («no sé si el producto ya es funcional ni si prometemos lo que vamos a vender»). **Se decide el
13-oct**, con la tabla de abajo, y **no se enciende con una fila en rojo**: si alguna falla, la fecha se corre.

**Qué lleva cada anuncio**

| | Anuncio | Estado el 8-oct | Tiene que estar en ✅ en `ONIA_PROMESA_VS_PRODUCTO.md` |
|---|---|---|---|
| **A1** | **«Las 10:00»** (v6 del 10-oct; v5 el 8-oct, `carousels/briefs/ads/onia-platform-dental-meta-a1v5-las-diez.json`): «Un paciente que no confirma es un sillón vacío» + **«10:00 · Sin confirmar»** gigante + la tarjeta real con «Onia le deja el mensaje listo» y «Usted lo aprueba». Reemplaza a D1 v4 (que quedó como losa de texto: ver `research/competencia/anuncios/COMPARACION-DISENO-8OCT.md`). Texto de usted, alineado al catálogo §8.1, §8.3 y §7; el revisor de promesas da 0; **render hecho** en feed, historia y **video de 11 s** (`carousels/out/ads/onia-platform-dental-meta-a1v5-las-diez/`), mirado a 390 px junto a la competencia | **La captura es del candidato del 30-sep, no de producción: se rehace con la cuenta demo antes de subir** (y con la misma persona en la agenda y en Pendientes), **y sin el botón «Enviar yo mismo por WhatsApp» en la tarjeta** mientras G-03 esté en 🟡. Texto y kicker con el filtro «Para dueños y dueñas…» (10-oct); la imagen ya no dice minutos | B-02, G-01, G-06, G-11 y L-05 |
| **A2** | **«El saldo que nadie cobra»** (v3 del 10-oct, `…a2v2-el-saldo.json`): «Un cobro que nadie recuerda es plata que no entra» + **«45 días · Saldo vencido»** + la tarjeta real de cobro con «Onia le deja el mensaje listo». Mismo esquema que A1. Render de feed e historia hecho | Captura provisoria del 30-sep. **No sube hasta que E-03 esté en ✅**: la propuesta de cobro nunca se vio funcionando. La imagen muestra «Bs 250,00» de un paciente de ejemplo: no es un precio de Onia y lleva la leyenda «datos de ejemplo» | E-03, G-08, G-01 y G-11 |
| ~~D4~~ | Tratamiento a medias | **Congelado**: el catálogo §8 no deja decirlo | D-03 (hoy ❌) |

- **Falta una pieza con persona.** Los 7 anuncios de software que sobreviven en la Biblioteca (§2.5) tienen una, y el
  rediseño del 8-oct **no la arregla**: es la brecha que más pesa. Sin gasto de Higgsfield este mes (plan 1.0 §4), la
  salida es que Sergio Urcullo se grabe 25 segundos (guion en `COMPARACION-DISENO-8OCT.md`) mostrando `/pending` con la
  cuenta demo. **Es opcional para la primera tanda.**
- **Un precio no va en la imagen** (§5.4): se lee de `subscription-plans.ts` el día que se crea.

**A dónde lleva (decisión que hay que tomar y mi recomendación)**

1. **Recomendado: clic a WhatsApp** (el botón `WHATSAPP_MESSAGE` del anuncio), con el texto precargado
   *«Hola, vi el anuncio de Onia (D1). Tengo una clínica dental.»* (A2 lleva `(D5)`). Es el único destino que Meta
   puede optimizar a conversaciones con US$ 56, y el único que mide dueños de clínica por anuncio.
2. **En el chat:** el bot trae los tres botones de §5.2 y las 5 preguntas de calificación. A quien califica le da el
   link a **`sergiourcullo.vercel.app/llamada`** (hoy redirige a `cal.com/sergiourcullo/20min`, «Llamada 1 a 1»; 200
   el 8-oct). Sergio Urcullo recibe el aviso el mismo día.
3. **Por qué no mandar el anuncio derecho a `/llamada`:** el paciente que busca un turno caería en la agenda de
   Sergio Urcullo sin pasar por el filtro de los tres botones, y esa página no tiene el píxel, así que no se podría
   decir cuántas llamadas trajo cada anuncio. **Es una hipótesis, no un dato propio:** los 7 anuncios de software que
   sobreviven (§2.5) mandan a una cuenta gratis o a una demo, y ninguno a WhatsApp. Con US$ 56 no se prueban las dos;
   si la primera tanda no trae dueños, la segunda prueba `/llamada` con plata de un cliente.
4. **Cómo se llama el cierre:** *«llamada de 20 minutos, gratis»*. «Asesoría» promete otra cosa y la decide Sergio
   Urcullo aparte. **Hasta que exista la cuenta demo, la llamada no promete «una clínica de ejemplo»**: dice «20 minutos
   para ver si le sirve».

**Públicos** (todo en el mismo conjunto)

| | |
|---|---|
| Ubicación | Santa Cruz de la Sierra, radio 25 km desde (-17,7833; -63,1821), **«Llegar a más personas» apagado** |
| Edad y público | 25+, Advantage+ con sugerencias (odontología, administradores de páginas). **Sin exclusiones por interés: no existen desde el 31-mar-2025** |
| Excluir | A los ya registrados, solo si la lista ya existe. No se crea para esto |
| **No se hace** | Público personalizado con pocos teléfonos (Meta pide ≥ 1.000 y base legal) · lookalike · remarketing pago (plan §4) |
| El filtro real | La pieza («Para dueños y dueñas de clínicas dentales de Santa Cruz») y los tres botones del chat, no la segmentación (§5.2) |

**Go / no-go del 13-oct.** Una fila en ❌ y no se enciende. **Estado medido el 10-oct** (solo lectura, conector `Meta_ads`; lo que el conector no ve
queda como «sin medir»). La última columna separa lo que **pasa a ✅ sin Sergio Urcullo** de lo que **depende de él**.

| # | Condición | Dueño | Estado 10-oct | ¿Pasa a ✅ sin Sergio Urcullo? |
|---|---|---|---|---|
| 1 | Las filas de la tabla de arriba, en ✅, y la web sin lo que el catálogo no deja (`ONIA_PROMESA_VS_PRODUCTO.md` §2 y §3) | Plataforma, con la cuenta de prueba | ❌ ninguna verificada: falta la cuenta demo. Hoy 11:50 (La Paz) sale a producción F1 + #142 + #139 (aviso de la madre) | **Sí, salvo L-04** (20 contra 30 minutos), que decide Sergio Urcullo. Plataforma con la cuenta de prueba, después de esa salida. Si una fila queda en 🟡 o ❌ la fecha se corre. A2 ya no está en la prueba 1 |
| 2 | Cuenta demo con datos y **capturas nuevas de producción** para A1, re-renderizadas | Plataforma · Ventas y pauta | ❌ | **Sí.** Plataforma deja la demo y las C1-C7; Ventas y pauta re-renderiza y mira a 390 px (`grabar-captura.mjs`). «Vistas por Sergio Urcullo» ya no rige (CLAUDE.md, 9-oct): lo que habilita una pieza que promete una función es la tabla de la fila 1 |
| 3 | Medio de pago en ONIA Ads (`has_payment_method: true`) | Sergio Urcullo | ❌ **medido hoy: `false`** (la cuenta personal sí tiene tarjeta, y no se usa sin su decisión) | **No.** Solo él (y Leslie Mercado Moreno si la tarjeta es de la razón social, §5.11 fila 13) |
| 4 | Número del bot vinculado a la página «Onia» | Sergio Urcullo | ⬜ el conector no lo ve | **Sí, si ya está vinculado:** la madre hace desde la PC lo que exige un panel con login (CLAUDE.md) y **lee** Business Manager → página «Onia» → WhatsApp; el número del bot es +591 75414930 (`ONIA_RUNBOOK_COEXISTENCIA_75414930.md`). Leerlo no cambia nada. Si falta, vincularlo pide el código al teléfono de él |
| 5 | La respuesta a la pauta de usted **publicada**, y la prueba con dos mensajes desde un teléfono ajeno, mirando la respuesta | carril chatbot (publica) · quien tenga un teléfono ajeno (prueba) | La respuesta **ya está escrita y de usted** (`knowledge.onia.json` v2026-10-03.2, campaña de la frase-prefijo); sin verificar si producción la sirve. El motor lee D1, D2, D3 y D5 | **No del todo.** Es una fuente con firma humana (`publicar-solo.sh` `FIRMA_HUMANA`, §5.5): **la firma es de Sergio Urcullo**, una palabra. **Probar:** también él, 2 minutos con un teléfono que no sea el de Onia |
| 6 | Quién contesta y en cuánto (menos de 24 h abre la ventana gratis de 72 h) y la agenda de `/llamada` con horarios | Sergio Urcullo | ❌ y **hay un choque que él debe ver**: el bot ofrece una demo de **30 min** y el VSL y el CTA dicen **20** (L-04 🟡) | **No.** Es una decisión suya. Recomendación: contesta él, el mismo día hábil y antes de 24 h; el bot atiende al instante y le avisa |
| 7 | Tipo de cambio al que cobra el banco (se lee en el extracto): decide si Bs 750 alcanzan para 14 días | Sergio Urcullo | ❌ sin medir | **No lo mide nadie más, pero no tiene por qué bloquear:** con la regla «se apaga cuando el cobro acumulado llegue a Bs 750» (a 15 sería el día 12) la fila se cubre con una regla en vez de con un dato. **Es una regla manual: nada apaga solo en Bs 750**, alguien apaga a mano, y el techo duro es el total de US$ 56. Va dentro del OK de la fila 9 |
| 8 | Píxel visto en «Probar eventos» con el alta y su `utm` | Plataforma | ⏳ «ONIA Web» `1012611478191231` activo, **disparó el 9-oct 18:40 (UTC-7)**; «Probar eventos» no se ve por el conector | **Sí** (la madre o Plataforma desde la PC). **Y no bloquea esta campaña:** el clic a WhatsApp no depende del píxel (§5.1; respaldado por el esquema del conector, que para destino de mensajería solo pide `page_id`; no probado en esta cuenta). Propuesta: pasa a «no bloquea la prueba 1»; solo bloquea la web como destino |
| 9 | OK explícito de gasto con techo: **«US$ 56, 14 días, tope Bs 750»** | Sergio Urcullo | ❌ | **No.** Escrito por él **en la sesión que crea y enciende**; el de otra sesión no vale |

**Lectura (10-oct):** pasan a ✅ sin Sergio Urcullo las filas **2, 8, la 1 (salvo L-04) y la mitad de la 4**, todas detrás de la salida de hoy y de la demo de Plataforma.
**Dependen de él: 3, 5 (firma y prueba), 6, 9, L-04 y, si no acepta la regla manual, la 7.** Y tres condiciones que esta tabla no tenía y la revisión del 10-oct sumó al JSON de la campaña:
**Instagram** (ONIA Ads no tiene ninguno vinculado: sin él los US$ 56 corren solo por Facebook), **«canales 1 y 2 contactados»** (`ONIA_PLAN_1.0_Y_CAJA.md` §3; frenados el 8-oct y su aprobación del 10-oct cubre el texto, no el contacto) y la
declaración de IA del creativo (no se puede cambiar después). Lo mínimo que se le pide: la tarjeta, el OK escrito, su firma en la respuesta del bot, sí o no a «contesta él en menos de 24 h», qué minutos de llamada (20 o 30), Instagram sí o no, y 2 minutos con su teléfono.
**Hoy el veredicto es NO-GO**: 3, 5, 6 y 9 siguen en ❌ y 1 y 2 esperan a Plataforma.
La campaña ya está lista para crearse (`carousels/briefs/ads/CAMPANA-1-LISTA-PARA-CREAR.json`) el día que esas filas estén en ✅.

**9-oct, lo que cambió de mi lado (Ventas y pauta): ninguna fila pasó a ✅.** Las filas 1, 2, 3, 5, 6, 7 y 9 siguen igual; no hay cuenta demo ni
`ONIA_QA_EMAIL`/`ONIA_QA_PASSWORD` en el entorno de Ventas. Lo que sí quedó listo para que, cuando entre la cuenta, recapturar A1/A2 y las C1-C7 del VSL
sea un comando y no una tarde: `grabar-captura.mjs` con sus planes (skill §4.4) y el preview del corto (`carousels/briefs/ads/VSL-CORTO-TABLA-DE-CORTES.md`).
Es preparación, no avance en la puerta: **no abre ninguna fila del 13-oct**.

**Lo que falta de Sergio Urcullo, en una línea:** poner la tarjeta en ONIA Ads, vincular el número del bot a la página «Onia»,
firmar la respuesta a la pauta, dar el OK de gasto (US$ 56 · 14 días · Bs 750) y decidir el «usted» en los anuncios.

### 5.11 Campañas: plan vigente (2026-10-08)

> Pedido de Sergio Urcullo (8-oct): *«ayudame a hacer… mis campañas»*. Esta sección ordena lo de arriba en una página:
> qué se crea, qué se prueba, cómo se lee y qué la frena. No cambia ninguna cifra: la plata es §5.3, el corte §5.7, la
> spec §5.8 y el go/no-go §5.10. Cómo se hace cada pieza: skill `onia-ventas-pauta` §9. **Hoy no hay ninguna campaña
> creada, ningún anuncio subido y cero gasto.**

**Estructura de la prueba 1**

| Nivel | Qué |
|---|---|
| Campaña | `ONIA · Dental SCZ · WhatsApp · prueba 1` · Clientes potenciales · presupuesto total US$ 56 · 14 días · se crea en PAUSA (§5.8.1) |
| Conjunto | Uno solo: `Dental SCZ · 25+ · WhatsApp` (§5.10, «Públicos») |
| Anuncios | **Tres copias del mismo concepto, «el paciente de mañana que no confirmó»**, que cambian solo el formato: **A1-E** imagen 4:5 + historia, código `(D1)` · **A1-V** video de 11 s, `(D2)` · **A1-S** selfie de 25 s de Sergio Urcullo con la pantalla, `(D3)` (guion en `research/competencia/anuncios/COMPARACION-DISENO-8OCT.md`) |

- **Por qué tres copias de un concepto y no tres conceptos:** es el patrón de lo que más dura en la competencia
  (`COMUNICACION_Y_PAUTA_COMPETENCIA.md` §2: 2-5 copias por concepto), y deja una sola diferencia, **con persona o
  sin persona**. Los 7 anuncios de software que sobreviven tienen una persona (§2.5); A1-S es la que pone a prueba eso.
- **Antes de subir A1-E, A1-V y A1-S** se cambia «lo aprueba y lo envía, con un toque» por «usted lo aprueba»: el envío
  con un toque es G-03 (🟡) y el catálogo §7 no deja prometer el envío por WhatsApp. El guion del selfie dice lo mismo
  en 7-17 s y se corrige igual.
- **A2 (el saldo) no entra en la prueba 1:** espera E-03 en ✅ (§5.10).
- **Presupuesto en el conjunto, no por anuncio:** los tres anuncios comparten los US$ 4/día y Meta empuja al que mejor
  rinde. Que uno reciba pocas impresiones no es un veredicto: se anota.

**Tandas siguientes** (cada 2-4 semanas; **solo con plata de un cliente que ya pagó**, §5.7)

| Tanda | Concepto | Piezas | Filas que tienen que estar en ✅ (`ONIA_PROMESA_VS_PRODUCTO.md`) |
|---|---|---|---|
| 2 | La clínica entera | G1 (30 s) y el VSL corto (60 s, `sales-kit/06-VSL-DENTAL.md` §3, código `(V1)`) como dos copias | B-01, B-02, C-01 a C-03, E-01, E-03, G-01, G-04, G-06 |
| 3 | El saldo que nadie cobra | A2 v2 y G4 «Doctor, ¿sabe cuánto le deben?» | E-01, E-03, G-01, G-08 |
| 4 | La ficha | G3 (15 s) | C-01 a C-03 |
| 5 | Lo que ve el paciente | G2 (23 s) | I-01 (hoy 🟡), B-01, B-03 |
| 6 | Sus números | G5 (21 s) | G-13 |
| — | Tratamiento a medias | D4 | D-03 (hoy ❌): congelado |

**El VSL largo (~4 min) no es un anuncio:** se le manda por el chat a quien pasó las 5 preguntas, antes de la llamada,
y es el «Ver cómo funciona» de la página de entrada para clínicas cuando exista (`sales-kit/06-VSL-DENTAL.md` §1).

**Qué se prueba primero:** una sola pregunta, **¿la pieza y los tres botones del chat traen dueños de clínica?** Se lee
con *conversaciones de dueños ÷ conversaciones*. La segunda, solo entre los dos videos: qué formato frena más el pulgar
(A1-V contra A1-S). No se prueban destinos (solo WhatsApp, §5.10), públicos ni textos: con US$ 56 no alcanza ni para una
variable con estadística (§5.3).

**Métricas, a mano, una fila por anuncio y por día** (la planilla de §5.7):

| Métrica | Cómo | Para qué |
|---|---|---|
| Conversaciones y cuántas de dueños | Código del texto precargado, buscado en Chatwoot (el `referral` se pierde, §5.5) | La pregunta principal |
| Costo por conversación | gasto ÷ conversaciones | Corte del día 7 (§5.7) |
| CTR | Administrador de anuncios | Corte del día 3 (§5.7) |
| Reproducciones de 3 s ÷ impresiones | Solo A1-V y A1-S | Cuánto frena el gancho; sin umbral propio hasta la semana 1 |
| ThruPlay ÷ reproducciones de 3 s | Solo A1-V y A1-S | Cuánto retiene |
| Demos agendadas y costo por demo | `/llamada` agendadas desde el chat | Corte del día 14 (§5.7) |
| Frecuencia | Administrador | Si sube sin conversaciones, la pieza se gastó |

**Reglas de corte:** las de §5.7, sin cambios (día 3, día 7, día 14; no se toca la segmentación; no se sube más de 20 %).

**Lo que la frena y quién la destraba:** las 9 filas del go/no-go de §5.10, todas en ❌ o sin medir el 8-oct, más estas:

| # | Freno | Quién lo destraba |
|---|---|---|
| 10 | El copy de A1 y del selfie sin el envío «con un toque» (G-03) | Ventas y pauta |
| 11 | El selfie de 25 s grabado (A1-S) | Sergio Urcullo |
| 12 | El contacto descongelado: lo frenó el 8-oct, y el plan pide los canales 1 y 2 contactados antes de la pauta | Sergio Urcullo |
| 13 | Quién pone la tarjeta en ONIA Ads: los actos legales de Onia van por Leslie Mercado Moreno (la razón social del NIT); la cuenta personal `679613631427810` no se usa sin su decisión | Sergio Urcullo y Leslie Mercado Moreno |

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
