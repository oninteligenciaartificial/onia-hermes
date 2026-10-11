# BORRADOR, no es master · S2-D07-A · La ventana de 24 horas de WhatsApp y las plantillas de Meta

Molde: Erik de septiembre (`edicion-referentes/scripts/erik/erik_edit.py`, receta `recetas/erik.json`). 90,74 s, 1080x1920, 30 fps, −14,1 LUFS.
Armado sobre el corte **PROPUESTO** (`../cutplan.json`: 42 bloques de pausa = los 4 bloques de `../tabla-de-cortes.md`), todavía **sin el «ok cortes»**
de Sergio Urcullo. Si el corte cambia, se rehace con un solo comando. No se publicó ni agendó nada; no toqué `erik_edit.py`, `santiago.py` ni
`capturar.mjs`. **Nadie escuchó el audio:** lo dudoso está en «Palabras a confirmar». Se corrió con `--sin-vosk` (Vosk no está instalado; instalarlo pide
aprobación de Sergio Urcullo): qué se pierde, abajo.

## Rehacerlo con un comando

```bash
bash /home/user/onia-hermes/videos/marca-personal/2026-10-11/s2-d07-a-ventana-24h/borrador/rehacer.sh
```

Variables (todas opcionales):

| Variable | Qué hace |
|---|---|
| `BRUTO` | bruto (default: el del scratchpad; en Drive «Videos Onia Octubre», `3941A129-133A-4618-BB88-7C191DC1AF3B.mp4`) |
| `S` | carpeta de trabajo (default `scratchpad/D07/borrador`): ahí quedan `video.mp4` a 1080x1920, `sheets/` y `work-erik/`; **no van al repo** |
| `CUTPLAN` | corte (default `../cutplan.json`) |
| `RECAPTURAR=1` | vuelve a sacar las páginas oficiales de Meta y reescribe `capturas/indice.md` con fecha, hora UTC y HTTP (hacerlo el día del master) |
| `QUITAR_VARIABLES=1` | corta la frase de las variables (ver ALERTA). **No es el default.** Salidas con sufijo `-sin-variables` |
| `QUITAR_REPETIDO=1` | corta el tramo repetido (bruto 01:04-01:23). **No es el default.** Salidas con sufijo `-sin-repetido` (con las dos: `-sin-variables-sin-repetido`) |
| `SOLO_CUADROS=2,12,40` | solo cuadros sueltos + informe (~30 s), sin render ni medición |

```bash
RECAPTURAR=1 QUITAR_VARIABLES=1 CUTPLAN=/ruta/cutplan-aprobado.json BRUTO=/ruta/C_3941A129.mp4 S=/ruta/trabajo \
  bash /home/user/onia-hermes/videos/marca-personal/2026-10-11/s2-d07-a-ventana-24h/borrador/rehacer.sh
```

Pasos: `armar-transcript.py` (transcript corregido en tiempo de salida) · [`capturar-meta.mjs` ×2 + `indice-capturas.py`] · `variantes.py` (arma el storyboard de render
y aplica los cortes opcionales) · `erik_edit.py --sin-vosk --hojas` (SIN `--sin-apretar`: aprieta huecos a 0,25 s) · tabla de cortes derivada · medición
(`silencedetect`, `ebur128`, `medir-saltos.py`) · `BORRADOR-no-es-master-360p.mp4` y `cuadros/`. Con una opción de corte activa los archivos del repo salen con sufijo y
**no pisan** el borrador por defecto (el 360p de la variante queda en `$S`).

**Tiempos medidos (4 CPU, esta máquina, solos):** transcript <1 s · 2 páginas de Meta ≈ 5-10 s cada una (no cronometrado) · cuadros sueltos (10 cuadros + análisis de cara de
90 s, primera vez) ≈ 32 s · **render completo 267 s y 256 s** (2,8-2,9 veces la duración) · medición + 360p + cuadros ≈ 22 s (41 s con `medir-saltos.py`) · `rehacer.sh` entero 289 s y 297 s,
con exit 0.

## Si el corte cambia, o se agrega / saca un bloque

