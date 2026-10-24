# WORKSHOP-MATERIAL · «Auditá tu negocio con IA» · sáb 31-oct-2026, 10:00 (La Paz)

Material de **facilitador**, en voseo (marca personal de Sergio Urcullo). Autor: Claude. Revisor previsto: Codex. Preparado el 23-oct-2026.
**Estado:** material completo para ensayar, **no ensayado con personas**. Venta pausada: este archivo no la abre, no cambia fecha, precio ni cupos y **no agrega ninguna promesa** (canon: sin certificado, sin ahorro en bolivianos, sin resultados, **sin promesa de grabación**, sin plantilla del «Mapa», sin segunda fecha, sin nada de Onia Platform).
Fuentes: `hermes-content/docs/TALLER_31_OCT.md` (canon), `ESTRATEGIA-WORKSHOP.md`, `.hermes/tasks/workshop-enfoque-escalabilidad-revision.md` (revisión de alcance de Hermes, 23-oct).

## 1. Recomendación: auditar y priorizar, no «manejar todo el negocio»

| Alcance | Veredicto | Motivo (de la revisión de Hermes, con mis cuentas) |
|---|---|---|
| **Auditar y priorizar** (vigente) | **Se mantiene** | Cabe en 90 minutos de contenido más pausa de 5, con 50 cupos: un método común y cada persona completa SU caso. La salida es tangible: lista, costo en tiempo, una prioridad, un primer paso |
| Implementar un proceso supervisado | **No es el taller.** Queda como hipótesis de continuidad, separada (§9) | Con 50 personas, cada una con herramientas y accesos distintos, la ayuda individual no escala; incluso 1 minuto por persona gasta 50 de los 90 minutos de contenido (aritmética, no tiempo medido) |
| Manejar todo el negocio | **Descartado** | Probar una tarea no valida el conjunto; ventas, caja y excepciones piden controles distintos por negocio. Sería otro producto y otra promesa |

Para que lo **auditado sea tangible** (el punto débil que marcó Hermes: «plan ≠ producto»), el taller se vuelve un ejercicio con **salida comprobable**: cada persona sale con cuatro cosas que puede revisar con la rúbrica de §7. Todo lo que sigue es ese ejercicio, completo.

## 2. Agenda: 90 minutos de contenido más pausa de 5 (tiempo transcurrido 0 a 95)

Por Google Meet; al volver de la pausa se entra al **mismo link**. Dos bloques de 45 (canon).

| Min | Qué pasa | Quién habla / hace | Producto |
|---|---|---|---|
| **BLOQUE 1** 0-45 | | | |
| 0-4 | **Apertura** (texto en §3) | Facilitador | Reglas del día, qué se llevan y qué no |
| 4-9 | El método en una frase y la regla de los datos | Facilitador | Todos saben qué es «tarea repetida» y que **no se usan datos reales de clientes** |
| 9-19 | **Demostración** con el caso ficticio «Tienda El Perchero» (§4): se cuentan 3 tareas en vivo | Facilitador | Se ve el método completo antes de pedirlo |
| 19-37 | **Ejercicio 1: tu lista y tu cuenta** (18 min) | Cada persona, con su negocio | Lista de 5 a 8 tareas, cada una con veces por semana y minutos por vez |
| 37-43 | Puesta en común: 3 voluntarias/os leen **una** fila (sin datos privados); se corrige la cuenta | Facilitador | Se detecta el error más común (§8) |
| 43-45 | Cierre del bloque: «guardá tu lista, la usamos al volver» | Facilitador | |
| **45-50** | **PAUSA de 5.** Vuelven al mismo link | | |
| **BLOQUE 2** 50-95 | | | |
| 50-55 | Volver, recordar la regla de datos; **costo en tiempo**: minutos por semana y por mes (supuesto: 4 semanas) | Facilitador + cada persona | Cuenta de cada tarea, verificada a mano |
| 55-65 | **Prompt propuesto** (§5): demostración y uso opcional | Facilitador; cada persona pega SU lista de tareas y números (sin datos de clientes) | Tabla ordenada, con la aritmética **verificada por la persona** |
| 65-77 | **Prioridad** (12 min): regla de tiempo + riesgo + revisión humana; elegir **una** | Cada persona | Una tarea elegida y por qué ganó |
| 77-89 | **Primer paso** (12 min): qué, cuándo, con qué datos, cómo se mide, quién revisa | Cada persona | Un primer paso para esta semana |
| 89-95 | Cierre: autocontrol con la rúbrica (§7), qué **no** se promete, despedida | Facilitador | Cada persona sabe qué criterio le falta |

