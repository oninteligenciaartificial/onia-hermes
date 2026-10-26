# Skill: prospeccion-onia

## Cuando usar
Cuando Sergio pida buscar prospectos para ONIA, calificar una empresa o
preparar datos para seguimiento comercial. Solo fuentes publicas verificables.

## Comandos

### Busca prospectos ONIA: <industria> | <ubicacion>
Ejemplos:
- `Busca prospectos ONIA: clinicas dentales | Santa Cruz Bolivia`
- `Busca prospectos ONIA: restaurantes | La Paz Bolivia`
- `Busca prospectos ONIA: inmobiliarias | Cochabamba Bolivia`

### Guarda prospecto: <datos>
Guardar registro con nombre, contacto, empresa, fuente y notas. Todo prospecto
guardado entra al pipeline de `seguimiento-prospectos-onia` en estado `nuevo`.

## Perfil de cliente ideal (ICP ONIA)
Priorizar negocios bolivianos con:
- Volumen alto de consultas repetitivas (citas, precios, disponibilidad).
- Atencion manual por WhatsApp/Instagram sin sistema.
- Web inexistente, desactualizada o sin captacion de leads.
- Capacidad de pago: clinicas, inmobiliarias, restaurantes establecidos,
  estudios profesionales, comercios con varias sucursales.

Encajan directo con la oferta: web, IA, automatizacion, Chatwoot, n8n,
atencion al cliente y ventas (DentalGest para clinicas dentales, GestiOS,
Web ONIA).

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

## Reglas de privacidad y calidad (no negociables)
- Solo informacion publica. Nada de datos sensibles.
- NO inventar emails, telefonos, nombres ni responsables.
- Dato no confirmado -> marcarlo `no encontrado`, nunca rellenarlo.
- Incluir SIEMPRE la URL fuente de cada dato.
- No hacer spam: el contacto siempre es personalizado y consultivo.
- Contactar a un prospecto requiere aprobacion literal de Sergio:
  `Apruebo contactar: <empresa>`. Sin eso, solo se investiga y registra.

## Scoring de prioridad
Asignar prioridad segun senales de necesidad observables:

| Senal                                            | Peso  |
|--------------------------------------------------|-------|
| Agenda/reservas manuales visibles                 | Alta  |
| Sin web o web rota/desactualizada                 | Alta  |
| Alto volumen de consultas sin responder en redes  | Alta  |
| Formularios pobres o solo numero de telefono      | Media |
| Publica seguido pero sin CTA ni captacion         | Media |
| Presencia digital correcta pero sin automatizacion| Baja  |

- **Alta** = 2+ senales altas. **Media** = 1 alta o 2 medias. **Baja** = resto.
- Preferir 3-5 prospectos bien calificados antes que listas largas sin contexto.

## Formato de respuesta

### Resumen
- Industria, ubicacion, cantidad encontrada y oportunidad comercial principal.

### Prospectos (cada uno)
- Empresa y tipo de negocio.
- Ubicacion.
- Web o perfil publico.
- Contacto publico encontrado (o `no encontrado`).
- Senales de oportunidad observadas.
- Producto ONIA que encaja (web, DentalGest, GestiOS, automatizacion, chatbot).
- Propuesta de acercamiento en 1-2 lineas.
- Prioridad: alta / media / baja (segun scoring).
- Fuente (URL).

### Mensaje sugerido
Borrador breve, consultivo y no invasivo, personalizado con algo real y
verificable del negocio (nunca generico). Recordar: enviarlo requiere
`Apruebo contactar: <empresa>`.

### Siguiente accion
Guardar, investigar mas o preparar propuesta (skill
`propuestas-comerciales-onia`). Indicar el comando exacto.

## Integraciones
- Workflow n8n `ONIA - Prospeccion Diaria` corre automatico; sus reportes van
  SIEMPRE a Arthur Y Sergio por Telegram.
- Prospecto aprobado y contactado -> pasa a `seguimiento-prospectos-onia`.
- Prospecto con reunion agendada -> lead `reunion_agendada_pendiente` en ONIA
  Center (ver `agenda-calendario`).
