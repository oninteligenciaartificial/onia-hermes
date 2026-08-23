# Handoff — carril `claude/git-status-935f47`

> Formato: `hermes-content/docs/handoff/README.md`. Se sobrescribe; es el estado ACTUAL.
> Última escritura: 2026-08-23.

**Objetivo**

Terminar el producto para poder venderlo y fotografiarlo, uno por uno, sin dejar nada a
medias. *Hecho* = los 8 ítems de la cola de terminación cerrados y en producción
(`ONIA_PENDIENTES_PARA_LANZAR.md` §"LA COLA DE TERMINACIÓN"). **7 de 8 cerrados.**

**Qué quedó EN PRODUCCIÓN**

Ocho deploys limpios, cero rollbacks:
- Formato de moneda boliviano (`Bs 1.500`, antes `Bs. 1,500` = *un boliviano cincuenta*),
  un solo nombre por plan (había cinco), medidor de plan vivo en los 7 rubros.
- Calendario de citas al derecho, 6 tablas legibles en el teléfono, ayuda filtrada por rubro.
- **Caja con carrito multi-línea + anulación** — era el único bloqueo funcional de comercio.
- **Panel propio de importadora** — antes veía el mostrador de la ferretería.
- **Panel dental rediseñado** — el rubro vivo; agenda protagonista, propuestas con jerarquía.
- Datos fotografiables: dental Bs 942,50 e importadora Bs 21.633, sin marcas `Demo ·`.
- Web nueva publicada en `onia.com.bo` con la oferta completa; alta cerrada → "Pedí tu acceso"
  con aviso por correo (entrega a Gmail probada).
- **Embedded Signup de WhatsApp encendido**: Configuration ID `1834223392073753`, dominio
  `chat.onia.com.bo` autorizado, las 3 variables puestas en Chatwoot.

**Qué quedó a medias, y dónde**

- **Ítem 8 — el único abierto**: fotografiar los 5 rubros y llenar el hueco de la landing (la
  sección de rubros ocupa **4.980 px, el 44% de la página**, con **cero imágenes**). No
  empezado. Las capturas viejas (`public/v2/capturas/`) están **desactualizadas** (traen
  `DEMO-414538-V` y "Dashboard" en inglés, ambos ya arreglados) y **mal encuadradas**.
- **Deploy del lote final** (`e5950be`, 1988 tests): en vuelo al escribir esto. Verificar
  `/login` → "Entrá a tu cuenta" antes de darlo por cerrado.
- **Telegram para pedidos de acceso**: las variables están en `app.env` pero el contenedor no
  las tomó — `docker restart` no relee `--env-file`. Requiere recrear el contenedor (3 redes,
  hay datos de clientes). Hoy el aviso sale por correo, que funciona.
- **Login visual**: diagnosticado, no tocado. Panel izquierdo con un tercio vacío en el medio,
  verde de un solo tono sin capas, aviso de Supabase **azul** que rompe la paleta, tarjeta
  blanca sobre gris sin presencia.
- **Switcher de rubros en móvil**: apila los 5 bloques en vez de cambiar al scrollear.

**Archivos y cambios**

- `hermes-content/docs/ONIA_PENDIENTES_PARA_LANZAR.md` — la cola con su "LISTO =" por fila.
- `hermes-content/docs/ONIA_AUDITORIA_TERMINACION.md` — los 19 hallazgos con horas.
- `hermes-content/docs/ONIA_WEB_COMO_SE_VENDE.md` — el proceso de venta de webs (existía
  disperso: playbook, intake, 7 plantillas, cotizador, 6 propuestas emitidas).
- `web-factory/apps/onia-platform/src/content/webs.ts` — precios ratificados 2.000/4.500/7.500.
- `onia-platform` master `e5950be`.

**Intentos fallidos**

- **Tres deploys murieron y el tercero tumbó el VPS entero.** Los `npm install` huérfanos se
  acumularon: load 18, npm de 40 minutos, 522 en todas las webs. Sergio reinició desde
  Hostinger. → Trampa 7 en la skill `onia-deploy`: UN build, `pgrep` previo, `nohup`, `free -g`.
- **Asumí que las variables de Chatwoot iban por entorno.** Falso: `WHATSAPP_APP_ID`,
  `_SECRET` y `_CONFIGURATION_ID` son **solo de base de datos por diseño** (no leen ENV).
  Ponerlas donde yo pensaba no habría funcionado nunca.
- **Reporté "el sitio está roto en producción"** al ver 404 tras pushear. Falso: `onia.com.bo`
  **no lo sirve Vercel** sino el contenedor `onia-landing` del VPS; pushear a main no publica
  nada. Los 404 eran rutas nunca desplegadas.
- **Capturas del producto en la landing: se ven mal.** No es el sistema, es el encuadre —
  pantallas de texto denso (`/agentes`, `/pending`) achicadas a un tercio son una mancha gris.
  → El próximo intento va con **recortes del detalle que cuenta la historia**, no pantallas
  enteras.
- **Se me pasó el precio de las webs vencido.** El sitio publicaba una oferta de arranque
  muerta el 31-jul mientras las propuestas cotizaban 2,5× más. Lo encontró un subagente.
- **Escribí un dominio en el campo equivocado** del panel de Meta (la página se desplazó y usé
  coordenadas). → Con formularios ajenos, referencias de elemento, nunca coordenadas.

**Qué depende de Sergio**

1. **El clic de prueba del Embedded Signup** — `chat.onia.com.bo` → Ajustes → Entradas → Nueva
   → WhatsApp → "Connect with WhatsApp Business". Es lo único que prueba el handshake con Meta.
2. **Mirar el panel dental en producción** — nadie lo vio renderizado; vive tras el login.
3. **Access Verification de Meta** — enviada, vence el **20/10/2026**.
4. **Número del plan de Higgsfield** (dijo ~$100) para cerrar el cuadro de costos.
5. **Rotaciones** cuando tenga su laptop: password de Postgres, tokens de Meta del historial,
   claves de Supabase en 4 workflows dormidos de n8n.
6. **Decisión**: ¿el botón de Google se habilita (necesita credenciales de Google Cloud) o se
   esconde? Hoy está visible y roto — el proveedor nunca estuvo configurado.

**Próximos pasos**

1. Cerrar el deploy del lote final. *Listo* = `/login` dice "Entrá a tu cuenta" en producción.
2. **Ítem 8**: recapturar los 5 rubros con el producto ya terminado, en **recortes** legibles,
   y cablearlos al switcher. *Listo* = la sección de rubros muestra el panel real de cada uno,
   mirado en las 5 paradas del scroll.
3. Rediseñar el visual del login (los 4 defectos de arriba). *Listo* = capturas a 390 y 1440
   leídas, sin el vacío del medio ni el azul ajeno.
4. Switcher móvil: que cambie de rubro al scrollear en el teléfono.
