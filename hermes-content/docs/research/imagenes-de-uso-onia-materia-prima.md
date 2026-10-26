# Investigacion — imagenes de uso para la web de Onia (materia prima)

> **Que es esto.** Salida cruda de los lentes del workflow `wf_4ca119e5-8e7`, rescatada al
> cerrar la sesion del 2026-08-23 para que no se pierda con el transcript. NO es el plan
> final: el workflow quedo corriendo y las fases de verificacion y diseno no habian
> terminado. Ver `hermes-content/docs/historial/handoff/claude-git-status-935f47.md` §"El frente de
> imagenes con Higgsfield" para saber como retomarlo — incluye el `scriptPath` y el `runId`
> para relanzarlo con cache.
>
> **El encargo de Sergio:** *"las capturas hazlas con higgsfield pero que tengan correlacion
> con lo que quieras mostrar, y recuerda que la web tiene que ser funcional mostrar usos
> practicos y mas que todo vender"*.
>
> **Decision de alcance ya tomada:** las capturas de INTERFAZ siguen siendo reales — generar
> una UI falsa con IA seria fabricar producto, y esta prohibido. Higgsfield genera las
> imagenes de CONTEXTO y USO: personas de Bolivia en su negocio.

---

## Dirección fotográfica — Onia (imágenes de contexto y uso)

### 0. La regla que gobierna todo

La foto muestra **el negocio y la persona**. La interfaz sigue siendo captura real. Por lo tanto:

> **Ninguna imagen generada puede contener pantalla legible ni texto legible.** Ni UI, ni letreros, ni precios, ni etiquetas. Si se ve un celular o una laptop, la pantalla va apagada, en ángulo imposible de leer, o con velo de reflejo. Todo texto del entorno queda fuera de foco o fuera de cuadro.

Motivo: una UI dibujada por IA es producto fabricado (prohibido), y Higgsfield escribe texto roto. Esto no es una limitación estética, es el gate de aprobación de cada imagen.

Segunda regla dura: **cero estado de obra, cero cifra inventada.** Como no hay texto legible, ninguna foto puede afirmar un cliente, un monto ni un resultado.

---

### 1. Qué hacen las SaaS verticales que venden bien (investigado)

| Empresa | Qué hace bien | Qué robamos |
|---|---|---|
| **Jobber** | La foto es **el dueño del oficio con nombre y apellido** (plomero, jardinero, limpieza), retratado sobre fondo neutro, junto a su cita. Las capturas de app van por separado, en bloque propio. | La **separación limpia**: persona en una pieza, UI real en otra. Nunca la IA dibujando la pantalla que la persona mira. |
| **Toast / Square** | El hardware aparece **en el mostrador real** —grasa, cajas, cliente del otro lado—, no sobre fondo blanco de catálogo. | El contexto sucio y el punto de vista desde el lado del cliente del mostrador. |
| **Shopify / Mindbody** | Fotografía **documental de un oficio específico**, no "gente de negocios". Se reconoce el rubro en 0,3 s sin leer nada. | Que cada foto se lea como **un rubro concreto**, no como "una pyme". |

Lo que ninguna hace y por eso funcionan: **nadie sonríe a cámara señalando un monitor.**

