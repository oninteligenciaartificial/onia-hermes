# hermes-content/recursos/

Recursos empaquetados y listos para enviar por DM cuando alguien responde a la palabra clave
de un post/reel (ciclo comentario→DM). Cada archivo de acá es contenido final para el
prospecto — no un borrador ni una nota de trabajo interno.

No confundir con:
- `hermes-content/carousels/` — el motor que RENDERIZA piezas (briefs JSON → PNG on-brand).
- `hermes-content/propuestas/` — propuestas comerciales personalizadas por cliente.
- `hermes-content/references/` — análisis e investigación (no se envía a nadie).

Cada recurso nuevo debe:
- estar atado a una palabra clave concreta. Hoy solo hay dos vigentes: **SISTEMA** y
  **LISTA** (ver `docs/historial/ONIA_CRONOGRAMA_CONTENIDO_20260814.md` §0). No sumar una tercera sin
  revisar ese doc primero — el punto de tener solo dos es que se recuerden sin anotar.
- decir de qué pieza/ciclo sale y linkear el doc del ciclo en `docs/`.
- citar la fuente del contenido que empaqueta. No se fabrica contenido acá: se empaqueta lo
  que ya existe en el repo, en lenguaje de cliente.

| Recurso | Palabra clave | Ciclo | Se manda cuando |
|---|---|---|---|
| `checklist-seguridad-ia-10-puntos.md` | SISTEMA | `docs/historial/ONIA_CICLO_COMENTARIO_DM_20260815.md` | Alguien comenta SISTEMA en el reel del checklist de seguridad |
| `lista-por-donde-empezar.pdf` | **LISTA** | `contenido/ONIAHQ.md` | Alguien comenta LISTA en cualquier pieza de `@oniahq` |

## `lista-por-donde-empezar` — cómo se hizo y por qué así

**Fuente del HTML:** `lista-por-donde-empezar.html`. Se re-genera con Edge/Chrome headless,
el mismo motor que usa el generador de propuestas (`printPdf`):

```bash
node -e "const{execFileSync}=require('child_process'),p=require('path'),os=require('os');
execFileSync('C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe',
['--headless=new','--disable-gpu','--user-data-dir='+p.join(os.tmpdir(),'onia-pdf-'+Date.now()),
'--print-to-pdf='+p.resolve('hermes-content/recursos/lista-por-donde-empezar.pdf'),
'--no-pdf-header-footer','--virtual-time-budget=8000',
p.resolve('hermes-content/recursos/lista-por-donde-empezar.html')],{stdio:'ignore'})"
```

**⚠️ El alto A4 está fijado a mano** (`html,body{height:297mm;overflow:hidden}`). Sin eso el
padding inferior empuja una segunda página en blanco — pasó, y el conteo de páginas lo delató.
Como el `overflow:hidden` puede cortar en silencio, **al editar el contenido hay que volver a
mirarlo**, no solo contar páginas:

```bash
# captura a A4 exacto (794x1123 @96dpi) para ver si algo quedó fuera
--window-size=794,1123 --screenshot=preview.png
```

**Dos reglas del catálogo que le dieron la forma** (`propuestas/ONIA_CATALOGO_PRECIOS_2026.md`):

- **Regla 0 — "no hay precio fijo de lista".** Por eso NO es una lista de precios: es un
  checklist de prioridad con *anclas de referencia*, que es lo que el catálogo sí autoriza.
- **Regla 6 — "prometer solo alcance confirmado".** Por eso el chatbot de WhatsApp **no se
  ofrece**: aparece en "lo que va aparte", diciendo que Meta cobra y que la habilitación
  depende de ellos. En producción las 4 variables de WhatsApp siguen en `SIN_CONFIGURAR`.

**Precios usados, todos del catálogo, ninguno inventado:** Onia Dental Básico 320/mes ·
Landing de Captación 790 · Automatización simple n8n 790 · Recall y Cobrador *incluidos*
desde el plan Profesional · diagnóstico **gratis** (regla 7: es gancho, no se cobra).
