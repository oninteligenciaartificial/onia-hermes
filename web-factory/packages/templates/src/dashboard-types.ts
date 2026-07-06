export type DashboardKpi = {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  context: string;
};

export type DashboardPoint = { label: string; value: number };

export type DashboardSeries = { name: string; points: DashboardPoint[] };

export type DashboardChart = {
  title: string;
  unit: string;
  type: "bar" | "line" | "donut" | "sparkline";
  points: DashboardPoint[];
  series?: DashboardSeries[];
};

export type DashboardHeroPanel =
  | { kind: "metric-trend"; kpi: DashboardKpi; points: DashboardPoint[] }
  | {
      kind: "queue";
      title: string;
      items: Array<{
        titulo: string;
        estado: "pendiente" | "urgente" | "al-dia";
        meta: string;
        url?: string;
      }>;
    };

export type DashboardSidePanel = {
  title: string;
  items: Array<{ label: string; value: string; initial?: string }>;
};

export type DashboardNavGroup = { group?: string; items: string[] };
