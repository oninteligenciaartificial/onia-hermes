# Por qué falló el proyecto de la nube «ONIA · Hermes» (17-oct-2026)

> Foto de un día, escrita por la madre local a pedido de Sergio Urcullo. Sergio Urcullo pausó el proyecto dos veces el 17-oct: a las 00:55 («detengamos todo, así relanzamos y analizamos cada frente») y otra vez de madrugada («quiero que empiecen de cero con todo cargado, documentá por qué pasó esto»). Las reglas que salieron de esto viven en `PROYECTO_ONIA_HERMES_INSTRUCCIONES.md` y en `COMO_TRABAJAR_CON_SERGIO_URCULLO.md`. Este archivo cuenta el porqué.

## Lo que vio Sergio Urcullo
- Errores simples y documentos que se contradecían: el precio y la devolución del taller, y la fecha del primer CTA (mar 20 en un documento, sáb 24 en otro).
- No le llegaban las piezas para dar el OK; le llegaban avisos.
- Los hilos escribían «Sonnet escribe…» en su plan y lo hacían ellos mismos, sin subagentes.
- Un mismo frente (marca personal) estaba repartido en varios hilos y él no sabía dónde mirar.
- Le preguntaban cosas que podían resolver solos y no entendían lo que pedía.
- La cuota semanal llegó al 50 % con 5 días por delante.

## Causas medidas
1. **Los hilos arrancaban sin las reglas.** Las instrucciones del proyecto estuvieron vacías hasta el 17-oct a las 04:34 UTC. Las ~130 reglas que Sergio Urcullo fue dando vivían solo en la memoria local de la madre (213 archivos en su PC) y nunca llegaron a la nube.
2. **El CLAUDE.md y los hooks del repo no se aplicaban.** Los hilos arrancan en `/home/user` y el proyecto tiene 2 repos. Según la documentación (sin verificar), con más de un repo no corren los hooks ni se aplica el CLAUDE.md del repo.
3. **Faltaban skills en la cuenta.** Solo cargan en la nube las skills subidas a la cuenta. Las de video, diseño y verificación no estaban subidas.
4. **Tareas mal pedidas.** La jefa mandaba pedidos sueltos, sin objetivo, «hecho cuando», fuentes ni entrega. Cada hilo interpretaba a su modo. Nadie le devolvía a Sergio Urcullo «esto es lo que entendí».
5. **Demasiados hilos.** Había 11 abiertos, entre ellos una segunda coordinadora («/equipo-de-agentes») que le escribía por su cuenta. Lo de cada frente se abría en un hilo nuevo.
6. **Nadie verificaba los subagentes.** El cierre «Subagentes: N» no se contrastaba con el registro.
7. **Sin fuente única.** Cada hilo escribía su propio documento del taller. Ninguno mandaba sobre los demás.
8. **Cuota quemada por el contexto.** Cada vuelta relee todo el contexto. El hilo de Plataforma iba por ~320 k tokens y la madre por ~480 k. La coordinadora corría en Opus con esfuerzo xhigh y se despertaba con cada mensaje de un hilo. Había además recordatorios cada hora.
9. **Esperas de una hora.** El trabajo avanzaba por vueltas horarias, no por eventos. Entre vuelta y vuelta, todo quedaba parado.
10. **La PC fuera del circuito.** Los ~6 GB de videos y los archivos locales no estaban en la nube. Los «PC:» esperaban a que la madre mirara.
11. **La madre arreglaba por partes.** Se corregía lo que fallaba (skills, túnel SSH, una nota de memoria), pero nadie midió de punta a punta qué tiene un hilo nuevo frente a la sesión local. Eso recién se hizo el 17-oct.

## Qué se cambió (17-oct)
- Instrucciones nuevas (PR #229), pegadas por Sergio Urcullo. Traen: resolver antes de pedir, un frente por hilo, el «Entendí» antes de cada pedido, el molde de 7 campos, subagentes reales verificados en el registro, cero contradicciones, loop por eventos y cuidado de la cuota.
- Reglas de la memoria local llevadas al repo y a `/mnt/project-files/reglas/`.
- 7 hilos archivados (quedan 4), las 4 rutinas por hora apagadas y la coordinadora pasada a Sonnet.
- Skills de video, diseño y verificación zipeadas y subidas; el equipo de skills por frente, escrito.
- Archivo único del taller: `/mnt/project-files/marca/TALLER_31_OCT.md`.

## Lo que no se repite
- Antes de relanzar, se mide qué tiene un hilo NUEVO (reglas, skills, archivos, accesos), no solo lo que falló la última vez.
- Lo que un hilo necesita lo PIDE: «PC: necesito <qué> para <tarea>». La madre lo resuelve y lo deja cargado para el próximo arranque.
- Toda sesión, la madre incluida, pasa el relevo antes de los ~150 k tokens.
