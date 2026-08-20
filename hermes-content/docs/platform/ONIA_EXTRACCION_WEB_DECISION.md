# Extracción web para el alta de clientes — decisión

> **Fecha:** 2026-08-01 · **Estado:** DECIDIDO y PROBADO en el VPS
> **Pregunta:** ¿entra ScrapeGraphAI al stack de ONIA?
> **Respuesta: NO. No se instala nada. Crawl4AI (ya corriendo) + una llamada al
> gateway LiteLLM ya resuelven el caso, probado con 4 clínicas reales.**

Esto no es una recomendación teórica: la extracción está corrida contra sitios reales
de clínicas de Santa Cruz y el JSON de salida está pegado abajo como evidencia.

---

## 1. Qué corre HOY (verificado, no asumido)

Verificado por SSH en el VPS `187.77.16.63` el 2026-08-01:

| Pieza | Contenedor | Versión | Puerto | Estado |
|---|---|---|---|---|
| **Crawl4AI** | `onia_selfhosted-crawl4ai-1` | **0.9.0** | `127.0.0.1:11235` | healthy, 40 h |
| **LiteLLM** | `onia_selfhosted-litellm-1` | main-stable | `127.0.0.1:4000` | healthy, tope US$ 50/30d |
| SearXNG | `searxng` | latest | `127.0.0.1:8080` | up (búsqueda, para prospección) |

**Autenticación de Crawl4AI:** `Authorization: Bearer $CRAWL4AI_API_TOKEN`
(el header `X-API-Token` da 401 — no usarlo). El token vive en el env del contenedor.

**Modelos en LiteLLM:** `gpt-4o-mini`, `gpt-4.1-mini`, `o4-mini`. Gasto acumulado del
gateway al momento de la prueba: **US$ 0,2026** de US$ 50.

**Ya estaba decidido:** `PLAN.md:108` dice *"Crawl4AI para el alta por extracción"*.
Esta investigación confirma que esa línea es correcta y ahora está probada.

### Un detalle no obvio de Crawl4AI 0.9.0

El servidor **rechaza** que le mandes una `LLMExtractionStrategy` por HTTP:

```
HTTP 400 — "Rejected config: type 'LLMExtractionStrategy' may not be
             constructed from an untrusted request"
```

Es un endurecimiento de seguridad de 0.9.0, no un bug. **Consecuencia práctica: la
extracción con schema NO se pide dentro del `/crawl`.** El patrón correcto es en dos
pasos, y resulta ser mejor de todas formas:

1. `POST /md` → Crawl4AI hace lo difícil (browser real, JS, limpieza) y devuelve
   markdown limpio. **Gratis, sin LLM.**
2. Ese markdown va al gateway LiteLLM con `response_format: json_schema` (strict).
   **Una sola llamada.** El gasto queda medido y bajo el tope de US$ 50.

Que el LLM lo llamemos nosotros es una ventaja, no un rodeo: el prompt, el schema y el
costo quedan bajo nuestro control y bajo el gateway que ya mide y topea.

---

## 2. La prueba real — 4 clínicas de Santa Cruz

Script: `scripts/alta-por-extraccion.py` (commiteado, reproducible).

| Clínica | Markdown | Tokens in/out | Costo | Resultado |
|---|---|---|---|---|
| clinicadentalsanpedro.com.bo | 4.027 ch | 1.292 / 194 | US$ 0,000310 | 12 servicios, tel, dirección, horarios, email |
| clinicaimagina.com.bo | 2.377 ch | 770 / 125 | US$ 0,000190 | 4 servicios, descripción |
| odontoelitescz.com | 3.246 ch | 1.108 / 162 | US$ 0,000263 | 8 servicios, tel, 1 doctor |
| odontoking.com | 4.530 ch | 1.548 / 160 | US$ 0,000328 | 7 servicios, 4 tel, 4 doctoras |

**4 de 4 sin fallar. Total gastado en la prueba: US$ 0,001091.**
Tiempo: fetch 0,9-7,0 s + LLM 1,7-2,8 s ≈ **4-10 s por clínica.**

### JSON de salida real (Clínica Dental San Pedro)

```json
{
  "nombre": "Clínica Dental San Pedro",
  "descripcion": "Brindamos atención médica adecuada para adultos, personas mayores y niños.",
  "servicios": [
    "Odontopediatría", "Peridoncia", "Cirugía Maxilofacial", "Endodoncia",
    "Operatoria", "Ortodoncia y Ortopedia", "Implantología",
    "Armonizacíon Orafocail", "Rehabilitación Oral", "Estética Dental",
    "Laboratorio de Análisis Clínico", "Imagenología"
  ],
  "telefonos": ["591 75310054"],
  "direcciones": ["Horacio Sosa # 3085 entre 3er anillo Interno y Externo Santa Cruz."],
  "horarios": "08:00 - 12:00, 14:00 - 18:00 Lunes - Viernes; 08:00 - 14:30 Sábado",
  "email": "info@clinicadentalsanpedro.com.bo",
  "equipo": [],
  "precios": []
}
```

