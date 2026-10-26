# Onia Hermes Collaborator Setup Runbook 2026

Estado: borrador operativo interno
Fecha: 2026-06-21
Uso: paso a paso para crear un espacio colaborativo para Arthur, permitir que
aporte a ONIA/Bolivian y luego ingresar lo aprobado al sistema interno de Onia
sin exponer memoria privada.

## Veredicto

No se debe invitar a Arthur a `onia-hermes`.

Se debe crear un repo colaborativo separado:

```text
onia-hermes-collab
```

Ese repo funciona como bandeja de entrada saneada. El sistema interno de Onia
solo absorbe resumenes, tareas, briefs y codigo revisado.

## Resultado esperado

Al terminar este setup:

- Arthur tiene un lugar claro para trabajar.
- Arthur no ve finanzas, acuerdos, memoria privada ni estrategia familiar.
- Sergio revisa todo antes de ingresarlo a Hermes/ONIA.
- Las tareas de Bolivian se entregan por paquetes seguros.
- El sistema interno de Onia recibe solo informacion aprobada y saneada.

## Fase 0 - Reglas antes de crear nada

Decision:

```text
onia-hermes = privado
onia-hermes-collab = colaborativo saneado
repos de producto = codigo operativo por producto
```

No compartir con Arthur:

- `FINANCE_LOG_2026.md`;
- acuerdos internos;
- docs de Bolivian familiar;
- credenciales;
- costos privados;
- porcentajes;
- margen real;
- datos completos de clientes;
- dumps de TR4;
- capturas con sesiones, cookies o tokens.

Compartir con Arthur:

- briefs saneados;
- tareas;
- leads con fuente publica;
- ideas;
- contenido;
- requerimientos operativos;
- datos de prueba;
- capturas redactorizadas.

## Fase 1 - Crear el repo colaborativo

### Opcion A - GitHub web

1. Ir a GitHub.
2. Crear nuevo repo privado:

```text
onia-hermes-collab
```

3. Marcarlo como `Private`.
4. No inicializarlo con datos copiados de `onia-hermes`.
5. Crear `README.md`.
6. No invitar a Arthur todavia.

### Opcion B - GitHub CLI

Desde una carpeta de proyectos:

```powershell
cd C:\dev\proyectos
gh repo create onia-hermes-collab --private --clone
cd onia-hermes-collab
```

Si el repo pertenece a una organizacion:

```powershell
gh repo create oninteligenciaartificial/onia-hermes-collab --private --clone
```

No ejecutar esto hasta confirmar que `gh auth status` esta autenticado con la
cuenta correcta.

## Fase 2 - Crear estructura base

Dentro del repo `onia-hermes-collab` crear:

```text
README.md
CONTRIBUTING.md
ACCESS_POLICY.md
.github/
  CODEOWNERS
  pull_request_template.md
inbox/
  arthur/
    leads/
    briefs/
    client-notes/
    content-ideas/
    weekly-reports/
bolivian/
  arthur/
    tasks/
    data-demo/
    screenshots-redacted/
templates/
  lead-intake.md
  client-brief.md
  website-brief.md
  automation-brief.md
  content-brief.md
  weekly-report.md
  bolivian-task.md
  ingestion-summary.md
public-playbooks/
  onia-services-summary.md
  pricing-public-safe.md
  sales-scripts-safe.md
tasks/
  backlog.md
  approved.md
  blocked.md
```

Comandos sugeridos en PowerShell:

```powershell
New-Item -ItemType Directory -Force .github
New-Item -ItemType Directory -Force inbox\arthur\leads
New-Item -ItemType Directory -Force inbox\arthur\briefs
New-Item -ItemType Directory -Force inbox\arthur\client-notes
New-Item -ItemType Directory -Force inbox\arthur\content-ideas
New-Item -ItemType Directory -Force inbox\arthur\weekly-reports
New-Item -ItemType Directory -Force bolivian\arthur\tasks
New-Item -ItemType Directory -Force bolivian\arthur\data-demo
New-Item -ItemType Directory -Force bolivian\arthur\screenshots-redacted
New-Item -ItemType Directory -Force templates
New-Item -ItemType Directory -Force public-playbooks
New-Item -ItemType Directory -Force tasks
```

## Fase 3 - Archivos base

### README.md

Contenido:

```text
# ONIA Hermes Collab

Repositorio colaborativo saneado para aportes de ONIA.

Este repo no contiene memoria privada, credenciales, finanzas internas,
acuerdos privados ni estrategia personal de Sergio.

Todo aporte debe pasar por revision antes de entrar al sistema interno de ONIA.
```

