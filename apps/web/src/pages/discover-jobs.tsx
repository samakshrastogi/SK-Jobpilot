import * as React from 'react';
import {
  Compass,
  Search,
  MapPin,
  DollarSign,
  ExternalLink,
  Plus,
  Bookmark,
  Archive,
  Trash2,
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Modal } from '../components/ui/modal';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import {
  useJobsQuery,
  useCreateJobMutation,
  useToggleSaveJobMutation,
  useToggleArchiveJobMutation,
  useDeleteJobMutation,
} from '../hooks/use-jobs';
import type { Job } from '@sk-job-pilot/shared';
import { formatDate, getMatchScoreColor } from '@sk-job-pilot/shared';
import { toast } from 'sonner';

export function DiscoverJobsPage() {
  const [page, setPage] = React.useState(1);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [workMode, setWorkMode] = React.useState('');
  const [employmentType, setEmploymentType] = React.useState('');
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Job query with filters
  const {
    data: jobsResponse,
    isLoading,
    isError,
    refetch,
  } = useJobsQuery({
    page,
    limit: 10,
    search: searchTerm || undefined,
    workMode: workMode || undefined,
    employmentType: employmentType || undefined,
  });

  const createJobMutation = useCreateJobMutation();
  const toggleSaveMutation = useToggleSaveJobMutation();
  const toggleArchiveMutation = useToggleArchiveJobMutation();
  const deleteJobMutation = useDeleteJobMutation();

  // Manual job modal form state
  const [newJob, setNewJob] = React.useState<Partial<Job>>({
    companyName: '',
    jobTitle: '',
    location: 'Remote',
    workMode: 'remote',
    employmentType: 'full_time',
    description: '',
    sourceUrl: '',
    salaryMin: 0,
    salaryMax: 0,
  });

  if (isLoading) return <LoadingState message="Loading jobs from database..." />;
  if (isError) return <ErrorState title="Failed to load jobs" onRetry={refetch} />;

  const jobs = jobsResponse?.data || [];
  const pagination = jobsResponse?.pagination;

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.companyName || !newJob.jobTitle || !newJob.description) {
      toast.error('Please fill in Company, Job Title, and Description');
      return;
    }

    createJobMutation.mutate(newJob, {
      onSuccess: (res) => {
        toast.success(res.message || 'Job created successfully!');
        setIsAddModalOpen(false);
        setNewJob({
          companyName: '',
          jobTitle: '',
          location: 'Remote',
          workMode: 'remote',
          employmentType: 'full_time',
          description: '',
          sourceUrl: '',
        });
      },
      onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Failed to create job');
      },
    });
  };

  const handleToggleSave = (id: string) => {
    toggleSaveMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.message || 'Updated saved status');
      },
    });
  };

  const handleToggleArchive = (id: string) => {
    toggleArchiveMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.message || 'Updated archive status');
      },
    });
  };

  const handleDelete = (id: string) => {
    deleteJobMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Job removed cleanly');
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discover Jobs"
        description="Persistent database job listings, search filters, and manual entry pipeline."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Discover Jobs' }]}
        actions={
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Job Manually
          </Button>
        }
      />

      {/* Search & Filter Bar */}
      <Card className="p-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Search by title, company, or keyword..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select
            value={workMode}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setWorkMode(e.target.value)}
            options={[
              { value: '', label: 'All Work Modes' },
              { value: 'remote', label: 'Remote' },
              { value: 'hybrid', label: 'Hybrid' },
              { value: 'onsite', label: 'Onsite' },
            ]}
          />
          <Select
            value={employmentType}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setEmploymentType(e.target.value)
            }
            options={[
              { value: '', label: 'All Employment Types' },
              { value: 'full_time', label: 'Full-time' },
              { value: 'part_time', label: 'Part-time' },
              { value: 'contract', label: 'Contract' },
              { value: 'freelance', label: 'Freelance' },
            ]}
          />
        </div>
      </Card>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {jobs.length > 0 ? (
          jobs.map((job) => {
            const scoreStyle = getMatchScoreColor(job.matchScore || 0);
            return (
              <Card key={job.id} className="hover:border-slate-700 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-100">{job.jobTitle}</h3>
                      <span
                        className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text}`}
                      >
                        {job.matchScore || 0}% Match
                      </span>
                      {job.savedStatus ? <Badge variant="success">Saved</Badge> : null}
                      {job.archivedStatus ? <Badge variant="outline">Archived</Badge> : null}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                      <span className="font-semibold text-slate-200">{job.companyName}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-500" /> {job.location}
                      </span>
                      {job.salaryMax ? (
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <DollarSign className="h-3.5 w-3.5" /> $
                          {job.salaryMin ? `${job.salaryMin / 1000}k - ` : ''}$
                          {job.salaryMax / 1000}k
                        </span>
                      ) : null}
                      <Badge variant="outline" className="text-[10px] py-0 capitalize">
                        {job.workMode} • {job.employmentType.replace('_', '-')}
                      </Badge>
                      <span className="text-[11px] text-slate-500">
                        • Posted {formatDate(job.postedDate || job.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 pt-1">{job.description}</p>
                  </div>
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      size="sm"
                      variant={job.savedStatus ? 'primary' : 'outline'}
                      onClick={() => handleToggleSave(job.id)}
                    >
                      <Bookmark className="h-3.5 w-3.5 mr-1" />
                      {job.savedStatus ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleToggleArchive(job.id)}
                      title={job.archivedStatus ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="h-4 w-4 text-slate-400" />
                    </Button>
                    {job.sourceUrl ? (
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => window.open(job.sourceUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    ) : null}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-rose-400 hover:text-rose-300"
                      onClick={() => handleDelete(job.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <EmptyState
            title="No jobs found in database"
            description="Add a job manually or adjust your filter queries."
            icon={<Compass className="h-6 w-6 text-slate-400" />}
            actionLabel="Add Job Manually"
            onAction={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {/* Pagination Controls */}
      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400">
          <span>
            Page {pagination.page} of {pagination.totalPages} ({pagination.totalItems} total jobs)
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasPrevPage}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      ) : null}

      {/* Manual Add Job Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Job Listing Manually"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateJob} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Company Name"
              required
              value={newJob.companyName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewJob({ ...newJob, companyName: e.target.value })
              }
            />
            <Input
              label="Job Title"
              required
              value={newJob.jobTitle || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewJob({ ...newJob, jobTitle: e.target.value })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input
              label="Location"
              value={newJob.location || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
            />
            <Select
              label="Work Mode"
              value={newJob.workMode || 'remote'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setNewJob({ ...newJob, workMode: e.target.value as any })
              }
              options={[
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'Onsite' },
              ]}
            />
            <Select
              label="Employment Type"
              value={newJob.employmentType || 'full_time'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setNewJob({ ...newJob, employmentType: e.target.value as any })
              }
              options={[
                { value: 'full_time', label: 'Full-time' },
                { value: 'part_time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'freelance', label: 'Freelance' },
              ]}
            />
          </div>
          <Input
            label="Source / Application URL"
            value={newJob.sourceUrl || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewJob({ ...newJob, sourceUrl: e.target.value })
            }
          />
          <Textarea
            label="Job Description"
            required
            rows={4}
            value={newJob.description || ''}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setNewJob({ ...newJob, description: e.target.value })
            }
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createJobMutation.isPending}>
              Create Job Listing
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
