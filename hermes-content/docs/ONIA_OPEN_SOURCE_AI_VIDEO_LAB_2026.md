# Onia Open Source AI Video Lab 2026

Estado: canonico operativo interno.
Fecha base: 2026-06-15.

## Objetivo

Usar modelos open-source y GPU alquilada por hora como laboratorio barato para
probar imagen, movimiento, escenas, prompts y estilos. Higgsfield queda como
motor premium para la version final cuando la idea ya esta validada.

La regla central:

```text
Open source = laboratorio de pruebas.
Higgsfield = acabado final/publicable.
```

## Decision de stack

| Capa | Herramienta | Uso | Estado |
|---|---|---|---|
| Control plane | VPS Onia actual | n8n, Supabase, Hermes, SearXNG, backups | activo |
| Router IA | LiteLLM | enrutar local, GPU y API premium | siguiente instalacion |
| Interfaz interna | Open WebUI | chat, prompts, pruebas con Ollama/API | siguiente instalacion |
| Modelo barato texto | Ollama + Qwen pequeno | drafts, prompts, clasificacion simple | activo con `qwen2.5:3b` |
| GPU temporal | RunPod Pod | render por hora, no 24/7 | usar bajo demanda |
| Interfaz visual | ComfyUI | workflows de imagen/video local | en GPU temporal |
| Imagen open | Qwen-Image | imagen, texto en imagen, edicion | preferido |
| Imagen open | FLUX.1 schnell | exploracion rapida y barata | preferido |
| Video open | Wan2.2 TI2V-5B | imagen/texto a video, pruebas 3-6s | preferido |
| Video open | LTX-Video | iteracion rapida, control, keyframes | alternativo |
| Video open | HunyuanVideo 1.5 | pruebas ligeras y variaciones | alternativo |
| Premium | Higgsfield | final con mejor look, UGC, marketing | solo final o tomas clave |

## Lo que no se instala todavia

- ComfyUI no se instala en el VPS actual: no tiene GPU.
- Wan, Hunyuan y LTX no corren en el VPS actual para video real.
- Odysseus no entra a produccion todavia: se puede probar como laboratorio
  aparte, pero pisa funciones de Open WebUI, SearXNG, n8n y Supabase.
- MiniMax-M3 no es base operativa: es enorme y no conviene correrlo por ahora.
- MiniMax API/MCP puede servir como fallback, pero no reemplaza el laboratorio
  open-source porque sigue siendo API paga.

## Regla de costos

No contratar GPU mensual fija al inicio.

Usar GPU por sesiones:

| Necesidad | GPU recomendada | Regla |
|---|---|---|
| Imagen y pruebas simples | RTX A5000 24GB o RTX 3090 24GB | barato, limitar a 1-2h |
| Video serio y workflows pesados | RTX A6000 48GB | opcion base para Onia |
| Modelos grandes 80GB+ | A100 80GB | solo si hay una razon clara |

Reglas operativas:

1. Cargar pocos creditos al inicio: USD 20-30.
2. Trabajar en bloques de 2-4 horas.
3. Apagar el Pod apenas termina la sesion.
4. Mantener volumen persistente solo si evita volver a descargar modelos.
5. Registrar costo, modelo, prompt y resultado por cada prueba aprobable.

## Reglas legales y comerciales

El modelo local puede generar con menos filtros, pero Onia mantiene control
comercial:

- Usar personajes ficticios o assets propios por defecto.
- Usar rostro/voz real solo con permiso y revision humana.
- No usar celebridades, influencers o marcas protegidas como si aprobaran algo.
- No inventar testimonios, resultados, metricas o claims medicos/financieros.
- No publicar ni entregar a cliente sin aprobacion explicita.
- Revisar licencia del checkpoint exacto si no es Qwen-Image, FLUX.1 schnell
  o Wan2.2.

## Flujo exacto de trabajo

### Fase 1: preparar el cerebro en VPS

Objetivo: que el VPS organice prompts, decisiones, historial y aprobaciones.

1. Mantener activos los servicios actuales:

   ```text
   n8n-sergio
   Supabase self-hosted privado
   Hermes Video Lab
   SearXNG
   Ollama
   ```

2. Instalar despues, en este orden:

   ```text
   LiteLLM -> Open WebUI -> registro de runs en Supabase -> workflow n8n
   ```

3. No exponer publicamente LiteLLM/Open WebUI al inicio. Usar tunel SSH o
   acceso local privado hasta tener autenticacion y dominio listos.

4. Guardar cada prueba con estos campos minimos:

   ```text
   fecha
   proyecto
   objetivo
   herramienta
   modelo
   GPU
   costo estimado
   prompt
   negative_prompt
   seed/config
   input_asset
   output_asset
   score_visual
   score_movimiento
   score_identidad
   decision
   siguiente_accion
   ```

### Fase 2: crear el brief antes de abrir GPU

Antes de gastar GPU, completar:

1. Objetivo del video:

   ```text
   Que queremos vender, explicar o probar.
   ```

2. Formato:

   ```text
   Reel 9:16, clip 3-6s, imagen base, UGC, demo, producto, cinematico.
   ```

3. Escena unica:

   ```text
   Una sola toma clara, no video completo todavia.
   ```

4. Prompt base:

   ```text
   [sujeto], [accion], [lugar], [camara], [luz], [estilo],
   [detalle importante], vertical 9:16, premium realistic commercial video.
   ```

