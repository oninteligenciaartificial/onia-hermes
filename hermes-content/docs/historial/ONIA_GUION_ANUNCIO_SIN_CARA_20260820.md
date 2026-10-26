# Anuncio sin cara, 33 s — el molde de 7 beats adaptado a Onia

> 2026-08-20. Fuente del molde: `references/video-intake/2026-08-20-sintesis-lote-13.md`
> (ítem DcAAUevMTG6, reconstruido beat a beat). **Cero generaciones hechas** — esto es el guion,
> el hilo de color, el carrier y el costo, para que Sergio apruebe.

## 0. La objeción que la propia síntesis dejó escrita, y cómo se resuelve

La síntesis parqueó este molde con: *"falta un cliente con producto físico; la cartera es
software B2B"*. **La salida no es esperar un cliente: es que el producto físico del anuncio sea
EL MUNDO del dueño** — el mostrador, el cuaderno, los recibos — y la "acción de producto" sea la
que el molde ya contempla: **un clic** (el molde original lista "un vertido, un encendido, un
clic"). El software se vuelve filmable porque lo que se filma es lo que reemplaza.

Alternativa de encaje directo si se prefiere producto físico puro: **Nuvia** (sérum = vertido
perfecto). Se descarta por ahora porque Nuvia no tiene cuenta activa ni pipeline de pauta;
`@oniahq` sí — y esta pieza puede ser un anuncio de la campaña que ya existe en PAUSED.

## 1. Decisiones previas (sin esto los 7 planos no pegan)

**HILO DE COLOR: el VERDE, contado como una posta con traición.** El verde arranca siendo el
color del caos (la burbuja de WhatsApp, la lapicera del cuaderno) y termina siendo el color del
orden (el panel de Onia, el logo). Mismo color, bando distinto — la posta ES el argumento.
Verde por plano: lapicera (B1) → banda elástica de la torre de cuadernos (B2) → pantalla del
panel (B3) → bolsa de entrega (B4) → panel a contraluz (B5) → tapa del cuaderno cerrado + guampa
(B6) → tile del logo (B7).

**CARRIER ELEMENT: la sombra del ventilador de techo**, barriendo el cuadro en al menos 3 de los
7 planos (B1, B2, B6). Es el equivalente exacto de "la sombra de la red" del original: gratis de
filmar (cualquier local de Santa Cruz tiene uno), y en los planos generados es una línea de
prompt. Pega tomas que no comparten espacio.

**Sin voz.** La música manda el ritmo y los cortes caen con ella (`music-to-video` /
`editor-videos` en el montaje).

## 2. Los 7 beats

| # | t | Qué se ve | Cámara |
|---|---|---|---|
| B1 | 0-5 s | **Gancho cinético.** Contrapicado pegado al mostrador. Torso y manos del dueño (sin cara) cruzan el cuadro; un fajo de recibos atraviesa en whip con motion blur, la lapicera **verde** rueda hasta el borde. Sombra del ventilador barriendo | contrapicado, whip lateral |
| B2 | 5-10 s | **Beat surreal.** Una torre de cuadernos idénticos del piso al techo, junto al mostrador, con una banda elástica **verde** en el del medio. Imposible pero física — lee como prop, no como render. El "wait, what" | plano fijo bajo, leve dolly-in |
| B3 | 10-14 s | **LA acción de producto — una sola.** Un dedo toca el teléfono apoyado en el mostrador. La pantalla enciende: el panel, **verde**. Nada más pasa. Ese clic es todo el producto | cenital cerrado a la mano |
| B4 | 14-19 s | **Aspiración: el mundo, no el producto.** El local vivo con luz dura de tarde: manos que entregan una bolsa **verde**, piernas de clientes cruzando, la puerta abierta. El dueño NO está mirando el teléfono | altura de cintura, cámara en mano |
| B5 | 19-24 s | **Hero a contraluz.** El teléfono con el panel abierto, hora dorada por la puerta del local, flare. El **verde** de la pantalla contra el naranja | contraluz, flare real |
| B6 | 24-29 s | **Bodegón cenital.** El mostrador en orden: teléfono con el panel al centro, cuaderno **cerrado** con tapa verde, calculadora, guampa de tereré, el pinche de recibos casi vacío. Sombra del ventilador girando | cenital puro |
| B7 | 29-33 s | **Placa.** El tile verde de Onia, translúcido, sobre el último plano. Sin claim, sin CTA — como el original: mudo y sin pedir nada | mismo plano de B6 |

**Regla de orden respetada:** mundo (B1-B2) → producto (B3, al tercio exacto) → marca (B7, último
segundo, una sola vez). Ningún plano a la altura de los ojos. Ninguna cara.

## 3. Filmado vs generado — 6 de 7 se filman con un celular

| Beat | Cómo | Costo |
|---|---|---|
| B1 gancho | **Filmado.** Una mano fuera de cuadro lanza los recibos; 3-4 tomas | 0 |
| B2 surreal | **GENERADO** — es el único imposible. Imagen (`nano_banana_2`, 2.00 cr) + animación 5 s (`kling3_0_turbo`, 7.50 cr) | **9.50 cr** |
| B3 clic | **Filmado.** El panel real abierto en el teléfono — pantalla auténtica, no mockup | 0 |
| B4 aspiración | **Filmado SI hay local prestado** (el de siempre de Sergio). Fallback generado: `veo3_1_lite` 8 s ≈ 8.00 cr | 0 · fallback 8.00 |
| B5 contraluz | **Filmado** a hora dorada, puerta del local. Sin trípode: molde pide cámara viva | 0 |
| B6 bodegón | **Filmado.** El más barato: es una foto animada con micro-dolly en edición | 0 |
| B7 placa | **Edición pura** (HyperFrames sobre B6) | 0 |

**Total generación: 9.50 cr** (solo B2) · **17.50 cr** si B4 cae al fallback.
Prueba previa recomendada del B2 en imagen sola (2.00 cr) antes de animar — si la torre no lee
como prop práctico, se ajusta el prompt de imagen, no el video.

## 4. Los dos gates, escritos acá para no saltearlos

1. **REGLA DE ORO:** tabla de cortes + preview 360p a Sergio ANTES de aplicar cualquier corte
   del montaje (`.claude/skills/editor-videos/SKILL.md`).
2. **Gate de ortografía:** la pieza es muda y la placa no lleva claim — **si en algún ajuste se
   suma texto en pantalla, pasa por el gate** (SKILL.md de `editor-videos`, paso 5b) antes de
   quemarse.

## 5. Qué necesita de Sergio

1. **OK de gasto**: 9.50 cr (B2) — o 17.50 si B4 se genera.
2. **Filmar los 5 planos reales** (una tarde, un celular, un local): B1, B3, B4, B5, B6.
   Plantillas CORTAS de 5-8 s por plano, sueltas — se montan después.
3. Elegir la música (el corte cae con ella; sin voz no hay guion que grabar).