- **Se recalcula solo:** `segments-cut.json` (palabras dentro de cada `keep`, restando el corrimiento acumulado; `arreglos.json` por texto, avisa si una frase ya no está), el
  render, la tabla derivada y la medición. Cada escena se ancla a una **frase única** del transcript, no a un segundo.
- **Depende del corte:** (a) las escenas cuya frase ya no está hacen que `erik_edit.py` aborte con «palabra «…» no está en el transcript»: se borra o reescribe esa escena;
  (b) los anclajes `{"corte": k}` son el límite k del cutplan **aprobado**: si se agrega o saca un bloque, cambia la numeración (hoy: `hasta` de la tarjeta TU CHATBOT = 4, sello
  MEDIANTE PLANTILLAS = 5, zooms = 5, 8, 16, 22, 36, 41, tarjetas CÓMO FUNCIONA = 8, LO QUE LE ENSEÑASTE = 15, EJEMPLO = 22, lámina «solo plantillas» `desde` = 17,
  «aprobadas» `hasta` = 20). Mirar «— anclas —» y «planos-flash» del informe.
- Mapa bloque de `../tabla-de-cortes.md` (tiempo de salida, s) → escenas de `storyboard.json`:

  | Bloque | Escenas |
  |---|---|
  | B1 · 0,00-40,58 | sello `VENTANA DE 24 HORAS` · lámina `cap-ventana` · tarjeta `TU CHATBOT` · sello `MEDIANTE PLANTILLAS` · tarjeta `CÓMO FUNCIONA` · tarjeta `LO QUE LE ENSEÑASTE` · sello `PASARON 24 HORAS` · lámina `cap-solo-plantillas` · lámina `cap-aprobadas` (entra en B1, termina en el corte 20 = 41,27) |
  | B2 · 40,58-42,56 («Por ejemplo, una plantilla sería un») | fin de la lámina `cap-aprobadas` · arranque de la tarjeta `EJEMPLO` (41,28) |
  | B3 · 42,56-74,42 | tarjeta `EJEMPLO` · zoom (corte 22) · **tarjetas `PRIMERAS 24 HORAS` y `DESPUÉS DE 24 HORAS` = tramo repetido (`fuera_si: repetido`)** · zoom `solución` (corte 36) |
  | B4 · 74,42-90,74 | sello verde `CERRÁ LA VENTA` · tarjeta `DESPUÉS DE LAS 24 HORAS` · zoom (corte 41) · CTA `COMUNIDAD` |

  - **Sacar un bloque:** borrar las escenas de su fila; los `{corte: k}` posteriores se renumeran. **B2/B3 ya tiene un posible tartamudeo:** el cutplan corta dentro de «sería un… un mensaje» (corte 21, 42,56 s;
    Whisper oyó un solo «un» de 1 s, bruto 48,44-49,46); el subtítulo muestra un solo «UN». Si B2 se saca, la lámina `cap-aprobadas` pasa a terminar en `por ejemplo una plantilla` y la tarjeta `EJEMPLO` no cambia.
  - **Agregar un bloque / audio nuevo:** transcribir (faster-whisper `small`) y reemplazar `../transcript-whisper-small.json`; las lecturas dudosas nuevas van a `arreglos.json` / `dudosas-extra.json`.

## ALERTA: «no puede estar cambiándose con variables porque si no Meta te las rechazaría» (bruto 00:57-01:04) — decide Sergio Urcullo

**Lo que dijo** (bruto 57,94-64,94, salida 50,79-57,4): «…porque la plantilla es fija y no puede estar cambiándose con variables porque si no Meta te las rechazaría».
**Lo que dice la página oficial** (`developers.facebook.com/documentation/business-messaging/whatsapp/templates/overview/`, «Template fundamentals», leída con Playwright el 11-oct-2026 ~09:08 UTC, «Updated: May 21, 2026»; de esta parte no hay PNG en `capturas/`, a propósito):
«Some template components allow you to define strings that contain one or more parameters (described as “variables” in WhatsApp Manager). These are replaced with values included by you in your
send message payload when you send the template», con ejemplos `Hi {{1}}! Your order number is {{2}}.` y `Thank you, {{first_name}}!…`; cada parámetro lleva un valor de ejemplo al crear la
plantilla; la plantilla se revisa («automatically reviewed upon creation or after editing») y solo se envía si su estado es APPROVED. Es decir: **las plantillas SÍ admiten variables**; lo que Meta
rechaza es una plantilla (nueva o editada) que no pasa la revisión, o enviar con una que no está aprobada. Lo que **no verifiqué** (no abrí esas páginas): los límites de contenido de una variable.

