# Onia Hermes Collaborator Access Model 2026

Estado: borrador canonico interno
Fecha: 2026-06-20
Uso: permitir que Arthur u otros colaboradores alimenten ONIA/Hermes sin ver
datos sensibles, finanzas, acuerdos, memoria privada, credenciales ni contexto
personal de Sergio.

## Veredicto

No conviene darle acceso completo a Arthur a `onia-hermes` como esta hoy.

Razon:

- este repositorio es memoria estrategica, personal, financiera y operativa;
- contiene decisiones internas de Onia, acuerdos, deuda, porcentajes, precios y
  planes sensibles;
- si alguien tiene acceso de lectura a un repo privado, no se puede ocultar una
  carpeta especifica solo con GitHub normal;
- `CODEOWNERS` y branch protection ayudan a revisar cambios, pero no evitan que
  un colaborador lea archivos ya accesibles;
- borrar archivos sensibles no basta si ya quedaron en el historial Git.

Decision:

```text
Arthur no debe trabajar directamente en este repo completo. Debe trabajar en un
repo o espacio colaborativo saneado, y Sergio/Hermes importan lo util a la
memoria privada despues de revisar.
```

## Objetivo

Permitir que Arthur aporte:

- leads;
- ideas;
- briefs;
- requerimientos;
- avances de clientes;
- contenido;
- tareas;
- notas operativas;
- propuestas;
- feedback de ventas;
- documentos aprobados para colaboracion.

Sin permitir acceso a:

- secretos;
- tokens;
- VPS;
- finanzas internas;
- acuerdos privados;
- porcentajes sensibles;
- estrategia familiar/Bolivian;
- memoria profunda de Hermes;
- conversaciones personales;
- datos de clientes no aprobados;
- documentos de pricing interno completo.

## Principio principal

```text
Arthur puede alimentar la operacion. No necesita ver toda la memoria.
```

Hermes privado debe seguir siendo el cerebro central. Arthur trabaja en una
entrada revisable.

## Clasificacion de informacion

| Nivel | Nombre | Puede verlo Arthur? | Ejemplos |
|---|---|---|---|
| P0 | Secreto | no | tokens, passwords, env, VPS, API keys, credenciales Meta/n8n |
| P1 | Privado estrategico | no | finanzas, deudas, acuerdos, porcentajes, planes personales, Bolivian familiar |
| P2 | Interno Onia | solo version saneada | pricing general, playbooks, procesos, SOPs |
| P3 | Colaboracion | si | leads, briefs, tareas, status, contenido, requerimientos no sensibles |
| P4 | Publico/marketing | si | copy, posts, piezas aprobadas, portfolio publico |

Regla:

```text
Si dudas si algo es P1 o P3, tratarlo como P1 hasta que Sergio lo apruebe.
```

## Arquitectura recomendada de repos

### Repo 1 - `onia-hermes-private`

Uso:

- memoria completa;
- estrategia;
- finanzas;
- acuerdos;
- sistemas internos;
- decisiones sensibles.

Acceso:

- Sergio;
- Codex/Hermes;
- nadie mas por defecto.

Arthur:

- sin acceso.

### Repo 2 - `onia-hermes-collab`

Uso:

- entrada colaborativa saneada;
- briefs;
- leads;
- tareas;
- ideas;
- docs que Arthur puede editar;
- plantillas de cliente;
- avances semanales.

Acceso:

- Arthur puede tener `Triage` o `Write` segun madurez;
- Sergio mantiene `Admin/Maintain`;
- main protegido.

### Repo 3 - repos de producto

Ejemplos:

- `web-factory`;
- `dental-saas`;
- `gestios`;
- futuros repos por producto.

Uso:

- codigo de producto;
- issues;
- PRs;
- documentacion tecnica saneada.

Arthur:

- acceso solo si realmente trabaja ahi;
- idealmente por issues/PRs y no por datos sensibles.

## Estructura del repo colaborativo

Propuesta:

```text
onia-hermes-collab/
  README.md
  CONTRIBUTING.md
  ACCESS_POLICY.md
  inbox/
    arthur/
      leads/
      briefs/
      client-notes/
      content-ideas/
      weekly-reports/
  templates/
    lead-intake.md
    client-brief.md
    website-brief.md
    automation-brief.md
    content-brief.md
    weekly-report.md
  public-playbooks/
    onia-services-summary.md
    pricing-public-safe.md
    sales-scripts-safe.md
  tasks/
    backlog.md
    approved.md
    blocked.md
```

## Flujo de trabajo recomendado

### Entrada normal

1. Arthur crea issue o archivo en `onia-hermes-collab/inbox/arthur/`.
2. Arthur no pega claves, contrasenas, datos bancarios ni costos sensibles.
3. Sergio/Hermes revisa.
4. Si sirve, se resume en version saneada.
5. Sergio/Hermes importa solo lo necesario a `onia-hermes-private`.
6. El original queda como evidencia colaborativa.

### Trabajo de codigo

1. Arthur crea rama `arthur/<tema>` en repo saneado o producto permitido.
2. Hace PR.
3. No puede mergear a `main`.
4. Sergio revisa.
5. Si toca cliente, credencial, pago, WhatsApp, Meta, VPS o produccion, no se
   aprueba sin revision de Sergio.

### Trabajo con clientes

1. Arthur registra lead en formato aprobado.
2. No promete precios no aprobados.
3. No envia propuestas sensibles sin revision.
4. No recibe credenciales de cliente.
5. No pega datos privados de clientes en docs abiertos.
6. Si el cliente envia acceso o clave, se escala a Sergio para canal seguro.

## Permisos de GitHub recomendados

### Para `onia-hermes-private`

Arthur:

- sin acceso.

### Para `onia-hermes-collab`

Fase inicial:

- `Triage`: puede manejar issues/discusiones/PRs sin escribir directo.

Si demuestra orden:

- `Write`: puede empujar ramas y abrir PRs.

Nunca al inicio:

- `Maintain`;
- `Admin`.

### Para repos de producto

Usar por necesidad:

- `Read` si solo revisa;
- `Triage` si organiza issues;
- `Write` si realmente desarrolla y abre PRs.

## Protecciones minimas

En todo repo donde Arthur tenga acceso:

- proteger `main`;
- requerir pull request antes de merge;
- requerir revision de Sergio;
- activar `CODEOWNERS` para rutas sensibles;
- activar secret scanning/push protection si esta disponible;
- prohibir force push en main;
- prohibir eliminar ramas protegidas;
- usar templates de PR;
- revisar cambios antes de publicar o entregar a clientes.

Ejemplo `CODEOWNERS`:

```text
* @sergio
/public-playbooks/ @sergio
/templates/ @sergio
/inbox/arthur/ @sergio
```

Nota:

```text
CODEOWNERS obliga revision si se configura con branch protection, pero no oculta
archivos a quien ya tiene acceso de lectura.
```

## Que puede aportar Arthur

Permitido:

- leads con fuente;
- nombre de negocio y contacto publico;
- screenshots sin datos sensibles;
- necesidades del cliente;
- ideas de contenido;
- tareas completadas;
- estado de avance;
- textos/copy;
- referencias publicas;
- brief de web;
- brief de automatizacion sin credenciales;
- reporte semanal.

No permitido:

- claves;
- tokens;
- contrasenas;
- tarjetas;
- deudas internas;
- acuerdos privados;
- porcentajes internos;
- datos familiares;
- mensajes privados de clientes sin permiso;
- capturas con cookies, sesiones o tokens visibles;
- accesos a Meta, n8n, VPS, Google, Notion o cuentas de clientes.

## Como alimentar Hermes sin ver memoria

Crear un proceso de ingestion:

```text
Arthur input -> repo collab -> revision Sergio/Hermes -> resumen saneado ->
memoria privada Hermes.
```

