# Generador de Propuestas Onia

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

# Variante TRACKEADA por prospecto (avisa a Telegram al abrirse)
node generar-propuestas.js dentalgest --track clinica-sonrisa-jul26
```

## Propuesta trackeable (--track)

`--track <token>` genera un archivo extra `propuesta-<slug>-<token>.html` con un
pixel invisible que llama al webhook n8n `propuesta-abierta` (workflow
"Onia - Propuesta Abierta (pixel)", id `UMpcKi7wfMmC9KCw`). Al abrirlo, Sergio
recibe por Telegram: token del prospecto, slug, hora y dispositivo.

- Enviar al prospecto el **HTML trackeado** (o hostearlo); el PDF normal no
  trackea (los PDF no ejecutan el pixel).
- El PDF se imprime siempre desde el HTML SIN pixel — la generación no cuenta
  como apertura.
- Token sugerido: `<cliente>-<mes>` (ej. `clinica-sonrisa-jul26`). Un token por
  prospecto para saber QUIÉN abrió.
- El webhook ignora bots/crawlers (`ignoreBots`), pero un antivirus de correo
  corporativo podría disparar un falso positivo — preferir envío por WhatsApp.

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
| `moneda` | (opcional) etiqueta de moneda de los headers de precio; default `Bs` |
| `_todo` | (opcional, interno) pendientes antes de enviar — el generador lo ignora |

Secciones opcionales v3 (solo se renderizan si existen; data de conversión:
imágenes +72% cierre, prueba social +34%, CTA claro):

| Campo | Qué es |
|---|---|
| `portada` | portada full-page: `titulo`, `subtitulo`, `para`, `fecha` (enterprise) |
| `resumenEjecutivo` | párrafo tras el hero (acepta `<b>`) — para compradores formales |
| `imagenes[]` | `src` (relativo a /propuestas, ej. `assets/x.jpg`), `alt`, `caption` |
| `casos[]` | prueba social REAL: `titulo`, `detalle`. NO fabricar — vacío hasta tener casos |
| `comparativa` | tabla vs. statu quo: `titulo`, `columnas[2]`, `filas[][3]` (aspecto, ellos, Onia) |
| `costoDeEsperar` | qué le cuesta NO hacer nada, con SUS números: `intro`, `items[]` (`concepto`, `dato`, `costo`), `total`, `totalLabel`, `siat.grupo`, `nota`. Se imprime antes de los paquetes |
| `proximosPasos[]` | 3 pasos concretos para cerrar |
| `ctaWhatsapp` | botón final: `url` (wa.me con texto prefilleado), `texto` |

**`costoDeEsperar` — sin datos reales del cliente NO se imprime.** Sin `items`
válidos (`concepto` + `costo`) el bloque no se renderiza: prohibido poner números de
ejemplo, rangos genéricos o promedios del rubro como si fueran del cliente. Ya no
lleva línea fiscal: `siat.grupo` se ignora desde el 2026-10-03, porque el plazo que
imprimía (1-oct-2026, RND 102600000007) quedó sin efecto por la RND 102600000038.
Detalle: regla 13 de la skill `propuestas-comerciales-onia`.

Imágenes: viven en `../assets/`. Ambientación editorial (Higgsfield/IA) o fotos
reales — NUNCA screenshots falsos de producto (regla: no fabricar). Cuando haya
screenshot real del panel, reemplaza la ambientación.

## Reglas de pricing

Ver `../PRICING_RATIONALE_INTERNO.md` (interno). Resumen:
- Línea estándar: Landing 2,000 / Web Pro 4,500.
- Cobrar la automatización (BCP/n8n/WhatsApp/CRM), no los píxeles.
- El margen vive en lo recurrente (Cuidado Web / Onia Comercio / videos).
- Dominio, hosting y comisión de pasarela los paga el cliente — nunca en precio.
- Nunca mencionar al cliente que usamos plantillas.

## Sin dependencias

Node >= 18, CommonJS, sin `npm install`. Imprime PDF con Edge/Chrome del sistema.