- **En pantalla no hay ninguna tarjeta, sello ni lámina con esa afirmación** (ni con «no un mensaje con los horarios disponibles en ese momento», que parte de la misma premisa). Los subtítulos sí
  muestran lo que dijo (51-57 s de salida): es lo que se oye.
- **Salida 1, cortar:** `QUITAR_VARIABLES=1 bash rehacer.sh` (o copiar `corte_opcional.variables` de `storyboard.json` a `corte.quitar`). Quita «y no puede estar cambiándose con variables porque si no Meta
  te las rechazaría» (bruto 60,35-65,30, 4,65 s; la pieza queda en 86,09 s); queda «…en ese momento, porque la plantilla es fija. Entonces, dentro de las primeras 24 horas…». Ojo: sigue en pie «no un mensaje con todos los horarios que tienen disponibles en
  ese momento», que insinúa lo mismo.
- **Salida 2, regrabar** (lo más limpio): «una plantilla puede llevar variables, pero la plantilla se aprueba antes y solo se puede mandar tal como se aprobó». La decisión es de Sergio Urcullo.
- Segundo matiz, menor, de la misma página (`messages/send-messages`): el reloj de 24 horas **corre desde el último mensaje o llamada del cliente y se reinicia** con cada uno nuevo; él dice «24 horas de
  iniciada la conversación». En pantalla va solo el recuadro de la página («timer called a customer service window»), sin traducirlo a «desde que se inicia».

## Tramo repetido (opcional, no se cortó)

Bruto 65,30-83,6 (salida 57,72-74,42): «entonces dentro de las primeras 24 horas puedes reescribirle libremente pero luego con el agente conversacional de WhatsApp después de las 24 horas es solo
mediante plantillas fijas que por ejemplo sería el horario sin personalización de horarios estaría disponible, ese es el único problema que exista». Vuelve sobre «después de 24 horas, solo plantillas»
(bruto 17-44). Opción lista: `QUITAR_REPETIDO=1`; las dos tarjetas de ese tramo llevan `fuera_si: ["repetido"]` y se descartan solas. Duración medida (render completo de cada variante):

| Variante (render completo de cada una, `rehacer.sh` exit 0) | Duración | Quita | Regla 15 (`silencedetect -35 dB d=0.3`) | LUFS · LRA · TP |
|---|---|---|---|---|
| Por defecto (propuesta) | **90,74 s** | — | 0 | −14,1 · 2,2 · −2,2 |
| `QUITAR_VARIABLES=1` | **86,09 s** | 4,65 s (bruto 60,35-65,30) | 0 | −14,1 · 2,2 · −2,2 |
| `QUITAR_REPETIDO=1` | **74,17 s** | 16,57 s (bruto 65,28-83,42) | 0 | −14,1 · 2,1 · −2,2 |
| las dos | **69,56 s** | 21,18 s | 0 | −14,1 · 2,1 · −2,3 |

(La tabla de cortes de la madre calculaba ~72 s sin repetido: da 74,17 s porque el recorte deja el aire de 0,24 s en el empalme y el cutplan conserva las pausas que ya traía.) En las cuatro, a d=0,2 también 0 silencios.
Con el tramo repetido cortado queda **un hueco de ~28 s** (45,7-74,4 en el tiempo por defecto) sin ningún elemento nuevo (solo subtítulos y jump cuts), porque ahí están las frases de la ALERTA: habría
que decidir qué se muestra ahí (o regrabar).

