# Hero de portada — investigación de competencia y propuestas para Onia

Fecha: 2026-08-15
Carril: research-estrategia (I) — investigación pura, sin tocar código.
Pedido de Sergio: que el hero de la portada **muestre más el valor que genera** el producto,
y mirar más competidores.

## Alcance y método

- **Tarea 1**: análisis de las 8 páginas ya scrapeadas en la raíz del repo (HTML estático,
  capturado 2026-07-27). Se extrajo el bloque del hero directamente del HTML.
- **Tarea 2**: investigación web en vivo (2026-08-15) del software de gestión pyme de LatAm
  y de Bolivia — que es el competidor real de Onia, no el fintech.
- **Tarea 3 y 4**: patrón con evidencia y 5 propuestas de hero.

**Advertencia de honestidad sobre el material scrapeado**: los 8 archivos de la raíz son
mayormente **fintech y marketplaces** (Konfío, Clara, Bitso, Rappi, Kavak, Jeeves). Son útiles
para leer estructura de hero, no para leer el mercado de Onia. Por eso la Tarea 2 pesa más.

---

## 1. Heroes ya scrapeados (archivos de la raíz del repo)

| # | Archivo / sitio | Titular exacto | Subtítulo exacto | CTA | Prueba o cifra en el hero | Tipo de visual |
|---|---|---|---|---|---|---|
| 1 | `raw_www.siigo.com.html` — siigo.com | "Siigo, sistema administrativo y contable 100% en la nube" | "Administra tu empresa de forma integral: facturación, nómina, impuestos y reportes automáticos, autorizados por la DIAN." | "¡Comprar ahora!" (primario) · "Para una asesoría gratuita, ¡déjanos tus datos!" (secundario) | Aval regulatorio ("autorizados por la DIAN") en el subtítulo. La cifra "300 mil empresas confían en nosotros" está **debajo** del hero, no en él | **Banner de campaña** (aniversario, "¡Mega Weekend con hasta 20% DCTO!"). No es producto ni persona: es promoción |
| 2 | `raw_www.konfio.mx.html` — konfio.mx | `<h1>` real es el rótulo de categoría: "Crédito Empresarial". El titular visual (h2, tamaño display) es: "Tu crédito, al doble. De $5 a $10 millones" | "Un crédito que sigue creciendo con tu empresa" | "Empieza hoy" | **La cifra ES el titular**: "$5 a $10 millones". Refuerzo abajo: "Convierte hasta el 40% de tu línea en SPEI, 24/7 y sin salir de la app" | **Video** en loop (mp4 servido desde Storyblok) |
| 3 | `s_clara.com_.html` — clara.com | "The partner to Latin America's leading finance teams" | "From corporate cards to vendor payments, Clara centralizes and simplifies your spend management with AI-powered efficiency and control" | Botones de país / acceso (el hero está construido sobre un selector de mercado) | Prueba **cualitativa**, no numérica: "Latin America's leading finance teams". Hay un contenedor de stats (`fbl-hero-7-stat-item`) que en el HTML estático sólo rinde banderas de país — las cifras se inyectan por JS | **Dato/marca institucional** (banderas + tipografía grande). No hay screenshot de producto en el HTML capturado |
| 4 | `s_www.dapta.ai_.html` — dapta.ai | "Close Deals Faster With AI Sales Agents" | "The all-in-one conversational AI voice and text agent platform built for SMBs" | Botón de arranque de agente (Elementor); el gancho operativo es el chip "2 min to first AI agent" | Tres pruebas juntas en el hero: **"4.7"** (rating), **"Trusted by 50,000+ companies"**, **"2 min to first AI agent"** | **Dato** (chips de prueba) sobre fondo oscuro con acento verde |
| 5 | `s_bitso.com_.html` — bitso.com | "Discover what your money is capable of" (carrusel; slide 2: "5,000 stocks to grow your portfolio"; slide 3: "Beyond stocks. Beyond hours"; slide 4: "New Bitso app: powerfully simple") | "One app, every opportunity to build your future. Invest, earn, and send money in just a few taps." | "Open your account" · "Download the app now" | La cifra de catálogo ("5,000 stocks", "more than 300 perpetual markets") usada como prueba de amplitud | **Producto** (app móvil) en carrusel de heroes rotativos |
| 6 | `s_www.rappi.com_.html` — rappi.com | **No hay `<h1>`.** El titular visible es "Si tienes Rappi, tienes Todo." | No hay subtítulo: debajo va directo el **campo de dirección** ("Usa tu ubicación actual") | El CTA real es el buscador de ubicación. CTAs secundarios: "Descargar", "Registra tu restaurante", "Registra tu comercio", "¡Regístrate ahora!" | "+40.000 aliados en 9 países" (en el bloque de captación de comercios, no en el hero de consumo) | **Herramienta** (input de dirección) + carrusel de logos de marcas ("¡Los 10 más elegidos!") |
| 7 | `s_www.kavak.com_mx.html` — kavak.com/mx | "Compra y venta de autos. Financiamiento a tu medida" | Sin subtítulo de prosa: debajo van las 3 pestañas de acción "Compra · Vende · Cambia" y un buscador | Buscador (CTA principal) · "Simular" · "Acceder" | "Descubre por qué más de 300,000 clientes ya confiaron en Kavak" · promesa de tiempo: "Arma tu presupuesto en solo 2 minutos" | **Herramienta** (buscador de catálogo) |
| 8 | `s_www.tryjeeves.com_.html` — tryjeeves.com | "Power Over Your Money." | "You don't just manage expenses, you command power. Jeeves is the financial operating system built for modern finance teams." | "Apply now" (primario) · "Customer Log In" (secundario) | **Ninguna cifra en el hero.** Sólo tres chips cualitativos: "Unlimited Cards · Instant Payments · Full Control" | **Tipografía / declaración de marca** (sin producto ni persona) |

