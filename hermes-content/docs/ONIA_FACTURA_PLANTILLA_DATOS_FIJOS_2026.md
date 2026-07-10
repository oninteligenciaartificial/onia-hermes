# ONIA — Plantilla para facturar manual (Portal Web SIAT) 2026-07-10

Helper para llenar cada factura en el Portal Web del SIN en ~30 seg. **No es el emisor
automático** (eso es otro carril, en desarrollo) — esto es para facturar a mano mientras tanto.
Ruta: SIAT → Sistema de Facturación → Facturación Portal Web en Línea → Emisión Factura Compra Venta.

## Datos del emisor (fijos, ya los trae el SIAT)
- **NIT:** 5371375010 · **Razón Social:** LESLIE MERCADO MORENO · **Dependencia:** Gerencia Distrital Santa Cruz II
- **Dato de la Sucursal:** `0 - Casa Matriz` (seleccionar en el dropdown).

## Qué ACTIVIDAD elegir según lo que cobrás (regla: debe coincidir con el servicio)
| Si cobrás… | Actividad – código |
|---|---|
| Web / landing / página | **Portales web – 6312000** |
| Software / sistema / SaaS / licencia (DentaGest, GestiOS, dashboards) | **Venta al por mayor de programas de informática – 4651200** (Principal) |
| Automatización / chatbot / hosting / integración / "en la nube" | **Servicios Tecnológicos de Gestión y Procesamiento en la Nube – 6209920** |
| Publicidad / ads / manejo de redes / contenido | **Publicidad Digital y Marketing en Redes Sociales – 7310100** |
| Capacitación / curso | **Enseñanza en informática – 8549100** |

## Casos Especiales
- Cliente normal (con NIT/CI) → **Ninguna**.
- Venta chica sin datos del cliente / consumidor final → **99003 (Ventas Menores)** → cliente "S/N".
- Cliente extranjero no inscrito → **99001**.

## Cliente
- **Tipo Documento:** NIT (empresa) · CI (persona) · CEX (extranjero).
- **N° Documento/NIT** → botón **"Buscar Cliente"** (autocompleta la razón social).
- **Correo del cliente** → para que le llegue el PDF/XML.

## Detalle (líneas de la factura)
- **Descripción:** clara y real, ej.: "Desarrollo de sitio web profesional" · "Licencia mensual
  DentalGest" · "Automatización de WhatsApp / n8n" · "Gestión de redes y publicidad".
- **Cantidad:** normalmente 1. **Precio unitario:** el **monto REAL cobrado en Bs** (el IVA va
  "por dentro"; el SIAT calcula el 13%).
- **Código de producto/servicio SIN (homologación):** elegí el del catálogo que corresponda al
  rubro. ⚠️ Confirmar en el catálogo del SIAT (para servicios suele haber un genérico por actividad).

## Leyendas
Las genera el **SIN automáticamente** en Portal Web — **no las escribís vos**.

## Después de emitir
1. El SIAT genera **PDF + XML** y se los manda al cliente. Guardá copia.
2. **Registrá el ingreso** en el sistema: `income-insert` (o pasámelo) → caja + postura fiscal
   (IVA débito/IT) se actualizan solas.
3. Ver lo emitido: **Monitoreo y Reportes → Ventas del Día**.

## Notas
- Toda factura emitida es **REAL** (genera IVA débito 13% + IT 3%). No emitir de prueba.
- Los **precios** reales salen de la lista comercial vigente (no se fijan acá — es decisión del
  carril comercial). Esto solo ayuda a **llenar** la factura rápido.
- El **emisor automático** (facturar desde ONIA Center/DentaGest/GestiOS sin entrar al SIAT) es
  la modalidad Computarizada en Línea — otro carril, requiere registro + 90 días de pruebas.
- No es asesoría contable definitiva; validar homologación y casos borde con contador matriculado.
