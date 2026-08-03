import * as React from 'react';
import { PageHeader } from '../components/ui/page-header';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';

export function AtsFixtureLabPage() {
  const [selectedFixture, setSelectedFixture] = React.useState<'greenhouse' | 'lever' | 'ashby' | 'workable'>('greenhouse');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Form submitted in ATS Fixture Lab! (User-initiated)');
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <PageHeader
        title="ATS Form Fixture Lab"
        description="Local testing ground for Manifest V3 extension field detection and selective autofill."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'ATS Fixture Lab' }]}
        actions={
          <div className="flex gap-2">
            <Badge variant="outline" className="text-indigo-400 border-indigo-500/30">
              Extension Test Environment
            </Badge>
          </div>
        }
      />

      {/* Select ATS Fixture */}
      <div className="flex gap-2 border-b border-slate-800 pb-3">
        {(['greenhouse', 'lever', 'ashby', 'workable'] as const).map((fix) => (
          <Button
            key={fix}
            size="sm"
            variant={selectedFixture === fix ? 'primary' : 'outline'}
            onClick={() => setSelectedFixture(fix)}
            className="capitalize"
          >
            {fix} Form Sample
          </Button>
        ))}
      </div>

      {/* Fixture Form Container */}
      <Card className="p-6 border-slate-800 bg-slate-900/60 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              {selectedFixture} Application Form Fixture
            </h3>
            <p className="text-xs text-slate-400">Open SK JobPilot Extension popup to test detection on this page.</p>
          </div>
          <Badge variant="warning" className="text-[10px] uppercase font-bold">
            Simulated ATS Form
          </Badge>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="First Name" id="first_name" name="first_name" placeholder="Jane" required />
            <Input label="Last Name" id="last_name" name="last_name" placeholder="Doe" required />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Email Address" id="email" name="email" type="email" placeholder="jane.doe@example.com" required />
            <Input label="Phone Number" id="phone" name="phone" placeholder="+1 (555) 000-0000" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input label="LinkedIn URL" id="linkedin" name="linkedin_url" placeholder="https://linkedin.com/in/janedoe" />
            <Input label="GitHub URL" id="github" name="github_url" placeholder="https://github.com/janedoe" />
            <Input label="Portfolio / Website" id="portfolio" name="portfolio_url" placeholder="https://janedoe.dev" />
          </div>

          <Select
            label="Are you legally authorized to work in the United States?"
            id="work_auth"
            name="work_authorization"
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
          />

          <Select
            label="Will you now or in the future require visa sponsorship?"
            id="sponsorship"
            name="sponsorship_requirement"
            options={[
              { value: 'no', label: 'No' },
              { value: 'yes', label: 'Yes' },
            ]}
          />

          <Textarea label="Cover Letter / Additional Comments" id="cover_letter" name="cover_letter" rows={4} placeholder="Type or paste cover letter..." />

          {/* CAPTCHA Placeholder */}
          <div className="p-4 rounded border border-dashed border-amber-500/40 bg-amber-950/20 text-center space-y-1">
            <span className="text-xs font-bold text-amber-300 block">CAPTCHA Shield Verification (Simulated)</span>
            <span className="text-[11px] text-amber-400/80">
              Extension Safety Guard: Extension NEVER interacts with or fills CAPTCHA controls.
            </span>
          </div>

          <div className="pt-2 flex justify-end gap-2">
            <Button type="button" variant="outline">
              Clear Form
            </Button>
            <Button type="submit" variant="primary">
              User Final Submit
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
