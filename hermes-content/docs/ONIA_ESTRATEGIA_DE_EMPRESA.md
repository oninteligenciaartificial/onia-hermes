# De freelancer a empresa — la estrategia, y por qué NO es financiación ni equipo

> **Doc VIVO, sin fecha: se EDITA, no se reemplaza.** Responde tres preguntas de Sergio Urcullo
> del 2026-09-05: *"¿necesitamos financiación? ¿necesitamos un equipo de desarrollo?"* ·
> *"quisiera escalarlo de manera que no sea solo yo como un freelancer… quisiera que fuera una
> empresa, de verdad"* · *"¿qué tan rentable ves nuestro producto?"*, con su tesis de plataforma
> (*"se le conecta hartísimas cosas… primero la v1.0 y luego vamos añadiendo"*).
>
> **Todo lo medible de acá se midió contra el repo y la base de producción el 2026-09-05.**
> No hereda conclusiones: cada cifra lleva de dónde sale. Si una quedó vieja, se recuenta
> con los comandos de §15 y **se corrige este archivo**.
>
> ⛔ **No es fuente de precios.** Los precios se leen de `onia-platform/lib/subscription-plans.ts`
> (`DEFAULT_PLAN_AMOUNTS`) y `lib/pricing.ts`. Acá aparecen **fórmulas**, y el número es
> derivado: si el precio cambió, se recalcula, no se corrige a mano.

---

## 0. La respuesta corta

1. **ONIA no necesita financiación.** El punto de equilibrio está a **5 clientes**. Ningún
   fondo se mueve por eso, y no hace falta que lo haga.
2. **ONIA no necesita un equipo de desarrollo.** Construir es lo único que ya sobra: 25
   commits en un solo día, 5 rubros, 21 capacidades, agentes corriendo solos. El cuello de
   botella está en el otro extremo: **cero clientes**.
3. **La empresa YA EXISTE**, legal y arquitectónicamente. Lo que falta no es fundarla: es
   que arranque el motor.
4. **Lo que hace que ONIA se sienta un freelancer no es atender clientes a mano.** Es tener
   **nueve líneas de negocio abiertas con una sola persona**. Una empresa se define tanto
   por lo que rechaza como por lo que hace.
5. La ruta es **podar, no sumar**: una línea, cuatro etapas, cada una con criterio de salida
   numérico (§7).
6. **El producto es MUY rentable: 94-99,8% de margen bruto, y operar cuesta Bs ~461/mes tenga
   1 cliente o 40** (§8). No hay problema de rentabilidad — hay problema de clientes, que es
   otra cosa y se arregla distinto.
7. **El techo no es técnico: son las horas de soporte de una persona** (§9). Una persona sola
   topa en ~30-50 clientes. Bajar el soporte por cliente **sube el techo del negocio**; una
   feature nueva sólo agrega valor a un cliente.
8. **La tesis de plataforma ("se le conecta de todo") es correcta, y tiene un test de tres
   preguntas** que separa el add-on que apalanca del negocio nuevo disfrazado (§10). El chatbot
   pasa las tres; la web, el influencer y el contenido fallan.
9. **La v1.0 no es una lista de features: es un cliente que paga el SEGUNDO mes** (§11).

---

## 1. Qué separa a un freelancer de una empresa

No es tener empleados, ni oficina, ni inversión, ni logo. Hay freelancers con cinco
empleados y empresas de un solo dueño.

> **Freelancer:** el ingreso se detiene cuando la persona se detiene. El valor vive en su cabeza.
> **Empresa:** es un sistema que produce valor sin que esa persona esté presente. Se puede
> vender sin ella adentro.

Consecuencias directas de esa definición, y las dos duelen:

- **Un SaaS con 0 clientes no es una empresa: es un producto.**
- **Un SaaS con 50 clientes que se dan de alta solos SÍ lo es**, aunque siga trabajando una
  sola persona.

