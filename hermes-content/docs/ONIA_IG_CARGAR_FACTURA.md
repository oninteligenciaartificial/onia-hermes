# Cargar la palabra FACTURA en @oniahq — el cambio exacto

> **Estado: preparado, sin aplicar.** Sergio autorizó cargarla (2026-08-30). No se aplicó por API
> y la razón está abajo: **este MCP de n8n no tiene edición parcial**. Son 30 segundos en la UI.

## Por qué está listo para encenderse

`FACTURA` es la única palabra con el recurso **ya publicado y verificado** que todavía no está en
el circuito:

- `https://onia.com.bo/guia-facturacion` → **200**, 56.759 bytes (verificado con `curl`, 30-ago).
- Bloquea la pieza **O03-facturacion-en-linea**, que está escrita y pasa el gate salvo por esto.
- Es la excepción sana: **no tiene PDF a propósito** — sería una segunda copia del texto fiscal, y
  dos copias de una norma terminan contradiciéndose. La página es la fuente.

## 🔴 Por qué no se aplicó por API

El MCP de n8n conectado expone `update_workflow`, pero trabaja con el **Workflow SDK**: describe el
workflow **completo** en código TypeScript restringido. Para cambiar una línea de un nodo Code
habría que **reescribir los 18 nodos a mano** — con sus notas, posiciones, credenciales y las tres
correcciones de agosto (H1 el `neverError`, H2 el freno de 24 h, el IF nativo anti-tormenta).

**Reescribir un workflow de producción vivo para agregar una palabra es desproporcionado**, y es
justo la "cirugía nueva" que el runbook prohíbe. La UI de n8n hace el mismo cambio sin ese riesgo.

## El cambio — dos bloques

Workflow **`ONIA - Comentario IG -> DM (Private Reply)`** (`1jS4jwmNmvcQpqqH`) → nodo
**`Parsear comentario`**.

### 1. Agregar FACTURA a @oniahq

Dentro de `CUENTAS['17841423363059652'].palabras`, **después** de la coma que cierra `LISTA`:

```javascript
      FACTURA: 'Hola! Ahi va la guia: como saber en un minuto si te toca facturar en linea, y los 6 pasos para habilitarte gratis en el portal del SIN.\n\nhttps://onia.com.bo/guia-facturacion?src=onia-ig-factura\n\nEl portal del SIN es gratis y a la mayoria le alcanza: la guia dice cuando conviene y cuando no. Si despues queres que la factura salga sola desde tu sistema, contame a que se dedica tu negocio.'
```

⚠️ **El texto NO dice "es obligatorio por ley"** a propósito. Está prohibido vender con esa
amenaza (regla del carril fiscal): el portal del SIN es gratis y la guía tiene que decirlo.

### 2. Que no se pierda el lead en las otras cuentas

Una línea más abajo, `palabraAjena` lista las palabras que existen en OTRA cuenta para avisar en
vez de morir en silencio. Hoy no incluye FACTURA:

```javascript
// ANTES
const palabraAjena = !palabra && (texto.includes('SISTEMA') || texto.includes('LISTA') || texto.includes('HUMO'));

// DESPUES
const palabraAjena = !palabra && (texto.includes('SISTEMA') || texto.includes('LISTA') || texto.includes('HUMO') || texto.includes('FACTURA'));
```

**Sin esto**, alguien que comente FACTURA en la cuenta de Lucía cae en `sin_palabra_clave` y **nadie
se entera**. Es exactamente lo que pasó el 26-ago con RANKING en la cuenta de Sergio.

## Cómo se verifica que quedó

1. En n8n, el nodo guardado tiene que mostrar las **tres** palabras en @oniahq: SISTEMA, LISTA,
   FACTURA.
2. Comentar `FACTURA` en un post de @oniahq desde una cuenta que no sea nuestra.
3. Llega el DM y el aviso de Telegram con `Palabra: FACTURA`.
4. Después: en `scripts/recompensas.json` pasar FACTURA a `"activa": true` y agregar `"@oniahq"` a
   `activa_en`. **Recién ahí** O03 pasa el gate.

## Lo que NO hay que tocar

- El bloque de `@sergio_urcullo` (`17841441395192146`): sus palabras están **vacías a propósito**,
  tiene dos avisos de automatización abiertos de Meta.
- El bloque `DESCONOCIDA` (Lucía): ahí viven SISTEMA y HUMO con **su propia voz**. FACTURA no va
  ahí: la guía fiscal es material de @oniahq, no del personaje.
