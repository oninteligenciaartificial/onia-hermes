# Prompts por sesión — lo que dejaron los 26 videos

> ## 🔴 CORRECCION 2026-08-12 — la tarea de seguridad YA ESTA CERRADA
>
> Los 3 bloqueantes de seguridad (RLS, firewall/TLS, logging) se cerraron y se **verificaron en
> produccion el 2026-08-11**: RLS en las 71 tablas y cero grants a `anon`; `ufw` activo, panel
> solo por TLS y 5 puertos cerrados (habia un `http.server` abierto en el 8099); `fail2ban` mas
> vigilante diario con alerta probada.
>
> **NO abras esa sesion: mandaria a rehacer trabajo terminado.** Queda un unico pendiente
> menor: el log de Postgres esta bloqueado por `log_min_messages=fatal` del contenedor.
>
> Lo detecto la sintesis del corpus al cruzar el tablero contra la memoria del proyecto. El
> texto de abajo se conserva solo como registro de lo que se pidio en su momento.

Un bloque por sesión de las que Sergio tiene abiertas. Cada uno se copia y se pega tal cual
en **esa** sesión: trae la tarea única, cómo se verifica, y qué NO hacer. Ninguno abre un
frente nuevo.

**Regla que se respetó al repartir:** un video solo entra a una sesión si cambia algo
concreto ahí. Los que no cambiaban nada quedaron como `HUMO` y **no se repartieron para
llenar casilleros** — 9 de 20 de la tanda del 11-ago son humo, y así está escrito.

| Sesión | Tiene trabajo | De qué video sale |
|---|---|---|
| `chatbot` | **Sí — el más urgente** | minimización de datos |
| `INFLUENCERS IA` | **Sí — el más valioso** | prompt por escenas de Seedance |
| `onia-plattform` | Sí (**3 tareas**) | seguridad · agente de producto · visión como capacidad |
| `Carrito de compra` | Sí — **es módulo de la plataforma** | patrón de carrito flotante |
| `Estructura de pagos` | Sí — **es módulo de la plataforma**, pero verificar primero | checkout in-page vs redirección al banco |
| `editor de videos` | Sí | 32 plantillas + gap de formatos |
| `web-factory` | Sí | portafolio antes/después |
| `Importación de productos` | Anotado, no urgente | dropzone con progreso |
| `pendiente` | Sí (2 evaluaciones baratas) | Apify · dictado por voz |
| `bolivian-electric-chatbot` | Solo hereda lo de `chatbot` | — |
| `Hotmart` | **Nada** | ningún video aplicó |

---

## Preambulo — pega esto al inicio de CUALQUIER sesion

Seis reglas que salieron de los errores de la sesion de analisis de reels (2026-08-11). No son
teoria: cada una nacio de algo que se hizo mal y se corrigio.

```text
Antes de escribir una sola linea:
1. Invoca `onia-router` y ubica el carril. Verifica `git branch --show-current`.
2. BUSCA DONDE VIVE LA COSA ANTES DE CREARLA. El repo ya tiene pipeline para casi todo
   (web-factory tiene reels->learned models; ver-videos tiene el intake; el pattern bank tiene
   el motion). Escribir un doc "al lado" del sistema que ya existe es el error mas caro:
   duplica y se desincroniza. Si no encontras donde va, pregunta antes de inventar carpeta.
3. Verifica en vivo lo que toca prod, plata o main. Y deci explicitamente lo que NO pudiste
   verificar: "los estados estan probados, el timing no porque el panel del navegador esta
   oculto y las transiciones no avanzan" es una respuesta correcta; "quedo listo" no lo es.
4. Ninguna cifra, precio o capacidad que venga de afuera se repite como propia sin verificarla.
   Marcala como "a verificar" o no la menciones.
5. Reporta la cobertura real ("audio 100%, 5 de 7 laminas"), nunca "lo vi" desde dos cuadros.
6. Al cerrar: que quedo en produccion, que quedo a medias y donde exactamente, y que depende
   de Sergio. Nada flotando en la conversacion.
```

**Para delegar a subagentes** (esto se probo con 8 agentes en paralelo y funciono):

```text
Trabajas en el worktree EXACTO: <ruta completa>
Verifica `git branch --show-current` (debe decir <rama>). No commitees, no hagas push.
Escribis SOLO estos archivos: <lista>. NO toques indices ni docs compartidos — de eso me encargo yo.
Si el video/doc afirma un dato, marcalo como "a verificar", no lo des por cierto.
DEVOLVE: una linea por entregable con <archivo> | <resultado> | <decision que tomaste>.
```

La regla que hace que esto no choque: **cada agente escribe sus propios archivos, el
orquestador escribe los indices.** Ocho agentes en la misma carpeta no se pisaron ni una vez.

---

## `chatbot`

Sale de [chatbot y dato sensible](2026-08-11-chatbot-dato-sensible-ley-21719-chile.md)
(`SIRVE YA`). Es el más urgente de toda la tanda porque el chatbot ya está corriendo y
porque el rubro dental maneja datos de salud.

```text
Sesión: chatbot. Corré `git branch --show-current` primero.
TAREA ÚNICA: aplicar minimización de datos en el chatbot. Nada más.
La regla: no se guarda ningún dato del usuario que no cambie el comportamiento del sistema.
Un mensaje del tipo "estoy enferma" no se persiste ni se usa en un seguimiento posterior.
PASOS: (1) listar qué campos del historial de conversación se guardan hoy y dónde;
(2) marcar cuáles son necesarios para responder y cuáles solo están "por si acaso";
(3) dejar de persistir los innecesarios y purgar los ya guardados.
LISTO = una lista de campos con la decisión tomada por cada uno, y la purga ejecutada
y verificada en la base.
NO HAGAS: no cites la ley chilena 21.719 a un cliente boliviano — Bolivia no tiene ley
integral de protección de datos vigente, y citar una ley extranjera como si aplicara acá
sería fabricar. La práctica es correcta por sí sola; el argumento legal hay que investigarlo
aparte con fuente boliviana. Tampoco toques el motor de respuestas ni la integración de
WhatsApp en esta sesión.
```

---

## `INFLUENCERS IA`

Sale de [Seedance: prompt por escenas con timestamps](2026-08-11-seedance-prompt-por-escenas-timestamps.md)
(`SIRVE YA`) — el hallazgo más útil de la tanda. Complementa el
[SOUL 2.0 del 9-ago](2026-08-09-higgsfield-soul2-seedance25.md), que decía *"no es un prompt,
es arquitectura"* pero no mostraba la estructura. Ahora está a la vista y se puede copiar.

```text
Sesión: INFLUENCERS IA. Corré `git branch --show-current` primero.
TAREA ÚNICA: portar al brief de generación de Lucía la estructura de prompt por escenas.
Formato exacto a adoptar (viene de un anuncio real de Seedance 2.5, generado desde UNA sola
foto de referencia):
    Scene N — <nombre> (Xs–Ys)
    <encuadre y ángulo> · <comportamiento de cámara> · <qué queda en foco y qué sale>
    · <calidad y dirección de la luz>
Los tres campos que faltaban (lock de vestuario, raccord de luz, timestamps) salen de acá.
LISTO = la plantilla escrita en la skill de generación + UN guion de ejemplo de 15-20 s para
Lucía, dividido en escenas con sus rangos de tiempo. Sin generar todavía.
NO HAGAS: NO generes ningún video ni imagen — eso gasta créditos y necesita OK explícito de
Sergio caso por caso. Antes de proponer generar, verificá que Seedance 2.5 esté en la cuenta
y su costo por generación (tarea V-3 de PENDIENTES.md, consultar es gratis).
NO copies el contenido del ejemplo (autos de lujo): se roba el esqueleto, no el Aston Martin.
Y NO adoptes nada de PrimeBoard (ver 2026-08-11-primeboard-autopilot-farming-redes.md): su
función es farmear cuentas con un Android, viola los ToS de Meta y TikTok, y con el token de
IG ya bloqueado (S6) es exactamente el riesgo que no conviene tocar.
```

