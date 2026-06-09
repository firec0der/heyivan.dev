export function formatArticleDate(isoDate: string): string {
  return isoDate;
}

export type YearOrPresent = number | 'present';

function isYear(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value);
}

export function formatYearRange(start: number, end: YearOrPresent): string {
  if (!isYear(start)) {
    throw new TypeError(
      `formatYearRange: start must be an integer year, got ${typeof start}: ${String(start)}`
    );
  }
  if (end !== 'present' && !isYear(end)) {
    throw new TypeError(
      `formatYearRange: end must be an integer year or 'present', got ${typeof end}: ${String(end)}`
    );
  }
  return `${start} — ${end === 'present' ? 'Present' : end}`;
}

const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/;

function extractYear(date: string | Date): string {
  if (date instanceof Date) {
    if (Number.isNaN(date.getTime())) {
      throw new TypeError(`groupByYear: invalid Date object`);
    }
    return String(date.getUTCFullYear());
  }
  if (typeof date !== 'string' || !ISO_DATE_PREFIX.test(date)) {
    throw new TypeError(`groupByYear: invalid date "${String(date)}", expected YYYY-MM-DD`);
  }
  return date.slice(0, 4);
}

export function groupByYear<T extends { date: string | Date }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const year = extractYear(item.date);
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return map;
}
