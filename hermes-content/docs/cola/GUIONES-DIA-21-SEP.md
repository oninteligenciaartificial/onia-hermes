# Guiones del día · lunes 21-sep — listos para grabar

> Reparto según [`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md`](../ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md).
> Formato de rodaje (HABLA / EN PANTALLA / OVERLAY) copiado de
> [`GUIONES-RODAJE-17-20-SEP.md`](GUIONES-RODAJE-17-20-SEP.md). **Hoy toca carrusel: el
> carrusel REEMPLAZA al b-roll**, así que el feed es pilar + video normal de IA + carrusel.

## De dónde salió cada pieza

| Origen | Piezas |
|---|---|
| **Cola del 18-sep** ([`GUIONES-GUARDADOS-PROXIMO-DIA.md`](GUIONES-GUARDADOS-PROXIMO-DIA.md)) | **F2** (C · «El verde que miente»), **V1** (A · «La regla que se desobedece»), **V2** (B · «Terminar no es lograr») — se encolaron para esto, se usan tal cual |
| **Escritas hoy** | **F1** (pilar), **T4** (yap), **V3**, **V4** |
| **Ya renderizado, no se toca** | **F3** — carrusel `carousels/out/sergio-mismo-precio-20260921/` (7 láminas) + su caption en el brief |
| **Temas del día** | los 5 briefs `carousels/briefs/sergio-*-20260921.json`. Los 5 ángulos aparecen repartidos en el día; ninguno se repite textual |

## La estructura fija de los cortos (no se toca)

```
0-3 s    GANCHO       una frase. Sin "hola", sin "hoy les traigo"
3-25 s   LO CONCRETO  qué es, qué hace, qué NO hace — con pantalla real
25-35 s  CIERRE       UN recurso + comentario O comunidad (alternado)
```

El pilar (F1) es el único largo (~75 s): gancho → desarrollo con detalle concreto →
giro honesto → cierre.

---

## El día de un vistazo

| # | Pieza | Carril | Graba | Recurso | Cierre |
|---|---|---|---|---|---|
| **F1** | «Un archivo de reglas. Los dos agentes» (AGENTS.md) | Feed · pilar | **Samuel** | `sergiourcullo.vercel.app/claude-code` | comentario |
| **F2** | «El verde que miente» (demo en pantalla) | Feed · video normal de IA | **Sergio Urcullo** | comunidad | comunidad |
| **F3** | Carrusel «Ahora cuestan lo mismo» (Fable 5.1 vs GPT-6 Astra) | Feed · carrusel (reemplaza b-roll) | — (renderizado) | — (la pieza es el recurso) | comentario |
| **T4** | Yap: el matiz del AGENTS.md, leído del changelog | Trial · yap | **Samuel** | `/claude-code` | comunidad |
| **V1** | «La regla que se desobedece» | Trial v2 | Sergio Urcullo | — (la regla es el contenido) | comentario |
| **V2** | «Terminar no es lograr» | Trial v2 | Sergio Urcullo | comunidad | comunidad |
| **V3** | «El número que repetí cinco veces» | Trial v2 | Sergio Urcullo | **YouTube 03** (`youtu.be/8iMRBo7ppac`) | comentario |
| **V4** | «18 errores, y los 18 los encontró él» | Trial v2 | Sergio Urcullo | comunidad | comunidad |

**La cuenta: Feed 3 + Trial 4 (F1+F2+F3+T4) + Trial v2 4 = 11 piezas.** Dentro del rango 10-13.
Alternancia de cierre: comentario → comunidad → comentario → comunidad → comentario →
comunidad → comentario → comunidad.

---

## 🔑 Los números de hoy, y contra qué se verificaron

**Verificados HOY (21-sep) por esta sesión:**

