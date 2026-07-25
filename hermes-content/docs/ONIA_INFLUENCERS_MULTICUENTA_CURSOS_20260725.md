# ONIA — Influencers IA, multi-cuenta y cursos (research 2026-07-25)

> Investigación con fuentes (4 agentes). Decisiones de Sergio pendientes al final.

# Plan ONIA: Lucía, "granja" de modelos y cursos
**Para Sergio · 25-jul-2026 · Estratega ONIA**
Tipo de cambio usado: paralelo Bs 11,75/USD (oficial BCB Bs 10,90). Todo lo marcado `[NO CONFIRMADO]` hay que probarlo antes de apostarle plata.

---

## 0. Veredicto en 6 líneas

1. **La cuenta de Lucía se puede montar esta semana y publicar por API sin App Review.** El bloqueo S6 (token IG) estaba mal diagnosticado: existe la ruta *Instagram API with Instagram Login*, que NO necesita Página de Facebook y sí publica Reels. Eso lo destraba hoy.
2. **La granja de celulares es mala idea para ONIA, y lo digo con argumento:** cuesta USD 260-400/mes + upfront, y existe para esconder algo. Nosotros no tenemos nada que esconder porque nuestras modelos son marcas propias declaradas como IA. El equivalente legítimo cuesta USD 0-55/mes y da el mismo resultado.
3. **El riesgo real no es el baneo: es el shadowban por contenido plantillado.** Si 5 modelos publican la misma plantilla con distinta cara, nadie las banea - simplemente dejan de distribuirlas. Pagás la infra y no vendés nada.
4. **Cursos: no cobrar nada todavía.** El dato es inequívoco: sin 1.000 emails, el primer lanzamiento rinde ~cero y el costo del fracaso son 8 meses de parálisis. Fase 0 gratis primero.
5. **Push-back honesto: Lucía NO es el camino corto a vender DentalGest.** Su audiencia (lifestyle, Santa Cruz, 26) no compra software dental. Lucía sirve al negocio de **cursos** y como caso vivo. Quien vende DentalGest es Sergio con casos reales y el reto en público.
6. **Lo único que sirve a los tres frentes al mismo tiempo es el reto "0 a 5K" de Sergio construyendo en público.** Ese es el activo a arrancar esta semana; lo demás se apila encima.

---

## 1. Cuenta de Lucía - checklist de arranque

Leyenda de dueño: **[S]** = solo Sergio (humano, irreemplazable) · **[C]** = lo hago yo · **[S+C]** = yo preparo, Sergio ejecuta/aprueba.

### Bloque A - Identidad (antes de tocar nada técnico)

| # | Paso | Dueño | Detalle |
|---|---|---|---|
| 1 | Email dedicado `lucia@<dominio ONIA>` en Zoho catch-all | **[S+C]** | Yo dejo el alias configurado si me pasás acceso al panel de Zoho; si no, son 5 min tuyos. **No usar tu Gmail ni un alias del buzón visible.** |
| 2 | Número de teléfono | **[S]** | IG **no lo exige para arrancar** (alcanza email confirmado, regla textual de Meta). TikTok probablemente sí. Usar **chip boliviano real, uno por modelo**. NO servicios de SMS descartables ni VoIP: no están prohibidos por escrito, pero son exactamente la señal que alimenta el clustering antifraude. |
| 3 | Crear la cuenta de Instagram **a mano, desde un teléfono real** | **[S]** | Crear cuentas por medios automatizados es **violación explícita** de los Terms of Use de Instagram. **Yo no voy a hacer este paso ni con computer-use.** Es la línea que no se cruza. |
| 4 | Convertir a **cuenta Profesional → Creator** | **[S]** | Requisito duro de la API. Personal no accede a Content Publishing. |
| 5 | Activar el label **"AI creator"** en el perfil | **[S]** | Opt-in, rollout mayo-2026. Es el escudo reputacional y regulatorio más barato que existe. `[NO CONFIRMADO por Meta oficialmente - solo prensa secundaria. Si no aparece en la app, saltar a la Bio del paso 6.]` |
| 6 | Bio y nombre visible | **[C]** redacto, **[S]** aprueba | Línea 1 declara IA. Borrador: *"Personaje digital creado con IA por ONIA · Santa Cruz · Automatizo contenido y te muestro cómo"* + link. Esto es lo que convierte la operación de "conducta inauténtica" a "marca". |
| 7 | Link en bio | **[C]** | Landing propia con web-factory (activo que ya existe) → captura de email. **No** mandar directo a DentalGest: la audiencia de Lucía no compra software dental. |
| 8 | 3-5 posts orgánicos publicados **a mano** antes de conectar nada automático | **[S+C]** | Yo produzco el contenido (Higgsfield Soul + `editor-videos`), vos lo subís desde el teléfono. Genera histórico de comportamiento humano. |

### Bloque B - TikTok

| # | Paso | Dueño | Detalle |
|---|---|---|---|
| 9 | Alta TikTok con el mismo email dedicado | **[S]** | **Cuenta personal, no Business**, por si algún día se quiere monetización nativa. Ojo: Creator Rewards **no está en Bolivia** (solo US, UK, DE, JP, KR, FR, MX, BR). El ingreso de Lucía nunca va a venir de payouts de plataforma. |
| 10 | Etiquetar como IA **cada** video realista | **[S+C]** | In-app: setting AIGC. Por API: campo `is_aigc: true`. No es opcional: TikTok lee C2PA y etiqueta solo. Y activar la etiqueta **no baja el alcance** (dicho por TikTok). |
| 11 | Commercial Content Disclosure → **"Your Brand"** cuando promociona ONIA | **[S+C]** | Si no se declara, el video queda **inelegible para el For You Feed**. |

### Bloque C - Publicación por API (el desbloqueo real)

**Instagram - ruta corta, SIN App Review. Tiempo: 1-2 días.**

| # | Paso | Dueño | Tiempo |
|---|---|---|---|
| 12 | Crear app en Meta for Developers, producto **Instagram** con **Instagram Login** | **[S]** (login tuyo) | 30 min |
| 13 | Pedir `instagram_business_basic` + `instagram_business_content_publish` en **Standard Access** | **[S]** | inmediato |
| 14 | Vincular la cuenta de Lucía como cuenta propia de la app | **[S]** | 10 min |
| 15 | Guardar el token como **credencial n8n tipo Header Auth** | **[C]** | 20 min. Regla del proyecto: nada de `$env` en el plan VPS. |
| 16 | Workflow n8n de publicación + hosting del media en el VPS (URL pública) | **[C]** | medio día. **Imágenes en JPEG obligatorio.** |
| 17 | Guard de rate limit sobre `content_publishing_limit` | **[C]** | La doc oficial dice **100 posts/24h por cuenta**; mucha fuente de terceros repite 25. Programo el guard en **25** para estar del lado seguro. Vamos a usar 1-3. |
| 18 | Cola de aprobación en ONIA Center (preview + copy + label IA antes de publicar) | **[C]** | 1 día. **Gate humano obligatorio**, misma regla de oro que `editor-videos`. Es lo que evita que un batch mal generado queme la cuenta. |

> **Por qué esto importa:** el App Review + Business Verification (que tarda semanas) **solo se exige si la app sirve a cuentas de terceros**. Mientras publiquemos en cuentas propias, Standard Access alcanza. Si algún día ONIA publica para clientes, ahí sí: Business Verification 48h-3 días hábiles con NIT + constitución + ID.

**TikTok - ruta larga. Tiempo: 2-4 semanas y puede salir mal.**

| # | Paso | Dueño | Detalle |
|---|---|---|---|
| 19 | **Decisión:** NO pelear la auditoría propia | **[S]** decide | La auditoría de TikTok **rechaza herramientas internas/privadas** (exige caso de uso para audiencia amplia). Un panel propio de ONIA para nuestras cuentas es candidato a rechazo. Sin auditoría, todo post directo sale `SELF_ONLY` (solo lo ve el creador): inútil. |
| 20 | Plan A: **publicación manual en TikTok** los primeros meses | **[S]** | 2 minutos por video. No perder semanas peleando el audit. |
| 21 | Plan B: publicar vía herramienta **ya auditada** (Upload-Post free / Postiz self-hosted / Blotato) | **[C]** | Ellos ya pasaron el audit; nosotros orquestamos desde n8n. |

### Bloque D - Riesgo #1 y su mitigación (leer sí o sí)

**El video-selfie de verificación de Instagram.** Hay caso documentado de una cuenta de influencer IA - correctamente etiquetada como IA - **deshabilitada permanentemente por "fraud and deception"** tras el selfie de verificación, sin apelación efectiva. Ninguna cara generada pasa un liveness check. `[Fuente secundaria, un caso. Pero el mecanismo es real y no tiene workaround limpio.]`

Mitigación (no eliminación) del riesgo:
- **[C]** Backup automático de todo el contenido de Lucía en el VPS + Supabase. Si cae la cuenta, no perdemos el activo.
- **[S]** Reservar un username secundario.
- **[S+C]** **Nunca concentrar el funnel comercial en una sola cuenta.** El email capturado en la landing es nuestro; los seguidores son de Meta.
- No disparar el trigger: cero compra de seguidores, cero pods, cero automatización de likes/follows/comentarios. Ni una vez.

---

## 2. Escalar a 3-5 modelos - arquitectura recomendada

### 2.1 El principio de diseño

> **No construir para esconderse. Construir para ser auditable.**

Cada modelo de ONIA es una **marca propia declarada como IA**, no una persona falsa. Con eso todo el stack de evasión (granja de celulares, cloud phones, antidetect, proxies móviles) se vuelve **innecesario**, porque su única función sería esconder algo que no hay que esconder.

La línea roja de Meta no es "muchas cuentas coordinadas". Es literal: *"redes que dependen de identidades falsas para engañar sobre **quién está detrás y qué está haciendo**"*. Cinco cuentas que dicen "soy IA, me hizo ONIA" no son eso. Cinco cuentas que se presentan como cinco chicas cruceñas independientes que casualmente recomiendan DentalGest **sí son conducta inauténtica coordinada de manual**.

### 2.2 Las 4 capas

**Capa 1 - Identidad (una vez, manual, humano)**
Un email dedicado por modelo (Zoho catch-all), un chip boliviano real por modelo, alta a mano desde teléfono real, conversión a Professional día 1, bio que declara IA, label AIGC siempre activo.

**Capa 2 - Gobernanza (esto reemplaza a la granja)**
- **Business Portfolio A - "ONIA Personas"**: las 3-5 cuentas IG/FB de las modelos. Sin ad account de producto.
- **Business Portfolio B - "ONIA Comercial"**: DentalGest, web-factory, el ad account `act_1073680778314945` que gasta plata.
- **Regla dura: nunca cruzar activos entre A y B.** Meta escala restricciones a nivel portfolio y **cada persona solo puede crear 2 portfolios**. Si metemos todo junto y una modelo recibe strikes por contenido IA mal declarado, **el radio de explosión incluye el motor comercial**. Este es el riesgo que más caro sale y el más fácil de evitar.
- **TikTok Business Center** para las cuentas de TikTok: es el equivalente oficial, gratuito y explícitamente permitido de la "granja".

**Capa 3 - Publicación**
n8n en el VPS → capa de publicación (Postiz self-hosted / Upload-Post / Blotato) → Supabase → cola de aprobación en ONIA Center. Gate humano antes de cada publicación.

**Capa 4 - Producción (nuestra ventaja real)**
Higgsfield Soul por modelo + ElevenLabs por modelo + `editor-videos`/HyperFrames. **Regla anti-plantilla: guion propio, ángulo propio y nicho propio por modelo.**

### 2.3 Costo mensual

| Ítem | USD/mes | Bs/mes |
|---|---|---|
| VPS + n8n (ya existe) | 0 | 0 |
| Publicación - Opción A: Postiz self-hosted en nuestro VPS | 0 | 0 |
| Publicación - Opción B: Upload-Post free tier (n8n nativo) | 0 | 0 |
| Publicación - Opción C: Blotato Starter (20 cuentas + API) | 29 | 341 |
| Analítica - Metricool Starter (5 marcas, 1 marca = 1 modelo) | 20-25 | 235-294 |
| Meta Business Portfolio + TikTok Business Center | 0 | 0 |
| Chips bolivianos (una sola vez) | 15-25 one-time | 176-294 |
| **TOTAL recomendado** | **20-55/mes** | **235-646/mes** |
| **TOTAL todo self-hosted** | **0-25/mes** | **0-294/mes** |

**Contra la granja: USD 260-400/mes + USD 250-1.500 upfront + operación manual humana + riesgo de pérdida total.**
Ahorro: **USD 3.100-4.500/año ≈ Bs 36.400-52.900/año.**

### 2.4 Prácticas de "granja" que queman cuentas - y por qué NO las vamos a usar

| Práctica | Por qué NO |
|---|---|
| **Granja de celulares / cloud phones / antidetect / proxies móviles** | Es infraestructura de **evasión**. ONIA no tiene nada que evadir. Cuesta 10x y suma riesgo. Además, UK ya está tipificando los dispositivos multi-SIM (5+) con **multa ilimitada**: la dirección regulatoria es clara. |
| **Crear cuentas de forma automatizada** | Violación **explícita** de los Terms of Use de Instagram. No hay lectura amable. |
| **Bots de likes/follows/comentarios, pods, engagement comprado** | Prohibido explícito por Meta y TikTok. Es la causa #1 de baneo real. TikTok bloqueó >2.000 millones de cuentas spam en 2024. |
| **Que las modelos de ONIA se sigan/comenten entre sí** | Eso **es** conducta inauténtica coordinada. Es el ejemplo del manual. Cero interacción cruzada. |
| **Compartir dispositivo / IP / teléfono / patrón de email entre cuentas** | **Chain ban**: cuando una cae, Meta detecta las vinculadas por fingerprint y las arrastra. Perdés 5 activos por el error de 1. `[Fuentes de vendedores de antidetect, sesgo alto, pero coincidentes entre competidores.]` |
| **Presentar a una modelo como humana real** | Meta Inauthentic Behavior + TikTok AIGC + EU AI Act art. 50 (aplicable 2-ago-2026) + mata la marca cuando se descubre. |
| **Que Lucía diga "yo uso DentalGest y me encanta"** | **FTC 16 CFR 465**: testimonio de alguien que no existe. Hasta **USD 51.744 por violación**. Regla operativa: **Lucía presenta y demuestra, NO testimonia como usuaria.** |
| **Comprar cuentas "envejecidas"** | Trade de cuentas prohibido en ambas, y heredás el historial sucio del vendedor. |
| **Publicar la misma plantilla con 5 caras distintas** | No te banean: **te dejan de distribuir**. Instagram desde abr-2026 saca de recomendaciones a las cuentas de contenido no original; YouTube renombró su política a "inauthentic content". Es el peor resultado posible: infra pagada, cero venta. |

### 2.5 Honestidad sobre el negocio en sí

The Clueless factura **~EUR 10.000/mes** con Aitana López (400k seguidores) **y tiene 11 personas detrás**. Eso es ~EUR 900/mes de facturación por persona del equipo. Es un negocio de agencia creativa, no una máquina de imprimir dinero. Nuestra ventaja real es que **automatizamos con código la parte de producción que ellos hacen a mano** - pero el guion, la estrategia y la relación comercial siguen siendo humanas. Cualquiera que venda "5 influencers IA en automático" está omitiendo esto, y nosotros no lo vamos a omitir en el curso.

---

## 3. Cursos

### 3.1 Qué vender primero (y qué NO)

**NO vender:** "Curso de IA", "aprendé n8n", "agentes de IA". Ese espacio ya lo ocupan Imperio Agéntico (**3.100 miembros × USD 59/mes ≈ USD 180.000/mes bruto**, en español) y Veltim (partner verificado de n8n). Entrar ahí es competir sin foso.

**NO vender jamás:** "cómo montar tu granja", "cómo manejar 50 cuentas sin que te baneen". Es vender un método de evasión de ToS. Tus alumnos van a perder cuentas y el reclamo viene contra ONIA.

**SÍ vender el foso real:**

> **"Granja de Contenido IA"** - operar varias cuentas de modelo IA **declarada** desde un solo panel, con video editado por código y agentes que atienden por WhatsApp.

Tres pilares que **ya existen** en ONIA, no hay que inventar nada:
1. **Crear la modelo** - Higgsfield Soul consistente + voz ElevenLabs + posicionamiento (Lucía es el caso vivo).
2. **Producir sin editor humano** - transcribir con Speaches gratis, cortar silencios y muletillas, karaoke, overlays. Todo por código. **Esto casi nadie lo enseña y es 100% legítimo.**
3. **Operar en escala legal** - Business Portfolio, TikTok Business Center, n8n, cola de aprobación, compliance (AIGC / AI-info / EU AI Act / FTC) **como feature de venta, no como letra chica**.

Avatar específico (contra el error del 68% que apunta a "todos los interesados en IA"): **el emprendedor o agencia chica de LatAm que ya intentó hacer contenido y se ahogó en la edición.**

### 3.2 Escalera de producto y precio

