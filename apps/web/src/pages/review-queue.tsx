import * as React from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ShieldAlert, CheckCircle2 } from 'lucide-react';

export function ReviewQueuePage() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      <PageHeader
        title="Application Review Queue"
        description="Review applications containing sensitive questions, legal declarations, or unconfirmed screening answers."
      />

      <Card className="p-8 border-slate-800 bg-slate-900/60 text-center space-y-3">
        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-emerald-600/20 text-emerald-400">
            <CheckCircle2 className="h-6 w-6" />
          </div>
        </div>
        <h3 className="text-sm font-bold text-slate-100">Review Queue is Clear!</h3>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          No applications are currently waiting for sensitive answer confirmation or legal declaration approval.
        </p>
      </Card>
    </div>
  );
}
