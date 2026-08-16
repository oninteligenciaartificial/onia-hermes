# Sesión `INFLUENCERS IA` / Higgsfield / Lucía

> **Este archivo es la raíz de la sesión `INFLUENCERS IA`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **E9 primero (es el que produce) → E6 → A4 → el resto**
>
> Índice general del carril: [../INDEX.md](../INDEX.md) · fichas de origen en `../`

---

## Preambulo — pega esto al inicio de CUALQUIER sesion

Seis reglas que salieron de los errores de la sesion de analisis de reels (2026-08-11). No son
teoria: cada una nacio de algo que se hizo mal y se corrigio.

```text
Antes de escribir una sola linea:
1. Invoca `onia-router` y ubica el carril. Verifica `git branch --show-current`.
2. BUSCA DONDE VIVE LA COSA ANTES DE CREARLA. El repo ya tiene pipeline para casi todo
   (web-factory tiene reels->learned models; ver-videos tiene el intake; el pattern bank tiene
   el motion). Escribir un doc "al lado" del sistema que ya existe es el error mas caro:
   duplica y se desincroniza. Si no encontras donde va, pregunta antes de inventar carpeta.
3. Verifica en vivo lo que toca prod, plata o main. Y deci explicitamente lo que NO pudiste
   verificar: "los estados estan probados, el timing no porque el panel del navegador esta
   oculto y las transiciones no avanzan" es una respuesta correcta; "quedo listo" no lo es.
4. Ninguna cifra, precio o capacidad que venga de afuera se repite como propia sin verificarla.
   Marcala como "a verificar" o no la menciones.
5. Reporta la cobertura real ("audio 100%, 5 de 7 laminas"), nunca "lo vi" desde dos cuadros.
6. Al cerrar: que quedo en produccion, que quedo a medias y donde exactamente, y que depende
   de Sergio. Nada flotando en la conversacion.
```

---

## Los dos gates que aplican a TODOS los prompts de este archivo

Pegá esto junto al prompt. Nacen de errores concretos de esta sesión, no de teoría.

### Gate 1 — control de calidad ANTES de ejecutar

```text
Antes de hacer nada de lo que pide el prompt, verificá que el prompt siga siendo válido:
1. ¿YA ESTA HECHO? Mirá el repo y la memoria del proyecto, no el prompt. Un prompt de esta
   lista mandaba a cerrar la seguridad de produccion cuando ya estaba cerrada y verificada
   dias antes — habria mandado a rehacer trabajo terminado.
2. ¿EL BLOQUEO EXISTE? Si el prompt dice que algo esta trabado, comprobalo. Dos "bloqueos" de
   esta lista se cayeron con un `ls` y una consulta gratis: los SFX estaban en otra carpeta y
   la voz no era ambigua, era un ID truncado en los docs.
3. ¿EL DATO SIGUE VIGENTE? Los numeros de cuenta, precios y capacidades tienen fecha. Si el
   prompt trae uno, confirmalo antes de construir encima.
4. ¿YA VIVE EN ALGUN LADO? El repo tiene pipeline para casi todo. Buscá donde vive la cosa
   antes de crear una carpeta nueva: escribir un doc "al lado" del sistema que ya existe es
   el error mas caro, porque duplica y se desincroniza.
Si algo de esto invalida el prompt, DECILO y no lo ejecutes. Un prompt que quedo viejo se
corrige, no se obedece.
```

### Gate 2 — ordenar en su carpeta ANTES de cerrar

```text
Al terminar, nada queda suelto ni en la raiz del repo. Cada cosa a su lugar:
- Web entera vista en un reel  -> web-factory/data/references/reels/models/ (learned model)
- Componente de UI reconstruido -> hermes-content/references/ui-patterns/<patron>/
- Patron de movimiento          -> web-factory/docs/MOTION_PATTERN_BANK_2026.md
- Analisis de un video          -> hermes-content/references/video-intake/
- Doc de proceso o decision     -> hermes-content/docs/  (es la fuente; la raiz sin gemelos)
- Receta de generacion          -> hermes-content/docs/ y se apunta desde la skill
- Codigo de herramienta         -> scripts/ o .claude/skills/<skill>/scripts/
Si no sabes donde va, PREGUNTA antes de inventar carpeta.
Y antes de commitear: `git status` limpio de archivos huerfanos, y el commit explica el POR QUE,
no solo el que.
```

