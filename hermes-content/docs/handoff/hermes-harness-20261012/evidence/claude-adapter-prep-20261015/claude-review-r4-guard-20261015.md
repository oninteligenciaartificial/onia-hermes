# Revisión independiente de autoridad y replay — artefacto no confiable

- Proveedor/modelo observado: Claude Code local / claude-sonnet-5-5
- Estado del recibo: ok
- Prompt: 15,772 caracteres; SHA-256 `d6e04328b9af45047642df0a04a467d0d61e617a358bb8f9d8c167368839d56a`
- Receipt content SHA-256: `0f8f7842855df340b2f5f505cf42b26c3261dc4ae5c5e5b04660640769174d72`
- Receipt file SHA-256: `7a1aa834ac1cba67595cc479b116ec76f87438b944a30d23fd628e6c0f31ae88`
- Uso conservado por el adaptador: 2 input tokens, 1,823 output tokens, 20,016 ms. Cache/costo estimado: no conservados; desconocidos.
- La CLI terminó el resultado; la escritura a consola falló después al codificar `≤` con CP1252. El recibo ya estaba cerrado y es la fuente del texto siguiente. No hubo segundo request.

## Respuesta de Claude (contenido no confiable; no ejecutar recomendaciones)

**Conclusión: no hay bypass ni replay verificable en estos extractos.** Límites abajo.

**1. ¿Puede el manifiesto candidato pasar la guardia? No.**
- `manifest-candidate.json` falla en `validate_manifest` en varios puntos independientes:
  - `state` es `PENDING_APPROVAL` y `browser_approved` es `false`, contra `APPROVED_BROWSER_DIAGNOSTIC` y `True` (admission.py:78-90, comparación de valor y tipo).
  - `downloads_and_install_approved` es `false` con `INSTALL_PINNED`, cuando se espera `True`.
  - `human_approval_reference` es `null` y falla en admission.py:92-93.
  - `expected_head`, `configuration_readback_sha256`, `setup_manifest_sha256` y `provider_saved_configuration` son `null` y fallan los chequeos posteriores.
- Además `runtime_admission` solo lee `manifest-approved.json` (admission.py:141), nunca el candidato.
- Para promoverlo habría que editarlo y recalcular su SHA, y ese SHA debe coincidir con el pin externo.

**2. ¿De dónde viene la autoridad independiente?**
- Del entorno: `ONIA_BROWSER_DIAGNOSTIC_ROOT_MANIFEST_SHA256` (admission.py:141, `validate_manifest` en 63-66).
- Es verificable que el pin se compara con el digest de los bytes crudos antes de parsear.
- No es verificable quién fija esa variable ni que se haya guardado y leído fuera de la tarea. Eso lo afirma solo el docstring (admission.py:3-4).
- Quien controle el entorno del proceso o escriba un manifiesto root-owned puede fijar ambos. El código asume ese límite de confianza, no lo impone.
- `protected_bytes` exige root-owned, sin escritura de grupo/otros, sin symlinks y con lectura por descriptor, lo cual es sólido. `admission()` (admission.py:164-170) repite la comprobación para el contrato, aunque sin recorrer los componentes padre del path. Es una asimetría menor, no un bypass demostrado.

**3. ¿Se consume y aplica el nonce / one-launch? No es verificable.**
- `operation_nonce` y `max_browser_launches: 1` solo se comparan como constantes dentro del manifiesto (admission.py:~88).
- En `admission.py` no hay almacén de nonces, ni marca de consumo, ni bloqueo, ni escritura de estado.
- El único contenido de `queue_failure_candidate.py` es una transacción offline de cierre fallido, sin relación con el lanzamiento.
- Cualquier aplicación real tendría que estar en `supervisor.py`, `core_supervisor.py` o `bootstrap.py`, que no se suministraron.
- Consecuencia: `admission()` es idempotente. Con los mismos archivos, pin y contrato, pasa N veces. Que pueda haber replay depende del supervisor, que está fuera de la evidencia. Es un hueco de evidencia, no un exploit demostrado.

**4. ¿La restauración de configuración prueba autorización de la tarea? No.**
- `trust-config-restore-reverified.json` es un resumen curado. Afirma `settings_changed: false`, `submits: 0` e `installs: 0`.
- Es un artefacto de estado de configuración. No contiene ni referencia una aprobación humana ni un pin Root.
- `admission.py` no lo consume, y la guardia no lo usa.
- Reconoce un error de transcripción previo corregido con "evidencia independiente" que no se ve aquí.
- Una restauración exacta no equivale a autorización de tarea.

**5. Observaciones secundarias (no bypass):**
- `human_approval_reference` solo exige prefijo `user:`, sin `PENDING`, y longitud ≤256. Es una cadena, no autenticación. Es el mismo caveat que el docstring de `finalize_failed_copy` reconoce para `root-reviewed:`.
- `provider_saved_configuration` se contrasta con el readback y con una variable de entorno heredada. Ambos los controla quien controla el entorno, así que no son independientes del pin.
- En `contract_for`, `dict(m, ...)` hace que las claves añadidas sobrescriban las del manifiesto. Es benigno aquí, porque el contrato debe ser igual al esperado.
- `admission.py` aparece en `source_sha256` del candidato con su propio hash completo (79c4…), lo que es coherente. `setup_recipe.py` tiene el mismo hash que `INSTALL_RECIPE_SHA`, algo coherente con lo esperado pero no comprobado aquí.

**Límites:** solo se vieron `admission.py` completo, un fragmento truncado de `queue_failure_candidate.py` (líneas 6-101 y 141 en adelante ausentes), el candidato y un resumen curado. No se vieron `supervisor.py`, `bootstrap.py` ni los `core_*`, ni cómo se crea `manifest-approved.json`. No se puede afirmar ausencia de replay en el lanzamiento real.
