# Un segundo correo en `@onia.com.bo` sin pagar — qué funciona y qué no

> 2026-08-16. Nace de un fallo real: se creó el alias `lucia@onia.com.bo` y **no sirvió** para
> dar de alta la cuenta de Instagram de Lucía. Meta llevaba a la cuenta de Onia.
>
> **Corrección de método:** yo había "verificado" el alias mandándole un correo y confirmando
> que llegaba. Eso prueba **entrega**, no **identidad separada**. Son cosas distintas y las
> confundí. Un alias no es una casilla nueva: es la misma casilla con otro nombre.

---

## ✅ DECIDIDO 2026-08-17 — Gmail propio para Lucía

Sergio: *"el tema del correo lo voy a crear Gmail para Lucía"*.

Cierra el bloqueo sin tocar el MX, sin pagar y sin arriesgar el correo de `business@`.
Un Gmail **es** una identidad separada, que es exactamente la propiedad que faltaba.

**Lo que esto NO cierra:** la pregunta de si conviene migrar el dominio a Cloudflare Email
Routing para tener direcciones corporativas gratis. Eso queda como decisión de plata, sin
urgencia, con el análisis de §3-bis listo para cuando se retome.

**Se puede sumar `lucia@onia.com.bo` después** sin rehacer la cuenta de Instagram: Meta deja
cambiar el correo.

---

## 0. Antes de cambiar nada: puede no ser el correo

Sergio describió que Meta *"lo mete a la cuenta de Onia"*. Eso no es el rechazo de una
dirección — **es el flujo de sesión**. Con `@oniahq` logueada en ese navegador, Instagram
reconoce la sesión y lleva ahí.

**Prueba de 2 minutos, costo cero:** repetir el alta en **ventana de incógnito, sin ninguna
sesión de Instagram ni de Google abierta.** Si ahí el alias funciona, no hay nada más que
resolver y todo lo de abajo sobra.

Esto va primero porque es la causa más probable y la más barata de descartar.

---

## 1. Por qué un alias no puede ser una identidad separada

En Google Workspace un alias **no crea un buzón**: es un nombre alternativo del mismo usuario.
Todo lo que llega a `lucia@` cae en `business@`, y en el directorio son el mismo objeto.

Sirve para *recibir*. No sirve cuando lo que hace falta es que **otro sistema crea que son dos
personas distintas**.

## 2. Las opciones reales, verificadas

### ✅ A · Grupo de Google — gratis, sin tocar el DNS

