# Add-ons de Onia Platform: su potencial y el orden para DESPUÉS de la 1.0

> **Doc vivo, sin fecha: se EDITA.** Nace el 8-oct (pedido de la madre por Sergio Urcullo: *«recordá el potencial que hay»*).
> **Alcance:** analizar los 6 add-ons que Sergio Urcullo nombró el 8-oct. **No se construye nada:** el goal es la 1.0 al 30-oct, y la etapa
> vigente (Etapa 1, 5 clientes) no la cambia ninguna sesión (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §7).
> ⚠️ **El bloque «Decisión de Sergio Urcullo, 8-oct» que la madre cita en el §12 de esa estrategia NO está en `main` el 8-oct.** Los 6
> add-ons salen del mensaje de la madre. Hasta que esté escrito, ningún doc recoge la decisión, y el §10 sigue diciendo que web,
> influencer y ads **no son add-ons** (🔴) y que la IA local es v2.0 (§12).
> **Cómo se leyó el repo:** el código del producto (`onia-platform`) no está en este repo; lo del producto va «según doc». Lo marcado
> ✔ lo miré hoy en la web pública. Precios de mercado: P = publicado por el vendedor el 8-oct; B = blog o reseña; *(est.)* = estimación mía.

## 1. La respuesta corta

| Orden | Add-on | Test del §10 *como se vende hoy* | ¿Puede pasarlo? | Hoy existe | Primer paso (después de la 1.0) |
|---|---|---|---|---|---|
| **1** | **Web** (se mantiene y se potencia) | ❌ proyecto: falla la 2 y la 3 | **Sí, si es «Web conectada»** (la alimenta el sistema) | ✔ el configurador vive; el motor, sin probar; **0 pagos** | Un solo precio y el circuito 3: el widget de reserva en la web |
| **2** | **Puesta en marcha** (la parte de *consultoría* que sí es add-on) | ⚠️ pasa 1 y 2, falla la 3 | Como precio fijo aparte, como el self-hosted | Solo documento; las asesorías van gratis | Ratificar el precio y cobrarlo al primer cliente |
| **3** | **App móvil** | ✅ si es **una sola app «Onia»** con inicio de sesión | Sí, pero **sube la retención, no el ingreso** | PWA «según doc»; app de tienda: no existe | Cuenta de Apple Developer (USD 99/año) a nombre de una entidad |
| **4** | **Campañas de Meta con IA** | ⚠️ solo como botón; como «manejo» falla la 3 | Sí, como producto, **después de medir la propia** | No existe como función | Documentar el método con la prueba propia de US$ 56 |
| **5** | **Publicidad con influencers IA** | ❌ falla la 1 y la 2 | Solo como **creativos para la pauta del cliente** (se pliega al 4) | Lucía construida, **ningún reel publicado** | Nada hasta que Lucía tenga reels publicados |
| **6** | **IA local** | ⚠️ pasa 1 y 2 como capacidad; falla la 3 si se instala | Como «sirve sin internet», a pedido | Solo documento; ninguna unidad comprada | Una pregunta en la demo: «¿le importa que la ficha esté en la nube?» |

**Por qué este orden:** primero lo que ya vive y se vende al mismo cliente (1), después lo que no hay que construir (2), después lo que
el mercado ya da gratis y falta para no quedar atrás (3), después lo que necesita un dato propio que todavía no existe (4), y al final lo
que hoy falla el test (5 y 6). **Cero pagos, caja de Bs 4.000 y break-even en ≈ 5 clientes** (`CLAUDE.md`, `ONIA_CATALOGO_DE_VENTA.md` §6):
ningún add-on se entrega hoy sin horas de Sergio Urcullo.

## 2. Reglas con las que se ordenó
1. **El test de las tres preguntas** (§10): ¿al MISMO cliente que ya paga? · ¿deja de tener sentido sin el núcleo? · ¿se entrega sin horas de
   Sergio Urcullo por cliente? **Una que falla = negocio nuevo disfrazado.**
2. **La métrica que lo juzga es el ARPU** (§12, métrica 5): un add-on que no se vende no existe. Hoy hay 3 vendibles (bot, agenda pública,
   usuario extra).
3. **No se promete nada que el catálogo no deje** (`ONIA_CATALOGO_DE_VENTA.md` §7-§8), y **la venta nunca exhibe obra** (`CLAUDE.md`).

---

## 3. Web — se vende JUNTO con el sistema

