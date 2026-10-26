# Las colas — un carril, un objetivo, una pantalla que lo prueba

> 🗄️ **HISTORIA desde el 26-oct-2026.** Ya no hay madre ni colas por carril: la cola única son los issues `orquesta` (`AGENTS.md` §1, `hermes-content/docs/ONIA_HARNESS.md`). Lo de abajo no es un encargo ni da permisos. En `cola/` quedan solo los archivos que todavía lee algo (gates de `npm test`, el resumen de Hermes del VPS, su SOUL o prompts de loops): `chatbot.md`, `plataforma-v1.md`, `loops.md`, `tandas-v1.json`, `recorrido-cliente.md`, `EQUIPO.md`, `TABLERO.md`, `tendencias.md`, `marca-personal.md`, `drops/`, `plan-3-semanas/`, `lucia-diario/` y `loop/`. Esperan aparte `GUIONES-PARA-GRABAR-2026-09-29.md` y `AUDITORIA-8-CARRUSELES.md` (los nombra un script) y `LEARNINGS-APROBADOS-MARCA-PERSONAL.md` (falta pasarlo a su skill). Lo fechado de septiembre pasó a `historial/cola/` el 26-oct.

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

~~Mergear a `main` con los tres gates en verde (Sergio, 2026-08-29). Avisar después, no antes.~~ **Ya no vale:** `main` avanza solo por PR revisado (`AGENTS.md` §6, desde el 5-oct).

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
> correctamente vale tanto como uno construido. El patrón salió de
> `cerrar-y-revisar-web-factory`, que hoy está apagado porque su hermano lo absorbió: **ya está
> escrito como "escalera" dentro de los cinco prompts activos**, no hay que copiarlo de ningún
> lado.

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
avisa — se descubrió por casualidad al listarlos.

> **Arreglo: los loops se curan entre ellos.** Ya no depende de que alguien se acuerde de mirar.
>
> Existe la lista versionada [`loops.md`](loops.md) — **la fuente de verdad de qué loops deben
> existir**, con su `id`, su `cron` y para qué sirve cada uno. Antes existía sólo dentro de la
> app: si se perdía, no había contra qué comparar.
>
> Y **cada loop activo, al arrancar y antes de trabajar**, lista las tareas programadas, las
> compara contra ese archivo y **rearma la que falte** (el `SKILL.md` sigue en disco, así que sale
> barato), avisando con un `PushNotification` de una línea. Si todo está bien no genera ni una
> línea de salida, y **no reemplaza su vuelta**: es un chequeo de arranque.
>
> **El bloque está pegado idéntico en los CINCO loops activos, y la redundancia es a propósito:**
> mientras quede **UN** loop registrado, el conjunto se recompone solo. Sacarlo de cuatro para
> "no repetir" convierte cinco redes en una sola. Por eso el propio bloque lleva escrito adentro
> que no se optimice.
>
> Un loop **nunca se re-registra a sí mismo** (si está corriendo, está registrado) ni rearma los
> dos **apagados a propósito** — ésos están en `loops.md` con su motivo medido, y revivirlos sería
> desobedecer la decisión.

**Lo que esta auto-cura NO puede curar** — y no se tapa, se escribe:

- **Si se pierden TODOS los registros a la vez, esto no se recupera solo.** No queda ningún loop
  adentro para notarlo. La red se recompone desde uno, no desde cero.
- **Si la máquina está apagada, ninguno corre.** Los 18 crons del VPS sí siguen; éstos no, porque
  viven en la app de Claude Code de la máquina de Sergio.

> **Cómo lo nota una persona:** no aparecen commits nuevos de los carriles en varias horas
> (`git log --all --since="6 hours ago" --oneline`), y ninguna notificación de loop llegó. Un
> carril vivo commitea o avisa; el silencio de los dos a la vez es la señal.
>
> **Cómo se rearma:** los `SKILL.md` están todos en `C:\Users\PC\.claude\scheduled-tasks\<id>\`.
> Se re-registran uno por uno desde la tabla de [`loops.md`](loops.md) (`id` + `cron`, y como
> prompt el cuerpo del `SKILL.md` sin el frontmatter). Con que vuelva **uno**, ese rearma al resto
> en su próxima vuelta.

### Los que están puestos

**La lista vive en [`loops.md`](loops.md), y ése es el único lugar donde se edita.** Acá no se
copia la tabla: dos copias de los mismos `cron` es exactamente cómo se llega a decir un horario
que no existe. Este archivo explica el **porqué**; `loops.md` es la **lista** contra la que los
loops se comparan al arrancar.

**Hoy son cinco activos** — `chatbot-cola`, `onia-cola`, `contenido-cola`, `canario-visual` y
`web-factory-dev-loop` — con los horarios **escalonados a propósito**: comparten CPU y disco, y
dos loops sobre el mismo árbol se pisan.

> ⚠️ **Corregido el 2026-08-31 (segunda pasada).** Acá decía "los seis que están puestos" con una
> tabla de cadencias tipo `3,23,43`, y **ninguna** de esas seis líneas coincidía con lo registrado
> en vivo: los cron reales son otros, `canario-visual` faltaba entero, y dos de los seis ya
> estaban apagados. Es la **segunda** corrección del mismo párrafo en el mismo día — por eso ahora
> la lista está en un solo archivo y ésta es una remisión, no una copia.

**Y dos apagados a propósito el mismo día**, con su motivo medido —el detalle está en
`loops.md`—. Se documentan, **no se borran**: sus `SKILL.md` siguen en disco por si Sergio los
quiere de vuelta, y **ningún loop los rearma**.

- **`web-factory-salud`**: 7 de 8 corridas fueron no-ops y no dejó rastro en el repo en 48 h. Sus
  4 chequeos son los mismos que `web-factory-dev-loop` ya corre 3× más seguido, y los absorbió.
- **`cerrar-y-revisar-web-factory`**: corrió una vez, no tocó el repo, y competía por el mismo
  plato con un hermano 288× más rápido, en el mismo árbol y la misma rama.

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
