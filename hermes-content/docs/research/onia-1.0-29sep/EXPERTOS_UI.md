# Expertos de UI: qué enseña cada uno y qué tomamos para Onia

Investigación del 29-sep-2026 para Sergio Urcullo. Solo lectura: no se instaló nada ni se gastó.
Cada "R#" apunta a `REGLAS_UI_ONIA_v2.md` (misma carpeta).

---

## 0. ¿Qué video vio Sergio Urcullo?

**No lo pude identificar con certeza.** Busqué en la web (español e inglés) y en las 162 fichas de
`H/hermes-content/references/video-intake/`: ninguna ficha habla de "el creador de la UI". Lo que
sí encontré, ordenado de más a menos probable según su descripción ("el creador de la UI, el mayor
experto, diseñó las interfaces de las mejores webs del mundo"):

| # | Candidato | Por qué encaja | Por qué no es seguro |
|---|---|---|---|
| 1 | **Emil Kowalski** (UI de Vercel y hoy de Linear; creador de Sonner y Vaul) | Es "el que hizo la UI" de las dos webs que más se citan como las mejor diseñadas. En julio-septiembre de 2026 publicó skills abiertas para Claude, entre ellas `apple-design` (principios de las charlas WWDC pasados a web) y `mobile-native`, y circularon en reels. Además, el TikTok de Revolutia que Sergio Urcullo mandó el 1-sep ("Claude acaba de matar a los diseñadores web") lo nombra (`VI/2026-09-01-revolutia-estilo-tiktok.md`) | "Creador de la UI" puede ser otro; no encontré un video suyo en español |
| 2 | **Apple, WWDC26 "Principles of great design"** (sesión 250, Linda y Doug, evangelistas de diseño) | Es de 2026 y enumera 8 principios, uno de ellos "quitar lo innecesario": lo mismo que pidió Sergio Urcullo (sin botones de más ni texto basura) | Los presentadores no son "el creador" de nada famoso |
| 3 | **Rauno Freiberg** (Vercel, antes el navegador Arc) | Se lo presenta como "el mejor diseñador de interfaces"; escribió "Invisible Details of Interaction Design" y la base de las Web Interface Guidelines de Vercel | Su material es de 2023-2025 |
| 4 | **Karri Saarinen** (cofundador de Linear, antes jefe de diseño de Airbnb) | Charla de Config 2025 sobre calidad y oficio | Habla más de equipos y proceso que de pantallas |
| 5 | **Jony Ive** (iPhone, LoveFrom, io) | Conversación de Stripe Sessions 2025 muy compartida | Es diseño industrial y cultura, casi nada de UI web |
| 6 | **Steve Schoger / Adam Wathan** (Refactoring UI, "creadores de Tailwind UI") | "Creador de la UI" podría ser "de Tailwind UI" | El libro es de 2018 |

**Para cerrarlo:** que Sergio Urcullo pase el link. Con la skill `ver-videos` se transcribe y se
comparan sus puntos con la v2. Mientras tanto, la v2 ya cubre los seis candidatos.

---

## 1. Emil Kowalski: animación con propósito

- **Quién es:** design engineer. Trabajó en el equipo de diseño de Vercel y hoy está en el equipo
  web de Linear. Hizo Sonner (toasts) y Vaul (hoja inferior para React), y el curso animations.dev.
- **Qué enseña:** la animación se decide por la frecuencia y el propósito, no por el gusto. Lo
  rápido y lo invisible pesan más que lo vistoso.
- **5 puntos clave**
  1. **La frecuencia decide.** Lo que se usa cientos de veces al día no se anima nunca (ejemplo:
     Raycast no anima al abrir). Lo que es raro o de primera vez sí admite deleite.
  2. **Menos de 300 ms.** Toque 100-160 ms, tooltip 125-200, menú 150-250, modal u hoja 200-500.
  3. **ease-out para entrar, nunca ease-in.** Curvas propias más fuertes que las del navegador.
     Nunca aparecer desde `scale(0)`: desde 0,9-0,95 con opacidad.
  4. **El botón responde al apoyar el dedo:** `:active { transform: scale(0.97) }`.
  5. **Interrumpible y con origen.** Los popovers crecen desde su botón y lo que el usuario puede
     agarrar se anima con resortes.
- **URLs:** https://emilkowal.ski · https://emilkowal.ski/ui/great-animations ·
  https://github.com/emilkowalski/skills (skill `apple-design` agregada el 2026-07-09 y
  `mobile-native` el 2026-09-15, según los commits) · https://animations.dev
