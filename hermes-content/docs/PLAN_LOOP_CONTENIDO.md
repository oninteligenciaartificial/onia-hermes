# Plan del loop de contenido — las 3 cuentas

> Encargo de Sergio, 2026-08-27, antes de salir: *"coloca un loop que aprenda a hacer los
> reels y hacer reels que enseñen absolutamente todo sobre Onia Platform y Lucía, acomoda y
> arma los carruseles para las 3 cuentas… tenés permitido usar Higgsfield… usá tus docs y
> perfeccioná tu técnica, dá datos relevantes y mirá el estilo de las 3 cuentas"*.
>
> **Este archivo es la fuente de verdad del loop.** Cada iteración lo lee, hace UNA cosa
> entera, la verifica mirando el PNG o el MP4, la commitea y tacha la línea.

---

## 🔴 Higgsfield se opera SOLO por navegador (2026-08-28)

Sergio: *"no usarás MCP, harás todo desde el navegador a mi cuenta"*. El MCP sustituía el
modelo en silencio (`nano_banana_2` → `nano_banana_flash`) y cobra créditos; la web deja
elegir el modelo y tiene el toggle **`Unlimited`**. El flujo está en `BANCO-OFICIAL.md`.

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
| O08 | **Fiado** ⛔ **BLOQUEADA — se buscó y NO existe el dato.** Ver abajo | ⛔ |
| O09 | **QR**: 891 M de pagos en 2025, el 88,4 % por menos de Bs 500 (Asoban) | ✅ verificado en fuente |
| O10 | **La planilla que miente**: 84 % de 163 planillas auditadas tenían errores (Panko) | ✅ 8 láminas |
| O11 | **42 horas** promedio para contestar a un cliente (HBR, 2011) | ✅ 8 láminas · dato verificado en la fuente |

⚠️ **Los datos NO estaban todos verificados, contra lo que decía este plan.** El «94 % de
Panko» que esta tabla citaba para O10 **no existe**: no aparece en su recopilación. Las cifras
reales, chequeadas en la fuente primaria (`panko.com/ssr/Audits.html`), son **84 % de 163
planillas** en nueve estudios y **91 % de 55** en los cinco de metodología más estricta, con
auditorías de 1987 a 2001 en EE. UU., Reino Unido y Australia. **Antes de dibujar una cifra se
va a la fuente, aunque este plan la dé por buena.**

### ⛔ O08 (fiado) — por qué queda bloqueada, y qué se buscó

Para que nadie repita la búsqueda a ciegas. **Buscado el 2026-08-28:**

- Estudio del comercio minorista de La Paz y El Alto (IICCA) — el PDF existe pero pesa más de
  10 MB y no se pudo leer entero; no aparece el fiado en lo indexado.
- Censo de retail tradicional de Captura Consulting (2010) — habla de la estructura de las
  tiendas, no del crédito a clientes.
- Encuesta MYPES del INE (2007) — socioeconómica, sin el dato.

**Lo único que sí existe es de Cali, Colombia** («Circuitos crediticios: el fiado en Cali»).
Usarlo sería el mismo estiramiento que el de ASFI: un dato de otro país sobre otra economía,
presentado como si describiera a una tienda boliviana.

**Qué la destrabaría:** un dato boliviano real sobre crédito informal en comercio minorista, o
cambiar el ángulo a algo que no necesite cifra — el fiado se puede contar con una escena
(el cuaderno, el "te lo anoto") sin fingir que hay una estadística detrás.

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

✅ **Pack `tarjeta-empleado` construido.** Azul noche + ámbar + Archivo condensado y mono —
cero elementos compartidos con el sistema de Onia, que era el defecto a matar.

⚠️ **Los 5 carruseles viejos de Sergio (S01-S05) se ven idénticos a los de Onia.** Ese es su
defecto principal y este molde lo arregla: nadie más va a tener tarjetas de empleado.

