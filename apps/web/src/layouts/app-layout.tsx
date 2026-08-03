import * as React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Compass, Layers, Briefcase, FileText, ChevronLeft, ChevronRight, Menu, Radio, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/cn';
import { Badge } from '../components/ui/badge';
import { Drawer } from '../components/ui/drawer';
import { OnboardingGuard } from '../components/onboarding-guard';
import { useHealthQuery } from '../hooks/use-health';

const navItems = [
  { label: 'Overview', path: '/', icon: LayoutDashboard },
  { label: 'Jobs', path: '/discover', icon: Compass },
  { label: 'Review', path: '/review-queue', icon: ShieldAlert },
  { label: 'Applications', path: '/applications', icon: Briefcase },
  { label: 'Resume', path: '/resumes', icon: FileText },
  { label: 'Automation', path: '/automation', icon: Layers },
];

export function AppLayout() {
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const location = useLocation();
  const { data: healthData, isError: healthError } = useHealthQuery();
  const current = navItems.find((item) => item.path === location.pathname || (item.path !== '/' && location.pathname.startsWith(item.path)));

  const navigation = (mobile = false) => <nav className="space-y-1 p-3">{navItems.map((item) => {
    const Icon = item.icon;
    return <NavLink key={item.path} to={item.path} onClick={() => mobile && setMobileOpen(false)} className={({ isActive }) => cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors', isActive ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100')} title={collapsed ? item.label : undefined}><Icon className="h-4 w-4 shrink-0" />{(!collapsed || mobile) && <span>{item.label}</span>}</NavLink>;
  })}</nav>;

  return <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
    <aside className={cn('hidden md:flex flex-col border-r border-slate-800 bg-slate-900/90 transition-all', collapsed ? 'w-16' : 'w-60')}>
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        <div className="flex items-center gap-3 overflow-hidden"><div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 font-bold">SK</div>{!collapsed && <div><div className="text-sm font-bold">SK JobPilot</div><div className="text-[10px] text-indigo-400">JOB APPLICATION AGENT</div></div>}</div>
        <button type="button" onClick={() => setCollapsed((value) => !value)} className="h-7 w-7 rounded border border-slate-800 text-slate-400 hover:text-white">{collapsed ? <ChevronRight className="h-4 w-4 mx-auto" /> : <ChevronLeft className="h-4 w-4 mx-auto" />}</button>
      </div>
      <div className="flex-1 overflow-y-auto">{navigation()}</div>
      <div className="p-3 border-t border-slate-800"><div className={cn('flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/60 p-2.5', collapsed && 'justify-center')}><Radio className={cn('h-3.5 w-3.5', !healthError ? 'text-emerald-400' : 'text-rose-400')} />{!collapsed && <><span className="text-xs flex-1">{!healthError && healthData ? 'API connected' : 'API offline'}</span><Badge variant={!healthError ? 'success' : 'danger'}>{!healthError ? 'ON' : 'OFF'}</Badge></>}</div></div>
    </aside>

    <Drawer isOpen={mobileOpen} onClose={() => setMobileOpen(false)} side="left" title="SK JobPilot">{navigation(true)}</Drawer>

    <div className="flex flex-1 flex-col overflow-hidden">
      <header className="flex h-16 items-center border-b border-slate-800 bg-slate-900/60 px-4 md:px-6"><button type="button" onClick={() => setMobileOpen(true)} className="md:hidden mr-3 rounded p-2 text-slate-400 hover:bg-slate-800"><Menu className="h-5 w-5" /></button><h1 className="text-base font-bold">{current?.label || 'SK JobPilot'}</h1></header>
      <main className="flex-1 overflow-y-auto bg-slate-950 p-4 md:p-6 lg:p-8"><OnboardingGuard><Outlet /></OnboardingGuard></main>
    </div>
  </div>;
}
