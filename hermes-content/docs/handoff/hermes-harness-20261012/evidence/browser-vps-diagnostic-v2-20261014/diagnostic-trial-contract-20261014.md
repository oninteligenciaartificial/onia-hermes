# Contrato propuesto: un trial diagnóstico

**Estado:** BLOQUEADO; contrato de un único smoke offline sintético preparado, sin permiso de ejecución ni nonce generado.

## Evidencia usada

- `browser-vps-authorized-result-20261014/install-receipt.json` (SHA-256 `4caf3c228525615922879f7a3c9444bf135450cb3b5e930bd6c22be2f79779a0`): imagen derivada instalada `sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2`; no registra trial de runtime.
- `run-once-receipt.json` (SHA-256 `03b7b9d77fa57c7c9581eea2f60ccdac41da43314ee81e0df8da9c46cb3c8bf3`): salida 2, resultado `needs_reconcile`, `retry=false`, stdout/stderr crudos no guardados.
- `trial-needs-reconcile-receipt.json` (SHA-256 `87e3bbc1e029b238edfa65bb25fb93304a35febe320721b0b54081ccc798d8f4`) y `trial-reconciliation-receipt.json` (SHA-256 `59ce3aed9649a296205d0f3874c8ce34b7354fc8a8f2a34254a1dd4e6673ed41`): primer nonce consumido/reservado; intento previo no reintentable; no se observó contenedor con correlación exacta; el directorio temporal vacío quedó eliminado; causa subyacente y lanzamiento Chromium `UNKNOWN`.
- Runner diagnóstico v2 QA PASS: SHA-256 `efbbf5d12caf56ab20dc8c57bea50092fded494bdc9d2adc36d08a9ab968d581`. El manifiesto del bundle v2 registra el hash del contrato y es la autoridad para ese inventario.
- Bundle local v2 armado desde las 16 entradas de `source-manifest.json`; cada archivo padre pasó validación SHA-256. Catorce siblings conservan exactamente el hash SHA-256 padre; `run-once.sh` fue modificado intencionalmente sólo en v2 (hash padre `6f051e3877803a7a537f5406b9d37bde1d722ffaf73adfaa300c57c48c74744c`, hash v2 registrado por separado en `manifest.json`) para timeout 75 s + 2 s de gracia y temporal único con cleanup. `browser-runner.py` se reemplazó sólo por el derivado v2 QA PASS. Evidencia padre quedó intacta.

## Límite del contrato

## Bundle y entry point

La entry point relativa del bundle completo es `./run-once.sh`. De las 16 entradas padre, 14 siblings conservan hash SHA-256 idéntico; `run-once.sh` es una modificación v2 con hash separado en `manifest.json` (timeout 75 s + 2 s de gracia y temporal único con cleanup), y el runner padre se sustituye sólo por v2. Desde un directorio de instalación root-owned con permisos privados, el comando abstracto reproducible sería:

```sh
cd <directorio_instalado_root_owned_mode_0700> && ./run-once.sh
```

No lleva argumentos. El wrapper ejecuta internamente `python3 browser-runner.py --execute-offline`, guarda el recibo bajo el directorio actual y suprime stderr crudo. La ruta VPS de instalación no aparece en los recibos, y el bundle no se transfirió; la ruta concreta y su disponibilidad en VPS son `UNKNOWN`.

El runner sólo admite `--execute-offline`, `--execute-public` y `--nonce`; el modo público está deshabilitado y el wrapper no pasa nonce por CLI. El runtime lee el nonce desde `approval-nonce.txt` bajo `CONTROL_ROOT`; también requiere `approval-binding.json` privado. No se incluyen valores. Los campos estructurales que el runner comprueba son `human_authorization`, `authorization_reference`, `approval_nonce_reference`, `upstream_bundle_manifest_sha256`, `requirements_lock_sha256`, `seccomp_profile_sha256`, `public_mode_enabled`, `runtime_invocation_limit`, `image_review_status`, `install_receipt_sha256`, `source_manifest_sha256`, `image_review_report_sha256`, `derived_image_id`, `nonce_sha256`, `pwuser_uid` y `pwuser_gid`.

**Alcance real:** un smoke bajo la imagen instalada para el fixture sintético `offline-synthetic`, con `--network=none` y sin URL externa. Esto valida solamente captura sintética y journal/reconciliación; no navegación pública ni Cloud.

## Parámetros del único smoke futuro

- Una sola invocación diagnóstica sobre la imagen ya instalada `sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2`.
- Target: fixture sintético local `offline-synthetic`; no se solicita red, DNS ni navegación a un host público.
- Límite interno runner: 75 s; deadline de cleanup: 2 s. El wrapper v2 usa `timeout --signal=TERM --kill-after=2s 75s`; el límite externo queda en 75 s más 2 s de gracia.
- No guardar stdout/stderr crudos, excepciones, tokens ni nonce. El journal debe estar inicializado en modo privado y fsync antes de la reserva; usar el journal v2 y sus recibos sanitizados.
- El runner crea outputs bajo `/tmp/onia-pw-offline-*`; el sufijo es generado por ejecución. El journal v2 se ubica bajo el `CONTROL_ROOT` configurado (valor por defecto del runner: `/var/lib/onia-browser-control`); el recibo `run-once` se guarda en el cwd del bundle.
- El wrapper v2 redirige stdout sólo a `.run-once-output.*`, creado único con `mktemp` bajo `umask 077` y modo `0600`; un `EXIT` trap intenta borrarlo en salida normal, éxito, error o señales atrapadas. El guard de un solo uso y los recibos persisten. SIGKILL o pérdida del host no ejecutan traps; cualquier temporal residual bloquea la siguiente invocación.
- Se requiere una autorización de un solo uso y nonce fresco ligado de forma verificable al runner SHA-256, manifiesto SHA-256, target `offline-synthetic` y timeout. El wrapper/CLI no recibe nonce por argumento; el runtime lo consume desde `approval-nonce.txt`. Los recibos sólo prueban que el nonce anterior quedó consumido/reservado; no acreditan un nonce nuevo ni estado actual de `approval-binding.json`/`approval-nonce.txt`. No reutilizar el nonce anterior. Ningún valor ni hash de nonce se incluye aquí.
- `retry_allowed=false`. Cualquier fallo de journal, timeout, salida inválida, cleanup no verificado, salida/artifact ambiguo o incertidumbre sobre contenedor deja estado `HOLD / needs_reconcile`; no repetir ni intentar corregir con otra invocación.
- Sin pull, build, instalación, transferencia al VPS, gasto adicional, Telegram, publicación ni llamadas de proveedor.

## Prueba e incertidumbres

Éxito sólo si el recibo muestra etapa y código sanitizados, captura JPEG sintética válida y reconciliación verificada. Esto **no prueba navegación pública ni Cloud**. El costo/token de esta corrida y el launch de Chromium permanecen `UNKNOWN` si no hay señal directa; no inferirlos del resultado sintético ni de la disponibilidad de la imagen.

**Blockers actuales:** los recibos no dan la ruta temporal de despliegue del bundle ni prueban un binding/nonce fresco disponible en el VPS. Sin esos dos datos no se puede invocar el wrapper; no generar nonce ni adivinar estado remoto.

Este archivo es sólo contrato de preparación. No se generó nonce ni se ejecutó preflight, runner, Docker, browser, SSH o red.