Total: bloque 1 = 4+5+10+18+6+2 = 45; bloque 2 = 5+10+12+12+6 = 45; pausa 5; total transcurrido 95. **Se puede hacer todo sin IA**: el prompt es una ayuda opcional; quien no use ninguna herramienta hace la cuenta y la rúbrica a mano. Requisito de canon: computadora o celular con internet y Google Meet.

## 3. Apertura del facilitador (texto hablado, unos 3 a 4 minutos)

> Buen día. Soy Sergio Urcullo y este taller es para una cosa: que cuentes lo que repetís en tu negocio antes de automatizar nada.
>
> Vas a salir con cuatro cosas, hechas por vos, con tu propio negocio: una lista de tus tareas repetidas, cuánto tiempo te llevan por semana y por mes, una prioridad, que es una sola tarea para empezar, y tu primer paso.
>
> Dos aclaraciones, para que nadie se lleve una sorpresa. Primera: esto es tiempo, no plata. No te voy a decir cuánto vas a ahorrar, y no lo prometo. Segunda: no hay certificado, y no se promete grabación, así que tomá nota o sacá una captura de tu lista. Este taller es para quien tiene un negocio que repite tareas; si no repite, esta no es la sesión.
>
> Hay una regla que vale todo el día: **no pegues datos de tus clientes** en ninguna herramienta. Ni nombres, ni teléfonos, ni direcciones, ni montos. Cambiarles el nombre a datos reales **no los vuelve anónimos**: para practicar con pedidos o mensajes, usá casos **totalmente inventados**. Lo que sí podés pegar son tus tareas y tus números: «contestar precios, 10 veces por semana, 5 minutos». Así reducimos la exposición, que no es lo mismo que cero riesgo. Y si no querés usar ninguna IA, no pasa nada: todo esto se puede hacer con lápiz y papel.
>
> Vamos en dos bloques de 45 minutos con una pausa de 5. Cuando volvamos entrás al mismo link. Ahora te muestro cómo se cuenta una tarea, con un negocio inventado, y después lo hacés con el tuyo.

(264 palabras, 82 s de voz estimados a 3,2 palabras por segundo, contadas con `pruebas/verificar_material.py`; con pausas y la logística de Meet entran los 4 minutos.)

## 4. Ejercicio completo con datos ficticios (rotulados)

> **TODO LO DE ESTA SECCIÓN ES INVENTADO. «Tienda El Perchero» no existe; ningún dato es de un negocio real ni de un cliente.** Mide **tiempo**, no ahorro ni dinero. Supuesto declarado: **4 semanas por mes**.

**Caso:** una tienda inventada de ropa y accesorios que vende por WhatsApp y entrega en la ciudad. Dos personas atienden. Estas son sus tareas repetidas de una semana típica (inventada):

