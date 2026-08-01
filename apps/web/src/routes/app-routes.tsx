import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/app-layout';
import { DashboardPage } from '../pages/dashboard';
import { DiscoverJobsPage } from '../pages/discover-jobs';
import { SavedJobsPage } from '../pages/saved-jobs';
import { ApplicationsPage } from '../pages/applications';
import { ResumesPage } from '../pages/resumes';
import { InterviewsPage } from '../pages/interviews';
import { AgentActivityPage } from '../pages/agent-activity';
import { SettingsPage } from '../pages/settings';
import { NotFoundPage } from '../pages/not-found';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="discover" element={<DiscoverJobsPage />} />
        <Route path="saved-jobs" element={<SavedJobsPage />} />
        <Route path="applications" element={<ApplicationsPage />} />
        <Route path="resumes" element={<ResumesPage />} />
        <Route path="interviews" element={<InterviewsPage />} />
        <Route path="agent-activity" element={<AgentActivityPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
