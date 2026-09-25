# Aviso de automatización en @sergio_urcullo — qué pasó y qué cambia

> 2026-08-24. Instagram le mostró a Sergio: *"We suspect automated behavior on your account.
> To prevent your account from being temporarily restricted or permanently disabled, ensure
> that no other users or tools have access to your account…"*
>
> **La cuenta afectada es `@sergio_urcullo`** — la única de las tres con audiencia real (411).
>
> ⚠️ **Nota del 2026-09-25.** `@sergio_urcullo` era el handle de Sergio Urcullo el día del
> aviso (24-ago). La cuenta se renombró después: hoy es **`@sergiourcullo`** (él lo confirmó el
> 06-sep, commit `2ee86efb`). Las menciones de abajo narran ese día y se dejan como se
> escribieron; la regla que salió de acá —en su cuenta se publica a mano— sigue vigente.

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
