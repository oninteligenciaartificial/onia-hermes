# Importación e Infraestructura de IA local — índice maestro de la sesión (2026-08-06)

**Punto de entrada.** Esta sesión produjo 14 documentos. Empezá por acá.

**Objetivo de la sesión:** matar todos los frentes sobre qué significa importar productos a
Bolivia, y elegir un producto.

---

## 1. Cómo evolucionó la decisión

| # | Producto evaluado | Veredicto |
|---|---|---|
| 1 | **Cargadores EV para condominios** | Viable — nicho vacío, arancel 0 %, pero el negocio es el SaaS de prorrateo. **Parqueado** |
| 2 | **Paneles solares** | ❌ **Descartado.** Inyección a Bs 0,129/kWh, mercado saturado (Enersol 40 años), valor/kg pésimo |
| 3 | **Infraestructura para IA local** ✅ | **ELEGIDO por Sergio.** Adyacente a lo que ONIA ya hace |

**La regla que salió de comparar los tres:**

> **¿El hardware crea una necesidad de software recurrente que sin él no existiría?**
> Si no, importarlo es entrar a un negocio de márgenes de comerciante.

---

## 2. Decisiones tomadas

| Decisión | Estado |
|---|---|
| **Producto: infraestructura de TI para que los clientes corran IA on-premise** | ✅ Decidido |
| **ONIA importa por su cuenta**, no a través de Bolivian Electric | ✅ Decidido — BE queda como palanca logística |
| **Se compra siempre directo de fábrica**, nunca a distribuidor | ✅ Regla permanente |
| **Marca propia ligera** (logo + packaging + imagen de sistema), sin BIOS custom | ✅ Decidido |
| **Preinstalar sólo modelos Apache 2.0 o MIT** | ✅ Regla del producto |
| Leslie firma todo lo legal; Sergio opera | ✅ Estructura confirmada |
| **Empezar sin importar** (opción A: hardware del cliente) y importar después | ⏳ Última recomendación, pendiente de confirmar |

---

## 3. Estado: qué está listo y qué falta

### ✅ Listo para ejecutar
- Requisitos exactos del registro de importador (Art. 32 del reglamento vigente)
- Que **no hace falta firma digital ni garantía** si se despacha con agencia despachante
- Redacción del objeto social ampliado
- Contactos de fábrica verificados y **RFQ redactado**
- Lista de compra de la unidad de prueba (~USD 2.300–2.500)
- Protocolo de medición de dos semanas

### ⏳ Depende de Sergio / Leslie
| # | Qué | Quién |
|---|---|---|
| 1 | Ampliar objeto social — **SEPREC Trámite 14** (gratis) | Leslie |
| 2 | Agregar actividad CIIU — **OVT → RNC → Modificación Datos** (gratis) | Leslie |
| 3 | Verificar que el domicilio fiscal = **Calle Tulipanes Nro. 9** | Sergio |
| 4 | Generar certificado del Padrón (**después** de 1 y 2), destinatario ADUANA NACIONAL | Leslie |
| 5 | Registro de importador en SUMA + estar presente en la verificación de domicilio | Leslie |
| 6 | **Enviar el RFQ** a Beelink y GMKtec | Sergio |
| 7 | **5 conversaciones** con estudios jurídicos y clínicas — guion listo para salir: `ONIA_BOX_LAS_5_CONVERSACIONES_GUION_20260812.md` | Sergio |

> ⚠️ **El 7 manda sobre los otros seis.** Los seis primeros preparan la importación; el séptimo
> dice si hay que importar. El criterio de corte (qué resultado sigue y cuál para el producto)
> está escrito **antes** de salir, en la sección 7 de ese guion, para no acomodarlo después.

### ✅ Verificado el 2026-08-12
- **DS 5518: 8471.41.00.00 (mini PC completo) entra con GA 0 % hasta el 31-dic-2026** — leído del
  Anexo en la Gaceta Oficial. **SSD (8471.70) y partes (84.73) quedan afuera: pagan 5 %.**
  **Invierte la estrategia: conviene traer el equipo ARMADO, no los componentes**
