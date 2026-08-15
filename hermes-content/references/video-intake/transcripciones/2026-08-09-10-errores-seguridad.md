# Lectura completa — 10-errores-seguridad

- Fuente: https://www.instagram.com/p/Db1JbQzshyA/
- Motor: Gemini nativo (video + audio), 2026-08-09
- Cobertura: video completo, no muestreo de fotogramas

---

Aquí tienes el análisis detallado del video:

---

### 1. RESUMEN
El video expone 10 de los errores de seguridad más comunes al desarrollar aplicaciones web o proyectos que integran Inteligencia Artificial. La creadora enumera de forma rápida y visual vulnerabilidades frecuentes en desarrollo de software, tales como la falta de *rate limiting*, llaves de API expuestas en el *frontend*, archivos de configuración subidos a repositorios públicos y la falta de registros o logs. El mensaje central busca concienciar a los desarrolladores principiantes sobre la importancia de proteger sus sistemas antes de lanzarlos a producción.

---

### 2. TIMELINE POR SECCIONES

* **[00:00 - 00:03] Introducción / Gancho**
  * **QUÉ SE VE:** Una joven en exteriores sosteniendo un micrófono de solapa cerca de su rostro. Aparece un título explicativo sobre el tema.
  * **QUÉ SE DICE:** *(Música/efecto)* "...hecha con IA es segura. Versión principiante."

* **[00:03 - 00:08] 1. Rate limiting**
  * **QUÉ SE VE:** Infografía superpuesta que ilustra un servidor bajo ataque saturado por peticiones (error 429).
  * **QUÉ SE DICE:** "¿Tienes el límite de request activo o cualquiera puede hacer mil peticiones hasta saturarte el sistema?"

* **[00:08 - 00:12] 2. API Keys**
  * **QUÉ SE VE:** Gráfico comparativo entre almacenar credenciales en el *Frontend* (no seguro) versus el *Backend* (seguro).
  * **QUÉ SE DICE:** "¿Tus llaves están en el backend o las dejaste de regalito en el frontend?"

* **[00:12 - 00:17] 3. RLS (Row Level Security)**
  * **QUÉ SE VE:** Esquema de una tabla con niveles de acceso de usuarios (bloqueado/permitido por fila).
  * **QUÉ SE DICE:** "¿Cada tabla tiene reglas de acceso o cualquier usuario puede ver los datos de todo el mundo?"

* **[00:17 - 00:22] 4. Variables de entorno**
  * **QUÉ SE VE:** Diagrama comparativo entre subir un archivo `.env` a un repositorio (peligroso) o ignorarlo con `.gitignore` (seguro).
  * **QUÉ SE DICE:** "¿Tus .env están protegidos o los subiste a tu repositorio de GitHub sin darte cuenta?"

* **[00:22 - 00:27] 5. Validación de inputs**
  * **QUÉ SE VE:** Gráfico de un embudo/filtro procesando entradas de usuario peligrosas (ej. SQL injection) para convertirlas en datos validados.
  * **QUÉ SE DICE:** "¿Estás filtrando lo que entra o estás confiando plenamente en que tu usuario no te vaya a meter nada raro?"

* **[00:27 - 00:30] 6. Base de datos**
  * **QUÉ SE VE:** Comparativa visual entre bases de datos públicas (abiertas a cualquiera) y privadas (acceso restringido).
  * **QUÉ SE DICE:** "¿Revisaste que no haya ninguna tabla abierta por defecto al público?"

* **[00:30 - 00:35] 7. Autenticación**
  * **QUÉ SE VE:** Diagrama de un formulario de login conectado al acceso a rutas protegidas (`/dashboard`).
  * **QUÉ SE DICE:** "¿Tus rutas están realmente protegidas o cualquiera puede entrar sin permiso?"

* **[00:35 - 00:41] 8. Errores**
  * **QUÉ SE VE:** Ejemplo comparativo entre mostrar errores técnicos internos (Internal Server Error 500 con traza de código) vs. un mensaje de error limpio al usuario.
  * **QUÉ SE DICE:** "¿Tus errores muestran realmente información útil o estás exponiendo datos internos al usuario?"

* **[00:41 - 00:45] 9. En Endpoints Admin/debug**
  * **QUÉ SE VE:** Gráfico de un panel de administración/debug mostrando accesos bloqueados y protegidos.
  * **QUÉ SE DICE:** "¿Los desactivaste? ¿Los dejaste accesibles en producción?"

