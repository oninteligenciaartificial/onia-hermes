# Granja de contenido multi-cuenta — investigación con fuentes y veredicto revisado (2026-08-01)

> Sergio hizo push-back a mi veredicto 🔴 de la lluvia de ideas: *"investigá lo de la granja
> de contenido porque no es baneable, hay varias startups que lo hacen."* Tenía razón en el
> punto central. Este doc corrige lo que dije mal, documenta lo que la evidencia sí sostiene,
> y llega a un veredicto distinto por una razón distinta.
>
> **Corrige:** `ONIA_LLUVIA_IDEAS_SERGIO_ARTHUR_20260801.md` §3.7.

---

## 1. Lo que dije mal, y lo que la evidencia dice

Escribí que una granja **"viola los ToS de Meta/TikTok (cuentas múltiples coordinadas). No es
una zona gris."** Eso está **mal** y las plataformas lo desmienten por escrito.

**TikTok, cita textual de sus Community Guidelines:**

> *"You can have multiple accounts—for example, for fan content or creative expression—but
> not to deceive others or break the rules."*
> ("Podés tener varias cuentas —por ejemplo, para contenido de fans o expresión creativa—
> pero no para engañar a otros o romper las reglas.")
> — [tiktok.com/community-guidelines/integrity-authenticity](https://www.tiktok.com/community-guidelines/en-GB/integrity-authenticity)

**Meta:** la regla de "una sola cuenta" existe **solo para el perfil personal de Facebook**
(política de identidad real):

> *"Create only one account (your own) and use it for personal purposes."*
> — [Términos de Servicio de Facebook](https://www.facebook.com/terms.php?locale=en_US)

No aplica a Instagram, ni a Páginas, ni a cuentas de negocio. Al contrario: Meta **construye y
documenta oficialmente** la gestión multi-cuenta y multi-marca en Business Suite
([facebook.com/business/help/506592326477907](https://www.facebook.com/business/help/506592326477907)).
Y su propio Developer Policy §5.6.2.d **permite explícitamente** que una app publique contenido
creado por *"un negocio cuyos empleados usan tu App para administrar su presencia comercial en
los Productos de Meta"* ([developers.facebook.com/devpolicy](https://developers.facebook.com/devpolicy/)).

**Conclusión de la sección:** tener y operar muchas cuentas propias **no es la infracción**.
La infracción es el **engaño**. Meta define comportamiento inauténtico como
*"una red de activos inauténticos controlados por el/los mismo(s) individuo(s), con el objetivo
de engañar"* — el disparador es la **identidad falsa**, no la cantidad
([transparency.meta.com — Inauthentic Behavior](https://transparency.meta.com/policies/community-standards/inauthentic-behavior/)).

⚠️ **Nota de método:** casi todo lo que aparece en Google buscando "multiple accounts without
ban 2026" son blogs de GoLogin, Multilogin, GeeLark, AdsPower y vendedores de proxies — es
decir, de quienes venden exactamente esa herramienta. Ninguna de esas páginas es evidencia.
Todo lo citado acá viene de documentos oficiales de plataforma o de prensa (Forbes, TechCrunch,
Digiday, 404 Media).

---

## 2. Las tres cosas distintas que se llaman "granja de contenido"

Mi error de fondo fue meterlas en la misma bolsa. Son tres negocios con tres riesgos distintos.

| | Qué es | Quién opera las cuentas | Estado real |
|---|---|---|---|
| **A. Red distribuida (clipping)** | Muchas personas independientes postean cortes del mismo material desde **sus propias** cuentas y teléfonos | Cada clipper, la suya | ✅ Legal, documentado, mueve millones |
| **B. Granja centralizada de dispositivos** | Una operación controla N celulares/perfiles con antidetect y proxies para simular N personas | La operación, todas | ⚠️ Legal en el texto, detectable en la práctica |
| **C. Engagement falso** | Bots o dispositivos que inflan vistas, likes y seguidores | La operación | 🔴 Prohibido explícito + acción policial |

Lo que Sergio vio funcionando en el mundo es **A**. Lo que Sergio propuso (varios celulares con
chips distintos operados por nosotros) es **B**. La confusión entre A y B es lo que hace que el
modelo parezca a la vez probado y peligroso: son cosas distintas.

---

## 3. Las startups reales: qué hacen exactamente

### 3.1 Clipping — el modelo A, y es enorme

La operación más grande identificada es **Clipping**, de Anthony Fujiwara (23 años), con cifras
de Bloomberg citadas por [Forbes (abr-2026)](https://www.forbes.com/sites/boazsobrado/2026/04/26/the-creator-of-clipping-who-powers-stakes-viral-machine/):

- ~**23.300 editores** contratistas; Discord central de ~60.000 miembros.
- Facturación ~**US$7,7M**.
- Las marcas pagan **US$2.500–10.000/mes**; los clippers cobran **US$300–1.500 por millón de vistas**.
- Los mejores manejan redes de 20+ cuentas propias y facturan **US$30.000–40.000/mes**.
- Campaña de Adin Ross: **430 millones de vistas** con 11.000 videos de 520 clippers.
- Control de calidad: auditores humanos revisan cada post antes de pagar; 2 faltas = expulsión.

**Whop** (la plataforma que intermedia) lanzó "Content Rewards" en marzo 2025 y cobra 10% de
comisión ([Digiday](https://digiday.com/media/wtf-is-clipping-the-low-lift-creator-strategy-grabbing-advertisers-attention/)).
Anunciantes reales: Kalshi, Autopilot (más de US$12.000 gastados). MrBeast tiene su propia
plataforma (Vyro), que pagó US$100.000 en una campaña.

**El dato que decide todo:** las cuentas **no son de la agencia**. Son de miles de personas
distintas, cada una en su teléfono, con su IP y su audiencia. No hay granja física en ningún
lado de este modelo. Es un marketplace de distribución, no una sala con celulares.

### 3.2 Las startups financiadas NO operan granjas de cuentas

Esto es importante porque es donde está el dinero institucional:

| Startup | Levantó | Qué hace realmente |
|---|---|---|
| **Creatify AI** | US$15,5M Serie A (WndrCo + Kindred; Katzenberg al board), ~US$23M total, +US$9M ARR | Genera **creativos publicitarios** con avatares IA desde una URL de producto |
| **Arcads.ai** | US$16M seed (Eurazeo), dic-2025; 6.000 clientes, US$10M ARR en 20 meses | Genera **video ads** con avatares IA en 35 idiomas |
| **Icon** | US$9,2M (Founders Fund); pagó US$12M por el dominio icon.com | **Quebró.** En bancarrota (mar-2026); pivoteó a vender UGC humano real |

Las tres **producen el creativo para que el cliente lo corra como ads pagos**. Ninguna publica
en cuentas propias a escala. Es un negocio de producción, no de distribución multi-cuenta.

El caso Icon es el más instructivo: la startup mejor financiada del rubro prometió reemplazar
al UGC humano con IA, quemó US$12M en un dominio, y terminó vendiendo *"38 Human UGC ads, 100%
real / not AI"* a US$399 antes de caer
([CTOL Digital](https://www.ctol.digital/news/icon-com-12m-domain-human-ads-ai-startup-collapse-investors-2026/)).

### 3.3 El caso donde SÍ hubo granja centralizada — y fue el que cayó

En la red de **Stake.com** (casino cripto), la mayoría eran clippers independientes, pero existía
un tier de cuentas **"agregadoras" directamente en nómina**: cobraban ~US$100 por post por sellar
memes virales con el logo de Stake, y una posaba como página parodia "anti-Stake" mientras cobraba
de Stake en secreto. Esa capa —**la única que se parece a una granja centralizada**— fue expuesta
en diciembre 2024, Elon Musk amplificó el caso, y **fue suspendida en días**
([Forbes, feb-2026](https://www.forbes.com/sites/boazsobrado/2026/02/11/inside-the-clipping-farms-driving-fintechs-marketing-boom/)).

Las cuentas se reconstruyeron en semanas. Traducción honesta: **el ban no mata el modelo, pero
obliga a rehacer el activo cada vez.** Para una operación con US$7,7M de facturación eso es un
costo operativo. Para Onia con 11 semanas de runway, es perder el trabajo entero.

---

## 4. La evidencia de enforcement que sí existe

Que multi-cuenta sea legal no significa que no haya barridos. Los hay, y son grandes:

- **YouTube (S-CTS):** ~50.000 "clusters" dados de baja agrupando **~130.000 canales en 6 meses**,
  detectando la huella exacta de una operación multi-cuenta: horarios de subida, velocidad de
  publicación, scripts e infraestructura compartida, títulos y descripciones similares. Menos del
  1% de apelaciones revertidas. *(Reportado por [Inside The Creator](https://insidethecreator.beehiiv.com/p/the-slop-purge-has-arrived), jul-2026 — el paper primario de Google no pude verificarlo; tratar la cifra exacta con cautela.)*
- **Meta / Facebook (abr-2025):** apunta explícitamente a *"spam networks that create hundreds of
  networks to share the same spammy content"*, con reducción de alcance y pérdida de monetización
  ([TechCrunch](https://techcrunch.com/2025/04/24/facebook-cracks-down-on-spammy-content-by-cutting-reach-and-monetization)).
- **Instagram (may-2026):** purga masiva de cuentas con un detector nuevo de comportamiento
  inauténtico coordinado, y cambio de política que **despriorizó a las cuentas que principalmente
  repostean material** — le pega directo al motor económico del clipping en esa plataforma.
- **Allanamientos físicos:** Lituania decomisó **75.000 tarjetas SIM** y 200 SIM boxes (oct-2025);
  en Macaé (Brasil) allanaron una casa con racks de celulares Android reproduciendo videos en loop
  (dic-2025). Ambos casos son categoría **C** (engagement falso), no A.

**Y el punto que sí sostenía mi veredicto original**, con cita primaria: Meta autoriza restringir
Páginas, Business Managers y cuentas publicitarias por *"close linkage with a network of accounts
that violate or evade our policies"* y por estar *"owned by the same person or entity as an account
that has been disabled"*
([Account Integrity](https://transparency.meta.com/policies/community-standards/account-integrity/)).
El contagio no es teoría: es política escrita. Pero **el gatillo es la violación, no la
multiplicidad** — y eso es lo que yo había difuminado.

---

## 5. Cuánto cuesta y cuánto tiempo consume (el dato que decide)

Precios verificados, agosto 2026:

| Concepto | Costo real |
|---|---|
| Cloud phones (GeeLark) | **US$29,90 por dispositivo/mes** |
| Antidetect (Multilogin Pro 100) | US$26,67/mes anual |
| Proxies móviles dedicados | **~US$65 por proxy/mes** (o US$3,60–5,20/GB) |
| **Total nube, 10 cuentas** | **US$650–950/mes** |
| Celular Android básico en Bolivia | Bs 1.300–2.100 (~US$107–173) |
| **Total hardware, 10 cuentas** | **US$1.100–1.750 inicial + ~US$400/mes** |
| Herramientas de API oficial (SocialBu Growth, 20 cuentas) | **US$79/mes** |
| Una cuenta bien operada | **US$0/mes** |

**Pero el costo que mata la idea no es el dinero — es el tiempo.** Los operadores reportan
**10–30 minutos por cuenta por día durante 7–14 días** de calentamiento, y un techo de 20–30
cuentas por operador antes de que las ventanas choquen.

Para 10 cuentas eso son **23 a 47 horas por semana**, antes de producir una sola pieza.
**Arthur es medio tiempo.** La operación consume su semana entera solo en mantener cuentas vivas,
sin escribir un guion ni hacer un outreach.

---

## 6. El argumento que ninguno de los dos había puesto: la métrica no coincide

Este es el punto decisivo, y no tiene nada que ver con bans.

**El clipping monetiza vistas.** Funciona para casinos cripto, apps de inversión, creators con
programa de monetización y ofertas de afiliados: negocios donde **más audiencia global = más
ingreso**, linealmente. Por eso pagan US$1–5 por cada 1.000 vistas: para ellos una vista tiene
un precio.

**Onia no monetiza vistas.** Onia monetiza una lista finita y nombrable: ~150 clínicas dentales
listadas en Santa Cruz, más ferreterías y distribuidoras. El comprador es el dueño de un negocio
formal con NIT, y hay **cientos**, no millones.

Puesto en números: la campaña de Adin Ross hizo 430 millones de vistas. Si el 0,00003% de esas
vistas fuera un dueño de clínica en Santa Cruz, serían ~130 personas — **exactamente la lista que
ya tenemos en un Excel y podemos contactar una por una esta semana, gratis.**

Con un mercado de ese tamaño, el alcance masivo es la herramienta equivocada. La literatura de
marketing B2B con TAM chico dice lo mismo: enfoque tipo ABM (cuentas específicas, contacto
personalizado), no volumen.

**La granja no falla porque te baneen. Falla porque optimiza una métrica que no es la nuestra.**

---

## 7. Veredicto revisado

🟡 **Descartada para Onia hoy — pero por economía y foco, no por ilegalidad.** Con gatillo real
de reapertura.

| Afirmación | Veredicto |
|---|---|
| "No es baneable" | ✅ **Correcto.** Multi-cuenta está permitido explícitamente por TikTok y soportado por Meta Business Suite |
| "Hay startups que lo hacen" | ✅ **Correcto**, con matiz: el modelo probado (clipping, US$7,7M) es **red distribuida de personas reales**, no granja centralizada |
| "Una granja centralizada es equivalente" | ❌ Es la variante que Meta puede vincular a los assets del Business Manager, y la única del caso Stake que fue suspendida |
| "Le sirve a Onia ahora" | ❌ **No.** 23-47 h/semana + US$650-950/mes para optimizar vistas, cuando el mercado son ~150 negocios contactables por nombre |

**Los tres números que cierran el caso:** Arthur es medio tiempo y la granja pide su semana
completa · el costo mensual equivale a una porción seria de un runway de 11 semanas · y el
producto todavía no publica **ni una** pieza en la cuenta que ya tenemos (token IG, bloqueo S6).
**Multiplicar por diez una operación que hoy vale cero sigue dando cero.**

### Gatillo de reapertura (concreto, no "algún día")

Se reabre cuando se cumplan **las tres**:
1. La cuenta de Onia publica consistentemente y **una** pieza demostró traer una demo atribuible (o sea: el contenido convierte).
2. Hay clientes pagando y la restricción pasa a ser alcance, no dinero ni tiempo.
3. Existe un producto donde más vistas = más ingreso de forma lineal (ejemplo real: el módulo
   "Onia te publica", o un infoproducto).

### Lo que SÍ se toma del modelo, y ya está en marcha

**La versión buena del clipping para Onia ya existe y se llama el acuerdo con Arthur.** El
mecanismo central del clipping es *pagar por resultado atribuible a quien distribuye*. Eso es
exactamente el modelo firmado hoy — solo que en vez de pagar por cada millón de vistas, paga
**Bs 50 por demo atribuible realizada y 20% de la suscripción durante 6 meses**. Es la traducción
correcta del mismo incentivo a un negocio B2B local: paga por el resultado que sí monetizamos.

Dos cosas más, gratis y legales, que sí valen:

- **Multiplicar cada pieza en formatos y plataformas** desde las cuentas oficiales (Reels, TikTok,
  Shorts). Es el 80% del beneficio del clipping sin ninguna cuenta nueva — y las herramientas de
  API oficial cuestan US$0–79/mes en vez de US$650–950.
- **Etiquetado de IA obligatorio** en el contenido de Lucía: TikTok exige divulgar contenido
  generado por IA con escenas o personas realistas, y Meta aplica su etiqueta "AI Info". Ya es la
  regla vigente en [[ai-influencers-account-ops]]; esta investigación la confirma en fuente oficial.

---

## 8. Lo que aprendí sobre cómo respondí la primera vez

Mi veredicto original llegó a una conclusión defendible por un camino flojo: afirmé una
violación de ToS que no verifiqué, y usé el riesgo de ban como argumento principal cuando el
argumento fuerte era económico. Sergio hizo bien en no aceptarlo. **La regla que aplica hacia
adelante: si un veredicto se apoya en "eso viola las reglas de la plataforma", va con la cita
textual de la plataforma o no va.**

---

Relacionado: `ONIA_LLUVIA_IDEAS_SERGIO_ARTHUR_20260801.md` §3.7 (el veredicto que esto corrige) ·
`ONIA_ARTHUR_CARRIL_CONTENIDO_Y_PAGO_20260801.md` (el modelo de pago por resultado que ya
implementa el incentivo del clipping) · `ONIA_ENFOQUE_20260727.md` (a quién le vendemos y por qué
el TAM es chico) · memoria [[ai-influencers-account-ops]] (etiqueta de IA y operación de cuentas).