| Dato | Valor | Cómo |
|---|---|---|
| Errores anotados en el parte de infra | **18 anotados · 4 de UNA sesión** | recontados a mano hoy en `docs/handoff/onia-dev-node-setup.md` §5. 🔴 **§5.1 se titula «De esta sesión» y tiene CUATRO** (items 1-4). Los otros 14 son §5.2 «Trampas de máquina» (9) y §5.3 «Hipótesis que resultaron falsas» (5): días de trabajo sobre el mismo carril, no una sesión. Comando: `awk '/^## 5\./{f=1} /^## 6\./{f=0} f' <archivo> \| grep -E "^###\|^[0-9]+\. "` |
| Quién anotó esos 18 | **él mismo** | el §5 entero está escrito en primera persona por el agente sobre su propio trabajo («Diagnostiqué mal…», «Creí que…», «Falso.»). `grep -i "sergio\|lo encontr"` dentro de §5 → **cero**: nadie externo figura. ⚠️ Por eso se dice «los anotó él», no «los encontró él» — lo primero se prueba, lo segundo no |
| Instrumentos que dieron verde en el login roto | **DOS** | `CLAUDE.md` §«Verificar es MIRAR» dice literal: *«Yo lo había "verificado" varias veces con HTTP 200 y grep, sin abrirlo nunca»*. Son **grep + HTTP 200**. 🔴 **No dice cuántas veces ni cuánto tiempo estuvo roto** — cualquier «tres veces» o «durante días» es invento. Lo que sí dice: **«Lo encontró Sergio»**. La propia demo cierra así: *«Dos instrumentos dijeron que estaba bien. Ninguno la había mirado.»* |
| Subagentes propios | **3** | `ls .claude/agents/` → core-guardian, creative-radar, crm-prospeccion (+ `README.md` y `_retirados/`). ⚠️ `ls *.md \| wc -l` devuelve **4**: cuenta el `README.md` |
| Plugins instalados | **9** | `ls -d ~/.claude/plugins/cache/*/` |
| Hooks | **4** | 3 en `~/.claude/settings.json` + 1 (`Stop` → `git-autosync.js`) en `.claude/settings.json` del repo |
| **YT 03 está vivo** | sí | `curl .../oembed` → «Hago que la IA trabaje mientras duermo — así está armado», canal @sergiourcullo |
| `/stack` y `/claude-code` | responden 200 | `curl -o /dev/null -w %{http_code}`. ⚠️ Un 200 prueba que **el link no está roto**, no que la página se vea bien |
| Link de la llamada 1 a 1 | `/llamada` **200** · `cal.com/sergiourcullo/20min` **200** · `cal.com/sergiourcullo/30min` **404** | curl a los tres |
| Demo del falso verde | existe y está completa | `carousels/out/yt-04-verificar/demo-falso-verde/`: `demo.sh`, `login.html`, `prueba3-mirala.png` |
| **Claude Code de esta máquina** | **2.1.267** | `claude --version`. El AGENTS.md llegó en **2.1.277** → **en esta máquina todavía NO está**: hay que actualizar ANTES de grabar la pantalla de F1 |
| **El changelog de 2.1.277**, textual | ✅ verificado hoy contra la fuente | `curl raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md`. Dice: *«Added AGENTS.md support: in a project with no CLAUDE.md, Claude Code reads AGENTS.md instead; change it under "Project instructions" in `/config`»*. **El matiz que F1 y T4 cuentan es exacto.** Dato extra de la misma lectura: ya existe **2.1.278** |
| Láminas del carrusel F3 | **7** | `ls carousels/out/sergio-mismo-precio-20260921/` → `slide-01`…`slide-07.png` |
| Los 5 briefs del día | existen | `ls carousels/briefs/sergio-*-20260921.json` → mismo-precio, agents-md, dato-heredado, 18-errores, instrumento-roto |

**Tomados de `handoff/yt-serie-claude-code.md` §Datos verificados (medidos el 18-sep, NO
recontados hoy)** — van marcados `[Recontar el día]` en el guion donde se dicen en cámara:

- **40** trabajos por horario en el VPS · **0** en el nodo de casa (`crontab -l`).
- **5.270** reacciones al pedido de AGENTS.md. ⚠️ **El changelog NO dice que fuera el pedido
  #1 ni trae ninguna cuenta de reacciones** — eso sale sólo del handoff del 18-sep. Si no se
  abre el issue de GitHub y se lee el número de hoy, **la frase no se dice**: el resto del
  guion funciona igual sin ella.

