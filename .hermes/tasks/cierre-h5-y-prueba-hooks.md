# Cierre puntual H5 y prueba funcional de herramientas

24-oct-2026 · tarea `task_88f30eb14de4` · dispatch `ctx_c11b6a6f7776`.

**H5 RESUELTO. APROBADO BORRADOR PRIVADO**, conservando los límites del dictamen `.hermes/tasks/paquete-produccion-final-verificacion.md`. Los otros seis hallazgos no se revisaron de nuevo. No autoriza publicación, apertura comercial ni gasto; fuentes Meta, elegibilidad operativa, ensayo hablado y prueba con participantes conservan sus límites anteriores.

**Integridad:** los 13 archivos coinciden en SHA-256 y bytes con `.hermes/tasks/paquete-produccion-h5-final-snapshot.json`, correspondiente a Claude `task_a8fcccdf02c3`, cierre `msg_0605e72cb30d`. Hash de `WORKSHOP-MATERIAL.md`: `8c4bec4cbfcf3b307024829e5518373decb53fc52216f5b40f123c04617c599b`; hash de `pruebas/cuentas_workshop.py`: `6f8f4475949636ad9323965d2ea5307aba332e4d90bb4f4e5a4b0cd1ac7ea628`. No se editó el paquete.

**Lectura acotada:** `WORKSHOP-MATERIAL.md` §7, líneas178–188, y el script corregido. Tabla y función ahora evalúan en el mismo orden: 0 si hay hasta dos concretas o mayoría vaga; si no, 2 para cinco a ocho tareas todas concretas; 1 para el resto. La definición residual de 1 evita solapes; la igualdad entre vagas y concretas no cuenta como mayoría vaga.

**Ejecución propia:** `python -B cuentas_workshop.py` terminó en «OK: todas las aserciones pasan», exit0, incluida concordancia de los 120 pares con tres predicados disjuntos. Después ejecuté por separado las dos llamadas importando el módulo con `python -B -c`, exit0:

```text
(8,3) -> 0
(9,3) -> 0
```

El residual concreto del dictamen anterior queda cerrado. Son comprobaciones de rúbrica/lógica; no un ensayo con participantes ni ejecución del prompt por un modelo externo.

**Hooks:** se ejercitaron comandos mediante `exec_command` y esta escritura mediante `apply_patch` en la misma sesión retomada. El éxito de las herramientas no acredita por sí mismo ejecución, carga ni salud de PreToolUse/PostToolUse/Impeccable. Hermes observa los avisos y resultados en la UI, incluidos los que aparezcan después del cierre; no afirmo ausencia de errores por no recibirlos en la API. No cambié configuración, permisos globales ni hooks y no reinicié la sesión. La aprobación del contenido privado y la comprobación de salud de hooks son resultados separados.
