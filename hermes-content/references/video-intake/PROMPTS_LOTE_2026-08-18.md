# Prompts del lote del 2026-08-18 — G1 a G6

18 items (11 reels + 7 carruseles) analizados con el [método de dos carriles](METODO_DE_ANALISIS.md).
Síntesis técnica completa: [2026-08-18-sintesis-lote-17.md](2026-08-18-sintesis-lote-17.md) ·
la receta UGC del anuncio de auto: [ficha aparte](2026-08-18-ugc-auto-receta-completa.md).

**Antes de pegar cualquiera:** los tres gates del preámbulo de
[PROMPTS_POR_SESION.md](PROMPTS_POR_SESION.md).

> ⚠️ **Dato de catálogo con fecha.** `seedance_2_5` **existe** en la cuenta desde el 2026-08-18
> (4-30 s, 480p-1080p, modos `t2v` / `omni_reference` / `video_edit` / `video_extension`).
> Antes NO estaba, y seis fichas del corpus decían que no existía. **Volvé a consultar el catálogo
> vos mismo antes de apoyarte en cualquier dato de modelo de acá.** Lo que sigue siendo falso:
> `unlim.available = false` — no hay ventana ilimitada, toda generación gasta créditos.

## Dónde se pega cada uno

| Sesión | Prompt | Orden |
|---|---|---|
| **marketing** | **G3** el cliente real con la pantalla sustituida | **primero de todo el lote** — es el único que ataca la venta |
| **`web-factory`** | **G4** la escalera de popups 0→10 · **G5** secuencia scroll con GSAP | G4 primero: convierte |
| **`INFLUENCERS IA`** | **G1** las dos plantillas de prompt + Marketing Studio · **G6** la plantilla de foto realista | G1 primero |
| **`editor de videos`** | **G2** el molde UGC de anuncio para un rubro | después de G1 |

---

# MARKETING

## G3 · El cliente real con la pantalla sustituida — la prueba que ningún demo consigue

```text
Contexto: un reel sustituyo un auto barato por un deportivo DENTRO del mismo plano filmado
con celular, conservando a la persona real, su ropa, sus gestos, el fondo, la luz y el
movimiento de camara. Sintesis tecnica:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md (tecnica T1)

Por que importa mas que cualquier otra cosa del lote: la tecnica elimina el problema mas caro
de la IA de video -- sostener una cara entre planos -- simplemente NO GENERANDO al humano. Y
eso, traducido a lo nuestro, es el antes/despues de software EN UN SOLO PLANO:

  filmamos al cliente real en su negocio real, con su realidad de HOY (el mostrador con
  papeles, el cuaderno, la planilla impresa, la pantalla vieja) y sustituimos SOLO la
  pantalla / el escritorio por el panel de ONIA corriendo.

Mismo dueno, mismo local, misma luz, mismo movimiento de camara. La comparacion es
irrefutable porque no hay nada actuado. Para venderle software a un dueno de negocio en
Bolivia, eso pega mas fuerte que cualquier demo grabada.

VERIFICADO contra la cuenta (no lo repitas, usalo):
- seedance_2_5, modo video_edit: "edit one reference video (billed by that video's duration;
  'duration' and 'aspect_ratio' are ignored)". 480p/720p/1080p, 9:16.
- El creador afirma, verbatim: "Ya no hace falta que tengamos el celular en un tripode, lo
  podemos agarrar con la mano y moverlo naturalmente y la camara entiende como se esta
  moviendo." Eso es AFIRMADO, no verificado por nosotros. Probalo antes de prometerlo.
- CUIDADO DE GASTO: video_edit se factura por la duracion del video FUENTE. Filma plantillas
  CORTAS (5-8 s) y monta despues. Un plano de 30 s cuesta 4 veces uno de 8.

Y la segunda mitad, que es montaje puro y cuesta cero: el BARRIDO SPLIT-SCREEN vertical.
Izquierda la situacion real del cliente, derecha el mismo plano con ONIA, con la misma mano
del que filma visible en las dos mitades. Sale con editor-videos / HyperFrames. Sirve igual
para web-factory: la web vieja del cliente y la nueva, en el mismo plano.
El truco de oficio en toda comparacion de un solo cuadro: la jerarquia, no el copy. El
ganador va mas grande y mas arriba; el perdedor achicado y hundido. El ojo decide antes de leer.

Tarea:
1. Escribi el guion de rodaje: que 3 planos se le piden al cliente (5-8 s cada uno), en que
   orden, y que se sustituye en cada uno. Sin jerga: el cliente filma con su celular.
2. Deja el prompt de video_edit escrito y listo para cada plano.
3. Deja la plantilla del barrido split-screen armada en HyperFrames, con un render de prueba
   hecho con material que YA tengamos.
4. Estima el costo en creditos de los 3 planos y ponelo al lado.

NO GENERES NADA. Generar video = permiso explicito de Sergio, caso por caso. Entrega el
guion, los prompts y el costo; el aprueba.

PRECONDICION HONESTA: necesita un cliente real con el sistema andando. Si hoy no lo hay,
marcalo como bloqueado por eso y NO lo simules -- fabricar un caso esta prohibido.

LISTO = guion + prompts + plantilla split-screen con render de prueba + costo estimado. Cero
generaciones pagas.
```

