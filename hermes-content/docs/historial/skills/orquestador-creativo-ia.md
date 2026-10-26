# Skill: Orquestador Creativo IA

Usar esta skill cuando Sergio pida crear contenido visual, imagenes, videos,
anuncios, reels, TikToks, Shorts, UGC, ecommerce, campanas, modelos IA,
prompts, storyboards, guiones o piezas organicas con IA.

## Regla principal

Sergio solo debe decir que quiere crear. Hermes debe convertir esa idea en una
produccion lista para ejecutar usando:

- identidad documentada;
- prompts y referencias guardadas;
- mejor herramienta disponible;
- mejor flujo creativo;
- control legal y de plataforma;
- resultado accionable.

No devolver una idea vaga si se puede producir un paquete listo para ejecutar.

Cuando Sergio diga solo "crea X", inferir y completar:

- objetivo real;
- plataforma;
- formato;
- audiencia;
- concepto;
- escenas;
- guion;
- texto en pantalla;
- prompts listos;
- herramientas;
- edicion;
- checklist de calidad;
- riesgos y aprobaciones.

El usuario no debe repetir el sistema creativo. Hermes debe recordar y aplicar
las identidades, prompts y reglas documentadas.

## Identidad sagrada de modelo IA

Si existe una modelo/personaje documentado, su identidad es sagrada.

Nunca cambiar:

- rostro;
- estructura facial;
- ojos;
- nariz;
- boca;
- piel;
- pecas;
- cabello;
- edad aparente;
- cuerpo;
- energia;
- estilo;
- esencia.

Para Mara Vale, revisar primero:

- `hermes-content/docs/AI_ECOMMERCE_MODEL_SYSTEM_2026.md`
- `hermes-content/references/ai-ecommerce-model/README.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-round-09.md`
- `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-identity-bank-50-video-round-10.md`

Referencias principales:

- Master identity sheet:
  `hermes-content/references/ai-ecommerce-model/20260605-higgsfield-luxury-identity-contact-sheet-4k-v1.png`
- Identity bank:
  `hermes-content/references/ai-ecommerce-model/identity-bank-50/photos/`
- Sonrisa frontal recomendada:
  `hermes-content/references/ai-ecommerce-model/identity-bank-50/photos/mara_identity_02.jpg`

Prompt fijo de identidad:

```text
Same fictional adult red-haired woman from the Mara Vale identity sheet.
Preserve the same face, freckles, green-hazel eyes, nose, lips, jawline,
copper-red wavy hair, fair skin, body proportions and soft warm smile.
Do not create a similar person. Keep the exact documented identity.
```

Si una escena pone en riesgo la consistencia, priorizar identidad sobre escena.

### Sergio Avatar / Marca Personal

Para videos, fotos, avatar, lipsync o contenido con la cara de Sergio, revisar
primero:

- `hermes-content/docs/SERGIO_FACE_VOICE_ASSET_GUIDE.md`
- `hermes-content/references/sergio-approved-media/sergio-face-voice-profile-20260602.md`
- `hermes-content/references/sergio-approved-media/avatar-realism-lab-20260604.json`
- `hermes-content/references/sergio-approved-media/talking-video-lock/README.md`
- `hermes-content/references/sergio-approved-media/higgsfield-runs/20260605-source-video-final-avatar/RUN_SUMMARY.md`

Regla de identidad:

```text
Use Sergio's documented real face and talking-video lock as the identity source
of truth. Preserve the same young face, eyes, eyebrows, nose, lips, teeth,
smile shape, jaw, chin, ears, neck length, hairline, glossy black Italian side
part, natural athletic build, black founder/operator wardrobe and calm confident
energy. Do not create a similar generic model. Do not make him older, skinnier,
more plastic or less natural.
```

Para Sergio, fotos primero y video despues. No animar una foto que no pase QA
como retrato. Mantener movimiento minimo para proteger identidad, dientes, pelo
y cuello. AI face videos de Sergio no se publican ni se entregan como pieza
client-facing sin aprobacion explicita.

### Futbol Lab IA

Para el canal Futbol Lab IA, revisar primero:

- `FUTBOL_LAB_IA_CHANNEL_SYSTEM_2026.md`
- `FUTBOL_LAB_IA_BRAND_IDENTITY_2026.md`
- `hermes-content/references/futbol-lab-ia-language-system-20260605.json`
- `hermes-content/references/futbol-lab-ia-higgsfield-prompts-20260605.json`

Identidad creativa:

- `El Mister IA`: narrador cinematografico para dinero, poder, fichajes,
  Mundial y historias con tono elegante e ironico.
- `Profe Pixel`: analista tactico, rapido y claro.
- `VARcito`: remate comico breve y detector de humo.

Regla de lenguaje:

```text
Base neutral, remate local.
```

Usar nombres reales y datos editoriales cuando esten verificados, pero generar
visuales con siluetas, tarjetas, pizarras, escenarios originales y personajes
ficcionales. No crear rostros realistas de futbolistas, entrenadores o
celebridades sin aprobacion/licencia explicita.

## Calidad visual

Buscar siempre maxima calidad posible:

- premium;
- cinematografico;
- realista con ligera animacion elegante;
- humano y expresivo;
- limpio;
- profesional;
- viral o vendible segun objetivo.

La direccion por defecto para video IA debe ser:

- premium;
- cinematografica;
- realista con ligera animacion;
- limpia;
- humana;
- expresiva;
- no plastica;
- no infantil.

Evitar:

- resultados baratos;
- genericos;
- roboticos;
- deformes;
- borrosos;
- inconsistentes;
- plastico excesivo;
- anime;
- caricatura;
- look infantil.

## Seleccion de herramientas

Elegir segun tarea:

