# LISTA PARA MOSTRAR: prueba 1 v2

> **11-oct-2026 · Ventas y pauta · encargo de la MADRE MARKETING.** **No se creó nada en Meta, no se gastó nada, no se contactó a nadie.** El presupuesto (US$ 56 · 14 días) sigue **sin aprobar**: lo aprueba Sergio Urcullo por escrito, en la sesión que crea y enciende.
> Sergio Urcullo vio A1-E y dijo *«ese ad está horrible, mejoralos»* (una losa de 8 bloques de texto, sin persona, captura ilegible, dos llamados, de vos, gancho de 3 líneas con punto). **Esta v2 reemplaza el §1 de `../CAMPANA-PRUEBA-1-LISTA-PARA-MOSTRAR.md`**; público, presupuesto, cortes, go/no-go y día del sí de esa lista siguen vigentes.
> Método y trampas: skill `onia-ventas-pauta` §9.9. Fichas de la competencia zona por zona: `research/competencia/anuncios/replicas/REFERENCIAS-GRUPO-1.md`.

## 1. Las 5 piezas: cada una copia, zona por zona, un anuncio que dura

| Pieza | Copia a (días al aire al 11-oct) | Formato | Código | Gancho en pantalla | Estado | Hoja «referencia \| nuestra» |
|---|---|---|---|---|---|---|
| **G1-4** | Doctocliq `895549733230235` · 58 d (+ `1684698082830679`, 55 d) | Video 31 s: Sergio Urcullo con cintilla, logo fijo, pantalla y cierre claro | `D10` | «Paciente que no llega / sillón que se paga *igual*» | **sale** | [G1-4-hoja.md](G1-4-hoja.md) |
| **G1-3** | CitaPro `2253602242100999` · 66 d (+ AgendaPro `3652876658196882`, 64 d: la misma imagen) | Imagen 1:1: titular, persona a la derecha y UNA tarjeta real | `D9` | «¿Quién de mañana / no *confirmó*?» | **sale** (necesita foto nueva) | [G1-3-hoja.md](G1-3-hoja.md) |
| **G1-5** | Doctocliq `1952892278698712` · 80 d (el mismo creativo, con otro id, lleva 85 d) | Micro-video 10 s, 4:5: persona quieta y tarjeta de color plano | `D11` | «Su agenda de mañana / ¿y si no *vienen*?» | **sale** | [G1-5-hoja.md](G1-5-hoja.md) |
| **G1-1** | Dt.Dental `1064012876297472` · 103 d | Selfie sentado, 28 s, sin producción | `D7` | «Pacientes de mañana / sin *confirmar*» | **sale** (mismo ángulo que G1-4) | [G1-1-hoja.md](G1-1-hoja.md) |
| **G1-2** | CitaPro `1880949689530541` · 86 d | Presentador → tarjeta de color → pantalla → presentador, 33 s | `D8` | «Paciente que hace meses / NO VUELVE» | **ESPERA: la fila G-05 está ⬜** | [G1-2-hoja.md](G1-2-hoja.md) |

- **G1-2 queda fuera de la prueba 1** (orden de la MADRE MARKETING: si la fila no está en ✅, sale). Mostraría «Última visita hace 7 meses» y diría «hace meses no vuelve»: eso es G-05 (*Vuelve a citar*), **⬜ sin verificar: falta la cuenta demo**, y no estaba entre las filas que el go/no-go ya exige. El código del agente existe (catálogo §4 y §8, frase 3, umbral de 6 meses), pero **«existe» no es «mirado funcionando»**. Se graba igual para tenerla lista; entra cuando G-05 pase a ✅. Un test (`replica-grupo1.test.mjs`) impide que otra pieza dependa de esa fila.
- **Una pieza = un anuncio de la competencia.** Cada hoja trae la tabla zona por zona (qué se queda, qué cambia), el guion, el gancho contra el checklist de §9.3, las promesas atadas a sus filas, lo que NO dice y lo que graba Sergio Urcullo.
- **Texto de usted, un solo llamado** («Escríbanos por WhatsApp y pida su demostración gratis»), sin precio, cifras, testimonios ni «IA». La persona es Sergio Urcullo con su nombre (cintilla «Sergio Urcullo · Onia», sin cargo): **nunca un cliente ni un odontólogo**.
- **La pantalla de Onia es real y se lee a 390 px (≈ 14 px):** la fila de Pendientes recortada en su separador natural y ampliada ×2,7, con la leyenda «Pantalla de Onia · datos de ejemplo» en la misma imagen.

## 2. Controles hechos antes de mostrar

| Control | Resultado |
|---|---|
| Fichas de las referencias (sonnet) | 5 fichas, lo observado separado de lo declarado y de lo inferido. Con 3 cuadros por video **el ritmo es inferido** |
| Redactor (sonnet) | 5 briefs. Hubo que corregirle los cuadros (no seguían las zonas de la referencia), el cargo «fundador» (no verificado) y un apositivo que hacía de Sergio Urcullo «un sistema» |
| Verificador de promesas (haiku), 1.ª pasada | **4 rojos**: una tarjeta con nombre de paciente sin la leyenda «datos de ejemplo». Corregido y fijado por test |
| Verificador de promesas (haiku), 2.ª pasada, texto y píxeles | **0 rojos.** Amarillos anotados: «gratis» (L-04 🟡), «cada mañana» (G-04 ⬜) y «ningún mensaje sale sin su OK» acotado a Pendientes (B-03 sale solo) |
| Crítica (opus), 2 rondas | 1.ª: la fila se leía a ~10 px, G1-3 era «el A1-E con una cara», G1-2 copiaba la fórmula de CitaPro. 2.ª: el «no» de G1-2 chico junto a un «VUELVE» gigante se leía al revés, la foto no llegaba al borde, 17 palabras en 4 s. **Aplicado**; lo no aplicado, abajo |
| Gate `scripts/replica-grupo1.test.mjs` (13 pruebas) | referencias capturadas con > 50 d · de usted · sin precio/cifras/competidores/«IA» · el MISMO detector de promesas que vigila la web · gancho ≤ 2 líneas sin punto y un énfasis · un llamado y códigos `D7`-`D11` leídos por el motor real del bot · filas atadas · leyenda en el renderer · ≤ 3,3 palabras por segundo · G-05 solo en piezas que esperan |

