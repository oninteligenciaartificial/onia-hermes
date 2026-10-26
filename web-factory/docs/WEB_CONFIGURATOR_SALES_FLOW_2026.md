# Flujo comercial del configurador de webs

## Decisión

La venta de webs vive en la web pública de ONIA (`/servicios/webs`). La página de Sergio funciona como
vitrina, autoridad y entrada de tráfico, pero no duplica el configurador ni la
lógica comercial.

Esto deja un solo lugar para actualizar paquetes, requisitos, WhatsApp y el
flujo de Web Factory.

## Flujo actual

```text
Sergio /webs
    -> ONIA /servicios/webs?estilo=<id>&paquete=<id>&origen=sergio
    -> alcance/precio + objetivo
    -> nombre, rubro y oferta para personalizar el preview
    -> estructura + dirección visual + paleta/color + tipografía
    -> preview personalizado de seis estructuras (en móvil, pestaña Vista previa)
    -> datos de contacto y detalles finales de la solicitud
    -> requisitos visibles y aceptación
    -> WhatsApp de servicios configurado en `src/lib/site.ts` con la selección escrita
       y el origen Sergio cuando aplique
    -> persona de ONIA confirma alcance, contenido, plazo, extras y pago 50/50
```

El enlace de WhatsApp no contrata automáticamente ni confirma un precio final.
La cotización final se confirma después de revisar contenido, alcance y extras.

## Precio dinámico

El cotizador usa únicamente precios aprobados en
`hermes-content/propuestas/ONIA_CATALOGO_PRECIOS_2026.md`:

- Esencial: Landing de Captación, Bs 790.
- Completa: Web Profesional, Bs 1.500.
- A medida: Web Pro Onia, Bs 2.900.
- Catálogo: se cotiza después de revisar productos y funciones.
- Registro de formulario en CRM/n8n: Bs 790 de setup.
- Cuidado Web opcional: Bs 190, 390 o 690 por mes.

Cuando existe un total aprobado, la interfaz muestra 50% para comenzar y 50%
contra entrega. Dominio, hosting, fotos profesionales y herramientas externas no
se suman al estimado.

## Intake y preview personalizado

El formulario se divide en dos momentos. Primero pide negocio, rubro, oferta,
descripción y servicios/productos porque esos campos alimentan el preview en
vivo. Al final pide nombre de contacto, ciudad, WhatsApp, email, referencia,
permiso de fotografías y necesidades adicionales para enviar una solicitud
completa sin frenar la exploración visual al inicio.

Antes de abrir WhatsApp se exigen cinco campos: contacto, negocio, rubro, oferta
y WhatsApp. En esta fase los datos viven solo en el navegador y se transportan
en el mensaje que la persona decide enviar. No existe guardado silencioso.

## Contrato de selección

La selección que se muestra y se manda por WhatsApp usa estos campos:

```ts
type WebConfiguratorSelection = {
  layout: "centrada" | "portada" | "corporativa" | "tipografica" | "humana" | "vitrina";
  direction: "minimalista" | "editorial" | "empresarial" | "impacto" | "cercano" | "catalogo";
  palette: WebPaletteId; // 10 paletas curadas; fuente de verdad en web-configurator.ts
  accent: string;
  font: "archivo" | "editorial" | "humana" | "tecnica";
  goal: "contactos" | "reservas" | "catalogo" | "cotizaciones";
  stack: "landing" | "profesional" | "pro" | "tienda";
};
```

La fuente de verdad del contrato y de sus opciones es:

```text
web-factory/apps/onia-platform/src/content/web-configurator.ts
```

La interfaz reutilizable está en:

```text
web-factory/apps/onia-platform/src/components/web-configurator/
```

## Qué se valida antes de automatizar más

1. Que las seis estructuras y seis direcciones visuales sean comprensibles para
   clientes reales, y que los ejemplos ficticios no se confundan con trabajos publicados.
2. Que el paquete recomendado sea Web Profesional y que los precios publicados
   sigan coincidiendo con `hermes-content/docs/historial/ONIA_PRICING_2026.md`.
3. Que los mensajes que llegan por WhatsApp permitan calificar rápido el rubro,
   nombre del negocio y objetivo.
4. Que el tiempo de respuesta humano sea compatible con el volumen de pedidos.
5. Confirmar si el número configurado en `src/lib/site.ts` es el WhatsApp
   comercial definitivo de ONIA antes de publicar el flujo.

## Fase siguiente: conexión con el sistema

Después de validar copy, estilos y conversión, se puede agregar un endpoint
server-side `/api/web-intake` que registre la selección en ONIA Center antes de
abrir WhatsApp. Esa conexión debe ser best-effort, sin bloquear la conversación
ni exponer secretos en el navegador.

El registro debería incluir solo la configuración comercial y el origen. El
nombre, teléfono, contenido del negocio y archivos se capturan cuando la
persona los entrega por el canal acordado y con el tratamiento correspondiente.

Una venta cobrada puede convertirse después en un intake de Web Factory:

```text
configuración validada
    -> intake del cliente
    -> receta automática de diseño
    -> preview del sitio
    -> aprobación humana
    -> generación y publicación
```

No conviene generar ni publicar una web completa solo porque alguien tocó un
botón del configurador. El configurador vende y ordena la decisión; la entrega
se activa después de confirmar alcance, materiales y anticipo.

## Validación UI del 14 de septiembre de 2026

- El recorrido quedó ordenado en ocho pasos y sin bloques de precio repetidos.
- En 390 px no existe desbordamiento horizontal y la página bajó de 14.560 px a
  9.649 px de alto.
- El CTA incompleto vuelve primero a `#datos-preview` y, después de completar el
  contenido del negocio, a `#datos-solicitud`.
- La prueba con Web Pro Onia + CRM/n8n calculó Bs 3.690 y mostró Bs 1.845 para
  comenzar y Bs 1.845 contra entrega; Cuidado Web se mantuvo separado como
  mensualidad.
- El mensaje de WhatsApp solo se habilitó después de completar los cinco datos
  mínimos y aceptar los requisitos.
- El único error de consola observado fue un `429` del widget externo de
  Chatwoot; no provino del configurador y debe revisarse antes del deploy.