**Qué existe hoy.**
- ✔ **`onia.com.bo/servicios/webs` responde 200** con el configurador: *Landing de Captación Bs 2.000 · Web Profesional Bs 4.500 · Web Pro Onia
  «lo vemos en una llamada»*, **Cuidado Web Bs 190 / 390 / 690 al mes**, registro de contactos en CRM/n8n con setup de Bs 790. Pago 50/50.
- El motor `web-factory` está **construido sin probar de punta a punta:** *«Sitio generado → publicado: NO EXISTE»* (publicar es manual, `handoff/web-creator.md` §5b).
  **0 pagos:** solo propuestas (AW Climatización, BENCH) y demos de ejemplo. Entregar cuesta 4-6 h (landing) o 1,5-2 días (profesional) de Sergio Urcullo
  (`ONIA_WEB_COMO_SE_VENDE.md` §3-4).
- **Dos listas de precio vivas:** 790 / 1.500 / 2.900 en `ONIA_WEB_COMO_SE_VENDE.md` §5 y `ONIA_CATALOGO_DE_IDEAS.md`, contra 2.000 / 4.500 en la web.
  El §8.4 de ese doc pide ratificar una; **sigue sin decidirse**.
- ✔ **La propia página se contradice:** dice «sin mensualidad obligatoria» y, más abajo, «sin plan mensual por ahora» junto a un Cuidado Web de Bs 190/mes.

**Quién lo vende y a cuánto (8-oct).**

| Dónde | Quién | Precio |
|---|---|---|
| Bolivia (P) | TecnoWeb | Bs 1.649 · 2.690 · 3.890 · 5.490 (tienda), con dominio y hosting el primer año |
| | Khainata (Santa Cruz) | desde Bs 1.500 · 2.200 · 3.900; hosting desde Bs 470/año |
| | KOM Bolivia (cotizador) | Bs 3.200-5.800 web · 2.450-4.750 landing · 5.000-7.550 tienda |
| Mantenimiento (B) | BigRedes | Bs 481-962/mes básico · 962-1.805 profesional. **Ninguna agencia lo publica** |
| Región (P) | KOM Perú, dentistas | S/ 1.250-2.250 una vez; mantenimiento S/ 150-400/mes |
| **El rival real** | AgendaPro (P) | **Todos los planes traen un «sitio web de reservas»**; URL y colores propios solo en Premium (CLP 54.900/mes) y Pro (249.900) |

**Rango:** Bolivia Bs 1.500-5.500 una vez (lo típico, Bs 2.700-3.900). **Creíble para una clínica que ya paga un sistema:** Bs 2.500-3.900 más
Bs 300-500/mes. Más de Bs 6.000, o más de Bs 1.000/mes sin agenda ni SEO, no. *(est.)* **Los precios de Onia caen en el rango; lo que desentona es que
dominio y hosting van aparte**, cuando TecnoWeb y Khainata los incluyen el primer año. **Una web suelta compite contra «gratis»** (la página de reservas de los sistemas).

**Test del §10.** Como proyecto: ✅ mismo cliente · ❌ **un negocio compra web sin sistema** · ❌ **cada venta abre un proyecto.** `ONIA_WEB_COMO_SE_VENDE.md` §7 ya lo
dice: *«una web suelta siempre va a oler a agencia»*. **Pasa solo si se vuelve «Web conectada»** (`ONIA_WEB_CONECTADA_AL_SISTEMA.md`): la web se alimenta de los datos del
sistema (servicios, profesionales, horarios, precios) y lo que entra por ella (formulario, reserva) cae en el panel. Entonces ✅ mismo cliente · ✅ sin el núcleo no sirve ·
⚠️ la entrega es automática **solo cuando exista la publicación automática** (hoy no).

**Esfuerzo.** *Codex:* endpoint público del catálogo y widget de reserva embebible (circuitos 2 y 3; el booking público ya existe como add-on). *Plataforma:* publicación automática
y un solo layout por bloque (límites del motor, §8.5). *Sergio Urcullo:* decidir precio y publicar a mano hasta entonces.

**Cómo se le vende al MISMO cliente.** Nunca web suelta.
1. **Entrada:** la **Agenda pública** que ya es add-on (su página de reservas). Es el equivalente de lo que los sistemas rivales dan gratis.
2. **Escalón:** *«su web, conectada a su agenda»*: Landing conectada Bs 2.000 + Cuidado Web Bs 190/mes. Se ofrece **en el mes 2**, cuando el cliente ya reservó con la agenda.
3. **Mensaje:** *«lo que cambia en el sistema, cambia en la web; lo que entra por la web, entra a su agenda»*. **Hasta que el circuito esté encendido y verificado, no se le nombra** (regla del propio doc).