## 3. Lo que muestran las 8 capturas del 11-oct (`CAPTURAS-50D-11OCT.md`)

- La imagen «foto de profesional + burbujas + una demo» la usan **dos** anunciantes (CitaPro 66 d y AgendaPro 64 d): es el formato con más respaldo entre los estáticos.
- Doctocliq repite el mismo creativo con **varios ids** (el micro de 10 s y la mini-historia de 30 s): una idea, muchas copias, como en §9.6.
- **Ninguna de las 12 referencias manda a WhatsApp con botón:** van a demo, cuenta o formulario. Que el destino sea WhatsApp sigue siendo una **hipótesis de Onia** (`ONIA_ADQUISICION_Y_PAUTA.md` §5.10).

## 4. Cuáles mostrar primero (juicio, no dato)

**G1-4, G1-3 y G1-5**; G1-1 de reserva y G1-2 cuando G-05 esté en ✅. Razones: G1-4 replica su referencia con fidelidad (cintilla, logo fijo, subtítulo con chip, cierre claro) y lleva el dolor con consecuencia; G1-3 es la más barata (una sesión de fotos) y la única con respaldo de dos anunciantes; G1-5 cuesta 10 s de grabación. La crítica (opus) puso primero a G1-4 y G1-2 (esta última con el «no» ya corregido) y recomendó tres piezas: **repartir US$ 56 entre cinco no deja aprender nada**.

⚠️ **Cuatro de las cinco comparten el ángulo «no confirmó» y las cinco usan la misma fila de «Martín Arteaga Rojas»**: Meta las va a leer casi iguales. Las tandas siguientes deberían cambiar de ángulo (una variante mueve un solo eje, §9.6). G1-2 es la única con otro ángulo.

## 5. Qué falta y de quién

| Falta | Quién | Cómo |
|---|---|---|
| **Una jornada de grabación** (4 videos + 1 foto): [PARA-GRABAR.txt](PARA-GRABAR.txt) trae solo lo que dice, de usted, una frase por renglón y con su duración; para G1-3, la lista de la foto (plano, expresión **preocupado mirando el celular, sin sonreír**, qué tiene en la mano, fondo, ropa **sin logos**) | **Sergio Urcullo** | Su cara y su voz en un anuncio: su sí y el de Leslie Mercado Moreno (CLAUDE.md) |
| Las filas **G-04, G-06, B-02, G-01, B-01, C-02, D-01, E-01** en ✅ (y G-05 para G1-2), mirándolas con la cuenta demo | **Plataforma** | Es la fila 1 del go/no-go: hoy 0 de 9 en ✅ |
| Recapturar la fila con la cuenta demo y re-renderizar | **Ventas y pauta** | `replica-render.mjs` por pieza; media hora |
| «Cada mañana» solo en Crece en adelante y en la prueba (catálogo §8): los anuncios no nombran el plan | **Ventas y pauta** | La prueba de 14 días es el plan Profesional (A-05) |
| Los códigos `D7`-`D11` se leen solos (probado con `step()`); `CAMPANA-1-LISTA-PARA-CREAR.json` **sigue describiendo A1** | **Ventas y pauta**, cuando Sergio Urcullo elija las 3 | Se reescribe la spec y su test con las elegidas |

**Lo mínimo que se le pide a Sergio Urcullo (todo junto):** (1) cuáles 3 entran; (2) ¿graba la jornada? (el selfie y el resto del video, más la foto); (3) lo que ya pedía la lista anterior: tarjeta, OK de gasto, firma del bot, llamada de 20 o 30 minutos.

## 6. Lo que esta lista NO prueba

- **La maqueta usa su foto de perfil recortada:** no se puede juzgar encuadre, expresión, lugar, gestos ni ritmo. Juzga bien el texto, la fila, las tarjetas y los cierres. El polo lleva un logo ajeno: la toma real, sin logos.
- **La antigüedad no es rendimiento:** 58-103 días al aire dicen que alguien las mantiene, no cuánto rinden; un anuncio puede seguir vivo por inercia o ser una reactivación.
- **No se copia el plano entero de R1** (la maqueta es un busto) **ni la expresión de R3 en la maqueta** (sonríe porque es su foto de perfil): en G1-3 la toma real sí pide el gesto preocupado.
- **R5 cierra con un beneficio («reduce cancelaciones») y la nuestra con el mecanismo («el mensaje listo con Onia»):** Onia no puede prometer resultados con 0 clientes.
- **Costo por conversación en Bolivia: sigue siendo un supuesto** hasta la semana 1. Con US$ 56 la prueba dice si el filtro trae dueños, no cuál pieza gana.
