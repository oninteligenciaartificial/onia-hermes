# Revisión C5 — 2026-10-06

META: permisos/tenant, horarios, día/mes, filtros, solapes, zona, duración y confirmación.
PRUEBA DE HECHO: delta completo inspeccionado; pruebas focales y reproducciones externas.
REGLA DE PARADA: revisión única sin cambios productivos.

SHA aa9f740c67511d52bea193f6dc2a2f2f8ffa7c76, base5102535cdd2823c4d6365fdc459e3c1a04161431, PR118.

## Dictamen: requiere corrección

[P2] lib/agenda/vista-dia.ts:49 compara getUTCDay directamente con DoctorSchedule.dayOfWeek. JS usa domingo0; schema.prisma:1206 y availability/route.ts:100-102 usan lunes0. Lunes5oct con jornada guardada0 muestra «Sin horario declarado» y el horario se desplaza de día. Convertir con (jsDay+6)%7 y corregir fixtures; cubrir lunes/domingo.

[P2] lib/agenda/vista-dia.ts:4-9,21-26 y app/(dashboard)/appointments/page.tsx:89-90 omiten active. DoctorSchedule.active=false representa jornada desactivada; booking/slots:71 y appointments/availability:114 la rechazan. La proyección la convierte en horario normal y UI imprime el rango sin indicar inactividad. Seleccionar/proyectar active y excluir o etiquetar jornadas inactivas tanto SSR como fallback API; conservar al profesional si corresponde aunque no tenga jornada activa. No basta corregir el día.

## Evidencia

- 14/14 PASS en vista-dia, AgendaDia.render y dia-por-profesional.
- Dos reproducciones independientes fallan: lunes0 no aparece el lunes; fila active=false aparece como jornada. Archivos fuera del worktree en E:/ONIA-Codex/cierre-1.0-20261006/qa-c5-review. Segundo caso aísla active usando el índice actual; tras corregir mapeo debe ajustarse el día del fixture, conservando expectativa de no mostrar jornada desactivada.
- HEAD exacto/árbol limpio y diffcheck PASS.
- No repetí101 tests ni ejecuté build/types global; Prisma local desactualizado queda para CI. Sin BD real/QA visual propia.

## Lo revisado sin nuevo hallazgo

- Consulta SSR de horarios filtrada por tenant y doctorId para DOCTOR, select acotado. listarCitas permanece como fuente de citas; helper restringe columnas y citas de DOCTOR también ante filtro ajeno.
- Día civil y horas usan zona negocio; duración deriva de timestamps, fin cruzando medianoche marcado. Solapes comparan intervalos de citas no cerradas del día aun si estado filtra la otra; no se ocultan tarjetas.
- Vista presenta horas de inicio, no una grilla de reservas; texto explícito dice que vacíos no indican disponibilidad. No certificar huecos disponibles.
- Confirmación visible sólo con permiso y ofreceConfirmar; reutiliza PATCH de estado, rollback/error existentes. El nuevo componente no muestra motivo/notas; los detalles siguen el flujo previo.
- /dev/agenda mensual conservado y nueva fixture diaria con guard NODE_ENV development estricto. Sin nuevas APIs/schema.
- Frente único de revisión técnica/seguridad. No fanout ni modificaciones producto/bancos/deps.

QA visual de Madre es independiente y no elimina los dos defectos del contrato de horarios. Requiere nuevo SHA con pruebas focales antes de favorable. CI y compilación del SHA final quedan como gates; no se consultaron runs.

## Cierre incremental de los dos P2

SHA27d47f989bc0e7090fbef0f51f89faec5d49dcff frente aa9f740c: FAVORABLE; ambos P2 cerrados.
Conversión explícita lunes0/domingo6 correcta; active seleccionado en SSR, preservado en helper compartido con fallback y filtrado estrictamente atrue. Columna del profesional conservada y texto aclara ausencia de jornada activa.
Reproducciones propias originales adaptadas al nuevo contrato (active=true para lunes y martes1 para inactive):2/2PASS. Regresiones lunes/domingo/inactive del autor:2/2PASS. Sin repetir14/103. DiffcheckPASS y árbol limpio. Dictamen limitado al delta; QA visual y CI del SHA final conservan gates.
