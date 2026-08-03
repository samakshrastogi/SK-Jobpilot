import * as React from 'react';
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck, HelpCircle } from 'lucide-react';
import { Modal } from './modal';
import { Button } from './button';
import { Badge } from './badge';
import type { TailoredResume, TailoredResumeChange } from '@sk-job-pilot/shared';

interface ResumeDiffModalProps {
  isOpen: boolean;
  onClose: () => void;
  tailoredResume: TailoredResume;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  isApproving?: boolean;
}

export function ResumeDiffModal({
  isOpen,
  onClose,
  tailoredResume,
  onApprove,
  onReject,
  isApproving,
}: ResumeDiffModalProps) {
  const [changes, setChanges] = React.useState<TailoredResumeChange[]>(
    tailoredResume.proposedExperienceBullets || []
  );

  React.useEffect(() => {
    setChanges(tailoredResume.proposedExperienceBullets || []);
  }, [tailoredResume]);

  const handleToggleChangeStatus = (changeId: string, status: 'approved' | 'rejected') => {
    setChanges((prev) =>
      prev.map((c) => (c.id === changeId ? { ...c, approvalStatus: status } : c))
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Visual Resume Diff: ${tailoredResume.name}`}
      maxWidth="2xl"
    >
      <div className="space-y-6 max-h-[75vh] overflow-y-auto pr-1">
        {/* Alignment Header Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-lg border border-slate-800 bg-slate-950 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Approval Status</span>
            <Badge
              variant={
                tailoredResume.approvalStatus === 'approved'
                  ? 'success'
                  : tailoredResume.approvalStatus === 'rejected'
                  ? 'danger'
                  : 'warning'
              }
              className="mt-1 capitalize text-[10px]"
            >
              {tailoredResume.approvalStatus}
            </Badge>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Match Score Increase</span>
            <span className="text-sm font-bold text-emerald-400 mt-1 block">
              {tailoredResume.estimatedScoreBefore}% <ArrowRight className="inline h-3 w-3 mx-1 text-slate-500" /> {tailoredResume.estimatedScoreAfter}%
            </span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Truthfulness Guarantee</span>
            <span className="text-xs font-semibold text-indigo-400 mt-1 flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" /> 100% Truthfulness Enforced
            </span>
          </div>
        </div>

        {/* Professional Summary Comparison */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Proposed Professional Summary
          </h4>
          <div className="p-3 rounded-lg border border-indigo-500/20 bg-indigo-950/20 text-xs text-slate-200 leading-relaxed">
            {tailoredResume.proposedSummary}
          </div>
        </div>

        {/* Experience Bullets Comparison List */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Proposed Bullet Point Optimizations ({changes.length})
          </h4>

          {changes.map((change, idx) => (
            <div
              key={change.id || idx}
              className={`p-4 rounded-lg border text-xs space-y-3 transition-colors ${
                change.approvalStatus === 'approved'
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : change.approvalStatus === 'rejected'
                  ? 'border-rose-500/30 bg-rose-950/10'
                  : 'border-slate-800 bg-slate-950'
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] uppercase font-bold text-indigo-400 border-indigo-500/30">
                  {change.transformationType.replace('_', ' ')}
                </Badge>
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <span>Confidence:</span>
                  <strong className="text-emerald-400">{change.truthfulnessConfidence}%</strong>
                </div>
              </div>

              {change.originalText ? (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Original Text:</span>
                  <p className="text-slate-400 bg-slate-900/60 p-2 rounded text-[11px] line-through">{change.originalText}</p>
                </div>
              ) : null}

              <div>
                <span className="text-[10px] font-bold text-indigo-400 uppercase block mb-1">Proposed Tailored Text:</span>
                <p className="text-slate-100 font-medium bg-slate-900 p-2 rounded text-[11px] border border-slate-800">
                  {change.proposedText}
                </p>
              </div>

              <div className="text-[11px] text-slate-400 flex items-start gap-1">
                <HelpCircle className="h-3.5 w-3.5 text-indigo-400 flex-shrink-0 mt-0.5" />
                <span>Reason: {change.reason}</span>
              </div>

              {/* Individual Change Approval Controls */}
              <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px]">
                <div className="flex flex-wrap gap-1">
                  {(change.targetedKeywords || []).map((kw, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-slate-900 text-indigo-300 text-[10px]">
                      #{kw}
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleChangeStatus(change.id, 'rejected')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                      change.approvalStatus === 'rejected'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'text-slate-400 hover:text-rose-400'
                    }`}
                  >
                    <XCircle className="h-3 w-3" /> Reject
                  </button>
                  <button
                    onClick={() => handleToggleChangeStatus(change.id, 'approved')}
                    className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                      change.approvalStatus === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'text-slate-400 hover:text-emerald-400'
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" /> Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4">
          <Button variant="ghost" size="sm" onClick={() => onReject(tailoredResume.id)}>
            Reject Full Version
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={() => onApprove(tailoredResume.id)} isLoading={isApproving}>
              <ShieldCheck className="h-4 w-4 mr-1.5" /> Approve Tailored Resume
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
