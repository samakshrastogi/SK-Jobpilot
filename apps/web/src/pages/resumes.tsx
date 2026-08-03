import * as React from 'react';
import {
  Upload,
  FileText,
  Trash2,
  AlertCircle,
  Eye,
  Star,
  Loader2,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { ConfirmDialog } from '../components/ui/confirm-dialog';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { ResumeDiffModal } from '../components/ui/resume-diff-modal';
import {
  useResumesQuery,
  useUploadResumeMutation,
  useDeleteResumeMutation,
  useSetMasterResumeMutation,
} from '../hooks/use-resumes';
import {
  useCandidateAnalysisQuery,
  useRunCandidateAnalysisMutation,
  useTailoredResumesQuery,
  useApproveTailoredResumeMutation,
  useRejectTailoredResumeMutation,
} from '../hooks/use-ai';
import type { Resume, TailoredResume } from '@sk-job-pilot/shared';
import { formatDate } from '@sk-job-pilot/shared';
import { toast } from 'sonner';

export function ResumesPage() {
  const { data: resumesResponse, isLoading, isError, refetch } = useResumesQuery();
  const { data: candidateAnalysisResponse } = useCandidateAnalysisQuery();
  const { data: tailoredResumesResponse } = useTailoredResumesQuery();

  const uploadMutation = useUploadResumeMutation();
  const deleteMutation = useDeleteResumeMutation();
  const setMasterMutation = useSetMasterResumeMutation();
  const runAnalysisMutation = useRunCandidateAnalysisMutation();
  const approveTailoredMutation = useApproveTailoredResumeMutation();
  const rejectTailoredMutation = useRejectTailoredResumeMutation();

  const [selectedResume, setSelectedResume] = React.useState<Resume | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);
  const [deleteTargetId, setDeleteTargetId] = React.useState<string | null>(null);
  const [activeDiffResume, setActiveDiffResume] = React.useState<TailoredResume | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (isLoading) return <LoadingState message="Loading resumes from server..." />;
  if (isError) return <ErrorState title="Failed to load resumes" onRetry={refetch} />;

  const resumes = resumesResponse?.data || [];
  const candidateAnalysis = candidateAnalysisResponse?.data;
  const tailoredResumes = tailoredResumesResponse?.data || [];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    uploadMutation.mutate(file, {
      onSuccess: () => {
        toast.success(`Uploaded ${file.name} successfully!`);
        if (fileInputRef.current) fileInputRef.current.value = '';
      },
      onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Failed to upload resume file');
      },
    });
  };

  const handleRunCandidateAnalysis = () => {
    runAnalysisMutation.mutate(true, {
      onSuccess: () => {
        toast.success('Generated AI Candidate Intelligence Analysis!');
      },
      onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Failed to analyze candidate profile');
      },
    });
  };

  const handleApproveTailored = (id: string) => {
    approveTailoredMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Approved tailored resume version!');
        setActiveDiffResume(null);
      },
    });
  };

  const handleRejectTailored = (id: string) => {
    rejectTailoredMutation.mutate(id, {
      onSuccess: () => {
        toast.success('Rejected tailored resume version');
        setActiveDiffResume(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Workspace & Tailoring Engine"
        description="Master resumes, AI candidate analysis, and visual resume diff approval workflows."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resumes' }]}
        actions={
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRunCandidateAnalysis}
              isLoading={runAnalysisMutation.isPending}
            >
              <Sparkles className="h-4 w-4 mr-1.5 text-indigo-400" />
              Analyze Candidate AI
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".pdf,.docx,.doc"
              className="hidden"
              onChange={handleFileChange}
            />
            <Button
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              isLoading={uploadMutation.isPending}
            >
              <Upload className="h-4 w-4 mr-1.5" />
              Upload Resume
            </Button>
          </div>
        }
      />

      {/* Candidate AI Intelligence Analysis Overview */}
      {candidateAnalysis ? (
        <Card className="border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-slate-100">
                AI Candidate Intelligence Profile: {candidateAnalysis.primaryTitle}
              </h3>
              <Badge variant="outline" className="text-[10px] border-indigo-500/40 text-indigo-300">
                {candidateAnalysis.seniorityEstimate} •{' '}
                {candidateAnalysis.totalRelevantExperienceYears} Years Exp
              </Badge>
            </div>
            <span className="text-[11px] text-slate-400">100% Factually Grounded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div>
              <span className="text-slate-400 block text-[11px]">Core Extracted Skills</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(candidateAnalysis.coreSkills || []).slice(0, 6).map((s, i) => (
                  <Badge key={i} variant="primary" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Backend Strengths</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(candidateAnalysis.backendStrengths || []).slice(0, 4).map((s, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <span className="text-slate-400 block text-[11px]">Cloud & DevOps Strengths</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {(candidateAnalysis.cloudDevOpsStrengths || []).slice(0, 4).map((s, i) => (
                  <Badge key={i} variant="outline" className="text-[10px]">
                    {s}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ) : null}

      {/* Upload Drop Zone Card */}
      <Card className="border-dashed border-2 border-slate-800 bg-slate-900/40 p-6 text-center">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            {uploadMutation.isPending ? (
              <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
            ) : (
              <Upload className="h-6 w-6" />
            )}
          </div>
          <h3 className="text-sm font-semibold text-slate-200">
            Upload Master PDF or DOCX Resume Document
          </h3>
          <p className="text-xs text-slate-400 max-w-md">
            Max 10MB file size. Text extraction and section parsing will run automatically.
          </p>
          <Button
            size="sm"
            variant="outline"
            className="mt-2"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            Choose File
          </Button>
        </div>
      </Card>

      {/* Tailored Resumes List */}
      {tailoredResumes.length > 0 ? (
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
            <Sparkles className="h-4 w-4" /> Proposed Tailored Resume Versions (
            {tailoredResumes.length})
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {tailoredResumes.map((tr) => (
              <Card key={tr.id} className="p-4 space-y-3 border-indigo-500/20 bg-indigo-950/10">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-100">{tr.name}</h4>
                  <Badge
                    variant={
                      tr.approvalStatus === 'approved'
                        ? 'success'
                        : tr.approvalStatus === 'rejected'
                          ? 'danger'
                          : 'warning'
                    }
                    className="text-[10px] capitalize"
                  >
                    {tr.approvalStatus}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Target Score:</span>
                  <strong className="text-emerald-400">
                    {tr.estimatedScoreBefore}%{' '}
                    <ArrowRight className="inline h-3 w-3 mx-1 text-slate-500" />{' '}
                    {tr.estimatedScoreAfter}%
                  </strong>
                </div>
                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2">
                  <span className="text-[11px] text-slate-500">{formatDate(tr.createdAt)}</span>
                  <Button size="sm" variant="outline" onClick={() => setActiveDiffResume(tr)}>
                    Review Visual Diff
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {/* Master Resumes List */}
      <div className="space-y-3 pt-2">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
          Master Resume Documents ({resumes.length})
        </h3>
        {resumes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {resumes.map((res) => (
              <Card key={res.id} className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 text-slate-300">
                      <FileText className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-slate-100">{res.name}</h3>
                        {res.isMaster ? (
                          <Badge variant="primary" className="flex items-center gap-1 text-[10px]">
                            <Star className="h-3 w-3 fill-indigo-400" /> Master
                          </Badge>
                        ) : null}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {res.originalFileName} • {(res.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      res.parsingStatus === 'parsed'
                        ? 'success'
                        : res.parsingStatus === 'requires_ocr'
                          ? 'warning'
                          : 'danger'
                    }
                    className="text-[10px] uppercase font-bold"
                  >
                    {res.parsingStatus}
                  </Badge>
                </div>

                {res.warnings && res.warnings.length > 0 ? (
                  <div className="rounded bg-amber-500/10 border border-amber-500/20 p-2 text-[11px] text-amber-300 flex items-center gap-1.5">
                    <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
                    <span>{res.warnings[0]}</span>
                  </div>
                ) : null}

                <div className="flex items-center justify-between border-t border-slate-800/80 pt-3 text-xs">
                  <span className="text-slate-500 text-[11px]">
                    Uploaded {formatDate(res.createdAt)}
                  </span>
                  <div className="flex items-center gap-2">
                    {!res.isMaster ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => setMasterMutation.mutate(res.id)}
                      >
                        Set Master
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedResume(res);
                        setIsPreviewOpen(true);
                      }}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> Preview
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-rose-400 hover:text-rose-300"
                      onClick={() => setDeleteTargetId(res.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No resumes uploaded yet"
            description="Upload your master resume PDF or DOCX file to get started."
            icon={<FileText className="h-6 w-6 text-slate-400" />}
            actionLabel="Upload Resume"
            onAction={() => fileInputRef.current?.click()}
          />
        )}
      </div>

      {/* Visual Resume Diff Modal */}
      {activeDiffResume ? (
        <ResumeDiffModal
          isOpen={Boolean(activeDiffResume)}
          onClose={() => setActiveDiffResume(null)}
          tailoredResume={activeDiffResume}
          onApprove={handleApproveTailored}
          onReject={handleRejectTailored}
          isApproving={approveTailoredMutation.isPending}
        />
      ) : null}

      {/* Resume Preview Modal */}
      {selectedResume && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`Resume Preview: ${selectedResume.name}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
            <div className="flex items-center justify-between text-xs text-slate-400 border-b border-slate-800 pb-2">
              <span>
                Status: <strong className="text-slate-200">{selectedResume.parsingStatus}</strong>
              </span>
              <span>
                SHA-256 Checksum:{' '}
                <code className="font-mono text-[10px] text-indigo-400">
                  {selectedResume.checksum.substring(0, 16)}...
                </code>
              </span>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                Parsed Skills Detected
              </h4>
              <div className="flex flex-wrap gap-1">
                {(selectedResume.parsedContent?.skills || []).map((skill, i) => (
                  <Badge key={i} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2">
                Extracted Raw Text
              </h4>
              <pre className="text-xs font-mono bg-slate-950 p-4 rounded-lg border border-slate-800 whitespace-pre-wrap text-slate-300">
                {selectedResume.rawText || 'No text extracted.'}
              </pre>
            </div>
          </div>
        </Modal>
      )}

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => {
          if (deleteTargetId) {
            deleteMutation.mutate(deleteTargetId, {
              onSuccess: () => setDeleteTargetId(null),
            });
          }
        }}
        title="Delete Resume Document"
        description="Are you sure you want to delete this resume? The database record and physical storage file will be deleted permanently."
        confirmLabel="Delete Resume"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
