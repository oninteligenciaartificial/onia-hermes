# U4 · Registrarse, confirmar el correo y entrar a Onia, de usted

Sos Codex. Trabajás SOLO en un clon de `onia-platform`, en la rama `codex/usted-registro-y-entrada`, creada desde
`origin/master` (base: el `master` del momento en que arrancás; anotá el SHA en el resumen).
- Primero `git branch --show-current`: tiene que decir esa rama. Si `git status` ya trae cambios, seguí desde ahí.
- Nadie contesta preguntas mientras corrés: decidí con este documento y el código; lo que no puedas decidir, al resumen.

## META
Orden de Sergio Urcullo (3-oct): **los textos al cliente van de usted**. El corte de la 1.0
(`hermes-content/docs/ONIA_1.0_CORTE.md` §5, en onia-hermes) pide de usted **venta, alta y cobro**, y la 1.0 se da por
terminada cuando un cliente **se registra solo**. Hoy lo primero que lee ese cliente le habla de tú y de vos. Leído en
el código el 11-oct sobre `master` + #136:
- `lib/auth/reenviar-confirmacion.ts`: «Tu cuenta está creada, pero falta confirmar tu correo. Si no te llegó, mirá en
  Spam o pedí que te lo mandemos de nuevo», «Revisá tu email y tu contraseña», «Escribí tu correo y volvé a intentar».
- `app/api/auth/login/route.ts`: «Credenciales incorrectas. Revisá tu email y tu contraseña».
- `app/api/auth/register/route.ts`: «Pedí tu acceso y te contactamos…», «…no coincide con tu cuenta de Google».
- `app/(auth)/login/2fa/page.tsx`: «Verificando tu acceso», «Esperá el siguiente de tu app y probá de nuevo».

Esta tarea pasa **enteras** a usted las pantallas de registrarse, confirmar el correo, iniciar sesión y la verificación
en dos pasos, con los mensajes que les devuelven sus APIs.

## Lista (pantalla entera: el archivo y lo que importa)
El trinquete de voseo cuenta por archivo y no ve un texto que la pantalla importa de otro módulo (error del 9-oct en U2).
Por eso la lista sigue los imports:
- Pantallas: todo `app/(auth)/**` (login, `LoginForm.tsx`, `ReenviarConfirmacion.tsx`, 2fa, register, `SignupForm.tsx`,
  `CamposWhatsapp.tsx`, `VerificarWhatsapp.tsx`, `verificar-whatsapp-estado.ts`, `AccessRequestForm.tsx`) y
  `app/verify-email/page.tsx`.
- Componentes que esas pantallas muestran: `components/auth/**` (`AuthLoading.tsx`, `AuthShell.tsx`,
  `AuthTrustNote.tsx`, `RecordarOrigen.tsx`).
- Mensajes que la pantalla muestra y vienen del servidor: `app/api/auth/**` (login, register,
  `verificacion-whatsapp/enviar` y `/confirmar`) y `lib/auth/**` (`reenviar-confirmacion.ts` y lo que esas rutas
  importen y devuelvan como `error`/`mensaje`).
- Si una pantalla de la lista muestra un texto de otro módulo que no está acá, cambiá ese texto solo si se ve en estas
  pantallas y no lo comparte otra; si lo comparte, anotalo en el resumen y no lo toques.

