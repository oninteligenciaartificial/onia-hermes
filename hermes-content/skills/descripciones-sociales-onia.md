# Skill: descripciones-sociales-onia

## Objetivo

Crear y revisar descripciones/copy por plataforma para videos, carouseles y
campanas de ONIA, Sergio y clientes.

## Regla base

Cuando Sergio diga "descripcion de IG", usar `instagram_caption`.

Instagram Graph API y `ig-publish` llaman a ese texto `caption`.

```bash
ig-publish reel_publish --video-url "<url_video>" --caption "<instagram_caption>"
```

## Paquete requerido

Cada pieza debe poder producir:

```json
{
  "instagram_caption": "",
  "tiktok_description": "",
  "youtube_title": "",
  "youtube_description": "",
  "youtube_tags": [],
  "linkedin_copy": ""
}
```

## Formula Instagram

```text
[hook o cambio de creencia]

[problema/contexto en 1-2 lineas]

[mecanismo/oferta]

[CTA unico]

[3-8 hashtags relevantes]
```

## Formula TikTok

```text
[frase corta que acompana el hook]
[CTA suave o pregunta]
[2-5 hashtags nativos]
```

No usar hashtags genericos en exceso.

## Formula YouTube Shorts

Title:

```text
[resultado o tension principal en menos de 70 caracteres]
```

Description:

```text
[resumen breve]

[CTA]

[links aprobados si existen]

[hashtags]
```

## Formula LinkedIn

```text
[observacion profesional]

[contexto o aprendizaje]

[mecanismo/proceso]

[pregunta o CTA]
```

## Voz por cuenta

Sergio:

- primera persona;
- practico;
- construyendo en publico;
- sin tono de guru;
- CTA: "escribeme tu rubro", "demo", "te muestro el sistema".

ONIA:

- claro;
- educativo;
- orientado a sistemas, seguimiento y conversion;
- CTA: auditoria, demo, diagnostico o idea de contenido.

Cliente:

- seguro para marca;
- oferta aprobada;
- claims aprobados;
- sin promesas medicas, financieras o de resultados garantizados.

## Seguridad

- No inventar resultados.
- No exponer datos de clientes.
- No usar urgencia falsa.
- No mencionar WhatsApp automation hasta que exista verificacion de negocio.
- No publicar nada sin aprobacion explicita.

## Referencias

- `/root/.hermes/docs/CROSS_PLATFORM_PUBLISHING.md`
- `/root/.hermes/references/social-caption-template.json`
