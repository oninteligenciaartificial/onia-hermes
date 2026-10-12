---
name: onia-continuidad
description: Usar al inicio y cierre de encargos ONIA y cuando llegue un pedido o enlace nuevo. Recupera solo deltas, registra dueño, evidencia y siguiente acción en el handoff existente, separa aprendizaje observado de propuestas y evita perder encargos o rehacer trabajos cerrados. Complementa onia-router; no crea loops ni entrena modelos.
---

# No perder el hilo

## Intake y aprendizaje por evento — Sergio Urcullo, 12-oct-2026

**META:** preservar cada pedido/enlace y llevarlo al siguiente resultado autorizado sin releer historia ni duplicar registros.
**PRUEBA:** entrada trazable en handoff canónico, fuente/fecha y artefacto/ref/SHA cuando exista; cierre contrastado con evidencia.
**PARADA:** falta de permiso/dato realmente necesario: pedir intervención mínima concreta inmediatamente y continuar frentes independientes. No cerrar solo porque se delegó.

- Al inicio, al llegar un pedido/link y al cierre, consultar estado/delta del carril y las fuentes relevantes. No cargar conversaciones, documentos o transcripts completos ni sondear estados iguales; no crear scheduler/loop por usar esta skill.
- Usar el handoff del carril ya existente. Para este relevo coordinado, el índice único es `hermes-content/docs/handoff/codex-cloud-pc-20261011.md`, sección «Registro de encargos y aprendizaje». Enlazar informes/colas existentes; no copiar su contenido ni crear otro ledger.
- Cada entrada breve contiene **objetivo, dueño, estado, evidencia, aprendizaje (observado / inferencia / propuesta), siguiente acción o bloqueo, fecha y fuente**. Un link nuevo se registra antes de ampliar la investigación. Reusar la misma entrada al cambiar el estado, preservando intentos fallidos útiles.
- Estados: recibido / asignado / en curso / entregado para revisión / validado / bloqueado. «Asignado» o tool success no significa ejecutado. Cierre revisado exige comprobar versión, alcance, resultado, prueba y permisos; si falta revisión, conservar «entregado para revisión».
- Madre: Luna low, solo delega/revisa/resume. Hermes, checks, recuperación y mecánica: Luna low; código Platform: Sol 6.1 medium con QA focal Sol low; workers creativos existentes Marca/Lucía/Ventas Sol 6.1 low y Luna low para mecánica. Máx. 1 ejecutor + 1 revisor focal por lote/carril. Astra solo por excepción específica de Sergio ante fallo demostrado o riesgo material evidenciado. Sin fanout masivo, loops nuevos ni ACK sin cambio; pruebas proporcionales, deltas, sin historia/diffs enteros ni repeticiones. Registrar configuración y modelo efectivo por separado; no afirmar ahorro/cuota ni cambio de runtime.
- Al cerrar, continuar siguiente pendiente autorizado viable; no inventar busywork ni repetir cerrado. Si una alternativa cambia arquitectura, no adoptarla en silencio. Una petición humana debe explicar exactamente qué desbloquea; no pedir aprobación genérica ni interpretar silencio como permiso.
- Guardar **métodos comprobados** en la skill canónica del carril cuando sean reutilizables; guardar **estado/decisiones** en su handoff. Una observación de Orbix no autoriza copiar identidad, cambiar oferta/precios ni implementar una propuesta. No afirmar que un caso enseña al modelo: es recuperación documental, no entrenamiento.
- Antes de afirmar que la nube usa esta skill, comprobar repo/ref y lectura/ACK del worker. Un commit local o push no instala ni prueba carga cloud. Nunca registrar secretos, cookies, URLs firmadas temporales o transcripts completos.
- Casos de aceptación y evidencia del presente cambio: las entradas Orbix, Alfred y WhatsApp del registro único. Preservar bloqueo de envío Alfred aunque su lectura pase; preservar WhatsApp cerrado sin rehacerlo; Orbix sigue sujeto a revisión/adopción explícita.

Las instrucciones y mediciones anteriores de Claude que siguen son contexto histórico: comprobar runtime actual antes de repetir fetches, restauraciones, mensajería o autosync. La regla de arranque se cumple por delta cuando ya existe estado fiable; no obliga a releer fuentes enteras en cada turno.


`onia-router` responde *"¿qué skill uso para esto?"*. Esta skill responde la pregunta de
antes: ***"¿qué ya sabemos de esto, y sigue siendo cierto?"***

No es un mecanismo nuevo. Todo lo que nombra —handoffs, colas, docs sin fecha— **ya existe**.
Lo que faltaba era la obligación de leerlo antes de decidir, y el lugar donde anotar cuando un
doc resulta falso.

---

## Por qué existe: cuatro fallas medidas el mismo día

