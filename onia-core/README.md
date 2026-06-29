# ONIA Core

Estado: alpha canonico, no instalado en productos.
Owner: ONIA / Hermes.

ONIA Core es el nucleo de organizacion operativa que despues se instalara en
los sistemas de ONIA: GestiOS, DentalGest y Ganadero OS.

## Regla principal

ONIA Core vive primero aqui, en `onia-hermes/onia-core`.

No se instala todavia en otros proyectos. Primero se completa el contrato, se
valida, se definen migraciones base y recien despues se sube a cada sistema.

## Que resuelve

ONIA Core responde:

1. Quien trabaja en la empresa.
2. Que rol y permisos tiene cada persona.
3. Que clientes, proveedores, contactos o areas existen.
4. Que tareas, solicitudes, casos o pendientes estan abiertos.
5. Quien es responsable.
6. En que estado esta cada pendiente.
7. Cual es la fecha limite o siguiente accion.
8. Que evidencia, nota, archivo o historial existe.
9. Que alerta requiere atencion.
10. Que reporte necesita gerencia.

Inventario, ventas, caja, cotizaciones, WhatsApp, SIAT, TR4 o chatbots son
modulos, verticales o integraciones. No son la definicion del core.

## Archivos

- `contract.json`: contrato canonico versionado.
- `index.mjs`: helpers para leer y consultar el contrato.
- `validate.mjs`: validador local de estructura e invariantes.
- `ONIA_CORE_RESEARCH_RESULT_2026.md`: resultado de investigacion local y externa.
- `ONIA_CORE_BENCHMARK_GAP_AUDIT_2026.md`: auditoria contra sistemas ERP, CRM,
  work management y operacion real de empresas.
- `ONIA_CORE_DISTRIBUTION_PLAN_2026.md`: plan para subir ONIA Core a los
  sistemas cuando este listo.
- `schema/base-schema.sql`: SQL base de referencia, no aplicado directamente.
- `adapters/gestios.json`: mapa de adopcion para GestiOS.
- `adapters/dentagest.json`: mapa de adopcion para DentalGest.
- `adapters/ganadero-os.json`: mapa de adopcion para Ganadero OS.

## Validacion

```bash
npm run validate:onia-core
```

## Politica de distribucion

Hasta que el contrato pase a `beta`, los repos producto no deben incorporar
nuevas migraciones, rutas ni UI dependientes de ONIA Core.

La distribucion sera simultanea y controlada:

- GestiOS: primera implementacion empresarial.
- DentalGest: adaptacion clinica solo de patrones comunes.
- Ganadero OS: adaptacion separada por offline y dominio rural.

## Decision actual

ONIA Core no es inventario, ventas, caja, clinica, hato, SIAT, TR4 ni WhatsApp.
Es el sistema comun para responder:

- quien existe en la organizacion;
- quien es responsable;
- que esta pendiente;
- que evidencia existe;
- que actividad ocurrio;
- que requiere atencion gerencial.

Los rubros se resuelven con adaptadores y verticales. El core se mantiene
pequeno para que sea vendible, mantenible y reutilizable.
