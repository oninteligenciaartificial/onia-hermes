# n8n -> Higgsfield Generation Flow

## Objetivo
Usar n8n como router de referencias y aprobaciones para que Higgsfield genere
videos con mejor contexto y sin saltarse controles.

## Principio
Hermes decide la estrategia. n8n junta datos, agenda, espera aprobacion y
registra. Higgsfield genera. Instagram publica solo despues de aprobacion.

## Workflow: ONIA - Higgsfield Reference Router

### Trigger

Opciones:

- Telegram: `Preparar Higgsfield <job_id>`
- Dashboard: boton "Preparar generacion"
- Schedule: revisar jobs `approved_for_generation`

### Inputs

- `job_id`
- rubro
- cuenta: Sergio, ONIA o cliente
- objetivo
- oferta
- assets aprobados
- referencias publicas
- restricciones

### Pasos

1. Leer job de `/root/.hermes/video-lab/jobs/<job_id>.json`.
2. Leer biblioteca `/root/.hermes/references/higgsfield-content-use-cases.json`.
3. Seleccionar rubro y formato.
4. Verificar aprobacion:
   - si `state != approved_for_generation`, detener y pedir aprobacion.
5. Construir paquete:
   - hook;
   - script;
   - scenes;
   - visual style;
   - audio style;
   - CTA;
   - references;
   - approved assets;
   - safe claims;
   - forbidden claims;
   - negative prompt;
   - output format.
6. Enviar resumen a Telegram.
7. Si Sergio confirma, enviar a Higgsfield manual/MCP.
8. Si Higgsfield devuelve URL, guardar con:

```bash
video-lab mark_generated <job_id> --video-url <public_mp4_url>
```

9. Registrar:
   - URL;
   - creditos/costo si existe;
   - fecha;
   - variante elegida;
   - estado `generated`.
10. Notificar para revision.

## Paquete para Higgsfield

```json
{
  "lane": "sergio|onia|client",
  "industry": "",
  "format": "ugc|demo|talking_head|product_ad|story|cinematic",
  "aspect_ratio": "9:16",
  "duration_seconds": 35,
  "hook": "",
  "script": "",
  "scenes": [],
  "visual_style": {},
  "audio_style": {},
  "references": [],
  "approved_assets": [],
  "safe_claims": [],
  "forbidden_claims": [],
  "negative_prompt": "No copyrighted logos unless provided. No third-party likeness. No fake testimonials. No fake results. No private data. No misleading medical, financial or legal claims. No generated Sergio face unless explicitly approved. No placeholder text.",
  "cta": "",
  "approval_required": true
}
```

## Cuando NO usar n8n

No hace falta para un video aislado si Sergio y Codex estan operando juntos.
En ese caso:

```text
brief -> aprobar -> Higgsfield manual -> URL -> review -> publicar
```

## Cuando SI usar n8n

- muchos videos por semana;
- varias cuentas;
- muchos clientes;
- referencias y assets por rubro;
- aprobaciones por Telegram;
- tracking de costos;
- calendario;
- recordatorios;
- polling de Higgsfield.

## Limites

- n8n no contacta prospectos sin aprobacion.
- n8n no publica sin aprobacion.
- n8n no inventa assets ni referencias.
- n8n no usa WhatsApp automatico hasta verificacion Meta.
- n8n no usa cara/voz de Sergio sin aprobacion.
