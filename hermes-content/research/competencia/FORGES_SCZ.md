# FORGES (Forge.) — Competidor directo, Santa Cruz

Investigado: 2026-08-18. Solo material PÚBLICO (perfil IG sin login, web pública, captions).
No se creó ninguna cuenta ni se ingresó ninguna contraseña.

Fuentes principales:
- Instagram: https://www.instagram.com/forgescz/ (perfil público, leído renderizado)
- Web: https://forgebo.com (y https://forgescz.vercel.app → redirige 308 a forgebo.com)
- Alcance + precios Ganadero: https://forgebo.com/alcance.html
- Demo Ganadero: https://forge-ganadero.vercel.app (con puerta de contraseña — ver "Acceso interno")
- Agenda: https://forge-asistente.vercel.app ("FORGE Agenda", contenido no accesible sin interactuar)

---

## 1. Qué es Forges exactamente

**Sistemas de gestión A MEDIDA (custom builds), no SaaS.** "No vendemos software genérico.
Construimos el sistema exacto que tu operación necesita" (forgebo.com). Cada cliente recibe
un desarrollo propio en ~20 días. NO venden webs ni chatbots; solo sistemas + 1 vertical
productizado (FORGE Ganadero).

- **Marca:** "Forge." / FORGE. Handle @forgescz. Bio IG: "Transformamos negocios con
  tecnología a medida. •Empresas •Retail •Ganadería •Pymes y más. Trabajamos a nivel
  mundial 🌎" (lo de "mundial" no tiene evidencia: todos los casos son de Santa Cruz).
- **Tamaño aparente: micro, posiblemente unipersonal.** El email de contacto de la web es
  un Gmail personal: `juanpabloanezcirbian@gmail.com`. El usuario ADMIN del demo Ganadero
  es "Juan Anezcirbian". Dominios en Vercel gratis (`*.vercel.app`) salvo forgebo.com.
  No verificable: si hay más gente detrás. Sin rastro en directorios ni prensa (búsquedas
  web no lo indexan; solo existe en IG + su web).
- **Antigüedad:** IG con **11 publicaciones**, la primera del **3-jul-2026** (~6 semanas
  al momento de investigar), 397 seguidores, 123 seguidos. La web se ve nueva (© 2026).
  Los casos entregados sugieren que operan desde algo antes de julio, pero no hay
  evidencia pública anterior.
- **Clientes con nombre (5, casi todos del mismo ecosistema de moda SCZ):**
  - Toscana House (casa de modas multimarca, 19-20 marcas) — entregado
  - ANDRĒ (@andre_menswear_, producción + retail de ropa) — entregado
  - ReEtiqueta (@reetiquetamoda, consignación de moda circular) — entregado
  - Toscana Online (ecommerce de Toscana House) — en desarrollo
  - Una estancia ganadera sin nombre (caso RFID) — no verificable si es cliente real
    o el propio demo
- **Stack (declarado en alcance.html):** Next.js + Supabase + Web Bluetooth + Vercel.
  **El mismo stack de Onia Platform.**
- **Modelo de cobro:** pago único por implementación + mantenimiento mensual. Ganadero:
  USD 600 / 1.200 / 2.000 según plan + Bs 600/mes de soporte. Para el resto de sistemas
  no publican precio ("propuesta a medida"). Usan tipo de cambio ~7 Bs/USD (USD 600 ≈
  Bs 4.200) — por debajo del paralelo real; ambiguo si cobran en USD o en Bs.

---

## 2. Qué hacen BIEN (lo que pidió Sergio)

### En el producto / sistema

1. **Casos reales con métricas concretas, no promesas.** Toscana House: cierre de
   8+ horas → 30 minutos; precisión de stock 85% → 100%. ANDRĒ: "ROI en el mes 1".
   Publican el ANTES/DESPUÉS con número (forgebo.com, sección Casos). Esto vende
   muchísimo mejor que listar features.
