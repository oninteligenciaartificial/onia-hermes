# P11 · Plantilla HyperFrames: 3 laminas de paso con hilo continuo y subtitulo palabra-a-palabra

- **Destino:** `editor-de-videos`
- **Sale de:** [la ficha](../2026-08-23-cosecha-explicador-servicio-3-pasos-hilo-continuo.md) · `Dax0R-atz8d` · @metromedia.house
- **Fuente:** https://www.instagram.com/p/Dax0R-atz8d/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Ninguna credencial, permiso ni gasto: HyperFrames ya corre. Faltan DOS decisiones de Sergio. (1) Con que se llenan los tres huecos de prueba: el molde apoya todo su peso en cifras de cliente (400->11.000 seguidores, 12.005 impresiones, 'VPs now DM him', capturas de DM) y Onia tiene CERO clientes pagando — la regla 'no fabricar' prohibe inventarlas, asi que hay que decidir si se llenan con demo del producto en vivo (pantallas reales y verificables) o si el molde se recorta a 4 bloques. (2) Formato: el original es 16:9 (1276x718) y nuestro carril de reels es vertical; decidir si la plantilla nace 9:16, 16:9 o ambas. Nota heredada: el CTA 'Link in Bio' porta directo pero el objeto que mandamos es agendar demo en cal.onia.com.bo, no un PDF.

---

```text
Objetivo unico de la sesion: dejar en el repo UNA composicion HyperFrames reutilizable que reproduzca el sistema de motion del reel https://www.instagram.com/p/Dax0R-atz8d/ (@metromedia.house), analizado en hermes-content/references/video-intake/. NO es un video de Onia terminado: es la PLANTILLA con contenido de relleno, para que despues cualquier explicador se arme cambiando textos e imagenes.

Antes de codear, cargar en este orden: skill hyperframes (entrada), hyperframes-core (contrato de composicion), hyperframes-animation, motion-doctrine y seam-craft. HyperFrames vive en .agents/skills/ — revisarlo ANTES de escribir nada, no reinventar el motor.

QUE TIENE QUE HACER LA PLANTILLA (los 4 mecanismos, medidos del original):

1) HILO BEZIER CONTINUO ENTRE ESCENAS. Una curva blanca de 2-3px que entra por abajo-izquierda de la lamina azul, sube y termina en la pildora 'Step N'. Se DIBUJA con stroke-dashoffset (en el original se ve la punta suelta a media pantalla antes de que llegue el titulo). Las tres laminas de paso llevan la MISMA curvatura y el MISMO punto de salida, aunque esten separadas por otras escenas: tienen que leer como un solo trazo que atraviesa el video. Es el elemento portador de seam-craft.

2) SUBTITULO PALABRA-POR-PALABRA SOBRE LINEA PRE-MAQUETADA. La linea completa se compone de entrada y cada palabra ocupa su posicion final desde el primer fotograma; lo unico que cambia es la opacidad de cada <span>. Criterio duro: las palabras ya visibles NO se mueven al aparecer las siguientes (nada de append de texto, nada de reflow). Eso es lo que produce los huecos grandes e irregulares que caracterizan el estilo.

3) PALABRA FUTURA PRE-PINTADA EN GRIS. La palabra que todavia no se dijo ya esta visible pero al ~45% de opacidad, y se enciende a blanco al pronunciarse. Tiene que ser un parametro por palabra, porque el original tambien lo usa INTERCALADO a mitad de frase como recurso de jerarquia (apagar el relleno para que salte la palabra que importa), no solo como progresion lineal. Antes de escribirlo: verificar si captions-overlay ya soporta este modo. Si ya existe, usarlo y no duplicar.

4) COLLAGE QUE SE ENSAMBLA. Recortes que entran de a uno (2 -> 4 -> 5), cada uno con sombra suave y 2-5 grados de rotacion, escalonados en Z, terminando de aterrizar despues de que el titulo termine de escribirse.

TOKENS DE ESTILO (hex APROXIMADOS, leidos de pantalla — dejarlos como variables CSS, no hardcodeados): fondo azul ultramar #1436C8 con halo radial #2A4FE0 al centro y vineta en bordes; texto activo #FFFFFF; gris del 'aun no dicho' #B9C6EE; negro de contraste #0A0A0A; lamina papel #F2F2F0 con grilla #D8D8D6. Una grotesca de palo seco, dos pesos conviviendo en la misma linea (Black para la palabra que carga el sentido, Regular para el resto), tracking negativo en titulares. Pildora 'Step N': borde 1px, radio completo, texto chico — es el unico elemento con contorno.

RITMO A RESPETAR (medido con ffprobe sobre el original, NO estimar): 48 cortes en 60,857 s; 65% de los planos por debajo de 1 s; rafaga de apertura de 15 cortes en 7,47 s con un parpadeo de 4 cortes en 0,29 s; DOS mesetas de explicacion sin ningun corte, de 5,22 s y 5,00 s; y una cola de CTA de 3,93 s sin corte. La plantilla tiene que exponer esas tres velocidades como beats nombrados (rafaga / meseta / cola), no como duraciones sueltas.

PROHIBIDO EN ESTA PLANTILLA:
- Archivo de terceros. El original se apoya en The Social Network, The Office, keynotes de Jobs y Benioff, archivo de Bezos y Musk, todo sin licencia declarada. En la plantilla van placeholders neutros o capturas de onia-platform.
- Cifras, testimonios o logos inventados. Onia tiene cero clientes pagando. Los slots de prueba del molde van VACIOS y marcados como <PRUEBA_PENDIENTE>: los llena Sergio, no esta sesion.
- Cualquier texto de estado de obra ('muy pronto', 'beta', 'proximamente') en el contenido de relleno.

FORMATO: 9:16 vertical (1080x1920) como default. Si el layout aguanta 16:9 sin rehacer nada, dejar la variante; si no, no forzarla.

CIERRE DE CARRIL: worktree con ruta explicita, `git branch --show-current` primero, commits conventional, gates antes de mergear, y handoff en .claude/handoff/<rama>.md con los 7 campos de hermes-content/docs/HANDOFF_DE_SESION.md.

LISTO = `hyperframes check` pasa sin errores sobre la composicion nueva Y `hyperframes render` produce un MP4 de 1080x1920 en el que, MIRANDO el render (no un grep, no un exit code 0): (a) el hilo blanco cruza las tres laminas de paso con la misma curvatura y punto de entrada, (b) al menos una linea de subtitulo muestra una palabra en gris que se enciende a blanco sin que se mueva ninguna palabra vecina, (c) el collage entra de a un recorte por vez, y (d) el plano final del CTA dura mas de 3 s sin corte. Adjuntar 4 capturas del render, una por criterio.
```