Arthur no escribe directo en memoria privada.

Formato de aporte:

```text
Titulo:
Fuente:
Cliente/proyecto:
Tipo: lead / brief / idea / problema / avance / bloqueo
Descripcion:
Datos publicos:
Que falta:
Accion sugerida:
Riesgo:
Puede ser compartido con cliente? si/no
Contiene datos sensibles? si/no
```

## Como unir los repos despues

No se deben unir copiando todo `onia-hermes-collab` dentro de
`onia-hermes-private`.

La union debe ocurrir por puentes controlados:

| Puente | De donde viene | A donde entra | Quien aprueba |
|---|---|---|---|
| Resumen de memoria | repo collab issues/docs | Hermes privado | Sergio |
| Tareas aprobadas | issues/backlog collab | backlog privado/producto | Sergio |
| Codigo | PR de rama Arthur | repo de producto permitido | Sergio/QA |
| Brief cliente | collab/inbox | docs privadas saneadas | Sergio/Hermes |
| Contenido | ideas/copy | Content Engine o cliente | Sergio antes de publicar |
| Requerimientos Bolivian | notas saneadas | Bolivian OS/GestiOS docs | Sergio |

Regla:

```text
Se importan aportes, no se fusionan memorias completas.
```

### Flujo de union semanal

1. Arthur deja aportes en `onia-hermes-collab`.
2. Hermes/Sergio revisa que no tenga datos P0/P1.
3. Se crea un resumen semanal:

```text
Fecha:
Autor:
Aportes utiles:
Clientes/leads:
Requerimientos:
Bloqueos:
Decisiones sugeridas:
Que entra a memoria privada:
Que queda fuera:
```

4. Solo ese resumen aprobado entra al repo privado.
5. Si hay codigo, entra por PR/cherry-pick/patch al repo de producto.
6. Si hay datos de cliente, se redactoriza antes de quedar en memoria.

### Flujo de codigo

Arthur no debe tocar `onia-hermes-private`.

Para codigo:

```text
arthur branch -> PR -> revision Sergio -> QA -> merge en repo de producto
```

Si el codigo sirve para varios clientes, entra al core o modulo reutilizable.
Si solo sirve a Bolivian, entra como configuracion/adaptador Bolivian.

### Flujo de conocimiento

Arthur puede alimentar conocimiento, pero Hermes decide que se vuelve memoria.

Ejemplo:

```text
Arthur: "Almacen pierde tiempo buscando productos sin foto."
Hermes privado: "Dolor validado: busqueda de producto y evidencia visual en
almacen. Posible modulo StockCam."
```

No se importa:

```text
Conversaciones completas, chismes, datos privados, claves, montos sensibles o
estrategia familiar.
```

## Bolivian Electric y Arthur

Arthur puede trabajar en cosas de Bolivian, pero con acceso por tarea.

Principio:

```text
Arthur ve lo necesario para producir su parte, no todo el contexto estrategico.
```

### Arthur si puede ver

- requerimientos operativos saneados;
- dolores de ventas, almacen, contenido o procesos;
- capturas de TR4 sin credenciales ni datos sensibles visibles;
- flujos actuales descritos sin nombres privados;
- ideas de contenido;
- estructura de paginas, formularios o dashboard;
- tareas asignadas;
- productos/categorias si Bolivian aprueba compartirlas;
- feedback de usuarios sin datos personales innecesarios;
- brief de modulo de inventario con datos de prueba.

### Arthur no debe ver

- estrategia familiar de Sergio con Bolivian;
- que Bolivian puede ser futuro patrimonio de Sergio;
- acuerdos internos de Onia;
- porcentajes, deudas, comisiones privadas;
- margenes reales de Onia;
- costos internos completos de Bolivian;
- sueldos;
- bancos;
- proveedores sensibles;
- credenciales TR4;
- cookies/sesiones/capturas con tokens;
- dumps completos de clientes, ventas o contabilidad;
- decisiones privadas de gerencia;
- documentos donde aparezcan conflictos familiares o de propiedad.