### ACCESS_POLICY.md

Contenido:

```text
# Access Policy

Permitido:
- leads con fuente publica;
- briefs sin credenciales;
- ideas de contenido;
- reportes semanales;
- tareas asignadas;
- capturas redactorizadas;
- datos de prueba.

Prohibido:
- tokens;
- passwords;
- cookies;
- datos bancarios;
- deudas;
- porcentajes internos;
- acuerdos privados;
- estrategia familiar;
- dumps completos de clientes;
- credenciales de clientes;
- capturas con sesiones abiertas.

Si dudas, no lo subas. Pregunta a Sergio.
```

### .github/CODEOWNERS

Contenido:

```text
* @TU_USUARIO_GITHUB
/public-playbooks/ @TU_USUARIO_GITHUB
/templates/ @TU_USUARIO_GITHUB
/bolivian/ @TU_USUARIO_GITHUB
/inbox/arthur/ @TU_USUARIO_GITHUB
```

Cambiar `@TU_USUARIO_GITHUB` por el usuario real de Sergio/ONIA.

### .github/pull_request_template.md

Contenido:

```text
## Que cambia

## Por que

## Tipo
- [ ] Lead
- [ ] Brief
- [ ] Contenido
- [ ] Tarea Bolivian
- [ ] Codigo
- [ ] Documento

## Seguridad
- [ ] No contiene secretos
- [ ] No contiene datos bancarios
- [ ] No contiene credenciales
- [ ] No contiene estrategia privada
- [ ] No contiene datos sensibles de cliente

## Revision requerida
- [ ] Sergio debe revisar antes de usar
```

## Fase 4 - Plantillas

### templates/lead-intake.md

```text
# Lead Intake

Empresa:
Rubro:
Ciudad:
Fuente publica:
Contacto publico:
Dolor probable:
Oferta ONIA sugerida:
Accion sugerida:
Responsable:
Fecha:
Contiene datos sensibles? no
```

### templates/client-brief.md

```text
# Client Brief

Cliente:
Rubro:
Objetivo:
Problema:
Contexto permitido:
Material recibido:
Que falta:
Riesgos:
No incluir:
Siguiente accion:
```

### templates/weekly-report.md

```text
# Weekly Report

Semana:
Autor:

## Aportes

## Leads

## Tareas terminadas

## Bloqueos

## Requerimientos para Sergio

## Que deberia entrar a Hermes privado

## Que queda fuera
```

### templates/bolivian-task.md

```text
# Bolivian Task

Objetivo:
Contexto permitido:
Archivos permitidos:
Datos de prueba:
Que NO debe tocar:
Entrega esperada:
Fecha:
Revision:

## Seguridad
- No usar TR4 real sin permiso.
- No pedir credenciales.
- No usar datos reales completos.
- No mencionar estrategia familiar.
```

### templates/ingestion-summary.md

```text
# Ingestion Summary

Fecha:
Revisado por:
Fuente:
Autor:

## Aportes utiles

## Informacion aprobada para Hermes privado

## Tareas aprobadas

## Codigo o documentos a mover

## Datos removidos/redactorizados

## Riesgos

## Siguiente accion
```

## Fase 5 - Configurar protecciones en GitHub

En GitHub:

1. Settings.
2. Branches.
3. Add branch protection rule.
4. Branch name pattern:

```text
main
```

Activar:

- Require a pull request before merging.
- Require approvals: 1.
- Require review from Code Owners.
- Dismiss stale pull request approvals when new commits are pushed.
- Require conversation resolution before merging.
- Do not allow force pushes.
- Do not allow deletions.

Si la cuenta lo permite:

- activar Secret scanning;
- activar Push protection.

Nota:

```text
Push protection puede depender del tipo de cuenta/plan en repos privados. Si no
aparece, usar revision manual y escaneos locales antes de merge.
```

## Fase 6 - Invitar a Arthur

Primero usar permiso bajo:

```text
Triage
```

Si GitHub no permite `Triage` para el caso o Arthur necesita subir ramas, usar:

```text
Write
```

Pero con `main` protegido y PR obligatorio.

No dar:

- Maintain;
- Admin;
- acceso a `onia-hermes`;
- acceso a credenciales;
- acceso a settings del repo.

## Fase 7 - Primeras tareas para Arthur

Asignar tareas cerradas:

### Tarea 1 - Reporte semanal

Archivo:

```text
inbox/arthur/weekly-reports/2026-06-21-reporte-inicial.md
```

Objetivo:

- que practique el formato;
- que registre avances sin datos sensibles.

