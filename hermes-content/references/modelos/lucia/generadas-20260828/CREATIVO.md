# Creativos de anuncio — los 5 videos del banco

> Escrito el 2026-09-01. Los cinco videos existían desde el 28-ago **sin un solo creativo**:
> ni gancho, ni caption, ni CTA. Estaban listos para mirar y no para publicar.

> 🔧 **Ampliado 2026-09-02.** El banco tiene un **sexto** video —la peluquería (`V07`/`G06`,
> Pilar B)— que quedaba fuera de este doc: su único creativo era el caption comunitario de
> `PARA-PUBLICAR/D14-lucia-reel-peluqueria/CAPTION.txt`. Se le agrega abajo el **segundo ángulo**
> (desglose de costo), la misma forma que los otros cinco, para poder A/B-testear la misma toma.
> Ver [«V07/G06 — peluquería»](#v07g06--peluquería-pilar-b--segundo-ángulo) al final.

## 🔴 Lo que hay que saber antes de usar cualquiera

**Los cinco son de 5 segundos, mudos y en 828×1108.** Eso importa para ads:

| Problema | Consecuencia |
|---|---|
| **5 segundos** | Alcanza para el gancho, **no** para gancho + argumento + CTA. Meta Reels tolera 5 s, pero el CTA tiene que ir en el caption o superpuesto |
| **Mudos** | No hay voz que sostenga el argumento. Todo el peso cae en el texto en pantalla |
| **828×1108 (≈3:4)** | **No es 9:16.** Para Reels y Stories hay que re-renderizar vertical o aceptar barras |

**Ninguno se sube tal cual.** Son la **capa de imagen**: encima va el texto del gancho, quemado
con el editor. Sin ese texto son b-roll bonito y nada más.

## La forma, y de dónde sale

Copiada de `../../video-intake/2026-08-31-mindshft-nike-desglose-de-costo.md`. Lo que hace
funcionar a esa pieza no es el video: es que **desglosa en plata lo que costaría hacerlo a mano**
y remata con *«no es que sea más barato, es que desaparece la variable que no controlabas»*.

🔴 **Las cifras van vacías a propósito.** Inventar sueldos bolivianos es lo que hunde la pieza
ante el primer dueño de negocio que la lea. Antes de publicar cualquiera de éstas hay que traer
el número de una fuente real —lo que Sergio sepa de un cliente, un aviso de empleo, una planilla—
y anotar de dónde salió.

---

## V05 — oficina de trámites 🏆

**El mejor del banco.** Dos manos sobre el mismo formulario; el modelo completa el traspaso sin
inventar habla ni giros. Es el único que ya cuenta algo solo.

**Gancho (0-2 s, quemado en pantalla):**
> **El trámite no lo hace la IA. Lo hace el que ya no tiene que acordarse.**

**Caption:**
```
Esto son 5 segundos de una fila de trámite. Nadie los filmó.

Lo que costaría filmarlos de verdad:
  · modelo por media jornada     → Bs …
  · permiso para grabar adentro  → Bs …
  · alguien que sostenga la luz  → Bs …

Y la partida que nadie factura: que la señora del mostrador tenga buen día.

No es que salga más barato. Es que deja de depender de que todo salga bien
el día que grabás.

Lo mismo pasa con tu negocio: el problema no es el precio de la persona.
Es que el sistema depende de que se acuerde.
```

**CTA:** `Escribime ONIA y te muestro cómo se ve tu semana ordenada.`

---

## V03 — tienda de barrio, el vuelto

El intercambio de monedas **se desarrolla** en los 5 s: él entrega, ella recibe. Acción clara,
cara estable.

**Gancho:**
> **Este vuelto lo anotó alguien. ¿Dónde?**

**Caption:**
```
En el cuaderno, si se acordó. En ningún lado, si estaba apurado.

No es un problema de honestidad ni de orden. Es que a las siete de la tarde,
cansado, nadie se acuerda de anotar.

Un sistema no reemplaza al que atiende. Le saca lo que odia hacer.
```

**CTA:** `Reservá 20 minutos y te muestro cómo queda tu caja sin cuaderno.`

---

## V02 — mercado, con la casera

La foto ya traía la mano acercando el tomate y el modelo sólo la continuó. **Suma interacción con
otra persona**, que es lo que más lo aleja de una foto de campaña.

**Gancho:**
> **Ella sabe cuánto vendió hoy. ¿Vos?**

**Caption:**
```
La casera del mercado lleva la cuenta en la cabeza y casi nunca se equivoca.

Vos tenés más productos, más precios y más gente. Y la misma cabeza.

Ahí es donde un sistema deja de ser un lujo y pasa a ser el único que se acuerda
de todo.
```

**CTA:** `Comentá SISTEMA y te paso cómo se ve por dentro.`

---

## V01 — farmacia

B-roll. La cara aguanta los 5 s, pero **no hay acción a medias clara**: es el más débil de los
cuatro usables.

**Gancho:**
> **Lo que no está anotado, no existe.**

**Caption:**
```
Una farmacia mueve cientos de movimientos por día. El que no queda registrado
no se puede cobrar, ni reponer, ni reclamar.

No hace falta un sistema grande. Hace falta uno que registre solo.
```

**CTA:** `Escribime ONIA y lo vemos con tus números.`

⚠️ Por ser el más flojo, **va último en la rotación de prueba**. Si algún día hay que bajar uno
de los cuatro, es éste.

---

## V04 — parada de micro · ⛔ NO SE USA EN ADS

**Se guarda a propósito, no se publica.** Es la prueba de la regla de la acción a medias: animada
desde la única imagen SIN acción —está sentada esperando—, el modelo se inventó el movimiento:
gira la cabeza, **abre la boca como si hablara** (no hay diálogo) y en el último segundo se da
vuelta y pierde la cara.

Un anuncio con la cara perdiéndose en el segundo 5 es un anuncio roto. **No entra a la rotación.**

Y no se regenera: **su valor es mostrar el defecto.** Es el mismo caso que
`G01-cafe-pizarra-texto`, que inventa texto adrede.

---

## Antes de subir cualquiera de los cuatro

1. **Traer las cifras reales** del desglose. Sin fuente, se sacan las líneas de plata y se deja
   sólo el argumento.
2. **Quemar el gancho** en los primeros 2 segundos con el editor. Sin eso, un clip mudo de 5 s no
   comunica nada.
3. **Re-encuadrar a 9:16** o aceptar barras. Hoy son 828×1108.
4. **Registrar la palabra del CTA** en `scripts/recompensas.json` y en el mapa de n8n **de la
   cuenta que publica** — el que publica es el que recibe el comentario. Es el incidente RANKING.

---

## V07/G06 — peluquería (Pilar B) · segundo ángulo

**El sexto video del banco, y el único distinto en especie.** No es cost-desglose de Onia:
nació **Pilar B** (no nombra a Onia), animando `G06-peluqueria.jpg` desde el espejo. La peluquera
sostiene el mechón mojado y la tijera **avanza y cierra sobre las puntas** en los ~4 s —acción a
medias de las más claras del banco— y la mano sale de cuadro dejando la cara al final. Mirado esta
vuelta en `_V07-TIRA.jpg`: cara idéntica cuadro a cuadro (pecas, aro de oro, cadenita), ventilador
girando, ningún cartel legible.

🔴 **Ojo, no es como los otros cinco:**

| | V01–V05 | **V07/G06 peluquería** |
|---|---|---|
| Formato | 828×1108 (≈3:4) | **720×1280 = 9:16 exacto** — no necesita re-encuadre |
| Audio | mudos | **con pista de sala** |
| Duración | 5 s | ~4 s |
| Pilar | nombra/insinúa Onia | **Pilar B, no nombra Onia** |

🔴 **Es un solo render con tres nombres.** `G06-peluqueria-video-seedance.mp4`,
`V07-peluqueria-seedance.mp4` y `PARA-PUBLICAR/D14-lucia-reel-peluqueria/lucia-peluqueria-REEL-720x1280.mp4`
son **byte-idénticos** (mismo md5 `18a8ed46…`). No re-animar creyendo que falta: es el mismo clip.

**Ya tiene un creativo vivo:** el caption comunitario *«Esta peluquería no existe. Yo tampoco»*
en `D14/CAPTION.txt`, con CTA **COMUNIDAD**. Lo de abajo es el **segundo ángulo** —el desglose de
costo— para testear la misma toma con otro mensaje. Reutiliza la palabra **COMUNIDAD** a propósito:
ya está cableada en n8n para este reel (D14), así que no abre trabajo nuevo de recompensas.

**Gancho (0–2 s, quemado en pantalla):**
> **Ningún camarógrafo entró a esta peluquería. No hizo falta.**

**Caption:**
```
Un reel así, filmado de verdad, cuesta:
  · camarógrafo media jornada        → Bs …
  · edición y color del clip         → Bs …
  · cuadrar día, luz y una clienta   → Bs …

Y la partida que nunca se cotiza: que ese día salga todo bien —la luz, la
clienta, la peluquera de humor— para grabar los 4 segundos que servían.

Esto salió en minutos, desde una compu, sin nadie en el local. No es que sea
más barato: es que desaparece la variable que no controlabas.

Tu negocio puede tener su propio contenido con movimiento, sin esperar una
producción entera.
```

**CTA:** `Comentá SISTEMA y te muestro cómo se hace el de tu local.`

⚠️ **Cifras vacías a propósito**, como el resto del doc: antes de publicar, traer un número real
(un presupuesto de filmación, lo que cobra un camarógrafo en Santa Cruz) y anotar de dónde salió.
Sin fuente, se sacan las líneas de plata y queda sólo el argumento.