| N° | Tarea | Veces por semana | Minutos por vez | Minutos por semana | Minutos por mes | Riesgo si sale mal | ¿Una persona puede revisarla? |
|---|---|---|---|---|---|---|---|
| 1 | Contestar «¿cuánto cuesta?» por WhatsApp | 10 | 5 | **50** | 200 (3 h 20) | medio: una promesa de precio | sí |
| 2 | Pasar los pedidos del cuaderno a la planilla | 5 | 15 | **75** | 300 (5 h) | medio: un error de monto | sí |
| 3 | Recordar saldos pendientes a clientes | 2 | 20 | **40** | 160 (2 h 40) | **alto**: plata y trato con el cliente | sí |
| 4 | Armar el resumen de ventas del viernes | 1 | 45 | **45** | 180 (3 h) | bajo: es interno | sí |
| 5 | Responder reclamos por entregas | 4 | 25 | **100** | 400 (6 h 40) | **alto**: una promesa al cliente | sí |
| 6 | Actualizar precios en las publicaciones | 1 | 30 | **30** | 120 (2 h) | medio | sí |
| 7 | Coordinar horarios de entrega | 6 | 4 | **24** | 96 (1 h 36) | medio: una promesa de horario | sí |
| 8 | Pedir fotos y datos a proveedores | 3 | 8 | **24** | 96 (1 h 36) | bajo | sí |
| | **Total** | | | **388** | **1.552 (25 h 52)** | | |

Cuentas comprobadas con `pruebas/cuentas_workshop.py` (salida en `pruebas/cuentas_workshop.salida.txt`): suma semanal 388 min; mensual 1.552 min = 25 h 52 min. Es **tiempo de ejemplo**, no un resultado de nadie.

**Los cinco pasos que hace cada persona con SU negocio (el mismo orden que con El Perchero):**

1. **Lista (min 19-37 del bloque 1).** Escribí de 5 a 8 tareas que repetís cada semana. Cada una con un verbo y un objeto («pasar pedidos a la planilla», no «administración»).
2. **Cuenta (min 50-55).** Para cada tarea: veces por semana × minutos por vez = minutos por semana; × 4 = minutos por mes. Pasá a horas y minutos con una división entre 60.
3. **Riesgo (min 55-65).** Para cada tarea: si sale mal, ¿se rompe plata, datos de un cliente o una promesa? Marcá bajo, medio o alto. Y: ¿una persona puede revisar el resultado antes de usarlo?
4. **Prioridad (min 65-77).** Regla: **la tarea de más minutos por semana entre las de riesgo no alto que una persona pueda revisar.** Una sola. **Si ninguna es elegible, o si faltan datos, no se elige: se anota qué falta o qué habría que cambiar** (por ejemplo, definir quién revisa antes de enviar). Si hay un empate en minutos, decide la persona. **El riesgo y si una persona puede revisar lo decide la dueña o el dueño**, no la herramienta.
5. **Primer paso (min 77-89).** Completá: *Esta semana voy a [qué], con [datos totalmente inventados], voy a medir [minutos antes y después], y lo revisa [quién].*

**Hoja de trabajo (la pueden copiar a una hoja de papel o a una planilla; es material de facilitador, no se promete entregarla como plantilla):**

| Tarea (verbo + objeto) | Veces por semana | Minutos por vez | Minutos por semana (veces × minutos) | Minutos por mes (× 4) | Riesgo (bajo, medio, alto) y por qué: **lo decidís vos** | ¿La revisa una persona? **vos decidís** |
|---|---|---|---|---|---|---|
| | | | | | | |

**Prioridad elegida:** ______ **porque:** ______  
**Primer paso:** Esta semana voy a ______, con ______, voy a medir ______, y lo revisa ______.

## 5. Prompt propuesto para ordenar la lista (opcional; reduce la exposición, no la elimina)

**Estado:** es un **prompt propuesto**. **No se probó en ninguna herramienta externa y no se garantiza que funcione igual en todas.** Se llama «seguro» por lo que evita pedir, no porque elimine los riesgos.

**Antes de pegar nada (4 controles, 30 segundos):**
1. ¿Lo que pego son **solo tareas y números míos** («contestar precios, 10 veces, 5 minutos»), sin nombres, teléfonos, direcciones ni montos de clientes? Si quiero practicar con pedidos o mensajes, ¿son **casos totalmente inventados**? (Cambiar el nombre a un dato real **no lo vuelve anónimo**.)
2. ¿Describí la **tarea**, no a la persona?
3. ¿Sé qué hace la herramienta que uso con lo que le pego? (cambia entre planes y proveedores; si no sé, uso solo casos totalmente inventados)
4. ¿Voy a **revisar yo** lo que devuelva antes de usarlo?