**Empalmes de las variantes:** cortar las variables hace saltar la cara ~99 px (cambió de postura mientras decía la frase). Por eso las variantes traen un zoom en el empalme (`solo_si` en `storyboard.json`: corte 27 para
variables, corte 28 para repetido, que reemplaza al zoom de «solución»): con eso el mayor salto sin cobertura baja a 37 px (variables) y 28 px (repetido). Con **las dos** queda un segundo empalme 0,25 s después (53,24 s:
el corte 36 del cutplan, que además es donde vuelve el zoom a 1,00): ~110 px medidos; mirarlo en el master.

## Palabras a confirmar con el audio (segundo del BRUTO)

Los subtítulos NO llevan `[?]`: llevan la mejor lectura. La lista sale sola en `palabras-a-confirmar.txt`; la 2.ª pasada de Whisper (beam 5 + vocabulario) está en
`whisper-segunda-pasada.txt` y solo sirve para contrastar.

| Bruto (s) | 1.ª pasada oyó · 2.ª pasada | Subtítulo dice | Nota |
|---|---|---|---|
| **80,36-80,70** | «corario» · «cobrarios» (prob. 0,57) | «de **horarios** estaría disponible» | **el más dudoso.** Sin sentido en la 1.ª. Hipótesis fonética, no oída: la palabra dura 0,34 s (3 sílabas) y «de» va pegada, así que «de horarios» encaja. Si es otra cosa, se cambia en `arreglos.json` (la clave `de corario estaría`) o se deja sin esa palabra |
| 23,52-25,12 | «Clínica Vental» · «clínica dental» | «Clínica **Dental** de Sergio» | el nombre del ejemplo; en pantalla NO va (la tarjeta dice «TU CLÍNICA»). Hay 2 micro-cortes dentro de «Clínica…Dental» (bruto 23,65-23,77 y 24,16-24,30): una pausa suya |
| 42,54-44,22 | «verificadas y probadas» · «verificadas y aprobadas» | «verificadas y **probadas**» | la 2.ª pasada tenía «aprobadas» en su vocabulario: sesgada, no cuenta. El término de Meta es «aprobada»; la tarjeta `EJEMPLO` dice «APROBADA» (de la página, no de su palabra) |
| 83,00-83,56 | «que exista» · «que existe» | «que **exista**» | una pasada y otra; oír |
| 4,28-4,30 | «Si tenés» (la «Si» dura 0,02 s) | «Si tenés» | borde de Whisper; el karaoke de «SI» dura 1 cuadro |
| 100,46-100,78 | «uníte» · «unita» | «uníte» | cierra con «uníte a mi comunidad» (CTA); confirmar el voseo |
| 48,44-49,46 | un solo «un» (1 s) · igual | «un» | **posible «un… un»** (el empalme B2/B3 cae adentro, corte 21): oír; si es tartamudeo, se mueve el borde en el cutplan |
| 4,72-5,14 | «chat bot» · «chatbot» | «chatbot» | ortografía |
| 74,70-74,86 | «sólo» | «solo» | sin tilde (RAE 2010), como «guion» en N02 |
| 67,62-67,90 | «puedes» | «puedes» | lo dijo con «puedes», no «podés»; el subtítulo transcribe lo que dijo |
| 14,30-15,50 | «Y cómo funciona todo esto?» | «¿Y cómo funciona todo esto?» | se agregó el «¿» (el molde lo quemaba sin apertura; ver «Trampas») |

Diccionario de marcas: «meta» → «Meta» (2 lugares, solo cambia el README: los subtítulos van en mayúsculas), «whatsapp» → «WhatsApp».

## Verificación contra las páginas oficiales (capturadas el 11-oct-2026, 09:15-09:18 UTC, ~05:15 en La Paz)

Dos páginas de la documentación de WhatsApp Business Platform de Meta, ambas «Updated: May 21, 2026», desde la nube por el proxy de la sesión, TLS intacto, HTTP 200 (`capturas/indice.md`):
`…/documentation/business-messaging/whatsapp/messages/send-messages` («Service messages») y `…/templates/overview/` («Template fundamentals»). Las URL viejas `developers.facebook.com/docs/whatsapp/...`
redirigen a esas (la de `send-message-templates` ya dice «This page has moved»).

