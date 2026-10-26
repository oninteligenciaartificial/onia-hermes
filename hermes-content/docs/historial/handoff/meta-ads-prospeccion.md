# Handoff — carril `meta-ads-prospeccion`

> Rama `claude/meta-ads-onia-prospecting-8b5122`. Última vuelta: 17 al 21-sep-2026.
> **Escrito para que lo continúe Codex**, que no tiene los MCP de esta sesión ni la memoria
> de Claude. Todo lo que hace falta está acá o en un comando de acá.
> Formato: los 7 campos del `README.md` de esta carpeta.

---

## 1. Objetivo

Dos, en este orden, porque Sergio Urcullo cambió el foco a mitad de camino:

1. **Contestar si conviene pautar Meta Ads ahora para prospectar Onia Platform.**
   Contestado: **no todavía**, con la medición que lo sostiene (§3).
2. **Dejar UNA fuente sin fecha que diga a quién le vendemos.** ✅ **Cumplido y en `main`.**

---

## 2. Qué quedó EN PRODUCCIÓN (mergeado a `main`, verificado)

**Commit `01311903` — ya es ancestro de `origin/main`, verificado el 21-sep.** Nadie tocó
esos archivos en los 386 commits que el integrador metió entre medio.

- **`hermes-content/docs/ONIA_CLIENTE_IDEAL.md`** — nuevo, sin fecha, **fuente única de a
  quién le vendemos**. Perfil, 5 preguntas de calificación, mapa tamaño → plan, quién NO es
  cliente, tamaño de mercado citado, y §8 con cada corrección y su motivo.
- **`hermes-content/docs/historial/ONIA_ENFOQUE_20260727.md`** — marcado ARCHIVADO arriba de
  todo, apuntando al doc nuevo.
- **`CLAUDE.md` §2** — línea nueva **"A QUIÉN se le vende"** al lado de "Qué se vende", con la
  historia del fallo que la originó.

