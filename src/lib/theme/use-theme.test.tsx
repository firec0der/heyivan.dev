// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { useTheme } from './use-theme';

describe('useTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  afterEach(() => {
    document.documentElement.removeAttribute('data-theme');
    localStorage.clear();
  });

  it('reads "light" when no data-theme is set', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
  });

  it('reads "dark" when data-theme="dark" is already set (e.g. by the no-flash script)', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('setTheme("dark") applies the attribute and persists to localStorage', () => {
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('dark'));
    expect(result.current.theme).toBe('dark');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');
  });

  it('setTheme("light") removes the attribute and persists to localStorage', () => {
    document.documentElement.setAttribute('data-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    act(() => result.current.setTheme('light'));
    expect(result.current.theme).toBe('light');
    expect(document.documentElement.hasAttribute('data-theme')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('toggle flips between light and dark', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('light');
    act(() => result.current.toggle());
    expect(result.current.theme).toBe('dark');
    act(() => result.current.toggle());
    expect(result.current.theme).toBe('light');
  });

  it('keeps multiple hook instances in sync', () => {
    const a = renderHook(() => useTheme());
    const b = renderHook(() => useTheme());
    expect(a.result.current.theme).toBe('light');
    expect(b.result.current.theme).toBe('light');
    act(() => a.result.current.setTheme('dark'));
    expect(a.result.current.theme).toBe('dark');
    expect(b.result.current.theme).toBe('dark');
  });

  it('survives a localStorage failure (e.g. Safari private mode)', () => {
    const original = Storage.prototype.setItem;
    Storage.prototype.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    try {
      const { result } = renderHook(() => useTheme());
      expect(() => act(() => result.current.setTheme('dark'))).not.toThrow();
      expect(result.current.theme).toBe('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    } finally {
      Storage.prototype.setItem = original;
    }
  });
});
