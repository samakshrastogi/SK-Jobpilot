import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
  return _jsxs('div', {
    className: 'space-y-6',
    children: [
      _jsx(PageHeader, {
        title: 'Agent Execution Activity Log',
        description:
          'Inspect background autonomous agent tasks, discovery scrapers, and matching pipeline executions.',
        breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Agent Activity' }],
        actions: _jsxs('div', {
          className: 'flex items-center gap-2',
          children: [
            _jsx(Badge, {
              variant: 'warning',
              className: 'uppercase font-bold tracking-wider text-[10px]',
              children: 'DEV SAMPLE DATA',
            }),
            _jsxs(Button, {
              size: 'sm',
              variant: 'outline',
              children: [_jsx(RefreshCw, { className: 'h-3.5 w-3.5 mr-1.5' }), 'Refresh Logs'],
            }),
          ],
        }),
      }),
      _jsx('div', {
        className: 'space-y-3',
        children: sampleLogs.map((log) =>
          _jsxs(
            Card,
            {
              className: 'p-4 space-y-2',
              children: [
                _jsxs('div', {
                  className: 'flex items-center justify-between',
                  children: [
                    _jsxs('div', {
                      className: 'flex items-center gap-2',
                      children: [
                        _jsx(Bot, { className: 'h-4 w-4 text-indigo-400' }),
                        _jsx('span', {
                          className: 'text-xs font-bold text-indigo-300',
                          children: log.agentName,
                        }),
                        _jsx(Badge, {
                          variant: log.status === 'success' ? 'success' : 'info',
                          className: 'text-[10px] uppercase',
                          children: log.status,
                        }),
                      ],
                    }),
                    _jsx('span', {
                      className: 'text-[11px] font-mono text-slate-500',
                      children: log.timestamp,
                    }),
                  ],
                }),
                _jsx('p', {
                  className: 'text-sm font-semibold text-slate-200',
                  children: log.action,
                }),
                _jsx('p', {
                  className:
                    'text-xs text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800',
                  children: log.details,
                }),
              ],
            },
            log.id
          )
        ),
      }),
    ],
  });
}
//# sourceMappingURL=agent-activity.js.map
