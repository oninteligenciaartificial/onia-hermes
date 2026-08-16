# Un segundo correo en `@onia.com.bo` sin pagar — qué funciona y qué no

> 2026-08-16. Nace de un fallo real: se creó el alias `lucia@onia.com.bo` y **no sirvió** para
> dar de alta la cuenta de Instagram de Lucía. Meta llevaba a la cuenta de Onia.
>
> **Corrección de método:** yo había "verificado" el alias mandándole un correo y confirmando
> que llegaba. Eso prueba **entrega**, no **identidad separada**. Son cosas distintas y las
> confundí. Un alias no es una casilla nueva: es la misma casilla con otro nombre.

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

### ⚠️ B · Cloudflare Email Routing en un subdominio

Gratis y con direcciones ilimitadas, pero:

- Los subdominios **están soportados a medias**: la UI y la API todavía no los exponen, hay
  que manejar los registros DNS a mano
  ([docs](https://developers.cloudflare.com/email-service/configuration/subdomains/) ·
  [blog](https://blog.cloudflare.com/email-routing-subdomains/)).
- La comunidad reporta que **no se puede correr Email Routing y Google Workspace sobre la
  misma zona** ([hilo](https://community.cloudflare.com/t/i-want-to-use-email-routing-while-keeping-my-google-workspace-active/523750)).
- La dirección quedaría `lucia@equipo.onia.com.bo`, no `@onia.com.bo`.

**No lo recomiendo hoy:** trabajo manual de DNS a cambio de una dirección peor.

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
| 5 | Si Meta lo rechaza: **una licencia más** de Workspace | 1 licencia/mes | 5 min |

**No pasar al paso siguiente sin agotar el anterior.** Cada uno descarta una causa distinta.

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
