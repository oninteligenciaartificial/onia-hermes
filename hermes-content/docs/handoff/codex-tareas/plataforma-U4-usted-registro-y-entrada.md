---
id: plataforma-U4
carril: plataforma
estado: pendiente
modelo: gpt-6.1-sol
repo: onia-platform
rama: codex/usted-registro-y-entrada
base: master
pr:
escrita: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
actualizada: 2026-10-11 por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C)
nota:
---
# U4 · Registrarse, confirmar el correo y entrar a Onia, de usted

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama
`codex/usted-registro-y-entrada`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama y revisa el diff.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en
  el resumen final.
- Sin push, sin npm install, sin producción, sin red. NO commitees: la madre revisa el diff y commitea.

## META
Orden de Sergio Urcullo (3-oct): **los textos al cliente van de usted**. El corte de la 1.0 pide de usted **venta,
alta y cobro**, y la 1.0 se da por terminada cuando un cliente **se registra solo**. Hoy lo primero que lee ese cliente
le habla de tú y de vos. Leído en el código el 11-oct sobre `master` `a7d8c1ed`:
- `lib/auth/reenviar-confirmacion.ts`: «Tu cuenta está creada, pero falta confirmar tu correo. Si no te llegó, mirá en
  Spam o pedí que te lo mandemos de nuevo», «Revisá tu email y tu contraseña», «Escribí tu correo y volvé a intentar».
- `app/api/auth/login/route.ts`: «Credenciales incorrectas. Revisá tu email y tu contraseña».
- `app/api/auth/register/route.ts`: «Pedí tu acceso y te contactamos…», «…no coincide con tu cuenta de Google».
- `app/(auth)/login/2fa/page.tsx`: «Verificando tu acceso», «Esperá el siguiente de tu app y probá de nuevo».

Esta tarea pasa **enteras** a usted las pantallas de registrarse, confirmar el correo, iniciar sesión y la verificación
en dos pasos, con los mensajes que les devuelven sus APIs.

**Absorbe Q9 (Hermes, 11-oct):** `app/(auth)/register/SignupForm.tsx` arma «Nombre de tu clínica», «Abriendo el panel
de tu clínica» y «Activando tu clínica» con `voc.negocio` (líneas ~362, ~403 y ~630 sobre `master` `d8ca5a32`): van con
`voc.negocioSu`, en los 5 rubros. Si Q9 ya está en `master`, no se repite.

## PRUEBA DE HECHO
1. Test nuevo `__tests__/registro-y-entrada-de-usted.test.ts`, con el molde de
   `__tests__/pantallas-del-video-de-usted.test.ts` y `__tests__/titulos-publicos-de-usted.test.ts` (si alguno todavía
   no está en `master`, copiá su idea, no lo importes):
   - lee con el AST de `typescript` los archivos de ARCHIVOS (sin `*.test.*`) y junta el texto de los literales
     (strings, templates y `JsxText`), sin comentarios y sin los atributos `className`, `id`, `key`, `href`, `name`,
     `type`, `autoComplete` ni `data-*`;
   - falla si encuentra tuteo (`(?<!\p{L})(tú|tu|tus|te|ti|contigo|puedes|tienes|quieres)(?!\p{L})`, flag `iu`) o
     voseo (`contarVoseo` de `__tests__/voseo-ratchet.ts` más de 0);
   - falla si una pantalla de la lista usa `vocabulario.negocio` («tu clínica») en vez de `negocioSu`: mirá el caso
     `usaElNegocioDeVos` de `pantallas-del-video-de-usted.test.ts`;
   - hacelo fallar a propósito una vez con el texto de hoy y anotá en el resumen que se puso rojo.
2. Los archivos de la lista quedan en 0 en `__tests__/voseo-ratchet.linea-base.json` (el trinquete exige bajar la línea
   cuando un archivo baja: `npx vitest run __tests__/voseo-ratchet.test.ts` dice cuáles).
