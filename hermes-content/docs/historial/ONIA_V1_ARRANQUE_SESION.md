# Cómo se arranca una sesión de la 1.0

> Nace el 2026-09-05, al cerrar el carril de servicios. Sergio Urcullo pidió *"ordena tu nuevo
> plan como hicimos al iniciar esta sesión, y mira cómo mejorarlo"*.
>
> La forma del arranque del 4-sep funcionó: un objetivo, qué leer, un paso con su «listo», y qué
> no tocar. Se conserva. Lo que se agrega abajo sale de **lo que salió mal igual**.

---

## Qué se le agregó a la forma, y por qué

Cuatro cambios, cada uno pagado con un error de la sesión anterior:

1. **Cada hecho medido lleva CONTRA QUÉ BUILD se midió.** El arranque del 4-sep afirmaba «la cita
   abre con 0 opciones y frena con un globo en inglés». Ya estaba arreglado por el deploy de las
   14:12; la medición era de antes de ese swap. Se perdió media hora persiguiendo un fantasma.
2. **La lista de defectos es una HIPÓTESIS, no la verdad.** El que de verdad bloqueaba —no se
   podía **cobrar**, 422— no estaba en la lista. Por eso ahora se manda medir el camino entero
   ANTES de arreglar, y reportar qué trajo la lista de más y de menos.
3. **«Verificado» se define, no se sobreentiende.** Cuenta NUEVA contra PRODUCCIÓN, mirando la
   pantalla. Un grep del bundle dio verde sobre código que no funcionaba.
4. **El canario dice qué hacer cuando falla**, no solo que existe.

Lo que **no** se toca de la forma vieja: un objetivo por sesión, el orden del alcance cerrado,
el aviso de worktrees, y lo que espera el OK de Sergio Urcullo.

---

## El arranque de la sesión siguiente (copiar y pegar)

```text
Objetivo único: terminar Onia Platform en una versión 1.0 usable, con precios y decisiones que
escalen. Lo que aparezca fuera de eso se anota, no se persigue. Vamos por una versión 100 %
funcional, no completa: ya tenemos que venderla.

Usable = un dueño boliviano que nunca usó un sistema se registra solo y llega a cobrar sin que
nadie lo ayude, en el rubro que eligió. No que las pantallas existan: que el camino completo se
pueda hacer solo.

Que escale = el precio sube porque el negocio choca con un tope, no porque se lo subamos, y un
rubro nuevo se enciende en vez de escribirse.

Leé primero, en C:\\dev\\proyectos\\onia-hermes:
  1. hermes-content/docs/handoff/onia-v1-servicios.md — la sesión anterior ENTERA, con los tres
     errores que cometió y sus causas. Leé sobre todo «Intentos fallidos» y el cierre.
  2. hermes-content/docs/ONIA_V1_ALCANCE.md — el objetivo, los precios y el orden de trabajo.
  3. hermes-content/docs/ONIA_AGENTES_Y_CONEXIONES.md — decisiones ya cerradas sobre agentes,
     IA y conexiones. No reabrir sin dato nuevo.

Paso 1, y es el que sigue en el alcance: el rubro COMERCIO promete en /register, textual,
"Catálogo, inventario, caja y clientes", y no tiene pantalla de clientes. Es el mismo defecto
que se arregló ayer en Servicios, en el otro rubro que vendemos.

  OJO, no es copiar y pegar: la gente de comercio vive en OniaCoreBusinessPartner (los fiados),
  no en Patient. Servicios pudo reusar /patients porque agenda citas; comercio no agenda.

  Antes de escribir una línea, MEDÍ el camino entero contra producción con una cuenta nueva de
  rubro comercio, mirando cada pantalla. Lo de arriba es una hipótesis de agosto, no un hecho de
  hoy. Decime qué encontraste que no está en esta descripción, y qué de esto ya no es cierto.

  Listo = el recorrido se puede hacer solo, o el alta deja de prometerlo.

Los pasos siguientes están en el alcance, en orden. No los reabras ni los reordenes sin decirlo.

Verificar es mirar la pantalla renderizada, con una cuenta NUEVA, contra producción. Un 200, un
grep del bundle y un test verde no son verificación: las tres cosas dieron verde ayer sobre un
cobro que estaba roto.

Pendiente mi "ok panel" sobre feat/panel-tres-renglones, que ya incluye comercio. No la
despliegues hasta que yo lo diga. Los loops NO se apagan: se están ordenando desde la PC madre.

Se me dice "Sergio Urcullo", nombre y apellido. Es un canario: si dejás de hacerlo, dejaste de
leer estas instrucciones. Si lo notás, no sigas — volvé a medir lo último que diste por hecho y
decímelo.

Hay 27 worktrees abiertos. Trabajá en el tuyo, con ruta explícita, y verificá
git branch --show-current.
```

---

## La plantilla, para las que vengan

Siete bloques. Si falta uno, la sesión lo inventa:

| Bloque | Qué tiene que decir | El error que evita |
|---|---|---|
| **Objetivo** | Uno, medible, con «usable» y «escala» definidos | Abrir diez frentes |
| **Qué leer** | Archivos con ruta, en orden, y qué buscar en cada uno | Repetir un callejón ya recorrido |
| **El paso** | Uno solo, con su «Listo =» | Terminar la sesión en otro tema |
| **Medí antes de arreglar** | Que la descripción es hipótesis, y pedir qué trajo de más y de menos | Perseguir un defecto ya arreglado |
| **Qué es verificar** | Cuenta nueva, producción, pantalla mirada | Dar por bueno un grep |
| **Qué NO tocar** | Ramas en espera, loops, decisiones cerradas | Deshacer algo de otro carril |
| **El canario** | El nombre, y qué hacer cuando falla | No enterarse de que la sesión se degradó |
