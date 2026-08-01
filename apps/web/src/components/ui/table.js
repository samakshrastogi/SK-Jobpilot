import { jsx as _jsx } from "react/jsx-runtime";
import * as React from 'react';
import { cn } from '../../lib/cn';
export const Table = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { className: "relative w-full overflow-auto rounded-lg border border-slate-800 bg-slate-900/50", children: _jsx("table", { ref: ref, className: cn('w-full caption-bottom text-sm', className), ...props }) })));
Table.displayName = 'Table';
export const TableHeader = React.forwardRef(({ className, ...props }, ref) => (_jsx("thead", { ref: ref, className: cn('bg-slate-900 border-b border-slate-800 text-xs font-semibold uppercase text-slate-400', className), ...props })));
TableHeader.displayName = 'TableHeader';
export const TableBody = React.forwardRef(({ className, ...props }, ref) => (_jsx("tbody", { ref: ref, className: cn('[&_tr:last-child]:border-0', className), ...props })));
TableBody.displayName = 'TableBody';
export const TableRow = React.forwardRef(({ className, ...props }, ref) => (_jsx("tr", { ref: ref, className: cn('border-b border-slate-800/60 transition-colors hover:bg-slate-800/40', className), ...props })));
TableRow.displayName = 'TableRow';
export const TableHead = React.forwardRef(({ className, ...props }, ref) => (_jsx("th", { ref: ref, className: cn('h-10 px-4 text-left align-middle font-medium text-slate-400', className), ...props })));
TableHead.displayName = 'TableHead';
export const TableCell = React.forwardRef(({ className, ...props }, ref) => (_jsx("td", { ref: ref, className: cn('p-4 align-middle text-slate-200', className), ...props })));
TableCell.displayName = 'TableCell';
//# sourceMappingURL=table.js.map