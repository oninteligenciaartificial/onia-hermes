# Orden de posteo · domingo 11 → sábado 17 de octubre (calendario único)

Actualizado el 11-oct, ~09:35 UTC (05:35 La Paz; los cinco borradores de video están listos), por Marca personal, que desde hoy (orden de la MADRE MARKETING a pedido de Sergio Urcullo) lleva la edición y el posteo de punta a punta. Reglas fijas del día y qué sale en cada red: `CALENDARIO-PUBLICACION-9-16-OCT.md` (no se copian). **Nada se agenda ni se publica sin «mostrada, publicá <pieza>» de la madre.**

**Camino de cada video:** corte listo (tabla + preview 360p) → **«ok cortes»** de Sergio Urcullo (lo pasa la madre) → master con molde, subtítulos y regla 15 → «LISTA PARA MOSTRAR: <pieza> (master)» → **«mostrada, publicá <pieza>»** → Marca agenda en el VPS (`agendar-publicacion.sh`: `ig-reel.mjs` para IG, `buffer-post.mjs` para TikTok, Shorts y LinkedIn) → «PUBLICADO: <pieza> — <link>».

## Hora de cada red (La Paz · UTC = La Paz + 4)

| Bloque | Instagram | TikTok · Shorts · LinkedIn |
|---|---|---|
| Video A | 12:30 · 16:30 UTC (`ig-reel.mjs`) | 12:35 · 16:35 UTC (Buffer) |
| Yap de A | 13:30 · 17:30 UTC (Trial) | 13:35 · 17:35 UTC (TikTok y Shorts; LinkedIn no) |
| Carrusel | 16:00 · 20:00 UTC (`ig-carrusel.mjs`) | 16:01 LinkedIn · 16:02 TikTok (Buffer) |
| Video B | 18:30 · 22:30 UTC | 18:35 · 22:35 UTC (Buffer) |
| Yap de B | 19:30 · 23:30 UTC (Trial) | 19:35 · 23:35 UTC (TikTok y Shorts) |

## Estados

**corte listo** = tabla de cortes + preview 360p en la rama (espera el «ok cortes») · **borrador listo** = render sobre el corte propuesto o carrusel con capturas pendientes (se rehace con un comando) · **master listo** = renderizado y mirado (espera «mostrada, publicá») · **falta editar** = bruto en Drive sin cortar · **falta grabar** = no existe el bruto · **agendada** = ya hay un timer en el servidor (no se toca).

## Calendario

| Día | Hora | Pieza | Palabra | Estado | Falta para publicar |
|---|---|---|---|---|---|
| Dom 11 | 12:30 | **N06** Gemini CLI → Antigravity (45,5 s) | — | corte listo (`88e7cd10c`) · borrador listo (`fbad86d1c`) · `videos/marca-personal/2026-10-11/n06-antigravity/` | «ok cortes» y master **antes de las 15:30 UTC**; re-leer geminicli.com (el aviso acota a «Unpaid tier y Google One»). Si no llega, pasa a las 18:30 |
| Dom 11 | 16:00 | Carrusel ANTIGRAVITY (N06) | ANTIGRAVITY | agendada | **decisión de Sergio Urcullo** (la madre avisa). No se toca |
| Dom 11 | 18:30 | **DD-A** OpenAI Sol y la caché (58,4 s) | — | corte listo (`63e507548`) · borrador listo (`5dfefc8f7`) · `videos/marca-personal/2026-10-11/dd-a-openai-sol/` | «ok cortes»; **escuchar 01:01–01:09** (¿dijo «con Astra» o «con Sol»? la cuenta 400 contra 20 solo cuadra con Sol); el cierre pide la asesoría y **el link en la bio todavía no está**. Si no se resuelve antes de las 21:30 UTC, **N07 ocupa este hueco** y DD-A pasa al lun 12 12:30 |
| Lun 12 | 12:30 | **N07** Haiku 5.5 (81,7 s; salió el 7-oct, la noticia envejece) | HAIKU | corte listo (`4e751ae46`) · borrador listo (`0b55a7ff0`) · `videos/marca-personal/2026-10-11/n07-haiku-55/` | «ok cortes»; verificar contra la doc de Anthropic «5 veces más si el prompt pasa de 100 mil tokens» y «lo que piensa se cobra como salida»; aviso HAIKU existe |
| Lun 12 | 16:00 | Carrusel PRUEBAS (K4 v2) | PRUEBAS | agendada | su aviso PRUEBAS no existe |
| Lun 12 | 18:30 | **BA814C81** (tal cual, sin editar, todas las redes) | — | propuesta (nota 1) | OK de Sergio Urcullo al día y la hora; el archivo **no está compartido por enlace** |
| Mar 13 | 12:30 | **SI-01** Claude trabaja con la compu apagada | RUTINA | falta grabar | rutina creada el día anterior |
| Mar 13 | 16:00 | Carrusel PROMPT (K8 v3) | PROMPT | agendada | — |
| Mar 13 | 18:30 | **SI-02** Antes de instalar OpenClaw | OPENCLAW | falta grabar | OpenClaw en una compu aparte y el OK de Sergio Urcullo |
| Mié 14 | 12:30 | **S2-D07-A** la ventana de 24 horas (90,8 s) | — | corte listo (`f643bb188`) · borrador listo (`9fdda2023`) · `videos/marca-personal/2026-10-11/s2-d07-a-ventana-24h/` | «ok cortes»; **decisión de Sergio Urcullo sobre la frase de las variables de las plantillas** (cortarla o regrabarla; 00:57–01:04 del bruto); su cierre pide la comunidad, no la asesoría |
| Mié 14 | 16:00 | Carrusel BRIEF (K7 v2) | BRIEF | agendada · floja | su aviso BRIEF no existe |
| Mié 14 | 18:30 | **SI-03** Claude, pero vago | VAGO | falta grabar | Ponytail instalado y la prueba con y sin él |
| Jue 15 | 16:00 | Carrusel SKILL (K2 v3) | SKILL | agendada | — |
| Jue 15 | 18:30 | **N02** Sonnet 4.5 se apaga el 30-nov (111,4 s) | MIGRAR | corte listo (`26bf1e566`) · borrador listo (`90e002704`) · `videos/marca-personal/2026-10-11/n02-sonnet-45/` | «ok cortes»; «quedan 46 días» **solo vale este jueves**; bloque de 2,4 s sin transcripción (frase o ruido); aviso MIGRAR existe |
| Vie 16 | 12:30 | **SI-04** Tres comandos escondidos | SECRETOS | falta grabar | — |
| Vie 16 | 16:00 | Carrusel PROMESA (K6 v2) | PROMESA | agendada | — |
| Vie 16 | 18:30 | **SI-08** Un video que escribió Claude | HYPERFRAMES | falta grabar | clip de 3 s hecho con HyperFrames |
| Sáb 17 | 16:00 | Carrusel P2 «7 herramientas. 4 son gratis.» | HERRAMIENTAS | borrador listo (`835cc08bd`) · `hermes-content/carousels/out/sergio-p2-siete-herramientas-20261017-borrador/` | OK de Sergio Urcullo a la lámina 6 (sin él, plan B); capturas 2, 3, 5 y 6 desde la PC; aviso HERRAMIENTAS pegado |