### Paquetes seguros para Arthur

Crear paquetes de trabajo:

```text
bolivian/arthur/
  task-001-content-calendar.md
  task-002-inventory-camera-notes.md
  task-003-sales-flow-map.md
  task-004-ui-feedback.md
  task-005-public-product-research.md
```

Cada paquete debe tener:

```text
Objetivo:
Contexto permitido:
Archivos permitidos:
Datos de prueba:
Que NO debe tocar:
Entrega esperada:
Fecha:
Revision:
```

### Datos de prueba

Si Arthur necesita trabajar en inventario, no darle al inicio el inventario real
completo. Darle una muestra:

```text
Producto A, categoria, foto de ejemplo, stock ficticio, ubicacion ficticia.
```

Si necesita disenar dashboard:

```text
ventas_demo.csv, inventario_demo.csv, gastos_demo.csv
```

Si necesita entender TR4:

```text
capturas redactorizadas + mapa de pantallas + lista de campos visibles.
```

### Cuando Arthur necesita algo sensible

Si una tarea requiere credenciales, datos reales completos, costos, ventas,
clientes, proveedores o contabilidad:

1. Arthur no recibe el dato.
2. Sergio ejecuta la accion o genera una muestra saneada.
3. Hermes registra la razon.
4. Si es imprescindible compartir, debe haber aprobacion explicita y archivo
   con alcance limitado.

## Checklist antes de compartir algo con Arthur

Antes de poner un archivo en el repo colaborativo:

- no hay claves ni tokens;
- no hay cookies/sesiones;
- no hay datos bancarios;
- no hay porcentajes internos;
- no hay deuda o finanzas privadas;
- no hay estrategia familiar;
- no hay datos personales innecesarios;
- no hay cliente sensible sin permiso;
- no hay historial Git privado;
- el archivo puede ser leido por un colaborador sin danar a Onia.

## Carpetas que no deben compartirse

Mantener privadas o mover a repo privado:

- acuerdos de colaboradores;
- finanzas;
- estrategias personales;
- Bolivian familiar;
- credenciales/infra;
- prompts con datos privados;
- logs de clientes;
- datos de pagos;
- decisiones de porcentajes;
- memoria completa.

## Si igual se decide darle acceso a este repo

No recomendado.

Si se hace, antes:

1. crear copia nueva saneada sin historial sensible;
2. no invitarlo al repo actual;
3. auditar archivos y git history;
4. eliminar secretos del historial si existieron;
5. rotar credenciales expuestas;
6. activar protecciones;
7. limitar permisos;
8. asumir que todo lo visible puede ser leido.

## Implementacion por fases

### Fase 1 - Esta semana

- no agregar Arthur a `onia-hermes`;
- crear repo colaborativo saneado;
- crear plantillas de lead, brief y reporte semanal;
- mover solo material aprobado;
- pedirle a Arthur que alimente issues/archivos ahi.

### Fase 2 - 2 semanas

- revisar calidad de aportes;
- medir si registra bien leads y tareas;
- abrir permisos `Write` solo si cumple;
- conectar ese repo a tareas de Hermes mediante resumen manual.

### Fase 3 - 30-60 dias

- decidir si Arthur puede tocar repos de producto;
- crear reglas de pago por entregables validados;
- automatizar ingestion parcial;
- mantener memoria privada separada.

## Decision final

```text
Arthur debe tener un espacio para aportar, no acceso total al cerebro privado.
Separar repos, clasificar informacion y usar un flujo de revision protege a
ONIA sin frenar colaboracion.
```

## Fuentes consultadas

- GitHub repository roles: Read, Triage, Write, Maintain y Admin.
- GitHub CODEOWNERS y branch protection para requerir revision.
- GitHub protected branches para evitar pushes directos o force push.
- GitHub secret scanning/push protection para bloquear secretos antes del push.
