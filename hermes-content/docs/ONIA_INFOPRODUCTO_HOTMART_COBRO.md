# Infoproducto en Hotmart — qué cuesta cobrar, y por qué no es "caja rápida"

> **Doc vivo, sin fecha: se EDITA.** Nace del pedido de Sergio Urcullo del 2026-09-05: lanzar un
> infoproducto en Hotmart + Meta Ads durante un campamento de fin de semana (viernes **11-sep**)
> para generar caja mientras la plataforma avanza con los loops.
>
> **Todo lo de abajo se verificó contra fuentes públicas de Hotmart el 2026-09-05.** Lo que no se
> pudo confirmar está marcado 🟡 y dice cómo confirmarlo.

---

## 1. La premisa que sí es cierta

La plataforma **avanza sola**: 291 commits en `onia-platform` en 14 días, con features reales
(pantalla de Clientes, recibo imprimible, cupo, asistente). Los loops construyen.

Lo que los loops **no** hacen: grabar el curso, escribir los ads, atender compradores. Eso sale
de las horas de Sergio Urcullo, que es el recurso escaso (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §5).

## 2. Requisitos de Hotmart — verificados

| Requisito | Valor | Consecuencia para nosotros |
|---|---|---|
| **Edad mínima** | **18 años** (aceptar Términos declarando ser mayor) | 🔴 Sergio Urcullo es menor. **La cuenta tiene que ser de Leslie Mercado Moreno** |
| Validación de identidad | Documento **físico**; los digitales NO se aceptan | Documento de Leslie |
| Cuándo se piden los documentos | **Después de la primera venta** | Se vende primero y la plata queda retenida hasta que aprueben |
| Cuenta bancaria de cobro | Se registra recién tras aprobar documentos | A nombre del titular validado (Leslie) |
| Comisión | **9,9% + USD 0,50** por venta > USD 15 (USD 0,10 si ≤ 15) | |
| Microtransacciones | 20% si el precio es muy bajo | No bajar el precio para "probar" |
| Player de Hotmart | Cargo extra por venta si entregás video con su reproductor | Entregar por enlace propio sale más barato |
| Retiro mínimo | **USD 50** | |
| Tarifa de retiro | **USD 1** por solicitud | |
| Métodos de retiro | Payoneer, PayPal, transferencia bancaria local, Tarjeta Hotmart | 🟡 **falta confirmar si la transferencia local cubre Bolivia** |
| Garantía obligatoria | Elegís **7, 15, 21 o 30 días**. No se puede menos de 7 | El reembolso puede tardar 7 días más en procesarse |
| Retiro en monedas ≠ BRL | Desde **15 días** después de la venta, contando la garantía | |

## 3. La línea de tiempo real de la plata

```
vie 11-sep   campamento, se lanza
sáb 13-sep   primera venta
             → recién acá se habilita subir documentos (de Leslie)
~20-sep      vence la garantía mínima de 7 días
~28-sep      se habilita el retiro (15 días desde la venta)
             → además hay que haber acumulado USD 50
octubre      la plata entra, menos 9,9% + USD 0,50 por venta + USD 1 de retiro
```

**Lo que se vende en el campamento no se cobra en septiembre.** "Caja rápida" es, en el mejor
caso, caja de octubre.

Comparación con lo que ya existe: Onia cobra por **transferencia o QR** — la plata está el mismo
día, comisión 0 (`onia-pasarelas-pago-bolivia`).

## 4. La conclusión que cambia el plan

**Si el comprador es boliviano, Hotmart no aporta nada y cuesta caro:** 9,9%, 15 días de espera,
y una cuenta a nombre de un tercero que todavía tiene pendiente firmar la cuenta corriente de la
empresa (`ONIA_ESTRATEGIA_DE_EMPRESA.md` §6.2).

Un **QR + un enlace de entrega** cobra el mismo día, con comisión cero, y sin depender de una firma.

**Hotmart sí sirve para dos cosas concretas**, y conviene decidir por cuál se lo usa:
1. Vender **fuera de Bolivia** (checkout internacional con tarjeta).
2. Usar su **red de afiliados** para que otros vendan por comisión.

Si no es por una de esas dos, es fricción pagada.

## 5. Lo que sigue en pie del análisis

Del `ONIA_ESTRATEGIA_DE_EMPRESA.md` §10, el test de tres preguntas: un infoproducto **genérico**
falla las tres y es la línea de negocio N.º 10 con 0 clientes pagando.

**Pasa el test si el comprador es el mismo dueño de negocio boliviano que compra Onia.** Ahí la
lista de compradores es una lista de leads calificados que **pagaron por dártelos** — invierte el
costo de adquisición en vez de competir con el núcleo.

Y la guarda que no se negocia: **cola cero**. Entrega automática, sin comunidad, sin mentoría, sin
soporte prometido, y presupuesto de ads con tope y fecha de corte escritos antes de prender. El
fin de semana crea el activo; lo que dura para siempre es la cola.

## 6. Cómo se re-verifica

- Comisiones y tarifas → central de ayuda de Hotmart (buscar "tasas productor").
- 🟡 **Transferencia bancaria local a Bolivia** → hay que mirarlo con la cuenta abierta, o
  preguntarle a soporte de Hotmart. Es el único dato que faltó.
- Edad y documentos → Términos de Uso de Hotmart + "¿Qué documentos debo enviar?".

## 7. Documentos relacionados

`ONIA_ESTRATEGIA_DE_EMPRESA.md` (etapa vigente y test de tres preguntas) ·
`ONIA_LEADS_ESPERANDO.md` (los 7 que esperan) · `ONIA_LEGAL_BOLIVIA_ESTADO.md` (quién firma).
