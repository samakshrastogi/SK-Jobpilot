import * as React from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Play, Pause, RefreshCw, Clock, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { toast } from 'sonner';

export function AutomationPage() {
  const [isRunning, setIsRunning] = React.useState(false);
  const [isPaused, setIsPaused] = React.useState(false);

  const handleRunNow = () => {
    setIsRunning(true);
    toast.info('Triggering hourly discovery pipeline...');
    setTimeout(() => {
      setIsRunning(false);
      toast.success('Hourly discovery pipeline completed successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Automation Control Center"
        description="Monitor hourly job discovery runs, active target role query execution, and automation safety status."
        actions={
          <div className="flex gap-2">
            <Button size="sm" variant={isPaused ? 'primary' : 'outline'} onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play className="h-4 w-4 mr-1.5" /> : <Pause className="h-4 w-4 mr-1.5" />}
              {isPaused ? 'Resume Automation' : 'Pause Automation'}
            </Button>
            <Button size="sm" variant="primary" onClick={handleRunNow} disabled={isRunning}>
              <RefreshCw className={`h-4 w-4 mr-1.5 ${isRunning ? 'animate-spin' : ''}`} />
              Run Discovery Now
            </Button>
          </div>
        }
      />

      {/* Status Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Automation Status</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-100">{isPaused ? 'PAUSED' : 'ACTIVE'}</span>
            <Badge variant={isPaused ? 'warning' : 'success'}>{isPaused ? 'Paused' : 'Hourly Schedule'}</Badge>
          </div>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Execution Mode</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-100">Prepare & Review</span>
            <Badge variant="outline" className="text-indigo-300">Safety Guard</Badge>
          </div>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Next Hourly Run</span>
          <div className="flex items-center gap-1.5 text-xs text-slate-200 font-semibold mt-1">
            <Clock className="h-4 w-4 text-indigo-400" /> In 42 minutes
          </div>
        </Card>

        <Card className="p-4 border-slate-800 bg-slate-900/60">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Review Queue</span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-100">0 Items Pending</span>
            <Badge variant="outline" className="text-emerald-400">Clear</Badge>
          </div>
        </Card>
      </div>

      {/* Safety Policy Card */}
      <Card className="p-5 border-slate-800 bg-slate-900/60 space-y-3 text-xs">
        <div className="flex items-center gap-2 text-slate-100 font-bold border-b border-slate-800 pb-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" /> Automation Safety & Non-Fabrication Policy
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-400">
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-semibold block mb-1">Zero Fabrication</span>
            No candidate experience, skills, or metrics are fabricated.
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-semibold block mb-1">Protected Fields Safeguard</span>
            Legal declarations and sponsorship questions move to Review Queue.
          </div>
          <div className="p-3 rounded bg-slate-950 border border-slate-800">
            <span className="text-slate-200 font-semibold block mb-1">User Final Submit</span>
            Final application submission is performed by the user.
          </div>
        </div>
      </Card>
    </div>
  );
}
