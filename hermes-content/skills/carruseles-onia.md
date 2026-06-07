# Skill: carruseles-onia

## Objetivo
Crear carruseles originales para ONIA con guion por slide, caption, hashtags, prompts visuales y alt text.

## Comando
`Genera carrusel ONIA: <tema> | <objetivo> | <audiencia>`

## Ejecucion
```bash
carousel-generator --topic "<tema>" --objective "<objetivo>" --audience "<audiencia>" --slides 6
```

Si hay referencias de estilo, resumirlas primero con la skill `referencias-pinterest` y pasarlas como texto JSON en `--references`.

## Criterios
- Entre 3 y 10 slides.
- Primer slide con hook claro.
- Slides intermedios con problema, insight, solucion y ejemplo.
- Ultimo slide con CTA.
- Lenguaje claro para empresas bolivianas.
- Prompts visuales originales, sin copiar referencias.
- Usar ONIA green como acento, no como paleta completa.
- Priorizar layouts profesionales B2B: jerarquia clara, espacio en blanco, diagramas simples, procesos y ejemplos concretos.

## Resultado
Responder con:
- Titulo.
- Slides numeradas.
- Caption.
- Hashtags.
- Prompts visuales.
- Siguiente accion: generar imagenes, pedir aprobacion o publicar si ya existen URLs publicas.

## Angulos recomendados ONIA
- Errores que hacen perder leads.
- Procesos que una empresa ya no deberia hacer a mano.
- Antes/despues de automatizar.
- Checklist para saber si un negocio esta listo para IA.
- Flujo real: Instagram/WhatsApp -> Chatwoot -> n8n -> seguimiento.
- Caso clinica dental: citas, recordatorios, seguimiento y pacientes.