**Primer paso concreto.** (1) Sergio Urcullo ratifica **un** precio y lo deja en **un** archivo (`cotizador-data.ts`, §8.4), y decide si dominio y hosting van incluidos el primer año.
(2) Codex: widget de reserva embebible, circuito 3 (el mismo `/book`, dentro de la web del cliente). **Listo =** una web de ejemplo con el widget, reservando en una agenda real, mirada renderizada.

## 4. Consultorías — solo la «Puesta en marcha» es add-on

**Qué existe.** Solo documento: `ONIA_CONSULTING_SERVICES_2026.md` trae un tarifario de Bs 250 a 9.500; `ONIA_PRICING_2026.md` lo llama *«referencia histórica, no un tarifario»*.
Hoy **las asesorías van gratis** (3 por semana de 20 min). ✔ **`/servicios/consultoria` redirige a la portada** en producción: la página existe en el código pero está apagada. **0 cobrados.**

**Quién lo vende.** Bolivia **no publica tarifa por hora.** Lo que sí se publica son suscripciones de bot: Xmart Cloud Bs 349/mes (API de WhatsApp, sin costo de integración), Chicha Bs 199 / 399 / 799 (P).
A medida, ~USD 150-1.000, con poca evidencia (B). Región: proyectos USD 1.000-5.000+, retainers USD 650-2.000; en México, MXN 60.000-300.000 más MXN 2.000-10.000/mes (P, Duotach).
**Los competidores de software sí cobran el arranque:** Control Facilito, implementación Bs 2.081; Clinera, USD 450 (`MAPA_COMPETENCIA.md`).
**Creíble:** una **puesta en marcha de Bs 500-2.000 una vez**; cobrar nivel México a una clínica, no. *(est.)*

**Test.** La consultoría libre: ✅ · ❌ **vive sola** · ❌ **es horas** → servicio, no add-on (§10 ya lo marca 🔴 «servicio de agencia»). **La «Puesta en marcha»** (importar pacientes, dejar la agenda cargada, capacitar a la recepción):
✅ · ✅ sin sistema no existe · ❌ son horas. Es el mismo caso del **self-hosted** (🟡): *«cobrar la instalación aparte»*.

**Esfuerzo.** Sergio Urcullo, todo. Se baja con lo que ya existe en la 1.0 (importar CSV, punto 12).

**Cómo se vende.** Dos pasos, sin vender «consultoría»: la **llamada de 20 min sigue gratis** (es el embudo); y al cerrar, *«le dejamos su sistema cargado y capacitado, Bs X, una vez»*, como línea de la propuesta.

**Primer paso.** Sergio Urcullo elige el precio (Bs 500-2.000 *(est.)*) y la regla: **¿se cobra siempre o se regala en el plan anual?** (Doctocliq regala la migración asistida en todos los planes de pago, así que puede ir regalada en el plan anual). **Listo =** una línea en `ONIA_CATALOGO_DE_VENTA.md`. Hasta ahí, no se publica la página de consultoría.

## 5. App móvil — una app «Onia», no una por cliente

**Qué existe.** *«Instalá Onia»* (la PWA) está en producción **según doc**, sin probar en un iPhone real (`handoff/codex-continuar-1.0.md`). **No hay app de tienda:** ni Capacitor, ni Expo, ni TestFlight en el repo.
La decisión D7 del producto era *«App Store solo si la piden»*.

**Quién la ofrece.**
- **Doctocliq:** app solo para el doctor, gratis, en ambas tiendas (P). **Dentalink:** sin app propia confirmada. **AgendaPro:** app para el cliente en todos los planes; **app de marca solo en Pro (COP 350.000/mes, ≈ USD 85-90)** (P).
- Agencias: Bolivia no publica precio; USD 10.000-40.000 una app a medida *(est.)*. Fuera, white-label desde GBP 40/mes (PracticeHub, P).