---

### Gate 3 — el loop: auto-evaluacion ANTES de responder

Sale del reel de AI loops, que en la primera pasada despache como humo y era el mas importante
del corpus ([ficha](../2026-08-09-ai-loops-code-review.md)). La idea no es el comando: es **donde
esta el control**. La verificacion va antes de entregar, no despues de que Sergio encuentre el
error.

```text
Antes de decir que terminaste, corre este loop sobre tu propio trabajo:
1. Reelee el "LISTO =" del prompt. ¿Lo cumpliste, literal? No "casi".
2. Buscá activamente en que te podes haber equivocado. Nombra la parte mas fragil de lo que
   hiciste y comprobala. Si no encontras ninguna parte fragil, no miraste bien.
3. Lo que afirmes, verificalo: si decis que algo existe, abrilo; si decis que funciona,
   corrélo; si decis que se perdio, revisá que estabas mirando el lugar correcto.
4. Deci explicitamente que NO pudiste verificar. Un "esto quedo sin comprobar" vale mas que un
   "listo" que se cae al primer toque.
5. Recien ahi respondé.
Si el paso 2 encuentra algo, corregilo y volve al 1. El loop se cierra cuando una pasada
completa no encuentra nada nuevo — no cuando te cansaste de mirar.
```

**Un gate que depende de acordarse no es un gate.** En una sola sesion, con los Gates 1 y 2 ya
escritos, se entregaron cinco cosas sin verificar: un prompt que mandaba a rehacer trabajo
terminado, dos bloqueos que no existian, un archivo "perdido" que estaba intacto, y una
escritura en el arbol de otra rama. En los cinco casos el dato correcto estaba a una consulta
de distancia.

---

**Para delegar a subagentes** (esto se probo con 8 agentes en paralelo y funciono):

```text
Trabajas en el worktree EXACTO: <ruta completa>
Verifica `git branch --show-current` (debe decir <rama>). No commitees, no hagas push.
Escribis SOLO estos archivos: <lista>. NO toques indices ni docs compartidos — de eso me encargo yo.
Si el video/doc afirma un dato, marcalo como "a verificar", no lo des por cierto.
DEVOLVE: una linea por entregable con <archivo> | <resultado> | <decision que tomaste>.
```

La regla que hace que esto no choque: **cada agente escribe sus propios archivos, el
orquestador escribe los indices.** Ocho agentes en la misma carpeta no se pisaron ni una vez.

---

---

## E9 · Los cinco bloques del prompt, y por qué el 3D estilizado gana

