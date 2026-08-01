import { Calendar, Sparkles } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';

const sampleInterviews = [
  {
    id: 'int-1',
    company: 'Stripe',
    jobTitle: 'Senior Frontend Architect',
    round: 'Round 2 - System Design & Architecture',
    scheduledAt: '2026-08-04T15:00:00Z',
    type: 'Technical',
    prepStatus: 'In Progress',
  },
  {
    id: 'int-2',
    company: 'Linear App',
    jobTitle: 'Staff TypeScript Developer',
    round: 'Round 1 - Technical Screen',
    scheduledAt: '2026-08-07T18:00:00Z',
    type: 'Technical',
    prepStatus: 'Not Started',
  },
];

export function InterviewsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Interview Preparation & Simulator"
        description="Prepare tailored company Q&A, system design cheat sheets, and AI mock interview simulations."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Interviews' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="uppercase font-bold tracking-wider text-[10px]">
              DEV SAMPLE DATA
            </Badge>
            <Button size="sm">
              <Sparkles className="h-4 w-4 mr-1.5" />
              Generate Prep Guide
            </Button>
          </div>
        }
      />

      <div className="space-y-4">
        {sampleInterviews.map((int) => (
          <Card key={int.id} className="space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-100">{int.company}</h3>
                  <Badge variant="info">{int.type}</Badge>
                </div>
                <p className="text-xs font-medium text-indigo-400 mt-0.5">{int.jobTitle}</p>
                <p className="text-xs text-slate-400 mt-1">{int.round}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold">
                    <Calendar className="h-3.5 w-3.5" /> Aug 04, 2026 at 3:00 PM
                  </div>
                  <Badge variant="warning" className="mt-1 text-[10px]">
                    Prep: {int.prepStatus}
                  </Badge>
                </div>
                <Button size="sm" variant="primary">
                  Launch Mock AI Simulator
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
