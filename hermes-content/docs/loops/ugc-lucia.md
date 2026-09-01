# Loop: ugc-lucia — creativos de anuncio para Meta Ads

## 1. Identidad y objetivo

Carril de **contenido de Lucía**. Fabrica **creativos de anuncio** para Meta Ads.

**Definición de hecho:** un creativo que Sergio puede subir a Meta sin tocarlo — **video
vertical + caption con gancho + CTA explícita**, mirado y aprobado. No es un commit, no es un
render, no es un doc. Es una pieza que se sube.

## 2. El worktree

`cd /root/loops/onia-contenido && git branch --show-current` → tiene que decir
`claude/carril-contenido`. Si dice otra cosa, **PARÁ y avisá**. Nunca toques el árbol de
`onia-hermes`.

## 3. Gate 1 — antes de tocar nada

- `node scripts/verificar_cola.js hermes-content/docs/cola/contenido.md`. Si falla, arreglá la
  cola y terminá ahí: una cola que miente es peor que no tener cola.
- **Re-verificá el bloqueo que vas a asumir.** Un bloqueo vencido es peor que un fantasma:
  le pide a Sergio una decisión que ya tomó. Hoy los vivos son Meta Ads (sin método de pago, y
  el conector entra con otra identidad) y Postiz en 502.
- Un `grep` sirve para **descartar**, nunca para **confirmar**. Si es una imagen, se abre y se
  **mira**.

## 4. Qué hace — lo que NO necesita navegador

🔴 **Este loop no genera en Higgsfield.** Eso vive donde está el Chrome de Sergio: el VPS no
tiene navegador, y loguear su cuenta desde una IP de datacenter invita a un bloqueo — con un
cobro fallido ya encima. Acá se hace todo lo demás, que es la mitad del trabajo y está sin hacer.

**A. ¿Hay un video en `generadas-*` sin su `CREATIVO.md` al lado?** Escribilo. Es el entregable:

- **Gancho de 2 segundos** — lo primero que se ve y se lee.
- **Caption** con el desglose de costo al estilo de
  `hermes-content/references/video-intake/2026-08-31-mindshft-nike-desglose-de-costo.md`.
  🔴 **Las cifras se traen de una fuente real y se cita cuál.** Inventar sueldos bolivianos
  hunde la pieza ante el primer dueño de negocio que la lea.
- **CTA explícita.** Sin llamada a la acción, un anuncio pagado no vende.
- Formato objetivo **9:16**. Si el video es 3:4, anotá que necesita re-render vertical.

**B. ¿Hay una imagen sin `CREATIVO.md` que sirva como anuncio estático?** Mismo entregable.

**C. Verificación con los ojos.** Abrí un render y miralo contra su brief. **Anotá el resultado
aunque salga limpio** — si no, se vuelve a hacer y cuesta otra vuelta.

## 5. La escalera de agotamiento

Lo normal no es «la cola vacía»: es **«Ahora» agotado y la cola llena**. Sin esta escalera el
loop escribe párrafos que dicen «sigue igual».

```
0. Bloqueado NO se re-mide. Movelo a "Bloqueado en Sergio" y segui.
1. "Despues": si todo "Ahora" quedo bloqueado, tu item es el primero de ahi.
2. Auditar los [x]: el archivo que dice haber cambiado, cambio? sigue siendo cierto hoy?
3. Nada. Avisa en UNA linea y TERMINA SIN COMMITEAR.
   Una vuelta sin commit es un resultado valido. Commitear por commitear, no.
```

## 6. Una decisión de Sergio NO te detiene

Anotala en `hermes-content/docs/ONIA_RADAR_DECISIONES_PRODUCTO.md` con las opciones
**cotizadas**, y **seguí con el próximo ítem desbloqueado**. Así decide en tanda, sobre un
archivo, en vez de contestar preguntas sueltas todo el día.

## 7. Prohibiciones

Corre sin nadie mirando. **No publica · no gasta en ads ni toca botones de pago · no genera en
Higgsfield · no mergea a `main` · no toca el carril de la marca personal ni el de @oniahq · no
toca VPS, n8n ni onia-platform · no le escribe a un prospecto.**

Y la que evita el trabajo fantasma: **prohibido inventar una tarea que no esté en su cola o en
la lista de arriba.**

## 8. Cierre

- Evidencia real: ruta desde la raíz del repo, nunca un fragmento, nunca la propia cola.
- `git add <ruta>` explícito. **NUNCA `git add -A`**: hay otra sesión en este árbol, y un
  `git add` después de un script fallido commitea trabajo ajeno con tu mensaje encima. Ya pasó
  el 01-sep.
- Verificá `git diff --stat` ANTES de commitear.
- Lo aprendido va a `hermes-content/references/modelos/lucia/TECNICA-HIGGSFIELD.md`.
