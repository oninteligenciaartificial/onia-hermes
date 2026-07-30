# ONIA - Material facturable, equipo y quién vende qué 2026

Estado: mapa comercial con el equipo real. Fuente para poner a facturar.
Fecha: 2026-07-18.
Uso: qué se vende, quién lo vende y cómo gana cada uno. Reglas de pago de
colaboradores: `ONIA_COLABORADORES_COMERCIALES_SIN_INVERSION_2026.md`. Nuvia:
`ONIA_NUVIA_ACCOUNTING_MODEL_2026.md`.

## El equipo

| Persona | Rol | Vende | Produce contenido | Coordina |
|---|---|---|---|---|
| **Sergio** | Dueño, director e inversor. **Cara oficial de ONIA** | cierres grandes | autoridad y marca (es el rostro) | todo |
| **Arthur** | Operativo senior ("casi Sergio") | Nuvia, SaaS, webs | sí | a Camila y Jerónimo |
| **Jerónimo** | Comercial-operativo (como Arthur) | Nuvia, SaaS, webs | sí (su fuerte operativo) | no |
| **Camila** | Vendedora pura | SaaS, Nuvia | no | no |

```
Sergio  (cara oficial + dirige + invierte)
  └─ Arthur  (operativo senior, coordina)
       ├─ Jerónimo  (vende todo + produce contenido)
       └─ Camila    (solo vende)
```

Diferencia clave: **Camila solo vende** (SaaS + Nuvia). **Jerónimo y Arthur venden
todo Y producen contenido**. Arthur además coordina.

## Contenido (grabar, editar, carruseles)

| Tipo | Quién |
|---|---|
| Cara y autoridad de ONIA | **Sergio** (es el rostro de la marca) |
| Producción (grabar, editar, carruseles, demos) | **Jerónimo** (principal) + Arthur |
| Contenido AI / faceless (Lucía, canales) | pipeline AI (agentes + Higgsfield) |
| Camila | no produce contenido |

En Jerónimo y Arthur el contenido es **parte del scorecard** (X videos, X carruseles
por semana), no pago aparte salvo un entregable grande aprobado por Sergio.

## Los 3 motores de caja

### Motor 1 - Servicios / Software (comisión %)

| Oferta | Precio | Gana el vendedor | ¿Listo? |
|---|---:|---:|---|
| DentalGest | Bs. 320-1.500/mes | 35% 1er pago | ✅ live |
| Landing / Web Prof / Web Pro | Bs. 790 / 1.500 / 2.900 | 12% | ✅ |
| Auditoría / Diagnóstico | Bs. 250 / 690 | 10% | ✅ |
| Automatización n8n | Bs. 790-1.200 | 10% | ✅ |
| GestiOS | Bs. 350-1.250/mes | 35% | ⚠️ aún no |

### Motor 2 - Nuvia (skincare, B2C — venta al consumidor)

315 productos, venta promedio Bs. 236. Fuertes: antiedad (98), protección solar
(67). Se opera por producto validado, no todo el catálogo. Después se escala a
**importar productos ganadores** (más margen). Se vende **al consumidor final**.

Comisión al vendedor (modelo Nuvia: NO se paga % de utilidad; fija por venta como
costo directo, solo si el margen aguanta):

| Qué vende | Comisión |
|---|---:|
| Producto fuerte (antiedad, solar) | **Bs. 35** / venta |
| Producto estándar | **Bs. 18** / venta |
| Producto de bajo margen (<Bs. 80) | Bs. 0 (no se empuja) |
| Bono rutina (pack de 3+ productos) | **+Bs. 20** a esa venta |

Registro en centro contable separado (`nuvia_closures`).

### Motor 3 - Media (YT, Lucía): PAUSA, no factura ahora

## Quién vende qué

| | Camila (pura) | Jerónimo (operativo) | Arthur (senior) |
|---|---|---|---|
| SaaS (DentalGest) | ✅ | ✅ | ✅ |
| Nuvia | ✅ | ✅ | ✅ |
| Webs | — | ✅ | ✅ |
| Contenido | — | ✅ produce | ✅ produce |
| Coordinar | — | — | ✅ |

Como Camila y Jerónimo venden lo mismo (SaaS + Nuvia), se dividen por **territorio**
(rubro o zona) para no pisarse; Arthur reparte los leads. Territorio a definir.

## Cómo gana cada uno

| Quién | Cómo gana |
|---|---|
| **Sergio** | Fondo ONIA + recuperación de capital + utilidad de dueño → va por delante (pone capital, herramientas, riesgo, dirección, marca) |
| **Camila** | Comisión: 35% SaaS · Nuvia por tabla. Solo venta |
| **Jerónimo** | Comisión: 35% SaaS · 12% web · Nuvia por tabla · contenido en scorecard |
| **Arthur** | Su acuerdo (comisión + coordinación) |
| Modelos / agentes AI | No cobran — son activos de ONIA; el margen queda para ONIA |

## Foco para empezar a facturar YA

1. Auditoría Bs. 250 + landing Bs. 790 (cierre fácil).
2. DentalGest (recurrente, live).
3. Nuvia antiedad/solar al consumidor.

NO empujar: GestiOS (no listo), Media.
