# Preguntarle a los documentos — qué se puede prometer y qué no (2026-08-12)

Sergio, 2026-08-12: *"podemos hacer que a la hora de que usen el LLM puedan preguntar, cómo está
el documento…, dónde está la ficha…"*.

**Sí.** Es exactamente para lo que sirve la caja, y es lo que hace que valga USD 6.000 en vez de
USD 20/mes. Pero **son dos preguntas distintas**, con dificultad muy distinta — y prometer la
segunda como si fuera la primera es la forma más rápida de perder el piloto.

---

## 1. Las dos preguntas no son la misma

| | *"¿Dónde está la ficha de Pérez?"* | *"¿Cómo está el documento X?"* |
|---|---|---|
| Qué es | **Recuperación** — encontrar y devolver | **Estado** — leer y sintetizar |
| Qué necesita | Índice + búsqueda | Que el estado **esté escrito en algún lado** |
| Dificultad | Baja. Funciona el día 1 | Depende del cliente, no de nosotros |
| Valor que perciben | Alto e inmediato | Altísimo… si funciona |
| Riesgo | Casi ninguno | **El sistema inventa si no encuentra** |

> **La primera se promete. La segunda se demuestra con los documentos del cliente antes de
> prometerla.**

---

## 2. La línea que no se cruza

**El sistema contesta lo que está escrito. Lo que vive en la cabeza del abogado o en un WhatsApp,
no existe para él.**

| ✅ Sí puede responder (está en los archivos) | ❌ No puede (nadie lo escribió) |
|---|---|
| Cuál es el último escrito presentado y de qué fecha | Si el juez "viene con buena cara" |
| Qué documentos faltan contra una lista de requisitos | Qué acordaron por teléfono el martes |
| Qué plazos aparecen mencionados y cuándo vencen | En qué quedó la negociación |
| Quién firmó, qué versión es la última, qué cambió entre dos versiones | Si el cliente está por pagar |
| Qué dice la cláusula de confidencialidad del contrato de Pérez | Lo que el socio tiene en la cabeza |

**Cómo se dice esto en la reunión, sin perder la venta:**

> *"Te contesta todo lo que esté escrito en los archivos, con el archivo y la página donde lo
> encontró. Lo que nadie escribió, no te lo va a inventar — te va a decir que no está."*

Eso **suma** credibilidad. El que ya probó ChatGPT sabe que inventa, y que vos lo digas primero
te separa del vendedor de humo.

---

## 3. El circuito, en una línea por paso

1. **Una carpeta observada** (la carpeta de red que ya usan — no se les cambia la forma de trabajar).
2. **Docling** parsea lo digital · **PaddleOCR-VL** lee lo escaneado, torcido o fotografiado.
3. El texto se parte en trozos que conservan de qué archivo y qué página salieron.
4. **BGE-M3** (MIT, multilingüe — bueno en español) los convierte en vectores.
5. **Qdrant** los guarda, con el permiso de cada archivo como metadato.
6. La pregunta se busca **híbrido** (semántico + palabra exacta, porque "Pérez" y un número de
   expediente son literales) y se **rerankea**.
7. El **LLM** redacta la respuesta **usando solo esos trozos**, y cita.

Todo eso ya está elegido y con licencia verificada en
`ONIA_IA_LOCAL_STACK_COMPLETO_MODELOS_20260806.md`. **No hay que investigar nada nuevo para
prometer esto.**

---

## 4. Dos reglas de producto que no se negocian

### 🔴 Sin cita no hay respuesta

Cada respuesta muestra **archivo + página**. En un estudio jurídico o una clínica, una respuesta
sin fuente **no sirve para nada**: nadie va a actuar sobre algo que no puede verificar en diez
segundos. Y si no encontró, dice *"no lo encontré en los documentos"* — nunca completa con lo que
sabe el modelo de fábrica.

### 🔴 Los permisos van en la búsqueda, no en el prompt

En un estudio no todos ven todo. Si el índice es único y cualquiera pregunta, **el pasante lee el
caso del socio**. El filtro por carpeta y rol se aplica **antes** de buscar, no pidiéndole al
modelo que se porte bien.

> Vendemos una caja **porque** la información no puede salir. Romper la confidencialidad **adentro**
> de la oficina mata el argumento entero. Esto no es un extra: es parte del producto mínimo.

---

## 5. Qué lo hace fallar — dicho antes, no después

| Problema real | Efecto | Qué se hace |
|---|---|---|
| **Archivos desordenados**, 15 versiones del mismo contrato, nombres tipo `final_final_2.pdf` | Encuentra la versión vieja y la da por buena | En la ingesta gana la más reciente y se avisa que hay otras |
| **Escaneos torcidos, sellos, firmas encima del texto** | OCR con huecos | PaddleOCR-VL aguanta bien; igual se mide con **sus** documentos, no con ejemplos limpios |
| **Documentos de 300 páginas** | El *prefill* pesa: leer es lo caro, no escribir | Se responde sobre los trozos recuperados, no metiendo el expediente entero |
| **Preguntas de estado que nadie escribió** | La tentación de inventar | Se contesta "no está en los documentos" — ver regla de la cita |
| **La primera carga** de 10 años de archivo | Horas de OCR | Es un lote de una vez, de noche. No es el uso diario |

---

## 6. ¿Cambia el hardware?

**No cambia la decisión, pero suma carga.** Además del LLM corren el modelo de embeddings y
Qdrant: unos **3-4 GB** más de memoria y un pico fuerte de CPU/GPU durante la ingesta inicial.
Ya está contemplado en las gamas de `ONIA_BOX_GAMAS_POR_MODELO_20260806.md`; lo que cambia es que
**la gama chica deja de alcanzar para un archivo grande** — el corte real lo da el volumen de
documentos, no la cantidad de usuarios.

⏳ **A medir en el piloto:** cuántas páginas por minuto procesa la ingesta en el equipo elegido, y
cuánto tarda una respuesta con citas sobre un archivo de verdad. Sin ese número no se cotiza una
gama para un cliente con 10 años de expedientes.

---

## 7. La demo que cierra

No se demuestra con documentos de juguete. **Se les pide 20 archivos suyos** —de un caso ya
cerrado, para que no haya drama de confidencialidad— se ingestan **delante de ellos**, y se
pregunta lo que ellos quieran.

Ese momento —ver su propio expediente contestando, con la página citada, sin internet— es el que
vende la caja. Ninguna presentación lo reemplaza.

---

## 8. Cómo se valida esto en las 5 conversaciones

Va como pregunta, no como propuesta. En el guion
(`ONIA_BOX_LAS_5_CONVERSACIONES_GUION_20260812.md`) entran dos:

- *"Si te digo el nombre de un cliente, ¿cuánto tardás en tener su última carpeta en la mano?"*
  → pone **número** al dolor de recuperación.
- *"El estado de un caso, ¿está escrito en algún lado o lo sabe la persona que lo lleva?"*
  → dice si la segunda pregunta (la de estado) es **viable en ese cliente**, antes de prometerla.

Si contestan "lo sabe Fulano", el producto que compran es el de **recuperación** — y con eso
alcanza para cobrar.

---

## Relacionados

- Stack completo con licencias: `ONIA_IA_LOCAL_STACK_COMPLETO_MODELOS_20260806.md`
- Gamas y medición: `ONIA_BOX_GAMAS_POR_MODELO_20260806.md`
- Guion de validación: `ONIA_BOX_LAS_5_CONVERSACIONES_GUION_20260812.md`
- Memoria: [[onia-box-ia-local-producto]]
