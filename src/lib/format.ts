export function formatArticleDate(isoDate: string): string {
  return isoDate;
}

export function formatYearRange(start: number | string, end: number | string): string {
  const endLabel =
    typeof end === 'string' && end.toLowerCase() === 'present' ? 'Present' : String(end);
  return `${start} — ${endLabel}`;
}

export function groupByYear<T extends { date: string }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const year = item.date.slice(0, 4);
    const list = map.get(year) ?? [];
    list.push(item);
    map.set(year, list);
  }
  return map;
}
