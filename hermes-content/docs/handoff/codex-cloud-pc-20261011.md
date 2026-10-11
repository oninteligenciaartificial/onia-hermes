# Auditoría cloud ↔ PC y relevo de madres — 11-oct-2026

**META:** preparar una arquitectura verificable para ONIA SaaS con madres supervisoras locales, ejecución principalmente cloud y acceso local acotado, sin retomar producción.
**PRUEBA DE HECHO:** informe contrastado con referencias Git, observaciones de UI/CLI comunicadas por la madre y documentación oficial; piloto con resultados pendientes.
**REGLA DE PARADA:** no activar sesiones, instalar, generar, publicar, desplegar, rotar secretos ni crear accesos/túneles; cualquier acceso nuevo requiere aprobación específica. La madre revisa este documento antes de commit/push.

## Decisiones y alcance

- ONIA es SaaS; el reparto vigente tiene MADRE MARKETING y MADRE DESARROLLO-INFRA locales.
- Marketing supervisa Lucía, Marca personal y Ventas/pauta; Desarrollo-Infra supervisa Plataforma, Hermes/QA e infraestructura.
- Las madres definen contratos, delegan, verifican y resumen; delegan la ejecución local a un worker local.
- Prioridad: trabajo cloud. Orquestador definitivo Claude/Codex PENDIENTE; esta auditoría no cambia el orquestador.
- Modelos solicitados: Astra para decisiones difíciles de madres; Sol 6.1 para ejecución; Luna para mecánica. Capacidad real por cuenta, entorno y herramienta se verifica antes de asignar.
- Claude quedó sin cuota disponible en la observación comunicada; no reactivar sus sesiones.

## Evidencia observada y límites

- Madre informó UI Claude: cuota al 100 %, reinicio 15-oct 04:00 Caracas; Trusted Device bloquea acceso a madres. Es snapshot, no predicción de disponibilidad.
- CLI comunicadas: Claude 2.1.288 y Codex 0.161.0. Esto supera los handoffs de 5-oct que todavía indican Codex 0.139 y gpt-5.5.
- Inventario comunicado: 43 en `onia-hermes/.claude/skills` (no todas propias de ONIA), 30 en `onia-hermes/.agents/skills`, 6 en `onia-platform/.claude/skills` y 108 en `C:/Users/PC/.claude/skills`. Conteos no demuestran paridad ni carga efectiva en cloud.
- Reusar fuentes canónicas `.claude/skills/`; registrar por ejecutor qué skill puede leer y qué versión usa. No duplicar skills para resolver diferencias aparentes.
- Se actualizaron referencias mediante fetch, sin merge de main. Checkout previo `ac8f2d44` (8-oct); `origin/main=2cdefca7` (10-oct).
- Este informe vive en `codex/cloud-pc-audit-20261011`, worktree aislado basado en PR #195. Ningún cambio al checkout principal.
- Lecturas Git del auditor confirman documentos y commits; no confirman sesiones vivas, cuotas actuales, ejecución de timers ni producción.

## Arquitectura candidata y respaldo

1. **Candidata:** Work Cloud con acceso local si la cuenta/entorno lo ofrece y el piloto confirma repo y navegador autenticado. No asumir que ver una carpeta implica acceso al navegador.
2. **Respaldo:** ejecutores cloud con contratos autocontenidos; un worker local reutiliza el navegador autorizado y serializa su uso entre las dos madres.
3. Las madres mantienen sus carriles. Un contrato tiene dueño, META, entradas, rutas permitidas, PRUEBA, PARADA y resultado revisable.
4. VPS es un destino separado con alcance/permiso propios; no trasladar bóveda, cookies ni sesiones personales al servidor.
5. No crear túneles, puentes, credenciales o infraestructura nueva durante la auditoría. Disponibilidad comercial no equivale a autorización ni configuración lista.

Fuentes oficiales para validar capacidades, límites y configuración:

- [Work Cloud: acceso local](https://learn.chatgpt.com/docs/enterprise/cloud-local-access).
- [Entornos cloud](https://learn.chatgpt.com/docs/environments/cloud-environments).
- [Claude Remote Control](https://code.claude.com/docs/en/remote-control).
- [Mensajería entre sesiones](https://code.claude.com/docs/en/cross-session-messaging).

La elección queda condicionada a comprobar las funciones en esta cuenta. No declarar acceso operativo a partir de esas páginas.

## Continuidad reciente: fuentes por rama

- Desarrollo: `origin/claude/arranque-nueva-madre-ba386e`, `hermes-content/docs/handoff/madre-local.md:25-47,79-115` (11-oct, PR #195).
- Marketing: `origin/claude/pagos-checkout-strategy-b40756`, `hermes-content/docs/handoff/madre-marketing.md:1-29,31-44,46-55,92-124` (11-oct).
- Main contiene handoffs anteriores: Marca hasta 8-oct; Lucía hasta 5-oct. No reconstruir el presente únicamente desde ellos.
- P1 reciente: `origin/claude/gifted-clarke-y4vvtj`, commit `781df7d87b53913ac9790fa1df88e53357408bc3`, `hermes-content/videos/moldes/niveles/P1-NIVELES-GUION-MOSAICO-TABLERO.md:1-13`.

**Desarrollo, corte documental 11-oct 12:40 UTC:** platform #147, #148/#149/#152/#153, #151, #155 y #156 registrados como mergeados. `release-fd72cd55` figura mirado a las 09:54; publicación 12:50 de parte del lote figura anunciada, no verificada por este auditor. Siete contratos estaban listos para push 13:12; U10 corriendo y #150/#154/#157 abiertos. No relanzar desde este snapshot.

**Marketing, corte documental 11-oct ~09:15 UTC:**

- Cinco brutos con tablas de cortes: N06, DD-A, N07, N02, S2-D07-A. Borradores de los cuatro primeros esperan OK; no son masters aprobados.
- S2-D07-A contiene una afirmación falsa sobre variables de plantillas: cortar o regrabar requiere decisión de Sergio Urcullo.
- G2/G3/G4/G5 y pieza 9 de Lucía: revisiones mudas mostradas, pendientes de OK y voz. G1 v2 tiene autorización de publicación registrada, bloqueada por token IG.
- Prueba 1 v2 de Ventas: réplicas y PARA-GRABAR preparados; falta aprobación, decisión 3/4 anuncios y grabación. No hay aprobación de gasto por inferencia.
- Seis teleprompters SI listos; otras piezas requieren mediciones. Guiones SI-01..SI-11 pasados a Marca.
- P1 Niveles: **guion de 40 s, sin render**; aprobación del molde, 40 frente a 30 s y ajuste del verde pendientes. Commit verificado, no video terminado.
- BA814C81: estado contradictorio entre tabla que lo sitúa en Drive y texto que dice ausente; madre observa falta de enlace utilizable. No tratarlo como recibido.
- Pedidos PC pendientes: render HyperFrames offline y música con licencia verificable. Recordatorios repetidos sin novedad no demuestran avance.
- Handoff registra K11 e historias 1-3 publicados el 10-oct; este auditor no comprobó redes.
- Créditos/voz documentados: 11/150 Higgsfield y 381 caracteres disponibles frente a ~1.800 requeridos. Refrescar antes de cualquier gasto.

**Contradicciones que no deben heredarse como órdenes:**

- El bloque viejo de madre v5 dice “única madre”, mientras el reparto posterior establece dos madres.
- El tope compartido de Codex aparece como 3 corridas y como 2 en secciones distintas; fijarlo antes de lanzar trabajo.
- **ANTIGRAVITY 20:00 UTC:** el handoff dice “sin respuesta, sale”, aunque la regla exige mostrar y OK. Estado vivo **NO VERIFICADO**. No cancelar ni publicar sin orden; señalar el riesgo a la madre.
- La nube todavía puede rechazar autorización transmitida por otra sesión. No rodear el control; obtener autorización válida para el mecanismo concreto.

## Tokens: diagnóstico acotado

Ventana aproximada comunicada: **10-oct 17:06:58 → 11-oct 17:07:19 UTC**; 421 archivos, 4.180 registros únicos, tomando el primer `usage` por `message.id`.

- Cache-read: **1.135.675.131** tokens; output: **1.218.181** tokens.
- Es una aproximación de registros locales, no dinero, cuota consumida, memoria única ni prueba causal de una estrategia fallida.
- Verificar semántica de los contadores y mensajes finales antes de estimar costos: el primer registro puede estar incompleto; cache-read puede acumular el mismo contexto reutilizado en varias llamadas.
- Hipótesis a medir: reducir relectura completa y recordatorios repetidos mediante contratos breves, cambios desde el último SHA y verificación mecánica delegada.

## Caveman: inspeccionado, no activado

Ruta exacta: `C:/Users/PC/.claude/plugins/marketplaces/caveman/skills/caveman/SKILL.md`.
Inspección de líneas 11-23: estilo persistente, nivel full por defecto y eliminación de hedging; líneas 54-67: claridad para riesgos/secuencias y escritura normal de código/commits/PRs.

Propuesta **lite**: español claro, resumen corto con hechos, incertidumbre y siguiente acción; conservar nombres, evidencias y condiciones. No eliminar incertidumbre real. No hay prueba de calidad ni activación. Comprimir salida no demuestra ahorro de input.

## Piloto preparado — NO EJECUTADO

1. Comprobar disponibilidad en UI de la cuenta/entorno: captura de función y alcance; sin activarla.
2. Solicitar aprobación concreta si requiere acceso nuevo, indicando origen, permisos y destino. No instalar nada durante esta auditoría.
3. Con aprobación, contrato de lectura con nonce inocuo: devolver ACK, nonce, SHA y ruta permitida; conservar evidencia sin secretos.
4. Probar navegador por separado: lectura de página acordada y captura inocua. Confirmar sesión reutilizada y exclusión mutua; no exportar cookies.
5. Probar VPS únicamente bajo autorización independiente y lectura restringida acordada. ACK del repo no habilita VPS.
6. Evaluar fallos, permisos, duplicación y latencia; registrar resultado por prueba. Sin generaciones pagadas en Higgsfield, publicaciones ni producción; lectura de cuenta permitida dentro del piloto autorizado.
7. Elegir arquitectura después de revisar evidencias con Sergio Urcullo. Orquestador, sesiones y modelos quedan sin cambiar hasta entonces.

**Cierre:** informe preparado para revisión de la madre; piloto y acceso cloud-local bloqueados por disponibilidad y aprobación específica. Sin commit/push ni otros archivos modificados por este auditor.
