# Aviso de automatización en @sergio_urcullo — qué pasó y qué cambia

> 2026-08-24. Instagram le mostró a Sergio: *"We suspect automated behavior on your account.
> To prevent your account from being temporarily restricted or permanently disabled, ensure
> that no other users or tools have access to your account…"*
>
> **La cuenta afectada es `@sergio_urcullo`** — la única de las tres con audiencia real (411).

## 🔴 SEGUNDO AVISO — 2026-08-28. Y la medida del primero NO tocó la causa

Meta le mandó el mismo aviso otra vez. Se rastreó el 29-ago y **la causa sigue encendida**:

> **La app «OnIA Social API» (`2160241918102061`) sigue suscrita a los comentarios de su
> cuenta y los recibe en tiempo real.** No es una sospecha: la ejecución **60926** de n8n, del
> **2026-08-29 a las 03:23 UTC**, trae un comentario de `@ecommerce_th` en un reel suyo,
> firmado por los servidores de Meta (`x-hub-signature-256`, IP `66.220.149.25` = fb.me).

**Eso es literalmente lo que la alerta nombra:** *«ensure that no other users or tools have
access to your account»*. La medida que se tomó tras el primer aviso —publicar a mano— **no
tocó ese acceso**, y por eso el aviso volvió.

### Lo que NO está pasando, para no apagar de más

Desde su cuenta **no sale ningún DM ni publicación automática**. Su bloque en el workflow tiene
el mapa de palabras **vacío**, así que los comentarios entran, se parsean y mueren en
`sin_palabra_clave` — el 28-ago alguien comentó «Reto» y no recibió nada. **Es un arma
cargada, no un arma disparando:** el día que se active una de sus 7 palabras planeadas, empieza
a mandar Private Replies automáticos desde su cuenta.

### La acción correcta, que es UNA sola

**Instagram de Sergio → Configuración → Apps y sitios web → sacar «OnIA Social API» y la
conexión de Postiz.** Desde el teléfono, un minuto. Corta los dos accesos de un golpe, es lo
que Meta espera ver, y **no rompe el circuito de @oniahq**, que es la única cuenta donde el
comentario→DM está entregando algo.

⚠️ **NO apagar el workflow entero** (`1jS4jwmNmvcQpqqH`): eso mataría también @oniahq.

🔴 **Y NO borrar el bloque de su `entry_id` del nodo «Parsear comentario».** Sin ese bloque sus
comentarios caen en la cuenta por defecto (**Lucía**), que **sí** tiene SISTEMA y HUMO activas
— y ahí sí empezaría a mandarle DMs a quien comente en su cuenta. **Sería empeorarlo creyendo
que se arregla.**

### Lo que quedó sin cerrar

- **El equipo de Samuel** publica la etapa 1 (8 videos desde el 19-ago, 2 por semana) y **no
  sabemos con qué herramienta**. Si usan un programador propio además de Postiz, son **dos
  herramientas de publicación sobre la misma cuenta** — la hipótesis #2 del primer aviso.
  **Esta pregunta está abierta desde el 24-ago y sigue sin respuesta.**
- La lista definitiva de apps con acceso solo se ve **en el teléfono**: el MCP de Meta DevTools
  pide autorización interactiva.
- El plazo de publicar a mano vence el **07-sep**.

### Blindaje puesto del lado del repo

`scripts/postiz_schedule.mjs` ahora **rechaza** su integration id (`cmt39kug…`) con un error
explícito, para que un `--integration` copiado y pegado no publique en su cuenta sin querer.

---

## Mi huella real sobre esa cuenta

**Una sola llamada de lectura** (`GET /me`, para averiguar su handle). No se publicó, no se
mandaron DMs y no se programó nada desde ella.

⚠️ **Corrección a mi primera hipótesis.** Dije "apuesto a los 3 DMs duplicados". Esos
salieron **desde @oniahq hacia él**: Sergio fue el receptor, no el emisor. **No explican un
aviso en su cuenta.** El error fue no separar quién emitió de quién recibió antes de opinar.

## Qué toca esa cuenta — son tres partes a la vez

| Quién | Acceso |
|---|---|
| **Postiz** | Cuenta conectada (integración `cmt39kug00022lq9cnw5z12wb`) |
| **Nuestra app de Meta** | Suscrita a sus comentarios por webhook (`entry_id 17841441395192146`) |
| **El equipo de Samuel** | Publicando la etapa 1 — 8 videos desde el 19-ago |

El aviso dice textual *"no other users or tools have access"*. **Tres partes operando la
misma cuenta.**

## Hipótesis, ordenadas

1. 🔴 **Salto brusco de actividad + varias herramientas conectadas.** La cuenta pasó de
   publicar poco a 8 videos en una semana, con 3 accesos de terceros encima. Es el patrón
   clásico.
2. 🟡 **Con qué publica el equipo de Samuel.** Si usan otro programador además de Postiz, se
   suma una conexión más.
3. ⚪ Haber recibido 3 DMs idénticos. Débil, pero no cero.

**No se puede afirmar la causa:** Instagram no dice qué lo disparó. Se actúa sobre las tres.

## 🔴 Lo que CAMBIA en el plan de contenido

**En `@sergio_urcullo`, las próximas dos semanas se publica A MANO desde el teléfono.**
Yo sigo produciendo las piezas; solo cambia quién aprieta el botón.

**Y la cadencia sube gradual, no arranca en 2/día.** Publicar alto volumen por API sobre una
cuenta ya advertida es pedirle a Instagram que la restrinja — y es justo la cuenta que no
podemos permitirnos perder.

| Cuenta | Cómo se publica ahora |
|---|---|
| **@sergio_urcullo** | 🔴 **A mano, desde el teléfono.** Cadencia gradual |
| @oniahq | Por API cuando Postiz vuelva |
| Lucía | Por API, pero **arrancando bajo** — cuenta nueva de 0 seguidores publicando por API es el mismo perfil de riesgo |

## Regla general que sale de esto

**Una cuenta joven o de bajo volumen que empieza a publicar seguido por API, con varias
herramientas conectadas, se ve como un bot.** No importa que el contenido sea legítimo.

- **Una sola herramienta de publicación conectada por cuenta.** No dos.
- **La cadencia se sube gradual**, no se arranca en el objetivo.
- **Parte del volumen se publica a mano**, sobre todo al principio y sobre todo en las
  cuentas nuevas.

## Lo que Sergio tiene que revisar

1. **Instagram → Configuración → Apps y sitios web.** Sacar lo que no reconozca o no use.
2. **Preguntarle a Samuel con qué publica.** Si hay un tercer programador, elegir uno solo.
3. **La contraseña NO se cambia todavía.** Si el acceso es de herramientas propias, cambiarla
   rompe los tokens y no arregla nada. Solo si aparece una app desconocida.
