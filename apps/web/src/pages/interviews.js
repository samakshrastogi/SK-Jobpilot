import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Calendar, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
const sampleInterviews = [
    {
        id: 'int-1',
        company: 'Stripe',
        jobTitle: 'Senior Frontend Architect',
        round: 'Round 2 - System Design & Architecture',
        scheduledAt: '2026-08-04T15:00:00Z',
        type: 'Technical',
        prepStatus: 'In Progress',
    },
    {
        id: 'int-2',
        company: 'Linear App',
        jobTitle: 'Staff TypeScript Developer',
        round: 'Round 1 - Technical Screen',
        scheduledAt: '2026-08-07T18:00:00Z',
        type: 'Technical',
        prepStatus: 'Not Started',
    },
];
export function InterviewsPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Interview Preparation & Simulator", description: "Prepare tailored company Q&A, system design cheat sheets, and AI mock interview simulations.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Interviews' }], actions: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "warning", className: "uppercase font-bold tracking-wider text-[10px]", children: "DEV SAMPLE DATA" }), _jsxs(Button, { size: "sm", children: [_jsx(Sparkles, { className: "h-4 w-4 mr-1.5" }), "Generate Prep Guide"] })] }) }), _jsx("div", { className: "space-y-4", children: sampleInterviews.map((int) => (_jsx(Card, { className: "space-y-3", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-base font-bold text-slate-100", children: int.company }), _jsx(Badge, { variant: "info", children: int.type })] }), _jsx("p", { className: "text-xs font-medium text-indigo-400 mt-0.5", children: int.jobTitle }), _jsx("p", { className: "text-xs text-slate-400 mt-1", children: int.round })] }), _jsxs("div", { className: "flex items-center gap-3", children: [_jsxs("div", { className: "text-right", children: [_jsxs("div", { className: "flex items-center gap-1.5 text-xs text-amber-400 font-semibold", children: [_jsx(Calendar, { className: "h-3.5 w-3.5" }), " Aug 04, 2026 at 3:00 PM"] }), _jsxs(Badge, { variant: "warning", className: "mt-1 text-[10px]", children: ["Prep: ", int.prepStatus] })] }), _jsx(Button, { size: "sm", variant: "primary", children: "Launch Mock AI Simulator" })] })] }) }, int.id))) })] }));
}
//# sourceMappingURL=interviews.js.map