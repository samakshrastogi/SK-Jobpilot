import { Routes, Route } from 'react-router-dom';
import { AppLayout } from '../layouts/app-layout';
import { DashboardPage } from '../pages/dashboard';
import { OnboardingPage } from '../pages/onboarding';
import { AutomationPage } from '../pages/automation';
import { ReviewQueuePage } from '../pages/review-queue';
import { DiscoverJobsPage } from '../pages/discover-jobs';
import { DiscoverySourcesPage } from '../pages/discovery-sources';
import { ApplicationsPage } from '../pages/applications';
import { ResumesPage } from '../pages/resumes';
import { NotFoundPage } from '../pages/not-found';

export function AppRoutes() {
  return <Routes><Route path="/" element={<AppLayout />}>
    <Route index element={<DashboardPage />} />
    <Route path="onboarding" element={<OnboardingPage />} />
    <Route path="automation" element={<AutomationPage />} />
    <Route path="review-queue" element={<ReviewQueuePage />} />
    <Route path="discover" element={<DiscoverJobsPage />} />
    <Route path="discovery-sources" element={<DiscoverySourcesPage />} />
    <Route path="applications" element={<ApplicationsPage />} />
    <Route path="resumes" element={<ResumesPage />} />
    <Route path="*" element={<NotFoundPage />} />
  </Route></Routes>;
}
