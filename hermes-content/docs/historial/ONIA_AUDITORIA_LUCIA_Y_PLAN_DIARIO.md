# Auditoría Lucía + plan de publicación diaria

> Auditoría pedida por Sergio: "en lugar de generar videos, investiga qué estamos
> haciendo mal, revisa la cuenta, competencias, qué más podemos hacer".
> Datos de cuenta medidos por API el 22-ago. Research web 22-ago con fuentes citadas.

## 1. La cuenta, medida (no supuesta)

| | @lucia.antelo.oficial | @oniahq |
|---|---|---|
| Posts | **0** | 2 |
| Seguidores | **0** | 23 |
| Seguidos | **0** | 3 |
| Historias | 0 | 0 |
| Engagement del mejor post | — | 6 likes + 4 comentarios con 23 seguidores (**~17%**) |
| Bio | ✅ bien ("Creada con IA por @oniahq 🤖 Bolivia 🇧🇴") | ✅ |
| Link en bio | ⚠️ la bio dice "👇" y NO hay link | revisar |

**El veredicto duro:** el sistema de @oniahq FUNCIONA (17% de engagement, palabras
generando comentarios). Lucía es una cuenta fantasma: producimos mucho y publicamos NADA.

## 2. Qué estamos haciendo mal (lo nuestro, sin excusas)

1. **Producir > publicar.** Días de tests y recetas; 0 posts en la cuenta. El QC se volvió
   cuello de botella: piezas "me gustan" que nunca reciben el OK final ni se re-encolan.
2. **Cuenta sin calentamiento.** 0 seguidos = ni siquiera parece una cuenta real. Una
   cuenta nueva necesita seguir 30-80 cuentas relevantes (bolivianas + nicho IA) e
   interactuar antes y durante el arranque.
3. **Bio promete link y no hay link.** El "👇" apunta al vacío.
4. **Cero historias en ambas cuentas** — el formato de frecuencia diaria más barato no se
   está usando en absoluto.
5. **Sin highlights** preparados para el lanzamiento (¿Quién es Lucía? / Herramientas).
6. **El lanzamiento espera un OK** mientras la cuenta se enfría — el reel v3 está listo
   desde hoy.

## 3. Plan de publicación DIARIA de Lucía (borrador — se ajusta con el research)

Regla de cadencia: **1 pieza de feed al día + 2-3 historias diarias**, sostenible porque
la mayor parte NO es video nuevo:

| Día | Feed (1/día) | Historias (2-3/día, mayoría automatizables) |
|---|---|---|
| Lun | Reel IA sin humo | teaser del reel · dato/tip en placa · pregunta |
| Mar | Carrusel educativo | slide destacada · respuesta a comentario · placa |
| Mié | Reel personaje (vida) | behind-scenes (cómo se generó) · encuesta manual |
| Jue | Foto del banco + caption fuerte | tip placa · repost story de @oniahq |
| Vie | Reel IA sin humo | teaser · dato · CTA palabra |
| Sáb | Carrusel / meme del nicho | casual · placa |
| Dom | Recap semanal (historia larga) | "lo que viene" |

Costo de la semana tipo: 3 reels (~24 cr) + 2 carruseles (~8 cr) + fotos (2 cr) ≈
**35 cr/semana** — dentro de lo ya presupuestado (~100 cr/mes… ajustar a ~140).

## 4. Automatización de HISTORIAS — diseño técnico

**CONFIRMADO (Meta docs + repo Postiz, 22-ago):**
- La Instagram API publica historias (`media_type=STORIES`) en cuentas creator/business
  (developers.facebook.com/docs/instagram-platform/.../content-publishing).
- **Postiz ya soporta historias nativo** (`post_type: 'story'`) — nuestro
  `postiz_schedule.mjs` se extiende con un flag, sin construir nada nuevo.