```text
Contexto: dos videos hechos con IA analizados a fondo. Ficha con las siete preguntas
contestadas video por video:
hermes-content/references/video-intake/2026-08-16-carril-a-como-se-hicieron.md

HALLAZGO 1 — un reel mostro el prompt COMPLETO en pantalla. La estructura, en orden fijo:
  1. Tipo de toma, una linea      ("Single continuous FPV drone shot, no cuts.")
  2. Entorno y atmosfera
  3. RECORRIDO DE CAMARA — ~120 palabras, la mitad del prompt, paso a paso en el espacio:
     de donde arranca, hacia donde acelera, donde se inclina, que curva describe, donde
     termina
  4. Detalles de movimiento — la fisica: inercia, microcorrecciones, particulas, y
     "speed contrast" (sujeto en camara lenta, camara rapida)
  5. Luz y color, al final — grado, contraste, grano, aberracion
  El insumo fue UNA IMAGEN FIJA + ese texto. Una sola generacion, sin cortes.

  Lo que estamos haciendo mal: describimos la escena y le pedimos a la camara "movimiento
  cinematografico". Por eso sale generico. La camara se COREOGRAFIA.

HALLAZGO 2 — el otro reel es un sketch narrativo con dialogo, en 3D estilizado, NO
  fotorrealista. Tiene defectos de IA a la vista (una mano fundida, logos manchados) y no
  importan: en animacion se leen como estilo. En fotorrealismo se leerian como error.
  Regla: para contenido narrativo con IA, estilizado 3D antes que fotorrealista. Lo
  fotorrealista se reserva para Lucia, que es la unica cara que lo necesita.

VERIFICADO YA contra la cuenta (no lo repitas, usalo):
  - flux_3_video: 5-20 s, 1080p, audio sincronizado por defecto, acepta start/end image,
    referencias y CONTINUACION de video. Es el mejor para narrativa.
  - veo3 (variantes preview/fast), wan2_7 (2-15 s, consistencia de personaje), gemini_omni
    (4-10 s) tambien tienen audio nativo.
  - CORRECCION al corpus: el tope de 15 s era de seedance_2_0. flux_3_video llega a 20 s.
  - unlim.available = false: HOY no hay generaciones ilimitadas. Cada generacion cuesta.
  - "Seedance 2.5" NO existe en la cuenta. Es el sexto video que nombra un modelo fantasma.

Tarea:
1. Reescribi la plantilla de prompt de video que usemos hoy con los 5 bloques en orden, con
   el bloque 3 obligatoriamente largo. Si no existe plantilla, creala donde ya viven las
   recetas de video (hermes-content/docs/), no en carpeta nueva.
2. Escribi UN prompt completo de ejemplo para una pieza real nuestra, con los 5 bloques.
3. Anota la regla del 3D estilizado en la guia de contenido generativo.
4. Actualiza el catalogo de modelos con los datos verificados de arriba.

GASTO: no generes NADA. Generar video = permiso explicito de Sergio, caso por caso. Entregá
el prompt listo para que el lo apruebe, con el modelo y el costo estimado al lado.

LISTO = plantilla de 5 bloques guardada, un prompt de ejemplo escrito, la regla del 3D
anotada, y el catalogo corregido. Cero generaciones.
```

---

## E6 · Qué dispara la etiqueta de "contenido IA" — leer el código, no el reel

```text
Contexto: X abrio su algoritmo. VERIFICADO con fuente, no con el reel: el repo es
github.com/xai-org/x-algorithm, Apache 2.0, publicado el 20-ene-2026, con un directorio
visibility-filtering; y el 13-ago-2026 se le agregaron los pesos con que se combinan las
acciones predichas en el score final. Ficha con el analisis y las trampas del video:
hermes-content/references/video-intake/2026-08-16-x-algoritmo-publico.md

Lo que NO hay que hacer: creerle a la tarjeta de codigo que muestra el reel. Esta dibujada
(comentarios en espanol, no es una captura de GitHub). Los numeros que da -- retweet +1,
reporte -200, link copiado = 40 likes -- son AFIRMADOS, sin fuente.

Lo que SI importa para nosotros, y no es "como hacerse viral":
Lucia es una influencer IA DECLARADA. Si una red grande esta etiquetando y sancionando
contenido generado con IA a nivel de CUENTA ENTERA -- no del post -- eso pega de lleno en
toda nuestra produccion generativa. Y esas senales tienden a copiarse entre plataformas.

Tarea:
1. Leé visibility-filtering en el repo publico y contesta con evidencia: existe una
   etiqueta de contenido generado con IA, que la dispara, y que efecto tiene (alcance
   reducido, invisible para no-seguidores, cuenta entera o solo el post).
2. Cita archivo y linea de cada afirmacion. Si algo no esta en el codigo, deci que no esta;
   no rellenes con lo que dice el reel.
3. Contrasta con las politicas publicadas de Instagram y TikTok sobre contenido generado
   con IA y su etiquetado obligatorio.
4. Concluí en una tabla: que practica nuestra es segura, cual es riesgosa, y que cambiamos.

Regla que NO cambia: la etiqueta de IA en el contenido de Lucia se mantiene. No la sacamos
para esquivar un filtro; eso es exactamente el fraude que descartamos en otros videos.

LISTO = tabla de practicas con archivo:linea del repo como respaldo, y la lista de cambios
concretos a como publicamos.
```