- **Ya instalada acá:** `C:/Users/PC/.claude/skills/emil-design-eng/SKILL.md`.
- **Para Onia:** R25 (botón), R32 (frecuencia), R33 (tiempos y curvas), R17 (hoja).

## 2. Apple: los 8 principios (WWDC26) y las interfaces fluidas (WWDC18)

- **Quién:** el equipo de diseño de Apple. La sesión WWDC26 la dan Linda y Doug, evangelistas de
  diseño. Las otras dos charlas son "Designing Fluid Interfaces" (2018) y "The details of UI
  typography" (2020).
- **Qué enseña:** 8 principios: propósito, agencia, responsabilidad, familiaridad, flexibilidad,
  simplicidad, oficio y deleite. Su frase central: **simplicidad no es minimalismo**, porque
  esconder todo se ve mínimo pero no es simple.
- **5 puntos clave**
  1. **Cada elemento se gana su lugar.** Quitar lo innecesario, preguntarse si un dato complejo se
     entiende mejor como gráfico y cortar la función cuyo riesgo supera su valor.
  2. **Agencia con perdón:** deshacer fácil y confirmación solo para lo destructivo. Si se
     confirma todo, la gente aprende a tocar "Sí" sin leer.
  3. **Lo común a la vista, lo avanzado un nivel más abajo.** Lenguaje llano, sin jerga ni
     redundancia.
  4. **Respuesta inmediata e interrumpible.** El feedback empieza al apoyar el dedo, sigue al dedo
     1:1, lo que sale vuelve por donde entró y todo se puede agarrar a mitad de camino.
  5. **Tipografía por tamaño:** tracking negativo en lo grande y cercano a 0 en el cuerpo;
     interlineado ajustado en títulos y amplio en cuerpo; jerarquía con peso, no solo con tamaño.
- **URLs:** https://developer.apple.com/videos/play/wwdc2026/250/ ·
  https://www.youtube.com/watch?v=Xa9L2yx_QH8 ·
  https://developer.apple.com/videos/play/wwdc2018/803/ ·
  https://developer.apple.com/videos/play/wwdc2020/10175/ ·
  https://developer.apple.com/design/human-interface-guidelines/design-principles
- **Para Onia:** R2 (borrado), R7 (2 niveles), R22 (deshacer), R17 (hoja), R29 (tipografía),
  R38 (gráfico en vez de párrafo).

## 3. Rauno Freiberg y las Web Interface Guidelines de Vercel

- **Quién es:** staff design engineer en Vercel, antes diseñó el navegador Arc (The Browser
  Company). Escribió "Invisible Details of Interaction Design" y el curso Devouring Details. Sus
  pautas de interfaces hoy viven como las Web Interface Guidelines de Vercel.
- **Qué enseña:** la calidad está en cientos de detalles invisibles, y cada uno se puede revisar.
- **5 puntos clave**
  1. **Consistencia espacial:** el movimiento dice de dónde viene cada cosa.
  2. **Frecuencia y novedad:** lo frecuente aparece al instante (el menú de comandos no se anima).
  3. **Feedback durante el gesto**, no al final. Mostrar lo que tapa el dedo.
  4. **Formularios que perdonan** (según las guías de Vercel): no pre-deshabilitar "Enviar", el
     error va junto al campo con foco en el primero, nunca bloquear el pegado, input de 16 px en
     celular, `inputmode` correcto.
  5. **Todos los estados diseñados** (vacío, poco, mucho, error). Sin callejones sin salida.
     Skeleton idéntico al contenido, con retardo de ~150-300 ms y mínimo de ~300-500 ms. UI
     optimista con "Deshacer". Estado en la URL. Números tabulares. Nunca solo color.
- **URLs:** https://rauno.me/craft/interaction-design · https://interfaces.rauno.me ·
  https://devouringdetails.com · https://github.com/vercel-labs/web-interface-guidelines
- **Ya instalada acá:** `C:/Users/PC/.claude/skills/web-design-guidelines`.
- **Para Onia:** R13, R14, R15, R19, R21, R22, R31, R36.
- **No se copia:** Title Case y "&" en vez de "y". Son preferencias de marca de Vercel, en inglés.
  Tampoco APCA en lugar de WCAG: se mantiene AA porque ya es un gate medible.

