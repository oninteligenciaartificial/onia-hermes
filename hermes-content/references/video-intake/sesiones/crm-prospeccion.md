# Sesión CRM / prospección

> **Este archivo es la raíz de la sesión `CRM / prospección`.** Todo lo que esta sesión tiene que hacer
> de lo que salió del análisis de reels está acá, completo. No hace falta abrir otro archivo.
>
> Orden: **C4 primero — es lo único que ataca la falta de clientes**
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

## C4 · El hueco #1 no lo cierra ningun video

De los **45 videos ingresados, CERO** hablan de como conseguir el primer cliente pagando, B2B, en
Bolivia (§6.1 de la [sintesis](../SINTESIS_CORPUS.md)). Las tres piezas de `BANDEJA.md` que parecian
tapar el hueco se procesaron el 12-ago y **ninguna lo tapo**:
[8 industrias](../2026-08-12-ocho-industrias-ocho-agentes-ia.md) da copy, no ruta;
[5 formatos](../2026-08-12-cinco-formatos-anuncio-estatico-meta.md) es ecommerce DTC gringo;
[caso Climatic](../2026-08-12-caso-exito-ajeno-climatic-marca-propia.md) le vende asesoria a un
aspirante a emprendedor. **Este hueco no se cierra mirando mas reels. Se cierra con fuentes.**

```text
Sesion: ventas / prospeccion. git branch --show-current primero.
TAREA UNICA: escribir la ruta al PRIMER cliente pagando, con fuentes reales, no con videos.
  1. Pregunta abierta que decide Sergio y va PRIMERO (no la decidas vos): la plataforma es
     multi-rubro, pero ¿el ESFUERZO COMERCIAL se concentra en UN rubro hasta cerrar los primeros
     casos? Seis rubros son seis mensajes, seis landings y seis listas, con cero clientes hoy.
     Presentale la pregunta con el pro y el contra en 5 lineas y esperá la respuesta.
  2. Con el rubro elegido: 20 prospectos REALES y verificables en Santa Cruz, cada uno con la
     fuente de donde salio (registro publico, directorio del gremio, su propia web o IG) y una
     senal concreta de por que es candidato — no una lista de volumen.
  3. El guion de primer contacto por el canal que SI tenemos hoy (WhatsApp/Chatwoot), no por el
     que esta bloqueado. Maximo 5 lineas, nombrando el dolor exacto del rubro (gate de C2).
LISTO = la pregunta contestada por Sergio + la tabla de 20 prospectos con fuente por fila + el
guion. Nada enviado todavia.
NO HAGAS: NO ingreses ni analices un video mas para esto — 45 piezas no lo cubrieron y la 46 no
lo va a cubrir. Las fuentes son registros, gremios y las webs de los propios negocios.
NO inventes un prospecto ni un dato de contacto: fila sin fuente, fila que no va.
NO automatices el envio (es S6 + spam con nuestra marca) ni uses un Lead Finder de volumen — eso
ya esta decidido en el prompt de `CRM` / prospeccion, que sigue siendo el que discute la
arquitectura de agentes. Este prompt es la lista de verdad, hecha a mano, y no lo reemplaza.
```

---

## `CRM` / prospección — del ejército de 7 agentes

Sale de [7 agentes de venta](../2026-08-11-ejercito-7-agentes-ventas.md) (`MEJORA LO ACTUAL`).

```text
Sesión: la que lleve agentes/CRM. git branch --show-current primero.
TAREA ÚNICA: usar los 7 roles como checklist contra el agente Vendedor que YA corre, y
quedarse con lo que falta. Los 7 roles: Lead Finder, Researcher, Personalizer, Outreach,
Follow-Up, Appointment Setter, Sales Manager.
Hipótesis a confirmar o tirar: los eslabones débiles son Researcher (investigar el prospecto
antes de escribirle) y Follow-Up (no dejar morir al lead que ya entró).
LISTO = la tabla de 7 filas con "lo cubre / no lo cubre / es un estado, no un agente", y UNA
sola pieza construida: la de mayor retorno.
NO HAGAS: NO construyas outreach automático. Un agente que escribe y envía solo es spam con
nuestra marca — el agente redacta, un humano aprueba, igual que la cola actual.
NO crees siete agentes: varios de esos roles son un estado del work item, no una entidad.
NO uses un Lead Finder de volumen: la regla es pocos prospectos buenos con señal, no listas.
```

---

---