---

---

## A4 · Estructura de escenas para video IA — preparar, no generar

```text
Sesion: marketing (Arthur). git branch --show-current primero.
TAREA UNICA: escribir UN guion con la estructura de escenas que encontramos, SIN generar nada.
Formato (de 2026-08-11-seedance-prompt-por-escenas-timestamps.md, sale de una sola foto):
    Scene N — <nombre> (Xs-Ys)
    <encuadre y angulo> · <camara> · <que queda en foco y que sale> · <luz>
Es lo que le falta a nuestras piezas: hoy se genera plano por plano y la consistencia entre
tomas se rompe. Aca la continuidad esta escrita en el prompt.
LISTO = un guion de 15-20 s por escenas con sus rangos de tiempo, listo para aprobar.
NO HAGAS: NO generes video — eso es credito y va con OK explicito de Sergio caso por caso.
Antes de proponer generar, verifica que Seedance 2.5 este en la cuenta y a cuanto sale la
generacion (consultar el catalogo es gratis).
NO copies el contenido del ejemplo (autos de lujo): se roba el esqueleto, no el auto.
```

---

## `INFLUENCERS IA`

Sale de [Seedance: prompt por escenas con timestamps](../2026-08-11-seedance-prompt-por-escenas-timestamps.md)
(`SIRVE YA`) — el hallazgo más útil de la tanda. Complementa el
[SOUL 2.0 del 9-ago](../2026-08-09-higgsfield-soul2-seedance25.md), que decía *"no es un prompt,
es arquitectura"* pero no mostraba la estructura. Ahora está a la vista y se puede copiar.

```text
Sesión: INFLUENCERS IA. Corré `git branch --show-current` primero.
TAREA ÚNICA: portar al brief de generación de Lucía la estructura de prompt por escenas.
Formato exacto a adoptar (viene de un anuncio real de Seedance 2.5, generado desde UNA sola
foto de referencia):
    Scene N — <nombre> (Xs–Ys)
    <encuadre y ángulo> · <comportamiento de cámara> · <qué queda en foco y qué sale>
    · <calidad y dirección de la luz>
Los tres campos que faltaban (lock de vestuario, raccord de luz, timestamps) salen de acá.
LISTO = la plantilla escrita en la skill de generación + UN guion de ejemplo de 15-20 s para
Lucía, dividido en escenas con sus rangos de tiempo. Sin generar todavía.
NO HAGAS: NO generes ningún video ni imagen — eso gasta créditos y necesita OK explícito de
Sergio caso por caso. Antes de proponer generar, verificá que Seedance 2.5 esté en la cuenta
y su costo por generación (tarea V-3 de PENDIENTES.md, consultar es gratis).
NO copies el contenido del ejemplo (autos de lujo): se roba el esqueleto, no el Aston Martin.
Y NO adoptes nada de PrimeBoard (ver 2026-08-11-primeboard-autopilot-farming-redes.md): su
función es farmear cuentas con un Android, viola los ToS de Meta y TikTok, y con el token de
IG ya bloqueado (S6) es exactamente el riesgo que no conviene tocar.
```

---

---

## Y además: la entrega completa de Higgsfield

Los 12 puntos de [ENTREGA_HIGGSFIELD_LUCIA.md](../ENTREGA_HIGGSFIELD_LUCIA.md) van enteros a esta sesión. Marcan qué está verificado contra la cuenta y qué es solo afirmado por un video.

---

