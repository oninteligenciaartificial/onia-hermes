# Prompts del lote del 2026-08-21 — L1 a L3

9 items del chat con `mrsatiras__`. **5 salieron `SIRVE YA`** y **4 traían el prompt escrito en
pantalla**. Síntesis: [2026-08-21-sintesis-lote-9.md](2026-08-21-sintesis-lote-9.md) ·
datos: [analisis/2026-08-21-items.json](analisis/2026-08-21-items.json)

**Antes de pegar:** los tres gates del preámbulo de
[PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md).

| Sesión | Prompt | Orden |
|---|---|---|
| **`INFLUENCERS IA`** | **L1** el esqueleto de 6 bloques + Pinterest + los 10 chips | **primero de todo el lote** |
| **`INFLUENCERS IA`** | **L2** las 9 escenas de vida cotidiana para Lucía | después de L1 |
| **`onia-plattform`** | **L3** QR dinámico — el módulo recurrente | independiente |

---

# INFLUENCERS IA

## L1 · El esqueleto de prompt UGC, regalado entero

```text
Contexto: un reel en espanol muestra como se crea un avatar UGC de cero ("Carla") y REGALA el
metodo completo en laminas. Ficha y datos:
hermes-content/references/video-intake/2026-08-21-sintesis-lote-9.md
hermes-content/references/video-intake/analisis/2026-08-21-items.json (item DcQvRrGM-wm)

EL ESQUELETO DE 6 BLOQUES, literal de la lamina:
  "El orden importa. El modelo lee de arriba abajo y da mas peso a lo primero. Este es el
   esqueleto que uso siempre, tanto en imagen como en video."

  SUJETO       "Edad, tono de piel, pelo, expresion, que esta haciendo con las manos.
                Concreto y corto."
  VESTUARIO    "Prenda, tejido, brillo, color y estampado. Si es campana, aqui va el bloqueo
                para que no cambie entre planos."
  LOCALIZACION "Que hay delante, que hay detras y a que distancia. El fondo es la mitad de la
                credibilidad."
  CAMARA       "Aqui es donde se gana o se pierde el UGC. Optica, altura, distancia y quien
                sujeta el movil."
  LUZ Y TEXTURA "Hora del dia, dureza de la sombra, altas luces quemadas, ruido en las sombras."
  NEGATIVOS    "Lo que no quieres ver. En UGC casi siempre es el propio movil, tripodes, palos
                de selfie y reflejos."

LOS 10 CHIPS QUE ACTIVAN EL MODO MOVIL, literales:
  iPhone front camera · wide angle lens · handheld, slight tremor · arm's length selfie ·
  focus hunting · blown highlights · crushed shadows · sensor noise · high dynamic range ·
  no stabilisation
  Y la lamina cierra: "Y estas las quitas siempre. Son las que te devuelven un anuncio en vez
  de un video de alguien."

PINTEREST ES TU DIRECTOR DE FOTOGRAFIA — esta es la parte que casi nadie escribe:
  "No inventes el encuadre. Buscalo. Escribe beach selfie, mirror selfie, get ready with me o
   instagram story aesthetic en Pinterest y tienes miles de fotos reales que la gente ya
   publica todos los dias.
   Lo que buscas en cada pin: donde esta el sol, como cae la sombra en la cara, a que altura
   esta el movil, que se ve de fondo, que ropa lleva puesta. Eso lo traduces a prompt
   LITERALMENTE. Cuanto mas aburrida y cotidiana sea la referencia, mejor funciona."

VERIFICADO en la cuenta el 2026-08-21 (volve a consultarlo vos, tiene fecha de vencimiento):
seedance_2_5 con duration 4-30 s, generate_audio true por defecto, y mode omni_reference con
role image_references — que es exactamente el "bloqueo de personaje" que promete la lamina.

Tarea:
1. Cruza los 6 bloques del reel con los 8 de nuestra skill sacar-prompt. Son un SUBCONJUNTO:
   no hay que cambiar de metodo. Lo que SI agregamos es (a) los 10 chips como lista fija y
   (b) Pinterest como fuente de encuadres.
2. Escribi el bloque de CAMARA de Lucia usando los chips. Es el bloque que el reel senala como
   "donde se gana o se pierde el UGC" y el que hoy tenemos mas flojo.
3. Agrega a LUCIA.md la fuente de referencias: que se busca en Pinterest y como se traduce.
   OJO: LUCIA.md ya tiene un molde de 11 bloques con 4 colas de camara. Esto se SUMA, no lo
   reemplaza. Si algo choca, gana LUCIA.md.
4. NO crees un doc nuevo al lado. Es el error mas caro del preambulo.

GASTO: no generes. Entrega los bloques escritos y el costo estimado si se fuera a probar.

LISTO = los 10 chips y la fuente Pinterest incorporados a LUCIA.md sin duplicar el molde que ya
existe, y el bloque de camara de Lucia reescrito.
```

## L2 · Las 9 escenas de vida cotidiana — el pilar que Lucía no produce