- **Yaps:** cada video lleva su yap una hora después (13:30 / 19:30), en IG Trial, TikTok y Shorts. Se agendan con el video, cuando está mostrado. N06, DD-A y S2-D07-A terminan en el CTA y no tienen yap: si el hueco hace falta, se saca un gancho distinto del mismo bruto.
- **Carruseles ya renderizados, esperando «mostrada, publicá»:** «78h en una tarea» (dom 18, CHECKLIST) y «Tics de webs con IA» (mié 21, DISEÑO, borrador). Detalle en `CALENDARIO-PUBLICACION-17-23-OCT.md`.
- **Sacado porque no se grabó:** S2-D08-A, N04, D01-C y sus dos cortes, D02-A, D01-A, D04-C, D05-A y N08, con sus yaps.
- **SI que van primero, si se graban:** SI-01, SI-02, SI-03, SI-04 y SI-08 (sin corchetes). SI-05, SI-06, SI-07, SI-10 y SI-11 esperan su medición (`MEDICIONES-SI-PC.md`); SI-09 puede ir apenas se grabe. Entran en los huecos que queden (sáb 17 12:30 y 18:30 y la semana siguiente) en ese orden.
- **Los carruseles agendados no se tocan** (regla de la madre).

**Nota 1 · BA814C81.** Raíz de Drive, 250,5 MB, creado hoy 05:05 UTC. Probado desde la nube: solo el dueño tiene acceso y la descarga por enlace devuelve la página de inicio de sesión, no el video. No sé de qué trata ni cuánto dura. A 1,2 MB/s (lo que pesan los otros cinco brutos de hoy) serían unos 3 min 30 s: **si dura más de 3 minutos no entra como Short**; se confirma con `ffprobe` al bajarlo. Propuesta: **lun 12 a las 18:30** (22:30 UTC), el primer hueco sin pieza; si es una noticia con fecha, conviene cambiarlo con N07 y ponerlo el lun 12 a las 12:30. Para agendarlo faltan dos cosas de Sergio Urcullo: que ponga el archivo en «Cualquier persona con el enlace» (yo no cambio los permisos de su Drive) y una línea de qué es, para el epígrafe. Si prefiere no compartirlo, la madre lo publica desde la PC.

## Preparar antes de grabar (lo que el teleprompter no dice)

| Guion | Qué hay que tener listo | Si no está |
|---|---|---|
| SI-01 | Una rutina creada el día anterior y lo que dejó | Se corta «Yo armé una ayer…» |
| SI-02 | OpenClaw en una compu aparte y el OK de Sergio Urcullo para instalarlo | Se cortan las tres líneas desde «La prueba: pedile que abra un archivo…» |
| SI-03 | Ponytail instalado y el mismo pedido con y sin él, con el conteo de líneas | Se graba sin la prueba y se dice «lo probé así» solo si se probó |
| SI-05 | [X] del gasto (LiteLLM) | **No se graba** |
| SI-06 | [A] y [B] de la misma respuesta con y sin caveman | Gancho de reserva y se corta «Mi prueba…» |
| SI-07 | [T] de una corrida real de barra goal | Se corta «Yo se la di…» |
| SI-08 | El clip de 3 s hecho con HyperFrames, antes de grabar | No se graba |
| SI-09 | Confirmar que /deep-research aparece en tu versión | — |
| SI-10 | [N] de una corrida real que revisa guiones | Se corta «Yo lo uso para revisar…» |
| SI-11 | Que claude-mem conteste en una charla nueva y archify corrido con un código tuyo | Se corta la prueba de claude-mem |
