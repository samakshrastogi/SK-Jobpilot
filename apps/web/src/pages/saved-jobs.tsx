import { Trash2, ArrowRight, BookmarkCheck } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useJobsQuery, useToggleSaveJobMutation } from '../hooks/use-jobs';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export function SavedJobsPage() {
  const navigate = useNavigate();
  const { data: jobsResponse, isLoading } = useJobsQuery({ savedOnly: true });
  const toggleSaveJobMutation = useToggleSaveJobMutation();

  const savedJobs = jobsResponse?.data || [];

  const handleUnsave = (jobId: string) => {
    toggleSaveJobMutation.mutate(jobId, {
      onSuccess: () => {
        toast.success('Job removed from Saved Opportunities.');
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Saved Opportunities"
        description="Bookmarked opportunities ready for application preparation and resume tailoring."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Saved Jobs' }]}
      />

      {isLoading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading saved jobs...</div>
      ) : savedJobs.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {savedJobs.map((job) => (
            <Card key={job.id} className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-100">{job.jobTitle}</h3>
                  <p className="text-xs text-slate-400">
                    {job.companyName} • {job.location}
                  </p>
                </div>
                <Badge variant="success">{job.matchScore || 0}% Match</Badge>
              </div>
              <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
                <span className="text-[11px] text-slate-500">Saved Opportunity</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300"
                    onClick={() => handleUnsave(job.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="primary" onClick={() => navigate('/applications')}>
                    Start Application <ArrowRight className="h-3.5 w-3.5 ml-1" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="py-12 text-center space-y-3 bg-slate-900/60 border-slate-800">
          <div className="flex justify-center text-slate-500">
            <BookmarkCheck className="h-8 w-8" />
          </div>
          <h3 className="text-sm font-bold text-slate-200">No saved opportunities yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Bookmark opportunities on the Discover Jobs page to track and prepare them here.
          </p>
          <Button size="sm" variant="primary" onClick={() => navigate('/discover')}>
            Discover Jobs
          </Button>
        </Card>
      )}
    </div>
  );
}
