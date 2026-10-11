# L04 - Ruteo de modelos: una sola fuente

Fecha: 2026-10-11. Ejecutado por Haiku 5.5 (pedido de Sergio Urcullo: bajar los LLM a Haiku en estas pruebas). Corregido tras el verificador (veredicto WRONG): se reemplazaron las citas falsas, se repitieron las mediciones y se fijo la regla de decision. Solo lectura del repo; ningun cambio aplicado.

Fuente canonica propuesta: `hermes-content/docs/AI_MODEL_ROUTING_2026.md`. Las demas fuentes enlazan y no repiten la tabla.

## Estado medido

Comandos ejecutados desde el worktree, salida resumida.

| # | Comando | Salida medida |
|---|---|---|
| M1 | `grep -n -i -E "opus\|sonnet\|haiku" CLAUDE.md` | L170-171: "La madre orquesta con un modelo por rol ... subagentes con `model` por rol (Haiku cuenta y verifica, Sonnet sintetiza, Opus decide lo riesgoso)". Es la unica cita de la regla por rol en el repo. |
| M2 | `grep -c -i -E "opus\|haiku\|sonnet" ~/.claude/CLAUDE.md` (solo lectura) | 0. La regla no esta en el CLAUDE.md global; esta en el del repo (M1). |
| M3 | `AI_MODEL_ROUTING_2026.md`: `grep -c -i -E "opus\|sonnet\|haiku"` | 0. La fuente que debe ser canonica no tiene ninguna fila de Claude. |
| M4 | `AI_MODEL_ROUTING_2026.md` L3 | "alineado con `equipo-de-agentes`" (falso, ver Brecha 1). |
| M5 | `AI_MODEL_ROUTING_2026.md` L10 | "Arquitectura ambigua, decisiones de negocio, investigacion multi-fuente, campana final, revision legal/comercial o cambios end-to-end" = `gpt-6-astra` medium. `grep -c end-to-end` = 1. |
| M6 | `.claude/skills/equipo-de-agentes/SKILL.md` L22 | "Astra para seguridad, plata o logica con riesgo". |
| M7 | `equipo-de-agentes/SKILL.md` L92 | "Sol por defecto; Astra medium para seguridad, cobros, arquitectura ambigua o revision de riesgo. Haiku/Luna quedan para conteos mecanicos". |
| M8 | `equipo-de-agentes/SKILL.md` L111 | "Lectura, conteo y verificacion: Haiku 5.5. Juicio y sintesis: Sonnet. Decidir lo ambiguo: Opus/Astra." |
| M9 | `equipo-de-agentes/SKILL.md`: busqueda de `Opus`, `Sonnet`, `model` | Solo L23, L92, L111 y el frontmatter. No hay tabla de subagentes por rol en este archivo. La tabla por rol esta en `ONIA_EQUIPOS_POR_SESION.md` §1. |
| M10 | `equipo-de-agentes/SKILL.md` y `onia-sesion-madre/SKILL.md`: `grep -l AI_MODEL_ROUTING_2026` | Ninguno de los dos enlaza la routing doc (0 coincidencias). |
| M11 | `ONIA_EQUIPOS_POR_SESION.md` L7 | Declara: "Modelos: `AI_MODEL_ROUTING_2026.md`". Pero su §1 fija modelo por rol: `integrador-pr` sonnet (L49), `revisor-cruzado` sonnet (L50), `auditor-riesgo` opus (L55), `verificador-prod` haiku (L56), `scout-tendencias` sonnet (L68), `guionista` opus (L70), `verificador-de-promesas` haiku (L71), `analista-oferta` opus (L78), `cotizador-higgsfield` haiku (L88), `control-identidad` sonnet (L89), `verificador-ronda` haiku (L108), `auditor-riesgo` opus madre (L111). |
| M12 | `ONIA_EQUIPOS_POR_SESION.md` L104 | "Madre (PC, Opus 5.5)". |
| M13 | `ONIA_EQUIPOS_POR_SESION.md` L30 | Codex cloud: "el modelo no se elige; el 8-oct se pidio Astra y corrio `gpt-5.6-sol`". |
| M14 | `ONIA_EQUIPO_DE_AGENTES.md` L46 | "The madre (Opus 5.5 with Ultracode, on the PC)". |
| M15 | `ONIA_EQUIPO_DE_AGENTES.md` L61-L70 | Tabla de modelos: Opus 5.5 para intake y decisiones ambiguas (L61), Opus subagente para oferta (L62), Sonnet 5.5 para construir (L63), Codex Sol 6.1 medium (L64), **Codex Astra 6, high (L65)**, Sonnet para revisar Codex (L67), Haiku para triage (L68), Luna 6 low (L69). |
| M16 | `ONIA_EQUIPO_DE_AGENTES.md` L78-L83 | Modelo por carril: Plataforma Sonnet (L78), Ventas Opus (L79), Marca Sonnet (L80), Lucia Sonnet (L81), Review/QA sin modelo (L82), Madre-PC Opus (L83). |
| M17 | `ONIA_EQUIPO_DE_AGENTES.md` L19, L200, L208 | L19: "codex-tarea.sh:19-20 says code = astra". L200: "Codex cloud runs Sol 6.1 (routing table) FALSE". L208: "policy contradicts its defaults CONFIRMED". |
| M18 | `scripts/codex-tarea.sh` L19-L20 (header) | "gpt-6.1-sol por defecto, tambien para codigo cerrado; gpt-6-astra para seguridad, cobros, infra con root o logica de riesgo". Ya no dice code = astra. |
| M19 | `grep -n "gpt-6.1-sol" scripts/codex-tarea.sh` | 4 lineas: comentario L19 y defaults L46 (`${4:-gpt-6.1-sol}`), L52, L58. Los defaults efectivos son 3; el comando devuelve 4 lineas. |
| M20 | `.claude/skills/onia-sesion-madre/SKILL.md` L39-L43 | Tabla: Haiku para contar/buscar; Sonnet para copy, guiones, edicion; Codex Sol para codigo cerrado, Astra para riesgo; L42 "Migraciones, cobro, backup, SQL de prod: Astra/Opus segun carril"; L43 "Estrategia y precios: Opus". |
| M21 | `onia-sesion-madre/SKILL.md` L209-L214 | Escalado: Haiku a Sonnet si falla dos veces o pide juicio; Sonnet a Opus solo por riesgo conocido (produccion, plata, migracion, claims, identidad, voz de Sergio); Opus una pasada por lote o PR. |
| M22 | `equipo-de-agentes` / `ONIA_EQUIPOS_POR_SESION.md` L211 | Misma regla de escalado que M21 (repetida). |
| M23 | `.claude/agents/*.md` frontmatter `model:` | code-reviewer sonnet, security-reviewer sonnet, onia-crm-prospeccion sonnet, onia-creative-radar sonnet, onia-core-guardian opus. Ninguno aparece en la routing doc. |
| M24 | `hermes-content/docs/cola/loop/madre.md` L155 | Uso medido 11-oct 02:20 UTC: Claude 463 M tokens/24 h; Opus 72,9 %, Sonnet 22,6 %, Haiku 4,4 %. Codex 58 % semanal, reinicio 14-oct 03:57 UTC. |
| M25 | `madre.md`: decision de modelo de la madre | No hay ninguna linea de decision con fecha. |
| M26 | `madre.md` L155 y base 10-oct | Base 10-oct: Opus 58 %, Sonnet 41,5 %, Haiku 0,5 %. La tendencia sube Opus. |

