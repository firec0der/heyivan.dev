import { describe, expect, it } from 'vitest';

import { formatArticleDate, formatYearRange, groupByYear } from './format';

describe('formatArticleDate', () => {
  it('returns the ISO date as-is', () => {
    expect(formatArticleDate('2026-03-22')).toBe('2026-03-22');
  });

  it('exposes the year in the leading slice', () => {
    expect(formatArticleDate('2026-03-22').slice(0, 4)).toBe('2026');
  });
});

describe('formatYearRange', () => {
  it('renders numeric range', () => {
    expect(formatYearRange(2020, 2024)).toBe('2020 — 2024');
  });

  it('renders open-ended range with "present"', () => {
    expect(formatYearRange(2024, 'present')).toBe('2024 — Present');
  });

  it('accepts case variations of "present"', () => {
    expect(formatYearRange(2024, 'Present')).toBe('2024 — Present');
    expect(formatYearRange(2024, 'PRESENT')).toBe('2024 — Present');
  });

  it('renders string start year', () => {
    expect(formatYearRange('2020', 2024)).toBe('2020 — 2024');
  });
});

describe('groupByYear', () => {
  it('groups items by their YYYY prefix', () => {
    const items = [
      { date: '2026-03-22', id: 'a' },
      { date: '2026-01-04', id: 'b' },
      { date: '2025-12-01', id: 'c' }
    ];
    const grouped = groupByYear(items);
    expect([...grouped.keys()]).toEqual(['2026', '2025']);
    expect(grouped.get('2026')!.map((i) => i.id)).toEqual(['a', 'b']);
    expect(grouped.get('2025')!.map((i) => i.id)).toEqual(['c']);
  });

  it('preserves input order within each year', () => {
    const items = [
      { date: '2026-01-04', id: 'a' },
      { date: '2026-03-22', id: 'b' }
    ];
    const grouped = groupByYear(items);
    expect(grouped.get('2026')!.map((i) => i.id)).toEqual(['a', 'b']);
  });

  it('returns an empty map for empty input', () => {
    const grouped = groupByYear([]);
    expect(grouped.size).toBe(0);
  });
});
