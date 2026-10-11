---
id: plataforma-U8
carril: plataforma
estado: lanzada
modelo: gpt-6.1-sol
repo: onia-platform
rama: codex/u8-correos-de-usted
base: master
escrita: 2026-10-11 por MADRE DESARROLLO-INFRA, con el mapa E21 de Hermes (onia-hermes 99c640a8)
---
# U8 · Los correos que le llegan al prospecto y al cliente, de usted

Sos Codex. Carpeta `C:/dev/proyectos/onia-platform-codex-u8`, rama `codex/u8-correos-de-usted` desde `origin/master`.
No hagas git: la madre revisa, corre la suite completa, commitea y abre el PR.

## META
Regla de Sergio Urcullo: a clientes y prospectos se les habla de usted. Los correos de `lib/email.ts` todavía tutean y
vosean (Hermes E21 midió 82 casos): justo los que recibe el prospecto en la prueba de 14 días, antes de pagar.
Por orden de valor:
1. `trialDripCopy` (39: «Vas bien», «Ya cargaste tus…», «para vos, registrá tu día a día», «Activá tu plan»), enviado por
   `app/api/cron/trial-drip/route.ts:249`.
2. `WELCOME_COPY_POR_TRACK` (23) + `WELCOME_COPY_NEUTRAL` (3) + `sendWelcomeEmail` (3): bienvenida de cada alta
   (`app/api/auth/register/route.ts:470`).
3. `addonRenewalCopy` (12): renovación de complementos (`app/api/cron/renewal-reminders`).
4. `sendDoctorAppointmentNotification` (2): sin llamadores; cambiarlo es barato, va último.

## Reglas
- Cada correo tiene versión HTML (con entidades como `&oacute;`) y versión de texto: cambiar LAS DOS.
- Vocabulario por rubro desde `lib/onboarding/vocabulario.ts`, nunca «pacientes» a mano.
- Escribí los acentos como están en el archivo (UTF-8 sin BOM; en HTML, las entidades que ya use el archivo). Antes de
  terminar, buscá en tu diff `?` entre letras y BOM: en esta PC el editor ya rompió acentos una vez (Hermes E12).

## Archivos de prueba que fijan textos viejos (actualizar el texto esperado, nunca borrar el test)
- `lib/subscription/el-aviso-de-mitad-no-inventa-lo-que-falta.test.ts` (importa `trialDripCopy`)
- `__tests__/lib/email-idioma-del-rubro.test.ts` (fija «Responsable» y no «Doctor»)
- `app/components/trial-vencido-cumple-la-promesa.test.ts` es del aviso de trial vencido, NO del correo: no lo toques
  salvo que tu cambio lo rompa.

## PRUEBA DE HECHO
1. Test nuevo `__tests__/lib/correos-de-usted.test.ts`: renderiza el texto y el HTML de cada función de la lista (los 5
   rubros donde aplique) y falla con tuteo o voseo (`\b(tu|tus|te|ti|vos|tenés|podés|querés|vas|cargaste|registrá|activá)\b`,
   sin distinguir mayúsculas, y `contarVoseo` de `__tests__/voseo-ratchet.ts`). Hacelo fallar una vez con el texto de hoy
   y anotalo.
2. `__tests__/voseo-ratchet.linea-base.json` y, si existe en master, la línea base de segunda persona: bajan para
   `lib/email.ts`, nunca suben.
3. tsc filtrado por archivos tocados y eslint de lo tocado en 0. La suite completa la corre la madre.

## REGLA DE PARADA
- No toques el pie legal, la política de privacidad (versión 1.2), los textos legales ni
  `lib/whatsapp-onia/plantillas.ts` (plantillas aprobadas por Meta).
- No cambies lógica, asuntos de envío programado, destinatarios ni rutas: solo textos y sus tests.
- Si después de dos intentos algo sigue rojo por causa fuera de esta lista, pará y anotalo.

## Entrega
«PARA LA MADRE:» con archivos, casos antes → después por función, el test que se puso rojo a propósito y lo que no
pudiste decidir.
