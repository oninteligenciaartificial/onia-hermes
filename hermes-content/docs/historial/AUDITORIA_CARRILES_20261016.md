# Auditoría de carriles · 16-oct-2026 (foto del día, no es fuente de verdad)

Pedido: orden vigente de Sergio Urcullo (16-oct), punto 6. Meta: Bs 3.000 de caja al 31-oct.
Evidencia: `git log origin/main`, PRs abiertos de ambos repos y las colas de `cola/loop/` (ramas incluidas), leídos el 16-oct 21:15 UTC.
Límite: no pude ver las rutinas horarias (:17, :27, :47, :57), solo lo que dejaron en GitHub.

## Tabla

| Carril | Qué hizo (medido) | ¿Sirve a los Bs 3.000? | Qué cortar |
|---|---|---|---|
| Plataforma | Master de onia-platform llegó al pulido 12; 9 de 12 puntos de la cola ya mergeados. Abiertos y listos: términos (#124), K1 (#132), IP por Cloudflare (#154, CI verde), widget (#140, falta infra). La gracia de 7 días del cobro (#113) tiene conflicto en 11 archivos y no se mergea desde el 6-oct. | **Sí, es el único que cobra.** Pero el trabajo va a pulidos 11, 12, 13 de pantallas mientras el cobro lleva 10 días parado. | Congelar pulidos (#184) y la cadena web guiada (#168, #170, #198, #200: 4 PRs de un generador de webs que falla el test de tres preguntas). Orden: #113, #124, #132, #154, cada uno con revisión (Codex/QA) antes de mergear → publicar → demo dental. |
| QA y publicador | 32 commits el 16-oct, casi todos «E##» horarios: reseñas de PRs de Plataforma y verificación de cada publicación (E34 a E67). Mergeó #194, #203, #205 y #208. | Indirecto: evita publicar roto. Pero 1 commit de log por hora sin cambio es ruido y no acerca la caja. | Escribir «E##» solo si hay PR o publicación nueva. Que revise y mergee lo que hoy nadie mergea (#172, #191, #207). |
| Marca personal | Parada desde el 11-oct. Su cola real vive en #172 (84 commits delante de main, último el 15-oct), no en main. K2 v3 salió el 15-oct 20:00 UTC con 3 afirmaciones sin respaldo; K6 v2 estaba agendado hoy 20:00 UTC (no verifiqué si salió) y su reemplazo v3 espera un sí. Ya pasaron sin publicar N06, DD-A, N07 y S2-D07-A. | Débil hoy: no hay oferta ni cobro detrás de las piezas. Sirve cuando alimente el funnel de workshops (hilo aparte). | Dejar de agendar carruseles sobre herramientas. Prioridad: corregir K2/K6 y reordenar el calendario; después solo piezas con CTA a la asesoría o workshop. |
| Lucía | Parada desde el 11-oct. Su cola real vive en #144 (158 commits delante, 60 detrás de main, último el 11-oct). Cuatro re-cortes «LISTA PARA MOSTRAR», sin voz y sin publicar. Gastó 86,5 créditos el 8-oct. Saldo hoy 438,17. Token de Instagram vence entre el 13 y el 18-oct (estimado). | **No.** Influencer IA falla el test de tres preguntas de la estrategia. Sergio Urcullo pidió practicar Higgsfield, no producir. | Cero piezas nuevas, cero video, cero voz. Solo la práctica de imagen (tarea escrita en `lucia.md`). |
| Ventas y pauta | Es el carril alineado con la meta. #207 (hoy): prepago anual, 7 leads de agosto con mensaje de usted y plan anual, prospectos re-leídos en la Biblioteca el 16-oct, guion de webinar de 45 min. #191: campaña prueba 1 con 5 réplicas; el go/no-go del 13-oct dio NO-GO (0 de 9 filas en verde). | **Sí, el más directo.** Los 7 leads y el webinar son caja sin gastar en pauta. | Pausar la pauta pagada (falta tarjeta, cuenta demo y G-05) y el VSL. Por ahora solo preparar: los mensajes a leads quedan listos y NO se envían (instrucción de Sergio Urcullo del 16-oct). |

## Por qué lucia.md y marca-personal.md no tienen commits desde el 9-oct

1. **Trabajan en ramas que nunca llegan a main.** Lucía en #144 y Marca en #172 son borradores abiertos; sus colas actualizadas están ahí. `main` solo tiene la versión del 9-oct. Cualquier lector de `main` ve dos colas congeladas aunque el trabajo exista. (Plataforma lo vio igual: «main quedó en el 10-oct».)
2. **Las dos madres cayeron por el tope semanal del 12 al 15-oct** (lo dice la cola de Marca). Las dos colas esperaban de la madre el «ok cortes» y el «mostrada, publicá». Sin ese mensaje, nada avanza.
3. **Regla de freno del 10-oct** («mostrame antes de subir o hacer Lucía»), solo escrita en la rama #144: ni publicar ni generar sin visto bueno. Con la madre caída, la rutina solo podía anotar «sin novedad». Marca acumuló unos 90 latidos así.
4. **Nadie mergea esos PR:** QA mergea lo suyo y lo de Plataforma; #144, #172 y #191 suman 285 commits sin revisar.
Conclusión: la rutina corría, pero estaba bloqueada por un permiso que nadie podía dar y sus resultados no se veían en `main`.

## Tareas propuestas para las otras colas (no las toqué)

- **Plataforma:** (1) pasar #124, #132 y #154 por revisión (Codex/QA), mergear con CI verde y publicar; (2) rebasar #113 sobre master con suite completa; (3) refrescar la demo dental y sacar C1–C7. Pausar #168/#170/#184.
- **QA:** (1) revisar y mergear #207 (ventas, solo docs); (2) revisar #172 y #191 para que Marca y Ventas vuelvan a `main`; (3) Q2 ya no está bloqueada: #194 se mergeó hoy.
- **Marca:** (1) K2/K6: decidir con Sergio Urcullo la aclaración; (2) reordenar `ORDEN-DE-POSTEO` con lo que ya pasó; (3) rebasar #172 sobre main antes de cualquier pieza nueva.
- **Ventas:** (1) dejar listos para copiar los 7 mensajes de #207; (2) fijar fecha y link del webinar; (3) calcular cuántos prepagos anuales hacen Bs 3.000 leyendo `subscription-plans.ts` (no lo calculé aquí).

## Qué aprendió esta auditoría
Una cola que se trabaja en una rama sin mergear es invisible para `main`: antes de dar un carril por parado, mirar su rama. Y una regla de «mostrame antes» sin quien responda frena el carril entero.

## Actualización 16-oct, noche (respuesta de Sergio Urcullo)
- «Mostrame antes de subir» aplica a las **piezas y los planes**, no a practicar: él los revisa y se controla calidad juntos.
- **Lucía es autónoma** hasta que se vea que trabaja bien. La práctica de `lucia.md` ya no espera «mostrada, publicá».
- Por ahora no se manda nada a leads ni terceros: Ventas desarrolla, no envía.
