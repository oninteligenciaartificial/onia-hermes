# Handoff — carril `marca-personal-carruseles`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: **2026-09-10**, sesión larga (06-sep → 10-sep) en la rama
> `claude/instagram-carousel-design-8b56e0`, worktree `.claude/worktrees/skills-setup-config-8d4674`.
> Cierra por pedido de Sergio Urcullo: *"los carruseles no enseñan nada nuevo, creá tu
> handoff y lanzamos nueva sesión para la creación de todo esto"*.

---

## 1 · Objetivo de la sesión

Diseñar carruseles de Instagram para la marca personal de Sergio Urcullo con un patrón
Apple-editorial, **puro código y diseño, sin Higgsfield**. Se cumplió y se desbordó: terminó
incluyendo la web pública, el sistema de contenido entero y la semana 1 de la comunidad.

**Definición de hecho, contra lo que se cumplió:** 8 piezas rendidas con gate verde y doc de
publicación · ✅. Web en el aire con dos guías y sus archivos · ✅. Sistema documentado · ✅.
**Publicado en Instagram: NADA.** Ver §7.

---

## 2 · Qué quedó EN PRODUCCIÓN

### La web — 🟢 viva

**<https://sergiourcullo.vercel.app>** · Vercel plan hobby, proyecto `sergiourcullo`.

| Ruta | Qué es |
|---|---|
| `/` | índice con foto, cifras y las guías |
| `/stack` | guía de las 6 herramientas |
| `/stack/archivos` | **5 archivos · sólo comunidad** (noindex verificado en la respuesta HTTP) |
| `/homelab` | guía del servidor en casa |
| `/homelab/archivos` | **3 archivos · sólo comunidad** |
| `/og.png`, `/stack/og.png`, `/homelab/og.png` | imágenes de compartir |

🔴 **CÓMO SE DESPLIEGA, y es lo que más se puede malentender:** el proyecto de Vercel está
linkeado al repo GitHub `oninteligenciaartificial/sergiourcullo`, que **NO es este repo**. Un
push acá no publica nada. Se despliega con:

```bash
python scripts/publicar-sitio.py -m "qué cambió"
```

Ese script clona el buzón en `C:/dev/proyectos/sergiourcullo-deploy`, borra todo y recopia
(así una página borrada también desaparece de la web), commitea y pushea. Vercel deploya solo
en ~1 min.

⚠️ **El alias largo de Vercel está detrás del SSO y devuelve 302 a un login.** El que se
reparte es el corto.

### El generador de carruseles

`scripts/marca-personal/generar-apple-editorial.py` — **7 layouts** (A grilla 3×N, B grilla
2×2, C duelo, D statement, E ficha, F foto a sangre, G barras) y **9 piezas** rendidas.
Gate `--check` que mide desborde real con `Range.getClientRects()` y verifica
`document.fonts.check` antes de capturar.

`scripts/marca-personal/generar-og.py` — imágenes 1200×630 de la web.

### Las 8 piezas de la cola

Todas en `hermes-content/carousels/out/apple-*-inter/`, con ZIP numerado por orden de
publicación y hoja de contacto.

| # | Pieza | Láminas | Cuenta |
|---|---|---|---|
| 1 | Mi stack | 11 | `@sergiourcullo` |
| 2 | Fable 5.1 | 8 | `@sergiourcullo` |
| 3 | Founders bolivianos | 1 | `@sergiourcullo` |
| 4 | Tu cuaderno no miente | 1 | `@sergiourcullo` |
| 5 | Necesito vitamina C | 1 | `@sergiourcullo` |
| 6 | Las seis respuestas | 6 | `@sergiourcullo` |
| 7 | Seis archivos esta semana | 8 | `@sergiourcullo` |
| 8 | Cuatro cosas a mano | 7 | **`@oniahq`** |

### La comunidad

**9 drops escritos** en `hermes-content/docs/cola/drops/`: D4, D5 y D6 de la serie vieja
(06, 07, 08-sep) y los **6 de la semana 1 del motor** (14 al 19-sep, tema Mi stack, uno por
herramienta, cada uno entregando su archivo).

### Los documentos del sistema

Siete, con índice adelante:

