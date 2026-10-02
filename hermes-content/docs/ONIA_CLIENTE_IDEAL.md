# A quién le vendemos — el cliente ideal de Onia

> **Doc VIVO, sin fecha: se EDITA, no se reemplaza.** Es la fuente única de a quién le
> vendemos. Si un material de venta, una campaña o una propuesta le habla a otro, está roto.
>
> **Reemplaza a `historial/ONIA_ENFOQUE_20260727.md`**, que quedó archivado y por lo tanto
> **dejó de ser fuente** sin que nadie lo notara: durante siete semanas la única definición
> de cliente que tenía Onia vivía en la carpeta de fotos de un día. Lo que de ahí sigue
> siendo cierto está portado acá; lo que venció está corregido en §8, con el porqué.
>
> ⛔ **No es fuente de precios.** Los planes se leen de `onia-platform/lib/subscription-plans.ts`
> (`DEFAULT_PLAN_AMOUNTS`) y los add-ons de `lib/pricing.ts`. Acá se nombran planes, nunca
> números. Los límites por plan salen de `lib/plan-catalogo.ts`.
>
> **Todo lo medible de este doc se midió contra la base de producción y el código el
> 2026-09-18.** Cada cifra lleva de dónde sale. **§2 (matiz de la IA), §6 (uno o siete rubros) y
> §7 (tamaño del segmento) se re-midieron el 2026-09-30** contra la Biblioteca de Anuncios de Meta y
> fuentes públicas; el detalle vive en `ONIA_ADQUISICION_Y_PAUTA.md`.

---

## 1. La frase

> **Onia le vende a la clínica de Santa Cruz que ya tiene más pacientes de los que puede
> seguir a mano: 2 a 6 profesionales atendiendo, con recepción, que pierde plata en los
> pacientes que no volvieron.**

Empezando por dental. Estética es la misma venta con otro vocabulario.

---

## 2. El cliente ideal, con criterios que se pueden verificar

No son adjetivos: son cosas que se preguntan en dos minutos y se contestan con un número.

| # | Criterio | Por qué es ése y no otro |
|---|---|---|
| 1 | **2 a 6 profesionales atendiendo** | Con 1, el dueño se acuerda de todo y no hay nada que coordinar. Con más de 6 ya hay administrador y proceso propio, y la venta se alarga |
| 2 | **Tiene recepción** (una persona que agenda) | Es la señal de que el volumen ya no cabe en la cabeza del dueño. También es quien va a usar el sistema todos los días |
| 3 | **Santa Cruz de la Sierra** | Es donde están los tres registros reales y donde Sergio Urcullo puede ir en persona si hace falta |
| 4 | **Con NIT, en régimen general** | Sin NIT no hay facturación que resolver, y el Portal gratis del SIN le alcanza |
| 5 | **Tratamientos de varias sesiones** | Es la condición del dolor #1 (§4). Una consulta de una sola visita no genera pacientes a medias |
| 6 | **Agenda en cuaderno, Excel o WhatsApp** | Si ya paga otro sistema, la venta es un reemplazo: más cara, más lenta y se decide distinto |

**Los seis juntos describen a la clínica de 4 doctores que nos escribió el 25 de agosto**
(§3). Ése es el cliente, dicho por él mismo y no por nosotros.

### A qué plan corresponde cada tamaño

Los topes salen de `lib/plan-catalogo.ts` (pacientes · usuarios · si trae agentes):

| Tamaño real | Plan que le calza | Qué lo define |
|---|---|---|
| 1 profesional solo | **Básico** | 2 usuarios, 300 pacientes, **sin agentes** |
| 2-3 profesionales + recepción | **Crece** | 3 usuarios (4 con `a7f228c`, del 1-oct, al publicarse), 800 pacientes, **acá empiezan los agentes y la reserva pública** |
| 4-5 profesionales + recepción | **Profesional** | 5 usuarios, 1.500 pacientes, agentes y reportes completos |
| 6+ o varios consultorios | **Completo** | usuarios y pacientes sin tope, **chatbot incluido** |

🔴 **El cliente ideal arranca en Crece, no en Básico.** No es una preferencia de margen: los
**agentes recién existen desde Crece**, y los agentes son lo único que ningún competidor local
tiene. Un cliente de Básico paga por una agenda ordenada y nunca ve por qué somos distintos,
así que ni renueva con ganas ni recomienda. **Vender Básico a quien podía pagar Crece es
perder al cliente dos veces.**