No es teoría. El 2026-08-31, en una sola sesión:

| Lo que pasó | Lo que costó |
|---|---|
| Planifiqué 6 features. **4 no existían** — ya estaban hechos o ya estaban decididos | media jornada |
| De 10 "bloqueados en Sergio", **4 no eran bloqueos**. Uno figuraba como bloqueo **y como rechazado** en el mismo archivo | la cola entera desconfiable |
| Opiné sobre Vercel sin leer `ONIA_SALIDA_DE_VERCEL_20260801.md` — un doc **mío, de un mes antes**, que tenía la decisión y el plan | dos vueltas de conversación |
| El handoff de mi propio carril era **de 4 días antes**, y su objetivo era exactamente lo que yo estaba redescubriendo | el objetivo del día |

En el carril de al lado, la misma pasada encontró **3 fantasmas de 11**.

**La tasa real de trabajo inventado cuando nadie verifica ronda el 40%.** Ése es el costo de
saltearse esta skill.

---

## 1. Los cuatro minutos de arranque

Antes de la primera línea de código o del primer plan. En este orden:

```bash
# 1. ¿Dónde estoy y con quién comparto?
git branch --show-current && git status --short
git worktree list

# 2. ¿Qué dejó escrito mi carril la última vez? — y CUÁNDO
ls hermes-content/docs/handoff/
git log -1 --format='%cd' --date=short -- hermes-content/docs/handoff/<mi-carril>.md

# 3. ¿Cuál es la cola de mi carril, y tiene fantasmas?
cat hermes-content/docs/cola/README.md          # el índice: qué cola es de quién
node scripts/verificar_cola.js <mi-cola.md>      # exit 1 si un ítem no existe

# 4. ¿Qué se movió desde mi último handoff?
git log --oneline --since="<fecha del handoff>" | head -20
```

**El paso 2 es el que más veces se saltea y el que más caro sale.** Un handoff de hace 4 días
con el objetivo ya escrito vale más que una hora de análisis nuevo.

### El paso 0: ¿esta tarea sirve a la etapa vigente del negocio?

Antes de los cuatro comandos, una pregunta más barata:

```bash
head -40 hermes-content/docs/ONIA_ESTRATEGIA_DE_EMPRESA.md   # §0 y la etapa vigente (§7)
```

Ese doc fija **una etapa a la vez, con criterio de salida numérico**. Una tarea que no sirve a
la etapa vigente **se anota como pendiente y no se hace**, aunque esté bien planteada y aunque
alguien ya haya empezado. Nace del mismo día que esta skill: 9 líneas de negocio abiertas y
8 worktrees simultáneos con **una sola persona** — la dispersión no se ve desde adentro de un
carril, sólo desde el objetivo. **Trabajo bien hecho en el frente equivocado sigue valiendo
cero.**

### La regla de oro del arranque

> **Antes de declarar que algo falta, buscá si ya está.**
> Antes de declarar que algo está bloqueado, **abrí el bloqueo y miralo**.

Un `grep` sirve para **descartar**, nunca para **confirmar**. Contar menciones de un archivo
mide estructura, no capacidad. Que el gate deje pasar una ruta no significa que exista un
camino para llegar.

---

## 2. Cuando un doc resulta falso

Pasa seguido, y **no es un accidente**: los docs envejecen peor que el código porque nada los
compila. Cuando lo encuentres:

1. **Corregilo EN SU ARCHIVO.** Nunca escribas uno nuevo al lado con la fecha de hoy — así
   nacieron los cuatro precios vivos del mismo chatbot.
2. **Dejá la corrección VISIBLE**, con la marca y el porqué:

   ```markdown
   ⚠️ **Corregido el 2026-08-31 — esto era falso.** Acá decía X. Medido en vivo: Y.
   El peligro de dejarlo: [qué habría roto].
   ```

   La corrección tachada enseña; el borrado silencioso deja que el error vuelva.
3. **Si el doc mandaba a hacer algo peligroso, decilo.** Ejemplo real: un doc advertía que los
   crons se corren 4 horas al pasarlos al VPS. El host está en `Etc/UTC` — seguirlo habría
   disparado dos trabajos en el horario equivocado.

### Lo que NO se hace

- No crear un doc nuevo para "aclarar" uno viejo. Se edita el viejo.
- No borrar la afirmación falsa sin dejar rastro.
- No corregir de memoria: **medir primero**, y contra el sistema correcto. La plataforma la
  sirve un contenedor del VPS, **no Vercel** — mirar el sistema equivocado ya produjo una
  conclusión falsa que dejó una capacidad **subvendida**.

---

## 3. Cuándo cortar la sesión

Una sesión larga no falla de golpe: se va desdibujando. Estas son las señales, y **cualquiera
de ellas es suficiente**:

