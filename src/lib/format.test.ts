import { describe, expect, it } from 'vitest';

import { formatArticleDate, formatMonthRange, formatYearRange, groupByYear } from './format';

describe('formatArticleDate', () => {
  it('returns an ISO YYYY-MM-DD string as-is', () => {
    expect(formatArticleDate('2026-03-22')).toBe('2026-03-22');
  });

  it('trims any time suffix on ISO datetime strings', () => {
    expect(formatArticleDate('2026-03-22T12:30:00Z')).toBe('2026-03-22');
  });

  it('normalizes a Date object to YYYY-MM-DD (UTC)', () => {
    expect(formatArticleDate(new Date(Date.UTC(2026, 2, 22)))).toBe('2026-03-22');
  });

  it('throws on a malformed string', () => {
    expect(() => formatArticleDate('tomorrow')).toThrow(TypeError);
    expect(() => formatArticleDate('26-3-22')).toThrow(TypeError);
  });

  it('throws on Invalid Date', () => {
    expect(() => formatArticleDate(new Date('not-a-date'))).toThrow(TypeError);
  });
});

describe('formatYearRange', () => {
  it('renders numeric range', () => {
    expect(formatYearRange(2020, 2024)).toBe('2020 — 2024');
  });

  it('renders open-ended range with "present"', () => {
    expect(formatYearRange(2024, 'present')).toBe('2024 — Present');
  });

  // Runtime guard — catches callers that bypass the type system (`as any`,
  // dynamic untyped data, etc). Schema validates at the data boundary; this
  // is belt-and-suspenders for in-process drift.

  it('throws when start is not an integer', () => {
    expect(() => formatYearRange(2020.5 as unknown as number, 2024)).toThrow(TypeError);
    expect(() => formatYearRange('2020' as unknown as number, 2024)).toThrow(TypeError);
    expect(() => formatYearRange(NaN as unknown as number, 2024)).toThrow(TypeError);
  });

  it('throws when end is not an integer or "present"', () => {
    expect(() => formatYearRange(2020, 'tomorrow' as unknown as 'present')).toThrow(TypeError);
    expect(() => formatYearRange(2020, 'Present' as unknown as 'present')).toThrow(TypeError);
    expect(() => formatYearRange(2020, null as unknown as 'present')).toThrow(TypeError);
  });
});

describe('formatMonthRange', () => {
  it('renders an abbreviated-month range', () => {
    expect(formatMonthRange('2022-09', '2024-01')).toBe('Sep 2022 — Jan 2024');
  });

  it('renders open-ended range with "present"', () => {
    expect(formatMonthRange('2025-01', 'present')).toBe('Jan 2025 — Present');
  });

  it('renders January and December at the array boundaries', () => {
    expect(formatMonthRange('2020-01', '2020-12')).toBe('Jan 2020 — Dec 2020');
  });

  // Runtime guard — catches callers that bypass the type system or feed
  // unvalidated data. Schema validates at the data boundary; this is
  // belt-and-suspenders for in-process drift.

  it('throws when start is not a YYYY-MM string', () => {
    expect(() => formatMonthRange('2020', '2024-01')).toThrow(TypeError);
    expect(() => formatMonthRange('2020-13', '2024-01')).toThrow(TypeError);
    expect(() => formatMonthRange('2020-00', '2024-01')).toThrow(TypeError);
  });

  it('throws when end is neither YYYY-MM nor "present"', () => {
    expect(() => formatMonthRange('2020-01', 'Present')).toThrow(TypeError);
    expect(() => formatMonthRange('2020-01', '2024')).toThrow(TypeError);
    expect(() => formatMonthRange('2020-01', null as unknown as string)).toThrow(TypeError);
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

  it('accepts Date objects via UTC year', () => {
    const items = [
      { date: new Date(Date.UTC(2026, 2, 22)), id: 'a' },
      { date: new Date(Date.UTC(2025, 11, 1)), id: 'b' }
    ];
    const grouped = groupByYear(items);
    expect([...grouped.keys()]).toEqual(['2026', '2025']);
  });

  it('groups across mixed string + Date inputs', () => {
    const items = [
      { date: '2026-03-22', id: 'a' },
      { date: new Date(Date.UTC(2026, 0, 4)), id: 'b' }
    ];
    const grouped = groupByYear(items);
    expect(grouped.get('2026')!.map((i) => i.id)).toEqual(['a', 'b']);
  });

  it('throws on malformed date strings', () => {
    expect(() => groupByYear([{ date: 'tomorrow' }])).toThrow(TypeError);
    expect(() => groupByYear([{ date: '26-3-22' }])).toThrow(TypeError);
  });

  it('throws on Invalid Date objects', () => {
    expect(() => groupByYear([{ date: new Date('not-a-date') }])).toThrow(TypeError);
  });
});
