# Serie de TikTok — "Convertí mi PC en un empleado que no duerme"

> Material capturado el **2026-09-04** montando el tercer nodo de Onia en la PC de casa.
> Todo lo de acá **pasó de verdad**, con su hora y su error textual. No hay nada guionado.

---

## 0. Antes que nada: en qué cuenta va

**NO va en `@oniahq`.** La regla de `hermes-content/contenido/README.md` es explícita:

> *"Si la pieza le sirve igual a alguien que nunca te va a comprar, no va en @oniahq.
> Va en Lucía."*
>
> ⛔ Prohibido en @oniahq: *"contenido genérico de IA o tecnología que no termina en el
> negocio del que mira"*.

Una serie sobre montar un nodo de agentes le sirve a un estudiante de Bogotá igual que a
un dueño de clínica en Santa Cruz. Publicarla ahí **le enseña al algoritmo a mostrarle
Onia a curiosos de IA**, y eso no se deshace después.

**Candidatas reales:** la cuenta personal de Sergio + la comunidad (es lo que ya gestiona
el loop `marca-personal`), o Lucía.

⚠️ **Decisión de Sergio.** Si adopta la serie, su lugar definitivo es el archivo de esa
cuenta en `hermes-content/contenido/`. Este doc es el plan, no el calendario.

---

## 1. Por qué esta serie funciona: el material es el fracaso

La tentación es mostrar el final: *"mirá, mi PC trabaja sola"*. **Eso no retiene a nadie
—** hay mil videos así y todos parecen mentira.

Lo que nadie publica, y es lo único que se recuerda: **las nueve cosas que se rompieron**,
cada una con su error en pantalla y su lección de una línea.

> **Regla de la serie: un episodio = un error real = una lección que el que mira puede
> usar mañana, aunque nunca monte un servidor.**

Y cada error trae un principio que se aplica fuera de la terminal. Ese es el gancho: no
enseñás Linux, enseñás **cómo pensar cuando algo falla**.

---

## 2. Los episodios, en orden de fuerza

### 📌 EP 1 — "Un carácter separa 'agregar' de 'borrarlo todo'"

**El momento:** para dejar entrar la PC al servidor había que agregar una línea al archivo
de llaves autorizadas. `>>` agrega. `>` **borra el archivo entero** — incluida la llave con
la que estás conectado en ese instante.

**Qué mostrar:** los dos símbolos grandes en pantalla, uno al lado del otro. La sesión SSH
abierta que **no se cierra hasta verificar**. El respaldo hecho antes de tocar.

**La lección:** *antes de tocar algo irreversible, dejá abierta la puerta por la que
entraste.* Sirve para un servidor, para una base de datos y para renunciar a un trabajo.

**Gancho:** "Este comando me podía dejar afuera de mi propio servidor para siempre. La
diferencia es un carácter."

---

### 📌 EP 0 — "El error que no deja error" ⭐⭐ *el mejor de todos — abre la serie*

**El momento:** a las 23:54 una tarea tenía que arrancar. **No arrancó.** Y no hubo
error, ni log, ni aviso. Nada. Porque **un programa que no arranca no genera ninguna
señal** — se ve exactamente igual que uno que todavía no le tocó.

La única pista fue **notar que faltaba un archivo**.

**Qué mostrar — esto es una historia de detectives, y se cuenta como tal:**

1. La carpeta de logs: cuatro archivos, y uno que debería estar y no está.
2. **El testigo.** Otra tarea corría *cada hora*. Sus registros: `22:52 · 23:52 ·
   00:52 · 01:52` — **cuatro de cuatro, sin fallar una**. Eso mata dos sospechosos
   de un tiro: la máquina no estaba dormida, y el programador no estaba muerto.
3. Los tres sospechosos descartados en pantalla, tachándolos: *¿se suspendió la
   máquina?* → `uptime: 6 horas`. *¿el candado?* → es uno por tarea, no compartido.
   *¿faltaba algo?* → corrida a mano, arranca perfecto.
4. **El culpable.** Dos comandos, lado a lado:

   ```
   servidor:   Etc/UTC
   mi PC:      America/Caracas  (−04)
   ```

   El programador **interpreta los horarios en la hora local de cada máquina**. Las
   mismas líneas, en dos husos, son dos horarios distintos. **Todo estaba corrido
   cuatro horas.**

5. El detalle que remata: una de las tareas prepara algo *"con dos horas de colchón"*.
   Corrida cuatro horas, **lo preparaba después de necesitarlo**.

**La lección:** *cuando algo no falla pero tampoco pasa, buscá un testigo — algo
parecido que sí funcione. La diferencia entre los dos es la respuesta.*

**Gancho:** "Una de mis tareas automáticas no corrió. No dio error. No dejó log. No
avisó. Así la encontré."

