import * as React from 'react';
import { Card } from './card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}

export function StatCard({
  title,
  value,
  icon,
  trend,
  trendType = 'positive',
  subtitle,
}: StatCardProps) {
  const trendColorClass =
    trendType === 'positive'
      ? 'text-emerald-400'
      : trendType === 'negative'
        ? 'text-rose-400'
        : 'text-slate-400';

  return (
    <Card className="relative overflow-hidden group hover:border-indigo-500/40 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform">
          {icon}
        </div>
      </div>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="text-2xl font-bold tracking-tight text-slate-100">{value}</span>
        {trend ? <span className={`text-xs font-semibold ${trendColorClass}`}>{trend}</span> : null}
      </div>
      {subtitle ? <p className="mt-1 text-xs text-slate-400">{subtitle}</p> : null}
    </Card>
  );
}
