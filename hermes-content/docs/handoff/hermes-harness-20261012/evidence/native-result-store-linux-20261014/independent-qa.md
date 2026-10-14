# QA independiente — filesystem result sink, Linux — 2026-10-14

Veredicto: PASS_LIMITED_POSIX. Ejecución única autorizada por Root, sin despliegue.
Fuente native_result_store.py SHA256 FE23CE4D56C5B3727C88462F336A7E37A4E0495C966D29384A5C3ADCF21F63EF.
Tests test_native_result_store.py SHA256 6E727EA791D2CBC92A9AA5F8A622D79B3831087E48F5A65A03C20A29E736BC15.
Ambos hallazgos iniciales cerrados por revisión focal: fsync del descriptor pendiente antes de publicar; bytes distintos rechazados antes de publicar. Fixtures específicos incluidos.

## Ejecución observada
Comando único: python -B E:/onia-wt/native-result-store-probe-prepared-20261014/launch_probe.py.
Marcador y recibo ausentes antes de launch. Launcher consumió marcador exclusivo antes de SSH; no hubo reset, replay ni segundo SSH.
Recibo: state=pass; 17 tests ejecutados, 0 failures, 0 errors, 1 skip esperado exclusivamente test_fixture_only_windows_store_marks_simulated_directory_sync.
Linux, Python 3.12.3. Duración interna del probe 0.605908 s; wall time del comando launcher informado por exec 3.6539835 s (incluye SSH y overhead local; no es medición exclusiva de red).
Fsync reales completados: 38 archivos y 96 directorios. Cleanup=true según comprobación del probe tras eliminar únicamente su root temporal validado.
El PASS depende del recibo y esos gates, no sólo de exit 0.

## Artefactos públicos preservados fuera Git
Directorio: E:/onia-wt/native-result-store-probe-prepared-20261014/.
linux-receipt.json SHA256 89237D362791405611FF81E67C0A46853FC34272BD533DBA7886C569648EC46D.
attempt-once.json SHA256 507C46C93F76CDC155827A21E1A7343F996CCDE4185A2C20679BA55DD41438C8.
remote_probe.py SHA256 237997C300CE89D3C75BCEDE454C2C2A2C706A84FC5FFDFEF466EEAAC68A6A39 (244506 bytes).
launch_probe.py SHA256 C4ACD4E1F589684E354D7C4B213DA2DD615EF43EF578347D5B21BDE328992DEC.
source-manifest.json SHA256 6C11EC9CEE30B5C1252953D98D874693C16BDB7408B32E50C2DA2727E0E16700.
PLAN.md SHA256 DC639F5C46085124DF869292FEDADD97C2C79B1C54E717F8C080208D5761DE14 (plan previo a ejecución).
Seis módulos públicos fijados por hash; recibo confirma los seis hashes esperados.

## Alcance y límites
Suite real sobre filesystem POSIX temporal, con directory fsync nativo. Adapter->sink->restart-load usa step mock; no cola o DB real ni proveedor.
Crash/recovery probado mediante fallos simulados de métodos; esto no demuestra supervivencia a corte eléctrico, crash real del kernel o durabilidad física del host.
Root temporal /tmp/onia-native-result-store-qa-20261014-* mode0700; límites25s/100MiB, nice+10 y audit bloqueando red/subprocesos/SQLite dentro del probe. SSH de transporte fue la única conexión autorizada.
Sin Cloud, modelo, Telegram, navegador, login nuevo, instalación, servicios ni despliegue productivo. No lectura de env/secretos ni modificación de fuentes en VPS.
No fuente/index/commit editados por QA. Marcador consumido queda conservado y no autoriza otra ejecución.