### Tarea 2 - Bolivian contenido

Archivo:

```text
bolivian/arthur/tasks/task-001-content-calendar.md
```

Alcance:

- ideas de contenido;
- preguntas de clientes;
- productos destacados con datos publicos;
- no usar costos, proveedores ni estrategia familiar.

### Tarea 3 - Bolivian inventario camara

Archivo:

```text
bolivian/arthur/tasks/task-002-inventory-camera-flow.md
```

Alcance:

- proponer flujo de uso desde celular;
- usar productos ficticios;
- no tocar TR4 real;
- no pedir credenciales.

### Tarea 4 - Leads Onia

Archivo:

```text
inbox/arthur/leads/2026-06-21-leads-iniciales.md
```

Alcance:

- 5 leads con fuente publica;
- dolor probable;
- oferta Onia sugerida;
- siguiente accion.

## Fase 8 - Ingestion al sistema interno de Onia

Cada semana:

1. Sergio/Hermes revisa aportes.
2. Se copia la plantilla `templates/ingestion-summary.md`.
3. Se llena el resumen.
4. Se eliminan datos sensibles.
5. El resumen aprobado se guarda en `onia-hermes-private`.

Ruta sugerida dentro de `onia-hermes`:

```text
hermes-content/docs/collab-ingestion/
```

Archivo sugerido:

```text
hermes-content/docs/collab-ingestion/2026-06-21-arthur-ingestion-summary.md
```

El resumen debe decir:

```text
Que entra:
Que no entra:
Por que:
Tareas generadas:
Riesgos:
Siguiente accion:
```

## Fase 9 - Meterlo al sistema interno de Onia

Hay tres entradas internas:

### 1. Memoria estrategica

Solo entra:

- aprendizaje validado;
- decisiones;
- patrones reutilizables;
- riesgos;
- proximas acciones.

No entra:

- conversaciones completas;
- datos privados;
- archivos crudos.

### 2. Backlog operativo

Entrar en:

- GestiOS;
- Onia Panel de Vendedores;
- issues del repo de producto;
- tareas internas.

Formato:

```text
Titulo:
Proyecto:
Modulo:
Prioridad:
Responsable:
Fuente:
Fecha:
Estado:
```

### 3. Producto/codigo

Si Arthur hizo codigo:

- PR en repo de producto;
- review de Sergio;
- pruebas;
- merge;
- resumen en `onia-hermes`.

Nunca:

- copiar codigo directo sin review;
- mezclar codigo de Arthur con memoria privada;
- mergear si contiene secretos o datos reales.

## Fase 10 - Ritmo semanal

### Lunes

- revisar aportes de Arthur;
- seleccionar que entra al sistema interno;
- convertir aportes en tareas.

### Martes

- tareas Bolivian/TR4 redactorizadas;
- entrevistas o levantamiento si aplica.

### Miercoles

- convertir notas en requisitos;
- separar core, modulo, adaptador y servicio.

### Jueves

- PRs, prototipos o docs;
- revision de seguridad.

### Viernes

- ingestion summary;
- decidir pagos/comisiones si aplica;
- enviar feedback a Arthur.

## Fase 11 - Mensaje para Arthur

```text
Arthur, vamos a separar el trabajo para que puedas aportar bien sin mezclar
informacion privada de ONIA.

Vas a trabajar en un repo colaborativo llamado onia-hermes-collab. Ahi puedes
subir leads, briefs, ideas, tareas, contenido, avances y reportes. No se suben
claves, costos internos, acuerdos, porcentajes, datos bancarios ni informacion
privada de clientes.

Cada semana Sergio/Hermes revisa lo que aportes y lo que sirva se integra al
sistema interno de ONIA como resumen o tarea aprobada.

Para Bolivian, vas a trabajar por paquetes concretos con contexto permitido y
datos de prueba. No necesitas ver TR4 real, credenciales ni datos sensibles para
apoyar en contenido, flujos, inventario con camara o UI.
```

## Checklist final antes de invitarlo

- repo privado creado;
- estructura base creada;
- ACCESS_POLICY.md listo;
- CODEOWNERS listo;
- PR template listo;
- branch protection activa;
- main protegido;
- no hay archivos sensibles;
- Arthur entra con Triage o Write limitado;
- primera tarea asignada;
- ritmo semanal definido.

## Fuentes externas usadas

- GitHub Docs: repository roles.
- GitHub Docs: CODEOWNERS.
- GitHub Docs: protected branches.
- GitHub Docs: secret scanning y push protection.
- GitHub CLI: `gh repo create`.
