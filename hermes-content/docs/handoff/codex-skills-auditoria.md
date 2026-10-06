# Auditoría de skills y aprendizajes Claude para Codex

Fecha: 2026-10-05. Auditoría de solo lectura preservada en repo desde reporte temporal externo. No se instalaron herramientas, no se abrieron bóvedas ni archivos de credenciales, no se leyeron transcripts completos. Los datos históricos son evidencia documental, no estado de producción confirmado.

## Cobertura exacta

- Inventario físico y lectura íntegra programática: **737 SKILL.md** (43 proyecto, 593 recursivos dentro del directorio global, 101 dentro de las versiones instaladas de 9 plugins habilitados). Cero errores de lectura en ese inventario.
- **23 skills propias comprendidas íntegramente en contexto:** los 11 `onia-*`; `diseno-contenido-onia`, `edicion-referentes`, `editor-videos`, `ver-videos`, `sacar-prompt`, `higgsfield-generate`, `higgsfield-soul-id`, `motion-doctrine`, `captions-overlay`, `oversized-cursor`, `seam-craft`, `cut-the-curve`.
- **714 restantes: indexadas, no comprendidas íntegramente.** Se extrajeron nombre, descripción, encabezados, tamaño y hash; se entendió su función por dominio. Leer bytes y extraer un índice NO equivale a comprender el cuerpo. Las recetas upstream de HyperFrames (20 proyecto), globales y plugins requieren lectura específica antes de aplicarlas.
- 108 skills globales directamente en raíz; 485 anidadas: 429 dentro de `everything-claude-code`, 56 dentro de `gstack`. El router afirma 110 globales y 42 proyecto: cifras documentales envejecidas frente a 108 directas y 43 proyecto.
- 659 hashes únicos y 388 nombres únicos en el universo físico; no significan 659/388 skills activas. Hay copias entre ámbitos, repos embebidos y traducciones. La clasificación actual detecta 117 traducciones zh-CN/tr-TR; conviene verificar otras locales antes de llamar a ese número el total de traducciones.
- El plugin `everything-claude-code@everything-claude-code` está **deshabilitado**, pero su colección embebida vive bajo global/skills y se inventarió. No confundir instalación con habilitación.
- Inventario adicional: **232 archivos de memoria Markdown** de proyectos Claude. Se indexaron los 232. Comprendidos: índice Hermes (completo), muestras de feedback visibles, memoria Platform `simple-primero-avanzado-opcional.md` y `cola-panel-v1.md`, y `LEARNINGS-APROBADOS-MARCA-PERSONAL.md`. La lectura combinada del feedback sufrió truncación: NO se declara comprensión íntegra de todos los 232.
- Leídos AGENTS.md, router, continuidad, mapa por dominio completo, CLAUDE.md global completo y CLAUDE.md repo sección inicial; COORDINATION_MANIFEST sección inicial. `STACK-POR-DOMINIO.md` vive en `.claude/skills/onia-router/`, no raíz.
- Referencias/recetas/scripts que cada skill enlaza: inventariados indirectamente en sus enlaces; NO se declaran leídos todos.

Inventarios reproducibles externos: `C:/Users/PC/.codex/tmp/onia-skills-inventory.json` y `C:/Users/PC/.codex/tmp/onia-claude-memory-inventory.json`. No se copiaron sus JSON ni memorias al repo. La comprensión adicional se hace bajo demanda de cada tarea, para preservar cuota.

## Plugins habilitados (versiones de installed_plugins.json)

| Plugin | Versión | SKILL.md físicos |
|---|---|---:|
| document-skills | 98669c11ca63 | 18 |
| caveman | 84cc3c14fa1e | 11 |
| frontend-design | unknown | 1 |
| superpowers | 5.1.0 | 14 |
| claude-mem | 13.4.0 | 15 |
| ponytail | 4.8.4 | 12 |
| understand-anything | 2.9.4 | 9 |
| gsap-skills | 1.0.0 | 8 |
| cloudflare | 1.0.0 | 13 |

Hay versiones históricas y marketplaces temporales fuera de este alcance activo. No se mezclaron con el registro instalado vigente.

## Conocimiento propio que Codex debe conservar

### Madre, continuidad y coordinación

