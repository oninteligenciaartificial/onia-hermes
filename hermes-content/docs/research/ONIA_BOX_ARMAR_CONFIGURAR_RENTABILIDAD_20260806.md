# Onia Box — armar vs comprar, configuración, capacidades y rentabilidad (2026-08-06)

Cuarta parte. Responde: ¿construirlas o comprarlas? ¿cómo se configuran? ¿hace falta estudiar
o alcanza con Claude Code? ¿con cuál empezar? ¿qué modelo? ¿cuánto se gana?

---

## 1. Armar vs comprar — la respuesta depende del producto

| Producto | ¿Se puede armar? | ¿Conviene? | Por qué |
|---|---|---|---|
| **Onia Box** (Strix Halo 128 GB) | **No** | **Comprar** | Memoria LPDDR5X **soldada** — es lo que hace posible el bus de 256 bits. No hay piezas que juntar. El mini PC **ya es** la forma más barata del producto |
| **Onia Taller** (GPU discreta) | **Sí** | **Armar** | Es práctica estándar. Acá el armado sí captura margen real |
| **Onia Vista** (Jetson) | No | Comprar | Es un módulo cerrado |

### Cuánto se ahorra armando el de GPU

| Concepto | Comprado armado | Armado por nosotros |
|---|---|---|
| Margen del ensamblador | 15–30 % del equipo | **queda para nosotros** |
| Gabinete y fuente | vienen de China (aire caro) | **se compran en Santa Cruz** |
| Garantía | del fabricante, una sola | **la damos nosotros**, RMA por componente |
| Mano de obra | incluida | **nuestra** — hay que contarla |

**Veredicto:** armar ahorra de verdad **sólo en el tier con GPU discreta**, y ahí el ahorro
grande no está en el margen del ensamblador sino en **no importar el gabinete**, que ocupa
veinte veces el volumen de una GPU y vale una fracción.

**Para el producto principal (Onia Box) la pregunta no aplica: se compra.** Lo que agregamos
no es armado, es **configuración**.

---

## 2. Cómo se configura — el stack completo

Esto es lo que el cliente no puede hacer solo, y por lo tanto es el producto.

| Capa | Qué va | Por qué |
|---|---|---|
| **1. Kernel** | Linux **≥ 6.18.4** | Los anteriores tienen inestabilidad en gfx1151 |
| **2. Firmware** | Versión validada — **evitar `linux-firmware-20251125`**, que rompe ROCm en Strix Halo | Es la causa nº1 de crashes |
| **3. Runtime de cómputo** | ROCm donde funcione; Vulkan como respaldo | La ruta Vulkan **deja ~56 % del rendimiento**; hay que medir cuál conviene por modelo |
| **4. Motor de inferencia** | llama.cpp · Ollama | Contenedorizado, no instalado al sistema |
| **5. Modelo** | **Qwen3** (ver §5) | Apache 2.0, multilingüe fuerte en español |
| **6. Contenedores** | Docker / Podman · toolboxes tipo `kyuz0/amd-strix-halo-toolboxes` | Permite revertir sin romper el sistema |
| **7. Interfaz** | Open WebUI, o directamente **ONIA Platform** | Es donde se diferencia |
| **8. Acceso remoto** | Tailscale o WireGuard | **Sin esto no hay soporte**, y sin soporte no hay negocio recurrente |
| **9. Monitoreo** | Temperatura, uso, salud del disco, alertas a nosotros | Enterarnos antes que el cliente |
| **10. Actualizaciones** | **Imagen congelada y versionada**, actualizada sólo por ONIA | **Nunca `apt upgrade` libre en la caja de un cliente** |

**La capa 10 es la regla más importante de todo el producto.** Una actualización automática
puede tumbar 20 clientes el mismo día.

---

## 3. ¿Hacen falta estudios, o alcanza con Claude Code?

Respuesta honesta, sin adornos.

### No necesitás un título

Esto no es un campo con barrera de credenciales. Nadie te va a pedir un diploma para venderle
una caja a un estudio jurídico. La barrera real es **haber hecho funcionar la cosa y poder
arreglarla cuando se rompe**.

