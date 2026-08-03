import * as React from 'react';
import { Plus, History, Trash2, ExternalLink, Briefcase } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Drawer } from '../components/ui/drawer';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '../components/ui/table';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import {
  useApplicationsQuery,
  useCreateApplicationMutation,
  useUpdateApplicationMutation,
  useDeleteApplicationMutation,
  useAddTimelineEventMutation,
} from '../hooks/use-applications';
import { useJobsQuery } from '../hooks/use-jobs';
import type { Application } from '@sk-job-pilot/shared';
import { formatDate } from '@sk-job-pilot/shared';
import { toast } from 'sonner';

const statusOptions = [
  { value: 'planned', label: 'Planned' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready_for_review', label: 'Ready for Review' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'acknowledged', label: 'Acknowledged' },
  { value: 'recruiter_contacted', label: 'Recruiter Contacted' },
  { value: 'assessment', label: 'Assessment' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer Received' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'withdrawn', label: 'Withdrawn' },
  { value: 'archived', label: 'Archived' },
];

export function ApplicationsPage() {
  const [statusFilter, setStatusFilter] = React.useState('');
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isTimelineDrawerOpen, setIsTimelineDrawerOpen] = React.useState(false);
  const [selectedJobId, setSelectedJobId] = React.useState('');

  // Event form
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventDesc, setEventDesc] = React.useState('');

  const {
    data: appsResponse,
    isLoading,
    isError,
    refetch,
  } = useApplicationsQuery({
    status: statusFilter || undefined,
  });

  const { data: savedJobsResponse } = useJobsQuery({ savedOnly: true });

  const createAppMutation = useCreateApplicationMutation();
  const updateAppMutation = useUpdateApplicationMutation();
  const deleteAppMutation = useDeleteApplicationMutation();
  const addEventMutation = useAddTimelineEventMutation();

  if (isLoading) return <LoadingState message="Loading applications from database..." />;
  if (isError) return <ErrorState title="Failed to load applications" onRetry={refetch} />;

  const applications = appsResponse?.data || [];
  const savedJobs = savedJobsResponse?.data || [];

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      toast.error('Please select a saved job');
      return;
    }

    createAppMutation.mutate(
      { jobId: selectedJobId, status: 'planned' },
      {
        onSuccess: (res) => {
          toast.success(res.message || 'Application created!');
          setIsCreateModalOpen(false);
          setSelectedJobId('');
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : 'Failed to create application');
        },
      }
    );
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    updateAppMutation.mutate(
      { id, data: { status: newStatus as any } },
      {
        onSuccess: () => {
          toast.success(`Application status updated to ${newStatus.replace(/_/g, ' ')}`);
        },
      }
    );
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !eventTitle) return;

    addEventMutation.mutate(
      {
        id: selectedApp.id,
        event: {
          status: selectedApp.status,
          title: eventTitle,
          description: eventDesc,
        },
      },
      {
        onSuccess: (res) => {
          toast.success('Timeline event added!');
          if (res.data) setSelectedApp(res.data);
          setEventTitle('');
          setEventDesc('');
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    deleteAppMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Application deleted cleanly');
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Tracker"
        description="Monitor status lifecycle, timeline history, and follow-ups across your job applications."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Applications' }]}
        actions={
          <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Start New Application
          </Button>
        }
      />

      {/* Filter Control Bar */}
      <Card className="p-4 flex items-center justify-between gap-4">
        <div className="w-64">
          <Select
            value={statusFilter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            options={[{ value: '', label: 'All Application Statuses' }, ...statusOptions]}
          />
        </div>
        <span className="text-xs text-slate-400 font-medium">
          Showing {applications.length} persistent application(s)
        </span>
      </Card>

      {/* Applications Table */}
      {applications.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Job Title & Company</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Activity</TableHead>
              <TableHead>Timeline Events</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell>
                  <div>
                    <div className="font-bold text-slate-100">
                      {app.job?.jobTitle || 'Job Listing'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {app.job?.companyName || 'Company'} • {app.job?.location}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Select
                    value={app.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      handleStatusChange(app.id, e.target.value)
                    }
                    options={statusOptions}
                    className="h-8 text-xs py-0 bg-slate-900 border-slate-700"
                  />
                </TableCell>
                <TableCell className="text-xs text-slate-400">
                  {formatDate(app.lastActivityDate || app.updatedAt)}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs"
                    onClick={() => {
                      setSelectedApp(app);
                      setIsTimelineDrawerOpen(true);
                    }}
                  >
                    <History className="h-3.5 w-3.5 mr-1" />
                    {app.timelineEvents?.length || 0} Events
                  </Button>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {app.applicationUrl ? (
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => window.open(app.applicationUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                      </Button>
                    ) : null}
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-rose-400 hover:text-rose-300"
                      onClick={() => handleDelete(app.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <EmptyState
          title="No applications tracked yet"
          description="Create a new application from a saved job opportunity."
          icon={<Briefcase className="h-6 w-6 text-slate-400" />}
          actionLabel="Start Application"
          onAction={() => setIsCreateModalOpen(true)}
        />
      )}

      {/* Create Application Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Application Track"
        maxWidth="md"
      >
        <form onSubmit={handleCreateApp} className="space-y-4">
          <Select
            label="Select Saved Job Opportunity"
            required
            value={selectedJobId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedJobId(e.target.value)}
            options={[
              { value: '', label: '-- Select a Job --' },
              ...savedJobs.map((j) => ({
                value: j.id,
                label: `${j.jobTitle} at ${j.companyName}`,
              })),
            ]}
          />
          {savedJobs.length === 0 ? (
            <p className="text-xs text-amber-400">
              Note: You have no saved jobs yet. Save a job from the Discover Jobs page first!
            </p>
          ) : null}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedJobId} isLoading={createAppMutation.isPending}>
              Start Tracking Application
            </Button>
          </div>
        </form>
      </Modal>

      {/* Timeline Events Drawer */}
      {selectedApp && (
        <Drawer
          isOpen={isTimelineDrawerOpen}
          onClose={() => setIsTimelineDrawerOpen(false)}
          side="right"
          title={`Timeline History: ${selectedApp.job?.jobTitle || 'Application'}`}
        >
          <div className="space-y-6 pt-2">
            {/* Timeline Event Feed */}
            <div className="space-y-3">
              {(selectedApp.timelineEvents || []).map((ev, i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-950 space-y-1"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-400">{ev.title as string}</span>
                    <span className="text-[10px] text-slate-500">
                      {formatDate(ev.date as string)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300">{ev.description as string}</p>
                </div>
              ))}
            </div>

            {/* Add Event Form */}
            <form
              onSubmit={handleAddEvent}
              className="p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3"
            >
              <h4 className="text-xs font-bold text-slate-200">Log Custom Timeline Event</h4>
              <Input
                placeholder="Event Title (e.g. Recruiter Call Scheduled)"
                required
                value={eventTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventTitle(e.target.value)}
              />
              <Input
                placeholder="Description / Notes"
                value={eventDesc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDesc(e.target.value)}
              />
              <Button
                type="submit"
                size="sm"
                className="w-full"
                isLoading={addEventMutation.isPending}
              >
                Add Event Log
              </Button>
            </form>
          </div>
        </Drawer>
      )}
    </div>
  );
}