2. **FORGE Ganadero es un pitch redondo para el campo cruceño:**
   - Integración con balanzas Bluetooth reales del mercado: TruTest EziWeigh/XR5000,
     Gallagher W210/W310, Ruddweigh, Allflex + lectores RFID. El celular ES el indicador
     ("SYNC: tu celular controla la balanza"). Clasificación automática TROPA/REFUGO.
   - "100% sin internet" con sincronización al volver la señal — offline-first como
     bandera (justo la capacidad que el rubro ganadero de Onia promete y NO tiene).
   - El número gancho correcto: **costo por kilo producido** y GDP en tiempo real
     ("¿Cuánto te cuesta hoy cada kilo que produce tu estancia? La mayoría no tiene esa
     respuesta hasta fin de mes. O nunca." — reel del 12-jul).
   - Hashtag de posicionamiento: #SistemaHechoPorGanaderosParaGanaderos.
3. **Cierre contable automático como feature estrella:** asientos automáticos desde
   ventas, estado de resultados, conciliación, liquidación por marca/proveedora. En
   ReEtiqueta: comisión por proveedora congelada en cada venta, prenda única que
   desaparece del catálogo al venderse, alerta de rotación. Resuelven el dolor
   administrativo, no solo el POS.
4. **Claim de facturación electrónica SIAT** (API, CUF/CUFD, QR, "modo pendiente sin
   conexión") ⚠️ NO VERIFICABLE desde afuera — puede ser real, mock o roadmap. Si es
   real, están adelante de nuestro SIAT emitter (bloqueado por NIT).
5. **Pagos declarados:** QR, Linkser, efectivo, tarjeta y **USDT** (nadie más lo ofrece
   públicamente en el rubro local).

### En la oferta comercial

6. **"Implementación en 20 días" con cronograma día a día publicado** (diagnóstico 1-2,
   diseño 3-4, desarrollo 5-14, migración 15-17, capacitación/go-live 18-19, soporte 20+).
   Promesa concreta y acotada — mata la objeción "los sistemas tardan meses".
7. **Se hacen cargo del hardware sin venderlo:** "los equipos los pone tu negocio y no
   están incluidos en el precio", pero FORGE deja lectores, impresoras térmicas y
   terminales configurados, calibrados y al equipo capacitado; opción "llave en mano" si
   el cliente no quiere buscar proveedores. Muy alineado con nuestra regla de terceros
   excluidos — ellos la convirtieron en argumento de venta.
8. **Migración asistida como garantía:** "Garantizamos que ningún dato se pierda" —
   auditoría de datos, validación línea por línea, backup. Ataca el miedo #1 del que ya
   tiene un sistema o sus Excel.
9. **Precios públicos y por capacidad en Ganadero** (600/1.200/2.000 USD por 500/2.000/
   5.000 cabezas + Bs 600/mes) + "demo en vivo" + "tu estancia digitalizada esta semana:
   versión personalizada en 48 horas con el nombre de tu finca". Fricción de compra
   bajísima.
10. **Diagnóstico gratuito por WhatsApp** como CTA universal (wa.me/59176099651).

### En el marketing (IG)

11. **Frecuencia disciplinada:** 11 posts en 5 semanas (~2/semana), mezcla de carruseles
    de features, reels con producto real (ternero + tablet en corral; impresora térmica
    imprimiendo) y posts de caso de éxito etiquetando al cliente (@toscanahousebo,
    @andre_menswear_, @reetiquetamoda) — el cliente le presta su audiencia.
12. **Ganchos por dolor, no por tecnología:** "Cuadernos, planillas sueltas, WhatsApp a
    medianoche", "Manejar una tienda es fácil. Manejar cuatro, en dos ciudades, ya es
    otra historia", "20 marcas. 1 solo sistema. Cero caos."
13. **Copy en voseo cruceño** ("cómo trabajás vos", "agendá", "arrancás") — suena local,
    no a template.

---

## 3. Qué hacen mal o no tienen (nuestro espacio)

1. **CERO IA en toda la oferta.** Ni chatbot, ni agentes, ni automatización de atención.
   La palabra "IA" no aparece ni en la web ni en los 11 captions. Todo el terreno de
   chatbot WhatsApp por organización + agentes con aprobación es nuestro.
2. **Modelo que no escala: cada cliente es un desarrollo a medida.** 20 días de dev por
   cliente = techo de ~1-2 clientes/mes con el equipo que aparentan. Cada sistema
   entregado es deuda de mantenimiento propia. Onia enciende un rubro desde el core;
   ellos lo programan de cero cada vez.
3. **Sin recurrencia fuerte:** cobran una vez (USD 600-2.000) + Bs 600/mes de soporte.
   Nuestro SaaS mensual acumula; ellos tienen que salir a cazar cada mes.
4. **Base de clientes concentrada en UN ecosistema:** 4 de 5 casos son del circuito
   moda-retail de Santa Cruz (Toscana y satélites). Diversificación real: solo el
   ganadero.
5. **Marca frágil / informalidad:** Gmail personal como contacto corporativo, demos en
   subdominios *.vercel.app, sin razón social visible, sin NIT ni datos legales en la
   web, "trabajamos a nivel mundial" sin un solo caso fuera de SCZ. Un comprador formal
   que haga due diligence lo nota.
6. **Sin webs ni presencia online para clientes** (no venden landing/tienda/dominio) y
   sin vertical de servicios (dental, condominios, etc.). Su "multi-rubro" es una lista
   de a quién le harían un sistema, no packs encendibles.
7. **Distribución mínima:** 397 seguidores, sin prensa, sin SEO (no aparecen en búsquedas
   de "sistemas Santa Cruz"), un solo canal (IG + boca a boca).
8. **Seguridad descuidada en la demo:** forge-ganadero.vercel.app pide contraseña pero el
   HTML inicial ya trae TODO el dashboard demo renderizado (datos de "Estancia El
   Chiriguano", 485 cabezas, alertas, stock) — la puerta es solo cosmética del lado
   cliente. Señal de prolijidad técnica baja en lo que no se ve.

---

## 4. Comparación honesta vs Onia Platform

| Frente | Forges HOY | Onia HOY | Quién gana |
|---|---|---|---|
| Clientes pagando con nombre y métricas | 3 entregados + 2 en curso, con antes/después publicado | 0 clientes pagando (regla interna: no fabricar) | **Forges** |
| Ganadero: balanzas Bluetooth + RFID + offline | Lo promete como bandera y lo demuestra en reels con hardware real | Rubro encendido en prod pero SIN el offline que promete; sin integración de balanzas | **Forges** (en pitch; su realidad técnica no verificable) |
| Oferta comercial concreta (plazo + precio público + migración garantizada) | 20 días con cronograma, precios Ganadero públicos, migración "sin perder un dato" | Precios viven en pricing.ts, propuestas por generador; sin promesa pública de plazo | **Forges** |
| Escalabilidad del modelo | Custom build por cliente, sin producto reusable | UNA plataforma multi-tenant, packs por rubro desde el core (21 capacidades) | **Onia** |
| IA: chatbot por org, agentes con aprobación | Nada, ni mencionado | Chatbot WhatsApp+editor de conocimiento en prod, módulo agents | **Onia** |
| Recurrencia / pricing | Pago único USD 600-2.000 + Bs 600/mes | SaaS mensual (ej. dental 390/890/1.990 Bs) — entrada mucho más barata para el cliente | **Onia** (barrera de entrada del cliente más baja) |
| Fiscal Bolivia | Claim de SIAT vía API (no verificable) | SIAT emitter construido, bloqueado por NIT | Empate incierto — si su SIAT es real, nos ganan hoy |
| Webs + presencia online del cliente | No ofrecen | Web factory + tiendas + propuestas | **Onia** |
| Formalidad / marca | Gmail personal, sin datos legales | SEPREC matrícula, dominio propio, correo propio | **Onia** |
| Contabilidad automática integrada al POS | Entregada y contada con detalle (asientos, liquidaciones por marca/proveedora) | Módulos core existen; menos evidencia pública de uso real | **Forges** (en evidencia pública) |

**Lectura fría:** nos ganan en TRACCIÓN VISIBLE y en la venta del rubro ganadero; les
ganamos en producto-plataforma, IA, recurrencia y formalidad. Su mejor arma es enseñar
clientes reales; la nuestra es que ellos no pueden fabricar un chatbot ni un SaaS
multi-tenant en 20 días por cliente.

---

## 5. Amenaza real

**MEDIA en general, ALTA en el rubro ganadero.**

- **Mismos clientes, misma ciudad:** dueño de pyme formal de Santa Cruz — retail,
  ferretería, farmacia, distribuidora, restaurante, estancia. Es exactamente nuestro
  comprador (memoria: "el dueño de negocio formal es EL cliente") y nuestros rubros
  comercio + ganadero.
- **Ganadero = choque frontal:** publican precios, demo, hardware integrado y offline;
  nuestro rubro ganadero está encendido pero sin el offline prometido. Si un ganadero
  compara hoy, el pitch de Forges es más creíble. Con la ventana de facturación en línea
  al 1-oct-2026 empujando a formalizarse, ellos ya dicen tener SIAT.
- **Por qué no es ALTA en todo:** capacidad de entrega mínima (modelo artesanal,
  ~1-2 clientes/mes), sin IA, sin recurrencia, marca informal, distribución de 397
  seguidores. No pueden atender el volumen que un SaaS sí.
- **Precio:** no compiten en el mismo bolsillo — ellos piden USD 600-2.000 de entrada;
  nosotros cientos de Bs al mes. El cliente chico sin capex es nuestro; el que quiere
  "su sistema propio pagado una vez" es de ellos.

---

## Acceso interno — decide Sergio

1. **Demo Ganadero** (forge-ganadero.vercel.app): pide contraseña al entrar. NO se
   ingresó nada. (Dato: el HTML público ya trae el dashboard demo completo renderizado
   detrás de la puerta — lo descrito arriba salió de ahí sin credenciales.) La
   contraseña presumiblemente se pide por WhatsApp.
2. **Highlights de IG "( Clientes )" e "(Info)"**: requieren login de Instagram para
   reproducirse. Ahí probablemente estén testimonios y precios adicionales.
3. **FORGE Agenda** (forge-asistente.vercel.app): carga sin contenido estático; ver qué
   hace requiere interactuar con la app.
4. **Sistema retail (Toscana/ANDRĒ)**: no hay demo pública; solo capturas en posts.
   Verlo por dentro exigiría pedirles demo como prospecto — decisión de Sergio.

## Citas por afirmación

- Bio, seguidores, 11 posts: https://www.instagram.com/forgescz/
- Caso ReEtiqueta + forgebo.com: https://www.instagram.com/forgescz/p/DbrMjoxGSgw/
- Sistema de obras/construcción: https://www.instagram.com/forgescz/p/DbqWzR9up26/
- Cierre caso ANDRĒ: https://www.instagram.com/forgescz/p/DbD64CjDcP5/
- Inventario ferreterías/distribuidoras: https://www.instagram.com/forgescz/p/DbD5cM1N24v/
- Multi-sucursal retail: https://www.instagram.com/forgescz/p/DayzkjVjXxK/
- Ganadero costo/kg (reel): https://www.instagram.com/forgescz/reel/DatdE08xgAi/
- Ganadero features + offline: https://www.instagram.com/forgescz/p/DajjkO1jUvF/
- Toscana House 20 marcas: https://www.instagram.com/forgescz/p/DabjV47NyCU/
- "Implementado en 20 días" + diagnóstico gratis (reel): https://www.instagram.com/forgescz/reel/DaaRDtiOEHV/
- Intro software a medida: https://www.instagram.com/forgescz/p/DaVcGIHOcQj/
- Módulos, casos con métricas, proceso 20 días, hardware, SIAT, rubros, contacto: https://forgebo.com
- Precios Ganadero (600/1.200/2.000 USD + Bs 600/mes), stack Next.js+Supabase: https://forgebo.com/alcance.html
- Demo con puerta de contraseña y dashboard filtrado en el HTML: https://forge-ganadero.vercel.app