UNKNOWN: costo en tokens por modelo Codex (Luna no tiene sesiones: `ONIA_EQUIPO_DE_AGENTES.md:69`). Y el efecto real de `high` en Astra: no hay medicion en ninguna fuente (`grep -i "astra.{0,12}high"` solo da L65).

## Brecha

Contradicciones vivas, con archivo:linea:

1. **Routing doc sin Claude.** `AI_MODEL_ROUTING_2026.md` no tiene ninguna fila para Haiku, Sonnet u Opus (M3), aunque se declara "alineado con equipo-de-agentes" (L3, M4). Cada skill inventa su tabla.
2. **Astra, esfuerzo.** `ONIA_EQUIPO_DE_AGENTES.md:65` dice "Codex Astra 6, high". `AI_MODEL_ROUTING_2026.md:10` y `equipo-de-agentes/SKILL.md:92` dicen Astra medium. El high no tiene medicion.
3. **Astra, alcance.** `AI_MODEL_ROUTING_2026.md:10` manda a Astra "investigacion multi-fuente", "campana final" y "cambios end-to-end". `equipo-de-agentes/SKILL.md:92` manda por defecto a Sol y Astra solo para seguridad, cobros, arquitectura ambigua o riesgo.
4. **Decisiones ambiguas.** `ONIA_EQUIPO_DE_AGENTES.md:61` manda "decisiones ambiguas" a Opus 5.5. `AI_MODEL_ROUTING_2026.md:10` y `equipo-de-agentes/SKILL.md:92` mandan "arquitectura ambigua" y "decisiones de negocio" a Astra.
5. **Oferta y campana.** `ONIA_EQUIPO_DE_AGENTES.md:62` y `ONIA_EQUIPOS_POR_SESION.md:79` (analista-oferta) dicen Opus. `AI_MODEL_ROUTING_2026.md:10` dice Astra para "campana final".
6. **Guiones.** `onia-sesion-madre/SKILL.md:40` dice Sonnet para guiones. `ONIA_EQUIPOS_POR_SESION.md:70` (guionista) dice opus, una pasada por lote.
7. **Migraciones y riesgo.** `ONIA_EQUIPO_DE_AGENTES.md:65` dice Codex Astra. `ONIA_EQUIPOS_POR_SESION.md:55` (auditor-riesgo de Plataforma) y `:111` (auditor-riesgo de la madre) dicen opus. `onia-sesion-madre/SKILL.md:42` dice "Astra/Opus segun carril". Son tres respuestas para una misma clase.
8. **Seguridad.** `equipo-de-agentes/SKILL.md:22` y el frontmatter de `.claude/agents/security-reviewer.md` (sonnet, M23) dan dos modelos para revision de seguridad.
9. **Haiku y Luna mezclados.** `equipo-de-agentes/SKILL.md:92` escribe "Haiku/Luna quedan para conteos mecanicos". Haiku 5.5 es Claude; Luna es Codex. Son familias distintas.
10. **Madre en Opus contra la regla del repo.** `ONIA_EQUIPOS_POR_SESION.md:104`, `ONIA_EQUIPO_DE_AGENTES.md:46` y `:83` fijan la madre en Opus. La regla de `CLAUDE.md:170-171` dice Opus solo para lo que decide riesgo. Medido: Opus 72,9 % del uso de la madre (`madre.md:155`). Es una decision de costo: la toma Sergio Urcullo; aqui solo queda registrada.
11. **Codex cloud.** `AI_MODEL_ROUTING_2026.md` no dice que el modelo cloud no se elige (M13 y `onia-sesion-madre/SKILL.md:306-308`). Las otras fuentes si lo dicen.
12. **Tabla repetida en cinco lugares.** La misma politica aparece en `AI_MODEL_ROUTING_2026.md`, `equipo-de-agentes/SKILL.md` (L22-L23, L92, L111), `onia-sesion-madre/SKILL.md` (L39-L43), `ONIA_EQUIPOS_POR_SESION.md` (§1, columna modelo) y `ONIA_EQUIPO_DE_AGENTES.md` (L61-L70, L78-L83). Ya se contradicen (puntos 2-7).
13. **Auditoria stale.** `ONIA_EQUIPO_DE_AGENTES.md:19` y `:208` dicen que `codex-tarea.sh` declara "code = astra". Hoy el header dice `gpt-6.1-sol` por defecto (M18). Esa observacion ya no se sostiene. `:200` ("cloud runs Sol 6.1") si sigue vigente: la nube corrio `gpt-5.6-sol` (M13).

