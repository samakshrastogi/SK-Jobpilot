import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';
export function Drawer({ isOpen, onClose, title, children, side = 'right' }) {
    React.useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape')
                onClose();
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
    if (!isOpen)
        return null;
    return (_jsxs("div", { className: "fixed inset-0 z-50 overflow-hidden", children: [_jsx("div", { className: "fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity", onClick: onClose }), _jsxs("div", { className: cn('fixed inset-y-0 z-50 flex w-full max-w-md flex-col border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl transition-transform duration-300 ease-in-out', side === 'right' ? 'right-0 border-l' : 'left-0 border-r'), children: [_jsxs("div", { className: "flex items-center justify-between border-b border-slate-800 pb-4 mb-4", children: [title ? _jsx("h3", { className: "text-lg font-semibold text-slate-100", children: title }) : _jsx("div", {}), _jsx("button", { onClick: onClose, className: "rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors", children: _jsx(X, { className: "h-5 w-5" }) })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: children })] })] }));
}
//# sourceMappingURL=drawer.js.map