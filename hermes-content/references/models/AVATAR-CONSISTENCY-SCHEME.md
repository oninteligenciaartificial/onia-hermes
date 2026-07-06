# Esquema de Consistencia de Avatares (protocolo canonico ONIA)

> Aplica a TODOS los personajes IA (Lucia, Mara, y los que sigan). v1 escrito 2026-07-06
> despues de que Sergio reporto perdida de consistencia (pelo, sonrisa, dientes
> cambiando entre generaciones usando el metodo Elements+nano_banana_2). v2 (esta version)
> refinado para el caso real de uso: **UGC** — hablando a camara, con producto real en
> mano, movimiento.

## Diagnostico (v1, sigue valido)

Existen dos mecanismos de identidad con consistencia muy distinta:

| Mecanismo | Que es | Consistencia |
|---|---|---|
| **Soul** (`soul_2` + soul_id) | Modelo ENTRENADO con 8+ fotos/frames de la persona | Alta — probado repetidas veces con prompts de texto |
| **Reference Element** (`nano_banana_2` + 1 imagen suelta) | Una sola foto como "sugerencia" de parecido | Baja — el modelo reparte fidelidad entre cara+outfit+lugar a la vez, la cara es la que mas cede |
| **Marketing Studio (avatar custom)** | Sistema dedicado de Higgsfield para UGC: avatar + producto real + guion + lipsync | Alta — probado con Mara+ISDIN real: identidad reconocible, producto real en mano con etiqueta legible, sin la deriva de Elements |

El error de v1 fue tratar Reference Elements como "la forma de conseguir producto real en
mano" para UGC. Ese es exactamente el trabajo de **Marketing Studio**, que ya tiene su
propio mecanismo de identidad (mejor que una imagen suelta) construido para este caso.
Elements queda para un caso mucho mas chico: prop/lugar exacto SIN necesidad de que hable
o sostenga nada especifico.

## Los 3 niveles (usar en este orden de preferencia)

### Nivel 1 — Soul + texto (`soul_2`) — 0.12cr — DEFAULT
Para: fotos estaticas, contenido generico de feed, escenas donde el producto/outfit se
puede describir bien en palabras (no necesita ser un objeto real fotografiado).
Como: `soul_2` + soul_id + prompt de texto (wardrobe/lugar de la bible). Alta consistencia,
validado repetidas veces.

### Nivel 2 — Marketing Studio (avatar custom) — 42-75cr — UGC CON PRODUCTO REAL
Para: el caso real de UGC — hablando a camara, sosteniendo el producto REAL (con su
etiqueta/forma exacta), guion natural, lipsync. Es la herramienta correcta para esto,
no Elements.
Como:
1. Crear avatar custom en Marketing Studio desde una foto **Nivel-1** (Soul+texto) de el
   personaje — no desde una foto de Elements ni de un video generado.
2. Crear producto en Marketing Studio desde la foto REAL del packshot (ver
   `hermes-content/references/models/lucia-elements-source/` o assets del cliente).
3. Elegir formato (`ugc_selfie_testimonial`, `ugc_direct_to_camera`, etc.) y setting.
4. Generar. Verificado con Mara+ISDIN: identidad estable, producto fiel, guion espanol
   seguro auto-generado. Costo real por probar: 42cr en 480p (piso), 75cr en 720p/15s.

### Nivel 3 — wan2_7 (still Soul + audio) — 15cr/10s — TALKING SIN MARKETING STUDIO
Para: video hablando con voz propia (ElevenLabs/seed_audio) cuando no hace falta el
producto en mano, o se quiere mas control de voz que el guion auto de Marketing Studio.
Como: generar el still con **Nivel 1** (Soul+texto) -> usar ESE still como `start_image`
de `wan2_7` + `audio_references` de la voz. Verificado con Lucia: cara estable en todo el
clip, boca sincronizada. NUNCA partir de un still generado por Elements para esto (mas
deriva compuesta).

### Nivel 4 (ultimo recurso) — Reference Elements (`nano_banana_2`) — 2cr
Solo para casos muy especificos donde se necesita un prop/lugar EXACTO de una foto real
y NO hace falta que el personaje hable ni sostenga nada con precision (ej. mostrar un
mueble/ambiente exacto de fondo). Reglas obligatorias si se usa:
- Aceptar de antemano que la cara puede variar — no prometer lock perfecto.
- Generar 2-3 candidatos, nunca aceptar el primero a ciegas.
- QA manual obligatorio contra la referencia real antes de guardar cualquier resultado.
- Nunca usarlo para contenido "hablando" o "sosteniendo producto" — para eso esta Nivel 2.

## Regla de oro (constante en todos los niveles)

1. **La fuente de identidad nunca se reemplaza por un output generado.** El Soul se
   entrena UNA vez desde frames REALES (o su version escalada sin generacion). El avatar
   custom de Marketing Studio (Nivel 2) se crea desde una foto Nivel-1 (Soul+texto), no
   desde Elements ni desde video. Nunca encadenar generado-sobre-generado.
2. **QA obligatorio antes de aprobar cualquier imagen/video:** comparar visualmente contra
   la referencia real canonica del personaje. Si la cara, el pelo o la sonrisa no calzan,
   se DESCARTA.
3. **No se publica ni se deja como "definitiva" ninguna pieza de Nivel 2-4 sin aprobacion
   explicita de Sergio.**

## Decision rapida (cual nivel uso)

| Necesito | Nivel |
|---|---|
| Foto generica de feed, outfit/lugar descriptible en texto | 1 (Soul+texto) |
| UGC hablando + sosteniendo un producto REAL especifico | 2 (Marketing Studio) |
| Hablando con voz propia, sin producto en mano | 3 (wan2.7 desde still Nivel 1) |
| Mostrar un prop/lugar exacto de fondo, sin que hable | 4 (Elements, con QA) — ultimo recurso |

## Aplica a

- **Lucia** — Soul `9a0d6953-ff2e-40ba-b763-806e0d447325`. Fuente real: `pecas-source-frames/`.
  Pendiente: probar Nivel 2 (Marketing Studio) con Lucia (solo se probo con Mara hasta ahora).
- **Mara** — Soul `b8f5c353-faaf-44eb-ae5a-4e0bacfd333f`. Nivel 2 ya validado (Mara+ISDIN).
  Pendiente: auditar si su ancla actual (Nivel 1) es frame real o generado.

## Que hacer con lo ya generado con Elements (Nivel 4, sesion previa)

Las imagenes `lucia-elements-combo-*.png` quedan como **pruebas de concepto del Nivel 4**,
no como contenido aprobado ni como referencia de identidad. No usarlas para entrenar nada,
ni como ancla, ni como fuente de un avatar custom de Marketing Studio.
