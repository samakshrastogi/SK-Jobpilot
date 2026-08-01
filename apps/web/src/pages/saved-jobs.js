import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Trash2, ArrowRight } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
const sampleSavedJobs = [
    {
        id: 'save-1',
        title: 'Principal Agentic Systems Engineer',
        company: 'Deepmind Partner Lab',
        matchScore: 94,
        savedOn: '2026-07-31',
        location: 'Hybrid (New York, NY)',
    },
    {
        id: 'save-2',
        title: 'Lead Full Stack Engineer',
        company: 'Supabase Inc.',
        matchScore: 90,
        savedOn: '2026-07-29',
        location: 'Remote',
    },
];
export function SavedJobsPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Saved Jobs", description: "Bookmarked opportunities ready for application preparation and resume tailoring.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Saved Jobs' }], actions: _jsx(Badge, { variant: "warning", className: "uppercase font-bold tracking-wider text-[10px]", children: "DEV SAMPLE DATA" }) }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: sampleSavedJobs.map((job) => (_jsxs(Card, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-bold text-slate-100", children: job.title }), _jsxs("p", { className: "text-xs text-slate-400", children: [job.company, " \u2022 ", job.location] })] }), _jsxs(Badge, { variant: "success", children: [job.matchScore, "% Match"] })] }), _jsxs("div", { className: "flex items-center justify-between border-t border-slate-800/80 pt-3", children: [_jsxs("span", { className: "text-[11px] text-slate-500", children: ["Saved on ", job.savedOn] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "ghost", className: "text-rose-400 hover:text-rose-300", children: _jsx(Trash2, { className: "h-4 w-4" }) }), _jsxs(Button, { size: "sm", variant: "primary", children: ["Start Application ", _jsx(ArrowRight, { className: "h-3.5 w-3.5 ml-1" })] })] })] })] }, job.id))) })] }));
}
//# sourceMappingURL=saved-jobs.js.map