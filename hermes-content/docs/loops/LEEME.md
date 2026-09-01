# Loops de este carril

Escritos con la anatomía de `hermes-content/docs/COMO_SE_ARMA_UN_LOOP.md`: identidad y
**definición de hecho**, worktree explícito, gate 1, **escalera de agotamiento**, prohibiciones,
y qué hacer con una decisión de Sergio (anotarla en el radar y **seguir**, nunca frenar).

| Archivo | Corre en | Estado |
|---|---|---|
| `ugc-lucia.md` | VPS (`onia-loop.sh`) | listo para desplegar |

## 🔴 Por qué el trabajo de Higgsfield NO está acá

El carril se partió por **lo que cada mitad necesita**, no por tema:

| Mitad | Dónde corre | Por qué |
|---|---|---|
| Creativos, captions, CTA, gates, verificación | **VPS** | Sólo necesita repo + node + git, y los tres ya están ahí |
| **Generar imágenes y video de Lucía** | **La sesión con el Chrome de Sergio** | El VPS no tiene navegador. Loguear su cuenta desde una IP de datacenter mientras él la usa desde casa invita a un bloqueo por acceso sospechoso — y la cuenta **ya arrastra un cobro fallido**. No se arregla con más esfuerzo: es dónde vive la sesión del navegador |

## 🔴 Y por qué un cron en Windows casi no sirve

Medido el 01-sep: de los 5 commits del día, **los 5 salieron de trabajo en sesión**, ninguno de
una corrida de cron. `COMO_SE_ARMA_UN_LOOP.md` ya lo advertía:

> «los loops de Windows sólo corren cuando la app está quieta. Si la sesión madre encadena
> trabajo, nunca tienen ventana — y no fallan, no avisan, no dejan rastro.»

O sea que mantener un cron horario en Windows **mientras la sesión trabaja** es teatro. Por eso
la mitad automatizable se escribe acá para el VPS, y la mitad de navegador se hace **a mano en
sesión**, sin fingir que un cron la cubre.

## Antes de desplegarlo — lo dice el doc, no yo

1. Verificar que el carril tenga cola con ítems reales.
2. Copiar a `/root/bin/loops/ugc-lucia.md` y agregar su `case` en `/root/bin/onia-loop.sh`
   (worktree, rama, tope, tools).
3. `git worktree add /root/loops/onia-contenido claude/carril-contenido`.
4. **Correrlo a mano una vez y leer el log entero.** Un cron escrito no es un cron que anda.
5. Recién ahí la línea de cron, **en UTC** (el VPS es UTC, La Paz es UTC−4) y escalonada
   **contra el minuto efectivo**, no contra la expresión: el jitter medido llegó a 517 s.
6. ⚠️ Infra = **un dueño a la vez**. El 01-sep otra sesión estaba desplegando en
   `/root/bin/loops/` — coordinar antes de escribir ahí.

## Las cuatro trampas del corredor, para no repetirlas

Vienen medidas en `COMO_SE_ARMA_UN_LOOP.md` y las paga el que despliega:

1. `--allowedTools` es variadic y **se come el argumento siguiente** → los tools en UNA cadena
   con comas, y el prompt **por STDIN**.
2. Sin `< prompt.md`, `claude` se traga lo que quede en la entrada del shell. Corriendo dos
   loops por SSH, **el primero se comió el script del segundo**.
3. Una `ANTHROPIC_API_KEY` en el entorno **pisa la suscripción** — y la de `.hermes/.env` está
   vencida → `unset` antes de invocar.
4. El `timeout` tiene que ser **menor que el intervalo del cron**, y `flock` para que una vuelta
   lenta no se pise a sí misma sobre el mismo árbol.
