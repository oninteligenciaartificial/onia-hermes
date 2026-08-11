# Prompts por sesión — lo que dejaron los 26 videos

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
| `onia-plattform` | Sí (2 tareas) | agente de producto · seguridad |
| `Carrito de compra` | Sí | patrón de carrito flotante |
| `Estructura de pagos` | Sí, pero primero verificar | checkout in-page vs redirección al banco |
| `editor de videos` | Sí | 32 plantillas + gap de formatos |
| `web-factory` | Sí | portafolio antes/después |
| `Importación de productos` | Anotado, no urgente | dropzone con progreso |
| `pendiente` | Sí (2 evaluaciones baratas) | Apify · dictado por voz |
| `bolivian-electric-chatbot` | Solo hereda lo de `chatbot` | — |
| `Hotmart` | **Nada** | ningún video aplicó |

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

## `Importación de productos`

Sale de [dropzone con progreso](2026-08-11-dropzone-progreso-clip-path.md) (`FUTURO`).
**No abre sesión hoy** — se guarda para cuando toque construir la carga de archivos.

Técnica: barra de progreso hecha con `@property` de CSS + `clip-path`, sin librería. El
`easing: SPRING` que aparece en el clip no es sintaxis nativa de la Web Animations API —
viene de alguna librería que el video no muestra: **verificar antes de copiar**.

---

## `pendiente`

Dos evaluaciones baratas que no encajan en ningún frente de producto.

```text
Sesión: pendiente. Dos micro-tareas, ninguna gasta plata todavía.
1. APIFY — de 2026-08-11-cinco-herramientas-contenido-claude.md. Evaluar qué puede extraer de
   Instagram sin token propio, con qué límites y a qué precio. Importa porque el token de IG
   está bloqueado (S6) y eso frena prospección y medición. LISTO = una tabla: qué extrae,
   límites, precio, y si destraba o no lo que S6 tiene frenado. NO des de alta la cuenta.
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