| Pieza | Tema | Estado |
|---|---|---|
| S06 | **Mi equipo de 6 empleados que no cobran** — n8n, Chatwoot, Supabase, Postiz, Whisper, ffmpeg | 🔴 **BLOQUEADA**: promete STACK y ese PDF no existe. El gate lo marca solo |
| S07 | **Cinco cosas que parecían funcionar** — 5 errores reales, cada uno con su commit | ✅ 8 láminas |
| S08 | **Tu software no subió de precio, subió el dólar** — el ángulo del dinero, con el dato del BCB | ✅ 8 láminas |

## Cuenta 3 · Lucía — editorial fotográfico, y **declarada IA siempre**

**Molde:** `editorial-photo` con su banco de fotos. Ya probado en L6.

## 🔴 LO PRIMERO: `references/modelos/lucia/BANCO-OFICIAL.md`

**Antes de elegir una sola foto de Lucía se lee ese archivo.** Es una pantalla y dice qué
carpeta se usa y cuál no. El 28-ago salieron L08 y L09 con `calibracion-20260806`, un banco que
Sergio había descartado el 15-ago: son salidas del Soul prohibido y la cara sale **con las
mejillas enrojecidas y sin las argollas de oro**. Sergio lo cazó de una: *"la skin de Lucía que
usaste no es esa"*.

El dato estaba en `LUCIA.md`… en la línea 90 de 50 KB. **Un doc largo no es una fuente
consultable.** Ahora: el banco vive en `scripts/lucia_banco.json`, el gate lo valida como lista
blanca y falla antes de renderizar, y lo descartado se movió a `_ARCHIVO-NO-USAR/`.

**Cómo se reconoce la cara buena:** piel de tono parejo, **pecas contables**, **argollas
doradas + cadenita**, algo terracota en cuadro. **Si la cara está roja, la foto está mal.**

⬜ Pendiente encontrado al pasar el gate por todo: `lucia-quien-es-fijado.json` repite
`IMG-05-ugc-selfie.png` en las láminas 1 y 6.

---

🔴 **Trampa del banco de fotos: varias tienen TEXTO GENERADO ILEGIBLE.** `L7` y `L8` traen
párrafos sin sentido en la pared («Writhe LAlnaisnò de a Cnarvioa»), y `L6` tiene carteles de
precio. Lucía declara que es IA de frente; que además se le note por un error de renderizado
es lo contrario de eso. **Sucias también `L10` y `L11`**: traen una UI de Instagram falsa con texto inventado
encima de la foto — se descubrieron en la iteración de L09, mirándolas.
**Verificadas limpias: L1, L2, L3, L4, L5, L13, L14, L15 y las de `biblioteca`.**
Mirar la foto antes de usarla, siempre.

🔴 **L6 no dice en ninguna lámina que Lucía es IA.** Es regla del proyecto y política de
Meta. **Arreglarlo es lo primero de esta cuenta.**

| Pieza | Tema | Estado |
|---|---|---|
| L6 | 5 señales | ✅ **declara la IA en la portada y en el cierre** |
| L08 | **Herramientas que sí sirven** — con HUMO, que ya tiene su PDF | ✅ 7 láminas · **rehecha con el banco oficial** |
| L09 | **Cómo se hace una cara que no existe** — detrás de escena, honesto | ✅ 7 láminas · **rehecha con el banco oficial** + 1 imagen generada con el ancla |

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
| R02 | ~~Catálogo~~ | ⛔ **bloqueado: no existe captura del módulo.** Capturarla es del carril de producto |
| R03 | Caja | el cierre del día, por método de pago |
| R04 | Fiados | el vencido y el mensaje ya escrito |
| R05 | Inventario | el aviso de "se está por acabar" |
| R06 | Agentes | la propuesta esperando aprobación |

✅ **R02-qr hecho** — 20 s con las ilustraciones de O09 y el dato de Asoban. Se hizo este en
vez del de Catálogo porque un reel que dice mostrar un módulo sin mostrarlo es justo la falta
que el gate existe para evitar. **Los reels de módulo quedan todos bloqueados hasta tener las
capturas.**

**Reels de Lucía** — con su banco de b-roll, que ya está pagado:

| # | Tema |
|---|---|
| RL01 | Una herramienta de IA que sí sirve, en 20 s · 🟡 **tabla + preview listos, falta el OK para el corte final** |
| RL02 | "Esta cara no existe" — cómo se hace, declarado · 🟡 **tabla + preview listos, falta el OK de Sergio para el corte final** |