**Lo importante de este JSON no es lo que trajo, es lo que NO inventó.** `equipo` y
`precios` volvieron vacíos porque no están en esa página. Con `strict: true` en el
schema y la instrucción de no fabricar, el modelo devuelve `null` y `[]` en vez de
rellenar. Eso es exactamente lo que necesita un onboarding: **precargar lo que existe y
dejar el resto en blanco para que el dueño lo complete.**

Ejemplo de que sí extrae equipo cuando está publicado (odontoking.com):

```json
"equipo": [
  {"nombre": "Dra. Jacqueline Argote", "especialidad": null},
  {"nombre": "Dra. Sonia Roca",        "especialidad": null},
  {"nombre": "Dr. Angel Claure",       "especialidad": null},
  {"nombre": "Dra. Carolina Rojas",    "especialidad": null}
]
```

---

## 3. Por qué ScrapeGraphAI NO entra

La razón de fondo es una sola y es medible: **su principal valor agregado no aplica a
nuestro caso.**

ScrapeGraphAI existe para páginas que no entran en el contexto del modelo — parte el
texto en chunks y hace **N+1 llamadas al LLM** (una por chunk + una de merge). Las
páginas de clínica que medimos pesan **770 a 1.548 tokens**. Nunca necesitan chunking.
Estaríamos pagando la complejidad de un problema que no tenemos.

Y encima agregaría:

| Qué agregaría | Detalle |
|---|---|
| **Costo mayor** | N+1 llamadas ≥ 2 vs **1** nuestra. Mínimo el doble de tokens por el mismo dato |
| **Dependencias** | Python ≥3.12 + Playwright propio, duplicando el browser que Crawl4AI ya tiene |
| **Telemetría que no se puede apagar** | Issue [#1118](https://github.com/ScrapeGraphAI/Scrapegraph-ai/issues/1118): `SCRAPEGRAPHAI_TELEMETRY_ENABLED=false` no funciona. Inaceptable con URLs de clientes |
| **SSRF sin parchear** | Issue [#1115](https://github.com/ScrapeGraphAI/Scrapegraph-ai/issues/1115) en `FetchNode`. **Justo nuestro caso de uso es meterle una URL que da el cliente** — es la superficie de ataque exacta |
| **Truncado silencioso** | Issue [#1121](https://github.com/ScrapeGraphAI/Scrapegraph-ai/issues/1121): si no conoce el modelo, cae a 8192 tokens sin avisar |

Es un proyecto vivo y serio (MIT, v2.1.6 del 2026-07-20, ~28,9k estrellas). **No se
descarta por malo, se descarta por innecesario acá.**

### El MCP no es una opción gratis

`@ScrapeGraphAI/scrapegraph-mcp` **solo habla con la API cloud paga**: exige
`SGAI_API_KEY` y pega contra `https://v2-api.scrapegraphai.com/api`. No hay forma de
apuntarlo a la librería self-hosted. Descartado.

### La API cloud, si algún día se evaluara

Extract = 5 créditos. En plan Starter (US$ 20/mes) sale **US$ 0,01 por extracción**:
**37x más caro que nuestros US$ 0,00027**, más un piso de US$ 20/mes. El tier gratis son
500 créditos **por única vez** (≈100 extracciones, no se renuevan).
**Bloqueo para Sergio si alguna vez se quisiera: requiere cuenta y tarjeta. No se creó
ninguna cuenta ni se gastó un centavo en esta investigación.**

---

## 4. Cuánto cuesta el camino elegido

Medido, no estimado: **US$ 0,00027 promedio por página de clínica.**

| Escenario | Costo |
|---|---|
| 50 clínicas, 1 página c/u | **US$ 0,014** |
| 50 clínicas, 3 páginas c/u (home + servicios + contacto) | **US$ 0,041** |
| Tope mensual del gateway LiteLLM | US$ 50 |

Dar de alta las 50 clínicas cuesta **menos de 5 centavos de dólar**. El costo es
irrelevante frente a cualquier otra variable del proyecto; lo que importa es que quede
medido y bajo el tope, y lo está.

---

## 5. Lo que esto NO hace (leer antes de prometerlo)

Cuatro límites reales, encontrados probando, no supuestos:

1. **Facebook no funciona.** `facebook.com/<página>` devuelve un muro de login de 73
   caracteres: `"Explore the things you love. Log in to Facebook"`. **La mitad
   "o Facebook" del alta por extracción no existe.** Ninguna herramienta lo arregla sin
   violar el login, y eso está prohibido por regla de la casa. Si se quiere data de
   Facebook, el camino legítimo es la Graph API con el permiso del dueño de la página.

2. **Los precios casi nunca están.** `precios` volvió vacío en **4 de 4** clínicas: no
   los publican en la web. El onboarding **no puede depender de precargar precios** —
   ese dato lo tiene que cargar el dueño sí o sí.

3. **Un dominio caído devuelve `success: true`.** `esteticdent-santacruz.com` tiene el
   dominio vencido y el crawler trajo alegremente la página de Hostinger diciendo
   *"Your domain is expired"*. Por eso el script lleva un **gate de sanidad** (ya
   construido y probado, ver §7): si no salió ni un teléfono ni un servicio, o si
   detecta una página parking/login, marca el alta `ok: false` con el motivo en vez de
   precargar basura.

4. **Solo se probó la home.** Servicios y equipo suelen vivir en páginas internas. Para
   cobertura real hay que crawlear 2-3 páginas por clínica (que es el escenario de
   US$ 0,041 de arriba), no solo la portada.

---

## 6. Límite legal y ético (regla, no sugerencia)

- **Solo páginas públicas de negocios.** Nada detrás de login, nunca. El muro de
  Facebook se respeta, no se rodea.
- **Datos de empresa, no de personas.** Nombre comercial, servicios, horarios, teléfono
  y dirección del consultorio son datos comerciales publicados por el propio negocio.
  No se arman perfiles de personas ni se recolectan datos personales masivos.
- **El dato se le muestra al cliente para que lo confirme.** En el alta (caso a) el dato
  es *del propio cliente* y él lo valida antes de guardarse. Eso lo convierte en un
  autocompletado, no en un scrapeo.
- **Prospección (caso b): respetar `robots.txt` y no golpear.** Directorios públicos,
  volumen bajo, y el contacto inicial sigue necesitando aprobación del mensaje y del
  canal (regla vigente del agente de prospección).
- Nada de reventa de los datos extraídos.

---

## 7. Qué queda para usar

- **`scripts/alta-por-extraccion.py`** — el script probado. Toma URLs, devuelve el JSON
  del schema + tokens + costo real + el gate de sanidad. Lee `C4AI_TOK` y `LL_KEY` del
  entorno (sin secretos en el repo). Sin dependencias: solo stdlib de Python. Corre en el
  VPS, donde los dos servicios son loopback.
- **No se instaló nada nuevo.** No hay dependencia nueva que mantener, ni cuenta creada,
  ni centavo gastado fuera de los **US$ 0,001544** de las pruebas, que pasaron por el
  gateway con tope y quedaron registrados.

### El gate de sanidad, verificado

Corrida del script tal como quedó commiteado, con dos entradas malas a propósito:

| URL | `ok` | Motivos |
|---|---|---|
| clinicadentalsanpedro.com.bo | **true** | — |
| esteticdent-santacruz.com (dominio vencido) | **false** | sin servicios ni teléfonos · sin nombre · parking detectada: `domain is expired` |
| facebook.com/OdontoKingBolivia | **false** | página casi vacía (73 chars) · sin servicios ni teléfonos · sin nombre · login detectado: `log in to facebook` |

**Lo que falta para que el alta por extracción esté terminada** (fuera del alcance de
esta decisión): cablear el script al onboarding del producto y extender a 2-3 páginas
por clínica.

---

## Fuentes

- Verificación en vivo del VPS `187.77.16.63` (docker, `/health`, `/md`, `/crawl`, LiteLLM `/global/spend`), 2026-08-01.
- [ScrapeGraphAI/Scrapegraph-ai](https://github.com/ScrapeGraphAI/Scrapegraph-ai) · [PyPI](https://pypi.org/project/scrapegraphai/) · [scrapegraph-mcp](https://github.com/ScrapeGraphAI/scrapegraph-mcp) · [pricing](https://scrapegraphai.com/pricing)
- Issues citados: [#1115](https://github.com/ScrapeGraphAI/Scrapegraph-ai/issues/1115) SSRF · [#1118](https://github.com/ScrapeGraphAI/Scrapegraph-ai/issues/1118) telemetría · [#1121](https://github.com/ScrapeGraphAI/Scrapegraph-ai/issues/1121) truncado
- `hermes-content/docs/platform/PLAN.md:108`