| Dicho | Página (texto exacto) | Resultado |
|---|---|---|
| «la ventana de 24 horas… después de las 24 horas, solo plantillas» | «When a WhatsApp user messages you or calls you, a 24-hour timer called a customer service window starts… When the window closes, you can only send pre-approved template messages.» | **cuadra** (matiz del reloj: ver ALERTA) |
| «solo puede ser respondido mediante plantillas» | «Template messages are the only type of message that can be sent to WhatsApp users outside of a customer service window.» | **cuadra** |
| «el bot le responde de la manera que le enseñaste / dentro de las 24 horas le escribís libremente» | «Service messages are free-form messages that you can send to WhatsApp users during a customer service window… do not require pre-approval» | **cuadra** |
| «plantillas de Meta verificadas y probadas» | «Templates must have a status of APPROVED before they can be sent in template messages» · «automatically reviewed upon creation or after editing» | **cuadra en lo esencial** (el término es «aprobada»; la revisión es automática) |
| «la plantilla es fija y no puede estar cambiándose con variables porque si no Meta te las rechazaría» | parámetros/variables `{{1}}` o `{{nombre}}` con valor de ejemplo, reemplazados al enviar | **NO cuadra** (ver ALERTA). No va en pantalla |
| «no un mensaje con todos los horarios que tienen disponibles en ese momento» | la página no dice que una plantilla no pueda llevar datos del momento (admite parámetros) | **la página no lo confirma**; no va en pantalla |
| «plantillas de seguimiento o de remarketing» | las categorías oficiales son marketing, utility y authentication; «seguimiento» y «remarketing» no aparecen | sin respaldo en página; en pantalla va solo su palabra |
| (no lo dice) | «you can only send messages to WhatsApp users who have opted in to receiving messages from you» | **no está en el video ni en pantalla**; es la condición que más importa a quien arma seguimientos |

## Qué hay en pantalla y de dónde sale (cada texto: sus palabras o una página oficial de hoy)

| Desde (s) | Escena | Qué muestra | Fuente |
|---|---|---|---|
| 0,00 | sello (kraft) | «VENTANA DE 24 HORAS / EN WHATSAPP» | sus palabras |
| 1,26 | lámina G `cap-ventana` | gafete WhatsApp «VENTANA DE ATENCIÓN AL CLIENTE» + «FUENTE: DEVELOPERS.FACEBOOK.COM», contorno verde en «timer called a customer service window» | Meta, Service messages |
| 3,72 | tarjeta flujo | «TU CHATBOT / WHATSAPP»: Chatbot de WhatsApp → 24 horas «desde que inicia» | sus palabras |
| 11,68 | sello | «MEDIANTE PLANTILLAS / DESPUÉS DE 24 HORAS» | sus palabras |
| 14,50 | tarjeta flujo | «CÓMO FUNCIONA / VENTANA ABIERTA»: Cliente «te escribe» → Bot «lo que enseñaste» | sus palabras («ventana abierta» = «while the window is open», de la página) |
| 25,73 | tarjeta lista | «LO QUE LE ENSEÑASTE / TU CLÍNICA»: Horarios · Doctores · Tratamientos | sus palabras |
| 31,27 | sello | «PASARON 24 HORAS / VENTANA CERRADA» | sus palabras + «when the window closes» |
| 35,96 | lámina G `cap-solo-plantillas` | contorno verde en «can only send pre-approved template messages» | Meta, Service messages |
| 37,99 | lámina G `cap-aprobadas` | gafete «ESTADO DE LA PLANTILLA», contorno en «status of APPROVED» | Meta, Template fundamentals |
| 41,28 | tarjeta flujo | «EJEMPLO / PLANTILLA»: Plantilla «aprobada» → Mensaje «con los horarios» | sus palabras |
| 59,73 y 66,29 | tarjetas lista (**solo si no se corta el repetido**) | «PRIMERAS 24 HORAS / LIBRE: Le escribís libremente» · «DESPUÉS DE 24 HORAS / SOLO PLANTILLAS: Solo plantillas · Horario sin personalización» | sus palabras |
| 77,09 | sello verde | «CERRÁ LA VENTA / DENTRO DE LAS 24 HORAS» | sus palabras |
| 82,65 | tarjeta lista | «DESPUÉS DE LAS 24 HORAS / PLANTILLAS: De seguimiento · De remarketing» | sus palabras |
| 87,18 | CTA tecleado | «UNÍTE A MI / COMUNIDAD_» + «LINK EN MI PERFIL» + firma `S SERGIO URCULLO` (con el brillo del molde) | sus palabras («uníte a mi comunidad que está en el link de mi perfil») |

