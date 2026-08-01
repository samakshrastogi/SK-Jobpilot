import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export function Drawer({ isOpen, onClose, title, children, side = 'right' }: DrawerProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        className={cn(
          'fixed inset-y-0 z-50 flex w-full max-w-md flex-col border-slate-800 bg-slate-900 p-6 text-slate-100 shadow-xl transition-transform duration-300 ease-in-out',
          side === 'right' ? 'right-0 border-l' : 'left-0 border-r'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          {title ? <h3 className="text-lg font-semibold text-slate-100">{title}</h3> : <div />}
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
