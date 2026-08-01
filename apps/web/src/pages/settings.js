import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
    return (_jsxs("div", { className: "space-y-6", children: [_jsx(PageHeader, { title: "Platform & AI Settings", description: "Configure local environment endpoints, discovery preferences, and AI model choices.", breadcrumbs: [{ label: 'Home', href: '/' }, { label: 'Settings' }], actions: _jsxs(Button, { size: "sm", children: [_jsx(Save, { className: "h-4 w-4 mr-1.5" }), "Save Configuration"] }) }), _jsxs("div", { className: "grid grid-cols-1 gap-6 md:grid-cols-2", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(Server, { className: "h-4 w-4 text-indigo-400" }), "API & Database Connections"] }), _jsx(CardDescription, { children: "Single-user local environment options." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Input, { label: "Backend API URL", defaultValue: "http://localhost:5000/api/v1" }), _jsx(Input, { label: "MongoDB Connection URI", defaultValue: "mongodb://127.0.0.1:27017/sk_job_pilot" }), _jsxs("div", { className: "rounded-lg border border-slate-800 bg-slate-950 p-3 flex items-center justify-between text-xs", children: [_jsx("span", { className: "text-slate-400", children: "Database Status:" }), _jsx(Badge, { variant: dbData?.data?.database === 'connected' ? 'success' : 'danger', children: dbData?.data?.database || 'disconnected' })] })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsxs(CardTitle, { className: "text-base flex items-center gap-2", children: [_jsx(Cpu, { className: "h-4 w-4 text-indigo-400" }), "AI Agent Model Configuration"] }), _jsx(CardDescription, { children: "Configure local or remote AI inference models." })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsx(Select, { label: "Selected Gemini Model", defaultValue: "gemini-3.6-flash", options: [
                                            { value: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (Recommended)' },
                                            { value: 'gemini-3.6-pro', label: 'Gemini 3.6 Pro' },
                                        ] }), _jsx(Input, { label: "Discovery Auto-Run Interval", defaultValue: "Every 6 hours" }), _jsx("div", { className: "rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-3 text-xs text-indigo-300", children: "Note: API keys are read securely from backend environment (`.env`) and never exposed to client side scripts." })] })] })] })] }));
}
//# sourceMappingURL=settings.js.map