---

# WEB FACTORY

## G4 · La escalera de popups, del 0 al 10 — con las capturas reales

```text
Contexto: un reel puntua 8 popups de captura de email de tiendas reales, del 0 al 10, y dice
por que en cada caso. Verbatim completo:
hermes-content/references/video-intake/transcripciones/Instagram-DcEITCmoSHX.txt

La escalera, textual del video:
  0/10 -- "no te da nada a cambio del correo y tiene demasiados campos que llenar"
  1/10 -- "demasiado copy innecesario"
  3/10 -- buena oferta y pregunta que quiere el cliente, "pero no esta bien configurado"
  5/10 -- "es simple y la oferta esta super clara"
  6/10 -- "la tecnica de la ESCALERA DE SI: primero le preguntas al cliente si quiere la
          oferta y LUEGO le pides el correo"
  7/10 -- engagement: "rascas para revelar cual es tu oferta y le da un toque divertido"
  9/10 -- consigue "una tasa de suscripcion increible si eres una marca dispuesta a probarlo"
 10/10 -- MULTI-PASO: "la oferta super clara, en el primer paso hacemos una PREGUNTA, luego
          pedimos el correo y luego el numero de telefono, y en base a los datos que
          recogimos podemos hacer correos personalizados"

Lo que hay que entender, y es el eje entero: el paso 1 NO pide datos, pide un CLIC. Ese clic
segmenta (te dice que quiere el cliente) y ademas es un microcompromiso que sube la
conversion del paso 2. El email recien viene despues.

Tarea:
1. Verifica que tiene HOY web-factory en materia de captura: hay popup? de que nivel de la
   escalera es? Abri la pantalla, no el codigo.
2. Construi el de 10/10 como bloque reusable: paso 1 pregunta con 2-3 opciones -> paso 2
   contacto -> guardar la respuesta del paso 1 junto al lead, porque sin eso la
   personalizacion posterior no existe y el multi-paso no sirve de nada.
3. ADAPTACION BOLIVIA: pedimos WHATSAPP, no SMS. Es el canal real del comprador aca.
4. NADA de confirmshaming (el "no gracias, prefiero pagar precio completo"). No va con la
   marca y es de las cosas que el propio video castiga.
5. Respeta lo que ya existe: si hay atribucion de leads con ?src= viva en produccion, el
   popup tiene que alimentar ESE circuito, no crear uno paralelo.
6. Accesibilidad no es opcional: foco atrapado dentro del dialogo, cierre con Escape,
   aria-label en cada opcion. Usa <dialog> nativo con showModal().
   OJO con prefers-reduced-motion: poner transition-duration: 0.01ms ROMPE las propiedades
   discretas y el dialogo queda abierto en opacity 0 (invisible pero capturando clics). Va
   transition: none. Esto ya nos paso.

LISTO = el popup de 2 pasos existe en web-factory, probado en pantalla, guardando la
respuesta del paso 1 junto al lead, y con teclado y lector de pantalla verificados.
```

## G5 · Secuencia de scroll con GSAP — el patrón de Apple

```text
Contexto: un tutorial en espanol recrea la animacion de scroll de los AirPods Pro de Apple y
muestra el CODIGO literal en pantalla. Ficha y verbatim:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md
hermes-content/references/video-intake/transcripciones/Instagram-Db8hFCFFTZg.txt

La tecnica: NO es un video. Es una secuencia de PNGs dibujada en un <canvas>, con el numero
de frame atado al scroll por GSAP ScrollTrigger. Parametros que se ven en pantalla:
  snap: "frame"   ease: "none"   scrub: 0.5   onUpdate: render

Verificado en el repo: GSAP ya esta autorizado y las skills gsap-* estan instaladas. El
patron NO existe todavia (grep de drawImage da 0).

EL BLOQUEANTE REAL ES EL PESO, no el codigo: ~69 KB por frame. Una secuencia de 150 frames
son ~10 MB, y el presupuesto de una landing es 150 KB de JS. Si no resolves esto, no lo
construyas.

Tarea:
1. Antes de codear, resolve el peso. Opciones a evaluar con numeros, no a ojo: menos frames
   con interpolacion, WebP/AVIF en vez de PNG, resolucion menor con escalado en canvas,
   carga progresiva por tramos, y un tope duro de peso total.
2. Recien con el numero decidido, arma el bloque reusable de web-factory. Carga las skills
   gsap-scrolltrigger y gsap-core primero -- no improvises la API.
3. prefers-reduced-motion: sin scrub, se muestra un frame fijo. Obligatorio.
4. Medi Core Web Vitals antes y despues. Si empeora LCP o CLS, no entra.

Esto es un TECHO visual, no una prioridad de venta. Si hay algo de la lista de web-factory
que convierta (G4, C1), va primero. Deci explicitamente que dejaste de lado por hacer esto.

LISTO = el bloque existe con el peso resuelto y medido, reduced-motion cubierto, y CWV que no
empeoran. O la decision escrita de NO hacerlo, con el numero que la justifica.
```