### Con Claude Code se hace casi todo el software

Instalación, scripts, la imagen del sistema, el stack de inferencia, la integración con ONIA
Platform, el monitoreo, la automatización de despliegue. Todo eso es acelerable enormemente y
no requiere formación previa formal.

### Lo que Claude Code NO reemplaza

1. **El hardware físico.** Armar, medir temperaturas, escuchar un ventilador raro, oler que
   algo se quema, cambiar una pieza. Eso pasa con las manos.
2. **El criterio que se gana rompiendo cosas.** Saber *que* ROCm puede romperse no es lo mismo
   que haberlo visto romperse y haber sabido volver atrás.
3. **Estar ahí cuando falla.** Si la caja de un cliente se cae un viernes, no podés decir "le
   pregunto a Claude". Tenés que saber.

### Lo que sí conviene aprender de verdad

| Tema | Nivel | Cómo |
|---|---|---|
| **Linux de administración** (no de uso): systemd, kernel, drivers, logs, permisos | Sólido | Con la máquina de prueba, rompiéndola a propósito |
| **Contenedores** (Docker/Podman) | Sólido | Es la base de poder revertir |
| **Redes básicas**: IP, DNS, VPN, puertos | Suficiente | Para el acceso remoto de soporte |
| **Cuantización y dimensionamiento de modelos** | Suficiente | La tabla de §5 alcanza para empezar |
| **Armado físico y ESD** | Básico | Sólo si vas al tier de GPU discreta |

### El veredicto

**Sí podés hacerlo**, y Claude Code te ahorra probablemente el 70 % del camino técnico. Pero
**el 30 % restante es el que sostiene la venta**, y ese se aprende con una máquina adelante,
no leyendo.

**Por eso la unidad de prueba de dos semanas no es opcional: es tu formación y tu control de
calidad al mismo tiempo.**

---

## 4. Con cuál empezar — una sola compra

| Compra | Costo aprox. | Para qué |
|---|---|---|
| **1× Beelink GTR9 Pro 128 GB** | **~USD 2.000** + flete aéreo | Es **el producto y el laboratorio a la vez**. Mejores térmicas de su categoría y dual 10 GbE |
| *(opcional)* 1× Jetson Orin Nano Super | USD 249 | Sólo si el primer cliente pide visión |

**Una unidad. No diez.** Con una sola:
- aprendés el stack completo,
- medís el rendimiento real (y no el del folleto),
- verificás si ROCm aguanta dos semanas,
- y la usás de demo para vender.

Si aguanta, esa misma caja es la demo con la que cerrás el primer cliente. Si no aguanta, te
enteraste con USD 2.000 y no con USD 20.000.

---

## 5. Modelos — ¿baratos o con muchos parámetros?

**Más parámetros no es mejor para una tarea concreta.** Un modelo de 14B bien alimentado con
los documentos del cliente (RAG) le gana a uno de 70B sin contexto. Y más parámetros significa
más memoria y **menos velocidad**.

### La regla: el más chico que haga el trabajo

| Tanda | Modelo sugerido | Tamaño | Por qué |
|---|---|---|---|
| **Onia Vista** | Modelo de visión pequeño | ≤ 3B | Cabe en Jetson |
| **Onia Recepción** | **Qwen3 8–14B** | 8–14B | Contestar WhatsApp no necesita más. Rápido y barato |
| **Onia Expediente** | **Qwen3 30B** (subir a 70B si el cliente lo justifica) | 30–70B | Razonamiento sobre documentos largos |
| **Onia Taller** | **Qwen3-Coder** (variante chica) | — | El de 480B no entra en una caja |
| Alternativas GPU única | **Gemma 3 27B** (16 GB) · **Phi-4 14B** (8 GB) | — | Los más fáciles de autohospedar |

**Por qué Qwen3 como familia por defecto:** es la mejor opción general para local — equilibra
calidad, variedad de tamaños, **soporte multilingüe** (clave para español) y **licencia Apache
2.0**, que permite empaquetarlo y venderlo sin fricción legal.

