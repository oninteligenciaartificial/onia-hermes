> ✅ **DECIDIDO por Sergio el 01-sep: la palabra es `COMUNIDAD`, no `LUCIA`.**
> El bot no filtra por post y `LUCIA` es el nombre de la cuenta: cualquiera que la escriba para
> saludarla o taggearla recibiría el link sin pedirlo. @mindshft.ai usó «Nike», no «MINDSHFT».

# Caption ALTERNATIVO del post fijado — con palabra clave COMUNIDAD

> Pedido por Sergio el 2026-08-31: *"dame otra caption que diga comenta lucia y te envío el link
> a nuestra comunidad de ai donde enseñamos y enviamos recursos todos los días"*.
>
> **Es una alternativa, no un reemplazo.** El caption sin palabra vive al lado en
> `CAPTION.md` y sigue siendo válido. Se elige uno de los dos.

## El caption

```
Sí, soy IA. Y esta es toda la historia — quién me hace, por qué no lo escondo, y qué vas a ver acá.

Si querés aprender esto en serio: comentá COMUNIDAD y te mando el link de nuestra comunidad de IA. Ahí enseñamos y pasamos recursos todos los días — gratis, sin humo.

Guardalo para cuando alguien te pregunte si soy real.
```

**Hashtags:**

```
#inteligenciaartificial #ia #influencervirtual #bolivia #santacruz #tecnologia
```

## Antes de que esto salga — el paso de Sergio

La palabra ya está registrada en `scripts/recompensas.json` con el link **verificado hoy**:
`https://chat.whatsapp.com/ENplPbR8GrbGsdMrGgLxzu` → HTTP 200, `og:title` = «Onia Community».
Es el mismo grupo que promete STACK desde la cuenta de Sergio.

🔴 **Falta cargar LUCIA en el mapa de palabras del workflow de n8n.** Son 30 segundos en la UI, y
no lo puedo hacer yo (n8n está fuera de este carril). **Hasta que eso esté, `activa: false`**: si
la pieza sale antes, el que comente no recibe nada. Es exactamente el incidente RANKING del
26-ago.

Postiz estando caído **no afecta a esto**: son dos circuitos distintos. Postiz publica; el
DM por comentario lo hace n8n y funciona aunque publiques a mano.

## 🔴 El problema de usar LUCIA como palabra

**El bot no filtra por post.** Cualquier comentario que contenga la palabra dispara el DM, en
cualquier publicación de la cuenta.

Y **LUCIA es el nombre de la cuenta.** En el perfil de Lucía la gente va a escribir «lucia» para
saludarla, para taggearla, para responderle — y todos esos comentarios van a recibir el link de
la comunidad sin haberlo pedido. En la lámina 6 el carrusel además invita a comentar libremente
(*«decime qué te gustaría ver acá»*), así que la colisión empieza en este mismo post.

**Alternativa sin colisión: `COMUNIDAD`.** Dice lo que entrega, nadie la escribe por casualidad,
y el caption cambia una sola palabra:

```
Si querés aprender esto en serio: comentá COMUNIDAD y te mando el link de nuestra comunidad de IA. Ahí enseñamos y pasamos recursos todos los días — gratis, sin humo.
```

La decisión es tuya. Si preferís LUCIA igual, está lista para cargar; sólo sabé que el DM va a
salir más veces de las que esperás.

## Por qué no toqué el brief ni las láminas

El brief `briefs/lucia-quien-es-fijado.json` sigue sin `comment_trigger` a propósito: tocarlo
invita a re-renderizar, y las 7 JPG que ya miraste y vas a publicar quedarían desincronizadas de
lo aprobado. El caption se copia de acá, no del JSON.
