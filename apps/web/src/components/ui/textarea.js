import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../lib/cn';
export const Textarea = React.forwardRef(({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    return (_jsxs("div", { className: "w-full space-y-1.5", children: [label ? (_jsx("label", { htmlFor: textareaId, className: "block text-xs font-semibold uppercase tracking-wider text-slate-400", children: label })) : null, _jsx("textarea", { id: textareaId, className: cn('flex min-h-[80px] w-full rounded-lg border border-slate-800 bg-slate-900/90 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 transition-colors focus-visible:outline-none focus-visible:border-indigo-500 focus-visible:ring-1 focus-visible:ring-indigo-500 disabled:cursor-not-allowed disabled:opacity-50', error && 'border-rose-500/80 focus-visible:border-rose-500 focus-visible:ring-rose-500', className), ref: ref, ...props }), error ? (_jsx("p", { className: "text-xs text-rose-400 font-medium", children: error })) : helperText ? (_jsx("p", { className: "text-xs text-slate-400", children: helperText })) : null] }));
});
Textarea.displayName = 'Textarea';
//# sourceMappingURL=textarea.js.map