import { Compass, Home } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center p-6">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-4">
        <Compass className="h-8 w-8 animate-pulse" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-100 tracking-tight">404 - Page Not Found</h1>
      <p className="text-sm text-slate-400 max-w-md mt-2 mb-6">
        The application route you requested does not exist or has been moved in the SK JobPilot navigation tree.
      </p>
      <Button onClick={() => navigate('/')}>
        <Home className="h-4 w-4 mr-2" />
        Return to Command Center
      </Button>
    </div>
  );
}