**El número de empleados no define empresa. El número de clientes que no dependen del
fundador, sí.**

---

## 2. Dónde estamos parados — medido, no recordado

| Qué | Valor | Cómo se verificó |
|---|---|---|
| Clientes pagando | **0** | 4 orgs en producción: Onia interna + QA |
| Leads reales sin contestar | **7** | `ONIA_LEADS_ESPERANDO.md` — 3 `access_requests` + 4 de Chatwoot |
| Espera del más viejo | 21-ago → **15 días** al 2026-09-05 | `contactedAt` NULL en los tres |
| Commits en un solo día | **25** | `git log` del 2026-09-05 |
| Worktrees abiertos a la vez | **8** (6 sin declarar dueño) | `COORDINATION_MANIFEST.md` |
| Documentos en `docs/` | **390** | `LEEME-PRIMERO.md` |
| Sociedad registrada | **OniaAgency, SEPREC 5371375010** | `ONIA_LEGAL_BOLIVIA_ESTADO.md` |
| Entidad que el cliente acepta al registrarse | 🔴 **no existe en SEPREC** | idem, §2 |

**La lectura de esa tabla, en una línea:** todo lo que se produce sube; el único número que
importa está clavado en cero.

---

## 3. El diagnóstico: nueve líneas de negocio, una persona

Relevado del `COORDINATION_MANIFEST.md` y de `docs/` el 2026-09-05:

| Línea activa | Qué es en realidad |
|---|---|
| Onia Platform (5 rubros) | SaaS — **el negocio** |
| Chatbot / WhatsApp | add-on del SaaS ✔ *(pertenece)* |
| Web Factory | webs de cliente — **servicio a medida** |
| Video Factory / Higgsfield | producción audiovisual — **servicio** |
| Influencers IA | otro producto entero |
| Contenido y ads | **servicio** |
| Bolivian Electric | **consultoría** (5 docs de propuesta) |
| Marca personal (Arthur) | **servicio** |
| ONIA Box | **hardware** |

> **Una empresa hace una cosa a la vez con muchas manos.**
> **Un freelancer hace muchas cosas a la vez con una mano.**

Tomar cada oportunidad que aparece **es** el comportamiento del freelancer. El costo no es
teórico: nueve frentes con una persona significa que **ninguno alcanza masa crítica**. Por eso
se siente estancamiento con 25 commits en un día.

Los 8 worktrees simultáneos son el mismo patrón una capa más abajo — la regla de "nada a
medias" (`CLAUDE.md` §2) rota a nivel flota, según el propio manifiesto.

---

## 4. Financiación — la aritmética que cierra la discusión

### Cómo funciona el capital de riesgo, sin folklore

Un fondo levanta ~USD 100M e invierte en ~30 empresas: 25 mueren, 4 devuelven lo puesto, y
**1 sola tiene que devolver el fondo entero**. Todo lo demás se deriva de ahí:

- Necesitan que cada apuesta **pueda** valer 100x. Un negocio que llega a USD 5M/año es
  **excelente negocio y pésima inversión de VC**: no mueve su fondo.
- Piden crecimiento ~3x anual, no rentabilidad.
- Invierten en **acelerar un motor que ya anda**, nunca en encenderlo. Su pregunta no es
  "¿es buena la idea?" sino **"¿qué se rompe si te doy plata?"**. Si la respuesta es "nada,
  seguiría igual", no hay trato.

Varas reales por etapa: **pre-seed** = ahorro/familia/clientes · **seed** = del orden de
USD 10k mensuales recurrentes · **serie A** = USD 1-3M anuales creciendo 3x.

Y el costo que no se nombra: **la financiación se paga con la empresa.** Vender 20%
facturando cero es venderlo al precio más bajo de toda su historia.

En Bolivia, además: no hay ecosistema de VC local relevante, los fondos regionales miran
mercados grandes, y el control cambiario complica la salida de dólares a un inversor
extranjero. No es injusticia: su modelo no cierra acá.

