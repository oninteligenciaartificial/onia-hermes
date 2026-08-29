# T01 · Ponerle gates y arista de aprendizaje a los agentes de Onia

- **Destino:** `onia-plattform` (módulo de agentes)
- **Sale de:** [la ficha](../2026-08-29-loops-y-grafos-dejar-de-vigilar-agentes.md) · post de X de @hanakoxbt
- **Fuente:** https://x.com/hanakoxbt/status/2091515787366306154
- **Qué falta para hacerlo hoy:** nada externo. Es método, no herramienta.

---

```text
Objetivo único: que los agentes de Onia dejen de necesitar que alguien mire cada paso — poniendo
lo único que falta, que son los gates y la arista de aprendizaje.

DE DÓNDE SALE: un ensayo de @hanakoxbt, "Loops and Graphs". Su tesis en dos frases:
  "Un LOOP hace que una unidad de trabajo salga correcta sin vos.
   Un GRAFO decide qué unidades existen."
Y el diagnóstico: casi todo el mundo construye sólo una de las dos.

Contexto nuestro: ONIA Center ya corre agentes por cron y el carril de reels ya usa workflows con
fan-out. O sea que motor hay. Lo que no hay son gates ni aprendizaje entre corridas.

PASO 1 — EL GATE PRIMERO, ANTES QUE CUALQUIER OTRA COSA.

La regla del ensayo: "un grafo sin gate es sólo una forma más rápida de producir trabajo sin
verificar". Y la definición dura: si no hay algo que pueda FALLAR el trabajo mientras vos no
estás, no tenés un loop, tenés un scheduler.

Para CADA agente que hoy corre en ONIA Center, escribir su check en forma evaluable por un
programa. Ejemplos de la forma correcta:

    GREEN   el workflow de n8n devolvió 200 Y el registro quedó escrito en la tabla
    GREEN   cada afirmación del reporte cita una fila con su id
    GREEN   el diff toca sólo los archivos que el plan nombró

Y lo que NO es un check, que es donde casi todos caen:

    NO ES CHECK   el resultado se ve bien
    NO ES CHECK   el modelo dice que está seguro
    NO ES CHECK   no hubo errores

Esa última nos mordió literalmente hoy: 25 de 26 transcripciones devolvieron "SIN_VOZ" sin lanzar
un solo error, y estaban rotas. La pista era duration=0. Ausencia de error no es evidencia de
que esté bien.

PASO 2 — CLASIFICAR CADA AGENTE POR RADIO DE IMPACTO, NO POR CONFIANZA.

El ensayo es tajante y tiene razón: la confianza es la variable más débil porque es la única que
el modelo puede influir. Se ordena por qué tan caro es deshacer el error:

  CARRIL 1 — reversible y contenido: escribir un doc, generar un borrador, mandar un aviso a
             Telegram. Abre primero.
  CARRIL 2 — reversible pero ancho: tocar algo que muchos consumen, agregar un campo, cambiar una
             plantilla que sale a varios clientes. Checks deterministas + trayectoria limpia.
  CARRIL 3 — difícil de revertir: migraciones, borrados, escribir en la base de producción,
             publicar en una cuenta de cliente, y CUALQUIER COSA QUE MUEVA PLATA.
             Este carril NO ABRE, sin importar el score.

La distinción que hay que respetar: el carril 3 no es "un umbral muy alto". Es un carril cerrado.
Los umbrales se ajustan cuando alguien tiene apuro; los carriles cerrados no.

Cruzar esto con lo que ya está escrito en el CLAUDE.md del proyecto sobre permisos de gasto y
sobre no publicar sin aprobación. Si algo ya está prohibido ahí, acá es carril 3 y punto.

PASO 3 — LA ARISTA DE APRENDIZAJE, QUE ES LA QUE NADIE CONSTRUYE.

Hay dos caminos de vuelta y hacen cosas distintas:
  - corrección (corta): el gate devuelve UNA unidad al paso que la produjo. Arregla esta corrida.
  - aprendizaje (larga): un resultado aceptado vuelve al SPLITTER como restricción. Arregla todas
    las corridas siguientes.

"El síntoma de que falta la segunda es un sistema rápido que nunca se vuelve más inteligente."

Y no viaja el resultado, viaja una restricción derivada:

    ACEPTADO   la ficha salió bien leyendo la hoja de contactos
    DERIVADO   los fotogramas van a 640px y 24 por video, no 1080 y 40
    ATERRIZA   en el brief del splitter, para todos los lotes que vengan

Fijate dónde aterriza: en el brief que decide CÓMO SE PARTE el trabajo, no en las instrucciones
del worker. Ahí está toda la diferencia.

PASO 4 — LA REGLA DE DEVOLUCIÓN, QUE ES LA MÁS CARA SI SE HACE MAL.

Devolver la UNIDAD, nunca el lote. Si de cuatro unidades falla una y volvés las cuatro, tres
correctas se reescriben: su próxima versión es distinta, no mejor. Convertiste un fallo en cuatro
resultados inciertos y encima lo pagaste.

Con cada devolución viajan: UNIDAD · VEREDICTO · MOTIVO · EVIDENCIA · ALCANCE.
El ALCANCE es el que más se olvida y el que evita que una corrección de un archivo se vuelva un
diff de cuatro que nadie revisó.

Tope de TRES intentos. Si una unidad falla tres correcciones, el problema está en el plan que la
produjo, y el loop no puede ver el plan.

PASO 5 — AUDITAR LAS ARISTAS FALSAS DE LOS PIPELINES QUE YA TENEMOS.

El test, aplicado a cada flecha de cada workflow de n8n y de cada cron: ¿el paso siguiente LEE de
verdad la salida del anterior? Si no podés nombrar la variable que cruza, no hay arista y la
espera es desperdicio puro.

El ensayo dice que la mayoría de las cadenas tienen dos o tres flechas así, y que encontrarlas
suele ser la mayor aceleración disponible. En este mismo carril pasó hoy: corrí descarga ->
fotogramas -> transcripción en serie, cuando la transcripción no consume los fotogramas.

PASO 6 — EL HUMANO EN UN SOLO PASO.

Sergio aprueba en el punto de mayor consecuencia y menor reversibilidad: el merge, qué se publica,
qué se gasta. NO revisando salidas intermedias. "Un humano en el medio de un grafo se vuelve el
nodo más lento, y el grafo corre exactamente a la velocidad de una persona leyendo."

LO QUE NO SE PUEDE DAR POR CIERTO: el ensayo es una opinión bien argumentada, no un paper. No trae
datos ni fuentes, y el autor vende un curso. Se adopta por la calidad del razonamiento, no porque
esté probado. Si algo no encaja con cómo trabajamos, gana lo nuestro.

LISTO = un documento con (a) el check evaluable escrito para cada agente que hoy corre en ONIA
Center, (b) cada agente clasificado en carril 1, 2 o 3 con el carril 3 explícitamente cerrado,
(c) la arista de aprendizaje definida — dónde se guardan las restricciones derivadas y quién las
lee, y (d) la lista de aristas falsas encontradas en los workflows actuales, con el nombre de la
variable que NO cruza.
```
