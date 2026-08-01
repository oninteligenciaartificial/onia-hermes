# Sergio Face and Voice Asset Guide

## Objetivo

Crear una biblioteca aprobada de cara, voz y estilo de Sergio para producir
contenido de forma controlada para:

- Sergio marca personal;
- Onia como empresa/consultoria;
- videos internos de prueba;
- piezas comerciales solo con aprobacion explicita.

La cara y voz de Sergio son activos sensibles. No se usan para publicar,
impersonar, prometer resultados ni vender a clientes sin revision humana.

## Como Sergio puede pasar imagenes

Opciones aceptadas:

1. Subir archivos directamente al chat de Codex.
2. Pasar links de Google Drive con acceso visible.
3. Guardar archivos en:

```text
C:\dev\Expermimentos\Hermes\hermes-content\references\sergio-approved-media\inbox
```

Formato recomendado:

- fotos: `.jpg`, `.jpeg`, `.png`, `.webp`;
- video real corto: `.mp4`, `.mov`;
- resolucion ideal: 1080p o superior;
- luz clara, rostro visible, sin filtros fuertes;
- varios angulos: frente, 3/4, lateral;
- expresiones: neutral, sonriendo, serio, explicando, sorprendido;
- ropa base: 2-3 outfits que Sergio si usaria en contenido real.

## Outfit base 2026: negro

Para contenido nuevo, Sergio debe tener un uniforme visual consistente:

- ropa negra limpia y simple;
- sin logos grandes;
- sin colores llamativos;
- sin patrones fuertes;
- aspecto realista de fundador/operador, no de guru.

Outfits canonicos:

- `black_operator_basic`: camiseta negra, pantalon negro o jean oscuro, zapatos oscuros.
- `black_consultant`: camiseta negra con overshirt, chaqueta ligera o blazer negro.
- `black_technical_demo`: hoodie negro o chaqueta negra para demos tecnicas.
- `black_premium_meeting`: blazer o chaqueta estructurada negra para propuestas.
- `black_content_casual`: camiseta negra sencilla para clips espontaneos.

La libreria completa de outfits, personajes, escenas, hooks y prompts esta en:

```text
hermes-content/docs/SERGIO_ONIA_CONTENT_PRODUCTION_KIT_2026.md
hermes-content/references/sergio-onia-content-kit-20260602.json
```

Evitar:

- fotos con otras personas;
- fotos con datos privados de fondo;
- logos o marcas de terceros no aprobadas;
- filtros que cambien la cara;
- imagenes oscuras o borrosas;
- fotos que no quieras ver reutilizadas como referencia.

## Set minimo de cara

Para empezar bien:

| Asset | Cantidad | Uso |
|---|---:|---|
| Fotos rostro limpio | 8-12 | referencia facial |
| Fotos cuerpo medio | 4-6 | outfit y postura |
| Videos hablando | 3-5 clips de 10-30s | gestos y naturalidad |
| B-roll real | 5-10 clips | trabajo, laptop, oficina, calle, rutina |
| Fotos estilo/lifestyle | 6-10 | historias y marca personal |

## Shooting maestro de Sergio

Objetivo: crear un paquete de identidad estable para que Hermes pueda preparar
borradores de contenido con la cara, gestos, voz, outfits y escenas de Sergio
sin depender de tomas improvisadas.

Nombre del shooting:

```text
sergio-identity-shoot-01-black-operator
```

Duracion recomendada: 60-90 minutos.

Formato:

- video vertical 9:16;
- 4K si el telefono lo permite, minimo 1080p;
- 30 fps para talking head;
- 60 fps para B-roll de movimiento;
- audio con microfono cercano o audifonos con buen microfono;
- sin filtros, sin beauty mode, sin fondos con datos privados.

### Outfit obligatorio

Usar ropa negra para fijar el uniforme visual:

- camiseta negra limpia;
- pantalon negro o jean oscuro;
- zapatos oscuros;
- opcional: overshirt, hoodie o blazer negro segun la escena;
- sin logos grandes;
- sin patrones fuertes;
- sin accesorios que distraigan.

