# Skill: Guiones Diarios ONIA

Usar esta skill cuando Sergio pida los guiones del dia, contenido para hoy,
ideas para grabar, o diga `Guiones Hoy`, `Guiones ONIA`, `Contenido de hoy` o
`Que grabo hoy`. Tambien la ejecuta el cron `ONIA - Guiones Diarios`.

Objetivo: cada dia entregar 3 guiones listos para producir para el contenido
propio de ONIA (no de cliente), basados en tendencias reales, la voz de ONIA y
los formatos que ya funcionan. Salida accionable, no ideas vagas.

## Flujo (obligatorio, en orden)

### 1. Radar antes de escribir
Aplicar `radar-creativo-onia` + `tendencias-ia-redes`: revisar tendencias
actuales de IA, automatizacion, negocios y formato viral (SearXNG local; Tavily
si hay key). Extraer principios, no copiar identidad de creadores. Si una fuente
no responde, decirlo y usar el pilar de contenido evergreen.

### 2. Elegir pilares del dia
ONIA vende IA practica para negocios de Bolivia. Rotar entre estos pilares para
no repetir angulo:
- **Dolor real**: un proceso manual que pierde plata/tiempo (leads sin
  responder, agenda a mano, cobros olvidados) y como la IA lo resuelve.
- **Antes/Despues**: negocio sin sistema vs con ONIA (sin inventar metricas).
- **Caso de uso concreto**: chatbot que califica, web que capta, automatizacion
  que agenda.
- **Educativo/mito**: que si y que no puede hacer la IA hoy para una pyme.
- **Detras de escena**: como ONIA construye (autoridad, confianza).
- **Autoridad Sergio**: fundador joven construyendo el sistema (usa
  `marca-personal-sergio`; cara/voz IA solo con aprobacion).

### 3. Escribir 3 guiones listos
Cada guion, en este formato exacto:

```text
GUION N — [Pilar] — [Formato: Reel / Carrusel / Historia]
Gancho (0-3s):
Desarrollo (bullets o beats):
Cierre + CTA:
Texto en pantalla:
Prompt visual / escenas:  (herramienta segun orquestador-creativo-ia)
Voz/tono:  (ONIA: claro, directo, sin humo, sin guru)
Duracion / formato objetivo:
```

- 1 Reel (video), 1 Carrusel (usa `carruseles-onia` para el brief), 1 Historia o
  formato corto, salvo que Sergio pida otra mezcla.
- Enganchar en los primeros 3 segundos. CTA que mueva a DM, comentario o link.

### 4. Cierre accionable
```text
Guion recomendado para hoy:
Siguiente comando: (ej. "Genera Reel ONIA: <tema>" o "Flujo carrusel: <slug>")
Aprobacion necesaria: (nada se publica sin OK de Sergio)
```

## Variantes
- `Guiones Hoy: <tema>` — sesga los 3 al tema/rubro dado.
- `Guiones Hoy carrusel` — los 3 como carruseles.
- `Un guion` — solo el mejor guion del dia + cierre.

## Reglas duras (de orquestador-creativo-ia y radar)
- No inventar testimonios, metricas, resultados, precios ni claims. Antes/despues
  sin numeros falsos.
- Inspiracion estructural de referencias; nunca copiar voz, frases, musica o
  identidad de creadores.
- Cara/voz IA de Sergio: solo con aprobacion por pieza. Nada client-facing ni
  publicado sin OK explicito.
- Beauty/skincare y claims sensibles: lenguaje seguro.
- El guion propone y prepara; producir solo si Sergio dice "genera/produce".

## Encadena con
- Produccion: `orquestador-creativo-ia`, `flujo-completo-carrusel`,
  `video-lab-higgsfield`.
- Publicacion (con aprobacion): `instagram-publicacion`,
  `descripciones-sociales-onia`.
- Orquestacion diaria: ver `hermes-content/docs/historial/orquestacion-vieja/ONIA_CONTENT_FACTORY_ORCHESTRATION_2026.md`.
- Automatizacion: workflow `onia-guiones-diarios.json`. AUTONOMO, nada local:
  cron -> LLM gestionado (credencial n8n) con este prompt inline -> Telegram para
  aprobar. No depende de ONIA Center ni de SearXNG local.