### La cuenta que hace innecesaria la discusión

```
break-even = gasto mensual ÷ precio del plan

Bs 3.650/mes  ÷  Bs 750 (Profesional)  =  5 clientes
Bs 3.650/mes  ÷  Bs 320 (Básico)       = 12 clientes
```

- **Gasto:** `FINANCE_LOG_2026.md` (Bs 2.950 base + Bs 700 caja chica).
- **Precios:** `DEFAULT_PLAN_AMOUNTS`. **Si cambiaron, se recalcula con la fórmula.**

**Cinco clientes.** Eso separa a ONIA de no volver a necesitar plata de nadie.

Y cobrando **anual por adelantado** (el x10 ya existe en el producto), un solo cliente
Profesional entra **Bs 7.500 de una vez** = dos meses de operación. Cinco = **diez meses
financiados, 0% de dilución, sin pedirle permiso a nadie.**

### El costo oculto de buscarla igual

Levantar capital es trabajo de tiempo completo: deck, modelo, reuniones, due diligence, seis
meses en el mejor caso. Con una sola persona, **esas horas salen de las horas de vender**.
Perseguir capital que no se necesita es la forma más cara de no conseguir los cinco clientes
que sí resolvían el problema.

**El único capital que ONIA necesita hoy es el de sus clientes.** No diluye, no se devuelve, y
además dice si el producto sirve.

---

## 5. Equipo de desarrollo — por qué no, y cuál es el primer contratado real

Lo que produjo **una persona**: 5 rubros vendibles, 21 capacidades en el core, chatbot vivo en
web y WhatsApp, agentes por crontab con **14 días seguidos de HTTP 200** sin intervención,
web-factory, video-factory, 25 commits en un día.

**La capacidad de construir no es escasa. Es lo único que sobra.**

Contratar un desarrollador hoy hace tres cosas, todas malas:

1. Acelera lo abundante.
2. Suma Bs 5.000-8.000/mes fijos con cero ingresos → **el break-even salta de 5 a ~15
   clientes**, se triplica.
3. Convierte al fundador en gerente: horas de coordinar y explicar, justo cuando el recurso
   escaso es su atención.

**Cuando llegue el momento (§7, etapa 3), el primer contratado NO es programador: es
implementación y soporte**, pagado con ingreso recurrente, no con capital.

---

## 6. Las tres cosas que hoy impiden ser una empresa formal — y son casi gratis

| # | Qué | Costo | Estado |
|---|---|---|---|
| 1 | **La entidad que el cliente acepta no existe.** `app.onia.com.bo/privacy` declara *"OnIA / On Inteligencia Artificial"* (inexistente en SEPREC) + Gmail personal como canal de derechos sobre datos de salud. `onia.com.bo/privacidad` declara bien OniaAgency / NIT 5371375010 | **1 día, Bs 0** | 🔴 abierto |
| 2 | **Cuenta corriente empresa sin abrir.** Trámite al 90%, cartas redactadas, FATCA resuelto | firma | 🔴 esperando a Leslie |
| 3 | **SIAT en trámite**, emisor fiscal en mock | trámite | 🟡 en curso |

Detalle y normas citadas: `ONIA_LEGAL_BOLIVIA_ESTADO.md` · `ONIA_PUEDO_VENDER_HOY.md`.

**Esas tres SON "ser empresa", literalmente.** Cuestan un día de trabajo, una firma y un
trámite, y llevan semanas frenadas mientras se construyen features que todavía nadie usa.

---

## 7. La ruta: cuatro etapas, cada una con criterio de salida numérico

Ninguna se salta. El criterio de avance es un número, no una sensación.

### Etapa 1 — Producto único · hoy → 5 clientes
- Congelar (no borrar) todo lo que no sea **Onia Platform + chatbot**.
- Vender **solo** el rubro dental/estética — el único 🟢 (`ONIA_CATALOGO_DE_VENTA.md`).
- Arreglar la entidad legal (§6.1).
- Onboarding a mano, cobro por transferencia. **Eso es correcto en esta etapa**, se llama
  concierge: no es deuda, es descubrimiento.
