# Handoff — supervisor

Carril que audita a los otros loops. Rama `claude/supervisor`, worktree
`/root/loops/onia-hermes-supervisor`, cron `29 */2 * * *` (UTC).

**Objetivo**
Que ningún loop cobre por trabajo que no sirve. Hecho = abrir el trabajo de un carril y
decir si sirve o no, **con la evidencia**. No contar commits: abrirlos. Se cumple por vuelta,
y esta vuelta (2026-09-03 08:29 UTC) se cumplió sobre `recorrido-cliente`.

**Qué quedó EN PRODUCCIÓN**
Nada de código: este carril no despliega ni mergea a `main` por diseño. Lo que produce vive
en el tablero, que es su superficie de salida y ya está encendida:
- `t_bffb91fb` (2026-09-03 08:47 UTC) — el paso 3 del recorrido del cliente da `ok`
  incondicional sobre una pantalla que dice "Error al crear la cuenta". Con reproducción de
  30 segundos y el arreglo sugerido. Abierta para el dueño de `recorrido-cliente`.
- Comentario de corrección en esa misma tarea (08:48 UTC), ver *Intentos fallidos*.

**Qué quedó a medias, y dónde**
Nada a medias. La auditoría de `recorrido-cliente` se cerró entera en la vuelta.

**Archivos y cambios**
Ninguno tocado fuera de este handoff — es la regla del carril: *no lo arregles vos, no es tu
zona*. Lo auditado, para que la próxima vuelta no lo repita:
- `scripts/recorrido_cliente.mjs` de `origin/claude/recorrido-cliente` (línea ~502 es el
  defecto; líneas 560-565 son el chequeo que al paso 3 le falta y el paso 4 ya tiene).
- `hermes-content/docs/recorrido/capturas/` — las 13 capturas, miradas renderizadas, sin
  hashes duplicados (la vuelta anterior de ese carril arregló eso de verdad).

**Intentos fallidos**
- 🔴 **Hipótesis falsa, refutada por mí mismo en la misma vuelta.** Diagnostiqué que el
  "Error al crear la cuenta" venía de que el email QA es `zz-qa-<fecha>` (fijo durante las 8
  corridas diarias), así que sólo la primera crearía la cuenta y las otras siete chocarían.
  **Contado en vivo contra `supabase-db`: 0 usuarios y 0 orgs `zz-qa-`.** La limpieza del
  carril funciona y borra la cuenta al cerrar cada corrida; el email no queda ocupado.
  Alcancé a escribirlo en la tarea antes de medirlo — quedó corregido con un comentario.
  **La lección es la regla 5 del prompt, y me la aplicó a mí:** el hallazgo del `ok`
  incondicional era sólido sin esa causa; agregarle una causa no probada casi manda al dueño
  a arreglar lo que no está roto.
- Causa real del error en pantalla: **NO diagnosticada, y no se afirma ninguna.** Descartado
  el email reutilizado. Pista sin probar: el registro es un asistente de 2 pasos y el selector
  de submit (línea 497) es amplio — podría ser doble envío. No lo verifiqué.
- Ninguna de las dos tareas `ready` del tablero (`t_8baa5891`, `t_13eaa0ae`) es de esta zona:
  no se reclamaron a propósito.

**Qué depende de Sergio**
Nada de esta vuelta. El hallazgo no necesita decisión suya: es un arreglo de instrumento
dentro de un carril que ya tiene dueño.

**Próximos pasos**
1. **No re-auditar `recorrido-cliente`** hasta que `t_bffb91fb` esté cerrada. Listo = el
   paso 3 puede salir `roto` y sale rojo cuando la pantalla muestra un error.
2. Auditar el siguiente carril menos mirado. Ya auditados por este carril: `web-venta`,
   `chatbot`, `lucia`, `onia-cola` (integrador) y ahora `recorrido-cliente`. **Nunca
   auditados: `calidad-generado`, `tendencias`, `web-factory-dev`, `canario-visual`,
   `marca-personal`, `investigacion`, `docs-auditoria`.** Los tres primeros son los más
   jóvenes y los que menos vueltas llevan.
3. Anomalía menor anotada, sin abrir: `kpis-semanal` corrió dos veces con 22 s de diferencia
   (2026-09-03 02:16:17 y 02:16:39) siendo jueves, y su cron es `7 13 * * 1` (lunes) — o sea
   fueron disparos a mano, no del cron. Su rama (`claude/marca-personal-loop`) tampoco figura
   en `loops.md`. Listo = saber si esa rama debe estar en la tabla.
