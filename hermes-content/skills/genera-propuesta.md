# Skill: Genera Propuesta de Venta

> LEGADO (20-oct-2026). La propuesta que sale al cliente se genera con `hermes-content/propuestas/generador/` (`node generar-propuestas.js <slug> --pdf`) y la skill propuestas-comerciales-onia; nunca se edita el HTML a mano. Los precios de `scripts/genera-propuesta.js` NO son fuente (planes: subscription-plans.ts; add-ons: pricing.ts; webs: caso por caso). Uso aqui: solo borrador interno para Sergio Urcullo.

## Cuándo usar
Cuando Sergio Urcullo necesita crear una presentación personalizada para un cliente prospecto o activo. La propuesta se genera como HTML listo para mostrar en pantalla, compartir por link o imprimir en PDF.

Comandos que activan este skill:
- `Genera propuesta: <empresa> | <industria> | <necesidad>`
- `Crea presentación para: <empresa>`
- `Prepara deck: <empresa> | <datos>`
- `Propuesta ONIA: <empresa>`

## Datos que necesitás recolectar

Obligatorio:
- `empresa`: nombre de la empresa o cliente
- `industria` o `necesidad`: rubro del cliente o qué pidió

Opcional (mejora la propuesta):
- `contacto`: nombre del responsable del cliente
- `ciudad`: ubicación del cliente
- `presupuesto`: rango presupuestario (informativo, no se muestra en slides)
- `notas`: contexto extra, objeciones conocidas, datos relevantes
- `productos`: forzar productos específicos si ya sabés qué vender

## Cómo funciona

1. Recolectar datos del cliente (del CRM/Notion o del usuario)
2. Ejecutar el script:

```bash
node scripts/genera-propuesta.js \
  --empresa="Epic Motion Group" \
  --industria="audiovisual" \
  --necesidad="web premium con portafolio" \
  --contacto="Ricardo Limpias" \
  --ciudad="Santa Cruz"
```

O con JSON:
```bash
node scripts/genera-propuesta.js datos-cliente.json
```

3. El script genera: `hermes-content/propuestas/propuesta-<slug>-<timestamp>.html`

4. Abrir el HTML en navegador → presentar al cliente o exportar a PDF (`Ctrl+P → Guardar como PDF`)

## Productos disponibles (IDs)

| ID | Producto | Para quién |
|---|---|---|
| `dentalgest` | Onia Platform, rubro dental | Clínicas dentales |
| `gestios` | Onia Platform, rubro comercio | PYMEs, comercio, retail |
| `web_landing` | Landing de Captación | Cualquiera sin web |
| `web_negocio` | Web Profesional | Negocios medianos |
| `web_pro` | Web Pro ONIA | Productoras, arquitectos, premium |

## Mapeo automático industria → productos

El script detecta la industria y sugiere los 3 productos más relevantes automáticamente:

- `dental/clinica/salud` → DentalGest + Web + Consultoría
- `audiovisual/productora` → Web Pro ONIA + Web Profesional + Consultoría
- `arquitecto` → Web Pro ONIA + Web Profesional + Consultoría
- `constructora` → Web Pro ONIA + GestiOS + Consultoría
- `retail/comercio/restaurant` → GestiOS + Landing + Consultoría
- `pyme/servicio` → Web Profesional + GestiOS + Consultoría

Para forzar productos específicos:
```bash
node scripts/genera-propuesta.js --empresa="X" --productos="web_pro,consultoria"
```

## Flujo completo con cliente

```
1. Recolectar datos → CRM Notion, conversación o briefing
2. Ejecutar genera-propuesta.js con los datos
3. Abrir HTML → revisar que todo se vea bien
4. Compartir el archivo o pantalla completa durante reunión
5. Ajustar según feedback → re-generar
6. Registrar en CRM: propuesta enviada, fecha, estado
```

## Refinamiento iterativo

Para mejorar la propuesta con datos del cliente:

- Si el cliente dice "me interesa más X" → agregar al campo `notas` y re-generar con `--productos` forzados

## Ejemplo de JSON de entrada

```json
{
  "empresa": "Dental Smile Santa Cruz",
  "industria": "dental",
  "necesidad": "ordenar pacientes y citas, recordatorios automáticos",
  "contacto": "Dr. Ramiro Vaca",
  "ciudad": "Santa Cruz de la Sierra",
  "notas": "Tienen 3 doctores, usan WhatsApp manual para agendar"
}
```

## Comando Hermes vía Telegram

```
Genera propuesta: Dental Smile | dental | ordenar pacientes y citas
```

Hermes responderá con la ruta del archivo generado y los próximos pasos.

## Criterios de calidad

- La propuesta debe nombrar la empresa del cliente en portada y CTA
- El dolor debe ser específico a su industria, no genérico
- Los productos mostrados deben ser coherentes con lo que pidió
- El precio mostrado debe ser el plan más probable (no el más barato ni el más caro por defecto)
- El HTML debe abrir sin errores en Chrome y exportar bien a PDF