**Reglas de Apple que mandan** (P, `developer.apple.com`).
- **4.2:** una app que solo reempaqueta una web se rechaza. **4.2.6:** las apps de plantilla se rechazan salvo que las envíe el dueño del contenido; se acepta **un solo binario con selector de cuenta**.
- **3.1.1:** lo que se desbloquea dentro de la app pide compra dentro de la app; **3.1.3(c)** exime a servicios vendidos a organizaciones. *(Mi lectura: se cobra en la web y la app no vende.)*
- **5.1.1:** una app de salud la publica **una entidad legal, no un individuo**; hay que poder borrar la cuenta desde la app.
- Costo: Apple **USD 99/año**; Google Play **USD 25 una vez** (cuentas nuevas: 12 testers por 14 días, B).

**Test.** Una app «Onia» con inicio de sesión: ✅ · ✅ no sirve sin cuenta · ✅ **un solo binario, sin horas por cliente.** **Una app de marca por clínica** (la de AgendaPro Pro): ❌ la 3 (cada una exige su cuenta y entidad de Apple). Y ojo: **más que un add-on es paridad**
(Doctocliq y AgendaPro la dan sin cobrar aparte): **sube la retención, no el ARPU.**

**Esfuerzo.** *Plataforma/Codex:* envolver la PWA con Capacitor y darle al menos una función nativa real (push, cámara para fotos de la ficha), 2-4 semanas *(est.)*; TWA para Android, días. *Sergio Urcullo:* la cuenta de Apple.

**Cómo se vende.** **No se vende:** va incluida («instale Onia en su celular»). La app de marca por clínica, si alguien la pide, con **su** cuenta de Apple y un setup aparte *(USD 15-40/mes y USD 300-800 de setup, est.)*.

**Primer paso.** Sergio Urcullo decide **a nombre de quién** va la cuenta de Apple Developer (una entidad: depende de la formalización, `ONIA_ESTRATEGIA_DE_EMPRESA.md` §6). **Listo =** cuenta inscrita. Antes, probar la PWA en un iPhone real (hoy sin hacer).

## 6. Campañas de Meta con IA desde la plataforma

**Qué existe.** **No existe como función.** La campaña propia de Onia está solo en documento (ONIA Ads sin medio de pago; nada se subió). `VERSION_1_1.md` marca *«manejo de Meta Ads para clientes: línea congelada»*.
`ONIA_CATALOGO_DE_IDEAS.md` dice *«Meta Ads engine DRY ya deployado»*: **no encontré código que lo respalde.**

**Quién lo vende.**

| Qué | Quién | Precio |
|---|---|---|
| Gestión de pauta, Bolivia (P) | Dechali | Bs 990 / 1.690 / 2.990 al mes, **la pauta aparte** (mínimos Bs 990 / 1.600 / 2.800) |
| | LogicalWeb · RedPlan | USD 185-285 · USD 120-500 al mes |
| | Community Bolivia | Bs 1.978 (una red) · 5.918 (tres, con Ads) |
| Herramientas de IA | AdCreative.ai (B) | USD 39 / 249 / 999 |
| | Madgicx (B) · Bïrch (P) | USD 32-90 según gasto · Pro USD 99 |
| **Integradas en un software de clínicas** | **Ninguna.** «Charly» de AgendaPro es correo, no crea anuncios | — |

**Rango Bolivia:** gestión Bs 990-3.000/mes más pauta de Bs 600-2.800 aparte. **Creíble:** Bs 990-1.700/mes con pauta aparte y reportes; **no** pagar USD 50-250/mes por una herramienta para una sola cuenta. *(est.)*

**La traba técnica es de papeles, no de código.** Crear campañas **para terceros** por la API exige **Full Access a `ads_management` y `ads_read`**, que se aprueba por **App Review** permiso por permiso, más **Business Verification**;
para mantenerlo hay que sostener ≥ 500 llamadas exitosas cada 15 días con < 15 % de error (P, `developers.facebook.com`). **Son semanas de trámite** y empiezan antes que el código.

**Test.** ✅ mismo cliente (toda clínica quiere pacientes nuevos) · ✅ **sí depende del núcleo, y es lo que nadie hace:** cerrar el ciclo *anuncio → conversación → cita en la agenda → ingreso* · ⚠️ **la 3 depende de la forma:**
*«arme y lance su campaña con un botón, pague a Meta directo»* pasa; *«se la manejamos»* falla (es el servicio de agencia del §10).

**Esfuerzo.** *Plataforma + Codex:* conexión OAuth con la cuenta del cliente, plantillas de campaña, lectura de resultados. *Sergio Urcullo:* el trámite de Meta y la decisión de qué se promete.