- `ONIA_CIRCUITO_DE_CONTENIDO.md` — **la puerta**: qué doc manda sobre qué
- `ONIA_DONDE_VA_CADA_COSA.md` — manda en lugar y exclusividad
- `ONIA_MOTOR_SEMANAL_CONTENIDO.md` — el ritmo
- `ONIA_MAPA_DE_TEMAS.md` — el backlog, ~30 temas marcados `S`/`P`
- `ONIA_RECURSOS_UN_RECURSO_TRES_PUERTAS.md` — catálogo y estados
- `ONIA_COMUNIDAD_QUE_LA_HACE_VALER.md` — por qué vale + registro de videos
- `ONIA_MARCA_PERSONAL_TRES_CARRILES.md` — el reparto

Y en `cola/`: `ARRANQUE-MOTOR-SEMANAL.md` (vence el 21-sep),
`GUIONES-SEMANA-1-MI-STACK.md`, `PARA-PUBLICAR-APPLE-*` (7 docs).

📄 El sistema entero, consultable en una página:
<https://claude.ai/code/artifact/fb52b4b9-4504-4b8a-afca-46cf2a8f9586>

---

## 3 · Qué quedó a medias, y dónde

| Qué | Dónde | Estado |
|---|---|---|
| **Nada sin commitear** | — | El árbol está limpio. Los 7 commits de este carril están en la rama y **falta mergear a `main`** |
| Video de YouTube «qué es Claude Code» | — | Grabado por él, sin publicar. Falta el link para embeber en `/stack` paso 04 |
| Página `/claude-code` | no existe | Se escribe cuando el video salga |
| `[TU EJEMPLO]` del drop D5 | `cola/drops/2026-09-07.md` | Hueco marcado: falta una imagen real hecha con Higgsfield |
| Placas de comandos para los videos | no existe | Ofrecidas, no pedidas |
| Miniatura de YouTube | no existe | Ofrecida, no pedida |

---

## 4 · Archivos que toca este carril

```
scripts/marca-personal/generar-apple-editorial.py    generador de carruseles (7 layouts)
scripts/marca-personal/generar-og.py                 imágenes de compartir
scripts/publicar-sitio.py                            deploy de la web
hermes-content/sitio-sergiourcullo/**                el sitio (7 archivos + sergio.png)
hermes-content/carousels/out/apple-*-inter/**        las 8 piezas rendidas
hermes-content/references/ui-patterns/apple-editorial/**   FICHA, tokens, fuentes, logos, objetos
hermes-content/docs/ONIA_CIRCUITO_DE_CONTENIDO.md    + los 6 docs del sistema
hermes-content/docs/cola/drops/2026-09-0[6-8].md     D4, D5, D6
hermes-content/docs/cola/drops/2026-09-1[4-9].md     la semana 1 del motor
hermes-content/docs/cola/PARA-PUBLICAR-APPLE-*.md    7 docs de publicación
hermes-content/docs/cola/GUIONES-SEMANA-1-MI-STACK.md
```

⚠️ **No toca `web-factory/` ni `onia-platform/`.** Cero choque con otros carriles.

---

## 5 · Intentos fallidos y errores — lo que no hay que repetir

### 🔴 El que cierra la sesión: los carruseles no enseñaban nada nuevo

Sergio Urcullo, 10-sep, sobre las tres últimas piezas. **Tiene razón y el diagnóstico es
claro: las armé como RESUMEN de los drops y de las guías**, no con un descubrimiento propio.
Un carrusel que repite lo que ya está en la guía no tiene por qué existir — el lector no se
lleva nada que no tuviera.

**Lo que sí funcionó, y es el patrón a copiar:** las piezas buenas tenían **un dato que el
lector no sabía**. La sexta respuesta de WhatsApp (la que pide la decisión), el «Stripe no
acepta Bolivia», el «31,4% es 1 de cada 3, no una nota baja». Las que fallaron sólo
ordenaban información ya dada.

**Regla para la sesión que sigue: si el carrusel no tiene UNA cosa que el lector no sabía, no
se hace.** Un resumen no es una pieza.

### Errores propios corregidos en el camino

