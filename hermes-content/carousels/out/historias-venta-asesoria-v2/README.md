# Historias de la asesoría — v2 (rediseño)

**Estado: LISTA PARA MOSTRAR (no publicada).**

- Las láminas 1–3 de la **v1** (`../historias-venta-asesoria/`) **ya salieron el 10-oct**; la 4 la sube Sergio Urcullo a mano con el sticker de link.
- Esta **v2** es para la **próxima tanda**: propuesta **jueves 15-oct** (día de la historia de auditoría), **a confirmar por la madre**.
- Nada se agendó ni se publicó. La v1 no se tocó.
- Genera: `scripts/marca-personal/generar-historia-venta-v2.py`. Fotos: todavía no hay; **la versión sin foto es la final** y es la que se muestra.

## Qué se mira

| Archivo | Para qué |
|---|---|
| `historia-01.png` … `historia-04.png` | Las 4 láminas finales, 1080×1920, sin foto. |
| `390/historia-0N-390.png` | Cómo se ve cada una en un 390×844 (@2x, «contain»: ancho 390, alto 693, barras negras). |
| `CHEQUEO-banda-segura.png` | Copia de chequeo con la interfaz de IG: bandas **azules** (arriba 230 px, abajo 422 px) y, en la 4, la zona del sticker en **ámbar**. Solo para mirar: no es parte de ninguna lámina. |
| `FOTO-SLOTS.png` | Las 4 láminas con la ventana de foto vacía y señalada (para pedir las tomas). No es final. |
| `medidas-390.json` | Medidas crudas (tamaños de texto, extensión del contenido por píxeles, tipografías usadas). |

## 1. Crítica de la v1 (qué falla y qué sirve)

1. **Las cuatro son el mismo afiche.** Verde plano + tarjeta negra + banda negra + sticker redondo + ícono 3D en todas; cambia el texto, no la prueba visual. Es justo lo que la regla de «una prueba distinta por lámina» prohíbe.
2. **Tres mensajes por lámina** (tarjeta + remate + sticker: «pensalo 10 seg», «ni cerca», «5 min», «sin costo y sin venta»). Y el remate de la 1 («Empezá por ahí») dice que empiece por responder tarde, mientras la 3 dice que empiece por la tarea que más se repite: dos instrucciones.
3. **La «prueba en pantalla» es texto corrido.** La 3 lista 5 preguntas de 1–2 líneas + regla a 40/38 px (14,4 y 13,7 px a 390, bajo 16), y la 4 es un **párrafo de 19 palabras** que no muestra qué se lleva la persona.
4. **Texto secundario bajo 11 px a 390** en las cuatro: etiqueta y @handle a 28 px (10,1–10,2 px) y stickers a 29 px (10,5 px). *(Derivado del CSS de la v1, no medido en captura.)*
5. **La PNG final de la 4 lleva impreso el recuadro punteado «LINK ACÁ ↓».** El sticker lo tapa solo en parte: la guía tenía que ir solo en la copia de chequeo.
6. **Datos sin fuente o contradictorios:** «5 min» y «10 seg» no están en ninguna fuente; «sin venta» choca con el guion de la asesoría (min 18-20 invita a ver Onia a clínicas dentales, `ONIA_COMUNIDAD_CONTENIDO.md`).
7. **Fuera del pack `referentes`:** verde `#00C661` (el pack es `#10C26B`), Archivo + Geist Mono y íconos 3D (campana, bolsa de dinero…) que decoran pero no prueban nada.
8. **Lo que está bien y se conserva:** la estructura gancho → mito → revelación → CTA único; el copy (pregunta 4 del checklist, el mito, las 5 preguntas reales, una sola acción); la banda segura respetada; el link de cal.com **no** se escribe en ninguna lámina; el sticker de link solo en la 4.

## 2. Lógica de la v2 (una prueba visual distinta por lámina)

