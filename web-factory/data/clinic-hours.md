# Horarios confirmados en la plantilla dental

`business.hours` del intake se conserva, sin espacios exteriores, en el campo opcional `contacto.horario` del perfil. El generador existente `generateSite(..., { template: "landing-clinic" })` muestra ese dato en el contacto del footer. Escapa HTML antes de convertir saltos de línea a `<br>`.

Cuando falta el horario o contiene sólo espacios, el perfil generado no añade el campo y la página no inventa horarios ni muestra un aviso de obra. `getMissingClientInputs` y el contexto de revisión solicitan «horarios de atención confirmados» para `landing-clinic`. Los perfiles anteriores siguen siendo válidos. Otros templates no activan la opción del footer.

Validación focal desde `web-factory`:

```sh
pnpm exec vitest run data/clinic-hours.test.ts data/intake-schema.test.ts data/schema.test.ts generate/generate.test.ts packages/templates/src/clinic-css.test.ts
```

La regresión usa datos ficticios y el recorrido real intake → perfil serializado → carga por generador → HTML. Comprueba cambios de horario, ausencia, escape de HTML, datos de contacto/servicio conservados y compatibilidad del footer compartido. No utiliza AI ni servicios externos.

Este cambio cierra la pérdida del horario en el motor. No implementa el puente de datos/aprobación entre Platform y Web Factory: ese contrato sigue pendiente. No cambia oferta, precios, permisos ni publicación. El horario debe provenir del negocio y confirmarse en la revisión del contenido; el motor no verifica su veracidad.