Zooms (1,12×) en los cortes 5, 8, 16, 22, 36 y 41. Logo: solo el de WhatsApp de `assets-ejemplo` (verde oficial `#25D366`, no recreado); **no puse logo de WhatsApp en el CTA**
porque en este video no dijo «comunidad de WhatsApp» y el tema es WhatsApp: se confundiría el canal. El CTA pide la **comunidad**, no la asesoría (el bloqueo del link de asesoría no aplica a esta pieza).
Sin rojo ni terracota: no usé marcas ✕, sellos ni nodos rojos; los azules de los vínculos de las capturas son los de la página.

## Lo que pierde `--sin-vosk`

Vosk re-alinea el inicio de cada palabra (±0,03 s) contra el audio; Whisper small yerra ±0,1-0,3 s. Sin él, `erik_edit.py` usa los tiempos del transcript y solo corrige el inicio de la primera palabra
que sigue a un silencio medido (`+rms`). Medido en el informe (`informe-erik.txt`, «anclas»): de **30 anclas, 23 salen con el tiempo de Whisper tal cual** («?») y 7 corregidas por el silencio; las 4 que cambiaron se
movieron 0,09-0,24 s. Consecuencia: tarjetas y sellos pueden entrar 0,1-0,3 s antes o después de su palabra (la receta pide +0,067 s) y el karaoke puede ir unas centésimas corrido. **No lo medí contra el audio.**
`armar-transcript.py` ya ajusta 25 bordes de palabra a los silencios del cutplan, que ayuda pero no es alineación forzada. Para el master conviene instalar Vosk (pedir aprobación) o alinear de nuevo.

## Medido (render final; `medicion.txt`, `informe-erik.txt`)

