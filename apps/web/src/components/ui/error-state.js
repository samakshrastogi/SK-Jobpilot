import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';
export function ErrorState({ title = 'Failed to load data', message = 'An unexpected error occurred. Please check your connection and try again.', onRetry, }) {
    return (_jsxs("div", { className: "flex flex-col items-center justify-center rounded-xl border border-rose-900/40 bg-rose-950/20 p-8 text-center", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-rose-900/30 text-rose-400 mb-3", children: _jsx(AlertTriangle, { className: "h-6 w-6" }) }), _jsx("h3", { className: "text-base font-semibold text-rose-200", children: title }), _jsx("p", { className: "text-xs text-rose-300/80 max-w-sm mt-1 mb-4", children: message }), onRetry ? (_jsxs(Button, { size: "sm", variant: "outline", onClick: onRetry, className: "border-rose-800 text-rose-300 hover:bg-rose-900/40", children: [_jsx(RefreshCw, { className: "h-3.5 w-3.5 mr-1.5" }), "Retry"] })) : null] }));
}
//# sourceMappingURL=error-state.js.map