---

## `onia-plattform`

Dos tareas separadas. **La segunda va antes que la primera si hay que elegir**: no es
mejora, es lo que bloquea vender.

### 1 · Seguridad (del [10 errores](2026-08-09-10-errores-seguridad-apps-ia.md))

```text
Sesión: onia-plattform (o infra). UN SOLO DUEÑO a la vez. git branch --show-current primero.
TAREA ÚNICA: cerrar los 3 bloqueantes de seguridad de producción, en este orden:
  1. RLS en las tablas donde viven los datos de cliente (hoy no hay fuga solo porque
     PGRST_DB_SCHEMAS no expone esos esquemas — eso es un tapón de config, no una defensa).
  2. Firewall del VPS activo + panel de Easypanel detrás de TLS y no abierto a internet.
  3. Logging mínimo para detectar acceso no autorizado.
LISTO = cada punto verificado EN PRODUCCIÓN, con la prueba pegada en la sesión.
NO HAGAS: nada de features, nada de migrar datos, nada de rediseñar el panel.
```

### 2 · Agente de producto (del [PostHog](2026-08-11-posthog-agentes-producto.md))

```text
Sesión: onia-plattform. git branch --show-current primero.
TAREA ÚNICA: diseñar un agente "Producto" que lea el comportamiento real de uso y devuelva
lecciones accionables con la evidencia que las respalda. Solo el diseño y el schema.
Patrón a adaptar: tabla de lecciones (product_lessons) donde cada fila lleva la lección Y el
dato que la sostiene, para que no queden opiniones sueltas.
LISTO = el schema propuesto + de qué eventos se alimenta, con lo que YA tenemos.
NO HAGAS: NO des de alta PostHog ni ninguna plataforma nueva — es gasto y necesita permiso.
Los MCPs de NotebookLM que muestra el video son repos de terceros no oficiales: descartalos,
ya hay pipeline de voz propio. Verificá contra los agentes que ya corren (Contenido,
Finanzas, Vendedor) antes de crear uno nuevo: puede ser una vista, no un agente.
```

---

### 3 · Vision por computadora como capacidad (corregido 2026-08-11)

Sale de [Supra Vision](2026-08-09-supra-vision-ganado-vision-computacional.md). Estaba mal
archivado como "Ganadero OS, ultimo en la cola": una camara que lee movimiento no es una
funcion ganadera, es una **capacidad** que enchufa en rubros que ya vendemos.

```text
Sesion: onia-plattform. git branch --show-current primero.
TAREA UNICA: evaluar vision por computadora como CAPACIDAD de la plataforma. Solo evaluar.
No es un rubro nuevo ni un producto: es una capacidad transversal. Contra que rubros ya
vendibles aplica y que dato entrega:
  - comercio minorista: cuanta gente entra, a que hora, cuanto se queda frente a que gondola
  - importadora: conteo de bultos en la descarga, contra la lista de packing
  - servicios: control de acceso y aforo
  - ganadero: conteo de hacienda (ultimo, no primero)
  - SEGURIDAD LABORAL / EPP (rubro NUEVO, no estaba mapeado): detectar si alguien entra a una
    obra sin casco o sin chaleco. Es de OBJETOS, no de vigilancia de clientes, asi que evita el
    problema legal; y construccion/industria es un comprador con plata en Santa Cruz.
    Empeza la evaluacion por aca, no por el aforo de una tienda.
Preguntas a responder con evidencia, no con opinion:
  1. Que precision real da un modelo de deteccion estandar en cada caso (no en el demo).
  2. [CONTESTADA 2026-08-15 — no la re-investigues] Donde corre: EN EL DISPOSITIVO. Un reel
     mostro una app con deteccion en vivo corriendo en un TELEFONO, con selector COCO-SSD /
     YOLO —los dos gratuitos y estandar— sobre la camara del propio equipo. Sin servidor, sin
     subir video, sin costo por minuto. Un telefono viejo apuntando a una puerta ya es el
     hardware. Onia Box deja de ser requisito para el caso simple; sigue teniendo sentido para
     volumen y retencion de video, no para detectar.
     Ficha: 2026-08-15-vision-en-el-celular-y-espionaje-de-pauta.md
  3. Que hardware minimo necesita el cliente y quien lo paga.
  4. Cual de los cuatro casos tiene el dolor mas caro HOY para el comprador.
LISTO = una tabla de 4 filas (rubro, dato que entrega, precision esperada, donde corre) + UNA
recomendacion: cual se prototipa primero, o ninguno y por que.
NO HAGAS: NO construyas el detector. NO des de alta plataformas de vision pagas. NO prometas
precision sin medirla — el salto de "detecto ovejas en un video" a "gestion inteligente" es
marketing, y repetirlo seria fabricar capacidad.
Si se arma una demo con overlay de cajas, se declara que es demo. Nunca mostrarlo como
capacidad instalada.
```

---

## `Carrito de compra`

Sale de [carrito flotante](2026-08-11-carrito-flotante-react-ecommerce.md) (`MEJORA LO ACTUAL`).

```text
Sesión: Carrito de compra. git branch --show-current primero.
TAREA ÚNICA: adoptar el patrón de carrito flotante: botón persistente "Ver carrito" con
contador + modal de resumen que no saca al usuario de la página donde está comprando.
LISTO = el componente andando en el storefront, verificado en móvil (que es donde compra el
cliente boliviano) y sin desplazar el contenido al aparecer.
NO HAGAS: no rehagas el checkout completo. Solo el acceso flotante y el resumen.
```

---

## `Estructura de pagos`

Sale de [checkout con tarjeta animada](2026-08-11-checkout-tarjeta-animada-3d.md)
(`MEJORA LO ACTUAL`). **Ojo: la verificación va primero y puede matar la tarea entera.**

```text
Sesión: Estructura de pagos. git branch --show-current primero.
TAREA ÚNICA — PASO 1 (verificación, va antes de escribir una línea): con el modelo
Facilitador boliviano (QR Simple / BNB / BCP), ¿el flujo captura la tarjeta EN NUESTRA
página, o redirige al banco? Si redirige, no hay dónde montar un formulario de tarjeta y
la tarea se cierra acá.
PASO 2 (solo si la respuesta habilita in-page): el componente de tarjeta que se actualiza en
vivo con los campos del formulario (número, nombre, vencimiento, flip al pedir el CVV).
LISTO = la respuesta del paso 1 documentada con fuente. Y si aplica, el componente andando.
NO HAGAS: NO captures ni guardes el número de tarjeta sin un SDK del proveedor que tokenice
— eso mete a ONIA en alcance PCI-DSS, que es un problema de otra magnitud.
IGNORÁ el otro video de checkout de la tanda (2026-08-11-checkout-tarjeta-flip-3d-portfolio.md):
son 6 segundos de animación sin nada detrás, ya está marcado HUMO.
```

