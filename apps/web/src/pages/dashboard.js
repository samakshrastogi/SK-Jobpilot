import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Compass, Sparkles, Briefcase, Video, Target, Clock, Bot, ExternalLink, Building2, Calendar, CheckCircle2, } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { StatCard } from '../components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { getMatchScoreColor, formatDate } from '@sk-job-pilot/shared';
// Sample data clearly identified as development sample data
const sampleMetrics = {
    jobsDiscovered: 148,
    recommendedJobs: 32,
    applicationsPrepared: 14,
    interviewsScheduled: 3,
    averageMatchScore: 88,
};
const sampleRecommendedJobs = [
    {
        id: 'job-1',
        title: 'Senior Full Stack AI Engineer',
        company: 'Anthropic Systems',
        location: 'Remote (US/Canada)',
        matchScore: 94,
        salary: '$180,000 - $220,000',
        type: 'Full-time',
        posted: '2 hours ago',
        skills: ['React', 'TypeScript', 'Node.js', 'LLMs', 'Vector DBs'],
    },
    {
        id: 'job-2',
        title: 'Lead Software Architect',
        company: 'Vercel Labs',
        location: 'San Francisco, CA / Remote',
        matchScore: 89,
        salary: '$200,000 - $250,000',
        type: 'Full-time',
        posted: '5 hours ago',
        skills: ['Next.js', 'TypeScript', 'System Design', 'GraphQL'],
    },
    {
        id: 'job-3',
        title: 'Principal Agentic Systems Engineer',
        company: 'Deepmind Partner Lab',
        location: 'Hybrid (New York, NY)',
        matchScore: 85,
        salary: '$190,000 - $230,000',
        type: 'Full-time',
        posted: '1 day ago',
        skills: ['Python', 'TypeScript', 'Agentic AI', 'Docker'],
    },
];
const sampleRecentApplications = [
    {
        id: 'app-1',
        jobTitle: 'Senior Frontend Architect',
        company: 'Stripe',
        status: 'interviewing',
        appliedDate: '2026-07-28',
        matchScore: 92,
    },
    {
        id: 'app-2',
        jobTitle: 'Staff TypeScript Developer',
        company: 'Linear App',
        status: 'tailoring',
        appliedDate: '2026-07-30',
        matchScore: 87,
    },
    {
        id: 'app-3',
        jobTitle: 'Principal Web Infrastructure Engineer',
        company: 'Cloudflare',
        status: 'applied',
        appliedDate: '2026-07-25',
        matchScore: 84,
    },
];
const sampleUpcomingFollowUps = [
    {
        id: 'fu-1',
        company: 'Stripe',
        title: 'Technical Deep-Dive Interview',
        date: '2026-08-04T15:00:00Z',
        type: 'Technical',
    },
    {
        id: 'fu-2',
        company: 'Linear App',
        title: 'Follow up on Tailored Application Submission',
        date: '2026-08-02T10:00:00Z',
        type: 'Follow-up',
    },
];
const sampleAgentActivity = [
    {
        id: 'act-1',
        agent: 'DiscoveryAgent',
        action: 'Scraped 42 new job postings from tech boards',
        timestamp: '15 minutes ago',
        status: 'success',
    },
    {
        id: 'act-2',
        agent: 'MatchingAgent',
        action: 'Calculated 94% match vector for Anthropic Systems listing',
        timestamp: '1 hour ago',
        status: 'success',
    },
    {
        id: 'act-3',
        agent: 'TailorAgent',
        action: 'Generated customized resume bullet points for Stripe application',
        timestamp: '3 hours ago',
        status: 'info',
    },
];
export function DashboardPage() {
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Command Center Dashboard", description: "Overview of your AI-guided job search pipeline, discovery metrics, and interview readiness.", actions: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Badge, { variant: "warning", className: "uppercase font-bold tracking-wider text-[10px]", children: "DEV SAMPLE DATA" }), _jsxs(Button, { size: "sm", children: [_jsx(Sparkles, { className: "h-4 w-4 mr-1.5" }), "Run Discovery Scan"] })] }) }), _jsxs("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5", children: [_jsx(StatCard, { title: "Jobs Discovered", value: sampleMetrics.jobsDiscovered, icon: _jsx(Compass, { className: "h-5 w-5" }), trend: "+18 today", trendType: "positive", subtitle: "From 12 job boards" }), _jsx(StatCard, { title: "Recommended Jobs", value: sampleMetrics.recommendedJobs, icon: _jsx(Sparkles, { className: "h-5 w-5" }), trend: "85%+ match", trendType: "positive", subtitle: "Curated by AI" }), _jsx(StatCard, { title: "Applications Prepared", value: sampleMetrics.applicationsPrepared, icon: _jsx(Briefcase, { className: "h-5 w-5" }), trend: "+3 this week", trendType: "positive", subtitle: "Tailored & ready" }), _jsx(StatCard, { title: "Interviews", value: sampleMetrics.interviewsScheduled, icon: _jsx(Video, { className: "h-5 w-5" }), trend: "Active rounds", trendType: "neutral", subtitle: "Upcoming this week" }), _jsx(StatCard, { title: "Avg Match Score", value: `${sampleMetrics.averageMatchScore}%`, icon: _jsx(Target, { className: "h-5 w-5" }), trend: "High Alignment", trendType: "positive", subtitle: "Based on master profile" })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6 lg:grid-cols-3", children: [_jsxs("div", { className: "space-y-6 lg:col-span-2", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "flex flex-row items-center justify-between", children: [_jsxs("div", { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(Sparkles, { className: "h-4 w-4 text-indigo-400" }), "Top Recommended Jobs"] }), _jsx(CardDescription, { children: "AI matched highest alignment opportunities for your profile." })] }), _jsx(Badge, { variant: "outline", className: "text-[10px] uppercase font-bold text-slate-400", children: "Sample Feed" })] }), _jsx(CardContent, { className: "space-y-3", children: sampleRecommendedJobs.map((job) => {
                                            const scoreStyle = getMatchScoreColor(job.matchScore);
                                            return (_jsxs("div", { className: "flex flex-col gap-3 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between", children: [_jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "font-semibold text-slate-100 text-sm", children: job.title }), _jsxs("span", { className: `inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text}`, children: [job.matchScore, "% Match"] })] }), _jsxs("div", { className: "flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400", children: [_jsxs("span", { className: "flex items-center gap-1", children: [_jsx(Building2, { className: "h-3.5 w-3.5 text-slate-500" }), " ", job.company] }), _jsx("span", { children: "\u2022" }), _jsx("span", { children: job.location }), _jsx("span", { children: "\u2022" }), _jsx("span", { className: "text-indigo-400 font-medium", children: job.salary })] }), _jsx("div", { className: "flex flex-wrap gap-1.5 pt-2", children: job.skills.map((skill) => (_jsx(Badge, { variant: "outline", className: "text-[10px] py-0 px-1.5 border-slate-800 text-slate-400", children: skill }, skill))) })] }), _jsxs("div", { className: "flex items-center gap-2 self-end sm:self-center", children: [_jsx(Button, { size: "sm", variant: "secondary", children: "Tailor Application" }), _jsx(Button, { size: "icon", variant: "outline", children: _jsx(ExternalLink, { className: "h-4 w-4" }) })] })] }, job.id));
                                        }) })] }), _jsxs(Card, { children: [_jsx(CardHeader, { className: "flex flex-row items-center justify-between", children: _jsxs("div", { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(Briefcase, { className: "h-4 w-4 text-indigo-400" }), "Recent Application Pipeline Activity"] }), _jsx(CardDescription, { children: "Track status updates across your ongoing job applications." })] }) }), _jsx(CardContent, { children: _jsx("div", { className: "space-y-3", children: sampleRecentApplications.map((app) => (_jsxs("div", { className: "flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 p-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-bold text-xs", children: app.company.substring(0, 2).toUpperCase() }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-semibold text-slate-100", children: app.jobTitle }), _jsxs("p", { className: "text-[11px] text-slate-400", children: [app.company, " \u2022 Applied ", formatDate(app.appliedDate)] })] })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsx(Badge, { variant: app.status === 'interviewing'
                                                                ? 'success'
                                                                : app.status === 'tailoring'
                                                                    ? 'warning'
                                                                    : 'primary', className: "capitalize text-[11px]", children: app.status }) })] }, app.id))) }) })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs(Card, { children: [_jsx(CardHeader, { children: _jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(Calendar, { className: "h-4 w-4 text-amber-400" }), "Upcoming Follow-ups & Interviews"] }) }), _jsx(CardContent, { className: "space-y-3", children: sampleUpcomingFollowUps.map((fu) => (_jsxs("div", { className: "rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1.5", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-xs font-bold text-slate-100", children: fu.company }), _jsx(Badge, { variant: "warning", className: "text-[10px] py-0", children: fu.type })] }), _jsx("p", { className: "text-xs text-slate-300", children: fu.title }), _jsxs("div", { className: "flex items-center gap-1 text-[11px] text-slate-400 pt-1", children: [_jsx(Clock, { className: "h-3 w-3 text-amber-400" }), _jsx("span", { children: formatDate(fu.date) })] })] }, fu.id))) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(Bot, { className: "h-4 w-4 text-indigo-400" }), "AI Agent Live Stream"] }), _jsx(CardDescription, { children: "Autonomous background agent actions & discovery logs." })] }), _jsx(CardContent, { className: "space-y-3", children: sampleAgentActivity.map((act) => (_jsxs("div", { className: "flex gap-2.5 items-start text-xs border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0", children: [_jsx(CheckCircle2, { className: "h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" }), _jsxs("div", { className: "space-y-0.5", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "font-semibold text-indigo-300", children: act.agent }), _jsxs("span", { className: "text-[10px] text-slate-500", children: ["\u2022 ", act.timestamp] })] }), _jsx("p", { className: "text-slate-300", children: act.action })] })] }, act.id))) })] })] })] })] }));
}
//# sourceMappingURL=dashboard.js.map