5. Negative prompt:

   ```text
   blurry, low quality, distorted face, deformed hands, bad anatomy,
   extra fingers, text artifacts, logo artifacts, plastic skin,
   flicker, jitter, warped product, inconsistent identity.
   ```

### Fase 3: abrir RunPod para ComfyUI

1. Entrar a RunPod.
2. Ir a `Pods`.
3. Click en `Deploy`.
4. Elegir `Start from a Hub listing` o buscar template `ComfyUI`.
5. Si no aparece ComfyUI, usar un template PyTorch/CUDA y configurar ComfyUI
   manualmente despues.
6. GPU recomendada para primera sesion real:

   ```text
   RTX A6000 48GB
   ```

7. Configuracion inicial:

   ```text
   Container disk: 30 GB
   Volume disk: 100-150 GB
   HTTP port: 8188
   Volume mount path: /workspace
   ```

8. Deploy.
9. Abrir `Connect` y entrar al HTTP service de ComfyUI.
10. Verificar que ComfyUI cargue antes de descargar modelos grandes.

### Fase 4: instalar modelos/workflows en ComfyUI

Orden de pruebas:

1. Imagen base:

   ```text
   Qwen-Image o FLUX.1 schnell
   ```

2. Video desde imagen:

   ```text
   Wan2.2 TI2V-5B
   ```

3. Alternativas si Wan falla o sale lento:

   ```text
   LTX-Video
   HunyuanVideo 1.5
   ```

Metodo:

1. Cargar workflow oficial o ejemplo de la comunidad.
2. Instalar nodos faltantes desde ComfyUI Manager solo si el workflow los pide.
3. Descargar checkpoints dentro del volumen persistente.
4. Hacer primero una prueba corta y barata.
5. No correr 30-60s en una sola generacion.

Configuracion de prueba recomendada:

```text
Duracion: 3-6 segundos
Resolucion inicial: 480p o 720p si la GPU aguanta
Formato: vertical 9:16
Variantes por idea: 3-5
Elegir solo 1 ganador por escena
```

### Fase 5: guardar el paquete ganador

Cada resultado util se guarda como paquete:

```text
idea/
  00-brief.md
  01-image-prompt.txt
  02-video-prompt.txt
  03-negative-prompt.txt
  04-config.json
  inputs/
  outputs/
  winners/
```

El ganador debe tener:

- imagen o video original;
- prompt exacto;
- modelo/checkpoint;
- seed/config;
- nota de por que gano;
- decision: repetir, mejorar, pasar a Higgsfield o descartar.

### Fase 6: decidir si saltar a Higgsfield

Saltar a Higgsfield solo si se cumple al menos una:

- La idea ya se entiende en open-source.
- La composicion y direccion de camara funcionan.
- El personaje/producto se ve vendible.
- Hay un prompt ganador.
- El error principal es calidad final, no concepto.
- La pieza va a publicarse o venderse.

No saltar a Higgsfield si:

- el hook no esta claro;
- la escena no vende nada;
- hay duda de identidad;
- no hay producto/oferta definido;
- solo estamos explorando estilo.

## Primer ejercicio recomendado

Objetivo: probar el pipeline completo sin gastar de mas.

Video:

```text
ONIA muestra como un negocio pierde leads de WhatsApp por no responder rapido.
```

Escena 1:

```text
Founder-style desk shot, laptop with blurred dashboard, phone with WhatsApp
notifications, evening office, cinematic practical lighting, realistic,
premium SaaS operations mood, vertical 9:16.
```

Prompt imagen:

```text
A realistic premium vertical 9:16 commercial still of a young founder's desk,
laptop open with a blurred business dashboard, phone showing generic chat
notification bubbles, notebook with automation flow sketch, warm evening office
lighting, black and green ONIA-inspired tech mood, sharp product-like
composition, no readable brand logos, no real people, cinematic but natural.
```

Prompt video:

```text
Slow cinematic push-in toward the phone and laptop, subtle notification glow,
soft hand movement entering frame to pick up the phone, realistic motion,
premium startup operations mood, stable camera, no text artifacts, no logo
artifacts, vertical 9:16.
```

Decision:

```text
Si Wan produce movimiento usable, usarlo como B-roll.
Si el concepto funciona pero el movimiento no es premium, recrear la toma en
Higgsfield.
```

## Checklist antes de cerrar una sesion GPU

1. Descargar outputs utiles.
2. Copiar prompts/config de los ganadores.
3. Borrar pruebas malas si ocupan demasiado.
4. Registrar costo aproximado.
5. Guardar decision final.
6. Apagar el Pod.
7. Confirmar que no quedo GPU corriendo.

## Fuentes base

- Wan2.2: https://github.com/Wan-Video/Wan2.2
- Wan2.2 licencia: https://github.com/Wan-Video/Wan2.2/blob/main/LICENSE.txt
- Qwen-Image: https://github.com/QwenLM/Qwen-Image
- FLUX: https://github.com/black-forest-labs/flux
- LTX-Video: https://github.com/Lightricks/LTX-Video
- HunyuanVideo 1.5: https://github.com/Tencent-Hunyuan/HunyuanVideo-1.5
- ComfyUI: https://github.com/comfy-org/comfyui
- LiteLLM: https://github.com/BerriAI/litellm
- Open WebUI: https://github.com/open-webui/open-webui