## 4. Steve Schoger y Adam Wathan: Refactoring UI

- **Quiénes son:** Schoger es el diseñador y Wathan el creador de Tailwind CSS. Hicieron juntos
  Tailwind UI y el libro Refactoring UI.
- **Qué enseña:** trucos concretos para que una interfaz de desarrollador se vea diseñada. Casi
  todo problema de interfaz es un problema de jerarquía.
- **5 puntos clave**
  1. **Empezar por la función, no por el layout.** Primero la tarea, después la pantalla.
  2. **Bajar lo secundario para destacar lo primario.** No se agranda lo importante: se aquieta lo
     demás con color, peso y botones de texto.
  3. **Las etiquetas son el último recurso.** El formato del dato ya dice qué es (`Bs 3.860`
     no necesita "Monto:").
  4. **Más aire del que creés, pero no hace falta llenar la pantalla.** Usar una escala de
     espacios y de tipos, y limitar las opciones.
  5. **Menos bordes, no depender solo del color, y cuidar los estados vacíos.**
- **URL:** https://refactoringui.com
- **Para Onia:** R1, R4, R5, R9, R29, R35.

## 5. Karri Saarinen (Linear)

- **Quién es:** cofundador y CEO de Linear. Antes dirigió diseño en Airbnb y Coinbase.
- **Qué enseña:** la calidad es una decisión, y se consigue haciendo menos cosas.
- **5 puntos clave** (de sus 10 reglas)
  1. **Reducir el alcance para subir la calidad.**
  2. **Diseñar con opinión fuerte** para un público concreto, no para todos.
  3. **La especificación es el piso, no la meta.**
  4. **Calidad no es perfección:** se pule antes de publicar y se itera después.
  5. **Los datos no te dicen cómo sorprender.**
- **URLs:** https://www.figma.com/blog/karri-saarinens-10-rules-for-crafting-products-that-stand-out/ ·
  https://www.youtube.com/watch?v=pCil7YNhNCU (Config 2025) ·
  https://linear.app/now/why-is-quality-so-rare
- **Para Onia:** R1 (una pantalla, un trabajo) y R39 (diseñado para la clínica, no genérico).
  Refuerza la regla del negocio: la 1.0.1 saca ruido, no suma funciones.

## 6. Jony Ive y Dieter Rams

- **Quiénes son:** Ive diseñó el iMac, el iPod y el iPhone y hoy está en LoveFrom e io. Rams fue
  jefe de diseño de Braun y es la referencia declarada de Ive.
- **Qué enseñan:** el objeto muestra si a quien lo hizo le importó. Buen diseño es "menos, pero
  mejor".
- **5 puntos clave**
  1. **Lo que hacemos muestra quiénes somos.** El cuidado se ve.
  2. **Menos, pero mejor** (Rams). Ni un elemento sin función.
  3. **El buen diseño es discreto:** la herramienta no es la protagonista, el trabajo sí.
  4. **Honesto:** no promete lo que no hace. En Onia: ni obra a la vista ni funciones inventadas.
  5. **Minucioso hasta el último detalle:** el cuidado incluye lo que casi nadie mira.
- **URLs:** https://stripe.com/sessions/2025/a-conversation-with-sir-jony-ive ·
  https://www.vitsoe.com/us/about/good-design
- **Para Onia:** R2, R31, R38, R40.

## 7. Jakob Nielsen (Nielsen Norman Group)

- **Quién es:** cofundador de NN/g y autor de las 10 heurísticas de usabilidad, la vara con la que
  se evalúa una interfaz desde los años 90.
- **5 puntos clave**
  1. **Heurística 8, diseño estético y minimalista:** la interfaz no muestra información
     irrelevante ni rara vez necesaria.
  2. **La gente no lee:** en una página promedio lee alrededor del 20% del texto (2008). Hay que
     escribir para escanear.
  3. **Divulgación progresiva:** pocas opciones a la vista y el resto a pedido. Más de 2 niveles
     suele fallar.
  4. **Estado del sistema visible** (heurística 1) y **reconocer antes que recordar**
     (heurística 6): el valor probable ya puesto.
  5. **Control y libertad** (heurística 3: salir y deshacer) y **errores que dicen cómo salir**
     (heurística 9).
