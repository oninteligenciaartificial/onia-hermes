# Cinco archivos antes de vibe code — análisis y adaptación

Fecha de análisis: 9-oct-2026. Marca personal de Sergio Urcullo.
Referencia: https://www.instagram.com/p/DeD6Kg4kYaS/
Estado: ficha y guiones. Sin publicación, generación de imágenes ni edición de un master.

META: aprender del post y proponer una pieza con evidencia propia.
PRUEBA DE HECHO: siete láminas examinadas, rutas verificadas y dos versiones escritas.
REGLA DE PARADA: guardar y revisar esta ficha. Sin red ni acciones de git.

## Cobertura

- Leí el caption completo. Miré `s01-cuadros.jpg` a `s07-cuadros.jpg` con `view_image`: 7/7 láminas y 42 fotogramas muestreados, seis por clip.
- Fuente local: `C:/Users/PC/AppData/Local/Temp/claude/C--dev-proyectos-onia-hermes--claude-worktrees-onia-madre-v2-pr-review-2d85bb/202a717e-5bc8-42ab-ba2e-3dc26d723505/scratchpad/post-DeD6Kg4kYaS/DeD6Kg4kYaS/`.
- `ffprobe` confirmó los siete MP4: 960 × 720, 25 fps, sin pista de audio. Duraciones: 5,76 / 5,60 / 5,44 / 5,32 / 5,36 / 5,60 / 5,60 s. Suma: 38,68 s si se concatenan. En Instagram el avance del carrusel lo decide la persona.
- No reproduje los clips completos. El movimiento se describe comparando los seis cuadros. No medí easing, transiciones breves, continuidad del loop ni los primeros tres segundos cuadro a cuadro.
- Los nombres y títulos grandes son legibles. El cuerpo pequeño de los documentos no se transcribe entero. No permite auditar su calidad técnica.
- No consulté métricas, comentarios ni el perfil. «Por qué rinde» es una hipótesis sobre el formato, no un resultado de alcance comprobado.

Método: `ver-videos`. Diseño: `diseno-contenido-onia`. Reel: `edicion-referentes`. Frente único de contenido, con revisión de fuentes y QA local. Sin subagentes: encargo cerrado de la madre, sin orquestación.

## MENSAJE

**A quién le habla.** A quien programa con IA y siente que cada cambio puede romper algo. También a quien empieza y necesita un orden concreto.

**Promesa.** Preparar cinco archivos antes de pedir código. Según el caption, ayudan a la IA a entender el proyecto, mantener consistencia y dejar de romper cosas al azar. Es la promesa del autor; el post no prueba ese último resultado.

**Prueba.** Enseña documentos abiertos: requisitos, arquitectura, reglas, diseño y tareas. La portada agrega una persona presentando frente a una pantalla. Eso da contexto de práctica y enseñanza. No hay un antes/después, tests ni comparación de fallos.

**CTA.** «Comentá CODE» para recibir la guía completa. En pantalla dice `comment “Code”` y `for the full Vibe Coding Guide`. El caption promete enviarla.

**Lo valioso.** Cambia una recomendación vaga, «dale contexto», por cinco objetos que se pueden nombrar y revisar.

## TEMA

La lista tiene un límite claro: cinco. Cada nombre `.md` parece una acción posible. El público puede guardar el post como checklist.

El dolor es perder control: «la IA rompe todo». La lista ofrece una sensación de orden antes de tocar código. Los documentos visibles hacen que el consejo parezca aplicable.

Cada lámina abre una pregunta y la siguiente la resuelve: qué archivo sigue y para qué sirve. La última deja la guía completa detrás del CTA.

El límite: acumular documentos no garantiza buen software. Importa que estén vigentes, que el agente los lea y que el cambio tenga alcance, prueba y revisión.

## EDICIÓN — lámina por lámina

### 1 · Portada · 5,76 s