---

## `editor de videos`

Sale de [32 plantillas de HyperFrames](2026-08-11-hyperframes-32-plantillas-microanimacion.md)
(`MEJORA LO ACTUAL`) y de un gap real que encontró el análisis de
[Open Carrusel](2026-08-11-open-carrusel-claude-vs-canva.md) (`HUMO`, pero con hallazgo útil).

```text
Sesión: editor de videos. git branch --show-current primero.
TAREA ÚNICA: dos cosas chicas sobre lo que YA tenemos, ninguna herramienta nueva.
  1. Ampliar el uso de HyperFrames de "editar video hablado" a "animar interfaz": producir
     3-4 tarjetas de micro-animación con los elementos reales de ONIA Platform (factura
     emitida, cobro confirmado, alerta del agente, contador de ingresos con su delta).
  2. Agregar export cuadrado (1080x1080) y story (1080x1920) a scripts/carousel_render.js:
     hoy los 4 packs están fijos en 1080x1350.
LISTO = las tarjetas renderizadas a mp4 + el render de carrusel emitiendo los 3 formatos.
NO HAGAS: NO adoptes Raylight.app ni Open Carrusel — las dos duplican lo que ya está
instalado y son gasto sin permiso. Si usás alguna de las "32 plantillas" de terceros en
material comercial, revisá licencia primero; si hay duda, se replica con nuestro HyperFrames.
```

---

## `web-factory`

Sale del [antes/después del 9-ago](2026-08-09-web-antes-despues-find-real-estate.md)
(`SIRVE YA`, ya encolado como V-1) más una variante que aportó
[el portafolio de emails](2026-08-11-portafolio-emails-preventa-curso.md).

```text
Sesión: web-factory. git branch --show-current primero.
TAREA ÚNICA: producir 3 piezas verticales antes/después de webs YA entregadas.
Formato: 0-4 s wireframe gris de NUESTRO diseño con rótulo "Cliente: necesito una web de X";
5-17 s scroll de la web final, mismo encuadre, rótulo "Después:". Sin voz, sin cara, 9:16.
Variante que salió de la tanda: una cuarta pieza agrupando VARIOS proyectos en un mismo reel,
cerrando con la oferta. Sirve cuando ya hay 3 casos.
Por qué importa: el precio está en 790 / 1.500 Bs porque no hay portafolio publicado. La
línea premium (2.000 / 4.500) pide 3-5 casos mostrables. Las webs ya existen.
LISTO = 3 mp4 listos + una línea por pieza diciendo de qué cliente es. Sin publicar.
NO HAGAS: no muestres la plantilla base ni menciones que usamos plantillas. No uses como
"antes" la web vieja real de un cliente sin su OK — usá wireframe propio.
NO construyas nada con scroll 3D todavía (2026-08-11-web-3d-scrollytelling-united-carriers.md):
la técnica es real pero choca con el presupuesto de 150kb de JS por landing y con el precio
actual. Queda como referencia de techo.
```

---

## `web-factory` — segunda tarea: la capa de skills que falta

Sale del [mapa de 42 skills](2026-08-11-mapa-42-skills-diseno-claude.md) (`SIRVE YA`). Es el
único video de los 26 que ataca un problema **ya documentado por nosotros**: que los diseños
salen genéricos.

```text
Sesión: web-factory. git branch --show-current primero.
TAREA ÚNICA: cerrar la capa VISUAL de skills que falta, y medir si sirve.
Instalar SOLO estas 5 (son las ausentes de la capa 1 del mapa de 42):
    refactoring-ui · web-typography · microinteractions · ux-heuristics · top-design
Después: rehacer UNA landing ya existente con ellas cargadas y comparar contra la versión
actual, lado a lado.
LISTO = la comparación hecha y una decisión escrita: se quedan o se desinstalan.
NO HAGAS: NO instales las 18 que faltan de golpe. Más skills no es mejor diseño — es más
contexto compitiendo entre sí. Las otras 13 se evalúan después, si estas 5 demuestran algo.
VERIFICÁ de dónde sale cada colección y con qué licencia antes de instalar: esto corre en el
entorno que toca código de clientes.
Ya están instaladas (no las busques): ui-ux-pro-max, design-html, taste-design, frontend-design,
canvas-design, brand-guidelines, theme-factory, image, video, cro, signup, onboarding, popups,
ab-testing, social, copywriting, copy-editing, content-strategy, review, qa, codex,
security-review, verification-loop, ship.
```

---

## `CRM` / prospección — del ejército de 7 agentes

Sale de [7 agentes de venta](2026-08-11-ejercito-7-agentes-ventas.md) (`MEJORA LO ACTUAL`).

```text
Sesión: la que lleve agentes/CRM. git branch --show-current primero.
TAREA ÚNICA: usar los 7 roles como checklist contra el agente Vendedor que YA corre, y
quedarse con lo que falta. Los 7 roles: Lead Finder, Researcher, Personalizer, Outreach,
Follow-Up, Appointment Setter, Sales Manager.
Hipótesis a confirmar o tirar: los eslabones débiles son Researcher (investigar el prospecto
antes de escribirle) y Follow-Up (no dejar morir al lead que ya entró).
LISTO = la tabla de 7 filas con "lo cubre / no lo cubre / es un estado, no un agente", y UNA
sola pieza construida: la de mayor retorno.
NO HAGAS: NO construyas outreach automático. Un agente que escribe y envía solo es spam con
nuestra marca — el agente redacta, un humano aprueba, igual que la cola actual.
NO crees siete agentes: varios de esos roles son un estado del work item, no una entidad.
NO uses un Lead Finder de volumen: la regla es pocos prospectos buenos con señal, no listas.
```

---

## `Importación de productos` — portar los patrones al flujo real

**Reescrito 2026-08-11.** Antes decia "anotado, no urgente"; eso era ANTES de que los dos
patrones existieran reconstruidos. Ahora hay codigo andando: `dropzone-progress` y
`upload-button` en `hermes-content/references/ui-patterns/`.

```text
Sesion: Importacion de productos. git branch --show-current primero.
TAREA UNICA: portar dos patrones YA reconstruidos al flujo real de importacion. No disenar
nada nuevo.
  1. `ui-patterns/dropzone-progress/` -> la zona donde se sueltan los archivos de catalogo.
     La miniatura ES la barra: capa viva sobre fantasma en gris, recortada con clip-path
     atado a una custom property registrada con @property.
  2. `ui-patterns/upload-button/` -> el boton por archivo (reposo -> subiendo -> completado).
Los dos son HTML/CSS/JS autocontenidos: hay que portarlos al stack del producto (React),
conservando la mecanica y las reglas, no reescribiendo el gesto.
LISTO = la importacion real usando los dos patrones, probada en navegador con archivos de
verdad, incluido el caso de error y el reintento.
NO HAGAS: no cambies el gesto ni las duraciones (0,6-0,9 s) — ya estan calibradas y Sergio
observo que mas rapido no se lee. Respeta las 2 reglas del README de ui-patterns: nombre
accesible unico si apilas etiquetas de estado, y reduced-motion con `transition: none`
(0.01ms rompe las propiedades discretas).
MIENTRAS PORTAS: mira los originales en vivo (`npx serve hermes-content/references/ui-patterns`)
y confirma el TIMING, que es lo unico que quedo sin verificar de los 6 patrones.
```