**Sin fuente verificable hoy:**

- 🔴 **«lo repetí cinco veces»** (V3 y el brief `sergio-dato-heredado`, lámina 2)
  `[SIN FUENTE — no decirlo en cámara]`. El dato falso («4 trabajos en la PC de mi casa») hoy
  sobrevive **en un solo lugar**: `carousels/out/yt-claude-code-automatizacion/GUION.md:69`.
  Los demás ya se corrigieron, así que el «cinco» no se puede contar ni probar. Lo que sí está
  documentado es la **cadena**: documento → guion → lámina → estaba por decirlo en cámara.
  **Se cuenta la cadena, no el número.**
- Fechas de F3 (Fable 5.1 el 1-sep · GPT-6 Astra el 3-sep, default en Codex el 4-sep):
  heredadas del handoff del 18-sep, **no reverificadas hoy**. No se dicen en cámara — van
  sólo en el carrusel ya renderizado, así que no bloquean el rodaje.

⚠️ **La lección cara de la tanda anterior:** **dos guiones** de la serie llevaban un dato
central falso, los dos por heredar un número sin recontarlo (el 03 —ya publicado— y el 04,
que todavía no se grabó). V3 habla justamente de eso — si su propio número sale sin recontar,
la pieza se cae sola.

---

# FEED

## F1 · Pilar (Samuel) — «Un archivo de reglas. Los dos agentes» · ~75 s

*Enseña: que Claude Code ya lee `AGENTS.md`, y la regla de precedencia que casi nadie va
a contar bien. Formato largo: más habla y detalle, pantalla puesta por la edición.*

🔴 **Antes de grabar:** actualizar Claude Code en la máquina de rodaje. Hoy tiene
**2.1.267** y la función entró en **2.1.277** — grabar la pantalla ahora sería mostrar una
versión que no hace lo que el video dice.

| Seg | HABLA (literal) | EN PANTALLA (arriba, grande) | OVERLAY |
|---|---|---|---|
| 0-4 | «Si usás dos agentes de IA, hasta la semana pasada escribías tus reglas dos veces. Eso se acabó, pero lo van a contar mal.» | dos terminales abiertas al lado | `LO VAN A CONTAR MAL` |
| 4-18 | «Te explico el problema primero. Claude Code lee tus reglas de un archivo que se llama CLAUDE punto eme de. Codex, Cursor y Copilot leen otro: AGENTS punto eme de. Mismas reglas, dos archivos — y uno de los dos siempre quedaba viejo.» | los dos archivos lado a lado, uno con fecha vieja | `2 ARCHIVOS · 1 VIEJO` |
| 18-32 | «Desde la versión 2.1.277, Claude Code también lee AGENTS punto eme de. Era el pedido número uno de su repositorio: **[Recontar el día: 5.270]** personas lo pidieron. Pero acá está la parte que importa —» | el changelog en pantalla, la línea resaltada | `2.1.277` |
| 32-48 | «lo lee SOLO si tu proyecto no tiene CLAUDE punto eme de. Si tenés los dos, gana CLAUDE y el otro se ignora entero. O sea: si ahora creás un AGENTS punto eme de al lado del que ya tenías, no lo va a leer nunca, y vas a estar seguro de que sí.» | los dos archivos, el AGENTS tachado | `SOLO SI NO HAY CLAUDE.md` |
| 48-62 | «Qué hacés hoy, dos caminos y los dos son cortos. Si arrancás de cero: escribí solo AGENTS punto eme de y te sirve para los cuatro programas. Si ya tenés CLAUDE punto eme de andando: no lo borres — metele adentro una línea que diga arroba AGENTS punto eme de, y lo trae.» | la línea `@AGENTS.md` escribiéndose dentro del CLAUDE.md | `@AGENTS.md` |
| 62-75 | «Qué va adentro: cómo escribís, qué no se toca, dónde va cada cosa. Lo que hoy le explicás de nuevo en cada chat. El paso a paso de cómo armarlo está en la guía de mi web. ¿Vos ya tenés uno escrito, o se lo explicás todo de nuevo cada vez? Contame.» | `/claude-code` scrolleando en el teléfono | `sergiourcullo.vercel.app/claude-code` |

