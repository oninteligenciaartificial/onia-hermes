# Skill: seguridad-credenciales

## Objetivo
Proteger credenciales y sesiones personales de la laptop y secretos de servicios
de ONIA. Mantener el acceso de Codex y Claude dentro de las tareas autorizadas.

## Reglas
- Restricción vigente de Sergio, 2026-09-28: las pruebas de autenticación quedaron
  detenidas y luego Sergio autorizó retomar sólo la prueba de Google para
  Higgsfield. SIAT/Impuestos sigue siendo de acceso exclusivamente manual. Los
  agentes no deben abrirlo, iniciar/cerrar sesión, rellenar credenciales ni operar
  su navegador. Una clave guardada en KeePassXC no autoriza ese acceso.
  Sergio reportó una alerta relacionada con términos y condiciones; no se
  verificó jurídicamente su alcance y no se deben intentar vías alternativas.
  Las preguntas anteriores para continuar las pruebas quedan canceladas.
- La prueba retomada exige comprobar rellenado real y resultado del login.
  Sesión previa o vuelta mediante Google sin contraseña no demuestra KeePassXC.
  Antes de actuar, verificar Chrome OnIA, la página correcta y los controles
  visibles del puente. Si el panel de la extensión no es accesible, pedir sólo
  su estado/desbloqueo al usuario; no inspeccionarlo por otra vía ni pedir claves.
- No repetir secretos completos en respuestas.
- Si el usuario pega un secreto, recomendar rotarlo.
- Credenciales personales para agentes: boveda KeePassXC local fuera del repo.
- Secretos de servicios existentes en el VPS: su mecanismo de credenciales o
  variables ya configurado (incluido `/root/.hermes/.env` cuando corresponda).
  Esta regla no autoriza migrar o modificar secretos de produccion.
- Para verificar, mostrar solo `<set>` o longitud aproximada.

## Acceso local de Codex y Claude a apps personales

Origen y vigencia: instrucción explícita de Sergio Urcullo, 2026-09-28.
El objetivo es reutilizar las credenciales autorizadas y las sesiones vigentes
de su laptop para reducir logins repetidos y operar sus apps web.

### Alcance y ubicación

- La bóveda escogida es KeePassXC en Windows. Ruta propuesta:
  `C:/Users/PC/BovedaPrivada/Agentes.kdbx`. Es un archivo local fuera del repo;
  confirmar que existe antes de depender de él. No crearlo con una contraseña
  conocida por el agente ni cambiar su cifrado sin indicación de Sergio Urcullo.
- Aplica a Codex y Claude Code que ejecuten herramientas locales bajo el usuario
  autorizado. Claude web, agentes de nube, WSL u otro equipo no heredan acceso
  a la bóveda o al navegador automáticamente.
- El VPS de ONIA Platform mantiene su función de producto. Esta regla no
  autoriza alojar allí la bóveda personal, copiarle cookies o abrir un servicio
  de acceso remoto al navegador.
- KeePassXC cifra las entradas dentro del archivo; usarlas requiere descifrarlas
  en el proceso autorizado. Los grupos de una base no son barreras de permisos:
  quien obtiene su clave maestra puede acceder al conjunto de esa base.

### Antes de pedir otro inicio de sesión

1. Comprobar únicamente presencia de la base y disponibilidad del mecanismo
   autorizado para la cuenta de la tarea; no inspeccionar ni imprimir sus valores.
2. Revisar la sesión de la app usando la herramienta de navegador disponible
   y sus permisos. Si sigue vigente, reutilizarla y continuar el trabajo.
3. Si la app admite el flujo requerido por CLI/API oficial y ya hay autorización
   local, reutilizarla. Un login web de Google no implica login de la CLI.
4. Si falta autenticación, usar el puente de credenciales configurado para
   esa cuenta. Una base abierta en KeePassXC no habilita automáticamente
   `keepassxc-cli`, Playwright ni otro proceso; cada integración debe configurarse.
5. Si falta la base, el puente o el acceso del navegador, indicar exactamente
   qué falta. No afirmar que todas las apps están conectadas porque existe
   una regla. Preparar lo reversible que no requiera claves ni instalaciones.
