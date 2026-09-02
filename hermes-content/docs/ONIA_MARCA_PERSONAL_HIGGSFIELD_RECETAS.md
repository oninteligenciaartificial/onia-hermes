# Recetas Higgsfield — artes y reels para marca personal y comunidad

> Consolidación 2026-09-01, actualizada 2026-09-02 tras probar el **CLI oficial**.
> **La vía de producción es el CLI (`@higgsfield/cli`)** — decisión de Sergio, verificada:
> job type EXPLÍCITO (sin sustitución silenciosa), `generate cost` cotiza ANTES, y el
> cobro medido coincidió exacto (0,12 cr cotizados = 0,12 debitados). Autenticado en
> Windows y en el VPS (token OAuth oficial copiado — no es login de navegador).
> El MCP viejo sigue PROHIBIDO (sustituía modelos y cobraba). La web queda para lo
> manual/exploratorio. IMAGEN lote chico = autorizado con registro. VIDEO = permiso
> explícito caso por caso, cotizado antes. Tope del loop: 2 cr/día, solo imagen.
> Plan ULTRA: 2.019 créditos al 2026-09-02.

## Qué modelo para qué (roster del repo)

| Necesidad | Modelo | Nota de costo/uso |
|---|---|---|
| Cara REAL de Sergio en una escena | **Soul + texto** — ÚNICO método aprobado para cara consistente | ~0,12 cr por imagen 2k con soul_2 |
| Ediciones sobre una imagen, negaciones, objetos | **nano_banana** (+ Element para fijar atuendo/props) | las negaciones FUNCIONAN por esta vía |
| Video barato (movimiento simple) | **kling** | video = permiso caso por caso |
| Íconos/artes planas estilo 3D | NO usar Higgsfield: plantilla + Fluent 3D (gratis, ya probado) | 0 |

## El activo que ya tenemos: identity lock de Sergio

`references/sergio-approved-media/identity-shoots/20260605-nano-banana-face-teeth-lock*`
(plancha 6 poses, fondo gris, remera negra) + fotos reales en `final-avatar-identity-lock/`.
Ese lock es la referencia para que Soul/nano_banana mantengan SU cara. La foto verde de
perfil (polo azul, fondo #00-verde) es el look "oficial" de perfil.

## Receta 1 — ARTE con la cara de Sergio (statement-post premium)

Para portadas de carrusel o statement-posts donde aparece él (no ícono):

1. En Higgsfield web → Image → **Soul**, adjuntar identity lock (2 imágenes de la plancha).
2. Prompt base (ajustar escena):
   > "Young latino entrepreneur, EXACT same face as reference, wearing navy polo shirt,
   > standing confidently with arms crossed, isolated on solid warm white background
   > #F7F7F7, soft studio light, editorial minimal style, waist-up, high detail"
3. 2k, lote de 2-4 variantes (≈0,5 cr). Elegir 1, recortar, componer en la plantilla
   statement (la caja de texto y los íconos los pone el generador nuestro).
4. Registrar el lote (prompt, modelo, costo) en esta sección al final.

## Receta 2 — REEL UGC estilo Revolutia (el formato que pidió Sergio)

El video se GRABA real (Sergio a cámara — más barato y más auténtico que generarlo).
Higgsfield solo aporta piezas:
- **Overlay 3D del logo/objeto** (tipo el Claude flotante): nano_banana → "3D clay style
  app icon of [logo], floating, soft shadow, transparent-friendly solid background" →
  se recorta y se anima en el editor (editor-videos hace el overlay).
- **B-roll imposible** (ej. "servidor en llamas", "oficina del futuro"): SOLO si el clip
  real no existe. Es VIDEO → cotizar con get_cost y pedir permiso ANTES.

## Receta 3 — Artes de comunidad SIN Higgsfield (el default diario)

Plantilla statement-3d-minimal + íconos Fluent → PNGs. Costo 0, corre en el VPS,
ya probado. Higgsfield se reserva para lo que la plantilla no puede: la cara, escenas,
realismo.

## Flujo operativo (quién hace qué)

| Paso | Quién |
|---|---|
| Spec del arte (claim, escena, modelo, prompt) | yo (sesión madre o loop VPS escribe el spec al repo) |
| Generación en Higgsfield web | **Sergio con su navegador** (yo dirijo con el spec exacto) o la sesión de creativos |
| Descargar SIEMPRE el resultado (no dejarlo en el CDN) | quien genera — regla por las 12 piezas perdidas |
| Composición final (texto, plantilla, export) | la máquina (generadores del repo) |
| Registro del lote (prompt+modelo+costo) | quien genera, en este doc |

## Vía API futura (propuesta, decide Sergio)

Higgsfield NO tiene API con key. Para que el VPS genere imagen/video sin navegador, la
puerta es **fal.ai** (API key, pago por uso, modelos flux/kling/etc.). Es dar de alta
una plataforma nueva = permiso de gasto explícito. Hasta entonces: VPS = plantillas;
navegador = Higgsfield.

## Registro de lotes

| Fecha | Pieza | Modelo | Prompt (resumen) | Costo |
|---|---|---|---|---|
| 2026-09-02 | Test CLI: overlay starburst 3D clay (usable para reel "El setup") | text2image_soul_v2 | 3D clay render, orange starburst icon, rounded square, warm white bg | 0,12 cr (cotizado = debitado ✓) |
| 2026-09-02 | Práctica: 3 candidatos mascota 3D Onia (cubo/blob/chip), pendiente §6 BASE_CONTENIDO — ver veredicto ahí | text2image_soul_v2 ×3 | toy 3D clay mascot, verde marca #1F7A4D, variando forma de cabeza (cubo / blob / chip-circuito) | 0,12 cr ×3 = 0,36 cr (cotizado y confirmado por `account transactions` antes y después) |
| 2026-09-02 | Experimento arte vs ícono (gana arte, ver §6 BASE_CONTENIDO) + portada real `carrusel-sistema-venta` | text2image_soul_v2 | 3D clay render, abstract interlocking gears, verde marca #1F7A4D, rounded toy-like, warm white bg #F7F7F7 | 0,12 cr (cotizado = debitado ✓, verificado en `account transactions`) — **total del día para este carril: 0,60 cr de 1 cr** |

### ⚠️ El tope que frena no siempre es el nuestro (02-sep)

Al pedir el arte de portada del carrusel de atención, con el gasto del carril en
**0,60 de 1 cr** y el modelo cotizado en 0,12 cr (`higgsfield generate cost
text2image_soul_v2` → `0.12 credits`), la generación falló:

```
{"error_type":"grace_daily_limit_reached", ...}
```

**Cero cargos** — verificado en `higgsfield account transactions` antes y después: la
última línea seguía siendo `2026-09-02 08:48 Seedance 1.5 Pro -4.8`, sin entrada nueva.
El límite es **de la cuenta compartida**, que ese día ya venía gastando fuerte por otro
carril (Seedance 4,8 ×3 + Nano Banana Pro 2 ×2 ≈ 18 cr antes de las 09:00).

**Lo que hay que saber:** el presupuesto propio de 1 cr/día **no garantiza** que se pueda
generar. Un carril puede tener saldo y aun así quedar bloqueado por lo que gastó otro.
La pieza tiene que poder salir sin arte pago — por eso el default sigue siendo la
Receta 3 (plantilla + íconos Fluent, costo 0), y el arte Higgsfield es un **plus de la
portada**, nunca un requisito. El carrusel de atención salió completo con íconos.