**Cierre:** recurso = `/claude-code` + **pedido de comentario**.
**No decir:** que «ahora funcionan igual los dos» — no es cierto, hay precedencia. Y nada
de «pronto lo van a arreglar»: se cuenta lo que hace hoy.

---

## F2 · Video normal de IA (Sergio Urcullo) — «El verde que miente» · 35 s

*De la cola del 18-sep (guion C). Enseña: tres comprobaciones en verde sobre una pantalla
rota. Lleva edición y pantalla — por eso es feed y no Trial v2.*
*Demo lista y corrida: `carousels/out/yt-04-verificar/demo-falso-verde/` (`demo.sh`,
`login.html`, `prueba3-mirala.png`).*

| Seg | HABLA (literal) | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Di por buena esta pantalla con dos medidas en verde. Las dos medían la sombra. Estaba rota, en producción.» | la captura `prueba3-mirala.png`, congelada | `2 EN VERDE` |
| 3-12 | «Primer verde: busqué los textos dentro del archivo. Estaban todos. Verde. Pero buscar sirve para descartar — nunca para confirmar que algo se ve bien.» | el `grep` corriendo, todo en verde | `1 · BUSQUÉ` |
| 12-20 | «Segundo verde: pregunté si la página respondía. Doscientos. Verde. Una página puede responder perfecto y verse rota — son dos cosas distintas.» | el `200 OK` en la terminal | `2 · RESPONDE` |
| 20-28 | «Y esto es lo que se veía: donde iba un candado, decía "credit underscore card underscore off". El nombre del ícono, escrito como texto. En la pantalla de entrar. No lo encontró ninguna prueba: lo encontré abriéndola.» | la pantalla real, zoom al `credit_card_off` | `credit_card_off` |
| 28-35 | «De ahí saqué la regla que más uso: si el instrumento puede dar verde con la cosa rota, el instrumento está roto. La demo completa, para que la corras vos, está desde hoy en mi comunidad. Link en el perfil.» | los 3 archivos de la demo | `LA DEMO · HOY EN LA COMUNIDAD` |

**Cierre:** recurso = comunidad (la demo se entrega ahí).
**Nota de edición:** los dos «verdes» son la misma paleta; el corte al `credit_card_off`
va sin transición — el golpe es el contraste.

🔴 **Corregido hoy (21-sep) — eran dos datos inventados:**
- decía «**tres veces**». La fuente (`CLAUDE.md` §«Verificar es MIRAR») habla de **dos
  instrumentos** (grep + HTTP 200), y **no cuenta veces**. El «tres» salía de leer mal el
  nombre del archivo `prueba3-mirala.png`: la PRUEBA 3 de la demo **no es un verde, es
  abrirla y mirarla**. La propia `demo.sh` cierra: *«Dos instrumentos dijeron que estaba
  bien. Ninguno la había mirado.»*
- decía «**días**» y «**lo encontró otra persona**». La fuente **no dice cuánto tiempo estuvo
  rota**, y dice **«Lo encontró Sergio»** — o sea, vos. Contarlo como que lo encontró un
  tercero invierte el único hecho probado de la historia.

⚠️ **El archivo `demo-falso-verde/demo.sh` tiene el mismo error en su comentario de arriba**
(«los tres verdes»). Su cuerpo está bien. Vive en `carousels/**`, que lo lleva otra sesión:
queda anotado, **no se toca desde este carril**. No afecta al rodaje — el comentario no se ve
al correrla.

---

## F3 · Carrusel del día — «Ahora cuestan lo mismo»

**Ya renderizado, no se edita desde este carril:**
`hermes-content/carousels/out/sergio-mismo-precio-20260921/` (7 láminas).
**Caption:** la del brief `carousels/briefs/sergio-mismo-precio-20260921.json`, tal cual.
**Cuenta:** `@sergiourcullo`. **Cierre:** comentario (la lámina 7 ya lo pide).

