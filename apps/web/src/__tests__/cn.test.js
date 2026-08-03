import { describe, it, expect } from 'vitest';
import { cn } from '../lib/cn';
describe('Frontend cn Utility', () => {
  it('should merge tailwind class names correctly', () => {
    const result = cn('px-2 py-1', 'bg-slate-900', 'px-4');
    expect(result).toBe('py-1 bg-slate-900 px-4');
  });
  it('should handle conditional flags', () => {
    const isTrue = true;
    const isFalse = false;
    const result = cn('base-class', isTrue && 'active-class', isFalse && 'inactive-class');
    expect(result).toBe('base-class active-class');
  });
});
//# sourceMappingURL=cn.test.js.map
