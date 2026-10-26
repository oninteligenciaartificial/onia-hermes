# Lucía — plan y estado

> La cuenta del **medio**. Reglas de qué puede publicar: [`README.md`](README.md).
> Identidad, ancla, vestuario, voz y molde de prompts: `references/modelos/lucia/LUCIA.md`
> — **ese archivo manda para todo lo visual**, este solo dice qué se publica y cuándo.

---

## 1. Estado de la cuenta

| | |
|---|---|
| Correo | ✅ **decidido 2026-08-17: Gmail propio.** El alias `lucia@onia.com.bo` recibe pero NO es identidad separada, y eso es lo que Meta necesita. Un Gmail lo es, cuesta cero y se delega a Arthur. La dirección del dominio se puede sumar después sin rehacer la cuenta. Contexto: [`../docs/historial/ONIA_CORREO_SEGUNDA_IDENTIDAD_20260816.md`](../docs/historial/ONIA_CORREO_SEGUNDA_IDENTIDAD_20260816.md) |
| Cuenta de Instagram | ✅ **existe desde el 2026-08-20**: `@lucia.antelo.oficial` (IG id `28357585133845376`, tipo Creador), conectada a Postiz (`cmt1sv4eh001alq9cl3y6q7es`) y a la app de Meta con `messages`+`comments` suscritos y mensajería verificada. 0 posts, 0 seguidores |
| Voz | ✅ Marcela `86V9x9hrQds83qf7zaGn` (ElevenLabs), cargada en el VPS |
| Identidad visual | ✅ ancla, paleta hex, vestuario y molde de 11 bloques cerrados |
| Video | ✅ tarifario medido — antes era el bloqueo, ya no |

**Al crear la cuenta:** profesional, vinculada a la página de Facebook de Onia (si no, la app
`2160241918102061` no sirve para publicar por API), y **activar el switch "Creador de IA"**
en Editar perfil — es el campo nativo de Instagram, además de decirlo en la bio.

---

## 2. Lo que le está permitido a ella y a ONIA no

Es la diferencia que ordena las dos cuentas. Su moneda es **alcance**, no venta directa, así
que puede publicar cosas que a `@oniahq` le harían daño:

| Tipo | Ejemplo | ¿ONIA puede? |
|---|---|---|
| **Informativo genérico de IA** | *"las mejores skills de Claude"* · herramientas · tendencias | ❌ nunca |
| **Meta-IA** | *"hace un año yo no existía"* | ❌ |
| **Lifestyle** | su día en Santa Cruz, el café, el mercado | ❌ |
| Informativo aplicado a un negocio | *"3 procesos que hacés a mano"* | ✅ sí |
| Venta | producto, precio, prueba | ✅ sí |

**Lo que a ella le está prohibido:** testimoniar como usuaria (*"yo lo uso y me encanta"* —
FTC) · inventar un cliente o una biografía · consejo médico · esconder que es IA ·
más de 1 de cada 10 piezas de marca de terceros, y esa lleva etiqueta de colaboración paga.

---

## 3. Sus 4 pilares

Del sistema de contenido (`docs/historial/ONIA_LUCIA_SISTEMA_CONTENIDO_20260807.md`), que sale de medir
3 cuentas reales de influencers IA — no de intuición:

| Pilar | % | Qué es | ¿Collab con ONIA? |
|---|---:|---|---|
| **A · Meta-IA** | 30% | que es IA y no lo esconde | ✅ **sí** — acá ella ES la demostración |
| **B · Vida de dueña de negocio** | 30% | su día en Santa Cruz | ❌ |
| **C · El problema que resuelve ONIA** | 30% | el trabajo invisible que come el día | ❌ lo cuenta, no lo demuestra |
| **D · Marca de terceros** | 10% | producto propio o ajeno | ❌ nunca |
| **NUEVO · Informativo genérico** | — | *"las mejores skills de Claude"* | ❌ |

⚠️ El informativo genérico **todavía no tiene porcentaje asignado.** Es la decisión que abre
esta corrección de Sergio y hay que tomarla antes de producir en volumen: si crece mucho, la
cuenta deja de ser una influencer y pasa a ser un medio de IA — que atrae audiencia pero no
la deriva a nada.