**Cómo se vende.** Con **un dato propio**: *«la campaña que Onia corre para sí, con costo por conversación medido, ahora con los datos de su clínica»*. **No hay hoy ese dato**: la prueba de US$ 56 (14 días) arranca el 16-oct si se enciende (`ONIA_ADQUISICION_Y_PAUTA.md` §5.10).

**Primer paso.** Esperar el resultado de esa prueba y **escribir el método** (qué anuncio, qué costo por conversación, qué cortes). **En paralelo y sin código:** iniciar la **Business Verification**. **Listo =** costo por conversación propio anotado en §5.3 de la adquisición.

## 7. Publicidad paga con influencers IA

**Dos lecturas** del pedido, y conviene que Sergio Urcullo diga cuál: **(i)** pauta de Meta para hacer crecer las cuentas de las influencers (un **gasto** de Onia); **(ii)** vender a otros anuncios o patrocinios con ellas.

**Qué existe.** Lucía **construida sin probar:** *«ningún reel terminado… nada publicado en Instagram»* (`handoff/higgsfield-lucia.md`, 5-oct). Mara Vale: cuenta sin crear. La pauta sobre ellas **no existe**, y el plan 1.0 §4 no deja generaciones pagas este mes.
✔ **`/servicios/marketing-ia` redirige a la portada** en producción; en el código promete *«una campaña corriendo y una influencer IA presentando un producto»* antes de pagar: **hoy no hay nada de eso que mostrar**, así que reencenderla sería fabricar.

**Quién lo hace y a cuánto.**
- **Presentador IA para anuncios (P):** Creatify USD 39 y 99/mes · HeyGen desde USD 29/mes. Arcads sin precio público (B: ≈ USD 11 por video de un minuto). Higgsfield: B, USD 15-129/mes; un clip de 8 s = 72 créditos. UGC humano: USD 75-3.000 por video (B).
- **Agencias de influencers IA:** sin tarifario público; sus propios textos hablan de USD 10.000-25.000/mes (B). Ninguna es boliviana.
- **Lectura (i):** CPM en LATAM ≈ USD 1,50-4,50 (B); Bolivia sin dato; el cuarto trimestre sube 30-60 %.
- **Lectura (ii):** patrocinio en Instagram, CPM USD 5-15; un reel de una cuenta de 10-100 mil seguidores, USD 250-2.000 (B). **Una cuenta IA sin audiencia no cotiza.**

**Reglas y riesgos.** Meta (P, 1-jun-2026): etiqueta *«AI info»* si el anuncio usa su IA, y un humano fotorrealista generado lleva etiqueta junto a «Sponsored». En salud, un presentador IA **no puede hacerse pasar por paciente ni odontólogo** (`CLAUDE.md`).
**Rendimiento (con cautela):** Taboola midió CTR 0,76 % con IA contra 0,65 % con humano, pero **no eran avatares**; Ipsos/Syracuse, con 3.000 consumidores, vio +14 % en ventas de corto plazo para los anuncios humanos.

**Test.** ❌ **la 1** (el cliente de la plataforma no compra influencers) · ❌ **la 2** (funciona solo) · ❌ **la 3** («el 80 % del valor es el operador», `ONIA_ADDON_CONTENIDO.md`) → **otro producto entero** (§10). **La única forma que pasa** es *«creativos con presentador IA para SU pauta»*,
que es un insumo del add-on de campañas (§6), a USD 30-70 por pieza *(est.)*, sin influencer propia.

**Esfuerzo.** *Sergio Urcullo y Marca* (operador); *Higgsfield* solo con costo cotizado (`CLAUDE.md`).

**Cómo se vende.** No se vende por separado: **sale dentro del add-on de campañas** como «cuatro piezas listas para su pauta».

**Primer paso.** **Ninguno todavía.** Primero Lucía tiene que **publicar reels y tener audiencia**; sin eso no hay qué pautar ni qué vender. **Listo =** ≥ 10 reels publicados y su alcance medido.

## 8. IA local

**Qué existe.** Solo documento: el *Box* de Onia (`research/ONIA_BOX_*`): **RFQ redactado, sin enviar; ninguna unidad comprada.** Costos de esos docs: USD 6.000-7.000 el equipo (o USD 1.500-2.500 sobre uno del cliente) más USD 150-300/mes, y 30-45 h de Sergio Urcullo la primera instalación.
Un comentario en `pricing.ts` habla de una *«instancia privada desde 4.500 + 900»*: **no coincide** con eso. `PLAN_HOMELAB.md` trata de loops de desarrollo, **no** de IA para clientes; su GPU no sirve para modelos locales y el nodo de casa perdió acceso el 28-sep. Hay una nota de **no revivir Ollama en el VPS**.