**Prompt propuesto (se pega completo):**

```
Actuá como ayudante de orden para un negocio chico. Te paso una lista de tareas repetidas, con números míos y SIN datos de clientes. Si algo parece un dato de una persona real, avisame y no lo uses.

Reglas:
1. Usá solo los datos que te doy. Si falta algo, preguntame antes de suponer. No inventes datos.
2. No pidas ni uses datos personales de nadie.
3. Para cada tarea calculá: minutos por semana = veces por semana × minutos por vez; minutos por mes = minutos por semana × 4 (supuesto de 4 semanas por mes). Mostrá la cuenta, no solo el resultado.
4. El RIESGO (bajo, medio o alto) y si UNA PERSONA PUEDE REVISAR el resultado lo decido yo. Si no te los di para una tarea, preguntame; no los supongas. Podés sugerirlos, marcados como «a confirmar por el dueño o la dueña».
5. Proponé una prioridad SOLO si hay una tarea elegible: la de más minutos por semana entre las de riesgo no alto que una persona pueda revisar. Explicá por qué ganó y por qué no ganó la de más minutos si es de riesgo alto. Si hay un empate, decime cuáles empatan y no elijas.
6. Si NINGUNA tarea es elegible, o si faltan datos, NO inventes una prioridad: respondé «Sin candidata elegible» o «Faltan datos», y decime qué falta o qué habría que cambiar para que haya una.
7. Proponé un primer paso concreto para esta semana, revisable y medible, con datos totalmente inventados y sin comprar ni instalar nada.
8. No prometas ahorro ni resultados. Hablá de tiempo, no de dinero.
9. Al final listá qué tengo que verificar yo (las multiplicaciones, los supuestos y las decisiones de riesgo).

Formato: una tabla con las columnas tarea | cuenta semanal | minutos por mes | riesgo (el que te di) | ¿la revisa una persona? (la que te di). Después, tres títulos: Prioridad (o «Sin candidata elegible» / «Faltan datos»), Primer paso y Qué verifico yo.

Mi lista (tarea, veces por semana, minutos por vez, riesgo, ¿la revisa una persona?):
[pegá acá tu lista]
```

**Por qué este diseño:** no pide datos de personas, obliga a mostrar la cuenta, deja el riesgo y la revisión en manos de quien conoce el negocio, tiene salida explícita cuando no hay candidata o faltan datos, pide **qué verificar** y no promete ahorro. **Límites:** ningún prompt garantiza que la IA no se equivoque ni que no guarde lo que se le pega.

**Si la cuenta de la persona y la de la IA difieren:** **se recalculan las dos** (veces × minutos; × 4) y se revisan los supuestos **antes de aceptar cualquiera**. Puede estar mal la humana, la de la IA o las dos. Mientras no coincidan con el recálculo, se anotan ambas y no se usa ninguna. (Casos en `pruebas/cuentas_workshop.py`: `reconciliar`.)

## 6. Ejemplo resuelto (Tienda El Perchero, datos inventados)

### 6.1 Cuenta y riesgo
Es la tabla de §4. Dos lecturas:
- **La tarea más larga es la 5** (reclamos, 100 minutos por semana) pero es de **riesgo alto** (una promesa al cliente): no se elige primero.
- **Entre las de riesgo no alto y revisables, la de más minutos es la 2** (pasar pedidos a la planilla, 75 minutos por semana, 300 por mes = 5 horas, con el supuesto de 4 semanas). `pruebas/cuentas_workshop.py` lo comprueba (`prioridad`): sin la regla de riesgo habría salido la 5; con la regla sale la 2.

### 6.2 Prioridad
**Prioridad: tarea 2, pasar los pedidos del cuaderno a la planilla.** Porque: 75 minutos por semana es la mayor cantidad entre las tareas de riesgo medio o bajo, y una persona puede revisar cada fila contra el cuaderno antes de usarla. **No se eligió la 5** (más minutos) porque un error afecta una promesa al cliente.

