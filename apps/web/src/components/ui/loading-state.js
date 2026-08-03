import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import { Loader2 } from 'lucide-react';
export function LoadingState({ message = 'Loading contents...', height = 'h-64' }) {
  return _jsxs('div', {
    className: `flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 p-8 ${height}`,
    children: [
      _jsx(Loader2, { className: 'h-8 w-8 animate-spin text-indigo-500 mb-2' }),
      _jsx('p', { className: 'text-xs font-medium text-slate-400', children: message }),
    ],
  });
}
//# sourceMappingURL=loading-state.js.map