### Lo que ya se ve en esta tanda

- **2 de 8 ponen una cifra dentro del titular** (Konfío con el monto del crédito; Bitso con el
  catálogo). El resto pone la cifra abajo, o no la pone.
- **3 de 8 reemplazan el CTA por una herramienta** (Rappi y Kavak con buscador, Dapta con
  "2 min to first AI agent"). Eso baja la fricción mucho más que un botón "Contáctanos".
- **Siigo, el más parecido a Onia, tiene el hero más débil**: titula la categoría, no el valor,
  y el visual es un banner de descuento.

---

## 2. Competencia directa: software de gestión pyme en LatAm y Bolivia

Verificado en vivo el 2026-08-15.

### 2.1 Regional

| Producto | URL | Titular exacto | Subtítulo | CTA | Prueba / cifra | Visual |
|---|---|---|---|---|---|---|
| **Siigo** (CO) | https://www.siigo.com/ | "Siigo, sistema administrativo y contable 100% en la nube" | "Administra tu empresa de forma integral: facturación, nómina, impuestos y reportes automáticos, autorizados por la DIAN." | "¡Comprar ahora!" · "Para una asesoría gratuita, ¡déjanos tus datos!" | "300 mil empresas confían en nosotros" (bajo el hero) | Banner de campaña |
| **Siigo Contífico** (EC) | https://www.siigo.com/ec/ | "Software Administrativo y Contable de Siigo Contífico" | Tres bullets: "Administra tu empresa y factura electrónicamente desde cualquier lugar." · "Cumple con las normativas fiscales exigidas por el SRI en Ecuador." · "Fácil de usar y con soporte ilimitado." | "¡Quiero más información!" · "¡Empezar a usarlo!" | "96% de satisfacción" · "Más de 43.000 Empresarios y contadores creciendo con nosotros" | Screenshot de dashboard |
| **Alegra** (CO) | https://www.alegra.com/colombia/ | "SOFTWARE DE GESTIÓN PARA CONTADORES Y PYMES" | "Ahora puedes mover tu negocio al ritmo que quieres" | "Prueba 15 días gratis" · "Llámanos sin compromiso al 323 254 0794" | "100% avalado ante la DIAN. Prueba gratis 15 días, sin tarjeta" | Screenshot de producto |
| **Defontana** (CL) | https://www.defontana.com/cl | "El sistema ERP con IA que impulsa el crecimiento empresarial" | "El software ERP con Inteligencia Artificial integrada de Defontana está diseñado para que cada empresa, sin importar su tamaño, pueda acceder a una solución." | "¡Cotiza ahora!" | "Más de 40.000 empresas en Latinoamérica confían en nuestro sistema ERP Defontana" (bajo el hero) | Screenshot de producto |
| **Defontana Emprendedor** | https://www.defontana.com/cl/emprendedor | Producto gratuito posicionado como "el ERP gratuito más completo" | Plan gratis: hasta 20 DTE mensuales, 5 millones de facturación, 1 usuario, 1 empresa | "Comienza hoy" | El propio plan gratis es la prueba | Producto |
| **Nubox** (CL) | https://www.nubox.com/ | "Los software de contabilidad, remuneraciones y facturación más simples para Contadores y PYMEs en Chile" | "Automatiza tu gestión y asegura el cumplimiento normativo, con Nubox: Tecnología simple, soporte humano y resultados reales." | "Cotiza ahora" · "Contrata online" | Contadores animados en el hero: usuarios activos, años de experiencia, clientes activos | **Foto de persona** con laptop + screenshot de conciliación bancaria (calce de $500.000) — el único de la lista que muestra una acción concreta del producto sobre la foto |
| **Bind ERP** (MX) | https://bind.com.mx/ | No verificable en vivo: el dominio devuelve un muro "Bot Verification". Posicionamiento indexado: "el sistema de gestión y facturación en la nube que te da el control para hacer crecer y digitalizar tu negocio"; "el ERP en la nube #1 para las Pymes en México"; "0% técnico y 100% en español" | — | — | Reclamo de liderazgo ("#1") sin número | — |
| **Loyverse** | https://loyverse.com/es | "Punto de venta gratuito y Gestión de Inventario" | "Convierte tu smartphone o tablet en un potente TPV. Gestione las ventas, el inventario y a los empleados con total facilidad." | "Comenzar" (+ "chat en vivo") | "Más de 1,000,000 negocios en 170 países se han registrado en Loyverse TPV" · "disponible en más de 30 idiomas" | Producto (app en celular) |
| **Zoho One** | https://www.zoho.com/one/ | "Zoho One: el sistema operativo para las empresas" | "Simplifica la gestión de datos, mejora la toma de decisiones y alcanza nuevos niveles de productividad a través de una suite unificada de aplicaciones integradas entre sí." | "ACCEDE A TUS APPS" (+ "Pruébalo durante 30 días", "Sin necesidad de tarjeta de crédito", "Soporte y formación gratuitos") | 4.5/5 sobre 19.000+ reseñas · 75.000+ usuarios · 45+ apps · 1.000+ integraciones | Ilustración ("SO unificado para empresas") |

