# Q9 · El alta le habla de usted hasta en el rótulo del negocio (onia-platform)

Sos Codex. Trabajás SOLO en esta carpeta, un clon completo de `onia-platform`, en la rama `codex/alta-negocio-de-usted`.
- Primero corré `git branch --show-current`: tiene que decir esa rama. Si no, pará y decilo en el resumen.
- Si `git status` ya muestra cambios, es que una corrida anterior se cortó: seguí desde ahí y no rehagas lo hecho.
- Nadie va a contestar preguntas mientras corrés. Decidí con este documento y con el código; lo que no puedas decidir, anotalo en el resumen final.

## META
En `/register` (paso 2), el campo del negocio dice «Nombre de **tu** clínica» y las pantallas de carga que siguen dicen «Abriendo el panel de **tu** clínica» y «Activando **tu** clínica». Todo lo demás del alta ya es de usted («Cree su cuenta», «Su nombre»). Que esos tres textos usen la forma de usted del vocabulario del rubro, en los 5 rubros.

## PRUEBA DE HECHO
1. `npx vitest run "app/(auth)/register" lib/onboarding` en verde, con un test NUEVO que falla en `master` y pasa con tu cambio: lee el código fuente de `app/(auth)/register/SignupForm.tsx` y comprueba que no queda `voc.negocio` sin el sufijo `Su` (regex `/voc\.negocio(?!Su|Titulo)\b/`).
2. `npx tsc --noEmit` sin errores.
3. `npx vitest run __tests__/voseo-ratchet` en verde (no debe cambiar la línea base).
4. Un test de render o de vocabulario que pruebe, para `dentagest-clinical`, `esteticagest-clinical`, `gestios-general`, `proveegest-electrico` y `gestios-servicios-profesionales`, que el rótulo armado queda «Nombre de su clínica / su centro de estética / su negocio / su empresa / su estudio» (sin «tu»).

Todo queda en UN commit en la rama.

## REGLA DE PARADA
- **No borres ni renombres `negocio` del vocabulario** (`lib/onboarding/vocabulario.ts`): otras pantallas de vos todavía lo usan y su test (`vocabulario.test.ts`) lo exige.
- **No toques otras pantallas ni la landing:** esta tarea es solo el alta. La web `onia.com.bo` (vos) es decisión de Sergio Urcullo.
- **No toques `__tests__/voseo-ratchet.linea-base.json`:** otro PR abierto (#146) también lo edita.
- **No empujes nada.** Entregá la rama con el commit; la madre la integra.

## Contexto mínimo
- **Qué es:** Onia Platform, el SaaS de gestión de Onia para Bolivia. 5 rubros se ofrecen: dental, estética, comercio, importadora, servicios profesionales. Es multi-tenant.
- **Cómo se vio (QA, 11-oct 05:25 UTC, producción, sin sesión):** `app.onia.com.bo/register`, paso 2 (se elige «Clínica dental»): la etiqueta del campo dice «Nombre de tu clínica». El paso 1 y el resto del paso 2 ya son de usted.
- **Antes de codear:** leé `.claude/skills/onia-frontend/SKILL.md` (solo la parte de textos y vocabulario). No leas docs largos. Leé el código por sección (`grep -n`, `sed -n 'a,bp'`).

## Lo que hay hoy (medido sobre master `d8ca5a32`)
- `app/(auth)/register/SignupForm.tsx:630`: `label={\`Nombre de ${voc.negocio}\`}`.
- `app/(auth)/register/SignupForm.tsx:362`: `detalle={\`Abriendo el panel de ${voc.negocio}.\`}` (pantalla de carga).
- `app/(auth)/register/SignupForm.tsx:403`: `detalle={\`Activando ${voc.negocio} y abriendo su panel.\`}` (pantalla de carga).
- `lib/onboarding/vocabulario.ts:20-26`: el vocabulario ya trae las dos formas: `negocio` («tu clínica», para lo que sigue de vos) y `negocioSu` («su clínica»). Su comentario dice que `negocio` se borra cuando el trinquete llegue a 0. Los otros dos packs de `vocabularioDeTrack` (veterinaria, ganadería) no se ofrecen: no hace falta tocarlos.
- El trinquete de voseo (`__tests__/voseo-ratchet.ts`) NO ve estos textos: «tu» no es voseo. Por eso el test nuevo mira el código.

## Qué construir
1. Cambiá esas tres líneas a `voc.negocioSu`.
2. Agregá el test de la PRUEBA DE HECHO 1 y 4 (en `app/(auth)/register/` o en `lib/onboarding/`, siguiendo el patrón de los tests vecinos).
3. Corré las tres pruebas de la PRUEBA DE HECHO y copiá la salida (cuántas pasaron) al resumen final.
