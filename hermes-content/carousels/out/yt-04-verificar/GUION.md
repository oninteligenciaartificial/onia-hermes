# Guion hablado — Video 04 · «La IA te dice "listo" y te está mintiendo»

11 láminas · ≈ 8:00 · se graba acapela mirando el deck (tecla **N** apaga las chuletas).

⚠️ **RECONTADO TRES VECES, Y LAS TRES VECES APARECIÓ ALGO MAL.** Este bloque es el
historial, no adorno: se lee antes de grabar.

1. **La primera cabecera decía** *"los números de este video no cambian, no hace falta
   recontarlos"*. Por no recontarlos, el dato central era falso: decía **12 errores**.
2. **El 18-sep se recontó y salió 18** — correcto, y sigue siendo correcto: `§5` de
   `hermes-content/docs/handoff/onia-dev-node-setup.md` tiene **18** ítems numerados
   (4 en §5.1 + 9 en §5.2 + 5 en §5.3), y **ninguno** atribuido a Sergio Urcullo.
   Recontado hoy, 21-sep:
   `awk '/^## 5\./{f=1} /^## 6\./{f=0} f' <archivo> | grep -cE '^[0-9]+\. '` → **18**.
3. **Pero esa corrección metió DOS errores nuevos, y son los que se arreglan hoy:**
   - ❌ *"El «12» no sale de ninguna parte."* **Sí sale.** La versión del **2026-09-06**
     de ese MISMO archivo abre §5 diciendo, textual: *«Doce. Once los agarré verificando;
     el primero lo agarró Sergio Urcullo.»* — o sea el «12, y 11 revisando» del material
     viejo estaba bien sacado, sólo que de una versión vieja.
     `git show 1726b799:hermes-content/docs/handoff/onia-dev-node-setup.md`
   - ❌ *"Contados en las seis versiones del archivo."* **No son seis: son 25 commits**, y
     el conteo NO fue siempre 18 — las versiones del 5 y 6 de septiembre tienen 12, 6 y 5
     ítems bajo otro título. El 18 es sólo de las versiones del **8 de septiembre**.
     `git log --oneline -- <archivo> | wc -l` → **25**.

🔴 **Y el hallazgo que obliga a cambiar el guion: los 18 NO son de una sola sesión.** El
propio §5.1 se titula *«De esta sesión»* y tiene **4** ítems; los otros 14 se acumularon a
lo largo del carril. Los commits de ese archivo van del **2026-09-04 al 2026-09-08** —
**cinco días** — y **10 de los 18** están palabra por palabra ya en la versión del 06-sep
(esa versión tenía exactamente **12** ítems, de ahí salía el número viejo).
**En cámara se dice «cinco días», no «una sola sesión».**

**El reparto sí estaba bien:** en la versión de HOY de §5 no hay ni un error atribuido a
Sergio Urcullo. El que encontró Sergio Urcullo es **el de la pantalla de entrar** — otro
carril, otro día, y el único que llegó a producción.

---

**1 · Hook (0:00–0:25)**
> Soy Sergio Urcullo, tengo 16 años y corro mi empresa entera con esto.
> Y hoy te voy a contar la vez que me dijo «listo» y no estaba listo.
> Porque te va a pasar. Y lo peor es que no te vas a enterar.

**2 · El caso (0:25–1:25)** — *contalo con vergüenza, no con distancia*
> Tenía una pantalla en producción. La pantalla donde la gente entra al sistema.
> La di por buena dos veces.
> La primera: respondía bien, sin un solo error. Verde.
> La segunda: busqué las palabras adentro del archivo, y ahí estaban todas.
> Nunca la abrí.
> Cuando por fin la abrí, los íconos se veían como palabras sueltas. En la pantalla de entrar. En producción.
>
> *[DEMO EN VIVO — `demo-falso-verde/demo.sh`. Corrés las tres pruebas en pantalla:
> el grep encuentra los cuatro textos → verde. La página responde 200 → verde.
> Y al abrirla dice «credit_card_off» donde va un candado.]*
> Mirá. Los dos me dijeron que estaba bien. Ninguno de los dos la había mirado.

**3 · Por qué pasa (1:25–2:15)**
> ¿Y por qué pasa esto? Porque terminar y lograr no son lo mismo.
> Mirá: le pedís que mande un correo a tus clientes. Prepara la lista, manda los correos, termina sin errores. Verde.
> Pero la lista tenía cero clientes. No lo recibió nadie.
> No falló. Hizo exactamente lo que le pediste, sobre nada.
> Y un verde que no mide nada te enseña a ignorar el rojo.