### 6.3 Respuesta de ejemplo del prompt (redactada por el autor, no copiada de ninguna herramienta de terceros)
Entrada: las 8 tareas de §4 con sus veces y minutos, **y con el riesgo y la posibilidad de revisión ya decididos por el dueño** (columnas de §4). Salida esperada, abreviada:

| Tarea | Cuenta semanal | Minutos por mes | Riesgo (el dado) | ¿La revisa una persona? (la dada) |
|---|---|---|---|---|
| 1 Contestar precios | 10 × 5 = 50 | 200 | medio: una promesa de precio | sí |
| 2 Pasar pedidos a la planilla | 5 × 15 = 75 | 300 | medio: error de monto | sí |
| 3 Recordar saldos | 2 × 20 = 40 | 160 | alto: plata y trato | sí |
| 4 Resumen del viernes | 1 × 45 = 45 | 180 | bajo: interno | sí |
| 5 Reclamos por entregas | 4 × 25 = 100 | 400 | alto: promesa al cliente | sí |
| 6 Actualizar precios | 1 × 30 = 30 | 120 | medio | sí |
| 7 Horarios de entrega | 6 × 4 = 24 | 96 | medio: promesa de horario | sí |
| 8 Pedir datos a proveedores | 3 × 8 = 24 | 96 | bajo | sí |

**Prioridad:** tarea 2 (75 min por semana, riesgo medio, revisable). La tarea 5 tiene más minutos (100) pero es de riesgo alto.
**Primer paso:** esta semana, armar 5 pedidos **totalmente inventados**, con la misma forma que los reales (no datos reales con otro nombre), ordenarlos en columnas con el asistente, compararlos con lo que escribiste, anotar los minutos con y sin ayuda y qué hubo que corregir; lo revisa el dueño.
**Qué verifico yo:** las multiplicaciones (50, 75, 40, 45, 100, 30, 24, 24); que 4 semanas por mes es un supuesto; que el riesgo y la revisión que di son los que corresponden a mi negocio.

### 6.4 El primer paso, resuelto (un segundo prompt corto)
Pedidos **totalmente inventados** (no son de ningún negocio ni cliente):
> Pedido 1: dos poleras M negras y una gorra, entrega viernes, paga al recibir.
> Pedido 2: una campera L, entrega sábado por la mañana, ya pagó.
> Pedido 3: tres pares de medias, entrega lunes, paga al recibir.
> Pedido 4: una polera S blanca y una cartera, entrega viernes por la tarde, ya pagó.
> Pedido 5: dos gorras, entrega sábado, paga al recibir.

Prompt: *«Ordená estos pedidos inventados en una tabla con columnas: pedido | productos | cantidad | entrega | pago. No inventes datos; si algo no está, escribí "falta". Al final contá cuántos pedidos pagan al recibir.»*
Resultado esperado y verificado a mano: 5 filas; **productos por pedido:** 1 → 2 poleras + 1 gorra (3 unidades), 2 → 1 campera, 3 → 3 pares de medias, 4 → 1 polera + 1 cartera (2), 5 → 2 gorras; **pagan al recibir:** pedidos 1, 3 y 5 = **3**; ya pagaron: pedidos 2 y 4 = 2. La persona compara con su planilla, anota minutos con y sin ayuda y qué corrigió.

### 6.5 Dos casos de borde (también inventados)

**Caso sin candidata elegible.** Lista inventada: «responder reclamos por entregas» (4 × 25, riesgo alto), «recordar saldos pendientes» (2 × 20, riesgo alto) y «prometer fechas de entrega» (3 × 10, riesgo alto). Respuesta correcta del prompt: **«Sin candidata elegible»**: las tres son de riesgo alto. Qué falta: definir quién revisa antes de enviar (para bajar el riesgo) o sumar tareas de riesgo bajo o medio. Primer paso: esta semana, anotar tres tareas más que se repitan, con veces, minutos y riesgo. **Forzar una prioridad aquí puntúa 0 en la rúbrica.**

**Caso faltan datos.** Si a una tarea no se le dio el riesgo o si una persona puede revisar, la respuesta correcta es **«Faltan datos»** y preguntar, no suponer. (Ambos casos están en `pruebas/cuentas_workshop.py`.)