| # | Rol | Fondo | Prueba visual | Mensaje único |
|---|---|---|---|---|
| 1 | Gancho | negro | **Un mensaje de cliente sin respuesta** (burbuja tipográfica + «visto · sin respuesta», marcada «UN CLIENTE TE ESCRIBE»: ejemplo, no captura ni testimonio) | «¿Dónde perdés clientes por responder tarde?» (pregunta 4 del checklist) |
| 2 | Mito | blanco | **Contraste hecho con texto:** las dos creencias tachadas a mano vs. la frase que queda | «No se empieza por ahí.» |
| 3 | Revelación | verde | **Lista numerada con marca:** las 5 preguntas del checklist (versión corta, mismo orden) en tarjeta + la regla | «La que aparece en 2 o más: esa va primero.» |
| 4 | CTA | negro | **Tarjeta de acción:** «20 min · videollamada por Google Meet» + 3 ✓ de qué te llevás + «tocá el link ↓» | «Reservá la tuya.» (una sola acción) |

- Copy: v1 + `ONIA_COMUNIDAD_CONTENIDO.md` (asesoría de IA gratis, 20 min, con qué se va; checklist del viernes). Sin cifras, logos, testimonios ni pantallas inventadas. Voseo.
- Paleta/tipos del pack `referentes`: verde `#10C26B`, blanco, negro `#0A0F0D`; Bricolage (del repo; su archivo llega a 700) + DM Sans + DM Mono + Caveat (del sistema; las instala `carousel_cloud_setup.sh`).
- Banda segura: contenido en y 270–1431 (la 4: 270–1234). **Tercio inferior de la 4 libre: 0 píxeles distintos del fondo entre y 1280 y 1920** (el sticker va ahí, centrado, y ≈ 1290–1480). El recuadro del sticker **solo** existe en `CHEQUEO-banda-segura.png`.
- Contraste (calculado): verde sobre negro 8,2:1 · gris `#9FB0A8` sobre negro 8,5:1 · `#4F5A55` sobre blanco 7,2:1 · `#0B3B24` sobre verde 5,4:1 · negro sobre verde 8,2:1. Cero píxeles rojos/naranja/terracota (medido por tono).

## 3. Foto opcional de Sergio Urcullo

Cada lámina declara su ventana. **Sin foto no se dibuja nada** (la lámina final se ve terminada por sí sola).

| Lámina | Ventana | Tamaño en el lienzo | Toma | Fondo | Foto mínima |
|---|---|---|---|---|---|
| 1 | Franja horizontal, abajo (y ≈ 930–1450) | 936×520 | **A** | oscuro liso | vertical 1080×1920 |
| 2 | Franja horizontal, abajo | 936×520 | **B** | claro liso | vertical 1080×1920 |
| 3 | Sello circular, arriba a la derecha | 260×260 | **C** | cualquiera (se recorta) | cuadrada 1080×1080 |
| 4 | Sello circular, arriba a la derecha | 260×260 | **C** (la misma) | cualquiera (se recorta) | cuadrada 1080×1080 |

Con foto cambia la composición (la lámina se compacta y la ventana ocupa el hueco). Medido por píxeles con una imagen neutra: contenido hasta y 1449 (1 y 2), 1420 (3) y 1263 (4, **tercio inferior libre: 0 píxeles desde y 1280**).

### PEDIDO FOTOS (para la madre, máx. 3 tomas)

Todas: **vertical**, cámara trasera del celular, a la resolución máxima, **original sin recortar ni filtros**. Ropa **lisa** (negro, gris o blanco), **sin logos ajenos**, sin gorra ni lentes oscuros. Luz **de ventana** de día, a un costado o de frente; **nunca contraluz** (cara en sombra).

1. **Toma A — «serio y cercano» (lámina 1).** De pie, a ~1,5 m de una **pared lisa oscura** (o un rincón vacío). Mirando al lente, boca cerrada, cejas relajadas. Plano medio (cabeza y pecho): ojos a ~35 % desde arriba, cara = 17–20 % del alto del cuadro.
2. **Toma B — «¿en serio?» (lámina 2).** Mismo lugar y encuadre que A pero con **pared clara lisa**. Una ceja arriba, labios apretados, leve inclinación de cabeza. **Sin manos** en cuadro.
3. **Toma C — «sonrisa» (láminas 3 y 4).** **Primer plano**: cara = 60–65 % del cuadro, sonrisa leve, mirando a cámara, luz de frente. Fondo liso cualquiera (se recorta a círculo). Cuadrada o vertical con la cara en el tercio superior.

