---
name: onia-core
description: Invocar al tocar onia-core (contract.json, adapters, schema/base-schema.sql, módulos) o al adoptar el núcleo en un producto (los packs por rubro de Onia Platform). Garantiza el contrato, la sincronía de los 4 adapters y el validador verde antes de commitear.
---

# ONIA Core — núcleo operativo común

Fuente de verdad: `onia-core/contract.json` (1.0.0 stable, congelado: solo cambios aditivos) +
`onia-core/CHANGELOG.md` + docs `onia-core/*.md`. Guardián: subagente `onia-core-guardian`
(toda modificación al core pasa por ahí). Receta de adopción: `onia-core/ONIA_CORE_INSTALL_GUIDE_2026.md`.

## Qué es
Núcleo común de los SaaS ONIA. Vive SOLO en `onia-hermes` hasta aprobar adopción.
Core + módulos (commerce/knowledge/accounting/invoicing/payroll/dental/automation).

## Reglas duras
- **`policy.installInProductRepos = false`:** NO crear migraciones/rutas/UI dependientes del core
  en repos producto sin plan de adopción aprobado.
- **Validador verde SIEMPRE antes de commit:** `npm run validate:onia-core`.
- **Cada entidad nueva exige las 3:** entrada en `contract.json`, tabla en `schema/base-schema.sql`
  y mapeo en los **4 adapters** (`gestios`, `dentagest`, `ganadero-os`, `bolivian-electric`; `adapterFiles` de
  `contract.json`). El validador lo bloquea si falta alguna.
- **Clientes nuevos → track vertical, NUNCA fork del core.** Ver `ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`.
- **Integraciones externas (WhatsApp, SIAT, TR4) → `external_gate`:** fuera del core, entran como intake normalizado.
- **Line endings:** onia-core fuerza LF vía `.gitattributes`; los tests de portable-artifacts hashean bytes
  crudos (CRLF en Windows rompe 2 tests). Objetivo: la suite completa en verde (`npm test`) y `npm run validate:onia-core`; no se escribe una cifra de
  tests sin medirla.

## Orden de adopción
⚠️ **Corregido 2026-08-24.** Acá se nombraban como productos separados. `CLAUDE.md` §3
dice literal que **DentalGest, GestiOS, Ganadero OS y ProveeGest NO son productos ni
marcas**: son nombres viejos de PACKS de un solo producto, Onia Platform. Al cliente se le
nombra el rubro ("módulo dental"), nunca el pack.
Los 5 rubros que se ofrecen ya están encendidos. Orden de empuje (venta, pauta y desarrollo; Sergio Urcullo,
29-sep, confirmado el 19-oct): **dental → importadora → el resto.** Comercio y servicios esperan a que la factura del
SIN esté dentro del sistema. (`dental → comercio → importadora` era el orden de ENCENDIDO de julio, no la prioridad.)

## Al agregar/editar algo del core
1. Delegá en `onia-core-guardian` o seguí su checklist.
2. contract.json + base-schema.sql + 4 adapters COHERENTES.
3. `npm run validate:onia-core` y la suite de tests verdes.
4. Si es de Bolivia (accounting/invoicing) → cruzar con `onia-contabilidad-bolivia`.
