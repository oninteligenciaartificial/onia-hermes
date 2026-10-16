# C5b · Agenda del día: arreglos antes del OK de Sergio Urcullo

Sos Codex. Trabajás SOLO en `onia-platform`, rama `codex/c5-agenda-dia-20261006` (la del PR #118, head `478563dc`).
- Primero `git branch --show-current`. Después `git merge origin/master` (no rebase: el PR ya está publicado como rama).
- Aplicá el banco de las capturas: `git am hermes-content/docs/cola/capturas-agenda-dia/banco.patch` (vive en `onia-hermes`;
  2 commits: nombre del plan y datos de ejemplo). Si no aplica limpio, copiá a mano solo `app/dev/**`.
- Nadie contesta preguntas mientras corrés: lo que no puedas decidir, al resumen.

## META
Las capturas (`hermes-content/docs/cola/capturas-agenda-dia/`, en `onia-hermes`) muestran 4 fallas de la vista del día.
Se arreglan ANTES de mostrarle la pantalla a Sergio Urcullo.

## Fallas y lo que se espera
1. **Celular (390 px), «Todos los profesionales»**: hoy se ve una columna y las demás piden desplazar de lado sin pista.
   Esperado: debajo de 640 px, la vista del día muestra **un profesional a la vez** con un selector visible arriba
   (pastillas o `<select>` con el nombre y la cantidad de citas de cada uno) y arranca en el primero que tenga citas.
   Nada de scroll lateral de página.
2. **Filas altas en blanco** (11:00, 15:30 en la primera columna): las franjas sin cita de ese profesional no ocupan
   alto de cita. Esperado: una línea fina con la hora, o nada; la columna no estira filas por las citas de otra columna.
3. **«Hora del negocio: America/La_Paz.»** muestra el nombre técnico. Esperado: nombre legible con `Intl`
   (`timeZoneName: 'long'`, locale `es-BO` → «hora de Bolivia»), o se quita la línea si es la misma zona que el navegador.
4. **«Cancelada» y «No asistió»** salen como texto gris sin pastilla. Esperado: pastilla igual que los otros tres estados,
   con los tokens de color que ya usa la agenda semanal para esos estados (buscá en `components/agenda/`; no inventes colores).
5. **Día vacío**: dibuja la tabla con la primera profesional y abajo «No hay citas…». Esperado: solo el estado vacío,
   sin columnas.

## PRUEBA DE HECHO
- Tests de `lib/agenda/vista-dia.ts` para: elegir el primer profesional con citas, filas vacías no reservan alto,
  día vacío sin columnas, nombre de zona legible.
- Capturas 390 y 1440 de `/dev/agenda/dia` (todos los casos del banco) en `docs/capturas/c5b/`, abiertas y MIRADAS.
  En 390: `document.documentElement.scrollWidth <= 390` (escribilo en el resumen).
- `npx tsc --noEmit` 0 · eslint de lo tocado 0 · `npx vitest run` completo verde.

## REGLA DE PARADA
- Tocás solo: `components/agenda/AgendaDia.tsx`, `lib/agenda/vista-dia.ts`, sus tests, `app/dev/agenda/**`,
  y `app/(dashboard)/appointments/AgendaClient.tsx` solo si el selector de celular lo exige.
- **No toques** `app/globals.css` (otra tarea, C6c), ni `lib/realtime/**`, ni nada de WhatsApp/recordatorios
  (Plataforma está cambiando el envío por cita en `app/api/appointments/**` y `lib/whatsapp*`).
- Textos de usted («Elija un profesional», no «Elegí»). Vocabulario del rubro desde `lib/onboarding/vocabulario.ts`.
- No cambies datos, API ni permisos: es presentación.

## Entrega
Commits conventional en castellano con el porqué, push a la misma rama (actualiza el PR #118). Resumen: SHAs, números de
tsc/eslint/vitest, el `scrollWidth` medido y la lista de capturas.
