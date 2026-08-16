# Estructura de contenido — @oniahq y Lucía, y cuándo van juntas

> 2026-08-16. Responde dos cosas: **qué publica cada cuenta** y **si se puede subir la
> misma pieza a las dos como colaboración**.
>
> No reemplaza nada. El calendario de ONIA vive en `ONIA_CRONOGRAMA_CONTENIDO_20260814.md`
> y los 4 pilares de Lucía en `ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md`. Esto los conecta
> y agrega lo que ninguno de los dos tenía: la regla de cuándo una pieza es de las dos.

---

## 1. La colaboración: se puede, pero a mano

**Instagram Collab existe** — un post aparece en el feed y en la grilla de las dos cuentas,
con los dos @ en el encabezado, y comparte likes, comentarios y vistas. Los seguidores de
ambas lo ven como propio.

**La API de publicación NO lo soporta.** Verificado el 2026-08-16 contra la documentación
oficial de Instagram Platform → Content Publishing: los parámetros opcionales del contenedor
son `branded_content_sponsor_ids`, `is_ai_generated`, `trial_params` y similares. **No hay
campo de colaborador.**

| | Se puede |
|---|---|
| Collab desde la app, a mano | ✅ |
| Collab programado por Postiz / API | ❌ |
| Etiqueta de IA por API (`is_ai_generated`) | ✅ — campo nativo, no texto en el caption |

**Consecuencia operativa:** cada collab es una publicación manual. Si la cuenta publica 3
veces por semana y todas fueran collab, se pierde entera la automatización. Por eso el collab
tiene que ser la excepción elegida, no el default.

## 2. Por qué NO conviene colaborar en todo

La tentación es obvia: dos cuentas en cero, cada pieza rinde doble. Pero si las dos publican
lo mismo, **dejan de ser dos cuentas** — son una con dos nombres, y desaparece la razón de
haber construido a Lucía.

Las dos existen porque le hablan a gente distinta:

| | @oniahq | Lucía |
|---|---|---|
| **A quién** | dueño de negocio formal, ya con el problema | público general; el dueño llega de rebote |
| **Con qué entra** | el dolor nombrado y la prueba | el gancho meta-IA — *"hace un año yo no existía"* |
| **Qué produce** | leads con nombre | alcance |
| **Cara** | sin cara | ella |
| **Formato** | 70% carrusel | 70% reel vertical |

**El tráfico va en una sola dirección: Lucía → ONIA.** Ella nombra a `@oniahq`; ONIA no
necesita nombrarla en cada pieza. Una cuenta de producto que vive colgada de su modelo se
vuelve el fan club de la modelo.

## 3. La regla de collab

> **Una pieza va en colaboración solo cuando Lucía ES la demostración del producto.**
> Si ella solo lo cuenta, es de ella sola. Si el producto es ella, es de las dos.

Aplicado a sus 4 pilares:

| Pilar | % | ¿Collab? | Por qué |
|---|---:|---|---|
| **A · Meta-IA** — que es IA y no lo esconde | 30% | ✅ **Sí** | Ella misma es la prueba de lo que ONIA vende. Es literalmente el producto hablando |
| **B · Vida de dueña de negocio** | 30% | ❌ No | Es el vehículo para tener audiencia. En el feed de ONIA es ruido |
| **C · El problema que resuelve ONIA** | 30% | ❌ No | Lo cuenta, no lo demuestra. ONIA ya dice eso mejor y con prueba |
| **D · Marca de terceros** | 10% | ❌ **Nunca** | Lleva etiqueta de colaboración paga. Meter a ONIA ahí mezcla la marca propia con un anuncio ajeno |

**Sale a ~1 collab cada 3 semanas** con cadencia de 3 piezas semanales. Esa es la cantidad
que se puede sostener a mano sin romper la programación.

## 4. Qué publica cada cuenta, con lo que YA existe

Nada de esto hay que producirlo: está renderizado y esperando.

### @oniahq — el orden ya está decidido

Los 8 carruseles con su trabajo asignado (§3-bis del cronograma): 3 educacionales, 3 de
engagement, 2 CTA. **Nunca dos CTA seguidos, nunca más de 1 de cada 4.**

Lo nuevo que entra a esa rotación:

