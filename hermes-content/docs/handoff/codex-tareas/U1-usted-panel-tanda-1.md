# U1 · El panel le habla de usted al dueño (tanda 1) y un gate que no deja volver el voseo

Sos Codex. Trabajás SOLO en un clon de `onia-platform`, en la rama `codex/usted-panel-1`, creada desde `origin/master`
(base: el `master` del momento en que arrancás; anotá el SHA en el resumen).
- Primero `git branch --show-current`: tiene que decir esa rama. Si `git status` ya trae cambios, seguí desde ahí.
- Nadie contesta preguntas mientras corrés: decidí con este documento y el código; lo que no puedas decidir, al resumen.

## META
Orden de Sergio Urcullo: **los textos al cliente van de usted**. Pacientes y acceso ya están (#108, #117). Esta tanda
pasa a usted las pantallas del dueño de la lista de abajo, ENTERAS (una pantalla no mezcla vos y usted), y agrega un
gate que cuenta el voseo en lo que ve el cliente y solo deja que el número BAJE.

## PRUEBA DE HECHO
1. Test nuevo `__tests__/voseo-ratchet.test.ts`:
   - recorre `app/`, `components/` y `lib/` (sin `*.test.*`, sin `app/dev/`, sin comentarios);
   - cuenta formas de voseo en literales de texto (strings y JSX): `\b(tenés|podés|querés|sabés|hacé|tocá|elegí|cargá|escribí|probá|revisá|volvé|recargá|mirá|abrí|confirmá|guardá|agregá|completá|subí|pagá|escaneá|poné|andá|vos)\b`, más imperativos agudos terminados en «á/é/í» que el test liste explícitamente;
   - compara contra `__tests__/voseo-ratchet.linea-base.json` ({ archivo: cantidad }): falla si un archivo SUBE o aparece uno nuevo con voseo; si baja, pide actualizar la línea base.
   - Hacelo fallar a propósito una vez (agregá un «Tocá» a un archivo de la lista) y anotá en el resumen que se puso rojo.
2. Los archivos de la lista quedan en 0 en la línea base.
3. `npx tsc --noEmit` 0, eslint de lo tocado 0 errores, `npx vitest run` completo verde; si un test viejo afirmaba un texto de vos, se actualiza el texto esperado (nunca se borra el test).

## Lista de esta tanda (pantalla entera, textos visibles y mensajes de error de sus rutas)
- `app/(dashboard)/settings/chatbot/CanalMetaCard.tsx`, `CanalWebCard.tsx`, `ChatbotClient.tsx`, `FilaCanal.tsx` y las rutas `app/api/chatbot-canal-meta/route.ts`, `app/api/chatbot-canal-web/route.ts`. (La tarjeta de WhatsApp ya está de usted: es el molde.)
- `lib/chatbot/ventana-de-respuesta.ts` (`TEXTO_VENTANA_CERRADA`, `TEXTO_SIN_DATO`). **Ojo:** con el alta estándar del WhatsApp el número del negocio ya no está en la app; no digas «escríbale desde su WhatsApp» como si fuera el mismo número: decí «escríbale por fuera de Onia».
- `components/ayuda/FaqAyuda.tsx`, `components/ayuda/AsistenteAyuda.tsx`, `app/(dashboard)/help/page.tsx`.
- `app/(dashboard)/patients/import/page.tsx` y `app/api/patients/import/route.ts`.
- `app/(public)/book/[orgSlug]/page.tsx` (lo ve el PACIENTE: «Elegí», «Probá», «Revisá»…) y los mensajes de error de `app/api/booking/*` que lleguen a esa pantalla («Intentá de nuevo», «Por favor elige otro» → «Por favor, elija otro»).
- `components/ayuda/BarraAsistente.tsx` (líneas 116 y 121: «Preguntá por tu negocio», se ve en TODAS las pantallas a 1440).
- `components/layout/` (menús, avisos) salvo `InstalarOnia.tsx`, que ya está.

## REGLA DE PARADA
- **No toques** (otras tareas los están cambiando): `app/(dashboard)/agenda/**`, `app/(dashboard)/appointments/**`,
  `components/agenda/**`, `app/cita/**`, `app/checkout/**`, `components/billing/QRPaymentModal.tsx`,
  `app/(dashboard)/settings/PlanClient.tsx`, `app/(dashboard)/admin/**`, `app/api/subscription-payment/**`,
  `lib/subscription/**`, `lib/realtime/**`, `hooks/useAppointmentsRealtime.ts`, `components/presupuesto/**`,
  `app/print/presupuesto/**`, `prisma/**`. Si un texto de esos archivos aparece en el conteo, queda en la línea base.
- **Textos legales no** (términos, privacidad, casillas de aceptación): se cuentan en la línea base y no se cambian.
- No cambies lógica, rutas, permisos ni nombres de props: solo textos y sus tests.
- Vocabulario por rubro: si el texto es de una pantalla compartida, «paciente» sale de `lib/onboarding/vocabulario.ts`, no se escribe a mano.
- Usted correcto y con tildes: «Toque», «Elija», «Revise», «Escríbanos», «Pruebe de nuevo», «su», «le».

## Entrega
Un commit por grupo de la lista (5 o 6 commits), conventional en castellano con el porqué. Resumen final: SHA de cada
commit, archivos, números de tsc/eslint/vitest, la cuenta total de voseo antes y después (del test nuevo), y lo que
quedó en la línea base y por qué. Draft PR contra `master`.
