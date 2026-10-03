# Lucía · Semana 1 — guiones de los reels

> ⛔ **Reemplazado el 2-oct por [`PLAN.md`](PLAN.md).** L05 y L08 no se publican (clips de lifestyle vendiendo sin pantalla real); sus ideas pasan a la serie «8:00 en la recepción». Historia del 1-oct.


Mismo formato que la marca personal ([`../plan-3-semanas/BRIEF-ESCRITOR.md`](../plan-3-semanas/BRIEF-ESCRITOR.md)).
Piezas y estado: [`S1-PIEZAS.md`](S1-PIEZAS.md). **Se editan con la skill `editor-videos`** (método
Santiago): Higgsfield solo genera el clip; montaje, apoyos, karaoke, SFX y master son de la skill.
Instrucción completa de cada pieza (objetivo, material, estilo, comandos): `videos/lucia-lNN/INSTRUCCION.md`.

Reglas de toda pieza de Lucía: habla en **primera persona** (es su cuenta); declara que es IA en la
primera exposición; lo que vende muestra **pantalla REAL** de Onia y solo funciones vivas; nunca
testimonio; el texto nunca va sobre la cara. Lo que se dice va en texto corrido; las líneas
**Evidencia** y **Storyboard** son para el editor.

---

### L02 · Reel b-roll + texto · Este video no fue grabado
**Fórmula:** revelación → contraste → acción · **Pilar:** personaje (transparencia IA) · **Destino:** seguir la cuenta
**Evidencia:** clip Kling `1d2b5631` (generado, nunca filmado) · `LUCIA.md` §1 (etiqueta IA obligatoria)
**Plano:** `videos/lucia-l02/raw/l02-calle-kling-1d2b5631.mp4` (6 s, calle a la hora dorada, mira a cámara al final)
**Storyboard (sin voz: el texto ES la narración; ≤ 6 palabras por tarjeta, ≥ 0,35 s por palabra):** tarjeta «Este video
no fue grabado.» (0,10–2,15) → tarjeta «No existo. **Soy IA.**» (2,15–3,95) → sello «SEGUIME.» (3,95–fin)

Este video no fue grabado.
No existo. Soy IA.
Seguime.

**Pie:** Lucía es un personaje hecho con IA por @oniahq. No existo, pero lo que te muestro sí funciona: sistemas que
trabajan solos para tu negocio. Seguime.

> Cambios contra la versión del 1-oct (placas PIL): primera persona (es la cuenta de Lucía; L01 ya habla así) y la
> promesa «Y aun así te voy a mostrar cosas que sí funcionan» pasa al pie: eran 11 palabras en 1,9 s, ilegibles.

### L05 · Reel b-roll + texto · Lunes: cero llamadas para agendar
**Fórmula:** pregunta-dolor → respuesta en una palabra → mecanismo · **Pilar:** vende Onia (link de reserva) · **Destino:** link de la bio
**Evidencia:** `ONIA_CATALOGO_DE_VENTA.md` §2 (link de reserva online en los rubros con agenda; agenda pública incluida desde Crece) ·
`ONIA_ADQUISICION_Y_PAUTA.md` §5.4 («el link para que el paciente reserve solo», prometible hoy)
**Plano:** `videos/lucia-l05/raw/l05-coworking-kling-07b938b2.mp4` (6 s, coworking, levanta la vista y sonríe)
**Storyboard (sin voz):** rótulo IA + tarjeta «LUNES» · «¿Cuántas llamadas para agendar?» (0,10–1,95) → tarjeta «Con un
link de reserva:» + sello «cero.» (1,95–4,10) → tarjeta «Tu cliente elige horario.» (4,10–fin) · **[captura REAL del
link de reserva: pendiente — hoy no hay cuenta demo en producción]**

Lunes. ¿Cuántas llamadas para agendar?
Con un link de reserva: cero.
Tu cliente elige horario.

**Pie:** Lucía es un personaje hecho con IA por @oniahq. Con el link de reserva de Onia, tu cliente elige el horario solo y
la cita aparece en tu agenda. Cero llamadas para agendar. Link en la bio.
Link: `https://onia.com.bo/?utm_source=instagram&utm_medium=organico&utm_campaign=lucia-l05`

### L08 · Reel b-roll + voz · ¿Cuántos pacientes se olvidan de su cita?
**Fórmula:** pregunta-dolor → mecanismo → remate · **Pilar:** vende Onia (recordatorios automáticos) · **Destino:** link de la bio
**Evidencia:** `ONIA_CATALOGO_DE_VENTA.md` §2 «Trabaja solo» (recordatorio de cita por correo 24 h y 2 h antes, crontab
diario) · `ONIA_ADQUISICION_Y_PAUTA.md` §5.4 (recordatorios 24 h y 2 h con botón para confirmar o cancelar)
**Plano:** `videos/lucia-l08/raw/l08-cafe-kling-f79eb10e.mp4` (10 s, café; levanta la vista a cámara a los ~8,9 s)
**Voz:** Marcela (`86V9x9hrQds83qf7zaGn`), **ajustes por defecto de la voz** (regla de `tts-elevenlabs.mjs`, 21-ago). El
remate va en toma aparte con `previous_text`: la primera toma subía en «dedo» y sonaba a pregunta.
**Storyboard en palabras** (clip recortado 0,40 s al inicio; voz a 0,10 s): rótulo IA desde el cuadro 0 · karaoke hasta
«manda» · «correo» → panel «Recordatorio automático por correo» (el karaoke se apaga) · «día» → fila «−24 h» · «horas» →
fila «−2 h» · «antes.» → «Confirmar / Cancelar en el mismo correo» (el dato que la voz no dice) · «Vos» → sello «NO MOVÉS
UN DEDO.» con golpe de zoom y ken 1,00→1,04 mientras mira a cámara. **Captura REAL del correo: pendiente** (hoy no hay
cuenta demo en producción); el panel es un diagrama del mecanismo, no una pantalla.

¿Cuántos pacientes se olvidan de su cita?
El sistema les manda un correo un día antes y otro dos horas antes.
Vos no movés un dedo.

**Pie:** Lucía es un personaje hecho con IA por @oniahq. Onia le recuerda la cita a cada paciente por correo: un día antes
y dos horas antes, con un botón para confirmar o cancelar. Vos no movés un dedo. Link en la bio.
Link: `https://onia.com.bo/?utm_source=instagram&utm_medium=organico&utm_campaign=lucia-l08`
