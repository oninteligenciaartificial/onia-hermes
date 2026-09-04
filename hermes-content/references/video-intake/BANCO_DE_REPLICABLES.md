# Banco de replicables — videos que podemos hacer y subir a nuestras cuentas

> **Función nueva (Sergio, 2026-08-20):** guardar los videos que valen, ordenados por **qué tan
> rápido podemos hacer uno igual y publicarlo**. No es una bandeja de análisis: es una **cola de
> producción**.

Esto es distinto de [BANDEJA.md](BANDEJA.md), que registra qué se analizó, y de las fichas, que
explican cómo está hecho cada uno. Acá sólo entra lo que **vamos a producir nosotros**.

---

## Cómo se lee

| Columna | Qué significa |
|---|---|
| **Costo** | 🟢 cero · 🟡 créditos de imagen (barato, permitido) · 🔴 créditos de video (**necesita OK de Sergio, caso por caso**) |
| **Insumo** | lo que hace falta tener antes de grabar o generar |
| **Bloqueo** | lo que impide hacerlo HOY. "—" = se puede hoy |
| **Cuenta** | dónde se publica |

**Regla de gasto, sin excepción:** todo lo 🔴 se entrega como guion + prompt + costo estimado, y
**Sergio aprueba antes de generar**. Nada de este banco autoriza gasto.

**Regla de honestidad:** ninguna pieza afirma cifras, resultados ni testimonios que no tengamos.
Si un molde original apoya su promesa en una métrica, nosotros lo hacemos sin la métrica.

---

# NIVEL 1 — se puede hacer hoy, costo cero

Estos no dependen de nadie. Son los que hay que producir primero.