6. Pedir a Sergio Urcullo sólo la intervención humana necesaria para desbloquear
   en KeePassXC/Windows Hello si está disponible, autorizar Google, dar
   consentimiento o resolver MFA/CAPTCHA. Nunca pedir su contraseña maestra
   en el chat ni intentar evadir controles de autenticación.

La autorización existente para usar una cuenta dentro de una tarea se conserva.
No volver a pedir permiso para cada lectura o paso si ya está autorizado y
la sesión sigue vigente. La sesión puede caducar o ser revocada.

### Credenciales y perfiles

- El puente entrega la credencial al proceso que la utiliza, sin devolverla
  como texto al modelo, stdout, logs, historial del shell, capturas, docs o Git.
  No ejecutar exportaciones completas ni comandos que impriman claves.
- No guardar la contraseña maestra en scripts, argumentos, variables, memoria
  del agente o notas. La introduce Sergio Urcullo directamente en la aplicación.
- Usar sesiones existentes autorizadas cuando la herramienta pueda acceder a
  ellas. Si se configura Playwright persistente, emplear un perfil dedicado
  fuera del repo, por ejemplo `C:/Users/PC/BovedaPrivada/BrowserProfiles/<cuenta>`.
  Ese perfil contiene credenciales de sesión; proteger su carpeta y comprobar
  el cifrado del disco antes de tratar el perfil completo como cifrado.
- No iniciar con `launchPersistentContext` un proceso nuevo sobre el directorio
  principal de Chrome: para eso se usa un perfil dedicado. Es válido reutilizar
  el Chrome existente con un conector autorizado que ya controle sus pestañas.
- No copiar perfiles entre worktrees ni abrir dos procesos con el mismo
  `userDataDir`. Coordinar su uso con un único navegador/worker o un bloqueo
  antes de trabajar en paralelo.
- Respetar las restricciones de la herramienta de navegador disponible. Tener
  Playwright instalado no habilita una vía alternativa cuando el entorno
  exige otro proveedor o no concede acceso al navegador.
- No exponer CDP ni un puerto de control del navegador a Internet. Una red
  privada, un worker remoto o cualquier instalación requieren preparación y
  autorización específica, y no forman parte de guardar esta regla.

### Acceso y acciones

El acceso sirve para ver y operar las apps habilitadas dentro de la tarea.
No amplía por sí mismo el permiso a pagos, consumo de créditos, generaciones
pagadas, publicaciones, mensajes a terceros, borrados o cambios de producción.
Se mantienen las aprobaciones existentes del proveedor y del proyecto.

Para Higgsfield rige `hermes-content/docs/HIGGSFIELD_VIDEO_SYSTEM.md`: CLI
oficial para operaciones soportadas; controles exclusivos de web según el
flujo manual autorizado. No montar producción o descargas por Playwright web
desde el VPS. Cotizar y aprobar el gasto según la regla vigente antes de generar.

Antes de descargar o instalar cualquier componente (incluidos extensiones,
plugins, dependencias que `npx` descargue o navegadores de Playwright), explicar
su nombre, origen y propósito y esperar aprobación explícita de Sergio Urcullo.

### Identificar la cuenta Google para los agentes

Convención propuesta para la entrada de Google: un título que distinga la cuenta,
por ejemplo `Google — Personal` o `Google — ONIA`; etiquetas `google`, `sso`
y `agentes`, añadidas por separado. Las etiquetas sólo organizan la entrada:
no conceden permisos ni configuran un puente de acceso.

Texto sugerido para Notas dentro de KeePassXC:
`Cuenta Google usada para acceder a apps mediante Continuar con Google, incluido
Higgsfield. Reutilizar la sesión autorizada de Chrome OnIA. Si Google solicita
verificación o consentimiento, pedir intervención de Sergio.`

Las reglas globales de Codex y Claude ya apuntan a este procedimiento. Para
comunicar el acceso, registrar aquí únicamente el título confirmado de la entrada,
la app, el método y el navegador; nunca correo real, contraseña, tokens o cookies.
No asumir que una nota en la bóveda es visible para los agentes ni que su título
concede acceso: se necesita la herramienta y el puente autorizados disponibles.

| App | Método | Entrada Google | Navegador |
|---|---|---|---|
| Higgsfield | Continuar con Google | `OnIA-Agentes-Windows-Chrome` (título informado por Sergio) | Chrome OnIA |