**Hallazgo de mercado**: **Contífico ya no existe como marca independiente.** `contifico.com` devuelve
un **301 a `siigo.com/ec`** y el producto se llama ahora "Siigo Contífico". Es decir, el mercado
de software contable andino se está consolidando bajo Siigo. Onia no compite contra 8 players
regionales, compite contra **Siigo con 8 caras**.

### 2.2 Bolivia (los competidores que realmente pelean el mismo cliente)

| Producto | URL | Titular exacto | Subtítulo / promesa | CTA | Prueba / cifra | Visual |
|---|---|---|---|---|---|---|
| **Kraken** | https://kraken.bo/ | Sin hero renderizado en el HTML (SPA que arma todo por JS). El posicionamiento vive en el `<meta description>`: "Kraken centraliza facturacion electronica SIAT, ventas, inventario, POS y cobros QR para negocios en Bolivia." | — | — | Ninguna | — (el HTML servido pesa 3 KB: un cascarón) |
| **Facturación Fácil** | https://facturacion-facil.com.bo/ | "Facturación Electrónica Legal, Rápida y Segura" | Emitir facturas, gestionar clientes y automatizar contabilidad desde la nube, cumpliendo la normativa SIAT Bolivia, con soporte técnico especializado | "Solicitar Demo Gratis" · "Ver Planes y Precios" | "50K+ Facturas emitidas" · "99.9% Uptime garantizado" · "500+ Empresas activas" · "24/7 Soporte técnico" | **El mejor visual de Bolivia**: una factura electrónica simulada (Nº 002847, Mi Empresa S.R.L., IVA y total en Bs, códigos de control SIAT) con el sello "¡Factura Autorizada!" y timestamp. Es el único hero del país que muestra **algo que ya pasó**, no una pantalla vacía |
| **YoFacturo** | https://yo-facturo.com/bo/ | "Facturación electrónica en Bolivia" | "Emití facturas electrónicas válidas ante el SIN a través del SIAT: factura en línea, computarizada en línea y con Código Único de Facturación (CUF). Gestión, stock y punto de venta en una sola plataforma. Sumate a la lista de espera." | "Probá 1 Mes" · "Sumarme a la lista de espera" | Ninguna | Sólo el logo. Hero sin imagen de producto |
| **Codex (Sinergya)** | https://sinergyasoftware.com/codex-facturacion | "Facturación en Formato Electrónico." | "Emite facturas y controla tus ventas con el software líder. Garantizamos emisión en línea y fuera de línea sin interrupciones." | "Prueba el Sistema" · "Ver Funciones" | En el hero, ninguna. Más abajo: "95% Menos multas por parte de Impuestos" (sin fuente ni metodología visible) | Screenshot de factura |

