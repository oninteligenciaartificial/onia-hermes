# Semana del 22 · los 5 carruseles, con su caption y su día

> Rehechos el **21-sep** en el patrón **apple-editorial**. Antes estaban rendidos con el
> motor de PRODUCTO (`carousel_render.js --pack typographic`), que es otro lenguaje
> visual y **no dibuja el `callout` del brief**: ocho datos de los briefs se perdían en
> silencio, y ninguna pieza traía la lámina F. Los briefs viejos
> (`carousels/briefs/sergio-*-20260921.json`) quedan como fuente del copy; las piezas
> vivas son las de `carousels/out/apple-*-inter/`.
>
> Uno por día, no cinco el mismo día: el reparto diario deja **un solo carrusel en el
> feed** ([`ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md`](../ONIA_ESTRUCTURA_PUBLICACION_DIARIA.md)).

## La cola

| Día | Pieza | Qué enseña que el lector no sabía | Paquete |
|---|---|---|---|
| **lun 22** | MISMO-PRECIO (6 lám) | Fable 5.1 y GPT-6 Astra cuestan **lo mismo por token**: el precio dejó de ser el criterio | `S22-LUN-IG-MISMO-PRECIO-para-publicar` |
| **mar 23** | AGENTS-MD (6 lám) | Claude Code ya lee `AGENTS.md` — **pero sólo si el proyecto no tiene `CLAUDE.md`** | `S22-MAR-IG-AGENTS-MD-para-publicar` |
| **mié 24** | INSTRUMENTO-ROTO (6 lám) | dos comprobaciones en verde sobre una pantalla rota, y la regla que salió de ahí | `S22-MIE-IG-INSTRUMENTO-ROTO-para-publicar` |
| **jue 25** | DATO-HEREDADO (6 lám) | un número repetido 5 veces que al recontarlo era **10 veces más grande** | `S22-JUE-IG-DATO-HEREDADO-para-publicar` |
| **vie 26** | 18-ERRORES (6 lám) | 18 errores anotados, **4 de una sola sesión**, y los 18 autodetectados | `S22-VIE-IG-18-ERRORES-para-publicar` |

Todas a **`@sergiourcullo`**. Cada ZIP trae su `HOJA-*.png`: **mirarla antes de subir**.

---

## 🔴 Dos datos que se corrigieron el 21-sep, y de dónde salió la corrección

Las piezas originales llevaban dos afirmaciones que **no aguantaron el reconteo**. Van
acá con su fuente para que nadie las vuelva a heredar:

| Decía | Es | Fuente, contada a mano el 21-sep |
|---|---|---|
| «18 errores en **una** sesión» | **18 anotados**, de los cuales **4** son de una sola sesión | `docs/handoff/onia-dev-node-setup.md` §5: §5.1 se titula «De esta sesión» y tiene 4; §5.2 tiene 9 y §5.3 tiene 5 |
| «los 18 los **encontró** él» | los **anotó** él | `grep -i "sergio\|lo encontr"` dentro de §5 da **cero**: la lista es su propio parte, en primera persona. «Anotó» se prueba; «encontró» no |
| «la di por buena **tres veces**» · «durante **días**» | **dos instrumentos** (grep + HTTP 200). La duración **no tiene fuente** y se sacó | `CLAUDE.md` §«Verificar es MIRAR»: *«lo había verificado varias veces con HTTP 200 y grep»*. No dice cuánto duró |
| «lo **encontró otra persona**» | en la voz de Sergio Urcullo, **lo encontró él mismo** al abrirla | `CLAUDE.md`: *«Lo encontró Sergio»*. Lo que no lo encontró fue ninguna de las dos pruebas — y ésa es justo la moraleja |
| «lo repetí **cinco veces**» | **no se puede contar hoy** | De los lugares donde vivió el dato falso ya sólo queda uno. Va la cadena documentada (documento → guion → lámina), que sí se prueba |
| «**5.270** reacciones» · «el **pedido #1** del repo» | **fuera** | El changelog oficial (leído hoy) confirma la función y el matiz **al pie de la letra**, pero no trae ranking ni reacciones; la búsqueda de issues devuelve varios hilos de AGENTS.md, ninguno con esa cifra |

Es exactamente el error que denuncia la pieza del jueves. Si la pieza miente sobre
mentir, no se publica.

## 🔴 La regla del titular, dictada el 21-sep

> Sergio Urcullo, sobre la primera versión: *«cambia los títulos que digan literalmente a
> qué te referís; decís cosas como "conté mis errores, los anoté todos" — no estás
> diciendo nada. Hacelos enseñando cosas de verdad»*.

**El titular ES el hallazgo, no su anuncio.** Prueba rápida: si el titular se puede poner
en una pieza de otro tema, está mal escrito.

| Antes (no dice nada) | Ahora (enseña) |
|---|---|
| «Conté mis errores. Los anoté todos» | **«18 errores. Los 18 los anotó él»** |
| «Un dato viejo no es un dato» | **«Decía 4. Fui a contarlo: eran 40»** |
| «Si da verde con la cosa rota…» | **«Dos verdes. Y la pantalla estaba rota»** |
| «El precio ya no decide» | **«Fable 5.1 y GPT-6 Astra cuestan igual»** |
| «Un archivo de reglas. Los dos» | **«Claude Code ya lee el archivo de Codex»** |

Vale igual para los titulares de adentro: «Lo van a contar mal» → **«Sólo si NO tenés
CLAUDE.md»**; «Me avisé a mí mismo» → **«"No hace falta recontarlos"»**.

---

## Captions · copiar tal cual

### lun 22 · MISMO-PRECIO

