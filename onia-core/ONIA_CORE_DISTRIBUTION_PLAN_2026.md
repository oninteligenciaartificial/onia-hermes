# ONIA Core Distribution Plan 2026

Estado: alpha, hold until beta.
Owner: ONIA / Hermes.

## Decision

ONIA Core se construye primero en `onia-hermes/onia-core`.

No se sube todavia a GestiOS, DentalGest ni Ganadero OS como codigo activo.
Cuando el contrato este completo, se distribuye de forma controlada a los tres
sistemas.

## Por que

Si ONIA Core nace primero dentro de GestiOS, GestiOS queda como dueno falso del
nucleo. Eso aumenta el riesgo de duplicar, copiar mal o meter supuestos de
comercio general dentro de DentalGest o Ganadero OS.

La arquitectura correcta es:

```text
ONIA Core canonico
  -> GestiOS adopta organizacion empresarial
  -> DentalGest adopta patrones comunes sin perder dominio clinico
  -> Ganadero OS adopta patrones comunes con offline-first
```

## Estado por proyecto

| Proyecto | Estado | Regla |
|---|---|---|
| GestiOS | mapped, not installed | No continuar desarrollando ONIA Core local hasta instalar paquete canonico |
| DentalGest | mapped, not installed | No mezclar clinica con GestiOS; adaptar solo tenant, roles, evidencia y reportes |
| Ganadero OS | mapped, not installed | Mantener offline-first y dominio rural separado |

Los mapas viven en:

- `onia-core/adapters/gestios.json`.
- `onia-core/adapters/dentagest.json`.
- `onia-core/adapters/ganadero-os.json`.

## Orden antes de distribuir

1. Completar `contract.json`.
2. Validar contrato con `npm run validate:onia-core`.
3. Definir entidades base: `Area`, `Contact`, `WorkItem`, `ProcessChecklist`,
   `Evidence`, `ActivityEvent`, `ImportBatch`.
4. Disenar SQL base y rollback por proyecto.
5. Crear adaptador por proyecto:
   - `adapter-gestios`.
   - `adapter-dentagest`.
   - `adapter-ganadero-os`.
6. Validar tenant safety en cada repo.
7. Recien instalar ONIA Core en proyectos.

## No hacer todavia

- No agregar migraciones Prisma a GestiOS por ONIA Core.
- No tocar DentalGest para meter tareas genericas sin adaptar al dominio clinico.
- No tocar Ganadero OS sin respetar offline-first.
- No vender WhatsApp, SIAT, TR4 ni chatbots como parte del core.
- No crear forks por rubro antes del contrato beta.

## Criterio para pasar a beta

ONIA Core pasa a beta cuando:

- el contrato JSON esta validado;
- las entidades base estan aprobadas;
- el schema base esta revisado;
- existe plan de migracion por proyecto;
- existe plan de rollback;
- los tres sistemas tienen adaptador definido;
- no hay integraciones externas activas por defecto.
