import {
  Compass,
  Sparkles,
  Briefcase,
  Video,
  Target,
  Clock,
  Bot,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
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
  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Command Center Dashboard"
        description="Overview of your AI-guided job search pipeline, discovery metrics, and interview readiness."
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="uppercase font-bold tracking-wider text-[10px]">
              DEV SAMPLE DATA
            </Badge>
            <Button size="sm">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Run Discovery Scan
            </Button>
          </div>
        }
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Jobs Discovered"
          value={sampleMetrics.jobsDiscovered}
          icon={<Compass className="h-5 w-5" />}
          trend="+18 today"
          trendType="positive"
          subtitle="From 12 job boards"
        />
        <StatCard
          title="Recommended Jobs"
          value={sampleMetrics.recommendedJobs}
          icon={<Sparkles className="h-5 w-5" />}
          trend="85%+ match"
          trendType="positive"
          subtitle="Curated by AI"
        />
        <StatCard
          title="Applications Prepared"
          value={sampleMetrics.applicationsPrepared}
          icon={<Briefcase className="h-5 w-5" />}
          trend="+3 this week"
          trendType="positive"
          subtitle="Tailored & ready"
        />
        <StatCard
          title="Interviews"
          value={sampleMetrics.interviewsScheduled}
          icon={<Video className="h-5 w-5" />}
          trend="Active rounds"
          trendType="neutral"
          subtitle="Upcoming this week"
        />
        <StatCard
          title="Avg Match Score"
          value={`${sampleMetrics.averageMatchScore}%`}
          icon={<Target className="h-5 w-5" />}
          trend="High Alignment"
          trendType="positive"
          subtitle="Based on master profile"
        />
      </div>

      {/* Main Grid: Recommended Jobs & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recommended Jobs Column (2 spans) */}
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-400" />
                  Top Recommended Jobs
                </CardTitle>
                <CardDescription>AI matched highest alignment opportunities for your profile.</CardDescription>
              </div>
              <Badge variant="outline" className="text-[10px] uppercase font-bold text-slate-400">
                Sample Feed
              </Badge>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleRecommendedJobs.map((job) => {
                const scoreStyle = getMatchScoreColor(job.matchScore);
                return (
                  <div
                    key={job.id}
                    className="flex flex-col gap-3 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm">{job.title}</span>
                        <span className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text}`}>
                          {job.matchScore}% Match
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-slate-500" /> {job.company}
                        </span>
                        <span>•</span>
                        <span>{job.location}</span>
                        <span>•</span>
                        <span className="text-indigo-400 font-medium">{job.salary}</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-[10px] py-0 px-1.5 border-slate-800 text-slate-400">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <Button size="sm" variant="secondary">
                        Tailor Application
                      </Button>
                      <Button size="icon" variant="outline">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Recent Application Activity */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-indigo-400" />
                  Recent Application Pipeline Activity
                </CardTitle>
                <CardDescription>Track status updates across your ongoing job applications.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sampleRecentApplications.map((app) => (
                  <div
                    key={app.id}
                    className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-bold text-xs">
                        {app.company.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-slate-100">{app.jobTitle}</h4>
                        <p className="text-[11px] text-slate-400">{app.company} • Applied {formatDate(app.appliedDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          app.status === 'interviewing'
                            ? 'success'
                            : app.status === 'tailoring'
                            ? 'warning'
                            : 'primary'
                        }
                        className="capitalize text-[11px]"
                      >
                        {app.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Column: Upcoming Follow-ups & Agent Stream */}
        <div className="space-y-6">
          {/* Upcoming Follow-ups */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                Upcoming Follow-ups & Interviews
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleUpcomingFollowUps.map((fu) => (
                <div key={fu.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-100">{fu.company}</span>
                    <Badge variant="warning" className="text-[10px] py-0">
                      {fu.type}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-300">{fu.title}</p>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 pt-1">
                    <Clock className="h-3 w-3 text-amber-400" />
                    <span>{formatDate(fu.date)}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Real-time Agent Activity Stream */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-400" />
                AI Agent Live Stream
              </CardTitle>
              <CardDescription>Autonomous background agent actions & discovery logs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {sampleAgentActivity.map((act) => (
                <div key={act.id} className="flex gap-2.5 items-start text-xs border-b border-slate-800/60 pb-2.5 last:border-0 last:pb-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-indigo-300">{act.agent}</span>
                      <span className="text-[10px] text-slate-500">• {act.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{act.action}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