**Por qué este y no otro de los cinco:** es noticia y la noticia se vence — Fable 5.1 (1-sep)
y GPT-6 Astra (3-sep, por defecto en Codex el 4-sep) son de hace tres semanas. Los otros
cuatro briefs son casos y reglas: aguantan la semana. Los tres ángulos del día que
comparten espina (verificación) ya están cubiertos por F2, V1, V2 y V4 con historias
distintas, así que el carrusel abre un frente nuevo en vez de repetir.

---

# TRIAL

## T4 · Yap (Samuel) — réplica de F1 con otra edición · ~45 s

*Mismo contenido que el pilar, otra pieza: cara a cámara leyendo el changelog en voz alta,
sin la pantalla partida. El yap es la versión «te lo cuento», no «te lo muestro».*

| Seg | HABLA | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Voy a leer textual la línea que todo el mundo va a citar mal esta semana.» | el changelog abierto, cara a cámara al lado | `TEXTUAL` |
| 3-18 | «Claude Code ahora lee AGENTS punto eme de. Hasta ahí llega el titular. Lo que sigue es lo que se van a saltear: **solo si el proyecto no tiene** CLAUDE punto eme de. Si están los dos, gana CLAUDE y el otro ni se mira.» | la línea del changelog resaltada | `SOLO SI NO HAY CLAUDE.md` |
| 18-32 | «Por qué importa: alguien va a crear su AGENTS punto eme de al lado del que ya tenía, va a quedar convencido de que la IA lo está leyendo, y no. Nadie le va a avisar — no da error, simplemente no lo lee.» | los dos archivos, el AGENTS en gris | `NO DA ERROR · NO LO LEE` |
| 32-45 | «Si ya tenés CLAUDE punto eme de: una línea adentro que diga arroba AGENTS punto eme de y listo. El paso a paso está en la guía de la web, y el archivo armado lo dejo en la comunidad. Link en el perfil.» | la línea escribiéndose | `@AGENTS.md · LA COMUNIDAD` |

**Cierre:** recurso = comunidad. **Mismo gate que F1:** no grabar pantalla en una máquina
con 2.1.267.

---

# TRIAL v2 — Sergio Urcullo a cámara, cero o mínima edición

## V1 · «La regla que se desobedece»

*De la cola del 18-sep (guion A). Respaldo: `CLAUDE.md` §«Verificar es MIRAR» — caso real
de producción del 2026-08-15.*

| Seg | HABLA (literal) | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Escribí una regla para mi IA. La desobedecí el mismo día.» | cara a cámara | `EL MISMO DÍA` |
| 3-12 | «La regla decía: verificá mirando la pantalla. Y aun así di por buena una pantalla sin abrirla — la de entrar al sistema, en producción, mostrando los nombres de los íconos como texto.» | cara a cámara | `LA REGLA ESTABA ESCRITA` |
| 12-24 | «Entonces le agregué una línea a la regla: qué pasó cuando no la cumplí. El caso, con fecha. Desde ahí se cumple. Una regla sola se desobedece. Una regla con su historia al lado, no.» | cara a cámara | `REGLA + HISTORIA` |
| 24-32 | «Y esto no es de la IA: es igual con las personas. La regla que nadie entiende por qué existe es la primera que se rompe. ¿Cuál es la regla de tu negocio que todos se saltean? Contame abajo.» | cara a cámara | `¿CUÁL SE SALTEAN?` |

**Cierre:** pedido de comentario.
🔴 **Corregido hoy:** decía «**Días.**» al final de 3-12. La fuente **no dice cuánto tiempo
estuvo rota** — es la misma invención que se sacó de F2. El resto del guion está intacto.

## V2 · «Terminar no es lograr»

*De la cola del 18-sep (guion B). Es el tramo 3 del guion del video 04
(`yt-04-verificar/GUION.md`).*