- **Salida:** Bs 3.750/mes recurrente cobrado.

### Etapa 2 — Repetibilidad · 5 → 20 clientes
Acá se decide **empresa o agencia**, y se decide en un solo punto:

> **Cada cliente nuevo tiene que costar menos trabajo que el anterior.**
> Si el cliente 8 cuesta lo mismo que el 3, se está construyendo una agencia con cara de SaaS.

- Lo que se aprende de cada cliente vuelve al **código**, no a un documento.
- Precio de lista, sin excepciones. *(El "chatbot a medida sin precio de lista" y la
  consultoría "caso por caso" son la puerta por donde entra la agencia — legítimos como
  ingreso, peligrosos como hábito.)*
- **Salida:** un cliente se da de alta y opera sin intervención.

### Etapa 3 — Primer contratado · 20 → 50 clientes
- **Implementación y soporte, no programación.** Pagado con recurrente.
- El trabajo del fundador pasa a ser producto y ventas.
- **Salida:** el soporte deja de pasar por Sergio Urcullo.

### Etapa 4 — Capital · 50+ clientes
- Con ~USD 10k mensuales recurrentes cambia la naturaleza de la conversación: se deja de
  pedir plata para existir y se elige con quién acelerar.
- **Recién acá** tiene sentido reabrir §4.

---

## 8. ¿Es rentable el producto? — medido, no estimado

**Sí, y con márgenes de software puro.** Los números salen de `ONIA_AGENTES_COSTO_API.md`
(medido contra producción y el VPS el 2026-08-20, cuentas rehechas el 2026-08-27), no de una
proyección.

### 8.1 La estructura de costos

| Concepto | Costo | ¿Escala con clientes? |
|---|---|---|
| **VPS** (Hostinger KVM, 4 vCPU / 16 GB, 41 contenedores) | US$40 ≈ Bs 461/mes | ❌ **No** — aguanta decenas de orgs |
| API del chatbot | **Bs 0,80–23 por cliente/mes** | ✅ sí, y es ruido |
| API de los agentes (Recall, Cobrador, Captador) | **Bs 0** | ❌ no llaman a ningún modelo: redactan con plantillas |
| Transporte de Meta (WhatsApp) | **Bs 0 para nosotros** | ❌ desde el 2026-08-21 lo paga el cliente en SU cuenta |
| Claude Max (**construir**, no operar) | US$200 ≈ Bs 2.304/mes | ❌ no sube con clientes; baja cuando el producto esté hecho |

**Operar el producto cuesta Bs ~461 al mes tenga 1 cliente o tenga 40.** Ésa es la frase que
define la rentabilidad de todo el negocio.

### 8.2 El margen

Del add-on de chatbot, que es el peor caso porque es el único con costo variable real:

| Escenario | Costo de API | Margen bruto |
|---|---|---|
| Típico | Bs 0,76 | **99,8%** |
| Pico medido | Bs 22,66 | **94,2%** |
| Peor caso construible (9.000 msg/mes, modelo caro) | Bs 60,44 | **84,5%** |

**Ni siquiera el peor caso construible pierde plata.** Los planes de suscripción son aún
mejores: su costo variable es cero.

### 8.3 Qué pasa al escalar

Con el ARPU completo (plan Profesional + chatbot), cifras derivadas de `DEFAULT_PLAN_AMOUNTS`
y `pricing.ts` — **si los precios cambian, se recalcula, no se corrige a mano**:

| Clientes | Ingreso/mes | Costo de operar | Margen bruto |
|---|---|---|---|
| 3 | Bs 3.420 | Bs ~530 | 85% — **cubre TODO el gasto conocido, desarrollo incluido** |
| 10 | Bs 11.400 | Bs ~690 | **94%** |
| 40 | Bs 45.600 | Bs ~1.380 | **97%** |

