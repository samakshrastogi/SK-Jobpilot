import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
const sampleResumes = [
    {
        id: 'res-1',
        title: 'Master Technical Resume - 2026',
        targetRole: 'Full Stack & AI Architect',
        version: 'v2.4',
        lastUpdated: '2026-07-30',
        isMaster: true,
        matchCount: 14,
    },
    {
        id: 'res-2',
        title: 'Tailored Resume - Stripe Architect',
        targetRole: 'Senior Frontend Architect',
        version: 'v1.0-Stripe',
        lastUpdated: '2026-07-28',
        isMaster: false,
        matchCount: 1,
    },
];
export function ResumesPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Resume Workspace", description: "Manage master profiles and AI-tailored resume variations tuned for specific job specs.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Resumes' }], actions: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "warning", className: "uppercase font-bold tracking-wider text-[10px]", children: "DEV SAMPLE DATA" }), _jsxs(Button, { size: "sm", children: [_jsx(Plus, { className: "h-4 w-4 mr-1.5" }), "Upload Resume"] })] }) }), _jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: sampleResumes.map((res) => (_jsxs(Card, { className: "space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-base font-bold text-slate-100", children: res.title }), res.isMaster ? _jsx(Badge, { variant: "primary", children: "Master" }) : _jsx(Badge, { variant: "outline", children: "Tailored" })] }), _jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: ["Target: ", res.targetRole] })] }), _jsx("span", { className: "text-xs font-mono text-slate-500", children: res.version })] }), _jsxs("div", { className: "flex items-center justify-between border-t border-slate-800/80 pt-3", children: [_jsxs("span", { className: "text-[11px] text-slate-500", children: ["Updated ", res.lastUpdated] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Button, { size: "sm", variant: "outline", children: "Edit Profile" }), _jsxs(Button, { size: "sm", variant: "secondary", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5 mr-1" }), " Tailor"] })] })] })] }, res.id))) })] }));
}
//# sourceMappingURL=resumes.js.map