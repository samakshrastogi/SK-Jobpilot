import { Save, Server, Cpu } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useDatabaseHealthQuery } from '../hooks/use-health';

export function SettingsPage() {
  const { data: dbData } = useDatabaseHealthQuery();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform & AI Settings"
        description="Configure local environment endpoints, discovery preferences, and AI model choices."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Settings' }]}
        actions={
          <Button size="sm">
            <Save className="h-4 w-4 mr-1.5" />
            Save Configuration
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Backend & Environment Connection Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Server className="h-4 w-4 text-indigo-400" />
              API & Database Connections
            </CardTitle>
            <CardDescription>Single-user local environment options.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input label="Backend API URL" defaultValue="http://localhost:5000/api/v1" />
            <Input label="MongoDB Connection URI" defaultValue="mongodb://127.0.0.1:27017/sk_job_pilot" />
            <div className="rounded-lg border border-slate-800 bg-slate-950 p-3 flex items-center justify-between text-xs">
              <span className="text-slate-400">Database Status:</span>
              <Badge variant={dbData?.data?.database === 'connected' ? 'success' : 'danger'}>
                {dbData?.data?.database || 'disconnected'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* AI & Agent Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Cpu className="h-4 w-4 text-indigo-400" />
              AI Agent Model Configuration
            </CardTitle>
            <CardDescription>Configure local or remote AI inference models.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select
              label="Selected Gemini Model"
              defaultValue="gemini-3.6-flash"
              options={[
                { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (Recommended)' },
                { value: 'gemini-3.6-pro', label: 'Gemini 3.6 Pro' },
              ]}
            />
            <Input label="Discovery Auto-Run Interval" defaultValue="Every 6 hours" />
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-indigo-300">
              Note: API keys are read securely from backend environment (`.env`) and never exposed to client side scripts.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