**Nota sobre los gigantes** (Qwen3 235B-A22B, DeepSeek V4, Qwen3-Coder-480B): son MoE, activan
sólo una fracción de sus parámetros, pero **igual necesitan la memoria completa**. No entran en
una caja de 128 GB salvo los de clase 120B en Q4 (65–70 GB).

---

## 6. Rentabilidad — los números

### Costo por unidad puesta en Bolivia (⚠️ estimación, sin cotización de fábrica)

| Concepto | 1–2 unidades (aéreo) | 10+ unidades (marítimo consolidado) |
|---|---|---|
| Equipo | USD 2.000 (precio de lista) | **USD 1.700–1.800** (directo de fábrica, volumen) |
| Flete | 150–250 (courier) | 30–60 |
| GA | **a confirmar** con clasificación escrita | ídem |
| Despachante y gastos | 80–150 | 50–80 |
| **Landed** | **~USD 2.250–2.400** | **~USD 1.800–1.950** |

**El IVA de importación (14,94 %) no es costo: es crédito fiscal** si facturamos.

### Precio de venta y margen — Onia Expediente

| Concepto | USD |
|---|---|
| Precio al cliente (equipo + instalación + configuración + 1er año de soporte) | **5.500–7.000** |
| Costo del equipo puesto | −1.900 |
| Instalación, configuración y capacitación (20–30 h nuestras) | −costo propio |
| **Margen bruto por unidad** | **~3.600–5.100** |
| **Recurrente: soporte y actualizaciones** | **150–300 / mes** |

### Proyección con 10 clientes

| | USD |
|---|---|
| Ingreso único (10 × ~6.000) | 60.000 |
| Costo de equipos (10 × 1.900) | −19.000 |
| **Margen bruto de hardware + implementación** | **~41.000** |
| **Recurrente anual** (10 × 200 × 12) | **24.000 / año** |

### Lo que hace o rompe el negocio

**El margen bruto ronda el 65 %.** Es bueno — pero **el recurrente es lo que compone**. Diez
clientes generan USD 24.000 al año sin volver a importar nada. Ahí está el negocio real.

**Los dos riesgos:**

1. **Inventario.** Si comprás 10 y vendés 2, tenés USD 19.000 parados. En un negocio con runway
   corto, eso es fatal.
2. **Soporte.** Cada cliente caído consume horas que no se facturan. Por eso el acceso remoto y
   el monitoreo (capas 8 y 9) no son opcionales.

### 🎯 La forma correcta de arrancar: vender contra pedido

**No comprar stock. Vender primero, importar después.**

1. Una unidad de demostración (la de prueba).
2. Se cierra la venta con **50 % de anticipo**.
3. Se importa contra ese pedido.
4. Se entrega en 4–6 semanas y se cobra el saldo.

Así el **riesgo de inventario es cero** y el cliente financia la importación. Es la forma
clásica de arrancar un negocio de importación sin capital, y es la única compatible con el
runway actual.

Cuando haya demanda repetida y previsible, ahí sí se importa un lote y se gana el descuento de
volumen.

---

## 7. Plan mínimo

1. Comprar **una** Beelink GTR9 Pro 128 GB.
2. Dos semanas armando el stack de §2 con Claude Code, **rompiéndolo a propósito** y aprendiendo
   a revertir.
3. Medir tok/s reales por modelo y anotarlos — son el argumento de venta.
4. Congelar la imagen y versionarla.
5. **5 conversaciones** con estudios jurídicos y clínicas: *"¿hay información de tus clientes
   que no podrías subir a un servicio extranjero?"*
6. Primera venta con 50 % de anticipo → primera importación.
7. Los trámites de importación (SEPREC, SIN, Aduana) corren en paralelo desde ya — no bloquean
   los pasos 1 a 5.

---

## Fuentes

Ver `ONIA_BOX_MARCA_PROPIA_VIABILIDAD_20260806.md` §Fuentes — mismas referencias de hardware,
ROCm y modelos. Precios de equipos en `ONIA_LISTA_EQUIPOS_IA_LOCAL_20260806.md`.
