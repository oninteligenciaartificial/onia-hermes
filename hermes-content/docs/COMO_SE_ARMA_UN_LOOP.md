# Cómo se arma un loop de carril

> Doc vivo, sin fecha en el nombre: se EDITA, no se duplica.
> Escrito el **2026-09-01** después de mudar los loops de Windows al VPS. Todo lo que dice
> está medido: las trampas de abajo costaron vueltas perdidas, no son precauciones teóricas.

Un loop es **un carril trabajando solo**: cada tanto abre una sesión sin memoria, toma el
siguiente ítem de su cola, lo cierra con evidencia, commitea y se apaga.

---

## Lo primero, porque decide todo lo demás

**Un loop no piensa: come.** Su combustible es su cola. Sin cola, o se planta, o **inventa
trabajo** — y el trabajo inventado se midió en este repo: entre el **25% y el 46%** de lo que
las colas declaraban pendiente **no existía**.

Así que antes de escribir una línea de script: **¿este carril tiene una cola con ítems reales,
verificables, que un desconocido pueda mirar?** Si no la tiene, el loop no va a funcionar por
más bien construido que esté.

---

## Las dos capas

Un loop son **dos archivos**, y separarlos es lo que lo hace mantenible:

| Capa | Qué es | Dónde vive | Cambia cuando… |
|---|---|---|---|
| **El corredor** | Bash. Las barandas, el log, el lock, el timeout. **Uno solo para todos los loops.** | `/root/bin/onia-loop.sh` | …cambia la mecánica (rara vez) |
| **El prompt** | Markdown. Qué hace ese carril y qué tiene prohibido. **Uno por loop.** | `/root/bin/loops/<nombre>.md` | …cambia el trabajo (seguido) |

El corredor no sabe nada del carril; el prompt no sabe nada de bash. Un loop nuevo es **un
archivo `.md` + tres líneas en el `case` del corredor + una línea de cron**.

---

## El corredor — qué garantiza

```
cron ──► onia-loop.sh <nombre>
           │
           ├─ 1. carga secretos de .hermes/.env, y hace `unset ANTHROPIC_API_KEY`
           ├─ 2. flock: si la vuelta anterior sigue viva, ESTA NO ARRANCA
           ├─ 3. barandas ANTES de gastar una sesión:
           │      ¿existe el prompt? ¿existe el worktree? ¿está en la rama esperada?
           ├─ 4. claude -p --max-turns 120 --allowedTools "…" < prompt.md
           │      con `timeout` duro
           ├─ 5. compara HEAD antes/después → ¿commiteó? ¿quedó algo sin pushear?
           ├─ 6. si falló: avisa por Telegram, como mucho 1 vez cada 6 h por loop
           └─ 7. rota su propio log si pasa de 6.000 líneas
```

**Las tres que más importan y que casi nadie pone:**

- **`flock`.** Un loop horario que tarde más de una hora **se pisa a sí mismo** sobre el mismo
  árbol. Es el peor modo de falla que hay: dos sesiones editando los mismos archivos.
- **El `cd` verificado.** El guardián del VPS llevaba semanas *"diagnosticando"* desde `/root`
  porque su carpeta desapareció en un deploy y `set -uo pipefail` **sin `-e`** no lo frenó.
  Seguía corriendo, leyendo el home en vez del código, y su log sólo tenía la línea del error.
- **Avisar cuando se muere.** *Un monitor que se muere en silencio es peor que no tener
  monitor.* Pero avisar cada vuelta de lo mismo es ruido: **un aviso cada 6 h por loop**.

---

## ⚠️ Las cinco trampas que costaron vueltas perdidas

**1. `--allowedTools` es variadic y se come el argumento que le sigue.**
Pasar el prompt como argumento posicional después de los tools lo parte en "reglas" de permiso
basura (`Ignoring --allowedTools rule ...`) y **el permiso real queda en nada**.
→ Los tools van en **UNA cadena separada por comas**, y **el prompt entra por STDIN**.

**2. Sin redirigir stdin, `claude` se traga lo que quede en la entrada del shell que lo invocó.**
Corriendo dos loops seguidos por SSH, **el primero se comió el script del segundo** y la segunda
vuelta nunca ocurrió. → Siempre `< prompt.md`.

