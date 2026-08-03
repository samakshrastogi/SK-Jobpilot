import * as React from 'react';
import {
  Compass,
  Plus,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Layers,
} from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Modal } from '../components/ui/modal';
import { LoadingState } from '../components/ui/loading-state';
import { ErrorState } from '../components/ui/error-state';
import { EmptyState } from '../components/ui/empty-state';
import {
  useDiscoverySourcesQuery,
  useCreateDiscoverySourceMutation,
  useRunDiscoverySourceMutation,
  useDiscoveryRunsQuery,
} from '../hooks/use-discovery';
import type { DiscoverySource } from '@sk-job-pilot/shared';
import { formatDate } from '@sk-job-pilot/shared';
import { toast } from 'sonner';

export function DiscoverySourcesPage() {
  const { data: sourcesResponse, isLoading, isError, refetch } = useDiscoverySourcesQuery();
  const { data: runsResponse } = useDiscoveryRunsQuery();

  const createMutation = useCreateDiscoverySourceMutation();
  const runMutation = useRunDiscoverySourceMutation();

  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [newSource, setNewSource] = React.useState<Partial<DiscoverySource>>({
    name: '',
    providerType: 'greenhouse',
    companyName: '',
    careersUrl: '',
    boardId: '',
  });

  if (isLoading) return <LoadingState message="Loading discovery sources..." />;
  if (isError) return <ErrorState title="Failed to load discovery sources" onRetry={refetch} />;

  const sources = sourcesResponse?.data || [];
  const runs = runsResponse?.data || [];

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSource.name || !newSource.companyName || !newSource.careersUrl) {
      toast.error('Please fill in Source Name, Company, and Board ID / Careers URL');
      return;
    }

    createMutation.mutate(newSource, {
      onSuccess: () => {
        toast.success('Discovery source created successfully!');
        setIsAddModalOpen(false);
        setNewSource({
          name: '',
          providerType: 'greenhouse',
          companyName: '',
          careersUrl: '',
          boardId: '',
        });
      },
      onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Failed to create source');
      },
    });
  };

  const handleRunSource = (id: string) => {
    runMutation.mutate(id, {
      onSuccess: (res) => {
        toast.success(`Discovery run finished! Discovered ${res.data?.jobsDiscovered || 0} jobs.`);
      },
      onError: (err: unknown) => {
        toast.error(err instanceof Error ? err.message : 'Discovery run failed');
      },
    });
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automated Job Discovery Sources"
        description="Configure public ATS connectors (Greenhouse, Lever, Ashby, Workable, RSS) and run compliant discovery tasks."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Discovery Sources' }]}
        actions={
          <Button size="sm" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Add Discovery Source
          </Button>
        }
      />

      {/* Sources Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-2">
          <Layers className="h-4 w-4" /> Configured Connectors ({sources.length})
        </h3>
        {sources.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sources.map((src) => (
              <Card key={src.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="uppercase font-bold text-[10px] text-indigo-400 border-indigo-500/30">
                    {src.providerType}
                  </Badge>
                  <Badge variant={src.enabled ? 'success' : 'outline'} className="text-[10px]">
                    {src.enabled ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>

                <div>
                  <h4 className="text-sm font-bold text-slate-100">{src.name}</h4>
                  <p className="text-xs text-slate-400">{src.companyName}</p>
                </div>

                <div className="text-[11px] font-mono text-slate-400 bg-slate-950 p-2 rounded border border-slate-800 truncate">
                  {src.boardId ? `Board ID: ${src.boardId}` : src.careersUrl}
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-2 text-xs">
                  <span className="text-[11px] text-slate-500">
                    {src.lastRunAt ? `Last run ${formatDate(src.lastRunAt)}` : 'Never run'}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRunSource(src.id)}
                    isLoading={runMutation.isPending && runMutation.variables === src.id}
                  >
                    <Play className="h-3.5 w-3.5 mr-1 text-emerald-400" /> Run Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No discovery sources added"
            description="Add your first Greenhouse, Lever, Ashby, or Workable board to start automated job discovery."
            icon={<Compass className="h-6 w-6 text-slate-400" />}
            actionLabel="Add Source"
            onAction={() => setIsAddModalOpen(true)}
          />
        )}
      </div>

      {/* Discovery Runs History Audit */}
      {runs.length > 0 ? (
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Clock className="h-4 w-4" /> Discovery Execution Runs ({runs.length})
          </h3>
          <Card className="p-4 space-y-3">
            <div className="space-y-2">
              {runs.slice(0, 5).map((run) => (
                <div key={run.id} className="flex items-center justify-between p-2.5 rounded bg-slate-950 border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    {run.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <XCircle className="h-4 w-4 text-rose-400" />
                    )}
                    <span className="font-bold text-slate-200 uppercase">{run.providerType} Run</span>
                    <Badge variant={run.status === 'completed' ? 'success' : 'danger'} className="text-[10px]">
                      {run.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                    <span>Discovered: <strong className="text-slate-200">{run.jobsDiscovered}</strong></span>
                    <span>Inserted: <strong className="text-emerald-400">{run.jobsInserted}</strong></span>
                    <span>Duration: {run.durationMs}ms</span>
                    <span>{formatDate(run.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      ) : null}

      {/* Add Source Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Automated Discovery Source"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateSource} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input
              label="Source Name (e.g. Stripe Greenhouse Board)"
              required
              value={newSource.name || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewSource({ ...newSource, name: e.target.value })
              }
            />
            <Input
              label="Company Name"
              required
              value={newSource.companyName || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewSource({ ...newSource, companyName: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Select
              label="Connector Provider Type"
              value={newSource.providerType || 'greenhouse'}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setNewSource({ ...newSource, providerType: e.target.value as any })
              }
              options={[
                { value: 'greenhouse', label: 'Greenhouse Public Board' },
                { value: 'lever', label: 'Lever Public Postings' },
                { value: 'ashby', label: 'Ashby Public Board' },
                { value: 'workable', label: 'Workable Public Widget' },
                { value: 'rss', label: 'RSS / Atom Feed' },
                { value: 'generic_html', label: 'Generic HTML Careers Page' },
              ]}
            />
            <Input
              label="Board Identifier or ID"
              placeholder="e.g. stripe or airbnb"
              value={newSource.boardId || ''}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewSource({ ...newSource, boardId: e.target.value })
              }
            />
          </div>

          <Input
            label="Careers Page URL / RSS Feed URL"
            required
            placeholder="https://..."
            value={newSource.careersUrl || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewSource({ ...newSource, careersUrl: e.target.value })
            }
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" isLoading={createMutation.isPending}>
              Create Source
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
