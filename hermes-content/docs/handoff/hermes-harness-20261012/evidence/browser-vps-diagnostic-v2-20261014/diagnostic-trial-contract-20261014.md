# Contrato propuesto: un trial diagnóstico

**Estado:** BLOQUEADO; contrato de un único smoke offline sintético preparado, sin permiso de ejecución ni nonce generado.

## Evidencia usada

- `browser-vps-authorized-result-20261014/install-receipt.json` (SHA-256 `4caf3c228525615922879f7a3c9444bf135450cb3b5e930bd6c22be2f79779a0`): imagen derivada instalada `sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2`; no registra trial de runtime.
- `run-once-receipt.json` (SHA-256 `03b7b9d77fa57c7c9581eea2f60ccdac41da43314ee81e0df8da9c46cb3c8bf3`): salida 2, resultado `needs_reconcile`, `retry=false`, stdout/stderr crudos no guardados.
- `trial-needs-reconcile-receipt.json` (SHA-256 `87e3bbc1e029b238edfa65bb25fb93304a35febe320721b0b54081ccc798d8f4`) y `trial-reconciliation-receipt.json` (SHA-256 `59ce3aed9649a296205d0f3874c8ce34b7354fc8a8f2a34254a1dd4e6673ed41`): primer nonce consumido/reservado; intento previo no reintentable; no se observó contenedor con correlación exacta; el directorio temporal vacío quedó eliminado; causa subyacente y lanzamiento Chromium `UNKNOWN`.
- Runner diagnostico v2 derivado con control-root explicito; su hash vigente queda fijado en el bloque de binding y en `manifest.json`.
- Bundle local v2 conserva `source-manifest.json` byte-identical al manifiesto padre (SHA-256 `eca709d70bda1576223f508ab4501111687ca0103f33bf0816e9be16dff7bf2c`). De las 16 entradas padre, 13 siblings conservan exactamente su hash padre; tres archivos tienen overrides v2 identificados por SHA-256 en `manifest.json`: `bind-approval.py`, `browser-runner.py` y `run-once.sh`. El wrapper v2 usa límite 75 s + 2 s de gracia y temporal único privado con cleanup. También se empaquetan copias exactas de los recibos de instalación e identidad de imagen ya citados. Evidencia padre quedó intacta.

## Límite del contrato

## Bundle y entry point

La entry point relativa del bundle completo es `./run-once.sh`. De las 16 entradas padre, 13 siblings conservan su hash; los tres overrides estan fijados en `manifest.json`. El bundle debe instalarse en un directorio root-owned modo `0700`. Precrear un control-root unico bajo `/tmp` con `umask 077` y `mktemp -d`; verificar modo exacto `0700`, owner root y ausencia de symlink. Antes de inspección de imagen, GO/nonce/binding, journal, reserva o Docker, binder y runner exigen EUID 0, owner UID 0, modo exacto `0700`, path canónico descendiente de `/tmp` y ausencia de symlink. La ruta canonica se liga a root-go y binding.

```sh
cd <directorio_instalado_root_owned_mode_0700> && ./run-once.sh --control-root "$CONTROL_ROOT"
```

El unico argumento es `--control-root <ruta-absoluta>`. El wrapper exige un directorio existente, sin symlink, root-owned y modo exacto `0700`, y pasa la misma ruta al runner como `--control-root`. Ejecuta `python3 browser-runner.py --execute-offline --control-root <ruta>`, guarda el recibo en el cwd del bundle y suprime stderr crudo. La ruta VPS del bundle sigue UNKNOWN.

El runner requiere `--execute-offline` y `--control-root`; el modo publico esta deshabilitado y no se pasa nonce por CLI. Nonce, binding, reserva y journal viven bajo el mismo control-root. El path canonico queda ligado en root-go y binding; un mismatch detiene antes de reservar. Los archivos son modo `0600` y el directorio modo `0700`. El binding cubre hashes exactos del bundle, runner, contrato, wrapper y binder, target, timeout, digest de imagen, recibos de instalacion/revision y hash del nonce.