**3. Una `ANTHROPIC_API_KEY` en el entorno pisa la suscripción.**
Claude Code usa `/root/.claude/.credentials.json`. Si hay una API key en el env —y en
`.hermes/.env` hay una **vencida**— la usa a ella y falla.
→ `unset ANTHROPIC_API_KEY ANTHROPIC_TOKEN` antes de invocar.

**4. El cron del VPS es UTC; en Windows los horarios eran de La Paz (UTC−4).**
Copiar el horario tal cual corre el loop **cuatro horas antes**. → Traducir, y anotarlo en el
crontab para que la próxima sesión no lo "corrija" de vuelta.

**5. Editar el corredor EN CALIENTE le mueve el piso a la vuelta que está corriendo.**
Bash **no carga el script entero**: lo lee por **offset de bytes** a medida que avanza. Reescribir
el mismo inodo mientras hay una vuelta viva le hace ejecutar basura desde donde iba:

```
/root/bin/onia-loop.sh: line 157: l: command not found
```

Medido el 2026-09-02: se parcheó `onia-loop.sh` mientras `web-venta` corría. El agente ya había
terminado y **pusheado** —no se perdió trabajo—, pero el corredor **nunca escribió su línea
`TERMINA`, nunca soltó el `flock`, y quedó un proceso zombi** que habría bloqueado todas las
vueltas siguientes de ese loop. Hubo que matarlo y borrar el lock a mano.

⚠️ **Un `bash -n` en verde no protege de esto.** El archivo estaba perfecto; el problema era
editarlo en caliente.

→ **Instalá con [`scripts/loops/instalar.sh`](../../scripts/loops/instalar.sh)**, que escribe a un
temporal, corre `bash -n` sobre él y recién ahí hace `mv`. Un `mv` en el mismo filesystem es
**atómico**: el proceso que ya abrió el archivo se queda con el inodo viejo hasta terminar, y la
próxima vuelta arranca con el nuevo. Nadie lee un archivo a medio escribir.

**Y una regla de cordura:** el `timeout` tiene que ser **menor que el intervalo del cron**. Un
loop horario con tope de 50 min deja 10 de colchón; el `flock` cubre el resto.

---

## El prompt — la anatomía que funciona

Arranca **sin memoria de nada**. Todo lo que necesita está en el prompt o en el repo.

### 1. Identidad y objetivo, en dos líneas
Qué carril es y **cuál es su definición de hecho** — algo que se abre y se mira, no un commit.
Ejemplo real: *"que un desconocido escriba y esa conversación se vea en la bandeja"*.

### 2. El worktree, con ruta explícita
`git branch --show-current` **primero**. Si no es la esperada, **para y avisa**. Un carril = un
worktree = una rama.

### 3. Gate 1 — antes de tocar nada
¿Ya está hecho? ¿El bloqueo que asumo existe de verdad? ¿El dato sigue vigente?
**Verificar en vivo, no de memoria.** Un `grep` sirve para **descartar**, nunca para
**confirmar**. Si es una pantalla, se abre y se **mira**.

### 4. La escalera de agotamiento — lo que más se olvida

El prompt suele cubrir *"tomá el primer ítem"* y *"si la cola se vacía"*. **El estado real casi
siempre es otro: "Ahora" agotado y la cola llena.** Sin esta escalera, el loop escribe párrafos
que dicen "sigue igual" — uno de nuestros loops escribió **once**.

```
0. Bloqueado NO se re-mide. Movelo a "Bloqueado en Sergio" y seguí.
   (Antes, reverificá el bloqueo: uno VENCIDO es peor que un fantasma,
    porque le pide a Sergio una decisión que ya tomó.)
1. "Después". Si todos los de "Ahora" quedaron bloqueados, tu ítem es el primero de ahí.
2. Auditar los [x]. ¿El archivo que dice haber cambiado, cambió? ¿Sigue siendo cierto hoy?
3. Nada. Avisá en una línea y TERMINÁ SIN COMMITEAR.
   Una vuelta sin commit es un resultado válido. Commitear por commitear, no.
```

### 5. Las prohibiciones, explícitas
Corre sin nadie mirando: **no despliega · no mergea a `main` · no toca otro carril · no gasta
plata · no baja una superficie viva · no le escribe a un prospecto.**

Y la que evita el trabajo fantasma: **prohibido inventar una tarea que no está en su cola.**

