---
id: plataforma-U3b
carril: plataforma
estado: bloqueada
modelo: gpt-6.1-sol
repo: onia-platform
rama: codex/usted-pantallas-video
base: claude/optimistic-ride-1sp5fe
pr:
escrita: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
actualizada: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
nota: espera que U3 y F136 entren a master; Plataforma junta master en su rama y la pasa a pendiente
---
# U3b · Las pantallas del video de venta (C1-C7) de usted: actualizar los tests que afirmaban el texto de vos

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama
`codex/usted-pantallas-video`, desde la cabeza de `claude/optimistic-ride-1sp5fe` que diga `nota:` al pasar a pendiente.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en
  el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
Las capturas C1-C7 del video de venta muestran agenda, Pendientes, ficha, cobros y agentes. El commit `f28e15af`
(Plataforma, 11-oct) ya pasó esas pantallas y sus textos importados a usted y bajó la deuda de vos de 581 a 534. Con
eso, `tsc` da 0 y la suite da 10.503 en verde y **38 rojos en 16 archivos**: son tests viejos que afirmaban el texto de
vos o de tú. Esta tarea los actualiza al texto nuevo, sin tocar el producto.

## PRUEBA DE HECHO
1. `npx vitest run` completo en verde, con 0 rojos.
2. `npx vitest run __tests__/pantallas-del-video-de-usted.test.ts __tests__/voseo-ratchet.test.ts` en verde.
3. `npx tsc --noEmit` 0 y eslint de lo tocado 0 errores.
4. Ningún test borrado ni salteado (`it.skip`, `it.todo`, `.only`): cada esperado de vos o de tú pasa al texto de usted
   que hoy produce el código. Los 16 archivos del 11-oct (pueden ser menos si U3 o F136 ya actualizaron alguno):
   `lib/clientes/baja.test.ts` (10), `app/api/patients/[id]/baja.route.test.ts` (5),
   `lib/agenda/push-sin-secreto.test.ts` (3), `app/(dashboard)/agents/agents-view.plantilla.render.test.ts` (3),
   `lib/onia-core/collab-aprobaciones.test.ts` (2), `app/api/comercio/clientes/[id]/route.test.ts` (2),
   `app/(dashboard)/agents/plantillas-client.render.test.ts` (2), `app/(dashboard)/agents/aviso-vigia.render.test.ts` (2),
   `app/(dashboard)/agents/agents-view.vigia.render.test.ts` (2), `lib/onia-core/modules/agents-runtime.test.ts` (1),
   `lib/onia-core/modules/agents-rotulos.test.ts` (1), `lib/agenda/cupo-de-correo-avisa.test.ts` (1),
   `components/patients/PlanDeTratamiento.render.test.ts` (1), `app/api/v1/appointments/route.test.ts` (1),
   `app/(dashboard)/agents/agents-view.recall.render.test.ts` (1), `app/(dashboard)/agents/agents-view.quien-aprueba.render.test.ts` (1).

## REGLA DE PARADA
- **No cambies textos del producto** para que un test pase: el texto de usted ya está decidido. Si un test afirma algo
  que no es texto (lógica, orden, permisos) y falla, pará y anotalo: no es de esta tarea.
- Si la carpeta todavía tiene marcadores de conflicto (`<<<<<<<`), resolvelos así: en las líneas que cambió U3 (pantallas
  de `/agents` y el Inicio) o F136 (caja y odontograma), queda lo de `master`; en el resto, queda el usted de `f28e15af`.
  Anotá en el resumen cada archivo resuelto.
- No toques `__tests__/voseo-ratchet.linea-base.json` salvo que `voseo-ratchet.test.ts` lo pida con «BAJÓ»; nunca subas
  un número.
- Si después de dos intentos la suite sigue en rojo por algo fuera de esta lista, pará y anotalo en el resumen.

## ARCHIVOS
- Los `*.test.ts` de la lista de arriba y, si quedaron marcadores, los archivos con marcadores.
- Nada más.

## Resumen final (para la madre)
Números de `tsc`, eslint y vitest (antes y después), cada test cambiado con el texto viejo y el nuevo en una línea, y
los conflictos que resolviste. Plataforma lo revisa, lo integra con `master` y lo publica: son textos de producto y
salen sin esperar a Sergio Urcullo.