**Alcance real:** un smoke bajo la imagen instalada para el fixture sintético `offline-synthetic`, con `--network=none` y sin URL externa. Esto valida solamente captura sintética y journal/reconciliación; no navegación pública ni Cloud.

## Parámetros del único smoke futuro

El siguiente bloque JSON es la autoridad ejecutable para target, timeout, digest de imagen y hash exacto del runner. El binder calcula el hash del contrato completo por separado; el manifiesto v2 registra ese hash sin incluirse a sí mismo, por lo que no existe ciclo de hashes.

<!-- HERMES_DIAGNOSTIC_BINDING_START -->
```json
{
  "runner_sha256": "3ea2162f46a2a2c3108d11082679f441fa260bc932446efc1eaa2f1147375465",
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
- El runner crea outputs bajo `/tmp/onia-pw-offline-*`. El control-root se precrea como directorio unico bajo `/tmp`, por ejemplo con `umask 077` y `mktemp -d`; validar que sea root-owned, modo exacto `0700` y sin symlink. No hay ruta persistente por defecto. El recibo run-once se guarda en el cwd del bundle.
- El wrapper v2 redirige stdout sólo a `.run-once-output.*`, creado único con `mktemp` bajo `umask 077` y modo `0600`; un `EXIT` trap intenta borrarlo en salida normal, éxito, error o señales atrapadas. El guard de un solo uso y los recibos persisten. SIGKILL o pérdida del host no ejecutan traps; cualquier temporal residual bloquea la siguiente invocación.
- El binder exige `--control-root`, `--image-id`, `--pwuser-uid`, `--pwuser-gid` y `--image-review-sha256`. Requiere un root-go.json modo `0600` dentro del control-root temporal, posterior al QA, ligado al path canonico y a hashes exactos de bundle/runner/contrato, target, timeout e imagen. No generar binding/nonce sin esa aprobacion.
  El recibo debe incluir `status=approved`, `scope=single_offline_synthetic_trial`, hashes exactos de manifest/runner/contrato, `target_id=offline-synthetic`, timeout `75`, gracia `2`, digest de imagen, `control_root` canonico y una referencia de GO no vacia.

Plantilla de campos (valores de hashes y ruta solo se rellenan tras aprobacion humana):

```json
{
  "status": "approved",
  "scope": "single_offline_synthetic_trial",
  "bundle_manifest_sha256": "<sha256 exacto>",
  "runner_sha256": "<sha256 exacto>",
  "contract_sha256": "<sha256 exacto>",
  "target_id": "offline-synthetic",
  "hard_timeout_seconds": 75,
  "timeout_grace_seconds": 2,
  "derived_image_id": "sha256:5b1051bc16e1214877af33b8bf453c3d9fec29479632847f534c44afba35f4f2",
  "control_root": "<ruta absoluta canonica bajo /tmp>",
  "root_go_reference": "<referencia de aprobacion humana>"
}
```
- `retry_allowed=false`. Fallos o ambiguedad implican `HOLD / needs_reconcile`; no reintentar. Tras reconciliar y conservar fuera del control-root solo recibos sanitizados necesarios, borrar el control-root temporal completo. No borrarlo mientras reconciliation siga pendiente.
- Sin pull, build, instalación, transferencia al VPS, gasto adicional, Telegram, publicación ni llamadas de proveedor.

## Prueba e incertidumbres

Éxito sólo si el recibo muestra etapa y código sanitizados, captura JPEG sintética válida y reconciliación verificada. Esto **no prueba navegación pública ni Cloud**. El costo/token de esta corrida y el launch de Chromium permanecen `UNKNOWN` si no hay señal directa; no inferirlos del resultado sintético ni de la disponibilidad de la imagen.

**Blockers actuales:** faltan root-go posterior al QA, binding/nonce fresco y staging/control-root temporal creado y verificado en VPS. No generar nonce ni adivinar estado remoto.

Este archivo es sólo contrato de preparación. No se generó nonce ni se ejecutó preflight, runner, Docker, browser, SSH o red.