**Lectura del mercado boliviano**: los cuatro venden **la obligación fiscal**, no el negocio.
Tres de los cuatro titulan literalmente la palabra "facturación". Ninguno menciona agenda,
cobranza, recordatorios ni agentes. El único que se acerca al alcance de Onia es Kraken
(SIAT + ventas + inventario + POS + QR) — y ni siquiera renderiza un hero.

---

## 3. El patrón (con evidencia)

### 3.1 ¿Cómo expresan valor los que mejor lo hacen?

Cuatro maneras, en orden de fuerza observada:

| Ángulo de valor | Quién lo usa | Evidencia textual |
|---|---|---|
| **Cumplimiento fiscal** (el más usado en LatAm) | Siigo, Alegra, Contífico, Nubox, y los 4 bolivianos | "autorizados por la DIAN" (Siigo) · "100% avalado ante la DIAN" (Alegra) · "Cumple con las normativas fiscales exigidas por el SRI" (Contífico) · "asegura el cumplimiento normativo" (Nubox) · "Legal, Rápida y Segura" (Facturación Fácil) |
| **Control / poder sobre el negocio** | Jeeves, Bind, Zoho One | "Power Over Your Money." (Jeeves) · "te da el control para hacer crecer y digitalizar tu negocio" (Bind) · "el sistema operativo para las empresas" (Zoho One) |
| **Automatización / menos trabajo manual** | Nubox, Siigo | "Automatiza tu gestión" (Nubox) · "reportes automáticos" (Siigo) |
| **Velocidad al primer resultado** | Dapta, Kavak | "2 min to first AI agent" (Dapta) · "Arma tu presupuesto en solo 2 minutos" (Kavak) |

**Ahorro de plata explícito: casi nadie.** El único que pone dinero en el titular es Konfío
("De $5 a $10 millones"), y no es ahorro: es el producto mismo. **Plata recuperada: nadie.**
**Menos errores: sólo uno, y de refilón** (Codex, "95% Menos multas", sin fuente y fuera del hero).

### 3.2 ¿Usan cifras concretas? ¿Cómo las respaldan?

Sí, pero casi todas las cifras son **del proveedor, no del cliente**:

| Tipo de cifra | Ejemplos | ¿Respaldada? |
|---|---|---|
| **Tamaño del proveedor** (la abrumadora mayoría) | "300 mil empresas" (Siigo) · "Más de 43.000 Empresarios y contadores" (Contífico) · "Más de 40.000 empresas" (Defontana) · "Más de 1,000,000 negocios en 170 países" (Loyverse) · "Trusted by 50,000+ companies" (Dapta) · "más de 300,000 clientes" (Kavak) · "+40.000 aliados en 9 países" (Rappi) · "500+ Empresas activas / 50K+ Facturas emitidas" (Facturación Fácil) | **No.** Ninguna enlaza a metodología ni auditoría. Es un número autoreportado |
| **Rating de terceros** | "4.7" (Dapta) · "4.5/5 sobre 19.000+ reseñas" (Zoho One) · "96% de satisfacción" (Contífico) | Parcialmente: el rating de Zoho es rastreable a directorios de reseñas; el 96% de Contífico no dice de dónde sale |
| **Cifra de producto** | "De $5 a $10 millones" (Konfío) · "5,000 stocks" (Bitso) · "20 DTE mensuales / 5 millones de facturación" (Defontana Emprendedor) | **Sí, por construcción**: es una característica verificable del producto, no una estadística |
| **Cifra de resultado del cliente** | "95% Menos multas" (Codex) — **único caso encontrado en todo el barrido** | **No.** Sin muestra, sin período, sin fuente |
| **Tiempo al primer valor** | "2 min to first AI agent" (Dapta) · "2 minutos" (Kavak) | **Sí, por construcción**: es una promesa de producto verificable en el acto |

**Conclusión operativa para Onia**: el estándar de la industria para la cifra del hero es
**tamaño del proveedor**, que Onia no puede usar (cero clientes pagando). Pero la segunda
categoría más fuerte — **cifra de producto y tiempo al primer valor** — no requiere clientes.
Es el carril que Onia sí puede correr **hoy, sin mentir**.