### 6. Qué hacer con una decisión de Sergio
**Nunca se detiene.** La anota en `ONIA_RADAR_DECISIONES_PRODUCTO.md` —**el único lugar donde
se juntan**— con las opciones **cotizadas**, manda un aviso de una línea, y **sigue con el
próximo ítem desbloqueado**. Así Sergio decide **en tanda, una vez, sobre un archivo**, en vez
de contestar preguntas sueltas todo el día.

---

## Los dos oficios: consumidor y productor

Es la distinción que casi rompe nuestro sistema.

- **Consumidores** — comen de su cola. La mayoría.
- **Productores** — *fabrican* ítems de cola para otros.

Tuvimos **seis consumidores y cero productores**. El refill estaba documentado como *"lo hace el
cron de 10 minutos"* — y **ese cron no existía**. Por eso los carriles se secaban sin que nadie
se enterara.

El productor que lo arregló es el **canario visual**: abre las pantallas que ve un cliente, las
**mira**, y escribe cada diferencia como ítem `[ ]` en la cola del carril dueño, **con la
captura como evidencia**. Su combustible **no se agota**: la lista de pantallas es finita y se
renueva sola con cada deploy.

**Si armás un sistema de loops, armá al menos un productor.**

---

## Cómo agregar un loop nuevo

1. **Verificá que el carril tenga cola con ítems reales.** Si no, parás acá.
2. Escribí el prompt versionado en `scripts/loops/prompts/<nombre>.md`.
3. Agregá el `case` en `scripts/loops/onia-loop.sh`: worktree, rama, tope, turnos, tools.
   **Los dos archivos van al repo Y al VPS** — con `scripts/loops/instalar.sh`, nunca a mano
   (trampa 5). Si sólo lo ponés en el VPS, el próximo que reinstale desde el repo lo borra sin
   avisar; si sólo lo ponés en el repo, no corre nadie.
4. Creá el worktree en su rama: `git worktree add /root/loops/<...> <rama>`.
5. **Corrélo a mano una vez y leé el log entero.** Un cron escrito no es un cron que anda.
6. Recién ahí, la línea de cron — **escalonada**, en UTC.

⚠️ **El escalonado nominal es mentira si hay jitter.** Los nuestros estaban separados 2 minutos
en el cron, pero el jitter iba de 70 a **517 segundos** y los cuatro colapsaban en dos pares que
arrancaban en el mismo minuto. **Escalonar contra el minuto efectivo, no contra la expresión.**

---

## Cómo se audita si un loop sirve

**No sirve porque corrió. Sirve si su salida acerca su carril a su definición de hecho.**

Un loop que corre 14 veces y deja 14 commits de *"verifiqué que sigue estando bien"* **no
sirve**: quema tokens para producir la misma frase. Uno que corre 3 veces y arregla un bug que
cobraba de más, sirve.

Para auditarlo: **abrí 3 o 4 de sus commits y miralos.** La pregunta no es cuántos hizo, es
**qué cambió**. Contar commits mide actividad; abrirlos mide valor.

Con ese criterio apagamos dos de seis: uno tuvo **7 de 8 corridas en no-op y cero rastro en el
repo en 48 h**; el otro corrió una vez y competía por el mismo plato con un hermano 288 veces
más rápido.

---

## Dónde vive cada cosa

| Qué | Dónde |
|---|---|
| El corredor | `/root/bin/onia-loop.sh` (VPS) |
| Los prompts | `/root/bin/loops/<nombre>.md` (VPS) |
| Los logs | `/var/log/onia-loop-<nombre>.log` |
| Los worktrees | `/root/loops/<repo>-<carril>` |
| La lista de qué loops deben existir | `hermes-content/docs/cola/loops.md` |
| **Quién hace qué oficio, y su zona** | `hermes-content/docs/cola/EQUIPO.md` |
| El instalador atómico | `scripts/loops/instalar.sh` |
| La doctrina y los modos de falla | `hermes-content/docs/cola/README.md` |
| Las colas | `hermes-content/docs/cola/<carril>.md` |
| Las decisiones que esperan a Sergio | `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` |

---

## Lo que no se puede auto-curar, dicho de frente

- Si **todos** los loops pierden el registro a la vez, no queda nadie adentro para notarlo.
- **Cómo lo nota una persona:** cero commits de carriles en varias horas.
- Y la que nos mordió: **los loops de Windows sólo corren cuando la app está quieta.** Si la
  sesión madre encadena trabajo, **nunca tienen ventana** — y no fallan, no avisan, no dejan
  rastro. Simplemente no corren. Por eso se mudaron al VPS.
