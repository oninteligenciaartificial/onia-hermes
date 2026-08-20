# Dieta del CLAUDE.md — propuesta ANTES/DESPUÉS (NO aplicada)

> Del taller Code w/ Claude: "el system prompt solo para lo que Claude necesita
> en la cabeza SIN IMPORTAR la tarea; skills para lo que necesita A VECES".
> Regla de esta pasada: NO se borra información — se reubica. Nada se aplica
> sin el OK de Sergio.

## Medición

| | Líneas | Caracteres | Tokens (~chars/3,5) |
|---|---|---|---|
| **HOY** | 247 | 12.814 | **~3.600 por sesión** |
| **PROPUESTO** | ~105 | ~5.500 | **~1.570 por sesión** |
| **Ahorro** | −57% | | **~2.000 tokens × cada sesión, todas las sesiones** |

(Aproximación chars/3,5 para español; no hay tokenizer exacto local — medición
honesta, no estimación a ojo de contenido.)

## Clasificación sección por sección

| Sección | Veredicto | Motivo | A dónde va |
|---|---|---|---|
| Objetivo por sesión | **(a) QUEDA** | Meta-regla de toda sesión | — |
| Skills del proyecto (4 capas + lista) | (a) comprimida | El ruteo es siempre; la EXPLICACIÓN de capas es a veces | 3 líneas: arrancar por `onia-router` + skills del producto obligatorias en onia-platform |
| Una sola fuente de verdad (pricing) | **(a) QUEDA** | Nació de 4 precios vivos del mismo chatbot — evita el error aunque la tarea no sea de precios | — (−3 líneas de redundancia) |
| Verificar es MIRAR | **(a) QUEDA** | Error caro (iconos como texto con 200) — aplica a toda tarea | — (los casos largos ya viven en la skill `onia-verificacion` del producto) |
| Nada a medias | **(a) QUEDA** | Error caro (capa multi-rubro apagada) | — |
| Hay UN solo producto (marca) | (a) comprimida a 4 líneas | La marca la necesita CUALQUIER sesión que escriba copy | Detalle de vocabulario → ya está en skill `onia-frontend` |
| ONIA Core (21 caps, validate, gates) | **(b) → puntero** | Solo sesiones que tocan el core | Skill `onia-core` EXISTE y lo cubre. Queda 1 línea: "un rubro se ENCIENDE desde el core, no se escribe" |
| Base de producción (VPS, RLS, quirúrgico) | **(b) → puntero** | Solo sesiones que tocan base/deploy | Skills `onia-db` + `onia-deploy` del producto EXISTEN (creadas 2026-08-16) y lo cubren con más detalle |
| Carriles | (a) comprimida | Mecánica de toda sesión multi-agente | — (−4 líneas) |
| main siempre compila | **(a) QUEDA** | Error caro; el autosync lo arrastra a deploy | — |
| Git auto-sync | **(a) QUEDA** | Cada sesión commitea | — |
| Velocidad | (a) comprimida | Estilo de trabajo permanente | — |
| Dónde va cada cosa (tabla) | **(a) QUEDA** | Es el Gate 2 — toda sesión que escribe archivos la usa | — |
| Cuándo separar un repo | (b) SIN skill que lo cubra | Decisión rara (meses) | Se queda comprimida a 3 líneas (regla: sin destino no se borra) |
| Propuestas comerciales (9 reglas) | **(b) → puntero** | Solo sesiones de propuestas | Skill `onia-propuestas` EXISTE + fuente `hermes-content/skills/propuestas-comerciales-onia.md`. Quedan 2 líneas: "nunca HTML a mano" + "precios de pricing.ts" |
| Video (2 skills + reglas) | **(b) → puntero** | Solo sesiones de video | Skills `ver-videos` + `editor-videos` EXISTEN. Quedan 2 líneas: REGLA DE ORO (tabla de cortes + preview ANTES de cortar) + gasto pago = permiso |

