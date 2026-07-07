# AI YouTube SOPs and Operator Handoff 2026

Fecha: 2026-06-05

Objetivo: dejar instrucciones para que un operador futuro pueda manejar la produccion diaria de los canales sin que Sergio haga trabajo operativo.

## 1. Roles

### Sergio

Rol: dueno/supervisor.

Responsabilidades:

- Aprobar decisiones sensibles.
- Definir presupuesto maximo.
- Aprobar publicacion.
- Revisar excepciones.
- Decidir sponsors, afiliados y productos.

No debe hacer:

- investigar temas diariamente;
- escribir guiones;
- editar videos;
- subir metadata;
- revisar cada microtarea;
- operar herramientas.

### Operador futuro

Rol: supervisor operativo.

Responsabilidades:

- Revisar paquetes generados por IA.
- Ejecutar checks de calidad.
- Elevar aprobaciones sensibles.
- Mantener tablero.
- Coordinar herramientas.
- Verificar analytics.

### Agentes IA

Rol: fuerza de produccion.

Responsabilidades:

- tendencias;
- competencia;
- ideas;
- guion;
- fact-check;
- prompts visuales;
- video;
- thumbnails;
- SEO;
- analytics;
- optimizacion.

## 2. Estados del contenido

Usar estos estados:

- `queued`
- `ready_for_script_package`
- `researching`
- `script_draft`
- `fact_check_needs_revision`
- `ready_for_human_review`
- `approved_for_generation`
- `approved_for_private_upload`
- `published`
- `blocked`
- `archived`

Regla: un item no puede saltar de `script_draft` a `published`.

## 3. SOP investigacion

Objetivo: encontrar temas de alto CPM/RPM con demanda real y buen fit CRM/SaaS.

Inputs:

- cola de contenido;
- YouTube search;
- fuentes oficiales;
- docs de herramientas;
- tendencias B2B/AI;
- analytics propios.

Proceso:

1. Seleccionar canal e idioma.
2. Buscar temas dentro de CRM, SaaS, ventas, reporting, support ops o automatizacion.
3. Validar que el tema tenga problema de negocio claro.
4. Revisar 5-10 videos competidores.
5. Extraer estructura, no copiar contenido.
6. Listar fuentes necesarias.
7. Asignar riesgo: bajo, medio o alto.
8. Crear brief.

Output:

- brief de investigacion;
- fuentes;
- competidores;
- keywords;
- riesgos;
- recomendacion de formato.

Criterio de rechazo:

- tema demasiado generico;
- sin caso de negocio;
- no monetizable;
- depende de claims no verificables;
- parece contenido infantil o entretenimiento.

## 4. SOP ideacion

Objetivo: convertir investigacion en angulos producibles.

Proceso:

1. Generar 5 angulos.
2. Puntuar por CPM/RPM, automatizacion, afiliados, sponsor fit y riesgo.
3. Elegir 1 angulo principal.
4. Crear 3 titulos A/B.
5. Crear idea de thumbnail.
6. Definir CTA.

Output:

- angulo recomendado;
- titulos;
- thumbnail brief;
- CTA;
- razon estrategica.

## 5. SOP guion

Objetivo: crear guion con demo y valor original.

Estructura long-form:

1. Cold open.
2. Problema.
3. Promesa segura.
4. Arquitectura.
5. Demo.
6. Seguridad.
7. Medicion.
8. CTA.

Reglas:

- No inventar metricas.
- No usar clientes reales.
- No prometer ingresos.
- No usar advice legal/financiero/fiscal.
- Incluir timestamps.
- Incluir visual por bloque.
- Incluir fuentes.

Output:

- hook;
- guion;
- storyboard;
- CTA;
- lista de assets.

## 6. SOP fact-check

Objetivo: bloquear errores antes de producir.

Checklist:

- claims respaldados;
- precios actuales si se mencionan;
- links verificados;
- no hay datos privados;
- no hay logos/claims de marca sin permiso;
- disclosure IA si aplica;
- disclosure afiliado si aplica;
- thumbnail no exagera.

Output JSON:

```json
{
  "approval_status": "approved",
  "risk_level": "low",
  "required_edits": [],
  "sources_needed": [],
  "disclosure_required": true
}
```

Si no pasa:

- estado `fact_check_needs_revision`;
- corregir guion;
- repetir revision.

## 7. SOP produccion visual

Objetivo: crear visuales faceless seguros.

