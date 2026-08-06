# Los 2 perfiles listos para dar de alta — Lucía y Mara

> 2026-08-06. Sergio: *"quiero crear los 2 perfiles de las modelos"*.
> Acá está **todo el contenido del perfil ya escrito y generado**. Lo único que falta es el
> acto de crear la cuenta, que es **humano y tuyo**: Instagram exige alta manual desde un
> teléfono real, y yo no creo cuentas ni ingreso contraseñas. Vos abrís, copiás y pegás.
>
> Assets: `hermes-content/references/modelos/lucia/perfil-20260806/` ·
> `hermes-content/references/modelos/mara-bo/perfil-20260806/`

---

## 0. Qué vende cada una (había una contradicción en el repo — queda resuelta acá)

Sergio preguntó el 2026-08-06: *"¿y en sí Lucía qué va a vender?"*. Al buscar la respuesta
aparecieron **dos versiones distintas** conviviendo:

| Doc | Qué decía que vende Lucía |
|---|---|
| `ONIA_MODELOS_IA_FICHAS_20260801.md` §2 (1-ago) | **Skincare**: el SPF y el limpiador facial de Sergio, con código `LUCIA10` |
| `ONIA_EJERCITO_…_20260806.md` + `ONIA_MODELOS_PLAN_…_20260806.md` (6-ago) | **Servicios ONIA** a negocios + ser el caso vivo del producto "tu influencer IA" |

**Gana la versión del 6-ago. Lucía vende SERVICIOS ONIA.** Tres razones, en orden:

1. **Es lo único que ONIA ya cobra hoy.** El skincare está bloqueado en un gate de Sergio que
   sigue abierto: la propia ficha dice *"PENDIENTE: Sergio fija PVP en Bs"* + stock + logística
   de envío. Una modelo que publica pero no puede cobrar es un hobby caro.
2. **El funnel B2B ya existe y está probado** (`?src=` → lead al panel → Cal → reunión). El de
   e-commerce (carrito, pago, envío) no existe.
3. **Su activo más valioso no es lo que dice, es lo que ES.** Cada post suyo es un demo
   funcionando del producto de ticket alto: *"te creamos tu influencer IA"*. Un negocio que la
   ve no compra seguidores — compra SU modelo haciendo SU contenido. Eso se vende **antes** de
   que ella tenga audiencia, que es justo lo que necesitamos con una cuenta nueva.

**El skincare NO se pierde: cambia de dueña.** Si algún día hay PVP, stock y envío, el producto
va con **Mara**, que ya está posicionada en beauty/e-commerce. Mezclar en una sola cuenta
"te enseño a automatizar tu negocio" con "te vendo protector solar" arruina las dos cosas.

> **Regla que ordena esto** (de `ONIA_EJERCITO_…`): *cada modelo existe para vender algo que ya
> cobramos, desde el post 1.* Una modelo = una cosa que vender.

| | Vende | CTA | Métrica |
|---|---|---|---|
| **Lucía** | Servicios ONIA (webs, agentes, plataforma) **+ ella misma como demo** del servicio "tu influencer IA" | comentario/DM → `onia.com.bo/?src=lucia-*` → Cal | leads con `src=lucia-*` |
| **Mara** | El servicio "modelo IA para tu marca" (packs del catálogo §3.6) | DM **MODELO** → `?src=mara-*` | leads con `src=mara-*` |

Seguidores y likes son ruido hasta que haya leads atribuidos.

## 1. Perfil de Lucía

| Campo | Valor (copiar tal cual) |
|---|---|
| **Nombre** | `Lucía Antelo` |
| **Usuario** | `lucia.antelo.scz` |
| **Tipo de cuenta** | Profesional → **Creador digital** |
| **Foto de perfil** | `lucia/perfil-20260806/00-AVATAR.jpg` |
| **Enlace** | `https://onia.com.bo/?src=lucia-bio` |
| **Email** | `lucia@` del catch-all de Zoho |

> **Handle 2026-08-06:** `@lu.antelo` está **ocupado** (existe, privada o restringida);
> `lucia.antelo` (257 seg) y `lucia.ia` (81 seg) también. Queda **`lucia.antelo.scz`**.
>
> **El handle NO lleva `ia`** (decisión de Sergio, 2026-08-06). La declaración de IA es
> obligación de la **bio y de la etiqueta de IA de Instagram**, no del usuario: un handle
> con `.ia` se lee como bot y le cuesta confianza y alcance con la audiencia que necesita
> (dueños de negocio). El `.scz` la ancla en Santa Cruz — que ES su posicionamiento — y la
> separa de las dos cuentas `antelo` existentes sin parecer una copia de ellas.
>
> **Si el registro lo rechaza**, bajar por esta lista, todas verificadas LIBRES el
> 2026-08-06: `lu.antelo.scz` · `lu.antelo.bo` · `luantelo.bo` · `soylucia.bo` ·
> `lucia.antelo.oficial` · `lucia.antelo.bo`.
> *(`luantelo` a secas también está libre, pero está a un punto de la cuenta que ya existe:
> última opción.)*
>
> **Cómo verificar un handle sin registrarse** (reusable): desde una pestaña en
> `instagram.com`, `fetch('/api/v1/users/web_profile_info/?username=X', {headers:{'x-ig-app-id':'936619743392459'}})`.
> **404 = libre · 200 = ocupado.** Cargar `instagram.com/X` a secas NO sirve: sin sesión
> devuelve 200 para todo. En TikTok este método no funciona (devuelve un shell); ahí hay que
> mirarlo en el registro.

