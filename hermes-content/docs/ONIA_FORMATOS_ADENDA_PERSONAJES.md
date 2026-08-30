# Adenda al manual de formatos — personajes en @oniahq

> 🔴 **AVISO (2026-08-30) — este doc nombra el Soul de Lucía, y el Soul está PROHIBIDO.**
>
> El Soul `36305a9b` (LUCIA-REAL-v2-clean) sale con **la piel roja**, ignora el atuendo pedido y se
> entrenó con frames de una persona real sin permiso documentado. El Soul v3 `e6d8703c` perdió el
> A/B del 22-ago y le cambia el color de ojos.
>
> **La cara de Lucía se genera con el Element-ancla `@lucia-skin-v1`
> (`58bbd635-9b90-4bd2-b08a-1cd4915bd563`), NO con un Soul.** Manda
> `references/modelos/lucia/BANCO-OFICIAL.md`. Señal rápida: **si la cara está roja, está mal.**

> Decisión de Sergio, 2026-08-24: *"en Onia pueden salir personajes ficticios o Lucía misma"*.
>
> El manual (`ONIA_MANUAL_DE_FORMATOS_20260813.md`) tiene **24 formatos** con costo, tiempo y
> herramienta. Esta adenda **no los reemplaza**: dice qué cambia con la decisión de arriba.

## Lo que se desbloquea

@oniahq no tenía material visual propio: sin cara, sin banco de fotos, sin b-roll. Por eso
sus piezas dependían de tipografía y capturas. Con la decisión nueva:

| Se desbloquea | Cómo | Costo |
|---|---|---|
| **Todo el banco de b-roll de Lucía pasa a estar disponible para @oniahq** | Ya está generado y pagado: rooftop, café, calle, mercado, gimnasio, trabajando | **0 cr** |
| **P16 · Escenificación en 2ª persona** (el manual lo llama "el molde de más valor comercial") | Un personaje vive el problema mientras el rótulo le habla al lector | 0 cr |
| **P22 · Dos que caminan** (diálogo) | Soul de Lucía, 1 sola cara en cuadro | 3 gen · permiso |
| **Personaje de dueño de negocio** — el comprador hecho visible | Higgsfield, personaje recurrente | ~2 cr/imagen |

**El desbloqueo más grande no es artístico, es de inventario:** @oniahq pasa de no tener
material a tener un banco entero sin gastar un crédito.

## 🔴 Lo que NO se desbloquea, y no se va a desbloquear

**Un personaje ficticio NO puede dar un testimonio.** El formato **P24 (testimonio de
cliente) sigue bloqueado** y lo seguirá hasta que haya un cliente real que quiera darlo.

La regla del catálogo es explícita: con cero clientes pagando, **prohibido inventar
testimonios, logos o cifras**. Poner una cara generada diciendo *"usé Onia y me cambió el
negocio"* es exactamente eso, y no deja de serlo porque la cara sea ficticia — **es peor**,
porque parece real.

**La línea, escrita para que no se cruce por accidente:**

| ✅ Permitido | ❌ Prohibido |
|---|---|
| Un personaje **vive el problema**: atiende, anota en un cuaderno, cierra la caja | Un personaje **dice que compró** o que le funcionó |
| Lucía **explica** algo, declarada como IA | Lucía **testimonia** como si fuera clienta |
| Escenificar una situación típica del rubro | Presentar la escena como un caso real |
| Rótulo en 2ª persona: *"esto te pasa a vos"* | Rótulo en 1ª: *"esto me pasó a mí"* dicho por un personaje |

**Prueba rápida antes de publicar:** si un espectador pudiera pensar que esa persona es un
cliente de Onia, la pieza está mal. La ficción tiene que ser evidente o irrelevante.

## Cómo se reparte ahora la cara entre las tres cuentas

| Cuenta | Quién puede aparecer |
|---|---|
| **@sergio_urcullo** | Sergio. Es marca personal: la cara **es** el activo |
| **@oniahq** | Lucía (declarada IA) o personajes de escenificación. **Nunca como testimonio** |
| **Lucía** | Ella, siempre declarada |

⚠️ **Riesgo a vigilar:** si Lucía aparece mucho en @oniahq, las dos cuentas se vuelven la
misma y se pierde el motivo de tener dos. **Lucía en @oniahq va como invitada, no como
presentadora** — y las piezas de escenificación mejor con personajes que no sean ella.

## Lo que de verdad frena el manual hoy

No son las ideas: son **tres archivos que no existen** y que bloquean 4 formatos. El propio
manual los marca con asterisco:

| Falta | Bloquea |
|---|---|
| `capture-web.mjs` | P02 (antes/después) |
| `_reel.html` | P04, P12 |
| `film-pattern.mjs` | P04 |

Se escriben **una sola vez** y desbloquean cuatro formatos de costo cero. **Es el mejor
retorno por hora de trabajo que hay en el manual.**

## Lo que sigue

1. Escribir los tres archivos que faltan → desbloquea P02, P04, P12.
2. Producir **P16 escenificación** para @oniahq con el b-roll de Lucía, que ahora se puede.
3. Recién después, evaluar el personaje de dueño de negocio (cuesta créditos y hay que
   sostener su consistencia, que es el problema que más nos frena).