**Tres clientes completos pagan todo lo que ONIA gasta hoy**, Claude Max incluido. De ahí en
adelante casi todo lo que entra es margen.

**La respuesta a "¿qué tan rentable es?": el producto no tiene un problema de rentabilidad.
Tiene un problema de clientes.** Y son dos cosas distintas: la primera se arregla con
ingeniería o con precio; la segunda, sólo vendiendo.

---

## 9. El techo real no es técnico: es el soporte

El VPS aguanta decenas de organizaciones y la API es ruido. **Lo único que se agota es el
tiempo de una persona.**

Medido en `ONIA_AGENTES_COSTO_API.md`: a Bs 100/h, el add-on de chatbot aguanta **~3,9 h de
soporte al mes** antes de perder plata. *"Un cliente que llame dos veces por semana ya no deja
margen."*

Eso convierte una cuenta de horas en el techo del negocio:

| Clientes | Soporte a 1 h/mes c/u | ¿Lo sostiene una persona? |
|---|---|---|
| 10 | 10 h/mes | ✅ cómodo |
| 40 | 40 h/mes | ⚠️ un cuarto del mes, sin margen para construir |
| 100 | 100 h/mes | ❌ imposible |

**Una persona sola topa alrededor de 30-50 clientes**, y ahí es donde entra el contratado de la
etapa 3 (§7) — pagado con recurrente, no con capital.

**Consecuencia operativa, y es la más importante de este documento:** el trabajo que baja las
horas de soporte por cliente (self-service, el `knowledge.json` bien cargado, onboarding que no
requiere a Sergio Urcullo) **NO es "pulir el producto": es lo único que sube el techo del
negocio.** Una feature nueva agrega valor a un cliente; una hora de soporte eliminada agrega
capacidad para todos los que faltan.

---

## 10. La tesis de plataforma — y el test que separa apalancar de dispersar

> Sergio Urcullo, 2026-09-05: *"se le conecta hartísimas cosas… la página web, un modelo de IA,
> un influencer, IA local… quiero escalar primero a Onia Platform, que ya funcione una v1.0, y
> luego ir añadiendo, añadiendo, para que sea un productazo"*.

**La tesis es correcta y es el modelo de las mejores empresas de software** (Shopify + apps,
Salesforce + AppExchange, HubSpot). El núcleo capta al cliente; los añadidos multiplican el
ingreso por cliente **sin costo de adquisición nuevo**. Es la forma más barata de crecer que
existe.

**Pero tiene una condición dura que hoy no se cumple: una plataforma necesita base instalada.**
Un add-on se le vende a los clientes que ya tenés. Con **cero clientes**, cada "conexión" nueva
no es expansión — es una línea de negocio nueva compitiendo por la misma persona (§3).

### El test de las tres preguntas

Antes de construir cualquier añadido, las tres. **Si falla una, no es un add-on: es un negocio
nuevo disfrazado de add-on.**

1. **¿Se le vende al MISMO cliente que ya paga el núcleo?** (si hay que salir a conseguir otro
   cliente, no es expansión: es adquisición)
2. **¿Deja de tener sentido sin el núcleo?** (si funciona solo, es otro producto)
3. **¿Se entrega sin horas mías por cliente?** (si cada venta abre un proyecto, es un servicio)

### El test aplicado a lo que hay hoy

