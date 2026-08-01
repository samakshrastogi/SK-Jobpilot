import { Loader2 } from 'lucide-react';

export interface LoadingStateProps {
  message?: string;
  height?: string;
}

export function LoadingState({ message = 'Loading contents...', height = 'h-64' }: LoadingStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 p-8 ${height}`}>
      <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-2" />
      <p className="text-xs font-medium text-slate-400">{message}</p>
    </div>
  );
}
