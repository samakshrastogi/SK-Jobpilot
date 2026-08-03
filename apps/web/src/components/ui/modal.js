import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
export function Modal({ isOpen, onClose, title, description, children, maxWidth = 'md' }) {
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  };
  return _jsxs('div', {
    className: 'fixed inset-0 z-50 flex items-center justify-center p-4',
    children: [
      _jsx('div', {
        className: 'fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity',
        onClick: onClose,
      }),
      _jsxs('div', {
        className: cn(
          'relative w-full rounded-xl border border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-2xl transition-all z-10 animate-in fade-in zoom-in-95',
          maxWidthClasses[maxWidth]
        ),
        children: [
          _jsxs('div', {
            className: 'flex items-start justify-between border-b border-slate-800 pb-3 mb-4',
            children: [
              _jsxs('div', {
                children: [
                  title
                    ? _jsx('h3', {
                        className: 'text-lg font-semibold text-slate-100',
                        children: title,
                      })
                    : null,
                  description
                    ? _jsx('p', { className: 'text-xs text-slate-400 mt-1', children: description })
                    : null,
                ],
              }),
              _jsx('button', {
                onClick: onClose,
                className:
                  'rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors',
                children: _jsx(X, { className: 'h-5 w-5' }),
              }),
            ],
          }),
          _jsx('div', { children: children }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=modal.js.map
