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
