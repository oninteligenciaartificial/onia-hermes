# Skill: seguridad-credenciales

## Objetivo
Proteger credenciales y sesiones personales de la laptop y secretos de servicios
de ONIA. Mantener el acceso de Codex y Claude dentro de las tareas autorizadas.

## Reglas
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
| Higgsfield | Continuar con Google | Título pendiente de confirmación de Sergio | Chrome OnIA |

Si hay varias cuentas Google, confirmar cuál corresponde a la tarea antes de
iniciar una sesión nueva. Mantener y reutilizar las sesiones existentes autorizadas.

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
  y errores sin valores sensibles. No cerrar sesiones vigentes para comprobarla.

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
no se han verificado aún el rellenado de una entrada ni el acceso directo de
Codex/Claude a credenciales. El siguiente paso es cargar las entradas autorizadas
y comprobar el mecanismo disponible para cada tipo de acceso.

Enlace oficial aprobado:
https://chromewebstore.google.com/detail/keepassxc-browser/oboonakemofpalcgghocfoadofidjkkk

Pendiente: confirmar ubicación definitiva de la base, cargar las entradas
autorizadas en la app y conectar el puente compatible con cada agente/navegador.
Comprobar con una cuenta autorizada que se abre la app y que una segunda tarea
reutiliza la sesión; registrar sólo éxito/error y datos no sensibles.
Guardar la regla no equivale a completar esa conexión. Todas estas comprobaciones
son puntuales; volver a revisar disponibilidad cuando una tarea la necesite.

Las instrucciones globales de la laptop (`~/.codex/AGENTS.md` y
`~/.claude/CLAUDE.md`) contienen la regla resumida. Las sesiones nuevas las
leen al arrancar; las tareas ya abiertas deben recibir el aviso y releerlas.

Fuentes oficiales:
- https://keepassxc.org/docs/KeePassXC_GettingStarted
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
cd C:\dev\Expermimentos\Hermes
$env:VPS_HOST="187.77.16.63"
$env:VPS_USER="root"
$env:VPS_PASSWORD="<VPS_PASSWORD>"
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
