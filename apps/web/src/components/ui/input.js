import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { cn } from '../../lib/cn';
export const Input = React.forwardRef(
  (
    { className, type = 'text', label, error, helperText, leftIcon, rightIcon, id, ...props },
    ref
  ) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return _jsxs('div', {
      className: 'w-full space-y-1.5',
      children: [
        label
          ? _jsx('label', {
              htmlFor: inputId,
              className: 'block text-xs font-semibold uppercase tracking-wider text-slate-400',
              children: label,
            })
          : null,
        _jsxs('div', {
          className: 'relative flex items-center',
          children: [
            leftIcon
              ? _jsx('span', {
                  className: 'absolute left-3 text-slate-400 pointer-events-none',
                  children: leftIcon,
                })
              : null,
            _jsx('input', {
              type: type,
              id: inputId,
              className: cn(
                'flex h-10 w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50',
                leftIcon && 'pl-9',
                rightIcon && 'pr-9',
                error &&
                  'border-rose-500/80 focus-visible:border-rose-500 focus-visible:ring-rose-500',
                className
              ),
              ref: ref,
              ...props,
            }),
            rightIcon
              ? _jsx('span', {
                  className: 'absolute right-3 text-slate-400 pointer-events-none',
                  children: rightIcon,
                })
              : null,
          ],
        }),
        error
          ? _jsx('p', { className: 'text-xs text-rose-400 font-medium', children: error })
          : helperText
            ? _jsx('p', { className: 'text-xs text-slate-400', children: helperText })
            : null,
      ],
    });
  }
);
Input.displayName = 'Input';
//# sourceMappingURL=input.js.map