```text
Contexto: bluuu.ai publico "CAUGHT LIVING", 9 escenas de vida cotidiana, y declara en el caption:
  "9 AI prompts built around the moments you actually live. No sets. No studios. Just real
   scenes, relit with editorial light. Every prompt is tuned for HIGGSFIELD SOUL 2.0."
Soul es el motor que YA usamos para Lucia. Los prompts estan gateados detras de un cebo, asi
que estan RECONSTRUIDOS desde las laminas en:
hermes-content/references/video-intake/analisis/2026-08-21-items.json (item DcI9w9GEnZH)

Las escenas, del caption literal: "Caught at the desk. On the rooftop. In the mirror. At the
night market. In the lobby. At the pool's edge."

POR QUE IMPORTA: el plan de Lucia tiene 4 pilares y el de vida cotidiana es el que NO produce.
Estas 9 escenas son exactamente ese pilar, y estan pensadas para nuestro motor.

Tarea:
1. Adapta las 9 a Lucia: mismo tipo de momento, pero en SU mundo — Santa Cruz, no Nueva York.
   El mercado nocturno, el lobby y la azotea existen aca; el resto se sustituye por lo que ella
   si habitaria.
2. Escribi cada una como fragmento concatenable al prompt base de Lucia, con el bloque de camara
   usando los 10 chips del prompt L1.
3. Respeta lo fijado en LUCIA.md y NO lo rediscutas: pecas inamovibles, argollas + cadenita,
   algo terracota en cuadro, la paleta hex, el ancla que genera, y los 3 vestuarios del feed.
4. Marca cuales de las 9 NO van para Lucia y por que.

DOS REGLAS QUE SALEN DEL PROPIO CORPUS Y APLICAN ACA:
- La consistencia de cara SE DEGRADA en las tomas de escenario y aguanta en las de fondo simple.
  Cuando la escena manda mas que la referencia, la cara se pierde. Priorizar fondos simples
  donde la cara tiene que ser reconocible.
- En las laminas de bluuu.ai el TEXTO DE UN LIBRO SALE GARABATO. No poner texto legible en
  cuadro salvo que se controle.

GASTO: escribir es gratis. La tanda de prueba con la cara de Lucia necesita OK explicito de
Sergio, caso por caso.

LISTO = las 9 escenas adaptadas a Santa Cruz como fragmentos concatenables, sumadas a LUCIA.md,
con las que se descartan y el motivo. Cero generaciones.
```

---

# ONIA PLATFORM

## L3 · QR dinámico — una línea recurrente que no existe en el core

```text
Contexto: un reel desglosa un negocio de QR dinamico vendido por suscripcion. Reconstruccion
SaaS completa (entidades + maquina de estados):
hermes-content/references/video-intake/analisis/2026-08-21-items.json (item DcJe7nLpuOA)

EL MECANISMO, en una linea: el QR gratis codifica el destino FINAL, por eso muere cuando el
destino cambia. El QR de pago codifica un ENLACE PROPIO, asi que el destino es un campo
editable. Lo que se cobra es MANTENER VIVO el redirect: si caduca la suscripcion, el QR ya
impreso y pegado en las mesas deja de servir.

ENTIDADES:
  short_link   slug, destino_url (MUTABLE - ahi vive todo el producto), dueno, estado
  qr_asset     DERIVADO, no entidad de negocio. Se genera UNA vez sobre el slug y nunca cambia:
               es el objeto fisico ya pegado
  scan_event   append-only: short_link_id, ts, user-agent, pais, referer
  subscription dueno, plan, estado
  El destino (la carta del restaurante) NO es entidad nuestra: es una URL del cliente. Por eso
  es barato de operar.

VERIFICADO CONTRA EL REPO (no lo repitas, confirmalo vos): onia-core NO tiene ninguna entidad de
shortlink, redirect ni QR — cero coincidencias en contract.json y en todo onia-core/. Es entidad
NUEVA, no una capability apagada.

MVP con lo que YA corre: ruta /r/[slug] en web-factory/apps/site (Next.js, ya deploya a Vercel y
al VPS) + dos tablas en Supabase + el paquete npm qrcode. Es chico.

Tarea:
1. Confirma vos que no existe nada de esto en el core antes de escribir una linea.
2. Construi el MVP: crear enlace, editar destino, generar el PNG, contar escaneos.
3. RLS por dueno, verificada en la base y no en el front.
4. Rate limit en el endpoint de redirect: es publico y lo va a escanear cualquiera.

DECISION QUE ES DE SERGIO Y BLOQUEA EL PRICING (no la tomes vos): el QR dinamico es un modulo
del core con suscripcion propia, o un add-on mensual encima del Cuidado Web? Cambia donde vive
el codigo y cuanto se cobra.

Y UN DOMINIO CORTO para el redirect. El DNS lo controlamos en Cloudflare, pero ojo con el
comodin * proxiado que hoy tapa toda la zona.

LO QUE NO SE COPIA:
- La cifra del reel ("1.324 suscripciones, $14.734 al mes") esta DIBUJADA, no es una captura.
  No se repite.
- Su canal de distribucion es r/smallbusiness: mercado gringo, y ese sub prohibe autopromocion.
  Sustituir por el canal boliviano equivalente.
- El "modo arte" (QR ilustrados) usa ControlNet QR Code Monster, un modelo de Stable Diffusion.
  Higgsfield NO expone ControlNet. Hoy NO tenemos herramienta para eso: se vende el QR dinamico
  sin el adorno, que igual es el 100% del valor recurrente.

LISTO = crear un enlace, imprimir su QR, cambiarle el destino, y que el MISMO QR lleve al nuevo
destino — verificado escaneandolo, no leyendo el codigo. Con RLS probada.
```
