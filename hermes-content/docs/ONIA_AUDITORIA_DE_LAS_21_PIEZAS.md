# Auditoría de las 21 piezas producidas

> Sergio, 2026-08-27: *"las 17 piezas que me pides analizarlas, piensa con lo nuevo que
> hemos aprendido"*.
>
> Son **21**, no 17. Auditadas una por una contra las reglas que salieron de
> `ONIA_REGLAS_DE_LAMINA.md` y del molde `M03`, abriendo cada PNG.

---

## 🔴 El hallazgo que no es de diseño: 6 piezas prometen algo que no existe

Antes de hablar de visual. Verificado archivo por archivo:

| Palabra clave | Qué promete la pieza | ¿Existe el recurso? | Piezas que bloquea |
|---|---|---|---|
| **HUMO** | "5 herramientas de IA que sí sirven" | ✅ **Sí** — PDF de 3 páginas en `recursos/humo/` | — |
| **STACK** | "la lista con links y costos reales" | ❌ **NO EXISTE** | S05 |
| **SISTEMA** | "las 6 tareas a delegar" · "el checklist de la Oficina Virtual" | ❌ **NO EXISTE** | O01, O02, O03, O04, L6 |

**Seis piezas de veintiuna piden un comentario a cambio de un documento que no está escrito.**
Si alguien comenta hoy, no hay nada que mandarle. Eso es peor que un carrusel feo: es
incumplir en público, en la primera interacción con un desconocido, que es exactamente donde
se gana o se pierde la confianza.

**Ninguna de esas seis se puede publicar hasta que el recurso exista.** No es opinión: la
pieza dice textual qué va a recibir el que comente.

---

## Veredicto pieza por pieza

### @oniahq — 4 carruseles + 1 reel

| Pieza | Estado | Qué le pasa |
|---|---|---|
| **O01** "Tu negocio cerrado" | 🟡 arreglar | Ya se le sacó la cifra inventada ("ocho de cada diez") y las fotos con cartelería inglesa. Queda con 4 láminas negras: como **pieza de dolor está bien**, no necesita producto |
| **O02** "Ferretería" | 🟡 arreglar | Se le sacaron las dos fotos con "CLOSED" y "Grain & Good". Ahora la **portada no tiene imagen**, y la portada es lo único que se ve en el scroll |
| **O03** "Facturación en línea" | 🟢 **la más publicable** | Se le quitó el titular con cuenta regresiva. Dato fiscal real, honesto (dice que el portal del SIN es gratis). Bloqueada solo por SISTEMA |
| **O04** "Qué hace la IA" | 🟢 **rehecha hoy** | De 1 lámina con prueba a 5 de 7, con capturas anotadas. Es la única pieza del lote que **muestra el producto haciendo algo** |
| **Reel R01** | 🟢 listo | 20 s, capturas reales con paneo, molde P16. Sin CTA de palabra clave, así que no está bloqueado |

### @sergio_urcullo — 5 carruseles

| Pieza | Estado | Qué le pasa |
|---|---|---|
| **S01** "Lo que aprendí construyendo" | 🔴 **no publicar** | Ver abajo: los tres problemas del lote de Sergio |
| **S02**, **S03** | 🔴 no publicar | Mismo diagnóstico que S01 |
| **S04** | ⚫ **muerta** | Vos ya la mataste: *"no da nada de valor"*. Quedó reemplazada por S05 |
| **S05** "Software gratis" | 🟡 **la mejor de Sergio** | Tiene la tabla de reemplazos real (Zapier→n8n, Intercom→Chatwoot, Firebase→Supabase, Buffer→Postiz), el dato verificable de la devaluación (6,96→11,37) y la recompensa bien armada visualmente. **Bloqueada porque STACK no existe** |

**Los tres problemas del lote de Sergio, en orden de gravedad:**

1. 🔴 **Se ven igual que las de Onia.** Mismo verde, mismas píldoras, mismo sans. Alguien que
   sigue a los dos ve una sola marca haciendo ruido. **El pack visual de Sergio no existe en
   el motor** — está escrito como pendiente desde el 24-ago y sigue sin hacerse.
2. 🔴 **Cero prueba, teniendo con qué.** "Un cliente real > cien encuestas" — ¿cuál? "Pasé
   días perfeccionando cosas que nadie llegó a ver" — ¿qué cosa? Él tiene su pantalla, su
   código y sus commits. **Es la única cuenta donde la evidencia está a un screenshot de
   distancia y no se usa.**
3. 🟡 **Láminas a medio llenar.** En S01, cinco de seis láminas son titular + tres líneas y
   después 40 % de lámina vacía. No es respiración: es espacio que no trabaja.

**Lo que SÍ funciona en Sergio y no hay que romper:** la estructura `X > Y` es memorable y
consistente, y los textos tienen opinión propia. *"Tres proyectos al 80 % valen cero"* es una
frase que se recuerda. El problema nunca fue el copy.

### Lucía — 2 carruseles + 8 historias + 1 reel

| Pieza | Estado | Qué le pasa |
|---|---|---|
| **L6** "5 señales" | 🟢 **la mejor de las 21** | Serif editorial, fotos consistentes, textos específicos. **Le falta declarar que es IA** — regla del proyecto y política de Meta. Y bloqueada por SISTEMA |
| **L07** | 🟡 sin auditar en detalle | Pendiente de mirar |
| **8 historias** | 🟢 **listas** | Y hacen bien lo que a L6 le falta: dos declaran la IA de frente — *"No me canso porque no existo. Soy IA y no lo escondo"* y *"Esta cara no existe"*. **HUMO sí tiene su PDF**, así que no están bloqueadas |
| **Reel L1 v7** | 🟢 listo | Aprobado en su momento, pecas corregidas |

---

## El patrón transversal de las 21

**De 21 piezas, UNA sola muestra el producto haciendo algo: O04, y porque se rehizo hoy.**

Todo lo demás es texto sobre foto o texto sobre color. Se vende un software de gestión y el
software casi no aparece. La causa no era pereza: tres de los seis packs del motor **tiraban
en silencio** las capturas que el brief declaraba. Eso ya está arreglado y con gate.

---

## Qué hacer, en orden de lo que desbloquea más

| # | Qué | Desbloquea |
|---|---|---|
| 1 | **Escribir el recurso de SISTEMA** ("las 6 tareas que conviene delegar primero, y las 3 que no") | **5 piezas** |
| 2 | **Escribir el recurso de STACK** (la lista con links y costos reales) | **1 pieza**, la mejor de Sergio |
| 3 | **Declarar la IA en L6** — una línea en el pie | 1 pieza, y evita un problema con Meta |
| 4 | **El pack visual de Sergio** | sus 4 piezas vivas dejan de parecer de Onia |
| 5 | **Portada nueva para O02** | la única lámina que se ve en el scroll |

Los puntos 1, 2 y 3 son **texto**: no necesitan créditos, ni fotos tuyas, ni el VPS. Son lo
que separa 21 piezas guardadas de 21 piezas publicables.