- Límites duros: imágenes solo JPEG · **sin stickers interactivos** (ni encuesta, ni link,
  ni música — el endpoint no tiene esos parámetros; Postiz issue #580 lo confirma) ·
  rate limit 100 publicaciones API/24h.
- Las historias con encuesta/link (1-2 por semana) se suben A MANO desde el celular.

**Matiz del algoritmo que cambia el plan (Mosseri):** historias = conexión con seguidores
EXISTENTES; reels = alcance de nuevos. Con 0 seguidores, las historias diarias rinden casi
cero — primero reels + calentamiento; las historias escalan su cadencia con los seguidores
(arranque 1-2/día, hacia 3-4/día pasados los primeros cientos).

Arquitectura propuesta (n8n, mismo patrón que el resto del sistema):
1. **Cola de historias**: carpeta/tabla `stories_queue` con assets PRE-APROBADOS por
   Sergio en lote semanal (el QC no se salta: se aprueba la semana entera de una vez).
2. **Cron n8n 3×/día** (horarios pico Bolivia): toma el siguiente asset → publica vía
   Graph API con el token de la cuenta → marca publicado → aviso Telegram.
3. Generación de placas de historia **con código** (make-mockup/HyperFrames — 0 créditos):
   tips, datos, teasers de reels. Las historias "cámara" salen del b-roll ya generado
   (recortes 9:16 de 5-10 s = reciclaje, 0 créditos).
4. Mezcla editorial de historias: regla 50-30-20 (valor / interacción / behind-scenes).
   Las de interacción (encuesta, slider) son las manuales del celular.

## 5. Mecánica de Instagram 2026 — lo que manda el research (fuentes en el reporte del agente)

- **Señal reina: "sends per reach"** — contenido que la gente MANDA a un amigo (Mosseri).
  Cada pieza de Lucía necesita un "mandáselo a alguien que…" implícito.
- **Watch time decide** el alcance de reels; likes pesan con seguidores, shares con nuevos.
- **SEO > hashtags**: keywords en caption, bio, texto hablado y overlay. El campo "Name"
  es el más potente (✓ "IA para tu negocio" ya está). Desde jul-2025 los posts públicos de
  cuentas profesionales se indexan en Google.
- **Cadencia**: sweet spot 3-5 feed/semana (Buffer, 2M posts); publicar MÁS no castiga
  (Mosseri) — el riesgo es calidad, no el algoritmo. Diario es viable si la receta aguanta.
- **Trial reels**: requieren ≥1.000 seguidores — pendiente para más adelante, anotado.
- **Horas**: 20:00 la mejor (Metricool 300K cuentas), franja fuerte 17:00-23:00 LATAM,
  domingo el mejor día. Bolivia GMT-4 coincide.

## 5-bis. Competencia — lo que hacen las que crecen (fuentes en reporte del agente)

**Influencers IA:**
- **Aitana (@fit_aitana, 386K)**: cadencia casi DIARIA, ancla de identidad fija (pelo
  rosa), alta producción. The Clueless hace una **reunión editorial semanal donde "deciden
  su vida"** — la gente sigue VIDAS, no imágenes. → Lucía necesita su arco narrativo
  semanal, no posts sueltos.
- **Mia Zelu**: viral +165K seguidores en días con un carrusel "asistiendo" a Wimbledon —
  **personaje IA insertado en evento REAL del momento**. → Receta directa para Lucía:
  eventos bolivianos reales (Expocruz, partidos, ferias) con su cara.
- Lil Miquela: ABANDONADA (engagement 0%) — no copiar nada de ella hoy.
- Patrón ganador global: anclaje local fuerte (Imma/Tokio, Rozy/Corea) + cruce de
  verticales. Lucía = IA + Bolivia + negocios: exactamente el patrón.

**Nicho "IA en español" (competencia humana, el embudo que valida el nuestro):**
- @cerebrodigital.ia (906K): CTA curso de IA GRATIS como lead magnet.
- @neuromodernos (499K): "clase y certificado gratis" → membresía paga.
- @jonhernandezia (225K): reels de novedades en lenguaje llano → formación.
- TODOS usan "comenta la palabra X" + recurso gratis → comunidad → producto pago.
  **Nuestra escalera es exactamente este embudo probado a escala.**

**Historias (benchmark)**: regla **50-30-20** — 50% valor/tips, 30% interacción
(encuestas/preguntas — las manuales), 20% conexión/behind-scenes.

**Errores que matan cuentas IA** (todos evitados o por evitar):
etiqueta IA faltante (nosotros: declarada ✓) · comprar seguidores/pods (jamás) ·
hashtags spam (SEO>hashtags) · inactividad 90d (el riesgo REAL nuestro hoy) ·
estética genérica sin anclaje local (por eso escenarios bolivianos) ·
sobre-sexualización (mata brand deals).

## 6. Qué más podemos hacer (backlog de crecimiento)

- **Calentamiento**: Lucía sigue 50-70 cuentas del nicho (negocios bolivianos, IA en
  español, creadores locales) — manual o semi-automático MUY conservador (límites Meta).
- **Comentarios salientes**: Lucía comenta 5-10 posts/día del nicho con su voz (genera
  descubrimiento gratis). Semi-automatizable con aprobación por lote.
- **Trial reels** para probar ganchos: requieren 1.000 seguidores — anotado para esa meta.
- **Colaboraciones**: post colab Lucía × @oniahq (aparece en ambos feeds, gratis).
- **SEO de Instagram**: keywords en caption y nombre ("IA para tu negocio" ya está en el
  nombre ✓).

## 7. El plan de acción que sale de todo esto (en orden)

1. **PUBLICAR YA** (hoy-mañana): OK de Sergio al reel v3 → Lucía arranca con reel + carrusel
   fijado + 4 fotos del banco aprobadas escalonadas. La cuenta deja de ser fantasma.
2. **Calentamiento paralelo**: seguir 50-70 cuentas del nicho en 3-4 días (manual/celular,
   límites Meta) + link en bio (onia.com.bo/?src=lucia-bio).
3. **Cola diaria de 2 semanas** en Postiz (feed) — mezcla 3 reels + 2 carruseles + 2 fotos
   por semana, 20:00 Bolivia.
4. **Historias fase 1** (1-2/día): extiendo `postiz_schedule.mjs` con `post_type story` +
   cron n8n; assets = placas de código (0 cr) + recortes del b-roll existente (0 cr).
   Aprobación por LOTE semanal de Sergio.
5. **Pieza "Mia Zelu boliviana"**: carrusel de Lucía en un evento real del momento —
   la receta viral probada del nicho. (Candidatos: según calendario del mes.)
6. **Arco narrativo semanal**: reunión editorial tipo The Clueless — YO la preparo cada
   domingo (qué le pasa a Lucía esta semana), Sergio aprueba en el mismo lote.

---

## 7. Música de Instagram por API — SÍ se puede, pero no con nuestra conexión (22-ago)

Verificado leyendo `instagram.provider.js` de Postiz (no supuesto). El publicador arma
`audio_configuration` con `audio_id`, `audio_volume` y `video_volume` — o sea que **permite
mezclar la música con el audio propio del video**, que es justo lo que haría falta para un
reel con narración.

**Pero exige CUATRO condiciones a la vez** (líneas 481-486):

```js
settings.audio.id                      // hay un audio elegido
&& type === 'graph.facebook.com'       // ⚠️ conexión via FACEBOOK GRAPH
&& !isStory                            // no en historias
&& media.length === 1                  // un solo archivo (no carrusel)
&& hasExtension(path, 'mp4')           // es video
```

**El bloqueante es el segundo.** Nuestras tres cuentas están conectadas como
`instagram-standalone` (Instagram API with Instagram Login) — el método que nos desbloqueó
la publicación sin App Review. Con esa conexión, el audio **no se aplica**: Postiz ni siquiera
arma el parámetro.

### El trade-off, escrito para no volver a discutirlo

| | Instagram Login (lo que tenemos) | Facebook Graph |
|---|---|---|
| Publica hoy | ✅ | requiere app con permisos de páginas |
| App Review | no hace falta | sí, para permisos de páginas |
| Música de IG por API | ❌ | ✅ |
| Carruseles con música | ❌ (la API no lo permite en ningún caso) | ❌ |

### Qué hacemos entonces

1. **Reel de lanzamiento y piezas con VOZ → sin música, por API.** La narración ES el
   contenido; una canción encima compite con ella. No perdemos nada.
2. **Piezas MUDAS donde la música es el gancho** (b-roll de "un día en mi vida", memes) →
   **se publican a mano desde el celular**, eligiendo audio en tendencia ahí. Son 2 minutos y
   se gana el empuje algorítmico del audio trending, que por API no existe.
3. **Migrar a Facebook Graph solo si** algún día el volumen de piezas mudas lo justifica. Es
   el mismo camino de la app que hoy estamos evitando a propósito.