| Qué pasó | Cómo se detectó |
|---|---|
| **Atribuí a Fable logros de Mythos 5.1** (proteínas 10×, kernels GPU 2,5×) | Releyendo la página oficial. Estuvo **a un render de publicarse** |
| **La guía `/stack` decía que el plan gratis de Claude alcanzaba** | Leyendo la doc oficial. Es falso: no incluye Claude Code. Estuvo **publicado 2 días** |
| **Escribí que la comunidad no existía** | Él me mandó a leer el repo. Existía desde el 02-sep con 5 días de funcionamiento |
| **El handle estaba fijo global** | Al rendir la pieza de Onia salió firmada `@sergiourcullo`. **Ningún gate lo atrapa** |
| Claude/ChatGPT/Gemini con logos falsos | Él lo marcó dos veces |
| El A/B tipográfico "mostró diferencia" y los PNG eran idénticos | md5. Causa: Google Fonts corría carrera con la captura |

### Trampas técnicas, ya documentadas en la FICHA

- **`object-fit` no aplica a un `<svg>` en línea.** Los squircles desbordaban su caja.
- **Chrome `--screenshot` exige ruta absoluta**; con relativa falla en silencio y sale 0.
- **Fuentes por `@import` de Google**: la captura sale antes que la webfont. Todo vendorizado.
- **Heredoc de bash convierte `\n` en salto real** → SyntaxError en Python. Pasó 5+ veces.
  **Solución: escribir el patch con la herramienta Write y ejecutarlo**, nunca heredoc con
  escapes.
- **Openverse rechazado con evidencia** (`RECHAZO-openverse.jpg`). Unsplash y Pexels sí.
- **El mate costó 5 búsquedas**: sólo se reconoce **de perfil y con bombilla**.

---

## 6 · Qué depende de Sergio Urcullo

| | Bloquea |
|---|---|
| 🔴 **Publicar.** 8 piezas rendidas, **0 publicadas** | todo el carril |
| 🔴 Mandar el link de `/homelab` a los 3 que comentaron el reel del 07-sep | gente esperando desde hace 3 días |
| 🔴 Elegir el tema de la semana y **grabar los 6 videos** | la semana del 14 |
| 🔴 El link del video de YouTube | `/claude-code` y el paso 04 de `/stack` |
| 🔴 Cablear `palabras` en el workflow n8n de private-reply | toda palabra clave automática |
| 🟡 Decidir si los reels se embeben o se re-suben a la web | que los videos no se pierdan |
| 🟡 El `[TU EJEMPLO]` del D5 | ese drop |
| 🟡 Comprar `sergiourcullo.com` (~$12/año, verificado libre) | nada — el `.vercel.app` funciona |

---

## 7 · Próximos pasos para la sesión nueva

🔴 **CORREGIDO el 10-sep.** Acá decía *"publicar las 8 piezas y correr la semana 1"*, y
Sergio Urcullo lo marcó: *"está mal tu enfoque; si tenés carruseles que están horribles,
primero perfeccionar y ver cuáles son los mejores"*. Tenía razón — ese objetivo asumía
que las 8 estaban bien, cuando él acababa de decir lo contrario.

**El objetivo correcto:** *dejar publicables las piezas que valen la pena y publicarlas.*
Los veredictos, uno por uno, en [`cola/AUDITORIA-8-CARRUSELES.md`](../cola/AUDITORIA-8-CARRUSELES.md):
**2 listas · 2 para recortar · 1 que caduca · 3 sin dato**.

1. **Mergear esta rama a `main`.** 7 commits sin mergear.
2. **Antes de escribir un carrusel nuevo**, leer §5: la regla del dato que el lector no
   sabía. Si no lo tiene, no se hace.
3. Los temas del backlog marcados `S` en `ONIA_MAPA_DE_TEMAS.md` son la fuente; los que
   salen de drops que ya funcionaron (`/prompts` del D2, `/que-automatizar` del D3,
   `/habilidades` del D4) son los más baratos porque el contenido ya está probado.
4. **No abrir frentes nuevos.** Hay 8 piezas, 2 guías, 9 drops y 7 guiones sin publicar.

⚠️ **El patrón está en `references/ui-patterns/apple-editorial/FICHA.md`** con ~20 trampas
numeradas, cada una con la historia que la originó. Leerlo antes de tocar el generador: una
regla sin su historia se desobedece.
