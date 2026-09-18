# Guion hablado — Video 05 · «No escribas nada: casi todo ya está hecho y es gratis»

11 láminas · ≈ 8:00 · se graba acapela mirando el deck (tecla **N** apaga las chuletas).

🔴 **Los números y los nombres se recuentan el día de grabar.** Dos de los diez repos ya
cambiaron de nombre una vez (`affaan-m/ECC` era `everything-claude-code`;
`multica-ai/andrej-karpathy-skills` estaba en `forrestchang/`). Verificar los ocho de las
láminas vía la API de GitHub ANTES de grabar, y recontar los tres números de «Mi caso»
(instalados / uso semanal / escritos por mí) en la máquina ese día.

⚠️ **La lámina 6 no se cuenta: se graba.** Pantalla real, una instalación de punta a
punta, sin cortes. Es lo que vinieron a ver.

---

**1 · Hook (0:00–0:30)**
> Soy Sergio Urcullo, tengo 16 años y corro mi empresa entera con esto.
> El primer tiempo escribí ciento noventa y siete piezas — skills, scripts, reglas.
> Después me puse a buscar. Buena parte ya existía, hecha, y gratis.
> Hoy te ahorro ese mes: de dónde bajar lo que ibas a escribir, y cómo saber si sirve.

**2 · El mapa (0:30–1:15)** — *la lámina a la que volvés entre tramo y tramo*
> Son tres lugares, y el orden importa. No es una lista: es un orden de confianza.
> Uno: lo oficial. Lo que publica Anthropic. Es lo que más se actualiza y lo que menos te va a sorprender.
> Dos: las empresas. Cada vez más empresas publican sus propias skills, para que Claude use su herramienta bien.
> Tres: la comunidad. Lo más creativo y lo más disparejo. Acá sí hay que leer antes de instalar.
> Y todo esto es gratis. Son archivos de texto.

**3 · Lo oficial (1:15–2:05)** — *deletreá el segundo nombre si hace falta*
> Por acá se empieza. Dos nombres, anotá estos dos aunque no anotes nada más.
> anthropics barra skills: el repositorio público de skills. El primero al que hay que ir.
> Y anthropics barra claude-plugins-official: el directorio oficial de plugins, mantenido por ellos. Desde ahí se llega a casi todo lo demás.

**4 · Las empresas (2:05–2:50)**
> Esto es lo que sorprende: estas no las hizo un fan. Las hizo la empresa dueña de la herramienta.
> Cloudflare publica las suyas, para que Claude construya sobre Cloudflare sin inventarse la mitad.
> GreenSock publica las de GSAP, su librería de animación. Ellos mismos.
> La regla: si usás una herramienta conocida, fijate si publicó las suyas.

**5 · La comunidad (2:50–3:50)** — *decilo como usuario, no como lista de internet*
> Y de la comunidad, cuatro que uso yo. Están instalados en mi máquina ahora mismo.
> claude-mem: memoria que sobrevive entre sesiones. Dejás de contarle tu proyecto cada vez.
> Understand-Anything: le das un proyecto entero y lo convierte en un mapa que se puede recorrer. Para entender código ajeno no conozco nada igual.
> ponytail: lo hace escribir menos código. Y menos código son menos cosas que se rompen.
> Y ECC: una colección grande de la comunidad. Ojo con esta, que después te cuento por qué.

**6 · Cómo se instala (3:50–4:40)** — *PANTALLA REAL, de punta a punta, sin cortes*
> Ahora mirá lo fácil que es, porque esto es lo que cambia todo.
> Adentro de Claude Code, le pido: buscame un plugin de memoria.
> Lo encuentra. Le digo que lo instale. Listo — disponible en todos mis proyectos.
> No bajé nada a mano, no toqué carpetas. Se busca y se instala desde adentro.

**7 · La advertencia útil (4:40–5:30)**
> Antes de que instales veinte cosas, lo que hay que saber.
> Un plugin puede leer tus archivos y ejecutar comandos. Eso no es malo — es exactamente por lo que sirve. Pero entonces:
> Abrilo. Es texto plano. Mirá qué permisos pide.
> Leé el archivo, no la descripción. La descripción la escribió el autor; el archivo dice lo que realmente hace.
> E instalá de a uno. Si instalás seis juntos y algo cambia de comportamiento, no vas a saber cuál fue.
> No son cajas negras. Ésa es toda la ventaja.

**8 · El puente al 03 (5:30–6:10)**
> Y esto conecta con el video anterior: los conectores.
> No aprendés una herramienta nueva — le conectás las que ya usás.
> Tu base de datos: consulta en vez de adivinar. Tus automatizaciones: crea y arregla flujos. Tu panel de anuncios: lee cómo rindieron.
> Lo que ya tenés, potenciado. No otra cosa que mantener.

**9 · Mi caso (6:10–6:45)** — *números contados HOY, y el honesto es el segundo*
> Te doy mis números, contados hoy.
> Tengo [N] paquetes instalados. Uso [M] todas las semanas. Y escribí [K].
> Sí: instalé más de los que uso. Y está bien — probar es gratis. El número que importa no es cuántos tenés: es cuántos usás de verdad.

**10 · La parte honesta (6:45–7:30)** — *el hallazgo real de preparar este video*
> Y la parte honesta, que esta vez me pasó preparando este video.
> Revisé los diez que recomiendo. Dos habían cambiado de nombre o de dueño desde que los instalé.
> Si te los daba de memoria, te mandaba a dos direcciones muertas. Y vos ibas a pensar que te equivocaste vos.
> Esto se mueve rápido. Buscá por el nombre, no confíes en el link. Vale para este video y para cualquier otro que veas.
> Un dato heredado envejece sin avisar.

**11 · En una línea (7:30–8:00)**
> En una línea: buscá primero, escribí después.
> Primero lo oficial. Después lo de la empresa dueña. Después lo de la comunidad — y eso leelo antes.
> Contame en los comentarios qué herramienta usás todos los días, y te digo si ya tiene skill para conectarla.
> En el próximo video: el sistema completo. Mi empresa entera, con lo que cuesta y con lo que se rompe. Suscribite que ese es el bueno.

---

## Qué recontar antes de grabar

| Dato | Cómo |
|---|---|
| Los 8 repos de las láminas 3-5 | API de GitHub siguiendo redirecciones (receta en `README.md`) |
| [N] instalados / [M] semanales / [K] propios | contar en la máquina ese día |
| La versión de Claude Code si se muestra | `claude --version` |
