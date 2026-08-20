# Empezá acá

> Hay 163 documentos en esta carpeta. **Casi ninguno hace falta para decidir hoy.**
> Esta hoja dice cuáles sí. Si estás perdido, leé estos y ninguno más.

---

## El objetivo de ahora

**Onia Platform.** Fecha ancla: **miércoles 5 de agosto de 2026** — reunión con el BCP.
Todo lo demás está parqueado a propósito.

## Los 6 documentos que mandan

| # | Doc | Responde |
|---|---|---|
| 1 | **`ONIA_ENFOQUE_20260727.md`** | **A quién le vendemos y a quién no.** Si algo contradice a este doc, gana este doc |
| 2 | `ONIA_PLATFORM_ESTRUCTURA_20260730.md` | Qué está construido, qué no, y el plan al miércoles |
| 3 | `ONIA_PARQUEADO_20260730.md` | Todo lo congelado, con dónde quedó cada cosa |
| 4 | `ONIA_BCP_REUNION_20260805.md` | Qué preguntarle al banco. 53 marcas `[PREGUNTAR AL BANCO]` |
| 5 | `ONIA_KIT_VENTA_DENTAL_20260727.md` | Mensajes, guion de demo y objeciones. **Ojo: corregir lo del SIAT antes de usar** |
| 6 | `ONIA_CATALOGO_MAESTRO_IDEAS_20260726.md` | Todas las ideas y su estado (viva / parqueada con gatillo / descartada) |

## Las tres cosas que hay que tener siempre presentes

1. **Onia es UNA plataforma con módulos por rubro.** DentalGest **no** es un producto hermano:
   es el **pack dental**. GestiOS, Ganadero y ProveeGest tampoco son productos — son rubros.
   Sus repos ya se archivaron. *(Todo doc viejo que los trate como marcas separadas está
   desactualizado en el encuadre comercial, aunque su contenido técnico pueda servir.)*

2. **El código del producto vive en `C:\dev\proyectos\onia-platform`** (repo `onia-platform`,
   antes `Dental-Gest`). Este repo, `onia-hermes`, es **el cerebro**: docs, memoria, core,
   propuestas y la landing de marketing. Están separados **por acceso**, no por desorden.

3. **Cero clientes pagando.** Ningún material —web, propuesta, demo— puede sugerir lo contrario.

## Dos cosas abiertas que cuestan plata

- **`onia-core/logic/fx.logic.mjs:31`** — `officialRate()` cae en silencio al tipo de cambio
  **6,96** si no le inyectan el TCO. Con el oficial en **11,89**, factura **41,5% subvaluada
  sin avisar**. Detalle: `ONIA_TIPOS_DE_CAMBIO_BOLIVIA_20260730.md`.
- **La contraseña de la base de producción quedó commiteada** en `.claude/settings.json`
  (1 y 31 de mayo) del repo del producto. Es privado, pero **hay que rotarla**.

## Dónde está el resto

- **`historial/`** — lo que fue verdad y ya no se consulta. No se borró nada; está ahí.
- **`research/`** — investigación de fondo.
- **`../sales-kit/`** — material comercial listo para usar.
- **`../propuestas/`** — el generador de propuestas. Nunca escribir HTML de propuesta a mano.

## Regla para no volver a llenar esto de ruido

**Un doc nuevo se crea solo si alguien lo va a leer para decidir algo.** Si es un reporte de
algo ya ejecutado, va directo a `historial/`. Si reemplaza a otro, se anota el reemplazo en
la primera línea del viejo y se archiva — no se dejan los dos vivos diciendo cosas distintas.
