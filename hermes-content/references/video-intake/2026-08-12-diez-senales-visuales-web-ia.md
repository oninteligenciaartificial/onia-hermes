# 10 señales visuales de una web hecha con IA ("AI slop", PT-BR)

- **Fuente:** https://www.instagram.com/p/DbovTXCR1YV/ · 14.3 s · talking-head con voz (portugués)
- **Visto:** 2026-08-12 (Gemini nativo + Whisper)
- **Archivo:** `Instagram-DbovTXCR1YV.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-DbovTXCR1YV.md](transcripciones/2026-08-12-Instagram-DbovTXCR1YV.md)

## Qué dice realmente

Un chico a cámara enumera, a razón de **un ítem por segundo**, diez detalles que —según él—
delatan un sitio "vibe codado". Abre con *"Essas 10 coisas entregam no teu site a vibe
codada"* y a partir de ahí la lista se va apilando en overlay mientras aparecen capturas de
apoyo (una barra de navegador, una web oscura con resplandor morado, una sección de
testimonios, un widget de urgencia, el botón *"Edit with Lovable"*). Un cartel azul dice
*"AI Slop"*.

La lista, tal como se lee en pantalla:

| # | En pantalla | Qué señala |
|---|---|---|
| 1 | `vercel.app` | dominio gratuito por defecto, sin dominio propio |
| 2 | `gradiente roxo` | el degradado púrpura de plantilla (*"Build the Future With AI Magic"*) |
| 3 | `review falso` | testimonios inventados con 5 estrellas |
| 4 | `logo só texto` | "logo" que es solo el nombre tipeado |
| 5 | `sem favicon` | pestaña con el ícono genérico de planeta |
| 6 | `fake views` | contador de urgencia (*"18 people are viewing this now"*) |
| 7 | `emoji` | emojis como recurso gráfico |
| 8 | `gradiente no titulo` | degradado aplicado al encabezado |
| 9 | `feito com lovable` | el badge flotante de la herramienta, sin quitar |
| 10 | `travessao` | raya/guión largo (—) en todas partes |

No hay demo, no hay código, no hay cómo arreglarlo, no hay CTA. Son 38 palabras de audio en
total. **Tampoco hay una sola cifra, precio ni resultado**: no queda nada que marcar "a
verificar" salvo la tesis misma, que es opinión sin evidencia.

**Nota de lectura:** el verbatim de Whisper viene degradado ("Domínio da Verso" por Vercel,
"Logo Só Contexto" por *logo só texto*, "Sem Feve Icon" por *sem favicon*, "Traversão" por
*travessão*). La fuente confiable acá es el texto en pantalla, no el audio.

## Veredicto: HUMO

Es el mismo género que [20 señales de que una web fue "vibecodeada"](2026-08-12-20-senales-web-vibecodeada.md)
—ingresada dos días antes, ya procesada— pero **más corto, sin definiciones y en el eje
estético en vez del técnico**. Aquella sí abrió tarea porque su checklist nos acusaba con
nombre y apellido. Esta no: verificado en este worktree, **pasamos 8 de los 10 ítems, y
varios por regla escrita, no por casualidad**:

- **Ítem 3 (reviews falsos) e ítem 6 (contadores falsos):** `apps/onia-platform/src/lib/proof.ts`
  lo prohíbe explícitamente y construye la prueba con precios públicos de la competencia; la
  sección `TODAVIA_NO` abre diciendo *"Clientes: cero… no los vamos a inventar"*.
- **Ítems 2 y 8 (gradientes de plantilla y en el título):** cero `bg-clip-text` /
  `text-transparent` en todo `web-factory/apps/**`. Y el hero con "gradient blob" ya está
  prohibido por escrito en la anti-template policy de las reglas de diseño.
- **Ítem 9 (badge de la herramienta):** no usamos Lovable.
- **Ítem 5 (favicon):** `onia-platform` tiene `src/app/icon.svg`, `apple-icon.png` y
  `public/brand/favicon.svg`; `apps/site` tiene `favicon.ico`. **`dentalgest-landing` no tiene
  ninguno** — pero ese ítem ya estaba dentro del checklist abierto por la ficha de 20 señales,
  así que no abre tarea nueva.

O sea: confirma reglas que ya escribimos en vez de descubrirnos un agujero. Sumado a que le
habla a desarrolladores brasileños (nuestro comprador es el dueño de un negocio formal
boliviano, que no sabe qué es Lovable ni vercel.app) y a que aplica el filtro §5 del corpus
—lista genérica sin definiciones, y duplicado de una pieza ya analizada—, el veredicto es duro
y va.

**La excepción de "referencia de interfaz" no aplica:** lo que se ve en pantalla son capturas
de sitios *malos* usadas como burla, no una UI que valga reconstruir en `ui-patterns/`.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| web-factory | Ninguna nueva. Si acaso, sumar tres líneas al checklist de pre-entrega que ya abrió la ficha de 20 señales (favicon, sin gradiente en H1, sin badge de herramienta) — es una edición de una lista existente, no una tarea |
| Ventas | Ninguna. Como auditoría al prospecto ya sirve la lista de 20 señales, que además es técnica y verificable; ésta es estética y discutible |
| Marketing con IA | **No copiar el formato.** Enumerar 10 ítems en 14 s sin explicar ninguno ya lo descartamos con [15 términos](2026-08-12-quince-terminos-startup-go-build.md): nombrar sin explicar no le vende a un dueño de negocio |
| Editor de videos | Ninguna. El overlay que apila la lista sincronizado con la voz ya lo hace `editor-videos` (sync-plan) sobre HyperFrames |
| ui-patterns | Ninguna. No hay interfaz propia que reconstruir |

## Riesgo

Dos, y el segundo es el que importa.

**Adoptar reglas estéticas prestadas del inglés.** El ítem 10 (la raya `—` como delator de
IA) es una convención del contenido en inglés; en español la raya es puntuación normal y
nuestros propios docs la usan. Tratarla como defecto en copy de cliente está **a verificar**,
no se adopta porque un reel de 14 s lo diga. Lo mismo el ítem 4: un logotipo tipográfico es
una decisión de marca legítima, no un error.

**Gastar análisis en humo predecible.** Esta pieza era clasificable desde el primer vistazo
(lista sin definiciones + tema ya cubierto). El corpus ya lo dice: el problema no es que salga
humo, es gastar el mismo esfuerzo en el humo previsible que en lo útil.
