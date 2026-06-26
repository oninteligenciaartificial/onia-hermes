# ONIA Vendor Access and Calendar Runbook 2026

Estado: operativo en repo, pendiente de conectar credenciales reales.
Fecha: 2026-06-26

## Decision

La vendedora no recibe acceso al correo principal de ONIA.

- Correo publico: `business@onia.com.bo`.
- Cuenta operativa de agenda: `business@onia.com.bo` cuando Sergio confirme acceso directo.
- Cuenta de respaldo/recuperacion: `oninteligenciaartificial@gmail.com`.
- Sistema donde trabaja la vendedora: `/onia-center/equipo`.
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

La vendedora entra con su propio usuario de ONIA Center, no con el correo de
ONIA.

Ruta:

```text
/onia-center/login?next=/onia-center/equipo
```

Crear usuario cuando las variables Supabase esten disponibles:

```powershell
$env:ONIA_CENTER_SUPABASE_URL="<url-supabase>"
$env:ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY="<service-role-key>"
$env:ONIA_CENTER_SUPABASE_SCHEMA="onia_center"
$env:ONIA_CENTER_SELLER_PASSWORD="<password-seguro-no-commitear>"

npm run onia-center:auth-user -- --email "vendedora@onia.com.bo" --password-env ONIA_CENTER_SELLER_PASSWORD --user-key seller_001 --display-name "Vendedora ONIA" --role seller --login-alias "vendedora"
```

Si todavia no existe `vendedora@onia.com.bo`, usar temporalmente un correo
personal de ella, pero el sistema debe mostrarla como ONIA Comercial.

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

1. Solicitud interna en ONIA Center.
2. Confirmacion real en Cal/Google Calendar despues de aprobacion de ONIA.

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
  `https://onia-calcom.hqdqgh.easypanel.host`.
- Dominio final pendiente: `https://cal.onia.com.bo`.
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
- La vendedora ve sus llamadas desde ONIA Center.
- Si necesita bloquear horario, se registra en ONIA Center o calendario
  compartido.

Version profesional:

- Crear `ventas@onia.com.bo` o `vendedora@onia.com.bo`.
- Usar Cal Teams si ONIA necesita cuentas separadas, round-robin o eventos por
  persona.

## Bloqueos actuales

En esta sesion local no estan configuradas:

- `ONIA_CENTER_SUPABASE_URL`;
- `ONIA_CENTER_SUPABASE_SERVICE_ROLE_KEY`;
- `ONIA_CENTER_SUPABASE_ANON_KEY`.

Por eso no se puede crear el usuario real desde aqui todavia.

Tampoco se puede confirmar acceso directo a `business@onia.com.bo` desde el
conector Gmail actual, porque el conector conectado es
`oninteligenciaartificial@gmail.com`.

## Checklist de activacion

1. Confirmar acceso directo a `business@onia.com.bo`.
2. Activar 2FA y rotar password si fue expuesto.
3. Configurar Cal self-host con `business@onia.com.bo`.
4. Activar Requires Confirmation en todos los eventos publicos.
5. Cargar variables Supabase en entorno seguro.
6. Crear usuario `seller_001`.
7. Probar login de la vendedora en `/onia-center/equipo`.
8. Crear lead de prueba asignado a vendedora.
9. Verificar que Sergio ve todo y vendedora solo ve lo suyo.
10. Conectar webhook Cal -> n8n -> ONIA Center -> Telegram.
