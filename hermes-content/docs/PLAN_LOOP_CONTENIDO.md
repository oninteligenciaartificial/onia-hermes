# Plan del loop de contenido — las 3 cuentas

> Encargo de Sergio, 2026-08-27, antes de salir: *"coloca un loop que aprenda a hacer los
> reels y hacer reels que enseñen absolutamente todo sobre Onia Platform y Lucía, acomoda y
> arma los carruseles para las 3 cuentas… tenés permitido usar Higgsfield… usá tus docs y
> perfeccioná tu técnica, dá datos relevantes y mirá el estilo de las 3 cuentas"*.
>
> **Este archivo es la fuente de verdad del loop.** Cada iteración lo lee, hace UNA cosa
> entera, la verifica mirando el PNG o el MP4, la commitea y tacha la línea.

---

## Las reglas que no se negocian

Salen de errores ya cometidos en esta sesión. Romper una es repetir el error.

1. **Toda cifra lleva fuente.** El motor no dibuja un `dato` sin `fuente`. Si el dato es de
   otro país o de hace años, se dice en la pieza.
2. **Cero clientes pagando** ⇒ prohibido inventar testimonios, logos o resultados propios.
3. **Se mira el PNG / el MP4 renderizado.** Un render sin error no es una pieza verificada.
4. **El gate corre ANTES de renderizar** y no se renderiza en rojo.
5. **Ninguna imagen repetida** dentro de una pieza.
6. **Las coordenadas se miden** con `scripts/grilla_pct.sh`, nunca a ojo.
7. **Prompts de imagen en español**, cortos, con el bloque de estilo fijo. En inglés meten
   cartelería en inglés.
8. **Nada de `**negrita**`**: el motor entiende `*énfasis*` y nada más.

---

## Cuenta 1 · @oniahq — el molde ya está aprobado

**Molde:** `ui-patterns/carrusel-dato-ilustrado/` — leerlo antes de tocar nada.
**Arco obligatorio:** problema → dato con fuente → por qué pasa → el giro →
**"Con Onia Platform"** → guardá esto → cierre.

La lámina de solución **no es opcional**: sin ella la pieza es un problema sin dueño.

| Pieza | Tema | Estado |
|---|---|---|
| O07 | Inventario que miente (65 %) | ✅ hecho, aprobado |
| O03 | Facturación en línea | ✅ 8 láminas, con la solución honesta sobre el emisor |
| O04 | Qué hace el sistema | ✅ 8 láminas · se queda en dark-product, que es el molde de producto |
| O08 | **Fiado**: la mora subió al 3,0 % en 2025, casi el doble que 2020 (ASFI) | ⬜ |
| O09 | **QR**: 891 M de pagos en 2025, el 88,4 % por menos de Bs 500 (ABI/ASFI) | ⬜ |
| O10 | **El Excel miente**: 94 % de las planillas auditadas tenían errores (Panko) | ⬜ |
| O11 | **42 horas** promedio para contestar a un cliente (HBR, 2011) | ⬜ |

**Los datos ya están verificados** — están en `ONIA_AUDITORIA_DE_LAS_21_PIEZAS.md` y en el
journal del workflow. Cada uno con su fuente y su año.

## Cuenta 2 · @sergio_urcullo — el molde nuevo: **el equipo de empleados IA**

**Referencia que eligió Sergio:** `instagram.com/p/DcjXxcBlq-8` de **@iampascio**.
Guardada en `marca-personal-sergio/referencia-iampascio/`.

**El concepto:** presentar tus herramientas como si fueran **empleados que contrataste**.

- **Portada:** *"I hired 5 fake employees (They never ask for a raise)"*
- **Cada lámina:** tarjeta de empleado — número · nombre · **cargo** · qué hace, dicho desde
  el dueño: *"Turns rough scripts into videos without me touching a timeline"*
- **Caption:** corto y con humor seco. *"My best employees don't sleep, complain, or ask for
  a raise."*