### 3.3 ¿Qué verbo / promesa domina el titular?

- **En el software pyme LatAm domina el sustantivo, no el verbo.** Siigo, Alegra, Loyverse,
  Nubox, Zoho One y los cuatro bolivianos titulan **la categoría**: "sistema administrativo y
  contable", "SOFTWARE DE GESTIÓN", "Punto de venta gratuito y Gestión de Inventario",
  "Facturación electrónica en Bolivia". Es un titular escrito **para Google, no para el dueño
  del negocio**. Cuando aparece verbo, va en el subtítulo: **"Administra"** (Siigo, Contífico),
  **"Automatiza"** (Nubox), **"Emite" / "controla"** (Codex), **"Convierte"** (Loyverse),
  **"Simplifica"** (Zoho One).
- **En fintech domina el verbo de poder**: "Discover what your money is capable of" (Bitso),
  "Power Over Your Money" (Jeeves), "Close Deals Faster" (Dapta).
- **La única promesa transversal es el CUMPLIMIENTO**: aparece en 9 de los 13 sitios de
  software revisados.

### 3.4 Lo que NO hace ninguno — el hueco de Onia

Cinco huecos verificados, en orden de tamaño:

1. **Nadie vende trabajo hecho; todos venden una herramienta.** Cero titulares dicen qué tarea
   deja de hacer el humano. Lo más cerca es "Automatiza tu gestión" (Nubox), que sigue siendo
   abstracto. Onia tiene agentes que **recuerdan citas y cobran deudas** — eso es una tarea con
   nombre y apellido, y ningún competidor la nombra.
