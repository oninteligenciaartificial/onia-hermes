# Las colas — un carril, un objetivo, una pantalla que lo prueba

> **Por qué existe esta carpeta.** El 2026-08-31 se midió: **349 commits repartidos en 5 ramas
> y ninguno en `main`**. El trabajo estaba hecho y no llegaba a ningún lado. La sensación de
> "no avanzamos" no venía de los loops ni de las sesiones: venía de que nada converge.

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
| **Chatbot** (motor, guion, WhatsApp, bandeja) | ⚠️ **no tiene cola** — tiene handoff (`hermes-content/docs/handoff/chatbot.md`), que es estado, no plan. **La escribe su propio carril**, no ésta | *(a escribir)* — el estado dice v1.0 completo en prod y Embedded Signup encendido del lado servidor | Una conversación real en la bandeja, de alguien que no somos nosotros |
| **Producto / plataforma** | `hermes-content/docs/COLA.md` | **`main` integrado y desplegado** | `app.onia.com.bo` sirviendo el `main` de hoy |

**El carril de contenido y el de web ya adoptaron la regla de evidencia por su cuenta.** El de
web la corrió en su primera pasada y encontró **3 fantasmas de 11**; el de producto, **4 de 6**.
No es una teoría: es la tasa real de trabajo inventado cuando nadie verifica.

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

## Los loops

Cada carril tiene su tarea programada en `C:\Users\PC\.claude\scheduled-tasks\`. Dato medido el
2026-08-31: **el `SKILL.md` sobrevive, el registro del horario NO.** Al cerrar las sesiones los
loops quedan en disco pero desregistrados. Rearmarlos es barato —el prompt ya está escrito— pero
hay que hacerlo a mano. No asumir que están corriendo: verificarlo.
