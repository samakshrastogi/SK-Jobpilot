import { Bot, RefreshCw, Cpu, Clock, DollarSign } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import { useAIActivityLogsQuery } from '../hooks/use-ai';
import { formatDate } from '@sk-job-pilot/shared';

export function AgentActivityPage() {
  const { data: logsResponse, isLoading, isError, refetch } = useAIActivityLogsQuery();

  if (isLoading) return <LoadingState message="Loading AI execution audit logs..." />;
  if (isError) return <ErrorState title="Failed to load AI activity logs" onRetry={refetch} />;

  const logs = logsResponse?.data || [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Execution Audit Logs"
        description="Inspect real-time server AI operations, provider models, execution duration, token usage, and cost metadata."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'AI Activity' }]}
        actions={
          <Button size="sm" variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
            Refresh Logs
          </Button>
        }
      />

      <div className="space-y-3">
        {logs.length > 0 ? (
          logs.map((log) => (
            <Card key={log.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                    {log.operationType.replace('_', ' ')}
                  </span>
                  <Badge
                    variant={
                      log.status === 'completed' || log.status === 'cached'
                        ? 'success'
                        : log.status === 'started'
                          ? 'info'
                          : 'danger'
                    }
                    className="text-[10px] uppercase font-bold"
                  >
                    {log.status}
                  </Badge>
                </div>
                <span className="text-[11px] font-mono text-slate-500">
                  {formatDate(log.createdAt)}
                </span>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1 font-semibold text-slate-200">
                  <Cpu className="h-3.5 w-3.5 text-indigo-400" /> Provider: {log.provider} (
                  {log.model})
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-slate-500" /> {log.durationMs}ms
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  <DollarSign className="h-3.5 w-3.5" /> Tokens: {log.totalTokenUsage} (Cost: $
                  {log.estimatedCostUsd.toFixed(6)})
                </span>
              </div>

              <p className="text-xs text-slate-300 font-mono bg-slate-950 p-2.5 rounded border border-slate-800">
                {log.safeErrorMessage || log.resultSummary || 'Operation executed successfully.'}
              </p>
            </Card>
          ))
        ) : (
          <EmptyState
            title="No AI executions recorded yet"
            description="Run a Candidate Analysis or Job Match operation to generate audit activity records."
            icon={<Bot className="h-6 w-6 text-slate-400" />}
          />
        )}
      </div>
    </div>
  );
}
