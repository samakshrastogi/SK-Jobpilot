import * as React from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Play, Pause, RefreshCw, Clock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import {
  fetchAgentStatus,
  fetchAutomationConfiguration,
  fetchReviewQueue,
  runDiscoveryNow,
  updateAutomationConfiguration,
  type AgentStatus,
  type AutomationConfiguration,
} from '../services/onboarding.service';

export function AutomationPage() {
  const [config, setConfig] = React.useState<AutomationConfiguration | null>(null);
  const [reviewCount, setReviewCount] = React.useState(0);
  const [agentStatus, setAgentStatus] = React.useState<AgentStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isRunning, setIsRunning] = React.useState(false);

  const refresh = React.useCallback(async () => {
    try {
      const [configResponse, queueResponse, agentResponse] = await Promise.all([
        fetchAutomationConfiguration(), fetchReviewQueue(), fetchAgentStatus(),
      ]);
      setConfig(configResponse.data || null);
      setReviewCount(queueResponse.data?.length || 0);
      setAgentStatus(agentResponse.data || null);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not load automation status');
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => { void refresh(); }, [refresh]);

  const toggleAutomation = async () => {
    if (!config) return;
    try {
      const response = await updateAutomationConfiguration({ ...config, enabled: !config.enabled, autoSubmitSafeApplications: false });
      if (response.data) setConfig(response.data);
      toast.success(config.enabled ? 'Discovery automation paused' : 'Discovery automation resumed');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not update automation');
    }
  };

  const handleRunNow = async () => {
    setIsRunning(true);
    try {
      const response = await runDiscoveryNow();
      const result = response.data;
      if (result?.status === 'skipped') toast.warning(result.summary || 'Agent run skipped');
      else toast.success(`Agent completed: ${result?.prepared || 0} prepared, ${result?.skipped || 0} skipped`);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Discovery run failed');
    } finally {
      setIsRunning(false);
    }
  };

  return <div className="space-y-6 max-w-5xl mx-auto pb-12">
    <PageHeader title="Automation Control Center" description="Real discovery and application-preparation status for your selected roles." actions={<div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => window.location.assign('/discovery-sources')}>Sources</Button><Button size="sm" variant="outline" disabled={!config || isLoading} onClick={() => void toggleAutomation()}>{config?.enabled ? <Pause className="h-4 w-4 mr-1.5" /> : <Play className="h-4 w-4 mr-1.5" />}{config?.enabled ? 'Pause' : 'Resume'}</Button><Button size="sm" variant="primary" disabled={!config?.enabled || isRunning} onClick={() => void handleRunNow()}><RefreshCw className={`h-4 w-4 mr-1.5 ${isRunning ? 'animate-spin' : ''}`} />Run AI Agent Now</Button></div>} />

    <div className="grid md:grid-cols-4 gap-4">
      <StatusCard label="Automation" value={isLoading ? 'Loading…' : config?.enabled ? 'ACTIVE' : 'PAUSED'} badge={config?.frequency || 'unknown'} healthy={Boolean(config?.enabled)} />
      <StatusCard label="Latest agent run" value={agentStatus?.latestRun?.status?.toUpperCase() || 'NOT RUN'} badge={`${agentStatus?.latestRun?.prepared || 0} prepared`} healthy={agentStatus?.latestRun?.status !== 'failed'} />
      <StatusCard label="Daily target" value={`${config?.maxApplicationsPerDay || 0} jobs`} badge={`Min ${config?.minimumMatchScore || 0}%`} healthy />
      <StatusCard label="Review queue" value={`${reviewCount} pending`} badge={reviewCount ? 'Needs action' : 'Clear'} healthy={!reviewCount} />
    </div>

    <Card className="p-5 border-slate-800 bg-slate-900/60 space-y-3 text-xs">
      <div className="flex items-center gap-2 text-slate-100 font-bold"><ShieldCheck className="h-4 w-4 text-emerald-400" /> What automation does</div>
      <div className="grid md:grid-cols-3 gap-3 text-slate-400"><Policy title="Discover & rank">Runs enabled public ATS sources, deduplicates jobs, and ranks them for selected roles.</Policy><Policy title="Prepare applications">Analyzes matches and prepares factual resume/cover-letter material for review.</Policy><Policy title="Browser-assisted platforms">LinkedIn, Wellfound and authenticated sites require the extension, user review, and deliberate final submit.</Policy></div>
      {!config?.enabled && <div className="flex gap-2 text-amber-300"><AlertTriangle className="h-4 w-4" />Automation is paused; scheduled discovery will not run.</div>}
      <div className="flex items-center gap-1 text-slate-500"><Clock className="h-3.5 w-3.5" />Schedule: {config?.frequency || 'not loaded'}</div>
    </Card>
  </div>;
}

function StatusCard({ label, value, badge, healthy }: { label: string; value: string; badge: string; healthy: boolean }) {
  return <Card className="p-4 border-slate-800 bg-slate-900/60"><span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">{label}</span><div className="flex items-center justify-between gap-2"><span className="text-sm font-bold text-slate-100">{value}</span><Badge variant={healthy ? 'success' : 'warning'}>{badge}</Badge></div></Card>;
}

function Policy({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="p-3 rounded bg-slate-950 border border-slate-800"><span className="text-slate-200 font-semibold block mb-1">{title}</span>{children}</div>;
}