**Los (b) sin skill existente**: solo "cuándo separar un repo" — se queda (no se
crea skill en esta pasada, como pide la consigna).

## El CLAUDE.md propuesto (~105 líneas) — borrador para tu OK

Estructura resultante:

```
# 1. Al arrancar (12 líneas)
- Objetivo por sesión (completo, sin tocar)
- Arrancar por onia-router · el producto tiene skills propias OBLIGATORIAS en
  onia-platform/.claude/skills/ · trampa nueva → editar la skill, no doc suelto

# 2. Las tres que más se rompen (48 líneas — casi intactas, son las de errores caros)
- Una sola fuente de verdad (pricing.ts manda · catálogo · fecha=historia)
- Verificar es MIRAR (con sus casos)
- Nada a medias (construido ≠ terminado · estado escrito al cerrar)

# 3. Marca y producto (8 líneas)
- UNA plataforma, packs por rubro. DentalGest/GestiOS/etc NO son productos.
- 7 rubros: nunca "tus pacientes" en material genérico (vocabulario → onia-frontend)
- Un rubro nuevo se ENCIENDE desde el core (detalle → skill onia-core)
- Base de prod y deploy → skills onia-db / onia-deploy del producto

# 4. Cómo se trabaja (30 líneas)
- Carriles (comprimido) · main siempre compila · git auto-sync · velocidad
- Dónde va cada cosa (la tabla completa — es el Gate 2)
- Separar repo: 3 líneas

# 5. Dominios (7 líneas — solo reglas de oro + punteros)
- Propuestas → skill onia-propuestas. Nunca HTML a mano; precios de pricing.ts.
- Video → skills ver-videos / editor-videos. Tabla de cortes + preview SIEMPRE
  antes de cortar. Generación paga = permiso explícito.
```

## Qué NO cambia con la dieta

- Ninguna regla desaparece: las (b) viven en sus skills (que se cargan cuando la
  tarea las dispara) y el CLAUDE.md corto las apunta.
- Las reglas nacidas de errores caros quedan TODAS en el system prompt.
- onia-router sigue siendo la puerta: el ruteo fino ya lo resuelve él.

**PENDIENTE DE SERGIO: OK para aplicar** (se edita CLAUDE.md + se verifica que
cada contenido movido esté de verdad en su skill antes de recortar).


---

## APLICADA 2026-08-18

Resultado REAL medido (no el estimado del plan):

| | Líneas | Caracteres | Tokens (~chars/3,5) |
|---|---|---|---|
| Antes | 247 | 12.814 | ~3.660 |
| **Después** | **213** | **10.620** | **~3.030** |
| Ahorro | −34 (−14%) | −2.194 | **~630 por sesión** |

**Menos de lo proyectado (~105 líneas), y con razón**: al aplicar, la mayoría de las
secciones resultaron ser (a) SIEMPRE — nacidas de errores caros que se necesitan aunque
la tarea no las toque. Comprimir más habría sido borrar la historia que hace que la
regla se obedezca. Lo que sí se movió a punteros (con destino verificado, no supuesto):

- ONIA Core → skill `onia-core` (9→5 líneas)
- Base de producción → skills `onia-db` + `onia-deploy` del producto (7→7 pero ahora
  apunta al detalle real, incluida la trampa del search_path)
- Propuestas: las 9 reglas → skill `onia-propuestas` + su fuente (18→10)
- Video → skills `ver-videos` / `editor-videos` (14→9, conservando la REGLA DE ORO)
- Skills/marca/carriles/separar-repo: comprimidas sin perder contenido

**Verificado tras aplicar**: las 8 reglas de errores caros siguen presentes
(objetivo por sesión · fuente de verdad · verificar MIRANDO · nada a medias · main
compila · auto-sync · dónde va cada cosa · regla de oro del video) y hay 5 punteros
a skills cuyo contenido se comprobó que existe ANTES de recortar.