Se ve una persona con lentes, camisa clara y chaleco oscuro. Habla y gesticula frente a una proyección. El texto ocupa la derecha: `5 Files`, `to add in your`, `Vibe Code`, `project.`. «5 Files» está sobre una pastilla violeta. «Vibe» es violeta; el resto, blanco. Hay pequeñas etiquetas de archivos cerca del cuerpo.

Sans serif gruesa, de formas redondas. «Vibe Code» domina por tamaño. La persona cambia de gesto; el titular conserva posición entre muestras. Es footage de una presentación con rótulos superpuestos. No se puede saber si el discurso trata de esos archivos porque no hay audio.

Gancho inmediato: número, tema y persona desde el primer cuadro disponible. No hay introducción escrita larga.

### 2 · PRD · 5,60 s

Arriba: `1.` y `PRD.md` en pastilla violeta. Debajo, ventana de editor sobre fondo oscuro cuadriculado. Al principio aparece el explorador lateral. Después se agranda el documento y se desplaza hacia abajo.

Títulos visibles: `Product Requirements Document (PRD)`, `Project Overview`, `Problem Statement`, `Goals`, `Target Users`, `Core Features (MVP)`.

Nombre grande en sans serif blanca. El contenido tiene apariencia monoespaciada de editor. Blancos y grises, con acentos azules. Borde fino claro y esquinas redondeadas. El nombre queda fijo; la pantalla aporta el movimiento.

### 3 · Arquitectura · 5,44 s

Arriba: `2.` y `ARCHITECTURE.md`. Se ve `System Architecture`, un diagrama horizontal de bloques conectados, `High-Level Architecture`, `Technology Stack` y `Folder Structure`.

La ventana se acerca y luego avanza hacia la tabla y la estructura. El diagrama usa bloques pastel: lila, verde, amarillo y rosa. Se repiten cuadrícula, borde y pastilla violeta. La composición dice «estructura» antes de leer el cuerpo.

### 4 · Reglas · 5,32 s

Arriba: `3.` y `RULES.md`. Dentro: `Development Rules`, `General Principles`, `Technology & Coding Standards`, `Project Structure`.

Se pasa de la vista del editor completo a una vista más cercana y baja del documento. Checks verdes y marcadores azules ayudan a recorrer las listas. Texto pequeño blanco/gris sobre casi negro. Misma jerarquía y plantilla que las dos láminas anteriores.

### 5 · Diseño · 5,36 s

Arriba: `4.` y `DESIGN.md`. Se ve `Design System`, `Design Principles`, `Color Palette`, `Typography`, `UI Components`. La sección tipográfica muestra `Aa` e `Inter`; eso pertenece al documento mostrado. No confirma la fuente del titular del carrusel.

Acercamiento y desplazamiento vertical. Aparecen muestras violetas, claras, oscuras, verdes y rojas. Hay iconos y componentes de ejemplo. Es la lámina más visual: permite reconocer «diseño» con poco esfuerzo de lectura.

### 6 · Tareas · 5,60 s

Arriba: `5.` y `TASK.md`. Se ve `Project Tasks`. Una fila resume `Total Tasks 32`, `Completed 8`, `In Progress 4` y un cuarto bloque parcialmente recortado durante el acercamiento.

Debajo hay fases: `Project Setup`, `Authentication`, `Property Listings`, `Search & Filters`, `Favorites & Enquiries`, `UI Polish & Launch`. Tablas en dos columnas con chips rojos, amarillos, verdes y azules.

La ventana crece y baja hasta las fases. Mantiene el fondo cuadriculado y el título fijo. Los números son contenido del ejemplo. No prueban progreso real ni se trasladan a ONIA.

### 7 · Cierre · 5,60 s

Se ve un documento grande desenfocado y oscurecido sobre la cuadrícula. El fondo cambia de sección entre muestras. El texto frontal permanece fijo: `comment “Code”`, `for the full Vibe Coding Guide`. «Code» va en amarillo. Debajo hay un candado amarillo dentro de un cuadrado oscuro redondeado.

Sans serif blanca y gruesa. Dos líneas cortas. El candado representa acceso a un recurso. El blur impide leer el fondo y concentra la atención en la acción. No hay rostro ni prueba nueva.

