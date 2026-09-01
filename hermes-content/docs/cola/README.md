# Las colas — un carril, un objetivo, una pantalla que lo prueba

> **Por qué existe esta carpeta.** El 2026-08-31 se midió: **349 commits repartidos en 5 ramas
> y ninguno en `main`**. El trabajo estaba hecho y no llegaba a ningún lado. La sensación de
> "no avanzamos" no venía de los loops ni de las sesiones: venía de que nada converge.

## El norte de todos los carriles (Sergio, 2026-08-31)

**Terminar el producto antes de vender.** Los cuatro puntos que faltan —y por qué esos y no
otros— están en [`../ONIA_DEFINICION_DE_TERMINADO.md`](../ONIA_DEFINICION_DE_TERMINADO.md).
Sólo entra ahí lo **roto** o lo **falso**; el resto vive en la cola de su carril.

**Ningún carril le escribe a un prospecto hasta que esa lista esté cerrada.**

## La regla, en una línea

**Un carril = un objetivo = una cola = una pantalla que un desconocido puede ver.**

Si el "hecho" de un carril es un commit, un render o un doc, está mal escrito. Tiene que ser
algo que se abre y se mira.

## Los carriles

**Cada carril ya tiene su cola. Este archivo no las reemplaza: dice dónde están.** Se leyó cada
una el 2026-08-31 antes de escribir esto — crear colas nuevas encima habría sido el mismo error
de reescribir en vez de lanzar.

| Carril | Su cola vive en | Objetivo, en sus propias palabras | Hecho = |
|---|---|---|---|
| **Contenido** (Lucía, @oniahq, marca personal) | `hermes-content/docs/cola/contenido.md` *(rama `claude/ads-creatividades-publicos`)* | *"pasar de 0 posts a un feed vivo publicando lo que YA existe. No se produce nada nuevo hasta que haya algo publicado"* | Se abre Instagram y se ven los posts |
| **Web Factory** (webs de cliente, dashboard) | `web-factory/docs/LOOP_COLA.md` *(rama `claude/onia-web-architecture-b37eca`)* | *"convertir el catálogo de técnicas verificado en webs y dashboard reales de Onia… conectados a Onia Platform (form → lead)"* | La URL abre para un desconocido y hay una fila en el pipeline |
| **Chatbot** (motor, guion, WhatsApp, bandeja) | `hermes-content/docs/cola/chatbot.md` ✅ escrita el 2026-08-31 | *"que un desconocido escriba y esa conversación se vea en la bandeja"* | Se abre `/inbox` con la sesión del dueño y hay una conversación de una persona que no somos nosotros |
| **Producto / plataforma** | `hermes-content/docs/COLA.md` | **`main` integrado y desplegado** | `app.onia.com.bo` sirviendo el `main` de hoy |

**Tres carriles adoptaron la regla de evidencia por su cuenta**, sin que nadie la impusiera. Y
cuando se corre, siempre encuentra lo mismo:

| Carril | Fantasmas |
|---|---|
| Chatbot | **7 de 15** (46%) |
| Producto | 4 de 6 |
| Web Factory | 3 de 11 |

No es una teoría: **entre un cuarto y la mitad del trabajo declarado pendiente no existe.** El
peor caso del carril chatbot es el que más enseña — el mismo archivo cerraba una pieza como
hecha y, más abajo, la repetía como pendiente.

## Cómo se trabaja una cola

1. **Un ítem por vuelta**, el primero no bloqueado de "Ahora".
2. **Gate 1 antes de tocar nada:** ¿ya está hecho? ¿el bloqueo existe? ¿el dato sigue vigente?
   Verificar **en vivo**, no de memoria. Un `grep` sirve para **descartar**, nunca para
   **confirmar**.
3. **Nada entra a "Ahora" sin evidencia de que existe.** Y no es una regla de honor:

   ```bash
   node scripts/verificar_cola.js hermes-content/docs/cola/<carril>.md
   ```

   Falla con exit 1 si un ítem de "Ahora" no nombra una ruta real. Nace de un dato medido: en
   una sesión, **4 de 6 pendientes eran fantasma**. Una cola con fantasmas es peor que no tener
   cola, porque se planifica el día sobre trabajo que no está.
4. **Gates completos donde haya código: `tsc --noEmit` + `vitest` + `eslint`.** Los tres. Saltear
   lint rompió CI dos veces el 2026-08-29.
5. Si toca pantalla, **se abre y se MIRA**. Un 200 no es verificación.
6. Al cerrar: `[x]`, una línea de qué quedó, commit explicando el **porqué**.

## Lo que ningún carril hace

- Desplegar al VPS sin OK de Sergio.
- Tocar worktrees o ramas de **otro** carril. Sólo 7 archivos de ~900 se pisan entre ramas
  (medido el 2026-08-31) — si tocás algo fuera de tu carpeta, parás y avisás.
- Bajar o apagar una superficie viva.
- Gastar plata.

## Lo que sí está pre-autorizado

Mergear a `main` con los tres gates en verde (Sergio, 2026-08-29). Avisar después, no antes.

## Los loops — cómo se ponen para que trabajen sin que Sergio promptee

