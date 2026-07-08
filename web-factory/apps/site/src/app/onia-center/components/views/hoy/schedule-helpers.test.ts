import { describe, expect, it } from "vitest";
import {
  getTodaysScheduleBlocks,
  isBlockHappeningNow,
  isScheduleBlockActiveToday,
} from "./schedule-helpers";
import type { SergioScheduleBlock } from "@/app/onia-center/types";

const MONDAY = new Date("2024-01-01T10:00:00");
const SATURDAY = new Date("2024-01-06T10:00:00");
const SUNDAY = new Date("2024-01-07T10:00:00");

describe("isScheduleBlockActiveToday", () => {
  it("returns true when today falls inside a Lunes a viernes range", () => {
    expect(isScheduleBlockActiveToday("Lunes a viernes", MONDAY)).toBe(true);
  });

  it("returns false when today falls outside a Lunes a viernes range", () => {
    expect(isScheduleBlockActiveToday("Lunes a viernes", SATURDAY)).toBe(false);
  });

  it("returns true when today falls inside a Lunes a sabado range", () => {
    expect(isScheduleBlockActiveToday("Lunes a sabado", SATURDAY)).toBe(true);
  });

  it("returns false for an unrecognized day pattern", () => {
    expect(isScheduleBlockActiveToday("Todos los dias", SUNDAY)).toBe(false);
  });
});

describe("isBlockHappeningNow", () => {
  it("returns true when the reference time is within start and end", () => {
    const reference = new Date("2026-07-06T07:15:00");
    expect(isBlockHappeningNow({ start: "07:00", end: "07:30" }, reference)).toBe(true);
  });

  it("returns false when the reference time is before start", () => {
    const reference = new Date("2026-07-06T06:59:00");
    expect(isBlockHappeningNow({ start: "07:00", end: "07:30" }, reference)).toBe(false);
  });

  it("returns false when the reference time equals end", () => {
    const reference = new Date("2026-07-06T07:30:00");
    expect(isBlockHappeningNow({ start: "07:00", end: "07:30" }, reference)).toBe(false);
  });
});

describe("getTodaysScheduleBlocks", () => {
  const blocks: SergioScheduleBlock[] = [
    {
      id: "sergio-sales-block",
      dayPattern: "Lunes a viernes",
      start: "08:30",
      end: "10:30",
      title: "Ventas, CRM y seguimientos",
      category: "sales",
      strictness: "fixed",
      meetingPolicy: "emergency_only",
      note: "Solo leads, llamadas, propuestas y proximas acciones.",
      visibility: "sergio_private",
    },
    {
      id: "sergio-ceo-plan",
      dayPattern: "Lunes a viernes",
      start: "07:00",
      end: "07:30",
      title: "Plan CEO: caja, ventas, 3 prioridades",
      category: "planning",
      strictness: "fixed",
      meetingPolicy: "blocked",
      note: "Definir una accion de venta, una accion de entrega y una accion personal protegida.",
      visibility: "sergio_private",
    },
    {
      id: "sergio-weekend-block",
      dayPattern: "Sabado a domingo",
      start: "10:00",
      end: "12:00",
      title: "Bloque de fin de semana",
      category: "personal",
      strictness: "flex",
      meetingPolicy: "blocked",
      note: "No aplica entre semana.",
      visibility: "sergio_private",
    },
  ];

  it("returns only today's blocks sorted by start time", () => {
    const result = getTodaysScheduleBlocks(blocks, MONDAY);
    expect(result.map((block) => block.id)).toEqual(["sergio-ceo-plan", "sergio-sales-block"]);
  });
});