3. `npx tsc --noEmit` 0, eslint de lo tocado 0 errores, `npx vitest run` completo en verde. Si un test viejo afirmaba un
   texto de tú o de vos, se actualiza el texto esperado; nunca se borra el test.

## REGLA DE PARADA
- **No toques:** `lib/email.ts` y `lib/subscription/**` (los cambia #113, que espera el texto legal), `app/onboarding/**`,
  `lib/onboarding/**` y `components/onboarding/**` (son de U5), `lib/whatsapp-onia/**` (el texto de una plantilla
  aprobada por Meta no se cambia desde el código), `app/(dashboard)/**`, `app/checkout/**`, `prisma/**`, `app/layout.tsx`.
- **`app/api/auth/register/route.ts` también lo cambia #124** (términos aceptados, en espera). Ahí cambiá SOLO literales
  de texto, sin mover, reordenar ni reformatear código, para que los dos se junten sin conflicto.
- No cambies lógica, rutas, códigos HTTP, claves del JSON (`error`, `mensaje`), props ni nombres de archivos: solo
  textos y sus tests. Seguridad igual que hoy: el mensaje de credenciales sigue siendo uno solo para correo y
  contraseña (no revela cuál falló) y no se dice si un correo existe.
- Textos legales no (términos, privacidad, el aviso de consentimiento): si un texto de la lista es legal, anotalo.
- Si un `estado` que muestra la pantalla viene de un módulo fuera de ARCHIVOS, no lo toques: anotalo.
- Vocabulario por rubro: «paciente», «clínica», etc. salen de `lib/onboarding/vocabulario.ts`; en pantallas de usted se
  usa `negocioSu` («su clínica»), nunca `negocio` («tu clínica»). No se edita `vocabulario.ts`.
- Usted correcto y con tildes. Ejemplos: «Revise su correo y su contraseña», «Su cuenta está creada, pero falta
  confirmar su correo. Si no le llegó, revise Spam o pida que se lo enviemos de nuevo», «Escriba su correo y vuelva a
  intentar», «No se pudo conectar. Revise su internet e intente de nuevo», «Listo, se lo enviamos a …», «Verificando su
  acceso», «Escriba el código de 6 dígitos de su app de autenticación», «Espere el siguiente código y pruebe de nuevo»,
  «Solicite su acceso y lo contactamos…». Botones en infinitivo o de usted («Crear mi cuenta», «Ingresar»), nunca «Entrá».
- **La línea base del trinquete** la cambian también U3, U5, #113 y #124. Si choca, la línea correcta es la base más
  los deltas de cada rama, nunca uno de los dos lados.
- Si después de dos intentos `tsc` o la suite siguen en rojo por algo fuera de ARCHIVOS, pará y anotalo en el resumen.

## ARCHIVOS
- Pantallas: todo `app/(auth)/**` (login, `LoginForm.tsx`, `ReenviarConfirmacion.tsx`, 2fa, register, `SignupForm.tsx`,
  `CamposWhatsapp.tsx`, `VerificarWhatsapp.tsx`, `verificar-whatsapp-estado.ts`, `AccessRequestForm.tsx`) y
  `app/verify-email/page.tsx`.
- Componentes que esas pantallas muestran: `components/auth/**`.
- Mensajes que esas pantallas muestran y vienen del servidor: `app/api/auth/**` y `lib/auth/**`.
- Sus tests (`*.test.*` de esas carpetas), `__tests__/voseo-ratchet.linea-base.json` y el test nuevo.

## Resumen final (para la madre)
Archivos tocados, números de `tsc`/eslint/vitest, el test que se puso rojo a propósito, lo que quedó en la línea base y
los textos compartidos, legales o de `lib/whatsapp-onia` que no tocaste. La revisa, la integra con `master` y la
publica Plataforma: son textos de producto y salen sin esperar a Sergio Urcullo.
