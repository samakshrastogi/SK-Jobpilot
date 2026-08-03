import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Plus, History, Trash2, ExternalLink, Briefcase } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Drawer } from '../components/ui/drawer';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, } from '../components/ui/table';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { useApplicationsQuery, useCreateApplicationMutation, useUpdateApplicationMutation, useDeleteApplicationMutation, useAddTimelineEventMutation, } from '../hooks/use-applications';
import { useJobsQuery } from '../hooks/use-jobs';
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
    const [selectedApp, setSelectedApp] = React.useState(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);
    const [isTimelineDrawerOpen, setIsTimelineDrawerOpen] = React.useState(false);
    const [selectedJobId, setSelectedJobId] = React.useState('');
    // Event form
    const [eventTitle, setEventTitle] = React.useState('');
    const [eventDesc, setEventDesc] = React.useState('');
    const { data: appsResponse, isLoading, isError, refetch, } = useApplicationsQuery({
        status: statusFilter || undefined,
    });
    const { data: savedJobsResponse } = useJobsQuery({ savedOnly: true });
    const createAppMutation = useCreateApplicationMutation();
    const updateAppMutation = useUpdateApplicationMutation();
    const deleteAppMutation = useDeleteApplicationMutation();
    const addEventMutation = useAddTimelineEventMutation();
    if (isLoading)
        return _jsx(LoadingState, { message: "Loading applications from database..." });
    if (isError)
        return _jsx(ErrorState, { title: "Failed to load applications", onRetry: refetch });
    const applications = appsResponse?.data || [];
    const savedJobs = savedJobsResponse?.data || [];
    const handleCreateApp = (e) => {
        e.preventDefault();
        if (!selectedJobId) {
            toast.error('Please select a saved job');
            return;
        }
        createAppMutation.mutate({ jobId: selectedJobId, status: 'planned' }, {
            onSuccess: (res) => {
                toast.success(res.message || 'Application created!');
                setIsCreateModalOpen(false);
                setSelectedJobId('');
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : 'Failed to create application');
            },
        });
    };
    const handleStatusChange = (id, newStatus) => {
        updateAppMutation.mutate({ id, data: { status: newStatus } }, {
            onSuccess: () => {
                toast.success(`Application status updated to ${newStatus.replace(/_/g, ' ')}`);
            },
        });
    };
    const handleAddEvent = (e) => {
        e.preventDefault();
        if (!selectedApp || !eventTitle)
            return;
        addEventMutation.mutate({
            id: selectedApp.id,
            event: {
                status: selectedApp.status,
                title: eventTitle,
                description: eventDesc,
            },
        }, {
            onSuccess: (res) => {
                toast.success('Timeline event added!');
                if (res.data)
                    setSelectedApp(res.data);
                setEventTitle('');
                setEventDesc('');
            },
        });
    };
    const handleDelete = (id) => {
        deleteAppMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Application deleted cleanly');
            },
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Application Tracker", description: "Monitor status lifecycle, timeline history, and follow-ups across your job applications.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Applications' }], actions: _jsxs(Button, { size: "sm", onClick: () => setIsCreateModalOpen(true), children: [_jsx(Plus, { className: "h-4 w-4 mr-1.5" }), " Start New Application"] }) }), _jsxs(Card, { className: "p-4 flex items-center justify-between gap-4", children: [_jsx("div", { className: "w-64", children: _jsx(Select, { value: statusFilter, onChange: (e) => setStatusFilter(e.target.value), options: [{ value: '', label: 'All Application Statuses' }, ...statusOptions] }) }), _jsxs("span", { className: "text-xs text-slate-400 font-medium", children: ["Showing ", applications.length, " persistent application(s)"] })] }), applications.length > 0 ? (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Job Title & Company" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Last Activity" }), _jsx(TableHead, { children: "Timeline Events" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: applications.map((app) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { children: [_jsx("div", { className: "font-bold text-slate-100", children: app.job?.jobTitle || 'Job Listing' }), _jsxs("div", { className: "text-xs text-slate-400", children: [app.job?.companyName || 'Company', " \u2022 ", app.job?.location] })] }) }), _jsx(TableCell, { children: _jsx(Select, { value: app.status, onChange: (e) => handleStatusChange(app.id, e.target.value), options: statusOptions, className: "h-8 text-xs py-0 bg-slate-900 border-slate-700" }) }), _jsx(TableCell, { className: "text-xs text-slate-400", children: formatDate(app.lastActivityDate || app.updatedAt) }), _jsx(TableCell, { children: _jsxs(Button, { size: "sm", variant: "outline", className: "h-7 text-xs", onClick: () => {
                                            setSelectedApp(app);
                                            setIsTimelineDrawerOpen(true);
                                        }, children: [_jsx(History, { className: "h-3.5 w-3.5 mr-1" }), app.timelineEvents?.length || 0, " Events"] }) }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-1", children: [app.applicationUrl ? (_jsx(Button, { size: "icon", variant: "ghost", onClick: () => window.open(app.applicationUrl, '_blank'), children: _jsx(ExternalLink, { className: "h-4 w-4 text-slate-400" }) })) : null, _jsx(Button, { size: "icon", variant: "ghost", className: "text-rose-400 hover:text-rose-300", onClick: () => handleDelete(app.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, app.id))) })] })) : (_jsx(EmptyState, { title: "No applications tracked yet", description: "Create a new application from a saved job opportunity.", icon: _jsx(Briefcase, { className: "h-6 w-6 text-slate-400" }), actionLabel: "Start Application", onAction: () => setIsCreateModalOpen(true) })), _jsx(Modal, { isOpen: isCreateModalOpen, onClose: () => setIsCreateModalOpen(false), title: "Create New Application Track", maxWidth: "md", children: _jsxs("form", { onSubmit: handleCreateApp, className: "space-y-4", children: [_jsx(Select, { label: "Select Saved Job Opportunity", required: true, value: selectedJobId, onChange: (e) => setSelectedJobId(e.target.value), options: [
                                { value: '', label: '-- Select a Job --' },
                                ...savedJobs.map((j) => ({
                                    value: j.id,
                                    label: `${j.jobTitle} at ${j.companyName}`,
                                })),
                            ] }), savedJobs.length === 0 ? (_jsx("p", { className: "text-xs text-amber-400", children: "Note: You have no saved jobs yet. Save a job from the Discover Jobs page first!" })) : null, _jsxs("div", { className: "flex justify-end gap-2 pt-2", children: [_jsx(Button, { type: "button", variant: "outline", onClick: () => setIsCreateModalOpen(false), children: "Cancel" }), _jsx(Button, { type: "submit", disabled: !selectedJobId, isLoading: createAppMutation.isPending, children: "Start Tracking Application" })] })] }) }), selectedApp && (_jsx(Drawer, { isOpen: isTimelineDrawerOpen, onClose: () => setIsTimelineDrawerOpen(false), side: "right", title: `Timeline History: ${selectedApp.job?.jobTitle || 'Application'}`, children: _jsxs("div", { className: "space-y-6 pt-2", children: [_jsx("div", { className: "space-y-3", children: (selectedApp.timelineEvents || []).map((ev, i) => (_jsxs("div", { className: "p-3 rounded-lg border border-slate-800 bg-slate-950 space-y-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs", children: [_jsx("span", { className: "font-bold text-indigo-400", children: ev.title }), _jsx("span", { className: "text-[10px] text-slate-500", children: formatDate(ev.date) })] }), _jsx("p", { className: "text-xs text-slate-300", children: ev.description })] }, i))) }), _jsxs("form", { onSubmit: handleAddEvent, className: "p-3 rounded-lg border border-slate-800 bg-slate-900/60 space-y-3", children: [_jsx("h4", { className: "text-xs font-bold text-slate-200", children: "Log Custom Timeline Event" }), _jsx(Input, { placeholder: "Event Title (e.g. Recruiter Call Scheduled)", required: true, value: eventTitle, onChange: (e) => setEventTitle(e.target.value) }), _jsx(Input, { placeholder: "Description / Notes", value: eventDesc, onChange: (e) => setEventDesc(e.target.value) }), _jsx(Button, { type: "submit", size: "sm", className: "w-full", isLoading: addEventMutation.isPending, children: "Add Event Log" })] })] }) }))] }));
}
//# sourceMappingURL=applications.js.map