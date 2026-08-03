import * as React from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ShieldAlert, CheckCircle2, ExternalLink, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { fetchReviewQueue, updateReviewQueueItem, type ReviewQueueItem } from '../services/onboarding.service';

export function ReviewQueuePage() {
  const [items, setItems] = React.useState<ReviewQueueItem[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [workingId, setWorkingId] = React.useState('');
  const refresh = React.useCallback(async () => { try { const response = await fetchReviewQueue(); setItems(response.data || []); } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not load review queue'); } finally { setIsLoading(false); } }, []);
  React.useEffect(() => { void refresh(); }, [refresh]);
  const decide = async (id: string, status: 'approved' | 'rejected') => { setWorkingId(id); try { await updateReviewQueueItem(id, status); toast.success(status === 'approved' ? 'Application approved for browser review' : 'Application rejected'); await refresh(); } catch (error) { toast.error(error instanceof Error ? error.message : 'Could not save decision'); } finally { setWorkingId(''); } };
  return <div className="space-y-6 max-w-5xl mx-auto pb-12"><PageHeader title="Application Review Queue" description="Review every AI-prepared application before final portal submission." />
    {isLoading ? <Card className="p-8 text-center text-sm text-slate-400">Loading review queue...</Card> : items.length ? <div className="space-y-4">{items.map((item) => { const job = item.jobId; const url = job?.applicationUrl || job?.sourceUrl; return <Card key={item.id} className="p-5 border-slate-800 bg-slate-900/60 space-y-4"><div className="flex items-start justify-between gap-4"><div><h3 className="font-bold text-slate-100">{job?.jobTitle || 'Job requires review'}</h3><p className="text-xs text-slate-400 mt-1">{job?.companyName || item.reason}</p></div><Badge variant={item.sensitiveFlag ? 'warning' : 'info'}>{item.confidence}% confidence</Badge></div><div className="rounded border border-slate-800 bg-slate-950 p-3 text-xs space-y-2"><p className="font-semibold text-slate-200">{item.reason}</p><p className="text-slate-400">{item.blockingQuestion}</p>{item.suggestedAnswer && <p className="text-indigo-300">{item.suggestedAnswer}</p>}</div><div className="flex flex-wrap gap-2">{url && <Button size="sm" variant="outline" onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}><ExternalLink className="h-3.5 w-3.5 mr-1.5" />Open application</Button>}<Button size="sm" variant="primary" disabled={workingId === item.id} onClick={() => void decide(item.id, 'approved')}><CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />Approve</Button><Button size="sm" variant="danger" disabled={workingId === item.id} onClick={() => void decide(item.id, 'rejected')}><XCircle className="h-3.5 w-3.5 mr-1.5" />Reject</Button></div></Card>; })}</div> : <Card className="p-8 border-slate-800 bg-slate-900/60 text-center space-y-3"><div className="flex justify-center"><div className="p-3 rounded-full bg-emerald-600/20 text-emerald-400"><CheckCircle2 className="h-6 w-6" /></div></div><h3 className="text-sm font-bold text-slate-100">Review Queue is Clear</h3><p className="text-xs text-slate-400">No AI-prepared applications are waiting for confirmation.</p></Card>}
    <div className="flex items-center gap-2 text-xs text-amber-300"><ShieldAlert className="h-4 w-4" />Approval permits browser-assisted review; it never bypasses the portal submit button.</div></div>;
}
