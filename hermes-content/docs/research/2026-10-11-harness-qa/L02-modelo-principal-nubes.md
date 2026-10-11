# L02 · Modelo principal de cada nube (11-oct-2026, corregido tras verificador)

Método: `RemoteTrigger get_run_log` (páginas nuevas y anteriores con `cursor`), `RemoteTrigger get` de los cuatro triggers. Se busca `init: model=...`. Nada se escribió en GitHub ni en las rutinas; no se usó `create`, `update` ni `run`.

## Estado medido

Cada `init` tiene hora UTC y `cwd`. El log no distingue con certeza la sesión principal de un subagente; donde hay un solo `init` al arrancar la sesión o tras un mensaje de la madre, se toma como modelo principal. Donde solo hay `init` después de un `SubagentHandback` o de un `result` con `turns=0`, se marca como subagente probable.

| Carril | Sesión | Inits medidos (UTC) | Modelo principal | Confianza |
|---|---|---|---|---|
| Plataforma | session_01HhnFgkeF6nLGvjrfjt1o2C | `05:15:35` opus-5-5 (cwd onia-hermes, tras `error_during_execution`); `05:18:27` y `05:18:28` opus-5-5 (cwd /home/user, tras `/clear` de 05:15:39). Página más nueva (05:21:56 a 05:29:02): sin `init` | claude-opus-5-5 | Alta para 05:18. Sigue en opus después del clear |
| Hermes-Jarvis (QA) | session_01SQ7cvuDX5w5jDHk5VdhAEo | Página más nueva (05:24:29 a 05:28:18): `init` sonnet-5-5 en `05:24:34`, `05:24:55`, `05:25:00`, `05:25:05`, `05:27:41`, todos después de `result` de subagentes (turns=77 y similares) | sonnet-5-5 visible. Principal no confirmada | Media: solo inits de subagente o desconocidos |
| Lucía | session_01XSzFcs1k18ijqjSHGjnzD4 | `05:20:58` sonnet-5-5 (tras `SubagentHandback` "Revisión 1 aplicada"); `05:25:42` y `05:28:41` sonnet-5-5 (cwd onia-hermes), este último justo después de un mensaje de la madre | sonnet-5-5 visible. Principal probable | Media |
| Marca personal | session_01WPecmppa9uZEc4fJDjSmaS | `05:03:10.835` sonnet-5-5, cwd onia-hermes, al arrancar el proceso (`05:03:07` "Starting Claude Code"). `05:17:36` y `05:19:30` sonnet-5-5 con `turns=0` | claude-sonnet-5-5 (arranque 05:03) | Alta para el arranque |
| Ventas y pauta | session_0143C5fMXVs8eWEf7uBpC9SF | `05:28:41.745` sonnet-5-5, cwd onia-hermes, justo después de un mensaje de la madre (05:28:41.494) | claude-sonnet-5-5 | Media |

Correcciones frente al borrador anterior:
- Ventas sí tiene `init`: `05:28:41.745` sonnet-5-5 en la página más nueva. El borrador decía "sin init".
- Plataforma: los `init` opus están en la página anterior (cursor 22895), no en la más nueva, que no tiene ninguno. El borrador citaba "05:11, 05:15, 05:18 x2", y solo `05:15:35` y `05:18:27/28` se encontraron en las páginas leídas. La hora 05:11 no se encontró en las páginas leídas.
- La frase "haiku verifica, sonnet construye" no está en el latido de Marca (`trig_01ExDbhoaxaXpzpvj26DEeQ8`). Su prompt solo dice trabajar la cola `marca-personal.md` con `equipo-de-agentes` y `aprender-de-todo`. La frase sí está en los latidos de Plataforma (`trig_01XVX9kgMExkapoN5XDdamx4`: "haiku verifica, sonnet construye; opus solo lo riesgoso") y de Hermes-Jarvis (`trig_01A9hCX7s5ZuaQ24TkK3Rr8d`: "haiku verifica, sonnet revisa").
- No se atribuyen los inits de Marca a un "SubagentHandback del crítico". `05:17:36` sigue a un `result` del turno principal (`turns=37`, 05:17:35).