- **ATT: homologación obligatoria** para equipos con radio · **12 semanas** · exención si el modelo
  ya está homologado · exige **Autorización Previa de Importación antes de que salga la carga**
- **Minisforum = Shenzhen Meigao Electronic Equipment Co., Ltd** — fábrica propia, hace OEM/ODM
- Anchos de banda: Mac Mini M4 120 GB/s · M4 Pro 273 · RTX 5060 Ti 448 · 5070 672 · 5080 960

### ❓ Sin verificar (marcado, no inventado)
- Si la ATT **exime a una unidad de uso propio** — el procedimiento oficial está en un PDF ilegible;
  lo responde la despachante
- Si existe reglamento técnico IBMETRO aplicable
- Licencias de Ernie, Yi y Baichuan
- Precio real de Beelink y Minisforum (sólo sale de la cotización)

---

## 4. Los hallazgos que más cambiaron el rumbo

1. **La caja no es "una caja de IA": es la infraestructura digital del cliente.** ONIA Platform,
   Chatwoot, n8n, Postgres, Speaches y SIAT ya existen y caben todos ahí. Deja de competir
   contra ChatGPT a USD 20/mes.
2. **Hay dos velocidades, no una.** Prefill (leer) vs generación (escribir). Strix Halo escribe
   3× más rápido; GB10 lee 5× más rápido. **El catálogo necesita las dos máquinas.**
3. **El modelo pesa más que la máquina.** El mismo equipo pasa de 340 a 1.142 t/s de prefill
   según se use denso o MoE.
4. **El piso de mercado internacional es USD 8.000–12.000.** Nuestro precio de 5.500–7.000 entra
   por debajo, con soporte local.
5. **Vender ahorro no funciona; vender obligación sí.** Un estudio jurídico **no puede** subir
   expedientes a un servidor extranjero.
6. **Tres vías de entrega no requieren importar nada** — y una factura en días.

---

## 5. Índice de documentos

### Importación (marco general)
| Doc | Qué contiene |
|---|---|
| `ONIA_IMPORTACION_BOLIVIA_PLAYBOOK_20260806.md` | **Playbook general**: registro, tributos, permisos previos, rutas, riel de pago, cargadores EV, paneles solares, regla de decisión de hardware, runbook del registro |
| `ONIA_REGISTRO_IMPORTADOR_PAQUETE_20260806.md` | **Paquete operativo del registro**: requisitos Art. 32, plazos, verificación de domicilio, objeto social, plataformas de atención |

### Producto: Onia Box
| Doc | Qué contiene |
|---|---|
| `ONIA_LISTA_EQUIPOS_IA_LOCAL_20260806.md` | 8 tiers de equipos con precios ago-2026, de USD 249 a 500.000 |
| `ONIA_SOURCING_ARMADO_IA_LOCAL_20260806.md` | Armar vs comprar, 6 vías de compra, fuentes por geografía, fábricas por componente |
| `ONIA_BOX_MARCA_PROPIA_VIABILIDAD_20260806.md` | Marcas según uso real, costo de marca propia, riesgo ROCm, tandas por caso de uso, viabilidad |
| `ONIA_BOX_ARMAR_CONFIGURAR_RENTABILIDAD_20260806.md` | Stack de 10 capas, capacidades necesarias, **números de rentabilidad**, venta contra pedido |
| `ONIA_BOX_STACK_PERFILES_COMPETENCIA_20260806.md` | Stack de 13 capas, **qué más corre en la caja**, perfiles de comprador, competencia global |
| `ONIA_BOX_GAMAS_POR_MODELO_20260806.md` | **Prefill vs generación**, 5 gamas, protocolo de medición de 2 semanas |
| `ONIA_BOX_ALTERNATIVAS_AL_MINIPC_20260806.md` | Formatos alternativos y **5 vías de entrega**, 3 sin importar. Colocation en Bolivia |
| `ONIA_BOX_PREGUNTAR_A_LOS_DOCUMENTOS_20260812.md` | **La función que cierra la venta**: "¿dónde está la ficha?" vs "¿cómo está el documento?" — qué se promete, la regla de la cita, permisos en la búsqueda, qué lo hace fallar |

