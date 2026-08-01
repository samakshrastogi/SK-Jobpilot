import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Compass, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
export function NotFoundPage() {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "flex min-h-[70vh] flex-col items-center justify-center text-center p-6", children: [_jsx("div", { className: "flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4", children: _jsx(Compass, { className: "h-8 w-8 animate-pulse" }) }), _jsx("h1", { className: "text-4xl font-extrabold text-slate-100 tracking-tight", children: "404 - Page Not Found" }), _jsx("p", { className: "text-sm text-slate-400 max-w-md mt-2 mb-6", children: "The application route you requested does not exist or has been moved in the SK JobPilot navigation tree." }), _jsxs(Button, { onClick: () => navigate('/'), children: [_jsx(Home, { className: "h-4 w-4 mr-2" }), "Return to Command Center"] })] }));
}
//# sourceMappingURL=not-found.js.map