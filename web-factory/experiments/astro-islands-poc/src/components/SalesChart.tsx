import { AreaChart, Card } from "@tremor/react";
import { useState } from "react";

type Period = "7d" | "30d" | "90d";

type Point = { date: string; Ingresos: number; Sesiones: number };

// Demo data. In a real build this would come from the client's data layer; the
// point of the PoC is that the chart is interactive on the client, not the data.
const SERIES: Record<Period, Point[]> = {
  "7d": [
    { date: "Lun", Ingresos: 3200, Sesiones: 120 },
    { date: "Mar", Ingresos: 3800, Sesiones: 145 },
    { date: "Mie", Ingresos: 3000, Sesiones: 138 },
    { date: "Jue", Ingresos: 4100, Sesiones: 162 },
    { date: "Vie", Ingresos: 4500, Sesiones: 190 },
    { date: "Sab", Ingresos: 5200, Sesiones: 210 },
    { date: "Dom", Ingresos: 4300, Sesiones: 176 },
  ],
  "30d": [
    { date: "Sem 1", Ingresos: 21000, Sesiones: 920 },
    { date: "Sem 2", Ingresos: 24500, Sesiones: 1010 },
    { date: "Sem 3", Ingresos: 22800, Sesiones: 980 },
    { date: "Sem 4", Ingresos: 28600, Sesiones: 1180 },
  ],
  "90d": [
    { date: "Ene", Ingresos: 82000, Sesiones: 3600 },
    { date: "Feb", Ingresos: 96000, Sesiones: 4100 },
    { date: "Mar", Ingresos: 104000, Sesiones: 4550 },
  ],
};

const PERIODS: Period[] = ["7d", "30d", "90d"];

const currency = (value: number): string => `Bs. ${Intl.NumberFormat("es-BO").format(value)}`;

export default function SalesChart() {
  const [period, setPeriod] = useState<Period>("30d");

  return (
    <Card className="mx-auto max-w-none">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-tremor-content text-sm">Ingresos y sesiones</p>
          <p className="text-tremor-content-strong text-lg font-semibold">Rendimiento del periodo</p>
        </div>
        <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1" role="group" aria-label="Rango">
          {PERIODS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              aria-pressed={period === option}
              className={`min-h-8 rounded-md px-3 text-sm font-semibold transition ${
                period === option ? "bg-indigo-600 text-white" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
      <AreaChart
        className="mt-4 h-72"
        data={SERIES[period]}
        index="date"
        categories={["Ingresos", "Sesiones"]}
        colors={["indigo", "emerald"]}
        valueFormatter={(value) => (value >= 1000 ? currency(value) : String(value))}
        showLegend
        showGridLines
        yAxisWidth={64}
      />
    </Card>
  );
}