| Pieza | Trabajo | Estado |
|---|---|---|
| 3 piezas de `ui-patterns` (upload · carrito · chat) | 🎯 CTA | ⚠️ las 3 cierran pidiendo SISTEMA — **hay que intercalarlas**, no van seguidas |
| Estático **recibo** itemizado | 🎯 CTA | listo, pide LISTA |
| 6 placas por rubro | 📚 educacional | escritas, sin renderizar |
| Antes/después de web | 📚 educacional | **pipeline probado, falta el cliente real** |

### Lucía — lo que cambia respecto de su plan original

Su plan de arranque (`ONIA_LUCIA_ARRANQUE_CUENTA_20260808.md` §2) sigue vigente: 3 piezas el
día 1, después días 3, 5 y 8. Las 6 imágenes están armadas.

**Lo que cambió es que ahora puede hacer video, y antes no.** Cuando se escribió su plan el
costo no estaba medido y todo era imagen. Hoy está medido:

```
veo3_1_lite     8 s a 720x1280, 9:16 real        8 cr
video_extension encadena sin tope de 15 s        ~12 cr por tramo
sync_so         lipsync con la voz de Marcela    ~18 cr / 5 s
```

Una pieza de 32 s de b-roll con voz encima sale **~48 cr**. Su plan decía 70% reel y hasta
ahora no había reels — esto lo destraba.

**El lipsync no es el default:** cuesta ~5× más que b-roll con voz montada. Se usa solo donde
ella tiene que mirar a cámara y hablar, que es exactamente el pilar A.

## 5. Las dos palabras, y nada más

Todo el sistema cierra en **SISTEMA** y **LISTA**. Las dos cuentas comparten esas dos y no se
abre una tercera — cada palabra es un recurso que hay que tener listo para mandar, y pedir una
palabra sin qué mandar quema la única conversación que el contenido consiguió.

| Palabra | Qué se manda | Estado |
|---|---|---|
| **SISTEMA** | diagnóstico de 20 min (link de Cal con `?src=`) | ✅ vivo y probado |
| **LISTA** | PDF de una página: qué se automatiza primero y qué cuesta | 🔴 **no existe** — bloquea toda pieza que la pida |

Ya se corrigió un desvío: el recibo pedía comentar **PRECIO**. Cambiado a LISTA.

⚠️ Las piezas que cierran con LISTA **no se publican** hasta que el PDF exista.

## 6. El orden en que esto se enciende

| # | Qué | Depende de |
|---|---|---|
| 1 | Armar el PDF de **LISTA** | nadie — se puede hoy |
| 2 | Confirmar que existe `@oniahq` y conectarla en Postiz | Sergio |
| 3 | Programar los 8 carruseles + el recibo + las 6 placas | (2) |
| 4 | Crear la cuenta de Lucía con `lucia@onia.com.bo` | Sergio — el alias **ya está probado** |
| 5 | Sus 3 decisiones abiertas + el origen de los videos | Sergio |
| 6 | Primer reel de Lucía con `veo3_1_lite` | (4) + OK de gasto |
| 7 | Primer collab (pilar A), **a mano** | (3) y (6) |

**ONIA no espera a Lucía.** Los pasos 1-3 no dependen de ella y son los que traen la reunión.

## 7. Lo que se decidió acá y no estaba escrito

1. **Collab solo cuando Lucía es la demostración**, no cuando la cuenta. ~1 cada 3 semanas.
2. **El tráfico va Lucía → ONIA**, nunca al revés.
3. **La etiqueta de IA va por `is_ai_generated`**, campo de la API, además de decirlo en la bio.
4. **Ninguna pieza que pida LISTA se publica** hasta que el recurso exista.

---

Fuentes: `ONIA_CRONOGRAMA_CONTENIDO_20260814.md` (calendario y los 3 trabajos) ·
`ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md` (4 pilares y ganchos) ·
`ONIA_LUCIA_ARRANQUE_CUENTA_20260808.md` (orden de Lucía) ·
`ONIA_CICLO_COMENTARIO_DM_20260815.md` (el ciclo de captación) ·
`ONIA_KIT_VENTA_POR_RUBRO_20260815.md` (las 6 placas y el gate de copy) ·
`references/modelos/lucia/prueba-lipsync-20260815/LEEME.md` (tarifario de video medido) ·
documentación de Instagram Platform → Content Publishing (consultada 2026-08-16).
