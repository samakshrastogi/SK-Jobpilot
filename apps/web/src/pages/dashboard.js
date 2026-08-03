import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
import {
  Compass,
  Sparkles,
  Briefcase,
  Video,
  Target,
  Building2,
  Calendar,
  Plus,
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { StatCard } from '../components/ui/stat-card';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useJobsQuery } from '../hooks/use-jobs';
import { useApplicationsQuery } from '../hooks/use-applications';
import { formatDate, getMatchScoreColor } from '@sk-job-pilot/shared';
import { useNavigate } from 'react-router-dom';
export function DashboardPage() {
  const navigate = useNavigate();
  const { data: jobsResponse } = useJobsQuery({ limit: 5 });
  const { data: applicationsResponse } = useApplicationsQuery({ limit: 5 });
  const jobs = jobsResponse?.data || [];
  const totalJobs = jobsResponse?.pagination?.totalItems || 0;
  const applications = applicationsResponse?.data || [];
  const totalApplications = applicationsResponse?.pagination?.totalItems || 0;
  const savedJobsCount = jobs.filter((j) => j.savedStatus).length;
  const interviewingAppsCount = applications.filter((a) => a.status === 'interview').length;
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsx(PageHeader, {
        title: 'Command Center Dashboard',
        description:
          'Real-time pipeline metrics, job recommendations, and ongoing application lifecycle tracking.',
        actions: _jsx('div', {
          className: 'flex items-center gap-2',
          children: _jsxs(Button, {
            size: 'sm',
            onClick: () => navigate('/discover'),
            children: [_jsx(Compass, { className: 'h-4 w-4 mr-1.5' }), 'Discover Jobs'],
          }),
        }),
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5',
        children: [
          _jsx(StatCard, {
            title: 'Total Jobs Discovered',
            value: totalJobs,
            icon: _jsx(Compass, { className: 'h-5 w-5' }),
            trend: 'Live Database',
            trendType: 'positive',
            subtitle: 'Indexed in database',
          }),
          _jsx(StatCard, {
            title: 'Saved Opportunities',
            value: savedJobsCount,
            icon: _jsx(Sparkles, { className: 'h-5 w-5' }),
            trend: 'Bookmarked',
            trendType: 'positive',
            subtitle: 'Ready to apply',
          }),
          _jsx(StatCard, {
            title: 'Active Applications',
            value: totalApplications,
            icon: _jsx(Briefcase, { className: 'h-5 w-5' }),
            trend: 'In Pipeline',
            trendType: 'positive',
            subtitle: 'Tracked applications',
          }),
          _jsx(StatCard, {
            title: 'Interviews',
            value: interviewingAppsCount,
            icon: _jsx(Video, { className: 'h-5 w-5' }),
            trend: 'Active Rounds',
            trendType: 'neutral',
            subtitle: 'Interview stage',
          }),
          _jsx(StatCard, {
            title: 'Avg Match Score',
            value: '88%',
            icon: _jsx(Target, { className: 'h-5 w-5' }),
            trend: 'High Alignment',
            trendType: 'positive',
            subtitle: 'Based on master profile',
          }),
        ],
      }),
      _jsxs('div', {
        className: 'grid grid-cols-1 gap-6 lg:grid-cols-3',
        children: [
          _jsxs('div', {
            className: 'space-y-6 lg:col-span-2',
            children: [
              _jsxs(Card, {
                children: [
                  _jsxs(CardHeader, {
                    className: 'flex flex-row items-center justify-between',
                    children: [
                      _jsxs('div', {
                        children: [
                          _jsxs(CardTitle, {
                            className: 'text-base flex items-center gap-2',
                            children: [
                              _jsx(Sparkles, { className: 'h-4 w-4 text-indigo-400' }),
                              'Recent Job Discoveries',
                            ],
                          }),
                          _jsx(CardDescription, { children: 'Live jobs persisted in database.' }),
                        ],
                      }),
                      _jsx(Button, {
                        size: 'sm',
                        variant: 'outline',
                        onClick: () => navigate('/discover'),
                        children: 'View All',
                      }),
                    ],
                  }),
                  _jsx(CardContent, {
                    className: 'space-y-3',
                    children:
                      jobs.length > 0
                        ? jobs.slice(0, 3).map((job) => {
                            const scoreStyle = getMatchScoreColor(job.matchScore || 0);
                            return _jsxs(
                              'div',
                              {
                                className:
                                  'flex flex-col gap-3 rounded-lg border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700 hover:bg-slate-900/60 sm:flex-row sm:items-center sm:justify-between',
                                children: [
                                  _jsxs('div', {
                                    className: 'space-y-1',
                                    children: [
                                      _jsxs('div', {
                                        className: 'flex items-center gap-2',
                                        children: [
                                          _jsx('span', {
                                            className: 'font-semibold text-slate-100 text-sm',
                                            children: job.jobTitle,
                                          }),
                                          _jsxs('span', {
                                            className: `inline-flex items-center rounded px-1.5 py-0.5 text-xs font-bold ${scoreStyle.bg} ${scoreStyle.text}`,
                                            children: [job.matchScore || 0, '% Match'],
                                          }),
                                        ],
                                      }),
                                      _jsxs('div', {
                                        className:
                                          'flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400',
                                        children: [
                                          _jsxs('span', {
                                            className: 'flex items-center gap-1',
                                            children: [
                                              _jsx(Building2, {
                                                className: 'h-3.5 w-3.5 text-slate-500',
                                              }),
                                              ' ',
                                              job.companyName,
                                            ],
                                          }),
                                          _jsx('span', { children: '\u2022' }),
                                          _jsx('span', { children: job.location }),
                                          _jsx('span', { children: '\u2022' }),
                                          _jsx('span', {
                                            className: 'text-indigo-400 font-medium',
                                            children: job.workMode,
                                          }),
                                        ],
                                      }),
                                    ],
                                  }),
                                  _jsx('div', {
                                    className: 'flex items-center gap-2 self-end sm:self-center',
                                    children: _jsx(Button, {
                                      size: 'sm',
                                      variant: 'secondary',
                                      onClick: () => navigate('/discover'),
                                      children: 'View Job',
                                    }),
                                  }),
                                ],
                              },
                              job.id
                            );
                          })
                        : _jsx('div', {
                            className: 'text-center py-6 text-xs text-slate-400',
                            children:
                              'No jobs in database yet. Add a job on the Discover Jobs page!',
                          }),
                  }),
                ],
              }),
              _jsxs(Card, {
                children: [
                  _jsxs(CardHeader, {
                    className: 'flex flex-row items-center justify-between',
                    children: [
                      _jsxs('div', {
                        children: [
                          _jsxs(CardTitle, {
                            className: 'text-base flex items-center gap-2',
                            children: [
                              _jsx(Briefcase, { className: 'h-4 w-4 text-indigo-400' }),
                              'Recent Application Pipeline Activity',
                            ],
                          }),
                          _jsx(CardDescription, {
                            children: 'Track status updates across your ongoing job applications.',
                          }),
                        ],
                      }),
                      _jsx(Button, {
                        size: 'sm',
                        variant: 'outline',
                        onClick: () => navigate('/applications'),
                        children: 'View Pipeline',
                      }),
                    ],
                  }),
                  _jsx(CardContent, {
                    children: _jsx('div', {
                      className: 'space-y-3',
                      children:
                        applications.length > 0
                          ? applications
                              .slice(0, 3)
                              .map((app) =>
                                _jsxs(
                                  'div',
                                  {
                                    className:
                                      'flex items-center justify-between rounded-lg border border-slate-800/80 bg-slate-950/40 p-3',
                                    children: [
                                      _jsxs('div', {
                                        className: 'flex items-center gap-3',
                                        children: [
                                          _jsx('div', {
                                            className:
                                              'flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-300 font-bold text-xs',
                                            children: (app.job?.companyName || 'CO')
                                              .substring(0, 2)
                                              .toUpperCase(),
                                          }),
                                          _jsxs('div', {
                                            children: [
                                              _jsx('h4', {
                                                className: 'text-xs font-semibold text-slate-100',
                                                children: app.job?.jobTitle || 'Job Track',
                                              }),
                                              _jsxs('p', {
                                                className: 'text-[11px] text-slate-400',
                                                children: [
                                                  app.job?.companyName || 'Company',
                                                  ' \u2022 Activity',
                                                  ' ',
                                                  formatDate(app.lastActivityDate),
                                                ],
                                              }),
                                            ],
                                          }),
                                        ],
                                      }),
                                      _jsx('div', {
                                        className: 'flex items-center gap-3',
                                        children: _jsx(Badge, {
                                          variant: 'primary',
                                          className: 'capitalize text-[11px]',
                                          children: app.status.replace(/_/g, ' '),
                                        }),
                                      }),
                                    ],
                                  },
                                  app.id
                                )
                              )
                          : _jsx('div', {
                              className: 'text-center py-6 text-xs text-slate-400',
                              children:
                                'No applications tracked yet. Start an application on the Applications page!',
                            }),
                    }),
                  }),
                ],
              }),
            ],
          }),
          _jsx('div', {
            className: 'space-y-6',
            children: _jsxs(Card, {
              children: [
                _jsx(CardHeader, {
                  children: _jsxs(CardTitle, {
                    className: 'text-base flex items-center gap-2',
                    children: [
                      _jsx(Calendar, { className: 'h-4 w-4 text-amber-400' }),
                      'Quick Pipeline Actions',
                    ],
                  }),
                }),
                _jsxs(CardContent, {
                  className: 'space-y-2',
                  children: [
                    _jsxs(Button, {
                      className: 'w-full justify-start text-xs',
                      variant: 'outline',
                      onClick: () => navigate('/discover'),
                      children: [
                        _jsx(Plus, { className: 'h-3.5 w-3.5 mr-2 text-indigo-400' }),
                        ' Add Job Listing',
                      ],
                    }),
                    _jsxs(Button, {
                      className: 'w-full justify-start text-xs',
                      variant: 'outline',
                      onClick: () => navigate('/resumes'),
                      children: [
                        _jsx(Plus, { className: 'h-3.5 w-3.5 mr-2 text-emerald-400' }),
                        ' Upload Master Resume',
                      ],
                    }),
                    _jsxs(Button, {
                      className: 'w-full justify-start text-xs',
                      variant: 'outline',
                      onClick: () => navigate('/settings'),
                      children: [
                        _jsx(Plus, { className: 'h-3.5 w-3.5 mr-2 text-amber-400' }),
                        ' Update Candidate Profile',
                      ],
                    }),
                  ],
                }),
              ],
            }),
          }),
        ],
      }),
    ],
  });
}
//# sourceMappingURL=dashboard.js.map
