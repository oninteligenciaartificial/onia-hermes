# Clases del grupo (10-oct-2026): checkout, renovación de anuncios, cobro y la «skill» anunciante-supremo

> Análisis de la madre v2, 11-oct-2026, por pedido de Sergio Urcullo («podés continuar analizando esto»).
> Material para APRENDER, no para producir (memoria `feedback-link-sin-instruccion-es-para-aprender`).
> Fuentes, todas en `C:/Users/PC/OneDrive/Documentos/` (fuera del repo):
> 4 transcripciones Whisper de las mini clases (Dani, Franco, Rodrigo, Guilherme) · `Clase - Las 10 skills del flujo.html`
> (masterclass FLUNA) · `anunciante-supremo-2026-10-10.zip` (skill de terceros, v1.1.1; leída en el scratchpad, **no
> instalada**) · 2 links de Canva que mandó el grupo por WhatsApp: `canva.link/ym441bmbtq330qk` = «EJEMPLO CHECKOUTS DE
> PAGO» (el checkout de Rodrigo, curso de detailing, PC y celular) y `canva.link/eb84hhdmx328tha` = «CLASE CHOSEN
> CHECKOUT» (sus 12 láminas).
>
> **Contexto que filtra todo:** el grupo vende **infoproductos** con pauta a compra (píxel, ROAS, US$ 7/día por conjunto,
> Hotmart). Onia vende **un SaaS B2B a clínicas dentales de Santa Cruz**, con pauta a conversación de WhatsApp de
> US$ 4/día en un solo conjunto (`ONIA_ADQUISICION_Y_PAUTA.md` §5.3) y 0 clientes. Lo que depende de esa diferencia no se
> porta.

## Veredicto en una tabla

| Fuente | Qué enseña | ¿Sirve a Onia? | Dónde quedó |
|---|---|---|---|
| Rodrigo · checkout | 6 motivos de abandono → 5 bloques (resumen, WhatsApp, testimonios, garantía, FAQ) + recomendaciones de pago | **En parte.** El `/checkout` de Onia ya tiene 2 de 6; faltan FAQ de pago y la «garantía» honesta. Testimonios: prohibido | §1 abajo · pendiente para Plataforma |
| Franco · 4 grupos | Réplica → formatos → variaciones → ángulos nuevos, un grupo por día | **El orden sí, el ritmo no.** Se aplica como orden de las tandas (cada 2-4 semanas) | skill `onia-ventas-pauta` §9.6 |
| anunciante-supremo | 4 plantillas de video + método de ganchos + escalera de variantes | **El método sí; la herramienta no se instala** | skill `onia-ventas-pauta` §9.3 y §9.7 |
| FLUNA · 10 skills | Cazar → validar → modelar → cobrar → anunciar → medir → entregar → vender más | **Confirma lo que ya está decidido**; dos piezas chocan con reglas | §4 abajo |
| Guilherme · QR | Pasarela boliviana con QR por pedido, confirmación sola y cobro recurrente con recordatorio | **Sí, como alternativa al BCP** si su trámite se traba. Falta el nombre real | §3 abajo · pendiente de Sergio Urcullo |
| Dani · Sendy/Binance | Cobrar en otros países y retirar a Binance; número Entel con 5 | **No.** Onia cobra en Bs, con factura, a clínicas de Bolivia | Descartado (§5) |

## 1. El checkout (Rodrigo) contra el `/checkout` de Onia

Lámina 3 de Rodrigo, los 6 motivos de abandono: «no recuerdo qué estoy comprando» · «no tengo claro el valor» · «¿y si
es estafa?» · «¿esto valdrá la pena?» · «tengo una duda y nadie me responde» · «me rechazaron la tarjeta». Cada bloque
de su checkout contesta uno. Él mismo dice que **no midió** el antes y el después («todavía no lo he testeado»). El
único dato medido es de FLUNA (31,5 % checkout → compra con su plantilla contra 12-13 %, 8 tiendas), y su plantilla
lleva una cuenta regresiva de 7 min.