| Añadido | ¿Mismo cliente? | ¿Depende del núcleo? | ¿Entrega automática? | Veredicto |
|---|---|---|---|---|
| **Chatbot WhatsApp** | ✅ | ✅ vive de los datos del sistema | ✅ alta en 1 click | 🟢 **add-on modelo** — 99,8% de margen |
| **Agenda pública** | ✅ | ✅ | ✅ | 🟢 add-on |
| **Usuario extra** | ✅ | ✅ | ✅ | 🟢 add-on |
| **Self-hosted** | ✅ | ✅ | ⚠️ instalación por cliente | 🟡 add-on caro de entregar — cobrar la instalación aparte (ya lo hace) |
| **Página web** (web-factory) | ✅ | ❌ un negocio compra web sin sistema | ❌ es un proyecto | 🔴 **línea de servicio**, no add-on |
| **Influencer IA** | ❌ | ❌ | ❌ | 🔴 **otro producto entero** |
| **Contenido / ads** | ❌ | ❌ | ❌ | 🔴 servicio de agencia |
| **IA local** | ✅ | ✅ *si es "tu sistema anda sin internet"* | ⚠️ | 🟡 **depende de cómo se plantee** — como capacidad del núcleo, sí; como "te vendo infraestructura de IA", es otro negocio |

**Lo que este test resuelve:** deja de hacer falta preguntar caso por caso. Tres preguntas y el
añadido se clasifica solo.

**Y explica por qué el chatbot fue la decisión correcta y las otras no:** el chatbot pasa las
tres. Es el ejemplo de qué buscar en el siguiente.

---

## 11. Qué es la v1.0 — un criterio de corte, no una lista de features

El problema de "terminar el producto" (§14) es que **una lista de features no tiene fondo**:
siempre se puede agregar una más, y sin cliente real nadie dice cuál falta.

**La v1.0 no se define por lo que el producto hace. Se define por lo que un cliente logra solo:**

> **v1.0 = un cliente del rubro dental se registra, carga sus datos, atiende su primer día
> real y paga el segundo mes — sin que Sergio Urcullo toque nada más que responder dudas.**

Cinco condiciones verificables, todas medibles en producción:

| # | Condición | Cómo se mide |
|---|---|---|
| 1 | Se registra y entra solo | `ONIA_ALTA_AUTOMATICA=abierta` ✅ ya cumple |
| 2 | Carga sus datos sin ayuda | un onboarding completado sin intervención en el log |
| 3 | Usa el sistema un día real | citas y cobros creados por él, no por QA |
| 4 | **Paga** | una fila `APPROVED` en `subscription_payments` que no sea de prueba |
| 5 | **Vuelve a pagar** | la segunda fila, 30 días después |

**La 5 es la que convierte producto en empresa.** Un cliente que paga una vez validó la venta;
uno que paga dos veces validó el producto.

**Todo lo que no sirva a esas cinco condiciones no es v1.0**, por bueno que sea. Se anota y
espera — incluidas las conexiones del §10, que son v1.1 en adelante.

---

## 12. La secuencia de expansión — y las métricas que la gobiernan

El orden no es de gusto: cada paso paga el siguiente.

```
v1.0  →  UN rubro (dental), núcleo + chatbot, 5 clientes pagando
v1.1  →  bajar horas de soporte por cliente  (sube el techo del §9)
v1.2  →  el segundo rubro, ENCENDIDO desde el core, no escrito de cero
v1.3  →  el siguiente add-on que pase el test del §10
v2.0  →  recién acá, las conexiones grandes (IA local, integraciones a medida)
```

**Por qué ese orden y no otro:** v1.1 va antes que v1.2 porque un rubro nuevo con el soporte sin
resolver multiplica el problema en vez del ingreso. Sumar rubros con onboarding manual es
sumar horas, no clientes.

### Las cinco métricas que hay que mirar, y ninguna más

| Métrica | Qué mide | Dónde se lee |
|---|---|---|
| **Clientes que pagan** | si el negocio existe | `subscription_payments` en `APPROVED` |
| **Ingreso recurrente mensual** | el tamaño real | suma de suscripciones activas |
| **Horas de soporte por cliente** | **el techo (§9)** | hay que empezar a anotarlo — hoy no se mide |
| **Renovación al mes 2** | si el producto sirve | segunda fila de pago del mismo cliente |
| **Ingreso por cliente (ARPU)** | si la tesis de plataforma funciona | ingreso ÷ clientes; **sube sólo si los add-ons se venden** |

