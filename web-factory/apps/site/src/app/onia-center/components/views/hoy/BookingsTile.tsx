import type { CalcomBooking } from "@/lib/onia-center-store";

/**
 * Proximas reuniones, leidas de nuestro Cal.com (via webhook -> calcom_bookings).
 * Ocupa el lugar que tenia la cola de aprobaciones: lo que Sergio opera de
 * verdad cada dia son reuniones, no revisiones.
 */

interface BookingsTileProps {
  bookings: CalcomBooking[];
}

function fmtDate(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("es-BO", {
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/La_Paz",
  });
}

export function BookingsTile({ bookings }: BookingsTileProps) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <header className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold">Próximas reuniones</h2>
        <span className="text-xs text-muted-foreground">Cal.com · se registran solas</span>
      </header>
      {bookings.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Sin reuniones agendadas. Cada reserva en Cal aparece acá sola y confirma la reunión
          del lead en el pipeline.
        </p>
      ) : (
        <ul className="mt-2 space-y-1.5">
          {bookings.map((booking) => (
            <li
              key={booking.uid}
              className="flex items-center justify-between gap-3 rounded-md border border-border bg-background px-3 py-2 text-sm"
            >
              <span>
                <span className="font-medium">{booking.attendeeName || booking.title}</span>
                {booking.notes ? (
                  <span className="ml-2 hidden text-xs text-muted-foreground sm:inline">
                    {booking.notes.slice(0, 60)}
                  </span>
                ) : null}
              </span>
              <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">
                {fmtDate(booking.startTime)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