Leído en `onia-platform` `origin/master` @`d8ca5a32` (`app/checkout/CheckoutClient.tsx`, `lib/checkout/textos.ts`):

| Bloque | Onia hoy | Qué haría falta | Regla que manda |
|---|---|---|---|
| Recordar qué compra | Tarjetas de plan con nombre y monto | Nada urgente | — |
| WhatsApp de ayuda | ✅ «¿Dudas con el pago? Escríbanos por WhatsApp», con el monto precargado (`CheckoutClient.tsx:671-680`) | — | — |
| Recomendaciones de pago | ✅ para QR: «Escanee el QR desde la app de su banco y ponga exactamente el monto… tome una captura y ábrala desde la galería» (`textos.ts:47`) | — | — |
| Preguntas frecuentes | ❌ no hay | 4 preguntas de pago: ¿me dan factura? · ¿cuánto tarda en activarse? · ¿qué pasa si no renuevo? (solo lectura, sus datos no se borran) · ¿hay permanencia? | Cada respuesta tiene que ser verdad en producción hoy (catálogo) |
| Garantía | ❌ no se dice | La versión honesta: «14 días sin tarjeta; sin permanencia; si no renueva, su cuenta queda en solo lectura y sus datos se guardan». **No** «cancela con un clic»: el botón de baja no existe (auditoría de pago, punto 4) | `ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md` (d) 3-4 |
| Testimonios | ❌ | **No se pone.** Rodrigo dice que los hace con IA; en Onia es fabricar (0 clientes) | CLAUDE.md «no fabricar» |
| Cuenta regresiva | ❌ | **No se pone.** Escasez solo por capacidad real | skill `onia-ventas-pauta` §9.3 |

**Prioridad: baja en la Etapa 1.** Hoy nadie llega al checkout (0 clientes); el cuello son los leads. La FAQ y la
garantía honesta son una tarea chica de Plataforma (cerrada, con test: Codex Sol) para cuando haya pruebas de 14 días
venciendo. Se anota, no se manda ahora: lo decide la madre que ordena.

## 2. Renovación de anuncios en 4 grupos (Franco)

| Grupo | Día | Qué prueba |
|---|---|---|
| 1 Réplica | 1 | Los 5 anuncios de la competencia con 8+ días, modelados a la oferta propia |
| 2 Formatos | 2 | Los 2 que vendieron, con su mismo ángulo, en formatos nuevos (3 + 3) |
| 3 Variaciones | 4 | Gancho, título, color de los 2 mejores del grupo 2: una cosa chica por vez |
| 4 Ángulos nuevos | 5-6 | Ángulos nuevos con los formatos ya validados, o otra réplica, y vuelve a empezar |

Su tesis: **ángulo ganador × formato ganador = «explota»**; lo que vende sigue prendido mientras rinda (ROAS ≥ 2).

**Lo que se porta a Onia:** el ORDEN, como secuencia de tandas, y la regla de mover un solo eje por vez. La prueba 1 de
Onia (§5.11: un concepto en tres formatos) ya es su grupo 2; el grupo 1 se hizo como estudio de la Biblioteca (§2.5-2.6),
con el mismo criterio de «sobrevive más de 7-8 días».
**Lo que no se porta:** decidir en 1 día. Franco tiene píxel de compra y US$ 7/día por conjunto; Onia tiene
US$ 4/día, un conjunto y conversaciones: en 1 día no hay señal, y §5.7 corta en los días 3, 7 y 14. Tampoco los
umbrales de admin-supremo (CPC < 0,40, CTR ≥ 1,8 %, ROAS ≥ 2): son de un infoproducto de US$ 17 con compra en la web.

## 3. Cobro con QR en Bolivia (Guilherme)

