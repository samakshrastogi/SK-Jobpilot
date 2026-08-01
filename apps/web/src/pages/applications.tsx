import { Plus, Search } from 'lucide-react';
import { PageHeader } from '../components/ui/page-header';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';

const sampleApplications = [
  {
    id: 'app-101',
    jobTitle: 'Senior Frontend Architect',
    company: 'Stripe',
    status: 'interviewing',
    appliedDate: '2026-07-28',
    matchScore: 92,
  },
  {
    id: 'app-102',
    jobTitle: 'Staff TypeScript Developer',
    company: 'Linear App',
    status: 'tailoring',
    appliedDate: '2026-07-30',
    matchScore: 87,
  },
  {
    id: 'app-103',
    jobTitle: 'Principal Web Infrastructure Engineer',
    company: 'Cloudflare',
    status: 'applied',
    appliedDate: '2026-07-25',
    matchScore: 84,
  },
];

export function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Tracker"
        description="Monitor status, tailored documents, and follow-ups across your job application lifecycle."
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Applications' }]}
        actions={
          <div className="flex items-center gap-2">
            <Badge variant="warning" className="uppercase font-bold tracking-wider text-[10px]">
              DEV SAMPLE DATA
            </Badge>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1.5" />
              New Application
            </Button>
          </div>
        }
      />

      <div className="flex items-center gap-3">
        <div className="flex-1 max-w-sm">
          <Input placeholder="Search applications..." leftIcon={<Search className="h-4 w-4" />} />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Job Title & Company</TableHead>
            <TableHead>Match Score</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Applied Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sampleApplications.map((app) => (
            <TableRow key={app.id}>
              <TableCell>
                <div>
                  <div className="font-semibold text-slate-100">{app.jobTitle}</div>
                  <div className="text-xs text-slate-400">{app.company}</div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="primary">{app.matchScore}%</Badge>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    app.status === 'interviewing'
                      ? 'success'
                      : app.status === 'tailoring'
                      ? 'warning'
                      : 'default'
                  }
                  className="capitalize"
                >
                  {app.status}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-slate-400">{app.appliedDate}</TableCell>
              <TableCell className="text-right">
                <Button size="sm" variant="ghost">
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
