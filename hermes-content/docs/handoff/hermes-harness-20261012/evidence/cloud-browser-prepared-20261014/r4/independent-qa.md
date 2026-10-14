# QA R4 admission — corrección final 2026-10-14
META: relectura focal estática; PRUEBA: staged/receta externa y hashes; PARADA: sin imports/tests/runtime/install/browser/proveedor/DB/UI/Git mutante.
PASS LIMITADO ESTÁTICO de corrección; no runtime PASS ni autorización de efecto.
Repo E:/onia-wt/orquestacion-subagentes-20261013; staged r4 bajo hermes-content/docs/handoff/hermes-harness-20261012/evidence/cloud-browser-prepared-20261014/.
Pins recalculados desde index:
admission.py 9921253F9D510883C598D83A485EEB3768A27E185DBB857F58455FDAD8DC2FB3.
browser_check.py BD87C4C34307CA6ADA693BB11486D1C38FC5D3AB996665A8A2E633185FF20C14.
supervisor.py F4797C248DCFACD040F504BC0769CD6A26D7F03E539E8274C8696664D3B2461B.
Receta externa E:/onia-wt/browser-next-recovery-plan-20261014/legacy-browser-setup-candidate.py SHA369F5DDD83E43A102A713BAA109DC38BF717107FC341D07D420A2ABF67495519 recalculado.
Hallazgo previo cerrado: helper exige archivo real fijo /opt/onia-public-browser-1.64.0/setup-receipt.json, regular protegido/root-owned y <=12288B.
Hash de bytes reales debe coincidir con setup_receipt_sha256 y bytes base64 del contrato (SHA256); JSON rechaza claves repetidas.
Setup enlaza schema1/environment exacto/OPERATION f90f55bc…/recipe369…/nueva authorization/reference y provenance literal.
UTC real parseado, sin naive/offset distinto; saved<=start<=finish<=now. Receipt histórico R3 no tiene nueva receta/op/auth y bloquea.
Installer exige manifest recipe igual hash de sí mismo, operaciónR4 exacta y nueva referencia user noOLD/noPENDING antes de escritura/red/instalación.
Gates previos de root/Python, aprobación downloads+install, providerconfig, Ubuntuamd64, UID1000, paquetes y cachecollision siguen antes de mkdir/APT.
Recibo sólo se construye tras APT/pip/Chromium y validación metadata/UID1000; root crea archivo O_EXCL|O_NOFOLLOW0444, flush+fsync, luego stdout.
No se admite una atestación de éxito futuro de root: intención/grant precede setup; contrato de runtime incorpora bytes reales después.
El recibo contractual debe usar bytes exactos del archivo, no reserialización arbitraria del stdout; si falla, gate bloquea.
Fallo parcial antes de recibo o durante escritura no entrega JSON válido completo; cachecollision bloquea reintento. No hay rollback automático ni limpieza destructiva del cache.
Config APT privado sigue temporal fuera cache, cleanup en salida normal/excepción; no garantía SIGKILL. No nuevos paquetes/hosts/bypass en delta leído.
Fuentes heredadas R3 childAAC64BB8…/supervisor7AA687A7… fijadas; wrappers actualizan HELPER_SHA/CHILD_SHA y plantilla coherentementemente.
No referencias18eef/880044/2a94fb/218328 obsoletas detectadas en stagedR4; recipe369… está en helper/template/README.
Template permanece false/PENDING/null=>HOLD; operation/nonces exactos; reemplazos de generation/savedat conservan cardinalidad1.
__file__ conserva wrapperR4; supervisor resuelve hijoR4, checks source/claim nuevos; admission precede preflight/claim/browser.
UID1000/sandbox antes navegación/3hosts GETHEADOPTIONS/10s preflight/75+2/cuatroJSON originales sin cambios funcionales en wrappers.
Root externo debe verificar grant humano nuevo y task/environment/recipe/receipt lineage; hashes/prefijouser/roottrue no autentican humano ni impiden que root fabrique archivos.
Temporalidad prueba orden declarado de este recibo, no caducidad total del grant: expiry/reserva nonce/preflight UI/submit siguen en controlador raíz externo.
Una sola operación nueva; sin reutilizarR3 ni fake nonce fields como reserva. La plantilla no autoriza instalación o lanzamiento.
Cinco archivos staged/239añadidas/0borradas observados; no se aplicó patch ni se ejecutó receta/AST por QA. Ningún cambio al index.
Candidato externo no quedó probado en Cloud; aliasAPT del diagnóstico anterior no demuestra que esta instalación vaya a pasar.
Sin otro defecto bloqueante concreto en la corrección acotada. Root revisa y autoriza preservación de fuente por autor; grant de efecto sigue pendiente.
QA independiente /root/apt_patch_qa; sólo este dictamen fueraGit escrito.