Permitido:

- mockups propios;
- capturas propias;
- dashboards genericos;
- diagramas;
- b-roll IA abstracto;
- animaciones de tarjetas/datos;
- UI ficticia.

No permitido:

- logos reales sin permiso;
- datos reales;
- rostros reales no autorizados;
- voces clonadas sin consentimiento;
- musica protegida;
- personajes infantiles protegidos;
- escenas que simulen resultados falsos.

Output:

- prompts por escena;
- negative prompt;
- thumbnail brief;
- asset list;
- costo estimado.

## 8. SOP voz/audio

Objetivo: generar narracion consistente.

Workflow:

1. Definir idioma.
2. Elegir voz aprobada.
3. Generar muestra corta.
4. Revisar claridad y ritmo.
5. Generar voiceover final solo con presupuesto aprobado.

Reglas:

- No clonar voz sin consentimiento.
- No publicar voz IA sin revision.
- No usar tonos de celebridad.
- Mantener ritmo educativo.

## 9. SOP edicion

Objetivo: video claro, no solo bonito.

Checklist:

- hook visible en primeros 5 segundos;
- visual cambia cada 5-8 segundos en long-form;
- captions legibles;
- diagramas simples;
- audio limpio;
- CTA final;
- no hay texto que tape visuales importantes;
- no hay logos no autorizados.

## 10. SOP SEO YouTube

Output requerido:

- titulo final;
- titulo alternativo;
- descripcion;
- tags;
- chapters;
- pinned comment;
- disclosure IA;
- disclosure afiliados;
- shorts derivados;
- thumbnail text.

Reglas:

- El titulo debe incluir problema o sistema.
- Evitar clickbait falso.
- No usar "guaranteed", "secret income", "legal loophole" o equivalentes.
- En espanol evitar "gana dinero seguro", "sin esfuerzo", "garantizado".

## 11. SOP publicacion

Estado normal:

- no publicar automaticamente.

Para subir privado/no listado:

1. Paquete en `ready_for_human_review`.
2. Fact-check aprobado.
3. Sergio envia aprobacion exacta.
4. Uploader sube privado/no listado.
5. Operador revisa video completo.
6. Solo despues se puede pedir aprobacion publica.

Aprobacion valida:

```text
Apruebo subida privada YouTube: <content_id>
Apruebo publicar YouTube: <content_id>
```

## 12. SOP monetizacion

Afiliados:

1. Revisar programa.
2. Verificar terminos.
3. Crear disclosure.
4. Usar solo en videos relevantes.
5. Medir clicks y conversiones.

Sponsors:

1. No contactar sin aprobacion.
2. Crear media kit cuando haya traccion.
3. Mantener registro CRM.
4. Revisar claims del sponsor.
5. Diferenciar anuncio de contenido editorial.

Productos:

1. Crear template util por video largo.
2. Validar demanda con descargas.
3. Vender pack solo despues de 3-5 recursos probados.

## 13. SOP analytics

Cada semana:

- revisar CTR;
- retencion;
- comentarios;
- busqueda vs browse;
- descargas;
- emails;
- clicks afiliados;
- RPM si hay monetizacion;
- costo de produccion.

Decision:

- si CTR bajo, cambiar thumbnail/titulo;
- si retencion baja en primeros 30s, reescribir hook;
- si descargas altas, crear producto;
- si comments piden herramienta, crear tutorial;
- si afiliado convierte, ampliar serie.

## 14. Runbook diario

1. Revisar cola.
2. Tomar item prioritario.
3. Ejecutar investigacion.
4. Generar paquete.
5. Fact-check.
6. Dejar `ready_for_human_review`.
7. Enviar resumen a Sergio si hay aprobacion sensible.

## 15. Runbook semanal

1. Revisar analytics.
2. Elegir 2 videos largos.
3. Elegir 6 Shorts.
4. Actualizar newsletter.
5. Revisar afiliados.
6. Revisar costos.
7. Actualizar backlog.

## 16. Escalamiento

Escalar a Sergio si:

- hay costo;
- hay publicacion;
- hay sponsor;
- hay afiliado nuevo;
- hay claim sensible;
- hay dato privado;
- hay riesgo legal;
- hay cambio de marca;
- hay bloqueo de credencial.

No escalar si:

- solo falta investigar;
- solo falta corregir guion;
- solo falta crear prompts;
- solo falta preparar metadata;
- solo falta crear reporte.

