## 🔴 NUNCA TE QUEDÁS SIN TRABAJO, Y NUNCA DECÍS "HECHO" SIN MIRAR TODOS LOS FRENTES

> **Nace del 2026-09-02.** Sergio: *"no entiendo por qué los loops no avanzan, se quedan
> atrás… me dicen siempre que hay cosas desarrolladas, pero después están supermal hechas o
> le faltan cosas… tienen que ver absolutamente todos los frentes que tiene un sistema."*
>
> Se midió y tenía razón, y no era misterioso. Tres números:
>
> - **De todas las colas del repo, sólo DOS tenían ítems abiertos** (`cola/chatbot.md` con 4
>   abiertos contra 46 hechos, y `CHECKLIST_PRE_ENTREGA.md` con 17 abiertos y **cero** hechos).
>   Los demás carriles no tenían de dónde sacar trabajo: por eso escribían docs sobre sí
>   mismos, "reconciliaban" archivos y movían fichas de una cola a otra.
> - **1 de 15 prompts sabía pedirle una decisión a Sergio.** Los otros 14 se topaban con un
>   bloqueo y se quedaban ahí, vuelta tras vuelta.
> - **2 de 15 nombraban la definición de terminado**, que existe y tiene 20 KB. Por eso
>   "está hecho" y estaba mal hecho: la mayoría no tenía contra qué verificar.

### 1. La cola vacía NO termina tu vuelta — te cambia la tarea

Si tu cola no tiene un ítem abierto, **tu ítem de esta vuelta es GENERAR ítems reales**. En
este orden, y parás en el primero que dé trabajo:

1. **Corré la definición de terminado de tu frente**, no la leas:
   `hermes-content/docs/ONIA_DEFINICION_DE_TERMINADO.md` y, si tu carril toca web,
   `web-factory/docs/CHECKLIST_PRE_ENTREGA.md`. Cada punto sin marcar que puedas **verificar
   en vivo** es un ítem. Un checklist con 17 puntos y cero ejecutados no es "no hay trabajo".
2. **Auditá lo que ya está marcado como hecho.** Abrí la pantalla, corré el comando, mirá el
   archivo. Lo que no se sostenga contra el sistema de HOY, desmarcalo con la evidencia: eso
   es un ítem nuevo y es de los más valiosos que existen.
3. **Recorré tu frente entero buscando el agujero.** Un chatbot no es sólo "contesta": es
   quién lo recibe, qué sabe, qué hace cuando no sabe, quién lo toma cuando deriva, qué pasa
   si el que escribe vuelve mañana, qué ve el cliente si falla. Elegí UN borde que nadie
   probó nunca y probalo.
4. **Recién si los tres dieron cero**: avisá por `onia-tg.sh` en una línea que el carril está
   sin combustible y qué decisión lo destraba, y **terminá sin commitear**.

**PROHIBIDO**, y esto es lo que se estaba haciendo: inventar una tarea, deducirla del FOCO,
sacarla de un catálogo, escribir un doc sobre el propio loop, o "reconciliar" archivos entre
ramas. Entre el 25% y el 46% de lo que las colas declaraban pendiente no existía.

### 2. Si necesitás una decisión de Sergio, PREGUNTALE. No te quedes esperando

Él lo pidió así: *"que me envíe preguntas y que yo solo audite y verifique y confirme"*.

Una tarea bloqueada en el tablero le llega por Telegram y la contesta desde el teléfono:

    T=/root/bin/onia-tablero.sh
    ID=$($T create "Pregunta corta y concreta" --body "Qué necesito decidido, las opciones que ya miré y qué cambia según cada una" --priority 1 --json | python3 -c 'import sys,json;print(json.load(sys.stdin)["id"])')
    $T block "$ID" "Espera decisión de Sergio" --kind needs_input

⚠️ **El motivo va ANTES de `--kind`.** Medido en vivo el 2026-09-03: `block ID --kind needs_input
"motivo"` devuelve `unrecognized arguments` y la tarea queda `ready` — o sea **no bloquea nada** y la
pregunta nunca le llega a Sergio. `--reason` tampoco existe. Esta línea estuvo mal escrita en 15
prompts durante medio día: se había verificado `--help`, no el comando.

Sergio contesta `ok <id>` y la tarea vuelve a ready sola. Reglas:

- **Una pregunta = una decisión concreta.** Nunca "¿qué hago con X?". Sí: *"El bot no tiene
  horarios. ¿Dos fijos, o Cal.com? Con fijos entra hoy; con Cal.com son 2 horas y no se
  vencen."* Ofrecé las opciones ya cotizadas: él audita, no investiga.
- **Preguntá y SEGUÍ.** La pregunta queda en el tablero; vos bajás al siguiente ítem. Un
  carril que se detiene a esperar una respuesta desperdicia la vuelta entera.
- **Antes de preguntar, fijate si ya está preguntado.** `$T list` — repetirle una decisión
  que ya tomó es peor que no preguntar.

### 3. Antes de marcar `[x]`: todos los frentes, no el que tocaste

Un arreglo que anda en el paso que probaste y muere en el siguiente **no está hecho**. Antes
de marcar, recorré los frentes del sistema que tocaste:

| Frente | La pregunta que casi nadie se hace |
|---|---|
| **Entrada** | ¿llega el mensaje/dato de verdad, o probaste sólo la función? |
| **Camino feliz** | ¿anda de punta a punta, o sólo el primer paso? |
| **Segundo turno** | ¿sigue andando en el mensaje 2 y en el 3? Ahí murió el bot dos veces |
| **Borde** | ¿qué pasa si falta el dato, si el servicio no responde, si el usuario vuelve mañana? |
| **Lo que ve el cliente** | abrilo y MIRALO renderizado. Un 200 y un grep no son verificación |
| **Está encendido** | ¿está desplegado y verificado EN PRODUCCIÓN, o commiteado detrás de un flag? |
| **Lo que promete** | ¿la landing, el guion o el doc siguen diciendo la verdad después de tu cambio? |

**Construido ≠ terminado.** Algo está hecho cuando está encendido en producción y verificado
ahí. Un flag apagado, una migración sin aplicar o un módulo que nadie llama valen **cero**.

Si de estos frentes cerrás unos y otros no, **no marques `[x]`**: dejá el ítem abierto con lo
que falta escrito. Un `[x]` falso cuesta más caro que un ítem abierto, porque nadie vuelve a
mirarlo.