Un grupo `lucia@onia.com.bo` **no consume licencia** ([fuente](https://www.goldyarora.com/g-suite-groups/)):
los alias de grupo no cuentan como usuarios. Y es un **objeto distinto** en el directorio, no
un nombre alternativo de `business@` — que es exactamente donde falla el alias.

Para que reciba correo de afuera hay que habilitarlo:
**Configuración del grupo → General → "Quién puede publicar" → *Cualquier persona en la web***
([fuente](https://adamgrubbmedia.com/allow-external-users-email-google-groups/)).

- ✅ Gratis, ilimitados, sin cambiar el MX, sin riesgo para `business@`
- ✅ Se agrega a Arthur como miembro: lee el código sin entrar al correo de Onia
- ⚠️ **No está confirmado que Meta lo acepte.** Es un objeto distinto del alias, pero eso es
  razonamiento, no prueba. Se comprueba creándolo y probando — 5 minutos, costo cero.

### ✅ B · Cloudflare Email Routing — el dominio YA está en Cloudflare

Gratis, **direcciones ilimitadas**, y el DNS ya vive ahí: es un interruptor, no una migración
de nameservers. Hay **dos formas** y la diferencia importa.

#### B1 · En un subdominio, conservando Google en la raíz

**Corrección 2026-08-16:** una versión anterior de este doc decía que los subdominios estaban
"soportados a medias, sin UI". **Es falso** — me guié por hilos de comunidad viejos.
La [documentación oficial](https://developers.cloudflare.com/email-service/configuration/subdomains/)
describe un formulario propio:

> *"Email Routing es una función a nivel de zona que aplica al dominio apex por defecto.
> **Podés extenderla a subdominios de la misma zona**, como `mail.example.com` o
> `corp.example.com`."*
> → Email Routing → seleccionar el dominio apex → **Settings** → **Subdomains** → escribirlo.

**El detalle que lo complica:** hay que dar de alta el apex primero, y eso pone el MX de
Cloudflare en la raíz — que es justo lo que rompe Google. La salida está documentada
([Domains](https://developers.cloudflare.com/email-service/configuration/domains/)):

> *"Solo los registros de Email Routing en el dominio raíz (MX, SPF y DKIM) admiten
> **desbloqueo**. Si querés migrar a otro proveedor sin interrumpir el servicio, desbloqueá
> los registros primero, agregá los del nuevo proveedor al lado, y recién después quitá los
> de Email Service."*

Secuencia: alta del apex → **desbloquear** el MX raíz → restaurar el MX de Google →
agregar el subdominio. Queda **raíz = Google** (`business@` intacto) y
**subdominio = Cloudflare** (direcciones ilimitadas gratis).

- ✅ Google Workspace sigue funcionando, `business@` no se toca
- ⚠️ La dirección queda `lucia@equipo.onia.com.bo`, no `@onia.com.bo`
- ⚠️ Hay una ventana de minutos con el MX de Cloudflare en la raíz. **Ahí llegan los PIN del SIAT**
- Límite: hasta **30 dominios/subdominios** por zona

#### B2 · Migrar el apex entero — la respuesta a "correos corporativos gratis"

Email Routing en la raíz, y **cada dirección reenvía a un Gmail DISTINTO** — eso es lo que da
identidades separadas de verdad, que es donde falla el alias.

```
business@onia.com.bo  →  el Gmail de Sergio
lucia@onia.com.bo     →  el Gmail de Lucía      ← identidad separada
arthur@onia.com.bo    →  el Gmail de Arthur
…ilimitadas
```

- ✅ **Costo cero y se cancela Workspace**
- ✅ Direcciones limpias `@onia.com.bo`
- ⚠️ Solo recibe. Para *enviar* como `lucia@` se usa "Enviar como" de Gmail con contraseña de
  aplicación
- 🔴 **Se pierden Drive, Docs y Calendar bajo el dominio**
- 🔴 Corta el correo unos minutos — y ahí llegan los PIN del SIAT

### 💵 C · Una licencia más de Workspace

La única que da **buzón real, login propio y 2FA propio**. Es lo correcto para un activo de
marca que se va a delegar a Arthur. Cuesta una licencia por mes.

Es la respuesta si A falla.

### ⛔ D · Migrar el MX entero a Cloudflare

Da direcciones ilimitadas gratis y saca la licencia de Workspace. Pero **corta el correo de
`business@` durante la migración**, y ahí llegan los PIN del SIAT. No se hace para desbloquear
una cuenta de Instagram.

### ⛔ E · Autohospedar (mailcow / docker-mailserver)

Open source, en el VPS que ya está pago. Pero **el VPS no tiene PTR** — medido el 2026-08-16:
Google aceptó un correo con `250` y lo descartó sin entregarlo. Recibir correo exige más que
enviarlo. Es un frente entero, no una configuración.

## 3. El orden a seguir

| # | Qué | Costo | Tiempo |
|---|---|---|---|
| 1 | Reintentar el alta **en incógnito, sin sesiones** | 0 | 2 min |
| 2 | Si falla: crear el **grupo** `lucia@onia.com.bo` con posteo externo | 0 | 5 min |
| 3 | Probar que el grupo recibe (mandarle un correo y buscarlo) | 0 | 2 min |
| 4 | Reintentar el alta de Instagram con el grupo | 0 | 5 min |
| 5 | Si Meta lo rechaza: **B2 (migrar a Cloudflare)** o **una licencia más** | 0 · o 1 licencia/mes | 20 min |

**No pasar al paso siguiente sin agotar el anterior.** Cada uno descarta una causa distinta.

## 3-bis. ¿Hace falta Google Workspace? — auditado 2026-08-16

Se revisó el repo y los contenedores en producción.

**Producción no usa Google para nada:**

```
onia-platform  → cero variables GOOGLE_*. Usa SMTP_* (Postfix propio) + Brevo
onia-landing   → ninguna
onia-center    → ninguna
```

Las agendas corren en **Cal.com**, no en Google Calendar. Los `googleapis` que aparecen en el
repo son casi todos `fonts.googleapis.com` — tipografías.

**La única dependencia real, y está apagada:** `channels/ciencia-cuerpo/scripts/upload-youtube.mjs`
y `scripts/social_publisher.py` usan `googleapis` con OAuth2 y scope `youtube.upload`.
Pero `YOUTUBE_REFRESH_TOKEN` está **vacío en los docs y no existe ninguna variable de YouTube
en el VPS**. No hay canal ni credenciales. Y cuando se cree, **un canal de YouTube vive bien
en un Gmail común** — no pide Workspace.

⚠️ **Nota de método:** la primera pasada (búsqueda indexada) dijo "cero dependencias de Google"
y estaba incompleta — se saltó los dos scripts de YouTube. Los encontró el grep exhaustivo.
**Una búsqueda rápida que da el resultado esperado merece una segunda pasada.**

**Lo que sí importa conservar:** `business@onia.com.bo` aparece en **8 propuestas de cliente**,
en el pie de `onia-platform` y en la instalación de Cal.com. Esa dirección tiene que seguir
recibiendo — pero eso lo cumple un reenvío.

### 🔴 La pregunta que decide, y no se puede contestar desde el repo

**¿`business@onia.com.bo` se usa para "Iniciar sesión con Google" en algún servicio?**
(Meta Business, Cloudflare, Vercel, Supabase, Higgsfield, el banco.)

Si es solo una bandeja → **B2 es seguro** y se cancela Workspace.
Si es una identidad de login → **quedarse en Workspace**; para Lucía alcanza el grupo (gratis).

Cómo se comprueba: `myaccount.google.com` con esa cuenta → **Seguridad** → *"Acceder a otros
sitios"* / apps de terceros conectadas.

## 4. Lo que NO se sabe todavía

- **Si Meta acepta un grupo de Google como correo de alta.** Es la incógnita central y solo se
  responde probando.
- **Por qué exactamente falló el alias.** Puede haber sido la sesión (§0) y no el correo. Si
  el paso 1 funciona, esa era la causa.

## 5. La lección de método

**Verificar la entrega no es verificar la identidad.** El correo de prueba llegó, y aun así el
alias no servía para lo que hacía falta. Antes de dar algo por resuelto hay que preguntarse
**qué propiedad exacta se necesita** — acá era "que un tercero los vea como dos cuentas
distintas" — y probar *esa*, no una parecida.

---

Relacionado: `references/modelos/lucia/LUCIA.md` (identidad) · `contenido/LUCIA.md` (su plan) ·
memoria `onia-correo-propio` (el estado del correo del dominio).