2. **En Bolivia nadie nombra agentes de IA.** Los cuatro bolivianos hablan de emitir facturas.
   Defontana es el único regional que pone "IA" en el titular, y de forma genérica ("ERP con IA
   que impulsa el crecimiento"). Dapta sí vende agentes, pero en inglés, para SMB de EE. UU. y
   sólo de ventas.
3. **Nadie muestra un resultado en el visual.** 11 de 13 muestran una pantalla vacía, una foto
   de stock o una ilustración. La única excepción del país es Facturación Fácil, con su
   "¡Factura Autorizada!". Onia puede mostrar el equivalente: **una cita confirmada, una deuda
   cobrada, un QR pagado.**
4. **Nadie habla del costo de no tenerlo.** Todo el mercado habla del beneficio de comprar.
   Nadie pone en el hero lo que el negocio ya está perdiendo cada mes.
5. **Nadie promete velocidad al primer valor en LatAm pyme.** Dapta y Kavak lo hacen en otras
   categorías y funciona. En software de gestión boliviano no lo hace ninguno: el CTA típico es
   "Solicitar Demo" o "Cotiza ahora" — o sea, **hablar con un vendedor antes de ver nada**.

---

## 4. Cinco propuestas de hero para Onia

**Regla dura aplicada**: ninguna propuesta usa una cifra de clientes, testimonios ni resultados
de Onia. Onia no tiene clientes pagando. Las cifras que aparecen son (a) **de producto**
—verificables en el acto— o (b) **del costo que el negocio ya sufre**, con fuente citada y
marcada. Las que dependen de un dato del producto que hay que confirmar están señaladas.

### Propuesta 1 — "El trabajo hecho" (recomendada)

> **Titular**: Tu clínica no pierde citas mientras dormís.
> **Subtítulo**: Onia te recuerda cada cita, cobra cada deuda vencida y factura al SIAT sin que
> nadie tenga que abrir WhatsApp. Vos revisás; el sistema hace.
> **CTA**: Ver cómo trabaja Onia · (secundario) Empezar con mi rubro

- **Ángulo**: trabajo hecho, no herramienta comprada.
- **Por qué gana**: es el hueco #1. Ni un competidor nombra la tarea que deja de hacer el
  humano. "Sin que nadie tenga que abrir WhatsApp" es concreto y verificable, y en Bolivia el
  cobro por WhatsApp es literalmente el proceso actual.
- **Variante por rubro**: la primera línea se cambia por rubro sin tocar el resto ("Tu
  ferretería no pierde cobranzas...", "Tu veterinaria no pierde citas..."). Onia ya vende por
  rubro, así que el hero puede rotar el sustantivo.
- **Riesgo**: exige que la demo muestre el agente funcionando. Si no, es promesa vacía.

### Propuesta 2 — "El costo que ya estás pagando"

> **Titular**: Las sillas vacías te salen más caras que el sistema.
> **Subtítulo**: Entre 15% y 30% de las citas se pierden por inasistencia. Onia recuerda cada
> una por WhatsApp, reagenda sola y te muestra la agenda llena antes de que abras.
> **CTA**: Calcular lo que pierdo al mes · (secundario) Ver Onia por dentro

- **Ángulo**: costo de no tenerlo (hueco #4).
- **Cifra y fuente**: el rango 15%-30% de inasistencia en consultorios dentales es un benchmark
  publicado de la industria (ver Fuentes, sección 5). **Es dato de EE. UU., no de Bolivia** —
  debe ir con la fuente enlazada y el país explícito, o no ir. **Nunca presentarlo como dato de
  Onia ni como dato boliviano.**
- **Por qué gana**: es el único ángulo que le habla al bolsillo del dueño en la primera línea, y
  ningún competidor lo usa. El CTA "Calcular lo que pierdo al mes" reemplaza el botón por una
  **herramienta** — el movimiento que le funciona a Rappi, Kavak y Dapta.
- **Riesgo**: si Sergio no quiere depender de un dato extranjero, se corre la cifra al cuerpo de
  la página y el titular queda igual de fuerte sin ella.

### Propuesta 3 — "Un solo sistema, todos los rubros"

> **Titular**: Un solo sistema para tu negocio, hecho para Bolivia.
> **Subtítulo**: Agenda, clientes, inventario, cobros por QR y facturación al SIAT en la misma
> plataforma — con módulos listos para clínica, tienda, importadora, estética, veterinaria,
> servicios y ganadería.
> **CTA**: Elegir mi rubro · (secundario) Ver planes

- **Ángulo**: alcance + localización. Es el ángulo de Zoho One ("el sistema operativo para las
  empresas") pero aterrizado a Bolivia.
- **Por qué gana**: los cuatro bolivianos titulan "facturación". Onia titula "negocio". El
  contraste es inmediato y **cero riesgo de exageración**: son módulos que existen.
- **CTA "Elegir mi rubro"**: convierte el hero en herramienta (patrón Rappi/Kavak) y segmenta
  al visitante en el primer clic.
- **Verificar antes de publicar**: que los siete rubros listados estén realmente encendidos en
  producción. Según el estado del repo son seis los vendibles más ganadería recién encendida —
  **no listar un rubro que no se pueda entregar el mismo día**.

### Propuesta 4 — "Velocidad al primer valor"

> **Titular**: Tu primer recordatorio sale hoy, no el mes que viene.
> **Subtítulo**: Cargás tu agenda y tus clientes, elegís tu rubro y Onia empieza a recordar
> citas y cobrar deudas el mismo día. Sin consultor, sin implementación de tres meses.
> **CTA**: Empezar ahora · (secundario) Hablar con alguien

- **Ángulo**: tiempo al primer valor (hueco #5), el patrón de Dapta ("2 min to first AI agent")
  y Kavak ("2 minutos").
- **Por qué gana**: ataca directamente el CTA del mercado boliviano, que es "Solicitar Demo" /
  "Cotiza ahora". Todos obligan a hablar con un vendedor antes de ver algo. Onia invierte eso.
- **Cifra**: se puede endurecer a un número exacto ("en 20 minutos", "el mismo día") **sólo si
  el onboarding real lo aguanta cronometrado**. Es una cifra de producto, no una estadística:
  se prueba haciéndolo. **Cronometrar antes de escribirla.**
- **Riesgo**: si el alta real toma dos días, esto quema la credibilidad de entrada.

### Propuesta 5 — "La fecha" (campaña con vencimiento)

> **Titular**: Desde el 1 de octubre, tu factura tiene que salir en línea.
> **Subtítulo**: Onia emite al SIAT, cobra por QR y además te recuerda las citas y persigue las
> deudas. El cumplimiento es el piso, no el producto.
> **CTA**: Ver si mi negocio está listo · (secundario) Empezar ahora

- **Ángulo**: urgencia regulatoria real, con fecha verificable.
- **Cifra y fuente**: el SIN amplió hasta el **30 de septiembre de 2026** el plazo de adecuación
  a Facturación en Línea para los contribuyentes del 9° al 12° grupo (RND 102600000007);
  **desde el 1 de octubre de 2026** deben emitir exclusivamente por la modalidad asignada.
  Fuente en la sección 5. **Verificar la RND y el grupo exacto con la skill
  `onia-contabilidad-bolivia` antes de publicar** — una fecha mal citada en el hero es un
  problema legal, no de copy.
- **Por qué gana**: es el ángulo que todo Bolivia usa (cumplimiento) pero **con fecha**, y con
  el remate que ninguno tiene: "el cumplimiento es el piso, no el producto". Posiciona a Onia
  arriba de Facturación Fácil, YoFacturo y Codex en la misma frase.
- **Riesgo**: es un hero con fecha de vencimiento. Sirve como campaña, **no como hero
  permanente**. Y va contra la regla de la memoria de Onia: prohibido vender "obligatorio por
  ley" como si el portal gratis del SIN no existiera. Redactado así —la obligación es contexto,
  no amenaza— cumple, pero hay que cuidarlo.

### Cuadro de decisión

| # | Ángulo | Cifra que usa | ¿Bloqueada por algo? | Vida útil |
|---|---|---|---|---|
| 1 | Trabajo hecho | Ninguna | No | Permanente |
| 2 | Costo que ya pagás | 15%-30% inasistencia (EE. UU., citada) | Decisión: usar o no dato extranjero | Permanente |
| 3 | Un sistema, todos los rubros | Lista de rubros (de producto) | Confirmar rubros encendidos en prod | Permanente |
| 4 | Velocidad al primer valor | Tiempo de alta (de producto) | Cronometrar el onboarding real | Permanente |
| 5 | La fecha | 1-oct-2026 (RND) | Verificar RND y grupo con fiscal | Hasta oct-2026 |

### Lo que el hero de Onia NO puede decir (hasta tener clientes)

- Ninguna variante de "X empresas confían en nosotros" — es el estándar del mercado y es
  exactamente el que Onia no puede usar.
- Ningún porcentaje de mejora atribuido a Onia ("reduce X% las inasistencias", "recupera X% de
  la mora"). Ni con asterisco.
- Ningún logo de cliente, testimonio ni caso.
- Ningún "#1", "líder" ni "el más usado".
- Nada de "obligatorio por ley" presentado como si el Portal Web gratuito del SIN no existiera.

### Recomendación de visual (aplica a las 5)

El hueco #3 dice que ningún competidor muestra un resultado. La recomendación es **no** poner un
dashboard vacío ni una foto de stock, sino **el equivalente al "¡Factura Autorizada!" de
Facturación Fácil**, pero de la capa que sólo Onia tiene: una tarjeta de agente mostrando
"Recordatorio enviado — cita confirmada" o "Cobro enviado — pagado por QR", con hora y monto en
Bs. Datos de demo claramente rotulados como demo. Es el único visual del país que muestra que
**algo pasó solo**.

---

## 5. Fuentes

Competencia scrapeada (HTML local, capturado 2026-07-27, en la raíz del repo):
`raw_www.siigo.com.html`, `raw_www.konfio.mx.html`, `s_clara.com_.html`, `s_www.dapta.ai_.html`,
`s_bitso.com_.html`, `s_www.rappi.com_.html`, `s_www.kavak.com_mx.html`, `s_www.tryjeeves.com_.html`.

Competencia verificada en vivo (2026-08-15):

- Siigo — https://www.siigo.com/
- Siigo Contífico (Ecuador) — https://www.siigo.com/ec/ (`contifico.com` redirige 301 aquí)
- Alegra Colombia — https://www.alegra.com/colombia/ (la raíz `alegra.com` es selector de país)
- Defontana Chile — https://www.defontana.com/cl
- Defontana Emprendedor (plan gratis) — https://www.defontana.com/cl/emprendedor
- Nubox — https://www.nubox.com/
- Bind ERP — https://bind.com.mx/ (bloqueado por verificación anti-bot; posicionamiento tomado de
  https://bind.com.mx/erp/pymes y del índice de búsqueda)
- Loyverse — https://loyverse.com/es
- Zoho One — https://www.zoho.com/one/
- Kraken (Bolivia) — https://kraken.bo/ (SPA sin hero server-rendered; texto tomado del meta description)
- Facturación Fácil (Bolivia) — https://facturacion-facil.com.bo/
- YoFacturo (Bolivia) — https://yo-facturo.com/bo/
- Codex / Sinergya (Bolivia) — https://sinergyasoftware.com/codex-facturacion

Cifras externas citadas en las propuestas:

- Inasistencia en consultorios dentales: benchmark de industria de 15% promedio, hasta 30% en
  algunas consultas — https://clerri.com/blog/dental-patient-no-show-statistics ·
  estudio Sesame Communications sobre 1.604.184 citas en 64 consultorios, reducción de 22,95% en
  inasistencias tras recordatorios automáticos —
  https://us.dental-tribune.com/news/study-reveals-how-automated-patient-appointment-reminders-affect-dental-practice-no-show-rates-and-production/
  **Ambas son de EE. UU. Nunca presentarlas como dato boliviano ni como resultado de Onia.**
- Facturación en Línea Bolivia, ampliación a 30-sep-2026 y obligatoriedad desde 1-oct-2026 para
  contribuyentes del 9° al 12° grupo (RND 102600000007) —
  https://gosocket.net/centro-de-recursos/nuevo-plazo-para-implementar-la-modalidad-de-facturacion-en-linea-para-el-9-10-11-y-12-grupo-de-contribuyentes/
  · normativa oficial: https://www.impuestos.gob.bo/index.php/rnd-2026/
  **Verificar la RND y el grupo con la skill `onia-contabilidad-bolivia` antes de publicar.**

## 6. El hero actual de Onia, medido contra el patrón

Fuente: `web-factory/apps/onia-platform/src/components/landing/hero.tsx` (89 líneas).

| Elemento | Texto actual |
|---|---|
| Kicker | "Onia Platform · hecho en Bolivia" |
| Titular | "El sistema de gestión **con IA** para tu negocio en Bolivia." |
| Subtítulo | "Agenda, clientes, cobros y agentes que trabajan 24/7 con tu aprobación. Una sola cuenta, un solo precio." |
| CTA | "Probar gratis 14 días" (primario) · "Ver cómo funciona" (secundario) |
| Chips | "Sin tarjeta" · "Migramos tus datos" · "Desde Bs 320/mes" |
| Visual | Maqueta del panel (rotulada como maqueta en el código): agenda del día + una fila del agente Recall — "C. Vaca sin volver hace 6 meses — mensaje listo, falta tu OK" + módulos encendidos |

**Diagnóstico contra la evidencia de este documento:**

1. **El titular cae en la trampa de la categoría.** "El sistema de gestión con IA para tu negocio
   en Bolivia" es estructuralmente el mismo titular que Defontana: "El sistema ERP con IA que
   impulsa el crecimiento empresarial". Nombra la categoría y le agrega "IA" — exactamente el
   patrón que la sección 3.3 identifica como escrito para Google, no para el dueño. No diferencia.
2. **El valor real ya está escrito, pero en el segundo renglón.** "Agentes que trabajan 24/7 con
   tu aprobación" es precisamente el hueco #1 que ningún competidor ocupa. Está en el subtítulo,
   donde pesa menos. **La corrección más barata y de mayor impacto es subir esa idea al titular**
   — que es lo que hace la Propuesta 1.
3. **El visual ya gana.** La fila de Recall ("mensaje listo, falta tu OK") es el equivalente al
   "¡Factura Autorizada!" de Facturación Fácil, y es más fuerte: muestra trabajo **ya hecho por
   el sistema**, no un documento emitido por el humano. Ningún competidor de la lista tiene algo
   así. **No tocarlo**; sólo reemplazar la maqueta por captura real cuando exista la cuenta demo.
4. **El CTA ya está por encima del mercado.** "Probar gratis 14 días" + "Sin tarjeta" evita el
   muro de vendedor que usan los cuatro bolivianos ("Solicitar Demo", "Cotiza ahora") y compite
   de frente con Alegra (15 días) y Zoho One (30 días). Confirma que la Propuesta 4 es viable sin
   cambiar producto.
5. **"Desde Bs 320/mes" es la clase correcta de cifra**: de producto, verificable, sin depender
   de clientes. Mantenerla.

**Recomendación concreta**: mantener kicker, CTA, chips y visual como están; cambiar sólo el
titular y ajustar el subtítulo. Las Propuestas 1 y 4 son las que menos tocan y más mueven.

## 7. Limitaciones de esta investigación

- Kraken (kraken.bo) y Bind ERP (bind.com.mx) no pudieron leerse completos: el primero es una SPA
  que no sirve contenido en el HTML, el segundo tiene un muro anti-bot. Para cerrarlos hace falta
  un navegador real (Chrome MCP o el skill `browse`).
- Las cifras de los stats del hero de Clara se inyectan por JS y no están en el HTML capturado.
- El hero actual se leyó del código fuente en este worktree, no de producción. Si prod está
  adelante o atrás de esta rama, verificar antes de decidir.