**Formato:** 70% reel vertical · 30% carrusel. **Cadencia 3×/semana.** Nunca posteos de solo
texto ni comunicados — en el benchmark, un comunicado sacó **4 likes**.

---

## 3-bis. Dos carruseles heredados de @oniahq (2026-08-16)

Se produjeron para ONIA y **fallaron la prueba del vendedor** allá: hablan de la IA en
abstracto, no del negocio del que mira. Acá funcionan tal cual, sin reescribir — son
exactamente el pilar informativo genérico.

| Pieza | Estado |
|---|---|
| **Mitos de la IA** — *"Nadie te cuenta esto sobre la IA"* | renderizada, hay que re-renderizar con `--account lucia` |
| **5 tareas que la IA hace mejor** | ídem. Cierra pidiendo **LISTA**, y el PDF ya existe |

El re-render es un flag (`--account lucia`) y cambia el handle del pie. **No se puede hacer
hasta que la cuenta exista** y sepamos su @ real: hoy `carousel_render.js` tiene
`@lucia.antelo.oficial` hardcodeado y nadie confirmó ese handle.

## 4. Las primeras piezas — ya están armadas

Las 6 imágenes existen en `references/modelos/lucia/posts-20260807/` con sus captions
escritos. **No hay que generar nada para arrancar.**

| Día | Piezas |
|---|---|
| **1** | P1 *hace un año yo no existía* + P2 *martes 10 de la mañana* + P6 *¿cuánto tardás en contestar?* — tres el primer día para que el perfil no se vea vacío |
| **3** | P3 *tres sistemas que no se hablan* → **SISTEMA** |
| **5** | P4 *mirá bien, no soy real* → ⚠️ pedía **MODELO**, palabra que ya no existe |
| **8** | P5 *nadie les volvió a escribir* → ⚠️ pedía **CLIENTES**, ídem |

🔴 **Dos de sus captions piden palabras clave que se eliminaron** al unificar el sistema en
SISTEMA y LISTA. Hay que reescribir esos dos cierres antes de publicar — es edición de texto,
costo cero.

**Historias:** 10:00 algo de su día · 19:00 caja de preguntas o el detrás del post.

---

## 5. Video — lo que se destrabó

Su plan decía 70% reel y no tenía ninguno porque el costo no estaba medido. Ahora sí:

```
kling3_0_turbo      5 s hablando en español, voz nativa  7,50 cr
veo3_1_lite         8 s a 720×1280, 9:16 real           8 cr
video_extension     encadena sin el tope de 15 s        ~12 cr por tramo ⚠️ devolvió 16:9
sync_so (remap)     lipsync con la voz de Marcela       ~18 cr / 5 s
```

**~35 cr** una pieza de 32 s de b-roll (4 planos de 8 s) con voz montada encima.

**El lipsync no es el default** — cuesta ~5× más que montar la voz. Se usa solo donde ella
mira a cámara y habla, que es exactamente el pilar A.

⚠️ Todo gasto de video necesita **OK explícito de Sergio, caso por caso**.

---

## 6. Lo que la bloquea, y no es técnico

| # | Qué | Quién |
|---|---|---|
| 1 | **El origen de los videos de los que sale su cara.** La regla propia dice *"nunca foto de una persona real sin consentimiento"* y el material vino de más de una fuente | **solo Sergio** |
| 2 | Crear el Gmail de Lucía y con eso la cuenta de Instagram | Sergio |
| 3 | Decidir el % del pilar informativo genérico | Sergio |
| 4 | ~~Reescribir los cierres de P4 y P5~~ ✅ hecho 2026-08-20 — cierran con pregunta + @oniahq, sin palabra clave (Lucía no tiene palabras activas en el DM) | yo |

El **1 no se resuelve trabajando más**. Y es el que no conviene descubrir con la cuenta ya
pública.

---

## 7. Y mientras tanto

**ONIA no espera a Lucía.** Las dos cuentas son independientes: `@oniahq` ya existe, ya tiene
las piezas y su único bloqueo es el PDF de LISTA. Ver [`ONIAHQ.md`](ONIAHQ.md).
