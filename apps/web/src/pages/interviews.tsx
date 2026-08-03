import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Sparkles, Plus, BookOpen, Play } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Modal } from '../components/ui/modal';
import { Select } from '../components/ui/select';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { useInterviewPrepsQuery, useCreateInterviewPrepMutation } from '../hooks/use-interviews';
import { useJobsQuery } from '../hooks/use-jobs';
import { formatDate } from '@sk-job-pilot/shared';
import { toast } from 'sonner';

export function InterviewsPage() {
  const navigate = useNavigate();
  const { data: prepsResponse, isLoading, isError, refetch } = useInterviewPrepsQuery();
  const { data: jobsResponse } = useJobsQuery();

  const createPrepMutation = useCreateInterviewPrepMutation();

  const [isPrepModalOpen, setIsPrepModalOpen] = React.useState(false);
  const [selectedJobId, setSelectedJobId] = React.useState('');
  const [interviewType, setInterviewType] = React.useState('behavioural');
  const [difficulty, setDifficulty] = React.useState('senior');

  if (isLoading) return <LoadingState message="Loading interview preparations..." />;
  if (isError) return <ErrorState title="Failed to load interview preparations" onRetry={refetch} />;

  const preps = prepsResponse?.data || [];
  const jobs = jobsResponse?.data || [];

  const handleGeneratePrep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJobId) {
      toast.error('Please select a target job');
      return;
    }

    createPrepMutation.mutate(
      { jobId: selectedJobId, interviewType, difficulty },
      {
        onSuccess: () => {
          toast.success('AI Interview Preparation Package generated successfully!');
          setIsPrepModalOpen(false);
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : 'Failed to generate prep package');
        },
      }
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Interview Preparation & Mock Simulator"
        description="Role-specific Q&A study plans, STAR behavioural guides, and interactive AI mock room."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Interviews' }]}
        actions={
          <Button size="sm" onClick={() => setIsPrepModalOpen(true)}>
            <Sparkles className="h-4 w-4 mr-1.5" /> Generate AI Interview Prep
          </Button>
        }
      />

      {preps.length > 0 ? (
        <div className="space-y-4">
          {preps.map((prep) => (
            <Card key={prep.id} className="p-5 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-100">
                      {prep.job?.companyName || 'Target Company'} - {prep.job?.jobTitle || 'Target Role'}
                    </h3>
                    <Badge variant="info" className="uppercase text-[10px]">
                      {prep.interviewType}
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    Difficulty: <span className="text-indigo-400 font-semibold uppercase">{prep.difficulty}</span> • Generated {formatDate(prep.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={() => navigate(`/mock-interview?prepId=${prep.id}`)}
                  >
                    <Play className="h-3.5 w-3.5 mr-1 text-emerald-300" /> Launch AI Mock Room
                  </Button>
                </div>
              </div>

              {/* Questions Preview */}
              <div className="border-t border-slate-800 pt-3 space-y-2">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">
                  Generated Questions ({prep.questions?.length || 0})
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(prep.questions || []).slice(0, 4).map((q: any, idx: number) => (
                    <div key={idx} className="p-3 rounded bg-slate-950 border border-slate-800 text-xs">
                      <span className="font-bold text-slate-200 block mb-1">Q{idx + 1}: {q.question}</span>
                      <span className="text-[11px] text-slate-400">Key Points: {(q.keyPointsToCover || []).join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No interview preparations generated yet"
          description="Select a target job and generate a 7-day study plan with high-yield interview questions."
          icon={<Video className="h-6 w-6 text-slate-400" />}
          actionLabel="Generate AI Prep Package"
          onAction={() => setIsPrepModalOpen(true)}
        />
      )}

      {/* Generate Prep Modal */}
      <Modal
        isOpen={isPrepModalOpen}
        onClose={() => setIsPrepModalOpen(false)}
        title="Generate AI Interview Preparation Package"
      >
        <form onSubmit={handleGeneratePrep} className="space-y-4">
          <Select
            label="Select Target Job"
            required
            value={selectedJobId}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedJobId(e.target.value)}
            options={[
              { value: '', label: '-- Select a Job --' },
              ...jobs.map((j) => ({ value: j.id, label: `${j.companyName} - ${j.jobTitle}` })),
            ]}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Interview Type"
              value={interviewType}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setInterviewType(e.target.value)}
              options={[
                { value: 'behavioural', label: 'Behavioural (STAR)' },
                { value: 'technical', label: 'Technical Core' },
                { value: 'system_design', label: 'System Design' },
                { value: 'recruiter_screen', label: 'Recruiter Screen' },
              ]}
            />
            <Select
              label="Difficulty Level"
              value={difficulty}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setDifficulty(e.target.value)}
              options={[
                { value: 'mid', label: 'Mid-Level' },
                { value: 'senior', label: 'Senior Level' },
                { value: 'lead', label: 'Lead / Principal' },
              ]}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsPrepModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createPrepMutation.isPending}>
              Generate Prep
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
