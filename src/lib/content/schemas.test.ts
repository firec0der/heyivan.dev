import { describe, expect, it } from 'vitest';

import { year, yearOrPresent } from './schemas';

describe('year schema', () => {
  it('accepts a year number', () => {
    expect(year.parse(2024)).toBe(2024);
  });

  it('coerces a numeric string to a year number', () => {
    expect(year.parse('2024')).toBe(2024);
  });

  it('rejects non-numeric strings', () => {
    expect(() => year.parse('tomorrow')).toThrow();
  });

  it('rejects out-of-range years', () => {
    expect(() => year.parse(1800)).toThrow();
    expect(() => year.parse(3000)).toThrow();
  });

  it('rejects non-integer numbers', () => {
    expect(() => year.parse(2024.5)).toThrow();
  });
});

describe('yearOrPresent schema', () => {
  it('accepts a year number', () => {
    expect(yearOrPresent.parse(2024)).toBe(2024);
  });

  it('accepts a numeric string and coerces', () => {
    expect(yearOrPresent.parse('2024')).toBe(2024);
  });

  it("accepts 'present' as-is", () => {
    expect(yearOrPresent.parse('present')).toBe('present');
  });

  it("normalizes 'Present' and 'PRESENT' to lowercase", () => {
    expect(yearOrPresent.parse('Present')).toBe('present');
    expect(yearOrPresent.parse('PRESENT')).toBe('present');
  });

  it('rejects unknown strings', () => {
    expect(() => yearOrPresent.parse('tomorrow')).toThrow();
    expect(() => yearOrPresent.parse('')).toThrow();
  });

  it('rejects out-of-range years', () => {
    expect(() => yearOrPresent.parse(1800)).toThrow();
  });
});