Si hay varias cuentas Google, confirmar cuál corresponde a la tarea antes de
iniciar una sesión nueva. Mantener y reutilizar las sesiones existentes autorizadas.

### Acceso con mínima exposición

Para operar apps web, preferir el navegador autenticado con su conector autorizado.
La contraseña maestra permanece con Sergio; el agente no recibe un volcado de la
bóveda ni necesita leer contraseñas para reutilizar una sesión vigente.

Recomendaciones de configuración, pendientes de comprobar en la UI de Sergio:
- KeePassXC-Browser: permitir sólo la entrada seleccionada para el sitio concreto,
  por ejemplo `https://accounts.google.com`, manteniendo confirmación para entradas
  o sitios nuevos. No ampliar la URL a todos los dominios de las apps con Google.
- Las opciones de Integración con navegadores permiten ocultar entradas y desactivar
  la integración de grupos. Son controles del puente; los grupos siguen sin ser
  barreras criptográficas de acceso dentro de una misma base desbloqueada.
- Activar bloqueo automático de la bóveda por inactividad y al bloquear Windows.
  Bloquear la bóveda no elimina las sesiones ya establecidas en las apps web.
- Limitar los sitios y acciones permitidos en los conectores de cada agente según
  la tarea. No usar permisos generales como sustituto de aprobaciones de gasto,
  publicación, mensajes a terceros o producción.

Los permisos de KeePassXC-Browser corresponden al navegador/sitio; no identifican
por separado a Codex y Claude cuando controlan el mismo Chrome. Las instrucciones
de agentes tampoco son un aislamiento del sistema operativo: procesos con acceso
amplio bajo el mismo usuario de Windows comparten sus permisos. Para una frontera
fuerte habría que diseñar un usuario o entorno separado y un puente limitado.
No se ha configurado ese aislamiento ni un servicio remoto en esta tarea.

Claude Code dispone de integración oficial con Claude in Chrome. En una sesión
existente, `/chrome` permite consultar el estado. Requiere la extensión compatible,
sesión Anthropic compatible y permiso para los sitios. La configuración MCP local
revisada no basta para confirmar o descartar esa integración incorporada.
Si falta la extensión u otro componente, explicar nombre, fuente oficial y finalidad
y obtener aprobación antes de instalar; activar permisos sensibles requiere revisión
del alcance en el momento de otorgarlos. No asumir que KeePassXC-Browser es el
conector de navegación de Claude o de Codex.

### Prueba de acceso solicitada por Sergio — 2026-09-28

**Estado al 2026-09-28 (medicion fechada; volver a comprobar antes de actuar): pendiente y pruebas pausadas.** En el último intento autorizado,
Codex pulsó Continue with Google, eligió Usar otra cuenta y envió Alt+Shift+U
una vez al campo de correo. La UI completa y la captura de la página mostraron
el campo vacío, sin control visible de KeePassXC. No se completó el ingreso.
El panel de la extensión queda fuera del control del conector disponible.
No está confirmada la causa del fallo ni que el atajo llegue a la extensión.
Sergio autorizó dejarlo anotado: no repetir el mismo intento automáticamente.
Próximo paso: comprobar un mecanismo de rellenado compatible con el conector,
primero con datos ficticios y después con la cuenta autorizada; cualquier
instalación requiere aprobación. Hasta entonces reutilizar sesiones vigentes
autorizadas y solicitar ingreso humano sólo cuando sea necesario. SIAT sigue manual.

