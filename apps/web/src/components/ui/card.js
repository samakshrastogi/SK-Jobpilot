import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../lib/cn';
export const Card = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('rounded-xl border border-slate-800/80 bg-slate-900/80 p-5 text-slate-100 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700/80', className), ...props })));
Card.displayName = 'Card';
export const CardHeader = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('flex flex-col space-y-1.5 pb-4', className), ...props })));
CardHeader.displayName = 'CardHeader';
export const CardTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("h3", { ref: ref, className: cn('text-lg font-semibold tracking-tight text-slate-100', className), ...props })));
CardTitle.displayName = 'CardTitle';
export const CardDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("p", { ref: ref, className: cn('text-xs text-slate-400', className), ...props })));
CardDescription.displayName = 'CardDescription';
export const CardContent = React.forwardRef(({ className, ...props }, ref) => _jsx("div", { ref: ref, className: cn('pt-0', className), ...props }));
CardContent.displayName = 'CardContent';
export const CardFooter = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn('flex items-center pt-4 border-t border-slate-800/60', className), ...props })));
CardFooter.displayName = 'CardFooter';
//# sourceMappingURL=card.js.map