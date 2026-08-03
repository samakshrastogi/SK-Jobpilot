import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../lib/cn';
export function Dropdown({ trigger, items, align = 'right' }) {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef(null);
    React.useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { className: "relative inline-block text-left", ref: containerRef, children: [_jsx("div", { onClick: () => setIsOpen((prev) => !prev), className: "cursor-pointer", children: trigger }), isOpen ? (_jsx("div", { className: cn('absolute z-50 mt-2 w-48 rounded-lg border border-slate-800 bg-slate-900 py-1 shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95', align === 'right' ? 'right-0' : 'left-0'), children: items.map((item, idx) => (_jsxs("button", { onClick: () => {
                        item.onClick();
                        setIsOpen(false);
                    }, className: cn('flex w-full items-center gap-2.5 px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-800', item.danger
                        ? 'text-rose-400 hover:text-rose-300'
                        : 'text-slate-300 hover:text-slate-100'), children: [item.icon ? _jsx("span", { className: "h-4 w-4", children: item.icon }) : null, item.label] }, idx))) })) : null] }));
}
//# sourceMappingURL=dropdown.js.map