⚠️ **Matizado el 2026-09-30 (carril Mercado): «IA» ya no distingue a nadie.** TuDoc (software
médico boliviano) y Dentalink y Medilink (Healthatom, Chile, pautando en Bolivia desde junio)
titulan con IA, y en su **pauta** en Bolivia es **IA del trabajo clínico** (dictar la ficha, leer la
radiografía, simular la sonrisa): ninguno **titula** con recuperar pacientes (medido en la Biblioteca de
Anuncios). ⚠️ **Pero eso no prueba que ninguno lo OFREZCA:** la web de Dentalink anuncia un *Contact
Center IA* con *recall* y *"venta de tratamientos"* (visto solo en el extracto del buscador; **abrir la
página antes de afirmar nada en material de venta**). Por eso el diferenciador no es "el único que
recupera", sino **recuperar desde el plan de tratamiento, con los datos de la clínica, en bolivianos y
con SIAT** — y **se vende nombrando el trabajo** (*"te muestro qué pacientes dejaron el tratamiento a
medias"*), nunca la tecnología. Evidencia: `ONIA_ADQUISICION_Y_PAUTA.md` §2.

---

## 3. La evidencia — quién llegó solo, sin una sola campaña

Todo lo de esta sección se leyó de producción el 2026-09-18, no de un doc.

**Los tres que se registraron** (`public.access_requests`):

| Negocio | Rubro que eligió | Ciudad |
|---|---|---|
| clinica klein | dental | Santa Cruz |
| Clinica Leonardo | estética | Santa Cruz |
| consultorio dental sonrisa feliz | dental | Santa Cruz |

**Tres de tres son clínicas. Tres de tres son de Santa Cruz.** Ninguna campaña los trajo.
Ninguno fue contactado todavía.

**El lead más calificado que recibió Onia** (Chatwoot, conversación 35, 25 de agosto) se
describe solo, textual:

> *"estoy evaluando un sistema de gestión para una clínica odontológica de 4 doctores […]
> La función que más nos interesa es poder identificar pacientes que tienen un tratamiento
> pendiente pero que […] cancelaron una cita o dejaron de asistir y posteriormente no
> volvieron a programar."*

No pidió una demo ni preguntó el precio primero. Pidió **una capacidad concreta** y después
el costo total para su tamaño. Ése es el comportamiento del cliente ideal, y el molde contra
el que se calibra todo el material de venta.

**Lo que la evidencia NO dice.** Son cinco señales, no un estudio. No prueban que el dental
sea el mejor mercado: prueban que es **el que ya nos está buscando**, que con cero clientes
es la única información honesta disponible.

---

## 4. El dolor, en el orden en que lo tiene el cliente

⚠️ **Acá el doc viejo estaba al revés, y es la corrección más cara de este archivo.**
Ponía la facturación electrónica como dolor #1. El único lead calificado que llegó no la
mencionó ni una vez.

| # | Dolor | Quién lo dijo |
|---|---|---|
| **1** | **El paciente con tratamiento a medias que no volvió a agendar** | La clínica de 4 doctores, sin que nadie se lo preguntara |
| **2** | La agenda que vive en la cabeza de la recepcionista | Es el supuesto detrás del criterio 2 (§2), aún **sin confirmar por un cliente** |
| **3** | Facturar sin re-tipear en el portal del SIN | Nadie lo pidió todavía |

**Consecuencia para la venta:** se abre por el paciente que no vuelve, no por el SIAT.

🔴 **Y el SIAT no se usa como argumento de urgencia.** Dos razones, las dos verificadas:
el emisor fiscal propio está **al 24,8% de la fase 1** ante el SIN, así que la promesa no
está viva; y decir "es obligatorio por ley" está **prohibido** porque el Portal del SIN es
gratis y cumple. La forma honesta de decirlo ya está escrita en el one-pager del sales-kit.

---

## 5. Quién NO es cliente

Cada uno con el motivo por el que suena a cliente y no lo es.

| No es cliente | Por qué suena que sí | Por qué no |
|---|---|---|
| **El consultorio de 1 profesional** | Es el más fácil de encontrar y el que más rápido contesta | No tiene problema de coordinación, y el plan que paga no incluye agentes: nunca ve el diferenciador (§2) |
| **El emprendimiento que arranca** | Tiene ambición y contesta rápido | Pocas facturas, pocos clientes, poca plata. **El dolor llega con el volumen, no con la ambición** |
| **La empresa grande** | Ticket alto | Compra por licitación, exige integraciones y tarda meses. Con una sola persona, es imposible |
| **El consumidor final** | — | Onia no le vende a personas. Nunca fue el negocio |
| **El que solo quiere una página web** | Paga hoy y ya nos escribe | **Es otra venta.** Falla el test de tres preguntas de la estrategia: no depende del sistema y se entrega con horas. Se atiende, no se persigue, y **no se lo cuenta como avance de la etapa 1** |

⚠️ **El de la web ya nos está costando.** El 17 de septiembre un pedido del configurador de
webs llegó por WhatsApp y el bot lo trató como consulta de precio de la plataforma: le
contestó con el pitch del sistema. Dos ventas distintas mezcladas en el mismo canal
terminan en que ninguna de las dos se cierra.

---

## 6. Los rubros que se salen a buscar

> ⚠️ **Decisión de Sergio Urcullo, 30-sep, de noche: *«no solo somos clínica, lee el repo»*.** Esta sección
> decía que la venta, la pauta y la vidriera iban a **un solo rubro, dental**, y que el resto «se atiende si
> llega». **Eso quedó sin efecto.** Queda así:
> - **Se sale a buscar en los rubros que el producto sostiene en una demo.** Cada uno tiene su propia lista y
>   su propio mensaje; nunca va un mensaje para todos.
> - **El orden sale de lo verificado en el código** (`research/onia-1.0-29sep/VENDIBLE_OTROS_RUBROS.md` e
>   `INVENTARIO_POR_RUBRO.md`, 29-sep, en `wip/v1-hermes-20260928`):
>   1. **Dental y estética.** Son las mismas pantallas y los mismos agentes. Listas en
>      `ONIA_PROSPECTOS_DENTAL_SCZ.md` §6 y `ONIA_PROSPECTOS_OTROS_RUBROS_SCZ.md` §1.
>   2. **Importadora**, acotada a lo que funciona: costeo de importación y alerta de reprecio por devaluación.
>      La cotización no sale del sistema. Lista en `…OTROS_RUBROS_SCZ.md` §2.
>   3. **Comercio y servicios profesionales.** Los candidatos quedan anotados. Se les escribe cuando
>      Plataforma confirme que la 1.0 arregla lo que se ve en una demo: en comercio, editar el producto, el
>      precio y el stock; en servicios, que la agenda sea de más de un profesional en los planes bajos.
> - **Lo que sigue valiendo de abajo:** la pauta paga va de a un rubro por conjunto de anuncios, porque Meta
>   aprende por conjunto; se empieza por dental y la prueba social se arma rubro por rubro.
> - La tabla y la regla de abajo quedan como historia del mediodía del 30-sep.

Se venden cinco rubros (`ONIA_CATALOGO_DE_VENTA.md`).

| Rubro | Postura hoy | Cuándo cambia |
|---|---|---|
| **Dental** | 🎯 **Se persigue.** Es el único con recorrido real | — |
| **Estética y spa** | 🎯 **Se persigue.** Es la misma nav con otro vocabulario, y ya llegó una sola | — |
| **Comercio / ferretería** | 🟡 Se atiende si llega, no se busca | Cuando el dental llegue a 5 clientes pagando |
| **Importadora** | 🟡 Solo cotizaciones B2B y costeo | Idem |
| **Servicios profesionales** | 🟡 Se atiende si llega | Idem |
| **Veterinaria · ganadería** | ⛔ No se ofrece | Tienen bloqueos abiertos en el producto |

~~**La regla que ordena esto:** perseguir dos rubros a la vez con una sola persona es la
versión chica de tener nueve líneas de negocio. Un rubro, hasta que pague.~~ *(Sin efecto desde el 30-sep, de
noche: ver arriba.)*

### ¿Uno o siete? — la pregunta, contestada con datos (2026-09-30)

> Sergio Urcullo, 2026-09-30: *"me dicen si ofreces a demasiadas personas nunca vas a vender nada…
> revisá si es rentable colocar tantos rubros, tantas opciones"*.

**Tienen razón para la VENTA, y no para el PRODUCTO.** Son dos cosas distintas y conviene no
mezclarlas:

- **El producto sigue multi-rubro.** Los packs ya están construidos, mantenerlos cuesta cero y son
  la base de la v1.2 (el segundo rubro se **enciende** desde el core, `ONIA_ESTRATEGIA_DE_EMPRESA.md`
  §12). Borrarlos no ahorra nada.
- **La venta, la pauta y la vidriera: un solo rubro.** Dental. El **segundo**, después de los 5 dentales:
  **importadora, según decidió Sergio Urcullo** (aviso del carril Plataforma, 30-sep; sus palabras textuales
  quedan pendientes de anotar). Los datos de esta pasada ponían a estética por ser la más barata de encender
  (comparte pantallas y agentes con dental); importadora tiene a favor la urgencia fiscal del IVA "por fuera"
  y un prospecto real. Mientras tanto, estética **se atiende si llega**.

| Dato medido | Qué dice | Fuente |
|---|---|---|
| Quién llegó solo | Los 3 registros son clínicas de Santa Cruz y el lead más calificado es una clínica odontológica de 4 doctores. **Ninguna** señal con rubro identificado es de comercio, importadora o servicios | §3 de este doc |
| Quién compite por el mismo mensaje | Comercio/facturación: **≥12 vendedores bolivianos pautando en BOB** esta semana. Dental: **ningún software boliviano pauta**; solo Healthatom (Chile, en USD) | `ONIA_ADQUISICION_Y_PAUTA.md` §2 |
| ¿Se alcanza al comprador? | Al odontólogo boliviano ya le pautan cursos, insumos, sillones, marketing y software todos los días. Y **~20 clínicas dentales de Santa Cruz pagan hoy pauta** para conseguir pacientes | idem §2–§3 |
| Plata de pauta | Meta aprende con ~50 resultados por semana **por conjunto de anuncios**. Con un presupuesto chico, un público junta señal; cinco públicos no juntan ninguna | idem §5 |
| Horas de soporte | Cada rubro trae otras preguntas y otro flujo: sumar rubros en la venta baja el techo del §9 de la estrategia | `ONIA_ESTRATEGIA_DE_EMPRESA.md` §9 |
| Prueba social | Un odontólogo le cree a otro odontólogo. Cinco clientes en cinco rubros = cero casos para mostrar en ninguno | inferencia |

**Lo que está roto no es la estrategia, es la vidriera.** La decisión de vender solo dental existe
desde el 5-sep (etapa 1). Pero al 30-sep la home de `onia.com.bo` le habla a *"tu negocio"*, `/rubros`
lista cinco rubros y el meta-description vende *"fichas de clientes, caja y cobros… armado para tu
rubro"* (leído del código de `web-factory/apps/onia-platform/src/app/(sitio)/`, no de la página
renderizada). **Quien llega desde un anuncio para clínicas tiene que aterrizar en una página que le
hable a una clínica.** La web pública es del carril Plataforma; el pedido está en EL HILO.

