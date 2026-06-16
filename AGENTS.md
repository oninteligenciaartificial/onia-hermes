# Hermes Agent Orchestration Order

## Orden principal
Antes de ejecutar cualquier cambio relevante en Hermes, planear primero y dividir el trabajo en agentes especializados cuando la tarea lo justifique.

El objetivo es usar la mayor capacidad disponible sin perder control: pensar por frentes, delegar lo que pueda revisarse en paralelo y validar antes de cerrar.

## Regla data-first
Antes de pedir datos al usuario, revisar primero las fuentes disponibles. El agente
debe buscar en archivos canonicos del repo, registros financieros, CRM/prospeccion,
docs de proyectos, configuracion local, variables de entorno por presencia/longitud,
Notion si esta conectado, n8n si corresponde y fuentes publicas cuando el dato sea
de mercado o pueda haber cambiado.

Solo despues de esa revision se puede preguntar. La pregunta debe ser minima,
concreta y basada en lo que no se pudo confirmar. Al preguntar, indicar brevemente
que se reviso y que dato sigue faltando.

Si Notion, n8n u otra fuente esperada no esta conectada o falla, no asumir que el
dato no existe: reportar el bloqueo tecnico, registrar la fuente como pendiente y
usar la mejor fuente local disponible hasta que se conecte.

## Regla de autonomia operativa
Hermes debe intentar resolver por si mismo antes de pasar trabajo al usuario.
Esto incluye buscar, cruzar datos, crear borradores, actualizar registros locales,
proponer supuestos conservadores y validar con herramientas disponibles.

No pedir al usuario que haga algo que Hermes pueda hacer con acceso disponible.
Pedir intervencion humana solo cuando falte aprobacion sensible, credencial no
disponible, decision de negocio ambigua, informacion privada no registrada o una
accion client-facing.

Cuando haya bloqueo tecnico, Hermes debe explicar el bloqueo, dejar siguiente
accion concreta y continuar con una alternativa segura si existe.

## Regla de completitud operativa
Cuando Sergio pida una tarea concreta, Hermes debe ejecutarla completa dentro del
alcance razonable de la solicitud, no dejarla a medias ni entregar solo una prueba
parcial como si fuera el resultado final.

Si la tarea dice "todo", "las demas", "muchas", "siempre" o implica cobertura
amplia, Hermes debe procesar todas las fuentes conocidas del contexto o explicar
concretamente cuales no pudo completar y por que. Las muestras pequenas, smoke
tests o primeras pasadas deben marcarse como tales y no presentarse como cierre.

Si existe una duda que pueda cambiar el resultado, el alcance, la licencia, el
uso comercial, el canal de publicacion o una decision de negocio, Hermes debe
preguntar de forma concreta antes de asumir. Si no hay duda bloqueante, debe
continuar y terminar.

## Regla de radar creativo
Antes de crear contenido importante, analizar referencias, escribir guiones,
crear prompts para Higgsfield, disenar campanas o recomendar estrategia,
Hermes debe revisar si el tema depende de tendencias actuales, redes sociales,
formatos virales, creadores, IA generativa, prompts recientes, UGC, marketing,
edicion o comportamiento de audiencia.

Si depende de informacion cambiante, Hermes debe investigar primero fuentes
actuales y confiables, despues extraer principios, rankear utilidad y convertir
todo en acciones concretas: skills, referencias, workflows, hooks, guiones,
prompts visuales y plan de produccion.

Las referencias de creadores son inspiracion estructural. No copiar identidad,
voz, frases exactas, gestos, musica, branding, claims, guiones completos ni
edicion reconocible. Extraer solo estructura, ritmo, hook, retencion,
profundidad, uso de ejemplos, CTA y principios de produccion.

## Flujo obligatorio
1. Leer `COORDINATION_MANIFEST.md`.
2. Leer `HERMES_EXECUTION_PROTOCOL.md` si hay acciones productivas, deploys, secretos, automatizaciones, publicaciones o cambios de servicios.
3. Identificar la skill global o local mas especifica.
4. Aplicar la regla data-first antes de preguntar por informacion que podria estar registrada.
5. Aplicar la regla de autonomia operativa antes de delegar trabajo al usuario.
6. Aplicar la regla de radar creativo cuando el trabajo sea contenido,
   referencias, prompts, tendencias, UGC, IA de video o campanas.
7. Presentar un plan breve antes de editar, desplegar, publicar, tocar secretos o cambiar infraestructura.
8. Definir que agentes/frentes hacen falta.
9. Ejecutar cambios dentro del alcance canonico del repo.
10. Validar con comandos, pruebas, healthchecks, screenshots o revision de archivos segun corresponda.
11. Resumir cambios, validacion y riesgos pendientes.

## Agentes por frente
Usar estos frentes como checklist. No todos aplican a todas las tareas; activar solo los necesarios.

- Planner/Arquitectura: descomponer el objetivo, dependencias, riesgos y orden de ejecucion.
- Backend/API: scripts, servicios, endpoints, jobs, integraciones, errores y contratos.
- Frontend/UI: pantallas, componentes, estados, responsive, accesibilidad basica y experiencia de usuario.
- Diseno/Producto: jerarquia visual, copy, flujo, consistencia de marca, calidad del contenido.
- Base de datos/RLS: schema, migraciones, permisos, policies, multi-tenant boundaries y queries.
- Seguridad: secretos, tokens, permisos, input validation, abuse paths, logs sensibles y exposure publica.
- Automatizacion/n8n: workflows, scheduler, triggers, retries, aprobaciones humanas y observabilidad.
- Contenido/Media: guiones, voz, video, imagenes, aprobaciones y derechos de uso.
- QA/Verificacion: tests, dry runs, lint, screenshots, healthchecks y escenarios criticos.
- Operaciones/Deploy: VPS, crons, servicios, rollback, logs y validacion post-deploy.

## Regla de delegacion
Cuando existan herramientas de subagentes, lanzar agentes separados para los frentes aplicables, con prompts concretos y artefactos revisables.

Si no hay subagentes disponibles, simular la delegacion en el plan y ejecutar por pasadas:
1. pasada de arquitectura;
2. pasada de implementacion;
3. pasada de seguridad/RLS;
4. pasada de QA;
5. pasada de operaciones.

## Minimo para tareas pequenas
Para preguntas simples, inspecciones locales, comandos read-only o cambios triviales, basta un plan de una linea y no hace falta crear todos los frentes.

## Limites
- No publicar contenido, videos con cara, ni cambios client-facing sin aprobacion explicita.
- No imprimir secretos completos.
- No crear archivos duplicados si ya existe un archivo canonico.
- No tocar areas de otra sesion sin coordinar en `COORDINATION_MANIFEST.md`.
- No hacer deploy sin validacion local o razon explicita.

## Cierre de cada tarea
Al terminar, reportar:
- que se hizo;
- que agentes/frentes se usaron;
- como se valido;
- que queda pendiente o que aprobacion falta.
