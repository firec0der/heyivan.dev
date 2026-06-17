// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const usePathname = vi.fn();
vi.mock('next/navigation', () => ({ usePathname: () => usePathname() }));

import { useLocale } from './use-locale';

describe('useLocale', () => {
  it('returns uk under /uk', () => {
    usePathname.mockReturnValue('/uk/writing');
    expect(renderHook(() => useLocale()).result.current).toBe('uk');
  });

  it('returns en at the root and when pathname is null', () => {
    usePathname.mockReturnValue('/writing');
    expect(renderHook(() => useLocale()).result.current).toBe('en');
    usePathname.mockReturnValue(null);
    expect(renderHook(() => useLocale()).result.current).toBe('en');
  });
});