| Tarea | Herramienta preferida |
|---|---|
| Identidad, rostro, master sheets, referencias | Nano Banana Pro |
| Imagen base, ecommerce, mockups, packshots | Nano Banana Pro |
| Videos virales, movimiento llamativo, reels | Higgsfield, Kling, Veo |
| Movimiento natural/cinematografico | Kling o Veo |
| Video UGC rapido con producto | Higgsfield Marketing Studio o Veo fallback |
| Voz natural | ElevenLabs |
| Avatar/lipsync | HeyGen o herramienta equivalente |
| Edicion, subtitulos, overlays | ffmpeg, CapCut, Premiere, Canva |

Antes de gastar creditos en video, estimar costo cuando la herramienta lo
permita. Si un modelo falla con HTTP 5xx, registrar el bloqueo y probar un
fallback razonable.

Regla practica:

- Nano Banana Pro: identidad, imagen base, referencias, consistencia.
- Higgsfield: reels virales, movimiento estilizado, escenas llamativas.
- Kling: movimiento natural y escenas cinematograficas realistas.
- Runway o Veo: usar cuando convenga por camara, realismo o calidad.
- ElevenLabs/HeyGen: voz, avatar y lipsync si la escena lo exige.

## Voz y lipsync

Si existe voz documentada del personaje o marca, usarla como guia de tono,
ritmo, personalidad, acento, energia y estilo narrativo.

Para Mara Vale, usar como base provisional `Mara Voice v1`: mujer joven adulta,
espanol LATAM, calida, elegante, natural, emocionada sin sobreactuar, ritmo de
storytime premium y sonrisa audible. La primera muestra esta en
`hermes-content/references/ai-ecommerce-model/video-ads/storytime-kling-nike-dream/20260605-mara-storytime-sports-collab-voice-v1.mp3`.
Este perfil no es clon de voz ni voz definitiva; si se conecta ElevenLabs,
crear una voz original equivalente y registrar voice ID sin exponer secretos.

Para Sergio, no clonar voz ni hacer lipsync publicable sin aprobacion explicita.
Para previews internos, mantener voz humana, natural y creible, sin sonar a
locutor falso ni a guru. Si se usa ElevenLabs, HeyGen o equivalente, registrar
la herramienta y mantener el resultado en revision humana.

Nunca imitar voces de celebridades, influencers, clientes o terceros sin permiso
explicito. Si el audio de referencia pertenece a una persona real externa,
extraer solo estructura, ritmo y energia general; crear una voz original y
segura.

## Contenido real y referencias

Si Sergio pasa video, imagen, guion, tendencia o referencia:

1. Analizar estructura, ritmo, hook, framing, retencion, CTA y estetica.
2. Extraer principios, no copiar identidad.
3. Rehacer con modelo/marca propia.
4. Evitar celebridades, influencers, voces, musica, logos o marcas protegidas.
5. Mantener esencia comercial sin copiar assets.

Si no hay referencia, proponer una idea original, producible y vendible.

## Seguridad y legal

Nunca inventar:

- testimonios;
- resultados;
- metricas;
- precios;
- promesas;
- antes/despues;
- claims medicos;
- claims financieros;
- claims legales;
- claims de belleza garantizados.

Para beauty/skincare usar lenguaje seguro:

- "made for";
- "designed for";
- "helps create the look of";
- "fresh hydrated look";
- "soft glow";
- "lightweight feel".

Evitar:

- "quita arrugas";
- "elimina manchas";
- "cura acne";
- "repara la barrera" si no hay respaldo;
- "resultados en X dias";
- "probado clinicamente" sin prueba real.

No sexualizar innecesariamente. Si una prenda o escena activa filtros o riesgo
de pauta, proponer version segura con el mismo objetivo comercial.

No publicar, subir, pautar, entregar a cliente o contactar prospectos sin
aprobacion explicita.

## Flujo obligatorio

Para cada tarea creativa:

1. Entender objetivo real.
2. Identificar plataforma, formato y audiencia.
3. Revisar identidad y referencias documentadas si aplica.
4. Analizar referencia externa si existe.
5. Definir concepto creativo.
6. Definir escenas o piezas necesarias.
7. Elegir herramientas.
8. Crear prompts especificos listos para pegar o ejecutar.
9. Definir guion, voz, texto en pantalla y edicion.
10. Ejecutar generacion si Sergio pidio producir, no solo plan.
11. Validar con inspeccion visual, dimensiones, conteo, frames o metadata.
12. Registrar assets importantes en README/manifiesto si son canonicos.
13. Cerrar con cambios, validacion, riesgos y siguiente accion.

Si la tarea depende de tendencias, lenguaje, formatos virales, herramientas de
IA o comportamiento de audiencia, aplicar antes `radar-creativo-onia` y fuentes
actuales. No asumir que los formatos o herramientas siguen igual.

## Formato de respuesta

Usar solo las secciones necesarias:

- Objetivo
- Concepto creativo
- Estilo visual
- Estructura o escenas
- Guion o voz en off
- Texto en pantalla
- Prompts listos
- Herramientas recomendadas
- Notas de edicion
- Checklist de calidad
- Riesgos o aprobaciones pendientes

Para tareas pequenas, responder directo. Para produccion, ejecutar y entregar
rutas de archivos.

## Checklist de calidad

Antes de cerrar:

- La identidad coincide con el master.
- La sonrisa/energia no se perdio si era parte del brief.
- El producto se ve claro.
- No hay texto falso o logos inventados salvo placeholder interno.
- No hay claims inseguros.
- El formato coincide con la plataforma.
- La pieza es premium y no generica.
- Hay ruta local de los assets.
- No se publico nada sin aprobacion.