Lo que contó: una empresa boliviana («Tesavis», nombre dudoso en la transcripción) con la que armaron una app que genera
**un QR por cliente y por pedido**; cuando el dinero llega a la cuenta, el pedido sale pagado solo y se habilita el
acceso. Dice que suele exigir NIT, que quizá se pueda sin NIT, y que viene **cobro recurrente con recordatorio**.

Para Onia es exactamente el punto 2 de la auditoría de pago (QR dinámico + aprobación sin humano), hoy esperando las
credenciales del BCP (memoria `bcp-api-qr-tramite-en-curso`). Sirve como **plan B** si el trámite del BCP se traba.
Onia tiene NIT y tiene que facturar cada cobro, así que «sin NIT» no aplica.
**Falta:** el nombre exacto y el contacto de la empresa. Se le pregunta a Guilherme (lo hace Sergio Urcullo). Antes de
usarla: comisión, si emite o deja emitir factura, y webhook documentado.

## 4. La masterclass FLUNA y anunciante-supremo

**Confirma lo decidido:**
- «Antes de 3 ventas solo se lanza; los entregables se producen cuando el mercado pagó» = la regla de Onia de que
  construir es lo que sobra (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §4-5).
- Modelar del competidor solo lo que **sobrevive 7+ días**, y bajarlo y mirarlo, «nunca deducirlo del título» = skill
  `onia-ventas-pauta` §4.1 y §8.2.
- «Nunca se decide con la foto de un solo día» y «ordenar por gasto» = §5.7.
- Modelar ≠ clonar: del competidor se queda el problema y el avatar; se cambian la idea, el mecanismo y el nombre.

**Choca con reglas de Onia (no se adopta):**
- `escalera-suprema`: vender bumps y upsells **antes de producirlos**. En Onia no se promete lo que producción no hace
  hoy (catálogo, `ONIA_ADQUISICION_Y_PAUTA.md` §5.4).
- Testimonios «hechos con IA» y cuenta regresiva de 7 min en el checkout: fabricar y urgencia falsa.
- Plantilla 2 de anunciante-supremo (persona generada que habla a cámara): solo si Sergio Urcullo lo pide, y nunca
  como cliente ni odontólogo (`onia-ventas-pauta` §9.4).

**anunciante-supremo, por dentro (v1.1.1):** Remotion (plantilla 1) + ffmpeg (2-4), todo generado por **APIMART**
(gpt-image-2, Veo 3.1, gpt-4o-mini-tts, música). ~US$ 1-1,3 por anuncio. **No se instala:** es una plataforma paga nueva
(APIMART: alta y gasto con OK de Sergio Urcullo), Remotion está jubilado en Onia (HyperFrames manda) y lo que hace ya lo
cubren `editor-videos`, HyperFrames y Higgsfield. **Lo que vale está en su `plantillas/hooks.md`** y se portó a la skill
de ventas: los 4 ingredientes del gancho, el test de alineación de los 3 ganchos, la zona de anclaje y la escalera de
variantes.

## 5. Descartado (Dani)

Sendy / app de cobro local en Colombia, México, Panamá con retiro a Binance (10 % de comisión) y el número de Entel que
empieza con 5 «para pasar desapercibido». Onia cobra en bolivianos, con factura, a clínicas bolivianas: cobrar por fuera
del sistema bancario y sin factura arriesga una clausura (`ONIA_PAGO_AUTOSERVICIO_AUDITORIA.md` (b)). No aplica.

## 6. Pendientes que salen de acá

| # | Qué | Dueño | Cuándo |
|---|---|---|---|
| 1 | FAQ de pago + garantía honesta en `/checkout` (§1) | Plataforma, contrato cerrado a Codex Sol | Cuando haya pruebas de 14 días venciendo |
| 2 | Nombre y contacto de la pasarela QR de Guilherme (§3) | Sergio Urcullo | Si el trámite del BCP se traba |
| 3 | Formato «objeto que habla» para una tanda futura | Ventas y pauta | Banco de ideas (`ONIA_CATALOGO_DE_IDEAS.md` §15) |
