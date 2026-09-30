> ⚰️ **HISTORIA desde el 2026-09-29.** El estado vigente del carril está en
> [`higgsfield-lucia.md`](higgsfield-lucia.md). Acá los IDs y los bloqueos son del 22-sep: la
> identidad anterior se retiró entera y los tres «bloqueos exactos» quedaron resueltos o reemplazados.

# Handoff — sistema Higgsfield y persistencia de Lucía

Fecha: 2026-09-22
Objetivo: que Codex y Claude puedan continuar la producción de campañas sin perder identidad,
sin releer toda la historia y sin gastar créditos por error.

## Resumen obligatorio del carril

**Objetivo**
Dejar una arquitectura y fuentes compartidas para Higgsfield/Lucía, con identidad, costo y uso de
tokens controlados. Definición de hecho de esta fase: documentación canónica, manifest, skills y
configuración local fail-closed; los gates de derechos/identidad quedan documentados pero todavía
no están cableados a un runtime. Ninguna generación ni publicación.

**Qué quedó EN PRODUCCIÓN**
Nada. No hubo deploy, login, generación, gasto ni publicación.

**Qué quedó a medias, y dónde**
Rama `main`, worktree `C:\dev\proyectos\onia-hermes`, cambios locales sin commit al momento de
escribir este handoff. El wrapper CLI y la integración n8n no se construyen hasta validar identidad.

**Archivos y cambios**
Se listan en “Fase 0” y en las fuentes canónicas de este documento.

**Intentos fallidos**
La identidad única no existe: Element, CLI, Soul y Marketing Studio no comparten un objeto
portable. El Soul v3 de 6 imágenes derivó; la hipótesis “Soul siempre falla” no queda demostrada.
La vieja hipótesis de que MCP cambiaba el modelo en silencio se corrigió: había confusión entre
nombre comercial y `job_type`.

**Qué depende de Sergio Urcullo**
Resolver procedencia/consentimiento, autenticar OAuth cuando corresponda y aprobar el cap exacto
del único entrenamiento/A-B. También aprueba toda publicación.

**Próximos pasos**
Seguir Fase 1, 2 y 3 en ese orden. No saltar al wrapper ni a producción masiva.

## Resultado de la auditoría

Lucía no tiene hoy una identidad única y portable. Hay cuatro sistemas separados:

1. Element web `lucia-skin-v1` (`58bbd635-9b90-4bd2-b08a-1cd4915bd563`).
2. Referencias/assets para CLI.
3. Souls, incluidos uno prohibido y un v3 rechazado.
4. Avatar aislado de Marketing Studio `Lucia ONIA v4 FINAL`
   (`a1e334f3-5316-4132-b454-ddd9dcc06943`).

El problema no se resuelve con un prompt más largo. Se resuelve con un canon legalmente limpio,
manifest, dos carriles de identidad y gates de costo/QA.

## Decisión de herramientas

| Herramienta | Uso | Decisión |
|---|---|---|
| CLI oficial + skills | Cotizar, generar y recuperar jobs desde Codex/Claude Code/VPS | Principal |
| Web local | Elements, Marketing Studio, entrenamiento/calibración y QA visual | Manual y necesaria |
| MCP oficial | Agentes de chat y exploración | Opcional; no backbone |
| n8n | Aprobación, cola, polling, ledger y avisos | Control plane, no renderer |
| API oficial | Workers y volumen con presupuesto USD separado | Fase posterior |
| Playwright VPS | Clicks automatizados en la web | Descartado para producción |

Razones: la CLI es auditable, devuelve JSON y tiene menor overhead de contexto; la web conserva
capacidades de identidad que la CLI no expone; Playwright depende de UI, sesión y defaults frágiles.
Los términos de Higgsfield además prohíben scraping/descarga automatizada de sus páginas; no usar
automatización de navegador como fábrica.

## Estado técnico

- CLI local oficial: `higgsfield` 1.1.24; npm publicaba 1.1.26 al auditar.
- No actualizar producción automáticamente: fijar versión, validar schemas en lectura y promover
  después de una prueba paga aprobada.
- Sesión local no operativa; requiere nuevo `higgsfield auth login`. No se intentó login ni se
  imprimieron tokens.
- En Windows `hf` resuelve a Hugging Face. Usar siempre `higgsfield`.
- Endpoint MCP oficial: `https://mcp.higgsfield.ai/mcp`.
- Skills oficiales instaladas en `.agents/skills/higgsfield-*` y
  `.claude/skills/higgsfield-*`. Se cargan en una nueva sesión/turno del agente.
- `video-factory` es un esqueleto, no una fábrica funcional: runtime ausente y tarifas históricas
  hardcodeadas. Sus lanes ONIA/Sergio quedaron cerradas por defecto y el adapter exige datos de
  aprobación/costo, pero `identity_ok` todavía es autocontenido: no lee el manifest ni valida
  derechos/hashes. El binding de quote evita mezclar inputs, pero el aprobador aún no está ligado
  a una sesión autenticada. No debe usarse para autorizar gasto.

## Identidad de Lucía

Fuente machine-readable:
`hermes-content/references/modelos/lucia/LUCIA-HIGGSFIELD-IDENTITY.json`.

### Carril 1 — Element-lock

- Navegador local + `@lucia-skin-v1` para hero, primer plano y calibración.
- Es el baseline operativo, no un ganador demostrado.
- Sigue pendiente A/B idéntico contra `lucia-surgical-anchor` (`902eeebb…`).

### Carril 2 — Soul-lock

- Será el carril de escala CLI únicamente si un Soul nuevo gana el A/B.
- El v3 existente usó 6 imágenes y derivó. La CLI acepta 5–20; la guía web actual recomienda
  20–80 fotos variadas. No confundir compatibilidad mínima con dataset suficiente.
