import {
  Compass,
  Sparkles,
  Briefcase,
  Video,
  Target,
  Building2,
  Calendar,
  Plus,
  Cpu,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { StatCard } from '../components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useJobsQuery } from '../hooks/use-jobs';
import { useApplicationsQuery } from '../hooks/use-applications';
import { useAIHealthQuery, useTailoredResumesQuery } from '../hooks/use-ai';
import { formatDate, getMatchScoreColor } from '@sk-job-pilot/shared';
import { useNavigate } from 'react-router-dom';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: jobsResponse } = useJobsQuery({ limit: 5 });
  const { data: applicationsResponse } = useApplicationsQuery({ limit: 5 });
  const { data: aiHealthResponse } = useAIHealthQuery();
  const { data: tailoredResumesResponse } = useTailoredResumesQuery();

  const jobs = jobsResponse?.data || [];
  const totalJobs = jobsResponse?.pagination?.totalItems || 0;
  const applications = applicationsResponse?.data || [];
  const totalApplications = applicationsResponse?.pagination?.totalItems || 0;
  const tailoredResumes = tailoredResumesResponse?.data || [];
  const aiHealth = aiHealthResponse?.data;

  const savedJobsCount = jobs.filter((j) => j.savedStatus).length;
  const interviewingAppsCount = applications.filter((a) => a.status === 'interview').length;
  const pendingTailoredCount = tailoredResumes.filter(
    (r) => r.approvalStatus === 'generated' || r.approvalStatus === 'under_review'
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Command Center Dashboard"
        description="Real-time pipeline metrics, AI health monitor, and application lifecycle tracking."
        actions={
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={() => navigate('/discover')}>
              <Compass className="h-4 w-4 mr-1.5" />
              Discover Jobs
            </Button>
          </div>
        }
      />

      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Total Jobs Discovered"
          value={totalJobs}
          icon={<Compass className="h-5 w-5" />}
          trend="Live Database"
          trendType="positive"
          subtitle="Indexed in database"
        />
        <StatCard
          title="Saved Opportunities"
          value={savedJobsCount}
          icon={<Sparkles className="h-5 w-5" />}
          trend="Bookmarked"
          trendType="positive"
          subtitle="Ready to apply"
        />
        <StatCard
          title="Active Applications"
          value={totalApplications}
          icon={<Briefcase className="h-5 w-5" />}
          trend="In Pipeline"
          trendType="positive"
          subtitle="Tracked applications"
        />
        <StatCard
          title="Interviews"
          value={interviewingAppsCount}
          icon={<Video className="h-5 w-5" />}
          trend="Active Rounds"
          trendType="neutral"
          subtitle="Interview stage"
        />
        <StatCard
          title="Pending Tailored Resumes"
          value={pendingTailoredCount}
          icon={<Target className="h-5 w-5 text-indigo-400" />}
          trend="Requires Review"
          trendType={pendingTailoredCount > 0 ? 'positive' : 'neutral'}
          subtitle="Awaiting human approval"
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
                  Recent Job Discoveries
                </CardTitle>
                <CardDescription>Live jobs persisted in database.</CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/discover')}>
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {jobs.length > 0 ? (
                jobs.slice(0, 3).map((job) => {
                  const scoreStyle = getMatchScoreColor(job.matchScore || 0);
                  return (
                    <div
                      key={job.id}
                      className="flex flex-col gap-3 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-slate-100 text-sm">
                            {job.jobTitle}
                          </span>
                          <span
                            className={`inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text}`}
                          >
                            {job.matchScore || 0}% Match
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Building2 className="h-3.5 w-3.5 text-slate-500" /> {job.companyName}
                          </span>
                          <span>•</span>
                          <span>{job.location}</span>
                          <span>•</span>
                          <span className="text-indigo-400 font-medium">{job.workMode}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <Button size="sm" variant="secondary" onClick={() => navigate('/discover')}>
                          View Job
                        </Button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-slate-400">
                  No jobs in database yet. Add a job on the Discover Jobs page!
                </div>
              )}
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
                <CardDescription>
                  Track status updates across your ongoing job applications.
                </CardDescription>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate('/applications')}>
                View Pipeline
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {applications.length > 0 ? (
                  applications.slice(0, 3).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 p-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-bold text-xs">
                          {(app.job?.companyName || 'CO').substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="text-xs font-semibold text-slate-100">
                            {app.job?.jobTitle || 'Job Track'}
                          </h4>
                          <p className="text-[11px] text-slate-400">
                            {app.job?.companyName || 'Company'} • Activity{' '}
                            {formatDate(app.lastActivityDate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="primary" className="capitalize text-[11px]">
                          {app.status.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6 text-xs text-slate-400">
                    No applications tracked yet. Start an application on the Applications page!
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar Column: AI Provider Health & Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Cpu className="h-4 w-4 text-indigo-400" />
                AI Intelligence Provider Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Engine Status:</span>
                <Badge variant={aiHealth?.status === 'healthy' ? 'success' : 'warning'}>
                  {aiHealth?.status || 'degraded'}
                </Badge>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Text Generation Model:</span>
                <span className="font-mono text-indigo-300 text-[11px]">
                  {aiHealth?.textModel || 'gemini-2.5-flash'}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                <span className="text-slate-400">Daily Requests Used:</span>
                <span className="font-semibold text-slate-200">
                  {aiHealth?.dailyRequestsUsed || 0} / {aiHealth?.dailyRequestLimit || 200}
                </span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full justify-between mt-2"
                onClick={() => navigate('/agent-activity')}
              >
                <span>View AI Execution Logs</span> <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                Quick Pipeline Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full justify-start text-xs"
                variant="outline"
                onClick={() => navigate('/discover')}
              >
                <Plus className="h-3.5 w-3.5 mr-2 text-indigo-400" /> Add Job Listing
              </Button>
              <Button
                className="w-full justify-start text-xs"
                variant="outline"
                onClick={() => navigate('/resumes')}
              >
                <Plus className="h-3.5 w-3.5 mr-2 text-emerald-400" /> Review Tailored Resumes
              </Button>
              <Button
                className="w-full justify-start text-xs"
                variant="outline"
                onClick={() => navigate('/settings')}
              >
                <Plus className="h-3.5 w-3.5 mr-2 text-amber-400" /> Update Candidate Profile
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