### Set 1: cara perfecta

Grabar o fotografiar con luz frontal suave. Mantener fondo limpio.

Tomas requeridas:

| Toma | Duracion/cantidad | Instruccion |
|---|---:|---|
| Frente neutral | 10 fotos o 20 s video | mirar a camara sin sonreir |
| Frente sonrisa natural | 10 fotos o 20 s video | sonrisa pequena, no exagerada |
| Tres cuartos izquierda | 10 fotos o 20 s video | girar 30-45 grados |
| Tres cuartos derecha | 10 fotos o 20 s video | girar 30-45 grados |
| Perfil izquierdo | 5 fotos o 15 s video | rostro completo visible |
| Perfil derecho | 5 fotos o 15 s video | rostro completo visible |
| Explicando | 30-45 s | hablar normal, manos suaves |
| Escuchando/pensando | 20 s | mirada natural, pausa, asentir |
| Caminando hacia camara | 20 s | paso lento, mirada natural |
| Giro completo | 20 s | girar despacio, cuerpo medio |

### Set 2: voz limpia

Grabar 10-15 minutos totales. Hablar como Sergio, no como locutor.

Reglas:

- grabar en habitacion silenciosa;
- telefono a 20-30 cm de la boca;
- no poner musica de fondo;
- hacer pausas naturales;
- grabar una version calmada y otra mas energetica.

Texto base para leer:

```text
Estoy construyendo ONIA porque muchos negocios no necesitan mas ruido,
necesitan un sistema. Si un cliente escribe por WhatsApp, alguien tiene que
responder, calificar, registrar y hacer seguimiento. Si eso no existe, se pierden
ventas aunque haya buenos leads.

Yo no quiero vender automatizaciones como si fueran magia. Quiero revisar el
proceso, entender donde se escapan las oportunidades y despues instalar algo que
el equipo pueda usar de verdad.

Para mi marca personal quiero sonar directo, practico y honesto. Estoy
construyendo en publico, probando herramientas, corrigiendo errores y mostrando
lo que realmente funciona.

Para ONIA quiero sonar mas consultivo: claro, profesional y enfocado en negocio.
No se trata solo de hacer videos o bots. Se trata de crear sistemas que ayuden a
vender, atender y operar mejor.
```

Frases extra para capturar ritmo:

```text
No necesitas automatizar todo. Necesitas saber que parte del proceso esta rota.
El bot no deberia reemplazar al vendedor. Deberia preparar mejores oportunidades.
La mayoria no pierde ventas por falta de leads. Pierde ventas por falta de seguimiento.
Esto no es magia. Es proceso, criterio y ejecucion.
```

### Set 3: escenas base para videos

Grabar cada escena en clips de 10-30 segundos.

| Escena | Outfit | Uso |
|---|---|---|
| escritorio hablando a camara | `black_operator_basic` | hooks, opiniones, historias |
| laptop con pantalla segura | `black_technical_demo` | n8n, Notion, Chatwoot, prompts |
| pizarra o libreta | `black_consultant` | auditorias, estrategia |
| telefono con WhatsApp simulado | `black_consultant` | leads, ventas, seguimiento |
| caminando con telefono | `black_content_casual` | reflexiones cortas |
| llamada o reunion simulada | `black_premium_meeting` | consultoria, autoridad |
| B-roll manos/laptop/cafe/notas | cualquier negro limpio | transiciones y cortes |

No mostrar:

- numeros reales de clientes;
- chats reales;
- tokens, claves, dashboard con datos privados;
- logos de terceros no aprobados;
- otras personas sin permiso.

### Set 4: gestos y expresiones

Grabar clips cortos para que los modelos tengan variacion natural:

- explicar con una mano;
- senalar pantalla;
- mirar laptop y volver a camara;
- reaccionar a un error;
- sonreir leve;
- pausa seria;
- asentir como escuchando;
- tomar notas;
- abrir laptop;
- caminar y detenerse.

### Nombres de archivo recomendados

Guardar en:

```text
C:\dev\Expermimentos\Hermes\hermes-content\references\sergio-approved-media\inbox
```