## Configuracion propuesta

### 1. Tabla canonica en `AI_MODEL_ROUTING_2026.md` (reemplaza L8-L12 y quita la L3)

Texto listo para pegar:

```markdown
Estado: actualizado 2026-10-11. Fuente unica de modelos para Claude y Codex. Los demas archivos enlazan aqui y no repiten modelos.

## Tabla canonica

| Clase de trabajo | Modelo | Esfuerzo | Ejemplos | Escala a |
|---|---|---|---|---|
| Contar, buscar, comparar contra lista, leer captura, cotizar mecanico | Claude Haiku 5.5 | bajo | conteo de colas, SHA de imagen, cotizacion Higgsfield, verificador de promesas | Sonnet si falla el chequeo dos veces o pide juicio |
| Sintetizar, redactar, editar, revisar la salida de la otra familia, navegar con login | Claude Sonnet 5.5 | normal | copy, guion de edicion, integrador-pr, revisor-cruzado, navegador | Opus solo por riesgo conocido (produccion, plata, migracion, claims, identidad, voz de Sergio Urcullo) |
| Decidir lo ambiguo o lo riesgoso, una pasada por lote o PR | Claude Opus 5.5 | normal | analista-oferta, guion con voz de Sergio, auditor-riesgo (decide si se mergea) | Sergio Urcullo si excede el alcance autorizado |
| Madre local (PC) | Claude Opus 5.5 hoy | normal | orquestar, decidir intake | Decision pendiente de Sergio Urcullo (ver madre.md) |
| Codigo cerrado, fichas, auditorias, sintesis, revision de codigo de Claude | Codex gpt-6.1-sol | medium | contrato con META, PRUEBA DE HECHO y REGLA DE PARADA | Astra solo por riesgo o fallo demostrado |
| Escribir codigo de riesgo: seguridad, cobros, auth, RLS, migraciones, infra con root | Codex gpt-6-astra | medium | migracion #114 | Sin high: no hay medicion que lo respalde |
| Inventarios, JSON, rg, hashes, cambios mecanicos cerrados | Codex gpt-6-luna | low | manifest, ledger | Sol si falla |
| Codex cloud | sin eleccion de modelo | n/a | tareas largas de Platform sin PC ni secretos | Si se requiere Astra, carril local |

Regla: el modelo mas liviano que cumpla el contrato con evidencia. Escalar por riesgo conocido o fallo demostrado, no por tamano ni costumbre. Haiku es Claude y Luna es Codex: no se intercambian.
Riesgo: Opus decide si algo riesgoso se mergea (auditor-riesgo); Astra escribe el codigo de riesgo. Una sola regla por clase.
No se usan: gpt-6-sol. gpt-5.5 se retira el 14-oct. El modelo de Codex cloud no se elige desde la CLI (medido 8-oct).
```

