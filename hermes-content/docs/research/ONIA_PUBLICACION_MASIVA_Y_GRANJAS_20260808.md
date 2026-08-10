# ONIA — Publicación masiva, granjas de dispositivos y contenido como servicio

**Fecha de investigación:** 2026-08-08 / 2026-08-09
**Tipo de cambio:** 1 USD = Bs 11,4 (flotación desde 26-jun-2026)
**Encuadre:** publicar en **cuentas propias** y en **cuentas de clientes con su consentimiento**, cumpliendo los términos de cada plataforma. No se investiga ni se recomienda crear cuentas falsas, suplantar personas, evadir detección antifraude ni comprar cuentas.
**Estado del documento:** research con fuentes. Todo dato sin fuente pública está marcado como **no verificado**.

---

## 1. La respuesta sobre las granjas, en 8 líneas

1. Una granja de dispositivos resuelve **operar cuentas que no son tuyas ni tienen tu permiso** — crear cuentas en masa, dar likes/follows automáticos, o multiplicar identidades. Ninguno de esos tres es el problema de Onia.
2. Para lo que Onia sí hace — publicar en cuentas propias y de clientes con permiso — **la API oficial de Instagram permite 100 posts publicados cada 24 h por cuenta** ([Meta, Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/)). Onia hoy no produce ni 3 piezas diarias por cuenta.
3. Es decir: **la granja levanta un techo que no estamos tocando ni al 3%.** Ese es el número que cierra el tema.
4. **Teléfonos completos:** USD 850–1.000 de CAPEX (Bs 9.690–11.400) + USD 60–95/mes para 10 cuentas, reposición total cada ~14 meses y 5–10 h/mes de mantenimiento. Resuelve un problema que no tenemos.
5. **Cajas de placas de celular:** USD 50–200 por placa, chasis de 20 slots USD 1.000–4.100. **No ahorran plata frente a un usado**; su única ventaja es operar sin que se note. Se venden textualmente para *"automated bot operations"*.
6. **SIM box / GSM gateway / SIM bank: categoría equivocada de raíz — no publican nada.** Son equipos de voz y SMS masivo; en una granja sirven para recibir los SMS de verificación al crear cuentas, o sea el uso prohibido. En Bolivia además necesitan homologación y autorización previa de la ATT para importarse.
7. **El riesgo no es proporcional:** TikTok, ante evasión, *"may ban all of their accounts"* — una granja detectada no tumba una cuenta, tumba **todas las vinculadas, incluidas las de clientes**. Ese es el peor escenario comercial posible.
8. **Veredicto: no. Ni la variante barata.** La granja es la infraestructura de quien tiene que fingir ser mucha gente; Onia no tiene que fingir nada. Lo que sí es urgente y cuesta USD 0: **el token de Instagram vence el 2026-08-17.**

---

## 2. Publicación en masa: la vía que recomendamos

### 2.1 La arquitectura concreta

```
n8n (VPS 187.77.16.63)  ──cron 45 días──▶  refresh de tokens  ──▶  credenciales n8n
                                                                         │
Motor propio (HyperFrames / Remotion) ──▶ pieza renderizada ─────────────┤
Higgsfield ULTRA (Souls Mara/Lucía) ─────▶ imagen / video ───────────────┤
ElevenLabs ──────────────────────────────▶ voz ──────────────────────────┤
                                                                         ▼
                                                            Postiz autohospedado
                                                     (calendario + cola + grupos por cliente)
                                                                         │
                                              ┌──────────────┬───────────┴────────┬─────────────┐
                                              ▼              ▼                    ▼             ▼
                                        IG Graph API   FB Pages API        Threads API   LinkedIn CM API
                                        (100/24h)      (4800×engagement)   (250/24h)     (150/día/miembro)
```

**Dónde vive cada cosa:**
- **n8n** (ya corriendo, ~70 workflows): cron de refresh de tokens, cola de publicación de respaldo, gestor de credenciales. **No hay que construir cola ni scheduler — ya los tenemos.**
- **Postiz autohospedado**: calendario visual, aprobación del cliente y agrupación por cliente. AGPL 3.0, USD 0 de licencia.
- **Las APIs oficiales de cada red**, con **nuestra propia app de desarrollador** en cada plataforma.

### 2.2 Verificación de Postiz — los dos pendientes que quedaron abiertos

**🔴 RAM: NO entra en los 2,5 GB libres del VPS. Hay que ampliar.**

Desde la v2.12.0 el `docker-compose.yaml` oficial levanta **9 contenedores**: `postiz`, `postgres:17`, `redis:7.2`, `spotlight`, y todo el stack de Temporal (`temporal`, `temporal-elasticsearch`, un **segundo** `postgres:16`, `temporal-admin-tools`, `temporal-ui`).

| Fuente | Requisito |
|---|---|
| Docs oficiales de Postiz | mínimo 2 vCPU / 2 GB para **un solo usuario**; **"4 GB o más" para múltiples usuarios o workflows programados**; recomendado 4 vCPU / 8 GB |
| Medición de terceros, stack ocioso, 1 cuenta | **~2,3 GB** |
| Guías de instalación 2026 | **4 GB mínimo, 6 GB recomendado, 8 GB si convive con otros servicios** |

Nuestro caso es exactamente "múltiples clientes + workflows programados" = el que ellos marcan como 4 GB+. Con 2,5 GB libres arranca y **muere con el primer lote real de publicaciones**. El truco de swap que circula (2 GB de swap file) **no nos sirve: el swap del VPS ya está al 100%** (ver memoria `vps-access-and-deploy`).