Nombres:

```text
sergio_identity_01_face_front_neutral.mp4
sergio_identity_02_face_angles.mp4
sergio_identity_03_voice_clean_main.wav
sergio_identity_04_voice_energy.wav
sergio_identity_05_desk_talking_head.mp4
sergio_identity_06_technical_demo_broll.mp4
sergio_identity_07_consulting_scene.mp4
sergio_identity_08_phone_whatsapp_simulated.mp4
```

### Criterio de aprobacion

Un asset queda listo cuando:

- la cara se ve nitida;
- los ojos no salen borrosos;
- la luz no deforma el rostro;
- la voz no satura;
- no hay datos privados visibles;
- el outfit coincide con la libreria negra;
- Sergio confirma que puede usarse como referencia interna.

## Como Sergio puede pasar voz

Opciones aceptadas:

1. Subir audios al chat de Codex.
2. Pasar Google Drive con `.wav`, `.mp3` o `.m4a`.
3. Guardar archivos en:

```text
C:\dev\Expermimentos\Hermes\hermes-content\references\sergio-approved-media\voice-inbox
```

Grabacion recomendada:

- 5-10 minutos de voz total;
- habitacion silenciosa;
- microfono cerca pero sin saturar;
- hablar natural, no como locutor;
- grabar en espanol como Sergio habla realmente;
- incluir frases rapidas, pausadas, explicativas y emocionales.

Guion para muestra de voz:

```text
Estoy construyendo ONIA para ayudar a negocios a ordenar ventas, contenido y
automatizaciones. No quiero que suene como una agencia generica. Quiero que se
sienta practico: revisar el problema, instalar un sistema, medir y mejorar.

Cuando hago contenido para Sergio, quiero sonar directo, honesto y en proceso.
Cuando hago contenido para ONIA, quiero sonar claro, consultivo y profesional.
```

## Separacion por marca

### Sergio personal

Usar:

- videos reales primero;
- voz real cuando sea posible;
- AI solo como ayuda para guion, subtitulos, b-roll o borradores;
- tono founder/operator.

No usar:

- promesas falsas;
- voz clonada como si fuera grabacion real sin aprobar;
- videos que parezcan guru;
- claims de clientes sin evidencia.

### Onia

Usar:

- voz narradora profesional o Sergio-led si el contenido lo necesita;
- visuales de sistema, consultoria, automatizacion, dashboard y clientes;
- CTA a auditoria, demo o diagnostico.

No usar:

- cara de Sergio para representar a un cliente;
- voz de Sergio prometiendo resultados garantizados;
- mezcla de precios/comisiones de otro negocio.

### Clientes

Usar solo assets aprobados por el cliente.

No usar cara, voz, logo, producto o testimonio de cliente sin consentimiento.

## Consentimiento operativo

Antes de usar voz/cara generada:

```text
Autorizo a Hermes/ONIA a usar estas imagenes y audios como referencia interna
para generar borradores de contenido. Cada publicacion o entrega client-facing
con mi cara o voz generada requiere aprobacion explicita antes de publicarse.
```

La aprobacion para generar borradores no es aprobacion para publicar.

## Flujo seguro

```text
recibir assets -> registrar en manifest -> clasificar Sergio/ONIA/cliente
-> crear prompts/personajes -> generar borrador -> Sergio revisa
-> aprobar o rehacer -> publicar solo con aprobacion explicita
```

## Manifest recomendado

Cada asset debe registrarse en:

```text
hermes-content/references/sergio-approved-media/manifest.json
```

Campos:

- `asset_id`
- `file_path`
- `type`
- `brand_lane`
- `approved_for_reference`
- `approved_for_generation`
- `approved_for_publication`
- `notes`

## Reglas finales

- No publicar cara o voz AI de Sergio sin aprobacion.
- No clonar voz sin consentimiento explicito.
- No usar assets privados de fondo.
- No mezclar Sergio personal con Onia si el mensaje no corresponde.
- No usar assets de Sergio para clientes.
- Si hay duda, crear borrador y pedir aprobacion.