**Por qué le sirve a Sergio:** es primera persona, enseña herramientas concretas, tiene
humor, y **el contenido ya existe** — S05 tenía Zapier→n8n, Intercom→Chatwoot,
Firebase→Supabase, Buffer→Postiz. Ese ES su equipo.

**Lo que hay que construir:** un pack `tarjeta-empleado` en el motor. Tarjeta por lámina con
número grande, nombre, cargo en versales, y la línea de qué hace.

⚠️ **Los 5 carruseles viejos de Sergio (S01-S05) se ven idénticos a los de Onia.** Ese es su
defecto principal y este molde lo arregla: nadie más va a tener tarjetas de empleado.

| Pieza | Tema | Estado |
|---|---|---|
| S06 | **Mi equipo de 6 empleados que no cobran** — n8n, Chatwoot, Supabase, Postiz, Whisper, ffmpeg | ⬜ |
| S07 | **Lo que me costó aprender** — errores reales del repo, con el commit | ⬜ |
| S08 | **El software que pagás ya existe gratis** — port de S05 al molde nuevo | ⬜ |

## Cuenta 3 · Lucía — editorial fotográfico, y **declarada IA siempre**

**Molde:** `editorial-photo` con su banco de fotos. Ya probado en L6.

🔴 **L6 no dice en ninguna lámina que Lucía es IA.** Es regla del proyecto y política de
Meta. **Arreglarlo es lo primero de esta cuenta.**

| Pieza | Tema | Estado |
|---|---|---|
| L6 | 5 señales | ✅ **declara la IA en la portada y en el cierre** |
| L08 | **Herramientas que sí sirven** — con la palabra HUMO, que ya tiene su PDF | ⬜ |
| L09 | **Cómo se hace una cara que no existe** — detrás de escena, honesto | ⬜ |

---

## Los reels — "que enseñen absolutamente todo sobre Onia Platform y Lucía"

**Motor:** HyperFrames (HTML→MP4, gratis) + ffmpeg. **Revisar `.agents/skills/` ANTES de
codear video** — la regla dice no reinventar el motor.

**Lo que ya funciona** (`oniahq/reel-R01/`): capturas reales del producto con paneo lento y
placas de texto en 2ª persona. 20 s. Dos trampas ya documentadas en su `build.sh`:
`zoompan` tarda más de 10 min por clip, y `crop` fijo revienta con imágenes apaisadas.

**Serie de reels de Onia Platform** — uno por módulo, 20-30 s, capturas reales:

| # | Módulo | Qué muestra |
|---|---|---|
| R02 | Catálogo | cargar un producto con precio y costo |
| R03 | Caja | el cierre del día, por método de pago |
| R04 | Fiados | el vencido y el mensaje ya escrito |
| R05 | Inventario | el aviso de "se está por acabar" |
| R06 | Agentes | la propuesta esperando aprobación |

**Reels de Lucía** — con su banco de b-roll, que ya está pagado:

| # | Tema |
|---|---|
| RL01 | Una herramienta de IA que sí sirve, en 20 s |
| RL02 | "Esta cara no existe" — cómo se hace, declarado |

**Regla del video:** la tabla de cortes y el preview se le muestran a Sergio **antes** de
aplicar el corte. Nunca cortar a ciegas.

---

## El orden del loop

Cada iteración: **UNA pieza entera**, verificada mirando el render, commiteada.

1. ~~L6 declarando IA~~ ✅ hecho
2. ~~O03 y O04 con la lámina "Con Onia Platform"~~ ✅ hecho
3. **El pack `tarjeta-empleado`** + **S06** — desbloquea la cuenta de Sergio entera
4. **O08** (fiado) y **O09** (QR) — datos bolivianos ya verificados
5. **R02** — el primer reel de módulo
6. Seguir la tabla

**Al terminar cada pieza:** tachar la línea de este archivo y commitear.

## Presupuesto

**900 créditos/mes** en el plan Pro. Una ilustración = 2 créditos.
El banco de `oniahq/ilustraciones/` **se reusa entre piezas del mismo rubro** — no se generan
5 nuevas por pieza. Ya hay 9.
