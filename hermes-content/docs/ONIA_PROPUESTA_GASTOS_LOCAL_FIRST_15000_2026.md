# Propuesta de gastos ONIA local-first 2026

Fecha: 2026-06-23.
Responsable: Sergio / ONIA.
Capital familiar disponible: Bs. 15.000.
Enfoque: operar con servidor local para reducir gasto de VPS, sin comprometer
seguridad, ventas ni continuidad.

## Resumen para presentar

ONIA puede reducir o pausar el VPS si usamos un servidor local como centro de
operacion interno. La idea no es apagar todo y depender a ciegas de la casa. La
idea es separar:

```text
Servidor local = trabajo pesado, IA, video, desarrollo, datos internos y backups.
Servicios publicos = solo lo minimo necesario, con tunnel seguro o VPS pequeno si hace falta.
```

Si queremos ahorrar el VPS por ahora, se puede. Pero hay una condicion: ONIA
Center, Supabase, n8n, Cal.com, Remotion, Open WebUI, Dify y los workers de IA
deben correr en privado, con backups y acceso controlado. Lo publico para
clientes o vendedores solo debe exponerse cuando haya autenticacion, roles y
seguridad.

## Decision recomendada

Usar una estrategia local-first por 30 dias:

1. Mantener todo lo interno en servidor local.
2. Pausar o bajar el VPS si el panel no necesita estar publico 24/7.
3. Usar Cloudflare Tunnel o Tailscale para acceso privado cuando sea necesario.
4. No alojar datos sensibles publicamente desde casa sin autenticacion real.
5. Reinvertir el ahorro del VPS en backups, UPS, almacenamiento y ventas.

La prioridad no es tener mas servidores. La prioridad es vender, registrar todo y
no perder informacion.

## Que puede correr localmente

| Sistema | Puede ir local | Observacion |
|---|---:|---|
| ONIA Center | Si | Uso interno de Sergio y equipo aprobado. |
| Supabase self-hosted | Si | Necesita backups diarios y no exponer service_role. |
| n8n | Si | Ideal para automatizaciones internas y jobs privados. |
| Cal.com | Si | Mejor privado al inicio; publico solo con dominio/tunnel estable. |
| Chatwoot | Si | Puede ir local, pero para WhatsApp/cliente publico conviene endpoint estable. |
| Remotion video editor | Si | Perfecto local: renderiza videos sin pagar servidor cloud. |
| Open WebUI/Ollama | Si | Debe correr local, no en VPS pequeno. |
| Dify | Si | Local si hay RAM suficiente; no levantar si vuelve lenta la maquina. |
| LiteLLM | Si | Util para controlar modelos y costos por centro. |
| Stirling PDF | Si | Herramienta interna local. |
| Crawl4AI/Browser Use | Si | Mejor como worker local controlado. |
| Uptime Kuma | Si | Para vigilar servicios locales y externos. |

## Lo que no conviene poner 100% local todavia

| Frente | Riesgo si va solo local | Control |
|---|---|---|
| Portal publico de vendedores | Si se cae internet/luz, no entran. | Usar solo interno hasta Auth/RLS. |
| WhatsApp/chat de clientes | Necesita disponibilidad y webhooks estables. | VPS pequeno o tunnel estable cuando haya clientes. |
| Pagos, checkout o formularios criticos | Caida local puede perder ventas. | Usar proveedor externo o VPS minimo. |
| Datos sensibles sin cifrado | Riesgo si se expone la red. | VPN/tunnel, backups cifrados, nada de puertos abiertos. |
| IA pesada 24/7 | Consume luz, RAM, CPU/GPU y puede romper estabilidad. | Workers por cola, horarios y limites. |

## Presupuesto propuesto de Bs. 15.000

| Bolsa | Monto | Uso especifico |
|---|---:|---|
| Deuda operativa | Bs. 2.414,49 | Limpiar presion inicial y empezar con control. |
| Reserva herramientas 2 meses sin VPS | Bs. 5.460,00 | Codex, Higgsfield, Claude, Google Workspace, Google Photos. |
| Servidor local, backups y energia | Bs. 1.650,00 | UPS/regulador, SSD/disco backup, cableado, mantenimiento, cooling o RAM/SSD si aplica. |
| Ventas, demos y adquisicion | Bs. 1.300,00 | Landings, propuestas, llamadas, pauta chica, dominios o activos para cerrar clientes. |
| Nuvia productos y contenido | Bs. 1.500,00 | Productos piloto, muestras, empaques, transporte y piezas de venta. |
| Higgsfield y produccion IA comercial | Bs. 1.365,00 | Un mes de generacion de videos/ads para ONIA, Nuvia y demos de clientes. |
| ONIA Production Studio minimo | Bs. 900,00 | Luz, microfono/lavalier, tripode, props, fondo o soporte de celular. |
| Contingencia controlada | Bs. 410,51 | Imprevistos aprobados, comisiones, transporte o soporte puntual. |
| Total | Bs. 15.000,00 | Capital completo asignado. |

