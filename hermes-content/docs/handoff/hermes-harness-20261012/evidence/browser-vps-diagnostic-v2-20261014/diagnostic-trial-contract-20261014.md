# Contrato propuesto: un trial diagnóstico

**Estado:** BLOQUEADO; contrato de un único smoke offline sintético preparado, sin permiso de ejecución ni nonce generado.

## Evidencia usada

- `browser-vps-authorized-result-20261014/install-receipt.json` (SHA-256 `4caf3c228525615922879f7a3c9444bf135450cb3b5e930bd6c22be2f79779a0`): imagen derivada instalada `sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2`; no registra trial de runtime.
- `run-once-receipt.json` (SHA-256 `03b7b9d77fa57c7c9581eea2f60ccdac41da43314ee81e0df8da9c46cb3c8bf3`): salida 2, resultado `needs_reconcile`, `retry=false`, stdout/stderr crudos no guardados.
- `trial-needs-reconcile-receipt.json` (SHA-256 `87e3bbc1e029b238edfa65bb25fb93304a35febe320721b0b54081ccc798d8f4`) y `trial-reconciliation-receipt.json` (SHA-256 `59ce3aed9649a296205d0f3874c8ce34b7354fc8a8f2a34254a1dd4e6673ed41`): primer nonce consumido/reservado; intento previo no reintentable; no se observó contenedor con correlación exacta; el directorio temporal vacío quedó eliminado; causa subyacente y lanzamiento Chromium `UNKNOWN`.
- Runner diagnóstico v2 QA PASS: SHA-256 `efbbf5d12caf56ab20dc8c57bea50092fded494bdc9d2adc36d08a9ab968d581`. El manifiesto del bundle v2 registra el hash del contrato y es la autoridad para ese inventario.
- Bundle local v2 conserva `source-manifest.json` byte-identical al manifiesto padre (SHA-256 `eca709d70bda1576223f508ab4501111687ca0103f33bf0816e9be16dff7bf2c`). De las 16 entradas padre, 13 siblings conservan exactamente su hash padre; tres archivos tienen overrides v2 identificados por SHA-256 en `manifest.json`: `bind-approval.py`, `browser-runner.py` y `run-once.sh`. El wrapper v2 usa límite 75 s + 2 s de gracia y temporal único privado con cleanup. También se empaquetan copias exactas de los recibos de instalación e identidad de imagen ya citados. Evidencia padre quedó intacta.

## Límite del contrato

## Bundle y entry point

La entry point relativa del bundle completo es `./run-once.sh`. De las 16 entradas padre, 13 siblings conservan hash SHA-256 idéntico; el binding v2 autoriza overrides exactos sólo para `bind-approval.py`, `browser-runner.py` y `run-once.sh`, cuyos hashes se registran en el manifiesto v2 y en el binding. Desde un directorio de instalación root-owned con permisos privados, el comando abstracto reproducible sería:

```sh
cd <directorio_instalado_root_owned_mode_0700> && ./run-once.sh
```

No lleva argumentos. El wrapper ejecuta internamente `python3 browser-runner.py --execute-offline`, guarda el recibo bajo el directorio actual y suprime stderr crudo. La ruta VPS de instalación no aparece en los recibos, y el bundle no se transfirió; la ruta concreta y su disponibilidad en VPS son `UNKNOWN`.

El runner sólo admite `--execute-offline`, `--execute-public` y `--nonce`; el modo público está deshabilitado y el wrapper no pasa nonce por CLI. El runtime lee el nonce desde `approval-nonce.txt` bajo `CONTROL_ROOT`; también requiere `approval-binding.json` privado. No se incluyen valores. El binding debe coincidir exactamente con los hashes v2 del runner, contrato, wrapper, binder y manifiesto del bundle; target `offline-synthetic`; hard timeout 75 s; gracia 2 s; digest de imagen; recibos existentes de instalación/revisión; y hash del nonce. El runner comprueba todos estos campos antes de reservar; cualquier mismatch detiene sin reserva ni Docker.

