# Agenda del día por profesional (PR #118) — para el OK de Sergio Urcullo

Capturas de 390 y 1440 px del banco `/dev/agenda/dia`, con datos de ejemplo y el componente real (`AgendaDia`) dentro del shell.
Letra de la marca (Instrument Sans) verificada en cada captura. Pantalla nueva: vista del día con una columna por profesional, para recepción.

**PR #118** · código en `478563dc` · cambios de banco en `wip/cap118`: `138d67ee` (nombre del plan) y `8ca49017` (datos de ejemplo y Confirmar activo en el banco).

Qué mirar, en este orden:
1. `agenda-dia-varios-profesionales-*.png`: tres columnas (Dra. Ana Aramayo, Dr. Luis Vargas, Sin profesional), citas en los cinco estados, el horario y el descanso de Ana en el encabezado, y el aviso «Coincide con otra cita de este profesional» (Lucía 09:00 y Jorge 09:30).
2. `agenda-dia-un-profesional-*.png`: filtro Profesional = Dra. Ana. En celular es la forma de ver a un solo profesional sin desplazar de lado.
3. `agenda-dia-doctor-mi-agenda-*.png`: lo que ve un doctor («Mi agenda»).
4. `agenda-dia-confirmar-hecho-*.png`: después de «Confirmar» a Lucía, la cita pasa a Confirmada y el botón desaparece.
5. `agenda-dia-solo-lectura-*.png` (sin Confirmar), `agenda-dia-error-al-guardar-*.png` y `agenda-dia-dia-vacio-*.png`.

Datos de ejemplo: martes 06/10/2026, 8:00 hora de La Paz; 7 citas; nombres inventados.

Lo raro que se ve en el producto (no lo arreglé):
- Celular, «Todos los profesionales»: se ve una sola columna y las demás exigen desplazar de lado, sin otra pista que el borde cortado; además quedan filas altas en blanco (11:00, 15:30) donde la primera profesional no tiene cita (`agenda-dia-varios-profesionales-390.png`).
- «Hora del negocio: America/La_Paz.» muestra el nombre técnico de la zona, en todas las capturas.
- «Cancelada» y «No asistió» salen como texto gris sin la pastilla de color que sí tienen Pendiente, Confirmada y Completada (`agenda-dia-varios-profesionales-1440.png`).
- Día vacío: sigue dibujando la tabla con sólo la primera profesional arriba del «No hay citas…» (`agenda-dia-dia-vacio-390.png`).
- Del shell, no de este PR: la barra del asistente dice «Preguntá por tu negocio» (de vos). Está en `components/ayuda/BarraAsistente.tsx`, líneas 116 y 121; se ve en todas las capturas de 1440.
- Consola: sólo ruido del banco (websocket a `localhost:59999` bloqueado y un 401 del shell sin sesión); nada propio de la pantalla.

Con el OK: Plataforma sigue con CI, merge y publicación; después se MIRA en producción.
