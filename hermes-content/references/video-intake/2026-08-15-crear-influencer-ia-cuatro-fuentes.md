# Crear una influencer IA — cuatro fuentes del mismo día, mismo método

**Cobertura:** cuota de Gemini agotada. Los cuatro salieron por el camino alternativo:
**audio 100% con Whisper/Speaches**. Sin lectura de timeline.

Cuatro creadores distintos, el mismo día, describiendo el mismo pipeline. Cuando cuatro
fuentes independientes coinciden en el orden de los pasos, el orden **es** el método.

---

## 1. `DTYf-FUDlH7` — "3 cosas antes de crear tu influencer con IA"

Formato diálogo (dos voces). Verbatim del núcleo:

> — *"Primero: no empieces con imagen, empezá con el **personaje**."*
> — *"¿Personaje?"*
> — *"Sí. ¿Es chico, chica? ¿Es influencer de fitness, de lujo, de belleza?"*
> — *"Ah, yo solo quería crear una cara bonita."*
> — ***"Es el error número uno. Una cara bonita no vende. Un personaje, sí."***

Segundo paso: *"no solo una foto, tenés que crear una **identidad visual**: el mismo rostro,
los mismos rasgos, los mismos detalles, todo en un mismo prompt. Como si fuera una persona
real."*

## 2. `DYh_gyxx0_5` — por qué sale un "NPC con cara plasticosa"

> *"La mayoría entra a ChatGPT y escribe 'hazme una persona guapa'. El resultado es un **NPC con
> cara plasticosa**. El mayor problema es que seguís hablándole [mal al modelo]."*

Y la tesis de fondo: ya no se trata de generar caras, sino de *"crear personas totalmente reales
y ponerlas donde te dé la gana"* — el énfasis pasa del rostro al **contexto**.

## 3. `Db5xcsjMFMA` — el pipeline completo de una campaña

El más concreto de los cuatro. Verbatim:

> *"Esto no es una campaña de moda real, lo acabo de generar. **Primero**, generá tu avatar
> usando Soul 2.0 y **bloqueá su identidad**. **Después**, generá las imágenes base de la
> campaña con **nano-banana**. **El truco está en usar Claude para que sea tu director de arte
> y te genere los prompts.** Una vez tenés todo, andá a Seedance y aprovechá su nueva función:
> ahora podés adjuntar hasta 50 referencias a la vez —personas, ropa, entornos y hasta 30
> segundos de video con las escenas que quieras—. El resultado es una pieza audiovisual **ya
> editada**, lista para usar como publicidad."*

## 4. `Dbq2clEx5CL` — la influencer que habla

> *"**Paso 1**: abrí Soul 2.0 y pedile que te genere una influencer hablando a cámara.
> **Paso 2**: antes de animarla, abrí ChatGPT o Claude y pedile que te genere el prompt para
> Seedance: **la frase que querés que diga, la expresión, el tono de voz, el acento. Acá es
> donde construís el carácter de tu avatar.** Ahora pegá el prompt junto a tu foto de
> referencia."*

---

## Veredicto: SIRVE YA — completan el método que las fichas del 15-ago ya venían armando

Junto con [las anclas](2026-08-15-bloquear-identidad-avatar-anclas.md) y
[el realismo de celular](2026-08-15-realismo-de-celular-prompts-soul.md), el pipeline queda
cerrado y en orden:

```
0. PERSONAJE   ← el paso que nos falta: nicho y para qué existe, ANTES de cualquier imagen
1. IDENTIDAD   ← Soul + anclas por rasgos + rasgo distintivo constante
2. REALISMO    ← defecto óptico de celular + paleta hex
3. ESCENARIOS  ← imágenes base del entorno, fijadas como referencia
4. CARÁCTER    ← frase, expresión, tono y acento en el prompt de video
5. PIEZA       ← Seedance con las referencias → sale ya editada
```

**Lo que aportan de nuevo, y no es poco:**

**El paso 0 no lo teníamos escrito.** *"Una cara bonita no vende, un personaje sí."* Lucía tiene
posicionamiento definido (Santa Cruz, 26, híbrido lifestyle + meta-IA), así que estamos mejor
que el promedio — pero conviene revisar si el personaje está escrito con ese nivel de decisión
o si se asumió.

**Claude como director de arte que escribe los prompts.** Dos de los cuatro lo dicen igual. No
es que Claude genere la imagen: genera el **prompt** que va al generador. Eso es exactamente lo
que hacemos acá, y confirma que la parte de dirección vive en el texto, no en la herramienta.

**El carácter se define en el prompt de video, no en el guion.** Frase + expresión + tono +
acento juntos, en el mismo prompt. Nosotros separamos guion (texto) de voz (ElevenLabs);
ellos lo meten todo junto en la generación.

**A verificar antes de repetir:** `nano-banana` como generador de las imágenes base — hay que
ver si está en nuestra cuenta o si conviene usar el pipeline propio. Y las cifras de Seedance
("50 referencias", "30 segundos") ya están **desmentidas para nuestra cuenta**: tenemos
`seedance_2_0`, tope **15 s**.

## Para qué nos sirve

| Frente | Acción |
|---|---|
| INFLUENCERS IA / Lucía | Revisar que el **personaje** esté escrito antes de seguir produciendo imagen |
| INFLUENCERS IA | Adoptar el orden de 6 pasos como checklist de producción |
| INFLUENCERS IA | Probar meter carácter (expresión, tono, acento) en el prompt de video en vez de solo en el guion |

## Los otros tres de la tanda

| Video | Qué es | Veredicto |
|---|---|---|
| `Db-tgJfuakX` | 3 innovaciones de salud/fitness, en inglés | **Lo aprovechable es el análisis de posicionamiento**, no el producto: *"destacan un enemigo nuevo —la calidad del aire—, hacen consciente del problema, y presentan su producto como la única solución"*. Es un molde de copy que sirve para vender automatización: el enemigo nuevo puede ser el tiempo perdido tipeando |
| `DbUtn-CuSCE` | sin voz | pendiente de leer por fotogramas |
| `Dbsl_4fxvOO` | solo música, sin contenido hablado | descartado |