## 7. Rúbrica de autocontrol: lista, costo en tiempo, prioridad, primer paso

Cada criterio vale 0, 1 o 2. **No es un examen ni un certificado**: sirve para ver qué falta. **Concreta** = tiene verbo y objeto («pasar pedidos a la planilla») y se repite cada semana.

| Criterio | 0 | 1 | 2 |
|---|---|---|---|
| **Lista** (por tareas concretas) | **0 a 2** tareas concretas, o la mayoría vagas («atender clientes», «todo») | **3 o 4** concretas (en progreso); **9 o más** (hay que seleccionar antes de seguir); o 5 a 8 concretas **con alguna vaga** | **5 a 8** tareas, **todas** concretas |
| **Costo en tiempo** | Sin números en ninguna tarea | Números en alguna tarea, pero falta la cuenta completa en otras, o falta el supuesto de 4 semanas, o no se verificó a mano | **Todas** con veces × minutos = minutos por semana y por mes, supuesto dicho y **verificado a mano**; tiempo, no ahorro ni dinero |
| **Prioridad** | Ninguna, «todas», **más de una**, o **forzada cuando no había candidata** | **Una**, pero sin motivo de tiempo, riesgo y revisión; o «sin candidata» dicho sin decir qué falta | **Una sola** con motivo de tiempo, riesgo y revisión (y por qué no la más larga si es de riesgo alto); **o «sin candidata elegible» con qué falta o qué cambiaría** |
| **Primer paso** | Genérico («aprender IA») | Concreto, pero falta cuándo, medida, quién revisa o que los datos sean totalmente inventados | Qué, cuándo (esta semana), **datos totalmente inventados**, cómo se mide (minutos antes y después) y quién revisa |

Las categorías de **Lista** son exhaustivas y excluyentes: cualquier combinación de tareas y de tareas concretas cae en una sola (probado en `pruebas/cuentas_workshop.py` para 0, 2, 3, 4, 5, 8 y 9 tareas, 6 tareas con una vaga y 12 tareas).

**Lectura (autocontrol):** 7 a 8, lista para llevar; 4 a 6, completar el criterio más bajo; 0 a 3, repetir los pasos.

**Cinco respuestas puntuadas con las funciones de `pruebas/cuentas_workshop.py` (escritas por el autor, no por participantes):**

| Respuesta | Lista | Costo | Prioridad | Primer paso | Total |
|---|---|---|---|---|---|
| **A.** Tienda El Perchero (§6), 8 tareas | 2 | 2 | 2 | 2 | **8** |
| **B.** «1) Contestar precios: 10 × 5 = 50. 2) Pasar pedidos: 5 × 15 = 75. Prioridad: pasar pedidos, porque me da más pereza. Primer paso: probar una IA con pedidos.» | 0 (2 tareas) | 1 | 1 (sin motivo) | 1 (sin cuándo, medida ni quién revisa) | **3** |
| **C.** «Atender clientes, redes, facturas, todo. Quiero automatizar todo. Primer paso: aprender IA.» | 0 (vagas) | 0 | 0 («todo») | 0 | **0** |
| **D.** 3 tareas concretas, todas de riesgo alto; dice «sin candidata elegible», qué falta y un primer paso completo (§6.5) | 1 (3 concretas) | 2 | 2 | 2 | **7** |
| **E.** 4 tareas concretas semanales, cuenta completa, una prioridad con motivo, primer paso completo | 1 (4 concretas) | 2 | 2 | 2 | **7** |

La rúbrica cubre listas de 0, 2, 3, 4, 5, 8 y 9 tareas y el caso sin candidata. Los dos casos que antes no encajaban (D y E) ahora puntúan. **No se probó con participantes.**

## 8. Cuándo se complica (para el facilitador)

