# Método de carruseles virales — @gioexplica (extraído 2026-08-07)

Carrusel de @gioexplica "Como criar carrosséis estupidamente virais em 60 segundos".
Resultado que muestra: **5,9M visualizaciones · 249 mil likes · 202 mil compartidos ·
89 mil guardados · 540 mil interacciones**. El método es literalmente **usar Claude**
(el mismo modelo que corre ONIA) — ya estamos parados sobre la herramienta correcta.

## El método (6 slides)
1. **Portada:** "Cómo crear carruseles virales en 60 segundos" (serif display + palabra en italic).
2. **Setup:** abrir Claude → sección "Proyectos" → crear proyecto "Criador de carrosséis".
3. **El prompt:** pegar el prompt (abajo) como instrucción del proyecto. El prompt le enseña
   a Claude sobre tu negocio (tu oferta, tu nicho, tu cliente ideal).
4. **La base:** darle una base de +1000 carruseles ganadores de 60 nichos como referencia.
5. **Uso:** cada vez que querés uno nuevo, solo escribís el tema → Claude devuelve el carrusel
   completo, listo para publicar.
6. **Resultado + CTA:** métricas virales + "comentá GIO y te mando los prompts + guía".

## EL PROMPT (lo valioso — transcrito del slide 3, en inglés como estaba)
> You are an expert in creating Instagram carousel posts designed to **sell, position, and
> attract ideal clients**. Your task is to generate a complete carousel based on the
> information provided by the user.
>
> ## CAROUSEL STRUCTURE
>
> **SLIDE 1 — HOOK (cover)**
> One single sentence. For the scroll. Generate immediate curiosity or tension.
> Examples that work:
> - "The mistake that [causes harm] in ____, is ___."
> - "If you spend [time] doing X and [nothing happens], it's because of this."
> - "No one tells you this about ___."
> - "What separates [A] from [B] is not what you think."
>
> **SLIDE 2 — PROBLEM**
> Name the pain with precision. What the reader thinks: "this is happening to me."
> Specific. Emotional. No generic sentences.
>
> **SLIDE 3–5 — DEVELOPMENT / SOLUTION**
> Reveal a new paradigm. No tips. No boring lists.
> *(el resto del prompt quedó fuera de cuadro en el slide — probablemente SLIDE de cierre/CTA
> y reglas de tono; la estructura clave es esta.)*

## Qué me llevo para ONIA (vs lo que ya hacemos)
- **Ya estamos por delante:** ellos generan solo el COPY con Claude y después lo maquetan a
  mano (Canva). Nosotros generamos copy **Y** renderizamos los PNG on-brand automáticamente.
  Su cuello de botella (diseñar cada slide) nosotros lo tenemos resuelto por código.
- **Fórmulas de hook para adoptar** (van al banco de ganchos, se alinean con los de objeción):
  - "El error que [causa daño] en ____ es ___."
  - "Si pasás [tiempo] haciendo X y [no pasa nada], es por esto."
  - "Nadie te cuenta esto sobre ___."
  - "Lo que separa [A] de [B] no es lo que pensás."
- **Principio fuerte:** slides 3-5 = "revelá un nuevo paradigma. **Nada de tips. Nada de listas
  aburridas.**" — subir el nivel de los puntos: no "5 tips" sino un reencuadre que cambie cómo
  ven el problema.
- **Slide 2 = dolor con precisión** ("esto me está pasando a mí"): específico y emocional, no
  genérico. Refuerza nuestra regla 2 (stakes).
- **Base de referencia:** darle a nuestro generador una base de carruseles ganadores por nicho
  como contexto (nosotros ya armamos el banco `references/` — seguir alimentándolo).
- **Método operativo idéntico al nuestro:** proyecto Claude + prompt-sistema + escribir el tema.
  Validación externa de que el enfoque de ONIA es el correcto.

## Acción
- Sumar las 4 fórmulas de hook al `carousel_generator` / banco de ganchos.
- Adoptar "nuevo paradigma, no tips" como regla de los slides de desarrollo.
- Considerar armar un "proyecto/prompt maestro" con nuestra estructura de 5 reglas + estas
  fórmulas, alimentado por el banco `references/`.