* **[00:45 - 00:49] 10. Logging**
  * **QUÉ SE VE:** Captura de un dashboard con métricas de seguridad y gráficos de monitorización activa en tiempo real.
  * **QUÉ SE DICE:** "¿Y tienes realmente algún registro para detectar ataques o te enteras cuando ya se te metieron?"

* **[00:49 - 00:54] Llamado a la Acción (CTA)**
  * **QUÉ SE VE:** La creadora hablando directamente a la cámara mientras sostiene el micrófono. Texto superpuesto en pantalla.
  * **QUÉ SE DICE:** "Comenta “seguridad” y te enviaré al DM el cómo resolverlos."

---

### 3. TEXTO EN PANTALLA

* **00:00 - 00:03:** `10 Errores de Seguridad que están en TODAS las Apps con IA`
* **00:02 - 00:03:** `Versión: niños 🥺`
* **00:03 - 00:08:** `1. Rate limiting` | `1 Servidor bajo ataque - Demasiadas solicitudes`
* **00:08 - 00:12:** `2. API Keys` | `2 Frontend vs Backend - Dónde guardar tus claves`
* **00:12 - 00:17:** `3. RLS` | `3 Seguridad por fila - Bloquea según el usuario`
* **00:17 - 00:22:** `4. Variables de entorno` | `3 Archivo .env en repositorios - Nunca subas tus claves`
* **00:22 - 00:27:** `5. Validación de imputs` | `5 Validación de entradas - No confíes en lo que llega del usuario`
* **00:27 - 00:30:** `6. Base de datos` | `6 Bases de datos - Define quién puede acceder`
* **00:30 - 00:35:** `7. Autenticación` | `7 Login y rutas protegidas - Acceso seguro, datos privados`
* **00:35 - 00:41:** `8. Errores` | `8 Errores técnicos vs mensaje seguro - Información útil, no exposición`
* **00:41 - 00:45:** `9. En Endpoints Admin/debug` | `9 Panel admin / debug - Control seguro, sin accesos no autorizados`
* **00:45 - 00:49:** `10. Logging` | `Monitorización activa`
* **00:49 - 00:54:** `Comenta “seguridad”`

---

### 4. CONCLUSIÓN / CTA
* **Conclusión:** El video resume las prácticas fundamentales de ciberseguridad que todo creador o desarrollador de software debe revisar antes de publicar una aplicación.
* **CTA:** La creadora le pide a la audiencia escribir la palabra **"seguridad"** en los comentarios para enviarles automáticamente por mensaje privado (DM) una guía o solución para corregir cada uno de los 10 errores.


---

## Transcripcion literal (Whisper / Speaches, verbatim)

Modelo: `Systran/faster-whisper-small` · 11 segmentos · 164 palabras · 54.1 s

```
[00:00.0 -> 00:04.0] Vamos a ver si tu app hecho con IA es segura, versión principiante.
[00:04.2 -> 00:08.8] Tienes el límite de récord está activo o cualquier puede hacer mil peticiones hasta saturarte el sistema.
[00:09.0 -> 00:12.7] Tus llaves están en el backend o las dejaste regalita en el frontend.
[00:12.9 -> 00:17.9] Cada tabla tiene reglas de acceso o cualquier usuario puede ver los datos de todo el mundo.
[00:18.1 -> 00:22.6] Tus puntos ENF están protegidos o lo subiste a tu repositario de Github sin darte cuenta.
[00:23.0 -> 00:27.1] Estás filtrando lo que entra o estás confiando plenamente en que tu usuario no te vaya a meter nada raro.
[00:27.1 -> 00:30.6] Revisaste que no haya ninguna tabla abierta por defecto al público.
[00:31.0 -> 00:35.5] Tus rutas están realmente protegidas o cualquiera puede entrar sin permiso.
[00:36.0 -> 00:41.5] Tus errores muestran realmente información útil o estás exponiendo datos internos al usuario.
[00:41.7 -> 00:49.4] Los desactivaste, los dejaste accesibles en producción y tienes realmente algún registro para detectar ataques o te enteras cuando ya se te metieron.
[00:49.7 -> 00:53.6] Comenta seguridad y te enviaré al DM el cómo resolverlos.
```