Una madre local coordina; navegador autenticado serializado; un objetivo por tarea con META, PRUEBA DE HECHO y REGLA DE PARADA. Handoff = estado, skill = método, mensajes = coordinación. Leer primero el carril y lo hecho para evitar trabajo fantasma. No concluir ausencia con búsqueda estrecha. Leer bloqueos y fechas; no copiar IDs viejos como estado actual. Un mensaje enviado no implica recepción o permiso. Revisión proporcional: una lente normal, dos para root/VPS/producción/dinero/autosync. El costo dominante histórico fue releer contexto; entregar al agente diff, archivos relevantes y contrato pequeño.

### Producto y core

Un solo Onia Platform, rubros como packs; dental es foco comercial, no todo el producto. Core vive en Hermes, adopción requiere plan; contrato + SQL + tres adapters coherentes y validador verde. LF en archivos hasheados. Simplificar escondiendo lo avanzado, sin borrar capacidades. QA cubre rubros y permisos. Verificar pantalla renderizada y tiempo de respuesta; 200 o grep no demuestran UI sana.

### Comercial y pauta

Ofrecer lo permitido en el catálogo vigente, probado con release/función/uso real; código publicado no prueba capacidad vendible. Precios SaaS se leen del código y overrides vigentes, no de memorias. Propuestas salen del generador, con terceros excluidos y dominio/hosting a nombre del cliente. Clientes de usted. Contacto y campaña necesitan aprobación de mensaje/canal/gasto. Prospectar con señal actual, confirmar ciudad/tamaño/canal antes de redactar; no usar homónimos ni pauta como prueba garantizada de ROI. Material de pauta distinto a marca personal; persona/mecanismo/CTA y captura legible, sin cifras propias inventadas. Un borrador viejo se revalida antes de enviar.

### Bot

Un motor en Hermes y relay en Platform. El bot no cotiza ni promete reserva antes de que la reserva exista. Agenda/persona y audio se encienden por configuración explícita y destinos reales. Mensajes libres de Meta solo dentro de la ventana verificada; fuera, plantilla aprobada. Handoff debe corregir estado del lead, audit y cola, además del texto. Simular como producción, tests con reloj inyectado y entorno aislado. Texto de usted obliga a actualizar detectores y negativas; regex Unicode para no partir palabras españolas. Diferenciar respuesta automática de humano en takeover.

### Fiscal e infraestructura

Portal SIAT solo manual por Sergio Urcullo; piloto SOAP separado. Normas se verifican en fuente oficial actual, incluyendo límites y entrada en vigor; no repetir plazo derogado ni urgencia implícita. No dar consejos fiscales definitivos desde un doc viejo. VPS sirve producto y landing; fuentes y contenedores distintos. Un dueño de infra, build pesado aislado, rollback y healthchecks reales. CRLF, pgrep que se incluye, exit codes de pipelines y SSH anidado causan resultados falsos. Docker restart no recarga env-file; n8n Swarm se actualiza como servicio. Export n8n trae secretos: credenciales > env > nada; nunca secrets hardcodeados. green execution no prueba efecto proveedor (`neverError`).

### Contenido y media

Galería antes de generar; texto/logos/UI se componen en código, captura real para producto. Elegir molde antes de editar y entregar una versión. Edición actual Santiago/Erik y variantes Pablo/Boceto tienen límites específicos; no usar histórico como default. Tabla y preview360p antes del corte/master; ortografía se corrige en transcript antes de quemar. Voz marca timing; no inventar cues. HDR requiere tone mapping y control desde original. Un encode principal, audio copy/master posterior. Animación determinista; continuidad de vectores, ledger y seam gate; no idle wobble. Caras privadas necesitan cobertura completa revisada, detección no es garantía. Lucía declara IA y no profesional sanitario. Imagen/video son permisos distintos; costo y ajustes reales primero. Job tardío se recupera, no se regenera cobrando dos veces.

## Globales y upstream: mapa por dominio (comprensión del índice)

