# Plan de contenido — qué existe, qué falta, qué sale primero

> Doc vivo, sin fecha en el nombre: se EDITA, no se duplica.
> Escrito el **2026-09-01** contando los archivos, no de memoria.

## El número que importa

**Publicado: 1 post.** Todo lo de abajo está hecho y parado.

| | Producido | Publicado |
|---|---|---|
| Lucía | 11 imágenes · 6 videos · 10 carruseles · 12 historias · 2 reels | **1** |
| @oniahq | 10 briefs limpios · 8 creativos de ads en 3 direcciones | 0 |
| Marca personal | 8 briefs | 0 |

**Producir no es el cuello de botella.** Si mañana genero veinte piezas más, el feed sigue
teniendo un post. El cuello es publicar, y publicar necesita las manos de Sergio: Postiz da 502
y su cuenta personal se publica a mano siempre.

---

## Las tres cuentas, y por qué no son tres embudos

Detalle en [`MODELO_DE_CONTENIDO_DOS_CUENTAS.md`](MODELO_DE_CONTENIDO_DOS_CUENTAS.md). Resumen:
**las dos cuentas van a leads y comentarios**, no a seguidores. Una producción sale por dos
puertas con Colaborador de Instagram. Lo que cambia es **qué CTA pesa**: @oniahq empuja
«reservá una demo», Lucía empuja la comunidad.

⚠️ El que publica es el que recibe el comentario, así que la palabra clave tiene que estar
registrada **para esa cuenta** en `scripts/recompensas.json` y en el mapa de n8n.

---

## LUCÍA — qué hay

**11 imágenes** en `references/modelos/lucia/generadas-*`: café, parada de micro, mercado,
tienda de barrio, oficina de trámites (×3 variantes), peluquería, micro, terraza, y
**consultorio dental** (la más nueva y la mejor).

**6 videos**, todos de 5 s, mudos y **828×1108**. Cada uno con su creativo escrito en
`generadas-20260828/CREATIVO.md`. `V04-parada` está marcado **no se usa en ads**: es la prueba
de la regla de la acción a medias.

**10 carruseles renderizados** + 12 historias + 2 reels, de los cuales **el reel v7 es el día 1
del calendario y está listo desde hace días**.

### Lo que falta, en orden
1. **La primera imagen en 9:16.** Ninguna existe. Es el único cambio que vuelve todo el UGC
   usable en Reels y Stories — ver §7 de `TECNICA-HIGGSFIELD.md`.
2. Animar `G06-peluqueria`, la única imagen con acción a medias clara todavía sin video.
3. Lugares nuevos: ferretería, taller mecánico, restaurante, mall, coworking, veterinaria.

---

## @ONIAHQ — qué hay

**8 creativos de anuncio**, cada uno con su ángulo, y **renderizados en tres direcciones de
diseño** para poder probar cuál pega:

| Dirección | Cuándo va |
|---|---|
| `editorial-photo` | Copy genérico multi-rubro — la foto real del banco hace el trabajo |
| `bloque-solido` | Copy de un rubro específico — no promete una escena que la foto desmienta |
| `bright-retail` | Cuando conviene gritar verde en un feed |

Los ocho ángulos: pacientes que no vuelven · el cuaderno · la silla vacía · las 8 de la noche ·
no faltan pacientes · el cuaderno no falla, falla acordarse · cuántos atendiste el martes
pasado · tu recepcionista no sobra.

**10 briefs de carrusel limpios** en `references/oniahq/briefs/`, con el trigger bien guardado
como palabra sola.

### Lo que falta
- Los 8 hablan de **clínica dental** y sólo hay una foto de consultorio. O se generalizan a
  multi-rubro, o se generan fotos de los otros rubros.
- Ningún creativo se puede subir: **Meta está trabado del lado de Meta** (ver abajo).

---

## MARCA PERSONAL — qué hay

**8 briefs**, desbloqueados el 01-sep cuando Sergio decidió el **verde de Onia** como acento.
⚠️ **Este carril es de la otra sesión**, que tiene el contexto del contrato y los números del IG
de Sergio. Desde acá no se toca.

---

## Qué sale primero — el orden, y su razón

1. **El reel v7 de Lucía (día 1).** 10 minutos de Sergio, todo listo y verificado. Es lo único
   que mueve el número que importa.
2. **Los carruseles de Lucía que ya están renderizados**, uno por día.
3. **@oniahq**, cuando haya feed en Lucía a donde mandar gente.
4. **Los ads**, cuando Meta destrabe.

**El orden no es por calidad, es por dependencia.** Mandar tráfico pago a un perfil con un post
es tirar plata: el que llega mira, no ve nada y se va.

---

## Lo que está bloqueado, y por quién

| Bloqueo | De quién | Estado |
|---|---|---|
| **Publicar** | Sergio | Postiz da 502 → todo a mano |
| **Meta Ads** | **Meta** | La cuenta no acepta método de pago, no deja cambiar divisa, y el límite del portfolio impide crear otra. Ticket abierto |
| **Palabra `COMUNIDAD`** | Sergio | Registrada en `recompensas.json`, falta cargarla en el mapa de n8n (30 s) |
| **Video vertical** | Claude | Resuelto el cómo; falta generar la primera imagen 9:16 |

## Lo que NO está bloqueado

Todo lo que no toca a Meta ni a publicar: generar imágenes y videos, escribir creativos,
renderizar carruseles, probar direcciones de diseño. **El loop puede seguir produciendo sin
esperar a nadie.**
