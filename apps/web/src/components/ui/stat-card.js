import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from './card';
export function StatCard({ title, value, icon, trend, trendType = 'positive', subtitle }) {
    const trendColorClass = trendType === 'positive'
        ? 'text-emerald-400'
        : trendType === 'negative'
            ? 'text-rose-400'
            : 'text-slate-400';
    return (_jsxs(Card, { className: "relative overflow-hidden group hover:border-indigo-500/40 transition-colors", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-semibold uppercase tracking-wider text-slate-400", children: title }), _jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform", children: icon })] }), _jsxs("div", { className: "mt-3 flex items-baseline justify-between", children: [_jsx("span", { className: "text-2xl font-bold tracking-tight text-slate-100", children: value }), trend ? _jsx("span", { className: `text-xs font-semibold ${trendColorClass}`, children: trend }) : null] }), subtitle ? _jsx("p", { className: "mt-1 text-xs text-slate-400", children: subtitle }) : null] }));
}
//# sourceMappingURL=stat-card.js.map