## `pendiente`

Dos evaluaciones baratas que no encajan en ningún frente de producto.

```text
Sesión: pendiente. Dos micro-tareas, ninguna gasta plata todavía.
1. APIFY — de 2026-08-11-cinco-herramientas-contenido-claude.md. Evaluar qué puede extraer de
   Instagram sin token propio, con qué límites y a qué precio. Importa porque el token de IG
   está bloqueado (S6) y eso frena prospección y medición. LISTO = una tabla: qué extrae,
   límites, precio, y si destraba o no lo que S6 tiene frenado. NO des de alta la cuenta.
   AGREGADO 2026-08-15: compará Apify contra `scrapling` (github.com/D4Vinci/Scrapling), que es
   open source, gratis y trae bypass de Cloudflare. Si scrapling alcanza, Apify no se paga.
   Sale de 2026-08-15-vision-en-el-celular-y-espionaje-de-pauta.md.
2. HANDY (dictado por voz) — de 2026-08-11-handy-dictado-voz-alternativa-wispr-flow.md.
   La demo del video es en Mac y acá se trabaja en Windows 11: VERIFICAR soporte Windows,
   repo y licencia ANTES de instalar nada. LISTO = sí/no con la fuente.
NO HAGAS: no evalúes "Last 30 Days" a fondo sin antes comparar contra el Radar de Novedades
IA que ya corre por cron cada 2 h. Si no aporta algo que el radar no cubra, se descarta.
```

---

## Sesiones sin trabajo de esta tanda

- **`bolivian-electric-chatbot`** — no salió nada propio. Hereda la regla de minimización de
  datos de la sesión `chatbot`; aplicarla cuando se toque ese bot.
- **`Hotmart`** — ningún video de los 26 aplicó. No hay tarea. Se dice explícitamente para
  que nadie invente una.

## Lo que se descartó y por qué (para no volver a analizarlo)

| Video | Motivo |
|---|---|
| [PrimeBoard](2026-08-11-primeboard-autopilot-farming-redes.md) | farming de cuentas con Android: viola ToS de Meta/TikTok |
| [Granjas de bots](2026-08-11-granjas-bots-spotify-politica-fraude.md) | fraude de streaming + astroturfing político. Sin ángulo legítimo |
| [Raylight.app](2026-08-11-raylight-app-plantillas-motion-graphics.md) | duplica HyperFrames, que ya está instalado |
| [Open Carrusel](2026-08-11-open-carrusel-claude-vs-canva.md) | duplica el pipeline propio de carruseles (pero dejó el gap de formatos) |
| [Swipe de anuncios FB](2026-08-11-swipe-anuncios-facebook-cheat-code.md) | fórmulas de copy estándar + una cifra sin fuente |
| [Roundup de herramientas](2026-08-11-roundup-herramientas-diseno-cebo-comentario.md) | cebo de comentario, sin explicación de uso |
| [Botón de carga](2026-08-11-boton-carga-archivos-react-framer.md) | 6,7 s sin mostrar una línea de código |
| [Checkout flip 3D](2026-08-11-checkout-tarjeta-flip-3d-portfolio.md) | patrón ya estándar, sin sustancia |
| [ESP32 costo de reunión](2026-08-11-esp32-costo-de-reunion.md) | no toca ningún frente de ONIA |

---

# Lo construido y todavia apagado

Cuatro prompts para cosas que existen y **nadie usa**. Es la antinorma del CLAUDE.md:
construido no es terminado. Van en este orden por dependencia.

## B1 · Construir `packages/blocks` (va PRIMERO)

```text
Sesion: web-factory. git branch --show-current primero.
TAREA UNICA: construir los bloques que el catalogo de learned models ya pidio. Nada mas.
El catalogo `web-factory/docs/WEB_FACTORY_LEARNED_MODELS.md` lista 22 tipos de bloque que los
5 modelos necesitan, y `packages/blocks` no los tiene. Sin esto, generar un sitio desde un
modelo no produce nada: es la lista de compras y esta sin comprar.
EMPEZA por los que aparecen en 2+ modelos (el catalogo los ordena por frecuencia): footer-brand,
benefit-strip, editorial-statement.
Cada bloque: props tipadas, tokens ONIA (no colores literales), reduced-motion, y el spec de
`motion` que el modelo ya trae escrito por seccion (entrance, trigger, easing, duracion,
stagger, scrollLinked, hover, reducedMotion).
LISTO = 3 bloques construidos + renderizados en una pagina de prueba + tsc --noEmit verde.
NO HAGAS: no construyas los 22. Tres que se usen valen mas que veintidos a medias.
NO inventes bloques que ningun modelo pidio.
```

## B2 · Generar un sitio desde un learned model (depende de B1)

```text
Sesion: web-factory. git branch --show-current primero.
TAREA UNICA: generar UNA landing real desde el modelo `find-realestate-editorial`.
Esta en `web-factory/data/references/reels/models/` con confianza ALTA y sin estrenar: 7
secciones, motionLevel 3, entra comodo en el presupuesto de 150 kb de JS. Trae el orden de
secciones, los roles de color, la tipografia y el motion por seccion, ya escritos.
LISTO = la landing generada, corriendo en local, con tokens ONIA (no la paleta del modelo) y
placeholders honestos donde falten assets reales del cliente.
NO HAGAS: no uses la paleta literal del modelo — los hex son ROLES (bg, accent, text), se
reemplazan por los tokens del cliente. No inventes propiedades, precios ni articulos: donde
falte dato real va placeholder marcado, nunca proof fabricado.
Si el cliente pidiera la version cinematografica, compara contra `lecercle-realestate` antes
de decidir: mismo rubro, objetivo opuesto.
```

## B3 · Encender el intake automatico de video

```text
Sesion: infra (carril G, UN SOLO DUENO). git branch --show-current primero.
TAREA UNICA: dejar el intake de video corriendo sin Sergio. El codigo ya existe y esta verde:
  - `scripts/video-intake.mjs` (link -> mp4 -> lectura -> verbatim -> ficha)
  - `.github/workflows/video-intake.yml` (workflow_dispatch + repository_dispatch)
Falta SOLO cablear: (1) crear el secret GEMINI_API_KEY en el repo; (2) opcional IG_COOKIES_B64
(se regenera con `node .claude/skills/ver-videos/scripts/fetch-video.mjs --login`; la sesion de
IG caduca, hay que refrescarlo); (3) un workflow n8n que escuche Telegram, detecte un link de
IG/TikTok/YouTube y dispare repository_dispatch con event_type "video-intake".
LISTO = Sergio manda un link por Telegram y la ficha aparece commiteada en
hermes-content/references/video-intake/ + aviso de vuelta por Telegram. Probado punta a punta
con un link real.
NO HAGAS: el token de GitHub para n8n va como CREDENCIAL de n8n (Header Auth), NUNCA como
$env — el plan VPS no lo soporta. No pegues la key en el workflow.
LIMITE CONOCIDO: la cuota gratis de Gemini corta a ~20 videos por dia. Si se supera, el script
ya cae al camino alternativo (Whisper + fotogramas); no hay que arreglarlo.
```

## B4 · Probar los 6 patrones en vivo (chico, 20 min)