Configuración de las rutinas (`RemoteTrigger get`, medido ahora):

| Trigger | Cron | `derived_state.model` | `session_request` | Modelo en el payload |
|---|---|---|---|---|
| trig_01XVX9kgMExkapoN5XDdamx4 (Plataforma) | `17 * * * *` | `""` | sin campo `model` (`environment_id`, `events`, `config` de herramientas) | no |
| trig_01A9hCX7s5ZuaQ24TkK3Rr8d (Hermes-Jarvis) | `57 * * * *` | `""` | sin campo `model` | no |
| trig_013YP8Nxhwi8HbdufMuv2Var (Lucía) | `47 * * * *` | `""` | `config: null`, sin `model` | no |
| trig_01ExDbhoaxaXpzpvj26DEeQ8 (Marca) | `27 * * * *` | `""` | `config: null`, sin `model` | no |
| Ventas | UNKNOWN: no se conoce su trigger. `RemoteTrigger list` lo listaría (acción de solo lectura, no ejecutada) | UNKNOWN | UNKNOWN | UNKNOWN |

Lectura del campo `derived_state.model`: vale `""` en los cuatro triggers, incluido Plataforma, que sí corre opus. Por eso ese campo no sirve como prueba de qué modelo usa una sesión.

## Brecha

1. **Plataforma corre opus-5-5 como sesión principal.** Su propio latido dice "opus solo lo riesgoso", así que el default actual contradice la regla. Brecha real.
2. **Hermes-Jarvis:** los inits visibles son sonnet-5-5, de acuerdo con su latido ("sonnet revisa"). La sesión principal no está confirmada. No hay brecha medida, pero tampoco prueba.
3. **Lucía, Marca y Ventas:** los inits visibles son sonnet-5-5. No hay cambio que aplicar. Lo que falta es un chequeo periódico.
4. **Ninguna rutina fija el modelo en su payload.** Los cuatro triggers tienen `model` vacío. La elección de modelo depende solo del default de la sesión, o de un cambio manual.
5. **Ahorro: UNKNOWN.** No hay precios por modelo medidos en esta corrida, así que no se estima ningún porcentaje ni en USD o Bs. El único cambio real de modelo sería Plataforma de opus a sonnet.
6. **Cambio de modelo: no se probó ningún mecanismo.** Ver la sección siguiente.

## Configuración propuesta

Asignación por carril:

| Carril | Modelo principal | Subagentes (model explícito) | Cambio necesario |
|---|---|---|---|
| Plataforma | claude-sonnet-5-5 | haiku para contar y verificar; sonnet para construir; opus solo para tareas marcadas riesgosas (migraciones, cobro, auth, deploy) | Sí: opus a sonnet como principal |
| Hermes-Jarvis (QA) | claude-sonnet-5-5 | haiku para verificar cada check; sonnet para revisar | No si ya es sonnet. Confirmar principal |
| Lucía | claude-sonnet-5-5 | haiku para conteos; sonnet para revisión y edición | No |
| Marca personal | claude-sonnet-5-5 | haiku verificador; sonnet crítico | No |
| Ventas y pauta | claude-sonnet-5-5 | haiku para extraer capturas y tablas; sonnet para redactar | No |

Texto para el prompt de Plataforma (reemplaza el marcador de modelo; el cambio de modelo en sí es de la sesión, no del prompt):

```
MODELO: sesión principal sonnet-5-5 (código). Opus solo en tareas que marques como riesgosas (migraciones, cobro, auth, deploy), con `modelos: opus` en el [x]. Subagentes con model explícito: haiku para contar y verificar, sonnet para construir.
```

Diff propuesto para el latido de Plataforma (`trig_01XVX9kgMExkapoN5XDdamx4`, campo del prompt), solo si Sergio quiere que el latido lo diga de forma explícita:

```diff
- PASO 1: ... Subagentes con model explícito (haiku verifica, sonnet construye; opus solo lo riesgoso); marcá `modelos:`/`codex:` en cada [x].
+ PASO 1: ... Sesión principal sonnet-5-5. Opus solo para tareas marcadas riesgosas (migraciones, cobro, auth, deploy). Subagentes con model explícito (haiku verifica, sonnet construye); marcá `modelos:`/`codex:` en cada [x].
```

Cómo se cambia el modelo de una sesión en la nube:
- **Desde claude.ai, al abrir la sesión:** no verificado en esta corrida. UNKNOWN.
- **`mcp__ccd_session_mgmt__set_session_model`:** existe en la lista de herramientas diferidas. No se llamó (es de escritura). Su efecto sobre una sesión de nube es UNKNOWN. Su esquema hay que cargarlo con `ToolSearch select:mcp__ccd_session_mgmt__set_session_model` antes de cualquier prueba.
- **`RemoteTrigger update` (body libre):** existe y es una actualización parcial. No se probó si acepta un campo `model`. El payload actual no tiene ese campo, y el lane no debe usarlo mientras no se pruebe. Queda como prueba pendiente.

Qué NO se ha medido: si `set_session_model` o `update` cambian el modelo de una sesión que ya está corriendo.

## Quién la aplica

- **Sergio Urcullo:** cambiar el modelo principal de la sesión Plataforma (cambio de configuración de cuenta, requiere su permiso), y cualquier cambio de payload de una rutina.
- **madre-dev (MADRE DESARROLLO-INFRA):** enviar a la sesión Plataforma la línea "MODELO: sesión principal sonnet-5-5..." y registrar el `init` que confirme. La madre manda mensajes; las sesiones de nube no pueden mandarlos (`SendMessage` falla, según la skill `onia-sesion-madre`).
- **madre-marketing (MADRE MARKETING):** Lucía, Marca y Ventas ya usan sonnet como principal. Basta con confirmar el `init` en cada uno sin tocar nada.
- **Sesión Hermes-Jarvis:** confirmar su principal con un `init` al arrancar; no cambiar nada si ya es sonnet.
- **Integrador:** no aplica.

Motivo: cambiar el modelo es configuración de cuenta, y la regla pide el permiso de Sergio. Las madres solo indican el criterio por mensaje; no tocan la rutina ni la cuenta.

## Prueba de hecho

1. **Plataforma, después del cambio:** `RemoteTrigger get_run_log` sobre la página más nueva de `session_01HhnFgkeF6nLGvjrfjt1o2C` debe mostrar `init: model=claude-sonnet-5-5` en el arranque del siguiente turno. Si la página más nueva no tiene `init` (como hoy), leer la página anterior con `cursor`. Un solo `init` no basta: confirmar que ningún `init` posterior dice opus.
2. **Subagentes:** un `Agent` con `model: haiku` o `sonnet` aparece como `init: model=...` con `turns=0`. Eso prueba el modelo del subagente, no el de la sesión principal.
3. **No usar `derived_state.model` como prueba.** Vale `""` hoy aunque la sesión corra opus.
4. **Hermes-Jarvis, Lucía, Marca y Ventas:** basta con que el próximo `init` de sesión (no de subagente) diga sonnet-5-5. Si el `init` de sesión no aparece en la página más nueva, leer una página anterior.
5. **Ahorro:** no se puede probar sin precios medidos por modelo. Queda UNKNOWN hasta tener esos precios.

## Pendiente, no medido aquí

- Modelo principal real de Hermes-Jarvis: falta un `init` de sesión al arranque, no de subagente. Requiere leer páginas más antiguas.
- Modelo del trigger de Ventas: falta su `trigger_id` (`RemoteTrigger list`).
- Si `mcp__ccd_session_mgmt__set_session_model` o `RemoteTrigger update` aceptan `model` y cambian el modelo de una sesión en marcha.
- Ahorro en USD o Bs: requiere precios verificados por modelo.