---

## 7. ¿Alcanza el mercado? — sí, y por mucho

La pregunta correcta no es cuántas clínicas hay en Bolivia, sino **si el cliente ideal
alcanza para los dos números que importan**: 5 clientes (el break-even) y ~40 (el techo de
soporte de una persona).

| Dato | Valor | Fuente |
|---|---|---|
| Unidades económicas registradas en Santa Cruz | **117.894** (29,9% del país) | SEPREC, hasta agosto de 2025 |
| Odontólogos colegiados en los tres ejes del país | ~15.000 | Dental Tribune — **dato de 2019, direccional, no verificado hoy** |
| Clientes para cubrir todo el gasto mensual | **~4 a 7**, según el plan | Gasto mensual ÷ plan, con la fórmula de la estrategia |

**Conclusión:** aun descontando con dureza el dato dental por viejo, el orden de magnitud
no deja lugar a duda. **El mercado no es el cuello de botella.** Nunca lo fue: el cuello es
que a los cinco que ya llegaron solos todavía no les contestó nadie.

⚠️ **Corregido el 2026-09-30 (carril Mercado): «alcanza, y por mucho» vale para la etapa 1, no para
el techo.** Las filas de arriba miden el universo (todas las unidades económicas, todos los
odontólogos), no el **segmento** del §2. Estimado con dos métodos cruzados —la estructura del SEDES
de Santa Cruz (125 clínicas + 1.812 consultorios dentales registrados, dato de ~2018) y los conteos
de odontólogos—, las clínicas de **2 a 6 profesionales en Santa Cruz son ~150 a 400** (punto medio
~250) [inferencia, método en `ONIA_ADQUISICION_Y_PAUTA.md` §1].