Un loop es **un prompt guardado en disco con un horario**. Cuando llega la hora y la app está
quieta, Claude Code abre una sesión nueva, corre ese prompt y la cierra. **Arranca sin memoria
de ninguna conversación**: todo lo que necesita tiene que estar en el prompt o en el repo. Por
eso no se ve en el administrador de tareas — no es un proceso de Windows. Su rastro son los
commits y las notificaciones.

Viven en `C:\Users\PC\.claude\scheduled-tasks\<nombre>\SKILL.md`, y se ven en la barra lateral
de la app, sección **Scheduled**.

### Las tres cosas que obligan a Sergio a promptear, y su arreglo

**1. La cola se queda sin trabajo decidido.** Un loop sin combustible o se planta o inventa — y
lo que inventa es el trabajo fantasma que ya medimos al 40%.

> **Arreglo: el loop nunca inventa, pero tampoco se planta.** Si la cola se vacía, su tarea de
> respaldo es **auditar los `[x]` más recientes**: ¿el archivo que dice haber cambiado, cambió?
> ¿lo que afirma sigue siendo cierto contra el código de hoy? Un ítem fantasma cerrado
> correctamente vale tanto como uno construido. El loop `cerrar-y-revisar-web-factory` ya lo
> hace así — es el patrón a copiar.

**2. Se topa con una decisión de Sergio.** Si para y espera, muere ahí.

> **Arreglo: nunca se detiene por una decisión.** La anota en
> `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` —**el único lugar donde se juntan**—
> con las opciones **cotizadas** (qué cuesta cada una, qué desbloquea), manda un
> `PushNotification` de una línea, y **sigue con el próximo ítem desbloqueado**.
>
> Así Sergio contesta **en tanda, una vez**, sobre un archivo — en vez de responder preguntas
> sueltas desparramadas en el chat. Ésa es la diferencia entre promptear todo el día y decidir
> una vez.
>
> ⚠️ Ese archivo existe desde el 2026-08-17 y estuvo **cuatro días sin actualizarse** mientras
> las decisiones se acumulaban en conversaciones. Ahí se rompió el circuito.

**3. El registro del horario se pierde.** Medido el 2026-08-31: al cerrar las sesiones, los
`SKILL.md` **sobreviven en disco** pero quedan **desregistrados**. Los loops no corren y nada
avisa.

> **Arreglo: verificarlo, no asumirlo.** Al abrir una sesión de control, listar las tareas
> programadas. Si la lista está vacía y los archivos están, rearmarlas — el prompt ya está
> escrito, sale barato. **Nunca decir "el loop está corriendo" sin haberlo mirado.**

### Los seis que están puestos

> ⚠️ **Corregido el 2026-08-31 — acá decía "los cuatro que están puestos" y era falso.**
> Contados en vivo con `list_scheduled_tasks`: son **seis**, los seis `enabled`, y los seis
> con `lastRunAt` dentro de la hora. Faltaban `chatbot-cola` y `contenido-cola`.
> Peor todavía, más abajo este mismo archivo afirmaba que *"el carril chatbot no tiene loop
> porque no tiene cola"* — cuando su cola se escribió ese mismo día y la tabla de arriba ya
> la listaba con un ✅. **El archivo se contradecía a sí mismo con seis líneas de distancia.**
>
> El peligro de dejarlo: quien lea esto para saber qué corre solo, no encuentra dos loops que
> SÍ corren, y o los duplica o le da por muerto un carril que está trabajando.

| Loop | Cadencia (cron) | Qué hace |
|---|---|---|
| `chatbot-cola` | `3,23,43` | Carril chatbot: su cola hasta que un desconocido escriba y se vea en la bandeja |
| `onia-cola` | `7,27,47` | Carril producto: salud, integrar a `main`, y la cola de plataforma |
| `contenido-cola` | `9,29,49` | Carril contenido: publicar lo que YA existe hasta que el feed esté vivo |
| `web-factory-dev-loop` | `13,33,53` | Construye la siguiente tarea de `LOOP_COLA.md` |
| `web-factory-salud` | `21` | Server, git y gates del carril web |
| `cerrar-y-revisar-web-factory` | `17 7` diario | Termina lo que quedó a medias **y audita lo dado por hecho** |

Los cinco horarios están **escalonados de a 2 minutos a propósito**: comparten CPU y disco, y
dos loops sobre el mismo árbol se pisan.

### Lo que el loop deja, y lo que se pierde

Medido el 2026-08-31, y es el hueco que queda abierto:

- **Lo que sobrevive: lo que toca el repo.** Commits, colas tachadas, docs corregidos. Eso lo
  lee cualquier sesión después.
- **Lo que se evapora: el razonamiento.** Cada loop corre en su propia sesión sin memoria, y
  su informe —el porqué, lo que descartó, lo que midió— queda en esa sesión. La sesión madre
  **no se entera solo**: tiene que ir a leerlo.

> **Por eso un loop que arregla algo y no lo escribe en su cola o en un doc, trabajó a medias.**
> El commit prueba QUÉ cambió; el `[x]` con su línea de porqué es lo único que evita que el
> próximo loop lo vuelva a investigar desde cero.

### Lo que un loop NO hace, nunca

Desplegar al VPS sin OK. Tocar otro carril. Gastar plata. Bajar una superficie viva. Decidir
algo que le toca a Sergio. **Inventar una tarea que no está en su cola.**