### Cómo parece estar hecho

Portada: footage de una presentación más composición de texto. Interiores: capturas o grabaciones del editor, insertadas en una plantilla con cuadrícula, numeración y pastilla. El acercamiento y el desplazamiento son compatibles con keyframes de escala/posición y scroll grabado. Las tiras no permiten separar esos mecanismos con certeza.

Cierre: documento en movimiento detrás de blur y capa oscura, más texto e icono fijos. No se identifica la aplicación de montaje. No hay evidencia de generación de video con IA.

Ritmo: una idea por lámina, duración muy pareja y movimiento en el documento. No depende de cortes rápidos ni sonido. La repetición visual reduce el esfuerzo entre archivos.

## Qué toma Sergio Urcullo y qué NO

**Tomar:** lista acotada; nombres exactos; una función por entrada; evidencia visible desde el inicio; acercamientos a fragmentos legibles; orden antes de programar; un solo CTA.

**No tomar:** guion literal, identidad del presentador, violeta como marca, documentos ajenos como prueba propia, cifras del ejemplo ni promesa de «la IA no vuelve a romper nada». No usar robots, interfaces inventadas ni capturas llenas de texto ilegible.

**No usar «comentá X y te lo mando».** Meta rechazó dos veces el mecanismo comentario → DM, según el encargo y `CLAUDE.md`. Nuestro cierre: **«Buscá ARCHIVOS en Avisos · link en mi perfil»**. Es una propuesta de palabra clave. No afirmar que el recurso ya está publicado.

## Evidencia propia: las cinco entradas

Rutas relativas a la raíz de este worktree. Se leyeron los pasajes correspondientes.

| Entrada | Fuente real | Para qué sirve en esta pieza |
|---|---|---|
| 1 · CLAUDE.md | `CLAUDE.md`, «Objetivo por sesión», «Skills del proyecto» y «Cambio de sesión» | Reglas del proyecto, un objetivo y continuidad. |
| 2 · AGENTS.md | `AGENTS.md`, bloque «Codex = ejecutor de la madre Claude» y reglas finales | Delimita el trabajo de Codex y exige META, PRUEBA DE HECHO y REGLA DE PARADA. Remite a las mismas reglas de CLAUDE.md. |
| 3 · Skills | `.claude/skills/onia-router/SKILL.md`, `ver-videos/SKILL.md`, `diseno-contenido-onia/SKILL.md`, `edicion-referentes/SKILL.md` | El router indica qué método cargar. Las skills guardan procedimientos y trampas. No se cargan todas para cada tarea. |
| 4 · Handoff del carril | `hermes-content/docs/handoff/README.md` y `hermes-content/docs/handoff/marca-personal.md` | Estado, intentos fallidos, dependencias y próximos pasos. La nota del 8-oct marca guiones que la madre está reescribiendo y no se deben tocar. |
| 5 · Tarea de Codex | `hermes-content/docs/handoff/codex-tareas/B1-bandeja-menos-llamadas.md` | Encargo concreto: pausar sondeo con pestaña oculta. Tiene pruebas esperadas y límites. Se muestra el contrato, no un resultado terminado. |

`hermes-content/docs/handoff/codex-relevo.md` confirma dónde viven los prompts de tareas. No se modifica esa cola.

**Precisión del título:** «Los 5 archivos que uso antes de programar con IA» funciona como título editorial. El cuerpo aclara: **dos archivos de reglas, una carpeta de skills, un handoff y una tarea**. Son cinco entradas, no cinco archivos obligatorios que lee todo agente en todo proyecto. No presentar CLAUDE.md y AGENTS.md como dos reglas independientes que deban duplicarse.

## Propuesta A · Carrusel de siete láminas

Título de pieza: **Los 5 archivos que uso antes de programar con IA**.
Dirección: foto blanco y negro con un objeto verde (`fotobn`) en portada y cierre. Interiores con capturas reales. Blanco, negro y verde ONIA `#10C26B`. Tipografía sans serif para explicación; nombres de archivo mediante captura real del editor. Sin robots.

