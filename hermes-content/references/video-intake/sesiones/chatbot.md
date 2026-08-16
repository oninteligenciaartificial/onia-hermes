# Sesión `chatbot`

> **Este archivo es la raíz de la sesión `chatbot`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **D1 PRIMERO (está roto ahora) → E2 → minimización de datos**
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

## D1 · 🔴 El chatbot no guarda nada hace 6 dias (VERIFICADO HOY)

Consultado directo contra la base de produccion el 2026-08-12:

```
messages:      16 filas · ultimo 2026-08-06 14:58:33
conversations: 10 filas · ultimo 2026-08-06 14:58:25
```

**Seis dias sin una sola conversacion nueva.** La memoria del proyecto atribuia esto a una regla
de firewall (`ONIA-BLOCK-3000`) que cortaba trafico contenedor-contenedor. Esa regla **ya no
esta**: hoy hay `RETURN` para 172.16.0.0/12 en el puerto 3000. O sea que se removio la causa
sospechada y **el sintoma sigue igual**, lo que significa que la causa era otra o hay una segunda.

Esto vale mas que cualquier prompt salido de un reel: es el canal de venta caido, en silencio,
sin que nadie lo note.

```text
Sesion: chatbot (o infra). git branch --show-current primero.
TAREA UNICA: que el chatbot vuelva a guardar conversaciones. Diagnostico primero, no parches.
DATO DE PARTIDA (verificado 2026-08-12 contra la base onia-chatbot en el VPS):
  messages      16 filas, ultimo 2026-08-06 14:58:33
  conversations 10 filas, ultimo 2026-08-06 14:58:25
  la regla ONIA-BLOCK-3000 ya NO existe: hay RETURN 172.16.0.0/12 -> 172.16.0.0/12 puerto 3000
PASOS: (1) mandar UN mensaje de prueba por el canal real y seguirlo punta a punta —
webhook -> contenedor -> base; (2) encontrar en que salto se pierde, con evidencia (logs del
contenedor, respuesta del webhook, fila en la base); (3) recien ahi arreglar.
LISTO = un mensaje de prueba nuevo visible en la tabla `messages` con timestamp de hoy, y el
salto que fallaba explicado con la evidencia pegada.
NO HAGAS: no des por buena la explicacion vieja del firewall — se removio la regla y el sintoma
sigue, asi que esa hipotesis ya esta descartada por los hechos. No toques la minimizacion de
datos en esta sesion (es el otro prompt de `chatbot`): primero que guarde, despues que guarde
menos. No reinstales Chatwoot: hay 10 conversaciones reales que no se pueden perder.
```

---

## E2 · El corte YMYL: escalar al humano y decirlo en pantalla

```text
Contexto: una app de nutricion mostro dos guardrails que nosotros necesitamos igual, y por
la misma razon (salud = YMYL). Ficha:
hermes-content/references/video-intake/2026-08-16-nutriapp-modulo-vertical.md

Los dos, verbatim del video: "si es algo mas importante o algo delicado te pide que lo
consultes con el nutriologo", y en la pantalla del chat hay un descargo visible bajo el
campo de texto.

Tarea:
1. Verifica si el chatbot tiene HOY una regla de escalamiento a humano para temas
   clinicos, y si muestra algun descargo. Verificalo en la conversacion real, no en el
   prompt del sistema.
2. Si no la tiene, escribila: que categorias de consulta cortan (sintoma, dolor, diagnostico,
   dosis, urgencia), que responde el bot al cortar, y a quien deriva.
3. El descargo va VISIBLE en la interfaz, no escondido en terminos y condiciones.
4. Bolivia NO tiene ley integral de proteccion de datos. NO cites leyes extranjeras como si
   aplicaran: ya pasamos por eso una vez. Si necesitas marco legal boliviano, cargá la skill
   onia-contabilidad-bolivia y citá norma vigente con su numero.

Esto es para el pack dental y cualquier rubro sanitario. No aplica al de comercio.

Nota de orden: si el prompt D1 (el bot no guarda mensajes desde el 2026-08-06) sigue
abierto, ESE va primero. Un guardrail sobre un bot que no persiste no sirve de nada.

LISTO = el corte esta activo en produccion y se ve en una conversacion real de prueba, con
el descargo visible en pantalla.
```

---

---

## `chatbot`

Sale de [chatbot y dato sensible](../2026-08-11-chatbot-dato-sensible-ley-21719-chile.md)
(`SIRVE YA`). Es el más urgente de toda la tanda porque el chatbot ya está corriendo y
porque el rubro dental maneja datos de salud.

```text
Sesión: chatbot. Corré `git branch --show-current` primero.
TAREA ÚNICA: aplicar minimización de datos en el chatbot. Nada más.
La regla: no se guarda ningún dato del usuario que no cambie el comportamiento del sistema.
Un mensaje del tipo "estoy enferma" no se persiste ni se usa en un seguimiento posterior.
PASOS: (1) listar qué campos del historial de conversación se guardan hoy y dónde;
(2) marcar cuáles son necesarios para responder y cuáles solo están "por si acaso";
(3) dejar de persistir los innecesarios y purgar los ya guardados.
LISTO = una lista de campos con la decisión tomada por cada uno, y la purga ejecutada
y verificada en la base.
NO HAGAS: no cites la ley chilena 21.719 a un cliente boliviano — Bolivia no tiene ley
integral de protección de datos vigente, y citar una ley extranjera como si aplicara acá
sería fabricar. La práctica es correcta por sí sola; el argumento legal hay que investigarlo
aparte con fuente boliviana. Tampoco toques el motor de respuestas ni la integración de
WhatsApp en esta sesión.
```

---

---