| Comprobación | Resultado y alcance |
|---|---|
| Codex abre una pestaña nueva de Higgsfield en Chrome OnIA | Correcto: Assets y menú de cuenta visibles; sin solicitar login ni modificar contenido |
| Reutilización después de recuperar el conector | Correcto: Chrome OnIA volvió a aparecer; una segunda apertura mostró Assets y menú de cuenta sin otro login. La recarga inicial se interrumpió y no se considera una prueba completada |
| Cierre y nuevo acceso en el navegador integrado de Codex | Correcto: se verificó Login después de salir; Continue with Google devolvió menú de cuenta y Assets, sin solicitar contraseña |
| Nuevo acceso en Chrome después del cierre solicitado | Pendiente: Sergio informó un rellenado; la comprobación posterior del agente mostró Sign in de Higgsfield, sin un error visible |
| Entrada Google creada | Informado por Sergio; título `OnIA-Agentes-Windows-Chrome` |
| Detección de la entrada en Google por KeePassXC-Browser | Correcto según prueba manual de Sergio; no se leyó la contraseña ni se verificó su valor |
| Rellenado e inicio de sesión con esa contraseña | No comprobado: primero el atajo del agente dejó el campo vacío; después Sergio informó rellenado y salida. Falta identificar el campo y comprobar el ingreso |
| Asociación KeePassXC-Browser en Chrome OnIA | La captura de Sergio muestra conectado con identificador `OnIA-Agentes-Windows-Chrome`; el identificador de asociación no verifica por sí solo el título de una entrada |
| Conector de Claude | Sergio informó `/chrome`: Enabled / Installed; falta una prueba de acceso a la app desde esa sesión de Claude |
| Bóveda en la ruta local propuesta | No: la base sigue en OneDrive/Escritorio por metadatos; `C:/Users/PC/BovedaPrivada/Agentes.kdbx` ausente |
| Cifrado del disco que contiene el perfil del navegador | No verificable con los permisos actuales; no afirmar que el perfil completo está cifrado |
| Acceso directo a la bóveda o claves por API/CLI | No configurado; no se ejecutaron exportaciones ni comandos que revelen entradas |

La prueba de navegador es independiente de la detección de la entrada. No atribuir
un login persistente previo a una contraseña recién cargada. El resultado se registra
sólo con estado y metadatos no sensibles. Tras una desconexión explícita, comprobar
el inventario disponible y recuperar el mismo Chrome/perfil con su API documentada;
no fijar IDs efímeros ni usar otra vía para eludir políticas o permisos.

Seguimiento de prueba solicitado explícitamente por Sergio: se cerró Higgsfield
en Chrome OnIA y en el navegador integrado de Codex, verificando después el botón
Login. Antes del segundo cierre, el integrado había llegado al menú de cuenta
con Google y conservado Assets en una nueva pestaña. Eso prueba sesión web, no
lectura de la bóveda ni rellenado de contraseña. Después de verificar Login, el
segundo acceso integrado mediante Google volvió a mostrar menú de cuenta y Assets
sin contraseña. Chrome continúa en el formulario Google pendiente de rellenado.
No atribuir automáticamente el puente KeePassXC de Chrome al navegador integrado.

En Chrome se abrió el formulario Google con «Usar otra cuenta» para probar la
entrada guardada sin cerrar las otras sesiones Google. No se observó el control
de KeePassXC y el atajo oficial Alt+Shift+U dejó el campo vacío. Se solicitó a
Sergio comprobar el estado de la extensión con la bóveda desbloqueada, sin
enviar secretos. No inspeccionar su panel protegido mediante otra vía.

Sergio informó que añadió una credencial SIAT. Se abrió el portal durante la
prueba, aunque su petición de cerrar sesión correspondía a Higgsfield. La UI
mostró una sesión existente con «Acceso restringido»; no prueba la contraseña
añadida ni permiso efectivo para operar. Sergio reportó una alerta sobre términos
y condiciones y ordenó detener las pruebas. La pregunta anterior sobre cerrar
SIAT queda cancelada: no esperar ni interpretar una respuesta como autorización
vigente. SIAT queda exclusivamente manual. No se introdujeron claves ni realizaron
trámites, declaraciones o pagos; guardar sólo el estado técnico, sin datos tributarios.

No presentar la vuelta a Higgsfield mediante Google como prueba de rellenado
de KeePassXC. El campo de la prueba permaneció vacío. Tampoco afirmar que una
automatización es admitida por el proveedor o está libre de riesgo de suspensión
sin comprobar sus condiciones y mecanismos oficiales. Las pruebas detenidas no
deben retomarse automáticamente.

Sergio pidió después retomar correctamente la prueba de Higgsfield; esa petición
autoriza únicamente Google/Higgsfield y mantiene SIAT manual. Se verificó Chrome
OnIA y el formulario Google: al enfocar el campo seguía vacío, sin un control
visible de KeePassXC. Se solicitó el estado de la extensión a Sergio porque
su panel protegido no es operable mediante el conector disponible. No se
introdujeron valores inventados ni se enviaron intentos de login vacíos.