| Seg | HABLA (literal) | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Le pedís a la IA que le mande un correo a tus clientes. Termina sin un solo error. Verde.» | cara a cámara | `VERDE` |
| 3-13 | «Armó la lista, mandó, cerró bien. No falló nada. Pero la lista tenía cero clientes. Hizo exactamente lo que le pediste — sobre nada.» | cara a cámara | `LA LISTA TENÍA 0` |
| 13-24 | «Terminar no es lograr. Son dos cosas distintas y el verde solo te cuenta la primera. Me pasó con un script mío: escribió la palabra "undefined" adentro de un archivo y me devolvió "fila agregada". Cumplió. No logró nada.» | cara a cámara | `TERMINAR ≠ LOGRAR` |
| 24-33 | «Y esto es lo caro: un verde que no mide nada te enseña a ignorar el rojo. Cómo armo yo la comprobación que sí mide, lo voy dejando en mi comunidad. Link en el perfil.» | cara a cámara | `TE ENSEÑA A IGNORAR EL ROJO` |

**Cierre:** recurso = comunidad.
**Nota:** el caso del `undefined` / «fila agregada» es real y está verificado —
`handoff/onia-dev-node-setup.md` §5, item 11. Si se prefiere no nombrarlo, se corta esa
frase y el guion queda en 30 s.

## V3 · «El número que repetí cinco veces» — NUEVO

*Ángulo del brief `sergio-dato-heredado`. Lo que el espectador no sabe: el dato falso no
se rompió — **nunca fue cierto**, y se blindó solo a fuerza de repetirse.*

🔴 **[Recontar el día]** los dos números antes de grabar: `crontab -l` en el VPS y en el
nodo de casa. Hoy dicen **40** y **0** (medidos el 18-sep). Si cambiaron, se dice el número
nuevo — la pieza es sobre esto exactamente.

| Seg | HABLA (literal) | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Repetí un número cinco veces. Nadie lo tocó nunca. Y estaba mal desde el principio.» | cara a cámara | `5 VECES` |
| 3-13 | «Yo decía que tenía cuatro tareas automáticas corriendo, en una computadora de mi casa. Lo escribí en un documento, lo copié a un guion, lo puse en una lámina, y estaba por decirlo en cámara.» | cara a cámara | `"4, EN MI CASA"` |
| 13-24 | «Fui a contarlas de nuevo. Son **[Recontar: 40]**, y no están en mi casa: están en un servidor que pago. En la de mi casa hay **[Recontar: cero]**, porque se apaga sola. No era un número viejo: nunca fue el que yo creía.» | cara a cámara | `40 · Y 0 EN CASA` |
| 24-33 | «Lo peor: arriba de ese archivo estaba escrito, por mí, "estos números no cambian, no hace falta recontarlos". Esa frase fue el error. Cómo quedaron armadas esas tareas lo conté entero en mi canal, link en el perfil. ¿Cuál es el dato que repetís sin haberlo vuelto a medir? Contame.» | cara a cámara | `¿LO CONTASTE HOY?` |

**Cierre:** recurso = YouTube 03 («Hago que la IA trabaje mientras duermo», verificado vivo
hoy) + pedido de comentario.

⚠️ **Decisión de Sergio Urcullo antes de grabar:** existe una versión más filosa —decir que
el número equivocado salió *en ese mismo video ya publicado*— que es cierta y sería la
prueba más honesta de la pieza. **No la escribo como opción por defecto porque es su video
publicado y la decisión es suya.** Si dice que sí, la frase de 24-33 pasa a: «Y lo dije así
en el video que tengo publicado. Ahí está, no lo voy a borrar.»

## V4 · «18 errores, y los 18 los encontró él» — NUEVO

*Ángulo del brief `sergio-18-errores`. Lo que el espectador no sabe: se corrige mucho más
de lo que la gente cree, y lo que muerde no es lo que revisó mal — es lo que nadie revisó.*

*Número verificado hoy: 18 items numerados en `handoff/onia-dev-node-setup.md` §5.*

