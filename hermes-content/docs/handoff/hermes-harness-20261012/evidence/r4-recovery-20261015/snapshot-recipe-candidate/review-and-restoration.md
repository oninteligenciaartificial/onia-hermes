# Receta candidata: revisión, instalación separada y restauración

Estado: PREPARADA LOCALMENTE, NO EJECUTADA. El manifiesto está PENDING_APPROVAL,
con downloads_and_install_approved=false y referencias de aprobación nulas.
No habilita instalaciones, cambios de configuración ni otra tarea Cloud.

## Cambio y evidencia

Se conserva la receta de Git 0e01dc09 y sus 33 nombres APT, cuatro versiones Python,
Chromium 156.0.8078.4/revisión 1248 y directorio /opt/onia-public-browser-1.64.0.
El selector añade solamente el host literal snapshot.ubuntu.com mediante HTTPS,
con ruta /ubuntu/YYYYMMDDTHHMMSSZ y slash final opcional. datetime.strptime valida
la fecha/hora UTC real. La fuente observada es /ubuntu/20260828T000000Z/.
La URI elegida se copia íntegra de la fuente existente; no se reconstruye, sustituye
ni agrega un repositorio. Los selectores archive/security previos siguen vigentes.
No se aceptan opciones extra de confianza, otro Signed-By, credenciales, query,
fragment, subdominios snapshot, puerto distinto o fecha imposible.

Los errores generan un JSON saneado con fase y nombres aprobados no resueltos.
La consulta posterior a update debe resolver los 33 candidatos y sus orígenes;
si cualquiera falta/falla, se detiene antes de install, sin fallback ni sustitución.
La evidencia offline actual contiene 20 candidatos UNKNOWN, 2 NONE y 11 conocidos:
no demuestra disponibilidad del manifiesto. Las firmas locales tampoco demuestran
frescura ni vínculo entre la fuente actual y todos sus índices.

## Contrato exacto: UNA prueba futura setup-only

UUID literal nuevo: `9fc238a7-aa41-433c-8681-a9bf6ec6a340`.
Parent R4: `f90f55bc-48d8-406f-a11e-05ddd2683014`, solo lineage.
Entorno: `6abad782eba0819196ca234dc3abc327`.
Receta exacta: SHA en lineage.json y recipe_sha256 del manifiesto.

Objetivo: instalar solo los 33 nombres APT y cuatro versiones Python del manifiesto,
Chromium 156.0.8078.4/revisión 1248. Fuente observada Noble: HTTPS
snapshot.ubuntu.com/ubuntu/20260828T000000Z/, keyring Ubuntu existente e índices y
payload validados por APT normal. Wheels de PyPI oficial y navegador del CDN
oficial Playwright según receta fija. Ninguna dependencia adicional ni fallback.

Tras consentimiento explícito, UNA tarea Cloud nueva de instalación setup-only;
mantenimiento temporal `:`, sin herramientas del agente ni lanzamiento browser.
El task R4 histórico y sus contadores/leases permanecen intactos.

Materializar el permiso modifica ÚNICAMENTE cuatro campos del manifiesto:
`state`, `downloads_and_install_approved`, `human_approval_reference`,
`operation_authorization_reference`. Escribir el consentimiento NUEVO; referencias
históricas se rechazan. La receta no cambia después de la aprobación.
Regenerar el wrapper: `python -B build_setup_trial_wrapper.py --output setup-trial-wrapper.sh`.
Revisar que solo cambia el manifiesto embebido y sus hashes. El wrapper actual
embebe PENDING y rechaza antes de staging/install.

Guardar los campos originales setup/mantenimiento y sus hashes, política/cache.
Guardar temporalmente wrapper aprobado y mantenimiento `:`, leer de vuelta el
setup exacto y verificar su SHA antes del único submit autorizado.

El wrapper usa /usr/bin/python3 -I -B y staging temporal root-owned/protegido con
receta/manifiesto exactos. Solo tras returncode0 y coincidencia con el recibo real
root-owned protegido de /opt imprime JSON completo real, luego
`ONIA_SETUP_TRIAL_COMPLETED` y exit42 deliberado. set-e impide marcador si falla.
Recuperar JSON/marker/digest del DOM del log, no de una reconstrucción AX ni resumen.
El recibo real vincula UUID nuevo, parent, receta y SHA de los bytes exactos del
manifiesto aprobado. Un exit0 sin recibo no es éxito. Los mocks prueban rechazo y
error: no prueban instalación ni materializan aprobación real.

Restaurar setup/mantenimiento originales y verificar ambos hashes por readback.
La configuración restaurada no revierte paquetes/cache del filesystem; conservar
recibos de fase y estado parcial sin retry automático ni borrado.
Éxito de esta prueba significa instalación metadata-only observada; no significa
admisión nativa, browser funcional, E2E, Telegram ni autonomía PC-off.

## Revisión antes de una instalación explícitamente aprobada

1. QA independiente revisa el delta, hashes de lineage.json, dependencia exacta,
   pruebas focales y ausencia de cambios en DOCS, cola y guard NativeOperation.
2. Sergio debe aprobar esta versión/origen y las descargas/instalaciones concretas.
   Solo entonces se crea un manifiesto aprobado con su referencia explícita,
   state=APPROVED_FOR_SETUP_ONLY y downloads_and_install_approved=true. Conservar
   este candidato pendiente como evidencia; no heredar el permiso del manifiesto viejo.