*(Y el chiste final: la PC está en Bolivia y Windows le había puesto **Caracas**.)*

---

### 📌 EP 2 — "Verificar no es contar" ⭐ *el mejor de la serie*

**El momento:** después de agregar la llave, el control era *"¿hay 4 líneas?"*. **Dio 4.
Todo verde.** Pero al mirar el contenido, dos llaves habían quedado **pegadas en el mismo
renglón** — porque el archivo no terminaba en salto de línea. El servidor leía una sola.

**El conteo dio exactamente el número que yo mismo había dicho que buscara. Y estaba mal.**

**Qué mostrar:**
1. `wc -l` → `4` ✅ (verde, todo bien)
2. `tail -1` → las dos llaves pegadas 🔴
3. La herramienta correcta: `ssh-keygen -lf`, que **lee el archivo con el mismo parser
   que SSH** y lista cada llave que reconoce.

**La lección:** *un número que coincide no prueba nada. Verificar es mirar el contenido, y
mejor con la misma herramienta que lo va a usar.*

**Gancho:** "Mi verificación dijo que todo estaba bien. Estaba roto. Te muestro por qué."

---

### 📌 EP 3 — "Un mensaje de Telegram podía ejecutar comandos en mi servidor"

**El momento:** el aviso del instalador fallaba con `syntax error near unexpected token '('`.
Parecía un problema tonto de formato. **No lo era.**

`ssh` no manda argumentos separados: **pega todo en una cadena que el otro lado vuelve a
interpretar como comando.** El mensaje llevaba `<code>` y `(5 loops)` y explotaba allá.

Pero el mismo canal lo usa `onia-aprender.sh`, que recibe **texto libre escrito por un
modelo**. Un texto con `` `id` `` o `$(...)` **se habría ejecutado en el servidor de
producción**.

**Qué mostrar:** el `syntax error` en pantalla → la línea del shim sin comillas → la prueba
con `` `id` `` fallando y después, con el arreglo, **entrando como texto y no como comando.**

**La lección:** *un bug de formato y un agujero de seguridad son a veces el mismo bug. El
que se ve es el barato.*

**Gancho:** "Un emoji rompió mi instalador. Investigando por qué, encontré que cualquiera
podía ejecutar comandos en mi servidor."

---

### 📌 EP 4 — "El cron perfecto que nunca corre"

**El momento:** el programa quedó agendado, impecable. Falló en el primer disparo:

```
no existe el worktree /root/loops/onia-hermes-webfactory
```

El instalador creaba la carpeta con un nombre. El que la buscaba usaba otro. **La misma
tabla escrita en dos archivos.**

**Qué mostrar:** las dos rutas casi idénticas en pantalla, con la diferencia resaltada. Y
el arreglo: que un archivo **lea** el dato del otro en vez de repetirlo.

**La lección:** *el mismo dato escrito en dos lugares no está duplicado: está esperando
desincronizarse.*

**Gancho:** "Mi tarea automática estaba perfecta y no hizo nada durante horas. El cron
estaba intacto."

---

### 📌 EP 5 — "5,4 GB de RAM para copiar 4 megas"

**El momento:** la PC se trabó entera. El script copiaba unos pocos archivos… pero para
hacerlo **descomprimía el proyecto completo (5,4 GB) en `/tmp`**. Y en WSL `/tmp` es un
disco falso que vive **en la memoria RAM**, de exactamente 5,4 GB. Se llenó al ras.

**Qué mostrar:** `df -h /tmp` diciendo `5.4G`, el administrador de tareas de Windows
saturado, y después el arreglo: `4,2 MB` y `0 segundos`.

**La lección:** *"funciona en el servidor" no es "funciona". El mismo comando en otra
máquina toca otro hardware.*

**Gancho:** "Copiar 4 megas me comió 5 gigas de RAM. La culpa no era del archivo."

---

### 📌 EP 6 — "El paracaídas que se rompía al abrirse"

**El momento:** el script tenía un camino de rescate para cuando algo fallaba. Y ese
camino **usaba una variable que se creaba 20 líneas más abajo**. Con `set -u`, eso no
avisa: mata el script.

**El código escrito para salvar la situación era el único que no se podía ejecutar.**

**Qué mostrar:** las dos líneas con sus números —el uso en la 54, la creación en la 66— y
el mensaje `RAMA: unbound variable`.

**La lección:** *un camino de error que nunca se ejecutó no es una red de seguridad. Es
código sin probar con la etiqueta de seguro puesta.*

**Gancho:** "Mi script tenía un plan B. El plan B tenía un bug. Nunca lo había ejecutado
nadie."

---

### 📌 EP 7 — "Mi PC de 16 GB veía 7"

**El momento:** Linux dentro de Windows arranca reservándose **la mitad** de la RAM. No es
un error: es cortesía de fábrica para que Windows no se arrastre. Se cambia con un archivo
de tres líneas.