---

# INFLUENCERS IA

## G1 · Las dos plantillas de prompt, separadas — y Marketing Studio

```text
Contexto: dos reels mostraron prompts COMPLETOS en pantalla, y son estructuras DISTINTAS que
no hay que mezclar. Fichas:
hermes-content/references/video-intake/2026-08-18-ugc-auto-receta-completa.md
hermes-content/references/video-intake/2026-08-16-carril-a-como-se-hicieron.md

PLANTILLA A -- CINE (una sola toma, sin cortes, sin dialogo):
  1. tipo de toma, una linea   2. entorno y atmosfera
  3. RECORRIDO DE CAMARA -- la mitad del prompt, paso a paso en el espacio
  4. detalles de movimiento (inercia, microcorrecciones, "speed contrast")
  5. luz y color al final

PLANTILLA B -- UGC (muchas tomas, cortes duros, el dialogo es el eje):
  1. cabecera tecnica global: formato, duracion, que camara finge ser
  2. DEFECTOS PEDIDOS A PROPOSITO: "grain, compression, wobble, autofocus hunts, no filters
     or grading" -- se le pide fealdad al modelo, que por defecto tira a pulido
  3. NEGATIVOS DEL FORMATO: "phone never in frame, reflections, or her hands"
  4. anclas de consistencia INLINE, inyectadas en el punto del texto donde importan
  5. realismo de piel con atributos concretos: "matte real skin -- pores, redness, baby
     hairs, no glare, no retouch; natural blinks, micro-expressions"
  6. beats con timestamp + referencia + DIALOGO LITERAL ENTRE COMILLAS

  VERIFICADO: el dialogo entre comillas sale palabra por palabra en el video generado. Se
  comparo el prompt con el audio del resultado y coincide literal. El guion se escribe en el
  prompt, no se corrige despues.

REGLA: si el video HABLA, es UGC. Si IMPRESIONA, es cine. Se elige antes de escribir.

Y LA TERCERA VIA, que evita escribir el prompt: marketing_studio_video.
  26 presets (ugc, ugc_direct_to_camera, ugc_selfie_testimonial, product_showcase,
  ugc_before_and_after, ugc_how_to, tv_spot, wild_card...), 12-15 s.
  hook_id = el "que" (la mecanica que frena el scroll) · setting_id = el "donde"
  avatar_ids (max 1) · product_ids
  ad_reference_id = le pasas un anuncio existente y REPLICA SU ESCENARIO (escenas, ritmo,
    gancho, narracion). Es mutuamente excluyente con hook_id/setting_id.
  OJO: avatar y producto NO se heredan de la referencia. Van explicitos SIEMPRE.

Tarea:
1. Guarda las dos plantillas como archivos separados donde ya viven las recetas de video
   (hermes-content/docs/). Si ya hay un doc de prompts de video, EDITALO.
2. Escribi un prompt de ejemplo completo con cada plantilla, para una pieza real nuestra.
3. Actualiza el catalogo de modelos: consultalo vos mismo, no copies los datos de aca.
4. Documenta cuando conviene Marketing Studio y cuando el prompt a mano.

LO QUE ESTE LOTE NO RESUELVE, y hay que decirlo: en 17 items NINGUNO resolvio consistencia de
cara generada. Las dos tecnicas que parecen resolverla usan METRAJE REAL -- no generan al
humano. Para Lucia sigue valiendo Soul+texto; nada de este lote lo reemplaza.

GASTO: no generes NADA. unlim.available = false. Entrega los prompts listos con el modelo y
el costo estimado al lado, para que Sergio apruebe.

LISTO = dos plantillas guardadas y separadas, un ejemplo de cada una, catalogo re-consultado
por vos, y la nota de que Lucia sigue con Soul+texto. Cero generaciones.
```

## G6 · La plantilla de foto realista — 8 bloques y la palanca de la suciedad