**Regla del video:** la tabla de cortes y el preview se le muestran a Sergio **antes** de
aplicar el corte. Nunca cortar a ciegas.

---

## El orden del loop

Cada iteración: **UNA pieza entera**, verificada mirando el render, commiteada.

1. ~~L6 declarando IA~~ ✅ hecho
2. ~~O03 y O04 con la lámina "Con Onia Platform"~~ ✅ hecho
3. ~~El pack `tarjeta-empleado` + S06~~ ✅ hecho
4. ~~O09 (QR)~~ ✅ hecho · **O08 bloqueado**: su dato no aplica al tema (ver la tabla)
5. ~~El primer reel~~ ✅ R02-qr hecho · los de módulo, bloqueados por falta de capturas
6. ~~L08 con la palabra HUMO~~ ✅ hecho
7. ~~O10 (la planilla que miente)~~ ✅ hecho
8. ~~O11 (las 42 horas)~~ ✅ hecho
9. ~~S07 (cinco cosas que parecían funcionar)~~ ✅ hecho
10. ~~S08 (subió el dólar, no el software)~~ ✅ hecho · y la repetición de `quien-es-fijado` corregida
11. ~~Escribir el recurso STACK~~ ⛔ **Sergio, 2026-08-28: "aún no armes los PDFs".**
    Ningún recurso nuevo se escribe hasta que lo diga. Los que faltan quedan anotados,
    no se producen.
12. ~~El acento de Lucía~~ ✅ **VERDE** — Sergio, 2026-08-28: *"usa color verde siempre"*
13. RL02 🟡 preview listo, esperando OK
14. ~~El ancla de Lucía con 7 ángulos~~ ✅ `lucia-skin-v1` `58bbd635`, probado con A/B
15. ~~Un doc por tema sin contradicciones~~ ✅ ver abajo
16. RL01 🟡 preview listo, esperando OK
17. ~~O01 (imagen repetida)~~ ✅ desbloqueada
18. Seguir la tabla

**Aprendido en O01 — los `panel-*` son recortes, NO fondos.** Todos son apaisados (ratio 1,9
a 8,6). Un `bg` va a sangre con cover: si la imagen es más apaisada que el lienzo 4:5, se
**amplía** para cubrirlo. Un panel de 930×360 se ampliaba **3,75×** y salía un "40" gigante con
las palabras cortadas. Ahora lo caza el gate (`bg-deformado`).

**Y cómo se calibró ese umbral, que importa más que la regla.** Con el corte en 1,15× marcaba
**18 fondos sanos** — las fotos de Lucía se amplían 1,2× y a ojo no se nota; se miraron los
renders. Lo que rompía O01 era una **captura con texto** a 3,75×. Se subió a 1,5×: hoy marca
cero falsos positivos. **Una regla con falsos positivos se termina ignorando, que es peor que
no tenerla** — y eso solo se ve corriéndola sobre todo el inventario, no sobre el caso que la
originó.

**Aprendido en RL01 — qué regla gana cuando dos se cruzan.** La regla "ninguna imagen repetida"
es DENTRO de una pieza. Aplicarla también ENTRE piezas dejó tres de los cuatro planos en el
mismo rooftop con la misma ropa: los últimos 15 segundos pasaban en un solo lugar. **La
variedad de escenario dentro de una pieza pesa más que la no-repetición entre piezas**, que
además se publican en momentos distintos. Se vio mirando la tira, no leyendo el plan.

## ✅ Acomodado el 2026-08-28 — qué manda sobre qué

| Tema | Manda | Qué se hizo |
|---|---|---|
| Qué foto de Lucía se usa | `references/modelos/lucia/BANCO-OFICIAL.md` | El gate lo valida como lista blanca |
| Con qué se genera su cara | ese mismo · `lucia-skin-v1` `58bbd635`, **7 ángulos** | Reemplaza al ancla de 1 foto |
| El color de las 3 cuentas | **verde `#00D26A`** | Sergio: *"usa color verde siempre"* |
| Qué entrega cada palabra clave | `scripts/recompensas.json` | Gate + `verificar_recompensas.js` |
| Personaje, voz, prompts | `LUCIA.md` (apunta al banco desde arriba) | — |

