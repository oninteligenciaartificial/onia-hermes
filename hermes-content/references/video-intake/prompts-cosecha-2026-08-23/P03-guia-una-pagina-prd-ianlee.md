# P03 · Plantilla 'guia de una pagina': el patron de documento-lead-magnet extraido del reel Db6y_ypvWbF

- **Destino:** `web-factory`
- **Sale de:** [la ficha](../2026-08-23-cosecha-guia-una-pagina-prd-ianlee.md) · `Db6y_ypvWbF` · @ianlee.js
- **Fuente:** https://www.instagram.com/p/Db6y_ypvWbF/
- **Tipo:** MIXTO
- **Qué falta para hacerlo hoy:** Nada. No hace falta credencial, permiso ni gasto. El CONTENIDO del metodo PRD ya esta cubierto por make-plan, superpowers:writing-plans y el comando prp-prd; lo que se copia aca es la FORMA, no el fondo.

---

```text
Objetivo unico de la sesion: construir la plantilla HTML reutilizable de 'guia de una pagina' de ONIA, portando el MECANISMO de diseno de un documento de referencia. No es un rediseno de nada vivo: es un archivo nuevo en el banco de patrones.

Carril: web-factory. Worktree con ruta explicita; correr `git branch --show-current` antes de tocar nada.

ANTES de codear, cargar: skill `impeccable`, skill `ui-ux-pro-max`, y la galeria interna `hermes-content/references/ui-patterns/`. Regla del proyecto: nada de plantilla generica de Tailwind/shadcn — hay que cumplir >=4 de las Required Qualities de rules/web/design-quality.md.

REFERENCIA (extraida a mano de 58 fotogramas de https://www.instagram.com/p/Db6y_ypvWbF/ de @ianlee.js; los fotogramas estan en el intake de video, ficha `guia-una-pagina-prd-ianlee`). El documento original es en espanol, se llama 'Escribe tu maldito PRD' y es una pagina HTML renderizada en navegador. NO lo copies literal: porta el MECANISMO, con contenido nuestro.

El mecanismo, pieza por pieza:
1. Titulo corto y contundente + una sola linea de subtitulo que promete el beneficio en tres palabras ('claridad, control y velocidad'). Regla horizontal de 1px debajo.
2. Secciones numeradas con el simbolo de seccion (§1, §2, §3). El titulo de la seccion es corto y su definicion va EN LA MISMA LINEA, en gris, no debajo. Esto ahorra media pantalla por seccion.
3. Bloque de dos columnas contrapuestas: 'CONTIENE' (azul) vs 'NUNCA CONTIENE' (rojo). Cada item es un chip con borde de 1px y relleno tenue. Los chips de la columna roja van TACHADOS. El tachado hace el trabajo que haria un parrafo entero de 'no incluyas'.
4. Bloque de comparacion 'ASI NO' / 'ASI SI': la caja mala en gris con los items tachados, la caja buena en rojo con una cita real entre comillas angulares. Sin iconos de check ni de cruz.
5. Parrafo de cierre de seccion con negrita A COLOR sobre las 3-4 frases clave, para que el resumen se lea sin leer el parrafo.
6. Tabla de tres columnas donde la columna del medio es una BARRA de ancho creciente y la barra ES el dato: sin eje, sin numero, sin leyenda. La columna derecha dice el veredicto en negrita + la explicacion en gris.

Tokens (hex aproximado, leido de pantalla; ajustalos a la paleta viva de ONIA si ya existe una en el repo, y si existe MANDA la de ONIA):
- papel #FDFDFC, tinta #1A1A1A
- acento primario ~#2B4C9B sobre relleno ~#F4F7FE
- acento de prohibicion ~#B3261E sobre relleno ~#FDF4F3
- descarte ~#F2F2F0 con texto tachado ~#8A8A85
Tipografia: UNA sola grotesca geometrica en dos pesos. Etiquetas de seccion en versalitas espaciadas. Cero sombras, cero degradados, cero radios grandes, cero texturas. Plano y editorial.

QUE CONSTRUIR:
- `hermes-content/references/ui-patterns/guia-una-pagina/plantilla.html` — autocontenido, sin CDN, tokens CSS en `:root`, responsive real (sin scroll horizontal a 390px), y con los seis bloques de arriba marcados con comentarios HTML para que se puedan borrar los que no se usen.
- `hermes-content/references/ui-patterns/guia-una-pagina/README.md` — que dice de donde salio el patron (la URL y la cuenta), que hace cada bloque y CUANDO usar cada uno.
- Un ejemplo relleno con contenido REAL de ONIA en la misma carpeta (`ejemplo-dental.html`), usando el rubro dental que es el unico vivo.

REGLAS DURAS DE ONIA que aplican al ejemplo relleno:
- Prohibido escribir una cifra de precio a mano. Los precios se LEEN de onia-platform/lib/pricing.ts (add-ons) y onia-platform/lib/subscription-plans.ts (planes). Si el ejemplo necesita un precio, dejalo como un placeholder marcado, no lo inventes.
- Prohibido exhibir obra: ni 'muy pronto', ni 'beta', ni 'proximamente', ni listas de lo que falta. Solo se nombra lo que esta vivo.
- Prohibido fabricar: cero testimonios, cero logos de clientes, cero metricas. Hay cero clientes pagando.
- El unico CTA final es agendar una demo en https://cal.onia.com.bo (decision del 2026-08-23). No es un PDF, no es un lead magnet descargable.

VERIFICAR MIRANDO, no suponiendo: abrir los dos HTML en Chromium headless con Playwright y GUARDAR las capturas al lado del archivo. Un grep no confirma que se vea bien.

LISTO = existen `hermes-content/references/ui-patterns/guia-una-pagina/plantilla.html`, `README.md` y `ejemplo-dental.html`; hay cuatro capturas PNG guardadas en esa carpeta (plantilla y ejemplo, cada uno a 1440x900 y a 390x844) tomadas con Chromium headless y MIRADAS; ninguno de los dos HTML produce scroll horizontal a 390px; `grep -iE 'muy pronto|beta|proximamente|próximamente'` sobre la carpeta no devuelve nada; el ejemplo no contiene ningun numero de precio escrito a mano; y el unico href de CTA del ejemplo es https://cal.onia.com.bo.
```
