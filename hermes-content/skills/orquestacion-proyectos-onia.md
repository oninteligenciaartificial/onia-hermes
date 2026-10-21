# Skill: Orquestacion Proyectos ONIA

Usar esta skill cuando Sergio pida coordinar DentalGest, Gesti-OS, paginas web,
consultoria/implementaciones, automatizaciones simples, prospeccion, CRM o todos
los proyectos de ONIA.

> No es la cola `orquesta` de GitHub (eso es `planificar-orquesta`): esta skill decide que vender, a quien y con que mensaje; no carga issues.

## Leer

- `PROJECTS_ORCHESTRATION.md`
- `CRM_PROSPECTING.md`
- `CLIENT_CONTENT_PRODUCTION_SYSTEM.md`
- `HIGGSFIELD_CLIENT_SALES_PLAYBOOK.md`
- `hermes-content/docs/ONIA_CONSULTING_SERVICES_2026.md`
- `hermes-content/references/onia-projects-registry.json`

## Intencion

Hermes debe decidir:

- que oferta conviene vender;
- a que cuenta/proyecto pertenece;
- que mensaje preparar;
- que pieza de contenido crear;
- que canal usar;
- que aprobacion falta;
- que registro CRM actualizar.

## Comandos

```text
Orquesta ONIA: <empresa o rubro> | <objetivo>
Prepara venta DentalGest: <clinica>
Prepara venta Gestios: <empresa>
Prepara venta Web ONIA: <negocio>
Prepara consultoria ONIA: <negocio> | <dolor o proceso>
Mapa proyectos ONIA
Siguiente accion comercial ONIA
```

## Mapeo rapido

- Clinicas dentales -> Onia Platform, modulo dental (primer rubro).
- Importadoras, mayoristas y distribuidoras B2B -> Onia Platform, modulo importadora (segundo rubro).
- Comercio, estetica y servicios profesionales -> modulo del rubro, despues (comercio y servicios esperan la factura SIN dentro del sistema). Se vende el sistema; el chatbot es add-on; no nombrar DentalGest/GestiOS/ProveeGest al cliente.
- Negocios sin web clara -> paginas web ONIA.
- Negocios con presencia debil -> auditoria express, web o diagnostico.
- Negocios con procesos confusos, herramientas sueltas o dudas sobre que comprar
  -> consultoria ONIA.
- ONIA como marca -> Web ONIA + contenido educativo + casos.

Videos IA/Higgsfield esta pausado como producto comercial independiente. No
ofrecer packs de video IA salvo aprobacion explicita de Sergio.

## ONIA Core (nucleo de los SaaS)

Todos los SaaS ONIA comparten un nucleo operativo: ONIA Core
(`onia-core/contract.json`, v1.0.0 stable). Al orquestar o vender:

- Cada prospecto se mapea a un track: dental -> `dentagest-clinical`,
  B2B/distribucion -> `proveegest-electrico`, pyme general -> `gestios-general`,
  agro -> `ganadero-offline`. Ver
  `onia-core/ONIA_CORE_CLIENT_ADOPTION_MAP_2026.md`.
- Lo que se vende como "seguimiento, responsables, aprobaciones, agenda,
  reportes del dueno" ya esta definido en el core; no prometer funciones fuera
  del contrato sin marcarlas como modulo o integracion.
- WhatsApp automatico, SIAT y TR4 son integraciones gated: no prometerlas como
  incluidas.
- Orden de empuje vigente (Sergio Urcullo, 19-oct): dental -> importadora -> el resto.

## Salida requerida

```text
Proyecto:
Oferta primaria:
Oferta secundaria:
Prospecto/audiencia:
Dolor probable:
Senal usada:
Canal recomendado:
Mensaje sugerido:
Contenido sugerido:
CTA:
Estado CRM:
Aprobacion necesaria:
Siguiente accion:
```

## Reglas

- No contactar sin aprobacion explicita.
- Todo mensaje a prospectos y clientes va de usted.
- No publicar sin aprobacion explicita.
- No usar WhatsApp automatico hasta verificacion de negocio.
- No inventar datos, precios, resultados, testimonios o nombres.
- Si faltan datos, preparar una auditoria o investigacion, no una afirmacion.
- Usar solo fuentes publicas en prospeccion.
