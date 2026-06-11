# Generador de Propuestas ONIA

Sistema para armar propuestas comerciales (HTML + PDF) desde una sola plantilla
y datos por cliente. Objetivo: **máxima producción** — cerrar más clientes sin
escribir cada propuesta a mano.

## Estructura

```
generador/
├── generar-propuestas.js   # motor: JSON → HTML → PDF
├── clientes.json           # fuente de verdad (un objeto por cliente)
└── README.md
../propuesta-<slug>.html    # salida HTML
../propuesta-<slug>.pdf     # salida PDF
```

## Uso

```bash
# Solo HTML (rápido, no requiere navegador)
node generar-propuestas.js

# HTML + PDF (usa Edge/Chrome headless)
node generar-propuestas.js --pdf

# Un solo cliente
node generar-propuestas.js garabato --pdf
```

> Si el PDF falla con "está siendo utilizado en otro proceso": cerrá el PDF
> abierto en el visor. Edge no puede sobrescribir un archivo abierto.

## Agregar un cliente nuevo (30 segundos)

1. Copiá un objeto de `clientes.json` y cambiá `slug` + contenido.
2. `node generar-propuestas.js <slug> --pdf`
3. Listo: HTML editable + PDF para enviar.

## Campos del cliente (clientes.json)

| Campo | Qué es |
|---|---|
| `slug` | id de archivo (kebab-case, sin espacios) |
| `nombre` | nombre mostrado |
| `accent` | color de acento (hex) |
| `heroGrad` | (opcional) gradiente del hero |
| `titulo` / `subtitulo` | encabezado del hero |
| `problema` | párrafo (acepta `<b>`) |
| `incluye[]` | 2 tarjetas: `tag`, `tagClass` (''\|green), `titulo`, `items[]` |
| `pasos[]` | "Cómo lo construimos": `titulo`, `detalle` (numerados auto) |
| `paquetes[]` | `nombre`, `incluye`, `precio`, `recomendado` (⭐) |
| `notaPaquetes` | texto bajo la tabla (acepta `<b>`) |
| `addons[]` | `nombre`, `setup`, `mensual` |
| `terceros` | nota de costos que paga el cliente |

## Reglas de pricing

Ver `../PRICING_RATIONALE_INTERNO.md` (interno). Resumen:
- Línea estándar: Landing 2,000 / Web Pro 4,500.
- Cobrar la automatización (BCP/n8n/WhatsApp/CRM), no los píxeles.
- El margen vive en lo recurrente (Cuidado Web / GestiOS / videos).
- Dominio, hosting y comisión de pasarela los paga el cliente — nunca en precio.
- Nunca mencionar al cliente que usamos plantillas.

## Sin dependencias

Node >= 18, CommonJS, sin `npm install`. Imprime PDF con Edge/Chrome del sistema.