- **Cuenta con tiempos «de memoria»:** la gente subestima. Pedir que estimen con **un día reciente**, no con lo que «debería» llevar.
- **Error más común en la puesta en común:** confundir veces **por día** con veces **por semana**. Chequear cuántos días trabajan.
- **«Mi tarea es de riesgo alto pero es la que más me cuesta»:** correcto, no es la primera; puede ser el segundo paso más adelante. No prometer que se pueda automatizar.
- **Alguien pega datos reales o «con el nombre cambiado»:** parar con calma, repetir que eso **no los vuelve anónimos**, pedir un caso totalmente inventado. No leer en voz alta datos de clientes.
- **La cuenta de la persona y la de la IA no coinciden:** recalcular las dos con veces × minutos; puede estar mal cualquiera. No darle la razón a ninguna sin recalcular.
- **Ninguna tarea es elegible (todas de riesgo alto) o faltan datos:** no se elige. Se anota qué falta (§6.5). Es una respuesta válida, no un fracaso.
- **Si alguien no usa IA:** el ejercicio funciona igual a mano; el prompt es opcional.
- **50 personas:** no hay atención individual; el taller es método más puesta en común de 3 filas. **No se promete revisar la lista de cada una.**
- **Tiempos:** son de papel; no los cronometré con personas. En el primer ensayo con alguien externo, anotar cuánto toma cada paso y recortar el que sobre.

## 9. Continuidad (hipótesis separada, NO oferta)

**Idea:** *operar una tarea supervisada*, que podría pensarse **después** de que alguien ya hizo su auditoría y eligió una prioridad. Una tarea común, con entrada común, **revisión humana obligatoria** y un solo resultado revisable.
- **No se menciona en la apertura, ni en el cierre, ni en la página, ni en una oferta posterior.** El canon (§1 y §5) dice que no hay oferta posterior. Si alguien pregunta: «Hoy no hay nada después del taller. Este taller termina con tu primer paso».
- **No es** «manejar el negocio», ni un servicio, ni una promesa de implementación en 90 minutos.
- **Antes de pensarla como producto, hay que observar** (según la revisión de Hermes): utilidad real para quien la hizo; horas de soporte por persona; qué falla y quién lo detecta; si funciona sin que el autor la rescate. Ninguna de esas cosas está medida hoy.
- **Prueba mínima:** una tarea compartida, con un participante que no sea el autor, con datos inventados, midiendo minutos antes y después y los errores detectados. Hasta entonces: hipótesis.

## 10. Para dueños, no solo programadores

- Palabras que se usan: tarea, veces por semana, minutos, riesgo, revisar. Palabras que se explican si aparecen: «prompt» (la instrucción que le das a la IA), «asistente de IA» (una herramienta donde escribís y te responde).
- Nada del ejercicio pide programar ni instalar.
- El caso inventado es de **comercio**, a propósito: no es un rubro de salud; no se traslada ningún dato ni criterio de otro segmento.

## 11. Qué comprobé y qué no

| Comprobado, con archivo | No comprobado |
|---|---|
| Cuentas del caso y del canon; suma de la agenda (45 + 5 + 45 = 95): `pruebas/cuentas_workshop.py` + `.salida.txt` | Tiempos reales con personas |
| Regla de prioridad con casos de borde (sin candidata, datos faltantes, empate, un solo elegible, todas de riesgo alto) y reconciliación de cuentas discrepantes: `pruebas/cuentas_workshop.py` | Que el prompt se comporte así en alguna herramienta real (no se probó ninguna) |
| Rúbrica: exhaustiva y excluyente para 0, 2, 3, 4, 5, 8, 9 y 12 tareas, más cinco respuestas puntuadas (8, 3, 0, 7, 7) | Rúbrica con participantes |
| Texto contrastado con el canon: sin certificado, ahorro, resultados, grabación, plantilla, segunda fecha | Que a Sergio le sirva el tono; la apertura es una propuesta para ensayar |

**Decisiones que corresponden a Sergio:** si proyecta o comparte la hoja de §4 en vivo (no se promete como plantilla); si usa o no el prompt propuesto de §5 en el taller; el tono de la apertura. El canon, la fecha, el precio y los cupos no se tocaron.
