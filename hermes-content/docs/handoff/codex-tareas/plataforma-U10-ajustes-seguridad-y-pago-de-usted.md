---
id: plataforma-U10
carril: plataforma
estado: pendiente   # pendiente | lanzada | PR | hecha | bloqueada
modelo: gpt-6.1-sol # solo textos y sus pruebas, pero cada frase se decide con quién la lee y en qué momento
repo: onia-platform
rama: codex/u10-ajustes-seguridad-y-pago-de-usted
base: master        # medido sobre master 0b25e289 (11-oct); si U8, U9 y V1 ya entraron, parte de ahí
pr:
escrita: 2026-10-11 por Hermes-Jarvis (nube), a pedido de MADRE DESARROLLO-INFRA
actualizada: 2026-10-11 por Hermes-Jarvis (nube)
nota: Sale de E24 (restos que dejó #152). La madre pidió «requerimientos-client.tsx:225 y «Intentá de nuevo» en 7 archivos»; medido, esos archivos tienen mucho más que esa frase, así que el contrato los lleva a cero completos. Se excluye la ruta del super-admin (es el back office de Sergio Urcullo, con voseo correcto).
---
# U10 · Ajustes, seguridad, pago del complemento y requerimientos, de usted

Sos Codex. Trabajás SOLO en esta carpeta: un worktree de `onia-platform` que creó la madre, en la rama `codex/u10-ajustes-seguridad-y-pago-de-usted`.
- No uses git: ni consultas, ni cambio de rama, ni commits. La madre verifica la rama, corre la suite completa y abre el PR.
- Si ya hay cambios en la carpeta, una corrida anterior se cortó: revisá los archivos y seguí desde ahí.
- Nadie contesta preguntas mientras corrés. Decidí con este documento y el código; lo que no puedas decidir, anotalo en el resumen final.
- Sin push, sin `npm install` (usá el `node_modules` que la madre te dejó enlazado), sin producción, sin red. NO commitees.
- **Escribí los archivos en UTF-8 sin BOM y no cambies ningún carácter que no sea ASCII por `?`.** El editor de Windows ya rompió acentos en dos tareas del 11-oct. Al terminar, buscá `?` entre letras y un BOM al inicio en cada archivo que tocaste.

## META
Regla de Sergio Urcullo: a los clientes y prospectos se les habla de **usted**. Los restos que dejó `usted-todo` (#152) están en las pantallas donde el dueño **configura, protege su cuenta, paga el complemento del agente y revisa lo que le entregan sus clientes**. Hermes los midió el 11-oct sobre `master` `0b25e289` con las listas del gate de segunda persona más las formas con tilde y los clíticos que ese gate no ve.

**Seis archivos** (cada uno se lleva a cero, no solo «Intentá de nuevo»):
1. **`app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.tsx`** (~21 textos): **el pago del complemento del agente**, el momento en que el dueño paga.
   Ejemplos: `L432 «1 · Pagá desde la app de tu banco»`, `L451 «1 · Pagá por transferencia o QR»`, `L453 «Escribinos y te pasamos los datos de pago…»`, `L471 «2 · Subí el comprobante»`, `L520 «Elegí tu banco»`, `L577 «Completá tus datos y subí la captura…»`, `L289 «…los mensajes los pagás vos a Meta, no a Onia»`, `L297/L418 «Los mensajes te los cobra Meta en tu cuenta…»`, `L371 «Se suma a lo que ya tenés»`, `L335/L350 «…verificando tu pago / No pudimos validar tu comprobante»`, `L194/L199` («Intentá de nuevo», «Verificá tu internet e intentá…»), `L220 «Contesta al instante y te pasa lo que no sabe.»` → «le pasa».
2. **`app/(dashboard)/settings/SettingsClient.tsx`** (~25 textos): ajustes del negocio, equipo, QR de cobro, horarios.
   Ejemplos: `L196/L225 «…Intentá de nuevo.»`, `L230/L280/L304/L328/L376/L411 «Revisá tu conexión e intentá de nuevo.»`, `L262`, `L288 «Escribí el nombre del negocio.»`, `L357/L360 «Recargá la página… mirá la lista»`, `L453 «Sin NIT no podés emitir facturas.»`, `L478 «Por ahora entrás solo vos.»`, `L624/L658/L659 «pegá/Pegá el link…»`, `L949 «Tu nombre, contraseña y apariencia»`.
3. **`app/(dashboard)/profile/MfaSection.tsx`** (~21 textos): verificación en dos pasos.
   Ejemplos: `L48/L175 «Recargá la página»`, `L73/L163 «Generá unos nuevos / volvé a intentar»`, `L112 «Revisá la hora del celular y probá…»`, `L141 «Tu cuenta va a quedar protegida solo por la contraseña»`, `L214 «Tu rol exige… Activala para seguir usando el sistema»`, `L242 «Abrí tu app… escaneá este código»`, `L243 «…el código que te muestra»`, `L250 «¿No podés escanear? Cargá esta clave a mano»`, `L294 «Guardá estos códigos de respaldo»`, `L296 «Si perdés el celular, uno de estos te deja entrar»`.
4. **`app/(dashboard)/requerimientos/requerimientos-client.tsx`** (~11 textos): lo que el dueño pide a sus clientes y revisa. **Los de `L313` y `L326` son ejemplos del texto que LEE el cliente final en el portal**: `L313 «Ej.: Agreganos como administrador en tu Business Manager (nunca nos mandes tu contraseña)»` → «Agréguenos… en su Business Manager (nunca nos mande su contraseña)»; `L326 «¿Cómo se llama tu negocio? ¿Qué vendés y a quién?…»`.
   Además `L77 «Elegí… escribí»`, **`L225 «Verificá que el acceso funcione ANTES de aceptar»`**, `L314 «Qué necesitás exactamente…»`, `L344 «Entregas de tus clientes esperando tu decisión»`, `L349 «aparece acá solo»`.
5. **`app/api/organization/qr-cobro/route.ts`** (`L45 «…Intentá de nuevo.»`).
6. **`app/api/portal/requerimientos/entregar/route.ts`** (`L103 «No pudimos guardar el archivo. Intentá de nuevo.»`: lo ve el cliente final en el portal público).

**Se EXCLUYE y no se toca:**
- `app/api/admin/clinics/route.ts`: es solo de `SUPERADMIN` (el back office de Sergio Urcullo; `route.ts:44`). Con él el voseo es correcto.
- `app/(public)/camino-de-fallo.test.ts`: «Intentá de nuevo» ahí es una cadena de **ejemplo dentro de código de prueba**, no un texto de producto.
- `e2e/portal-requerimientos.spec.ts:79` («Agreganos como administradores…»): es un dato de prueba, no una expectativa.

**Falsos positivos de esta lista, que NO se cambian** (no son segunda persona): `Activa` (estado), `Envía confirmaciones y recordatorios por email…` (descripción de una función en tercera persona), `Perderá acceso`, `Aparecerá en los correos`, **`Ya los guardé`** (primera persona de la casilla), `Qué`/`qué` interrogativos y los futuros en tercera persona («verá», «estará»).

## Qué se cambia
- Solo el **texto**, a usted. Pares típicos: «Intentá de nuevo» → «Inténtelo de nuevo»; «Revisá tu conexión e intentá» → «Revise su conexión e inténtelo»; «Recargá la página» → «Recargue la página»; «Pagá» → «Pague»; «Subí» → «Suba»; «Elegí» → «Elija»; «Escribinos» → «Escríbanos»; «Activala» → «Actívela»; «podés» → «puede»; «Sin NIT no podés emitir facturas» → «Sin NIT no puede emitir facturas»; «Por ahora entrás solo vos» → «Por ahora entra solo usted».
- Conservá el sentido y los **datos** (importes, nombres de banco, fechas, el orden de los pasos 1 y 2 del pago).
- Vocabulario por rubro: de `lib/onboarding/vocabulario.ts` (`negocioSu`: «su clínica», «su empresa»…); nunca «pacientes» a mano.

## Pruebas que fijan texto viejo (actualizar la expectativa, nunca borrar el test)
- `app/(dashboard)/settings/addon-chatbot/AddonChatbotClient.qr-estatico.test.ts:43` espera `"Subí el comprobante"` → «Suba el comprobante».
- `lib/subscription/aviso-de-pago-resuelto.test.ts:161` busca `/Subí el comprobante/` en la fuente → «Suba el comprobante».
- `app/(dashboard)/settings/SettingsClient.flujos.test.ts:142, 146 y 151` comparan `"Por ahora entrás solo vos."`: **cambialas las tres** de forma consistente (una espera `true`).
- `e2e/requerimientos-equipo.spec.ts:23` busca `'Verificá que el acceso funcione ANTES de aceptar'` → «Verifique que el acceso funcione ANTES de aceptar». Ese e2e no corre en el CI: no hay quien lo vea fallar, por eso va en el contrato.
- `lib/checkout/medio-de-pago-derivado.test.ts` (líneas 19 y 337) solo cita las frases en **comentarios**: actualizalos si querés que no mientan, pero no hay expectativa que cambiar.

## PRUEBA DE HECHO
1. **Test nuevo `__tests__/ajustes-seguridad-y-pago-de-usted.test.ts`** que renderiza o recorre los seis archivos (`renderToStaticMarkup` donde el componente lo permita; las respuestas de las dos rutas con su `NextResponse`) y falla con tuteo o voseo usando **límites Unicode**, `(?<![\p{L}\p{N}_])…(?![\p{L}\p{N}_])` con la bandera `u`, **nunca `\b`** (en JavaScript `\b` no reconoce la tilde final: `\b(podés|elegí)\b` no coincide jamás). Palabras: `tu`, `tus`, `te`, `ti`, `vos`, `contigo` y las formas medidas arriba (`podés`, `tenés`, `entrás`, `pagás`, `necesitás`, `vendés`, `perdés`, `elegí`, `escribí`, `verificá`, `recargá`, `generá`, `revisá`, `probá`, `volvé`, `abrí`, `escaneá`, `cargá`, `guardá`, `intentá`, `pagá`, `subí`, `completá`, `pegá`, `mirá`, `activala`, `escribinos`, `agreganos`, `mandes`, `acá`). **Hacelo fallar una vez con el texto de hoy** y anotá la salida.
2. **`contarVoseo`** (`__tests__/voseo-ratchet.ts`) sobre el **código fuente** de los seis archivos da 0. (Recibe código, no texto renderizado: la expresión de arriba es la que mira lo renderizado.) Los falsos positivos de arriba no cuentan.
3. **Líneas base:** `__tests__/voseo-ratchet.linea-base.json` baja para los seis archivos; **si el gate de segunda persona (V1) ya está en `master`**, regenerá `__tests__/voseo-ratchet-segunda-persona.linea-base.json` con `node scripts/voseo-segunda-persona-linea-base.mjs`, **no a mano**. Si V1 no está, anotalo: el segundo en entrar la regenera.
4. Las pruebas de la sección anterior, ya actualizadas, y las demás de `settings/`, `profile/` y `requerimientos/`, siguen en verde.
5. `tsc` filtrado por los archivos tocados y `eslint` de lo tocado, en 0. La suite completa la corre la madre.

## REGLA DE PARADA
- **Solo textos y sus pruebas.** No cambies condiciones, importes, claves, ids, `href`, nombres de campo ni el orden de los pasos; en las dos rutas, ni códigos de estado ni la forma de la respuesta (`{ error: … }`).
- No toques `lib/email.ts` (U8), los avisos de plan (U9), el pie legal, la política de privacidad (versión 1.2), los textos legales ni `lib/whatsapp-onia/plantillas.ts` (plantillas aprobadas por Meta).
- No toques `app/api/admin/**` ni nada del back office de Sergio Urcullo.
- La venta nunca exhibe obra: no agregues «próximamente» ni «en construcción».
- Si tras dos intentos algo sigue rojo por una causa fuera de esta lista, pará y anotalo.

## ARCHIVOS
Puede editar: los seis archivos de arriba, las pruebas listadas (solo el texto esperado), `__tests__/ajustes-seguridad-y-pago-de-usted.test.ts` (nuevo) y las líneas base.
Todo lo demás, prohibido.

## Fuera de U10 (anotado para U11, no lo toques)
Con voseo y que ve el cliente: `app/(dashboard)/settings/SeguridadTab.tsx` («Recargá la página», «…e intentá de nuevo»), `settings/PlanClient.tsx` 18, `mi-web/MiWebClient.tsx` 18, `lib/pricing.ts` 9, `components/plan/AsientosCard.tsx` 5, `lib/plan-limits.ts` 4. Con voseo pero **internos** (no se tocan): `app/(dashboard)/admin/web-requests/AdminWebRequestsClient.tsx` y toda ruta `admin`.

## Entrega
«PARA LA MADRE:» con los archivos, los casos **antes → después** por texto (los 80 y pico no hace falta uno por uno: por familias y con diez ejemplos), la salida del test cuando falló a propósito, si V1, U8 y U9 estaban o no en la base, y lo que no pudiste decidir.

## Contexto mínimo
- Onia (Bolivia) vende un sistema de gestión por rubro. **Regla de la casa:** a clientes y prospectos (el dueño del negocio) se les habla de **usted**; el voseo queda solo en el chat con Sergio Urcullo, en su marca personal y en su back office.
- Lección del día (tres veces): **el ejemplo de una prueba sale del sistema real**. Por eso los textos de arriba son líneas reales de `master`.
- Los gates actuales son listas explícitas con línea base que solo baja. Este contrato cierra además lo que esas listas no ven (`Activala`, `Escribinos`, `Agreganos`, `nos mandes`).