| Meta | Qué parte del segmento hay que ganar | Lectura |
|---|---|---|
| **5 clientes** (break-even) | **1 a 3 %** | holgado: el mercado no frena la etapa 1 |
| **~40 clientes** (techo de soporte de una persona) | **10 a 27 %** | muy exigente con un solo rubro en una sola ciudad |

**Consecuencia:** el techo de 40 pide, más adelante, sumar **un segundo rubro** (importadora, según la
decisión de Sergio Urcullo del 30-sep; estética es la más barata de encender) y/o **otra ciudad**. Es exactamente la v1.2 de la estrategia (§12), y confirma su
orden: primero 5 dentales, después el segundo rubro encendido desde el core. Lo que no cambia: hoy
el cuello de botella sigue sin ser el mercado.

---

## 8. Qué cambió respecto del doc archivado, y por qué

Lo que se portó sin cambios: B2B sin excepción · negocios formales que ya operan ·
plataforma y no servicios · dental primero · Bolivia primero · la regla de que todo le
habla al cliente o construye el camino hacia él.

Lo que se corrigió, con su motivo:

| Decía antes | Dice ahora | Por qué |
|---|---|---|
| "1 a 20 personas" | **2 a 6 profesionales** | 1-20 no discrimina: mete al consultorio de uno y a la empresa con administrador en la misma bolsa. El rango nuevo sale del lead real y de los topes por plan |
| Facturación = dolor #1 | **El paciente que no volvió = dolor #1** | El único lead calificado no mencionó la facturación |
| "Cumple la ley boliviana" como diferenciador vivo | **Los agentes son el diferenciador; el SIAT está en trámite** | El emisor está al 24,8% ante el SIN. Un diferenciador que no está encendido no se vende |
| "3-5 clínicas antes de mediados de octubre" | **5 clientes pagando, sin fecha heredada** | La fecha venía de un runway de julio. El objetivo lo ratificó Sergio Urcullo el 5 de septiembre |
| El contenido "lo opera Arthur" | **No hay nadie externo operando contenido** | Arthur ya no colabora |
| Planes Básico / Pro / Full | **Básico · Crece · Profesional · Completo · Empresa** | La escalera C entró el 12 de septiembre. Son cinco escalones, no tres |

