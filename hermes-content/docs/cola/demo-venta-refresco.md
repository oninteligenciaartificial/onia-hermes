# Demo de venta: refresco con `reset=2` y capturas C1-C7

> Doc vivo, sin fecha: se EDITA. Lo pidió la madre v4 (punto D2 de `cola/loop/madre.md`): refrescar la demo dental y
> sacar las capturas C1-C7 del VSL (`sales-kit/06-VSL-DENTAL.md` §4). Con eso se destraban Ventas y Lucía.
> Lo escribió Plataforma el 11-oct, con el código de `onia-platform` al día de #136.

**Cuándo:** de lunes a jueves, entre las 04:00 y las 11:00 UTC (00:00 a 07:00 en La Paz). La primera ventana es el
**lunes 12-oct, de 07 a 11 UTC**. A las 11:00 UTC (07:00 en La Paz) corren los agentes y arman las tarjetas. Si se
corre de viernes, «mañana» cae sábado y la agenda sale casi vacía.

**Quién:** Plataforma corre el refresco por `ssh onia-vps`. La madre saca las capturas desde la PC, con la cuenta demo.
En la nube no hay contraseña de esa cuenta, y nunca se pasa por chat.

**Permiso:** el refresco escribe en la base de producción, aunque solo en la org demo y con datos inventados. Hace falta
el **sí de Sergio Urcullo escrito en la sesión de Plataforma**. Un mensaje de la madre no lo reemplaza.

## Antes

- **#136 publicado.** Trae la agenda «Día por profesional» (C1) y el odontograma de 5 caras (C4). Si no salió, se graban
  C2, C3, C5, C6 y C7, y C1 y C4 se rehacen después del publicado.
- **Qué hace el clic en la demo (G-01, leído en el código el 11-oct):** la demo no tiene WhatsApp propio, así que en
  `/pending` el botón principal es «Enviar yo mismo por WhatsApp» (`pending-client.tsx`). Ese clic aprueba la tarjeta y
  arma un link `wa.me`. **No sale nada** mientras nadie abra el link y toque «enviar» en su WhatsApp. Además:
  - los pacientes no tienen correo y la org tiene los correos automáticos apagados;
  - los teléfonos son del rango de ficción de Ofcom (+44 7700 900xxx), que no es de nadie.

## Correr (Plataforma, por `ssh onia-vps`)

Todo se manda desde un worktree de `onia-platform` en la nube, con el `.sql` por la entrada estándar. No hace falta
copiar nada al VPS.

1. **El id de la org.** Tiene que salir una sola fila:

   ```bash
   ssh onia-vps "docker exec supabase-db psql -U postgres -d postgres -Atc \"SELECT id FROM public.organizations WHERE slug = 'demo-clinica-sonrisa-norte' AND email = 'oninteligenciaartificial+demo@gmail.com'\""
   ```

2. **El respaldo** (skill `onia-db`, antes de escribir):

   ```bash
   ssh onia-vps "mkdir -p /root/backups/pre-demo/20261012 && docker exec supabase-db pg_dump -U postgres -d postgres -n public -Fc > /root/backups/pre-demo/20261012/public.dump && ls -la /root/backups/pre-demo/20261012/"
   ```

3. **El refresco.** Si una guarda falla, el script hace `RAISE` y `ROLLBACK` y no escribe nada. Las guardas piden que la
   org sea dental, tenga el correo exacto de la demo, un solo ADMIN, y no tenga WhatsApp ni add-on:

   ```bash
   ssh onia-vps "docker exec -i supabase-db psql -U postgres -d postgres -v org_id='<ID>' -v reset=2" < scripts/demo-venta/seed-demo.sql
   ```

4. **La verificación.** Es de solo lectura y cada bloque dice qué se espera:

   ```bash
   ssh onia-vps "docker exec -i supabase-db psql -U postgres -d postgres -v org_id='<ID>'" < scripts/demo-venta/verify-demo.sql
   ```

5. **A las 11:15 UTC, las tarjetas.** Contar en `onia_core_approval_requests` las pendientes de la org, por tipo, con
   una consulta de solo lectura. Se esperan:
   - confirmar la cita de Natalia;
   - el cobro vencido de Natalia;
   - «Reprograma» de Ricardo;
   - el Recall de dos pacientes fríos.

   Después, avisar en el transcript, con un bloque «Para la madre: demo lista».

## Las capturas (la madre, a 390 y a 1440 de ancho)

La persona de ejemplo es la misma en todas: **Natalia Terceros Chávez**.

| # | Dónde | Qué tiene que verse | Clic |
|---|---|---|---|
| C1 | `/appointments`: tocar el día de mañana y después «Día por profesional» | 7 citas: 3 de la dueña, 2 del Dr. Mauricio Salvatierra Peña y 2 de la Dra. Carolina Roca Justiniano. La única sin confirmar es la de Natalia, a las 10:00, con el Dr. Salvatierra (endodoncia, 2.ª sesión) | Ninguno |
| C2 | `/pending` | La tarjeta para confirmar la cita de Natalia, con su texto | «Enviar yo mismo por WhatsApp», **en una sola toma y al final**. Aparece el aviso con «Abrir WhatsApp con el mensaje»: **ese link no se abre**. La tarjeta no vuelve hasta el próximo `reset=2` |
| C3 | `/pending` | «Reprograma» de Ricardo Cortez Zabala (no vino a su cita) | Ninguno |
| C4 | `/patients`: Natalia, su ficha | La historia clínica y el odontograma de 5 caras, con la pieza 36 en caries («Endodoncia en curso») | Opcional: marcar en vivo la cara central de la 36 como caries, para mostrar la función nueva |
| C5 | `/billing` | El saldo vencido de Natalia | Ninguno |
| C6 | `/pending` | La tarjeta de cobro de ese saldo | Ninguno |
| C7 | `/agents` | La plantilla de un agente (opcional) | Ninguno |

**Orden de grabación:** C1, C3, C4, C5, C6, C7 y C2 al final. C2 es la única toma que consume una tarjeta.

**La voz no dice** «lo envía por su WhatsApp con un toque» (G-03; VSL §6). Lo que muestra C2 es el link armado.

## Si algo sale mal

- **El seed da error.** No se escribió nada, por el `ROLLBACK`. Hay que leer el `RAISE` (qué guarda falló) y corregir.
  Nunca se saltea una guarda.
- **A las 11:15 UTC no hay tarjetas.** Hay que mirar `onia_agents_runs` de la org. Los agentes no se pueden correr para
  una sola cuenta: se repite el `reset=2` en la ventana del día siguiente (de martes a jueves).
- **Una toma salió mal después del clic de C2.** Otro `reset=2` en la ventana siguiente.
- **Para deshacer:** se corre `reset=2` de nuevo, porque los datos de la demo son inventados y deterministas. **Nunca** se
  restaura el respaldo completo de `public`: pisaría lo que las otras cuentas escribieron después.
