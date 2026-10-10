# ToS de Doctocliq y Dapta: qué permiten y qué no (lectura del 2026-10-10)

> No es asesoría legal. Lectura de las páginas oficiales vigentes hoy. Las citas salieron de WebFetch (un modelo intermedio resume la página), así que antes de citar a un tercero o decidir algo caro, abrir la cláusula a ojo. Todo esto es solo lectura web: no se creó cuenta, no se aceptó nada.

## Veredicto corto

| | Ingeniería inversa | Scraping / benchmarking | Competir / copiar | Trial para evaluar | Riesgo de estudiar su UI con nuestra cuenta |
|---|---|---|---|---|---|
| **Doctocliq** | Prohibida (sobre el software) | No dicen nada | No lo dicen, pero "uso diferente a la finalidad" es un portón ancho | Los ToS no mencionan trial | MEDIO |
| **Dapta** | Prohibida (Sec. 2.5(f)) | No dicen nada (solo pen-testing prohibido) | Prohibido expresamente: Sec. 2.5(i) | Los ToS no mencionan trial | MEDIO-ALTO si el fin es construir algo parecido |

---

## 1. Doctocliq

**Documento:** Términos y condiciones. El índice (https://www.doctocliq.com/terminos-condiciones/) dice que "los términos varían según el país" y manda a dos versiones:
- México: https://www.doctocliq.com/mx/terminos-y-condiciones/ (Doctocliq Mexico SAPI de C.V.). Fecha: "Actualizado el 10 de Octubre de 2025".
- Perú y resto de LATAM: https://www.doctocliq.com/pe/terminos-y-condiciones/ (ZOLUPRO S.A.C., Lima). **Sin fecha de actualización visible.** Esta es la que corresponde a Bolivia.

Las cláusulas relevantes son prácticamente iguales en ambas versiones.

### 1.1 Ingeniería inversa, scraping, benchmarking, competir
- **Ingeniería inversa: SÍ prohibida.**
  - Sec. 9 "Propiedad intelectual y licencia de uso": "ingeniería a la inversa sobre el código fuente de DOCTOCLIQ".
  - Sec. 13 "Prohibiciones": "aplicar ingeniería a la inversa a DOCTOCLIQ". Más reproducción, traducción/adaptación, distribución pública y alquiler del software.
- **Uso fuera de la finalidad: SÍ prohibido.** Sec. 13: "Queda prohibido cualquier uso diferente a la finalidad de DOCTOCLIQ", y el Cliente responde por los daños.
- **Uso comercial del contenido: prohibido sin permiso escrito.** Sec. 9: "para propósito comerciales o de cualquier otra naturaleza" (aplica a software y contenidos del sitio/app: manuales, videos tutoriales).
- **Uso ilícito:** Sec. 8.10, no usar la plataforma "para fines ilícitos o contrarios a la legislación vigente"; su violación faculta a suspender o terminar el acceso.
- **Scraping, extracción de datos, benchmarking, competir o construir producto similar: NO mencionados** en ninguna de las dos versiones. "Descompilar" tampoco se nombra.

### 1.2 ¿Permiten una cuenta de prueba para evaluar?
- Los ToS **no tienen ninguna cláusula de prueba/demo**. La única mención es el banner de la página: "7 días gratis - Sin tarjeta de crédito", que es marketing, no término.
- Los ToS están escritos para el "Cliente" que contrata un plan (licencia no exclusiva e intransferible por la vigencia del plan, Sec. 9). No dicen si el usuario de prueba queda bajo esos términos, pero lo prudente es asumir que sí.
- Credenciales: Sec. 5, el Cliente es responsable de custodiarlas. La cuenta es de quien la crea; no compartirla.

### 1.3 Qué podemos hacer y qué no (Doctocliq)
| Sin riesgo razonable | No hacer |
|---|---|
| Recorrer la UI con nuestra cuenta de prueba para ver flujos, textos y orden de pantallas (es el uso normal del producto). | Descompilar la app móvil, desempaquetar el JS para sacar lógica o endpoints, interceptar tráfico para mapear su API (es "ingeniería inversa" sobre el software). |
| Leer su web pública, precios y blog. | Scraping masivo o automatizado de la cuenta (no está prohibido por nombre, pero choca con "uso diferente a la finalidad"). |
| Capturas de pantalla para **uso interno** como notas de ideas (ver nota abajo). | Copiar manuales, videos tutoriales o textos de su sitio a material nuestro (Sec. 9). |
| Anotar funciones como "ideas para evaluar" y construir lo nuestro de cero. | Publicar sus capturas en pauta, web o propuestas; usar su marca; comparar con su nombre sin revisión. |
| | Cargar datos reales de pacientes en su cuenta de prueba. |

**Zona gris que hay que nombrar:** el riesgo real no es la ingeniería inversa (no la hacemos) sino que Onia Platform dental es competidor directo de Doctocliq. Abrir una cuenta de prueba **con el fin de estudiarlos** puede leerse como "uso diferente a la finalidad de DOCTOCLIQ" (Sec. 13). No hay cláusula que lo diga con esas palabras, así que el riesgo práctico es suspensión de la cuenta, no un juicio. Mirar la UI, sí. Mapear y replicar pantalla por pantalla, no.

---

## 2. Dapta

**Documento:** Master Services Agreement (MSA) publicado como "Terms and Conditions".
- URLs: https://www.dapta.ai/dapta-terms-and-conditions (también https://dapta.ai/terms-of-service/) y la fuente oficial https://legal.dapta.ai/en/documents/customer-terms
- Fecha: "Effective October 7, 2026" (versión 2026-10-07); el texto dice "dated as of October 2026". Parte: Dapta, Inc. (Delaware). Ley de Delaware, arbitraje UNCITRAL en Phoenix, Arizona (Sec. 22 y 23).
- El Legal Center (https://legal.dapta.ai) lista tres documentos: NDA mutuo (17-sep-2026), este MSA (7-oct-2026) y Privacy Policy (agosto 2024). **No hay política de uso aceptable aparte.**

### 2.1 Ingeniería inversa, scraping, benchmarking, competir
Todo en Sec. 2.5 "Certain Restrictions":
- **Ingeniería inversa: SÍ prohibida.** Sec. 2.5(f): "reverse engineer, de-compile or disassemble any aspect of the Dapta Solution".
- **Competir / construir algo parecido: SÍ prohibido, es la más delicada para Onia.** Sec. 2.5(i): no usar la Solución "for the purpose of building a similar or competitive product or service".
- **Pen-testing: prohibido.** Sec. 2.5(h): "vulnerability, penetration or similar testing".
- Otras: no sublicenciar ni revender (a), no timesharing (b), no modificar (e), no quitar avisos de propiedad (g).
- **Scraping / extracción de datos / benchmarking: NO mencionados.**
- Credenciales: Sec. 2.1, no compartir la cuenta de usuario con otra persona o entidad. Dapta puede suspender o reemplazar cuentas que sospeche mal usadas (Sec. 2.2(a)).
- Confidencialidad: Sec. 13. Lo que Dapta nos muestre y no sea público puede ser "Confidential Information" (devolver o destruir a pedido). Ojo con capturas de pantallas internas.
- IP: Sec. 7.2, el cliente "will acquire no rights to any Dapta Property".

### 2.2 ¿Permiten una cuenta de prueba para evaluar?
- **El MSA no contiene las palabras trial, free trial, evaluation, pilot, beta, free plan ni sandbox.** Cubre solo servicios bajo Order Forms pagados (Sec. 1(a), 5(a)). No dice nada a favor ni en contra de una cuenta gratuita.
- No se pudo ver el flujo de alta de cuenta gratuita (no creamos cuentas). Si Dapta ofrece cuenta de prueba, las condiciones concretas estarán en el checkbox del registro, que **no leímos**. Pendiente: que Sergio Urcullo lea ese checkbox en su cuenta ya creada si quiere certeza.

### 2.3 Qué podemos hacer y qué no (Dapta)
| Sin riesgo razonable | No hacer |
|---|---|
| Usar la UI con nuestra cuenta para ver cómo se construye un agente, qué nodos ofrece, cómo se ve el flujo (uso normal). | Usar la cuenta **para el propósito de construir un producto parecido o competidor** (2.5(i)). Es el riesgo central: Onia vende un chatbot add-on y agentes, y Dapta es una plataforma de agentes. |
| Leer su web, precios, blog y docs públicas; ver sus videos públicos. | Descompilar, desensamblar o hacer ingeniería inversa del front o de la API (2.5(f)); interceptar tráfico para mapear endpoints. |
| Capturas para notas internas de "ideas para evaluar", sin publicar. | Pruebas de penetración o fuzzing (2.5(h)). |
| Anotar qué hace y cómo lo vende, y decidir lo nuestro por separado, con nuestros propios clientes y datos. | Revender o dar acceso a terceros (2.5(a), 2.1); compartir la cuenta con alguien fuera de Onia; subir capturas a pauta o propuestas. |
| robots.txt de dapta.ai permite a GPTBot, ClaudeBot, PerplexityBot y otros (actualizado 2026-04-08): leer su sitio público con un agente no choca con robots. | Tratar como "público" lo que vimos dentro de la cuenta (puede ser confidencial, Sec. 13). |

**Zona gris que hay que nombrar:** 2.5(i) no prohíbe estudiar al competidor, prohíbe usar la Solución "con el propósito de" construir algo parecido. La redacción pega justo en un ejercicio de "teardown para replicar". Mantener el registro como **evaluación comercial** ("¿nos conviene como herramienta / cómo vende?") y no como especificación de funciones a copiar. La consecuencia más probable de un incumplimiento es que Dapta suspenda la cuenta (Sec. 2.2(a)); una disputa formal iría a arbitraje en Arizona (Sec. 23). Eso es una lectura mía, no consejo legal.

---

## 3. Qué hacer (regla práctica para Onia)

1. **Seguro:** mirar la UI con nuestra cuenta, leer ayuda y web pública, tomar notas y capturas de uso interno, registrar ideas en "ideas para evaluar" (consistente con la regla "competencia = ideas, no copiar").
2. **No:** ingeniería inversa de app/JS/API de ninguno; tráfico interceptado para mapear endpoints; scraping masivo de la cuenta; pen-testing (Dapta); compartir cuentas; cargar datos reales de pacientes (Doctocliq).
3. **No publicar** capturas, textos, videos ni nombres de ninguno de los dos en pauta, web, propuestas ni one-pagers sin revisión.
4. **Cuidar la forma del registro** (Dapta sobre todo): las fichas dicen "qué observamos y qué decide Sergio Urcullo", no "especificación a replicar".
5. **Pendiente que no resolví:** (a) el texto del checkbox al crear cuenta en cada una (no creamos ni aceptamos nada); (b) Doctocliq PE no trae fecha de actualización; si importa, pedirla o guardar la captura del día; (c) si Doctocliq o Dapta tienen centro de ayuda público: no encontré uno en la búsqueda, no confirmado.

## 4. Fuentes leídas hoy (2026-10-10)
- https://www.doctocliq.com/terminos-condiciones/ (índice por país)
- https://www.doctocliq.com/mx/terminos-y-condiciones/ (actualizado 10-oct-2025)
- https://www.doctocliq.com/pe/terminos-y-condiciones/ (sin fecha)
- https://www.doctocliq.com/robots.txt
- https://www.dapta.ai/dapta-terms-and-conditions
- https://dapta.ai/terms-of-service/
- https://legal.dapta.ai y https://legal.dapta.ai/en/documents/customer-terms
- https://www.dapta.ai/robots.txt

Dato aparte, sin relación con los ToS: un sitio de seguimiento de ransomware (ransomware.live) lista a Doctocliq con un supuesto ataque fechado 19-ago-2025. No lo pude confirmar con otra fuente. Razón extra para no cargar datos reales en su cuenta de prueba.