**Qué mostrar:** `free -g` diciendo `7`, el archivo `.wslconfig`, y `free -g` diciendo `10`.

**La lección:** *los valores por defecto son la opinión de otro sobre tu caso.*

---

### 📌 EP 8 — "Administrador no es lo mismo que dueño"

**El momento:** instalé la herramienta con mi usuario y me logueé. Después descubrí que el
que la iba a ejecutar era **`root`, que es otro usuario con otra casa, otro PATH y otras
credenciales**. No veía nada de lo mío.

**Qué mostrar:** los dos prompts, `$` y `#`, y las dos rutas distintas de la misma
herramienta.

**La lección:** *antes de instalar algo, preguntate quién lo va a ejecutar. Casi nunca sos vos.*

---

### 📌 EP 9 — "El 403 que no era permiso"

**El momento:** `wsl --install` → `Prohibido (403)`. Suena a "no tenés permiso". Era la
tienda de Microsoft rechazando la descarga.

**La lección:** *el mensaje de error describe el síntoma, casi nunca la causa.*

Es el episodio más flojo — bueno como pieza suelta, no como parte de la serie.

---

## 3. Qué mostrar en pantalla, concreto

**Lo que hace que se vea real:**
- **La terminal con el error en rojo, sin recortar.** El error textual es la prueba.
- **El reloj.** `22:52:01Z` disparándose solo en su horario exacto es el clímax de la serie.
- **El antes y el después medidos:** `5.4G → 4.2M`, `7 → 10`, `1 rojo → 12 verdes`.
- **El momento del `TODO VERDE`** después de tres arreglos. Ese es el final del EP 10.

**Lo que NO se muestra nunca:**
- 🔒 La **IP del servidor** (aunque salga en los logs — se difumina).
- 🔒 Cualquier **huella de llave**, aunque sea pública.
- 🔒 El contenido de `.env`, ni siquiera los **nombres** de las variables.
- 🔒 El nombre de usuario del servidor.

*(Se puede rehacer la escena en una máquina de prueba con IP inventada. Es más trabajo y
es lo correcto.)*

---

## 4. Formato

| | |
|---|---|
| **Duración** | 45-70 s. El EP 2 aguanta 90 |
| **Estructura** | Gancho (3 s) → el error en pantalla (10 s) → por qué pasa (20 s) → el arreglo (15 s) → la lección fuera de la terminal (10 s) |
| **Cierre** | La lección, **nunca** "seguime para más" |
| **Orden** | **0** → 2 → 3 → 1 → 4 → 5 → 6 → 8 → 7 → 9. Se abre con el más fuerte |
| **Cadencia** | 2 por semana. Hay para 5 semanas |

**El EP 0 y el EP 2 son la misma idea vista de dos lados**, y por eso van juntos al
principio: uno muestra una verificación que dio verde estando rota, el otro un fallo
que no dejó ninguna huella. Los dos dicen lo mismo — **la ausencia de error no es
evidencia de que algo funcione** — y es la idea más transferible de la serie.

**El sistema visual sale de la landing real**, no se inventa: ver la regla de tipografía en
`scripts/loops/prompts/marca-personal.md:178` (Archivo variable con pesos medios, micro
etiquetas Geist Mono; **prohibido** black 900 y condensed).

---

## 5. La honestidad como formato

Esta serie no muestra a alguien que sabe. Muestra a alguien **arreglando en vivo**, y eso
es lo que la separa del resto.

Momentos que **hay que dejar adentro**, no cortar:
- La verificación que dio verde y estaba mal (EP 2).
- La instrucción mal escrita que hizo pisar un archivo de configuración.
- Los **tres diagnósticos perdidos** por medir con un instrumento contaminado.
- La hipótesis equivocada sobre `git archive`, que costó dos intentos.
- El arreglo que **habría roto el deploy** y se pilló leyendo el código antes de commitear.

> **Lo que se enseña no es Linux: es qué hacer cuando algo falla y no sabés por qué.**
> Eso le sirve a todo el mundo, y es exactamente por lo que esta serie **no puede ir en la
> cuenta que vende**.

---

## 6. Lo que sigue sin resolver

- **En qué cuenta va** (Sergio decide) y si merece archivo propio en `contenido/`.
- **Cómo se graba lo que ya pasó.** El material existe como logs y capturas de esta
  sesión, no como video. Hay dos vías: rehacer la escena en una máquina limpia, o
  reconstruirla con capturas de terminal animadas.
- **Si Sergio aparece en cámara** o es sólo pantalla + voz.
- **Los 9 episodios asumen que el nodo termina funcionando.** Al escribir esto todavía
  faltaba el arranque automático de WSL — si eso se complica, hay un **EP 10** mejor que
  todos: *"lo instalé, dio todo verde, y no corría"*.