### Modelos de IA
| Doc | Qué contiene |
|---|---|
| `ONIA_BOX_MODELOS_Y_MARCA_20260806.md` | Catálogo de modelos, **licencias**, y el problema de la marca desconocida |
| `ONIA_BOX_KIMI_LLAMA_QWEN_LOCAL_20260806.md` | Kimi (descartado), Llama (2ª opción), Qwen (base) — con el filtro de correr local |
| `ONIA_BOX_MODELOS_RESTANTES_Y_LICENCIAS_20260806.md` | Hunyuan, MiniMax, Hermes, GLM, Seed-OSS + **qué significa Apache 2.0** |
| `ONIA_BOX_CONFIANZA_Y_LISTA_DE_COMPRA_20260806.md` | **Confiabilidad y seguridad** de los modelos, dos catálogos, lista de compra |

### Ejecución
| Doc | Qué contiene |
|---|---|
| `ONIA_BOX_CONTACTOS_FABRICA_Y_RFQ_20260806.md` | **Contactos B2B verificados** de Beelink y GMKtec + **RFQ listo para enviar** |
| `ONIA_BOX_RUNBOOK_DE_COMPRA_20260812.md` | **Cómo se compra**: la unidad de demo ≠ la tanda · las 3 vías para 1 unidad · cómo se paga la primera vez · el único punto donde sale plata |
| `ONIA_BOX_OPCIONES_HARDWARE_POR_PRESUPUESTO_20260812.md` | **Mac vs NVIDIA vs AMD**: qué vende cada plataforma, la escalera completa de USD 249 a 500.000, qué modelo entra en cada equipo, y cuál es barato para modelos chicos vs caro para razonar |
| **`ONIA_PLAN_IMPORTACION_EJECUTABLE_20260812.md`** ⭐ | **EMPEZAR ACÁ para ejecutar**: números finales con el arancel cero confirmado, los contactos completos, los mensajes listos para copiar (4 fábricas, despachante, bancos) y el cronograma con fechas |
| `ONIA_BOX_LAS_5_CONVERSACIONES_GUION_20260812.md` | **El guion de validación**: a quién, qué preguntar, cómo distinguir un sí real de cortesía, y el criterio de corte escrito de antemano |

---

## 6. Reglas nuevas que salieron de esta sesión

1. **Comprar siempre directo de fábrica**, nunca a distribuidor ni trader.
2. **El hardware sólo vale si engancha un cobro mensual** que sin él no existiría.
3. **No importar aire** — lo voluminoso (gabinetes, UPS, cables) se compra en Santa Cruz.
4. **Preinstalar sólo Apache 2.0 o MIT** — las otras licencias meten cláusulas en nuestros
   contratos.
5. **Vender contra pedido con 50 % de anticipo**, nunca stock especulativo.
6. **Imagen de sistema congelada y versionada.** Nunca `apt upgrade` libre en la caja de un
   cliente.
7. **Nunca decir "Strix Halo"** frente a un cliente — es **AMD Ryzen AI Max+ 395**.

---

## 7. El siguiente paso concreto

**No es comprar ni importar. Es preguntar.**

> *"¿Hay información de tus clientes que no podrías subir a un servicio extranjero?"*

Cinco conversaciones con estudios jurídicos y clínicas de Santa Cruz. Si la respuesta es sí y
les duele, hay negocio — y **la opción A permite venderles sin importar nada.**

Todo lo demás de esta carpeta existe para el día en que esa respuesta sea sí.
