import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './button';

export interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Failed to load data',
  message = 'An unexpected error occurred. Please check your connection and try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-rose-900/40 bg-rose-950/20 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-900/30 text-rose-400 mb-3">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-rose-200">{title}</h3>
      <p className="text-xs text-rose-300/80 max-w-sm mt-1 mb-4">{message}</p>
      {onRetry ? (
        <Button
          size="sm"
          variant="outline"
          onClick={onRetry}
          className="border-rose-800 text-rose-300 hover:bg-rose-900/40"
        >
          <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
          Retry
        </Button>
      ) : null}
    </div>
  );
}
