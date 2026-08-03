import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { FolderOpen } from 'lucide-react';
import { Button } from './button';
export function EmptyState({ title, description, actionLabel, onAction, icon }) {
  return _jsxs('div', {
    className:
      'flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center',
    children: [
      _jsx('div', {
        className:
          'flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 text-slate-400 mb-3',
        children: icon || _jsx(FolderOpen, { className: 'h-6 w-6' }),
      }),
      _jsx('h3', { className: 'text-base font-semibold text-slate-200', children: title }),
      _jsx('p', { className: 'text-xs text-slate-400 max-w-sm mt-1 mb-4', children: description }),
      actionLabel && onAction
        ? _jsx(Button, { size: 'sm', onClick: onAction, children: actionLabel })
        : null,
    ],
  });
}
//# sourceMappingURL=empty-state.js.map
