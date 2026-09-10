# Serie «Claude Code de cero»

Fuente de verdad de la serie de YouTube. **Sin fecha en el nombre a propósito**: si algo
cambia, se edita este archivo, no se crea otro.

Los decks viven en `hermes-content/carousels/out/yt-*/`, uno por video, cada uno con su
`README.md` y su `deck.html` autocontenido.

---

## La regla que ordena todo

**Cada video entrega UNA capacidad nueva y verificable.** Si al terminar el espectador no
puede hacer algo que antes no podía, el video no existe: es relleno.

Y el orden no es por dificultad técnica, es por **confianza**. Nadie suelta una
herramienta que no sabe verificar.

> **Son SEIS, no once.** El plan original tenía once y Sergio Urcullo lo cortó:
> *"mejor que no sean tantos, podés tocar varios temas en un solo video"*. Tenía razón —
> once videos para un canal que arranca es una promesa que se abandona en el cuarto. Cada
> uno de estos seis carga dos o tres temas del plan viejo, y **ninguno perdió contenido**:
> se perdieron las portadas, los hooks y los cierres repetidos.

---

## El arco

| # | Video | Nivel | Al terminar, el espectador… | Estado |
|---|---|---|---|---|
| 01 | Qué es Claude y Claude Code | **0 · Entender** | sabe cuál de los dos necesita | ✅ **grabado** |
| 02 | Instalarlo y tu primera skill | **1 · Usarlo** | lo tiene andando y escribió una skill | ✅ **grabado** |
| 03 | Que trabaje sin vos | **1 · Usarlo** | sabe qué es un hook, un subagente y un conector | ✅ deck listo |
| 04 | Cómo saber que no te mintió | **2 · Confiar** | verifica en vez de creerle, y escribe reglas que se cumplen | ✅ deck listo |
| 05 | No construyas lo que ya existe | **3 · Escalar** | instala cosas hechas y le conecta lo que ya usa | ✅ deck listo |
| 06 | Mi empresa entera corre con esto | **Cierre** | ve el sistema completo, con su costo | ✅ deck listo |

**Duración:** 5–7 min el 01. 7–9 min del 02 al 05. El 06 puede ir a 12 y está bien: es el
caso, no una lección.

---

## Qué carga cada uno, y qué NO

### 04 · Cómo saber que no te mintió
> **Promesa:** que diga "listo" no prueba nada. Acá aprendés a comprobarlo.

Absorbe tres del plan viejo: **verificación + reglas que se cumplen + los errores del
primer mes**. Es el video más importante de la serie y el que ningún canal hace, porque
no vende.

- **Material propio:** la pantalla de producción que mostraba los nombres de los iconos
  como texto, "verificada" varias veces con un 200 y un grep, sin abrirla nunca. Y los
  doce errores anotados en una sola sesión, once encontrados revisando.
- **Repara el hueco del 03:** ahí ya se enseñó a soltarlo, y soltar algo que no sabés
  verificar es el error caro.
- **NO va:** frameworks de testing. Es un video sobre el hábito.

### 05 · No construyas lo que ya existe
> **Promesa:** casi todo lo que ibas a escribir, ya está escrito y es gratis.

Absorbe **plugins + skills públicas + conectores**. Es el video con más valor inmediato
por minuto de toda la serie.

- **Material propio:** los 10 marketplaces que tiene instalados, todos verificados vivos.
- **NO va:** construir un servidor MCP desde cero. Otro nivel, otra audiencia.

### 06 · Mi empresa entera corre con esto
> **Promesa:** el sistema completo, con su costo y sus roturas.

Absorbe **paralelo + costo + el caso**. Cruza con la serie del homelab.

- **NO va:** vender Onia. Es contenido, no una demo comercial.

---

## Los repos que se recomiendan — verificados vivos el 2026-09-10

Todos están instalados en su máquina, así que puede decir "los uso yo" sin mentir.
**Se re-verifican antes de grabar**: dos ya cambiaron de nombre desde que los instaló.

| Repo | Qué es |
|---|---|
| `anthropics/skills` | El repo público de Agent Skills. El primero al que hay que ir |
| `anthropics/claude-plugins-official` | Directorio oficial de plugins, mantenido por Anthropic |
| `cloudflare/skills` | Skills de Cloudflare para construir sobre su plataforma |
| `greensock/gsap-skills` | Las oficiales de GSAP, para animación |
| `affaan-m/ECC` | ⚠️ Se llamaba `everything-claude-code`. Colección grande de la comunidad |
| `thedotmack/claude-mem` | Memoria que persiste entre sesiones |
| `Egonex-AI/Understand-Anything` | Convierte un codebase en un grafo que se puede recorrer |
| `multica-ai/andrej-karpathy-skills` | ⚠️ Estaba en `forrestchang/`. Un CLAUDE.md para mejorar el comportamiento |
| `DietrichGebert/ponytail` | Hace que el agente piense como un senior perezoso: menos código |
| `JuliusBrussee/caveman` | Respuestas cortas, sin relleno |

⚠️ **No se muestran estrellas en pantalla.** Cambian todas las semanas y envejecen el
video; además invitan a elegir por popularidad y no por necesidad.

---

## Concordancia — lo que comparten los seis

Un espectador tiene que reconocer un video de la serie sin leer el título.

| Elemento | Forma fija |
|---|---|
| Eyebrow de portada | `Claude Code de cero · 0N` |
| Firma | `@sergiourcullo`, abajo a la izquierda, en todas las láminas |
| Penúltima lámina | **«La parte honesta»** — siempre, sin excepción |
| Última lámina | eyebrow **«En una línea»**, y el remate anuncia el próximo video |
| Sección de prueba | **«Mi caso»**, con cifras medidas ese día |
| Comparativas | eyebrow **«Lado a lado»**, columnas del mismo peso salvo que un lado sea genuinamente menor |
| Patrón visual | `apple-editorial` — Inter + Instrument Serif, acento terracota, sin collage |
| Pedido de comentario | va **hablado** al cierre, no escrito en la lámina |

### «La parte honesta» no es un adorno de formato

Es lo que separa esto de un canal que vende humo, y **son fallas propias con su
consecuencia**, nunca advertencias genéricas. Va penúltima a propósito: después de la
prueba y antes del cierre, donde ya se ganó la credibilidad y todavía se puede usar.

Si un video no tiene una falla propia que contar, **el video está mintiendo o no se hizo
el trabajo**.

---

## Reglas de producción

- **Los números se recuentan antes de grabar, nunca se heredan.** Ya pasó dos veces: la
  versión de Claude Code cambió de `2.1.221` a `2.1.267` en tres días, y dos de los repos
  recomendados cambiaron de dueño. Cada `README.md` de deck lleva la tabla de con qué
  comando se verificó cada dato.
- **Se graba acapela**, mirando el deck. Por eso cada lámina lleva su chuleta en
  `data-nota` y las cifras van escritas en pantalla: improvisando, un número es lo primero
  que se dice mal.
- **Nada de slang.** La audiencia son dueños de negocio y en YouTube el lenguaje fuerte
  cuesta alcance.
- **Ningún precio ni conteo que envejezca.** Solo el que él paga hoy, y dicho como propio.
- **No se dibuja una interfaz que no se miró.** Si hay que mostrar una pantalla, se graba
  la real. Un mockup aproximado en una pieza pública lee como falsificación.
- **Un video que necesita dos horas está mal recortado.** Lo que sobra se anota en el «NO
  va» del siguiente, no se mete a presión.
