# Skill: prospeccion-onia

## Objetivo
Buscar prospectos para ONIA usando fuentes publicas verificables, generar notas accionables y preparar datos para seguimiento comercial.

## Comandos

### Busca prospectos ONIA: <industria> | <ubicacion>
Buscar empresas o profesionales de la industria y ubicacion indicadas.
Ejemplos:
- `Busca prospectos ONIA: clinicas dentales | Santa Cruz Bolivia`
- `Busca prospectos ONIA: restaurantes | La Paz Bolivia`
- `Busca prospectos ONIA: inmobiliarias | Cochabamba Bolivia`

### Guarda prospecto: <datos>
Guardar o preparar registro de prospecto con nombre, contacto, empresa, fuente y notas.

## Busqueda
Usar SearXNG como gateway cuando este disponible:
```bash
curl "http://localhost:8080/search?q=<consulta>&format=json"
```

Consultas sugeridas:
- `<industria> <ubicacion> contacto`
- `<industria> <ubicacion> instagram`
- `<industria> <ubicacion> whatsapp`
- `<industria> <ubicacion> sitio web`
- `site:facebook.com <industria> <ubicacion>`
- `site:instagram.com <industria> <ubicacion>`

## Fuentes permitidas
- Sitio web oficial de la empresa.
- Perfil publico de Instagram, Facebook, LinkedIn o Google Business.
- Directorios empresariales publicos.
- Noticias, notas de prensa o paginas institucionales.

## Reglas de privacidad y calidad
- Usar solo informacion publica.
- No recopilar datos sensibles.
- No inventar emails, telefonos, nombres ni responsables.
- Si un dato no esta confirmado, marcarlo como `no encontrado`.
- Incluir siempre la URL fuente.
- Priorizar prospectos con senales de necesidad: sitio web desactualizado, falta de automatizacion visible, poca respuesta en redes, agenda manual, formularios pobres o alto volumen de consultas.

## Formato de respuesta

### Resumen
- Industria.
- Ubicacion.
- Cantidad de prospectos encontrados.
- Oportunidad comercial principal.

### Prospectos
Para cada prospecto:
- Empresa.
- Tipo de negocio.
- Ubicacion.
- Web o perfil publico.
- Contacto publico encontrado.
- Senal de oportunidad.
- Propuesta de acercamiento.
- Nivel de prioridad: alta, media o baja.
- Fuente.

### Mensaje sugerido
Crear un mensaje breve, consultivo y no invasivo para contactar al prospecto.

### Siguiente accion
Indicar si conviene guardar, investigar mas o preparar propuesta.

## Criterios de calidad
- Preferir pocos prospectos buenos antes que listas largas sin contexto.
- Adaptar el angulo comercial a ONIA: web, IA, automatizacion, Chatwoot, n8n, atencion al cliente y ventas.
- No hacer spam. Recomendar contacto personalizado.