```text
Sesion: cualquiera con navegador. git branch --show-current primero.
TAREA UNICA: mirar los 6 patrones moverse y anotar si el timing esta bien.
  npx serve hermes-content/references/ui-patterns
Patrones: upload-button, checkout-card, floating-cart, dropzone-progress, chat-widget, sidebar-nav.
Por que hace falta: se verifico estado, DOM, accesibilidad y estados finales, pero NO el timing
— con el panel del navegador oculto las transiciones CSS no avanzan y getComputedStyle devuelve
el valor inicial. Nadie los vio moverse todavia salvo el upload-button.
LISTO = una linea por patron: timing OK o "queda lento/rapido en X". Y probar con
reduced-motion activado en DevTools (los 6 tienen que quedar legibles y completos).
NO HAGAS: no toques el codigo en esta sesion. Solo mirar y anotar.
```

---

# D4 · Espiar la pauta de la competencia — con lo gratis que ya tenemos

Sale de un reel que muestra **Spyglass** (`app.spyglass.so`): una herramienta paga que lista
todos los anuncios que corre una marca, con el peso de cada creativo y su clasificacion por
formato ([ficha](2026-08-15-vision-en-el-celular-y-espionaje-de-pauta.md)).

La capacidad es real y util. Pero **la Biblioteca de Anuncios de Meta es publica y gratis, y ya
la tenemos conectada por MCP** (`ads_library_search`). Antes de evaluar nada pago, hay que
agotar lo que ya esta.

```text
Sesion: marketing. git branch --show-current primero.
TAREA UNICA: ver que anuncios estan corriendo 3 competidores, con la herramienta que YA tenemos.
Usar `ads_library_search` del MCP de Meta (gratis, publico, sin dar de alta nada).
  1. Elegir 3 competidores REALES y verificables — agencias o SaaS que le vendan al mismo
     comprador en Bolivia. Si no hay locales, tomar 3 regionales que sirvan de referencia.
  2. Por cada uno: que anuncios corre hoy, desde cuando, y que formato usa cada creativo.
  3. Clasificar los creativos por tipo (el molde que usa Spyglass: GRWM, text overlay,
     brand story, demo de producto, testimonio).
LISTO = una tabla por competidor + UNA conclusion: que formato repiten mas, y que hueco dejan
que nosotros podamos ocupar.
NO HAGAS: NO des de alta Spyglass ni ninguna herramienta paga hasta que esta pasada demuestre
que la biblioteca de Meta no alcanza. NO copies sus creativos: se mira el FORMATO y el hueco.
NO inventes competidores: si no encontras 3 verificables, decilo y trae los que si existan.
```

---

# Arthur — marketing

Arthur opera modelos IA, Higgsfield y Meta Ads. Los prompts van con los topes escritos
adentro, porque son topes de plata y de permisos, no sugerencias.

**Topes que valen para TODO lo de abajo:**
- **Imagenes: libres.** Generar imagen con los Souls ya creados no pide permiso.
- **Video: con OK explicito de Sergio, caso por caso.** Seedance/kling consumen creditos rapido.
- **Pauta: NO se lanza.** El motor de Meta Ads esta deployado en modo DRY y la cuenta **no
  tiene metodo de pago**. Se preparan creatividades y publicos; no se enciende nada.
- **Publicar en IG automaticamente: bloqueado** (token pendiente, S6). Publicacion manual si.
- Nada de comprar, suscribir ni dar de alta plataformas nuevas sin permiso explicito.

## A1 · Portafolio antes/despues — la que mas rapido toca la caja

```text
Sesion: marketing (Arthur). git branch --show-current primero.
TAREA UNICA: 3 piezas verticales antes/despues de webs YA entregadas. Nada mas.
Formato (de hermes-content/references/video-intake/2026-08-09-web-antes-despues-find-real-estate.md):
  0-4 s wireframe gris de NUESTRO diseno, rotulo "Cliente: necesito una web de X"
  5-17 s scroll de la web final, mismo encuadre, rotulo "Despues:"
  Sin voz, sin cara, musica, 9:16.
POR QUE IMPORTA: el precio esta en Landing 790 / Web Pro 1.500 Bs porque no hay portafolio.
La linea premium (2.000 / 4.500) pide 3-5 casos mostrables. Las webs ya existen.
LISTO = 3 mp4 + una linea por pieza diciendo de que cliente es. SIN publicar.
NO HAGAS: no muestres la plantilla base ni digas que usamos plantillas. No uses como "antes"
la web vieja real de un cliente sin su OK — usa wireframe propio. Cero gasto de creditos:
esto es grabacion de pantalla y montaje.
```

## A2 · Motor comentario->DM, arrancando a mano

```text
Sesion: marketing (Arthur). git branch --show-current primero.
TAREA UNICA: montar UN ciclo completo de captacion por comentario, manual.
Hallazgo que lo justifica: 4 de 6 reels analizados cierran igual — "comenta X y te mando la
guia". Convierte contenido en lead con nombre, no en like. Y varios de los recursos que ellos
prometen NOSOTROS ya los tenemos escritos.
PASOS: (1) elegir UN recurso que ya exista en el repo (los 10 puntos de seguridad, el checklist
de release, el pipeline de video); (2) armar UNA pieza que lo ensene y cierre pidiendo una
palabra clave; (3) responder los DMs a mano y anotar cada lead en el CRM.
LISTO = la pieza lista para que Sergio apruebe + el recurso empaquetado para mandar + donde se
anota el lead. Medir: comentarios, DMs respondidos, leads con nombre.
NO HAGAS: no automatices el DM — necesita permisos de mensajeria de la Graph API y el token de
IG esta bloqueado (S6). Manual funciona desde hoy y no depende de nada.
OJO PLAZO: la ventana gratuita de 24 h de WhatsApp se cierra el 1-oct-2026; cualquier embudo
que termine en WhatsApp cambia de costo ese dia.
```

## A3 · Carruseles con el pipeline propio (y cerrar el gap de formatos)

```text
Sesion: marketing (Arthur). git branch --show-current primero.
TAREA UNICA: producir 2 carruseles con el sistema que YA tenemos
(hermes-content/carousels/CAROUSEL_SYSTEM.md + scripts/carousel_render.js + skill carruseles-onia),
y de paso cerrar un gap real: los 4 packs estan fijos en 1080x1350; faltan cuadrado (1080x1080)
y story (1080x1920).
Temas con material ya escrito: los 10 errores de seguridad · que mide un panel que sirve
(LTV:CAC, ROAS, AOV) · antes/despues de una web.
LISTO = 2 carruseles renderizados on-brand + el render emitiendo los 3 formatos.
NO HAGAS: NO adoptes "Open Carrusel" ni Canva ni ninguna plataforma de terceros — el pipeline
propio es mas completo (brief -> HTML/CSS -> PNG on-brand -> publicacion) y adoptar otra es
gasto y duplicacion. Analizado y descartado en 2026-08-11-open-carrusel-claude-vs-canva.md.
```

## A4 · Estructura de escenas para video IA — preparar, no generar

```text
Sesion: marketing (Arthur). git branch --show-current primero.
TAREA UNICA: escribir UN guion con la estructura de escenas que encontramos, SIN generar nada.
Formato (de 2026-08-11-seedance-prompt-por-escenas-timestamps.md, sale de una sola foto):
    Scene N — <nombre> (Xs-Ys)
    <encuadre y angulo> · <camara> · <que queda en foco y que sale> · <luz>
Es lo que le falta a nuestras piezas: hoy se genera plano por plano y la consistencia entre
tomas se rompe. Aca la continuidad esta escrita en el prompt.
LISTO = un guion de 15-20 s por escenas con sus rangos de tiempo, listo para aprobar.
NO HAGAS: NO generes video — eso es credito y va con OK explicito de Sergio caso por caso.
Antes de proponer generar, verifica que Seedance 2.5 este en la cuenta y a cuanto sale la
generacion (consultar el catalogo es gratis).
NO copies el contenido del ejemplo (autos de lujo): se roba el esqueleto, no el auto.
```