- **URLs:** https://www.nngroup.com/articles/ten-usability-heuristics/ ·
  https://www.nngroup.com/articles/how-little-do-users-read/ ·
  https://www.nngroup.com/articles/progressive-disclosure/
- **Para Onia:** R2, R7, R8, R20, R22, R36.

## 8. Jon Yablonski: Laws of UX (y el reel de las "20 leyes")

- **Quién es:** diseñador y autor de Laws of UX. El reel guardado en `UP/20-leyes-ux.png`
  (@adam_ha_yes) es una lista de esas leyes. Trae un error: la 16 y la 17 dicen las dos "Postel's
  law".
- **5 puntos clave para un panel**
  1. **Hick y Fitts:** menos opciones y el blanco grande y cerca (el pulgar).
  2. **Von Restorff:** destacar UNA cosa.
  3. **Doherty:** responder en menos de 400 ms o mostrar que se está trabajando.
  4. **Tesler:** la complejidad la absorbe el sistema, no el usuario (buenos valores por
     defecto).
  5. **Peak-end:** la gente recuerda el pico y el final. El final de cada flujo se diseña. También
     el **gradiente de meta y Zeigarnik:** una lista de arranque con avance ("2 de 5") empuja a
     terminar.
- **URLs:** https://lawsofux.com/ · https://lawsofux.com/teslers-law/ ·
  https://lawsofux.com/doherty-threshold/ · https://lawsofux.com/peak-end-rule/ ·
  https://lawsofux.com/goal-gradient-effect/
- **Para Onia:** R3, R4, R20, R35, R36, R37.

## 9. Luke Wroblewski

- **Quién es:** autor de "Mobile First" y "Web Form Design", ex Google e Yahoo.
- **5 puntos clave**
  1. **Mobile first:** la pantalla chica obliga a quedarse con lo esencial.
  2. **Lo obvio siempre gana:** lo importante va a la vista, no escondido en un menú.
  3. **Formularios cortos**, con el teclado correcto para cada dato, etiquetas arriba y validación
     clara.
  4. **Contenido antes que navegación.**
  5. **Diseñar para el pulgar:** las acciones frecuentes van abajo, al alcance del dedo, con
     blancos táctiles generosos.
- **URLs:** https://www.lukew.com/resources/mobile_first.asp ·
  https://www.lukew.com/ff/entry.asp?1945 ("Obvious Always Wins") ·
  https://www.lukew.com/ff/entry.asp?1962= (video) ·
  https://www.lukew.com/ff/entry.asp?1649 (navegación táctil)
- **Para Onia:** R4, R12, R15, R20.

## 10. Benji Taylor (Family): simplicidad, fluidez, deleite

- **Quién es:** diseñador de la billetera Family, cuyo texto "Family Values" es una referencia de
  apps celulares con hojas.
- **5 puntos clave**
  1. **Revelación gradual en bandejas:** una hoja chica por acción que no te saca de donde estás.
  2. **Cada bandeja tiene un solo tema.**
  3. **Transiciones que conectan:** los elementos viajan entre pantallas, no aparecen de golpe.
  4. **Curva deleite-frecuencia:** mucho deleite en lo raro y casi nada en lo diario.
  5. **Pulido parejo:** ninguna parte se siente de segunda.
- **URL:** https://benji.org/family-values
- **Para Onia:** R7, R17, R32.

---

## Candidatos que miré y no aportan reglas nuevas

- **Ryo Lu** (jefe de diseño de Cursor, antes Notion y Stripe): habla de proceso con IA y de
  diseñar conceptos antes que botones. Es útil como mentalidad, no da reglas de pantalla.
  https://a16z.com/podcast/ryo-lu-cursor-ai-turns-designers-to-developers/
- **shadcn/ui:** es la base de componentes, no un método de diseño. Ya está cubierto por R23-R25.

## Lo que ya habíamos guardado y sigue valiendo

- `VI/2026-08-11-mapa-42-skills-diseno-claude.md`: la capa visual que faltaba (`refactoring-ui`,
  `microinteractions`, `ux-heuristics`). Este documento la cubre con las fuentes originales, sin
  instalar skills de terceros.
- `VI/2026-08-12-20-senales-web-vibecodeada.md`: son señales técnicas de la web pública (SEO y
  metadatos), no del panel. Siguen en el gate de web-factory.
- `UP/20-leyes-ux.png`: está resumido en la sección 8.