Fuentes: [Jobber](https://www.getjobber.com/) · [Authentic vs stock photos](https://www.mattrobertsphoto.com/blog/authentic-vs-stock-photos/) · [Documentary-style coverage](https://workwithfunnel.com/blog/photography/documentary-style-photography-videography/) · [Adobe: the authenticity trend](https://blog.adobe.com/en/publish/2017/06/28/the-authenticity-trend-how-to-find-and-shoot-the-best-documentary-style-images-uk) · [Why your SaaS brand needs authentic imagery](https://www.insivia.com/why-your-saas-brand-needs-authentic-imagery/)

---

### 2. Auténtica vs stock — los 9 tell-tales

| Señal | Stock (matar) | Auténtica (buscar) |
|---|---|---|
| **Mirada** | A cámara, sonriendo | A su tarea, o a otra persona. Nunca a lente |
| **Luz** | Softbox frontal parejo, sin sombra | Una fuente dominante (ventana / tubo fluorescente del local), sombra visible y dirección clara |
| **Encuadre** | Sujeto centrado con aire simétrico | Descentrado, algo cortado en el borde, un objeto tapando parcialmente el primer plano |
| **Manos** | Abiertas al aire, gesto explicativo | **Ocupadas con un objeto**: lapicera, caja, guante, cajón, celular tomado de costado |
| **Desorden** | Escritorio vacío | Taza, cables, cinta, papeles apilados, ventilador de pie, caja de cartón abierta |
| **Grano** | Cero ruido, clarity al máximo | Grano fino ISO 400–800, micro-contraste bajo |
| **Foco** | f/1.2, fondo licuado | f/2.8–f/4: el fondo se lee, el negocio se reconoce |
| **Color** | Naranja-teal, saturación alta | Neutro tirando a frío en altura / cálido en Santa Cruz, saturación −12 |
| **Movimiento** | Todo congelado y nítido | Una mano levemente barrida (1/60), el resto firme |

---

### 3. Dirección Onia — parámetros ejecutables

**Personas.** Bolivianos reales de 28–55 años: rasgos andinos y cruceños, piel morena, cabello oscuro. Ropa de trabajo real —mandil dental verde agua o celeste, chaleco de ferretería, delantal, camisa polo, guardapolvo—, sin maquillaje de estudio, con cabello recogido de trabajo. **Máximo 2 personas por foto.** Una sola es mejor.

**Luz.** Una fuente dominante y diegética:
- Occidente / La Paz-Cochabamba → luz de ventana de altura, fría, contraste alto, sombra dura y definida.
- Santa Cruz → luz difusa tropical de mediodía filtrada por toldo o vidrio, cálida, alto ambiente.
- Interiores comerciales → tubo fluorescente del local mezclado con luz de puerta. Se permite el verde-cian del fluorescente, es marca de verdad.

Nada de flash frontal, nada de rim-light de estudio.

**Óptica.** 35 mm para contexto (el negocio se lee), 50 mm para una persona trabajando, 85 mm solo para detalle de manos. **f/2.8–f/4.** 1/60 para permitir barrido leve de mano. Grano fino tipo ISO 400.

**Ángulo.** Altura de ojo de una persona parada, o ligeramente por debajo, a la altura del mostrador —el espectador queda **del lado del cliente**, no flotando sobre la escena. Prohibido cenital, prohibido dron, prohibido contrapicado heroico.

**Posado: cero.** Momento intermedio: agachándose al cajón, girando el torso, tomando el celular de la mesa, entregando la vuelta. Nunca la pose de llegada.

**Color (para convivir con `#F9FBFA` papel, `#12100e` tinta, `#013925 / #00d26a` verde).**
- Saturación global −12; matices rojo y naranja bajados otro −10 (nada de acentos rojos que peleen con el verde de marca).
- Negros levantados apenas hacia un gris-verde muy leve; blancos frenados a ~96 % para que no se fundan con el papel del sitio.
- **Regla de marca diegética: cada foto lleva un verde dentro de la escena** —mandil, azulejo, planta, chaleco, caja, pared— para que el verde Onia entre por el mundo real y no por un filtro encima.
- Sin viñeteo agregado, sin HDR, sin split-toning.

**Entrega.** WebP, 4:3 (`--shape-ratio` del sitio) más un 16:9 para bandas anchas. Radio de esquina lo pone el CSS (`--r-block`), no la imagen.

---

### 4. Clisés PROHIBIDOS

Rechazo automático, sin discusión:

1. Traje, corbata, apretón de manos.
2. Oficina blanca sin objetos, sillas Eames, planta decorativa sola.
3. Sonrisa a cámara. Cualquier mirada al lente.
4. Gráficos, dashboards, íconos o "datos" flotando en el aire, hologramas, redes de nodos azules.
5. Pantalla legible de cualquier tipo. Texto legible de cualquier tipo.
6. Grupo de 4+ personas aplaudiendo, chocando manos, o alrededor de una laptop.
7. Post-it de colores en vidrio, pizarra con flechas.
8. Manos vacías gesticulando; manos gigantes en primer plano (rompe la IA y grita render).
9. Cabezas de robot, cerebros de circuitos, azul cibernético, cualquier iconografía "IA".
10. Modelo con look de agencia (piel perfecta, dientes blanqueados, ropa recién planchada, look Miami en vez de boliviano).
11. Skyline genérico, coworking con neón, escritorio de influencer.
12. Café latte art junto a una laptop plateada.

---

### 5. Shot list (8) mapeada a la página

Cada foto vende un **momento de trabajo**, no una idea abstracta.

| # | Sección | Momento | Rubro |
|---|---|---|---|
| 1 | Hero (junto a captura real) | Dueña de clínica dental de espaldas al sillón, girando hacia el mostrador de recepción, celular en mano tomado de costado. | dental |
| 2 | `#agentes` | Ferretero cerrando el local de noche, luz de tubo, celular apoyado sobre la caja mientras acomoda cajas. | comercio |
| 3 | `#chatbot` | Mano recibiendo un mensaje en el celular sobre el mostrador con guante de nitrilo a medio sacar. | estética |
| 4 | `#rubros` — dental | Odontóloga con mandil verde agua anotando en el mostrador, paciente saliendo desenfocado al fondo. | dental |
| 5 | `#rubros` — comercio | Vendedor detrás del mostrador de melamina contando billetes, estante de herramientas al fondo. | comercio |
| 6 | `#rubros` — importadora | Hombre con chaleco revisando cajas apiladas en depósito, portapapeles, luz de portón. | importadora |
| 7 | `#rubros` — servicios | Contadora en escritorio con archivadores y calculadora, papel en mano, luz de ventana lateral. | servicios |
| 8 | `#cierre` | Retrato de tres cuartos de perfil de un dueño de local, brazos cruzados apoyado en la puerta abierta, mirando hacia afuera. | genérico |

---

### 6. Plantilla de prompt (Higgsfield)

Prefijo y sufijo fijos; solo cambia el bloque `[ESCENA]`.

```
Documentary photograph, 35mm lens, f/3.2, 1/60s, ISO 400 fine grain.
Single dominant light source from [ventana lateral | tubo fluorescente del local | portón abierto].
[ESCENA: una persona boliviana de 30-50 años, rasgos andinos/cruceños, piel morena,
ropa de trabajo real, haciendo <ACCIÓN CONCRETA A MITAD DE MOVIMIENTO>,
en <LUGAR: consultorio dental pequeño / ferretería de barrio / depósito de importadora /
oficina contable / centro de estética>. Objeto verde presente en la escena.]
Candid, unposed, subject NOT looking at camera, eyes on the task.
Hands occupied with a physical object. Slight motion blur on one hand.
Cluttered real workspace: boxes, papers, cables, mug, standing fan.
Background legible but soft. Eye-level, slightly off-center framing, subject partially
cropped at frame edge.
Muted color, saturation -12, reds and oranges pulled down, lifted blacks, highlights
held below pure white. No HDR, no clarity.
Aspect 4:3.
```

**Negative prompt (fijo, siempre):**
```
text, letters, signage, readable screen, phone screen content, UI, dashboard, charts,
graphs, floating holograms, data visualization, icons, logos, suit, tie, handshake,
smiling at camera, eye contact, white empty office, studio lighting, softbox, flash,
teal and orange, HDR, oversaturated, glossy skin, model, stock photo, corporate,
group of people, high five, sticky notes, robot, AI brain, circuit board, blue neon,
extra fingers, deformed hands, close-up hands, watermark
```

---

### 7. Gate antes de publicar cada imagen

1. ¿Hay texto o pantalla legible? → rechazar.
2. ¿Alguien mira a cámara o sonríe posando? → rechazar.
3. ¿Se reconoce el rubro en 0,3 s sin leer? → si no, rechazar.
4. ¿Hay un verde dentro de la escena? → si no, regenerar.
5. ¿Las manos están bien y ocupadas? → contar dedos.
6. Puesta sobre `#F9FBFA`: ¿el blanco de la foto se funde con el papel o pelea con el verde? → corregir en color, no en la generación.

**Archivos leídos:** `C:/dev/proyectos/onia-hermes/.claude/worktrees/skills-setup-config-8d4674/web-factory/apps/onia-platform/src/app/globals.css` (tokens: `--bg #F9FBFA`, `--tinta #12100e`, `--senal #00d26a`, `--verde-900 #013925`, `--verde-700 #016141`, `--verde-300 #86D9B0`), `.../src/app/(sitio)/sitio.module.css` (`--shape-ratio` 4/3, `--r-block` 1.4rem), `.../src/app/(sitio)/page.tsx`, `.../src/app/(sitio)/switcher.tsx`.

---

# 5 momentos a fotografiar — investigación de campo

Fuente de correlación: cada rubro ya tiene SU pantalla real cableada en el conmutador (`switcher.tsx`, líneas 50-55). La foto de contexto tiene que ser **el segundo previo o posterior a esa pantalla exacta**, no una escena genérica del rubro.

| Rubro | Captura real que ya mostramos | La foto tiene que ser |
|---|---|---|
| Dental | Agenda del día: 3 citas con hora, duración, motivo y **teléfono** | el momento de usar ese teléfono |
| Comercio | Caja: total del día por método de pago + ventas una por una | el cierre de la tarde |
| Importadora | Cotizaciones B2B con estado y monto en Bs | el momento de responder una |
| Estética | Agenda del día: sesiones de láser y controles post-tratamiento | entre clienta y clienta |
| Servicios | Contabilidad: IVA e IT del mes + registro de ventas | fin de mes, de noche |

---

## 1. DENTAL

**Dolor real:** el paciente de las 15:00 no vino y no avisó. El sillón quedó parado una hora que ya está pagada (alquiler, aire acondicionado, la asistente). Confirmar uno por uno le come la mañana a la recepcionista, que lleva la agenda en un cuaderno espiral y el WhatsApp de su celular **personal** — cuando ella falta, nadie sabe quién viene mañana.

**Quién:** recepcionista/asistente, mujer 24-32, cruceña, cabello recogido en cola, uniforme scrub (celeste, verde agua o vino — no blanco), barbijo bajado al cuello, aros chicos. Al fondo, entrando en cuadro y desenfocado, el odontólogo/a 35-45 con casaca scrub manga corta (**no bata blanca larga**), guantes puestos, atendiendo.

**Dónde:** consultorio en planta baja de una casa sobre el 2do o 3er anillo de Santa Cruz. Piso de cerámica clara, split de aire acondicionado en la pared, mostrador de recepción de melamina blanca, vitrina de instrumental, un negatoscopio o monitor con una panorámica, plantas de plástico, ventilador de pie por si el split no da. Puerta abierta al box: se ve la lámpara del sillón y la escupidera.

**El instante:** ella de pie detrás del mostrador, celular en la mano derecha, la otra mano todavía apoyada en el cuaderno de citas abierto. Está mirando la pantalla del sistema (monitor o tablet en el mostrador) con la agenda del día y **marcando el número que le da esa fila**. Cuaderno abierto + pantalla encendida en el mismo cuadro: la foto cuenta el reemplazo sin decirlo.

**Que NO aparezca:** bata blanca almidonada · lupas quirúrgicas de gama alta · consultorio blanco escandinavo minimalista · nadie mirando a cámara ni sonriendo a cámara · guantes puestos sobre el teclado (delata montaje y rompe bioseguridad) · modelo gigante de dentadura de utilería · paciente con blanqueamiento perfecto · niños de banco de imágenes.

---

## 2. COMERCIO / FERRETERÍA

**Dolor real:** el fiado. Don Julio se lleva 3 bolsas de cemento y "el viernes te pago"; queda anotado en un cuaderno que se moja y que solo el dueño entiende. A fin de mes hay miles de Bs en la calle sin dueño claro. Segundo dolor, el mismo día: no sabe cuánto vendió hasta que cierra, cuenta el efectivo y **no cuadra** — porque entre medio hubo QR, transferencias y dos vueltos mal dados.

**Quién:** el dueño, hombre 45-58, moreno, contextura recia, camisa a cuadros manga corta o polo metido en el jean, cinturón de cuero, lápiz en la oreja, riñonera. Manos gastadas, uñas con polvo de cemento. Si es La Paz/El Alto: chompa o casaca encima, y muchas veces es la dueña, con pollera o con mandil azul sobre la ropa.

**Dónde:** ferretería de barrio. Estantería metálica angular hasta el techo con cajas de cartón arriba, tubos de PVC parados en el rincón amarrados con alambre, rollos de manguera negra, bolsas de cemento apiladas contra la pared, baldes colgados del techo, tornillos y clavos sueltos en cajones de madera o bidones cortados, calaminas afuera, mostrador de madera enchapada con vitrina de candados y llaves, calculadora grande de mesa, ventilador, portón metálico corredizo.

**El instante:** final de la tarde, luz cálida y baja entrando por el portón. El dueño detrás del mostrador, **el cuaderno de fiados abierto a su izquierda** y la tablet o laptop a su derecha con la pantalla de caja: total del día por método de pago y las ventas una por una. Está mirando la pantalla con una mano todavía sobre el cuaderno — el gesto de "esto ya no lo necesito".

**Que NO aparezca:** supermercado moderno con góndolas iluminadas · POS de retail con lector láser · delantal de marca · barba hipster · estantes vacíos tipo showroom · fajos de billetes en la mano · el código de barras como protagonista (media ferretería boliviana no tiene código) · local impecablemente ordenado (la ferretería real está llena y apretada, ese desorden ES la credibilidad).

---

## 3. IMPORTADORA / DISTRIBUIDORA

**Dolor real:** cotiza a mano. Un cliente le pide precio por 300 unidades y tiene que abrir el Excel de costos del último contenedor para saber si, con flete, tributos de aduana y el despachante, le queda margen. Tarda dos días y el cliente ya compró en otro lado. Y de las 40 cotizaciones que mandó este mes, no sabe cuáles siguen vivas.

**Quién:** el dueño o gerente comercial, 38-52, polo o camisa manga corta con el logo bordado de la empresa, jean, zapatos cerrados con polvo, celular grande en la mano, llavero de auto. Segundo plano: un ayudante joven (20-28), gorra, mandil o chaleco, bajando una caja del rack. En El Alto el equivalente es el dueño mayorista con chaleco y pantalón de vestir, y muchas veces la socia/esposa lleva la parte administrativa desde el escritorio.

**Dónde:** depósito real — Parque Industrial de Santa Cruz o galpón en Villa Fátima / Río Seco. Techo de calamina con estructura metálica, tragaluces, racks industriales, pallets de madera, cajas de cartón con marcas chinas y guías de despacho pegadas, film stretch a medio usar, transpaleta manual, cinta de embalar, y una oficinita de melamina y vidrio metida dentro del galpón.

**El instante:** de pie junto al rack, la laptop o tablet apoyada sobre una caja, mirando la lista de cotizaciones B2B con su estado y su monto en bolivianos; en la otra mano una guía impresa. Está por cambiarle el estado a una — la cotización que estaba trabada. Al fondo, borroso, el ayudante bajando la caja de ese mismo pedido.

**Que NO aparezca:** contenedores en un puerto (Bolivia no tiene mar — es el clisé que delata banco de imágenes al instante) · barco, grúa portuaria, avión de carga · oficina corporativa con vista a rascacielos · traje y corbata · montacargas rojo nuevo de catálogo · sala de directorio con gráficos · mapamundi con flechitas · almacén Amazon con pasillos infinitos y piso epóxico.

---

## 4. ESTÉTICA

**Dolor real:** la clienta compra el paquete de 6 sesiones de láser, hace 3 y desaparece. Nadie la llama, el paquete queda a medias y ese ingreso ya cobrado se transforma en un reclamo dentro de seis meses. Y la agenda vive en los DM de Instagram: 40 conversaciones abiertas, dos clientas anotadas a la misma hora y un solo box.

**Quién:** la dueña, cosmetóloga/esteticista, 28-40, uniforme scrub blanco, rosa palo o beige, cabello recogido, uñas hechas, poco maquillaje, celular a mano. Es dueña Y recepción Y quien aplica: negocio de dos o tres personas.

**Dónde:** casa adaptada en barrio residencial cruceño (Equipetrol, Las Palmas, sobre el 3er anillo), cartel de acrílico en la reja. Recepción con sillón de cuerina y plantas de verdad, split, luz cálida, espejo grande con luces. Sala de tratamiento: camilla con papel descartable recién cambiado, el equipo de láser/depilación sobre ruedas apagado al lado, carrito con frascos, estante con productos de skincare, toallas dobladas de verdad (no en rollo de spa).

**El instante:** entre clienta y clienta. Ella de pie al lado de la camilla vacía con el papel nuevo puesto, celular en la mano, mirando la agenda del día — sesiones de láser y controles post-tratamiento. Está viendo que a las 16:30 tiene un control post-tratamiento y ya está escribiéndole. La sala vacía y ordenada, esperando: eso es lo que se está llenando.

**Que NO aparezca:** spa de hotel 5 estrellas — piedras calientes, velas, pétalos flotando, toallas enrolladas en bandeja · modelo con rodajas de pepino en los ojos · blanco total tipo clínica europea · antes/después de piel (es una promesa médica que no vendemos) · guantes puestos manipulando el celular · rostro de modelo profesional a cámara · cualquier cosa que sugiera resultado garantizado.

---

## 5. SERVICIOS PROFESIONALES (estudio contable)

**Dolor real:** fin de mes. Lleva 25 NITs y tiene que armar el Libro de Ventas IVA y liquidar IVA e IT de cada uno antes de su vencimiento según el último dígito del NIT. Cada declaración sale de una pila de facturas y un Excel distinto por cliente. Un dígito mal tipeado es una multa que paga él. Y encima cobra honorarios por cliente y no tiene idea de cuáles ya le pagaron la cuota de este mes.

**Quién:** contador/a 34-52. En La Paz: chaleco o saco sobre camisa, lentes, más formal, luz fría de ventana. En Santa Cruz: camisa manga corta o blusa, manga arremangada, ventilador. Taza de café a medio tomar, no de cartón de cafetería.

**Dónde:** oficina chica en edificio sobre avenida — Sopocachi o el centro paceño (Loayza, Potosí), o una galería sobre Cañoto / Monseñor Rivero en Santa Cruz. Archivadores de palanca rotulados a mano por cliente, apilados hasta el techo; cajas de facturas; escritorio con laptop más un monitor viejo; impresora multifunción; sello y almohadilla; el calendario de vencimientos del SIN pegado en la pared; cables a la vista; un botellón de agua en el rincón.

**El instante:** de noche — ventana oscura, lámpara de escritorio encendida, la oficina de al lado apagada. Archivador de palanca abierto al costado con facturas asomando, la calculadora recién soltada. Está mirando la pantalla con el IVA y el IT del mes y el registro de ventas, comparando ese total contra el número que acaba de sacar a mano.

**Que NO aparezca:** apretón de manos con traje azul y corbata roja · sala de reuniones con equipo aplaudiendo · gráficos de velas japonesas o de bolsa · open space con sillas de diseño · monedas y billetes de dólar apilados · martillo de juez · balanza de la justicia · gente joven de agencia señalando un pizarrón.

---

## Reglas transversales a las 5 fotos

1. **La pantalla del sistema nunca la inventa Higgsfield.** Encuadrar el dispositivo en ángulo y fuera de foco, o reservar el hueco para componer encima la captura real. Una UI generada por IA sería fabricar producto y está prohibido.
2. **Nada de texto legible generado:** carteles, rótulos, facturas y etiquetas siempre fuera de foco o fuera de cuadro. La IA escribe basura y un cartel mal escrito mata la credibilidad de toda la serie.
3. **Gente boliviana real, no modelos:** rasgos mestizos/andinos/cambas, canas, arrugas, contextura normal, ropa con uso. Nadie mira a cámara, nadie sonríe a cámara, todas las manos están ocupadas.
4. **Clima en la ropa:** Santa Cruz = manga corta, brillo de calor, ventilador o split en cuadro. La Paz/El Alto = capas, chompa, luz fría y dura de altura.
5. **Ningún billete a la vista.** En Bolivia la plata no se exhibe; una mano con billetes lee a foto de agencia.
6. **Detalles que dan verdad:** cinta adhesiva reparando algo, cables colgando, una calcomanía vieja, el cuaderno, el sello, el calendario del SIN, el botellón, el ventilador.
7. **Serie, no cinco fotos sueltas:** mismo lente (35-50 mm), misma altura de cámara (a la altura del pecho de la persona), misma temperatura de color por momento del día. Si las cinco no se leen como el mismo fotógrafo el mismo mes, la web parece un collage comprado.
8. **Ni una pista de obra:** nada de pantallas vacías, carteles de "próximamente", ni escenas que sugieran algo a medio instalar.

---

## 1. Reglas VINCULANTES sobre imágenes generadas por IA en la superficie de venta

### R1 — "No fabricar": una imagen es una AFIRMACIÓN, y afirma tan fuerte como un testimonio

**Cita (CLAUDE.md §5, línea 245):**
> "**No fabricar**: cero clientes pagando ⇒ prohibido inventar testimonios, logos o cifras."

**Cita (`web-factory/apps/onia-platform/src/lib/proof.ts`, encabezado — es código vivo de la home):**
> "DOS reglas duras, y la segunda se olvida seguido: a) no se inventan clientes, logos, casos ni metricas; b) tampoco se PROCLAMA la debilidad."

**Cita (`src/app/(sitio)/page.tsx`, línea ~24):**
> "La imagen social es una captura REAL del sistema… no un mockup. **Regla de la casa: nada de pantallas dibujadas haciendo de prueba.**"

**Dónde muerde exactamente con imágenes generadas:** la regla no prohíbe la imagen generada — prohíbe la **afirmación de hecho** que la imagen transporta. Una foto es prueba documental cuando identifica a alguien, a un negocio o a un resultado.

- **SÍ se puede:** una ferretería boliviana genérica, cara parcial o de tres cuartos, atendiendo mostrador; una dentista lavándose las manos; un depósito de importadora con cajas sin marca. Escena de USO, sin nombre, sin logo, sin cifra, sin "cliente".
- **NO se puede:** ninguna imagen con nombre de negocio, letrero, logo (ni real ni inventado), rótulo tipo "Clínica X, La Paz", cara repetida que funcione como personaje-testimonio, ni cifra de resultado dentro de la escena ("+40% de cobros"). Eso es un cliente inventado con otra técnica.
- **NO se puede (el filo del filo):** que en la foto se vea una **pantalla del producto generada por IA**. La UI en cuadro tiene que ser captura real compuesta encima, o pantalla apagada/ilegible/fuera de foco. Una UI dibujada por IA es exactamente "pantallas dibujadas haciendo de prueba".
- **NO se puede tampoco el disclaimer:** poner "imagen ilustrativa, no es un cliente real" viola la regla (b) de `proof.ts` — proclama la debilidad en la pantalla de venta. La solución correcta no es rotular la foto: es que la foto **no reclame nada** que haya que desmentir.

---

### R2 — La venta nunca exhibe obra: la imagen tampoco puede mostrar lo que no está vivo

**Cita (CLAUDE.md §3, líneas 133-136):**
> "En toda superficie que ve un cliente está PROHIBIDO comunicar estado de obra… Un solo cartel contamina la percepción del producto entero. Lo que no está listo **no se nombra**."

**Cita (memoria `feedback-nunca-mostrar-en-construccion.md`, Sergio textual 2026-08-20):**
> "no entiendo por qué dices si es que estamos construyendo algo que aún no está listo… hace escapar a los clientes porque hacen creer que el sistema no funciona. **Como regla nunca hagas eso.**"

**Cita (`hermes-content/docs/ONIA_PLAN_DE_VERSIONES.md`, "Lo que NO se nombra en v1.0"):**
> "Chatbot · recordatorios por WhatsApp · que el bot agende · offline · los rubros que el registro no entrega. **No se prometen, no se listan, no se dice 'muy pronto'.**"

**Cita (`hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md`, tabla de rubros):** Veterinaria y Ganadería = "⛔ cerrada por decisión"; ganadero "promete modo offline **que no existe**".

- **SÍ se puede:** escenas de los **5 rubros publicados** (dental, comercio/ferretería, importadora, estética, servicios profesionales) haciendo lo que v1.0 hace vivo: agendar, cobrar, revisar caja, aprobar una propuesta del agente.
- **NO se puede:** ganadería, veterinaria, gastronomía, construcción, educación, turismo — ni de fondo, ni "para dar variedad". Nombrar un rubro cerrado con una foto es nombrarlo igual.
- **NO se puede:** una escena que muestre capacidad no viva — el bot agendando solo, el sistema funcionando sin señal/offline, un cliente recibiendo recordatorio por WhatsApp. Es "no fabricar" ejecutado con una foto en vez de con una frase.
- **NO se puede:** watermark de Higgsfield, marca de agua, "preview", imagen a medio resolver o placeholder gris visible en producción. Es obra a la vista.

---

### R3 — Etiquetado de contenido IA: obligatorio en Meta, NO exigido en la web propia

**Cita (memoria `ai-influencers-account-ops.md`):**
> "**Cumplimiento/anti-ban:** etiqueta 'creado con IA' obligatoria (**Meta enforced 2026**; a nosotros nos conviene, es la marca híbrida)"

**Cita (memoria `lucia-influencer-posicionamiento.md`):**
> "El 'es IA' NO se esconde: es la marca y **cumple de una la etiqueta obligatoria** 'creado con IA'."

**Cita (memoria `arthur-opera-modelos-higgsfield-ads.md`, columna "De Sergio"):** "Crear las cuentas IG (email, SIM, BM, **etiqueta IA en bio**)".

**Decisión (la pregunta que hiciste, respondida):** la obligación de etiquetar que existe escrita en este proyecto es **de plataforma (Meta: IG/FB, orgánico y pauta) y de persona sintética (Lucía/Mara como identidades públicas)**. Revisé CLAUDE.md, los 100 archivos de memoria y los docs de `hermes-content/docs`: **no existe ninguna regla que obligue a etiquetar imágenes de IA en onia.com.bo**. No la inventes ni la importes.

- **SÍ se puede:** publicar fotos de contexto generadas en la web sin badge "hecho con IA", siempre que cumplan R1 (no afirman nada verificable).
- **SÍ se puede / SÍ SE DEBE:** si esa MISMA imagen se reusa en Instagram/Facebook o como creativo de Meta Ads, se etiqueta según Meta. Ahí la obligación es real y el castigo es de plataforma (baneo/rechazo de anuncio).
- **NO se puede:** usar el argumento inverso — "como no hay que etiquetar, puedo mostrar algo que parezca un cliente real". La ausencia de etiqueta obliga MÁS a R1, no menos.

---

### R4 — Gasto en plataformas pagas: imágenes sueltas ya están liberadas, VIDEO no

**Cita (CLAUDE.md §5, línea 255):**
> "**Gasto:** generación paga (Higgsfield, ElevenLabs) = **permiso explícito caso por caso**. Por defecto gratis (Speaches, HyperFrames)."

**Cita (memoria `gasto-plataformas-validar-primero.md`):**
> "**Prohibido usar plataformas externas sin permiso explícito** en cada caso: Higgsfield, fal.ai, OpenAI images… **Tener el MCP conectado NO es permiso.**" + "**Solo modelos baratos por defecto**… nano_banana a 1k antes que text2image_soul_v2 a 2k".

**Cita (memoria `higgsfield-estado-cuenta-2026-08.md`):**
> "imagen text2image_soul_v2 quality 2k = **0,12 créditos**… El gasto dejó de ser el cuello para imágenes; **videos cotizarlos con `get_cost:true` antes de generar**… Regla de gasto por caso sigue viva para VIDEO y volúmenes grandes; **imágenes de lote chico quedaron validadas como gasto trivial**."

**Cita (memoria `arthur-opera-modelos-higgsfield-ads.md`):** "Higgsfield: Imágenes **LIBRES** (0,12 cr c/u sobre ~2.990…). **Registrar cada lote**" / "De Sergio: **OK previo para VIDEO**, cotizado con `get_cost`".

- **SÍ se puede:** generar el lote de fotos de contexto ahora — Sergio lo pidió textual ("las capturas hazlas con higgsfield"), y las imágenes de lote chico están validadas como gasto trivial. Registrar el lote (qué prompts, qué modelo, cuánto costó).
- **SÍ se puede:** chequear `balance`/`transactions` en vivo antes de un lote grande — el pool de 3.000 cr es **compartido entre todos los carriles** (`higgsfield-models-roster.md`).
- **NO se puede:** generar VIDEO (Seedance/Kling/Veo/Marketing Studio) para esta tarea. Eso sigue exigiendo OK explícito con `get_cost` por delante. "Hazlas con Higgsfield" autoriza imágenes, no un comercial.
- **NO se puede:** dar de alta ninguna plataforma nueva (Midjourney, Runway, banco de stock pago) — regla `feedback-siempre-la-mejor-opcion.md`: primero lo que ya está pagado.

---

### R5 — Superficie viva: construir y publicar son DOS permisos distintos (la que ya obligó a revertir)

**Cita (CLAUDE.md §4, líneas 204-208):**
> "**Una superficie viva no se reemplaza sin que Sergio VEA la pieza terminada.** El 2026-08-20 interpreté 'ya te di todo lo que quería' como OK para publicar la landing v2: la rechazó entera al verla ('Nada se te escapa no vende nada') y **hubo que revertir en producción**. Un rediseño se muestra renderizado y se espera el OK explícito sobre ESA pieza; **construir y publicar son dos permisos distintos**."

**Cita (memoria `landing-v3-aprobada-base-clara.md`):**
> "se construyó en `/preview` con **noindex**, se le mostró renderizada, y **recién ahí hubo OK**." + "La v3 NO se publica sin OK explícito sobre la pieza terminada."

- **SÍ se puede:** generar, cablear y ver las imágenes en una ruta de preview con noindex (o en capturas Playwright de la home con las fotos puestas), y mandarle a Sergio la pieza RENDERIZADA.
- **NO se puede:** meter las fotos en `(sitio)` y hacer el swap del contenedor `onia-landing` porque "él pidió las capturas". Pedir las imágenes ≠ aprobar ESAS imágenes en ESA página.
- Ojo con el orden que él mismo fijó (`landing-v3-aprobada-base-clara.md`): *"funcional + pestañas faltantes → restilar los dashboards → recién entonces capturas"*. Ese orden aplica a capturas de PRODUCTO; las de contexto humano las pidió ahora, así que no bloquean — pero no las uses como excusa para tocar los dashboards ni la maqueta aprobada ("**No re-hacer lo aprobado**", CLAUDE.md línea 203).

---

### R6 — Personas y caras: prohibida la cara de Sergio, caras recurrentes = personaje (otro régimen)

**Cita (memoria `feedback-sergio-soul-no-usar.md`, Sergio 2026-08-06):**
> "**el de sergio no lo usas, es horrible.**" → "**NUNCA** generar imágenes/video con los Souls de Sergio (`bce5feb0`, `a5f9ee23`, `aeaa74af`, `1238064e`, `05cebe09`) para contenido. Su marca personal = cara REAL grabada."

**Cita (memoria `higgsfield-models-roster.md`):**
> "REGLA: usar los rostros que Sergio aprueba de SUS videos, **no generar caras distintas**… **QA obligatorio contra la fuente real antes de aprobar cualquier imagen**."

**Cita (memoria `avatar-consistency-scheme.md`, pitfall verificado dos veces):**
> "goorra con logo real (NY) aparecio sin pedirse… mismo pitfall que el logo Nike anterior, **reforzar 'no brand logos' siempre que haya ropa/accesorios en el prompt**."

- **SÍ se puede:** personas anónimas, no protagónicas — manos sobre el mostrador, dueño de tres cuartos o de espalda, cara parcial, foco en la acción y no en el rostro. Cada foto una persona distinta, sin continuidad de identidad.
- **SÍ se puede:** exigir "no brand logos, no text on garments" en TODOS los prompts y mirar cada imagen buscando logos colados (pasó dos veces con Nike y NY).
- **NO se puede:** la cara de Sergio generada por IA. Ni en un equipo, ni de fondo, ni "irreconocible".
- **NO se puede:** usar a Lucía o Mara (Souls `36305a9b` / `b8f5c353`) como "la dentista" o "la dueña". Ellas son influencers que le hablan al público D — **"D · la audiencia → NO es cliente, es MEDIO"** (`onia-enfoque-compradores.md`). Ponerlas de clienta en la web B2B mezcla dos negocios y crea el personaje-testimonio que R1 prohíbe.
- **NO se puede:** una cara que se repita en 3 secciones. En el momento en que se repite deja de ser ambiente y pasa a ser personaje → cae bajo `avatar-consistency-scheme.md` (Soul aprobado + QA contra master + aprobación de pieza), que es un régimen entero que acá no querés abrir.
- **NO se puede:** una persona identificable que se parezca a alguien real (dueño de un negocio conocido de Santa Cruz, figura pública).

---

### R7 — Correlación con lo que se vende: la escena la manda el catálogo, no el prompt

**Cita (CLAUDE.md §2, línea 68):**
> "Antes de escribir una cifra o una capacidad en material de cliente, **buscar si ya existe en otro lado**. Si hay dos versiones, no elegir la más linda: preguntar."

**Cita (`ONIA_CATALOGO_DE_VENTA.md`):** "🟡 Construido, sin probar → **no prometer** — se muestra como demo" · "⚪ Futuro → **no se nombra al cliente**".

**Cita (Sergio, este pedido):** "que tengan **correlacion** con lo que quieras mostrar… mostrar **usos practicos** y mas que todo **vender**."

**Cita (memoria `onia-enfoque-compradores.md`):** "dueños de negocios formales de Bolivia que **ya facturan** y están ahogados en tareas administrativas" · "**el emprendimiento que recién arranca NO es cliente**".

- **SÍ se puede:** un negocio formal boliviano en operación real — ferretería con mostrador lleno, consultorio dental con equipo, depósito de importadora, spa, oficina de servicios. Persona de 30-55, ropa de trabajo, ambiente latinoamericano contemporáneo.
- **NO se puede:** estética "startup" (coworking, pizarra de post-its, gente de 25 con laptop), ni puesto informal de calle. Ninguno de los dos es el comprador A.
- **NO se puede folclorizar.** `feedback-no-inventar-cosas.md`: "**Nada folclórico ni regional en la marca**: ONIA es LatAm tirando a global". Bolivia se lee por el negocio y la gente, no por chola de postal ni textil andino de decoración.
- **NO se puede:** que la foto ilustre una sección cuyo texto dice otra cosa. Cada imagen debe corresponder a la capacidad que su sección vende (agentes → alguien aprobando en el celular; cobros → caja/mostrador).

---

### R8 — Verificar es MIRAR, y medir el peso

**Cita (CLAUDE.md §2, líneas 77-83):**
> "**Toda pantalla que ve un cliente se abre y se MIRA renderizada** (Playwright + Chromium headless, y leer la captura). Un 200 y un grep no son verificación." + "**Medir peso y tiempo real**… la fuente de iconos pesaba 3,9 MB y tardaba 117 s."

**Cita (memoria `onia-web-la-sirve-el-vps-no-vercel.md`):**
> "**pushear a `main` no publica nada**. Hay que buildear en el VPS y hacer swap del runtime."

- **SÍ se puede:** webp, dimensiones explícitas, `loading="lazy"` fuera del hero, y el patrón `<img>` a secas que ya usa `switcher.tsx` ("el build es `output: standalone` sobre el VPS").
- **NO se puede:** publicar sin abrir la página renderizada y mirarla — con las fotos puestas, en móvil y desktop, en el ratio real (CLS).
- **NO se puede:** subir PNG de 2K sin comprimir. Un lote de fotos es el clásico camino a repetir el desastre de los 3,9 MB en la única superficie de venta.

---

## 2. Errores que OBLIGAN a revertir en producción

Ordenados por costo. Los cuatro primeros son revert seguro; el swap del contenedor `onia-landing` no es barato y la web es la única superficie de venta viva.

| # | Error | Regla que rompe | Por qué es revert |
|---|---|---|---|
| 1 | Publicar las imágenes en `onia.com.bo` sin que Sergio haya VISTO la pieza renderizada | R5 | Es literalmente el caso del 2026-08-20 (landing v2): "hubo que revertir en producción". Precedente idéntico, ya pagado una vez |
| 2 | Una imagen que se lea como cliente/caso/testimonio real (letrero, logo, "Clínica X", cifra de resultado en escena) | R1 | Cero clientes pagando: es un cliente inventado. Rompe la regla más dura del proyecto y es riesgo legal/reputacional, no solo estético |
| 3 | Una pantalla del producto **generada por IA** dentro de la foto (UI dibujada, datos inventados en el monitor) | R1 | "Regla de la casa: nada de pantallas dibujadas haciendo de prueba" — fabricar producto, que es la línea que la interpretación ya decidida prohíbe cruzar |
| 4 | Una escena que muestre capacidad no viva o rubro cerrado (bot agendando, offline, ganadería, veterinaria) | R2 + R7 | Promete lo que no existe; el ganadero "offline" ya está documentado como promesa falsa |
| 5 | Cara de Sergio generada por IA en cualquier parte del sitio | R6 | Prohibición textual y personal ("es horrible"); daña la marca personal del dueño |
| 6 | Logo de marca real ajena visible en ropa, gorra, producto o local | R6 | Pitfall documentado dos veces; es exposición legal en una superficie pública |
| 7 | Disclaimer "imagen generada con IA / no es un cliente real" impreso en la sección de venta | R1(b) | Proclama la debilidad en la pantalla de venta. No revierte por sí solo, pero Sergio ya rechazó ese tono ("Nada se te escapa no vende nada") |
| 8 | Lote de imágenes pesado sin optimizar / sin dimensiones (CLS) | R8 | Degrada la única página que vende; se detecta tarde y se arregla con otro swap |

---

## 3. Checklist antes de tocar `(sitio)` (lo que te salva del revert)

1. Generar en Higgsfield (imágenes, no video) → registrar el lote con prompts y costo.
2. Mirar CADA imagen una por una: ¿logo colado? ¿cara identificable? ¿pantalla legible con datos falsos? ¿rubro cerrado? ¿algo que parezca un cliente con nombre?
3. Cablearlas en una ruta de preview con **noindex**, no en `(sitio)`.
4. Capturar renderizado con Playwright, móvil y desktop, y **leer** las capturas.
5. Mandarle a Sergio la pieza terminada renderizada y **esperar OK explícito sobre ESA pieza**.
6. Recién con el OK: mover a `(sitio)`, buildear en el VPS con `app.env` y hacer el swap del contenedor `onia-landing`.

**Archivos fuente citados:** `C:/dev/proyectos/onia-hermes/.claude/worktrees/skills-setup-config-8d4674/CLAUDE.md` · `.../hermes-content/docs/ONIA_PLAN_DE_VERSIONES.md` · `.../hermes-content/docs/ONIA_CATALOGO_DE_VENTA.md` · `.../web-factory/apps/onia-platform/src/lib/proof.ts` · `.../web-factory/apps/onia-platform/src/app/(sitio)/page.tsx` · `C:/Users/PC/.claude/projects/C--dev-proyectos-onia-hermes/memory/{feedback-nunca-mostrar-en-construccion,gasto-plataformas-validar-primero,feedback-sergio-soul-no-usar,ai-influencers-account-ops,lucia-influencer-posicionamiento,arthur-opera-modelos-higgsfield-ads,higgsfield-estado-cuenta-2026-08,higgsfield-models-roster,avatar-consistency-scheme,landing-v3-aprobada-base-clara,onia-enfoque-compradores,feedback-no-inventar-cosas,onia-web-la-sirve-el-vps-no-vercel}.md`