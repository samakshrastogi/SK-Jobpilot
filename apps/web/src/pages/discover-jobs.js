import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
  const [newJob, setNewJob] = React.useState({
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
  if (isLoading) return _jsx(LoadingState, { message: 'Loading jobs from database...' });
  if (isError) return _jsx(ErrorState, { title: 'Failed to load jobs', onRetry: refetch });
  const jobs = jobsResponse?.data || [];
  const pagination = jobsResponse?.pagination;
  const handleCreateJob = (e) => {
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
      onError: (err) => {
        toast.error(err instanceof Error ? err.message : 'Failed to create job');
      },
    });
  };
  const handleToggleSave = (id) => {
    toggleSaveMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.message || 'Updated saved status');
      },
    });
  };
  const handleToggleArchive = (id) => {
    toggleArchiveMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(res.message || 'Updated archive status');
      },
    });
  };
  const handleDelete = (id) => {
    deleteJobMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Job removed cleanly');
      },
    });
  };
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsx(PageHeader, {
        title: 'Discover Jobs',
        description: 'Persistent database job listings, search filters, and manual entry pipeline.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Discover Jobs' }],
        actions: _jsxs(Button, {
          size: 'sm',
          onClick: () => setIsAddModalOpen(true),
          children: [_jsx(Plus, { className: 'h-4 w-4 mr-1.5' }), ' Add Job Manually'],
        }),
      }),
      _jsx(Card, {
        className: 'p-4',
        children: _jsxs('div', {
          className: 'grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4',
          children: [
            _jsx('div', {
              className: 'md:col-span-2',
              children: _jsx(Input, {
                placeholder: 'Search by title, company, or keyword...',
                leftIcon: _jsx(Search, { className: 'h-4 w-4' }),
                value: searchTerm,
                onChange: (e) => setSearchTerm(e.target.value),
              }),
            }),
            _jsx(Select, {
              value: workMode,
              onChange: (e) => setWorkMode(e.target.value),
              options: [
                { value: '', label: 'All Work Modes' },
                { value: 'remote', label: 'Remote' },
                { value: 'hybrid', label: 'Hybrid' },
                { value: 'onsite', label: 'Onsite' },
              ],
            }),
            _jsx(Select, {
              value: employmentType,
              onChange: (e) => setEmploymentType(e.target.value),
              options: [
                { value: '', label: 'All Employment Types' },
                { value: 'full_time', label: 'Full-time' },
                { value: 'part_time', label: 'Part-time' },
                { value: 'contract', label: 'Contract' },
                { value: 'freelance', label: 'Freelance' },
              ],
            }),
          ],
        }),
      }),
      _jsx('div', {
        className: 'space-y-4',
        children:
          jobs.length > 0
            ? jobs.map((job) => {
                const scoreStyle = getMatchScoreColor(job.matchScore || 0);
                return _jsx(
                  Card,
                  {
                    className: 'hover:border-slate-700 transition-colors',
                    children: _jsxs('div', {
                      className: 'flex flex-col md:flex-row md:items-center justify-between gap-4',
                      children: [
                        _jsxs('div', {
                          className: 'space-y-2 flex-1',
                          children: [
                            _jsxs('div', {
                              className: 'flex items-center gap-2',
                              children: [
                                _jsx('h3', {
                                  className: 'text-base font-bold text-slate-100',
                                  children: job.jobTitle,
                                }),
                                _jsxs('span', {
                                  className: `inline-flex items-center rounded px-2 py-0.5 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text}`,
                                  children: [job.matchScore || 0, '% Match'],
                                }),
                                job.savedStatus
                                  ? _jsx(Badge, { variant: 'success', children: 'Saved' })
                                  : null,
                                job.archivedStatus
                                  ? _jsx(Badge, { variant: 'outline', children: 'Archived' })
                                  : null,
                              ],
                            }),
                            _jsxs('div', {
                              className:
                                'flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400',
                              children: [
                                _jsx('span', {
                                  className: 'font-semibold text-slate-200',
                                  children: job.companyName,
                                }),
                                _jsxs('span', {
                                  className: 'flex items-center gap-1',
                                  children: [
                                    _jsx(MapPin, { className: 'h-3.5 w-3.5 text-slate-500' }),
                                    ' ',
                                    job.location,
                                  ],
                                }),
                                job.salaryMax
                                  ? _jsxs('span', {
                                      className:
                                        'flex items-center gap-1 text-emerald-400 font-medium',
                                      children: [
                                        _jsx(DollarSign, { className: 'h-3.5 w-3.5' }),
                                        ' $',
                                        job.salaryMin ? `${job.salaryMin / 1000}k - ` : '',
                                        '$',
                                        job.salaryMax / 1000,
                                        'k',
                                      ],
                                    })
                                  : null,
                                _jsxs(Badge, {
                                  variant: 'outline',
                                  className: 'text-[10px] py-0 capitalize',
                                  children: [
                                    job.workMode,
                                    ' \u2022 ',
                                    job.employmentType.replace('_', '-'),
                                  ],
                                }),
                                _jsxs('span', {
                                  className: 'text-[11px] text-slate-500',
                                  children: [
                                    '\u2022 Posted ',
                                    formatDate(job.postedDate || job.createdAt),
                                  ],
                                }),
                              ],
                            }),
                            _jsx('p', {
                              className: 'text-xs text-slate-300 line-clamp-2 pt-1',
                              children: job.description,
                            }),
                          ],
                        }),
                        _jsxs('div', {
                          className: 'flex items-center gap-2 self-end sm:self-center',
                          children: [
                            _jsxs(Button, {
                              size: 'sm',
                              variant: job.savedStatus ? 'primary' : 'outline',
                              onClick: () => handleToggleSave(job.id),
                              children: [
                                _jsx(Bookmark, { className: 'h-3.5 w-3.5 mr-1' }),
                                job.savedStatus ? 'Saved' : 'Save',
                              ],
                            }),
                            _jsx(Button, {
                              size: 'icon',
                              variant: 'ghost',
                              onClick: () => handleToggleArchive(job.id),
                              title: job.archivedStatus ? 'Unarchive' : 'Archive',
                              children: _jsx(Archive, { className: 'h-4 w-4 text-slate-400' }),
                            }),
                            job.sourceUrl
                              ? _jsx(Button, {
                                  size: 'icon',
                                  variant: 'outline',
                                  onClick: () => window.open(job.sourceUrl, '_blank'),
                                  children: _jsx(ExternalLink, { className: 'h-4 w-4' }),
                                })
                              : null,
                            _jsx(Button, {
                              size: 'icon',
                              variant: 'ghost',
                              className: 'text-rose-400 hover:text-rose-300',
                              onClick: () => handleDelete(job.id),
                              children: _jsx(Trash2, { className: 'h-4 w-4' }),
                            }),
                          ],
                        }),
                      ],
                    }),
                  },
                  job.id
                );
              })
            : _jsx(EmptyState, {
                title: 'No jobs found in database',
                description: 'Add a job manually or adjust your filter queries.',
                icon: _jsx(Compass, { className: 'h-6 w-6 text-slate-400' }),
                actionLabel: 'Add Job Manually',
                onAction: () => setIsAddModalOpen(true),
              }),
      }),
      pagination && pagination.totalPages > 1
        ? _jsxs('div', {
            className:
              'flex items-center justify-between border-t border-slate-800 pt-4 text-xs text-slate-400',
            children: [
              _jsxs('span', {
                children: [
                  'Page ',
                  pagination.page,
                  ' of ',
                  pagination.totalPages,
                  ' (',
                  pagination.totalItems,
                  ' total jobs)',
                ],
              }),
              _jsxs('div', {
                className: 'flex gap-2',
                children: [
                  _jsx(Button, {
                    size: 'sm',
                    variant: 'outline',
                    disabled: !pagination.hasPrevPage,
                    onClick: () => setPage((p) => p - 1),
                    children: 'Previous',
                  }),
                  _jsx(Button, {
                    size: 'sm',
                    variant: 'outline',
                    disabled: !pagination.hasNextPage,
                    onClick: () => setPage((p) => p + 1),
                    children: 'Next',
                  }),
                ],
              }),
            ],
          })
        : null,
      _jsx(Modal, {
        isOpen: isAddModalOpen,
        onClose: () => setIsAddModalOpen(false),
        title: 'Add Job Listing Manually',
        maxWidth: 'lg',
        children: _jsxs('form', {
          onSubmit: handleCreateJob,
          className: 'space-y-4',
          children: [
            _jsxs('div', {
              className: 'grid grid-cols-1 md:grid-cols-2 gap-3',
              children: [
                _jsx(Input, {
                  label: 'Company Name',
                  required: true,
                  value: newJob.companyName || '',
                  onChange: (e) => setNewJob({ ...newJob, companyName: e.target.value }),
                }),
                _jsx(Input, {
                  label: 'Job Title',
                  required: true,
                  value: newJob.jobTitle || '',
                  onChange: (e) => setNewJob({ ...newJob, jobTitle: e.target.value }),
                }),
              ],
            }),
            _jsxs('div', {
              className: 'grid grid-cols-1 md:grid-cols-3 gap-3',
              children: [
                _jsx(Input, {
                  label: 'Location',
                  value: newJob.location || '',
                  onChange: (e) => setNewJob({ ...newJob, location: e.target.value }),
                }),
                _jsx(Select, {
                  label: 'Work Mode',
                  value: newJob.workMode || 'remote',
                  onChange: (e) => setNewJob({ ...newJob, workMode: e.target.value }),
                  options: [
                    { value: 'remote', label: 'Remote' },
                    { value: 'hybrid', label: 'Hybrid' },
                    { value: 'onsite', label: 'Onsite' },
                  ],
                }),
                _jsx(Select, {
                  label: 'Employment Type',
                  value: newJob.employmentType || 'full_time',
                  onChange: (e) => setNewJob({ ...newJob, employmentType: e.target.value }),
                  options: [
                    { value: 'full_time', label: 'Full-time' },
                    { value: 'part_time', label: 'Part-time' },
                    { value: 'contract', label: 'Contract' },
                    { value: 'freelance', label: 'Freelance' },
                  ],
                }),
              ],
            }),
            _jsx(Input, {
              label: 'Source / Application URL',
              value: newJob.sourceUrl || '',
              onChange: (e) => setNewJob({ ...newJob, sourceUrl: e.target.value }),
            }),
            _jsx(Textarea, {
              label: 'Job Description',
              required: true,
              rows: 4,
              value: newJob.description || '',
              onChange: (e) => setNewJob({ ...newJob, description: e.target.value }),
            }),
            _jsxs('div', {
              className: 'flex justify-end gap-2 pt-2',
              children: [
                _jsx(Button, {
                  type: 'button',
                  variant: 'outline',
                  onClick: () => setIsAddModalOpen(false),
                  children: 'Cancel',
                }),
                _jsx(Button, {
                  type: 'submit',
                  isLoading: createJobMutation.isPending,
                  children: 'Create Job Listing',
                }),
              ],
            }),
          ],
        }),
      }),
    ],
  });
}
//# sourceMappingURL=discover-jobs.js.map
