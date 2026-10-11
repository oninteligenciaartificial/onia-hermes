# S05 - Orden de trabajo de Ventas y pauta (para MADRE MARKETING)

Medido: 2026-10-11, primera ronda ~05:30Z, corregido ~05:40Z (PR #191 y transcript re-medidos). Sin git. Solo lectura fuera de este archivo.

## Estado medido

| # | Qué | Evidencia (comando o archivo:línea) | Resultado |
|---|---|---|---|
| 1 | Cola de Ventas | `grep -n "\[x\]\|\[ \]" hermes-content/docs/cola/loop/ventas-pauta.md` | 2 bloqueadas (líneas 3-4). 4 tareas hechas: líneas 5 y 6 (creativos y fichas), 8 y 10 (del 10-oct: go/no-go clasificado y campaña lista; borradores de leads). Línea 19 es la verificación de aprendizaje, aplicada sin revisor. |
| 2 | Ruta del script en la cola | `ventas-pauta.md:4` | Nombre desnudo `grabar-captura.mjs`, sin carpeta. |
| 3 | Ruta del script en el handoff | `hermes-content/docs/handoff/mercado-y-pauta.md:18` | `scripts/grabar-captura.mjs` (ruta rota). Línea 17 tiene el nombre desnudo. |
| 4 | Existencia del script | `ls scripts/grabar-captura.mjs` | No existe. `.claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs` sí existe (13766 bytes, 10-oct 16:08). |
| 5 | Test de campaña | `scripts/campana-lista.test.mjs` | Existe (15752 bytes, 10-oct 16:08). No ejecutado en esta ronda. |
| 6 | Tabla «se promete / funciona» | `grep -o` por símbolo en `hermes-content/docs/ONIA_PROMESA_VS_PRODUCTO.md` | ✅ 23, ❌ 16, ⬜ 70. Son ocurrencias de símbolo; no verifiqué si la leyenda suma alguna. |
| 7 | PR #191 | `gh pr view 191 --repo oninteligenciaartificial/onia-hermes --json state,mergeable,updatedAt,statusCheckRollup,headRefName` | OPEN, MERGEABLE, `statusCheckRollup: []` (sin checks reportados), rama `claude/onia-ventas-pauta-rmdv5j`, `updatedAt` 2026-10-11T05:24:07Z. |
| 8 | Latido recurrente de Ventas | `RemoteTrigger list` (salida guardada en tool-results, parseada) | 20 triggers. Cron de Plataforma, Hermes, Lucía y Marca (:17, :57, :47, :27). Ventas no tiene trigger recurrente. |
| 9 | One-shot de Ventas | `trig_01LAFRJWKjmk3u7M4asVtoj1` (nombre «Check-in del PR #191 Biblioteca») | `enabled: false`, `ended_reason: run_once_fired`, `last_fired_at` 2026-10-10T21:16:40Z, sesión `cse_0143C5fMXVs8eWEf7uBpC9SF`, `last_run.failure_reason` = `ROUTINE_RUN_FAILURE_REASON_UNSPECIFIED`. Campo `environment_id` no visible en el nivel superior: id del entorno de Ventas = UNKNOWN. |
| 10 | Transcript de Ventas | `list_events session_0143C5fMXVs8eWEf7uBpC9SF` → «not found». `RemoteTrigger get_run_log cse_0143C5fMXVs8eWEf7uBpC9SF` → HTTP 200, 200 eventos traídos | Sesión ACTIVA. Último evento 05:35Z. Pushes a `claude/onia-ventas-pauta-rmdv5j` (05:22Z y 05:24Z). Renderiza «prueba 1 v2» (briefs G1-1 a G1-5). |
| 11 | Mensaje de MADRE MARKETING | Transcript, 05:28:41Z | Llegó y Ventas respondió a las 05:28:59Z. Pide Codex para lo cerrado y 3 o más tareas en cola. Confirmado: Ventas sí recibe mensajes de la madre. |
| 12 | Modelo de Ventas | Init de la sesión en el transcript (`init: model=claude-sonnet-5-5`) | Sonnet 5.5, medido. Antes figuraba UNKNOWN. |
| 13 | Render de prueba 1 v2 | Transcript, 05:35Z: `replica-render.mjs` | Fallan 2 aserciones (4 y 8) de texto y de fila «cita-manana». Trabajo en curso, no cerrado. |
| 14 | Campaña y gasto | `CAMPANA-1-LISTA-PARA-CREAR.json`, `has_payment_method: false`, go/no-go en `mercado-y-pauta.md:14`, prueba 16-oct | No re-medido en esta ronda. Se conserva de la primera medición. |
| 15 | Fichas de competencia | `research/competencia/anuncios/FICHAS_DE_CONTENIDO.md` (33 líneas); `SEGUIMIENTO-LEADS.md` (281 líneas) | Existen. Chatwoot y el vigía están en el VPS: UNKNOWN desde la nube. |

## Brecha

1. **Sin latido recurrente.** Ventas no tiene trigger cron. Su único trigger es un one-shot ya disparado (`enabled: false`). Para crear uno falta el id del entorno de Ventas: UNKNOWN, y solo Sergio Urcullo puede verlo en la web.
2. **Ruta rota en el handoff** (`mercado-y-pauta.md:18`). En la cola (`ventas-pauta.md:4`) el problema es el nombre desnudo. Quien siga cualquiera de las dos falla en el primer paso. Verificado: `scripts/grabar-captura.mjs` no existe en la raíz.
3. **Tabla sin verificar para el VSL y la decisión:** 70 ⬜ en el archivo. Las filas del VSL (A-03, B-01, B-02, C-01, E-01, G-04) y las de la decisión (G-01, G-06, G-11, E-03, D-03) esperan la cuenta demo de Plataforma. Ventana propuesta: lun 12-oct 07-11 UTC (`madre.md`, D2).
4. **PR #191 sin checks reportados.** Antes de mergear hay que confirmar que CI corre. No es un bloqueo de código; es un hueco de verificación.
5. **Tarjeta y OK de gasto de Sergio Urcullo.** Sin eso, go/no-go no pasa y la campaña no se crea. Esto no lo puede resolver ninguna sesión.
6. **Prueba 1 v2 con dos aserciones rojas** (transcript 05:35Z). Lo trabaja la propia sesión Ventas; no es tarea de la madre.

## Configuración propuesta

### Orden de trabajo (máximo 7)

1. **Corregir la ruta en la cola** (`hermes-content/docs/cola/loop/ventas-pauta.md`, línea 4). Madre-marketing aplica el diff de abajo. Sin git: la madre commitea.
2. **Corregir la ruta en el handoff** (`hermes-content/docs/handoff/mercado-y-pauta.md`, línea 18). Mismo diff.
3. **Pedir a Sergio Urcullo el id del entorno de Ventas** (web de Claude). Sin él no se crea latido.
4. **Crear un one-shot de prueba** (no recurrente) con ese id. Si la sesión contesta, se crea el recurrente.
5. **Lanzar los contratos Codex V01 a V03** con `scripts/codex-tarea.sh`. Modelos según contrato.
6. **Decisión del 13-oct, por defecto NO-GO**, escrita en `mercado-y-pauta.md` (texto abajo). Sin tarjeta, OK de Sergio y filas en verde, no pasa.
7. **PR #191:** confirmar checks con `gh pr checks 191`. Mergea el integrador solo con checks en verde. Si no hay checks, se pide a la madre qué gate corre.

### 1. Diff de rutas (cola y handoff)

En `hermes-content/docs/cola/loop/ventas-pauta.md`, línea 4:

```diff
- preparado: `grabar-captura.mjs` y preview de 60 s
+ preparado: `.claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs` y preview de 60 s
```

En `hermes-content/docs/handoff/mercado-y-pauta.md`, línea 18:

```diff
- `scripts/grabar-captura.mjs` con los planes C1-C7
+ `.claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs` con los planes C1-C7
```

### 2. Mensaje de madre-marketing a Ventas (una línea, por SendMessage)

`Ventas: sigue la cola ventas-pauta.md. El script de captura está en .claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs. Hoy 13-oct decide el go/no-go: sin tarjeta ni OK de Sergio no se crea ni se enciende nada en Meta.`

### 3. Texto de la decisión del 13-oct (en `mercado-y-pauta.md`)

`13-oct: NO-GO por defecto. Pasa a go solo si: (a) tarjeta cargada en ONIA Ads y OK escrito de Sergio; (b) filas B-02, G-01, G-06, G-11 y L-05 en ✅ con captura de la cuenta demo; (c) PR #191 mergeado con checks en verde. Si falta una, la prueba del 16-oct se corre.`

### 4. Contratos Codex (carpeta `hermes-content/docs/handoff/codex-tareas/`)

Codex no hace git ni consultas git. La madre hace el git, los tests de repo y los greps de verificación. Codex edita solo los archivos listados.

| Archivo | Tarea | Modelo | Archivos que puede editar | Prueba de hecho (la corre la madre) |
|---|---|---|---|---|
| `ventas-V01-tabla-evidencia-codigo.md` | Para cada fila ⬜ de `ONIA_PROMESA_VS_PRODUCTO.md` del VSL y de la decisión, anotar archivo:línea de la pantalla en código. No cambiar ningún ✅ ni ❌. | Sol (gpt-6.1-sol) | Solo `ONIA_PROMESA_VS_PRODUCTO.md` | La columna de evidencia tiene archivo:línea en cada fila ⬜. Cero cambios de estado (diff de símbolos). |
| `ventas-V02-rutas-y-test-campana.md` | Reparar la ruta rota en la cola y el handoff (diff de la sección 1). Nada de consultas git. | Luna (mecánico) | `ventas-pauta.md`, `mercado-y-pauta.md` | `node scripts/campana-lista.test.mjs` sale con código 0. `grep` anclado de abajo sin resultados. |
| `ventas-V03-fichas-competencia.md` | Regenerar las fichas por anunciante con `biblioteca-fichas.mjs` sumando las capturas nuevas de la Biblioteca, sin tocar LECTURAS.json. Sin llamar a Meta. | Sol (gpt-6.1-sol) | `research/competencia/anuncios/fichas/` | `node .claude/skills/onia-ventas-pauta/scripts/biblioteca-fichas.mjs` sale con código 0; no cambian cifras sin fuente en el JSON. |

Astra no hace falta: no hay plata ni riesgo nuevo en estos contratos. La madre verifica con Haiku (cuenta y compara) y sintetiza con Sonnet.

## Quién la aplica

- **Madre-marketing**: pasos 1, 2, 3 (pide el id a Sergio), 4, 5, 6 (texto de decisión) y el mensaje del punto 2. Motivo: ordena Ventas y es dueña de la cola.
- **Sesión Ventas (nube, activa)**: prueba 1 v2 y las dos aserciones rojas; contrato propio posterior. Motivo: es la única sesión que trabaja la app y el render; ya recibió el mensaje de 05:28Z.
- **Integrador (onia-cola)**: mergea PR #191 solo con checks en verde. Motivo: regla de `main` por PR revisado.
- **Sergio Urcullo**: tarjeta en ONIA Ads, OK de gasto, id del entorno de Ventas, y la decisión del 13-oct. Motivo: gasto, personas y el id de la web quedan fuera de las sesiones.
- **Madre-dev / Plataforma**: refresco de la demo (lun 12-oct 07-11 UTC) antes de las capturas C1-C7. Motivo: la cuenta vive ahí.

## Prueba de hecho

- Ruta rota fuera de la cola y del handoff. El patrón está anclado para no coincidir con la ruta correcta (que tiene `/` antes de `scripts/`):
  `grep -nE '(^|[^a-z./-])scripts/grabar-captura' hermes-content/docs/cola/loop/ventas-pauta.md hermes-content/docs/handoff/mercado-y-pauta.md` → sin resultados.
  `grep -nE '(^|[^/a-z.-])grabar-captura\.mjs' hermes-content/docs/cola/loop/ventas-pauta.md` → solo aparece la ruta completa, nunca el nombre desnudo.
- `ls .claude/skills/onia-ventas-pauta/scripts/grabar-captura.mjs` existe.
- `node scripts/campana-lista.test.mjs` sale con código 0 (V02).
- Filas ⬜ con evidencia archivo:línea (V01). Ningún estado cambió sin captura.
- `gh pr checks 191 --repo oninteligenciaartificial/onia-hermes` muestra checks; el PR se mergea solo con ellos en verde.
- Latido: `RemoteTrigger list` muestra un trigger recurrente de Ventas con su entorno, o queda escrito que no existe.
- Decisión 13-oct escrita en `mercado-y-pauta.md` con fecha y veredicto.
- ONIA Ads: 0 campañas y 0 borradores antes del 13-oct (leer con el conector, sin crear).

## Corregido frente a la primera versión

- La cola no tiene la ruta `scripts/…`; tiene el nombre desnudo (`ventas-pauta.md:4`). La ruta rota está en el handoff (`mercado-y-pauta.md:18`).
- El grep de prueba anterior no era válido: coincidía con la ruta correcta. Ahora está anclado.
- Cola: 4 tareas hechas (2 de ellas del 10-oct) y 2 bloqueadas, más 1 de aprendizaje.
- PR #191: `updatedAt` 2026-10-11T05:24:07Z (no 05:05Z).
- Modelo de Ventas: Sonnet 5.5 medido en el init del transcript (antes UNKNOWN).
- Ventas no estaba muerta: sí recibe y contesta mensajes (transcript 05:28Z).
- El one-shot figuraba como «disparado 10-oct 21:16Z sin environment_id». Confirmado el disparo; el entorno no se pudo leer.
- V02 ya no pide git a Codex.

## Notas de medición

- UNKNOWN: id del entorno de Ventas (campo no visible en el trigger; sin `job_config` leído).
- UNKNOWN: Chatwoot y el log del vigía (VPS sin llave en la nube).
- No re-medido en esta ronda: CAMPANA-1-LISTA-PARA-CREAR.json, has_payment_method, fecha de go/no-go. Se conservan de la primera medición.