| Fase | Producto | Precio USD | Precio Bs | Objetivo |
|---|---|---|---|---|
| **0** (meses 1-3) | Contenido gratis: reto "0 a 5K" + Lucía en público, 3-5 piezas/semana + newsletter | **Gratis** | - | **1.000 emails.** Sin esto nada de abajo funciona. |
| **1** (mes 3-4) | Reto pagado 14 días: "Tu primera modelo IA publicando sola" | **USD 39** | Bs 458 | Validar que alguien paga |
| **2** (mes 4+) | Comunidad mensual "Granja de Contenido IA" | **USD 29/mes**, sube a 49 a los 300 miembros | Bs 341/mes | **MRR** |
| **3** (mes 9+) | Implementación hecha con vos (grupo de 8, 6 semanas) | USD 497-997 | Bs 5.840-11.715 | Margen alto sobre los que ya están adentro |

**Por qué USD 29 y no 59:** ONIA no tiene marca en este nicho todavía. Veltim cobra 30 con 72 miembros; Imperio cobra 59 con 3.100. Entramos en el piso observable y subimos escalonado con prueba social pública ("el precio sube a 49 en el miembro 300"). Es urgencia honesta y comprobada en el nicho.

**Ancla de precio para justificarlo:** implementar un agente de WhatsApp con IA le cuesta a una PyME USD 130-830/mes de servicio. La comunidad enseña a construirlo por USD 29/mes. La comparación se vende sola.

### 3.3 Plataforma cobrable desde Bolivia

Esto decide todo, y elimina la mitad del mercado de herramientas:

| Plataforma | ¿Cobra un boliviano? |
|---|---|
| **Stripe** | **NO.** Bolivia no está soportado (en LatAm solo Brasil y México). `[OFICIAL]` |
| **PayPal** | **NO.** Bolivia es el único país de LatAm donde no se puede recibir ni retirar a banco local. `[Fuentes secundarias consistentes]` |
| **Skool** | **NO como cobrador** - paga vía Stripe Express. `[INFERIDO: Skool paga por Stripe + Stripe no lista Bolivia. No lo dicen por escrito. Hay que probar el alta.]` |
| **Hotmart** | **SÍ.** Ruta más limpia y verificada. Retiro por **HotPay International** (banco no brasileño, cualquier país) o **Payoneer**. Acepta tarjetas de bancos bolivianos del lado comprador, 22 monedas, 44 métodos. Suscripción recurrente nativa. `[OFICIAL]` |
| **Whop** | **PROBABLE.** Payouts por banco, wallet, **cripto (USDC)** en "200+ países". La vía cripto esquiva Stripe entero. `[NO CONFIRMADO - no publican lista por país. 20 minutos de verificación decide si nos ahorramos el 9,9%.]` |
| **QR Simple (Bolivia)** | **SÍ, comisión 0%.** Para vender a bolivianos. Acceso otorgado por n8n → Supabase (ya lo tenemos). |

**Arquitectura de cobro recomendada:**
- **Carril A (90% del mercado - LatAm hispana + España): Hotmart.** Costo 9,9% + USD 0,50 por cobro. **No usar su reproductor de video** (+USD 1,49/venta): el video va en nuestro VPS.
- **Carril B (bolivianos): QR Simple, 0% de comisión.**
- **Casa de la comunidad:** Skool plan Hobby (USD 9/mes) como casa, cobro por fuera, alta/baja de miembros vía n8n. A 6 meses, migrar a **panel propio Next+Supabase** (stack que ya dominamos) → 0% de comisión, dato propio, **y el panel se vuelve demo de venta de web-factory**.
- Conversión USD → Bs: Payoneer → Airtm (~4% total) o Binance P2P (~1-2%). **Precio base en USD, precio en Bs como cortesía local:** el paralelo (11,75) rinde ~8% más que el oficial (10,90).

**Fiscal (no es opcional):** registrarse como **exportador de servicios** en el Padrón (exención de IVA e IT sobre venta al exterior) y evaluar **régimen SIETE-RG** mientras se facture <Bs 400.000/año (pago único bimestral del 5% que consolida IVA+IT+IUE). Recordá que la facturación electrónica es obligatoria desde 30-sep-2026: el curso nace facturando bien o nace mal.

### 3.4 Cálculo de ingreso potencial

**Supuestos marcados (todos discutibles):**
- (S1) Fase 0 logra **1.000 emails en 3 meses** con 3-5 piezas/semana. *Optimista si el reto no engancha.*
- (S2) Conversión del reto pagado: **4-8%** de la lista. Benchmark del sector: 1-5%, hasta 5-8% con email fuerte.
- (S3) **31% de los que completan el reto** convierten a comunidad mensual. *Este número viene de UN solo caso documentado - tratarlo como plantilla de mecánica, no como proyección.*
- (S4) Churn no modelado. Es el riesgo #1 de una membresía y va a existir.
- (S5) Neto Hotmart = bruto − 9,9% − USD 0,50 por cobro.

**Reto pagado (una cohorte):**
- 1.000 emails × 6% = 60 compradores × USD 39 = **USD 2.340 bruto**
- Neto por venta: 39 − 3,86 − 0,50 = **USD 34,64** → **USD 2.078 neto ≈ Bs 24.420**

**Comunidad recurrente (MRR):**
Neto por miembro a USD 29 = 29 − 2,87 − 0,50 = **USD 25,63**

| Escenario | Miembros | Bruto/mes | Neto/mes USD | Neto/mes Bs |
|---|---|---|---|---|
| Piso (mes 6) | 30 × 29 | 870 | **769** | **9.036** |
| Base (mes 12) | 150 × 29 | 4.350 | **3.844** | **45.167** |
| Bueno (mes 18) | 300 × 49 | 14.700 | **13.095** | **153.866** |

*Cobrando por QR a bolivianos el neto es el 100%.*

**Realidad check honesto:** el primer lanzamiento típico de un creador sin audiencia rinde **USD 500-3.000**, y quien lanza y no vende espera 8 meses antes de reintentar. El escenario "Base" a 12 meses es alcanzable pero **no es plata rápida**, y depende enteramente de que la Fase 0 gratis se ejecute con disciplina durante 3 meses seguidos.

### 3.5 Cómo el contenido actual alimenta el embudo (costo marginal ~0)