**Biografía** (103 caracteres, entra en el límite de 150):

```
Creada con IA por @oniahq 🤖
Santa Cruz de la Sierra
Te muestro cómo la IA hace vender a tu negocio 👇
```

> ⚠️ **Dependencia:** hoy la cuenta de ONIA es **`@oniaagency`**; `@oniahq` es la decisión de
> marca (`ONIA_ARQUITECTURA_MARCA_Y_RUTA_GLOBAL_20260727.md` §4) pero **todavía no está
> reclamada**. Reclamá `@oniahq` en la misma sesión en que crees a Lucía, o la bio va a
> mencionar una cuenta que no existe. Si no lo hacés ahora, poné `@oniaagency` y editá la bio
> después — la bio se cambia libremente, el handle de ONIA no conviene dejarlo al azar.

**Los primeros 6 posts** (subir en este orden, uno por día o día por medio):

| # | Imagen | Caption |
|---|---|---|
| P1 | `P1-presentacion-ugc-9x16.jpg` | Hola, soy Lucía. Sí, soy un personaje digital hecho con IA — y no lo escondo. Estoy acá para mostrarte, sin humo, qué puede hacer la IA por un negocio en Santa Cruz. Empecemos. |
| P2 | `P2-calle-scz-3x4.jpg` | Camino por el centro y veo lo mismo en cada negocio: un cartel lindo y un WhatsApp que nadie contesta. La plata no se pierde en la publicidad. Se pierde después. |
| P3 | `P3-coworking-3x4.jpg` | Tres cosas que un negocio boliviano puede automatizar esta semana sin cambiar nada de lo que ya hace: responder consultas, agendar y recordar. Comentá **AGENTE** y te paso cómo. |
| P4 | `P4-cafe-copyspace-3x4.jpg` | La mayoría de los clientes que te escriben y no compran no se fueron con la competencia. Simplemente nadie les volvió a escribir. |
| P5 | `P5-mercado-3x4.jpg` | En el mercado nadie te pregunta si usás IA. Te preguntan si tenés. Con la tecnología es igual: no importa qué usás, importa que el cliente encuentre lo que busca. |
| P6 | `P6-cafe-mesa-3x4.jpg` | Pregunta honesta: ¿cuánto tardás en contestar el mensaje de un cliente nuevo? Si la respuesta es "depende", ahí está la fuga. |

## 2. Perfil de Mara

| Campo | Valor (copiar tal cual) |
|---|---|
| **Nombre** | `Mara Vale` |
| **Usuario** | `mara.vale` |
| **Tipo de cuenta** | Profesional → **Modelo** |
| **Foto de perfil** | `mara-bo/perfil-20260806/00-AVATAR.jpg` |
| **Enlace** | `https://onia.com.bo/?src=mara-bio` |
| **Email** | `mara@` del catch-all de Zoho |

**Biografía** (108 caracteres):

```
Modelo digital creada con IA por @oniahq 🤖
Tu marca también puede tener la suya
Escribime y te muestro cómo 👇
```

*(Misma dependencia de `@oniahq` que Lucía — ver el aviso de arriba.)*

**Los primeros 6 posts:**

| # | Imagen | Caption |
|---|---|---|
| P1 | `00-AVATAR.jpg` | Soy Mara. Soy una modelo digital creada con IA por ONIA. Trabajo para marcas que quieren fotos y videos de producto sin producción, sin sesión y sin esperar fecha. |
| P2 | `P1-ugc-bano-9x16.jpg` | Así se ve una modelo IA presentando un producto. Sin estudio, sin equipo, sin agenda. Tu marca puede tener la suya, con su propia cara. |
| P3 | `P2-crema-mano-1x1.jpg` | Lo que vende un producto de skincare no es la botella: es la textura. Y esto no se fotografió — se generó. |
| P4 | `P5-mesa-productos-3x4.jpg` | Tres productos, una sola toma, cero sesión de fotos. Lo que antes era una producción entera hoy es un pedido. |
| P5 | `P3-living-3x4.jpg` | No soy una persona real y no lo escondo. Soy una herramienta de marca — la diferencia es que esta trabaja todos los días. |
| P6 | `P6-ventana-3x4.jpg` | Si tenés una marca y todavía dependés de conseguir modelo, fotógrafo y fecha para poder publicar… hablemos. Escribime **MODELO**. |

## 2-bis. Reglas de nombre de usuario de Instagram (chequear ANTES de registrar)