- Volviste a leer un archivo que ya habías leído en la misma sesión.
- Te encontraste explicando algo que ya explicaste.
- El objetivo del final no es el del arranque, **y nadie lo cambió a propósito**.
- Se compactó la conversación más de una vez.
- Hay trabajo terminado **sin mergear** hace más de un día.

**Al cortar, lo mínimo:** actualizar `hermes-content/docs/handoff/<carril>.md` con el formato
de su README. Los siete campos, y el que casi nadie escribe es **intentos fallidos** — es el
que evita que la próxima sesión repita el callejón.

> ⚠️ **No alcanza con confiar en la compactación.** El resumen es fiel pero **no elige**:
> devuelve cada error y cada método descartado con el mismo peso que el estado actual.

---

## 4. Lo que se anota apenas se aprende, no al final

Tres cosas se escriben **en el momento**, porque son las que se pierden:

| Qué | Dónde | Por qué se pierde |
|---|---|---|
| **Un doc que resultó falso** | en el doc mismo, con la marca ⚠️ | si esperás al cierre, ya no te acordás de la evidencia |
| **Una decisión de Sergio** | en la cola del carril, con sus palabras textuales | parafraseada pierde el matiz que la hacía útil |
| **Un intento que falló** | handoff, campo *intentos fallidos* | es lo único que no se puede reconstruir del código |

Un hallazgo que aparece **verificando otra cosa** vale doble: nadie lo estaba buscando, así que
nadie lo va a volver a encontrar. Dos agujeros de seguridad reales del 2026-08-31 aparecieron
así — uno yendo a decidir si un componente era código muerto, otro yendo a verificar si dar de
baja una cuenta servía de algo.

### Recuperar algo borrado (medido 2026-10-02)
- **En la nube el clon es superficial** (`git rev-parse --is-shallow-repository` → `true`, ~230
  commits, desde el 27-sep): un hash viejo da `unknown revision` y parece que no existe.
  Primero `git fetch --unshallow origin main`, después buscar.
- **Encontrar el borrado:** `git log --diff-filter=D --since=<fecha> --shortstat`; restaurar
  desde el **padre** del commit que borró: `git show --name-only --diff-filter=D --format= <c>`
  a un archivo, filtrar lo que ya existe, y `git checkout <c>^ --pathspec-from-file=<archivo>`.
- **Antes, comparar lo que ya se había restaurado** (`git diff --stat <c>^ -- <ruta>`): si
  difiere, alguien lo editó después y no se pisa.
- **Mismo nombre en dos lados:** en Claude Code gana la skill del **proyecto**
  (`.claude/skills/`) sobre la del usuario (`~/.claude/skills/`). Por eso restaurar la copia del
  repo basta para volver al comportamiento viejo, sin tocar la PC.
- Caso: la limpieza del 29-sep (`2ff1c207`) se revirtió el 2-oct desde `9622ae6a` porque
  Sergio Urcullo vio que sus archivos dejaron de editarse como quiere
  (`historial/LIMPIEZA_SKILLS_20260929.md`).

---

## 5. Trampas de coordinación medidas en la nube (1-oct-2026)

- **Una sesión en la nube no puede mandarle mensajes a otra:** `SendMessage` falla con «auth: this cloud session cannot
  message other sessions». Lo que la madre local pide se contesta EN EL TRANSCRIPT, porque ella lo lee desde ahí. Si
  hace falta que la madre haga algo, el texto se le da a Sergio Urcullo para que lo pegue.
- **`git grep` sobre todo el repo tarda más de 2 minutos** y corta el comando por timeout. El 1-oct dejó un merge a
  medias, con `git add` sin correr. Para buscar marcadores de conflicto, usá `grep -c '^<<<<<<<'` sobre el archivo en
  conflicto.
- **El auto-sync (hook Stop) también corre en la nube:** el 1-oct commiteó solo (`chore: auto-sync`) los archivos que
  un workflow todavía estaba escribiendo. Un workflow que escribe archivos tiene que dejar cada archivo completo antes
  de que termine el turno.

## Relación con lo que ya existe

| Ya existe | Para qué | Esta skill |
|---|---|---|
| `onia-router` | qué skill/agente uso | qué ya sabemos antes de elegir |
| `hermes-content/docs/handoff/README.md` | plantilla del estado al cerrar | **obliga a leerlo al abrir** |
| `hermes-content/docs/cola/README.md` | índice de colas por carril | cómo verificar que no tiene fantasmas |
| `scripts/verificar_cola.js` | la regla de evidencia, mecánica | cuándo correrlo |
| `CLAUDE.md` §2 | las reglas y su historia | el ritual que las hace pasar |

**Nada de esto es nuevo.** Lo nuevo es el orden: leer, verificar, y recién ahí decidir.