## A5 · Meta Ads — dejar todo listo sin encender nada

```text
Sesion: marketing (Arthur). git branch --show-current primero.
TAREA UNICA: dejar preparadas creatividades y publicos para la primera campana. SIN lanzar.
LISTO = un set de creatividades (copy + imagen, imagen es gasto cero) y la definicion de
publico escrita, todo revisable por Sergio.
NO HAGAS: NO enciendas campanas. La cuenta no tiene metodo de pago y la verificacion de negocio
esta en pausa. El motor corre en DRY a proposito — mantenerlo asi.
NO uses PrimeBoard ni ninguna herramienta de "farmear" cuentas con un Android: viola los ToS de
Meta y TikTok y con el token de IG ya bloqueado es el riesgo que no conviene tocar
(2026-08-11-primeboard-autopilot-farming-redes.md).
NO repitas cifras de terceros ("$1M en 4 meses" y similares) en ninguna creatividad: no tienen
fuente. Prueba real o no se dice.
```

## A6 · Los patrones reconstruidos SON contenido

Esto responde a la pregunta de Sergio: si, sirve ahora. Reconstruir un reel de UI viral es en
si mismo material publicable, y es el mas barato que tenemos — sin cara, sin voz, sin creditos.

```text
Sesion: marketing (Arthur). git branch --show-current primero.
TAREA UNICA: 3 piezas verticales a partir de los patrones ya reconstruidos en
hermes-content/references/ui-patterns/ (upload-button, checkout-card, floating-cart,
dropzone-progress, chat-widget, sidebar-nav).
Formato por pieza (grabacion de pantalla, 9:16, sin voz, sin cara):
  0-3 s   el patron funcionando, en loop limpio
  3-8 s   una linea de por que esta bien hecho, con el dato concreto
  8-12 s  cierre pidiendo la palabra clave
Los datos concretos que YA tenemos y que casi nadie dice (usarlos, son el diferencial):
  - "el original usa React + framer-motion; esto es CSS puro, 0 kb de libreria"
  - "el <dialog> nativo te da Escape, foco atrapado y devolucion del foco gratis"
  - "reduced-motion con 0.01ms deja el modal abierto e INVISIBLE; va transition: none"
  - "las etiquetas apiladas hacen que el lector lea 'Upload Uploading Completed'"
LISTO = 3 mp4 listos + su copy, para que Sergio apruebe. SIN publicar.
NO HAGAS: no digas que inventamos el patron — se reconstruyo mirando el reel, y eso se dice.
Citar la fuente cuando corresponda; nunca reusar el video, la musica ni el copy del creador.
No prometas el codigo por DM si despues no lo vas a mandar.
POR QUE ESTE FUNCIONA: le habla al comprador tecnico y demuestra capacidad real en vez de
afirmarla. Es prueba, no promesa.
```

---

# Lo que falta — de la ultima tanda (12-ago) y de los huecos de la sintesis

Cuatro prompts, no cinco. Los candidatos que no pasaron el filtro estan listados abajo con el
motivo: **inventar tareas para llenar casilleros es exactamente el error que la sintesis denuncia.**

Filtro aplicado a todos: *¿ayuda a VENDER o COBRAR en las proximas semanas?* Lo que solo mejora
como contamos algo que ya existe compite por la misma hora que lo que mueve el precio.

## C1 · Indexabilidad — cerrar la casa antes de auditar la ajena

Sale de [20 senales de web vibecodeada](2026-08-12-20-senales-web-vibecodeada.md)
(`MEJORA LO ACTUAL`). Verificado en este worktree hoy: `web-factory/apps/onia-platform/src/app/`
tiene `icon.svg` y `apple-icon.png`, pero **no tiene** `robots.ts`, `sitemap.ts` ni `not-found.tsx`.
Toca la caja de dos formas: una landing no indexable no trae un solo prospecto organico, y la
misma lista se convierte en auditoria gratis al prospecto — pero solo si nosotros la pasamos.

```text
Sesion: web-factory. git branch --show-current primero.
TAREA UNICA: cerrar los huecos de indexabilidad en las dos webs propias que salen a la calle
(apps/onia-platform y apps/dentalgest-landing), y dejar el checklist como gate de pre-entrega.
Lo que falta, verificado: robots.ts · sitemap.ts · not-found.tsx · metadataBase + canonical.
Y en dentalgest-landing, favicon (no tiene ninguno de los tres archivos de icono).
Despues: escribir el checklist de pre-entrega (17 items validos de los 20) al lado del gate
actual, que hoy verifica que compile (tsc --noEmit + e2e + code-reviewer) y no que sea indexable.
LISTO = las 4 cosas andando en las dos apps, verificadas en el sitio construido (no en el codigo):
/robots.txt y /sitemap.xml responden, una URL inexistente da 404 propio, y el canonical sale en
el HTML servido. Mas el checklist commiteado.
NO HAGAS: NO inventes la OG image — la regla del layout es esperar captura real del sistema, y
un mockup ahi es fabricar. NO copies los 3 items de opinion de la lista ("Vite + React" no es
falla, `robots.txt` contra bots de IA es decision de negocio, `llms.txt` esta a verificar).
NO uses la lista como argumento de venta hasta que estas dos webs la pasen: es bumeran.
```

## C2 · Kit de venta por rubro — el pitch en el idioma del comprador

Sale de [8 industrias = 8 agentes](2026-08-12-ocho-industrias-ocho-agentes-ia.md) y de
[5 formatos de anuncio estatico](2026-08-12-cinco-formatos-anuncio-estatico-meta.md), las dos
`MEJORA LO ACTUAL`. Las dos aportan **molde de copy**, no capacidad: la placa *4 dolores concretos
+ 1 agente con nombre*, y el estatico `recibo` (la oferta itemizada maquetada como ticket), que sale
del generador de propuestas que ya existe. Cero creditos, cero plataformas, cero token bloqueado.

```text
Sesion: marketing (Arthur) / ventas. git branch --show-current primero.
TAREA UNICA: escribir el material de venta de los SEIS rubros vendibles con dos moldes ajenos
verificados, sin abrir rubros nuevos ni generar video.
  1. Una placa por rubro (dental · comercio minorista · importadora · estetica · veterinaria ·
     servicios): 4 dolores en segunda persona, escritos desde la silla del dueno y terminando en
     plata, + UN agente con nombre, de los que el modulo de agentes YA tiene.
  2. Un estatico "recibo": los paquetes del generador de propuestas maquetados como ticket de
     compra, con el pipeline propio brief -> HTML/CSS -> PNG on-brand.
  3. Un gate de copy de una linea, para todo estatico nuestro: si no nombra el dolor EXACTO del
     rubro, no sale.
LISTO = 6 placas escritas + 1 estatico recibo renderizado + el gate escrito donde vive el
sistema de carruseles. Sin publicar, para que Sergio apruebe.
NO HAGAS: NO copies una sola cifra de esos videos (482 leads, 91%, 3.7x, 5,5M vistas · $82k) —
ninguna tiene fuente y ninguna es nuestra. Con cero clientes pagando, la placa va SIN metricas.
NO inventes un agente para llenar una placa: si el rubro no tiene agente, la placa dice lo que hay.
NO copies el dolor telefonico del original ("llamada perdida"): nuestro canal es WhatsApp/Chatwoot;
vender un agente de voz es vender una capacidad que no tenemos. Reescribi cada dolor a ese canal.
NO uses los otros 3 formatos estaticos: `news headline` sin hecho real es fabricar, `text on skin`
no aplica a software, `censored ad` quema credibilidad con el comprador formal.
El copy original es rioplatense: reescribir en uso boliviano antes de que lo vea un cliente.
```

