# Conectar las webs de cliente AL sistema — tarea abierta

> Pedido de Sergio (2026-08-18): "quiero que toques cómo podemos conectar páginas webs a
> los sistemas; hacé la misma prueba con Bolivian Electric, en el repositorio tenemos
> absolutamente todo". Anotado como TAREA para no perderlo; se ejecuta cuando haya cupo
> de agentes (la API está rechazando por sobrecarga).

## Por qué importa (el argumento de venta)

Hoy vendemos "web" y "sistema" como dos cosas. Conectadas valen el doble y **nadie en
Santa Cruz lo ofrece**: el competidor Forges vende sistemas a medida SIN web; las
agencias venden webs SIN sistema. Onia puede vender **la web que alimenta el sistema**:
lo que pasa en la web (cotización, reserva, pedido, formulario) entra como dato al
panel, y lo que hay en el panel (catálogo, horarios, precios) sale a la web sin
copiar/pegar.

## Los 4 circuitos a construir (de más fácil a más difícil)

| # | Circuito | Dirección | Estado hoy |
|---|---|---|---|
| 1 | **Formulario → lead en el sistema** | web → sistema | **YA EXISTE** el precedente: `forms.onia.com.bo/alta` guarda en `onia_center.leads` vía n8n. Falta generalizarlo por cliente |
| 2 | **Catálogo del sistema → web** | sistema → web | El producto ya tiene catálogo por org (productos/tratamientos) y endpoint server-to-server con Bearer (`/api/chatbot-knowledge/published` es el patrón probado). Falta el endpoint de catálogo público + consumo en la web |
| 3 | **Reserva desde la web → agenda** | web → sistema | El producto tiene booking público (add-on) con magic-link. Falta el widget embebible para la web del cliente |
| 4 | **Pedido web → cobro** | ambas | Depende del QR del BCP (trámite abierto). El bot ya arma pedidos; la web podría hacer lo mismo |

## Bolivian Electric — el laboratorio

Repo: `C:\dev\clientes\Bolivian Electric` — `apps/web/` (Next.js), `docs/` (context,
operations, product, technical), `data-samples/`, `infra/`, `scripts/`.
**Verificado 2026-08-18: NO tiene ninguna referencia a Onia ni al sistema** — la web
vive sola. Es el caso de prueba perfecto: cliente real, repo completo, y hoy
desconectado.

**Prueba propuesta** (una TAREA ÚNICA cuando se ejecute):
1. Leer `docs/` de Bolivian Electric para entender qué datos maneja (productos
   eléctricos, cotizaciones, clientes B2B).
2. Elegir UN circuito — el #1 (formulario → lead) por ser el de menor riesgo y el que ya
   tiene precedente funcionando.
3. Construirlo end-to-end: form en su web → endpoint autenticado → fila en el sistema →
   visible en el panel. Con el mismo patrón Bearer server-to-server que ya probamos.
4. Medir qué se reusó y qué hubo que escribir: eso define si el "pack web+sistema" es
   vendible como producto o es trabajo a medida cada vez.

## Reglas para cuando se ejecute

- **Carriles**: Bolivian Electric es repo separado (cliente real, deploy propio) →
  paralelo libre respecto de onia-platform. Nunca mezclar árboles.
- **Nada de credenciales en la web del cliente**: el navegador jamás lleva el Bearer;
  la escritura va por un endpoint del lado servidor (patrón ya usado en el chatbot).
- **No prometer al cliente lo que no esté encendido y verificado en prod.**