Anthropic sacó Fable 5.1 el 1 de septiembre. OpenAI sacó
GPT-6 Astra el 3, y el 4 ya era el modelo por defecto de Codex.

Por primera vez cuestan exactamente lo mismo por token.

O sea: el precio dejó de ser el criterio. Y cuando el precio
empata, elegís por otra cosa. Los tres que uso yo:

1. DÓNDE VIVÍS. Si trabajás en la terminal y querés escribir
   tus propias reglas, Claude Code. Si tu equipo ya está metido
   en el mundo de OpenAI, Codex te va a doler menos.
2. QUIÉN REVISA. Los dos reparten tareas entre varios agentes.
   Mirá cuál te muestra mejor qué hizo cada uno: vas a vivir
   ahí adentro.
3. PROBALOS UNA SEMANA. No los compares leyendo comparativas.
   Dales la misma tarea real a los dos y mirá cuál te hizo
   corregir menos.

¿Cuál usás vos, y por qué? Leo todos los comentarios.

### mar 23 · AGENTS-MD

Si usabas Claude Code y Codex, escribías tus reglas dos veces.

Se acabó: Claude Code ya lee AGENTS.md, el archivo que usan
Codex, Cursor y Copilot. Un archivo, los cuatro programas.

Pero lo van a contar mal, así que te lo digo derecho: lo lee
SOLO si tu proyecto no tiene CLAUDE.md. Si están los dos, gana
CLAUDE.md y AGENTS.md se ignora entero.

Qué hacés hoy:
· Arrancás de cero → escribí solo AGENTS.md y te sirve para los
  cuatro programas.
· Ya tenés CLAUDE.md andando → no lo borres. Metele adentro una
  línea que diga @AGENTS.md.

Adentro va lo que hoy le explicás en cada chat: cómo escribís,
qué no se toca, qué se verifica antes de dar algo por hecho.

Guardalo para cuando te sientes a configurarlo.

¿Ya tenés tus reglas escritas, o se las explicás de nuevo cada
vez? Contame.

### mié 24 · INSTRUMENTO-ROTO

Di por buena una pantalla sin abrirla nunca.

El buscador encontraba todos los textos: verde. El servidor
respondía 200: verde. Dos medidas en verde.

La pantalla estaba rota. Donde iba un candado decía
«credit_card_off» — el NOMBRE del ícono, como texto. En la
pantalla de entrar, en producción. No lo encontró ninguna de
las dos pruebas: lo vi cuando por fin la abrí.

Los dos verdes medían un sustituto, no la cosa. Buscar sirve
para descartar, nunca para confirmar. Y una página puede
responder perfecto y verse rota.

De ahí salió la regla que más uso: si tu comprobación puede dar
verde con todo roto, no es una comprobación. Es un instrumento
roto.

Abrilo. Miralo. Después decí listo.

¿Qué «verde» tenés hoy que nunca abriste? Contame cuál y te
digo cómo lo miraría.

### jue 25 · DATO-HEREDADO

Tenía un número anotado. Lo escribí en un documento, lo copié
a un guion, lo copié a una lámina, y estaba por decirlo en
cámara.

Fui a contarlo de nuevo. Estaba mal, y no por poco: era diez
veces más grande. Nadie lo había tocado. Simplemente nunca fue
el número que yo creía.

Lo peor: arriba de ese archivo estaba escrito, por mí, «estos
números no cambian, no hace falta recontarlos». Esa frase no
era un ahorro de tiempo. Era el error, firmado.

Por qué pasa: cada vez que copiás un dato de tu propio
documento, se siente más cierto. Pero no lo volviste a medir
ni una sola vez. Repetir se siente como saber, y no lo es.

La regla, y cuesta dos minutos: recontá antes de afirmarlo.
Sobre todo si lo vas a decir en público, cobrar por eso, o
tomar una decisión con eso.

¿Ese número tuyo lo contaste HOY? Si la respuesta es «lo tenía
anotado», andá a contarlo.

### vie 26 · 18-ERRORES

«¿Y si la IA se equivoca?» Es la pregunta que todos hacen antes
de empezar. La respuesta corta: se equivoca, bastante. La
respuesta larga es más útil, y tiene número.

Conté los errores que quedaron anotados trabajando con Claude
Code: dieciocho. Cuatro de una sola sesión; el resto, de días
sobre lo mismo. Diagnósticos equivocados, comprobaciones que no
comprobaban nada, datos viejos repetidos sin recontar.

Lo que no me esperaba: los dieciocho los anotó él, en primera
persona, mientras revisaba lo que él mismo había hecho. Ninguno
lo cacé yo.

Y el único que se le escapó fue justo el que llegó al cliente
—porque no estaba en su lista, ni en la mía.

La lección no es desconfiar de todo: lo que él revisa está
bastante bien. Lo que te muerde es lo que NADIE miró.

¿Cuántos «listo» diste por buenos sin abrirlos? Yo di tres
seguidos. Contame abajo.

---

## Cómo se rehace cualquiera de las cinco

```bash
python scripts/marca-personal/generar-apple-editorial.py --pieza mismo-precio
python scripts/marca-personal/empaquetar-carrusel.py mismo-precio --nombre S22-LUN-IG-MISMO-PRECIO-para-publicar
```

Piezas: `mismo-precio` · `agents-md` · `instrumento-roto` · `dato-heredado` · `errores-18`.

⚠️ **El gate `--check` reporta «la sonda no devolvió medidas» en la lámina 01 de toda
pieza con layout P.** Es un límite conocido del gate, no un defecto: `noticia-whatsapp`,
que ya estaba aprobada, falla idéntico. La portada se verifica MIRÁNDOLA.
