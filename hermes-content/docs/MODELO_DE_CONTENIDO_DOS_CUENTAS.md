# Cómo se reparte el contenido entre @oniahq y Lucía

> Doc vivo, sin fecha en el nombre: se EDITA, no se duplica.
> Escrito el **2026-09-01** corrigiendo un modelo que yo había planteado mal.

## La corrección que lo origina

Yo había separado las dos cuentas en dos embudos con objetivos distintos: **ONIA a leads,
Lucía a seguidores**. Sergio lo corrigió el 01-sep:

> *«lucía también puede vender onia, los dos vamos a leads y comentarios, onia también ugc de
> lucía o de otro perfil o lucía como colaborador para postear en los dos, onia va a reservar,
> lucía también, para más a comunidad»*

**No son dos embudos. Es UNA producción con DOS puertas de salida.** El error de mi versión era
tratar a Lucía como una cuenta de marca a la que hay que hacerle audiencia antes de que sirva —
cuando en realidad **es la cara que hace vendible a @oniahq**.

## El modelo

| | **@oniahq** | **Lucía** |
|---|---|---|
| Objetivo | **Leads y comentarios** | **Leads y comentarios** — el mismo |
| Voz | La empresa | Una persona que muestra IA sin humo |
| CTA que pesa | **Reservá una demo** | **La comunidad** |
| Pero también usa | La comunidad | Reservar |
| Aterriza en | `onia.com.bo` | La comunidad, y de ahí a Onia |

**Las dos van al mismo lugar por caminos distintos.** La cuenta de empresa convence al que ya
tiene el problema; Lucía convence al que todavía no sabe que la IA le sirve. Ninguna de las dos
existe para juntar seguidores.

## La pieza se produce UNA vez y sale por las dos puertas

El mecanismo es **Colaborador de Instagram**: un post con dos cuentas colaboradoras aparece en
los dos feeds y suma las métricas de los dos. Una producción, dos audiencias.

```
                    ┌─ se publica desde @oniahq, con Lucía como colaboradora
UGC de Lucía ───────┤
                    └─ o desde Lucía, con @oniahq como colaborador
```

**Qué cambia según quién publica:** el que publica es el dueño del post y el que recibe el
comentario. Entonces **la palabra clave del CTA tiene que estar registrada para ESA cuenta**
en `scripts/recompensas.json` (campo `activa_en`), no para la otra. Es el incidente RANKING otra
vez: si la palabra no está viva en el mapa de n8n de esa cuenta, el lead comenta y no recibe nada.

## Qué NO cambia

- 🔴 **Un carrusel de anuncio no es un carrusel orgánico.** El orgánico dice «DESLIZÁ →» y pide
  comentar una palabra; el de anuncio lleva un link por tarjeta. Un comentario no es una
  conversión medible; un clic sí. Meter los orgánicos tal cual a Ads es pagar por tráfico que
  muere en un comentario que nadie contesta.
- 🔴 **La cara sale sólo con `@lucia-skin-v1`.** Si @oniahq publica UGC «de otro perfil», ese
  otro perfil necesita su propio element, no se improvisa.
- 🔴 **Lucía declara que es IA.** La etiqueta de Creador de IA está activada desde el 31-ago, y
  el argumento de venta ES la declaración, no un costo a esconder.

## El orden del gasto, y por qué

Los estáticos los hace el renderer a **coste cero**; un video de Lucía cuesta **6,25 créditos
como mínimo** y hasta 30 si se erra la resolución.

Y lo que gana o pierde un anuncio es el **gancho**, que es texto. Entonces:

1. **Probar ganchos en estático** — muchas variantes, cero créditos.
2. **El gancho que gana se viste de video**, en 9:16, con Lucía.
3. **Los carruseles orgánicos** alimentan los dos perfiles, para que el anuncio tenga a dónde
   mandar a la gente.

No es preferencia de formato: es no gastar diez videos para descubrir que la frase estaba mal.
