import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  Layers,
  BookmarkCheck,
  Briefcase,
  FileText,
  Video,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Menu,
  Bell,
  Search,
  Radio,
} from 'lucide-react';
import { cn } from '../lib/cn';
import { Badge } from '../components/ui/badge';
import { Drawer } from '../components/ui/drawer';
import { CommandPalette } from '../components/ui/command-palette';
import { useHealthQuery } from '../hooks/use-health';

const navItems = [
  { label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { label: 'Discover Jobs', path: '/discover', icon: Compass },
  { label: 'Discovery Sources', path: '/discovery-sources', icon: Layers },
  { label: 'Saved Jobs', path: '/saved-jobs', icon: BookmarkCheck },
  { label: 'Applications', path: '/applications', icon: Briefcase },
  { label: 'Resumes', path: '/resumes', icon: FileText },
  { label: 'Interviews', path: '/interviews', icon: Video },
  { label: 'ATS Fixture Lab', path: '/ats-fixture-lab', icon: Layers },
  { label: 'Agent Activity', path: '/agent-activity', icon: Bot },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function AppLayout() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const location = useLocation();
  const { data: healthData, isError: isHealthError } = useHealthQuery();

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentNav = navItems.find(
    (item) =>
      item.path === location.pathname ||
      (item.path !== '/' && location.pathname.startsWith(item.path))
  );

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden md:flex flex-col border-r border-slate-800/80 bg-slate-900/90 transition-all duration-300 relative z-20',
          isSidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold shadow-md shadow-indigo-600/30 flex-shrink-0">
              SK
            </div>
            {!isSidebarCollapsed ? (
              <div className="flex flex-col truncate">
                <span className="text-sm font-bold tracking-tight text-white">SK JobPilot</span>
                <span className="text-[10px] font-semibold tracking-wider text-indigo-400 uppercase">
                  AI Copilot
                </span>
              </div>
            ) : null}
          </div>
          <button
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            className="hidden md:flex h-7 w-7 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isSidebarCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-all group',
                    isActive
                      ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                  )
                }
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {!isSidebarCollapsed ? <span>{item.label}</span> : null}
              </NavLink>
            );
          })}
        </nav>

        {/* Sidebar Footer with Health Indicator */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/40">
          {!isSidebarCollapsed ? (
            <div className="rounded-lg border border-slate-800 p-2.5 bg-slate-900/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio
                  className={cn(
                    'h-3.5 w-3.5 animate-pulse',
                    !isHealthError ? 'text-emerald-400' : 'text-rose-400'
                  )}
                />
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    Backend API
                  </span>
                  <span className="text-xs font-medium text-slate-200">
                    {!isHealthError && healthData ? 'Connected' : 'Offline / Mock'}
                  </span>
                </div>
              </div>
              <Badge variant={!isHealthError ? 'success' : 'danger'}>
                {!isHealthError ? 'v1.0' : 'OFF'}
              </Badge>
            </div>
          ) : (
            <div className="flex justify-center" title="API Status">
              <Radio
                className={cn(
                  'h-4 w-4 animate-pulse',
                  !isHealthError ? 'text-emerald-400' : 'text-rose-400'
                )}
              />
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer Navigation */}
      <Drawer
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        side="left"
        title="SK JobPilot Menu"
      >
        <nav className="space-y-1.5 pt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                      : 'text-slate-300 hover:bg-slate-800'
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </Drawer>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-slate-800/80 bg-slate-900/60 px-4 md:px-6 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-100">
                {currentNav?.label || 'SK JobPilot'}
              </h2>
            </div>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {/* Search Trigger Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-1.5 text-xs text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Search jobs, skills...</span>
              <kbd className="hidden sm:inline-block rounded border border-slate-800 bg-slate-900 px-1.5 text-[10px] text-slate-400">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Button */}
            <button
              onClick={() => setIsNotificationsOpen(true)}
              className="relative rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:border-slate-700 hover:text-white transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-slate-950" />
            </button>
          </div>
        </header>

        {/* Scrollable Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-slate-950">
          <Outlet />
        </main>
      </div>

      {/* Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Notifications Drawer */}
      <Drawer
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        side="right"
        title="Notifications"
      >
        <div className="space-y-3 pt-2">
          <div className="rounded-lg border border-slate-800 bg-slate-950/80 p-3">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold mb-1">
              <Bot className="h-4 w-4" /> Discovery Agent
            </div>
            <p className="text-xs text-slate-300">
              New High-Match Senior TypeScript jobs discovered.
            </p>
            <span className="text-[10px] text-slate-400 mt-2 block">10 minutes ago</span>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
