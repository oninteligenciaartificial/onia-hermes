# Santiago Muñoz: videos animados que escribe Claude con código («sin grabarte»)

Fuente: carrusel [`DdwmO09CN4y`](https://www.instagram.com/sanmunoz.ia/p/DdwmO09CN4y/) de @sanmunoz.ia
(26/27-sep-2026, 10 láminas, leídas una por una en el navegador el 29-sep) y sus reels del mismo tema:
[`Ddwi3ArI91Y`](https://www.instagram.com/sanmunoz.ia/reel/Ddwi3ArI91Y/) «Ya puedes animar sin necesidad de
suscripciones extra» (26-sep), [`Ddz9G7KIEfT`](https://www.instagram.com/sanmunoz.ia/reel/Ddz9G7KIEfT/)
«Opus 5.5 está en otro nivel» (27-sep) y [`Ddc0BBoI9gd`](https://www.instagram.com/sanmunoz.ia/reel/Ddc0BBoI9gd/)
«Crea animaciones profesionales» (18-sep). Sergio Urcullo lo pidió el 29-sep: «aprende el método… es de sus
últimos post». De los reels solo se leyó el caption: el audio no se escuchó.

## Qué enseña (observado en las láminas)

| # | Lámina | Contenido |
|---|---|---|
| 1 | Portada | «Claude ya hace VIDEOS ANIMADOS · cero IA de video · 100 % código · te explico cómo →» |
| 2 | NO es IA de video | La IA de video «inventa píxeles»; Claude «escribe el código que dibuja cada cuadro». «Si algo no te gusta, cambiás el texto, no el video» |
| 3 | Cómo funciona en 4 pasos | 1 le pedís el video → 2 escribe el guion → 3 revisa cada escena → 4 te entrega el MP4. «Todo empieza con un mensaje» |
| 4 | 5 videos que sí venden | Anuncios (clínica o negocio local) · explicativos (tu app o servicio en 45 s) · reels educativos (marca personal) · noticias (canal sin mostrar la cara) · intros de YouTube |
| 5 | Un prompt = un video | Ejemplo textual: «Hazme un anuncio vertical de 25 segundos para una clínica dental. Cierra con Agenda por WhatsApp.» → muela, −30 %, mascota, «Agenda por WhatsApp». «Sin grabarte, sin editar, sin animar» |
| 6 | Hazlo tuyo | Tus colores, tu tipografía, tu logo como mascota, tu foto o un personaje con tu look, tu voz y subtítulos exactos |
| 7 | Cambiá UNA palabra | El mismo guion en pizarrón, acuarela, cuaderno o minimal «en segundos» |
| 8 | 3 errores que lo arruinan | Mucho en pantalla → **una idea por escena** · textos largos → **máximo 7 palabras** · datos inventados → **solo cifras reales** |
| 9 | ¿Y cuánto cuesta? | Animador por video contra «tu suscripción de Claude». «Y el skill te lo regalo» |
| 10 | CTA | «Comenta OPUS y te lo mando por DM»: el skill y el tutorial completo |

**Mecánica del carrusel (se copia el principio, no la estética):** cada lámina termina con un avance de la
siguiente («así funciona →», «5 videos que sí venden →», «hazlo tuyo →»…) y lleva la etiqueta «NN/10».

## Cómo se traduce a nuestro stack (inferido)

- **El motor ya lo tenemos:** HyperFrames (HTML → MP4, skill global `~/.claude/skills/hyperframes` y
  `hyperframes-cli`), subtítulos karaoke, SFX y el sistema de diseño de `diseno-contenido-onia` (temas
  verde/blanco/negro, estilos acuarela y arcilla ya aprobados). Lo que falta es la **receta de una sola
  instrucción**: prompt → guion por escenas → revisión escena por escena → MP4. Es la regla «una instrucción
  completa» que ya estaba en `editor-videos`.
- **Sus 3 errores coinciden con nuestras reglas:** una idea por escena y cifras reales («no fabricar»). Sumar
  a la QA el tope de **7 palabras por texto en pantalla**.
- **Uso directo para ONIA:** su ejemplo es un anuncio para una clínica dental que cierra en WhatsApp, justo
  nuestro primer rubro. Para pauta de ONIA vale la regla «producto visible o no sale»: la animación tiene que
  llevar una pantalla REAL del sistema, no solo mascotas.

## Lo que NO sabemos (sin inventar)

- El skill y el tutorial reales: los manda por DM a quien comenta «OPUS». Comentar desde la cuenta de Sergio
  es una publicación: la hace él o la autoriza.
- El audio de los reels: para transcribirlos hay que descargarlos, y eso también necesita su OK.
