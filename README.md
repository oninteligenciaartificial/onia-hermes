# ONIA — empresa, marca personal y sistema de trabajo

Este repo reúne herramientas, fuentes y trabajo de ONIA. No es un inventario vivo de cuentas o servidores: una receta, un README viejo o una CLI instalada no prueban acceso ni salud actual.

## Empezar

1. `AGENTS.md`: autoridad, alcance y guardas compartidas.
2. `COORDINATION_MANIFEST.md`: propiedad y carril; comprobar el runtime antes de reutilizar una sesión.
3. [LEEME-PRIMERO](hermes-content/docs/LEEME-PRIMERO.md): índice canónico por sección de empresa y marca personal.
4. `.claude/skills/onia-router/SKILL.md`: elegir solo las skills pertinentes.

## Dónde trabajar

| Sección | Fuentes / ubicaciones |
|---|---|
| Empresa: estrategia, producto y venta | `hermes-content/docs/`; el código del producto tiene repo propio en `C:/dev/proyectos/onia-platform` |
| Comercial y propuestas | `hermes-content/propuestas/`, `sales-kit/` y documentación comercial canónica |
| Marca personal | `hermes-content/sitio-sergiourcullo/`, `references/marca-personal/`, `references/marca-personal-sergio/`, `videos/marca-personal/` y su handoff |
| Formación recibida | [Anunciante Supremo y clases](hermes-content/references/formacion/anunciante-supremo/README.md) |
| Agentes, ejecución e infraestructura | `.claude/`, `.agents/`, `.hermes/`, `scripts/`, `hermes-content/infra/` y `deploy/` |
| Historia y evidencia | `hermes-content/docs/historial/`, `handoff/`, `research/` y `references/video-intake/`; no activar tareas por aparecer allí |

Estas ubicaciones técnicas se conservan para no romper consumidores. Ordenar no significa mover todo el código, borrar duplicados ni copiar perfiles personales.

## Cómo se comprueba una entrega

Cada encargo tiene objetivo, salida, dueño, permisos, prueba y parada. Revisar el artefacto exacto y reconciliar su estado; técnico, editorial, integrado y publicado son estados distintos. Un hook/Stop no autoriza Git ni publicación.

En Hermes TUI, `/agents` muestra subagentes/procesos; seleccionar uno y `d` muestra detalles/modelo, `t` actividad. No es el backlog completo ni abre una sesión de Orca. La barra compacta solo aparece mientras hay actividad.

## Seguridad y estado

No ejecutar instaladores, deploys, generadores o comandos de higiene por haberlos encontrado aquí. Leer su alcance y obtener las aprobaciones que corresponden. Secretos, sesiones y bóvedas quedan fuera de Git y del chat.

Las afirmaciones anteriores sobre VPS, Telegram, Instagram, tokens y MCP eran antecedentes, no prueba del estado actual. Se conservaron completas en [entradas anteriores](hermes-content/docs/historial/entradas-anteriores-20261025.md). Verificar el servicio y la cuenta de la tarea antes de operar; no repetir una rotación/login desde una nota vieja.
