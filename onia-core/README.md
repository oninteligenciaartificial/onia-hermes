# ONIA Core

Estado: fuente canonica en construccion.
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
- `ONIA_CORE_DISTRIBUTION_PLAN_2026.md`: plan para subir ONIA Core a los
  sistemas cuando este listo.

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