## PRUEBA DE HECHO
1. Test nuevo `__tests__/registro-y-entrada-de-usted.test.ts`, con el molde de `__tests__/titulos-publicos-de-usted.test.ts`
   (#146; si todavía no está en `master`, copiá su idea, no lo importes):
   - lee con el AST de `typescript` los archivos de la lista (sin `*.test.*`) y junta el texto de los literales
     (strings, templates y `JsxText`), sin comentarios y sin los atributos `className`, `id`, `key`, `href`, `name`,
     `type`, `autoComplete` ni `data-*`;
   - falla si encuentra tuteo (`(?<![\p{L}])(tu|tus|te|ti|contigo|puedes|tienes|quieres)(?![\p{L}])`, flag `iu`) o si
     `contarVoseo` (de `__tests__/voseo-ratchet.ts`) da más de 0;
   - hacelo fallar a propósito una vez con el texto de hoy y anotá en el resumen que se puso rojo.
2. Los archivos de la lista quedan en 0 en `__tests__/voseo-ratchet.linea-base.json` (el trinquete pide bajar la línea).
3. `npx tsc --noEmit` 0, eslint de lo tocado 0 errores, `npx vitest run` completo en verde. Si un test viejo afirmaba un
   texto de tú o de vos, se actualiza el texto esperado; nunca se borra el test.

## REGLA DE PARADA
- **No toques:** `lib/email.ts` y `lib/subscription/**` (los cambia #113, que espera el texto legal), `app/onboarding/**`,
  `lib/onboarding/**` y `components/onboarding/**` (son de U5), `app/(dashboard)/**`, `app/checkout/**`, `prisma/**`,
  `app/layout.tsx`.
- **`lib/whatsapp-onia/**` no** (el código por WhatsApp del alta sale de ahí): el texto de una plantilla aprobada por Meta
  no se cambia desde el código, se vuelve a aprobar en Meta. Si la pantalla muestra un `estado` que viene de ese
  módulo con tú o vos, anotalo en el resumen.
- **`app/api/auth/register/route.ts` también lo cambia #124** (términos aceptados, en espera). Ahí cambiá SOLO literales
  de texto, sin mover, reordenar ni reformatear código, para que los dos se junten sin conflicto.
- No cambies lógica, rutas, códigos HTTP, claves del JSON (`error`, `mensaje`), props ni nombres de archivos: solo
  textos y sus tests. Seguridad igual que hoy: el mensaje de credenciales sigue siendo uno solo para correo y
  contraseña (no revelar cuál falló) y no se nombra si un correo existe.
- Textos legales no (términos, privacidad, el aviso de consentimiento): si un texto de la lista es legal, anotalo.
- Vocabulario por rubro: «paciente», «clínica», etc. salen de `lib/onboarding/vocabulario.ts`; en pantallas de usted se
  usa `negocioSu` («su clínica»), nunca `negocio` («tu clínica»). No se edita `vocabulario.ts`.
- Usted correcto y con tildes. Ejemplos: «Revise su correo y su contraseña», «Su cuenta está creada, pero falta
  confirmar su correo. Si no le llegó, revise Spam o pida que se lo enviemos de nuevo», «Escriba su correo y vuelva a
  intentar», «No se pudo conectar. Revise su internet e intente de nuevo», «Listo, se lo enviamos a …», «Verificando su
  acceso», «Escriba el código de 6 dígitos de su app de autenticación», «Espere el siguiente código y pruebe de nuevo»,
  «Solicite su acceso y lo contactamos…». Botones en infinitivo o de usted («Crear mi cuenta», «Ingresar»), nunca «Entrá».
- **La línea base del trinquete** la tocan también U3, U5, #113 y #124. Si al mergear choca, la línea correcta es la
  base más los deltas de cada rama, nunca uno de los dos lados (11-oct: 25 / 340 / 188).
- Si después de dos intentos `tsc` o la suite siguen en rojo por algo fuera de la lista, pará y anotalo en el resumen.

## Entrega
Dos commits (pantallas y componentes; mensajes de las APIs y `lib/auth`), conventional en castellano y con el porqué.
Resumen final: SHA base, SHA de cada commit, archivos, números de `tsc`/eslint/vitest, el test que se puso rojo a
propósito, lo que quedó en la línea base y los textos compartidos o legales que no tocaste. Draft PR contra `master`.

**Para cuándo:** sin fecha dura; va antes de salir a buscar clientes con la 1.0. Lo lanza la madre con Sol: son textos,
no toca plata ni la lógica de seguridad. Lo revisa y lo publica Plataforma (son textos de producto: salen sin esperar a
Sergio Urcullo).
