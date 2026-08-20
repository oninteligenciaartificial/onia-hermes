# Higgsfield Layers — edición de imagen por capas con prompts

- **Fuente:** https://www.instagram.com/p/Db6OAcpiN28/ · 55 s · sin voz (música + efectos)
- **Visto:** 2026-08-12 (Gemini nativo)
- **Archivo:** `Instagram-Db6OAcpiN28.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-Db6OAcpiN28.md](transcripciones/2026-08-12-Instagram-Db6OAcpiN28.md)

## Qué dice realmente

Anuncio de producto de Higgsfield para su herramienta **Layers**. No hay locución: Whisper
devolvió un solo token (`"You"`) en 55 s — todo el contenido está en la pantalla. Son tres
demos de interfaz encadenadas y un CTA final: *"HIGGSFIELD LAYERS IS NOW AVAILABLE ON
HIGGSFIELD.AI"*.

- **00:05-00:16 — ficha de producto.** Botón *"Create product card"*. Aparecen unas gafas
  con panel lateral de **capas nombradas e independientes** (`Glasses`, `Text`, `Liquid 1/2/3`,
  `Information`, `HOLO S TEXT`). Se editan con prompts sueltos: *"+ bold holographic title"*
  genera el título, *"+ $9 price sticker"* genera el sticker de precio.
- **00:17-00:40 — retrato a banner.** Sobre una selfie: `Upscale` → `Remove BG` →
  *"+ Change pose"* → *"+ Abstract background"* → variaciones de la misma modelo →
  *"+ add 'Welcome to my channel' text"* → *"+ make it better!"* → `Reframe` a horizontal.
- **00:40-00:51 — vestir un personaje.** Un personaje anime en ropa interior con prendas
  sueltas al lado; se edita por **marcas de color sobre la imagen**: *"Blue: paint it
  Higgsfield / Green: change to knight glove / Red: Relax"*. Sale vestido y en pose.

Lo que el anuncio **no** dice (nada de esto está en el video, todo *a verificar*): cuánto
cuesta cada operación en créditos, si Layers entra en nuestro plan, resolución de salida,
límites por generación, ni si las capas son editables después de exportar.

Dato de contexto que sí es nuestro y baja la novedad: `upscale_image`, `remove_background`,
`reframe` y `outpaint_image` **ya figuran como herramientas del MCP de Higgsfield que tenemos
conectado**. Dos tercios del video son operaciones que ya podemos disparar. La novedad real
son dos cosas: el **panel de capas con prompt por capa** y la **edición por marcas de color**.

## Veredicto: MEJORA LO ACTUAL

No abre un frente nuevo ni desbloquea nada. Es un anuncio, sin un solo número, que vende como
novedad algo que en diseño existe hace décadas (capas) más dos operaciones que ya tenemos
conectadas. Se salva de HUMO por dos motivos concretos:

1. Es una plataforma que **ya pagamos** (plan ultra, 2.862 créditos, sin ventana ilimitada), no
   una herramienta nueva a comprar. El costo de probarlo es un puñado de créditos, no una suscripción.
2. La **interfaz está bien hecha** y es directamente aplicable: panel de capas nombradas +
   *prompt chips* apilados como historial de edición. Eso es referencia reconstruible en
   `ui-patterns/` mirando los fotogramas, y se parece mucho a lo que necesita la vista Estudio
   de Contenido del panel.

Lo que mejora de verdad si funciona: hoy una ficha de producto o un banner se regenera entero
(Soul + texto) y si sale mal se tira todo. Editar una capa sin tocar las otras cambia el costo
de iterar. Eso vale — pero recién cuando esté verificado, no antes.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Marketing con IA | Verificar GRATIS si Layers está en nuestra cuenta y qué cuesta una operación (`models_explore` / `show_plans_and_credits`) antes de generar nada |
| Influencers IA | La demo de "vestir personaje" por marcas de color es la vía para cambiar ropa de Lucía/Mara sin regenerar la cara. A probar contra el método Soul+texto, que hoy es el único validado |
| Carrito de compra / comercio minorista | La receta "ficha de producto" (foto + título + sticker de precio en capas) es exactamente lo que necesita el catálogo de un cliente de comercio o importadora |
| ui-patterns | Reconstruir el patrón *panel de capas + prompt chips apilados* desde los fotogramas — sirve para el Estudio de Contenido del panel, sin depender de Higgsfield |

## Riesgo

- **Gasto.** El anuncio no informa costo por operación y la cuenta no tiene ventana ilimitada.
  Cada prueba se pide con permiso explícito de Sergio, una por una (`gasto-plataformas-validar-primero`).
- **Fabricar capacidad.** Nada de prometerle a un cliente "editamos tu catálogo por capas con IA"
  mientras esto sea una demo de Instagram. Primero se prueba en la cuenta, después se ofrece.
- **Dependencia.** Meter el flujo de fichas de producto dentro de una función propietaria de
  Higgsfield ata el entregable del cliente a un proveedor externo. El patrón de UI, en cambio,
  es nuestro y no se cae si ellos cambian el producto.
