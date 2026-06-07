# Sergio Face and Voice Profile - 2026-06-02

## Estado

Paquete privado de referencia listo para crear borradores controlados de Sergio.

No usar para publicar, entregar a clientes, clonar voz o generar piezas con cara
sin aprobacion explicita por pieza.

## Material local

| Categoria | Cantidad | Ruta |
|---|---:|---|
| Fotos HEIC | 24 | `inbox/IMG_*.HEIC` |
| Videos MOV con voz | 4 | `inbox/IMG_*.MOV` |
| Audios WAV extraidos | 4 | `voice-inbox/IMG_*.wav` |
| Metadata/frames/previews | 28 carpetas | `processed/IMG_*/` |
| Hoja de contacto | 1 | `processed/sergio_contact_sheet_20260602.jpg` |

## Videos y voz

| Video | Duracion | Uso |
|---|---:|---|
| `IMG_0209.MOV` | 8.04 s | muestra corta de voz/gesto |
| `IMG_0210.MOV` | 9.24 s | muestra corta de voz/gesto |
| `IMG_0217.MOV` | 90.54 s | muestra larga de voz natural |
| `IMG_0218.MOV` | 91.44 s | muestra larga de voz natural |

Audios extraidos:

- `voice-inbox/IMG_0209.wav`
- `voice-inbox/IMG_0210.wav`
- `voice-inbox/IMG_0217.wav`
- `voice-inbox/IMG_0218.wav`

Transcripcion pendiente: falta `OPENAI_API_KEY` en el entorno local.

## Referencia visual

El set cubre:

- rostro frontal;
- perfil izquierdo/derecho;
- cuerpo medio y cuerpo completo;
- vista posterior;
- expresiones neutral, sonrisa, ojos cerrados y boca abierta;
- postura quieta, giro lateral y caminata;
- outfit deportivo azul/morado;
- fondo interior con armario de madera y luz directa.

## Outfit base aprobado para briefs

Para contenido nuevo, usar ropa negra como uniforme visual de Sergio:

- camiseta negra limpia;
- pantalon negro o jean oscuro;
- zapatos oscuros;
- sin logos grandes;
- sin colores llamativos;
- sin patrones que distraigan.

Variantes listas:

- `black_operator_basic`: videos diarios, hooks directos y marca personal.
- `black_consultant`: auditorias, consultoria ONIA y ventas B2B.
- `black_technical_demo`: demos de n8n, Notion, IA, Higgsfield y workflows.
- `black_premium_meeting`: propuestas, clientes premium y autoridad consultiva.

Referencia canonica ampliada:
`hermes-content/docs/SERGIO_ONIA_CONTENT_PRODUCTION_KIT_2026.md`.

## Personaje base para borradores

Uso recomendado para prompts internos:

```text
Sergio, founder/operator de ONIA, estilo natural y directo. Joven adulto de
complexion delgada, cabello corto oscuro, energia tranquila, gestos simples y
expresion honesta. Viste ropa negra limpia y simple, sin logos grandes.
Apariencia realista, sin look de influencer exagerado. Debe sentirse como
contenido grabado por una persona construyendo sistemas y automatizaciones en
publico.
```

## Lanes permitidos

### Sergio personal

Usar para:

- contenido building-in-public;
- explicaciones cortas de sistemas;
- videos de proceso;
- hooks donde Sergio habla como operador, no como guru.

No usar para:

- promesas falsas;
- testimonios inventados;
- claims de clientes sin prueba;
- publicaciones sin revision.

### ONIA Sergio-led

Usar para:

- videos donde Sergio introduce una auditoria, instalacion o caso real;
- demos de sistemas;
- piezas consultivas.

No usar para:

- representar a un cliente;
- vender como si fuera resultado garantizado;
- mezclar precios o comisiones internas.

## Prompt visual seguro

```text
Create a realistic vertical creator video reference of Sergio as an ONIA
founder/operator. Natural phone-camera look, indoor workspace feel, honest and
direct delivery, minimal gestures, clean Spanish captions, no exaggerated
influencer pose. Preserve the same face, short dark hair, slim build and casual
athletic styling from the approved reference assets. Keep lighting realistic and
avoid over-polished commercial aesthetics.
```

## Negative prompt

```text
No celebrity likeness, no third-party identity, no fake client testimonial, no
guaranteed results, no exaggerated guru style, no distorted face, no extra
fingers, no logo changes, no unrelated brands, no publication without approval.
```

## Siguiente paso

1. Transcribir audios cuando `OPENAI_API_KEY` este disponible.
2. Seleccionar 5 mejores fotos para identidad estable.
3. Seleccionar 2 mejores fragmentos de voz natural.
4. Usar los modelos de uso ya definidos en
   `hermes-content/docs/SERGIO_ONIA_CONTENT_PRODUCTION_KIT_2026.md`:
   - Sergio casual/directo con `black_operator_basic`;
   - Sergio consultor ONIA con `black_consultant`;
   - Sergio demo tecnica con `black_technical_demo`;
   - Sergio founder story con `black_operator_basic`.
5. Generar solo borradores internos y pedir aprobacion antes de publicar.
