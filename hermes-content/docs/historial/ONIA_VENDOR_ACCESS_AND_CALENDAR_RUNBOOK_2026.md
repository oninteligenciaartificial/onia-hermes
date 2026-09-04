# Onia Vendor Access and Calendar Runbook 2026

Estado: operativo en dominio publico, con usuario vendedor inicial creado.
Fecha: 2026-06-28

## Decision

La vendedora no recibe acceso al correo principal de Onia.

- Correo publico: `business@onia.com.bo`.
- Cuenta operativa de agenda: `business@onia.com.bo` cuando Sergio confirme acceso directo.
- Cuenta de respaldo/recuperacion: `oninteligenciaartificial@gmail.com`.
- Sistema donde trabaja la vendedora:
  `https://center.onia.com.bo/onia-center/equipo`.
- Rol: `seller`.
- User key inicial recomendado: `seller_001`.

## Regla de seguridad

No compartir password de `business@onia.com.bo` con vendedores, colaboradores o
freelancers.

Si una contrasena fue compartida por chat, tratarla como expuesta:

1. usarla solo para recuperar/configurar si es estrictamente necesario;
2. activar 2FA;
3. crear usuarios separados para colaboradores;
4. rotar la contrasena despues de terminar la configuracion.

## Acceso de la vendedora

La vendedora entra con su propio usuario de Onia Center, no con el correo de
Onia.

Ruta:

```text
https://center.onia.com.bo/onia-center/login?next=/onia-center/equipo
```

Usuario inicial creado el 2026-06-28:

- Login alias: `vendedora`.
- Email tecnico: `vendedora@onia.com.bo`.
- User key: `seller_001`.
- Rol: `seller`.
- Scope: `seller_basic`.
- Archivo local con password inicial:
  `C:\Users\PC\.onia\onia-center-access-20260628.txt`.

Para crear o resetear vendedores:

```powershell
$env:ONIA_CENTER_SUPABASE_URL="<url-supabase>"
$env:ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
$env:ONIA_CENTER_SUPABASE_SCHEMA="onia_center"
$env:ONIA_CENTER_SELLER_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "vendedora@onia.com.bo" --password-env ONIA_CENTER_SELLER_PASSWORD --user-key seller_001 --display-name "Vendedora ONIA" --role seller --login-alias "vendedora"
```

Si todavia no existe `vendedora@onia.com.bo`, usar temporalmente un correo
personal de ella, pero el sistema debe mostrarla como Onia Comercial.

## Que ve

La vista segura `/onia-center/equipo` carga datos por API filtrada.

La vendedora puede ver:

- leads asignados a `seller_001`;
- tareas asignadas a su usuario;
- llamadas asignadas o solicitadas para ella;
- notas propias;
- ideas propias o `team_safe`;
- catalogo comercial visible.

No puede ver:

- capital de Sergio;
- deuda exacta;
- caja real completa;
- utilidad privada;
- Nuvia lotes/capital;
- calendario personal de Sergio;
- credenciales;
- gastos internos sensibles;
- aprobaciones de pagos, descuentos o comisiones.

## Agenda comercial

La agenda se maneja en dos capas:

1. Solicitud interna en Onia Center.
2. Confirmacion real en Cal/Google Calendar despues de aprobacion de Onia.

En el formulario de lead se registra:

- responsable del lead;
- quien toma la llamada;
- ventana sugerida;
- nota para la llamada;
- siguiente accion.

Reglas:

- La vendedora puede registrar una llamada para ella, Sergio o Arthur.
- Si la reunion es sensible, tecnica o de alto valor, debe tomarla Sergio.
- Si es seguimiento comercial normal, puede tomarla la vendedora.
- Si la vendedora crea el lead, el sistema fuerza propiedad a su sesion.
- Si Sergio crea el lead, puede asignarlo a `seller_001`.

## Cal y Google Calendar

Configuracion recomendada:

- Cal publico principal: self-host en
  `https://cal.onia.com.bo`.
- Dominio temporal anterior: `https://onia-calcom.hqdqgh.easypanel.host`.
- Cal hosted gratis: fallback solamente si self-host bloquea una reserva real.
- Cuenta publica: `business@onia.com.bo`.
- Nombre publico: `ONIA | Agenda Comercial`.
- Horarios: lunes a sabado, 14:00 a 20:00.
- Domingo cerrado.
- Confirmacion requerida antes de que una reunion sea definitiva.
- Telegram debe avisar a Sergio/Arthur y, si corresponde, a la vendedora.

La vendedora no debe administrar Cal con la cuenta principal.

MVP:

- Sergio/ONIA aprueba reuniones.
- La vendedora ve sus llamadas desde Onia Center.
- Si necesita bloquear horario, se registra en Onia Center o calendario
  compartido.

Version profesional:

- Crear `ventas@onia.com.bo` o `vendedora@onia.com.bo`.
- Usar Cal Teams si Onia necesita cuentas separadas, round-robin o eventos por
  persona.

## Bloqueos actuales

- Falta configurar event types finales dentro de Cal.
- Falta conectar Google Calendar real y probar disponibilidad.
- Falta conectar webhook Cal -> n8n -> Onia Center -> Telegram.
- Falta confirmar acceso directo y 2FA de `business@onia.com.bo`.

## Checklist de activacion

1. Confirmar acceso directo a `business@onia.com.bo`.
2. Activar 2FA y rotar password si fue expuesto.
3. Configurar Cal self-host con `business@onia.com.bo`.
4. Activar Requires Confirmation en todos los eventos publicos.
5. Cargar variables Supabase en entorno seguro. Hecho en VPS.
6. Crear usuario `seller_001`. Hecho.
7. Probar login de la vendedora en `/onia-center/equipo`. Hecho por API.
8. Crear lead de prueba asignado a vendedora.
9. Verificar que Sergio ve todo y vendedora solo ve lo suyo.
10. Conectar webhook Cal -> n8n -> Onia Center -> Telegram.