## Diferencia contra mantener VPS

Gasto mensual registrado actual:

| Herramienta | Monto mensual |
|---|---:|
| Codex Pro | Bs. 1.050,00 |
| Higgsfield Ultra | Bs. 1.365,00 |
| Claude Code Pro | Bs. 210,00 |
| Google Workspace | Bs. 84,00 |
| Google Photos | Bs. 21,00 |
| VPS Hostinger | Bs. 220,50 |
| Total con VPS | Bs. 2.950,50 |

Si pausamos el VPS:

| Concepto | Monto mensual |
|---|---:|
| Herramientas sin VPS | Bs. 2.730,00 |
| Ahorro mensual VPS | Bs. 220,50 |
| Ahorro aproximado 3 meses | Bs. 661,50 |

Lectura: el ahorro del VPS ayuda, pero no resuelve todo. El gasto fuerte real es
IA y produccion: Codex + Higgsfield. Por eso Higgsfield debe producir anuncios,
demos, assets de Nuvia o videos vendibles, no pruebas sueltas.

## Nuvia: uso especifico del dinero

Nuvia no debe comprar inventario por emocion. Debe comprar por margen,
contenido y velocidad de venta.

Bolsa Nuvia propuesta: Bs. 1.500.

| Uso | Monto maximo | Regla |
|---|---:|---|
| Producto piloto de alta rotacion | Bs. 750 | Solo si costo proveedor permite margen bruto minimo 40%. |
| Producto premium para ticket alto | Bs. 300 | Elegir 1-2 productos con buen precio de venta y contenido atractivo. |
| Muestras/kit de contenido | Bs. 150 | Para fotos, reels, demostraciones y bundles. |
| Bolsas, etiquetas y embalaje | Bs. 150 | Costo directo del lote, no gasto invisible. |
| Transporte/logistica | Bs. 100 | Registrar por lote o campana. |
| Reserva por devolucion/error | Bs. 50 | No repartir hasta cerrar lote. |

Productos del catalogo Nuvia con precio de venta alto que sirven para analizar,
no para comprar a ciegas:

| Producto | Marca | Precio venta preparado |
|---|---|---:|
| Ncef Revitalize | FILORGA | Bs. 712,80 |
| Ncef Revitalize Serum | FILORGA | Bs. 712,80 |
| Global Repair Advance Elixir | FILORGA | Bs. 693,00 |
| Global Repair Advance | FILORGA | Bs. 668,25 |
| Time Filler Intensive | FILORGA | Bs. 660,00 |
| Isdinceutics Melaclear Advanced 30ML | ISDIN | Bs. 561,00 |

Regla: estos precios son precios de venta preparados en el catalogo. Falta costo
proveedor real. Sin costo real, no se compra ni se promete margen.

## Higgsfield: gasto especifico y control

Higgsfield Ultra esta registrado como gasto mensual de Bs. 1.365.

Debe dividirse por centro:

| Centro | Limite recomendado | Uso |
|---|---:|---|
| ONIA ventas/demos | 40% | Videos para vender webs, automatizaciones, chatbots y Motor Local Growth. |
| Nuvia | 20% | Ads de producto, UGC, demostraciones y catalogo visual. |
| ONIA Media/clientes | 30% | Piezas cobrables o muestras para cerrar paquetes audiovisuales. |
| Investigacion | 10% | Pruebas controladas, no experimentos ilimitados. |

Reglas:

- Si Higgsfield se usa para Nuvia, se prorratea como costo de Nuvia.
- Si se usa para un cliente, se cobra dentro del proyecto o como costo directo.
- Si una pieza no se publica, no vende ni sirve como demo, queda marcada como
  aprendizaje o perdida.
- No subir de plan ni comprar creditos extra sin venta, cliente o campana
  aprobada.

## Remotion: modulo local de edicion automatizada

Remotion conviene local porque permite crear plantillas de video programables:

- videos de productos Nuvia;
- videos cortos de anuncios;
- reels con subtitulos;
- demos de webs;
- reportes animados;
- piezas para vendedores;
- videos de antes/despues de auditorias.

Costo directo inicial: Bs. 0 si usamos el servidor/local PC actual.

Gastos asociados:

