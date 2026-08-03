import * as React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Video,
  Send,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Award,
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import {
  useStartMockSessionMutation,
  useSubmitMockAnswerMutation,
} from '../hooks/use-interviews';
import type { MockInterviewSession } from '@sk-job-pilot/shared';
import { toast } from 'sonner';

export function MockInterviewRoomPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const prepId = searchParams.get('prepId');

  const startSessionMutation = useStartMockSessionMutation();
  const submitAnswerMutation = useSubmitMockAnswerMutation();

  const [session, setSession] = React.useState<MockInterviewSession | null>(null);
  const [answerText, setAnswerText] = React.useState('');

  React.useEffect(() => {
    if (prepId && !session) {
      startSessionMutation.mutate(prepId, {
        onSuccess: (res) => {
          if (res.data) setSession(res.data);
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : 'Failed to start mock session');
        },
      });
    }
  }, [prepId]);

  if (!prepId) {
    return <ErrorState title="No prepId provided" message="Please launch a mock interview from the Interviews workspace." />;
  }

  if (startSessionMutation.isPending || !session) {
    return <LoadingState message="Initializing Interactive AI Mock Interview Room..." />;
  }

  const questions = session.questions || [];
  const currentIdx = session.currentQuestionIndex || 0;
  const currentQuestion = questions[currentIdx] || questions[0];
  const isCompleted = session.status === 'completed';

  const handleSubmitAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!answerText.trim()) {
      toast.error('Please type your response before submitting.');
      return;
    }

    submitAnswerMutation.mutate(
      {
        sessionId: session.id,
        questionId: currentQuestion?.id || 'q-1',
        candidateAnswer: answerText,
      },
      {
        onSuccess: (res) => {
          if (res.data) {
            setSession(res.data);
            setAnswerText('');
            toast.success('Answer evaluated! Feedback ready.');
          }
        },
        onError: (err: unknown) => {
          toast.error(err instanceof Error ? err.message : 'Failed to submit answer');
        },
      }
    );
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="Interactive AI Mock Interview Room"
        description="Text mock session with real-time STAR framework evaluation and transparent scoring rubric."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Interviews', href: '/interviews' }, { label: 'Mock Room' }]}
        actions={
          <Button variant="outline" size="sm" onClick={() => navigate('/interviews')}>
            Exit Session
          </Button>
        }
      />

      {isCompleted ? (
        <Card className="border-emerald-500/40 bg-emerald-950/20 p-6 space-y-6 text-center">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Award className="h-12 w-12 text-emerald-400" />
            <h2 className="text-xl font-bold text-slate-100">Mock Session Completed!</h2>
            <span className="text-3xl font-extrabold text-emerald-400">
              Overall Score: {session.overallScore}%
            </span>
            <p className="text-xs text-slate-300 max-w-lg">{session.finalSummary}</p>
          </div>

          <div className="space-y-4 text-left border-t border-slate-800 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400">Evaluated Questions & STAR Feedback</h4>
            {(session.answers || []).map((ans, i) => (
              <div key={i} className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-indigo-300">Q{i + 1}: {ans.question}</span>
                  <Badge variant="success">{ans.score}% Score</Badge>
                </div>
                <p className="text-slate-300 bg-slate-900/80 p-2 rounded italic">"{ans.candidateAnswer}"</p>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-emerald-400 font-bold block mb-0.5">Strengths:</span>
                    <ul className="list-disc pl-4 text-slate-300 space-y-0.5">
                      {(ans.strengths || []).map((s, idx) => (
                        <li key={idx}>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-amber-400 font-bold block mb-0.5">Improvements:</span>
                    <ul className="list-disc pl-4 text-slate-300 space-y-0.5">
                      {(ans.improvements || []).map((imp, idx) => (
                        <li key={idx}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button onClick={() => navigate('/interviews')}>Return to Interviews Workspace</Button>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Question Card */}
          <Card className="border-indigo-500/30 bg-indigo-950/20 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-indigo-300 border-indigo-500/40 uppercase font-bold text-[10px]">
                Question {currentIdx + 1} of {questions.length} • {currentQuestion?.category}
              </Badge>
              <span className="text-xs font-semibold text-slate-400">Difficulty: {currentQuestion?.difficulty}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-100 leading-snug">
              "{currentQuestion?.question}"
            </h3>

            {currentQuestion?.whyAsked ? (
              <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded border border-slate-800">
                <strong className="text-indigo-400">Why Interviewer Asks This:</strong> {currentQuestion.whyAsked}
              </p>
            ) : null}
          </Card>

          {/* Candidate Answer Form */}
          <form onSubmit={handleSubmitAnswer} className="space-y-4">
            <Textarea
              label="Your Answer (Text Mock Session)"
              placeholder="Type your response here using the STAR method (Situation, Task, Action, Result)..."
              rows={6}
              value={answerText}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAnswerText(e.target.value)}
            />

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">
                AI will evaluate STAR structure, technical depth, and communication tone.
              </span>
              <Button type="submit" isLoading={submitAnswerMutation.isPending}>
                <Send className="h-4 w-4 mr-1.5" /> Submit Answer & Score
              </Button>
            </div>
          </form>

          {/* Feedback History for previous questions in session */}
          {(session.answers || []).length > 0 ? (
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Previous Evaluated Answers in Session</h4>
              {session.answers.map((ans, i) => (
                <Card key={i} className="p-4 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-200">Q{i + 1}: {ans.question}</span>
                    <Badge variant="success">{ans.score}%</Badge>
                  </div>
                  <p className="text-slate-300 bg-slate-950 p-2 rounded">{ans.candidateAnswer}</p>
                </Card>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