| Seg | HABLA (literal) | EN PANTALLA | OVERLAY |
|---|---|---|---|
| 0-3 | «Conté los errores que quedaron anotados en UNA sesión de trabajo con la IA. Dieciocho.» | cara a cámara | `18` |
| 3-13 | «Antes de que saques conclusiones: los dieciocho los encontró él. Revisando lo que él mismo había escrito. Uno era una comprobación que decía que un programa estaba instalado y no lo estaba. La encontró él y la arregló él.» | cara a cámara | `18 DE 18` |
| 13-24 | «El que me mordió fue otro, y no estaba en esa lista de dieciocho: una pantalla que nadie abrió nunca. Ni él ni yo. Ese llegó al cliente.» | cara a cámara | `EL QUE NADIE REVISÓ` |
| 24-33 | «Entonces la lección no es desconfiar de todo — lo que él revisa está bastante bien. Es saber dónde mirar: lo que muerde es lo que nadie miró. Cómo armo esa lista de "qué mirar sí o sí" lo comparto en mi comunidad. Link en el perfil.» | cara a cámara | `LO QUE NADIE MIRÓ` |

**Cierre:** recurso = comunidad.
**No decir:** «la IA se equivoca 18 veces por sesión» — el dato es de UNA sesión de infra
concreta y documentada, no un promedio. Redondearlo a una regla general lo vuelve falso.

---

# Qué quedó encolado para mañana

**Escrito acá y NO usado hoy** — al armar el día siguiente, mirar esto antes de escribir
nada nuevo (misma regla que [`GUIONES-GUARDADOS-PROXIMO-DIA.md`](GUIONES-GUARDADOS-PROXIMO-DIA.md)).

### D · «Mi instrumento decía 4. Eran 3.» — Trial v2

> Tengo tres agentes propios. Durante semanas dije cuatro.
> El error no fue mío: fue de la herramienta con la que los conté. Le pedí a la máquina
> «contame los archivos de esa carpeta» y me dijo cuatro — porque ahí adentro hay un
> archivo que explica la carpeta, y no es un agente.
> La herramienta no mintió. Contestó exactamente lo que le pregunté. La pregunta estaba mal.
> Antes de creerle a un número, mirá qué está contando de verdad.

Verificado hoy: `ls .claude/agents/` → 3 agentes + `README.md`; `ls *.md | wc -l` → 4.
**Por qué no entró hoy:** el día ya tiene cuatro piezas de la misma espina (F2, V1, V2, V4).
Entra bien como Trial v2 del día siguiente, o como lámina de apoyo del carrusel
`instrumento-roto`.

### Los 4 carruseles restantes de la semana

Ya renderizados en `carousels/out/`, con su caption en el brief. **No los toca este
carril.** Orden sugerido, con una sola restricción de choque:

| Cuándo | Carrusel | Por qué ahí |
|---|---|---|
| mar 22 | `sergio-agents-md-20260921` | hoy el tema lo llevan F1 y T4 en video; el carrusel al día siguiente lo fija, no lo repite |
| mié 23 | `sergio-dato-heredado-20260921` | un día de distancia de V3 |
| jue 24 | `sergio-18-errores-20260921` | idem con V4 |
| vie 25 | `sergio-instrumento-roto-20260921` | 🔴 **el que más lejos tiene que quedar de hoy**: comparte el caso exacto de F2 (`credit_card_off`). Cuatro días de distancia es el mínimo cómodo |

### Pendientes que salieron al escribir esto (no se persiguen desde este carril)

1. 🔴 **`cal.com/sergiourcullo/30min` da 404** (verificado hoy). Sigue escrito así en
   `BRIEF-SAMUEL-VIDEOS.md` §6-7. El link vivo es `sergiourcullo.vercel.app/llamada` →
   `cal.com/sergiourcullo/20min`. Si Samuel graba el video de «cómo agendar» con el brief
   en la mano, graba un 404.
2. 🔴 **La máquina de rodaje tiene Claude Code 2.1.267**; F1 y T4 muestran una función de
   2.1.277. Actualizar antes de grabar pantalla.
3. El **video 04 no está grabado** (deck y guion listos). Hoy ninguna pieza lo promete —
   el único YouTube que se nombra es el 03, que está vivo y verificado hoy.