### 2. Fila de Astra en `AI_MODEL_ROUTING_2026.md:10`

Quitar "investigacion multi-fuente", "campana final" y "cambios end-to-end". Esas tareas van a Sol o a Opus segun la tabla. Astra solo para riesgo (fila de la tabla).

Diff:
```diff
-| Arquitectura ambigua, decisiones de negocio, investigación multi-fuente, campaña final, revisión legal/comercial o cambios end-to-end | `gpt-6-astra` · `medium` | ... |
+(reemplazada por la tabla canonica del punto 1)
```

### 3. `ONIA_EQUIPO_DE_AGENTES.md`

- L61-L70 y L78-L83: quitar la columna de modelo y dejar una linea: `Modelos: hermes-content/docs/AI_MODEL_ROUTING_2026.md (fuente unica).` Mantener la columna de quien ejecuta (carril).
- L46: `The madre (Claude Opus 5.5 hoy, on the PC; modelo pendiente de decision de Sergio Urcullo, see madre.md)`.
- L65: se elimina junto con la tabla del punto anterior (Astra medium, sin high).
- L19 y L208: anteponer `RESUELTO 2026-10-11 (codex-tarea.sh header L19-L20 y defaults L46/L52/L58 en gpt-6.1-sol)`. No borrar: es historia de la auditoria.
- L200: se deja abierto.

### 4. `.claude/skills/equipo-de-agentes/SKILL.md`

- L92, reemplazar por:
```markdown
- **Modelo:** tabla canonica en `hermes-content/docs/AI_MODEL_ROUTING_2026.md`. Codex: Sol por defecto; Astra solo para riesgo. Haiku es Claude y Luna es Codex: no se intercambian.
```
- L111, reemplazar por:
```markdown
- Roles Claude: Haiku para contar y verificar, Sonnet para sintetizar y navegar, Opus para lo ambiguo o riesgoso. Detalle en `AI_MODEL_ROUTING_2026.md`.
```
- Agregar una linea en el encabezado: `Modelos: AI_MODEL_ROUTING_2026.md (fuente unica).`

### 5. `.claude/skills/onia-sesion-madre/SKILL.md` L39-L43

Reemplazar la tabla por:
```markdown
Modelo por tipo de trabajo: `hermes-content/docs/AI_MODEL_ROUTING_2026.md`. No repetir la tabla aqui.
```
Agregar en la seccion de modelos el enlace a la misma ruta.

### 6. `hermes-content/docs/ONIA_EQUIPOS_POR_SESION.md`

- Columna "Modelo y por qué" de §1: dejar el modelo del rol (debe coincidir con el frontmatter del agente), pero cada rol cita su clase de la tabla canonica (p. ej. `opus (clase: decidir)`). No inventar clases nuevas.
- L104: `Madre (PC, Claude Opus 5.5 hoy; decision pendiente de Sergio Urcullo, madre.md)`.
- L55 y L111 (auditor-riesgo): clase "decidir riesgo" = Opus. Cualquier codigo de riesgo va a Astra (`onia-sesion-madre` L42 se corrige a eso).

