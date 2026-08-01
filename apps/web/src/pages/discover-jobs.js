import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Compass, Search, Filter, Sparkles, MapPin, DollarSign, ExternalLink } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { EmptyState } from '../components/ui/empty-state';
const sampleDiscoveredJobs = [
    {
        id: 'disc-1',
        title: 'Senior AI Platform Architect',
        company: 'OpenAI Ecosystem Partner',
        location: 'Remote',
        type: 'Full-time',
        salary: '$190k - $240k',
        matchScore: 96,
        posted: '1 hour ago',
        source: 'LinkedIn Jobs',
        description: 'Looking for a senior architect to lead LLM application infrastructure, agentic workflows, and micro-frontend integrations.',
    },
    {
        id: 'disc-2',
        title: 'Staff Full Stack Developer',
        company: 'Linear Corp',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$180k - $220k',
        matchScore: 91,
        posted: '4 hours ago',
        source: 'TechCareers',
        description: 'Build fast, fluid, high-performance web applications using React, TypeScript, GraphQL, and modern web tech.',
    },
    {
        id: 'disc-3',
        title: 'Lead Frontend Infrastructure Engineer',
        company: 'Cloudflare',
        location: 'Remote / Austin, TX',
        type: 'Full-time',
        salary: '$175k - $215k',
        matchScore: 88,
        posted: '1 day ago',
        source: 'Direct Site Scraper',
        description: 'Architect web app performance, micro-frontend modules, state management, and edge application runtimes.',
    },
];
export function DiscoverJobsPage() {
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filterType, setFilterType] = React.useState('all');
    const filteredJobs = sampleDiscoveredJobs.filter((j) => j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        j.company.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Discover Jobs", description: "Autonomous AI agent search & multi-source web discovery feed.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Discover Jobs' }], actions: _jsx(Badge, { variant: "warning", className: "uppercase font-bold tracking-wider text-[10px]", children: "DEV SAMPLE DATA" }) }), _jsx(Card, { className: "p-4", children: _jsxs("div", { className: "grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4", children: [_jsx("div", { className: "md:col-span-2", children: _jsx(Input, { placeholder: "Filter by title, skill, or keyword...", leftIcon: _jsx(Search, { className: "h-4 w-4" }), value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), _jsx(Select, { value: filterType, onChange: (e) => setFilterType(e.target.value), options: [
                                { value: 'all', label: 'All Job Types' },
                                { value: 'fulltime', label: 'Full-time' },
                                { value: 'remote', label: 'Remote Only' },
                                { value: 'contract', label: 'Contract' },
                            ] }), _jsxs(Button, { variant: "outline", className: "w-full", children: [_jsx(Filter, { className: "h-4 w-4 mr-2" }), " More Filters"] })] }) }), _jsx("div", { className: "space-y-4", children: filteredJobs.length > 0 ? (filteredJobs.map((job) => (_jsx(Card, { className: "hover:border-slate-700 transition-colors", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between gap-4", children: [_jsxs("div", { className: "space-y-2 flex-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-base font-bold text-slate-100", children: job.title }), _jsxs(Badge, { variant: "primary", className: "text-[10px] font-bold", children: [job.matchScore, "% Match"] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400", children: [_jsx("span", { className: "font-medium text-slate-200", children: job.company }), _jsxs("span", { className: "flex items-center gap-1", children: [_jsx(MapPin, { className: "h-3.5 w-3.5 text-slate-500" }), " ", job.location] }), _jsxs("span", { className: "flex items-center gap-1 text-emerald-400 font-medium", children: [_jsx(DollarSign, { className: "h-3.5 w-3.5" }), " ", job.salary] }), _jsx(Badge, { variant: "outline", className: "text-[10px] py-0", children: job.type })] }), _jsx("p", { className: "text-xs text-slate-300 line-clamp-2 pt-1", children: job.description })] }), _jsxs("div", { className: "flex items-center gap-2 self-end sm:self-center", children: [_jsxs(Button, { size: "sm", variant: "primary", children: [_jsx(Sparkles, { className: "h-3.5 w-3.5 mr-1" }), " Save & Tailor"] }), _jsx(Button, { size: "icon", variant: "outline", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] })] }) }, job.id)))) : (_jsx(EmptyState, { title: "No jobs matched your search criteria", description: "Try adjusting your filter terms or trigger a new discovery scan.", icon: _jsx(Compass, { className: "h-6 w-6 text-slate-400" }) })) })] }));
}
//# sourceMappingURL=discover-jobs.js.map