```text
Contexto: un carrusel regalo OCHO prompts completos de foto fotorrealista, todos con la misma
estructura. Estan transcritos literales en:
hermes-content/references/video-intake/2026-08-18-sintesis-lote-17.md (seccion 2)

La estructura, identica en las 8 laminas:
  1. apertura fija: "Ultra-realistic vertical [genero] photo of..."
  2. sujeto con una ACCION concreta, no un adjetivo
  3. rasgos fisicos enumerados (pelo, piel, maquillaje, expresion, direccion de la mirada)
  4. vestuario prenda por prenda, con material y color
  5. pose explicita, miembro por miembro
  6. fondo como LISTA DE OBJETOS
  7. bloque tecnico de camara/pelicula + una frase de referencia de genero
  8. "Negative prompt:" -- bloque casi constante: CGI, cartoon, plastic skin, beauty filter,
     over-retouched, bad anatomy, extra fingers, HDR, studio lighting, over-sharpening,
     blurry subject, text, watermark + 2-3 terminos especificos del sujeto

LA PALANCA DEL REALISMO, y es contraintuitiva: se PIDE SUCIEDAD y se PROHIBE LO PULIDO.
Los prompts piden "scratches and dirt marks", "stained plush fur", "peeling paint, rust
marks", "harsh direct camera flash", "slight film grain", "muted colors". Y el negative
ataca justo lo contrario: "beauty filter", "clean costume", "perfect background",
"studio lighting". Un modelo dejado solo tira a catalogo; hay que empujarlo a lo contrario.

Dos atajos mas, leidos de las imagenes de otros dos carruseles del mismo lote:
- seis ejes de realismo que funcionan sin tocar el prompt: imperfeccion de piel, luz dura de
  sol, encuadre de selfie torcido, contexto banal verificable, marcas reales, defectos de camara.
- el mas barato de todos: elegir caras con EDAD Y TEXTURA REAL en vez de modelos jovenes
  perfectas. La cara vieja se ve real sin pelear con el modelo.

Tarea:
1. Guarda la plantilla de 8 bloques donde ya vivan las recetas de imagen. No crees carpeta nueva.
2. PRIMERO verifica, con una consulta GRATIS al catalogo, cuales de nuestros motores de imagen
   aceptan un campo "Negative prompt" SEPARADO. Varios lo ignoran o exigen meterlo en el
   positivo, y la plantilla cambia segun eso. No asumas.
3. Escribi 3 prompts de ejemplo con la plantilla, para necesidades reales nuestras (catalogo
   de producto de un cliente, foto de ambiente para una web, imagen de campana).
4. Anota la palanca de la suciedad como REGLA, no como dato suelto.

Generacion de IMAGEN esta permitida y es barata. Aun asi: si vas a generar mas de unas pocas,
avisa el costo antes.

LISTO = plantilla guardada, campo negative verificado motor por motor, 3 ejemplos escritos, y
la regla de la suciedad anotada.
```

---

# EDITOR DE VIDEOS

## G2 · El molde de anuncio UGC para un rubro nuestro

```text
Contexto: la receta completa del anuncio UGC esta en
hermes-content/references/video-intake/2026-08-18-ugc-auto-receta-completa.md
El arco del reel de origen: publicacion muerta ("Listed 30+ days ago, 2 views") -> anuncio UGC
generado con IA -> ficha del vendedor. El gancho de apertura es un DM entrante de un cliente
preguntando el precio.

Tarea:
1. Adapta el molde a UN rubro nuestro (comercio/gastronomia es el que mas material tiene).
   Escribi el prompt completo con la plantilla UGC de 6 mecanismos, con beats cronometrados y
   el dialogo entre comillas -- porque sale literal.
2. Deja los insumos listos: que fotos de referencia hacen falta y de donde salen.
3. Estima el costo en creditos y ponelo al lado del prompt.

DOS GATES QUE NO SE SALTEAN:
- La REGLA DE ORO: tabla de cortes + preview 360p a Sergio ANTES de aplicar cualquier corte.
- ORTOGRAFIA EN SUBTITULOS QUEMADOS. En este lote un reel publico DOS faltas quemadas en 10
  fotogramas ("A GENERADO" por "HA GENERADO", "ARANA" sin enye) -- salidas del
  auto-transcriptor sin revisar. En B2B boliviano una falta quemada cuesta la credibilidad que
  el video intenta construir. El SRT se revisa a ojo antes de quemarlo, con foco en enyes y
  acentos. Esto entra como paso fijo del pipeline de embedded-captions, no como recordatorio.

NO GENERES. Entrega prompt + insumos + costo. Sergio aprueba caso por caso.

LISTO = prompt completo del rubro, lista de insumos, costo estimado, y el gate de ortografia
agregado al pipeline de subtitulos.
```