Texto visible de cada lámina:

| Lámina | Texto | Imagen / prueba |
|---|---|---|
| 1 | **Los 5 archivos que uso antes de programar con IA.**\nDos reglas, una carpeta, un relevo y una tarea. | Foto BN de Sergio Urcullo en su escritorio, con un cuaderno verde. Si no hay foto aprobada, captura real del árbol con las cinco entradas señaladas. |
| 2 | **1 · CLAUDE.md**\nLas reglas del proyecto.\nUn objetivo. Permisos claros. | Recorte de «Objetivo por sesión». Resaltar una sola regla. |
| 3 | **2 · AGENTS.md**\nEl encargo para Codex.\nQué hace. Qué prueba. Dónde para. | Recorte del bloque «Codex = ejecutor de la madre Claude» y los tres campos. |
| 4 | **3 · .claude/skills/**\nEl método para cada tarea.\nCargo la skill que corresponde. | Árbol de la carpeta y encabezado de `onia-router/SKILL.md`. No mostrar docenas de skills. |
| 5 | **4 · Handoff del carril**\nDónde quedó el trabajo.\nQué falló. Qué sigue. | `handoff/README.md`: «Intentos fallidos» y «Próximos pasos». Rótulo pequeño con la ruta. |
| 6 | **5 · Tarea de Codex**\nUn cambio con límites.\nMETA · PRUEBA DE HECHO · REGLA DE PARADA. | B1: recortes de los tres encabezados y «con la pestaña oculta no hay llamadas». Ruta completa en el caption. |
| 7 | **La IA también necesita límites.**\nBuscá ARCHIVOS en Avisos · link en mi perfil. | Escritorio BN con el mismo cuaderno verde. CTA grande y legible. |

Caption propuesto:

> Antes de pedir código, dejo claro qué puede cambiar la IA y cómo voy a revisar el resultado.
>
> En mi repo uso CLAUDE.md, AGENTS.md, la carpeta .claude/skills/, el handoff del carril y una tarea concreta para Codex.
>
> No todos se leen siempre. Cargo lo que corresponde al trabajo. Y esto no reemplaza las pruebas ni la revisión.
>
> Buscá ARCHIVOS en Avisos · link en mi perfil.

## Propuesta B · Reel de 55 segundos · molde Erik

Usar la receta Erik que el repo mantiene implementada para esta semana: cámara base, tarjetas sobre el pecho y pantalla partida para demostrar. La skill registra un sistema más reciente, del 3–8 oct, pero condiciona adoptarlo a actualizar el motor y revisar una prueba. Esta propuesta no cambia ese motor.

| Tiempo | Dice | Se ve |
|---|---|---|
| 0–5 s | «Antes de pedirle código a la IA, le marco límites. Estos son los cinco archivos que uso en mi proyecto.» | Sergio Urcullo habla desde el cuadro cero. Tarjeta «5 · ANTES DEL CÓDIGO». Antes de 2,5 s entra captura real del árbol. |
| 5–13 s | «Primero, CLAUDE.md. Ahí están las reglas del proyecto y el objetivo. Si no tiene claro qué resolver, puede cambiar algo que no le pedí.» | Tarjeta «01 · CLAUDE.md». Captura de «Un objetivo al inicio». Punch-in al decir «objetivo». |
| 13–21 s | «Segundo, AGENTS.md. Codex recibe un encargo cerrado: qué hace, cómo demuestra que terminó y dónde se detiene. No una orden de arreglar todo.» | Tarjeta «02 · AGENTS.md». Los tres campos aparecen con la voz. Recorte real del bloque de Codex. |
| 21–29 s | «Tercero, la carpeta de skills. No cargo todas. Elijo el método que corresponde a esa tarea, con los pasos y las trampas que ya conocemos.» | Pantalla partida. Abrir `onia-router/SKILL.md` en el editor. Tarjeta «03 · MÉTODO». |
| 29–37 s | «Cuarto, el handoff del carril. Dejo dónde quedó el trabajo, qué falló y qué sigue. Así la próxima sesión sabe desde dónde continuar.» | Recorte de `handoff/README.md`. Resaltar «Intentos fallidos» y después «Próximos pasos». Tarjeta «04 · ESTADO». |
| 37–46 s | «Quinto, una tarea concreta para Codex. Esta pide pausar las consultas cuando la pestaña está oculta. Tiene pruebas y límites escritos antes de tocar código.» | Abrir B1. Resaltar instrucción y prueba esperada. Sello «05 · CAMBIO ACOTADO». No simular un test aprobado. |
| 46–50 s | «Son dos reglas, una carpeta, un relevo y una tarea. Después, igual reviso el cambio.» | Las cinco entradas juntas. Rótulo «PRUEBAS + REVISIÓN». Volver a cámara. |
| 50–55 s | «Buscá ARCHIVOS en Avisos. El link está en mi perfil.» | CTA tecleado. Sergio Urcullo sigue visible. Sin placa final adicional ni segundo CTA. |

Guion: 165 palabras, contadas por espacios. A 3,7 palabras/s son unos 45 s de voz. La tabla reserva hasta 55 s para mostrar las pruebas y leer el cierre. El tiempo final se valida con la toma; no acelerar el clip para hacerlo entrar.

Montaje:

- 1080 × 1920, 30 fps. Plano medio fijo, pecho libre para tarjetas. Pantallas de trabajo auténticas.
- Tarjetas claras con esquineros verdes. Despliegue de 0,13–0,2 s. Elementos sincronizados con la palabra. Renovar apoyo cada 4–6 s.
- Subtítulos condensados en mayúsculas, bloques de tres palabras. Activa verde `#10C26B`, cerca del 74 % del alto. Apagarlos cuando compitan con una tarjeta de datos.
- Cortes secos, 3–5 por cada 10 s. Punch-in de 1,12–1,15× en cambios de sección. Sin tarjetas sobre ojos o boca.
- Voz clara, objetivo −14 LUFS, sin cama musical. Brillo breve sólo al entrar el CTA. No imitar voz, gestos ni set personal de Erik.
- Portada fija del reel: `fotobn` con objeto verde o captura real del árbol. El video demuestra con capturas; no necesita imágenes generadas.

## Recurso para Avisos · borrador, no publicado

**ARCHIVOS — antes de programar con IA**

1. Reglas del proyecto: objetivo y permisos en CLAUDE.md.
2. Encargo del agente: alcance y parada en AGENTS.md.
3. Método: la skill adecuada dentro de .claude/skills/.
4. Estado: handoff con lo hecho, lo fallido y el siguiente paso.
5. Tarea: un cambio con META, PRUEBA DE HECHO y REGLA DE PARADA.

Plantilla mínima para tu siguiente tarea:

```text
META: [un cambio concreto]
FUENTES: [reglas, skill y estado que debe leer]
PRUEBA DE HECHO: [resultado observable o test]
REGLA DE PARADA: [límites y cuándo entregar]
```

Mantener las reglas coherentes. Cargar sólo las fuentes necesarias. Revisar y probar el cambio. Los archivos orientan al agente; no garantizan que acierte.

## Validación y siguiente paso

Ficha completa: 7/7 láminas, caption, metadatos locales, evidencia propia, siete textos y reel de 55 s. Fuentes contrastadas en este worktree. Sólo se crea este documento; no se cambian los guiones que la madre está reescribiendo.

Antes de producir: capturar los fragmentos indicados, con texto legible y sin datos privados. Antes de publicar: aprobar la pieza y poner el recurso ARCHIVOS en Avisos; comprobar el link del perfil. No se consultó la comunidad, así que su disponibilidad sigue sin verificar.

PARA LA MADRE: tomar el mecanismo «nombre de archivo + función + prueba visible». La adaptación ya usa cinco entradas reales y el CTA de Avisos. No promete que la IA deje de fallar. Falta producción y verificar/publicar el recurso con el permiso correspondiente; no se tocó git.
