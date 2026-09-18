# Brief para Samuel · los 10 videos pedidos (17-sep)

> Respuesta de este carril al pedido de Samuel. Por video: estado, QUÉ se muestra en
> pantalla (shot list) y qué falta decidir. Regla transversal: **solo se muestra lo
> VIVO** (catálogo de venta manda) y **nada con secretos en pantalla** (tokens, claves,
> datos de clientes reales).

## 1-2 · OnIA Platform (2 videos) — beneficios: YA definidos

**Los beneficios salen del catálogo, no se inventan.** Verificado hoy en
`ONIA_CATALOGO_DE_VENTA.md` — lo 🟢 vivo y mostrable:

| Video | Beneficio | Shot list |
|---|---|---|
| **A · «Tu negocio en orden»** | agenda y citas · clientes · servicios · inventario | 1) `/agenda`: crear una cita en vivo 2) `/patients`: la ficha del cliente con su historial 3) `/inventory`: stock simple 4) la agenda pública: el link que el cliente usa para reservar solo |
| **B · «El que contesta cuando no estás»** | chatbot IA web + WhatsApp | 1) el chat web contestando una pregunta de precio 2) el dueño EDITANDO el guion conversando 3) la bandeja: el bot se aparta cuando contesta el humano 4) escala una cita a persona |

⚠️ **Dónde se publica:** estos 2 van a `@oniahq` (cuenta de producto), NO al perfil de
Sergio — en marca personal no se vende Onia. Y cero «muy pronto»: solo lo que se ve
andando. Datos DEMO (org de prueba), jamás datos de clientes reales.

## 3 · Cómo instalar una Skill en Claude Code — LISTO, no se regraba

Ya existe el material: el **YT 02** (publicado, 13:57) instala Claude Code Y escribe la
primera skill; la guía con comandos vive en `sergiourcullo.vercel.app/claude-code`.
Samuel puede: recortar del YT 02 el tramo de la skill, o grabar pantalla siguiendo la
guía tal cual. Shot list si graba: carpeta `.claude/skills/` → crear `SKILL.md` → texto
de reglas → invocarla y que se vea el resultado.

## 4-5 · n8n (2 videos) — automatizaciones y objetivo definidos

| Video | Automatización | Objetivo del video |
|---|---|---|
| **A · «Tu primer loop en 30 segundos»** | Schedule → mensaje (Telegram o WhatsApp) | que el espectador arme UNO hoy: trigger de horario + un mensaje. Es el guion ya escrito del sáb 12 |
| **B · «El aviso que te salva»** | monitor → si algo falla → aviso al teléfono | enseñar el patrón trigger+condición+acción con el caso real: el aviso de las 3:01 AM |

Shot list común: el lienzo de n8n armando el flujo cajita por cajita, el toggle de
activar, y el mensaje llegando al teléfono EN CÁMARA. ⚠️ Sin credenciales en pantalla:
los nodos de credencial se muestran ya configurados, nunca abiertos.

## 6-7 · Roadmap 1-1 (2 videos) — ⛔ FALTA DEFINIR

No existe «Roadmap 1-1» en ningún doc del sistema. Preguntarle a Samuel qué es:
¿el recorrido de las llamadas 1 a 1 (la agenda Cal)? ¿un roadmap personal? Hasta tener
la definición, no hay nada que preparar. **No se fabrica.**

## 8 · Campaña con Pomelli — ⛔ PROBAR ANTES DE ENSEÑAR

Pomelli es la herramienta de campañas de Google Labs. **Regla de la casa: apps solo
probadas por nosotros, y siempre con su «qué NO hace».** Nadie acá la probó todavía.
O se prueba primero (una campaña real de prueba, y del resultado sale el video), o el
video no va. Si Samuel ya la probó él: que pase capturas y su «qué NO hace».

## 9 · Ranking de Skills para desarrollo web — LISTO, con las que usamos

Las 5 del ranking, todas instaladas y usadas acá (sin estrellas en pantalla — envejecen):

1. **impeccable** — el checklist de UI que corre antes de codear una interfaz
2. **ui-ux-pro-max** — estilos, paletas y tipografías buscables (79 estilos)
3. **frontend-design** — la base de construcción de interfaces
4. **gsap-skills** (oficial de GreenSock) — animación y scrollytelling
5. **taste-design** — el criterio: qué queda y qué se tira

Shot list: pedirle a Claude Code una sección de landing CON y SIN skills cargadas, y
mostrar la diferencia lado a lado. Ésa es la prueba que convence.

## 10 · Cómo crear tu avatar con Higgsfield — ⚠️ BLOQUEADO POR REGLA

Regla escrita del 11-sep, vigente: **«Nada de Higgsfield»** en contenido (cobro anual
en reclamo). Además, si algún día va: el método real es Soul+texto (único que da
consistencia) y toda cuenta con avatar IA lleva etiqueta de IA obligatoria.
**Levantar la regla es decisión de Sergio Urcullo, no de este brief.**

---

## Qué preparo yo (este carril) si Sergio da el ok

1. **Org demo de Onia Platform con datos de utilería** (citas, clientes, stock falsos)
   lista para grabar los videos 1-2 sin exponer a nadie.
2. **Los dos flujos n8n de demo** montados y andando para que Samuel solo grabe.
3. **Capturas estáticas** de cada shot list como storyboard (con `onia-mirar.js`).
La grabación de pantalla en video la hace Samuel (u OBS en la sesión de edición) —
sobre los entornos ya preparados.