**4 · Lado a lado (2:15–3:05)** — *la lámina que se pausa, dale aire*
> Entonces, ¿cómo distinguís algo que parece verificado de algo que lo está?
> Una pantalla: parece, porque responde sin error. Lo está, cuando la abriste y la miraste.
> Un cambio: parece, porque dice que lo hizo. Lo está, cuando viste qué líneas tocó.
> Un envío: parece, porque terminó. Lo está, cuando contaste cuántos llegaron.
> Y un dato: parece, porque te lo dijo antes. Lo está, cuando lo volviste a contar hoy.
> La columna de la derecha tarda dos minutos más. Dos.

**5 · Las tres preguntas (3:05–3:55)**
> Y para no tener que acordarte de todo eso, son tres preguntas, siempre las mismas.
> ¿Lo miré? Si es algo que ve una persona, se abre y se mira. Una búsqueda sirve para descartar, nunca para confirmar.
> ¿Cuánto salió? Un número, no un «listo». Cuántos correos, cuántas filas, cuántos segundos.
> ¿Lo conté hoy? Un dato de la semana pasada es una suposición con cara de dato.
> Mirar, medir, volver a contar.

**6 · El puente (3:55–4:25)**
> Ahora, seamos honestos: hacer esas tres preguntas todos los días, en todo, cansa.
> Por eso uno escribe reglas. «Siempre mirá la pantalla antes de decir que funciona.»
> Y a la semana siguiente nadie la mira.
> A esa regla le falta la única parte que la hace obedecer.

**7 · La idea más útil (4:25–5:15)**
> Le falta el porqué.
> Mirá la diferencia. La misma regla, pero con lo que pasó cuando no se cumplió: la pantalla de entrar mostró los nombres de los íconos como texto, en producción, y yo la había dado por buena dos veces sin abrirla nunca.
> Esa segunda mitad es la que hace que se cumpla.
> **Una regla sin su historia se desobedece.** Con el caso real que la originó, no.
> Y esto no es sólo para la IA. Funciona igual con las personas.

**8 · Los del primer mes (5:15–6:05)**
> Y ya que estamos, los tres errores que hacen abandonar esto en el primer mes.
> Uno: pedirle todo junto. Cinco cosas a la vez salen las cinco a medias. Un objetivo por sesión, terminado.
> Dos: creerle el resumen. El resumen de lo que hizo lo escribe él. Mirá los cambios, no el resumen.
> Tres: escribir veinte reglas el primer día. No se cumplen. Una por cada cosa que te salió mal dos veces, sí.
> Ninguno de los tres es técnico. Los tres son de hábito.

**9 · Mi caso (6:05–6:40)**
> Te doy el número, y es incómodo.
> En cinco días trabajando sobre una misma cosa quedaron anotados dieciocho errores suyos.
> Y acá está lo que no me esperaba: los dieciocho los encontró él. Revisando su propio trabajo, solo.
> Se corrige muchísimo más de lo que la gente cree.
> Pero el de la pantalla de entrar no está en esa lista. Ese se le escapó, y lo encontré yo, abriéndola — en producción.
> Y ese es todo el punto: el que se le escapa es justo el que llega al cliente.
> Casi ninguno era un error de código. Eran comprobaciones que no comprobaban nada.
>
> Y de los dieciocho hay uno que los resume a todos. Lo escribió él mismo al final del registro:
> **si el instrumento puede dar verde con la cosa rota, el instrumento está roto.**
> El favicon en vez del contenido. La fecha del archivo en vez del archivo. El «terminó sin error» en vez de lo que entregó.

**10 · La parte honesta (6:40–7:35)** — *no la suavices*
> Ahora te voy a decir algo que me deja mal parado.
> Yo tampoco lo hago siempre.
> Cuando tengo apuro, le creo. Y las veces que me mordió fueron todas con apuro. No es casualidad.
> Escribí una regla que dice «verificá mirando» y la desobedecí el mismo día que la escribí.
> Esto no se aprende leyendo. Se aprende cuando algo tuyo se rompe en público.
> Yo te lo cuento para que te salga más barato que a mí.

**11 · Cierre (7:35–8:00)**
> Tres preguntas. ¿Lo miré? ¿Cuánto salió? ¿Lo conté hoy?
> No le creas. Comprobalo.
> Contame en los comentarios una vez que le creíste y no debías — los leo todos, y las peores son las más útiles.
> Y suscribite, porque en el próximo te muestro algo que me hubiera ahorrado meses: casi todo lo que ibas a escribir ya está escrito, y es gratis.

---

## Trampas de este video

- **El caso de la pantalla es real y es suyo.** Contarlo en primera persona y sin adornar
  es lo que sostiene todo lo demás. Si suena a ejemplo inventado, el video se cae.
- **La parte honesta no repite el tema.** Todo el video habla de errores; la penúltima
  lámina es otra cosa — que él tampoco verifica siempre. Repetir sería relleno con nombre
  de sección.
- **Nada de frameworks de testing.** Es un video sobre el hábito. Nombrar herramientas acá
  lo convierte en otro video, y en uno peor.
