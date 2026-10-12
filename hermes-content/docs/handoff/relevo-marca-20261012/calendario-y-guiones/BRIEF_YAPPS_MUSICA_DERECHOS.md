# Tres yapps por vertical · brief y control de derechos

Propuesta privada del 12-oct. La orden actual de Sergio Urcullo autoriza mezcla quirúrgica con música gratuita/licenciada comercial para **Instagram, TikTok, Facebook, YouTube, LinkedIn y X**, preservando originales y salida limpia; no autoriza gasto, catálogo IG descargado para otras redes ni publicación. Ya hay cinco previews musicales sobre montajes existentes con House In a Forest Loop — HorrorPen (2012), CC BY 3.0, licencia y mezcla verificadas técnicamente por QA independiente. No son tres yapps ni masters aprobados. Las pistas distintas A/B/C siguen pendientes.

## Gate editorial antes de producir

Cada V original exige 3 recortes con diferente edición, música, colores, subtítulos y velocidades, conservando voz/mensaje/marca. Primero marcar tres segmentos que se entiendan solos: gancho, contexto y conclusión. Cada uno debe aportar una idea/enfoque útil. Una base de 40–65 s puede no contenerlos: sin tres segmentos, registrar Y-B/Y-C bloqueados por material insuficiente. No rellenar con el mismo clip maquillado. Una toma ampliada/hook adicional se propone al grabar; no simular que existe.

El master original y el cutplan aprobado no se modifican. Nueva variante = archivo independiente, con parent_id, in/out, versión y SHA final. Previo al corte: tabla y preview 360p; después: mirada completa y escucha de voz, datos y subtítulos. Los cinco montajes Claude existentes y N02 Work se preservan en su molde; no reabrir edición completa para introducir música.

## Diferenciación intencional

| Variante | Intención y recorte | Edición | Música propuesta | Colores y subtítulos | Velocidad propuesta |
|---|---|---|---|---|---|
| A · Qué cambia | Hecho/idea y un límite, sin separar la excepción | Prueba real sostenida + cara; corte solo en pausas, rótulo tema 3–5 palabras | Cama minimal sin voz, pista A pendiente licencia; entrar después del gancho si ayuda | Fondo negro/verde ONIA, subtítulo blanco de 1–3 palabras, énfasis verde | Voz original 1.00×; animación/apoyos 1.00× |
| B · Cómo lo comprobás | Un procedimiento corto completo y criterio de éxito | Pasos numerados y pantalla real, sin fabricar UI; montaje de apoyos ágil | Pulso instrumental suave distinto A, pista B pendiente licencia, ducking en pasos | Fondo blanco/negro, verde solo número/clave; subtítulos por frase breve 3–5 palabras | Voz conservada 1.00×; apoyos/B-roll 1.08–1.12× si no alteran lectura ni demo |
| C · Qué cuidar | Error común o límite con consecuencia práctica | Cara dominante + advertencia real, pausa para conclusión; no recortar matiz | Ambient instrumental distinto A/B, pista C pendiente licencia, sin golpes que distraigan | Negro/blanco, verde subrayado/contorno; subtítulo 1–2 líneas por unidad semántica | Voz conservada 1.00×; apoyos 0.90–0.95× para lectura/conclusión |

Son valores creativos propuestos, no parámetros ya aprobados ni mediciones. “Diferente velocidad” se aplica primero a apoyos/animación para conservar voz natural. Si se requiere acelerar voz, proponer copia 1.03× con preservación de tono y comparar escucha; no aprobar automáticamente ni cambiar palabras/mensaje. No trasladar la música de catálogo de un referente. Marca personal: vos; paleta ONIA verde/blanco/negro. Diferenciar proporción/fondo/acento, no inventar una paleta ajena. La receta Santiago fuente es solo voz; música en sus copias es variante solicitada, no cambiar la receta fuente ni afirmar fidelidad exacta a ella.

## Música y salida limpia

Entregar por variante: `ORIGINAL-PRESERVADO` (sin tocar), `CLEAN` (voz/SFX autorizados sin pista de catálogo), `LICENSED-ALL` solo tras licencia verificada. Un mix aún no aprobado se etiqueta `PREVIEW-NO-PUBLICAR`. Música audible por debajo de la voz; no fijar un LUFS nuevo como receta aprobada. Escuchar con auriculares y altavoz de teléfono; revisar gancho, consonantes, transiciones y CTA. Evitar clipping y reducción que cambie la voz. Fechar QA y registrar responsable real, nunca rellenarlo por inferencia.

| Campo por pista/variante | Valor actual / requisito |
|---|---|
| track_id, título, autor, proveedor | Montajes existentes: House In a Forest Loop, HorrorPen. Yapps A/B/C: pendientes de pistas distintas |
| source_url y licencia original | Montajes: https://opengameart.org/content/loop-house-in-a-forest y https://creativecommons.org/licenses/by/3.0/ ; copias y SHA en entrega-musica. Yapps: pendiente |
| fecha de consulta y versión/licencia SHA | PENDIENTE; fecha real cuando se revise |
| licencia comercial / monetización / pauta | PENDIENTE; licencia gratuita no implica estos derechos |
| plataformas IG/TT/FB/YT/LinkedIn/X | PENDIENTE; verificar las seis explícitamente o por cláusula aplicable |
| territorio, duración, atribución, restricciones | PENDIENTE según términos; cumplir atribución si existe |
| Content ID / liberación de reclamos | PENDIENTE; comprobar instrucciones del proveedor |
| asset SHA y procedencia | PENDIENTE hasta tener archivo autorizado; no guardar token/URL de sesión |
| base_id, in/out y cutplan | PENDIENTE de bruto; no hay cortes aprobados en este brief |
| voz/subtítulos/facts QA, fecha y responsable | PENDIENTE de preview/render; ninguna mezcla final aprobada |
| aprobación versión/SHA/cuenta/hora | PENDIENTE; no programar con un preview |

Gate de derechos: solo `LICENSED-ALL` cuando el comprobante cubra uso comercial y los seis destinos. Si la licencia no lo permite o es ambigua, conservar `CLEAN` y buscar otra pista dentro del permiso gratuito; no comprar. No afirmar garantía legal universal por nombre del proveedor.

## Versiones nativas opcionales

Ayuda Buffer citada por madre: Reels Business/Creator auto vía Facebook puede añadir música desde el comienzo, sin selección de segmento; TikTok Notify Me exige terminar en la app. Es documentación recibida, no función probada en estas cuentas. Hoy IG está fuera de Buffer según UI de madre y usa API propia en Git: no aplicar por inferencia la función de audio nativo Buffer a Graph API.

Si se elige audio nativo, subir el master limpio por el flujo autorizado, registrar pista y plataforma, y mantener esa variante dentro de su red. No pegar pista IG a un MP4 destinado a TikTok/YouTube/Facebook/LinkedIn/X. No se ejecutó ninguna descarga de catálogo ni acción externa.

Fuente única del método: Git 781df7d87b53913ac9790fa1df88e53357408bc3, `.claude/skills/edicion-referentes/SKILL.md` (regla de oro, una receta, voz) y `diseno-contenido-onia/SKILL.md` (paleta, prueba real, fotobn cuando se use imagen), subordinadas a orden 12-oct. Publicador: ../onia-marca-publicador-20261012/PUBLICADOR-CONFIGURADO.md; acceso runtime de este worker no comprobado.
