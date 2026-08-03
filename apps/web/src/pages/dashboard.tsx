import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle2, Compass, Play, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { StatCard } from '../components/ui/stat-card';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useJobsQuery } from '../hooks/use-jobs';
import { useApplicationsQuery } from '../hooks/use-applications';
import { fetchAgentStatus, fetchReviewQueue, type AgentStatus } from '../services/onboarding.service';

export function DashboardPage() {
  const navigate = useNavigate();
  const { data: jobsResponse } = useJobsQuery({ limit: 5 });
  const { data: applicationsResponse } = useApplicationsQuery({ limit: 5 });
  const [agent, setAgent] = React.useState<AgentStatus | null>(null);
  const [reviewCount, setReviewCount] = React.useState(0);

  React.useEffect(() => {
    void Promise.all([fetchAgentStatus(), fetchReviewQueue()]).then(([agentResponse, reviewResponse]) => {
      setAgent(agentResponse.data || null);
      setReviewCount(reviewResponse.data?.length || 0);
    }).catch(() => undefined);
  }, []);

  const jobs = jobsResponse?.data || [];
  const applications = applicationsResponse?.data || [];
  const totalJobs = jobsResponse?.pagination?.totalItems || 0;
  const totalApplications = applicationsResponse?.pagination?.totalItems || 0;

  return <div className="space-y-6 max-w-6xl mx-auto">
    <PageHeader title="Job Application Overview" description="Live jobs, AI preparation, review, and application tracking from your local database." actions={<Button size="sm" onClick={() => navigate('/automation')}><Play className="h-4 w-4 mr-1.5" />Run Agent</Button>} />
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard title="Jobs" value={totalJobs} icon={<Compass className="h-5 w-5" />} subtitle="Stored opportunities" />
      <StatCard title="Ready to review" value={reviewCount} icon={<ShieldAlert className="h-5 w-5" />} subtitle="Needs confirmation" />
      <StatCard title="Applications" value={totalApplications} icon={<Briefcase className="h-5 w-5" />} subtitle="Tracked submissions" />
      <StatCard title="Latest run" value={agent?.latestRun?.prepared || 0} icon={<CheckCircle2 className="h-5 w-5" />} subtitle={agent?.latestRun?.status || 'Not run'} />
    </div>

    <div className="grid lg:grid-cols-2 gap-5">
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Latest jobs</h2><Button size="sm" variant="outline" onClick={() => navigate('/discover')}>View jobs</Button></div>
        {jobs.length ? jobs.map((job) => <button type="button" key={job.id} onClick={() => navigate('/discover')} className="w-full text-left rounded-lg border border-slate-800 bg-slate-950/60 p-3 hover:border-slate-700"><div className="flex justify-between gap-3"><div><div className="text-sm font-semibold">{job.jobTitle}</div><div className="text-xs text-slate-400 mt-1">{job.companyName} · {job.location}</div></div><Badge variant={job.matchScore >= 75 ? 'success' : 'default'}>{job.matchScore || 0}%</Badge></div></button>) : <Empty message="No jobs captured yet. Configure a source or capture a job from the extension." />}
      </Card>

      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between"><h2 className="text-sm font-bold">Recent applications</h2><Button size="sm" variant="outline" onClick={() => navigate('/applications')}>Track applications</Button></div>
        {applications.length ? applications.map((application) => <div key={application.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3"><div className="flex justify-between gap-3"><div className="text-sm font-semibold">{application.job?.jobTitle || 'Application'}</div><Badge variant="info">{application.status.replaceAll('_', ' ')}</Badge></div><div className="text-xs text-slate-400 mt-1">{application.job?.companyName || 'Company not available'}</div></div>) : <Empty message="No applications have been submitted or tracked yet." />}
      </Card>
    </div>
  </div>;
}

function Empty({ message }: { message: string }) {
  return <div className="rounded-lg border border-dashed border-slate-800 p-6 text-center text-xs text-slate-400">{message}</div>;
}
