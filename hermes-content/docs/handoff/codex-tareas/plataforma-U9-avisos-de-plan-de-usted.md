---
id: plataforma-U9
carril: plataforma
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6.1-sol # solo textos y sus pruebas, pero hay que decidir cada frase con el contexto de quién la lee
repo: onia-platform
rama: codex/u9-avisos-de-plan-de-usted
base: master        # medido sobre master 1db726a7 (11-oct); si U8 y V1 ya entraron, parte de ahí
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube), a pedido de MADRE DESARROLLO-INFRA
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Sale del mapa E21/E23 de la cola de hermes-jarvis. Cubre los avisos de plan y vencimiento que ve el dueño dentro del sistema y por API. Los correos son de U8, no de acá.
---
# U9 · Los avisos de plan y de vencimiento que ve el cliente, de usted

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama `codex/u9-avisos-de-plan-de-usted`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama, corre la suite completa y abre el PR.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install` (usá el `node_modules` que la madre te dejó enlazado), sin producción, sin red. NO commitees.
- **Escribí los archivos en UTF-8 sin BOM y no cambies ningún carácter que no sea ASCII por `?`.** El editor de Windows ya rompió acentos en dos tareas del 11-oct. En `lib/bot-alerts.ts` el HTML usa entidades (`&aacute;`): conservá ese estilo. Al terminar, buscá `?` entre letras y un BOM al inicio en cada archivo que tocaste.

## META
Regla de Sergio Urcullo: a los clientes y prospectos se les habla de **usted**. Los avisos de plan y de vencimiento son los textos que el dueño ve **justo cuando decide pagar o renovar**, y todavía tutean o vosean. Hermes los midió el 11-oct sobre `master` con las listas del gate de segunda persona (V1) más las formas con tilde y los clíticos que ese gate no ve.

Orden de valor (de más a menos importante):
1. **`app/components/TrialBlockedModal.tsx`**: la pantalla que recibe al prospecto cuando termina la prueba de 14 días. Textos reales:
   `L66 «Tu cuenta quedó en solo lectura»`, `L73 «…Podés seguir consultando y exportando todo lo que cargaste; lo que queda frenado es registrar…»`,
   `L89 «Tus datos siguen intactos. Elegí un plan, pagá por QR y volvés a registrar apenas se verifica el pago.»`, `L128 «¿Necesitás ayuda? Escribinos a soporte»`.
   (`L79 «Prueba finalizó:»` es un sustantivo: NO se toca.)
2. **`lib/subscription/aviso-solo-lectura.ts`**: lo que ve el dueño con la cuenta en solo lectura y lo que devuelven en el error las rutas de escritura (`api/patients`, `api/invoices`, `api/payments`, `api/appointments`…).
   `L21 «Tu suscripción venció. Renovala desde Mi plan y volvés a registrar apenas se verifica el pago.»`, `L55 «Tu cuenta está en solo lectura»`, `L57 «Podés consultar y exportar todo lo que cargaste; …»`.
3. **`components/AvisoRenovacion.tsx`**: el aviso fijo del panel (lo monta `app/(dashboard)/layout.tsx`).
   `L32 «Tu plan vence hoy» / «…mañana» / «…en N días»`, `L50 «Pagar antes no te quita días: el mes nuevo arranca cuando venza el actual.»`.
4. **`lib/subscription/vencimientos.ts`**: el texto de cada vencimiento (plan y complemento del agente), que usa `app/api/cron/renewal-reminders/route.ts`.
   `L160-164` («Tu agente conversacional venció: dejó de contestar», «…está por vencer», «Tu asistente dejó de contestar el chat de tu web y tu WhatsApp», «Pagar antes no te quita días.») y
   `L172-175` («Tu plan venció. **Renovalo** para seguir registrando», «Tu plan está por vencer», «Tu cuenta quedó en solo lectura (los datos están intactos).», «Pagar antes no te quita días.»).
5. **`lib/bot-alerts.ts`**: avisos de error del agente conversacional al dueño. `L38`, `L80 («Conectá tu bandeja … para recibirlas acá.»)`, `L133`, `L144` (HTML: «revis&aacute; lo que sabe tu asistente en …»), `L156`.
   **Hermes no encontró ningún llamador** (solo un comentario en `lib/chatbot/cupo.ts:313`): cambiarlo es barato y va último.

Formas reales a erradicar en estos cinco archivos (medidas, no supuestas): `tu`, `tus`, `te`, `podés`, `cargaste`, `Necesitás`, `Elegí`, `pagá`, `volvés`, `Renovalo`, `Renovala`, `Conectá`, `revisá`, `Escribinos`, `acá`.
**Ojo: `Renovalo`, `Renovala`, `volvés` y `Escribinos` no los ve ni `contarVoseo` (`__tests__/voseo-ratchet.ts`) ni el gate de segunda persona (V1)**: la prueba de abajo las trae explícitas.

## Qué se cambia
- Solo el **texto** de esas cadenas, a usted: «Su cuenta quedó en solo lectura», «Puede seguir consultando y exportando todo lo que cargó», «Elija un plan, pague por QR y podrá volver a registrar apenas se verifique el pago» (la segunda mitad cambia de modo: «volvés» no se vuelve «vuelve», que mezclaría imperativo con indicativo), «¿Necesita ayuda? Escríbanos a soporte», «Pagar antes no le quita días», «Renuévelo», «Conecte su bandeja… para recibirlas aquí», etc.
- Conservá el sentido de cada frase: lo que **sigue funcionando** (consultar y exportar) y lo que **queda frenado** (registrar) tienen que decirse igual de claro. La prueba `app/components/trial-vencido-cumple-la-promesa.test.ts` vigila que la pantalla ofrezca ver los datos: **conservá el botón «ver mis datos»** y que no diga «bloqueado».
- Si una frase usa el vocabulario del rubro, tomalo de `lib/onboarding/vocabulario.ts` (hay `negocioSu`: «su clínica», «su empresa»…); nunca «pacientes» a mano.

## PRUEBA DE HECHO
1. **Test nuevo `__tests__/avisos-de-plan-de-usted.test.ts`** que recorre **todas las ramas**, no un solo caso:
   - `TrialBlockedModal` con `renderToStaticMarkup` (como `pantallaDelVencido()` del test existente) en los dos estados que acepta (prueba terminada y con gracia vencida);
   - `AvisoRenovacion` para «vence hoy», «vence mañana» y «vence en N días»;
   - las funciones exportadas de `aviso-solo-lectura.ts` y de `vencimientos.ts` en todas sus ramas (plan y complemento del agente; vence en N días / vence hoy / venció; solo lectura con y sin `comoSeRenueva`);
   - los constructores de texto y HTML de `bot-alerts.ts`.
   Debe **fallar** con tuteo o voseo usando **límites Unicode**, `(?<![\p{L}\p{N}_])…(?![\p{L}\p{N}_])` con la bandera `u`, **nunca `\b`** (en JavaScript `\b` no reconoce la tilde final: `\b(podés|elegí)\b` no coincide jamás). Palabras: `tu`, `tus`, `te`, `ti`, `vos`, `contigo` y las formas medidas de arriba (`podés`, `cargaste`, `necesitás`, `elegí`, `pagá`, `volvés`, `renovalo`, `renovala`, `conectá`, `revisá`, `escribinos`, `acá`).
   **Hacelo fallar una vez con el texto de hoy** (cada archivo) y anotá la salida en el resumen.
2. **`contarVoseo`** (`__tests__/voseo-ratchet.ts`) sobre el **código fuente** de los cinco archivos da 0. (Recibe código, no texto renderizado: usalo así; la expresión de arriba es la que mira lo renderizado.)
3. **Líneas base**: `__tests__/voseo-ratchet.linea-base.json` baja para los archivos tocados; **si el gate de segunda persona (V1) ya está en `master`**, regenerá `__tests__/voseo-ratchet-segunda-persona.linea-base.json` con `node scripts/voseo-segunda-persona-linea-base.mjs`, **no a mano**. Si V1 no está, anotalo: el segundo en entrar (U9 o V1) la regenera. **Orden de las claves (medido el 11-oct, E29):** el archivo `master` está en el orden de `localeCompare(b, "en")` (el de `contarArchivos`, `__tests__/voseo-ratchet.ts:55`: `chatbot/…` antes de `PlanClient`). Tres PRs seguidos lo reescribieron en orden ASCII (mayúsculas primero) y chocaron entre sí. **La línea base solo cambia en los VALORES: no reordenes ninguna clave.** Al terminar, `diff` contra el archivo de `master` ignorando valores: cero líneas movidas, y las líneas cambiadas son exactamente las claves que bajaron.
4. Siguen en verde: `lib/subscription/vencimientos.test.ts` (fija «dejó de contestar»: la frase se conserva con «Su asistente dejó de contestar…»), `app/components/trial-vencido-cumple-la-promesa.test.ts` (**si U8 ya cambió «tus datos» a «sus datos» en el correo del día 14, la expectativa «seguir consultando tus datos» es de U8**; acá no la toques salvo que el texto de la pantalla la rompa) y `app/api/chatbot-canal-web/route.test.ts` / `chatbot-canal-whatsapp/route.test.ts`.
5. `tsc` filtrado por los archivos tocados y `eslint` de lo tocado, en 0. La suite completa la corre la madre.

## REGLA DE PARADA
- **Solo textos y sus pruebas.** No cambies condiciones, importes, fechas, formatos de fecha, claves, ids, `href`, destinatarios ni el orden de las ramas.
- No toques `lib/email.ts` (es de U8), el pie legal, la política de privacidad (versión 1.2), los textos legales ni `lib/whatsapp-onia/plantillas.ts` (plantillas aprobadas por Meta: no se editan sin reaprobarlas).
- No cambies una frase de venta a «estado de obra» («próximamente», «en construcción»): la venta nunca exhibe obra.
- Si el texto de `aviso-solo-lectura.ts` viaja en una respuesta de API que una prueba de ruta compara literal y esa prueba no está en la lista de arriba, **actualizá la expectativa** (nunca borres el test) y anotalo.
- Si tras dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## ARCHIVOS
Puede editar: `app/components/TrialBlockedModal.tsx`, `lib/subscription/aviso-solo-lectura.ts`, `components/AvisoRenovacion.tsx`, `lib/subscription/vencimientos.ts`, `lib/bot-alerts.ts`, sus pruebas existentes (solo el texto esperado), `__tests__/avisos-de-plan-de-usted.test.ts` (nuevo) y las líneas base.
Todo lo demás, prohibido.

## Fuera de U9 (anotado para U10, no lo toques)
Con tuteo y que también ve el cliente, medidos el 11-oct: `app/(dashboard)/settings/PlanClient.tsx` 18, `app/(dashboard)/mi-web/MiWebClient.tsx` 18, `settings/addon-chatbot/AddonChatbotClient.tsx` 11, `settings/SettingsClient.tsx` 9, `lib/pricing.ts` 9 (descripciones de planes), `components/plan/AsientosCard.tsx` 5, `lib/plan-limits.ts` 4 (mensajes al llegar a un tope), `profile/MfaSection.tsx` 8, `lib/subscription/escrituras-en-solo-lectura.ts` 1.

## Entrega
«PARA LA MADRE:» con los archivos, los casos **antes → después** por texto, la salida del test cuando falló a propósito, si V1 y U8 estaban o no en la base, y lo que no pudiste decidir.

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. **Regla de la casa:** a clientes y prospectos (el dueño del negocio) se les habla de **usted**; el voseo queda solo en el chat con Sergio Urcullo y en su marca personal.
- Lección del día (dos veces): **el ejemplo de una prueba sale del sistema real**. Por eso los textos de arriba son líneas reales de `master`.
- Los gates actuales son listas explícitas con línea base que solo baja. Este contrato cierra además lo que esas listas no ven (`Renovalo`, `volvés`, `Escribinos`).
