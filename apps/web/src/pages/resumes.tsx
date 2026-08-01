import { Plus, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const sampleResumes = [
  {
    id: 'res-1',
    title: 'Master Technical Resume - 2026',
    targetRole: 'Full Stack & AI Architect',
    version: 'v2.4',
    lastUpdated: '2026-07-30',
    isMaster: true,
    matchCount: 14,
  },
  {
    id: 'res-2',
    title: 'Tailored Resume - Stripe Architect',
    targetRole: 'Senior Frontend Architect',
    version: 'v1.0-Stripe',
    lastUpdated: '2026-07-28',
    isMaster: false,
    matchCount: 1,
  },
];

export function ResumesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Resume Workspace"
        description="Manage master profiles and AI-tailored resume variations tuned for specific job specs."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Resumes' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="uppercase font-bold tracking-wider text-[10px]">
              DEV SAMPLE DATA
            </Badge>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              Upload Resume
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {sampleResumes.map((res) => (
          <Card key={res.id} className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">{res.title}</h3>
                  {res.isMaster ? <Badge variant="primary">Master</Badge> : <Badge variant="outline">Tailored</Badge>}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">Target: {res.targetRole}</p>
              </div>
              <span className="text-xs font-mono text-slate-500">{res.version}</span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-800/80 pt-3">
              <span className="text-[11px] text-slate-500">Updated {res.lastUpdated}</span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  Edit Profile
                </Button>
                <Button size="sm" variant="secondary">
                  <Sparkles className="h-3.5 w-3.5 mr-1" /> Tailor
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
