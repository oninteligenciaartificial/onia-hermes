# Handoff — plataforma-1-0-banco (hilo sin red a producción, 16-oct-2026)

Retoma el hilo nuevo (rama `claude/plataforma-1-0-banco-v2`, entorno «Onia» con la llave del servidor).

1. **Objetivo:** dejar operativa la 1.0 para el banco: cerrar el checklist `hermes-content/docs/ONIA_1.0_CORTE.md`
   (solo está en la rama `claude/optimistic-ride-1sp5fe`, no en `main`), probar los 5 rubros con cuentas ZZ QA y dejar lista la demo dental.
2. **En producción:** nada de este hilo.
3. **A medias:** no se ejecutó ninguna prueba. `app.onia.com.bo` y `onia.com.bo` dan 403 en este entorno y no hay llave SSH.
   Está listo el guion: `hermes-content/docs/platform/ONIA_1.0_QA_5_RUBROS_Y_DEMO.md` (recorrido por rubro, tabla de resultados, demo de 6 min). PR en borrador #211.
4. **Archivos:** el guion de arriba y este handoff. Lista de competencia: `/mnt/project-files/competencia/FUNCIONES_PARA_LA_1_0.md`.
5. **Intentos fallidos:** curl a app.onia.com.bo y onia.com.bo (proxy 403); `~/.ssh` vacío; sin `cloudflared`.
   Verificado en código: el arreglo de «tratamiento a medias» (commit `f47b45b` en onia-platform) existe; falta mirarlo en producción.
6. **Depende de Sergio Urcullo:** depósito del respaldo, términos 1.4 con Leslie Mercado Moreno, aprobar el pago de prueba, SQL del B22.
7. **Próximos pasos:** ejecutar el guion con cuentas ZZ QA y capturas 390/1440; arreglar lo roto; refrescar la demo
   (`seed-demo.sql reset=2` entre 00:00 y 07:00 La Paz); confirmar la plantilla precargada por rubro (comercio, servicios, importadora).
   No tocar los frentes del latido de Plataforma (gracia 7 días, términos, cobro) ni `plataforma.md`.

## Actualización 17-oct-2026 (hilo v2)

- **onia-platform #185 (semilla por rubro):** Codex P1 y 3 P2 corregidos (18527f1, 184926c, 008211e). Último hallazgo P2 **sin arreglar a propósito**:
  el aviso de la semilla no se lee si el dueño completa precios por Catálogo/Tratamientos (`PATCH /api/comercio/products/[id]` y
  `PATCH /api/treatments/[id]` no reevalúan la notificación). Va en un PR aparte, la madre lo aprobó como seguimiento.
- **Sigue bloqueado:** recorrer los 5 rubros en producción hasta que la sesión de control en la PC cree y anuncie las cuentas ZZ QA.
- **Recuperación de contraseña:** causa de raíz es configuración de producción no aplicada (no es código); lo decide la jefa con Sergio Urcullo.
- **Idea de cobro (baja prioridad, sin decidir):** pasarela boliviana que genera un QR por pedido y marca pagado sola (la «de Guilherme», no identificada; candidata sin verificar: Livees Checkout), junto al trámite de la API QR del BCP / OpenBCB. «Sin NIT» no está confirmado por ninguna fuente. Resumen con fuentes: `/mnt/project-files/plataforma/COBRO_QR_PASARELAS_BOLIVIA.md`. Sin contacto con terceros ni gasto.