## C3 · El costo de esperar — la seccion que falta en las propuestas

Sale de [7 tips de agencia de IA](2026-08-12-siete-tips-agencia-ia.md) (`SIRVE YA`, el unico video
del corpus que discute **como se vende**). De los 7 tips, 5 ya son regla escrita acá. El unico que
no existe en ningun lado es el 7: *el competidor no es otra agencia, es el negocio que decide no
hacer nada*. Va al generador, que es por donde pasa toda propuesta.

```text
Sesion: propuestas-v2 (carril C). git branch --show-current primero.
TAREA UNICA: agregar la seccion "El costo de esperar" al generador de propuestas
(hermes-content/propuestas/generador/), como campo del cliente, no como texto fijo.
La idea: el competidor real es que el cliente no haga nada. Eso en Bolivia es cuantificable con
datos DEL PROPIO CLIENTE: horas de tipeo por semana, ventas perdidas por responder WhatsApp
tarde, y el riesgo de facturacion con la fecha encima (facturacion en linea obligatoria).
LISTO = el campo en el generador + la seccion renderizando en una propuesta de prueba + la regla
escrita en la skill `propuestas-comerciales-onia.md`, que es la fuente de verdad.
NO HAGAS: NO pongas numeros de ejemplo como si fueran del cliente. Si no hay dato real del
cliente, la seccion no se imprime — un costo de esperar inventado es fabricar, y con el comprador
B2B formal es lo que nos saca de la mesa.
NO cites la fecha fiscal sin verificarla contra la RND vigente en ese momento (skill
`onia-contabilidad-bolivia`). Una fecha mal citada en una propuesta es peor que no citarla.
NO toques pricing ni paquetes: es una seccion nueva, no una revision de la oferta.
```

## C4 · El hueco #1 no lo cierra ningun video

De los **45 videos ingresados, CERO** hablan de como conseguir el primer cliente pagando, B2B, en
Bolivia (§6.1 de la [sintesis](SINTESIS_CORPUS.md)). Las tres piezas de `BANDEJA.md` que parecian
tapar el hueco se procesaron el 12-ago y **ninguna lo tapo**:
[8 industrias](2026-08-12-ocho-industrias-ocho-agentes-ia.md) da copy, no ruta;
[5 formatos](2026-08-12-cinco-formatos-anuncio-estatico-meta.md) es ecommerce DTC gringo;
[caso Climatic](2026-08-12-caso-exito-ajeno-climatic-marca-propia.md) le vende asesoria a un
aspirante a emprendedor. **Este hueco no se cierra mirando mas reels. Se cierra con fuentes.**

```text
Sesion: ventas / prospeccion. git branch --show-current primero.
TAREA UNICA: escribir la ruta al PRIMER cliente pagando, con fuentes reales, no con videos.
  1. Pregunta abierta que decide Sergio y va PRIMERO (no la decidas vos): la plataforma es
     multi-rubro, pero ¿el ESFUERZO COMERCIAL se concentra en UN rubro hasta cerrar los primeros
     casos? Seis rubros son seis mensajes, seis landings y seis listas, con cero clientes hoy.
     Presentale la pregunta con el pro y el contra en 5 lineas y esperá la respuesta.
  2. Con el rubro elegido: 20 prospectos REALES y verificables en Santa Cruz, cada uno con la
     fuente de donde salio (registro publico, directorio del gremio, su propia web o IG) y una
     senal concreta de por que es candidato — no una lista de volumen.
  3. El guion de primer contacto por el canal que SI tenemos hoy (WhatsApp/Chatwoot), no por el
     que esta bloqueado. Maximo 5 lineas, nombrando el dolor exacto del rubro (gate de C2).
LISTO = la pregunta contestada por Sergio + la tabla de 20 prospectos con fuente por fila + el
guion. Nada enviado todavia.
NO HAGAS: NO ingreses ni analices un video mas para esto — 45 piezas no lo cubrieron y la 46 no
lo va a cubrir. Las fuentes son registros, gremios y las webs de los propios negocios.
NO inventes un prospecto ni un dato de contacto: fila sin fuente, fila que no va.
NO automatices el envio (es S6 + spam con nuestra marca) ni uses un Lead Finder de volumen — eso
ya esta decidido en el prompt de `CRM` / prospeccion, que sigue siendo el que discute la
arquitectura de agentes. Este prompt es la lista de verdad, hecha a mano, y no lo reemplaza.
```

## Lo que NO abrio prompt (y por que)

Reglas de la casa: si una ficha nueva refuerza un prompt que ya existe, se dice en una linea y
**no se escribe otro**.

| De donde | Que hace | Decision |
|---|---|---|
| [portafolio de emails / solicitud informal](2026-08-12-portafolio-emails-solicitud-informal.md) | variante de montaje: 9 piezas en 9 s + encuadre "mi postulacion para tu marca" | **Refuerza A1 / V-1.** Se prueba al montar esa pieza. Sin prompt nuevo |
| [ad-spec Seedance](2026-08-12-ad-spec-seedance-tres-insumos.md) | el escenario como tercer insumo fijo | **Refuerza A4 e INFLUENCERS IA.** Ya quedo escrito como receta en `docs/HIGGSFIELD_AD_SPEC_RECETA_20260812.md` |
| [Higgsfield Layers](2026-08-12-higgsfield-layers-edicion-por-capas.md) | panel de capas + prompt chips | Verificacion gratis (¿esta en la cuenta? ¿que cuesta?) — **cabe en el prompt `pendiente`**, junto a Apify y Handy. No mueve venta esta semana |
| [5 plugins para webs](2026-08-12-cinco-plugins-webs-claude.md) | 4 de 5 ya instalados | **Refuerza el prompt de las 5 skills visuales.** Y es el espejo del §1: `impeccable` esta instalada y es regla, y los disenos siguen saliendo genericos. Ejecucion, no informacion |
| [caso Nicole / Meta MCP](2026-08-12-caso-nicole-meta-mcp-higgsfield-unlimited.md) · [Climatic](2026-08-12-caso-exito-ajeno-climatic-marca-propia.md) · [10 senales visuales](2026-08-12-diez-senales-visuales-web-ia.md) · [maquetas Figma](2026-08-12-montaje-maquetas-ui-cebo-figma.md) · [8 skills](2026-08-12-8-skills-2026-curaduria-youtube.md) | humo predecible | Sin prompt. Ya estan las razones en cada ficha |

**Hueco fiscal (§6.2): no abre prompt acá, y hay que decirlo.** Ningun video del corpus toca SIAT,
facturacion electronica ni IVA/IT/IUE — el unico contenido legal de las 45 piezas era **ley chilena**
y hubo que desactivarlo. Ese hueco **no se cierra con video**: se cierra con la RND vigente citada,
por la skill `onia-contabilidad-bolivia`, y su bloqueo real es humano (S2, NIT/homologacion). Abrir
un prompt de intake ahi seria fingir que la bandeja lo resuelve.

