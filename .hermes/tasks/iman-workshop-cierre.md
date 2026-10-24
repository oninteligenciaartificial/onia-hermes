# Cierre del ciclo autorizado — Iman / workshop

## Resultado

**Aprobado por Codex únicamente como borrador privado parcial**, tras su revisión independiente y una sola corrección de Claude. No es investigación audiovisual completa ni autorización de publicación o reapertura de ventas. Hermes verificó la evidencia y los hashes de la versión exacta.

Entrega: `hermes-content/research/iman-workshop-20261022/APLICACION-WORKSHOP.md`, `fuentes.json` v2 y `evidencia/`; ampliación en `hermes-content/references/video-intake/2026-10-20-gadzhi-vender-valor-psicologia.md`.

Contiene posicionamiento, pitch, cierre de clase gratuita, tres reels, tres historias, conversación WhatsApp, arquitectura/wireframe de landing, secuencia relativa, trazabilidad y doce dimensiones. Son propuestas privadas en voseo; oferta canónica y venta pausada preservadas.

## Prueba

- Investigación Claude: task_1a0480e62c5a / ctx_14da05160203; worker_done msg_6a2c0760bffb aceptado.
- Revisión independiente Codex: task_225aaffaeac2 / ctx_cdae6c488e2f. Dictamen inicial cambios necesarios; `.hermes/tasks/iman-workshop-revision-codex.md` conserva hallazgos y alcance.
- Corrección única Claude: task_9b688a571671 / ctx_a8219514a14e; worker_done msg_893c8cada289 aceptado.
- Verificación puntual Codex: task_fcfe88f0ce3c / ctx_23e51300f0ea. Pantalla final «Worked for 42s», 2:54 PM; recibo nativo completo en `.hermes/tasks/iman-workshop-verificacion-codex.json`.
- Codex verificó los 19 hashes y observó las 16 capturas. Hermes recalculó al cierre: **19 archivos, cero diferencias con el snapshot final**; 14 URLs únicas, 7 registros observados y 7 parciales, seis piezas con cobertura explícita. Esto no convierte los metadatos en videos vistos.
- Solo cambiaron tres documentos entre snapshots; las 16 capturas permanecieron idénticas. La parte histórica de la ficha coincide con la canónica y TALLER_31_OCT coincide byte a byte con el canon.
- Versiones exactas: `iman-workshop-review-snapshot.json` (inicial), `iman-workshop-final-snapshot.json` (después de corrección), ambos bajo `.hermes/tasks/`.

## Cuatro hallazgos verificados por Codex

1. Cadena hacia pago y supuesta reescritura del CTA: ahora inferencias; generalización limitada a la muestra.
2. DOM/CSS: resuelto mediante limitación explícita; extractos no conservados, lecturas reportadas por Claude, no verificadas independientemente.
3. Hook del tráiler: no observado; tiempos reportados, no visibles en capturas.
4. CTA: «Link en mi perfil» → /auditoria → WhatsApp → QR.

También quedaron aclarados campos no observados, cierre 29-oct 20:00 La Paz sin desplazamiento automático, contenido/pausa y tramos por acreditación.

## Límites y bloqueo técnico

- Móvil, formularios, reels de Instagram, observación audiovisual profunda y DOM/CSS sin extractos siguen sin verificarse. TikTok no tuvo cuenta oficial confirmada. No se eludieron login, paywall ni el HTTP 429 reportado por Claude.
- Codex señaló un residual editorial: etiquetas OBS abreviadas y texto anterior «ya fue actualizada» en S14 seguido de corrección explícita a inferencia. Su aprobación exige leerlo bajo las limitaciones generales; no son hechos certificados. No se abrió otra corrección.
- **Lifecycle Codex bloqueado**, distinto de la revisión efectiva: su shell no dispone del ejecutable Orca según los intentos previos. No se alteraron permisos, hooks, PATH ni transporte. Los dictámenes se verificaron en terminal; después de probar final de turno sin worker_done, los Dispatches se fenced con worker-abandon, sin detener procesos. Las tareas nativas de revisión/verificación quedan blocked con resultado explícito, no completed falso.
- Terminales originales conservadas; no nuevas sesiones, Run ni cola. La sesión responsable es term_5bfc100b-1df4-450e-8b0b-b80948e75c77, vinculada por run-use a run_66e1d03c2397, consumer_generation 2.
- Pantalla de Hermes mostró 160k/272k de contexto (valores redondeados de UI, ~58,8 % calculado), junto con aviso «compacting». No se interpreta el aviso como medición de precisión ni se modifica configuración.
- Sin Git, publicación, instalaciones ni ampliación de permisos. Los demás pendientes quedan intactos. El ciclo autorizado termina aquí; publicar o reabrir ventas conserva las decisiones de Sergio y compuertas canónicas.