**Fuera del repo, y por eso Codex NO las ve** (viven en
`C:\Users\PC\.claude\projects\C--dev-proyectos-onia-hermes\memory\`):
`onia-enfoque-compradores.md` reescrita, `meta-ads-engine.md` con el checkpoint del 17-sep, y
las dos líneas del `MEMORY.md`. **Lo que importa de esas memorias está portado a este handoff
y al doc de cliente ideal**, así que no hace falta leerlas para continuar.

---

## 3. Qué quedó a medias, y dónde exactamente

### 3.1 La pauta de Meta: NADA creado, y son cuatro bloqueos, no uno

Medido en vivo el 17-sep con la Graph API desde el VPS, no heredado:

| Qué | Estado | Quién lo destraba |
|---|---|---|
| Método de pago en `act_1073680778314945` | ❌ ausente | Sergio Urcullo / Leslie |
| Página "Onia" `1140384625819526` vinculada a la cuenta | ❌ `promote_pages` vacío. **Es `owned_page` del business, pero eso no alcanza** | Sergio Urcullo, en Business Manager |
| Campaña 1 `120253773124020022` | ❌ **ARCHIVED desde el 1-sep, y con cero anuncios.** No se reactiva: se recrea | código |
| Pixel `1012611478191231` en onia.com.bo | ⚠️ **29-sep: aviso sin librería escrito en `origen-de-campana.ts`, SIN publicar y SIN verificar contra Meta** (ver §3.2). Hasta ver `PageView` en «Probar eventos» o un `last_fired_time`, sigue sin disparar | carril web, y mirarlo publicado |

✅ **Lo que SÍ está resuelto y antes era bloqueo:** el token. `META_SYSTEM_USER_TOKEN` en
`/root/.hermes/.env` es tipo SYSTEM_USER, `is_valid: true`, `expires_at: 0` (**no vence**),
con `ads_management` + `ads_read` + `business_management`. El vencimiento del 5-sep que
figuraba en los docs viejos ya no existe.

🔴 **Trampa que le va a pasar a Codex igual que a mí: el MCP de Meta Ads de la sesión está
logueado con OTRA cuenta de Meta.** Devuelve las cuentas "NUVO 1usd" y "Arthur Fuentes", y la
página "NUVO". **No ve ONIA Ads.** No sirve para nuestra cuenta y **jamás hay que gastar en
esas dos**. El camino real es la Graph API desde el VPS, o el motor en `/opt/onia/meta-ads/`.

### 3.2 La atribución `?src=` está cortada en el medio

El producto **sí** guarda el origen: `app/(auth)/register/AccessRequestForm.tsx:47` lee
`searchParams.get("src")` y la columna `access_requests.src` existe. Pero la landing **no lo
propaga**: los 9 CTA de la home van a `app.onia.com.bo/register` pelado. Se ve en los datos —
de los tres registros, **solo el primero tiene `src`**, y porque se puso a mano.

**Consecuencia si se enciende la pauta así: todo lead llega con `src = NULL` y no se puede
saber si la campaña sirvió.** Arreglarlo es condición previa a pautar, no un extra.

**Estado al 29-sep (rama `codex/v1-hermes-20260928`, sin publicar): la mitad del sitio está,
la del producto NO.** La web guarda `src`, `utm_*` y `fbclid` y los suma al enlace de
`/register` al tocarlo (`web-factory/apps/onia-platform/src/lib/origen-de-campana.ts`). Pero
con el alta abierta en producción el registro muestra `SignupForm`, que sólo lee `?plan=`;
`AccessRequestForm` (el único que lee `src`) no se muestra, y nadie lee `utm_*` ni `fbclid`.
**Sigue habiendo cero altas atribuibles: no se reporta la atribución como hecha.** Falta, en el
carril de producto (`onia-platform`): que `SignupForm` lea esas claves con la misma lista
blanca y las guarde (`org.discoverySource` o columna nueva, migración aditiva), y que el alta
confirmada avise `CompleteRegistration` (ideal: por CAPI). El sitio ya NO manda `Lead` por un
toque: manda `Contact` (WhatsApp) y `ClicAlta` (alta), para que ninguna campaña optimice por
clics contados como leads.

**Verificación pendiente del píxel, recién publicado** (el aviso es `fetch` `no-cors`: la
respuesta es opaca y un error no se ve): abrir `https://onia.com.bo/?fbclid=prueba` y mirar en
el Administrador de eventos, pestaña «Probar eventos», que entren `PageView` y el evento del
clic; o leer `last_fired_time` del píxel por Graph API desde el VPS. Si no entran, probar
`/tr/` y `noscript=1` antes de darlo por vivo.

**Aparte, carril de la guía:** el formulario de `/guia-facturacion` (`CapturaGuia.tsx`) no
tiene `method`: enviado antes de que cargue React hace GET y deja `?email=&whatsapp=` en la
dirección (y en los logs). El píxel ya no lo reenvía a Meta, pero el form debería ir por POST.

### 3.3 Dos materiales de venta desalineados (detectados, NO tocados)

No los toqué porque son superficie que ve el cliente y la regla pide que Sergio Urcullo vea
la pieza antes.

1. **`hermes-content/sales-kit/01-ONE-PAGER-OFERTA.md`** vende **"DentalGest"** —marca muerta
   por `CLAUDE.md` §3— y lista **tres planes con precios viejos** (la fuente tiene cinco
   escalones desde el 12-sep). **Es el archivo que se manda por WhatsApp a un prospecto.**
2. **`hermes-content/docs/ONIA.md`** describe a Onia como *"agencia de diseño web"* y nombra
   DentalGest y Gestios como productos separados.

---

## 4. Archivos tocados

```
hermes-content/docs/ONIA_CLIENTE_IDEAL.md                  (nuevo)
hermes-content/docs/historial/ONIA_ENFOQUE_20260727.md     (aviso de ARCHIVADO arriba)
CLAUDE.md                                                  (§2, línea "A QUIÉN se le vende")
```

Nada más. Sin cambios de código, sin nada en vuelo, árbol limpio, todo pusheado y mergeado.

---

## 5. Intentos fallidos y trampas — el campo que ahorra tiempo

1. **Busqué la definición de cliente donde la memoria decía y no estaba.** `ONIA_ENFOQUE_20260727.md`
   vive en `historial/`, que por regla **no es fuente de verdad**. Siete semanas citándolo como
   fuente. **Lección: un doc archivado que nadie marca como archivado se sigue leyendo como
   presente.** Por eso ahora tiene el aviso arriba.
2. **Perdí llamadas con el MCP de Meta antes de darme cuenta de que era otra cuenta.**
   Primero mirar `ads_get_ad_accounts`: si no aparece `1073680778314945`, el MCP no sirve.
3. **`psql` por SSH con `E'...'` y comillas escapadas revienta.** Dos intentos perdidos. Lo que
   funciona: `replace(replace(m.content, chr(10), ' '), chr(13), ' ')` y comillas dobles simples.
4. **`python -c` en esta consola rompe con acentos y flechas.** Usar `PYTHONIOENCODING=utf-8`
   o heredoc, y evitar `→` en el código.
5. **El `cd` a `onia-platform` saca el shell del worktree** y hay que volver con ruta absoluta.
6. **No asumir que los barridos de n8n rescatan leads viejos** — ver §6, me lo corrigió el dato.

---

## 6. Qué depende de Sergio Urcullo

🔴 **Lo primero, y es lo más caro: cinco personas llegaron solas y siguen sin respuesta.**
Re-medido el 21-sep contra producción, no heredado:

| Quién | Llegó | Días esperando | Respuestas |
|---|---|---|---|
| clinica klein (dental) | 21-ago | **31** | `contactedAt` NULL |
| Clinica Leonardo (estética) | 23-ago | 29 | `contactedAt` NULL |
| consultorio dental sonrisa feliz | 28-ago | 24 | `contactedAt` NULL |
| "F" — clínica odontológica de 4 doctores, 6 preguntas concretas | 25-ago | 27 | **0 salientes** |
| mariohassen — "vengo de la web" | 28-ago | 24 | **0 salientes** |

⚠️ **Los barridos automáticos encendidos el 18-sep NO los rescataron.** Verificado: las
conversaciones 34, 35, 36 y 37 siguen con **cero mensajes salientes**; el barrido solo tocó la
conversación 58, que es del 17-sep. **El barrido trabaja sobre lo nuevo, no sobre la deuda de
agosto.** Quien continúe no debe asumir que "ya está automatizado": no lo está para éstos.

⚠️ **Pasó la ventana de 24 h de Meta**: a los dos de WhatsApp solo se les puede escribir con
**plantilla aprobada**. Texto libre recién cuando contesten.

Lo demás que depende de él:
- 🔴 Tarjeta en `act_1073680778314945` y vincular la página en Business Manager (5 min, gratis).
- 🔴 **OK explícito para encender la pauta.** Nada se activa sin eso.
- 🟡 Ver el one-pager corregido antes de que reemplace al actual (§3.3).

**Y el número que ordena todo:** `subscription_payments` sigue en **cero filas**, medido el
21-sep. Cero clientes pagando.

---

## 7. Próximos pasos, en el orden en que conviene hacerlos

El orden no es de gusto: cada paso es más barato que el siguiente y produce antes.

### Paso 1 — Contestarle a los cinco (no cuesta nada y es lo único que puede traer el primer pago)

Es la conclusión de toda la sesión: **pagar por leads nuevos mientras cinco gratis esperan 31
días es tirar la plata.** Empezar por la clínica de 4 doctores, que es el cliente ideal exacto
y dejó sus seis preguntas por escrito.

⚠️ **Antes de contestarle hay que verificar en el producto, una por una, cuáles de sus seis
funciones existen hoy.** Contestarle de memoria es la forma de quemar al mejor lead que
tenemos. Las seis preguntas están en `ONIA_LEADS_ESPERANDO.md`.

### Paso 2 — Arreglar el one-pager (barato, y sin esto el cliente ideal nuevo no llega al cliente)

Reescribir `sales-kit/01-ONE-PAGER-OFERTA.md`: sacar "DentalGest", poner los cinco planes
leídos de la fuente, y abrir por el dolor correcto — **el paciente con tratamiento a medias que
no volvió**, no la facturación. El perfil y el orden de dolores están en `ONIA_CLIENTE_IDEAL.md`.
**Se le muestra a Sergio Urcullo antes de reemplazar el actual.**

### Paso 3 — Arreglar `?src=` en la landing (condición previa a pautar)

~~Propagar el parámetro desde los CTA de la home hasta `app.onia.com.bo/register`.~~ Hecho en
la web el 29-sep, sin publicar. **Lo que falta es del producto**: guardarlo en el alta (§3.2).
Sin eso no se puede medir ninguna campaña.

### Paso 4 — Recrear la campaña, en PAUSA (solo cuando 1 a 3 estén y Sergio Urcullo ponga la tarjeta)

La campaña vieja está archivada: se recrea, no se reactiva. El copy y las creatividades ya
existen y costaron cero: `hermes-content/carousels/out/ads/ad-a2-v1-no-volvieron/slide-01.png`
y `ad-a2-v2-cuaderno/slide-01.png`, con los textos en `hermes-content/docs/historial/ONIA_ADS_CAMPANA_1_LISTA_20260813.md`.
⚠️ Ese doc tiene **precios y estados viejos**: se usan sus textos de anuncio, no sus cifras.
Acotar el público a Santa Cruz + 25 km antes de activar.

---

## Comandos para retomar (copiar y pegar)

```bash
# 1. ¿Alguien ya paga? Es el número que cambia la etapa entera
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i supabase-db psql -U postgres -d postgres -c "SELECT status, count(*) FROM public.subscription_payments GROUP BY 1;"'
```

```bash
# 2. ¿Los cinco leads siguen sin respuesta?
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 \
  'docker exec -i supabase-db psql -U postgres -d postgres -c "SELECT \"businessName\", \"createdAt\"::date, \"contactedAt\" FROM public.access_requests ORDER BY \"createdAt\";"'
```

```bash
# 3. Estado real de la cuenta de ads (no usar el MCP: está en otra cuenta)
ssh -i ~/.ssh/onia_hermes_vps_ed25519 root@187.77.16.63 'bash -s' <<'EOF'
set -a; . /root/.hermes/.env; set +a
V=${META_API_VERSION:-v21.0}; AID=${META_AD_ACCOUNT_ID#act_}; tok="$META_SYSTEM_USER_TOKEN"
curl -s "https://graph.facebook.com/$V/act_$AID?fields=name,account_status,funding_source_details&access_token=$tok"; echo
curl -s "https://graph.facebook.com/$V/act_$AID/promote_pages?fields=id,name&access_token=$tok"; echo
EOF
```

---

Relacionado: `ONIA_CLIENTE_IDEAL.md` (a quién le vendemos) · `ONIA_LEADS_ESPERANDO.md` (los
cinco, con sus mensajes textuales) · `ONIA_ESTRATEGIA_DE_EMPRESA.md` (la etapa vigente) ·
`hermes-content/docs/historial/ONIA_ADS_CAMPANA_1_LISTA_20260813.md` (copy de los anuncios; cifras vencidas).