**Lo mismo con el cobro real (§6.3):** los dos videos de checkout son estetica; la pregunta que
bloquea (¿el modelo Facilitador captura la tarjeta in-page o redirige al banco?) **ya es el paso 1
del prompt `Estructura de pagos`**, que se responde con fuente del banco, no con un reel.

## Conteo honesto

**27 prompts escritos en este archivo · 1 anulado (la seguridad de `onia-plattform`, cerrada y
verificada en prod el 11-ago) · 26 vigentes.**

De esos 26, el unico que consta como **terminado** es justamente el anulado. Para el resto **no
hay evidencia en el repo de que se hayan abierto**, y de dos hay evidencia de lo contrario: las
piezas de portafolio llevan **cuatro veces encoladas** (V-1, A1, el bloque `web-factory`, A6) y
siguen sin producirse, y `robots.ts`/`sitemap.ts`/`not-found.tsx` siguen sin existir — por eso
C1 se escribio verificando el arbol, no la ficha.

O sea: **26 vigentes, ~25 sin abrir.** Esto no es un tablero de progreso; es la prueba del §1 de
la sintesis — el cuello de botella no es informacion, es ejecucion. Escribir el prompt numero 27
no vale nada si no se ejecuta el numero 1.


---

# D · Prompts que NO salen de los videos

El corpus de video se agoto: 40% humo y subiendo, cero capacidades nuevas en 45 piezas. Estos
tres salen de **verificar la memoria del proyecto contra produccion**, que resulto ser una
fuente mucho mas rica. Los tres estan verificados el 2026-08-12, no supuestos.

## D1 · 🔴 El chatbot no guarda nada hace 6 dias (VERIFICADO HOY)

Consultado directo contra la base de produccion el 2026-08-12:

```
messages:      16 filas · ultimo 2026-08-06 14:58:33
conversations: 10 filas · ultimo 2026-08-06 14:58:25
```

**Seis dias sin una sola conversacion nueva.** La memoria del proyecto atribuia esto a una regla
de firewall (`ONIA-BLOCK-3000`) que cortaba trafico contenedor-contenedor. Esa regla **ya no
esta**: hoy hay `RETURN` para 172.16.0.0/12 en el puerto 3000. O sea que se removio la causa
sospechada y **el sintoma sigue igual**, lo que significa que la causa era otra o hay una segunda.

Esto vale mas que cualquier prompt salido de un reel: es el canal de venta caido, en silencio,
sin que nadie lo note.

```text
Sesion: chatbot (o infra). git branch --show-current primero.
TAREA UNICA: que el chatbot vuelva a guardar conversaciones. Diagnostico primero, no parches.
DATO DE PARTIDA (verificado 2026-08-12 contra la base onia-chatbot en el VPS):
  messages      16 filas, ultimo 2026-08-06 14:58:33
  conversations 10 filas, ultimo 2026-08-06 14:58:25
  la regla ONIA-BLOCK-3000 ya NO existe: hay RETURN 172.16.0.0/12 -> 172.16.0.0/12 puerto 3000
PASOS: (1) mandar UN mensaje de prueba por el canal real y seguirlo punta a punta —
webhook -> contenedor -> base; (2) encontrar en que salto se pierde, con evidencia (logs del
contenedor, respuesta del webhook, fila en la base); (3) recien ahi arreglar.
LISTO = un mensaje de prueba nuevo visible en la tabla `messages` con timestamp de hoy, y el
salto que fallaba explicado con la evidencia pegada.
NO HAGAS: no des por buena la explicacion vieja del firewall — se removio la regla y el sintoma
sigue, asi que esa hipotesis ya esta descartada por los hechos. No toques la minimizacion de
datos en esta sesion (es el otro prompt de `chatbot`): primero que guarde, despues que guarde
menos. No reinstales Chatwoot: hay 10 conversaciones reales que no se pueden perder.
```

## D2 · Las fechas que corren solas

Tres plazos de la memoria del proyecto, con la cuenta hecha al 2026-08-12. Ninguno depende de
que mires un video mas; todos se vencen aunque nadie los mire.

| Fecha | Que pasa | Faltan |
|---|---|---|
| **30-sep-2026** | facturacion en linea obligatoria en Bolivia | ~7 semanas |
| **1-oct-2026** | se cierra la ventana gratuita de 24 h de WhatsApp | ~7 semanas |
| **~oct-2026** | fin del runway estimado (11 semanas contadas desde el 26-jul) | ~8 semanas |

```text
Sesion: la de estrategia/fiscal segun corresponda. git branch --show-current primero.
TAREA UNICA: convertir tres fechas en un plan con responsable, no en una nota.
  1. FISCAL (30-sep): verificar contra la RND vigente que la fecha sigue siendo esa y que
     alcanza a nuestros clientes objetivo. La homologacion SIAT depende del NIT (bloqueo S2 de
     Sergio) — sin eso no hay emision real, y el producto lo promete.
  2. WHATSAPP (1-oct): recalcular que le cuesta al cliente el chatbot DESPUES del cambio. Hoy el
     costeo asume la ventana gratis. Si el numero cambia, cambia el precio del add-on.
  3. RUNWAY: contra el plan vigente, cuantas semanas quedan y que se cae si no entra el primer
     cliente. Sin dramatizar: numeros.
LISTO = una tabla de 3 filas: fecha, que se cae, quien lo destraba, y que se hace ANTES.
NO HAGAS: no cites ninguna fecha fiscal sin la fuente (RND o DS con numero) — usa la skill
`onia-contabilidad-bolivia`. Una fecha mal citada en una propuesta es peor que no citarla.
NO inventes el runway: si el dato no esta, se dice que no esta.
```

## D3 · La busqueda de marca de Bs 75 que bloquea todo lo demas

De la memoria: antes de gastar en registrar la marca hay que hacer la busqueda **PI-112 en el
SENAPI, que cuesta Bs 75**. Es P0 y sigue sin hacerse. Registrar sin buscar es arriesgar el
gasto entero.

```text
Sesion: la administrativa/legal. git branch --show-current primero.
TAREA UNICA: dejar lista la busqueda de antecedentes marcarios PI-112 en SENAPI (Bs 75) para
que Sergio la presente: formulario, requisitos, donde se paga, y a nombre de quien va.
OJO QUIEN FIRMA: la titular legal es Leslie Mercado Moreno (SEPREC), no Sergio. Todo acto legal
va a su nombre.
LISTO = el tramite armado y el costo confirmado, listo para presentar. Y la decision escrita:
se registra la marca MIXTA (nombre + logo), que es lo que ya estaba definido.
NO HAGAS: no inicies el registro antes de la busqueda — si hay un antecedente, se pierde la
tasa. No propongas que firme Sergio.
```

---

**Por que estos tres y no mas.** Salen de verificar hechos, no de opinar. D1 se confirmo contra
la base de produccion hoy; D2 son fechas escritas; D3 es un tramite con precio. El resto de la
memoria (S1-S9, Postiz bloqueado por DNS, etc.) son bloqueos de Sergio: no necesitan prompt,
necesitan que los haga.

**Total: 30 prompts escritos · 1 anulado · 29 vigentes.**