**Reglas de formato** (comportamiento estable de la plataforma; la Central de Ayuda no las
publica en un artículo — el validador definitivo es el formulario de registro):

| Regla | Nuestros handles |
|---|---|
| Máximo **30 caracteres** | ✅ el más largo tiene 20 |
| Solo `a-z`, `0-9`, punto `.` y guion bajo `_` | ✅ solo letras y puntos |
| **Sin** espacios, guiones `-`, `ñ`, tildes ni emojis | ✅ ojo: `lucía` con tilde **no es válido**, va `lucia` |
| **No puede terminar en punto** | ✅ |
| **No puede tener dos puntos seguidos** (`..`) | ✅ |
| No distingue mayúsculas (se guarda en minúsculas) | — |
| No usar `insta`, `ig` ni `gram` sugiriendo afiliación con Instagram (política de marca de Meta) | ✅ ninguno |

**Las dos reglas que de verdad nos pueden morder:**

1. **Similitud con una cuenta existente.** Instagram puede rechazar un usuario por parecerse
   demasiado a otro, y el dueño de la cuenta parecida puede reportar suplantación. `lu.antelo`
   **existe y es una persona real** — `lu.antelo.ia` está a un sufijo de distancia. El `.ia`
   ayuda (declara que es otra cosa), pero **es el candidato con más riesgo justamente por ser
   el más parecido**. Si preferís riesgo cero, el usuario no debe llevar el apellido real:
   `soy.lucia.ia` o `lucia.digital.bo` (ambos verificados libres) leen como marca, no como
   persona. El apellido queda igual en el **nombre visible** ("Lucía Antelo").
2. **El nombre visible solo se puede cambiar 2 veces cada 14 días.** No es el usuario, es el
   campo *Nombre*. Cargalo bien la primera vez.

**Regla de retención:** un usuario liberado no queda disponible al instante — Instagram lo
retiene un tiempo. Si `lu.antelo` se libera algún día, no aparece libre de inmediato.

## 3. Checklist de alta (tuyo, ~15 min por cuenta)

Hacer **una cuenta por vez**, no las dos el mismo día desde la misma IP y el mismo teléfono:
crear dos cuentas nuevas seguidas desde el mismo dispositivo es el patrón que Meta marca.
Dejá al menos un día entre una y otra.

1. **Email** en el catch-all de Zoho (`lucia@…` / `mara@…`).
2. **Alta en Instagram desde tu teléfono real**, con ese email. Paso 100% manual.
3. Convertir a **cuenta profesional** con la categoría de la tabla.
4. Cargar **foto de perfil, nombre, usuario, bio y enlace** de arriba.
5. **Activar la etiqueta de IA de Instagram** (Configuración → Cuenta → Etiquetas de contenido
   de IA / "AI creator"). **No es opcional**: la bio declara IA y la etiqueta también.
6. Activar **2FA por app** (authenticator) y guardar los códigos de respaldo en el vault.
7. Si pidió teléfono: usar el chip prepago del protocolo de chips
   (`ONIA_MODELOS_IA_FICHAS_20260801.md` §4.1) y, una vez verificado, **quitar el número**
   de la cuenta si Instagram lo permite.
8. **Vincular al Business Manager OniaAgency** (`1451773736711697`).
9. Subir **P1 a P6** en orden, uno por día o día por medio.
10. Avisar acá cuando estén creadas → cargo el banco de contenido y el calendario.

## 4. Reglas que no se negocian en estas 2 cuentas

- **Etiqueta de IA visible siempre.** Son marcas declaradas, no personas falsas.
- **Ninguna testimonia como usuaria.** Presentan y demuestran ("así se ve", "esto hace"),
  nunca "yo lo uso y me encanta" (FTC).
- **Nada de consejo médico ni de salud.**
- **Nunca comprar seguidores, pods, ni automatizar likes/follows/DMs.** Es exactamente la
  señal que dispara la baja, y además puede arrastrar al Business Manager comercial.
- **Las dos no interactúan entre sí.**
- El engagement de los primeros meses es **manual y dirigido**, 15-20 min/día.

## 5. Qué queda pendiente después del alta

| Pendiente | Dueño |
|---|---|
| Token de Instagram (S6) → publicación automática | Sergio (trámite ~1 h, sin App Review para cuentas propias) |
| Banco de contenido de 2 semanas + calendario | Claude / Arthur, apenas existan las cuentas |
| TikTok de ambas | Se puede publicar **hoy** por Higgsfield (`tiktok_publish`), no depende del token de Meta |
| Reels (video) | Necesita OK de gasto por lote — las imágenes ya están validadas como triviales |

---

Relacionado: `ONIA_MODELOS_PLAN_AUTOMATIZADO_20260806.md` §5 (esto cierra el paso 3-4) ·
`ONIA_MODELOS_RECETA_VISUAL_20260806.md` (cómo se generan más piezas) ·
`ONIA_MODELOS_IA_FICHAS_20260801.md` (chips, costos, precios) ·
`references/modelos/mara-bo/LEEME.md` (identidad de la Mara boliviana).