Tres salidas, en orden de preferencia:
1. **Liberar RAM en el VPS actual** (16 GB totales, solo 2,5 libres) — auditar qué se está comiendo los 13,5 GB. Costo USD 0. **Empezar por acá.**
2. **Apuntar Postiz a Postgres/Redis externos** (`DATABASE_URL`, `REDIS_URL`, `TEMPORAL_ADDRESS`) y bajar el compose a lo mínimo. Ojo: **Temporal sigue siendo obligatorio desde v2.12**, no se puede sacar.
3. **Segundo VPS chico** de 4 vCPU / 8 GB: referencia de mercado EUR 16,49 (~USD 19) al mes ≈ **Bs 217/mes** ([Hetzner CPX31, feb-2026, vía agregador](https://www.whtop.com/plans/hetzner.com/128287) — precio de terceros, no cotización nuestra).

**🟢 Grupos por cliente: SÍ están en el self-host, no están gateados.**
Los límites de canales son **solo de Postiz Cloud**: *"Self-hosted Postiz has no channel cap — you can connect as many channels as the providers allow per OAuth app."* La agrupación por cliente existe y es accesible por API/CLI (`integrations:groups` lista los customers, `integrations:list --group <id>` filtra sus canales). No hay gating documentado entre cloud y self-host.

### 2.3 La verdad incómoda sobre Postiz

**Postiz no evita ni un solo trámite.** Sus propios docs: *"No providers are configured by default. You will need to configure them all in your `.env` file."* Para Instagram pide crear **nuestra** app en Meta for Developers y cargar `FACEBOOK_APP_ID`/`SECRET` pidiendo `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement` — *"hasta entonces, solo los roles que hayas agregado pueden publicar"*.

Postiz es **una UI de calendario y cola sobre las mismas APIs oficiales** que usaríamos igual. Nos ahorra construir el calendario y la vista de aprobación del cliente. No nos ahorra el App Review.

**El cuello de botella real no es la herramienta. Es la aprobación de cada plataforma.**

### 2.4 Límites reales por red

| Red | Límite de publicación por cuenta | ¿Cuentas de terceros? | Formatos por API |
|---|---|---|---|
| **Instagram** | **100 posts / 24 h móviles** (carrusel = 1 post). Consultable con `GET /<IG_ID>/content_publishing_limit`. Encima corre el límite de *llamadas*: **4800 × impresiones de las últimas 24 h** | Sí, con **Advanced Access + Business Verification + App Review**. Solo cuentas **profesionales** | Imagen (solo JPEG), video, **Reels**, **Carrusel** (10), **Stories** |
| **Facebook Pages** | **4800 × usuarios que interactuaron** / 24 h (límite de llamadas) | Sí, con `pages_manage_posts` + `pages_read_engagement` + `pages_show_list` | Texto, foto, video, link, Reels |
| **TikTok** | 6 req/min · **~15 posts/día por creador** · 5 "pending shares"/24 h | **Solo después del audit.** Sin audit: **todo sale `SELF_ONLY`** y máx. 5 usuarios en 24 h | Video, fotos |
| **YouTube** | **10.000 unidades/día por PROYECTO** (no por canal); un upload cuesta hasta 1.600 → **~6 videos/día en TOTAL sumando todos los clientes** | Sí, pero **sin compliance audit todo video queda bloqueado en privado** | Video / Shorts |
| **Threads** | **250 posts / 24 h por perfil** | Sí, misma infra Meta | Texto, imagen, video, carrusel |
| **LinkedIn** | 150 req/día por miembro + 100.000/día por app. Tier Development: 500/app, 100/miembro | Sí, **Community Management API** (empresa registrada + página verificada + doble review) | Texto, imagen, video, carrusel, encuestas |
| **X** | Sin tope de escrituras. **USD 0,015 por post** (Bs 0,17); **USD 0,20 si lleva link** (Bs 2,28) | Sí | Texto, imagen, video |
| **Pinterest** | Trial: **1.000 req/día por APP** (todos los clientes juntos) → inservible para servicio. Standard: 100 req/s por usuario | Sí, con Standard Access | Pines imagen y video |

**🔴 La trampa de Instagram que hay que saber ANTES de vender:** la cuota de llamadas es `4800 × impresiones`. Una cuenta de cliente **recién creada, con 10 impresiones, da 48 llamadas en 24 h**, y publicar un Reel consume 3–4. O sea: **el cliente nuevo y chico es el más difícil de servir** — exactamente al revés de lo intuitivo. Advanced Access **no** cambia esa fórmula. Si el paquete promete "3 posts diarios", con una cuenta arrancando de cero eso puede fallar por cuota, no por nuestro código. **Va al contrato.**

### 2.5 Cuántos clientes aguanta UNA app nuestra

| Red | Techo real |
|---|---|
| Meta (IG/FB/Threads) | **Sin cap de cuentas documentado** → cientos de clientes viables |
| LinkedIn | 100.000 req/día ÷ ~5 por publicación ≈ miles. En tier Development: ~5 clientes de prueba |
| X | Sin cap. Solo dinero |
| **YouTube** | **~6 subidas/día compartidas por TODOS los clientes.** Con 10 clientes a 1 video/día ya no alcanza; hay que pedir ampliación de cuota |
| **Pinterest (Trial)** | **1.000 req/día por app en total. No sirve para servicio** |
| **TikTok (sin audit)** | **Cero clientes viables** |

**El número honesto: con las aprobaciones puestas, una sola app nuestra sirve para ~50–100 clientes sin problema en Meta, LinkedIn, X y Threads.**

### 2.6 Los seis trámites — ninguno es código, todos van en paralelo

| Trámite | Qué desbloquea | Estado |
|---|---|---|
| **Meta Business Verification** | Prerrequisito de Advanced Access | 🔴 **En pausa por SEPREC. Es el bloqueo #1 de todo el plan** |
| Meta App Review (`instagram_content_publish`, `pages_manage_posts`) | IG + FB de clientes | Bloqueado detrás del anterior |
| **TikTok audit** | Sacar el `SELF_ONLY` | No iniciado |
| **YouTube compliance audit** | Que los videos no queden privados + ampliar cuota | No iniciado |
| **LinkedIn Community Management, tier Standard** | Postear en páginas de clientes | No iniciado |
| **Pinterest Standard Access** | Salir de 1.000 req/día por app | No iniciado |

Cada uno toma semanas. **Se pueden tramitar los seis hoy mismo — no dependen entre sí** (salvo Meta, donde Verification va antes que Review).

### 2.7 El camino que ya funciona hoy, sin código y sin App Review

Para los primeros 3–10 clientes: el cliente comparte su Página + IG como **socio** en su propio Business Manager, y Onia publica y programa desde **Meta Business Suite / Planner**. Cero desarrollo, cero App Review, cero token que caduca, y el cliente revoca el acceso en dos clics. **Esto permite empezar a vender el servicio esta semana mientras corren los trámites.**

---

## 3. Cuadro de costos comparado — 12 meses

**Supuesto de valuación de trabajo:** Bs 50/h. Es una convención interna para hacer comparables las horas, **no un dato de mercado**.

### Opción A — Granja de 10 dispositivos (10 cuentas)

| Concepto | USD 12 meses | Bs 12 meses |
|---|---|---|
| CAPEX: 10 Android usados + hub USB + rack + ventilación | 850–1.000 | 9.690–11.400 |
| Proxies (10 IP × USD 2–5/mes) | 240–600 | 2.736–6.840 |
| Datos: 10 líneas prepago Bolivia (~Bs 40/mes c/u) | ~420 | ~4.800 |
| Electricidad (USD 0,50–1 por equipo/mes) | 60–120 | 684–1.368 |
| Reposición (vida útil ~14,2 meses en uso 24/7) | 85–150 | 969–1.710 |
| **Subtotal de caja** | **1.655–2.290** | **18.879–26.118** |
| Mano de obra: 5–10 h/mes = 60–120 h/año | — | 3.000–6.000 |
| **TOTAL 12 meses** | **~1.918–2.816** | **~21.879–32.118** |
| **Cuentas que habilita** | **10** | |
| **Costo por cuenta/año** | | **Bs 2.188–3.212** |

### Opción B — API oficial + Postiz autohospedado

| Concepto | USD 12 meses | Bs 12 meses |
|---|---|---|
| Postiz (AGPL 3.0) | **0** | **0** |
| RAM: liberar el VPS actual (16 GB, 2,5 libres) | **0** | **0** |
| — alternativa si no se libera: VPS 4 vCPU/8 GB adicional | ~228 | ~2.600 |
| Tokens, OAuth, App Review, audits | **0** | **0** |
| Cron de refresh en n8n (ya pagado) | 0 | 0 |
| Setup: ~20 h una vez + 1 h/mes = ~32 h/año | — | ~1.600 |
| **TOTAL 12 meses (con VPS extra, escenario caro)** | **~228 + 32 h** | **~4.200** |
| **TOTAL 12 meses (liberando RAM del VPS actual)** | **~0 + 32 h** | **~1.600** |
| **Cuentas que habilita** | **~50–100 clientes + las nuestras** | |
| **Costo por cuenta/año (a 50 cuentas)** | | **~Bs 32–84** |

### El resumen

| | Granja 10 cuentas | API + Postiz |
|---|---|---|
| Costo 12 meses | **Bs 21.879–32.118** | **Bs 1.600–4.200** |
| Cuentas habilitadas | 10 | 50–100+ |
| Costo por cuenta/año | Bs 2.188–3.212 | Bs 32–84 |
| Riesgo de baneo por el método | **Alto — ban en cascada de TODAS las cuentas vinculadas** | Cero |
| Riesgo legal (Bolivia) | Homologación ATT si entra un SIM box; titularidad de 10 líneas sobre Leslie | Cero |
| Mantenimiento | 5–10 h/mes, para siempre | ~1 h/mes |
| Techo de publicación | el de la app de cada red, igual | 100 posts/24h por cuenta IG |

**La granja cuesta entre 5 y 20 veces más por cuenta, habilita 5 a 10 veces menos cuentas, y agrega el único riesgo que puede costarnos un cliente entero.** No es una decisión difícil.

---

## 4. Influencers IA — Mara y Lucía

### 4.1 🔴 URGENTE: el token de Instagram vence el 2026-08-17

Faltan **8 días** y es **la única vía de publicación que existe hoy**. Si vence, se apaga todo. Y no debería volver a ser un evento: se arregla una vez.

1. **Crear un System User** en el Business Manager e instalarle la app (acceso estándar permite 1 system user + 1 system admin; con acceso avanzado, 10).
2. **Generar el token con `set_token_expires_in_60_days`.** Meta ya no admite tokens sin vencimiento. Scopes: `instagram_basic`, `instagram_content_publish`, `pages_show_list`, `pages_read_engagement`.
3. **Cron en n8n cada 45 días** que llame a la Refresh API y reescriba la credencial. **Esta es la pieza que falta**: sin ella, si el token pasa de 60 días se pierde y hay que rehacer el OAuth a mano. Con ~70 workflows corriendo, esto es un workflow más, no un proyecto.
4. **Verificar consumo** con `GET /<IG_ID>/content_publishing_limit` antes de subir cadencia.

**Costo del paquete urgente: USD 0 / Bs 0.** Es configuración, no compra. No requiere permiso de gasto.

### 4.2 Cuántas cuentas: 6, y ni una más

| Personaje | Instagram | TikTok | YouTube |
|---|---|---|---|
| Mara | 1 profesional (Creator) | 1 | 1 canal Shorts (fase 2) |
| Lucía | 1 profesional (Creator) | 1 | 1 canal Shorts (fase 2) |

**Por qué 6 y no 20:** más cuentas con el mismo guion y la misma cara produce exactamente el patrón que YouTube llama *inauthentic content* (*"AI-generated content made with generic or unoriginal templates giving the impression of mass production"*, política de monetización) y que TikTok llama *"spreading violative content across multiple accounts"*. **Escalar cuentas es la forma más rápida de perder las dos que valen.**

Lo que sí escala sin riesgo: **más piezas por cuenta con guion genuinamente distinto**, y **más cuentas de clientes** (cada una con identidad real, consentimiento y negocio propio detrás).

**Nota sobre YouTube:** un número de teléfono solo puede asociarse a **2 canales por año** (dato oficial). Es el único límite real que obligaría a líneas separadas — y con 2 canales alcanza.

### 4.3 Etiquetado obligatorio por red — desde el día uno, no después

| Red | Qué exige | Herramienta |
|---|---|---|
| **Meta (IG/FB/Threads)** | **Obligatorio**: *"We require people to disclose, using our AI-disclosure tool, whenever they post organic content with photorealistic video or realistic-sounding audio that was digitally created or altered."* No hacerlo → distribución reducida, límites de pauta o remoción | Etiqueta "AI info" por post + **etiqueta de cuenta "AI creator"** (nueva, 4-mayo-2026, toggle en el perfil) |
| **TikTok** | **Obligatorio**: *"You must label content that uses AI or includes significant edits to show realistic-looking people or scenes."* Detección automática vía C2PA + marca de agua invisible desde 19-nov-2025 | Toggle "AI-generated content" en el editor + frase en la bio |
| **YouTube** | **Obligatorio** cuando genera una escena realista que no ocurrió. *"Creators who consistently choose not to disclose... may be subject to... penalties from YouTube, including removal of content or suspension from the YouTube Partner Program."* Divulgar **no** afecta la monetización | Casilla "altered or synthetic content" en cada subida + línea fija en la descripción |

**Costo total del etiquetado: USD 0 / Bs 0.** Es gratis hoy y caro después: una cuenta con meses de contenido IA sin etiquetar, luego detectada por C2PA, arrastra historial de incumplimiento.

**Regla dura interna:** Mara y Lucía **nunca** opinan sobre personas reales, política ni salud, ni "usan" productos de terceros sin acuerdo. Ahí el AIGC pasa de etiquetable a prohibido en las tres redes.

**EU AI Act art. 50 — en vigor desde el 2026-08-02** (hace una semana): obliga a marcar contenido generado por IA y deepfakes, multas hasta EUR 15M o 3% de facturación mundial. **Aplica solo si el contenido apunta a público de la UE.** Con audiencia boliviana, no aplica. **En Bolivia no encontré norma publicada de etiquetado de contenido IA** — lo que aplica localmente es la vía general de publicidad engañosa y derechos de imagen.

### 4.4 Cadencia y plan

- **1 a 2 piezas/día por cuenta** en TikTok y Reels. Muy por debajo del límite de API (100/24h) y por encima del umbral de relevancia.
- **Guion genuinamente distinto por pieza.** No la misma plantilla con otro fondo.
- **Nunca el mismo video en las dos cuentas.** TikTok clasifica el contenido replicado entre cuentas como *circumvention*.
- **Responder comentarios desde la cuenta.** Es lo que separa un personaje de una granja a ojos del sistema de recomendación.
- Instagram y TikTok primero (ya hay token y Souls listos); YouTube en fase 2, después del audit de TikTok.

**El caso que valida el modelo:** Lu do Magalu (Magazine Luiza, Brasil), ~8,4M de seguidores en Instagram a ene-2026, propiedad de una marca, **nadie finge que es humana**. Igual que Lil Miquela (~2,6M) y Aitana López (~400k): los que funcionan **declaran** su naturaleza, monetizan por acuerdos de marca (no por AdSense de volumen), y **ninguno opera granjas de cuentas** — son pocas cuentas con mucha inversión por pieza. Las cifras de ingresos que circulan para los tres (USD 10M/año, EUR 3.000–10.000/mes, USD 2,5M) vienen de blogs de marketing sin fuente primaria: **no verificadas, no usarlas en una propuesta a cliente.**

---

## 5. El servicio para clientes: Onia Contenido + Pauta

### 5.1 Qué exige Meta para que manejemos la publicidad de un cliente

**La regla dura: el cliente es dueño de sus activos; Onia entra como SOCIO. Nunca al revés.**

| Activo | Dueño | Onia |
|---|---|---|
| Página de Facebook | Cliente | Acceso de tarea "Contenido" / "Anuncios" |
| Cuenta de Instagram profesional | Cliente | Acceso de tarea |
| Cuenta publicitaria | Cliente | "Administrar campañas" |
| Píxel / dataset | Cliente | "Ver rendimiento" + "Administrar" |

El flujo elegante: **Onia solicita el acceso desde su propio portafolio y al cliente le llega la solicitud para aprobar con un clic** — no tiene que aprender la interfaz. Para automatizar sin depender de la sesión personal de nadie: **usuario del sistema** con token propio.

**🔴 Consecuencia operativa dura: Onia NO debe crear las cuentas publicitarias de los clientes dentro de su propio portafolio.** Hay un tope de cuentas publicitarias por portafolio (dinámico, sube con historial de gasto; un portafolio nuevo arranca en 2). Nos chocamos contra el techo al 3er o 4to cliente y es irreversible sin historial. Cada cliente, su portafolio.

**El medio de pago lo pone el cliente, siempre.** Cuatro razones:
1. **Caja:** si el cliente deja de pagar, Onia ya gastó en Meta.
2. **Antifraude:** una misma tarjeta en varias cuentas publicitarias dispara detección de fraude.
3. **Fiscal boliviano — la más importante:** pagar publicidad a un beneficiario del exterior convierte al pagador en **agente de retención del IUE-BE, tasa efectiva 12,5%** sobre lo remitido (Art. 51 Ley 843). Si Onia paga y refactura, Onia carga esa obligación.
4. **Realidad boliviana:** el cuello de botella no es Meta, es la tarjeta. Muchos anunciantes bolivianos no pueden pagar con tarjeta local. **Se pregunta en la primera reunión, no en la tercera.**

### 5.2 Costo real de producir con lo que ya tenemos

**Fijos ya pagados (no son costo nuevo del servicio):** Higgsfield ULTRA USD 99–129/mes (Bs 1.129–1.471, 3.000 créditos no acumulables) · ElevenLabs USD 6–22/mes (Bs 68–251) · motor propio en el VPS Bs 0 de caja.

**Costo por generación — verificado en las transacciones de nuestra cuenta Higgsfield, 6 al 9-ago-2026:**

| Generación | Créditos reales | Costo (a Bs 0,49/crédito) |
|---|---|---|
| Soul V2 (imagen con cara consistente: Mara/Lucía) | 0,12 | **Bs 0,06** |
| Z Image | 0,15 | Bs 0,07 |
| Nano Banana 2 / Pro | 1,5–2 | Bs 0,74–0,98 |
| Soul ID (entrenar avatar nuevo, una vez) | 25 | Bs 12,25 |

**Video: no hay ninguna transacción de video en las últimas 145 de nuestra cuenta.** Los números que siguen son derivados de terceros, **no medidos por nosotros**: Kling 3.0 ≈ 7 cr (Bs 3,4/clip de 5 s), Seedance 2.0 ≈ 25 cr (Bs 12,3), Veo 3 ≈ 59 cr (Bs 29). Si el número importa para cotizar, se genera **un** clip de prueba y se lee la transacción real.

| Pieza terminada | Costo |
|---|---|
| Post estático | **< Bs 1** |
| Reel 20–30 s "barato" (imágenes + motor propio + voz) | **≈ Bs 1,50** |
| Reel 20–30 s con video generativo (5 clips Kling, 2 intentos c/u) | ≈ Bs 35 |
| Reel premium (Seedance/Veo) | Bs 60–150 |

**Mes tipo de 12 piezas: ≈ Bs 150 de costo variable.** Con el prorrateo de suscripciones entre 5 clientes, el insumo total ronda **Bs 390/mes por cliente**.

**La conclusión que manda el pricing:** los insumos de IA son ruido, menos del 10% del precio. El costo real es el tiempo humano de guion, aprobación y respuesta. **Se fija precio por resultado, nunca por costo**, y el margen solo se sostiene si el pipeline lo corren los agentes.

**Y la corrección al modelo de %:** en Bolivia el % puro mata el negocio. 15% sobre una pauta típica de Bs 3.000 son **Bs 450/mes** — no paga ni el prorrateo de las suscripciones. **Fee fijo con piso, y % solo sobre el excedente.**

### 5.3 El paquete vendible

| | **Nivel 1 · Presencia** | **Nivel 2 · Captación** | **Nivel 3 · Motor** |
|---|---|---|---|
| **Precio/mes** | **Bs 890** | **Bs 1.900** | **Bs 3.900** |
| **Resultado** | Tu negocio deja de verse abandonado | Convertís audiencia en conversaciones y leads | Motor de captación con seguimiento automático |
| Piezas/mes | 12 (8 estáticas + 4 reels ≤20 s) | 20 (12 + 8 reels) | 30 (18 + 12 reels, 2 premium) |
| Redes | Instagram + Facebook | + TikTok | + YouTube Shorts / LinkedIn |
| Publicación | Programada, calendario aprobado | Programada + horarios óptimos | Programada + reactiva a coyuntura |
| Pauta Meta | ✗ | ✓ Setup píxel/CAPI + 2 campañas, inversión del cliente hasta Bs 3.500 | ✓ Sin tope de gestión; **12% sobre lo que exceda Bs 10.000** de inversión |
| Leads | — | Llegan al panel de Onia | Panel + agente de seguimiento por WhatsApp |
| Landing | — | — | 1 landing de campaña incluida |
| Reporte | Mensual | Quincenal | Semanal + reunión |

**Add-ons:** solo pauta (setup Bs 700 + Bs 600/mes **o** 15% de la inversión, el mayor) · avatar IA propio del cliente (Soul entrenado, Bs 350 setup) · video premium Bs 150/pieza · chatbot IA en WhatsApp (según skill de propuestas).

**Posicionamiento vs. el mercado boliviano:** RedPlan cobra USD 120–500/mes (Bs 1.368–5.700) por 4 a 12 posts, pauta no incluida. El tarifario nacional de community manager 2026 va de Bs 1.500 (junior, 8 posts) a Bs 12.000–25.000 (corporativo). **Nuestro Nivel 1 queda por debajo del piso del mercado con 3× las piezas** — defendible solo porque el costo de producción es Bs 150 y no una persona. El Nivel 3 aterriza en el rango "senior" (Bs 6.000–10.000) cobrando la mitad, con pauta y seguimiento adentro.

### 5.4 Disclaimer de requisitos — sin esto no arrancamos

1. **Portafolio comercial (Business Manager) a nombre del cliente**, con su Página y su cuenta de Instagram profesional vinculada. Si no existe, lo creamos **a nombre del cliente** — nunca a nombre de Onia.
2. **Onia entra como socio**, con permisos por tarea. **No pedimos ni aceptamos contraseñas ni códigos 2FA.** El cliente revoca cuando quiera, desde su propio panel. *(Esto es argumento de venta, no fricción.)*
3. **Cuenta publicitaria a nombre del cliente, con SU método de pago.** Requisito duro en Bolivia: **tarjeta habilitada para compras internacionales en USD.** Es el requisito que más contratos traba.
4. **El presupuesto de pauta NO está incluido** y se paga directo a Meta. Los impuestos que Meta aplique corren por cuenta del cliente.
5. **Verificación del negocio en Meta** (SEPREC / NIT). Sin ella los límites de la cuenta no suben.
6. **Cuenta nueva = arranque lento, y no es culpa de la agencia.** Meta impone un límite de gasto diario a cuentas nuevas (**no publica el monto** — todo número que circule es de terceros sin cita oficial) y el umbral de cobro arranca en ~USD 25 (Bs 285). Un conjunto de anuncios necesita **~50 eventos de optimización** para salir de la fase de aprendizaje. **Las primeras 2–4 semanas son de calibración, no de resultados.** Se dice en la propuesta, no cuando el cliente reclama.
7. **Inversión mínima recomendada Bs 700/mes.** Por debajo, los datos son ruido estadístico.
8. **Cuota de API de Instagram:** la cuenta nueva y chica es la que menos cuota tiene (`4800 × impresiones`). La cadencia prometida se calibra sobre la cuenta real, no sobre el papel.
9. **Materia prima del cliente:** logo vectorial, fotos reales del negocio y sus productos, datos de contacto, promociones del mes. Sin fotos reales todo sale generado y se nota.
10. **Aprobación del calendario antes del día 25** del mes anterior. Sin respuesta en 48 h se publica lo ya aprobado.
11. **Rubros restringidos por Meta** (salud, crédito, empleo, vivienda, política): categorías especiales con segmentación limitada. Se avisa antes de cobrar.
12. **Contrato mínimo 3 meses.** El aprendizaje de la cuenta no cabe en 30 días.
13. **Prohibido comprar seguidores, cuentas o interacciones.** Si el cliente lo pide, no se hace.
14. **TikTok y YouTube no se venden hasta pasar los audits.** Venderlos antes es vender un post que nadie ve.

---

## 6. Lo que NO vamos a hacer, y por qué

| Práctica | Por qué no | Norma citada |
|---|---|---|
| **Crear cuentas en masa** | Términos de Instagram: *"You can't attempt to create accounts or access or collect information in unauthorized ways. This includes creating accounts... in an automated way without our express permission."* | [Meta Terms of Service](https://www.facebook.com/terms), vigentes desde 1-ene-2025 |
| **Automatizar la app (dispositivos manejando la UI de IG/TikTok)** | TikTok Community Guidelines: *"Using automation to run many accounts or send repetitive content"* — no permitido. Meta: métodos adversarios para evadir detección | TikTok Community Guidelines, sección Deceptive Behaviors; Meta Inauthentic Behavior Policy |
| **Multiplicar identidades / cuentas falsas** | Meta prohíbe *"The creation, use, or claimed use of Inauthentic Meta Assets"* para engañar sobre identidad u origen, y el comportamiento coordinado con *"false identities"* | [Meta Inauthentic Behavior](https://transparency.meta.com/policies/community-standards/inauthentic-behavior/) |
| **Replicar el mismo contenido entre cuentas** | TikTok lo clasifica como *circumvention*; YouTube lo desmonetiza como *inauthentic content* | TikTok CG; [YouTube monetization policies](https://support.google.com/youtube/answer/1311392) |
| **Comprar seguidores, likes o cuentas** | Fake engagement en las tres redes. Sanción: *"we may ban all of their accounts"* — **incluidas las de clientes** | TikTok Community Guidelines |
| **Publicar contenido IA sin etiquetar** | Obligatorio en Meta, TikTok y YouTube (§4.3). Reincidencia → distribución reducida, límites de pauta, remoción o suspensión del YPP | Meta Community Standards (Misinformation); TikTok CG; [YouTube](https://support.google.com/youtube/answer/14328491) |
| **Pedir la contraseña del cliente** | Existe el flujo oficial de socio. Pedir credenciales es innecesario y nos hace responsables de su cuenta | Meta Business Manager, acceso de socio |
| **Crear la página o cuenta del cliente a nombre de Onia** | Es el error que después cuesta un juicio. El cliente se va y no puede llevarse su propia audiencia | — |
| **🔴 SIM box / GSM gateway / SIM bank** | **(a)** No publican contenido — son equipos de voz/SMS; su único papel en una granja es surtir números para verificar cuentas nuevas en masa (uso prohibido). **(b)** Importarlos a Bolivia **requiere autorización previa de la ATT y homologación**: nota al Director Ejecutivo, detalle marca/modelo/serie, certificado de homologación vigente, registro ATT como comercializador. Un gateway comprado en Alibaba **no pasa aduana legalmente**. **(c)** Sus fichas técnicas venden como características *"BTS rotation, proxy server encryption for anti IP block, auto IMEI change and generation"* — eso no es marketing, es evasión de detección antifraude de la telco | **RAR ATT-DJ-RAR-TL LP 443/2023, 28-sep-2023, art. 5** (vía [VUCE Bolivia](https://www.vuce.gob.bo/es/ATT_autorizacion_previa_importacion_equipos_telecomunicaciones_procedimiento)); **DS 4326, 7-sep-2020** (Reglamento de Infracciones y Sanciones): sanciona *"fraude establecido en la normativa sectorial vigente o conexión ilegal"* con **375 días multa o decomiso de equipos** |

**Honestidad sobre la cita del DS 4326:** la verifiqué en **Lexivox** (compilador **no oficial**). No pude confirmar la numeración exacta de artículos contra la Gaceta Oficial, y **no encontré ningún caso boliviano público de desarticulación de un SIM box**. Si esto va a fundamentar una decisión de compra, que lo revise un abogado con el texto oficial.

**Sobre las líneas prepago (por si alguna vez hace falta un chip para verificar una cuenta legítima):** el **DS 353 del 4-nov-2009** obliga a las operadoras a mantener el Registro de Titulares de Línea con *"nombre del titular, número de documento de identificación personal y el código IMEI"*, con la finalidad declarada de *"contribuir a identificar a los responsables de utilizar servicios de telecomunicaciones móviles en la comisión de delitos"*. Registro obligatorio, gratuito, **solo con cédula boliviana**. **El límite de líneas por cédula NO lo pude verificar** — circula la cifra de 3, pero solo en blogs comerciales, no en ninguna resolución de la ATT ni en el Reglamento de Telefonía RE016. **Dato no confirmado: preguntar directo a la ATT o a la operadora.**

**Lo que esto implica en la práctica:** cada línea queda a nombre de una persona física, y esa persona es la identificada ante la justicia por lo que se haga con ella. **Con Sergio menor de edad, 10 o 50 líneas caerían sobre Leslie.** No es un trámite administrativo: es exposición personal de la titular de OniaAgency a cambio de un problema técnico que no existe.

---

## 7. Plan por fases — con tamaño honesto

### Esta semana (antes del 2026-08-17) — costo Bs 0

| # | Qué | Quién | Tamaño |
|---|---|---|---|
| 1 | **🔴 System User + token con `set_token_expires_in_60_days` + cron de refresh cada 45 días en n8n** | Claude | ~3 h. Es un workflow, no un proyecto |
| 2 | **Activar "AI creator" en los perfiles de Mara y Lucía** + toggle de IA en TikTok | Sergio / Arthur | 10 min |
| 3 | **Iniciar Meta Business Verification** (destrabar SEPREC) | 🔴 **Sergio — bloqueo #1 de todo el plan** | trámite |
| 4 | **Iniciar en paralelo: TikTok audit, YouTube compliance audit, LinkedIn Standard, Pinterest Standard** | Claude prepara, Sergio firma | 1 día de armado, semanas de espera |
| 5 | **Auditar los 13,5 GB de RAM ocupados del VPS** — decidir si Postiz entra liberando o hay que sumar máquina | Claude | ~2 h |
| 6 | **Vender el primer cliente con el camino sin código** (Business Suite + acceso de socio) | Sergio | ya es posible hoy |

**Definición de "hecho" de la fase 1:** el token de IG se renueva solo y verificado en vivo, los seis trámites están presentados, y hay una decisión escrita sobre la RAM.

### Semanas 2–4 — costo Bs 0–2.600 (según la decisión de RAM)

- Levantar **Postiz autohospedado** con los proveedores configurados (nuestra app de Meta) y **grupos por cliente**.
- Cablear el pipeline: motor propio / Higgsfield → Postiz → colas por red, con lectura de `X-App-Usage` y `X-Business-Use-Case-Usage` para frenar antes del 429.
- **Tabla de cuotas por cuenta** (posts en las últimas 24 h) para no llegar al 429 y poder explicarle al cliente por qué no se publicó.
- Mara y Lucía a **1–2 piezas/día** en IG + TikTok, guion distinto por pieza y por personaje.
- Cerrar el **primer cliente pago** del Nivel 1 o 2.

### Mes 2–3 — según destraben los trámites

- Con **Meta App Review aprobado**: publicación por API en cuentas de clientes; escalar a 5–10 clientes.
- Con **TikTok audit aprobado**: recién ahí se vende TikTok en el Nivel 2.
- Con **YouTube audit + ampliación de cuota**: recién ahí Shorts para clientes (y canales de Mara y Lucía).
- **Meta Ads con dinero real** solo cuando el cliente tenga su portafolio, su cuenta publicitaria y su tarjeta internacional. El motor propio sigue en DRY hasta ese momento.

### Lo que NO está en el plan

Comprar dispositivos, placas, SIM boxes o SIM banks. Contratar Postiz Cloud, Ayrshare, bundle.social o Postproxy — **existe una tercera vía de APIs gestionadas que ya tienen los audits hechos** (Ayrshare USD 149–599/mes = Bs 1.699–6.829; bundle.social USD 100/mes por 50 cuentas = Bs 1.140; Postiz Cloud Agency ~USD 99/mes = Bs 1.129), y es la única forma de destrabar TikTok y YouTube **este mes** en vez de en tres. **No contraté ni probé ninguna** — regla de la casa. Queda sobre la mesa como decisión de gasto para Sergio, no como recomendación.

---

## 8. Fuentes

### Publicación por API — oficiales
- [Meta — Instagram Content Publishing](https://developers.facebook.com/docs/instagram-platform/content-publishing/) · [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview/) · [content_publishing_limit](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user/content_publishing_limit/) · [Instagram API con Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started)
- [Meta — Graph API Rate Limiting](https://developers.facebook.com/docs/graph-api/overview/rate-limiting/) · [Page-level rate limits](https://developers.facebook.com/blog/post/2016/06/16/page-level-rate-limits/) · [Pages API Posts](https://developers.facebook.com/docs/pages-api/posts)
- [Meta — Threads API Overview](https://developers.facebook.com/documentation/threads/overview)
- [Meta — System Users overview](https://developers.facebook.com/docs/marketing-api/system-users/overview) · [System user tokens: instalación y refresh](https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens/) · [Business Manager get started](https://developers.facebook.com/docs/marketing-api/business-manager/get-started)
- [TikTok — Content Posting API get started](https://developers.tiktok.com/doc/content-posting-api-get-started/) · [Content Sharing Guidelines](https://developers.tiktok.com/doc/content-sharing-guidelines) · [upload video reference](https://developers.tiktok.com/doc/content-posting-api-reference-upload-video)
- [YouTube — quota and compliance audits](https://developers.google.com/youtube/v3/guides/quota_and_compliance_audits) · [videos.insert](https://developers.google.com/youtube/v3/docs/videos/insert) · [verificación por teléfono](https://support.google.com/youtube/answer/171664)
- [LinkedIn — Community Management Overview](https://learn.microsoft.com/en-us/linkedin/marketing/community-management/community-management-overview?view=li-lms-2026-06) · [rate limits](https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/rate-limits)
- [X API pricing](https://docs.x.com/x-api/getting-started/pricing) · [Pinterest rate limits](https://developers.pinterest.com/docs/reference/rate-limits/) · [Pinterest access tiers](https://developers.pinterest.com/docs/getting-started/access-tiers/)

### Postiz
- [System Requirements](https://docs.postiz.com/installation/system-requirements) · [Docker Compose](https://docs.postiz.com/installation/docker-compose) · [docker-compose.yaml (repo)](https://raw.githubusercontent.com/gitroomhq/postiz-app/main/docker-compose.yaml) · [Providers](https://docs.postiz.com/providers) · [Instagram provider](https://docs.postiz.com/providers/instagram) · [Channel Limits](https://docs.postiz.com/troubleshooting/channel-limits) · [Public API](https://docs.postiz.com/public-api) · [Installation Guide (mirror)](https://mintlify.wiki/gitroomhq/postiz-app/installation)
- [Lineserve — Install Postiz on VPS with Docker Compose](https://www.lineserve.net/blog/install-and-configure-postiz) *(tercero: RAM y stack de Temporal)* · [Pratik Pathak — Cheapest and safest way to host Postiz](https://pratikpathak.com/cheapest-and-safest-way-to-host-postiz/) *(tercero: truco de swap 2 GB)*
- [Hetzner CPX31 — precio de referencia vía agregador](https://www.whtop.com/plans/hetzner.com/128287) *(tercero, no cotización)*

### Políticas de plataforma y contenido IA
- [Meta Community Standards — Misinformation](https://transparency.meta.com/policies/community-standards/misinformation/) · [Inauthentic Behavior](https://transparency.meta.com/policies/community-standards/inauthentic-behavior/) · [Labeling AI Content](https://transparency.meta.com/governance/tracking-impact/labeling-ai-content/) · [Meta Terms of Service](https://www.facebook.com/terms)
- [TikTok Community Guidelines — archivo verbatim, OpenTermsArchive](https://github.com/OpenTermsArchive/contrib-versions/blob/main/TikTok/Community%20Guidelines.md) · [TikTok Newsroom, 19-nov-2025](https://newsroom.tiktok.com/more-ways-to-spot-shape-and-understand-ai-content?lang=en) · [TikTok Transparency — deceptive behavior](https://www.tiktok.com/safety/en-GB/transparency/tc-blog-3)
- [YouTube — divulgación de contenido alterado o sintético](https://support.google.com/youtube/answer/14328491) · [políticas de monetización (inauthentic content)](https://support.google.com/youtube/answer/1311392)
- [Comisión Europea — obligaciones de transparencia, art. 50 AI Act](https://digital-strategy.ec.europa.eu/en/faqs/transparency-obligations-under-article-50-ai-act)
- [Social Media Today — etiqueta "AI creator" de Instagram, 4-may-2026](https://www.socialmediatoday.com/news/instagram-adds-ai-creator-labels/819267/) · [MediaPost, 6-may-2026](https://www.mediapost.com/publications/article/414862/instagram-unveils-new-ai-creator-account-label.html)

### Meta Ads y acceso de socio
- [Roles del administrador comercial](https://es-la.facebook.com/business/help/442345745885606) · [Agregar socios](https://es-la.facebook.com/business/help/708679622611131) · [Permitir que un socio acceda a los activos](https://es-la.facebook.com/business/help/1717412048538897) · [Solicitar a un socio que comparta activos](https://www.facebook.com/business/help/408759743051505) · [Agregar personas a los activos](https://es-la.facebook.com/business/help/325571851329683) · [Agregar usuarios del sistema](https://es-la.facebook.com/business/help/503306463479099)
- [Agregar un método de pago](https://es-la.facebook.com/business/help/915454841921082) · [Pagar campañas con distintos métodos](https://es-la.facebook.com/business/help/401428293333537) · [Impuestos sobre anuncios](https://es-la.facebook.com/business/help/133076073434794)
- [Límites de gasto diario de Meta](https://www.facebook.com/business/help/563129151097553) · [Límite de gasto de la cuenta](https://www.facebook.com/business/help/141820733085330) · [Presupuestos diarios](https://es-la.facebook.com/business/help/190490051321426) · [Fase de aprendizaje](https://es-la.facebook.com/business/help/112167992830700) · [Ad Account Limits](https://www.facebook.com/business/help/1026272311098874) · [Ad account limit del portafolio](https://www.facebook.com/business/help/1253008271714847)

### Bolivia — normativa y mercado
- [DS 353, 4-nov-2009 — registro de titulares e IMEI (Lexivox)](https://www.lexivox.org/norms/BO-DS-N353.html)
- [DS 4326, 7-sep-2020 — Reglamento de Infracciones y Sanciones (Lexivox)](https://www.lexivox.org/norms/BO-RE-DS-N4326.html) *(compilador no oficial)*
- [VUCE Bolivia — ATT, autorización previa de importación de equipos de telecomunicaciones (RAR ATT-DJ-RAR-TL LP 443/2023)](https://www.vuce.gob.bo/es/ATT_autorizacion_previa_importacion_equipos_telecomunicaciones_procedimiento)
- [ATT — bloqueo de más de 400 líneas e IMEI usados en estafas](https://ahoraelpueblo.bo/index.php/nacional/seguridad/la-att-bloquea-mas-de-400-lineas-e-imei-utilizados-para-cometer-estafas)
- [Entel Bolivia — Móvil Prepago, tarifas](https://www.entel.bo/MovilPrepago)
- [Bolivia Tributaria — tratamiento tributario de las remesas al exterior (IUE-BE)](https://bibliotecatributariabolivia.com/2022/07/12/tratamiento-tributario-de-las-remesas-al-exterior/) · [El Deber](https://eldeber.com.bo/te-puede-interesar/tratamiento-tributario-de-las-remesas-al-exterior_285717/)
- [RedPlan Bolivia — precios social media](https://redplanbolivia.com/redes-sociales/precios/) · [Tarifario Community Manager Bolivia 2026](https://bolivia.aprender21.com/blog/tarifario-community-manager-bolivia)
- [Takenos — pagar anuncios en Meta desde Bolivia](https://help.takenos.com/en/articles/11421041-pagar-anuncios-en-meta-desde-bolivia) · [Rikcarez — cómo pagar Facebook Ads en Bolivia](https://rikcarez.com/como-pagar-facebook-ads-bolivia/)

### Granjas de dispositivos y hardware *(todas de vendedores de cloud phones o antidetect — sesgo declarado)*
- [GeeLark — How to Build a Phone Farm, 2026](https://www.geelark.com/blog/how-to-build-a-phone-farm/) · [Phone Farm vs Cloud Phone TCO](https://www.geelark.com/blog/phone-farm-vs-cloud-phone-complete-cost-comparison/) · [GeeLark Pricing](https://www.geelark.com/pricing/) · [Pixelscan — Phone Farming Explained](https://pixelscan.net/blog/phone-farming-explained-guide/)
- [Accio — Motherboard Box Phone Farm](https://www.accio.com/plp/motherboard-box-phone-farm) · [Alibaba — mobile motherboard wholesale](https://electronics.alibaba.com/product/mobile-motherboard-wholesale)
- [Made-in-China — GSM SIM Box VoIP Gateway 32 puertos](https://cnetross.en.made-in-china.com/product/OSomfpPGJWUH/China-GSM-SIM-Box-VoIP-Gateway-32-Port-512sims.html) · [Ejointech — SIM Bank 128 slots](https://ejointech.cn/products/128-sim-slots-sim-pool) · [Alibaba — SIM Bank price guide](https://electronics.alibaba.com/buyingguides/sim-bank-price-guide-what-you-actually-pay-why)

### Costos de producción y APIs gestionadas
- [Higgsfield — pricing plans](https://geo.higgsfield.ai/task/blog/higgsfield-ai-pricing-plans) · [Scopeful, jul-2026](https://www.scopeful.org/tools/higgsfield) · [Flowith — Higgsfield pricing 2026](https://flowith.io/blog/higgsfield-pricing-2026-free-vs-creator-vs-studio/) · [vo3ai](https://www.vo3ai.com/higgsfield-ai-pricing) *(los tres, terceros — costo de video no verificado en nuestra cuenta)*
- [BIGVU — ElevenLabs pricing 2026](https://bigvu.tv/blog/elevenlabs-pricing-2026-plans-credits-commercial-rights-api-costs/)
- [Ayrshare Pricing](https://www.ayrshare.com/pricing/) · [bundle.social vs Ayrshare](https://info.bundle.social/comparison/ayrshare) · [Postproxy — scheduling APIs comparadas](https://postproxy.dev/blog/best-social-media-scheduling-apis-compared/) *(comparativas de competidores, no fuente primaria)*

---

## Lo que NO pude verificar — para que nadie lo repita como dato

| Afirmación | Estado |
|---|---|
| Cifras del límite de gasto diario de cuentas nuevas de Meta (USD 25/50/250/750) | **Meta no las publica.** Todo número que circule es de terceros sin cita oficial |
| Costo en créditos de los modelos de **video** de Higgsfield | Derivado de terceros. **Nuestra cuenta no tiene ninguna transacción de video en las últimas 145** |
| Límite de líneas prepago por cédula en Bolivia (se dice 3) | Solo en blogs comerciales. **No está en ninguna resolución ATT ni en el Reglamento RE016** |
| Numeración exacta de artículos del DS 4326 | Verificado solo en Lexivox (compilador **no oficial**). Sin caso público boliviano de SIM box desarticulado |
| Límite de 25 cuentas de Instagram por Business Portfolio | Viene de blogs de herramientas multicuenta, varios de los cuales venden "bypass". **No usar como plan** |
| Ingresos de Lil Miquela, Aitana López y Lu do Magalu | Blogs de marketing sin fuente primaria. **No usar en propuestas a clientes** |
| Sanciones de la FTC y ley de Nueva York sobre performers sintéticos | No verificable en ftc.gov ni en el texto de la ley |
| Migración forzada de tarjeta a facturación mensual para cuentas de alto gasto desde 1-abr-2026 | Una sola fuente (Opalspend), sin confirmar en el centro de ayuda de Meta |
| Benchmarks de CPM/CPC específicos de Bolivia | **No existen publicados.** Lo más cercano: mercados emergentes CPC USD 0,20–1,50, CPM USD 3–12 (Bs 34–137/mil impresiones). Orden de magnitud, **nunca promesa a un cliente** |
| Verificación de que la etiqueta de IA no degrada el alcance | Meta lo dice en prensa secundaria, no en una página oficial. **Tratar como riesgo real, no como mito** |
| Norma boliviana de etiquetado de contenido IA | **No encontré ninguna publicada.** Aplica la vía general de publicidad engañosa y derechos de imagen |
