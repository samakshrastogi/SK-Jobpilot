import { jsx as _jsx, jsxs as _jsxs } from 'react/jsx-runtime';
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
  return _jsx(Routes, {
    children: _jsxs(Route, {
      path: '/',
      element: _jsx(AppLayout, {}),
      children: [
        _jsx(Route, { index: true, element: _jsx(DashboardPage, {}) }),
        _jsx(Route, { path: 'discover', element: _jsx(DiscoverJobsPage, {}) }),
        _jsx(Route, { path: 'saved-jobs', element: _jsx(SavedJobsPage, {}) }),
        _jsx(Route, { path: 'applications', element: _jsx(ApplicationsPage, {}) }),
        _jsx(Route, { path: 'resumes', element: _jsx(ResumesPage, {}) }),
        _jsx(Route, { path: 'interviews', element: _jsx(InterviewsPage, {}) }),
        _jsx(Route, { path: 'agent-activity', element: _jsx(AgentActivityPage, {}) }),
        _jsx(Route, { path: 'settings', element: _jsx(SettingsPage, {}) }),
        _jsx(Route, { path: '*', element: _jsx(NotFoundPage, {}) }),
      ],
    }),
  });
}
//# sourceMappingURL=app-routes.js.map