| Qué | Resultado |
|---|---|
| **Regla 15**, `silencedetect noise=-35dB d=0.3` sobre el audio del MP4 final | **0 silencios** (a d=0,2 también 0). El corte propuesto ya deja 0,24 s en cada empalme y `erik_edit.py` no apretó nada (quita 0,00 s: la tabla derivada sale vacía) |
| Pausa más baja dentro de una pausa ≥0,2 s (medidor del molde) | −48,9 dBFS (piso −40): sin huecos digitales; 0 huecos rellenados con room tone |
| Sonido | **−14,1 LUFS · LRA 2,2 LU · true peak −2,2 dBFS** (`ebur128 peak=true` sobre el MP4; el script midió −2,4 en el WAV). Receta: −14 ±0,5, LRA 2-3,5, TP ≤ −1,5: **cumple** |
| Duración / formato | 90,74 s (receta tutorial 105-127 s, noticia 44-52 s: queda entre las dos) · 1080x1920, 30 fps, H.264 CRF 18, AAC 256k |
| Cortes que se ven | 47 = **5,2 cada 10 s** (receta 3-5; meta 4-4,5): empalmes del cutplan (41), 6 jump cuts de ritmo del molde y los cambios de lámina, menos los que tapa una lámina. Por tramo de 10 s: 5, 6, 7, 4, 5… |
| Plano de cámara más largo | **3,28 s**: ninguno pasa de 3,3 s sin corte/zoom |
| Planos-flash (<0,8 s) | 5, **todos heredados del cutplan** (pares de micro-cortes a menos de 0,8 s): 21,60-21,99 (0,39 s), 24,39-24,93 (0,54), 48,11-48,91 (0,80), 57,60-58,28 (0,68), 69,46-70,10 (0,64). El de 0,09 s en 35,96 se arregló con `desde: {corte: 17}` |
| Salto de la cara en los empalmes sin cambio de apoyo | 22 empalmes (de 41) no coinciden con lámina, tarjeta, zoom ni bloque de subtítulos; medidos 20 (YuNet sobre el render): ojos **x máx 25 px, mediana 9,1 · y máx 20 px, mediana 5,1** (px de 1080, incluye 2 cuadros de movimiento natural). N02 daba ≤ 16 px: acá se nota algo más |
| Subtítulos | bloques de 3 palabras en mayúsculas, activa +8 %, glifos entre y 1350 y 1501 (78,2 %, tope 80 %); apagados con fundido mientras hay tarjeta |
| Tarjetas | 7 (con el repetido): 7,2 · 5,2 · 4,7 · 4,4 · 3,1 · 6,2 · 3,6 s, todas ≤ 7,5; **en la banda de arriba (y 150-476, 8-25 %)**: YuNet mide en este bruto frente en y≈860 (45 %), ojos 52 % y mentón 63 % (Erik: ojos 30 %): no hay «pecho» libre (51-75 % taparía la boca); el script elige solo la banda de arriba, que no toca la frente (mín. y 799 = 41,6 %) |
| Elementos nuevos | 39 en 90,7 s = ≈ 4,3 por 10 s (contados a mano desde el informe: sellos, láminas y sus contornos, tarjetas y sus piezas, zooms, CTA; receta 4,5-7,7): en el piso. **Tramo 45,7-59,7 s (14 s) sin elementos nuevos** (las frases de la ALERTA) |
| Gancho | sello y subtítulo en el cuadro 0, primera palabra a 0,12 s (pre-roll del cutplan; la receta pide voz en el cuadro 0), prueba oficial a 1,26 s (antes de 2,5 s) |
| CTA | tecleado a 1 letra por cuadro («COMUNIDAD_» completa en ~0,3 s), «LINK EN MI PERFIL» a 89,79 s, firma, brillo a 87,18 s; corte seco 0,15 s después de la última palabra (sin placa) |
| No medido | alineación de los subtítulos con la voz (sin Vosk) · el brillo y el golpe de los sellos (no se escucharon) |

Mirado con los ojos: 10 hojas de control a 2 fps (0-90,7 s) del render anterior al final (igual salvo 4 retoques: «¿» de apertura, sin pastillas en las láminas, la tarjeta final termina antes del CTA y el contorno de «solo puede ser»), y del render final las hojas 2 y 9, 4 cuadros sueltos (13,1 · 36,7 · 85,4 · 87,6 s) y los 6 de `cuadros/`, más unos 30 cuadros sueltos durante el trabajo. Subtítulos legibles (blanco, activa verde, sobre
la lámina en tinta), tarjetas dentro del cuadro y fuera de la cara, CTA entero en los últimos cuadros, «¿Y CÓMO FUNCIONA» con apertura. **Nadie lo escuchó.**

## Trampas nuevas de este armado (para `edicion-referentes`)

1. **`erik_edit.py` NO usa Haar** (usa `cv2.FaceDetectorYN`): corre directo con OpenCV 5.0.0, sin rodeo (el `WARN setPreferableTarget` es inofensivo).
2. **`erik/capturar.mjs` no sirve tal cual en `developers.facebook.com`:** las clases son hashes y los párrafos son `<div>`, así que `locator(...).first()` toma el ancestro más grande; las cabeceras son `position: fixed/sticky`; y
   `capturas.json` se sobreescribe por URL. `capturar-meta.mjs` (copia, en esta carpeta) toma el elemento más profundo que contiene el texto, oculta lo fixed/sticky, avisa si la marca cruza renglones y estampa fecha, hora UTC y HTTP.
   Un spec por URL y una carpeta de assets por spec: el storyboard acepta `"assets": ["capturas/servicio", "capturas/plantillas"]`.
