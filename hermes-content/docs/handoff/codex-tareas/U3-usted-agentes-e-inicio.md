# U3 · `/agents` y el Inicio le hablan de usted al dueño (antes de las capturas del lunes)

Sos Codex. Trabajás SOLO en un clon de `onia-platform`, en la rama `codex/usted-agentes-inicio`, creada desde
`origin/master` (base: el `master` del momento en que arrancás; anotá el SHA en el resumen).
- Primero `git branch --show-current`: tiene que decir esa rama. Si `git status` ya trae cambios, seguí desde ahí.
- Nadie contesta preguntas mientras corrés: decidí con este documento y el código; lo que no puedas decidir, al resumen.

## META
Orden de Sergio Urcullo: **los textos al cliente van de usted**. El lunes 12-oct se graban las capturas de la demo
(C7 es `/agents`) y el Inicio es lo primero que se ve al entrar. Hoy esas dos pantallas le hablan de tú y de vos al
dueño: «No se envía nada hasta que lo apruebes», «Esperan tu OK», «espera tu OK», «Nada sale sin tu OK», «Revisan tus
datos», «sale cuando lo mandás vos», «confirmaste que enviaste vos». Esta tarea las pasa **enteras** a usted.

Leído en el código el 11-oct: el mensaje que recibe el paciente ya es de usted («¿Nos confirma su asistencia? … díganos»,
`buildConfirmacionMessage` en `lib/onia-core/modules/agents-logic.ts`), y `/pending` también («No se envía hasta que lo
apruebe»). Esos no se tocan.

## Lista (pantalla entera: el archivo y lo que importa)
El trinquete de voseo cuenta por archivo y no ve un texto que la pantalla importa de otro módulo (error del 9-oct en
U2). Por eso la lista sigue los imports:
- `/agents`: `app/(dashboard)/agents/agentes-pantalla.tsx`, `aviso-vigia.tsx`, `interruptor.tsx` y
  `plantillas-client.tsx`. Si alguno muestra un texto que viene de `lib/onia-core/modules/agents-*.ts`, se cambia ese
  texto solo si es para el dueño y se ve en esta pantalla. Los textos que van al paciente no se tocan.
- Inicio: `app/(dashboard)/dashboard/panel-hoy.tsx`, `app/(dashboard)/dashboard/lo-que-te-dejo.tsx` y
  `lib/resultados/lo-que-te-dejo.ts` (los `detalle` que se muestran: «Tu cliente la aceptó…», «…que confirmaste que
  enviaste vos»).
- `app/dev/kit/KitDemo.tsx` no entra: es de desarrollo.

## PRUEBA DE HECHO
1. Test nuevo `__tests__/agentes-e-inicio-de-usted.test.ts`, con el molde de `__tests__/titulos-publicos-de-usted.test.ts`
   (#146; si todavía no está en `master`, copiá su idea, no lo importes):
   - lee con el AST de `typescript` los archivos de la lista y junta el texto de los literales (strings, templates y
     `JsxText`), sin comentarios y sin los atributos `className`, `id`, `key` y `href`;
   - falla si encuentra tuteo (`\b(tu|tus|te|ti|contigo|apruebes|puedes|tienes|quieres)\b`, sin distinguir mayúsculas)
     o si `contarVoseo` (de `__tests__/voseo-ratchet.ts`) da más de 0;
   - hacelo fallar a propósito una vez con el texto de hoy y anotá en el resumen que se puso rojo.
2. Los archivos de la lista quedan en 0 en `__tests__/voseo-ratchet.linea-base.json` (el trinquete pide bajar la línea).
3. `npx tsc --noEmit` 0, eslint de lo tocado 0 errores, `npx vitest run` completo en verde. Si un test viejo afirmaba un
   texto de tú o de vos, se actualiza el texto esperado; nunca se borra el test.

## REGLA DE PARADA
- **No toques** (otras ramas los cambian): `app/(dashboard)/pending/**`, `app/(dashboard)/inbox/**`,
  `app/(dashboard)/appointments/**`, `components/agenda/**`, `app/cita/**`, `app/checkout/**`, `lib/subscription/**`,
  `lib/realtime/**`, `prisma/**`, `app/layout.tsx`. Tampoco el prompt del redactor de plantillas
  (`lib/onia-core/modules/agents-plantilla.ts`), que ya pide usted.
- Textos legales no. No cambies lógica, rutas, permisos, props ni nombres de archivos: solo textos y sus tests.
- Vocabulario por rubro: «paciente» sale de `lib/onboarding/vocabulario.ts`, no se escribe a mano.
- Usted correcto y con tildes: «Esperan su aprobación», «No se envía nada hasta que usted lo apruebe», «Revisan sus
  datos», «Nada sale sin su aprobación», «sale cuando usted lo envía», «que usted confirmó haber enviado».
- **La línea base del trinquete** la tocan también #136 y #146. Si al mergear choca, la línea correcta es la base más
  los deltas de las dos ramas, nunca uno de los dos lados (11-oct: 25 / 340 / 188).
- Si después de dos intentos `tsc` o la suite siguen en rojo por algo fuera de la lista, pará y anotalo en el resumen.

## Entrega
Dos commits (`/agents` e Inicio), conventional en castellano y con el porqué. Resumen final: SHA base, SHA de cada
commit, archivos, números de `tsc`/eslint/vitest, el test que se puso rojo a propósito y lo que quedó en la línea base
y por qué. Draft PR contra `master`.

**Para cuándo:** antes del lunes 12-oct a las 07:00 UTC (la ventana de la demo). Lo lanza la madre con Sol: no toca
plata ni seguridad.
