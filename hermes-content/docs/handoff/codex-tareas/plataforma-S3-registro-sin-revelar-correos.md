estado: pendiente
modelo: gpt-6-astra (seguridad)
carril: plataforma
origen: nota de Codex en U4 (#148: «el registro ya revelaba si un correo existe») y pedido de la madre del 11-oct. Escrita el 11-oct por Plataforma (session_01HhnFgkeF6nLGvjrfjt1o2C). Líneas medidas en la rama de #152 con U4 adentro; en `master` cambian solo los textos.
medido: en producción `ONIA_REGISTRO_CONFIRMA_CORREO=si` (`/opt/onia-platform/app.env`, 11-oct). El alta pasa por `signUp()` y el cliente ya tiene que confirmar el correo, así que el arreglo no agrega pasos.

# S3 · El registro no revela si un correo ya tiene cuenta en Onia

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-s3`. La madre la prepara desde `origin/master` con #152 y U4 ya mergeados y te
pasa el SHA base. No hagas git: la madre revisa, corre `tsc` y la suite completa, commitea y abre el PR.

## META
`app/api/auth/register/route.ts`, en el camino con confirmación de correo (`registroConfirmaCorreo()`, el de producción), contesta
409 «Este correo ya está registrado. Inicie sesión.» en dos casos:
- **El correo ya está confirmado.** GoTrue lo oculta a propósito: devuelve un usuario con `identities` vacío. El código deshace eso
  y contesta 409 (cerca de la línea 288).
- **El correo existe sin confirmar.** GoTrue reenvía el mail y devuelve el usuario con su `created_at` viejo; el código contesta 409
  (cerca de la línea 311).

Con eso, cualquiera puede averiguar si una persona o una clínica usa Onia probando correos en `/register`. El límite
`authLimiter` lo frena, pero no lo impide.

## Qué hacer
1. **En el camino con confirmación**, los dos casos contestan EXACTAMENTE lo mismo que un alta nueva: mismo status, mismo cuerpo
   y mismas cabeceras. Además:
   - no se provisiona ninguna organización;
   - no se borra ni se toca la cuenta existente: el comentario de las líneas 296-308 explica por qué borrarla sería grave.
2. **Al dueño del correo le llega un aviso**, para que no se quede esperando una confirmación que no va a llegar:
   - Asunto: «Ya tiene una cuenta en Onia».
   - Texto: «Alguien intentó crear una cuenta de Onia con este correo. Si fue usted, ya tiene una: inicie sesión o recupere su
     contraseña en https://app.onia.com.bo/login. Si no fue usted, no tiene que hacer nada.»
   - Va por `lib/email.ts` (servidor propio `onia-mail`), de usted y sin datos de la cuenta.
   - Si el correo no está confirmado, no se manda: GoTrue ya reenvió la confirmación.
   - Como máximo un aviso por correo cada hora, con el limitador de Redis que ya usa la ruta. Así nadie usa a Onia para mandar
     spam.
   - Si el envío falla, se registra con `captureSentryError` y la respuesta no cambia.
3. **El camino sin confirmación (`createUser`, apagado en producción) queda como está:** ahí el alta entra directo y no se puede
   contestar igual sin cambiar el producto. Dejá un comentario que lo diga y que apunte a este contrato.
4. **La pantalla (`SignupForm.tsx`) no cambia:** muestra el mismo «revise su correo» en los tres casos. Si hoy tiene una rama para
   el 409 de correo repetido, que siga funcionando para el camino sin confirmación.

## PRUEBA DE HECHO
Primero en rojo con el código de hoy; anotá cuáles fallaron.
- `route.test.ts`, en el camino con confirmación:
  - correo nuevo, correo confirmado ya existente y correo sin confirmar dan el mismo status y el mismo cuerpo, comparados con
    `toEqual`;
  - en los dos casos de correo existente no se llama a `provisionOrganization` ni a `deleteUser`;
  - con el correo confirmado existente sale un aviso, con el no confirmado ninguno, y un segundo intento dentro de la hora no
    manda otro;
  - si el envío del aviso falla, la respuesta es la misma y queda el registro en Sentry.
- Los tests del camino sin confirmación siguen en verde, sin cambios.
- `npx tsc --noEmit` 0, eslint de lo tocado 0 y `npx vitest run` completo en verde.

## REGLA DE PARADA
- Solo `app/api/auth/register/**`, la función de aviso en `lib/email.ts` (o un archivo nuevo en `lib/auth/`) y sus tests.
- Sin migraciones. No toques GoTrue, `app.env` ni la configuración de Supabase.
- No cambies `/login` ni la recuperación de contraseña: el login ya decide por `code`, no por texto (Hermes E10).
- Si después de dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## Entrega
Sección «PARA LA MADRE:» con:
- los archivos;
- los números de tsc, eslint y vitest;
- los tests que se pusieron rojos con el código viejo;
- cómo quedó el límite de avisos y qué devuelve si se pasa.