🔴 **Dos materiales quedaron desalineados y hay que arreglarlos** (anotado, no hecho acá):

1. **`sales-kit/01-ONE-PAGER-OFERTA.md` vende "DentalGest"** y lista tres planes con precios
   que ya no son los de la fuente. DentalGest **no es una marca**: es el nombre viejo del
   pack dental. Es el material que se le manda al cliente por WhatsApp.
2. **`docs/ONIA.md` describe a Onia como "agencia de diseño web"** y nombra DentalGest y
   Gestios como productos separados. Contradice la regla de un solo producto.

---

## 9. Cómo se califica un prospecto, en cinco preguntas

Para usar en la primera conversación. Si las cinco dan bien, es cliente ideal y se le
ofrece Crece o Profesional según el tamaño.

1. **¿Cuántos profesionales atienden?** → 2 a 6 es el punto dulce.
2. **¿Quién agenda las citas?** → si hay recepción, el dolor existe.
3. **¿Cómo llevan hoy la agenda y las fichas?** → cuaderno, Excel o WhatsApp es la señal buena.
4. **¿Cuántos pacientes tienen un tratamiento empezado y no volvieron?** → si no lo sabe, ése
   es exactamente el problema y acaba de decirlo él.
5. **¿Facturan con NIT?** → confirma que es negocio formal.

**La pregunta 4 es la que vende**, porque nadie la puede contestar y todos entienden al
instante lo que significa no poder contestarla.

---

## 10. Cómo se verifica que este doc sigue vivo

Los tres números que lo sostienen, y cómo se recuentan:

```bash
# Quiénes se registraron y de qué rubro
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i supabase-db psql -U postgres -d postgres -c "SELECT \"businessName\", \"verticalTrackId\", city, \"contactedAt\" FROM public.access_requests ORDER BY \"createdAt\";"'
```

```bash
# Si ya hay alguien pagando (el número que cambia la etapa entera)
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i supabase-db psql -U postgres -d postgres -c "SELECT status, count(*) FROM public.subscription_payments GROUP BY 1;"'
```

Medido el 2026-09-18: **cero filas de pago.** El día que esa consulta devuelva una fila
`APPROVED` de un cliente que no sea prueba ni familia, este doc se revisa entero — porque
ahí deja de ser una hipótesis con evidencia y pasa a ser un hecho con cliente.

---

Relacionado: `ONIA_ADQUISICION_Y_PAUTA.md` (cómo se consiguen clientes: canales, competencia, pauta) ·
`ONIA_CATALOGO_DE_VENTA.md` (qué se vende y en qué estado) ·
`ONIA_ESTRATEGIA_DE_EMPRESA.md` (la etapa vigente y el test de tres preguntas) ·
`ONIA_LEADS_ESPERANDO.md` (los cinco que están esperando respuesta) ·
`ONIA_WEB_COMO_SE_VENDE.md` (la otra venta, la que no se mezcla con ésta).