### 7. Registro de la decision de la madre

En `hermes-content/docs/cola/loop/madre.md`, agregar una linea con fecha:
```markdown
- [ ] M-modelo Madre: decision de modelo (Opus hoy, 72,9 % del uso 11-oct 02:20 UTC; regla de CLAUDE.md:170-171 dice Opus solo para lo riesgoso). Pendiente de Sergio Urcullo. Mientras no decida, la tabla canonica dice "Opus hoy, decision pendiente".
```

### 8. Enlaces obligatorios

`equipo-de-agentes/SKILL.md` y `onia-sesion-madre/SKILL.md` deben contener `AI_MODEL_ROUTING_2026` (hoy 0, M10).

## Quien la aplica

- **madre-dev** (dueña del harness del repo `onia-hermes`): aplica los puntos 1 a 6 y 8 en una rama y PR. No directo a `main`.
- **Integrador (`onia-cola`)**: mergea el PR cuando pase CI. No decide modelos.
- **madre-marketing**: revisa que Lucia, Marca personal y Ventas enlacen a la tabla y no copien modelos. Ventas mantiene Opus para oferta y promesa (`ONIA_EQUIPO_DE_AGENTES.md:79`); eso no cambia.
- **Sergio Urcullo**: decide dos cosas que esta prueba no puede cerrar: (a) la madre sigue en Opus o pasa a Sonnet con Opus solo para lo riesgoso (la regla de `CLAUDE.md:170-171` dice lo segundo; el uso medido es 72,9 % Opus); (b) si se permite Astra en `high` (hoy no hay medicion; la propuesta lo quita). Ambas son gasto y cambian el cupo.
- **Sesion Codex (Sol)**: no aplica nada. Codex no hace git; el cambio de docs lo hace madre-dev.

## Prueba de hecho

Los comandos se ejecutan desde el worktree. Excluir este propio archivo (`--exclude=L04-*`) porque cita las frases.

1. `grep -rn -E "Astra 6, high|Opus 5.5 with Ultracode" hermes-content/docs .claude/skills --exclude='L04-*'` debe dar **0 lineas**. Hoy da 2 (ONIA_EQUIPO_DE_AGENTES.md:46 y :65).
2. `grep -rln "AI_MODEL_ROUTING_2026" hermes-content/docs .claude/skills` debe **listar** al menos estos cuatro: `equipo-de-agentes/SKILL.md`, `onia-sesion-madre/SKILL.md`, `ONIA_EQUIPO_DE_AGENTES.md`, `ONIA_EQUIPOS_POR_SESION.md`. Hoy lista 9 archivos, pero los dos skills no aparecen (M10): el conteo sube solo si se aplica el punto 4 y 5.
3. `grep -rn -i -E "astra.{0,12}high" hermes-content/docs .claude/skills --exclude='L04-*'` debe dar **0 lineas**. Hoy da 1 (ONIA_EQUIPO_DE_AGENTES.md:65).
4. `grep -c "end-to-end" hermes-content/docs/AI_MODEL_ROUTING_2026.md` debe dar **0**. Hoy da 1 (L10).
5. `grep -n "gpt-6.1-sol" scripts/codex-tarea.sh` debe dar **4 lineas**: comentario L19 y defaults en L46, L52, L58. Hoy da 4 (sin cambio; es la verificacion de coherencia, no de cambio).
6. `grep -rn "Haiku/Luna" hermes-content/docs .claude/skills --exclude='L04-*'` debe dar **0**. Hoy da 1 (`equipo-de-agentes/SKILL.md:92`).
7. `grep -c -i -E "opus|sonnet|haiku" hermes-content/docs/AI_MODEL_ROUTING_2026.md` debe dar **mayor que 0** (la tabla canonica ya tiene modelos Claude). Hoy da 0.
8. `grep -n "decision pendiente\|decision de modelo" hermes-content/docs/cola/loop/madre.md` debe dar **al menos 1 linea con fecha**. Hoy da 0.

Lectura de los resultados: 1, 3, 4 y 6 deben dar 0. 2 debe listar los cuatro archivos del punto 2. 5 debe dar cuatro lineas, de las cuales tres son defaults. 7 y 8 deben dar mayor que 0. Si la decision de la madre sigue pendiente, la prueba 8 pasa solo con la linea "pendiente" del punto 7.

Como verificar de forma independiente: un verificador Haiku ejecuta los ocho comandos y reporta el conteo. El criterio es el de arriba, no "distinto de cero".