**Quién lo ofrece.** **No encontré un «AI box» para clínicas en LATAM ni un software de clínicas con IA local.** Referencias: Positivo IA Box (Brasil, hardware como servicio, sin precio público); un servidor propio en España, EUR 8.000-25.000 más EUR 300-800/mes (B, no confirmado en su página).
Hardware (B): un mini-PC USD 800-3.000; el DGX Spark de 128 GB **subió de USD 3.999 a 6.950.** Los escribas médicos comparados son de nube.

**Qué problema resuelve de verdad.** **Privacidad de la ficha y trabajar sin internet.** Ahorrar tokens es casi nada: operar Onia cuesta Bs ~461/mes. **En Bolivia no hay ley general de datos personales** (hay un anteproyecto de AGETIC de 2024; un proyecto de ley de 2025-2026, sin verificar):
la privacidad es **argumento de venta, no obligación legal.** *Calidad:* no hallé estudios de modelos chicos en español clínico; Whisper local inventa texto en transcripción médica (B). Sirve para borradores revisados, no para la ficha sin revisión.

**Test.** Como capacidad *«su sistema anda sin internet / sus datos no salen de su local»*: ✅ · ✅ · ❌ **si hay que instalar equipo en cada clínica** (soporte presencial). Como «te vendo infraestructura de IA» es otro negocio (§10 ya lo avisa). El §12 lo manda a **v2.0**.

**Esfuerzo.** *Sergio Urcullo:* instalación y soporte presencial (choca con el techo de horas, §9). *Codex/Plataforma:* un modo del producto que corra contra un modelo local.

**Cómo se vende.** **A pedido, nunca de entrada:** hardware a cargo del cliente (USD 800-3.000) más instalación (USD 500-1.500) *(est.)*, y solo a quien lo pida por escrito.

**Primer paso.** **Medir la demanda con una pregunta:** sumar a la demo *«¿le importa que la ficha de sus pacientes esté en la nube?»* y anotar las respuestas en el registro de objeciones (`sales-kit`). **Listo =** 10 respuestas. Si ≥ 3 lo piden, recién se cotiza una unidad.

---

## 9. Lo que hay que resolver antes de tocar nada
1. **Escribir la decisión del 8-oct** en `ONIA_ESTRATEGIA_DE_EMPRESA.md` (hoy no está) **y reconciliarla con el §10**, que marca web, influencer y ads como 🔴. Sin eso, la próxima sesión lee «no abrir líneas nuevas» y esta lista dice lo contrario.
2. **Un solo precio de web** (790 / 1.500 / 2.900 contra 2.000 / 4.500) y **un solo archivo** que lo diga.
3. **La consultoría:** tarifario de Bs 250-9.500 contra «asesoría gratis», y una página que existe pero está apagada.
4. **La página `/servicios/webs`** se contradice sobre la mensualidad.
5. **`/servicios/marketing-ia`** no se reenciende mientras no haya una campaña y una influencer reales que mostrar.

## 10. Lo que decide Sergio Urcullo
1. **¿Web solo «conectada»?** (recomendado) y **¿dominio y hosting incluidos el primer año?**
2. **¿Se cobra la «Puesta en marcha»?** ¿Cuánto, y se regala en el plan anual?
3. **¿A nombre de quién va la cuenta de Apple?**
4. **¿Qué lectura de «publicidad paga para influencers IA»** quería (i, gasto propio; ii, vender patrocinios)?
5. **Confirmar el orden** de la §1, o moverlo.

*Fuentes de mercado (8-oct):* tecnoweb.net · khainata.com · preciospaginaweb.com · bigredes.com · kom.pe · agendapro.com/cl/planes · dechali.com · redplanbolivia.com · logicalweb.bo · communitybolivia.com · bir.ch · madgicx.com · developers.facebook.com/docs/marketing-api ·
xmart.cloud · duotach.com · developer.apple.com/app-store/review/guidelines · creatify.ai · heygen.com · about.fb.com (transparencia de IA en anuncios) · dlapiperdataprotection.com (Bolivia) · agetic.gob.bo.
