---
name: onia-core
description: Invocar al tocar onia-core (contract.json, adapters, schema/base-schema.sql, módulos) o al adoptar el núcleo en un producto (los packs por rubro de Onia Platform). Garantiza el contrato, la sincronía de los 3 adapters y el validador verde antes de commitear.
---

# ONIA Core — núcleo operativo común

Fuente de verdad: `onia-core/contract.json` (v1.0.0, `status: stable`; cambios solo aditivos) +
`onia-core/CHANGELOG.md` + docs `onia-core/*.md`. Guardián: subagente `onia-core-guardian`
(toda modificación al core pasa por ahí). Receta de adopción: `onia-core/ONIA_CORE_INSTALL_GUIDE_2026.md`.

## Qué es
Núcleo común de los SaaS ONIA. Vive SOLO en `onia-hermes` hasta aprobar adopción.
Core + 9 módulos activables (commerce, accounting + tax_bolivia, invoicing, payroll, imports, knowledge, automation, dental, agents; `onia-core/CHANGELOG.md` §1.0.0).

## Reglas duras
- **`policy.installInProductRepos = false`:** NO crear migraciones/rutas/UI dependientes del core
  en repos producto sin plan de adopción aprobado.
- **Validador verde SIEMPRE antes de commit:** `npm run validate:onia-core`.
- **Cada entidad nueva exige las 3:** entrada en `contract.json`, tabla en `schema/base-schema.sql`
  y mapeo en los **3 adapters** (el validador lo bloquea si falta alguna).
- **Clientes nuevos → track vertical, NUNCA fork del core.** Ver `ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`.
- **Integraciones externas (WhatsApp, SIAT, TR4) → `external_gate`:** fuera del core, entran como intake normalizado.
- **Line endings:** onia-core fuerza LF vía `.gitattributes`; los tests de portable-artifacts hashean bytes
  crudos (CRLF en Windows rompe 2 tests). Suite del core en verde (`npm run test:onia-core-logica`; 503 tests en el CHANGELOG 1.0.0) y 4 validadores verdes.

## Orden de adopción
⚠️ **Corregido 2026-08-24.** Acá se nombraban como productos separados. `CLAUDE.md` §3
dice literal que **DentalGest, GestiOS, Ganadero OS y ProveeGest NO son productos ni
marcas**: son nombres viejos de PACKS de un solo producto, Onia Platform. Al cliente se le
nombra el rubro ("módulo dental"), nunca el pack.
Los 5 rubros que se ofrecen ya están encendidos. Orden de empuje (`CLAUDE.md` §ONIA Core, 19-oct): **dental → importadora → el resto**; comercio y servicios esperan a que la factura del SIN esté dentro del sistema.

## Al agregar/editar algo del core
1. Delegá en `onia-core-guardian` o seguí su checklist.
2. contract.json + base-schema.sql + 3 adapters COHERENTES.
3. `npm run validate:onia-core` y la suite de tests verdes.
4. Si es de Bolivia (accounting/invoicing) → cruzar con `onia-contabilidad-bolivia`.
