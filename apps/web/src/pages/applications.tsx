import * as React from 'react';
import { Plus, History, Trash2, Briefcase, Bell, CheckCircle2 } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Drawer } from '../components/ui/drawer';
import { Badge } from '../components/ui/badge';
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
import { useRemindersQuery, useCreateReminderMutation, useToggleReminderMutation } from '../hooks/use-interviews';
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
  const [activeTab, setActiveTab] = React.useState<'applications' | 'reminders'>('applications');
  const [statusFilter, setStatusFilter] = React.useState('');
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
  const [isTimelineDrawerOpen, setIsTimelineDrawerOpen] = React.useState(false);
  const [selectedJobId, setSelectedJobId] = React.useState('');

  // Event form
  const [eventStatus, setEventStatus] = React.useState('note');
  const [eventTitle, setEventTitle] = React.useState('');
  const [eventDesc, setEventDesc] = React.useState('');

  // Reminder form
  const [isAddReminderModalOpen, setIsAddReminderModalOpen] = React.useState(false);
  const [reminderAppId, setReminderAppId] = React.useState('');
  const [reminderType] = React.useState('application_follow_up');
  const [reminderTitle, setReminderTitle] = React.useState('');
  const [reminderDueDate, setReminderDueDate] = React.useState('');

  const { data: appsResponse, isLoading, isError, refetch } = useApplicationsQuery({ status: statusFilter || undefined });
  const { data: savedJobsResponse } = useJobsQuery({ savedOnly: true });
  const { data: remindersResponse } = useRemindersQuery();

  const createAppMutation = useCreateApplicationMutation();
  const updateAppMutation = useUpdateApplicationMutation();
  const deleteAppMutation = useDeleteApplicationMutation();
  const addEventMutation = useAddTimelineEventMutation();

  const createReminderMutation = useCreateReminderMutation();
  const toggleReminderMutation = useToggleReminderMutation();

  if (isLoading) return <LoadingState message="Loading applications..." />;
  if (isError) return <ErrorState title="Failed to load applications" onRetry={refetch} />;

  const applications = appsResponse?.data || [];
  const savedJobs = savedJobsResponse?.data || [];
  const reminders = remindersResponse?.data || [];

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
      { id, data: { status: newStatus as Application['status'] } },
      {
        onSuccess: () => {
          toast.success(`Application status updated to ${newStatus.replace(/_/g, ' ')}`);
        },
      }
    );
  };

  const handleAddTimelineEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp || !eventTitle.trim()) {
      toast.error('Please add an event title');
      return;
    }

    addEventMutation.mutate(
      {
        id: selectedApp.id,
        event: {
          status: eventStatus,
          title: eventTitle.trim(),
          description: eventDesc.trim(),
        },
      },
      {
        onSuccess: (res) => {
          toast.success('Timeline event added');
          setSelectedApp(res.data || selectedApp);
          setEventStatus('note');
          setEventTitle('');
          setEventDesc('');
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : 'Failed to add timeline event');
        },
      }
    );
  };

  const handleCloseTimelineDrawer = () => {
    setIsTimelineDrawerOpen(false);
    setSelectedApp(null);
    setEventStatus('note');
    setEventTitle('');
    setEventDesc('');
  };

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderAppId || !reminderTitle || !reminderDueDate) {
      toast.error('Please fill in Application, Title, and Due Date');
      return;
    }

    createReminderMutation.mutate(
      {
        applicationId: reminderAppId,
        reminderType,
        title: reminderTitle,
        dueDate: reminderDueDate,
      },
      {
        onSuccess: () => {
          toast.success('Follow-up reminder created successfully!');
          setIsAddReminderModalOpen(false);
          setReminderTitle('');
          setReminderDueDate('');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Tracker & Follow-up Reminders"
        description="Monitor application lifecycle stages, timeline history, and set automated follow-up reminders."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Applications' }]}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setIsAddReminderModalOpen(true)}>
              <Bell className="h-4 w-4 mr-1.5" /> Add Reminder
            </Button>
            <Button size="sm" onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-1.5" /> Start New Application
            </Button>
          </div>
        }
      />

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('applications')}
          className={`pb-2 transition-colors border-b-2 ${
            activeTab === 'applications'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab('reminders')}
          className={`pb-2 transition-colors border-b-2 ${
            activeTab === 'reminders'
              ? 'border-indigo-500 text-indigo-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Follow-up Reminders ({reminders.length})
        </button>
      </div>

      {activeTab === 'applications' ? (
        <div className="space-y-4">
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
                        <Button
                          size="icon"
                          variant="ghost"
                          className="text-rose-400 hover:text-rose-300"
                          onClick={() => deleteAppMutation.mutate(app.id)}
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
        </div>
      ) : (
        <div className="space-y-4">
          {reminders.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {reminders.map((rem) => (
                <Card key={rem.id} className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="uppercase font-bold text-[10px] text-amber-400 border-amber-500/30">
                      {rem.reminderType.replace(/_/g, ' ')}
                    </Badge>
                    <Badge variant={rem.isCompleted ? 'success' : 'warning'}>
                      {rem.isCompleted ? 'Completed' : 'Pending'}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-bold text-slate-100">{rem.title}</h4>
                  <p className="text-xs text-slate-400">Due Date: {formatDate(rem.dueDate)}</p>
                  <div className="pt-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleReminderMutation.mutate(rem.id)}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" />
                      {rem.isCompleted ? 'Mark Pending' : 'Mark Complete'}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No follow-up reminders set"
              description="Keep track of recruiter replies, assessment deadlines, and follow-ups."
              icon={<Bell className="h-6 w-6 text-slate-400" />}
              actionLabel="Add Follow-up Reminder"
              onAction={() => setIsAddReminderModalOpen(true)}
            />
          )}
        </div>
      )}


      <Drawer
        isOpen={isTimelineDrawerOpen}
        onClose={handleCloseTimelineDrawer}
        title="Application Timeline"
      >
        {selectedApp ? (
          <div className="space-y-5">
            <div className="rounded-lg border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="text-sm font-bold text-slate-100">
                {selectedApp.job?.jobTitle || 'Application'}
              </h3>
              <p className="mt-1 text-xs text-slate-400">
                {selectedApp.job?.companyName || 'Company'} · {selectedApp.status.replace(/_/g, ' ')}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">History</h4>
              {selectedApp.timelineEvents?.length ? (
                selectedApp.timelineEvents.map((event, index) => {
                  const item = event as { date?: string; status?: string; title?: string; description?: string };
                  return (
                    <div key={`${item.title || 'event'}-${index}`} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-slate-100">{item.title || 'Timeline event'}</p>
                          <p className="mt-1 text-xs text-slate-500">{item.status?.replace(/_/g, ' ') || 'note'}</p>
                        </div>
                        <span className="text-[11px] text-slate-500">{formatDate(item.date || selectedApp.updatedAt)}</span>
                      </div>
                      {item.description ? <p className="mt-2 text-xs text-slate-400">{item.description}</p> : null}
                    </div>
                  );
                })
              ) : (
                <p className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-400">
                  No timeline events yet.
                </p>
              )}
            </div>

            <form onSubmit={handleAddTimelineEvent} className="space-y-3 border-t border-slate-800 pt-4">
              <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500">Add event</h4>
              <Select
                label="Status"
                value={eventStatus}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEventStatus(e.target.value)}
                options={[{ value: 'note', label: 'Note' }, ...statusOptions]}
              />
              <Input
                label="Title"
                required
                placeholder="e.g. Followed up with recruiter"
                value={eventTitle}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventTitle(e.target.value)}
              />
              <Input
                label="Description"
                placeholder="Optional details"
                value={eventDesc}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEventDesc(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={handleCloseTimelineDrawer}>
                  Close
                </Button>
                <Button type="submit" isLoading={addEventMutation.isPending}>
                  Add Event
                </Button>
              </div>
            </form>
          </div>
        ) : null}
      </Drawer>
      {/* Create Application Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Application Track"
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
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!selectedJobId} isLoading={createAppMutation.isPending}>
              Start Tracking
            </Button>
          </div>
        </form>
      </Modal>

      {/* Add Reminder Modal */}
      <Modal
        isOpen={isAddReminderModalOpen}
        onClose={() => setIsAddReminderModalOpen(false)}
        title="Add Follow-up Reminder"
      >
        <form onSubmit={handleAddReminder} className="space-y-4">
          <Select
            label="Target Application"
            required
            value={reminderAppId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setReminderAppId(e.target.value)}
            options={[
              { value: '', label: '-- Select Application --' },
              ...applications.map((a) => ({
                value: a.id,
                label: `${a.job?.jobTitle || 'Role'} at ${a.job?.companyName || 'Company'}`,
              })),
            ]}
          />
          <Input
            label="Reminder Title"
            required
            placeholder="e.g. Email recruiter for feedback"
            value={reminderTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReminderTitle(e.target.value)}
          />
          <Input
            label="Due Date"
            type="date"
            required
            value={reminderDueDate}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReminderDueDate(e.target.value)}
          />
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddReminderModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createReminderMutation.isPending}>
              Create Reminder
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
