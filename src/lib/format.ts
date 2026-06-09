type DateInput = string | Date;

const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/;

// Normalizes a Date | ISO-YYYY-MM-DD string to a YYYY-MM-DD string.
// Throws TypeError on Invalid Date or unrecognized string format.
function normalizeDate(value: DateInput, fnName: string): string {
  if (value instanceof Date) {
    if (Number.isNaN(value.getTime())) {
      throw new TypeError(`${fnName}: invalid Date object`);
    }
    return value.toISOString().slice(0, 10);
  }
  if (typeof value !== 'string' || !ISO_DATE_PREFIX.test(value)) {
    throw new TypeError(`${fnName}: invalid date "${String(value)}", expected YYYY-MM-DD`);
  }
  return value.slice(0, 10);
}

export function formatArticleDate(date: DateInput): string {
  return normalizeDate(date, 'formatArticleDate');
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

export function groupByYear<T extends { date: DateInput }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const year = normalizeDate(item.date, 'groupByYear').slice(0, 4);
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return map;
}
