import { Bot, RefreshCw } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const sampleLogs = [
  {
    id: 'log-1',
    timestamp: '2026-08-01 20:30:12',
    agentName: 'DiscoveryAgent',
    action: 'Scraped 42 new job postings from tech boards',
    status: 'success',
    details: 'Matched keywords: TypeScript, React, Node.js, AI, System Design.',
  },
  {
    id: 'log-2',
    timestamp: '2026-08-01 20:15:00',
    agentName: 'MatchingAgent',
    action: 'Vector similarity score calculation complete',
    status: 'success',
    details: 'Calculated 94% match vector for Anthropic Systems listing.',
  },
  {
    id: 'log-3',
    timestamp: '2026-08-01 19:45:22',
    agentName: 'TailorAgent',
    action: 'Resume customization generated',
    status: 'info',
    details: 'Generated custom accomplishments section for Senior Architect target.',
  },
];

export function AgentActivityPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Agent Execution Activity Log"
        description="Inspect background autonomous agent tasks, discovery scrapers, and matching pipeline executions."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Agent Activity' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="uppercase font-bold tracking-wider text-[10px]">
              DEV SAMPLE DATA
            </Badge>
            <Button size="sm" variant="outline">
              <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
              Refresh Logs
            </Button>
          </div>
        }
      />

      <div className="space-y-3">
        {sampleLogs.map((log) => (
          <Card key={log.id} className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-400" />
                <span className="text-xs font-bold text-indigo-300">{log.agentName}</span>
                <Badge variant={log.status === 'success' ? 'success' : 'info'} className="text-[10px] uppercase">
                  {log.status}
                </Badge>
              </div>
              <span className="text-[11px] font-mono text-slate-500">{log.timestamp}</span>
            </div>
            <p className="text-sm font-semibold text-slate-200">{log.action}</p>
            <p className="text-xs text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800">
              {log.details}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
