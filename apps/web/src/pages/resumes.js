import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from 'react';
import { Upload, FileText, Trash2, AlertCircle, Eye, Star, Loader2, } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { useResumesQuery, useUploadResumeMutation, useDeleteResumeMutation, useSetMasterResumeMutation, } from '../hooks/use-resumes';
import { formatDate } from '@sk-job-pilot/shared';
import { toast } from 'sonner';
export function ResumesPage() {
    const { data: resumesResponse, isLoading, isError, refetch } = useResumesQuery();
    const uploadMutation = useUploadResumeMutation();
    const deleteMutation = useDeleteResumeMutation();
    const setMasterMutation = useSetMasterResumeMutation();
    const [selectedResume, setSelectedResume] = React.useState(null);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
    const [deleteTargetId, setDeleteTargetId] = React.useState(null);
    const fileInputRef = React.useRef(null);
    if (isLoading)
        return _jsx(LoadingState, { message: "Loading resumes from server..." });
    if (isError)
        return _jsx(ErrorState, { title: "Failed to load resumes", onRetry: refetch });
    const resumes = resumesResponse?.data || [];
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        uploadMutation.mutate(file, {
            onSuccess: () => {
                toast.success(`Uploaded ${file.name} successfully!`);
                if (fileInputRef.current)
                    fileInputRef.current.value = '';
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : 'Failed to upload resume file');
            },
        });
    };
    const handleSetMaster = (id) => {
        setMasterMutation.mutate(id, {
            onSuccess: () => {
                toast.success('Master resume updated successfully!');
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : 'Failed to set master resume');
            },
        });
    };
    const handleDeleteConfirm = () => {
        if (!deleteTargetId)
            return;
        deleteMutation.mutate(deleteTargetId, {
            onSuccess: () => {
                toast.success('Resume deleted cleanly!');
                setDeleteTargetId(null);
            },
            onError: (err) => {
                toast.error(err instanceof Error ? err.message : 'Failed to delete resume');
            },
        });
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Resume Workspace", description: "Manage uploaded PDF/DOCX files, master profile selections, and extracted text parsed preview.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Resumes' }], actions: _jsxs("div", { children: [_jsx("input", { type: "file", ref: fileInputRef, accept: ".pdf,.docx,.doc", className: "hidden", onChange: handleFileChange }), _jsxs(Button, { size: "sm", onClick: () => fileInputRef.current?.click(), isLoading: uploadMutation.isPending, children: [_jsx(Upload, { className: "h-4 w-4 mr-1.5" }), "Upload Resume (PDF/DOCX)"] })] }) }), _jsx(Card, { className: "border-dashed border-2 border-slate-800 bg-slate-900/40 p-6 text-center", children: _jsxs("div", { className: "flex flex-col items-center justify-center space-y-2", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20", children: uploadMutation.isPending ? (_jsx(Loader2, { className: "h-6 w-6 animate-spin text-indigo-400" })) : (_jsx(Upload, { className: "h-6 w-6" })) }), _jsx("h3", { className: "text-sm font-semibold text-slate-200", children: "Upload PDF or DOCX Resume Document" }), _jsx("p", { className: "text-xs text-slate-400 max-w-md", children: "Max 10MB file size. Text extraction and section parsing will run automatically." }), _jsx(Button, { size: "sm", variant: "outline", className: "mt-2", onClick: () => fileInputRef.current?.click(), disabled: uploadMutation.isPending, children: "Choose File" })] }) }), resumes.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 gap-4 md:grid-cols-2", children: resumes.map((res) => (_jsxs(Card, { className: "space-y-4", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300", children: _jsx(FileText, { className: "h-5 w-5 text-indigo-400" }) }), _jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("h3", { className: "text-sm font-bold text-slate-100", children: res.name }), res.isMaster ? (_jsxs(Badge, { variant: "primary", className: "flex items-center gap-1 text-[10px]", children: [_jsx(Star, { className: "h-3 w-3 fill-indigo-400" }), " Master"] })) : null] }), _jsxs("p", { className: "text-xs text-slate-400 mt-0.5", children: [res.originalFileName, " \u2022 ", (res.fileSize / 1024).toFixed(1), " KB"] })] })] }), _jsx(Badge, { variant: res.parsingStatus === 'parsed'
                                        ? 'success'
                                        : res.parsingStatus === 'requires_ocr'
                                            ? 'warning'
                                            : 'danger', className: "text-[10px] uppercase font-bold", children: res.parsingStatus })] }), res.warnings && res.warnings.length > 0 ? (_jsxs("div", { className: "rounded bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-300 flex items-center gap-1.5", children: [_jsx(AlertCircle, { className: "h-3.5 w-3.5 flex-shrink-0" }), _jsx("span", { children: res.warnings[0] })] })) : null, _jsxs("div", { className: "flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs", children: [_jsxs("span", { className: "text-slate-500 text-[11px]", children: ["Uploaded ", formatDate(res.createdAt)] }), _jsxs("div", { className: "flex items-center gap-2", children: [!res.isMaster ? (_jsx(Button, { size: "sm", variant: "ghost", className: "text-xs", onClick: () => handleSetMaster(res.id), children: "Set Master" })) : null, _jsxs(Button, { size: "sm", variant: "outline", onClick: () => {
                                                setSelectedResume(res);
                                                setIsPreviewOpen(true);
                                            }, children: [_jsx(Eye, { className: "h-3.5 w-3.5 mr-1" }), " Preview"] }), _jsx(Button, { size: "sm", variant: "ghost", className: "text-rose-400 hover:text-rose-300", onClick: () => setDeleteTargetId(res.id), children: _jsx(Trash2, { className: "h-4 w-4" }) })] })] })] }, res.id))) })) : (_jsx(EmptyState, { title: "No resumes uploaded yet", description: "Upload your master resume PDF or DOCX file to get started.", icon: _jsx(FileText, { className: "h-6 w-6 text-slate-400" }), actionLabel: "Upload Resume", onAction: () => fileInputRef.current?.click() })), selectedResume && (_jsx(Modal, { isOpen: isPreviewOpen, onClose: () => setIsPreviewOpen(false), title: `Resume Preview: ${selectedResume.name}`, maxWidth: "2xl", children: _jsxs("div", { className: "space-y-4 max-h-[70vh] overflow-y-auto pr-1", children: [_jsxs("div", { className: "flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2", children: [_jsxs("span", { children: ["Status: ", _jsx("strong", { className: "text-slate-200", children: selectedResume.parsingStatus })] }), _jsxs("span", { children: ["SHA-256 Checksum:", ' ', _jsxs("code", { className: "font-mono text-[10px] text-indigo-400", children: [selectedResume.checksum.substring(0, 16), "..."] })] })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2", children: "Parsed Skills Detected" }), _jsx("div", { className: "flex flex-wrap gap-1", children: (selectedResume.parsedContent?.skills || []).map((skill, i) => (_jsx(Badge, { variant: "outline", className: "text-xs", children: skill }, i))) })] }), _jsxs("div", { children: [_jsx("h4", { className: "text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2", children: "Extracted Raw Text" }), _jsx("pre", { className: "text-xs font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap text-slate-300", children: selectedResume.rawText || 'No text extracted.' })] })] }) })), _jsx(ConfirmDialog, { isOpen: Boolean(deleteTargetId), onClose: () => setDeleteTargetId(null), onConfirm: handleDeleteConfirm, title: "Delete Resume Document", description: "Are you sure you want to delete this resume? The database record and physical storage file will be deleted permanently.", confirmLabel: "Delete Resume", variant: "danger", isLoading: deleteMutation.isPending })] }));
}
//# sourceMappingURL=resumes.js.map