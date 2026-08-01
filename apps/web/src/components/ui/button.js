import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { cva } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn';
const buttonVariants = cva('inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]', {
    variants: {
        variant: {
            primary: 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-500 hover:shadow-indigo-500/30',
            secondary: 'bg-slate-800 text-slate-100 border border-slate-700/80 hover:bg-slate-700 hover:text-white',
            outline: 'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800/80 hover:text-white',
            ghost: 'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-slate-100',
            danger: 'bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-500 hover:shadow-rose-500/30',
        },
        size: {
            sm: 'h-8 px-3 text-xs rounded-md',
            md: 'h-10 px-4 py-2 text-sm',
            lg: 'h-12 px-6 text-base rounded-xl',
            icon: 'h-10 w-10 p-0',
        },
    },
    defaultVariants: {
        variant: 'primary',
        size: 'md',
    },
});
export const Button = React.forwardRef(({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (_jsxs("button", { className: cn(buttonVariants({ variant, size, className })), ref: ref, disabled: disabled || isLoading, ...props, children: [isLoading ? _jsx(Loader2, { className: "h-4 w-4 animate-spin text-current" }) : null, children] }));
});
Button.displayName = 'Button';
//# sourceMappingURL=button.js.map