- El entrenamiento CLI no ofrece `cost` ni dry-run. Confirmar precio por una superficie oficial o
  aprobar un cap explícito antes de crear el Soul.

### Gate legal

El repo reconoce referencias derivadas de una persona real sin consentimiento documentado. Antes
de nuevo entrenamiento o campaña pública hay que elegir una de estas salidas:

1. documentar consentimiento y alcance de uso; o
2. reconstruir Lucía desde un canon completamente sintético con procedencia registrada.

No declarar “100% sintética” solo porque una imagen intermedia fue generada; importa el linaje.
Además, confirmar que la licencia del modelo fuente permite usar sus outputs para entrenar Soul
ID. Registrar por referencia `source_model`, `source_asset`, `license_or_permission` y
`training_rights_status`. Un origen sintético no concede automáticamente derecho de entrenamiento.

## Inventario canónico real

La carpeta `canon/` tiene 5 archivos, aunque documentos anteriores hablaban de 7. El manifest ya
guarda sus SHA256. Faltan identificar las otras dos referencias, sus ángulos y procedencia. No se
completa el dataset inventando archivos.

## Flujo de gasto y recuperación

```text
brief compacto
-> schema vivo (`model list/get`)
-> referencias y derechos válidos
-> `generate cost` o cap explícito
-> quote ligado a input/modelo/parámetros/referencias/cantidad
-> aprobación de Sergio Urcullo ligada al hash de la quote
-> un solo create
-> guardar job id
-> polling/reconciliación
-> descarga + SHA256
-> QA de identidad/comercial
-> preview
-> aprobación separada para publicar
```

Retry:

- red, 429 o 5xx: backoff acotado;
- auth, validación, modelo/referencia inválida, pago o límite diario: cero retries;
- timeout de polling: mantener el mismo job;
- respuesta ambigua de `create`: consultar `generate list` por ventana + manifest antes de repetir.

Ledger JSONL mínimo: `job_id`, `input_hash`, versión CLI, workspace, modelo técnico, schema,
referencias/hashes, cotización/cap, aprobación, timestamps, costo real, artefactos y QA.

## Ahorro de tokens sin bajar calidad

Política: `hermes-content/docs/AI_MODEL_ROUTING_2026.md`.

- Astra medium: arquitectura, identidad/derechos, estrategia comercial y veredicto final.
- Sol medium: implementación cotidiana, investigación acotada, briefs y revisión integral.
- Luna low: inventarios, hashes, JSON, polling y QA mecánico.
- Los agentes consumen el manifest y el brief; no vuelven a cargar 50 KB de historia en cada job.
- Una generación candidata antes de variantes. Una revisión fuerte al final.

## Orden de desarrollo

### Fase 0 — completada sin gasto

- Política de superficies consolidada.
- Skills oficiales instaladas para Codex y Claude.
- Manifest inicial con IDs, hashes, derechos y gates.
- Índice de deprecaciones.
- Lanes inseguras configuradas fail-closed y guard financiero reforzado; el gate de
  derechos/identidad aún no es ejecutable.
- Enrutamiento de modelos documentado.

### Fase 1 — requiere decisión humana, no créditos todavía

1. Resolver procedencia/consentimiento y derechos de entrenamiento de cada fuente; o elegir una
   reconstrucción sintética cuya licencia permita expresamente ese entrenamiento.
2. Elegir 20–30 referencias candidatas; deduplicar y etiquetar ángulo/expresión/cuerpo.
3. Reducir a un set CLI de hasta 20 si ese será el carril de entrenamiento.
4. Definir test fijo: mismos prompts, encuadres, ratio, luz y rúbrica 11/11.

### Fase 2 — requiere autenticación y aprobación de gasto

1. Autenticar CLI local por OAuth sin copiar tokens.
2. Leer schema/modelos y fijar versión validada.
3. Obtener costo/cap de entrenamiento Soul.
4. Entrenar un único candidato v4.
5. Ejecutar A/B mínimo contra ambos Elements; no producir campaña aún.

### Fase 3 — solo si v4 gana

1. Construir wrapper CLI `doctor/quote/submit/poll/reconcile/download/qa`.
2. Crear ledger append-only e idempotencia por input hash.
3. Conectar n8n a aprobaciones/estado, nunca a clicks web.
4. Producir primero un UGC de validación; carrusel y estático usan el still aprobado.
5. Escalar por lotes pequeños solo después de medir costo, deriva y rendimiento publicitario.

## Trabajo que no hay que hacer

- No conectar “todos los MCPs”: aumenta permisos, contexto y puntos de falla sin mejorar el render.
- No automatizar la web de Higgsfield desde el VPS.
- No construir una factory completa antes del A/B de identidad.
- No entrenar varios Souls “para probar”.
- No generar video text-to-video de Lucía; animar un still aprobado.
- No usar costos, modelos o balances copiados de documentos históricos.
- No publicar ni lanzar Meta Ads sin aprobación explícita.

## Fuentes actuales

- CLI: https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-access-higgsfield-via-cli
- Soul ID: https://higgsfield.ai/creator-hub/help-center/ai-models/how-do-i-create-and-use-a-soul-id-character
- API: https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api
- CLI GitHub: https://github.com/higgsfield-ai/cli
- Skills GitHub: https://github.com/higgsfield-ai/skills
- Terms: https://higgsfield.ai/terms-of-use-agreement

## Bloqueos exactos

1. Derechos/procedencia de las referencias de Lucía.
2. Autenticación OAuth local/VPS.
3. Aprobación de un cap para el entrenamiento Soul v4 y el A/B.

Hasta resolverlos, el sistema puede preparar briefs, manifests, tests y prompts, pero no entrena,
genera, publica ni gasta.