3. La futura ejecución de setup diagnóstico necesita tarea Cloud/recibo NUEVOS y
   un contrato delimitado; no reutiliza el submit, lease o nonce histórico R4.
   Esta carpeta no crea esa ejecución ni modifica contadores o admisión.
4. Antes de cambiar setup, capturar privadamente los campos originales completos,
   sus hashes, mantenimiento y política/cache del entorno. Verificar que sigue
   restaurado; preparar wrapper exacto con receta/manifiesto aprobados, guardar
   y leer de vuelta el hash real del setup. La política de red no se amplía aquí.
5. Solo dentro de la ejecución aprobada, la receta crea listas APT aisladas nuevas,
   usa el keyring Ubuntu existente y APT normal valida firma Release y hashes de
   índices/paquetes. Conserva AllowUnauthenticated=false, AllowInsecureRepositories=false,
   Check-Date=true, Check-Valid-Until=true y verificaciones TLS. No cambiar esas
   protecciones para forzar un snapshot o candidato que falle.
6. Exigir update autenticado, conjunto Origin/Label/Codename/Suite coherente,
   33 candidatos con URI oficial admitida, versiones exactas fijadas e instalación
   confirmada antes de los pasos Python/Chromium. Capturar fase/paquetes en fallo.
   Capturar setup-receipt real en éxito; metadata-only no prueba browser/E2E.

## Límite de admisión R4 comprobado

setup_recipe.py fija la operación NUEVA de setup-only
9fc238a7-aa41-433c-8681-a9bf6ec6a340 en su guard y setup-receipt.
parent_operation_id=f90f55bc-48d8-406f-a11e-05ddd2683014 es solo lineage.
El UUID se generó localmente: no creó DB, cola, lease, intent ni submit.
native_cloud_lineage.py, líneas 319-329 de CODE inspeccionado, compara ese operation_id,
recipe_sha256 y referencia de autorización con constantes R4; líneas 332-344 producen
el contrato R4 con el hash fijado. El hash NUEVO de esta receta no satisface ese
consumidor histórico. No modificarlo ni presentar el recibo nuevo como admisión R4.
Cualquier integración posterior requiere su revisión/contrato específico.

## Siguiente cambio mínimo propuesto al consumidor, aún NO implementado

Conservar RECIPE_SHA256 histórico y su ruta histórica de aceptación. Añadir una
revisión snapshot con un SHA literal revisado y selección explícita del Root;
no reemplazar el SHA histórico globalmente ni aceptar un SHA libre del recibo.
Ese cambio queda POSPUESTO por decisión de arquitectura: primero prueba setup-only.
No se creó autoridad nueva ni se editó ningún consumidor/validador.
La revisión snapshot quedaría inhabilitada hasta una autorización Root específica
que vincule revisión, SHA exacto de receta/manifiesto aprobado, referencia de
instalación y hash del readback nuevo de setup. Un bool aprobado por defecto,
un nombre de revisión del task o un digest autodeclarado no son autoridad.

Puntos concretos de native_cloud_lineage.py inspeccionados:

- Línea 18: conservar el pin histórico y añadir el pin snapshot revisado, sin
  activar selección automática. La autorización Root verifica cuál se permite.
- Líneas 78-90: build_controller_intent debe fijar la selección autorizada y su
  digest antes del despacho; el intent y su SHA se congelan de nuevo para una
  operación futura autorizada, sin sobrescribir el intent R4 consumido.
- Líneas 129-155: _parse_controller_intent debe validar la misma revisión contra
  la selección Root verificada y los pins explícitos. No convertir el campo
  approved_recipe_sha256 del propio intent/recibo en una allowlist abierta.
- Líneas 222-282: derive_configuration_receipt debe usar el digest seleccionado
  autorizado y un readback nuevo cuyo hash/grant haya fijado Root. Conservar
  aceptación de los hashes/readbacks históricos en su rama original.
- Líneas 319-329: exigir que setup-receipt real coincida con esa selección,
  autorización y operación; rechazar receta histórica presentada como snapshot,
  snapshot sin aprobación, hash desconocido o procedencia/UID erróneos.
- Líneas 332-344: propagar exactamente ese digest validado al contrato final
  approved_recipe_sha256, sin tomarlo libremente del resultado del task.

QA focal requerida para ese cambio futuro: histórica sigue admitida bajo su
contrato original; snapshot sin selección/aprobación es rechazada; snapshot
aprobada y con todos los recibos/pins exactos es admitida; digest arbitrario,
grant/readback/receta cruzados y mutación posterior al freeze son rechazados.
Verificar también el validador final/admission fijado y su contrato antes de
afirmar compatibilidad integral: no se inspeccionó ni modificó aquí ese guard.
Este plan no habilita replay de la operación R4 consumida. El nuevo contrato de
ejecución debe admitir una operación futura de forma explícita y separada.

## Restauración y fallo parcial

Al terminar la futura tarea, restaurar setup y mantenimiento desde las copias
originales y verificar ambos hashes por readback; comprobar política/cache sin
inventar que el cache material no cambió. Conservar recibos de tarea y restauración.
Si update/instalación falla, no repetir automáticamente. Registrar la fase y los
paquetes no resueltos. Restaurar los campos de configuración no revierte paquetes
ni elimina /opt; conservar esa evidencia y reportar estado parcial. La receta
rechaza colisiones con ROOT existente. No desinstalar, borrar cache, resetear la
cola ni reclamar la lease para intentar otra vez; cualquier reconciliación
destructiva necesita autorización separada. El task R4 histórico queda intacto.
