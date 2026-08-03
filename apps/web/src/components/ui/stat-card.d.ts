import * as React from 'react';
export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
}
export declare function StatCard({
  title,
  value,
  icon,
  trend,
  trendType,
  subtitle,
}: StatCardProps): React.JSX.Element;
//# sourceMappingURL=stat-card.d.ts.map