| # | Formato | De dónde salió | Insumo | Cuenta |
|---|---|---|---|---|
| **R1** | **Lista aspiracional sobre b-roll ambiente** — 6-8 s, sin voz, 8-10 líneas centradas sobre metraje ambiente donde nadie habla ni mira a cámara | [DbtRIfTojBt](https://www.instagram.com/reel/DbtRIfTojBt/) · [DcPXfcCvYFO](https://www.instagram.com/reel/DcPXfcCvYFO/) | un clip ambiente propio (escritorio, local de cliente, calle) + la lista | Onia |
| **R2** | **Formato gemelo** — la misma persona dos veces en el mismo plano, trípode fijo, dos tomas, máscara vertical. Rojo/verde. Se entiende con el sonido apagado | [Dbv2IrORksG](https://www.instagram.com/p/Dbv2IrORksG/) · [ficha](2026-08-16-carril-a-como-se-hicieron.md) | trípode + 2 tomas | Onia |
| **R3** | **Slate + cara** — 40/60, tarjetas minimalistas arriba con un glifo grande, cabeza parlante abajo, y la palabra clave del subtítulo **en el mismo color del titular** | [DcE1hSeIU3Y](https://www.instagram.com/p/DcE1hSeIU3Y/) · [ficha](2026-08-16-x-algoritmo-publico.md) | una toma de cara + los slates en HyperFrames | Onia · Arthur |
| **R4** | **Demo de 17 segundos de un rubro** — promesa en el segundo 1 → entra un pedido → se arrastra la tarjeta → beneficio en una línea → CTA. Sin logo animado, sin "hola qué tal" | [DcCSKN8CDon](https://www.instagram.com/p/DcCSKN8CDon/) · [ficha](2026-08-16-comandas-competidores.md) | el módulo con datos de demo cargados | Onia |
| **R5** | **Anuncio sin cara y sin voz** — 7 beats en 33 s, cohesión por **hilo de color** y **carrier element**. Ninguna cara en todo el video | [DcAAUevMTG6](https://www.instagram.com/p/DcAAUevMTG6/) · prompt **J3** | manos, objetos y un celular | Onia · cliente |

**R1 es el más barato de todos y hay dos ejemplos.** Advertencia: **los dos originales usan un
registro que no copiamos** — uno con insultos homofóbicos, el otro con presunción de plata. El
molde sirve; el tono es nuestro. Para un vendedor B2B en Bolivia, ese registro cuesta clientes.

---

# NIVEL 2 — se puede hoy, gasta créditos (requiere tu OK)

| # | Formato | De dónde salió | Insumo | Costo |
|---|---|---|---|---|
| **R6** | **Anuncio UGC con diálogo** — cabecera técnica + defectos pedidos a propósito + negativos del formato + anclas inline + beats con diálogo **entre comillas** (sale literal, verificado) | [DcMW3Coi6BN](https://www.instagram.com/reel/DcMW3Coi6BN/) · [receta](2026-08-18-ugc-auto-receta-completa.md) · prompt **G2** | fotos de referencia del producto y del personaje | 🔴 |
| **R7** | **Sustituir el objeto conservando al humano real** — `seedance_2_5` en `video_edit` sobre un plano filmado con celular. Se factura por la duración del **video fuente**: filmar 5-8 s | [DcJ2NFlCw9D](https://www.instagram.com/p/DcJ2NFlCw9D/) · prompt **G3** | un cliente real usando el sistema | 🔴 |
| **R8** | **Transformación por dos keyframes** con la cláusula de persistencia (`The final frame must inherit the [X] from the first frame…`) | [DakoqucxYpW](https://www.instagram.com/p/DakoqucxYpW/) | 2 clips reales, mismo encuadre | 🔴 |
| **R9** | **Interiores: plano o foto → render amueblado** — 4 recetas image-to-image, catálogo como una sola imagen-collage, direccionado por índice, encadenado | [DcEYP7tjsIA](https://www.instagram.com/p/DcEYP7tjsIA/) · prompt **J5** | plano 2D o foto del ambiente del cliente | 🟡 |
| **R10** | **Foto realista de catálogo** — 8 bloques + negative prompt. La palanca: **pedir suciedad, prohibir lo pulido** | [DbgN-8CDVc-](https://www.instagram.com/p/DbgN-8CDVc-/) · prompt **G6** | descripción del producto | 🟡 |

---

# NIVEL 3 — bloqueados, y por qué

**No se fuerzan.** Cada uno espera algo concreto.

| # | Formato | Bloqueo |
|---|---|---|
| **R11** | Demo en una toma con el cliente usándolo | **falta un cliente real con el sistema andando.** No se puede simular sin fabricar, y fabricar está prohibido |
| **R12** | Portafolio antes/después de webs entregadas | necesita las capturas del "antes", que hay que juntar |
| **R13** | Anuncio replicando un escenario con `ad_reference` | falta crear la primera referencia (prompt **H2**) y decidir si se puede usar material ajeno |

---

# Los cinco moldes de estructura, para no rearmarlos cada vez

Salieron del corpus y sirven para cualquier tema:

**1 · El anuncio de 6 actos** *(medido, escena por escena)*
`Opening Hook 2s → Product Information 10s → Product Selling Points 7s → Real Experience 8s → Usage Scenarios 9s → CTA 2s`
Lo contraintuitivo: el gancho dura **dos** segundos, la persona habla **tres frases** y no un
monólogo, la prueba social va **casi al final**, y hay un **segundo escenario** mostrando el
producto en uso. Fuente: [las 25 escenas](analisis/DcMW3Coi6BN-escenas.md) · prompt **H3**.

**2 · El tutorial de N pasos** — resultado primero (segundo 0), "así se hace", **un paso por
plano con una sola palabra en pantalla**, y romper a cara completa en el gancho y en el CTA.

**3 · El explicador con slate** — cara abajo, tarjeta arriba, y **el color ata** la palabra del
subtítulo con el dato del slate. Ver R3.

**4 · La comparación en un solo cuadro** — el truco no es el copy: es la **jerarquía**. El
ganador más grande y más arriba, el perdedor achicado y hundido. El ojo decide antes de leer.

**5 · La lista sobre ambiente** — sin voz, sin cara, texto centrado sobre metraje ambiente. Ver R1.

---

# Las tres reglas de escritura de prompt que salieron del corpus

1. **Si el video habla, es UGC. Si impresiona, es cine.** Se elige la plantilla antes de escribir
   la primera palabra. Mezclarlas arruina las dos.
2. **El diálogo entre comillas sale literal.** Verificado comparando prompt y audio del resultado.
   El guion se escribe en el prompt, no se corrige después.
3. **Delegar el estilo a una referencia nombrada** en vez de describirlo con adjetivos
   (*"the AD magazine photography version"*, *"what Uber does aesthetically"*). Un nombre propio
   que el modelo ya conoce reemplaza un párrafo. **Para editar sobre algo que ya existe.** Para
   generar desde cero siguen valiendo los bloques largos.

---

# Dónde están los archivos

Los MP4 **no se versionan** (regla del carril, y son de terceros). Viven en la carpeta de trabajo
de la sesión mientras se procesan. Lo que **sí** queda en el repo y es lo que hace falta para
replicar:

- **[analisis/](analisis/)** — el desglose escena por escena, que es lo que se copia
- **[transcripciones/](transcripciones/)** — el verbatim literal
- **las fichas `2026-08-*.md`** — cómo está hecho cada uno
- **este archivo** — qué producimos y en qué orden

**Los MP4 viven en Drive** (decidido por Sergio, 2026-08-20):
[ONIA — Banco de videos de referencia](https://drive.google.com/drive/folders/18txLEUYsU2Kt_N65emU6QnWZUTFDMCMD)

Están **recomprimidos a 480p**: la referencia es el **formato**, no la calidad de imagen. A 480p
se ve el encuadre, el ritmo, los cortes y los textos, que es lo que se copia. El original pesaba
166 MB; el banco pesa 57 MB y sirve igual.

En la carpeta hay además un `00 — LEEME` con las reglas y el `01 — Banco de replicables`, que es
una copia de este archivo. **La versión viva es esta, la del repo**; la de Drive es una foto.

---

# Lo próximo, si hay que elegir uno

**R1**, hoy mismo. Cero costo, cero dependencias, dos ejemplos frescos, y el único trabajo es
grabar un clip ambiente y escribir diez líneas honestas de lo que un dueño de negocio gana con
Onia. Con **nuestro** registro, no el del original.
