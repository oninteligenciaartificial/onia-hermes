import type { SergioScheduleBlock } from "@/app/onia-center/types";

const WEEKDAY_ORDER = ["lunes", "martes", "miercoles", "jueves", "viernes", "sabado", "domingo"];

const COMBINING_DIACRITICS_START = String.fromCharCode(0x0300);
const COMBINING_DIACRITICS_END = String.fromCharCode(0x036f);
const COMBINING_DIACRITICS_PATTERN = new RegExp(`[${COMBINING_DIACRITICS_START}-${COMBINING_DIACRITICS_END}]`, "g");

function stripAccents(value: string): string {
  return value.normalize("NFD").replace(COMBINING_DIACRITICS_PATTERN, "");
}

function weekdayIndexFromDate(referenceDate: Date): number {
  const jsDay = referenceDate.getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export function isScheduleBlockActiveToday(dayPattern: string, referenceDate: Date): boolean {
  const [rawStart, rawEnd] = stripAccents(dayPattern.toLowerCase()).split(" a ");
  if (!rawStart || !rawEnd) {
    return false;
  }

  const startIndex = WEEKDAY_ORDER.indexOf(rawStart.trim());
  const endIndex = WEEKDAY_ORDER.indexOf(rawEnd.trim());
  if (startIndex === -1 || endIndex === -1) {
    return false;
  }

  const todayIndex = weekdayIndexFromDate(referenceDate);
  return todayIndex >= startIndex && todayIndex <= endIndex;
}

function timeLabel(referenceDate: Date): string {
  const hours = String(referenceDate.getHours()).padStart(2, "0");
  const minutes = String(referenceDate.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

export function isBlockHappeningNow(
  block: Pick<SergioScheduleBlock, "start" | "end">,
  referenceDate: Date,
): boolean {
  const nowLabel = timeLabel(referenceDate);
  const crossesMidnight = block.end <= block.start;

  if (crossesMidnight) {
    return nowLabel >= block.start || nowLabel < block.end;
  }

  return nowLabel >= block.start && nowLabel < block.end;
}

export function getTodaysScheduleBlocks(
  blocks: SergioScheduleBlock[],
  referenceDate: Date,
): SergioScheduleBlock[] {
  return blocks
    .filter((block) => isScheduleBlockActiveToday(block.dayPattern, referenceDate))
    .sort((a, b) => a.start.localeCompare(b.start));
}

// --- Timeline visual proporcional -----------------------------------------

export interface TimelineBlock {
  id: string;
  title: string;
  start: string;
  end: string;
  category: SergioScheduleBlock["category"];
  topPct: number;
  heightPct: number;
  isNow: boolean;
}

export interface DayTimeline {
  hourMarks: number[];
  blocks: TimelineBlock[];
  nowPct: number | null;
}

function timeToMinutes(hhmm: string): number {
  const [hours, minutes] = hhmm.split(":");
  return Number(hours) * 60 + Number(minutes);
}

export function buildDayTimeline(blocks: SergioScheduleBlock[], referenceDate: Date): DayTimeline {
  const today = getTodaysScheduleBlocks(blocks, referenceDate);
  if (today.length === 0) {
    return { hourMarks: [], blocks: [], nowPct: null };
  }

  const windowStart = Math.floor(Math.min(...today.map((block) => timeToMinutes(block.start))) / 60) * 60;
  const windowEnd = Math.ceil(Math.max(...today.map((block) => timeToMinutes(block.end))) / 60) * 60;
  const total = Math.max(1, windowEnd - windowStart);

  const hourMarks: number[] = [];
  for (let hour = windowStart / 60; hour <= windowEnd / 60; hour += 1) {
    hourMarks.push(hour);
  }

  const timelineBlocks: TimelineBlock[] = today.map((block) => {
    const start = timeToMinutes(block.start);
    const end = timeToMinutes(block.end);
    return {
      id: block.id,
      title: block.title,
      start: block.start,
      end: block.end,
      category: block.category,
      topPct: ((start - windowStart) / total) * 100,
      heightPct: (Math.max(0, end - start) / total) * 100,
      isNow: isBlockHappeningNow(block, referenceDate),
    };
  });

  const nowMinutes = referenceDate.getHours() * 60 + referenceDate.getMinutes();
  const nowPct =
    nowMinutes >= windowStart && nowMinutes <= windowEnd ? ((nowMinutes - windowStart) / total) * 100 : null;

  return { hourMarks, blocks: timelineBlocks, nowPct };
}