| Necesidad | Presupuesto | Motivo |
|---|---:|---|
| Almacenamiento local | Incluido en servidor/backups | Render y assets ocupan espacio. |
| Plantillas Remotion | Tiempo interno | Se crean una vez y se reutilizan. |
| Worker de render | Local | Evita pagar cloud hasta tener volumen. |
| Revision humana | Obligatoria | No publicar video IA sin control de marca. |

## Servidor local minimo

Si ya existe una PC/laptop que se pueda dejar encendida, no comprar servidor
grande todavia. Primero estabilizar:

| Compra | Rango razonable | Prioridad |
|---|---:|---|
| UPS/regulador | Bs. 450-700 | Alta |
| SSD/disco backup | Bs. 500-900 | Alta |
| RAM/SSD interno si aplica | Bs. 400-900 | Media |
| Limpieza/cooling/mantenimiento | Bs. 150-300 | Media |
| Cable/red/soporte | Bs. 100-250 | Media |

No comprar ahora:

- workstation grande;
- GPU cara;
- servidor rack;
- MacBook;
- NAS caro;
- PC completa si la actual todavia aguanta.

## Operacion 100% local: condiciones

Podemos operar 100% local si aceptamos estas reglas:

1. Uso interno primero, no portal publico masivo.
2. Backups diarios locales y semanales fuera de la maquina.
3. Acceso externo solo por tunnel/VPN, no por puertos abiertos.
4. Nada de service_role en frontend.
5. UPS/regulador para internet y servidor.
6. Plan de emergencia: si cae la casa, se levanta un VPS temporal.
7. Datos de clientes con permisos, cifrado y auditoria.

Si estas condiciones no se cumplen, el ahorro del VPS puede salir caro.

## Plan de 30 dias

Semana 1:

- migrar ONIA Center a modo local-first;
- configurar backups;
- activar Remotion local;
- cargar presupuesto y gastos en ONIA Center;
- definir 20 leads y 3 ofertas vendibles.

Semana 2:

- producir 3 demos con Higgsfield/Remotion;
- preparar 1 demo Nuvia;
- vender auditorias, webs y Motor Local Growth;
- registrar cada gasto por centro.

Semana 3:

- probar Cal.com local/tunnel;
- revisar si Chatwoot/WhatsApp necesita endpoint estable;
- medir si el servidor local aguanta.

Semana 4:

- decidir si VPS queda pausado, reducido o como fallback;
- revisar ventas cobradas;
- congelar gastos que no produjeron venta, demo o mejora.

## Que le diria a tu padre

No estamos pidiendo dinero para comprar equipos caros. Estamos usando Bs. 15.000
como capital controlado para que ONIA opere 60-90 dias, venda, produzca demos y
reduzca gastos fijos moviendo lo interno a un servidor local.

El gasto se controla por centros: ONIA, Nuvia, Higgsfield/Media, servidor local,
ventas y contingencia. Si algo no genera ventas, ahorro o evidencia, se pausa.

El objetivo de los primeros 30 dias no es aparentar empresa grande. Es tener:

- sistema interno funcionando;
- gastos registrados;
- videos/demos listos;
- Nuvia con margen real;
- ofertas vendibles;
- ventas cobradas;
- servidor local estable;
- cero compras grandes sin retorno.

## Pendiente antes de gastar

Antes de comprar productos o equipo:

1. Confirmar si el servidor local sera PC actual, laptop o equipo heredado.
2. Confirmar RAM, CPU, disco y si puede quedar encendido.
3. Confirmar costo proveedor real de productos Nuvia.
4. Confirmar si Hostinger se pausa, baja de plan o queda como fallback.
5. Configurar backups antes de mover datos criticos.
6. Definir quien puede entrar a ONIA Center y que puede ver.

## Fuentes internas

- `FINANCE_LOG_2026.md`
- `hermes-content/docs/ONIA_INTERNAL_CAPITAL_ALLOCATION_2026.md`
- `hermes-content/docs/ONIA_NUVIA_ACCOUNTING_MODEL_2026.md`
- `hermes-content/docs/ONIA_SUSTAINABILITY_DASHBOARD_SPEC_2026.md`
- `hermes-content/deploy/selfhosted/ONIA_CENTER_RUNTIME_STATUS_20260622.md`
- `web-factory/data/clients/nuvia.json`

## Fuentes externas revisadas

- Hostinger VPS pricing: https://www.hostinger.com/vps-hosting
- Cloudflare Tunnel docs: https://developers.cloudflare.com/cloudflare-one/networks/connectors/cloudflare-tunnel/
- Tailscale pricing: https://tailscale.com/pricing
- Higgsfield pricing: https://higgsfield.ai/pricing
