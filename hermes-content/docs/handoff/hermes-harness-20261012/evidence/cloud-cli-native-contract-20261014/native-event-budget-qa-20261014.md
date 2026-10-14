# QA presupuesto de eventos nativos — 2026-10-14
META: revisar cambio local y cadena canónica; PRUEBA: revisión+3suites offline; PARADA: sin proveedor/model/browser/install/DBreal/Git mutante.
PASS OFFLINE LIMITADO para bridge53027E84FFF45547AFFB08173BFEACE35740F0816D3275E399C06823E086D940 y testsAC191568F0DFFC9449AC4BC71F3E7AD091CB24E2FE9EDC7560EB3F513CB8B130, hashes recalculados.
Repo E:/onia-wt/hermes-controller-pilot-20261013; fuentes hermes-content/docs/handoff/hermes-harness-20261012/native_receipt_bridge.py y test_native_receipt_bridge.py.
Diff staged observado2archivos/132añadidas/3quitadas; git diff --name-only vacío: bytes probados coinciden con index, QA no stageó/editó fuentes.
Comando real autorizado: python -B -m unittest test_native_receipt_bridge test_controller_pilot test_native_cloud_cli.
Resultado independiente:63tests/5.843s/OK/exit0; cero errores de tests. No repeticiones innecesarias.
Antes de ejecutar se leyeron fixtures: queues SQLite bajo TemporaryDirectory; CloudCLI subprocess mock, salvo hijo Python inocuo que calcula SHA del stdin; sin CLI proveedor real.
No se tocó queue.sqlite3 de runtime, producción, sesiones, grants R4 ni DB de proveedor. Python-B evita pycache en esta ejecución.
Constructor: rg en todo harness canónico encontró sólo NativeWorkRequest(...) en fixture nuevo ya actualizado2,1; no caller ni deserializador canónico antiguo restante.
Controller importa el tipo y recibe request explícito; CLI recibe plan y bridge. Persistencia serializa asdict(request), no reconstruye defaults invisibles.
Nuevos campos obligatorios sin default, tipo exact int rechaza bool/None/float/string, rangosstatus0..2/result0..1, cero válido y bloquea esos eventos.
Digest incluye ambos campos; autoridad debe firmar/verificar ese digest y reserva persiste request+authorization íntegros en work_authority_json/hash.
Cambio de identidad/presupuesto respecto al request admitido falla antes de consumir evento. Contratos históricos sin campos no se migran ni reciben permisos automáticos.
BEGIN IMMEDIATE engloba lectura de eventos, checkreplay, conteo por clase, global8 y actualización/commit. La serialización SQLite impide admisiones concurrentes excedentes por intercalación en mismoDB.
ID repetido devuelveFalse sin nuevo consumo; cambiar ID no evade límite por clase. Crash después del commit conserva consumo, probado tras reabrir queue temporal.
QAevents conservan límiteglobal8; mezcla2status+1result+5qa cubre borde. Nuevos presupuestos no reinician contador.
step_native_work llama admit_work_event_once antes de transport.status/collect_result; False detiene efecto y presupuesto agotado eleva error antes transporte.
Una admisión sin efecto posterior también consume (incluye terminal leído después): comportamiento conservador, no promesa de dos consultas efectivas.
Reserva conserva _assert_claim/fencing/STOP, predecessor terminal y TaskSpec exacto. Prueba focal consumedlease impide reservar otra operación.
Cobertura nueva prueba caps/replay/crash/zero/types/mixed/identity/historicaldigest y lease; suitescontroller/CLI de regresión pasan.
Límite de evidencia: suitescontroller/CLI usan camino sintético/legacy; integración completa NativeWorkRequest->step_native_work->provider no se ejecutó. Orden de ese camino se revisó estáticamente.
No demuestra idempotencia distribuida, proveedor, Cloud vivo ni enforcement si un caller evade el bridge y llama transport directamente.
Drivers manuales fuera del harness canónico revisados antes en esta sesión usan constructor antiguo/pin antiguo: no reusarlos sin nuevos campos/digest/autoridad/pins explícitos. Con fuentes nuevas sus controles deben HOLD; históricos se preservan.
No actualización automática de grants, nonces, requestshashes o operaciones anteriores. Preservar incompatibilidad failclosed como decisión explícita.
Incidencia de preparación QA: una llamada de lectura PowerShell con braces inválidas falló en parseo antes de ejecutar; se corrigió sintaxis, no fue fallo de código/tests.
No defecto bloqueante concreto identificado; no solicitud de implementación al autor. Sólo este dictamen fueraGit escrito.
QA independiente /root/apt_patch_qa. PASSoffline no autoriza operación R4/Cloud ni modifica estadofreeze.