⚠️ **Cuatro de las cinco se pueden leer hoy en la base. La tercera —horas de soporte— no se
mide y es la que define el techo.** Empezar a anotarla es más barato que cualquier feature.

---

## 13. Restricción de firma (planificación, no juicio)

`ONIA_LEGAL_BOLIVIA_ESTADO.md` registra que la titular es **Leslie Mercado Moreno** y que
Sergio Urcullo no firma. Es una restricción operativa real y ya resuelta en la estructura,
pero define qué rutas están abiertas **hoy**:

- Todo contrato, apertura bancaria o term sheet pasa por un tercero que firme.
- Un inversor que lo descubre en el due diligence, y no antes, lo trata como riesgo.
  Anticipado y explicado, no lo es.
- **Refuerza §4:** un cliente paga sin exigir una firma que hoy no se puede dar.

---

## 14. Qué contradice este documento (declarado, no escondido)

**La decisión vigente de Sergio Urcullo del 2026-08-31** (`COLA.md`,
`ONIA_DEFINICION_DE_TERMINADO.md`): *"dedicate a terminar el producto y recién escribimos"*,
con los 7 leads en espera.

La intuición que la sostiene es correcta —un lead bueno se quema una sola vez— pero produce
un bucle cerrado:

```
sin clientes → nadie dice qué falta → "terminado" lo define uno mismo
     ↑                                            ↓
     └─────────  siempre falta algo  ←────────────┘
```

Y hay un error de hecho adentro: **un lead no se quema por escribirle con un producto
imperfecto; se quema por el silencio.** A la clínica de 4 doctores que hizo 6 preguntas
concretas no le llegó ni una plantilla automática. El costo de no escribir **ya se pagó**.

Súmese que el repo se contradice a sí mismo: `ONIA_PUEDO_VENDER_HOY.md` (18-ago) dice textual
**"SÍ se puede vender el sistema"**, y los 3 pedidos de acceso pidieron **el único rubro 🟢**.

**Este documento no deroga esa decisión** — cambiar el objetivo vigente es de Sergio Urcullo.
Deja escrito qué se gana y qué se pierde con cada opción, para que la decisión se tome con la
cuenta delante. Cuando se resuelva, **se edita esta sección** y se alinea `COLA.md`.

---

## 15. Cómo se re-verifica todo esto

```bash
# Clientes pagando y orgs reales (base de producción)
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i supabase-db psql -U postgres -d postgres -c \
   "SELECT count(*) FROM organizations; SELECT count(*), status FROM subscription_payments GROUP BY status;"'

# Leads sin contestar
#   → comandos exactos en ONIA_LEADS_ESPERANDO.md §"Cómo se vuelven a leer"

# Gasto mensual  → FINANCE_LOG_2026.md  (+ Notion "Finanzas & Gastos")
# Precios        → onia-platform/lib/subscription-plans.ts  (DEFAULT_PLAN_AMOUNTS)
# Líneas activas → COORDINATION_MANIFEST.md §"Carriles VIVOS"
git worktree list | wc -l          # worktrees abiertos: >2 es señal de dispersión
```

---

## 16. Documentos relacionados

**`ONIA_AGENTES_COSTO_API.md`** (la fuente de los márgenes de §8 y del techo de §9) · `ONIA_DEFINICION_DE_TERMINADO.md` (el objetivo vigente) · `ONIA_LEADS_ESPERANDO.md` (las 7
personas) · `ONIA_PUEDO_VENDER_HOY.md` (qué se puede prometer) · `ONIA_LEGAL_BOLIVIA_ESTADO.md`
(SEPREC, NIT, marca) · `FINANCE_LOG_2026.md` (gasto y capital) · `ONIA_CATALOGO_DE_VENTA.md`
(qué rubro está 🟢).
