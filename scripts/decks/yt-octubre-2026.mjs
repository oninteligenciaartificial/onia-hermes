// Decks de los 9 YouTube horizontales del plan de 3 semanas (30-sep → 20-oct-2026).
// Uso: node scripts/generate_youtube_teaching_decks.mjs --decks scripts/decks/yt-octubre-2026.mjs
// Fuente de cada deck: el guion indicado en `source`; una lámina por sección del guion.
// code() no escapa: dentro de code() se escribe &lt; &gt; &amp; y las barras invertidas dobles.

const CC = "claudecode.svg";
const CLAUDE = "claude-color--light.png";
const ANTHROPIC = "anthropic.svg";
const COMUNIDAD = "Recurso en la comunidad de WhatsApp; el link está en la web.";

export default ({ flow, cards, code, terminal, compare, checklist, decision, bridge, stack, cycle, stamp, logo }) => [
  {
    slug: "yt-10-opus-sonnet",
    source: "hermes-content/docs/cola/GUIONES-PARA-GRABAR-2026-09-29.md «YouTube — Opus 5.5 o Sonnet 5.5»",
    series: "Sistemas con IA · 10",
    title: "Opus 5.5 o Sonnet 5.5: cuál usar y cómo cambiarlo en Claude Code",
    thumbnail: "LA MITAD DE PRECIO",
    promise:
      "Al terminar, la persona sabrá dónde se separan Opus 5.5 y Sonnet 5.5, cómo cambiar modelo y esfuerzo en Claude Code y cómo decidir con una tarea propia.",
    cta: `El ejercicio de las tres propuestas, con el prompt completo. ${COMUNIDAD} La guía para instalar Claude Code está en la web \`/claude-code\`.`,
    slides: [
      {
        eyebrow: "La prueba",
        title: "Sonnet 5.5 cuesta la mitad que Opus 5.5. Les di la misma tarea.",
        body: "Qué pasó, qué dicen los números de verdad y la regla que uso en mi empresa para elegir cuál trabaja.",
        visual: bridge("Opus 5.5", "vs", ["Sonnet 5.5", "misma tarea", "mismo prompt"]),
        notes:
          "Abrí con la noticia: acaba de salir Sonnet 5.5, cuesta la mitad que Opus 5.5 y en una de las pruebas publicadas le ganó. Contá que hiciste lo más simple: la misma tarea a los dos. Prometé las tres cosas del video y pasá a lo que salió.",
        screen: "Deck a pantalla completa.",
      },
      {
        eyebrow: "Lo que salió",
        title: "Opus es el potente. Sonnet, el intermedio: más rápido y más barato.",
        body: "Opus 5.5 salió el 22 de septiembre; Sonnet 5.5, el 28. Por millón de tokens, Sonnet cobra exactamente la mitad.",
        visual: compare(
          ["OPUS 5.5", "22 de septiembre", "USD 4 entrada", "USD 20 salida"],
          ["SONNET 5.5", "28 de septiembre", "USD 2 entrada", "USD 10 salida"],
        ),
        notes:
          "Opus 5.5 es el modelo para la tarea difícil. Sonnet 5.5 es el intermedio. Leé los precios por millón de tokens: cuatro y veinte contra dos y diez. Cerrá con la pregunta que ordena el resto: la mitad del precio no sirve si hace la mitad del trabajo.",
        screen: "Páginas oficiales de Opus 5.5 y Sonnet 5.5, en la línea de precios.",
      },
      {
        eyebrow: "Las pruebas publicadas",
        title: "Según Anthropic, en casi todo están parejos.",
        body: "En trabajo de oficina y en uso de computadora la diferencia es de uno o dos puntos.",
        visual: logo(
          ANTHROPIC,
          "Anthropic",
          cards([
            ["TRABAJO DE OFICINA · GDPVAL", "Sonnet 1844 · Opus 1846"],
            ["USO DE COMPUTADORA", "Sonnet 80,1 · Opus 81,8"],
          ]),
        ),
        notes:
          "En trabajo de oficina, lo que Anthropic llama GDPval, están prácticamente empatados: 1844 contra 1846. En uso de computadora, 80,1 contra 81,8. Casi igual. Aclarar que son números publicados por Anthropic, no tuyos.",
        screen: "Tabla oficial de pruebas: GDPval y uso de computadora.",
      },
      {
        eyebrow: "Dónde se separan",
        title: "Opus se despega cuando el problema es difícil de verdad.",
        body: "En tareas de terminal gana el barato. En código difícil, Opus saca ocho puntos, aun con Sonnet en esfuerzo máximo.",
        visual: cards([
          ["TERMINAL-BENCH", "Sonnet 70,6 · Opus 66,4"],
          ["FRONTIERCODE · CÓDIGO DIFÍCIL", "Opus 54 · Sonnet 46 (máx.)"],
        ]),
        notes:
          "Terminal-Bench mide tareas en la terminal: Sonnet 70,6, Opus 66,4. Ahí gana el barato. FrontierCode es código difícil: Opus 54, Sonnet 46 aun en esfuerzo máximo. La lectura: parejos en casi todo, y Opus se despega en lo realmente difícil. Esos son números de ellos; ahora una tarea tuya.",
        screen: "Tabla oficial: Terminal-Bench y FrontierCode.",
      },
      {
        eyebrow: "Mi prueba",
        title: "Tres propuestas para una web de tres meses. Con trampa.",
        body: "Una anuncia Bs 700 y no suma un dominio obligatorio de Bs 120 por mes. Otra dice «instalación cero» y cobra 300.",
        visual: checklist(["Costo real de los 3 meses", "La fórmula", "Las contradicciones", "¿Cuál cumple mis requisitos?"]),
        notes:
          "Explicá las dos trampas. Les pediste lo mismo a los dos: el costo real de los tres meses, la fórmula, las contradicciones y cuál cumple tus requisitos. Mismo prompt, palabra por palabra.",
        screen: "El prompt de las tres propuestas, completo y legible.",
      },
      {
        eyebrow: "Resultado",
        title: "Los dos dieron lo mismo.",
        body: "Mismos totales, las mismas dos trampas encontradas y la misma propuesta elegida. Para esta tarea, pagar el doble no me dio nada.",
        visual: compare(
          ["OPUS 5.5", "1050 · 1060 · 1350", "Vio los Bs 360", "Vio los 300 escondidos"],
          ["SONNET 5.5", "1050 · 1060 · 1350", "Vio los Bs 360", "Vio los 300 escondidos"],
        ),
        notes:
          "Los dos dieron los mismos tres totales: 1050, 1060 y 1350. Los dos encontraron los 360 que faltaban en la de 700. Los dos vieron que la instalación cero escondía 300. Y los dos eligieron la misma propuesta. El mensaje: no elijas el modelo por la fama, elegilo por tu tarea.",
        screen: "Las dos respuestas lado a lado, con los totales resaltados.",
      },
      {
        eyebrow: "Cómo se cambia",
        title: "En Claude Code, el modelo se elige al abrir la sesión.",
        body: "sonnet y opus son alias: siempre apuntan a la versión más nueva de cada modelo.",
        visual: logo(CC, "Claude Code", terminal(["$ claude --model sonnet", "$ claude --model opus"])),
        notes:
          "Cuando abrís Claude Code desde la terminal escribís claude, espacio, guion guion model, y el nombre. Con sonnet abre con Sonnet; con opus, con Opus. Son alias: apuntan a la versión más nueva.",
        screen: "Terminal: abrir una sesión con cada alias.",
      },
      {
        eyebrow: "La segunda perilla",
        title: "El esfuerzo de Claude Code: cuánto piensa antes de responder.",
        body: "Más esfuerzo es más tiempo y más tokens. No lo subas por las dudas: subilo cuando la primera respuesta no alcanzó.",
        visual: logo(
          CC,
          "Claude Code",
          terminal(["$ claude --effort high", "# low · medium · high", "# xhigh · max", "# por defecto: medium"]),
        ),
        notes:
          "Casi nadie la toca. Claude guion guion effort, y elegís entre low, medium, high, xhigh y max. En Claude Code viene en medium. Repetí la regla: se sube cuando la primera respuesta no alcanzó, no por las dudas.",
        screen: "Terminal con --effort y los cinco niveles.",
      },
      {
        eyebrow: "La regla de ONIA",
        title: "Sonnet por defecto. Opus cuando equivocarse sale caro.",
        body: "Sonnet hace el trabajo de todos los días: rápido y a mitad de precio. Opus entra en lo que cuesta caro corregir.",
        visual: decision([
          ["Editar, scripts, contenido, pruebas", "Sonnet"],
          ["Migración de base de datos", "Opus"],
          ["Decisión de arquitectura", "Opus"],
          ["Error sin entender tras 2 intentos", "Opus"],
        ]),
        notes:
          "Sonnet edita archivos, escribe scripts, arma contenido y corre pruebas. Opus entra cuando equivocarse sale caro: una migración de base de datos, una decisión de arquitectura, un error que no entendés después de dos intentos.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cuando dudo",
        title: "La misma tarea a los dos, y comparo cuánto corregí.",
        body: "Es lo que hice en este video. Eso vale más que cualquier tabla de pruebas.",
        visual: checklist(["Misma tarea, mismo prompt", "Los dos modelos", "¿Cuánto corregí de cada uno?"]),
        notes:
          "Cuando no sabés cuál va, repetí lo del video: la misma tarea a los dos y medí cuánto tuviste que corregir de cada uno. Tu tarea dice más que cualquier benchmark.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Hacé la prueba",
        title: "Pegá el ejercicio en los dos modelos y fijate si te dan lo mismo.",
        body: "El ejercicio de las tres propuestas, con el prompt completo, está en la comunidad de WhatsApp. La guía para instalarlo, en mi web.",
        visual: stamp("EN LA COMUNIDAD", "El prompt"),
        notes:
          "Cerrá con la acción: el ejercicio y su prompt están en la comunidad de WhatsApp. Si todavía no usás Claude Code, en la web está la guía para instalarlo y armar tu primera skill. Nos vemos en el próximo.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-11-claude-md-historia",
    source: "hermes-content/docs/cola/plan-3-semanas/S1-GUIONES.md «D03-C»",
    series: "Sistemas con IA · 11",
    title: "Un CLAUDE.md donde cada regla trae su historia",
    thumbnail: "REGLA + HISTORIA",
    promise:
      "Al terminar, la persona podrá escribir un CLAUDE.md ordenado por cuándo se necesita, con reglas que traen su historia, y comprobar que se leen.",
    cta: `Plantilla de regla con historia (drop 4). ${COMUNIDAD}`,
    slides: [
      {
        eyebrow: "Resultado primero",
        title: "Cada regla trae la historia de por qué existe.",
        body: "Claude Code lo lee antes de cualquier tarea en mi empresa. Una regla sin su historia se desobedece; con la historia, no.",
        visual: logo(
          CC,
          "Claude Code",
          compare(
            ["REGLA SOLA", "«No hagas esto»", "Pesa como otra línea"],
            ["CON HISTORIA", "«No, porque tal día pasó esto»", "Se entiende qué protege"],
          ),
        ),
        notes:
          "Mostrá el archivo: se llama CLAUDE punto md. Una regla sola dice no hagas esto; una con historia dice no hagas esto porque tal día pasó esto y costó esto. Prometé tres reglas reales, una regla tonta que avisa cuando la sesión se degrada y dos errores tuyos en ese mismo archivo.",
        screen: "CLAUDE.md abierto en su encabezado. Sin scroll por precios ni VPS.",
      },
      {
        eyebrow: "Por qué importa",
        title: "Claude Code arranca cada sesión sin memoria.",
        body: "Solo trae lo que le dejaste escrito. Con el daño que evita, la regla se aplica a casos que no previste.",
        visual: logo(
          CC,
          "Claude Code",
          cards([
            ["SIN MEMORIA", "Sabe lo que dejaste escrito"],
            ["SESIÓN LARGA", "Una orden seca pesa igual"],
            ["EN TRES MESES", "Vos tampoco sabés el porqué"],
          ]),
        ),
        notes:
          "En una sesión larga, con veinte cosas en la cabeza, «no inventes precios» pesa lo mismo que cualquier otra línea. Con el daño que evita, Claude entiende qué está protegiendo. Y el motivo humano: una regla que nadie sabe por qué existe, alguien la borra.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Paso uno",
        title: "En la raíz, y ordenado por cuándo se necesita.",
        body: "Si no tenés uno, escribí /init: te arma un borrador leyendo tu código. Lo que se lee primero pesa más.",
        visual: stack(["AL ARRANCAR", "LO QUE SE ROMPE", "PRODUCTO Y MARCA", "CÓMO SE TRABAJA", "DETALLE"]),
        notes:
          "El archivo va en la raíz y se llama CLAUDE, en mayúsculas, punto md. Si no tenés uno, abrí Claude Code en la carpeta y escribí barra init. Después ordenalo por cuándo se necesita: lo de cada sesión, las tres reglas que más se rompen, producto y marca, cómo se trabaja y el detalle de cada área.",
        screen: "Índice de CLAUDE.md con sus cinco partes. Se filma el CLAUDE.md del 16-oct (`git show 8eebfe01:CLAUDE.md`), que todavía tenía esta parte; hoy vive en AGENTS.md.",
      },
      {
        eyebrow: "Paso dos",
        title: "Título, historia e instrucción verificable.",
        body: "El 15 de agosto había cuatro precios del mismo chatbot. La regla: los precios viven en el código; todo lo demás los lee de ahí.",
        visual: code(
          `## Una sola fuente de verdad (REGLA)

&gt; 15-ago: cuatro precios vivos
&gt; del mismo chatbot y 95 docs
&gt; hablando de precios.

- Los precios viven en el código.
- Todo lo demás los LEE de ahí.
- Si un doc dice otro número,
  está roto.`,
          true,
        ),
        notes:
          "Cada regla tiene tres partes: un título que dice REGLA, una línea con quién la pidió, cuándo y qué pasó, y las instrucciones, cortas y verificables. Contá la historia: un precio en el código, otro en un cotizador público, otro en propuestas firmables y otro en un folleto. La historia no es decoración: le dice a Claude qué error evitar.",
        screen: "La regla «Una sola fuente de verdad» en CLAUDE.md; solo esa sección. Se filma el CLAUDE.md del 16-oct (`git show 8eebfe01:CLAUDE.md`), que todavía tenía esta parte; hoy vive en AGENTS.md.",
      },
      {
        eyebrow: "Paso tres",
        title: "Una regla que sale de una corrección tuya.",
        body: "El 20 de agosto la página de venta tenía cinco «muy pronto». Mi frase quedó citada textual dentro de la regla.",
        visual: code(
          `&gt; «Hace escapar a los clientes…
&gt; Como regla nunca hagas eso.»

Prohibido mostrar obra:
nada de «muy pronto», «beta»,
«en construcción».

Lo que no está listo,
no se nombra.`,
          true,
        ),
        notes:
          "Cuando la regla trae tu frase, no hay que adivinar qué quisiste decir. Y si mañana aparece un «próximamente» que no estaba en la lista, lo saca igual, porque entendió el motivo.",
        screen: "La regla «La venta nunca exhibe obra»; solo esa sección. Se filma el CLAUDE.md del 16-oct (`git show 8eebfe01:CLAUDE.md`), que todavía tenía esta parte; hoy vive en AGENTS.md.",
      },
      {
        eyebrow: "Paso cuatro",
        title: "El canario: llamame siempre Sergio Urcullo.",
        body: "Si Claude deja de llamarme así, dejó de leer sus instrucciones. Es hora de abrir una sesión nueva.",
        visual: logo(
          CLAUDE,
          "Claude",
          compare(
            ["LO QUE DETECTA", "Dejó de leer", "teniéndola delante"],
            ["LO QUE NO", "Contexto perdido:", "se recarga en cada pedido"],
          ),
        ),
        notes:
          "Explicá el canario de los mineros: si el pájaro dejaba de cantar, había algo mal en el aire. No es vanidad. Y leé su límite, que también está escrito: se vuelve a cargar en cada pedido, así que no detecta contexto perdido. Detecta algo peor: si falla teniéndola delante, dejó de leer.",
        screen: "La regla «Canario» en CLAUDE.md; solo esa sección. Se filma el CLAUDE.md del 16-oct (`git show 8eebfe01:CLAUDE.md`), que todavía tenía esta parte; hoy vive en AGENTS.md.",
      },
      {
        eyebrow: "La prueba",
        title: "Tres pruebas para saber si tu archivo funciona.",
        body: "Que aparezca en /context, que Claude cuente la historia de una regla y que se niegue a romperla.",
        visual: logo(CLAUDE, "Claude", checklist(["/context lo lista", "Cuenta la historia", "Se niega y cita la regla"])),
        notes:
          "Uno: barra context; tu CLAUDE punto md tiene que aparecer en archivos de memoria. Dos: preguntale por qué existe una regla; si cuenta la historia, la leyó. Tres: pedile lo que la regla prohíbe, por ejemplo un «muy pronto» en una pantalla de venta. Tiene que negarse y citarla; si lo hace sin chistar, la regla está mal escrita o enterrada.",
        screen: "Claude Code: /context y la respuesta a la prueba de la regla.",
      },
      {
        eyebrow: "El error común",
        title: "Mis dos errores: el largo y una regla mal escrita.",
        body: "482 líneas contra menos de 200 que recomienda Anthropic. Y una regla de precios que mandó días al archivo equivocado.",
        visual: logo(
          ANTHROPIC,
          "Anthropic",
          compare(
            ["MI ARCHIVO", "482 líneas", "Una regla falsa por días"],
            ["LO QUE CONVIENE", "Menos de 200", "La corrección escrita, con fecha"],
          ),
        ),
        notes:
          "Si arrancás hoy, no copies el largo: copiá la forma. Un procedimiento de muchos pasos va en una skill. Segundo error: la regla de precios decía un solo archivo y son dos, uno para planes y otro para agregados. La corrección quedó escrita adentro, con fecha. Con una versión reciente, barra doctor espacio prompt guion audit marca reglas viejas o contradictorias sin cambiar nada.",
        screen: "Documentación de memoria de Claude Code (menos de 200 líneas) y /doctor prompt-audit.",
      },
      {
        eyebrow: "Cierre",
        title: "Hacé esto hoy: la última vez que te hizo algo mal dos veces.",
        body: "Escribí la regla y, arriba, en una línea, qué pasó y cuándo. La plantilla está en la comunidad de WhatsApp.",
        visual: stamp("EN LA COMUNIDAD", "Plantilla"),
        notes:
          "Pedí la acción concreta: acordate de la última vez que Claude te hizo algo mal dos veces, escribí la regla y arriba qué pasó y cuándo. La plantilla de regla con historia está en la comunidad; el link, en la web.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-12-claude-code-servidor",
    source: "hermes-content/docs/cola/plan-3-semanas/S1-GUIONES.md «D06-C»",
    series: "Sistemas con IA · 12",
    title: "Claude Code en un servidor, sin API key y con barandas",
    thumbnail: "SIN API KEY",
    promise:
      "Al terminar, la persona podrá armar un loop de Claude Code en un servidor con candado, carpeta verificada y aviso, y evitar las cinco trampas.",
    cta: `Esqueleto del corredor (drop 8). ${COMUNIDAD} Nunca mostrar la terminal del servidor, .env ni credenciales; no decir cuántos loops hay activos.`,
    slides: [
      {
        eyebrow: "Resultado primero",
        title: "Claude Code trabajando en un servidor, sin mí y sin API key.",
        body: "Cada agente arranca solo, toma la siguiente tarea de su lista, la cierra, la guarda en git y se apaga.",
        visual: logo(CC, "Claude Code", flow(["cron", "claude -p", "commit"])),
        notes:
          "No usás una API key: corren con tu suscripción. Prometé las dos piezas, las tres barandas que casi nadie pone y cinco trampas que te costaron vueltas perdidas. Todo medido en tu servidor.",
        screen: "Diagrama del loop. Nunca la terminal del servidor.",
      },
      {
        eyebrow: "Por qué en un servidor",
        title: "Nadie está mirando: la mitad del trabajo son las barandas.",
        body: "En mi computadora solo corrían con la app quieta. En el servidor, claude -p corre sin pantalla y cron lo dispara cada hora.",
        visual: compare(
          ["MI COMPUTADORA", "Solo con la app quieta", "No corrían ni avisaban"],
          ["UN SERVIDOR", "Prendido siempre", "claude -p + cron"],
        ),
        notes:
          "Si encadenabas trabajo, los agentes nunca tenían turno, y no fallaban ni avisaban: simplemente no corrían. En el servidor, claude guion p recibe un pedido, trabaja y termina; cron, el reloj de Linux, lo corre cada hora. Si algo sale mal a las tres de la mañana, nadie lo ve.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Las dos piezas",
        title: "Un loop son dos archivos: el corredor y el prompt.",
        body: "El corredor no sabe del trabajo; el prompt no sabe de bash. Sumar un loop es un texto más y una línea de cron.",
        visual: cards([
          ["CORREDOR · BASH", "Candado, registro, tope y aviso"],
          ["PROMPT · TEXTO", "Carpeta, rama, lista de tareas"],
          ["PROHIBIDO", "Desplegar, mezclar, gastar, escribir afuera"],
        ]),
        notes:
          "El corredor es un solo script de bash para todos los loops. El prompt es uno por loop y dice qué hace ese carril y qué tiene prohibido. Como cada vuelta arranca sin memoria, el prompt dice todo: carpeta, verificar la rama, dónde está su lista y lo prohibido: desplegar, mezclar en la rama principal, tocar otro carril, gastar y escribirle a alguien de afuera.",
        screen: "Esqueleto del prompt de un carril.",
      },
      {
        eyebrow: "Las tres barandas",
        title: "Candado, carpeta verificada y aviso cuando se muere.",
        body: "Sin candado, un loop lento se pisa a sí mismo. Sin carpeta verificada, trabaja en el lugar equivocado. Sin aviso, muere en silencio.",
        visual: code(
          `exec 9&gt;"$LOCK"
flock -n 9 || exit 0      # 1

cd "$WT" || { avisar; exit 2; }  # 2

# 3: avisar, máx. 1 cada 6 h
# tope 50 min si corre cada hora`,
          true,
        ),
        notes:
          "Uno, flock: si la vuelta anterior sigue, la nueva no arranca; dos sesiones editando los mismos archivos es el peor modo de falla. Dos, entrar a la carpeta o avisar y detenerse: el guardián pasó semanas diagnosticando desde una carpeta que había desaparecido. Tres, avisar por Telegram como mucho una vez cada seis horas por loop. Y el tope, menor que el intervalo.",
        screen: "Esqueleto del corredor con las tres barandas resaltadas.",
      },
      {
        eyebrow: "Las cinco trampas",
        title: "Cinco trampas que me costaron vueltas perdidas.",
        body: "Clave de API en el entorno, permisos mal pasados, entrada sin archivo, hora universal y editar el script mientras corre.",
        visual: decision([
          ["API key en el entorno", "unset"],
          ["--allowedTools se come todo", "una cadena"],
          ["Lee la terminal pendiente", "< prompt.md"],
          ["cron en hora universal", "UTC −4"],
          ["Editar en caliente", "bash -n + mv"],
        ]),
        notes:
          "Uno: con ANTHROPIC_API_KEY en el entorno usa esa clave y no la suscripción; el corredor la borra con unset. Para dejar la suscripción en el servidor está claude setup guion token, y eso nunca va al repositorio. Dos: las herramientas van en una sola cadena separada por comas. Tres: el pedido entra siempre desde un archivo. Cuatro: cron en hora universal, Bolivia cuatro horas atrás. Cinco: versión nueva en un temporal, bash guion n, y mv.",
        screen: "Esqueleto del corredor: unset, --allowedTools y el pedido desde archivo.",
      },
      {
        eyebrow: "La prueba",
        title: "Un loop sirve por lo que cambia, no porque corrió.",
        body: "Abrí tres o cuatro de sus commits. Con ese criterio apagué dos de seis: uno tuvo siete de ocho corridas sin hacer nada.",
        visual: compare(
          ["CORRIÓ", "14 commits iguales", "«Verifiqué que sigue bien»", "Quema tu límite"],
          ["SIRVE", "Commits con cambios", "Corrido a mano una vez", "Registro leído entero"],
        ),
        notes:
          "La pregunta no es cuántos commits hizo, es qué cambió. Un loop que deja catorce commits de «verifiqué que sigue bien» quema tu límite para producir la misma frase. Antes de ponerle cron, corrélo a mano una vez y leé el registro entero: un cron escrito no es un cron que anda.",
        screen: "Tres commits de un loop, abiertos.",
      },
      {
        eyebrow: "El error común",
        title: "Un loop no piensa: come de su lista.",
        body: "Si no hay una lista de tareas reales que cualquiera pueda mirar, se planta o se inventa trabajo.",
        visual: cycle(["LISTA", "TOMA", "CIERRA", "COMMIT"]),
        notes:
          "El error más común no es técnico: es armar un loop para algo que no tiene lista de tareas. Antes de escribir una línea de script, preguntate si ese trabajo tiene una lista real y visible.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cierre",
        title: "El esqueleto del corredor está en la comunidad.",
        body: "Candado, carpeta verificada, clave borrada del entorno y pedido desde un archivo. El link de la comunidad de WhatsApp está en mi web.",
        visual: stamp("EN LA COMUNIDAD", "Esqueleto"),
        notes: "Repetí las cuatro piezas del esqueleto y mandá a la comunidad de WhatsApp. El link está en la web.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-13-bot-no-inventa",
    source: "hermes-content/docs/cola/plan-3-semanas/S2-GUIONES.md «D07-C»",
    series: "Sistemas con IA · 13",
    title: "Un bot que no inventa: datos en un solo lugar, control después de la IA y medición",
    thumbnail: "NO INVENTA PRECIOS",
    promise:
      "Al terminar, la persona podrá armar en su bot las tres capas —datos en un lugar, control después de la IA y medición—, aunque use n8n.",
    cta: `Hoja con las tres capas: plantilla de datos, patrón de precios y frases de prueba (drop 2). ${COMUNIDAD}`,
    slides: [
      {
        eyebrow: "Resultado",
        title: "Aunque la IA escriba un precio inventado, ese mensaje no sale.",
        body: "Tres capas: dónde van los datos, qué control va después de la IA y cómo medís que funciona, con un número.",
        visual: cards([
          ["CAPA 1 · DATOS", "Cada dato en un solo lugar"],
          ["CAPA 2 · CONTROL", "Después de la IA"],
          ["CAPA 3 · MEDICIÓN", "Un número, no una sensación"],
        ]),
        notes:
          "No es porque se lo pediste por favor en el prompt: si la IA escribe un precio que no existe, sale otro mensaje. Prometé las tres capas del bot de ONIA y cómo armarlas aunque uses n8n y no escribas código.",
        screen: "Diagrama de las tres capas.",
      },
      {
        eyebrow: "Por qué importa",
        title: "Un prompt es un pedido. Un control en el código es una pared.",
        body: "Un modelo que no sabe, a veces completa con total seguridad. Un precio inventado después lo tenés que respetar o discutir.",
        visual: compare(
          ["PROMPT", "Un pedido", "Funciona casi siempre", "No sabés cuándo falló"],
          ["CONTROL", "Una pared", "Se puede probar", "Falla a la vista"],
        ),
        notes:
          "Una recepcionista que no sabe un precio dice «déjeme consultar». Un modelo, a veces, completa. Un precio inventado es un precio que tenés que respetar o discutir; una función prometida por escrito es un reclamo. Las dos cosas sirven, pero solo la pared se puede probar.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Capa uno",
        title: "Cada dato vive en un solo lugar.",
        body: "Hasta el 13 de septiembre el horario estaba en dos archivos: el bot ofrecía reunión a las 14 y prometía atención desde las 9.",
        visual: compare(
          ["ANTES", "Horario en 2 lugares", "Turnos: un archivo", "Promesa: otro, a mano"],
          ["AHORA", "Un solo lugar", "Turnos y frase", "salen de lo mismo"],
        ),
        notes:
          "Las dos cosas no podían ser ciertas a la vez, y nadie lo había visto. Hoy la frase de horario se genera sola desde las mismas franjas que ofrecen turnos. En tu bot: una planilla, una fila por dato, y el bot lee de ahí. Prueba: cambiá el horario en ese lugar y preguntale al bot; si contesta el nuevo sin tocar nada más, está bien.",
        screen: "Plantilla de datos: una fila por dato.",
      },
      {
        eyebrow: "Capa dos",
        title: "Un control después de la IA.",
        body: "Normaliza, prueba patrones prohibidos y, si uno coincide, descarta la respuesta entera y manda un texto seguro.",
        visual: code(
          `// sin bandera g
const precio =
  /(bs|usd)\\s*\\d|\\d+\\s*(bs|usd)\\b/;

if (precio.test(normalizar(texto)))
  enviar(TEXTO_SEGURO);
else
  enviar(texto);`,
          true,
        ),
        notes:
          "La mayoría de las respuestas salen de un guion; la IA entra cuando alguien se sale y ese texto pasa por el control. Cinco familias que sirven a cualquiera: precio, función que no existe, fingir ser persona, cifras inventadas y consejo clínico o legal. El error: el patrón buscaba «320 Bs» y los precios se escriben «Bs 320». En n8n: nodo If después de la IA. Sin bandera g, y probá tu texto seguro contra tus propios patrones.",
        screen: "El patrón que cubre las dos formas; después, el nodo If en n8n.",
      },
      {
        eyebrow: "Capa tres",
        title: "Medir con un número, no con una sensación.",
        body: "Un banco de casos contra la misma función que usa el bot en producción, y el control como juez de cada respuesta.",
        visual: cards([
          ["BANCO DE CASOS", "62 de 62 · 29 de septiembre"],
          ["EL CONTROL COMO JUEZ", "Si sale algo prohibido, la prueba falla"],
        ]),
        notes:
          "Los casos están escritos como escribe un dueño de negocio por WhatsApp, y cada uno dice qué debería hacer el bot. Se corren contra la misma función de producción, no contra una copia: si cambia el bot, cambia la medición. Corrido el 29 de septiembre: 62 de 62.",
        screen: "Salida del banco de casos: 62/62.",
      },
      {
        eyebrow: "Demostración",
        title: "Frases de prueba contra el control de mi bot.",
        body: "Corrido el 29 de septiembre. «Cuesta poco» también se bloquea, a propósito: mejor genérico de más que improvisar sobre plata.",
        visual: decision([
          ["Bs 999 por mes, oferta especial", "bloqueada"],
          ["Soy Sergio, te llamo ahora", "bloqueada"],
          ["El 95 % de las clínicas", "bloqueada"],
          ["Garantizamos resultados", "bloqueada"],
          ["Te lo confirma una persona", "pasa"],
          ["Cuesta poco", "bloqueada"],
        ]),
        notes:
          "Leé cada frase y su motivo: precio, fingir ser una persona, cifra inventada, promesa. «Te lo confirma una persona» pasa. «Cuesta poco» se bloquea aunque no tenga número: preferís un mensaje genérico de más a que el bot improvise sobre plata.",
        screen: "El control corrido con las frases de prueba.",
      },
      {
        eyebrow: "El error común",
        title: "Querer resolver todo en el prompt.",
        body: "«Nunca digas precios» en mayúsculas funciona casi siempre. El problema es el casi: no sabés cuándo falló hasta que reclama un cliente.",
        visual: cards([
          ["EL PROMPT", "Ayuda, y lo sigo usando"],
          ["LO QUE NO SE PUEDE EQUIVOCAR", "Va en un control que se prueba"],
        ]),
        notes: "El prompt ayuda y lo seguís usando. Pero lo que no se puede equivocar va en un control que se prueba.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cierre",
        title: "Hacé esto hoy: diez frases prohibidas y diez que sí.",
        body: "Pasalas por tu control. Si una prohibida pasa o una buena se bloquea sin motivo, ya sabés qué arreglar.",
        visual: stamp("EN LA COMUNIDAD", "Tres capas"),
        notes:
          "En la comunidad de WhatsApp están las tres capas en una hoja: la plantilla de datos, el patrón de precios y las frases de prueba. Nos vemos en el próximo.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-14-webhook-rescate",
    source: "hermes-content/docs/cola/plan-3-semanas/S2-GUIONES.md «D09-C»",
    series: "Sistemas con IA · 14",
    title: "El mensaje que se perdía: webhook caído, rescate y firma",
    thumbnail: "NADIE CONTESTÓ",
    promise:
      "Al terminar, la persona podrá detectar mensajes sin respuesta, armar un barrido de rescate con barandas y cerrar su webhook con firma o secreto.",
    cta: `Checklist del webhook: las tres reglas y cómo probar cada una (drop 7). ${COMUNIDAD}`,
    slides: [
      {
        eyebrow: "El caso",
        title: "Alguien le escribió a mi bot. Nunca recibió respuesta.",
        body: "3 de septiembre, a las 00:03. Nadie se enteró. Y la misma puerta tenía un segundo agujero.",
        visual: compare(
          ["LO QUE ESCRIBIÓ", "00:03", "«Hola, quiero información sobre el sistema»"],
          ["LO QUE RECIBIÓ", "Nada", "Y nadie se enteró"],
        ),
        notes:
          "Contá el mensaje textual y el silencio. Prometé qué pasó segundo por segundo, cómo lo arreglaron para que no dependa de que el servidor nunca se caiga, y el segundo agujero: cualquiera podía hacerle decir cosas al bot.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Segundo por segundo",
        title: "El mensaje cayó justo en el hueco.",
        body: "El cliente escribe, la bandeja avisa al webhook y el bot contesta. Ese aviso se disparó una sola vez contra un puerto muerto.",
        visual: decision([
          ["Se reinicia el contenedor del webhook", "00:03:32"],
          ["Llega el mensaje: nadie escucha", "+20 s"],
          ["El vigía lo levanta", "+9 s"],
          ["Llega otro mensaje: ese sí", "respondido"],
        ]),
        notes:
          "Explicá la cadena: WhatsApp, Chatwoot como bandeja donde se ven las conversaciones, el webhook y el bot. Leé la línea de tiempo de los registros. El del medio cayó en el hueco: Chatwoot disparó su único aviso y no volvió a intentar.",
        screen: "Diagrama WhatsApp → Chatwoot → webhook → bot y la línea de tiempo.",
      },
      {
        eyebrow: "El error de fondo",
        title: "Yo suponía que el aviso se reintentaba.",
        body: "Meta reintenta si le hablás directo. Mi bandeja, ese día, no. Entre el 28 de agosto y el 3 de septiembre hubo veinte reinicios.",
        visual: compare(
          ["META DIRECTO", "Reintenta", "Lo dice su documentación"],
          ["MI BANDEJA ESE DÍA", "Un solo aviso", "20 huecos de hasta 2 min"],
        ),
        notes:
          "Depende de quién te avisa. Primera regla: no supongas cómo reintenta tu proveedor, medilo. Después contaron cuántas veces pudo pasar: veinte reinicios, cada uno un hueco de hasta dos minutos donde un mensaje se podía perder para siempre.",
        screen: "Documentación de webhooks de Meta, en la parte de reintentos.",
      },
      {
        eyebrow: "La corrección",
        title: "Que caerse deje de costar una persona.",
        body: "Cada diez minutos busca quién escribió y no tiene respuesta. Lo reinyecta con el mismo identificador: el filtro de duplicados evita contestar dos veces.",
        visual: decision([
          ["Mensaje de menos de 3 min", "no toca"],
          ["Mensaje de más de 12 h", "no toca"],
          ["Conversación con una persona", "calla"],
          ["Sin respuesta, de 3 min a 12 h", "reinyecta"],
          ["Sin bandera explícita", "en seco"],
        ]),
        notes:
          "El servidor que nunca se cae no existe; el vigía ya lo levantaba. Faltaba que caerse no costara una persona. Cerrar la conversación no cuenta como respuesta. Reinyectar de más produce un salteo, no una segunda respuesta. Las barandas son contra hablar de más, y acordate de la ventana de 24 horas. En n8n: disparador cada diez minutos que busca esas conversaciones y las manda a tu flujo principal.",
        screen: "Flujo del barrido de rescate, corrido en seco.",
      },
      {
        eyebrow: "Lo que salió mal",
        title: "Primera prueba: un 401. Segunda: un contador que mentía.",
        body: "El rescate entra por la misma puerta, con la misma llave, leída del mismo archivo. Y separa «mandado» de «contestado».",
        visual: compare(
          ["ERROR 1", "401 no autorizado", "Entraba sin la llave"],
          ["ERROR 2", "«1 reinyectado»", "Salvó a cero personas"],
        ),
        notes:
          "Si copiás la llave a otro lado, algún día se desincroniza y vuelve el 401 sin que sepas por qué. El contador decía uno, pero la conversación estaba con una persona y el bot se callaba por diseño: un contador que dice éxito sin éxito es peor que no tener contador. La verificación que vale: reinyectaron un mensaje ya contestado y el webhook lo trató como duplicado.",
        screen: "Salida del barrido: mandado vs. contestado, con el motivo.",
      },
      {
        eyebrow: "El segundo agujero",
        title: "Cualquiera podía hacerle decir cosas a mi bot.",
        body: "Dos cerraduras, y alcanza con una: firma con hora o un secreto largo en la dirección. Sin secreto configurado, no acepta nada.",
        visual: code(
          `X-Hub-Signature-256: sha256=…

firma ≠ calculada  → rechaza
aviso &gt; 5 minutos  → rechaza
sin secreto        → 503, no abre`,
          true,
        ),
        notes:
          "Cerrado a fines de julio: el webhook no verificaba quién le hablaba. La firma se calcula con una clave compartida y lleva la hora. Si le hablás directo a Meta, viene en X-Hub-Signature-256, calculada con el secreto de tu app. En n8n, el Webhook ya trae una dirección larga y aleatoria: no la cambies por una linda. El código de partida, sin secreto, aceptaba todo: es el agujero que viene de fábrica.",
        screen: "Documentación de webhooks de Meta: X-Hub-Signature-256.",
      },
      {
        eyebrow: "La regla",
        title: "Tres reglas, cada una en una frase.",
        body: "Medí cómo reintenta tu proveedor. Que caerse no te cueste un cliente. Tu webhook no le cree a nadie.",
        visual: checklist(["No supongas: medilo", "Caerse no cuesta un cliente", "Firma, secreto, o nada"]),
        notes:
          "Leé las tres en voz alta, despacio: no supongas que tu proveedor reintenta, medilo. Tu servidor se va a caer: que caerse no te cueste un cliente. Y tu webhook no le cree a nadie: firma, secreto, o nada.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cierre",
        title: "Hacé esta prueba hoy.",
        body: "Si ese mensaje nunca se contesta, necesitás un rescate. El checklist, con cómo probar cada regla, está en la comunidad de WhatsApp.",
        visual: checklist(["Apagá el webhook", "Escribite desde otro teléfono", "Prendelo", "Esperá diez minutos"]),
        notes:
          "Apagá tu webhook, mandate un mensaje desde otro teléfono, prendelo y esperá diez minutos. El checklist del webhook está en la comunidad. Nos vemos en el próximo.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-15-recorrido-entero",
    source: "hermes-content/docs/cola/plan-3-semanas/S2-GUIONES.md «D12-C»",
    series: "Sistemas con IA · 15",
    title: "Probá el recorrido entero: del botón de tu web a lo que contesta el bot",
    thumbnail: "TODO EN VERDE",
    promise:
      "Al terminar, la persona podrá recorrer su web como un visitante, de cada botón al aviso a una persona, y anotar en una planilla dónde se rompe.",
    cta: `Planilla del recorrido: cinco columnas y siete pasos (drop 14). ${COMUNIDAD}`,
    slides: [
      {
        eyebrow: "El caso",
        title: "Cada pieza funcionaba. El recorrido, no.",
        body: "El 17 de septiembre mi agente siguió el camino entero con el mensaje de la web. El bot le ofreció otro producto.",
        visual: decision([
          ["La web abre WhatsApp", "✓ verde"],
          ["El bot contesta", "✓ verde"],
          ["Contesta lo que pidió", "✗ otra oferta"],
        ]),
        notes:
          "La persona arma su pedido, toca un botón y se le abre WhatsApp con el pedido escrito. La web abría bien y el bot contestaba: todo en verde. Pero el bot leyó el pedido como una pregunta de precio y ofreció el sistema de gestión con su demo. Prometé el porqué, lo que encontraron una semana después y el recorrido.",
        screen: "Lámina a pantalla completa. No mostrar números de teléfono.",
      },
      {
        eyebrow: "Por qué pasa",
        title: "Nadie prueba lo que pasa entre la web y el bot.",
        body: "La web precarga un texto; el bot reconoce frases de entrada. Si no coinciden exactamente, lo trata como un mensaje cualquiera.",
        visual: compare(
          ["LA WEB MANDA", "El pedido con los datos", "de cada persona"],
          ["EL BOT ESPERA", "Una frase fija", "Si no: «pregunta de precio»"],
        ),
        notes:
          "Cada pieza tiene su dueño y su prueba. Entre las dos hay un acuerdo invisible: el enlace wa punto me con el mensaje escrito y las campañas que reconoce el bot. El formulario no tenía campaña y cayó en la regla general. Mezcla dos ventas en el mismo canal: no cerrás ninguna.",
        screen: "Un enlace wa.me de ejemplo, sin número real.",
      },
      {
        eyebrow: "Lo que encontramos después",
        title: "Nueve campañas en verde. Cero funcionaban.",
        body: "Las pruebas revisaban un archivo que ningún deploy copiaba; el bot en producción leía otro. El arreglo esperó 24 días una copia a mano.",
        visual: compare(
          ["LAS PRUEBAS", "9 de 9 en verde", "Archivo que no se publica"],
          ["UN VISITANTE REAL", "0 de 9", "El bot leía otro"],
        ),
        notes:
          "El 24 de septiembre revisaron todas las campañas. Para un visitante real no funcionaba ninguna. La trampa: una prueba verde sobre un archivo que no está vivo no prueba nada.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "La corrección",
        title: "La prueba lee las frases del código de la web.",
        body: "Si alguien cambia una coma en la web, se pone roja ese día. El formulario se reconoce por su primera línea, que siempre es igual.",
        visual: cards([
          ["LEE LA WEB", "Frases del código, no a mano"],
          ["REVISA LO PUBLICADO", "El archivo que el deploy copia"],
          ["LO QUE NO SABE", "Si el deploy corrió"],
        ]),
        notes:
          "Dos cambios copiables: la prueba compara las frases del código de la web con lo que conoce el bot, y revisa el archivo que el deploy publica de verdad. Para el formulario, el bot reconoce el comienzo fijo y contesta sobre lo pedido. Lo que ni esa prueba sabe es si el deploy corrió: un documento guardado no es un documento vivo. Eso solo lo prueba el recorrido.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "El recorrido",
        title: "Siete pasos, como un visitante.",
        body: "Celular con datos móviles, cada botón, un número que no uses para probar, y seguir el camino hasta que una persona se entera.",
        visual: code(
          `1 Celular con datos móviles
2 Tocá cada botón; copiá el texto
3 Mandalo desde otro número
4 ¿Qué contestó? ¿Cuánto tardó?
5 ¿A quién le llegó el aviso?
6 Repetilo de noche o domingo
7 Repetilo tras cada cambio`,
          true,
        ),
        notes:
          "La planilla tiene cinco columnas: el botón, el texto que manda, qué debería contestar, qué contestó y a quién le llegó el aviso. El texto real es el que aparece escrito, no el que creés que pusiste. El paso cinco es el que más se saltea: una conversación quedó tibia seis días porque el aviso nunca le llegó a la persona que podía cerrarla. El recorrido termina en un humano que se entera.",
        screen: "La planilla vacía, con sus cinco columnas.",
      },
      {
        eyebrow: "Cómo sabés que salió bien",
        title: "Cada fila cierra con tres sí.",
        body: "Contestó sobre lo que la persona pidió, en el tiempo esperado, y alguien de tu negocio se enteró a tiempo.",
        visual: checklist(["Contestó lo que pidió", "En el tiempo esperado", "Una persona se enteró"]),
        notes: "Si una fila no cierra, no importa que cada pieza esté en verde.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Demostración",
        title: "La planilla, llenada con el caso del 17 de septiembre.",
        body: "Un solo no en la columna que importa alcanza. Todo lo demás estaba en verde.",
        visual: decision([
          ["Botón", "Formulario"],
          ["Texto que manda", "Pedido completo"],
          ["Debería contestar", "Sobre el pedido"],
          ["Contestó", "Otro producto"],
          ["¿Cierra?", "NO"],
        ]),
        notes:
          "Recorré la fila: el botón del formulario, el pedido completo con los datos de la persona, lo que debería contestar y la oferta de otro producto. Esa fila tiene un no, y con uno alcanza.",
        screen: "La planilla llenada con ese caso, sin datos personales.",
      },
      {
        eyebrow: "El error común",
        title: "El cliente es el único que recorre el camino entero.",
        body: "La web la probó quien hizo la web; el bot, quien hizo el bot. No dejes que el cliente sea el primero.",
        visual: flow(["Web ✓", "Bot ✓", "Recorrido ?"]),
        notes: "Confiar en que cada parte se probó por separado es el error común. El cliente recorre el camino entero: que no sea el primero.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cierre",
        title: "Hacelo esta semana con tu web.",
        body: "La planilla del recorrido, con las cinco columnas y los siete pasos, está en la comunidad de WhatsApp. Contame qué encontraste.",
        visual: stamp("EN LA COMUNIDAD", "Planilla"),
        notes: "Mandá a la comunidad por la planilla y pedí que te cuenten qué encontraron en su recorrido.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-16-grabo-ia-edita",
    source: "hermes-content/docs/cola/plan-3-semanas/S3-GUIONES.md «D14-C»",
    series: "Sistemas con IA · 16",
    title: "Grabo, la IA edita: mi sistema paso a paso",
    thumbnail: "SIN EDITOR",
    promise:
      "Al terminar, la persona podrá armar una cadena de edición desde Claude Code —transcribir, plan de cortes, preview— y verificarla con tres pruebas.",
    cta: `La cadena completa, con cada filtro de ffmpeg escrito (drop D3). ${COMUNIDAD} Grabar este video con la misma cadena que describe.`,
    slides: [
      {
        eyebrow: "Resultado",
        title: "Nadie editó este video a mano.",
        body: "Lo grabé de corrido con el celular. Lo cortó, subtituló y niveló una cadena de pasos que corre desde Claude Code.",
        visual: logo(CC, "Claude Code", checklist(["Cortó silencios y repeticiones", "Subtituló palabra por palabra", "Niveló el audio"])),
        notes:
          "Grabaste de corrido, trabándote como siempre. Prometé la cadena completa, paso por paso, con las herramientas reales y los números medidos. Al final se puede armar aunque sea con los primeros tres pasos.",
        screen: "Deck a pantalla completa.",
      },
      {
        eyebrow: "Por qué importa · Las herramientas",
        title: "El código hace lo mecánico; vos, las decisiones que dañan tu marca.",
        body: "Cuatro herramientas gratis. La IA hace el trabajo pesado, pero en algunos puntos se frena y te muestra algo antes de seguir.",
        visual: logo(
          CC,
          "Claude Code",
          decision([
            ["Claude Code", "orquesta"],
            ["ffmpeg", "corta"],
            ["faster-whisper", "transcribe"],
            ["HyperFrames", "gráficos"],
          ]),
        ),
        notes:
          "Editar diez minutos a mano lleva horas: o pagás un editor o dejás de publicar. El tercer camino: código para lo mecánico. Las herramientas: Claude Code orquesta, ffmpeg corta y codifica, faster-whisper transcribe, HyperFrames, de HeyGen, hace los gráficos. La transcripción la corrés en tu servidor con un servicio que sirve ese mismo modelo; se puede correr en la computadora.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Paso uno",
        title: "Arreglar el HDR del celular.",
        body: "Sin tone mapping la piel queda gris. El brillo casi no cambia; lo que se pierde es el color.",
        visual: compare(
          ["SIN TONE MAPPING", "Saturación 50", "Piel gris, todo blanco"],
          ["CON TONE MAPPING", "Saturación 72", "+44 % de color"],
        ),
        notes:
          "El iPhone graba en HDR. El script mira si el video es HDR y aplica la conversión; si no lo es, no toca nada. Detalle: el cuadro de control sacalo del original, no del convertido, o comparás lo malo contra lo malo.",
        screen: "Cuadro del original y del convertido, lado a lado.",
      },
      {
        eyebrow: "Paso dos",
        title: "El segundo exacto de cada palabra.",
        body: "faster-whisper con word timestamps. Ese archivo es la columna: de ahí salen cortes, subtítulos y el momento de cada gráfico.",
        visual: code(
          `segmentos[]
  texto · inicio · fin
  palabras[]
    palabra · inicio · fin`,
        ),
        notes: "No alcanza con el texto: querés el inicio y el final de cada palabra. La narración es la línea de tiempo.",
        screen: "Un tramo del archivo de transcripción con tiempos.",
      },
      {
        eyebrow: "Paso tres",
        title: "El plan de cortes no corta.",
        body: "Busca silencios largos, muletillas y frases repetidas. Imprime una tabla que leo yo antes de que se toque el video.",
        visual: decision([
          ["Silencio largo", "tira"],
          ["«eh», «este», «o sea»", "tira"],
          ["Primera toma trabada", "tira"],
          ["La toma que salió", "se queda"],
        ]),
        notes:
          "Cuando te trabás y volvés a empezar, se queda con la segunda, la que salió. La regla más importante del sistema: el script imprime número, con qué se queda, qué tira y por qué. Esa tabla se lee antes de tocar el video.",
        screen: "La tabla de cortes de este video.",
      },
      {
        eyebrow: "Paso cuatro",
        title: "Preview en 360 y la tira de costuras.",
        body: "El preview usa el mismo filtro que el final. La tira pone el cuadro de antes y el de después de cada empalme.",
        visual: cards([
          ["PREVIEW 360P", "Lo que apruebo es lo que sale"],
          ["TIRA DE COSTURAS", "Antes y después de cada empalme"],
          ["SI ALGO ESTÁ MAL", "Se ajusta el plan, no el video"],
        ]),
        notes: "La tira es tu favorita: ahí ves si un corte se comió una sílaba o dejó un salto feo.",
        screen: "El preview 360p y la tira de costuras de este video.",
      },
      {
        eyebrow: "Paso cinco",
        title: "El orden importa.",
        body: "Si los subtítulos entran antes del zoom, se agrandan con él. Los gráficos entran por palabra de la transcripción, no a ojo.",
        visual: stack(["1 · CORTAR", "2 · ZOOM", "3 · GRÁFICOS", "4 · SUBTÍTULOS", "5 · SONIDO"]),
        notes:
          "Un zoom distinto por bloque hace que el salto entre tomas no se note. Los gráficos se anclan a una palabra: si no aparece, el script avisa en vez de inventar un tiempo. Las letras se dibujan con código, no con IA, así no hay faltas inventadas. Antes de quemar subtítulos hay una lectura a ojo: tema del video de mañana.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Paso seis",
        title: "El final sale en una sola pasada.",
        body: "Cuatro codificaciones seguidas dejaron la cámara en 5,5 Mbps y la piel sin textura. En una sola pasada subió a 6,6.",
        visual: compare(
          ["CUATRO PASADAS", "5,5 Mbps", "Piel sin textura"],
          ["UNA PASADA", "6,6 Mbps", "Volvió la textura"],
        ),
        notes:
          "Desarrollar por pasos está bien porque cada paso se verifica solo. Pero el final sale con el corte, el zoom y los gráficos en el mismo filtro. Este error costó calidad dos veces.",
        screen: "Comparación de un cuadro: cuatro pasadas vs. una.",
      },
      {
        eyebrow: "Paso siete",
        title: "El audio, siempre al final.",
        body: "Mi material salía a −20 LUFS y las redes normalizan cerca de −14. Loudnorm de dos pasadas, y el script vuelve a medir.",
        visual: compare(["ANTES", "−20 LUFS", "6 dB más bajo"], ["AHORA", "−14 LUFS", "Medido en la salida"]),
        notes: "LUFS es el volumen que percibís. Tu video sonaba seis decibeles más bajo que el de al lado. La imagen no se toca: se copia.",
        screen: "Salida de la medición final de volumen.",
      },
      {
        eyebrow: "Cómo sabés que funcionó",
        title: "Tres pruebas antes de publicar.",
        body: "La tabla muestra silencios reales, la tira no tiene sílabas comidas y el master da cerca de −14.",
        visual: checklist(["Tabla con silencios reales", "Tira sin sílabas comidas", "Master cerca de −14 LUFS"]),
        notes: "Si la tabla dice cero segundos de silencio en un video hablado, algo está mal.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "El error que más cuesta",
        title: "En español, no uses los modelos distil de Whisper.",
        body: "Son solo inglés. No te avisan: te traducen. Usá el multilingüe; yo uso el small.",
        visual: compare(["DISTIL", "Solo inglés", "Te traduce sin avisar"], ["MULTILINGÜE", "small", "Transcribe en español"]),
        notes: "Te devuelven un texto prolijo en otro idioma, y todo lo que sigue sale mal.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cierre",
        title: "Empezá por tres pasos.",
        body: "Grabá un minuto, transcribí con tiempos y pedí la tabla de cortes. La cadena completa está en la comunidad de WhatsApp.",
        visual: checklist(["Grabá un minuto", "Transcribí con tiempos", "Pedí la tabla de cortes"]),
        notes: "La cadena completa, con cada filtro de ffmpeg escrito, está en la comunidad de WhatsApp.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-17-generar-sin-fundirte",
    source: "hermes-content/docs/cola/plan-3-semanas/S3-GUIONES.md «D16-C»",
    series: "Sistemas con IA · 17",
    title: "Generar con IA sin fundirte: el costo antes de crear",
    thumbnail: "54 VECES MÁS CARO",
    promise:
      "Al terminar, la persona podrá cotizar cada generación de Higgsfield antes de crearla, aprobar por lote y comprobar el gasto contra su saldo.",
    cta: `El pedido para armar y aprobar un lote, con los comandos en orden (drop D7). ${COMUNIDAD} Recotizar los cuatro precios el día de grabar.`,
    slides: [
      {
        eyebrow: "Resultado",
        title: "Cuatro imágenes, cuatro precios, cotizados sin gastar.",
        body: "La más cara sale 54 veces la más barata. Sacar los precios antes de generar no me costó nada.",
        visual: decision([
          ["text2image_soul_v2", "0,12 cr"],
          ["seedream_v5_lite", "1 cr"],
          ["nano_banana_flash", "1,5 cr"],
          ["gpt_image_2", "6,5 cr"],
        ]),
        notes:
          "Cero coma doce, uno, uno coma cinco y seis coma cinco créditos. Prometé cómo trabajás con Higgsfield para que cada generación tenga su precio anotado antes de existir: comandos, aprobación por lote, registro y trampas.",
        screen: "Salida de generate cost con los cuatro modelos, recotizados el día de grabar.",
      },
      {
        eyebrow: "Por qué importa",
        title: "Si tu agente elige el modelo, te enterás mirando el saldo.",
        body: "Diez imágenes: 1,2 créditos en el modelo barato, 65 en el caro. La skill oficial no cotiza salvo que lo pidas; mi regla la pisa.",
        visual: compare(
          ["SKILL OFICIAL", "No cotiza si no lo pedís", "Calidad por defecto"],
          ["MI CLAUDE.md", "Cotiza siempre antes", "Aprueba antes de generar"],
        ),
        notes:
          "Para ellos es razonable; para vos no. Las instrucciones de tu proyecto mandan sobre las de una skill que instalaste.",
        screen: "La regla de Higgsfield en CLAUDE.md; solo esa sección. Se filma el CLAUDE.md del 16-oct (`git show 8eebfe01:CLAUDE.md`), que todavía tenía esta parte; hoy vive en AGENTS.md.",
      },
      {
        eyebrow: "Paso uno",
        title: "El nombre exacto del modelo.",
        body: "Sale de model list, nunca de memoria: los nombres chocan. Pedís uno y pagás otro.",
        visual: terminal(["$ higgsfield model list", "# generar: generate create", "# en Windows: higgsfield, no hf"]),
        notes:
          "La CLI usa los créditos de tu plan. nano banana flash aparece en su propia tabla como Nano Banana dos. generate image no existe: es generate create. En Windows escribí higgsfield completo, porque hf puede ser otra herramienta.",
        screen: "Terminal: higgsfield model list.",
      },
      {
        eyebrow: "Paso dos",
        title: "Cotizar, sin gastar nada.",
        body: "Mismo modelo y mismos parámetros que vas a usar. Los precios cambian: se cotizan el día que generás, no se copian de un video.",
        visual: terminal(["$ higgsfield generate cost \\", "    <modelo> <parámetros>", "→ precio en créditos"]),
        notes: "Leé los cuatro precios que cotizaste preparando el video. Y aclarar: tampoco se copian de este video.",
        screen: "Terminal: higgsfield generate cost con un modelo.",
      },
      {
        eyebrow: "Paso tres",
        title: "Aprobar por lote.",
        body: "Pieza, modelo, cantidad, costo unitario y tope. Una aprobación cubre ese lote, no los siguientes. Cada video se aprueba solo.",
        visual: code(
          `lote:     mascota 3D
modelo:   text2image_soul_v2
cantidad: 3 × 0,12
total:    0,36 créditos
aprobado: solo este lote`,
          true,
        ),
        notes:
          "Un lote real: tres candidatos para una mascota en tres D con el modelo barato. Cotizado antes, aprobado como lote, confirmado en el historial después. El video va aparte porque cuesta más y puede salir muy distinto.",
        screen: "El registro de ese lote.",
      },
      {
        eyebrow: "Paso cuatro",
        title: "Una primero.",
        body: "Genero una, la miro, y recién si vale, las variantes. Si la primera sale mal, perdiste una, no diez.",
        visual: flow(["1 imagen", "¿Vale?", "Variantes"]),
        notes: "No generes el lote entero de una.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Paso cinco",
        title: "Registrar y comprobar.",
        body: "Modelo, parámetros, costo cotizado, costo real y para qué. La planilla tiene que sumar lo mismo que bajó tu saldo.",
        visual: terminal(["$ higgsfield account transactions", "# antes y después", "cotizó 0,12 · debitó 0,12"]),
        notes:
          "La primera vez cotizó cero coma doce y debitó exactamente cero coma doce. Desde ahí confiás en la cotización, y la seguís comprobando. Si la suma no coincide, algo está generando sin pasar por un lote aprobado.",
        screen: "Terminal: account transactions, sin datos de la cuenta.",
      },
      {
        eyebrow: "La trampa",
        title: "La trampa que tu tope no controla.",
        body: "Mi trabajo llevaba 0,6 de un tope de 1 crédito por día y falló igual: límite diario de la cuenta compartida.",
        visual: compare(
          ["MI TOPE", "0,6 de 1 crédito", "Me quedaba margen"],
          ["LA CUENTA", "Límite diario alcanzado", "Reintentar no sirvió"],
        ),
        notes:
          "Fue el 2 de septiembre: otro trabajo ya había gastado fuerte esa mañana. Cero cargo, verificado en las transacciones. La lección: si una pieza depende de generar, tené un plan que no dependa. Los carruseles salen completos aunque no haya imagen generada ese día.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Plan o API",
        title: "Plan o API: no mezcles los dos saldos.",
        body: "La CLI y los agentes descuentan del plan. La API, lanzada el 16 de septiembre, cobra aparte, en dólares, solo lo que termina bien.",
        visual: decision([
          ["Generás vos o tu agente", "Plan"],
          ["Producto que genera para otros", "API"],
        ]),
        notes:
          "La API tiene más de cincuenta modelos y pago por generación, con saldo en dólares separado del plan. En tu caso, la API queda para cuando exista una fábrica con cola y presupuesto propio. Mezclar los dos saldos es la forma más rápida de no saber cuánto gastaste.",
        screen: "Centro de ayuda de Higgsfield: qué es la API.",
      },
      {
        eyebrow: "El error común",
        title: "Leé cómo se baja de plan antes de pagar.",
        body: "El 1 de septiembre, el único botón en mi cuenta era cancelar la suscripción entera. Para bajar de plan tuve que escribir a soporte.",
        visual: compare(
          ["LO QUE ESPERABA", "Bajar de plan", "desde la cuenta"],
          ["LO QUE HABÍA", "Solo «cancelar»", "Bajar: por soporte"],
        ),
        notes: "Leé eso antes de pagar, no después.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cierre",
        title: "Hoy: instalá la CLI y cotizá tu modelo de siempre.",
        body: "Vas a saber por primera vez cuánto te sale cada imagen. El pedido para armar y aprobar un lote está en la comunidad.",
        visual: stamp("EN LA COMUNIDAD", "El pedido"),
        notes: "Corré model list y cotizá el modelo que usás siempre. El pedido, con los comandos en orden, está en la comunidad de WhatsApp.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
  {
    slug: "yt-18-agentes-de-noche",
    source: "hermes-content/docs/cola/plan-3-semanas/S3-GUIONES.md «D19-C»",
    series: "Sistemas con IA · 18",
    title: "Agentes que trabajan de noche: de 443 avisos a un parte por día",
    thumbnail: "443 → 1",
    promise:
      "Al terminar, la persona podrá convertir los avisos de sus automatizaciones en tareas, armar un parte diario y vigías que avisan solo cuando algo cambia.",
    cta: `Los tres pedidos, listos para copiar y pegar (drop D13). ${COMUNIDAD}`,
    slides: [
      {
        eyebrow: "El caso",
        title: "De 443 mensajes en un día a un parte por día.",
        body: "El 4 de septiembre mis agentes me escribieron 443 veces por Telegram. Hoy, un parte: «todo en orden» o lo que no pudieron arreglar.",
        visual: decision([
          ["4 de septiembre", "443"],
          ["5 de septiembre", "256"],
          ["7 de septiembre", "226"],
          ["Hoy", "1 parte"],
        ]),
        notes:
          "Hoy te escriben una vez por día, más las preguntas que sí son tuyas. Prometé cómo se pasó de uno a otro, las dos veces que el arreglo nuevo mintió y las reglas para copiar si tenés automatizaciones que te escriben.",
        screen: "Conteo de mensajes por día sacado del registro del script.",
      },
      {
        eyebrow: "Por qué importa",
        title: "Un aviso cada tres minutos no es un aviso: es ruido.",
        body: "Dieciocho scripts por el mismo canal. El ruido esconde justo el mensaje que importa, y cada mensaje redactado por un agente se paga.",
        visual: compare(
          ["SUBIR EL TOPE", "Más gasto", "El mismo ruido"],
          ["BAJAR EL CONSUMO", "Menos mensajes", "El ruido era el gasto"],
        ),
        notes:
          "Cuando llegaste a un techo de gasto, la tentación era subir el tope. Hiciste lo contrario: bajar el consumo. Los mensajes sin sentido eran el gasto.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Regla uno",
        title: "Un aviso no es un mensaje: es una tarea.",
        body: "Por defecto, el aviso entra al tablero de donde los loops sacan trabajo. Al celular solo llegan aprobaciones y preguntas mías.",
        visual: decision([
          ["Necesita mi aprobación", "celular"],
          ["Pregunta de desarrollo", "celular"],
          ["Todo lo demás", "tablero"],
          ["Todo, siempre", "registro"],
        ]),
        notes: "Un CI roto o un loop caído ahora se arregla, no se avisa. El registro guarda todo igual: nada se pierde, solo deja de interrumpir.",
        screen: "El tablero de tareas, sin datos sensibles.",
      },
      {
        eyebrow: "Regla dos",
        title: "Solo lo roto ocupa lugar.",
        body: "El tablero se llenó de «terminé, un commit». Ahora solo los problemas son tarea, y se clasifica por el titular, no por el cuerpo.",
        visual: compare(
          ["ANTES", "Todo aviso = tarea", "Por el mensaje entero"],
          ["AHORA", "Solo problemas", "Por la primera línea"],
        ),
        notes:
          "A las horas de encenderlo, habías mudado el ruido de Telegram al tablero, donde molesta más porque compite con el trabajo real. Un aviso que dice «rescaté un mensaje perdido» nombra el error en el cuerpo: mirando el cuerpo entero, todo relato se vuelve tarea.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Donde el filtro mintió",
        title: "El filtro leyó «nada roto» y creó una tarea.",
        body: "Si el aviso es un solo párrafo, la primera línea es todo. Antes de buscar la palabra, se borra la negación.",
        visual: code(
          `"Nada roto"
  → contiene "roto" → tarea

borrar la negación primero:
"Nada roto" → ""  → sin tarea

La palabra nunca se saca
del filtro.`,
          true,
        ),
        notes:
          "Dos días después entraron cuatro tareas de éxito. Un loop al que le fue bien escribe «nada roto»: la palabra roto está, negada, pero está. Resultado: una tarea que dice que algo está roto porque el loop dijo que no.",
        screen: "El fragmento del filtro que borra la negación.",
      },
      {
        eyebrow: "Regla tres",
        title: "Un solo parte por día.",
        body: "Dice «todo en orden» o cuántas cosas el sistema no pudo arreglar, contando solo las que llevan horas abiertas.",
        visual: compare(
          ["TODO EN ORDEN", "Un mensaje", "Nada más"],
          ["NO PUDO ARREGLAR", "Cuántas y cuáles", "Solo abiertas hace horas"],
        ),
        notes: "Una tarea recién creada no se reporta: el loop todavía no tuvo su vuelta. Lo que se cuenta es lo que el sistema ya intentó y no pudo.",
        screen: "Un parte diario de ejemplo.",
      },
      {
        eyebrow: "Donde el parte mintió",
        title: "El parte escondía justo lo que se acababa de romper.",
        body: "Nombraba las cinco tareas más viejas. La caída de cuatro loops era la 16 de 16: «y once más en el tablero».",
        visual: compare(
          ["ANTES", "Las 5 más viejas", "La caída, resumida"],
          ["AHORA", "Lo grave primero", "Lo más nuevo arriba"],
        ),
        notes:
          "El 19 de septiembre se cayeron cuatro loops de una máquina y el vigía lo detectó bien. Pero dos mañanas seguidas el único mensaje del día nombró pendientes de más de diez días. Un recorte por antigüedad esconde, por diseño, lo que se acaba de romper.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Regla cuatro",
        title: "Vigías que avisan por cambio, no por estado.",
        body: "El 6 de septiembre un build roto se vio de casualidad: ningún vigía miraba el CI. El nuevo avisa al ponerse rojo y al recuperarse.",
        visual: decision([
          ["verde → rojo", "avisa"],
          ["rojo → rojo", "calla"],
          ["rojo → verde", "avisa"],
        ]),
        notes:
          "Un ícono con un formato de color que el framework no aceptaba tumbó el build; se enteraron diez minutos después. El vigía nuevo es tonto a propósito: lee, compara con el estado anterior y avisa; no reintenta ni arregla. Treinta mensajes iguales hacen que nadie lea el treinta y uno. Y un token válido no es un token con permisos: hace falta lectura de Actions.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Lo que no hay que hacer",
        title: "Sumar un aviso a un canal saturado es apagarlo.",
        body: "La primera idea fue avisar cada merge: unos 28 por día. La señal ya estaba en git; faltaba mirarla.",
        visual: terminal([
          "$ git fetch origin --quiet",
          "$ git rev-list --count \\",
          '    "$BASE"..origin/main',
          "$ git diff --name-only \\",
          '    "$BASE"..origin/main',
        ]),
        notes:
          "Un agente midió mal porque entraron otros cambios mientras medía. Avisar cada merge era volver al principio. Antes de sacar una conclusión, dos comandos de git dicen cuántos commits entraron y qué archivos tocaron.",
        screen: "Lámina a pantalla completa.",
      },
      {
        eyebrow: "Cómo lo armás vos",
        title: "Tres pedidos a Claude Code.",
        body: "Tareas en vez de mensajes, un parte diario con lo grave primero y vigías que avisan solo cuando algo cambia.",
        visual: logo(
          CC,
          "Claude Code",
          checklist(["Avisos → tareas, sin negaciones", "Un parte: lo grave y lo nuevo", "Vigías que avisan por cambio"]),
        ),
        notes:
          "Uno: que tus scripts anoten en una lista de tareas en vez de mandarte un mensaje, y que solo lo que empieza como problema cree tarea, borrando antes las negaciones. Dos: un parte diario, un solo mensaje. Tres: vigías que guardan el último estado y avisan solo cuando cambia.",
        screen: "Los tres pedidos, legibles.",
      },
      {
        eyebrow: "Cierre",
        title: "Contá: mensajes por día, antes y después.",
        body: "Yo lo conté en el registro del mismo script: de 443 a uno. Los tres pedidos, para copiar y pegar, están en la comunidad.",
        visual: stamp("EN LA COMUNIDAD", "3 pedidos"),
        notes: "Para saber si funcionó, contá. Los tres pedidos están en la comunidad de WhatsApp.",
        screen: "Link de la comunidad en la web.",
      },
    ],
  },
];
