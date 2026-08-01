import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700',
        primary: 'border border-indigo-500/30 bg-indigo-500/10 text-indigo-400',
        success: 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        warning: 'border border-amber-500/30 bg-amber-500/10 text-amber-400',
        danger: 'border border-rose-500/30 bg-rose-500/10 text-rose-400',
        info: 'border border-sky-500/30 bg-sky-500/10 text-sky-400',
        outline: 'border border-slate-600 text-slate-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
