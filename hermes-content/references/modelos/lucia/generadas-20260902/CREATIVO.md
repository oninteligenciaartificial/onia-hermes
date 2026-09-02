# Creativos de anuncio — los videos de café de la receta fancy (E4 · E6)

> Escrito el 2026-09-02. La ventana FANCY (§12–17 de la técnica) dejó tres videos de café en esta
> carpeta y **ninguno tenía creativo**: gancho, caption ni CTA. Estaban mirados y verificados
> —son la prueba 9/9 de la receta— pero listos para mirar, no para publicar.
> Sigue la misma forma que `../generadas-20260828/CREATIVO.md` y `../generadas-20260901/CREATIVO.md`.

## 🔴 Lo que hay que saber antes de usar cualquiera

Los tres animan **la misma escena** (`E3-cafe.png`, café de especialidad, acción a medias con las
dos manos en la taza). Cambian el modelo y la duración. **Formatos verificados con `ffprobe`:**

| Video | Formato real | Audio | Dur. | Modelo | Sirve para |
|---|---|---|---|---|---|
| **E4 café seedance** 🎯 | **720×1280 = 9:16 exacto** | aac | 4,0 s | seedance1_5 · 4,8 cr | Reel/Story tal cual — **el default**, cierra sobre su cara |
| **E6 café 8 s** | **720×1280 = 9:16 exacto** | aac | 8,0 s | seedance1_5 · 9,6 cr | B-roll largo y relajado; el medio es el sorbo (§16) |
| **E4 café kling** ⛔ | 716×1284 (necesita recorte) | aac | 5,0 s | kling3_0 · 8,75 cr | **NO se usa** — termina cabizbaja, cara tapada (§15) |

- **El default es E4-seedance (4 s).** Mirado en `_E4-seedance-frames.jpg`: taza en las dos manos →
  sorbo → baja → **vuelve a mirar al lente con la taza abajo y el latte art a la vista**. Cierra
  sobre su cara, que es la casilla 9. Es el que mejor sirve para un reel de máximo contacto visual.
- **E6 (8 s) es el mismo gesto estirado al doble.** Mirado en `_E6-seedance-8s-frames.jpg`: la cara
  aguanta el clip entero (pecas, tono parejo, sin rojez) pero ~3 s del medio los pasa con la taza
  tapando la boca (§16). Úsalo cuando quieras b-roll calmo, no cuando cada segundo tenga que mostrar
  la cara.
- **E4-kling se guarda, no se publica.** Es la evidencia del §15: mismo prompt, seedance devuelve la
  cara a cuadro y kling muere enterrado en la pose de beber. Su valor es mostrar por qué el default
  del carril es seedance — no entra a la rotación.
- **Ninguno se sube tal cual:** son la capa de imagen. Encima va el gancho quemado con el editor en
  los primeros 2 s. Sin ese texto son b-roll bonito y nada más.

## La forma, y de dónde sale

Misma pieza de referencia que los ocho videos anteriores:
`../../video-intake/2026-08-31-mindshft-nike-desglose-de-costo.md`. Lo que la hace funcionar no es
el video: **desglosa en plata lo que costaría hacerlo a mano** y remata con que lo que desaparece
no es el costo, es *la variable que no controlabas*. Y el café es donde ese argumento pega más
fuerte, porque la escena **parece una producción cara** — el contraste con «no la filmó nadie» es
el más grande del banco.

🔴 **Las cifras van vacías a propósito.** Inventar sueldos bolivianos hunde la pieza ante el primer
dueño que la lea. Antes de publicar, traer el número de una fuente real (lo que Sergio sepa de un
cliente, un aviso de empleo, una planilla) y anotar de dónde salió.

---

## E4 café — 4 s 🎯 (el default publicable)

`E4-cafe-seedance1_5.mp4` · 720×1280 (9:16 exacto) · 4,0 s · aac · seedance1_5 · 4,8 cr.

El sorbo se **completa** en los 4 s y el clip cierra con ella mirando al lente, la taza abajo y el
latte art visible. Escena de café de especialidad, luz cálida de ventana, ladrillo, plantas
colgando, mesas desenfocadas detrás. Es la cara más aspiracional del banco sin editorial de moda.

**Gancho (0–2 s, quemado en pantalla):**
> **Este café parece una producción de agencia. No lo filmó nadie.**

**Caption:**
```
Cuatro segundos de un café lindo. Nadie los filmó.

Lo que costaría filmarlos de verdad:
  · modelo por media jornada         → Bs …
  · permiso para grabar en el local  → Bs …
  · alguien que sostenga la luz      → Bs …

Y la partida que nadie factura: que salga bien el día que grabás, con la luz
justa y la taza en su lugar.

No es que salga más barato. Es que deja de depender de que todo salga bien
el día que grabás.
```

**CTA:** `Escribime ONIA y te muestro cómo se ve tu contenido sin depender de un día de rodaje.`

---

## E6 café — 8 s (el b-roll largo y relajado)

`E6-cafe-seedance-8s.mp4` · 720×1280 (9:16 exacto) · 8,0 s · aac · seedance1_5 · 9,6 cr.

Mismo sorbo estirado al doble. La cara aguanta los 8 s enteros, pero el medio (~t1,6–4,8) lo pasa
con la taza tapando la boca. Sirve cuando querés un plano calmo que respire, no un reel de contacto
visual segundo a segundo. Alcanza para gancho + argumento sin apurar el texto en pantalla.

**Gancho (0–2 s):**
> **¿Cuántos cafés vendiste hoy? ¿Y cuántos quedaron sin cobrar?**

**Caption:**
```
En un café entra y sale movimiento todo el día: la mesa que se fía, el corte
que no se cargó, el consumo del personal que nadie anotó.

No es desorden. Es que a la hora pico, con la barra llena, nadie para a anotar
una taza.

Un sistema no atiende por vos. Registra lo que vos ya no alcanzás a anotar.
```

**CTA:** `Comentá ONIA y te paso cómo se ve tu caja sin cuaderno.`

---

## Antes de subir cualquiera de los dos

1. **Traer las cifras reales** del desglose (sólo E4 lo lleva). Sin fuente, se sacan las líneas de
   plata y queda sólo el argumento.
2. **Quemar el gancho** en los primeros 2 s con el editor. Un clip de 4–8 s sin texto no comunica.
3. **Formato:** ambos ya son 720×1280 = 9:16 exacto — van a Reels/Stories sin re-encuadrar ni
   barras. Para feed 4:5 se recorta a 1080×1350.
4. **Registrar la palabra del CTA** en `scripts/recompensas.json` y en el mapa de n8n **de la
   cuenta que publica** — el que publica es el que recibe el comentario (incidente RANKING).

> ✅ **Resuelto el 2026-09-02:** ya existe [`LEEME.md`](LEEME.md) con el asset id de cada imagen
> E2–E3. **Corrección:** los `job_id` de los videos E4/E6 **NO** estaban en los `_E*.log` — esos
> logs son sólo de imágenes (URL del PNG). Verificado: no hay `job_id` de video guardado en la
> carpeta. No bloquea re-animar (`--start-image` acepta la ruta local de `E3-cafe.png`), sólo se
> pierde recuperar ese render exacto. Detalle en el `LEEME.md`.