Revisión independiente de documentación: las páginas de sólo usuario pueden
necesitar la opción Username-only en Site Preferences de KeePassXC-Browser.
La ausencia de icono no demuestra esa causa. El atajo pertenece a comandos
del navegador; no está comprobado que las teclas emitidas por el conector lo
activen. Discriminante solicitado: Sergio enfoca el campo de Google y pulsa
Alt+Shift+U físicamente una vez, informando sólo si rellena. Ese resultado sería
manual y no se debe atribuir a Codex. No cambiar permisos generales ni otros sitios.

Seguimiento: la captura enviada por Sergio muestra la asociación KeePassXC-Browser
conectada y los botones «Redetectar campos de inicio de sesión» y «Permitir
Cross-Origin iframes para el sitio». El panel no aparece en los controles
accesibles del conector de página; el agente no hizo clic ni amplió permisos.
El identificador de asociación no es evidencia independiente del título de una
entrada. Sergio informó «se rellenó pero se salió»; la comprobación posterior
mostró Sign in de Higgsfield sin error visible. Falta confirmar qué campo se
rellenó y qué acción precedió a la salida. No atribuir ese relleno al agente
ni registrar éxito de contraseña o de login.

Se revisaron públicamente los términos de Higgsfield, versión 26-jul-2026:
las secciones 11.12 y 11.13 contemplan agentes por Developer Access/MCP; 5.2
restringe scraping/descarga de páginas y elusión de protecciones. Esa revisión
no garantiza ausencia de suspensión ni prueba compatibilidad de un puente
KeePassXC con el navegador integrado. No convertirla en permiso general
para automatizar cualquier operación web.

Cuando la herramienta entregue sólo diferencias de la UI, pedir un estado
completo antes de deducir presencia o ausencia de Login/menú de cuenta. Una
diferencia sin ese texto no demuestra que el elemento haya desaparecido.

Prueba desde la sesión existente de Claude, cuando su herramienta esté disponible:
`Abre https://higgsfield.ai/asset/all en Chrome OnIA. Confirma únicamente si hay
sesión iniciada y Assets visible. No leas cookies ni contraseñas; no generes,
descargues ni modifiques contenido. Reutiliza esa sesión en una segunda operación.`

### Hermes como punto común de operación

Sergio pidió manejar sus apps desde Hermes con Codex y Claude, reduciendo logins.
El registro no secreto es `hermes-content/config/accesos-personales.json`;
identifica apps, métodos, entrada requerida y evidencia puntual, sin valores privados.
El comando `node scripts/seguridad/acceso-local.mjs --app higgsfield --json` sirve
de comprobación previa local. Sus resultados son metadatos y evidencia guardada:
no autentica, descifra la bóveda ni demuestra una sesión actual por sí solo.

Validación del comando: `node --test scripts/seguridad/acceso-local.test.mjs`.
Las nueve pruebas usan bases ficticias y cubren rutas ausentes, presencia por
metadatos, errores seguros, filtro de apps y el contrato no secreto del registro.

Flujo común: consultar registro, comprobar la herramienta disponible y la sesión
de la cuenta correspondiente, usar el navegador para funciones web o CLI/API oficial
para funciones soportadas, y registrar estado sin secretos. Las claves API requieren
un mecanismo específico que las entregue al proceso autorizado sin devolverlas al
chat. Ese puente sigue sin estar configurado; el registro no lo sustituye.

La cobertura inicial corresponde a los servicios observados en las pestañas del
Chrome OnIA y a la cuenta Google indicada. Una pestaña abierta no prueba login ni
autoriza cualquier operación. Cada app pendiente necesita comprobación de cuenta,
método y herramientas; no inventar que todas utilizan Google ni que todos sus flujos
pueden automatizarse. MFA, consentimiento, restricciones del proveedor y acciones
sensibles mantienen sus intervenciones y aprobaciones.

### Pendiente futuro: navegadores en la nube

El 2026-09-28 Sergio Urcullo pidió anotar para el futuro la opción de
navegadores persistentes en la nube, con acceso privado para Codex y Claude,
para reutilizar sesiones sin depender de que la laptop esté encendida.
Por ahora se mantiene el esquema local y se completa su conexión.