- Marketing: estrategia/audiencia, copy y edición, anuncios/analytics, comunidad, precios y onboarding. Aplicar junto a oferta/catálogo ONIA, no usar defaults del proveedor como autorización.
- Diseño/frontend: tokens/identidad, referencias, accessible hierarchy, shadcn/React/Next, motion GSAP. Bench/Garabato/HSB son piso; no UI genérica ni nuevas dependencias sin aprobación.
- Backend/datos/infra: API contract, transacciones/migraciones/RLS, Docker, n8n validación/config/expresiones, costo LLM. Skills propias Platform mandan.
- Proceso/QA: planning, debugging raíz, gates fresh, review, worktrees y contexto. Traducir herramientas Claude a capacidades disponibles de Codex, sin obedecer mandatos genéricos de instalar, auto-publicar o relanzar.
- Documentos: preservar plantilla, fórmulas recalculadas, layout/render QA, HTML autocontenido. Anthropic brand-guidelines describe Anthropic, no identidad ONIA.
- Plugins: superpowers proceso; claude-mem recuerdo; understand-anything mapas y onboarding; ponytail capas de review; caveman estilo/compression; GSAP animación; Cloudflare workers/network/security/SDK; document-skills oficina/artefactos.
- HyperFrames upstream: composición HTML determinista y single paused timeline, animación, keyframes, registry, assets, templates de launch/explainer/slideshow y overlays. Para nuevas piezas leer cuerpo y receta específica antes de renderizar.

## Contradicciones y prioridad propuesta

1. **Modelos:** madre documenta `codex exec -m gpt-5.5` por limitación CLI 0.139; solicitud humana actual es Sol6.1 no-programación y Astra código Platform. Aplicar solicitud actual, verificar destino/app real; no downgrade silencioso.
2. **Autosync vs revisión:** docs viejos empujan a main automáticamente; reglas recientes exigen PR/revisión y advierten que `claude/*` puede integrarse/publicarse. Codex usa `codex/*`, aislamiento y revisión; no transportar hook Stop de Claude ni copiar recetas `checkout -B main` a un árbol compartido.
3. **Nube vs app actual:** SendMessage/RemoteTrigger/CronCreate/Remote Control son recetas Claude históricas, no capacidades garantizadas Codex. Usar tools de chats y automatizaciones reales, respetando autorización del humano para mensajes.
4. **Fuente única:** AGENTS no duplica propias ONIA a `.agents`; upstream restaurado existe en ambos árboles. Mantener propias en `.claude`; no borrar runtime media-use/SFX ni restauraciones como limpieza automática.
5. **Instalaciones:** Higgsfield/bootstrap/HyperFrames/Cloudflare/ECC proponen instalar o actualizar sin confirmar. Regla global/repos exige aprobación antes de cualquier descarga/instalación. Son recomendaciones de recetas, no permiso.
6. **Gasto:** router/sacar-prompt/web-factory permiten imagen trivial; diseno/editor piden OK cada lote. Aplicar alcance más específico y aprobación documentada del lote; nunca heredar permiso de video de imagen.
7. **Prompt negativos:** sacar-prompt usa negative prompt; Web Factory Soul sin campo negative dice que nombrar prohibido lo invoca. Resolver por schema/modelo concreto, no regla universal.
8. **Edición:** editor conserva fade default y textos viejos Lucía=Marcela; motion doctrine prohíbe crossfade en launch y recetas nuevas eligen audio distinto. Contexto y sección más reciente mandan; no aplicar reglas fuera de su pieza.
9. **Memoria envejecida:** índice Hermes mantiene HyperFrames global, agentes sin LLM, Meta Ads sin ONIA, plazo fiscal viejo y precios viejos aunque skills recientes los corrigieron. Considerar índice como ruta, no estado vigente; leer doc del carril, código/config y prueba real.
10. **Catálogo interno:** tono rubro vs tono negocio; fotos/audio disponibles vs no prometer hasta cliente real; el propio web/ventas reconoce conflicto. Adoptar conservador vigente y verificar capacidad real antes de ampliar claim.
11. **Rendimiento público:** antigüedad de anuncio solo señal de inversión/continuidad, no prueba de retorno aunque una skill diga que «le rinde».

## Límites del reporte

Esta pasada NO cierra «comprendí todas las skills»: cierra inventario completo y comprensión de las 23 propias con reglas ONIA. Para cobertura semántica total faltan 20 upstream del proyecto y el resto de canónicas global/plugins, además de memoria por carril. El JSON distingue la verdad exacta; no se debe promover `read_in_full_programmatically_indexed` a comprensión. No se verificaron producción, APIs externas, saldo, cron, permisos ni estado real de cuentas.