**Alcance real:** un smoke bajo la imagen instalada para el fixture sintético `offline-synthetic`, con `--network=none` y sin URL externa. Esto valida solamente captura sintética y journal/reconciliación; no navegación pública ni Cloud.

## Parámetros del único smoke futuro

El siguiente bloque JSON es la autoridad ejecutable para target, timeout, digest de imagen y hash exacto del runner. El binder calcula el hash del contrato completo por separado; el manifiesto v2 registra ese hash sin incluirse a sí mismo, por lo que no existe ciclo de hashes.

<!-- HERMES_DIAGNOSTIC_BINDING_START -->
```json
{
  "runner_sha256": "a95042c57d481dd1e34f63ebfbd864d784567c64bde8baf1347ce5e20c686545",
  "target_id": "offline-synthetic",
  "hard_timeout_seconds": 75,
  "timeout_grace_seconds": 2,
  "derived_image_id": "sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2"
}
```
<!-- HERMES_DIAGNOSTIC_BINDING_END -->

- Una sola invocación diagnóstica sobre la imagen ya instalada `sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2`.
- Target: fixture sintético local `offline-synthetic`; no se solicita red, DNS ni navegación a un host público.
- Límite interno runner: 75 s; deadline de cleanup: 2 s. El wrapper v2 usa `timeout --signal=TERM --kill-after=2s 75s`; el límite externo queda en 75 s más 2 s de gracia.
- No guardar stdout/stderr crudos, excepciones, tokens ni nonce. El journal debe estar inicializado en modo privado y fsync antes de la reserva; usar el journal v2 y sus recibos sanitizados.
- El runner crea outputs bajo `/tmp/onia-pw-offline-*`; el sufijo es generado por ejecución. El journal v2 se ubica bajo el `CONTROL_ROOT` configurado (valor por defecto del runner: `/var/lib/onia-browser-control`); el recibo `run-once` se guarda en el cwd del bundle.
- El wrapper v2 redirige stdout sólo a `.run-once-output.*`, creado único con `mktemp` bajo `umask 077` y modo `0600`; un `EXIT` trap intenta borrarlo en salida normal, éxito, error o señales atrapadas. El guard de un solo uso y los recibos persisten. SIGKILL o pérdida del host no ejecutan traps; cualquier temporal residual bloquea la siguiente invocación.
- Se requiere una autorización de un solo uso y un recibo `root-go.json` privado posterior al QA, ligado a los hashes exactos del bundle/runner/contrato, target, timeout y digest de imagen. El binder se niega a crear binding/nonce si falta o no coincide ese recibo. El wrapper/CLI no recibe nonce por argumento; el runtime lo consume desde `approval-nonce.txt`. El nonce crudo se guarda sólo en ese archivo privado; el hash se liga en `approval-binding.json` y no se imprime ni se escribe en logs. Los recibos existentes no acreditan un nonce nuevo ni estado actual del control root. No reutilizar el nonce anterior.
- `retry_allowed=false`. Cualquier fallo de journal, timeout, salida inválida, cleanup no verificado, salida/artifact ambiguo o incertidumbre sobre contenedor deja estado `HOLD / needs_reconcile`; no repetir ni intentar corregir con otra invocación.
- Sin pull, build, instalación, transferencia al VPS, gasto adicional, Telegram, publicación ni llamadas de proveedor.

## Prueba e incertidumbres

Éxito sólo si el recibo muestra etapa y código sanitizados, captura JPEG sintética válida y reconciliación verificada. Esto **no prueba navegación pública ni Cloud**. El costo/token de esta corrida y el launch de Chromium permanecen `UNKNOWN` si no hay señal directa; no inferirlos del resultado sintético ni de la disponibilidad de la imagen.

**Blockers actuales:** no hay un `root-go.json` posterior al QA, binding/nonce fresco, ni ruta temporal de despliegue comprobada en VPS. El binder sólo se habilita con ese recibo y los archivos actuales; no generar nonce ni adivinar estado remoto.

Este archivo es sólo contrato de preparación. No se generó nonce ni se ejecutó preflight, runner, Docker, browser, SSH o red.
