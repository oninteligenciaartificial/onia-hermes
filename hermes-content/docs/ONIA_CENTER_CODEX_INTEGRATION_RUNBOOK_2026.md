# Onia Center Codex Integration Runbook 2026

Fecha: 2026-06-26.

## Decision

Onia Center debe ser el lugar donde se registra, prioriza y aprueba el trabajo.
Codex debe ejecutar tareas tecnicas solo cuando el contexto este claro y Sergio
apruebe el alcance.

No conviene que Onia Center ejecute Codex con acceso total desde el primer dia.
La mejor ruta es progresiva:

1. Generar prompts de Codex desde tareas Onia Center.
2. Crear issues o tareas tecnicas revisables en GitHub.
3. Usar Codex GitHub Action para checks/reviews controlados.
4. Usar Codex SDK o `codex exec` para jobs internos aprobados.
5. Integrar Codex App Server solo cuando Onia necesite una experiencia profunda
   dentro del panel y tenga seguridad/operacion madura.

## Opciones investigadas

### 1. Prompt Builder dentro de Onia Center

Estado recomendado: implementar primero.

Onia Center genera un prompt estructurado con:

- repo objetivo;
- modulo;
- tarea;
- contexto permitido;
- archivos sugeridos;
- criterios de aceptacion;
- comandos de validacion;
- reglas de seguridad;
- evidencia que debe volver a Onia Center.

Ventajas:

- costo tecnico bajo;
- evita que Codex toque proyectos equivocados;
- mantiene aprobacion humana;
- sirve hoy con Codex Desktop/App manual.

Riesgo:

- Sergio todavia debe copiar/pegar o abrir Codex manualmente.

### 2. GitHub Issues / GitHub Projects como puente

Estado recomendado: fase 2.

Onia Center crea issues con labels:

- `onia-center`;
- `codex-ready`;
- `needs-review`;
- repo/proyecto;
- prioridad;
- sensibilidad.

Codex puede trabajar desde una issue o PR, y Onia Center puede leer estado,
comentarios, ramas y evidencias.

Ventajas:

- auditable;
- no necesita exponer Codex directo a Onia Center;
- buen puente para Arthur y colaboradores;
- separa privado de colaborativo.

Riesgo:

- hay que filtrar datos sensibles antes de crear issue publica/colaborativa.

### 3. Codex GitHub Action

Estado recomendado: fase 3 para reviews y checks.

Usar `openai/codex-action@v1` para:

- revisar PRs;
- correr una checklist de calidad;
- generar resumen de cambios;
- detectar riesgos antes de merge;
- ejecutar tareas repetibles con prompt file.

Ventajas:

- corre aislado en CI;
- queda evidencia en PR;
- permisos y sandbox configurables;
- no depende del panel local.

Riesgo:

- requiere GitHub Secret `OPENAI_API_KEY`;
- no debe permitir prompts no sanitizados desde usuarios no confiables;
- no debe correr con permisos amplios por defecto.

### 4. `codex exec` desde un worker controlado

Estado recomendado: fase 4, solo para trabajos aprobados.

Onia Center envia un job a un worker interno. El worker ejecuta:

```text
codex exec --sandbox workspace-write "<prompt aprobado>"
```

Usos:

- generar reportes tecnicos;
- preparar refactors menores;
- revisar deuda tecnica;
- actualizar docs;
- crear propuestas de cambio sin tocar produccion.

Ventajas:

- automatizable con n8n/queue;
- salida capturable para Onia Center;
- permisos mas simples que App Server.

Riesgo:

- si se usa mal puede tocar archivos reales;
- necesita colas, logs, limites y rollback;
- no debe aceptar tareas directas de vendedores/freelancers.

### 5. Codex SDK

Estado recomendado: fase 4/5 si Onia necesita control programatico.

Permite iniciar/resumir threads de Codex desde Node/Python y manejar resultados.

Ventajas:

- mas limpio que ejecutar comandos shell;
- util para un `Codex Worker` propio;
- permite retomar threads por tarea.

Riesgo:

- requiere mas desarrollo;
- hay que disenar permisos, auditoria, estados y reintentos.

### 6. Codex App Server

Estado recomendado: no usar todavia.

Es la integracion profunda para construir una experiencia tipo cliente Codex
dentro de otro producto: threads, turns, aprobaciones y eventos en streaming.

Ventajas:

- experiencia mas integrada;
- control de conversaciones y eventos;
- podria mostrar progreso dentro de Onia Center.

Riesgo:

- mayor complejidad;
- WebSocket experimental para algunos transportes;
- no debe exponerse remoto sin autenticacion fuerte;
- para Onia hoy es sobreingenieria.

## Recomendacion Onia

### Ahora

Crear en Onia Center:

- boton `Preparar para Codex`;
- prompt tecnico copiables;
- campo `repo objetivo`;
- campo `riesgo`;
- checklist de validacion;
- campo `evidencia de cierre`;
- estado `codex_ready`.

### Despues

Conectar GitHub:

- crear issue desde Onia Center;
- importar estado de issue/PR;
- guardar links a commits, PRs y checks;
- separar issues privadas de issues colaborativas.

### Luego

Activar GitHub Action:

- PR review con Codex;
- checks de docs/seguridad;
- resumen de cambios;
- sin auto-merge.

### Futuro

Codex worker:

- jobs aprobados por Sergio;
- sandbox `workspace-write`;
- repos permitidos por lista blanca;
- presupuesto y rate limit;
- logs y evidencia en Onia Center;
- nunca contacto con clientes.

## Reglas de seguridad

- Vendedor y freelancer no pueden ejecutar Codex.
- Arthur puede proponer tareas para Codex, pero Sergio aprueba ejecucion.
- Codex no recibe capital privado, deuda exacta, credenciales ni estrategia
  familiar.
- Codex no publica, no deploya y no contacta clientes sin aprobacion explicita.
- Todo job debe tener repo, objetivo, alcance, archivos esperados y criterio de
  validacion.
- Todo resultado vuelve a Onia Center con link a commit, PR, diff o resumen.

## Fuentes oficiales

- Codex App Server: https://developers.openai.com/codex/app-server
- Codex GitHub Action: https://developers.openai.com/codex/github-action
- Codex SDK: https://developers.openai.com/codex/sdk
- Codex non-interactive mode: https://developers.openai.com/codex/noninteractive