Antes de implementar, evaluar compatibilidad con las herramientas autorizadas,
persistencia y protección de sesiones, acceso privado, costos y autenticación
con la bóveda local. Elegir un entorno separado del VPS de ONIA Platform.
Este pendiente no autoriza contratar servicios, instalar componentes, desplegar
infraestructura ni trasladar la bóveda, credenciales o cookies a otro equipo.
La decisión de proveedor y la implementación requieren aprobación específica.

### Cargar entradas después de asociar el navegador

- Para una cuenta con contraseña, Sergio crea una entrada en KeePassXC con
  título, usuario, contraseña y URL de inicio de sesión del servicio.
  La contraseña se introduce directamente en la aplicación, nunca por chat.
- Para Higgsfield con Google, la credencial corresponde a Google; no inventar
  una contraseña separada de Higgsfield. Conservar la sesión existente y pedir
  intervención humana sólo cuando Google requiera consentimiento o MFA.
- Para claves API, usar entradas separadas e identificar servicio y finalidad;
  guardar el valor en el campo de contraseña o en un atributo protegido.
  La extensión de navegador no configura por sí sola el uso de esas claves
  por CLI/API ni conecta directamente la bóveda a Codex o Claude.
- Comprobar cada integración con la cuenta autorizada, registrando sólo estado
  y errores sin valores sensibles. Cerrar una sesión para probar credenciales
  requiere que Sergio lo pida explícitamente para esa app/cuenta; no extender
  esa autorización a Google u otros servicios.

### Estado y comprobación

El 2026-09-28 se comprobó KeePassXC 2.7.12 instalado. Sergio Urcullo creó una
base `.kdbx` y se confirmó su existencia por metadatos, sin leer entradas.
La primera ubicación fue `OneDrive/Escritorio`; se indicó usar Guardar como
para dejar la base activa en la ruta local acordada fuera de OneDrive.
Verificar de nuevo la ubicación definitiva antes de operar.

También se comprobó que el conector de navegador disponible en Codex puede
leer la sesión ya autenticada de Higgsfield en el Chrome `OnIA` (pantalla Assets
y menú de cuenta presentes). No se generó, descargó ni modificó contenido.
Esto prueba acceso de navegador en Codex a esa cuenta; no prueba acceso al
interior de KeePassXC ni la conexión equivalente de Claude Code.

El proveedor rechazó por política abrir `chrome://extensions/`, por lo que no
se confirmó si KeePassXC-Browser está instalada. No intentar inspeccionarla
mediante vías alternativas que eludan ese rechazo. Sergio Urcullo aprobó el
2026-09-28 instalar la extensión oficial KeePassXC-Browser en Chrome `OnIA`
y conectarla a su bóveda para las credenciales que permita. No pedir de nuevo
esa autorización en esta tarea; no cubre otros componentes o nuevas finalidades.
Abrir la página oficial de Chrome Web Store mediante el conector también
devolvió `Not allowed`. La instalación y la asociación con KeePassXC requieren
el paso manual en la UI protegida; no se descargó ni instaló la extensión.

Procedimiento aprobado: guardar la base activa en la ubicación local acordada;
abrir el enlace oficial que figura abajo y añadir KeePassXC-Browser a Chrome;
en KeePassXC, Herramientas > Configuración > Integración con navegadores,
habilitar la integración y seleccionar Chrome. Con la base desbloqueada,
abrir la extensión, pulsar Conectar y elegir un nombre único como
`OnIA-Agentes-Windows`. Sergio Urcullo confirma la asociación y las entradas
permitidas directamente en la aplicación, sin enviar claves al chat.

Después Sergio informó que tiene la extensión en Chrome, habilitó la integración
con navegadores y completó la asociación. Es un estado reportado por el usuario;
también confirmó la entrada Google y su detección por la extensión. No se han
verificado aún su rellenado ni el acceso directo de Codex/Claude a credenciales.
El siguiente paso es comprobar el mecanismo disponible para cada tipo de acceso.

Enlace oficial aprobado:
https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk

Pendiente: confirmar ubicación definitiva de la base, cargar las demás entradas
autorizadas en la app y conectar el puente compatible con cada agente/navegador.
Comprobar con una cuenta autorizada que se abre la app y que una segunda tarea
reutiliza la sesión; registrar sólo éxito/error y datos no sensibles.
Guardar la regla no equivale a completar esa conexión. Todas estas comprobaciones
son puntuales; volver a revisar disponibilidad cuando una tarea la necesite.

Las instrucciones globales de la laptop (`~/.codex/AGENTS.md` y
`~/.claude/CLAUDE.md`) contienen la regla resumida. Las sesiones nuevas las
leen al arrancar; las tareas ya abiertas deben recibir el aviso y releerlas.

Fuentes oficiales:
- https://higgsfield.ai/terms-of-use-agreement
- https://keepassxc.org/docs/KeePassXC_GettingStarted
- https://github.com/keepassxreboot/keepassxc/blob/develop/docs/topics/BrowserIntegration.adoc
- https://github.com/keepassxreboot/keepassxc-browser/blob/develop/keepassxc-browser/manifest.json
- https://github.com/keepassxreboot/keepassxc-browser/wiki/What's-new-in-1.5.0#5-changes-to-site-preferences
- https://github.com/keepassxreboot/keepassxc-browser/wiki/Extension-details
- https://developer.chrome.com/docs/extensions/reference/api/commands
- https://keepassxc.org/blog/2023-06-20-cve-202335866/
- https://learn.microsoft.com/en-us/windows-hardware/drivers/driversecurity/windows-security-model
- https://code.claude.com/docs/en/chrome
- https://playwright.dev/docs/auth
- https://playwright.dev/docs/api/class-browsertype#browser-type-launch-persistent-context
- https://developers.openai.com/codex/guides/agents-md
- https://code.claude.com/docs/en/memory


## Comandos seguros

Ver claves configuradas sin revelar valores:

```bash
grep -E '^(META_LONG_LIVED_TOKEN|IG_BUSINESS_ACCOUNT_ID|OPENAI_API_KEY|NOTION_TOKEN)=' /root/.hermes/.env | sed 's/=.*/=<set>/'
```

Ver estado Instagram:

```bash
ig-publish healthcheck
```

## Runbook: Rotar token Meta Instagram

1. Obtener un user long-lived token desde Meta.
2. Usar ese token solo para pedir el Page Access Token:

```text
/1140384625819526?fields=name,id,access_token,instagram_business_account{id,username}
```

3. Copiar el `access_token` devuelto por la Page `Onia Marketing`.
4. Verificarlo en Meta Access Token Debugger:
   - `Type: Page`
   - `Expires: Never` ideal
5. Desplegarlo desde Windows:

```powershell
cd C:\dev\proyectos\onia-hermes
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_KEY_PATH="$HOME\.ssh\onia_hermes_vps_ed25519"
$env:IG_BUSINESS_ACCOUNT_ID="17841423363059652"
$env:META_LONG_LIVED_TOKEN="<PAGE_ACCESS_TOKEN>"
npm run deploy:instagram
```

Nota: `META_LONG_LIVED_TOKEN` es el nombre historico del script. Debe contener
el Page Access Token, no el user token.

## Runbook: Validar token

Ejecutar en el VPS o por SSH:

```powershell
ssh root@187.77.16.63 "ig-publish healthcheck"
```

Aceptar solo si:
- `ok` es `true`.
- `debug_token.data.type` es `PAGE`.
- `debug_token.data.is_valid` es `true`.
- `debug_token.data.profile_id` es `1140384625819526`.

Si `expires_at` existe y no es `0`, agendar rotacion antes de esa fecha.

## Runbook: Si el token vence

- Generar un nuevo Page Access Token.
- Repetir `npm run deploy:instagram`.
- Validar con `ig-publish healthcheck`.
- No cambiar codigo ni publicar contenido hasta que el healthcheck vuelva a OK.

## Respuesta ante secreto expuesto
Decir:
- El secreto debe tratarse como expuesto.
- Rotar password/token.
- Actualizar la entrada de KeePassXC o el mecanismo del servicio afectado,
  incluido `/root/.hermes/.env` si es el almacen de ese servicio.
- Reiniciar servicios solo si aplica y existe autorizacion para produccion.
- Buscar y eliminar cualquier copia en Markdown, capturas o logs compartidos.
