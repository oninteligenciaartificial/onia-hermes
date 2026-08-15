# Avatares hiperrealistas con IA en 3 pasos — @zeus.creator

- **Fuente:** https://www.instagram.com/p/DbngjrqNAjW/ · 99 s · locución en español (España)
- **Visto:** 2026-08-12 (Gemini nativo + Whisper/Speaches)
- **Archivo:** `Instagram-DbngjrqNAjW.mp4` (no versionado)
- **Lectura completa + transcripción literal:** [transcripciones/2026-08-12-Instagram-DbngjrqNAjW.md](transcripciones/2026-08-12-Instagram-DbngjrqNAjW.md)

## Qué dice realmente

Tutorial-anzuelo de infoproducto. Hook con apuesta física (mete una pelota de golf: *"Si consigo
meter la bola, te enseño a crear avatares hiperrealistas como yo"*), tres pasos numerados con texto
en pantalla palabra por palabra, y cierre con captación por comentario.

El método completo, tal como lo enseña, son tres pasos:

1. **[00:11-00:23]** Buscar una **imagen real** en Pinterest, Instagram o cualquier red social y
   subirla a ChatGPT. Admite que puede ser tu propia foto ("como si quieres, ser tú mismo").
2. **[00:37-00:48]** Pedirle a ChatGPT literalmente *"dame el prompt en formato JSON de esta
   imagen"*. Afirma que ese formato "es el mejor para realismo" — **sin mostrar ninguna
   comparación ni evidencia: a verificar**.
3. **[00:49-00:54]** Usar ese prompt para generar una *"réplica uno a uno"* de la foto elegida.
   **No nombra en ningún momento con qué generador de imagen** se hace ese paso final.

Todo lo demás (48 de 99 segundos) es venta: montaje de avatares en pileta, playa, perfume; sticker
*"TIENES UNA OPORTUNIDAD, APROVÉCHALA"*; y promesas — *"avatares realistas que trabajan 24/7 para
ti"*, ahorrarte "miles de euros", "sin contrataciones", ir "años por delante del resto" porque "la
mayoría aún no sabe ni que esta oportunidad existe". Ninguna cifra es verificable y ninguna se
sostiene con demo: **todo a verificar**. Menciona también haber creado "12 más en dos minutos"
(00:26-00:31), otra vez sin mostrarlo.

**CTA [01:30-01:39]:** comentar la palabra **ZEUS** para recibir por DM una guía gratuita
(*"Influencer Digital / La Próxima Generación Impulsada por IA"*) y acceso a una comunidad privada.
El video es el escalón gratis de un embudo; si la comunidad es paga, no lo dice — **a verificar**.

## Veredicto: HUMO

Tres motivos, cualquiera bastaría:

1. **Vende como secreto algo estándar.** Pedirle a un modelo el prompt estructurado de una imagen
   de referencia es una técnica corriente, no un descubrimiento. El video la envuelve en "la
   mayoría ni sabe que existe" — eso es marketing, no información.
2. **Duplica lo que ya tenemos, y peor.** El método produce **una réplica de una foto**, no una
   identidad reutilizable. Nuestro esquema verificado es el contrario: **Soul + texto es el único
   método que sostiene la misma cara entre generaciones** (memoria `avatar-consistency-scheme`), y
   ya tenemos Souls listos (Lucía, Mara, Sergio x5). Adoptar esto sería retroceder a caras que
   cambian de un post al siguiente.
3. **El paso que importa está hueco.** Nunca dice con qué herramienta se genera la imagen final —
   justo el paso donde se decide el realismo y donde se gasta plata. El "tutorial" entrega el
   prompt y esconde el motor, que es exactamente el diseño de un anzuelo.

No aplica la excepción REFERENCIA: las únicas interfaces que se ven son ChatGPT, Pinterest e
Instagram, no un diseño propio reconstruible.

## Para qué nos sirve

| Frente | Acción concreta |
|---|---|
| Influencers IA (Souls) | **No adoptar el método.** Seguir con Soul + texto; el JSON one-shot no da consistencia de cara |
| Contenido / Reels | Único rescatable: la **estructura** — hook con apuesta física, 3 pasos numerados, texto en pantalla palabra por palabra, CTA de palabra clave. Candidato a modelo en `web-factory/data/references/reels/models/` |
| Marketing con IA | El patrón "comenta PALABRA → DM con guía" es un embudo real, pero **bloqueado por S6 (token IG)**. Anotarlo como pendiente, no como capacidad |
| Editor de videos | Ninguna. El montaje es corte rápido estándar; ya lo cubre `editor-videos` + HyperFrames |

Nada de esto habilita gasto: la estructura del reel se replica con lo que ya está instalado.

## Riesgo

- **Copiar la cara de una persona real.** El paso 1 propone tomar una foto ajena de Pinterest o
  Instagram y hacer una "réplica uno a uno". En Bolivia la CPE (art. 21, num. 2) reconoce el
  derecho a la propia imagen; hacerlo con la cara de un tercero sin permiso nos expone sin ninguna
  necesidad. Nuestras caras IA salen de Souls propios, no de fotos ajenas.
- **Políticas de plataforma.** Generar imágenes de personas reales identificables suele estar
  restringido por los términos de los generadores y por Meta, y Meta exige etiquetar contenido IA
  (regla nuestra ya vigente, ver `ai-influencers-account-ops`). Condiciones exactas **a verificar**
  antes de cualquier prueba.
- **Contagio de discurso.** "Trabajan 24/7 por ti", "ahorrate miles de euros", "sin contratar a
  nadie": si ese tono se filtra a nuestra comunicación B2B, prometemos lo que no medimos. El
  comprador de Onia es un dueño de negocio formal, no un aspirante a creador.
