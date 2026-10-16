# Contrato 09 — transporte Codex y continuidad cloud: evidencia acotada

Fecha de observación: 2026-10-16, UTC. Owner CODE: este worker; coordinador:
`01a14185-4a94-7b60-8214-bf9943c9ec8f`.
Base exacta: `0cdb8f45a33fa99d93480c345625df01bd21463d`; árbol
`3ebcca5349652f95838d4043054c1cb99c95bb41`.
Directorio observado: `/workspace/hermes-native-bridge-work`, snapshot hidratado
por GitHub; no es un checkout Git actualizado. Modelo configurado/observado:
`UNKNOWN`. Sólo este reporte se publica; sin cambios a código, CODEX ni docs madre.

## Resultado

**Existe documentación oficial para usar autenticación de cuenta Codex en CI
privado, incluidos runners GitHub-hosted efímeros. No se ha probado aquí su login,
ejecución ni facturación efectiva. Tampoco acredita acceso al thread durable de
la app.** Es incorrecto concluir que suscripción en CI es imposible por no existir
una herramienta dedicada en este worker.

La [guía oficial de auth CI avanzada](https://learn.chatgpt.com/docs/auth/ci-cd-auth)
describe conservar la sesión gestionada por Codex, permitir su renovación normal
y guardar el estado renovado entre jobs efímeros. Exige infraestructura privada
confiable, custodia segura y un flujo serializado por copia de sesión; no aplica
a repos públicos ni a tokens externos de un host. La continuidad puede requerir
reseeding y no es indefinida. El repo fue observado como **privado** mediante
metadata GitHub. No se leyó, copió, restauró ni modificó ninguna credencial.

La [autenticación general](https://learn.chatgpt.com/docs/auth) distingue cuenta
ChatGPT de API key y recomienda API keys para CI general; esa recomendación no
elimina el patrón avanzado anterior. Los access tokens Enterprise dependen de
permisos y entitlements que aquí son UNKNOWN. No se eligió API facturada.

La [acción oficial](https://learn.chatgpt.com/docs/github-action) ejecuta Codex CLI
en el runner. Su [README observado](https://github.com/openai/codex-action/blob/main/README.md),
blob `48ed865f3c12675c9fd4448466851c617e99466d`, requiere una API key para el flujo
descrito. No equivale al patrón de cuenta gestionada ni al thread cloud durable.
No se instaló ni ejecutó la acción.

## Matriz: soporte documental, prueba y límites

| Capacidad | Soportado / evidencia | Probado en este contrato | Estado pendiente |
|---|---|---|---|
| Codex CLI no interactivo con cuenta gestionada en CI privado | Sí, patrón oficial avanzado | Ayuda CLI y documentación; ningún job | Auth, refresh, uso de suscripción y retorno de archivos: UNKNOWN |
| Ese CLI en Actions controla el thread durable existente de la app | No establecido por las fuentes leídas | No | Endpoint, permisos y binding de host/thread: UNKNOWN |
| `codex cloud exec/list` | Ayuda experimental disponible; antecedente del coordinador produce `task_e` | Sólo `cloud --help`; no exec/list nuevos | Excluido como sustituto legacy |
| App-server, historial y remote Code Mode host | Protocolo documentado, transporte remoto experimental | Sólo `app-server --help` | No endpoint autenticado ni acceso al durable verificado |
| Herramientas de thread de la app disponibles a root | Antecedente comunicado por coordinador; no herramienta equivalente expuesta aquí | No invocadas | No presumir acceso desde Actions ni desde este worker |
| Claude routines cloud y API `/fire` | Documentación oficial y código existente en main | Lectura estática; ningún disparo | Token, rutina, entorno y permisos efectivos: UNKNOWN |
| Respuesta Claude por Git firmada | Colector implementado en main | Lectura estática; no colecta real | No prueba artefactos JSON del harness ni ejecución cloud por sí sola |
| Recuperación/QA del harness | Implementado en base 0cdb8f4 | Sin repetir tests del contrato 08 | 77 PASS históricos; seis casos sink bloqueados; regresión incompleta |
| Autonomía total / PC-off | Objetivo | No | Transporte operativo, custodia, persistencia y coordinador cloud no probados |

El [app-server oficial](https://learn.chatgpt.com/docs/app-server) ofrece
`thread/read`, paginación de items, autenticación y conexión a un Code Mode host
remoto indicado por el caller. No demuestra que una nueva instancia local/runner
vea los threads de la app ni exporte sus archivos. Su transporte WebSocket/host
remoto es experimental y no está soportado para producción según esa página.
No se inició servidor ni listener; no se inventó URL o API interna.

## Claude: capacidad existente que debe reutilizarse

Leídos por GitHub desde `main` y verificados de nuevo en el SHA observado
`2cdefca738ed85d87f50e6dc3dc6c31a5aa698f9`:

- [`pedido-claude.sh`](https://github.com/oninteligenciaartificial/onia-hermes/blob/2cdefca738ed85d87f50e6dc3dc6c31a5aa698f9/scripts/loops/pedido-claude.sh),
  blob `b805ebe8c67220ff9aa546f08139f22c1e983f5f`: POST a routine `/fire`, header
  beta `experimental-cc-routine-2026-04-01`, payload de texto y recepción de ID/URL
  de sesión. Incluye código humano por pedido, candado, límites, sello y registro
  de outcomes ambiguos para impedir duplicados. No ejecutar `--estado`: imprime
  configuración de rutina y no es necesario para este contrato.
- [`respuestas-pedidos.sh`](https://github.com/oninteligenciaartificial/onia-hermes/blob/2cdefca738ed85d87f50e6dc3dc6c31a5aa698f9/scripts/loops/respuestas-pedidos.sh),
  blob `197573edaeb45beb790ad7109effa5f41ffd78c5`: colecta `respuesta/<id>`, exige
  commit sin padres y árbol vacío, valida HMAC-SHA256 ligado al pedido, límites
  de transferencia/commit/texto y evita entregas repetidas. Entrega texto por la
  aduana; no constituye exportación autenticada de archivos del harness.

Las [routines oficiales Claude](https://code.claude.com/docs/en/routines)
documentan ejecución cloud con triggers de horario, API y GitHub, en planes
elegibles. Confirman que falta de CLI Claude aquí no implica falta de capacidad.
Su existencia documental no verifica los secretos ni configuración de ONIA.
Los defaults de los scripts apuntan a rutas/cron de VPS: **no se ejecutaron ni se
propone reactivar ese VPS**. Reutilizar su contrato exige comprobar su host cloud
permitido, disponibilidad del código de confirmación y binding al harness; el
script existente no debe convertirse en otra cola u orquestador.

## Comandos y resultados saneados

Todos los subprocesos se llamaron con argv mediante Python `subprocess.run`,
`capture_output=True`, timeout 20 s, sin interpolación de entradas ni prompt real.

```text
cwd -> /workspace/hermes-native-bridge-work
command presence -> codex=/opt/codex/bin/codex; claude=AUSENTE; gh/git=PRESENTES
codex --version -> exit 0; codex-cli 0.159.2
codex cloud --help -> exit 0; exec/status/list/apply/diff (experimental)
codex app-server --help -> exit 0; --code-mode-host, --listen, --ws-auth
codex exec --help -> exit 0; non-interactive, resume/fork/review, --json
codex login --help -> exit 0; --with-api-key, --with-access-token, --device-auth
stderr común -> could not create PATH aliases: Read-only file system (os error 30)
```

Metadata únicamente: `config.toml` existe; presencia de las claves seleccionadas
`preferred_auth_method`, `forced_login_method`, `cli_auth_credentials_store`,
`model_provider`, `model`, `profiles`, `mcp_servers`: todas false. No se publicaron
valores de configuración. `auth.json` en el directorio de usuario por defecto:
ausente, sin abrirlo. Esto **no prueba falta de auth**: puede existir binding,
keyring u otro mecanismo no inspeccionado. Login activo, plan y entitlement:
UNKNOWN. Ningún `login`, `status` autenticado, exec, fire o workflow fue ejecutado.

Inventario de metadata expuesta: `codex_document_control_list_document_sessions`,
`get_document_tool_schemas`, `execute_document_command` describen control de
documentos, no lector de bytes exportados de thread. Lector nativo específico:
AUSENTE en esta superficie. Herramienta Claude dedicada: AUSENTE aquí, pero los
scripts y routines anteriores existen. No se invocaron herramientas de documentos.

## Sink: diagnóstico acotado y siguiente prueba válida

`lstat` volvió a observar `/tmp/.git` y `/workspace/.git`; cualquier fixture bajo
ellos activa `native_result_store.py:124-130`. `/dev/shm` y `/var/tmp` existen sin
marcador en la inspección read-only, pero sus raíces no son privadas (0755/0777),
no están declaradas como raíces de escritura de este contrato, y en los primeros
20 hijos de cada una no se encontró directorio privado de este usuario. La raíz
projectless declarada había resultado inexistente en contrato 08. No se pidió
nuevo permiso, creó raíz, cambió modo del sistema, mount, configuración ni guard.
No se siguió recorriendo el filesystem. No hay sink real probado en contrato 09;
los seis casos permanecen bloqueados, **no PASS**.

## Integración faltante y próximo contrato, sin activarlo

1. Para continuar el **thread durable existente**, root debe proporcionar al
   binding ya implementado un lector autenticado de archivos exportados y evidencia
   independiente de ejecución cloud para ese UUID. Faltan exportador, auth operativa,
   mapeo operación/request/HEAD/paths y verificador QA real; un commit no los prueba.
   Usar los controles de thread que root ya tiene, sin crear otra sesión ni asumir
   que están disponibles a un runner, es el siguiente frente acotado.
2. Como alternativa **documentada para CLI de suscripción en cloud**, preparar
   un contrato separado de Actions privado con cuenta gestionada y custodia
   serializada. No ejecutar aún ni copiar secretos. Debe distinguir la ejecución
   en runner de `codex_app_chat`/host `durable`; no ampliar ese label por inferencia.
   Confirmar que ese runtime satisface el objetivo antes de cualquier dispatch.
3. Primero puede validarse sólo persistencia Python en un runner autorizado:
   raíz privada fuera del checkout y de todo ancestro `.git`, sink sin hook de
   fsync fixture, escritura y reapertura en otro proceso verificando bytes/hash.
   Ejecutar además los seis tests existentes allí. Estos usan un hook de fsync de
   fixture: aunque pasen, no sustituyen la prueba de durabilidad real anterior.
   Sin instalar, crear ni activar workflows en este contrato.
4. Conservar el fire/retorno Claude existente, verificar su despliegue en host
   cloud autorizado y adaptar su evidencia al contrato de artefactos/QA. No
   trasladar sus defaults VPS a producción ni borrar sus confirmaciones humanas.

La alternativa de Actions tiene respaldo documental, no un transporte ONIA
autónomo comprobado. Este reporte no declara pipeline listo ni continuidad PC-off.

## Revisión y publicación

Revisión independiente acotada completada por el mismo `review_native_artifacts`
(configurado `gpt-6-luna`, effort low; modelo observado UNKNOWN), sin nuevo agente,
dispatch o acceso a secretos. Sin hallazgos de afirmaciones no sustentadas; revisó
el reporte contra la evidencia suministrada, sin verificar nuevamente URLs ni
metadata remota. No ejecutó tests por tratarse de un reporte sin cambios de código.
Publicación prevista: un solo archivo de reporte sobre árbol base exacto y CAS
desde `0cdb8f45a33fa99d93480c345625df01bd21463d`; sin main/PR/merge/deploy.
