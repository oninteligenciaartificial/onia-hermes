# Onia Platform — los módulos

> **2026-08-01. Decisión de Sergio:** Gestios muere como producto aparte y entra como
> módulo de Onia Platform. `onia-platform` es el ÚNICO repo que va a producción.
>
> Regla que ordena todo: **un rubro nuevo se ENCIENDE desde el core, no se escribe de
> cero.** El contrato (`onia-core/contract.json` v1.0.0) ya define los 11 rubros y las
> capacidades de cada uno. Este doc solo dice cuál se desarrolla, en qué orden y de
> dónde sale el código.

## 1. Cómo se arma un módulo (siempre igual)

1. El rubro ya existe como track en el contrato → se habilita en el registro
   (`SUPPORTED_VERTICAL_TRACK_IDS`).
2. Las capacidades del track dicen qué entidades/pantallas corresponden.
3. Pantallas propias del rubro + seeder demo.
4. Gate: tsc + tests verdes, y **verificado en producción** (construido ≠ terminado).

## 2. Orden de desarrollo

| # | Módulo | Track del core | De dónde sale el código | Estado |
|---|--------|----------------|--------------------------|--------|
| 1 | **Dental** | `dentagest-clinical` | ya construido | ✅ en producción |
| 2 | **Comercio / inventario** | `gestios-general` | **repo Gestios** (kardex promedio ponderado, FEFO, conteos, caja) | 🔴 en desarrollo AHORA |
| 3 | **Contabilidad Bolivia** | capacidad transversal (`accounting`, `tax_bolivia`) | **Gestios Contador Pack** (RCV, IVA/IT, balance, calendario NIT) | tras el 2 — sirve a TODOS los rubros |
| 4 | **Importadora** | `proveegest-electrico` | pack ya provisiona; faltan pantallas | tras el 3 |
| 5+ | Gastronomía · servicios · estética · vet · educación · construcción · turismo · ganadero | tracks ya declarados | encender capacidades, pantallas mínimas | con cliente que pague |

**Por qué comercio segundo:** el código ya existe (Gestios), el track ya exige
`catalog_inventory` + `sales_cash`, y es el 2º vertical decidido (ferreterías SCZ).

**Por qué contabilidad tercero y no quinto:** no es un rubro, es transversal — el
Contador Pack de Gestios le sirve al dental, al comercio y a todos los que sigan.
Un solo porte, N rubros lo usan.

## 3. Qué se rescata del repo Gestios (y qué no)

**Se porta:** inventario detallado (kardex, FEFO, conteos) · caja/ventas · Contador
Pack. **No se porta:** su auth, su registro, su onboarding, su deploy — todo eso ya lo
tiene la plataforma y mejor.

El repo Gestios queda **congelado como cantera** hasta terminar el porte; después se
archiva. Su proyecto Vercel y su base no reciben ni un cambio más.

---
Fuentes: `onia-core/contract.json` (los tracks) · `ONIA_PLANES_REQUISITOS_20260801.md`
(qué plan habilita qué) · `ONIA_SALIDA_DE_VERCEL_20260801.md` (el apagado).
