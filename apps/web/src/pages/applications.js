import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Plus, Search } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
const sampleApplications = [
    {
        id: 'app-101',
        jobTitle: 'Senior Frontend Architect',
        company: 'Stripe',
        status: 'interviewing',
        appliedDate: '2026-07-28',
        matchScore: 92,
    },
    {
        id: 'app-102',
        jobTitle: 'Staff TypeScript Developer',
        company: 'Linear App',
        status: 'tailoring',
        appliedDate: '2026-07-30',
        matchScore: 87,
    },
    {
        id: 'app-103',
        jobTitle: 'Principal Web Infrastructure Engineer',
        company: 'Cloudflare',
        status: 'applied',
        appliedDate: '2026-07-25',
        matchScore: 84,
    },
];
export function ApplicationsPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Application Tracker", description: "Monitor status, tailored documents, and follow-ups across your job application lifecycle.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Applications' }], actions: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "warning", className: "uppercase font-bold tracking-wider text-[10px]", children: "DEV SAMPLE DATA" }), _jsxs(Button, { size: "sm", children: [_jsx(Plus, { className: "h-4 w-4 mr-1.5" }), "New Application"] })] }) }), _jsx("div", { className: "flex items-center gap-3", children: _jsx("div", { className: "flex-1 max-w-sm", children: _jsx(Input, { placeholder: "Search applications...", leftIcon: _jsx(Search, { className: "h-4 w-4" }) }) }) }), _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Job Title & Company" }), _jsx(TableHead, { children: "Match Score" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Applied Date" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: sampleApplications.map((app) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { children: [_jsx("div", { className: "font-semibold text-slate-100", children: app.jobTitle }), _jsx("div", { className: "text-xs text-slate-400", children: app.company })] }) }), _jsx(TableCell, { children: _jsxs(Badge, { variant: "primary", children: [app.matchScore, "%"] }) }), _jsx(TableCell, { children: _jsx(Badge, { variant: app.status === 'interviewing'
                                            ? 'success'
                                            : app.status === 'tailoring'
                                                ? 'warning'
                                                : 'default', className: "capitalize", children: app.status }) }), _jsx(TableCell, { className: "text-xs text-slate-400", children: app.appliedDate }), _jsx(TableCell, { className: "text-right", children: _jsx(Button, { size: "sm", variant: "ghost", children: "View Details" }) })] }, app.id))) })] })] }));
}
//# sourceMappingURL=applications.js.map