| Activo que YA existe | Uso en el curso |
|---|---|
| **Reto "0 a 5K" de Sergio** | Contenido de descubrimiento semanal + prueba de que el método funciona (modelo Justin Welsh / Romuald Fons: descubrimiento → confianza → relación → monetización) |
| **Lucía (@lu.antelo)** | Caso vivo del pilar 1. Cada iteración = una lección del módulo "crear la modelo" |
| **`editor-videos`** (cortes, karaoke, overlays) | Módulo 2 completo. Los propios videos del canal se editan con él y se muestra el proceso |
| **`ver-videos` + Speaches en VPS** | Lección "transcribir gratis sin GPU" - diferenciador real vs cursos que recetan AssemblyAI pago |
| **11 agentes n8n vivos + ONIA Center** | Módulo 3 + plantillas descargables (el activo #1 que pide la gente en comunidades) |
| **Canales YT "ONIA Automatiza" y "Ciencia de tu Cuerpo"** | Segunda granja demostrada: prueba de que el sistema replica, no fue suerte |
| **Pricing y propuestas de web-factory** | Módulo bonus: cómo cobrar esto como servicio (donde está la plata del alumno) |

**El bucle:** cada semana ONIA produce contenido igual → 1 pieza pública (embudo) + 1 lección privada (retención) del **mismo material**. El curso termina pagando la producción de contenido que hoy es puro costo.

---

## 4. Orden recomendado (el foco es vender DentalGest)

### AHORA (esta semana) - no compite con DentalGest, lo refuerza

1. **Reto "0 a 5K" de Sergio en público, 3 piezas/semana.** Es el único activo que sirve a los tres frentes: da credibilidad B2B para DentalGest en Bolivia, tráfico para Lucía y audiencia para el curso. **Costo: 0. Tiempo: ~2h/semana tuyas + yo produzco.**
2. **Landing de captura de emails** con web-factory + contador de suscriptores en ONIA Center. **La métrica que gobierna todo el plan es "suscriptores", no "seguidores".** Lo hago yo.
3. **Registro como exportador de servicios** (Padrón). Trámite tuyo, destraba cobrar legal después.

### PRÓXIMAS 2-3 SEMANAS - barato y automatizable

4. **Cuenta de Lucía + publicación por API** (checklist §1). Setup ~2 días míos + ~1h tuya. Después corre sola con gate de aprobación. **Presupuesto de atención acotado: si te consume más de 1h/semana, algo está mal armado.**
5. **Verificar Whop desde Bolivia** (20 min). Decide si nos ahorramos el 9,9% de Hotmart.

### MES 2-4 - solo si la Fase 0 va bien

6. **Modelo #2** (no las 5 de golpe). Validar que la arquitectura de 2 portfolios y la cola de aprobación aguantan antes de multiplicar.
7. **Reto pagado USD 39** cuando la lista pase los 1.000.

### NO AHORA - y por qué

| Frente | Veredicto |
|---|---|
| **Granja de celulares / cloud phones / proxies** | **NUNCA.** No es "después": es una arquitectura equivocada para nuestro caso. §2.4. |
| **5 modelos simultáneas** | No hasta validar 2. El riesgo de contenido plantillado (shadowban silencioso) es alto y se descubre tarde. |
| **Cobrar el curso** | No hasta 1.000 emails. El dato: 10x más probabilidad de ingreso relevante el día 1. |
| **Auditoría propia de TikTok Content Posting API** | No. 2-4 semanas, rechaza herramientas internas. Manual + herramienta ya auditada. |
| **Lucía vendiendo DentalGest** | No. Su audiencia no compra software dental, y un testimonio suyo como "usuaria" es riesgo FTC directo. Lucía vende el **curso**; DentalGest lo vendés vos con casos reales. |
| **Skool/Kajabi/Teachable como cobrador** | No. Stripe no opera en Bolivia. |

---

## 5. Lo que necesito de Sergio

| # | Decisión / dato | Por qué destraba |
|---|---|---|
| **1** | **Sí/no a Lucía ahora**, con el reframe: Lucía sirve al curso y como caso vivo, **no** a DentalGest | Si la respuesta es "primero DentalGest a secas", cierro el frente Lucía y lo dejo anotado. No quiero abrirte un frente que no vas a atender. |
| **2** | **Acceso al panel de Zoho** (o creás vos `lucia@dominio`) | Sin email dedicado no arranca nada. 5 minutos. |
| **3** | **Alta manual de la cuenta IG desde tu teléfono** con chip real | **No lo puedo hacer yo**: crear cuentas automatizadas viola los ToS de Instagram y no voy a cruzar esa línea. Es el único paso 100% humano del checklist. |
| **4** | **Login de Meta for Developers** para crear la app (paso 12-14) | Desbloquea la publicación por API. Es el bloqueo S6 de tu lista, y resulta que **no necesitaba Página de Facebook**. |
| **5** | **Confirmar la separación en 2 Business Portfolios** (Personas / Comercial) | Es el firewall que evita que un strike de contenido IA te toque el ad account que vende DentalGest. Tenés exactamente 2 portfolios permitidos: hay que usarlos bien desde el día 1. |
| **6** | **Registro como exportador de servicios** + decisión sobre SIETE-RG | Sin esto no se puede cobrar el curso legal ni con exención de IVA/IT. Trámite tuyo, tarda. Empezalo antes de necesitarlo. |
| **7** | **Cuánto tiempo tuyo por semana** le podés dar al reto "0 a 5K" | Si son <2h/semana, el plan de cursos no cierra y prefiero decírtelo ahora que en el mes 6. La Fase 0 es la que no se puede automatizar. |
| **8** | **Presupuesto mensual tope** para este frente | Mi recomendación es **USD 0-55/mes (Bs 0-646)**. Si querés cero gasto adicional, se hace todo self-hosted (Postiz en el VPS + Upload-Post free) por USD 0. Necesito el número para no asumir. |
| **9** | Permiso caso por caso para generación paga (Higgsfield / ElevenLabs) del contenido de Lucía | Regla vigente `gasto-plataformas-validar-primero`. Sin esto produzco solo con lo gratis. |

---

## 6. Lo NO confirmado (no darlo por cierto)

- **Label "AI creator" de Instagram**: solo prensa secundaria (MediaPost, netinfluencer, Engadget). No encontré el post oficial de Meta. **Verificar en la app antes de basar comunicación en eso.**
- **Campo de disclosure de IA en la API de publicación de Instagram**: no aparece en la doc. Asumir que **no existe** y resolver el disclosure por label de perfil + C2PA en el archivo + copy.
- **Whop cobrando desde Bolivia**: no publican lista por país. Requiere verificación empírica (20 min).
- **Skool + Bolivia**: inferido de (Skool paga por Stripe Express) + (Stripe no lista Bolivia). Sólido pero no declarado por Skool.
- **PayPal Bolivia**: fuentes secundarias consistentes entre sí, sin página oficial de PayPal que lo diga.
- **Límite de cuentas por dispositivo/IP** y **política sobre números VoIP**: ninguna de las dos plataformas lo publica. Los "límites por hora" de Instagram (60 follows / 150 likes / 20 comments) que repite la prensa **no tienen fuente oficial**.
- **Límite de posts por API en IG**: la doc oficial dice 100/24h; mucha fuente de terceros repite 25. Programo el guard en 25.
- **Tiempo real de aprobación del audit de TikTok**: no publicado. Los 2-4 semanas son reporte de terceros.
- **Datos de costo de granjas (GeeLark, proxies, antidetect)** y **de chain bans (Multilogin, GoLogin, Octo)**: vienen de blogs de los propios vendedores. Sesgo alto. Los cito porque coinciden entre competidores con incentivos opuestos, no porque sean independientes.
- **Cifras de ingreso de Fanvue y el caso "challenge-first"**: blogs afiliados y un solo caso anónimo. Techo optimista, no promedio.
- **Los precios de comunidades en Skool en español (Imperio USD 59 / Veltim USD 30)**: observación directa de páginas públicas. Es el dato más confiable de todo el informe de cursos.

---

# Anexo A — Cuentas de influencer IA

# Cuenta de influencer IA en Instagram y TikTok — investigación con fuentes (julio 2026)

> Alcance y honestidad: todo lo marcado **[OFICIAL]** sale de policy pages / docs de Meta, TikTok, FTC o la UE. Lo marcado **[SECUNDARIO]** es prensa especializada (no encontré el post oficial de Meta para el label "AI creator"). Lo marcado **[NO DOCUMENTADO]** no existe como regla publicada — es patrón observado, y así hay que tratarlo: como riesgo, no como norma.

---

## 0. Los 5 hallazgos que cambian la decisión

1. **Ya NO hace falta Página de Facebook para publicar en IG por API.** La *Instagram API with Instagram Login* (lanzada jul-2024) publica fotos, videos, reels, carruseles y stories con token directo de la cuenta profesional. **[OFICIAL]**
2. **Si la app sirve solo a cuentas que vos manejás → Standard Access, SIN App Review.** El App Review + Business Verification recién se exige para "Tech Provider" que sirve a terceros. Esto destraba a Sergio hoy, no en 3 semanas. **[OFICIAL]**
3. **TikTok tiene campo nativo de disclosure IA en la API: `is_aigc`.** Se puede automatizar y quedar compliant en el mismo request. En Instagram **no encontré campo equivalente** en Content Publishing → el disclosure en IG hay que resolverlo por label de cuenta + metadata C2PA + copy.
4. **Instagram lanzó el label "AI creator" a nivel de perfil (mayo 2026), opt-in.** Es exactamente el encaje de Lucía. **[SECUNDARIO]**
5. **Bolivia NO está en el Creator Rewards Program de TikTok** (US, UK, DE, JP, KR, FR, MX, BR). La monetización de Lucía NO puede depender de payouts de plataforma: tiene que ser tráfico a producto propio (DentalGest, webs, cursos).

---

## 1. Requisitos reales de alta

### Instagram
| Ítem | Regla | Fuente |
|---|---|---|
| Edad | 13+ (varía por región) | [help.instagram.com/517920941588885](https://help.instagram.com/517920941588885) **[OFICIAL]** |
| Contacto | Email **o** teléfono. Regla textual: podés borrar uno "mientras tengas al menos un móvil o email confirmado" → **email solo alcanza** | [help.instagram.com/574047304429005](https://help.instagram.com/574047304429005/) **[OFICIAL]** |
| Username | First-come, first-served, no reservable | [help.instagram.com/229252147229436](https://help.instagram.com/229252147229436) **[OFICIAL]** |
| Cuentas múltiples | La app permite varias sesiones simultáneas; el límite duro no está publicado como policy | — |
| Verificación de identidad | Si te marcan, piden **ID con foto y fecha de nacimiento** (licencia, pasaporte, cédula) — y en muchos casos **video selfie** | [help.instagram.com/271237319690904](https://help.instagram.com/271237319690904) **[OFICIAL]** |

**El punto crítico para una persona virtual:** el video-selfie. Hay caso documentado de una cuenta de influencer IA, **etiquetada como IA en el username y categoría Digital Creator**, permanentemente deshabilitada por "fraud and deception" tras el selfie de verificación, sin apelación efectiva ([BlackHatWorld, caso reportado](https://www.blackhatworld.com/seo/instagram-perma-disabled-my-ai-influencer-account-ai-clearly-labeled-after-selfie-verification-no-further-appeal-any-help-is-appreciated.1796667/)) **[SECUNDARIO]**. Ninguna cara generada pasa un liveness check. Esto es el riesgo #1 del proyecto y no tiene workaround limpio: se mitiga no disparando el trigger (ver §3).

### TikTok
| Ítem | Regla | Fuente |
|---|---|---|
| Edad | 13+ (18+ para monetización) | [tiktok.com/community-guidelines](https://www.tiktok.com/community-guidelines/en) **[OFICIAL]** |
| Contacto | Teléfono **o** email; para reusar un número/email hay que borrarlo de la cuenta anterior primero | [support.tiktok.com — email and phone](https://support.tiktok.com/en/log-in-troubleshoot/log-in/email-and-phone-number) **[OFICIAL]** |
| Creación en bloque | **Explícitamente prohibida** por automatización | [tiktok.com/transparency — countering deceptive behavior](https://www.tiktok.com/transparency/en-us/countering-influence-operations/) **[OFICIAL]** |

### ¿Sirve VoIP? ¿Un número por cuenta?
**[NO DOCUMENTADO]** — Ni Meta ni TikTok publican una policy de "prohibido VoIP". Lo que sí está publicado y es lo que importa: Instagram prohíbe "crear cuentas por medios automatizados sin permiso expreso" y "comprar, vender o transferir cualquier aspecto de tu cuenta" ([Terms of Use](https://help.instagram.com/termsofuse)) **[OFICIAL]**; TikTok prohíbe "usar automatización para registrar u operar cuentas en bloque" **[OFICIAL]**.

Recomendación honesta para ONIA: **no armar el problema**. Un email real por modelo (Zoho catch-all ya lo tienen), y un número real móvil por modelo solo cuando la plataforma lo exija (IG deja arrancar con email). Los servicios de SMS descartables y los pools VoIP son exactamente la señal que alimenta el clustering antifraude.

---

## 2. Políticas de IA — ¿está permitido un personaje IA que promociona un producto?

### Respuesta corta
**Sí, en ambas plataformas, con tres condiciones:** (a) que el contenido realista esté etiquetado como IA, (b) que no suplante a una persona real, (c) que el vínculo comercial esté declarado con la herramienta nativa de la plataforma. Lo que está prohibido no es "ser IA", es **engañar**.

### Meta / Instagram **[OFICIAL]**
- **Label "AI info"**: Meta etiqueta contenido cuando detecta indicadores estándar de IA (**C2PA**) o cuando el creador lo declara. Existe desde may-2024. → [transparency.meta.com — Labeling AI Content](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/) · [about.fb.com — enfoque de etiquetado](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/)
- **Label "AI creator" (perfil)**: rollout mayo 2026, **opt-in**, aparece bajo el username en el perfil y en cada post; cuando aplican los dos, "AI info" tiene precedencia. Dirigido a cuentas que usan generativa de forma regular. → [netinfluencer](https://www.netinfluencer.com/instagram-launches-ai-creator-labels-to-flag-accounts-that-regularly-use-ai-generated-content/) · [MediaPost 05/06/2026](https://www.mediapost.com/publications/article/414862/instagram-unveils-new-ai-creator-account-label.html) **[SECUNDARIO]**
- **Ads**: Meta exige disclosure de IA en anuncios (obligatorio desde 2026); las herramientas generativas de Ads Manager y los assets con metadata C2PA de terceros (Photoshop, DALL·E, Canva) llevan label automático. → [about.fb.com — GenAI transparency in ads](https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/) **[OFICIAL]**
- **Lo prohibido**: suplantación — "usar imagen, nombre o semejanza de otro con el fin de engañar" y "hablar con la voz de otra persona". → [Authentic Identity Representation](https://transparency.meta.com/policies/community-standards/authentic-identity-representation/) **[OFICIAL]**

> **Tensión que hay que conocer.** Ese mismo standard lista entre las causales de restricción: *"crear una cuenta que representa una entidad no humana, como un negocio, mascota o personaje ficticio"*, y dice aplicar a "Facebook, Instagram y Threads". Pero el párrafo que lo enmarca es explícitamente de Facebook ("On Facebook, we require people to create one account using the name they go by in everyday life"), Instagram no tiene política de nombre real, y Meta verifica cuentas de mascotas y publicaciones ([verificación IG](https://about.instagram.com/blog/announcements/understanding-verification-on-instagram)). **Lectura operativa:** una persona virtual en IG es viable como **cuenta profesional (Creator)**, no como perfil personal disfrazado de humano real. No es zona 100% blanca — es la zona donde vive todo el mercado de AI influencers, con riesgo residual real (ver el caso del §1).

### TikTok **[OFICIAL]**
- **Obligación de etiquetar**: hay que declarar el contenido "completamente generado o significativamente editado por IA" cuando muestra **personas o escenas realistas**. La etiqueta se lee *"creator labeled as AI-generated"*. → [Newsroom TikTok — new labels for disclosing AIGC](https://newsroom.tiktok.com/en-us/new-labels-for-disclosing-ai-generated-content) · [Integrity and Authenticity](https://www.tiktok.com/community-guidelines/en/integrity-authenticity)
- **Auto-label por C2PA**: TikTok lee Content Credentials y etiqueta aunque el creador no lo declare. → [TikTok Transparency — responsible AIGC](https://www.tiktok.com/transparency/en/supporting-responsible-transparent-ai-generated-content/)
- **Sin castigo de alcance**: "activar el setting de AIGC no afecta la distribución de tu video mientras no viole las Community Guidelines".
- **Prohibido aun estando etiquetado**: fuentes autoritativas falsas, eventos de crisis, y **mostrar falsamente a figuras públicas haciendo un endorsement o siendo endorsadas**. Y personas privadas realistas sin consentimiento.
- Exento: IA en texto/guion/hashtags.

### Regulación fuera de plataforma
- **FTC (EE.UU.)** — los Endorsement Guides de 2023 **incorporan expresamente a los influencers virtuales** ("computer-generated fictional characters") a la definición de endorser: si hay conexión material con la marca, hay que declararla. → [FTC — Endorsements, Influencers and Reviews](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews) · [comunicado revisión 2023](https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements) **[OFICIAL]**
- **UE — AI Act art. 50**, aplicable **2 de agosto de 2026**: quien despliega IA para crear deepfakes debe declararlo al primer contacto, de forma clara; los proveedores de generativa deben marcar los outputs en formato legible por máquina. Aplica si se dirige contenido a usuarios de la UE. → [Comisión Europea — FAQ art. 50](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act) · [texto art. 50](https://artificialintelligenceact.eu/article/50/) **[OFICIAL]**
- Bolivia: sin norma específica de disclosure de IA al día de hoy. La exposición real de ONIA es FTC (si vende cursos a EE.UU.) y AI Act (si el contenido apunta a la UE).

---

## 3. Qué hace que baneen una cuenta así

Ordenado por riesgo real para el caso de ONIA:

| # | Patrón | Estado | Fuente |
|---|---|---|---|
| 1 | **Video-selfie / liveness verification** — una cara generada no pasa; deriva en disable por "fraud and deception" | Documentado en la práctica, no como policy | caso BHW **[SECUNDARIO]** + [tipos de ID que IG acepta](https://help.instagram.com/271237319690904) **[OFICIAL]** |
| 2 | **Automatización de engagement** (bots de like/follow/comment, pods, growth services) | Prohibido | [Inauthentic Behavior](https://transparency.meta.com/policies/community-standards/inauthentic-behavior/) · [TikTok deceptive behavior](https://www.tiktok.com/transparency/en-us/countering-influence-operations/) **[OFICIAL]** |
| 3 | **Red de cuentas coordinada** — Meta restringe por "close linkage with a network of accounts" y "coordination within a network" | Prohibido | [Account Integrity](https://transparency.meta.com/policies/community-standards/account-integrity-and-authentic-identity/) **[OFICIAL]** |
| 4 | **Creación de cuentas por medios automatizados** / compra-venta-transferencia de cuentas | Prohibido | [IG Terms of Use](https://help.instagram.com/termsofuse) · TikTok bulk registration **[OFICIAL]** |
| 5 | **Compra de seguidores / fake engagement** — TikTok bloqueó >2.000 M de cuentas spam y >54.000 M de likes falsos en 2024 | Prohibido | [TikTok Transparency](https://www.tiktok.com/transparency/en-us/countering-influence-operations/) **[OFICIAL]** |
| 6 | **Contenido no original / templated** — pierde recomendaciones; se recupera con 30 días de contenido original | Penalización de alcance | [Original Content Guidelines](https://creators.instagram.com/original-content-guidelines) **[OFICIAL]** |
| 7 | **Evasión de enforcement** (cuenta nueva tras un baneo) | Prohibido, dispara disable | [Account Integrity](https://transparency.meta.com/policies/community-standards/account-integrity-and-authentic-identity/) **[OFICIAL]** |
| 8 | Múltiples cuentas por dispositivo / IP compartida / proxies | **[NO DOCUMENTADO]** como policy — pero alimenta directamente el clustering del punto 3 | — |

**Nota sobre "granja de celulares":** el modelo de N chips + N celulares no está prohibido *per se* en ninguna policy publicada. Lo que sí está prohibido y es lo que las plataformas realmente detectan es la **señal de coordinación**: mismo fingerprint, mismos horarios, mismos patrones de escritura, cross-following entre las cuentas del pool, y sobre todo **engagement recíproco entre las modelos**. Una granja de contenido con publicación honesta (una cuenta, una identidad declarada como IA, contenido propio) es distinta de una granja de engagement. La segunda es la que muere.

**Números de actividad manual que circulan como límite** (60 follows / 150 likes / 20 comments por hora) son **[NO DOCUMENTADO]** — Instagram nunca publicó esas cifras. Tratarlos como orden de magnitud, no como regla.

---

## 4. Monetización y publicidad

### ¿Puede un personaje IA hacer publicidad/afiliación? Sí.
- **TikTok** — Branded Content permitido: hay que activar el **Commercial Content Disclosure toggle** al publicar. Dos modos: *Your Brand* (aparece "Promotional content") y *Branded Content* (aparece "Paid partnership"). Si no se declara, **el video queda inelegible para el For You Feed** — te avisan y tenés 24 h para corregir. Activarlo **no afecta** la recomendación. → [Branded Content Policy](https://www.tiktok.com/legal/page/global/bc-policy/en) · [Commercial Content Disclosure para creadores](https://ads.tiktok.com/help/article/about-the-content-disclosure-setting-for-creators) **[OFICIAL]**
- **Instagram/Meta** — hay que usar la herramienta **Paid Partnership label** y cumplir "todas las leyes aplicables, incluyendo las disclosures necesarias para indicar la naturaleza comercial del contenido". → [Branded Content Policies IG](https://help.instagram.com/1695974997209192) · [Branded Content — Advertising Standards](https://transparency.meta.com/policies/ad-standards/product-format-specific-policies/branded-content/) **[OFICIAL]**

### Dos frenos concretos para ONIA
1. **Regla IG de branded content**: un creador *"no puede aceptar nada de valor por publicar contenido que no lo presente a él mismo o en cuya creación no participó"* ([política IG de branded content](https://help.instagram.com/1695974997209192)) **[OFICIAL]**. Lucía promocionando **producto propio de ONIA** no toca esta regla (es contenido de marca propia, `brand_organic` / "Your Brand"). Lucía cobrando de un tercero para promocionar producto de tercero **sí** entra en zona gris. → *Lucía debe vender ONIA, no alquilarse a terceros.*
2. **Creator Rewards de TikTok no está en Bolivia** (US, UK, DE, JP, KR, FR, MX, BR; 10k seguidores + 100k views/30d; **cuenta personal**, 18+; excluye Business Accounts) → [TikTok Creator Academy — eligibility](https://www.tiktok.com/creator-academy/article/eligibility) **[OFICIAL]**. Además el contenido "no original o con mínimo aporte propio" queda inelegible.

**Conclusión de monetización:** el ingreso de Lucía es **tráfico a producto ONIA + cursos**, no payout de plataforma. Eso además elimina el conflicto de branded content de terceros y hace irrelevante la geografía del programa de recompensas.

---

## 5. Publicación por API — estado real

### Instagram — Content Publishing API **[OFICIAL]**
- **Dos configuraciones**: *Instagram API with Instagram Login* (cuenta Business/Creator **sin Página de Facebook**) e *Instagram API with Facebook Login* (requiere Página). **Ambas publican.** → [Overview](https://developers.facebook.com/docs/instagram-platform/overview/)
- **Cuenta**: obligatoria **profesional** (Business o Creator). Personal no accede.
- **Permisos**: `instagram_business_basic` + `instagram_business_content_publish` (Instagram Login) · `instagram_basic` + `instagram_content_publish` + `pages_read_engagement` (Facebook Login). → [Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- **App Review**: *"no se requiere si tu app sirve solo a un negocio que vos poseés o administrás, con Standard Access"*. Advanced Access + App Review + Business Verification se exige al servir a terceros. → [App Review](https://developers.facebook.com/docs/instagram-platform/app-review/)
- **Límite**: **100 posts publicados por API cada 24 h** por cuenta (el carrusel cuenta como 1). Chequeable en `content_publishing_limit`.
- **Formatos**: imagen (solo **JPEG**), video, Reels, Stories, carrusel (hasta 10). Sin filtros, sin shopping tags. El media debe estar en un servidor público al momento de publicar.
- **Tiempos**: Business Verification ~48 h a 3 días hábiles ([Meta Business Help](https://www.facebook.com/business/help/1095661473946872)); App Review es variable y hay reportes de semanas en el foro de developers. **Si ONIA se queda en Standard Access sobre sus propias cuentas, esto no aplica.**
- **Documentos de Business Verification** (por si escalan a Advanced): NIT/tax ID, prueba de identidad y documento de constitución con la razón social. → [documentos requeridos](https://www.facebook.com/business/help/193400874040813)
- ⚠️ **No encontré un campo de disclosure de IA en la API de publicación de IG.** Ausencia de evidencia, no evidencia de ausencia — pero planificar el disclosure por otra vía (label de perfil + C2PA en el archivo + copy).

### TikTok — Content Posting API **[OFICIAL]**
- **App registrada** en TikTok for Developers + producto *Content Posting API* + configuración **Direct Post** habilitada. Scope obligatorio: **`video.publish`** (requiere aprobación del scope + autorización del usuario). → [Get started](https://developers.tiktok.com/doc/content-posting-api-get-started/)
- **Sin auditoría (unaudited client)**: todo lo posteado queda **SELF_ONLY**, las cuentas deben estar en privado al postear, y **máximo 5 usuarios posteando en 24 h**. Es decir: **sin audit no hay publicación pública. Punto.** → [rate limits](https://developers.tiktok.com/doc/tiktok-api-v2-rate-limit)
- **Con auditoría**: se levanta la restricción de visibilidad; sigue habiendo un cap diario de creadores activos por cliente, dimensionado según lo declarado en el formulario de audit.
- **Rate limit**: **6 requests/minuto por access_token**. Errores relevantes: `spam_risk_too_many_posts` (cap diario del usuario), `reached_active_user_cap` (cap del cliente), `unaudited_client_can_only_post_to_private_accounts`.
- **Campos de `post_info`** (Direct Post): `title`, `privacy_level`, `disable_duet/stitch/comment`, `video_cover_timestamp_ms`, y los tres que importan acá → **`is_aigc`** ("set to true if the video is AI generated content"), **`brand_content_toggle`** (paid partnership), **`brand_organic_toggle`** (marca propia). → [Direct Post reference](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post)
- **Requisitos de UX que audita TikTok** (no son opcionales, el audit los mira): consultar `creator_info` antes de postear y mostrar el nickname; bloquear si el creador llegó a su cap diario; **privacy_level sin valor por defecto**; checkboxes de interacción sin marcar por defecto; preview obligatorio antes de subir; consentimiento expreso del usuario; sin watermarks promocionales; y la leyenda antes del botón de publicar: *"By posting, you agree to TikTok's Music Usage Confirmation"* (o + Branded Content Policy si aplica). → [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines)

> **Implicancia para la "granja de N modelos":** TikTok pone un cap de **creadores activos por client**, no por cuenta. Escalar a 5-10 modelos con una sola app auditada obliga a declarar ese volumen en el formulario de audit desde el arranque. Instagram, en cambio, es 100 posts/24h **por cuenta** y sin App Review si son cuentas propias → **Instagram escala más barato que TikTok en el modelo de ONIA.**

---

## 6. CHECKLIST OPERATIVO — Lucía bien montada y publicando

### Fase 0 — Identidad y disclosure (antes de tocar código)
- [ ] **Decidir y escribir la política de disclosure de ONIA** en una línea, y respetarla en las N modelos: "personaje digital creado con IA por ONIA". Ya está alineado con la memoria [[lucia-influencer-posicionamiento]] ("es IA no se esconde") — formalizarlo.
- [ ] Bio de @lu.antelo con la declaración explícita ("Personaje digital / IA · creado por ONIA") + link a producto.
- [ ] **Nunca** usar nombre, cara, voz o semejanza de una persona real identificable, ni testimonios atribuidos a humanos, ni figuras públicas endorsando. Es la única línea que cierra cuentas por policy escrita.

### Fase 1 — Cuenta Instagram
- [ ] Alta con **email dedicado de Zoho** (no hace falta teléfono para arrancar).
- [ ] Convertir a **cuenta profesional → Creator** (requisito duro de la API).
- [ ] Activar el **label "AI creator"** en Configuración del perfil (opt-in, mayo 2026). Es el escudo reputacional y regulatorio más barato que existe.
- [ ] Publicar 3-5 posts orgánicos **a mano** antes de conectar nada automático (histórico de comportamiento humano).
- [ ] **NO** comprar seguidores, no usar pods, no automatizar likes/follows/comentarios. Nunca. Ni una vez.
- [ ] **NO** hacer que las modelos de ONIA se sigan/comenten entre ellas.
- [ ] Preparar plan B para el video-selfie: si IG lo pide, la cuenta probablemente se pierde. Mitigación: **backup completo del contenido**, username secundario reservado, y no concentrar todo el funnel comercial en una sola cuenta.

### Fase 2 — Cuenta TikTok
- [ ] Alta con email dedicado (teléfono solo si lo exige). **Cuenta personal**, no Business, si algún día se quiere monetización nativa.
- [ ] Etiquetar como IA **cada** video realista (in-app: setting de AI-generated content; por API: `is_aigc: true`).
- [ ] Activar Commercial Content Disclosure → **"Your Brand"** cuando promociona DentalGest/webs/cursos de ONIA.

### Fase 3 — Publicación por API (el desbloqueo real)
**Instagram — ruta corta, sin App Review:**
- [ ] Crear app en Meta for Developers, producto **Instagram** con **Instagram Login**.
- [ ] Pedir `instagram_business_basic` + `instagram_business_content_publish` en **Standard Access**.
- [ ] Agregar la cuenta de Lucía como cuenta propia/con rol en la app → publicar sin review.
- [ ] Alojar el media en URL pública (el VPS 187.77.16.63 ya sirve). **Imágenes en JPEG obligatorio.**
- [ ] Guardar el token como **credencial n8n Header Auth** (regla del proyecto: nada de `$env` en el plan VPS).
- [ ] Monitorear `content_publishing_limit` (tope 100/24 h) — ponerle un guard en el workflow.
- [ ] Solo escalar a Advanced Access + Business Verification (NIT + constitución + ID) si algún día ONIA publica para cuentas de clientes.

**TikTok — ruta larga, empezar YA porque el audit es el cuello de botella:**
- [ ] Registrar app, agregar Content Posting API, habilitar **Direct Post**, solicitar `video.publish`.
- [ ] **Presentar el audit** declarando el volumen real proyectado (N modelos × posts/día) — el cap de creadores activos sale de ahí.
- [ ] Construir la UI de publicación cumpliendo las Content Sharing Guidelines (preview, privacy sin default, `creator_info` previo, leyenda de Music Usage). Sin esto no se aprueba el audit.
- [ ] Hasta que apruebe: **publicación manual en TikTok**. No perder tiempo peleando el modo SELF_ONLY.
- [ ] Respetar 6 req/min por token y manejar `spam_risk_too_many_posts` / `reached_active_user_cap` con backoff (mismo patrón que ya usa `ver-videos`).

### Fase 4 — Escala a varias modelos (la "granja")
- [ ] **Un email + una identidad + una historia por modelo.** Nada compartido salvo la infraestructura de publicación.
- [ ] Cero interacción cruzada entre cuentas de ONIA (es la señal #1 de red coordinada).
- [ ] Contenido genuinamente distinto por modelo — la regla de Original Content de IG castiga lo templated y el 30-day recovery window es real.
- [ ] Registrar en el panel ONIA Center: cuenta, credencial, cap diario, estado de audit, último post. Un solo lugar de control (ya es el patrón de los 11 agentes vivos).
- [ ] **[NO DOCUMENTADO pero prudente]** salida de red estable y separada por cuenta; evitar rotación agresiva de IP, que se parece más a evasión que a operación normal.

### Fase 5 — Cursos (el producto que Sergio quiere vender)
- [ ] El curso puede enseñar **todo esto** sin problema: no hay policy que prohíba enseñar a crear personajes IA declarados.
- [ ] **No** enseñar ni vender: compra de seguidores, bots de engagement, evasión de baneos, granjas de cuentas automatizadas. Eso sí es violación explícita de ambas plataformas y, si el curso lo promete, expone a ONIA por facilitación.
- [ ] Si se vende a EE.UU.: cumplir FTC (disclosure de conexión material en todo contenido promocional de Lucía). Si a la UE: prever AI Act art. 50 desde **2-ago-2026**.

---

## 7. Lo que NO pude verificar (para que nadie lo dé por cierto)
- El post oficial de Meta/Instagram anunciando el label **"AI creator"** — solo prensa secundaria coincidente (MediaPost, netinfluencer, Engadget). Confirmar en la app antes de basar comunicación en eso.
- **Campo de disclosure de IA en la Instagram Content Publishing API** — no aparece en la doc; asumir que no existe hasta ver lo contrario.
- **Límite oficial de cuentas por dispositivo/IP** en IG y TikTok — no publicado por ninguna de las dos.
- **Política sobre números VoIP** — no publicada por ninguna de las dos.
- Los "límites de actividad por hora" de Instagram (60/150/20) que repite la prensa — **sin fuente oficial**.
- Tiempo real de aprobación del **audit de TikTok Content Posting API** — no publicado.

---

## Fuentes

**Meta / Instagram (oficial)**
- [Labeling AI Content — Transparency Center](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/)
- [Meta's Approach to Labeling AI-Generated Content and Manipulated Media](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/)
- [Expanding GenAI Transparency for Meta's Ads Products](https://about.fb.com/news/2025/02/gen-ai-transparency-metas-ads-products/)
- [Authentic Identity Representation](https://transparency.meta.com/policies/community-standards/authentic-identity-representation/)
- [Inauthentic Behavior](https://transparency.meta.com/policies/community-standards/inauthentic-behavior/)
- [Account Integrity and Authentic Identity](https://transparency.meta.com/policies/community-standards/account-integrity-and-authentic-identity/)
- [Branded Content — Advertising Standards](https://transparency.meta.com/policies/ad-standards/product-format-specific-policies/branded-content/)
- [Branded Content Policies (IG)](https://help.instagram.com/1695974997209192) · [Instagram Content Monetization Policies](https://help.instagram.com/2635536099905516)
- [Original Content Guidelines](https://creators.instagram.com/original-content-guidelines)
- [Instagram Terms of Use](https://help.instagram.com/termsofuse) · [Cómo IG usa tu teléfono/email](https://help.instagram.com/574047304429005/) · [Tipos de ID aceptados](https://help.instagram.com/271237319690904) · [Edad mínima](https://help.instagram.com/517920941588885) · [Username](https://help.instagram.com/229252147229436)
- [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview/) · [Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing) · [App Review](https://developers.facebook.com/docs/instagram-platform/app-review/) · [Business Verification](https://www.facebook.com/business/help/1095661473946872) · [Documentos requeridos](https://www.facebook.com/business/help/193400874040813)

**TikTok (oficial)**
- [Integrity and Authenticity — Community Guidelines](https://www.tiktok.com/community-guidelines/en/integrity-authenticity)
- [New labels for disclosing AI-generated content](https://newsroom.tiktok.com/en-us/new-labels-for-disclosing-ai-generated-content)
- [Supporting responsible, transparent AIGC](https://www.tiktok.com/transparency/en/supporting-responsible-transparent-ai-generated-content/)
- [Countering deceptive behavior](https://www.tiktok.com/transparency/en-us/countering-influence-operations/)
- [Branded Content Policy](https://www.tiktok.com/legal/page/global/bc-policy/en) · [Commercial Content Disclosure (creadores)](https://ads.tiktok.com/help/article/about-the-content-disclosure-setting-for-creators)
- [Creator Rewards Program — eligibility](https://www.tiktok.com/creator-academy/article/eligibility)
- [Content Posting API — Get Started](https://developers.tiktok.com/doc/content-posting-api-get-started/) · [Direct Post reference](https://developers.tiktok.com/doc/content-posting-api-reference-direct-post) · [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines) · [Rate Limits](https://developers.tiktok.com/doc/tiktok-api-v2-rate-limit) · [Email and phone](https://support.tiktok.com/en/log-in-troubleshoot/log-in/email-and-phone-number)

**Regulación**
- [FTC — Endorsements, Influencers, and Reviews](https://www.ftc.gov/business-guidance/advertising-marketing/endorsements-influencers-reviews) · [FTC — Endorsement Guides revisadas 2023](https://www.ftc.gov/news-events/news/press-releases/2023/06/federal-trade-commission-announces-updated-advertising-guides-combat-deceptive-reviews-endorsements)
- [Comisión Europea — Transparency obligations under Article 50 AI Act](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act) · [AI Act Article 50](https://artificialintelligenceact.eu/article/50/)

**Secundarias**
- [MediaPost — Instagram Unveils New 'AI Creator' Account Label (05/06/2026)](https://www.mediapost.com/publications/article/414862/instagram-unveils-new-ai-creator-account-label.html) · [netinfluencer — Instagram Launches 'AI Creator' Labels](https://www.netinfluencer.com/instagram-launches-ai-creator-labels-to-flag-accounts-that-regularly-use-ai-generated-content/) · [Engadget — Instagram tests optional 'AI creator' labels](https://www.engadget.com/2162426/instagram-is-testing-optional-ai-creator-labels/)
- [Caso reportado: cuenta de AI influencer deshabilitada tras selfie verification](https://www.blackhatworld.com/seo/instagram-perma-disabled-my-ai-influencer-account-ai-clearly-labeled-after-selfie-verification-no-further-appeal-any-help-is-appreciated.1796667/)

---

# Anexo B — Granja / multi-cuenta

# Granjas de contenido y operación multi-cuenta: qué es real, qué te banea, y qué arquitectura le sirve a ONIA

**Fecha de investigación:** 2026-07-25 · **Todos los precios son los publicados a julio 2026.**

> **Advertencia de sesgo de fuentes (importante):** buena parte de la información sobre device farms, cloud phones, antidetect browsers y proxies proviene de **blogs de los propios vendedores** (GeeLark, GoLogin, Multilogin, AdsPower, Octo Browser). Son marketing, no evidencia independiente. Donde una cifra viene de un vendedor lo marco como `[vendor]`. Las políticas de plataforma vienen de fuentes primarias (Meta Transparency Center, docs de Meta/TikTok, gov.uk, FTC, EU AI Act) y esas sí son confiables.

---

## 0. Veredicto en 6 líneas (leé esto aunque no leas el resto)

1. **Una "granja de contenido" es una arquitectura de EVASIÓN, no de escala.** Existe para operar cuentas que la plataforma no te dejaría operar de otra forma: cuentas que fingen ser personas distintas, en dispositivos distintos, en países distintos.
2. **ONIA no necesita nada de eso**, porque sus personas virtuales van a ser **marcas propias declaradas como IA**. Marcas propias = cuentas profesionales legítimas = **API oficial**. Meta y TikTok tienen productos *diseñados* para gestionar decenas de cuentas de marca desde un solo lugar.
3. **Lo que te banea no es "tener varias cuentas".** Es: fingir ser personas reales, engagement falso/bots, evadir enforcement, y redes coordinadas que ocultan quién está detrás.
4. **El riesgo de la granja es de contagio:** si compartís device fingerprint / IP / teléfono / patrón de email entre cuentas y una cae, arrastra a las demás (chain ban). Perdés 5 activos por el error de 1.
5. **Costo real:** granja ≈ **USD 150-250/mes recurrente + USD 250-1.500 upfront + trabajo manual humano** y riesgo de pérdida total. Arquitectura por API oficial para 3-5 personas ≈ **USD 0-70/mes** sobre la infra que ONIA ya tiene (VPS + n8n).
6. **Para el curso: enseñar granjas es enseñar a violar ToS y, en UK, algo que están tipificando como delito.** El curso vendible y defendible es otro (§7).

---

## 1. Cómo funcionan realmente las granjas de contenido

Hay cuatro capas, y casi nadie usa una sola.

### 1.1 Device farms físicas (celulares + chips)

Racks de teléfonos Android baratos, cada uno con su SIM, operados con USB hubs / ADB / scripts, a veces con brazos robóticos o con humanos "clickers".

**Costos declarados** `[vendor: GeeLark]`:

| Escala | Upfront | Incluye |
|---|---|---|
| 10 teléfonos | USD 500 – 5.000 | Teléfonos, cables, cargadores, red |
| 50 teléfonos | USD 2.500 – 17.500 | Devices, racks, energía, cooling, reemplazos |
| 100 teléfonos | USD 5.000 – 35.000+ | Hardware, espacio, mantenimiento, energía |

Costos ocultos que el propio artículo admite: electricidad, desgaste de batería, fallas de dispositivo, mano de obra de mantenimiento, racks/hubs/cooling.
Fuente: https://www.geelark.com/blog/phone-farm-vs-cloud-phone-complete-cost-comparison/

**Por qué la gente lo hace igual:** TikTok en particular detecta emuladores con bastante fiabilidad, así que los operadores serios insisten en hardware real con SIM local y IP de carrier real `[vendor]`. Fuente: https://www.tokportal.com/vs/real-device-vs-emulator-tiktok-accounts

**El problema legal nuevo:** el Reino Unido va a **prohibir los dispositivos con 5 o más SIMs físicas** destinados a llamadas/SMS, con **multa ilimitada**. Los dispositivos solo-datos quedan exentos, y hay defensas para broadcast, transporte, telcos, emergencias y Corona. No es exactamente una "phone farm" de contenido, pero marca la dirección regulatoria: la infraestructura multi-SIM está entrando en el radar penal.
Fuente primaria: https://www.gov.uk/government/consultations/preventing-the-use-of-sim-farms-for-fraud/outcome/preventing-the-use-of-sim-farms-for-fraud-government-response-accessible

### 1.2 Cloud phones (GeeLark, y similares)

Teléfonos Android virtualizados en la nube, cada perfil con su fingerprint de dispositivo y su proxy. Reemplazan el rack físico.

**GeeLark, precios oficiales** (página de pricing, julio 2026):
- Free: 2 perfiles + 30 minutos de regalo
- Base: desde **USD 5/mes** (5–1.000 perfiles según tier), API, ADB, roles
- Pro: desde **USD 19/mes** (20–50.000 perfiles), creación masiva, clonado de perfiles, sincronizador, AIGC
- Custom: 10.000+ perfiles, a cotizar
- **Uso del teléfono cloud: USD 0,007/minuto**, tope USD 1,20/día por device
- **Renta mensual: USD 29,90 por device/mes**
- **"Parallels" (slots activos reutilizables): USD 39,90/parallel/mes**
- Add-on de tiempo: desde USD 14 por 2.000 minutos

Fuentes: https://www.geelark.com/pricing/ · https://influencermarketinghub.com/geelark/

Traducido: **5 personas virtuales con teléfono cloud rentado = ~USD 150/mes solo en devices**, sin contar proxies ni el software de gestión.

### 1.3 Navegadores anti-detect

Falsifican el fingerprint del navegador (canvas, WebGL, fuentes, timezone, user-agent) para que cada perfil parezca una máquina distinta. Precios 2026 (recopilados de comparativas de la propia industria, `[vendor]`):

| Herramienta | Precio de entrada | Escala |
|---|---|---|
| AdsPower | Free / ~USD 9/mes por 10 perfiles | ~USD 50/mes por 100 perfiles |
| Dolphin Anty | 10 perfiles gratis sin límite de tiempo; desde ~€8/mes por 20 | hasta ~€252/mes por 1.000 |
| GoLogin | desde ~USD 24/mes | — |
| Multilogin X | plan gratuito nuevo en 2026; pagos desde ~USD 7,08/mes; tiers hasta €159 por 300 perfiles | — |

Fuentes: https://www.adspower.com/blog/multilogin-vs-dolphin-anty · https://blog.octobrowser.net/top-8-anti-detect-browsers · https://www.scrapingbee.com/blog/anti-detect-browser/ · https://gologin.com/blog/geelark-review/

### 1.4 Proxies móviles (4G/5G)

La capa que más importa y la que más se subestima. Instagram/TikTok confían por defecto en IPs de carrier móvil; una IP de datacenter grita "bot".

Rangos 2026 `[vendor]`:
- Dedicado por proxy/mes: **USD 15 – 30/mes** típico
- ProxyLTE tier "Private" (dedicado, mínimo 25 proxies): ~USD 275/mes por bloque
- Por GB: USD 7–10/GB en planes de entrada; bajo USD 2,50/GB en volumen
- SOAX: desde USD 90/mes por 25 GB

Fuentes: https://dataimpulse.com/blog/best-mobile-proxies/ · https://spyderproxy.com/blog/best-mobile-proxy-providers · https://proxyempire.io/pricing-table/

**Costo realista de una granja de 5 personas virtuales, bien hecha:**

| Ítem | Mensual |
|---|---|
| 5 cloud phones (GeeLark rental) | ~USD 150 |
| 5 proxies móviles dedicados | USD 75 – 150 |
| Antidetect (si además hay web) | USD 9 – 50 |
| Chips/SIM Bolivia (si es hardware real) | USD 25 – 50 |
| **Total recurrente** | **USD 260 – 400/mes** |
| Upfront si es hardware físico | USD 250 – 1.500 |
| Mano de obra humana operando perfiles | no automatizable del todo |

Y todo eso **sin publicar un solo video más** que el que ONIA puede publicar por API oficial gratis.

---

## 2. Qué está PERMITIDO vs qué te BANEA (fuentes primarias)

Esta es la sección que más gente se saltea y por la que más gente pierde cuentas.

### 2.1 Está EXPLÍCITAMENTE permitido: gestionar muchas cuentas de MARCA

**Meta Business Portfolio (ex Business Manager):**
- Un portfolio puede contener **hasta 200 Páginas de Facebook**
- Límite típico de **~25 cuentas de Instagram** por portfolio estándar
- Un portfolio nuevo arranca con **2 ad accounts**, y el límite sube con historial de gasto
- **Cada persona puede crear solo 2 portfolios**
Fuentes: https://www.graphed.com/blog/how-many-meta-business-accounts-can-i-have · https://www.mbadv.agency/meta-ads/meta-ads-account-structure

**TikTok Business Center** — producto oficial para agencias:
- Podés agregar advertiser accounts, cuentas TikTok, TikTok One, Shops, pixels, catálogos, audiencias y leads
- Dos niveles de permiso: **"Deliver ads"** (solo publicidad / Spark Ads) y **"Manage account"** (además community management: responder comentarios, DMs, editar perfil)
- **Una agencia puede gestionar cuentas que no le pertenecen**, con autorización del dueño
Fuente primaria: https://ads.tiktok.com/help/article/about-managing-tiktok-accounts-in-business-center?lang=en

**Facebook, cuentas de entidad no-humana:** Meta contempla explícitamente que crees una cuenta que representa una entidad no humana (negocio, mascota, **personaje ficticio**) — pide información adicional antes de actuar, no lo prohíbe de plano. Y las cuentas de parodia/fan son aceptables **si están claramente rotuladas en el nombre y la bio**.
Fuente: https://transparency.meta.com/policies/community-standards/authentic-identity-representation/

**TikTok sobre múltiples cuentas:** "los usuarios pueden tener múltiples cuentas para propósitos como contenido de fans o expresión creativa, pero no pueden usarlas para engañar a otros o violar las reglas."
Fuente: https://www.tiktok.com/creator-academy/article/integrity-authenticity-on-tiktok

**Conclusión de esta sub-sección: 5 personas virtuales de ONIA, declaradas como IA, con cuenta profesional, en un Business Portfolio propio, es un uso 100% dentro de las reglas.** No hace falta esconder nada.

### 2.2 Lo que te BANEA (citas de política)

**Meta — Inauthentic Behavior** (fuente primaria: https://transparency.meta.com/policies/community-standards/inauthentic-behavior/):

> "Inauthentic Behavior refers to a variety of complex forms of deception, performed by a network of inauthentic assets controlled by the same individual or individuals, with the goal of deceiving Meta or our community or to evade enforcement under the Community Standards."

Prohibido explícitamente:
- Crear o usar **assets falsos** (cuentas, Páginas, Grupos) para **engañar sobre la identidad u origen** de la audiencia o de la entidad representada
- Usarlos para **evadir enforcement** de Community Standards
- **Coordinated Inauthentic Behavior (CIB):** formas sofisticadas donde **identidades falsas son centrales a la operación**
- **Foreign Interference:** operadores en un país distinto al de la audiencia objetivo

Meta define CIB como "cualquier red coordinada de cuentas, Páginas y Grupos que depende centralmente de cuentas falsas para engañar a Facebook y a las personas sobre **quién está detrás y qué está haciendo**".

**Leé bien la línea roja:** el problema NO es "muchas cuentas coordinadas". El problema es **muchas cuentas coordinadas que ocultan quién está detrás**. Si ONIA opera 5 personas virtuales y en cada bio dice "personaje IA de ONIA", eso no es CIB. Si opera 5 cuentas que se presentan como 5 chicas cruceñas independientes que casualmente recomiendan DentalGest, **eso sí es CIB de manual**.

**TikTok — Integridad y autenticidad:**
- No permite manipular señales de engagement: **bots, scripts u otros medios** para distribuir contenido o interacciones en masa y **inflar artificialmente vistas, likes, comentarios, shares**
- No permite el **comercio de servicios** que inflan engagement o engañan al sistema de recomendación
- Prohibido **registrar u operar cuentas falsas en masa usando automatización**
- TikTok dice haber prevenido **más de 2.000 millones de cuentas spam** en 2024
Fuentes: https://www.tiktok.com/safety/en/policies-and-engagement/overview · https://newsroom.tiktok.com/en-eu/how-tiktok-counters-deceptive-behaviour

**Instagram Terms of Use:**
> "You can't attempt to create accounts or access or collect information in unauthorized ways."
> "You may not access or collect data from our Products using automated means (without our prior permission)."

Es decir: **crear cuentas de forma automatizada es violación de términos, punto.** Programar y publicar por la Graph API oficial, no.
Fuentes: https://help.instagram.com/740480200552298/ · https://www.spurnow.com/en/blogs/instagram-automated-behaviour

**Etiquetado de IA — ya no es opcional:**
- **TikTok**: exige etiqueta visible en visuales/audio de IA que representen personas o escenas realistas; lee **C2PA Content Credentials** y etiqueta automáticamente aunque no declares. **Deepfakes de personas reales sin etiqueta están prohibidos; media sintética de personas privadas reales está prohibida incluso con etiqueta.** Removió 51.618 videos de media sintética en el 2º semestre 2025 (+340% vs 2024).
  Fuentes: https://www.cinerads.com/blog/tiktok-ai-content-policy · https://www.auditsocials.com/blog/tiktok-ai-content-disclosure-rules-2026
- **Meta**: la etiqueta "AI info" pasó a **obligatoria en anuncios** de Facebook e Instagram en 2026; Meta detecta vía **C2PA** y etiqueta sola. Contenido IA no declarado es causa activa de rechazo de anuncio: 1ª violación mata el anuncio + strike, 2ª en 90 días = hold de 24h, 3ª puede llevar a suspensión.
  Fuentes: https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/ · https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/ · https://commonthreadco.com/blogs/coachs-corner/meta-ai-ad-labels-mandatory-disclosure-ecommerce-2026

**Regulación fuera de plataforma (importa si ONIA vende a clientes de EU/US):**
- **EU AI Act, Artículo 50**: quien despliega un sistema que genera o manipula imagen/audio/video que constituye deepfake **debe divulgar que fue generado artificialmente**. Aplica desde **2 de agosto de 2026** (el Consejo anunció una fecha revisada de 2 de diciembre de 2026 para ciertas obligaciones). Obras evidentemente artísticas/ficcionales tienen una obligación atenuada, pero **no exenta**.
  Fuentes: https://artificialintelligenceact.eu/article/50/ · https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act
- **FTC, 16 CFR Part 465** (vigente desde 21-oct-2024): prohíbe reviews/testimonios que tergiversen ser de **alguien que no existe** — explícitamente incluye **reviews generadas por IA** — o de alguien sin experiencia real con el producto. Multas de hasta **USD 51.744 por violación**.
  Fuentes: https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers · https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465

> **Consecuencia directa para ONIA:** una persona virtual que dice "yo uso DentalGest y me encanta" es, bajo la regla FTC, un **testimonio de alguien que no existe**. Lucía puede *presentar*, *explicar*, *demostrar* — no puede *testimoniar como usuaria*. Esa distinción vale plata.

### 2.3 Riesgo nuevo: penalización de CONTENIDO, no de cuenta

Esto es lo que mata a las granjas modernas, más que el baneo:

- **Instagram, 30-abr-2026** (anuncio de Adam Mosseri): las cuentas que principalmente comparten contenido que no crearon **dejan de ser recomendadas** a no-seguidores. Se extendió de Reels a fotos y carruseles. Reportes indican exclusión de recomendaciones con **10+ reposts en 30 días**. Cambiar la velocidad de un video o poner un screenshot del autor original **no cuenta como transformación**.
  Fuentes: https://www.tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator/ · https://petapixel.com/2026/04/30/new-instagram-policies-target-reposted-content/
- **YouTube, 15-jul-2025**: renombró la política de "repetitious content" a **"inauthentic content"**, apuntando a contenido de mínimo esfuerzo, muy plantillado o reusado en masa. Canales ya en el YPP pueden ser removidos.
  Fuentes: https://www.socialmediatoday.com/news/youtube-clarifies-monetization-update-inauthentic-repeated-content/752892/ · https://support.google.com/youtube/answer/1311392?hl=en

**Traducción brutal:** aunque montes la granja perfecta y ninguna cuenta caiga, si las 5 personas publican variaciones de la misma plantilla, el algoritmo **las deja de distribuir**. Ganás cuentas vivas con cero alcance. Es el peor resultado posible: pagaste la infra y no vendiste nada.

---

## 3. La alternativa profesional: APIs oficiales + gestión multi-marca

### 3.1 Publicar por API oficial

**Instagram** — hay dos caminos y ONIA está mirando el equivocado:

| | Instagram API **con Facebook Login** | Instagram API **con Instagram Login** |
|---|---|---|
| Requiere Página de Facebook | **Sí** | **No** |
| Tipo de cuenta | Professional (Business/Creator) vinculada a Página | Professional (Business/Creator), solo Instagram |
| Content publishing | Sí | **Sí** |

Ambos soportan publicar imágenes, videos, **reels** y carruseles.
Fuente primaria: https://developers.facebook.com/docs/instagram-platform/overview/

**Límite de publicación:** la documentación oficial de Meta hoy dice **"100 API-published posts en una ventana móvil de 24 horas"**, y los carruseles cuentan como un solo post. Muchísimas fuentes de terceros siguen repitiendo el viejo límite de 25 — **hay discrepancia y la doc oficial manda**. Podés consultar el uso actual con el endpoint `IG User Content Publishing Limit`.
Fuente primaria: https://developers.facebook.com/docs/instagram-platform/content-publishing/ · discrepancia documentada en https://www.ayrshare.com/solutions/instagram-graph-api-error-9-the-25-post-daily-limit-how-to-fix-it/

> **Esto destraba el bloqueo actual de ONIA.** Si el problema es que Lucía no tiene Página de Facebook o el flujo con Business Login se trabó: existe el camino **Instagram Login sin Página de Facebook**, y sí publica Reels. El bloqueo es de setup, no de plataforma.

**TikTok Content Posting API** — más duro:
- Requiere **auditoría** separada del alta de developer. Hasta pasarla, **todo post directo sale como `SELF_ONLY`** (solo lo ve el creador)
- La auditoría evalúa caso de uso, UX y cumplimiento de políticas; **rechaza herramientas internas/privadas** (tiene que ser para audiencia amplia)
- Tarda **2–4 semanas** y suele tener varias rondas
- Rate limits: 6 req/min por user token para iniciar posts, 30 req/min para chequear estado
- **~15 posts/día por creador**, compartido entre todos los clientes API que usen Direct Post
Fuentes: https://www.postpeer.dev/blog/best-tiktok-posting-api · https://www.getphyllo.com/post/tiktok-api-rate-limits-in-2026-quotas-errors-workarounds · https://www.netrows.com/blog/tiktok-content-posting-api-guide-2026

> **Ojo con el criterio de auditoría de TikTok:** "no herramientas internas/privadas". Un panel propio de ONIA para publicar sus propias cuentas **puede ser rechazado**. Plan B honesto: publicar TikTok vía una herramienta ya auditada (Metricool, Publer, Blotato, Upload-Post) en lugar de pelear la auditoría propia.

### 3.2 Herramientas de gestión multi-marca — precios y límites reales 2026

| Herramienta | Precio | Cuántas cuentas/marcas | Nota honesta |
|---|---|---|---|
| **Metricool** | Starter €16/mes (5 marcas), €29/mes (10 marcas); Advanced desde €43/mes (15) · en USD: Starter USD 25/mes mensual, Advanced USD 67 (15) / USD 107 (25) / USD 210 (50) | 1 "marca" = 1 negocio, con **1 perfil por red** (1 IG, 1 FB, 1 TikTok, 1 YT, 1 Pinterest, 1 GBP) | **El modelo calza exactamente con "1 persona virtual = 1 marca".** X/Twitter es add-on +USD 5. LinkedIn no está en Starter. ~USD 4,20/marca a los 50. |
| **Publer** | Professional USD 12/mes (3 cuentas), Business USD 21/mes (3 cuentas) | +USD ~4/cuenta extra (Pro), +USD ~7 (Business); cada 10ª cuenta gratis; free plan 3 cuentas | Más barato en volumen chico. Las features de IA son solo Business. |
| **Buffer** | Free 3 canales · Essentials USD 5/canal/mes · Team USD 10/canal/mes | Por canal | Escala lineal, sin descuento. 5 personas × 3 redes = 15 canales = **USD 75/mes**. Caro para este caso. |
| **Later** | Starter USD 25/mes | Modelo de "social set" = 4 perfiles por unidad | — |
| **Hootsuite** | Professional USD 99/mes anual (USD 149 mensual); Team USD 249/mes anual | Por usuario, ~10 cuentas sociales | **Descartado: caro y no aporta nada aquí.** |
| **Blotato** | Starter USD 29/mes (20 cuentas sociales, API completa), Creator USD 97, Agency USD 499 | 20 cuentas ya en el plan base | Muy buena relación cuenta/precio + API para n8n. |
| **Ayrshare** | Premium USD 149/mes (1 perfil); Business desde USD 599/mes (30 perfiles), USD 2,49–8,99 por perfil extra | Escala a 500+ perfiles a ~USD 1,99 c/u | **Sobredimensionado y carísimo para 5 personas.** Es para SaaS que revenden publicación. |
| **Upload-Post** | Free tier | 10+ plataformas | **Integración nativa n8n y Make.** Candidato fuerte para ONIA. |
| **Postiz** (open source) | **Self-hosted gratis**; cloud desde USD 29/mes (5 cuentas) / USD 39 (10 canales, posts ilimitados) | 30+ plataformas | Único totalmente open source. Corre en el VPS que ONIA ya tiene. |
| **Mixpost** | Lite **self-hosted gratis**; Pro licencia one-time sin suscripción | Pagás solo tu servidor | Sin costo recurrente. |

Fuentes: https://socialk.it/en/pricing/metricool · https://schedpilot.com/metricool-pricing-how-much-does-it-really-cost/ · https://socialk.it/en/pricing/publer · https://www.blotato.com/blog/buffer-pricing · https://www.ayrshare.com/pricing/ · https://www.blotato.com/pricing · https://mixpost.app/blog/why-open-source-social-media-management-tools-are-perfect-for-startups · https://www.blotato.com/blog/best-social-media-api-tools · https://prestyj.com/blog/hidden-costs-of-hootsuite-buffer-later-at-scale-2026

### 3.3 n8n + APIs (lo que ONIA ya tiene)

ONIA ya corre n8n self-hosted en el VPS. Costo marginal de publicar por API desde ahí: **USD 0**. La restricción conocida del plan VPS (sin `$env`) se resuelve con credenciales n8n tipo Header Auth, que es lo que ya usan.

El patrón sensato: **n8n orquesta → llama a Upload-Post / Postiz self-hosted / Blotato → esas herramientas tienen las apps auditadas** ante TikTok/Meta. Así ONIA no tiene que pasar la auditoría de TikTok por su cuenta ni mantener el OAuth de 5 cuentas × 3 plataformas.

---

## 4. Casos reales de operaciones legítimas con varias personas virtuales

### The Clueless / Aitana López (Barcelona)

- Creada a fines de 2023 por **Rubén Cruz**, agencia **The Clueless**. Origen: los modelos reales eran poco confiables, caros y difíciles de escalar; muchos proyectos se caían por problemas del influencer o modelo. Decidieron crear su propia influencer.
- ~400.000 seguidores combinados
- Ingresos: **€10.000/mes** aproximado, ~€1.000 por anuncio con promedio ~€3.000. Forbes reportó ~USD 11.000/mes.
- Ingresos acumulados asociados al personaje y activos de marca: estimados en **USD 800.000 – 1.000.000**
- **Detrás hay un equipo de once personas.**

Fuentes: https://en.wikipedia.org/wiki/Aitana_L%C3%B3pez · https://www.forbes.com/sites/lesliekatz/2023/11/24/this-ai-generated-influencer-can-pull-in-10000-euros-a-month/ · https://apob.ai/blog/ai-influencer-aitana-lopez/ · https://www.theclueless.ai/ · https://www.fastcompany.com/91546466/she-has-400000-instagram-followers-and-major-brand-deals-shes-also-ai (403 al fetch automático; citado vía índice de búsqueda)

> **El dato incómodo: 11 personas para 1 influencer, ~€10k/mes.** Eso es ~€900/mes de facturación por persona del equipo. Es un negocio de **agencia creativa**, no una máquina de imprimir dinero. Cualquiera que te venda "5 influencers IA en automático" está omitiendo esto. La ventaja real de ONIA es que **automatiza con código lo que The Clueless hace a mano** — pero el guion, la estrategia y la relación comercial siguen siendo humanos.

### Fanvue (plataforma de suscripción, admite creadores IA)

- Enero 2026: cruzó **USD 100M de run rate anual**, Serie A de USD 22M
- **250.000 creadores**, 17M usuarios activos mensuales
- Creadores IA generan **15% de los ingresos de la plataforma**; top performers >USD 20.000/mes
- Cuentas con 20K–50K seguidores sociales reportan **USD 2.000–8.000/mes** solo por suscripciones una vez consolidada la audiencia; PPV suma 30–50% adicional
- 93% de los creadores usa al menos una herramienta IA integrada

Fuentes: https://www.apatero.com/blog/fanvue-complete-guide-ai-creators-monetization-2026 · https://aiinfluencer.tools/blog/fanvue-review-ai-creators/ · https://fanvuemodels.com/blog/top-earners-on-fanvue

> **Honestidad:** las cifras de Fanvue vienen mayormente de blogs afiliados al ecosistema Fanvue. La cifra de USD 100M ARR y la Serie A sí están reportadas. Los rangos de ingreso por creador son marketing y deben tomarse como techo optimista, no como promedio.

---

## 5. Riesgo concreto: qué pasa cuando cae una cuenta

Esta es la parte donde la industria del anti-detect y la industria de la recuperación de cuentas coinciden — y cuando dos industrias con incentivos opuestos coinciden, hay señal.

### 5.1 Fingerprinting y chain bans

Lo reportado consistentemente `[vendor, pero coincidente entre competidores]`:

- Instagram analiza **device fingerprints**; cuentas que operan en el mismo dispositivo quedan vinculadas. Cambiar la IP manualmente no cambia el fingerprint
- **Chain ban**: cuando una cuenta cae, Instagram empieza a detectar las conectadas — por **dispositivo compartido, número de teléfono, patrones de email, IPs de login solapadas** — y esas también reciben restricciones
- Operar más de ~5 cuentas desde la misma IP / fingerprint / navegador dispara detección de spam
- Aunque no baneen las demás, **baja el "trust level"** de las cuentas conectadas
- En X/Twitter se documentó el mismo patrón: cuentas creadas desde el mismo WiFi, dispositivo o número se detectan como del mismo dueño y **se suspenden en cadena**

Fuentes: https://multilogin.com/blog/instagram-ip-ban-how-to-avoid-it/ · https://gologin.com/blog/what-instagram-account-can-be-banned/ · https://blog.octobrowser.net/instagram-account-suspended-why-it-happened-and-how-to-fix-it · https://note.com/xbackup/n/n8bd7ea543f92?hl=en

### 5.2 Shadowban / reducción de alcance

Más común que el baneo y **mucho peor de diagnosticar**, porque no hay notificación:
- TikTok: ante comportamiento engañoso puede **restringir la cuenta** — limitar publicar contenido nuevo o aparecer en resultados de búsqueda destacados
- Instagram: exclusión de recomendaciones por contenido no original (§2.3)
- YouTube: expulsión del YPP por contenido "inauthentic"

### 5.3 El riesgo específico que ONIA debe temer más

No es perder a Lucía. **Es perder el Business Portfolio.**

Si ONIA mete en un solo Business Portfolio: las 5 personas virtuales + la Página de DentalGest + la cuenta publicitaria `act_1073680778314945` que vende software... y una persona virtual recibe strikes por contenido IA no declarado → **el radio de explosión incluye el motor comercial que paga las cuentas**. Meta escala restricciones a nivel portfolio, y **cada persona solo puede crear 2 portfolios**, así que no hay reemplazo infinito.

---

## 6. ARQUITECTURA RECOMENDADA PARA ONIA (3-5 personas virtuales)

### 6.1 Principio de diseño

> **No construyas para esconderte. Construí para ser auditable.**
> Cada persona virtual de ONIA es una **marca propia declarada como IA**, no una persona falsa. Con eso, todo el stack de evasión (granja, cloud phones, antidetect, proxies) se vuelve **innecesario** — y su única función pasaría a ser esconder algo que no hay que esconder.

Esto ya está alineado con la política interna de ONIA ("es IA no se esconde"). La investigación la respalda: es la única postura que sobrevive a TikTok AIGC, Meta AI-info, EU AI Act art. 50 y FTC 16 CFR 465 al mismo tiempo.

### 6.2 Capas

**Capa 1 — Identidad (una sola vez, manual, humano)**
- 1 dominio propio con catch-all (ONIA ya lo tiene con Zoho) → 1 email dedicado por persona: `lucia@`, `<persona2>@`, etc. **No** aliases del mismo buzón visible, **no** el Gmail personal de Sergio
- Cada cuenta se crea **a mano, desde un teléfono real, con SIM real boliviana**. Sin automatización de creación (viola ToS de Instagram explícitamente)
- Cada cuenta se convierte a **Professional (Creator o Business)** desde el día 1
- **Bio obligatoria** de cada persona: identificarse como personaje IA de ONIA, en el nombre visible o en la primera línea de bio. Esto es lo que convierte la operación de "CIB" a "marca"
- Habilitar el label AIGC / AI-info al publicar, siempre

**Capa 2 — Gobernanza de plataforma (lo que reemplaza a la granja)**
- **Business Portfolio A — "ONIA Personas"**: contiene las 5 cuentas IG/FB de las personas virtuales. Sin ad account de producto.
- **Business Portfolio B — "ONIA Comercial"**: DentalGest, web factory, el ad account que gasta plata.
- **Regla dura: nunca cruzar activos entre A y B.** Es el firewall de radio de explosión (§5.3). Sergio tiene exactamente 2 portfolios permitidos — usalos así.
- **TikTok Business Center**: las 5 cuentas TikTok, con permiso "Manage account". Es el equivalente oficial y gratuito de la granja, para TikTok.

**Capa 3 — Publicación (API oficial, cero evasión)**
- **Instagram**: camino **"Instagram API con Instagram Login"** — no requiere Página de Facebook y sí publica Reels. Esto **destraba el bloqueo actual de ONIA**. Límite oficial: 100 posts/24h por cuenta; ONIA va a usar 1-3.
- **TikTok**: **no** pelear la auditoría propia (2-4 semanas, rechaza herramientas internas). Publicar vía una herramienta ya auditada.
- **Orquestación**: n8n en el VPS → llama a la capa de publicación → escribe estado en Supabase → cola de aprobación en ONIA Center.
- **Gate humano obligatorio antes de publicar** (misma regla de oro que ya tiene `editor-videos`: tabla de cortes + preview antes de aplicar). Aquí: preview + copy + label IA revisados por Sergio antes de que salga. Esto no es burocracia — es lo que evita que un batch mal generado queme 5 cuentas de una.

**Capa 4 — Producción (lo que ONIA ya tiene y es su verdadera ventaja)**
- Higgsfield Soul → imagen consistente por persona
- ElevenLabs → voz por persona
- `editor-videos` / HyperFrames → corte, karaoke, overlays, mockups **con código**
- **Regla anti-"inauthentic content"**: cada persona necesita **guion propio, ángulo propio y nicho propio**. Si las 5 publican la misma plantilla con distinta cara, Instagram y YouTube las degradan (§2.3) y no las banea nadie — simplemente no las ve nadie.

### 6.3 Costo mensual estimado

| Ítem | Costo | Nota |
|---|---|---|
| VPS + n8n | **USD 0** marginal | ya existe |
| Capa de publicación — **Opción A: Postiz self-hosted** | **USD 0** | corre en el VPS de ONIA, open source, 30+ plataformas |
| Capa de publicación — **Opción B: Upload-Post free tier** | **USD 0** | integración nativa n8n, 10+ plataformas |
| Capa de publicación — **Opción C: Blotato Starter** | **USD 29/mes** | 20 cuentas + API, la más cómoda |
| Analítica multi-marca — Metricool Starter (5 marcas) | **USD 20-25/mes** | opcional pero recomendado: el modelo "1 marca = 1 persona" calza exacto |
| Cuentas de Meta / TikTok Business Center | **USD 0** | productos oficiales gratuitos |
| SIMs bolivianas para verificación inicial | ~USD 15-25 **una vez** | solo alta, no operación continua |
| Higgsfield / ElevenLabs | ya presupuestado | no incremental |
| **TOTAL incremental recomendado** | **USD 20 – 55/mes** | |
| **TOTAL si se hace todo self-hosted** | **USD 0 – 25/mes** | |

**Comparado con la granja: USD 260–400/mes + USD 250–1.500 upfront + operación manual + riesgo de pérdida total.**

Ahorro: **~USD 3.000–4.500/año**, con menos riesgo y más defendible ante un cliente que pregunte "¿esto es legal?".

### 6.4 Lo que NO hay que hacer (lista dura)

| ❌ No hacer | Por qué |
|---|---|
| **Granja de celulares / cloud phones / antidetect / proxies móviles** | Es infraestructura de evasión. ONIA no tiene nada que evadir. Cuesta 10x y suma riesgo penal-reputacional |
| **Crear cuentas de forma automatizada** | Violación explícita de los Terms of Use de Instagram |
| **Bots de likes/follows/comentarios, pods, engagement comprado** | Prohibido explícitamente por TikTok y Meta. Es la causa #1 de baneo real |
| **Que las personas virtuales interactúen entre sí para inflarse** | Eso ES coordinated inauthentic behavior. Es literalmente el ejemplo del manual |
| **Presentar a una persona virtual como humana real** | Meta Inauthentic Behavior + TikTok AIGC + EU AI Act art. 50. Y mata la marca cuando se descubre |
| **Que una persona virtual dé un testimonio de usuaria de DentalGest** | FTC 16 CFR 465: testimonio de alguien que no existe. Hasta USD 51.744 por violación. Lucía **presenta**, no **testimonia** |
| **Media sintética de personas privadas reales** | Prohibido por TikTok incluso CON etiqueta |
| **Meter las personas virtuales y el ad account comercial en el mismo Business Portfolio** | Radio de explosión. Un strike de contenido te toca la máquina de vender |
| **Publicar la misma plantilla con 5 caras distintas** | No te banean: te dejan de distribuir. Peor resultado |
| **Comprar cuentas "envejecidas"** | Trade de cuentas: prohibido en TikTok y Meta, y heredás el historial sucio del vendedor |

---

## 7. Sobre vender el CURSO (honestidad brutal)

**Lo que NO se puede vender sin riesgo:**
- "Cómo montar tu granja de contenido" / "cómo manejar 50 cuentas sin que te baneen" → estás **vendiendo un método de evasión de ToS**. Tres problemas: (a) TikTok prohíbe explícitamente "el comercio de servicios que inflan engagement o engañan al sistema de recomendación"; (b) UK está tipificando la infraestructura multi-SIM con multa ilimitada, y esa dirección regulatoria se propaga; (c) si tus alumnos pierden cuentas siguiendo tu método — y las van a perder — el reclamo es contra ONIA.
- Cualquier módulo que enseñe a hacer pasar una IA por persona real.

**Lo que SÍ se puede vender, es más caro y nadie más lo tiene:**
1. **"Editar video con código, sin editores humanos"** — este es el activo diferencial real de ONIA. Transcripción, corte de silencios y muletillas, karaoke word-level, overlays, mockups. Casi nadie enseña esto y es 100% legítimo.
2. **"Persona virtual declarada: cómo montarla, cómo cumplir, cómo monetizar"** — con el módulo de compliance (AIGC, AI-info, EU AI Act, FTC) como **feature de venta**, no como letra chica. En 2026 el diferencial no es "cómo hacer una IA guapa", es "cómo hacerla sin que te la bajen".
3. **"Operación multi-marca por API oficial + n8n"** — Business Portfolio, TikTok Business Center, cola de aprobación, panel. Esto es lo que le sirve a una agencia con 10 clientes, que es quien tiene plata para pagar el curso.

Y el argumento comercial que cierra la venta, con las cifras de arriba: *The Clueless factura ~€10k/mes con Aitana y necesita 11 personas. Nosotros te mostramos cómo hacer la parte de producción con código, y cuál es la parte que NO se automatiza.* Eso es honesto, verificable y vendible.

---

## Fuentes

**Políticas de plataforma (primarias)**
- [Meta — Inauthentic Behavior (Transparency Center)](https://transparency.meta.com/policies/community-standards/inauthentic-behavior/)
- [Meta — Authentic Identity Representation](https://transparency.meta.com/policies/community-standards/authentic-identity-representation/)
- [Meta — Account Integrity](https://transparency.meta.com/policies/community-standards/account-integrity/)
- [Meta — Labeling AI Content](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/)
- [Meta — Our Approach to Labeling AI-Generated Content](https://about.fb.com/news/2024/04/metas-approach-to-labeling-ai-generated-content-and-manipulated-media/)
- [Instagram Platform — Overview (Instagram Login vs Facebook Login)](https://developers.facebook.com/docs/instagram-platform/overview/)
- [Instagram Platform — Content Publishing (límite 100/24h)](https://developers.facebook.com/docs/instagram-platform/content-publishing/)
- [Instagram Help — restricción por data scraping](https://help.instagram.com/740480200552298/)
- [TikTok — Community Guidelines Overview](https://www.tiktok.com/safety/en/policies-and-engagement/overview)
- [TikTok — How TikTok Counters Deceptive Behaviour](https://newsroom.tiktok.com/en-eu/how-tiktok-counters-deceptive-behaviour)
- [TikTok Creator Academy — Integrity & Authenticity](https://www.tiktok.com/creator-academy/article/integrity-authenticity-on-tiktok)
- [TikTok Business Center — managing TikTok accounts](https://ads.tiktok.com/help/article/about-managing-tiktok-accounts-in-business-center?lang=en)
- [YouTube — channel monetization policies](https://support.google.com/youtube/answer/1311392?hl=en)

**Regulación**
- [EU AI Act — Article 50](https://artificialintelligenceact.eu/article/50/) · [FAQ Comisión Europea](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act) · [Guidelines on Transparency of AI-Generated Content](https://digital-strategy.ec.europa.eu/en/policies/guidelines-transparency-ai-generated-content)
- [FTC — Consumer Reviews and Testimonials Rule Q&A](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers) · [16 CFR Part 465 (eCFR)](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465) · [Final Rule FRN (PDF)](https://www.ftc.gov/system/files/ftc_gov/pdf/r311003consumerreviewstestimonialsfinalrulefrn.pdf)
- [gov.uk — Preventing the use of SIM farms for fraud (government response)](https://www.gov.uk/government/consultations/preventing-the-use-of-sim-farms-for-fraud/outcome/preventing-the-use-of-sim-farms-for-fraud-government-response-accessible)

**Cambios algorítmicos / distribución**
- [Tubefilter — Instagram deja de recomendar cuentas de contenido no original (30-abr-2026)](https://www.tubefilter.com/2026/04/30/instagram-removes-algorithm-recommendations-repost-content-aggregator/)
- [PetaPixel — New Instagram Policies Target Reposted Content](https://petapixel.com/2026/04/30/new-instagram-policies-target-reposted-content/)
- [Social Media Today — YouTube inauthentic content policy](https://www.socialmediatoday.com/news/youtube-clarifies-monetization-update-inauthentic-repeated-content/752892/)
- [TikTok AI Content Policy 2026 — AIGC labels](https://www.cinerads.com/blog/tiktok-ai-content-policy) · [AuditSocials — TikTok AI disclosure 2026](https://www.auditsocials.com/blog/tiktok-ai-content-disclosure-rules-2026)
- [Meta AI ad labels obligatorios 2026](https://commonthreadco.com/blogs/coachs-corner/meta-ai-ad-labels-mandatory-disclosure-ecommerce-2026)

**Infraestructura de granjas (fuentes de vendedor — sesgo alto)**
- [GeeLark — Pricing](https://www.geelark.com/pricing/) · [GeeLark — Phone Farm vs Cloud Phone TCO](https://www.geelark.com/blog/phone-farm-vs-cloud-phone-complete-cost-comparison/) · [Influencer Marketing Hub — GeeLark review](https://influencermarketinghub.com/geelark/)
- [AdsPower — Multilogin vs Dolphin Anty](https://www.adspower.com/blog/multilogin-vs-dolphin-anty) · [Octo Browser — Top 8 antidetect 2026](https://blog.octobrowser.net/top-8-anti-detect-browsers) · [ScrapingBee — 10 best antidetect browsers](https://www.scrapingbee.com/blog/anti-detect-browser/) · [GoLogin — GeeLark review](https://gologin.com/blog/geelark-review/)
- [DataImpulse — best mobile proxies 2026](https://dataimpulse.com/blog/best-mobile-proxies/) · [SpyderProxy — best mobile proxy providers](https://spyderproxy.com/blog/best-mobile-proxy-providers) · [ProxyEmpire pricing](https://proxyempire.io/pricing-table/)
- [TokPortal — real devices vs emulators on TikTok](https://www.tokportal.com/vs/real-device-vs-emulator-tiktok-accounts)

**Bans, fingerprinting, chain bans (fuentes de vendedor — sesgo alto, pero coincidentes)**
- [Multilogin — Instagram IP ban](https://multilogin.com/blog/instagram-ip-ban-how-to-avoid-it/) · [Multilogin — managing multiple IG accounts](https://multilogin.com/blog/managing-multiple-instagram-accounts/)
- [GoLogin — what Instagram accounts get banned for](https://gologin.com/blog/what-instagram-account-can-be-banned/) · [Octo Browser — Instagram account suspended](https://blog.octobrowser.net/instagram-account-suspended-why-it-happened-and-how-to-fix-it)
- [note.com/xbackup — 2026 ban wave summary (X)](https://note.com/xbackup/n/n8bd7ea543f92?hl=en)
- [Spur — Instagram automated behaviour: what's banned vs safe](https://www.spurnow.com/en/blogs/instagram-automated-behaviour)

**APIs y herramientas de gestión**
- [PostPeer — TikTok Content Posting API: direct post, audit, alternatives](https://www.postpeer.dev/blog/best-tiktok-posting-api) · [Phyllo — TikTok API rate limits 2026](https://www.getphyllo.com/post/tiktok-api-rate-limits-in-2026-quotas-errors-workarounds) · [Netrows — TikTok Content Posting API setup 2026](https://www.netrows.com/blog/tiktok-content-posting-api-guide-2026)
- [Ayrshare — IG Graph API error 9 / 25-post limit](https://www.ayrshare.com/solutions/instagram-graph-api-error-9-the-25-post-daily-limit-how-to-fix-it/) · [Ayrshare pricing](https://www.ayrshare.com/pricing/)
- [SocialKit — Metricool pricing 2026](https://socialk.it/en/pricing/metricool) · [Schedpilot — Metricool real cost](https://schedpilot.com/metricool-pricing-how-much-does-it-really-cost/)
- [SocialKit — Publer pricing 2026](https://socialk.it/en/pricing/publer) · [Blotato — Buffer pricing 2026](https://www.blotato.com/blog/buffer-pricing) · [Blotato pricing](https://www.blotato.com/pricing) · [Blotato — best social media APIs 2026](https://www.blotato.com/blog/best-social-media-api-tools)
- [Mixpost — open source social tools 2026](https://mixpost.app/blog/why-open-source-social-media-management-tools-are-perfect-for-startups) · [WoopSocial — Upload-Post alternatives](https://woopsocial.com/blog/upload-post-alternatives) · [Prestyj — hidden costs of Hootsuite/Buffer/Later at scale](https://prestyj.com/blog/hidden-costs-of-hootsuite-buffer-later-at-scale-2026)

**Meta Business Portfolio límites**
- [Graphed — How many Meta business accounts can I have](https://www.graphed.com/blog/how-many-meta-business-accounts-can-i-have) · [MB ADV — Meta ads account structure 2026](https://www.mbadv.agency/meta-ads/meta-ads-account-structure)

**Casos reales**
- [Wikipedia — Aitana López](https://en.wikipedia.org/wiki/Aitana_L%C3%B3pez) · [Forbes — This AI-generated influencer can pull in almost $11,000 a month](https://www.forbes.com/sites/lesliekatz/2023/11/24/this-ai-generated-influencer-can-pull-in-10000-euros-a-month/) · [The Clueless](https://www.theclueless.ai/) · [APOB — Aitana López](https://apob.ai/blog/ai-influencer-aitana-lopez/) · [Fast Company — She has 400,000 Instagram followers… she's also AI](https://www.fastcompany.com/91546466/she-has-400000-instagram-followers-and-major-brand-deals-shes-also-ai)
- [Apatero — Fanvue complete guide for AI creators 2026](https://www.apatero.com/blog/fanvue-complete-guide-ai-creators-monetization-2026) · [AI Influencer Tools — Fanvue review](https://aiinfluencer.tools/blog/fanvue-review-ai-creators/) · [FanvueModels — top earners](https://fanvuemodels.com/blog/top-earners-on-fanvue)

---

# Anexo C — Cursos

# Negocio de CURSOS para ONIA — investigación con fuentes (jul-2026)

> Cobertura honesta: 22 búsquedas + 8 fetch directos. Lo marcado **[oficial]** viene de la fuente primaria (Stripe, Hotmart Help, Whop Docs, Skool). Lo marcado **[secundario]** viene de blogs de comparativa o notas de prensa y puede tener sesgo comercial — lo señalo donde importa. Los precios de comunidades en español son **observados en vivo hoy** (páginas públicas de Skool).

---

## 1) Mercado hispano/LatAm 2026: qué se vende y a qué precio

### 1.1 El mercado existe y LatAm es el epicentro

- Hotmart superó **USD 10.000 millones de GMV** en su ecosistema (2024) y reportó **+250.000 productores activos** globales en 2025. En LatAm hispana acumula **8,7 millones de compradores**; más de **21.000 personas registraron ventas activas** en el último año recomendando productos digitales. LatAm lidera el crecimiento global de creator economy con **+40% de ingresos**, y **el 60% vendía a otros países sin saberlo**. — [DPL News](https://dplnews.com/economia-de-creadores-en-latinoamerica-se-multiplicara-por-9-hacia-2033/) · [Alto Nivel](https://altonivel.com.mx/economia-de-creadores-el-mercado-que-promete-multiplicarse-por-nueve-hacia-2033-segun-hotmart/) · [Insider Latam](https://insiderlatam.com/marisol-perez-chow-de-hotmart-por-que-latam-es-el-epicentro-del-crecimiento-de-la-economia-de-creadores/)
- Lectura para ONIA: **21.000 vendedores activos sobre 8,7M de compradores** es un mercado con demanda mucho mayor que oferta *seria*. La mayoría de la oferta es reventa de afiliados, no sistema propio.

### 1.2 Precios REALES observables (no teóricos)

**Cursos genéricos / marketplaces (piso del mercado, no ir acá):**

| Producto | Precio | Fuente |
|---|---|---|
| Coursera / Google AI Essentials | ~USD 49/mes | [formacionlibre.com](https://formacionlibre.com/blog/cursos-ia-generativa-en-espanol-2026-guia-completa) |
| Udemy curso suelto | USD 15–90 | idem |
| Platzi | ~USD 279/año | idem |
| Especialización técnica IA (España) | EUR 1.000–2.800 | [Instituto Tecnológico Europeo](https://institutotecnologicoeuropeo.com/cuanto-cuesta-un-curso-de-ia-en-espana-guia-de-precios-2026/) |
| Mediana global de cursos (72.162 precios analizados) | **USD 110** | [Ruzuku, State of Online Courses 2026](https://www.ruzuku.com/learn/articles/state-of-online-courses-2026) |
| Mediana nicho "negocios y marketing" | **USD 247** | idem |
| Mediana nicho "coaching y consultoría" | **USD 531** | idem |

**Comunidades en español de IA/automatización — precios vivos HOY (esto es el comparable real de ONIA):**

| Comunidad | Precio | Miembros | Fuente |
|---|---|---|---|
| **Imperio Agéntico** (agentes IA, Claude Code, n8n) | **USD 59/mes**, sube a USD 87 a los 3.200 miembros | **3.100+** | [skool.com/imperio](https://www.skool.com/imperio/about) |
| **Veltim University IA** (Make + n8n, partner verificado n8n) | **USD 30/mes** | 72 | [skool.com/veltim](https://www.skool.com/veltim-automatizacion-de-ia-7988/about) |
| Brayan Developer N8N \| IA | USD 13 promo (normal USD 50) | — | [skool.com/brayandeveloper](https://www.skool.com/brayandeveloper-5872/about) |
| Curso "Experto Automatización IA + n8n" (Argentina, 6 meses) | **USD 249** one-time | — | [aprender21.com.ar](https://www.aprender21.com.ar/programacion-1/cursos-inteligencia-artificial/experto-automatizacion-ia.php) |

> **Dato clave**: Imperio Agéntico a 3.100 miembros × USD 59 ≈ **USD 180.000/mes bruto** en español, con precio escalonado por prueba social (sube el precio cuando crece). Ese es el techo demostrado del nicho hispano de IA/agentes hoy. Y es exactamente el nicho donde ONIA ya opera.

**Benchmarks de ingreso por miembro (Skool):** ARPU típico **USD 19–49/mes**; top **USD 200–450/mes**. El rango donde aterrizan la mayoría de comunidades rentables es **USD 29–99/mes**. — [Communipass, Skool Revenue Benchmarks 2026](https://communipass.com/blog/skool-revenue-benchmarks-2026/) **[secundario]**

**Ingreso promedio por creador:** Kajabi **USD 37.000/año**; Udemy **USD 3.300/año**. — [Ruzuku](https://www.ruzuku.com/learn/articles/state-of-online-courses-2026). La diferencia es dueño-de-audiencia vs alquilar góndola en marketplace.

### 1.3 Qué formato convierte

Los números son contundentes y consistentes entre fuentes:

| Formato | Finalización | Precio relativo |
|---|---|---|
| Self-paced (grabado suelto) | **10–20%** (algunas fuentes 3–15%) | 1x |
| Cohorte en vivo | **85–96%** | **3–5x más caro** |
| Con comunidad vs sin comunidad | **65,5% vs 42,6%** (+54%) | creadores con comunidad ganan **~2x más** |

Fuentes: [Ruzuku cohort vs self-paced](https://www.ruzuku.com/learn/articles/cohort-vs-self-paced) · [Ruzuku State of Online Courses 2026](https://www.ruzuku.com/learn/articles/state-of-online-courses-2026) · [educate-me.co](https://www.educate-me.co/blog/cohort-based-learning-vs-self-paced-learning) · [productgrowth.in](https://productgrowth.in/insights/edtech/course-completion-rates-benchmarks/)

**El formato ganador documentado en 2026 no es "curso" — es "reto pagado → comunidad recurrente":**

Caso con números (Communipass **[secundario, un solo caso]**): reto de 14 días a **USD 49** → 200 compradores = **USD 9.800** de front-end → 80% completó → **31% convirtió** a comunidad de USD 99/mes = **USD 4.950 de MRR** de una sola cohorte. — [Communipass challenge-first](https://communipass.com/blog/how-to-make-money-on-skool-in-2026-the-challenge-first-method-for-creators/)

---

## 2) Plataformas: comisiones, costos fijos y — lo crítico — cobrar DESDE BOLIVIA

### 2.1 Comparativa de costos

| Plataforma | Costo fijo | Comisión | Recurrente nativo |
|---|---|---|---|
| **Hotmart** | **USD 0** | **9,9% + USD 0,50** por venta (>USD 5); +USD 1,49/venta si usás su reproductor de video; tarifa de retiro USD/EUR 3–7,50 | **Sí** (semanal/mensual/anual) |
| **Skool** | USD 9/mes (Hobby) o **USD 99/mes** (Pro) | Hobby **10% + 0,30**; Pro **2,9%** (3,9% >USD 900). Punto de equilibrio ~USD 900/mes | Sí |
| **Whop** | **USD 0** | 2,7% + 0,30 doméstico; **+1,5% internacional +~1% conversión** → hasta 5,2% + 0,30; efectivo real ~6–7% | Sí |
| **Teachable** | USD 39/mes Starter (**7,5% platform fee**) → USD 89 Builder (0%) | + ~2,9% + 0,30 procesamiento | Sí |
| **Kajabi** | **USD 179–499/mes** | 0% plataforma; Kajabi Payments 2,9%+0,30 (+0,7% en suscripciones, +1,5% tarjetas internacionales) → efectivo ~3,6% | Sí |
| **Propio** (Next+Supabase+n8n, lo que ONIA ya tiene) | ~USD 0 marginal (VPS ya pago) | QR Simple: **0%**; Circle.bo ~3% + fijo | Sí (hay que construirlo) |

Fuentes: [Hotmart pricing oficial](https://www.hotmart.com/es-ES/pricing) · [Hotmart Help – tarifas](https://help.hotmart.com/es/article/208298448/-cuales-son-las-tarifas-cobradas-por-hotmart-) · [Kursopro comisiones Hotmart](https://kursopro.com/blog/emprendimiento/comisiones-hotmart/) · [Kourses Skool pricing](https://kourses.com/skool-pricing/) · [Ruzuku Whop pricing](https://www.ruzuku.com/learn/articles/whop-pricing) · [whatpayment Whop fees](https://www.whatpayment.com/en/guides/whop-fees-explained/) · [Kourses Kajabi vs Teachable](https://kourses.com/kajabi-vs-teachable-2/) · [Kiero – pasarelas Bolivia](https://kiero.io/blog/tienda-online/8-pasarelas-de-pago-en-bolivia-efectivas-y-eficientes/)

### 2.2 EL BLOQUEO: qué puede cobrar realmente un boliviano

Esto decide la plataforma, no las features.

**❌ Stripe — Bolivia NO está soportado.** Verificado en la página oficial: en LatAm solo aparecen **Brasil y México**. — [stripe.com/global](https://stripe.com/global) **[oficial]**

**❌ PayPal — Bolivia es el único país de LatAm donde NO se puede recibir pagos ni retirar a banco local.** Sirve para pagar/comprar, no para cobrar. — [blog.crea.la](https://blog.crea.la/es/how-to-get-paid-without-paypal-in-bolivia-es/) · [comparalatam](https://comparalatam.com/bo/transferencia/paypal.html) **[secundario, consistente en múltiples fuentes]**

**⚠️ Skool — cobra vía Stripe Express.** Los pagos a creadores salen por Stripe Express, y Skool paga en "100+ países". Como Bolivia no está en Stripe, **un boliviano no puede cobrar dentro de Skool con cuenta boliviana**. — [Skool Help – setup payouts](https://help.skool.com/article/78-how-to-setup-skool-subscriptions) **[oficial]** + inferencia con la lista de Stripe. *No lo dan por escrito; hay que confirmarlo probando el alta.*

**✅ Hotmart — SÍ funciona desde Bolivia, es la ruta más limpia.** El artículo oficial de retiro lista cuatro métodos: banco brasileño, banco colombiano, **Payoneer**, y **HotPay International** (transferencia directa a cuenta bancaria **no brasileña, sin importar el país**). Mínimo USD 50 + tarifa EUR 3–7,50. **Wise NO se acepta.** Del lado del comprador: acepta **tarjetas Visa/Mastercard emitidas por bancos bolivianos** y transferencias desde cuentas bolivianas, con checkout en **22 monedas locales y 44 métodos de pago**. — [Hotmart Help – cómo retirar mi comisión](https://help.hotmart.com/es/article/216440207/-como-retirar-mi-comision-) **[oficial]** · [Hotmart internacionalización](https://hotmart.com/co/herramientas/internacionalizacion) · [afiliadoempresa.com](https://afiliadoempresa.com/marketing-de-afiliados/que-es-hotmart-bolivia-y-como-funciona/)

**🟡 Whop — probablemente sirve, sin confirmación oficial por país.** Docs oficiales: payouts por **banco, mobile wallet, cripto (Coinbase) y PayPal**, en **"200+ países"** / marketing dice 241+ territorios, incluyendo cripto y stablecoins. No publican lista país por país; la doc solo dice que "dependiendo de tu país, aparecerán los métodos elegibles". **La vía cripto (USDC a wallet propia) esquiva el problema Stripe por completo.** — [Whop Docs – payout methods](https://docs.whop.com/manage-your-business/manage-payouts/payout-methods) **[oficial]** · [Whop Global Payouts](https://whop.com/network/products/payouts/). **Acción: crear cuenta y verificar en el modal de payout antes de comprometerse.**

**✅ Payoneer — opera en Bolivia.** 1% al recibir de empresas, **1–2% al retirar a banco boliviano**, cuenta multimoneda + Mastercard. Limitaciones: no todos los bancos bolivianos son compatibles, demora varios días, exige ingresos recurrentes para mantener la cuenta activa. — [comparalatam/Payoneer Bolivia](https://comparalatam.com/bo/bank/payoneer.html) **[secundario]**

**✅ Ruta de conversión a Bs recomendada por la comunidad boliviana:** Payoneer → **Airtm** → banco boliviano (~**4% total**), o **Binance P2P**. Airtm tiene spread ~4–6% pero es más simple; P2P ~1–2%. — [Airtm blog](https://www.airtm.com/es/blog/emprendimiento-digital/como-retirar-dolares-de-payoneer-a-bolivianos-bob/) · [usdthoy.com](https://usdthoy.com/blog/como-comprar-usdt-bolivia) · [amn.bo](https://amn.bo/como-recibir-pagos-internacionales-en-bolivia-sin-comisiones-altas/)

**✅ Para vender a bolivianos: QR Simple, comisión 0.** "Mientras las pasarelas en otros países consumen 3–5% de cada venta, el pago QR en Bolivia es gratis para el comercio." Funciona con todos los bancos e instantáneo. Alternativas con pasarela: Circle.bo (3% + fijo), PagaTodo 360 (Red Enlace/BNB), Multipago. — [Shoperly – cobrar online en Bolivia](https://www.shoperly.app/blog/cobrar-online-bolivia-qr-simple) · [Kiero](https://kiero.io/blog/tienda-online/8-pasarelas-de-pago-en-bolivia-efectivas-y-eficientes/)

### 2.3 El arbitraje cambiario juega A FAVOR

- Oficial BCB: **Bs 10,90/USD**. Paralelo al 24-jul-2026: **Bs 11,74 compra / 11,77 venta** (mediana de 8 plataformas P2P: Binance, Bitget, Bybit, El Dorado, Takenos, AirTM). — [paralelo.bo](https://paralelo.bo/) · [dolarparalelobolivia.net](https://dolarparalelobolivia.net/)
- Cobrar en USD (mercado hispano completo) y convertir por P2P rinde **~8% más bolivianos** que el tipo oficial. Vender en Bs a bolivianos es más fácil de cerrar pero rinde menos. **Conclusión: precio en USD como base, precio en Bs como cortesía local, no al revés.**

### 2.4 Fiscal Bolivia (no es opcional)

- **Exportación de servicios está exenta de IVA e IT** si te registrás como exportador en el Padrón Nacional de Contribuyentes — aplica a servicios informáticos prestados al exterior. Factura comercial de exportación, sin IVA ni IT. — [Bolivia Impuestos](https://boliviaimpuestos.com/factura-comercial-de-exportacion-en-bolivia/) · [SIAT – IVA/IT/IUE](https://siatinfo.impuestos.gob.bo/index.php/impuesto-asunto/iva-it-e-iue)
- Venta doméstica: IVA 13% sobre monto inclusivo (**~14,94% efectivo**) + IT 3% (acreditable contra IUE).
- **Régimen SIETE-RG para emprendedores**: hasta **Bs 400.000 anuales**, pago único bimestral del **5%** que consolida IVA + IT + IUE. Encaja perfecto con el arranque de un curso. — [Morgana Tec – Guía Tributaria Bolivia 2026](https://www.morganatec.com/post/gu%C3%ADa-tributaria-bolivia-2026-cambios-clave-en-el-iva-siat-en-l%C3%ADnea-y-facturaci%C3%B3n-digital)
- Recordatorio del contexto ONIA: facturación electrónica obligatoria desde 30-sep-2026 → el curso nace ya facturando bien o nace mal.

---

## 3) "Construir en público" como embudo al curso

### 3.1 El mecanismo, con números

- **Justin Welsh**: ex-ejecutivo, salió en 2019, **USD 7,5M+ acumulados**, ~853.000 seguidores en LinkedIn, **una sola persona**, márgenes >80%, USD 3–5M/año. LinkedIn es el embudo entero. Es "el ejemplo más claro de una audiencia que no castiga la venta constante, porque la venta va envuelta en lecciones usables". — [magicpost.in](https://magicpost.in/blog/who-is-justin-welsh) · [justinwelsh.me](https://www.justinwelsh.me/newsletter/my-10m-journey)
- **Su embudo de 4 fases** (el marco que aplica directo a ONIA): *ser descubierto → generar confianza → establecer relación → monetizar*. Si nadie sabe que existís y sobre qué hablás, nadie pasa a la fase siguiente. — [mistakeshappen.substack.com](https://mistakeshappen.substack.com/p/build-in-public-3-sistemas-generacion-contenido)
- **Marc Lou**: modelo "portfolio indie" — construir rápido, distribuir en público, apilar productos. Su apalancamiento real fue la combinación de construir rápido + compartir con transparencia qué funcionó y qué no. — [startupik.com](https://startupik.com/marc-lou-building-startups-in-public-and-the-rise-of-indie-founders/) · [indieai.directory](https://indieai.directory/blog/marc-lou-81683-february-2026-income-breakdown/)
- **Referente en español**: Romuald Fons construía en público sitios web desde cero para enseñar a hacer webs que ganan dinero por afiliación, "mostrando el proceso sin trucos", desde los 10K seguidores. — [CETIEM](https://cetiem.com/build-in-public/)

### 3.2 Traducción directa a ONIA

El reto **"0 a 5K" de Sergio** y **Lucía** no son marketing del curso: **son el curso**. Cada episodio del reto es simultáneamente (a) contenido de descubrimiento, (b) prueba de que el sistema funciona, y (c) una lección del classroom. Es el mismo activo cobrado dos veces. Lo que Fons hizo con webs de afiliación, ONIA lo hace con una granja de influencers IA — con la ventaja de que el proceso es *visualmente* más interesante y el sistema de edición por código ya está construido.

---

## 4) Riesgo y realidad (leer antes de cobrar nada)

| Riesgo | Dato | Fuente |
|---|---|---|
| **Sin audiencia = sin ingreso** | "Con audiencia cero, esperá **£0–£2.000 y dos años** de inversión en marketing" | [Lilach Bullock](https://www.lilachbullock.com/online-course-passive-income/) |
| **Umbral de lista** | Creadores con **≥1.000 suscriptores antes** del lanzamiento tienen **10x más probabilidad** de generar ingreso relevante el día 1 | [Ruzuku](https://www.ruzuku.com/learn/articles/make-money-selling-courses) |
| **Nicho difuso mata** | **68% de los creadores fallan** por apuntar a "todos los interesados en [tema]" en vez de un avatar con un problema urgente | idem |
| **Primer lanzamiento típico** | USD 500–3.000 | idem |
| **Conversión realista** | 1–5% del embudo (5–8% con email fuerte) | [LearnWorlds](https://www.learnworlds.com/blog/market-sell/how-much-money-can-you-make-selling-online-courses/) |
| **Casos concretos** | ~900 subs → **USD 3.115** (3,5% conv. a USD 99). 2.400 subs → **USD 30.000** (4,1%) | [matthommel.com](https://www.matthommel.com/email-marketing-benchmarks-for-education-course-creators-coaching-businesses/) |
| **Costo del fracaso** | Quien lanza y no vende espera **8 meses** en promedio antes de reintentar (si reintenta) | [Ruzuku](https://www.ruzuku.com/learn/articles/make-money-selling-courses) |
| **Benchmark de lista** | ~**USD 1 por suscriptor por mes** si está bien monetizada | idem |

### Por qué la membresía le gana al curso único

1. **Ingreso predecible vs cacería permanente.** "Optar por pago único te obliga a estar siempre captando clientes en lugar de reteniéndolos." — [recurrentes.com](https://recurrentes.com/articulo/tipo-de-pago/)
2. **Finaliza más gente → menos reembolsos → más boca a boca.** Comunidad: 65,5% vs 42,6% de finalización, y **~2x más ingreso por creador**. — [Ruzuku](https://www.ruzuku.com/learn/articles/state-of-online-courses-2026)
3. **Barrera de entrada baja.** USD 29/mes se decide sin pensar; USD 497 requiere una carta de ventas y confianza que ONIA todavía no tiene acumulada.
4. **Para ONIA específicamente**: el conocimiento *se degrada cada 60 días* (Higgsfield, ElevenLabs, n8n, la API de Instagram cambian). Un curso grabado envejece y genera reembolsos; una comunidad convierte esa volatilidad de pasivo en **el motivo de la suscripción**.
5. **El riesgo real de la membresía es el churn**: exige contenido y soporte continuados, medir cohortes, churn voluntario vs involuntario y retención a 30/60/90 días. — [klasoo](https://www.klasoo.com/suscripciones-y-membresias-ingresos-recurrentes-para-creadores-de-cursos-online/)

---

## 5) PROPUESTA CONCRETA PARA ONIA

### 5.1 Qué vender (y qué NO)

**NO vender**: "Curso de IA", "aprende n8n", "agentes de IA". Ese espacio ya lo ocupan Imperio Agéntico (3.100 miembros) y Veltim (partner verificado de n8n). Entrar ahí es competir sin foso.

**SÍ vender el foso real de ONIA — lo único que casi nadie puede enseñar porque casi nadie lo construyó:**

> ### 🎯 **"Granja de Contenido IA"** — cómo operar VARIAS cuentas de influencer IA desde un solo panel, con video editado por código y agentes que atienden por WhatsApp.

Los tres pilares (que ya existen, no hay que inventarlos):
1. **Crear la modelo** — Higgsfield Soul consistente + voz ElevenLabs + posicionamiento (Lucía es el caso vivo).
2. **Producir sin editor humano** — transcribir, cortar silencios/muletillas, subtítulos karaoke, overlays, todo por código (el sistema ONIA ya probado).
3. **Operar en escala** — varias cuentas/chips desde un panel, n8n orquestando, agente que responde WhatsApp y califica.

Avatar específico (contra el error del 68%): **el emprendedor o agencia chica de LatAm que ya intentó hacer contenido y se ahogó en la edición.** No "interesados en IA".

### 5.2 La escalera de producto (challenge-first, no curso-first)

| Fase | Producto | Precio USD | Precio Bs (paralelo ~11,7) | Objetivo |
|---|---|---|---|---|
| **0 · meses 1–3** | **Contenido gratis + lista** — el reto "0 a 5K" y Lucía en público, 3–5 piezas/semana + newsletter | **Gratis** | — | **1.000 suscriptores de email**. Sin esto, nada de lo de abajo funciona (dato: 10x) |
| **1 · mes 3–4** | **Reto pagado 14 días: "Tu primera modelo IA publicando sola"** — WhatsApp/Telegram + entregable diario | **USD 39** | **Bs 456** | Validar que alguien paga. Meta conservadora: **40–80 compradores = USD 1.560–3.120** |
| **2 · mes 4 en adelante** | **Comunidad "Granja de Contenido IA"** — mensual, 1 sesión en vivo/semana, classroom que crece, plantillas n8n, workflows, biblioteca de prompts | **USD 29/mes** (subir a 49 a los 300 miembros, a 69 a los 1.000 — el modelo de Imperio Agéntico) | **Bs 339/mes** | **MRR**. Meta 12 meses: **150–300 miembros = USD 4.350–8.700/mes** |
| **3 · mes 9+** | **Implementación hecha con vos** (grupo chico, 8 personas, 6 semanas) | **USD 497–997** | Bs 5.800–11.700 | Margen alto sobre los que ya están adentro |

**Ancla de precio para justificar los USD 29:** implementar un agente de WhatsApp con IA cuesta a una PyME **USD 130–830/mes** de servicio, o desde **EUR 5.000** a medida ([Javadex](https://www.javadex.es/blog/agente-ia-whatsapp-business-empresa-precio-2026) · [Aurora Inbox](https://www.aurorainbox.com/2026/05/25/cuanto-cuesta-automatizar-whatsapp-ia-2026/)). La comunidad enseña a construirlo por USD 29/mes. La comparación se vende sola.

**Por qué USD 29 y no USD 59:** ONIA no tiene marca en este nicho todavía. Veltim cobra 30 con 72 miembros; Imperio cobra 59 con 3.100. Entrar en el piso del rango observable y **subir escalonado con prueba social pública** ("el precio sube a 49 en el miembro 300") — es un mecanismo de urgencia comprobado en el nicho y honesto.

### 5.3 Plataforma: dos carriles de cobro

**Carril A — Resto de LatAm + España (el 90% del mercado): HOTMART**
- Única plataforma verificada que **cobra en 22 monedas locales** y **paga a un boliviano** (HotPay International o Payoneer) **[oficial]**.
- Soporta **suscripción recurrente nativa** — la comunidad se cobra ahí. — [Hotmart Help – suscripciones](https://help.hotmart.com/es/article/115002364191/suscripcion-todo-lo-que-necesitas-saber-para-crear-y-configurar-suscripcion)
- Costo real: 9,9% + 0,50 → sobre USD 29 se van **USD 3,37**, quedan **USD 25,63** netos.
- **No usar el reproductor de Hotmart** (+USD 1,49/venta). Video en el VPS de ONIA o Bunny.

**Carril B — Bolivianos: QR SIMPLE, comisión 0**
- Cobro en Bs por QR/transferencia, acceso otorgado automáticamente por **n8n → Supabase** (ONIA ya tiene ambos corriendo). 0% de comisión vs 9,9% de Hotmart.

**La "casa" de la comunidad:** Skool es el mejor producto de comunidad pero **no puede cobrar con cuenta boliviana** (Stripe). Dos salidas:
- **(a) Recomendada ahora:** Skool **gratis** como casa (USD 9/mes plan Hobby), cobro por fuera (Hotmart/QR) y alta/baja de miembros vía n8n. Cero fricción técnica, arranca esta semana.
- **(b) A 6 meses:** migrar la casa a **panel propio** (Next.js + Supabase, stack que ONIA ya domina y ya tiene desplegado) → 0% de comisión, dato propio, y **el panel mismo se vuelve demo de venta de DentalGest/web-factory**.
- **Verificar en paralelo:** abrir cuenta en **Whop** y comprobar en el modal de payout si Bolivia habilita banco o cripto. Si habilita, es la mejor economía sin costo fijo. **No confirmado — hay que probarlo.**

**Descartados y por qué:** Kajabi (USD 179–499/mes fijos, suicida sin ingresos), Teachable (7,5% en Starter y cobro vía Stripe), Skool como cobrador (Stripe), PayPal (imposible en Bolivia).

### 5.4 Cómo se alimenta del contenido que YA se produce

Cero producción nueva. Todo es re-uso del carril H/K/L que ya está corriendo:

| Activo que YA existe | Uso en el negocio de cursos |
|---|---|
| Reto "0 a 5K" de Sergio | **Contenido de descubrimiento** semanal + prueba de que el método funciona (build in public, modelo Fons/Welsh) |
| Lucía (@lu.antelo) | **Caso vivo** del pilar 1. Cada iteración = una lección del módulo "crear la modelo" |
| Sistema `editor-videos` (cortes, karaoke, overlays) | **Módulo 2 completo**. Los propios videos del canal se editan con él y se muestra el proceso |
| Skill `ver-videos` + Speaches en VPS | Lección "transcribir gratis sin GPU" — diferenciador real vs cursos que recetan AssemblyAI pago |
| Agentes de ONIA Center + n8n (11 workflows vivos) | Módulo 3 + plantillas descargables (el activo #1 que pide la gente en Skool) |
| Canales YT "ONIA Automatiza" y "Ciencia de tu Cuerpo" | **Segunda granja demostrada** — prueba de que el sistema replica, no es suerte |
| Propuestas/pricing de web-factory | Módulo bonus: cómo cobrar esto como servicio (donde está la plata del alumno) |

**Bucle**: cada semana ONIA produce contenido igual → 1 pieza pública (embudo) + 1 lección privada (retención) del **mismo material**. El costo marginal del negocio de cursos tiende a cero, y el curso **paga la producción de contenido** que hoy es puro costo.

### 5.5 Economía y umbrales (con números, no ilusiones)

| Escenario | Miembros | Bruto/mes | Neto Hotmart | En Bs (paralelo) |
|---|---|---|---|---|
| Piso (mes 6) | 30 × USD 29 | 870 | **USD 769** | **Bs ~9.000** |
| Base (mes 12) | 150 × USD 29 | 4.350 | **USD 3.844** | **Bs ~45.000** |
| Bueno (mes 18) | 300 × USD 49 | 14.700 | **USD 13.185** | **Bs ~154.000** |

*(Neto = bruto − 9,9% − USD 0,50/cobro. Sin Hotmart, cobrando por QR a bolivianos, el neto es el 100%.)*

### 5.6 Regla de no-arranque (la más importante)

**No cobrar nada hasta tener 1.000 suscriptores de email o 5.000 seguidores propios.** Los datos son inequívocos: sin audiencia, el resultado esperado del primer lanzamiento es ~cero, y el costo del fracaso son 8 meses de parálisis. El reto "0 a 5K" **es** la fase 0 — cuando llegue a 5K, el producto se lanza a una audiencia que ya vio el sistema funcionar en vivo. Eso convierte la fase gratis en requisito, no en demora.

### 5.7 Siguientes 5 pasos concretos

1. **Registrarse como exportador de servicios** en el Padrón (exención IVA+IT) y evaluar SIETE-RG mientras se facture <Bs 400.000/año. Bloqueo humano de Sergio, destraba el cobro legal.
2. **Abrir Hotmart como productor + vincular Payoneer** (el link de datos financieros recién aparece tras la primera venta — hacer una venta de prueba de USD 5 a uno mismo).
3. **Abrir Whop y verificar el modal de payout para Bolivia** (banco o cripto). 20 minutos, decide si se ahorra el 9,9%.
4. **Publicar la landing de captura de emails** con web-factory (activo que ya existe) y arrancar el reto "0 a 5K" documentado 3x/semana.
5. **Instrumentar el conteo de la lista en ONIA Center** — la métrica que gobierna todo el plan es "suscriptores", no "seguidores".

---

### Limitaciones de esta investigación

- **Whop en Bolivia: NO confirmado.** La doc oficial no publica lista por país. Requiere verificación empírica.
- **Skool + Bolivia: inferido**, no declarado por Skool. La cadena (Skool paga por Stripe Express) + (Stripe no lista Bolivia) es sólida pero merece una prueba de alta.
- **PayPal Bolivia**: fuentes secundarias consistentes entre sí, sin página oficial de PayPal que lo diga explícitamente.
- Los datos de **Ruzuku y Communipass** son de plataformas que venden a creadores → sesgo optimista probable. Los precios de Skool en español son observación directa y son el dato más confiable del informe.
- El caso "challenge-first" de Communipass es **un solo caso anónimo**; úsese como plantilla de mecánica, no como proyección.