**Qué NO:** otras personas (ni al fondo) · pantallas, monitores o cuadernos con datos de clientes · carteles o texto legible detrás · logos ajenos · filtros de belleza o de Instagram · espejo con el celular a la vista · fotos ya publicadas.

Edición **local**: la cara de Sergio Urcullo no se sube a ningún servicio externo. Para integrarlas:

```
eval "$(sh scripts/carousel_cloud_setup.sh)" && python3 scripts/marca-personal/generar-historia-venta-v2.py \
  --foto 1=/ruta/A.jpg --foto 2=/ruta/B.jpg --foto 3=/ruta/C.jpg --foto 4=/ruta/C.jpg
```

Salen en `con-foto/` (la carpeta solo se crea con `--foto`). **Ojo:** el camino con foto se probó con una imagen neutra (degradado), no con una cara; el encuadre pedido (% de cara, posición del recorte) está calculado, no visto con una persona. **Hay que mirar cada `con-foto/` antes de usarlo.**

## 4. Tamaños medidos a 390 px de ancho

Método: se recorre cada nodo de texto de la página y se multiplica su `font-size` computado por 390/1080 (= 0,361). Cada texto lleva un rol (`principal` / `secundario`); **0 textos sin rol** en las cuatro. Umbrales: ≥ 16 px el principal, ≥ 11 px el secundario.

| Lámina | Texto más grande | Principal más chico | Secundario más chico | Veredicto |
|---|---|---|---|---|
| 1 | 41,9 px | 30,3 px («Hola, ¿cuánto cuesta?») | 12,3 px | pasa |
| 2 | 53,4 px | 21,7 px («Todos creen que automatizar es:») | 12,3 px | pasa |
| 3 | 46,2 px | 18,8 px (las 5 preguntas) | 12,3 px | pasa |
| 4 | 46,2 px | 18,1 px (los 3 ✓ de la tarjeta) | 12,3 px | pasa |

**Ninguna lámina queda por debajo.** El mínimo de las cuatro (12,3 px) es siempre lo mismo: la etiqueta `0N/04`, el `@sergiourcullo` y la etiqueta «UN CLIENTE TE ESCRIBE» / «ASESORÍA DE IA · GRATIS» (todas a 34 px en el lienzo, tipografía mono: se leen más chicas que su tamaño nominal). Es cuerpo secundario; ninguna decisión depende de leerlo.

Tipografías confirmadas en el render (CDP `getPlatformFontsForNode`): títulos = Bricolage Grotesque **[repo]**; resto = DM Sans / DM Mono **[sistema]**. En una PC sin esas fuentes caería a otra: renderizar en la nube.

## 5. Regenerar (un solo comando)

```
cd /home/user/onia-hermes && eval "$(sh scripts/carousel_cloud_setup.sh)" && python3 scripts/marca-personal/generar-historia-venta-v2.py
```

Escribe solo en esta carpeta (o en `--out <carpeta>`). Usa Node + Playwright (`/opt/node-tools`). Imprime por lámina los tamaños a 390 px y la extensión del contenido en píxeles.

## 6. Decisiones que no son mías

1. **Burbuja de ejemplo en la 1** («Hola, ¿cuánto cuesta?», rotulada «UN CLIENTE TE ESCRIBE»): escena ilustrativa, sin nombre, hora ni marca de app. Si se prefiere cero escenas, se saca y queda el titular.
2. **«tocá el link ↓» en la 4 solo es verdad si Sergio Urcullo pega el sticker.** Sin sticker, la 4 no se sube.
3. **Cupo «3 por semana»** (de `ONIA_COMUNIDAD_CONTENIDO.md`): no se escribió. Ponerlo solo si ya está configurado en cal.com.
4. **«sin venta» salió** (guion min 18-20). Si Sergio Urcullo quiere mantenerlo, que sea decisión suya.
5. **El verde cambia:** v2 usa `#10C26B` (pack `referentes`); los kits de historias ya aprobados (`curso-dia1`, `historias-llamada`, v1) usan `#00C661`. En el perfil se verán dos verdes.
6. **Qué se publica el 15-oct:** las 1–3 de la v1 ya salieron el 10-oct. ¿Se publica la v2 completa como tanda nueva (repite el mensaje con otro diseño) o solo la 4 nueva?
