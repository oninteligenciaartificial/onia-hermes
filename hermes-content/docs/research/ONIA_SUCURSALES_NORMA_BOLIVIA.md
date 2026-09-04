# Sucursales y puntos de venta — lo que exige la norma boliviana

**Para qué sirve este doc:** es la especificación de la *sucursal fiscal* de Onia. Se
investigó el 2026-08-25 contra las fuentes del SIN, no contra memoria.

> **Estado: es la spec de la Fase B, no de lo que se construyó.** La Fase A encendió el
> **almacén** (que NO es una sucursal). Ver §5.

---

## 1. Sucursal ≠ punto de venta ≠ depósito

Son tres cosas distintas y el SIN las trata distinto. Confundirlas es el error caro.

| Concepto | Va al Padrón Nacional de Contribuyentes | Quién lo numera | Entra en el CUF |
|---|---|---|---|
| **Sucursal** | **SÍ** — tiene dirección física registrada | el contribuyente, `1..n` secuencial | sí, 4 dígitos |
| **Punto de venta** | **NO** — solo se registra en el sistema de facturación | el contribuyente, `0..9999` | sí, 4 dígitos |
| **Depósito** | es otro trámite (*"sucursales y/o depósitos"*) | — | **no** |

**La casa matriz es la sucursal `0`.** No es un caso especial: es el número cero.

Un punto de venta **pertenece a una sucursal** (o a la casa matriz). La relación es 1→N.

---

## 2. El CUF: 54 dígitos, y dos son nuestros

El `CUF` (Código Único de Factura) se arma concatenando, en este orden:

| # | Campo | Dígitos | Relleno |
|---|---|---|---|
| 1 | NIT del emisor | 13 | ceros a la izquierda |
| 2 | Fecha/hora `yyyyMMddHHmmssSSS` | 17 | ceros a la izquierda |
| 3 | **Sucursal** | **4** | ceros a la izquierda (`0` = casa matriz) |
| 4 | Modalidad | 1 | 1=electrónica · 2=computarizada · 3=web |
| 5 | Tipo de emisión | 1 | 1=en línea · 2=fuera de línea · 3=masiva |
| 6 | Tipo de factura | 1 | 1=con crédito fiscal · 2=sin crédito · 3=ajuste |
| 7 | Tipo de documento sector | 2 | ceros a la izquierda |
| 8 | Número de factura | 10 | ceros a la izquierda |
| 9 | **Punto de venta** | **4** | ceros a la izquierda (`0` = no aplica) |
| 10 | Dígito verificador | 1 | módulo 11 sobre los 53 anteriores |

Los 54 dígitos se convierten a **base 16** y se concatenan con el **código de control**
que devuelve el servicio de CUFD.

⚠️ **Consecuencia de diseño:** el código de sucursal es un **entero de 0 a 9999**, no un
texto libre. Hoy `OniaInvoicingInvoice.branchCode` es `String?` — sirve, pero **quien lo
escriba tiene que rellenar a 4 con ceros**, o el CUF sale inválido.

---

## 3. Los otros dos códigos que dependen de la sucursal

- **CUIS** (Código Único de Inicio de Sistemas): relaciona sistema de facturación +
  credencial + contribuyente + **sucursal**, y opcionalmente el punto de venta.
  Vigencia **365 días corridos**.
- **CUFD** (Código Único de Facturación Diaria): **por sucursal**, habilita emitir
  durante **24 horas**.

**Los dos se piden por sucursal.** Un sistema multi-sucursal necesita un CUIS y un CUFD
**por cada una** — no alcanza con uno por organización. Esto es lo que hace que la
sucursal sea una entidad y no una columna.

---

## 4. Los seis tipos de punto de venta

1. Comisionistas
2. Ventanilla de cobranza autorizada por la ASFI
3. Puntos móviles (venta de bienes o servicios)
4. Puntos YPFB (combustible a precio internacional)
5. **Puntos de venta (cajeros o similares) para la venta de otros bienes** ← el nuestro
6. Puntos de venta conjunta (emisión conjunta de documentos)

Para el comercio y la clínica que vendemos hoy, el tipo relevante es el **5**.

---

## 5. Qué se construyó y qué no

**Construido (Fase A):** el **almacén** — crear, elegir, y traspasar mercadería entre
almacenes con costeo valorado. Un almacén es un **depósito**: no tiene código fiscal, no
entra en el CUF, no pide CUFD.

**No construido (Fase B):** la **sucursal fiscal**. Se dejó afuera a propósito:

- El emisor SIAT es **mock** y está bloqueado por el NIT. Un `branchCode` correcto hoy no
  emite ninguna factura real.
- 🔴 **No se agregó `branchCode` al almacén.** Sería mentir el modelo — el SIN distingue
  sucursal de depósito — y obligaría a migrar datos vivos cuando aparezca la sucursal de
  verdad. La sucursal será su propia entidad, y el almacén la apuntará (nullable: un
  depósito sin sucursal es válido).

**Cuándo se hace la Fase B:** cuando el emisor SIAT deje de ser mock. Ahí la sucursal deja
de ser un dato y pasa a ser el requisito de un CUFD por sede.

---

## Fuentes

- [Sucursales y Puntos de Venta — SIAT/SIN](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/requerimientos/sucursales-y-puntos-de-venta)
- [Generación CUF — SIAT/SIN](https://siatinfo.impuestos.gob.bo/index.php/facturacion-en-linea/algoritmos-utilizados/generacion-cuf)
- [Códigos de Autorización (CUIS, CUFD) — SIAT/SIN](https://siatinfo.impuestos.gob.bo/index.php/informacion/codigos-de-autorizacion)
- [RND N° 102100000011 (PDF, SIN)](https://www.impuestos.gob.bo/wp-content/uploads/2025/10/RND11.pdf)