**Cuatro docs SIN fecha decían "USAR ESTE" sobre el Soul prohibido** — `ONIA_MODELOS_RAIZ.md`
(que además se autodeclara "este índice manda"), `lucia-onia-identity-bible.md`,
`AVATAR-CONSISTENCY-SCHEME.md` y `LUCIA_CONTENT_SYSTEM.md`. Cualquier sesión que entrara por
ahí habría generado la cara roja, que es exactamente lo que pasó. Los cuatro llevan ahora un
aviso de superado **arriba del título** — si va después, se lee el título y se cierra el
archivo. No se borran: su método sigue sirviendo, su instrucción de identidad no.

**El color de Lucía es el VERDE de Onia.** Sergio, 2026-08-28: *"usa color verde siempre"*.
Ese mismo día se habían pasado sus piezas a terracota porque `LUCIA.md` §1-quater lo pedía con
un ⛔; Sergio lo revirtió y el doc quedó corregido, para que nadie lo "arregle" de vuelta.

Lo que sí queda del episodio: **el acento se resuelve desde `ACCOUNTS`, no desde un flag que
haya que recordar.** Hoy ninguna cuenta declara color propio — todas heredan el verde — pero el
mecanismo existe para el día que alguna lo necesite.

Y dos trampas del render de video, para el próximo reel:
- **Chrome captura antes de que baje la webfont.** Cuatro placas salieron en una sans genérica
  y la quinta en Archivo (por caché): dos tipografías en un mismo reel se leen como error, no
  como estilo. Se arregla con `--virtual-time-budget=6000`.
- **El scrim va en la placa, no en el video.** Oscurecer el clip entero apaga la cara; el
  degradado dentro del PNG da contraste al texto y deja la cara limpia.

## 🔴 El circuito comentario → DM manda sobre los CTA (2026-08-28)

Contexto que pasó Sergio, ya verificado en producción. **Cambia qué se puede prometer.**

- **UN solo mensaje por comentario, para siempre**, y **solo texto**. No hay secuencia: todo
  entra en ese único DM, y el recurso va como link.
- **La respuesta de la persona abre una ventana de 24 h** — es el único modo de mandar
  después el audio o el link de la comunidad. Por eso cada DM pide una respuesta concreta.
- El mensaje se elige **por palabra clave**, así que **dos piezas con la misma palabra no
  pueden prometer cosas distintas**. Pasaba: O03 pedía SISTEMA por "el checklist de tu Oficina
  Virtual" y otras siete pedían SISTEMA por "las 6 tareas". O03 pasó a la palabra **FACTURA**.

**Lo que destapó verificar las URLs en vivo:**

| Palabra | Estado |
|---|---|
| SISTEMA | 🔴 **el PDF NO está publicado** — 404. La palabra está activa y **8 piezas la prometen**. Mismo bug que tuvo HUMO el 23-ago |
| HUMO | ✅ 200, 306 KB |
| LISTA | ✅ 200, 258 KB |
| FACTURA | ✅ el recurso vive, 🔴 falta cargar la palabra en @oniahq |
| STACK | 🔴 doble bloqueo: sin recurso **y** el mapa de Sergio vacío |

Ahora lo comprueba el gate (`scripts/recompensas.json`) y hay un verificador en vivo:
`node scripts/verificar_recompensas.js`. **Las 8 piezas de @oniahq quedan bloqueadas hasta
que ese PDF esté publicado** — no es una opinión: hoy entregarían un 404.

Los textos del único DM de cada palabra están escritos en
`hermes-content/docs/ONIA_DM_POR_PALABRA.md`, listos para cargar en la tabla del circuito.

**Al terminar cada pieza:** tachar la línea de este archivo y commitear.

## Presupuesto

**900 créditos/mes** en el plan Pro. Una ilustración = 2 créditos.
El banco de `oniahq/ilustraciones/` **se reusa entre piezas del mismo rubro** — no se generan
5 nuevas por pieza. Ya hay 9.