3. **Los docs de Meta se mudaron** a `/documentation/business-messaging/whatsapp/...` (las URL `/docs/whatsapp/...` redirigen; Playwright `innerText` anda, `curl` trae 1,3 MB de HTML de React).
4. **Notas de los nodos de `flujo`:** van centradas en el nodo y se recortan fuera de la tarjeta. Con `caja: 120` caben ≤ 16 caracteres en el primero y el último nodo (≤ 10 con la caja de 100). Ver «te envió un mensaje» y
   «como le enseñaste» recortados en la prueba.
5. **Láminas:** la pastilla de la `marca` se pone debajo de la línea marcada y **tapa texto de la captura**; el chip FUENTE tapa la 1.ª línea si `margen_sup` es chico (≥ 40 px CSS con ancho 520). Acá van solo con contorno.
6. **Un evento que empieza unos cuadros después de un corte del cutplan crea un plano-flash** (lámina a 36,05 con corte a 35,96: plano de 0,09 s): anclar con `{corte: k}`; el informe los lista.
7. **`armar-transcript.py` de N02 borraba el «¿»** de los reemplazos (`limpiar_marca` quitaba ¿ y ? sueltos): el subtítulo salió «Y CÓMO FUNCIONA… ESTO?». Arreglado en la copia de esta carpeta (solo limpia con corchetes); mirar siempre la hoja.
8. **Dos renders sobre el mismo `--trabajo` se pisan** y el MP4 sale con miles de «Invalid NAL unit size»: pasó al lanzar `rehacer.sh` con `( … ) &` dentro de una tarea en segundo plano (la tarea «terminó» y el proceso siguió). Con
   `run_in_background` va el comando solo, sin `&`. Se repitió limpio.
9. **Una 2.ª pasada de Whisper con vocabulario puede sesgarse**: resolvió «Vental» → «dental», pero con «aprobadas» en el prompt devolvió «aprobadas»; solo cuenta lo que no estaba en el prompt.
10. **Un corte del cutplan que cae DENTRO de lo quitado se lleva al empalme; uno que cae después queda corrido.** `{corte: 27}` (dentro de la frase quitada) pega un zoom exactamente en el empalme de `QUITAR_VARIABLES`;
    `{corte: 36}` quedaba 0,25 s después del empalme de `QUITAR_REPETIDO`. Para eso `variantes.py` entiende `fuera_si` (el evento se va con sus palabras) y `solo_si` (el evento solo existe con esa opción).
11. **Cutplan ya apretado = nada que apretar:** con huecos de 0,24 s en cada empalme, Erik quita 0,00 s y la tabla derivada sale vacía; la regla 15 da 0 a d=0,3 y a d=0,2. Las tarjetas bajan a la banda de arriba cuando el mentón cae debajo del 50 % (acá 63 %).

## Archivos

`rehacer.sh` · `armar-transcript.py` + `arreglos.json` + `dudosas-extra.json` → `segments-cut.json` + `palabras-a-confirmar.txt` · `storyboard.json` (con `corte_opcional` y `fuera_si`) + `variantes.py` · `capturar-meta.mjs` +
`capturas/` (`specs/`, `servicio/`, `plantillas/` con 3 PNG y su `capturas.json`, `indice.md` con URL y fecha) + `indice-capturas.py` · `informe-erik.txt` (control de `erik_edit.py`: cortes, planos, tarjetas, anclas) · `whisper-segunda-pasada.txt` ·
`tabla-cortes.md` + `cutplan-erik.json` (corte derivado; vacío por defecto) y, de las variantes, `tabla-cortes-sin-*.md`, `cutplan-erik-sin-*.json`, `informe-erik-sin-*.txt`, `medicion-sin-*.txt` · `medicion.txt` · `medir-saltos.py` ·
`cuadros/` (6 JPG del render: 0,4 · 2,8 · 17,5 · 39,6 · 45,0 · 90,3 s) · `BORRADOR-no-es-master-360p.mp4` (2,5 MB). El render a 1080x1920 (`video.mp4`, 52 MB), las hojas de control (`sheets/`, 2 fps), los renders de las variantes
y el log quedan en `/tmp/claude-0/-home-user-onia-hermes/0fd2553b-524b-53fe-9e97-5c1ac80566e6/scratchpad/D07/borrador/`, no en el repo.
